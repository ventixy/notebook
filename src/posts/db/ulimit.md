---
article: true
date: 2025-05-20
category:
  - Database
  - MySQL
tag:
  - Database
  - MySQL
  - ulimit
shortTitle: MySQL5.7内存异常
title: MySQL5.7在compose部署时内存异常Bug
order: 30
---


### Bug 描述

在使用 `Docker Compose（version v2.35.1）` 部署 `MySQL 5.7` 时，发现我16G的内存几乎被耗尽，通过 `docker stats`命令查看，发现MySQL5.7对应的容器占用了几乎所有的内存。
尝试通过 `docker run` 来部署结果也一样 (`docker version: 28.1.1`)

不死心的我于是通过限制资源，在`docker-compose.yml`中添加了内存大小限制，内容如下：

```yaml
    deploy:
      resources:
        limits:
          memory: 2G
```
但接下来问题更离谱了，MySQL5.7对应的容器甚至不能正常启动了，一直不断重启，通过 `docker compose logs mysql57` 查看日志，内容如下：

```bash
mysql5_7  | 2025-05-20 14:56:41+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 5.7.32-1debian10 started.
mysql5_7  | 2025-05-20 14:56:43+00:00 [ERROR] [Entrypoint]: mysqld failed while attempting to check config
mysql5_7  |     command was: mysqld --verbose --help
```

看起来似乎是因为配置文件的问题，但实际上并没有那么简单。在不联网搜索的情形下询问过多个大模型均不能给出正确答案，只有 Gemini 2.5 Pro 选中联网搜索时，找到了相关的信息。其实通过普通搜索引擎也能找到答案，不少人都遇到过类似的问题。

---


### 内存异常原因

通过GitHub Issue 以及各类技术博客的求索，最终发现解决方法为：调整容器的 `ulimit` 配置，特别是 `nofile`（最大打开文件描述符数）限制。

在 `docker-compose.yml` 文件中为 MySQL 5.7 服务明确地配置一个合理的 `ulimits` 值。

```yaml
    # ... 其他配置，如 ports, volumes, environment ...
    ulimits:
      nproc: 65535  # 建议的进程数限制
      nofile:
        soft: 65536 # 建议的nofile软限制
        hard: 65536 # 建议的nofile硬限制
    # ...
```

::: info `ulimit` 配置建议
  * `nofile`：软限制 (soft) 和硬限制 (hard) 均建议从 `65536` 开始尝试。社区中的成功案例表明，此范围通常能有效解决问题。根据具体需求和系统能力，此值可在 20000 至 100000+ 之间调整。关键在于提供一个明确且合理的值，避免继承可能存在问题的系统默认值。
  * `nproc`：用户最大进程数限制，通常设置为 `65535` 已能满足绝大多数应用场景。
:::

然后重新部署：`docker compose down -v && docker compose up -d` ，果然一切正常了。

但是问题来了，为什么呢？ulimit 是什么？有什么用呢？

---


### `ulimit`与内存

`ulimit` 常用于控制进程可使用的系统资源。对于数据库服务而言，`nofile` 参数尤为重要，因为它直接影响到数据库能够管理的并发连接数和打开的文件数量。

* **`docker compose` 与 `docker run` 在 `ulimit` 上的默认行为差异**：
    `docker run` 命令允许通过 `--ulimit` 参数直接为单个容器设置 `nofile` 等限制，例如 `--ulimit nofile=65536:65536`。如果未显式指定，容器通常会继承 Docker 守护进程的 `ulimit` 设置  
    `docker compose` 则在其 YAML 配置文件中通过 `ulimits` 块来为服务定义资源限制。若 `docker-compose.yml` 文件中没有为 MySQL 服务明确定义 `ulimits`，容器同样会继承 Docker 守护进程的默认值。

* **==`nofile`== 值过高的“陷阱”**：
     GitHub 上著名的 [docker-library/mysql#579](https://github.com/docker-library/mysql/issues/579) Issue，揭示了问题的核心：在某些操作系统环境（如 Arch Linux）或特定 Docker 版本下，容器可能继承一个**异常高**的 `nofile` 默认值（例如，高达 $2^{30}$，即 1073741816）。实践表明，MySQL 5.7 在面对如此巨大的 `nofile` 上限时，其内部的某些内存管理或资源分配机制可能会出现异常，导致内存使用量急剧上升且无法有效释放。

---

### containerd

也有人提出该问题与 Docker 底层容器运行时 `containerd` 的版本更新有密切关联。

自 `containerd` 1.5.10 版本左右开始，由于其自身或其依赖的 Go 语言运行时（特别是 Go 1.19+）对 `RLIMIT_NOFILE`（即 `nofile` 的底层表示）硬限制的处理方式进行了调整，可能导致容器继承一个非常高的 `nofile` 硬限制，并且软限制也随之被拉高至与硬限制相同的值。这意味着，即使用户并未主动修改系统或 Docker 的 `ulimit` 配置，仅仅是 Docker Engine 或 `containerd` 的一次常规升级，就可能使得先前运行正常的 MySQL 5.7 + Docker Compose 配置因 `nofile` 值过高而突然出现内存异常。

相关的深入讨论和问题追踪可见于 [containerd/containerd#6707](https://github.com/containerd/containerd/issues/6707)  和 [containerd/containerd#8249](https://github.com/containerd/containerd/issues/8249)。


---





### 内存泄漏BUG

虽然调整 `ulimit nofile` 是解决 MySQL 5.7 在 Docker Compose 中内存异常的关键，但在某些情况下，问题可能是多因素叠加的结果，或者即便 `ulimit` 配置合理后，仍有进一步优化内存使用的空间。

MySQL 官方的 BUG 追踪系统也记录了一些与 MySQL 5.7 内存使用相关的已知问题，这些 BUG 可能在特定条件下被触发或加剧：

  * **([https://bugs.mysql.com/bug.php?id=83047](https://bugs.mysql.com/bug.php?id=83047))** ：此 BUG 报告描述了 InnoDB 存储引擎在特定工作负载下（如大量写入或大事务）可能出现内存逐渐增长，最终导致服务器因内存耗尽而停止服务的情况。报告中提及，通过切换到 `jemalloc` 内存分配库可以有效缓解此问题，这间接指向了 MySQL 5.7 默认使用的 glibc 内存分配器可能存在的效率问题或与特定场景的不兼容。
  * **([https://bugs.mysql.com/bug.php?id=97935](https://bugs.mysql.com/bug.php?id=97935))** ：该 BUG 指出，当客户端频繁连接和断开，并且在会话中执行了对 `information_schema` 的查询（包括MySQL内部执行的 `SHOW GLOBAL STATUS` 命令，因其会查询 `information_schema.global_status`）时，MySQL 5.7.28 及相近版本会出现内存泄漏。内存分配被追踪到 `mysql_socket_vio_new` 相关调用栈。由于 `information_schema` 的实现在 MySQL 8.0 中已被重写，该 BUG 对 5.7 版本被标记为“不会修复 (Won't fix)”。

---


### 内存分配优化

1. 默认内存分配器 (glibc) 的局限性:

MySQL 5.7 通常依赖操作系统提供的标准 C 库（glibc）中的 ptmalloc 作为其默认内存分配器。然而，在某些高并发、长连接或特定内存分配与释放模式下，glibc ptmalloc 可能会产生==内存碎片==（Memory Fragmentation）。这意味着即使应用逻辑上已经释放了内存，由于碎片的存在，操作系统层面看到的进程常驻内存集合大小 (RSS) 可能依然居高不下，甚至持续增长。

2. Performance Schema 的内存占用

MySQL Performance Schema 是一个强大的用于监控服务器内部执行细节的工具。但启用 Performance Schema 会消耗额外的内存资源来存储收集到的性能数据、元数据以及内部数据结构。在内存资源受限的 Docker 容器环境中，这部分开销可能变得尤为显著。

**优化建议**：如果对 MySQL 的详细内部性能监控需求不高，或者内存压力较大，可以考虑禁用 Performance Schema。这通常可以通过在 `docker-compose.yml` 的 `command` 字段中为 `mysqld` 添加启动参数 `--performance_schema=0` 来实现。

```yaml
    command:
      - mysqld
      - --performance_schema=0
      # - 其他 mysqld 启动参数可以继续添加在此
```

3. MySQL 内部配置参数的审视与调优

合理的 MySQL 内部参数配置对于控制内存占用同样至关重要。以下是一些关键参数：

  * `innodb_buffer_pool_size`：这是 InnoDB 存储引擎最重要的内存组件，用于缓存数据和索引。在容器环境中，应根据为容器分配的内存上限来设定此值，一个常见的经验法则是将其设置为容器可用内存的 **50%-70%** 。设置过大可能导致容器 OOM，过小则影响性能。
  * `max_connections`：定义了 MySQL 服务器允许的最大并发客户端连接数。每个连接都会消耗服务器的一定内存资源。应根据应用的实际并发量和容器的内存限制来审慎设置此值，避免远超实际需求，默认的 `151` 可能对某些轻量级应用过高。
  * `query_cache_size` 和 `query_cache_type`：查询缓存在 MySQL 5.7 中已被官方标记为废弃（deprecated），并在 MySQL 8.0 中被彻底移除。在高并发写入场景下，查询缓存很容易成为性能瓶颈，并且其内存管理也可能不够高效。强烈建议在 MySQL 5.7 中将其**彻底禁用** (将 `query_cache_size` 和 `query_cache_type` 均设置为 `0`) 。
  * 其他参数：如 `table_open_cache`、`table_definition_cache`（与打开文件描述符相关）、`thread_cache_size`、`key_buffer_size`（若主要使用 InnoDB，可设较小值，如 8M-16M）以及各种会话级缓冲区（如 `read_buffer_size`, `sort_buffer_size`, `join_buffer_size` 等）都应根据实际工作负载和容器资源进行审慎配置，避免不必要的内存浪费。

---


### 内存分配器

高级优化：采用替代内存分配器 (jemalloc / TCMalloc):

鉴于默认 glibc ptmalloc 可能存在的内存碎片和效率问题，更换为更先进的内存分配器（如 `jemalloc` 或 Google 的 `TCMalloc`）是一个有效的进阶优化手段。`jemalloc` 因其在减少内存碎片和提升高并发环境下内存分配性能方面的优异表现，尤其被广泛推荐用于改善 MySQL 的内存使用效率和稳定性。

**实施方法**：在 Docker 环境中，这通常通过构建一个自定义的 Docker 镜像来实现。以 `jemalloc` 为例，可以在官方 `mysql:5.7` 镜像（通常基于 Debian/Ubuntu）的基础上，安装 `libjemalloc1` 包，然后通过 `LD_PRELOAD` 环境变量在 MySQL 服务器启动前预加载 `jemalloc` 的共享库。

::: important Dockerfile for `mysql:5.7` with `jemalloc`

```dockerfile
# Dockerfile for mysql:5.7 with jemalloc
FROM mysql:5.7

# Install jemalloc (libjemalloc1 for Debian/Ubuntu based images)
# The path /usr/lib/x86_64-linux-gnu/libjemalloc.so.1 is common for jemalloc v1 on Debian.
# Verify the exact path if issues arise; it might be libjemalloc.so.2 for newer versions of the lib.
RUN apt-get update && \
    apt-get install -y libjemalloc1 && \
    rm -rf /var/lib/apt/lists/*

# Set LD_PRELOAD to use jemalloc for all processes started by this image's entrypoint/cmd.
# Ensure the path to libjemalloc.so.1 is correct for the base image.
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.1
```
:::

构建此自定义镜像后（例如，`docker build -t my-mysql57-jemalloc .`），在 `docker-compose.yml` 文件中将 `image` 指令指向这个新构建的镜像名即可。

---

### 升级 MySQL 版本

如果业务应用的兼容性允许，并且没有特定的历史原因或依赖必须坚守 MySQL 5.7，那么**升级到 MySQL 8.0 或更高版本**通常是解决此类内存问题的最彻底和最具前瞻性的方案。

目前MySQL 8.0 在相同的 Docker Compose 环境下没有出现类似的内存异常问题。这得益于 MySQL 8.0 在内存管理机制、`information_schema` 的实现效率、Performance Schema 的默认行为和资源消耗等方面均有显著的改进和重写。例如，前述的 Bug \#97935（`information_schema` 内存泄漏）在 MySQL 8.0 中因该组件的重写而自然解决。

-----

### 关键参考信息

以下列出与本文讨论内容高度相关的 MySQL 官方 BUG 报告和 GitHub Issue 链接：

  * **MySQL Bugs**:

      * [Bug \#83047: Memory usage gradually increases and brings server to halt](https://bugs.mysql.com/bug.php?id=83047) (描述了 InnoDB 内存持续增长问题，并提及 `jemalloc` 作为缓解方案)
      * [Bug \#97935: Memory leak in client connection using information\_schema](https://bugs.mysql.com/bug.php?id=97935) (指出了 MySQL 5.7.28 在特定 `information_schema` 查询下的内存泄漏，该问题在 5.7 版本中不会修复)

  * **GitHub Issues (Docker & `containerd` 相关)**:

      * [docker-library/mysql\#579: Really high memory usage](https://github.com/docker-library/mysql/issues/579) (核心讨论区，详细记录了 `ulimit nofile` 设置过高导致 MySQL 5.7 内存异常的发现过程和解决方案) 
      * [containerd/containerd\#6707: 1.5.10 causes memory leak in mysql container](https://github.com/containerd/containerd/issues/6707) (指出了 `containerd` 版本升级（特别是 1.5.10）如何改变了 `LimitNOFILE` 的默认行为，进而引发了 MySQL 容器的内存问题)
      * [containerd/containerd\#8249: RLIMIT\_NOFILE soft limit is raised implicitly to hard limit since Go 1.19](https://github.com/containerd/containerd/issues/8249) (深入探讨了 Go 语言版本更新对 `containerd` 处理 `RLIMIT_NOFILE` 行为的影响，是理解 `nofile` 值变化的深层原因) 
      * [containerd/containerd\#7566: Revert commit that changed LimitNOFILE to infinity to avoid regressions](https://www.google.com/search?q=https://github.com/containerd/containerd/pull/7566) (相关的 Pull Request 和社区关于回退 `LimitNOFILE` 默认值为 `infinity` 的讨论)
      * [Gist ae6d6c903b790e5dae91c339c1ce2ba8 by vicenterusso: Docker Compose fix for MySQL memory leak on Fedora](https://gist.github.com/vicenterusso/ae6d6c903b790e5dae91c339c1ce2ba8) (提供了一个具体的 `docker-compose.yml` 中 `ulimits` 配置示例，用于解决 Fedora 等系统上的 MySQL 内存泄漏问题) 
      * [cBioPortal/cbioportal\#10523: mySQL memory leak using docker compose on Rocky Linux 9.3](https://github.com/cBioPortal/cbioportal/issues/10523) (展示了在具体项目中如何通过调整 `ulimits` 来解决 MySQL 内存泄漏问题) 
      * [lando/lando\#3523: Mysql container hogs memory](https://github.com/lando/lando/issues/3523) (另一个指向 `ulimit` 和 `containerd` 问题的社区案例)



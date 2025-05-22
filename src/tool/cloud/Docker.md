---

order: 1
title:  Docker
shortTitle: docker

---


## Docker的基础使用

### Docker的安装

不同的Linux发行版中Docker的安装方式略有不同：

::: tabs 

@tab:active CentOS7/Rocky8

安装docker之前需要确保已配置可用的yum镜像源，参照：[CentOS的YUM源配置](/tool/Linux/setting.md#centos7yum源)

**Uninstall old versions**：

```shell
yum remove docker docker-client docker-client-latest docker-common docker-latest \
           docker-latest-logrotate docker-logrotate docker-engine
```

**install using the repository** :

```shell
yum install -y yum-utils

#Set up the repository    `ls /etc/yum.repos.d/`
yum-config-manager --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    
# centos7 install
yum makecache fast && yum install -y docker-ce docker-ce-cli containerd.io 
# rocky8 install
yum install -y docker-ce --allowerasing

#start
systemctl start docker && systemctl enable docker

docker version
```

---

**安装指定版本docker**

找到所有可用docker版本列表
```bash
yum list docker-ce --showduplicates | sort -r
```
安装指定版本，用上面的版本号替换`<VERSION_STRING>`
```
yum install docker-ce-<VERSION_STRING>.x86_64 docker-ce-cli-<VERSION_STRING>.x86_64 containerd.io
```

例如：
```bash
yum install docker-ce-3:20.10.5-3.el7.x86_64 docker-ce-cli-3:20.10.5-3.el7.x86_64 containerd.io
```
注意加上 `.x86_64` 大版本号


@tab Ubuntu
参照 docker 官网安装教程：https://docs.docker.com/engine/install/ubuntu/ 

Ubuntu通常不使用root用户，所以很多命令都需要加sudo来执行，为了方便使用docker命令，建议将当前用户加入docker用户组：
```bash
sudo usermod -aG docker $USER
```
执行命令后需要重启Ubuntu才能生效
:::


---


### 配置镜像加速

1. 配置代理的方式（本机使用Clash并开启`LAN`）：Docker 配置代理，编辑代理配置文件：

```bash
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo vim /etc/systemd/system/docker.service.d/http-proxy.conf

# 添加下面内容（clash）
[Service]
Environment="HTTP_PROXY=http://192.168.43.62:7897"
Environment="HTTPS_PROXY=http://192.168.43.62:7897"
Environment="NO_PROXY=localhost,127.0.0.1,192.168.0.0/16,172.17.16.0/20"

# 重启Docker
sudo systemctl daemon-reload && sudo systemctl restart docker
```

v2ray代理的添加：
```bash
Environment="HTTP_PROXY=http://192.168.43.62:10808"
Environment="HTTPS_PROXY=http://192.168.43.62:10808"
```

---

2. **在线配置镜像加速**（越来越难找到能用的了）:  [阿里云镜像加速说明](https://help.aliyun.com/zh/acr/user-guide/accelerate-the-pulls-of-docker-official-images)

```bash
# 确保存在 `/etc/docker` 目录，若不存在先创建：
sudo mkdir -p /etc/docker && sudo touch /etc/docker/daemon.json

sudo tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": [
        "https://docker.m.daocloud.io",
        "https://docker.1ms.run"
    ],
    "exec-opts": ["native.cgroupdriver=systemd"]
}
EOF
```

配置好后，重启Docker即可：
```bash
sudo systemctl daemon-reload && sudo systemctl restart docker
```

镜像加速网站：[毫秒镜像](https://www.mliev.com/docs/1ms.run/config-mirror)，[public-image-mirror](https://github.com/DaoCloud/public-image-mirror)

---

其他可能可用的地址：
```bash
tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": [
        "https://dytt.online",
        "https://func.ink",
        "https://docker.linkedbus.com",
        "https://lispy.org",
        "https://rsbud4vc.mirror.aliyuncs.com",
        "https://registry.cn-hangzhou.aliyuncs.com",
        "https://akchsmlh.mirror.aliyuncs.com",
        "https://2epe3hl0.mirror.aliyuncs.com",
        "https://k7wsl2ss.mirror.aliyuncs.com"
    ],
    "exec-opts": ["native.cgroupdriver=systemd"]
}
EOF
```





### Docker基础命令

[Docker官网—常用命令](https://docs.docker.com/engine/reference/commandline/docker/) 

```shell
docker version
docker info

# 列出所有运行中的容器的资源使用情况（CPU,内存）, 
# 默认情况下，docker stats 会持续更新数据，加上--no-stream选项可以只获取一次数据然后退出
docker stats --no-stream

# 查看ocker使用的不同类型的资源所占用的空间
docker system df

docker xxx  --help     # 命令
```




### Docker镜像

Docker镜像是由基础环境+软件构成的 （例如 ：redis的完整镜像应该是： linux系统 + redis软件）

```bash
# 查看本地主机上的所有镜像
docker images      

# 查看指定镜像的具体信息
docker container inspect 容器名     # 等同于 docker inspect 容器
# 获取容器/镜像的元数据
docker inspect NAME|ID

# 重命名
docker tag 原镜像:标签 新镜像名:标签 
docker tag 860c279d2fec 新镜像名:标签
```

搜索和下载镜像：
```bash
docker search xxx                   # 搜索镜像：如 mysql,redis......
docker search ventixy.us.kg/redis   # 加速搜索

# 下载镜像 默认为最新版本
docker pull xxx                    
docker pull redis                   # 等同于docker pull redis:latest
docker pull mysql:5.7               # 可指定docker官网可查询到的版本
```

删除镜像：
```bash
docker rmi redis:7.4.1
docker rmi -f imageID                    #根据镜像ID删除镜像
docker rmi -f $(docker images -aq)       #删除所有镜像

docker image prune   # 移除游离镜像 dangling：游离镜像（没有镜像名字的）

```


### Docker容器管理

要创建容器，必须先下载镜像。从镜像创建容器，有两个命令：`docker run`的立即启动，`docker create`得稍后自己手动启动

```shell
docker ps -a                    # 查看运行中的容器（-a查看全部，-q只显示id）
docker top container_id         # 查看指定容器中的进程信息

# 创建一个新的容器并运行一个命令
docker run xxx
# 启动并进入容器（使用exit停止并退出，也可以使用Ctrl+P+Q不停止退出）
docker run -it centos /bin/bash 
#【问题】发现centos停止了！？原因：docker容器使用后台运行必须要有一个前台进程
docker run -d centos            
```

从镜像创建容器后，后续再次启动需要执行`docker start`, 停止和重启等参照：

```bash
docker start   container_id     #启动容器
docker stop    container_id     #停止正在运行的容器（优雅停机）
docker kill    container_id     #强制停止正在运行的容器（kill是强制kill -9，约等于直接拔电源）
docker restart container_id     #重启容器
```

删除容器（不能删除正在运行的容器，如需强制删除需添加-f）：
```bash
docker rm 86fe3bcb173e          # 删除指定id的容器
docker rm -f $(docker ps -aq)   # 删除全部容器
```



### 容器内部操作
docker exec ：在运行的容器中执行命令

```bash
docker exec -it <container ID> /bin/bash      # 进入容器内部

# 以特权方式进入容器 （0表示用户）
docker exec -it -u 0:0 --privileged container_id /bin/bash  

exit             # 退出container (或者使用Ctrl + D)
```

容器内部操作示例：更改容器内系统的root密码
```bash
docker exec -it <MyContainer> bash            # 进入后修改
root@MyContainer:/# passwd
Enter new UNIX password:
Retype new UNIX password:
```


---


### 数据持久化

Docker 主要提供两种将数据持久化到宿主机的方式：

1.  **命名卷 (Named Volumes)**:
    *   **特点**: 由 Docker 创建和管理，并赋予一个明确的名称。存储在宿主机文件系统的一个特定区域（通常是 `/var/lib/docker/volumes/` 在 Linux 上），但其具体位置对用户是透明的。
    *   **核心用途**: **推荐用于持久化由容器内部进程管理和写入的数据，如数据库文件、应用程序生成的日志、用户上传内容等。**
    *   **优点**: Docker 管理、可移植性高、通常性能更好（尤其在 macOS/Windows）、权限处理相对简单。

2.  **绑定挂载 (Bind Mounts)**:
    *   **特点**: 将宿主机上的一个现有文件或目录直接映射到容器内的一个路径。用户完全控制宿主机上的路径。
    *   **核心用途**: **推荐用于将宿主机上的配置文件、源代码（尤其是在开发环境）、或特定的工具/证书等由宿主机直接管理和编辑的内容提供给容器。**
    *   **缺点**: 强依赖宿主机目录结构、权限问题（UID/GID不匹配）常见且处理复杂、在 macOS/Windows 上性能可能较低。

**选择原则总结:**

| 特性         | 命名卷 (Named Volumes)                               | 绑定挂载 (Bind Mounts)                                 |
| :----------- | :--------------------------------------------------- | :----------------------------------------------------- |
| **管理方**   | Docker                                               | 用户/宿主机                                            |
| **位置**     | Docker 管理的特定区域 (对用户透明)                     | 用户指定的宿主机绝对路径                               |
| **主要用途** | **应用数据 (数据库, 日志, 上传文件)**                  | **配置文件, 源代码, 宿主机工具/文件**                  |
| **可移植性** | 高                                                   | 低 (依赖宿主机路径)                                    |
| **权限处理** | Docker 通常处理较好                                    | **复杂，易出错，需手动匹配 UID/GID**                   |

---

### Docker Volumes

Docker 数据卷（Volumes）是一种管理容器数据的机制，它允许你在宿主机和容器之间持久化数据、共享数据，并且可以独立于容器生命周期之外进行管理。数据卷是 Docker 推荐的持久化数据的方式，提供了比直接在容器文件系统上存储数据或使用绑定挂载（Bind Mounts）更好的灵活性、性能和管理性。

- **持久性**：即使创建它的容器被删除，数据仍然存在。这是数据卷的核心价值。
- **共享性**：可以在多个运行中或停止的容器间安全地共享数据。
- **性能**：由于数据卷绕过了容器的可写层（通常是联合文件系统 UnionFS），直接在宿主机文件系统上进行操作，因此具有更好的读写性能，尤其是在写密集型应用中。
- **隔离性**：每个数据卷都是相互独立的，一个容器中的操作不会影响到其他容器的数据卷（除非明确共享）。
- **Docker 管理**: 由 Docker CLI 或 API 进行管理，方便创建、列出、检查、删除和备份。
- **驱动支持**: 数据卷可以使用不同的驱动程序，允许将数据存储在远程主机或云存储上。

---

**常用命令**

```bash
# 列出所有的数据卷
docker volume ls

# 查看数据卷的详细信息（包括所在位置,即挂载点Mountpoint）
docker volume inspect <volume_name>

# 创建一个命名数据卷
docker volume create <volume_name>

# 删除所有未使用（未被任何容器挂载）的数据卷 (谨慎操作!)
docker volume prune

# 删除一个或多个指定的数据卷 (如果数据卷正被容器使用，则无法删除)
docker volume rm <volume_name_1> <volume_name_2>
```
默认情况下，Docker 数据卷会被创建在宿主机的特定目录下，例如在 Linux 系统上通常是 `/var/lib/docker/volumes/`。如果你创建了一个名为 `myvolume` 的数据卷，那么其实际数据通常会存储在 `/var/lib/docker/volumes/myvolume/_data` 路径中。

---

**使用方法**

1.  **挂载数据卷到容器中**
    在启动容器时使用 `-v` 或更推荐的 `--mount` 参数来挂载数据卷。

    *   **使用 `-v` (简写，适用于命名卷和绑定挂载):**
        ```bash
        # 挂载命名卷 'myvolume' 到容器的 '/app' 目录
        docker run -d -v myvolume:/app myimage

        # 绑定挂载宿主机的 '/host/path' 到容器的 '/container/path'
        docker run -d -v /host/path:/container/path myimage
        ```

    *   **使用 `--mount` (更明确、更推荐的语法):**
        ```bash
        # 挂载命名卷 'myvolume' 到容器的 '/app' 目录
        docker run -d --mount source=myvolume,target=/app myimage

        # 绑定挂载宿主机的 '/host/path' 到容器的 '/container/path'
        docker run -d --mount type=bind,source=/host/path,target=/container/path myimage

        # 只读挂载 (适用于配置文件等)
        docker run -d --mount type=bind,source=/host/config,target=/app/config,readonly myimage
        # 或者使用 -v 的简写:
        # docker run -d -v /host/config:/app/config:ro myimage
        ```
    `--mount` 语法更冗长但更清晰，特别是当需要指定卷驱动或挂载选项时。

2.  **在 Dockerfile 中定义卷**
    你可以在 Dockerfile 中使用 `VOLUME` 指令来指定一个或多个路径作为匿名卷或用于接收来自宿主机的挂载点。
    ```dockerfile
    FROM ubuntu
    RUN mkdir /mydata
    # 当容器启动时，如果 /mydata 没有被其他方式挂载，Docker 会为它创建一个匿名卷
    # 如果启动时通过 -v 或 --mount 指定了 /mydata 的挂载，则会使用该挂载
    VOLUME /mydata
    ```
    注意：Dockerfile 中的 `VOLUME` 指令创建的是匿名卷（如果运行时未指定命名卷或绑定挂载到该路径），或者它指示 Docker 在此路径挂载数据。对于持久化数据，**推荐在 `docker run` 或 `docker-compose.yml` 中明确使用命名卷**。

3.  **备份数据卷**
    可以通过运行一个临时容器，将目标数据卷挂载到该容器，并使用另一个卷（通常是绑定挂载到宿主机当前目录）作为备份目标。
    ```bash
    # 备份名为 'myvolume' 的数据卷到当前宿主机目录下的 backup.tar
    docker run --rm \
      -v myvolume:/data_to_backup \
      -v $(pwd):/backup_destination \
      busybox \
      tar cvf /backup_destination/backup.tar /data_to_backup
    ```
    这里 `/data_to_backup` 是容器内数据卷的挂载点，`backup.tar` 是备份文件名，`busybox` 是一个轻量级镜像，包含了 `tar` 工具。

4.  **恢复数据卷**
    同样地，可以通过另一个临时容器来从备份文件恢复数据到目标数据卷。
    ```bash
    # 从当前宿主机目录的 backup.tar 恢复数据到名为 'myvolume_restored' 的数据卷
    # (可以恢复到原卷，或新建一个卷进行恢复)
    docker volume create myvolume_restored # 如果需要恢复到新卷
    docker run --rm \
      -v myvolume_restored:/data_to_restore \
      -v $(pwd):/backup_source \
      busybox \
      sh -c "cd /data_to_restore && tar xvf /backup_source/backup.tar --strip 1"
    ```
    `--strip 1` (或根据你备份时的目录结构调整) 用于去除 `tar` 包中的顶层目录。

---

**使用场景示例**

1.  **数据库持久化 (核心场景 - 使用命名卷)**
    当运行一个数据库服务时，如 MySQL 或 PostgreSQL，你需要确保数据库文件保存在一个**命名数据卷**中，这样即使容器被删除或重新创建，数据也不会丢失。
    ```bash
    # 创建命名卷
    docker volume create mysql_db_data

    # 运行 MySQL 容器，并将命名卷挂载到 MySQL 存储数据的默认路径
    docker run -d \
      --name my_mysql_db \
      -e MYSQL_ROOT_PASSWORD=mysecretpassword \
      --mount source=mysql_db_data,target=/var/lib/mysql \
      mysql:8.0
    ```

2.  **开发环境代码同步 (使用绑定挂载)**
    开发人员可以将宿主机上的项目代码目录**绑定挂载**到容器内的应用工作目录，这样在宿主机修改代码后无需重建镜像即可在容器内看到效果，非常适合热重载或快速迭代。
    ```bash
    # 将宿主机当前目录下的 'my_project_src' 绑定挂载到容器的 '/app/src'
    docker run -d -p 8080:80 \
      --name dev_web_app \
      --mount type=bind,source=$(pwd)/my_project_src,target=/app/src \
      my_dev_image
    ```

3.  **配置文件管理 (使用绑定挂载，通常只读)**
    将宿主机上的配置文件**绑定挂载**到容器内，方便修改配置而无需进入容器或重建镜像。
    ```bash
    # 将宿主机 '/etc/my_app/config.ini' 绑定挂载到容器 '/app/config/config.ini' (只读)
    docker run -d \
      --name configured_app \
      --mount type=bind,source=/etc/my_app/config.ini,target=/app/config/config.ini,readonly \
      my_app_image
    ```

4.  **多容器间的共享数据 (使用命名卷)**
    如果你有多个容器需要访问并可能修改相同的数据集（例如，一个Web应用和一个后台处理任务都需要读写共享的缓存或文件），可以使用**命名数据卷**实现共享。
    ```bash
    docker volume create shared_app_data

    docker run -d --name web_frontend \
      --mount source=shared_app_data,target=/usr/share/data \
      frontend_image

    docker run -d --name backend_processor \
      --mount source=shared_app_data,target=/mnt/shared_processing_data \
      backend_image
    ```
    注意：当多个容器同时写入共享卷时，需要应用程序层面进行并发控制，避免数据损坏。

5.  **定期备份 (结合命名卷和备份策略)**
    定期对重要的**命名数据卷**进行备份是非常重要的。你可以设置定时任务（cron jobs）来自动执行上面提到的备份脚本。








---

## docker run 命令详解

`docker run` 用于从镜像创建并启动一个容器。支持多种参数和选项，可以灵活地配置容器的行为

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

- **`OPTIONS`**：配置容器的各种选项。
- **`IMAGE`**：指定要运行的镜像名称或 ID。
- **`COMMAND`**：容器启动后执行的命令（可选）。
- **`ARG`**：传递给命令的参数（可选）。

```bash
# 从 `ubuntu` 镜像启动一个容器，执行默认命令后退出
docker run ubuntu  

#  从 `ubuntu` 镜像启动一个容器，执行 `echo "Hello, Docker!"` 后退出    
docker run ubuntu echo "Hello, Docker!"
```
---

常用 `OPTIONS` 参数说明如下：

---

**容器基础信息`OPTIONS` 参数**

| **选项** |             **描述**             |
| -------- | -------------------------------- |
| `--name` | 为容器指定一个名称（默认随机生成） |
| `-h`     | 指定容器的hostname                |


---


### 容器运行模式

| **选项**          | **描述**                                                                 |
|-------------------|-------------------------------------------------------------------------|
| `-d` 或 `--detach` | 后台运行容器（ detached 模式）。                                        |
| `-it`             | 以交互模式运行容器（分配一个伪终端并保持 STDIN 打开）。                 |
| `--rm`            | 容器退出后自动删除容器。                                                |

1. 从 `nginx` 镜像启动一个容器，并在**后台运行**

```bash
docker run -d nginx
```

2. 从 `ubuntu` 镜像启动一个容器，并以**交互模式**运行 Bash

```bash
docker run -it ubuntu /bin/bash
```

3. 从 `ubuntu` 镜像启动一个容器，并在容器退出后自动删除

```bash
docker run --rm ubuntu
```



### 网络和资源限制

1. **端口映射和网络配置**

| **选项**          | **描述**                                                                 |
|-------------------|-------------------------------------------------------------------------|
| `-p` 或 `--publish` | 将容器端口映射到宿主机端口（格式：`宿主机端口:容器端口`）。             |
| `--network`       | 指定容器使用的网络（如 `bridge`、`host`、`none` 或自定义网络）。         |

从 `nginx` 镜像启动一个容器，并将容器的 80 端口映射到宿主机的 8080 端口

```bash
docker run -d -p 8080:80 nginx
```

创建一个自定义网络 `my-network`，并在该网络中启动一个容器

```bash
docker network create my-network
docker run -d --name my-container --network my-network nginx
```



---

2. **容器资源限制**

| **选项**          | **描述**                                                                 |
|-------------------|-------------------------------------------------------------------------|
| `-m` 或 `--memory` | 限制容器使用的内存（如 `-m 512m` 限制为 512MB）。                       |
| `--cpus`          | 限制容器使用的 CPU 核心数（如 `--cpus="1.5"` 限制为 1.5 个核心）。      |

示例：从 `ubuntu` 镜像启动一个容器，并限制内存为 512MB，CPU 为 1.5 个核心

```bash
docker run -m 512m --cpus="1.5" ubuntu
```



---



### 数据卷和文件挂载

在 Docker 中，`-v` 或 `--volume` 和 `--mount` 标志用于将宿主机上的文件或目录挂载到容器中，或者创建数据卷

|      **选项**      |                            **描述**                            |
| ------------------ | -------------------------------------------------------------- |
| `-v` 或 `--volume` | 将宿主机的目录或文件挂载到容器中（格式：`宿主机路径:容器路径`）。 |
| `--mount`          | 更灵活的挂载方式（支持绑定挂载、卷挂载等）。                     |

1. `-v` 或 `--volume` 语法及使用示例

```bash
-v [host-src]:[container-dest][:<options>]
```
- host-src: 宿主机上的路径（可以是绝对路径或相对路径）或者一个已存在的数据卷名称。
- container-dest: 容器内的目标路径。
- options (可选): 可以包括 ro（只读）或 rw（读写，默认值）。

如：`/path/on/host:/path/in/container:ro`

从 `nginx` 镜像启动一个容器，并将宿主机的 `/host/data` 目录挂载到容器的 `/container/data` 目录

```bash
docker run -d -v /host/data:/container/data nginx
```

---

2. `--mount`的语法及应用

```bash
--mount source=<source>,target=<destination>[,option=value]
```
- source: 宿主机上的路径、文件或数据卷名。
- target: 容器内的路径。
- options (可选): 包括但不限于 readonly, volume-opt, 等等

示例：将名为 mydata 的数据卷挂载到容器中的 `/var/lib/mysql` 目录
```bash
docker run -d --mount source=mydata,target=/var/lib/mysql --name db mysql:latest
```

---



### 其他常用选项

|    **选项**    |                         **描述**                          |
| -------------- | --------------------------------------------------------- |
| `--restart`    | 设置容器的重启策略（如 `--restart always`）。默认为 `no`    |
| `--entrypoint` | 覆盖镜像的默认入口点。默认情况下运行的是 `/bin/bash`         |
| `--user`       | 指定运行容器的用户（如 `--user 1000`）。默认为 `root`       |
| `--workdir`    | 设置容器的工作目录（如 `--workdir /app`）。默认是根目录 `/` |

---

**环境变量**

|    **选项**     |                  **描述**                   |
| --------------- | ------------------------------------------- |
| `-e` 或 `--env` | 设置容器的环境变量（如 `-e MY_ENV=value`）。 |
| `--env-file`    | 从文件加载环境变量（每行一个变量）。          |

从 `ubuntu` 镜像启动一个容器，并设置环境变量 `MY_ENV=value`

```bash
docker run -e MY_ENV=value ubuntu
```

---




## 离线镜像和镜像仓库

除了使用dockerhub的镜像，离线镜像和自建镜像仓库也是常见的需求

### 离线镜像的转移

**导出镜像**：使用 `docker save` 命令将指定的镜像保存为一个tar文件

```bash
docker save -o myimage.tar myimage:tag

# 导出所有镜像
docker save -o allimages.tar $(docker images --format "{{.Repository}}:{{.Tag}}")
```

**导入镜像**：使用 `docker load` 命令加载这个tar文件

```bash
docker load -i myimage.tar  # 或 docker load -i allimages.tar
```

---


### 从容器创建镜像


1. 使用 `docker commit` 生成一个新的镜像（虽然 `docker commit` 提供了一种快捷的方式将当前容器状态保存为镜像，但它并不是普遍推荐的做法）：

```bash
# 启动容器并修改
docker run -it ubuntu bash
# 在容器中安装软件
apt-get update && apt-get install -y curl

# 提交容器为新镜像
docker commit <container_id> my_ubuntu_with_curl:latest
```

生成的镜像包含容器的文件系统变更和当前状态（容器的可写层），镜像的元数据（如标签、作者、启动命令等），镜像的历史记录和层信息

---

2. `docker export` 和 `docker import` （主要用于容器文件系统的备份和迁移）

```bash
# 导出容器文件系统
docker export -o my_container.tar <container_id>

# 从 tar 文件创建新镜像
docker import my_container.tar my_new_image:tag
```
通过 `docker import` 创建的新镜像 仅包含文件系统内容，没有原镜像的构建历史或层信息。



---


### Docker Registry

Docker Registry 是存储和分发 Docker 镜像的服务。支持用户搭建私有的 Docker Registry 来满足内部开发和部署的需求。

安装 Docker Registry 可以通过多种方式进行，这里提供一种使用 Docker 容器的方式进行快速安装：

1. **确保已经安装了 Docker**：首先需要在你的服务器上安装 Docker。
2. **拉取 Docker Registry 镜像**：
   ```bash
   docker pull registry:2
   ```
3. **运行 Docker Registry 容器**：
   ```bash
   docker run -d -p 5000:5000 --restart=always --name registry registry:2
   ```
   这将在后台启动一个 Docker Registry 实例，并将其绑定到端口 5000 上。

4. **配置（可选）**：可以根据需要修改配置文件（如 `/etc/docker/registry/config.yml`），然后挂载到容器中：
   ```bash
   docker run -d -p 5000:5000 --restart=always --name registry -v /path/to/local/config.yml:/etc/docker/registry/config.yml registry:2
   ```

---

**常见使用场景**

- **内部开发和测试**：对于企业来说，建立私有 Docker Registry 可以方便地管理和分享内部使用的镜像，加速开发和测试流程。
- **CI/CD 流水线**：在持续集成和持续交付过程中，使用 Docker Registry 存储构建好的镜像，便于后续部署。
- **多环境部署**：不同环境（如开发、测试、生产）可以使用同一个 Registry 来获取相应的 Docker 镜像，保证环境一致性。


1. **标记镜像**：假设你有一个名为 `my-app` 的镜像想要上传到本地的 Docker Registry：
   ```bash
   docker tag my-app localhost:5000/my-app
   ```
2. **推送镜像**：将标记好的镜像推送到 Docker Registry：
   ```bash
   docker push localhost:5000/my-app
   ```
3. **从 Registry 拉取镜像**：可以在任何一台能够访问该 Docker Registry 的机器上执行以下命令来拉取镜像：
   ```bash
   docker pull localhost:5000/my-app
   ```



---




### Harbor

Harbor 是一个开源的容器镜像仓库，提供了企业级的镜像管理功能，包括镜像管理、安全控制（如用户认证和访问控制）、漏洞扫描以及镜像复制等。它构建在 Docker Registry 之上，添加了更多的企业级特性。


1. **下载 Harbor 安装包**：从 [Harbor Releases](https://github.com/goharbor/harbor/releases) 页面下载适合你环境的安装包。通常选择在线安装器（`harbor-online-installer-<version>.tgz`）。

2. **解压文件**：
   ```bash
   tar xvf harbor-online-installer-<version>.tgz
   cd harbor
   ```

3. **配置 Harbor**：编辑 `harbor.yml` 文件以设置必要的参数，例如主机名、HTTP/HTTPS 端口、数据卷路径、管理员初始密码等。如果你打算启用 HTTPS，还需要指定 SSL 证书和私钥的位置。

4. **准备 Harbor CA 证书（可选）**：如果你启用了 HTTPS 并使用自签名证书，需要将生成的 CA 证书拷贝到 `/etc/docker/certs.d/<your_harbor_host>/` 目录下，并确保所有客户端机器都信任该 CA。

5. **安装并启动 Harbor**：
   ```bash
   sudo ./install.sh
   ```
   或者，如果你想使用特定选项（如启用 Notary、Clair 等），可以使用：
   ```bash
   sudo ./install.sh --with-notary --with-clair
   ```





---

<br>


### Dockerfile构建镜像

dockerfile：https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#dockerfile-instructions

菜鸟教程：https://www.runoob.com/docker/docker-dockerfile.html



Dockerfile 是一个文本文件，包含了一系列的指令和参数，用于定义如何构建一个 Docker 镜像。

Dockerfile 由一系列指令组成，每个指令通常占据一行，常用指令示例：

1. **FROM**：指定基础镜像。
   ```
   FROM ubuntu:20.04
   ```
   这条指令指定了你所要使用的父镜像（这里是 Ubuntu 20.04）。所有后续指令都是基于这个基础镜像进行操作的。

2. **LABEL**：为镜像添加元数据标签。
   ```
   LABEL maintainer="admin@example.com"
   ```
   可以用来记录镜像维护者的信息等。

3. **RUN**：执行命令并在新层中保存结果。
   ```
   RUN apt-get update && apt-get install -y curl
   ```
   用于安装软件包或执行其他命令，每条 `RUN` 指令都会在镜像上创建一个新的层。

4. **CMD**：提供容器启动时默认执行的命令。
   ```
   CMD ["curl", "-s", "http://ip.cn"]
   ```
   当容器启动时会执行这条命令。注意，Dockerfile 中只能有一条 `CMD` 指令，如果有多个，则只有最后一个生效。

5. **ENTRYPOINT**：配置容器启动时运行的命令。
   ```
   ENTRYPOINT ["curl", "-s", "http://ip.cn"]
   ```
   与 `CMD` 不同的是，`ENTRYPOINT` 更适合定义容器的入口点，它不会被 docker run 后面的命令覆盖。

6. **COPY** 和 **ADD**：将本地文件拷贝到镜像中。
   ```
   COPY . /app/
   ADD https://example.com/file.tar.gz /usr/local/
   ```
   `COPY` 仅支持从主机复制文件到容器内，而 `ADD` 还可以自动解压 `.tar` 文件并从 URL 下载文件。

7. **WORKDIR**：设置工作目录。
   ```
   WORKDIR /app
   ```
   设置了容器内的工作目录，后续的 `RUN`, `CMD`, `ENTRYPOINT` 等指令都会在这个目录下执行。

8. **EXPOSE**：声明容器运行时监听的端口。
   ```
   EXPOSE 80
   ```
   这只是声明性的，实际发布端口需要在运行容器时使用 `-p` 参数。

9. **ENV**：设置环境变量。
   ```
   ENV MY_NAME="xxx yy"
   ```

10. **VOLUME**：创建挂载点，用于共享数据卷。
    ```
    VOLUME ["/data"]
    ```

---

示例：构建一个简单的 Nginx 镜像：

```Dockerfile
# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:latest

# 将本地的配置文件拷贝到 Nginx 的配置目录
COPY ./nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 默认启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

然后，在包含此 Dockerfile 的目录下运行 `docker build -t my-nginx .` 即可构建出自定义的 Nginx 镜像。



 



---





## Docker Compose

**Docker Compose** 是一个用于定义和运行多容器 Docker 应用程序的工具。它通过一个 YAML 文件（通常命名为 `docker-compose.yml`）来配置应用程序的服务、网络和卷等资源，从而简化多容器应用的部署和管理。

- Docker Compose 依赖于 Docker 引擎运行。
- 需要先安装 Docker 才能使用 Docker Compose。

相关文档：[Get started with Docker Compose](https://docs.docker.com/compose/gettingstarted/) ， [菜鸟教程](https://www.runoob.com/docker/docker-compose.html)

---

### Compose插件

在 Windows 和 macOS 上，安装 Docker Desktop 时会自动安装 Docker Compose。对于 Linux 用户，从 **Docker Engine 20.10.0** 版本开始，默认集成了 **Docker Compose 插件**（即 `docker compose` 命令，没有连字符）。可以通过以下命令确认是否已集成 Compose 插件：

```bash
docker compose version
```

官方推荐使用 Docker Compose 插件（`docker compose`），因为它是未来发展的方向，并且完全集成到了 Docker CLI 中。独立版本的 `docker-compose` 工具正在逐步被淘汰，仅用于向后兼容的目的。

|   **特性**   |      **Docker Compose 插件**       | **Docker Compose 独立版本**  |
| ------------ | ---------------------------------- | ---------------------------- |
| **命令格式** | `docker compose`（无连字符）        | `docker-compose`（有连字符） |
| **集成方式** | 集成到 Docker CLI                   | 独立二进制文件                |
| **安装方式** | 随 Docker Engine 自动安装           | 需要单独安装                 |
| **推荐程度** | 官方推荐，未来主推方向               | 逐步淘汰，仅用于向后兼容      |
| **兼容性**   | 支持 Docker 最新功能（如 BuildKit） | 功能更新较慢                 |

若需要安装独立版本的 Docker Compose 可参照文档：[Install the Docker Compose standalone](https://docs.docker.com/compose/install/standalone/)

---

### 部署WordPress

以下是一个简单的 `docker-compose.yml` 文件示例，用于启动一个包含 WordPress 和 MySQL 的应用：

```yaml
version: '3.8'

services:
  db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress

  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    depends_on:
      - db

volumes:
  db_data:
```

在 `docker-compose.yml` 文件所在目录下运行以下命令以启动服务：
```bash
docker compose up
```
使用 `-d` 参数可以在后台运行：
```bash
docker compose up -d
```

---

### Compose常用命令

| **命令**                | **描述**                              |
|-------------------------|--------------------------------------|
| `docker compose up`     | 启动服务。                           |
| `docker compose down`   | 停止并删除服务。                     |
| `docker compose ps`     | 查看运行中的容器状态。               |
| `docker compose logs`   | 查看服务日志。                       |
| `docker compose build`  | 构建自定义镜像。                     |
| `docker compose exec`   | 在运行中的容器中执行命令。           |
| `docker compose pull`   | 拉取服务所需的镜像。                 |
| `docker compose restart`| 重启服务。                           |

查看运行状态：
```bash
docker compose ps
```

停止服务，使用 `-v` 参数可以删除关联的卷：
```bash
docker compose down -v
```

查看日志：
```bash
docker compose logs
```

重启服务：
```bash
docker compose restart
```

构建自定义镜像，如果服务使用本地 Dockerfile，可以使用以下命令构建镜像：
```bash
docker compose build
```

使用 Docker Compose 可以极大简化多容器应用的部署和管理，提升开发效率。
---

order: 10
title:  常用Docker镜像安装
shortTitle: 常用镜像安装

---


如何使用Docker部署组件：
1、先去找组件的镜像—— [Docker Hub](https://hub.docker.com/)
2、查看镜像文档，了解组件的可配置内容
3、docker run进行部署

---


## 常用开发环境搭建


### MySQL

下面将演示使用 Docker 部署 MySQL 5.7 和 MySQL 8.4

::: tabs 

@tab mysql5.7 (mysql:5.7.32)

1. 准备工作：宿主机目录

```shell
# 为后续存放配置文件创建根目录
sudo mkdir -p /docker_data/mysql/mysql5.7

sudo chown -R ${USER}:docker /docker_data
sudo chmod -R 775 /docker_data
```

2. 手动部署 (`docker run`) - 获取默认配置
    ```shell
    docker pull mysql:5.7.32

    # 创建数据卷（可选，docker会自动创建）
    docker volume create mysql57_data
    docker volume create mysql57_log

    docker run -p 3307:3306 --name mysql5_7 --restart=always \
      -v mysql57_log:/var/log/mysql \
      -v mysql57_data:/var/lib/mysql \
      -e MYSQL_ROOT_PASSWORD=root \
      -d mysql:5.7.32
    ```

3.  **复制默认配置文件到宿主机:**
    ```shell
    sudo docker cp mysql5_7:/etc/mysql/conf.d /docker_data/mysql/mysql5.7/
    ```

4.  **停止并删除初始容器 (已获取所需配置):**
    ```shell
    docker stop mysql5_7 && docker rm mysql5_7
    ```
5. 重新部署并启动容器：
    ```shell
    docker run -p 3307:3306 --name mysql5_7 \
      --ulimit nproc=65535:65535 \
      --ulimit nofile=65536:65536 \
      -v mysql57_log:/var/log/mysql \
      -v mysql57_data:/var/lib/mysql \
      -v /docker_data/mysql/mysql5.7/conf.d:/etc/mysql/conf.d \
      -e MYSQL_ROOT_PASSWORD=root \
      -d mysql:5.7.32
    ```


@tab:active MySQL 8.x (`mysql:8.4.2`)


1. 准备工作：宿主机目录

```shell
# 为后续存放配置文件创建根目录
sudo mkdir -p /docker_data/mysql/mysql8

sudo chown -R ${USER}:docker /docker_data
sudo chmod -R 775 /docker_data
```

2. 手动部署 (`docker run`) - 获取默认配置
    ```shell
    docker pull mysql:8.4.2

    # 创建数据卷（可选）
    docker volume create mysql8_data
    docker volume create mysql8_log

    docker run -p 3306:3306 --name mysql8 --restart=always \
      -v mysql8_log:/var/log/mysql \
      -v mysql8_data:/var/lib/mysql \
      -e MYSQL_ROOT_PASSWORD=root \
      -d mysql:8.4.2
    ```

3.  **复制默认配置文件到宿主机:**
    ```shell
    sudo docker cp mysql8:/etc/mysql/conf.d /docker_data/mysql/mysql8/
    ```
    其实MySQL8.4在这些路径下已经没有任何文件了，只有 `/etc/my.cnf` 文件

4.  **停止并删除初始容器 (已获取所需配置):**
    ```shell
    docker stop mysql8 && docker rm mysql8
    ```
5. 重新部署并启动容器：
    ```shell
    docker run -p 3306:3306 --name mysql8 --restart=always \
      -v mysql8_log:/var/log/mysql \
      -v mysql8_data:/var/lib/mysql \
      -v /docker_data/mysql/mysql8/conf.d:/etc/mysql/conf.d \
      -e MYSQL_ROOT_PASSWORD=root \
      -d mysql:8.4.2
    ```
:::


---

::: info Docker部署MySQL时如何自定义配置文件？

首先要先了解 **MySQL 的 Docker镜像的配置文件结构**：

MySQL Docker 镜像的配置由 `/etc/mysql/my.cnf` 主文件引导，并自动加载 `/etc/mysql/mysql.conf.d/`（默认配置）和 `/etc/mysql/conf.d/`（用户自定义配置）目录下的 `.cnf` 文件。

| 目录路径                     | 作用                                                                 |
|------------------------------|----------------------------------------------------------------------|
| `/etc/mysql/my.cnf`           | 主配置文件，但通常仅包含基础的全局配置（如 `!includedir` 指令）。 |
| `/etc/mysql/conf.d/`          | **用户自定义配置目录**。任何 `.cnf` 文件会自动被加载，**覆盖或补充**默认配置。 |
| `/etc/mysql/mysql.conf.d/`    | MySQL 官方或镜像提供的默认配置（如 `mysqld.cnf`）。               |


- 用户应通过挂载自定义文件到 `conf.d/` 来覆盖或扩展配置，确保灵活性和可维护性。这也是官方推荐的方式，参照：[Using a custom MySQL configuration file](https://hub.docker.com/_/mysql)
- 对于 MySQL 8.x Docker 镜像：`/etc/mysql/my.cnf` 和 `/etc/mysql/mysql.conf.d/` 可能不存在。只在 `/etc` 目录下有个 `my.cnf` 文件。

---

**为 MySQL 5.7 添加自定义配置**
```shell
sudo tee /docker_data/mysql/mysql5.7/conf.d/zz-custom.cnf > /dev/null << EOF
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
skip-name-resolve
max_connections=200
EOF

sudo chmod 644 /docker_data/mysql/mysql5.7/conf.d/zz-custom.cnf

# 如果已经部署了MySQL，修改后需要重启 MySQL 容器使配置生效：
docker restart mysql5_7
```
*(文件名以 `zz-` 开头可以确保它在其他默认配置之后被加载，从而覆盖默认值)*

**为 MySQL 8.x 添加自定义配置**
```shell
sudo tee /docker_data/mysql/mysql8/conf.d/zz-custom.cnf > /dev/null << EOF
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_0900_ai_ci
# default_authentication_plugin=mysql_native_password # 如需兼容旧客户端
max_allowed_packet=64M
EOF

sudo chmod 644 /docker_data/mysql/mysql8/conf.d/zz-custom.cnf

# 如果已经部署了MySQL，修改后需要重启 MySQL 容器使配置生效：
docker restart mysql8
```
:::


---

**示例: 使用 Docker Compose 部署两个不同版本的MySQL**  （不推荐使用，一定要用的话最好部署MySQL8以上的版本）

1.  **准备 `docker-compose.yml` 文件:**
    在你的项目根目录下 (例如 `~/mysql_project/`) 创建 `docker-compose.yml`。
    ::: info 关于项目名
    执行 `docker compose up` 时，Docker Compose 会根据当前 `docker-compose.yml` 文件所在的目录名（或者通过 `-p <project_name>` 参数指定的项目名）来创建一个项目上下文。默认情况下，这个项目名会用作创建的网络和卷（如果卷名没有在顶级 volumes 块中声明为 external: true）的前缀。
    :::
    ```bash
    cd ~/mysql
    vim docker-compose.yml
    ```
    添加如下内容：
```yaml
services:
  mysql57:
    image: mysql:5.7.32
    container_name: mysql5_7
    #restart: always
    ports:
      - "3307:3306"
    volumes:
      - mysql57_data:/var/lib/mysql
      - mysql57_log:/var/log/mysql
      - type: bind 
        source: /docker_data/mysql/mysql5.7/conf.d
        target: /etc/mysql/conf.d
        read_only: true
    environment:
      MYSQL_ROOT_PASSWORD: root 
    ulimits: 
      nproc: 65535   # 进程数上限
      nofile:
        soft: 26677  # 文件描述符软限制
        hard: 46677  # 文件描述符硬限制
    deploy: 
      resources: 
        limits: 
          memory: 1G 
  mysql8:
    image: mysql:8.4.2
    container_name: mysql8
    restart: always
    ports:
      - "3306:3306"
    volumes:
      - mysql8_data:/var/lib/mysql
      - mysql8_log:/var/log/mysql
      - type: bind
        source: /docker_data/mysql/mysql8/conf.d
        target: /etc/mysql/conf.d
        read_only: true
    environment:
      MYSQL_ROOT_PASSWORD: root
    deploy:
      resources:
        limits:
          memory: 2G
volumes: 
  mysql57_data:
  mysql57_log:
  mysql8_data:
  mysql8_log:
```

如果声明的命名卷在宿主机上已经存在，Docker Compose 会直接使用它们

::: tip
在实验中发现通过 docker compose 部署 mysql5.7 时，内存占用明显异常，如果加了内存资源限制，甚至会导致容器一直重启！ 解决方案是加 `ulimits` 限制。参照：[Mysql 5.7内存异常占用](https://juejin.cn/post/7381476230775849014), [docker compose启动mysql5.7内存占用异常](https://blog.chenwx.top/p/docker-mysql-event1.html)
:::

2.  **启动服务：**
    在 `docker-compose.yml` 文件所在的目录执行：
    ```shell
    # 启动 (后台运行)
    docker compose up -d

    # 查看服务状态
    docker compose ps

    # 查看日志 (例如 mysql8 服务)
    docker compose logs mysql8
    ```

3.  **管理服务：**
    ```shell
    # 进入容器
    docker compose exec mysql57 bash
    docker compose exec mysql8 bash

    # 停止服务 (停止并删除容器，但是保留卷)
    docker compose down

    # 停止并删除服务及关联的命名卷 (彻底清理)
    docker compose down -v
    ```

---

::: tip MySQL 配置项的默认值和含义

获取 MySQL 配置项信息最权威的途径是 **MySQL 官方文档**。

1.  访问 MySQL 官方文档网站: [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)
2.  选择对应的 MySQL 版本 (例如 "MySQL Server 8.0" 或 "MySQL Server 5.7")。
3.  导航到 "Reference" -> "Server Administration" -> "Server Configuration" -> "Server System Variables"。
4.  搜索你感兴趣的配置项名称。文档会详细说明其含义、默认值、可接受范围等。
5.  在运行的 MySQL 实例中查询当前值：
    ```sql
    SHOW VARIABLES LIKE 'variable_name%';
    SHOW GLOBAL VARIABLES LIKE 'variable_name%';
    ```
:::


---


### PostgreSQL

1. 准备工作：
```bash
sudo mkdir -p /docker_data/postgre/pg16/data
sudo chmod -R 775 /docker_data

docker pull postgres:16
```

2. 创建并启动 PostgreSQL 容器：

```bash
docker run -d --name postgres16 --restart=always \
  -p 5432:5432 \
  -v /docker_data/postgre/pg16/data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=123456 \
  postgres:16
```

3. 备份配置文件，并参考默认配置修改自定义配置文件(可选)：
```bash
sudo cp /docker_data/postgre/pg16/data/postgresql.conf /docker_data/postgre/pg16/data/postgresql.conf.backup
sudo cp /docker_data/postgre/pg16/data/pg_hba.conf /docker_data/postgre/pg16/data/pg_hba.conf.backup

# 编辑自定义配置文件
sudo vim /docker_data/postgre/pg16/data/postgresql.conf
sudo vim /docker_data/postgre/pg16/data/pg_hba.conf
```

4. 测试连接，修改密码：

重要信息：端口号为 5432，默认用户名为 `postgres`，密码为部署容器时设置信息，此处为 `123456`。

```bash
# 进入 PostgreSQL 容器：
docker exec -it postgres16 psql -U postgres

# 在 PostgreSQL 命令行中执行以下命令修改密码：
alter user postgres with password '123456';

# 退出 PostgreSQL 命令行：
\q    # 或者使用 exit
```


---

::: info PostgreSQL关键环境变量

环境变量是在启动容器时传递给 PostgreSQL 实例的关键配置。官方镜像支持多个环境变量来初始化数据库 。   
- ==`POSTGRES_PASSWORD`: 必需。设置超级用户 (默认为 `postgres`，或由 `POSTGRES_USER` 指定的用户) 的密码==。此密码在数据库首次初始化时设置 。   
- `POSTGRES_USER`: 可选。指定一个自定义的超级用户名。如果设置此变量，将创建一个同名的数据库，除非同时指定了 `POSTGRES_DB` 。如果未指定，则默认为 `postgres` 用户。   
- `POSTGRES_DB`: 可选。指定一个在首次启动时创建的默认数据库名称。如果未指定，则使用与 `POSTGRES_USER` 相同的值作为数据库名 。   
- `PGDATA`: 可选。此环境变量用于指定 PostgreSQL 存储其数据文件的目录路径。在 Docker 镜像内部，默认的 PGDATA 路径通常是 `/var/lib/postgresql/data` 。当挂载数据卷时，容器内的这个路径是目标挂载点。虽然可以设置 PGDATA 环境变量来更改容器内的数据目录，但在大多数情况下，用户会依赖默认的 `/var/lib/postgresql/data` 路径，并将宿主机卷或命名卷挂载到此标准位置。   

这些环境变量仅在数据库目录为空（即首次初始化）时生效。如果容器启动时发现数据目录中已存在数据库，则这些变量将被忽略 。
:::


---

### Redis

1. 下载镜像，准备好配置文件（直接下载Github文档中的对应版本配置文件）

```shell
docker pull redis:8  # 下载镜像

sudo mkdir -p /docker_data/redis/redis8

# 下载配置文件
sudo wget https://raw.githubusercontent.com/redis/redis/8.0/redis.conf \
    -O /docker_data/redis/redis8/redis.conf.backup

# 去除掉配置文件中的大量注释
sudo grep -vE '^[[:space:]]*#|^[[:space:]]*$' \
    /docker_data/redis/redis8/redis.conf.backup \
    | sudo tee /docker_data/redis/redis8/redis.conf > /dev/null
```

2. 创建实例并启动redis, 并使用 `Another Redis Desktop Manager` 连接

```bash
docker run -p 6379:6379 --name redis8 --restart=always \
-v /docker_data/redis/redis8/redis.conf:/etc/redis/redis.conf \
-v redis8_data:/data \
-d redis:8 \
redis-server /etc/redis/redis.conf
```
- **数据挂载**：`-v redis8_data:/data` 将容器内的`/data`目录映射到宿主机上的`redis8_data`命名卷
- **配置文件挂载**：`-v /docker/redis/redis8/redis.conf:/etc/redis/redis.conf` 将宿主机上的 `redis.conf` 文件映射到容器内的 `/etc/redis/redis.conf`。
- **指定配置文件**：`redis-server /etc/redis/redis.conf` 告诉 Redis 容器使用指定的配置文件启动。

::: tip 远程连接注意事项
远程连接主要关注如下配置：
```bash
# bind 127.0.0.1 -::1
protected-mode no
```
- bing: 指定允许哪些 IP 地址连接到 Redis 服务器, 这里注释掉了，允许所有IP地址连接
- protected-mode: 保护模式，默认是yes，只允许本地连接，这里设置为no，允许远程连接

当然以上只是本地环境中的配置，如果使用的是公网环境还需要配置密码，使用证书，限制IP地址等：
```bash
bind IP_ADDRESS
protected-mode yes
```
并在启动redis时指定密码：`--requirepass yourpassword`

生产环境中更加需要注意安全问题，可能还需要其他的措施
:::

3. 测试持久化配置是否生效

```bash
docker exec -it redis redis-cli
>set name alice                     # ok
>get name                           # "alice"
>exit

docker restart redis
docker exec -it redis redis-cli
>get name                           # "alice"   成功保存到硬盘，重启数据依旧存在
>exit

```





### ELK环境

elasticsearch参照官方文档：[Install with docker](https://www.elastic.co/docs/deploy-manage/deploy/self-managed/install-elasticsearch-docker-basic)

```bash
# 下载镜像
docker search elasticsearch
docker pull elasticsearch:7.16.3

# 创建数据、数据和日志的挂载目录
sudo mkdir -p /docker/data/elk/es/{config,data,logs}


# 赋予权限, docker中elasticsearch的用户UID是1000.
sudo chown -R 1000:1000 /docker/data/elk/es


# 创建配置文件
cd /docker/data/elk/es/config
sudo vim elasticsearch.yml
#-----------------------配置内容----------------------------------
cluster.name: "my-es"
network.host: 0.0.0.0
http.port: 9200
```

通过镜像，启动一个容器，并将9200和9300端口映射到本机（elasticsearch的默认端口是9200，我们把宿主环境9200端口映射到Docker容器中的9200端口）。此处建议给容器设置固定ip，我这里没设置。

```bash
sudo docker run -it -d -p 9200:9200 -p 9300:9300 --name es --restart=always \
-e ES_JAVA_OPTS="-Xms1g -Xmx1g" -e "discovery.type=single-node"  \
-v /docker/data/elk/es/config/es.yml:/usr/share/elasticsearch/config/elasticsearch.yml \
-v /docker/data/elk/es/data:/usr/share/elasticsearch/data \
-v /docker/data/elk/es/logs:/usr/share/elasticsearch/logs elasticsearch:7.16.3
```

验证安装是否成功：浏览器访问 `http://localhost:9200` 


IK中文分词器：

```bash
# 将Linux 中的 ik 目录复制到es容器中
sudo docker cp /home/drizzle/Software/elk/ik es:/usr/share/elasticsearch/plugins/

# 重启容器即可
sudo docker restart es

```

<br>

---

**kibana安装与配置**

```bash
# 下载镜像
sudo docker pull kibana:7.16.3

# 获取elasticsearch容器ip: 172.17.0.6
sudo docker inspect --format '{{ .NetworkSettings.IPAddress }}' es

# 新建配置文件
sudo mkdir /docker/data/elk/kibana
sudo touch /docker/data/elk/kibana/kibana.yml
sudo vim /docker/data/elk/kibana/kibana.yml

#Default Kibana configuration for docker target
server.name: kibana
server.host: "0"
elasticsearch.hosts: ["http://172.17.0.6:9200"]
xpack.monitoring.ui.container.elasticsearch.enabled: true


# run kibana
sudo docker run -d --restart=always --log-driver json-file --log-opt max-size=100m --log-opt max-file=2 --name kibana -p 5601:5601 -v /docker/data/elk/kibana/kibana.yml:/usr/share/kibana/config/kibana.yml kibana:7.16.3

```

浏览器上输入：http://localhost:5601，如无法访问进容器检查配置是否生效



### Nacos

注意服务器内存不足，启动后内存溢出问题（单机standalone模式默认服务器堆大小512M）[nacos官方文档](https://nacos.io/zh-cn/docs/what-is-nacos.html)

```shell

docker pull nacos/nacos-server

# 创建本地的映射文件：custom.properties
mkdir -p /docker/data/nacos/{init.d,logs}
touch /docker/data/nacos/init.d/custom.properties

cat > /docker/data/nacos/init.d/custom.properties << EOF
management.endpoints.web.exposure.include=*
EOF

```

<br>

创建数据库 `nacos_config` :  创建nacos数据库后，然后执行下面的Sql 。 [nacos官网的Sql](https://github.com/alibaba/nacos/blob/master/config/src/main/resources/META-INF/nacos-db.sql) . 

```shell

# 创建容器并启动(开机自启动)
docker run -d -p 8848:8848 --name nacos --restart always \
-e MODE=standalone \
-e PREFER_HOST_MODE=ip \
-e SPRING_DATASOURCE_PLATFORM=mysql \
-e MYSQL_SERVICE_HOST=192.168.5.106 \
-e MYSQL_SERVICE_PORT=3306 \
-e MYSQL_SERVICE_DB_NAME=nacos_config \
-e MYSQL_SERVICE_USER=root \
-e MYSQL_SERVICE_PASSWORD=123456 \
-e MYSQL_DATABASE_NUM=1 \
-v /docker/data/nacos/init.d/custom.properties:/home/nacos/init.d/custom.properties \
-v /docker/data/nacos/logs:/home/nacos/logs \
nacos/nacos-server

docker ps

```


### Nginx

创建配置文件目录：

```bash

sudo mkdir -p /docker/data/nginx/conf/conf.d
sudo mkdir -p /docker/data/nginx/html
sudo mkdir -p /docker/data/nginx/logs

```

conf 和conf.d 分别 用于保存配置文件
html 用于放置静态文件
logs 用于保存日志



<br>



下载镜像，先随便启动一个容器，复制相关配置文件：

```bash

sudo docker pull nginx

sudo docker run --name nginx-test -p 8088:80 -d nginx 


# 复制相关文件
sudo docker cp 622:/etc/nginx/nginx.conf /docker/data/nginx/conf/nginx.conf
sudo docker cp 622:/etc/nginx/conf.d /docker/data/nginx/conf
sudo docker cp 622:/usr/share/nginx/html /docker/data/nginx/


# 停止、并删除原来的容器
sudo docker stop 622
sudo docker rm 622

```

<br>

指定配置文件及数据保存位置、并启动Nginx：

```bash

sudo docker run --name nginx -p 80:80 \
-v /docker/data/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /docker/data/nginx/html/:/usr/share/nginx/html/ \
-v /docker/data/nginx/logs/:/var/log/nginx/ \
-v /docker/data/nginx/conf/conf.d/:/etc/nginx/conf.d/ \
--privileged=true -d nginx

```








---



### Portainer CE

Portainer 是一个轻量级的管理界面，用于管理 Docker 环境。它提供了直观的图形用户界面（GUI），使得用户可以轻松地管理和监控 Docker 容器、镜像、网络、卷等资源。Portainer 分为两个版本：Portainer CE（社区版）和 Portainer BE（企业版）

Portainer CE 的常用端口号主要用于其 Web 界面和 API 的访问：

- **9000/9443**: 用于访问 Portainer 的 Web 界面。`9000` 提供 HTTP 访问，而 `9443` 提供 HTTPS 访问
- **8000**: 用于 Portainer Agent API，当需要管理多个 Docker 节点时使用

默认情况下，Portainer 使用 9000 端口提供 HTTP 访问。如果你选择启用 HTTPS（通过配置 SSL/TLS），则使用 9443 端口

Portainer CE 管理端部署：

```bash
sudo docker pull portainer/portainer-ce

# 持久化 Portainer 的配置数据和状态信息
sudo docker volume create portainer_data

sudo docker run -d -p 8000:8000 -p 9000:9000 --name=portainer --restart=always \
-v /var/run/docker.sock:/var/run/docker.sock \
-v portainer_data:/data \
portainer/portainer-ce
```

访问 9000 端口即可：http://192.168.16.80:9000/


---

**Agent API（port: 8000）**:

8000端口用于 Portainer Agent API 的通信。Portainer Agent 是一个轻量级的服务，可以部署在远程 Docker 节点上，以便 Portainer 实例能够管理这些节点。通过这个端口，Portainer 可以与这些 Agents 进行通信。

默认情况下，此端口未被使用，除非需要管理和监控多个 Docker 节点，并且已经在那些节点上部署了 Portainer Agent。

示例：在 Docker 主机上部署 Portainer Agent （Docker Swarm 或 Kubernetes 环境中）
```bash
sudo docker run -d -p 9001:9001 --name portainer_agent --restart=always \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /var/lib/docker/volumes:/var/lib/docker/volumes \
portainer/agent
```

然后在前面的管理界面添加环境即可

---






## Docker常见应用部署


### Alist

GitHub: https://github.com/AlistGo/alist

官方文档：https://alistgo.com/guide/install/docker.html

```bash
docker pull xhofe/alist:v3.45.0

docker run -d --restart=unless-stopped --name="alist" \
  -v alist_data:/opt/alist/data \
  -p 5244:5244 -e PUID=0 -e PGID=0 -e UMASK=022 \
  xhofe/alist:v3.45.0
```

获取管理员密码/设置密码：
```bash
docker exec -it alist ./alist admin set 123456
```

浏览器访问：http://192.168.43.236:5244
---

order: 1
title:  Docker
shortTitle: docker

---


## Docker的基础使用

### Docker的安装

docker 官网安装教程：https://docs.docker.com/engine/install/ubuntu/ 


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
参照官网教程
:::


---


### 配置镜像加速

配置代理的方式（本机使用Clash并开启`LAN`）：Docker 配置代理，编辑代理配置文件：
```bash
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo vim /etc/systemd/system/docker.service.d/http-proxy.conf

# 添加下面内容
[Service]
Environment="HTTP_PROXY=http://192.168.248.54:7890"
Environment="HTTPS_PROXY=http://192.168.248.54:7890"
Environment="NO_PROXY=localhost,127.0.0.1,192.168.0.0/16,172.17.16.0/20"

# 重启Docker
systemctl daemon-reload && systemctl restart docker
```

---

**在线配置镜像加速**（越来越难找到能用的了）:  [阿里云镜像加速说明](https://help.aliyun.com/zh/acr/user-guide/accelerate-the-pulls-of-docker-official-images)

```shell
mkdir -p /etc/docker 

tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": [
        "https://docker.m.daocloud.io",
        "https://registry.cn-hangzhou.aliyuncs.com"
    ],
    "exec-opts": ["native.cgroupdriver=systemd"]
}
EOF
```

配置好后，重启Docker即可：
```bash
systemctl daemon-reload && systemctl restart docker
```



已废弃地址：
```bash
tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": [
        "https://do.nark.eu.org",
        "https://dc.j8.work",
        "https://docker.m.daocloud.io",
        "https://dockerproxy.com",
        "https://docker.mirrors.ustc.edu.cn",
        "https://docker.nju.edu.cn",
        "https://registry.docker-cn.com",
        "https://hub-mirror.c.163.com",
        "https://hub.uuuadc.top",
        "https://docker.anyhub.us.kg",
        "https://dockerhub.jobcher.com",
        "https://dockerhub.icu",
        "https://docker.ckyl.me",
        "https://docker.awsl9527.cn",
        "https://mirror.baidubce.com",
        "https://docker.1panel.live",
        "https://registry.docker-cn.com",
        "https://dockerhub.azk8s.cn",
        "https://hub-mirror.c.163.com",
        "https://docker.mirrors.ustc.edu.cn",
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
#【问题】发现centos停止了！？原因：docker容器使用后天运行必须要有一个前台进程
docker run -d centos            
```

从镜像创建容器和，后续再次启动需要执行`docker start`, 停止和重启等参照：

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


### Docker数据卷

```bash
docker volume ls           # 列出所有的数据卷
docker volume inspect xxx  # 查看数据卷的详细信息

docker volume create xxx   # 创建数据卷

docker volume pause        # 删除所有的未使用的数据卷
docker volume rm xxx       # 删除指定的数据卷

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

2. `docker expor`t 和 `docker import` （主要用于容器文件系统的备份和迁移）

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


## 常用镜像安装和配置

如何使用Docker部署组件：
1、先去找组件的镜像—— [Docker Hub](https://hub.docker.com/)
2、查看镜像文档，了解组件的可配置内容
3、docker run进行部署


::: info docker run

常用关键参数OPTIONS 说明：

```bash

-d:   # 后台运行容器，并返回容器ID；
-P:   # 随机端口映射，容器内部端口随机映射到主机的端口
-p:   # 指定端口映射，格式为：主机(宿主)端口:容器端口

-i:   # 以交互模式运行容器，通常与 -t 同时使用；
-t:   # 为容器重新分配一个伪输入终端，通常与 -i 同时使用

--restart ,      # 指定重启策略，可以写--restart=awlays 总是故障重启
--volume , -v:   # 绑定一个卷。一般格式 主机文件或文件夹:虚拟机文件或文件夹


--name="nginx-lb":         # 为容器指定一个名称；
--dns 8.8.8.8:             # 指定容器使用的DNS服务器，默认和宿主一致；
--dns-search example.com:  # 指定容器DNS搜索域名，默认和宿主一致；
-h "mars":                 # 指定容器的hostname；

-e username="ritchie":     # 设置环境变量；
--env-file=[]:             # 从指定文件读入环境变量；

--cpuset="0-2" or --cpuset="0,1,2":   # 绑定容器到指定CPU运行；

-m :             # 设置容器使用内存最大值；
--net="bridge":  # 指定容器的网络连接类型，支持 bridge/host/none/container: 四种类型；

--link=[]:       # 添加链接到另一个容器；
--expose=[]:     # 开放一个端口或一组端口；

```
:::




### Portainer工具

Portainer是功能强大的开源工具集，可让您轻松地在Docker，Swarm，Kubernetes和Azure ACI中构建和管理容器。 Portainer的工作原理是在易于使用的GUI后面隐藏使管理容器变得困难的复杂性。

```bash
sudo docker pull portainer/portainer-ce

# 服务端部署
sudo docker volume create portainer_data

sudo docker run -d -p 8000:8000 -p 9000:9000 --name=portainer --restart=always \
-v /var/run/docker.sock:/var/run/docker.sock \
-v portainer_data:/data portainer/portainer-ce
# 访问 9000 端口即可

# agent端部署
sudo docker run -d -p 9001:9001 --name portainer_agent --restart=always \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /var/lib/docker/volumes:/var/lib/docker/volumes portainer/agent

```





### MySQL数据库

创建实例并启动（将重要配置和数据映射到外部主机）：

```shell
docker pull mysql:5.7

sudo mkdir -p /docker/mysql/mysql5.7/{log,data,conf,conf/conf.d,conf/mysql.conf.d}
sudo chmod 644 /docker/mysql/mysql5.7/conf/my.cnf  # 此处配置文件权限不能是777，否则会被忽略

# 创建实例并启动mysql （5.7）
docker run -p 3307:3306 --name mysql5.7 --restart=always --privileged=true \
-v /docker/mysql/mysql5.7/log:/var/log/mysql \
-v /docker/mysql/mysql5.7/data:/var/lib/mysql \
-v /docker/mysql/mysql5.7/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7

docker cp 52361b11faeb:/etc/my.cnf /docker/mysql/mysql5.7/my.cnf
```

设置mysql的配置文件
```bash
cat > /docker/data/mysql/conf/mysql.conf << EOF
[client]
default-character-set=utf8
[mysql]
default-character-set=utf8
[mysqld]
init_connect='SET collation_connection=utf8_unicode_cli'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshark
skip-name-resolve
secure_file_priv=/var/lib/mysql
EOF

docker restart mysql                    # 修改完要重启mysql
docker exec -it mysql /bin/bash         # 进入mysql
```


创建多个MySQL实例：
```shell
# 创建实例并启动mysql（ 8.0 ）
docker run -p 3306:3306 --name mysql8 --restart=always --privileged=true \
-v /docker/data/mysql/log:/var/log/mysql \
-v /docker/data/mysql/data:/var/lib/mysql \
-v /docker/data/mysql/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql:8.0

#启动两个mysql
docker run -p 3307:3306 --name mysql_gmall \
-v /docker/data/mysql_gmall/log:/var/log/mysql \
-v /docker/data/mysql_gmall/data:/var/lib/mysql \
-v /docker/data/mysql_gmall/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7
```


---

### Redis安装与配置

```shell
docker pull redis  # 下载镜像

# 创建实例并启动redis
mkdir -p /docker/data/redis/conf && touch /docker/data/redis/conf/redis.conf

docker run -p 6379:6379 --name redis --restart=always \
 -v /docker/data/redis/conf/redis.conf:/etc/redis/redis.conf \
 -v /docker/data/redis/data:/data \
 -d redis redis-server /etc/redis/redis.conf


#配置（持久化）
cat > /docker/data/redis/conf/redis.conf << EOF
appendonly yes
EOF

docker restart redis                    #修改完要重启redis

```

测试持久化配置是否生效

```shell
docker exec -it redis redis-cli
>set name alice                     # ok
>get name                           # "alice"
>exit

docker restart redis
docker exec -it redis redis-cli
>get name                           # "alice"   成功保存到硬盘，重启数据依旧存在
>exit

```





### ELK环境的部署

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



### nacos安装与配置

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


### Nginx安装与配置

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








<br>



## Docker Compose

[Get started with Docker Compose](https://docs.docker.com/compose/gettingstarted/) 

 [You can use Docker Compose to easily run WordPress](https://docs.docker.com/samples/wordpress/) 

 [菜鸟教程](https://www.runoob.com/docker/docker-compose.html) &nbsp; 

[install-compose：](https://docs.docker.com/compose/install/#install-compose)

```shell
#To install a different version of Compose, substitute 1.29.2 with the version of Compose you want to use
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version                          #Test the installation


#To uninstall Docker Compose if you installed using curl:
sudo rm /usr/local/bin/docker-compose
```

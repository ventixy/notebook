---

order: 10
title:  常用Docker镜像安装
shortTitle: 常见容器的安装

---


如何使用Docker部署组件：
1、先去找组件的镜像—— [Docker Hub](https://hub.docker.com/)
2、查看镜像文档，了解组件的可配置内容
3、docker run进行部署


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


### MySQL

1. 创建实例并启动（`mysql:5.7.32`）：

```shell
docker pull mysql:5.7.32

sudo mkdir -p /docker/mysql/mysql5.7/{log,data,conf,conf/conf.d,conf/mysql.conf.d}
sudo chmod 755 /docker/mysql/mysql8/conf/  # 此处配置文件权限不能是777，否则会被忽略

# 创建实例并启动mysql （5.7）
docker run -p 3307:3306 --name mysql5.7 --restart=always --privileged=true \
-v /docker/mysql/mysql5.7/log:/var/log/mysql \
-v /docker/mysql/mysql5.7/data:/var/lib/mysql \
-v /docker/mysql/mysql5.7/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7.32

docker cp 52361b11faeb:/etc/my.cnf /docker/mysql/mysql5.7/conf/my.cnf
```

设置mysql的配置文件
```bash
cat > /docker/mysql/mysql5.7/conf/my.cnf << EOF
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

2. `mysql:8.4.2`

```bash
docker pull mysql:8.4.2

sudo mkdir -p /docker/mysql/mysql8/{log,data,conf,conf/conf.d,conf/mysql.conf.d}

# 此处配置文件权限不能是777，否则会被忽略
chmod 755 /docker/mysql/mysql8/conf/
# chown 999:999 /docker/mysql/mysql8/conf/

docker run -p 3306:3306 --name mysql8 --restart=always --privileged=true \
-v /docker/mysql/mysql8/log:/var/log/mysql \
-v /docker/mysql/mysql8/data:/var/lib/mysql \
-v /docker/mysql/mysql8/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:8.4.2

docker cp ab367210dc4d:/etc/my.cnf /docker/mysql/mysql8/conf/my.cnf
```

---

### Redis

```shell
docker pull redis:7.4.1  # 下载镜像

mkdir -p /docker/redis/redis7/{conf,data} 

touch /docker/redis/redis7/conf/redis.conf

# 配置（混合持久化）
cat > /docker/redis/redis7/conf/redis.conf << EOF
aof-use-rdb-preamble yes
EOF
```

创建实例并启动redis

```bash
docker run -p 6379:6379 --name redis --restart=always \
-v /docker/redis/redis7/conf/redis.conf:/etc/redis/redis.conf \
-v /docker/redis/redis7/data:/data \
-d redis redis-server /etc/redis/redis.conf
```

测试持久化配置是否生效

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








<br>
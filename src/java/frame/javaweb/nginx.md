---

order: 50
title:  Nginx服务器
---


## 一 Nginx安装和介绍

Nginx官网下载地址：http://nginx.org/en/download.html

Nginx documentation：http://nginx.org/en/docs/  

<br>

Nginx (engine x) 是一个高性能的HTTP和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务。

Nginx是由伊戈尔·赛索耶夫为俄罗斯访问量第二的Rambler.ru站点（俄文：Рамблер）开发的，第一个公开版本0.1.0发布于2004年10月4日。Nginx是一款轻量级的Web 服务器/反向代理服务器及电子邮件（IMAP/POP3）代理服务器，在BSDlike协议下发行。

其特点是占有内存少，并发能力强



<br>

### 1. Nginx的核心功能

Nginx最核心的两个功能：
1. 高性能的静态web服务器
2. 反向代理

![](https://image.ventix.top/java/image-20220513193605094.png)

正向代理：代理服务器是代表用户客户端去访问后端服务器，代理的对象是用户
反向代理：代理服务器是代表后端服务器供客户端去访问，对于用户来说是无感知的，代理的对象是后台服务器

<br>

**Nginx的优势**：

1. 高并发、高性能（一个进程可以处理多个请求）
2. 扩展性好（模块化设计）
3. 异步非阻塞的事件驱动模型
4. 高可靠性（热部署、7*24）



<br>



### 2. Nginx的编译安装

下载Nginx安装包并解压 ： 

```shell

wget -c https://nginx.org/download/nginx-1.20.1.tar.gz

tar -zxvf nginx-1.20.1.tar.gz

```

<br>

安装依赖环境 — 需要前置环境 `gcc，PCRE pcre-devel，zlib，OpenSSL`

>gcc环境
>PCRE库，用于解析正则表达式
>zlib压缩和解压缩依赖
>SSL 安全的加密的套接字协议层，用于HTTP安全传输，也就是https

```shell

yum install gcc-c++
yum install -y pcre pcre-devel
yum install -y zlib zlib-devel
yum install -y openssl openssl-devel

```

<br>



编译安装 — 编译之前，先创建nginx临时目录,并进行相关配置

```shell

mkdir /var/temp/nginx -p
cd nginx-1.20.1/


./configure \
--prefix=/usr/local/nginx \
--pid-path=/var/run/nginx/nginx.pid \
--lock-path=/var/lock/nginx.lock \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--with-http_gzip_static_module \
--http-client-body-temp-path=/var/temp/nginx/client \
--http-proxy-temp-path=/var/temp/nginx/proxy \
--http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
--http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
--http-scgi-temp-path=/var/temp/nginx/scgi \
--with-http_ssl_module

make

make install

```

<br>

<table><thead><tr><th align="left">命令</th><th align="left">解释</th></tr></thead><tbody><tr><td align="left">–prefix</td><td align="left">指定nginx安装目录</td></tr><tr><td align="left">–pid-path</td><td align="left">指向nginx的pid</td></tr><tr><td align="left">–lock-path</td><td align="left">锁定安装文件，防止被恶意篡改或误操作</td></tr><tr><td align="left">–error-log</td><td align="left">错误日志</td></tr><tr><td align="left">–http-log-path</td><td align="left">http日志</td></tr><tr><td align="left">–with-http_gzip_static_module</td><td align="left">启用gzip模块，在线实时压缩输出数据流</td></tr><tr><td align="left">–http-client-body-temp-path</td><td align="left">设定客户端请求的临时目录</td></tr><tr><td align="left">–http-proxy-temp-path</td><td align="left">设定http代理临时目录</td></tr><tr><td align="left">–http-fastcgi-temp-path</td><td align="left">设定fastcgi临时目录</td></tr><tr><td align="left">–http-uwsgi-temp-path</td><td align="left">设定uwsgi临时目录</td></tr><tr><td align="left">–http-scgi-temp-path</td><td align="left">设定scgi临时目录</td></tr></tbody></table>

<br>



启动和停止 — 进入安装目录启动nginx  (`/usr/local/nginx/sbin`) 

```bash
./nginx

./nginx -s stop

./nginx -s reload

./nginx -V

```



<br>



### 3. Ubuntu安装Nginx

Ubuntu安装Nginx 非常方便，可以直接使用apt源来安装

```bash

sudo add-apt-repository ppa:nginx/stable
sudo apt-get update
sudo apt-get install nginx

nginx -v

```

在 `/etc/nginx`  目录下可以看到nginx的配置文件nginx.conf



<br>



### 4. 基本配置及常见问题

**Nginx 默认配置文件** （`nginx.conf`）

```properties

worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}

```

<br>



搭建动静分离、具备HTTPS安全访问的反向代理服务器架构

```properties
user root;
worker_processes  3;

events {
    worker_connections  4096;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    #监听80端口，重定向到443端口
    server {
        listen       80;
        server_name  qmt.ink;
        rewrite ^(.*)$ https://qmt.ink:443/$1 permanent;

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
    #后端反向代理 可拓展集群
    upstream tomcats{
        server 172.17.0.15:8088;
    }
    #HTTPS server
    server {
        listen 443 ssl;
        server_name qmt.ink;
        ssl_certificate 1_qmt.ink_bundle.crt;
        ssl_certificate_key 2_qmt.ink.key;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_prefer_server_ciphers on;
        #配置网站路径
        location /shop {
            alias /home/website/foodie-shop/;
            index index.html index.htm;
        }
        #通用请求（反向代理）
        location / {
            proxy_pass http://tomcats;
        }
    }
}
```

<br>



**常见问题**：

`nginx: [error] open() "/var/run/nginx/nginx.pid" failed (2: No such file or directory)` ？

【原因分析】： 目录或文件不存在 （可先进入 `/var/run/nginx` 目录，验证目录是否存在，没有创建即可）

```bash

cd /var/run/nginx
mkdir /var/run/nginx

/usr/local/nginx/sbin/nginx -s reload

```

<br>

目录存在后重新加载nginx会出现 `nginx: [error] invalid PID number "" in "/var/run/nginx/nginx.pid"`，

此时需要重新指定nginx的配置文件：

```bash

/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf

/usr/local/nginx/sbin/nginx -s reload

```



<br>



## 二 Nginx的核心配置

nginx documentation：http://nginx.org/en/docs/ 



### 1. Nginx配置文件结构

Configuration File’s Structure: http://nginx.org/en/docs/beginners_guide.html#conf_structure 



![](https://image.ventix.top/java/image-20220513195335164.png)

#### main全局配置

从配置文件开始到 events 块之间的内容，主要会设置一些影响 nginx 服务器整体运行的配置指令，主要包括配置运行 Nginx 服务器的用户（组）、允许生成的 worker process 数，进程 PID 存放路径、日志存放路径和类型以及配置文件的引入等。

```bash

user www-data;         #运行worker子进程的用户
worker_processes auto; #子进程的个数
pid /run/nginx.pid;    #运行master的pid文件存放的路径
include /etc/nginx/modules-enabled/*.conf;  #将其他配置文件包含进来

```

这是 Nginx 服务器并发处理服务的关键配置，worker_processes 值越大，可以支持的并发处理量也越多，但是会受到硬件、软件等设备的制约

<br>



#### events事件模型

```bash

events {
	worker_connections 768;
}

```

events 块涉及的指令主要影响 Nginx 服务器与用户的网络连接，常用的设置包括是否开启对多 work process 下的网络连接进行序列化，是否允许同时接收多个网络连接，选取哪种事件驱动模型来处理连接请求，每个 word process 可以同时支持的最大连接数等。上述例子就表示每个 work process 支持的最大连接数为 768， 这部分的配置对 Nginx 的性能影响较大，在实际中应该灵活配置。



<br>



#### http模块配置

这算是 Nginx 服务器配置中最频繁的部分，代理、缓存和日志定义等绝大多数功能和第三方模块的配置都在这里。

1. http全局块
http 全局块配置的指令包括文件引入、MIME-TYPE 定义、日志自定义、连接超时时间、单链接请求数
上限等。
2. server块
这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机是完全一样的，该技术的
产生是为了节省互联网服务器硬件成本。
每个 http 块可以包括多个 server 块，而每个 server 块就相当于一个虚拟主机。
而每个 server 块也分为全局 server 块，以及可以同时包含多个 locaton 块。

<br>



### 2. Nginx核心配置详解

```bash

#user administrator administrators;  #配置用户或者组，默认为nobody nobody
#worker_processes 2;                 #允许生成的进程数，默认为1
#pid /nginx/pid/nginx.pid;           #指定nginx进程运行文件存放地址

# 制定日志路径，级别。这个设置可以放入全局块，http块，server块，
# 级别依次为：debug|info|notice|warn|error|crit|alert|emerg
error_log log/error.log debug;    

events {
    accept_mutex on; #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on; #设置一个进程是否同时接受多个网络连接，默认为off
    # use epoll;     #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections 1024;  #最大连接数，默认为512
}

http {
    include mime.types;                    #文件扩展名与文件类型映射表
    default_type application/octet-stream; #默认文件类型，默认为text/plain
    #access_log off;                       #取消服务日志

    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for';
    #自定义格式
    access_log log/access.log myFormat; #combined为日志格式的默认值
    sendfile on;                        #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;            #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;               #连接超时时间，默认为75s，可以在http，server，location块。

    upstream mysvr {    
        server 127.0.0.1:7878;
        server 192.168.10.121:3333 backup; #热备
    }

    error_page 404 https://www.baidu.com;  #错误页

    server {
        keepalive_requests 120; #单连接请求上限次数。
        listen 4545; #监听端口
        server_name 127.0.0.1; #监听地址

        location ~*^.+$ {      #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
            #root path;        #根目录
            #index vv.txt;     #设置默认页
            proxy_pass http://mysvr; #请求转向mysvr 定义的服务器列表
            deny 127.0.0.1;          #拒绝的ip
            allow 172.18.5.54;       #允许的ip
        }
    }
}

```

<br>



#### Nginx反向代理配置

```bash

http{
    ...
    ...
    #这部分是nginx作为反向代理服务器的配置
    server{
        listen 80;                   #nginx监听的端口
        server_name 192.168.45.151;  #虚拟服务器的识别标记，一般配置为本机ip
        
        location / {                 #代理设置地址
        	proxy_pass http://192.168.45.151:8080;
        }
    }
}

```

<br>



#### Nginx负载均衡配置

```bash

#负载均衡策略
# 1 轮询（默认）
# 2 weight
# 3 ip_hash
# 4 least_conn 最少连接方式
# 5 fair(第三方) 响应时间
# 6 url_hash (第三方)

```

<br>

```bash

# weight 代表权重, 默认为 1,权重越高被分配的客户端越多
...
upstream demo{
    server 192.168.45.151:8080 weight=2;
    server 192.168.45.151:8081 weight=1;
}
...

```

<br>

```bash

#ip_hash 每个请求按访问 ip 的 hash 结果分配，这样每个访客固定访问一个后端服务器，可以解决session 的问题。例如：
...
upstream demo{
    ip_hash;
    server 192.168.45.151:8080;
    server 192.168.45.151:8081;
}
...

```

<br>



### 3. Nginx缓存配置

Nginx从0.7.48版本开始，支持了类似Squid的内容缓存功能。这个缓存是把URL及相关组合当作Key，用md5编码哈希后保存在硬盘上，所以它可以支持任意URL链接，同时也支持404/301/302这样的非200状态码。

nginx缓存配置：

```bash

...
http{
    ...
    #声明一个cache缓存节点的内容，levels 在 /path/to/cache/ 设置了一个两级层次结构的目录。 
    #设置Web缓存区名称为my_cache，内存缓存空间大小为200MB，1天没有被访问的内容自动清除，硬盘缓存空间大小为30GB。
    proxy_cache_path /data0/my_cache levels=1:2 keys_zone=my_cache:200m inactive=1d max_size=30g;
    server{
        ...
        location / {
            proxy_cache my_cache;
            proxy_cache_key $uri;
            proxy_cache_valid 200 206 304 301 302 10d;
        }
        ...
    }
}

```



<br>



### 4. Nginx配置SSL证书

前置条件：需要已备案域名，SSL证书。上传证书后配置`nginx.conf` (注意：Nginx安装时要配置`--with-http_ssl_module`)

```properties
server {
    #SSL 访问端口号为 443
    listen 443 ssl; 
 #填写绑定证书的域名
    server_name cloud.tencent.com; 
 #证书文件名称
    ssl_certificate 1_cloud.tencent.com_bundle.crt; 
 #私钥文件名称
    ssl_certificate_key 2_cloud.tencent.com.key; 
    ssl_session_timeout 5m;
 #请按照以下协议配置
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2; 
 #请按照以下套件配置，配置加密套件，写法遵循 openssl 标准。
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE; 
    ssl_prefer_server_ciphers on;
    location / {
    #网站主页路径。此路径仅供参考，具体请您按照实际目录操作。
        root html; 
        index  index.html index.htm;
    }
}
```

<br>



## 三 LVS与Keepalived










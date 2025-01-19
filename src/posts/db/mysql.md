---
article: true
date: 2020-05-09
category:
  - Database
  - MySQL
tag:
  - Database
  - MySQL
shortTitle: MySQL数据库
title: MySQL数据库 | 起源和分支 | 应用架构演变
---



MySQL5.7文档：https://dev.mysql.com/doc/refman/5.7/en/ 

MySQL8文档：https://dev.mysql.com/doc/refman/8.4/en/ 



## MySQL起源和发展


MySQL 是最流行的关系型数据库软件之一，由于其体积小、速度快、开源免费、简单易用、维护成本低，在集群架构中易于扩展、高可用，因此深受开发者和企业的欢迎。


### MySQL发展历程

| 时间               | 事件                                                                                                                                                                                                 |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1979年           | 当时瑞典的 Monty Widenius 在 Tcx DataKonsult 公司工作，他开发了一款名为 Unireg 的工具，它是一个面向报表的存储引擎，利用索引顺序来读取数据，这也是 ISAM 存储引擎算法的前身。                                                                 |
| 1985年           | Monty 和 David Axmart 等几个小伙子成立了一家公司 (MySQL AB 前身)，研发出了 ISAM(Indexed Sequential Access Method) 存储引擎工具。                                                                                           |
| 1990年           | 客户要求 ISAM 工具能提供 SQL 接口，于是 Monty 找到了 David Hughes(mSQL 的发明人) 商讨合作事宜，后来发现 mSQL 的速度也无法满足需求。于是 Monty 决心自己重写一个 SQL 支持，由此着手 MySQL 设计和研发。                                       |
| 1996年           | Monty 与 David Axmart 一起协作，开发出 MySQL 第一个版本 1.0。                                                                                                                                        |
| 1996.10     | MySQL 3.1 发布了，没有 2.x 版本。最开始只提供了 Solaris 下的二进制版本。同年 11 月发布了 Linux 版本。                                                                                                     |
| 1999-2000      | Monty、Allan 和 David 三人在瑞典创建了 MySQL AB 公司，并且与 Sleepycat 合作开发出引入了 BDB 引擎，MySQL 从此开始支持事务处理了。                                                                                             |
| 2000年           | MySQL 公布了自己的源代码，并采用 GPL(GNU General Public License) 许可协议正式开源。                                                                                                                     |
| 2000.04      | MySQL 对旧的存储引擎 ISAM 进行了整理，命名为 MyISAM。                                                                                                                                                  |
| 2001年           | Heikki Tuuri 向 MySQL 建议集成他的 InnoDB 存储引擎，这个引擎同样支持事务处理，还支持行级锁。MySQL 与 InnoDB 正式结合版本是 4.0。至此 MySQL 已集成了 MyISAM 和 InnoDB 两种大主力引擎。                                           |
| 2005.10     | MySQL 5.0 版本发布，这是 MySQL 历史上最有里程碑意义的一个版本，在 5.0 版本加入了游标、存储过程和触发器的支持。                                                                                               |
| 2008.01      | MySQL AB 公司被 Sun 公司以 10 亿美金收购，MySQL 数据库进入 Sun 时代。                                                                                                                                 |
| 2009.04      | Oracle 公司以 74 亿美元收购 Sun 公司，自此 MySQL 数据库进入 Oracle 时代，而其第三方的存储引擎 InnoDB 早在 2005 年就被 Oracle 公司收购。                                                                                   |
| 2010.04      | 发布了 MySQL 5.5 版本。Oracle 对 MySQL 版本重新进行了划分，分成了社区版和企业版。默认引擎更换为 InnoDB、增加表分区等。                                                                                       |
| 2013.02      | MySQL 5.6 首个正式版 5.6.10 发布。MySQL 5.6 对 InnoDB 引擎进行了改造，提供全文索引功能，使 InnoDB 适合各种应用场景。                                                                                         |
| 2015.10     | MySQL 5.7 首个 GA 正式版 5.7.9 发布。                                                                                                                                                                  |
| 2016.09      | MySQL 8.0 首个开发版发布，增加了数据字典、账号权限角色表、InnoDB 增强、JSON 增强等等。                                                                                                                   |
| 2018.04      | MySQL 8.0 首个 GA 正式版 8.0.11 发布。                                                                                                                                                                 |


### MySQL主流分支


MySQL从最初的1.0、3.1到后来的8.0，发生了各种各样的变化。

![](https://image.ventix.top/img02/20220114231545605.png)

- 被Oracle收购后，MySQL的版本演化出了多个分支，除了需要付费的MySQL企业版本，还有很多MySQL社区版本。
- 还有一条分支非常流行的开源分支版本叫Percona Server，它是MySQL的技术支持公司Percona推出的，也是在实际工作中经常碰到的。Percona Server在MySQL官方版本的基础上做了一些补丁和优化，同时推出了一些工具。
- 另外一个非常不错的版本叫MariaDB，它是MySQL的公司被Oracle收购后，MySQL的创始人Monty先生，按原来的思路重新写的一套新数据库，同时也把 InnoDB 引擎作为主要存储引擎，也算 MySQL 的分支。



### MySQL应用架构演变

- 架构V1.0 - 单机单库
    - 数据量太大，超出一台服务器承受
    - 读写操作量太大，超出一台服务器承受
    - 一台服务器挂了，应用也会挂掉（可用性差）

- 架构V2.0 - 主从架构
主库抗写压力，通过从库来分担读压力，对于写少读多的应用，V2.0主从架构完全能够胜任。
    - 数据量太大，超出一台服务器承受
    - 写操作太大，超出一台M服务器承受

- 架构V3.0 - 分库分表

    - 对于V1.0和V2.0遇到写入瓶颈和存储瓶颈时，可以通过水平拆分来解决，水平拆分和垂直拆分有较大区别，垂直拆分拆完的结果，每一个实例都是拥有全部数据的，而水平拆分之后，任何实例都只有全量的1/n的数据。
    - 水平拆分后数据如何路由成为一个关键问题， 一般可以采用范围拆分，List拆分、Hash拆分等。如何保持数据的一致性也是个难题。
    ![](https://image.ventix.top/img02/20220114233526259.png)

- 架构V4.0 - 云数据库
    对于数据存储的MySQL来说，如何让其成为一个saas（Software as a Service）是关键点。
    ![](https://image.ventix.top/img02/20220114233547664.png)
    MySQL作为一个saas服务，服务提供商负责解决可配置性，可扩展性，多用户存储结构设计等问题

## MySQL安装和配置

MySQL是一个C/S架构的软件，我们安装的MySQL 是服务端。

::: tabs

@tab Windows平台

下载MySQL：https://dev.mysql.com/downloads/mysql/

![](https://image.ventix.top/java/image-20220318112150056.png)

Windows平台下的安装步骤:

将压缩包解压到需要安装的目录，然后执行以下步骤：

1. 新建配置文件 my.ini ，存放的路径为MySQL的根目录，文件内容如下：
  ```bash
    [client]
    port=3306

    [mysql]
    default-character-set=utf8

    [mysqld]
    character-set-server=utf8
    default-storage-engine=INNODB
    explicit_defaults_for_timestamp=true
    basedir = D:\Develop\Database\mysql-5.7.37
    datadir = D:\Develop\Database\mysql-5.7.37\data
  ```

2. 配置环境变量 （先检查有无正确的环境变量，若没有则需要设置）

	打开MySQL的bin目录，复制此路径，添加到环境变量


3. 初始化MySQL（生成data目录）命令行执行如下命令：(以下命名全部在以管理员模式打开的)
```bash
mysqld --initialize-insecure
```
	
	
4. 注册MySQL服务
```bash
mysqld -install
```
	
5. 启动MySQL服务
```bash
net start mysql
```

6. 修改默认账户密码
```bash
mysqladmin -u root password 123456
```

7. 登录使用 
```bash	
mysql -uroot -p
```

8. 卸载MySQL：
```bash
net stop mysql

mysqld -remove mysql
```	
最后删除MySQL目录及相关的环境变量即可



安装MySQL：参照blog https://blog.csdn.net/drizzletowne/article/details/120896774



@tab:active WSL2-Ubuntu

微软官网示例：https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-database


**问题一**：启动MySQL服务时提示：`su: warning: cannot change directory to/nonexistent...`

主要原因是MySQL 用户的主目录问题：

先停止MySQL服务：`sudo systemctl stop mysql` 或 `sudo service mysql stop`

```bash
getent passwd mysql                      
# 查看当前用户的主目录：mysql:x:113:120:MySQL Server,,,:/nonexistent:/bin/false

sudo usermod -d /var/lib/mysql/ mysql    # 修改用户的主目录
# 修改主目录之前，请确保 /var/lib/mysql/ 目录已经存在，并且是 MySQL 数据文件的正确存放位置
```
修改完后启动MySQL服务：`sudo service mysql start`


更多问题参照：[WSL2 Ubuntu 安装Mysql 避坑记录](https://zhuanlan.zhihu.com/p/654729453)


@tab Linux手动安装

下为Linux通用版本下载选项（Windows类似）：

![](https://image.ventix.top/java/image-20220318084801233.png)


Linux平台手动安装MySql:

目标：将 `mysql5.7` 安装到  `/usr/local/mysql` (不建议安装到其他位置，可能会导致socket连接失败)

准备：在`/usr/local/` 目录下创建 `mysql` 和 `software` 目录
	

1. 下载 mysql的压缩包 (或上传自己已下载的压缩包到指定目录即可)
```bash
cd /usr/local/software
wget http://dev.MySQL.com/get/Downloads/MySQL-5.7/mysql-5.7.37-Linux-glibc2.12-x86_64.tar.gz
```

2、解压并复制到 mysql目录
```bash
tar -xvf mysql-5.7.37-Linux-glibc2.12-x86_64.tar.gz

mv ./mysql-5.7.37-linux-glibc2.12-x86_64/* /usr/local/mysql/
```


3、安装依赖、创建mysql用户组及其用户
```bash
yum install libaio   （Ubuntu使用：sudo apt-get install libaio1）

groupadd mysql
useradd -r -g mysql -s /bin/false mysql
```


4、创建相关目录、设置权限、初始化mysql 
```bash
cd /usr/local/mysql/

mkdir mysql-files
chown mysql:mysql mysql-files
chmod 750 mysql-files

bin/mysqld --initialize --user=mysql  # 记住末尾自动生成的root密码 如：lZw.qSdCS7pV
bin/mysql_ssl_rsa_setup
bin/mysqld_safe --user=mysql &
```

5. 配置环境变量
```bash
vim /etc/profile.d/mysql.sh  # 在里面加入: 
export PATH=$PATH:/usr/local/mysql/bin

source  /etc/profile  # 使用source命令使修改立刻生效：  
```

6. 将mysql添加到启动项
```bash
cp support-files/mysql.server /etc/init.d/mysql.server

chkconfig --add mysql.server  （ 或 systemctl enable mysql.server）
```

7. 使用 （首次使用需要先修改密码）
```bash
mysql -uroot -p

mysql> alter user user() identified by "123456";
```

8. 启动、关闭和重启
```bash
/etc/init.d/mysql.server start
/etc/init.d/mysql.server stop
/etc/init.d/mysql.server restart
```

9. 其他常用命令
```bash
>mysql status;                            # 查看mysql基本信息
>mysql SHOW VARIABLES LIKE 'character%';  # 查看数据库字符集相关设置信息
```

**Linux下的安装参考**：https://dev.mysql.com/doc/refman/5.7/en/binary-installation.html



简单配置mysql:

```bash
vi /etc/my.cnf   # 添加如下信息：

[client]
port=3306

[mysql]
default-character-set=utf8

[mysqld]
character-set-server=utf8
default-storage-engine=INNODB
```

【注意】关于Linux下没有my.cnf的情形：从5.7.18开始官方不再二进制包中提供my-default.cnf文件。



<br/>



<span style="font:normal bold 22px arial,sans-serif;color:blue">Navicat无法连接Mysql时：</span> 

```shell

1. 打开数据库：use mysql。检索 user 和 host 字段
mysql> use mysql;
mysql> select user, host from user; 

2. 如果没有 user=root ，host = % 的用户，则执行下面语句：
mysql> update user set host='%' where user='root';

3. 给 root 授权（所有权限）, 并让赋予的权限立即生效
mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;
mysql> flush   privileges;

```


@tab Linux平台-RPM

[CentOS7安装MySQL8](https://blog.csdn.net/weixin_47940024/article/details/130405027)

:::




### MySql配置文件

查看mysql启动时读取`my.cnf`配置文件的目录

```bash
mysql --help|grep 'my.cnf'      
```

在 MySQL 中，如果某个配置项在多个配置文件中都出现了，MySQL 服务器会按一定的顺序读取这些配置文件，并且后读取的配置文件中的设置会覆盖先前读取的相同配置项。这意味着即使某个配置项在多个文件中出现，最终生效的是最后读取的那个文件中的值。

::: info MySQL配置文件读取顺序
MySQL 服务器在启动时会按以下顺序读取配置文件：

1. **命令行参数**：通过命令行传递的选项。
2. **环境变量**：例如 `MYSQL_TCP_PORT` 和 `MYSQL_UNIX_PORT`。
3. **全局配置文件**：
   - `/etc/my.cnf`
   - `/etc/mysql/my.cnf`（某些 Linux 发行版）
   - `SYSCONFDIR/my.cnf`（编译时指定的系统配置目录）
4. **用户特定配置文件**：
   - `~/.my.cnf`（当前用户的主目录下的隐藏文件）

**优先级和覆盖规则**：
- **最先读取**：最先读取的是 `/etc/my.cnf` 文件，最后是`~/.my.cnf`.
- **保留的配置**：最终保留的是最后一个读取到的配置文件中的值。
:::


**配置文件结构与内容**：

MySQL 的配置文件通常由多个节（sections）组成，每个节针对不同的功能进行配置。常见的节包括 `[mysqld]`、`[client]`、`[mysql]` 和 `[mysqld_safe]` 等。以下是一个示例配置文件 `/etc/my.cnf`，包含了常用的关键配置项：

```ini
# [client] 节：用于客户端工具（如 mysql 命令行工具）的全局设置
[client]
# 默认字符集：设置客户端默认字符集为 utf8mb4，支持更多字符，包括 Emoji
default-character-set=utf8mb4

# [mysql] 节：用于 mysql 命令行工具的特定设置
[mysql]
# 默认字符集：设置 mysql 命令行工具的默认字符集为 utf8mb4
default-character-set=utf8mb4

# [mysqld] 节：用于 MySQL 服务器的主要设置
[mysqld]
# 服务器监听的 IP 地址：0.0.0.0表示服务器监听所有网络接口
bind-address = 0.0.0.0

# 数据目录：指定 MySQL 数据文件的存储目录
datadir = /var/lib/mysql

# 错误日志文件：指定错误日志文件的位置
log_error = /var/log/mysql/error.log

# 慢查询日志
slow_query_log = 1   # 启用慢查询日志
slow_query_log_file = /var/log/mysql/slow-query.log  # 指定慢查询日志文件的位置
long_query_time = 2  # 慢查询的时间阈值，单位为秒

# 二进制日志
log_bin=/var/lib/mysql/mysql-binlog
binlog-format=ROW
server-id=1
expire_logs_days =30

# InnoDB 设置
innodb_buffer_pool_size = 128M  # InnoDB 缓冲池大小
innodb_log_file_size = 48M    # InnoDB 日志文件大小
innodb_flush_log_at_trx_commit = 1  # 每个事务提交时刷新日志到磁盘

# 最大连接数
max_connections = 150

# 字符集
character-set-server = utf8mb4         # 服务器默认字符集
collation-server = utf8mb4_unicode_ci  # 服务器默认排序规则

# 性能优化
query_cache_size = 0  # 禁用查询缓存
table_open_cache = 2000  # 表缓存大小
tmp_table_size = 16M  # 内存临时表的大小
max_heap_table_size = 64M  # 用户创建的内存表的最大大小

# 安全相关
skip-name-resolve  # 禁用 DNS 解析
local-infile = 0  # 禁用本地文件加载

# [mysqld_safe] 节：用于 mysqld_safe 启动脚本的设置
[mysqld_safe]
# 错误日志文件的位置
log-error = /var/log/mysql/error.log
# 设置打开文件的限制
open-files-limit = 1024

# [mysqldump] 节：用于 mysqldump 工具的设置
[mysqldump]
# 快速导出
quick
# 允许最大数据包大小
max_allowed_packet = 16M
```




### MySql常用命令

MySQL 客户端提供了丰富的命令来帮助你管理数据库、执行 SQL 语句、查看数据库信息等：

**1. 连接 MySQL 服务器**

```sh
mysql -u username -p
```

- `-u`: 指定用户名。
- `-p`: 提示输入密码。

附加参数:

```sh
mysql -u username -p -h hostname -P port
```

- `-h`: 指定服务器的主机名或 IP 地址。
- `-P`: 指定 MySQL 服务器的端口号，默认为 `3306`。

显示当前连接的 MySQL 版本：
```sql
SELECT VERSION();           
```
帮助命令和退出客户端：
```bash
HELP command_name;   --  显示帮助信息

EXIT;                -- 退出 MySQL 客户端 还可以使用 QUIT;
```

**2. 使用数据库**

查看数据库列表，并选择需要使用的数据库：
```sql
SHOW DATABASES;        -- 显示数据库列表

USE database_name;     -- 选择数据库

SELECT DATABASE();     -- 查看当前使用的数据库
```


创建/ 删除数据库：

```sql
CREATE DATABASE database_name;

DROP DATABASE database_name;
```


查看表结构:

```sql
DESCRIBE table_name;

SHOW COLUMNS FROM table_name;

DROP TABLE table_name;     -- 删除表
```


**3. 当前会话用户**

```sql
SELECT USER();                -- 查看当前会话的用户

SELECT CURRENT_USER();        -- 查看当前会话的用户名和主机

SHOW STATUS;                  -- 查看当前会话的状态
SHOW SESSION STATUS;          -- 显示当前会话的会话状态
SHOW GLOBAL STATUS;           -- 显示当前会话的全局状态

SHOW VARIABLES;               -- 查看当前会话的变量
SHOW SESSION VARIABLES;       --显示当前会话的会话变量
SHOW GLOBAL VARIABLES;        -- 显示当前会话的全局变量


SHOW WARNINGS;                -- 查看当前会话的警告
SHOW ERRORS;                  --  查看当前会话的错误


SET SESSION variable_name = value;   -- 设置会话变量
SET @variable_name = value;          -- 设置会话变量
SET GLOBAL variable_name = value;    -- 设置全局变量

SHOW VARIABLES LIKE 'sql_mode';      -- 查看当前会话的 SQL 模式
SET sql_mode = 'mode_value';         -- 设置当前会话的 SQL 模式

SHOW VARIABLES LIKE 'character_set_client';    -- 查看当前会话的字符集
SET NAMES 'charset';                           -- 设置当前会话的字符集

SHOW VARIABLES LIKE 'collation_connection';    -- 查看当前会话的编码
SET collation_connection = 'encoding';         -- 设置当前会话的编码
```


**4. sql文件**

```sql
SOURCE file_path;   -- 执行 SQL 文件

-- 导出数据到文件
SELECT * INTO OUTFILE '/path/to/file.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '"'
ESCAPED BY '\\' LINES TERMINATED BY '\n' FROM table_name;
```




### 创建/删除用户

**1. 创建用户**: 在 MySQL 中创建用户的基本语法如下：

```sql
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
```

- `username`：用户名。
- `host`：用户允许连接的主机地址。可以是具体的 IP 地址、域名或者 `'%'` 表示任何主机。
- `password`：用户的密码。

示例: 创建一个名为 `newuser` 的用户，允许从任何主机连接，并设置密码为 `newpass`：

```sql
CREATE USER 'newuser'@'%' IDENTIFIED BY 'newpass';
```

**2. 删除用户**: 删除用户的语法如下：

```sql
DROP USER 'username'@'host';
```

示例: 删除名为 `newuser` 的用户：

```sql
DROP USER 'newuser'@'%';
```




### MySQL用户表

在 MySQL 中，用户信息存储在 `mysql` 系统数据库中的几个表中。这些表主要用于存储用户账号信息、权限和认证数据。

1. **`mysql.user`**：存储用户的用户名、主机名、密码以及其他认证信息。
2. **`mysql.db`**：存储用户对特定数据库的权限。
3. **`mysql.tables_priv`**：存储用户对特定表的权限。
4. **`mysql.columns_priv`**：存储用户对特定列的权限。
5. **`mysql.profiles`**：存储用户的资源限制。
6. **`mysql.plugin`**：存储用户的插件信息。

**1. 查看用户信息**
```sql
SELECT Host, User FROM mysql.user;                            -- 查看所有用户

SELECT Host, User FROM mysql.user WHERE User = 'username';    -- 查看特定用户
```

**2. 修改用户密码**

```sql
ALTER USER 'username'@'host' IDENTIFIED BY 'new_password';       -- 使用 `ALTER USER`

SET PASSWORD FOR 'username'@'host' = PASSWORD('new_password');   -- 使用 `SET PASSWORD`
```

**3. 修改用户属性**

```sql
-- 修改用户的最大连接数
ALTER USER 'username'@'host' MAX_QUERIES_PER_HOUR 10000 MAX_CONNECTIONS_PER_HOUR 1000 MAX_UPDATES_PER_HOUR 1000 MAX_USER_CONNECTIONS 10;

-- 修改用户的默认角色
ALTER USER 'username'@'host' DEFAULT ROLE 'role_name';
```

注意：在 MySQL 8.0 中引入了默认角色的概念，可以使用 `DEFAULT ROLE` 来设置用户的默认角色。



**4. 禁用或启用用户** 

```sql
ALTER USER 'username'@'host' ACCOUNT LOCK;                          -- 禁用用户

ALTER USER 'username'@'host' ACCOUNT UNLOCK;                        -- 启用用户

DROP USER 'username'@'host';                                        -- 删除用户
```




### 重置root密码

无论是在 MySQL 5.7 还是 MySQL 8.0 中，设置密码的方法基本相同：

1. **登录 MySQL**

   首先以 root 用户登录 MySQL：

   ```sh
   sudo mysql -u root -p
   ```

2. **设置密码**

   使用 `ALTER USER` 语句设置 root 用户的密码：

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
   ```

   或者，如果你需要为其他用户设置密码：

   ```sql
   CREATE USER '新用户名'@'localhost' IDENTIFIED BY '新密码';
   ```

   MySql5.7还可以使用下列方式：

    ```bash
    SET PASSWORD FOR 'username'@'localhost' = PASSWORD('新密码');
    # 或者
    SET PASSWORD FOR 'username'@'localhost' = '新密码';
    ```

3. **刷新权限**

   为了确保新设置的密码立即生效，需要刷新权限：

   ```bash
   FLUSH PRIVILEGES;
   ```

4. **退出 MySQL**

   退出 MySQL 命令行：

   ```bash
   EXIT;
   ```





### 用户权限设置

**权限授予**：授予用户权限的基本语法如下：

```sql
GRANT privileges ON database.table TO 'username'@'host' [WITH GRANT OPTION];
```

- `privileges`：可以是一个或多个权限的列表，如 `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `DROP`, `ALTER`, `INDEX`, `TRIGGER`, `EXECUTE`, `PROCESS`, `RELOAD`, `SHUTDOWN`, `FILE`, `REFERENCES`, `TRIGGER`, `CREATE TEMPORARY TABLES`, `LOCK TABLES`, `EVENT`, `TRIGGER`, `REPLICATION CLIENT`, `REPLICATION SLAVE`, `REPLICATION MASTER`, `REPLICATION SLAVE`, `REPLICATION CLIENT`, `REPLICATION SLAVE`, `CREATE VIEW`, `SHOW DATABASES`, `SUPER`, `PROXY`, `GRANT OPTION` 等。
- `database.table`：指定权限应用的对象。如果是 `*.*` 表示全局权限。
- `WITH GRANT OPTION`：允许用户授予其他用户相同的权限。

示例: 授予 `newuser` 对 `mydb` 数据库的 `SELECT` 和 `INSERT` 权限：

```sql
GRANT SELECT, INSERT ON mydb.* TO 'newuser'@'%' WITH GRANT OPTION;
```

**查询权限**：查询用户权限的基本语法如下：

```sql
SHOW GRANTS FOR 'username'@'host';
```

示例：查询 `newuser` 用户的权限：

```sql
SHOW GRANTS FOR 'newuser'@'%';
```

**撤销权限**：撤销用户权限的基本语法如下：

```sql
REVOKE privileges ON database.table FROM 'username'@'host';
```

示例：撤销 `newuser` 用户对 `mydb` 数据库的 `SELECT` 和 `INSERT` 权限：

```sql
REVOKE SELECT, INSERT ON mydb.* FROM 'newuser'@'%';
```




### 允许远程连接

MySQL的远程连接需要两个必要条件：

- 用户的 `Host` 字段设置为 `%` 或 指定的IP地址
- MySQL 服务器需要通过 `bind-address` 参数正确配置以监听相应的网络接口

由于MySQL的 `mysql.user` 表中的 `root` 用户的 `Host`属性默认为`localhost`, 意味着该用户只能在从本地访问数据库, 所以需要修改Host属性或者重新 新建一个用户，这里以新建用户为例：

```bash
create user 'root'@'%' identified by 'root';  # 或
create user 'root'@'%' identified with mysql_native_password by 'root';

grant all on *.* to 'root'@'%' with grant option;

flush privileges;
```
执行上述命令后，可使 `root` 用户从任何主机都可以连接到 `MySQL` 服务器，并且拥有所有数据库操作的最高权限。但此时还需要检查 `MySQL` 的 `bind-address` 配置：

```bash
SHOW VARIABLES LIKE 'bind_address';
# 如果是 127.0.0.1, 则需要修改my.cnf配置文件

# 查看所有配置文件的路径
mysql --help | grep my.cnf

sudo vim /etc/mysql/my.cnf
```
在配置文件中添加如下配置：
```bash
[mysqld]
bind-address = 0.0.0.0  # 监听所有网络接口
```

修改后重启MySQL服务即可

```bash
sudo systemctl restart mysql
```

::: warning [08001] Public Key Retrieval is not allowed
当使用客户端工具 连接 MySQL 时，如果遇到 `[08001] Public Key Retrieval is not allowed` 的错误，这通常是因为 MySQL 客户端尝试从服务器获取公钥以进行安全连接，但这个功能被禁用了。

MySQL 从 5.7.6 版本开始引入了 `RSA key pair` 用于更安全的密码交换。当客户端连接到服务器时，如果 `caching_sha2_password` 身份验证插件被使用（这是 MySQL 8.0 及以上版本的默认身份验证插件），并且客户端没有本地存储的公钥，那么它会尝试从服务器获取公钥。如果你的客户端配置禁止了公钥检索，就会出现这个错误。


#### 解决方法一：允许公钥检索
你可以在数据库连接设置中启用公钥检索。以DataGrip为例, 步骤如下：

1. 打开 DataGrip 并选择你的 MySQL 数据源。
2. 点击 "Edit" 按钮来编辑连接属性。
3. 在 "Advanced" 选项卡下找到 "Allow public key retrieval" 选项，并勾选它。
4. 保存设置并重新连接。


在开发场景中，`MySQL8+`可以使用可以使用 `allowPublicKeyRetrieval=true` 参数, 如:
```bash
jdbc:mysql://hostname:3306/db_name?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

#### 解决方法二：更改 MySQL 用户的身份验证插件
你可以将用户的身份验证插件更改为 `mysql_native_password`，这样就不需要公钥检索。

   ```bash
   ALTER USER 'your_username'@'%' IDENTIFIED WITH mysql_native_password BY 'your_password';

   FLUSH PRIVILEGES;
   ```

   将 `'your_username'` 替换为你要更改的用户名，将 `'your_password'` 替换为该用户的密码。

:::








## 数据库设计理论

### 数据完整性

数据完整性是数据库制定的了一些规范，是为了防止用户错误的输入（防止数据库出现错误的数据）

::: info 数据完整性

- **数据库的完整性**：保证存放到数据库中的数据是有效的 => 即在创建表时给表中添加约束


- **实体完整性**：标识每一行数据不重复。确保每个表中的每一行都是唯一的。通常通过设置主键来实现，主键字段不允许为空且必须唯一。

  - 实体：即表中的一行(一条记录)代表一个实体（entity）

  - 约束类型：*主键约束（primary key）*、 *唯一约束 (unique)* 、 *自动增长列 (auto_increment)* 

  <br/>

- **域完整性**：限制此单元格的数据正确。即确保列中的数据符合预定义的数据类型和约束条件。例如，年龄字段应该只能包含正整数。

  - 域完整性约束：数据类型 、非空约束（not null）、 默认值约束(default）

  <br/>

- **引用完整性（参照完整性）**：指外键，外键必须指向另一个表中的主键或唯一键。 
  - 外键约束：FOREIGN KEY

:::



常见约束：

| 约束            | 说明                               |
| --------------- | ---------------------------------- |
| null / not null | 字段是否可以为空                   |
| default         | 如果一个字段没有值，则使用默认值   |
| auto_increment  | 字段值从1开始，每次递增1，不会重复 |
| primary key     | 定义列为主键                       |
| unique          | 唯一键：不能重复，但可以为空       |
| comment         | 注释信息                           |

<br/>

语法示例（以MySQL为例）：

**主键约束（primary key）**：

```SQL
# 1. 在 CREATE TABLE 语句中，通过 PRIMARY KEY 关键字来指定主键
<字段名> <数据类型> PRIMARY KEY [默认值]

# 2. 或者是在定义完所有字段之后指定主键：
[CONSTRAINT <约束名>] PRIMARY KEY [字段名]

# 3. 在创建表时设置联合主键（所谓的联合主键，就是这个主键是由一张表中多个字段组成的）
PRIMARY KEY [字段1，字段2，…,字段n]

# 4. 在修改表时添加主键约束
ALTER TABLE <数据表名> ADD PRIMARY KEY(<字段名>);

# 删除主键约束
ALTER TABLE <数据表名> DROP PRIMARY KEY;
```

<br/>



**唯一约束 (unique)**：

```SQL
# 1. 在创建表时设置唯一约束
<字段名> <数据类型> UNIQUE

# 2. 在修改表时添加唯一约束
ALTER TABLE <数据表名> ADD CONSTRAINT <唯一约束名> UNIQUE(<列名>);

# 删除唯一约束
ALTER TABLE <表名> DROP INDEX <唯一约束名>;
```

<br/>



**自动增长列 (auto_increment)**：

```SQL
# 1. 给字段添加 AUTO_INCREMENT 属性来实现主键自增长
字段名 数据类型 AUTO_INCREMENT

# 2. 指定自增字段初始值
CREATE TABLE tb_student2 (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    PRIMARY KEY(ID)
)AUTO_INCREMENT=100;
```

- 默认情况下，AUTO_INCREMENT 的初始值是 1，每新增一条记录，字段值自动加 1。
- 一个表中只能有一个字段使用 AUTO_INCREMENT 约束，且该字段必须有唯一索引，以避免序号重复（即为主键或主键的一部分）
- AUTO_INCREMENT 约束的字段必须具备 NOT NULL 属性。
- AUTO_INCREMENT 约束的字段只能是整数类型（TINYINT、SMALLINT、INT、BIGINT 等）。
- AUTO_INCREMENT 约束字段的最大值受该字段的数据类型约束，如果达到上限，AUTO_INCREMENT 就会失效。

<br/>



**外键约束（foreign key）**: 

```SQL
[CONSTRAINT <外键名>] FOREIGN KEY 字段名 [，字段名2，…] REFERENCES <主表名> 主键列1 [，主键列2，…]
-- 例：
constraint fk_score_sid foreign key(sid) references student(id) );

-- 删除外键约束
ALTER TABLE <表名> DROP FOREIGN KEY <外键约束名>;
```

使用外键会影响效率：在插入子行的数据的时候，会去父表中查询。在删除父表中的数据的时候，会去子表中查询数据是否被使用。

在工作中，一般很少使用外键。外键虽然可以保证我们数据的正确性，但是会比较大程度上的影响效率。






### 三大范式

范式是数据库设计中用来减少数据冗余和提高数据一致性的标准。以下是三个最重要的范式：

1. **第一范式（1NF）**：确保每个表中的每个列都包含原子（不可再分）值。这意味着每个单元格只能包含一个值，不能包含列表或集合。
2. **第二范式（2NF）**：在满足第一范式的基础上，消除非主键列对部分主键的依赖。也就是说，所有非主键列必须完全依赖于整个主键。
3. **第三范式（3NF）**：在满足第二范式的基础上，消除非主键列之间的传递依赖。也就是说，非主键列之间不应存在依赖关系。

::: info 三大范式详解
- **第一范式**：指每一列保持 <span style='color:red;background:yellow;font-size:文字大小;font-family:字体;'>**原子性**</span>（每一列都是不可分割的基本数据，同一列中不能有多个值）每一个属性不可再分

  - 所谓第一范式（1NF)是指在关系模型中，对域添加的一个规范要求，所有的域都应该是原子性的，即数据库表的每一列都是不可分割的原子数据项，而不能是集合，数组，记录等非原子数据项。
  	
  - 在任何一个关系型数据库中，第一范式（1NF）是对关系模式的设计基本要求，一般设计时都必须满足第一范式(1NF)。不满足1NF的数据库就不是关系数据库。满足1NF的表必须要有主键且每个属性不可再分
  

  <br/>

- **第二范式**：确保数据库表中的每一列都和主键相关，而不能只与主键的某一部分相关（主要针对联合主键而言）。即指记录的**唯一性**。要求数据库表中的每个实例或行必须可以被唯一地区分。

  第二范式（2NF）要求数据库表中的每个实例或行必须可以被唯一地区分。为实现区分通常需要为表加上 一个列，以存储各个实例的唯一标识。这个唯一属性列被称为主关键字或主键、主码。 

  <br/>

- **第三范式**：属性不依赖于其它非主属性 [ 消除传递依赖 ]。即**非主键列之间不应存在依赖关系**
  （注：关系实质上是一张二维表，其中每一行是一个元组，每一列是一个属性 ）
  - 满足 第三范式（3NF）必须先满足第二范式（2NF）。
  
  - 第三范式（3NF）要求一个数据库表中不包含已在其它表中已包含的非主关键字信息。 即指字段不要冗余。
:::

【示例】不符合第三范式的表结构：
```sql
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,           -- 学生的唯一标识符（主键）
    StudentName VARCHAR(100),            -- 学生姓名
    DepartmentID INT,                    -- 学生所在系的唯一标识符
    DepartmentName VARCHAR(100)          -- 学生所在系的名称
);
```
在这个表结构中，DepartmentName 依赖于 DepartmentID，而不是直接依赖于主键 StudentID。这意味着 DepartmentName 的值是由 DepartmentID 决定的，而不是由 StudentID 决定的。这种依赖关系导致了数据冗余和潜在的不一致性。

::: tip 在实际的工作中，要不要去冗余字段呢？
适当的字段冗余可以帮助我们提高查询的效率，但是会影响到增删改的效率。是否冗余字段需要看具体的业务场景，假如在某个业务场景中：

- 查询的需求远大于增删改的需求，我们可以考虑适当的去冗余数据；

- 假如增删改的需求比查询的需求比重要高，那么这个时候就不应该冗余数据。

冗余字段的设计：==反范式化设计==
:::




### 多表设计原则

多表设计是数据库设计中的一个重要方面，通过合理地拆分数据表来减少数据冗余和提高查询效率。

::: tip 设计原则
1. **规范化**：遵循范式规则，减少数据冗余，提高数据一致性。
2. **性能优化**：合理设计索引，优化查询性能。
3. **安全性**：确保数据的安全性和隐私保护，使用适当的权限控制。
4. **可扩展性**：设计时考虑未来的扩展需求，确保系统的灵活性和可维护性。
:::

常见的多表设计模式包括：

1. **一对多关系**：一个表中的记录可以与另一个表中的多个记录相关联。例如，一个订单可以包含多个订单项。
     ```sql
     CREATE TABLE Orders (
         OrderID INT PRIMARY KEY,
         CustomerID INT,
         OrderDate DATE
     );

     CREATE TABLE OrderItems (
         ItemID INT PRIMARY KEY,
         OrderID INT,
         ProductID INT,
         Quantity INT,
         FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
     );
     ```

2. **多对多关系**：两个表中的记录可以相互关联。通常通过一个中间表来实现。
     ```sql
     CREATE TABLE Students (
         StudentID INT PRIMARY KEY,
         Name VARCHAR(100)
     );

     CREATE TABLE Courses (
         CourseID INT PRIMARY KEY,
         CourseName VARCHAR(100)
     );

     CREATE TABLE Enrollments (
         EnrollmentID INT PRIMARY KEY,
         StudentID INT,
         CourseID INT,
         FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
         FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
     );
     ```

3. **一对一关系**：一个表中的记录与另一个表中的一个记录相关联。通常通过共享主键来实现。
     ```sql
     CREATE TABLE Employees (
         EmployeeID INT PRIMARY KEY,
         FirstName VARCHAR(50),
         LastName VARCHAR(50)
     );

     CREATE TABLE Salaries (
         EmployeeID INT PRIMARY KEY,
         Salary DECIMAL(10, 2),
         FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
     );
     ```




















## MySQL常见问题




### 配置文件权限

在使用Docker安装MySQL的过程中发现配置文件不生效，查看日志`docker logs d71e2aab9816`发现：

```log
mysqld: [Warning] World-writable config file '/etc/mysql/my.cnf' is ignored.
```
为了方便，之前将主系统的挂载目录改成了 777 的权限，MySQL可能觉得不安全... 这里将配置文件权限改为 644 即可：
```bash
sudo chmod 644 /path/to/my.cnf
```
修改后，重启mysql即可：`docker restart d71e2aab9816`


















## 数据库备份与恢复

MySQL数据库的备份与恢复是数据库管理中的重要组成部分，它确保了数据的安全性和完整性。下面我将详细介绍如何进行MySQL数据库的备份和恢复。

**数据备份**

#### 1. 使用mysqldump命令
`mysqldump` 是一个非常强大的命令行工具，用于创建MySQL数据库的逻辑备份。它可以导出整个数据库、单个表或特定的数据集。

- **全库备份**：
  ```sh
  mysqldump -u username -p database_name > backup_file.sql
  ```
  这里 `username` 是你的数据库用户名，`database_name` 是要备份的数据库名称，`backup_file.sql` 是输出的SQL文件名。

- **指定表备份**：
  ```sh
  mysqldump -u username -p database_name table1 table2 > tables_backup.sql
  ```

- **包含数据库结构（不包括数据）**：
  ```sh
  mysqldump -u username -p --no-data database_name > structure_only.sql
  ```

- **压缩备份**：
  可以使用管道将输出直接传递给压缩工具，如gzip。
  ```sh
  mysqldump -u username -p database_name | gzip > backup_file.sql.gz
  ```

- **排除某些表**：
  如果需要备份整个数据库但排除一些特定的表，可以使用 `--ignore-table` 选项。
  ```sh
  mysqldump -u username -p --ignore-table=database_name.table_to_ignore database_name > partial_backup.sql
  ```

- **增量备份**：
  对于大型数据库，可能需要考虑增量备份。这通常涉及到二进制日志 (binary logs) 的复制。你可以设置 `binlog_format=ROW` 和启用二进制日志记录来支持增量备份。

#### 2. 物理备份
对于更大的数据库或者对性能有更高要求的情况，可以使用物理备份工具如 `Percona XtraBackup` 或者 MySQL Enterprise Backup。这些工具能够提供在线热备份，并且备份速度更快。

**数据恢复**

#### 1. 从逻辑备份恢复
恢复逻辑备份时，你只需要执行之前备份生成的SQL脚本。

- **全库恢复**：
  ```sh
  mysql -u username -p database_name < backup_file.sql
  ```

- **创建新数据库并恢复**：
  如果数据库不存在，你需要先创建数据库，然后恢复。
  ```sh
  mysql -u username -p -e "CREATE DATABASE new_database_name;"
  mysql -u username -p new_database_name < backup_file.sql
  ```

- **解压后再恢复**：
  如果备份是经过压缩的，需要先解压再恢复。
  ```sh
  gunzip < backup_file.sql.gz | mysql -u username -p database_name
  ```

::: info source命令
使用 `SOURCE` 命令是一种非常直接和方便的方式来恢复 MySQL 数据库，特别适用于逻辑备份（如由 `mysqldump` 创建的备份）。

假设你有一个名为 `mydatabase_backup.sql` 的备份文件，你可以按照以下步骤来恢复数据库：

1. **启动 MySQL 命令行客户端**：
   ```sh
   mysql -u username -p
   ```
   这将提示你输入密码。如果需要连接到特定的主机或端口，可以添加相应的选项，例如：
   ```sh
   mysql -h hostname -P port -u username -p
   ```

2. **选择数据库**（如果需要恢复到现有数据库中）：
   如果你的备份文件只包含数据而不包含创建数据库的语句，你需要先选择目标数据库：
   ```sql
   USE target_database_name;
   ```

3. **执行 `SOURCE` 命令**：
   使用 `SOURCE` 命令来执行备份文件中的所有 SQL 语句：
   ```sql
   SOURCE /path/to/mydatabase_backup.sql;
   ```
   注意路径必须是 MySQL 客户端所在服务器上的有效路径。如果你是从远程客户端连接到 MySQL 服务器，那么路径应该是 MySQL 服务器上的路径。

4. **检查结果**：
   执行完成后，可以通过查询数据库来验证数据是否正确恢复。

#### 注意事项

- 确保你有足够的权限来执行 `SOURCE` 命令以及脚本中的 SQL 语句。
- 如果备份文件很大，可能需要一些时间来完成恢复过程。
- 在执行 `SOURCE` 之前，确保目标数据库已经存在（除非备份文件本身包含了创建数据库的语句）。
- 如果遇到错误，可以查看 MySQL 的错误日志来获取更多信息。
:::


#### 2. 从物理备份恢复
物理备份的恢复过程依赖于使用的工具，通常涉及准备步骤和应用二进制日志。例如，使用 Percona XtraBackup 时：

- **准备备份**：
  ```sh
  xtrabackup --prepare --target-dir=/path/to/backup
  ```

- **停止MySQL服务**：
  在恢复之前，需要停止MySQL服务。

- **移动数据文件**：
  将备份的数据文件移动到MySQL数据目录中。

- **启动MySQL服务**：
  启动MySQL服务后，根据情况应用二进制日志以确保数据的一致性。












## xxxxxxxxxxxxx

1. [全面理解MySQL架构](https://note.youdao.com/ynoteshare/index.html?id=b83414b7060c7b4e894bb7de5a419e1c)

2. [深入理解Mysql索引底层数据结构与算法](https://note.youdao.com/ynoteshare/index.html?id=3c878c0f3dd4965d00bcce82b41043b3)

3. [Explain详解与索引优化最佳实践](https://note.youdao.com/s/YoQZCEjl)
   [Explain笔记补充](https://note.youdao.com/s/FMi8YpR7)

4. [Mysql索引优化实战一](https://note.youdao.com/ynoteshare/index.html?id=d2e8a0ae8c9dc2a45c799b771a5899f6)
   [索引优化补充](https://note.youdao.com/ynoteshare/index.html?id=2218c2f41c8e2d9f3effdf734ee586af)
   [Mysql索引优化实战二](https://note.youdao.com/ynoteshare/index.html?id=df15aba3aa76c225090d04d0dc776dd9)

5. [Mysql事务隔离级别与锁机制](https://note.youdao.com/ynoteshare/index.html?id=354ae85f3519bac0581919a458278a59)
   [事务补充](https://note.youdao.com/ynoteshare/index.html?id=ac14495f09862f59cfa7b143380ffc67)

6. [MVCC与BufferPool缓存机制](https://note.youdao.com/ynoteshare/index.html?id=b36b975188fadf7bfbfd75c0d2d6b834)

7. [Innodb底层原理与Mysql日志机制深入剖析](https://note.youdao.com/ynoteshare/index.html?id=f030268c54f18d2116837f8f3ef045bf)

8. [Mysql全局优化与Mysql 8.0新特性详解](https://note.youdao.com/s/TZVzqihW)

9. [MySQL8.0主从复制原理分析与实战](https://note.youdao.com/ynoteshare/index.html?id=94a5d21f7fcecc42f9660929128fea69)

10. [Mysql8.0高可用集群架构实战]()
---
article: true
date: 2021-02-09
category:
  - Database
  - MySQL
tag:
  - Database
  - MySQL
  - Binlog
  - mysqlbinlog
shortTitle: Binlog
title: mysqlbinlog | Binlog文件操作 | 数据恢复
---


## Binlog文件操作

使用MySQL内部命令查看 Binlog 文件基本信息：

```bash
show binary logs;    # 管理和监控所有的 binlog 文件, 等价于show master logs;

show master status;  # 仅显示当前正在使用的 binlog 文件及其状态信息

show binlog events;
show binlog events in 'mysql-binlog.000001'
```

Binlog文件记录了所有对数据库进行的更改操作，包括 DDL（数据定义语言）和 DML（数据操作语言）语句。这些更改以事件的形式存储在 binlog 文件中，每个事件称为一个 Log Event。
`SHOW BINLOG EVENTS;` 命令用于查看 binlog 文件中的这些事件。

```bash
mysql> show binlog events;
+---------------------+-----+----------------+-----------+-------------+---------------------------------------+
| Log_name            | Pos | Event_type     | Server_id | End_log_pos | Info                                  |
+---------------------+-----+----------------+-----------+-------------+---------------------------------------+
| mysql-binlog.000001 |   4 | Format_desc    |         1 |         123 | Server ver: 5.7.44-log, Binlog ver: 4 |
| mysql-binlog.000001 | 123 | Previous_gtids |         1 |         154 |                                       |
| mysql-binlog.000001 | 154 | Anonymous_Gtid |         1 |         219 | SET @@SESSION.GTID_NEXT= 'ANONYMOUS'  |
| mysql-binlog.000001 | 219 | Query          |         1 |         291 | BEGIN                                 |
| mysql-binlog.000001 | 291 | Table_map      |         1 |         352 | table_id: 109 (demo.employees)        |
| mysql-binlog.000001 | 352 | Update_rows    |         1 |         460 | table_id: 109 flags: STMT_END_F       |
| mysql-binlog.000001 | 460 | Xid            |         1 |         491 | COMMIT /* xid=149 */                  |
+---------------------+-----+----------------+-----------+-------------+---------------------------------------+
```



### mysqlbinlog

`mysqlbinlog` 是一个用于处理binlog文件的工具，它能够解析并显示 binlog 文件中的内容

mysqlbinlog相关文档：[mysqlbinlog](https://dev.mysql.com/doc/refman/8.4/en/mysqlbinlog.html) ，[mysqlbinlog Row Event Display](https://dev.mysql.com/doc/refman/8.4/en/mysqlbinlog-row-events.html)


::: important 使用 mysqlbinlog 查看binlog日志内容示例及参数解释
```bash
mysqlbinlog --no-defaults -v --base64-output=decode-rows /docker/mysql/mysql5.7/data/mysql-binlog.000001
```

- **`--no-defaults`**：忽略默认配置文件, 确保命令的行为完全由命令行参数控制

- **`-v` (verbose)**：详细模式，增加输出的详细程度，包括更多的元数据和上下文信息

- **`--base64-output=decode-rows`**：解码基于行的日志，当 binlog 使用 ROW 格式时，MySQL 会将更改的数据序列化为 Base64 编码的字符串存储在 binlog 中。此选项指示 `mysqlbinlog` 解码这些 Base64 字符串，并显示实际的行数据变化。

还可以在上述命令末尾加上以下两个查询条件：
```bash
start-datetime="2021-01-22 00:00:00" stop-datetime="2021-02-01 00:00:00" 

start-position="100" stop-position="1230"
```
:::

以下是执行 `update employees set email='dee.email@example.com' where  customer_id = 1;` 这句SQL相关的部分部分Binlog内容：

```log
BEGIN
/*!*/;
# at 291
#210117 18:38:04 server id 1  end_log_pos 352 CRC32 0xb48d0531  Table_map: `demo`.`employees` mapped to number 109
# at 352
#210117 18:38:04 server id 1  end_log_pos 460 CRC32 0x33bb9cf4  Update_rows: table id 109 flags: STMT_END_F
### UPDATE `demo`.`employees`
### WHERE
###   @1=1
###   @2='John'
###   @3='Doe'
###   @4='new.email@example.com'
### SET
###   @1=1
###   @2='John'
###   @3='Doe'
###   @4='dee.email@example.com'
# at 460
#210117 18:38:04 server id 1  end_log_pos 491 CRC32 0xa2da7c66  Xid = 149
COMMIT/*!*/;
SET @@SESSION.GTID_NEXT= 'AUTOMATIC' /* added by mysqlbinlog */ /*!*/;
DELIMITER ;
# End of log file
```





::: details Docker容器内MySQL没有 mysqlbinlog 命令解决办法
#### 1. 使用宿主机的mysqlbinlog命令查看 容器映射到宿主机的 Binlog 文件

```bash
sudo mysqlbinlog --no-defaults -v --base64-output=decode-rows /docker/mysql/mysql5.7/data/mysql-binlog.000001
```

#### 2. 如果宿主机没有安装MySQL，可以单独安装 mysql-client

```bash
sudo apt-get install mysql-client
```
:::




### 删除Binlog文件

```bash
# 删除当前的binlog文件
reset master;

# 删除指定日志文件之前的所有日志文件，下面这个是删除6之前的所有日志文件，当前这个文件不删除
purge master logs to 'mysql-binlog.000006';

# 删除指定日期前的日志索引中binlog日志文件
purge master logs before '2021-01-21 14:00:00';
```



## Binlog恢复数据示例


[MySQL使用binlog日志恢复误删的数据](https://www.modb.pro/db/1782939026445635584)


[Innodb底层原理与Mysql日志机制深入剖析](https://note.youdao.com/ynoteshare/index.html?id=f030268c54f18d2116837f8f3ef045bf)
---
article: true
date: 2023-02-09
category:
  - Database
  - MySQL
tag:
  - Database
  - MySQL
  - Transaction
  - Locks
shortTitle: MySQL事务和锁监控
title: MySQL事务和锁监控 | 锁的范围 | 死锁分析
---

## MySQL事务和锁监控

`information_schema` 是 MySQL 提供的一个系统数据库，用于存储有关数据库结构和元数据的信息

```sql
-- 显示当前所有活跃的 innodb 事务信息
select * from information_schema.innodb_trx;
```

`performance_schema` 是一个动态性能监控工具，在 8.0 版本中经历了一系列重要的改进和增强

```sql
-- 显示所有前台线程的信息  查看事务事件
select * from performance_schema.threads where type = 'foreground';
--显示当前活动事务的状态信息
select * from performance_schema.events_transactions_current;
```

关于这两个系统数据库更多的信息参照：[Information_Schema](https://dev.mysql.com/doc/refman/8.4/en/innodb-information-schema.html)，[Performance Schema](https://dev.mysql.com/doc/refman/8.4/en/performance-schema.html)


### 不同版本的区别

1. **MySQL 5.7** 通过以下命令诊断锁等待和事务：
     ```sql
     -- 显示 innodb 存储引擎的当前状态信息，包括锁、事务、死锁等详细信息
     show engine innodb status\g;
     
    -- 显示当前所有 innodb 锁的信息(等待和死锁)
    select * from information_schema.innodb_locks;
    -- 显示当前等待锁的事务信息
    select * from information_schema.innodb_lock_waits;
     ```

2. **MySQL 8.0**： 优先使用 `performance_schema`，通过以下命令获取详细锁信息：
     ```sql
     -- 显示当前数据锁的状态信息
     select * from performance_schema.data_locks;
     -- 显示当前等待数据锁的事务信息
     select * from performance_schema.data_lock_waits;
     ```
如需精确锁监控，建议升级到 MySQL 8.0。


|    功能     |              MySQL 5.7               |                     MySQL 8.0                      |
| ---------- | ------------------------------------ | -------------------------------------------------- |
| 查看普通锁  | 无法直接查看，需结合事务和上下文推测。    | `PERFORMANCE_SCHEMA.DATA_LOCKS` 支持直接查看锁范围。 |
| 等待锁/死锁 | `INNODB_LOCKS` + `INNODB_LOCK_WAITS` | `PERFORMANCE_SCHEMA.DATA_LOCK_WAITS`。             |
| 事务监控    | `INNODB_TRX`                         | `PERFORMANCE_SCHEMA.EVENTS_TRANSACTIONS_CURRENT`。 |




### data_locks 

`performance_schema.data_locks` 表（[The data_locks Table](https://dev.mysql.com/doc/refman/8.4/en/performance-schema-data-locks-table.html)） 记录了当前**所有数据锁的状态信息**。它包含了每个锁的详细属性，如锁类型、锁模式、锁定的对象等。

```sql
select * from performance_schema.data_locks;
```

|         **字段名**         |                                                          **含义**                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **ENGINE**                | 锁所属的存储引擎（例如 `INNODB`）。                                                                                            |
| **ENGINE_LOCK_ID**        | 锁的唯一标识符，由存储引擎生成，用于区分不同锁。                                                                                 |
| **ENGINE_TRANSACTION_ID** | 请求或持有该锁的事务 ID。对 InnoDB，可与 `INNODB_TRX.TRX_ID` 关联查看事务详情。                                                  |
| **THREAD_ID**             | 请求锁的会话线程 ID。可与 `performance_schema.threads` 关联获取线程信息。                                                       |
| **EVENT_ID**              | 锁创建事件的 ID。可与 Performance Schema 中其他表的事件关联，了解锁的生成过程。                                                   |
| **OBJECT_SCHEMA**         | 锁定对象所在的数据库名。                                                                                                      |
| **OBJECT_NAME**           | 锁定的表名。                                                                                                                 |
| **PARTITION_NAME**        | 锁定的分区名（如果存在分区锁定）；如果没有分区锁定，则为 `NULL`。                                                                 |
| **SUBPARTITION_NAME**     | 锁定的子分区名（如果存在子分区锁定）；如果没有子分区锁定，则为 `NULL`。                                                            |
| **INDEX_NAME**            | 锁定的索引名                                                                                                                 |
| **OBJECT_INSTANCE_BEGIN** | 锁对象的内存地址，用于区分存储引擎内部的锁对象实例。                                                                             |
| **LOCK_TYPE**             | 锁类型：`TABLE`（表锁）或 `RECORD`（行锁）。                                                                                   |
| **LOCK_MODE**             | 锁的模式，表示锁的粒度和权限，包括：<br>`S`（共享锁）、`X`（排他锁）、`IS`（意向共享锁）、`IX`（意向排他锁）、`AUTO_INC`（自增锁）等。 |
| **LOCK_STATUS**           | 锁的状态：`GRANTED`（已授予）或 `WAITING`（正在等待）。                                                                         |
| **LOCK_DATA**             | 锁定数据的具体信息                                                                                                            |


- **锁状态 (`LOCK_STATUS`)：** 用于判断是否存在锁等待问题，是排查锁争用的关键字段。
- **锁模式 (`LOCK_MODE`)：** 提供锁类型的详细信息，包括是否存在间隙锁（`GAP`）。
- **锁定对象 (`OBJECT_SCHEMA`, `OBJECT_NAME`, `INDEX_NAME`)：** 帮助快速定位被锁定的表、分区或索引
- **事务 ID (`ENGINE_TRANSACTION_ID`) 和线程 ID (`THREAD_ID`)：** 用于关联锁与事务、线程的上下文信息，分析锁的来源及对性能的影响。







### data_lock_waits 

`performance_schema.data_lock_waits` 表 （[The data_lock_waits Table](https://dev.mysql.com/doc/refman/8.4/en/performance-schema-data-lock-waits-table.html)） 记录了当前所有**等待锁**的事务信息。它展示了哪些事务正在等待其他事务释放锁，形成了锁等待链。通过这个表，你可以追踪锁等待的情况，帮助识别和解决锁冲突和死锁问题。

```sql
select * from performance_schema.data_lock_waits;
```

|              **字段名**               |                                  **含义**                                   |
| ------------------------------------ | --------------------------------------------------------------------------- |
| **ENGINE**                           | 请求或阻塞锁所属的存储引擎（例如 `INNODB`）                                     |
| **REQUESTING_ENGINE_LOCK_ID**        | 请求的锁的唯一标识符。可与 `data_locks.ENGINE_LOCK_ID` 关联查询请求锁的详情。    |
| **REQUESTING_ENGINE_TRANSACTION_ID** | 请求锁的事务 ID。                                                             |
| **REQUESTING_THREAD_ID**             | 请求锁的会话线程 ID。                                                         |
| **REQUESTING_EVENT_ID**              | 请求锁的事件 ID。可与 Performance Schema 中的事件表关联，了解锁请求的上下文信息。 |
| **REQUESTING_OBJECT_INSTANCE_BEGIN** | 请求锁的内存地址。                                                            |
| **BLOCKING_ENGINE_LOCK_ID**          | 阻塞锁的唯一标识符。可与 `data_locks.ENGINE_LOCK_ID` 关联查询持有锁的详情。      |
| **BLOCKING_ENGINE_TRANSACTION_ID**   | 持有阻塞锁的事务 ID。                                                         |
| **BLOCKING_THREAD_ID**               | 持有阻塞锁的会话线程 ID。                                                     |
| **BLOCKING_EVENT_ID**                | 持有阻塞锁的事件 ID。                                                         |
| **BLOCKING_OBJECT_INSTANCE_BEGIN**   | 持有锁的内存地址。                                                            |

**应用场景**

1. **锁等待分析：**  通过 `REQUESTING_ENGINE_LOCK_ID` 和 `BLOCKING_ENGINE_LOCK_ID`，了解等待的锁和阻塞的锁之间的关系。 帮助确定锁争用的来源和被影响的事务。

2. **事务依赖分析：**  
    结合 `REQUESTING_ENGINE_TRANSACTION_ID` 和 `BLOCKING_ENGINE_TRANSACTION_ID`，分析事务间的锁依赖关系，定位可能导致性能瓶颈的事务。

3. **结合 `data_locks` 表：**  关联 `data_locks` 表中的详细锁信息，获取被锁定的表、索引及锁类型（如 `TABLE` 或 `RECORD`）。

4. **死锁排查：**  在发生死锁时，通过锁等待链，迅速找到阻塞点并优化相关事务或 SQL。

**示例用法** : 
  ```sql
  SELECT * FROM performance_schema.data_lock_waits; --查看当前所有锁等待信息
  ```

关联 `data_locks` 表，查看等待锁和阻塞锁的具体信息：
  ```sql
  SELECT dl1.THREAD_ID AS requesting_thread,
         dl1.LOCK_TYPE AS requesting_lock_type,
         dl2.THREAD_ID AS blocking_thread,
         dl2.LOCK_TYPE AS blocking_lock_type
  FROM performance_schema.data_lock_waits dw
  JOIN performance_schema.data_locks dl1
    ON dw.REQUESTING_ENGINE_LOCK_ID = dl1.ENGINE_LOCK_ID
  JOIN performance_schema.data_locks dl2
    ON dw.BLOCKING_ENGINE_LOCK_ID = dl2.ENGINE_LOCK_ID;
  ```




## MySQL锁了什么

MySQL在进行 update 等操作或锁定读时，究竟加了什么锁，锁了什么，接下来借助MySQL8提供的`performance_schema.data_locks`进行分析

```sql
select OBJECT_NAME, INDEX_NAME, LOCK_STATUS, LOCK_TYPE, LOCK_MODE, LOCK_DATA
from performance_schema.data_locks;
```

::: info performance_schema.data_locks.LOCK_MODE
MySQL的`data_locks`表中的`LOCK_MODE`的三种形式描述：  
- `X` ： Next-key Locks，临键锁 ，同时锁定 **记录本身** 和 **记录与前一条记录之间的间隙**
- `X,REC_NOT_GAP`:  记录所，仅对记录加锁
- `X,GAP `： 间隙锁（Gap Locks），仅对间隙加锁，防止其他事务在间隙中插入数据
:::

先创建示例表：（环境为MySQL8.0，RR隔离级别）
```sql
-- 创建 users 表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,     -- 主键
    name VARCHAR(50),                      -- 用户名，普通索引
    age INT,                               -- 年龄
    phone VARCHAR(20) UNIQUE,              -- 唯一索引字段
    INDEX (name)                           -- 为 name 字段创建普通二级索引
);
-- 插入数据
INSERT INTO users (id, name, age, phone) VALUES 
    (3, 'Alice', 25, '1234567890'),
    (4, 'Bob', 30, '666888'),
    (18, 'Charlie', 22, '1122334455');
    
-- 创建 t1 表（无任何索引）
CREATE TABLE t1 ( name VARCHAR(50),  age INT );
-- 插入数据
INSERT INTO t1 (name, age) VALUES ('David', 28), ('Eve', 32);
```

下面的实验中，每次事务均会进行 `rollback;` ，后面不再说明


### 主键索引上的锁

开启事务，在users表上做一个锁定读，查询条件针对主键id：

```sql
start transaction;
select * from users where id = 4 for update;
```
然后通过查询`data_locks`表得到下面的信息：
```sql
+-------------+------------+-------------+-----------+---------------+-----------+
| OBJECT_NAME | INDEX_NAME | LOCK_STATUS | LOCK_TYPE | LOCK_MODE     | LOCK_DATA |
+-------------+------------+-------------+-----------+---------------+-----------+
| users       | NULL       | GRANTED     | TABLE     | IX            | NULL      |
| users       | PRIMARY    | GRANTED     | RECORD    | X,REC_NOT_GAP | 4         |
+-------------+------------+-------------+-----------+---------------+-----------+
```
该事务中加了两个锁，表级的意向排他锁（IX）和针对主键索引的 排他锁（X），通过`LOCK_DATA`可知，锁定的就是主键id为4的这条聚集索引树上的记录





### 唯一索引上的锁

开启事务，在users表上做一个锁定读，查询条件在唯一索引`phone`上：

```sql
start transaction;
select * from users where phone = '666888' for update;
```
然后通过查询`data_locks`表查询到下面的锁信息：

```sql
+-------------+------------+-------------+-----------+---------------+-------------+
| OBJECT_NAME | INDEX_NAME | LOCK_STATUS | LOCK_TYPE | LOCK_MODE     | LOCK_DATA   |
+-------------+------------+-------------+-----------+---------------+-------------+
| users       | NULL       | GRANTED     | TABLE     | IX            | NULL        |
| users       | phone      | GRANTED     | RECORD    | X,REC_NOT_GAP | '666888', 4 |
| users       | PRIMARY    | GRANTED     | RECORD    | X,REC_NOT_GAP | 4           |
+-------------+------------+-------------+-----------+---------------+-------------+
```

- 表级锁：加了意向排他锁（IX）。
- 索引级锁：
  - 唯一索引 `phone` 对应的记录加了 `X, REC_NOT_GAP` 锁。
  - 主键索引 `id` 对应的记录也加了 `X, REC_NOT_GAP` 锁。

唯一索引因为有唯一性约束，所以只加记录锁，不用加间隙锁。


### 次级索引上的锁

开启事务，在users表上做一个锁定读，查询条件在普通二级索引`name`上：

```sql
start transaction;
select * from users where name = 'Bob' for update;
```
然后通过查询`data_locks`表查询到下面的锁信息：

```sql
+-------------+------------+-------------+-----------+---------------+---------------+
| OBJECT_NAME | INDEX_NAME | LOCK_STATUS | LOCK_TYPE | LOCK_MODE     | LOCK_DATA     |
+-------------+------------+-------------+-----------+---------------+---------------+
| users       | NULL       | GRANTED     | TABLE     | IX            | NULL          |
| users       | name       | GRANTED     | RECORD    | X,GAP         | 'Charlie', 18 |
| users       | name       | GRANTED     | RECORD    | X             | 'Bob', 4      |
| users       | PRIMARY    | GRANTED     | RECORD    | X,REC_NOT_GAP | 4             |
+-------------+------------+-------------+-----------+---------------+---------------+
```

- `TABLE | IX | NULL` : 表级意向锁（Intent Exclusive, IX）

- `name | X,GAP | 'Charlie', 18`: 间隙锁（**锁定的是当前记录的前一条记录和当前记录之间的间隙范围**），这里表示锁住的是二级索引树上从 `('Bob', id=4) `到 `('Charlie', id=18) `的间隙

- `name | X | 'Bob', 4`: **临键锁（Next-key Locks）**，锁记录和间隙，即锁定 `('Bob', id=4)`这条记录 及 `('Alice', id=3)`到 `('Bob', id=4)`之间的间隙

- `PRIMARY | X,REC_NOT_GAP | 4`: 主键 `id=4` 上的记录锁（`REC_NOT_GAP`，不锁间隙）

::: important 唯一索引和普通索引的加锁区别
唯一索引和普通索引加锁都需要对非聚集索引加锁，再对主键索引加锁

|     **特性**     |             **唯一索引**             |       **普通索引**       |
| ---------------- | ------------------------------------ | ----------------------- |
| **锁定记录**     | 是  （记录锁, 如： `X, REC_NOT_GAP`） | 是 (记录锁, 如：  `X`)   |
| **是否加间隙锁** | 否                                   | 是   (记录锁, 如：  `X`) |
| **原因**         | 唯一性约束确保无重复值                 | 需要防止相同索引值的插入   |
| **并发性**       | 高                                   | 较低                     |

- 唯一索引由于天然的唯一性约束，只需要锁定目标记录，具备更高的并发性能。
- 普通索引需要额外的间隙锁，来防止重复值插入或“幻读”，因此加锁范围更广，并发性能相对较低。
:::



### 非索引字段

开启事务，在users表上做一个锁定读，查询条件不在索引上：

```sql
start transaction;
select * from users where age = 30 for update;
```
然后通过查询`data_locks`表查询到下面的锁信息：

```sql
+-------------+------------+-------------+-----------+-----------+------------------------+
| OBJECT_NAME | INDEX_NAME | LOCK_STATUS | LOCK_TYPE | LOCK_MODE | LOCK_DATA              |
+-------------+------------+-------------+-----------+-----------+------------------------+
| users       | NULL       | GRANTED     | TABLE     | IX        | NULL                   |
| users       | PRIMARY    | GRANTED     | RECORD    | X         | supremum pseudo-record |
| users       | PRIMARY    | GRANTED     | RECORD    | X         | 3                      |
| users       | PRIMARY    | GRANTED     | RECORD    | X         | 4                      |
| users       | PRIMARY    | GRANTED     | RECORD    | X         | 18                     |
+-------------+------------+-------------+-----------+-----------+------------------------+
```

1个表级意向排他锁，4个临键锁（Next-key Locks）, 锁住了所有记录及间隙





### 没有主键时的锁

开启事务，在t1表上做一个锁定读，查询条件为name：

```sql
start transaction;
select * from t1 where name = 'David' for update;
```
然后通过查询`data_locks`表查询到下面的锁信息：

```sql
+-------------+-----------------+-------------+---------+-------+-------------------- ----+
| OBJECT_NAME | INDEX_NAME      | LOCK_STATUS |LOCK_TYPE|LOCK_MODE| LOCK_DATA             |
+-------------+-----------------+-------------+-----------+-----------+-------------------+
| t1          | NULL            | GRANTED     | TABLE   | IX      | NULL                  |
| t1          | GEN_CLUST_INDEX | GRANTED     | RECORD  | X       | supremum pseudo-record|
| t1          | GEN_CLUST_INDEX | GRANTED     | RECORD  | X       | 0x000000000202        |
| t1          | GEN_CLUST_INDEX | GRANTED     | RECORD  | X       | 0x000000000203        |
+-------------+-----------------+-------------+---------+------ - +------------------ ----+
```
该事务中加了4个锁，表级的意向排他锁（IX）和 3个 排他锁（X）：
- `supremum pseudo-record`：表示无穷大区间，锁住了最大索引到无穷大的范围
- `0x000000000202`和`0x000000000203`:  临键锁（Next-key Locks）对记录和间隙都加排他锁。

在没有显式主键的表中，InnoDB 会使用隐藏的聚簇索引（`GEN_CLUST_INDEX`）来管理数据。由于缺乏显式主键或索引，更新操作通常需要扫描全表，并在所有记录和间隙上加锁。

`GEN_CLUST_INDEX`表示表的聚簇索引（内部生成的主键索引）

从该示例可以看出，没有显式主键的表在RR隔离级别下更新数据会加很多锁，最终范围与表锁几乎一致，所以一定要避免创建没有显式主键的表










### 范围条件的锁

还是上面的表和数据，这次只看条件和加锁情况，原有数据如下：
```sql
mysql> select * from users;
+----+---------+------+------------+
| id | name    | age  | phone      |
+----+---------+------+------------+
|  3 | Alice   |   25 | 1234567890 |
|  4 | Bob     |   30 | 666888     |
| 18 | Charlie |   22 | 1122334455 |
+----+---------+------+------------+
```

::: info 不同情形下的范围条件加锁示例
#### 1. 主键索引上的范围条件

```sql
start transaction;
select * from users where id >= 4 and id <= 10 for update;
```
通过查询`data_locks`表查询到的锁信息：
```sql
+-------------+------------+-------------+-----------+---------------+-----------+
| OBJECT_NAME | INDEX_NAME | LOCK_STATUS | LOCK_TYPE | LOCK_MODE     | LOCK_DATA |
+-------------+------------+-------------+-----------+---------------+-----------+
| users       | NULL       | GRANTED     | TABLE     | IX            | NULL      |
| users       | PRIMARY    | GRANTED     | RECORD    | X,GAP         | 18        |
| users       | PRIMARY    | GRANTED     | RECORD    | X,REC_NOT_GAP | 4         |
+-------------+------------+-------------+-----------+---------------+-----------+
```
加锁范围：主键索引的 `[4, 18)`


#### 2. 唯一索引上的范围条件
注意 数字字符串 的排序：从小到大的字典序排序，`'1122334455'`, `'1234567890'`, `'666888'`
```sql
start transaction;
select * from users where phone >= '666888' and phone <= '999999' for update;
```
通过查询`data_locks`表查询到的锁信息：
```sql
+------------+-------------+-----------+---------------+------------------------+
| INDEX_NAME | LOCK_STATUS | LOCK_TYPE | LOCK_MODE     | LOCK_DATA              |
+------------+-------------+-----------+---------------+------------------------+
| NULL       | GRANTED     | TABLE     | IX            | NULL                   |
| phone      | GRANTED     | RECORD    | X             | supremum pseudo-record |
| phone      | GRANTED     | RECORD    | X             | '666888', 4            |
| PRIMARY    | GRANTED     | RECORD    | X,REC_NOT_GAP | 4                      |
+------------+-------------+-----------+---------------+------------------------+
```

加锁范围：
- 唯一索引的  (`'1234567890'`, `'666888'`]， $('666888' , \infty)$    
     (为什么这里会包含`'666888'`之前的间隙)
- 主键索引的 `4`


#### 3. 普通二级索引上的范围条件
注意从小到大的字典序排序，`'Alice'`, `'Bob'`, `'Charlie'`
```sql
start transaction;
select * from users where name >= 'Bob' and name <= 'CC' for update;
```
通过查询`data_locks`表查询到的锁信息：
```sql
| OBJECT_NAME | INDEX_NAME | LOCK_STATUS | LOCK_TYPE | LOCK_MODE     | LOCK_DATA     |
+-------------+------------+-------------+-----------+---------------+---------------+
| users       | NULL       | GRANTED     | TABLE     | IX            | NULL          |
| users       | name       | GRANTED     | RECORD    | X             | 'Bob', 4      |
| users       | name       | GRANTED     | RECORD    | X             | 'Charlie', 18 |
| users       | PRIMARY    | GRANTED     | RECORD    | X,REC_NOT_GAP | 4             |
+-------------+------------+-------------+-----------+---------------+---------------+
```

#### 4. 非索引字段上的范围条件

```sql
start transaction;
select * from users where age >= 22 and age <= 28 for update;
```
通过查询`data_locks`表查询到的锁信息：
```sql
+-------------+------------+-------------+-----------+-----------+------------------------+
| OBJECT_NAME | INDEX_NAME | LOCK_STATUS | LOCK_TYPE | LOCK_MODE | LOCK_DATA              |
+-------------+------------+-------------+-----------+-----------+------------------------+
| users       | NULL       | GRANTED     | TABLE     | IX        | NULL                   |
| users       | PRIMARY    | GRANTED     | RECORD    | X         | supremum pseudo-record |
| users       | PRIMARY    | GRANTED     | RECORD    | X         | 3                      |
| users       | PRIMARY    | GRANTED     | RECORD    | X         | 4                      |
| users       | PRIMARY    | GRANTED     | RECORD    | X         | 18                     |
+-------------+------------+-------------+-----------+-----------+------------------------+
```
全锁了~

:::









## MySQL死锁分析
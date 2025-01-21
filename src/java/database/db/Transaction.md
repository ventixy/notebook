---

order: 15
title:  事务与锁机制

---






## MySQL Transaction

**事务（Transaction）**：是由一系列对数据库中数据进⾏访问（查询）与更新（增删改）的操作所组成的⼀个程序执行逻辑单元。这些操作，要么都成功，要么都不成功。

```SQL
-- 事务相关命令：
begin;                -- 开始，还可以使用下列语法：
start transaction; 

commit;               -- 提交：使得当前的修改确认

rollback;             -- 回滚：使得当前的修改被放弃
```

### 事务的ACID特性

事务具有四个重要特征：原子性（Atomicity），一致性（Consistency），隔离性（Isolation），持久性（Durability）。简称**ACID特性**

::: info 事务的ACID特性

#### 原子性（Atomicity）
事务是一个不可分割的最小工作单位，事务中的所有操作要么全部完成，要么全部不执行。事务执⾏过程中如果出错， 会回滚到事务开始前的状态，所有的操作就像没有发⽣一样。

- 作用：保证事务的完整性，防止部分操作成功而部分操作失败导致的数据不一致。
- 实现方式: 通过`Undo Log` 支持事务的回滚

#### ⼀致性（Consistency）
一个事务在执⾏之前和执行之后，数据库都必须处于⼀致性状态。即事务必须是数据库从一个一致性状态到另外一个一致性状态。
  *比如：如果从A账户转账到B账户，不可能因为A账户扣了钱，⽽B账户没有加钱（两个账号的总金额要保持一致状态）*

- 作用：确保数据库从一个一致状态转换到另一个一致状态，即使事务失败也不会破坏数据库的一致性。
- 实现方式：日志和约束机制，事务的自动回滚 (或者说由A,I,D共同保证)


#### 隔离性（Isolation）

 ==事务的执行是独立的，不受其他事务的干扰==。一个事务的中间状态对其他事务是不可见的。

 在并发环境中，并发的事务是互相隔离的。也就是说，不同的事务并发操作相同的数据时，每个事务都有各自完整的数据空间。 ⼀个事务内部的操作及使用的数据对其它并发事务是隔离的，并发执行的各个事务是不能互相干扰的。 

- 作用：防止多个事务并发执行时产生的相互干扰，确保事务的执行结果是正确的。
- 实现方式：不同的隔离级别，MVCC

在事务中，有隔离级别的定义，不同的隔离级别有不同的影响的程度。

#### 持久性（Durability）

一旦事务提交，其对数据库的改变是永久的，即使系统发生故障也不会丢失。 

- 作用：确保事务的结果能够持久保存，不会因为系统崩溃或其他问题而丢失。
- 实现方式：**Redo Log & [doublewrite buffer](https://dev.mysql.com/doc/refman/5.7/en/glossary.html#glos_doublewrite_buffer)**

:::



### 事务的并发问题

在不同的隔离级别下，多个事务并发执行时可能会产生一些问题，如：脏读，不可重复读，幻读

::: danger 事务的并发问题

#### 脏读（Dirty Read）

- **一个事务读取到了另外一个事务还没提交的数据**。例：事务A读取了事务B更新但未提交的数据（脏数据） *脏数据*：是指事务对缓冲池中行记录的修改，还没有被提交（commit）

- 脏读发生的条件是需要事务的隔离级别为 `READ UNCOMMITTED`


#### 不可重复读（Nonrepeatable Read）

- **一个事务在两次读取同一数据时，由于另一个事务在这两次读取之间修改了数据，导致两次读取的结果不同**。

- *不可重复读和脏读的区别* 是：脏读是读到未提交的数据，而不可重复读读到的却是已经提交的数据

有时候，不可重复读的问题是可以接受的，因为其读到的是已经提交的数据，本身并不会带来很大的问题


#### 幻读（Phantom Read）

**在一个事务内，读取数据记录条数前后不一致**。详细来说：一个事务在两次查询相同范围的数据时，由于另一个事务在这两次查询之间插入了新的数据，导致第二次查询的结果集包含了第一次查询没有的数据。
  
> 例如：
>  1. 事务 A ： `select * from student where age > 10`，假设查到了 10 行数据；
>  2. 然后事务 B 往里面加入了一批数据 （或者删除了一些数据）
>  3. 事务 A 再查的用条件查询语句查询的时候，发现查到了15条 

:::

**脏写或更新丢失(Lost Update)** ： 当两个或多个事务更新同一行记录，会产生更新丢失现象:
- 回滚覆盖：一个事务回滚操作，把其他事务已提交的数据给覆盖了。
- 提交覆盖：一个事务提交操作，把其他事务已提交的数据给覆盖了。




### 事务的隔离级别

为了处理并发问题，SQL标准定义了四种隔离级别，每种级别提供了不同程度的隔离性：

::: info 事务的隔离级别
#### ❑ Read Uncommitted（读未提交）
最低/最不安全的隔离级别(唯一能读到脏数据的隔离级别) 有脏读、不可重复读、虚幻读的问题

#### ❑ Read Committed（读已提交）
只能读取已经提交的数据、解决了脏读问题，但是仍存在可重复读问题和幻读

#### ❑ Repeatable Read（可重复读）
标准SQL的定义下仍可能存在幻读问题，但MySQL下没有幻读问题

#### ❑ Serializable（顺序读 / 可串行化 / 序列化）
最严格的事务隔离级别、事务只能一个接一个地处理，不能并发(有效率问题)
:::

不同事务隔离级别下的不同的问题总结：

| 事务隔离级别 \ 并发问题 | 脏读(Dirty Read) | 不可重复读 |      （虚）幻读      |
| ------------------- | :--: | :--------: | :--------------: |
| read uncommitted（读未提交）    |  √   |     √      |        √         |
| read committed（读已提交）      |  X   |     √      |        √         |
| repeatable read（可重复读）    |  X   |     X      | X(在MySQL下没有) |
| serializable（序列化）        |  X   |     X      |        X         |


MySQL中InnoDB存储引擎默认支持的隔离级别是 `REPEATABLE READ`，但是与标准SQL不同的是，InnoDB存储引擎在`REPEATABLE READ`事务隔离级别下，通过**Next-Key Lock** 有效地防止了幻读问题

::: tip 关于MySQL默认隔离级别的介绍
- `InnoDB` offers all four transaction isolation levels described by the SQL:1992 standard: 
[`READ UNCOMMITTED`](https://dev.mysql.com/doc/refman/5.7/en/innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), [`READ COMMITTED`](https://dev.mysql.com/doc/refman/5.7/en/innodb-transaction-isolation-levels.html#isolevel_read-committed), [`REPEATABLE READ`](https://dev.mysql.com/doc/refman/5.7/en/innodb-transaction-isolation-levels.html#isolevel_repeatable-read), and [`SERIALIZABLE`](https://dev.mysql.com/doc/refman/5.7/en/innodb-transaction-isolation-levels.html#isolevel_serializable). 

- The default isolation level for `InnoDB` is [`REPEATABLE READ`](https://dev.mysql.com/doc/refman/5.7/en/innodb-transaction-isolation-levels.html#isolevel_repeatable-read).
:::














## MVCC机制详解

多版本并发控制（Multi-Version Concurrency Control，简称 MVCC，`Copy on Write`的思想）通过维护数据的不同版本来实现**对同一数据的无锁并发访问**，大大提高了数据库的吞吐量及读写性能。

MVCC最大的好处是读不加锁，读写不冲突。在读多写少的系统应用中，读写不冲突是非常重要的，极大的提升系统的并发性能，这也是为什么现阶段几乎所有的关系型数据库都支持 MVCC 的原因，MVCC是 `Read Commited` 和 `Repeatable Read` 两种隔离级的实现基础。


::: important MVCC核心基础
- 数据行的隐藏字段：包含用于`指向历史版本的指针`，每行数据可凭此找到它的历史版本
- undo log：存储数据行的多个版本信息
- read view：提供了数据版本确定的依据，用于确定应该获取哪个版本的数据
:::

MySQL官网关于MVCC的介绍参照：[innodb-multi-versioning](https://dev.mysql.com/doc/refman/8.4/en/innodb-multi-versioning.html), [Consistent Nonlocking Reads](https://dev.mysql.com/doc/refman/8.0/en/innodb-consistent-read.html)



### 数据行隐藏字段

InnoDB 存储引擎在每个数据行中添加了几个隐藏字段，用于支持 MVCC：

- **DB_TRX_ID**：记录最近一次对本记录进行插入或修改的事务ID。（占六个字节）
    删除操作也会被视为一个update操作，只是有额外的删除标记（Delete Bit）

- **DB_ROLL_PTR**：指向该行的回滚段（undo log）的指针，用于找到该行的旧版本。(占用七个字节)

- **DB_ROW_ID**：随着新行插入而单调递增的行ID，数据行没有主键时，为行提供一个唯一的标识
  DB_ROW_ID占用六个字节, 若无聚簇索引则作为聚簇索引使用。

![](https://image.ventix.top/img02/20220119212913677.png)



### UndoLog与版本链

事务在对数据操作前，undolog会记录==可以通过事务回滚到上一个版本数据==的信息

- `insert undo log`: 事务insert新记录时产生的undolog, 只在事务回滚时需要，并且在事务提交后就可以立即丢弃
- `update undo log`: 事务进行delete和update操作时产生的undo log
  不仅事务回滚需要，快照读也需要，只有当数据库所使用的快照中不涉及 对应的undo log才会被`purge`线程删除

::: warning 版本链
每次更新操作，旧值会被保存到一条undo日志中，随着更新次数的增加，所有的版本都会通过`DB_ROLL_PTR`连接成一个链表，称之为**版本链**。
:::


### Read View

readview视图存在如下4个字段

- `m_ids`：m_ids中维护了一个有序数组（升序），该数组保存了ReadView生成时，活跃的事务id
- `m_low_limit_id（max_trx_id）`：预分配事务id，等于当前最大事务id + 1（事务是自增的）
- `m_up_limit_id（min_trx_id）`：最小活跃事务id
- `m_creator_trx_id`：ReadView创建者的id





::: important Read View 与事务隔离级别
不同的事务隔离级别会影响 Read View 的行为：

- **READ COMMITTED**：每次SELECT都会创建一个新的`ReadView`，能看到已提交的数据版本

- **REPEATABLE READ**（默认）：在整个事务期间保持同一个`ReadView`，多次查询结果一致
:::




`读已提交`（Read Committed，RC）和`可重复读`（Repeatable Read，RR）的本质区别：

- **读已提交（RC）**：==每次查询创建新的读视图==，事务内的多次查询可能会看到不同的数据版本。
- **可重复读（RR）**：事务开始时创建读视图，事务内的多次查询会看到相同的快照。

因此在MVCC机制中，在可重复读隔离级别下同一个事务内多次查询使用的均是同一个视图，解决了不可重读的问题和部分幻读问题。


参照Blog：https://blog.csdn.net/qq_62835094/article/details/136669636






### 可见性规则

MVCC机制通过下面的算法，分析版本链中访问版本的 `DB_TRX_ID` 属性值与`Read view`数据，确定版本的可见性(能否被当前事务访问)：

::: info 版本可见性分析算法
- 如果被访问版本的 `DB_TRX_ID` 属性值与 Read View 中的 `m_creator_trx_id` 值相同，表示当前事务正在访问自己所修改的记录，因此该版本**可以被当前事务访问**。

- 如果被访问版本的 `DB_TRX_ID` 属性值小于 Read View 中的 `m_up_limit_id` 值，说明生成该版本的事务在当前事务生成 Read View 之前已经提交，因此该版本**可以被当前事务访问**。

- 如果被访问版本的 `DB_TRX_ID` 属性值大于或等于 Read View 中的 `m_low_limit_id` 值，说明生成该版本的事务在当前事务生成 Read View 之后才提交，因此该版本**不能被当前事务访问**。

- 如果被访问版本的 `DB_TRX_ID` 属性值位于 Read View 的 `m_up_limit_id` 和 `m_low_limit_id` 之间（包括边界），则需要进一步检查 `DB_TRX_ID` 是否在`m_ids` 列表中。
  - 如果在列表中（创建ReadView时生成该版本的事务仍处于活跃状态）该版本**不能被访问**
  - 如果不在列表中（创建 Read View 时生成该版本的事务已经提交）该版本**可以被访问**
:::

如果经过上面的判断目标版本不能被访问，则继续沿着版本链判断下一条 Undo Log



### 示例










### 快照读与当前读

**快照读快照读（Snapshot Read）**： 指读取一个事务开始时的数据快照，而不是最新的数据。这意味着它不会看到其他事务在此事务启动后所做的任何更改，即使这些更改已经被提交。

默认情况下，SELECT 是非锁定的一致性读（consistent nonlocking read）。这种类型的读取能够提高并发性能，因为它允许多个事务同时读取而不会相互阻塞。

- `REPEATABLE-READ`级别: 事务begin后，第一条SELECT语句会创建一个快照，读取满足可见性的数据，之后该事务会一直用这个快照，直到事务结束

- `READ-COMMITTED`级别: 事务begin后，每条SELECT语句都会重置快照(重新创建快照)， 读取当前满足可见性的数据


**当前读（Current Read）**：总是读取最新的、已经提交的数据版本。这不仅包括了本事务所做的更改，也包括所有其他已经提交事务的结果。

为了确保读取到最新数据，当前读可能会加锁以防止其他事务对所读取的数据进行修改。因此，当前读通常是锁定读（locking read），即在读取的同时还会获取适当的锁来保护数据的一致性和完整性。主要包括以下几种情况：
```sql
SELECT ... LOCK IN SHARE MODE;
SELECT ... FOR SHARE;
SELECT ... FOR UPDATE;

INSERT ... ;
UPDATE ... ;
DELETE ... ;
```
MySQL中当前读一般说的就是基于事务的**一致性读（Consistent Read）** 和 **锁定读（Locking Read）**

快照读查看的是事务开始时的数据快照，而当前读则总是读取最新的已提交数据。
















## MySQL锁的分类

在 MySQL 中，锁机制是保证数据一致性和并发控制的重要手段。根据不同的角度，MySQL 中的锁可以分为多种类型。

InnoDB 中的锁机制是确保数据一致性和并发控制的关键部分。根据不同的层次和用途，InnoDB 提供了多种类型的锁。[InnoDB Locking](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html)

- 共享排他锁（Shared and Exclusive Locks） 用于控制并发访问，确保数据的一致性和隔离性。
- 意向锁（Intention Locks）用于协调不同粒度的锁，避免死锁和锁冲突。
- 记录锁（Record Locks）防止多个事务同时修改同一数据项，确保数据一致性。
- 间隙锁（Gap Locks）用于防止幻读现象，特别是在范围查询中。
- 临键锁（Next-Key Locks）通过锁定具体的索引记录及其之前的间隙，有效防止幻读现象。
- 插入意向锁：用于优化并发插入操作，防止多个事务在同一个间隙内插入相同的记录。
- 自增锁：确保 `AUTO_INCREMENT` 列生成唯一的值，通过预分配自增值提高并发性能。
- 谓词锁：支持空间索引中的复杂查询，确保对空间数据的操作具有一致性和隔离性。









### 共享排他锁


共享排他锁（[Shared and Exclusive Locks](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html#innodb-shared-exclusive-locks)）属于**行级锁**，分为共享锁和排他锁:

- 共享锁(SLock)：允许持有该锁的事务读取一行数据

- 排他锁(XLock)：允许该锁的事务**删除或更新**一行数据


| Shared and Exclusive Locks | 排他锁（X 锁） | 共享锁（S 锁） |
|-----------------|--------------|----------|
| 排他锁（XLock）   |   ❌        | ❌       |
| 共享锁（SLock）    | ❌          | ✔       |

- Innodb会自动给 `delete`,`update` 语句涉及到的数据集加 排他锁（XLock）

- 普通的 `select` 语句不会加锁，但可以使用下列方式加锁（参照：[locks-set](https://dev.mysql.com/doc/refman/8.4/en/innodb-locks-set.html)）：

```sql
SELECT ... LOCK IN SHARE MODE;
SELECT ... FOR SHARE;             -- MySQL8
```

`insert` 语句也会自动加锁，但不是共享锁/排他锁。





### 意向锁

意向锁（[Intention Locks](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html#innodb-intention-locks)）表示未来某个时刻，事务要加共享锁/排他锁，所以先提前声明==意向==

- 意向共享锁（intention shared lock ，IS）表示事务有意向表中的某些行加共享锁

- 意向排他锁（intention exclusive lock，IX）表示事务有意向表中的某些行加排他锁

意向锁是一个**表级锁**，==事务在请求S锁/X锁前，需要先获得对应的IS，IX锁==

::: tip 为什么有了共享锁和排他锁，还要引入意向锁？

在没有表级意向锁的情形下，判断是否能对某个表加表级锁需要检查所有的记录看是否有行级锁，费时费力，而有了之前加的表级意向锁，在获取表级锁时可以迅速知道该表中有锁未释放，直接等待即可

例：事务A需要对表中的某个数据进行修改，先获取了一个表级的IX锁，再去获取对应的行级锁（Xlock），如果事务A未完成的情况下，事务B现在需要加表锁`LOCK TABLES ... WRITE`，就可以通过之前的事务A加的表级意向独占锁（IX）知道该等待
:::

MySQL官方文档有明确的描述：Intention locks do not block ==anything except full table requests (for example, `LOCK TABLES ... WRITE`)==. The main purpose of intention locks is **to show that someone is locking a row, or going to lock a row in the table**.

Table-level lock type compatibility （Conflict：❌，Compatible：✔）：
| 表级锁兼容性判断 | X(独占锁/排他锁) | IX(意向排他锁) | S(共享锁) | IS(意向共享锁) |
| --------------- | --------------- | ------------- | --------- | ------------- |
| X(独占锁/排他锁) |       ❌          |      ❌         |       ❌    |     ❌         |
| IX(意向排他锁)   |           ❌      |     ✔          |      ❌     |           ✔    |
| S(共享锁)        |           ❌      |         ❌      |        ✔   |        ✔       |
| IS(意向共享锁)   |           ❌      |       ✔        |    ✔       |       ✔        |


意向锁最明显的作用在于==简化锁兼容性检查== ，通过使用意向锁，数据库引擎可以在更高层次（如表级别）快速判断是否可能存在冲突，而不需要逐行检查每个锁的状态。




### 记录锁和索引

记录锁（[Record Locks](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html#innodb-record-locks)）==锁定的是索引== ，防止其他事务针对同一条记录同时进行**增删改**操作。

当where条件使用二级索引时，InnoDB 不仅会对二级索引上的记录加锁，还会进行回表操作来锁定聚集索引上的相应记录。















### 间隙锁

间隙锁（[Gap Locks](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html#innodb-gap-locks)）：锁住**索引**之间的 ==间隙（键值在条件范围内但不存在的索引记录）==

表的某个索引树通常包括以下间隙：索引记录之间的间隙，第一条索引记录之前的范围，最后一条索引记录之后的范围。例：假设有一个表中包含以下记录（索引有 2， 4，7）：

| customer_id | first_name | last_name |           email           |
| ----------- | ---------- | --------- | ------------------------- |
| 2           | John       | Doe       | john.doe@example.com      |
| 4           | Jane       | Smith     | jane.smith@example.com    |
| 7           | Charlie    | Davis     | charlie.davis@example.com |


则存在以下索引间隙：  $( -\infty , 2) ,  (2, 4),   (4, 7),   (7,  \infty)$ ，一个间隙可能覆盖单个索引值、多个索引值，甚至可能是空的。
  

::: important  间隙锁与事务隔离级别
间隙锁只在 RR 及以上隔离级别有效，设置事务隔离为 RC(READ COMMITTED，读已提交) 相当于禁用间隙锁

在 `可重复读`（Repeatable Read, RR）隔离级别下，InnoDB 可使用间隙锁来防止幻读。 
```sql
SELECT ... FOR UPDATE;
```
通过锁定间隙，防止其他事务在这些间隙中插入新的数据，从而避免幻读问题。

:::

间隙锁是性能和并发性之间的一种权衡，InnoDB 中的间隙锁是“purely inhibitive(纯粹抑制性的)”，它们唯一的目的是**防止其他事务向间隙中插入新记录**，==间隙锁可以共存==。一个事务获取的间隙锁不会阻止另一个事务在同一间隙上获取间隙锁。共享间隙锁和排他间隙锁之间没有区别。它们彼此不冲突








### 临键锁

临键锁（[Next-Key Locks](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html#innodb-next-key-locks)）是索引记录上的记录锁与该索引记录前的间隙锁的组合。通过锁定具体的索引记录及其之前的间隙，临键锁可以有效地防止其他事务在此间隙内插入新记录，从而避免幻读问题。


当一个事务执行范围查询（如 `SELECT ... WHERE ... BETWEEN ... AND ... FOR UPDATE`）时，InnoDB 会对查询范围内所有索引记录加临键锁。这不仅包括实际存在的记录，还包括它们之间的间隙。因此，即使在查询范围内没有匹配的记录，InnoDB 也会对相应的间隙加锁，以确保其他事务不能在此范围内插入新记录。

示例：假设有一个表 `employees`，其中 `id` 是主键，并且包含以下 `id` 值：10、11、13、20。考虑以下事务：

```sql
-- 事务 A
START TRANSACTION;
SELECT * FROM employees WHERE id BETWEEN 10 AND 20 FOR UPDATE;

-- 事务 B
START TRANSACTION;
INSERT INTO employees (id, first_name, last_name) VALUES (12, 'Charlie', 'Davis');
```

在这个例子中，事务 A 对 `id` 在 10 到 20 范围内的所有索引记录加了临键锁，具体包括：

- 记录锁：`id = 10`、`id = 11`、`id = 13`、`id = 20`
- 间隙锁：(10, 11]、(11, 13]、(13, 20]

因此，当事务 B 尝试插入 `id = 12` 的记录时，会被阻塞，直到事务 A 提交或回滚。这有效地防止了幻读现象的发生。


::: tip 临键锁（Next-Key Locks）和索引
- **唯一索引**：对于唯一索引，如果查询条件能够唯一确定一条记录，则不需要加间隙锁，因为唯一性约束已经保证不会有重复值插入。
  
- **非唯一索引**：对于非唯一索引，临键锁会覆盖整个查询范围，包括所有相关记录及其之间的间隙。
:::

**临键锁的优势**:

- **防止幻读**：通过锁定索引记录及其之前的间隙，临键锁有效防止了其他事务在同一范围内插入新记录，从而避免幻读问题。
- **提高并发性**：相比于完全锁定整个表，临键锁只锁定必要的记录和间隙，提高了系统的并发性能。

临键锁是 InnoDB 实现高并发性和数据一致性的重要工具，特别是在 **REPEATABLE READ** 隔离级别下。通过结合记录锁和间隙锁，它可以有效防止幻读现象，确保事务的一致性和隔离性。





### 插入意向锁

插入意向锁（[Insert Intention Locks](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html#innodb-insert-intention-locks)）是 InnoDB 存储引擎中的一种特殊类型的**间隙锁（Gap Lock）**，用于优化并发插入操作。它表明一个事务打算在某个特定的间隙内插入一条新记录，但并不锁定整个间隙。

::: info 插入意向锁的工作机制
- 当事务尝试在某个索引间隙内插入记录时，会先尝试在该间隙上加一个插入意向锁。如果没有其他事务对该间隙持有不兼容的锁，则插入意向锁成功加锁。
- 插入意向锁之间是兼容的，因此多个事务可以同时在同一个间隙上持有插入意向锁。
- 只有当其他事务对该间隙加了 **排他锁（Exclusive Lock, X锁）** 或 **共享锁（Shared Lock, S锁）** 时，插入意向锁才会等待。
:::

**示例场景**：假设有一个表 `employees`，其中 `id` 是主键（已有的 `id` 值为 2 和 5）

```sql
-- 事务 A
START TRANSACTION;
INSERT INTO employees (id, first_name, last_name) VALUES (3, 'Charlie', 'Davis');

-- 事务 B
START TRANSACTION;
INSERT INTO employees (id, first_name, last_name) VALUES (4, 'Eve', 'Smith');
```

事务 A 和事务 B 都会在在索引范围 `(2, 5) `上加一个插入意向锁。由于它们插入的位置不同，这两个事务可以并发执行而不会互相阻塞。














### 自增锁和谓词锁

自增锁（[AUTO-INC Locks](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html#innodb-auto-inc-locks)）用于确保在多线程环境中，`AUTO_INCREMENT` 列生成唯一的值。InnoDB 使用两种模式来处理自增锁：

- **传统模式（Traditional Mode）**：每个插入操作都会获取一个表级的自增锁，这可能会导致较高的争用和较低的并发性。
- **批量模式（Batch Mode）**：从 MySQL 5.7 开始，默认使用批量模式。在这种模式下，InnoDB 会预先分配一批自增值，并允许多个事务并发地使用这些值，从而提高了并发性能。

::: info 工作机制

- **预分配自增值**：InnoDB 会根据需要预先分配一批自增值，并将这些值存储在一个缓存中。
- **并发插入**：多个事务可以从缓存中获取自增值，而不必每次都等待其他事务完成插入。
- **持久化**：即使服务器重启，InnoDB 也会记住最后分配的自增值，以确保唯一性。
:::

**示例场景**：假设有一个表 `orders`，其中 `order_id` 是 `AUTO_INCREMENT` 列。多个客户端同时向该表插入新订单时，InnoDB 会确保每个订单获得唯一的 `order_id`，而不会因为争用自增锁而导致性能瓶颈。


**谓词锁（Predicate Locks for Spatial Indexes）**：主要用于支持空间索引（Spatial Indexes），如 GIS 数据类型。这种锁机制确保了对空间数据的操作具有一致性和隔离性，特别是在涉及复杂的空间查询时。

- **作用**：防止其他事务在相同的空间范围内进行修改操作，从而避免数据不一致或冲突。
- **特点**：谓词锁基于查询条件（即谓词）而不是具体的行或记录。这意味着它可以覆盖更大的范围，提供更细粒度的控制。 InnoDB 使用谓词锁来支持复杂的查询，如范围查询、邻近查询等，确保在事务期间数据的一致性。

**示例场景**：假设有一个包含地理坐标的数据表 `locations`，其中 `geom` 列是一个空间索引。考虑以下事务：

```sql
-- 事务 A
START TRANSACTION;
SELECT * FROM locations WHERE MBRContains(ST_GeomFromText('Polygon((...))'), geom) FOR UPDATE;

-- 事务 B
START TRANSACTION;
INSERT INTO locations (geom) VALUES (ST_GeomFromText('Point(...)'));

-- 如果事务 B 的插入点位于事务 A 查询的多边形范围内，事务 B 将被阻塞，直到事务 A 提交或回滚。
```

在这个例子中，事务 A 对满足 `MBRContains` 条件的空间范围加了谓词锁，因此事务 B 在尝试插入位于该范围内的新点时会被阻塞，直到事务 A 结束。






### 死锁分析












## 幻读问题回顾与总结

MySQL的并发控制机制主要就是 MVCC 和 锁 ， 这两者又都是解决幻读问题的关键

::: important 不同情形的幻读解决原理--快照读和当前读
#### **1. 普通 `SELECT` 查询 (快照读 - Snapshot Read)**

当使用普通的 `SELECT` 查询时，**MVCC（多版本并发控制）** 的快照机制会生效：

- **MVCC 快照**：事务在第一次读取数据时，会生成一个数据的快照（当前一致性视图，Consistent Read View）。此后，事务中的所有普通 `SELECT` 查询都会基于这个快照读取数据。
- **一致性**：由于读取的是同一个快照，即使其他事务插入、更新或删除了数据，也不会影响当前事务的读取结果。因此，不会发生幻读。

```sql
-- 事务 A
START TRANSACTION;
SELECT * FROM table_name WHERE id > 100;

-- 事务 B
INSERT INTO table_name (id, value) VALUES (101, 'New Row');

-- 再次读取
SELECT * FROM table_name WHERE id > 100; -- 查询结果不会包含 id = 101 的新行
```

这是因为事务 A 始终基于其事务开始时生成的快照读取数据。


#### **2. `SELECT ... FOR UPDATE` 查询 (当前读 - Current Read)**

当使用 `SELECT ... FOR UPDATE` 或 `SELECT ... LOCK IN SHARE MODE` 查询时，是 **当前读（Current Read）**，会加锁以保证一致性：

- **Next-Key Lock**：在 REPEATABLE READ 隔离级别下，InnoDB 会使用 Next-Key Lock（索引记录锁 + 间隙锁）来锁定匹配的行和相关间隙，防止其他事务在锁定范围内插入或修改数据。
- **一致性保障**：通过锁定来确保在事务的执行过程中，数据不会被其他事务插入或修改，从而避免幻读。

```sql
-- 事务 A
START TRANSACTION;
SELECT * FROM table_name WHERE id > 100 FOR UPDATE;

-- 事务 B
INSERT INTO table_name (id, value) VALUES (101, 'New Row'); 
-- 被阻塞，因为 101 在 A 的锁范围内

-- 事务 A 再次读取
SELECT * FROM table_name WHERE id > 100 FOR UPDATE; -- 查询结果一致，且未发生幻读
```

通过加锁，`SELECT ... FOR UPDATE` 确保事务 A 可以感知并阻止其他事务对数据范围的修改或插入。

---

#### **总结对比**

|           查询方式           |      机制/关键技术       | 是否防止幻读 |   
| --------------------------- | ---------------------- | ----------- | 
| **普通 `SELECT`**            | MVCC 快照（快照读）      | 防止幻读     | 
| **`SELECT ... FOR UPDATE`** | Next-Key Lock（当前读） | 防止幻读     | 

- **普通 `SELECT`**：通过 MVCC 保证一致性，防止幻读，性能更优。
- **`SELECT ... FOR UPDATE`**：通过锁机制阻止其他事务的插入或修改，确保数据一致性，适合需要修改数据的场景。
:::


<br/>


在 MySQL 的 **REPEATABLE READ (RR)** 隔离级别下，有人认为没有彻底解决幻读问题。并提出了以下几种情形：



**情形一 前后两次查询混合使用当前读和快照读**

```sql
-- 事务 A
START TRANSACTION;
SELECT * FROM table_name WHERE id > 100; -- 没有查到id为101的记录

-- 事务 B （插入完自动提交）
INSERT INTO table_name (id, value) VALUES (101, 'New Row');

-- 事务A 再次读取
SELECT * FROM table_name WHERE id > 100 FOR UPDATE; -- 这里又能查到 id = 101 的新行
```
 第二次查询使用了 `FOR UPDATE`，这是一个锁定读，它会读取最新的数据并加锁，因此可以看到新插入的记录。这是因为**混合使用了快照读和当前读**！


   
<br/>



**情形二 两次查询中间本事务无法插入新数据**：

```sql
-- 事务 A
START TRANSACTION;
SELECT * FROM table_name WHERE id > 100; -- 没有查到id为101的记录

-- 事务 B （插入完自动提交）
INSERT INTO table_name (id, value) VALUES (101, 'New Row');

-- 事务A 再次读取
SELECT * FROM table_name WHERE id > 100; -- 还是查询不到 id = 101 的新行
-- 事务A插入数据失败！
INSERT INTO table_name (id, value) VALUES (101, 'New A');
```
因为查询不到数据，进行插入时又发现插入不了，但这里本质原因还是没有使用**锁定读**，根本没有用到锁机制来解决问题，事务中要修改或者插入时，应该先通过`select ... for update`查询，而不是普通查询


<br/>


**情形三 两次查询中间本事务更新了数据**：

```sql
-- 事务 A
START TRANSACTION;
SELECT * FROM table_name WHERE id > 100; -- 没有查到id为101的记录

-- 事务 B （插入完自动提交）
INSERT INTO table_name (id, value) VALUES (101, 'New Row');

-- 事务A 再次读取
SELECT * FROM table_name WHERE id > 100; -- 还是查询不到 id = 101 的新行
UPDATE table_name SET name = 'new' WHERE id = 101; -- 但是这里能修改！！
SELECT * FROM table_name WHERE id > 100; -- 这里又能查到 id = 101 的新行
```

- 第一次查询：这是一个普通的 `SELECT`，它执行的是快照读（Snapshot Read），因此看不到事务 B 插入的新记录。
  
- 第二次查询：仍然是快照读，所以仍然看不到新插入的记录。

- 更新操作：这是一个锁定读/当前读（Current Read），它会读取最新的数据并加锁，因此可以看到并修改新插入的记录。 实际上这里根本不属于常规操作，要更新数据，从开始就应该使用当前读。从正常的逻辑也说不通，都没查到数据你去更新什么？谁会这么写代码？

- 第三次查询：由于之前执行了锁定读（更新操作），事务 A 已经看到了最新数据，因此这次查询也能看到新插入的记录。即便这里还要用MVCC的readview也能解释，当前事务修改过了数据，那最新版本中的隐藏字段中的事务ID自然变成了当前事务ID，按照可见性规则也能读取到该数据



<br/>





这些情形并没有说明 RR 隔离级别没有彻底解决幻读问题。相反，它们展示了 RR 隔离级别下快照读和锁定读的不同行为。

如果希望在整个事务期间保持绝对的一致性视图，可以考虑使用更高的隔离级别 **SERIALIZABLE**

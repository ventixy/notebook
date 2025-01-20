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

::: info MySQL-Lock 锁的不同分类方式

#### 1. 按照锁的粒度分类

- 表级锁（Table-Level Locks）: 锁住整张表，影响范围较大，但开销较小。
  可以通过 `LOCK TABLES` 和 `UNLOCK TABLES` 显式地对表进行加锁和解锁。
- 行级锁（Row-Level Locks）: 锁住表中的特定行，影响范围较小，但开销较大。**基于索引**
  可以通过 `SELECT ... FOR UPDATE` 或 `SELECT ... FOR SHARE` 显式地对行进行加锁。
    ```sql
    SELECT * FROM table_name WHERE id = 1 FOR UPDATE;
    SELECT * FROM table_name WHERE id = 1 FOR SHARE;
    ```
- 页面锁（Page-Level Locks）: 锁住表中的特定页面，介于表级锁和行级锁之间。
  在 BDB 存储引擎中使用页面锁，但现在很少使用 BDB 存储引擎。

#### 2. 按照锁的性质分类

- 共享锁（Shared Locks，S 锁）: 允许多个事务同时持有共享锁
  可以通过 `SELECT ... FOR SHARE` 显式地获取共享锁。
    ```sql
    SELECT * FROM table_name WHERE id = 1 FOR SHARE;
    ```
- 排他锁（Exclusive Locks，X 锁）：只允许一个事务持有排他锁，阻止其他事务的任何操作。
  可以通过 `SELECT ... FOR UPDATE` 显式地获取排他锁。
    ```sql
    SELECT * FROM table_name WHERE id = 1 FOR UPDATE;
    ```
- 意向锁（Intent Locks）: 表示对表或页面的锁定意图。在 InnoDB 存储引擎中自动使用。
  - **意向共享锁（IS 锁）**：表示事务打算对表中的某些行获取共享锁。
  - **意向排他锁（IX 锁）**：表示事务打算对表中的某些行获取排他锁。


#### 3. 按照锁的作用范围分类

- 记录锁（Record Locks）: 锁住索引记录。
- 间隙锁（Gap Locks）: 锁住索引记录之间的间隙。在 InnoDB 存储引擎中自动使用，主要用于防止幻读。
- 临键锁（记录+间隙锁）（Next-Key Locks）：同时锁住索引记录和其前一个间隙。在 InnoDB 存储引擎中自动使用，主要用于防止幻读。
:::








### Innodb中的锁


InnoDB 中的锁机制是确保数据一致性和并发控制的关键部分。根据不同的层次和用途，InnoDB 提供了多种类型的锁。[InnoDB Locking](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html)

#### 1. **表级锁（Table-Level Locks）**

- **意向锁（Intention Locks）**：
  - **意向共享锁（IS, Intention Shared Lock）**
  - **意向排他锁（IX, Intention Exclusive Lock）**
  - 意向锁用于表明事务意图对表中的某些行加锁。
  - [官方文档：意向锁](https://dev.mysql.com/doc/refman/8.0/en/innodb-lock-modes.html)

#### 2. **行级锁（Row-Level Locks）**

- **记录锁（Record Locks）**：
  - 锁定索引记录本身。
  
- **间隙锁（Gap Locks）**：
  - 锁定索引记录之间的间隙，防止其他事务插入新记录。

- **临键锁（Next-Key Locks）**：
  - 结合了记录锁和间隙锁，锁定一个范围（包括索引记录和它之前的间隙）。
  - [官方文档：行级锁](https://dev.mysql.com/doc/refman/8.0/en/innodb-record-level-locks.html)

- **插入意向锁（Insert Intention Gap Locks）**：
  - 一种特殊的间隙锁，表示多个事务意图在同一个间隙中插入行。

#### 3. **元数据锁（Metadata Locks, MDL）**

- **元数据锁**：
  - 用于保护数据库对象（如表、视图等）的结构，防止在查询过程中发生结构变化。
  - [官方文档：元数据锁](https://dev.mysql.com/doc/refman/8.0/en/metadata-locking.html)

#### 4. **其他锁**

- **自增锁（Auto-Increment Locks）**：
  - 控制 `AUTO_INCREMENT` 列值的分配。
  - [官方文档：自增锁](https://dev.mysql.com/doc/refman/8.0/en/innodb-auto-increment-lock-mode.html)

- **外键锁（Foreign Key Locks）**：
  - 用于维护外键约束的一致性。
  - [官方文档：外键约束](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)

- **缓冲池锁（Buffer Pool Locks）**：
  - 这不是传统意义上的锁，而是指保护缓冲池内部结构的同步机制。
  - [官方文档：InnoDB 缓冲池](https://dev.mysql.com/doc/refman/8.0/en/innodb-buffer-pool.html)

#### 综合锁模式文档

对于更详细的锁模式信息，可以参考以下综合文档：

- [InnoDB 锁模式](https://dev.mysql.com/doc/refman/8.0/en/innodb-lock-modes.html)
- [InnoDB 行级锁](https://dev.mysql.com/doc/refman/8.0/en/innodb-record-level-locks.html)

这些文档提供了关于每种锁的详细说明、使用场景以及它们如何影响并发操作的信息。如果你有更多问题或需要进一步的帮助，请随时提问！









### 共享排他锁


共享排他锁（[Shared and Exclusive Locks](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html#innodb-shared-exclusive-locks)）属于**行级锁**，分为共享锁和排他锁:

- 共享锁(SLock)：允许持有该锁的事务读取一行数据

- 排他锁(XLock)：允许该锁的事务**删除或更新**一行数据


| Shared and Exclusive Locks | 排他锁（X 锁） | 共享锁（S 锁） |
|-----------------|--------------|----------|
| 排他锁（XLock）   |   ❌        | ❌       |
| 共享锁（SLock）    | ❌          | ✔       |

- Innodb会自动给 `insert`,`update` 语句涉及到的数据集加 排他锁（XLock）

- 普通的 `select` 语句不会加锁，但可以使用下列方式加锁（参照：[locks-set](https://dev.mysql.com/doc/refman/8.4/en/innodb-locks-set.html)）：

```sql
SELECT ... LOCK IN SHARE MODE;
SELECT ... FOR UPDATE;
```







### 意向锁













### 记录锁


















### 间隙锁


- **间隙锁**：锁住索引记录之间的间隙，而不是具体的记录。防止其他事务在这段间隙中插入新的记录
  - 锁住的范围：间隙锁锁住的是索引记录之间的空白区域。
  例：假设有一个索引包含以下记录：1, 4, 7。间隙锁可以锁住以下间隙：
  `(负无穷, 1)  (1, 4)  (4, 7)  (7, 正无穷)`
  - 在 `可重复读`（Repeatable Read）隔离级别下，InnoDB 自动使用间隙锁来防止幻读。通常不需要手动使用间隙锁，但可以通过 `SELECT ... FOR UPDATE`间接触发。



::: important Next-Key Lock / Gap Locking
#### 间隙锁（Gap Locking）

间隙锁是一种锁定机制，用于锁定数据行之间的间隙，防止其他事务在这些间隙中插入新的数据。具体来说：

- **锁定间隙**：不仅锁定实际的数据行，还锁定数据行之间的空隙。
- **防止幻读**：通过锁定间隙，防止其他事务在这些间隙中插入新的数据，从而防止幻读问题。

#### 总结

- **间隙锁**：锁定数据行之间的间隙，防止其他事务在这些间隙中插入新的数据。

:::










### 临键锁

- **临键锁**：同时锁住索引记录和其前一个间隙。临键锁是记录锁和间隙锁的组合。
  - 锁住的范围：临键锁不仅锁住具体的索引记录，还锁住该记录之前的所有间隙。
    例：假设有一个索引包含以下记录：1, 4, 7。临键锁可以锁住以下范围：
    ` (负无穷, 1]（包括1） (1, 4]（包括4）(4, 7]（包括7）(7, 正无穷]`
  - 在 `可重复读`（Repeatable Read）隔离级别下，InnoDB 自动使用临键锁来防止幻读。通常不需要手动使用临键锁，但可以通过 `SELECT ... FOR UPDATE`间接触发。



::: important Next-Key Lock / Gap Locking
`Next-Key Lock` 锁算法是指结合了行锁和间隙锁（Gap Locking）的一种锁策略，主要用于防止幻读问题。

#### Next-Key Lock

`Next-Key Lock` 是一种结合了行锁和间隙锁的锁策略，主要用于解决幻读问题。具体来说：

- **行锁**：锁定实际的数据行。
- **间隙锁**：锁定数据行之间的间隙。
- **范围锁**：锁定一个范围内的所有数据行和间隙。

`Next-Key Lock` 锁住的不仅仅是单个数据行，还包括该行前面的间隙。因此，它实际上是一个范围锁，可以防止其他事务在该范围内插入新的数据。

**示例**：假设有一个索引包含以下数据行：

```
10, 20, 30, 40
```

在一个 `Repeatable Read` 隔离级别下，如果一个事务执行了以下查询：

```sql
SELECT * FROM table WHERE id > 10 AND id < 40 FOR UPDATE;
```

这个查询会使用 `Next-Key Lock` 锁住以下范围：

- 从 10 到 20 的间隙
- 数据行 20
- 从 20 到 30 的间隙
- 数据行 30
- 从 30 到 40 的间隙

这样，其他事务就无法在这些间隙中插入新的数据，从而防止了幻读问题。

#### 总结

- **MVCC**：允许多个事务在同一时间访问同一数据的不同版本，提高并发性能。
- **间隙锁**：锁定数据行之间的间隙，防止其他事务在这些间隙中插入新的数据。
- **Next-Key Lock**：结合了行锁和间隙锁，锁定一个范围内的所有数据行和间隙，防止幻读问题。
:::









### 插入意向锁




























## 幻读问题回顾与总结

在 MySQL InnoDB 存储引擎中，间隙锁（Gap Locks）和临键锁（Next-Key Locks）是用于解决幻读问题的关键机制。





**如何解决幻读**：在一个事务中，多次执行相同的查询，但结果集却不同。这是因为其他事务在这段时间内插入了新的记录。而间隙锁和临键锁的作用：
- **防止插入新记录**：通过锁住索引记录之间的间隙，间隙锁和临键锁可以防止其他事务在这段间隙中插入新的记录。
- **保持事务的一致性**：确保事务内的多次查询结果一致，避免幻读现象。
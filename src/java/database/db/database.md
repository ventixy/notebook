---

order: 1
title:  数据库理论

---


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



<br/>



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



## 事务Transaction

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
- 事务是一个不可分割的最小工作单位，事务中的所有操作要么全部完成，要么全部不执行。事务执⾏过程中如果出错， 会回滚到事务开始前的状态，所有的操作就像没有发⽣一样。

- 作用：保证事务的完整性，防止部分操作成功而部分操作失败导致的数据不一致。

#### ⼀致性（Consistency）
- 一个事务在执⾏之前和执行之后，数据库都必须处于⼀致性状态。即事务必须是数据库从一个一致性状态到另外一个一致性状态。
  *比如：如果从A账户转账到B账户，不可能因为A账户扣了钱，⽽B账户没有加钱（两个账号的总金额要保持一致状态）*

- 作用：确保数据库从一个一致状态转换到另一个一致状态，即使事务失败也不会破坏数据库的一致性。


#### 隔离性（Isolation）

- ==事务的执行是独立的，不受其他事务的干扰==。一个事务的中间状态对其他事务是不可见的。

- 在并发环境中，并发的事务是互相隔离的。也就是说，不同的事务并发操作相同的数据时，每个事务都有各自完整的数据空间。 ⼀个事务内部的操作及使用的数据对其它并发事务是隔离的，并发执行的各个事务是不能互相干扰的。 

- 在事务中，有隔离级别的定义，不同的隔离级别有不同的影响的程度。

- 作用：防止多个事务并发执行时产生的相互干扰，确保事务的执行结果是正确的。

#### 持久性（Durability）

- 一旦事务提交，其对数据库的改变是永久的，即使系统发生故障也不会丢失。

- 作用：确保事务的结果能够持久保存，不会因为系统崩溃或其他问题而丢失。

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


::: details Next-Key Lock锁算法 / MVCC / Gap Locking
`Next-Key Lock` 锁算法是指结合了行锁和间隙锁（Gap Locking）的一种锁策略，主要用于防止幻读问题。

#### 多版本并发控制（MVCC）

多版本并发控制（MVCC）是一种并发控制机制，允许多个事务在同一时间访问同一数据的不同版本，而不需要阻塞其他事务。具体来说：

- **版本链**：每个数据行可以有多个版本，每个版本带有时间戳或事务ID。
- **读取不阻塞写入**：事务读取数据时，看到的是事务开始时的数据快照，不会阻塞其他事务的写操作。
- **写入不阻塞读取**：事务写入数据时，不会阻塞其他事务的读操作。

==多版本并发控制（MVCC） 是 InnoDB 用来实现 `Repeatable Read` 隔离级别的一种机制(也即是用来提高并发性能的一种机制)==

#### 间隙锁（Gap Locking）

间隙锁是一种锁定机制，用于锁定数据行之间的间隙，防止其他事务在这些间隙中插入新的数据。具体来说：

- **锁定间隙**：不仅锁定实际的数据行，还锁定数据行之间的空隙。
- **防止幻读**：通过锁定间隙，防止其他事务在这些间隙中插入新的数据，从而防止幻读问题。

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
---

order: 5
title:  SQL语言基础

---


SQL：Structured Query Language（结构化查询语言），是用来操作关系型数据库的一门语言。

SQL是一个关系型数据库的通用操作语言，也成为标准SQL，也叫SQL-92。

==**Create, Read, Update, and Delete 通常称为CRUD操作**==


::: details 几种常见的SQL语句类型：

1. **数据定义语言 (Data Definition Language, DDL)**
   - 用于创建、修改或删除数据库对象（如表、索引、视图等）。
   - **常见语句**：
     - `CREATE`：创建新的数据库对象。
     - `ALTER`：修改现有的数据库对象。
     - `DROP`：删除数据库对象。
   - **示例**：
     ```sql
     CREATE TABLE Customers (
         CustomerID int,
         Name varchar(255),
         Address varchar(255)
     );
     ```

2. **数据操纵语言 (Data Manipulation Language, DML)**
   - 用于插入、更新、删除数据库中的数据。
   - **常见语句**：
     - `INSERT`：向表中插入新记录。
     - `UPDATE`：修改现有记录的数据。
     - `DELETE`：从表中删除记录。
   - **示例**：
     ```sql
     INSERT INTO Customers (CustomerID, Name, Address)
     VALUES (1, 'John Doe', 'High St, 123');
     ```

3. **数据查询语言 (Data Query Language, DQL)**
   - 主要用于检索数据库中的数据。
   - **常见语句**：
     - `SELECT`：用于从数据库中选取数据。
   - **示例**：
     ```sql
     SELECT * FROM Customers;
     ```

4. **事务控制语言 (Transaction Control Language, TCL)**
   - 用于管理事务的执行，确保数据的一致性和完整性。
   - **常见语句**：
     - `COMMIT`：提交当前事务中的更改。
     - `ROLLBACK`：撤消当前事务中的更改。
     - `SAVEPOINT`：设置事务的保存点。
   - **示例**：
     ```sql
     START TRANSACTION;
     -- 执行一些操作...
     COMMIT;
     ```

5. **数据控制语言 (Data Control Language, DCL)**
   - 用于授予或收回访问数据库资源的权限。
   - **常见语句**：
     - `GRANT`：授予用户特定的权限。
     - `REVOKE`：收回用户的权限。
   - **示例**：
     ```sql
     GRANT SELECT ON Customers TO 'username';
     ```
:::

	

## 数据定义和操纵

DDL（Data Definition Language），数据定义语言，用来**定义数据库对象：库、表、列** 

### 数据库的定义

1. **创建数据库 (`CREATE DATABASE`)**  
   创建一个新的数据库，这个命令通常由数据库管理员执行。

   ```sql
   CREATE DATABASE database_name;
   ```

   有时候还需要指定一些额外的选项，如存储位置、字符集等，具体取决于所使用的数据库管理系统。

2. **删除数据库 (`DROP DATABASE`)**  
   用于删除一个现有的数据库。这是一个非常强大的命令，因为一旦执行，整个数据库将被永久删除，因此在使用时需要特别小心。

   ```sql
   DROP DATABASE database_name;
   ```

### 表层面的DDL

1. **创建表 (`CREATE TABLE`)**  
   创建一张新的表，这是DDL中最常用的命令之一。创建表时，你需要指定表名、列名、列的数据类型以及可能的约束条件。

   ```sql
   CREATE TABLE table_name (
       column1 datatype constraints,
       column2 datatype constraints,
       ...
       PRIMARY KEY (column_name),
       FOREIGN KEY (column_name) REFERENCES referenced_table(referenced_column),
       UNIQUE (column_name),
       CHECK (constraint)
   );
   ```

   例如，创建一个简单的`Customers`表：

   ```sql
   CREATE TABLE Customers (
       CustomerID INT PRIMARY KEY,
       FirstName VARCHAR(255) NOT NULL,
       LastName VARCHAR(255) NOT NULL,
       Email VARCHAR(255) UNIQUE
   );
   ```

2. **修改表 (`ALTER TABLE`)**  
   用于修改已存在的表结构，可以添加、删除或修改列，也可以添加或删除约束。

   - 添加/删除一列：

     ```sql
     ALTER TABLE table_name ADD column_name datatype constraints;

     ALTER TABLE table_name DROP COLUMN column_name;
     ```

   - 修改列名/数据类型：

     ```sql
     ALTER TABLE Employees MODIFY Salary DECIMAL(10, 2);

     ALTER TABLE Employees CHANGE Salary Sal DECIMAL(10, 2);
     ```
      - `MODIFY`：修改指定列的类型
      - `CHANGE`：修改指定列的类型和列名 （MySql推荐使用）

   - 添加/删除主键约束：

     ```sql
     ALTER TABLE table_name ADD PRIMARY KEY (column_name);

     ALTER TABLE table_name DROP PRIMARY KEY;
     ```

3. **删除表 (`DROP TABLE`)**  
   用于删除一个已存在的表。与删除数据库类似，这也是一项不可逆的操作，所以执行前需谨慎。

   ```sql
   DROP TABLE table_name;
   ```

4. **截断表 (`TRUNCATE TABLE`)**  
   虽然`TRUNCATE`不是标准的DDL命令，但它常用于快速清空表中的所有数据而不删除表本身。

   ```sql
   TRUNCATE TABLE table_name;
   ```

DDL可以定义数据库的结构，创建和删除数据库对象，并修改现有对象的结构。在使用DDL语句时，应当注意权限管理和数据安全，确保操作不会导致数据丢失或其他不良后果。






### DML数据操纵

DML（Data Manipulation Language）, 数据操作语言，用来定义数据库记录（数据）**增删改** 

1. `INSERT`: 用于向表中插入新的记录。

```sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
```

示例：假设有一个名为`Employees`的表，包含`EmployeeID`, `FirstName`, `LastName`, `Email`等字段，可以这样插入一条记录：
```sql
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email)
VALUES (1, 'John', 'Doe', 'john.doe@example.com');
```

2. `UPDATE`: 用于修改已存在于表中的数据。

```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE some_column = some_value;
```

示例：将`Employees`表中`EmployeeID`为1的员工的电子邮件地址更改为`new.email@example.com`
```sql
UPDATE Employees
SET Email = 'new.email@example.com'
WHERE EmployeeID = 1;
```

3. `DELETE`: 用于从表中删除记录。

```sql
DELETE FROM table_name
WHERE some_column = some_value;
```

示例：如果要删除`Employees`表中`EmployeeID`为1的员工记录，可以这样做：
```sql
DELETE FROM Employees WHERE EmployeeID = 1;
```

::: info DML进阶用法

- **批量插入**：可以一次插入多条记录。
  ```sql
  INSERT INTO table_name (column1, column2, ...)
  VALUES (value1, value2, ...),
         (value1, value2, ...),
         ...
  ```

- **子查询插入**：可以从一个查询的结果集中插入数据到另一个表。
  ```sql
  INSERT INTO table_name (column1, column2, ...)
  SELECT column1, column2, ...
  FROM source_table
  WHERE some_condition;
  ```

- **条件更新**：可以结合`CASE`语句进行条件更新。
  ```sql
  UPDATE table_name
  SET column = CASE WHEN some_condition THEN value1 ELSE value2 END
  WHERE some_other_condition;
  ```
:::




## DQL单表查询

DQL（Data Query Language）,   数据查询语言，用来 **查询记录（数据）** 

数据查询语言（Data Query Language, DQL）主要用于从数据库中检索数据。在SQL中，最常用的DQL命令是`SELECT`语句，它提供了丰富的功能来帮助用户查询数据。以下是关于单表查询的详细介绍，包括起别名、条件查询、去重、聚合函数、分组、分页和模糊查询等内容。

### 起别名(Aliases)

起别名可以让查询结果更加易读或方便后续处理。

```sql
SELECT column_name AS alias_name FROM table_name;   -- 列别名

SELECT column_name FROM table_name AS alias_name;   -- 表别名
```

### 条件查询(WHERE)

条件查询允许你基于特定条件筛选数据。

```sql
SELECT column_name
FROM table_name
WHERE condition;
```

例如，查询`Employees`表中部门编号为10的员工信息：
```sql
SELECT *
FROM Employees
WHERE DepartmentID = 10;
```

### 去重(DISTINCT)

使用`DISTINCT`关键字可以去除重复的记录。

```sql
SELECT DISTINCT column_name
FROM table_name;
```

例如，获取所有不同的职位名称：
```sql
SELECT DISTINCT Position
FROM Employees;
```

### 常见聚合函数

聚合函数用于执行计算，如求和、平均值、最大值、最小值等。常见聚合函数:
- `COUNT()`: 计算行数。
- `SUM()`: 求和。
- `AVG()`: 平均值。
- `MAX()`: 最大值。
- `MIN()`: 最小值。

示例: 计算`Employees`表中所有员工的工资总和：
```sql
SELECT SUM(Salary)
FROM Employees;
```

### 分组(GROUP BY)

分组查询（Grouping Queries）允许你按照一个或多个列的值对结果集进行分组，并且对每个分组执行聚合操作。

1. `GROUP BY` 子句

`GROUP BY`通常与聚合函数（如`COUNT()`, `SUM()`, `AVG()`, `MAX()`, `MIN()`等）一起使用。

```sql
SELECT column_name, aggregate_function(column_name)
FROM table_name
GROUP BY column_name;
```

示例：假设我们有一个`Orders`表，包含`OrderID`, `CustomerID`, `OrderDate`等字段，我们可以找出每个客户的订单总数：
```sql
SELECT CustomerID, COUNT(OrderID) AS NumberOfOrders
FROM Orders
GROUP BY CustomerID;
```

2. `GROUP_CONCAT` 函数

`GROUP_CONCAT`函数用于将一个组内的值连接成一个字符串。这对于汇总每个分组内的多个值非常有用。

```sql
SELECT column_name, GROUP_CONCAT(another_column SEPARATOR separator)
FROM table_name
GROUP BY column_name;
```

示例：如果我们想列出每个客户的所有订单号，可以这样做：
```sql
SELECT CustomerID, GROUP_CONCAT(OrderID SEPARATOR ', ') AS OrderNumbers
FROM Orders
GROUP BY CustomerID;
```

3. `HAVING` 子句

`HAVING`子句用于过滤分组后的结果，类似于`WHERE`子句，但是`HAVING`作用于分组级别而不是行级别。

```sql
SELECT column_name, aggregate_function(column_name)
FROM table_name
GROUP BY column_name
HAVING aggregate_condition;
```

示例：如果我们想找出订单数超过10次的客户：
```sql
SELECT CustomerID, COUNT(OrderID) AS NumberOfOrders
FROM Orders
GROUP BY CustomerID
HAVING NumberOfOrders > 10;
```

综合示例: 假设我们有一个`Employees`表，包含`EmployeeID`, `DepartmentID`, `FirstName`, `LastName`, `Salary`等字段，我们想找出每个部门中工资最高的前三名员工。

```sql
SELECT DepartmentID, FirstName, LastName, Salary
FROM (
    SELECT DepartmentID, FirstName, LastName, Salary,
           RANK() OVER (PARTITION BY DepartmentID ORDER BY Salary DESC) AS Rank
    FROM Employees
) AS RankedEmployees
WHERE Rank <= 3;
```

在这个例子中，我们使用了窗口函数`RANK()`来对每个部门的员工按工资排序，并标记排名。然后在外层查询中过滤出排名前三的员工。

::: tip 注意事项

- 使用`GROUP BY`时，`SELECT`列表中出现的非聚合列必须也是`GROUP BY`的一部分。
- `GROUP_CONCAT`函数返回的字符串长度受限于系统变量`group_concat_max_len`，可以通过设置该变量来改变长度限制。
- `HAVING`子句可以在聚合之后过滤数据，因此可以包含聚合函数，而`WHERE`子句不能包含聚合函数。
:::


### 分页(LIMIT和OFFSET)

`LIMIT`和`OFFSET`用于限制结果集的行数，并可以实现分页查询。

- `limit m`: 表示最多返回 `m` 条记录
- `offset n`：表示跳过（忽略）前 `n` 条记录

```sql
-- 标准写法 (从第21条记录开始，最多取10条记录)
SELECT * FROM table_name LIMIT 10 OFFSET 20;

-- MySQL中可以省略offset，但此时第一个数字表示的才是 offset
SELECT * FROM table_name LIMIT 20, 10;

-- 查询前10条记录
SELECT * FROM table_name LIMIT 0, 10;
-- 当offset为0时, 0可以省略
SELECT * FROM table_name LIMIT 10;
```

::: info 分页计算公式

假设我们需要实现第 `page` 页的数据查询，每页显示 `pageSize` 条记录：

- $\text{offset} = (\text{page} - 1) \times \text{pageSize}$

- $\text{limit} = \text{pageSize}$

例如，如果你想查询第 3 页的数据，每页显示 10 条记录，那么 `offset` 将是 `(3 - 1) * 10 = 20`，`limit` 将是 `10`。
:::


大多数现代的关系型数据库管理系统都支持 `LIMIT` 和 `OFFSET` 关键字，包括但不限于：**MySQL**, **PostgreSQL**, **SQLite**, **MariaDB** 等。

**Oracle**可以使用 `ROWNUM` 或者 `FETCH FIRST` 语句来实现分页查询。
  - 使用 `ROWNUM`：
    ```sql
    SELECT *
    FROM (
      SELECT column_name, ROWNUM rnum
      FROM table_name
      WHERE ROWNUM <= 30
      ORDER BY some_column
    )
    WHERE rnum >= 21;
    ```
  - 使用 `FETCH FIRST`：
    ```sql
    SELECT column_name
    FROM table_name
    ORDER BY some_column
    OFFSET 20 ROWS FETCH FIRST 10 ROWS ONLY;
    ```
- **SQL Server**：使用 `OFFSET` 和 `FETCH NEXT`：
  ```sql
  SELECT column_name
  FROM table_name
  ORDER BY some_column
  OFFSET 20 ROWS
  FETCH NEXT 10 ROWS ONLY;
  ```

**注意事项**：
- 使用 `OFFSET` 可能会导致性能问题，尤其是在偏移量很大时。这是因为数据库需要跳过大量的记录才能达到所需的起点。
- 对于大数据量的分页查询，考虑使用其他技术，如游标（Cursor）、窗口函数（Window Functions）或者索引等来优化性能。
- 在一些数据库中，`LIMIT` 和 `OFFSET` 的顺序是固定的，即 `LIMIT` 必须紧跟在 `OFFSET` 后面。






### 模糊查询(LIKE)

`LIKE`操作符用于模式匹配查询，常用于模糊搜索。

::: info 通配符
- `%`: 匹配任意数量的任意字符。
- `_`: 匹配单个任意字符。
:::

示例: 查找名字中包含字母`a`的员工：
```sql
SELECT *
FROM Employees
WHERE FirstName LIKE '%a%';
```





## DQL多表查询


在SQL中，多表查询是通过连接（JOIN）操作来实现的。

### 内连接(INNER JOIN）

内连接（也称为简单连接或自然连接）返回两个表中匹配的行。如果某个表中不存在匹配行，则不会返回任何行。

```sql
-- 显示内连接 （部分数据库中inner可省略，如MySql）
SELECT column_name(s) FROM table1
INNER JOIN table2 ON table1.column_name = table2.column_name;

-- 隐式内连接 where
SELECT column_name(s) FROM table1, table2
WHERE table1.column_name = table2.column_name;
```

示例：假设有两个表 `Employees` 和 `Departments`，`Employees` 表中有 `EmployeeID`, `Name`, `DepartmentID`，`Departments` 表中有 `DepartmentID`, `DepartmentName`。要获取每个员工的名字和所在部门的名称：

```sql
SELECT Employees.Name, Departments.DepartmentName
FROM Employees
INNER JOIN Departments
ON Employees.DepartmentID = Departments.DepartmentID;
```


::: info 自连接(SELF JOIN)

自连接是指同一个表自身连接自身。这种连接通常用于检索表中的层级结构或者一对多关系。

```sql
SELECT column_name(s)
FROM table t1
INNER JOIN table t2
ON t1.column_name = t2.column_name;
```

示例：假设有一个员工表 `Employees`，其中包含 `EmployeeID`, `ManagerID`, `Name`，并且每个员工有一个上级管理者（Manager）。要列出每个员工及其直接上级的名字：

```sql
SELECT e1.Name AS EmployeeName, e2.Name AS ManagerName
FROM Employees e1
INNER JOIN Employees e2
ON e1.ManagerID = e2.EmployeeID;
```
:::


### 外连接(OUTER JOIN)

左连接（`LEFT JOIN` 或 `LEFT OUTER JOIN`）返回左表（表1）中的所有行，即使右表（表2）中没有匹配的行。如果右表中不存在匹配行，则结果集中相应的位置为 `NULL`。

```sql
SELECT column_name(s)
FROM table1
LEFT JOIN table2
ON table1.column_name = table2.column_name;
```

右连接（RIGHT JOIN 或 RIGHT OUTER JOIN）返回右表（表2）中的所有行，即使左表（表1）中没有匹配的行。如果左表中不存在匹配行，则结果集中相应的位置为 `NULL`。

```sql
SELECT column_name(s)
FROM table1
RIGHT JOIN table2
ON table1.column_name = table2.column_name;
```



示例：如果想列出所有员工的信息，即使有些员工没有分配到部门：

```sql
SELECT Employees.Name, Departments.DepartmentName
FROM Employees
LEFT JOIN Departments
ON Employees.DepartmentID = Departments.DepartmentID;
```

如果想列出所有部门的信息，即使有些部门没有员工：

```sql
SELECT Employees.Name, Departments.DepartmentName
FROM Employees
RIGHT JOIN Departments
ON Employees.DepartmentID = Departments.DepartmentID;
```



### 全连接(FULL JOIN)

全连接（`FULL JOIN` 或 `FULL OUTER JOIN`）返回两个表中的所有行，无论是匹配的还是不匹配的。如果某表中不存在匹配行，则结果集中相应的位置为 `NULL`。

```sql
SELECT column_name(s)
FROM table1
FULL JOIN table2
ON table1.column_name = table2.column_name;
```

示例：如果想列出所有员工和部门的信息，无论是否有匹配：

```sql
SELECT Employees.Name, Departments.DepartmentName
FROM Employees
FULL JOIN Departments
ON Employees.DepartmentID = Departments.DepartmentID;
```



### 交叉连接(CROSS JOIN)

交叉连接（`CROSS JOIN` 或 `CARTESIAN JOIN`）返回两个表的笛卡尔积，即第一个表的每一行与第二个表的每一行组合在一起。

```sql
SELECT column_name(s) FROM table1 CROSS JOIN table2;
```

示例：假设有一个表 `Colors` 包含颜色信息，另一个表 `Shapes` 包含形状信息，要列出所有颜色和形状的组合：

```sql
SELECT Colors.ColorName, Shapes.ShapeName
FROM Colors
CROSS JOIN Shapes;
```




### 联合查询和子查询

**1. 联合查询（UNION）**

联合查询允许你将多个 `SELECT` 语句的结果合并成一个结果集。使用 `UNION` 时，结果集中的每一行必须具有相同的列数，并且相应的列必须具有相似的数据类型。

```sql
(SELECT column_name(s) FROM table1)
UNION
(SELECT column_name(s) FROM table2);
```

示例：假设我们有两个表 `Employees` 和 `Contractors`，都包含员工信息，但 `Contractors` 表记录的是合同工的信息。我们想要获取所有员工（正式员工和合同工）的名字。

```sql
SELECT Name
FROM Employees
UNION
SELECT Name
FROM Contractors;
```

::: tip 注意事项：
- **去重**：`UNION` 会自动去除重复的行。如果不需要去重，可以使用 `UNION ALL`。
- **顺序**：结果集中的列顺序取决于第一个 `SELECT` 语句中的列顺序。
- **数据类型**：所有 `SELECT` 
- 联合查询要求上下的两个SQL语句的结果的结构是一样的。联合查询通常情况下可以使用in查询来替代，但是也有自己独特的场景。（当in查询效率很慢的时候，我们可以考虑使用联合查询）。
:::

如果不需要去重，可以使用 `UNION ALL`：

```sql
SELECT Name
FROM Employees
UNION ALL
SELECT Name
FROM Contractors;
```

**2. 子查询（Subquery）**

子查询是指在一个查询语句中嵌套另一个查询语句。子查询可以出现在 `SELECT`, `FROM`, `WHERE` 或 `HAVING` 子句中。

示例：假设我们想要找出工资高于所有部门平均工资的员工。

```sql
SELECT Name, Salary
FROM Employees
WHERE Salary > (SELECT AVG(Salary) FROM Employees);
```

::: info 子查询的类型

1. **标量子查询**：返回单个值。
   ```sql
   SELECT Name
   FROM Employees
   WHERE Salary > (SELECT AVG(Salary) FROM Employees);
   ```

2. **集合子查询**：返回多个值。
   ```sql
   SELECT Name, DepartmentID
   FROM Employees
   WHERE DepartmentID IN (SELECT DepartmentID FROM Departments WHERE DepartmentName = 'Sales');
   ```

3. **相关子查询**：子查询依赖于外部查询的值。
   ```sql
   SELECT DepartmentName, AVG(Salary) AS AvgSalary
   FROM Employees e
   INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID
   GROUP BY d.DepartmentName
   HAVING AVG(Salary) > (SELECT AVG(Salary) FROM Employees);
   ```
:::







## SQL常见运算符

在标准SQL中，常见的运算符包括算术运算符、比较运算符、逻辑运算符和位运算符等。这些运算符用于执行各种数学计算、逻辑判断和位操作。下面详细介绍这些运算符及其用法：

**1. 算术运算符**

算术运算符用于执行基本的数学运算，如加法、减法、乘法、除法和取模（求余数）。常见的算术运算符：
- `+`：加法
- `-`：减法
- `*`：乘法
- `/`：除法
- `%` 或 `MOD`：取模（求余数）

示例：假设有一个表 `Orders` 包含 `Quantity` 和 `Price` 字段，我们想要计算每个订单的总价：

```sql
SELECT OrderID, Quantity * Price AS TotalPrice FROM Orders;
```

**2. 比较运算符**

比较运算符用于比较两个值，并返回布尔结果（真或假）。常见的比较运算符：
- `=`：等于
- `<>` 或 `!=`：不等于
- `<`：小于
- `>`：大于
- `<=`：小于等于
- `>=`：大于等于

示例：假设我们想要找出工资大于50000的员工：

```sql
SELECT * FROM Employees WHERE Salary > 50000;
```

**3. 逻辑运算符**

逻辑运算符用于组合条件表达式，以形成更复杂的条件判断。常见的逻辑运算符：
- `AND`：逻辑与（所有条件都必须为真）
- `OR`：逻辑或（至少有一个条件为真）
- `NOT`：逻辑非（反转布尔值）

示例：假设我们想要找出工资大于50000且部门编号为10的员工：

```sql
SELECT *
FROM Employees
WHERE Salary > 50000 AND DepartmentID = 10;
```

**4. 位运算符**

位运算符用于执行位级别的操作，如按位与、按位或、按位异或等。常见的位运算符：
- `&`：按位与
- `|`：按位或
- `^`：按位异或
- `<<`：左移
- `>>`：右移
- `~`：按位取反

示例：假设我们有一个表 `Users` 包含 `Permissions` 字段，表示用户的权限位标志，我们想要找出具有管理员权限（假设为二进制 `0001`）的用户：

```sql
SELECT *
FROM Users
WHERE Permissions & 0x01 = 0x01;
```

**5. 特殊运算符**

除了上述常见的运算符之外，还有一些特殊的运算符用于模式匹配和其他用途。常见的特殊运算符：
- `IN`：检查一个值是否在一个给定的集合中。
- `BETWEEN`：检查一个值是否在一个给定的区间内。
- `LIKE`：模式匹配。
- `IS NULL` 或 `IS NOT NULL`：检查一个值是否为 `NULL`。

示例：假设我们想要找出年龄在20到30岁之间的员工：

```sql
SELECT * FROM Employees WHERE Age BETWEEN 20 AND 30;
```

假设我们想要找出姓名中包含字母 `a` 的员工：

```sql
SELECT * FROM Employees WHERE Name LIKE '%a%';
```





## 查询语句执行顺序

SQL查询执行顺序：

1. **FROM**：
   - 首先执行 `FROM` 子句中的表定义或子查询，确定要查询的数据源。如果是多表查询，这里还包括连接操作。
   - 如果有视图（VIEW），视图也会在这里被展开。

2. **ON / USING / NATURAL JOIN**：
   - 如果有连接操作（如 `INNER JOIN`, `LEFT JOIN` 等），则执行连接条件（`ON` 子句）。
   - 如果使用 `USING` 或 `NATURAL JOIN`，则处理这些子句。

3. **WHERE**：
   - 执行 `WHERE` 子句中的过滤条件，筛选出符合条件的行。
   - 这一步可以极大地减少后续步骤需要处理的数据量。

4. **GROUP BY**：
   - 如果查询中有 `GROUP BY` 子句，则对结果集中的行进行分组。
   - 这一步发生在 `WHERE` 子句之后，因为在分组之前需要先确定哪些行会被保留。

5. **WITH [CUBE | ROLLUP]**：
   - 如果查询中有 `WITH CUBE` 或 `WITH ROLLUP` 子句，则会在分组的基础上生成额外的汇总行。
   - 这一步通常在 `GROUP BY` 之后执行。

6. **AGGREGATE FUNCTIONS**：
   - 应用聚合函数（如 `SUM`, `AVG`, `COUNT` 等）来计算每个分组的结果。
   - 这一步发生在 `GROUP BY` 之后，因为聚合函数需要在分组的基础上进行计算。

7. **HAVING**：
   - 应用 `HAVING` 子句中的过滤条件，进一步筛选聚合后的结果。
   - 这一步发生在聚合函数之后，因为在 `HAVING` 中可以使用聚合函数。

8. **SELECT**：
   - 选择要返回的列，并执行任何必要的表达式计算。
   - 这一步发生在 `HAVING` 之后，因为此时已经确定了最终的结果集。

9. **DISTINCT**：
   - 如果查询中有 `DISTINCT` 关键字，则去除重复的行。
   - 这一步通常在 `SELECT` 之后执行。

10. **ORDER BY**：
    - 对最终结果集进行排序。
    - 这一步发生在 `DISTINCT` 之后，因为排序需要在去重之后的结果集上进行。

11. **LIMIT / OFFSET**：
    - 如果查询中有 `LIMIT` 和 `OFFSET` 关键字，则限制返回的行数。
    - 这一步发生在 `ORDER BY` 之后，因为 `LIMIT` 和 `OFFSET` 通常需要在有序的结果集上进行。


示例：假设有一个 `Employees` 表，包含 `EmployeeID`, `DepartmentID`, `Salary` 等字段，我们想找出每个部门的平均工资，并且只保留平均工资大于50000的部门。

```sql
SELECT DepartmentID, AVG(Salary) AS AverageSalary
FROM Employees
WHERE Salary > 40000
GROUP BY DepartmentID
HAVING AVG(Salary) > 50000
ORDER BY AverageSalary DESC
LIMIT 10;
```

解析执行顺序：

1. **FROM**: 从 `Employees` 表中获取数据。
2. **WHERE**: 过滤出 `Salary > 40000` 的行。
3. **GROUP BY**: 将结果集按 `DepartmentID` 分组。
4. **AGGREGATE FUNCTIONS**: 计算每个部门的平均工资。
5. **HAVING**: 过滤出平均工资大于50000的部门。
6. **SELECT**: 选择 `DepartmentID` 和计算出的平均工资 `AverageSalary`。
7. **DISTINCT**: 此处没有 `DISTINCT`。
8. **ORDER BY**: 按照平均工资降序排序。
9. **LIMIT**: 限制结果集为前10条记录。


查询语句书写顺序：`select – from- where- group by- having- order by-limit `

查询语句执行顺序：`from - where -group by -having - select - order by-limit` 
--- 
dir:
    order: 1
index: false
title: 常用数据库

---

<Catalog hideHeading/>


## 数据库基础介绍

数据库的生产厂商为了占有市场份额，都会在标准SQL的基础上扩展一些自己的东西以吸引用户。

<br/>

常用的关系型数据库：

| 关系型数据库 | 开发公司         | 使用语言 |
| ------------ | ---------------- | -------- |
| access       | 微软公司         | SQL      |
| SQL Server   | 微软公司         | T-SQL    |
| Oracle       | 甲骨文公司       | PL/SQL   |
| MySQL        | 被甲骨文公司收购 | MySQL    |

- <span style='color:red;background:yellow;font-size:文字大小;font-family:字体;'>**Oracle**</span>，是由oracle这个公司开发的一个关系型数据库，目前是市面上使用的最多的一款收费的关系型数据库
- <span style='color:red;background:yellow;font-size:文字大小;font-family:字体;'>**MySQL**</span>，MySQL数据库是免费的数据库中使用率的最高的，之前是由个人开发者来开发和开源的，目前已经被Oracle这个公司收购了
- <span style='color:red;background:yellow;font-size:文字大小;font-family:字体;'>**SQL server**</span>，是微软的一个产品。
- Access，是office套件中的一员，目前很少有公司和个人在使用
- MariaDB，是MySQL的作者重新开发的一个开源的数据库产品，目前是免费的
- SQLlite，是一个非常轻量级的数据库产品，在Android手机中，就使用了SQLite来存储和管理通讯录、短信等内容
- OceanBase，是由蚂蚁金服开源的一个数据库产品。

<br/>



**非关系型数据库**：是作为关系型数据库的一个补充。

关系型数据库大多数的产品都是把数据存储在磁盘上，存储在磁盘上的数据需要经过IO，读写速度比较慢。

但是有一些业务场景是需要读写速度比较快的，所以就有了非关系型数据库。

非关系型数据库如何做到读写速度比较快呢？一般的策略是把数据存储在内存中。

非关系型数据库还有名字，叫做NoSQL（NOSQL：Not only SQL）

有哪些产品呢？

- <span style='color:red;background:yellow;font-size:文字大小;font-family:字体;'>**Redis，是目前使用的最多的一个非关系型数据库产品，是开源的，免费的。**</span>
- Memcache，是一个比较老的非关系型数据库产品，目前已经被Redis完全取代了
- MongoDB，目前有上升的态势，但是使用率还不够
- Hbase，是大数据领域常用的非关系型数据库





## Oracle数据库




## IBM DB2数据库

当首次安装并配置 DB2 数据库管理系统后，通常会有一个默认的系统管理员角色，即 `SYSADM`。这个角色拥有最高的权限，可以执行所有数据库管理任务。

DB2 安装过程中，会提示你设置一个实例用户（如 `db2inst1`），这个用户将具有 `SYSADM` 角色。

```sh
# 启动 DB2 实例
db2start

# 切换到实例用户
su - db2inst1

# 连接到数据库管理器
db2 connect to dbname

# 可以通过以下命令验证当前用户是否具有 `SYSADM` 角色
db2 "SELECT DISTINCT GRANTEE, AUTHORITY FROM SYSIBMADM.DB_AUTH WHERE AUTHORITY = 'SYSADM'"
```

如果你还没有创建数据库，可以使用以下命令创建一个新的数据库:
```bash
db2 create database mydb
```


### 用户和权限管理

DB2 的用户和权限管理主要依赖于操作系统用户管理和数据库级别的权限授予。

::: info 创建/删除用户

DB2 不直接支持在数据库中创建用户，而是依赖于操作系统的用户管理。

```sh
sudo useradd username
sudo passwd username

sudo userdel username
```
:::


创建用户后，需要在 DB2 中授予该用户连接数据库的权限。

```sh
# 连接到 DB2 数据库
db2 connect to your_database

# 授予连接权限
GRANT CONNECT ON DATABASE your_database TO USER username;
```


还可以授予用户对特定表的权限，如 `SELECT`、`INSERT`、`UPDATE` 和 `DELETE`。

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE schema.table_name TO USER username;

-- 撤销表级权限
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE schema.table_name FROM USER username;

-- 撤销连接权限
REVOKE CONNECT ON DATABASE your_database FROM USER username;
```

DB2 支持角色管理，可以将一组权限分配给一个角色，然后再将角色分配给用户。

```sql
-- 创建角色
CREATE ROLE role_name;

-- 授予角色权限
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE schema.table_name TO ROLE role_name;

-- 将角色分配给用户
GRANT ROLE role_name TO USER username;

-- 撤销角色权限
REVOKE ROLE role_name FROM USER username;
```


::: info 查看用户权限及其他常用命令
#### 查看用户权限
查看用户的数据库连接权限
```sql
SELECT * FROM SYSCAT.DBAUTH WHERE GRANTEE = 'username';
```

查看用户的表级权限
```sql
SELECT * FROM SYSCAT.TABAUTH WHERE GRANTEE = 'username';
```

查看用户的列级权限
```sql
SELECT * FROM SYSCAT.COLAUTH WHERE GRANTEE = 'username';
```

#### 其他常用命令

列出所有用户
```sql
SELECT DISTINCT GRANTEE FROM SYSCAT.DBAUTH;
```

列出所有角色
```sql
SELECT DISTINCT ROLE_NAME FROM SYSCAT.ROLEAUTH;
```
:::






### 分页查询

DB2的分页查询可以使用`ROW_NUMBER()`函数结合CTE（Common Table Expression）实现。`ROW_NUMBER()`函数为每一行数据分配一个唯一的行号，这些行号可以用于分页。

示例：假设有一个名为`Employees`的表，有三个列：`EmployeeID`，`FirstName`，`LastName`

```sql
SELECT
    EmployeeID, FirstName, LastName
FROM
    (SELECT 
        ROW_NUMBER() OVER (ORDER BY EmployeeID) AS RowNum,
        EmployeeID, FirstName, LastName
     FROM
        Employees) AS Sub
WHERE 
    Sub.RowNum BETWEEN 20 AND 30;
```

DB2 10.1版本开始支持`FETCH FIRST ... ROWS ONLY`和`OFFSET`子句，可以比较方便地进行分页操作

```sql
SELECT 
    EmployeeID, FirstName, LastName
FROM 
    Employees
ORDER BY 
    EmployeeID
OFFSET 20 ROWS FETCH FIRST 10 ROWS ONLY;
```





### 索引和执行计划

主键索引/普通索引/联合索引的创建和删除：
  ```sql
  -- 主键索引
  ALTER TABLE table_name ADD PRIMARY KEY (column_name);
  ALTER TABLE table_name DROP PRIMARY KEY;
  
  -- 普通索引
  CREATE INDEX index_name ON table_name (column_name);
  DROP INDEX index_name;
  
  -- 联合索引
  CREATE INDEX index_name ON table_name (column1, column2, ...);
  DROP INDEX index_name;
  ```

::: info DB2查看执行计划

1. **准备工作**：
   - 首次执行时，在`dbinst`用户下使用`connect to dbname`连接到数据库。
   - 使用`db2 -tvf $HOME/sqllib/misc/EXPLAIN.DDL`命令建立执行计划表。

2. **设置解释模式**：在数据库所在用户下执行以下命令：
     ```shell
     db2 set current explain mode explain
     ```
     
3. **执行想要分析的SQL语句**：
   ```sql
   db2 "SELECT DISTINCT RTRIM(MARKET_CODE), RTRIM(CURRENCY_TYPE), t.* FROM KS.BRANCH_PARAM t WHERE PARAM_CODE='0986'"
   db2 "SELECT a.name, a.cert_type, a.cert_no, A.CUST_NO, A.OPEN_DATE, A.BRANCH_CODE, a.* FROM KS.CUST_BASE_INFO A WHERE a.cert_no='0050000101'"
   ```

4. **取消解释模式**：
   ```shell
   db2 set current explain mode no
   ```

5. **生成执行计划**： 使用`db2exfmt`命令生成执行计划输出到文件：
     ```shell
     db2exfmt -d ksdbs -g TIC -w -l -s % -n % -o db2exmt.out
     ```
:::



- **db2expln**：
  ```shell
  db2expln -d <database> -c <schema> -p <package> -o <explan_out_file> -s 0 -g
  ```







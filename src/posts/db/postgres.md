---
article: true
date: 2025-05-21
category:
  - Database
  - PostgreSQL
tag:
  - Database
  - PostgreSQL
  - PGVector
shortTitle: PostgreSQL
title: PostgreSQL数据库
order: 50
---


PostgreSQL 是一个开源的对象关系型数据库管理系统（ORDBMS）。它最初于1986年在加州大学伯克利分校作为 POSTGRES 项目启动，并于1996年更名为 PostgreSQL，以反映其对 SQL 标准的支持。

- 核心特性：完全符合SQL标准，插件丰富。且有 [Neon](https://neon.tech/) 和 [supadata](https://supabase.com) 两家免费的数据库云服务
- 图形化管理工具 - pgAdmin：官方的 PostgreSQL 图形化管理工具，功能全面，支持复杂查询、监控、调试、ERD 工具等。
- 资源和文档：[PostgreSQL Documentation](https://www.postgresql.org/docs/), [PostgreSQL Exercises](https://pgexercises.com/), [PostgreSQL Tutorial (by Neon)](https://neon.tech/postgresql/tutorial)


## PostgreSQL基础

### psql命令行工具

`psql` 是 PostgreSQL 的官方命令行交互式客户端工具。 提供了许多元命令和各种类似 shell 的功能，以方便编写脚本和自动化各种任务。

`psql` 通常作为 PostgreSQL 服务器或客户端软件包的一部分进行安装。
* **Debian/Ubuntu**: `sudo apt install postgresql-client`
* **RHEL/CentOS**: `sudo dnf install postgresql`
* **macOS (Homebrew)**: `brew install libpq` (然后可能需要链接 `psql`) 或 `brew install postgresql`
* **Windows**: 通过官方的 EnterpriseDB 安装程序安装。

**基本用法：**

1.  **连接到数据库：**
    ```bash
    psql -h hostname -p port -U username -d databasename
    ```
    如果使用默认设置（本地主机，端口5432，当前操作系统用户，与用户名同名的数据库），可以简化为：
    ```bash
    psql -d mydatabase
    ```
    连接后，会看到类似 `mydatabase=#` 的提示符。

2.  **执行SQL命令：**
    直接输入SQL命令，以分号 `;` 结尾。
    ```sql
    SELECT version();
    CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100));
    ```

3.  **常用元命令 (Meta-commands)：**
    元命令以反斜杠 `\` 开头，不以分号结尾。

    * `\l` 或 `\list`：列出所有数据库。
    * `\c databasename [username]`：连接到指定的数据库（可选择指定用户）。
    * `\conninfo`：显示当前连接信息。
    * `\dt [schema_pattern.]table_pattern`：列出匹配模式的表（在当前数据库中）。
    * `\d object_name`：描述指定的数据库对象（表、视图、索引、序列等）。例如 `\d users`。
    * `\dn [schema_pattern]`：列出所有（或匹配模式的）模式 (schemas)。
    * `\df [schema_pattern.]function_pattern`：列出函数。
    * `\dv [schema_pattern.]view_pattern`：列出视图。
    * `\du [role_pattern]`：列出所有（或匹配模式的）角色 (用户和组)。
    * `\dp [pattern]` 或 `\z [pattern]`：列出表、视图和序列的访问权限。
    * `\timing [on|off]`：切换显示每个SQL语句执行时间的开关。
    * `\h [command]`：显示指定SQL命令的帮助信息，如 `\h CREATE TABLE`。
    * `\?`：显示psql元命令的帮助信息。
    * `\q`：退出 `psql`。
    * `\i filename`：从文件执行命令。
    * `\e`：使用外部编辑器编辑当前查询缓冲区。
    * `\set [name [value]]`：设置psql变量。
    * `\unset name`：取消设置psql变量。

4.  **从文件执行SQL：**
    ```bash
    psql -d mydatabase -U myuser -f /path/to/script.sql
    ```

5.  **环境变量：**
    `psql` 的行为可以通过一些环境变量来控制，例如 `PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`。

`psql` 是管理和使用 PostgreSQL 数据库的强大且灵活的工具。

### 用户与权限管理

在 PostgreSQL 中，用户和权限管理是通过“角色 (Roles)”的概念来实现的。角色可以被看作是用户，也可以被看作是用户组，或者两者兼而有之。

**1. 创建角色 (用户)：**

使用 `CREATE ROLE` SQL 命令或 `createuser` 命令行工具。

* **SQL 命令：**
    ```sql
    CREATE ROLE role_name [WITH option [...]]
    ```
    常用选项 `option` 包括：
    * `LOGIN` / `NOLOGIN`: 角色是否可以登录。具有 `LOGIN` 权限的角色通常被称为“用户”。默认为 `NOLOGIN` (除非使用 `CREATE USER` 语法，它隐含 `LOGIN`)。
    * `SUPERUSER` / `NOSUPERUSER`: 角色是否为超级用户。超级用户绕过所有权限检查。
    * `CREATEDB` / `NOCREATEDB`: 角色是否可以创建数据库。
    * `CREATEROLE` / `NOCREATEROLE`: 角色是否可以创建、修改、删除其他角色。
    * `INHERIT` / `NOINHERIT`: 角色是否继承其所属角色的权限。默认为 `INHERIT`。
    * `PASSWORD 'password'` 或 `ENCRYPTED PASSWORD 'password'`: 设置角色密码。密码总是被加密存储。
    * `VALID UNTIL 'timestamp'`: 设置密码的有效期。
    * `CONNECTION LIMIT connlimit`: 限制角色可以建立的并发连接数。

    **示例：**
    创建一个可以登录并设置密码的用户：
    ```sql
    CREATE ROLE myuser WITH LOGIN PASSWORD 'securepassword';
    ```
    创建一个具有创建数据库权限的角色：
    ```sql
    CREATE ROLE db_creator WITH CREATEDB LOGIN PASSWORD 'creatorpass';
    ```
    `CREATE USER` 是 `CREATE ROLE name WITH LOGIN;` 的别名。
    ```sql
    CREATE USER another_user PASSWORD 'anotherpass';
    ```

* **`createuser` 命令行工具：**
    这是一个 `CREATE ROLE` 命令的包装器。
    ```bash
    createuser --interactive --pwprompt mynewuser
    ```
    它会提示输入新用户的属性。

**2. 修改角色：**

使用 `ALTER ROLE` SQL 命令。

* **SQL 命令：**
    ```sql
    ALTER ROLE role_name [WITH option [...]]
    ALTER ROLE role_name RENAME TO new_name
    ALTER ROLE role_name SET configuration_parameter {TO | =} {value | DEFAULT}
    ```
    **示例：**
    修改密码：
    ```sql
    ALTER ROLE myuser WITH PASSWORD 'newsecurepassword';
    ```
    赋予创建数据库权限：
    ```sql
    ALTER ROLE myuser CREATEDB;
    ```
    重命名角色：
    ```sql
    ALTER ROLE myuser RENAME TO my_renamed_user;
    ```

**3. 删除角色：**

使用 `DROP ROLE` SQL 命令或 `dropuser` 命令行工具。

* **SQL 命令：**
    ```sql
    DROP ROLE [IF EXISTS] role_name [, ...];
    ```
    **注意**：如果角色拥有任何数据库对象（如表、数据库）或已被授予其他对象的权限，则无法直接删除。必须先删除或重新分配这些对象的所有权，并撤销其权限。
    ```sql
    REASSIGN OWNED BY old_role TO new_role; -- 重新分配对象所有权
    DROP OWNED BY old_role; -- 删除角色拥有的所有对象
    DROP ROLE old_role;
    ```

* **`dropuser` 命令行工具：**
    ```bash
    dropuser myolduser
    ```

**4. 授予权限 (Privileges)：**

使用 `GRANT` SQL 命令。权限可以授予数据库对象（表、序列、数据库、函数、模式等）或授予角色成员资格。

* **授予对象权限：**
    ```sql
    GRANT privilege [, ...] ON object_type object_name [, ...] TO role_specification [, ...] [WITH GRANT OPTION];
    ```
    `role_specification` 可以是角色名，`PUBLIC` (所有角色)，或 `CURRENT_USER`, `SESSION_USER`。
    `privilege` 可以是 `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`, `TRIGGER`, `CREATE`, `CONNECT`, `TEMPORARY`, `EXECUTE`, `USAGE` 等，具体取决于对象类型。
    `WITH GRANT OPTION` 允许被授权者将这些权限再授予其他角色。

    **示例：**
    授予 `myuser` 对表 `employees` 的 `SELECT` 和 `INSERT` 权限：
    ```sql
    GRANT SELECT, INSERT ON TABLE employees TO myuser;
    ```
    授予所有用户对模式 `public` 的 `USAGE` 权限（通常默认已授予）：
    ```sql
    GRANT USAGE ON SCHEMA public TO PUBLIC;
    ```
    授予 `analyst_role` 对表 `sales_data` 的 `SELECT` 权限，并允许其将此权限授予他人：
    ```sql
    GRANT SELECT ON TABLE sales_data TO analyst_role WITH GRANT OPTION;
    ```

* **授予角色成员资格 (将一个角色添加到另一个角色，使其成为一个"组"的成员)：**
    ```sql
    GRANT group_role [, ...] TO member_role [, ...] [WITH ADMIN OPTION];
    ```
    `WITH ADMIN OPTION` 允许 `member_role` 将 `group_role` 的成员资格授予或撤销给其他角色。

    **示例：**
    将 `myuser` 添加到 `data_readers` 角色组：
    ```sql
    GRANT data_readers TO myuser;
    ```

**5. 撤销权限：**

使用 `REVOKE` SQL 命令。

* **撤销对象权限：**
    ```sql
    REVOKE [GRANT OPTION FOR] privilege [, ...] ON object_type object_name [, ...] FROM role_specification [, ...] [CASCADE | RESTRICT];
    ```
    `GRANT OPTION FOR` 只撤销授权选项，而不撤销权限本身。
    `CASCADE` 会级联撤销依赖于此权限的权限。`RESTRICT` (默认) 如果存在依赖权限则拒绝撤销。

    **示例：**
    从 `myuser` 撤销对表 `employees` 的 `INSERT` 权限：
    ```sql
    REVOKE INSERT ON TABLE employees FROM myuser;
    ```

* **撤销角色成员资格：**
    ```sql
    REVOKE [ADMIN OPTION FOR] group_role [, ...] FROM member_role [, ...] [CASCADE | RESTRICT];
    ```

    **示例：**
    从 `data_readers` 角色组中移除 `myuser`：
    ```sql
    REVOKE data_readers FROM myuser;
    ```

**列出角色和权限：**

* 在 `psql` 中：
    * `\du`: 列出所有角色及其属性。
    * `\dp table_name` 或 `\z table_name`: 列出指定表的权限。

* 查询系统目录：
    * `SELECT rolname FROM pg_roles;` (列出角色)
    * `information_schema.table_privileges`, `information_schema.role_table_grants` 等视图。

PostgreSQL 的角色和权限系统非常灵活且强大，能够满足各种复杂的安全需求。

### 数据库操作

在 PostgreSQL 中，数据库操作主要包括创建新数据库、删除现有数据库以及列出集群中的数据库。

**1. 创建数据库 (CREATE DATABASE)：**

使用 `CREATE DATABASE` SQL 命令或 `createdb` 命令行工具。

* **SQL 命令：**
    ```sql
    CREATE DATABASE database_name
        [WITH [OWNER [=] user_name]
              [TEMPLATE [=] template]
              [ENCODING [=] encoding]
              [LOCALE [=] locale | LC_COLLATE [=] lc_collate] [LC_CTYPE [=] lc_ctype]
              [TABLESPACE [=] tablespace_name]
              [ALLOW_CONNECTIONS [=] allowconn]
              [CONNECTION LIMIT [=] connlimit]
              [IS_TEMPLATE [=] istemplate]];
    ```
    **常用选项：**
    * `database_name`: 要创建的数据库的名称。
    * `OWNER user_name`: 指定数据库的所有者。默认为执行命令的用户。
    * `TEMPLATE template_name`: 指定用于创建新数据库的模板数据库。默认是 `template1`。可以使用 `template0` 创建一个“纯净”的数据库，不包含 `template1` 中可能存在的本地修改。
    * `ENCODING encoding`: 指定数据库的字符集编码，如 `'UTF8'`, `'SQL_ASCII'`。
    * `LOCALE locale` 或 `LC_COLLATE lc_collate` 和 `LC_CTYPE lc_ctype`: 指定数据库的区域设置，影响排序规则和字符分类。
    * `TABLESPACE tablespace_name`: 指定数据库的默认表空间。
    * `CONNECTION LIMIT connlimit`: 限制可以连接到此数据库的并发连接数 (-1 为无限制)。

    **示例：**
    创建一个名为 `mydatabase` 的新数据库，所有者为 `myuser`，使用 UTF-8 编码：
    ```sql
    CREATE DATABASE mydatabase
        OWNER myuser
        ENCODING 'UTF8'
        LOCALE 'en_US.UTF-8'; -- 区域设置示例，具体值取决于操作系统
    ```
    **注意**：`CREATE DATABASE` 不能在事务块内部执行。执行此命令的用户通常需要 `SUPERUSER` 或 `CREATEDB` 权限。

* **`createdb` 命令行工具：**
    这是一个 `CREATE DATABASE` SQL 命令的包装器。
    ```bash
    createdb -U username -O owner_username -E UTF8 -l en_US.UTF-8 new_database_name
    ```
    例如：
    ```bash
    createdb -U postgres -O app_user -E UTF8 my_app_db
    ```

**2. 删除数据库 (DROP DATABASE)：**

使用 `DROP DATABASE` SQL 命令或 `dropdb` 命令行工具。

* **SQL 命令：**
    ```sql
    DROP DATABASE [IF EXISTS] database_name [WITH (FORCE)];
    ```
    **选项：**
    * `IF EXISTS`: 如果数据库不存在，则不会报错，而是发出一个通知。
    * `FORCE` (PostgreSQL 13+): 尝试终止与目标数据库的所有现有连接，以便可以删除数据库。如果存在预备事务、活动的逻辑复制槽或订阅，则此选项不会终止连接。

    **示例：**
    删除名为 `mydatabase` 的数据库：
    ```sql
    DROP DATABASE mydatabase;
    ```
    如果数据库可能不存在，则安全地删除：
    ```sql
    DROP DATABASE IF EXISTS mydatabase;
    ```
    **注意**：
    * `DROP DATABASE` 会永久删除数据库及其所有内容，此操作不可逆。
    * 执行此命令的用户必须是数据库所有者或超级用户。
    * 不能在连接到目标数据库时执行 `DROP DATABASE`。您需要连接到另一个数据库（如 `postgres` 或 `template1`）来执行此操作。
    * `DROP DATABASE` 不能在事务块内部执行。

* **`dropdb` 命令行工具：**
    这是一个 `DROP DATABASE` SQL 命令的包装器。
    ```bash
    dropdb -U username database_name
    ```
    例如：
    ```bash
    dropdb -U postgres my_app_db
    ```

**3. 列出数据库：**

* **`psql` 元命令：**
    在 `psql` 命令行工具中，使用 `\l` 或 `\list` 命令：
    ```sql
    \l
    ```
    这将显示所有数据库的列表，包括其名称、所有者、编码、排序规则、字符类型和访问权限。

* **SQL 查询系统目录：**
    可以查询 `pg_database` 系统目录：
    ```sql
    SELECT datname, pg_get_userbyid(datdba) AS owner, pg_encoding_to_char(encoding) AS encoding, datcollate, datctype
    FROM pg_database;
    ```
    只列出非模板数据库的名称：
    ```sql
    SELECT datname FROM pg_database WHERE datistemplate = false;
    ```

这些是 PostgreSQL 中管理数据库的基本操作。在进行删除操作时务必小心，因为它会导致数据丢失。

### schema

在 PostgreSQL 中，**Schema**（模式）是一个命名空间，它包含一组命名的数据库对象，如表、视图、索引、数据类型、函数、操作符等。Schema 允许将数据库对象组织成逻辑组，以便于管理和避免命名冲突。

**Schema 的主要作用和特点：**

1.  **组织性**：可以将相关的对象组织在同一个 Schema 下，使得数据库结构更清晰。例如，可以将所有与销售相关的表和视图放在 `sales` Schema 下，与人力资源相关的放在 `hr` Schema 下。
2.  **命名空间**：不同的 Schema 可以包含同名的对象。例如，`sales.customers` 和 `marketing.customers` 可以是两个不同的表。访问特定 Schema 中的对象时，需要使用 `schema_name.object_name` 的形式进行限定。
3.  **权限管理**：可以为 Schema 设置权限，从而控制用户对 Schema 内对象的访问。例如，可以授予某个用户对 `sales` Schema 的 `USAGE` (访问) 权限和 `CREATE` (创建对象) 权限。
4.  **多用户环境**：在多用户共享同一个数据库的环境中，每个用户或用户组可以拥有自己的 Schema，从而避免相互干扰。
5.  **第三方应用**：许多第三方应用或扩展在安装时会创建自己的 Schema，以将其对象与数据库中的其他对象隔离开。

**默认 Schema (`public`)**

* 每个新创建的数据库都会自动包含一个名为 `public` 的 Schema。
* 如果在创建对象（如表）时没有显式指定 Schema，并且当前用户对 `public` Schema 有 `CREATE` 权限，则该对象默认会创建在 `public` Schema 中。
* 默认情况下，所有用户都对 `public` Schema 具有 `USAGE` 和 `CREATE` 权限，但这通常会在生产环境中进行调整以增强安全性。

**搜索路径 (`search_path`)**

* 当引用一个对象而没有指定 Schema 时（例如，`SELECT * FROM my_table;` 而不是 `SELECT * FROM my_schema.my_table;`），PostgreSQL 会根据 `search_path` 配置参数来查找该对象。
* `search_path` 是一个按顺序排列的 Schema 名称列表。PostgreSQL 会依次在这些 Schema 中查找对象，直到找到第一个匹配的对象。
* 默认的 `search_path` 通常是 `"$user", public`。这意味着 PostgreSQL 会首先在与当前用户名同名的 Schema 中查找，如果找不到，则在 `public` Schema 中查找。
* 查看当前的搜索路径：
    ```sql
    SHOW search_path;
    ```
* 修改当前会话的搜索路径：
    ```sql
    SET search_path TO schema1, schema2, public;
    ```
* 为特定用户或数据库永久设置搜索路径：
    ```sql
    ALTER ROLE username SET search_path = schema1, public;
    ALTER DATABASE dbname SET search_path = schema1, public;
    ```

**Schema 操作：**

1.  **创建 Schema：**
    ```sql
    CREATE SCHEMA schema_name [AUTHORIZATION user_name];
    ```
    如果不指定 `AUTHORIZATION`，则 Schema 的所有者是执行该命令的用户。
    ```sql
    CREATE SCHEMA IF NOT EXISTS myschema;
    CREATE SCHEMA myschema AUTHORIZATION myuser;
    ```

2.  **修改 Schema：**
    主要是重命名或更改所有者。
    ```sql
    ALTER SCHEMA old_schema_name RENAME TO new_schema_name;
    ALTER SCHEMA schema_name OWNER TO new_owner_name;
    ```

3.  **删除 Schema：**
    ```sql
    DROP SCHEMA [IF EXISTS] schema_name [CASCADE | RESTRICT];
    ```
    * `CASCADE`：同时删除 Schema 中包含的所有对象。
    * `RESTRICT` (默认)：如果 Schema 中包含任何对象，则拒绝删除。
    ```sql
    DROP SCHEMA myschema CASCADE;
    ```

**应用场景示例：**

* **多租户应用**：为每个租户创建一个独立的 Schema，以隔离其数据。
* **模块化开发**：将应用的不同模块（如用户管理、产品管理、订单管理）分别放在不同的 Schema 中。
* **版本控制**：在测试不同版本的数据库结构时，可以使用不同的 Schema。例如 `v1_tables`, `v2_tables`。
* **外部数据集成**：当使用外部数据包装器 (FDW) 连接到外部数据源时，通常会为外部表创建一个专门的 Schema。

通过有效地使用 Schema，可以显著提高 PostgreSQL 数据库的可管理性、安全性和组织性。

---

## 表与数据操作

### 常用表操作

表是 PostgreSQL (以及任何关系数据库) 中存储数据的基本结构。以下是常用的表操作命令：

**1. 创建表 (CREATE TABLE)：**

`CREATE TABLE` 命令用于定义一个新表。你需要指定表名、列名、每列的数据类型以及可选的约束。

* **基本语法：**
    ```sql
    CREATE TABLE [IF NOT EXISTS] table_name (
        column1_name data_type [column_constraint [ ... ]],
        column2_name data_type [column_constraint [ ... ]],
        ...
        [table_constraint [ ... ]]
    ) [WITH (storage_parameter = value, ...)];
    ```

* **常用数据类型：**
    * `INTEGER` (或 `INT`): 整数。
    * `SMALLINT`: 小范围整数。
    * `BIGINT`: 大范围整数。
    * `SERIAL`, `BIGSERIAL`: 自增整数（通常用作主键）。
    * `NUMERIC(precision, scale)` 或 `DECIMAL(precision, scale)`: 精确的十进制数。
    * `REAL` 或 `FLOAT4`: 单精度浮点数。
    * `DOUBLE PRECISION` 或 `FLOAT8`: 双精度浮点数。
    * `VARCHAR(n)`: 可变长度字符串，最大长度为 n。
    * `CHAR(n)`: 固定长度字符串。
    * `TEXT`: 无长度限制的可变长度字符串。
    * `BOOLEAN`: 布尔值 (`TRUE`, `FALSE`, `NULL`)。
    * `DATE`: 日期 (年、月、日)。
    * `TIME [WITH TIME ZONE]`: 时间 (时、分、秒)。
    * `TIMESTAMP [WITH TIME ZONE]`: 日期和时间。
    * `INTERVAL`: 时间间隔。
    * `BYTEA`: 二进制数据。
    * `UUID`: 通用唯一标识符。
    * `JSON`, `JSONB`: JSON 数据。
    * `ARRAY` 类型 (例如 `INTEGER[]`, `TEXT[]`)。

* **常用约束 (Constraints)：**
    * `NOT NULL`: 列值不能为空。
    * `UNIQUE`: 列（或列组）中的值必须唯一。
    * `PRIMARY KEY`: 唯一标识表中的每一行，隐含 `NOT NULL` 和 `UNIQUE`。一个表只能有一个主键。
    * `FOREIGN KEY (column_name [, ...]) REFERENCES referenced_table (referenced_column [, ...]) [ON DELETE action] [ON UPDATE action]`: 确保列中的值存在于另一个表的指定列中，用于维护引用完整性。
        * `ON DELETE action`: `NO ACTION` (默认), `RESTRICT`, `CASCADE`, `SET NULL`, `SET DEFAULT`.
        * `ON UPDATE action`: 类似选项。
    * `CHECK (condition)`: 确保列中的值满足特定条件。
    * `DEFAULT default_expr`: 为列指定默认值。
    * `GENERATED { ALWAYS | BY DEFAULT } AS IDENTITY [( sequence_options )]`: SQL 标准的自增列 (PostgreSQL 10+)。

* **示例：**
    ```sql
    CREATE TABLE employees (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE,
        hire_date DATE DEFAULT CURRENT_DATE,
        department_id INTEGER,
        salary NUMERIC(10, 2) CHECK (salary > 0),
        CONSTRAINT fk_department
            FOREIGN KEY (department_id)
            REFERENCES departments (id)
            ON DELETE SET NULL
    );

    CREATE TABLE departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );
    ```

**2. 修改表 (ALTER TABLE)：**

`ALTER TABLE` 命令用于修改现有表的结构。

* **基本语法：**
    ```sql
    ALTER TABLE table_name action;
    ```

* **常用 `action`：**
    * **添加列：**
        ```sql
        ALTER TABLE table_name ADD COLUMN column_name data_type [column_constraint];
        -- 例: ALTER TABLE employees ADD COLUMN phone_number VARCHAR(20);
        ```
    * **删除列：**
        ```sql
        ALTER TABLE table_name DROP COLUMN [IF EXISTS] column_name [CASCADE | RESTRICT];
        -- 例: ALTER TABLE employees DROP COLUMN phone_number;
        ```
    * **修改列的数据类型：**
        ```sql
        ALTER TABLE table_name ALTER COLUMN column_name TYPE new_data_type [USING expression];
        -- 例: ALTER TABLE employees ALTER COLUMN salary TYPE NUMERIC(12, 2);
        -- 如果类型转换不直接兼容，可能需要 USING 子句
        -- ALTER TABLE my_table ALTER COLUMN old_col TYPE INTEGER USING old_col::integer;
        ```
    * **添加/删除列的默认值：**
        ```sql
        ALTER TABLE table_name ALTER COLUMN column_name SET DEFAULT value;
        ALTER TABLE table_name ALTER COLUMN column_name DROP DEFAULT;
        -- 例: ALTER TABLE employees ALTER COLUMN hire_date SET DEFAULT '2020-01-01';
        ```
    * **添加/删除 `NOT NULL` 约束：**
        ```sql
        ALTER TABLE table_name ALTER COLUMN column_name SET NOT NULL;
        ALTER TABLE table_name ALTER COLUMN column_name DROP NOT NULL;
        ```
    * **添加约束 (UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK)：**
        ```sql
        ALTER TABLE table_name ADD CONSTRAINT constraint_name constraint_definition;
        -- 例: ALTER TABLE employees ADD CONSTRAINT uq_employee_email UNIQUE (email);
        -- 例: ALTER TABLE employees ADD CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employees(id);
        ```
    * **删除约束：**
        ```sql
        ALTER TABLE table_name DROP CONSTRAINT [IF EXISTS] constraint_name [CASCADE | RESTRICT];
        -- 例: ALTER TABLE employees DROP CONSTRAINT uq_employee_email;
        ```
    * **重命名列：**
        ```sql
        ALTER TABLE table_name RENAME COLUMN old_column_name TO new_column_name;
        -- 例: ALTER TABLE employees RENAME COLUMN hire_date TO employment_start_date;
        ```
    * **重命名表：**
        ```sql
        ALTER TABLE old_table_name RENAME TO new_table_name;
        -- 例: ALTER TABLE employees RENAME TO staff_members;
        ```
    * **修改表所有者：**
        ```sql
        ALTER TABLE table_name OWNER TO new_owner;
        ```
    * **修改表所属模式：**
        ```sql
        ALTER TABLE table_name SET SCHEMA new_schema_name;
        ```

**3. 删除表 (DROP TABLE)：**

`DROP TABLE` 命令用于从数据库中永久删除一个或多个表及其所有数据和索引。

* **基本语法：**
    ```sql
    DROP TABLE [IF EXISTS] table_name [, ...] [CASCADE | RESTRICT];
    ```
* **选项：**
    * `IF EXISTS`: 如果表不存在，则不会报错。
    * `CASCADE`: 自动删除依赖于该表的对象（如视图、外键约束）。
    * `RESTRICT` (默认): 如果有任何对象依赖于该表，则拒绝删除。

* **示例：**
    ```sql
    DROP TABLE employees;
    DROP TABLE IF EXISTS old_table1, old_table2 CASCADE;
    ```
    **警告**：`DROP TABLE` 是一个破坏性操作，一旦执行，表中的数据将无法恢复（除非有备份）。请谨慎使用。

**4. 截断表 (TRUNCATE TABLE)：**

`TRUNCATE TABLE` 命令用于快速删除表中的所有行，但保留表结构（列、约束、索引等）。它通常比 `DELETE FROM table_name;` 更快，因为它不扫描表，也不记录单独的行删除。

* **基本语法：**
    ```sql
    TRUNCATE [TABLE] table_name [, ...] [RESTART IDENTITY | CONTINUE IDENTITY] [CASCADE | RESTRICT];
    ```
* **选项：**
    * `RESTART IDENTITY`: 自动重置由表的标识列（如 `SERIAL` 或 `IDENTITY` 列）生成的序列。
    * `CONTINUE IDENTITY` (默认): 不改变序列的当前值。
    * `CASCADE`: 自动截断所有通过外键引用了指定表的表。
    * `RESTRICT` (默认): 如果有其他表通过外键引用了该表，则拒绝截断 (除非这些表也在同一个 `TRUNCATE` 命令中被指定)。

* **示例：**
    ```sql
    TRUNCATE TABLE logs RESTART IDENTITY; -- 删除所有日志并重置ID序列
    TRUNCATE TABLE staging_area1, staging_area2;
    ```
    **注意**：`TRUNCATE` 也是一个破坏性操作，会删除所有数据。它不能在事务中轻易回滚（除非事务本身被回滚）。它需要对表有 `TRUNCATE` 权限。

这些是 PostgreSQL 中对表进行操作的核心命令。理解它们的用法和影响对于数据库管理和开发至关重要。

### 增删改查（CRUD）

CRUD 是指数据库操作中的四个基本功能：创建 (Create)、读取 (Read)、更新 (Update) 和删除 (Delete)。在 SQL 中，这些操作分别对应 `INSERT`, `SELECT`, `UPDATE`, `DELETE` 命令。

**1. 创建 (Create) - 插入数据 (INSERT)：**

`INSERT INTO` 命令用于向表中添加新行。

* **基本语法：**
    ```sql
    INSERT INTO table_name (column1, column2, ...)
    VALUES (value1, value2, ...);
    ```
    如果为所有列按其在表定义中的顺序提供值，则可以省略列列表：
    ```sql
    INSERT INTO table_name VALUES (value_for_col1, value_for_col2, ...);
    ```

* **插入多行：**
    ```sql
    INSERT INTO table_name (column1, column2, ...)
    VALUES
        (row1_value1, row1_value2, ...),
        (row2_value1, row2_value2, ...),
        ...;
    ```

* **使用默认值：**
    可以使用 `DEFAULT` 关键字来插入列的默认值。
    ```sql
    INSERT INTO employees (first_name, last_name, hire_date)
    VALUES ('John', 'Doe', DEFAULT); -- 假设 hire_date 有默认值
    ```
    或者完全不指定该列，如果它有默认值或允许 `NULL`。

* **从查询结果插入数据：**
    ```sql
    INSERT INTO table_name (column1, column2, ...)
    SELECT query_column1, query_column2, ...
    FROM another_table
    WHERE condition;
    ```

* **返回插入的行 (`RETURNING`)：**
    可以在 `INSERT` 语句后附加 `RETURNING` 子句，以返回插入的行的某些或所有列的值。
    ```sql
    INSERT INTO employees (first_name, last_name)
    VALUES ('Jane', 'Smith')
    RETURNING id, email; -- 假设 id 是 SERIAL，email 可能由触发器生成
    ```

* **处理冲突 (UPSERT - INSERT ... ON CONFLICT)：**
    PostgreSQL 9.5+ 支持 "UPSERT" 操作，即如果插入会导致唯一约束或排除约束冲突，则执行替代操作（如更新或什么都不做）。
    ```sql
    INSERT INTO distributors (did, dname)
    VALUES (5, 'Gizmo Transglobal'), (6, 'Associated Computing, Inc')
    ON CONFLICT (did) DO UPDATE SET dname = EXCLUDED.dname;

    INSERT INTO distributors (did, dname)
    VALUES (7, 'Redundant Devices')
    ON CONFLICT (did) DO NOTHING;
    ```
    `EXCLUDED` 伪表包含了试图插入但导致冲突的行的值。

**2. 读取 (Read) - 查询数据 (SELECT)：**

`SELECT` 命令用于从一个或多个表中检索数据。

* **基本语法：**
    ```sql
    SELECT column1, column2, ...
    FROM table_name
    [WHERE condition]
    [GROUP BY column_list]
    [HAVING condition]
    [ORDER BY column_list [ASC | DESC] [NULLS FIRST | NULLS LAST]]
    [LIMIT count]
    [OFFSET start_row];
    ```

* **选择所有列：**
    使用星号 `*`。
    ```sql
    SELECT * FROM employees;
    ```

* **条件查询 (`WHERE`)：**
    使用 `WHERE` 子句过滤行。
    ```sql
    SELECT first_name, last_name, salary
    FROM employees
    WHERE salary > 50000 AND department_id = 3;
    ```
    常用的比较运算符： `=`, `!=` (或 `<>`), `<`, `<=`, `>`, `>=`。
    逻辑运算符： `AND`, `OR`, `NOT`。
    其他： `BETWEEN`, `IN`, `LIKE` (用于模式匹配，`%` 匹配任意字符序列，`_` 匹配任意单个字符), `ILIKE` (不区分大小写的 `LIKE`), `IS NULL`, `IS NOT NULL`。

* **排序结果 (`ORDER BY`)：**
    ```sql
    SELECT first_name, last_name, hire_date
    FROM employees
    ORDER BY hire_date DESC, last_name ASC; -- 按入职日期降序，同日期的按姓氏升序
    ```

* **限制结果数量 (`LIMIT` 和 `OFFSET`)：**
    `LIMIT` 指定返回的最大行数，`OFFSET` 指定开始返回行之前跳过的行数（用于分页）。
    ```sql
    SELECT product_name, price
    FROM products
    ORDER BY price DESC
    LIMIT 10 OFFSET 20; -- 返回价格最高的第 21 到 30 个产品
    ```
    `Workspace FIRST n ROWS ONLY` 是 `LIMIT n` 的 SQL 标准等效。

* **聚合函数和分组 (`GROUP BY`, `HAVING`)：**
    常用的聚合函数：`COUNT()`, `SUM()`, `AVG()`, `MAX()`, `MIN()`.
    `GROUP BY` 子句用于将具有相同值的行组合成摘要行。
    `HAVING` 子句用于在分组后过滤结果。
    ```sql
    SELECT department_id, COUNT(*) AS num_employees, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
    HAVING COUNT(*) > 5
    ORDER BY avg_salary DESC;
    ```

* **连接表 (JOINs)：**
    用于根据相关列之间的关系组合来自两个或多个表的行。
    * `INNER JOIN` (或 `JOIN`): 返回两个表中匹配的行。
    * `LEFT JOIN` (或 `LEFT OUTER JOIN`): 返回左表的所有行，以及右表中匹配的行（不匹配则为 NULL）。
    * `RIGHT JOIN` (或 `RIGHT OUTER JOIN`): 返回右表的所有行，以及左表中匹配的行。
    * `FULL JOIN` (或 `FULL OUTER JOIN`): 返回左表或右表中存在的所有行。
    * `CROSS JOIN`: 返回两个表的笛卡尔积。
    * `NATURAL JOIN`: 自动基于同名列进行连接。

    ```sql
    SELECT e.first_name, e.last_name, d.name AS department_name
    FROM employees e
    JOIN departments d ON e.department_id = d.id;
    ```

* **子查询 (Subqueries)：**
    嵌套在其他 SQL 查询中的查询。
    ```sql
    SELECT first_name, last_name
    FROM employees
    WHERE salary > (SELECT AVG(salary) FROM employees);
    ```

**3. 更新 (Update) - 修改数据 (UPDATE)：**

`UPDATE` 命令用于修改表中已存在的行。

* **基本语法：**
    ```sql
    UPDATE table_name
    SET column1 = value1,
        column2 = value2,
        ...
    [FROM from_list]
    WHERE condition
    [RETURNING expression [AS output_name] [, ...]];
    ```

* **示例：**
    给 `employee_id` 为 101 的员工加薪 10%：
    ```sql
    UPDATE employees
    SET salary = salary * 1.10
    WHERE id = 101;
    ```
    根据另一个表的值更新：
    ```sql
    UPDATE employees
    SET department_name = departments.name
    FROM departments
    WHERE employees.department_id = departments.id AND employees.department_name IS NULL;
    ```
    更新所有行（**小心！**）：
    ```sql
    UPDATE products
    SET stock_level = 0; -- 如果没有 WHERE 子句，会更新所有行
    ```

* **返回更新的行 (`RETURNING`)：**
    ```sql
    UPDATE employees
    SET salary = salary + 5000
    WHERE department_id = 2
    RETURNING id, first_name, salary AS new_salary;
    ```

**4. 删除 (Delete) - 移除数据 (DELETE)：**

`DELETE FROM` 命令用于从表中删除行。

* **基本语法：**
    ```sql
    DELETE FROM table_name
    [USING using_list]
    WHERE condition
    [RETURNING expression [AS output_name] [, ...]];
    ```

* **示例：**
    删除薪水低于 30000 的员工：
    ```sql
    DELETE FROM employees
    WHERE salary < 30000;
    ```
    根据另一个表的值删除：
    ```sql
    DELETE FROM employees
    USING inactive_departments
    WHERE employees.department_id = inactive_departments.id;
    ```
    删除表中的所有行（**小心！**）：
    ```sql
    DELETE FROM logs; -- 如果没有 WHERE 子句，会删除所有行，但比 TRUNCATE 慢
    ```
    `TRUNCATE TABLE table_name;` 通常是删除所有行更快的选择。

* **返回删除的行 (`RETURNING`)：**
    ```sql
    DELETE FROM orders
    WHERE order_date < '2020-01-01'
    RETURNING *; -- 返回所有被删除的订单
    ```

掌握这些 CRUD 操作是进行任何数据库工作的基本前提。始终注意 `UPDATE` 和 `DELETE` 命令中的 `WHERE` 子句，以避免意外修改或删除数据。在生产环境中执行这些操作前，最好先在事务中测试或备份数据。

### 索引与优化

索引是 PostgreSQL (以及其他关系数据库) 中用于提高数据检索速度的关键特性。它们通过提供指向表中数据行的快速访问路径来工作，类似于书的索引。查询优化则是一个更广泛的主题，涉及编写高效的 SQL 查询、合理设计数据库结构以及调整数据库服务器配置。

**索引 (Indexes)**

**1. 索引如何工作：**

* 当对表中的列创建索引时，PostgreSQL 会创建一个数据结构（例如 B-树），其中包含索引列的值以及指向表中实际数据行的指针。
* 当查询的 `WHERE` 子句或 `JOIN` 条件涉及到索引列时，查询优化器可以决定使用索引来快速定位匹配的行，而不是扫描整个表（全表扫描）。
* 索引可以显著加快 `SELECT` 查询的速度，并且对于 `UPDATE` 和 `DELETE` 操作中快速定位要修改或删除的行也很有用。
* 然而，索引也会带来开销：它们会占用磁盘空间，并且在插入、更新或删除数据时需要维护，这可能会稍微降低写操作的性能。因此，需要权衡利弊，只在必要时创建索引。

**2. 常见的索引类型：**

PostgreSQL 支持多种索引类型，以适应不同的查询模式：

* **B-Tree (默认类型)**：
    * 用途：最常用的索引类型，适用于处理等于 (`=`)、范围 (`<`, `<=`, `>`, `>=`)、`BETWEEN`、`IN`、`IS NULL`、`IS NOT NULL` 以及 `LIKE`（非前缀通配符）等比较操作。
    * 排序：B-树索引中的数据是有序存储的，这使得它们对于 `ORDER BY` 子句和 `MIN()`/`MAX()` 聚合函数也很有用。
    * 创建：`CREATE INDEX idx_name ON table_name (column_name);` (默认使用 B-Tree)

* **Hash**：
    * 用途：仅支持简单的等值比较 (`=`)。
    * 特点：对于大数据集上的等值查询，Hash 索引的查找速度可能比 B-Tree 更快。但是，Hash 索引不是事务安全的（在 PostgreSQL 10 之前），并且不能保证排序，也不能用于范围查询。
    * 创建：`CREATE INDEX idx_name ON table_name USING HASH (column_name);`

* **GiST (Generalized Search Tree)**：
    * 用途：一种通用的索引结构，可以实现多种不同的索引策略。常用于索引几何数据类型 (PostGIS)、全文搜索类型 (`tsvector`) 以及其他复杂数据类型。
    * 特点：非常灵活，可以通过扩展支持新的数据类型和操作符。
    * 创建：`CREATE INDEX idx_name ON table_name USING GIST (column_name);` (例如，用于 PostGIS 的 `geometry` 列)

* **GIN (Generalized Inverted Index)**：
    * 用途：专为索引包含多个“键”的复合值而设计，例如数组、JSONB 文档 (`jsonb_path_ops`)、全文搜索类型 (`tsvector`)。
    * 特点：当一个索引项可以指向多个行时（例如，一个词出现在多个文档中，或者一个元素存在于多个数组中），GIN 索引非常高效。
    * 创建：`CREATE INDEX idx_name ON table_name USING GIN (column_name);` (例如，用于 `jsonb` 列的 `jsonb_path_ops` 或 `tsvector` 列)

* **SP-GiST (Space-Partitioned GiST)**：
    * 用途：支持空间分区的数据结构，如四叉树、k-d树、基数树等。适用于某些类型的非平衡数据结构。
    * 创建：`CREATE INDEX idx_name ON table_name USING SPGIST (column_name);`

* **BRIN (Block Range Index)**：
    * 用途：存储数据块范围内某些列的摘要信息（例如最小值、最大值）。适用于那些与物理存储顺序高度相关的非常大的表（例如，按时间戳插入的数据）。
    * 特点：索引非常小，维护开销低，但只在数据具有某种自然排序或聚集时才有效。
    * 创建：`CREATE INDEX idx_name ON table_name USING BRIN (column_name);`

**3. 创建索引 (CREATE INDEX)：**

* **基本语法：**
    ```sql
    CREATE [UNIQUE] INDEX [CONCURRENTLY] [IF NOT EXISTS] index_name
    ON table_name [USING method]
    (
        { column_name | ( expression ) } [COLLATE collation] [opclass [ ( opclass_options ) ] ] [ASC | DESC] [NULLS {FIRST | LAST}]
        [, ...]
    )
    [INCLUDE ( column_name [, ...] )]
    [WITH ( storage_parameter [= value] [, ... ] )]
    [TABLESPACE tablespace_name]
    [WHERE predicate];
    ```

* **常用选项：**
    * `UNIQUE`: 创建唯一索引，确保索引列（或列组）的值是唯一的。
    * `CONCURRENTLY`: 创建索引时不阻塞对表的写操作 (但通常更慢且资源消耗更多)。
    * `IF NOT EXISTS`: 如果同名索引已存在，则不报错。
    * `USING method`: 指定索引方法，如 `btree`, `hash`, `gist`, `gin`, `spgist`, `brin`。默认为 `btree`。
    * **表达式索引 (Expression Indexes)**：可以对基于一个或多个列表达式的函数或计算结果创建索引。
        ```sql
        CREATE INDEX idx_lower_email ON users ((LOWER(email))); -- 对小写email创建索引
        -- 查询: SELECT * FROM users WHERE LOWER(email) = 'test@example.com';
        ```
    * **部分索引 (Partial Indexes - `WHERE` 子句)**：只对表中满足特定条件的行创建索引。可以减小索引大小并提高性能。
        ```sql
        CREATE INDEX idx_orders_unshipped ON orders (order_date) WHERE status = 'pending';
        -- 查询: SELECT * FROM orders WHERE status = 'pending' AND order_date > '2023-01-01';
        ```
    * **多列索引 (Multi-column Indexes)**：在一个索引中包含多个列。列的顺序很重要。
        ```sql
        CREATE INDEX idx_name_location ON customers (last_name, first_name, city);
        -- 这个索引可以用于 WHERE last_name = 'X' AND first_name = 'Y' AND city = 'Z'
        -- 也可以用于 WHERE last_name = 'X' AND first_name = 'Y'
        -- 也可以用于 WHERE last_name = 'X'
        -- 但通常不能高效用于 WHERE first_name = 'Y'
        ```
    * `INCLUDE`: 在 B-Tree 索引中，允许指定一些非键列包含在索引的叶子节点中。这可以实现“仅索引扫描 (Index-Only Scans)”，从而避免访问表本身。
    * `ASC`/`DESC`, `NULLS FIRST`/`NULLS LAST`: 控制索引的排序顺序和 NULL 值的排序。

**4. 何时创建索引：**

* 经常在 `WHERE` 子句中用作查询条件的列。
* 用作 `JOIN` 条件的列 (外键列通常应该有索引)。
* 经常在 `ORDER BY` 子句中使用的列。
* 当 `MIN()` 或 `MAX()` 应用于某列时。
* 主键列会自动创建唯一 B-Tree 索引。

**查询优化 (Query Optimization)**

查询优化器是 PostgreSQL 的核心组件，它会尝试为每个 SQL 查询找到最有效的执行计划。

**1. `EXPLAIN` 和 `EXPLAIN ANALYZE`：**

这是理解和优化查询性能的最重要工具。

* `EXPLAIN query;`: 显示查询优化器为查询生成的**估计**执行计划，包括将使用的操作（如全表扫描、索引扫描、连接类型等）以及估计的成本、行数和宽度。
    ```sql
    EXPLAIN SELECT * FROM employees WHERE department_id = 5;
    ```
* `EXPLAIN ANALYZE query;`: **实际执行**查询，并显示真实的执行计划、实际的执行时间、行数以及其他统计信息（如缓冲区使用情况）。这对于比较估计成本与实际成本至关重要。
    ```sql
    EXPLAIN ANALYZE SELECT * FROM employees WHERE department_id = 5;
    ```
* **`EXPLAIN` 输出解读：**
    * **节点类型 (Node Type)**：如 `Seq Scan` (全表扫描), `Index Scan`, `Index Only Scan`, `Bitmap Heap Scan`, `Nested Loop Join`, `Hash Join`, `Merge Join`, `Sort`, `Aggregate` 等。
    * **Cost (成本)**：`cost=startup_cost..total_cost`。这是一个任意的单位，表示优化器对执行该操作的估计成本。`startup_cost` 是返回第一行之前的成本，`total_cost` 是返回所有行的成本。
    * **Rows (行数)**：优化器估计该节点将输出的行数。
    * **Width (宽度)**：优化器估计每行数据的平均字节数。
    * **(Actual time, rows, loops - `EXPLAIN ANALYZE` 特有)**：实际执行时间、实际返回行数、执行循环次数。
    * `Buffers`: 显示共享缓冲区 (`shared hit/read`)、本地缓冲区 (`local hit/read`) 和临时缓冲区 (`temp read/written`) 的使用情况。`hit` 表示数据在内存中找到，`read` 表示从磁盘读取。

**2. 常见的查询优化技巧：**

* **确保统计信息最新**：优化器依赖于关于表和列中数据分布的统计信息来做出明智的决策。`ANALYZE table_name;` 或 `VACUUM ANALYZE table_name;` 命令用于收集这些统计信息。自动清理 (Autovacuum) 进程通常会自动处理这个问题，但有时可能需要手动运行。
* **合理使用索引**：
    * 为 `WHERE` 子句、`JOIN` 条件和 `ORDER BY` 子句中的列创建合适的索引。
    * 避免对小表创建过多索引。
    * 考虑使用表达式索引、部分索引或多列索引。
    * 定期检查未使用的索引 (`SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;`) 并考虑删除它们。
* **编写高效的 SQL**：
    * **避免 `SELECT *`**：只选择你需要的列，这可以减少数据传输量，并可能允许使用仅索引扫描。
    * **谨慎使用函数和计算**：在 `WHERE` 子句中对列使用函数可能会阻止索引的使用，除非创建了相应的表达式索引。例如，`WHERE my_date_col + interval '1 day' > NOW()` 可能比 `WHERE my_date_col > NOW() - interval '1 day'` 效率低。
    * **使用 `EXISTS` 而不是 `COUNT(*)`**：如果只是检查是否存在某些行，`EXISTS` 通常比 `COUNT(*)` 更高效，因为它可以在找到第一行后停止。
        ```sql
        -- 低效
        IF (SELECT COUNT(*) FROM orders WHERE customer_id = 123) > 0 THEN ...
        -- 高效
        IF EXISTS (SELECT 1 FROM orders WHERE customer_id = 123) THEN ...
        ```
    * **`JOIN` vs. 子查询**：虽然优化器通常能很好地处理两者，但有时将子查询重写为 `JOIN` (反之亦然) 可能会产生更好的计划。
    * **使用 `UNION ALL` 而不是 `UNION`**：如果确定结果集中没有重复行，或者允许重复行，`UNION ALL` 比 `UNION` 更快，因为它跳过了去重步骤。
    * **分页优化**：对于非常大的表，基于 `OFFSET` 的分页 (如 `LIMIT 10 OFFSET 1000000`) 可能会变慢，因为它仍然需要扫描并跳过前面的大量行。可以考虑使用“键集分页” (Keyset Pagination) 或“seek method”。
* **数据库设计**：
    * **规范化**：适当的规范化可以减少数据冗余，提高数据一致性，但过度规范化有时会导致过多的连接。
    * **数据类型选择**：选择最合适、最小的数据类型可以节省空间并提高性能。
* **服务器配置 (`postgresql.conf`)**：
    * `shared_buffers`: PostgreSQL 用于缓存数据的内存量。通常设置为系统总内存的 15-25%。
    * `work_mem`: 用于排序、哈希连接等内部操作的内存量。设置过低会导致使用磁盘临时文件。
    * `maintenance_work_mem`: 用于维护操作（如 `VACUUM`, `CREATE INDEX`, `ALTER TABLE ADD FOREIGN KEY`）的内存量。
    * `effective_cache_size`: 优化器用来估计操作系统文件系统缓存中可用内存量的参数。
* **监控和调整**：
    * 定期使用 `pg_stat_statements` 扩展来识别执行频率高或总执行时间长的查询。
    * 监控慢查询日志。

优化是一个持续的过程，需要结合对数据、应用负载和 PostgreSQL 内部机制的理解。`EXPLAIN ANALYZE` 是你最重要的盟友。

---

### 事务管理

事务 (Transaction) 是一系列数据库操作的逻辑单元，这些操作要么全部成功执行，要么全部不执行（回滚）。PostgreSQL 提供了强大的事务支持，确保数据的完整性和一致性，遵循 ACID 原则。

**1. ACID 原则：**

PostgreSQL 的事务管理严格遵守 ACID 原则：

* **原子性 (Atomicity)**：事务被视为一个不可分割的最小工作单元。事务中的所有操作要么全部提交成功，要么在发生错误时全部回滚到事务开始前的状态。通过 `BEGIN`, `COMMIT`, 和 `ROLLBACK` 命令实现。
* **一致性 (Consistency)**：事务将数据库从一个有效状态转变到另一个有效状态。所有数据完整性约束（如主键、外键、检查约束、NOT NULL）必须在事务提交时得到满足。如果某个操作违反了约束，事务将回滚。
* **隔离性 (Isolation)**：并发执行的事务之间应该相互隔离，一个事务的中间状态不应该对其他事务可见，以防止数据不一致。PostgreSQL 通过多版本并发控制 (MVCC) 和不同的事务隔离级别来实现。
* **持久性 (Durability)**：一旦事务成功提交 (`COMMIT`)，其所做的更改将永久保存在数据库中，即使发生系统故障（如断电或服务器崩溃）。这通常通过预写日志 (Write-Ahead Logging, WAL) 来保证，即在数据实际写入数据文件之前，更改会先记录到日志中。

**2. 事务控制命令：**

* **`BEGIN` 或 `START TRANSACTION`**:
    显式开始一个新的事务块。
    ```sql
    BEGIN;
    -- 或者
    START TRANSACTION;
    ```
    在此命令之后的所有 SQL 语句都将在同一个事务中执行，直到遇到 `COMMIT` 或 `ROLLBACK`。

* **`COMMIT` 或 `END`**:
    成功结束当前事务，并将事务期间所做的所有更改永久保存到数据库中。
    ```sql
    COMMIT;
    -- 或者
    END; -- END 是 COMMIT 的同义词
    ```
    `COMMIT AND CHAIN` (PostgreSQL 14+): 提交当前事务并立即开始一个新的事务，具有与刚提交的事务相同的事务特性（如隔离级别）。

* **`ROLLBACK`**:
    中止当前事务，并撤销事务期间所做的所有更改，使数据库恢复到事务开始前的状态。
    ```sql
    ROLLBACK;
    ```
    `ROLLBACK AND CHAIN` (PostgreSQL 14+): 回滚当前事务并立即开始一个新的事务，具有与刚回滚的事务相同的事务特性。

* **`SAVEPOINT savepoint_name`**:
    在当前事务中创建一个“保存点”。保存点允许你回滚事务的一部分，而不是整个事务。
    ```sql
    BEGIN;
    INSERT INTO mytable (id, data) VALUES (1, 'first');
    SAVEPOINT my_savepoint;
    UPDATE mytable SET data = 'updated_first' WHERE id = 1;
    -- 假设这里出现问题或需要撤销部分操作
    ```

* **`ROLLBACK TO SAVEPOINT savepoint_name`**:
    将事务回滚到指定的保存点。在保存点之后所做的更改将被撤销，但在保存点之前所做的更改仍然是事务的一部分，可以稍后提交或回滚。
    ```sql
    -- 接上例
    ROLLBACK TO SAVEPOINT my_savepoint; -- 这会撤销 UPDATE 操作
    -- 此时 id=1 的行的 data 仍然是 'first'
    INSERT INTO mytable (id, data) VALUES (2, 'second after rollback to savepoint');
    COMMIT; -- 提交 id=1 (值为'first') 和 id=2 的插入
    ```
    如果 `ROLLBACK TO SAVEPOINT` 命令指定的保存点不存在，则会引发错误。执行 `ROLLBACK TO SAVEPOINT` 后，该保存点以及在其之后定义的所有保存点都将被销毁，但该保存点仍然有效，可以再次回滚到它。

* **`RELEASE SAVEPOINT savepoint_name`**:
    销毁先前在当前事务中定义的指定保存点。这会释放与保存点相关的一些资源。它不会撤销任何更改。

**3. 事务隔离级别 (Transaction Isolation Levels)：**

SQL 标准定义了四种事务隔离级别，PostgreSQL 全部支持，并对其中一些行为有特定实现：

* **`READ UNCOMMITTED` (读未提交)**：
    * 最低的隔离级别。一个事务可以看到其他事务尚未提交的更改（脏读）。
    * **在 PostgreSQL 中，`READ UNCOMMITTED` 的行为与 `READ COMMITTED` 完全相同。** PostgreSQL 不允许脏读。
    * `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;`

* **`READ COMMITTED` (读已提交)**：
    * **PostgreSQL 的默认隔离级别。**
    * 一个事务只能看到其他事务已经提交的更改。
    * 保证不会发生脏读。
    * 但是，在一个事务内部，如果多次执行相同的查询，可能会看到不同的结果（不可重复读），因为其他并发事务可能在两次查询之间提交了新的更改。
    * 幻读 (Phantom Reads) 也有可能发生：一个事务在两次执行相同的范围查询时，第二次查询可能会返回第一次查询中未出现的“幻影”行，因为其他事务在此期间插入了符合条件的新行并提交了。
    * `SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`

* **`REPEATABLE READ` (可重复读)**：
    * 保证在一个事务的生命周期内，多次读取相同数据的结果是一致的（不会发生不可重复读）。事务只能看到在它开始之前已经提交的数据。
    * 在 PostgreSQL 中，`REPEATABLE READ` 级别通过获取数据快照来实现。
    * 幻读仍然可能发生，但 PostgreSQL 的实现通常能防止大部分幻读场景。
    * **重要**：如果一个 `REPEATABLE READ` 事务试图修改一个已被并发事务（在该 `REPEATABLE READ` 事务启动后提交）修改的行，它将收到一个**序列化失败 (serialization failure)**错误，并被强制回滚。应用程序必须准备好捕获这种错误并重试事务。
    * `SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;`

* **`SERIALIZABLE` (可串行化)**：
    * 最高的隔离级别。保证并发事务的执行结果与按某种顺序逐个执行它们的结果完全相同。
    * 可以防止脏读、不可重复读和幻读。
    * PostgreSQL 通过一种称为“可串行化快照隔离 (Serializable Snapshot Isolation, SSI)”的技术来实现。
    * 与 `REPEATABLE READ` 类似，如果 PostgreSQL 检测到一组并发的 `SERIALIZABLE` 事务由于相互依赖而无法找到一个串行执行顺序来产生相同的结果，那么其中一个或多个事务将被强制回滚，并报告一个序列化失败错误。应用程序必须准备好重试这些事务。
    * 这是最强的隔离级别，但通常性能开销也最大。
    * `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;`

可以使用 `SET TRANSACTION` 命令在事务开始时设置隔离级别，或者使用 `SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL ...` 为整个会话设置默认隔离级别。

**隐式事务：**

如果在 `psql` 或大多数数据库连接库中，你没有显式使用 `BEGIN`，那么每条单独的 SQL 语句（如 `INSERT`, `UPDATE`, `DELETE`, `CREATE TABLE` 等，除了事务控制命令本身）都会被视为一个独立的事务，并在执行成功后自动提交（如果失败则自动回滚）。这称为“自动提交 (autocommit)”模式。

理解并正确使用事务对于维护数据一致性和构建可靠的应用程序至关重要。应根据应用的具体需求选择合适的隔离级别。

### JSON 支持

PostgreSQL 对 JSON (JavaScript Object Notation) 数据提供了强大的原生支持，使其能够有效地存储、索引和查询 JSON 文档。

**1. JSON 数据类型：**

PostgreSQL 提供了两种用于存储 JSON 数据的原生类型：

* **`json`**:
    * 存储输入文本的**精确副本**。这意味着它会保留原始 JSON 文本中的所有空格、键的顺序以及重复的键。
    * 处理函数必须在每次执行时重新解析整个 JSON 文本。
    * 因此，对于大多数操作来说，`json` 类型通常比 `jsonb` 慢。
    * 主要优点是保留了原始格式，如果这一点很重要的话。

* **`jsonb` (JSON Binary)**:
    * 存储 JSON 数据的**分解的二进制格式**。这种格式在输入时会进行转换，比 `json` 类型略慢，但在处理时通常快得多，因为它不需要重新解析。
    * `jsonb` 不会保留不重要的空格、键的原始顺序，并且如果存在重复的键，只会保留最后一个键/值对。
    * **`jsonb` 支持索引**，这对于查询性能至关重要。GIN (Generalized Inverted Index) 索引是 `jsonb` 常用的索引类型。
    * **通常推荐使用 `jsonb` 类型**，除非有特殊理由需要保留 JSON 文本的精确原始格式。

**示例：**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    attributes JSONB
);

INSERT INTO products (name, attributes) VALUES
('Laptop', '{"brand": "AwesomeBrand", "ram_gb": 16, "tags": ["electronics", "computer"], "specs": {"cpu": "i7", "disk": "512GB SSD"}}'),
('Mouse', '{"brand": "ClickFast", "color": "black", "tags": ["electronics", "peripheral"], "wireless": true}');
```

**2. JSON 操作符：**

PostgreSQL 为 `json` 和 `jsonb` 提供了丰富的操作符来提取和操作数据。以下是一些常用的 `jsonb` 操作符 (许多也适用于 `json`，但 `jsonb` 通常更高效且支持更多索引)：

* **`->`**: 获取 JSON 对象字段的值（作为 `jsonb` 类型）。
    * `jsonb_object -> 'field_name'`
    * `jsonb_array -> index` (索引从 0 开始)
    ```sql
    SELECT attributes -> 'brand' AS brand FROM products WHERE name = 'Laptop';
    -- 结果: "AwesomeBrand" (jsonb 类型)
    SELECT attributes -> 'tags' -> 0 AS first_tag FROM products WHERE name = 'Laptop';
    -- 结果: "electronics" (jsonb 类型)
    ```

* **`->>`**: 获取 JSON 对象字段的值（作为 `text` 类型）。
    * `jsonb_object ->> 'field_name'`
    * `jsonb_array ->> index`
    ```sql
    SELECT attributes ->> 'brand' AS brand_text FROM products WHERE name = 'Laptop';
    -- 结果: AwesomeBrand (text 类型)
    SELECT attributes -> 'tags' ->> 0 AS first_tag_text FROM products WHERE name = 'Laptop';
    -- 结果: electronics (text 类型)
    ```

* **`#>`**: 按路径获取 JSON 子对象（作为 `jsonb` 类型）。路径是一个 `text` 数组。
    * `jsonb_value #> '{path, element, ...}'`
    ```sql
    SELECT attributes #> '{specs, cpu}' AS cpu_spec FROM products WHERE name = 'Laptop';
    -- 结果: "i7" (jsonb 类型)
    ```

* **`#>>`**: 按路径获取 JSON 子对象的值（作为 `text` 类型）。
    * `jsonb_value #>> '{path, element, ...}'`
    ```sql
    SELECT attributes #>> '{specs, cpu}' AS cpu_spec_text FROM products WHERE name = 'Laptop';
    -- 结果: i7 (text 类型)
    ```

* **`@>`**: 左边的 `jsonb` 值是否包含右边的 `jsonb` 值 (containment)。
    * `jsonb_container @> jsonb_contained`
    * 这是 GIN 索引 (`jsonb_ops` 或 `jsonb_path_ops`) 主要支持的操作符之一，对于高效查询非常重要。
    ```sql
    -- 查找所有品牌为 AwesomeBrand 的产品
    SELECT name, attributes FROM products WHERE attributes @> '{"brand": "AwesomeBrand"}';
    -- 查找所有标签包含 "electronics" 的产品
    SELECT name, attributes FROM products WHERE attributes -> 'tags' @> '["electronics"]';
    ```

* **`<@`**: 左边的 `jsonb` 值是否被右边的 `jsonb` 值所包含。
    * `jsonb_contained <@ jsonb_container`
    ```sql
    SELECT name, attributes FROM products WHERE '{"brand": "ClickFast", "color": "black"}' <@ attributes;
    ```

* **`?`**: 字符串是否存在作为顶层键或数组元素。
    * `jsonb_object ? 'key_name'`
    * `jsonb_array ? 'element_value'`
    ```sql
    SELECT name, attributes FROM products WHERE attributes ? 'color'; -- 查找有 'color' 键的产品
    SELECT name, attributes FROM products WHERE attributes -> 'tags' ? 'peripheral'; -- 查找标签包含 "peripheral" 的产品
    ```

* **`?|`**: 数组中的任何一个字符串是否存在作为顶层键或数组元素。
    * `jsonb_value ?| text[]`
    ```sql
    SELECT name, attributes FROM products WHERE attributes ?| ARRAY['ram_gb', 'color'];
    ```

* **`?&`**: 数组中的所有字符串是否存在作为顶层键或数组元素。
    * `jsonb_value ?& text[]`
    ```sql
    SELECT name, attributes FROM products WHERE attributes -> 'specs' ?& ARRAY['cpu', 'disk'];
    ```

* **`||`**: 连接两个 `jsonb` 值。
    * 对于对象，它合并它们，如果键冲突，则右边的值覆盖左边的值。
    * 对于数组，它连接数组。
    ```sql
    SELECT '{"a": 1, "b": 2}'::jsonb || '{"b": 3, "c": 4}'::jsonb;
    -- 结果: {"a": 1, "b": 3, "c": 4}
    SELECT '[1, 2]'::jsonb || '[3, 4]'::jsonb;
    -- 结果: [1, 2, 3, 4]
    ```

* **`-`**: 删除键/值对或数组元素。
    * `jsonb_object - 'key_name'`
    * `jsonb_array - array_index` (负数索引从末尾开始)
    ```sql
    SELECT '{"a": 1, "b": 2, "c": 3}'::jsonb - 'b';
    -- 结果: {"a": 1, "c": 3}
    SELECT '["a", "b", "c"]'::jsonb - 1; -- 删除索引为1的元素 "b"
    -- 结果: ["a", "c"]
    ```

* **`#-`**: 按路径删除字段或元素。
    * `jsonb_value #- '{path, element, ...}'`
    ```sql
    SELECT '{"a": {"b": 1, "c": 2}}'::jsonb #- '{a,b}';
    -- 结果: {"a": {"c": 2}}
    ```

**3. JSON 函数：**

PostgreSQL 提供了大量用于创建、处理和转换 JSON 数据的函数。许多函数都有 `json_` 和 `jsonb_` 两个版本。

* **创建函数：**
    * `to_jsonb(anyelement)`: 将 SQL 值转换为 `jsonb`。
    * `jsonb_build_array(...)`: 从参数列表构建 `jsonb` 数组。
    * `jsonb_build_object(...)`: 从参数列表（键/值对）构建 `jsonb` 对象。
    * `jsonb_object(text[])`: 从键/值对数组构建 `jsonb` 对象。
    * `array_to_json(anyarray)`: 将 SQL 数组转换为 JSON 数组。
    * `row_to_json(record)`: 将 SQL 行/记录转换为 JSON 对象。

* **处理和提取函数：**
    * `jsonb_array_elements(jsonb_array)`: 将 `jsonb` 数组扩展为一组 `jsonb` 值。
    * `jsonb_array_elements_text(jsonb_array)`: 将 `jsonb` 数组扩展为一组 `text` 值。
    * `jsonb_array_length(jsonb_array)`: 返回 `jsonb` 数组的长度。
    * `jsonb_each(jsonb_object)`: 将 `jsonb` 对象扩展为一组键/值对（`key text`, `value jsonb`）。
    * `jsonb_each_text(jsonb_object)`: 将 `jsonb` 对象扩展为一组键/值对（`key text`, `value text`）。
    * `jsonb_object_keys(jsonb_object)`: 返回 `jsonb` 对象的所有键的集合（作为 `text`）。
    * `jsonb_extract_path(from_json jsonb, VARIADIC path_elems text[])`: 按路径提取 `jsonb` 子对象。等效于 `#>` 操作符。
    * `jsonb_extract_path_text(from_json jsonb, VARIADIC path_elems text[])`: 按路径提取 `jsonb` 子对象的值（作为 `text`）。等效于 `#>>` 操作符。
    * `jsonb_pretty(jsonb)`: 将 `jsonb` 值格式化为易读的带缩进的文本。
    * `jsonb_typeof(jsonb)`: 返回顶层 `jsonb` 值的类型 (`object`, `array`, `string`, `number`, `boolean`, `null`)。
    * `jsonb_strip_nulls(from_json jsonb)`: 从 `jsonb` 对象中删除所有具有 null 值的键/值对。
    * `jsonb_set(target jsonb, path text[], new_value jsonb [, create_missing boolean])`: 在指定路径设置新的 `jsonb` 值。如果 `create_missing` 为 `true` (默认)，则路径不存在时会创建。
    * `jsonb_insert(target jsonb, path text[], new_value jsonb [, insert_after boolean])`: 在指定路径插入新的 `jsonb` 值（用于数组或在对象中插入新键）。
    * `jsonb_path_exists(target jsonb, path jsonpath [, vars jsonb, silent boolean])`: 检查 JSON 路径是否在 `jsonb` 值中返回任何项。
    * `jsonb_path_match(target jsonb, path jsonpath [, vars jsonb, silent boolean])`: 检查 JSON 路径是否在 `jsonb` 值中返回匹配项。
    * `jsonb_path_query(target jsonb, path jsonpath [, vars jsonb, silent boolean])`: 执行 JSON 路径查询并返回所有匹配的 `jsonb` 项。
    * `jsonb_path_query_array(target jsonb, path jsonpath [, vars jsonb, silent boolean])`: 执行 JSON 路径查询并将所有匹配的 `jsonb` 项作为数组返回。
    * `jsonb_path_query_first(target jsonb, path jsonpath [, vars jsonb, silent boolean])`: 执行 JSON 路径查询并返回第一个匹配的 `jsonb` 项。

**4. JSON 索引：**

如前所述，`jsonb` 类型支持索引，这对于查询性能至关重要。

* **GIN 索引 (`jsonb_ops` - 默认)**：
    * 为 `jsonb` 列中的每个键和值创建索引条目。
    * 支持 `@>` (包含), `?` (键是否存在), `?|` (任一键是否存在), `?&` (所有键是否存在) 等操作符。
    ```sql
    CREATE INDEX idx_products_attributes_gin ON products USING GIN (attributes);
    -- 可以加速这类查询:
    -- SELECT * FROM products WHERE attributes @> '{"brand": "AwesomeBrand"}';
    -- SELECT * FROM products WHERE attributes ? 'color';
    ```

* **GIN 索引 (`jsonb_path_ops`)**:
    * `jsonb_path_ops` GIN 操作符类只索引路径哈希和值，而不是每个键和值。这使得索引更小，并且对于 `@>` (包含) 查询通常更快，但它不支持 `?`, `?|`, `?&` 操作符。
    ```sql
    CREATE INDEX idx_products_attributes_gin_path_ops ON products USING GIN (attributes jsonb_path_ops);
    -- 主要用于加速 `@>` 查询
    ```

* **表达式索引**：
    可以对从 JSONB 列中提取的特定值创建 B-Tree 索引，如果经常对这些特定值进行精确匹配或范围查询。
    ```sql
    CREATE INDEX idx_products_brand ON products ((attributes->>'brand'));
    -- 可以加速这类查询:
    -- SELECT * FROM products WHERE attributes->>'brand' = 'AwesomeBrand';

    CREATE INDEX idx_products_ram_gb ON products (((attributes->>'ram_gb')::integer));
    -- 可以加速这类查询:
    -- SELECT * FROM products WHERE (attributes->>'ram_gb')::integer > 8;
    ```

PostgreSQL 强大的 JSON 功能使其成为需要处理半结构化数据的应用的理想选择，例如存储文档、配置信息、日志数据等。`jsonb` 类型及其丰富的操作符、函数和索引选项提供了极大的灵活性和性能。

---

## 扩展 (Extensions)

PostgreSQL 的一个强大特性是其高度的可扩展性。**扩展 (Extensions)** 是一种打包机制，允许将一组相关的 SQL 对象（如自定义数据类型、函数、操作符、索引方法、过程语言等）捆绑在一起，并通过简单的 `CREATE EXTENSION` 命令加载到数据库中。

**扩展的原理和管理：**

1.  **打包 SQL 对象**：扩展通常包含一个或多个 SQL 脚本文件，这些文件定义了扩展提供的对象。还可能包括共享库文件（用 C 或其他语言编写的编译代码）、配置文件等。
2.  **控制文件 (`.control`)**：每个扩展都有一个控制文件（例如 `myextension.control`），其中包含关于扩展的元数据，如版本号、依赖关系、模块路径名等。
3.  **安装**：扩展的文件（SQL 脚本、共享库、控制文件）需要被放置在 PostgreSQL 安装的特定目录中（通常是共享目录下的 `extension` 子目录和库目录）。
4.  **加载到数据库 (`CREATE EXTENSION`)**:
    ```sql
    CREATE EXTENSION [IF NOT EXISTS] extension_name
        [WITH [SCHEMA schema_name]
              [VERSION version]
              [FROM old_version]
              [CASCADE]];
    ```
    * `extension_name`: 要加载的扩展的名称。
    * `SCHEMA schema_name`: 指定将扩展的对象安装到哪个模式中。如果扩展允许，这有助于将扩展的对象与其他数据库对象隔离开。如果省略，通常会使用默认模式（如 `public`）或扩展指定的模式。
    * `VERSION version`: 指定要安装的扩展版本。
    * `CASCADE`: 自动安装此扩展所依赖的任何尚未安装的扩展。
    PostgreSQL 会执行扩展的安装脚本，在数据库中创建所需的 SQL 对象。

5.  **列出可用的扩展**:
    可以查询 `pg_available_extensions` 视图：
    ```sql
    SELECT * FROM pg_available_extensions;
    ```
    或者在 `psql` 中使用：
    ```sql
    \dx+ * -- 显示所有可用扩展的详细信息
    ```

6.  **列出已安装的扩展**:
    可以查询 `pg_extension` 系统目录：
    ```sql
    SELECT extname, extversion FROM pg_extension;
    ```
    或者在 `psql` 中使用：
    ```sql
    \dx
    ```

7.  **更新扩展 (`ALTER EXTENSION`)**:
    ```sql
    ALTER EXTENSION extension_name UPDATE [TO new_version];
    ```
    这会将已安装的扩展更新到其可用的最新版本或指定的 `new_version`。PostgreSQL 会执行相应的更新脚本。
    还可以用 `ALTER EXTENSION extension_name SET SCHEMA new_schema;` 来移动扩展到新的模式（如果扩展支持）。

8.  **删除扩展 (`DROP EXTENSION`)**:
    ```sql
    DROP EXTENSION [IF EXISTS] extension_name [, ...] [CASCADE | RESTRICT];
    ```
    * `CASCADE`: 自动删除依赖于此扩展的对象（包括其他扩展）。
    * `RESTRICT` (默认): 如果有任何对象依赖于此扩展，则拒绝删除。
    这将从数据库中移除扩展创建的所有对象。

许多有用的功能都是通过扩展提供的，这使得 PostgreSQL 核心保持相对精简，同时允许用户根据需要添加特定功能。

### PGVector

`pgvector` 是一个 PostgreSQL 扩展，用于存储和搜索**向量嵌入 (vector embeddings)**。向量嵌入是将文本、图像、音频或其他数据类型表示为高维空间中的数字向量的方法，常用于机器学习应用，特别是相似性搜索、推荐系统、语义搜索等。

::: info 核心功能

* **`vector` 数据类型**：提供一种新的数据类型来存储向量。
* **相似性度量**：支持多种计算向量之间相似度（或距离）的方法：
    * **L2 距离 (欧氏距离)**：`<->` 操作符
    * **内积 (Inner Product)**：`<#>` 操作符
    * **余弦相似度 (Cosine Similarity)** / **余弦距离 (Cosine Distance)**：`<=>` 操作符
* **索引支持**：为了加速相似性搜索，`pgvector` 支持使用 `ivfflat` 和 `hnsw` 索引方法创建近似最近邻 (ANN) 索引。
    * **IVFFlat (Inverted File with Flat lists)**：一种基于聚类的索引方法。在构建时，向量被分配到最近的簇中心，查询时只搜索查询向量所在簇（或附近簇）内的向量。
        * 参数：`lists` (簇的数量)。
    * **HNSW (Hierarchical Navigable Small World graphs)**：一种基于图的索引方法，通过构建层次化的图结构来实现高效的近邻搜索。
        * 参数：`m` (每个节点的最大连接数), `ef_construction` (构建时动态候选列表的大小)。查询时也有 `ef_search` 参数。
:::

**安装与启用：**

[GitHub 仓库](https://github.com/pgvector/pgvector?tab=readme-ov-file#installation) 的文档提供了各种安装和启用方法，这里以 Docker 的方式为例：

```bash
docker run -d --name postgres16 --restart=always \
  -p 5432:5432 \
  -v /docker_data/postgre/pg16/data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=123456 \
  pgvector/pgvector:pg16
```
`pgvector/pgvector`这个镜像是以 postgres 镜像为基础构建的，所以使用方式与 postgres 镜像一致

连接数据库后使用下列命令验证安装是否成功：
```sql
SELECT * FROM pg_available_extensions where name='vector';
```


**使用方法：** 参照 [getting-started](https://github.com/pgvector/pgvector?tab=readme-ov-file#getting-started)

使用 vector, 需要先在 database 中执行：`CREATE EXTENSION vector;`, 例如：

```sql
create database vector_demo;

create extension if not exists vector;

# 检查是否创建成功
SELECT extname, extversion FROM pg_extension;
```

* **创建索引**：
    ```sql
    CREATE INDEX ON items USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
    ```

1.  **创建带有 `vector` 列的表**：
    向量列需要指定维度。
    ```sql
    CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        embedding VECTOR(3) -- 假设是3维向量
    );
    ```

2.  **插入向量数据**：
    向量以文本形式 `[x1, x2, ..., xn]` 插入。
    ```sql
    INSERT INTO items (embedding) VALUES
        ('[1,2,3]'),
        ('[4,5,6]'),
        ('[1.5,2.5,3.5]');
    ```

3.  **执行相似性搜索**：
    * **L2 距离 (越小越相似)**：
        ```sql
        SELECT id, embedding, embedding <-> '[1,1,1]' AS distance
        FROM items
        ORDER BY distance
        LIMIT 5;
        ```
    * **内积 (越大越相似，如果向量已归一化)**：
        ```sql
        -- 对于已归一化的向量，内积越大，余弦相似度越高，L2距离越小
        -- 操作符 `<#>` 返回的是负内积，所以仍然是越小越相似
        SELECT id, embedding, embedding <#> '[1,1,1]' AS neg_inner_product
        FROM items
        ORDER BY neg_inner_product
        LIMIT 5;
        ```
    * **余弦距离 (越小越相似，0 表示完全相同，1 表示正交，2 表示完全相反)**：
        ```sql
        SELECT id, embedding, embedding <=> '[1,1,1]' AS cosine_distance
        FROM items
        ORDER BY cosine_distance
        LIMIT 5;
        ```
        余弦相似度 = `1 - 余弦距离`。

4.  **创建索引以加速搜索**：

    * **IVFFlat 索引**：
        ```sql
        CREATE INDEX ON items USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
        -- 对于内积使用 vector_ip_ops
        -- 对于余弦相似度使用 vector_cosine_ops
        ```
        在查询前，设置 `ivfflat.probes` 参数（默认为1），指定查询时要检查的簇的数量。值越大，召回率越高，但速度越慢。
        ```sql
        SET ivfflat.probes = 10;
        SELECT ... -- 执行你的查询
        ```

    * **HNSW 索引** (通常推荐，通常有更好的性能/召回率权衡)：
        ```sql
        CREATE INDEX ON items USING hnsw (embedding vector_l2_ops) WITH (m = 16, ef_construction = 64);
        -- 对于内积使用 vector_ip_ops
        -- 对于余弦相似度使用 vector_cosine_ops
        ```
        在查询前，设置 `hnsw.ef_search` 参数（默认为 `ef_construction` 的值），指定搜索时动态候选列表的大小。值越大，召回率越高，但速度越慢。
        ```sql
        SET hnsw.ef_search = 100;
        SELECT ... -- 执行你的查询
        ```

**应用场景：**

* **语义搜索**：查找与查询文本语义相似的文档或段落。
* **图像检索**：查找与查询图像内容相似的图片。
* **推荐系统**：根据用户或物品的嵌入向量推荐相似的物品或内容。
* **异常检测**：识别与正常数据点向量差异较大的离群点。
* **问答系统/RAG（检索增强生成）**：与大型语言模型 (LLM) 结合，通过从向量数据库中检索相关上下文来增强 LLM 的回答。

`pgvector` 的出现极大地简化了在 PostgreSQL 中构建和部署基于向量嵌入的应用，使得开发者可以在熟悉的 SQL 环境中利用向量搜索的强大功能。

### PostGIS

PostGIS 是 PostgreSQL 的一个著名扩展，它为数据库添加了对**地理对象 (geographic objects)** 的支持，允许存储、索引和查询空间数据。PostGIS 是一个功能非常全面的地理信息系统 (GIS)，遵循 Open Geospatial Consortium (OGC) 的 SQL 规范。

**核心功能：**

* **空间数据类型**：定义了一系列用于表示地理要素的 OGC 标准数据类型，例如：
    * `GEOMETRY`: 通用几何类型，可以是以下任何一种。
    * `POINT`: 点 (如 GPS 坐标)。
    * `LINESTRING`: 线 (如道路、河流)。
    * `POLYGON`: 多边形 (如国家边界、湖泊区域)。
    * `MULTIPOINT`, `MULTILINESTRING`, `MULTIPOLYGON`: 多个点、线、多边形的集合。
    * `GEOMETRYCOLLECTION`: 不同类型几何对象的集合。
    * 支持 2D、3D (XYZ) 和 4D (XYZM, M 代表度量值) 几何。
    * `GEOGRAPHY`: 一种基于椭球体（通常是 WGS84）计算的地理坐标类型，用于处理全球范围的经纬度数据，计算结果更精确（例如距离和面积）。
    * `RASTER`: 用于存储和分析栅格数据（如卫星影像、高程模型）。

* **空间函数**：提供了数百个用于分析和处理空间数据的函数，包括：
    * **几何构造**：`ST_MakePoint()`, `ST_MakeLine()`, `ST_MakePolygon()`, `ST_GeomFromText()`, `ST_GeomFromGeoJSON()`, `ST_Collect()`.
    * **几何属性**：`ST_Area()`, `ST_Length()`, `ST_Perimeter()`, `ST_NumPoints()`, `ST_SRID()`, `ST_GeometryType()`, `ST_IsValid()`.
    * **空间关系 (拓扑)**：`ST_Intersects()` (相交), `ST_Contains()` (包含), `ST_Within()` (在内部), `ST_Overlaps()` (重叠), `ST_Touches()` (接触), `ST_Crosses()` (相交), `ST_Equals()` (相等).
    * **空间分析**：`ST_Distance()` (距离), `ST_Buffer()` (缓冲区分析), `ST_Intersection()` (交集), `ST_Union()` (并集), `ST_Difference()` (差集), `ST_Centroid()` (质心), `ST_Transform()` (坐标系转换).
    * **栅格处理函数**。

* **空间索引**：使用 GiST (Generalized Search Tree) 索引来高效地查询空间数据。通常使用 R-Tree over GiST 实现。这对于基于位置的查询（例如，“查找某个点附近的餐馆”）至关重要。

* **坐标系和投影支持**：通过 `spatial_ref_sys` 表和 `ST_Transform()` 函数支持大量的空间参考系统 (SRS) 和坐标转换。SRID (Spatial Reference System Identifier) 用于标识每个几何对象所使用的坐标系。

**安装与启用：**

1.  **安装 PostGIS 扩展库**：
    * 通常可以通过操作系统的包管理器安装 (例如 `sudo apt install postgis postgresql-XX-postgis-Y`)。
    * 许多 PostgreSQL 发行版或云服务可能已预装或允许轻松启用。
    * PostGIS 网站 (`postgis.net`) 提供详细的安装指南。

2.  **在数据库中启用扩展**：
    ```sql
    -- 启用几何/地理类型和函数
    CREATE EXTENSION postgis;

    -- (可选) 启用栅格支持
    CREATE EXTENSION postgis_raster;

    -- (可选) 启用拓扑支持
    CREATE EXTENSION postgis_topology;

    -- (可选) 启用 SFCGAL 高级3D函数
    CREATE EXTENSION postgis_sfcgal;

    -- (可选) 启用地址标准化器
    CREATE EXTENSION address_standardizer;
    CREATE EXTENSION address_standardizer_data_us; -- (示例美国数据)

    -- (可选) 启用 PostGIS Tiger Geocoder (美国)
    CREATE EXTENSION postgis_tiger_geocoder;
    ```
    通常，`CREATE EXTENSION postgis;` 是最基本和最常用的。

3.  **验证安装**：
    ```sql
    SELECT PostGIS_Full_Version();
    -- 或者
    SELECT postgis_version();
    ```

**使用方法示例：**

1.  **创建带有空间列的表**：
    ```sql
    CREATE TABLE locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        geom GEOMETRY(Point, 4326) -- 存储点数据，SRID 4326 (WGS 84 经纬度)
    );

    CREATE TABLE regions (
        id SERIAL PRIMARY KEY,
        region_name VARCHAR(100),
        boundary GEOMETRY(Polygon, 3857) -- 存储多边形，SRID 3857 (Web Mercator)
    );
    ```

2.  **插入空间数据**：
    使用 Well-Known Text (WKT) 或 Well-Known Binary (WKB) 格式，通常通过 `ST_GeomFromText()` 或 `ST_SetSRID()` 函数。
    ```sql
    INSERT INTO locations (name, geom) VALUES
    ('Central Park', ST_SetSRID(ST_MakePoint(-73.9654, 40.7829), 4326)),
    ('Eiffel Tower', ST_SetSRID(ST_MakePoint(2.2945, 48.8584), 4326));

    -- WKT 示例
    INSERT INTO regions (region_name, boundary) VALUES
    ('Sample Area', ST_GeomFromText('POLYGON((0 0, 0 10, 10 10, 10 0, 0 0))', 3857));
    ```

3.  **创建空间索引**：
    使用 `USING GIST`。
    ```sql
    CREATE INDEX idx_locations_geom ON locations USING GIST (geom);
    CREATE INDEX idx_regions_boundary ON regions USING GIST (boundary);
    ```

4.  **执行空间查询**：
    * **查找特定点附近的要素 (距离查询)**：
        ```sql
        SELECT name, ST_Distance(
            geom,
            ST_SetSRID(ST_MakePoint(-73.985130, 40.758896), 4326) -- Times Square
        ) AS distance_meters -- 如果 geom 是 geography 类型，距离单位通常是米
        FROM locations
        WHERE ST_DWithin(
            geom,
            ST_SetSRID(ST_MakePoint(-73.985130, 40.758896), 4326),
            1000 -- 查找 1000 个单位 (取决于坐标系，对于4326地理坐标，此单位可能不是米) 内的地点
                  -- 对于 geography 类型，1000 就是 1000 米
        )
        ORDER BY distance_meters;

        -- 更精确的距离查询使用 geography 类型：
        -- SELECT name, ST_Distance(geom::geography, 'SRID=4326;POINT(-73.985130 40.758896)'::geography) AS distance_meters
        -- FROM locations
        -- WHERE ST_DWithin(geom::geography, 'SRID=4326;POINT(-73.985130 40.758896)'::geography, 1000)
        -- ORDER BY distance_meters;
        ```
    * **查找某个多边形内的点**：
        ```sql
        SELECT l.name
        FROM locations l, regions r
        WHERE r.region_name = 'Sample Area' AND ST_Contains(ST_Transform(r.boundary, 4326), l.geom); -- 注意坐标系转换
        ```
    * **计算面积**：
        ```sql
        SELECT region_name, ST_Area(boundary) FROM regions; -- 面积单位取决于坐标系
        -- 对于 geography 类型，面积单位是平方米
        -- SELECT region_name, ST_Area(boundary::geography) FROM regions;
        ```

**典型应用场景：**

* **地图服务和 Web GIS**：作为后端数据存储，为地图应用提供空间数据。
* **位置服务 (LBS)**：如“查找我附近的 X”、“资产追踪”。
* **城市规划和资源管理**。
* **环境监测和分析**。
* **物流和路线规划**。
* **房地产分析**。

PostGIS 是 PostgreSQL 生态系统中最强大和最广泛使用的扩展之一，为处理地理空间数据提供了无与伦سى的灵活性和功能。它可以与许多桌面 GIS 软件（如 QGIS、ArcGIS）和 Web 地图库（如 Leaflet、OpenLayers）无缝集成。

### TimescaleDB

TimescaleDB 是一个开源的 PostgreSQL 扩展，专门设计用于处理**时间序列数据 (time-series data)**。它通过自动分区、优化的查询以及针对时间序列的特定功能，使得 PostgreSQL 能够高效地存储和分析大规模的时间序列工作负载。

**核心功能：**

1.  **Hypertables (超表)**：
    * Hypertables 是 TimescaleDB 的核心抽象。从用户角度看，它就像一个普通的 SQL 表，但实际上它在底层被自动分割成许多小的子表（称为 **chunks**），通常是按时间范围和可选的空间维度（如设备ID、位置）进行分区。
    * 这种自动分区对用户透明，用户仍然可以通过 hypertable 名称进行查询和插入。
    * 优点：
        * **提高插入性能**：新数据通常写入最近的 chunk，减少索引压力。
        * **提高查询性能**：查询通常只涉及相关的 chunks (时间谓词下推)，而不是扫描整个巨大的表。
        * **简化数据管理**：可以轻松地对旧的 chunks 执行数据保留策略（如删除或归档）。

2.  **自动分区 (Chunking)**：
    * Hypertables 主要按时间维度分区。每个 chunk 对应一个特定的时间间隔。
    * 还可以根据一个或多个空间维度（如设备ID、服务器ID、位置标签等）进一步对 chunk 进行分区，以提高针对特定设备或标签的查询性能。

3.  **数据保留策略 (Data Retention Policies)**：
    * 可以轻松设置策略，自动删除或归档超过一定时间的旧数据（即删除旧的 chunks）。
    * `add_retention_policy('hypertable_name', INTERVAL '7 days')`

4.  **连续聚合 (Continuous Aggregates)**：
    * 允许用户创建预先计算的聚合视图，这些视图会自动、增量地更新。
    * 例如，可以为每小时的平均温度、每日的交易总额等创建连续聚合。
    * 查询这些连续聚合比实时计算原始数据的聚合要快得多。
    * `CREATE MATERIALIZED VIEW ... WITH (timescaledb.continuous) AS SELECT ... GROUP BY time_bucket(...) ...;`
    * 可以设置刷新策略，使连续聚合在后台自动更新。

5.  **数据压缩 (Compression)**：
    * TimescaleDB 提供了列式压缩功能，可以显著减小旧数据的存储空间，同时仍然允许快速查询。
    * 压缩是按 chunk 进行的，通常对不再频繁更新的旧数据块启用。
    * `ALTER TABLE conditions SET (timescaledb.compress, timescaledb.compress_segmentby = 'device_id');`
    * `add_compression_policy('conditions', INTERVAL '14 days');`

6.  **时间序列专用 SQL 函数**：
    * `time_bucket(bucket_width, time_column, [origin])`: 将时间戳聚合到定义的时间桶中 (例如，每5分钟、每1小时)。
    * `first(value_column, time_column)`: 在聚合组中按时间排序的第一个值。
    * `last(value_column, time_column)`: 在聚合组中按时间排序的最后一个值。
    * `histogram(value_column, min_value, max_value, num_bins)`: 计算值的直方图。
    * 窗口函数和间隙填充函数。

7.  **PostgreSQL 生态兼容性**：
    * 由于 TimescaleDB 是 PostgreSQL 的扩展，它继承了 PostgreSQL 的所有特性，包括可靠性、SQL 兼容性、丰富的工具和连接器生态系统。

**安装与启用：**

1.  **安装 TimescaleDB 扩展库**：
    * TimescaleDB 提供了适用于多种操作系统和环境的安装包（如 .deb, .rpm, Docker 镜像, Kubernetes Helm charts）。
    * 也可以从源码编译。
    * 许多云 PostgreSQL 服务也支持 TimescaleDB。

2.  **配置 PostgreSQL**：
    * 需要将 `timescaledb` 添加到 `postgresql.conf` 文件中的 `shared_preload_libraries` 参数中，然后重启 PostgreSQL 服务器。
    ```
    shared_preload_libraries = 'timescaledb'
    ```

3.  **在数据库中启用扩展**：
    连接到你的 PostgreSQL 数据库，然后执行：
    ```sql
    CREATE EXTENSION IF NOT EXISTS timescaledb;
    ```
    通常会提示运行 `timescaledb-tune` 工具来优化 PostgreSQL 配置参数。

**使用方法示例：**

1.  **创建 Hypertable**：
    首先创建一个普通的 SQL 表，然后将其转换为 hypertable。
    ```sql
    -- 1. 创建普通表
    CREATE TABLE conditions (
        time TIMESTAMPTZ NOT NULL,
        device_id TEXT NOT NULL,
        temperature DOUBLE PRECISION,
        humidity DOUBLE PRECISION
    );

    -- 2. 将其转换为 hypertable，按 'time' 列分区
    SELECT create_hypertable('conditions', 'time');

    -- (可选) 按 'device_id' 进行空间分区 (例如，10个分区)
    -- SELECT create_hypertable('conditions', 'time', 'device_id', number_partitions => 10);
    ```

2.  **插入数据**：
    像操作普通表一样插入数据。
    ```sql
    INSERT INTO conditions (time, device_id, temperature, humidity) VALUES
    (NOW(), 'device001', 23.5, 60.1),
    (NOW() - INTERVAL '1 minute', 'device002', 24.1, 59.5);
    ```

3.  **查询数据**：
    使用标准的 SQL 查询。时间谓词会自动下推到相关的 chunks。
    ```sql
    -- 获取过去一小时内 device001 的平均温度
    SELECT AVG(temperature)
    FROM conditions
    WHERE device_id = 'device001' AND time > NOW() - INTERVAL '1 hour';

    -- 获取每5分钟的平均温度和湿度
    SELECT
        time_bucket('5 minutes', time) AS five_min_bucket,
        device_id,
        AVG(temperature) AS avg_temp,
        AVG(humidity) AS avg_humidity
    FROM conditions
    GROUP BY five_min_bucket, device_id
    ORDER BY five_min_bucket DESC, device_id;
    ```

4.  **创建连续聚合**：
    ```sql
    CREATE MATERIALIZED VIEW conditions_summary_hourly
    WITH (timescaledb.continuous) AS
    SELECT
        time_bucket('1 hour', time) AS hour_bucket,
        device_id,
        AVG(temperature) as avg_temp,
        MAX(temperature) as max_temp,
        MIN(temperature) as min_temp
    FROM conditions
    GROUP BY hour_bucket, device_id;

    -- 添加策略以每小时刷新一次连续聚合
    SELECT add_continuous_aggregate_policy('conditions_summary_hourly',
        start_offset => INTERVAL '3 hours', -- 开始聚合比当前时间早3小时的数据
        end_offset   => INTERVAL '1 hour',  -- 结束聚合比当前时间早1小时的数据
        schedule_interval => INTERVAL '1 hour');
    ```
    查询连续聚合视图会非常快：
    ```sql
    SELECT * FROM conditions_summary_hourly WHERE device_id = 'device001' ORDER BY hour_bucket DESC;
    ```

**典型应用场景：**

* **物联网 (IoT)**：存储和分析来自传感器和设备的大量数据。
* **监控和可观测性**：收集和分析应用性能指标、服务器指标、日志数据。
* **金融服务**：存储和分析股票价格、交易数据、市场指标。
* **商业智能**：跟踪用户行为、网站分析、销售趋势。
* **地理空间时间序列**：例如，跟踪移动物体的轨迹。

TimescaleDB 通过将 PostgreSQL 转变为一个强大的时间序列数据库，为处理这类特定工作负载提供了显著的性能和可管理性优势。

### Citus

Citus 是 PostgreSQL 的一个开源扩展，它通过**分片 (sharding)** 和**分布式查询执行**将 PostgreSQL 转换为一个分布式数据库。这使得 PostgreSQL 能够水平扩展，处理更大的数据集和更高的查询吞吐量，超越了单节点 PostgreSQL 的能力。

**核心功能：**

1.  **水平扩展 (Scale-Out)**：
    * Citus 允许你将数据和查询负载分布到一个由多个 PostgreSQL 服务器（称为**工作节点 (worker nodes)**）组成的集群上。
    * 一个**协调节点 (coordinator node)** 负责接收客户端连接、管理元数据、规划分布式查询，并将查询片段分发给工作节点执行。

2.  **分布式表 (Distributed Tables)**：
    * 大型表可以被声明为分布式表。Citus 会根据一个指定的**分布列 (distribution column)**（也称为分片键）将表的数据水平分割成多个**分片 (shards)**。
    * 每个分片本身就是一个普通的 PostgreSQL 表，存储在某个工作节点上。
    * 选择合适的分布列对于性能至关重要，目标是使查询尽可能地在单个工作节点内完成（下推），或者均匀地分布到多个工作节点。

3.  **引用表 (Reference Tables)**：
    * 对于那些相对较小、经常需要与分布式表连接且不经常变化的表，可以声明为引用表。
    * 引用表的完整副本会存在于集群中的所有工作节点上。
    * 这使得分布式表与引用表的连接可以在工作节点本地高效执行，无需跨节点数据传输。

4.  **分布式查询引擎**：
    * 协调节点接收 SQL 查询，解析它，并创建一个分布式查询计划。
    * 如果查询涉及到分布式表，协调节点会将查询片段路由到包含相关分片的工作节点上并行执行。
    * 工作节点执行其本地查询片段，并将结果返回给协调节点。
    * 协调节点收集并聚合来自工作节点的结果，然后返回给客户端。
    * Citus 支持大部分 PostgreSQL SQL 功能，包括事务、外键（在某些条件下）、JOINs、窗口函数、聚合、全文搜索等。

5.  **共置 (Colocation)**：
    * 如果多个分布式表使用相同的分布列类型并且具有相同的副本数量和分片数量，Citus 可以确保具有相同分布列值的这些表的分片存储在同一个工作节点上。
    * 这对于涉及这些表之间连接的查询非常重要，因为它允许连接操作在工作节点本地高效执行。

6.  **租户隔离 (Tenant Isolation)**：
    * Citus 特别适合多租户 SaaS 应用，可以将每个租户的数据（通过租户ID作为分布列）隔离到特定的分片集，甚至特定的工作节点集。

7.  **在线添加节点和分片重平衡**：
    * 可以向 Citus 集群中动态添加新的工作节点。
    * Citus 提供了分片重平衡器，可以在不中断服务的情况下将分片从负载较重的节点移动到负载较轻的节点或新添加的节点。

**安装与启用：**

1.  **设置 Citus 集群**：
    * 这通常涉及配置一个协调节点和多个工作节点，每个节点都是一个独立的 PostgreSQL 实例。
    * Citus 可以通过源码编译安装，也有适用于各种平台的二进制包和 Docker 镜像。
    * 云服务如 Microsoft Azure Database for PostgreSQL - Hyperscale (Citus) 提供了托管的 Citus 服务。

2.  **在每个节点上安装 Citus 扩展**：
    在协调节点和所有工作节点的 PostgreSQL 实例中都需要安装 Citus 扩展。

3.  **配置 PostgreSQL (`postgresql.conf`)**：
    * 在每个节点的 `postgresql.conf` 中将 `citus` 添加到 `shared_preload_libraries`，然后重启 PostgreSQL。
    ```
    shared_preload_libraries = 'citus'
    ```

4.  **在协调节点上启用扩展并添加工作节点信息**：
    连接到协调节点的数据库：
    ```sql
    CREATE EXTENSION citus;
    ```
    然后，使用 `master_add_node` (旧版本) 或 `citus_add_node` (新版本) 函数将工作节点的信息注册到协调节点：
    ```sql
    -- 对于 Citus 11.0+
    SELECT citus_add_node('worker_host_1', 5432);
    SELECT citus_add_node('worker_host_2', 5432);
    -- 验证工作节点
    SELECT * FROM citus_get_active_worker_nodes();
    ```

**使用方法示例：**

1.  **选择分布列并创建分布式表**：
    假设有一个记录网站事件的表，`site_id` 是一个很好的分布列候选。
    ```sql
    CREATE TABLE events (
        site_id INTEGER,
        event_type TEXT,
        event_data JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- 将 events 表声明为分布式表，并以 site_id 作为分布列
    SELECT create_distributed_table('events', 'site_id');
    ```

2.  **创建引用表**：
    假设有一个小的 `event_categories` 表。
    ```sql
    CREATE TABLE event_categories (
        event_type TEXT PRIMARY KEY,
        category TEXT
    );
    INSERT INTO event_categories VALUES ('view', 'engagement'), ('click', 'engagement'), ('purchase', 'conversion');

    -- 将 event_categories 声明为引用表
    SELECT create_reference_table('event_categories');
    ```

3.  **插入数据**：
    像操作普通表一样向协调节点插入数据。Citus 会根据分布列的值将数据路由到正确的分片。
    ```sql
    INSERT INTO events (site_id, event_type, event_data) VALUES
    (1, 'view', '{"page": "/home"}'),
    (2, 'click', '{"button": "buy_now"}'),
    (1, 'purchase', '{"item_id": 123, "amount": 19.99}');
    ```

4.  **查询数据**：
    所有查询都发送到协调节点。
    * **路由到单个工作节点的查询 (高效)**：
        ```sql
        -- 如果 WHERE 子句中包含对分布列的等值条件，查询通常会被路由到单个工作节点
        SELECT COUNT(*) FROM events WHERE site_id = 1;
        ```
    * **涉及多个工作节点的查询 (并行执行)**：
        ```sql
        -- 如果查询不包含对分布列的过滤，或者需要跨分片聚合
        SELECT event_type, COUNT(*)
        FROM events
        GROUP BY event_type
        ORDER BY COUNT(*) DESC;
        ```
    * **连接分布式表和引用表 (高效)**：
        ```sql
        SELECT e.site_id, e.event_type, ec.category, e.created_at
        FROM events e
        JOIN event_categories ec ON e.event_type = ec.event_type
        WHERE e.site_id = 1 AND e.created_at > NOW() - INTERVAL '1 day';
        ```

**典型应用场景：**

* **多租户 SaaS 应用**：每个租户的数据通过 `tenant_id` 分布，实现数据隔离和水平扩展。
* **实时分析仪表盘**：处理大量流入数据并快速生成聚合报告，例如网站流量分析、用户行为分析。
* **高吞吐量事务型应用**：需要处理大量并发读写操作的系统，如大型电商的订单系统或游戏后端。
* **时间序列数据**（虽然 TimescaleDB 更专注，但 Citus 也能处理，尤其是在需要与其他非时间序列数据结合时）。
* **微服务架构**：作为微服务的数据存储层，提供可扩展的 PostgreSQL 实例。
* **与 PostGIS 结合用于大规模地理空间分析**。

Citus 通过其分布式架构，显著增强了 PostgreSQL 的可伸缩性和并发处理能力，使其能够应对更大规模的数据挑战。选择合适的分布列和理解数据分发策略是成功使用 Citus 的关键。

---

## 数据备份与恢复

**1. 逻辑备份 (Logical Backups)：**

逻辑备份是从数据库中提取数据并将其存储为一组 SQL 语句或其他可移植格式（如 CSV）的过程。这些 SQL 语句在恢复时可以重新执行以重建数据库对象和数据。

* **`pg_dump`**:
    * 用途：用于备份单个 PostgreSQL 数据库。它不会备份角色信息或表空间定义等全局对象。
    * 输出格式：
        * **纯文本 SQL 脚本 (`-Fp` 或默认)**：生成一个包含 `CREATE TABLE`, `ALTER TABLE`, `COPY` (用于数据) 等命令的 `.sql` 文件。可以直接用 `psql` 恢复。
        * **自定义归档格式 (`-Fc`)**: 生成一个经过压缩的自定义格式文件（通常是 `.dump` 或 `.custom`）。这种格式更灵活，允许在恢复时选择性地恢复对象、并行恢复，并且通常比纯文本格式更小。需要使用 `pg_restore` 恢复。
        * **目录归档格式 (`-Fd`)**: 将备份输出到一个目录，每个表的数据和模式分别存储在不同的文件中，并有一个目录文件。此格式也支持并行备份和恢复，并使用 `pg_restore` 恢复。
        * **tar 归档格式 (`-Ft`)**: 生成一个 `.tar` 文件，类似于自定义格式，也用 `pg_restore` 恢复。
    * **常用选项：**
        * `-U username`: 指定连接的用户名。
        * `-W`: 提示输入密码。
        * `-h hostname`: 指定服务器主机。
        * `-p port`: 指定服务器端口。
        * `-d dbname`: 要备份的数据库名 (也可以作为最后一个参数)。
        * `-f filename`: 指定输出文件名。
        * `-F format`: 指定输出格式 (`p`=plain, `c`=custom, `d`=directory, `t`=tar)。
        * `-Z level`: 指定压缩级别 (0-9，仅用于自定义、目录和 tar 格式)。
        * `-n schema` / `-N schema`: 只备份/不备份指定的模式。
        * `-t table` / `-T table`: 只备份/不备份指定的表。
        * `--inserts` 或 `--column-inserts`: 使用 `INSERT` 命令而不是 `COPY` 来转储数据 (非常慢，但可能更具可移植性或易于编辑)。
        * `--data-only`: 只备份数据，不备份模式。
        * `--schema-only`: 只备份模式（表定义、函数等），不备份数据。
        * `--clean`: 在创建命令之前包含 `DROP` 命令。
        * `--create`: 包含 `CREATE DATABASE` 命令。
        * `-j num_jobs`: (用于目录格式) 并行转储指定数量的表。
    * **示例：**
        备份 `mydatabase` 到 `mydatabase_backup.sql` (纯文本)：
        ```bash
        pg_dump -U myuser -W -h localhost mydatabase > mydatabase_backup.sql
        ```
        备份 `mydatabase` 到 `mydatabase_backup.dump` (自定义格式，压缩)：
        ```bash
        pg_dump -U myuser -W -Fc -Z5 -f mydatabase_backup.dump mydatabase
        ```

* **`pg_dumpall`**:
    * 用途：用于备份整个 PostgreSQL 集群，包括所有数据库、角色、表空间以及其他全局对象。
    * 输出格式：总是纯文本 SQL 脚本。
    * **常用选项：** 类似 `pg_dump`，但不指定特定数据库。
        * `--globals-only`: 只备份全局对象（角色、表空间），不备份任何数据库内容。
        * `--roles-only`: 只备份角色。
        * `--tablespaces-only`: 只备份表空间。
    * **示例：**
        备份整个集群：
        ```bash
        pg_dumpall -U postgres -W > cluster_backup.sql
        ```
        只备份全局对象：
        ```bash
        pg_dumpall -U postgres -W --globals-only > globals_backup.sql
        ```

**2. 恢复逻辑备份：**

* **使用 `psql` (用于纯文本 SQL 脚本)**：
    ```bash
    # 恢复 pg_dumpall 的备份 (通常需要连接到 postgres 数据库，并作为超级用户)
    psql -U postgres -f cluster_backup.sql

    # 恢复 pg_dump 的单个数据库备份
    # 1. (如果备份文件中不包含 CREATE DATABASE) 先创建空数据库
    createdb -U myuser new_database
    # 2. 导入数据
    psql -U myuser -d new_database -f mydatabase_backup.sql
    ```

* **使用 `pg_restore` (用于自定义、目录或 tar 格式的 `pg_dump` 备份)**：
    `pg_restore` 提供了更多灵活性，例如选择性恢复、并行恢复。
    * **常用选项：**
        * `-U username`, `-W`, `-h hostname`, `-p port`
        * `-d dbname`: 指定要恢复到的目标数据库（必须已存在）。
        * `-l backup_file.dump`: 列出归档文件的内容。
        * `-F format`: 指定输入备份文件的格式 (通常可以自动检测)。
        * `-C`: (与 `-d` 一起使用) 从备份文件中包含的 `CREATE DATABASE` 命令创建数据库。
        * `-c` (`--clean`): 在重新创建数据库对象之前，先清理（删除）它们。
        * `-j num_jobs`: 并行恢复。
        * `-n schema` / `-t table`: 只恢复指定的模式/表。
    * **示例：**
        恢复 `mydatabase_backup.dump` 到 `new_database` (假设已创建)：
        ```bash
        pg_restore -U myuser -W -d new_database mydatabase_backup.dump
        ```
        列出备份内容：
        ```bash
        pg_restore -l mydatabase_backup.dump
        ```
        并行恢复（例如使用4个作业）：
        ```bash
        pg_restore -U myuser -W -d new_database -j 4 mydatabase_backup.dump
        ```

**逻辑备份的优缺点：**
* 优点：灵活（可以选择性恢复）、可移植（可以在不同版本的 PostgreSQL 甚至不同架构的机器之间迁移）、备份文件相对较小（尤其是压缩后）。
* 缺点：备份和恢复过程可能较慢（特别是对于非常大的数据库），恢复时需要重建索引，这可能非常耗时。不适合非常大的数据库的快速恢复或 PITR。

**3. 物理备份 (Physical Backups)：**

物理备份是通过直接复制构成数据库集群的数据文件和 WAL (Write-Ahead Log) 文件来进行的。

* **文件系统级别备份 (Cold Backup)**：
    * 最简单的方法是关闭 PostgreSQL 服务器，然后复制整个数据目录 (`PGDATA`)。
    * 恢复时，关闭服务器，用备份的文件替换数据目录，然后重启服务器。
    * 优点：简单。
    * 缺点：需要停机，备份可能很大，不能进行时间点恢复。

* **持续归档和时间点恢复 (Point-in-Time Recovery - PITR)**：
    这是 PostgreSQL 最强大和推荐的物理备份方法，允许将数据库恢复到过去的任意时间点。
    * **概念**：
        1.  **基础备份 (Base Backup)**：首先，创建一个数据库集群文件的一致性快照。这可以使用 `pg_basebackup` 工具或通过手动设置低级 API 来完成。
        2.  **WAL 归档 (WAL Archiving)**：配置 PostgreSQL 将其生成的 WAL 段文件持续复制到一个安全的归档位置（例如，另一台服务器、NFS、云存储）。WAL 文件包含了对数据库的所有更改记录。
            * 在 `postgresql.conf` 中设置：
                * `wal_level = replica` (或 `logical`，或更高版本中的 `archive`)
                * `archive_mode = on`
                * `archive_command = 'cp %p /path/to/archive/%f'` (简单示例，生产中会使用更健壮的命令或工具如 `pg_receivewal`, `wal-g`, `pgBackRest`)
    * **恢复过程 (PITR)**：
        1.  从归档中恢复最近的基础备份到新的数据目录。
        2.  创建一个 `recovery.signal` 文件（或 `standby.signal` 用于备库）在新的数据目录中，并配置 `postgresql.conf` (或 `recovery.conf` 在旧版本中) 以指定从 WAL 归档中恢复 WAL 文件。
        3.  在 `postgresql.conf` 中（或 `recovery.conf`）设置 `restore_command` 来告诉 PostgreSQL 如何从归档获取 WAL 文件 (例如 `restore_command = 'cp /path/to/archive/%f %p'`)。
        4.  可以指定一个恢复目标，例如恢复到特定时间点 (`recovery_target_time`)、特定事务 ID (`recovery_target_xid`) 或命名恢复点 (`recovery_target_name`)。
        5.  启动 PostgreSQL 服务器。它将进入恢复模式，重放基础备份之后和恢复目标之前的所有 WAL 日志。
    * **工具**：
        * `pg_basebackup`: 用于创建在线的基础备份。
        * `pg_receivewal`: 用于从主服务器流式接收 WAL 文件并存储它们。
        * `pgBackRest`, `Barman`, `WAL-G`: 专门的第三方备份和恢复管理工具，简化了 PITR 的设置和管理，并提供了更多高级功能（如增量备份、并行备份/恢复、压缩、云存储集成等）。

**物理备份的优缺点：**
* 优点：恢复速度通常比逻辑备份快得多（特别是对于大数据库），支持 PITR。
* 缺点：备份可能非常大，设置 PITR 相对复杂一些（尽管有工具可以简化）。基础备份通常是整个数据目录的大小。

**4. Docker 环境下的备份与恢复：**

当 PostgreSQL 在 Docker 容器中运行时，备份和恢复策略需要考虑容器的特性。

* **核心原则**：数据应该存储在 Docker 卷 (Volumes) 中，而不是容器的可写层，以确保数据持久性。

* **使用 `docker exec` 执行 `pg_dump` / `pg_dumpall`**：
    这是最常见的方法，用于逻辑备份。
    ```bash
    # 备份单个数据库 (输出到主机)
    docker exec -t your_postgres_container_name pg_dump -U your_pg_user -d your_db_name > /host/path/to/backup.sql

    # 备份所有数据库 (输出到主机)
    docker exec -t your_postgres_container_name pg_dumpall -U your_pg_user > /host/path/to/cluster_backup.sql

    # 使用自定义格式并输出到容器内映射的卷，然后再从主机访问
    # 假设容器内 /backup 目录映射到主机的 /opt/pg_backups
    # docker run ... -v /opt/pg_backups:/backup ... postgres
    docker exec your_postgres_container_name pg_dump -U your_pg_user -Fc -f /backup/mydatabase.dump mydatabase
    ```
    **注意**：`-t` (分配一个伪 TTY) 对于 `pg_dump` 输出到标准输出的某些格式（如自定义格式）可能会导致问题。对于直接重定向到文件的 SQL 格式或使用 `-f` 选项在容器内指定输出文件通常更安全。

* **恢复使用 `docker exec` 和 `psql` / `pg_restore`**：
    将备份文件复制到容器内，或者从映射的卷中读取。
    ```bash
    # 恢复 SQL 文件
    # 1. 将备份文件复制到容器 (如果不在卷中)
    # docker cp /host/path/to/backup.sql your_postgres_container_name:/tmp/backup.sql
    # 2. 在容器内执行 psql
    # docker exec -i your_postgres_container_name psql -U your_pg_user -d new_db_name < /host/path/to/backup.sql (直接从主机 stdin)
    # 或者，如果文件已在容器内：
    docker exec -i your_postgres_container_name psql -U your_pg_user -d new_db_name -f /tmp/backup.sql

    # 恢复自定义格式文件 (假设文件在容器的 /backup 目录)
    docker exec your_postgres_container_name pg_restore -U your_pg_user -d new_db_name /backup/mydatabase.dump
    ```

* **备份 Docker 卷 (物理层面，但需谨慎)**：
    如果 PostgreSQL 服务器在容器内停止，你可以直接备份包含 `PGDATA` 的 Docker 卷的内容。
    ```bash
    # 假设 PGDATA 在名为 'pgdata_volume' 的卷中
    # 1. 停止 PostgreSQL 容器
    docker stop your_postgres_container_name
    # 2. 运行一个临时容器挂载该卷，并使用 tar 备份
    docker run --rm -v pgdata_volume:/data_to_backup -v /host/backup_dir:/backup alpine \
           tar czf /backup/pgdata_backup.tar.gz -C /data_to_backup .
    # 3. (可选) 重新启动 PostgreSQL 容器
    docker start your_postgres_container_name
    ```
    恢复时，需要将备份解压到卷中。这种方法类似于冷物理备份。

* **使用 PITR 和 WAL 归档**：
    可以在 Docker 容器内配置 PostgreSQL 进行 WAL 归档。你需要确保 WAL 归档目录和基础备份的存储位置对于 PostgreSQL 容器是持久且可访问的（例如，通过映射的 Docker 卷或专用的备份容器/服务）。
    像 `pgBackRest` 这样的工具也可以在 Docker 环境中与 PostgreSQL 一起部署和使用，以管理 PITR。

* **自动化**：
    使用 cron 作业或编排工具（如 Kubernetes CronJobs）来定期执行 `docker exec pg_dump ...` 命令。

**选择备份策略的关键考虑因素：**

* **RPO (Recovery Point Objective)**：可接受的最大数据丢失量。PITR 可以实现非常低的 RPO。
* **RTO (Recovery Time Objective)**：从故障到恢复服务所需的最长时间。物理备份通常比逻辑备份具有更短的 RTO。
* **数据大小**。
* **可用存储空间**。
* **系统资源（CPU、I/O）**。
* **操作复杂性**。

对于生产环境，强烈建议实施 PITR 策略，并定期测试备份和恢复过程。第三方工具如 `pgBackRest` 可以大大简化这一过程。
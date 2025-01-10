---

order: 15

---

# tk-mybatis
## 一 配置tk-mybatis环境

Github：https://github.com/abel533/Mapper 



### 1. 配置mybatis环境

tk-mybatis是基于mybatis实现的，所以需要先配置好mybatis的环境和mysql驱动

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.2.2</version>
</dependency>
```

> 配置：数据源与mapper映射文件位置

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/tk_mybatis?serverTimezone=UTC&characterEncoding=utf-8

mybatis:
  mapper-locations: classpath:cn/itdrizzle/mapper/*Mapper.xml
  type-aliases-package: cn.itdrizzle.pojo
```



<br>



### 2. tk-mybatis集成

```xml

<dependency>
  <groupId>tk.mybatis</groupId>
  <artifactId>mapper-spring-boot-starter</artifactId>
  <version>2.1.5</version>
</dependency>

```

最新版本号如上所示，你也可以从下面地址查看：

http://mvnrepository.com/artifact/tk.mybatis/mapper-spring-boot-starter



> **注意：引入该 starter 时，和 MyBatis 官方的 starter 没有冲突，但是官方的自动配置不会生效！**

如果你需要对通用 Mapper 进行配置，你可以在 Spring Boot 的配置文件中配置 `mapper.` 前缀的配置。

例如在 yml 格式中配置：

```yaml
mapper:
  mappers:
    - tk.mybatis.mapper.common.Mapper
    - tk.mybatis.mapper.common.Mapper2
  notEmpty: true
```

在 properties 配置中：

```properties
mapper.mappers=tk.mybatis.mapper.common.Mapper,tk.mybatis.mapper.common.Mapper2
mapper.notEmpty=true
```



<br>



### 3. 注解@MapperScan

你可以给带有 `@Configuration` 的类配置该注解，或者直接配置到 Spring Boot 的启动类上，如下：

```java

@tk.mybatis.spring.annotation.MapperScan(basePackages = "扫描包")
@SpringBootApplication
public class SampleMapperApplication {
    public static void main(String[] args) {
            SpringApplication.run(SampleMapperApplication.class, args);
        }
}

```

**注意：这里使用的 `tk.mybatis.spring.annotation.MapperScan` !** 



**Spring Boot 中注解注意事项**：

**如果你使用了 `@tk.xxx.MapperScan` 注解（包名必填）**，通用 Mapper 就会自动处理所有通用方法。

**如果不使用该注解**，你没有别的办法设置包名，所以通用 Mapper 就无法判断哪些接口属于 DAO 层，因此你需要给所有的 Mapper 接口**增加 `@org.xxx.Mapper` 注解**，否则 MyBatis 就扫描不到任何接口



<br>



## 二 ORM对象关系映射

### 1. 通用Mapper快速入门

数据库（MySql ）准备如下表：

```sql
CREATE TABLE `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `countryname` varchar(255) DEFAULT NULL COMMENT '名称',
  `countrycode` varchar(255) DEFAULT NULL COMMENT '代码',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=10011 DEFAULT CHARSET=utf8mb4 COMMENT='国家信息';
```

<br>

对应的 Java 实体类如下：

```java
@Data
public class Country {
    @Id
    private Integer id;
    private String  countryname;
    private String  countrycode;
}
```

最简单的情况下，只需要一个 `@Id` 标记字段为主键即可。数据库中的字段名和实体类的字段名是完全相同的情况下，实体类和表可以直接映射。

**提醒：如果实体类中没有一个标记 `@Id` 的字段，当你使用带有 `ByPrimaryKey` 的方法时，所有的字段会作为联合主键来使用，也就会出现类似 `where id = ? and countryname = ? and countrycode = ?` 的情况** 。



<br>



#### 通用Mapper接口

**通用 Mapper 提供了大量的通用接口，这里以最常用的 Mapper 接口为例** ，如下：

```java

import tk.mybatis.mapper.common.Mapper;

public interface CountryMapper extends Mapper<Country> {

}

```

> 只要配置 MyBatis 时能注册或者扫描到该接口，该接口提供的方法就都可以使用。

该接口默认继承的方法如下：

- *selectOne*
- *select*
- *selectAll*
- *selectCount*
- *selectByPrimaryKey*
- *方法太多，省略其他...* 

<br>



从 MyBatis 或者 Spring 中获取该接口后就可以直接使用：

```java
@SpringBootTest
public class CountryMapperTest {
    @Autowired
    CountryMapper countryMapper;

    @Test
    public void testInsertCountry(){
        Country country = new Country();
        country.setCountrycode("10088");
        country.setCountryname("China");

        countryMapper.insertSelective(country);
        System.out.println(country);
    }

    @Test
    public void testSelectAll(){
        List<Country> countryList = countryMapper.selectAll();
        System.out.println(countryList);
    }

}
```

<br>



#### 自定义SQL查询

**如果想要增加自己写的方法，可以直接在 `CountryMapper` 中增加，跟以前直接使用mybatis一样**。

**1. 使用纯接口注解方式时** 

```java
import org.apache.ibatis.annotations.Select;
import tk.mybatis.mapper.common.Mapper;

public interface CountryMapper extends Mapper<Country> {
    @Select("select * from country where countryname = #{countryname}")
    Country selectByCountryName(String countryname);
}
```

> 这里只是举了个简单的例子，可以是很复杂的查询。



**2. 如果使用 XML 方式，需要提供接口对应的 XML 文件**

例如提供了 `CountryMapper.xml` 文件，内容如下：

```xml
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="tk.mybatis.sample.mapper.CountryMapper">
    <select id="selectByCountryName" resultType="tk.mybatis.model.Country">
        select * from country where countryname = #{countryname}
    </select>
</mapper>
```

在接口中添加对应的方法：

```java
import tk.mybatis.mapper.common.Mapper;

public interface CountryMapper extends Mapper<Country> {
    Country selectByCountryName(String countryname);
}
```

在接口中添加其他方法的时候和只用 MyBatis 是完全一样的，**但是需要注意，在对应的 XML 中，不能出现和继承接口中同名的方法** ！



<br>



### 2.  数据库与实体类映射

**通用 Mapper 中，默认情况下是将实体类字段按照驼峰转下划线形式的表名列名进行转换。**

> 例如
>
> 实体类的 `userName` 可以映射到表的 `user_name` 上。
>
> 如果想要修改默认的转换方式，可以修改 `style` 全局配置。

数据库映射主要涉及到一些注解和全局配置，通用 Mapper 默认使用了几个简单的注解，其他 JPA 的注解默认并不支持.

但是如果你开发自己的通用方法，你可以使用 JPA 注解或者引入自己的注解。

<br>



#### @NameStyle注解

这个注解可以在类上进行配置，优先级高于对应的 `style` 全局配置。注解支持以下几个选项：

```java
normal,                     //原值
camelhump,                  //驼峰转下划线
uppercase,                  //转换为大写
lowercase,                  //转换为小写
camelhumpAndUppercase,      //驼峰转下划线大写形式
camelhumpAndLowercase,      //驼峰转下划线小写形式
```

使用时，直接在类上配置即可，例如：

```java
@NameStyle(Style.camelhumpAndUppercase)
public class Country{}
```

配置该注解后，对该类和其中的字段进行转换时，会将形如 `userName` 的字段转换为表中的 `USER_NAME` 字段。

<br>



#### @Table和@Column

`@Table` 注解可以配置 `name`,`catalog` 和 `schema` 三个属性，配置 `name` 属性后，直接使用提供的表名，不再根据实体类名进行转换。其他两个属性中，同时配置时，`catalog` 优先级高于 `schema`，也就是只有 `catalog` 会生效。

配置示例如下：

```java
@Table(name = "sys_user")
public class User}{}
```

将 `User` 实体映射到 `sys_user` 表。

<br>



`@Column` 注解支持 `name`, `insertable` 和 `updateable` 三个属性。

`name` 配置映射的列名。

`insertable` 对提供的 `insert` 方法有效，如果设置 `false` 就不会出现在 SQL 中。

`updateable` 对提供的 `update` 方法有效，设置为 `false` 后不会出现在 SQL 中。

配置示例如：

```java
@Column(name = "user_name")
private String name;
```

除了直接映射 `name` 到 `user_name` 这种用法外，在使用关键字的情况，还会有下面的用法：

```java
@Column(name = "`order`")
private String order;
```

对于关键字这种情况，通用 Mapper 支持自动转换，可以查看后续配置文档中的 **wrapKeyword** 配置。

<br>



`@ColumnType` 注解（Mapper）：

这个注解提供的 `column`属性和 `@Column` 中的 `name` 作用相同。但是 `@Column` 的优先级更高。

除了 `name` 属性外，这个注解主要提供了 `jdbcType` 属性和 `typeHandler` 属性。

`jdbcType` 用于设置特殊数据库类型时指定数据库中的 `jdbcType`。

`typeHandler` 用于设置特殊类型处理器，常见的是枚举。

用法示例如下：

```java
@ColumnType(
        column = "countryname",
        jdbcType = JdbcType.VARCHAR,
        typeHandler = StringTypeHandler.class)
private String  countryname;
```

<br>



#### @Transient注解

一般情况下，实体中的字段和数据库表中的字段是一一对应的，但是也有很多情况我们会在实体中增加一些额外的属性，这种情况下，就需要使用 `@Transient` 注解来告诉通用 Mapper 这不是表中的字段。

默认情况下，只有简单类型会被自动认为是表中的字段（可以通过配置中的 **`useSimpleType`** 控制）。

> 这里的简单类型不包含 Java 中的8种基本类型：
>
> byte,short,int,long,float,double,char,boolean
>
> 这是因为在类中，基本类型会有默认值，而 MyBatis 中经常会需要判断属性值是否为空，所以不要在类中使用基本类型，否则会遇到莫名其妙的错误。

对于类中的复杂对象，以及 `Map`,`List` 等属性不需要配置这个注解。

对于枚举类型作为数据库字段的情况，需要看配置中的 **`enumAsSimpleType`** 参数。

配置示例：

```java
@Transient
private String otherThings; //非数据库表中字段
```

<br>



### 3. 标记主键和主键策略

####  @Id标记主键注解

上面几个注解都涉及到映射。 `@Id` 注解和映射无关，它是一个特殊的标记，用于标识数据库中的主键字段。

正常情况下，**一个实体类中至少需要一个标记 `@Id` 注解的字段，存在联合主键时可以标记多个。**

如果表中没有主键，类中就可以不标记。

当类中没有存在标记 `@Id` 注解的字段时，你可以理解为类中的**所有字段是联合主键**。使用所有的 `ByPrimaryKey` 相关的方法时，有 `where` 条件的地方，会将所有列作为条件。

配置示例：

```java
@Id
private Integer id;
```

或者联合主键：

```java
@Id
private Integer userId;
@Id
private Integer roleId;
```

<br>



#### 主键策略及相关注解

首先主键策略和数据库关系很大，有些数据库支持主键自增，而有些数据库只能通过序列来获得。

- 通过 `getGeneratedKeys` 方法取回主键

  这种情况首先需要数据库支持自增，其次数据库提供的 JDBC 支持 `getGeneratedKeys` 方法

  常见的如 MySql，SqlServer 支持这种模式，这种情况下，配置主键策略最简单。用法如下：

  ```java
  @Id
  @KeySql(useGeneratedKeys = true)
  private Long id;
  ```

  新增的`@KeySql` 注解用于替换 `@GeneratedValue` 注解，因此 `@KeySql` 能以更简单方式实现原来的功能

  或：

  ```java
  @Id
  @GeneratedValue(generator = "JDBC")
  private Long id;
  ```

  为了让大家容易理解这里配置和 MyBatis 写法的关系，大家可以看看对应生成的 XML 代码：

  ```xml
  <insert id="insert" useGeneratedKeys="true" keyProperty="id">
      insert into country (id, countryname, countrycode)
      values (#{id},#{countryname},#{countrycode})
  </insert>
  ```

  <br>

- 通过序列和任意 SQL 获取主键值(像 Oracle 中通过序列获取主键就属于这种情况)

  除了类似序列获取值外，还可以是获取 UUID 的 SQL 语句 （详情请参考官方文档）

<br>

第一种方法是插入表之后才有 id 的值，第二种则是插入数据库前需要获取一个值作为主键。



<br>



## 三 Example的创建及用法

通用 Mapper 中的 Example 方法有两大类定义，一个参数和两个参数的，例如下面两个：

```
List<T> selectByExample(Object example);

int updateByExampleSelective(@Param("record") T record, @Param("example") Object example);
```

所有 Example 方法中的 example 类型都是 `Object` 类型，这是因为通用 Mapper 支持所有符合 Example 结构的参数，例如通过 MBG 生成的 CountryExample、UserExample 类。还有通用 Mapper 中提供的通用 Example，以及支持 Java8 方法引用的 Weekend 类型。

> 配置中有一个和 Example 有关的参数，点击查看 [3.14 checkExampleEntityClass](https://github.com/abel533/Mapper/wiki/3.config#314--checkexampleentityclass)。



### 1. MBG生成的Example

用法如下：

```java
CountryExample example = new CountryExample();
example.createCriteria().andCountrynameLike("A%");
example.or().andIdGreaterThan(100);
example.setDistinct(true);
int count = mapper.deleteByExample(example);
```

对于的 SQL 日志如下：

```bash
DEBUG [main] - ==>  Preparing: DELETE FROM country WHERE ( countryname like ? ) or ( Id > ? ) 
DEBUG [main] - ==> Parameters: A%(String), 100(Integer)
DEBUG [main] - <==    Updates: 95
```

生成的 CountryExample 中包含了和字段相关的多种方法，根据自己的需要设置相应的条件即可。

<br>



### 2. 通用Example方式

这是由通用 Mapper 提供的一个类，这个类和 MBG 生成的相比，需要自己设置属性名。这个类还额外提供了更多的方法。

**2.1 查询**：

示例：

```java
Example example = new Example(Country.class);
example.setForUpdate(true);
example.createCriteria().andGreaterThan("id", 100).andLessThan("id",151);
example.or().andLessThan("id", 41);
List<Country> countries = mapper.selectByExample(example);
```

日志：

```bash
DEBUG [main] - ==>  Preparing: SELECT id,countryname,countrycode FROM country WHERE ( id > ? and id < ? ) or ( id < ? ) ORDER BY id desc FOR UPDATE 
DEBUG [main] - ==> Parameters: 100(Integer), 151(Integer), 41(Integer)
DEBUG [main] - <==      Total: 90
```



**2.2 动态 SQL**

示例：

```java
Example example = new Example(Country.class);
Example.Criteria criteria = example.createCriteria();
if(query.getCountryname() != null){
    criteria.andLike("countryname", query.getCountryname() + "%");
}
if(query.getId() != null){
    criteria.andGreaterThan("id", query.getId());
}
List<Country> countries = mapper.selectByExample(example);
```

日志：

```bash
DEBUG [main] - ==>  Preparing: SELECT id,countryname,countrycode FROM country WHERE ( countryname like ? ) ORDER BY id desc 
DEBUG [main] - ==> Parameters: China%(String)
DEBUG [main] - <==      Total: 1
```



**2.3 排序**：

示例：

```java
Example example = new Example(Country.class);
example.orderBy("id").desc().orderBy("countryname").orderBy("countrycode").asc();
List<Country> countries = mapper.selectByExample(example);
```

日志：

```bash
DEBUG [main] - ==>  Preparing: SELECT id,countryname,countrycode FROM country order by id DESC,countryname,countrycode ASC 
DEBUG [main] - ==> Parameters: 
DEBUG [main] - <==      Total: 183
```



**2.4 去重**：

示例：

```
CountryExample example = new CountryExample();
//设置 distinct
example.setDistinct(true);
example.createCriteria().andCountrynameLike("A%");
example.or().andIdGreaterThan(100);
List<Country> countries = mapper.selectByExample(example);
```

日志：

```
DEBUG [main] - ==>  Preparing: SELECT distinct id,countryname,countrycode FROM country WHERE ( countryname like ? ) or ( Id > ? ) ORDER BY id desc 
DEBUG [main] - ==> Parameters: A%(String), 100(Integer)
DEBUG [main] - <==      Total: 95
```



**2.5 设置查询列**：

示例：

```java
Example example = new Example(Country.class);
example.selectProperties("id", "countryname");
List<Country> countries = mapper.selectByExample(example);
```

日志：

```bash
DEBUG [main] - ==>  Preparing: SELECT id , countryname FROM country ORDER BY id desc 
DEBUG [main] - ==> Parameters: 
DEBUG [main] - <==      Total: 183
```

> 除了这里提到的方法外，还有很多其他的方法，可以查看 Example 源码进行了解。



### 3 Example.builder方式

示例：

```java
Example example = Example.builder(Country.class)
        .select("countryname")
        .where(Sqls.custom().andGreaterThan("id", 100))
        .orderByAsc("countrycode")
        .forUpdate()
        .build();
List<Country> countries = mapper.selectByExample(example);
```

日志：

```bash
DEBUG [main] - ==>  Preparing: SELECT countryname FROM country WHERE ( id > ? ) order by countrycode Asc FOR UPDATE 
DEBUG [main] - ==> Parameters: 100(Integer)
DEBUG [main] - <==      Total: 83
```



### 4. Weekend方式

使用 通用 Example和 Example.builder方式中的 Example 时，需要自己输入属性名，例如 `"countryname"`，假设输入错误，或者数据库有变化，这里很可能就会出错，因此基于 Java 8 的方法引用是一种更安全的用法：Weekend

示例：

```java
List<Country> selectByWeekendSql = mapper.selectByExample(new Example.Builder(Country.class)
        .where(WeekendSqls.<Country>custom().andLike(Country::getCountryname, "%a%")
                .andGreaterThan(Country::getCountrycode, "123"))
        .build());
```

日志：

```bash
DEBUG [main] - ==>  Preparing: SELECT id,countryname,countrycode FROM country WHERE ( countryname like ? and countrycode > ? ) 
DEBUG [main] - ==> Parameters: %a%(String), 123(String)
DEBUG [main] - <==      Total: 151
```

在代码中的 `Country::getCountryname` 就是方法引用，通过该方法可以自动转换对应的列名。



<br>



## 四 tk-mybatis配置介绍

### 1. tk-mybatis配置

如果你需要对通用 Mapper 进行配置，你可以在 Spring Boot 的配置文件中配置 `mapper.` 前缀的配置

例如在 yml 格式中配置：

```yaml
mapper:
  mappers:
    - tk.mybatis.mapper.common.Mapper
    - tk.mybatis.mapper.common.Mapper2
  notEmpty: true
```

在 properties 配置中：

```properties
mapper.mappers=tk.mybatis.mapper.common.Mapper,tk.mybatis.mapper.common.Mapper2
mapper.notEmpty=true
```

<br>

通用 Mapper 提供了下面这些参数：

1. mappers
2. IDENTITY
3. ORDER(别名: order, before)
4. catalog
5. schema
6. notEmpty
7. style
8. enableMethodAnnotation
9. useSimpleType
10. usePrimitiveType
11. simpleTypes
12. enumAsSimpleType
13. wrapKeyword
14. checkExampleEntityClass
15. safeDelete
16. safeUpdate
17. useJavaType

Github文档地址：https://github.com/abel533/Mapper/wiki/3.config

<br>



### 2. style转换规则

实体和表转换时的默认规则，在 2.2 和 2.2.1 中都提到了这个参数，可选值如下：

- normal：原值
- camelhump：驼峰转下划线
- uppercase：转换为大写
- lowercase：转换为小写
- camelhumpAndUppercase：驼峰转下划线大写形式
- camelhumpAndLowercase：驼峰转下划线小写形式

配置方式如下：

```properties
style=camelhumpAndUppercase
```

<br>



### 3. useSimpleType

默认 `true`，启用后判断实体类属性是否为表字段时校验字段是否为简单类型，如果不是就忽略该属性，这个配置优先级高于所有注解。

**注意：byte, short, int, long, float, double, char, boolean 由于存在默认值，这里不会作为简单类型对待！也就是默认情况下，这些字段不会和表字段进行映射。2.2.5 中也强调了这一点。**

配置方式如下：

```properties
useSimpleType=true
```

<br>



### 4. safeDelete和safeUpdate

safeDelete配置为 true 后，delete 和 deleteByExample 都必须设置查询条件才能删除，否则会抛出异常。

配置如下：

```properties
safeDelete=true
```

使用效果：

```bash
Caused by: tk.mybatis.mapper.MapperException: 通用 Mapper 安全检查: 当前操作的方法没有指定查询条件，不允许执行该操作!
	at tk.mybatis.mapper.util.OGNL.notAllNullParameterCheck(OGNL.java:91)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:497)
	at org.apache.ibatis.ognl.OgnlRuntime.invokeMethod(OgnlRuntime.java:899)
	at org.apache.ibatis.ognl.OgnlRuntime.callAppropriateMethod(OgnlRuntime.java:1544)
	... 53 more
```

<br>

safeUpdate配置为 true 后，updateByExample 和 updateByExampleSelective 都必须设置查询条件才能删除，否则会抛出异常（`org.apache.ibatis.exceptions.PersistenceException`）。

> updateByPrimaryKey 和 updateByPrimaryKeySelective 由于要求必须使用主键，不存在这个问题。

配置如下：

```properties
safeUpdate=true
```

使用效果：

```
Caused by: tk.mybatis.mapper.MapperException: 通用 Mapper 安全检查: 当前操作的方法没有指定查询条件，不允许执行该操作!
	at tk.mybatis.mapper.util.OGNL.notAllNullParameterCheck(OGNL.java:91)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:497)
	at org.apache.ibatis.ognl.OgnlRuntime.invokeMethod(OgnlRuntime.java:899)
	at org.apache.ibatis.ognl.OgnlRuntime.callAppropriateMethod(OgnlRuntime.java:1544)
	... 53 more
```

<br>

### 5. enumAsSimpleType

用于配置是否将枚举类型当成基本类型对待。

默认 simpleType 会忽略枚举类型，使用 enumAsSimpleType 配置后会把枚举按简单类型处理，需要自己配置好 `typeHandler`。

配置方式如下：

```properties
enumAsSimpleType=true
```



<br>



## 五 tk-mybatis代码生成

### 1. Mybatis Geneator

使用该插件可以很方便的生成实体类、Mapper接口以及对应的XML文件。

首先对MBG不太了解的可以先阅读下面的文档

> Mybatis Geneator 详解
>
> http://blog.csdn.net/isea533/article/details/42102297



Github参考文档：https://github.com/abel533/Mapper/wiki/4.1.mappergenerator



<br>



### 2. codegenerator

代码生成器文档：代码生成器是基于 MBG 插件的，所以需要配合 MBG 使用。



Github参考文档：https://github.com/abel533/Mapper/wiki/4.2.codegenerator 




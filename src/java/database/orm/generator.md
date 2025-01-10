---

order: 20
title: 代码生成

---


## 一 MyBatis-Generator

MyBatis Generator，简称MBG

官网：http://mybatis.org/generator/index.html

中文网：http://www.mybatis.cn/archives/885.html



### 1. Introduction



MyBatis Generator 生成的文件包含三类：

（1）Model实体文件，一个数据库表对应生成一个 Model 实体；
（2）Mapper接口文件，数据数操作方法都在此接口中定义；
（3）Mapper XML配置文件



### 2. Quick Start

#### 引入相关依赖

mybatis-generator-core

mysql-connector-java



#### 配置generatorConfig.xml





#### Running Generator

Generator → main方法 → 直接运行

能够加载到配置文件即可

相对路径是相对于Working Directory的





### 3. Tasks After Running







## 二 XML Configuration



### 1. 文件结构简介







### 2. 去除统一前缀

Mybatis generator在1.3.6中增加新的属性domainObjectRenamingRule可以去除统一的前缀

```xml

<table tableName="dc%">

	<generatedKey column="id" sqlStatement="MySql" identity="true" />
	<domainObjectRenamingRule searchString="^Dc" replaceString="" />
	<ignoreColumn column="FRED" />
</table>

```

**注意：**searchString在这里要写转换为Java对象后的开头名称 

**实现类：**org.mybatis.generator.api.FullyQualifiedTable.java



<br>



## 三 生成接口中的常用方法

### 1. ByPrimaryKey

都会包含一个sql语句

```sql
where id = #{id}
```



### 2. Selective

选择性做一些事情

if标签

```xml
<if test="">
	
</if>
```



### 3. ByExample

拼接条件

_parameter   → 输入映射传入的值本身

这些方法传入的example类型的对象不为空的时候，拼接一个sql片段 → 拼接条件

```xml
<if test="_parameter != null">
  <include refid="Example_Where_Clause" />
</if>
```





#  
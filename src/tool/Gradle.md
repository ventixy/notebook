---

order: 15
title:  Gradle项目构建
shortTitle: Gradle项目构建
icon: gradle

---


## 一 Gradle简介与安装

Gradle 是一款Google 推出的基于 JVM、通用灵活的项目构建工具，支持 Maven，JCenter 多种第三方仓库;支持传递性依赖管理、废弃了繁杂的xml 文件，转而使用简洁的、支持多种语言(例如：java、groovy 等)的 build 脚本文件。官网地址: https://gradle.org/ . <br><br>
文档笔记参考：https://www.yuque.com/youyi-ai1ik/emphm9/kyhenl

### 1. 常见项目构建工具

| 特性 \ 工具  | Ant        | Maven   | Gradle       |
| -------- | ---------- | ------- | ------------ |
| 仓库       | 自己处理       | maven仓库 | 支持多种远程仓库     |
| 依赖管理     | ivy管理      | GAV坐标管路 | GNV坐标管理      |
| 构建性能     | 最高         | 最低      | 居中           |
| 插件支持     | 实现方便       | 较难实现    | 实现方便         |
| 配置文件     | 最为繁琐的xml文件 | xml文件   | 代码脚本（可写业务逻辑） |
| 遵循特定目录结构 | 不遵循        | 遵循      | 遵循           |
| 优势       | 小型项目构建     | 项目包管理   | 大型项目构建       |
| 当前地位     | 较少使用       | 主流      | 未来趋势         |

 ==Gradle== 集 Ant脚本的灵活性 + Maven约定大于配置的项目目录优势,支持多种远程仓库和插件, 侧重于大项目构建。

### 2. Gradle的安装

::: info 提示

Gradle官网：[https://gradle.org/ ](https://gradle.org/) 

Gradle官方下载安装教程页面：https://gradle.org/install/ 

Gradle官方用户手册：https://docs.gradle.org/current/userguide/userguide.html

:::

1. 下载 ==binary-only== ，准备好JDK环境（要求Jdk 为 1.8 或者 1.8 版本以上）

2. 解压到指定目录，配置环境变量
   
   ```
   新建环境变量(Gradle本地仓库可以和Maven本地仓库目录一致): 
     GRADLE_HOME ：D:\Develop\env\gradle\gradle-7.5.1
     GRADLE_USER_HOME ： D:\Develop\env\gradle\repository(Gradle本地仓库)
   Path环境变量新增： %GRADLE_HOME%\bin
   ```

3. 检测是否安装成功（**gradle -v 或者 gradle --version**）

## 二 Groovy基础语法

Groovy 在某种程度上 可以被视为Java 的一种脚本化改良版,Groovy 也是运行在 JVM 上，它可以很好地与 Java 代码及其相关库进行交互操作。它是一种成熟的面向对象编程语言，既可以面向对象编程，又可以用作纯粹的脚本语言。大多数有效的 Java 代码也可以转换为有效的 Groovy 代码，Groovy 和 Java 语言的主要区别是：完成同样的任务所需的Groovy 代码比 Java 代码更少。

Groovy 是基于Java 语言的，所以完全兼容Java 语法,所以对于java 程序员学习成本较低。

详细了解请参考：[The Apache Groovy programming language - Documentation](http://www.groovy-lang.org/documentation.html)

::: info 配置Groovy开发环境

1 下载并解压，下载地址: https://groovy.apache.org/download.html

2  配置path环境变量: D:\Develop\env\groovy\groovy-4.0.4\bin

:::

### 1. Groovy基本语法

Groovy是基于Java语言的，完全兼容Java语法（注释也与Java相同），但也可以作为脚本类型的语言。

在一个groovy文件中可以混合类型的定义和脚本定义，不需要再定义一个和文件同名的类。

groovy中使用def定义变量、方法、不建议使用具体的数据类型

groovy中语句末尾的分号可以省略

## 三 Gradle的基本使用

## 四 Gradle高级应用
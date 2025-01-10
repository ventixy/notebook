---

order: 40
title:  Tomcat服务器
---

## 一 Tomcat快速入门

###  1. Web服务器

常见的两种开发模型：

- C/S（Client/Server）客户/服务器模式：客户端 需要安装专⽤的客户端软件
- B/S（Brower/Server）：建立在广域网的基础上

Web服务器是运⾏及发布Web应⽤的容器，只有将开发的Web项⽬放置到该容器中，才能使⽹络中的所 有⽤户通过浏览器进⾏访问

开发Java Web应⽤所采⽤的服务器主要是与JSP/Servlet兼容的Web服务 器，⽐较常⽤的有Tomcat、Resin、JBoss、WebSphere 和 WebLogic 等

| Web服务器 | 简介                                                         |
| --------- | ------------------------------------------------------------ |
| Tomcat    | ⼀个⼩型、轻量级的⽀持JSP和Servlet 技术的Web服务器（最流⾏、开发JSP应⽤的⾸选） |
| Resin     | Resin是Caucho公司的产品，是⼀个⾮常流⾏的⽀持Servlet和JSP的服务器、速度⾮常快 |
| JBoss     | 纯Java的EJB服务器、不包含Servlet和JSP的 Web容器，不过它可以和Tomcat完美结合 |
| WebSphere | 是IBM公司的产品，有多个系列，其中WebSphere Application Server 是基于Java 的应⽤环境 |
| WebLogic  | WebLogic 是BEA公司的产品（现在已经被Oracle收购）、同样有多个系列。<br />WebLogic ⽀持企业级的、多层次的和完全分布式的Web应⽤，并且服务器的配置简单、界⾯友好 |

<br/>



### 2. 安装Tomcat

Tomcat官网：https://tomcat.apache.org/ 、https://dlcdn.apache.org/tomcat/ 

包含老版本的Tomcat下载地址：https://archive.apache.org/dist/

开源⼩型web服务器 ，完全免费，主要⽤于中⼩型web项⽬。常用版本：8.5 和 9.0

```bash

启动之前首先安装JDK并配置环境变量`JAVA_HOME`，

若希望Tomcat服务器可以在任意路径启动， 则需要配置环境变量`CATALINA_HOME` 

```

<br>

```bash

# Linux 下解压后，可能需要先赋予权限，如果配置了JAVA_HOME依然不能正常启动，
# 则还需要在 bin目录 的catalina.sh中添加JAVA_HOME （如下；）

sudo vim ./bin/catalina.sh

export JAVA_HOME=/usr/local/bin/jdk/jdk1.8.0_191

```



<br/>



### 3. Tomcat配置

Tomcat的⽬录简介： （ 通过url访问服务器示例: http://localhost:8080 ）

- **bin**：该⽬录下存放的是⼆进制可执⾏⽂件（Windows下可通过该目录下的startup.bat启动Tomcat）

- **conf**：配置文件的⽬录、这个⽬录下有四个很重要的⽂件：

  - `server.xml`：配置整个服务器信息（主要的配置文件）
  - `tomcat-users.xml`：存储tomcat⽤户的⽂件
  - `web.xml`：部署描述符⽂件
  - `context.xml`：对所有应⽤的统⼀配置（通常我们不会去配置它）

- lib：Tomcat的类库（⾥⾯是⼀⼤堆jar⽂件）

- logs：⽇志⽂件目录，记录了Tomcat启动和关闭的信息

- temp：存放Tomcat的临时⽂件

- **webapps**：存放web项⽬的⽬录，每个⽂件夹都是⼀个项⽬

  其中ROOT是⼀个特殊的项⽬，在地址栏中没有给出项⽬⽬录时，对 应的就是ROOT项⽬

- work：运⾏时⽣成的⽂件，最终运⾏的⽂件都在这⾥（通过webapps中的项⽬⽣成）

<br/>

```xml

<!-- 控制台编码：在conf文件夹下的logging.properties文件修改如下语句： 
	不推荐修改，使用UTF-8即可  -->
java.util.logging.ConsoleHandler.encoding = GBK  （UTF-8）

```

详见：

<br/>

```xml

<!-- server.xml 常用配置： 端口、协议等 -->
<Connector port="8888" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />

```

<br/>

```xml

<!-- conf/tomcat-users.xml文件用来配置管理Tomcat服务器的用户与权限 -->
<role rolename="manager-gui"/> 
<user username="admin" password="123456" roles="manager-gui"/>

访问地址：http://localhost:/manager

```



<br/>



## 二 项目资源部署

### 1. 直接部署项目

在tomcat中，最小的单元是应用，任何一个资源文件都必须属于某个应用（应用：tomcat的webapps下的一个目录）

所以，如果希望部署一个资源文件，那么就必须先设置一个应用，将该资源文件放置在该应用中。

<br>

![](https://image.ventix.top/java/image-20220407211249850.png)

如图，Tomcat原本就包含了一些 项目， 例如 examples目录 就是代表一个 项目（或者说应用）

<br>

![](https://image.ventix.top/java/image-20220407211847918.png)

<br>

```bash

# 示例：webapps下部署war项目

1. 直接将war包放到 webapps 下

2. Tomcat 会 自动将其解压，无需我们进行额外的操作

```



<br>



### 2. 使用虚拟映射

正常情况下，我们部署资源需要将资源文件放置在webapps目录下，如果其他目录下，则需要配置虚拟映射关系

~~~bash

# 方式一：conf/Catalina/localhost目录下，新建一个xml文件（tomcat会解析该xml文件，形成一个应用）

# xml文件的文件名会被tomcat解析成为应用名，xml文件中需要去配置应用的应用路径

```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <Context docBase="D:/Temp/test1" />
```

# 访问地址：http://localhost:8080/demo1/a.txt


# 应用需要有两个属性，一个叫做应用名，一个叫做应用路径；
# 在直接部署时，应用名其实就是目录的名字；应用路径其实就是 webapps路径 + 目录名）

~~~

<br>

![](https://image.ventix.top/java/QQ20220407195734-16493383899362.png)

<br>

**总而言之，一定要知道该资源文件在硬盘中路径，才有后续** 。 



<br/>



~~~bash

# 方式二： conf/server.xml中，在Host节点下配置一个Context节点

```xml
	<Context path="/demo2" docBase="D:/Temp/test2" />
```
~~~

![](https://image.ventix.top/java/QQ20220407195338-16493383807361.png)



无论直接部署还是虚拟映射，tomcat首先会解析网络路径中的应用名，将其转换成应用路径，拼接出后面的部分，拿到文件的绝对路径



<br>



### 3. 默认应用和页面

**设置默认监听端口**：

当我们访问  https://www.jd.com 类似的网站时，并没有端口号 ，为什么请求会成功呢？

其实不是没有使用端口号，而是使用的是当前协议的默认端口号。对于http协议来说，默认端口号是80 （HTTPS 443）

<br>

如果我们希望我们的tomcat服务器，在访问时，也不需要携带端口号，该如何做？

**tomcat需要去监听80端口号**、修改配置文件 conf/server.xml

```xml

<Connector port="80" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />

```

<br>

**设置默认应用**：

在tomcat中，任何一个文件都归属于某个应用，如果在访问时发现路径中没有应用名，只能当做默认应用处理

```java

/*
每当我们访问一个地址的时候，tomcat首先到 conf/Catalina/localhost目录下去察看有没有存在主目录或虚拟目录的xml文件

	如果有xml文件，就按xml里的路径进行访问，
	
	如果没有xml文件，就到server.xml文件里去察看是否配置context标签，
		如：<Context path="" docBase="D:/Temp/demo" crossContext="true"/>
		
	  如果配置了context标签，则在conf/Catalina/localhost目录下生成一个对应的xml文件，
		以便于下次直接验证而不再访问server.xml，与此同时打开context里指定的路径，
		
	  如果server.xml里没有配置context标签，则返回访问错误页面。

```

默认应用最明显的特征是应用名是ROOT（但是访问时，直接把应用名直接忽略即可）

例如：如果ROOT应用下有一个hello.html，那么访问时通过http://localhost/hello.html,  不需要去携带应用名。



如果我们希望访问资源文件时，也不带应用名，如何设置？

```bash

1. 将 webapps目录下的 ROOT项目 替换掉

2. 在 conf/Catalina/localhost下新建 ROOT.xml 文件

```

<br/>



**设置默认访问页面**：

在没有写出具体的访问资源时，tomcat加载的就是默认访问页面

```xml

<welcome-file-list>
    <welcome-file>index.html</welcome-file>
    <welcome-file>index.htm</welcome-file>
    <welcome-file>index.jsp</welcome-file>
</welcome-file-list>

```

<br/>

通过以上说明，我们明白了为什么启动Tomcat后，使用http://localhost:8080 访问到的页面是哪儿来的了



<br>



例：通过ip地址直接访问到图片，如何设置？

```xml

<!-- 1. conf/server.xml 文件中修改端口号 -->
<Connector port="80" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />


<!-- 2. conf\Catalina\localhost 下新建 ROOT.xml, 内容如下：表示将 demo 作为默认的ROOT应用 -->

<?xml version="1.0" encoding="UTF-8"?>
<Context docBase="D:/Temp/demo" />


<!-- 3. conf/web.xml 文件末尾修改 添加 welcome-file -->
<welcome-file-list>
    <welcome-file>index.html</welcome-file>
    <welcome-file>index.htm</welcome-file>
    <welcome-file>index.jsp</welcome-file>
    <welcome-file>a.jpg</welcome-file>
</welcome-file-list>

```

<br/>

![](https://image.ventix.top/java/image-20220408221824913.png)



<br>



## 三 Tomcat总体架构

### 1. 连接器和容器

HTTP服务器接收到请求之后把请求交给Servlet容器来处理，Servlet容器通过Servlet接口调用业务类。

servlet接口和Servlet容器这一整套内容叫作Servlet规范。

```java
/*

注意: Tomcat既按照Servlet规范的要求去实现了Servlet容器，同时它也具有HTTP服务器的功能。

即 Tomcat 有两个重要身份：

	1) 首先它是一个http服务器

	2) Tomcat同时也是一个Servlet容器

```

![](https://image.ventix.top/java/image-20220412084942012.png)

Tomcat 设计了两个核心组件连接器(Connector)和容器(Container)来完成Tomcat 的两大核心功能。

连接器，负责对外交流：处理Socket连接，负责网络字节流与Request和Response对象的转化;

容器，负责内部处理︰加载和管理Servlet，以及具体处理Request请求



<br/>



### 2. 连接器组件Coyote

Coyote 是Tomcat 中连接器的组件名称，是对外的接口。客户端通过Coyote与服务器建立连接、发送请求并接受响应。

```java
/*
(1) Coyote封装了底层的网络通信(Socket请求及响应处理)

(2) Coyote使Catalina容器（容器组件）与具体的请求协议及 IO操作方式完全解耦

(3) Coyote将Socket输入转换封装为Request对象，进一步封装后交由Catalina容器进行处理，处理请求完成后,
    catalina通过Coyote提供的Response对象将结果写入输出流
    
(4) Coyote负责的是具体协议（应用层) 和 IO(传输层)相关内容

```

<br>

![](https://image.ventix.top/java/image-20220412093229140.png)

<br>

| 组件            | 作用描述                                                     |
| --------------- | ------------------------------------------------------------ |
| EndPoint        | EndPoint是 Coyote通信端点，即通信监听的接口，是具体Socket接收和发送处理器，是对传输层的抽象，因此EndPoint用来实现TCP/IP协议的 |
| Processor       | Processor 是Coyote协议处理接口，如果说EndPoint是用来实现TCP/IP协议的，那么Processor用来实现HTTP协议，Processor接收来自EndPoint的Socket，读取字节流解析成Tomcat Request和Response对象，并通过Adapter将其提交到容器处理，Processor是对应用层协议的抽象 |
| ProtocolHandler | Coyote协议接口，通过Endpoint和 Processor ，实现针对具体协议的处理能力。Tomcat按照协议和I/O提供了6个实现类︰AjpNioProtocol ，AjpAprProtocol, AjpNio2Protocol , Http11NioProtocol , Http11Nio2Protocol ,Http11AprProtocol |
| Adapter         | 由于协议不同，客户端发过来的请求信息也不尽相同，Tomcat定义了自己的Request类来封装这些请求信息。ProtocolHandler接口负责解析请求并生成Tomcat Request类。但是这个Request对象不是标准的ServletRequest，不能用Tomcat Request作为参数来调用容器。Tomcat设计者的解决方案是引入CoyoteAdapter，这是适配器模式的经典运用，连接器调用CoyoteAdapter的Sevice方法，传入的是Tomcat Request对象，CoyoteAdapter负责将Tomcat Request转成ServletAequest，再调用容器 |



<br/>



### 3. 容器组件Catalina

Tomcat模块分层结构图及Catalina的地位：

Tomcat是一个由一系列可配置的组件构成的Web容器，而Catalina是Tomcat的servlet容器。

从另一个角度来说，Tomcat 本质上就是一款Servlet容器，因为Catalina才是Tomcat 的核心，其他模块都是为Catalina提供支撑的。

比如︰通过Coyote模块提供链接通信，Jasper模块提供JSP引擎，Naming提供JNDI服务，Juli提供日志服务。

![](https://image.ventix.top/java/image-20220412094032906.png)



<br>



**Servlet容器Catalina的结构**：

![](https://image.ventix.top/java/image-20220421101830928.png)

一般可以认为整个Tomcat就是一个Catalina实例，Tomcat启动的时候会初始化这个实例，Catalina实例通过加载server.xml完成其他实例的创建，创建并管理（1个）Server，Server创建并管理多个服务，每个服务又可以有多个Connector和一个Container。



- Catalina

  负责解析Tomcat的配置文件，以此来创建服务器Server组件并进行管理

- Server

  服务器表示整个Catalina Servlet容器以及其它组件，负责组装并启动Servlaet引擎,Tomcat连接器。

  Server通过实现Lifecycle接口，提供了一种优雅的启动和关闭整个系统的方式

- service

  服务是Server内部的组件，一个Server包含多个Service。它将若干个Connector组件绑定到一个Container. 

- Container

  容器，负责处理用户的servlet请求，并返回对象给web用户的模块

<br>

**Container组件的具体结构**：

Container组件下有几种具体的组件，分别是 Engine、Host、Context和Wrapper。这4种组件（容器）是父子关系。

Tomcat通过一种分层的架构，使得Servlet容器具有很好的灵活性。

- Engine

  表示整个Catalina的Servlet引擎，用来管理多个虚拟站点，一个Service最多只能有一个Engine，但是一个引擎可包含多个Host

- Host

  代表一个虚拟主机，或者说一个站点，可以给Tomcat配置多个虚拟主机地址，而一个虚拟主机下可包含多个Context

- Context

  表示一个Web应用程序，一个Web应用可包含多个Wrapper

- Wrapper

  表示一个Servlet，Wrapper作为容器中的最底层，不能包含子容器上述组件的配置其实就体现在`conf/server.xml`中



<br>



### 4. 请求处理流程

Tomcat请求处理流程总结：

```bash

1. 浏览器地址栏输入网址，首先进行域名解析，其次进行TCP连接，发起HTTP请求

2. HTTP请求到达目标机器，HTTP请求报文会被监听8080端口号的Connector接收到，
   将其解析转换成request对象，同时还会提供一个response对象

3. Connector将这两个对象传给engine，engine进一步将这两个对象传给host

4. host会根据请求的资源路径，匹配一个Context应用（tomcat启动时，会将应用解析，形成映射关系），
   根据请求资源路径中的 `应用名`，去寻找应用，找到则将这两个对象进一步传给该应用

5. 该应用拿到有效路径，会将应用的路径和该路径进行拼接，形成硬盘上的绝对路径，再查找该文件是否存在，
   如果存在，则往response里面写入文件的数据，以及写入200状态码；
   如果文件不存在，则写入404状态码

6. 最终程序返回，最终Connector读取response里面的数据，生成HTTP响应报文

```



<br>



## 四 Tomcat源码剖析

### 1. 构建Tomcat源码

先去tomcat官网下载源码（这里选择的版本是8）

sourceCode下载 地址为：https://tomcat.apache.org/download-80.cgi

<br>



**Maven和Ant** —— 两种构建Tomcat源码的方式：

- 通过ant进行构建  （需要下载 1.9.8以上版本）

  下载 ant ：https://ant.apache.org/bindownload.cgi  （解压配置环境变量即可）

- 转换为maven的项目进行构建

<br>

下面主要介绍maven构建的方式：

1. 将源码导入idea中 并在根目录创建pom.xml 和catalina_home目录 

```xml

<?xml version="1.0" encoding="utf-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>org.apache.tomcat</groupId>
    <artifactId>apache-tomcat-8.5.50-src</artifactId>
    <name>Tomcat8.5</name>
    <version>8.5</version>
    <build>
        <!--指定源目录-->
        <finalName>Tomcat8.5</finalName>
        <sourceDirectory>java</sourceDirectory>
        <resources>
            <resource>
                <directory>java</directory>
            </resource>
        </resources>
        <plugins>
            <!--引入编译插件-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.1</version>
                <configuration>
                    <encoding>UTF-8</encoding>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
    <!--tomcat 依赖的基础包-->
    <dependencies>
        <dependency>
            <groupId>org.easymock</groupId>
            <artifactId>easymock</artifactId>
            <version>3.4</version>
        </dependency>
        <dependency>
            <groupId>ant</groupId>
            <artifactId>ant</artifactId>
            <version>1.7.0</version>
        </dependency>
        <dependency>
            <groupId>wsdl4j</groupId>
            <artifactId>wsdl4j</artifactId>
            <version>1.6.2</version>
        </dependency>
        <dependency>
            <groupId>javax.xml</groupId>
            <artifactId>jaxrpc</artifactId>
            <version>1.1</version>
        </dependency>
        <dependency>
            <groupId>org.eclipse.jdt.core.compiler</groupId>
            <artifactId>ecj</artifactId>
            <version>4.5.1</version>
        </dependency>
        <dependency>
            <groupId>javax.xml.soap</groupId>
            <artifactId>javax.xml.soap-api</artifactId>
            <version>1.4.0</version>
        </dependency>
    </dependencies>
</project>

```

再pom.xml文件上右击，选择 `add as maven project` ，转化为maven工程项目

<br>



2. 配置启动类、添加一些VM运行参数。主要是构建项目的目标路径 catalina-home相关内容

![](https://image.ventix.top/java/image-20220421194737923.png)

```bash

-Dcatalina.home=catalina-home
-Dcatalina.base=catalina-home
-Djava.endorsed.dirs=catalina-home/endorsed
-Djava.io.tmpdir=catalina-home/temp
-Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager
-Djava.util.logging.config.file=catalina-home/conf/logging.properties
-Dfile.encoding=UTF-8

```

同时将Tomcat项目的 webapps 和 conf 目录 复制到 catalina-home 目录下



<br>



3. 添加 JSP解析器初始化代码后，执行maven clean 、install

```java

// JSP解析器初始化 （org.apache.catalina.startup.ContextConfig类的configureStart() 方法下）

context.addServletContainerInitializer(new JasperInitializer(), null);

```

![](https://image.ventix.top/java/image-20220421194951023.png)

<br>

```bash

一些不必要的设置（可以减少一些项目启动报错信息）：

1. 修改： catalina-home/conf/catalina.properties  ( 添加 *.jar )

	tomcat.util.scan.StandardJarScanFilter.jarsToSkip=*.jar,\
	
2. 在 catalina-home 下新建一个 lib 目录

```

<br>

启动项目、访问 ：http://localhost:8080/



<br>



### 2. Tomcat启动流程









<br>





### 3. 请求处理机制分析


































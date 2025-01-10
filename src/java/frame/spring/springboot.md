---

order: 60
title:  SpringBoot
shortTitle: SpringBoot

---


## 一 SpringBoot Introduction



SpringBoot：https://spring.io/projects/spring-boot

Github：https://github.com/spring-projects/spring-boot 



### 1. 初识约定大于配置

约定优于配置（Convention over Configuration），又称按约定编程，是一种软件设计范式。

本质上是说：系统、类库或框架应该假定合理的默认值，而非要求提供不必要的配置。

比如说model中有一个名为User的类，那么数据库中对应的表就会默认命名为user。

只有在偏离这一个约定的时候，例如想要将该表命名为person，才需要写有关这个名字的配置。

比如平时架构师搭建项目就是限制软件开发随便写代码，制定出一套规范，让开发人员按统一的要求进行开发编码测试之类的，这样就加强了开发效率与审查代码效率。所以说写代码的时候就需要按要求命名，这样统一规范的代码就有良好的可读性与维护性了
约定优于配置简单来理解，就是遵循约定

<br>

```properties

spring优缺点分析
优点：
spring是Java企业版(Java Enterprise Edition，JEE，也称J2EE)的轻量级代替品。
无需开发重量级的Enterprise JavaBean(EJB)，Spring为企业级Java开发提供了一种相对简单的方法，通过依赖注入和面
向切面编程，用简单 的Java对象(Plain Old Java Object，POJO)实现了EJB的功能

缺点：
虽然Spring的组件代码是轻量级的，但它的配置却是重量级的。一开始，Spring用XML配置，而且是很多XML配置。
Spring 2.5引入了基于注解的组件扫描，这消除了大量针对应用程序自身组件的显式XML配置。
Spring 3.0引入了基于Java的配置，这是一种类型安全的可重构配置方式，可以代替XML。

所有这些配置都代表了开发时的损耗。因为在思考Spring特性配置和解决业务问题之间需要进行思维切换，所以编写配置挤占了编写应用程序逻辑的时间。和所有框架一样，Spring实用，但与此同时它要求的回报也不少。除此之外，项目的依赖管理也是一件耗时耗力的事情。在环境搭建时，需要分析要导入哪些库的坐标，而且还需要分析导入与之有依赖关系的其他库的坐标，一旦选错了依赖的版本，随之而来的不兼容问题就会严重阻碍项目的开发进度

```


SpringBoot对上述Spring的缺点进行的改善和优化，基于约定优于配置的思想，可以让开发人员不必在配置与逻辑 业务之间进行思维的切换，全身心的投入到逻辑业务的代码编写中，从而大大提高了开发的效率，一定程度上缩短 了项目周期

起步依赖
起步依赖本质上是一个Maven项目对象模型(Project Object Model，POM)，定义了对其他库的传递依赖，这些东西加在一起即支持某项功能。简单的说，起步依赖就是将具备某种功能的坐标打包到一起，并提供一些默认的功能。

自动配置
springboot的自动配置，指的是springboot，会自动将一些配置类的bean注册进ioc容器，我们可以需要的地方使用@autowired或者@resource等注解来使用它。“自动”的表现形式就是我们只需要引我们想用功能的包，相关的配置我们完全不用管, springboot会自动注入这些配置bean，我们直接使用这些bean即可

springboot: 简单、快速、方便地搭建项目；对主流开发框架的无配置集成；极大提高了开发、部署效率



<br>

### 2. Create Project

#### Spring Initializr

https://start.spring.io/

在官网上直接选择配置，搭建SpringBoot应用 → 下载zip压缩包 → 解压之后就是SpringBoot



<br>

#### CreateBy IDEA

![](https://image.ventix.top/java/image-20220504204948865.png)



<br>



### 3. SpringBoot版本号



第一个数字：主版本，有可能进行大的架构调整，各大版本之间并不一定兼容

第二个数字：次版本，在主版本架构不变的前提下，增加了一些新的特性或变化

第三个数字：增量版本，bug修复，细节的完善

M：       里程碑版本，测试版本，发布版本的前兆

RC：     候选发布版本，稳定版本，并不一定会发布

RELEASE：   发布版本，稳定版本，在项目中真正可用的版本

```bash

那版本号后面的英文代表什么含义呢？部分具体标签含义，如下所示：

Alpha：内测版

Beta：公开测试版

SNAPSHOT：快照版本，可以稳定使用，且该版本会一直进行小量的优化和改进

PRE：预览版，主要是用来内部开发人员和测试人员测试使用，因此不建议使用
M1（Mn）：M是milestone的缩写，也就是里程碑版本；
         milestone版本主要修复一些BUG和调整UI。一个GA后，一般有多个里程碑，例如 M1 M2 M3

RC：Release，该版本已经相当成熟了，基本上不存在导致错误的BUG，与即将发行的正式版相差无几。
RC1（RCn）：RC是release candidates的缩写，也就是发布预览版；
Release：正式版，也可能没有任何后缀也表示正式版

GA：General Availability,正式发布的版本，官方推荐使用该版本

```

<br>



### 4. 单元测试与热部署

Spring Boot对项目的单元测试提供了很好的支持，在使用时，需要提前在项目的pom.xml文件中添加spring-boot-starter-test测试依赖启动器，可以通过相关注解实现单元测试

```xml

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

```

注意：使用Spring Initializr方式搭建的Spring Boot项目，会自动加入spring-boot-starter-test测试依赖启动器，无需再手动添加

<br>

单元测试类和测试方法：
使用Spring Initializr方式搭建的Spring Boot项目，会在src.test.java测试目录下自动创建与项目主程序启动类对应的单元测试类

```java

@RunWith(SpringRunner.class) // 测试启动器，并加载Spring Boot测试注解
@SpringBootTest  // 标记为Spring Boot单元测试类，并加载项目的ApplicationContext上下文环境
class SpringbootDemoApplicationTests {
    @Autowired
    private DemoController demoController;
    
    // 自动创建的单元测试方法实例
    @Test
    void contextLoads() {
        String demo = demoController.demo();
        System.out.println(demo);
    }
}

```

<br>



**热部署**：在开发过程中，通常会对一段业务代码不断地修改测试，在修改之后往往需要重启服务，有些服务需要加载很久才能启动成功，这种不必要的重复操作极大的降低了程序开发效率。为此，SpringBoot框架专门提供了进行热部署的依赖启动器，用于进行项目热部署，而无需手动重启项目

在Spring Boot项目进行热部署测试之前，需要先在项目的pom.xml文件中添加spring-boot-devtools热部署依赖启动器:

```xml

<!-- 引入热部署依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>

```

添加热部署依赖后可能没有任何效果，还需要针对IDEA开发工具进行热部署相关的功能设置：

```bash

1. 选择IDEA工具界面的【File】->【Settings】选项，打开Compiler面板设置页面

    选择Build下的Compiler选项，在右侧勾选 `Build project automatically` 选项将项目设置为自动编译，

    单击【Apply】→【OK】按钮保存设置
    
2. 在项目任意页面中使用组合快捷键 `Ctrl+Shift+Alt+/`, 打开Maintenance选项框，选中并打开Registry页面

   列表中找到`compiler.automake.allow.when.app.running`，将该选项后的Value值勾选，用于指定IDEA工具
   
   在程序运行过程中自动编译，最后单击【Close】按钮完成设置
   
   
3. 某些版本的idea没有这个选项，设置好其他选项之后，按 ctrl+f9 也可以迅速编译，
   
   在IDEA右上角的启动项目配置选项中，设置下列两个选项即可

```

![](https://image.ventix.top/java/image-20220504145658244.png)



<br>



## 二 SpringBoot配置文件

SpringBoot应用程序<font color='red'>**默认会加载classpath路径下的application.properties**</font> . 



### 1. SpringMVC配置

引入依赖 `spring-boot-starter-web` , 直接开发@Controller就可以了



```bash

之前引入配置类:

- @ComponentScan(controller层)
- @EnableWebMvc
- implements WebMvcConfigurer


SpringBoot应用中

- @EnableWebMvc 或 @Configuration
	- @EnableWebMvc ：意味着全面接管SpringMVC的配置
	- @Configuration：意味着是配置的补充
- implements WebMvcConfigurer

```

<br>



#### 静态资源映射配置

```bash

## 静态资源映射

SpringBoot会帮我们做默认的静态资源映射:

默认的静态资源映射路径 `/**`, 默认的静态资源的位置 `classpath:/static/`

```

<br>

```properties

# ResourceHandler的mapping
spring.mvc.static-path-pattern=/pic/**

# ResourceHandler的location → spring.resources → spring.web.resources
spring.resources.static-locations=file:d:/tmp/

```

<br>

yaml格式的配置文件：

```yaml

spring:
  mvc:
    static-path-pattern: /**
  web:
    resources:
      static-locations: file:d:/tmp/

```

<br>



#### tomcat相关的配置

```properties

## tomcat的相关的配置

# 服务器的端口号：默认值8080 → server.port

# 应用名 → server.servlet.context-path  (contextPath → context-path)

server.port=8090

server.servlet.context-path=/demo

```

<br>



#### 日期转换相关配置

在接收参数时，根据 Content-Type 的不同，字符串转换为日期需要分别进行处理

```properties

# 一 当Content-Type 为 application/json 时
#    dispatcherServlet会使用jackson的MessageConvert，里面解析json的convert为jackson的配置

1. spring.jackson.date-format

2. 使用 `@JsonFormat` 注解   (优先级高)



# 二 当Content-Type 为 application/x-www-form-urlencoded（普通表单上传），
#    使用的是ModelAttributeMethodProcessor ，使用的是mvc自己的配置

1. spring.mvc.date-format   (优先级高)

2. 使用 @DatetimeFormat 注解

```

yaml配置文件：

```yaml

spring:
  mvc:
    date-format: yyyy-MM-dd HH:mm:ss
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8

```

需要注意的是 spring.jackson.date-format这种全局化配置对于java8中localDate和LocalDateTime是无效的，

但对于localDate和LocalDateTime，可以在类属性上通过注解设置转换规则



<br>



#### 自定义类型转换器

**Converter**：自定义的类型转换器，只需要将Converter注册为容器中的组件就生效，如下：

```java
@Component
public class String2DateConverter implements Converter<String, Date> {
    @Override
    public Date convert(String s) {
        try {
            return new SimpleDateFormat("yyyy-MM-dd").parse(s);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }
}

```



<br>



#### CharacterEncodingFilter

SpringMVC中有这样一个Filter专门处理编码问题的，它是`CharacterEncodingFilter`。

比如默认给response返回设定编码格式为：UTF-8，则可以通过配置CharacterEncodingFilter实现

SpringBoot对`CharacterEncodingFilter`也有支持，只需如下配置：

```properties

# 设置的编码，默认为：UTF-8
spring.http.encoding.charset=UTF-8
 
# 是否启用CharacterEncodingFilter，如果不配置也代表true
spring.http.encoding.enabled=true
 
# 是否强制设置请求和响应的编码格式为设置的编码格式
spring.http.encoding.force=
 
# 是否强制设置请求的编码格式为设置的编码格式
spring.http.encoding.force-request=
 
# 是否强制设置响应的编码格式为设置的编码格式
spring.http.encoding.force-response=

```

SpringBoot会自动配置CharacterEncodingFilter，默认字符集就是 UTF-8 ，一般情况下无需配置



<br>



### 2. MyBatis相关配置

- 引入依赖 `mybatis-spring-boot-starter` 

- 在配置文件中提供datasource， 配置 `spring.datasource.xxx` 
- 提供Mapper接口包目录的值，启动类添加： `@MapperScanner` 注解

```xml

<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.2.1</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>

```



<br>



#### 数据源和扫描包配置

配置 datasource 相关信息：

```properties

spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/spring?useUnicode=true&characterEncoding=utf-8
spring.datasource.username=root
spring.datasource.password=123456

mybatis.type-aliases-package=com.xxx.bean
#mybatis.configuration.lazy-loading-enabled=true

```



<br>



扫描包(这里特指mybatis的`mapper`)目录配置：

```java

@SpringBootApplication
@MapperScan("com.xxx.mapper")
public class Application {

    //SpringBoot应用程序的入口
    public static void main(String[] args) {
        //第一个参数：当前的类
        //第二个参数：当前main方法传入的参数
        SpringApplication.run(Application.class, args);
    }
}

```



<br>



#### 类型转换TypeHandler

TypeHandler 接口提供的方法，可以完成类型的转换



自定义实现TypeHandler的接口 的类（指定TypeHandler处理的转换类型）：

例：String 和 Integer[] 之间的转换：

```java

@MappedTypes(Integer[].class)
@MappedJdbcTypes(JdbcType.VARCHAR)
public class IntegerArrayTypeHandler implements TypeHandler<Integer[]> {

    ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * @param preparedStatement  jdbc的对象
     * @param index 预编译sql语句的占位符的序号 → ？的序号
     * @param integers 输入映射传入的值 → #{}写法提供的值
     * @throws SQLException
     */
    @SneakyThrows
    @Override
    public void setParameter(PreparedStatement preparedStatement, int index, Integer[] integers, JdbcType jdbcType) throws SQLException {
        // Integer[] → String
        //→ 将Integer[]转换成json字符串
        String value = objectMapper.writeValueAsString(integers);
        //序号为几，提供的值是什么
        preparedStatement.setString(index, value);
    }

    //先获得结果集中的查询结果
    //再将查询结果转换为指定类型
    @Override
    public Integer[] getResult(ResultSet resultSet, String columnName) throws SQLException {
        String result = resultSet.getString(columnName);
        return transfer(result);
    }

    @Override
    public Integer[] getResult(ResultSet resultSet, int index) throws SQLException {
        String result = resultSet.getString(index);
        return transfer(result);
    }

    @Override
    public Integer[] getResult(CallableStatement callableStatement, int index) throws SQLException {
        String result = callableStatement.getString(index);
        return transfer(result);
    }

    //使用jackson提供的方法完成字符串转换为Integer数组
    private Integer[] transfer(String result) {
        if (result == null || "".equals(result)) {
            return new Integer[0];
        }
        Integer[] integers = new Integer[0];
        try {
            integers = objectMapper.readValue(result, Integer[].class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return integers;
    }
}

```



<br>



### 3. SpringBoot常见问题

#### 扫描包目录配置

SpringBoot帮我们提供了<span style='color:red;font-size:文字大小;font-family:字体;'>**组件扫描包目录的配置 → 启动类所在的包目录**</span> . 

启动类所在的包目录是com.xxx那么SpringBoot应用的扫描包目录就是com.xxx

```java

// SpringBoot 默认省略了包扫描注解 
@ComponentScan("cn.itdrizzle")

```



<br>



#### 引入starter依赖

SpringBoot应用通常整合一个框架，通常是需要引入其starter依赖

- 名称上

  - 如果是SpringBoot官方提供的依赖 → spring-boot-starter-

    如：`spring-boot-starter`、`spring-boot-starter-web` . 

  - 如果是第三方提供的依赖 → xxx-spring-boot-starter

    如：`mybatis-spring-boot-starter` .

- 功能上

  - 会帮我们引入这个框架所必须的一些依赖



<br>



### 4. yml格式的配置文件

yml或yaml是一种新的配置文件的格式 → properties配置文件的平替，yml表达的也是 `key=value` 格式

yml配置文件的语法：

- 多级key的时候，properties会使用到点 `.`  →  yaml使用： `冒号、换行、（空格）缩进 ` 

  （缩进几格都行，但是要保证同一级对齐）

- properties的等于符号 = → yml中替换为 `冒号、一个空格`

-  如果有相同的前缀，可以省略，同一级的key要对齐 

```yaml

spring:
  mvc:
    static-path-pattern: /pic/**
  resources:
    static-locations: file:d:/tmp/
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/spring?useUnicode=true&characterEncoding=utf-8
    username: root
    password: 123456

server:
  port: 8090
  servlet:
    context-path: /demo

mybatis:
  type-aliases-package: com.xxx.bean

```



<br>



### 5. 多个配置文件

application主配置文件，SpringBoot应用启动的时候加载的application.properties或application.yml文件

application-xxx分配置文件，由application.properties或application.yml决定是否加载，加载哪一些



解耦 → 把不同功能的配置项放在不同的配置文件里

分流 → 区分不同环境下的相同配置



如何加载不同的application-xxx配置文件?

配置文件的名称：application-web → web、application-mybatis → mybatis



application主配置文件中通过分配置文件的名称来指定激活配置文件

```yaml

spring:
  profiles:
	# 需要的值的类型是List（数组或list提供值的方式是相同的）
    active: web, mybatis
    
# 换行、缩进 、减号、缩进    
spring:
  profiles:
    active: 
      - web
      - mybatis    
      
```



<br>



### 6. 配置文件中的提示

- 引入依赖
- re-run重新运行

```xml

<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-configuration-processor</artifactId>
	<optional>true</optional>
</dependency>

```



SpringBoot应用会做一件事情 → <span style='color:yellow;background:red;font-size:文字大小;font-family:字体;'>**classpath路径下新增一个/META-INF/spring-configuration-metadata.json**</span>



我们使用server.port 等key有提示，是因为autoconfigure依赖中的/META-INF/提供了<span style='color:yellow;background:red;font-size:文字大小;font-family:字体;'>**spring-configuration-metadata.json**</span>



如果你做好配置之后，重新运行了SpringBoot应用，还没有提示 → 在resources目录下新增一个文件夹/META-INF/

<br>



**参数组件中的默认值配置**：

spring-configuration-metadata.json文件提供的仅仅是提示，就相当于是一个说明书

示例：json文件里面写了下面的值

```json

{
  "name": "xxx.datasource.username",
  "type": "java.lang.String",
  "sourceType": "com.xxx.config.DatasourceProperties",
  "description": "name",
  "defaultValue": "zhangsan"
}

```

注意并不会配置上默认值、那么如何配置参数类中的默认值呢？

```java

@Data
@ConfigurationProperties(prefix = "xxx.datasource")
public class DatasourceProperties {
    //xxx.datasource.driver-class-name
    String driverClassName; // = "com.mysql.jdbc.Driver";
    String url; 
    String username = "zhangsan";  // = "root"; 配置参数类中的默认值:直接赋值
    String password;              // = "123456";

    String maxPool;
}

```



<br>



## 三 SpringBoot自动装配原理

### 1. 获得配置文件中的值

#### 使用@Value注解

现有如下的yml配置文件：

```yaml

spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/spring?useUnicode=true&characterEncoding=utf-8
    username: root
    password: 123456

```

<br>

下面使用配置文件中的属性，注册一个DataSource到容器中：

```java

@Configuration
public class DataSourceConfiguration {

    @Value("${spring.datasource.driver-class-name}")
    String driverClass; // = "com.mysql.jdbc.Driver";
    @Value("${spring.datasource.url}")
    String jdbcUrl; 
    @Value("${spring.datasource.username}")
    String username; // = "root";
    @Value("${spring.datasource.password}")
    String password; // = "123456";

    @Bean
    public DataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName(driverClass);
        dataSource.setUrl(jdbcUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }
}

```

但是这种方式给容器中组件的成员变量赋值的时候，key写的比较长，并且要给每一个成员变量都赋值，比较繁琐

<br>



#### ConfigurationProperties

改进方案：通过@ConfigurationProperties注解提供一个前缀，利用成员变量名（set）提供key的另外一部分，让其和SpringBoot配置文件中的key对应起来

```java

/**
 * @ConfigurationProperties注解的prefix属性值 + 成员变量名(set方法) = 配置文件中的key
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "spring.datasource")
public class DataSourceConfiguration {

    //spring.datasource.driver-class-name
    String driverClassName; // = "com.mysql.jdbc.Driver";
    String url;
    String username; // = "root";
    String password; // = "123456";

    @Bean
    public DataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName(driverClassName);
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }
}

```



<br>



#### EnableConfigurationProperties

@EnableConfigurationProperties要和@ConfigurationProperties注解搭配起来使用

@EnableConfigurationProperties注解的value属性值要写包含@ConfigurationProperties注解对应的类

```java

/**
 * 把来自于配置文件中的值全部都提取到单独的类中 → 由当前类的成员变量来获得对应的值
 * 参数类 → 类名 → xxxProperties
 */
@Data
@ConfigurationProperties(prefix = "spring.datasource")
public class DatasourceProperties {
    //spring.datasource.driver-class-name
    String driverClassName;   // = "com.mysql.jdbc.Driver";
    String url; 
    String username;          // = "root";
    String password;          // = "123456";
}

```

<br>

```java

/**
 * @ConfigurationProperties注解的prefix属性值 + 成员变量名(set方法) = 配置文件中的key
 */
@Configuration
@EnableConfigurationProperties(DatasourceProperties.class)
public class DataSourceConfiguration {

    /*@Autowired
    DatasourceProperties properties;*/

    DatasourceProperties properties;

    // 如果容器中的组件只包含一个有参构造方法，组件的实例化方式就会采用该有参构造方法
    // 形参 默认按照类型从容器中中取出组件
    public DataSourceConfiguration(DatasourceProperties properties) {
        this.properties = properties;
    }

    @Bean
    public DataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName(properties.getDriverClassName());
        dataSource.setUrl(properties.getUrl());
        dataSource.setUsername(properties.getUsername());
        dataSource.setPassword(properties.getPassword());
        return dataSource;
    }
}

```



<br>



### 2. 约定大于配置的原理

自动配置的原理

引入了starter依赖 → autoconfigure依赖 → 给我们提供大量的自动配置类

@SpringBootApplication → @EnableAutoConfiguration → 找到SpringBoot提供的自动配置类，并且让其生效



通过加载一个配置文件，获得所有的自动配置类的信息 

→ <font color='red'>**spring-boot-autoconfigure 依赖 /META-INF/spring.factories**</font> . 

```properties

org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration,\
org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration,\
org.springframework.boot.autoconfigure.batch.BatchAutoConfiguration,
# ......

```



<br>



#### 两类重要的注解★★

@ConditionalOnXXX → 满足XXX条件的时候其他的注解生效

@ConditionalOnClass → 当应用程序中包含了对应的类的时候生效

<br>

@ConditionalOnMissingXXX → 不满足XXX条件的时候其他的注解生效

<span style='color:yellow;background:red;font-size:文字大小;font-family:字体;'>**@ConditionalOnMissingBean**</span> → 当容器中没有对应的组件的时候生效



<span style='color:red;font-size:文字大小;font-family:字体;'>**自动配置类和自动配置里的配置生效是有条件**</span> . 



<br>



### 3. 分析几个自动配置类

DataSourceTransactionManagerAutoConfiguration

```java

@Configuration
// 应用程序中包含对应的类的时候生效 → 引入依赖
@ConditionalOnClass({JdbcTemplate.class, PlatformTransactionManager.class})
// 自动配置的顺序
@AutoConfigureOrder(2147483647)
// 向容器中注册value属性对应的类的组件
@EnableConfigurationProperties({DataSourceProperties.class})
public class DataSourceTransactionManagerAutoConfiguration {
    public DataSourceTransactionManagerAutoConfiguration() {
    }

    @Configuration
    //容器中这个类型的组件只有一个的时候生效
    @ConditionalOnSingleCandidate(DataSource.class)
    static class DataSourceTransactionManagerConfiguration {
        private final DataSource dataSource;
        private final TransactionManagerCustomizers transactionManagerCustomizers;

        //只提供了有参构造方法 → 形参从容器中按照类型取出组件
        DataSourceTransactionManagerConfiguration(DataSource dataSource, ObjectProvider<TransactionManagerCustomizers> transactionManagerCustomizers) {
            this.dataSource = dataSource;
            this.transactionManagerCustomizers = (TransactionManagerCustomizers)transactionManagerCustomizers.getIfAvailable();
        }

        @Bean
        // 容器中没有这个类型的组件的时候生效 → 组件约定大于配置
        //如果容器中没有PlatformTransactionManager组件，该@Bean注解则生效 → 容器中注册一个DataSourceTransactionManager组件（默认的组件）
        //如果容器中有PlatformTransactionManager组件，@Bean注解不会生效，就不会注册默认组件
        @ConditionalOnMissingBean({PlatformTransactionManager.class})
        public DataSourceTransactionManager transactionManager(DataSourceProperties properties) {
            DataSourceTransactionManager transactionManager = new DataSourceTransactionManager(this.dataSource);
            if (this.transactionManagerCustomizers != null) {
                this.transactionManagerCustomizers.customize(transactionManager);
            }

            return transactionManager;
        }
    }
}
@ConfigurationProperties(
    prefix = "spring.datasource"
)
public class DataSourceProperties implements BeanClassLoaderAware, InitializingBean {
    private ClassLoader classLoader;
    private String name;
    private boolean generateUniqueName;
    private Class<? extends DataSource> type;
    private String driverClassName;
    private String url;
    private String username;
    private String password;
}

```



<br>



MyBatis的自动配置类

autoconfigure/META-INF/spring.factories

```properties
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.mybatis.spring.boot.autoconfigure.MybatisLanguageDriverAutoConfiguration,\
org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration
```

```java
@Configuration
@ConditionalOnClass({SqlSessionFactory.class, SqlSessionFactoryBean.class})
@ConditionalOnSingleCandidate(DataSource.class)
@EnableConfigurationProperties({MybatisProperties.class})
@AutoConfigureAfter({DataSourceAutoConfiguration.class, MybatisLanguageDriverAutoConfiguration.class})
public class MybatisAutoConfiguration implements InitializingBean {
	@Bean
    @ConditionalOnMissingBean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
        factory.setDataSource(dataSource);
        return factory.getObject();
    }
}
```



<br>



解释一下为什么Converter只需要注册到容器中就会生效

```java

public void addFormatters(FormatterRegistry registry) {
    
    // 从容器中取出所有的实现了Converter接口的组件
    Iterator var2 = this.getBeansOfType(Converter.class).iterator();

    // 逐个注册类型转换器 （所以Converter只需要注册到容器中就会生效）
    while(var2.hasNext()) {
        Converter<?, ?> converter = (Converter)var2.next();
        registry.addConverter(converter);
    }

    var2 = this.getBeansOfType(GenericConverter.class).iterator();

    while(var2.hasNext()) {
        GenericConverter converter = (GenericConverter)var2.next();
        registry.addConverter(converter);
    }

    var2 = this.getBeansOfType(Formatter.class).iterator();

    while(var2.hasNext()) {
        Formatter<?> formatter = (Formatter)var2.next();
        registry.addFormatter(formatter);
    }
}

```

<br>



```java

beanFactory.getBeansOfType(Class<T>)

// 按照类型从容器中取出所有的组件  Map<String,T>
<T> Map<String, T> getBeansOfType(@Nullable Class<T> var1) throws BeansException;

```



<br>



## 四 SpringBoot应用实践

### 1. Hibernate Validator

官方文档：https://docs.jboss.org/hibernate/stable/validator/reference/en-US/html_single/



Hibernate Validator 的作用：

- 验证逻辑与业务逻辑之间进行了分离，降低了程序耦合度；
- 统一且规范的验证方式，无需你再次编写重复的验证代码；



引入依赖：

```xml

<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>7.0.4.Final</version>
</dependency>

```



注意：

**某些版本的`spring-boot-starter-web`包里面有`hibernate-validator`包，不需要再次引用hibernate validator依赖**. 



<br>



#### 请求参数校验配置

通常情况下，验证请求参数时，在 `@RequestBody DemoModel demo` 之间加注解 `@Valid`，然后后面加BindindResult即可；

多个参数的，可以加多个@Valid和BindingResult，如：

```java

@RequestMapping("/demo2")
public void demo2()(@RequestBody @Valid DemoModel demo, BindingResult result,
                    @RequestBody @Valid DemoModel demo2, BindingResult result2){
    if(result1.hasErrors()){
        for (ObjectError error : result.getAllErrors()) {
            System.out.println(error.getDefaultMessage());
        }
    }
    
    // ...
}

```

<br>



GET参数校验(@RequestParam参数校验)：

使用校验bean的方式，没有办法校验RequestParam的内容，处理Get请求(或参数比较少)的时候，例如下面的代码：

```java

@RequestMapping(value = "/demo3", method = RequestMethod.GET)
public void demo3(@RequestParam(name = "grade", required = true) int grade,
                  @RequestParam(name = "classroom", required = true) int classroom) {
    System.out.println(grade + "," + classroom);
}

```

此时使用@Valid注解，对RequestParam对应的参数进行注解，是无效的，

需要使用@Validated注解来使得验证生效。如下所示：



<br>



#### 快速失败返回模式

Hibernate Validator有以下两种验证模式：

```bash

1、普通模式（默认是这个模式）：会校验完所有的属性，然后返回所有的验证失败信息

2、快速失败返回模式 : 只要有一个验证失败，则返回
　　
```



true 快速失败返回模式  false 普通模式

```java

@Configuration
public class ValidatorConfiguration {
    @Bean
    public Validator validator(){
        ValidatorFactory validatorFactory = Validation.byProvider( HibernateValidator.class )
                .configure()
                .addProperty( "hibernate.validator.fail_fast", "true" )
                .buildValidatorFactory();
        Validator validator = validatorFactory.getValidator();

        return validator;
    }
}

```



两种验证模式配置方式参考官方文档：

https://docs.jboss.org/hibernate/stable/validator/reference/en-US/html_single/#section-provider-specific-settings



<br>



#### 注解使用示例



```java

import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Data
public class RegisterDTO {

    @NotBlank(message = "用户名不能为空")
    private String userName;

    @NotBlank(message = "密码不能为空")
    private String password;

    @NotBlank(message = "真实姓名不能为空")
    private String realName;

    @Range(min = 0, max = 99, message = "年龄应该在0到99之间")
    private Integer age;

    @Pattern(regexp = "男|女", message = "必须是男或女")
    private String sex;

    @Pattern(regexp = "\\d{3}-\\d{8}|\\d{4}-\\d{7}|\\d{11}", message = "号码不正确")
    private String telephone;

}

```





#### 配合统一异常处理










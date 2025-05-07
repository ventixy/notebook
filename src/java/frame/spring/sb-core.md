---

order: 61
title:  SpringBoot原理深入剖析
shortTitle: SpringBoot原理

---

## 一、自动装配原理

SpringBoot 的核心特性之一是自动装配（Auto-Configuration），它能够根据应用程序的依赖和配置自动配置 Spring 应用。

### 1. 自动装配的实现原理

自动装配的核心是通过 `@SpringBootApplication` 注解实现的，该注解是一个组合注解，包含了以下三个重要注解：

```java
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan
```

#### @SpringBootConfiguration

本质上是 `@Configuration` 注解的特殊形式，标识这是一个 Spring 配置类。

#### @ComponentScan

扫描被 `@Component`、`@Service`、`@Controller` 等注解标记的类并注册为 Spring Bean。默认扫描启动类所在包及其子包。

#### @EnableAutoConfiguration

这是实现自动装配的核心注解，它由以下两部分组成：

- **@AutoConfigurationPackage**：将启动类所在包及其子包下的组件注册到容器中
- **@Import(AutoConfigurationImportSelector.class)**：导入自动配置类

### 2. 自动装配的执行流程

1. **获取候选配置类**：`AutoConfigurationImportSelector` 通过 `SpringFactoriesLoader` 加载 `META-INF/spring.factories` 文件中的配置类

2. **过滤不符合条件的配置类**：根据 `@ConditionalOnXXX` 注解判断是否需要加载特定的配置类

3. **将符合条件的配置类注册到 Spring 容器**

```java
List<String> configurations = SpringFactoriesLoader.loadFactoryNames(
    EnableAutoConfiguration.class, classLoader);
```

### 3. 条件化装配

SpringBoot 提供了多种条件注解，用于控制 Bean 的装配条件：

- **@ConditionalOnClass**：当类路径下存在指定类时，配置生效
- **@ConditionalOnMissingClass**：当类路径下不存在指定类时，配置生效
- **@ConditionalOnBean**：当容器中存在指定 Bean 时，配置生效
- **@ConditionalOnMissingBean**：当容器中不存在指定 Bean 时，配置生效
- **@ConditionalOnProperty**：当配置文件中存在指定属性时，配置生效
- **@ConditionalOnWebApplication**：当应用是 Web 应用时，配置生效

### 4. 自定义自动装配

创建自定义自动装配的步骤：

1. **创建配置类**：使用 `@Configuration` 和条件注解

```java
@Configuration
@ConditionalOnClass(DataSource.class)
public class MyAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

2. **创建 `META-INF/spring.factories` 文件**：

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.example.MyAutoConfiguration
```

3. **打包为 starter**：创建一个独立的模块，包含自动配置类和必要的依赖

## 二、SpringBoot 启动流程

### 1. 启动流程概述

SpringBoot 应用启动的入口是 `SpringApplication.run()` 方法，整个启动流程可以分为以下几个阶段：

```java
public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
}
```

### 2. SpringApplication 的初始化

在调用 `run()` 方法之前，`SpringApplication` 的构造方法会执行以下操作：

1. **推断应用类型**：判断是否为 Web 应用（Servlet/Reactive）
2. **加载 ApplicationContextInitializer**：从 `spring.factories` 中加载
3. **加载 ApplicationListener**：从 `spring.factories` 中加载
4. **推断主类**：通过分析调用栈确定主配置类

### 3. run() 方法执行流程

`run()` 方法是启动 SpringBoot 应用的核心，其执行流程如下：

1. **创建 StopWatch**：用于记录启动耗时

2. **创建 SpringApplicationRunListeners**：用于在启动过程中广播事件

3. **准备环境（prepareEnvironment）**：
   - 创建并配置环境对象（StandardEnvironment）
   - 加载属性源（PropertySource）
   - 绑定环境变量

4. **打印 Banner**：输出 SpringBoot 的 Banner

5. **创建 ApplicationContext**：根据应用类型创建对应的 ApplicationContext

6. **准备 ApplicationContext（prepareContext）**：
   - 设置环境对象
   - 执行 ApplicationContextInitializer
   - 加载主配置类

7. **刷新 ApplicationContext（refreshContext）**：
   - 注册 BeanPostProcessor
   - 注册单例 Bean
   - 启动内嵌 Web 服务器

8. **执行 ApplicationRunner 和 CommandLineRunner**：
   - 执行自定义的启动任务

### 4. 启动生命周期事件

SpringBoot 在启动过程中会发布一系列事件：

- **ApplicationStartingEvent**：应用启动开始
- **ApplicationEnvironmentPreparedEvent**：环境准备完成
- **ApplicationContextInitializedEvent**：ApplicationContext 初始化完成
- **ApplicationPreparedEvent**：ApplicationContext 加载完成，但未刷新
- **ApplicationStartedEvent**：ApplicationContext 刷新完成
- **ApplicationReadyEvent**：应用准备就绪
- **ApplicationFailedEvent**：启动失败

## 三、嵌入式 Web 容器

### 1. 嵌入式容器的类型

SpringBoot 支持多种嵌入式 Web 容器：

- **Servlet 容器**：Tomcat、Jetty、Undertow
- **Reactive 容器**：Netty（WebFlux）

### 2. 嵌入式容器的自动配置

SpringBoot 根据应用类型和依赖自动配置嵌入式容器：

- **ServletWebServerFactoryAutoConfiguration**：配置 Servlet 容器
- **ReactiveWebServerFactoryAutoConfiguration**：配置 Reactive 容器

### 3. 嵌入式 Servlet 容器的工作原理

1. **容器的创建与启动**：

```java
// 在 ApplicationContext 刷新阶段
public void refresh() {
    // ...
    onRefresh();  // 创建并启动 Web 服务器
    // ...
}
```

2. **ServletWebServerFactory**：

根据条件自动选择合适的工厂实现：

- TomcatServletWebServerFactory
- JettyServletWebServerFactory
- UndertowServletWebServerFactory

3. **自定义嵌入式容器**：

```java
@Bean
public ConfigurableServletWebServerFactory webServerFactory() {
    TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
    factory.setPort(9000);
    factory.addConnectorCustomizers((connector) -> {
        connector.setMaxPostSize(1000000);
    });
    return factory;
}
```

### 4. 切换嵌入式容器

默认情况下，SpringBoot 使用 Tomcat 作为嵌入式容器。可以通过修改依赖切换到其他容器：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <!-- 排除 Tomcat -->
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<!-- 使用 Undertow -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```

## 四、外部化配置原理

### 1. 配置加载顺序

SpringBoot 按照优先级从高到低加载配置：

1. **命令行参数**
2. **Java 系统属性（System.getProperties()）**
3. **操作系统环境变量**
4. **application-{profile}.properties/yml**
5. **application.properties/yml**
6. **@PropertySource 注解指定的配置**
7. **默认属性**

### 2. 配置属性绑定原理

#### @ConfigurationProperties 原理

1. **注册 ConfigurationPropertiesBindingPostProcessor**：
   - 由 `@EnableConfigurationProperties` 触发注册

2. **绑定过程**：
   - 使用 `Binder` 将外部配置绑定到 Java Bean
   - 支持松散绑定（驼峰、短横线、下划线等命名方式）
   - 支持类型转换

```java
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private int timeout;
    // getters and setters
}
```

### 3. 配置文件加载机制

SpringBoot 使用 `PropertySourceLoader` 接口的实现类加载配置文件：

- **PropertiesPropertySourceLoader**：加载 `.properties` 文件
- **YamlPropertySourceLoader**：加载 `.yml` 和 `.yaml` 文件

配置文件的搜索路径（按优先级排序）：

1. **file:./config/**
2. **file:./**
3. **classpath:/config/**
4. **classpath:/**

## 五、Spring Boot Actuator

### 1. Actuator 简介

Spring Boot Actuator 是 SpringBoot 的一个子项目，提供了对应用的监控和管理功能。

### 2. 主要功能

- **端点（Endpoints）**：提供应用的各种信息
- **度量（Metrics）**：收集应用运行时的指标
- **审计（Auditing）**：记录安全事件
- **HTTP 追踪**：记录 HTTP 请求的信息

### 3. 常用端点

- **/actuator/health**：应用健康状况
- **/actuator/info**：应用信息
- **/actuator/metrics**：应用指标
- **/actuator/env**：环境变量
- **/actuator/beans**：Spring Bean 信息
- **/actuator/mappings**：请求映射信息
- **/actuator/configprops**：配置属性信息

### 4. 自定义端点

```java
@Component
@Endpoint(id = "myEndpoint")
public class MyEndpoint {
    
    @ReadOperation
    public Map<String, Object> info() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "My Custom Endpoint");
        info.put("timestamp", System.currentTimeMillis());
        return info;
    }
    
    @WriteOperation
    public void update(@Selector String name, String value) {
        // 处理写操作
    }
}
```

## 六、Spring Boot 与 Spring MVC

### 1. 自动配置原理

SpringBoot 通过 `WebMvcAutoConfiguration` 自动配置 Spring MVC：

- 自动配置 `DispatcherServlet`
- 自动配置 `ViewResolver`
- 自动配置静态资源处理
- 自动配置 `Converter`、`Formatter`
- 自动配置 `HttpMessageConverter`

### 2. 扩展 Spring MVC 配置

两种方式扩展 Spring MVC 配置：

#### 保留自动配置，添加额外配置

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new MyInterceptor());
    }
    
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatter(new MyFormatter());
    }
}
```

#### 完全接管 Spring MVC 配置

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    // 完全自定义 MVC 配置
}
```

### 3. 内容协商

SpringBoot 自动配置了内容协商机制，支持多种媒体类型：

- 基于请求的 Accept 头
- 基于 URL 的后缀（默认禁用）
- 基于请求参数（默认禁用）

```yaml
spring:
  mvc:
    contentnegotiation:
      favor-parameter: true
      parameter-name: format
```

## 七、Spring Boot 与数据访问

### 1. 数据源自动配置

SpringBoot 通过 `DataSourceAutoConfiguration` 自动配置数据源：

- 根据依赖自动选择数据源类型（HikariCP、Tomcat JDBC、Commons DBCP2）
- 根据配置文件配置数据源属性

### 2. 事务管理自动配置

`DataSourceTransactionManagerAutoConfiguration` 自动配置事务管理器：

```java
@Configuration
@ConditionalOnClass({ JdbcTemplate.class, PlatformTransactionManager.class })
public class DataSourceTransactionManagerAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean(PlatformTransactionManager.class)
    public DataSourceTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
```

### 3. JPA 自动配置

`HibernateJpaAutoConfiguration` 自动配置 JPA：

- 自动配置 `EntityManagerFactory`
- 自动配置 `JpaTransactionManager`
- 自动配置 `JpaVendorAdapter`

### 4. MyBatis 自动配置

`MybatisAutoConfiguration` 自动配置 MyBatis：

```java
@Configuration
@ConditionalOnClass({ SqlSessionFactory.class, SqlSessionFactoryBean.class })
@ConditionalOnSingleCandidate(DataSource.class)
@EnableConfigurationProperties(MybatisProperties.class)
public class MybatisAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
        factory.setDataSource(dataSource);
        return factory.getObject();
    }
}
```

## 八、Spring Boot 应用打包与运行

### 1. 可执行 JAR 的原理

SpringBoot 使用 `spring-boot-maven-plugin` 或 `spring-boot-gradle-plugin` 创建可执行 JAR：

- **Fat JAR**：包含应用及其所有依赖
- **嵌套 JAR 结构**：特殊的 JAR 文件格式，允许嵌套 JAR

### 2. JAR 文件结构

```
my-app.jar
 ├── META-INF
 │   └── MANIFEST.MF
 ├── org/springframework/boot/loader/...
 ├── BOOT-INF
 │   ├── classes/  # 应用类
 │   └── lib/      # 依赖 JAR
 └── ...
```

### 3. 启动流程

1. **JarLauncher**：
   - 从 `MANIFEST.MF` 中读取 `Main-Class`（默认为 `JarLauncher`）
   - 从 `MANIFEST.MF` 中读取 `Start-Class`（应用的主类）

2. **类加载**：
   - 使用自定义的 `LaunchedURLClassLoader` 加载类
   - 支持从嵌套 JAR 中加载类

3. **启动应用**：
   - 调用应用主类的 `main` 方法

### 4. 部署方式

- **独立应用**：直接运行 JAR 文件
- **云平台**：部署到 Cloud Foundry、Heroku 等
- **Docker 容器**：创建 Docker 镜像运行
- **传统 WAR**：部署到外部 Servlet 容器

```java
public class ServletInitializer extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }
}
```


---

order: 60
title:  SpringBoot

---



## SpringBoot基础

### 基本概念
- **什么是 Spring Boot？**
  - Spring Boot 是由Pivotal团队提供的全新框架，旨在简化Spring应用的初始搭建以及开发过程。它通过“约定优于配置”的理念，大大减少了配置的工作量。
- **Spring Boot 的核心特性有哪些？**
  - 核心特性包括：
    - **自动配置**：自动配置Spring应用，减少配置文件的编写。
    - **起步依赖**：通过starter简化依赖管理。
    - **内嵌服务器**：内置Tomcat、Jetty或Undertow服务器，无需部署WAR文件。
    - **生产就绪**：提供健康检查、监控等功能。
    - **外部化配置**：支持从外部配置文件中读取配置。
    - **无XML配置**：默认使用Java配置，减少XML配置文件的使用。

### 启动流程
- **说说 Springboot 的启动流程？**
  - Spring Boot的启动流程主要包括以下几个步骤：
    1. **加载主配置类**：通过`@SpringBootApplication`注解启动Spring Boot应用。
    2. **创建SpringApplication对象**：创建`SpringApplication`对象，该对象负责应用的启动。
    3. **初始化上下文**：根据不同的Web环境（如Servlet、Reactive等）初始化不同的ApplicationContext。
    4. **加载配置文件**：加载application.properties或application.yml等配置文件。
    5. **启动嵌入式Web服务器**：如果应用是Web应用，启动嵌入式Web服务器（如Tomcat）。
    6. **启动应用**：调用`run`方法启动应用，执行所有`CommandLineRunner`和`ApplicationRunner`的回调方法。
    7. **完成启动**：应用启动完成，开始接收请求。

### 自动配置
- **SpringBoot 是如何实现自动配置的？**
  - Spring Boot通过`@EnableAutoConfiguration`注解实现自动配置。该注解会扫描类路径中的自动配置类（通常是`META-INF/spring.factories`文件中定义的类），并根据条件（如类路径中是否存在某个类）自动应用相应的配置。

### 内嵌Web容器
- **Spring Boot 支持哪些嵌入 Web 容器？**
  - Spring Boot支持多种嵌入式Web容器，包括：
    - **Tomcat**：默认使用的容器。
    - **Jetty**：轻量级的容器。
    - **Undertow**：高性能的容器。

### 配置文件
- **Spring Boot 中 application.properties 和 application.yml 的区别是什么？**
  - **application.properties**：使用键值对的形式配置，格式简单。
  - **application.yml**：使用YAML格式，支持嵌套结构，配置更加清晰。
- **Spring Boot 配置文件加载优先级你知道吗？**
  - Spring Boot配置文件的加载优先级如下：
    1. 命令行参数
    2. `SPRING_APPLICATION_JSON`环境变量中的属性
    3. ServletContext初始化参数
    4. JNDI属性
    5. Java系统属性
    6. 操作系统环境变量
    7. `random.*`属性（仅限`application.properties`或`application.yml`）
    8. 包含在jar包内的配置文件（如`application.properties`或`application.yml`）
    9. 包含在jar包外的配置文件（如`application.properties`或`application.yml`）

### 自定义配置
- **如何在 Spring Boot 中定义和读取自定义配置？**
  - 定义自定义配置：
    ```yaml
    myapp:
      name: MyApp
      version: 1.0.0
    ```
  - 读取自定义配置：
    ```java
    @ConfigurationProperties(prefix = "myapp")
    public class MyAppConfig {
        private String name;
        private String version;

        // getters and setters
    }
    ```

## SpringBoot高级功能

### 跨域请求
- **Spring Boot 如何处理跨域请求（CORS）？**
  - 可以通过配置全局CORS或在特定Controller上配置CORS来处理跨域请求。
  - 全局配置：
    ```java
    @Configuration
    public class CorsConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("*")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*");
        }
    }
    ```
  - 特定Controller配置：
    ```java
    @RestController
    @CrossOrigin(origins = "http://example.com")
    public class MyController {
        // ...
    }
    ```

### 拦截器
- **在 Spring Boot 中你是怎么使用拦截器的？**
  - 定义拦截器：
    ```java
    public class MyInterceptor implements HandlerInterceptor {
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            // 前置处理
            return true;
        }

        @Override
        public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
            // 后置处理
        }

        @Override
        public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
            // 完成处理
        }
    }
    ```
  - 注册拦截器：
    ```java
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addInterceptors(InterceptorRegistry registry) {
            registry.addInterceptor(new MyInterceptor())
                    .addPathPatterns("/api/**")
                    .excludePathPatterns("/api/exclude");
        }
    }
    ```

### 定时任务
- **SpringBoot 中如何实现定时任务 ?**
  - 使用`@Scheduled`注解实现定时任务：
    ```java
    @SpringBootApplication
    public class MyApplication {
        public static void main(String[] args) {
            SpringApplication.run(MyApplication.class, args);
        }

        @Scheduled(fixedRate = 5000)
        public void scheduledTask() {
            System.out.println("定时任务执行了");
        }
    }
    ```

### 多数据源配置
- **在 Spring Boot 中如何实现多数据源配置？**
  - 定义数据源配置：
    ```java
    @Configuration
    public class DataSourceConfig {
        @Bean(name = "dataSource1")
        @ConfigurationProperties(prefix = "spring.datasource1")
        public DataSource dataSource1() {
            return DataSourceBuilder.create().build();
        }

        @Bean(name = "dataSource2")
        @ConfigurationProperties(prefix = "spring.datasource2")
        public DataSource dataSource2() {
            return DataSourceBuilder.create().build();
        }
    }
    ```
  - 使用数据源：
    ```java
    @Service
    public class MyService {
        @Autowired
        @Qualifier("dataSource1")
        private DataSource dataSource1;

        @Autowired
        @Qualifier("dataSource2")
        private DataSource dataSource2;

        // 使用数据源的方法
    }
    ```

### 异步处理
- **Spring Boot 中如何实现异步处理？**
  - 使用`@Async`注解实现异步方法：
    ```java
    @SpringBootApplication
    @EnableAsync
    public class MyApplication {
        public static void main(String[] args) {
            SpringApplication.run(MyApplication.class, args);
        }

        @Async
        public void asyncMethod() {
            System.out.println("异步方法执行了");
        }
    }
    ```

### 启动时执行代码
- **如何在 SpringBoot 启动时执行特定代码？有哪些方式？**
  - 使用`CommandLineRunner`或`ApplicationRunner`接口：
    ```java
    @Component
    public class StartupRunner implements CommandLineRunner {
        @Override
        public void run(String... args) throws Exception {
            System.out.println("应用启动时执行的代码");
        }
    }
    ```
  - 使用`@PostConstruct`注解：
    ```java
    @Component
    public class MyComponent {
        @PostConstruct
        public void init() {
            System.out.println("应用启动时执行的代码");
        }
    }
    ```


### Spring Actuator
- **什么是 Spring Actuator？它有什么优势？**
  - **Spring Actuator**是Spring Boot提供的生产就绪功能，用于监控和管理应用。它提供了许多端点（endpoints），如健康检查、指标收集、环境信息等。
  - **优势**：
    - **健康检查**：提供应用的健康状况信息。
    - **指标收集**：收集应用的性能指标。
    - **环境信息**：提供应用的环境变量信息。
    - **审计支持**：记录应用的操作日志。
    - **远程管理**：通过HTTP或JMX远程管理应用。


### 事件机制

- **说说你对 Spring Boot 事件机制的了解？**
  - **事件机制**：Spring Boot提供了事件机制，用于在应用的生命周期中触发和监听事件。
  - **事件类型**：
    - **ApplicationStartedEvent**：应用启动完成后触发。
    - **ApplicationReadyEvent**：应用准备好接收请求时触发。
    - **ApplicationFailedEvent**：应用启动失败时触发。
  - **使用示例**：
    ```java
    @Component
    public class EventListener {

        @EventListener
        public void handleApplicationReady(ApplicationReadyEvent event) {
            System.out.println("应用已经准备好");
        }

        @EventListener
        public void handleApplicationFailed(ApplicationFailedEvent event) {
            System.out.println("应用启动失败");
        }
    }
    ```



## SpringBoot版本改进

- **Spring Boot 2.x 与 1.x 版本有哪些主要的改进和区别？**
  - **主要改进**：
    - **性能提升**：启动速度和内存占用有所优化。
    - **依赖更新**：升级了Spring Framework和其他依赖库的版本。
    - **自动配置改进**：增强了自动配置的功能和灵活性。
    - **Actuator改进**：增加了更多的监控端点和安全性设置。
    - **WebFlux支持**：引入了响应式编程模型。
  - **主要区别**：
    - **兼容性**：2.x版本可能不完全兼容1.x版本的某些配置和API。
    - **配置文件**：2.x版本对配置文件的格式和选项进行了调整。

- **Spring Boot 3.x 与 2.x 版本有哪些主要的改进和区别？**
  - **主要改进**：
    - **Java 17支持**：3.x版本要求使用Java 17或更高版本。
    - **Spring Framework 6.x**：依赖于Spring Framework 6.x版本。
    - **Jakarta EE 9迁移**：从Java EE迁移到Jakarta EE 9。
    - **性能优化**：进一步优化启动速度和内存使用。
    - **安全性增强**：加强了安全性和默认的安全配置。
  - **主要区别**：
    - **兼容性**：3.x版本可能不完全兼容2.x版本的某些配置和API。
    - **依赖更新**：3.x版本依赖的库版本更高，可能需要更新依赖。




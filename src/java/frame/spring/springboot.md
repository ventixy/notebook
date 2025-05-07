---

order: 60
title:  SpringBoot
shortTitle: SpringBoot

---

## 一、SpringBoot 简介

SpringBoot 是 Spring 生态系统中的一个框架，旨在简化 Spring 应用的初始搭建和开发过程。它采用了**约定优于配置**的理念，大量减少了开发者的配置工作。

### 1. 核心特性

- **起步依赖**：将具备某种功能的坐标打包到一起，简化依赖管理
- **自动配置**：根据类路径中的依赖自动配置 Spring 应用
- **内嵌服务器**：内置 Tomcat、Jetty 或 Undertow，无需部署 WAR 文件
- **Actuator**：提供生产级别的监控和管理功能

### 2. 优势对比

**Spring 的优缺点：**

- **优点**：Spring 是 Java 企业版的轻量级替代品，通过依赖注入和面向切面编程，用简单的 POJO 实现了 EJB 的功能
- **缺点**：配置繁琐，依赖管理复杂，开发效率较低

**SpringBoot 的改进：**

- 简化配置，专注于业务逻辑
- 提供自动化的依赖管理
- 内嵌服务器，简化部署
- 提供生产就绪的监控工具

## 二、创建 SpringBoot 项目

### 1. 使用 Spring Initializr

访问 [https://start.spring.io/](https://start.spring.io/)，选择项目配置：

1. 选择构建工具（Maven/Gradle）
2. 选择语言（Java/Kotlin/Groovy）
3. 选择 Spring Boot 版本
4. 填写项目元数据（Group、Artifact 等）
5. 选择依赖
6. 生成并下载项目

### 2. 使用 IDE 创建

以 IntelliJ IDEA 为例：

1. 选择 File → New → Project
2. 选择 Spring Initializr
3. 配置项目信息
4. 选择依赖
5. 完成创建

### 3. SpringBoot 版本号说明

- **第一个数字**：主版本，可能有架构调整，各大版本间不一定兼容
- **第二个数字**：次版本，在主版本架构不变的前提下，增加新特性
- **第三个数字**：增量版本，bug 修复和细节完善

**版本标识含义：**

- **SNAPSHOT**：快照版本，持续更新
- **M1, M2**：里程碑版本
- **RC**：候选发布版本
- **RELEASE/GA**：正式发布版本

## 三、SpringBoot 配置文件

### 1. 配置文件类型

SpringBoot 支持两种格式的配置文件，默认位于 `src/main/resources` 目录下：

- **application.properties**：使用键值对方式配置
- **application.yml/application.yaml**：使用 YAML 格式配置，结构更清晰

### 2. YAML 配置格式

YAML 是一种人类可读的数据序列化语言，相比 properties 文件，具有更好的结构性：

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/db?useSSL=false
    username: root
    password: 123456
  
server:
  port: 8080
  servlet:
    context-path: /api
```

相当于 properties 格式的：

```properties
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/db?useSSL=false
spring.datasource.username=root
spring.datasource.password=123456
server.port=8080
server.servlet.context-path=/api
```

### 3. 多环境配置

SpringBoot 支持通过 profile 机制实现多环境配置：

1. **创建多个配置文件**：
   - `application-dev.yml`：开发环境
   - `application-test.yml`：测试环境
   - `application-prod.yml`：生产环境

2. **在主配置文件中激活**：

```yaml
spring:
  profiles:
    active: dev  # 激活开发环境配置
```

也可以通过命令行参数激活：

```bash
java -jar app.jar --spring.profiles.active=prod
```

### 4. 配置属性绑定

#### 使用 @Value 注解

```java
@Component
public class DatabaseConfig {
    @Value("${spring.datasource.url}")
    private String url;
    
    @Value("${spring.datasource.username}")
    private String username;
    
    // getter 和 setter
}
```

#### 使用 @ConfigurationProperties

```java
@Component
@ConfigurationProperties(prefix = "spring.datasource")
public class DatabaseProperties {
    private String url;
    private String username;
    private String password;
    
    // getter 和 setter
}
```

#### 使用 @EnableConfigurationProperties

```java
@Configuration
@EnableConfigurationProperties(DatabaseProperties.class)
public class DatabaseConfig {
    private final DatabaseProperties properties;
    
    public DatabaseConfig(DatabaseProperties properties) {
        this.properties = properties;
    }
    
    @Bean
    public DataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUrl(properties.getUrl());
        dataSource.setUsername(properties.getUsername());
        dataSource.setPassword(properties.getPassword());
        return dataSource;
    }
}
```

### 5. 配置提示

添加以下依赖可以在 IDE 中获得配置属性的自动提示：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

## 四、Web 开发

### 1. 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 2. 创建 Controller

```java
@RestController
@RequestMapping("/api")
public class UserController {
    
    @GetMapping("/users")
    public List<User> getUsers() {
        // 返回用户列表
        return userService.findAll();
    }
    
    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        // 创建用户
        return userService.save(user);
    }
}
```

### 3. 静态资源配置

SpringBoot 默认将静态资源放在以下路径：

- `/static`
- `/public`
- `/resources`
- `/META-INF/resources`

可以通过配置文件自定义静态资源路径：

```yaml
spring:
  mvc:
    static-path-pattern: /resources/**  # 访问路径
  web:
    resources:
      static-locations: classpath:/custom/  # 资源位置
```

### 4. 拦截器配置

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LogInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/login", "/static/**");
    }
}
```

### 5. 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        ErrorResponse error = new ErrorResponse("服务器内部错误", e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e) {
        ErrorResponse error = new ErrorResponse("资源不存在", e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
```

## 五、数据库集成

### 1. 整合 MyBatis

#### 引入依赖

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.2.2</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

#### 配置数据源

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/db?useSSL=false&characterEncoding=utf-8
    username: root
    password: 123456

mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.domain
  configuration:
    map-underscore-to-camel-case: true
```

#### 创建 Mapper 接口

```java
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(Long id);
    
    @Insert("INSERT INTO user(name, email) VALUES(#{name}, #{email})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
}
```

#### 在启动类中添加 Mapper 扫描

```java
@SpringBootApplication
@MapperScan("com.example.mapper")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 2. 整合 JPA

#### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

#### 配置数据源和 JPA

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/db?useSSL=false
    username: root
    password: 123456
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL5InnoDBDialect
```

#### 创建实体类

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    
    // getter 和 setter
}
```

#### 创建 Repository

```java
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByName(String name);
    
    @Query("SELECT u FROM User u WHERE u.email LIKE %:email%")
    List<User> findByEmailContaining(@Param("email") String email);
}
```

## 六、单元测试与热部署

### 1. 单元测试

#### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

#### 编写测试类

```java
@SpringBootTest
class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
    @Test
    void testFindById() {
        User user = userService.findById(1L);
        assertNotNull(user);
        assertEquals("张三", user.getName());
    }
    
    @Test
    void testSave() {
        User user = new User();
        user.setName("李四");
        user.setEmail("lisi@example.com");
        
        User savedUser = userService.save(user);
        assertNotNull(savedUser.getId());
    }
}
```

### 2. 热部署

#### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

#### IDEA 配置

1. 开启自动编译：Settings → Build, Execution, Deployment → Compiler → 勾选 "Build project automatically"

2. 开启运行时自动编译：按 Ctrl+Shift+Alt+/ → 选择 Registry → 勾选 "compiler.automake.allow.when.app.running"

3. 修改启动配置：Edit Configurations → 勾选 "On update action: Update classes and resources" 和 "On frame deactivation: Update classes and resources"

## 七、打包与部署

### 1. 打包

使用 Maven 打包：

```bash
mvn clean package
```

生成的 JAR 文件位于 target 目录下。

### 2. 运行

```bash
java -jar target/myapp-0.0.1-SNAPSHOT.jar
```

### 3. 自定义配置

可以通过命令行参数覆盖配置：

```bash
java -jar myapp.jar --server.port=9090 --spring.profiles.active=prod
```

### 4. 部署为 WAR

1. 修改 pom.xml：

```xml
<packaging>war</packaging>

<dependencies>
    <!-- 添加 Servlet API 依赖 -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

2. 继承 SpringBootServletInitializer：

```java
public class ServletInitializer extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }
}
```

3. 打包并部署到 Servlet 容器：

```bash
mvn clean package
```

将生成的 WAR 文件部署到 Tomcat、Jetty 等 Servlet 容器中。










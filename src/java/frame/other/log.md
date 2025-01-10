---

order: 10
title:  单元测试与日志管理

---



## 代码单元测试

单元测试是通过编写自动化测试代码来验证软件中最小可测试单元（如函数或方法）的正确性，确保每个单元在各种情况下都能按预期工作，从而提高软件质量和可维护性。

### Junit单元测试

1. Maven 依赖

在 `pom.xml` 文件中添加 JUnit 依赖：

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
    <scope>test</scope>
</dependency>
```

2. 类名和方法规范

::: tip 单元测试注意事项
- **类名规范**：测试类的类名以 `Test` 结尾，例如 `UserTest`、`EmployeeTest`。
- **方法名规范**：测试方法名以 `test` 开头，例如 `testSelectUserById`。
- **方法签名**：测试方法不能有参数，返回值必须是 `void`，并且必须是 `public` 修饰的。
:::

3. JUnit 常用注解

- **@Test**：标记一个方法为测试方法。
- **@Before**：在每个测试方法运行之前执行。
- **@After**：在每个测试方法运行之后执行。
- **@BeforeClass**：方法必须是静态的，类加载时只执行一次。
- **@AfterClass**：方法必须是静态的，类销毁时只执行一次。
- **@Ignore**：标记一个测试方法被忽略，不会被执行。
- **@RunWith**：指定测试类使用的运行器，常用于扩展 JUnit 功能。
- **@Parameters**：用于参数化测试，提供一组测试数据。


在 IntelliJ IDEA 中，可以使用内置的覆盖率工具来统计单元测试的覆盖率：

1. **运行带有覆盖率的测试**：
   - 右键点击测试类或测试方法。
   - 选择 `Run 'TestName' with Coverage`（或 `Run 'TestName' with Coverage`）。

2. **查看覆盖率报告**：运行完成后，IDEA 会显示覆盖率报告。
   


### 断言与参数化测试

1. JUnit 提供了多种断言方法，用于验证测试结果是否符合预期：

    - **assertEquals(expected, actual)**：断言两个值是否相等。
    - **assertTrue(condition)**：断言条件是否为真。
    - **assertFalse(condition)**：断言条件是否为假。
    - **assertNull(object)**：断言对象是否为 null。
    - **assertNotNull(object)**：断言对象是否不为 null。
    - **assertArrayEquals(expected, actual)**：断言两个数组是否相等。
    - **assertThat(actual, matcher)**：使用 Hamcrest 匹配器进行断言。



2. 参数化测试允许你使用不同的输入数据多次运行同一个测试方法。这对于验证多种情况下的行为非常有用，可以显著减少重复代码。在 JUnit 4 中，可以使用 `@RunWith(Parameterized.class)` 和 `@Parameters` 注解来实现参数化测试。

::: info 参数化测试

参数化测试示例：假设我们有一个简单的数学方法 `MathUtils.add`，我们想用不同的输入数据来测试这个方法。


```java
public class MathUtils {
    public static int add(int a, int b) {
        return a + b;
    }
}
```

创建参数化测试类：

```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

import java.util.Arrays;
import java.util.Collection;

import static org.junit.Assert.assertEquals;

@RunWith(Parameterized.class)
public class MathUtilsTest {

    private int a;
    private int b;
    private int expectedSum;

    // 构造函数，接收参数
    public MathUtilsTest(int a, int b, int expectedSum) {
        this.a = a;
        this.b = b;
        this.expectedSum = expectedSum;
    }

    // 提供测试数据的方法
    @Parameters
    public static Collection<Object[]> data() {
        return Arrays.asList(new Object[][]{
                {1, 2, 3},
                {5, 7, 12},
                {0, 0, 0},
                {-1, 1, 0},
                {100, 200, 300}
        });
    }

    // 测试方法
    @Test
    public void testAdd() {
        int result = MathUtils.add(a, b);
        assertEquals(expectedSum, result);
    }
}
```

1. **@RunWith(Parameterized.class)**：指定使用参数化测试运行器。
2. **构造函数**：接收参数化测试的数据。
3. **@Parameters**：提供测试数据的方法，返回一个 `Collection<Object[]>`，每个数组元素代表一组测试数据。
4. **测试方法**：使用传入的参数进行测试，并使用 `assertEquals` 断言结果是否符合预期。

当运行这个测试类时，JUnit 会为每组数据运行一次 `testAdd` 方法。输出结果会显示每组数据的测试结果。
:::



### Spring单元测试

Spring 单元测试通过集成 JUnit 提供了强大的测试支持，特别适用于需要依赖注入和 Spring 容器管理的测试场景。


::: info Spring 单元测试示例
为了在测试类中使用注解注入组件，需要引入 `spring-test` 依赖。这个依赖提供了 Spring 测试框架的支持，包括 `SpringJUnit4ClassRunner` 和其他测试相关的注解。

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>5.2.15.RELEASE</version>
    <scope>test</scope>
</dependency>
```

在测试类中，通过设置相关注解，可以使用 Spring 的依赖注入功能。

```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:application.xml")
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Test
    public void testHello() {
        orderService.sayHello();
    }

    @Test
    public void testInsertOrder() {
        Order order = new Order();
        order.setProductName("Iphone18");
        order.setUsername("zhangshan233");
        order.setPrice(999);

        orderService.insertOrder(order);
    }
}
```
- **@RunWith(SpringJUnit4ClassRunner.class)**：指定使用 Spring 的测试运行器 `SpringJUnit4ClassRunner`，而不是默认的 JUnit 运行器。
- **@ContextConfiguration("classpath:application.xml")**：指定 Spring 配置文件的位置，这里是 `application.xml` 文件。
:::

Spring 单元测试通过 JUnit 进行，利用 Spring 的依赖注入和配置管理功能，使测试更加便捷和强大，而纯 JUnit 测试则不依赖于任何框架，主要用于测试单一类或方法的功能。



### SpringBootTest 

在 Spring Boot 中进行单元测试非常方便，Spring Boot 提供了 `spring-boot-starter-test` 依赖，集成了 JUnit、Mockito 和其他测试工具，简化了测试配置和执行。


::: info SpringBoot环境下的单元测试示例
#### 1. 引入依赖

在 `pom.xml` 文件中添加 `spring-boot-starter-test` 依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

#### 2. 测试类配置

使用 `@SpringBootTest` 注解来标记测试类，并使用 `@Autowired` 注解来注入需要测试的组件。

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Test
    public void testHello() {
        orderService.sayHello();
    }

    @Test
    public void testInsertOrder() {
        Order order = new Order();
        order.setProductName("Iphone18");
        order.setUsername("zhangshan233");
        order.setPrice(999);

        orderService.insertOrder(order);
    }
}
```

#### 3. 常用注解

- **@SpringBootTest**：启动 Spring Boot 应用程序的完整上下文，加载所有配置。
- **@Autowired**：用于自动注入依赖的 Bean。
- **@Test**：标记一个方法为测试方法。
- **@MockBean**：用于创建和注入 Mock 对象。
- **@WebMvcTest**：用于测试 Spring MVC 控制器，不启动完整的应用程序上下文。
- **@DataJpaTest**：用于测试 JPA 存储库，不启动完整的应用程序上下文。
:::

假设你想测试 `OrderService` 的某个方法，但不想真正调用数据库操作，可以使用 `@MockBean` 注解来创建 Mock 对象。

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @MockBean
    private OrderRepository orderRepository;

    @Test
    public void testHello() {
        orderService.sayHello();
    }

    @Test
    public void testInsertOrder() {
        Order order = new Order();
        order.setProductName("Iphone18");
        order.setUsername("zhangshan233");
        order.setPrice(999);

        // when 方法用于指定当调用某个方法时，Mock 对象应该如何响应
        Mockito.when(orderRepository.save(Mockito.any(Order.class))).thenReturn(order);

        orderService.insertOrder(order);

        Mockito.verify(orderRepository).save(order);
    }
}
```

在 Spring Boot 中进行单元测试非常简单，通过 `spring-boot-starter-test` 依赖，可以轻松地使用 JUnit、Mockito 和其他测试工具。`@SpringBootTest` 注解用于启动完整的应用程序上下文，而 `@MockBean` 注解用于创建 Mock 对象，使得测试更加灵活和高效。



## 项目日志管理

Java Util Logging (JUL) 是 Java SE 自带的日志框架，提供了基本的日志记录功能，包括日志记录器、处理器和格式化器，适用于简单应用场景。实际项目开发中通常需要使用日志框架。

### 日志接口与框架

- **Log4j**：经典的日志框架，配置灵活，但性能相对较差，适合小型项目或遗留系统。
- **Logback**：高性能的日志框架，配置灵活，功能丰富，是 SLF4J 的原生实现，适合大型项目和高性能需求。
- **SLF4J**：日志框架的抽象层，提供了一套统一的 API，便于日志框架的切换，适合需要灵活选择日志框架的项目。

::: info Log4j/Logback与SLF4J
#### 1. Log4j

   - **历史**：Log4j 是最早的 Java 日志框架之一，由 Apache 组织开发。
   - **性能**：相对于 Logback，Log4j 的性能稍逊一筹。
   - **配置**：使用 XML 或 properties 文件进行配置，配置相对复杂。
   - **维护**：Log4j 1.x 已经停止维护，目前主要使用 Log4j 2.x。
   - **依赖**：需要单独的依赖库。

#### 2. Logback

   - **性能**：Logback 是由 Log4j 的创始人 Ceki Gülcü 开发的，设计时注重性能优化，性能优于 Log4j。
   - **配置**：使用 XML 配置文件，支持动态配置，配置更加灵活。
   - **内置支持**：内置支持 SLF4J，可以直接作为 SLF4J 的实现使用。
   - **功能丰富**：提供了更多的日志处理器和格式化器，功能更加强大。

#### 3. SLF4J

   - **抽象层**：SLF4J 是一个日志框架的抽象层，提供了一套统一的 API，使得日志框架的切换变得容易。
   - **桥接**：通过桥接库（如 `slf4j-log4j12.jar`、`logback-classic.jar`）将 SLF4J 的 API 转换为具体日志框架的实现。
   - **依赖**：使用 SLF4J 时，需要额外引入具体的日志框架实现（如 Logback 或 Log4j）。
:::

结合 SLF4J 和 Logback 是目前推荐使用的项目日志解决方案：

- **SLF4J**：提供统一的 API，便于日志框架的切换。
- **Logback**：高性能、配置灵活，是 SLF4J 的原生实现。




### 关于Log4j漏洞

近年来，有一些关于日志框架出现严重漏洞的消息，尤其是 Log4j 的漏洞引起了广泛关注。该漏洞是由于 Log4j 中的 JNDI 功能存在缺陷，允许攻击者通过构造特定的日志消息执行远程代码。
   - **影响范围**：几乎所有使用 Log4j 的系统都可能受到影响
   - **应对措施**：升级到 Log4j 2.15.0 及以上版本，禁用 JNDI 功能，或者使用其他安全措施

log4j.properties 配置文件示例:
```properties
# 设置根日志记录器的级别和处理器
log4j.rootLogger=DEBUG, console, file

# 控制台处理器（ConsoleAppender）
log4j.appender.console=org.apache.log4j.ConsoleAppender
# 设置控制台处理器的目标，默认是 System.out
log4j.appender.console.Target=System.out
# 设置控制台处理器的布局（格式化器）
log4j.appender.console.layout=org.apache.log4j.PatternLayout
# 设置日志消息的格式
log4j.appender.console.layout.ConversionPattern=%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1}:%L - %m%n

# 文件处理器（FileAppender）
log4j.appender.file=org.apache.log4j.DailyRollingFileAppender
# 设置文件处理器的日志文件路径
log4j.appender.file.File=logs/app.log
# 设置文件处理器的日志滚动策略，按天滚动
log4j.appender.file.DatePattern='.'yyyy-MM-dd
# 设置文件处理器的最大保留天数
log4j.appender.file.MaxBackupIndex=30
# 设置文件处理器的最大文件大小（单位：KB）
log4j.appender.file.MaxFileSize=10MB
# 设置文件处理器的布局（格式化器）
log4j.appender.file.layout=org.apache.log4j.PatternLayout
# 设置日志消息的格式
log4j.appender.file.layout.ConversionPattern=%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1}:%L - %m%n

# 设置特定包的日志级别
# 例如，设置 com.example 包下的日志级别为 INFO
log4j.logger.com.example=INFO

# 设置特定类的日志级别
# 例如，设置 com.example.MyClass 类的日志级别为 DEBUG
log4j.logger.com.example.MyClass=DEBUG

# 设置特定类的日志处理器
# 例如，设置 com.example.MyClass 类的日志处理器为 console 和 file
log4j.logger.com.example.MyClass=DEBUG, console, file

# 设置特定类的日志处理器的添加性
# 例如，设置 com.example.MyClass 类的日志处理器不继承父日志处理器
log4j.additivity.com.example.MyClass=false

# 设置特定类的日志处理器的过滤器
# 例如，设置 com.example.MyClass 类的日志处理器只记录 ERROR 级别的日志
log4j.logger.com.example.MyClass=ERROR, console, file
log4j.appender.console.filter.filter1=org.apache.log4j.varia.LevelMatchFilter
log4j.appender.console.filter.filter1.LevelToMatch=ERROR
log4j.appender.console.filter.filter1.AcceptOnMatch=true
```



### Logback的使用

Logback 的使用步骤及示例

**1. 添加依赖**

首先，在你的项目中添加 Logback 和 SLF4J 的依赖。如果你使用 Maven，可以在 `pom.xml` 文件中添加以下依赖：

```xml
<dependencies>
    <!-- SLF4J API -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>1.7.30</version>
    </dependency>
    <!-- Logback 经典实现 -->
    <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>1.2.3</version>
    </dependency>
</dependencies>
```

**2. 创建配置文件**

Logback 使用 XML 格式的配置文件，默认文件名为 `logback.xml`，放在项目的 `src/main/resources` 目录下。   示例配置文件 (`logback.xml`)：

```xml
<configuration>
    <!-- 控制台处理器 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- 文件处理器 -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/app.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/app-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- 根日志记录器 -->
    <root level="debug">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="FILE" />
    </root>

    <!-- 特定包的日志级别 -->
    <logger name="com.example" level="info" />

    <!-- 特定类的日志级别 -->
    <logger name="com.example.MyClass" level="debug" additivity="false">
        <appender-ref ref="FILE" />
    </logger>
</configuration>
```

**3. 编写日志记录代码**

在你的 Java 代码中，使用 SLF4J 的 API 进行日志记录。


```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MyApp {
    private static final Logger logger = LoggerFactory.getLogger(MyApp.class);

    public static void main(String[] args) {
        logger.debug("This is a debug message");
        logger.info("This is an info message");
        logger.warn("This is a warn message");
        logger.error("This is an error message");
    }
}
```

### Logback配置文件

::: tip Logback配置文件详解
#### 1. 根节点 `<configuration>`

- **作用**：配置文件的根节点，包含所有的配置信息。

#### 2. 控制台处理器 `<appender>`（ConsoleAppender）

- **name**：处理器的名称，用于引用。
- **class**：处理器的类名，这里是 `ch.qos.logback.core.ConsoleAppender`，表示控制台处理器。
- **encoder**：编码器，用于格式化日志消息。
- **pattern**：日志消息的格式，使用 `%` 符号表示占位符。

```xml
<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <pattern>%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n</pattern>
    </encoder>
</appender>
```

#### 3. 文件处理器 `<appender>`（RollingFileAppender）

- **name**：处理器的名称，用于引用。
- **class**：处理器的类名，这里是 `ch.qos.logback.core.rolling.RollingFileAppender`，表示滚动文件处理器。
- **file**：日志文件的路径和名称。
- **rollingPolicy**：滚动策略，这里使用 `TimeBasedRollingPolicy` 按天滚动。
- **fileNamePattern**：滚动文件的命名模式。
- **maxHistory**：最大保留天数。
- **encoder**：编码器，用于格式化日志消息。
- **pattern**：日志消息的格式，使用 `%` 符号表示占位符。

```xml
<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>logs/app.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
        <fileNamePattern>logs/app-%d{yyyy-MM-dd}.log</fileNamePattern>
        <maxHistory>30</maxHistory>
    </rollingPolicy>
    <encoder>
        <pattern>%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n</pattern>
    </encoder>
</appender>
```

#### 4. 根日志记录器 `<root>`

- **level**：根日志记录器的级别，可以是 `trace`、`debug`、`info`、`warn`、`error`。
- **appender-ref**：引用处理器，可以引用多个处理器。

```xml
<root level="debug">
    <appender-ref ref="STDOUT" />
    <appender-ref ref="FILE" />
</root>
```

#### 5. 特定包的日志记录器 `<logger>`

- **name**：日志记录器的名称，通常是包名。
- **level**：日志记录器的级别。
- **additivity**：是否继承父日志记录器的处理器，`true` 表示继承，`false` 表示不继承。

```xml
<logger name="com.example" level="info" />
```

#### 6. 特定类的日志记录器 `<logger>`

- **name**：日志记录器的名称，通常是类的全名。
- **level**：日志记录器的级别。
- **additivity**：是否继承父日志记录器的处理器，`true` 表示继承，`false` 表示不继承。
- **appender-ref**：引用处理器，可以引用多个处理器。

```xml
<logger name="com.example.MyClass" level="debug" additivity="false">
    <appender-ref ref="FILE" />
</logger>
```
:::


Logback 支持以下日志级别，从低到高依次为：

- **TRACE**：最详细的日志信息，通常用于开发和调试阶段。
- **DEBUG**：调试信息，用于开发过程中查看变量值和流程。
- **INFO**：一般信息，用于记录应用程序的重要事件。
- **WARN**：警告信息，表示潜在的问题，但不影响应用程序的正常运行。
- **ERROR**：错误信息，表示应用程序发生了错误，需要立即处理。
- **FATAL**：致命错误信息，表示应用程序无法继续运行。



### SpringBoot日志

Spring Boot 默认使用 Logback 作为日志框架，并且提供了许多自动配置的功能，使得日志配置变得更加简单和方便。Spring Boot 项目默认已经包含了 Logback 和 SLF4J 的依赖，因此你不需要额外添加这些依赖。如果你是从头开始创建一个 Spring Boot 项目，确保你的 `pom.xml` 文件中包含以下依赖：

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Boot Starter Logging (包含 Logback 和 SLF4J) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-logging</artifactId>
    </dependency>
</dependencies>
```


在 `src/main/resources` 目录下创建 `logback-spring.xml` 文件（或 `logback.xml`），并配置日志处理器和日志级别。 示例配置文件 (`logback-spring.xml`)

```xml
<configuration>
    <!-- 控制台处理器 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- 文件处理器 -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/app.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/app-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- 根日志记录器 -->
    <root level="info">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="FILE" />
    </root>

    <!-- 特定包的日志级别 -->
    <logger name="com.example" level="debug" />

    <!-- 特定类的日志级别 -->
    <logger name="com.example.MyClass" level="trace" additivity="false">
        <appender-ref ref="FILE" />
    </logger>
</configuration>
```


在Java 代码中，使用 SLF4J 的 API 进行日志记录。


```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    private static final Logger logger = LoggerFactory.getLogger(MyController.class);

    @GetMapping("/hello")
    public String hello() {
        logger.trace("This is a trace message");
        logger.debug("This is a debug message");
        logger.info("This is an info message");
        logger.warn("This is a warn message");
        logger.error("This is an error message");

        return "Hello, World!";
    }
}
```

::: info Lombok 对日志的影响和作用

Lombok 提供了 `@Slf4j` 注解，可以自动生成日志记录器字段，使得日志记录更加简洁。


在需要记录日志的类上使用 `@Slf4j` 注解，Lombok 会自动生成 `private static final Logger logger` 字段。

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class MyController {

    @GetMapping("/hello")
    public String hello() {
        log.trace("This is a trace message");
        log.debug("This is a debug message");
        log.info("This is an info message");
        log.warn("This is a warn message");
        log.error("This is an error message");

        return "Hello, World!";
    }
}
```
:::
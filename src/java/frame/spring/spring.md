---

order: 1
title:  Spring容器基础

---


Spring Framework Introduction：https://spring.io/projects/spring-framework 

Spring Framework Documentation：https://spring.io/projects/spring-framework#learn

<br>

所有历史版本的PDF/HTML文档：https://docs.spring.io/spring-framework/docs/ 

Spring 的官方Github地址：https://github.com/spring-projects/spring-framework 



## 一 IoC容器基础

**控制反转（IoC，Inversion of Control）** 是一种设计原则，广泛应用于软件工程，尤其是面向对象编程中。在传统的程序设计中，对象通常主动创建它们所依赖的其他对象，这种做法导致了紧密的耦合。而IoC则反转了这一过程，对象的依赖关系不再由对象自己创建，而是由外部容器（如Spring框架的IoC容器）来负责创建和管理。这样一来，对象只需声明它们的依赖，而具体的创建和绑定过程则交给容器处理。

**IoC的优势包括：**

1. **降低耦合性**：通过将依赖关系的管理从代码内部移至外部容器，降低了类与类之间的直接依赖，使得系统更加灵活，易于修改和扩展。

2. **提高代码的可测试性**：依赖注入使得在单元测试中可以轻松替换掉真实依赖，用模拟（Mock）或存根（Stub）对象代替，从而专注于测试目标代码的行为，提高了测试的隔离性和效率。

3. **可配置性和灵活性**：依赖关系可以在配置文件中或通过注解来声明，无需修改代码即可调整应用程序的行为，这在不同的环境部署（如开发、测试、生产环境）中尤为重要。

4. **资源管理和生命周期控制**：IoC容器负责对象的创建、初始化、销毁等生命周期管理，有助于统一管理资源，避免内存泄漏等问题。

5. **促进面向接口编程**：IoC鼓励使用接口而非具体类来编程，这样可以更好地遵循设计模式原则，如策略模式、工厂模式等，提高代码的抽象性和复用性。

6. **模块化**：通过将依赖管理从代码逻辑中抽离，使得系统能够更自然地划分为独立的模块，有助于团队协作和组件复用。


### 1. 依赖和约束

引入依赖（5个核心包+1个日志包）：

<font color='red'> spring-context </font> \ aop \ beans \ core \ expression  + spring-jcl

```xml

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.2.15.RELEASE</version>
</dependency>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
    <scope>test</scope>
</dependency>

```

<br>

**schema约束**：

官方文档：https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#xsd-schemas

```xml

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:util="http://www.springframework.org/schema/util"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/util https://www.springframework.org/schema/util/spring-util.xsd">

    <!-- bean definitions here -->
    <!--id属性：组件在容器中的唯一标识,单词通常是和实例相关的-->
    <!--name属性：省略不写，以id作为默认值-->
    <!--class属性：全限定类名-->
    <bean id="userService" class="com.xxx.service.UserServiceImpl"/>
    <bean id="orderService" class="com.xxx.service.OrderServiceImpl"/>
    
    
    
    <!--维护依赖关系-->
    <bean id="userService" class="com.xxx.service.UserServiceImpl">
        <!--property子标签的name属性值对应的就是set方法-->
        <!--ref属性：组件id-->
        <property name="userDao" ref="userDao"/>
	</bean>

	<bean id="orderService" class="com.xxx.service.OrderServiceImpl">
    	<property name="userDao" ref="userDao"/>
	</bean>

	<!--userDao组件-->
	<bean id="userDao" class="com.xxx.dao.UserDaoImpl"/>

</beans>

```

通常名字叫 <font color='red'>**application(-xxx).xml**</font> .

<br>

### 2. IoC控制反转

Spring框架的核心特性之一是控制反转（IoC，Inversion of Control），它是一种设计模式，旨在减少代码间的耦合度，让开发人员专注于业务逻辑，而非对象的生命周期管理和依赖关系。IoC的基本思想是将对象的创建和管理从应用程序代码中移出，交由一个容器（Spring IoC容器）来负责。以下是Spring中IoC的原理及其使用方式的详细介绍：

#### IoC原理

1. **控制反转**：传统应用程序中，对象通常自己负责管理和创建与其依赖的其他对象的关系。而在IoC模式下，这种控制权被反转给外部容器，容器负责创建对象、管理对象的生命周期，并将依赖关系自动注入到对象中。

2. **依赖注入（DI, Dependency Injection）**：这是实现IoC的一种具体方式。通过DI，容器在运行时将依赖对象注入到需要它们的组件中，而不是组件自己去创建依赖。这可以通过构造器注入、setter方法注入等方式完成。

3. **容器初始化与Bean管理**：
   - **XML配置**：早期的Spring应用中，通常通过XML文件来定义Bean以及它们的依赖关系。容器启动时读取这些配置，解析并创建Bean实例。
   - **注解配置**：随着Spring的发展，@Component、@Service、@Repository、@Controller等注解被引入，使得可以直接在类级别声明Bean，而@Autowired、@Resource等注解用于依赖注入。
   - **Java配置**：Spring 3.0之后，提供了基于Java的配置方式，允许使用Java类来定义Bean和配置容器，这种方式更加灵活且类型安全。

4. **底层实现**：
   - **XML解析**：Spring使用类似`BeanDefinitionReader`和`BeanDefinitionParser`的类来解析XML配置文件，将配置转化为内部的Bean定义（`BeanDefinition`）。
   - **工厂模式**：Spring IoC容器自身就是一个大工厂，它使用工厂模式来创建Bean实例。
   - **反射**：容器利用Java反射机制来实例化Bean，并根据配置信息调用相应的构造方法或setter方法来完成依赖注入。

#### 使用方式

1. **XML配置方式**：
   - 创建一个Spring的配置文件（如applicationContext.xml）。
   - 在配置文件中定义Bean，包括Bean的类名、属性及依赖关系。
   - 在应用中通过`ClassPathXmlApplicationContext`或`FileSystemXmlApplicationContext`加载配置文件，获取Bean实例。

2. **注解配置方式**：
   - 在类上使用@Component、@Service等注解标记为Spring管理的Bean。
   - 使用@Autowired或@Resource注解自动装配依赖。
   - 启动Spring应用时，通过`AnnotationConfigApplicationContext`加载主配置类或包扫描来发现并初始化Bean。

3. **Java配置方式**：
   - 创建一个或多个Java配置类，使用@Configuration标记，并在其中定义@Bean方法来创建Bean实例。
   - 利用`@Import`导入其他配置类，或使用@ComponentScan自动扫描指定包下的Bean定义。
   - 通过`AnnotationConfigApplicationContext`加载Java配置类启动Spring容器。

通过上述方式，Spring IoC容器不仅简化了对象管理，还促进了代码的松耦合，提高了代码的可测试性和可维护性。


### 3. IoC容器的类型

**IoC容器的类型：BeanFactory与ApplicationContext**

在Spring框架中，IoC容器主要有两种类型：BeanFactory和ApplicationContext。它们都是用来管理Bean的创建、配置和装配的，但ApplicationContext在BeanFactory的基础上提供了更多面向应用的功能。

**BeanFactory：基本容器**
BeanFactory是最简单的IoC容器，它是Spring框架中所有IoC容器的根接口。BeanFactory提供了配置元数据的读取、Bean的创建、管理Bean的依赖关系等基本功能。但它相对较为原始，不提供一些高级特性，如自动装配、消息资源处理、事件传播等。

**ApplicationContext：高级容器**
ApplicationContext是BeanFactory的扩展，它是Spring应用中最常使用的容器。除了BeanFactory提供的功能外，ApplicationContext还提供了以下特性：
- **自动检测和注册Bean**：通过@ComponentScan自动扫描并注册带有@Component及其衍生注解的类。
- **消息资源处理**：提供国际化支持，可以读取资源文件进行本地化配置。
- **事件传递**：允许发布和订阅应用程序上下文事件，如ContextRefreshedEvent。
- **载入多个配置文件**：可以同时加载多个配置文件，包括XML配置、注解配置和Java配置。
- **AOP支持**：直接集成面向切面编程的支持，简化了切面的配置和管理。
- **懒加载与急加载**：更灵活的Bean加载策略。


### 4. 启动IOC容器

Spring IOC容器的访问入口主要包括`BeanFactory`接口和`ApplicationContext`接口，它们的区别如上所述，下面主要介绍各种环境下的`ApplicationContext`启动方式：

#### 单独的Spring环境中

在非Web应用的简单Spring环境中，启动`ApplicationContext`通常通过以下步骤：

1. **创建容器实例**：使用`ClassPathXmlApplicationContext`、`FileSystemXmlApplicationContext`或`AnnotationConfigApplicationContext`等工厂类来创建`ApplicationContext`实例。

   如果是基于XML配置，则使用前两者

   ```java
   ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
   ```

   或者，如果是基于Java配置：

   ```java
   ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
   ```

2. **获取Bean**：通过`getBean`方法从容器中检索Bean实例。
    ```java
    MyService myService = context.getBean(MyService.class);
    ```

#### Spring MVC环境中

在Spring MVC应用中，`ApplicationContext`的启动和管理通常是集成在Web容器内的，主要通过`DispatcherServlet`来初始化。流程大致如下：

1. **配置DispatcherServlet**：在`web.xml`中配置`DispatcherServlet`，指定其上下文配置位置。

   ```xml
   <servlet>
       <servlet-name>springmvc</servlet-name>
       <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
       <init-param>
           <param-name>contextConfigLocation</param-name>
           <param-value>/WEB-INF/spring/appServlet/servlet-context.xml</param-value>
       </init-param>
       <!-- Other configurations -->
   </servlet>
   ```

2. **启动Web应用**：Web容器启动时，会加载并初始化`DispatcherServlet`，`DispatcherServlet`会根据配置创建自己的`WebApplicationContext`，这是一个特殊的`ApplicationContext`，它继承自普通的`ApplicationContext`并添加了Web相关的特性。

3. **获取Bean**：常用的方式是直接使用`@Autowired`等注解，也可以通过下列方式获取：
    ```java
    // 1 通过WebApplicationContextUtils
    public class MyServletContextListener implements ServletContextListener {

        @Override
        public void contextInitialized(ServletContextEvent event) {
            WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(event.getServletContext());
            // 使用上下文...
        }

        // 其他方法...
    } 

    // 2 实现ApplicationContextAware
    public class MyComponent implements ApplicationContextAware {

        private static ApplicationContext context;

        @Override
        public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
            context = applicationContext;
        }

        //  public ApplicationContext getApplicationContext() {} 
    }  

    // 3 甚至可以通过DispatcherServlet的初始化参数
    ServletContext servletContext = ...; // 从其他地方获取到ServletContext
    String attrName = DispatcherServlet.class.getName() + ".CONTEXT" + servletName;
    WebApplicationContext context = (WebApplicationContext) servletContext.getAttribute(attrName);
    ```

#### Spring Boot环境中

Spring Boot应用中，`ApplicationContext`的启动更加自动化，无需显式地创建和配置`ApplicationContext`实例。主要流程如下：

1. **自动配置**：Spring Boot通过自动配置机制，根据类路径上的jar依赖和`@Configuration`类自动配置`ApplicationContext`。它会查找`META-INF/spring.factories`中的自动配置类并加载它们。

2. **Application启动类**：通常有一个带有`@SpringBootApplication`注解的主类，这个注解是`@SpringBootConfiguration`、`@EnableAutoConfiguration`和`@ComponentScan`的组合，它告诉Spring Boot从哪里开始扫描Bean并自动配置应用。

   ```java
   @SpringBootApplication
   public class Application {
       public static void main(String[] args) {
           SpringApplication.run(Application.class, args);
       }
   }
   ```

3. **启动应用**：调用`SpringApplication.run()`方法时，Spring Boot会自动创建、配置并启动`ApplicationContext`，并自动配置好Web容器（如果有Web应用的依赖）。

4. **获取Bean**: 除了使用注解和实现ApplicationContextAware接口等方式外，Spring Boot还有一个特有的方式：
    ```java
    @SpringBootApplication
    public class MySpringBootApplication {
        
        public static void main(String[] args) {
            ConfigurableApplicationContext context = SpringApplication.run(MySpringBootApplication.class, args);
            // 使用context...
        }
    }
    ```

总的来说，无论是在简单的Spring应用、Spring MVC应用还是Spring Boot应用中，`ApplicationContext`的启动过程都是围绕着自动配置、Bean的发现和初始化进行的，只是在Spring Boot中这一过程高度自动化，而在其他环境中可能需要更多的手动配置。


## 二 向IoC容器注册Bean

### XML配置方式

在Spring框架中，通过XML配置方式向IoC容器注册Bean是一种经典且广泛使用的方法。这种方式允许开发者在XML文件中定义Bean的配置信息，包括Bean的类名、属性值、依赖关系等

Spring的XML配置文件通常以`beans`元素作为根节点，位于`http://www.springframework.org/schema/beans`命名空间下。基本结构如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- Bean definitions go here -->

</beans>
```

#### 注册Bean: `<bean>`标签

- **id属性**：Bean的唯一标识符，用于在其他地方引用这个Bean。
- **class属性**：Bean的完全限定类名。
- **scope属性**：Bean的作用域，默认为singleton，表示每次请求返回相同的实例；可选值还包括prototype（每次请求创建新实例）、request/session（Web应用中）、application（Web应用中全局单例）等。
- **init-method** 和 **destroy-method**：指定Bean初始化和销毁时调用的方法名。

**示例：**

```xml
<bean id="myService" class="com.example.MyService"/>

<bean id="myDAO" class="com.example.MyDAO" scope="prototype">
    <property name="dataSource" ref="dataSource"/>
</bean>
```

#### 设置Bean属性: `<property>`标签

- **name属性**：对应Bean中的setter方法去掉set前缀后的属性名。
- **ref属性**：如果属性是另一个Bean的引用，则使用此属性指定Bean的id。
- **value属性**：如果属性是基本类型或String类型，则直接设置值。

**示例：**

```xml
<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
    <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/mydb"/>
    <property name="username" value="root"/>
    <property name="password" value="password"/>
</bean>

<bean id="myDAO" class="com.example.MyDAO">
    <property name="dataSource" ref="dataSource"/>
</bean>
```

#### 自动装配: `<bean>`标签的`autowire`属性

- 可以设置为`byName`（根据名称匹配）、`byType`（根据类型匹配）、`constructor`（构造器自动装配）、`default`（默认关闭）。
- 注意：虽然自动装配简化了配置，但也可能引入隐式的依赖，降低代码的清晰度和可维护性。

**示例：**

```xml
<bean id="myService" class="com.example.MyService" autowire="byType"/>
```

::: info 注意事项
- **避免循环依赖**：Spring容器在初始化过程中不能解决所有的循环依赖问题，特别是通过构造器注入或使用prototype作用域的Bean。
- **命名规范**：保持Bean的id具有描述性和唯一性，有助于阅读和维护配置文件。
- **使用`xsd`验证**：确保XML配置文件符合Spring的schema定义，有助于提前发现配置错误。
- **分模块配置**：大型应用中，建议将配置文件按模块拆分，以提高可维护性和可读性。
    ```xml
    <!-- applicationContext.xml -->
    <import resource="classpath*:service-context.xml"/>
    <import resource="classpath*:controller-context.xml"/>
    ```
:::

通过XML配置方式注册Bean虽然不如注解配置那样简洁，但在某些场景下（如需要高度定制化的配置或团队习惯）仍是非常有用和灵活的。

### 注解配置方式

通过注解配置方式向IoC容器注册Bean是一种现代化且推荐的做法，它简化了配置文件，提高了代码的可读性和维护性。以下是常用的注解

1. **@Component**：通用注解，用于标记任何受Spring管理的组件。通常与组件扫描一起使用。

2. **@Service**：用于标记业务层组件，通常与服务相关的类。

3. **@Repository**：用于数据访问层组件，如DAOs，强调对数据库交互的异常翻译。

4. **@Controller**：用于标记Spring MVC中的控制器组件，处理HTTP请求。

5. **@Autowired**：自动装配Bean，Spring会自动满足Bean的依赖，基于类型进行匹配。

6. **@Value**：用于注入基本类型和String类型的值，可以从属性文件中读取。

7. **@Qualifier**：当有多个相同类型的Bean候选者时，与@Autowired一起使用来指定具体要装配的Bean。

8. **@Configuration**：标记一个类作为配置类，可以包含@Bean注解来定义Bean。

9. **@Bean**：在配置类中声明一个Bean，通常与@Configuration一起使用。

**示例：**

```java
@Scope("prototype")
@Component // 告诉Spring这是一个需要管理的Bean
public class EmailService {

    // 假设这里有一些依赖
    // @Autowired
    // private AnotherService anotherService;

    // 构造器可以用来注入依赖，但这里为了演示不使用

    /**
     * 这是使用@PostConstruct注解的方法，会在所有依赖注入完成后，但在Bean初始化完成之前执行。
     * 相当于XML配置中的init-method。
     */
    @PostConstruct
    public void init() {
        System.out.println("EmailService 初始化...");
        // 初始化逻辑，比如打开数据库连接、初始化缓存等
    }

    /**
     * 提供服务的方法...
     */
    public void sendEmail(String to, String message) {
        // 发送邮件的逻辑
        System.out.println("发送邮件给 " + to + ": " + message);
    }

    /**
     * 使用@PreDestroy注解的方法，会在容器关闭时，Bean销毁之前执行。
     * 相当于XML配置中的destroy-method。
     */
    @PreDestroy
    public void cleanup() {
        System.out.println("EmailService 清理资源...");
        // 清理逻辑，比如关闭数据库连接、清理临时文件等
    }
}
```

::: info scope作用域
在Spring框架中，`scope`属性用于定义Bean的作用域，决定了Bean实例的创建方式和生命周期。Spring提供了多种作用域，每种作用域都有其特定的使用场景和行为特点。下面详细介绍几种常见的scope参数及其使用场景

### 1. Singleton (单例)

- **含义**：默认的作用域，每个Spring IoC容器中只有一个共享的Bean实例。当容器启动时创建，直到容器关闭才销毁。
- **使用场景**：绝大多数业务逻辑Bean，如服务类、DAO类等，都应使用Singleton，以提高性能和资源利用率。
- **代码示例**：无需特别指定，默认就是Singleton。

```java
@Service
public class MyService {
    // 类实现
}
```

### 2. Prototype (原型)

- **含义**：每次请求都会创建一个新的Bean实例。
- **使用场景**：状态会随每次请求变化的对象，如Strategies、线程安全的Session Beans等。
- **代码示例**：

```java
@Component
@Scope("prototype")
public class MyPrototypeBean {
    // 类实现
}
```

### 3. Request (请求)

- **含义**：在Web应用中，每个HTTP请求都会创建一个新的Bean实例，仅限于Web应用上下文。
- **使用场景**：存储请求级的数据或状态。
- **代码示例**（需在Servlet容器中使用）：

```java
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class MyRequestBean {
    // 类实现
}
```

### 4. Session (会话)

- **含义**：在Web应用中，每个用户会话都会创建一个新的Bean实例，仅限于Web应用上下文。
- **使用场景**：存储会话级的状态或用户信息。
- **代码示例**（需在Servlet容器中使用）：

```java
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class MySessionBean {
    // 类实现
}
```

### 5. Application (应用)

- **含义**：在Web应用中，整个应用上下文范围内只创建一个Bean实例，类似于Singleton，但仅限于Web应用上下文。
- **使用场景**：与ServletContext生命周期相同的Bean。
- **代码示例**（需在Servlet容器中使用）：

```java
@Component
@Scope("application")
public class MyApplicationBean {
    // 类实现
}
```

### 注意事项

- 使用非Singleton（如Prototype、Request、Session等）作用域时，如果需要在Singleton作用域的Bean中注入这些Bean，通常需要使用ScopedProxy（如`proxyMode = ScopedProxyMode.TARGET_CLASS`），以确保正确地处理作用域代理。
- 在非Web环境中，只有Singleton和Prototype两种作用域是可用的。
:::


### Java配置方式
Java配置方式是Spring框架提供的现代化配置方式，它允许开发者通过Java类而非传统的XML文件来定义和配置Bean。这种方式更加灵活，便于利用IDE的代码补全和编译时检查等特性，提高开发效率和配置的可维护性。

#### 1. `@Configuration`与`@Bean`注解

- **@Configuration**：标记一个类作为配置类，相当于XML配置中的 `<beans>` 标签。此类可以包含一个或多个`@Bean`方法来定义Bean。

- **@Bean**：在配置类的方法上使用，声明该方法的返回值为一个由Spring管理的Bean。相当于XML中的 `<bean>` 标签。

**代码示例**：

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }

    @Bean
    public MyDAO myDAO() {
        return new MyDAOImpl();
    }
}
```

#### 2. 导入其他配置类（`@Import`）

- **@Import**：允许一个配置类导入另一个配置类，相当于XML配置中的 `<import>` 标签，可以用来组织和模块化配置。

**代码示例**：

```java
@Configuration
@Import({DBConfig.class, ServiceConfig.class})
public class AppConfig {
    // ...其他配置
}
```

其中，`DBConfig` 和 `ServiceConfig` 也是配置类，各自定义了一组Bean。

#### 3. Profile特定配置（`@Profile`）

- **@Profile**：用于定义条件化配置，根据当前激活的profile来决定是否创建某个Bean或是否加载某个配置类。这对于不同环境（如开发、测试、生产）有不同的配置需求非常有用。

**代码示例**：

```java
@Configuration
@Profile("production") // 此配置仅在production profile激活时生效
public class ProductionConfig {

    @Bean
    public DataSource productionDataSource() {
        // 生产环境数据源配置
        return new DataSource();
    }
}

@Configuration
@Profile("development") // 此配置仅在development profile激活时生效
public class DevelopmentConfig {

    @Bean
    public DataSource developmentDataSource() {
        // 开发环境数据源配置
        return new DataSource();
    }
}
```

在Spring Boot应用中，可以通过命令行参数（如`--spring.profiles.active=production`）或配置文件来指定激活哪个profile。


### 组件扫描与自动装配

通常，你会在一个主配置类中使用@ComponentScan启动组件扫描，并在需要的地方使用@Autowired、@Value等注解来完成依赖注入和属性配置。

```java
@Configuration
@ComponentScan(basePackages = "com.example")
public class AppConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

```java
@Service
public class MyService {
    
    @Autowired
    @Qualifier("primaryDataSource")  // 如果有多个相同类型的Bean，可以使用@Qualifier指定具体Bean
    private DataSource dataSource;

    @Value("${app.database.url}")    // 使用@Value注解可以注入外部配置的值
    private String databaseUrl;
    
    // ...
}
```

通过这种方式，Spring框架利用注解大大简化了配置，促进了面向切面编程（AOP）、事务管理等高级特性的无缝集成，同时也保持了代码的整洁和可维护性。


::: info `@ComponentScan`注解与`context:component-scan`元素
`@ComponentScan`注解与`<context:component-scan>`元素都服务于同一个目的：在Spring框架中自动发现和注册带有特定注解的类作为Bean。这两个机制允许开发者避免编写大量的XML配置，转而采用更简洁的注解驱动的配置方式。尽管它们的目标相同，但在使用场景、配置方式和一些细节上存在差异。

### @ComponentScan

- **功能**：`@ComponentScan`是一个Java注解，用于Spring的Java配置风格中。它告诉Spring框架应该扫描指定的基本包（及其子包）来查找带有`@Component`、`@Service`、`@Repository`、`@Controller`等注解的类，并自动将这些类作为Bean定义注册到Spring容器中。此外，它还支持过滤器来进一步细化扫描规则，比如通过`includeFilters`和`excludeFilters`来指定扫描哪些类或排除哪些类。

- **配置方式**：直接在配置类上使用，例如：

  ```java
  @Configuration
  @ComponentScan(basePackages = {"com.example.service", "com.example.repository"})
  public class AppConfig {
      // 配置类的其他内容
  }
  ```

- **使用场景**：主要用于基于Java配置的Spring应用，尤其是Spring Boot应用中，因为它强调零XML配置的理念。它更适合现代应用的开发模式，有利于代码的组织和维护。

### `<context:component-scan>`

- **功能**：`<context:component-scan>`是Spring XML配置中的一个元素，功能与`@ComponentScan`相似，也是用来自动扫描指定包路径下的带有组件注解的类，并将其注册为Spring容器中的Bean。它同样支持通过子元素`<context:include-filter>`和`<context:exclude-filter>`来过滤扫描的结果。

- **配置方式**：在Spring的XML配置文件中使用，例如：

  ```xml
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns:context="http://www.springframework.org/schema/context"
         xsi:schemaLocation="...">

      <context:component-scan base-package="com.example.service, com.example.repository"/>

      <!-- 其他Bean定义 -->
  </beans>
  ```

- **使用场景**：适合于传统Spring应用，特别是那些仍然大量依赖XML配置的项目。对于维护历史项目或偏好XML配置的团队来说，这是非常有用的。

### 区别与选择

- **配置风格**：`@ComponentScan`适用于Java配置风格，更符合现代编程趋势；`<context:component-scan>`则是XML配置风格的代表，适合于需要兼容旧版Spring应用或偏好XML配置的场景。
  
- **可读性和维护性**：Java配置通常被认为更易读和更易于维护，尤其是在大型项目中，因为它允许IDE的代码导航和重构支持。
  
- **集成便利性**：Spring Boot等现代框架默认支持并鼓励使用Java配置和`@ComponentScan`，这使得集成第三方库和服务更为便捷。

总的来说，选择哪种方式取决于项目的需求、团队的偏好以及是否需要向新式配置风格过渡。随着Spring Boot的流行，越来越多的新项目倾向于使用`@ComponentScan`和Java配置方式。然而，了解两者并能根据实际情况灵活选择，对于维护和开发跨时代的Spring应用是必要的。
:::


### XML与注解配置对比

XML配置与注解配置是Spring框架中两种主要的Bean定义和管理方式，它们各有特点和适用场景。以下是两者之间的一些关键对比：

- XML配置方式：

1. **灵活性与可读性**：XML配置提供了高度的灵活性，允许开发者详细描述应用程序的结构和行为，特别适合复杂配置。但这也可能导致配置文件变得冗长且难以维护。

2. **分离关注点**：通过将配置与代码分离，XML配置有助于维护关注点的分离，使得非技术人员也能理解配置。这有利于团队协作和后期维护。

3. **兼容性**：XML配置历史悠久，兼容性好，对于老版本Spring或不支持注解的环境更为友好。

4. **修改无需重新编译**：修改配置文件不需要重新编译整个项目，这在某些情况下可以提高开发效率。

- 注解配置方式：

1. **简洁性**：注解配置极大地简化了配置，减少了XML文件的数量，使得代码更加简洁。很多配置如依赖注入、事务管理等可以直接在代码中通过注解完成。

2. **开发效率**：注解配置提高了开发效率，特别是在快速迭代的项目中，减少了配置文件的维护工作，使得代码更加直观。

3. **类型安全**：注解是编译时检查的，这意味着配置错误可以在编译阶段被发现，而不是等到运行时才暴露问题。

4. **耦合度**：注解将配置信息直接嵌入到代码中，可能会增加代码间的耦合度，尤其是在需要频繁调整配置的情况下。

::: tip 使用场景
- **XML配置**更适合于大型项目或团队，特别是当配置需要跨多个模块共享，或者需要非开发人员（如运维人员）参与配置管理时。此外，在需要保持配置与代码解耦，或者有严格的配置版本控制需求时，也倾向于使用XML。

- **注解配置**则更适合小型项目或敏捷开发环境，特别是当追求快速开发、代码简洁性和开发效率时。它也是现代Spring Boot应用的标准配置方式，因为Spring Boot默认提倡“约定优于配置”的理念，大量使用注解来减少配置负担。
:::
在实际应用中，XML配置与注解配置往往不是非此即彼的选择，而是可以根据项目需求灵活组合使用，以达到最佳的配置管理效果。Spring框架也支持两者的混合使用，允许在XML中引用注解配置的Bean，或在注解配置中通过`@ImportResource`导入XML配置，实现配置方式的互补。

### 注解与Java配置对比

下面以`@Component`和`@Bean`为例来对比，它们都是用来向Spring容器注册Bean的方式，但它们的应用场景和使用方式有所不同

#### @Component

`@Component`是Spring的核心注解之一，用于标记一个Java类作为Spring中的Bean组件。Spring会自动扫描带有此注解的类，并将它们作为Bean纳入到Spring容器进行管理。这种方式适用于基于注解的配置，简化了XML配置文件的编写。

**代码示例：**

```java
// 使用@Component标记该类为一个Bean
@Component
public class MyService {
    public void sayHello() {
        System.out.println("Hello, @Component!");
    }
}
```

为了使@Component扫描生效，还需要在配置类上使用`@ComponentScan`：

```java
@Configuration
@ComponentScan(basePackages = "com.example.demo")
public class AppConfig {
    // 配置类内容
}
```

#### @Bean

`@Bean`注解主要用于在Java配置类中显式地定义Bean的生成方式。与`@Component`的自动扫描不同，`@Bean`需要你手动定义每个Bean的创建过程，提供了更多的灵活性，适合于那些不能使用@Component自动发现的场景，比如第三方库的集成、复杂的依赖关系构建等。

**代码示例：**

```java
@Configuration
public class AppConfig {

    // 在配置类的方法上使用@Bean来定义Bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

在这个例子中，`myService()`方法返回的`MyService`实例会被Spring容器作为Bean进行管理。你可以在这个方法内部设置更复杂的初始化逻辑，或者注入其他依赖的Bean。

#### 区别与使用场景

- **@Component**：
  - **区别**：自动扫描机制，适用于项目内部自己编写的类，简化配置。
  - **使用场景**：当你的应用主要由你自己编写的组件构成，且这些组件遵循一定的命名规则或位于特定的包下时，使用@Component配合@ComponentScan可以非常方便地批量注册Bean。

- **@Bean**：
  - **区别**：手动配置，提供了完全的控制权，可以用于任何对象的实例化，包括第三方库的类。
  - **使用场景**：当需要对Bean的创建过程有精细控制，或者需要注册第三方库的组件为Spring Bean时，使用@Bean更加灵活。它也适用于那些不适合用@Component标注的场景，比如配置类中动态创建Bean。

总结来说，`@Component`和`@Bean`各有优势，选择使用哪种方式取决于具体的需求和场景。在现代Spring应用开发中，通常会结合使用这两者，以达到既高效又灵活的配置效果。


## 三 依赖注入深入

### 依赖注入及其原理

Spring框架中的依赖注入（Dependency Injection, DI）是一种设计模式，用于实现控制反转（Inversion of Control, IoC）的概念，旨在降低组件之间的耦合度，提高代码的可测试性和可维护性。其核心原理在于将对象的创建和依赖关系的管理从代码逻辑中提取出来，交给Spring容器负责。

**DI原理概览**

1. **Bean定义与注册**：首先，Spring通过XML配置文件、注解（如@Component, @Service, @Repository, @Controller等）或Java配置类（使用@Configuration和@Bean注解）来定义和注册Bean。这些Bean代表了应用程序中的各种组件，如服务、数据访问对象等。

2. **依赖解析**：Spring容器在启动时会解析这些配置，识别出Bean之间的依赖关系。例如，如果一个Service Bean依赖于一个Repository Bean，Spring会记录这种依赖。

3. **Bean实例化与依赖注入**：在容器实例化Bean时，它会检查Bean定义中声明的所有依赖，并使用反射机制来注入这些依赖。具体来说，Spring通过以下三种主要方式执行依赖注入：

   - **构造器注入**：容器调用Bean的构造函数，将依赖作为参数传递给构造函数。这是推荐的做法，因为它支持不可变对象和清晰的依赖关系表达。
   
   - **Setter方法注入**：容器在Bean实例化后，调用Bean的setter方法来注入依赖。这种方式适用于可选依赖或配置更改。
   
   - **字段注入**：虽然Spring支持直接注入到字段（字段注入），但这通常不推荐，因为它降低了代码的清晰度和测试性。


::: info 实现细节

- **反射**：Spring使用Java反射API来创建Bean实例，并调用相应的构造函数或setter方法来注入依赖。反射允许程序在运行时动态地访问和修改对象的属性和方法。

- **Autowiring**：Spring提供了自动装配功能，通过`@Autowired`、`@Resource`等注解，Spring容器可以自动解析并注入合适的Bean，减少了显式配置的需要。
::: 
总之，Spring的依赖注入机制通过将对象的创建和依赖管理从代码中抽象出来，实现了组件之间的解耦，提高了系统的灵活性和可测试性。通过灵活的配置和强大的容器管理，开发者可以更加专注于业务逻辑的实现。

### 依赖注入常用注解

- **@Autowired**：基于类型进行自动装配，Spring会在运行时自动寻找匹配的Bean并注入到对应字段或方法中。适用于大多数情况，尤其是当依赖关系明确且唯一时。

- **@Resource**：来源于JSR-250标准，既可以根据类型也可以根据名称进行注入。默认情况下是按照Bean的名称进行匹配。适用于需要按名称注入的场景，或者希望保持与Java EE标准兼容的项目。

- **@Qualifier**：与`@Autowired`搭配使用，用于解决当有多个相同类型的Bean时的歧义问题，通过指定具体的Bean名称来精确注入。

- **@Value**：用于注入基本类型和字符串值，可以从属性文件中读取值。

#### `@Resource`

- 属于JSR-250注解，默认按名称进行装配。
- 如果没有指定名称，那么默认按类型进行装配。
- 可以用在字段或setter方法上。

```java
@Component
public class ExampleService {
    @Resource(name = "myExampleRepository")
    private ExampleRepository exampleRepository;
    
    // Other methods
}
```

**注意事项**

- 使用`@Resource`时，确保为Bean提供了正确的名称或确保有适合的类型匹配。
- `@Resource`不支持Spring的`@Primary`注解和复杂的自动装配功能。

#### `@Autowired`

- 属于Spring的注解，默认按类型进行装配。
- 如果找到多个相同类型的Bean，可以结合`@Qualifier`注解指定注入Bean的名称。
- 可以用在构造器、字段、setter方法或任何方法上。

```java
@Component
public class ExampleService {
    @Autowired
    private ExampleRepository exampleRepository;
    
    // Other methods
}
```

**注意事项**

- 使用`@Autowired`时无需显式指定Bean的名称，Spring容器将自动寻找类型匹配的Bean进行注入。
- 在多个同类型的Bean可用时，可配合`@Qualifier`注解来指定要注入的Bean名称。
- `@Autowired`支持使用`@Primary`来标记优先注入的Bean，当有多个同类型的Bean时会首选标记了`@Primary`的Bean。

::: info @Resource和@Autowired对比总结
1. 来源：`@Resource`源自JDK标准注解，`@Autowired`源自Spring框架。
2. 按类型 vs 按名称：`@Autowired`默认按类型装配；`@Resource`默认按名称进行装配，如未指定则按类型。
3. 可选性：`@Autowired(required=false)`可以用来标注一个非必须的依赖，而`@Resource`没有这样的特性。
4. 自定义装配：`@Autowired`配合`@Qualifier`能够更精细地控制装配过程。

在选择使用`@Resource`还是`@Autowired`时，考虑依赖注入的精确性和便利性。如果需要JDK标准的注解且按名称注入，使用`@Resource`。如果需要Spring框架提供的高级自动装配功能，使用`@Autowired`。
:::

### 依赖注入-字段注入

字段注入（Field Injection）是指Spring容器直接对类中的字段进行赋值，无需通过构造器或setter方法。这种依赖注入方法通过反射机制实现，允许私有字段被注入，不需要暴露公共的setter方法。

- **注解方式实现字段注入**

使用`@Autowired`注解直接标注于类成员变量（字段）上，Spring会自动寻找匹配的bean进行注入。

```java
@Component
public class ExampleService {
    
    @Autowired
    private ExampleRepository exampleRepository;
    
    // 使用exampleRepository的方法...
}
```

在上述代码中，`ExampleService`需要`ExampleRepository`类型的依赖。通过为`exampleRepository`成员变量添加`@Autowired`注解，Spring容器会在上下文中查找`ExampleRepository`类型的bean并为该字段赋值。

**注意**：Spring不支持通过XML配置进行字段注入，而是使用Setter方法注入或构造器注入


::: tip 为什么不再推荐使用字段注入

尽管字段注入因其简便性在某些场景下很受欢迎，但它存在一些潜在问题，因此不再是推荐的做法：

### 1. 破坏封装性

- 字段注入允许Spring容器通过反射直接访问私有字段，违反了Java的封装原则。这意味着外部代码可以绕过类自己的构造逻辑而直接修改其状态。

### 2. 降低了类的可测试性

- 使用字段注入的类难以进行单元测试，因为注入逻辑完全由Spring容器控制。在不启动Spring容器的情况下，需要使用反射等方式手动为这些字段赋值。

### 3. 循环依赖问题

- 字段注入增加了循环依赖的风险。如果两个类互相通过字段注入依赖对方，Spring容器在初始化它们时可能会遇到困难，导致Bean构造失败。

### 4. 依赖不明确

- 所有依赖都隐含在类的内部，从外部很难看出类的依赖情况，尤其是必须的依赖不像构造器注入那样一目了然。这使得代码的理解和维护变得更加困难。

鉴于以上问题，现在通常推荐使用构造器注入来替代字段注入。构造器注入强制依赖在对象构造时就必须提供，有利于依赖的明确性和对象的不变性，同时也提高了代码的可测试性。此外，构造器注入自然地避免了循环依赖的问题，因为它要求循环依赖在编译时就被解决。
:::

### 依赖注入-Setter注入

Setter注入是一种通过调用Bean的setter方法来实现依赖注入的方式。在Spring中，使用Setter方法注入意味着容器调用无参构造器或无参静态工厂方法来实例化Bean，然后调用Bean的setter方法来注入依赖。

- **注释方式实现Setter注入**

使用`@Autowired`注解标注在setter方法上，这会使得Spring容器在完成Bean的实例化后，调用相应的setter方法来完成依赖的注入。


```java
@Component
public class ExampleService {
    
    private ExampleRepository exampleRepository;

    @Autowired
    public void setExampleRepository(ExampleRepository exampleRepository) {
        this.exampleRepository = exampleRepository;
    }

    // 其他使用exampleRepository的方法...
}
```

在上述代码中，Spring将自动寻找类型为`ExampleRepository`的Bean，并通过调用`setExampleRepository()`方法将其注入`ExampleService`类。

- **XML配置方式实现Setter注入**

在XML配置中，可以使用`<property>`标签来指定需要注入的依赖。


假设有如下的类定义（无需`@Autowired`注解）：

```java
public class ExampleService {
    
    private ExampleRepository exampleRepository;

    public void setExampleRepository(ExampleRepository exampleRepository) {
        this.exampleRepository = exampleRepository;
    }

    // Other methods...
}
```

对应的XML配置如下：

```xml
<bean id="exampleRepository" class="com.example.ExampleRepository"/>

<bean id="exampleService" class="com.example.ExampleService">
    <property name="exampleRepository" ref="exampleRepository"/>
</bean>
```

在这个XML配置中，`exampleService` bean将通过其`setExampleRepository()`方法接收一个引用`exampleRepository` bean的依赖注入。

::: info 使用场景
Setter注入最适合的场景是下列其中之一：

- **可选依赖**：当你有一些不是必须的依赖时，可以考虑使用setter注入。这样可以在无法提供这些依赖时实例化类（虽然在当前版本的Spring中，`@Autowired`注解可以通过将`required`属性设置为`false`来标注可选依赖）。
  
- **变更需求**：当应用程序运行过程中需要更改某些依赖的时候，setter方法提供了重新注入依赖的可能性。

- **循环依赖**：可能需要使用Setter注入来解决构造器注入时出现的循环依赖问题（尽管使用setter并不是解决循环依赖的最佳方式，而是应该重新设计代码）。
::: 


### 依赖注入-构造器注入

构造器注入是通过类的构造函数来实现依赖注入的。当创建Bean实例时，Spring容器会通过匹配的构造器参数来注入所需的依赖。

- **注解方式实现构造器注入**

可以通过在构造器上添加`@Autowired`注解来告诉Spring容器使用这个构造器来注入所需的依赖。Spring会寻找匹配的bean，并且将它们作为参数传递给构造器。

```java
@Component
public class ExampleService {

    private final ExampleRepository exampleRepository;

    @Autowired
    public ExampleService(ExampleRepository exampleRepository) {
        this.exampleRepository = exampleRepository;
    }

    // 其他使用exampleRepository的方法...
}
```

在这个示例中，`ExampleService`类有一个构造器，它接受一个`ExampleRepository`类型的参数。Spring容器会找到这个类型的bean并将其注入。

- **XML配置方式实现构造器注入**

在Spring的XML配置文件中，可以使用`<constructor-arg>`元素来指明构造器参数。

假设我们有一个类似于之前的`ExampleService`，Spring的XML配置文件如下所示：

```xml
<bean id="exampleRepository" class="com.example.ExampleRepository"/>

<bean id="exampleService" class="com.example.ExampleService">
    <constructor-arg ref="exampleRepository"/>
</bean>
```

这告诉Spring容器在创建`exampleService`实例时，应该调用它的构造器，并将`exampleRepository` bean作为参数传递进去。

**使用场景** ：
- **当依赖项是必须的**：如果你的Bean不能在没有必要依赖的情况下存在或正确工作，那么使用构造器注入是理想的，因为它可以确保这些依赖项不为空。
- **不可变性**：构造器注入强化了对象不可变性的实践，只要被注入的依赖定义为`final`，保证了实例创建后其所依赖的对象不会改变。
- **清晰性和有效性**：在Bean构造时所有依赖都必须提供，这提高了代码的清晰度和Bean的有效性。

::: info 构造器注入对循环依赖的处理
构造器注入强制要求在创建Bean前所有的依赖项都必须已经准备好。在构造器注入的情况下，如果存在循环依赖，Spring容器会在启动时抛出异常，从而迫使开发者重构应用架构来解决依赖问题，而不是在运行时导致隐蔽的循环依赖错误。
:::
总结来说，构造器注入通过为每一个依赖项提供一个清晰且一致的入口，而且在Bean实例化时就把所有的依赖项固定下来，既确保了Bean的初始化状态的一致性，也可以及时发现循环依赖。

### 获取容器中的Bean

Spring框架中，获取Bean是依赖注入（DI）过程的一部分，它允许开发者从Spring IoC容器中检索已配置和管理的Bean实例。以下是几种常用的获取Bean的方式
- 通过上面的介绍的注解访问
    如：@Autowired, @Resource或@Inject
- 通过ApplicationContext获取
    ```java
    public class App {
        public static void main(String[] args) {
            // 直接从文件系统中的指定路径加载Spring配置文件，这允许你从项目之外的任何位置加载配置
            ApplicationContext context = new FileSystemXmlApplicationContext("file:D:/config/app-config.xml");
            // 从类路径（classpath）中加载Spring配置文件 （通常位于`src/main/resources`）
            ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
            // 从配置类中获取Bean，无需XML配置文件
            ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

            MyService myService = context.getBean(MyService.class);
            myService.doSomething();
        }
    }
    ```
- 实现ApplicationContextAware接口
    ```java
    @Component
    public class MyComponent implements ApplicationContextAware {
        private ApplicationContext applicationContext;

        @Override
        public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
            this.applicationContext = applicationContext;
        }

        public void someMethod() {
            MyService myService = applicationContext.getBean(MyService.class);
            myService.doSomething();
        }
    }
    ```



## 四 AOP面向切面编程

### AOP及关键术语解释

AOP，全称为Aspect-Oriented Programming（面向切面编程），是一种编程范式，用于解决软件开发中的横切关注点问题。横切关注点指的是那些跨越多个模块或组件的功能，如日志记录、事务管理、安全检查等，它们通常与核心业务逻辑相交织，但在传统的面向对象编程（OOP）中难以模块化管理。

通俗来说，AOP就是在运行时，动态地将代码切入到类的指定方法、指定位置上，<span style='color:yellow;background:red;font-size:文字大小;font-family:字体;'>**即对容器中的组件（某个或某些类）的特定方法做一个特定的增强**</span>。也就是说，我们可以使用AOP来帮助我们在方法执行前或执行之后，做一些额外的操作，实际上，它就是代理！

- **切面（Aspect）**：切面是AOP的核心构造块，它封装了横切关注点的实现，包含了通知（Advice）和切入点（Pointcut）的定义。如日志记录的逻辑就是一个切面。
- **通知（Advice）**：通知代表切面中的具体操作，是在特定的连接点执行的代码片段，也就是需要我们自定义的方法。
- **切入点（Pointcut）**：定义了切面中的通知应该在哪些连接点上执行，通过表达式来匹配连接点。
- **连接点（Joinpoint）**：在程序执行过程中可以插入切面操作的点，通常是方法调用。
- **织入（Weaving）**：将切面代码插入到应用程序代码中的过程，Spring AOP支持编译期织入和运行时织入，主要采用后者，即在应用程序运行时动态创建代理对象来实现切面逻辑的插入。

::: tip AOP的实现原理
Spring AOP基于代理模式实现，具体有两种代理方式：

- **JDK动态代理**：当目标对象实现了至少一个接口时，Spring使用JDK动态代理来创建代理对象。这种代理基于反射，为每个接口方法生成一个实现了该接口的代理类。
  
- **CGLIB代理**：如果目标对象没有实现接口，Spring则使用CGLIB库生成目标对象的子类作为代理。这种方式适用于任何类，但因为是通过继承实现，所以不能代理final类。
:::

**AOP的优势：**

- **减少代码耦合**：通过将横切关注点与业务逻辑分离，减少了模块间的直接依赖，增强了系统的可维护性和可扩展性。
- **提高复用性**：切面可以跨多个对象或模块重用，无需在每个类中重复编写相同的横切逻辑。
- **集中管理横切关注点**：便于修改和管理，比如修改日志策略只需调整日志切面，不影响业务代码。
- **增加灵活性**：新加入的横切关注点可以通过添加新的切面轻松实现，无须改动现有代码。

**AOP的使用场景：**

- **日志记录**：在方法调用前后自动记录日志，跟踪程序执行流程和状态。
- **权限控制**：在方法执行前验证用户是否有权限访问。
- **事务管理**：自动管理数据库操作的事务，确保数据一致性。
- **性能监控**：记录方法执行时间，监控系统性能瓶颈。
- **异常处理**：集中处理特定异常，统一异常处理逻辑。
- **缓存**：自动缓存方法的返回结果，提高系统响应速度。

通过AOP，Spring框架允许开发者更专注于业务逻辑，同时保持应用的非功能性需求如日志、安全等得到高效且一致的处理。


### SpringAOP和AspectJ
Spring AOP（面向切面编程）和AspectJ是两个在Java领域广泛使用的AOP框架，它们之间既有区别也有紧密的联系。下面是关于Spring AOP与AspectJ关系的详细说明：

#### Spring AOP

- **基础与定位**：Spring AOP是Spring框架的一部分，主要依赖于Spring的IoC容器来管理切面和目标对象。它是基于代理模式实现的，对于实现了接口的类，Spring AOP默认使用JDK动态代理；对于没有实现接口的类，则使用CGLIB代理。
- **实现方式**：Spring AOP提供了一种较为轻量级的AOP实现，适用于处理简单的横切关注点，如日志记录、性能监控等。它的功能相对有限，主要集中在方法级别的拦截。
- **注解与配置**：Spring AOP支持使用注解（如`@Aspect`, `@Before`, `@After`, `@AfterReturning`, `@AfterThrowing`, `@Around`等）和XML配置来声明切面和切点。

#### AspectJ

- **起源与发展**：AspectJ是一个成熟的、独立的AOP框架，它扩展了Java语言，提供了更加丰富的AOP语法和更广泛的切点定义能力。AspectJ有自己的编译器，可以编译带有切面定义的Java源码，生成标准的Java字节码。
- **全面性**：相比Spring AOP，AspectJ是一个完整的AOP解决方案，能够进行编译时和运行时的 weaving（织入），支持更多的切点表达式，包括构造函数、属性访问、类型声明等，不仅限于方法调用。
- **集成方式**：虽然AspectJ是一个独立的框架，但Spring AOP能够与之集成，利用AspectJ的切点表达式语言和编译器增强功能，提升切面定义的能力。

#### Spring AOP与AspectJ的关系

- **互补与集成**：Spring AOP并没有重新发明轮子，而是选择与AspectJ合作。Spring AOP提供了对AspectJ注解的支持，这意味着你可以在Spring应用中使用AspectJ的注解（如`@Aspect`, `@Pointcut`）来定义切面，但底层的织入机制仍然是Spring AOP的动态代理。
- **编织方式差异**：Spring AOP采用运行时代理（JDK动态代理或CGLIB）的方式进行织入，而AspectJ提供了编译时（通过ajc编译器）和加载时（通过Java Agent）织入的选择，这使得AspectJ能处理更复杂的切面场景。
- **应用场景**：对于简单或中等复杂度的AOP需求，Spring AOP通常已经足够。而对于那些需要在类级别、构造函数、字段访问等更细粒度，或是需要更强大切点表达能力的场景，集成AspectJ的Spring应用会是更好的选择。

综上所述，Spring AOP和AspectJ虽然各有侧重，但Spring AOP通过集成AspectJ的注解和表达式，使得开发者能够在Spring框架内享受AspectJ的强大功能，同时保持了Spring应用的灵活性和轻便性。


::: tip SpringAOP和AspectJ的依赖导入
#### Spring AOP依赖
- **基础Spring AOP**：如果你只是使用Spring自带的AOP功能，比如通过Spring的代理机制（JDK动态代理或CGLIB）来应用简单的切面逻辑，通常只需要Spring的核心库就足够了，因为Spring AOP是Spring框架的一部分。在Maven或Gradle项目中，这通常意味着添加Spring Context模块的依赖，因为它包含了Spring AOP的功能。

#### AspectJ依赖

- **AspectJ注解支持**：如果你想使用AspectJ的注解（如`@Aspect`, `@Before`, `@After`, `@Around`等）来定义切面，那么除了Spring AOP的依赖之外，还需要导入AspectJ的注解库（`aspectjrt`）。这允许你在Spring应用中编写更高级的切面定义，而不需要完全依赖于AspectJ的编译时或加载时织入。

- **AspectJ编织器**：如果要使用AspectJ的编译时织入（CTW）或者加载时织入（LTW）来获得更全面的AOP支持（比如拦截构造函数、静态方法、字段访问等），则需要额外导入AspectJ编织器（`aspectjweaver`）依赖。这对于需要更复杂切面逻辑的场景非常有用，但增加了项目的复杂性和依赖。

#### 关于导入依赖的建议
- 如果你的AOP需求仅限于方法拦截且不涉及复杂的切点表达，那么仅导入Spring核心库就足够了。
- 如果需要更高级的切点表达式或特定的AspectJ功能，但不使用编织器，只需添加AspectJ注解库。
- 对于最复杂的情况，比如需要在编译时或加载时织入切面，才需要同时导入Spring AOP和AspectJ的编织器依赖。
```xml
<dependencies>
    <!-- Spring Core 和 Context 模块，Spring AOP 集成在 Context 模块中 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>${spring.version}</version>
    </dependency>

    <!-- 如果你想要使用AspectJ的注解来定义切面，需要AspectJ的RT库 -->
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjrt</artifactId>
        <version>${aspectj.version}</version>
    </dependency>

    <!-- 如果你计划使用AspectJ的编织器（例如编译时或加载时织入） -->
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>${aspectj.version}</version>
    </dependency>
</dependencies>
```
`aspectjweaver.jar` 包含了 `aspectjrt.jar` 中的功能。简单来说，如果你的项目中同时需要AspectJ的库支持，通常推荐直接引入 aspectjweaver，这样就不必单独再添加 aspectjrt 的依赖了。这样做可以简化依赖管理，并确保所有必要的AspectJ组件都已经包含在内。
:::


### 通过XML配置实现AOP
实现步骤：
1. 定义切面（Aspect）和相关的通知（Advice）。
2. 配置AOP的切入点（Pointcut）以及 通知（Advice）应用的规则。
    通知定义了在切入点匹配的方法执行前后做什么。主要类型有：
    - 前置通知（Before）
    - 后置通知（After）
    - 返回通知（AfterReturning）
    - 异常通知（AfterThrowing）
    - 环绕通知（Around）


#### 1. 定义Aspect和相关的Advice

在这个示例中，我们将创建一个名为`TrackingAspect`的Aspect，用来追踪方法执行：

```java
public class TrackingAspect {

    // 这里的方法名诸如 logMethodEntry、logAfterReturning 等为 Advice（通知）
    public void logMethodEntry(JoinPoint joinPoint) {
        // ...记录日志逻辑...
    }

    public void logAfterReturning(Object returnValue) {
        // ...处理返回值...
    }

    // Around advice 需要返回目标方法的返回值，并且接受ProceedingJoinPoint参数
    // 可以控制是否继续执行目标方法或修改返回值
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            // 方法执行前的逻辑
            // ...

            Object result = joinPoint.proceed();  // 调用原始方法

            // 方法执行后的逻辑
            // ...
            return result;
        } catch (Exception ex) {
            // 异常处理逻辑
            System.out.println("Exception handling logic");
            throw ex;
        } finally {
            // 无论目标方法执行成功或异常都会执行这里的代码
        }
    }
}
```

#### 2. 配置AOP的Pointcut以及Advice应用规则

在Spring XML配置中配置Aspect、Pointcut和Advice：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd">
    
    <bean id="trackingAspect" class="com.yourpackage.TrackingAspect"/>

    <aop:config>
        <!-- 切入点，用于定义Advice应用的地方 -->
        <aop:pointcut id="trackOperation" expression="execution(* com.yourpackage..*(..))"/>
        <!-- 定义切面和通知 -->
        <aop:aspect ref="trackingAspect">
            <!-- 前置通知，在方法执行之前执行 -->
            <aop:before pointcut-ref="trackOperation" method="logMethodEntry" />

            <!-- 后置返回通知，在方法成功执行后执行 -->
            <aop:after-returning pointcut-ref="trackOperation" method="logAfterReturning" returning="returnValue"/>

            <!-- 环绕通知，在方法执行前后执行 -->
            <aop:around pointcut-ref="trackOperation" method="logAround"/>
        </aop:aspect>
    </aop:config>

</beans>
```


#### 通过实现接口减少XML配置

你也可以通过实现Spring AOP提供的接口，如`MethodBeforeAdvice`和`MethodInterceptor`，来减少XML中的配置。

```java
public class BeforeAdvice implements MethodBeforeAdvice {
    @Override
    public void before(Method method, Object[] args, Object target) throws Throwable {
        // ...前置通知逻辑...
    }
}

public class AroundAdvice implements MethodInterceptor {
    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        // ...环绕通知逻辑...
        return invocation.proceed();
    }
}
```

相应的Spring XML配置会像这样：

```xml
<bean id="beforeAdvice" class="com.yourpackage.BeforeAdvice"/>
<bean id="aroundAdvice" class="com.yourpackage.AroundAdvice"/>

<aop:config>
    <aop:advisor advice-ref="beforeAdvice" pointcut-ref="trackOperation"/>
    <aop:advisor advice-ref="aroundAdvice" pointcut-ref="trackOperation"/>
</aop:config>
```

在上述配置中，通过`<aop:advisor>`标签我们将接口实现的Advice与对应的Pointcut关联起来。

Spring AOP 通过这种方式允许我们以更维护和更模块化的方式来管理横切关注点，减少了代码的复杂性，并提高了可扩展性。


### 通过注解方式使用AOP

1. 在项目中添加相关依赖。
2. 启用Spring AOP注解支持，通常在配置类上使用`@EnableAspectJAutoProxy`注解。
3. 创建切面类，并使用`@Aspect`注解该类。
4. 在切面类中，使用`@Pointcut`定义切点，使用Advice相关的注解定义通知逻辑。

#### 1. 添加Spring AOP依赖

在`pom.xml`文件中添加：

```xml
<dependencies>
    <!-- 添加Spring依赖 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.2</version>
    </dependency>
    <!-- 添加AspectJ依赖 -->
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.9.6</version>
    </dependency>
</dependencies>
```

#### 2. 启用Spring AOP注解支持

在Spring配置类中启用AOP：

```java
@Configuration
@EnableAspectJAutoProxy
public class AopConfig {
    // 配置类内容
}
```

To enable @AspectJ support with XML-based configuration：

```xml
<aop:aspectj-autoproxy/>
```

#### 3. 创建切面类

定义一个切面类：

```java
@Component
@Aspect
public class LoggingAspect {

    // 定义切点 表示匹配 `com.example.service` 包下任意类的任意方法
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceLayer() {
    }

    // 前置通知
    @Before("serviceLayer()")
    public void logMethodCall(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("Before method: " + methodName);
    }

    // 环绕通知
    @Around("serviceLayer()")
    public Object logMethodExecution(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        Object result = proceedingJoinPoint.proceed();  // 继续执行连接点的方法

        long elapsedTime = System.currentTimeMillis() - start;
        System.out.println("Execution of " + proceedingJoinPoint.getSignature().getName() + " took " + elapsedTime + "ms");

        return result;
    }

    // 返回通知
    @AfterReturning(pointcut = "serviceLayer()", returning = "result")
    public void logMethodReturn(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("After returning from method: " + methodName + " with result: " + result);
    }

    // 异常通知
    @AfterThrowing(pointcut = "serviceLayer()", throwing = "error")
    public void logMethodException(JoinPoint joinPoint, Throwable error) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("Exception in method: " + methodName + " with message: " + error.getMessage());
    }

    // 后置通知
    @After("serviceLayer()")
    public void logMethodExit(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("After method: " + methodName);
    }
}
```



### Aspect的执行顺序

在Spring AOP中，当你的切面（Aspect）包含了前置通知（Before）、后置通知（After）、返回通知（AfterReturning）、异常通知（AfterThrowing）和环绕通知（Around）时，它们的执行顺序遵循以下规则：

1. **环绕通知（Around）- 前半部分**
   - `Around`通知是首个被调用的，因为它可以决定是否执行目标方法以及其他通知。它的前半部分（在调用`ProceedingJoinPoint.proceed()`之前的代码）最先执行。

2. **前置通知（Before）**
   - 如果环绕通知决定继续执行，则紧接着会执行前置通知。前置通知在目标方法执行前调用，但是在环绕通知的`ProceedingJoinPoint.proceed()`方法被调用后。

3. **目标方法执行**
   - 目标方法现在开始执行。

4. **环绕通知（Around）- 后半部分**
   - 如果目标方法成功执行（无异常抛出），则`Around`通知的余下部分（`ProceedingJoinPoint.proceed()`调用后的代码）将执行。

5. **返回通知（AfterReturning）**
   - 如果目标方法成功完成并返回了，返回通知就会被调用。这个通知可以访问到方法的返回值。

6. **异常通知（AfterThrowing）**
   - 如果目标方法在执行过程中抛出异常，那么异常通知将会被触发，这是对异常情况的处理。

7. **后置通知（After）**
   - 不管目标方法是正常完成还是抛出了异常，后置通知都会执行。后置通知相当于finally块，用于保证一些清理工作的执行。

这里需要注意的重要一点是：
- `AfterThrowing`和`AfterReturning`是互斥的，也就是说，如果方法执行过程中抛出异常，则`AfterReturning`通知不会执行；反之，如果方法正常返回，则`AfterThrowing`通知不会执行。
- `After`通知不管方法正常执行还是异常终止，都会执行，这类似于Java中try/catch块中的finally。

以上描述了理想情况下这些Advice的执行顺序，但请记住 环绕通知逻辑 可以改变流程，比如可以决定不执行目标方法或在各个阶段执行额外的逻辑。






### Pointcut切入点表达式

切入点表达式的基本形式基于AspectJ的切点表达式语言，它非常灵活且强大。基本结构包括：

- **execution**: 用于匹配方法执行的连接点，是最常用的表达式类型。
- **within**: 限制匹配到指定类型内的方法执行。
- **this**: 限定AOP代理必须是给定类型的实例。
- **target**: 限定目标对象必须是给定类型的实例。
- **args**: 限定方法参数必须匹配指定的类型。
- **@annotation**: 限定方法必须有指定的注解。
- **&&, ||, !**: 逻辑运算符，用于组合或否定表达式。

#### execution表达式详解

`execution` 表达式的格式如下：

```java
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern? name-pattern(param-pattern) throws-pattern?)

execution(<修饰符模式>？ <返回值类型模式>  <方法名模式> (<参数模式>) <异常模式>？)

# 除了返回类型模式，方法名模式和参数模式外，其它项都是可选的
```

- **modifiers-pattern**: 方法的访问修饰符，如`public`, `private`等，可省略。
- **ret-type-pattern**: 方法返回类型，如`void`, `*`（任意类型）等。
- **declaring-type-pattern**: 方法所属的类或接口的全限定名，如`com.example.MyClass`，可使用`*`作为通配符。
- **name-pattern**: 方法名称，如`myMethod`，`*`表示任何方法名。
- **param-pattern**: 参数列表，如`(int, String)`，`(*)`表示任意数量和类型的参数，`(..)`表示任意参数列表。
- **throws-pattern**: 方法抛出的异常列表，较少使用，通常省略。

| 模式 | 描述 |
| - | - |
| 修饰符 | public 表示public 级别方法。 可以不写，不写表示匹配所有的方法（public,private,protected等级别的方法） |
| 返回值类型 | 表示方法返回值的类型，  * 表示全部 （注意：类名要写全限定类名） |
| 包名 + 方法名 | 表示具体的包名，可以使用通配符，中间可以使用 `两个点`  省略，但包名开头和方法名不能省略 |
| 方法参数 | 省略不写代表无参方法，`*` 代表单个任意类型的参数, `..`  代表任意数量的任意类型的参数 |
| 异常 | 表示全部 |

**示例**：

- **匹配com.example.service包下所有类的任何公共方法**:
  ```java
  execution(public * com.example.service..*.*(..))
  ```

- **匹配MyService类中所有以do开头的方法**:
  ```java
  execution(* com.example.service.MyService.do*(..))
  ```

- **匹配具有特定注解的方法**:
  ```java
  @annotation(com.example.MyAnnotation)
  ```

#### 组合使用

你可以通过逻辑运算符组合这些表达式，创建更复杂的规则。例如，只匹配特定接口的方法：

```java
within(com.example.MyInterface+) && execution(* *(..))
```

**execution表达式的局限性**：

如果要增强的这些方法之间没有啥联系，如果强行建立联系，有可能把不需要增强的方法也划定到范围了

这是可以考虑使用 下面的 `@annotation` 的方式



**@annotation** 

需要自定义注解，直接将切入点和要增强的方法耦合起来 ，这是一种更精细的切入点的管理 → 指哪打哪

注解增加在组件中的哪一个方法上，哪一个方法就被增加到切入点的范围

使用示例：

```java

// 自定义一个新的注解
@Target(ElementType.METHOD)           // 注解可以出现在什么位置 → 方法上
@Retention(RetentionPolicy.RUNTIME)   // 注解在何时生效 → 运行时
public @interface CountTime {
    
}


// 在需要增强的方法上使用该注解即可
@CountTime
@Override
public String serviceMethod(User user) {
	// logic
}

```

<br>

当然，不要忘记在配置文件中 配置 该注解为 pointcut

```xml

<aop:config>

    <!--annotation-->
    <aop:pointcut id="mypointcut" expression="@annotation(com.xxx.anno.CountTime)"/>

    <aop:advisor advice-ref="countExecutionTimeAdvice" pointcut-ref="mypointcut"/>
    
</aop:config>

```


### JoinPoint连接点及参数

在Spring AOP（面向切面编程）中，`JoinPoint`是一个非常关键的概念，它是AspectJ库提供的一个接口，用来代表切面（Aspect）所介入的连接点（JoinPoint），即程序执行过程中的某个特定位置，如方法调用、异常抛出等。当切面中的通知（Advice）被执行时，Spring会自动传递一个`JoinPoint`实例给通知方法，让我们能够获取和操作与当前连接点相关的信息。以下是关于`JoinPoint`及其参数的详细说明：

#### JoinPoint的主要作用

1. **获取连接点信息**：提供了一组方法来获取执行点的详细信息，比如目标方法的签名、参数、目标对象等。
2. **执行上下文**：提供了连接点执行时的上下文环境，帮助我们理解当前切面是在哪个方法、哪个类中被触发的。
3. **动态决策**：在环绕通知（`@Around`）中，可以通过`JoinPoint`来决定是否继续执行目标方法，以及如何处理目标方法的返回值或异常。

#### JoinPoint的主要方法

1. **Object getTarget()**：返回目标对象，即被代理的对象，而不是代理对象本身。这有助于在切面中直接操作目标对象。

2. **Signature getSignature()**：获取连接点的签名，包含方法名、参数类型、所属类等信息。这对于日志记录或执行条件判断非常有用。

3. **String getSignature().toShortString()**：返回签名的简短字符串表示，常用于日志输出。

4. **Object[] getArgs()**：获取目标方法调用时传入的参数数组。这使得在通知逻辑中可以根据参数值做出不同处理。

5. **Object getThis()**：返回代理对象的引用，在某些场景下可能需要区分代理对象和目标对象。

6. **SourceLocation getSourceLocation()**：获取连接点的源代码位置，如文件名和行号，但这在Spring AOP中可能不可用。

#### 使用JoinPoint的示例

在环绕通知中，`JoinPoint`可以作为参数传递进来，让我们有机会基于连接点的信息做出处理决策：

```java
@Around("execution(* com.example.service.MyService.*(..))")
public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
    // 获取方法签名
    Signature signature = joinPoint.getSignature();
    System.out.println("Executing method: " + signature.getName());

    // 记录方法参数
    Object[] args = joinPoint.getArgs();
    for (Object arg : args) {
        System.out.println("Argument: " + arg);
    }

    // 执行目标方法
    Object result = joinPoint.proceed(args);

    // 处理返回值或异常
    System.out.println("Method returned: " + result);

    return result;
}
```

总之，`JoinPoint`接口在Spring AOP中扮演着桥梁的角色，它让切面逻辑能够感知到其运行的上下文，从而更加智能和灵活地执行切面任务。s


















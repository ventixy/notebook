---

order: 10
title:  Spring生命周期

---


## Spring生命周期
Spring生命周期涉及到框架管理Bean的过程，从创建Bean开始，到最终销毁Bean的整个流程。整个生命周期涵盖了Spring管理Bean的各个方面，提供了强大的扩展机制，允许开发者根据需求自定义Bean的创建、初始化和销毁过程。通过接口或配置进行生命周期方法的指定，可以灵活地插入自定义逻辑，使得Spring应用更加灵活和强大。


### 实例化并设置属性

#### 1. **Bean定义读取与注册**
- Spring容器首先读取配置元数据（如XML配置文件、注解或Java配置类），解析这些配置来创建`BeanDefinition`对象。每个`BeanDefinition`封装了一个Bean的配置信息，包括类名、作用域、初始化方法、销毁方法等。
- `BeanDefinition`被注册到`BeanDefinitionRegistry`中，通常是`DefaultListableBeanFactory`的一个实例，它维护了一个`BeanDefinition`的注册表。

#### 2. **Bean实例化**
- 当应用请求一个Bean（通过`ApplicationContext.getBean()`方法）或在容器启动过程中自动装配依赖时，Spring会检查`BeanDefinition`来确定是否需要创建一个新的Bean实例。
- 对于需要实例化的Bean，Spring使用`BeanFactory`的子类，如`AbstractAutowireCapableBeanFactory`，调用`doCreateBean`方法开始实例化过程。
- 实例化过程包括：
  - **内存分配**：使用Java反射API（如`Class.newInstance()`或通过构造函数调用`newInstance()`）为Bean分配内存并创建实例。
  - **属性填充**：通过反射调用Bean的setter方法或使用字段注入来注入依赖的Bean或值。




### Aware相关接口
在Spring框架中，`Aware`接口家族是一系列特殊的接口，它们主要用于向Spring管理的Bean提供对Spring容器及其环境的特定部分的访问能力。当一个Bean实现了这些接口时，Spring会在适当的时机调用对应的方法，将相关信息注入到Bean中。这使得Bean能够“意识到”自己所在的Spring环境，从而具备了特定的功能或访问权限。以下是几个常见的`Aware`接口及其用途：

#### 1. `BeanNameAware`

- **作用**：当Bean实现了`BeanNameAware`接口时，Spring会在初始化该Bean之后调用`setBeanName(String beanName)`方法，传递给它在配置中定义的Bean名称。这允许Bean知道自己的逻辑名称，有助于在内部逻辑中引用。

- **使用场景**：适用于需要根据Bean名称做特殊处理的场景，比如日志记录、动态配置调整等。

- **代码示例**：

```java
import org.springframework.beans.factory.BeanNameAware;

public class MyBean implements BeanNameAware {
    
    private String beanName;

    @Override
    public void setBeanName(String name) {
        this.beanName = name;
        System.out.println("Bean name is set to: " + name);
    }
}
```

#### 2. `BeanFactoryAware`

- **作用**：通过实现`BeanFactoryAware`接口，Bean可以获得一个对`BeanFactory`的引用。这使得Bean能够在运行时通过工厂获取其他Bean或者执行某些Bean工厂级别的操作。

- **使用场景**：当Bean需要动态地查找或创建其他Bean时，或需要访问容器的特性，比如解析SpEL表达式。

- **代码示例**：

```java
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;

public class MyBean implements BeanFactoryAware {
    
    private BeanFactory beanFactory;

    @Override
    public void setBeanFactory(BeanFactory factory) {
        this.beanFactory = factory;
        System.out.println("BeanFactory set");
    }

    public void someMethod() {
        // 使用BeanFactory获取另一个Bean
        AnotherBean anotherBean = beanFactory.getBean(AnotherBean.class);
    }
}
```

#### 3. `ApplicationContextAware`

- **作用**：实现了`ApplicationContextAware`接口的Bean可以获得一个对`ApplicationContext`的引用。`ApplicationContext`相比`BeanFactory`提供了更多的功能，如访问资源、发布事件、获取Bean的AOP代理等。

- **使用场景**：需要访问容器上下文中的各种服务，或者需要参与容器事件处理的Bean。

- **代码示例**：

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class MyBean implements ApplicationContextAware {
    
    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext context) throws BeansException {
        this.applicationContext = context;
        System.out.println("ApplicationContext set");
    }

    public void someMethod() {
        // 使用ApplicationContext获取资源或发布事件等
    }
}
```

通过实现这些`Aware`接口，开发者可以利用Spring容器的强大功能，让Bean更加灵活和强大。然而，需要注意的是，直接使用这些接口会增加代码与Spring框架的耦合度，因此在不需要特定功能时，应尽量避免使用。


::: tip Aware相关接口的执行顺序
如果一个Bean同时实现了`BeanNameAware`、`BeanFactoryAware`和`ApplicationContextAware`这三个接口，Spring在实例化和初始化该Bean时，调用这些接口方法的顺序是固定的：

1. **BeanNameAware.setBeanName(String beanName)**：首先，Spring会调用`setBeanName`方法，传递给Bean它的名称（ID）。这意味着Bean可以在这个阶段了解到它在配置中的逻辑名称。

2. **BeanFactoryAware.setBeanFactory(BeanFactory beanFactory)**：紧接着，Spring会调用`setBeanFactory`方法，向Bean提供对BeanFactory的引用。此时，Bean可以访问到Spring容器的核心功能，比如按需获取其他Bean。

3. **ApplicationContextAware.setApplicationContext(ApplicationContext applicationContext)**：最后，如果Bean也实现了`ApplicationContextAware`，Spring会调用`setApplicationContext`方法，传递ApplicationContext的引用。ApplicationContext是BeanFactory的高级形式，提供了更多如消息资源、事件发布等服务。

总结起来，调用顺序是：**BeanNameAware → BeanFactoryAware → ApplicationContextAware**。这样的顺序保证了Bean可以逐步获得越来越多的上下文信息，从最基础的Bean名称开始，直到拥有整个应用上下文的访问权限。在实际开发中，根据具体需求选择实现相应的Aware接口，以获取必要的环境信息和支持。
:::


### BeanPostProcessor
在Spring框架中，`BeanPostProcessor`接口是一个非常重要的扩展点，它允许开发者干预Bean的初始化过程，通过自定义逻辑在Bean的初始化前后添加额外的操作。这使得开发者能够对Bean进行额外的处理，如属性修改、代理生成等，而无需修改Bean本身的代码

**作用**：
- **postProcessBeforeInitialization(Object bean, String beanName)**：在任何初始化回调（如自定义的初始化方法或`InitializingBean.afterPropertiesSet()`）之前，Spring会调用此方法。开发者可以在这个阶段对Bean进行修改，例如添加额外的属性或修改已存在的属性值。
- **postProcessAfterInitialization(Object bean, String beanName)**：在Bean的所有初始化回调执行完毕后，Spring调用此方法。此时，开发者可以基于Bean的最终状态进行进一步的处理，如代理的创建、AOP织入等。

**使用场景**：
- AOP代理的自动创建。
- 自动实现缓存逻辑。
- 日志记录，监控或统计Bean的创建和使用情况。
- 动态代理，为Bean添加额外的行为。

**代码示例**：

```java
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;

public class MyBeanPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("Before Initialization of Bean: " + beanName);
        // 可以在这里对bean进行预处理
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("After Initialization of Bean: " + beanName);
        // 可以在这里对bean进行后处理
        return bean;
    }
}
```

要在Spring容器中使用这个`BeanPostProcessor`，你需要将其作为一个Bean定义在配置中，Spring会自动识别并应用它：

```xml
<bean id="myBeanPostProcessor" class="com.example.MyBeanPostProcessor"/>
```

或在Java配置中：

```java
@Configuration
public class AppConfig {
    @Bean
    public MyBeanPostProcessor myBeanPostProcessor() {
        return new MyBeanPostProcessor();
    }
}
```

**InstantiationAwareBeanPostProcessor接口** : 

`InstantiationAwareBeanPostProcessor`是`BeanPostProcessor`的子接口，提供了额外的回调方法，允许在Bean实例化前后执行自定义逻辑，进一步扩展了Bean的生命周期管理。

**新增方法**：
- **postProcessBeforeInstantiation(Class<?> beanClass, String beanName)**：在Bean实例化之前调用，可以通过返回一个非null对象来替代默认的实例化过程。
- **postProcessAfterInstantiation(Object bean, String beanName)**：在Bean实例化之后但在属性填充之前调用，可以决定是否继续属性填充过程。

**使用场景**：
- 高级的Bean实例化控制，如基于类型或条件的实例化替换。
- 控制某些Bean是否需要属性填充。

::: tip 使用BeanPostProcessor接口的注意事项
`BeanPostProcessor`接口在Spring框架中扮演着极其关键的角色，允许开发者在Bean的初始化前后插入自定义的处理逻辑。然而，在使用这个接口时，有几个重要的注意事项需要遵循，以确保其正确且高效地工作：

1. **全局影响**：与一些仅针对特定Bean的配置不同，一旦将`BeanPostProcessor`实现类注册到Spring容器中，它将会影响容器中几乎所有Bean的实例化过程。这意味着你需要小心设计你的逻辑，避免对不期望的Bean产生副作用。

2. **顺序与优先级**：如果有多个`BeanPostProcessor`实现，它们的执行顺序由Spring容器决定，通常是按照它们在容器中定义的顺序。如果处理顺序很重要，可以通过实现`Ordered`接口或使用`@Order`注解来指定执行优先级。

3. **返回值**：`postProcessBeforeInitialization`和`postProcessAfterInitialization`方法都必须返回一个Object对象，这个对象通常应该是处理后的Bean实例。如果返回`null`，则Spring可能无法继续后续的初始化流程，特别是对于`postProcessAfterInitialization`，这可能导致错误。

4. **循环引用问题**：当`BeanPostProcessor`本身也需要被Spring管理，并且它的逻辑中直接或间接引用了它自己或其它未完全初始化的Bean时，可能会引发循环引用或早期初始化问题。解决这类问题通常需要仔细设计Bean的依赖关系和初始化逻辑。

5. **资源消耗**：由于`BeanPostProcessor`应用于每个Bean，因此它可能会增加应用的启动时间和资源消耗。特别是当处理逻辑复杂或涉及到大量Bean时，这一点尤为重要。

6. **谨慎修改Bean**：在`BeanPostProcessor`中修改Bean的状态时要格外小心，确保不会破坏Bean的预期行为或导致不可预料的后果。特别是对于第三方库的Bean，直接修改可能违反其内部假设，导致运行时错误。
:::



### 初始化Bean
初始化Bean主要包括实现接口和声明`init-method`两种方式。这些机制允许开发者在Bean被Spring容器完全初始化后执行自定义的初始化逻辑。

#### 1. 实现InitializingBean接口

- **作用**：当一个类实现了`org.springframework.beans.factory.InitializingBean`接口时，Spring会在所有必需的属性设置完成后，调用其`afterPropertiesSet()`方法。这使得开发者可以在该方法中执行任何需要的初始化操作。

- **使用场景**：适合需要在所有属性设置完成之后立即进行初始化的情况。

- **代码示例**：

```java
import org.springframework.beans.factory.InitializingBean;

public class MyBean implements InitializingBean {
    
    private String property;

    public void setProperty(String property) {
        this.property = property;
    }

    @Override
    public void afterPropertiesSet() {
        System.out.println("InitializingBean's afterPropertiesSet method called.");
        // 进行初始化操作
    }
}
```

#### 2. 声明`init-method`

- **作用**：在Spring的XML配置文件或Java配置中，可以为Bean指定一个初始化方法，使用`init-method`属性。当Bean实例化并配置完成后，Spring会自动调用该指定的方法。

- **使用场景**：更灵活，尤其是当初始化逻辑较为复杂或需要访问非Spring管理的资源时。

- **XML配置示例**：

```xml
<bean id="myBean" class="com.example.MyBean" init-method="initMethod"/>

```

- **Java配置示例**：

```java
@Configuration
public class AppConfig {
    @Bean(initMethod = "initMethod")
    public MyBean myBean() {
        return new MyBean();
    }
}

public class MyBean {
    
    public void initMethod() {
        System.out.println("init-method called.");
        // 执行初始化操作
    }
}
```

#### 3. `@PostConstruct`注解

虽然不是直接属于Spring提供的接口，但Java EE规范中的`@PostConstruct`注解也可以用来标记初始化方法，Spring框架同样支持这一注解。

- **作用**：标记在方法上，Spring会在Bean的依赖注入完成后调用该方法，作为Bean的初始化操作。

- **使用场景**：提供了一种标准化的初始化方法标记方式，适用于希望保持代码与Java EE兼容的场景。

- **代码示例**：

```java
public class MyBean {
    
    @PostConstruct
    public void init() {
        System.out.println("@PostConstruct method called.");
        // 执行初始化操作
    }
}
```

::: tip 初始化顺序
- 当一个Bean同时实现了`InitializingBean`接口、声明了`init-method`，以及使用了`@PostConstruct`注解时，Spring会按照以下顺序调用这些初始化方法：
  1. `@PostConstruct`注解的方法（如果存在）。
  2. `InitializingBean`的`afterPropertiesSet()`方法。
  3. `init-method`指定的方法。

- 开发者应根据实际需求选择合适的初始化机制，避免不必要的复杂性，保持代码的清晰和可维护性。
:::



### 销毁Bean

在Spring框架中，销毁Bean也有几种不同的机制，包括实现特定接口和声明`destroy-method`，以便在Bean不再需要时执行清理或资源释放操作。

#### 1. 实现DisposableBean接口

- **作用**：如果一个Bean实现了`org.springframework.beans.factory.DisposableBean`接口，Spring容器在关闭时会调用其`destroy()`方法。这使得Bean可以执行必要的清理操作，如关闭数据库连接、释放文件句柄等。

- **使用场景**：适用于需要在容器关闭时释放资源的Bean。

- **代码示例**：

```java
import org.springframework.beans.factory.DisposableBean;

public class MyBean implements DisposableBean {
    
    public void cleanup() {
        System.out.println("cleanup method called.");
        // 执行清理操作
    }

    @Override
    public void destroy() throws Exception {
        cleanup();
    }
}
```

#### 2. 声明`destroy-method`

- **作用**：在Spring的配置中，可以为Bean指定一个销毁方法，使用`destroy-method`属性。当Spring容器关闭时，会调用这个方法来清理资源。

- **使用场景**：提供了更为灵活的销毁逻辑定义方式，特别是当清理操作较复杂或与特定业务逻辑紧密相关时。

- **XML配置示例**：

```xml
<bean id="myBean" class="com.example.MyBean" destroy-method="cleanup"/>
```

- **Java配置示例**：

```java
@Configuration
public class AppConfig {
    @Bean(destroyMethod = "cleanup")
    public MyBean myBean() {
        return new MyBean();
    }
}

public class MyBean {
    
    public void cleanup() {
        System.out.println("destroy-method called.");
        // 执行清理操作
    }
}
```

#### 3. `@PreDestroy`注解

类似于初始化阶段的`@PostConstruct`，Java EE规范中的`@PreDestroy`注解也可以用来标记销毁方法，Spring框架支持此注解。

- **作用**：标记在方法上，Spring在容器关闭时会调用该方法，作为Bean的清理操作。

- **使用场景**：提供了一种标准化的销毁方法标记方式，适合追求代码规范性和跨框架兼容性的场景。

- **代码示例**：

```java
public class MyBean {
    
    @PreDestroy
    public void cleanup() {
        System.out.println("@PreDestroy method called.");
        // 执行清理操作
    }
}
```

::: tip 注意事项和执行顺序
- 对于单例（singleton）的Bean，Spring容器管理其完整的生命周期，包括销毁过程，因此`destroy-method`、`DisposableBean`的`destroy()`方法以及`@PreDestroy`注解的方法会被调用。但对于原型（prototype）scope的Bean，Spring容器在创建后即交给客户端管理，不负责销毁，因此不会调用销毁方法。
- 当一个Bean同时实现了`DisposableBean`接口、声明了`destroy-method`，以及使用了`@PreDestroy`注解时，Spring会按照以下顺序调用这些销毁方法：
  1. `@PreDestroy`注解的方法（如果存在）。
  2. `DisposableBean`的`destroy()`方法。
  3. `destroy-method`指定的方法。

开发者应根据Bean的实际需求选择合适的销毁机制，确保资源得到恰当的管理和释放，避免内存泄漏和资源占用问题。
:::


### 完整的生命周期

Spring Bean的生命周期从Bean的定义开始，经过实例化、属性填充、初始化、使用，直到最终的销毁，是一个完整的过程。在此过程中，SpringAOP主要在Bean实例化后但在初始化前后介入，通过代理模式来增强Bean的功能。以下是Spring Bean生命周期的详细步骤，以及Spring AOP的作用位置，最后附上一个简化的Mermaid流程图表示。

**Spring Bean生命周期的完整执行流程**：

1. **Bean定义**：Spring容器读取配置元数据（XML、注解或Java配置类），解析并注册Bean定义。

2. **实例化**：根据Bean定义，Spring使用反射创建Bean实例。对于原型（prototype）作用域的Bean，每次请求都会创建一个新的实例；而对于单例（singleton）作用域，默认情况下只创建一次实例。

3. **属性填充**：Spring利用依赖注入（DI）填充Bean实例的属性值，包括自动装配其他Bean、配置值等。

4. **Aware接口注入**：如果Bean实现了`BeanNameAware`、`BeanFactoryAware`、`ApplicationContextAware`等Aware接口，Spring会调用相应的方法，传递Bean的名称、BeanFactory或ApplicationContext给Bean。

5. **Spring AOP介入**：在实例化和初始化之间，Spring AOP通过动态代理（JDK动态代理或CGLIB）创建代理对象，将切面（Aspect）织入。这是Spring AOP发挥作用的阶段，它可以在调用方法前后、环绕方法执行、异常抛出等时机插入自定义逻辑。

6. **初始化前置处理**：如果有实现`InstantiationAwareBeanPostProcessor`的BeanPostProcessor，其`postProcessBeforeInitialization`方法会被调用。

7. **初始化**：
   - **初始化方法**：通过`@PostConstruct`注解的方法或者在Bean定义中声明的`init-method`会被调用。
   - 如果Bean实现了`InitializingBean`接口，`afterPropertiesSet`方法会被调用。

8. **初始化后置处理**：实现了`BeanPostProcessor`的类的`postProcessAfterInitialization`方法会被调用，这是对Bean进行额外处理的最后机会，如AOP代理的最终调整。

9. **使用**：Bean处于就绪状态，可以被应用程序使用。

10. **销毁前置处理**：容器关闭时，如果有实现`DestructionAwareBeanPostProcessor`的BeanPostProcessor，其`postProcessBeforeDestruction`方法会被调用。

11. **销毁**：
    - 如果Bean实现了`DisposableBean`接口，`destroy`方法会被调用。
    - 或者通过Bean定义中声明的`destroy-method`指定的方法会被调用。
    - 使用`@PreDestroy`注解的方法也会在此时执行。

12. **清理**：Spring释放Bean实例和相关资源。



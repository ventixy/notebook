---

order: 30
title:  Spring设计模式

---

## 动态代理及其实现

### 理解代理模式

代理模式（Proxy Pattern）是一种设计模式，它提供了对另一个对象的访问控制，即为其他对象提供一种代理以控制对这个对象的访问。代理对象在客户端和目标对象之间起到中介作用，可以用来增加额外的功能，如访问控制、日志记录、性能监控等，而不需要修改目标对象的代码。

**代理模式的参与者**：
- **Subject（抽象主题）**：声明了真实主题和代理对象的共同接口，这样一来在任何使用真实主题的地方都可以使用代理对象。
- **RealSubject（真实主题）**：实现了Subject接口的==代理对象所代表的真实对象==。
- **Proxy（代理）**：即==代理类，提供了额外的代理服务==，包含对真实主题的引用，在其方法中调用真实主题的方法，可能在调用前后添加额外的操作。

::: tip 代理模式的分类
#### 静态代理
静态代理是在编译期间就确定的代理类，程序员需要为每个真实主题手动创建对应的代理类。这种代理方式的扩展性较差，因为一旦接口发生变化，代理类也需要相应修改。

#### 动态代理
动态代理则是在运行时通过反射机制动态生成代理类，无需为每一个真实主题手动编写代理类。Java中实现动态代理主要有两种方式：
1. **JDK动态代理**：基于`java.lang.reflect.Proxy`类和`java.lang.reflect.InvocationHandler`接口。它只能为实现了至少一个接口的目标类生成代理对象。
2. **CGLIB动态代理**：CGLIB（Code Generation Library）是一个高性能的代码生成库，可以在运行时动态地创建类的子类，适用于没有实现接口的目标类。
:::


**动态代理的应用**:

- AOP（面向切面编程）
动态代理是实现AOP的关键技术之一，通过在方法调用前后插入自定义逻辑（如日志记录、事务管理、权限校验等），使得业务逻辑代码与横切关注点分离，提高代码的可维护性和可复用性。

- 远程代理（RMI、Web Service）
在分布式系统中，远程代理可以隐藏网络通信的细节，让客户端像调用本地对象一样调用远程对象的方法。

- 延迟加载与缓存
在ORM框架（如Hibernate）中，动态代理可以实现懒加载策略，只有当数据真正需要时才去数据库查询，提高系统性能。

- 安全控制
通过动态代理可以在方法调用前验证用户权限，确保只有合法用户才能访问特定资源。

- 性能监控与统计
在方法调用前后收集性能指标，如调用时间、调用频率等，用于系统优化和故障排查。

综上所述，动态代理作为一种灵活的设计模式，在Java开发中有着广泛的应用，特别是在需要在运行时动态扩展或控制对象行为的场景下尤为重要。



### JDK动态代理

JDK动态代理是Java原生支持的一种代理方式，基于`java.lang.reflect.Proxy`类和`java.lang.reflect.InvocationHandler`接口。它允许在运行时动态创建一个实现一组给定接口的新类实例，无需提前编写代理类的代码。这种方式特别适合需要为接口方法添加统一处理逻辑的场景，如日志记录、权限控制等。


**`Proxy.newProxyInstance()`**

此方法用于创建一个指定接口的代理实例，这个代理实例会将所有方法调用转发给它的 invocation handler（调用处理器）。这个方法属于 `java.lang.reflect.Proxy` 类，签名如下：

```java
public static Object newProxyInstance(ClassLoader loader,
                                      Class<?>[] interfaces,
                                      InvocationHandler h)
                                      throws IllegalArgumentException
```

- **`ClassLoader loader`**：指定代理类的类加载器。通常，这应该是与被代理类相同的类加载器，可以通过 `getClass().getClassLoader()` 获取。
- **`Class<?>[] interfaces`**：一个接口数组，指定了代理类需要实现的所有接口。代理类会实现这些接口，并将方法调用转发给 `InvocationHandler`。确保所列出的接口都是非final的，因为Java代理机制不能为final类或接口创建子类或实现。
- **`InvocationHandler h`**：这是代理实例关联的调用处理器对象。当代理实例上的方法被调用时，该处理器的 `invoke()` 方法会被触发，负责处理实际的调用逻辑。

**`InvocationHandler.invoke()`**

`invoke()` 方法位于 `java.lang.reflect.InvocationHandler` 接口内，是代理实例上所有方法调用的实际处理者。其签名如下：

```java
public Object invoke(Object proxy, Method method, Object[] args)
        throws Throwable
```

- **`Object proxy`**：这是代理实例本身。虽然在大多数情况下，在 `invoke()` 方法内部直接使用这个参数的情况不多，但它提供了对代理实例的引用，如果需要可以使用它。
- **`Method method`**：表示被调用的方法的对象。通过这个参数，你可以获取到被调用方法的名字、返回类型、参数类型等信息，从而决定如何处理这个方法调用。
- **`Object[] args`**：包含传递给代理方法调用的参数值的数组。这些参数与原始方法调用时提供的参数完全相同。你可以利用这些参数来决定如何进一步处理方法调用。



代码示例：假设我们正在开发一个日志系统，需要在每个数据库操作前后自动记录日志，而不改变现有数据库访问层的代码

::: code-tabs#shell

@tab:active 使用代码示例

```java
public class Application {
    public static void main(String[] args) {
        // 实际数据库操作对象
        DatabaseOperation realOperation = new RealDatabaseOperation();

        // 创建代理，传入真实主题
        DatabaseOperation proxyOperation = (DatabaseOperation) Proxy.newProxyInstance(
                DatabaseOperation.class.getClassLoader(),
                new Class[]{DatabaseOperation.class},
                new LoggingInvocationHandler(realOperation)
        );

        // 使用代理执行操作
        proxyOperation.queryData("SELECT * FROM users");
        proxyOperation.saveData("INSERT INTO users VALUES ('John Doe', 'john.doe@example.com')");
    }
}
```

@tab Proxy(日志处理代理)

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

// `LoggingInvocationHandler`作为Proxy，
// 动态地在调用`RealDatabaseOperation`的方法前后添加了日志记录逻辑
public class LoggingInvocationHandler implements InvocationHandler {
    private final DatabaseOperation realOperation;

    public LoggingInvocationHandler(DatabaseOperation realOperation) {
        this.realOperation = realOperation;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // Before method call: Logging
        System.out.println("Logging before method: " + method.getName());

        // Invoke the actual method
        Object result = method.invoke(realOperation, args);

        // After method call: Logging
        System.out.println("Logging after method: " + method.getName());

        return result;
    }
}
```



@tab Subject(数据库操作接口)

```java
// `DatabaseOperation`是 Subject，定义了数据库操作的接口
public interface DatabaseOperation {
    void queryData(String query);
    void saveData(String data);
}
```

@tab RealSubject

```java
// `RealDatabaseOperation`是 RealSubject，实现了具体的数据库操作
public class RealDatabaseOperation implements DatabaseOperation {
    @Override
    public void queryData(String query) {
        System.out.println("Executing query: " + query);
    }

    @Override
    public void saveData(String data) {
        System.out.println("Saving data: " + data);
    }
}
```
:::


**注意事项**：
1. **接口限制**：JDK动态代理只能为实现了接口的类生成代理实例，如果你的类没有实现任何接口，将无法直接使用这种方式。
2. **线程安全**：`Proxy.newProxyInstance()`方法创建的代理类实例是线程安全的，可以在多线程环境下安全使用。
3. **性能考量**：虽然动态代理提供了极大的灵活性，但是相比直接调用，它有一定的性能开销，尤其是在方法调用频繁的场景下。
4. **异常处理**：在`InvocationHandler.invoke()`方法内调用`method.invoke()`时，需要捕获并适当处理可能抛出的异常，如`IllegalAccessException`、`InvocationTargetException`等。
5. **资源管理**：确保在`InvocationHandler`中正确处理资源，避免内存泄漏，尤其是在处理资源密集型操作时。


::: info `InvocationHandler.invoke()` 和 `Method.invoke()`

#### `InvocationHandler.invoke()`

- **所属**：此方法属于 `java.lang.reflect.InvocationHandler` 接口。
- **目的**：用于处理代理实例上所有方法的调用。当通过代理对象调用任何方法时，JVM会自动调用此方法，而不是直接调用目标对象的方法。
- **参数**：接收三个参数：代理实例 (`proxy`)、被调用的方法 (`method`) 和方法参数 (`args`)。
- **功能**：它提供了一个集中处理方法调用的入口点，使得在调用实际方法前后可以执行额外的操作，如日志记录、权限检查等。开发人员可以根据需要实现自定义逻辑。


#### `Method.invoke()`

- **所属**：此方法属于 `java.lang.reflect.Method` 类。
- **目的**：用于在给定对象上反射性地执行某个方法。它是直接调用一个对象方法的手段，尤其在动态编程和反射场景中非常有用。
- **参数**：接收两个参数：目标对象 (`obj`) 和方法参数 (`args`)。这里的 `obj` 是你想在其上调用方法的那个对象实例。
- **功能**：它执行了实际的方法调用，允许你在不知道具体方法实现的情况下，通过名称和参数来调用对象的方法。这在运行时动态地处理对象行为时非常有用。

在使用JDK动态代理时，`InvocationHandler.invoke()` 内部通常会调用 `Method.invoke()` 来实现对真实对象方法的调用。换句话说，`Method.invoke()` 是实际执行目标方法的机制，而 `InvocationHandler.invoke()` 提供了一个围绕该调用的包装，允许在调用前后插入自定义逻辑。因此，`InvocationHandler.invoke()` 是更高层次的抽象，它利用了 `Method.invoke()` 来达到代理方法调用的目的。
:::


通过JDK动态代理，可以在不修改目标类代码的情况下，为对象的方法调用添加额外功能，是实现AOP（面向切面编程）的重要技术之一。



<br>

### CGLIB动态代理

CGLIB（Code Generation Library）是一个强大的高性能的代码生成库，它可以在运行期扩展Java类与实现Java接口。与JDK动态代理只服务于实现了接口的类不同，CGLIB能够为没有实现接口的类创建代理对象，通过字节码技术为一个类创建子类，并在子类中加入拦截器来拦截父类方法的调用，以此实现方法的增强。

::: tip 基本原理
CGLIB主要运用了ASM字节码操纵框架，能够动态生成新的类。在创建代理时，CGLIB动态生成一个子类来继承目标类，然后重写目标类的方法，插入代理逻辑。这种方式使得即使目标对象没有实现任何接口，也能进行代理操作。
:::

**CGLIB核心类**：

- **Enhancer**: CGLIB的核心类，用来创建动态代理类。它相当于JDK动态代理中的`Proxy`类，可以为一个类创建动态的子类，并在子类中采用方法拦截的方式进行增强。

- **MethodInterceptor**: 相当于JDK动态代理中的`InvocationHandler`，定义了拦截方法调用的接口。当代理对象的方法被调用时，其实质上调用的是`MethodInterceptor`的`intercept()`方法。


**使用步骤**：

1. **引入依赖**：在项目中添加CGLIB库的依赖（如果是Maven或Gradle项目，则在构建文件中添加相应依赖）。
```xml
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.2.12</version>
</dependency>
```
2. **创建Enhancer实例**：使用`Enhancer.create()`方法创建代理类实例，指定要增强的类。
3. **设置回调**：通过`setCallback()`方法设定一个`MethodInterceptor`实例，定义拦截逻辑。
4. **创建代理对象**：最终调用`create()`方法生成代理实例。



**代码示例**: 假设我们有一个业务类`SomeService`，没有实现任何接口，需要为其方法添加日志记录功能。

```java
public class SomeService {
    public void doSomething() {
        System.out.println("Executing business logic...");
    }
}
```

使用CGLIB创建动态代理：

```java
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

public class CglibProxyExample implements MethodInterceptor {

    public Object getProxy(Class<?> clazz) {
        // 创建Enhancer对象，相当于代理类生成器
        Enhancer enhancer = new Enhancer();
        // 设置父类，即需要代理的原始类
        enhancer.setSuperclass(clazz);
        // 定义代理逻辑对象为当前类实例
        enhancer.setCallback(this);
        // 创建并返回代理类实例
        return enhancer.create();
    }

    @Override
    public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        // 在方法调用前后添加日志
        System.out.println("Logging before method: " + method.getName());
        Object result = methodProxy.invokeSuper(proxy, args); // 调用父类方法
        System.out.println("Logging after method: " + method.getName());
        return result;
    }

    public static void main(String[] args) {
        CglibProxyExample cglibProxy = new CglibProxyExample();
        SomeService proxyService = (SomeService) cglibProxy.getProxy(SomeService.class);
        proxyService.doSomething();
    }
}
```

**注意事项**:
1. **类与final**：由于CGLIB通过继承来实现代理，因此目标类不能为final，且目标类中的方法也不能声明为final，否则这些方法无法被重写。
2. **性能**：相对于JDK动态代理，CGLIB创建代理实例的速度更快，但因为使用了字节码技术，类加载时间可能会稍长，并且生成的代理类比JDK动态代理更消耗内存。
3. **兼容性与安全性**：CGLIB依赖于特定版本的Java字节码操作库，可能存在与新Java版本兼容性问题。同时，由于其深度介入字节码层面，使用时需注意安全性和合法合规性。

<br/>

在CGLIB中，除了上述的使用方式外，还提供了`Enhancer.create`方法，它可以接受多种类型的回调接口作为参数，包括`MethodInterceptor`和`InvocationHandler`。这是因为CGLIB为了兼容性以及提供更灵活的使用方式，设计了对这两种接口的支持。

::: info CGLIB的两种使用方式对比
#### 1. 直接使用`Enhancer.create`传入`InvocationHandler`或`MethodInterceptor`

直接通过`Enhancer.create`方法传入一个匿名内部类实现的`InvocationHandler`或`MethodInterceptor`。这种方式实际上是CGLIB为了兼容JDK的动态代理接口而提供的便利。CGLIB内部会将这个`InvocationHandler`转换为自己的`MethodInterceptor`，以便在代理类的方法调用时触发正确的拦截逻辑。这样做可以让熟悉JDK动态代理的开发者更容易地过渡到使用CGLIB，同时也允许复用已有的`InvocationHandler`逻辑。

#### 2. 传统创建`Enhancer`实例的方式

在更传统的CGLIB使用模式中，开发者会显式创建`Enhancer`实例，然后通过一系列配置方法（如`setSuperclass`、`setInterfaces`、`setCallbacks`等）来定制化生成的代理类。这种方式提供了更多的控制选项，比如可以设置多个回调，或者使用特定的拦截策略等。

#### 推荐写法

选择哪种写法取决于具体需求和偏好：

- 如果项目已经使用了JDK动态代理的`InvocationHandler`，或者希望保持代码的简洁性，直接使用`Enhancer.create(class, InvocationHandler)`的方式会更加方便。这种方式让你能够快速地将现有逻辑迁移到CGLIB，特别是当你需要为非接口类创建代理时。

- 如果需要更细致地控制代理类的生成过程，比如设置多个拦截器、处理父类构造函数等，那么采用更详细的步骤来配置`Enhancer`实例会更有优势。这种情况下，你可能会直接使用`MethodInterceptor`接口，以充分利用CGLIB的特性。
:::


`InvocationHandler`和`MethodInterceptor`的使用示例：
::: code-tabs#shell

@tab:active MethodInterceptor
```java
public static <T> T getProxyObject(T target) {
    // 确保传入的target不是null
    Objects.requireNonNull(target);
    
    Enhancer enhancer = new Enhancer();
    enhancer.setSuperclass(target.getClass());
    enhancer.setCallback(new MethodInterceptor() {
        @Override
        public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy)
                throws Throwable {
            // before invoke
            
            Object invoke;
            try {
                // 尝试使用MethodProxy调用，以优化性能
                invoke = methodProxy.invokeSuper(proxy, args);
            } catch (IllegalArgumentException e) {
                // 如果MethodProxy调用出现问题（比如final方法），回退到常规反射调用
                invoke = method.invoke(target, args);
            }

            // after invoke

            return invoke;
        }
    });

    // 创建代理实例，并直接传入目标对象的类作为超类
    return (T) enhancer.create(target.getClass(), new Object[]{target});
}
```

@tab InvocationHandler
```java
public static <T> T getProxyObject(Class<T> clazz) throws Exception {
    final T target = clazz.getDeclaredConstructor().newInstance(); 
    
    T proxy = (T) Enhancer.create(clazz, new InvocationHandler() {
        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            // ... before invoke

            Object result = method.invoke(target, args); 

            // ... after invoke

            return result;
        }
    });
    return proxy;
}
```
:::

`methodProxy.invokeSuper(proxy, args)`与`method.invoke(target, args)`的区别：

1. **`methodProxy.invokeSuper(proxy, args)`**:
   - **性能**：这种方法调用是CGLIB内部优化过的，直接通过字节码级别的调用来执行父类（或超类）的方法，避免了反射调用的开销，因此性能更好。
   - **作用**：它确保了调用的是代理类的父类（即目标类）中的方法，适合于代理类需要重写父类方法并插入额外逻辑的场景。
   - **局限性**：它不适用于调用final、private或static方法，因为这些方法不能被覆盖或通过super关键字调用。

2. **`method.invoke(target, args)`**:
   - **通用性**：使用Java反射API来调用方法，适用于任何可访问的方法，包括final、private、static等方法。
   - **性能**：相较于`invokeSuper`，反射调用的性能较低，特别是在频繁调用时，因为每次调用都需要进行方法查找等操作。
   - **灵活性**：可以用于任何对象和方法的调用，不限于代理类与父类的关系。

因此，选择使用`methodProxy.invokeSuper`还是`method.invoke`主要取决于具体需求：
- 如果追求性能且仅需调用非final、非private、非static的父类方法，推荐使用`methodProxy.invokeSuper`。
- 若需要调用的目标方法具有上述特殊属性，或者在不明确知道是否为超类方法的情况下，应使用`method.invoke`。

在实际应用中，通常倾向于先尝试使用`methodProxy.invokeSuper`，如果遇到问题（比如调用final方法时抛出异常），再回退到使用`method.invoke`作为备选方案。



### 实现原理总结

**JDK动态代理**：
- **基于接口**：JDK动态代理主要依赖于`java.lang.reflect.Proxy`类和`java.lang.reflect.InvocationHandler`接口。它要求目标对象必须实现一个或多个接口。
- **字节码处理**：在运行时，`Proxy.newProxyInstance()`方法会根据传入的接口信息动态地在内存中生成一个实现所有指定接口的代理类的字节码，并加载到JVM中。
- **InvocationHandler**：生成的代理类会将所有方法调用转发给关联的`InvocationHandler`实例的`invoke()`方法。开发者通过实现`InvocationHandler`接口，可以自定义代理逻辑，比如在调用前后增加日志记录、权限检查等。
- **类加载器与接口**：代理类的类加载器与目标类相同，同时代理类实现了目标类所实现的所有接口。

**CGLIB动态代理**：
- **基于子类**：CGLIB（Code Generation Library）是一个开源的代码生成库，它通过继承的方式创建代理类。这意味着目标对象无需实现接口。
- **字节码操作**：CGLIB使用ASM字节码操作框架，能够在运行时动态生成目标类的子类。这个子类不仅继承了目标类，还插入了代理逻辑。
- **MethodInterceptor**：与JDK动态代理的`InvocationHandler`类似，CGLIB使用`MethodInterceptor`接口来定义拦截逻辑。当代理类的方法被调用时，会触发`intercept()`方法，开发者在此方法中定义增强逻辑。
- **类增强**：CGLIB通过生成目标类的子类来实现代理，因此它可以代理没有实现接口的类，提供了比JDK动态代理更广泛的适用范围。但这也意味着如果目标类是final的，或者其方法是final的，CGLIB将无法生成代理。

::: info 总结
- **接口限制**：JDK动态代理要求目标对象实现接口，而CGLIB则没有这个限制，可以代理任何类。
- **代理方式**：JDK通过实现接口创建代理，CGLIB通过继承目标类创建代理。
- **字节码操作**：两者都涉及字节码操作，但JDK是基于接口生成代理类，CGLIB是生成目标类的子类。
- **应用场景**：如果目标对象有接口且代理逻辑较为简单，JDK动态代理是轻量级的选择；如果需要代理没有接口的类或需要更复杂的继承结构，CGLIB是更合适的选择。
:::



### Spring中的动态代理

Spring框架中使用了两种动态代理技术，具体使用哪种取决于目标类是否实现了接口。

1. **JDK动态代理**：
   - 当目标类实现了至少一个接口时，Spring默认使用JDK动态代理。Spring会为目标类创建一个实现了所有接口的代理对象。这个代理对象会在方法调用时，将调用转发给Spring的`AopProxy`，进而调用`InvocationHandler`（通常是Spring的`ReflectiveMethodInvocation`），在这里执行切面逻辑，如前置通知、后置通知、环绕通知等，最后调用目标方法。

2. **CGLIB动态代理**：
   - 如果目标类没有实现任何接口，Spring会使用CGLIB来创建代理对象。CGLIB通过字节码技术为目标类生成一个子类，该子类包含了增强的逻辑，并且可以被用来代理目标类的调用。同样的，代理逻辑也包括了切面的执行。

Spring在决定使用哪种代理方式时非常灵活，可以通过配置来指定首选策略。例如，在Spring XML配置中，可以使用`<aop:config>`的`proxy-target-class="true"`属性来强制使用CGLIB，无论目标类是否实现了接口。

此外，Spring也允许用户自定义代理机制，通过实现`org.springframework.aop.framework.AopProxy`接口，用户可以完全控制代理对象的创建过程。

总之，Spring框架根据目标类的特性和配置情况，自动选择并应用合适的动态代理技术来实现面向切面编程(AOP)的功能。





## 工厂设计模式

### 4. 工厂实例化



#### 静态工厂和实例工厂

```java

// 实例工厂
public class InstanceFactory {
    public Car getInstance() {
        Car car = new Car();
        car.setType("instance");
        return car;
    }
}

// 静态工厂
public class StaticFactory {

    public static Car getInstance() {
        Car car = new Car();
        car.setType("static");
        return car;
    }
}

```

<br>

```xml

<!--静态工厂-->
<!--factory-method属性：生产方法-->
<!--如果包含了factory-method属性：组件类型并不是class属性对应的类型，而是factory-method属性对应的方法的返回值类型-->
<bean id="carFromStaticFactory" class="com.xxx.factory.StaticFactory" factory-method="getInstance"/>

<!--实例工厂-->
<bean id="instanceFactory" class="com.xxx.factory.InstanceFactory"/>
<bean id="carFromInstanceFactory" factory-bean="instanceFactory" factory-method="getInstance"/>

```



```java

@Test
public void test() {
    //静态工厂直接使用生产方法 → 类、方法
    Car car1 = StaticFactory.getInstance();

    //实例工厂需要先获得工厂的实例 
    InstanceFactory instanceFactory = new InstanceFactory();
    Car car2 = instanceFactory.getInstance();
}

```

<br>

#### FactoryBean接口

```xml

<!--  Spring内置了对FactoryBean支持 → Spring会检查类是否有实现FactoryBean接口 -->
<!-- 取出组件时取出的是FactoryBean的getObject方法的返回值 -->

<bean id="userServiceProxy" class="com.xxx.proxy.ServiceProxyFactoryBean">
    <property name="clazz" value="com.xxx.service.UserServiceImpl"/>
</bean>

```

<br>

```java

// 该类能够提供一个service的代理组件，并且从单元测试类中取出该组件能够实现事务
public class ServiceProxyFactoryBean implements FactoryBean<Object> {
    String clazz;

    @Override
    public boolean isSingleton() {
        return true;
    }

    @Override
    public Object getObject() throws Exception {
        Class<?> cls = Class.forName(clazz);
        Object obj = cls.newInstance();
        return Enhancer.create(cls, new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, 
                                    MethodProxy methodProxy) throws Throwable {
                SqlSession sqlSession = MyBatisUtil.getSqlSession();
                Field[] declaredFields = cls.getDeclaredFields();
                for (Field field : declaredFields) {
                    if (field.getName().contains("Mapper")) {
                        field.setAccessible(true);
                        Class<?> type = field.getType();
                        Object mapper = sqlSession.getMapper(type);
                        field.set(obj, mapper);
                    }
                }
                Object invoke = method.invoke(obj, objects);
                sqlSession.commit();
                sqlSession.close();
                return invoke;
            }
        });
    }

    @Override
    public Class<?> getObjectType() {
        return UserServiceImpl.class;
    }

    public void setClazz(String clazz) {
        this.clazz = clazz;
    }
}

```

<br>

```java

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:application.xml")
public class MyTest {

    // 取出的是ServiceProxyFactoryBean提供的组件
    @Qualifier("userServiceProxy")
    @Autowired
    UserService userService;

    @Test
    public void testSelect(){
        String name = userService.queryNameById(1);
        System.out.println(name);
    }

    @Test
    public void testInsert() {
        User user = new User();
        user.setUsername("fahai");
        user.setPassword("nohair");
        user.setAge(33);
        int insert = userService.insertUser(user);
        System.out.println("insert = " + insert);
    }

}

```
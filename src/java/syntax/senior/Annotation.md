---

order: 10
title: Annotation
shortTitle: Annotation注解

---


## Annotation

Java注解（Annotation）是JDK 5引入的一个重要特性，它提供了一种安全的机制来将元数据（Metadata）添加到Java代码中。注解不会直接影响程序代码的执行，但可以被编译器、开发工具或运行时环境用于生成其他代码、进行验证或执行特定处理。


::: tip 注解与注释的区别

- **注解（Annotations）**：是程序的一部分，它们以机器可读的形式提供信息，可以被编译器、开发工具或运行时环境解析和使用。注解有严格的语法和语义规则，用于指定如何处理或解释被注解的代码。
- **注释（Comments）**：是程序员写给其他阅读代码的人（或自己）看的文字说明，对编译器和程序的执行没有影响。注释可以是任意文本形式，帮助理解代码的目的和工作原理。
:::



### 元注解

meta-annotation（元注解）是用于定义其他注解的注解，它们提供了一种控制注解行为的方式。Java提供了以下几种重要的元注解：

- **@Retention**：定义了注解的生命周期，即注解保留的时间长短。可选的RetentionPolicy值有：
  - SOURCE：注解只保留在源码中，编译后被丢弃。
  - CLASS：注解保留在编译后的类文件中，但不被虚拟机加载。
  - ==RUNTIME：注解会被虚拟机加载，并且可以通过反射机制读取==，这是运行时注解的基础。

- **@Target**：指定了注解可以应用于哪些程序元素上。可选的ElementType值有：
    ```java
    // ElementType 源码分析
        public enum ElementType {
        TYPE,             /* 类、接口（包括注释类型）或枚举声明 */
        FIELD,            /* 字段声明（包括枚举常量） */
        METHOD,           /* 方法声明 */
        PARAMETER,        /* 参数声明 */
        CONSTRUCTOR,      /* 构造方法声明 */
        LOCAL_VARIABLE,   /* 局部变量声明 */
        ANNOTATION_TYPE,  /* 注释类型声明 */
        PACKAGE,          /* 包声明 */
        TYPE_PARAMETER,   /* 类型参数，从Java 8开始 */
        TYPE_USE          /* 类型使用，从Java 8开始 */
    }
    ```
- **@Documented**：标记该注解会在生成的JavaDoc文档中出现，使得注解的用途和意义对用户可见。

- **@Inherited**：如果一个类使用了被@Inherited标注的注解，则它的子类将自动继承这个注解（仅对类有效）。

- **@Repeatable**（Java 8引入）：允许相同的注解在同一声明上重复使用，需要与一个容器注解配合使用。




### 内置注解

Java中有三种常用的内置注解，这些注解用来为编译器提供指令（ java7和java8又新增了三种）

| Java内置注解               | 说明                                           |
| ---------------------- | -------------------------------------------- |
| `@Override`            | 标记方法重写。如果发现其父类，或者是引用的接口中并没有该方法时，会报编译错误 |
| `@Deprecated`          | 标记已过时的类或方法。如果使用该方法，会报编译警告                        |
| `@SuppressWarnings`    | 指示编译器去忽略注解中声明的警告                             |
| `@SafeVarargs`         | 忽略任何使用参数为泛型变量的方法或构造函数调用产生的警告（ Java 7 ）       |
| `@FunctionalInterface` | 标识一个匿名函数或函数式接口 （ Java 8 ）                    |
| `@Repeatable`          | 标识某注解可以在同一个声明上使用多次 （ Java 8）                 |

SuppressWarnings：抑制编译时的警告信息、常用使用方式：

```java
@SuppressWarnings("unchecked")            // 抑制单类型的警告 

@SuppressWarnings("unchecked","rawtypes") // 抑制多类型的警告

@SuppressWarnings("all")                  // 抑制所有类型的警告
```

| SuppressWarnings的参数      | 用途                                      |
| ------------------------ | --------------------------------------- |
| all                      | 抑制所有警告                                  |
| boxing                   | 抑制装箱、拆箱操作时候的警告                          |
| cast                     | 抑制映射相关的警告                               |
| dep-ann                  | 抑制启用注释的警告                               |
| deprecation              | 抑制过期方法警告                                |
| fallthrough              | 抑制确在switch中缺失breaks的警告                  |
| finally                  | 抑制finally模块没有返回的警告                      |
| hiding                   | 抑制相对于隐藏变量的局部变量的警告                       |
| incomplete-switch        | 忽略没有完整的switch语句                         |
| nls                      | 忽略非nls格式的字符                             |
| null                     | 忽略对null的操作                              |
| rawtypes                 | 使用generics时忽略没有指定相应的类型                  |
| restriction              | 抑制禁止使用劝阻或禁止引用的警告                        |
| serial                   | 忽略在serializable类中没有声明serialVersionUID变量 |
| static-access            | 抑制不正确的静态访问方式警告                          |
| synthetic-access         | 抑制子类没有按最优方法访问内部类的警告                     |
| unchecked                | 抑制没有进行类型检查操作的警告                         |
| unqualified-field-access | 抑制没有权限访问的域的警告                           |
| unused                   | 抑制没被使用过的代码的警告                           |




## 如何自定义注解

自定义注解是Java中一个强大的特性，它允许开发者根据特定需求创建自己的注解类型。自定义注解的过程涉及定义注解的结构、元注解的应用以及如何在代码中使用这些自定义注解。

```java
// 自定义注解格式
@Documented
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation1 {
    参数类型 参数名() default 默认值;
}
```

以下是创建自定义注解的详细步骤：

### 定义注解类型

注解类型以`@interface`关键字定义，类似于接口的定义。定义 Annotation 时，`@interface` 是必须的、定义的注解自动继承了`java.lang.annotation.Annotation`接口

下面是一个简单的自定义注解示例：

```java
public @interface MyCustomAnnotation {
    // 成员定义，通常是常量，默认值等
    String value() default "";
}
```

在这个例子中，我们定义了一个名为`MyCustomAnnotation`的注解，它有一个成员`value`，默认值为空字符串。


### 应用元注解

为了控制自定义注解的行为，我们需要使用元注解。常见的元注解包括`@Retention`、`@Target`等，根据需求选择合适的元注解：

```java
@Retention(RetentionPolicy.RUNTIME) // 设置注解保留到运行时，以便通过反射访问
@Target(ElementType.METHOD) // 指定注解只能用于方法上
public @interface MyCustomAnnotation {
    String value() default "";
}
```


### 添加成员变量

自定义注解可以包含成员变量(参数)，这些变量在使用注解时需要赋值。定义的方式是在注解内定义一些方法（返回值类型表示参数的类型）

成员变量的类型必须是==Java的基本类型、String、Class、enum、Annotation==或者是上述类型的数组。例如：

```java
public @interface MyCustomAnnotation {
    String description() default ""; // 描述信息
    int priority() default 1; // 优先级
}
```

- 参数定义时可以使用default指定一个默认值、如果定义了参数且没有提供默认值，在使用注解时必须提供具体的值，不能为null。（常使用空字符串、0作为默认值）



### 使用自定义注解

一旦定义了注解，就可以在符合其`@Target`指定的元素上使用了。比如上面的注解可以这样应用：

```java
public class MyClass {
    @MyCustomAnnotation(description = "这是一个重要方法", priority = 5)
    public void myMethod() {
        // 方法实现...
    }
}
```

### 解析自定义注解

要读取或处理这些自定义注解，通常需要使用反射API。例如，获取一个方法上的自定义注解并读取其属性：

```java
public class AnnotationProcessor {
    public static void processAnnotations(Class<?> clazz) {
        for (Method method : clazz.getDeclaredMethods()) {
            if (method.isAnnotationPresent(MyCustomAnnotation.class)) {
                MyCustomAnnotation annotation = method.getAnnotation(MyCustomAnnotation.class);
                System.out.println("Description: " + annotation.description());
                System.out.println("Priority: " + annotation.priority());
            }
        }
    }
}
```

::: info 反射相关类中与注解有关的方法
Class、Field、Method、Constructor中都有如下方法:
```java
//获取所有的注解
public Annotation[] getAnnotations();

//获取所有本元素上直接声明的注解，忽略inherited来的
public Annotation[] getDeclaredAnnotations();

//获取指定类型的注解，没有返回null
public <A extends Annotation> A getAnnotation(Class<A> annotationClass);

//判断是否有指定类型的注解
public boolean isAnnotationPresent(Class<? extends Annotation> annotationClass);
```

对于Method和Contructor，它们都有方法参数，而参数也可以有注解，所以它们都有如下方法：

```java
public Annotation[][] getParameterAnnotations();
```

:::



## 注解的处理和应用

**注解的处理**：
- **编译时处理（APT）**：使用注解处理器在编译阶段处理注解，生成额外的源代码或字节码。
- **运行时反射**：如何在程序运行时通过反射API访问注解信息，包括`Class.getAnnotations()`, `Method.getAnnotation()`等方法。
- **Java Pluggable Annotation Processing API (JSR 269/JSR 308)**：注解处理的标准API。

### 实际应用场景
- **框架中的应用**：Spring框架中@Autowired, @Service, @Controller等注解的使用，以及Hibernate, JUnit等框架中的注解。
- **编译时检查**：利用注解进行代码静态分析，如检查未使用的变量、空指针等。
- **测试和文档生成**：JUnit测试注解，以及通过JavaDoc生成文档时对注解的处理。
- **依赖注入与配置管理**：如Spring框架利用注解实现依赖注入和配置服务。


### 性能考虑

- **运行时注解的使用对性能的影响**：运行时注解（如通过反射访问）可能会对应用程序的启动时间和运行时性能产生影响，因为解析注解需要额外的计算资源。特别是当大量使用或深度遍历注解时，这种影响更为显著。

::: tip 基于性能考虑的最佳实践
  - **仅在必要时使用运行时注解**：如果注解仅用于编译时检查或代码生成，则应使用 **`@Retention(RetentionPolicy.CLASS)`** 或 **`@Retention(RetentionPolicy.SOURCE)`**，避免在运行时解析它们。
  - **缓存注解信息**：若确实需要在运行时访问注解，考虑缓存解析结果，避免重复解析。
  - **性能评估**：在高性能要求的应用中，应进行性能测试，以评估注解对系统性能的具体影响，并据此做出调整。
:::

### 注解设计原则

- **何时使用注解**：
  - **标准化配置**：当有标准的配置模式时，使用注解可以减少配置文件的复杂性，提高代码的自解释性。
  - **代码元数据**：为代码添加额外的上下文信息，如权限控制、事务管理等。
  - **框架集成**：许多框架如Spring、Hibernate等，利用注解简化集成和配置。

- **避免过度使用**：
  - **保持简洁**：过度使用注解可能导致代码难以阅读和理解。尽量保持代码的自然流和清晰度。
  - **不要重复已有机制**：如果可以通过现有语言特性（如接口、继承）实现同样的功能，应优先考虑这些方式。
  - **避免“魔法”行为**：确保注解的用途对团队成员来说是显而易见的，避免因过度抽象而导致的“黑盒”效应。




## 实现DI容器示例

使用注解和反射，实现简单的DI容器

- 定义两个注解，注解`@SimpleInject`修饰类中字段，表达依赖关系，`@SimpleSingleton`用于修饰类，表示类型是单例
  
  ```java
  @Retention(RetentionPolicy.RUNTIME)
  @Target(ElementType.FIELD)
  public @interface SimpleInject {
  }
  ```
  
  ```java
  @Retention(RetentionPolicy.RUNTIME)
  @Target(ElementType.TYPE)
  public @interface SimpleSingleton {
  }
  ```

​

- 定义两个简单的服务ServiceA、ServiceB和测试类, ServiceA依赖于ServiceB
  
  ```java
  public class Demo {
      public static void main(String[] args) {
          final ServiceA serviceA = SimpleContainer.getInstance(ServiceA.class);
          serviceA.callB();
      }
  
      static class ServiceA {
          // ServiceA使用 @SimpleInject表达对ServiceB的依赖
          @SimpleInject
          ServiceB b;
  
          public void callB() {
              b.method();
          }
      }
  
      @SimpleSingleton
      static class ServiceB {
          public void method() {
              System.out.println("I'm ServiceB");
          }
      }
  }
  ```

- 创建DI容器类
  
  ```java
  public class SimpleContainer {
      private static Map<Class<?>, Object> instances = new ConcurrentHashMap<>();
  
      public static <T> T getInstance(Class<T> cls) {
          try {
              boolean singleton = cls.isAnnotationPresent(SimpleSingleton.class);
              // 首先检查类型是否是单例，如果不是，就直接调用createInstance创建对象。
              if (!singleton) {
                  return createInstance(cls);
              }
  
              // 检查缓存，如果有，直接返回
              Object obj = instances.get(cls);
              if (obj != null) {
                  return (T) obj;
              }
  
              // 调用createInstance创建对象，并放入缓存中
              synchronized (cls) {
                  obj = instances.get(cls);
                  if (obj == null) {
                      obj = createInstance(cls);
                      instances.put(cls, obj);
                  }
              }
              return (T) obj;
          } catch (Exception e) {
              throw new RuntimeException(e);
          }
      }
  
      private static <T> T createInstance(Class<T> cls) throws Exception {
          T obj = cls.newInstance();
          Field[] fields = cls.getDeclaredFields();
          for (Field f : fields) {
              if (f.isAnnotationPresent(SimpleInject.class)) {
                  if (!f.isAccessible()) {
                      f.setAccessible(true);
                  }
                  Class<?> fieldCls = f.getType();
                  f.set(obj, getInstance(fieldCls));
              }
          }
          return obj;
      }
  }
  ```



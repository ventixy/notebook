---

order: 1
title:  Java基础

---


## Java基础知识


1. 你认为 Java 的优势是什么？

在过去Java因其 **跨平台，垃圾回收，面向对象** 等特点而流行起来，到现在形成了 ==成熟的生态== ，拥有完善的工具，框架和中间件，以及大量的专业人才，我觉得这才是Java现如今最大的优势和竞争力。


2. JDK 和 JRE 有什么区别？你使用过哪些 JDK 提供的工具？

JRE指的是Java运行环境，包含了 **JVM** 及 **核心类库** ，JDK可视为JRE的超集，它包含了JRE 以及其他用于开发和调试的工具

::: details JDK提供的主要工具
- JDK 常见工具
    - javac:Java 编译器，负责将 Java 源代码编译成字节码(.class 文件)。
    - java:运行 Java 应用程序的命令，使用 JM 来解释并执行编译后的字节码文件。
    - javadoc:生成 API文档的工具，能够根据源代码中的注释生成 HTML 格式的文档。
    - jar:用于创建和管理 JAR 文件的工具，可以将多个.class 文件打包为单一文件，便于分发和管理
    - jdb:Java 调试工具，用于在命令行中调试 Java 应用程序，支持断点设置、变量查看等功能。
- 性能监控和分析工具
    - jps:Java 进程工具，显示所有正在运行的 Java 进程，便于监控和诊
    - ==jstack==:生成线程堆栈信息的工具，常用于**分析死锁和线程问题**。
    - ==jmap==:内存映射工具，可以生成堆转储(heap dump)文件，便于**内存泄漏分析和垃圾回收优化**。
    - ==jhat==:堆分析工具，配合 jmap 使用，分析生成的堆转储文件，帮助开发者了解内存使用情况。
    - jstat:JVM 统计监控工具，实时监控垃圾回收、内存、类加载等信息，帮助开发者调优 JM 性能。
    - jconsole:图形化的 JM 监控工具，可以监控应用程序的内存、线程和类加载情况，常用于监控和调试。
    - jvisualvm:功能强大的性能分析工具，支持堆、线程、GC的详细监控，还提供内存分析和 CPU 性能分析。
- 诊断工具
    - jinfo:用于查看和修改正在运行的 JVM 参数，便于动态调优和调整 JM 行为,
    - jstatd:远程 JVM 监控工具，可以通过网络远程监控 JVM 的状态，适合分布式系统中的性能监控。
:::




### Java数据类型

1. Java 中的基本数据类型有哪些？

8种基本数据类型: 整型（byte,short,int,long）, 浮点型(float,double), 字符型(char), 布尔型(boolean)

更多更详细的内容参照：[Java基本数据类型](/java/syntax/base/Java基础.md#基本数据类型)


2. Java 中包装类型和基本类型的区别是什么？

`Byte`, `Short`, `Integer`, `Long`, `Float`, `Double`, `Character`, `Boolean`

包装类型的本质是对象，适用于需要对象特性、支持 `null` 值、需要调用方法的场景 


3. 什么是 Java 中的自动装箱和拆箱？

- 自动装箱（Autoboxing）: 将基本类型自动转换为其对应的包装类型的过程。
    当遇到将基本类型赋值给包装类型的情况时，编译器会自动调用 `Integer.valueOf(int)`

- 拆箱（Unboxing）: 将包装类型自动转换为其对应的基本类型的过程。
    当编译器遇到将包装类型赋值给基本类型的情况时，会自动插入相应的解包方法调用。如：`Integer.intValue()`


4. 什么是 Java 的 Integer 缓存池？

`Integer` 类的内部实现中使用了一个静态数组来存储这些常用的小整数值(-128 到 127)，以减少对象的创建和垃圾回收的开销。

**注意事项**：使用 `==` 比较 `Integer` 对象时需要注意缓存范围的影响，推荐使用 `equals` 方法进行值比较。


5. 什么是 Java 的 BigDecimal？  参照：[BigDecimal](/java/syntax/base/Java常用类库.md#_2-bigdecimal)

`BigDecimal`是Java中用于进行高精度浮点数运算的工具类，适用于金融和科学计算等需要高精度的场景。

::: warning BigDecimal
BigDecimal是不可变类，所有的算术运算都会返回新的BigDecimal对象（安全但性能较差）
```java
BigDecimal bd1 = new BigDecimal("123.456");  // 使用字符串初始化，推荐     
BigDecimal bd2 = BigDecimal.valueOf(123L);   // 也可以使用静态方法 valueOf
BigDecimal bd3 = new BigDecimal(123.456);    // 使用double初始化，可能丢失精度
```
- 常用算数方法：`add`, `subtract`, `multiply`, `divide`
- 数值比较：`int res = bd3.compareTo(bd4)`
- 转换为字符串：
    - `toString()` --可能会是科学记数法
    - `toPlainString()` --始终提供完整的十进制字符串表示
:::



### Java字符串对象

Java中处理字符串的主要类是String、StringBuilder和StringBuffer。 参考：[Java字符串](/java/syntax/base/数组和字符串.md#三-字符串-string)


::: info String面试题
#### 使用 new String("abc") 语句在 Java 中会创建多少个对象？

会创建1-2两个字符串，使用new关键字时，如果字符串常量池中不存在当前字符串，那就会在堆上创建两个字符串对象，其中一个会被保存到字符串常量池中。

如果字符串常量池中已经存在该字符串的引用，则只会在堆中创建一个

#### 为什么 JDK 9 中将 String 的 char 数组改为 byte 数组？

为了节省内存空间，提升内存利用率。

- JDK9之前String是基于char[] 实现的，内部采用UTF-16编码，每个字符占用两字节。
- JDK9中String采用byte[]数组来实现，并使用coder变量标识编码方式(UTF-16/Latin-1)， 当字符仅需一个字符的空间时，就可以减少内存占用
:::

Java 中 String、StringBuffer 和 StringBuilder 的区别是什么？

- String: 不可变，适合少量字符串操作。  
    String的本质就是一个不可变的字符数组： `private final char value[];`
- StringBuilder: 可变，但非线程安全，适合单线程环境中的高性能字符串处理
- StringBuffer：可变，且线程安全，适合多线程环境中频繁修改字符串的场景


::: info Java 中的序列化和反序列化

- 序列化: 将对象的状态信息转换为可以存储或传输的形式，要使一个对象可以被序列化，该对象的类必须实现 `Serializable` 接口。
- 反序列化: 将字节流恢复为对象的过程

建议显式定义 `serialVersionUID`，以避免因类结构变化而导致的序列化失败。
:::


为什么在 Java 中编写代码时会遇到乱码问题？

乱码是因为**编解码时使用的字符集不一致**导致的。





### Java面向对象

Java 面向对象编程与面向过程编程的区别是什么？

- **面向对象编程**：关注数据（对象）及其行为（方法），通过类和对象来组织代码。数据和操作数据的方法封装在一起，外部访问受限，增强数据安全性。支持继承和多态，可以通过继承扩展类的功能，多态允许子类方法覆盖父类方法。**面向对象更符合人类的思维方式**。

- **面向过程编程**：关注过程（函数）和数据，通过函数和数据结构来组织代码。数据和函数分离，数据暴露在外，容易被随意修改。

::: info 封装继承多态

#### 什么是 Java 的封装特性？

指将对象的 状态和行为（数据和方法）封装在内部，通过公开的接口与外部进行交互。封装的主要目的是隐藏内部的实现细节，只暴露必要的功能。且修改内部的具体实现外部也无法感知到 （数据保护，代码复用）

#### 什么是 Java 中的继承机制？为什么 Java 不支持多重继承？

- 子类继承父类的属性和方法，使得类之间形成层次结构，不仅代码得到重用，还可以进行扩展。继承是实现 多态，抽象和代码复用的关键。

- 多继承会产生菱形继承问题，例如：BC继承了A，D又继承了BC，假设D现在要调用A中的方法，但是B C都有不同的实现，此时就会出现歧义。

既然多继承不行，为什么接口多实现可以？

Java8之前，接口是无法定义具体的方法实现的，必须由子类自己实现，并不会产生歧义。

Java8有了默认方法，但是强制规定如果多个接口内有相同的默认方法，子类必须重写该方法。


#### 什么是 Java 的多态特性？

指同一个接口或者父类引用变量可以指向不同的对象实例，并根据实际指向的对象类型执行相应的方法。

它允许同一方法在不同的对象上表现出不同的行为。通过多态，程序可以灵活的处理不同类型的对象，降低代码耦合度。
::: 


Java 中的访问修饰符有哪些？

| 访问修饰符 | 访问范围                             | 示例                           |
|------------|--------------------------------------|-------------------------------|
| **private** | 仅限于同一个类内部                   | `private int privateVar;`     |
| **default** | 同一个包内的类                       | `int defaultVar;`             |
| **protected** | 同一个包内的类以及不同包中的子类     | `protected int protectedVar;` |
| **public**  | 所有类，不受包的限制                 | `public int publicVar;`       |



### 方法和参数传递

1. Java 中静态方法和实例方法的区别是什么？

- **静态方法**：属于类，通过类名调用，只能访问静态成员，不能被重写。
- **实例方法**：属于对象，通过对象调用，可以访问所有成员，可以被重写。

2. Java 方法重载和方法重写之间的区别是什么？

- **方法重载**：在同一类中，方法名相同但参数列表不同，可以在编译时根据参数类型和数量区分方法
- **方法重写**：在子类中，方法名、返回类型和参数列表都相同，用于实现多态，改变父类方法的行为

3. Java 中的参数传递是按值还是按引用？

::: tip 值传递（pass by value）和引用传递（pass by reference）
在Java中，无论是基本类型还是引用类型的数据，参数传递都只有 **值传递（pass by value）**

  - 传递基本类型的参数时，传递的是值的副本。不会影响到原本的值。
  - 传递引用数据类型时，传递的是引用的副本，使得方法参数和原本的变量均指向同一对象，因此可以修改对象的属性，但是无法让原本的变量指向其他对象。
:::

更详细的内容参照：[Java参数传递](/java/syntax/base/Java基础.md#参数传递)








### 接口和抽象类

接口和抽象类有什么区别？

::: info 抽象类和接口
#### 普通类和抽象类有什么区别？

- **普通类**：可以直接实例化，提供具体的方法实现。
- **抽象类**：不能直接实例化，可以包含抽象方法（没有具体实现的方法），子类必须实现这些抽象方法。

#### 抽象类和接口有什么区别？

- **抽象类**： 可以包含抽象方法和具体方法。 只能单继承。可以包含成员变量。
- **接口**： 只能包含抽象方法（Java 8 以后可以包含默认方法和静态方法）。 可以多实现。 成员变量默认是 `public static final`。
:::




### 深浅拷贝

Java 中的深拷贝和浅拷贝有什么区别？
- **浅拷贝**：创建一个新对象，但只复制基本数据类型和引用类型的数据地址，原始对象和拷贝对象共享引用类型的内存地址。
- **深拷贝**：创建一个完全独立的新对象，复制所有数据，包括引用类型的数据，使得原始对象和拷贝对象互不影响。


### 内部类

什么是 Java 内部类？它有什么作用？

**定义**：内部类是指在一个类的内部定义的类。

1. **成员内部类（Member Inner Class）**：定义在类的内部，但不在方法或代码块中。可以访问外部类的所有成员（包括私有成员）。
2. **局部内部类（Local Inner Class）**： 定义在方法或代码块中。 只能在定义它的方法或代码块中使用。
3. **匿名内部类（Anonymous Inner Class）**： 没有名字，通常用于创建单个对象。 经常用于事件监听器等场景。
4. **静态内部类（Static Nested Class）**： 使用 `static` 关键字修饰。 不依赖于外部类的实例，可以直接通过外部类名访问。

作用
1. **逻辑封装**：内部类可以访问外部类的私有成员，实现更紧密的封装。
2. **代码组织**： 内部类可以将相关的类组织在一起，提高代码的可读性和可维护性。
3. **事件处理**： 匿名内部类常用于事件监听器，简化事件处理代码。



### Object类中的方法

Java Object 类中有什么方法，有什么作用？

1. **`toString()`**：返回对象的字符串表示形式。默认返回对象的类名和哈希码

2. **`hashCode()`**：基于对象的内存地址生成哈希码。

3. **`equals(Object obj)`**：检查两个对象是否是同一个对象（即引用是否相同）。

4. **`clone()`**：创建并返回对象的一个副本。默认是浅拷贝，需要实现 `Cloneable` 接口。通常会重写实现深拷贝

5. **`finalize()`**：对象被垃圾回收前调用的方法。用于释放资源，但不建议依赖此方法进行资源管理，应使用 `try-with-resources` 等更可靠的机制。

6. **`getClass()`**：返回对象的 `Class` 对象。

7. **`wait()`**、**`notify()`**、**`notifyAll()`**：用于多线程编程中的同步控制。
   - **`wait()`**：使当前线程等待，释放对象锁。
   - **`notify()`**：唤醒一个等待该对象锁的线程。
   - **`notifyAll()`**：唤醒所有等待该对象锁的线程。



### equals/hashCode

Java 中 hashCode 和 equals 方法是什么？它们与 == 操作符有什么区别？

- **`hashCode` 方法**：返回对象的哈希码，用于哈希表中的快速查找。
- **`equals` 方法**：判断两个对象是否相等，通常需要重写以实现自定义的相等逻辑。
- **`==` 操作符**：比较两个对象的引用是否相同，即是否指向同一个对象。


Java 中的 hashCode 和 equals 方法之间有什么关系？

  - **一致性**：如果两个对象通过 `equals` 方法判断为相等，那么它们的 `hashCode` 方法返回的值必须相同。(这样可以确保在哈希表中，相等的对象会被放在同一个桶中)
  - **反向关系**：如果两个对象的 `hashCode` 值不同，那么它们一定不相等。

在哈希表（如 `HashMap`、`HashSet`）中，`hashCode` 用于快速定位桶的位置





### IO和网络编程

1. **Java 的 I/O 流是什么？**
   Java 的 I/O 流是一组用于处理输入和输出操作的类和接口，提供了读取和写入数据到不同源或目的地的功能。

2. **什么是 BIO、NIO、AIO？**
   BIO（阻塞I/O）、NIO（非阻塞I/O）和 AIO（异步I/O）是 Java 中三种不同的 I/O 模型，分别代表了同步阻塞、同步非阻塞和异步非阻塞的 I/O 处理方式。
   - BIO：线程在I/O操作期间被阻塞。
   - NIO：线程在发起 I/O 操作后不会被阻塞，但它需要轮询 Selector 来检查是否有 I/O 事件发生。
   - AIO：线程在发起 I/O 操作后不会被阻塞，并且操作系统会在操作完成时通知 Java 应用。通过 CompletionHandler 或 Future 来处理操作完成的通知。

   更多关于NIO的内容参考：[Java NIO](/java/syntax/io/nio.html#nio核心概念)

3. **什么是 Channel？**
   Channel 是 NIO 中的一个核心概念，表示一个能够执行 I/O 操作的对象，如读取、写入、映射文件等，并且可以与 Buffer 交互以传输数据。

4. **什么是 Selector？**
   Selector 是 NIO 中用于多路复用 I/O 操作的组件，允许单个线程管理多个 Channel，从而提高并发处理能力。

5. **什么是 Java 的网络编程？**
   Java 的网络编程是指利用 Java 提供的 API 来开发能够在网络上进行通信的应用程序，包括创建客户端和服务器端程序，处理 TCP/UDP 协议等。



## Java高级特性

### 注解和反射

**注解** 是一种元数据，用于提供程序元素（如类、方法、变量）的附加信息。注解本身不会直接影响程序的运行，但可以通过注解处理器在编译时或运行时读取这些注解并执行相应的操作。

- **编译时处理**：使用注解处理器在编译时读取注解并生成代码或执行其他操作。
- **运行时处理**：使用反射机制在运行时读取注解并执行相应的操作。

::: info 元注解和自定义注解
#### 元注解
   - **`@Retention`**：指定注解的保留策略（`SOURCE`、`CLASS`、`RUNTIME`）。
   - **`@Target`**：指定注解可以应用的目标（如 `TYPE`、`METHOD`、`FIELD`）。
   - **`@Documented`**：指定注解是否包含在 Javadoc 文档中。
   - **`@Inherited`**：指定注解是否可以被子类继承。

#### 自定义注解
   - 使用 `@interface` 关键字定义。
   - 可以包含属性（方法），属性可以有默认值。
:::

 应用场景

- **编译时检查**：如 `@Override`、`@Deprecated`。
- **代码生成**：如 Lombok 注解生成 getter 和 setter 方法。
- **配置元数据**：如 Spring 的 `@Autowired`、`@Component`。
- **运行时行为**：如 JUnit 的 `@Test`、`@Before`。


<br/>

你使用过 Java 的反射机制吗？如何应用反射？

::: info Java反射
Java反射机制是Java语言提供的一种能够在运行时分析类和对象的能力。它允许程序在运行时动态地获取类的信息（如类名、属性、方法等），创建对象，调用方法，改变属性值等。 这对于开发一些需要高度灵活性和元编程功能的应用非常有用，比如开发框架、ORM工具、AOP（面向切面编程）等

1. **获取 `Class` 对象**：
   - **`Class.forName(String className)`**：通过类名获取 `Class` 对象。
   - **`Object.getClass()`**：通过对象获取 `Class` 对象。
   - **`Class<T> c = T.class`**：通过类字面量获取 `Class` 对象。

2. **创建对象**：
   - **`Class.newInstance()`**：创建类的实例（Java 9 以后不推荐使用）。
   - **`Constructor.newInstance(Object... initargs)`**：通过构造器创建类的实例。

3. **获取和调用方法**：
   - **`Class.getMethod(String name, Class... parameterTypes)`**：获取公共方法。
   - **`Class.getDeclaredMethod(String name, Class... parameterTypes)`**：获取所有方法（包括私有方法）。
   - **`Method.invoke(Object obj, Object... args)`**：调用方法。

4. **获取和访问字段**：
   - **`Class.getField(String name)`**：获取公共字段。
   - **`Class.getDeclaredField(String name)`**：获取所有字段（包括私有字段）。
   - **`Field.set(Object obj, Object value)`**：设置字段值。
   - **`Field.get(Object obj)`**：获取字段值。

5. **获取和访问构造器**：
   - **`Class.getConstructor(Class... parameterTypes)`**：获取公共构造器。
   - **`Class.getDeclaredConstructor(Class... parameterTypes)`**：获取所有构造器（包括私有构造器）。

6. **设置访问权限**：
   - **`AccessibleObject.setAccessible(boolean flag)`**：设置是否允许访问私有成员。
:::




### Java泛型

Java 泛型（generics）是 JDK 5 中引入的一个新特性, 泛型提供了编译时类型安全检测机制，该机制允许开发者在编译时检测到非法的类型。

- 泛型的本质是参数化类型,也就是说所操作的数据类型被指定为一个参数。在使用/调用时传入具体的类型（类型实参）

- Java采用 ==类型擦除(Type erasure generics)== 的方式实现泛型，即这个泛型只存在源码中，经过编译之后全部泛型变成Object

::: info 泛型通配/上下界定符

- `？`：任意类型，如果没有明确，那么就是Object以及任意的Java类了

- 上界通配符 `< ? extends E>`：限制泛型可用类型, 表示参数化的类型可能是所指定的类型，或者是此类型的子类。

- 下界通配符 `< ? super E>`：表示参数化的类型可能是所指定的类型，或者是此类型的父类型，直至 Object

:::






### 异常和错误

![](https://image.ventix.top/java/image-20211009131219704.png)

1. **Java 中 Exception 和 Error 有什么区别？**
   - `Exception` 表示程序可以捕获和处理的异常情况，
   - `Error` 表示严重的错误，通常是不可恢复的情况，如虚拟机故障，程序不应尝试处理。

2. **Java 运行时异常和编译时异常之间的区别是什么？**
   - 运行时异常（unchecked exceptions）在运行期间发生且不必显式处理，
   - 编译时异常（checked exceptions）必须在编译前通过 try-catch 或 throws 声明进行处理。

3. **Java 中 final、finally 和 finalize 各有什么区别？**
   - `final` 关键字用于声明不可修改的变量、方法或类；
   - `finally` 块总是会在 try-catch 结构后执行，确保清理代码被执行；
   - `finalize` 方法是在对象垃圾回收前由 JVM 调用，用于资源清理，但已被标记为废弃。


在SpringBoot中，使用 `@ControllerAdvice` 和 `@ExceptionHandler` 注解来全局捕获和处理异常：

1. **创建全局异常处理器类**：用 `@ControllerAdvice` 注解的类。
2. **定义异常处理方法**：在该类中用 `@ExceptionHandler` 注解的方法处理特定异常。
3. **返回自定义响应**：在处理方法中返回适当的响应给客户端。




### JDK8新特性

JDK8 有哪些新特性？Java 的 Optional 类是什么？它有什么用？

::: info JDK8 新特性

#### JDK8 新特性

- **Lambda 表达式**：允许更简洁的代码来实现函数式编程。
- **Stream API**：提供了一种高效且易于使用的集合数据处理方式。
- **默认方法和静态方法在接口中**：接口可以包含带实现的方法(默认和静态方法)
- **日期时间 API (JSR 310)**：引入了新的日期和时间类，如 `LocalDate` 和 `LocalTime`，更加易用且线程安全。

#### Java 的 Optional 类

- `Optional<T>` 是一个容器类，代表一个值存在或不存在，而不是使用 null。
- 用于避免 NullPointerException，使代码更清晰地表达可能缺失的值，并提供了多种方法来优雅地处理这种情况。
:::


### Lambda&Stream

[Lambda表达式](/java/syntax/senior/Lambda.html#lambda表达式) 和 [Stream API](/java/syntax/senior/Stream.html#什么是stream)

如何实现类似 Java Stream API 功能的简要思路:

- 链式调用: 每个中间操作（如 filter, map）都应该返回一个新的流对象
- 惰性求值：使用列表或队列保存一系列待执行的操作（Operation）
- 并行处理：通过多线程或 Fork/Join 框架实现并发执行，需要注意线程安全问题



### SPI机制

什么是 Java 的 SPI（Service Provider Interface）机制？

**Java 的 SPI（Service Provider Interface）机制** 是一种用于发现和加载服务提供者的框架，允许第三方实现或多种实现插件化。通过 SPI，开发者可以在运行时动态地选择和加载特定的服务实现，而无需在代码中硬编码具体的实现类。

SPI 机制是 Java 中实现模块化、可扩展系统的一种强大工具，广泛应用于各种框架和库中，如 JDBC 驱动程序、JAXP 解析器等。

::: details SPI机制
#### 工作原理

1. **定义接口**：首先定义一个服务接口，该接口将由不同的服务提供者实现。
2. **配置文件**：服务提供者需要在 JAR 文件的 `META-INF/services` 目录下创建一个以服务接口全限定名为名的文件，并在此文件中列出所有实现类的全限定名。
3. **加载服务**：使用 `java.util.ServiceLoader` 来加载指定接口的所有可用实现。

#### 使用步骤

- **定义服务接口**：创建一个接口，如 `com.example.spi.MyService`。
- **实现服务接口**：编写多个实现类，每个类都实现了上述接口。
- **注册实现类**：在 `META-INF/services/com.example.spi.MyService` 文件中列出所有实现类的全限定名。
- **加载服务**：通过 `ServiceLoader.load(MyService.class)` 加载并迭代所有实现类的实例。

假设有一个 `Logger` 接口：

```java
package com.example.spi;

public interface Logger {
    void log(String message);
}
```

两个实现类 `ConsoleLogger` 和 `FileLogger`：

```java
package com.example.impl;

import com.example.spi.Logger;

public class ConsoleLogger implements Logger {
    @Override
    public void log(String message) {
        System.out.println("CONSOLE: " + message);
    }
}

package com.example.impl;

import com.example.spi.Logger;

public class FileLogger implements Logger {
    @Override
    public void log(String message) {
        // 假设这里是写入文件的逻辑
        System.out.println("FILE: " + message);
    }
}
```

然后，在 `META-INF/services/com.example.spi.Logger` 文件中列出这两个实现类：

```
com.example.impl.ConsoleLogger
com.example.impl.FileLogger
```

最后，使用 `ServiceLoader` 来加载这些实现：

```java
import com.example.spi.Logger;
import java.util.ServiceLoader;

public class SpiTest {
    public static void main(String[] args) {
        ServiceLoader<Logger> loaders = ServiceLoader.load(Logger.class);
        for (Logger logger : loaders) {
            logger.log("Hello, World!");
        }
    }
}
```
:::

- **解耦合**：服务使用者和服务提供者之间完全解耦，便于维护和扩展。
- **灵活性**：支持多实现的灵活加载，适用于插件式架构。
- **易于测试**：可以轻松替换不同实现进行单元测试。


















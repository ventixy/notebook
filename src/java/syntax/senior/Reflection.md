---

order: 15
title: Reflection反射

---


The Reflection API：[Trail: The Reflection API (The Java&trade; Tutorials)](https://docs.oracle.com/javase/tutorial/reflect/index.html)

Reflection is commonly used by programs which require the ability to examine or modify the runtime behavior of applications running in the Java virtual machine.



## 反射(Reflection)

Java反射机制是Java语言提供的一种能够在运行时分析类和对象的能力。它允许程序在运行时动态地获取类的信息（如类名、属性、方法等），创建对象，调用方法，改变属性值等。这对于开发一些需要高度灵活性和元编程功能的应用非常有用，比如开发框架、ORM工具、AOP（面向切面编程）等。

### 为什么需要反射

1. **动态性与灵活性**：反射使得程序可以在运行时决定加载哪个类、创建哪个对象、调用哪个方法等，这为开发提供了极高的灵活性。特别是在编写需要根据配置或用户输入动态调整行为的程序时尤为重要，如框架、插件系统、序列化/反序列化等。

2. **元编程**：元编程是指编写能够生成或操作其它程序的程序。反射是实现这一目标的重要手段之一，因为它允许程序在运行时检查和修改自身结构。

3. **框架开发**：许多Java框架如Spring、Hibernate等都大量利用了反射来实现依赖注入、自动配置、对象关系映射等功能，从而极大地简化了应用的开发复杂度。

4. **自省（Introspection）**：反射允许程序检查自己的状态，比如一个对象可以发现并调用自己的方法或修改自己的字段，这对于编写调试工具、分析器等非常有用。

### 反射的优缺点

#### 优点：

1. **灵活性与动态性**：提高了软件的适应性和扩展性，使得程序能够根据不同的环境或需求进行调整。
2. **简化框架开发**：对于框架设计者来说，反射减少了用户必须进行的手动配置，使得框架更加易用和强大。
3. **增强代码的通用性**：反射可以编写出适用于多种类型的代码，无需为每种类型单独编写逻辑。

#### 缺点：

1. **性能开销**：反射操作比直接的Java代码执行要慢，因为涉及到查找类、方法等元数据的过程。
2. **安全性问题**：反射可以访问私有成员，这可能会破坏类的封装性和安全性，增加潜在的错误和漏洞。
3. **代码可读性和维护性**：过度使用反射会使代码逻辑变得难以理解和维护，尤其是当反射逻辑复杂时。
4. **可能导致意外行为**：由于可以在运行时修改程序结构，不当使用反射可能导致难以预料的程序行为。




## Class类及其应用

在Java中，`Class`类是所有类的类型信息的描述。每个加载到Java虚拟机中的类或接口都会有一个对应的`Class`实例，这个实例包含了该类的所有信息，如类名、包名、父类、实现的接口、构造函数、方法、字段等。通过这个`Class`对象，开发者可以在运行时获取和操作这些信息，这是实现Java反射机制的基础。

::: tip 
在java中，一个普通事物、如人类可以用一个Person类来表示，那么众多的java类用什么来表示呢？其实所有的java类同样属于一类事物，而描述这类事物的java类就是 Class 
:::


### 获取Class对象

在一个普通类中，如Person代表一个类，我们通过new获得该类的对象，那Class类又如何获得其对象呢？ 想要获得一个类的 Class类型 （即Class实例对象、或者说内存中代表该类的字节码文件），通常有以下三种方式：


#### 1. `Class.forName()`

使用`Class.forName()`静态方法，通过传递类的全限定名（包括包名）来获取其`Class`对象。如果类还没有被加载，则会触发类加载过程。

```java
try {
    Class<?> clazz = Class.forName("java.util.ArrayList");
} catch (ClassNotFoundException e) {
    e.printStackTrace();
}
```

#### 2. `对象.getClass()`

任何对象都有一个`getClass()`方法，可以用来获取该对象所属类的`Class`对象。

```java
ArrayList<String> list = new ArrayList<>();
Class<?> clazz = list.getClass();
```

#### 3. 使用`.class`语法

这是最直接的方式，对于已知的类型，可以直接使用`.class`后缀来获取其`Class`对象。这种方式不需要实例化对象，也不会抛出异常。

```java
Class<String[]> stringArrayClass = String[].class;
```


::: info 基本数据类型的Class对象

#### 基本数据类型

- **Class对象获取**：基本数据类型没有类名的概念，不能直接使用`Class.forName()`获取，但Java为每种基本类型都预定义了一个相应的`Class`对象。例如，`int`的基本类型对应的`Class`对象可以通过`Integer.TYPE`或者`int.class`获取。
- **类型判断**：使用`isPrimitive()`方法会返回`true`。

```java
System.out.println(int.class);     // int
System.out.println(Integer.TYPE);  // int

System.out.println(Integer.class); // class java.lang.Integer
```
:::



### Class类常用方法

#### 1. `getName()`、`getSimpleName()`

- `getName()`返回类的全限定名，包括包名。
- `getSimpleName()`只返回类名，不包含包名。

```java
String className = clazz.getName(); // 返回全限定名，如 "java.util.ArrayList"
String simpleName = clazz.getSimpleName(); // 返回简单类名，如 "ArrayList"
```

#### 2. `getSuperclass()`

返回表示此类所表示的类的超类的`Class`对象。如果是Object类，则返回null。

```java
Class<?> superClass = clazz.getSuperclass(); // 获取父类Class对象
```

#### 3. `getInterfaces()`

返回一个数组，包含此Class对象所表示的类或接口实现的所有接口的`Class`对象。

```java
Class<?>[] interfaces = clazz.getInterfaces(); // 获取实现的接口Class数组
```

#### 4. `getModifiers()`

返回此`Class`对象所表示的类或接口的Java语言修饰符编码。可以配合`Modifier.toString(int)`转换为字符串形式。

```java
int modifiers = clazz.getModifiers();
String modifierStr = Modifier.toString(modifiers); // 转换修饰符为字符串
```

#### 5. 类型判断方法

- `isInterface()`：判断是否是接口。
- `isArray()`：判断是否是数组类型。
- `isPrimitive()`：判断是否是基本类型。

```java
boolean isInterface = clazz.isInterface();
boolean isArray = clazz.isArray();
boolean isPrimitive = clazz.isPrimitive();
```

这些方法和属性只是`Class`类的一部分功能，实际上`Class`类提供了更丰富的接口来探索和操作类的元数据。




## 反射中的核心操作

### 构造函数操作
Java反射中的构造函数操作允许我们在运行时动态地访问和使用类的构造方法。包括获取构造函数信息、创建对象实例等。

**获取构造函数对象**：

**1. `getConstructor(Class<?>... parameterTypes)`**
- **功能**：获取指定参数类型的**公共构造函数**。
- **使用场景**：当你确切知道要使用的构造函数的参数类型，并且该构造函数是公共的时。例如创建对象时，需要通过特定的公共构造函数初始化对象。

**2. `getConstructors()`**
- **功能**：获取类的所有**公共构造函数**。
- **使用场景**：当你需要遍历或了解一个类的所有公共构造函数时。例如分析类的设计，查看其可用的构造方式，或在框架中动态选择合适的构造函数创建对象。

**3. `getDeclaredConstructor(Class<?>... parameterTypes)`**
- **功能**：获取指定参数类型的**声明构造函数**，无论其访问权限。
- **使用场景**：当需要访问或使用私有、受保护或默认访问权限的构造函数时。例如进行单元测试时，需要创建对象并初始化私有状态；或者在某些框架中动态调用非公开的构造函数。

**4. `getDeclaredConstructors()`**
- **功能**：获取类的所有**声明构造函数**，包括公共、私有、受保护和默认访问级别的。
- **使用场景**：进行类的元数据分析，需要全面了解类的构造情况，不限于访问权限。例如作为代码分析工具，用于分析类的结构和设计，或是进行深度反射操作时，需要考虑所有可能的构造方式。


::: info 创建对象实例
- 通过构造函数创建对象实例需要以下步骤：
  1. 获取构造函数。
  2. 使用构造函数的`newInstance(Object... initargs)`方法创建对象实例，传入构造函数所需的参数。
:::



代码示例：
::: code-tabs#shell

@tab:active 公共构造函数
```java
import java.lang.reflect.Constructor;

public class ReflectConstructorExample {
    public static void main(String[] args) throws Exception {
        Class<Person> personClass = Person.class;

        // 获取所有的公共构造函数
         Constructor<?>[] constructors = personClass.getConstructors();

        // 获取指定的公共构造函数
        Constructor<Person> publicConstructor = personClass.getConstructor(String.class);

        // 使用构造函数创建对象实例
        Person person = publicConstructor.newInstance("Alice");
        System.out.println(person.getName()); // 输出: Alice
    }
}
```

@tab 所有的构造函数
```java
import java.lang.reflect.Constructor;

public class ReflectConstructorExample {
    public static void main(String[] args) throws Exception {
        Class<Person> personClass = Person.class;

        // 获取所有声明的构造函数
        Constructor<?>[] constructors = personClass.getDeclaredConstructors();

        // 获取私有构造函数
        Constructor<Person> privateConstructor = personClass.getDeclaredConstructor();
        privateConstructor.setAccessible(true); // 禁用访问控制检查

        // 使用私有构造函数创建对象实例
        Person person = privateConstructor.newInstance();
    }
}
```

@tab `Person`类
```java
// 假设有一个简单的`Person`类，包含一个公共构造函数和一个私有构造函数：
public class Person {
    private String name;

    // 公共构造函数
    public Person(String name) {
        this.name = name;
    }

    // 私有构造函数
    private Person() {}

    // 省略getter和setter
}

```
:::

**注意事项**:
- 由于私有构造函数在外部不可见，需要调用`setAccessible(true)`来允许访问。
- 使用反射访问私有构造函数或修改私有成员时，应当谨慎，因为这可能违反类的设计初衷，影响代码的稳定性和安全性。
- `newInstance()`方法可能会抛出`InstantiationException`、`IllegalAccessException`和`IllegalArgumentException`等异常，需要妥善处理。
- 反射操作通常较直接实例化对象慢，因此在性能敏感的场景下应权衡使用。



### 成员变量操作

Java反射中的成员变量操作使我们能在运行时动态地访问和修改类的字段（包括属性）。这包括获取字段信息、读取和设置字段值等操作。

**获取字段对象**：

**1. `getField(String name)`**
- **功能**：获取指定公共字段（包括继承的）。
- **使用场景**：当需要访问一个已知名称的公共字段时。适用于读取或修改对象的公共属性值。

**2. `getFields()`**
- **功能**：获取类的所有公共字段（包括继承的）。
- **使用场景**：遍历或检查类的所有可访问字段，常用于数据分析或动态操作对象的公共属性。

**3. `getDeclaredField(String name)`**
- **功能**：获取指定名称的声明字段，不论访问权限。
- **使用场景**：需要访问私有、受保护或默认访问权限的字段时，例如在单元测试中设置对象内部状态。

**4. `getDeclaredFields()`**
- **功能**：获取类的所有声明字段，包括私有、受保护、默认和公共的。
- **使用场景**：进行深入的类分析，需要查看所有字段，不限于访问权限。适用于高级反射操作或框架中动态处理对象的内部状态。

::: info 读取和设置字段值
- **读取**：使用`Field`对象的`get(Object obj)`方法获取指定对象的字段值。
- **设置**：使用`Field`对象的`set(Object obj, Object value)`方法设置指定对象的字段值。如果字段是私有的，需要先调用`setAccessible(true)`来允许访问。
:::

代码示例：
::: code-tabs#shell

@tab:active 公共字段操作
```java
import java.lang.reflect.Field;

public class ReflectFieldExample {
    public static void main(String[] args) throws Exception {
        Person person = new Person("Alice");
        Class<Person> personClass = Person.class;

        // 获取公共字段
        Field nameField = personClass.getField("name");

        // 读取字段值
        String name = (String) nameField.get(person);
        System.out.println(name); // 输出: Alice

        // 修改字段值
        nameField.set(person, "Bob");
        System.out.println(person.getName()); // 输出: Bob
    }
}
```

@tab 私有字段操作
```java
import java.lang.reflect.Field;

public class ReflectFieldExample {
    public static void main(String[] args) throws Exception {
        Person person = new Person();
        Class<Person> personClass = Person.class;

        // 获取私有字段
        Field nameField = personClass.getDeclaredField("name");
        nameField.setAccessible(true); // 禁用访问控制检查

        // 设置私有字段值
        nameField.set(person, "Charlie");
        System.out.println(((Person) nameField.get(person)).getName()); // 输出: Charlie
    }
}
```

@tab `Person`类
```java
public class Person {
    private String name;

    // 公共构造函数
    public Person(String name) {
        this.name = name;
    }

    // 私有构造函数
    private Person() {}

    // 省略getter和setter
}
```
:::
**注意事项**:
- 访问私有字段时同样需要调用`setAccessible(true)`来禁用Java的访问控制检查。
- 修改对象的私有状态可能会绕过类设计者的初衷，影响程序的稳定性和安全性。
- 操作时可能会遇到`IllegalAccessException`、`IllegalArgumentException`等异常，需要适当处理。
- 反射操作较直接访问字段慢，对性能有要求的应用需权衡使用。




### 反射中的方法操作

Java反射中的方法操作允许我们在运行时动态地访问和使用类的方法，包括获取方法信息、执行方法调用等。

**获取方法对象**：

**1. `getMethod(String name, Class<?>... parameterTypes)`**
- **功能**：获取指定名称和参数类型的**公共方法**，包括继承的方法。
- **使用场景**：当你确切知道要调用的方法名称和参数类型，并且该方法是公共的时。例如，在动态调用对象的方法时，根据方法名和参数类型精确匹配。

**2. `getMethods()`**
- **功能**：获取类的所有**公共方法**，包括继承自父类和实现自接口的方法。
- **使用场景**：需要遍历或了解一个类的所有可访问方法，用于分析或动态选择合适的方法调用。

**3. `getDeclaredMethod(String name, Class<?>... parameterTypes)`**
- **功能**：获取指定名称和参数类型的**声明方法**，无论其访问权限。
- **使用场景**：当需要访问或使用私有、受保护或默认访问权限的方法时。例如，在单元测试中调用私有方法验证内部逻辑，或框架中调用非公开方法进行扩展。

**4. `getDeclaredMethods()`**
- **功能**：获取类的所有**声明方法**，包括公共、私有、受保护和默认访问级别的方法。
- **使用场景**：进行类的元数据分析，需要全面了解类的方法实现，不受访问权限限制。常见于代码分析工具、框架扩展等场景。

::: info 执行方法调用
- 使用`Method`对象的`invoke(Object obj, Object... args)`方法执行方法调用，其中`obj`是方法所属的对象实例，`args`是方法调用时的参数列表。

- 当调用静态方法时，`obj`参数应传入`null`，之后按照正常参数顺序传入方法的参数值。
:::


代码示例：
::: code-tabs#shell

@tab:active 公共方法调用
```java
import java.lang.reflect.Method;

public class ReflectMethodExample {
    public static void main(String[] args) throws Exception {
        Person person = new Person("Alice");
        Class<Person> personClass = Person.class;

        // 获取公共方法
        Method greetMethod = personClass.getMethod("greet");

        // 执行方法调用
        String greeting = (String) greetMethod.invoke(person);
        System.out.println(greeting); // 假设输出: Hello, I'm Alice
    }
}
```

@tab 私有方法调用
```java
import java.lang.reflect.Method;

public class ReflectMethodExample {
    public static void main(String[] args) throws Exception {
        Person person = new Person();
        Class<Person> personClass = Person.class;

        // 获取私有方法
        Method privateMethod = personClass.getDeclaredMethod("sayHelloPrivately");
        privateMethod.setAccessible(true); // 禁用访问控制检查

        // 执行私有方法调用
        String message = (String) privateMethod.invoke(person);
        System.out.println(message); // 假设输出: Private greeting
    }
}
```

@tab `Person`类示例
```java
public class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    public void greet() {
        System.out.println("Hello, I'm " + name);
    }

    // 假设的私有方法
    private String sayHelloPrivately() {
        return "Private greeting";
    }
}
```
:::

**注意事项**:
- 访问私有方法或修改私有状态时，需要调用`setAccessible(true)`来允许访问。
- 反射调用可能会绕过正常的访问控制和类型检查，需谨慎使用，以免破坏类的封装性和安全性。
- `invoke()`方法可能抛出`IllegalAccessException`、`IllegalArgumentException`、`InvocationTargetException`等异常，调用时应妥善处理。
- 反射调用相比直接调用方法有性能开销，尤其在频繁调用时，应考虑其对性能的影响。


| Method类的方法               | 作用                                   |
| ------------------------ | ------------------------------------ |
| `getName()`              | 获取方法名                                |
| `isVarArgs()`            | 如果该方法声明为采用可变数量的参数，则返回true; 否则返回false |
| `getModifiers()`         | 获取权限修饰符                              |
| `getReturnType()`        | 获取返回类型                               |
| `getExceptionTypes()`    | 获取所有抛出的异常类型                          |
| `getGenericReturnType()` | 返回Type类型                             |
| `getParameterTypes()`    | 获取所有参数的类型                            |
| `getParameterCount()`    | 获取所有参数的个数                            |
| `getAnnotations()`       | 获取方法级别的注解                            |
| `getDeclaringClass ()`   | 获取方法所在的类信息                           |





### setAccessible

`setAccessible(boolean)`是`AccessibleObject`类（`Field`、`Method`和`Constructor`都继承了`AccessibleObject`类）的一个方法，用于控制Java的访问控制检查。当参数为`true`时，它指示Java虚拟机忽视访问修饰符（如`private`、`protected`），允许外部代码访问和修改原本不可访问的成员。

@startuml
abstract class AccessibleObject {
  - accessible: boolean
  + setAccessible(boolean flag)
  + isAccessible(): boolean
  + getModifiers(): int
}

class Field {
  - name: String
  - type: Class<*>
  + getType(): Class<*>
  + getDeclaringClass(): Class<*>
}

class Method {
  - name: String
  - returnType: Class<*>
  - parameterTypes: Class<?>...
  + getReturnType(): Class<*>
  + getParameterTypes(): Class<?>...
}

class Constructor {
  - parameterTypes: Class<?>...
  + getParameterTypes(): Class<?>...
  + getDeclaringClass(): Class<*>
}

note left of AccessibleObject: "基类，提供访问控制功能"

Field ..> AccessibleObject : inherits
Method ..> AccessibleObject : inherits
Constructor ..> AccessibleObject : inherits
@enduml
  
**安全考量**：
  - **绕过封装**：使用`setAccessible(true)`可以访问和修改类的私有成员，这可能违背了类设计者的初衷，破坏了封装性，导致内部状态不一致或逻辑错误。
  - **安全权限**：在安全性敏感的环境中，如Applet或沙盒环境中，未经许可访问私有成员可能会违反安全策略，导致安全漏洞。
  - **代码审计和维护**：反射使得代码行为难以预测，增加了调试和维护的难度，也可能引入安全审计的盲点。

::: info 风险和性能问题
#### 反射可能导致的安全风险

- **信息泄露**：通过反射可以访问到原本不可见的内部实现细节，包括敏感数据或系统资源，从而可能造成信息泄露。
- **恶意操作**：攻击者可能利用反射绕过安全检查，修改或操控应用程序的内部状态，执行未授权的操作，如修改安全配置、注入恶意代码等。
- **权限提升**：在某些情况下，不当使用反射可能允许低权限用户执行高权限操作，破坏系统的权限体系。

#### 反射的性能问题

- **性能开销**：反射操作相比直接调用或访问成员有显著的性能开销，因为每次反射调用都需要进行类型查找、安全检查和方法查找等过程。
  - 类型检查和解析：反射调用涉及到的类型检查和方法查找是在运行时完成的，比编译时确定的直接调用要慢得多。
  - 缓存优化：尽管JVM会对反射调用进行一定程度的缓存优化，但首次调用或不频繁调用的反射操作依然效率较低。
- **资源消耗**：频繁的反射操作会增加内存消耗，因为反射操作会产生额外的元数据和对象实例，特别是在大量使用时，可能引起内存泄漏或垃圾回收压力。
:::

虽然反射提供了强大的动态性，但应审慎使用，特别是在考虑程序的安全性和性能时。在使用`setAccessible(true)`时，应确保有足够的理由，并充分评估潜在的安全风险。对于性能敏感的应用，应尽量减少反射的使用，考虑设计模式或其他替代方案来提高效率。在开发过程中，应加强对反射代码的审查和测试，确保其符合安全规范和性能要求。

::: tip 带declared跟不带的API有什么区别?
以Field为例：
- 带declared能无视访问权限获取自身类的全部属性（包括private、static修饰的属性），但只能获取本类的成员
- 不带的只能获取自身public所修饰的属性（但还能获取继承自父类的public所修饰的属性、同样包括静态属性）
:::




### 反射中的注解处理

Java反射中的注解处理能力，允许我们在运行时动态地访问和分析类、方法、字段等元素上的注解信息，为程序提供了高度的灵活性和元数据操作能力。

**获取注解信息**：

**1. `getAnnotation(Class<A> annotationClass)`**
- **功能**：获取指定类型的注解实例，如果该注解不存在于该元素上，则返回`null`。
- **使用场景**：当你知道想要检查的注解类型，并且需要直接访问其信息时，比如读取方法上的某个注解参数值。

**2. `isAnnotationPresent(Class<? extends Annotation> annotationClass)`**
- **功能**：检查指定类型的注解是否存在于该元素上。
- **使用场景**：在决定是否进一步处理前，快速检查某个元素是否带有特定注解。

**3. `getAnnotations()` 和 `getDeclaredAnnotations()`**
- **功能**：分别获取当前元素上的所有注解和直接声明的注解数组。
- **使用场景**：遍历一个元素上的所有注解，进行批量处理或分析，特别是当需要考虑继承的注解（`getAnnotations()`）或仅限于本元素声明的注解（`getDeclaredAnnotations()`）时。

**处理注解元素**：

- 一旦获取到注解实例，就可以像操作普通对象一样访问其方法和属性，获取注解中的信息。

**示例代码**：

假设有一个名为`@Info`的注解：

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Info {
    String author();
    String date();
}
```

应用于一个类或方法上：

```java
@Info(author = "John Doe", date = "2023-04-01")
public class MyClass {
    // ...
}
```

使用反射访问这个注解：

```java
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;

public class ReflectAnnotationExample {
    public static void main(String[] args) throws Exception {
        Class<MyClass> clazz = MyClass.class;

        // 检查类是否含有@Info注解
        if (clazz.isAnnotationPresent(Info.class)) {
            Info classInfo = clazz.getAnnotation(Info.class);
            System.out.println("Class Author: " + classInfo.author());
            System.out.println("Date: " + classInfo.date());
        }

        // 同样可以应用于方法、字段等其他元素
    }
}
```

**注意事项**:

- 注解的保留策略（`@Retention`）决定了注解是否在运行时可见。只有保留策略为`RUNTIME`的注解才能在反射中被访问。
- 通过注解处理，可以实现动态配置、日志记录、验证等多种功能，但应避免过度使用，以免影响代码的可读性和性能。
- 注意注解的生命周期和作用范围，合理设计注解，避免不必要的运行时开销。




### 反射中的数组操作

Java反射中的数组操作功能强大，允许我们在运行时动态地创建数组，访问和修改数组元素，以及操作数组类型信息，为编程提供了极高的灵活性。


::: info 数组的Class对象

- **Class对象获取**：数组也有自己的`Class`对象，可以直接使用`.class`语法，如`String[].class`，也可以通过`Class.forName()`传入数组的全限定名（包含维度信息）来获取，如`"[Ljava.lang.String;"`。
- **类型判断**：使用`isArray()`方法会返回`true`，同时可以通过`getComponentType()`获取数组元素的类型。
- **多维数组**：多维数组也被视为数组类型，每一维度增加一层包装，例如，二维数组`String[][]`的`Class`对象可以通过多次调用`getComponentType()`来遍历各维度的类型。
```java
System.out.println(int[].class);         // class [I
System.out.println(String[].class);      // class [Ljava.lang.String
System.out.println(String[][].class);    // class [[Ljava.lang.String

System.out.println(String[][].class.getComponentType());  
// class [Ljava.lang.String
System.out.println(String[][].class.getComponentType().getComponentType());  
// class java.lang.String
```

- **`[`符号**：这个符号代表“数组”。在Java的内部表示中，每一个维度的数组都由一个前置的`[`来表示。因此，一个一维数组的类型标识以`[`开始，二维数组则以`[` `[` 开始，依此类推。

- **`L`符号**：紧随在`[`之后的`L`代表“对象引用”（Letter 'L' stands for reference type）。这意味着该数组存储的是对象引用而不是基本类型。如果数组存储的是基本类型，那么这个`L`就不会出现，例如，一个`int[]`数组的类型标识就是`[I`（`I`代表`int`类型）。

:::


**动态创建数组**

1. **`newInstance(Class<?> componentType, int length)`**
   - **功能**：根据指定的组件类型和长度创建一个新的数组实例。
   - **使用场景**：当需要在运行时确定数组类型或大小时，如动态数据处理或框架中按需构建数组。

**访问和修改数组元素**

- **`get(Object array, int index)` 和 `set(Object array, int index, Object value)`**
   - **功能**：`get`方法用于获取数组中指定索引位置的元素；`set`方法用于设置数组中指定索引位置的元素值。
   - **使用场景**：动态访问和修改数组内容，特别适用于反射操作未知类型数组时。

**数组类型操作**

- **`getComponentType()`**
   - **功能**：获取数组元素的类型。
   - **使用场景**：需要知道数组存储的数据类型，以便进行进一步的反射操作或类型检查。

**示例代码**

```java
import java.lang.reflect.Array;

public class ReflectArrayExample {
    public static void main(String[] args) throws Exception {
        // 动态创建数组
        // 创建长度为5的整型数组
        int[] intArray = (int[]) Array.newInstance(int.class, 5); 
        // 创建长度为7的字符串数组
        String[] stringArray = (String[]) Array.newInstance(String.class, 7); 

        // 访问和修改数组元素
        Array.set(intArray, 0, 42); // 设置第一个元素为42
        int firstElement = (int) Array.get(intArray, 0); // 获取第一个元素
        System.out.println(firstElement); // 输出: 42

        // 访问数组类型信息
        Class<?> componentTypeInt = intArray.getClass().getComponentType();
        System.out.println("intArray元素类型: " + componentTypeInt.getName()); 
        // 输出: int
    }
}
```

**注意事项**:

- 使用`Array.newInstance()`创建数组时，确保传入正确的组件类型和长度。
- 在调用`Array.get()`和`Array.set()`方法时，需要适当转型，因为这些方法接受`Object`类型的数组参数和元素值。
- 数组的反射操作虽然灵活，但可能比直接操作数组慢，故在性能敏感的场景中应谨慎使用。

通过反射处理数组，我们可以根据运行时的需求动态地创建和操作数组，这对于构建灵活的框架、进行复杂的动态数据处理任务非常有用。







## 反射实战应用示例

- 动态代理的实现
- 自动化测试中的应用
- 配置文件驱动的程序设计


### 动态代理的实现

详见：[动态代理](../../frame/spring/design.md#动态代理及其实现)


### 通过反射创建对象

**1. 使用`Class`对象的`newInstance()`方法（无参构造函数）**

当类有一个无参构造函数时，可以直接通过`Class`对象的`newInstance()`方法创建该类的实例。这种方法简单直接，但仅适用于无参数的构造函数。

```java
import java.lang.reflect.InvocationTargetException;

public class ReflectionExample {
    public static void main(String[] args) {
        try {
            // 获取String类的Class对象
            Class<?> stringClass = String.class;

            // 使用newInstance()方法创建String对象
            String exampleString = (String) stringClass.newInstance();
            System.out.println(exampleString); // 输出空字符串，因为是无参构造函数

            // 假设有一个自定义类 MyClass 有无参构造函数
            Class<?> myClass = MyClass.class;
            MyClass myInstance = (MyClass) myClass.newInstance();
            // 接下来可以使用myInstance进行操作
        } catch (InstantiationException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }
}

// 假定的自定义类MyClass
class MyClass {
    // 无参构造函数
    public MyClass() {
        // 初始化逻辑
    }
}
```

**注意事项**：
- `newInstance()`方法内部会调用无参构造函数创建对象，因此要求该类必须有一个无参构造函数。
- 此方法可能抛出`InstantiationException`（如果类是一个抽象类或接口）或`IllegalAccessException`（如果构造函数不是公共的）。

<br/>

**2. 使用`Constructor`类实例化对象（支持有参数构造函数）**

对于有参数的构造函数，需要先通过`Class`对象获取对应的`Constructor`实例，然后调用其`newInstance(Object... initargs)`方法创建对象。

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public class ReflectionExample {
    public static void main(String[] args) {
        try {
            // 获取MyClass类的Class对象
            Class<?> myClass = MyClass.class;

            // 获取有参构造函数（假设存在一个接受String和int参数的构造函数）
            Constructor<?> constructor = myClass.getConstructor(String.class, int.class);

            // 使用构造函数创建对象
            Object instance = constructor.newInstance("Example", 42);

            // 强制转换为实际类型以使用
            MyClass myObj = (MyClass) instance;
            // 接下来可以使用myObj进行操作
        } catch (NoSuchMethodException | InstantiationException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }
    }
}

// 假定的自定义类MyClass
class MyClass {
    private String name;
    private int age;

    // 有参构造函数
    public MyClass(String name, int age) {
        this.name = name;
        this.age = age;
    }
    // 省略getter和setter
}
```

**注意事项**：
- 使用`getConstructor()`时需要提供构造函数参数类型的类对象数组，如果构造函数不存在，则会抛出`NoSuchMethodException`。
- 调用`newInstance(Object... initargs)`时传递的实际参数必须与构造函数的参数类型和顺序匹配。
- 该方法同样可能抛出`InstantiationException`、`IllegalAccessException`，以及新增的`InvocationTargetException`（如果构造函数内部抛出异常）。





## Java9+的新特性
- `java.lang.reflect.Parameter`类的增强
- `varhandle`与反射的结合使用









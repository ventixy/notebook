---

order: 1
title: Enum枚举

---


Oracle文档地址：https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html


Java枚举（Enumeration）是Java语言中一种特殊的类，用于定义固定的常量集合。枚举 一般表示一组常量、enum 定义的枚举类默认继承了 `java.lang.Enum` 类。枚举类型的引入增强了代码的可读性、类型安全性和可维护性。




### 枚举的基本使用

- **枚举常量**：枚举中的成员，它们是静态、final且实例化过的。
- **枚举与类的关系**：理解枚举是一种特殊的类，可以有构造器、属性、方法等。
- **枚举的继承性**：枚举不能继承其他类，但可以实现接口。

Java 枚举类使用 enum 关键字来定义，各个常量使用逗号 ` , ` 来分割

```java
// 枚举 Weekday 是一个特殊的类
public enum Weekday {
    // 每个枚举常量都是一个Weekday的实例对象，并且都默认具备 public static final 修饰符
    SUN, MON, TUE, WED, THU, FRI, SAT
}
```

**枚举常用方法**:
- `name()` 获取枚举常量的名称
- `values()` 以数组形式返回枚举类型的所有成员 
- `ordinal()` 找到每个枚举常量的索引，就像数组索引一样 
- `valueOf()`  返回指定字符串值的枚举常量、不存在的会报错 `IllegalArgumentException`  


```java
public class WeekdayEnumTest {
    public static void main(String[] args) {
        // 迭代枚举
        for (Weekday weekday : Weekday.values()) {
            System.out.println(weekday.ordinal() + ": " + weekday.name());
        }

        // 当使用枚举类型成员时，直接使用枚举名称调用成员即可
        Weekday sunday = Weekday.SUN;
        System.out.println(sunday);

        Weekday mon = Weekday.valueOf("MON");
        System.out.println(mon);
    }
}
```

![](https://image.ventix.top/java/image-20211105224800254.png)

当你调用枚举常量的`toString()`方法时，它会返回枚举常量的名字（即你在定义枚举时所写的字符串，全部大写且单词间用下划线连接）, 如果不重写 `toString()` 方法，那么即使在带有构造方法和附加属性的枚举类中，它仍然会返回枚举常量的名称。



::: info 比较枚举值的方式

在Java中，比较枚举值最直接且推荐的方式是使用`==`操作符。因为枚举类型的每个实例都是唯一的，而且是不可变的，所以使用`==`而不是`equals()`方法来比较枚举值是安全且高效的。例如：

```java
public class EnumComparison {
    public static void main(String[] args) {
        Singleton instance1 = Singleton.INSTANCE;
        Singleton instance2 = Singleton.INSTANCE;

        // 使用'=='比较枚举实例
        if (instance1 == instance2) {
            System.out.println("Both instances are the same."); 
            // 这里会输出，因为它们指向同一个实例
        }
    }
}
```
:::





### 带有构造方法的枚举

实现带有构造方法的枚举（项目中常使用的方式），示例：

```java
public enum Color {
    RED(255, 0, 0),
    GREEN(0, 255, 0),
    BLUE(0, 0, 255);

    private int redValue;
    private int greenValue;
    private int blueValue;

    // 私有构造方法，用于初始化每个枚举常量的颜色值
    private Color(int red, int green, int blue) {
        this.redValue = red;
        this.greenValue = green;
        this.blueValue = blue;
    }

    // 提供getter方法访问颜色值
    public int getRedValue() { return redValue; }
    public int getGreenValue() { return greenValue; }
    public int getBlueValue() { return blueValue; }
}
```

Color枚举类的使用示例：
```java
public class ColorTest {

    public static void main(String[] args) {
        // 测试RED颜色的RGB值
        testColorRGB(Color.RED); // 预期输出: RED 的 RGB 值为 (255, 0, 0)

        // 测试GREEN颜色的RGB值
        testColorRGB(Color.GREEN); // 预期输出: GREEN 的 RGB 值为 (0, 255, 0)

        // 测试BLUE颜色的RGB值
        testColorRGB(Color.BLUE); // 预期输出: BLUE 的 RGB 值为 (0, 0, 255)
    }

    /**
     * 测试指定颜色的RGB值
     * @param color 要测试的颜色枚举
     */
    private static void testColorRGB(Color color) {
        System.out.println(color.name() + " 的 RGB 值为 (" 
                           + color.getRedValue() + ", " 
                           + color.getGreenValue() + ", " 
                           + color.getBlueValue() + ")");
    }
}
```

### 带有抽象方法的枚举

带有抽象方法的枚举、在上例的基础上添加一个抽象方法，如下：

```java
public enum Sex {
    MALE(1, "男"){
        @Override
        public void haircut() {
            System.out.println("剃个光头吧~");
        }
    },
    FEMALE(2, "女"){
        @Override
        public void haircut() {
            System.out.println("还是留长发吧~");
        }
    };

    public final Integer type;
    public final  String value;

    private Sex(Integer type, String value){
        this.type = type;
        this.value = value;
    }

    public abstract void haircut();
}
```

枚举使用示例：
```java
public class SexEnumTest {
    public static void main(String[] args) {
        Sex man = Sex.MALE;

        System.out.println(man);            // MALE  调用默认的toString()
        System.out.println(man.name());     // MALE
        System.out.println(man.ordinal());  // 0

        System.out.println(man.type);       // 1
        System.out.println(man.value);      // 男

        man.haircut();                      // 剃个光头吧~
        Sex.FEMALE.haircut();               // 还是留长发吧~
    }
}
```

带有抽象方法的枚举并不常见，但它们在某些特定场景下非常有用，可以用来实现策略模式或状态模式等设计模式，使得枚举不仅能表示一系列固定的值，还能携带相关的行为。



### Enum源码浅析

enum 关键字定义的枚举类都默认继承了Enum 类（抽象类）、该类位于 `java.lang`下、该类具有两个 final 常量：

- name ：枚举常量，如上例中的 ` SUN MON ` 等
- ordinal ：类似数组索引，即位置（position）的意思，默认值从0开始

下为Enum类的部分源码：

```java
public abstract class Enum<E extends Enum<E>> implements Comparable<E>, Serializable {

    // The name of this enum constant, as declared in the enum declaration.
    private final String name;

    public final String name() {
        return name;
    }

    public String toString() {
        return name;
    }

    /**
     * The ordinal of this enumeration constant (its position in the enum declaration, 
     * where the initial constant is assigned an ordinal of zero).
     */
    private final int ordinal;

    public final int ordinal() {
        return ordinal;
    }

    // Sole constructor.  Programmers cannot invoke this constructor.
    protected Enum(String name, int ordinal) {
        this.name = name;
        this.ordinal = ordinal;
    }

    public static <T extends Enum<T>> T valueOf(Class<T> enumType, String name) {
        T result = enumType.enumConstantDirectory().get(name);
        if (result != null)
            return result;
        if (name == null)
            throw new NullPointerException("Name is null");
        throw new IllegalArgumentException(
            "No enum constant " + enumType.getCanonicalName() + "." + name);
    }
}
```



### 应用场景与实践
Java枚举使用建议：
1. **命名规范**：枚举常量应该全大写，单词间用下划线分隔，如`MONDAY`。这有助于提高代码的可读性。
2. **使用枚举而非整型常量**：避免使用整数或字符串常量来表示状态或选项，以增强类型安全和代码可读性。
3. **限制枚举的复杂度**：虽然枚举可以包含方法和属性，但应尽量保持其简单性，避免过于复杂的逻辑。
4. **文档注释**：为枚举类型和每个枚举常量提供详细的文档注释，说明其用途和行为。

::: info 性能与限制
- **性能**：枚举类型的性能消耗主要体现在初始化阶段，因为枚举常量在类加载时就会被实例化。在运行时，枚举的性能与普通对象相似，且由于其不可变性，有时更利于JVM优化。内存占用上，每个枚举常量都会创建一个单独的对象，但对大多数应用来说，这点开销是可接受的。
- **限制**：
  - 枚举不能被继承，但可以实现接口。
  - 枚举的构造方法必须声明为private或默认（即包访问权限），且只能在枚举体内部调用。
  - 反射可以绕过枚举类型的某些限制，但应谨慎使用，以免破坏枚举的安全性和不变性。
:::


应用场景与代码示例

::: code-tabs#shell

@tab:active 权限控制
```java
public enum PermissionLevel {
    GUEST,
    MEMBER,
    MODERATOR,
    ADMIN
}

class User {
    private PermissionLevel permissionLevel;

    public void grantPermission(PermissionLevel level) {
        if (level.ordinal() > this.permissionLevel.ordinal()) {
            this.permissionLevel = level;
        } else {
            System.out.println("Permission cannot be downgraded.");
        }
    }
}
```

@tab 状态管理
```java
public enum OrderStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    CANCELLED;

    public boolean isFinal() {
        return this == COMPLETED || this == CANCELLED;
    }
}

class Order {
    private OrderStatus status;

    public void completeOrder() {
        if (status != OrderStatus.COMPLETED && status != OrderStatus.CANCELLED) {
            status = OrderStatus.COMPLETED;
        }
    }
}
```

@tab 日志级别
```java
public enum LogLevel {
    DEBUG, INFO, WARNING, ERROR;

    public static void log(LogLevel level, String message) {
        if (level.ordinal() >= Level.INFO.ordinal()) { // 假设至少打印INFO级别的日志
            System.out.println(level + ": " + message);
        }
    }
}

LogLevel.log(LogLevel.DEBUG, "Debugging info.");
LogLevel.log(LogLevel.ERROR, "An error occurred.");
```
:::




### 枚举与单例模式

在Java中，枚举与单例模式之间存在着紧密的联系。单例模式是一种设计模式，其核心在于确保一个类只有一个实例，并提供一个全局访问点。传统的单例实现方式包括懒汉式、饿汉式等，但这些实现都存在一定的问题，比如线程安全、序列化等问题。

枚举实现单例模式是一种既简洁又高效的方法，它利用了JVM对枚举的特殊处理，确保了实例的唯一性、线程安全性和序列化安全，从而成为实现单例模式的最佳实践之一。


下面是一个使用枚举实现单例模式的示例：

```java
public enum Singleton {
    INSTANCE;

    // 单例类可以有自己的业务方法
    public void doSomething() {
        System.out.println("Singleton instance is doing something.");
    }
}
```

在这个例子中，`Singleton`是一个枚举类型，它只有一个实例`INSTANCE`。由于枚举类型的实例在JVM中是唯一的，且在类加载时就会被初始化，因此`INSTANCE`保证了全局唯一性。访问这个单例非常简单，只需要通过`Singleton.INSTANCE`即可。


枚举实现单例模式的优点在于其简洁性和高度的线程安全性，以及自然地避免了反射和序列化带来的潜在问题。




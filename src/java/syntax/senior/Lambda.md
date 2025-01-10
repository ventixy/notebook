---

order: 30
title: Lambda表达式

---


## Lambda表达式

Lambda 表达式是 JDK8 的一个新特性，可以取代接口的匿名内部类，写出更优雅的Java 代码。

::: tip Lambda表达式的本质
如果说 [匿名内部类](../../syntax/base/Java面向对象.md#_4-匿名内部类) 实际上是局部内部类的更进一步，简化了局部内部类，那么Lambda就是匿名内部类更进一步，语法上更简洁了，代码更优雅了

==匿名内部类  和 Lambda表达式  的本质依然是 局部内部类== 

1. Lambda表达式仍然是局部内部类，是特殊的局部内部类，仍然定义在局部位置。而且局部内部类的注意事项，也一样存在。
2. Lambda表达式在取代匿名内部类时，不是全部都取代，而是取代接口的匿名内部类，而通过继承的匿名内部类Lambda表达式是不能取代的。
3. Lambda表达式是匿名内部类的更进一步，  ==Lambda表达式得到的不是一个类，而是一个对象，并且是接口的子类对象==  
:::

Lambda表达式在语法和直观理解上表现为函数，但在Java中，它实际上是一个对象，这个对象封装了函数的行为。这种设计允许Lambda表达式充分利用面向对象的特性，如继承、多态等，并能在面向对象的环境中无缝集成函数式编程的风格。


### 基础语法格式

Lambda表达式的两种基本形式为：
```java
(parameters) -> expression

(parameters) -> { statements; }
```
- **参数列表**：表示功能接口中必须要重写的抽象方法的形参列表。如果形参列表中的形参只有一个，那么`()`小括号也是可以省略的, 如果形参为空或是多个则不可省略。
- **箭头符号**：`->` 分隔参数列表和主体。`->`由一个`英文横杠 + 英文大于号`字符组成，它是Lambda表达式的运算符，读作`goes to` 
- **函数体**：只包含一个表达式时，可以省略大括号`{}`和`return`关键字；否则，需要用代码块包裹多条语句。

```java
// 只有一个表达式的代码示例
BinaryOperator<Integer> operator = (a, b) -> a + b;
int result = operator.apply(5, 3);

// 包含代码块的形式 (用Lambda表达式来简化 new Runnable() { ... } 这段代码)
Thread thread = new Thread(() -> {
    // task
});
thread.start();
```

注意：**Lambda表达式只能重写父接口中的抽象方法，不能自己新增成员！** 

<br/>




### 特殊/简化语法

Lambda表达式遵循一定的简化规则并提供了特殊语法，以便让代码更加简洁易读。

::: tip 简化规则和特殊语法
#### 简化规则
- 如果Lambda表达式的上下文可以明确参数类型，那么参数类型可以省略
- 如果形参列表中的形参只有一个，那么`()`小括号也是可以省略的
- 当Lambda体只包含一个表达式时，可以省略花括号`{}`和显式的`return`语句

#### 特殊语法
- **方法引用**：`ClassName::methodName` 或 `instance::methodName`，用于已有方法的引用。
- **构造器引用**：`ClassName::new`，创建对象的新实例。
- **数组引用**：`TypeName[]::new`，创建指定类型的数组。
::: 


简化规则的代码示例：
```java
// 不省略时
Function<String, Integer> f = (String s) -> {
    return s.length();
};

// 简化后：
Function<String, Integer> f = s -> s.length();
```

<br/>

方法引用、构造器引用和数组引用是Lambda表达式的特殊语法，它们允许以更简洁的方式引用现有的方法或构造函数，从而避免了显式地定义Lambda表达式体。

**方法引用（Method Reference）**

方法引用是Lambda表达式的一种特殊情况，当Lambda体的内容恰好是调用某个类或对象的现有方法时，可以直接通过双冒号`::`语法引用那个方法。Java编译器会自动将方法引用转换为对应的Lambda表达式。

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
long totalLength = names.stream().mapToInt(String::length).sum();
System.out.println(totalLength); // 输出: 19
```

Lambda表达式的目的就是代表一个函数，而方法引用直接指向了已经存在的函数实现，这使得代码更加直观且减少了重复


**构造器引用（Constructor Reference）**

构造器引用是创建对象的一种快捷方式，它通过`ClassName::new`语法形式，直接引用类的构造函数。这在需要工厂方法创建对象或作为函数式接口的实现时特别有用。

```java
class Person {
    private String name;
    
    public Person(String name) {
        this.name = name;
    }
    // 省略getter...
}

Function<String, Person> personFactory = Person::new;
Person alice = personFactory.apply("Alice");
System.out.println(alice.getName()); // 输出: Alice
```

构造器本质上是一个特殊的方法，用于初始化并创建类的新实例。构造器引用使得在需要函数式接口接收一个工厂方法时，可以直接引用类的构造器，从而简化代码。


**数组引用（Array Constructor Reference）**

数组引用通过`TypeName[]::new`的形式，提供了一种快速创建指定类型数组的方法引用。这在需要根据长度动态创建数组时非常有用，常见于流操作中。

```java
IntFunction<int[]> arrayCreator = int[]::new;
int[] array = arrayCreator.apply(5);  // 创建一个长度为5的整数数组
Arrays.setAll(array, i -> i * i);     // 初始化数组
System.out.println(Arrays.toString(array));  // 输出: [0, 1, 4, 9, 16]
```

数组在Java中是一种特殊类型的对象，其构造函数（即创建数组的过程）可以通过这种方式被直接引用。这种方式简化了在函数式编程中处理数组创建的复杂度。









### 自动类型推断

Java中的Lambda表达式类型推断是一个自动过程，允许编译器根据上下文信息推断出Lambda表达式的参数类型和返回类型，从而使得开发者不必显式声明这些类型。这一特性使得Lambda表达式更加简洁。

::: info Lambda表达式类型推断
1. **直接用父接口引用接收**：Lambda表达式可以赋值给任何符合其签名的函数式接口，这通常是一个抽象方法的接口（即父接口）。由于Lambda表达式实现的是这个接口的唯一抽象方法，因此直接用父接口引用接收是安全且常见的做法，不会导致信息丢失。

2. **借助方法完成类型推断**：
   - **借助方法的返回值类型完成类型推断**：当Lambda表达式作为方法的返回值时，编译器可以根据方法的返回类型推断Lambda的类型。例如，如果方法声明为`IA createLambda()`，那么方法体中的Lambda表达式会被推断为`IA`类型。
   
   - **借助方法的形参的数据类型完成类型推断**：当将Lambda表达式作为参数传递给一个方法时，编译器会根据该方法参数的类型来推断Lambda的类型。例如，如果有一个方法`void execute(IA action)`，那么传递给`execute`的Lambda表达式会被推断为实现`IA`接口的类型。
:::

**示例1：直接用父接口引用接收**

首先，我们看一个直接用父接口引用接收Lambda表达式的例子。这展示了如何将Lambda表达式赋值给一个函数式接口的引用，让编译器自动推断类型。

```java
import java.util.function.Consumer;

public class LambdaTypeInferenceDirect {

    public static void main(String[] args) {
        // printer变量被声明为Consumer<String>类型
        // 这是一个函数式接口，它有一个抽象方法void accept(T t)
        Consumer<String> printer = message -> System.out.println(message);

        // 使用这个引用调用accept方法
        printer.accept("Hello, Java!");
    }
}
```
**推断过程说明**：
- 编译器根据`Consumer<String>`的`accept`方法签名推断出Lambda的输入参数类型为`String`。因此，Lambda表达式中的`message`被推断为`String`类型
- 而整个Lambda表达式被视为实现了`Consumer<String>`接口的实例。

<br/>

**示例2：借助方法完成类型推断**：

接下来，通过一个方法来展示如何借助方法的参数或返回类型完成Lambda表达式的类型推断。

```java
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.function.Function;

public class LambdaTypeInferenceViaMethods {

    // 借助方法的形参类型推断
    public static void printTransformed(List<String> items, Function<String, Integer> transformer) {
        for (String item : items) {
            System.out.println(transformer.apply(item));
        }
    }

    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

        // Lambda表达式作为函数的参数，其类型由transformer参数推断
        printTransformed(names, name -> name.length());

        // 借助方法的返回值类型推断
        Function<String, Integer> lengthFunction = createLengthFunction();
        System.out.println(lengthFunction.apply("Hello")); // 输出: 5
    }

    // 返回一个Function实例，其类型由返回值推断
    public static Function<String, Integer> createLengthFunction() {
        return name -> name.length();
    }
}
```

**推断过程说明**：
- 在`printTransformed`方法中，`Function<String, Integer> transformer`参数需要一个接受`String`参数并返回`Integer`的结果的Lambda。因此，传递给它的Lambda`name -> name.length()`被推断为实现了`Function<String, Integer>`。
- 在`createLengthFunction`方法中，虽然没有直接在Lambda前指定类型，但因为方法签名声明返回`Function<String, Integer>`，编译器根据此信息推断出返回的Lambda表达式类型，即接受一个`String`并返回其长度的函数。


类型推断在Java Lambda表达式中的应用广泛，它使得开发者能够专注于业务逻辑，而不必为每个Lambda表达式显式指定类型，从而提高了代码的简洁性和可读性。特别是在大量使用函数式接口和流操作的场景下，类型推断尤为重要，它简化了代码，减少了潜在的类型错误，并促进了更流畅的函数式编程风格。



## 功能接口及其应用

功能接口（Functional Interface）是Java8引入的一个核心概念，它是一种具有特殊意义的接口，其设计目的是为了配合Lambda表达式的使用。

### 功能接口简介

**功能接口是指 ==有且仅有一个抽象方法的接口==**。这个单一的抽象方法定义了Lambda表达式需要实现的功能。

::: tip 功能接口的作用
功能接口充当了Lambda表达式和Java类型系统的桥梁。因为Lambda表达式本身不携带类型信息，功能接口为Lambda表达式提供了一种类型，使得Lambda可以被赋予一个明确的接口类型，进而可以被当作对象一样传递、赋值或作为参数使用。
:::

为了明确标识一个接口为功能接口，并且帮助 编译器 检测代码是否符合规范，Java提供了 
==`@FunctionalInterface`== 注解 (尽管这个注解不是必须的，但它是一个好的实践，能增加代码的可读性和自我文档化能力)


::: info 注意事项
- 功能接口中除了一个抽象方法外，还可以包含默认方法（default methods）和静态方法（static methods），因为它们要么提供了默认实现，要么是静态方法，与接口的实例无关。

- `Object`类中的方法（如`equals`、`hashCode`、`toString`）不应该直接在功能接口中声明，因为这样做会改变接口的语义，并且实际上没有必要，因为所有类都已经隐式实现了这些方法。
:::

总的来说，功能接口是Java语言为了更好地支持函数式编程风格，尤其是Lambda表达式的使用，而引入的关键概念。它使得开发者能够以更加简洁和直接的方式定义和使用行为或操作。功能接口的核心在于确保其仅有一个需要实现的抽象方法，这使得Lambda表达式可以明确地知道要实现哪个方法。




### Function

`Function<T, R>` 是Java函数式编程接口的一个核心部分，位于`java.util.function`包中。它代表一个接受一个类型为`T`的输入参数，并产生一个类型为`R`的结果的功能。这个接口定义了一个`apply()`方法，以及几个默认方法用于函数组合。

**源码剖析**：

```java
@FunctionalInterface
public interface Function<T, R> {

    R apply(T t);

    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }

    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }

    static <T> Function<T, T> identity() {
        return t -> t;
    }
}
```

1. **`apply(T t)`**: 这是Function接口的核心方法，它接受一个类型为T的对象作为参数，并返回一个类型为R的结果。这是所有具体实现该接口的类或lambda表达式必须重写的方法。

2. **`compose(Function<? super V, ? extends T> before)`**: 默认方法，用于将当前函数与另一个函数组合。这个方法接收一个函数作为参数，该函数将应用于原函数的输入之前。这意味着先执行`before`函数，然后将结果传递给当前的`Function`实例的`apply`方法。

3. **`andThen(Function<? super R, ? extends V> after)`**: 另一个默认方法，用于将当前函数与之后的一个函数组合。与`compose`相反，此方法先执行当前的`Function`实例的`apply`方法，然后将结果传递给`after`函数处理。

4. **`static <T> Function<T, T> identity()`**: 静态方法，提供一个恒等函数，即输入什么就输出什么，不进行任何变换。


使用代码示例

```java
import java.util.function.Function;

public class FunctionExample {
    public static void main(String[] args) {
        // 使用Function接口将字符串转换为大写
        Function<String, String> toUpperCase = String::toUpperCase;
        System.out.println(toUpperCase.apply("hello"));  // 输出: HELLO
        
        // 使用compose方法组合函数
        Function<Integer, Integer> square = x -> x * x;
        Function<Integer, Integer> addFive = x -> x + 5;
        Function<Integer, Integer> composed = addFive.compose(square);
        System.out.println(composed.apply(3));  // 先平方后加5，输出: 14
        
        // 使用andThen方法组合函数
        Function<Integer, Integer> addThree = x -> x + 3;
        Function<Integer, Integer> result = square.andThen(addThree);
        System.out.println(result.apply(3));  // 先平方后加3，输出: 12
        
        // 使用identity函数
        Function<String, String> identityFunc = Function.identity();
        System.out.println(identityFunc.apply("Java"));  // 输出: Java
    }
}
```

**使用场景和建议**：

- **数据转换**: 在处理集合数据时，如将一个列表中的每个元素转换为另一种形式，如字符串转大写、对象属性映射等。
- **链式操作**: 利用`compose`和`andThen`可以轻松地创建复杂的处理流程，提高代码的可读性和灵活性。
- **函数式编程**: 在需要函数作为参数或返回值的场景下，如在流(Stream)的操作中，`Function`接口及其衍生类型广泛应用于过滤、映射等操作。
  
对于其他类型的Function功能接口，有以下几种，它们都是针对特定类型进行了特化：

- **`IntFunction<R>`**: 接受一个int类型参数，产生一个任意类型的返回值。
- **`LongFunction<R>`**: 接受一个long类型参数，产生一个任意类型的返回值。
- **`DoubleFunction<R>`**: 接受一个double类型参数，产生一个任意类型的返回值。
- **`ToIntFunction<T>`**: 接受一个任意类型参数，产生一个int类型的返回值。
- **`ToLongFunction<T>`**: 接受一个任意类型参数，产生一个long类型的返回值。
- **`ToDoubleFunction<T>`**: 接受一个任意类型参数，产生一个double类型的返回值。




### Predicate

`Predicate<T>` 是Java函数式编程接口的另一核心部分，同样位于`java.util.function`包中。`Predicate`主要用于==条件判断==，代表一个接受类型为`T`的输入参数并返回一个布尔值（`true`或`false`）的逻辑判断功能。此接口主要用于过滤操作，如在Stream API中筛选出满足特定条件的元素。

**源码剖析**:

```java
@FunctionalInterface
public interface Predicate<T> {

    boolean test(T t);

    default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }

    default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }

    default Predicate<T> negate() {
        return (t) -> !test(t);
    }

    static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
                ? Objects::isNull
                : object -> targetRef.equals(object);
    }

    static <T> Predicate<T> not(Predicate<? super T> target) {
        Objects.requireNonNull(target);
        return (Predicate<T>)target.negate();
    }
}
```

1. **`test(T t)`**: `Predicate`接口的核心方法，接受一个类型为T的对象作为参数，并返回一个布尔值表示该对象是否满足某个条件。所有实现此接口的类或lambda表达式需重写此方法以定义具体的判断逻辑。

2. **`and(Predicate<? super T> other)`**: 用于将当前Predicate与另一个Predicate进行逻辑与操作，组合成一个新的Predicate。只有当两个Predicate都对同一个输入返回`true`时，组合后的Predicate才返回`true`。

3. **`or(Predicate<? super T> other)`**: 用于将当前Predicate与另一个Predicate进行逻辑或操作，组合成一个新的Predicate。只要两个Predicate中的任意一个对同一个输入返回`true`，组合后的Predicate就返回`true`。

4. **`negate()`**: 用于返回一个Predicate的否定版本，即对原始Predicate的判断结果取反。

5. **`isEqual(Object targetRef)`**: 测试输入对象是否与提供的目标引用targetRef相等

6. **`not(Predicate<? super T> target)`**: 返回一个逻辑与原Predicate相反的新的Predicate

::: info negate和not
`not` 和 `negate` 在功能上是相同的，都用于生成原有`Predicate`逻辑的否定形式。但是它们在使用场景和访问方式上有细微的区别：

1. **negate**: 这是一个实例方法，意味着它需要在已经存在的`Predicate`实例上调用。

   ```java
   Predicate<String> isEmpty = String::isEmpty;
   Predicate<String> isNotEmpty = isEmpty.negate(); // 创建isEmpty的否定形式
   ```

2. **not**: 这是一个静态工厂方法，允许你直接通过传入一个`Predicate`参数来获取其否定形式，而不需要先拥有该`Predicate`的实例。这种方式更偏向于静态调用，有时可以使代码更加简洁，尤其是当作为参数传递或者在一行内构造复杂逻辑时。

   ```java
   // 直接创建一个非空字符串的Predicate
   Predicate<String> isNotEmpty = Predicate.not(String::isEmpty); 
   ```
:::


代码使用示例：

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.function.Predicate;

public class PredicateExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

        // 使用Predicate过滤出长度大于4的名字
        Predicate<String> isLongName = name -> name.length() > 4;
        List<String> longNames = names.stream().filter(isLongName).collect(Collectors.toList());
        System.out.println(longNames);  // 输出: [Alice, Charlie, David]

        // 使用and方法组合Predicate
        Predicate<String> startsWithC = name -> name.startsWith("C");
        Predicate<String> longAndStartsWithC = isLongName.and(startsWithC);
        List<String> filteredNames = names.stream().filter(longAndStartsWithC).collect(Collectors.toList());
        System.out.println(filteredNames);  // 输出: [Charlie]

        // isEqual
        List<String> names = Arrays.asList("Alice", "Bob", null, "Charlie");
        Predicate<String> isAlice = Predicate.isEqual("Alice");
        List<String> filteredNames = names.stream().filter(isAlice).collect(Collectors.toList());
        System.out.println(filteredNames); // 输出: [Alice]

        // not
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        Predicate<Integer> isEven = n -> n % 2 == 0; // 判断是否为偶数
        Predicate<Integer> isOdd = Predicate.not(isEven); // 判断是否为奇数
        List<Integer> oddNumbers = numbers.stream().filter(isOdd).collect(Collectors.toList());
        System.out.println(oddNumbers); // 输出: [1, 3, 5]
    }
}
```

**使用场景和建议**:

- **数据过滤**: 在处理集合数据时，特别是配合Stream API，可以非常方便地根据复杂条件过滤出符合条件的元素。
- **条件逻辑组合**: 利用`and`、`or`、`negate`方法可以灵活地组合不同的条件逻辑，构建复杂的筛选规则，增强代码的表达力和可维护性。
- **函数式编程**: 在函数式编程风格的代码中，Predicate常作为参数传递给高阶函数，以实现高度解耦和灵活的逻辑控制。

通过Predicate接口，开发者可以编写更加声明式的代码，清晰表达意图而不必深入细节实现，这在处理大量数据过滤和条件检查的场景下尤为有用。


基本类型`Predicate`功能接口

- **`IntPredicate`**: 接受一个`int`类型参数，并返回一个布尔值。适用于整型数值的条件判断。
- **`LongPredicate`**: 接受一个`long`类型参数，并返回一个布尔值。适用于长整型数值的条件判断。
- **`DoublePredicate`**: 接受一个`double`类型参数，并返回一个布尔值。适用于浮点数的条件判断。



### Consumer

`Consumer<T>` 是Java函数式编程接口家族的一员，位于`java.util.function`包中。`Consumer`接收一个类型为`T`的输入参数并执行某些操作，但不返回任何结果（即返回类型为`void`）。这一接口设计用于代表副作用操作，非常适合用于数据处理管道的末端，比如打印日志、更新状态或执行任何无需返回值的操作。

**源码剖析**:

```java
@FunctionalInterface
public interface Consumer<T> {

    void accept(T t);

    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

1. **`accept(T t)`**: `Consumer`接口的核心方法，接受一个类型为T的对象作为参数，并执行相应的操作。实现此接口的类或lambda表达式需重写此方法以定义具体的行为。

2. **`andThen(Consumer<? super T> after)`**: 允许将当前`Consumer`与另一个`Consumer`进行连接，形成一个组合操作。当前`Consumer`执行完后，会接着执行`after`指定的`Consumer`。这在链式操作中非常有用，可以顺序执行多个操作而无需显式地在每次操作后保存结果。

::: info 使用场景和建议
- **数据处理管道**: 尤其是在Stream API中，`Consumer`经常用于流程的最后阶段，执行诸如打印、更新数据库、发送网络请求等操作，完成数据处理链的最后一环。
- **事件监听**: 可以作为事件处理器，接收事件对象并执行相应动作，无须返回任何结果。
- **资源清理**: 在需要执行资源释放、关闭文件等操作时，可以使用`Consumer`来封装清理逻辑。
- **链式调用**: 利用`andThen`方法，可以轻松地将多个操作串联起来，形成一个复杂处理流程，提高代码的连贯性和可读性。
:::

代码使用示例：

```java
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

public class ConsumerExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

        // 使用Consumer打印名字
        Consumer<String> printName = name -> System.out.println(name);
        names.forEach(printName); // 输出: Alice Bob Charlie

        // 使用andThen链接两个Consumer操作
        Consumer<String> greet = name -> System.out.print("Hello, ");
        Consumer<String> println = System.out::println;
        names.forEach(greet.andThen(println)); // 输出: Hello, Alice Hello, Bob Hello, Charlie
    }
}
```

通过`Consumer`接口，开发者能够编写更加集中于行为而非结果的代码，这对于需要执行一系列操作但不关心返回值的场景而言非常实用，进一步促进了代码的模块化和复用。


基本类型的Consumer接口：

- **`IntConsumer`**: 接受一个`int`类型参数，并执行某些操作，但不返回任何结果。
- **`LongConsumer`**: 接受一个`long`类型参数，并执行某些操作，同样不返回任何结果。
- **`DoubleConsumer`**: 接受一个`double`类型参数，并执行操作，没有返回值。




### Supplier

`Supplier<T>` 是Java函数式接口家族中的重要一员，位于`java.util.function`包中。`Supplier`的主要职责是==提供数据==。它代表一个不接受任何参数但能产生一个结果值的操作，这个结果值的类型由泛型`T`指定。`Supplier`在需要生产型函数的场景极为有用，比如初始化默认值、提供配置信息或生成随机数等。

**源码剖析**:

```java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```

- **`get()`**: `Supplier`接口的唯一方法，不接受任何参数，仅负责提供（供应）一个类型为`T`的结果。实现此接口意味着你需要定义这个无参方法的具体逻辑来生成所需的值。

**使用场景和特点**:

- **资源提供**: 在需要提供数据或资源的场景下，如初始化时提供默认值、配置加载、日志记录的初始化信息等。
- **延迟计算**: 结合诸如`Optional`或惰性初始化模式，`Supplier`可以用于实现延迟计算，直到结果真正被需要时才执行计算逻辑。
- **简化编码**: 作为Lambda表达式或方法引用传递给其他需要数据来源的函数，提高了代码的灵活性和可读性。
- **依赖注入**: 在一些依赖注入框架中，Supplier可以用来表示一个提供依赖实例的供应商，尤其是在需要延时初始化或有复杂逻辑决定依赖实例的情况下。

**代码示例**:

```java
import java.util.Random;
import java.util.function.Supplier;

public class SupplierExample {
    public static void main(String[] args) {
        // 使用Supplier生成随机数
        Supplier<Integer> randomSupplier = () -> new Random().nextInt(100);
        System.out.println("Random number: " + randomSupplier.get());

        // 提供默认值
        Supplier<String> greetingSupplier = () -> "Hello, World!";
        System.out.println(greetingSupplier.get());

        // 结合Optional使用
        Supplier<String> optionalMessage = () -> "This is a message";
        Optional<String> message = Optional.ofNullable(optionalMessage.get());
        System.out.println(message.orElse("No message available"));
    }
}
```



类似于基本类型的Function和Predicate，Java也提供了处理基本类型值的Supplier接口：

- **`IntSupplier`**: 生成`int`类型的值。
- **`LongSupplier`**: 生成`long`类型的值。
- **`DoubleSupplier`**: 生成`double`类型的值。

例如，生成一个随机的整数可以使用`IntSupplier`这样实现：

```java
IntSupplier randomIntSupplier = () -> new Random().nextInt();
System.out.println("Random int: " + randomIntSupplier.getAsInt());
```

总之，`Supplier`接口作为一个强大的提供者角色，极大地丰富了Java函数式编程的能力，特别是在需要无参生成数据的场景下，它使得代码更加灵活和高效。



### 双参数函数接口

**1. `BiFunction<T, U, R>`**

`BiFunction<T, U, R>`接口代表一个接受两个参数并产生结果的函数。这里的`T`、`U`分别代表两个输入参数的类型，而`R`表示返回的结果类型。

**方法摘要**:
- `R apply(T t, U u);`：应用此函数到给定的参数上。

**使用场景**：当需要对两个输入值进行某种运算或处理并得到一个输出值时，比如计算两个数的和、拼接两个字符串等。

```java
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
int result = add.apply(5, 3); // 结果为8
```

**2. `BiPredicate<T, U>`**

`BiPredicate<T, U>`接口代表一个接受两个参数的谓词（返回布尔值的函数）。它用于判断两个输入参数是否满足某个条件。

**方法摘要**:
- `boolean test(T t, U u);`：评估此谓词在给定的输入参数上是否为真。

**使用场景**：当需要根据两个输入值判断是否满足某些逻辑条件时，例如检查两个人是否同岁或判断一个范围是否包含另一个范围等。

```java
BiPredicate<Integer, Integer> isEqual = (x, y) -> x.equals(y);
boolean areEqual = isEqual.test(10, 10); // 结果为true
```


**3. `BiConsumer<T, U>`**

`BiConsumer<T, U>`接口用于接收两个不同类型（`T`和`U`）的参数，并执行某种操作，但不返回任何结果（即返回类型为`void`）。

**接口定义**：

```java
@FunctionalInterface
public interface BiConsumer<T, U> {
    void accept(T t, U u);
    
    default BiConsumer<T, U> andThen(BiConsumer<? super T, ? super U> after) {
        Objects.requireNonNull(after);
        return (l, r) -> { 
            accept(l, r); 
            after.accept(l, r); 
        };
    }
}
```

**核心方法**：

1. **`accept(T t, U u)`**: 这是`BiConsumer`接口的核心方法，接受两个参数`T t`和`U u`，并执行所需的操作，但不返回任何值。

2. **`andThen(BiConsumer<? super T, ? super U> after)`**: 此方法允许你将当前的`BiConsumer`操作与另一个`BiConsumer`操作链接起来，形成一个组合操作。当调用`accept`方法时，首先执行当前`BiConsumer`的操作，然后执行`after`指定的操作。这对于构建多个连续操作非常有用，增加了操作的灵活性。


```java
import java.util.ArrayList;
import java.util.List;
import java.util.function.BiConsumer;

public class BiConsumerExample {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        BiConsumer<String, Integer> addWithNameAndIndex = (name, index) -> {
            names.add(index, "Item " + name + " at index " + index);
        };

        // 添加元素并打印
        for (int i = 0; i < 5; i++) {
            addWithNameAndIndex.accept(String.valueOf(i), i);
        }
        System.out.println(names);

        // 使用andThen链接两个BiConsumer操作
        BiConsumer<String, Integer> printWithNameAndIndex = (name, index) -> 
            System.out.println("Printing: Item " + name + " at index " + index);
        BiConsumer<String, Integer> combinedOperation = addWithNameAndIndex.andThen(printWithNameAndIndex);

        // 执行组合操作
        combinedOperation.accept("Special", names.size());
    }
}
```

**4. 其他双参数接口**

除了上述两种，还有其他一些双参数接口：
- `ToDoubleBiFunction<T, U>`、`ToIntBiFunction<T, U>`、`ToLongBiFunction<T, U>`：这些接口类似于`BiFunction`，但是它们的`apply`方法返回的是基本类型的数值（double、int、long），用于性能敏感或者需要精确控制数值类型的场景。




### 操作型接口
操作型接口（Operator Interfaces）是Java函数式编程中的一类特殊接口，它们专为基本数据类型设计。这些接口位于`java.util.function`包中，主要分为两大类：一元操作接口（如`IntUnaryOperator`）和二元操作接口（如`IntBinaryOperator`）。它们专注于基本类型的操作，如`int`, `long`, 和`double`，从而在性能敏感的应用中特别有用。

**一元操作接口：IntUnaryOperator**

`IntUnaryOperator`是一个只接受一个`int`类型参数并产生一个`int`类型结果的函数接口。它通常用于对整型数据进行转换或计算。

**方法摘要**:
- `int applyAsInt(int operand);`：应用此操作到给定的操作数上。

**使用场景**：任何需要对整数执行简单或复杂计算的地方，如加一操作、求绝对值、平方计算等。

```java
IntUnaryOperator increment = x -> x + 1;
int result = increment.applyAsInt(10); // 结果为11
```

**二元操作接口：IntBinaryOperator**

`IntBinaryOperator`是一个接受两个`int`类型参数并产生一个`int`类型结果的函数接口。它用于实现对两个整数的操作，如相加、相乘等。

**方法摘要**:
- `int applyAsInt(int left, int right);`：应用此操作到给定的两个操作数上。

**使用场景**：当需要对两个整数执行某种运算时，如计算两个数的和、差、乘积或比较大小等。

```java
IntBinaryOperator add = (a, b) -> a + b;
int sum = add.applyAsInt(5, 3); // 结果为8
```

**其他基本类型操作接口**：
- **`LongUnaryOperator`**: 类似于`IntUnaryOperator`，但操作数和结果都是`long`类型。
- **`LongBinaryOperator`**: 类似于`IntBinaryOperator`，处理`long`类型数据。
- **`DoubleUnaryOperator`**: 对`double`类型数据执行一元操作。
- **`DoubleBinaryOperator`**: 对两个`double`类型数据执行二元操作。




### 自定义功能接口

在Java中，除了标准库提供的函数式接口如`Function`, `Predicate`, `Consumer`等，开发者还可以根据需求自定义功能接口。自定义功能接口允许你定义特定于应用场景的接口，增加代码的可读性和灵活性。

首先，定义一个自定义功能接口。假设我们要创建一个接口用于处理学生对象，并返回他们的成绩是否及格（以分数表示）。

```java
@FunctionalInterface
public interface StudentGrading {
    /**
     * 判断学生分数是否及格。
     *
     * @param score 学生的分数。
     * @return 如果分数及格则返回true，否则返回false。
     */
    boolean isPass(int score);
}
```

接下来，我们可以使用Lambda表达式或方法引用来实现这个接口。

```java
StudentGrading grading = score -> score >= 60; // 假设60分及格
```

如果有现成的方法符合接口定义，也可以直接使用方法引用。

```java
public class GradingUtils {
    public static boolean isScorePass(int score) {
        return score >= 60;
    }
}

// 在使用时
StudentGrading grading = GradingUtils::isScorePass;
```


在实际代码中应用这个自定义接口。例如，我们有一个学生分数列表，想要过滤出及格的学生分数。

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class CustomFunctionInterfaceExample {
    public static void main(String[] args) {
        List<Integer> scores = Arrays.asList(75, 45, 90, 55, 80);
        
        // 使用自定义接口过滤及格分数
        List<Integer> passingScores = scores.stream()
                                           .filter(grading)
                                           .collect(Collectors.toList());
        
        System.out.println("及格的分数: " + passingScores);
    }
}
```

通过自定义功能接口，可以将特定领域的逻辑抽象出来，使得代码更加模块化、易于理解和维护。





## Lambda应用实践

### 应用场景介绍

- **集合操作**：与Stream API结合，进行过滤、映射、排序等操作。
- **事件监听**：实现事件处理器。
- **并发编程**：作为Runnable、Callable等接口的实例传递给线程或线程池。
- **函数式接口**：任何仅有一个抽象方法的接口都可视为函数式接口，Lambda可直接用于实现这些接口。




### 自然排序示例

例：使用匿名内部类实现`Comparator`接口来对`Student`列表按年龄从小到大排序，并使用Lambda表达式简化比较逻辑。

```java
public class SortDemo {
    public static void main(String[] args) {
        List<Student> list = new ArrayList<>();
        list.add(new Student(1L, "张三疯", 68));
        list.add(new Student(2L, "张无忌", 18));
        list.add(new Student(3L, "张翠山", 38));

        for (Student student : list) {
            System.out.println(student);
        }


        // 在java8以前(没有Lambda表达式)对于对象排序，需要实现匿名内部类来做比较
        System.out.println("——————————————按年龄由小到大排序——————————————");
        Collections.sort(list, new Comparator<Student>() {
            @Override
            public int compare(Student o1, Student o2) {
                return o1.getAge().compareTo(o2.getAge());
            }
        });
        for (Student student : list) {
            System.out.println(student);
        }

        // 使用Lambda表达式实现排序
        System.out.println("——————————————按年龄由大到小排序——————————————");
        Collections.sort(list, (o1, o2) -> o2.getAge().compareTo(o1.getAge()));
        for (Student student : list) {
            System.out.println(student);
        }
    }
}
```

![](https://image.ventix.top/java/image-20220212154115918.png)


上述代码展示了从传统的匿名内部类实现`Comparator`到使用Lambda表达式的过渡。不过，自从Java 8引入了Stream API，我们可以采用更简洁的方式来实现排序。下面是改进后的代码示例：

```java
// 使用Lambda表达式和Stream API按年龄由小到大排序
System.out.println("——————————————按年龄由小到大排序——————————————");
List<Student> sortedListAsc = list.stream()
                                    .sorted(Comparator.comparing(Student::getAge))
                                    .collect(Collectors.toList());
sortedListAsc.forEach(System.out::println);

// 使用Lambda表达式和Stream API按年龄由大到小排序
System.out.println("——————————————按年龄由大到小排序——————————————");
List<Student> sortedListDesc = list.stream()
                                    .sorted(Comparator.comparing(Student::getAge).reversed())
                                    .collect(Collectors.toList());
sortedListDesc.forEach(System.out::println);
```

- **简洁性**: 通过Stream API的`sorted`方法，直接利用方法引用`Student::getAge`来指明排序依据，代码更加简洁易读。
- **无副作用**: 新建了`sortedListAsc`和`sortedListDesc`来存储排序结果，避免了对原集合的修改，使代码逻辑更清晰。
- **灵活性**: Stream API提供了丰富的操作，比如通过`.reversed()`轻松实现逆序排序，增强了代码的灵活性。

这种方法不仅减少了代码量，而且通过分离排序操作和原集合，提高了代码的可维护性和可读性。

---

order: 40
title: Stream API

---



Java Stream API 是Java 8引入的一个重要特性，它提供了一种高效且易于使用的数据处理方式。Stream API 允许以声明性的方式处理集合数据，可以进行过滤、映射、排序等操作，而无需显式地编写循环。



## 基础概念及使用

### 什么是Stream

Stream是**对集合对象进行操作**的高级抽象，代表了==数据的流动管道(Pipelining)==。

在传统的集合操作中，我们通常需要显式地迭代（例如使用for-each循环）来遍历和处理数据。Stream API引入了==内部迭代==的概念，即遍历逻辑封装在Stream内部。当我们调用诸如 `forEach`或`reduce`这样的终端操作时，Stream负责管理并执行实际的遍历过程，无需我们直接操控迭代器或编写循环结构。

::: info Stream与集合的区别
- **数据存储**: 集合（如List、Set、Map等）是用于存储和检索数据的数据结构，它们直接持有数据项。而Stream不直接存储数据，它更像是一个查询或计算的描述，用于对数据源进行操作。
- **操作性质**: 集合的操作大多直接作用于数据本身，修改或返回新的集合。Stream则是关于数据的计算流程描述，直到执行终端操作时才真正进行计算。
- **延迟执行**: Stream的操作是懒惰的，即中间操作不会立即执行，只有当遇到终端操作时，整个流程才会被触发执行。这使得Stream能够高效地构建和优化计算流程。
:::

Stream本身并不直接存储数据，而是一个计算模型，它负责将源数据转换为一系列计算步骤，这些步骤可以在需要时按需执行。


### 创建Stream

Stream可以来源于集合、数组，甚至是I/O通道等数据源。

Java提供了多种方式来创建Stream实例：

- **从集合创建**: 所有实现了`Collection`接口的类都有`stream()`和`parallelStream()`默认方法，用于获取该集合的Stream。
    ```java
    List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
    Stream<String> nameStream = names.stream();
    nameStream.forEach(System.out::println);
    ```

- **从数组创建**: 使用`Arrays.stream(T[] array)`方法。
    ```java
    String[] arr = {"Apple", "Banana", "Cherry"};
    Stream<String> arrayStream = Arrays.stream(arr);
    arrayStream.forEach(System.out::println);
    ```

- **静态工厂方法**: 如`IntStream.of(int... values)`, 或者通过文件、网络等I/O资源创建。
    ```java
    // Stream.of()可以接受任意数量的参数，将它们包装成一个Stream
    Stream<String> stream = Stream.of("A", "B", "C");

    // 在处理字符串时，可以使用正则表达式创建一个分隔后的Stream
    Stream<String> words = Pattern.compile("\\s+").splitAsStream("Hello World");
    ```

- **生成Stream**: 使用如`IntStream.iterate(start, operator)`、`Stream.generate(supplier)`等方法生成无限或有限序列。
    ```java
    // 创建一个包含1到5的整数流
    IntStream intStream = IntStream.range(1, 6);
    intStream.forEach(System.out::println);

    // 创建一个无限的随机数流
    Stream<Double> randomStream = Stream.generate(Math::random);
    randomStream.limit(5).forEach(System.out::println); // 限制输出前5个随机数

    // 生成一个无限递增的整数流，从0开始
    Stream<Integer> infiniteStream = Stream.iterate(0, n -> n + 1);
    infiniteStream.limit(5).forEach(System.out::println); // 输出前5个数字
    ```
    生成特定类型的Stream（如IntStream, LongStream, DoubleStream）与使用常规的Stream的区别在于，特定类型流专门处理基本类型的值（int, long, double），这样可以避免装箱和拆箱操作，提高性能。




### 中间/终端操作

Stream通过链式调用各种中间操作（例如过滤、映射）和最终的终端操作（例如收集结果），可以高效地对数据进行处理。

- **中间操作(Intermediate Operations)**：这类操作会返回一个新的Stream，允许进一步的操作链式调用。中间操作是延迟执行的，它们不会直接执行任何处理，直到遇到一个终端操作时才会开始处理数据。常见的有`map()`, `filter()`, `sorted()`等。中间操作分为无状态（操作独立于之前的操作结果）和有状态（操作依赖于之前的所有元素，如`distinct()`）。
  
- **终端操作(Terminal Operations)**：这类操作会消费Stream并产生一个结果或副作用，执行后Stream管道关闭，不可再被操作。终端操作会触发实际的计算，如`forEach()`, `collect()`, `reduce()`, `toArray()`等。终端操作执行后，任何后续的中间操作都不会生效，因为Stream已经关闭。

::: tip
- 调用多个中间操作并不会导致数据被多次遍历，即使你在同一个Stream上连续调用了多个中间操作，数据也只会被遍历一次。

- Stream的设计原则之一就是优化处理流程，确保效率。中间操作本质上是构建一个操作链，它们不会立即执行计算，而是将操作累积起来形成一个操作计划。这些操作只有在遇到一个终端操作时才会被实际执行，并且是在尽可能优化的情况下执行一次遍历。
:::


## 常用中间操作
- **映射（Map）**：转换Stream中的每个元素，如`map()`和`flatMap()`。
- **过滤（Filter）**：基于条件移除Stream中的某些元素，如`filter()`。
- **排序（Sort）**：对Stream中的元素进行排序，如`sorted()`。
- **去重（Distinct）**：去除重复元素，如通过`distinct()`实现。
- **限制（Limit）**：限制Stream中处理的元素数量，如`limit(n)`。
- **跳过（Skip）**：跳过Stream开始的若干元素，如`skip(n)`。

其他中间操作：
- peek(): 允许对流中的每个元素执行操作，并且将元素传递到流的下一流程中，常用于 debugging 或者 side-effect 操作，例如打印日志等。这个操作不会改变流的元素。
    ```java
    List<String> above90Names = students.stream().filter(t->t.getScore()>90)
        .peek(System.out::println)
        .map(Student::getName)
        .collect(Collectors.toList());
    ```

- mapToXxx: 为避免装箱/拆箱，提高性能，Stream还有如下返回 **基本类型特定流** 的方法：
    ```java
    DoubleStream mapToDouble(ToDoubleFunction<? super T> mapper)
    IntStream mapToInt(ToIntFunction<? super T> mapper)
    LongStream mapToLong(ToLongFunction<? super T> mapper)
    ```
    DoubleStream/IntStream/LongStream是基本类型特定的流，有一些专门的更为高效的方法。比如，求学生列表的分数总和：
    ```java
    double sum = students.stream().mapToDouble(Student::getScore).sum();
    ```


### 映射(Map)

映射操作允许你对流中的每个元素应用一个函数，从而转换每个元素到另一个形式或类型。映射操作主要有两种：`map()`和`flatMap()`。


**`map()`**

`map()`接收一个函数作为参数，该函数会被应用到Stream的每个元素上，并产生一个新的Stream，其中包含应用该函数后得到的结果。这适用于一对一的转换。其常见应用场景如下：
- 数据类型转换：如将字符串列表转换为整数列表。
- 属性提取：从对象列表中提取特定属性，如从Person对象列表中提取所有人的名字。
- 简单计算：对数值型数据进行加减乘除等操作。

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
List<Integer> lengths = names.stream()
                            .map(String::length)
                            .collect(Collectors.toList());
System.out.println(lengths); // 输出 [5, 3, 7]
```
注意事项：
- `map`不改变原Stream的元素数量，只是改变了元素的内容。
- 如果映射函数可能抛出异常，确保异常处理得当，避免中断Stream的处理流程。

<br/>

**`flatMap()`**

`flatMap()`也是用于转换Stream中的每个元素，但它与`map()`的主要区别在于它可以将每个元素转换为另一个Stream，然后再将这些Stream扁平化为一个单一的Stream。这非常适合处理一对多的映射关系。其常见应用场景如下：
- 复杂对象解构：将包含嵌套集合的对象流展平。
- 字符串分割：将字符串流转换为单词流。
- 结合多个列表：将多个列表中的元素合并到一个列表中。

```java
List<List<Integer>> nestedLists = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4),
    Arrays.asList(5)
);
List<Integer> flatList = nestedLists.stream()
                                    .flatMap(List::stream)
                                    .collect(Collectors.toList());
System.out.println(flatList); // 输出 [1, 2, 3, 4, 5]
```
**注意事项**：
- `flatMap`可能导致新Stream的元素数量与原Stream不同，因为它可以将一个元素映射到零个、一个或多个新元素。
- 使用时要确保理解其扁平化的特性，避免因误解而导致的错误结果。



### 过滤(Filter)

过滤操作允许你从流中排除不符合条件的元素，只保留那些满足特定条件的元素。这个操作非常适合数据的筛选和预处理阶段。

`filter()`方法接收一个谓词（即一个返回boolean值的函数）作为参数，该函数定义了元素需要满足的条件。它会==产生一个新的Stream，其中只包含使谓词返回`true`的元素==。过滤操作的应用场景广泛，包括但不限于：
- 条件筛选：从列表中选出满足特定条件的元素，如选取成绩大于某一分数的学生记录。
- 数据清洗：移除不符合规范或不需要处理的数据项。
- 预处理：在进行进一步操作前，先剔除不符合要求的输入。

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
List<Integer> evenNumbers = numbers.stream()
                                   .filter(n -> n % 2 == 0)
                                   .collect(Collectors.toList());
System.out.println(evenNumbers); // 输出 [2, 4, 6]
```

注意事项：
- `filter`操作不会改变原Stream的元素内容，仅改变元素的集合。
- 为了保持流操作的高效，传入的谓词函数应该是高效的，避免在该函数中进行复杂或耗时的操作。
- 正确使用谓词逻辑，避免逻辑错误导致预期之外的元素被过滤。

通过过滤操作，可以精确控制数据处理流程中哪些数据应该被保留下来，进而进行后续的处理或分析，这对于提高数据处理的针对性和效率非常关键。



### 排序(Sort)

排序操作允许你对流中的元素进行排序，支持自然排序和自定义比较器排序，是处理有序数据的重要手段。排序操作会产生一个新的Stream，其中的元素按照指定规则排序。

::: tip `sorted()`方法的两种使用形式
- 无参形式默认使用元素的自然排序（需实现`Comparable`接口）

- 有参形式接受一个`Comparator`比较器来自定义排序规则。
:::

排序操作的应用场景广泛多样：
- 数据预处理：在进行数据分析或展示前，对数据进行排序。
- 自定义排序需求：根据业务逻辑对集合进行非自然排序。
- 排序算法替代：简化代码，避免手动实现复杂的排序算法。

```java
// 自然排序
List<Integer> numbers = Arrays.asList(3, 1, 4, 1, 5, 9, 2, 6);
List<Integer> sortedNumbers = numbers.stream()
                                    .sorted()
                                    .collect(Collectors.toList());
System.out.println(sortedNumbers); // 输出 [1, 1, 2, 3, 4, 5, 6, 9]

// 自定义排序（降序）
sortedNumbers = numbers.stream()
                       .sorted(Comparator.reverseOrder())
                       .collect(Collectors.toList());
System.out.println(sortedNumbers); // 输出 [9, 6, 5, 4, 3, 2, 1, 1]

// 例：过滤得到90分以上的学生，然后按分数从高到低排序，分数一样的按名称排序：
List<Student> list = students.stream().filter( t -> t.getScore() > 90 )
    .sorted(Comparator.comparing(Student::getScore)
            .reversed()
            .thenComparing(Student::getName))
    .collect(Collectors.toList());
```

注意事项：
- `sorted()`会改变元素的顺序，对原Stream的元素进行重新排列。
- 对于无参`sorted()`，确保流中的元素实现了`Comparable`接口，否则会抛出`ClassCastException`异常。
- 使用自定义`Comparator`时，要确保比较逻辑的正确性和稳定性，避免无限循环或不一致的比较结果。
- 排序操作对于大数据集可能会消耗较多的计算资源，注意性能影响。




### 去重(Distinct)

去重操作允许你在流处理过程中移除重复的元素，确保结果中每个元素只出现一次。适用于需要基于元素自身特性的唯一性校验场景。

::: tip
`distinct()`是一个==有状态==的操作，它需要记住已经遇到过的元素以判断后续元素是否重复。

为了高效地检查元素是否重复，`distinct()`的内部实现通常会使用`HashSet`这样的数据结构来存储已经遍历过的唯一元素。这是因为`HashSet`提供了快速的插入和查询时间复杂度（接近O(1)），非常适合用来检测重复。对于有序流（即需要维持元素原有顺序的流），为了既去重又保持顺序，Java的实现可能会选择使用`LinkedHashSet`, `LinkedHashSet`不仅提供了元素的唯一性保证，还保持了元素的插入顺序，这样在去除重复的同时，也能确保输出流中的元素顺序与输入流中元素首次出现的顺序一致。
:::

**应用场景**：
- 数据清洗：在处理数据集时，去除不必要的重复记录。
- 集合操作：确保集合内容的唯一性，如统计网站访问的唯一用户数。
- 前处理：在进行进一步聚合或分析之前，去除重复项以简化后续操作。


```java
List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 4, 4, 4, 5);
List<Integer> uniqueNumbers = numbers.stream()
                                     .distinct()
                                     .collect(Collectors.toList());
System.out.println(uniqueNumbers); // 输出 [1, 2, 3, 4, 5]
```

**注意事项**：
- `distinct()`依赖于元素的`equals()`和`hashCode()`方法来判断元素是否相同。确保你要去重的元素类型已正确覆写这两个方法，以符合你的去重逻辑。
- 此操作不会改变原Stream的元素顺序，输出的流中元素顺序与原流中首次出现该元素的顺序一致。
- 如果数据源很大或者去重操作成本较高（如复杂对象的比较），`distinct()`操作可能会有性能影响，需注意效率问题。



### 限制(Limit）

限制操作允许从Stream中获取指定数量的元素，常用于获取前N个元素或者截断过长的Stream至一个合理的大小。此操作主要通过`limit()`方法实现。

`limit()`方法接收一个整数参数，定义了最多想要从Stream中获取的元素数量。达到这个数量后，Stream的剩余部分会被忽略。这对于大数据集预览、分页处理或资源限制场景非常有用。

**应用场景**：
- 数据预览：查看数据集的前几个元素以了解数据概况。
- 分页：实现数据分页功能，获取特定页面的数据项。
- 性能优化：处理大量数据时，限制处理的数据量以减少资源消耗。


```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
List<Integer> firstThree = numbers.stream()
                                  .limit(3)
                                  .collect(Collectors.toList());
System.out.println(firstThree); // 输出 [1, 2, 3]
```

**注意事项**：
- `limit()`不会改变原Stream的元素内容，仅限制处理和返回的元素数量。
- 使用`limit()`时，如果限制的数量超过了Stream的实际大小，则只会返回实际存在的元素，不会抛出异常。
- 结合`skip()`方法可实现分页效果，例如先跳过N个元素，然后限制接下来的M个元素。
- 应注意`limit()`的位置，放置在Stream链的早期可以更早地终止操作，提高效率。


### 跳过(Skip)

跳过操作允许你忽略Stream开始的若干个元素，仅处理剩余的元素。这一操作由`skip()`方法实现，是处理大量数据时进行分页、忽略已处理或不关心的数据段的有效手段。

`skip()`方法接受一个整数参数n，表示==要跳过的元素数量==。之后的元素会被保留在Stream中进行后续操作。如果Stream中的元素少于n，则返回的Stream为空。

**应用场景**：
- 数据分页：实现数据分页功能时，跳过前几页的数据直接处理指定页的数据。
- 忽略头部数据：在日志处理、数据分析中，可能需要忽略一些已知的不关心的头部记录。
- 测试与调试：快速跳过已知部分数据，专注于测试或调试数据集的后部内容。

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
List<Integer> skipped = numbers.stream()
                               .skip(5)  // 跳过前5个元素
                               .collect(Collectors.toList());
System.out.println(skipped); // 输出 [6, 7, 8, 9, 10]
```

**注意事项**：
- 使用`skip()`前应确保对Stream的大小有足够了解，避免因跳过过多元素导致Stream变空。
- `skip()`与`limit()`常结合使用来实现分页逻辑，先跳过前N个元素，再限制接下来的M个元素。
- `skip()`操作是基于迭代进行的，因此在处理无限Stream时应谨慎使用，以免程序陷入无限循环。
- 在并行处理时，由于并行执行的具体策略，跳过元素的位置可能与顺序执行时有所不同，但整体结果不变。


**基于`skip()`和`limit()`方法实现分页**:
```java
public class PaginationExample {
    public static void main(String[] args) {
        List<Integer> records = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

        int pageNumber = 2; // 想要获取第2页的数据
        int pageSize = 5; // 每页显示5条记录

        // 计算跳过多少条记录
        int startIndex = (pageNumber - 1) * pageSize;

        // 使用skip()跳过前面的记录，然后用limit()限制获取的记录数
        List<Integer> pageData = records.stream()
                .skip(startIndex)
                .limit(pageSize)
                .collect(Collectors.toList());

        System.out.println("Page " + pageNumber + " data: " + pageData);
        // Page 2 data: [6, 7, 8, 9, 10]
    }
}
```




## 常用终端操作
- **消费（ForEach）**：对Stream中的每个元素执行操作，如`forEach(Consumer)`。
- **收集（Collect）**：将Stream转换为集合或其他形式，如`collect(Collectors.toList())`、`collect(Collectors.groupingBy(...))`等。
- **归约（Reduce）**：将Stream中的元素通过某个操作合并成一个值，如`reduce(identity, accumulator)`。
- **匹配（Match）**：检查Stream中的元素是否满足指定条件，如`anyMatch(Predicate)`、`allMatch(Predicate)`、`noneMatch(Predicate)`。
- **查找（Find）**：查找Stream中的特定元素，如`findFirst()`、`findAny()`。
- **统计（Count）**：计算Stream中元素的数量，如`count()`。


其他操作：

- max/min：用于找出流中最大或最小的元素。这两个方法都属于Optional类的静态方法，实际操作时需要传递一个Comparator（比较器）来定义元素之间的比较逻辑，或者对于实现了Comparable接口的元素，可以直接使用自然排序。
    ```java
    Optional<Integer> max = numbers.stream().max(Integer::compareTo);
    ```

- toArray：用于将流转换为数组。它有两种形式：不带参数的`toArray()`会返回一个`Object[]`类型的数组；带参数的版本`toArray(IntFunction<A[]> generator)`允许你指定数组的具体类型，以避免类型转换的麻烦
    ```java
    // 转换为Object[]数组
    Object[] objects = words.stream().toArray();

    // 转换为特定类型数组
    String[] strings = words.stream().toArray(String[]::new);
    ```



### 消费(ForEach)

`forEach`用于对流中的每个元素执行某种操作，且不需要返回任何结果。常用于下列情形：
- **日志记录**：遍历并记录集合中的每个元素。
- **打印输出**：直接将集合内容打印到控制台或文件。
- **更新外部状态**：如修改集合外部的变量值、更新数据库等，但需注意并发问题。
- **简单处理**：执行无需返回值的简单操作，如设置默认值、触发事件等。


以下是一个使用`forEach`打印出列表中所有偶数的示例：

```java
public class ForEachExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

        // 使用forEach打印出所有偶数
        System.out.println("Even numbers:");
        numbers.stream()
               .filter(n -> n % 2 == 0)
               .forEach(System.out::println); 
        
        // 尝试并行执行以提高性能（需考虑线程安全）
        System.out.println("\nEven numbers (parallel):");
        numbers.parallelStream()
               .filter(n -> n % 2 == 0)
               .forEachOrdered(System.out::println); 
               // forEachOrdered在并行流中尝试保持顺序打印
    }
}
```

注意事项:
1. **并行执行**: `forEach`支持并行执行（通过`parallelStream()`获得并行流），但在多线程环境下需注意线程安全问题，避免非线程安全的操作导致数据不一致。
2. **无返回值**：`forEach`操作不产生新值或新流，主要用于副作用操作。
3. **外部迭代**：使用`forEach`实际上是一种外部迭代模式，与Stream的内部迭代相比，在某些情况下可能效率较低或不易控制。
4. **中断控制**：在`forEach`执行过程中，很难中断操作序列，对于需要及时响应中断的场景不太友好。


::: tip 
在并行流中，forEach不保证处理的顺序，而forEachOrdered会保证按照流中元素的出现顺序进行处理。
:::



### 收集(Collect)

收集操作是一个强大的终端操作，它允许你将流中的元素累积到一个可变容器中，如List、Set、Map等，或者通过聚合操作生成一个单一的结果，如求和、平均值等。主要通过`collect()`方法配合Collectors工具类实现。

```java
<R, A> R collect(Collector<? super T, A, R> collector)
```
collect方法接受一个收集器collector接口作为参数，类型是Collector

**基本用途**：
- **数据汇总**：将流中的元素收集到集合中，如List、Set。
- **统计信息**：计算总和、平均值、最大值、最小值等。
- **分组**：根据条件将元素分组到Map中。
- **分区**：根据条件将元素分为两类，并收集到Map中。
- **字符串连接**：将流中的元素连接成一个字符串。

```java
public class CollectExample {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("apple", "banana", "cherry", "date", "elderberry");

        // 收集成List
        List<String> collectedToList = words.stream().collect(Collectors.toList());
        System.out.println("Collected to List: " + collectedToList);

        // 收集成Set去重
        Set<String> collectedToSet = words.stream().collect(Collectors.toSet());
        System.out.println("Collected to Set: " + collectedToSet);

        // 计算元素长度的总和
        int totalLength = words.stream().collect(Collectors.summingInt(String::length));
        System.out.println("Total length of all words: " + totalLength);

        // 分组
        Map<Character, List<String>> groupedByFirstLetter = words.stream()
                                                              .collect(Collectors.groupingBy(word -> word.charAt(0)));
        System.out.println("Grouped by first letter: " + groupedByFirstLetter);
    }
}
```

**注意事项**：
- **性能考量**：特别是对于大集合，选择合适的收集器很重要，避免不必要的内存消耗。
- **并行流**：使用并行流收集时，确保收集操作是线程安全的，或者使用对应的并发收集器。
- **自定义收集器**：对于复杂的收集需求，可以使用Collector接口自定义收集逻辑。
- **理解收集器行为**：不同的收集器有不同的效果和限制，正确选择以满足具体需求。例如，`toList()`与`toUnmodifiableList()`在可变性上的差异。



### 归约(Reduce)

归约操作允许你将流中的元素通过某个操作累积成一个单一的结果。这个过程通常涉及一个初始值以及一个BinaryOperator（二元操作符），它将两个元素结合生成一个新的结果。`reduce()`方法是执行归约操作的核心方法，适用于诸如求和、求积、查找最大值/最小值等场景。

::: info 基本概念
- **累积函数（BinaryOperator）**：一个接受两个同类型参数并返回同一类型结果的函数。

- **身份值（Identity）**：归约操作的起始值，对于某些操作如求和，0是自然的身份值。
:::

**应用场景**：
- **数值运算**：如计算流中所有元素的总和、乘积、最大值、最小值等。
- **聚合计算**：如统计投票结果、分析数据集中的特定指标等。
- **字符串拼接**：将流中的字符串元素合并成一个字符串。


```java
public class ReduceExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 求和
        Integer sum = numbers.stream().reduce(0, Integer::sum);
        System.out.println("Sum: " + sum); // 输出 Sum: 15

        // 求积
        Integer product = numbers.stream().reduce(1, (a, b) -> a * b);
        System.out.println("Product: " + product); // 输出 Product: 120

        // 查找最大值
        Optional<Integer> max = numbers.stream().reduce(Integer::max);
        max.ifPresent(value -> System.out.println("Max: " + value)); // Max: 5

        // 字符串拼接
        String concatenated = numbers.stream()
                                     .map(Object::toString)
                                     .reduce("", String::concat);
        System.out.println("Concatenated: " + concatenated); 
        // Concatenated: 12345
    }
}
```

**注意事项**：
- **并行处理**：在并行流中使用`reduce()`时，确保操作是关联且可交换的，以保证结果的正确性。
- **无身份值归约**：如果流为空且没有提供身份值，`reduce()`会返回Optional.empty()。
- **性能考量**：对于大数据量的归约操作，考虑是否适合使用并行流以及选择高效的操作策略。
- **复杂操作**：对于复杂的归约逻辑，直接使用`reduce()`可能使代码难以理解，此时可以考虑先用其他操作简化问题。



### 匹配(Match)

匹配操作用于检查流中的元素是否满足某项条件或者达到某种状态，主要包括`allMatch()`、`anyMatch()`和`noneMatch()`三个方法。这些方法适用于快速检查流中元素的条件匹配情况，无需遍历整个流即可得出结论。

- **`allMatch(Predicate)`**：检查是否流中的所有元素都满足提供的谓词条件，返回布尔值。
- **`anyMatch(Predicate)`**：检查是否流中至少有一个元素满足提供的谓词条件，返回布尔值。
- **`noneMatch(Predicate)`**：检查是否流中没有任何元素满足提供的谓词条件，返回布尔值。

**应用场景**:
- **数据验证**：确认集合中的所有元素是否都符合预期的规则。
- **条件检查**：快速判断集合中是否存在符合特定条件的元素。
- **过滤前的预检查**：在执行更耗时的操作前，先检查是否有必要。


```java
public class MatchExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        // 检查是否所有元素都小于10
        boolean allBelowTen = numbers.stream().allMatch(n -> n < 10);
        System.out.println("All elements below 10? " + allBelowTen); 
        // 输出: All elements below 10? true

        // 检查是否存在偶数
        boolean anyEven = numbers.stream().anyMatch(n -> n % 2 == 0);
        System.out.println("Any even number? " + anyEven); 
        // 输出: Any even number? true

        // 检查是否没有负数
        boolean noneNegative = numbers.stream().noneMatch(n -> n < 0);
        System.out.println("No negative numbers? " + noneNegative); 
        // 输出: No negative numbers? true
    }
}
```

**注意事项**:
- **短路行为**：这些方法在找到满足条件的元素后会立即停止处理剩余元素（对于`allMatch()`是在遇到不满足条件的元素时），这在处理大量数据时可以提高效率。
- **谓词定义**：确保提供的谓词函数逻辑准确无误，以免影响匹配结果的准确性。
- **空流处理**：对于空流，`allMatch()`总是返回true（因为没有元素违反条件），`anyMatch()`返回false（没有元素满足条件），而`noneMatch()`也返回true（没有元素满足条件）。




### 查找(Find)

查找操作旨在从流中找出一个或多个元素，满足特定条件或位于特定位置。主要方法包括`findFirst()`、`findAny()`以及`limit()`与`skip()`的组合使用来查找特定范围的元素。

- **`findFirst()`**：返回流中第一个元素的Optional，如果流为空则返回Optional.empty()。此操作在并行流中保证有序性。
- **`findAny()`**：返回流中的任意一个元素的Optional，如果流为空则返回Optional.empty()。在并行流中可能比`findFirst()`更高效，因为它不必维持顺序。

**应用场景**:
- **检索特定元素**：如从集合中找到第一个偶数。
- **是否存在判断**：配合`isPresent()`方法检查是否有满足条件的元素存在。
- **分页或区间处理**：结合`limit()`和`skip()`实现数据分页展示。


```java
public class FindExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

        // 查找第一个偶数
        Optional<Integer> firstEven = numbers.stream()
                                             .filter(n -> n % 2 == 0)
                                             .findFirst();
        firstEven.ifPresent(even -> System.out.println("First even number: " + even)); 
        // 输出 First even number: 2

        // 在并行流中查找任意一个偶数
        Optional<Integer> anyEven = numbers.parallelStream()
                                           .filter(n -> n % 2 == 0)
                                           .findAny();
        anyEven.ifPresent(even -> System.out.println("Any even number: " + even));

        // 分页处理，获取第2页（每页2个元素）的第一个元素
        List<Integer> secondPageFirstElement = numbers.stream()
                                                     .skip(2) // 跳过前2个元素
                                                     .limit(2) // 取接下来的2个元素
                                                     .findFirst()
                                                     .orElse(null);
        System.out.println("Second page, first element: " + secondPageFirstElement); 
        // 输出 Second page, first element: 3
    }
}
```

**注意事项**:
- **并行流与顺序**：`findFirst()`在并行流中为了保证顺序可能会牺牲一些性能，而`findAny()`更适合追求效率的场景。
- **空流处理**：如果流为空，`findFirst()`和`findAny()`都会返回Optional.empty()，因此在使用结果前应使用`isPresent()`检查。
- **资源管理**：当查找结果用于打开文件、数据库连接等操作时，务必通过Optional的API安全地处理可能的空值情况，避免潜在的资源泄露。



### 统计(Count)

统计操作主要是通过`count()`方法实现，用于计算流中元素的数量，适用于快速了解集合大小或满足特定条件的元素数量。

- **`count()`**：返回流中元素的总数量。这是一个长整型（long）值，能处理非常大的集合。

**应用场景**:
- **集合大小**：快速获取集合中元素的数量，替代集合的`.size()`方法，尤其是在经过一系列过滤或转换操作后的流上。
- **条件计数**：与其他操作结合，统计满足特定条件的元素数量。


```java
public class CountExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // 计算流中所有元素的数量
        long totalElements = numbers.stream().count();
        System.out.println("Total elements: " + totalElements); 
        // 输出 Total elements: 10

        // 计算偶数的数量
        long evenCount = numbers.stream()
                                .filter(n -> n % 2 == 0)
                                .count();
        System.out.println("Even numbers count: " + evenCount); 
        // 输出 Even numbers count: 5
    }
}
```

**注意事项**:
- **性能考量**：对于大型数据集，直接调用`.count()`在未进行过滤的情况下可能会有性能开销，因为它需要遍历整个流。如果只需要知道是否存在满足条件的元素，可以考虑使用`anyMatch()`或`findFirst()`，它们在找到匹配项后会立即终止操作。
- **并行流**：在并行流上使用`count()`是线程安全的，但对于极其庞大的数据集，要考虑潜在的内存和同步开销。
- **空流处理**：对于空流，`count()`会返回0，这与直接询问集合大小的行为是一致的。






## Collector接口

`Collector`是一个用于将流中的元素累积到一个结果容器中的接口。Collector接口的定义如下：

```java
public interface Collector<T, A, R> {
    Supplier<A> supplier();
    BiConsumer<A, T> accumulator();
    BinaryOperator<A> combiner();
    Function<A, R> finisher();
    Set<Characteristics> characteristics();
}
```
1. **supplier()**：提供一个空的容器，作为收集结果的初始状态。
2. **accumulator()**：累加器函数，将一个元素添加到中间结果容器中。这个方法会被应用到流中的每个元素。
3. **combiner()**：组合器函数，用于合并两个中间结果容器。只在==并行流==中有用，能够将各个线程独立处理的结果合并起来。
4. **finisher()**：完成器函数，将中间结果转换为最终结果。这个方法是可选的，当收集器的特性包含`Collector.Characteristics.IDENTITY_FINISH`时，表示中间结果本身就是最终结果。
5. **characteristics()**：返回一个集合，描述收集器的特性，以下是三种主要特性：
    - `CONCURRENT`：表明收集器是线程安全的，可以在并行流中安全地使用
    - `UNORDERED`：表明收集操作的输出与输入元素的顺序无关，因此有时能提升并行处理的性能
    - `IDENTITY_FINISH`：表明收集过程产生的中间结果可以直接作为最终结果返回，无需调用`finisher()`方法进行转换。

::: info collect方法与Collector接口方法的交互流程

1. **初始化**：`collect()`方法首先调用`Collector`的`supplier()`方法来创建一个初始的空结果容器。例如，如果是收集到列表，则初始化一个空列表。

2. **累积**：接下来，对于流中的每个元素，`collect()`会调用`accumulator()`方法。这个方法接收两个参数：当前的中间结果容器和下一个流元素。它负责将元素累积到结果容器中。这个步骤会重复进行，直到流中的所有元素都被处理。

3. **合并（可选）**：在并行流处理中，流被分成多个子流分别处理，每个子流有自己的结果容器。处理完各自的子流后，`collect()`会通过调用`combiner()`方法来合并这些子结果。`combiner()`接收两个中间结果容器作为输入，并返回合并后的结果容器。

4. **完成**：当累积和合并（如果有的话）完成后，如果定义了`finisher()`方法，`collect()`会调用它来转换中间结果到最终结果。例如，如果收集操作产生了一个`HashMap`作为中间结果，而最终想要的是不可变的`Map`，可以在`finisher()`中将`HashMap`转换为不可变的`Map`。
:::



Collectors工具类的常用方法源码浅析：

::: code-tabs#shell

@tab:active `toList()`

```java
public static <T> Collector<T, ? , List<T>> toList() {
    return new CollectorImpl<>( 
        // supplier: 创建一个ArrayList作为容器
        (Supplier<List<T>>) ArrayList::new, 
        // accumulator: 将每一个元素加到列表中
        List::add,
        // combiner: 并行流中处理结果的合并逻辑：
        // 通过addAll方法将right列表的所有元素添加到left列表中，然后返回合并后的left列表
        (left, right) -> { left.addAll(right); return left; }, 
        // Characteristics: IDENTITY_FINISH
        // 表明收集过程的最终结果容器就是中间累加结果本身，不需要额外的转换步骤
        CH_ID
    );
}
```

@tab `toSet()`
```java
public static <T> Collector<T, ? , Set<T>> toSet() {
    return new CollectorImpl<>(
        // supplier: 创建一个HashSet作为容器，利用其特性实现去重
        (Supplier<Set<T>>) HashSet::new, 
        // accumulator: 将每个元素添加到集合中，由于Set的特性，重复元素会被忽略
        Set::add,
        // combiner: 在并行流中合并两个集合，这里使用addAll方法，Set保证了元素的唯一性
        (left, right) -> { left.addAll(right); return left; }, 
        // Characteristics: UNORDERED_ID
        // 表明收集操作的结果集不保证元素的顺序，并且结果容器就是累积结果本身
        CH_UNORDERED_ID
    );
}
```

@tab `toCollection()`
```java
// toCollection是一个通用的容器收集器，可以用于任何Collection接口的实现类
public static <T, C extends Collection<T>> 
Collector<T, ? , C> toCollection(Supplier<C> collectionFactory) {
    return new CollectorImpl<>(
        // supplier: 使用提供的工厂函数创建集合容器
        collectionFactory, 
        // accumulator: 将每个元素添加到集合中，具体行为依赖于集合的add方法
        Collection<T>::add,
        // combiner: 在并行流中合并两个集合，通过addAll方法实现，确保所有元素都被收集
        (r1, r2) -> { r1.addAll(r2); return r1; }, 
        // Characteristics: IDENTITY_FINISH
        // 意味着收集操作的最终结果无需转换，直接使用累积结果即可
        CH_ID
    );
}

// 使用示例：如果希望排重但又希望保留出现的顺序，可以使用LinkedHashSet
Collectors.toCollection(LinkedHashSet::new)
```


@tab `toMap()`
```java
/**
 * toMap 有多个形式，这里以两个函数参数的形式为例
 * @param keyMapper 一个Function，将输入元素转换为Map的键
 * @param valueMapper 另一个Function，将输入元素转换为Map的值
 */
public static <T, K, U>
Collector<T, ?, Map<K,U>> toMap(Function<? super T, ? extends K> keyMapper,
                                Function<? super T, ? extends U> valueMapper) {
    return new CollectorImpl<>( 
        // 使用HashMap作为默认容器
        HashMap::new,
        // accumulator: 将输入元素转换为键值对并添加到Map中，处理重复键的情况
        uniqKeysMapAccumulator(keyMapper, valueMapper),
        // combiner: 在并行流中合并两个Map，处理键冲突以保持唯一性
        uniqKeysMapMerger(),
        // Characteristics: IDENTITY_FINISH
        // 表示收集过程的最终Map即为累积结果，无须转换
        CH_ID
    );
}

// 使用示例：t->t是valueMapper，表示值就是元素本身。也可以用接口Function的identity函数来表示
Collectors.toMap(Student::getId, t -> t)
Collectors.toMap(Student::getId, Function.identity())
```

@tab `joining()`
```java
/**
 * 创建一个Collector，它将CharSequence类型的输入元素连接成一个字符串。
 * 元素间可以插入指定的分隔符，并可添加前缀及后缀。
 *
 * @param <CharSequence> 输入元素类型，需为CharSequence的子类，如String
 * @param delimiter 用于分隔每个元素的字符序列，默认为空
 * @param prefix 添加到结果字符串开始的字符序列，默认为空
 * @param suffix 添加到结果字符串末尾的字符序列，默认为空
 * @return 一个Collector，用于将流中的元素连接成一个带有指定分隔、前缀及后缀的字符串
 */
public static Collector<CharSequence, ?, String> joining(CharSequence delimiter,
                                                         CharSequence prefix,
                                                         CharSequence suffix) {
    return new CollectorImpl<>(
            // supplier: 创建一个StringJoiner作为容器，初始化分隔符、前缀和后缀
            () -> new StringJoiner(delimiter, prefix, suffix),
            // accumulator: 将每个CharSequence元素添加到StringJoiner中
            StringJoiner::add,
            // combiner: 在并行流中合并两个StringJoiner的结果
            StringJoiner::merge,
            // finisher: 将StringJoiner转换为最终的字符串结果
            StringJoiner::toString,
            // Characteristics: CH_NOID
            // 表明此收集器没有定义任何Characteristics特性
            CH_NOID
    );
}

// 使用示例：
Collectors.joining()    // 简单地把元素连接起来
Collectors.joining(", ", "[", "]")  // 支持分隔符,前缀及后缀, 格式：[abc, java, hello]
```


@tab `reducing()`
```java
public static <T, U>
    Collector<T, ?, U> reducing(
        // 身份值（identity），用于累积操作的初始值，同时也是空流时的默认返回值
        U identity,
        // 映射函数（mapper），将流中的每个元素转换为累积类型U
        Function<? super T, ? extends U> mapper,
        // 二元操作符（op），定义了如何将累积值与转换后的元素累积（或合并）
        BinaryOperator<U> op) {

        return new CollectorImpl<>(
            // 使用boxSupplier方法包装初始值，用于兼容收集器的累积容器规范
            boxSupplier(identity),
            // accumulator累加器函数，定义了如何将下一个元素累积到累积容器中
            (a, t) -> { a[0] = op.apply(a[0], mapper.apply(t)); },
            // combiner合并器函数，用于合并两个累积结果（在并行处理时使用）
            (a, b) -> { a[0] = op.apply(a[0], b[0]); return a; },
            // finisher完成器函数，将累积结果从累积容器转换为最终结果类型
            a -> a[0],
            // 规定了收集器的特征，这里是无标识（CH_NOID，表示无哈希码影响）
            CH_NOID);
    }

// 使用示例：
// 求和
Integer sum = numbers.stream().collect(Collectors.reducing(0, Integer::sum));
// 字符串拼接
String sentence = words.stream().collect(Collectors.reducing("", String::concat));
// 映射后再求和（类型转换）
int totalAge = persons.stream().collect(Collectors.reducing(
                                                   0,
                                                   person -> person.getAge(),
                                                   Integer::sum));
```

:::



`Collectors.groupingBy` 允许你根据某些特定属性（由提供的分类函数确定）对流中的元素进行分组。（由于源码较为复杂，这里只介绍其使用方式）。**基本用法：**

```java
public static <T, K> 
Collector<T, ?, Map<K, List<T>>> 
    groupingBy(Function<? super T, ? extends K> classifier)
```
- **classifier**: 一个函数，应用于流中的每个元素来生成一个键，用于决定该元素在结果Map中的位置。

```java
// 假设有一个Person对象列表，我们想要按年龄分组：
Map<Integer, List<Person>> groupedByAge = people.stream()
                        .collect(Collectors.groupingBy(Person::getAge));
```

除了上述的基础用法，还可以结合下游收集器处理更复杂的任务

::: tip 下游收集器
下游收集器（Downstream Collector）是在Java Stream API的收集过程中，当使用复合收集器（如`Collectors.groupingBy`、`Collectors.partitioningBy`）时，用于进一步处理分组或分区后元素的一种收集器。

简单来说，当你对一个流进行分组操作时，`groupingBy` 首先会根据提供的分类函数将流中的元素分配到不同的组。但是，分组之后，每个组内的元素还需要进一步处理以形成最终的收集结果，这时就需要指定一个“下游收集器”。这个下游收集器决定了每个组如何被具体收集和呈现，比如是否收集为列表、计数、求最大值等。
:::

常见的下游收集器：
- counting：用于统计每个组内的元素数量。
- maxBy：找出每个组内某个属性的最大值。
- collectingAndThen：对收集的结果应用最终转换。
- mapping：在分组之前对元素进行转换。



::: code-tabs#shell

@tab:active `counting()`
```java
// 计算每个年龄段的人数
Map<Integer, Long> countByAge = people.stream()
    .collect(Collectors.groupingBy(Person::getAge, Collectors.counting()));
```

@tab `maxBy()`
```java
// 根据姓名首字母分组，然后再找每个组里年龄最大的人
Map<Character, Optional<Person>> oldestByNameFirstChar = people.stream()
    .collect(Collectors.groupingBy(person -> person.getName().charAt(0),
                Collectors.maxBy(Comparator.comparing(Person::getAge))));
```

@tab `collectingAndThen()`
```java
// 将每个年龄段的人数转为String：
Map<Integer, String> countByAgeStr = people.stream()
    .collect(Collectors.groupingBy(Person::getAge, 
            Collectors.collectingAndThen(Collectors.counting(), Long::toString))
    );
```

@tab `mapping()`
```java
// 分组时只取人名：
Map<Integer, List<String>> namesGroupedByAge = people.stream()
    .collect(Collectors.groupingBy(Person::getAge, 
                    Collectors.mapping(Person::getName, Collectors.toList()))
    );
```

:::

<br/>

针对int、long和double类型等基础数据类型，Collectors提供了专门的收集器，比如：

- `averagingInt`，`averagingLong`，`averagingDouble`：求平均值

- `summingInt`，`summingLong`，`summingDouble`：计算所有元素的总和

- `summarizingInt`、`summarizingLong`、`summarizingDouble`：提供一系列汇总统计信息。


```java
// 计算Integer流的平均值
Double averageScore = students.stream()
                            .collect(Collectors.averagingInt(Student::getScore));

// 计算Long流所有元素的总和
Long totalDownloads = apps.stream()
                        .collect(Collectors.summingLong(App::getDownloadCount));

// summarizingDouble 汇总统计信息
DoubleSummaryStatistics priceStats = products.stream()
                        .collect(Collectors.summarizingDouble(Product::getPrice));
```


summarizingDouble输出示例（包含个数、最大值、最小值、和、平均值等多种信息）：

```java
{1=DoubleSummaryStatistics{count=3, sum=200.000000, min=50.000000, 
                           average=66.666667, max=91.000000}, 
 2=DoubleSummaryStatistics{count=2, sum=167.000000, min=78.000000, 
                           average=83.500000, max=89.000000}}
```




## 最佳实践及应用
- **无副作用**：确保Stream操作不会改变外部状态。
- **短路操作**：利用短路操作提高效率，如`anyMatch()`。
- **延迟执行与惰性求值**：理解Stream操作的执行机制。
- **性能优化**：选择合适的数据结构和操作以提升性能。


### 并行Stream

并行Stream是Java 8引入的一个重要特性，它允许在多核处理器上利用多个线程来对集合数据进行并行处理，从而在某些情况下显著提高程序的执行效率。并行Stream通过将任务分解到多个线程上执行，然后合并结果，实现了自动的并行处理。

并行Stream可以通过调用集合的 `parallelStream()` 方法获得，或者在创建Stream时通过 `stream().parallel()` 方法转换。

**示例：计算一个大数组中所有正数的和**

```java
import java.util.Arrays;
import java.util.LongSummaryStatistics;
import java.util.concurrent.atomic.AtomicLong;

public class ParallelStreamExample {
    public static void main(String[] args) {
        long[] array = new long[10_000_000];
        // 生成包含负数和正数的数组
        Arrays.setAll(array, ignored -> (long) (Math.random() * 200 - 100)); 

        // 使用并行Stream计算所有正数的和
        AtomicLong sum = new AtomicLong();
        Arrays.stream(array).parallel()
              .filter(x -> x > 0)
              .forEach(sum::addAndGet);

        System.out.println("所有正数的和：" + sum.get());

        // 使用并行Stream进行统计分析
        LongSummaryStatistics stats = Arrays.stream(array).parallel()
                                           .summaryStatistics();

        System.out.println("最大值：" + stats.getMax());
        System.out.println("最小值：" + stats.getMin());
        System.out.println("平均值：" + stats.getAverage());
        System.out.println("总和：" + stats.getSum());
        System.out.println("计数：" + stats.getCount());
    }
}
```

::: tip 注意事项
1. **数据分解与合并成本**：对于小数据集，由于并行处理的开销（如线程创建和上下文切换），并行Stream可能比顺序Stream慢。只有当处理大量数据时，其优势才明显。

2. **线程安全**：并行Stream中使用的操作必须是无副作用的，并且要确保线程安全。例如，上面示例中直接修改`AtomicLong`是线程安全的，但如果直接累加到普通`long`变量就会有问题。

3. **性能考量**：虽然并行Stream提供了自动的并行处理，但并不是所有场景都适合并行化。数据的分布、任务的性质（是否易于分解）、硬件资源等因素都会影响并行处理的效率。

4. **内存消耗**：并行处理可能会增加内存使用，因为每个工作线程都需要自己的数据副本或部分数据副本。

5. **调试难度**：并行执行的代码更难调试，因为线程交错执行可能导致非确定性的行为。

6. **使用`collect()`时的并行收集器**：默认的收集器在并行Stream中可能不是最优的，考虑使用特定的并行收集器（如`Collectors.toConcurrentMap`）来优化性能。
:::




### 实际开发示例

在Java后端开发中，尽管关系型数据库查询主要通过SQL完成，但Java的Stream API在处理内存中的数据集合、尤其是在后端服务的数据处理层依然有着广泛的应用。当数据从数据库取出并转换为Java对象集合后，Stream API可以在以下场景中发挥作用：

- **数据预处理和转换**：在将数据发送到前端之前，进行格式化、过滤或聚合。
- **业务逻辑处理**：在服务层处理复杂的业务规则，特别是需要对多个实体集合进行联合操作时。
- **API响应构造**：根据不同的查询条件动态构造API响应内容。
- **日志和监控数据处理**：分析和处理应用日志或监控数据，进行统计或异常检测。


**实际场景示例：用户订单数据分析**：

假设你正在开发一个电商后端服务，需要分析某一天内所有用户的订单数据，统计每个用户的订单总额，并筛选出消费额超过一定阈值的用户。这些数据已从MySQL数据库查询出来并转换为Java对象列表。

首先，定义一个简单的`Order`类：

```java
public class Order {
    private String userId;
    private BigDecimal amount;
    
    // 构造方法、getter和setter省略
}
```

接着，使用Stream API处理这些数据：

```java
// 假设orders是从数据库获取并转换后的Order对象列表
List<Order> orders = new ArrayList<>(); // 这里应填充从数据库获取的真实数据

// 使用Stream API统计每个用户的订单总额
Map<String, BigDecimal> userTotalAmounts = orders.stream()
        .collect(Collectors.groupingBy(Order::getUserId, 
                Collectors.reducing(BigDecimal.ZERO, 
                        Order::getAmount, 
                        BigDecimal::add)));

System.out.println("每个用户的订单总额: " + userTotalAmounts);

// 筛选出消费额超过1000的用户
Map<String, BigDecimal> highSpendingUsers = userTotalAmounts.entrySet().stream()
        .filter(entry -> entry.getValue().compareTo(new BigDecimal("1000")) > 0)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

System.out.println("消费额超过1000的用户: " + highSpendingUsers);
```

注意实际开发中将整个数据库表的数据加载到内存中处理，特别是对于大型数据集，是不切实际且资源消耗巨大的做法。通常，应该根据数据量的大小和操作的具体需求来决定是在数据库层面处理数据，还是先查询再利用Java的Stream API处理。

针对上述场景，在数据量很大时，更合理的做法是直接在数据库层面使用SQL查询来完成统计和筛选操作。例如，可以使用如下SQL查询实现相同功能：

```sql
SELECT userId, SUM(amount) AS totalAmount
FROM orders
WHERE DATE(orderDate) = '2023-04-01' -- 假设orderDate是订单日期字段
GROUP BY userId
HAVING totalAmount > 1000;
```

**何时使用Stream API处理内存数据：**

- **数据量适中**：当从数据库获取的数据量较小，足以高效地在应用服务器内存中处理时。
- **复杂业务逻辑**：如果数据处理涉及到复杂的业务逻辑，难以直接通过SQL表达，或需要与其他内存中的数据结合处理时。
- **灵活性**：在开发阶段快速迭代和验证逻辑时，直接在代码中使用Stream API可能更为灵活便捷。

因此，是否使用Stream API处理数据，应基于实际的数据规模、处理逻辑的复杂度以及性能要求综合考虑。对于大量数据的处理，优先考虑在数据库层面完成，以充分利用数据库系统的性能优势。




### 函数式思维

::: tip 函数式编程的核心原则
- **不变性**：数据一旦创建后就不应被修改，所有的操作都应该返回新的数据结构，这有助于减少程序中的错误并提高代码的可预测性。
- **高阶函数**：函数可以作为参数传递给其他函数，也可以作为其他函数的返回值。这是函数式编程实现复用和抽象的关键机制。
- **纯函数**：函数的输出仅依赖于其输入参数，且不会产生副作用（如修改全局状态或I/O操作），这使得函数的行为更容易理解和测试。
:::

**函数式数据处理思维深入**

- **延迟执行与惰性求值**：Stream API在不真正需要结果时不会执行计算，直到调用诸如`collect`, `toArray`, 或 `forEach`这样的终结操作。这有助于优化资源使用和提高效率。
- **并行处理能力**：如前所述，Stream API天然支持并行处理，通过简单的`.parallel()`调用即可开启，这对于大数据量处理尤为重要。
- **链式调用与清晰表达**：通过方法链，Stream API鼓励写出更加简洁、可读性强的代码，每个步骤的意图明确，易于理解与维护。
  
**与SQL的相似性扩展**

- **聚合操作**：如同SQL中的`COUNT`, `SUM`, `AVG`, 等聚合函数，Stream API提供了对应的`count()`, `sum()`, `average()`等方法，用于对数据集进行汇总。
- **分组与分区**：除了简单的筛选和排序，Stream API的`collect(Collectors.groupingBy(...))`可以实现类似SQL中的`GROUP BY`操作，对数据进行分组。

**与Unix管道命令的对比**

- **模块化与组合**：Unix管道允许将多个简单命令通过`|`连接，形成复杂的数据处理流程，与之相似，Stream API的中间操作（如`map`, `filter`）可以灵活组合，形成强大的数据处理管道。
- **强大而灵活的工具集**：正如Unix系统提供了众多单一职责的命令工具，Stream API通过丰富的函数提供了处理数据的各种手段，开发者可以根据需要自由选择和组合这些工具来解决问题。


函数式思维在数据处理上的应用，尤其是通过Stream API的实践，不仅提高了代码的简洁性和可读性，还提升了程序的执行效率和可维护性。通过借鉴SQL查询语言的声明式处理方式和Unix管道的模块化思想，函数式编程进一步推动了软件开发范式的进化，使得开发者能够更加专注于解决问题的逻辑本身，而非实现细节。




## Optional容器类


`Optional` 是 Java 8 引入的一个容器类，它用于表示可能存在也可能不存在的值。这个概念在函数式编程中非常常见，旨在避免 `null` 带来的空指针异常问题，提高代码的健壮性和可读性。通过使用 `Optional`，我们可以更优雅、明确地处理可能缺失的数据。

::: info 使用场景
1. **方法返回可能为 null 的值时**：比如从数据库查询数据，如果记录不存在，传统方式可能会返回 `null`，现在可以改为返回 `Optional`。
2. **链式调用**：当一系列操作中，每个步骤都可能因为条件不满足而没有结果时，`Optional` 提供了很好的链式调用能力。
3. **避免空指针异常**：通过在编译期检查是否正确处理了可能缺失的值，减少运行时的 `NullPointerException`。
:::


**Optional常用方法**:

1. **创建 Optional 实例的方法**
   - `Optional.of(T value)`：创建一个 Optional 实例，value 必须非空。
   - `Optional.ofNullable(T value)`：根据 value 是否为 null 创建 Optional 实例，null 时返回一个空的 Optional。
   - `Optional.empty()`：创建一个空的 Optional 实例。

2. **检查值是否存在**
   - `boolean isPresent()`：如果值存在则返回 true，否则返回 false。
   - `boolean isEmpty()`：与 `isPresent` 相反，值不存在时返回 true。

3. **获取值的方法**
   - `T get()`：如果值存在，则返回该值，否则抛出 NoSuchElementException 异常。
   - `T orElse(T other)`：如果值存在则返回该值，否则返回 other。
   - `T orElseGet(Supplier<? extends T> other)`：如果值存在则返回该值，否则返回由 Supplier 给定的函数计算的结果。
   - `T orElseThrow(Supplier<? extends X> exceptionSupplier)`：如果值存在则返回该值，否则抛出由 Supplier 给定的函数生成的异常。

4. **映射和过滤**
   - `<U> Optional<U> map(Function<? super T, ? extends U> mapper)`：如果有值，则对其应用提供的 mapping 函数并返回一个新的 Optional，否则返回一个空的 Optional。
   - `Optional<T> filter(Predicate<? super T> predicate)`：如果值存在并且满足提供的 predicate，则返回一个 Optional 包装的该值，否则返回一个空的 Optional。


**创建 Optional**:

```java
Optional<String> optional = Optional.of("Hello World"); // 存在的值
Optional<String> emptyOptional = Optional.empty(); // 缺失的值
```

注意：`Optional.ofNullable(null)` 可以用来创建一个可能包含 `null` 值的 `Optional` 对象。

**检查值是否存在**:

```java
if (optional.isPresent()) {
    System.out.println(optional.get()); // 获取值
} else {
    System.out.println("No value present");
}
```

**链式调用与默认值**:

```java
String result = Optional.ofNullable(getName())
                        .orElseGet(() -> "Default Name"); // 如果为空，提供默认值

// 或者进行转换等操作
String upperName = Optional.ofNullable(getName())
                           .map(String::toUpperCase) // 转换为大写
                           .orElse("DEFAULT"); // 如果为空，提供默认值
```

**处理异常**:

```java
Optional<Integer> result = Optional.of("123")
        .map(Integer::parseInt) // 尝试转换
        .orElseThrow(() -> new IllegalArgumentException("Not a number")); 
        // 如果转换失败，抛出自定义异常
```

`Optional` 类的设计初衷是鼓励开发者思考和处理潜在的 `null` 值问题，从而提高代码的健壮性和可读性。


<br/>

`Optional`在 Stream 中的应用

假设我们有一个用户列表，想要获取年龄最大的用户的邮箱地址（假设邮箱地址可能为空），可以这样操作：

```java
List<User> users = ...; // 用户列表
Optional<String> maxAgeUserEmail = users.stream()
                    .max(Comparator.comparing(User::getAge))
                    .map(User::getEmail); // 使用 map 处理 Optional<User>

// 打印邮箱，如果不存在则打印默认信息
System.out.println(maxAgeUserEmail.orElse("No email available"));
```

**日常开发中的非Stream场景应用示例**：

假设有一个从数据库查询用户的方法，可能返回 `null`：

```java
public User findUserById(int id) {
    // 假设这是数据库查询逻辑，可能返回null
}

// 使用 Optional 改进
public Optional<User> findUserByIdOpt(int id) {
    User user = findUserById(id);
    return Optional.ofNullable(user);
}

// 调用示例
Optional<User> optionalUser = findUserByIdOpt(1);
optionalUser.ifPresent(user -> System.out.println(user.getName())); // 只有当用户存在时打印用户名
```

在非Stream场景下，`Optional` 的使用主要体现在方法返回值和参数传递上，通过这种方式，可以强制调用者考虑空值的情况，从而避免不经意间引入 `NullPointerException`。此外，它也促进了代码的自我解释性，使得其他开发者能够更容易理解代码的意图。
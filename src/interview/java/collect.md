---

order: 10
title:  Java集合

---

## Java集合体系

![Java集合体系](https://s2.loli.net/2022/01/10/pnf7euRo8Y6LQlq.png)

#### Java 中有哪些集合类？请简单介绍
- **List**：有序集合，允许重复元素，主要实现类有 `ArrayList`、`LinkedList`。
- **Set**：无序集合，不允许重复元素，主要实现类有 `HashSet`、`TreeSet`、`LinkedHashSet`。
- **Map**：键值对集合，键唯一，主要实现类有 `HashMap`、`Hashtable`、`TreeMap`、`LinkedHashMap`、`ConcurrentHashMap`。




### 数组和链表

#### 数组和链表在 Java 中的区别是什么？
- **数组**：连续的内存空间，支持随机访问，插入和删除效率低。
- **链表**：不连续的内存空间，插入和删除效率高，不支持随机访问。

#### Java 中的 List 接口有哪些实现类？
- **ArrayList**：基于动态数组实现，支持随机访问，插入和删除效率低。
- **LinkedList**：基于双向链表实现，插入和删除效率高，不支持随机访问。
- **Vector**：线程安全的 `ArrayList`，性能较低。
- **CopyOnWriteArrayList**：线程安全的 `ArrayList`，写操作时复制整个数组。

#### Java 中 ArrayList 和 LinkedList 有什么区别？
- **ArrayList**：基于动态数组，支持随机访问，插入和删除效率低。
- **LinkedList**：基于双向链表，插入和删除效率高，不支持随机访问。

#### Java ArrayList 的扩容机制是什么？
- **扩容机制**：当数组容量不足时，创建一个新的数组，容量为原数组的 1.5 倍，然后将原数组的元素复制到新数组中。





### 栈和队列

#### 栈和队列在 Java 中的区别是什么？
- **栈（Stack）**：后进先出（LIFO），Stack是vector一个子类，主要操作有 `push`（入栈）、`pop`（出栈）和 `peek`（查看栈顶元素）。
- **队列（Queue）**：先进先出（FIFO），主要操作有 `offer`（入队）、`poll`（出队）和 `peek`（查看队首元素）。





### 线程安全集合

#### Java 的 CopyOnWriteArrayList 和 Collections.synchronizedList 有什么区别？分别有什么优缺点？
- **CopyOnWriteArrayList**：
  - **优点**：读操作不加锁，性能高。
  - **缺点**：写操作需要复制整个数组，内存开销大。
- **Collections.synchronizedList**：
  - **优点**：使用全局锁，实现简单。
  - **缺点**：读写操作都需要加锁，性能较低。









## HashMap原理

底层数据结构：数组 + 链表 + 红黑树 （jdk1.8之前没有红黑树结构，只是简单的 数组 + 链表 ）

#### 使用 HashMap 时，有哪些提升性能的技巧？
- **初始容量**：合理设置初始容量，避免频繁扩容。
- **负载因子**：适当调整负载因子，平衡时间和空间开销。
- **避免哈希冲突**：使用高质量的哈希函数，减少哈希冲突。



### 扩容机制
#### Java 中 HashMap 的扩容机制是怎样的？
- **扩容机制**：当元素数量超过阈值（容量 * 负载因子）时，创建一个新的数组，容量为原数组的 2 倍，然后将原数组的元素重新哈希到新数组中。

#### 为什么 HashMap 在 Java 中扩容时采用 2 的 n 次方倍？
- **2 的 n 次方**：确保哈希值与数组长度的模运算结果均匀分布，减少哈希冲突。



### 默认负载因子

#### 为什么 Java 中 HashMap 的默认负载因子是 0.75？
- **负载因子**：0.75 是一个经验值，平衡了时间和空间开销，既能保证较高的空间利用率，又能减少哈希冲突。


### 哈希碰撞

#### 什么是 Hash 碰撞？怎么解决哈希碰撞？
- **哈希碰撞**：多个键计算出相同的哈希值。
- **解决方法**：使用链地址法（链表）或开放地址法（线性探测、二次探测、双散列）。


#### 为什么 JDK 1.8 对 HashMap 进行了红黑树的改动？
- **红黑树**：当链表长度超过 8 且数组长度大于等于 64 时，将链表转换为红黑树，提高查找效率。

#### JDK 1.8 对 HashMap 除了红黑树还进行了哪些改动？
- **CAS 操作**：使用 CAS 操作提高并发性能。
- **树化阈值**：引入了树化阈值和取消树化的阈值。
- **优化初始化**：延迟初始化，减少不必要的初始化开销。













### Hashtable

Hashtable是数组+链表   (没有红黑树;  jdk1.8之前的HashMap一样)

#### Java 中的 HashMap 和 Hashtable 有什么区别？
- **HashMap**：非线程安全，允许键和值为 `null`，性能较高。
- **Hashtable**：线程安全，不允许键和值为 `null`，性能较低。

#### ConcurrentHashMap 和 Hashtable 的区别是什么？
- **ConcurrentHashMap**：线程安全，使用分段锁（JDK 1.8 使用 CAS 和 synchronized）实现，性能较高。
- **Hashtable**：线程安全，使用全局锁实现，性能较低。

#### Java 中的 HashSet 和 HashMap 有什么区别？
- **HashSet**：基于 `HashMap` 实现，不允许重复元素，不保证顺序。
- **HashMap**：键值对集合，键唯一，允许值为 `null`。





### ConcurrentHashMap

#### Java 中 ConcurrentHashMap 1.7 和 1.8 之间有哪些区别？
- **1.7**：使用分段锁（Segment）实现，每个 Segment 管理一部分桶。
- **1.8**：使用 CAS 操作和 synchronized 实现，提高了并发性能，引入了红黑树结构。

#### Java 中 ConcurrentHashMap 的 get 方法是否需要加锁？
- **不需要**：`get` 方法是非阻塞的，不涉及修改操作，不需要加锁。

#### 为什么 Java 的 ConcurrentHashMap 不支持 key 或 value 为 null？
- **设计原因**：`null` 值会导致查找和删除操作复杂化，影响性能和一致性。




### 其他Map

#### Java 中的 LinkedHashMap 是什么？
- **LinkedHashMap**：基于 `HashMap` 实现，维护插入顺序或访问顺序。

#### Java 中的 TreeMap 是什么？
- **TreeMap**：基于红黑树实现，按键的自然顺序或自定义比较器排序。

#### Java 中的 IdentityHashMap 是什么？
- **IdentityHashMap**：基于对象的引用地址而不是 `equals` 方法比较键，适用于需要基于引用比较的场景。

#### Java 中的 WeakHashMap 是什么？
- **WeakHashMap**：基于弱引用实现，键可以被垃圾回收，适用于缓存场景。









## foreach/Iterator

#### 你遇到过 ConcurrentModificationException 错误吗？它是如何产生的？
- **ConcurrentModificationException**：在遍历集合时，集合被其他线程修改导致。
- **产生原因**：使用迭代器遍历时，集合被修改（如添加、删除元素）。


Java 中 for 循环与 foreach 循环的区别是什么？

::: info for循环和foreach的区别
#### foreach
foreach是 java5 引入的一种简化的循环结构，常用于遍历 **数组** 或 **实现了Iterable接口的集合**
```java
 for (String fruit : fruits) {
    System.out.println(fruit);
}
```
- foreach虽然简洁易用，但不提供对当前索引的访问
- 遍历过程中不能修改集合的结构（添加或删除集合元素），否则会抛出并发修改异常`ConcurrentModificationException`

#### for循环
for循环则更加灵活，可以控制循环的初始值，终止条件和步进方式。适用于需要通过索引访问元素，或在循环中添加/删除集合中的元素
```java
int[] numbers = {1, 2, 3, 4, 5};
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}
```
:::


什么是 Java 中的迭代器（Iterator）？

::: warning Iterator迭代器
Iterator是Java集合框架中用于遍历集合元素的接口，迭代器是的遍历不同类型的集合更加简洁，统一，提升了代码的可读性。在遍历过程中还可以添加或删除元素。比如：`iterator.remove()`

- Iterator 迭代器采用的是 快速失败（fail-fast）机制，一旦使用非Iterator的方法或其他线程修改了集合，就会导致集合的`modCount`和 Iterator的`expectedModCount`不相等，将引发`ConcurrentModificationException`异常

- 对集合使用foreach循环，本质上也是Iterator，同样不能随意修改。对数组使用foreach则会被编译成为传统的for循环

List专门提供了ListIterator方法，其返回值是一个Iterator的子接口，最明显的特点就是支持双向遍历(`hasPrevious`和`previous`)
:::

关于集合 迭代器，及其与Foreach的关系参照：[Iterator](/java/syntax/base/collection.md#_1-iterator)


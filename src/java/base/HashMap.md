---

order: 100
title: HashMap源码剖析

---



## 1. 底层结构

==数组 + 链表 + 红黑树==   （jdk1.8之前没有红黑树结构，只是简单的 数组 + 链表 ）

![](https://image.ventix.top/java/image-20220310170842726.png)

Java 8对HashMap的实现进行了优化，在哈希冲突比较严重的情况下，即大量元素映射到同一个链表的情况下（具体是至少已保存8个元素，且总的键值对个数至少是64）, Java 8会将该链表转换为一个红黑树，以提高查询的效率

<br/>

## 2. 源码结构

### 1) 实例变量

```java
// HashMap
public class HashMap<K,V> extends AbstractMap<K,V> implements Map<K,V>, Cloneable, Serializable {

    /**---------------------------------常量-------------------------------------------------*/

    // The default initial capacity - MUST be a power of two. 默认初始化容量
    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

    // The maximum capacity, 最大容量
    static final int MAXIMUM_CAPACITY = 1 << 30;

    // The load factor used when none specified in constructor. 默认加载因子
    static final float DEFAULT_LOAD_FACTOR = 0.75f;

    /**
     * The bin count threshold for using a tree rather than list for a bin. 
     * Bins are converted to trees when adding an element to a bin with at least this many nodes. 
     * The value must be greater than 2 and should be at least 8 to mesh with assumptions in
     * tree removal about conversion back to plain bins upon shrinkage.
     * 先简单理解为：将链表转换为红黑树的阈值
     */
    static final int TREEIFY_THRESHOLD = 8;

    /**
     * The bin count threshold for untreeifying a (split) bin during a resize operation. 
     * Should be less than TREEIFY_THRESHOLD, and at most 6 to mesh with shrinkage detection under removal.
     * 先简单理解为：将红黑树转换为链表的阈值
     */
    static final int UNTREEIFY_THRESHOLD = 6;

    /**
     * The smallest table capacity for which bins may be treeified.
     * (Otherwise the table is resized if too many nodes in a bin.)
     * Should be at least 4 * TREEIFY_THRESHOLD to avoid conflicts
     * between resizing and treeification thresholds.
     * 先简单理解为：将链表转换为红黑树时，还需要判断已存储的数据量是否达到该值
     */
    static final int MIN_TREEIFY_CAPACITY = 64;



    /* ---------------------------------- Fields 实例变量 --------------------------- */

    // table是一个Node类型的数组，称为哈希表或哈希桶，其中的每个元素指向一个单向链表，链表中的每个节点表示一个键值对
    transient Node<K,V>[] table;  

    transient Set<Map.Entry<K,V>> entrySet;

    transient int size;            // size表示实际键值对的个数

    transient int modCount;       

    /**
     * The next size value at which to resize (capacity * load factor).
     */
    // (The javadoc description is true upon serialization.
    // Additionally, if the table array has not been allocated, this
    // field holds the initial array capacity, or zero signifying
    // DEFAULT_INITIAL_CAPACITY.)
    int threshold;

    // The load factor for the hash table.
    final float loadFactor;



    /** ------------------------------ Node 静态内部类 ----------------------------------- */
    /**
     * Basic hash bin node, used for most entries.  
     * (See below for TreeNode subclass, and in LinkedHashMap for its Entry subclass.)
     */
    static class Node<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        V value;
        Node<K,V> next;

        public final int hashCode() {
            return Objects.hashCode(key) ^ Objects.hashCode(value);
        }
    }

}
```

<br/>

### 2) 构造方法

```java
// 构造一个具有默认初始容量 (16) 和默认加载因子 (0.75) 的空HashMap
public HashMap() {
    this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
}

// 构造一个带指定初始容量和默认加载因子 (0.75) 的空 HashMap
public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}

// 构造一个带指定初始容量和加载因子的空 HashMap
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " + initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " + loadFactor);

    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}
// 先将 tableSizeFor 方法复制到这里研究研究：
// 这个方法的作用: 就是把指定值变成一个大于等于这个值的最小的2的幂值方法
// 如： 16 -> 16;   20 -> 32;  60 -> 64;  64 -> 64
// 不用担心阈值会大于数组长度，首次添加元素时会 执行resize() 方法，下面会再次解释该方法
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}

// 构造一个映射关系与指定 Map 相同的新 HashMap
public HashMap(Map<? extends K, ? extends V> m) {
    this.loadFactor = DEFAULT_LOAD_FACTOR;
    putMapEntries(m, false);
}
```

<br/>

**loadFactor(加载因子)**：是用来限定阈值的 , 如果HashMap存储的数据(key-value份数)超过阈值, 底层数组需要进行扩容 

```java
：
 阈值(12) = 加载因子(0.75) * 数组长度(16)

// 注意: 虽然我们可以做在构造方法里修改加载因子: 但是建议不要修改, 实在要修改(建议保证在0.5-1之间)
```

<br/>

## 3. 存储过程

HashMap是如何把一个键值对（key-value）保存起来的？

```java
步骤：put() ----> putVal()
1. 先计算 key 的 hash值 （ 调用了hash() 方法 ）
   HashMap并没有直接提供putVal方法给用户调用，而是提供put方法给用户，计算出hash值后再调用putVal来插入元素

2. 判断底层数组是否为空（意味着首次添加）或长度是否为0来决定是否扩容

3. 将 hash() 方法计算的 hash值 和 数组长度取模，得到存储位置的下标

4. 将数据存储到该下标的位置 
    - 若该位置没有存储过数据，直接存储即可
    - 若该位置已经存储了数据，先判断该位置数据的key是否重复、重复覆盖value即可，
      若（第一次节点）不重复，接下来就需要区分是链表还是红黑树，再比较元素是否重复决定是否构建新的Node
    - 若是链表时还需要判断链表是否过长，若达到阈值，需要将链表转换为红黑树
    - 若是红黑树，则调用 putTreeVal() 方法
```

![](https://image.ventix.top/java/HashMap-putVal方法.png)

```java
// 参照上述步骤进行源码解读
public V put(K key, V value) {
        // 1. 先调用 hash() 方法计算hash值
        return putVal(hash(key), key, value, false, true);
    }

    /**
     * Implements Map.put and related methods.
     *
     * @param hash hash for key
     * @param key the key
     * @param value the value to put
     * @param onlyIfAbsent if true, don't change existing value
     * @param evict if false, the table is in creation mode.
     * @return previous value, or null if none
     */
    final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
        Node<K,V>[] tab;  // 指向底层数组
        Node<K,V> p;      // 指向数组中的待添加元素的那个节点
        int n, i;         // n 表示底层数组的长度， i表示 p 所在数组的下标

        // 2. 判断底层数组是否为空（意味着首次添加）或长度是否为0来决定是否扩容
        if ((tab = table) == null || (n = tab.length) == 0)
            n = (tab = resize()).length;

        // 3. 将 hash() 方法计算的 hash值 和 数组长度取模，得到存储位置的下标
        if ((p = tab[i = (n - 1) & hash]) == null)
            // 4.1 该位置没有存储过数据，直接存储即可
            tab[i] = newNode(hash, key, value, null);
        else {
            // 4.2 说明该位置已经存储了数据，则要区分是链表还是红黑树
            Node<K,V> e; 
            K k;

            if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))
                // 说明该位置存储元素的key与本次要存的key重复 
                e = p;
            else if (p instanceof TreeNode)
                // 说明是一个红黑树，调用处理树的方法继续执行
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                // 来到这儿说明这个下标存储有内容, 并且是一个链表
                for (int binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        p.next = newNode(hash, key, value, null);
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash);
                        break;
                    }
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }

            if (e != null) { // existing mapping for key （处理重复key的情形）
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
        if (++size > threshold)  // 添加元素后需要检测是否需要扩容
            resize();
        afterNodeInsertion(evict);
        return null;
    }
```

<br/>

### 1) 计算hash值

hash方法：根据 key 哈希(散列) 一个hash值

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

// 当key为 null 时， 返回0
// 不为null时，先调用 该对象的 hashCode()方法，再进行右移16位然后与自身进行亦或
```

那么这里为什么要先移位又做异或运算？ 

其实是希望key的 hashCode() 低位能够充分混合(和高位), 再参数取模, 取模的结果就更随机

<br/>

取下标：

```java
// 还记得putVal方法中的下列代码吗？
i = (n - 1) & hash;

(n - 1) & hash     // hash值和数组长度取模,等同于：hash % (n - 1)
```

<br/>

### 2) resize()方法

```java
 // HashMap的扩容方法

    final Node<K,V>[] resize() {
        // oldTab 旧的底层数组
        Node<K,V>[] oldTab = table;           

        // oldCap 旧数组长度, 当底层数组为null时（第一次添加元素），旧的容量为0，否则为数组长度
        int oldCap = (oldTab == null) ? 0 : oldTab.length;  

        // oldThr 旧阈值 
        int oldThr = threshold;

        // 定义新长度, 新阈值
        int newCap, newThr = 0;


        if (oldCap > 0) {
            if (oldCap >= MAXIMUM_CAPACITY) {
                threshold = Integer.MAX_VALUE;
                return oldTab;
            }
            else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY && oldCap >= DEFAULT_INITIAL_CAPACITY)
                newThr = oldThr << 1;
        }
        else if (oldThr > 0) 
            newCap = oldThr;
        else {             
            // int DEFAULT_INITIAL_CAPACITY = 1 << 4;
            // newCap =  16
            newCap = DEFAULT_INITIAL_CAPACITY;
            // newThr =  0.75 * 16 = 12
            newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
        }
        if (newThr == 0) {
            float ft = (float)newCap * loadFactor;
            newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                      (int)ft : Integer.MAX_VALUE);
        }
        // threshold = 12
        threshold = newThr;

        // 创建新数组: 16长度数组
        Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
        table = newTab;


        // 
        if (oldTab != null) {
            for (int j = 0; j < oldCap; ++j) {
                Node<K,V> e;
                if ((e = oldTab[j]) != null) {
                    oldTab[j] = null;
                    if (e.next == null)
                        newTab[e.hash & (newCap - 1)] = e;
                    else if (e instanceof TreeNode)
                        ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                    else { // preserve order
                        Node<K,V> loHead = null, loTail = null;
                        Node<K,V> hiHead = null, hiTail = null;
                        Node<K,V> next;
                        do {
                            next = e.next;
                            if ((e.hash & oldCap) == 0) {
                                if (loTail == null)
                                    loHead = e;
                                else
                                    loTail.next = e;
                                loTail = e;
                            }
                            else {
                                if (hiTail == null)
                                    hiHead = e;
                                else
                                    hiTail.next = e;
                                hiTail = e;
                            }
                        } while ((e = next) != null);
                        if (loTail != null) {
                            loTail.next = null;
                            newTab[j] = loHead;
                        }
                        if (hiTail != null) {
                            hiTail.next = null;
                            newTab[j + oldCap] = hiHead;
                        }
                    }
                }
            }
        }
        return newTab;
    }
```

### 3) 添加到链表

### 4) 添加到红黑树

```java
// TODO
```

<br/>

## 4. 常见问题

<br/>

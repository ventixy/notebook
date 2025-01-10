---

order: 90

---

# Set和Map

## 1. Map接口

Map 是一种键-值对（key-value）集合，Map 集合中的每一个元素都包含一个键（key）对象和一个值（value）对象。用于保存具有映射关系的数据。

```java
// 1, Map是Map集合体系的顶级接口
// 2, Map存储的是key-value数据(键值对)  (key-value具有自我描述性)
// 3, Map的一些子实现存储元素是有序的, 另一些子实现存储元素无序
// 4, Map都不允许存储重复元素 (什么叫重复元素)
// 5, Map的一些子实现允许存储null, 另一些子实现不允许存储null

(这些有序/重复/null问题指的都是map数据中的key,  value不在讨论范畴之内)

注意: 如果我们又给map存储了一份重复key-value数据 (重复指key重复), 那么会新的value会覆盖已经存储的key-value的value

注意: 因为map没有定义Iterator方法, 所以我们没有办法直接使用foreach循环来遍历map
```

Map接口的常用方法：

```java
V put(K key, V value)                       // 添加或替换（可选操作）
void putAll(Map<? extends K,? extends V> m) // 批量添加或替换（可选操作）

V remove(Object key)                        // 如果存在一个键的映射关系，则将其从此映射中移除（可选操作）

boolean containsKey(Object key)             // 如果此映射包含指定键的映射关系，则返回 true
boolean containsValue(Object value)         // 如果此映射将一个或多个键映射到指定值，则返回 true     
V get(Object key)                           // 返回指定键所映射的值；如果此映射不包含该键的映射关系，则返回null             

void clear()                                // 从此映射中移除所有映射关系（可选操作）。
boolean equals(Object o)                    // 比较指定的对象与此映射是否相等。
int hashCode()                              // 返回此映射的哈希码值。
boolean isEmpty()                           // 如果此映射未包含键-值映射关系，则返回 true。       
int size()                                  // 返回此映射中的键-值映射关系数。       


Set<K> keySet()                             // 返回此映射中包含的键的 Set 视图
Collection<V> values()                      // 返回此映射中包含的值的 Collection 视图   
Set<Map.Entry<K,V>> entrySet()              // 返回此映射中包含的映射关系的 Set 视图
```

注意: 为什么Map要提供三个视图方法（keySet、values、entrySet）

- 因为map没有定义Iterator方法, 所以我们没有办法直接使用foreach循环来遍历map
  
  所以提供了是哪个视图方法, 把数据变成Collection类型, 就可以使用foreach循环来遍历map数据了

三个视图方法的简单使用示例代码如下：

```java
public class MapDemo {
    public static void main(String[] args) {
        Map<String, String> animal = new HashMap<String, String>();
        animal.put("cat", "小猫");
        animal.put("dog", "小狗");
        animal.put("pig", "小猪");

        // 遍历（迭代器）
        // 1. 输出 value的值
        Iterator<String> it = animal.values().iterator();
        while (it.hasNext()) {
            System.out.print(it.next() + " ");
        }
        System.out.println("\n——————————————————————————————————————————");

        // 2. 通过 entrySet 方法打印 key 和 value 的值
        Set<Map.Entry<String,String>> entrySet = animal.entrySet();
        for(Map.Entry<String,String> entry:entrySet){
            System.out.print(entry.getKey()+"-");
            System.out.println(entry.getValue());
        }
        System.out.println("\n——————————————————————————————————————————");

        // 查找（根据 key查找值）
        String search = "cat";
        Set<String> keySet = animal.keySet();
        for(String key:keySet){
            if(search.equals(key)){
                System.out.println("OK! "+key+"-"+animal.get(key));
                break;
            }
        }
    }
}
```

### 1) HashMap

注意: HashMap的底层结构: 数组+链表+红黑树，jdk1.8之前: 只有单纯的: 数组+链表

```java
// 1, HashMap是Map接口的一个子实现 (没有toString方法，使用了其父类AbstractMap的toString方法)
// 2, HashMap底层是: 数组 +链表+红黑树
// 3, HashMap的底层数组默认初始长度 16,   默认的扩容机制: 扩为原来2倍 , 默认的加载因子是0.75
// 4, HashMap存储元素是无序
// 5, HashMap不允许存储重复的key
// 6, HashMap允许存储null作为key （key为null的时候必定存储再数组下标为0的位置）
// 7, HashMap线程不安全
// 8, 如果我们在构造方法里给定长度: 底层长度会变成大于等于我们给定值的最小的2的幂值
       16 -> 16;   20 -> 32;  60 -> 64;  64 -> 64
// 9, 
```

加载因子:

```java
// 加载因子是用来限定阈值的 , 如果在爱HashMap存储的数据(key-value份数)超过阈值, 就要底层数组扩容
 阈值(12) = 加载因子(0.75) * 数组长度(16)

// 注意: 虽然我们可以做在构造方法里修改加载因子: 但是建议不要修改, 实在要修改(建议保证在0.5-1之间)
```

对于HashMap讲什么是重复的key:

```java
HashMap对key的重复的定义: key的hash值相等, 并且 key直接相等或者相equals

//  if (p.hash == hash &&  ((k = p.key) == key || (key != null && key.equals(k))))
```

key是怎么计算出一个int类型的值, 以及怎么进一步用这个int值取下标

```java
int类型的值(hash值)怎么得到的
// (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
// 为什么要先移位又做异或运算, 就是希望一个key的hashCode()低位能够充分混合(和高位), 再参数取模, 取模的结果就更随机

注意了解: hashCode值不一样 一定意味着hash值不一样 : 结论 

取下标
//     (n - 1) & hash  : hash值和数组长度取模
```

链表多长算长(多长才会转化为红黑树): 非常重要

```java
当我们在HashMap添加的过程中, 某一个下标位置添加结点(key-value数据的份数)算上刚刚添加的超过8达到9的时候, 就会由链表转化为红黑树 
```

当HashMap添加数据的时候, 链表长度超过8,达到9的时候, 一定会由链表转化为红黑树吗?

```java
不一定, 当底层数组长度小于64的时候, 如果链表长度超过8,达到9的时候优先扩容, 而非转化为红黑树
```

如果红黑树上数据量变少, 有可能转化回链表(什么时候/怎么转化)

```java
什么时候红黑树转化为链表:
1, 删除结点在红黑树上 :  如果删除的时候, 这个红黑树上根节点/根节点的左右结点/根节点的左结点的左节点,这四个结点有一个是null, 就要由红黑树转化为链表

  // root就是树的根节点
if (root == null || root.right == null ||(rl = root.left) == null || rl.left == null) 
         // 红黑树转化为链表
        tab[index] = first.untreeify(map);  // too small


2, 扩容的时候(扩容会把原下标位置存储的元素拆成两部分) : 6
       扩容的时候, 红黑树会拆成低位和高位两部分,  任一部分的拆的数据个数小于等于6的话, 就要由红黑树转化为链表
```

HashMap底层数组是个Node类型的数组: 用来存储Node类型的对象, 这个对象里面包含key-value数据

```java
class Node<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        V value;
        Node<K,V> next;
}
```

注意事项:

红黑树出现的概率高吗? 很低

如果HashMap中已经存储的key-value数据, 建议不要直接通过key的引用修改key的内容, 有可能删不掉

HashMap重写了toString遍历方式是按照下标从前向后遍历, 遇到链表或者树, 对链表或者树按照next遍历完成之后, 接着随着数组下标向后遍历

构造方法:

```java
HashMap()                                      // 构造一个具有默认初始容量 (16) 和默认加载因子 (0.75) 的空HashMap
HashMap(int initialCapacity)                   // 构造一个带指定初始容量和默认加载因子 (0.75) 的空 HashMap
HashMap(int initialCapacity, float loadFactor) // 构造一个带指定初始容量和加载因子的空 HashMap 
HashMap(Map<? extends K,? extends V> m)        // 构造一个映射关系与指定 Map 相同的新 HashMap 
```

一份key-value数据的添加流程

```java
// 1, 要存储一份key-value数据
// 2, 把key拿出, 计算hash值:   通过key的hashCode 异或上hashCode向right移动16位
//                             异或的原因:  希望hash值的高位也参与到取模运算, 充分散列
// 3, hash和数组长度取模, 的到一个下标(就是key-value数据要存储的位置)
// 4, 判断这个下标位置有没有内容, 没有直接存储, 存储一个Node类型(key, value, hash, next)
// 5, 如果这个位置已经存储了别的key-value数据 --> 先判断重复
//       重复的依据: key的hash值是否相等 以及, key是否直接相等或者相equals
// 6, 重复, 新value覆盖旧value
// 7, 不重复,  接着判断这个位置存储的是树还是单链表
//      7.1 如果是个单链表, 按照next方向比较, 重复, 新value覆盖旧value
//                    不重复, 最终添加到这个链表尾部
//            如果添加之后导致这个链表过长(超过8达到9)转化为红黑树(如果数组长度小于64, 优先扩容)
//      7.2 如果是个树, 按照hash值比较大小, 确定比较方向
//          最终是否重复: key的hash值是否相等 以及, key是否直接相等或者相equals
//                     重复: 替换
//                      不重复: 添加到红黑树上
// 8, 添加完成, 有可能超出阈值 --> 扩容
// 9, 原本在x位置元素, 扩容之后, 要么还在x位置, 要么在旧长度+x位置  (取决于高位)
// 10, 如果是个树在扩容之后, 可能被拆开, 被拆开的任何一部分数据量小于等于6的时候, 由红黑树转化为链表
```

删除一个结点: 了解

```java
// 1, 根据一个key删除一份key-value数据
// 2, 通过key计算hash值: 通过key的hashCode 异或上hashCode向right移动16位
// 3, 取模, 的下标, 
// 4, 找到对应下标, 判断是否重复: 
//       重复的依据: key的hash值是否相等 以及, key是否直接相等或者相equals
// 5, 不重复, 判断是树还是链表
// 6, 如果是链表, 遍历链表判断重复, 找到了删除, 没找到不删除
// 7, 如果是个树, 在树上查找(hash确定左右方向), 找到了删除, 删除之后判断根节点/根节点的左右结点/根节点的左节点的左节点是否是null, 如果是null, 红黑树转化为链表
```

### 2) LinkedHashMap

```java
// 1, LinkedHashMap 是HashMap的一个子类
// 2, LinkedHashMap 底层结构基本上完全复用了HashMap的结构
// 3, LinkedHashMap 在HashMap的基础上, 额外的维护了一个双向链表, 用以保证迭代顺序
// 4, LinkedHashMap 表现是有序的
// 5, LinkedHashMap 不允许存储重复元素: 重复的定义和HashMap一样
// 6, LinkedHashMap 允许存储null作为key
// 7, LinkedHashMap 线程不安全
```

构造方法：

```java
// 构造一个带默认初始容量 (16) 和加载因子 (0.75) 的空插入顺序 LinkedHashMap 实例
LinkedHashMap() 

//构造一个带指定初始容量和默认加载因子 (0.75) 的空插入顺序 LinkedHashMap 实例
LinkedHashMap(int initialCapacity)  

//构造一个带指定初始容量和加载因子的空插入顺序 LinkedHashMap 实例
LinkedHashMap(int initialCapacity, float loadFactor) 

// 构造一个带指定初始容量、加载因子和排序模式的空 LinkedHashMap 实例
LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder) 

// 构造一个映射关系与指定映射相同的插入顺序 LinkedHashMap 实例
LinkedHashMap(Map<? extends K,? extends V> m) 
```

### 3) Hashtable

Hashtable工作已经不使用, jdk1.0时候出现; 面试常用来和HashMap做对比

```java
// 1, Hashtable是数组+链表   (没有红黑树;  jdk1.8之前的HashMap一样)
// 2, Hashtbale数组的初始长度11 ,    扩容机制: 扩为原来的2倍+1
// 3, Hashtable不允许存储null 作为key和value
// 4, Hashtable线程安全
```

### 4) TreeMap

```java
// 1, TreeMap是Map接口的子实现
// 2, TreeMap数据结构是红黑树
// 3, TreeMap底层是链表
// 5, TreeMap大小有序
// 6, TreeMap不允许存储重复元素: 大小重复    (和Hash一点关系都没有)
// 7, TreeMap不允许存储null 作为key
// 8, Treemap线程不安全


注意: 因为TreeMap是一个红黑树(是一个特殊的二叉搜素树), 需要比较大小, 那么也就意味着 , 我们存储的到TreeMap中的数据要能比较大小(implements Comparable<User>)
     也可以让存储的key 不实现Comparable,  给TreeMap提供一个比较器Comparator, 让存储的key通过Comparator作比较
```

```java
构造方法摘要 
TreeMap()  // 使用键的自然顺序构造一个新的、空的树映射。 
TreeMap(Comparator<? super K> comparator) // 构造一个新的、空的树映射，该映射根据给定比较器进行排序。 
TreeMap(Map<? extends K,? extends V> m) // 构造一个与给定映射具有相同映射关系的新的树映射，根据其键的自然顺序进行排序 
TreeMap(SortedMap<K,? extends V> m)     // 构造一个与指定有序映射具有相同映射关系和相同排序顺序的新的树映射。 
```

```java
boolean containsKey(Object key)                // 如果此映射包含指定键的映射关系，则返回 true
boolean containsValue(Object value)            // 如果此映射为指定值映射一个或多个键，则返回 true
V get(Object key)                              // 返回指定键所映射的值，没有则返回 null
V put(K key, V value)                          // 将指定值与此映射中的指定键进行关联
void putAll(Map<? extends K,? extends V> map)  // 将指定映射中的所有映射关系复制到此映射中
V remove(Object key)                           // 如果此 TreeMap 中存在该键的映射关系，则将其删除


// 通常集合类都具有的方法
void clear()               // 从此映射中移除所有映射关系
Object clone()             // 返回此 TreeMap 实例的浅表副本
int size()                 // 返回此映射中的键-值映射关系数

// 视图: 键值, 值集, 键值对结合
Collection<V> values()           // 返回此映射包含的值的 Collection 视图
Set<K> keySet()                  // 返回此映射包含的键的 Set 视图
Set<Map.Entry<K,V>> entrySet()   // 返回此映射中包含的映射关系的 Set 视图


// 根据大小相关的 
Map.Entry<K,V> ceilingEntry(K key)   // 获得大于等于给定key的最小键值对
K ceilingKey(K key)                  // 获得大于等于给定key的最小key

Map.Entry<K,V> floorEntry(K key)     // 获得小于等于给定key的最大键值对
K floorKey(K key)                    // 获得小于等于给定key的最大key

Map.Entry<K,V> firstEntry()          // 获取第一个键值对
K firstKey()                         // 获取第一个键值对的key
Map.Entry<K,V> lastEntry()           // 获取最后一个键值对
K lastKey()                          // 获取最后一个键值对的key

Map.Entry<K,V> higherEntry(K key)    // 获得大于给定key的最小键值对
K higherKey(K key)                   // 获得大于给定key的最小key
Map.Entry<K,V> lowerEntry(K key)     // 获得小于给定key的最大键值对
K lowerKey(K key)                    // 获得小于给定key的最大key

Map.Entry<K,V> pollFirstEntry()      // 删除第一个键值对
Map.Entry<K,V> pollLastEntry()       // 删除最后一个键值对


// 截取相关的视图方法

// 返回此映射的部分视图，其键值严格小于 toKey
SortedMap<K,V> headMap(K toKey)

// 返回此映射的部分视图，其键小于（或等于，如果 inclusive 为 true）toKey
NavigableMap<K,V> headMap(K toKey, boolean inclusive)

// 返回此映射的部分视图，其键大于等于 fromKey
SortedMap<K,V> tailMap(K fromKey)

// 返回此映射的部分视图，其键大于（或等于，如果 inclusive 为 true）fromKey
NavigableMap<K,V> tailMap(K fromKey, boolean inclusive)

// 返回此映射的部分视图，其键的范围从 fromKey 到 toKey。
NavigableMap<K,V> subMap(K fromKey, boolean fromInclusive, K toKey, boolean toInclusive)

// 返回此映射的部分视图，其键值的范围从 fromKey（包括）到 toKey（不包括）
SortedMap<K,V> subMap(K fromKey, K toKey)




NavigableSet<K> descendingKeySet() // 返回此映射中所包含键的逆序 NavigableSet 视图
Set<K> navigableKeySet()           // 返回此映射中所包含键的 NavigableSet 视图
Map<K,V> descendingMap()           // 返回此映射中所包含映射关系的逆序视图
Comparator<? super K> comparator() // 返回对此映射中的键进行排序的比较器；如果此映射使用键的自然顺序，则返回 null
```

## 2. Set(集合)

```java
// 1, Set是Collection子接口
// 2, Set所描述的数据结构: 集合
// 3, Set存储元素有些子实现有序(TreeSet, LinkedHashSet),  有些子实现无序 (HashSet)
// 4, Set不允许存储重复数据
// 5, 有些子实现允许存储null (HashSet, LinkedHashSet), 有些子实现不允许存储null(TreeSet)
```

Set接口并没有在Collection基础上增加什么api, 基本上沿用Collection的定义

```java
 boolean add(E e)  
 boolean addAll(Collection<? extends E> c) 

 boolean contains(Object o) 
 boolean containsAll(Collection<?> c)  
 boolean equals(Object o)  

 int size() 
 void clear() 
 int hashCode() 
 boolean isEmpty() 

 Iterator<E> iterator() 

 boolean remove(Object o) 
 boolean removeAll(Collection<?> c) 
 boolean retainAll(Collection<?> c) 

 Object[] toArray() 
<T> T[]  toArray(T[] a) 
```

### 1) HashSet

```java
// 1, HashSet是Set接口的子实现
// 2, HashSet底层持有一个HashMap对象 --> 我们添加到HashSet上的元素, 实际上都添加到底层HashMap上并且作为底层HashMap的key存在
// 3, Hashset的特点基本上和HashMap的key一样
// 4, HashSet存储元素无序
// 5, HashSet不允许存储重复元素: 
// 6, HashSet允许存储null
// 7, HashSet线程不安全
```

```java
// HashSet的构造方法:

// 构造一个新的空set，其底层HashMap实例的默认初始容量是 16，加载因子是 0.75
HashSet()                          

// 构造一个包含指定 collection 中的元素的新 set。 
HashSet(Collection<? extends E> c) 

 // 构造一个新的空set，其底层HashMap实例具有指定的初始容量和默认的加载因子（0.75）
HashSet(int initialCapacity)       

// 构造一个新的空 set，其底层 HashMap 实例具有指定的初始容量和指定的加载因子。 
HashSet(int initialCapacity, float loadFactor)  
```

HashSet的api 和 Set接口定义的一样, Set接口api和Collection一样

### 2) TreeSet

```java
// 1, TreeSet是Set接口的子实现
// 2, TreeSet底层是一个TreeMap (红黑树)
// 3, TreeSet的特点和TreeMap的key保持一致
// 4, TreeSet存储元素大小有序
// 5, TreeSet不存储重复元素 (大小重复)
// 6, TreeSet不存储null  (null没有办法比较大小)
// 7, TreeSet线程不安全
```

```java
构造方法摘要 
TreeSet() 
          构造一个新的空 set，该 set 根据其元素的自然顺序进行排序。 
TreeSet(Collection<? extends E> c) 
          构造一个包含指定 collection 元素的新 TreeSet，它按照其元素的自然顺序进行排序。 
TreeSet(Comparator<? super E> comparator) 
          构造一个新的空 TreeSet，它根据指定比较器进行排序。 
TreeSet(SortedSet<E> s) 
          构造一个与指定有序 set 具有相同映射关系和相同排序的新 TreeSet。 
```

TreeSet 类同时实现了 Set 接口和 SortedSet 接口。SortedSet 接口是 Set 接口的子接口，可以实现对集合进行自然排序，因此使用 TreeSet 类实现的 Set 接口默认情况下是自然排序的，这里的自然排序指的是升序排序。

- **TreeSet 只能对实现了 Comparable 接口的类对象进行排序**，因为 Comparable 接口中有一个 `compareTo(Object o)` 方法用于比较两个对象的大小。例如 `a.compareTo(b)`：
  
  - 如果 a 和 b 相等，则该方法返回 0；
  
  - 如果 a 大于 b，则该方法返回大于 0 的值；
  
  - 如果 a 小于 b，则该方法返回小于 0 的值。

- 在使用自然排序时只能向 TreeSet 集合中添加相同数据类型的对象，否则会抛出 ClassCastException 异常。

Comparable接口类对象的比较方式：

| 类                                                             | 比较方式                      |
| ------------------------------------------------------------- | ------------------------- |
| BigDecimal、Biglnteger、 Byte、Double、Float、Integer、Long 及 Short | 按数字大小比较                   |
| Character                                                     | 按字符的 Unicode 值的数字大小比较     |
| String                                                        | 按字符串中字符的 Unicode 值的数字大小比较 |

TreeSet的api

```java
 boolean add(E e)  
 boolean addAll(Collection<? extends E> c)  
 boolean remove(Object o) 
 int size() 
 void clear() 
 Object clone() 


 boolean isEmpty() 
 boolean contains(Object o) 

 Comparator<? super E> comparator() 

 Iterator<E> iterator() 
 Iterator<E> descendingIterator() 

 SortedSet<E> headSet(E toElement) // 返回此 set 的部分视图，其元素严格小于 toElement。
 NavigableSet<E> descendingSet()  // 返回此 set 中所包含元素的逆序视图。 

 // 返回此 set 的部分视图，其元素小于（或等于，如果 inclusive 为 true）toElement。
 NavigableSet<E> headSet(E toElement, boolean inclusive)



 E first() // 返回此 set 中当前第一个（最低）元素。 
 E last()  // 返回此 set 中当前最后一个（最高）元素。

 E ceiling(E e) 
 E floor(E e)  // 返回此 set 中小于等于给定元素的最大元素；如果不存在这样的元素，则返回 null。 

 E lower(E e) // 返回此 set 中严格小于给定元素的最大元素；如果不存在这样的元素，则返回 null。           
 E higher(E e) // 返回此 set 中严格大于给定元素的最小元素；如果不存在这样的元素，则返回 null。 

 E pollFirst() // 获取并移除第一个（最低）元素；如果此 set 为空，则返回 null。 
 E pollLast() // 获取并移除最后一个（最高）元素；如果此 set 为空，则返回 null。 


 // 返回此 set 的部分视图，其元素范围从 fromElement 到 toElement。 
 NavigableSet<E> subSet(E fromElement, boolean fromInclusive, E toElement, boolean toInclusive) 

 // 返回此 set 的部分视图，其元素从 fromElement（包括）到 toElement（不包括）。 
 SortedSet<E> subSet(E fromElement, E toElement) 

 // 返回此 set 的部分视图，其元素大于等于 fromElement。 
 SortedSet<E> tailSet(E fromElement) 

 //  返回此 set 的部分视图，其元素大于（或等于，如果 inclusive 为 true）fromElement。 
 NavigableSet<E> tailSet(E fromElement, boolean inclusive) 
```

### 3) LinkedHashSet

```java
// 1, LinkedHashSet是HashSet的子类
// 2, LinkedHashSet 底层是LinkedHashMap (双向链表区别)
// 3, LinkedHashSet 有序
// 4, LinkedHashSet 不允许存储重复元素
// 5, LinkedHashSet 允许存储null
// 6, 线程不安全
```

```java
LinkedHashSet() 
          构造一个带默认初始容量 (16) 和加载因子 (0.75) 的新空链接哈希 set。 
LinkedHashSet(Collection<? extends E> c) 
          构造一个与指定 collection 中的元素相同的新链接哈希 set。 
LinkedHashSet(int initialCapacity) 
          构造一个带指定初始容量和默认加载因子 (0.75) 的新空链接哈希 set。 
LinkedHashSet(int initialCapacity, float loadFactor) 
          构造一个带有指定初始容量和加载因子的新空链接哈希 set。 
```

LinkedHashSet 的 api 和 HashSet的api 和 Set接口定义的都一样, Set接口api和Collection一样

**总结**: api 特点(增删改查) 记住.

```java
Collection: 
       List: 线性表
            ArrayList;
            LinkedList;
            Vector(之后Stack):

       Queue: 队列
           Deque接口双端队列/栈
                ArrayDeque
           BlockingQueue: 接口阻塞队列

       Set: 集合
           HashSet (LinkedHashSet)
           TreeSet
```

```java
Map:
         HashMap (LinkedHashMap)
         TreeMap
         Hashtable
```

重点级别1: HashMap; ArrayList

重点级别2: LinkedList; HashSet;

重点级别3: LinkedHashMap/ TreeMap/ LinkedHashSet / TreeSet

重点级别4: 剩余

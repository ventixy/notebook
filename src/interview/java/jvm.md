---

order: 30
title:  Java虚拟机

---



## JVM核心基础

### 类加载机制

1. **Bootstrap 类加载器**：负责加载核心的 Java 类库（如 `java.lang.*`）。
2. **Extension 类加载器**：负责加载扩展库（如 `javax.*`）。
3. **Application 类加载器**： 负责加载应用程序类路径（`CLASSPATH`）下的类。
4. **自定义类加载器**： 用户自定义的类加载器，扩展类加载机制。 继承 `java.lang.ClassLoader` 类并重写 `findClass` 和 `loadClass` 方法。

::: tip JVM类加载过程
1. **加载（Loading）**： 读取字节码文件。 创建 `Class` 对象。 将 `Class` 对象与类加载器关联。
2. **链接（Linking）**：
   - **验证（Verification）**：确保字节码文件符合 JVM 规范。
   - **准备（Preparation）**：为类的静态变量分配内存并设置默认值。
   - **解析（Resolution）**：将符号引用解析为直接引用。
3. **初始化（Initialization）**： 执行静态初始化块和静态变量的赋值操作。 
使用，卸载
:::


### 双亲委派机制

当一个类加载器收到类加载请求时，首先委托给父类加载器去加载。递归向上，直到最顶层的 Bootstrap 类加载器。如果父类加载器无法加载（即在其加载路径中找不到指定的类），子类加载器才会尝试自己加载。 **双亲委派模型的好处**：

1. **安全性**：防止核心类库被篡改。
2. **避免类的重复加载**：确保一个类在 JVM 中只有一个加载实例。
3. **模块化**：不同类加载器负责不同的类加载任务，职责明确。






### 运行时数据区
::: info JVM内存划分
- 程序计数器：线程私有，用于记录当前线程所执行的字节码指令的位置。
- Java虚拟机栈：线程私有，用于存储局部变量、操作数栈、动态链接和方法出口等信息，每个方法被调用时都会创建一个新的栈帧。
- 本地方法栈：线程私有，与Java虚拟机栈类似，但用于支持Native方法的调用。

- Java堆：线程共享，用于存储所有实例对象和数组。这是垃圾收集器管理的主要区域。
- 方法区：线程共享，存储已加载的类信息、常量、静态变量、即时编译后的代码等数据。

- 直接内存：可以通过`java.nio.ByteBuffer`的`allocateDirect()`方法来分配和使用
:::

方法区只是一个规范，其实现方式在jdk1.7及之前为永久代，jdk1.8则为元空间（MetaSpace），且元空间存在于本地内存（Native Memory）

- 永久代中的 interned Strings(字符串常量池）和 class static variables(类静态变量) 转移到了Java heap （JDK1.7）

::: tip Java8为什么要将永久代替换成Metaspace ?
- 字符串存在永久代中，容易出现性能问题和内存溢出
- 类及方法的信息等比较难确定其大小，因此对于永久代的大小指定比较困难，太小容易出现永久代溢出，太大则容易导致老年代溢出
- 永久代会为GC带来不必要的复杂度，并且回收效率偏低。
:::


### 内存溢出

**JVM 方法区是否会出现内存溢出?**
是的，JVM 方法区（或元空间）可能会出现内存溢出，通常是因为类加载过多或元数据过多。可以通过调整 `-XX:MaxMetaspaceSize` 参数来限制方法区的大小。


**JVM 有那几种情况会产生 OOM（内存溢出）？**

- 堆内存溢出（`java.lang.OutOfMemoryError: Java heap space`）
- 栈内存溢出（`java.lang.StackOverflowError`）
- 方法区内存溢出（`java.lang.OutOfMemoryError: Metaspace`）
- 直接内存溢出（`java.lang.OutOfMemoryError: Direct buffer memory`）








### 引用类型
**Q17: Java 中的强引用、软引用、弱引用和虚引用分别是什么？**
  - **强引用**：普通的对象引用，如 `Object obj = new Object()`。只要强引用存在，垃圾回收器就不会回收对象。
  - **软引用**：通过 `SoftReference` 创建，用于实现内存敏感的缓存。当内存不足时，垃圾回收器会回收软引用指向的对象。
  - **弱引用**：通过 `WeakReference` 创建，用于实现弱引用关联的数据结构。弱引用指向的对象在下一次垃圾回收时一定会被回收。
  - **虚引用**：通过 `PhantomReference` 创建，主要用于对象销毁时的回调通知。虚引用指向的对象在垃圾回收时会被放入引用队列，但不会被回收。






## JVM垃圾回收


### 可达性分析

可达性分析算法会从 ==根对象集== 开始，这组根对象集通常包括：
- 所有活动线程的栈帧中的局部变量。
- 方法区（即永久代或元空间）中的静态变量。
- 方法区中的某些常量引用。
- 本地方法栈中JNI（Java Native Interface）的引用。

沿着对象之间的引用链进行深度优先或广度优先搜索，标记所有能从根对象直接或间接引用到的对象。未被标记的对象被视为不可达，可以被垃圾回收器回收。


::: details 三色标记算法
三色标记算法是可达性分析的一种具体实现方法，通过将对象分为白色、灰色和黑色三种状态来追踪对象的可达性。

- 白色（White）：表示尚未访问的对象。初始状态下，所有对象都是白色的。
- 灰色（Gray）：表示已被访问但其引用的对象尚未全部访问的对象。灰色对象是当前正在处理的对象。
- 黑色（Black）：表示已被访问且其引用的对象也已全部访问的对象。黑色对象及其引用的对象都是可达的。

过程：
- 初始标记：从根对象开始，将所有根对象标记为灰色。
- 并发标记：从灰色对象开始，递归地访问其引用的对象。将访问到的白色对象标记为灰色，将当前处理的灰色对象标记为黑色。
- 重新标记：校正并发标记阶段可能出现的引用变化，确保所有可达对象都被正确标记。
- 并发清除：清除所有仍为白色的对象。
:::




### 垃圾回收算法

常见的垃圾回收算法包括标记-清除算法、复制算法、标记-整理算法和分代收集算法。

- 标记-清除算法: 标记存活对象，清除未标记的垃圾对象。存在内存碎片化和效率问题
- 标记-复制算法：将可用内存分为两个相等的部分，每次只使用其中一个部分。当这部分的内存用完时，垃圾回收器会检查这部分内存中的对象，将存活的对象复制到另一部分的内存中。解决了内存碎片化问题，但内存利用率只有50%，如果存活对象过多，复制成本会很高。
- 标记-整理算法：在标记-清除的基础上，将存活对象复制到内存区域的一端，从而整理内存空间，消除碎片。但仍需要遍历整个堆，对象移动可能会导致额外的开销，尤其是当存活对象很多时。

- 分代收集算法：基于“代际假说”。将将堆分为年轻代和老年代，年轻代使用复制算法，而老年代通常使用标记-清除 或 标记-整理算法。

Parallel Scavenge 使用标记-复制算法，Parallel Old 使用标记-整理算法。









### 堆内存划分

分代收集（Generational Collection） 基于“代际假说”：新创建的对象倾向于较快地变成垃圾，而存活时间长的对象则倾向于继续存活。

在JDK 1.8及之前的版本中，堆内存被划分为几个主要的区域（从内存回收的角度来看，由于现在收集器基本都采用分代收集算法，所以Java堆可以细分为）：

- 年轻代（Young Generation）
- 老年代（Old Generation）
- 永久代（Permanent Generation）

从JDK 1.8开始，永久代被元空间（Metaspace）取代，元空间使用的是本机内存而不是堆内存。因此，堆内存划分变为：年轻代（Young Generation）和老年代（Old Generation）

![堆内存划分](https://image.ventix.top/java/image-20220216221349177.png)


::: info Heap
#### **年轻代（Young Generation）**：
年轻代主要存放新创建的对象，内存大小相对会比较小，垃圾回收会比较频繁。年轻代分 成1个 **Eden Space** 和2个 **Suvivor Space**（from 和to）
   - **Eden Space**：这是年轻代中最大的部分，新创建的对象首先在这里分配。
   - **Survivor Spaces**：分为两个相等大小的部分，S0和S1（在HotSpot JVM中，分别叫做From和To空间）。每次Minor GC后，存活的对象会被移动到另一个空的Survivor空间中，或者如果对象足够大或存活时间足够长，则直接进入老年代。

#### **老年代（Old Generation / Tenured Generation）**：
老年代用于存储长期存活的对象，或者在年轻代中无法容纳的大对象（Large Objects）。内存大小相对会比较大，垃圾回收也相对没有那么频繁。

#### **永久代（Permanent Generation）/ 元空间（Metaspace）**：
用于存储类的元数据、静态变量、常量池等信息。在JDK 1.8中，永久代被元空间（Metaspace）取代。
:::









**为什么 Java 新生代被划分为 S0、S1 和 Eden 区？**
新生代被划分为 Eden 区和两个 Survivor 区（S0 和 S1），这样可以在 Minor GC 时使用复制算法，将存活对象从 Eden 区复制到一个 Survivor 区，另一个 Survivor 区作为备用，这样可以高效地回收短生命周期的对象。





### 垃圾回收方式


::: info 常见垃圾回收方式
#### 部分收集器（Partial GC）
- **Minor GC / Young GC**：这是年轻代（Young Generation）的垃圾回收过程，主要发生在Eden区。当Eden区满时，Minor GC会被触发，将存活的对象移动到Survivor区或晋升到老年代。Minor GC通常频率较高，停顿时间较短。

- **Major GC / Old GC**：针对老年代（Old Generation）进行垃圾回收，通常是因为老年代空间不足。

#### 整堆收集器（Full GC）

整堆收集器对整个堆内存进行垃圾回收，包括年轻代、老年代以及永久代（PermGen）或元空间（Metaspace）。Full GC通常在以下情况发生：

- 当老年代空间不足，且之前的Minor GC未能释放足够的空间时。
- 当永久代或元空间空间不足。
- 显式调用`System.gc()`时，尽管这并不保证立即执行Full GC，且通常不推荐这样做。

#### Mixed GC

Mixed GC是一个比较新的概念，主要出现在现代的垃圾回收器如G1（Garbage First）中。它是一种混合了年轻代和老年代回收的策略，在清理年轻代的同时，也会清理一部分老年代区域，这种策略有助于减少Full GC的发生，降低停顿时间。
:::



**JVM 新生代垃圾回收如何避免全堆扫描？**
新生代垃圾回收通过使用卡表（Card Table）和记忆集（Remembered Set）来跟踪跨代引用，从而避免全堆扫描。卡表记录了老年代对象对新生代对象的引用，记忆集记录了跨代引用的变化。








### 垃圾回收器

1. **Serial**(Serial & Serial Old)：单线程垃圾回收器，适用于单核处理器和小内存应用，简单高效。

2. **ParNew**: 多线程版本的 Serial 垃圾回收器，专门用于新生代的垃圾回收，与 CMS 收集器配合使用，提高并发性能。

3. **CMS（Concurrent Mark Sweep）**：并发标记清除垃圾回收器，旨在减少停顿时间，适用于对响应时间有较高要求的应用。

4. **Parallel Scavenge（PS）**：多线程垃圾回收器，专注于最大化吞吐量，适用于多核处理器和高性能要求的应用。

5. **Parallel Old**：多线程垃圾回收器，专门用于老年代的垃圾回收，与 Parallel Scavenge 配合使用，优化吞吐量。



6. **G1（Garbage First）**：分区垃圾回收器，通过预测和优化垃圾回收时间，平衡吞吐量和停顿时间，适用于大内存应用。

7. **ZGC（Z Garbage Collector）**：低延迟垃圾回收器，设计目标是实现毫秒级的停顿时间，适用于需要极高响应速度的应用。

8. **Shenandoah**：低延迟垃圾回收器，通过并发标记和并发移动对象来减少停顿时间，适用于需要低延迟和高吞吐量的应用。

9. **Epsilon**：无操作垃圾回收器，不进行实际的垃圾回收，适用于测试和基准测试，帮助评估应用的内存使用情况。












## 性能调优与工具

JVM 垃圾回收调优的主要目标是减少停顿时间、提高吞吐量和降低内存占用。具体目标包括减少 Full GC 的频率、优化新生代和老年代的比例、调整垃圾收集器的参数等。

使用监控工具（如 Prometheus + Grafana、VisualVM、JConsole 等）持续监控内存使用情况，可以及时发现潜在问题。











### 内存泄漏分析
进行内存泄漏分析的方法包括：
::: info 内存泄漏分析过程
1. 生成堆转储文件（Heap Dump）
```bash
ps -ef | grep java  # 或者使用jps, 找到 Java 进程的 PID
jmap -dump:live,format=b,file=/path/to/heapdump.hprof <pid>
# jcmd <pid> GC.heap_dump /path/to/heapdump.hprof
```
发生OOM时自动生成 dump 文件 / 自动执行特定脚本或命令：
```bash
java -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/path/to/dumps -jar your-application.jar

java -XX:+HeapDumpOnOutOfMemoryError -XX:OnError="sh /path/to/your/script.sh" -jar your-application.jar
```
需要注意生成dump文件可能会很大，耗时较长，且可能会包含用户数据等敏感信息

2. 分析堆转储文件（Heap Dump）

使用 Memory Analyzer Tool (MAT) /  VisualVM 查看内存占用和对象数量和使用情况

3. 定位问题：查看 MAT 自动生成的内存泄漏报告，重点关注潜在的泄漏对象。使用 OQL 查询特定对象，例如查找所有未被释放的连接对象
   分析对象引用

4. 解决问题：代码审查 + 优化配置 + 测试验证

  - 确保对象在不再需要时被及时释放。避免不必要的全局变量和静态变量，防止对象长时间持有。
  - 根据应用的特点调整垃圾回收器和堆内存大小。
  - 进行压力测试，模拟高负载场景，验证内存使用情况。
:::


### 频繁FullGC

首先要先明白什么情况下会触发Full GC:

- 老年代空间不足: 当老年代的空间不足以容纳从年轻代晋升的对象时，会触发 Full GC
  - 大对象直接进入老年代
  - 当年轻代的空间不足以容纳新创建的对象时，会触发 Minor GC。如果 Minor GC 后仍有大量对象需要晋升到老年代，而老年代空间不足，则会触发 Full GC。
- 永久代（Metaspace）空间不足
- 系统显式请求: 调用 System.gc() 方法可能会触发 Full GC

::: tip 问题排查示例

1. 通过 JVM 提供的工具（如 `jstat, jmap, jvisualvm`）或第三方监控工具（如 `Prometheus + Grafana, GCeasy` 等）来收集和分析垃圾回收的日志。
重点关注 Full GC 的频率、持续时间和堆内存使用情况。观察是否有明显的 Full GC 频率增加的趋势，以及每次 Full GC 后老年代（Old Generation）的内存占用是否显著下降。

2. 问题定位: 生成并分析堆转储文件（heap dump），找出哪些对象占据了过多的内存空间，是否存在内存泄漏。

3. 检查并优化代码：注意是否有不当的对象生命周期管理、大对象分配或缓存滥用等问题。
  - 减少不必要的对象创建。
  - 使用合适的数据结构和算法，避免过度消耗内存。
  - 对象复用，而不是频繁地创建新实例。
  - 及时释放不再使用的资源，如关闭流、断开数据库连接等。

4. 重复测试，持续监控
:::

代码中可能会出现的问题及解决方案：
- ==HashMap缓存未及时清理== : 实现缓存淘汰策略，如 LRU（最近最少使用）、TTL（生存时间），并通过定时任务定期清理过期数据。
- ==循环内连续创建了多个大对象== : 尽量减少大对象的创建频率，考虑使用对象池模式来重用已存在的对象，或者将大对象拆分为更小的部分逐步处理。
- ==使用长生命周期引用（如静态集合）== : 为类添加方法来移除不再需要的对象，确保它们可以被正确回收

其他通用解决方案：
- 调整堆内存大小或调整新生代和老年代的比例: 如果堆内存不足，可以适当增大堆内存。
- 优化对象的大小，减少大对象的创建，或者增加老年代的内存大小。
- 增加 Metaspace 的大小, 或者减少类的加载数量
- 避免在代码中显式调用 System.gc()，除非有特殊需求。

- 选择合适的垃圾回收器





### JVM配置参数

JVM 配置参数种类繁多，涵盖了内存管理、垃圾回收、性能优化等多个方面。以下是一些常用的 JVM 配置参数：

::: tabs

@tab:active 堆内存
- **-Xms**：初始堆内存大小。
  ```sh
  -Xms512m
  ```
- **-Xmx**：最大堆内存大小。
  ```sh
  -Xmx2g
  ```
- **-XX:NewRatio**：新生代与老年代的比例（默认为 2，即新生代占堆内存的 1/3）。
  ```sh
  -XX:NewRatio=3
  ```
- **-XX:NewSize**：初始新生代大小。
  ```sh
  -XX:NewSize=256m
  ```
- **-XX:MaxNewSize**：最大新生代大小。
  ```sh
  -XX:MaxNewSize=512m
  ```
- **-XX:SurvivorRatio**：Eden 区与 Survivor 区的比例（默认为 8，即 Eden 占新生代的 8/10）。
  ```sh
  -XX:SurvivorRatio=8
  ```

#### 堆外内存
- **-XX:MaxDirectMemorySize**：最大堆外内存大小。
  ```sh
  -XX:MaxDirectMemorySize=256m
  ```

@tab 永久代/元空间
- **-XX:PermSize**（JDK 7 及之前）：初始永久代大小。
  ```sh
  -XX:PermSize=64m
  ```
- **-XX:MaxPermSize**（JDK 7 及之前）：最大永久代大小。
  ```sh
  -XX:MaxPermSize=256m
  ```
- **-XX:MaxMetaspaceSize**（JDK 8 及之后）：最大 Metaspace 大小。
  ```sh
  -XX:MaxMetaspaceSize=256m
  ```
- **-XX:MetaspaceSize**（JDK 8 及之后）：初始 Metaspace 大小。
  ```sh
  -XX:MetaspaceSize=64m
  ```

@tab 垃圾回收

#### 选择垃圾回收器
- **-XX:+UseSerialGC**：使用 Serial 垃圾回收器。
  ```sh
  -XX:+UseSerialGC
  ```
- **-XX:+UseParallelGC**：使用 Parallel 垃圾回收器。
  ```sh
  -XX:+UseParallelGC
  ```
- **-XX:+UseParallelOldGC**：使用 Parallel Old 垃圾回收器。
  ```sh
  -XX:+UseParallelOldGC
  ```
- **-XX:+UseConcMarkSweepGC**：使用 CMS 垃圾回收器。
  ```sh
  -XX:+UseConcMarkSweepGC
  ```
- **-XX:+UseG1GC**：使用 G1 垃圾回收器。
  ```sh
  -XX:+UseG1GC
  ```
- **-XX:+UseZGC**：使用 ZGC 垃圾回收器（JDK 11 及之后）。
  ```sh
  -XX:+UseZGC
  ```
- **-XX:+UseShenandoahGC**：使用 Shenandoah 垃圾回收器（JDK 12 及之后）。
  ```sh
  -XX:+UseShenandoahGC
  ```

#### 垃圾回收参数
- **-XX:MaxGCPauseMillis**：最大垃圾回收停顿时间目标。
  ```sh
  -XX:MaxGCPauseMillis=200
  ```
- **-XX:G1HeapRegionSize**：G1 垃圾回收器的区域大小。
  ```sh
  -XX:G1HeapRegionSize=4M
  ```
- **-XX:InitiatingHeapOccupancyPercent**：G1 垃圾回收器的初始堆占用百分比。
  ```sh
  -XX:InitiatingHeapOccupancyPercent=70
  ```
- **-XX:+UseCMSInitiatingOccupancyOnly**：CMS 垃圾回收器的初始堆占用百分比。
  ```sh
  -XX:+UseCMSInitiatingOccupancyOnly -XX:CMSInitiatingOccupancyFraction=70
  ```
- **-XX:+UseCMSCompactAtFullCollection**：CMS 垃圾回收器在 Full GC 时进行内存压缩。
  ```sh
  -XX:+UseCMSCompactAtFullCollection
  ```

@tab 性能优化

#### JIT 编译器
- **-XX:+TieredCompilation**：启用分层编译。
  ```sh
  -XX:+TieredCompilation
  ```
- **-XX:TieredStopAtLevel=1**：分层编译停止在第 1 层。
  ```sh
  -XX:TieredStopAtLevel=1
  ```
- **-XX:+UseCompressedOops**：启用压缩指针（适用于 64 位 JVM）。
  ```sh
  -XX:+UseCompressedOops
  ```

#### 堆栈大小
- **-Xss**：每个线程的堆栈大小。
  ```sh
  -Xss512k
  ```

#### 其他性能参数
- **-XX:+AggressiveOpts**：启用 aggressive 优化选项。
  ```sh
  -XX:+AggressiveOpts
  ```
- **-XX:+OptimizeStringConcat**：优化字符串拼接。
  ```sh
  -XX:+OptimizeStringConcat
  ```
- **-XX:+UseStringDeduplication**：启用字符串去重。
  ```sh
  -XX:+UseStringDeduplication
  ```

@tab 日志和调试

#### GC 日志
- **-Xlog:gc**:file=gc.log:time,uptime,pid,tid,level:filecount=10,filesize=10M**：启用详细的 GC 日志。
  ```sh
  -Xlog:gc*:file=gc.log:time,uptime,pid,tid,level:filecount=10,filesize=10M
  ```

#### 堆转储
- **-XX:+HeapDumpOnOutOfMemoryError**：在发生 OutOfMemoryError 时生成堆转储文件。
  ```sh
  -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/path/to/heapdump.hprof
  ```

#### 调试信息
- **-XX:+PrintGCDetails**：打印详细的 GC 信息。
  ```sh
  -XX:+PrintGCDetails
  ```
- **-XX:+PrintGCTimeStamps**：打印 GC 时间戳。
  ```sh
  -XX:+PrintGCTimeStamps
  ```
- **-XX:+PrintGCDateStamps**：打印 GC 日期时间戳。
  ```sh
  -XX:+PrintGCDateStamps
  ```

@tab 其他配置
#### 并发线程数
- **-XX:ParallelGCThreads**：并行垃圾回收线程数。
  ```sh
  -XX:ParallelGCThreads=4
  ```
- **-XX:ConcGCThreads**：并发垃圾回收线程数。
  ```sh
  -XX:ConcGCThreads=2
  ```

#### 垃圾回收器特定参数
- **-XX:MaxTenuringThreshold**：最大晋升阈值（适用于 Parallel 和 CMS 垃圾回收器）。
  ```sh
  -XX:MaxTenuringThreshold=15
  ```
- **-XX:G1NewSizePercent**：G1 新生代初始大小百分比。
  ```sh
  -XX:G1NewSizePercent=5
  ```
- **-XX:G1MaxNewSizePercent**：G1 新生代最大大小百分比。
  ```sh
  -XX:G1MaxNewSizePercent=60
  ```
:::














**Q16: 什么是 Java 中的 JIT（Just-In-Time）?**
- **答案**：JIT 编译器是 JVM 的一部分，用于在运行时将字节码编译成本地机器码，提高执行效率。JIT 编译器会选择热点代码进行编译，减少解释执行的开销。

**Q17: 什么是 Java 的 AOT（Ahead-Of-Time）？**
- **答案**：AOT 编译器在编译时将 Java 字节码编译成本地机器码，生成可执行文件。AOT 编译可以在启动时减少加载时间，适用于需要快速启动的应用程序。

**Q18: 你了解 Java 的逃逸分析吗？**
- **答案**：逃逸分析是 JVM 的一种优化技术，用于确定对象的作用域。如果一个对象在方法内部创建并且没有逃逸出该方法，JVM 可以将该对象分配在栈上而不是堆上，减少垃圾回收的压力。

**Q26: 什么是 Java 中的 PLAB？**
- **答案**：PLAB（Promotion LAB）是 G1 垃圾收集器中的一个概念，用于在 Minor GC 时将新生代的对象提升到老年代。PLAB 是一个局部的内存缓冲区，每个线程都有自己的 PLAB，用于减少多线程环境下的同步开销。
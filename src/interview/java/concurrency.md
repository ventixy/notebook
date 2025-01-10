---

order: 20
title:  Java并发编程

---


## Java并发编程基础

并发和并行有什么区别

- 并发是指两个或多个任务在同一时间段内开始、执行和完成，但不意味着它们在物理上同时执行。
- 并行则是指两个或多个任务在同一时刻真正同时执行。

什么是线程和进程？有什么区别？
- 进程是操作系统进行资源分配和调度的基本单位, 进程是一个独立的执行环境，拥有独立的内存空间、系统资源
- 线程是进程内的一个执行单元，是CPU调度的基本单位





### 线程的创建

创建线程：继承Thread，实现Runnable，实现Callable

Callable规定的方法是call()，而Runnable规定的方法是run()。Callable的任务执行后可返回值，可拿到一个Future对象。

注意 start 和 run
- run方法根本就没有开辟新的执行路径,还是按照顺序执行的，直接调用run方法,相当于普通成员方法调用
- start方法才是真正的去创建线程。但只有run方法当中的代码才会执行在子线程中,我们要把我们的代码写到run方法中,并且启动的时候一定是start方法




### 线程的生命周期

Thread.State是一个内部枚举类，定义了6个枚举常量，分别代表Java线程的6种状态：
New（新建），Runnable（可运行）, Blocked（阻塞），Waiting（等待），Timed Waiting（超时等待），Terminated（终止）

Runnable合并了操作系统层面的就绪（ready）和运行（running）状态

操作系统的线程状态：New（新建）， Ready（可运行/就绪），Running（运行），Blocked（阻塞），Dead（死亡）



### 线程通信方式
Object的等待/通知机制 是基于对象监视器（Monitor）的一种线程间通信方式，主要通过wait(), notify(), 和 notifyAll()这三个方法来实现：
- wait()方法使当前线程进入等待（WAITING）状态，并释放它所持有的对象的监视器锁
- notify()方法随机唤醒在此对象监视器上等待的一个线程。
- notifyAll()方法唤醒在此对象监视器上等待的所有线程。

Condition常用方法：
await(): 使当前线程等待  signal(): 唤醒在此Condition上等待的一个线程  signalAll(): 唤醒在此Condition上等待的所有线程。


### 线程死锁

什么是线程死锁？如何避免死锁？

线程死锁：多个线程同时被阻塞，它们中的一个或者全部都在等待某个资源被释放。由于线程被无限期地阻塞，因此程序不可能正常终止。

例如：线程 A 持有资源 2，线程 B 持有资源 1，他们同时都想申请对方的资源，所以这两个线程就会互相等待而进入死锁状态。


如何预防死锁？ 破坏死锁的产生的必要条件即可：
1.	破坏请求与保持条件   ：一次性申请所有的资源。
2.	破坏不剥夺条件 ：占用部分资源的线程进一步申请其他资源时，如果申请不到，可以主动释放它占有的资源。
3.	破坏循环等待条件 ：靠按序申请资源来预防。按某一顺序申请资源，释放资源则反序释放。破坏循环等待条件。

如何避免死锁？
避免死锁就是在资源分配时，借助于算法（比如银行家算法）对资源分配进行计算评估，使其进入安全状态。



### 线程池种类和参数

**线程池**：预先创建一组线程，复用这些线程处理任务，减少线程创建和销毁的开销。

```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    10, // 核心线程数
    20, // 最大线程数
    60, // 非核心线程闲置超时时间，单位为秒
    TimeUnit.SECONDS, // 时间单位
    new LinkedBlockingQueue<>(100), // 任务队列，容量100
    Executors.defaultThreadFactory(), // 使用默认线程工厂
    new ThreadPoolExecutor.AbortPolicy()); // 拒绝策略为抛出异常
```

如何合理地设置 Java 线程池的线程数？
- 一般设置为 `CPU 核心数 + 1` 或 `CPU 核心数 * 2`，具体取决于任务类型和系统负载。

 Java 线程池有哪些拒绝策略？
- **AbortPolicy**：抛出 `RejectedExecutionException`。
- **CallerRunsPolicy**：由调用线程执行任务。
- **DiscardPolicy**：丢弃任务。
- **DiscardOldestPolicy**：丢弃队列中最老的任务，再提交新任务。

Java 并发库中提供了哪些线程池实现？它们有什么区别？
- **FixedThreadPool**：固定大小的线程池。
- **CachedThreadPool**：可缓存的线程池，适合执行大量短小任务。
- **SingleThreadExecutor**：单线程的线程池。
- **ScheduledThreadPool**：支持定时和周期任务的线程池。

Java 线程池核心线程数在运行过程中能修改吗？如何修改？
- 可以通过 `setCorePoolSize(int corePoolSize)` 方法修改核心线程数。

Java 线程池中 shutdown 与 shutdownNow 的区别是什么？
- **`shutdown()`**：停止接收新任务，等待已提交任务执行完毕。
- **`shutdownNow()`**：尝试停止所有活动任务，并返回未执行的任务列表。


::: info ForkJoinPool
ForkJoinPool是Fork/Join框架的核心执行器，它是一个特殊的线程池，用于管理和调度任务。它使用了==工作窃取（Work-Stealing）算法==，这意味着当一个线程完成其分配的任务并且没有更多任务可执行时，它会尝试“窃取”其他线程的任务，从而提高CPU利用率。 具体使用方法参照：[ForkJoinPool使用示例](/java/syntax/thread/pool.md#使用及代码示例)
:::





### synchronized 

synchronized 的本质是通过 监视器锁（Monitor） 来实现对共享资源的访问控制。它可以通过两种形式使用：同步方法和同步代码块。

synchronized的底层实现与Java对象头的`Mark Word`紧密相关

::: info synchronized锁的升级
- 偏向锁: 当一个线程第一次获取锁时， 会将该线程标记为“偏向”状态，后续若该线程再获取该锁，几乎没有开销,。
- 轻量级锁: 当另一个线程尝试获取已经被偏向的锁时，锁会升级为轻量级锁，使用CAS 操作来减少锁竞争的开销。
- 重量级锁: 当 CAS 失败无法获取锁，锁会升级为重量级锁，线程会被挂起，直到锁被释放。
:::




### Locks.Lock

与synchronized的区别：Lock提供了更多的控制权，比如尝试获取锁、定时获取锁、可中断的锁等待等。Lock支持中断等待锁的线程，而synchronized不支持。使用Lock需要更仔细地管理锁的获取和释放。synchronized的有一个锁升级的过程，实测两者性能差异不大。

::: info Lock接口
#### ReentrantLock（可重入锁）

最常用的Lock实现之一，支持公平和非公平策略。

ReentrantLock 其实就是基于 AQS 实现的一个可重入锁，支持公平和非公平两种方式
内部实现依靠一个 state 变量和两个等待队列:同步队列和等待队列。
利用 CAS 修改 state 来争抢锁。
争抢不到则入同步队列等待，同步队列是一个双向链表。
条件 condition 不满足时候则入等待队列等待，是个单向链表。
是否是公平锁的区别在于: 线程获取锁时是加入到同步队列尾部还是直接利用 CAS 争抢锁。

#### ReentrantReadWriteLock

读写锁，分为读锁和写锁。允许多个读线程同时访问，但在写线程访问时会独占锁，即读写互斥，写写互斥，但读读不互斥，适合读多写少的场景。


#### StampedLock

一种更高级的锁，提供了乐观读锁、悲观读锁、写锁以及尝试转换锁状态的能力，使用“邮票”（stamp）来标识锁状态。 
:::





## AQS及相关工具

底层使用到AQS的并发工具:

ReentrantLock：可重入独占锁。
ReentrantReadWriteLock：读写锁，支持更细粒度的并发控制。
FutureTask 和 Phaser 等其他高级同步组件。


### Semaphore

控制同时访问特定资源的线程数。


### CountDownLatch
允许一个或多个线程等待其他线程完成操作。

### CyclicBarrier
让一组线程等待所有线程到达某个屏障后再一起执行。










## 高级并发工具及原理

- **`CountDownLatch`**：倒计数锁，等待多个线程完成。
- **`CyclicBarrier`**：循环屏障，等待多个线程到达一个屏障点。
- **`Semaphore`**：信号量，控制同时访问特定资源的线程数量。


### volatile

volatile是Java中的一个关键字，主要用于修饰变量。它有两个主要作用：

- 保证可见性：当一个变量被声明为volatile时，任何线程对它的修改都会立即写入主内存，而其它线程对这个变量的读取也会直接从主内存中读取最新的值。这确保了多线程环境下变量值的可见性。

- 禁止指令重排序：在JVM中，为了优化性能，编译器和处理器可能会对指令进行重排序。volatile关键字能禁止某些类型的指令重排序，以保证有序性，尤其是对单个变量的读/写操作不会被重排序。









### CompletableFuture

CompletableFuture是对Future的改进，对于真正的异步处理我们希望是可以通过传入回调函数，在Future结束时自动调用该回调函数，这样，我们就不用等待结果

get()方法在Future计算完成之前会一直处在阻塞状态下，阻塞的方式和异步编程的设计理念相违背。isDone()方法容易耗费cpu资源（cpu空转）

- 默认情况下，CompletableFuture 使用 ForkJoinPool.commonPool() 作为执行器，用户也可以指定自定义的线程池。
- 利用了 LockSupport.park/unpark 和 CAS 操作实现高效的线程同步，减少不必要的阻塞等待。

具体使用方式参照：[CompletableFuture代码示例](/java/syntax/thread/tool.md#使用场景及示例-2)




### CAS和原子类

CAS自旋（Compare-And-Swap）是一种在多线程环境下的非阻塞同步技术，主要用于实现轻量级的锁机制，比如自旋锁。

它的基本思想是在硬件层面提供一个原子操作，允许线程在没有获得锁时，不是立刻放弃CPU时间片进入等待状态（如挂起），而是自旋（Spin）一小段时间，反复尝试获取锁，直到成功或达到一定次数后再采取其他策略（如挂起）。.

这种机制特别适合于锁持有时间短且线程竞争不激烈的场景。

::: info CAS & ABA
#### CAS操作
CAS操作包含三个参数：内存位置（V）、预期原值（A）和新值(B)。具体流程如下：
- 比较：首先，它会比较内存位置V的值是否等于预期原值A。
- 交换：如果相等，就将内存位置V的值更新为新值B，并返回true，表示更新成功。
- 失败则重试：如果不相等，说明其他线程已经修改了内存位置V的值，此时不进行任何操作，返回false。然后，执行CAS的线程可以选择重新尝试整个操作，这就是所谓的“自旋”。

#### ABA问题
CAS操作可能会遇到ABA问题，即内存位置的值从A变为B再变回A，但实际发生了变化。为解决这个问题，通常会配合版本号或者使用带有标记的引用（如AtomicStampedReference）。

:::





- **`AtomicInteger`**：原子整数。
- **`AtomicLong`**：原子长整数。
- **`AtomicBoolean`**：原子布尔值。
- **`AtomicReference`**：原子引用。



#### 你使用过 Java 的累加器吗？
- **累加器**：如 `LongAdder` 和 `DoubleAdder`，用于高并发环境下的累加操作。









### ThreadLocal

#### 为什么在 Java 中需要使用 ThreadLocal？
- **ThreadLocal**：用于在每个线程中存储独立的副本，避免线程间的数据共享问题。

#### Java 中的 ThreadLocal 是如何实现线程资源隔离的？
- **ThreadLocal**：每个线程都有一个独立的 ThreadLocalMap，存储线程局部变量。

#### 为什么 Java 中的 ThreadLocal 对 key 的引用为弱引用？
- **弱引用**：防止内存泄漏，当线程结束时，ThreadLocalMap 中的条目可以被垃圾回收。

#### Java 中使用 ThreadLocal 的最佳实践是什么？
- **及时清理**：使用 `remove` 方法及时清理不再使用的 ThreadLocal 变量。
- **避免滥用**：不要过度使用 ThreadLocal，以免增加内存开销。

#### Java 中的 InheritableThreadLocal 是什么？
- **InheritableThreadLocal**：子线程可以继承父线程的 ThreadLocal 变量值。

#### ThreadLocal 的缺点？
- **内存泄漏**：如果不及时清理，可能导致内存泄漏。
- **滥用问题**：过度使用可能导致代码难以理解和维护。

#### 为什么 Netty 不使用 ThreadLocal 而是自定义了一个 FastThreadLocal ？
- **性能优化**：FastThreadLocal 通过减少内存开销和提高访问速度来优化性能。

#### 什么是 Java 的 TransmittableThreadLocal？
- **TransmittableThreadLocal**：扩展了 ThreadLocal，支持在线程间传递线程局部变量，常用于异步调用场景。



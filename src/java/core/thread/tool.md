---

order: 20
title: 并发工具类

---



## AQS理论及应用
AQS（AbstractQueuedSynchronizer，抽象队列同步器）是Java并发包（`java.util.concurrent.locks`）中的一个核心组件，由Doug Lea设计，旨在为实现锁和其他同步组件（如信号量、屏障等）提供基础框架。AQS简化了自定义同步组件的开发过程，通过封装复杂的同步逻辑，如线程的阻塞、唤醒、同步状态管理等。

1. **同步状态管理**：AQS提供了一个整型的同步状态（`state`）变量，用于表示资源是否被占用的状态。
2. **线程阻塞与唤醒**：通过维护一个FIFO的双向链表（CLH队列），管理等待获取锁的线程。当线程尝试获取锁失败时，会被加入到这个队列中并进入等待状态，直到被唤醒。
3. **公平与非公平策略**：支持公平锁和非公平锁的实现，公平策略按照线程等待的顺序分配锁，而非公平策略允许插队，提高吞吐量。
4. **灵活的同步模式**：既支持独占式（如ReentrantLock）也支持共享式（如Semaphore、CountDownLatch）的同步。

::: tip AQS内部原理解析
- **同步状态管理**：使用`volatile`关键字保证状态可见性，通过CAS（Compare and Swap）操作实现状态的无锁原子更新。
- **队列管理**：内部维护一个双向链表（Node），每个Node代表一个等待的线程。Node包含前驱和后继指针，以及线程状态等信息。
- **等待与唤醒机制**：基于LockSupport工具类，通过park()和unpark()方法实现线程的阻塞与唤醒。
- **模板方法设计模式**：AQS定义了一系列protected方法，子类通过重写这些方法来实现特定的同步逻辑。
:::


使用AQS通常意味着你需要创建一个它的子类，并重写一些关键方法。以下是一个简化的AQS子类示例，实现一个简单的自旋锁：

```java
public class MySpinLock extends AbstractQueuedSynchronizer {
    protected boolean tryAcquire(int acquires) {
        return compareAndSetState(0, 1);
    }

    protected boolean tryRelease(int releases) {
        setState(0);
        return true;
    }

    public void lock() {
        acquire(1);
    }

    public void unlock() {
        release(1);
    }
}
```

**底层使用到AQS的并发工具**:
- `ReentrantLock`：可重入独占锁。
- `ReentrantReadWriteLock`：读写锁，支持更细粒度的并发控制。
- `CountDownLatch`：允许一个或多个线程等待其他线程完成操作。
- `CyclicBarrier`：让一组线程等待所有线程到达某个屏障后再一起执行。
- `Semaphore`：控制同时访问特定资源的线程数。
- `FutureTask` 和 `Phaser` 等其他高级同步组件。


**实际开发中需要使用AQS吗?**
在实际开发中，直接使用AQS的机会较少，因为Java并发包已经提供了很多基于AQS实现的高级同步工具。开发者通常会直接使用如`ReentrantLock`、`Semaphore`等现成的同步工具。但是，如果你需要实现自定义的同步逻辑，或者现有的工具无法满足特定需求时，深入理解和使用AQS来构建自定义同步组件是非常有价值的。AQS提供了一个强大的框架，使得编写高性能、可靠的并发代码变得更加容易。




## Semaphore
信号量（Semaphore）是并发编程中一种用于控制多个线程访问共享资源的同步工具。它维护了一个许可集，线程可以通过获取许可来访问资源，执行完毕后释放许可，使得其他线程有机会访问。信号量可以用来限制同时访问特定资源的线程数，或者用来实现某些线程间的同步。

### 构造函数

在Java中，`Semaphore`提供了两种主要的构造方式，用于初始化信号量的许可数量以及（在某些情况下）是否公平策略：

::: info Semaphore的创建方式
#### 1. 无公平性参数的构造函数
- **非公平模式**（默认）：在这种模式下，线程获取许可的操作相对更快，因为不保证按照线程等待的顺序分配许可。这可能导致某些线程频繁获取许可，而其他线程长时间等待。适用于对吞吐量有较高要求，且对线程调度公平性要求不高的场景。
```java
public Semaphore(int permits)
```

- **permits**: 这是Semaphore初始化时的许可数量。它表示同一时刻可以有多少个线程同时持有该信号量的许可并执行受保护的代码段。如果`permits`设置为1，那么Semaphore表现得就像一个二进制信号量，即一次只允许一个线程通过。

#### 2. 含有公平性参数的构造函数
- **公平模式**：在这种模式下，线程按照它们请求许可的顺序来获取许可，等待时间最长的线程将优先获得许可。这可以避免饥饿现象，但可能会因为维持线程等待顺序的额外开销而降低整体性能。适用于对线程调度公平性要求较高的场景，即使是以牺牲一定的吞吐量为代价
```java
public Semaphore(int permits, boolean fair)
```

- **permits**: 同上，表示初始的许可数量。
- **fair**: 这是一个布尔值参数，用于指明是否启用公平策略。如果设置为`true`，则等待时间最长的线程会优先获得许可（公平模式）。如果为`false`（默认），则不保证等待最久的线程一定能先获取许可，这可能会导致某些线程饥饿（非公平模式）。公平策略会降低吞吐量，因为它需要额外的同步开销来维护线程的等待顺序。


```java
// 创建一个非公平的Semaphore，初始许可数为3
Semaphore nonFairSemaphore = new Semaphore(3);

// 创建一个公平的Semaphore，初始许可数为3，等待线程按照FIFO顺序获取许可
Semaphore fairSemaphore = new Semaphore(3, true);
```
:::

### 常用方法

在Java中，信号量由`java.util.concurrent.Semaphore`类表示，主要方法包括：

- **acquire()**：尝试获取一个许可，如果当前没有可用许可，则线程将被阻塞，直到其他线程释放许可。
- **tryAcquire()**：尝试获取一个许可，如果当前没有可用许可，立即返回`false`，不会阻塞线程。
- **release()**：释放一个许可，增加信号量的许可数，可能唤醒一个正在阻塞的线程。
- **availablePermits()**：返回当前可用的许可数。


### 使用场景及示例

::: tip 使用场景
- **资源计数**：控制同时访问数据库连接数、文件句柄数等有限资源。
- **池化技术**：管理线程池、连接池等，限制同时运行的任务数。
- **同步屏障**：可以作为一种灵活的同步机制，实现类似于CyclicBarrier的功能。
:::

**使用流程**:
1. **初始化信号量**：创建一个`Semaphore`对象，指定初始的许可数量。
2. **获取许可**：在需要访问资源的线程中调用`acquire()`方法获取许可，如果没有许可可获取则阻塞。
3. **访问资源**：获得许可的线程可以安全地访问共享资源。
4. **释放许可**：访问完资源后，调用`release()`方法释放许可，使得其他等待的线程可以继续。


假设我们有一个场景，需要限制同时访问数据库的线程数不超过5个。

```java
import java.util.concurrent.Semaphore;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SemaphoreExample {
    
    private static final int THREAD_COUNT = 20;
    private static final Semaphore semaphore = new Semaphore(5); // 最多允许5个线程同时运行
    
    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(THREAD_COUNT);
        
        for (int i = 0; i < THREAD_COUNT; i++) {
            executor.submit(() -> {
                try {
                    semaphore.acquire(); // 获取许可
                    System.out.println("Thread " + Thread.currentThread().getName() + " is accessing database.");
                    Thread.sleep(1000); // 模拟数据库访问操作
                    System.out.println("Thread " + Thread.currentThread().getName() + " finished.");
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.out.println("Thread " + Thread.currentThread().getName() + " interrupted.");
                } finally {
                    semaphore.release(); // 释放许可
                }
            });
        }
        
        executor.shutdown();
    }
}
```

在这个示例中，我们创建了一个最多允许5个线程同时访问数据库的信号量。20个线程尝试访问数据库，但每次只有5个线程能够获得许可并执行，其余线程将等待，直到有线程释放许可。这样就有效地控制了并发访问的数量，避免了资源的过度竞争。


### 底层实现原理

Semaphore的底层实现原理基于Java并发包中的`AbstractQueuedSynchronizer`（AQS）框架。AQS是一个抽象类，它为实现依赖于先进先出（FIFO）等待队列的阻塞锁和相关同步器（信号量、栅栏等）提供了一个框架。Semaphore利用了AQS的底层机制来管理一个许可集（permits）和一个线程等待队列。

**核心组件**：

1. **State**: AQS内部维护一个整型变量`state`，在Semaphore中，这个变量表示当前可用的许可数。初始化Semaphore时，`state`会被设置为传入的许可数。

2. **acquire()和release()**: Semaphore通过重写AQS的`tryAcquireShared()`和`tryReleaseShared()`方法来实现`acquire()`和`release()`操作。如下：

    - **acquire()**: 实际上是调用AQS的`acquireSharedInterruptibly()`方法，尝试从Semaphore获取一个许可，如果当前`state`（即许可数）大于0，那么`state`减1，并且线程获得许可；如果许可不足，线程则被构造为Node节点加入到AQS的等待队列中，并进入等待状态。
    
    - **release()**: 对应的是AQS的`releaseShared()`方法，它会增加许可数（`state`），并唤醒等待队列中的一个或多个线程（如果有线程在等待）。

3. **等待队列**: AQS维护了一个双向链表作为线程的等待队列。当线程因无法获取许可而需要等待时，它会被构造成Node节点并插入队列。这个队列是FIFO的，保证了线程的公平性（如果Semaphore被配置为公平模式的话）。

4. **同步状态**: AQS还通过内置的锁机制来保护`state`变量的修改，确保多线程环境下的操作是线程安全的。

**公平与非公平策略**：

- **公平模式**: 如果Semaphore被设置为公平模式，那么线程在尝试获取许可时会检查是否有比自己更早到达的线程已经在等待。如果有，新来的线程就会排队等待，保证先到的线程优先获取许可。
  
- **非公平模式**: 非公平模式下，新来的线程在尝试获取许可时可能会直接获取，即使有其他线程已经在等待。这种模式下，尽管牺牲了一定的公平性，但通常能提高吞吐量。





## CyclicBarrier

`CyclicBarrier`是Java并发编程中一个同步工具类，它允许一组线程相互等待，直到所有线程都到达一个共同的屏障点（barrier point），然后所有线程一起继续执行。这个名字“Cyclic”意味着这个屏障可以被重置并重复使用多次，而不仅仅是一次性使用。它在多线程协作的场景中特别有用，比如在并行计算中，当需要等待所有任务完成后再进行下一步操作时。

### 构造函数

CyclicBarrier有几种构造方法，主要的构造方法如下：

- `CyclicBarrier(int parties)`：创建一个新的 CyclicBarrier，它将在给定数量的参与线程到达屏障时启动，不带额外的Runnable操作。
- `CyclicBarrier(int parties, Runnable barrierAction)`：创建一个新的 CyclicBarrier，它将在给定数量的参与线程到达屏障时启动，并在每次屏障动作完成后执行给定的Runnable操作。这个Runnable会在所有线程到达屏障之后，但在释放它们之前执行，可以用于初始化下一个阶段的工作。

::: tip 构造函数参数
- `parties`：表示需要同步的线程数量，即屏障需要等待的线程总数。
- `count`：初始化时等于`parties`，每当一个线程调用`await()`方法时，`count`减1，当`count`减至0时，所有等待的线程被释放。
:::


### 常用方法
- `await()`：线程调用此方法告诉CyclicBarrier它已经到达屏障。
    ::: info await()方法详解
    - 当线程调用`await()`时，它首先会获取`lock`，然后将`count`减1。
    - 如果`count`减至0，表示所有线程已到达屏障，这时：
        - 如果设置了`barrierAction`（构造函数中的Runnable），则先执行这个动作。
        - 唤醒所有等待在`condition`上的线程，然后重置`count`为`parties`，准备下一轮等待。
    - 如果`count`不为0，表示还有线程未到达，当前线程则在`condition`上等待。
    :::
- `reset()`：重置屏障，将`count`恢复到初始值`parties`，`generation`的值会递增，如果线程当前正阻塞在`await()`上，则它们将收到`BrokenBarrierException`异常并退出阻塞。
- `getNumberWaiting()`：返回当前在屏障上等待的线程数量。
- `isBroken()`：查询屏障是否损坏，即是否有线程在等待时被中断或超时。


### 使用场景及示例

**使用场景**
1. **分布式计算中的数据聚合**：在分布式系统中，可以使用CyclicBarrier来确保所有节点的数据处理完成后再进行数据汇总。
2. **并行任务的阶段划分**：当一个任务可以分解为多个子任务并行执行时，可以在每个子任务完成之后使用CyclicBarrier等待所有子任务完成，然后进行下一阶段的操作。
3. **游戏中的同步**：在网络游戏中，可以用来同步玩家的动作，确保所有玩家都准备好后才开始新的一轮游戏。


假设需要并行处理一个大文件的不同部分，然后合并处理结果。我们可以使用CyclicBarrier来确保所有部分都处理完毕后再进行结果合并：

```java
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class FileProcessor {

    // 假设我们要处理的文件被切分为4个部分
    private static final int PARTITIONS = 4;
    private static final CyclicBarrier barrier = new CyclicBarrier(PARTITIONS, new Runnable() {
        @Override
        public void run() {
            // 所有分区处理完毕，这里是合并结果的逻辑
            System.out.println("所有分区处理完成，开始合并结果...");
        }
    });

    public static void main(String[] args) {
        for (int i = 0; i < PARTITIONS; ++i) {
            int partitionId = i;
            new Thread(new Runnable() {
                @Override
                public void run() {
                    processPartition(partitionId);
                }
            }).start();
        }
    }

    private static void processPartition(int partitionId) {
        // 模拟处理文件分区的逻辑
        System.out.println("线程 " + Thread.currentThread().getName() + " 开始处理分区 " + partitionId);
        try {
            Thread.sleep((long) (Math.random() * 1000)); // 模拟处理时间
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("线程 " + Thread.currentThread().getName() + " 完成处理分区 " + partitionId);

        try {
            // 处理完成后等待其他线程
            barrier.await();
        } catch (InterruptedException | BrokenBarrierException e) {
            e.printStackTrace();
        }
    }
}
```
在这个例子中，我们创建了一个CyclicBarrier，参数为4，意味着我们需要等待4个线程（对应文件的4个分区）全部完成处理。当所有线程都调用了`barrier.await()`后，屏障打开，执行我们定义的Runnable，这里是合并处理结果的逻辑。每个线程代表处理文件的一个分区，处理完自己的分区后调用`await()`等待，直到所有线程都完成，然后合并结果的操作被执行。这样就确保了文件的所有分区被并行高效处理，并且只有当所有分区都处理完毕后才会进行结果的合并。


::: tip 注意事项
- 当线程在等待过程中被中断，或者屏障被`reset()`方法重置，`count`不会归零，`generation`会递增，同时抛出`BrokenBarrierException`异常，告知等待线程屏障已损坏。
- 如果某个线程在等待时超时（尽管CyclicBarrier本身不直接支持超时），那么它也会导致屏障被破坏。
- 使用CyclicBarrier时，要考虑异常处理，特别是在Runnable中，确保异常不会导致整个协作进程失败。
:::


### 底层实现原理
CyclicBarrier的底层实现主要依赖于Java并发包中的AbstractQueuedSynchronizer（AQS）框架，以及`ReentrantLock`和`Condition`对象来进行线程间的同步和等待通知机制。

在`CyclicBarrier`类中，`generation`、`lock`和`condition`是几个关键的内部组件，它们共同协作以实现CyclicBarrier的同步功能:

1. **lock**: 这是一个`ReentrantLock`对象，用于在多线程环境下保护CyclicBarrier内部状态的修改，确保状态变更的原子性和线程安全性。当线程调用`await()`方法时，首先会尝试获取这个锁，从而确保对计数器（`count`）和其他状态的修改不会发生冲突。

2. **condition**: 与`lock`关联的一个`Condition`对象，用于在线程需要等待时挂起线程，直到被其他线程唤醒。当调用`await()`的线程发现还有其他线程未到达屏障时，它会在这个`condition`上等待，直到被释放。

3. **generation**: 这是一个整数型变量，用来跟踪CyclicBarrier的使用周期。每次CyclicBarrier成功完成一次所有线程的汇聚（即所有线程到达屏障并继续执行），或者当屏障被破坏（例如，有线程中断或超时导致`BrokenBarrierException`被抛出），`generation`的值会递增。它是一个关键的机制，用于区分不同轮次的等待周期，确保线程不会错误地从上一轮的等待中醒来。




## CountDownLatch

`CountDownLatch`允许一个或多个线程等待其他线程完成一系列操作后再继续执行。这是一个典型的同步辅助类，常用于主线程需要等待多个子线程完成后再进行下一步操作的场景。

`CountDownLatch`只有一个构造函数：

```java
public CountDownLatch(int count)
```
- `count`: 整型参数，表示需要等待的计数次数。初始化时设置的计数值，每当调用`countDown()`方法，这个值就减1，直到减至0时，所有在`await()`方法上等待的线程会被释放。

**常用方法**：
- **countDown()**: 减少计数器的值。每次调用此方法，内部计数器`count`减1。

- **await()**: 使当前线程等待，直到计数器的值变为零，然后继续执行。
 `await(long timeout, TimeUnit unit)`允许等待指定的时间后超时返回。

- **getCount()**： 返回当前计数器的值。


代码示例：假设有一个应用程序启动时需要完成多个初始化任务，主程序需要等待所有初始化任务完成后才能继续运行。

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CountDownLatchExample {

    public static void main(String[] args) throws InterruptedException {
        // 初始化计数器，假设我们有3个初始化任务
        CountDownLatch latch = new CountDownLatch(3);
        
        ExecutorService executor = Executors.newFixedThreadPool(3);

        // 提交任务到线程池
        for (int i = 0; i < 3; i++) {
            final int taskId = i;
            executor.submit(() -> {
                doTask(taskId);
                // 每个任务完成后，计数器减1
                latch.countDown();
            });
        }
        
        // 主线程等待所有任务完成
        latch.await();
        System.out.println("所有初始化任务已完成，主程序继续执行...");

        executor.shutdown();
    }

    private static void doTask(int taskId) {
        System.out.println("任务 " + taskId + " 开始执行...");
        try {
            Thread.sleep((long) (Math.random() * 1000));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("任务 " + taskId + " 执行结束.");
    }
}
```

::: tip CountDownLatch底层实现原理
`CountDownLatch`的底层实现同样基于`AbstractQueuedSynchronizer`（AQS）。它通过维护一个内部状态（state）来记录剩余的计数。`countDown()`方法调用会减少这个状态值，而`await()`方法会让调用它的线程阻塞，直到状态值变为0。当状态值为0时，所有在`await()`上阻塞的线程会被唤醒。

与`Semaphore`和`CyclicBarrier`不同，`CountDownLatch`是一次性的，一旦计数到达零，就不能再重置，也无法再次使用。这是它与`CyclicBarrier`的主要区别之一，后者是可重置的同步屏障。
:::



## CompletableFuture

`CompletableFuture` 是 Java 8 引入的一个非常强大的异步编程工具，它是 `Future` 接口的一个扩展，不仅支持异步执行任务，还提供了丰富的组合能力，如链式调用、转换、组合多个异步操作等，使得异步编程更加灵活和高效。

::: tip 为什么需要CompletableFuture
CompletableFuture是对Future的改进
- get()方法在Future计算完成之前会一直处在阻塞状态下，阻塞的方式和异步编程的设计理念相违背。
- isDone()方法容易耗费cpu资源（cpu空转）

对于真正的异步处理我们希望是可以通过传入回调函数，在Future结束时自动调用该回调函数，这样，我们就不用等待结果
:::



### 特性及原理
1. **观察者模式**：`CompletableFuture` 内部使用了观察者模式，通过一个链表结构（`Completion` 链表）来存储一系列待执行的任务（即观察者）。当一个任务完成时，它会触发链表中的下一个任务开始执行。

2. **非阻塞机制**：与传统的 `Future` 不同，`CompletableFuture` 提供了非阻塞的 API，如 `thenApply`, `thenAccept`, `thenCompose` 等，这些方法可以在前一个阶段完成后自动执行后续操作，而不需要显式地调用阻塞方法如 `get()`。

3. **任务调度**：`CompletableFuture` 支持自定义执行器（Executor），允许用户指定任务在哪个线程池中执行，从而更好地控制并发策略和资源分配。

4. **状态管理**：它内部维护了任务的状态，包括 `NEW`（新建）、`COMPLETING`（完成中）、`NORMAL`（正常完成）、`EXCEPTIONAL`（异常完成）等，使用 CAS（Compare and Swap）操作保证状态变更的原子性。

::: tip 底层原理浅析
- **栈结构**：内部维护了一个栈结构来存储待执行的函数，这些函数会在前序任务完成后按顺序执行。
- **线程池**：默认情况下，`CompletableFuture` 使用 `ForkJoinPool.commonPool()` 作为执行器，用户也可以指定自定义的线程池。
- **非阻塞同步**：利用了 `LockSupport.park/unpark` 和 CAS 操作实现高效的线程同步，减少不必要的阻塞等待。
:::
`CompletableFuture` 提供了一种灵活、高效的异步编程模型，非常适合构建响应式、高性能的应用程序。


### 创建方式

**如何创建CompletableFuture**

1. **静态方法创建**
   - `CompletableFuture<Void> runAsync(Runnable runnable)`：异步执行给定的Runnable任务，没有返回值。
   - `CompletableFuture<Void> runAsync(Runnable runnable, Executor executor)` : 
    Executor表示执行异步任务的线程池或执行器

   - `CompletableFuture<U> supplyAsync(Supplier<U> supplier)`：异步执行Supplier提供的任务并返回一个结果。
   - `CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)`

   ::: tip
    异步任务在 `CompletableFuture.supplyAsync` 等方法被调用后立即启动执行
   :::

2. **直接创建实例**
   - 虽然可以通过构造函数创建一个已完成或异常的 CompletableFuture，但更常见的是使用上面的静态方法。
   ```java
   CompletableFuture<Void> future = new CompletableFuture<>();
   ```

::: info   CompletableFuture和线程池说明
1. **默认线程池**：
   - 如果在创建`CompletableFuture`时不提供特定的`Executor`(线程池)，那么对于大多数`async`方法（如`supplyAsync(Supplier<U> supplier)`或`runAsync(Runnable runnable)`），`CompletableFuture`会默认使用`ForkJoinPool.commonPool()`作为执行异步任务的线程池。这个线程池是Java Fork/Join框架的一部分，适用于那些可以被分解为更小任务的并行计算场景。

2. **自定义线程池**：
   - 你可以通过向`async`方法提供一个`Executor`参数来自定义线程池。例如，`supplyAsync(Supplier<U> supplier, Executor executor)`或`runAsync(Runnable runnable, Executor executor)`。这样，你就可以根据应用需求配置线程池的大小、队列策略等，以达到最优的资源利用和性能。

3. **方法与线程池的关系**：
   - `thenApply`, `thenAccept`, `thenRun`, `thenCompose`, `thenCombine`, `thenAcceptBoth`, `applyToEither`, `acceptEither`, `runAfterEither`等方法，它们是在前一个阶段完成后的继续处理步骤，通常不会直接关联到特定的线程池，而是沿用之前阶段使用的线程池。如果前一阶段使用的是默认线程池，那么这些方法也会使用相同的线程池，除非在链式调用中指定了不同的`Executor`。
   
   - `exceptionally` 和 `handle` 方法用于处理异常情况，它们同样遵循上述规则，使用前一阶段的线程池。

4. **特殊方法**：
   - `complete`, `completeExceptionally`, `cancel` 这些方法用于手动完成、异常完成或取消`CompletableFuture`，它们通常由主线程或其他控制流直接调用，而不是在某个特定线程池中执行。

5. **组合与转换**：
   - 在进行多个`CompletableFuture`的组合操作时（如`allOf`, `anyOf`），这些操作本身不直接关联到线程池，它们更多是逻辑上的组合，实际执行还是依赖于构成这些组合的各个`CompletableFuture`所使用的线程池。


当在自定义线程池中执行的任务里进一步调用`thenRunAsync`等方法，如果没有特别指定`Executor`，那么这些方法确实会默认使用`ForkJoinPool.commonPool()`。这是因为这些`then...Async`方法自身没有继承前序阶段的`Executor`设置，除非显式地为它们提供了线程池。

例如，如果你有如下代码结构：

```java
Executor customExecutor = Executors.newFixedThreadPool(10);
CompletableFuture.supplyAsync(someSupplier, customExecutor)
                 .thenRunAsync(() -> {/* 这里默认使用ForkJoinPool.commonPool() */});
```

在这个例子中，尽管初始的`supplyAsync`使用了自定义的`customExecutor`，但接下来的`thenRunAsync`没有再次指定`Executor`，因此它会退回到使用默认的`ForkJoinPool.commonPool()`。

为了避免这种情况，确保链式调用中每个需要特定线程池的`then...Async`方法都明确指定了相同的自定义`Executor`，例如：

```java
Executor customExecutor = Executors.newFixedThreadPool(10);
CompletableFuture.supplyAsync(someSupplier, customExecutor)
                 .thenRunAsync(() -> {/* 这里也使用自定义线程池 */}, customExecutor);
```

这样，整个异步任务链都会在你期望的线程池中执行。
:::



### 常用方法
**组合与转换**

1. **`thenApply(Function<? super T,? extends U> fn)`**
   - 当前阶段完成后，将结果传递给fn函数处理，并返回一个新的CompletableFuture，用于获取fn处理后的结果。

2. **`thenAccept(Consumer<? super T> action)`**
   - 当前阶段完成后，执行给定的action消费上一阶段的结果，无返回值。

3. **`thenCompose(Function<? super T,? extends CompletionStage<U>> fn)`**
   - 当前阶段完成后，将结果传递给fn函数，fn函数应该返回一个新的CompletableFuture，然后新阶段的结果就是这个CompletableFuture的结果。

4. **`thenCombine(CompletionStage<? extends U> other, BiFunction<? super T,? super U,? extends V> fn)`**
   - 当当前和另一个CompletionStage都完成后，将两个结果传递给fn函数处理，并返回一个新的CompletableFuture。

5. **whenComplete** ：用于注册一个回调函数，该函数会在 CompletableFuture 的异步操作完成（不论成功还是因为异常而完成）时执行
    ```java
    // 使用whenComplete，无论结果如何都会执行
    future.whenComplete((result, throwable) -> {
        if (throwable == null) {
            System.out.println("计算结果: " + result);
        } else {
            System.err.println("发生了异常: " + throwable.getMessage());
        }
        // executor.shutdown(); // 确保执行器在完成时关闭
    });
    // 注意当回调函数执行时，它不会改变原始 CompletableFuture 的完成状态或结果
    ```


**异常处理**

1. **`exceptionally(Function<Throwable,? extends T> fn)`**
   - 如果当前阶段出现异常，则使用fn函数处理异常，并返回一个新的CompletableFuture用于获取处理后的结果。

2. **`handle(BiFunction<? super T, Throwable, ? extends U> fn)`**
   - 无论当前阶段是否成功完成，都会执行fn函数。如果成功，第一个参数是结果，第二个参数是null；如果失败，第一个参数是null，第二个参数是异常。

**同步等待**

1. **`join()`**
   - 阻塞当前线程，直到CompletableFuture完成，获取结果或抛出异常。

2. **`get()`**
   - 类似于join()，但可以设置超时时间，通过get(long timeout, TimeUnit unit)方法。

**其他方法**

- **`complete(T result)`** 和 **`completeExceptionally(Throwable ex)`**
   - 手动完成 CompletableFuture，分别用于设置成功结果或异常。

- **`isDone()`** 和 **`isCancelled()`**
   - 判断 CompletableFuture 是否已完成或已被取消。

::: info 与其他并发工具的比较

- **与Future的关系**：`CompletableFuture` 是 `Future` 的扩展，增加了链式调用、组合操作等功能，而 `Future` 主要用于获取异步计算的结果，功能较为单一。
  
- **与CountDownLatch相似之处**：两者都可以用来等待一个或多个任务的完成，但 `CompletableFuture` 更加灵活，提供了更多的控制流操作，而 `CountDownLatch` 主要用于简单地等待计数归零，以触发后续操作。

- **与Promise类似**：在JavaScript中，`Promise` 是一种处理异步操作的模式，它与 `CompletableFuture` 在设计理念上非常相似，都支持链式调用、错误处理等机制，但它们分别属于Java和JavaScript的生态。
:::
`CompletableFuture` 结合了多种并发工具的优点，提供了高度灵活的异步编程模型，适合构建复杂的数据流处理和异步任务链。



### 使用场景及示例

1. **异步处理**：当一个操作很耗时，如数据库查询、网络请求等，可以使用 `CompletableFuture` 将其异步执行，提高整体响应速度。

2. **任务链**：通过 `thenApply`, `thenCompose` 等方法，可以轻松构建任务间的依赖关系，实现任务的链式调用。

3. **并行处理与合并**：利用 `allOf` 和 `anyOf` 方法，可以并行执行多个任务，前者在所有任务都完成时获取结果，后者在任何一个任务完成时获取结果。

4. **错误处理**：通过 `exceptionally` 或 `handle` 方法，可以优雅地处理异步操作中可能出现的异常。


假设我们有两个异步任务，一个是获取用户信息，另一个是获取用户订单信息，我们可以这样使用 `CompletableFuture`：

```java
public class CompletableFutureExample {

    public static CompletableFuture<UserInfo> getUserInfo(String userId) {
        return CompletableFuture.supplyAsync(() -> {
            // 模拟从数据库获取用户信息
            return new UserInfo(userId, "John Doe");
        });
    }

    public static CompletableFuture<Order> getOrder(String orderId) {
        return CompletableFuture.supplyAsync(() -> {
            // 模拟从数据库获取订单信息
            return new Order(orderId, "Books");
        });
    }

    public static void main(String[] args) {
        String userId = "123";
        String orderId = "456";

        CompletableFuture<Void> combinedFuture = CompletableFuture.allOf(
                getUserInfo(userId).thenAccept(userInfo -> System.out.println("User Info: " + userInfo)),
                getOrder(orderId).thenAccept(order -> System.out.println("Order: " + order))
        );

        combinedFuture.join(); // 确保所有任务完成
    }
}
```


传统顺序执行与CompletableFuture执行效率的比较示例：
```java
public class CompletableFutureMallDemo {
    private static final List<NetMall> NET_MALLS = Arrays.asList(new NetMall("jd"), new NetMall("taobao"), new NetMall("dangdang"));

    /**
     * Sequentially fetches prices from each online mall.
     * @param malls List of online malls
     * @param productName Product name to fetch price for
     * @return List of formatted price information
     */
    public static List<String> sequentialPriceFetch(List<NetMall> malls, String productName) {
        return malls.stream()
                .map(mall -> String.format("《%s》in %s price is %.2f", productName, mall.getNetMallName(), mall.calcPrice(productName)))
                .collect(Collectors.toList());
    }

    /**
     * Fetches prices concurrently using CompletableFuture for each online mall.
     * This method improves performance by executing queries in parallel.
     * @param malls List of online malls
     * @param productName Product name to fetch price for
     * @return List of formatted price information after all futures complete
     */
    public static List<String> concurrentPriceFetch(List<NetMall> malls, String productName) {
        return malls.stream()
                .map(mall -> CompletableFuture.supplyAsync(() -> 
                        String.format("《%s》in %s price is %.2f", productName, mall.getNetMallName(), mall.calcPrice(productName)))
                )
                .collect(Collectors.toList())
                .stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        long startTimeSequential = System.currentTimeMillis();
        List<String> pricesSequential = sequentialPriceFetch(NET_MALLS, "masql");
        printPrices(pricesSequential, startTimeSequential, "Sequential");

        long startTimeConcurrent = System.currentTimeMillis();
        List<String> pricesConcurrent = concurrentPriceFetch(NET_MALLS, "mysql");
        printPrices(pricesConcurrent, startTimeConcurrent, "Concurrent");
    }

    private static void printPrices(List<String> prices, long startTime, String mode) {
        for (String priceInfo : prices) {
            System.out.println(priceInfo);
        }
        long endTime = System.currentTimeMillis();
        System.out.printf("------costTime: %d 毫秒 for %s query\n", (endTime - startTime), mode);
    }
}

@AllArgsConstructor
@NoArgsConstructor
@Data
class NetMall {
    private String netMallName;

    public double calcPrice(String productName) {
        try {
            TimeUnit.SECONDS.sleep(1); // Simulate network delay or computation time
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Properly handle interrupted exception
        }
        return ThreadLocalRandom.current().nextDouble() * 2 + productName.charAt(0); // Random price calculation
    }
}
```
- 在 `concurrentPriceFetch` 方法中，通过 `CompletableFuture.supplyAsync` 将每个在线商城的价格查询操作包装成异步任务，充分利用多核CPU资源，提高查询效率。
- 使用 `map` 和 `join` 方法将 `CompletableFuture<String>` 转换和收集为最终价格信息列表，确保所有异步操作完成后再继续执行后续逻辑。






## ThreadLocal

ThreadLocal，顾名思义，为线程本地变量。其核心在于为每个线程创建一个单独的变量副本，即使多个线程访问的是同一个ThreadLocal实例，它们看到的也是各自线程内部的独立副本，从而实现了线程间数据的隔离。

::: info 使用场景
1. **数据库连接或Session管理**：在Web应用中，为每个请求线程绑定一个数据库连接或用户Session，确保事务处理的隔离性。
2. **线程上下文信息传递**：如在日志记录中，每个线程记录自己的日志信息，避免了日志信息交错。
3. **避免参数传递的复杂性**：在方法调用链路长的情况下，避免通过参数传递某些不变的上下文信息。
4. **缓存线程相关的对象**：例如`SimpleDateFormat`等非线程安全类的实例，每个线程分配一个，避免同步开销。
:::

**使用代码示例**:

```java
// 定义ThreadLocal变量
public static final ThreadLocal<DateFormatter> formatter = new ThreadLocal<DateFormatter>() {
    @Override
    protected DateFormatter initialValue() {
        return new DateFormatter("yyyy-MM-dd");
    }
};

// 使用
public void processDate(String dateStr) {
    DateFormatter formatterInstance = formatter.get(); // 获取当前线程的DateFormatter实例
    Date date = formatterInstance.parse(dateStr);
    System.out.println(date);
}

// 注意清理，防止内存泄漏
public void cleanup() {
    formatter.remove(); // 移除当前线程的ThreadLocal变量
}
```

::: tip 注意事项
- **内存泄漏**：如果线程长时间存活且未调用`remove()`方法，可能导致ThreadLocalMap中的Entry引用不被垃圾回收，引发内存泄漏。
- **非线程安全**：虽然ThreadLocal可以避免多线程间的直接数据竞争，但其内部存储的对象本身仍需考虑线程安全问题。
- **使用范围**：适用于线程间不需要共享数据，且数据生命周期与线程相同的场景。

ThreadLocal是一种强大且灵活的工具，用于解决多线程环境下数据隔离和共享的问题。但使用时需谨慎管理资源，以防止潜在的内存泄露问题。
:::



### 底层实现原理

ThreadLocal的工作原理主要依赖于其内部类`ThreadLocalMap`，这是一个定制化的哈希映射，键是ThreadLocal实例本身，值则是线程本地存储的变量副本。

::: tip threadLocals和ThreadLocalMap
每个线程的`Thread`类中都有一个名为`threadLocals`的成员变量，类型为`ThreadLocal.ThreadLocalMap`，用来存储该线程对应的ThreadLocal变量副本。

当线程首次调用ThreadLocal的`set()`方法设置值时，如果该线程的`ThreadLocalMap`尚未初始化，则会创建一个新的`ThreadLocalMap`实例，并将值设置进去。之后，每次调用`get()`方法时，都会从当前线程的`ThreadLocalMap`中取出对应的值。
:::


**ThreadLocal的工作原理**：

1. **ThreadLocal实例化**：
   当创建ThreadLocal实例时，实际上只是创建了一个普通的对象。真正与线程绑定的变量存储在每个线程的ThreadLocalMap中。

2. **get方法**：
   - 首先，通过`Thread.currentThread()`获取当前线程。
   - 然后，从当前线程的`threadLocals`字段中获取ThreadLocalMap（每个线程都会有一个这样的字段）。
   - 在ThreadLocalMap中，使用当前ThreadLocal实例作为键查找对应的值。如果找到，则返回；如果没有找到且提供了initialValue方法，则调用initialValue方法初始化值并存入。

3. **set方法**：
   - 同样获取当前线程和其ThreadLocalMap。
   - 将当前ThreadLocal实例作为键，要设置的值作为值，存入或更新到ThreadLocalMap中。

4. **initialValue方法**：
   这是一个受保护的方法，用户可以通过覆盖它来指定线程本地变量的初始值。默认实现返回null。


::: info ThreadLocalMap实现细节
==ThreadLocalMap实际上是一个简化版的哈希映射，它并没有实现Map接口，而是直接在内部实现了一套类似Map的功能==，主要用于存储ThreadLocal对象作为键（Key），以及对应的线程局部变量值作为值（Value）。

**数据结构与成员变量**

ThreadLocalMap的内部数据结构主要是一个==Entry数组==，这个数组的大小是2的幂，初始容量是16。Entry是ThreadLocalMap中的静态内部类，它代表了映射表中的每一个键值对项。每个Entry继承了WeakReference类（在Java 8及以前版本中），但在Java 9及以后版本中改为直接持有ThreadLocal的强引用，以解决潜在的内存泄漏问题，同时增加了对null的特殊处理。Entry结构大致如下：

```java
static class Entry extends WeakReference<ThreadLocal<?>> {
    /** The value associated with this ThreadLocal. */
    Object value;
    
    Entry(ThreadLocal<?> k, Object v) {
        super(k);
        value = v;
    }
}
```
在ThreadLocalMap中，每个Entry的键实际上就是ThreadLocal对象本身。具体来说，每个Entry实例包含两个主要部分：

1. **键（Key）**：这个键是指向ThreadLocal实例的引用。在JDK 8及以前的版本中，这个引用是WeakReference类型的（弱引用ThreadLocal对象），而在JDK 9及之后，为了减少内存泄露的风险，改为了直接持有ThreadLocal的强引用。

2. **值（Value）**：这个值是ThreadLocal所关联的线程局部变量的具体数据，也就是通过ThreadLocal的set方法设置的值。

所以，当提到“Entry的键”时，实际上指的就是用来作为查找依据的那个ThreadLocal实例。当线程尝试通过某个ThreadLocal实例获取其关联的值时，ThreadLocalMap会使用这个ThreadLocal实例作为查找键，在其内部的Entry数组中定位到相应的Entry，从而获取到对应的值。



**源码分析**：

1. **初始化**：ThreadLocalMap通常在首次调用ThreadLocal的set或get方法时，由当前线程自动创建。

2. **存储（set方法）**：在set方法中，首先通过当前线程获取或创建ThreadLocalMap，然后尝试插入或更新Entry。如果存在哈希冲突（两个不同的ThreadLocal对象计算出相同的索引），它会通过线性探测法找到下一个空位或匹配的ThreadLocal。

3. **读取（get方法）**：get方法同样先获取当前线程的ThreadLocalMap，然后根据ThreadLocal实例查找对应的Entry。如果找到了对应的Entry但发现ThreadLocal对象已经被回收（在Java 8及以前），则会进行一次“清除”操作，即移除这个无效的Entry并尝试重试查找。

4. **清理**：为了防止内存泄漏，ThreadLocalMap提供了若干清理机制。例如，在get、set、replace等方法中，如果发现键为null的Entry（表示ThreadLocal对象已被GC回收），会将其移除并进行必要的整理操作。

ThreadLocalMap通过在每个线程内部维护一个独立的映射表，实现了线程局部变量的隔离，有效地解决了多线程环境下变量共享的问题。其内部的哈希表结构和特殊的清理机制确保了高效且安全的访问与存储。
:::


下面将通过代码和UML图解释ThreadLocal的底层原理：

```java
public class ThreadLocalExample {
    public static class MyThreadLocal extends ThreadLocal<String> {
        @Override
        protected String initialValue() {
            return "Initial Value";
        }
    }

    public static void main(String[] args) {
        // 创建ThreadLocal实例
        MyThreadLocal threadLocal = new MyThreadLocal();
        
        // 获取当前线程的ThreadLocalMap，并设置值
        threadLocal.set("Custom Value");
        
        // 获取ThreadLocalMap中的值
        String value = threadLocal.get(); // value = "Custom Value"
        
        // 键：MyThreadLocal实例（即threadLocal对象）
        // 值："Custom Value"
        
        // 清理
        threadLocal.remove();
    }
}
```

@startuml

!define weak "weak"
!define strong "strong"

class Thread {
    - ThreadLocal.ThreadLocalMap threadLocals
    + getMap() : ThreadLocalMap
}

class ThreadLocal<T> {
    + set(T value)
    + get() : T
    + remove()
}

class MyThreadLocal extends ThreadLocal<String> {
    + initialValue() : String
}

class ThreadLocalMap {
    + Entry[] table
    + getEntry(ThreadLocal key) : Entry
    + set(ThreadLocal key, Object value)
}

class Entry {
    - ThreadLocal key
    - Object value
}

Thread --* ThreadLocalMap : has
ThreadLocal <|-- MyThreadLocal : extends
ThreadLocalMap o-- Entry : contains
ThreadLocalMap --> ThreadLocal : holds
Entry --> MyThreadLocal : {weak reference}
Entry --> "Custom Value" : {strong reference}


note right of Entry::key
Key is a weak reference to the ThreadLocal instance.
end note

@enduml


- ThreadLocal实例并不直接保存每个线程的值，而是通过每个线程所持有的一个ThreadLocalMap来存储和查找这些值
- ThreadLocalMap内部实际上是一个定制的哈希表，它使用ThreadLocal的实例作为键来存储值

- **弱引用（Weak Reference）**: ThreadLocal被存储为键，使用的是弱引用。这意味着只要ThreadLocal对象没有被其他地方强引用，就可以被垃圾回收
- **强引用（Strong Reference）**: value是强引用，意味着只要Entry存在，value的对象就不会被垃圾回收




### 内存泄露问题

ThreadLocal内存泄露问题的核心在于其内部使用的ThreadLocalMap（ThreadLocal的内部类）的键值对管理机制。ThreadLocalMap使用ThreadLocal实例作为键（Key），而线程的局部变量值作为值（Value）。在JDK 8及以前的版本中，键（即ThreadLocal实例）被弱引用（WeakReference）持有，这导致了以下内存泄露的情况：

1. **弱引用问题**：当外部不再引用某个ThreadLocal实例时，即使它在ThreadLocalMap中仍然作为键存在，也会被垃圾回收器标记为可回收。即当外部没有强引用指向ThreadLocal对象时，垃圾回收器会回收ThreadLocal对象，但ThreadLocalMap中的Entry仍然保留，因为Entry的键是弱引用，其不会阻止垃圾回收，但Entry的值（即实际存储的数据）仍然是强引用，因此不会被垃圾回收。

::: tip 导致内存泄漏的原因
当一个ThreadLocal键对象没有强引用而被垃圾回收时，对应的Entry的键变为null。此时，虽然键已经被回收，但是value仍然被Entry强引用着，无法被垃圾回收，导致内存泄漏。
:::

2. **哈希冲突**：在哈希冲突的情况下，ThreadLocalMap会通过线性探测法寻找下一个空位或匹配的键。如果某个ThreadLocal实例被回收，但其对应的Entry仍留在Map中，那么这个Entry的位置可能会被当作是“已占用”，导致新的Entry无法插入，即使原来的Entry的键已经为null。


**JDK 8前后区别**：

- **JDK 8及以前**：ThreadLocalMap中的键是弱引用，这可能导致内存泄露，因为即使ThreadLocal实例被回收，其对应的Entry仍然存在，导致Value无法被回收。
  
- **JDK 9及以后**：为了解决这个问题，JDK 9开始，ThreadLocalMap不再使用弱引用，而是直接持有一个强引用指向ThreadLocal实例。同时，它引入了一个新的机制来处理null键的问题，当检测到Entry的键为null时，会主动清理这些Entry，从而减少了内存泄露的风险。此外，JDK 9引入了`cleanSomeSlots`和`expungeStaleEntry`等方法，用于主动清理废弃的Entry。

::: info 如何解决内存泄露问题
**及时清理**：调用ThreadLocal的`remove`方法来显式地从当前线程的ThreadLocalMap中移除Entry，这是最直接的解决办法。通常在使用完ThreadLocal变量后，尤其是在线程结束或长时间不使用时执行。

:::

最佳实践是主动管理和清理ThreadLocal，确保在不再需要时及时释放资源。因此，应当在不再使用ThreadLocal时调用`remove`方法清理。





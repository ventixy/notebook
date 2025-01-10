---

order: 10
title: Java线程池

---



## Java线程池框架

线程池是一种预先创建一定数量线程的机制，这些线程在需要时可以重复使用，而不是每次任务来临时都创建新的线程。线程池管理线程的生命周期，减少了创建和销毁线程的开销，同时可以控制并发的数量，避免过多线程带来的资源竞争和上下文切换成本。



### Executor

Java 5中引入了Executor框架，其内部使用了线程池机制，它在java.util.cocurrent 包下

- 通过Executor来启动线程比使用Thread的start方法更好，更易管理，效率更好（用线程池实现，节约开销）

- Executor的实现还提供了对生命周期的支持，以及统计信息收集，应用程序管理机制和性能监视等机制。

- 有助于避免this逃逸问题

  this逃逸问题——如果我们在构造器中启动一个线程，因为另一个任务可能会在构造器结束之前开始执行，此时可能会访问到初始化了一半的对象

<img src="https://image.ventix.top/java/image-20211019165336109.png" alt="image-20211019165336109" style="zoom:50%;" />

**Executor 、 ExecutorService**：

- ExecutorService 接口继承了 Executor 接口，是 Executor 的子接口，ExecutorService 还提供用来控制线程池的方法

  Executor 接口定义了 `execute()`方法用来接收一个`Runnable`接口的对象，`execute()` 方法不返回任何结果

  而 ExecutorService 接口中的 `submit()`方法可以接受`Runnable`和`Callable`接口的对象，通过一个Future对象返回运算结果

  ```java
  public interface Executor {
      void execute(Runnable command);
  }
  ```

  ```java
  public interface ExecutorService extends Executor {
  	<T> Future<T> submit(Callable<T> task);
  	<T> Future<T> submit(Runnable task, T result);
      Future<?> submit(Runnable task);
  
  	void shutdown();              //启动一次顺序关闭，执行以前提交的任务，但不接受新任务
  	List<Runnable> shutdownNow(); //试图停止所有正在执行的活动任务，暂停处理正在等待的任务，并返回等待执行的任务列表
  }
  ```

  
### Executors
`Executors` 类提供工厂方法用来创建不同类型的线程池，以下为java中常见的四种线程池：
- `Executors.newCachedThreadPool()` ：缓存线程池（长度无限制，自动创建线程）
- `Executors.newFixedThreadPool()` ：定长线程池 （线程池已满时需要等待）
- `Executors.newSingleThreadExecutor()` ：单线程线程池（效果与定长线程池 创建时传入数值1效果一致）
- `Executors.newScheduledThreadPool()`：周期性任务定长线程池 







## 线程池快捷创建方式

### 缓存线程池

可缓存线程池（`CachedThreadPool`）是Java中的Executor框架提供的一个线程池实现，通过`Executors.newCachedThreadPool()`方法创建。

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE, 60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>() );
}
```

1. **线程数量动态调整**：可缓存线程池会根据任务的提交情况动态调整线程池中的线程数量。当有新任务提交时，如果当前线程池中有空闲线程，则会复用这些线程；如果没有空闲线程，则会创建新线程来处理任务。当线程空闲一段时间（默认60秒）后，这些线程会被回收以减少资源占用。

2. **无界队列**：实际上，可缓存线程池并没有使用固定的任务队列来存储待处理的任务，而是直接创建新线程来处理超出当前活动线程数的任务，这在某种意义上可以看作是一个无界的任务队列。

3. **适用短期任务**：设计上，可缓存线程池非常适合执行大量短生命周期的任务，因为它能够迅速创建新线程以应对任务高峰，而在任务较少时又能自动回收线程以节省资源。


```java
public class CachedThreadPoolDemo {
    public static void main(String[] args) {
        final ExecutorService pool = Executors.newCachedThreadPool();

        // 计算 1 + 2 + ... + 1000000 的值
        Callable<Long> task = new Callable<Long>() {
            @Override
            public Long call() throws Exception {
                long result = 0;
                for (int i = 0; i < 1000000; i++) {
                    result += i;
                }
                return result;
            }
        };

        final Future<Long> future = pool.submit(task);
        try {
            final Long result = future.get();
            System.out.println("Result：" + result);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        // get() 方法会阻塞后面的执行
        System.out.println("After task!");
        pool.shutdown();
    }
}
```

![](https://image.ventix.top/java/image-20220224084847444.png)


::: info 可缓存线程池的使用场景和弊端
#### 使用场景
- **短时突发任务**：当应用需要处理大量的短暂且突发的任务，且任务执行时间远小于创建线程所需时间时，可缓存线程池能够高效地应对。
- **任务量不可预知**：在任务数量不确定，且可能随时间波动较大的情况下，可缓存线程池能够自适应地调整线程数量。
- **快速响应**：需要快速响应新任务提交的场景，如一些事件处理系统或高吞吐量的服务。

#### 弊端
1. **资源耗尽风险**：由于可缓存线程池对线程数量没有明确的上限，如果提交的任务持续不断且执行时间较长，可能会导致创建大量线程，消耗系统资源，甚至引起资源耗尽（如达到操作系统级别的线程限制）。
2. **稳定性问题**：大量线程可能导致内存占用增加、CPU上下文切换频繁，进而影响系统整体性能和稳定性。
3. **不适合长任务**：由于线程的创建成本相对较高，且空闲线程回收有延时，如果任务执行时间较长，频繁创建和销毁线程不仅效率低下，还可能对系统造成不必要的压力。
:::

虽然可缓存线程池在处理大量短期任务时非常高效，但在使用时需要谨慎评估任务的性质和潜在的资源消耗，避免因不当使用而导致的系统稳定性问题。





### 定长线程池 

定长线程池（`FixedThreadPool`）通过`Executors.newFixedThreadPool(int nThreads)`方法创建

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads, 0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>() );
}
```

1. **固定线程数量**：定长线程池的核心特点是线程数量固定。在创建线程池时，需要指定线程池的大小，之后无论提交多少任务，线程池中的线程数量都不会改变。如果某个线程因为执行异常而结束，那么线程池会补充一个新线程。

2. **任务队列**：超出当前活动线程数量的任务会被放入一个无界的任务队列（通常是`LinkedBlockingQueue`）中等待执行。这意味着，如果所有线程都在忙碌，新任务会排队等待，直到有线程空闲。

3. **保证资源控制**：由于线程数量固定，定长线程池有助于控制资源使用，避免了线程爆炸的风险，同时也降低了系统开销和上下文切换的频率。


```java
public class FixedThreadPoolDemo {
    public static void main(String[] args) {
        final ExecutorService pool = Executors.newFixedThreadPool(2);

        Runnable task = new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 5; i++) {
                    try {
                        Thread.sleep(1000);
                        System.out.println(Thread.currentThread().getName() + "——" + i);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        };

        pool.execute(task);
        pool.submit(task);
        pool.shutdown();
    }
}
```

![](https://image.ventix.top/java/image-20220224083333946.png)


::: info 定长线程池的使用场景和弊端
#### 使用场景
- **CPU密集型任务**：当任务主要是计算密集型，对CPU依赖较高，且任务数量不是非常多时，固定大小的线程池能充分利用CPU资源，避免过多的线程争抢CPU时间片。
- **资源受限环境**：在资源有限的环境下，尤其是对线程数量有严格要求时，使用定长线程池可以确保不会因为线程创建过多而导致资源耗尽。
- **稳定响应时间**：对于那些需要保持较为稳定响应时间的服务，固定数量的线程池可以提供较为可预测的执行性能。

#### 弊端
1. **队列溢出风险**：如果任务提交速率持续高于线程池处理能力，且任务队列是无界的，可能会导致队列无限增长，最终耗尽系统内存。
2. **无法自适应负载变化**：由于线程数量固定，定长线程池在面对任务数量的突增或突减时缺乏弹性，无法根据实际工作负载自动调整线程数量。
3. **可能导致饥饿**：如果存在优先级高的长任务，低优先级的任务可能长时间在队列中等待，出现任务饥饿现象。
:::

定长线程池适用于任务量相对稳定、对响应时间和资源控制有严格要求的场景。然而，设计时需要考虑任务队列的大小限制，以防止内存溢出，并且理解其在负载波动较大时可能存在的局限性。






### 单线程线程池

单线程线程池（`SingleThreadExecutor`）通过`Executors.newSingleThreadExecutor()`方法创建

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1, 0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()) );
}
```
1. **单个工作线程**：顾名思义，单线程线程池中只包含一个工作线程。所有提交的任务都会按照提交顺序依次被执行，因此任务是串行处理的。

2. **任务队列**：与定长线程池类似，超出当前线程处理能力的任务会被加入到一个无界的任务队列中等待，通常使用的是`LinkedBlockingQueue`。

3. **序列化执行**：由于只有一个工作线程，所有任务都将按顺序执行，这保证了任务之间的顺序性，对于需要保证操作顺序一致性的场景非常有用。

::: tip
从某种程度上来说，单线程线程池可以被视为==固定大小为1的定长线程池==的一个特例。它继承了定长线程池的一些基本特性，比如线程数量固定、使用无界任务队列来存放超出线程处理能力的任务等。但单线程线程池更加专注于单一任务的串行执行，强调的是任务的顺序处理和简化并发控制的复杂度，而非并行处理能力。
:::

```java
public class SingleThreadExecutorDemo {
    public static void main(String[] args) {
        final ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();

        Runnable task = () -> {
            for (int i = 0; i < 5; i++) {
                try {
                    Thread.sleep(1000);
                    System.out.println(Thread.currentThread().getName() + "——" + i);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        };

        singleThreadExecutor.submit(task);
        singleThreadExecutor.execute(task);
        singleThreadExecutor.shutdown();
    }
}
```

![](https://image.ventix.top/java/image-20220224083833100.png)

::: info 单线程线程池的使用场景和弊端
#### 使用场景
- **无需并发**：对于那些逻辑上不需要并发执行的任务，或者并发执行反而会引起问题的场景，如某些资源的写操作，单线程执行可以简化编程模型，避免并发控制的复杂性。
- **序列化处理**：当任务之间存在依赖，或者需要维持特定的执行顺序时，单线程执行可以自然地保持任务的顺序。
- **简单后台任务**：对于简单的后台处理任务，如日志记录、定时任务等，单线程可以有效减少资源消耗，同时简化错误处理和调试过程。

#### 弊端
1. **性能瓶颈**：单线程处理所有任务，意味着即使系统有多个处理器核心，也无法充分利用硬件的并行处理能力，这在处理大量任务或计算密集型任务时会成为性能瓶颈。
2. **响应延迟**：如果有高优先级或紧急任务需要处理，单线程模型会导致这些任务必须等待当前任务完成后才能开始，增加了响应延迟。
3. **故障敏感**：单工作线程意味着如果这个线程因为异常终止，那么整个线程池将停止处理任何任务，直到线程被重新创建或线程池被重启。
:::

单线程线程池在处理特定类型的任务时有其独特优势，特别是需要任务顺序执行或避免并发冲突的场景。然而，它不适合高性能或需要并行处理的场合，且在处理长时间运行任务时可能会导致其他任务延迟。





### 可调度线程池

`newScheduledThreadPool`工厂方法可以创建一个执行`延时`和`周期性`任务的可调度线程池

```java
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
    return new ScheduledThreadPoolExecutor(corePoolSize);
}
public ScheduledThreadPoolExecutor(int corePoolSize) {
    // super: ThreadPoolExecutor
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue() );
}
```

1. **定时与周期性执行**：`ScheduledThreadPoolExecutor`允许你安排任务在未来的某个时间点执行一次，或者以固定的延迟（delay）或固定的周期（interval）重复执行。

2. **灵活的调度策略**：提供了灵活的API来控制任务的调度，包括`schedule()`, `scheduleAtFixedRate()`, 和 `scheduleWithFixedDelay()`方法，分别对应不同的调度策略。

3. **动态线程数量**：尽管可以设定核心线程数，但根据任务的调度情况，线程池的大小可以动态调整，以适应任务调度的需要。未使用的线程会在一段时间后被回收，以减少资源占用。

**可调度线程池的使用场景**:
- **定时任务**：如定时数据同步、定期数据库维护、定时报告生成等，需要在特定时间点执行的操作。
- **周期性任务**：如心跳检测、监控数据采集、定期清理缓存等需要周期性重复执行的任务。
- **后台处理**：在不干扰主线程的情况下，执行后台的定时或周期性作业，如定时检查系统状态、更新缓存等。

执行流程：

1. 判断线程池是否存在空闲线程 
2. 存在则使用 
3. 不存在空闲线程,且线程池未满的情况下,则创建线程 并放入线程池, 然后使用 
4. 不存在空闲线程,且线程池已满的情况下,则等待线程池存在空闲线程

```java
public class ScheduledThreadPoolDemo {
    public static void main(String[] args) {
        ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(2);

        // 定时任务：（5秒后执行）
        scheduledExecutorService.schedule(new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName());
            }
        }, 5, TimeUnit.SECONDS);

        // 周期任务 (5秒后开始执行，间隔2秒重复执行)
        scheduledExecutorService.scheduleAtFixedRate(()->{
            System.out.println(Thread.currentThread().getName());
        }, 5, 2, TimeUnit.SECONDS);
    }
}
```

**可调度线程池的弊端**:
1. **资源管理**：虽然线程池大小可以动态调整，但如果调度的任务频繁且周期较短，可能会导致线程池维持大量活跃线程，消耗较多系统资源，包括CPU和内存。
2. **任务堆积**：在任务提交速率超过线程池处理能力时，虽然任务会被排队等待，但无界的任务队列可能导致内存持续增长，最终可能引发内存溢出。
3. **复杂性**：相比普通线程池，调度线程池的使用和配置更为复杂，需要仔细调整核心线程数、队列大小、拒绝策略等参数，以避免资源耗尽或性能问题。
4. **定时精度问题**：由于JVM的线程调度、垃圾回收等因素，定时任务的实际执行时间可能会有所偏差，对于对时间精度要求极高的场景可能不太适用。


::: info scheduledExecutorService的常用方法
#### 1. `schedule(Runnable command, long delay, TimeUnit unit)`
- **参数含义**：
  - `command`：要执行的任务，必须实现 `Runnable` 接口。
  - `delay`：从现在开始到任务执行的延迟时间。
  - `unit`：`delay` 参数的时间单位，例如 `TimeUnit.SECONDS` 表示秒，`TimeUnit.MILLISECONDS` 表示毫秒等。

- **功能**：此方法用于在指定的延迟时间之后，只执行一次给定的任务。

#### 2. `schedule(Callable<V> callable, long delay, TimeUnit unit)`
- **参数含义**：
  - `callable`：要执行的任务，必须实现 `Callable` 接口，并能返回一个结果。
  - `delay` 和 `unit`：含义同上。

- **功能**：与上面的 `schedule(Runnable command, long delay, TimeUnit unit)` 类似，不同之处在于它接受一个有返回值的任务，并且可以通过 `Future` 获取这个返回值。

#### 3. `scheduleAtFixedRate(Runnable command, long initialDelay, long period, TimeUnit unit)`
- **参数含义**：
  - `command`：要周期性执行的任务。
  - `initialDelay`：首次执行前的延迟时间。
  - `period`：连续执行之间的周期时间。
  - `unit`：`initialDelay` 和 `period` 的时间单位。

- **功能**：按照固定的周期执行任务，首次执行将在初始延迟后开始，后续执行在前一次执行结束到下一次开始之间始终保持着固定的周期。它决定了任务执行的频率，==不考虑任务实际执行所需时间==。

#### 4. `scheduleWithFixedDelay(Runnable command, long initialDelay, long delay, TimeUnit unit)`
- **参数含义**：
  - `command`：要周期性执行的任务。
  - `initialDelay`：首次执行前的延迟时间。
  - `delay`：连续执行之间的延迟时间。
  - `unit`：时间单位。

- **功能**：也是周期性地执行任务，但与 `scheduleAtFixedRate` 不同，它是在每次执行结束后再经过指定的延迟时间才开始下一次执行。delay是==基于前一次任务完成时间来计算的==。

#### 注意事项
- 在使用这些方法时，需要注意异常处理。如果任务执行过程中抛出未捕获的异常，根据配置的 `RejectedExecutionHandler`（拒绝策略），任务可能会被放弃，线程可能会终止，或者异常可能会被传播。
- 对于周期性任务，特别是使用 `scheduleAtFixedRate` 时，要考虑任务执行时间是否可能超过周期间隔，以免任务逐渐累积导致系统资源耗尽。
- 使用 `ScheduledExecutorService` 前，通常需要通过 `Executors.newScheduledThreadPool(int corePoolSize)` 创建一个实例，其中 `corePoolSize` 指定线程池的核心线程数。

:::




## ThreadPoolExecutor

虽然 `Executors` 类提供了便捷的静态方法来创建不同类型（如 `newFixedThreadPool`, `newCachedThreadPool` 等）的线程池，但这些方法往往使用了较为简化的配置，例如使用无界队列（可能导致内存泄漏或OOM），或固定大小线程池（可能导致任务堆积或资源浪费）。这些简化的配置在某些场景下可能不适合，容易导致性能问题或资源管理不当。所以更推荐使用 `ThreadPoolExecutor` 自定义线程池。

### 线程池参数

`ThreadPoolExecutor` 是 Java 中用于创建自定义线程池的核心类，它提供了高度的灵活性来根据应用程序的需求调整线程池的行为。

1. **corePoolSize**: 核心线程数，线程池的基本大小。即使没有任务执行，这些线程也会一直存活。只有当线程数小于核心线程数时，新的任务才会创建新的线程来执行。

2. **maximumPoolSize**: 线程池能够容纳的最大线程数，包括核心线程和非核心线程。

3. **keepAliveTime**: 非核心线程闲置时的超时时长，超过这个时间，非核心线程将被终止。如果设置为0，非核心线程会立即终止。

4. **unit**: `keepAliveTime` 参数的时间单位，如 `TimeUnit.SECONDS`、`TimeUnit.MILLISECONDS` 等。

5. **workQueue**: 任务队列，用于保存等待执行的任务。常见的有 `LinkedBlockingQueue`（无界队列）、`ArrayBlockingQueue`（有界队列）和 `SynchronousQueue`（直接传递）等。

6. **threadFactory**: 线程工厂，用于创建新线程。可以用来设置线程的名称、优先级等属性。

7. **handler**: 拒绝策略，当线程池和任务队列都满时，新提交的任务将会触发此策略。常见的策略有 `AbortPolicy`（抛出异常）、`CallerRunsPolicy`（调用者运行任务）、`DiscardPolicy`（静默丢弃任务）和 `DiscardOldestPolicy`（丢弃队列中最旧的任务然后尝试重新提交）。


自定义线程池通常涉及决定上述参数的具体值，以满足特定应用程序的需求。例如，对于一个IO密集型应用，可以设置较大的线程数以充分利用CPU；而对于CPU密集型任务，线程数通常设置为处理器核心数+1或类似策略：

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


### 阻塞队列

在Java的线程池中，阻塞队列（`BlockingQueue`）扮演着关键角色，作为任务的临时存储空间，它允许生产者线程（提交任务的线程）和消费者线程（工作线程）在多线程环境下安全地交互。阻塞队列通过控制任务的生产和消费速度，平衡了线程池的工作负载，避免了过度竞争和资源浪费。

- **线程安全**：阻塞队列内部实现了同步机制，确保了多线程环境下的操作安全。
- **阻塞机制**：当队列为空时，消费者线程（获取任务的线程）会阻塞等待；当队列满时，生产者线程（提交任务的线程）会阻塞等待，直到有足够的空间。
- **可选策略**：不同的阻塞队列提供了不同的阻塞策略和特性，适应不同的应用场景。

::: tip 使用场景
- **任务调度**：用于线程池中存放待执行的任务，平衡线程的工作量，提高效率。
- **生产者-消费者模型**：经典并发模式，生产者生产数据放入队列，消费者从队列中取出数据处理。
- **限流与缓冲**：作为中间缓存，限制数据处理的速度，防止系统过载。
:::

**BlockingQueue接口常用方法**
- `put(E element)`：将元素添加到队列中，如果队列满，则阻塞直到有空间可用。
- `take()`：从队列中移除并返回头部元素，如果队列为空，则阻塞直到有元素可用。
- `offer(E element, long timeout, TimeUnit unit)`：尝试在给定时间内将元素添加到队列，如果队列满则返回`false`。
- `poll(long timeout, TimeUnit unit)`：尝试在给定时间内从队列中取出元素，如果队列为空则返回`null`。
- `size()`、`isEmpty()`、`remainingCapacity()`等方法：用于查询队列状态。

**常见的阻塞队列**
- **ArrayBlockingQueue**：基于数组的有界队列，容量固定，适合生产速率和消费速率相近的场景。
- **LinkedBlockingQueue**：基于链表的阻塞队列，可以选择是否设定容量，无界队列时需谨慎使用以防内存溢出。
- **PriorityBlockingQueue**：具有优先级的无界队列，元素按优先级排序。
- **DelayQueue**：基于优先级队列，元素只有在延迟期满后才能被消费，常用于定时任务。
- **SynchronousQueue**：不存储元素的队列，每个插入操作必须等待一个相应的移除操作，适用于一对一的生产者-消费者场景。

::: info 阻塞队列与非阻塞队列的并发安全原理
- **阻塞队列**：通过内置的锁或条件变量（如Java中的`ReentrantLock`和`Condition`）实现线程间的同步，当操作无法立即完成时，线程会被挂起而不是忙等待，减少了CPU的无谓消耗。
- **非阻塞队列**：通常采用CAS（Compare-and-Swap）或其他无锁算法实现，如`ConcurrentLinkedQueue`，通过原子操作保证线程安全，不阻塞线程，适用于高并发场景，但实现更为复杂。
:::


**如何选择适合自己的阻塞队列？**
- **考虑队列容量**：是否需要有界队列来防止资源耗尽。
- **任务优先级**：是否需要根据任务优先级排序执行。
- **吞吐量和延迟**：高吞吐量场景可能更适合无界的或容量大的队列，低延迟场景可能需要小队列或直接交互的队列（如`SynchronousQueue`）。
- **任务特性**：是否需要延迟执行或定时任务，是否为一对一或一对多的生产者消费者模型。
- **资源限制**：考虑内存和CPU使用情况，选择合适的队列类型以避免资源过度消耗。




### 拒绝策略

线程池的拒绝策略会在以下条件下被触发：

1. **任务提交数量超过最大容量**：当提交到线程池的任务数量超过了线程池的处理能力，具体来说，是当线程池中的线程数已经达到最大线程数（`maximumPoolSize`），并且工作队列（`BlockingQueue`，通常是一个有界队列）也已经满了，无法再接纳更多的任务时，线程池就会触发拒绝策略。

2. **线程池关闭**：如果线程池已经调用了关闭方法（如`shutdown()`或`shutdownNow()`），并且不再接受新的任务，那么在此之后提交的任务也会被拒绝。

总结来说，线程池拒绝策略的触发主要有两个直接原因：一是线程池资源（包括活动线程和等待队列）已经达到了配置的最大限制，无法再处理额外的任务；二是线程池处于关闭状态，拒绝接收新的任务提交。在这些情况下，线程池会依据预先设定的拒绝策略来处理无法接纳的任务，常见的拒绝策略包括：

- **AbortPolicy**：默认策略，直接抛出`RejectedExecutionException`异常。
- **DiscardPolicy**：默默丢弃无法处理的任务，不抛出异常。
- **DiscardOldestPolicy**：丢弃队列中最旧的任务（即最先加入队列的任务），然后尝试重新提交当前任务。
- **CallerRunsPolicy**：不将任务丢弃，而是由调用者所在的线程直接执行任务，这通常会影响调用者线程的性能。

::: info CallerRunsPolicy
`CallerRunsPolicy` 会选择让提交任务的线程（即调用 `execute()` 方法的线程）自己来执行这个被拒绝的任务，而不是将其丢弃或抛出异常。

- 这一策略的优势在于可以避免任务丢失，同时也是一种简单有效的流量控制手段，因为它减少了对线程池的压力，使得线程池有更多机会去处理队列中的任务。然而，这也意味着提交任务的线程将被阻塞，直到任务执行完毕，这可能会影响到应用程序的整体响应速度，尤其是当调用者线程是主线程或处理用户界面更新的线程时。

- `CallerRunsPolicy` 适合于那些对任务丢失敏感、且并发度不是特别高、性能要求相对宽松的应用场景。例如，在后台处理任务的系统中，如果允许主逻辑线程稍微慢一点而不想丢失任何任务，就可以考虑使用这个策略。

总之，`CallerRunsPolicy` 是一种折衷的解决方案，它牺牲了一定程度的性能和响应性，以换取任务处理的可靠性，确保即使在资源紧张的情况下，任务也不会被轻易放弃。在设计线程池时，选择合适的拒绝策略应当基于对应用程序特性的深入理解及性能需求的权衡。
:::



### 自定义线程池

1. **明确需求**：首先明确应用的并发需求，包括任务性质（CPU密集型或IO密集型）、任务的数量和频率、任务执行的平均时间和最长时间等。

2. **合理配置参数**：基于需求选择合适的核心线程数、最大线程数、队列类型和大小，以及拒绝策略。

3. **监控与调整**：实施监控线程池的运行状况，包括任务队列长度、线程使用率、拒绝任务数量等，根据实际情况调整线程池参数。

4. **考虑使用 `ThreadPoolExecutor` 直接创建**：手动配置线程池参数，以获得更精确的控制和更高的灵活性。


```java
public class ThreadPoolExecutorDemo {
    public static void main(String[] args) {
        //创建等待队列
        ArrayBlockingQueue<Runnable> queue = new ArrayBlockingQueue<Runnable>(10);
        //创建线程池，池中保存的线程数为3，允许的最大线程数为5
        ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(3, 5, 50, TimeUnit.MILLISECONDS, queue);

        poolExecutor.execute(()->{
            System.out.println(Thread.currentThread().getName());
        });

        // 关闭线程池
        poolExecutor.shutdown();
    }
}
```


自定义线程池时，需要综合考虑多个因素，下面以一个 8核心16线程的CPU，16GB内存 的机器为例，根据以下因素来具体分析如何设置线程池参数：

- **CPU核心数与线程数**：8个物理核心，16线程。这意味着CPU可以同时处理16个线程而无需上下文切换的开销，这对于线程池的`corePoolSize`和`maximumPoolSize`提供了基础参考。CPU密集型任务倾向于使用接近核心数的线程数，而IO密集型任务可以适当增加。
- **内存大小**：16GB内存意味着应避免使用过大的无界队列或过多线程导致内存溢出。`workQueue`的大小和线程堆栈大小应考虑到总内存中。

**具体因素分析**
1. **核心线程数（corePoolSize）**：对于混合型或偏向IO密集型的应用，可以设置为核心数的`1~2`倍，即`8~16`。如果是纯CPU密集型，则接近或等于物理核心数（8）。
   
2. **最大线程数（maximumPoolSize）**：考虑到超线程，可以设置为16或更高一点，但应根据实际测试调整，避免过多线程导致资源竞争和上下文切换开销。

3. **任务队列（workQueue）**：对于内存考虑，可以使用有界队列，如`ArrayBlockingQueue`，大小可以根据预计的并发任务量和处理能力调整，例如设置为1000。如果任务量波动大，也可以考虑使用`LinkedBlockingQueue`，但务必注意设置合理的上限以避免内存溢出。

4. **非核心线程存活时间（keepAliveTime）**：对于IO密集型任务，非核心线程可以设置较长的存活时间，如60秒，以便在任务量下降时逐步释放资源。CPU密集型任务则可以设为较低，甚至0秒迅速回收。

5. **线程工厂（threadFactory）**：可以自定义以命名线程、设置优先级等，便于监控和调试。

6. **拒绝策略（handler）**：根据应用容错需求选择，如`CallerRunsPolicy`在任务队列满时由调用者执行任务，避免拒绝，适合不能丢失任务的场景；`AbortPolicy`直接抛出异常，适用于需要及时发现和处理错误的场景。


假设应用以IO操作为主，偶有CPU密集型任务，且希望有一定的弹性处理突发流量，可以这样设置：

```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    16, // 核心线程数，偏向于IO密集型，设置为物理核心数的两倍
    32, // 最大线程数，留有一定余地应对高峰期
    60, // 非核心线程存活时间，单位秒
    TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(500), // 有界队列，根据预计任务量和处理速度调整
    new NamedThreadFactory("CustomThreadPool-"), // 自定义线程命名
    new ThreadPoolExecutor.CallerRunsPolicy() // 拒绝策略，任务由调用者执行
);
```

上述配置仅为示例，实际应用中应根据压力测试和监控数据进行调整优化，确保线程池既能高效处理任务，又能避免资源过度消耗。




## ForkJoinPool

`ForkJoinPool`是在JDK7中引入的，是ExecutorService接口的一个高效实现，专门设计用于处理可分解的大规模任务，通过分治策略（Divide and Conquer）来提高计算效率。

**特点与优势**：
- **高效并行处理**：通过任务分解和工作窃取，有效利用多核CPU。
- **动态负载平衡**：自动调整任务分配，减少线程空闲时间。
- **减少同步开销**：相较于传统的线程池，减少了线程间同步的需求。
- **灵活的配置**：允许用户根据具体需求定制线程池的大小和行为。


### Fork/Join框架

Fork/Join框架是Java 7引入的一个用于并行执行任务的高级并发框架，特别适合处理可分解的、能够并行计算的“分而治之”类型的问题。它的设计灵感来源于函数式编程语言中的map/reduce模型以及Scala等语言中的并行集合操作。

::: info 核心概念和组件
**核心概念**:

1. **分叉（Fork）**：将一个大任务（通常是一个递归任务）分解成两个或多个子任务，这些子任务可以独立执行。在Java中，这是通过在ForkJoinPool中提交任务实现的，每个子任务都会被安排到线程池的一个线程上执行。

2. **合并（Join）**：当所有的子任务完成时，它们的结果会被合并成原大任务的结果。这个过程确保了即使任务被分割执行，最终也能获得正确的、统一的结果。

**核心组件**:

1. **ForkJoinPool**：这是Fork/Join框架的核心执行器，它是一个特殊的线程池，用于管理和调度任务。它使用了工作窃取（Work-Stealing）算法，这意味着当一个线程完成其分配的任务并且没有更多任务可执行时，它会尝试“窃取”其他线程的任务，从而提高CPU利用率。

2. **RecursiveAction** 和 **RecursiveTask**：这两个抽象类是Fork/Join框架中用于定义任务的基类。`RecursiveAction` 用于没有返回值的任务，而 `RecursiveTask<V>` 则用于有返回值的任务。开发者需要扩展这些类并实现 `compute()` 方法，该方法负责任务的逻辑，包括决定是否进一步分解任务。

**工作窃取算法**: 
- 工作窃取（Work-Stealing）算法 是一种高效的线程间任务调度算法，它允许空闲线程从其他线程的任务队列中“窃取”任务来执行，从而减少了线程等待时间，提高了系统的整体效率。ForkJoinPool内部维护了一个双端队列（Deque），每个工作线程都有自己的队列，当自己的队列为空时，就尝试从其他线程的队列末尾“窃取”任务。
:::


**使用场景**:
- 数据并行处理，如数组的排序、大规模数据集的搜索、树结构的操作等。
- 分布式计算中，尽管Fork/Join主要用于同一进程内的多线程并行，但其思想也可应用于分布式环境下，通过网络通信实现跨节点的任务分配和结果聚合。


以下是一个简单的Fork/Join框架使用的示例，使用`RecursiveTask`来实现一个求和任务：

```java
import java.util.concurrent.RecursiveTask;

public class SumTask extends RecursiveTask<Integer> {
    private final int threshold = 10;
    private int start;
    private int end;

    public SumTask(int start, int end) {
        this.start = start;
        this.end = end;
    }

    @Override
    protected Integer compute() {
        int sum = 0;
        boolean canComputeDirectly = (end - start) <= threshold;
        if (canComputeDirectly) {
            for (int i = start; i <= end; i++) {
                sum += i;
            }
        } else {
            int middle = (start + end) / 2;
            SumTask task1 = new SumTask(start, middle);
            SumTask task2 = new SumTask(middle + 1, end);
            
            invokeAll(task1, task2); // 分叉两个子任务
            
            sum = task1.join() + task2.join(); // 合并子任务结果
        }
        return sum;
    }
}
```

在这个例子中，`SumTask`类继承自`RecursiveTask`，用于计算一个区间内的数字和。如果区间的长度小于或等于预设阈值，任务直接计算；否则，任务被分割成两个子任务，并递归调用自身，最后将子任务的结果合并。


### 常用方法

在Java中，创建`ForkJoinPool`主要有以下几种方式：

1. **使用默认构造函数**：
   ```java
   ForkJoinPool pool = new ForkJoinPool();
   ```
   这将创建一个ForkJoinPool，其默认线程数等于系统可用的处理器数量（`Runtime.getRuntime().availableProcessors()`）。

2. **指定并行度创建**：
   ```java
   ForkJoinPool pool = new ForkJoinPool(parallelism);
   ```
   这里，`parallelism`指定了线程池中并行线程的数量。可以根据实际需求设置，但通常最好接近系统的处理器核心数以获得最佳性能。

3. **使用公共池**：
   ```java
   ForkJoinPool pool = ForkJoinPool.commonPool();
   ```
   返回的是一个 单例的`ForkJoinPool`实例。这个公共池是全局共享的，它也是根据系统的处理器数量初始化的。使用这个池可以避免创建过多的线程池实例，但是需要注意的是，所有使用`commonPool()`的地方将共享同一个线程池，可能会导致任务的混合和资源的竞争。


::: info ForkJoinPool常用方法
1. **`submit(ForkJoinTask task)`**:
   提交一个任务到ForkJoinPool中执行，返回一个`Future`对象，可以用来获取任务结果或检查任务状态。

2. **`invoke(ForkJoinTask task)`**:
   直接执行给定的任务，直到任务完成。如果有返回值，此方法会返回任务的结果。此方法会阻塞调用线程直到任务完成。

3. **`execute(Runnable task)`**:
   执行给定的Runnable任务，没有返回值。此方法不会阻塞，任务的执行结果不可知。

4. **`shutdown()`**:
   启动一个有序的关闭过程，阻止新任务提交到此池中，但是已提交的任务将继续执行直到完成。

5. **`awaitTermination(long timeout, TimeUnit unit)`**:
   阻塞当前线程，直到所有任务完成执行，或者超时，或者当前线程被中断，返回`true`表示线程池已关闭并且所有任务已完成，`false`则表示超时或中断。

6. **`commonPool()`**:
   获取一个公共的ForkJoinPool实例，适用于大多数并发任务。此方法返回的实例是静态的，应谨慎使用以避免影响其他使用它的代码。

7. **`getQueuedTaskCount()`**:
   返回此工作队列中估计的任务数。

8. **`getActiveThreadCount()`**:
   返回当前正在执行任务的线程估计数。

9. **`isTerminated()`**:
   如果此池已终止，则返回`true`，意味着所有任务已完成，并且没有任务正在执行，也没有任务在等待执行。
:::



### 使用及代码示例

**ForkJoinPool使用步骤**:

1. **创建ForkJoinPool**
   通常，可以使用`ForkJoinPool.commonPool()`获得一个共享的线程池，或者通过构造函数创建自定义的`ForkJoinPool`实例，指定线程池的大小等参数。

2. **实现任务**
   继承`RecursiveTask`或`RecursiveAction`并重写`compute`方法，定义任务的执行逻辑和如何分解子任务。

3. **提交任务**
   使用`fork()`方法将任务提交到线程池，将其异步执行。对于需要等待结果的任务，可以使用`join()`方法获取结果，这会阻塞调用线程直到任务完成。


以下是一个使用ForkJoinPool计算数组元素总和的简单代码示例：

```java
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class ForkJoinPoolExample {

    public static void main(String[] args) {
        // 初始化一个长度为10000000的长整型数组
        long[] numbers = new long[10000000];
        for (int i = 0; i < numbers.length; i++) {
            numbers[i] = i + 1; // 填充数组，数值为1至10000000
        }

        // 创建ForkJoinPool实例
        ForkJoinPool forkJoinPool = new ForkJoinPool();

        // 创建并提交任务
        SumTask task = new SumTask(numbers, 0, numbers.length - 1);
        Long result = forkJoinPool.invoke(task); // invoke方法会阻塞直到计算完成

        // 输出结果
        System.out.println("数组元素总和为: " + result);

        // 关闭线程池
        forkJoinPool.shutdown();
    }

    // 任务类，继承RecursiveTask表示这是一个有返回值的任务
    static class SumTask extends RecursiveTask<Long> {
        private final long[] numbers;
        private final int from;
        private final int to;

        public SumTask(long[] numbers, int from, int to) {
            this.numbers = numbers;
            this.from = from;
            this.to = to;
        }

        @Override
        protected Long compute() {
            if (to - from <= 1000) { // 如果任务足够小，直接计算
                long sum = 0;
                for (int i = from; i <= to; i++) {
                    sum += numbers[i];
                }
                return sum;
            } else { // 否则，将任务一分为二，并fork两个子任务
                int mid = (from + to) / 2;
                SumTask leftTask = new SumTask(numbers, from, mid);
                SumTask rightTask = new SumTask(numbers, mid + 1, to);
                
                leftTask.fork(); // 异步执行左半部分任务
                rightTask.fork(); // 异步执行右半部分任务
                
                return leftTask.join() + rightTask.join(); // 等待并合并子任务的结果
            }
        }
    }
}
```

在这个示例中，我们定义了一个`SumTask`类，它继承自`RecursiveTask<Long>`，这意味着它是一个可以返回结果的任务。`compute`方法中，我们判断任务是否足够小以至于可以直接计算，如果是则直接计算总和；如果不是，则将任务分解成两个子任务，并递归地调用`fork()`来异步执行它们，最后通过`join()`方法合并子任务的结果。


**注意事项**：
- **任务划分**：并非所有任务都适合ForkJoinPool，任务必须是可以有效分解的。
- **任务粒度**：任务太小会增加管理开销，太大则无法充分利用多核。
- **资源限制**：过度使用可能导致资源耗尽，需注意线程池大小的设置。

ForkJoinPool在处理大数据处理、复杂的数学运算、深度优先搜索、归并排序等高度并行问题时表现尤为出色。



## 如何关闭线程池

在Java中，正确关闭线程池是非常重要的，以确保所有任务完成执行，资源得到妥善释放。对于`ForkJoinPool`和其他基于`ExecutorService`的线程池，通常采用以下步骤进行关闭：

**1. `shutdown()`方法**
启动一个有序的关闭过程，不再接受新的任务提交，但已提交的任务会继续执行直到完成。
  ```java
  ExecutorService executor = Executors.newFixedThreadPool(10);
  // ... 提交任务到executor ...
  executor.shutdown(); // 关闭线程池，不再接受新任务
  ```

**2. `awaitTermination(long timeout, TimeUnit unit)`方法**
- **作用**：阻塞当前线程，直到线程池所有任务完成执行，或者超时，或者当前线程被中断。
- **示例代码**（结合`shutdown()`使用）：
  ```java
  try {
      if (!executor.awaitTermination(60, TimeUnit.SECONDS)) { // 等待60秒
          executor.shutdownNow(); // 超时后尝试取消所有未完成的任务
      }
  } catch (InterruptedException e) {
      executor.shutdownNow(); // 当前线程被中断，同样尝试取消所有未完成的任务
      Thread.currentThread().interrupt(); // 重新设置中断标志
  }
  ```

**3. `shutdownNow()`方法**
尝试停止所有正在执行的任务，并返回一个包含尚未开始执行的任务列表。此方法会尽力中断正在执行的任务，但并不保证能够成功中断。
  ```java
  List<Runnable> notStartedTasks = executor.shutdownNow(); 
  ```


下面是一个综合示例，展示了如何正确关闭一个使用`ExecutorService`的线程池：

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.lang.Runtime;

public class ThreadPoolShutdownGracefulExample {

    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(10);

        // 注册虚拟机关闭钩子
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Shutdown signal received. Initiating graceful shutdown...");
            executor.shutdown(); // 关闭线程池，不再接受新任务
            try {
                if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                    executor.shutdownNow(); // 等待一段时间后，强制关闭
                    System.err.println("Forcefully shutting down the executor service.");
                } else {
                    System.out.println("Executor service successfully shut down.");
                }
            } catch (InterruptedException e) {
                executor.shutdownNow(); // 中断等待，直接强制关闭
                Thread.currentThread().interrupt();
                System.err.println("Shutdown interrupted. Forcing shutdown.");
            }
        }));

        // 提交一些任务到线程池，这些任务能够响应中断
        for (int i = 0; i < 20; i++) {
            executor.submit(() -> {
                String threadName = Thread.currentThread().getName();
                try {
                    while (!Thread.currentThread().isInterrupted()) { // 检查中断状态
                        System.out.println(threadName + " is running.");
                        Thread.sleep(1000); // 模拟执行时间，期间可能被中断
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt(); // 保持中断状态
                    System.out.println(threadName + " was interrupted and will exit.");
                }
            });
        }
    }
}
```
在上述示例中，线程池会在以下几种情况下关闭：

1. **接收到外部中断信号（如Ctrl+C）**：当用户通过终端发送中断信号（通常是`SIGINT`），Java虚拟机接收到这一信号后，会执行预先注册的`ShutdownHook`。在这个例子中，`ShutdownHook`会调用`executor.shutdown()`开始关闭线程池的过程，不再接受新的任务，并尝试让已提交的任务执行完毕。
    ::: tip
    当JVM（Java虚拟机）准备关闭时，无论是因为正常执行结束、系统关闭、用户中断（如按下Ctrl+C）还是调用了System.exit()方法，所有已注册的`shutdown hooks`会被JVM依次执行。
    :::

2. **所有任务自然完成**：当Java应用程序自然结束(正常退出)，无论是因为所有非守护线程执行完毕，还是通过调用System.exit(int)显式退出，都会触发关闭钩子的执行。

3. **超时等待**：在`awaitTermination`方法中，如果在指定的时间（例如，本例中的60秒）内，所有任务未能完成，那么会调用`shutdownNow()`强行中断所有正在执行的任务，并尝试停止线程池。

4. **中断等待**：在等待线程池关闭的过程中，如果主线程自身被中断（通过`InterruptedException`捕获到），则会调用`shutdownNow()`强制关闭线程池，以响应中断请求。

总之，线程池会在程序主动请求关闭（如通过外部中断或程序内部逻辑）、所有任务执行完毕或遇到关闭超时/中断等待的情况下关闭。这样的设计旨在确保线程池能够根据不同的运行环境和条件，安全且高效地完成其生命周期管理。


::: info 检查线程池的状态
**`isShutdown`**

- 此方法用于检查线程池是否已经启动了关闭流程。一旦调用了`shutdown()`或`shutdownNow()`方法，线程池就会进入“已关闭”状态，此时线程池不再接受新的任务提交，但已提交的任务（包括正在执行的和队列中等待的任务）仍会继续执行。
- 当你想要确认线程池是否已经不允许新任务的提交，可以使用此方法。这有助于决定是否需要提交新任务，或是采取其他措施，如直接执行任务、记录日志或抛出异常。

**`isTerminated`**

- 此方法用来检查线程池是否已经完全终止，即不仅启动了关闭流程，而且所有任务（包括已提交的任务和所有正在执行的任务）都已经完成执行，并且线程池已经清空了工作队列，没有任何线程在执行任务。只有当`shutdown()`或`shutdownNow()`调用后，所有任务都执行完毕（或被取消），并且所有线程都已退出，此方法才会返回`true`。
- 当你需要确保线程池中的所有活动都已结束，可以使用此方法来判断是否可以安全地进行资源回收、关闭其他相关服务或是退出程序。这对于确保程序能够干净、完整地结束非常有用。

**isShutdown和isTerminated的区别**：
- **主要差异**：`isShutdown`仅表明线程池是否开始拒绝新任务的提交，而`isTerminated`则进一步说明线程池是否已经完成了所有任务且所有线程都已退出。简而言之，`isShutdown`表示关闭过程的开始，而`isTerminated`表示关闭过程的彻底完成。
- **组合使用**：在实际应用中，常常会先调用`shutdown()`或`shutdownNow()`来启动关闭流程，然后通过轮询`isTerminated`配合`awaitTermination(long timeout, TimeUnit unit)`来等待线程池完全终止，这在需要确保所有任务完成后再进行后续操作的场景中非常常见。

```java
ExecutorService executor = Executors.newFixedThreadPool(10);

// 提交任务...
executor.shutdown(); // 或者 executor.shutdownNow();

while (!executor.isTerminated()) {
    // 等待直到所有任务完成
}

System.out.println("所有任务已完成，线程池已终止。");
```
:::
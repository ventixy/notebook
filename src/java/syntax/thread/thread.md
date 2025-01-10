---

order: 1
title: Java多线程基础

---


## 并发编程基础概念

### 并发与并行

**并发（Concurrency）**:

并发是指两个或多个任务在**同一时间段内**开始、执行和完成，但不意味着它们在物理上同时执行。在单核处理器上，通过==时间片轮转==，CPU快速地在多个任务之间切换，给人一种同时执行的错觉。而在多核处理器上，虽然可以有任务真正并行执行，但并发更侧重于描述任务的调度和执行方式，而非强调物理上的同时性。

并发的关键在于任务的交替执行，即使在单个处理器上也能实现，通过操作系统的线程调度机制来管理。并发编程的目标是提升程序的响应速度和整体吞吐量，使程序能够在执行耗时操作（如I/O操作）时继续处理其他任务。

**并行（Parallelism）**:

并行则是指两个或多个任务在**同一时刻**真正同时执行。这是硬件级别的同时性，要求系统具有多个处理器（或多核CPU）或多个执行单元。在并行计算中，每个任务分配到单独的处理器上，可以同时进行计算，从而显著提高程序执行的速度。

并行处理依赖于硬件资源，没有足够的处理器核心，任务就无法真正并行执行。并行编程通常用于科学计算、大数据处理、机器学习等领域，这些场景下，任务可以被自然地分解成独立的部分，各部分可以同时处理。

::: info 区分并发与并行的区别
- **执行环境**：并发可以在单核和多核处理器上实现，而并行则需要多核或多处理器环境来发挥效果。
- **执行方式**：并发是任务在时间上的重叠，通过任务切换达到“同时”处理的效果；并行则是任务在空间上的同时执行，多个任务真正同时进行。
- **目标**：并发主要是为了提高程序的响应性和效率，通过合理安排任务执行顺序和资源利用来达到目的；并行则是为了加速计算密集型任务的完成，通过增加计算资源的使用来直接缩短任务执行时间。
:::

- 串行：一个任务接一个任务按顺序执行

- 并发：指两个或多个事件在同一个时间段内发生

- 并行：指两个或多个事件在同一时刻发生（同时发生）




### 同步和异步

**同步（Synchronous）**：

同步执行模式下，程序按照既定的顺序执行，每个操作必须等待前一个操作完成才能开始。这意味着，在执行某个可能耗时的操作（如I/O操作、网络通信）时，当前线程会阻塞，直到该操作完成。同步执行保证了操作的顺序性和一致性，但可能会降低程序的响应速度和并发处理能力。

**常见实现**：
- **synchronized关键字**：用于方法或代码块，确保同一时刻只有一个线程可以访问被保护的资源，防止数据竞争条件。
- **Lock接口**：提供比`synchronized`更灵活的锁定机制，如可中断锁、定时锁等。

**使用场景**：适用于需要严格顺序执行的任务，或者当资源访问需要高度一致性和原子性时，如银行账户转账、库存管理等。


**异步（Asynchronous）**：

异步执行模式允许程序在发起一个操作后，不等待其完成即可继续执行后续代码，通过回调、Future/Promise、CompletableFuture等机制在操作完成后处理结果。异步执行可以充分利用多核处理器，提高程序的并发处理能力和响应速度，避免了线程的长时间阻塞。

**常见实现**：
- **Future与CompletableFuture**：Future代表一个异步计算的结果，可以获取计算状态和结果。CompletableFuture是Java 8引入的，提供了更丰富的链式调用和组合异步操作的能力。
- **回调（Callback）**：通过传递一个函数作为参数，当异步操作完成时自动调用该函数处理结果。
- **事件驱动和观察者模式**：通过注册事件监听器或观察者，在特定事件发生时通知并处理。

**使用场景**：适用于需要高性能、高并发处理的场景，如Web服务中的请求处理、大量数据的后台处理、文件上传下载等。


::: info 同步与异步的区别
- **执行流程**：同步是线性的，按顺序执行；异步是非阻塞的，可以同时进行多个操作。
- **响应性**：异步提高程序响应速度，因为它不等待耗时操作完成；同步可能导致UI冻结或响应延迟。
- **复杂度**：异步编程通常比同步编程更为复杂，需要处理回调地狱、线程同步等问题。
- **资源利用**：异步能更好地利用多核CPU，提高资源使用率；同步则可能造成资源闲置。
:::




### 线程与进程

**进程（Process）**：

进程是一个独立的执行环境，拥有独立的内存空间、系统资源（如打开的文件句柄、网络连接等），并由操作系统进行调度。每个进程都包含一个或多个线程，它是==操作系统进行资源分配和调度的基本单位==。一个程序至少对应一个进程，当运行一个Java程序时，JVM实例就是一个进程。

**进程特点**：
- 进程之间内存空间相互隔离。
- 进程创建开销大，包括分配内存空间、加载程序代码等。
- 进程间通信（IPC）通常较复杂，需要使用管道、套接字、共享内存等机制。


**线程（Thread）**：

线程是进程内的一个执行单元，是==CPU调度的基本单位==。线程共享所属进程的内存空间和资源，使得线程间的通信变得简单高效。在Java中，可以通过继承`Thread`类或实现`Runnable`接口来创建线程。

**线程特点**：
- 线程轻量级，创建和销毁成本相对较低。
- 同一进程内的线程共享该进程的资源，包括内存、文件句柄等。
- 线程间可以直接访问共享数据，因此需要适当的同步机制（如`synchronized`关键字、Locks等）来防止数据不一致问题。
- 线程的状态包括新建（New）、可运行（Runnable）、阻塞（Blocked）、等待（Waiting）、超时等待（Timed Waiting）和终止（Terminated）。

::: info 
Java中线程的优势主要包括以下几点：

1. **提高响应速度和用户体验**：多线程允许程序在执行耗时操作（如I/O操作）的同时处理其他任务，从而减少阻塞，提高程序的响应速度和用户界面的交互性。

2. **增强并发性**：多线程能够并行执行多个任务，充分利用多核处理器的计算能力，提高程序的并发执行能力，处理更多并发请求。

3. **资源利用率**：通过多线程，可以更有效地利用CPU资源，减少CPU空闲时间，同时在进行I/O密集型任务时，可以利用线程切换执行其他任务，保持CPU忙碌。

4. **模块化和简化编程**：多线程可以把复杂的任务分解为多个独立运行的子任务，便于模块化编程，使得程序结构更加清晰，易于理解和维护。

5. **提高系统稳定性和容错性**：线程间的独立性意味着单个线程的异常不会直接影响整个程序，增强了系统的稳定性和健壮性。

然而，使用线程也伴随着一定的成本和缺点：

1. **上下文切换开销**：操作系统在不同线程间切换执行时需要保存和恢复线程的上下文信息，这会消耗CPU时间。

2. **资源争抢和同步问题**：多个线程共享资源可能导致竞态条件、死锁和数据不一致性，解决这些问题需要额外的同步机制，如锁、同步块等，这会增加编程复杂度和潜在的性能损耗。

3. **线程创建和销毁的开销**：频繁创建和销毁线程需要消耗系统资源，尤其是对于短生命周期的线程。

4. **死锁和活锁风险**：不当的线程同步可能导致死锁，即两个或多个线程互相等待对方释放资源而永久阻塞。另外，活锁是指线程由于逻辑问题持续重复尝试而无法进展的情况。

5. **调试和维护困难**：多线程程序的调试和维护相对单线程程序更加复杂，因为线程间的交互和数据共享可能导致非确定性的行为。

虽然Java中的多线程编程能够带来显著的性能和响应性提升，但同时也需要谨慎设计，以避免引入潜在的并发问题和性能瓶颈。合理利用线程池等技术可以减轻一些管理线程的负担，优化资源利用。
:::


**进程和线程的简单总结**：
- 进程： 是指一个在内存中运行的应用程序，每个进程都有一个独立的内存空间。一个进程最少有一个线程
- 线程： 是进程中的一个执行路径，共享一个内存空间，线程之间可以自由切换，并发执行。  
  线程实际上是在进程基础之上的进一步划分，一个进程启动之后，里面的若干执行路径又可以划分成若干个线程



### 管程(Monitor)

“Monitor”这个词来源于操作系统理论，最早是由C.A.R Hoare在1974年提出的。在计算机科学中，“Monitor”被翻译为“管程”，这一术语源自英文“Monitor”和“Monitor Procedures”，意在强调其管理和协调并发访问的职责，以及其作为一种同步机制的高级抽象概念。

::: tip
- 在Java中，每个对象实例都隐含了一个基于其对象头信息的Monitor（监视器）机制，用于实现对对象的线程安全访问控制。包括了锁的获取与释放、线程的阻塞与唤醒等功能。

- `Monitor`这个概念在计算机科学和Java并发编程领域中，通常可以称为 ==“管程”（从英文直译，强调其管理、协调并发访问的职能）== 或 ==“监视器”（强调其监控、控制访问的功能）==
:::

每个Java对象实例都有一个 **对象头（Object Header）**。对象头是Java对象在内存中的存储布局的一部分，它包含了对象的重要元数据，对于理解对象的身份、类型信息、锁定状态以及垃圾收集等至关重要。对象头通常包含以下两部分信息：

1. **Mark Word（标记字）**：这个部分存储了对象自身的运行时数据，例如：
   - 哈希码（HashCode）
   - GC分代年龄（用于垃圾回收算法）
   - 锁状态标志（表明对象是否被锁定，以及使用的是哪种锁，如轻量级锁、重量级锁、偏向锁等）
   - 线程持有的锁信息
   - 偏向线程ID和偏向时间戳（偏向锁相关）
   - 其他状态信息如对象是否处于未初始化状态等

2. **类型指针（Class Pointer / Type Metadata Address）**：这个部分指向了对象的类元数据，即对象所属的类的信息，位于方法区（Metaspace）中。虚拟机通过这个指针来确定该对象属于哪个类的实例。对于数组对象，这个部分还会包括数组的长度信息。


对象头的具体结构（如Mark Word的大小、是否包含类型指针等）可能会根据Java虚拟机（JVM）的实现细节、运行时环境（如32位或64位系统）以及是否开启压缩指针等配置有所不同。





### 线程调度方式

由于CPU的计算频率非常高，每秒计算数十亿次，因此可以将CPU的时间从毫秒的维度进行分段，每一小段叫作一个CPU时间片。

- 目前操作系统中主流的线程调度方式是：基于CPU时间片方式进行线程调度

- 线程调度：给线程分配CPU时间片的过程。

::: info 线程调度分类
- 协同式线程调度：线程的执行时间是由线程本身决定. 该线程的内容执行完后,报告操作系统进行切换.

- 分时调度模型：所有线程轮流使用 CPU 的使用权，平均分配每个线程占用 CPU 的时间片 

- 抢占式调度模型：优先让优先级高的线程使用 CPU，如果线程的优先级相同，那么会随机选择一 个，优先级高的线程获取的 CPU 时间片相对多一些 
:::
  

**Java使用的是抢占式调度模型** ：由于目前大部分操作系统都是使用抢占式调度模型进行线程调度，Java的线程管理和调度是委托给操作系统完成的，与之相对应，Java的线程调度也是使用抢占式调度模型


::: tip 随机性
假如计算机只有一个 CPU，那么 CPU 在某一个时刻只能执行一条指令，线程只有得到CPU时间片，也就是使用权，才可以执行指令。即多线程程序的执行是有随机性，因为谁抢到CPU的使用权是不一 定的
:::


### 线程优先级

操作系统的线程优先级: （静态优先级+动态优先级）

- 静态优先级:固定值
- 动态优先级:正在的线程会随着执行时间的延长优先级会降低, 正在等待的线程的优先级会随着等待时间的延长,优先级会升高



::: info java中的优先级到底为什么没有用？
**java中优先级是静态优先级, 只是向操作系统建议**，我们在java语言中设置的线程优先级，它仅仅只能被看做是一种"建议"(对操作系统的建议)，实际上，操作系统本身，有它自己的一套线程优先级 (静态优先级 + 动态优先级)，故而即使设置了线程优先级，也不能保证执行顺序！

 **java官方说明**： 线程优先级并非完全没有用，我们Thread的优先级，它具有统计意义，总的来说，高优先级的线程占用的cpu执行时间多一点，低优先级线程，占用cpu执行时间，短一点 （也就是说，优先级高最多意味着抢到执行权的可能性高一点点而已！）
:::


Java为线程类提供了10个优先级，优先级可以用整数1-10表示，超过范围会抛出异常，主线程默认优先级为5

**Thread类的优先级常量**：

```java
// The minimum priority that a thread can have.
public final static int MIN_PRIORITY = 1;    

// The default priority that is assigned to a thread.
public final static int NORM_PRIORITY = 5;  

// The maximum priority that a thread can have.
public final static int MAX_PRIORITY = 10;   
```

优先级相关的方法：

| 方法                                     | 说明                 |
| ---------------------------------------- | -------------------- |
| public int getPriority()                 | 获取线程优先级的方法 |
| public void setPriority(int newPriority) | 设置线程优先级的方法 |



### 锁的粒度

锁的粒度是指在并发控制中，锁所覆盖的数据范围或资源的大小。锁的粒度主要体现在以下几个方面：

::: info 锁的粒度
1. **资源的大小**：锁可以应用于不同大小的资源上。比如，可以锁定一个数据库表、一个页面、一个记录（行）或是更小的单位，如对象中的某个字段。资源越小，锁的粒度就越细。

2. **代码范围**：在编程中，锁通常应用于特定的代码段，以保证在这段代码执行期间对资源的独占访问。锁的代码范围越小，锁的粒度也就越细，反之则越粗。
:::

**并发度**：细粒度的锁允许更多的并发访问，因为它们只锁定必要的最小资源；而粗粒度的锁则限制了并发度，因为它们锁定了更大的资源范围，导致更多的线程被阻塞。

**性能开销**：细粒度的锁可能需要更频繁的加锁和解锁操作，这会增加系统开销；而粗粒度的锁虽然减少了加锁解锁的频率，但可能降低了并发性，导致更多的线程等待。


锁的粒度不是越小越好，也不是越大越好，而是需要根据具体情况权衡。选择最佳锁粒度的关键在于理解应用程序的访问模式和数据结构。

- **访问模式**：如果数据结构的大部分访问是读取，且写入操作很少且互不干扰，使用细粒度锁可能更合适。反之，如果数据结构的访问以写入为主，或者写入操作之间有相互依赖，使用粗粒度锁可能更简单且更高效。
- **数据结构**：数据结构的特性也会影响锁的选择。例如，对于链表或树形结构，细粒度锁可以更好地支持并发访问；而对于单一的大块数据，粗粒度锁可能更合适。
- **性能测试**：在实践中，需要通过性能测试来确定哪种锁粒度最适合特定的应用场景。测试应涵盖不同级别的并发和不同的数据访问模式，以找出在特定条件下表现最佳的锁粒度。

::: info 控制锁粒度的策略
- **使用适当的锁类型**：Java提供了多种锁机制，如`synchronized`关键字、`ReentrantLock`、`ReadWriteLock`等，选择合适的锁类型可以帮助控制锁的粒度。
- **锁分区**：将大的数据结构划分为多个部分，每个部分由单独的锁保护，这是一种常见的提高并发性的策略。
- **非阻塞算法**：使用原子操作和CAS（Compare and Swap）指令等非阻塞算法可以在不需要锁的情况下实现线程安全，从而减少锁的使用。
- **锁细化**：对于需要频繁访问的数据，可以考虑使用细粒度锁，而对于访问频率较低的数据，可以使用粗粒度锁。
:::


### 锁的本质

Java中的锁机制主要通过两种底层实现方式：基于Monitor的锁和基于AbstractQueuedSynchronizer (AQS)的锁。

::: info Monitor和AQS
#### synchronized

`synchronized`关键字是Java中内置的语言级同步机制。当一个线程访问某个对象的`synchronized`方法或代码块时，它将获取该对象的锁。这个锁实际上是对对象监视器（Monitor）的获取，而监视器是JVM的一个内部概念，它控制着对对象状态的独占访问。这个过程涉及到对象头中的Mark Word的更新，Mark Word中包含锁状态信息。当一个线程获得了锁，它会修改Mark Word以表明锁的状态，并且其他线程必须等待直到锁被释放。

#### AQS与Unsafe

AQS是Java并发包中的一个框架，用于构建更复杂的同步组件如`ReentrantLock`和`Semaphore`等。AQS使用了一个内部队列来管理等待线程，它允许更细粒度的锁控制。AQS中核心的方法如`compareAndSet`（CAS操作）是通过`Unsafe`类实现的。`Unsafe`类提供了直接访问底层内存和CPU指令的能力，其中就包括了原子操作，如`compareAndSwapInt`、`compareAndSwapLong`等，这些方法能够保证即使在多处理器环境下，对共享变量的读-改-写操作也具有原子性。
:::

从上述分析中我们可以看出，锁的本质确实与==共享变量的原子操作==有关，但更准确地说，==锁是一种协调多个线程对共享资源访问的机制==，它确保了在任何时刻只有一个线程能够访问特定的资源。在实现上，锁通过原子操作（如CAS）来维护一个或多个共享变量的状态，这些操作保证了在并发环境中对这些变量的访问不会发生数据竞争。因此，可以说锁的实现依赖于原子操作，但锁本身是一个更高层次的概念，它处理的是资源访问的互斥性和一致性问题。

总结来说，锁的实现涉及到了共享变量的原子操作，但这只是其实现细节的一部分，锁的真正价值在于它提供了一种机制，使得多个线程可以在共享资源上协同工作，同时避免了数据不一致和竞态条件等问题。




## 线程的创建与启动


### 继承Thread

继承Thread实现多线程的步骤：

- 定义一个继承Thread的类， 并重写`run()`方法 

- 创建这个类的对象， 通过`start()`方法启动线程

```java
public class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(Thread.currentThread().getName() + "——" + i);
        }
    }
}
```

```java
public class ThreadDemo1 {
    public static void main(String[] args) {
        MyThread th1 = new MyThread();
        MyThread th2 = new MyThread();

        th1.start();
        th2.start();
    }
}
```

- `run()`：用来封装被线程执行的代码
- `start()`：启动线程；然后由JVM调用此线程的run()方法

::: info run方法跟start方法的区别
- run方法根本就没有开辟新的执行路径,还是按照顺序执行的，直接调用run方法,相当于普通成员方法调用

- start方法才是真正的去创建线程
- 只有run方法当中的代码才会执行在子线程中,我们要把我们的代码写到run方法中,并且启动的时候一定是start方法
:::

【注意】

- 同1个线程,能否启动多次? 
    不可以,  同一个线程多次启动会报异常(`java.lang.IllegalThreadStateException`)

- ​谁才代表一个真正的线程?  Thread类的对象及其子类的对象才代表1个线程




### 实现Runnable

通过实现Runnable接口实现多线程的步骤：

- 定义一个实现Runnable接口的类， 并在类中重写`run()`方法 
- 创建该类的对象，创建Thread类的对象，把该类的对象作为Thread类的构造方法参数
- 通过`start()` 启动线程

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(Thread.currentThread().getName() + "——" + i);
        }
    }
}
```

```java
public class ThreadDemo2 {
    public static void main(String[] args) {
        MyRunnable task = new MyRunnable();
        Thread t1 = new Thread(task, "T1");
        Thread t2 = new Thread(task, "T2");

        t1.start();
        t2.start();
    }
}
```

实现Runnable相对于继承Thread有如下优势：

- 可以实现多个接口，避免单继承带来的局限性
- 通过先创建任务，然后创建线程的方式来实现，任务与线程分离，提高了程序的健壮性
- 线程池接收Runnable类型的任务，但不接收Thread类型的对象



**可以通过匿名内部类的方式实现**：

```java
public static void main(String[] args) {
    new Thread(new Runnable() {
        @Override
        public void run() {
            for (int i = 0; i < 10; i++) {
                System.out.println(Thread.currentThread().getName() + i);
            }
        }
    }).start();
}
```

**上述案例的Lambda表达式**：

```java
new Thread(()->{
    for (int i = 0; i < 10; i++) {
        System.out.println(Thread.currentThread().getName() + i);
    }
}).start();
```





### 实现Callable

`Callable`是一个具有泛型参数的接口，位于`java.util.concurrent`包中，与`Runnable`接口类似，但提供了更强大的功能。`Callable`定义了一个`call()`方法，该方法可以返回一个结果，并且可以抛出异常，这使得它比仅仅执行工作的`Runnable`更加灵活和强大。Thread类和Runnable接口都不允许声明检查型异常，也不能定义返回值

```java
public interface Callable<V> {
    V call() throws Exception;   // `<V>`: 泛型参数，表示`call()`方法返回的结果类型
}
```
当需要执行一个可能产生结果或抛出异常的任务时，可以使用`Callable`。


::: tip Runnable 与 Callable的不同点
（1）Callable规定的方法是call()，而Runnable规定的方法是run()。

（2）Callable的任务执行后可返回值，而Runnable的任务是不能返回值的。

（3）call()方法可抛出异常，而run()方法是不能抛出异常的。

（4）运行Callable任务可拿到一个Future对象。
:::


Callable使用步骤：

1. 编写类实现Callable接口 , 实现call方法
2. 创建FutureTask对象 , 并传入第一步编写的Callable类对象
3. 通过Thread, 启动线程

```java
public class MyCallable implements Callable {
    @Override
    public Integer call() throws Exception {
        int sum = 0;
        for (int i = 0; i < 100000; i++) {
            sum += i;
        }
        return sum;
    }
}
```

```java
public class CallableDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        MyCallable myCallable = new MyCallable();
        // 执行Callable的任务，需要用FutureTask来接收运算结果
        FutureTask<Integer> futureTask = new FutureTask<Integer>(myCallable);

        new Thread(futureTask).start();

        // 接收线程运算后的结果（调用FutureTask对象的get()方法阻塞性地获得并发线程的执行结果）
        Integer result = futureTask.get();
        System.out.println(result);
    }
}
```

::: info Future接口
`Future`代表一个异步计算的结果。它提供了检查计算是否完成、获取计算结果以及取消计算的方法。`Future`接口允许你处理异步操作的结果，即使操作尚未完成。它通常与`ExecutorService`结合使用，通过`submit(Callable)`方法提交任务后返回一个`Future`实例。

- **常用方法**:
  - `boolean cancel(boolean mayInterruptIfRunning)`: 尝试取消任务的执行。
  - `boolean isCancelled()`: 判断任务是否已经被取消。
  - `boolean isDone()`: 判断任务是否已经完成。
  - `V get() throws InterruptedException, ExecutionException`: 等待计算完成并返回结果，可能会抛出异常。
  - `V get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException`: 等待指定时间获取结果，超时则抛出异常。
:::



## 线程状态及其转换

### 线程状态的划分

关于Java线程状态的数量，常见的说法确实有两种：五种和六种。这种差异主要来源于对线程状态的分类和解释方式不同。根据不同的教材、文章或讨论，可能会看到对Java线程状态数量的不同表述。

**五种状态的划分**通常包括：
1. **New（新建）**: 线程被创建但尚未启动。
2. **Ready（可运行/就绪）**: 线程已经调用了`start()`方法，可以被线程调度器选中运行，但尚未获得CPU时间片。
3. **Running（运行）**: 线程正在执行，获得了CPU时间片。
4. **Blocked（阻塞）**: 线程因为某些原因（如等待锁、I/O操作等）而暂停执行，等待某个条件满足后才能继续。
5. **Dead（死亡）**: 线程执行完毕或因异常终止。

这种划分方式中，“Ready”状态有时被看作是线程等待CPU调度的时间，而一旦获得CPU，就直接进入“Running”状态，这种划分==没有明确区分操作系统层面的就绪状态和运行状态==。

五种状态的划分其实更像==操作系统的线程状态==， 但是操作系统通常没有 `New` 这一线程状态

五种状态线程在各种状态之间转换（这只是帮助理解的状态模型，并非真正的java线程状态）：

![](https://image.ventix.top/java/image-20220223201814461.png)


六种状态的划分更细致，特别是区分了`等待状态`和`超时等待状态`

**六种状态的划分**则通常包括：
1. **New（新建）**: 同上。
2. **Runnable（可运行）**: 这个状态合并了操作系统层面的就绪（ready）和运行（running）状态，表示线程已经调用了`start()`方法，可以被CPU调度执行，但不一定正在执行（可能在就绪队列中等待）。
3. **Blocked（阻塞）**: 同上。
4. **Waiting（等待）**: 线程因调用`wait()`、`join()`无参方法或`LockSupport.park()`等而等待特定条件，需要其他线程唤醒。
5. **Timed Waiting（超时等待）**: 线程因调用带超时参数的方法如`sleep(long millis)`、`wait(long timeout)`、`join(long millis)`或`LockSupport.parkNanos(long nanos)`而等待，超时后自动返回。
6. **Terminated（终止）**: 同Dead（死亡）。

操作系统的线程状态划分通常更为基础和通用，而Java作为高级语言，其线程模型在操作系统的线程状态基础上进行了抽象和扩展，以适应高级语言的特性和需求。


::: info Java线程状态对应的操作系统线程状态
| Java线程状态       | 操作系统(Linux)线程状态         | 描述                                                         |
|------------------|----------------------|--------------------------------------------------------------|
| New (新建)        | -                    | 线程被创建，但尚未调用start()方法启动                           |
| Runnable (可运行)  | Ready + Running      | 线程可以被CPU调度执行，包括就绪和正在执行两种子状态，Java不区分     |
| Blocked (阻塞)    | Blocked              | 等待获取监视器锁或执行I/O操作等，无法继续执行                     |
| Waiting (等待)    | Blocked              | 等待其他线程执行特定操作（如notify()）唤醒，与Blocked状态共享物理状态 |
| Timed Waiting (超时等待) | Blocked            | 与Waiting类似，但有超时限制，超时后自动返回Runnable状态           |
| Terminated (终止)  | Terminated/Dead      | 线程执行结束或因异常终止                                       |
:::
Java线程的状态控制（如进入阻塞、等待、休眠状态等）是由Java虚拟机(JVM)来管理的，而Java线程的创建、调度（线程的实际CPU执行时间分配）和销毁 则是由操作系统内核的线程调度器来完成。这种分工使得Java能够提供跨平台的线程管理，同时利用操作系统的底层能力进行高效的线程执行。




### 六种线程状态
Java中线程的生命周期分为6种状态。Thread类有一个实例属性和一个实例方法专门用于保存和获取线程的状态。其中，用于保存线程Thread实例状态的实例属性为threadStatus，以下为Thread类相关属性：

```java
// Java thread status for tools,  initialized to indicate thread 'not yet started'
private volatile int threadStatus = 0;

// Returns the state of this thread.
public State getState() {
    // get current thread state
    return sun.misc.VM.toThreadState(threadStatus);
}
```



Thread.State是一个内部枚举类，定义了6个枚举常量，分别代表Java线程的6种状态，具体如下：

```java
public enum State {
    NEW,             // 新建
    RUNNABLE,        // 可执行（包含操作系统的就绪、运行两种状态）
    BLOCKED,         // 阻塞
    WAITING,         // 等待
    TIMED_WAITING,   // 限时等待
    TERMINATED;      // 终止
}
```

**六种线程状态详解**：

1. **新建（New）**:
   当使用`new`关键字创建一个`Thread`对象时，线程处于新建状态。此时，线程尚未启动，也不具备执行资格。Java源码对NEW状态的说明是：创建成功但是没有调用start()方法启动的Thread线程实例都处于NEW状态。

2. **可运行（Runnable）**:
    Java把 `Ready（就绪）`和`Running（执行）`两种状态合并为一种状态：`RUNNABLE（可执行）`状态。当Java线程的Thread实例的start()方法被调用后，操作系统中的对应线程进入的并不是运行状态，而是就绪状态，而Java线程并没有这个就绪状态。JVM的线程状态与其幕后的操作系统线程状态之间的转换关系简化后如图：

  ![](https://image.ventix.top/java/image-20220223212210867.png)

::: info 线程进入就绪状态（Runnable）的条件
1. **线程创建后调用`start()`方法**：当使用`new`关键字创建一个线程对象后，调用该线程的`start()`方法，线程将从新建状态进入就绪状态。

2. **线程从阻塞状态恢复**：如果线程之前因为以下原因之一被阻塞，当这些条件解除时，线程会进入就绪状态：
   - **等待的I/O操作完成**：例如，读写文件、网络通信等I/O操作完成。
   - **`sleep()`方法结束**：线程执行`Thread.sleep(long millis)`后，经过指定的毫秒数，线程结束休眠。
   - **等待的监视器锁（锁）获得**：如果线程因为试图获取一个对象的锁而被阻塞（例如进入`synchronized`块），当持有锁的线程释放锁后，等待的线程可能变为就绪。
   - **`join()`方法等待的线程结束**：如果线程调用了另一个线程的`join()`方法等待其结束，当被加入的线程执行完毕，等待的线程变为就绪。
   - **等待条件满足或被`notify()`/`notifyAll()`唤醒**：如果线程在等待条件变量（使用`Object.wait()`），当其他线程调用同一对象的`notify()`或`notifyAll()`方法，或等待的条件被满足，线程变为就绪。

3. **`yield()`方法的使用**：虽然不常见，但如果一个运行中的线程调用了`Thread.yield()`方法，它可能会从运行状态转为就绪状态，给同优先级的其他线程执行的机会，但这取决于JVM的具体实现和当前系统的线程调度策略。
:::

3. **阻塞（Blocked）**:
   当线程在执行过程中遇到某些条件而不能继续执行时，会进入阻塞状态。阻塞的原因可能包括：
   - **等待获取监视器锁**：试图进入同步代码块或方法，但锁被其他线程持有。
   - **等待I/O操作**：如读写文件、网络通信等。
   - **等待唤醒**：调用了`Object.wait()`方法，等待其他线程的`notify()`或`notifyAll()`。

4. **等待（Waiting）**:
   线程因调用了以下方法之一而进入等待状态，直到其他线程执行特定操作才会返回到可运行状态：
   - `Object.wait()`：等待其他线程调用此对象的`notify()`或`notifyAll()`方法。
   - `Thread.join()`：等待调用此方法的线程结束。
   - `LockSupport.park()`：除非收到许可，否则一直等待。
        对应的唤醒方式为：`LockSupport.unpark(Thread)`

![](https://image.ventix.top/java/image-20220223210052497.png)

5. **超时等待（Timed Waiting）**:
   与等待状态相似，但线程在指定的时间后会自动返回到可运行状态，无论是否收到了预期的通知或事件。进入此状态的方法包括但不限于：
   - `Thread.sleep(long millis)`：使当前正在执行的线程暂停执行指定的毫秒数。
   - `Object.wait(long timeout)`：带有超时参数的等待。
   - `Thread.join(long millis)`：带有超时参数的线程加入。
   - `LockSupport.parkNanos(long nanos)`：等待纳秒数后返回。

6. **终止（Terminated）**:
   当线程的`run()`方法正常执行完毕，或者因异常退出，线程进入终止状态，不再具有执行资格。






### 线程控制API

- `sleep()` ：释放资源，自己休眠，让其他线程先执行。

  sleep的作用是让目前正在执行的线程休眠，让CPU去执行其他的任务。从线程状态来说，就是从执行状态变成限时阻塞状态

  ```java
  // sleep 案例
  new Thread(new Runnable() {
      @Override
      public void run() {
          for (int i = 0; i < 10; i++) {
              try {
                  Thread.currentThread().sleep(500);  // 休眠半秒
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
              System.out.println(Thread.currentThread().getName() + i);
          }
      }
  }).start();
  ```

  

- `join()`： 抢占资源，让自己占有线程， 先执行完毕后（或达到指定时间）才释放资源。( <font color=red>可以用来保证执行顺序</font> ) 

    `join()`方法属于`Thread`类，主要有以下几种形式：

    1. `void join()`: 让当前线程等待调用此方法的线程执行完毕。如果没有指定等待时间，当前线程将一直等待，直到目标线程执行结束。

    2. `void join(long millis)`: 让当前线程最多等待指定的毫秒数，等待目标线程结束。如果目标线程在这段时间内结束，则当前线程继续执行；如果超时时间到达目标线程仍未结束，则当前线程不再等待。

    3. `void join(long millis, int nanos)`: 同上，但除了毫秒外还可以指定纳秒级别的等待时间，进一步精确控制等待时长。

::: info 使用场景

1. **按序执行任务**：当需要确保某些任务按特定顺序执行时，可以使用`join()`方法。例如，数据处理任务必须在数据收集任务完成后开始。

2. **同步控制**：在多线程环境中，有时需要确保一个线程的输出作为另一个线程的输入，这时可以利用`join()`来同步这两个线程。

3. **资源清理**：在程序结束前，可能需要等待所有工作线程完成，确保资源正确释放或数据一致，此时可以通过在主线程中调用各个工作线程的`join()`来实现。
::: 

  ```java
  // join 案例
  public class JoinDemo {
      public static void main(String[] args) throws InterruptedException {
          MyThread thread0 = new MyThread();
          MyThread thread1 = new MyThread();
          MyThread thread2 = new MyThread();
  
          thread0.start();
          thread0.join();   //Thread-0 执行完毕后，Thread-1和Thread-2才能执行
          thread1.start();
          thread2.start();
      }
  }
  ```

  ![](https://image.ventix.top/java/image-20211019020845359.png)

  

  

- `yield()`： 暂停当前正在执行的线程对象，并执行其他线程 （**注意该方法并不能保证执行顺序**）

  - 线程的yield（让步）操作的作用是让目前正在执行的线程放弃当前的执行，让出CPU的执行权限，使得CPU去执行其他的线程。
  - 处于让步状态的JVM层面的线程状态仍然是RUNNABLE状态，**它不会阻塞该线程，但是该线程所对应的操作系统层面的线程从状态上来说会从执行状态变成就绪状态**。
  
  - 线程在yield时，线程放弃和重占CPU的时间是不确定的，可能是刚刚放弃CPU，马上又获得CPU执行权限，重新开始执行。
  
  
  ::: info Thread.yeid()方法有以下特点：
  
  （1）yield仅能使一个线程从运行状态转到就绪状态，而不是阻塞状态。
  
  （2）yield不能保证使得当前正在运行的线程迅速转换到就绪状态。
  
  （3）即使完成了迅速切换，系统通过线程调度机制从所有就绪线程中挑选下一个执行线程时，就绪的线程有可能被选中，也有可能不被选中，其调度的过程受到其他因素（如优先级）的影响。
  :::




### 线程中断机制

Java中的线程中断机制是一种协作机制，它允许一个线程向另一个线程发出中断请求，但并不直接停止目标线程的执行。目标线程需要主动检查中断状态并做出相应处理。下面是详细的解释、使用场景、注意事项及代码示例。

1. **中断标志**：每个Java线程都有一个中断状态位，可以通过`Thread.interrupt()`方法设置这个标志为true。被中断的线程可以调用`Thread.isInterrupted()`检查中断状态，或者在抛出中断异常（如在`sleep()`, `wait()`, `join()`等阻塞方法中）时自动清除中断状态。

2. **响应中断**：中断机制的设计原则是“合作而非强迫”。被中断的线程需要主动检查中断状态并作出响应，如结束执行、清理资源或抛出自定义的中断异常等。

::: tip 使用场景和注意事项
#### 使用场景
1. **取消任务**：用户请求取消一个耗时操作时，可以通过中断线程来通知执行任务的线程。
2. **超时处理**：在执行可能阻塞的操作时设置超时，超时后中断线程。
3. **关闭服务**：在服务关闭时，中断所有工作线程，促使它们尽快完成并退出。

#### 注意事项
1. **检查中断状态**：线程应定期检查中断状态，特别是在循环或可能阻塞的方法调用前后。
2. **清理资源**：在响应中断时，确保释放所有资源，避免资源泄露。
3. **中断状态的清除**：调用阻塞方法（如`Thread.sleep()`）时，如果线程被中断，这些方法会抛出`InterruptedException`并清除中断状态。需要在捕获异常后重新中断线程，以便上层代码知晓中断的发生。
4. **不要忽视中断**：忽略中断请求可能会导致程序难以控制或资源无法释放。
:::

以下是一个简单的线程中断示例，展示如何发起中断请求和响应中断：

```java
public class InterruptExample {

    public static void main(String[] args) throws InterruptedException {
        Thread workerThread = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                // 模拟工作
                System.out.println("Working...");
                try {
                    Thread.sleep(1000); // 模拟耗时操作，可被中断
                } catch (InterruptedException e) {
                    // 捕获中断异常，中断标志会被清除，需要重新设置
                    System.out.println("Interrupted while sleeping. Exiting...");
                    Thread.currentThread().interrupt(); // 重新设置中断标志
                    break;
                }
            }
            }
            System.out.println("Worker thread exiting.");
        });

        workerThread.start();

        // 主线程等待一段时间后中断workerThread
        Thread.sleep(5000);
        workerThread.interrupt();
        System.out.println("Main thread interrupted worker thread.");
    }
}
```


**Thread.interrupt VS Thread.stop**：Thread.stop方法已经不推荐使用了。

在某些方面Thread.stop与中断机制有着相似之处。如：

- 当线程在等待内置锁或IO时，stop跟interrupt一样，不会中止这些操作；

- 最重要的就是<font color=red>中断需要程序自己去检测然后做相应的处理</font>，而Thread.stop会直接在代码执行过程中抛出ThreadDeath错误
- 当catch住stop导致的异常时，程序也可以继续执行，虽然stop本意是要停止线程，这么做会让程序行为变得更加混乱。









## 线程通信与同步

### Object的等待/通知机制

Object的等待/通知机制 是基于对象监视器（Monitor）的一种线程间通信方式，主要通过`wait()`, `notify()`, 和 `notifyAll()`这三个方法来实现。这些方法都是定义在`Object`类中，因此任何对象都可以调用它们。

**wait()**

`wait()`方法使当前线程进入等待（WAITING）状态，并释放它所持有的对象的监视器锁。调用`wait()`的线程会等待，直到其他线程调用同一个对象上的`notify()`或`notifyAll()`方法。`wait()`有两种形式：

- `wait()`：无参数，无限期等待，直到被其他线程通知。
- `wait(long timeout)`：等待指定的毫秒数，如果超时后仍未被通知，则自动醒来。
- `wait(long timeout, int nanos)`：与上类似，但提供了纳秒级精度的超时时间。

**notify()**

`notify()`方法随机唤醒在此对象监视器上等待的一个线程。被唤醒的线程将进入锁的竞争状态，只有获得锁后才能继续执行。如果没有线程在等待，则`notify()`调用不起作用。

**notifyAll()**

`notifyAll()`方法唤醒在此对象监视器上等待的所有线程。同样，被唤醒的线程需要竞争锁，只有获得锁的线程才能继续执行。

::: info 使用场景和注意事项
#### 使用场景
- **生产者-消费者模型**：生产者线程往队列中添加元素后调用`notify()`或`notifyAll()`通知消费者线程，消费者线程在队列为空时调用`wait()`等待。
- **线程同步**：当一个线程需要等待某个条件满足（如资源可用）时调用`wait()`，条件满足后由另一个线程调用`notify()`或`notifyAll()`通知等待线程。

#### 注意事项
1. **必须在同步代码块或方法中调用**：`wait()`, `notify()`, 和 `notifyAll()` 必须在已经获取了对象监视器锁的同步上下文中调用，否则会抛出`IllegalMonitorStateException`。
2. **检查等待条件**：调用`wait()`的线程在被唤醒后，通常需要再次检查等待的条件是否已经满足，因为有可能被虚假唤醒。
3. **唤醒策略**：选择`notify()`还是`notifyAll()`取决于具体需求。如果只有一个等待线程，或仅需唤醒一个线程，使用`notify()`；如果有多个线程等待，且都需要唤醒，则使用`notifyAll()`。
:::


```java
public class WaitNotifyExample {
    private List<String> list = new ArrayList<>();
    private final int MAX_CAPACITY = 5;

    public void produce() throws InterruptedException {
        synchronized (list) {
            while (list.size() == MAX_CAPACITY) {
                System.out.println("List is full, producer is waiting.");
                list.wait();
            }
            list.add("Item");
            System.out.println("Produced an item, list size: " + list.size());
            list.notifyAll();
        }
    }

    public void consume() throws InterruptedException {
        synchronized (list) {
            while (list.isEmpty()) {
                System.out.println("List is empty, consumer is waiting.");
                list.wait();
            }
            String item = list.remove(0);
            System.out.println("Consumed an item, list size: " + list.size());
            list.notifyAll();
        }
    }

    public static void main(String[] args) {
        WaitNotifyExample example = new WaitNotifyExample();
        Thread producer = new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                try {
                    example.produce();
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        Thread consumer = new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                try {
                    example.consume();
                    Thread.sleep(1500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        producer.start();
        consumer.start();
    }
}
```

这段代码展示了典型的生产者-消费者模型，其中`produce()`方法模拟生产过程，`consume()`方法模拟消费过程。通过`wait()`和`notifyAll()`实现了线程间的有效同步。


### Condition接口

`Condition`接口在Java并发编程中扮演着关键角色，它提供了一种灵活的线程间协作机制，允许线程在某一个条件满足时等待，以及由其他线程通知这些等待的线程条件已满足。`Condition`相比于传统的`wait()`和`notify()`/`notifyAll()`方法，提供了更加精细的线程控制能力，尤其是能够绑定到特定的`Lock`上，支持多路通知。

::: tip 如何创建Condition对象
`Condition`接口没有公共构造方法，不能直接通过构造函数创建。它需要通过与`Lock`接口的实现类（如`ReentrantLock`）结合使用来创建。`Condition`对象是通过`Lock`接口的实例方法`newCondition()`得到的

```java
Lock lock = new ReentrantLock();
Condition condition = lock.newCondition();
```
:::

**Condition对象的常用方法**

1. **await()**: 使当前线程等待，直到其他线程调用此`Condition`的`signal()`方法或`signalAll()`方法唤醒它，或者被中断。

2. **signal()**: 唤醒在此`Condition`上等待的一个线程（如果有的话）。被唤醒的线程将从其`await()`调用中返回。

3. **signalAll()**: 唤醒在此`Condition`上等待的所有线程。


下面是一个 利用`Condition`实现生产者消费者模式的示例：

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ProducerConsumerExample {
    // 创建一个简单的缓冲区，生产者线程向缓冲区放入产品，消费者线程从缓冲区取出产品
    private final Queue<Integer> buffer = new LinkedList<>(); // 缓冲区
    private final int capacity = 10; // 缓冲区大小

    // 使用一个锁对象和两个`Condition`对象，分别用于通知生产者和消费者的等待线程
    private final ReentrantLock lock = new ReentrantLock();
    // `notFull`条件变量用于在缓冲区满时让生产者线程等待
    private final Condition notFull = lock.newCondition(); // 缓冲区未满条件
    // `notEmpty`条件变量用于在缓冲区空时让消费者线程等待
    private final Condition notEmpty = lock.newCondition(); // 缓冲区非空条件

    public void produce(int value) throws InterruptedException {
        lock.lock();
        try {
            while (buffer.size() == capacity) { // 如果缓冲区满，生产者等待
                notFull.await();
            }
            buffer.add(value);
            System.out.println("Produced: " + value);
            notEmpty.signal(); // 通知消费者，缓冲区中有新元素
        } finally {
            lock.unlock();
        }
    }

    public void consume() throws InterruptedException {
        lock.lock();
        try {
            while (buffer.isEmpty()) { // 如果缓冲区为空，消费者等待
                notEmpty.await();
            }
            int value = buffer.poll();
            System.out.println("Consumed: " + value);
            notFull.signal(); // 通知生产者，缓冲区有空间了
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) {
        ProducerConsumerExample pc = new ProducerConsumerExample();

        // 启动生产者线程
        Thread producer = new Thread(() -> {
            for (int i = 0; i < 20; i++) {
                try {
                    pc.produce(i);
                    Thread.sleep(500); // 模拟生产时间
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        // 启动消费者线程
        Thread consumer = new Thread(() -> {
            for (int i = 0; i < 20; i++) {
                try {
                    pc.consume();
                    Thread.sleep(800); // 模拟消费时间
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        producer.start();
        consumer.start();
    }
}
```
上例中：
- 生产者调用`notFull.await()`等待，直到有空间时被其他线程通过`notFull.signal()`唤醒。
- 消费者调用`notEmpty.await()`等待，直到有产品时被其他线程通过`notEmpty.signal()`唤醒。
- 在`finally`块中解锁，确保即使在等待过程中发生异常也能释放锁，防止死锁。



**注意事项**:
- 在调用`await()`、`signal()`、`signalAll()`之前，必须持有与`Condition`关联的`Lock`。
- `await()`、`signal()`、`signalAll()`方法应当总是放在`try...finally`块内，确保`Lock`最终被正确释放，防止死锁。
- 使用`await()`时，建议使用`while`循环检查条件，而非`if`，这样可以防止虚假唤醒。



::: info `Condition`接口与`Object`类中的`wait`, `notify`, `notifyAll`方法的区别
`Object`的等待/通知机制是早期Java并发设计的一部分，而`Condition`接口是Java并发包（`java.util.concurrent`）引入的高级特性，旨在提供更强大和灵活的线程同步机制。

#### `Object`类的`wait`, `notify`, `notifyAll`方法

- **使用场景**：主要用于在同步代码块或同步方法中，与`synchronized`关键字紧密配合。当线程需要等待某个条件满足时调用`wait()`，而当条件满足时，另一个线程通过`notify()`或`notifyAll()`唤醒等待的线程。
- **灵活性**：这些方法与监视器锁（即对象锁）绑定，每个对象只有一个监视器锁，因此对于复杂的多条件同步控制，灵活性较低，所有线程共享同一等待队列。
- **绑定关系**：直接与对象的监视器关联，意味着调用这些方法的线程必须拥有对象的监视器锁。

#### `Condition`接口

- **使用场景**：与`java.util.concurrent.locks.Lock`接口配合使用，为线程间协调提供了更细粒度的控制。可以在一个Lock对象上创建多个Condition实例，分别对应不同的等待条件。
- **灵活性**：由于可以创建多个Condition实例，因此可以为不同的条件设置不同的等待队列，提高了并发控制的灵活性和精确度，适用于更复杂的同步需求。
- **绑定关系**：`Condition`对象与一个具体的`Lock`实例绑定，而非直接与对象本身，因此可以更自由地管理线程的等待和通知逻辑，而不局限于单一的监视器锁。
- **方法**：`await()`替代了`wait()`，`signal()`替代了`notify()`，`signalAll()`替代了`notifyAll()`，提供了类似的功能，但更加强大和灵活。
:::


### LockSupport

`LockSupport` 是 Java 并发包 (`java.util.concurrent`) 中的一个强大工具类，用于实现线程的阻塞和唤醒操作。它是构建其他同步组件如锁和条件队列的基础。`LockSupport` 提供了非常灵活且细粒度的线程控制能力，与传统的 `synchronized` 关键字或 `Object` 类的 `wait()`、`notify()` 方法相比，它具有更高的灵活性和控制力。

::: tip 许可证(permit)
`LockSupport` 与每个线程关联一个所谓的“许可证”。默认情况下，线程不持有这个许可证。通过调用 `unpark()` 方法，可以给目标线程发放许可证；而调用 `park()` 方法的线程如果没有许可证，则会被阻塞。
:::


**主要方法**：
- **`park()`**: 阻塞当前线程。如果调用 `park()` 的线程已经持有许可证，那么它会立即返回；否则，该线程会被阻塞，直到以下任一条件满足：
  - 其他线程调用 `unpark()` 给当前线程发放了许可证。
  - 线程被中断（通过 `Thread.interrupt()` 方法）。
  - 发生了“虚假唤醒”，这是由于操作系统层面的实现细节，虽然不常见，但也是可能发生的。
  ```java
  public static void park()
  ```

- **`park(Object blocker)`**: 这个版本的 `park` 方法允许传递一个 `blocker` 参数，通常是一个对象引用，用来记录导致线程阻塞的原因，这在调试和监控线程行为时非常有用。它不会影响方法的行为，但可以被一些监视工具用来理解线程为什么被阻塞。

  ```java
  public static void park(Object blocker)
  ```

- **`parkNanos(long nanos)`**: 这个方法会使当前线程暂停执行，但最长不超过指定的纳秒数。如果在指定时间内被 `unpark` 调用或者中断，线程会提前结束阻塞状态。
  ```java
  public static void parkNanos(long nanos)
  ```

- **`parkUntil(long deadline)`**: 类似于 `parkNanos`，但不是基于时间间隔而是基于绝对时间点。线程将阻塞直到指定的时间点（以毫微秒为单位，自1970年以来的纳秒数），或者被 `unpark` 唤醒。
  ```java
  public static void parkUntil(long deadline)
  ```


- **`unpark(Thread thread)`**: `unpark` 方法用于明确地唤醒一个目标线程。它可以唤醒一个已经阻塞的线程，或者给一个尚未调用 `park` 方法的线程发放许可证，使得该线程在未来调用 `park` 时能够立即返回。如果多次调用 `unpark`，则会累积许可（但不会超过一次有效唤醒）。

  ```java
  public static void unpark(Thread thread)
  ```
    ::: tip unpark
    #### 许可证累积
    当多次调用 `LockSupport.unpark(Thread thread)` 方法时，实际上是在给定线程 `thread` 的内部状态中累积了一个或多个“许可证”。这意味着，如果有多个 `unpark` 调用发生在某个线程被 `park` 之前，这些调用不会丢失效果，而是被“记忆”下来。简而言之，许可证是可以累积的，多次调用会增加这个累积的数量。

    #### 一次有效唤醒
    尽管许可证可以累积，但一个线程从 `park` 状态被唤醒的行为却是一次性的。这意味着，无论之前累积了多少个许可证，一旦线程因为调用了 `park` 而阻塞，它被唤醒时只会消耗一个许可证，并立即变为可运行状态。即使还有剩余的许可证，这次唤醒操作也不会消耗它们。线程下次再调用 `park` 时，如果之前累积的许可证还未消耗完，它仍然可以直接获得许可而无需等待。
    :::


**特性**：
- **无条件唤醒**: `unpark()` 方法可以无条件唤醒线程，即使线程还没有调用 `park()`，这与传统的 `wait()`/`notify()` 机制不同。
- **灵活的位置**: `LockSupport` 方法可以在任何位置调用，不需要像 `synchronized` 代码块那样必须在监视器对象上操作。
- **底层实现**: `LockSupport` 的阻塞和唤醒操作是基于 JVM 的本地方法实现的，使用了 `sun.misc.Unsafe` 类中的底层操作，提供了高性能的线程控制。

**使用场景**：
- 实现自定义同步组件，如自定义锁和条件变量。
- 线程间的精细控制，比如在复杂的并发算法中精确控制线程的执行顺序。
- 异常处理和恢复，当需要在异常处理后恢复线程的执行时。


下面是一个简单的 `LockSupport` 使用示例，展示了如何使用 `park()` 和 `unpark()` 方法来控制线程的暂停和恢复执行：

```java
import java.util.concurrent.locks.LockSupport;

public class LockSupportExample {

    public static void main(String[] args) {
        // 创建一个工作线程
        Thread workerThread = new Thread(() -> {
            System.out.println("Worker thread starts.");
            
            // 模拟工作前的准备
            doSomeWork();
            
            // 线程准备就绪，等待被唤醒
            System.out.println("Worker thread is going to park itself.");
            LockSupport.park(); // 线程在此处暂停
            
            // 被唤醒后继续执行
            System.out.println("Worker thread is running again after being unparked.");
            doSomeMoreWork();
        }, "Worker");

        // 启动工作线程
        workerThread.start();

        // 主线程休眠一段时间，确保工作线程开始并park
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("Main thread is going to unpark the worker thread.");
        LockSupport.unpark(workerThread); // 唤醒工作线程

        // 等待工作线程完成
        try {
            workerThread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static void doSomeWork() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("Some work done.");
    }

    private static void doSomeMoreWork() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("Some more work done.");
    }
}
```


**注意事项**
- 谨慎使用 `LockSupport`，不当使用可能导致死锁或无限期阻塞。
- 使用 `park()` 和 `unpark()` 时，应确保它们在逻辑上成对出现，以避免意外的线程行为。


::: info 使用到LockSupport的并发工具
`LockSupport` 是Java并发包中的一个核心工具类，虽然它本身不是一个复合工具，但许多高级并发工具和框架在内部使用了 `LockSupport` 来实现线程的阻塞和唤醒逻辑。以下是几个直接或间接基于 `LockSupport` 实现的并发工具和框架的例子：

1. **`ReentrantLock` 和 Condition**: `ReentrantLock` 是一个可重入互斥锁，提供了比 `synchronized` 更多的灵活性。其内部的 `Condition` 对象（通过 `newCondition()` 方法获得）用于线程间的精确等待/通知，这些功能在底层就是通过 `LockSupport` 的 `park` 和 `unpark` 方法实现的。

2. **`AbstractQueuedSynchronizer (AQS)`**: AQS 是许多高级同步器的基础框架，包括 `ReentrantLock`, `Semaphore`, `CountDownLatch`, `CyclicBarrier`, 等。AQS 使用了一个双向链表来管理等待线程，并通过 `LockSupport` 来实现线程的阻塞与唤醒。

3. **CountDownLatch**: 用于让一个或多个线程等待其他线程完成一定数量的操作。当计数达到零时，所有等待的线程被释放，这个过程中就用到了 `LockSupport`。

4. **CyclicBarrier**: 用于同步多个线程到达一个共同的屏障点，所有线程到达后一起继续执行。在屏障点等待和唤醒线程的机制中，`LockSupport` 起到了关键作用。

5. **Semaphore**: 实现了计数信号量，控制同时访问特定资源的线程数量。线程在尝试获取信号量时可能被阻塞，这也是通过 `LockSupport` 实现的。

6. **StampedLock**: 提供了读写锁的更精细控制，包括乐观读锁、悲观读锁和写锁，它也依赖于 `LockSupport` 来实现线程的挂起和恢复。

7. **自定义同步组件**: 开发者在实现自定义的同步组件时，如自旋锁、读写锁或其他同步逻辑时，经常直接使用 `LockSupport` 来控制线程状态。

总的来说，`LockSupport` 是Java并发编程中用于线程控制的核心工具之一，许多高级并发工具在内部都依赖它来实现线程的阻塞与唤醒机制，从而实现了高效的线程同步。
:::



## 用户线程和守护线程

在Java中有两类线程：User Thread(用户线程)、Daemon Thread(守护线程) ，User和Daemon两者几乎没有区别，不同之处在于：

- 如果 User Thread已经全部退出运行了，只剩下Daemon Thread存在了，虚拟机也就退出了。 
  因为没有了被守护者，Daemon也就没有工作可做了，也就没有继续运行程序的必要了。

- Daemon的作用是为其他线程的运行提供便利服务，守护线程最典型的应用就是 GC (垃圾回收器)


```java
public class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            try {
                Thread.currentThread().sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + "——" + i);
        }
    }
}
```

```java
public class DaemonDemo {
    public static void main(String[] args) throws InterruptedException {
        MyThread daemonThread = new MyThread();
        daemonThread.setDaemon(true);   // 设置为守护线程
        daemonThread.setName("Daemon-Thread");
        daemonThread.start();

        Thread.currentThread().setName("User-Thread");   // 主线程为用户线程
        for (int i = 0; i < 5; i++) {
            Thread.currentThread().sleep(300);
            System.out.println(Thread.currentThread().getName() + "——" + i);
        }
    }
}
```

![](https://image.ventix.top/java/image-20211019023243206.png)


::: info 使用守护线程的注意事项
（1）守护线程必须在启动前将其守护状态设置为true，启动之后不能再将用户线程设置为守护线程，否则JVM会抛出一个`InterruptedException异常`。具体来说，如果线程为守护线程，就必须在线程实例的start()方法调用之前调用线程实例的`setDaemon(true)`，设置其daemon实例属性值为true。

（2）守护线程存在被JVM强行终止的风险，所以在守护线程中尽量不去访问系统资源，如文件句柄、数据库连接等。守护线程被强行终止时，可能会引发系统资源操作不负责任的中断，从而导致资源不可逆的损坏。

（3）守护线程创建的线程也是守护线程。在守护线程中创建的线程，新的线程都是守护线程。在创建之后，如果通过调用setDaemon(false)将新的线程显式地设置为用户线程，新的线程可以调整成用户线程。

（3）**守护线程创建的线程也是守护线程**，如果要将守护线程所创建的线程调整为用户线程，可以通过`setDaemon(false)`显式地将这些线程设置为用户线程
:::







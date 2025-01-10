---

order: 15
title: 线程同步与锁机制

---


线程同步是为了防止多个线程在访问共享资源时造成数据的不一致性，而锁机制是实现线程同步的一种手段，确保同一时刻只有一个线程能访问共享资源。


## synchronized

`synchronized` 的本质是通过 **监视器锁（Monitor）** 来实现对共享资源的访问控制。用于控制多线程对共享资源的访问，确保线程的互斥性和可见性，从而避免数据不一致的问题。它可以通过两种形式使用：同步方法和同步代码块。

- **同步方法**：简单易用，适用于整个方法都需要同步的情况，锁自动绑定到当前实例或类（静态方法）。
- **同步代码块**：提供了更细粒度的控制，允许指定锁对象，更加灵活，但使用时需要注意正确选择锁对象以避免死锁等问题。

选择哪种形式取决于具体需求，通常优先考虑同步代码块以减少不必要的锁竞争，提升程序效率。

::: info synchronized加锁的本质含义
使用`synchronized`进行加锁的本质含义是==通过控制Java对象头的Mark Word来实现对共享资源的访问控制==，确保在任何给定时间点，只有一个线程可以执行特定的代码段或访问某个对象的特定方法。这一过程涉及到以下几个关键点：

1. **锁定对象标识**：当一个线程试图进入`synchronized`代码块或方法时，它首先需要获取锁。这个锁实际上关联到了对象头的Mark Word。Mark Word会被更新以表示该对象当前已被锁定，并且会记录锁持有者的相关信息（比如在轻量级锁情况下记录锁记录的指针，或在重量级锁情况下指向监视器对象的指针）。

2. **线程互斥**：通过这种机制，其他线程在尝试获取同一个锁时，会发现Mark Word已经标记为锁定状态，从而无法继续执行受保护的代码，这实现了线程间的互斥访问，避免了数据竞争和并发问题。

3. **锁状态转换**：随着竞争情况的变化，锁可以从无锁状态升级到偏向锁、轻量级锁，最终可能升级到重量级锁。每种锁状态的转换都是为了更好地适应当前的并发情况，以平衡性能和安全性。

4. **锁的释放**：当持有锁的线程完成其在`synchronized`块内的操作后，它会释放锁，这时Mark Word会被恢复到无锁状态或根据情况更新为适合下一个线程竞争的状态。这一过程同样依赖于Mark Word的修改来确保锁的正确释放，并通知其他等待的线程重新竞争锁。

综上所述，使用`synchronized`进行加锁的核心在于利用Java对象头的Mark Word作为同步状态的指示器，通过改变Mark Word的内容来管理锁的获取与释放，以此实现对共享资源的线程安全访问控制。
:::

### 同步方法

当一个方法用 `synchronized` 修饰时，该方法称为同步方法。这意味着在同一时间只能有一个线程可以访问这个方法。同步方法的锁是隐式的，它默认锁定当前实例对象（即 `this`）。

```java
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}
```
在这个例子中，`increment` 和 `getCount` 方法都被 `synchronized` 修饰，这意味着在这两个方法内部的代码不会被多个线程同时执行，保证了 `count` 变量的线程安全性。



### 同步代码块

同步代码块允许你指定锁定的对象，这可以是任意对象。相比同步方法，同步代码块提供了更细粒度的锁控制，只锁定必要的部分代码，从而可能提高程序的并发性能。


```java
public class Counter {
    private int count = 0;
    private final Object lock = new Object(); // 专门用于同步的锁对象

    public void safeIncrement() {
        synchronized(lock) { // 显式指定锁对象
            count++;
        }
    }

    public int getCount() {
        return count;
    }
}
```
在这个例子中，我们使用了一个单独的 `lock` 对象来作为同步代码块的锁，这样可以更灵活地控制同步范围，比如在多个独立的代码块中使用同一个锁，或者在不同方法间共享锁，而不需要像同步方法那样锁定整个实例。





### 对象锁与类锁
- **对象锁**: 锁定的是对象实例，适用于非静态方法或实例变量的同步。
- **类锁**: 锁定的是类的Class对象，适用于静态方法或需要类级别同步的场景。
它们之间是相互独立的，对象锁不能阻止其他线程访问类锁，反之亦然。

**对象锁**:
对象锁是针对对象实例的，当一个线程访问某个对象的同步代码块或同步方法时，其他线程若想访问该对象的同步代码块或方法，就必须等待前一线程释放锁。
- **使用场景**：主要用于实例方法或非静态同步代码块。
- **锁对象**：默认为`this`，即当前实例对象。

```java
public class ObjectLockExample {
    public synchronized void method() {
        // 同步代码块
        System.out.println(Thread.currentThread().getName() + " in object lock");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        ObjectLockExample obj1 = new ObjectLockExample();
        ObjectLockExample obj2 = new ObjectLockExample();

        Thread t1 = new Thread(() -> obj1.method(), "Thread1");
        // t2将会与t1竞争obj1的锁
        Thread t2 = new Thread(() -> obj1.method(), "Thread2"); 
        // t3与t1、t2无关，因为是不同的对象实例
        Thread t3 = new Thread(() -> obj2.method(), "Thread3"); 

        t1.start();
        t2.start();
        t3.start();
    }
}
```
在上述示例中，`method` 方法是同步的，意味着同一时间只有一个线程可以访问它。`Thread1` 和 `Thread2` 将竞争 `obj1` 的对象锁，而 `Thread3` 则独立竞争 `obj2` 的对象锁，两者之间互不影响。

**类锁**:
类锁是针对类的，当一个线程访问某个类的静态同步方法或使用类的class对象作为锁的同步代码块时，其他线程若想访问该类的静态同步方法或相应的同步代码块，也必须等待前一线程释放锁。
- **使用场景**：主要用于静态方法或使用类对象作为锁的代码块。
- **锁对象**：如果是静态同步方法，锁住的是类的Class对象；如果是同步代码块使用`Class对象`作为锁，也是锁住类的Class对象。

```java
public class ClassLockExample {
    public static synchronized void staticMethod() {
        // 静态同步方法
        System.out.println(Thread.currentThread().getName() + " in class lock");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        Thread t1 = new Thread(ClassLockExample::staticMethod, "Thread1");
        // t2与t1竞争类锁
        Thread t2 = new Thread(ClassLockExample::staticMethod, "Thread2"); 
        // t3同样与t1、t2竞争类锁
        Thread t3 = new Thread(ClassLockExample::staticMethod, "Thread3"); 

        t1.start();
        t2.start();
        t3.start();
    }
}
```
在此示例中，`staticMethod` 是静态同步方法，所有访问它的线程（`Thread1`、`Thread2` 和 `Thread3`）都必须竞争同一个类锁，即 `ClassLockExample` 类的Class对象锁，因此这三个线程会依次执行，不会并发。





### 可重入性
synchronized 具有重入性，指同一个线程可以多次获取同一把锁，不会出现自己把自己锁住的情况。即当一个线程已经持有了某个对象的锁时，可以再次获取该对象的锁而不被阻塞，即线程可以进入由自己持有的锁保护的同步代码块或方法中。这是 `synchronized` 的一个重要特性，旨在避免死锁并支持递归调用。

::: info 重入锁的原理
在Java中，每当线程进入由 `synchronized` 保护的代码区域时，虚拟机会检查该线程是否已经持有对应监视器锁（即对象锁）。如果已经持有，监视器锁的计数器就会增加，表明该线程再次获得了锁，当线程退出同步代码块时，计数器才会递减，当计数器归零时才真正释放锁。这样，同一个线程可以多次进入它已经拥有的锁所同步的代码块。
:::

下面是一个简单的代码示例，展示了 `synchronized` 重入锁的特性：

```java
public class ReentrantSyncDemo {
    public synchronized void outerMethod() {
        System.out.println(Thread.currentThread().getName() + " entered outerMethod.");
        innerMethod();
    }

    public synchronized void innerMethod() {
        System.out.println(Thread.currentThread().getName() + " entered innerMethod.");
        // 模拟处理逻辑
    }

    public static void main(String[] args) {
        ReentrantSyncDemo demo = new ReentrantSyncDemo();
        Thread thread = new Thread(() -> demo.outerMethod(), "Thread-1");
        thread.start();
    }
}
```

在这个例子中，`outerMethod` 和 `innerMethod` 都使用了 `synchronized` 关键字修饰，意味着它们是同步方法。当 `Thread-1` 调用 `outerMethod` 时，它首先获取了 `demo` 实例的锁。随后在 `outerMethod` 内部调用了 `innerMethod`，由于是同一个线程，即使 `innerMethod` 同样需要锁，线程也能直接进入，这就是重入锁的体现。如果没有重入机制，线程将会因为自己已经持有锁而被阻塞，导致死锁。




### 锁的升级与降级

JVM为了提高效率，对synchronized进行了优化，包括无锁、偏向锁、轻量级锁和重量级锁的转换。锁的升级是指从低级锁转变为更高级别的锁，反之为降级，这一过程是自动进行的，旨在减少锁带来的性能开销。

`synchronized`的底层实现与Java对象头的`Mark Word`紧密相关


<table style="width: 100%; border-collapse: collapse;">
    <thead>
        <tr style="background-color: #d9ead3;">
            <th colspan="50" style="border: 1px solid #000; text-align: center; font-size: 24px;">64位虚拟机对象头的MarkWord</th>
        </tr>
        <tr style="background-color: #d9ead3;">
            <th colspan="5" rowspan="2" style="border: 1px solid #000; text-align: center;">锁状态</th>
            <th colspan="25" style="border: 1px solid #000; text-align: center;">56bit</th>
            <th colspan="5" rowspan="2" style="border: 1px solid #000; text-align: center;">1bit</th>
            <th colspan="5" rowspan="2" style="border: 1px solid #000; text-align: center;">4bit</th>
            <th colspan="5" rowspan="2" style="border: 1px solid #000; text-align: center;">1bit<br>(是否偏向锁)</th>
            <th colspan="5" rowspan="2" style="border: 1px solid #000; text-align: center;">2bit<br>(锁标志位)</th>
        </tr>
        <tr style="background-color: #d9ead3;">
            <th colspan="10" style="border: 1px solid #000; text-align: center;">25bit</th>
            <th colspan="15" style="border: 1px solid #000; text-align: center;">31bit</th>
        </tr>
    </thead>
    <tbody>
        <tr style="background-color: #c9daf8;">
            <td colspan="5" style="border: 1px solid #000; text-align: center;">无锁</td>
            <td colspan="10" style="border: 1px solid #000; text-align: center;">unused</td>
            <td colspan="15" style="border: 1px solid #000; text-align: center;">对象 hashCode</td>
            <td colspan="5" style="border: 1px solid #000; text-align: center;">Cms_free</td>
            <td colspan="5" style="border: 1px solid #000; text-align: center;">对象分代年龄</td>
            <td colspan="5" style="border: 1px solid #000; text-align: center;">0</td>
            <td colspan="5" style="border: 1px solid #000; text-align: center;">01</td>
        </tr>
        <tr style="background-color: #ffe599;">
            <td colspan="5" style="border: 1px solid #000; text-align: center;">偏向锁</td>
            <td colspan="24" style="border: 1px solid #000; text-align: center;">threadId(54bit)(偏向锁的线程ID)</td>
            <td colspan="6" style="border: 1px solid #000; text-align: center;">Epoch(2bit)</td>
            <td colspan="5" style="border: 1px solid #000; text-align: center;">对象分代年龄</td>
            <td colspan="5" style="border: 1px solid #000; text-align: center;">1</td>
            <td colspan="5" style="border: 1px solid #000; text-align: center;">01</td>
        </tr>
        <tr style="background-color: #f9cb9c;">
            <td colspan="5" style="border: 1px solid #000; text-align: center;">轻量级锁</td>
            <td colspan="40" style="border: 1px solid #000; text-align: center;">指向栈中锁的记录的指针</td>
            <td colspan="5" style="border: 1px solid #000; text-align: center;">00</td>
        </tr>
        <tr style="background-color: #f4cccc;">
            <td colspan="5" style="border: 1px solid #000; text-align: center;">重量级锁</td>
            <td colspan="40" style="border: 1px solid #000; text-align: center;">指向重量级锁的指针</td>
            <td colspan="5" style="border: 1px solid #000; text-align: center;">10</td>
        </tr>
        <tr style="background-color: #c9daf8;">
            <td colspan="5" style="border: 1px solid #000; text-align: center;">GC 标志</td>
            <td colspan="40" style="border: 1px solid #000; text-align: center;">空</td>
            <td colspan="5" style="border: 1px solid #000; text-align: center;">11</td>
        </tr>
    </tbody>
</table>





**synchronized锁升级过程**:
#### 1. 偏向锁（Biased Locking）
当一个对象第一次被一个线程访问时，为了减少不必要的同步开销，JVM会尝试将其转变为偏向锁
- **Mark Word变化**：记录当前访问线程的ID。
- **触发条件**：对象首次被线程访问时，且之前未被其他线程争用过。
::: tip
- 如果获取到偏向锁的线程执行完毕并释放锁，且在整个过程中没有其他线程尝试竞争锁，Mark Word保持不变。偏向锁是延续的，直到有显式的线程竞争或者GC行为清除偏向状态

- 如果在偏向锁持有期间，其他线程尝试获取同一锁，偏向锁将会撤销，转变为轻量级锁或重量级锁。

**偏向锁撤销与升级流程**:
1. **暂停竞争线程**：当检测到竞争需要撤销偏向锁时，当前竞争的线程会被暂时挂起。
2. **恢复无锁状态**：恢复Mark Word为无锁状态，在已获取到偏向锁的线程栈中创建Lock Record, 将当前的偏向锁信息转移到轻量级锁的Lock Record中。
3. **尝试轻量级锁**：重置后，竞争线程和原持有线程再尝试以轻量级锁的方式重新竞争锁。
4. **升级重量级锁**：如果竞争激烈，轻量级锁继续失败，则升级为重量级锁。
:::

#### 2. 轻量级锁（Lightweight Locking）
每个试图获取轻量级锁的线程，会在自己的栈帧中创建一个Lock Record，用于记录锁相关的信息（例如对象头Mark Word的拷贝）。每个参与竞争的线程都会尝试通过CAS操作，将对象的Mark Word指向自己的Lock Record。之前持有偏向锁的线程和其他线程在轻量级锁竞争中的优势是相同的，没有特别的优先级。如果成功，表示该线程取得了锁；如果失败，表示其他线程正在竞争这把锁。
- **Mark Word变化**：拷贝对象头中的Mark Word到 在线程栈中创建的Lock Record中，并通过CAS操作将对象头的Mark Word替换为指向Lock Record的指针。
- **自旋**：如果CAS失败，当前线程不会立即阻塞，而是进行自旋等待原持有者释放锁。
- **触发条件**：存在多线程竞争，但竞争程度不激烈，通过自旋有机会快速获得锁。

如果竞争不是很激烈，线程通过CAS获取轻量级锁后顺利执行完毕, 会进行释放轻量级锁并恢复Mark Word为无锁状态。 Mark Word会重新指向通过CAS操作成功后的线程的Lock Record。


#### 3. 重量级锁（Heavyweight Locking）
如果多个线程持续竞争同一把锁，自旋达到一定次数后仍然无法获得锁（JVM会根据实时情况动态调整自旋次数），锁就会升级为重量级锁。
- **Mark Word变化**：指向一个Monitor对象（系统互斥量指针）
- **阻塞与唤醒**：未获得锁的线程会被阻塞并放入操作系统的等待队列中，由操作系统负责线程的调度和唤醒。
- **触发条件**：线程竞争激烈，自旋无效。

当锁升级为重量级锁后：线程将尝试获取锁，进入Monitor对象的等待队列。线程通过操作系统的调度和唤醒机制进入阻塞状态，等待锁被释放。

当重量级锁释放后, 会将Monitor对象状态和锁引用信息清除，并唤醒等待线程


::: info 锁降级
锁降级是基于竞争线程的动态变化。当竞争减少后，JVM可能将锁状态降级以提升性能。
:::



### CAS与自旋锁

**CAS自旋**（Compare-And-Swap）是一种在多线程环境下的非阻塞同步技术，主要用于实现轻量级的锁机制，比如自旋锁。它的基本思想是在硬件层面提供一个原子操作，允许线程在没有获得锁时，不是立刻放弃CPU时间片进入等待状态（如挂起），而是自旋（Spin）一小段时间，反复尝试获取锁，直到成功或达到一定次数后再采取其他策略（如挂起）。这种机制特别适合于锁持有时间短且线程竞争不激烈的场景。


::: info CAS操作与CAS自旋
CAS操作（Compare-And-Swap）和CAS自旋都是并发编程中用于处理多线程同步的技术，它们都基于CAS机制，即一种在硬件层面支持的原子操作，用于比较内存中的值与一个预期值，如果相等则更新该值。因此，可以说CAS自旋是CAS操作在特定场景下的一种应用形式。

1. **目的与场景**：
   - **CAS操作**：是一种基础的原子操作，广泛应用于各种无锁算法和数据结构中，目的是在多线程环境下实现对共享数据的原子更新，保证数据的一致性。例如，在`java.util.concurrent.atomic`包中的原子类（如`AtomicInteger`）就利用了CAS操作来实现原子的递增、递减等。
   
   - **CAS自旋**：特指在获取锁或同步资源的过程中，如果发现资源被其他线程占用，当前线程不立即放弃CPU时间片进入阻塞状态，而是通过循环（自旋）不断地重复执行CAS操作尝试获取资源，直至成功或达到一定的自旋次数后才考虑采用其他策略（如阻塞）。这是在锁机制中的具体应用，常见于自旋锁的实现。

2. **使用情境**：
   - **CAS操作**的应用更加广泛，不仅仅局限于锁的获取，还可以用于实现无锁数据结构、原子计数器等。
   - **CAS自旋**则更多聚焦于同步机制，特别是在轻量级锁和自旋锁的场景下，作为避免线程上下文切换开销的策略。

3. **性能考量**：
   - **CAS操作**本身是高效的，因为它减少了对锁的依赖，降低了线程上下文切换的开销。
   - **CAS自旋**在竞争不激烈的情况下能提高性能，但如果竞争激烈或自旋时间过长，会因为持续消耗CPU资源而降低系统整体性能。
:::


**CAS操作的工作流程**:

CAS操作包含三个参数：内存位置（V）、预期原值（A）和新值(B)。具体流程如下：
1. **比较**：首先，它会比较内存位置V的值是否等于预期原值A。
2. **交换**：如果相等，就将内存位置V的值更新为新值B，并返回true，表示更新成功。
3. **失败则重试**：如果不相等，说明其他线程已经修改了内存位置V的值，此时不进行任何操作，返回false。然后，执行CAS的线程可以选择重新尝试整个操作，这就是所谓的“自旋”。

**CAS应用场景**:

1. **轻量级锁实现**：在Java中，轻量级锁的实现就采用了CAS机制。当一个线程尝试获取锁时，首先会尝试使用CAS操作将锁标记位设置为当前线程ID，如果成功，则获取锁；如果失败（即锁已被其他线程持有），则开始自旋尝试再次获取。

2. **原子变量操作**：Java的`java.util.concurrent.atomic`包下的原子类，如`AtomicInteger`、`AtomicBoolean`等，都利用了CAS来实现原子性的增加、减少、替换等操作，无需使用synchronized关键字，提高了性能。

3. **自旋锁实现**：在多线程竞争资源不激烈的情况下，直接使用自旋代替传统的阻塞和唤醒机制，可以减少线程上下文切换的开销，提高效率。例如，线程在尝试获取锁时，若发现锁已被占用，便自旋等待直到锁被释放。

4. **并发队列**：如`ConcurrentLinkedQueue`，使用CAS操作来实现节点的无锁添加和移除，保证了高并发下的线程安全。

**注意事项**:
- **ABA问题**：CAS操作可能会遇到ABA问题，即内存位置的值从A变为B再变回A，但实际发生了变化。为解决这个问题，通常会配合版本号或者使用带有标记的引用（如AtomicStampedReference）。
- **自旋开销**：如果锁的竞争激烈，线程自旋等待时间过长，会白白消耗CPU资源，反而不如直接挂起线程。因此，现代JVM通常会动态调整自旋次数，根据前几次自旋尝试的成功率来决定是否继续自旋，或转而采用阻塞策略。
- **适用场景**：适用于锁竞争不频繁，且锁持有时间很短的情况，否则自旋可能会导致CPU利用率过高。



## lock接口及其实现类

`Lock`接口位于`java.util.concurrent.locks`包下，提供了一种比传统的`synchronized`关键字更加灵活和功能丰富的线程同步机制。主要实现类包括：

1. **ReentrantLock**（可重入锁）：最常用的`Lock`实现之一，支持公平和非公平策略，可重入意味着线程可以多次获取自己持有的锁。
2. **ReentrantReadWriteLock**：读写锁，分为读锁和写锁。允许多个读线程同时访问，但在写线程访问时会独占锁，即读写互斥，写写互斥，但读读不互斥，适合读多写少的场景。
3. **StampedLock**：一种更高级的锁，提供了乐观读锁、悲观读锁、写锁以及尝试转换锁状态的能力，使用“邮票”（stamp）来标识锁状态。

::: info Lock接口的特点与优势
1. **显式锁获取与释放**：与`synchronized`自动获取和释放锁不同，`Lock`需要手动调用`lock()`方法获取锁，使用完后通过`unlock()`方法释放锁，这增加了灵活性但也要求开发者必须注意解锁，避免死锁。

2. **尝试非阻塞获取锁**：提供`tryLock()`方法尝试获取锁而不阻塞，这使得线程可以在无法立即获取锁时做出其他处理，比如放弃或者稍后再试。

3. **超时获取锁**：`tryLock(long time, TimeUnit unit)`允许尝试获取锁时设置超时时间，超过指定时间未获取到锁则返回。

4. **公平性选择**：一些`Lock`的实现允许选择是否公平锁，公平锁按照请求锁的顺序分配，而非公平锁则允许插队，可能提升吞吐量但牺牲了公平性。
    请注意，尽管公平锁保证了线程的顺序访问，但它通常比非公平锁有更高的性能开销，因为需要维护线程等待队列。

5. **条件变量（Conditions）**：`Lock`接口与`Condition`接口配合使用，允许线程在满足特定条件时等待，比`synchronized`的`wait()`和`notify()`/`notifyAll()`更灵活。
:::

**与synchronized的区别**：
1. **灵活性**：`Lock`提供了更多的控制权，比如尝试获取锁、定时获取锁、可中断的锁等待等。
2. **性能**：在某些场景下，`Lock`可能提供更好的性能，特别是在有大量线程竞争时，因为它的设计更精细。但实际性能差异依赖于具体使用场景。
3. **可中断性**：`Lock`支持中断等待锁的线程，而`synchronized`不支持。
4. **复杂性**：使用`Lock`需要更仔细地管理锁的获取和释放，容易出错，而`synchronized`由编译器和JVM自动管理。

`Lock`接口及其实现类提供了更精细的线程同步控制能力，适用于需要高度控制并发访问逻辑的场景，而`synchronized`则因其简洁易用，适用于大多数简单的同步需求。


### ReentrantLock

1. **可重入性（Reentrancy）**：如果当前线程已经拥有锁，可以再次获取该锁而不会造成死锁，这对于递归或嵌套锁的情况非常重要。
2. **锁的公平性选择**：ReentrantLock 支持公平锁和非公平锁两种模式。公平锁按照线程等待的先后顺序分配锁，而非公平锁允许插队，可能导致线程饥饿。
3. **可中断的锁等待**：通过 `lockInterruptibly()` 方法，线程在等待锁的过程中可以响应中断，提高响应性。
4. **尝试获取锁与超时**：`tryLock()` 方法允许尝试获取锁而不阻塞当前线程，可选地还可以设置超时时间。
5. **条件变量（Conditions）**：与 `synchronized` 中的 `wait()` 和 `notify()` 类似，但更为灵活，可以有多个条件队列。

::: tip 使用场景与建议
1. **替代 `synchronized`**：在需要更细粒度控制或高级锁特性（如中断、超时）的场景下使用。
2. **高性能并发读写**：在读多写少的场景，与 `ReadWriteLock` 结合使用，提高并发性能。
3. **长任务同步**：对于可能超过预期执行时间的任务，可以避免因死锁导致的问题。
4. **需要精确控制锁释放**：例如，在复杂的同步代码块中，确保锁总能被释放，即便发生异常。
:::

```java
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockExample {
    private final ReentrantLock lock = new ReentrantLock();   // 默认为非公平锁
    // private final ReentrantLock lock = new ReentrantLock(true); // 设置为公平锁

    public void doSomething() {
        lock.lock();
        try {
            // 临界区代码
            System.out.println("Executing critical section...");
        } finally {
            lock.unlock(); // 确保锁总是被释放
        }
    }

    // 使用可中断锁等待
    public void doSomethingInterruptibly() throws InterruptedException {
        lock.lockInterruptibly();
        try {
            System.out.println("Executing interruptible section...");
            Thread.sleep(10000); // 模拟长时间运行，可被打断
        } finally {
            lock.unlock();
        }
    }

    // tryLock示例
    public boolean tryExecute() {
        if (lock.tryLock(2, TimeUnit.SECONDS)) { // 尝试获取锁
            try {
                System.out.println("Lock acquired, executing critical section...");
                // 临界区代码
            } finally {
                lock.unlock(); // 无论是否执行成功，都要释放锁
            }
        } else {
            System.out.println("Lock is already held by another thread, skipping execution.");
            // 执行无法获取锁时的备选逻辑
        }
    }
}
```

**注意事项**：
1. **手动释放锁**：使用 `ReentrantLock` 时必须显式调用 `unlock()` 来释放锁，忘记解锁可能导致死锁。
2. **异常处理**：在 `finally` 块中释放锁，确保异常发生时锁也能被正确释放。
3. **避免过度优化**：在不需要高级特性的简单同步场景下，使用 `synchronized` 可能更简洁、高效。
4. **公平性选择**：公平锁虽然保证了线程的公平性，但通常性能不如非公平锁。应根据实际情况选择合适的锁策略。

通过以上内容，可以看到 ReentrantLock 提供了比内置 `synchronized` 关键字更灵活和强大的锁机制，但同时也要求开发者更谨慎地管理锁的生命周期。


### ReadWriteLock

`ReadWriteLock` 是Java并发包 (`java.util.concurrent.locks`) 中的一个接口，它代表了读写锁的概念，主要目的是为了在读多写少的并发场景中提高性能。它允许多个读取者同时访问共享资源，但在任何时候只允许一个写入者，并且写入者访问时会排斥所有读取者和其他写入者。这种设计减少了不必要的阻塞，提高了并发效率。

`ReentrantReadWriteLock` 是 `ReadWriteLock` 接口的一个标准实现，它支持可重入特性，即已经持有锁的线程可以再次获取同一把锁而不会造成死锁，并且提供了锁的公平性选择（默认是非公平锁）。

**使用场景**：
1. **缓存更新**：适用于读取缓存数据远多于更新缓存的场景，可以使用读写锁来保护缓存，读取时不阻塞，更新时独占。
2. **数据库连接池**：数据库连接的读取操作频繁，而创建或销毁连接操作较少，使用读写锁可以有效提升并发性能。
3. **配置信息读取**：应用程序频繁读取配置信息，偶尔更新配置时，使用读写锁可以保证读取的高并发和更新的安全性。


以下是一个简单的使用 `ReentrantReadWriteLock` 的例子，模拟了一个配置信息的读取和更新场景。

```java
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ConfigurationService {
    private final Map<String, String> configMap = new ConcurrentHashMap<>();
    private final ReadWriteLock lock = new ReentrantReadWriteLock();

    // 读取配置
    public String getConfig(String key) {
        lock.readLock().lock();
        try {
            return configMap.get(key);
        } finally {
            lock.readLock().unlock();
        }
    }

    // 更新配置
    public void updateConfig(String key, String value) {
        lock.writeLock().lock();
        try {
            configMap.put(key, value);
            System.out.println("Configuration updated: " + key + " -> " + value);
        } finally {
            lock.writeLock().unlock();
        }
    }

    public static void main(String[] args) {
        ConfigurationService service = new ConfigurationService();
        
        // 模拟并发读取
        for (int i = 0; i < 5; i++) {
            int finalI = i;
            new Thread(() -> {
                System.out.println(service.getConfig("key" + finalI));
            }).start();
        }
        
        // 模拟更新操作
        new Thread(() -> {
            service.updateConfig("key1", "newValue");
        }).start();
    }
}
```
::: info 使用读锁的必要性
尽管 `lock.readLock().lock();` 在读多场景下允许并发读取，似乎与不加锁直接读取相似，但实际上它是必要的，原因如下：
- **保证读取时的可见性**：读锁确保了在读取数据时，能看到最近一次写操作的结果，避免了内存一致性错误。
- **防止读取过程中的写入**：虽然读锁允许并发读，但会阻止写入操作，确保在读取过程中数据不被修改，避免了数据不一致性问题。
- **为未来可能的写入操作预留升级空间**：即便当前没有写入操作，使用读写锁的设计使得在未来添加写入操作时，只需要对写入部分加写锁，而不需要大规模重构读取代码，保证了代码的扩展性和灵活性。
:::



### StampedLock

`StampedLock` 是 Java 8 引入的一种新型锁，它提供了更加灵活的读写锁机制，相较于 `ReentrantReadWriteLock`，它提供了更多的锁模式和操作，以适应更广泛的并发控制需求。

1. **乐观读锁（Optimistic Locking）**：`StampedLock` 提供了一种乐观读锁模式，允许线程在没有实际获取锁的情况下进行读取操作，然后在操作完成后验证读取期间是否有其他线程修改了数据，这种方式在读多写少的场景下能进一步提高性能。
   
2. **灵活的锁模式转换**：支持从乐观读锁转换到悲观读锁或写锁，以及从写锁转换到读锁，提供了锁升级和降级的能力，使得锁的使用更加灵活。

3. **版本戳（Stamp）**：`StampedLock` 使用一个称为“邮戳”（Stamp）的长整型值来表示锁的状态，所有锁的操作都会返回这样一个邮戳，后续的操作可能需要这个邮戳作为参数来验证锁的状态或解锁。

4. **不可重入**：与 `ReentrantLock` 和 `ReentrantReadWriteLock` 不同，`StampedLock` 是不可重入的，这意味着同一个线程在未释放锁前不能再次获取同一类型的锁，这在设计使用时需要注意。

**使用场景**：
- **读多写少且追求高性能的场景**：特别是当读操作远多于写操作，且读操作的性能要求极高时，乐观读锁模式可以显著减少锁的开销。
- **需要锁升级或降级的场景**：当一个线程最初以读取开始，但随后可能需要写入数据时，或者写入后需要再次读取时，`StampedLock` 的灵活性尤为适用。


下面是一个使用 `StampedLock` 的简单示例，演示了乐观读锁、悲观读锁和写锁的使用：

```java
import java.util.concurrent.locks.StampedLock;

public class StampedLockExample {
    private final StampedLock sl = new StampedLock();
    private int value;

    public void write(int newValue) {
        long stamp = sl.writeLock();
        try {
            value = newValue;
            // 写操作
        } finally {
            sl.unlockWrite(stamp);
        }
    }

    public int readOptimistically() {
        long stamp = sl.tryOptimisticRead();
        int snapshot = value;
        // 验证期间是否有写操作
        if (!sl.validate(stamp)) {
            // 乐观读取失败，转为悲观读取
            stamp = sl.readLock();
            try {
                snapshot = value;
            } finally {
                sl.unlockRead(stamp);
            }
        }
        return snapshot;
    }

    public int readPessimistically() {
        long stamp = sl.readLock();
        try {
            return value;
        } finally {
            sl.unlockRead(stamp);
        }
    }

    public static void main(String[] args) {
        StampedLockExample example = new StampedLockExample();
        example.write(100);

        // 乐观读取
        int optimisticValue = example.readOptimistically();
        System.out.println("Optimistic read: " + optimisticValue);

        // 悲观读取
        int pessimisticValue = example.readPessimistically();
        System.out.println("Pessimistic read: " + pessimisticValue);
    }
}
```
此示例中，`write` 方法展示了如何使用写锁进行写入操作；`readOptimistically` 方法演示了乐观读取，先尝试无锁读取，如果发现数据可能被修改则转为悲观读取；`readPessimistically` 方法则直接使用悲观读锁进行读取。


## 锁的多种分类方式

**1. 悲观锁和乐观锁**
- **悲观锁**：假设最坏的情况，即数据在任何时候都可能被其他线程修改，因此在访问数据前先加锁，阻止其他线程访问，直到该锁被释放。这种方式适合写操作较多的场景。
- **乐观锁**：假定读多写少的情况，认为数据一般不会发生冲突，仅在更新数据时检查在此期间是否有其他线程修改过数据，如有冲突则采取重试或其他策略。乐观锁常常通过版本号或时间戳来实现。

**2. 共享锁和独占锁**
- **共享锁**：允许多个线程同时获取锁并读取共享资源，但任何线程都不能修改资源。在数据库系统中常见，如SQL的`SELECT ... FOR SHARE`。
- **独占锁**：又称排他锁，同一时间只允许一个线程获取锁并访问资源，无论是读还是写操作。Java中的`synchronized`关键字和`ReentrantLock`在默认情况下即是独占锁。

::: tip 读写锁
“共享锁”和“独占锁”常用来描述读写锁（ReadWriteLock）中的两个不同类型的锁，这是为了直观地区分它们在并发访问控制上的不同行为和特性。

- **共享锁（读锁）**：允许多个线程同时持有，也就是说，当一个线程获得了共享锁（通常是进行读操作时），其他线程仍然可以获取该锁并执行读操作。这种设计是基于“读取操作不会改变数据”的前提，因此多个读取操作可以并行进行，提高了系统的并发性能。在Java中，`ReentrantReadWriteLock`的读锁就是一个典型的共享锁示例。

- **独占锁（写锁）**：在同一时间只允许一个线程持有，当一个线程获取了独占锁（通常是进行写操作时），其他所有试图获取该锁的线程（不论是读还是写）都必须等待，直到锁被释放。这是因为写操作可能会改变数据的状态，为了保持数据的一致性，必须阻止其他线程同时进行读写操作。同样以Java为例，`ReentrantReadWriteLock`的写锁就是独占锁的体现。

之所以有时候将读写锁称为共享锁和独占锁，是因为这样的称呼直接反映了这两种锁的核心特征：共享锁鼓励资源共享，提高了读操作的并发效率；独占锁确保了资源的互斥访问，保障了写操作的原子性和数据完整性。
:::


**3. 公平锁和非公平锁**
- **公平锁**：按照线程请求锁的顺序来分配锁，保证先来的线程优先获得锁。这可能导致性能稍差，因为需要维护等待队列。
- **非公平锁**：允许插队，即使有线程已经在等待，新来的线程也可能直接获得锁。这提高了吞吐量，但可能会导致某些线程饥饿。

**4. 可重入锁和非可重入锁**
- **可重入锁**：同一个线程可以多次获取同一把锁，不会造成死锁。Java中的`synchronized`和`ReentrantLock`都是可重入的。
- **非可重入锁**：一旦线程获取了锁，再次尝试获取时会被阻塞，可能导致死锁。现代编程实践中较少使用非可重入锁。

**5. 可中断锁和不可中断锁**
- **可中断锁**：等待锁的过程中，线程可以被中断，从而能够响应中断信号及时退出等待状态。Java中通过`Lock`接口的`lockInterruptibly()`方法实现。
- **不可中断锁**：等待锁的线程不能响应中断请求，必须等待锁释放或等待超时。Java中的普通`synchronized`块和`Lock`的`lock()`方法就是不可中断的。

**6. 自旋锁和非自旋锁**
- **自旋锁**：线程在尝试获取锁失败时，不是立即挂起，而是在循环中不断地尝试获取锁（自旋），直到成功。适用于锁持有时间短的场景，可以减少线程上下文切换的开销。
- **非自旋锁**：线程在获取锁失败后立即阻塞，直到被唤醒。适用于锁持有时间较长的情况，避免了CPU空转消耗。

这些锁机制在设计并发程序时根据不同的场景和需求灵活选择，以达到既安全又高效的并发控制目的。



## Java内存模型(JMM)

Java内存模型（Java Memory Model, JMM）是Java平台定义的一种多线程之间共享内存和交互的规范，它为Java程序中并发操作的正确性提供了基础保障。JMM旨在提供一套标准化的规则，确保不同线程对共享数据的访问无论在何种硬件和操作系统平台上都具有一致的行为，从而解决了跨平台的兼容性问题。

**Java内存模型的作用**：

1. **可见性**：JMM确保一个线程修改的共享变量能及时对其他线程可见。通过使用synchronized、volatile关键字或显式锁，可以实现这一目标。

2. **有序性**：通过内存屏障（memory barrier）等机制，JMM禁止了某些不安全的指令重排序，保证了程序执行的逻辑顺序与程序员的意图相匹配。

::: info 为什么需要Java内存模型？

1. **屏蔽硬件差异**：不同的硬件平台（如CPU）和操作系统在内存管理、缓存使用和线程调度上有各自的机制，这可能导致相同Java程序在不同平台上表现出不同的运行结果。JMM通过统一的规范，屏蔽了这些底层差异，使得程序开发者不必关心底层硬件的细节。

2. **确保数据一致性**：在多线程环境下，线程对共享变量的访问和修改可能因为缓存一致性问题而不一致。JMM通过定义共享变量何时、如何在工作内存与主内存之间同步，确保了数据的一致性。

3. **解决有序性问题**：现代处理器为了优化性能，可能会对指令进行重排序，这在单线程环境下是安全的，但在多线程环境中可能导致程序逻辑混乱。JMM通过Happens-Before规则等机制，定义了线程间操作的顺序关系，确保了指令执行的正确顺序。
:::



### 缓存一致性问题

**CPU与主内存速度差异**：

随着半导体技术的发展，CPU的时钟频率显著提高，而主内存（DRAM）的访问速度提升却远没有那么快。这种速度不匹配导致CPU在等待主内存数据传输时处于空闲状态，极大地降低了系统的整体效率。为了减少这种等待时间，CPU缓存应运而生。

**CPU架构与缓存系统**：

现代CPU架构中，为了缓解CPU与主内存之间巨大的速度差异，引入了高速缓存（Cache）作为中间层。CPU缓存是一种小容量但高速的存储器，它位于CPU与主内存之间，用来暂时存储CPU即将访问的数据或指令。缓存的设计基于局部性原理，即程序在执行过程中往往倾向于频繁访问同一区域或附近的数据。

**多级缓存结构介绍**：

为了进一步优化性能，现代CPU普遍采用多级缓存架构，典型的配置是L1、L2、L3缓存。L1缓存最接近CPU核心，速度最快但容量最小；L2缓存在L1之后，速度稍慢但容量更大；L3缓存则服务于整个CPU芯片，容量最大但速度最慢。每一级缓存都作为下一级缓存的缓冲，形成了一个金字塔式的层次结构。

::: info 缓存一致性问题
当多个CPU核心拥有各自的缓存时，它们可能各自保存同一份主内存数据的副本。当一个核心修改了缓存中的数据，如何确保其他核心的缓存中对应的数据副本得以及时更新，这就是缓存一致性问题。若处理不当，会导致数据不一致，影响程序的正确性。
:::

数据不一致通常发生在以下几种情况：
- **写-写冲突**：两个或多个CPU核心同时修改同一份数据的缓存副本。
- **读-写冲突**：一个核心正在修改数据，而另一个核心正尝试读取同一数据的旧版本。
- **写-读延迟**：一个核心修改了数据，但修改结果未能即时传播到其他核心的缓存中。

为了解决这些问题，CPU采用了如MESI这样的缓存一致性协议，通过监听总线上的消息、设置缓存状态标记、以及必要的数据广播或失效操作，确保了所有缓存中的数据副本保持一致。这些机制在硬件层面自动进行，对程序员透明，但理解其原理有助于设计更高效的并发程序。

::: info MESI协议
MESI（Modified, Exclusive, Shared, Invalid）协议是一种常用的缓存一致性协议，用于维护多核处理器系统中缓存的一致性。协议定义了缓存行（cache line，缓存中的最小单位）的四种状态：
- **Modified (M)**：数据已被修改，仅存在于本缓存中，主内存中的数据已失效，需在写回前不能被其他处理器读取。
- **Exclusive (E)**：数据未被修改，仅存在于本缓存中，其他地方没有副本。
- **Shared (S)**：数据未被修改，可能存在于多个缓存中。
- **Invalid (I)**：数据无效，不可用。
:::


### 主内存和工作内存

Java 作为高级语言，屏蔽了 L1 缓存、L2 缓存、L3 缓存 这些多层缓存的底层细节，用 JMM 定义了一套读写数据的规范。我们不再需要关心 L1 缓存、L2 缓存、L3 缓存等多层缓存的问题，我们只需要关心 JMM 抽象出来的主内存和工作内存的概念（JMM将内存分为两大区域：主内存和工作内存，以此来协调线程间的通信和数据一致性）

**主内存（Main Memory）**
==主内存是所有线程共享的内存区域==，它存储了Java程序中声明的所有变量（实例字段、静态字段、数组元素）的真实副本。主内存对于Java内存模型而言，是一个抽象的概念，并不仅仅指物理内存或者RAM，而是涵盖了Java虚拟机（JVM）内存中的特定区域，如Java堆（Heap）中对象的实例数据部分和方法区（Method Area，或称为非堆内存、永久代）中类的静态变量和常量池等。主内存中的数据对于所有线程都是可见的，但是线程不能直接操作主内存中的变量，只能通过读/写操作将变量的值加载到工作内存或从工作内存回写到主内存。

**工作内存（Working Memory）**
==每个线程都有自己的工作内存，这是一个私有区域，存储了该线程使用到的主内存中变量的副本==。工作内存中包含了线程私有的栈空间，包括局部变量表、操作数栈等，以及对主内存中变量的拷贝。线程对变量的所有操作（读取、赋值等）都在工作内存中进行，而不是直接操作主内存。只有在特定的操作（如同步操作、volatile变量的读写等）下，才会将工作内存中的值刷新到主内存，或将主内存的值读入到工作内存。

**主内存与工作内存的交互**
- **读取**：线程从主内存中读取一个变量的值到工作内存。
- **使用**：线程在工作内存中使用这个变量的值进行计算。
- **赋值**：线程在工作内存中给变量赋予新的值。
- **写回**：线程将工作内存中变量的新值写回到主内存中。

为了保证线程间的可见性和有序性，JMM还定义了一系列的规则，比如“happens-before”原则，以及通过内存屏障（Memory Barrier）来确保某些操作的执行顺序，禁止指令重排序，以及确保数据的及时更新。



### 内存屏障

内存屏障（Memory Barrier），又称为内存栅栏或内存 fence，是一种硬件指令或软件指令，用于控制处理器和编译器对内存操作的执行顺序，确保内存访问的正确性和一致性，特别是在多核处理器的并发编程中尤为重要。内存屏障主要解决两个核心问题：**可见性**和**有序性**。

**内存屏障的作用**:
1. **保证写入的可见性**：确保写入一个共享变量的操作在后续的读取操作之前对其他线程可见，这涉及到刷新缓存和同步更新主内存的过程。
2. **禁止重排序**：阻止编译器和处理器对指令进行不必要的重排序，维持程序的逻辑顺序，这对于依赖特定执行顺序的并发代码至关重要。
3. **解决缓存一致性**：在多处理器系统中，内存屏障可以强制更新缓存行，确保不同处理器的缓存之间保持一致，例如通过MESI协议。

**内存屏障的实现方式**:
- **硬件内存屏障**：大多数现代CPU提供了专门的指令来实现内存屏障，如x86架构的`mfence`（全内存屏障）、`lfence`（加载屏障）、`sfence`（存储屏障）等。
- **软件内存屏障**：在编译器层面实现，通过插入特定指令或标记来控制编译器的指令重排，但不一定影响硬件层面的执行顺序。

**Java中的内存屏障**：

在Java中，内存屏障的使用是透明的，主要通过语言特性和JVM实现来保证。Java中volatile变量的读写操作以及synchronized块的进入和退出都会隐式地插入内存屏障，以确保相应的内存效果。例如：

- 使用`volatile`关键字修饰的变量，每次读/写操作前后都会自动插入内存屏障，确保了变量的可见性和一定的有序性。
- `synchronized`块和方法的实现也会隐式地包含内存屏障，确保了锁的正确获取和释放以及锁保护的变量的可见性。
- Java并发包中的`java.util.concurrent.atomic`类也利用内存屏障来实现原子操作，确保线程安全。


::: info 常见的内存屏障及其具体功能和作用
#### 1. Store Barrier（写屏障）

**功能**：确保屏障前的所有写操作在屏障后的任何写操作之前完成，并且这些写操作的结果对其他处理器变得可见。

**示例**：在Java中，`volatile`字段的写操作后会自动插入一个Store屏障。这意味着当一个线程修改了一个`volatile`变量的值，屏障会确保这个改变立即被刷新到主内存，对其他线程可见，而不会被之后的写操作所覆盖或延迟。

#### 2. Load Barrier（读屏障）

**功能**：确保屏障后的读操作在屏障前的任何读操作之后完成，且能够看到屏障之前所有已完成的写操作的最新结果。

**示例**：同样以Java为例，读取`volatile`字段之前会有一个隐含的Load屏障。这意味着当一个线程读取`volatile`变量时，屏障会确保在此之前其他线程对内存的修改（不仅仅是该`volatile`变量，还包括其他可能影响到该读取结果的变量）都已经被观察到。

#### 3. Store-Load Barrier（写-读屏障）

**功能**：确保屏障前的所有写操作在屏障后的读操作之前完成，并且屏障后的读取能够看到屏障前所有已完成写操作的影响。

**示例**：在多线程编程中，一个线程A在完成一系列的写操作后，希望这些修改对线程B可见，并且确保线程B在其后进行的读取操作中能看到这些更新。在一些高级并发原语（如Java中的`java.util.concurrent.AtomicReference.compareAndSet()`）的实现中，为了保证比较-交换操作的正确性，会在操作前后分别插入Store-Load屏障。

#### 4. Full Barrier（全屏障）

**功能**：确保屏障前的所有读写操作在屏障后的所有读写操作之前完成，既保证了写操作的可见性，也防止了读写操作的任意重排序。

**示例**：在复杂的多线程同步场景中，比如Java中的`synchronized`块的退出时，会插入一个Full Barrier。这不仅确保了当前线程在解锁之前的所有修改对其他线程可见，同时也确保了其他线程在获取锁之后看到的是一个一致的状态，不会出现因指令重排序导致的不一致视图。
:::

这些内存屏障通过在关键位置插入指令，控制了内存访问的顺序，确保了多线程环境下数据的一致性和程序的正确执行。在具体应用中，开发者通常不需要直接操纵内存屏障，而是通过语言提供的高级抽象（如Java的`volatile`、`synchronized`关键字）来间接利用这些机制。



### happens-before

在Java内存模型（JMM）中，"happens-before" 是一个非常重要的概念，它用来定义多线程环境中程序执行的偏序关系，确保了程序执行的可见性和顺序性，即使在编译器优化和处理器乱序执行的情况下也能保证正确性。简单来说，如果事件A "happens-before" 事件B，那么A的执行结果将对B可见，并且A必须在B之前执行（但不意味着紧接在B之前）。


Java内存模型通过以下规则定义了happens-before关系：

1. **程序顺序规则（Program Order Rule）**：在一个线程内，按照程序的顺序，前面的语句操作 "happens-before" 后面的语句操作。这条规则保证了单线程内的操作顺序性。

2. **监视器锁规则（Monitor Lock Rule）**：对一个锁的解锁操作 "happens-before" 于随后对这个锁的加锁操作。这确保了锁的正确同步效果，解锁前的内存状态对加锁后可见。

3. **volatile变量规则（Volatile Variable Rule）**：对volatile域的写操作 "happens-before" 于任何后续对这个volatile域的读操作。这保证了volatile变量的可见性和一定程度的顺序性。

4. **线程启动规则（Thread Start Rule）**：主线程A启动线程B的 `start()` 方法调用 "happens-before" 于线程B中的任何操作。确保线程B可以看到主线程A启动它之前的操作结果。

5. **线程终止规则（Thread Termination Rule）**：线程A中的任何操作 "happens-before" 于其他线程检测到线程A已终止（通过 `Thread.join()` 返回或 `Thread.isAlive()` 返回false）。

6. **中断规则（Interrupt Rule）**：线程A调用线程B的 `interrupt()` 方法 "happens-before" 于线程B通过 `isInterrupted()` 检测到中断状态或抛出 `InterruptedException`。

7. **终结器规则（Finalizer Rule）**：对象的构造函数结束 "happens-before" 于它的finalize() 方法的开始。保证对象的初始化在finalize之前完成。

8. **传递性（Transitivity）**：如果A "happens-before" B，且B "happens-before" C，则A "happens-before" C。


这些"happens-before"规则是通过一系列的编译器优化限制和处理器内存操作的约束来实现的，旨在确保多线程程序中的正确性：
::: info happens-before规则的实现
#### 1. 编译器优化限制

- **禁止特定重排序**：编译器在生成机器码时，会遵循JMM的规定，禁止那些会改变程序语义的指令重排序。例如，对于volatile变量的读写，编译器会确保它们的顺序不被破坏，即使在没有显式同步的情况下。

- **插入内存屏障（Memory Barriers）**：为了确保某些操作的顺序性，编译器会在必要时插入内存屏障指令。这些指令可以是Load Barrier、Store Barrier、Load-Store Barrier等，它们控制了内存操作的执行顺序和数据的可见性。例如，在volatile写操作之后插入Store屏障，确保该写入对其他线程可见。

#### 2. 处理器内存模型的适配

- **内存屏障硬件指令**：处理器提供了内存屏障指令，如Intel x86架构中的`MFENCE`、`LFENCE`、`SFENCE`等，这些指令直接控制了处理器的内存访问顺序，确保了指令间的依赖关系和内存操作的全局顺序。

- **缓存一致性协议**：多核处理器通过缓存一致性协议（如MESI协议）来维护缓存之间的数据一致性。当一个处理器修改了某个缓存行的数据，协议会确保这个修改最终被传播到所有其他处理器的缓存中，从而间接支持了happens-before的可见性要求。
:::
通过上述机制，JMM确保了happens-before规则在实际硬件上的正确执行，即使在复杂的多线程环境中也能提供一致的内存视图和操作顺序，为程序员提供了一种跨平台的内存模型抽象，简化了并发编程的难度。


**"happens-before"规则在Java并发编程中的体现**：
- **synchronized**：当线程进入一个synchronized块或方法时，会执行一个获取锁的操作，退出时执行释放锁操作。这些操作伴随着内存屏障，确保了锁规则的happens-before关系，即锁的释放操作对所有后续的锁获取操作可见。

- **volatile**：volatile变量的访问（读或写）也会伴随着适当的内存屏障，确保volatile写操作对后续的volatile读操作可见，并且volatile变量的修改对所有线程的读取都是顺序一致的。

- **start()方法**：用于启动一个新的线程，新线程从其 `run()` 方法开始执行。这个操作之前的操作对新线程可见。

- **join()方法**：线程中调用另一个线程的 join() 方法时，调用线程会阻塞，直到被调用 `join()` 的那个线程执行完毕后才会继续执行。这有助于确保被等待线程的操作对调用 `join()` 的线程是可见的




### volatile

`volatile`是Java中的一个关键字，主要用于修饰变量。它有两个主要作用：

1. **保证可见性**：当一个变量被声明为`volatile`时，任何线程对它的修改都会立即写入主内存，而其它线程对这个变量的读取也会直接从主内存中读取最新的值。这确保了多线程环境下变量值的可见性。

2. **禁止指令重排序**：在JVM中，为了优化性能，编译器和处理器可能会对指令进行重排序。`volatile`关键字能禁止某些类型的指令重排序，以保证有序性，尤其是对单个变量的读/写操作不会被重排序。

**应用场景：** 常用于状态标记量、双重检查锁定（DCL）模式中的标志位、或其他需要跨线程立即可见的变量。

::: code-tabs#shell

@tab:active 作为标记位示例
```java
// 假设有一个线程用于监控某个条件，一旦条件满足，就改变一个标志位，通知其他线程停止执行
public class VolatileExample {
    // `stop`变量作为标记位，确保了当其值被改变时，正在执行循环的线程能够立即感知并退出循环
    private volatile boolean stop = false;

    public void startTask() {
        new Thread(() -> {
            while (!stop) {
                // 执行任务...
            }
            System.out.println("任务停止");
        }).start();
    }

    public void stopTask() {
        stop = true; // 改变标志位，通知线程停止
    }

    public static void main(String[] args) {
        VolatileExample example = new VolatileExample();
        example.startTask();
        // 模拟一段时间后停止任务
        try { Thread.sleep(5000); } catch (InterruptedException e) { e.printStackTrace(); }
        example.stopTask();
    }
}
```

@tab 触发器示例
```java
// 当需要一个变量的更新来触发某些操作，而不关心变量本身的值时，可以使用`volatile`作为触发器
public class TriggerExample {
    // `trigger`变量作为触发器，当其值由0变为非0时，监听线程会执行一次特定操作。
    private volatile int trigger = 0;

    public void triggerAction() {
        trigger++;
        // 触发操作...
    }

    public void listenForTrigger() {
        while (true) {
            if (trigger != 0) {
                // 执行被触发的操作
                System.out.println("触发操作被执行");
                trigger = 0; // 重置触发器
                break;
            }
        }
    }

    public static void main(String[] args) {
        TriggerExample example = new TriggerExample();
        new Thread(example::listenForTrigger).start();
        // 模拟一段时间后触发操作
        try { Thread.sleep(2000); } catch (InterruptedException e) { e.printStackTrace(); }
        example.triggerAction();
    }
}
```
:::

**volatile不适用的场合及注意事项**：

1. **不保证原子性**：虽然`volatile`可以确保变量的可见性，但它不能替代锁（如`synchronized`）来保证复合操作的原子性。例如，对一个volatile修饰的计数器进行++操作并不是原子的，多个线程同时操作会导致结果不正确。

2. **不适合多状态变量**：如果一个操作需要基于多个volatile变量的状态来决定下一步动作，那么volatile可能无法提供所需的同步保障，因为它们之间没有整体的可见性保证。

3. **不要过度使用**：`volatile`应当仅在确实需要保证变量可见性或禁止指令重排序的场景下使用。滥用可能导致不必要的性能开销或逻辑错误。

4. **不适合长操作和写操作频繁的场景**：频繁的写操作可能导致大量的缓存同步，影响性能。而对于需要长时间计算或涉及多个变量的复合操作，应考虑使用锁或其他同步机制。





## 原子类与并发集合

Java中提供了丰富的原子类与并发集合来支持高并发环境下的线程安全操作。

::: tip 原子类的底层实现原理
`AtomicInteger`等原子类利用了`Unsafe`类提供的底层操作，其中包括Compare-And-Swap (CAS) 操作。==通过`Unsafe`类调用的CAS操作最终会映射到硬件层面的原子指令==。大多数现代处理器（如x86架构）都提供了对CAS指令的直接支持，这使得CAS操作可以在硬件层面保证原子性，即操作过程中不会被中断，保证了数据的一致性。

- **原语与操作系统**: 原子操作（atomic operation）在计算机科学中指的是不可分割的操作，即一个操作要么全部完成，要么完全不执行，不会出现中间状态。虽然“原语”一词有时在操作系统中用来指代不可中断的系统操作序列，但这里的原子操作更多是指硬件层面的支持，而非严格意义上的操作系统概念。不过，两者都强调了操作的不可分割性和完整性。

- **关于数据一致性**: CAS确实有助于避免数据不一致的问题，因为它在修改数据前会先检查当前值是否符合预期，只有在符合预期的情况下才会更新，这样可以减少多线程环境下的数据竞争问题。但是，需要注意的是，单纯依赖CAS并不能解决所有的并发问题，比如ABA问题，以及在存在多个竞争线程不断尝试更新同一变量时可能导致的活锁问题。因此，在设计并发程序时，还需要综合考虑其他同步机制和策略。

因此利用Java提供的原子类在性能和可靠性上通常优于自定义的CAS实现，尤其是在内存操作层面
:::

**原子类 (java.util.concurrent.atomic 包)**：

原子类主要用于在多线程环境中对基本类型和引用类型进行线程安全的更新操作，它们主要基于CAS (Compare and Swap) 操作实现非阻塞同步。主要原子类包括：

1. **`AtomicInteger`**：用于原子地更新整数值。
2. **`AtomicLong`**：用于原子地更新长整数值。
3. **`AtomicBoolean`**：用于原子地更新布尔值。
4. **`AtomicReference<T>`**：用于原子地更新引用类型变量。
5. **`AtomicStampedReference<T>`**：不仅原子地更新引用，还包含一个stamp值，用于解决ABA问题。
6. **`AtomicMarkableReference<T>`**：类似于AtomicStampedReference，但使用一个布尔标记代替stamp。
7. **`AtomicIntegerFieldUpdater<T>`**：允许原子地更新指定类的实例中的整型字段，无需定义为AtomicInteger。
8. **`AtomicLongFieldUpdater<T>`**：类似于AtomicIntegerFieldUpdater，但针对长整型字段。
9. **`AtomicReferenceFieldUpdater<T,U>`**：原子地更新指定类实例中引用类型字段的值。
10. **`AtomicIntegerArray`**：对整数数组中的元素进行原子更新。
11. **`AtomicLongArray`**：对长整型数组中的元素进行原子更新。


**并发集合 (java.util.concurrent 包)**：

并发集合设计用于高并发环境下的高效线程安全操作，它们通过各种机制（如分段锁、CAS等）减少锁的竞争，提高并发性能。主要并发集合包括：

1. **`ConcurrentHashMap`**：线程安全的哈希表，支持高效并发读写操作。
2. **`CopyOnWriteArrayList`**：适用于读多写少的场景，写操作时会复制一个新的数组，保证读操作不会被阻塞。
3. **`CopyOnWriteArraySet`**：基于CopyOnWriteArrayList的线程安全Set实现。
4. **`ConcurrentLinkedQueue`**：线程安全的先进先出队列，基于链表实现，支持高效并发访问。
5. **`LinkedBlockingQueue`**：一个由链表结构组成的有界阻塞队列。
6. **`ArrayBlockingQueue`**：一个由数组支持的有界阻塞队列。
7. **`PriorityBlockingQueue`**：一个无界优先级阻塞队列。
8. **`DelayQueue`**：一个基于优先级队列的无界阻塞队列，其中元素只有当其延迟到期时才能被移除。
9. **`SynchronousQueue`**：一个不存储元素的阻塞队列，每个插入操作必须等待另一个线程的对应移除操作。
10. **`Exchanger<T>`**：允许两个线程交换对象的同步点。

这些并发集合和原子类是Java并发编程中的重要工具，能够帮助开发者构建高性能、线程安全的应用程序。



### AtomicInteger

`AtomicInteger`是Java并发包提供的一个线程安全的整型类，它通过底层的CAS（Compare-And-Swap）操作实现原子性更新。这意味着多个线程可以安全地并发访问和修改这个变量，而不需要额外的锁机制。其内部维护了一个`value`字段，通过JNI调用到C++层的CAS函数实现原子操作。

1. **构造方法**
   - `AtomicInteger(int initialValue)`：创建具有指定初始值的`AtomicInteger`对象。

2. **基本操作**
   - `get()`：获取当前值。
   - `set(int newValue)`：设置新的值。
   - `lazySet(int newValue)`：设置新的值，但可能有更弱的内存一致性效果。
   - `getAndSet(int newValue)`：设置新的值并返回旧值。
   - `incrementAndGet()`：原子地增加当前值并返回新值。
   - `decrementAndGet()`：原子地减少当前值并返回新值。
   - `addAndGet(int delta)`：原子地将给定值与当前值相加并返回新值。
   - `getAndIncrement()`、`getAndDecrement()`、`getAndAdd(int delta)`：分别对应上述增加、减少、加法操作的版本，但返回的是操作前的值。

**应用场景**：
- 计数器，如统计访问次数、线程安全的递增/递减操作。
- 无锁编程，避免传统锁带来的性能开销。

```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicIntegerExample {
    public static void main(String[] args) {
        AtomicInteger count = new AtomicInteger(0);

        Runnable incrementTask = () -> {
            for (int i = 0; i < 10000; i++) {
                count.incrementAndGet();
            }
        };

        Thread t1 = new Thread(incrementTask);
        Thread t2 = new Thread(incrementTask);

        t1.start();
        t2.start();

        try {
            t1.join();
            t2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("最终计数结果: " + count.get());
    }
}
```
注意：在主线程中调用多个子线程的`join()`方法，是为了让主线程等待这些子线程都执行完毕，但这并不会改变子线程之间并发执行的性质。当多个子线程启动后，它们会尽可能地并行运行，操作系统会调度这些线程在不同的CPU核心上执行（如果可用的话），因此它们之间是并发而非串行的。



### AtomicReference

类似于`AtomicInteger`，`AtomicReference`用于原子性地更新对象引用。它同样基于CAS机制，使得对引用的更新操作在多线程环境下保持原子性和可见性。

1. **构造方法**
   - `AtomicReference(V initialValue)`：创建具有指定初始引用的对象。

2. **基本操作**
   - `get()`：获取当前引用的值。
   - `set(V newValue)`：设置新的引用值。
   - `lazySet(V newValue)`：设置新的引用值，内存一致性效果较弱。
   - `getAndSet(V newValue)`：设置新的引用值并返回旧的引用值。
   - `compareAndSet(V expectedValue, V newValue)`：如果当前引用值等于预期值，则原子地将引用值设置为新值，并返回true，否则返回false。
   - `weakCompareAndSet(V expectedValue, V newValue)`：类似`compareAndSet`，但使用弱一致性内存语义。

**应用场景**：
- 实现无锁的数据结构，如无锁队列、栈。
- 状态标记，当状态是一个复杂对象时，可以使用`AtomicReference`来安全更新。

```java
import java.util.concurrent.atomic.AtomicReference;

public class AtomicReferenceExample {
    public static void main(String[] args) {
        AtomicReference<String> ref = new AtomicReference<>("Hello");

        // 尝试更新引用
        boolean updated = ref.compareAndSet("Hello", "World");
        System.out.println("更新成功吗? " + updated + ", 当前值: " + ref.get());

        updated = ref.compareAndSet("Goodbye", "World");
        System.out.println("更新成功吗? " + updated + ", 当前值: " + ref.get());
    }
}
```


### ABA问题解决方案

原子类中，`AtomicStampedReference` 是专门设计来解决ABA问题的。ABA问题发生在当一个变量被多次从A修改为B然后再改回A，如果只关注变量的最终值，看起来好像没有变化，但实际上中间经历了B状态。在某些场景下，这种中间状态的改变是有意义的，需要被检测到。

::: tip AtomicStampedReference是如何解决ABA问题的？
`AtomicStampedReference` 通过添加一个额外的“时间戳”（stamp）字段来跟踪值的变化，每次更新时都会修改这个时间戳，因此即使值回到了初始值，时间戳也能反映出中间发生过变化，从而避免了ABA问题。
:::

**构造方法**:

- **`AtomicStampedReference(V initialRef, int initialStamp)`**  
  创建一个新的 `AtomicStampedReference` 实例，初始化引用值为 `initialRef`，初始邮戳为 `initialStamp`。

**常用方法**:

- `V get()`  
  返回当前引用的值，但不返回邮戳。这个方法不常用于并发控制，因为它不提供邮戳信息，不能帮助检测 ABA 问题。
- `int getStamp()`
  此方法单独返回当前 AtomicStampedReference 的邮戳值，不涉及引用值的获取。这个方法通常用于只需要检查邮戳，而不需要同时获取引用值的场景。
- **`V get(int[] stampHolder)`**  
  返回当前引用的值，并==将当前邮戳设置给 `stampHolder` 数组的第一个元素==。这个方法用于准备进行并发控制操作，获取当前状态的同时获取邮戳。

- **`boolean compareAndSet(V expectedReference, V newReference, int expectedStamp, int newStamp)`**  
  尝试原子地将引用值和邮戳一起更新。如果当前引用值等于 `expectedReference` 且当前邮戳等于 `expectedStamp`，则更新引用值为 `newReference`，邮戳为 `newStamp`，并返回 `true`；否则不做任何操作并返回 `false`。这是解决 ABA 问题的关键方法。

- `boolean weakCompareAndSet(V expectedReference, V newReference, int expectedStamp)` 
  类似于 `compareAndSet`，但这是一个弱形式的操作，它对于某些并发环境可能提供更宽松的内存一致性保证，具体取决于 JVM 实现。通常在不需要严格内存排序保证的场景下使用。

- `void set(V newValue, int newStamp)`
  直接设置引用值为 `newValue` 和邮戳为 `newStamp`，不涉及比较，不提供原子性保证，通常在初始化或确定不会有并发更新的场景下使用。

::: info stampHolder为什么需要使用数组类型？
- **stampHolder**：一个整数数组，通常长度为1，用于接收 `get` 方法返回的当前邮戳值。

`stampHolder`使用数组是为了能够在原子操作中更新时间戳，并确保这个更新能被外部代码感知，从而保证了并发控制的有效性。这是Java并发编程中一种常见的技巧，用来绕过基本类型值传递的限制
:::

下面是一个使用`AtomicStampedReference`模拟银行账户转账场景的示例：
```java
import java.util.concurrent.atomic.AtomicStampedReference;

class Account {
    private int balance;

    public Account(int balance) {
        this.balance = balance;
    }

    public int getBalance() {
        return balance;
    }

    public void setBalance(int balance) {
        this.balance = balance;
    }
}

public class AtomicStampedReferenceDemo {

    public static void main(String[] args) throws InterruptedException {
        Account initialAccount = new Account(100);
        AtomicStampedReference<Account> accountRef = new AtomicStampedReference<>(initialAccount, 0);

        // 模拟两个线程同时操作账户
        Thread withdrawThread = new Thread(() -> {
            int[] stampHolder = new int[1];
            Account oldAccount;
            do {
                oldAccount = accountRef.get(stampHolder); // 获取当前账户引用和时间戳
                Account newAccount = new Account(oldAccount.getBalance() - 50); // 尝试转账
                boolean success = accountRef.compareAndSet(oldAccount, newAccount, stampHolder[0], stampHolder[0] + 1);
            } while (!success); // 如果其他线程修改过，就重试
            System.out.println("Withdraw successful. New balance: " + newAccount.getBalance());
        });

        Thread depositThread = new Thread(() -> {
            int[] stampHolder = new int[1];
            Account oldAccount;
            do {
                oldAccount = accountRef.get(stampHolder); // 获取当前账户引用和时间戳
                Account newAccount = new Account(oldAccount.getBalance() + 100); // 存款
                boolean success = accountRef.compareAndSet(oldAccount, newAccount, stampHolder[0], stampHolder[0] + 1);
            } while (!success); // 如果其他线程修改过，就重试
            System.out.println("Deposit successful. New balance: " + newAccount.getBalance());
        });

        withdrawThread.start();
        depositThread.start();

        withdrawThread.join();
        depositThread.join();

        Account finalAccount = accountRef.getReference();
        System.out.println("Final balance: " + finalAccount.getBalance());
    }
}
```


至于其他原子类，如`AtomicInteger`、`AtomicLong`、`AtomicBoolean`、`AtomicReference`等，它们虽然没有直接内置解决ABA问题的机制，但它们在很多常见并发场景下依然非常有用。例如：

- **AtomicInteger 和 AtomicLong**：用于原子地更新整数值，常用于计数器、序列生成器等场景。
- **AtomicBoolean**：用于原子地更新布尔值，适合做标志位的控制。
- **AtomicReference**：可以原子地更新对象引用，适合管理共享对象的状态变更。

这些原子类在处理并发更新时，能够保证更新操作的原子性和线程安全性，减少了同步开销，提高了并发性能。它们在不需要关心ABA问题，或者可以通过其他逻辑规避ABA问题的场景下，是非常有效的工具。因此，尽管`AtomicStampedReference`提供了特殊的ABA解决方案，但其他原子类在不需要解决ABA问题的常规并发控制中仍然非常重要且常用。



### 原子更新器类

`AtomicIntegerFieldUpdater`, `AtomicLongFieldUpdater`, 和 `AtomicReferenceFieldUpdater` 都是 Java 并发包中的类，它们提供了在非 volatile 字段上执行原子更新的能力。

- **AtomicIntegerFieldUpdater**: 专门用于原子更新指定类实例中的 `int` 类型字段。你可以使用它来进行原子性的增加、减少或设置 `int` 字段的值。
  
- **AtomicLongFieldUpdater**: 用于原子更新指定类实例中的 `long` 类型字段。和 `AtomicIntegerFieldUpdater` 类似，但它处理的是 `long` 类型的数值，适用于需要更大数值范围的场景。
  
- **AtomicReferenceFieldUpdater**: 用于原子更新指定类实例中的引用类型字段，无论是对象引用还是其他非原始类型（如 `String`, `AtomicInteger` 等）。这使得你可以安全地更新对象引用而无需同步代码。

::: info 原子更新器特性
- **非阻塞操作**：所有这些更新器都提供非阻塞的原子操作，提高了并发性能。
- **反射使用**：它们都利用反射来访问目标类的字段，因此要求字段必须是可访问的（非 private），并且在类加载时就已经存在。
- **线程安全**：提供的更新方法（如 `compareAndSet`, `getAndIncrement` 等）都是线程安全的，可以安全地在多线程环境中使用。
- **创建方式**：都需要通过静态工厂方法（如 `newUpdater`）创建一个更新器实例，指定目标类、字段类型和字段名。
:::


**使用场景**：
- **AtomicIntegerFieldUpdater** 和 **AtomicLongFieldUpdater** 主要用于计数器、序列号生成、状态标志等需要原子更新数值类型字段的场景。
  
- **AtomicReferenceFieldUpdater** 则更加通用，适用于需要原子更新任何引用类型的情况，如对象的替换、状态模式中的状态对象切换等。


以下是一个使用 `AtomicReferenceFieldUpdater` 的简单示例：

```java
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;

class User {
    // 注意：字段不能是private，因为AtomicReferenceFieldUpdater需要通过反射访问
    public String status;

    public User(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "User{" +
                "status='" + status + '\'' +
                '}';
    }
}

public class AtomicReferenceFieldUpdaterExample {

    public static void main(String[] args) {
        // 创建User对象实例
        User user = new User("active");

        // 创建AtomicReferenceFieldUpdater实例
        // 第一个参数是包含待更新字段的类的Class对象
        // 第二个参数是待更新字段的类型
        // 第三个参数是待更新字段的名字
        AtomicReferenceFieldUpdater<User, String> statusUpdater =
                AtomicReferenceFieldUpdater.newUpdater(User.class, String.class, "status");

        System.out.println("Initial status: " + user);

        // 原子地更新用户状态
        if (statusUpdater.compareAndSet(user, "active", "inactive")) {
            System.out.println("Status updated to: " + user);
        } else {
            System.out.println("Update failed: status was not 'active'");
        }

        // 尝试再次更新状态，模拟并发更新场景
        if (statusUpdater.compareAndSet(user, "inactive", "pending")) {
            System.out.println("Status updated again to: " + user);
        } else {
            System.out.println("Second update failed: status was not 'inactive'");
        }
    }
}
```

::: tip
在某些情况下，如果字段也需要独立的内存可见性保证（例如，当多个线程直接读取该字段而不总是通过原子更新器操作时），则可能需要考虑使用 `volatile`。
:::




### 原子操作增强类

`LongAdder`、`DoubleAdder`、`LongAccumulator` 和 `DoubleAccumulator` 都是在 JDK 8 中引入的。这些类扩展了 Java 并发包的功能，提供了更高效的并发计数和累加方案，特别是针对高并发场景。它们通过分段累计的方式减少了争用，从而提高了在多线程环境下的性能。

**1. `LongAdder` 和 `DoubleAdder`**
- **用途**：这两个类用于高效地进行累加操作，特别是在高并发环境下。它们解决了`AtomicLong`在高并发时的性能瓶颈，通过分段累计的方式来减少竞争，提高吞吐量。
- **原理**：内部维护多个细胞（cell），每个细胞独立累加，最后汇总结果。当细胞数量不够时会动态扩容。
  ```java
  LongAdder adder = new LongAdder();
  for (int i = 0; i < 10000; i++) {
      adder.increment();
  }
  System.out.println("Total: " + adder.sum());
  ```

**2. `LongAccumulator` 和 `DoubleAccumulator`**

- **用途**：提供了一个更通用的累加框架，允许用户自定义累加逻辑（通过函数）。适用于需要根据特定规则累积值的场景。
- **原理**：同样采用分段累计的方式，但累加逻辑由用户提供。
  ```java
  LongAccumulator accumulator = new LongAccumulator((x, y) -> x * y, 1L);
  accumulator.accumulate(2L);
  accumulator.accumulate(3L);
  System.out.println("Result: " + accumulator.get());
  ```

::: tip 核心原理
这些原子操作增强类的核心原理都是基于**比较-交换（Compare-And-Swap, CAS）**算法，这是一种无锁的同步技术。在执行更新操作时，CAS算法会先比较内存中的值是否与预期值相同，如果相同则更新，否则不更新，这保证了操作的原子性。此外，通过分段累计等策略来减少竞争，提高并发性能。
:::

**使用注意事项**：
- **性能考量**：虽然增强类在高并发下性能优秀，但在低并发场景下可能不如直接使用基本原子类。
- **内存消耗**：分段累计的策略可能会增加内存使用量。
- **正确性**：使用时确保理解其工作原理，避免误用导致数据不一致。

<br/>

**下面将以`LongAdder` 为例进行详细介绍**：

**设计原理**：
1. **分段思想（Striping）**：`LongAdder` 内部采用了分段的思想来减少并发冲突。它不是维护一个单一的值，而是维护了一个名为 `Cell` 的数组（默认情况下为一个），每个 `Cell` 都是一个单独的计数器。当多个线程同时执行增加操作时，它们很可能会更新不同的 `Cell`，从而减少了锁的竞争。

2. **基础值与 Cell 数组**：除了 `Cell` 数组外，`LongAdder` 还维护了一个基础值（base），用于存储全局的累加结果。对于大多数更新操作，线程首先尝试更新它分配到的 `Cell`，如果更新成功，那么操作完成；如果 `Cell` 数组还未初始化或需要扩容，那么可能直接更新基础值。

3. **读取合并**：当需要获取当前计数的总和时，`LongAdder` 会遍历所有的 `Cell`，将每个 `Cell` 的值与基础值相加，得到最终的结果。这种设计允许读操作几乎总是非阻塞的，提高了读的性能。

::: tip LongAdder的优缺点
**优点**：
- **高性能**：在高并发环境下，由于减少了线程之间的竞争，`LongAdder` 的性能通常优于 `AtomicLong`。特别是当更新操作远多于读取操作时，性能提升更为显著。
- **自动扩容**：`LongAdder` 的内部机制会根据需要自动增加 `Cell` 数量，以适应更多的并发需求。

**缺点**：
- **内存占用**：为了减少冲突，`LongAdder` 使用了额外的内存来存储 `Cell` 数组，这使得它在内存消耗上高于 `AtomicLong`。
- **读取成本**：虽然读操作通常很快，但相比 `AtomicLong` 的单一变量读取，`LongAdder` 在需要合并所有 `Cell` 值时会有更高的开销。
:::



**使用场景**：
- **统计计数**：特别适用于需要频繁更新计数器的场景，如网站访问次数、事件计数等。
- **性能监控**：在高并发系统中作为性能指标的计数工具，如请求计数、错误计数等。



下面是使用 `LongAdder` 在两个线程中并行增加计数的示例：

```java
import java.util.concurrent.atomic.LongAdder;

public class LongAdderDemo {
    public static void main(String[] args) {
        LongAdder counter = new LongAdder();
        
        // 多线程环境下增加计数
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000000; i++) {
                counter.increment();
            }
        });
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000000; i++) {
                counter.increment();
            }
        });
        
        t1.start();
        t2.start();
        
        try {
            t1.join();
            t2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // 获取最终计数
        System.out.println("Total count: " + counter.sum());
    }
}
```


<br>

综合示例：对比不同并发计数方式在高并发情况下的性能差异，主要测试 synchronized关键字、`AtomicLong`、`LongAdder`和`LongAccumulator` 四种方法。代码通过创建50个线程，每个线程执行100万次点击计数操作，来比较这四种方式的执行效率
```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.LongAdder;
import java.util.concurrent.atomic.LongAccumulator;
import java.util.concurrent.CountDownLatch;

class ClickNumber {
    int number = 0;
    AtomicLong atomicLong = new AtomicLong(0);
    LongAdder longAdder = new LongAdder();
    LongAccumulator longAccumulator = new LongAccumulator(Long::sum, 0);
    
    public synchronized void clickBySynchronized() {
        number++;
    }

    public void clickByAtomicLong() {
        atomicLong.getAndIncrement();
    }

    public void clickByLongAdder() {
        longAdder.increment();
    }

    public void clickByLongAccumulator() {
        longAccumulator.accumulate(1);
    }
}

public class AccumulatorCompareDemo {
    public static final int _1W = 10000;
    public static final int THREAD_NUMBER = 50;
    private static ExecutorService executorService = Executors.newFixedThreadPool(THREAD_NUMBER);

    public static void main(String[] args) throws InterruptedException {
        ClickNumber clickNumber = new ClickNumber();
        long startTime;
        long endTime;
        CountDownLatch[] latches = {new CountDownLatch(THREAD_NUMBER), new CountDownLatch(THREAD_NUMBER),
                                  new CountDownLatch(THREAD_NUMBER), new CountDownLatch(THREAD_NUMBER)};

        testClickMethod(clickNumber, latches[0], "clickBySynchronized");
        testClickMethod(clickNumber, latches[1], "clickByAtomicLong");
        testClickMethod(clickNumber, latches[2], "clickByLongAdder");
        testClickMethod(clickNumber, latches[3], "clickByLongAccumulator");

        executorService.shutdown();
    }

    private static void testClickMethod(ClickNumber clickNumber, CountDownLatch latch, String methodName) throws InterruptedException {
        long startTime = System.currentTimeMillis();
        for (int i = 0; i < THREAD_NUMBER; i++) {
            executorService.submit(() -> {
                try {
                    for (int j = 1; j <= 100 * _1W; j++) {
                        switch (methodName) {
                            case "clickBySynchronized":
                                clickNumber.clickBySynchronized();
                                break;
                            case "clickByAtomicLong":
                                clickNumber.clickByAtomicLong();
                                break;
                            case "clickByLongAdder":
                                clickNumber.clickByLongAdder();
                                break;
                            case "clickByLongAccumulator":
                                clickNumber.clickByLongAccumulator();
                                break;
                        }
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        latch.await();
        long endTime = System.currentTimeMillis();
        switch (methodName) {
            case "clickBySynchronized":
                System.out.println("------costTime: " + (endTime - startTime) + " 毫秒\t" + methodName + ": " + clickNumber.number);
                break;
            case "clickByAtomicLong":
                System.out.println("------costTime: " + (endTime - startTime) + " 毫秒\t" + methodName + ": " + clickNumber.atomicLong.get());
                break;
            case "clickByLongAdder":
                System.out.println("------costTime: " + (endTime - startTime) + " 毫秒\t" + methodName + ": " + clickNumber.longAdder.sum());
                break;
            case "clickByLongAccumulator":
                System.out.println("------costTime: " + (endTime - startTime) + " 毫秒\t" + methodName + ": " + clickNumber.longAccumulator.get());
                break;
        }
    }
}
```




### ConcurrentHashMap

`ConcurrentHashMap`是一个线程安全的哈希表，它通过分段锁（Segment，Java 8及之前版本）或CAS加锁机制（Java 8引入了新的实现，使用Node数组+链表/红黑树）来实现高效并发访问。在Java 8之后，它还引入了CAS和偏向锁的概念，进一步减少了锁的使用，提高了并发性能。

1. **构造方法**
   - 多种构造方法，包括指定初始容量、加载因子、并发级别等。

2. **基本操作**
   - `put(K key, V value)`：将指定的键值对放入此映射中。
   - `get(Object key)`：返回指定键所映射的值，或null如果没有这样的映射。
   - `remove(Object key)`：如果存在，则删除该键的映射关系。
   - `clear()`：清除所有映射关系。
   - `containsKey(Object key)`：如果此映射包含指定键的映射，则返回true。
   - `size()`：返回此映射中的键值对数量。
   - `compute(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)`：如果键存在，则使用给定的函数计算新值；如果键不存在，则插入新值。

3. **并发特有方法**
   - `putIfAbsent(K key, V value)`：如果不存在则插入。
   - `replace(K key, V oldValue, V newValue)`：只有当键的当前映射值等于oldValue时才会替换。
   - `replace(K key, V value)`：无条件替换键的映射值。
   - `computeIfAbsent(K key, Function<? super K, ? extends V> mappingFunction)`：如果键不存在，则使用给定的函数计算新值并插入。
   - `computeIfPresent(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)`：如果键存在，则使用给定的函数计算新值并替换旧值，否则不执行任何操作。

**应用场景**：
- 高并发环境下的键值对存储，如缓存、计数器集合等。
- 需要高性能并发读写的场景。

```java
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentHashMapExample {
    public static void main(String[] args) {
        ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

        map.put("One", 1);
        map.put("Two", 2);

        // 并发安全地读取和更新
        Integer value = map.getOrDefault("Three", 0);
        map.computeIfAbsent("Three", k -> 3);

        System.out.println("Three的值: " + map.get("Three"));
    }
}
```


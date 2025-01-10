---

order: 20
title: Java NIO/AIO

---


## Non-blocking I/O

Java NIO (Non-blocking I/O) 是Java 1.4版本中引入的新I/O处理方式，它提供了一种不同于传统的Java IO流的机制来处理输入和输出操作。NIO的“非阻塞”意味着在等待I/O操作完成时，线程不会被阻塞，而是可以继续执行其他任务，从而提高了I/O操作的效率和并发性。

### NIO核心概念

Java NIO通过Buffer、Channel和Selector提供了高效、灵活的I/O处理方式。Buffer作为数据容器，Channel作为数据传输的途径，而Selector则实现了对多个Channel的事件监听和管理。

::: info NIO核心概念
#### Buffer（缓冲区）
在NIO中，数据是以缓冲区的形式处理的，数据总是从通道读取到缓冲区，或者从缓冲区写入到通道。缓冲区本质上是一个可以读写数据的数组。每个缓冲区都针对某种数据类型，比如 `ByteBuffer`、`CharBuffer` 等。

#### Channel（通道）
通道是数据的传输路径，它是双向的，可以从数据源读取数据或将数据写入目的地。NIO中的通道与流不同，流是单向的，而通道可以同时进行读写操作。

主要的Channel类型：
- `FileChannel`：用于文件的读写。
- `SocketChannel`：用于TCP套接字的读写。
- `ServerSocketChannel`：用于监听并接受新的TCP连接。
- `DatagramChannel`：用于UDP数据报的读写。
- `Pipe.SinkChannel` 和 `Pipe.SourceChannel`：用于管道通信。


#### Selector（选择器）
选择器是NIO中用于监控多个通道的I/O事件的组件。它允许多个Channel被一个单独的线程管理，从而实现了I/O多路复用，提高了I/O效率和并发能力。

SelectionKey: 是Selector和Channel之间的桥梁，表示一个Channel在Selector上的注册状态。它记录了Channel的注册信息和感兴趣的事件（如读、写、连接等）。

:::


NIO的设计是为了更好地处理高并发和大数据量的情况，而传统的IO流更适合简单的、低并发的数据处理场景。NIO通过Buffer和Channel的组合使用，提供了更高效的数据传输机制，同时通过Selector增强了对I/O操作的管理和控制。



### Buffers缓冲区

NIO中缓冲区（Buffers）实质上是一块可以读写的内存区域，用于存储和处理数据的核心组件。在Java中，有几种不同类型的缓冲区，分别对应不同的数据类型：

- `ByteBuffer`
- `CharBuffer`
- `ShortBuffer`
- `IntBuffer`
- `LongBuffer`
- `FloatBuffer`
- `DoubleBuffer`

每个缓冲区都有自己的特点和用途，但它们共享一组通用的方法和行为，能以一致的方式处理数据


::: info 缓冲区的主要方法
#### 创建缓冲区
- `allocate(int capacity)`：创建一个具有指定容量的缓冲区（Java堆内）。
- `ByteBuffer.allocateDirect(capacity)`: 创建直接缓冲区(位于JVM堆外的直接内存中), 这种方式创建的缓冲区在读写数据时可以减少一次内存拷贝。
- `wrap(byte[] array)` 或者其他类型如 `wrap(char[] array)`：将现有数组包装成一个缓冲区。

#### 数据操作
- `put(byte b)` 或者其他类型如 `put(char c)`：向缓冲区中放置一个数据项。
- `get()` 或者其他类型如 `get(char[] dst)`：从缓冲区中读取一个或多个数据项。

#### 控制状态
- `flip()`：将缓冲区从写模式切换到读模式。这通常是在向缓冲区写入数据之后调用，以便开始从中读取数据。
- `rewind()`：将缓冲区的位置设置回起始点，保留限制，以便再次读取或重写缓冲区中的数据。
- `clear()`：重置缓冲区，将位置和限制都设置为初始状态，以便接收新数据。
- `compact()`：将未读数据移动到缓冲区的起始位置，并将位置设置到未读数据的末尾。这通常用于清理缓冲区以便重新写入数据。

#### 访问和控制位置
- `position()`：获取当前的位置。
- `position(int newPosition)`: 显式地设置缓冲区的position属性，即下一个元素将被读取或写入的索引。 新的位置必须满足: `0 < newPosition < limit`
- `capacity()`：获取缓冲区的总容量。
- `limit()`：获取当前的限制。
    - 当缓冲区处于写模式时，limit属性的默认值通常是缓冲区的capacity（容量），表示可以向缓冲区写入最多capacity个元素
    - 当缓冲区从写模式切换到读模式时(通常通过调用`flip()`方法实现)，此时limit属性的值会变为之前的position值。即已写入的大小。
- `mark()`和`reset()`: 提供了一种在读取数据时保存并返回到特定位置的机制。这在需要多次读取同一段数据，或者在读取过程中需要检查点的情况下非常有用
    - 调用`reset()`方法会将`position`重置到上次调用`mark()`时的位置。
    - 如果在调用`reset()`之前没有调用过`mark()`，那么`reset()`会抛出`InvalidMarkException`异常。
    - `clear()`或`flip()`方法会清除任何先前的标记，如果在这之后调用`reset()`也会抛出异常。
    - `mark()`方法并不会改变`position`，只是保存了当前的`position`值供后续的`reset()`使用。
    - `mark()`方法可以多次调用，但是`reset()`只会返回到最近一次`mark()`的位置。
:::

缓冲区的操作模式：
- **Write mode**（写模式）：此时position在写入数据后递增，直到达到limit。
- **Read mode**（读模式）：此时position在读取数据后递增，直到达到limit。


下面是一个使用 `ByteBuffer` 的简单示例：

```java
import java.nio.ByteBuffer;

public class BufferExample {
    public static void main(String[] args) {
        // 创建一个ByteBuffer
        ByteBuffer buffer = ByteBuffer.allocate(1024);

        // 向缓冲区中写入数据 （写入一个字节，即8位）
        for (int i = 0; i < 1024; i++) {
            buffer.put((byte) i);
        }

        // 切换到读模式
        buffer.flip();

        // 读取数据 （每次读一个字节，即8位）
        while (buffer.hasRemaining()) {
            System.out.println(buffer.get());
        }

        // 清空缓冲区
        buffer.clear();
    }
}
```

这个示例展示了如何创建一个 `ByteBuffer`，向其中写入数据，切换到读模式，然后读取数据，最后清空缓冲区。这种模式适用于所有类型的缓冲区。

缓冲区在NIO中是非常重要的，因为它们提供了数据的临时存储，以及在数据源和目的地之间进行数据传输的能力。在多线程环境中，缓冲区的使用需要特别注意同步问题，因为它们本身不是线程安全的。





::: info Buffer（缓冲区）与流的区别
1. **面向流 vs 面向块**：传统的Java IO流是面向流的，数据被连续地读写，每次读写操作通常涉及一个字节或字符。而NIO的Buffer是面向块的，数据以块的形式读写，可以一次性处理大量数据。
2. **非阻塞 vs 阻塞**：在流中，读写操作通常是阻塞的，这意味着线程会在读写操作完成前被挂起。而在NIO中，线程可以继续执行其他任务，直到读写操作完成。
3. **数据结构**：流通常只处理一种类型的数据，如字节流或字符流。而缓冲区可以处理多种类型的数据，且==数据在缓冲区中以数组的形式存储==，这使得数据的访问更加高效。

由于NIO允许数据的批量处理，因此在大数据量的读写操作中，NIO通常比基于流的IO提供更好的性能。此外，NIO提供了更多的控制选项，如通过选择器管理多个通道的事件。
:::











### Channels通道

**通道的创建方式**：

1. **FileChannel**：用于读取、写入和操作文件内容的通道。

```java
// 从 FileInputStream 或 FileOutputStream 获取 FileChannel
FileInputStream fis = new FileInputStream("example.txt");
FileChannel fileChannel = fis.getChannel();

// 通过 RandomAccessFile
RandomAccessFile raf = new RandomAccessFile("path/to/file", "rw");
FileChannel channel = raf.getChannel();

// 使用NIO.2的`Files.newByteChannel()`
Path path = Paths.get("path/to/file");
FileChannel channel = Files.newByteChannel(path, StandardOpenOption.READ, StandardOpenOption.WRITE);

// 使用`FileChannel.open()`
Path path = Paths.get("path/to/file");
try (FileChannel channel = FileChannel.open(path, StandardOpenOption.READ, StandardOpenOption.WRITE)) {
    // 使用channel进行读写操作
} catch (IOException e) {
    e.printStackTrace();
}
```
`FileChannel.open()`方法提供了一种更加现代化和灵活的创建`FileChannel`的方式，它使你能够更精细地控制文件的打开方式，同时利用了NIO.2的增强功能。这种方式通常被认为是最现代和推荐的做法，因为它提供了更好的资源管理和异常处理。

2. **SocketChannel**：用于连接TCP网络套接字的通道。

```java
// 打开 SocketChannel 并连接到服务器
SocketChannel socketChannel = SocketChannel.open(new InetSocketAddress("localhost", 8080));
```

3. **ServerSocketChannel**：允许监听传入TCP连接的通道。

```java
// 打开 ServerSocketChannel 并绑定到端口
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
serverSocketChannel.bind(new InetSocketAddress(8080));
```

4. **DatagramChannel**：用于连接UDP网络套接字的通道。

```java
// 打开 DatagramChannel 并绑定到端口或连接到地址
DatagramChannel datagramChannel = DatagramChannel.open();
datagramChannel.bind(new InetSocketAddress(9999));
```

**通道的常用方法**：

- **read**：从通道中读取数据到Buffer中。
- **write**：将Buffer中的数据写入到通道中。
- **close**：关闭通道，释放相关资源。
- **connect**（适用于SocketChannel）：连接到远程地址。
- **bind**（适用于ServerSocketChannel和DatagramChannel）：绑定到本地地址。
- **accept**（适用于ServerSocketChannel）：等待并接受传入连接。


通道的使用示例：

::: code-tabs#shell

@tab:active FileChannel

```java
import java.io.*;
import java.nio.*;
import java.nio.channels.*;

public class FileChannelExample {
    public static void main(String[] args) throws IOException {
        // 创建 FileChannel
        RandomAccessFile file = new RandomAccessFile("example.txt", "rw");
        FileChannel fileChannel = file.getChannel();

        // 创建 Buffer 并写入数据
        ByteBuffer buffer = ByteBuffer.allocate(48);
        String newData = "Example content";
        buffer.clear();
        buffer.put(newData.getBytes());

        buffer.flip();
        while (buffer.hasRemaining()) {
            fileChannel.write(buffer);
        }

        // 从 FileChannel 读取数据
        buffer.clear();
        fileChannel.read(buffer);

        buffer.flip();
        while (buffer.hasRemaining()) {
            System.out.print((char) buffer.get());
        }

        // 关闭 FileChannel
        fileChannel.close();
    }
}
```

@tab SocketChannel 

```java
import java.io.*;
import java.net.*;
import java.nio.*;
import java.nio.channels.*;

public class SocketChannelExample {
    public static void main(String[] args) throws IOException {
        // 打开 SocketChannel
        SocketChannel socketChannel = SocketChannel.open();
        socketChannel.connect(new InetSocketAddress("localhost", 8080));

        // 创建 Buffer 并写入数据
        String message = "Hello, Server!";
        ByteBuffer buffer = ByteBuffer.wrap(message.getBytes());
        socketChannel.write(buffer);

        // 从 SocketChannel 读取数据
        buffer.clear();
        int bytesRead = socketChannel.read(buffer);
        System.out.println("Received: " + new String(buffer.array(), 0, bytesRead));

        // 关闭 SocketChannel
        socketChannel.close();
    }
}
```

@tab ServerSocketChannel 

```java
import java.io.*;
import java.net.*;
import java.nio.*;
import java.nio.channels.*;

public class ServerSocketChannelExample {
    public static void main(String[] args) throws IOException {
        // 打开 ServerSocketChannel 并绑定端口
        ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
        serverSocketChannel.bind(new InetSocketAddress(8080));

        // 接受传入连接
        SocketChannel socketChannel = serverSocketChannel.accept();

        // 创建 Buffer 并从 SocketChannel 读取数据
        ByteBuffer buffer = ByteBuffer.allocate(48);
        int bytesRead = socketChannel.read(buffer);
        System.out.println("Received: " + new String(buffer.array(), 0, bytesRead));

        // 创建 Buffer 并写入数据
        buffer.clear();
        String message = "Hello, Client!";
        buffer = ByteBuffer.wrap(message.getBytes());
        socketChannel.write(buffer);

        // 关闭两个通道
        socketChannel.close();
        serverSocketChannel.close();
    }
}
```

@tab DatagramChannel 

```java
import java.io.*;
import java.net.*;
import java.nio.*;
import java.nio.channels.*;

public class DatagramChannelExample {
    public static void main(String[] args) throws IOException {
        // 打开 DatagramChannel 并绑定到端口
        DatagramChannel datagramChannel = DatagramChannel.open();
        datagramChannel.bind(new InetSocketAddress(9999));

        // 创建 Buffer 并从 DatagramChannel 读取数据
        ByteBuffer buffer = ByteBuffer.allocate(48);
        SocketAddress address = datagramChannel.receive(buffer);
        buffer.flip();
        System.out.println("Received: " + new String(buffer.array(), 0, buffer.limit()));

        // 创建 Buffer 并写入数据
        buffer.clear();
        String message = "Hello, Datagram!";
        buffer.put(message.getBytes());
        buffer.flip();
        datagramChannel.send(buffer, address);

        // 关闭 DatagramChannel
        datagramChannel.close();
    }
}
```
:::



**`transferTo(long position, long count, WritableByteChannel target)`** 和 
**`transferFrom(ReadableByteChannel src, long position, long count)`** 方法提供了高级的读写操作，它们允许数据在通道之间直接传输，而不需要通过中间的`ByteBuffer`。

  - **`transferTo()`** 方法将数据从当前通道传输到目标`WritableByteChannel`，这可以是一个文件通道或另一个套接字通道。它使用`position`和`count`参数来指定要传输数据的起始位置和长度。
  
  - **`transferFrom()`** 方法则是相反的过程，它将数据从源`ReadableByteChannel`读取到当前通道。同样，`position`和`count`参数用于控制传输的范围。
  
这两个方法通常用于大型数据传输，因为它们避免了数据在用户空间和内核空间之间的复制，从而提高了性能。


`transferTo()`和`transferFrom()`方法在实际应用中最常见的场景之一是将数据直接从网络通道传输到文件系统，或反之亦然，这样可以避免数据在用户空间和内核空间之间的多次复制，从而提高性能。下面的代码展示了如何使用`transferTo()`将网络数据直接写入到文件，以及如何使用`transferFrom()`从文件读取数据直接发送到网络。


假设你正在运行一个HTTP服务器，需要将客户端上传的大文件直接保存到磁盘上，而不是先将文件内容加载到内存中再保存。在这种情况下，`transferTo()`方法非常有用。

```java
import java.io.*;
import java.net.*;
import java.nio.channels.*;
import java.nio.file.*;

// 使用`transferTo()`将网络数据写入文件
public class NetworkToFileExample {
    public static void main(String[] args) throws IOException {
        // 打开ServerSocketChannel并监听端口
        ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
        serverSocketChannel.bind(new InetSocketAddress(8080));

        // 接受客户端连接
        SocketChannel clientSocketChannel = serverSocketChannel.accept();

        // 创建FileChannel用于写入文件
        Path filePath = Paths.get("upload.txt");
        FileChannel fileChannel = FileChannel.open(filePath, StandardOpenOption.WRITE, StandardOpenOption.CREATE);

        // 从网络通道直接将数据传输到文件通道
        long transferred = clientSocketChannel.transferTo(0, Long.MAX_VALUE, fileChannel);
        System.out.println("Transferred bytes: " + transferred);

        // 关闭通道
        clientSocketChannel.close();
        fileChannel.close();
        serverSocketChannel.close();
    }
}
```

相反地，如果你有一个HTTP服务器，需要将存储在文件系统上的大文件直接发送到客户端，而不希望先将整个文件加载到内存中，那么`transferFrom()`方法可以提供帮助。

```java
import java.io.*;
import java.net.*;
import java.nio.channels.*;
import java.nio.file.*;

// 使用`transferFrom()`从文件读取数据发送到网络
public class FileToNetworkExample {
    public static void main(String[] args) throws IOException {
        // 打开ServerSocketChannel并监听端口
        ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
        serverSocketChannel.bind(new InetSocketAddress(8080));

        // 接受客户端连接
        SocketChannel clientSocketChannel = serverSocketChannel.accept();

        // 创建FileChannel用于读取文件
        Path filePath = Paths.get("download.txt");
        FileChannel fileChannel = FileChannel.open(filePath, StandardOpenOption.READ);

        // 从文件通道直接将数据传输到网络通道
        long transferred = clientSocketChannel.transferFrom(fileChannel, 0, fileChannel.size());
        System.out.println("Transferred bytes: " + transferred);

        // 关闭通道
        clientSocketChannel.close();
        fileChannel.close();
        serverSocketChannel.close();
    }
}
```

在这两个示例中，`transferTo()`和`transferFrom()`方法都用于在两个不同的通道之间高效地传输数据，避免了数据的中间缓存，从而减少了CPU的复制操作和内存使用，提高了I/O效率。这是在处理大量数据或高性能网络应用时非常有用的技巧。






### Selectors选择器

**多路复用**：`Selector`可以看作是一种多路复用机制，允许一个线程处理多个通道的I/O操作，这对于构建高并发的服务器至关重要。

基本概念
- **Selector**：负责监听多个注册通道的I/O事件。
- **SelectionKey**：当一个通道注册到Selector时，会返回一个`SelectionKey`，这个`SelectionKey`包含了通道、事件兴趣集合、附加对象以及一个指向Selector的引用。
- **SelectableChannel**：任何可以注册到Selector的通道都是`SelectableChannel`的子类，如`SocketChannel`、`ServerSocketChannel`、`DatagramChannel`等。



**Selector的创建和使用**：
1. **创建Selector**：
   ```java
   Selector selector = Selector.open();
   ```

2. **注册Channel**：
   ```java
   SocketChannel channel = ...;
   channel.configureBlocking(false);
   SelectionKey key = channel.register(selector, SelectionKey.OP_READ);
   ```
   这里，`SelectionKey.OP_READ`表示我们对读事件感兴趣。`SelectionKey`对象是注册操作的结果，可以用来取消注册、查询兴趣集合或获取附加对象。

   Selector的事件类型：
    - `OP_READ`：表示通道有数据可读。
    - `OP_WRITE`：表示可以向通道写数据。
    - `OP_CONNECT`：表示可以完成连接。
    - `OP_ACCEPT`：表示可以接受新的连接。

   **非阻塞模式**：只有在非阻塞模式下的通道才能注册到`Selector`，因此在注册前需要确保通道处于非阻塞模式。判断一个通道是否可以注册到`Selector`上，主要看该通道是否实现了`SelectableChannel`接口。常见的通道中只有 ==`FileChannel`不支持非阻塞模式==。

3. **选择就绪操作**：
   ```java
   int readyChannels = selector.select();
   ```
   这个方法会阻塞直到至少有一个通道准备好进行所注册的I/O操作，或者在超时时间内没有通道准备就绪。`select()`方法返回准备就绪的通道数量。

   在实际应用中，通常在一个无限循环中调用`select()`方法，以便持续检测通道事件。

4. **遍历选择键**：
   ```java
   Set<SelectionKey> selectedKeys = selector.selectedKeys();
   Iterator<SelectionKey> iterator = selectedKeys.iterator();
   while (iterator.hasNext()) {
       SelectionKey key = iterator.next();
       if (key.isReadable()) {
           // 处理读事件
       } else if (key.isWritable()) {
           // 处理写事件
       }
       iterator.remove();
   }
   ```
   遍历选择键集，并检查每个键的兴趣集合来确定哪些事件已经发生。在处理完一个键后，将其从选择键集中移除，这是因为`Selector`会在下次调用`select()`时重新计算就绪通道。

::: info Selector常用方法
#### 1. `open()`
- **方法签名**：`public static Selector open() throws IOException`
- **描述**：此静态方法用于创建一个新的`Selector`实例。它会抛出`IOException`，如果无法创建`Selector`。
  ```java
  Selector selector = Selector.open();
  ```

#### 2. `select()`
- **方法签名**：`public int select() throws IOException`
- **描述**：此方法用于等待至少一个通道变得就绪，或者在指定的时间内没有通道就绪。如果至少有一个通道变得就绪，该方法返回就绪通道的数量。如果没有通道就绪，该方法会一直阻塞，直到至少有一个通道变得就绪或被中断。
  ```java
  int readyChannels = selector.select();
  ```

#### 3. `selectedKeys()`
- **方法签名**：`public Set<SelectionKey> selectedKeys()`
- **描述**：此方法返回一个包含所有已就绪的`SelectionKey`的集合。当调用`select()`方法之后，可以使用这个方法来获取所有就绪的`SelectionKey`对象。注意，每次调用`select()`之后，`selectedKeys()`返回的集合都会被清空。
  ```java
  Set<SelectionKey> selectedKeys = selector.selectedKeys();
  ```

#### 4. `wakeup()`
- **方法签名**：`public void wakeup()`
- **描述**：此方法用于唤醒阻塞在`select()`方法上的线程。如果`select()`方法正在等待就绪事件，调用`wakeup()`会立即结束等待。
  ```java
  selector.wakeup();
  ```

#### 5. `register()`
- **方法签名**：`public SelectionKey register(SelectableChannel ch, int ops)`
- **方法签名**：`public SelectionKey register(SelectableChannel ch, int ops, Object att)`
- **描述**：此方法用于将一个`SelectableChannel`注册到`Selector`上，并指定感兴趣的事件类型。如果提供了附加对象`att`，则该对象将附加到生成的`SelectionKey`上。
  ```java
  // 注册`SelectableChannel`到`Selector`上，并附加自定义对象
  SelectionKey key = channel.register(selector, SelectionKey.OP_READ, customData);

  // ... 通过 SelectionKey 对象的 attachment() 方法获取附加的对象
  CustomData customData = (CustomData) key.attachment();
  ```

#### 6. `interestOps()`
- `public int interestOps()` : 用于获取当前`SelectionKey`感兴趣的事件类型。
- `public SelectionKey interestOps(int ops)` : 用于更新`SelectionKey`感兴趣的事件类型。
  ```java
  int ops = key.interestOps();

  key.interestOps(SelectionKey.OP_WRITE);
  ```

#### 7. `readyOps()`
- **方法签名**：`public int readyOps()`
- **描述**：此方法返回`SelectionKey`当前就绪的事件类型。这些事件是在最近一次调用`select()`方法时被确定的。
  ```java
  int ops = key.readyOps();
  ```

#### 8. `cancel()`
- **方法签名**：`public void cancel()`
- **描述**：此方法用于取消一个`SelectionKey`，使其从`Selector`中注销。取消`SelectionKey`后，它将不再被`Selector`监控，也不会再出现在`selectedKeys()`返回的集合中。
  ```java
  key.cancel();
  ```
:::


### NIO应用示例

服务端代码示例
```java
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MultiThreadedWebServer {
    private static final int PORT = 8000;
    private static final int BUFFER_SIZE = 1024;
    private static final int THREAD_POOL_SIZE = 10; // 线程池大小

    public static void main(String[] args) {
        try {
            ServerSocketChannel ssc = ServerSocketChannel.open();
            ssc.socket().bind(new InetSocketAddress("127.0.0.1", PORT));
            ssc.configureBlocking(false);

            Selector selector = Selector.open();

            // 注册 channel，并且指定感兴趣的事件是 Accept
            ssc.register(selector, SelectionKey.OP_ACCEPT);

            ByteBuffer readBuff = ByteBuffer.allocate(BUFFER_SIZE);
            ByteBuffer writeBuff = ByteBuffer.allocate(128);
            writeBuff.put("received".getBytes());
            writeBuff.flip();

            // 创建线程池
            ExecutorService executor = Executors.newFixedThreadPool(THREAD_POOL_SIZE);

            while (true) {
                int nReady = selector.select();
                Set<SelectionKey> keys = selector.selectedKeys();
                Iterator<SelectionKey> it = keys.iterator();

                while (it.hasNext()) {
                    SelectionKey key = it.next();
                    it.remove();

                    if (key.isAcceptable()) {
                        // 创建新的连接，并且把连接注册到selector上，而且，
                        // 声明这个channel只对读操作感兴趣。
                        SocketChannel socketChannel = ssc.accept();
                        socketChannel.configureBlocking(false);
                        socketChannel.register(selector, SelectionKey.OP_READ);
                    }
                    else if (key.isReadable()) {
                        // 将读操作委托给线程池中的一个线程
                        executor.submit(() -> readData(key, readBuff));
                    }
                    else if (key.isWritable()) {
                        // 将写操作委托给线程池中的一个线程
                        executor.submit(() -> writeData(key, writeBuff));
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void readData(SelectionKey key, ByteBuffer readBuff) throws IOException {
        SocketChannel socketChannel = (SocketChannel) key.channel();

        // 检查客户端是否已经断开连接
        if (!socketChannel.isOpen()) {
            // 如果通道已关闭，从Selector中取消注册，并关闭通道
            key.cancel();
            socketChannel.close();
            return;
        }

        readBuff.clear();
        socketChannel.read(readBuff);

        readBuff.flip();
        System.out.println("received : " + new String(readBuff.array()));
        key.interestOps(SelectionKey.OP_WRITE);
    }

    private static void writeData(SelectionKey key, ByteBuffer writeBuff) throws IOException {
        writeBuff.rewind();
        SocketChannel socketChannel = (SocketChannel) key.channel();
        socketChannel.write(writeBuff);
        key.interestOps(SelectionKey.OP_READ);
    }
}
```
- **每次调用`select()`方法**，`selectedKeys`集合会包含所有准备好的通道的`SelectionKey`对象。
- **必须在处理完所有`SelectionKey`对象后**，使用`Iterator`的`remove()`方法从`selectedKeys`集合中移除每个`SelectionKey`，否则下一次调用`select()`时可能会重复处理相同的键。


客户端代码示例
```java
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;

public class WebClient {
    public static void main(String[] args) {
        try {
            SocketChannel socketChannel = SocketChannel.open();
            socketChannel.connect(new InetSocketAddress("127.0.0.1", 8000));
            socketChannel.configureBlocking(true);

            ByteBuffer sendBuffer = ByteBuffer.allocate(1024);
            sendBuffer.put("Hello, server!".getBytes());
            sendBuffer.flip();

            int sent = socketChannel.write(sendBuffer);
            System.out.println("Sent " + sent + " bytes to server.");

            ByteBuffer receiveBuffer = ByteBuffer.allocate(1024);

            int received = socketChannel.read(receiveBuffer);
            receiveBuffer.flip();
            System.out.println("Received " + received + " bytes from server: " + new String(receiveBuffer.array()));

            socketChannel.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```





## I/O多路复用原理

==I/O多路复用是操作系统提供的能力，它允许一个进程/线程监听多个文件描述符的状态变化，而不需要为每个文件描述符创建一个单独的线程==。常见的I/O多路复用机制有：

- **select/poll/epoll**：在Unix/Linux系统中提供的原生函数，它们可以让一个进程等待一组文件描述符中的任何一个变为可读或可写状态。
- **kqueue**：在BSD系统中使用的I/O多路复用机制。
- **IOCP**：Windows系统中的异步I/O完成端口。



### Selector与多线程

在传统的阻塞I/O（BIO）模型中，每一个客户端连接通常需要一个独立的线程来处理，这在并发连接数较少时问题不大，但当并发连接数激增时，创建大量的线程会消耗大量的系统资源（如内存），并且频繁的线程切换会导致CPU时间片的浪费，降低了系统整体的吞吐量和响应时间。

::: info Selector与多线程
#### Selector与多线程的区别

- **多线程**：
  - 每个连接都有一个独立的线程来处理。
  - 高并发情况下，线程切换开销大，资源消耗高。
  - 适合于计算密集型任务，因为每个线程可以独立执行计算任务。

- **Selector**：
  - 单个线程可以处理多个连接。
  - 适用于I/O密集型任务，因为可以有效地等待I/O完成。
  - 减少了线程上下文切换带来的开销，降低了系统的资源消耗。

#### 适用场景与不适用场景

适用场景

- **网络服务器**：如Web服务器、聊天服务器等，需要处理大量的客户端连接。
- **高性能I/O密集型应用**：当应用程序主要受限于I/O而不是CPU时。
- **实时通信应用**：如在线游戏服务器、实时消息系统等。

不适用场景

- **计算密集型应用**：如果应用的主要瓶颈在于计算而非I/O，则多线程或多进程可能更合适。
- **固定数量的连接**：对于只有少量连接的应用，使用简单的阻塞I/O模型可能就已经足够高效。
:::


I/O多路复用机制通过以下方式解决了这些问题：

1. **资源节约**：在多路复用机制下，多个客户端连接可以共享同一个线程，大大减少了线程创建和切换的开销，节省了系统资源。

2. **非阻塞性**：在NIO中，线程不会因为等待I/O操作而被阻塞，而是可以继续执行其他任务，直到I/O操作完成。这提高了线程的利用率和系统的并发处理能力。

3. **事件驱动**：多路复用机制是基于事件驱动的，当有I/O事件（如数据可读或可写）发生时，`Selector`会通知相应的`SelectionKey`，进而唤醒正在监听的线程去处理这些事件。这样，线程就可以在有事件发生时才被唤醒，避免了空转。

4. **高效处理大量连接**：由于线程可以同时监听多个连接，因此即使在处理成千上万的并发连接时，也不必为每个连接分配一个独立的线程，从而可以更高效地处理大量连接。



### open和select方法

**1. open()**

`Selector.open()`方法创建一个新的`Selector`实例。

```java
public static Selector open() throws IOException {
    return SelectorProvider.provider().openSelector();
}
```
`Selector`的实现依赖于`sun.nio.ch.SelectorProvider`，这是一个内部使用的类，它提供了创建和管理`Selector`的方法。

`SelectorProvider`根据运行的平台选择合适的底层I/O多路复用机制（如`select`、`poll`或`epoll`）。即自动选择最适合当前平台的`SelectorProvider`实现:
- 在Linux上，通常使用`EpollSelectorProvider`; 
- macOS中可能会选择`KQueueSelectorProvider`; 
- 在Windows上则是`IOCPSelectorProvider`。

如果操作系统不支持更高效的机制，则可能使用`PollSelectorProvider`或`SelectSelectorProvider`。

**2. select()**

`Selector.select()`方法用于等待至少一个通道变得就绪。源码如下：

```java
public int select() throws IOException {
    return impl.select(0L);
}

public int select(long timeout, TimeUnit unit) throws IOException {
    return impl.select(unit.toMillis(timeout));
}

private native int implSelect(long timeout) throws IOException;
```

这里的`select()`方法实际上调用了`impl.select()`方法，其中`impl`是`AbstractSelector`的一个实例，它实现了`SelectorImpl`接口。`impl.select()`方法进一步调用了`implSelect()`，这是一个本地方法（`native`方法），它将调用操作系统提供的I/O多路复用函数（如`select`、`poll`或`eppoll_wait`）。





### select/poll/epoll

`select`、`poll` 和 `epoll` 是 Unix/Linux 系统中用于实现 I/O 多路复用的三种原生机制。

- **select**：最早的 I/O 多路复用机制，简单但受限于文件描述符数量。
- **poll**：解决了 `select` 的文件描述符数量限制问题，但仍需遍历整个列表。
- **epoll**：使用事件驱动的方式，只关注发生了变化的文件描述符。但仅限于 Linux 系统。

::: info select/poll/epoll
#### 1. select

`select` 是最早的 I/O 多路复用机制之一，它允许一个进程等待多个文件描述符中的任一描述符变为可读或可写状态。
```bash
int select(int nfds, fd_set *readfds, fd_set *writefds, 
           fd_set *exceptfds, struct timeval *timeout)
```
- **nfds**：文件描述符的最大值加一。
- **readfds/writefds/exceptfds**：文件描述符集，分别用于指示需要监控读、写和异常事件的文件描述符。
- **timeout**：超时时间。

实现:
- **文件描述符集**：`select` 使用 `fd_set` 结构体来表示文件描述符集，其中每个位对应一个文件描述符。
- **等待**：`select` 遍历每个文件描述符集中的文件描述符，并检查它们的状态。
- **超时**：如果没有任何文件描述符变为可读或可写状态，`select` 将阻塞直到超时时间到达或有文件描述符变为可读或可写状态。

优缺点:
- **优点**：简单易用, 广泛支持多种操作系统。
- **缺点**：
  - 文件描述符数量受限于 `FD_SETSIZE`（通常为 1024）。
  - 每次调用时需要复制文件描述符集，效率较低。
  - 只能检查有限的事件类型（读、写、异常）。

#### 2. poll

`poll` 是 `select` 的改进版本，它解决了文件描述符数量限制的问题。
```bash
int poll(struct pollfd *fds, nfds_t nfds, int timeout)
```
- **fds**：`struct pollfd` 结构体数组，每个元素包含一个文件描述符和感兴趣的事件类型。
- **nfds**：文件描述符的数量。
- **timeout**：超时时间。

实现
- **文件描述符结构**：使用 `struct pollfd` 来表示每个文件描述符及其感兴趣的事件类型。
- **等待**：`poll` 为每个文件描述符维护一个列表，检查每个文件描述符的状态。
- **超时**：如果没有任何文件描述符变为可读或可写状态，`poll` 将阻塞直到超时时间到达或有文件描述符变为可读或可写状态。

优缺点
- **优点**：
  - 文件描述符数量不受限制。
  - 不需要复制文件描述符集。
- **缺点**：
  - 每次调用都需要遍历整个文件描述符列表，效率仍然较低。
  - 仍然只支持有限的事件类型。

#### 3. epoll

`epoll` 是 Linux 2.6 及更高版本中引入的一种高效的 I/O 多路复用机制，它使用事件驱动的方式来处理文件描述符的变化。
```bash
int epoll_create(int size)  # 创建

# 添加/修改/删除
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event) 

# 等待
int epoll_wait(int epfd, struct epoll_event *events, int maxevents, int timeout)
```
- **epfd**：`epoll` 文件描述符。
- **op**：操作类型 (`EPOLL_CTL_ADD`、`EPOLL_CTL_MOD`、`EPOLL_CTL_DEL`)。
- **fd**：文件描述符。
- **event**：包含文件描述符和感兴趣的事件类型。
- **maxevents**：返回的事件的最大数量。
- **timeout**：超时时间。

实现
- **创建**：使用 `epoll_create` 创建一个 `epoll` 文件描述符。
- **添加/修改/删除**：使用 `epoll_ctl` 添加、修改或删除监控的文件描述符。
- **等待**：`epoll_wait` 等待文件描述符发生变化，并返回就绪的事件列表。
- **事件驱动**：`epoll` 使用事件驱动的方式，只关注发生了变化的文件描述符，而不是像 `select` 和 `poll` 那样需要遍历整个文件描述符列表。

优缺点
- **优点**：
  - 高效：只需要关注发生了变化的文件描述符。
  - 文件描述符数量不受限制。
  - 支持多种事件类型。
- **缺点**：
  - 仅在 Linux 系统可用。
  - 相对复杂，需要更多的代码来管理。
:::





## 高级特性与原理

堆内内存与堆外内存介绍：
- **堆内内存**：由JVM管理，用于存放Java对象，受JVM的垃圾回收机制控制。
- **堆外内存**：位于JVM管理之外，不受JVM直接控制，适用于大型数据集或高性能I/O操作，如网络和文件系统操作。


### DirectByteBuffer

堆外的`ByteBuffer`使得数据可以绕过JVM堆内存，直接在操作系统和应用程序之间交换，减少内存拷贝，特别适用于大文件或网络数据的高效处理。

- `ByteBuffer.allocateDirect(int capacity)`: 分配直接缓冲区，减少数据复制，提高性能。
    调用`ByteBuffer.allocateDirect()`时，该方法内部会创建一个`DirectByteBuffer`的对象并返回
- `DirectByteBuffer`是在`java.nio`包内部使用的类，需要使用`java.nio.ByteBuffer`类来创建直接缓冲区（direct buffer）

```java
// 创建普通的堆内 Buffer
ByteBuffer buffer = ByteBuffer.allocate(1024);
IntBuffer intBuffer = IntBuffer.allocate(1024);

// 创建堆外的IntBuffer
ByteBuffer byteBuffer = ByteBuffer.allocateDirect(4 * 1024); // 每个int占4字节
IntBuffer intBuffer2 = byteBuffer.asIntBuffer();
```

创建堆外的IntBuffer 需要先创建一个ByteBuffer，然后通过`asIntBuffer()`方法将其转换为IntBuffer。

::: details DirectByteBuffer部分源码分析
```java
class DirectByteBuffer extends MappedByteBuffer implements DirectBuffer permits DirectByteBufferR{

    // Cached unaligned-access capability
    protected static final boolean UNALIGNED = Bits.unaligned();

    // Base address, used in all indexing calculations
    // NOTE: moved up to Buffer.java for speed in JNI GetDirectBufferAddress
    //    protected long address;

    private final Object att;

    public Object attachment() {
        return att;
    }

    /**
     * 这段代码使用了Java 14中引入的记录类（Records），
     * 这是一种特殊的类，主要用于封装一组不可变的数据字段。
     * 记录类提供了一种简洁的方式来定义不可变对象，
     * 而不需要显式地编写构造函数、getter方法、equals()、hashCode()和toString()等方法。
     * 
     * record关键字定义了一个记录类Deallocator，
     * 它具有三个私有最终字段：address、size和capacity。
     * 这三个字段都是在实例化Deallocator时必须提供的参数，
     * 它们分别代表堆外内存的起始地址、分配的总大小和实际的容量。
     * 
     * 记录类Deallocator的作用是封装了堆外内存的释放逻辑。
     * 当DirectByteBuffer对象不再被引用时，
     * 其关联的Cleaner对象会异步地调用Deallocator的run()方法，从而释放堆外内存。
    */
    private record Deallocator(long address, long size, int capacity) implements Runnable {
        private Deallocator {
            // 确保address字段的值不是0。在Java中，0常被用作指针或地址的“无效”或“空”值
            assert address != 0;
        }

        /**
         * Deallocator实现了Runnable接口，这意味着它可以被用作线程的执行体，
         * 即可以被传递给Thread或ExecutorService等并发工具，以异步的方式执行其run()方法。
         * 
        */
        public void run() {
            UNSAFE.freeMemory(address);  // 释放堆外内存
            Bits.unreserveMemory(size, capacity);  // 解除预留
        }
    }

    private final Cleaner cleaner;
    public Cleaner cleaner() { return cleaner; }


    // Primary constructor
    //
    DirectByteBuffer(int cap) {                   // package-private

        super(-1, 0, cap, cap, null);
        boolean pa = VM.isDirectMemoryPageAligned();
        int ps = Bits.pageSize();
        long size = Math.max(1L, (long)cap + (pa ? ps : 0));
        Bits.reserveMemory(size, cap);

        long base = 0;
        try {
            base = UNSAFE.allocateMemory(size);
        } catch (OutOfMemoryError x) {
            Bits.unreserveMemory(size, cap);
            throw x;
        }
        UNSAFE.setMemory(base, size, (byte) 0);
        if (pa && (base % ps != 0)) {
            // Round up to page boundary
            address = base + ps - (base & (ps - 1));
        } else {
            address = base;
        }
        try {
            cleaner = Cleaner.create(this, new Deallocator(base, size, cap));
        } catch (Throwable t) {
            // Prevent leak if the Deallocator or Cleaner fail for any reason
            UNSAFE.freeMemory(base);
            Bits.unreserveMemory(size, cap);
            throw t;
        }
        att = null;

    }
    // ....
}
```
:::


::: info 堆外内存的分配及自动释放原理

#### 堆外内存的分配原理
- `DirectByteBuffer`通过调用`Unsafe.allocateMemory(size)`方法来分配堆外内存，该方法使用C语言的`malloc`函数在系统本地内存中分配空间。
- 分配的内存地址存储在`Buffer`类的`address`属性中，这个地址用于后续的JNI调用，以直接访问和操作堆外内存。
- 内存分配时，`Bits.reserveMemory(size, cap)`用于预留足够的内存，确保分配成功，同时更新全局内存跟踪信息。

#### 堆外内存的自动释放原理
在Java 9之前，堆外内存的释放主要依赖于垃圾回收器清理掉指向DirectByteBuffer的所有强引用之后，通过JNI的回调机制调用Deallocator来释放内存。然而，这个过程是非即时的，而且开发者很难控制具体的释放时机。

从Java 9开始，DirectByteBuffer使用了==Cleaner机制==来管理堆外内存的释放。

- `Cleaner` 是 `sun.misc.Cleaner`类的一个实例，它允许在DirectByteBuffer对象变得不可达时，执行一个清理动作: 
    即当DirectByteBuffer对象不再被引用时，它的Cleaner实例会被激活，调用`clean()`方法来释放堆外内存（在Cleaner对象的`clean()`方法中，会调用Deallocator类的`run()`方法）。这个过程是异步的，并且在JVM的内部进行，不需要开发者显式调用。

- `Cleaner`机制确保了即使在GC过程中，堆外内存的释放也不会干扰到GC的正常运行。

总之，堆外内存的释放主要依赖于JVM内部的`Cleaner`机制，通过确保DirectByteBuffer对象不再被引用，可以促进堆外内存的回收。
:::

通过JNI和`Unsafe`接口，`DirectByteBuffer`能够直接访问和操作堆外内存，同时借助`PhantomReference`和`Cleaner`机制实现了堆外内存的自动回收。然而，使用堆外内存需要谨慎管理，以防止内存泄漏和其他资源管理问题。

::: info 手动释放堆外内存
如果希望更细粒度地控制堆外内存的释放，或者在某些情况下需要立即释放内存，可以尝试以下方法：

1. **设置DirectByteBuffer引用为null**：确保没有对DirectByteBuffer的引用，这将使DirectByteBuffer对象变得不可达，从而触发`Cleaner`的清理操作。这是最常用的方法，但请注意，这并不保证堆外内存立即被释放，只是开启了释放的流程。还可以使用`System.gc()`，但是请注意：尽管`System.gc()`可以尝试触发垃圾回收，但它的效果并不确定，因为JVM可能忽略显式GC请求，特别是在现代JVM版本中，显式GC可能被禁用或效果有限。
```java
public class DirectByteBufferExample {
    public static void main(String[] args) throws InterruptedException {
        // Allocate 1MB of off-heap memory
        ByteBuffer buffer = ByteBuffer.allocateDirect(1024 * 1024); 

        // Use the buffer...
        
        // When you're done using the buffer, set the reference to null
        // This makes the DirectByteBuffer eligible for garbage collection
        buffer = null;

        // Optionally, you can force garbage collection to happen sooner
        // But be aware that calling System.gc() is not recommended and may not work as expected
        System.gc();

        // Wait for some time to allow the cleaner to do its job
        Thread.sleep(1000);
    }
}
```

2. **使用ReferenceQueue**：在某些情况下，你可能想要在DirectByteBuffer被垃圾回收时得到通知，可以使用`ReferenceQueue`和`PhantomReference`来监控DirectByteBuffer的垃圾回收事件，并在适当的时机调用`Cleaner`。

3. **手动调用Cleaner**：在Java 9及以上版本中，可以通过`Cleaner`的`clean()`方法强制释放DirectByteBuffer的堆外内存。但这通常不推荐，因为这可能与JVM的内存管理策略冲突。
```java
import java.nio.ByteBuffer;
import sun.misc.Cleaner;

public class CleanerDemo {
    public static void main(String[] args) {
        // 创建一个直接缓冲区
        ByteBuffer directBuffer = ByteBuffer.allocateDirect(1024);

        // 获取与这个ByteBuffer关联的Cleaner
        Cleaner cleaner = ((DirectBuffer) directBuffer).cleaner();

        // 手动调用Cleaner的clean()方法
        cleaner.clean();
    }
}
```

4. **使用try-with-resources语句**：如果你的代码使用了`AutoCloseable`接口（如`FileChannel`），可以使用try-with-resources语句确保资源被正确关闭，这可能间接帮助释放关联的堆外内存。
:::



直接内存回收流程总结：

1. **业务代码将`DirectByteBuffer`置为`null`**：这一步骤表示业务代码不再需要使用`DirectByteBuffer`，并且它不再持有任何对该对象的强引用。这使得`DirectByteBuffer`对象成为垃圾回收的候选对象。

2. **JVM垃圾回收器检测到`DirectByteBuffer`对象不可达**：当垃圾回收器运行时，它会检测到没有任何强引用指向`DirectByteBuffer`对象，意味着对象变得不可达，因此可以被回收。

3. **虚引用对象（`Cleaner`）处理**：`DirectByteBuffer`在创建时会关联一个`Cleaner`对象，这个`Cleaner`对象本质上是一个`PhantomReference`，并且会注册到一个`ReferenceQueue`中。当`DirectByteBuffer`对象被垃圾回收器标记为可回收时，与之关联的`PhantomReference`（即`Cleaner`）会被加入到`ReferenceQueue`中。

4. **后台守护线程`ReferenceHandler`**：JVM内部有一个后台守护线程，通常被称为`ReferenceHandler`，它会定期检查`ReferenceQueue`中的引用。当`ReferenceHandler`检测到`ReferenceQueue`中有新的引用（即`Cleaner`）时，它会执行清理动作，调用`Cleaner`对象的`clean()`方法。

5. **`Cleaner`的`clean()`方法**：在`Cleaner`对象的`clean()`方法中，会调用`DirectByteBuffer`的内部清理逻辑，通常是通过调用`Deallocator`类的`run()`方法。`Deallocator`负责具体的内存释放操作。

6. **释放堆外内存**：在`Deallocator`的`run()`方法中，会调用`Unsafe`类的`freeMemory()`方法，这将直接释放与`DirectByteBuffer`对象关联的堆外内存。







### MappedByteBuffer

`MappedByteBuffer` 是 `ByteBuffer` 的子类，专门用于映射文件到内存中。通过调用 `FileChannel.map()` 方法，可以创建一个 `MappedByteBuffer` 对象，该对象代表了文件的某一部分或整个文件的内存映射。

常用方法：
1. **`load()`** - 这个方法已经废弃，用于从映射区域加载数据。
2. **`force()`** - 强制将缓冲区的内容刷新到磁盘。这确保了所有修改过的数据都被写入磁盘。
3. **`isLoad()`** - 返回是否加载了映射区域，但此方法也已废弃。
4. **`isReadOnly()`** - 检查映射区域是否只读。如果为真，则不能修改映射的缓冲区。
5. **`isDirect()`** - 检查这个缓冲区是否是直接缓冲区。直接缓冲区在本地操作系统中有一个直接的内存映射，而间接缓冲区则在JVM内部有副本。
6. **`position()`**, **`limit()`**, **`mark()`**, **`reset()`**, **`flip()`**, **`rewind()`**, **`clear()`** - 这些方法允许你控制缓冲区中的数据流，类似于 `ByteBuffer` 中的方法。
7. **`get()`, `put(byte)`, `get(int)`, `put(int, byte)`** - 用于读取和写入缓冲区中的字节。
8. **`asCharBuffer()`, `asIntBuffer()`, `asFloatBuffer()`** - 将 `MappedByteBuffer` 转换为其他类型的缓冲区，比如字符缓冲区、整数缓冲区或浮点数缓冲区。


下面是一个简单的示例，展示了如何使用 `MappedByteBuffer` 映射文件到内存并进行读写操作：

```java
import java.io.RandomAccessFile;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;

public class FileMappingExample {

    public static void main(String[] args) throws Exception {
        // 打开一个随机访问文件
        RandomAccessFile raf = new RandomAccessFile("testfile.dat", "rw");
        // 获取对应的FileChannel
        FileChannel fc = raf.getChannel();
        
        // 创建映射缓冲区
        MappedByteBuffer mbb = fc.map(FileChannel.MapMode.READ_WRITE, 0, fc.size());
        
        // 写入一些数据
        for (int i = 0; i < mbb.limit(); i++) {
            mbb.put((byte) 'a');
        }
        
        // 强制写入磁盘
        mbb.force();
        
        // 关闭资源
        fc.close();
        raf.close();
    }
}
```

在上面的例子中，首先创建了一个随机访问文件 `RandomAccessFile`，然后获取了该文件的 `FileChannel`。接着调用 `map()` 方法来映射整个文件到一个 `MappedByteBuffer`。使用 `READ_WRITE` 模式来允许读写操作。之后，遍历缓冲区并填充数据，最后使用 `force()` 方法将更改强制写入磁盘。

请注意，在使用文件映射时，需要确保所有的修改都通过 `force()` 方法刷新到磁盘，否则在程序异常终止的情况下可能会丢失数据。同时，由于 `MappedByteBuffer` 与文件直接相关联，因此在使用完毕后应该关闭相关的 `FileChannel` 和 `RandomAccessFile` 资源。







## Asynchronous I/O

Java AIO（Asynchronous I/O）是一种更加高级的 I/O 模型，它允许进行非阻塞的异步 I/O 操作。AIO 是 Java 7 中引入的新特性，它提供了异步通道（`AsynchronousChannel`）和相关类，以支持异步 I/O 操作。

**AIO 的核心概念**：

1. **AsynchronousChannel**：异步通道，允许异步操作。
2. **Future**：代表异步操作的结果，可等待其完成或注册回调。
3. **CompletionHandler**：完成处理程序，处理异步操作的结果。


### 常见异步通道

异步通道是一种允许你发起I/O操作并且在这些操作完成时得到通知的机制。与传统的同步I/O操作相比，异步通道不会阻塞调用线程。当你发起一个异步操作时，你可以选择等待操作完成，或者提供一个完成处理程序（`CompletionHandler`）来处理操作的结果。

**异步通道的特点**：

1. **非阻塞性**：发起I/O操作后，调用线程不会被阻塞。
2. **异步通知**：可以注册一个完成处理程序（`CompletionHandler`）来处理I/O操作的结果。
3. **Future**：可以使用`Future`对象来等待操作完成。
4. **多线程友好**：适合处理大量并发连接，因为不需要为每个连接创建一个独立的线程。

::: info AsynchronousFileChannel
`AsynchronousFileChannel` 提供了对文件的异步读写操作。
```java
// 打开一个文件并返回 `AsynchronousFileChannel` 实例。
open(Path path, Set<? extends OpenOption> options, FileAttribute<?>... attrs)

// 异步读取文件的一部分
read(ByteBuffer dst, long position, Attachment attachment, 
     CompletionHandler<Integer, ? super Attachment> handler)

// 异步写入数据到文件
write(ByteBuffer src, long position, Attachment attachment, 
      CompletionHandler<Integer, ? super Attachment> handler)
```
:::

- **打开文件**：
  ```java
  Path path = Paths.get("test.txt");
  AsynchronousFileChannel channel = AsynchronousFileChannel.open(path, 
                                            StandardOpenOption.READ);
  ```

- **异步读取**：
  ```java
  ByteBuffer buffer = ByteBuffer.allocate(1024);
  channel.read(buffer, 0, buffer, new CompletionHandler<Integer, ByteBuffer>() {
      @Override
      public void completed(Integer result, ByteBuffer attachment) {
          // 处理读取的数据
          buffer.flip();
          byte[] data = new byte[result];
          buffer.get(data);
          String content = new String(data);
          System.out.println("Read: " + content);
      }

      @Override
      public void failed(Throwable exc, ByteBuffer attachment) {
          // 处理读取失败的情况
          exc.printStackTrace();
      }
  });
  ```

- **异步写入**：
  ```java
  ByteBuffer buffer = ByteBuffer.wrap("Hello, World!".getBytes());
  channel.write(buffer, 0, buffer, new CompletionHandler<Integer, ByteBuffer>() {
      @Override
      public void completed(Integer result, ByteBuffer attachment) {
          System.out.println("Wrote " + result + " bytes.");
      }

      @Override
      public void failed(Throwable exc, ByteBuffer attachment) {
          exc.printStackTrace();
      }
  });
  ```

- **关闭通道**：
  ```java
  channel.close();
  ```


::: info AsynchronousSocketChannel
`AsynchronousSocketChannel` 用于建立和管理 TCP 连接的异步操作。
```java
// 创建一个新的 `AsynchronousSocketChannel` 实例
open()

// 异步连接到远程地址
connect(SocketAddress remote, Attachment attachment,
CompletionHandler<Void, ? super Attachment> handler)

// 异步读取数据
read(ByteBuffer dst, Attachment attachment,
CompletionHandler<Integer, ? super Attachment> handler)

// 异步写入数据
write(ByteBuffer src, Attachment attachment,
CompletionHandler<Integer, ? super Attachment> handler)
```
:::

- **创建通道**：
  ```java
  AsynchronousSocketChannel channel = AsynchronousSocketChannel.open();
  ```

- **异步连接**：
  ```java
  channel.connect(new InetSocketAddress("localhost", 8080), null, new CompletionHandler<Void, Object>() {
      @Override
      public void completed(Void result, Object attachment) {
          System.out.println("Connected to the server.");
      }

      @Override
      public void failed(Throwable exc, Object attachment) {
          System.err.println("Connection failed.");
          exc.printStackTrace();
      }
  });
  ```

- **异步读取**：
  ```java
  ByteBuffer buffer = ByteBuffer.allocate(1024);
  channel.read(buffer, buffer, new CompletionHandler<Integer, ByteBuffer>() {
      @Override
      public void completed(Integer result, ByteBuffer attachment) {
          // 处理读取的数据
          attachment.flip();
          byte[] data = new byte[result];
          attachment.get(data);
          String content = new String(data);
          System.out.println("Received: " + content);
      }

      @Override
      public void failed(Throwable exc, ByteBuffer attachment) {
          // 处理读取失败的情况
          exc.printStackTrace();
      }
  });
  ```

- **异步写入**：
  ```java
  ByteBuffer buffer = ByteBuffer.wrap("Hello, World!".getBytes());
  channel.write(buffer, buffer, new CompletionHandler<Integer, ByteBuffer>() {
      @Override
      public void completed(Integer result, ByteBuffer attachment) {
          System.out.println("Wrote " + result + " bytes.");
      }

      @Override
      public void failed(Throwable exc, ByteBuffer attachment) {
          exc.printStackTrace();
      }
  });
  ```

- **关闭通道**：
  ```java
  channel.close();
  ```


::: info AsynchronousServerSocketChannel
`AsynchronousServerSocketChannel` 用于接受新的连接。
```java
// 创建一个新的 `AsynchronousServerSocketChannel` 实例
open()

// 绑定到本地地址并设置监听队列的长度
bind(SocketAddress local, int backlog, Attachment attachment,
CompletionHandler<Void, ? super Attachment> handler)

// 异步接受新的连接
accept(Attachment attachment,
CompletionHandler<AsynchronousSocketChannel, ? super Attachment> handler)
```
:::


- **创建通道**：
  ```java
  AsynchronousServerSocketChannel serverChannel = AsynchronousServerSocketChannel.open();
  ```

- **绑定地址**：
  ```java
  serverChannel.bind(new InetSocketAddress(8080));
  ```

- **异步接受连接**：
  ```java
  serverChannel.accept(null, new CompletionHandler<AsynchronousSocketChannel, Object>() {
      @Override
      public void completed(AsynchronousSocketChannel clientChannel, Object attachment) {
          System.out.println("New client connected.");
          // 处理新连接
      }

      @Override
      public void failed(Throwable exc, Object attachment) {
          System.err.println("Accept failed.");
          exc.printStackTrace();
      }
  });
  ```

异步通道是Java NIO中用于执行异步I/O操作的关键组件。它们提供了非阻塞性的API，允许你在发起I/O操作后继续执行其他任务，并在操作完成时通过`CompletionHandler`或`Future`来处理结果。这对于构建高性能、高并发的应用程序非常有用，尤其是在处理大量并发连接时。




### 处理异步操作结果

#### CompletionHandler
- `CompletionHandler<R, A>` 用于处理异步操作的结果。
  - `completed(R result, A attachment)`：当异步操作成功完成时调用。
  - `failed(Throwable exc, A attachment)`：当异步操作失败时调用。

`CompletionHandler` 不会阻塞调用线程, 操作完成时立即处理结果。适用于多个异步操作的场景。


#### Future
除了使用`CompletionHandler`之外，你还可以使用`Future`对象来等待异步操作的结果。
- `Future<T>` 代表异步操作的结果。
  - `get()`：等待异步操作完成，并返回结果。
  - `isDone()`：判断异步操作是否已经完成。
  - `isCancelled()`：判断异步操作是否已被取消。
  - `cancel(boolean mayInterruptIfRunning)`：尝试取消异步操作。

调用 `Future.get()` 会阻塞调用线程，直到异步操作完成。当只需要处理一个异步操作时，使用 Future 更为简单。

future读取:
```java
ByteBuffer buffer = ByteBuffer.allocate(1024);
Future<Integer> future = channel.read(buffer, 0, buffer);
Integer result = future.get(); // 阻塞等待结果
```

future写入:
```java
ByteBuffer buffer = ByteBuffer.wrap("Hello, World!".getBytes());
Future<Integer> future = channel.write(buffer, buffer);
Integer result = future.get(); // 阻塞等待结果
```



### AIO原理及应用

下面是一个简单的 Java AIO 服务端示例，演示了如何使用 `AsynchronousServerSocketChannel` 接受客户端连接，并使用 `AsynchronousSocketChannel` 异步读取数据：

```java
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousChannelGroup;
import java.nio.channels.AsynchronousServerSocketChannel;
import java.nio.channels.AsynchronousSocketChannel;
import java.nio.channels.CompletionHandler;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class AioServer {
    private static final int PORT = 8080;
    private static final int BUFFER_SIZE = 1024;

    public static void main(String[] args) throws IOException, InterruptedException {
        // 创建异步通道组
        ExecutorService executor = Executors.newFixedThreadPool(10);
        AsynchronousChannelGroup group = AsynchronousChannelGroup.withThreadPool(executor);

        // 创建服务器通道
        AsynchronousServerSocketChannel serverChannel = AsynchronousServerSocketChannel.open(group).bind(new InetSocketAddress(PORT));

        System.out.println("Server started on port " + PORT);

        // 接受客户端连接
        while (true) {
            Future<AsynchronousSocketChannel> future = serverChannel.accept();
            AsynchronousSocketChannel clientChannel = future.get(); // 阻塞等待新的连接
            System.out.println("New connection accepted.");

            // 使用线程池中的线程处理客户端连接
            handleClientConnection(clientChannel);
        }
    }

    private static void handleClientConnection(final AsynchronousSocketChannel clientChannel) throws IOException {
        ByteBuffer buffer = ByteBuffer.allocate(BUFFER_SIZE);

        // 读取客户端数据
        clientChannel.read(buffer, buffer, new CompletionHandler<Integer, ByteBuffer>() {
            @Override
            public void completed(Integer result, ByteBuffer attachment) {
                attachment.flip();
                byte[] data = new byte[result];
                attachment.get(data);
                String message = new String(data);
                System.out.println("Received: " + message);

                // 回应客户端
                ByteBuffer responseBuffer = ByteBuffer.wrap(message.getBytes());
                clientChannel.write(responseBuffer, responseBuffer, new CompletionHandler<Integer, ByteBuffer>() {
                    @Override
                    public void completed(Integer result, ByteBuffer attachment) {
                        System.out.println("Sent: " + result);
                        attachment.clear();
                    }

                    @Override
                    public void failed(Throwable exc, ByteBuffer attachment) {
                        System.err.println("Write failed.");
                        exc.printStackTrace();
                        try {
                            clientChannel.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }

            @Override
            public void failed(Throwable exc, ByteBuffer attachment) {
                System.err.println("Read failed.");
                exc.printStackTrace();
                try {
                    clientChannel.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
    }
}
```

- **主线程**：主线程主要负责等待新的客户端连接到来，并为每个连接调用 `handleClientConnection()` 方法。
- **线程池**：`AsynchronousChannelGroup` 中的==线程池负责处理所有的异步操作的通知==，包括读取数据 (`clientChannel.read()`) 和写回数据 (`clientChannel.write()`) 完成时的通知。
- **异步操作**：所有的异步操作本身是由操作系统内核处理的，而不是由Java应用中的线程直接执行。
- **完成处理器**：`CompletionHandler` 的 `completed` 和 `failed` 方法在线程池中的线程上执行，用于处理I/O操作的结果或错误。

在Java AIO中，==I/O操作的执行是由操作系统内核完成的，而线程池中的线程主要用于处理I/O操作完成的通知，并执行相应的逻辑来处理结果或错误==。



## BIO/NIO/AIO的区别

在阻塞I/O（BIO）模型中，当一个线程发起I/O操作时，该线程会进入阻塞状态，直到操作系统完成I/O操作。具体来说：

1. **发起I/O操作**：当Java程序中的线程发起一个I/O操作，比如读取文件或接收网络数据，它实际上是在告诉操作系统去执行这个操作。

2. **操作系统处理I/O**：操作系统接收到这个请求后，会使用内核线程或其他机制来执行I/O操作。在这个过程中，Java线程会进入阻塞状态，等待操作系统完成I/O操作。

3. **线程恢复运行**：一旦操作系统完成了I/O操作，它会通知Java线程，后者随后从阻塞状态恢复，继续执行后续代码。

**BIO 的流程及线程的状态变化**：

1. **发起I/O操作**：Java线程调用 `read()` 或 `write()` 方法来发起I/O操作。
2. **操作系统处理I/O**：操作系统开始执行I/O操作，并在此期间阻塞Java线程。
3. **线程恢复**：一旦I/O操作完成，Java线程被解除阻塞状态，并继续执行。

线程的状态变化：

- **发起I/O操作前**：线程处于运行状态。
- **I/O操作期间**：线程进入阻塞状态，等待操作系统完成I/O操作。
- **I/O操作完成**：线程恢复运行状态，并继续执行。

::: info BIO和AIO的本质区别
### BIO 与 AIO 的比较

- **BIO**：线程在I/O操作期间被阻塞。
- **AIO**：线程在发起I/O操作后可以继续执行其他任务，直到操作系统完成I/O操作并通知Java应用。

==无论是BIO还是AIO，I/O操作的实际执行都是由操作系统内核处理的==。不同之处在于，在BIO模型中，Java线程在I/O操作期间会被阻塞；而在AIO模型中，Java线程可以继续执行其他任务，直到操作系统完成I/O操作并通知Java应用。这种区别使得AIO在处理大量并发连接时更加高效和可扩展。
:::


**NIO 与 AIO 的区别**：
- **NIO**：线程在发起 I/O 操作后不会被阻塞，但它需要轮询 `Selector` 来检查是否有 I/O 事件发生。
- **AIO**：线程在发起 I/O 操作后不会被阻塞，并且操作系统会在操作完成时通知 Java 应用。通过 `CompletionHandler` 或 `Future` 来处理操作完成的通知。

适用场景：
- **NIO**：适用于需要处理大量并发连接的场景，如网络服务器。它通过选择器机制来管理多个连接的 I/O 事件，提高了服务器的性能。
- **AIO**：适用于需要处理大量并发连接并且每个连接的 I/O 操作较少的场景。它通过异步通知机制来处理 I/O 操作的完成，进一步提高了服务器的性能。












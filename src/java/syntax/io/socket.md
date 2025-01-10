---

order: 1
title: Java网络编程

---

Socket编程：理解TCP/IP套接字，如何在Java中实现客户端和服务端的通信。
URL与URLConnection：如何使用Java的URL和URLConnection类进行基本的HTTP请求。
HttpURLConnection与HttpClient：深入学习如何利用这些类库进行更复杂的HTTP请求和响应处理。



## 网络通信基础概念 

### IP地址和端口

- **IP地址（Internet Protocol Address）**：是网络中设备的唯一标识。IP地址是一种数字标识符，它遵循Internet Protocol（IP）规定的格式。有两种主要的IP地址版本：

  - IPv4：每个IP地址长32bit，也就是4个字节。如：`11000000 10101000 00000001 01000010`，十进制为：`192.168.1.66`
  - IPv6：128位地址长度，通常表示为 八组==四位十六进制数(每个十六进制4位，所以每16位一组)==。例如`2001:0db8:85a3:0000:0000:8a2e:0370:7334`。

  ```java
  // java 关于IP地址的使用：
  // InetAddress inetAddress = InetAddress.getByName("LAPTOP-TS9EH1VR");
  InetAddress inetAddress = InetAddress.getByName("192.168.0.9");
  
  System.out.println(inetAddress.getHostName());     // LAPTOP-TS9EH1VR
  System.out.println(inetAddress.getHostAddress());  // 192.168.0.9
  ```
IP地址使得数据包能够在互联网上被路由和送达目标主机。

<br/>

- **端口（port）**： 端口是操作系统中的一种逻辑结构，用于区分不同的网络服务或应用程序。每个端口由一个16位的整数表示，范围从0到65535。端口的作用是：
    - 允许同一台主机上的多个应用程序同时使用网络。
    - 指定特定类型的数据应被哪个应用程序接收或发送。

常见的端口包括80（HTTP）、443（HTTPS）、22（SSH）、21（FTP）等。端口分为三类：**熟知端口**（0-1023,用于知名的网络服务和应用），**注册端口**（1024-49151，普通应用程序使用），**动态或私有端口**（49152-65535）。


    
### 协议(Protocol)

网络协议是一组规则，规定了网络上数据的格式、交换过程和动作序列。它定义了如何建立、维护和终止通信。一些常见的网络协议包括：

- **TCP (Transmission Control Protocol)**：提供可靠的、面向连接的数据传输服务。
- **UDP (User Datagram Protocol)**：提供简单的、无连接的数据传输服务，不保证数据的顺序或可靠性。
- **HTTP (Hypertext Transfer Protocol)**：用于Web通信的标准协议。
- **HTTPS**：HTTP的安全版本，使用SSL/TLS加密数据。
- **FTP (File Transfer Protocol)**：用于文件上传和下载。
- **SMTP (Simple Mail Transfer Protocol)**：用于电子邮件传输。



## Socket网络编程

在计算机网络中，Socket是网络上两个程序之间进行双向通信的端点。

具体来说Socket是一种抽象的==网络通信接口==，它允许一个程序与其他程序通信，无论是在同一台机器上还是通过网络。Socket可以基于不同的协议，如TCP或UDP。

在Java中，`Socket`类和`ServerSocket`类用于实现客户端和服务器之间的通信。具体来说：
- **Socket类**：代表客户端的连接，用于向服务器发起连接请求。
- **ServerSocket类**：代表服务器端的监听，用于接受客户端的连接请求。

Socket提供了读写数据的方法，如`InputStream`和`OutputStream`，用于发送和接收数据。此外，`DatagramSocket`和`DatagramPacket`类用于基于UDP的通信，它们处理数据报包的发送和接收。



### UDP协议及通信

在Java中，基于UDP协议的Socket编程主要涉及`DatagramSocket`和`DatagramPacket`这两个类。UDP（用户数据报协议）是一种无连接的协议，它不保证数据的顺序和完整性，但是具有低延迟和高效率的特点，适用于不需要可靠传输的场合，如实时音频和视频流。

- **无连接**：在发送数据前无需建立连接。
- **不可靠**：没有确认机制，数据可能丢失、重复或乱序。
- **广播和多播**：可以利用UDP进行广播和多播通信。

::: info UDP Socket编程主要类及方法

#### 1. `DatagramSocket`
`DatagramSocket`类表示一个UDP Socket，它负责接收和发送数据报。

- **构造方法**:
  - `DatagramSocket()`：创建一个新的未绑定的`DatagramSocket`。
  - `DatagramSocket(int port)`：创建一个新的`DatagramSocket`并将其绑定到特定的本地端口。
  - `DatagramSocket(int port, InetAddress address)`：创建一个新的`DatagramSocket`并将其绑定到特定的本地端口和地址。

- **实例方法**:
  - `send(DatagramPacket p)`：发送一个数据报。
  - `receive(DatagramPacket p)`：接收一个数据报。
  - `close()` : 关闭socket 

#### 2. `DatagramPacket`
`DatagramPacket`类封装了UDP数据报的内容和目的地信息。

- **构造方法**:
  - `DatagramPacket(byte[] buf, int length)`：创建一个新的数据报，用于接收数据。
  - `DatagramPacket(byte[] buf, int length, InetAddress address, int port)`：创建一个新的数据报，用于发送数据。
:::


下面是一个简单的Java UDP客户端和服务器示例：

UDP服务器端: 服务器监听端口1234，接收来自客户端的消息，并将收到的消息原样发回
```java
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UDPServer {
    public static void main(String[] args) {
        try (DatagramSocket socket = new DatagramSocket(1234)) {
            byte[] buffer = new byte[1024];
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
            
            System.out.println("Server is ready to receive messages.");
            
            while (true) {
                socket.receive(packet);
                String received = new String(packet.getData(), 0, packet.getLength());
                System.out.println("Received from client: " + received);
                
                // Echo back to the client
                InetAddress address = packet.getAddress();
                int port = packet.getPort();
                packet = new DatagramPacket(buffer, buffer.length, address, port);
                socket.send(packet);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

UDP客户端: 客户端则向服务器发送一条消息，并接收服务器的回应。
```java
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UDPClient {
    public static void main(String[] args) {
        try (DatagramSocket socket = new DatagramSocket()) {
            byte[] buffer = "Hello, Server!".getBytes();
            InetAddress address = InetAddress.getByName("localhost");
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length, address, 1234);
            
            socket.send(packet);
            System.out.println("Message sent to server.");
            
            // Receive response
            buffer = new byte[1024];
            packet = new DatagramPacket(buffer, buffer.length);
            socket.receive(packet);
            String response = new String(packet.getData(), 0, packet.getLength());
            System.out.println("Response from server: " + response);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```




### TCP/IP协议及通信

在Java中，基于TCP/IP协议的Socket编程主要是使用`java.net.Socket`和`java.net.ServerSocket`这两个核心类。TCP（传输控制协议）是一种面向连接的、可靠的、基于字节流的通信协议，在网络通信中广泛用于需要高可靠性的数据传输。TCP Socket编程特点如下：

- **面向连接**：在数据传输之前必须先建立连接，传输完成后要释放连接。
- **可靠传输**：提供错误检测和自动重传，保证数据的顺序性和完整性。
- **全双工**：通信双方都可以同时发送和接收数据。

::: info TCP协议简介
TCP协议是面向连接的通信协议，即传输数据之前，在发送端和接收端建立逻辑连接，然后再传输数 据，它提供了两台计算机之间可靠无差错的数据传输。

- 在TCP连接中必须要明确客户端与服务器端，由客户端向服务端发出连接请求，每次连接的创建都需要经过“三次握手” 
- 三次握手：TCP协议中，在发送数据的准备阶段，客户端与服务器之间的三次交互，以保证连接的可靠 
  - 第一次握手，客户端向服务器端发出连接请求，等待服务器确认 
  - 第二次握手，服务器端向客户端回送一个响应，通知客户端收到了连接请求 
  - 第三次握手，客户端再次向服务器端发送确认信息，确认连接 
:::

完成三次握手，连接建立后，客户端和服务器就可以开始进行数据传输了。由于这种面向连接的特性， TCP协议可以保证传输数据的安全，所以应用十分广泛。例如上传文件、下载文件、浏览网页等

::: info 基于TCP/IP协议的Socket编程主要类及方法

#### 1. `ServerSocket`
`ServerSocket`类用于创建服务器端的Socket，它监听特定端口上的连接请求。

- **构造方法**:
  - `ServerSocket(int port)`：创建一个绑定到特定端口的`ServerSocket`。
  - `ServerSocket(int port, int backlog)`：创建一个绑定到特定端口的`ServerSocket`，并指定连接队列的最大长度。
  
- **实例方法**:
  - `Socket accept()`：监听并接受一个来自客户端的连接请求，该方法是阻塞的，直到一个客户端连接。

#### 2. `Socket`
`Socket`类用于创建客户端的Socket，用于与服务器建立连接。

- **构造方法**:
  - `Socket(String host, int port)`：创建一个新的Socket并尝试连接到给定的主机和端口。
  
- **实例方法**:
  - `OutputStream getOutputStream()`：获取Socket的输出流，用于发送数据。
  - `InputStream getInputStream()`：获取Socket的输入流，用于接收数据。
  - `void close()`：关闭Socket，释放与之关联的所有资源。
:::


下面是一个简单的Java TCP服务器和客户端的示例代码：

TCP服务器端：服务器监听端口1234，并为每个连接的客户端创建一个新的线程（在实际代码中通常使用线程池）。当任一端发送“bye”时，连接将被关闭。
```java
import java.io.*;
import java.net.*;

public class TCPServer {
    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(1234)) {
            System.out.println("Server started. Listening on port 1234...");

            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("New client connected: " + clientSocket);

                // 创建一个新的线程来处理客户端的连接
                Thread clientHandler = new Thread(() -> {
                    try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                         PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {
                        String inputLine;
                        while ((inputLine = in.readLine()) != null) {
                            System.out.println("Received from client: " + inputLine);
                            if ("bye".equalsIgnoreCase(inputLine)) {
                                break;
                            }
                            out.println("Echo: " + inputLine);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    } finally {
                        try {
                            clientSocket.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                });
                // 启动线程
                clientHandler.start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```


TCP客户端：客户端连接到服务器并可以发送任意数量的消息，服务器将这些消息回显给客户端。当任一端发送“bye”时，连接将被关闭。
```java
import java.io.*;
import java.net.*;

public class TCPClient {
    public static void main(String[] args) {
        try (Socket socket = new Socket("localhost", 1234);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             BufferedReader stdIn = new BufferedReader(new InputStreamReader(System.in))) {
            System.out.println("Connected to server.");
            
            String fromServer;
            String fromUser;
            while ((fromUser = stdIn.readLine()) != null) {
                out.println(fromUser);
                out.flush();
                if ("bye".equalsIgnoreCase(fromUser)) {
                    break;
                }
                fromServer = in.readLine();
                System.out.println("Received from server: " + fromServer);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

当前的服务器端代码中，每当一个客户端连接时，服务器就会创建一个新的线程来处理这个连接。这样，即使有多个客户端同时连接，服务器也能有效地处理每个客户端的请求。然而，这种实现可能会消耗大量的系统资源，特别是在大量客户端连接的情况下，因为每个连接都会启动一个新的线程。在生产环境中，更推荐使用线程池来限制并发线程的数量，从而更有效地管理资源。



### NIO和AIO

NIO（Non-blocking I/O）和AIO（Asynchronous I/O）是Java中用于提高I/O操作性能的两种高级机制，它们可以显著提升在网络编程中的并发能力和响应速度。

- **非阻塞I/O（NIO）或多路复用（如select/poll）**：使用Java NIO的`Selector`，可以在单一线程中管理多个通道（Channels）的读写操作，而无需为每个连接创建单独的线程。

- **异步I/O（AIO）**：在Java中使用AIO模型，可以注册通道的读写事件，当事件就绪时通过回调处理，这也是非阻塞且高效的处理方式。

NIO（Non-blocking I/O）引入了通道（Channel）和缓冲区（Buffer）的概念，其中通道可以是文件、网络连接或其他数据源，而缓冲区则用于存储待处理的数据。NIO的主要优点是支持非阻塞I/O，即在没有数据可读或写时，不会阻塞线程，从而提高了服务器的并发能力。

使用NIO优化服务器代码：
1. **使用`ServerSocketChannel`**：替代传统的`ServerSocket`，创建一个非阻塞的`ServerSocketChannel`。
2. **使用`Selector`**：`Selector`用于监控多个`Channel`的I/O状况，当某个`Channel`准备好进行读写操作时，`Selector`会通知相应的线程去处理。
3. **使用`ByteBuffer`**：用于读取和写入数据，代替`InputStream`和`OutputStream`。

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

public class NioTcpServer {
    private final Selector selector;
    private final ServerSocketChannel serverChannel;
    private final ByteBuffer buffer = ByteBuffer.allocate(1024);

    public NioTcpServer(int port) throws IOException {
        selector = Selector.open();
        serverChannel = ServerSocketChannel.open();
        serverChannel.socket().bind(new InetSocketAddress(port));
        serverChannel.configureBlocking(false);
        serverChannel.register(selector, SelectionKey.OP_ACCEPT);
    }

    public void listen() throws IOException {
        while (!Thread.currentThread().isInterrupted()) {
            selector.select();
            Set<SelectionKey> keys = selector.selectedKeys();
            Iterator<SelectionKey> it = keys.iterator();
            while (it.hasNext()) {
                SelectionKey key = it.next();
                if (key.isAcceptable()) {
                    registerForRead((ServerSocketChannel) key.channel());
                } else if (key.isReadable()) {
                    readData(key);
                }
                it.remove();
            }
        }
    }

    private void registerForRead(ServerSocketChannel channel) throws IOException {
        SocketChannel clientChannel = channel.accept();
        clientChannel.configureBlocking(false);
        clientChannel.register(selector, SelectionKey.OP_READ);
    }

    private void readData(SelectionKey key) throws IOException {
        SocketChannel channel = (SocketChannel) key.channel();
        buffer.clear();
        int numRead = channel.read(buffer);
        if (numRead > 0) {
            buffer.flip();
            byte[] data = new byte[numRead];
            buffer.get(data);
            System.out.println("Received: " + new String(data));
            writeData(channel, data);
        }
    }

    private void writeData(SocketChannel channel, byte[] data) throws IOException {
        buffer.clear();
        buffer.put(data);
        buffer.flip();
        channel.write(buffer);
    }

    public static void main(String[] args) throws IOException {
        new NioTcpServer(1234).listen();
    }
}
```


AIO（Asynchronous I/O）是NIO的扩展，提供了真正的异步I/O操作。在AIO中，你可以发起一个I/O操作并立即返回，当操作完成时，系统会通知你的程序。这对于高并发的服务器特别有用。

使用AIO优化服务器代码：

1. **使用`AsynchronousServerSocketChannel`**：创建一个监听特定端口的异步服务器通道。
2. **使用`Future`**：发起异步操作时，返回一个`Future`对象，可以用来检查操作是否完成或获取结果。

由于AIO在Java中是通过JDK 7引入的，其API可能不如NIO成熟和广泛使用，但在某些场景下，特别是高并发场景，AIO可以提供更好的性能。

注意，NIO和AIO的实现都比较复杂，需要对Java的I/O模型有深入的理解。在实际应用中，可能还需要结合线程池和其他并发工具来进一步优化性能。



## 网络编程注意事项

除了基本的错误与异常处理、多线程及线程池的使用外，还应该关注以下事项：

::: info 网络编程注意事项及优化思路
#### 安全与加密
- **SSL/TLS**：使用安全套接字层或传输层安全协议来加密数据传输。
- **SSLSocketFactory/SSLSocket**：用于创建安全的Socket连接。

#### 实时应用与性能考虑
- **非阻塞IO与NIO**：新的IO API，提供了非阻塞模式，提高了高并发场景下的性能。
- **Socket选项**：如SO_TIMEOUT，设置Socket的超时时间。

#### 网络编程最佳实践
- **资源管理**：确保关闭所有打开的Socket和Stream。
- **编码标准**：选择合适的字符集，如UTF-8。
- **协议设计**：定义清晰的数据格式和协议规则。
:::
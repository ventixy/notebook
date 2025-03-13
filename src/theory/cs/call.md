---

order: 90
title: OS系统调用

---

进程控制：fork、exec、wait等
文件操作：open、read、write等
设备操作：ioctl等
信息维护：getpid、alarm等
通信：pipe、shmget等

## 进程控制

进程控制是操作系统中最基本的功能之一，主要通过以下系统调用实现：

### fork()
fork() 系统调用用于创建一个新的进程，这个新进程被称为子进程，而调用fork的进程被称为父进程。

::: tip fork()的特点
1. 子进程是父进程的完整副本，包括代码段、数据段和堆栈段
2. 子进程获得父进程的数据空间、堆和栈的副本
3. 父子进程的执行是并发的
4. 返回值：
   - 在父进程中返回子进程的PID
   - 在子进程中返回0
   - 创建失败时返回-1
:::

### exec()
exec系列系统调用（execve、execl、execlp等）用于在当前进程中加载并执行新的程序。

```c
// 示例：使用execl执行ls命令
execl("/bin/ls", "ls", "-l", NULL);
```

::: info exec()的特点
1. 新程序会替换当前进程的代码段、数据段
2. 进程ID保持不变
3. 如果执行成功，不会返回；如果失败，返回-1
:::

### wait()
wait系列系统调用（wait、waitpid）用于父进程等待子进程结束。

::: tip wait()的作用
1. 阻塞父进程，直到子进程结束
2. 回收子进程的资源
3. 获取子进程的退出状态
:::

### 实际应用场景

在Java中，虽然不直接使用这些系统调用，但Runtime.exec()和ProcessBuilder在底层就是通过这些系统调用来实现的：

```java
// 使用ProcessBuilder执行系统命令
ProcessBuilder pb = new ProcessBuilder("ls", "-l");
Process process = pb.start();
int exitCode = process.waitFor(); // 等待进程结束
```

## 文件操作

文件操作是操作系统提供的另一个重要功能，主要包括以下系统调用：

### open()
open() 系统调用用于打开或创建一个文件。

::: tip open()的主要参数
1. 文件路径
2. 打开方式：
   - O_RDONLY：只读模式
   - O_WRONLY：只写模式
   - O_RDWR：读写模式
3. 文件权限（创建文件时使用）
:::

### read() 和 write()
这两个系统调用用于文件的读写操作。

```c
// 文件读写示例
int fd = open("test.txt", O_RDWR);
char buffer[1024];
ssize_t bytes_read = read(fd, buffer, sizeof(buffer));
ssize_t bytes_written = write(fd, "Hello", 5);
```

::: info 文件读写特点
1. read()返回实际读取的字节数
2. write()返回实际写入的字节数
3. 都可能因为各种原因（如磁盘满）而读/写的字节数少于请求的字节数
:::

### 实际应用场景

Java的FileInputStream和FileOutputStream在底层就是通过这些系统调用实现的：

```java
// Java文件操作示例
try (FileInputStream fis = new FileInputStream("input.txt");
     FileOutputStream fos = new FileOutputStream("output.txt")) {
    byte[] buffer = new byte[1024];
    int bytesRead;
    while ((bytesRead = fis.read(buffer)) != -1) {
        fos.write(buffer, 0, bytesRead);
    }
}
```

## 设备操作

设备操作主要通过ioctl系统调用来实现，它提供了一种统一的接口来控制各种设备。

### ioctl()
ioctl (input/output control) 系统调用用于控制设备的特性。

::: tip ioctl()的主要功能
1. 获取设备信息
2. 设置设备参数
3. 控制设备行为
4. 执行设备特定的操作
:::

### 实际应用场景

在Java中，通过JNI调用native方法来实现设备控制：

```java
// Java设备控制示例
public class DeviceControl {
    // 通过JNI调用native方法
    private native int setDeviceParameter(int fd, int parameter);
    
    static {
        System.loadLibrary("devicecontrol");
    }
}
```

## 信息维护

信息维护系统调用用于获取和设置系统信息。

### getpid()
getpid() 系统调用返回当前进程的进程ID。

::: info 常用的信息维护系统调用
1. getpid()：获取当前进程ID
2. getppid()：获取父进程ID
3. alarm()：设置定时器
4. time()：获取系统时间
:::

### 实际应用场景

```java
// Java获取进程信息示例
long pid = ProcessHandle.current().pid();
System.out.println("当前进程ID: " + pid);
```

## 通信

进程间通信（IPC）是操作系统提供的重要功能，主要通过以下系统调用实现：

### pipe()
pipe() 系统调用用于创建一个管道，实现单向数据传输。

::: tip 管道通信特点
1. 单向通信：数据只能从写端流向读端
2. 只能用于有亲缘关系的进程间通信
3. 数据是字节流形式
:::

### 其他IPC机制

::: info 常用的IPC机制
1. 消息队列（msgget、msgsnd、msgrcv）
2. 共享内存（shmget、shmat、shmdt）
3. 信号量（semget、semop）
4. Socket（socket、bind、listen等）
:::

### 实际应用场景

```java
// Java进程间通信示例（使用Socket）
ServerSocket server = new ServerSocket(8080);
Socket client = server.accept();

BufferedReader in = new BufferedReader(
    new InputStreamReader(client.getInputStream()));
PrintWriter out = new PrintWriter(client.getOutputStream(), true);

// 读取客户端数据
String message = in.readLine();
// 发送响应
out.println("Response: " + message);
```
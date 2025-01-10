---

order: 60
title: Java IO流

---



## Java流的分类

Java中所有数据都是使用流读写的, 流是一组有序的数据序列，将数据从一个地方带到另一个地方。

数据流是 Java 进行 I/O 操作的对象，它按照不同的标准可以分为不同的类别。

- 按照流的方向主要分为：输入（Input）流和输出（Output）流两种

  ![](https://image.ventix.top/java/image-20220217210243271.png)

- 数据流按照数据单位的不同分为：字节流、字符流

  - 字节流: 逻辑单位是字节,一个字节一个字节的传输 0000 0000   1B

  - 字符流: 逻辑单位是字符(理解为一种文化符号, 你好, ABC, の)，一个字符一个字符的传输

  - 一般情况下，如果是文本文件,一般采用字符流方便一些，对于非文本文件,一般采用字节流(字节流是万能的)

    

- 按照功能可以划分为：节点流、处理流



**常用的IO流实现类**：

![](https://image.ventix.top/java/image-20211018023119385.png)




## Java字节流

Java中的字节流（Byte Streams）是I/O（输入/输出）操作中处理二进制数据的基础组件。字节流允许以字节（byte，8位的序列，即8位二进制数据）的形式读取或写入数据，这对于处理诸如图片、音频、视频、压缩文件或任何非文本的原始二进制数据尤其有用。

Java的字节流主要通过`java.io`包中的几个核心类来实现，其中最重要的是`InputStream`和`OutputStream`。这两个类是所有字节流操作的基类，提供了读取字节和写入字节的基本方法。


### 字节输出流

- **功能**：OutputStream抽象类，定义了写入二进制数据的基本操作。
- **子类**：包括`FileOutputStream`用于写入文件，`ByteArrayOutputStream`写入字节数组，`PrintStream`用于格式化输出等。

OutputStream 抽象类 的常用方法：

- `void write(int b)`：写入一个字节（参数是 int 类型），为了提高 I/O 操作的效率，建议尽量使用 write() 方法的另外两种形式
- `void write(byte[] b)`：把字节数组中的所有字节写到输出流中
- `void write(byte[] b,int off,int len)`：off 指定字节 数组中的起始下标，len 表示元素个数
- `void close()`：关闭输出流
- `void flush()`：使用 flush() 方法则可以强制将缓冲区中的数据写入输出流， 并清空缓冲区


::: tip 注意
在创建 FileOutputStream 类的对象时，如果指定的文件不存在，则创建一个新文件；**如果文件已存在，则清除原文件的内容重新写入**
:::

```java
public class OutputStreamDemo {
    public static void main(String[] args) throws IOException {
        FileOutputStream fos = new FileOutputStream(".\\data\\output.txt",true); //append为true表示追加写入
        // 1. 写入指定字节
        fos.write(97);  //a
        fos.write(98);
        fos.write(99);

        // 2. 写入字节数组
        byte[] b = {',',97,98,99,100};
        byte[] b2 = ",abcde".getBytes();
        fos.write(b);
        fos.write(b2);
        // 指定写入的字节数组内容
        fos.write(b2,0,b2.length);

        // 3. 写数据时如何实现换行？ （ ）
        fos.write("\n\r".getBytes());
        for (int i = 0; i < 5; i++) {
            fos.write("Hello\n\r".getBytes());
        }
        fos.close();
    }
}
```

::: info 两种输出换行符

- `System.lineSeparator() ` 根据不同的操作系统使用对应的换行符

- 各个操作系统的换行符不同 win: `\r\n` ，  mac: `\r` ,   linux: `\n` ，直接使用 `\r\n` 即可三个平台都生效

  | 缩写  | ASCⅡ转义 | 系统                   | ASCⅡ值 |
  | ----- | -------- | ---------------------- | ------ |
  | CR    | `\r`      | MacIntosh（早期的Mac） | 13     |
  | LF    | `\n`     | Unix/Linux/Mac OS X    | 10     |
  | CR LF | `\r\n`     | Windows                |        |

  - CR：Carriage Return，对应ASCII中转义字符`\r`，表示回车
  - LF：Linefeed，对应ASCII中转义字符`\n`，表示换行
  - CRLF：Carriage Return & Linefeed，`\r\n`，表示回车并换行
:::




### 字节输入流

- **功能**：InputStream 抽象类 用于读取二进制数据。
- **子类**：`InputStream`有许多子类，如`FileInputStream`用于读取文件，`ByteArrayInputStream`读取字节数组，`PipedInputStream`用于线程间通信等。

**InputStream抽象类的常用方法**:

- `int read()`：从输入流中读取一个 8 位的字节，并把它转换为 0~255 的整数，最后返回整数

  如果返回 -1，则表示已经到了输入流的末尾。为了提高 I/O 操作的效率，建议尽量使用 read() 方法的另外两种形式

- `int read(byte[] b)`：从输入流中读取若干字节，并把它们保存到字节数组中。返回结果读到数组中的字节数

- `int read(byte[] b, int off, int len)`：off 指定在字节数组中开始保存数据的起始下标；len 指定读取的字节数

- `void close()`：关闭输入流

- `int available()`：返回可以从输入流中读取的字节数 

- `long skip(long n)`：从输入流中跳过参数 n 指定数目的字节。该方法返回跳过的字节数
- `void mark(int readLimit)`：在输入流的当前位置开始设置标记
- `boolean markSupported()`：判断当前输入流是否允许设置标记，是则返回 true，否则返回 false
- `void reset()`：将输入流的指针返回到设置标记的起始处



```java
public class FileInputStreamDemo {
    public static void main(String[] args) {
        try (FileInputStream fis = new FileInputStream("abc.txt")) {
            // read() 方法一次读一个字节（8位）
            int r1 = fis.read();
            int r2 = fis.read();
            System.out.println(r1 + ", " + r2);

            // int read(byte[] b) 从输入流中读取若干字节，并把它们保存到字节数组中
            byte[] bytes = new byte[10];
            int count = fis.read(bytes);
            System.out.println("读取的字符个数：" + count);
            System.out.println("读到的字符：" + new String(bytes, 0, count));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

![](https://image.ventix.top/java/image-20220218132819531.png)





【应用】：利用字节流复制图片示例

```java
// 复制图片
public class CopyPicture {
    public static void main(String[] args) {
        try {
            FileInputStream fis = new FileInputStream(".\\data\\io\\abc.png");
            FileOutputStream fos = new FileOutputStream(".\\data\\io\\abc_copy.png");
            byte[] bys = new byte[1024];
            int len;
            while ((len = fis.read(bys)) != -1){
                fos.write(bys,0,len);
            }
            fis.close();
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```





### 字节缓冲流

字节缓冲流（Byte Buffering Streams）是Java I/O体系中用来提高字节流读写效率的一类特殊流。

它们通过引入内部缓冲区来减少直接与物理介质（如磁盘或网络）的交互次数，从而提升了数据读写速度。

Java中的字节缓冲流主要包括`BufferedInputStream`和`BufferedOutputStream`两个类，它们分别继承自`FilterInputStream`和`FilterOutputStream`，是字节流的装饰器模式实现。

**使用场景**:
- **频繁读写小块数据**：对于频繁的小规模读写操作，缓冲流能显著减少系统调用的开销。
- **文件处理**：处理大文件时，缓冲流能有效减少磁盘I/O，提升处理速度。
- **网络通信**：在网络数据传输中，缓冲流可以减少网络I/O，提高数据传输效率。


```java
BufferedOutputStream(QutputStream out)  // 字节缓冲输出流
BufferedInputStream(InputStream in)     // 字节缓冲输入流
```

::: tip 为什么构造方法需要的是字节流，而不是具体的文件或者路径呢?
- 因为字节缓冲流**仅仅提供缓冲区**（默认为 8kb ），而真正的读写数据还得依靠基本的字节流对象进行操作
- 这种需要传递底层类对象的， 又称为包装类
:::

```java
public class BufferStreamDemo {
    public static void main(String[] args) throws Exception{
        // 字节缓冲输出流：
        FileOutputStream fos = new FileOutputStream(".\\data\\buffer\\buffer.txt");
        BufferedOutputStream bos = new BufferedOutputStream(fos);
        bos.write("Hello\r\n".getBytes());
        bos.write("World\r\n".getBytes());
        // bos.flush(); // 显式刷新缓冲区
        bos.close();  // close() 内会调用 flush() 方法

        // 字节缓冲输入流：
        FileInputStream fis = new FileInputStream(".\\data\\buffer\\buffer.txt");
        BufferedInputStream bis = new BufferedInputStream(fis);
        bis.mark(1);  // 设置标记

        // 一次读取一个字节：
        int b;
        while ((b = bis.read())!= -1){
            System.out.print((char) b);
        }

        // 将输入流的指针返回到设置标记的起始处
        bis.reset();  

        // 一次读取一个字节数组：
        byte[] bys = new byte[1024];
        int len;
        while ((len = bis.read(bys)) != -1){
            System.out.println(new String(bys,0,len));
        }
        bis.close();
    }
}
```
- `BufferedInputStream`类在另一个输入流之上添加了缓冲功能。它内部维护了一个字节数组作为缓冲区。当从输入流中读取数据时，不是每次读取一个字节就进行一次底层I/O操作，而是尽可能多地预先读取数据到缓冲区中。这样，后续的读取操作就可以直接从缓冲区获取数据，减少了昂贵的I/O操作次数，提升了读取效率。此外，`BufferedInputStream`还支持`mark`和`reset`方法，允许在流中设置标记点并返回到这个标记点重新读取数据。

- `BufferedOutputStream`类则为输出操作提供了类似的缓冲机制。它同样使用一个内部缓冲区来暂存数据，当调用`write`方法时，数据并非立即写入到目标设备，而是先写入缓冲区。只有当缓冲区满或者显式调用`flush`或`close`方法时，数据才会一次性从缓冲区写出到目标文件或网络等输出设备，这大大减少了实际的I/O操作次数，提高了写入效率。




## Java字符流

Java字符流（Character Streams）是专门设计用于处理文本数据的I/O流，它们以字符（char，即16位Unicode字符）为基本单位进行读写操作，而不是字节。字符流主要用于处理文本文件或任何需要按字符编码进行转换的数据。与字节流相比，字符流更便于处理文本数据，因为它们内置了对字符编码的处理。

Java字符流的核心类位于`java.io`包中，主要包括Reader，Writer两个抽象基类及其子类：

**字符流特点**：
- **字符编码**：字符流在处理文本时会自动处理字符编码转换，例如，`FileReader/FileWriter`默认使用平台的字符编码。
- **缓冲**：`BufferedReader`和`BufferedWriter`通过添加缓冲区减少实际的I/O操作次数，提高效率。
- **转换流**：为了桥接字节流和字符流，Java提供了`InputStreamReader`和`OutputStreamWriter`，可以将字节流转换为字符流，并指定字符编码。


![](https://image.ventix.top/java/image-20220218162134606.png)

字符流在处理文本数据时提供了更为方便和高效的操作方式，特别是在需要考虑字符编码和文本格式的场景下。


```java
 // 获取当前系统编码
 System.out.println(System.getProperty("file.encoding"));
```




### 字符输入流

Java的字符输入流体系主要基于`java.io.Reader`抽象类及其众多子类实现。

**Reader类**：
`Reader`作为抽象类,是所有字符输入流的基类，它定义了一系列用于读取字符数据的方法，比如`read()`方法读取单个字符，`read(char[])`读取字符数组等。

**Reader类中的read()方法**：

| 方法名及返回值类型                      | 说明                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| int read()                              | 从输入流中读取一个字符，并把它转换为 0~65535 的整数          |
| int read(char[] cbuf)                   | 从输入流中读取若干个字符，并把它们保存到指定的字符数组中     |
| int read(char[] cbuf, int off, int len) | off 指定在字符数组中开始保存数据的起始下标，len 指定读取的字符数 |

::: info Reader常见子类
- **FileReader**：用于从文件中读取字符数据。它直接继承自`InputStreamReader`，并根据系统默认的字符编码读取文件内容。

- **BufferedReader**：在另一个字符输入流（如`FileReader`）基础上添加了缓冲功能，提高了读取效率。特别是`readLine()`方法可以方便地读取整行文本。

- **InputStreamReader**：这是一个桥接字节流到字符流的类，允许指定字符编码来读取字节流中的字符数据。常用于将`InputStream`转换为按指定编码读取的字符流。

- **StringReader**：用于从字符串中读取字符数据，将字符串作为字符源。
:::

**使用场景**：
- **文本文件处理**：当需要逐字符或按行读取文本文件时，使用`FileReader`或`BufferedReader`配合`FileInputStream`是最常见的应用场景。
- **内存数据读取**：处理程序内部的字符串数据时，可以使用`StringReader`。
- **网络和I/O操作**：结合`InputStreamReader`，可以按指定编码读取网络数据或进行其他I/O操作中的字符数据读取。


```java
// 使用FileReader读取文件
try (FileReader reader = new FileReader("example.txt")) {
    int ch;
    while ((ch = reader.read()) != -1) {
        System.out.print((char) ch);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

字符输入流简化了对文本数据的处理过程，特别是在需要考虑字符编码和文本行读取的场景下，提供了更加便捷和高效的API。




### 字符输出流

字符输出流在Java中是用来向输出目的地（如文件、网络连接、内存缓冲区等）写入字符数据的流对象。这类流基于`java.io.Writer`抽象类及其子类实现，专注于以字符为基本单位进行数据输出操作，非常适合处理文本信息。

`Writer`是所有字符输出流的基类，它定义了一系列写入字符数据的方法，如`write(char[])`用于写入字符数组，`write(String str)`用于写入字符串等。此外，还提供了`flush()`方法用于刷新缓冲区，以及`close()`方法用于关闭流并释放系统资源。


::: info 常见子类

- **FileWriter**：用于将字符数据写入文件。创建时可以指定是否追加模式，如果不指定，默认会覆盖原有文件内容。
- **BufferedWriter**：提供了一个带缓冲区的字符输出流，可以提高写入效率，特别是频繁写入小块数据时。它通常包装一个基本的字符输出流，如`FileWriter`。
- **PrintWriter**：除了基本的字符写入功能外，还提供了一些便捷的打印方法，如`println()`，可以自动添加换行符，适合于打印日志或简单文本输出。
- **CharArrayWriter**：将字符数据写入一个可增长的字符数组中，适用于需要将字符数据暂存于内存的情况。
:::



**Writer类中的write()方法和append()方法**：

| 方法名及返回值类型                           | 说明                                                       |
| -------------------------------------------- | ---------------------------------------------------------- |
| void write(int c)                            | 向输出流中写入一个字符                                     |
| void write(char[] cbuf)                      | 把字符数组中的所有字符写到输出流中                         |
| void write(char[] cbuf,int off,int len)      | off 指定 字符数组中的起始下标，len 表示元素个数            |
| void write(String str)                       | 向输出流中写入一个字符串                                   |
| void write(String str,  int off, int len)    | off 指定字符串中的起 始偏移量，len 表示字符个数            |
| append(char c)                               | 将参数 c 指定的字符添加到输出流中                          |
| append(charSequence esq)                     | 将参数 esq 指定的字符序列添加到输出流中                    |
| append(charSequence esq, int start, int end) | start 指第一个字符的索引，end 指最后一个字符后面的字符索引 |


**使用步骤**:

1. **创建输出流对象**：根据需要，创建相应的字符输出流子类实例。如使用`FileWriter`时，需要指定输出文件的路径。
2. **写入数据**：使用流对象的`write()`方法将字符数据写入到流中。数据最初会被写入到内存缓冲区中。
3. **刷新缓冲区**：调用`flush()`方法可以立即将缓冲区中的数据刷写到目标输出源，确保数据被立即写入。
4. **关闭流**：操作完成后，使用`close()`方法关闭流，这也会隐式地执行一次`flush()`操作，确保所有缓冲数据被写出，并释放系统资源。


```java
import java.io.FileWriter;
import java.io.IOException;

public class CharacterOutputStreamExample {
    public static void main(String[] args) {
        try {
            // 创建FileWriter对象，指定输出文件
            FileWriter writer = new FileWriter("output.txt");
            
            // 写入字符数据
            writer.write("这是一个使用FileWriter写入的示例文本。");
            
            // 刷新缓冲区（可选，在关闭前确保数据写入）
            writer.flush();
            
            // 关闭流
            writer.close();
            
            System.out.println("数据已成功写入文件。");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

字符输出流为处理文本输出提供了灵活且高效的方式，尤其是在处理字符编码敏感的文本文件时更为方便。

字符输入输出流综合示例：
```java
public class FileReaderDemo {
    public static void main(String[] args) throws Exception{
        FileReader fr = new FileReader(".\\data\\charstream\\a.txt");
        FileWriter fw = new FileWriter(".\\data\\charstream\\a_copy.txt");
        // int ch;
        // while ((ch = fr.read())!= -1){
        //   fw.write(ch);
        // }

        // 按数组读写
        char[] chs = new char[1024];
        int len;
        while ((len=fr.read(chs))!=-1){
            fw.write(chs,0,len);
        }
        fr.close();
        fw.close();
    }
}
```



### 字符转换流
字符转换流在Java中是用来在字节流和字符流之间进行转换的桥梁，主要用于处理文本数据时需要考虑字符编码的场合。它们使得开发者能够按字符读写数据，同时处理不同编码格式之间的转换问题。主要涉及两个核心类：`InputStreamReader`和`OutputStreamWriter`。

**InputStreamReader**：
- **作用**：`InputStreamReader`是一个连接字节流到字符流的桥梁，它将字节流解码为字符。这意味着它读取来自底层字节流的原始字节，并根据指定的字符编码将其转换为字符。这对于从字节流中正确读取文本数据特别有用，尤其是在处理非ASCII字符时。
- **使用场景**：当你需要从字节输入流（如`FileInputStream`、`ByteArrayInputStream`）中读取文本，并且关心文本的字符编码时，可以使用`InputStreamReader`并为其指定正确的字符编码。

**OutputStreamWriter**：
- **作用**：与`InputStreamReader`相反，`OutputStreamWriter`是字符流到字节流的转换器，它负责将字符数据编码为字节并写入到字节流中。这在需要将字符数据（如字符串）写入到文件或网络时非常有用，因为它允许你控制字符数据的编码方式。
- **使用场景**：当你需要将字符数据写入到字节输出流（如`FileOutputStream`、`ByteArrayOutputStream`），并且希望控制输出的字符编码时，应使用`OutputStreamWriter`。

**字符转换流特点**：
- **编码灵活性**：这两个类都允许你指定字符编码，如果不指定，则使用平台默认的字符编码。
- **转换功能**：它们不仅转换数据类型，还在必要时处理字符编码的转换，确保文本数据的正确读写。
- **结合使用**：通常，`InputStreamReader`和`OutputStreamWriter`会和文件或网络相关的字节流一起使用，形成完整的读写流程。


```java
// 从字节流读取文本并转换字符编码
try (InputStreamReader reader = new InputStreamReader(new FileInputStream("input.txt"), "UTF-8")) {
    // 读取操作
}

// 将字符流写入文件并指定编码
try (OutputStreamWriter writer = new OutputStreamWriter(new FileOutputStream("output.txt"), "UTF-8")) {
    writer.write("你好，世界！");
}
```

字符转换流是Java I/O体系中处理字符编码转换的关键工具，尤其是在国际化应用开发中，能够确保文本数据的正确处理和显示。


```java
public class CharStreamDemo {
    public static void main(String[] args) throws Exception {
        FileInputStream fis = new FileInputStream(".\\data\\charstream\\a.txt");
        FileOutputStream fos = new FileOutputStream(".\\data\\charstream\\a.txt");
        InputStreamReader isr = new InputStreamReader(fis);
        OutputStreamWriter osw = new OutputStreamWriter(fos);

        // 多种写入方式
        osw.write(97);                        //写入一个字符 a  相当于：osw.write('a');
        osw.append('b');
        osw.write("abc");                    // 写入字符串
        osw.write("uvwxyz", 0, 3);   // off 指定字符串中的起始偏移量，len表示字符个数
        osw.flush();
        //写入字符数组：
        char[] chs = {'x', 'y', 'z'};
        osw.write(chs);                        // 把字符数组中的所有字符写到输出流中
        osw.write(chs, 0, 2);
        osw.close();

        //  一次读一个字符数据
        /*int ch;
        while ((ch = isr.read()) != -1) {
            System.out.print((char) ch);
        }*/

        // 一次读取一个字符数组数据
        char[] chsArr = new char[1024];
        int len;
        while ((len = isr.read(chsArr)) != -1) {
            System.out.println(new String(chsArr, 0, len));
        }
    }
}
```



### 字符缓冲流

字符缓冲流是基于字符流（如Reader和Writer）的缓冲版本，主要类包括`BufferedReader`和`BufferedWriter`。字符缓冲流以字符为处理单位，适用于处理文本数据

```java
// 构造函数
public BufferedReader(Reader in)
public BufferedWriter(Writer out)
```
字符缓冲流，即`BufferedReader`和`BufferedWriter`，在Java I/O编程中提供了增强的读写能力，尤其在处理文本数据时非常有用。下面是这两个类中一些常用方法的简介：


**缓冲字符输入流常用方法**：
- **read()**：读取一个字符，返回该字符的int值（注意：若达到文件末尾，则返回-1）。
- **read(char[] cbuf)**：将字符读入数组cbuf中，返回实际读取的字符数。
- **readLine()**：读取一行文本并返回字符串，不包括任何终止符，如换行符。如果已到达流末尾，则返回null。
- **mark(int readAheadLimit)**：在输入流中标记当前位置，允许在后续调用`reset()`时返回到此位置。`readAheadLimit`参数指定了在标记后可以读取多少字符而不影响重置操作的有效性。
- **reset()**：将读取位置重置到上一个标记的位置。
- **skip(long n)**：跳过输入流中的n个字符。
- **close()**：关闭该流并释放与之关联的所有系统资源。


**缓冲字符输出流常用方法**：
- **write(int c)**：写入单个字符。
- **write(char[] cbuf)**：写入字符数组。
- **write(char[] cbuf, int off, int len)**：写入字符数组的一部分，off指定起始索引，len指定要写的字符数。
- **write(String str)**：写入整个字符串。
- **write(String str, int off, int len)**：写入字符串的一部分。
- **newLine()**：写入一个行分隔符，适用于当前操作系统。
- **flush()**：强制将缓冲区的内容全部写入到输出流中，但不关闭流。
- **close()**：关闭该流并释放系统资源，关闭之前会先调用`flush()`。


```java
public class BufferedReaderDemo {
    public static void main(String[] args) throws Exception{
        FileWriter fw = new FileWriter(".\\data\\charstream\\b.txt");
        BufferedWriter bw = new BufferedWriter(fw);
        for (int i = 0; i < 10; i++) {
            bw.write("Hello" + i);
            bw.newLine();   // 相当于 bw.write("\r\n");
            // bw.flush();
        }
        bw.close();

        FileReader fr = new FileReader(".\\data\\charstream\\b.txt");
        BufferedReader br = new BufferedReader(fr);
        // int ch;
        // while ((ch=br.read())!=-1){
        //    System.out.print((char) ch);
        // }

        // char[] chs = new char[1024];
        // int len;
        // while ((len=br.read(chs))!=-1){
        //    System.out.println(new String(chs, 0, len));
        // }

        // readLine() 读取一行数据（不包含换行符）
        String line;
        while ((line = br.readLine()) != null) {
            System.out.println(line);
        }
    }
}
```



### 缓冲流和flush

缓冲字节流和字符流都使用了缓冲区，详细如下：

![](https://image.ventix.top/java/image-20220219135347553.png)

【注】flush方法的使用说明：

- 调用close()方法时会自动flush, 在不调用close()的情况下，缓冲区不满，又需要把缓冲区的内容写入到文件或通过网络发送到别的机器时，才需要调用flush();

- FileInputStream的 flush()是继承于其父类OutputStream的，但是OutputStream类的flush()什么都没做。

- 当OutputStream是BufferedOutputStream时，BufferedOutputStream中重写了flush()方法，并在其中调用了flushBuffer()方法以及OutputStream的flush()方法


::: tip 字符缓冲流与字节缓冲流的区别
虽然字符流缓冲区大小和字节流缓冲区一样是一个 8192 的常量，但是真正存储数据的 数组的数据类型 并不相同
- 字节流缓冲区的单位是 byte ，`protected volatile byte buf[]; ` 故其缓冲区实际大小为 8kb
- 字符流缓冲区的单位是 char ，`private char cb[]; ` 故其缓冲区实际大小为 16kb
:::




## 其他常用流

### 数据流(Data)

数据流用于处理基本Java数据类型（如int、double、char等）的读取和写入操作。`DataInputStream`和`DataOutputStream`这两个类提供了与机器无关的方式来进行数据的序列化和反序列化，使得数据可以在不同平台间传输时保持一致性和可读性。

![](https://image.ventix.top/java/image-20220219150027978.png)

- DataOutputStream

`DataOutputStream`允许程序以适当的方式将基本的Java数据类型写入输出流中。它通常被用来序列化数据，即将内存中的数据结构转换成字节流，以便存储或通过网络传输。

::: tip 
使用`DataOutputStream`写入的数据类型在读取时==必须按照相同的顺序==使用`DataInputStream`读取，以保证数据的正确解析。
:::

  ```java
  // 构造方法
  DataOutputStream(OutputStream out)        
  // 创建一个新的数据输出流，将数据写入指定基础输出流
  ```

  ```java
  // 成员方法
  // 每个java基本数据类型 都有1个write方法与之对应 比如
      DataOutputStream dos = new DataOutputStream(new FileOutputStream("dos.txt"));
      dos.writeByte(1);
      dos.writeShort(20);
      dos.writeInt(300);
      dos.writeLong(4000);
      dos.writeFloat(12.34f);
      dos.writeDouble(12.56);
      dos.writeChar('a');
      dos.writeBoolean(true);
      dos.writeUTF("Hello");    // 写入一个字符串(以UTF格式编码)
      dos.close();
  ```

  

- DataInputStream

`DataInputStream`允许程序以与机器无关的方式从底层输入流中读取基本的Java数据类型。它常用于与`DataOutputStream`配对使用，读取之前写入的数据。

  ```java
  DataInputStream(InputStream in)        
  // 使用指定的底层 InputStream 创建一个 DataInputStream
  ```

  **成员方法**

  每个java基本数据类型都有1个read方法与之对应， 如 readInt() ...

  


### 对象流(Object)

对象流又称序列化、反序列化流。

- 序列化: 把对象数据,转为二进制数据,持久化存储的过程 （即把Java对象转换为字节序列的过程）

- 反序列化: 把二进制数据还原为对象数据 （即把字节序列恢复为Java对象的过程）


::: info Serializable接口和transient关键字
实现Java对象的序列化只要将类实现标识接口——Serializable接口即可，不需要重写任何方法

- **Serializable是1个空接口, 想要实现序列化功能, 须实现该接口(空接口), 起标记作用** 

- **transient** 关键字：用于指定不需要序列化的对象属性

将不需要序列化的属性前添加关键字transient，序列化对象的时候，这个属性就不会序列化

  ```java
  class Student implements Serializable {
      transient String name; // 不会被序列化
      // ... other fields
  }
  ```
:::


![](https://image.ventix.top/java/image-20220219145224024.png)

- **ObjectOutputStream**

  ObjectOutputStream 将 Java 对象的基本数据类型和图形写入 OutputStream

  *构造方法* 

  ```java
  ObjectOutputStream(OutputStream out)       
  // 创建写入指定 OutputStream 的 ObjectOutputStream
  ```

  *成员方法* 

  ```java
  writeObject(Object obj)       
  // 将指定的对象写入 ObjectOutputStream。
  ```

  

- **ObjectInputStream** 

  ObjectInputStream 对以前使用 ObjectOutputStream 写入的基本数据和对象进行反序列化

  *构造方法* 

  ```java
  ObjectInputStream(InputStream in)      
  //  创建从指定 InputStream 读取的 ObjectInputStream
  ```

  *成员方法* 

  ```java
  readObject()      //  从 ObjectInputStream 读取对象
  ```

对象序列化和反序列化工具类示例:
```java
public class IOUtils {
	// Java序列化（将java对象序列化并存储到硬盘）
    public static void writeFile(Object obj, String fileName) {
        try (FileOutputStream fileOutputStream = new FileOutputStream(fileName);
             ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream)) {
            objectOutputStream.writeObject(obj);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
	// Java反序列化
    public static Object readFile(String fileName) {
        try (FileInputStream fileInputStream = new FileInputStream(fileName);
             ObjectInputStream objectInputStream = new ObjectInputStream(fileInputStream)) {
            return objectInputStream.readObject();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

【注意】

- `java.io.NotSerializableException` 异常表示  对象没有实现Serializable接口

- `java.io.InvalidClassException:  xxxxx local class incompatible: stream classdesc serialVersionUID = -8449572629204967338, local class serialVersionUID = 5807530389656511599`   
    表示 **serialVersionUID不匹配**   （一般是使用了不一样的类，或修改了相应的类定义 导致的） 可以可以通过显示声明方式解决

```java
public class Student implements Serializable{
    static final long serialVersionUID = -8449572629204967338l;
    // ...
}
```





### 打印流(Print)

Java中的打印流（`PrintStream`和`PrintWriter`）分别是`OutputStream`和`Writer`类的子类，分别为处理字节输出和字符输出提供了更高级别的抽象。它们简化了数据的输出操作，特别是对于文本数据，支持直接打印各种数据类型而无需进行类型转换，是进行文本输出的便利工具。

![](https://image.ventix.top/java/image-20220219145810616.png)


::: info 打印流的特点
- 只能操作目的地，不能操作数据来源。即只有输出流,没有1个与之对应的输入流

- 可以操作任意类型的数据。把不同类型的数据转为字符串

- 如果启动了自动刷新，能够自动刷新（但只有在调用 `println`、`printf` 或 `format`  的其中一个方法时才可以）
:::


**PrintStream（字节打印流）**

`PrintStream`是`OutputStream`的子类，专为输出操作设计，可以将文本数据（经过字符编码转换为字节）输出到文件、控制台或其他输出目标。

  - **便捷的打印方法**：提供`print()`和`println()`方法，可以直接输出各种数据类型，包括基本类型、对象和字符串，且`println()`会在每个输出之后自动添加换行符。
  - **错误静默处理**：默认情况下，`PrintStream`不会抛出`IOException`，而是将错误信息直接输出到标准错误流，这使得程序逻辑可以简化，但可能隐藏了潜在的I/O问题。
  - **重定向输出**：可以使用`System.setOut(PrintStream out)`方法改变`System.out`的输出目的地，从而改变标准输出的位置。
  - **编码处理**：所有字符都会使用平台的默认字符编码转换为字节输出。

::: info PrintStream构造方法
  - `PrintStream(OutputStream out)`：基于一个存在的字节输出流创建打印流。
  - `PrintStream(String fileName)`：根据指定的文件名创建打印流，直接写入文件。
  - `PrintStream(File file)`：类似于上面，直接针对`File`对象创建打印流。
:::



**PrintWriter（字符打印流）**:

`PrintWriter`是`Writer`的子类，专为字符输出设计，提供比`PrintStream`更直接的字符处理能力，适合文本数据的输出。

  - **字符操作**：直接处理字符数据，避免了字节到字符的转换步骤，适合文本处理。
  - **自动刷新**：可以通过构造函数参数设置是否自动刷新缓冲区，当缓冲区满或者调用`flush()`、`close()`方法时会刷新。
  - **错误处理**：同样可以选择是否抛出`IOException`，提供了更灵活的错误管理方式。
  
::: info PrintWriter构造方法
  - `PrintWriter(OutputStream out)`：基于一个存在的字节输出流创建打印流。
  - `PrintWriter(String fileName)`：根据指定的文件名创建打印流，直接写入文件。
  - `PrintWriter(File file)`：直接针对`File`对象创建打印流。

构造方法允许设置是否自动刷新缓冲区，如:
`PrintWriter(OutputStream out, boolean autoFlush)`
:::

**使用场景**:
- **日志记录**：在记录日志时，使用`PrintWriter`或`PrintStream`可以直接打印出信息，方便快捷。
- **控制台输出**：`System.out`默认就是一个`PrintStream`实例，通常用于程序的标准输出。
- **文件写入**：直接写入文本文件，特别是在处理文本报告、配置文件生成等场景。
- **网络通信**：在发送文本数据到网络时，可以通过将`PrintStream`或`PrintWriter`与网络输出流结合，简化数据发送逻辑。





 ### 系统流(System)   

Java中的系统流是指由`java.lang.System`类封装的三个预定义的流对象，它们代表了程序的标准输入、标准输出和标准错误流。这三个流对象分别是：
  - `System.in`：标准输入流，默认设备是键盘  （是 InputStream 类的一个对象） 
  - `System.out`：标准输出流，默认设备是控制台（屏幕）（是 PrintStream 类的对象） 
  - `System.err`：标准错误流，默认设备是控制台（屏幕）（是 PrintStream 类的对象） 

  ```java
  public final static InputStream in = null;
  public final static PrintStream out = null;
  public final static PrintStream err = null;
  ```


1. **Standard Input (标准输入流) - `System.in`**
   - 类型：`InputStream`
   - 用途：用于读取从标准输入设备（通常是键盘）输入的数据。它是字节流，可以被包装成字符流如`BufferedReader`以便于读取文本行。
     ```java
     BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
     String input = reader.readLine();
     System.out.println("You entered: " + input);
     ```

2. **Standard Output (标准输出流) - `System.out`**
   - 类型：`PrintStream`
   - 用途：用于向标准输出设备（通常是显示器的终端或控制台）输出数据。`PrintStream`是一个增强版的输出流，支持自动处理多种数据类型的输出，并且可以自动进行字节到字符的编码转换。
     ```java
     System.out.println("Hello, World!");
     ```

3. **Standard Error (标准错误流) - `System.err`**
   - 类型：`PrintStream`
   - 用途：用于输出错误信息或调试信息，同样默认输出到控制台，但通常与标准输出流分开，便于区分正常输出和错误信息。开发者可以独立控制其输出目的地和格式。
     ```java
     System.err.println("An error occurred!");
     ```
<br>

例：将标准输出（`System.out`）重定向到一个文件中，同时将标准错误（`System.err`）也重定向到同一个文件中，实现两者混合输出到同一文件的目标。

请注意，实际操作前请确保你有权限写入目标文件，并且理解重定向可能会覆盖原有文件内容。

```java
import java.io.*;

public class RedirectSystemStreamsExample {
    public static void main(String[] args) throws IOException {
        // 创建FileOutputStream实例，指向我们想要重定向输出的文件
        FileOutputStream fileOutputStream = new FileOutputStream("output.txt");
        
        // 使用PrintStream包装FileOutputStream，以便支持打印方法
        PrintStream printStream = new PrintStream(fileOutputStream);
        
        // 重定向标准输出到新创建的PrintStream
        System.setOut(printStream);
        
        // 同样，重定向标准错误到相同的PrintStream
        System.setErr(printStream);
        
        // 现在，所有的System.out.println和System.err.println都将写入到"output.txt"
        System.out.println("This is a standard output message.");
        System.err.println("This is an error message.");
        
        // 完成后，最好刷新并关闭流，尽管在程序结束时JVM通常会尝试关闭它们
        printStream.flush();
        printStream.close();
    }
}
```

在这个例子中，标准输出和错误输出都被重定向到了名为`output.txt`的文件中。当你运行这个程序后，打开`output.txt`文件，你应该能看到这两条消息混合在一起的内容。这种方式对于日志记录或调试非常有用，因为它允许你集中查看程序的所有输出，无论是正常的还是错误的信息。






## IO资源释放

方式一：直接释放（较为繁琐）

```java
public static void byteArrayTofile(byte[] src,String filePath){
    InputStream is = null;
    FileOutputStream os = null;
    try {
        is = new ByteArrayInputStream(src);
        os = new FileOutputStream(dest);
		// 一系列的IO流操作 ...... 
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }finally{     
        try {
            if (null != os) {
                os.close();
            } 
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```



方拾二：利用函数可变参数，可关闭多个流，更灵活

```java
public static void close2(Closeable...ios){    
    for(Closeable io:ios){
        try {
            if(null!=io){  
                io.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```



方式三：try…with…resource

jdk1.7之后可以不用手动释放资源，将声明与初始化写入 try () 中，删去 finally { } ，自动释放系统资源

```java
try (InputStream is = new FileInputStream("abc.txt");
     OutputStream os = new FileOutputStream("abc_copy.txt");) {
    // 具体IO操作
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
	}
```







## Properties

Properties类主要用于读取Java的配置文件，在Java中，其配置文件常为.properties文件，格式为文本文件，文件的内容的格式是“键=值”的格式，文本注释信息可以用"#"来注释。

```java
public class Properties extends Hashtable<Object,Object> 
```

- Properties是一个Map体系的集合类 
- Properties可以保存到流中或从流中加载 
- 属性列表中的每个键及其对应的值都是一个字符串

| 方法名称                                   | 说明                                 |
| ------------------------------------------ | ------------------------------------ |
| getProperty ( String key)                  | 获取key 所对应的 value               |
| setProperty ( String key, String value)    | 调用 Hashtable 的put方法来设置键值对 |
| load ( InputStream inStream)               | 从输入流中读取属性列表（键和元素对） |
| store ( OutputStream out, String comments) | 将键值对写入到指定的文件中去         |
| clear ()                                   | 清除所有的键值对                     |

```java
// Properties类的简单使用：
Properties properties = new Properties();
properties.setProperty("username", "admin");
properties.put("password", "123");

Set<Object> keySet = properties.keySet();
for (Object key : keySet) {
    System.out.println(properties.get(key));
    System.out.println(properties.getProperty((String)key));
}
```



**Properties和IO流相结合的方法**：

| 方法名                                        | 说明                                                 |
| --------------------------------------------- | ---------------------------------------------------- |
| void load(InputStream inStream)               | 从输入字节流读取属性列表                             |
| void load(Reader reader)                      | 从输入字符流读取属性列表                             |
| void store(OutputStream out, String comments) | 适合于使用 load(InputStream)方法的格式写入输出字节流 |
| void store(Writer writer, String comments)    | 适合使用 load(Reader)方法的格式写入输出字符流        |

```java
Properties prop = new Properties();
FileReader fileReader = new FileReader(".\\data\\prop.txt");
FileWriter fileWriter = new FileWriter(".\\data\\prop.txt");

prop.setProperty("username", "admin");
prop.put("password", "123");
// 写入文件
prop.store(fileWriter, "user");
fileWriter.close();

// 从文件中读取
Properties properties = new Properties();
properties.load(fileReader);
fileReader.close();
System.out.println(properties);
```





## RandomAccessFile

RandomAccessFile 类支持 “随机访问” 的方式，RandomAccessFile 对象包含一个记录指针，用以标示当前读写处的位置，程序可以直接跳到文件的任意位置来读、写文件 

| *构造方法*                                                   |
| ------------------------------------------------------------ |
| RandomAccessFile(File file, String mode)        创建从中读取和向其中写入（可选）的随机访问文件流，该文件由 File 参数指定。 |
| RandomAccessFile(String name, String mode)        创建从中读取和向其中写入（可选）的随机访问文件流，该文件具有指定名称。 |

创建 RandomAccessFile 类实例需要指定一个 mode 参数，该参数指 定 RandomAccessFile 的访问模式(介绍2种常用的)：

- `r`: 以只读方式打开(不会创建文件,读取已经存在的文件)
- `rw`:可读可写(文件不存在会创建,存在不会创建) 



*成员方法*：

除了常规的read write方法外， RandomAccessFile 类对象还有自由移动记录指针的相关方法： 

- long getFilePointer()：获取文件记录指针的当前位置 
- void seek(long pos)：将文件记录指针定位到 pos 位置



随机读写示例：

```java
package cn.itdrizzle.javase.p19.demo;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.charset.StandardCharsets;

/**
 * @Classname RandomAccessFileDemo
 * @Description 向文件中指定位置插入数据
 */
public class RandomAccessFileDemo {
    public static void main(String[] args) {
        try (final RandomAccessFile raf = new RandomAccessFile("temp\\test\\raf.txt", "rw")) {
            // 先向文件中写入一些数据
            raf.write("abcdef".getBytes(StandardCharsets.UTF_8));
            System.out.println("写入数据后，FilePointer：" + raf.getFilePointer());

            // 指定插入的位置
            raf.seek(3);
            System.out.println("指定插入位置后，FilePointer：" + raf.getFilePointer());

            // 现将插入点后的数据暂存起来
            final StringBuffer temp = new StringBuffer();
            final byte[] bytes = new byte[1024];
            int len;
            while ((len = raf.read(bytes)) != -1) {
                temp.append(new String(bytes, 0, len));
            }
            System.out.println("读数据后，FilePointer：" + raf.getFilePointer());

            // 移动指针到插入位置
            raf.seek(3);
            System.out.println("重新指定插入位置后，FilePointer：" + raf.getFilePointer());
            // 插入新的数据
            raf.write("xyz2333".getBytes());
            // 之前的数据重写回
            raf.write(temp.toString().getBytes());
            System.out.println("最后的位置，FilePointer：" + raf.getFilePointer());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

![](https://image.ventix.top/java/image-20220222085601424.png)







## File文件和目录

File类是文件和目录路径名的抽象表示，文件和目录都可以通过File封装成对象，对于File而言，其封装的并不是一个真正存在的文件，仅仅是一个路径名而已。它可以是存在的，也可以是不存在的。将来可以通过具体的操作把这个路径的内容转换为具体存在

- File 类是 java.io 包中唯一代表磁盘文件本身的对象
- File 类不能访问文件内容本身，如果需要访问文件内容本身，则需要使用输入/输出流

| 构造方法                          | 说明                                                       |
| --------------------------------- | ---------------------------------------------------------- |
| File(String pathname)             | 通过将给定的路径名字符串转换为抽象路径名来创建新的File实例 |
| File(String parent, String child) | 从父路径名字符串和子路径名字符串创建新的File实例           |
| File(File parent, String child)   | 从父抽象路径名和子路径名字符串创建新的File实例             |

```java
File dataDir = new File(".\\data");
File file1 = new File(dataDir, "a.txt");
File file2 = new File(".\\data\\b.txt");
```



### File常用方法

**创建、删除文件/目录**：

| 方法名称                       | 说明                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| public boolean createNewFile() | 当文件不存在时，创建一个空文件                               |
| boolean mkdir()                | 创建一个目录，它的路径名由当前 File 对象指定                 |
| boolean mkdirs()               | 创建一个目录，它的路径名由当前 File 对象指定                 |
| boolean delete()               | 删除当前对象指定的文件或空目录                               |
| boolean renameTo(File)         | 将当前 File 对象指定的文件更名为给定参数 File 指定的路径名（剪贴） |

- 如果被重命名的文件已存在，那么renameTo()不会成功
- renameTo()成功后，原文件会被删除

```java
if (!dataDir.exists()) dataDir.mkdir();
if(!file1.exists()) file1.createNewFile();
```



**File类相关判断方法**：

| 方法名称              | 说明                                             |
| --------------------- | ------------------------------------------------ |
| boolean exists()      | 测试当前 File 是否存在                           |
| boolean isAbsolute()  | 测试当前 File 对象表示的文件是否为一个绝对路径名 |
| boolean isDirectory() | 测试当前 File 对象表示的文件是否为一个路径       |
| boolean isFile()      | 测试当前 File 对象表示的文件是否为一个“普通”文件 |
| boolean canRead()     | 测试应用程序是否能从指定的文件中进行读取         |
| boolean canWrite()    | 测试应用程序是否能写当前文件                     |



**File类相关的获取功能**：

| 方法名称                      | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| String getAbsolutePath()      | 返回由该对象表示的文件的绝对路径名                           |
| String getPath()              | 返回构造file时候的路径                                       |
| String getName()              | 返回表示当前对象的文件名或路径名（如果是路径，则返回最后一级子路径名） |
| String getParent()            | 返回当前 File 对象所对应目录（最后一级子目录）的父目录名     |
| long lastModified()           | 返回当前 File 对象表示的文件最后修改的时间                   |
| long length()                 | 返回当前 File 对象表示的文件长度                             |
| String[] list()               | 返回当前 File 对象指定的路径文件列表                         |
| String[] list(FilenameFilter) | 返回当前 File 对象指定的目录中满足指定过滤器的文件列表       |

【注】因为 `getPath()` 得到的是构造file的时候的路径，如果构造的时候就是全路径那直接返回全路径，如果构造的时候为相对路径，返回的就是构造file时候的路径

```java
public class FileDemo {
    public static void main(String[] args) {
        File file = new File("..\\temp\\a.txt");
        System.out.println(file.getPath());
        System.out.println(file.getAbsolutePath());

        File file1 = new File("E:\\WorkPlace\\Java\\Demo\\temp");
        System.out.println("\n" + file1.getPath());
        System.out.println(file1.getAbsolutePath() + "\n");
    }
}
```

![](https://image.ventix.top/java/image-20220217202032863.png)



### 文件过滤器

**文件过滤器** `FileFilter` 的三种应用方式： 

- 手写实现类
- 匿名内部类
- lambda表达式

```java
// 通过匿名内部类和Lambda表达式过滤文件
public class ListFileDemo {
    public static void main(String[] args) {
        File file = new File("app2");

        // 匿名内部类
        File[] f1 = file.listFiles(new FileFilter() {
            @Override
            public boolean accept(File pathname) {
                // 仅留下文件夹名包括a的文件夹
                return pathname.isDirectory() && pathname.getName().contains("a");
            }
        });

        // Lambda表达式, 仅留下.txt结尾的文本文件
        File[] f2 = file.listFiles(f -> f.isFile() && f.getName().endsWith(".txt"));
    }
}
```



【注】**File 类中有以下两个常用常量**：（File 类出现较早，当时并没有对命名规范有严格的要求）

- `pathSeparator`：分隔连续多个路径字符串的分隔符
- `separator`：目录分隔符

```java
public static final String pathSeparator //Windows下指`;`
public static final String separator     //Windows下指`/`
```



---

order: 80
title: 虚拟机字节码

---


Java字节码是Java程序在编译后的中间表示形式，它由JVM解释执行或即时编译为机器码。理解和操作字节码可以让我们更深入地了解Java程序的执行过程，同时也提供了在运行时修改和优化代码的强大工具。通过使用像ASM这样的库，开发人员可以获得对字节码级细节的完全控制，从而实现更高级别的代码定制和优化。


## Java字节码

### javac/javap

当使用`javac`命令编译Java源代码时，编译器会将`.java`源文件转换成`.class`字节码文件。

```bash
javac SimpleClass.java
```

`SimpleClass.class`文件的内容本质上是一系列的字节码指令和元数据，这是Java虚拟机（JVM）用来执行程序的低级表示。需要注意的是 **`SimpleClass.class`** 是二进制格式的，包含了字节码指令和元数据，直接阅读非常困难，而且需要特殊的工具才能解析。

::: details `.class`文件的包括如下内容：
1. **魔数（Magic Number）** - 占用4个字节，通常是`0xCAFEBABE`，用于标识这是一个有效的字节码文件。
2. **次要版本号（Minor Version）** - 占用2个字节，表示字节码文件的次要版本。
3. **主要版本号（Major Version）** - 占用2个字节，表示字节码文件的主要版本，这决定了字节码的兼容性。
4. **常量池表计数器（Constant Pool Count）** - 占用2个字节，表示常量池中条目的数量。
5. **常量池（Constant Pool）** - 一系列的常量条目，包括类名、接口名、字段名、方法名、字符串、整数、浮点数等，以及对这些常量的引用。
6. **访问标志（Access Flags）** - 占用2个字节，表示类或接口的访问权限和特性。
7. **此类的类索引（This Class Index）** - 占用2个字节，指向常量池中表示当前类的全限定名的条目。
8. **超类的类索引（Superclass Index）** - 占用2个字节，指向常量池中表示超类的全限定名的条目（对于接口则为`0`）。
9. **接口索引集合（Interfaces）** - 包含一系列接口的索引，每个索引指向常量池中的接口全限定名。
10. **字段表集合（Fields）** - 描述类的所有字段。
11. **方法表集合（Methods）** - 描述类的所有方法，每个方法包含其属性、代码、异常表等。
12. **属性表集合（Attributes）** - 提供额外的信息，如源文件名、局部变量表、代码行号映射等。
:::


<br/>

`javap`主要用于分析和学习字节码，输出的是字节码指令的描述。`javap`会解析`.class`文件中的字节码和元数据，并将其转换为人类可读的格式。具体来说：

- `-c`选项用于显示每个方法的字节码指令。
- `-v`选项可以显示更多的细节，包括常量池、访问标志等。

```bash
javap -c -v SimpleClass
```

总之，==`.class`文件是机器可读的字节码文件，而`javap`命令则是将这些字节码转换成人可读的文本格式，帮助开发者理解和调试==。

除了javap以外，还可以使用 **jclasslib Bytecode Viewer** 插件（IDEA）: 这个工具也是主要用来查看和分析字节码的，对于理解字节码指令非常有用。

<br/>

要将字节码完全反编译回接近原始的Java源代码，需要使用更高级的反编译工具。
::: details 反编译及反编译工具

字节码反编译是指将已经编译成字节码（`.class`文件）的程序恢复成接近原始源代码的过程。这个过程对于理解和修改已有的代码、逆向工程、调试和学习编译原理等方面非常有用。

#### 字节码反编译过程

1. **读取字节码文件**：反编译工具首先会读取`.class`文件，解析其中的元数据和字节码指令。

2. **解析元数据**：元数据包含了类的结构、方法签名、字段等信息，这些信息有助于重构类和方法的定义。

3. **解析字节码指令**：字节码指令是程序的具体实现部分，反编译工具会尝试理解每条指令的作用，重建控制流和数据流。

4. **重构源代码**：反编译工具将字节码指令转换为高级语言的语句，这通常涉及到推测变量名、类型、循环和条件语句等。

5. **恢复代码结构**：重构的代码需要有清晰的结构，反编译工具会尽力恢复原始的类结构、方法体和变量声明。

6. **后处理**：最后，工具会对生成的代码进行清理，去除冗余和不完整的部分，使代码更易于阅读和理解。

#### 常见的字节码反编译工具

- **JD-GUI**: 这是一个图形界面的Java反编译工具，能够显示反编译后的源代码，但有时可能无法完全恢复所有的代码细节。

- **DJ Java Decompiler**: 相对于JD-GUI，这个工具在反编译准确性上表现更好，尤其是在复杂的代码结构上。

- **CFR**: 一个开源的Java反编译器，以其高质量的反编译结果而著称，特别擅长处理复杂的代码结构。

- **Procyon**: 这是一个多用途的Java工具包，包含了一个高效的反编译器。

- **FernFlower**: 这是 IntelliJ IDEA 和 Eclipse 插件中内置的反编译器，也是相当强大的工具。
:::



### 字节码文件

使用 `javac` 编译后的字节码文件是供 虚拟机 使用的二进制文件，我们无法直接阅读，通常需要使用 `javap` 命令来获取易于理解的文本格式。

以下面的代码为例：
```java
public class SimpleClass {
    public static final String NAME = "Tom";
    private int value;

    public SimpleClass(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
```

使用 `javac SimpleClass.java` 编译后获得了 `SimpleClass.class` 文件，再使用 `javap -c -v SimpleClass` 即可获取可阅读的文本，如下：

::: details SimpleClass.class文件内容(经过javap处理后的文本)：
```bash
Classfile /Users/xxx/workplace/demo/src/SimpleClass.class
  Last modified Jul 9, 2024; size 375 bytes
  SHA-256 checksum da094ea9a9b57aec8f527511b5a05301e5ad12292678f6c9bb0e2ca50080b2eb
  Compiled from "SimpleClass.java"
public class SimpleClass
  minor version: 0
  major version: 65
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #8                          // SimpleClass
  super_class: #2                         // java/lang/Object
  interfaces: 0, fields: 2, methods: 2, attributes: 1
Constant pool:
   #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
   #2 = Class              #4             // java/lang/Object
   #3 = NameAndType        #5:#6          // "<init>":()V
   #4 = Utf8               java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = Fieldref           #8.#9          // SimpleClass.value:I
   #8 = Class              #10            // SimpleClass
   #9 = NameAndType        #11:#12        // value:I
  #10 = Utf8               SimpleClass
  #11 = Utf8               value
  #12 = Utf8               I
  #13 = Utf8               NAME
  #14 = Utf8               Ljava/lang/String;
  #15 = Utf8               ConstantValue
  #16 = String             #17            // Tom
  #17 = Utf8               Tom
  #18 = Utf8               (I)V
  #19 = Utf8               Code
  #20 = Utf8               LineNumberTable
  #21 = Utf8               getValue
  #22 = Utf8               ()I
  #23 = Utf8               SourceFile
  #24 = Utf8               SimpleClass.java
{
  public static final java.lang.String NAME;
    descriptor: Ljava/lang/String;
    flags: (0x0019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL
    ConstantValue: String Tom

  public SimpleClass(int);
    descriptor: (I)V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=2, args_size=2
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: aload_0
         5: iload_1
         6: putfield      #7                  // Field value:I
         9: return
      LineNumberTable:
        line 5: 0
        line 6: 4
        line 7: 9

  public int getValue();
    descriptor: ()I
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #7                  // Field value:I
         4: ireturn
      LineNumberTable:
        line 10: 0
}
SourceFile: "SimpleClass.java"
```
:::

下面是对`SimpleClass.class`文件字节码信息的详细解读:

```bash
# Classfile Information:
Classfile /Users/xxx/workplace/demo/src/SimpleClass.class   # .class文件的路径
  Last modified Jul 9, 2024; size 375 bytes  # 文件最后修改时间和大小
  SHA-256 checksum da094ea9a9b57aec8f527511b5a05301e5ad12292678f6c9bb0e2ca50080b2eb  
  # 文件的SHA-256校验和，用于验证文件的完整性和一致性。

# Class Metadata:
public class SimpleClass                      # 类名为SimpleClass，且它是公共的。
  minor version: 0                            # 次要版本号，通常为0。
  major version: 65                           # 主要版本号，对应到JDK 17。
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER       # 类的标志位，
  # ACC_PUBLIC表示类是公共的，ACC_SUPER表示它使用了super关键字。

# Class Structure:
  this_class: #8                 # 当前类的引用，在常量池中的索引。
  super_class: #2                # 超类的引用，在常量池中的索引，这里是java.lang.Object。

# Interface Information: (None in this case)
  interfaces: 0                                # SimpleClass没有实现任何接口。

# Field and Method Counts:
  fields: 2                                    # SimpleClass有两个字段。
  methods: 2                                   # SimpleClass有两个方法。
  attributes: 1                                # SimpleClass有一个属性。

# Constant Pool:
  #1 = Methodref          #2.#3               # Object类的构造函数引用。
  #2 = Class              #4                  # 对java.lang.Object类的引用。
  #3 = NameAndType        #5:#6               # Object构造函数的名字和类型描述符。
  #4 = Utf8               java/lang/Object    # UTF-8编码的java.lang.Object字符串。
  #5 = Utf8               <init>              # 构造函数的特殊名字。
  #6 = Utf8               ()V                 # 构造函数的参数类型和返回类型描述符，
                                                # 空括号表示无参数，V表示void。
  #7 = Fieldref           #8.#9               # SimpleClass类的value字段引用。
  #8 = Class              #10                 # 对SimpleClass类的引用。
  #9 = NameAndType        #11:#12             # value字段的名字和类型描述符。
  #10 = Utf8              SimpleClass         # UTF-8编码的SimpleClass字符串。
  #11 = Utf8              value               # value字段的名字。
  #12 = Utf8              I                   # value字段的类型描述符，I表示int。
  #13 = Utf8              NAME                # NAME字段的名字。
  #14 = Utf8              Ljava/lang/String;  # NAME字段的类型描述符，表示String类型。
  #15 = Utf8              ConstantValue       # ConstantValue属性的UTF-8编码。
  #16 = String            #17                 # String常量“Tom”的引用。
  #17 = Utf8              Tom                 # UTF-8编码的字符串“Tom”。
  #18 = Utf8              (I)V                # SimpleClass构造函数的参数和返回类型描述符
  #19 = Utf8              Code                # Code属性的UTF-8编码。
  #20 = Utf8              LineNumberTable     # LineNumberTable属性的UTF-8编码。
  #21 = Utf8              getValue            # getValue方法的名字。
  #22 = Utf8              ()I                 # getValue方法的参数和返回类型描述符。
  #23 = Utf8              SourceFile          # SourceFile属性的UTF-8编码。
  #24 = Utf8              SimpleClass.java    # SimpleClass.java文件的UTF-8编码。

# Fields:
{
  public static final java.lang.String NAME;  # 声明了一个公共的String静态常量字段NAME
    descriptor: Ljava/lang/String;                     # 字段的数据类型描述符。
    flags: (0x0019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL  # 字段的标志位，
    # ACC_PUBLIC表示公共，ACC_STATIC表示静态，ACC_FINAL表示最终不可变。
    ConstantValue: String Tom                          # NAME字段的值是“Tom”。

  private int value;                    # 声明了一个私有的int字段value。
    descriptor: I                       # 字段的数据类型描述符。
    flags: (0x0002) ACC_PRIVATE         # 字段的标志位，ACC_PRIVATE表示私有。
}

# Methods:
{
  public SimpleClass(int);            # SimpleClass的构造函数，接受一个int参数。
    descriptor: (I)V                  # 构造函数的参数和返回类型描述符。
    flags: (0x0001) ACC_PUBLIC        # 方法的标志位，ACC_PUBLIC表示公共。
    Code:                             # 方法的字节码指令。
      stack=2, locals=2, args_size=2  # 栈深度，局部变量表大小，参数数量。
         0: aload_0                   # 加载this引用到栈顶。
         1: invokespecial #1          # 调用Object的构造函数。
         4: aload_0                   # 再次加载this引用到栈顶。
         5: iload_1                   # 加载第一个局部变量（int参数）到栈顶。
         6: putfield      #7          # 将栈顶的值存储到value字段。
         9: return                    # 返回。
      LineNumberTable:                # 行号表，指示字节码指令与源代码行号的关系。
        line 5: 0                     # 字节码指令0对应的源代码行号5。
        line 6: 4                     # 字节码指令4对应的源代码行号6。
        line 7: 9                     # 字节码指令9对应的源代码行号7。

  public int getValue();              # 声明了一个公共的int返回类型的方法getValue。
    descriptor: ()I                   # 方法的参数和返回类型描述符。
    flags: (0x0001) ACC_PUBLIC        # 方法的标志位，ACC_PUBLIC表示公共。
    Code:                             # 方法的字节码指令。
      stack=1, locals=1, args_size=1  # 栈深度，局部变量表大小，参数数量。
         0: aload_0                   # 加载this引用到栈顶。
         1: getfield      #7          # 获取value字段的值。
         4: ireturn                   # 返回栈顶的int值。
      LineNumberTable:                # 行号表，指示字节码指令与源代码行号的关系。
        line 10: 0                    # 字节码指令0对应的源代码行号10。
}

# SourceFile Attribute:
SourceFile: "SimpleClass.java"         # 源代码文件名。
```


### 类加载和使用

下面是基于`SimpleClass.class`字节码文件的一个简化版的类加载和使用过程的描述：

**1. 类加载（Loading）**

类加载过程由JVM的类加载器负责，通常包括加载、验证、准备、解析和初始化五个阶段。

::: info 类加载
#### 加载（Loading）
当JVM首次遇到`new SimpleClass(10);`这样的语句时，如果`SimpleClass`尚未加载，则类加载器（如AppClassLoader）会读取`SimpleClass.class`文件的内容，将其转化为字节码数组，然后创建一个`Class`对象。

#### 验证（Verification）
JVM会对字节码进行一系列的检查，以确保它们符合JVM规范，不会对JVM造成危害，例如检查常量池中的信息是否有效，确保字节码指令正确无误。

#### 准备（Preparation）
在这个阶段，JVM为`SimpleClass`类的静态变量分配内存并设置默认值。例如，`public static final String NAME = "Tom";`的默认值为`null`（因为`String`是对象类型），直到初始化阶段才会被赋值。

#### 解析（Resolution）
解析是将类中的符号引用转换为直接引用的过程，例如将`Fieldref`和`Methodref`转换为具体的内存地址。

#### 初始化（Initialization）
在初始化阶段，`<clinit>`方法会被调用，执行类的静态初始化代码块，设置静态变量的最终值。在我们的例子中，`NAME`字段将被赋值为`"Tom"`。
:::

**2. 实例化（Instantiation）**

当执行`new SimpleClass(10);`时，JVM会执行以下步骤：

1. **分配内存**：在堆上为新的`SimpleClass`实例分配内存。
2. **初始化对象**：调用构造函数`SimpleClass(int)`。在字节码中，`aload_0`加载对象引用，`invokespecial #1`调用`Object`类的构造函数，`iload_1`加载参数值，`putfield #7`将值存储到`value`字段中。

当执行`SimpleClass.getValue();`时，`getValue()`方法的字节码被执行。`aload_0`加载对象引用，`getfield #7`获取`value`字段的值，然后`ireturn`返回这个值。


::: info 内存变化

#### 堆空间
- 在类加载时，`SimpleClass`的`Class`对象被创建在永久代（JDK 8之前）或元空间（JDK 8之后）。
- 当实例化`SimpleClass`时，新对象被创建在堆空间中，包含`value`字段。

#### 栈空间
- 每个线程都有自己的栈空间，用于存储局部变量和方法调用的帧。
- 在构造函数调用期间，局部变量表和操作数栈被使用，例如`iload_1`从局部变量表加载值。

#### 方法区
- 存储了类的信息、静态变量、常量池、方法数据等。

#### 本地方法栈
- 用于支持本地方法的调用，但在我们的例子中未涉及。
:::





## 常见字节码指令

Java字节码指令集是Java虚拟机(JVM)用来执行Java程序的低级指令集。这些指令涵盖了从基本的数据操作到控制流、异常处理、对象创建、方法调用等各种功能。

Java的指令集选择了基于栈的设计，主要是因为它提供了更好的跨平台兼容性和简化了内存管理。更多内容参照：[虚拟机栈及Java指令集](./Jvm内存管理.md#虚拟机栈)

::: info 操作码和操作数
字节码指令由操作码（opcode）和操作数（operands）组成。操作码是一个字节长度（0-255），而操作数可以是附加的字节，用于指定操作的对象或值。
:::

字节码指令在`.class`文件中位于方法的代码属性中。当JVM加载类并准备执行方法时，它会读取这些字节码指令并执行它们。


### 常量入栈指令

常量入栈指令主要用于将各种类型的常量值推入操作数栈。操作数栈是JVM执行引擎的一个关键组件，属于 [虚拟机栈](./Jvm内存管理.md#虚拟机栈) 中栈帧的一部分，它用于存放临时计算结果和操作数。

常量入栈指令允许JVM将预定义的或常量池中的常量直接加载到栈顶，以便后续的计算或方法调用使用。下面是一些常见的常量入栈指令及其功能：

1. **`aconst_null`**
   - 功能：将`null`引用压入栈顶。
   - 用途：初始化对象引用或传递`null`作为参数。

2. **`iconst_<n>`**
   - 功能：将一个固定的整数常量`<n>`压入栈顶。
   - 用途：`<n>`可以是`m1`（-1）、`0`、`1`、`2`、`3`、`4`或`5`。
   - 示例：`iconst_0`将整数0压入栈顶。

3. **`bipush`**
   - 功能：将一个字节范围内的整数（-128到127）压入栈顶。
   - 用途：用于较小的整数常量。

4. **`sipush`**
   - 功能：将一个短整数范围内的值（-32768到32767）压入栈顶。
   - 用途：用于较大的整数常量但比`ldc`更快。

5. **`ldc` 和 `ldc_w`**
   - 功能：将常量池中的常量（如`int`、`float`、`String`引用或类引用）压入栈顶。
   - 用途：`ldc`用于索引小于等于255的情况，`ldc_w`用于更大的索引。
   - 示例：`ldc #1`将常量池中索引为1的常量加载到栈顶。

6. **`ldc2_w`**
   - 功能：将常量池中的长整型或双精度浮点型常量压入栈顶。
   - 用途：用于`long`和`double`类型。

在JVM执行过程中，这些常量值会被加载到操作数栈中，然后可以通过其他指令（如算术指令、比较指令或方法调用指令）进一步处理。


### 变量操作指令

变量操作指令在Java字节码中用于处理==局部变量和对象的字段==。这些指令允许JVM在执行方法时加载、存储和操作变量的值。Java字节码中的变量操作指令可以分为几类，主要关注局部变量（栈帧中的局部变量表）和对象字段（对象头之后的数据区域）。


::: info 变量操作指令
#### 局部变量操作指令

局部变量是指在方法体中声明的变量，它们存储在栈帧的局部变量表中。局部变量操作指令包括加载（Load）、存储（Store）和交换（Swap）指令。

- **Load指令**：用于从局部变量表中加载一个变量的值到操作数栈顶。
  `iload`, `lload`, `fload`, `dload`, `aload`: 分别加载int、long、float、double和对象引用类型的局部变量。
  
- **Store指令**：用于将操作数栈顶的值存储到局部变量表中的某个位置。
  `istore`, `lstore`, `fstore`, `dstore`, `astore`: 分别存储int、long、float、double和对象引用类型的局部变量。

- **Swap指令**：`swap`用于交换操作数栈顶的两个值的位置。这在某些情况下可以避免使用临时变量。

#### 对象字段操作指令

对象字段操作指令用于访问和修改对象实例中的字段（成员变量）。这些指令包括：

- `getfield`用于从对象中加载一个实例字段的值到操作数栈顶。
  
- `putfield`用于将操作数栈顶的值存储到对象的一个实例字段中。

此外，还有专门用于静态字段的指令：

- `getstatic`用于从类中加载一个静态字段的值到操作数栈顶。
  
- `putstatic`用于将操作数栈顶的值存储到类的一个静态字段中。
:::

其他与变量相关的指令还有 `dup` 和 `pop` 指令：

**Duplication指令**：`dup`和`dup_x1`、`dup_x2`、`dup2`、`dup2_x1`、`dup2_x2`用于复制栈顶的值
::: info Duplication指令
- 不带_x 的`dup`指令说明: dup是复制栈顶数据并压入栈顶，一般包括两个指令：dup、dup2，系数代表要复制的slot个数
    - `dup`指令用于复制1个Slot的数据。例：1个int 或者 1个reference
    - `dup2`指令用于复制2个Slot的数据。例：1个long，或2个int，或1个int + 1个float
- 带_x 的`dup`指令说明: `dup_x`是复制栈顶数据并插入栈顶==两系数和==以下的位置，共有四个指令：`dup_x1`，`dup2_x1`，`dup_x2`，`dup2_x2`，只要将指令的dup和x的系数相加，结果即为需要插入的位置。
    - `dup_x1`插入位置:1+1=2，即栈顶2个Slot下面
    - `dup_x2`插入位置:1+2=3，即栈顶3个Slot下面
    - `dup2_x1`插入位置:2+1=3，即栈顶3个Slot下面
    - `dup2_x2`插入位置:2+2=4，即栈顶4个slot下面
:::

**pop指令与pop2指令**
- `pop`: 将栈顶的1个s1ot数值出栈。例如1个short类型数值
- `pop2`: 将栈顶的2个Slot数值出栈。例如1个double类型数值，或者2个int类型数值



### 数字操作指令

数字操作指令用于执行基本的算术和逻辑运算，这些指令涵盖了整数（`int`和`long`类型）和浮点数（`float`和`double`类型）的各种操作

::: info 不用数据类型所占用的slot
在Java虚拟机(JVM)的规范中，操作数栈中的每个槽(slot)可以保存一个基本数据类型值(==JVM栈的槽是32位宽的==)。但是，不同类型的数据所占用的栈槽数量是不同的：

- **整数类型 (`int`)**：`int`类型占用一个栈槽。

- **长整数类型 (`long`)**：`long`类型占用两个栈槽。这是因为`long`类型的大小是64位，而JVM栈的槽是32位宽的。

- **浮点数类型 (`float`)**：`float`类型也占用一个栈槽，与`int`类型相同。

- **双精度浮点数类型 (`double`)**：`double`类型占用两个栈槽，与`long`类型类似。这是因为`double`类型的大小同样是64位，所以它需要两个32位宽的栈槽来存储。
:::

常用指令介绍：
::: info 常用数字操作指令
#### 加法
- `iadd`：将栈顶的两个`int`值相加，结果压回栈顶。
- `ladd`：将栈顶的两个`long`值相加，结果压回栈顶。
- `fadd`：将栈顶的两个`float`值相加，结果压回栈顶。
- `dadd`：将栈顶的两个`double`值相加，结果压回栈顶。

#### 减法
- `isub`：从栈顶的第二个`int`值减去栈顶的`int`值，结果压回栈顶。
- `lsub`：从栈顶的第二个`long`值减去栈顶的`long`值，结果压回栈顶。
- `fsub`：从栈顶的第二个`float`值减去栈顶的`float`值，结果压回栈顶。
- `dsub`：从栈顶的第二个`double`值减去栈顶的`double`值，结果压回栈顶。

#### 乘法
- `imul`：将栈顶的两个`int`值相乘，结果压回栈顶。
- `lmul`：将栈顶的两个`long`值相乘，结果压回栈顶。
- `fmul`：将栈顶的两个`float`值相乘，结果压回栈顶。
- `dmul`：将栈顶的两个`double`值相乘，结果压回栈顶。

#### 除法
- `idiv`：栈顶的`int`值除以栈顶的第二个`int`值，结果压回栈顶。
- `ldiv`：栈顶的`long`值除以栈顶的第二个`long`值，结果压回栈顶。
- `fdiv`：栈顶的`float`值除以栈顶的第二个`float`值，结果压回栈顶。
- `ddiv`：栈顶的`double`值除以栈顶的第二个`double`值，结果压回栈顶。

#### 取模
- `irem`：栈顶的`int`值对栈顶的第二个`int`值取模，结果压回栈顶。
- `lrem`：栈顶的`long`值对栈顶的第二个`long`值取模，结果压回栈顶。
- `frem`：栈顶的`float`值对栈顶的第二个`float`值取模，结果压回栈顶。
- `drem`：栈顶的`double`值对栈顶的第二个`double`值取模，结果压回栈顶。

#### 移位
- `ishl`, `lshl`：左移操作。
- `ishr`, `lshr`：右移操作，空位填充0。
- `iushr`, `lushr`：无符号右移操作，空位填充0。

#### 比较
- `if_icmpeq`, `if_icmpne`, `if_icmplt`, `if_icmpge`, `if_icmpgt`, `if_icmple`：整数比较分支指令。
- `if_acmpeq`, `if_acmpne`：对象引用比较分支指令。

- `if_fcmpeq`, `if_fcmpne`, `if_fcmplt`, `if_fcmpge`, `if_fcmpgt`, `if_fcmple`：浮点数比较分支指令。
- `if_dcmpeq`, `if_dcmpne`, `if_dcmplt`, `if_dcmpge`, `if_dcmpgt`, `if_dcmple`：双精度浮点数比较分支指令。

#### 位运算
- `iand`, `land`：按位与操作。
- `ior`, `lor`：按位或操作。
- `ixor`, `lxor`：按位异或操作。
- `ineg`, `lneg`：按位取反操作。
:::







### 数据转换指令

数据转换指令用于在不同数据类型之间进行转换。这些指令在字节码层面实现自动类型提升（autoboxing）和强制类型转换（casting）等操作

::: info 常用数据类型转换指令
#### 整数类型之间的转换
- **`i2l`**：将`int`转换为`long`。
- **`i2f`**：将`int`转换为`float`。
- **`i2d`**：将`int`转换为`double`。
- **`l2i`**：将`long`转换为`int`，可能导致数据丢失。
- **`l2f`**：将`long`转换为`float`，可能导致数据精度损失。
- **`l2d`**：将`long`转换为`double`。

#### 浮点数类型之间的转换
- **`f2i`**：将`float`转换为`int`，可能导致数据丢失。
- **`f2l`**：将`float`转换为`long`，可能导致数据精度损失。
- **`f2d`**：将`float`转换为`double`，增加数据精度。
- **`d2i`**：将`double`转换为`int`，可能导致数据丢失。
- **`d2l`**：将`double`转换为`long`，可能导致数据精度损失。
- **`d2f`**：将`double`转换为`float`，降低数据精度。

在将浮点数转换为整数时，通常采用截断（truncation）的方式，即去除小数部分。

#### 自动类型提升
JVM在执行涉及不同整数类型（如`byte`、`short`、`char`、`int`、`long`）的操作时，会自动进行类型提升，以确保所有参与运算的值具有足够的精度。例如，当一个`byte`与一个`int`进行运算时，`byte`值会被提升到`int`类型。

#### 强制类型转换
在从大类型向小类型转换时，JVM使用显式的强制类型转换指令。例如，从`int`转换到`byte`需要使用`i2b`指令，这可能导致数据溢出或丢失。
:::

虽然JVM字节码本身没有直接的指令来将字符串转换为数字，但在Java中，你可以使用`Integer.parseInt()`, `Double.parseDouble()`等方法来进行此类转换。这些方法在JVM中通常表现为调用方法的`invokevirtual`或`invokestatic`指令。

同样，直接的数字到字符串的转换通常通过调用`Integer.toString()`, `Double.toString()`等方法实现，这些方法在字节码中表现为方法调用指令。



### 控制流指令

控制流指令负责改变程序的执行流程，包括条件分支、无条件跳转、循环控制以及异常处理。这些指令使得JVM能够根据程序中的条件决定下一步要执行的字节码指令。

::: info 常见控制流指令
#### 条件分支指令
条件分支指令根据栈顶的值来决定是否跳转到指定的目标地址。这些指令通常用于实现`if`语句的逻辑。

- **`ifeq`**：如果栈顶的值等于零，则跳转到目标地址。
- **`ifne`**：如果栈顶的值不等于零，则跳转到目标地址。
- **`iflt`**：如果栈顶的值小于零，则跳转到目标地址。
- **`ifge`**：如果栈顶的值大于等于零，则跳转到目标地址。
- **`ifgt`**：如果栈顶的值大于零，则跳转到目标地址。
- **`ifle`**：如果栈顶的值小于等于零，则跳转到目标地址。

对于`if`语句中的条件表达式，JVM使用这些指令通过计算条件表达式的布尔值（通常转换为整数0或非0）来实现跳转。

#### 比较和分支指令
这些指令用于比较两个值并根据结果进行分支。

- **`if_icmpeq`**, **`if_acmpeq`**: 如果两个整数或引用相等，则跳转。
- **`if_icmpne`**, **`if_acmpne`**: 如果两个整数或引用不相等，则跳转。
- **`if_icmplt`**, **`if_icmpge`**, **`if_icmpgt`**, **`if_icmple`**: 根据整数比较的结果跳转。


#### switch语句

`tableswitch`和`lookupswitch`指令用于实现高效的`switch`语句。这两种指令都用于基于某个整数表达式的值来进行条件分支，但它们的工作方式有所不同。

- **tableswitch指令**

`tableswitch`指令用于处理连续的`case`值。它的工作原理如下：

1. **偏移量**：首先读取一个默认的偏移量，用于在没有匹配的`case`时跳转的地址。
2. **最低和最高值**：接着读取最低和最高`case`值，用于构建一个范围。
3. **跳转表**：然后读取一系列的偏移量，每个偏移量对应于一个`case`值。这个跳转表的大小等于最高值减去最低值加一。

当`switch`表达式的值落在定义的范围内时，`tableswitch`指令会从跳转表中选择相应的偏移量进行跳转。如果表达式的值不在范围内，则使用默认的偏移量进行跳转。

指令格式：
```bash
tableswitch
  default: target
  low: minimum_index
  high: maximum_index
  pad: padding_bytes
  cases: case_offset_pairs
```

- **lookupswitch指令**

相比之下，`lookupswitch`指令用于处理非连续的`case`值。它的工作原理如下：

1. **默认偏移量**：读取一个默认的偏移量，用于在没有匹配的`case`时跳转的地址。
2. **匹配对**：接着读取一系列的键值对，每个键代表一个`case`值，其后的值代表一个偏移量。

当`switch`表达式的值与任何一个键匹配时，`lookupswitch`指令将使用相应的偏移量进行跳转。如果没有匹配的键，则使用默认的偏移量进行跳转。

指令格式：
```bash
lookupswitch
  default: default_target
  npairs: number_of_pairs
  pairs: match_offset_pairs
```


`tableswitch`和`lookupswitch`的设计旨在提高`switch`语句的执行效率。由于`tableswitch`指令的跳转表是连续的，因此它可以通过简单的索引查找来快速定位目标偏移量，而不需要遍历整个列表。相反，`lookupswitch`则需要遍历匹配对来查找一个键，但这对于非连续的`case`值仍然是一个高效的选择。


#### 无条件跳转指令
无条件跳转指令使程序流跳转到一个新的位置，而不考虑任何条件。

- **`goto`**：无条件跳转到指定的字节码偏移量。
- **`jsr`**（`jump subroutine`）：子程序调用，跳转到指定位置，但首先在操作数栈中压入返回地址。


#### 循环控制指令
虽然JVM字节码没有专门的循环指令，但通过结合条件分支和无条件跳转指令，可以实现循环的逻辑。

- **`loop`**：通常使用`ifeq`, `ifne`等指令与`goto`指令结合，形成循环结构。

#### 方法结束指令
控制流指令还包括方法的结束指令：

- **`return`**, **`ireturn`**, **`lreturn`**, **`freturn`**, **`dreturn`**, **`areturn`**：根据方法的返回类型，将结果值从栈中弹出并返回调用者，或者直接返回（对于`void`类型的方法）。
:::







### 对象创建和方法调用

对象创建涉及到类实例的初始化、内存分配和布局设置等多个步骤：

1. **类加载检查**：JVM检查`new`指令的参数是否能够在常量池中定位到一个类的符号引用，并验证该类是否已经被加载、解析和初始化过。如果没有，JVM会先进行类的加载。

2. **内存分配**：类加载检查通过后，JVM为新生的对象分配内存。对象所需的内存大小在类加载完成后就已经确定，包括对象头和实例数据的大小。

3. **初始化零值**：内存分配完成后，JVM会将分配的内存空间初始化为零值（除了对象头）。这样可以保证对象的实例字段在Java代码中可以不赋初值就直接使用，因为在Java中，类的字段都会有默认值。

4. **设置对象头**：接下来，JVM会在对象的头部设置必要的信息，包括对象的类信息元数据、哈希码、GC分代年龄等信息。对象头是JVM用来识别和管理对象的内部数据结构。

5. **执行初始化方法**：对象创建的最后一步是从JVM的角度看，将对象引用入栈，但对Java程序而言，对象创建才刚刚开始。此时，对象的实例初始化方法`<init>`将被执行，按照程序员设定的初始化逻辑进行对象的真正初始化。


::: info 对象创建和方法调用指令
### 对象创建指令

`new` 指令用于创建一个类的新实例。`new`指令需要一个指向常量池中类符号引用的索引。JVM会检查这个类是否已经被加载、解析和初始化，如果没有，会先执行类加载过程。一旦类被确认，JVM将为新的对象分配内存。

假设有一个类 `MyClass`，在 Java 代码中创建它的实例：
```java
MyClass obj = new MyClass();
```
对应的字节码可能是这样的：
```bash
new #2                  // class MyClass
dup
invokespecial #3        // Method "<init>":()V
```
这里，`new` 指令后面跟着 `dup` 指令，用于复制新创建的对象引用到栈顶，然后 `invokespecial` 指令调用类的构造器 `<init>` 方法来初始化对象。

### 方法调用指令

方法调用在JVM中可以通过几种不同的指令来实现，每种指令适用于不同情况：

- `invokevirtual`
这是最常见的方法调用形式，用于调用实例方法。JVM会在运行时查找实际的方法实现。

- `invokespecial`
用于调用实例初始化方法 `<init>`，私有方法，父类方法，以及 `super` 关键字调用的方法。

- `invokestatic`
用于调用静态方法，即类方法。这类方法不属于任何对象实例。

- `invokeinterface`
用于调用接口方法。JVM会在运行时查找具体实现该接口的类的方法。

- `invokedynamic`
这是一个更灵活的调用指令，允许在运行时动态解析方法引用。主要用于支持动态语言和一些框架（如 Java 8 中的 Lambda 表达式）。
:::








### 数组操作指令

数组操作指令用于处理数组的创建、访问、修改和销毁等操作。数组在JVM中是一种特殊类型的数据结构，它们被设计成可以直接支持固定长度的同类型元素集合。

::: info 数组的创建和常见操作指令
#### 数组创建指令
- **`newarray`**：创建一个单一维度的数组，其中`newarray`指令接受一个整数参数来指定数组的类型（如`T_BOOLEAN`, `T_CHAR`, `T_FLOAT`, `T_DOUBLE`, `T_BYTE`, `T_SHORT`, `T_INT`, `T_LONG`），并且还需要一个整数参数来指定数组的长度。
- **`anewarray`**：创建一个单一维度的对象数组，其中数组元素的类型由类的常量池索引确定。
- **`multianewarray`**：创建一个多维数组。此指令需要一个类常量池索引和一个表示数组维度的数量，以及随后的整数参数列表，每个参数表示相应维度的大小。

#### 数组元素加载和存储指令
这些指令用于从数组中加载元素或将元素存储到数组中。

- **`baload`, `caload`, `saload`, `iaload`, `laload`, `faload`, `daload`, `aaload`**：分别用于加载`byte`, `char`, `short`, `int`, `long`, `float`, `double`, 和对象类型的数组元素到栈顶。
- **`bastore`, `castore`, `sastore`, `iastore`, `lastore`, `fastore`, `dastore`, `aastore`**：用于将栈顶的元素存储到相应类型的数组中指定的索引位置。

#### 数组长度查询指令
- **`arraylength`**：此指令从栈顶弹出一个数组引用，并将该数组的长度压入栈顶。这通常用于获取数组的大小，而无需访问数组的任何元素。
:::

假设我们有如下Java代码片段，创建一个整数数组，并初始化其中的一个元素：
```java
int[] array = new int[10];
array[5] = 42;
```

对应的JVM字节码可能如下所示：
```bash
0: newarray         10     // 创建一个包含10个int元素的数组
3: astore_1         // 存储数组引用到局部变量表中的位置1
4: iconst_5         // 将整数5推入栈顶，作为数组索引
5: aload_1          // 将数组引用从局部变量表中加载到栈顶
6: iconst_42        // 将整数42推入栈顶
7: iastore          // 将栈顶的值42存储到数组的索引5处
```





### 异常处理指令

::: info 异常处理指令
#### 异常抛出指令
- **`athrow`**：这个指令用于抛出一个异常。当JVM遇到这个指令时，它会从操作数栈中弹出一个`Throwable`对象的引用，并将其作为当前线程的未处理异常。`athrow`指令会导致当前方法的控制流立即转移到异常处理程序。

#### 异常捕获和处理
JVM使用异常表（exception table）来跟踪`try`块和相应的`catch`块。异常表是每个方法的一部分，它包含了以下信息：
- **起始PC**：`try`块的起始字节码偏移量。
- **结束PC**：`try`块的结束字节码偏移量。
- **处理程序PC**：`catch`块的起始字节码偏移量。
- **异常类型索引**：在常量池中异常类的符号引用索引，或者`0`表示捕获所有异常。

当一个异常被抛出时，JVM会从抛出点开始，回溯到最近的`try`块的开始，并检查这个`try`块的异常表，寻找一个匹配的`catch`块。如果找到一个匹配的`catch`块，JVM会将控制转移到这个`catch`块的起始点，并将异常对象压入操作数栈中。

- **异常处理指令**
尽管没有直接对应于`try`, `catch`, 或`finally`的字节码指令，但JVM通过异常表和控制流指令（如`goto`和`jsr`）来实现这些语义。

- **终止和清理指令**
    - **`finally`**：在Java源代码中，`finally`块用于确保某些代码无论是否发生异常都会执行。在JVM层面上，`finally`块通过在`try`块的异常表中添加一个额外的条目来实现，这个条目指向`finally`块的起始点，并且在`catch`和`return`指令之前调用它。

- **处理多个异常**
JVM允许在一个`try`块之后跟多个`catch`块，以处理不同类型的异常。在字节码级别，这表现为异常表中有多条记录，每条记录对应一个`catch`块。
:::

例：假设我们有以下Java代码：

```java
public class ExceptionDemo {
    public static void main(String[] args) {
        try {
            System.out.println(1 / 0);
        } catch (ArithmeticException e) {
            System.out.println("Caught an ArithmeticException");
        } finally {
            System.out.println("Finally block executed");
        }
    }
}
```

这段代码试图执行一个除以零的操作，这将引发一个`ArithmeticException`。由于这个异常被捕获在`catch`块中，所以它会被处理，同时`finally`块也会被执行。

使用`javap`命令，我们可以查看这段代码编译后的字节码。下面是`ExceptionDemo`类的`main`方法的部分字节码输出：

```bash
  public static main(java.lang.String[]);
    Code:
       0: getstatic     #2    // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #3    // String 1
       5: invokevirtual #4    // Method java/lang/String.valueOf:(I)Ljava/lang/String;
       8: invokevirtual #5    // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      11: iconst_0
      12: iconst_0
      13: idiv
      14: astore_1
      15: goto          27
      18: astore_2
      19: getstatic     #2    // Field java/lang/System.out:Ljava/io/PrintStream;
      22: ldc           #6    // String Caught an ArithmeticException
      24: invokevirtual #5    // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      27: getstatic     #2    // Field java/lang/System.out:Ljava/io/PrintStream;
      30: ldc           #7    // String Finally block executed
      32: invokevirtual #5    // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      35: return
    Exception table:
       from    to  target type
           0    15    18   Class java/lang/ArithmeticException
      Handler pc: 19
       from    to  target type
           0    35    36   any
      Handler pc: 37
```

从字节码中，我们可以看到以下几点：
- `getstatic` 和 `invokevirtual` 指令用于调用`System.out.println`来打印字符串。
- `idiv` 指令尝试执行整数除法，如果除数为零，它将抛出`ArithmeticException`。
- `astore_1` 是一个临时指令，用于存储`idiv`的结果（在正常情况下）。`goto` 指令用于跳过`catch`块并执行`finally`块，但如果发生了异常，`goto`将不会被执行。
- `astore_2` 指令用于捕获异常并存储到局部变量表中的位置2。
- `Exception table` 包含两行：
  - 第一行指示从位置0到位置15的代码是`try`块，如果在这个范围内抛出了`ArithmeticException`，则跳转到位置18，这是`catch`块的起始点。
  - 第二行指示从位置0到位置35的代码是`try`块，如果在这个范围内抛出了任何异常，则跳转到位置36，这是`finally`块的起始点。

`finally`块的处理稍有不同，它会生成一个额外的`any`类型（表示任何异常）的异常表条目，这是因为`finally`块必须在任何情况下都得到执行。因此，即使在`catch`块中再次抛出异常，`finally`块也应当被执行。






### 方法返回指令

方法返回指令是负责结束方法执行并将控制权返回给调用者的关键部分。JVM提供了几种不同的返回指令，具体取决于方法的返回类型。以下是JVM中用于方法返回的主要指令：

1. **`return`**
   - 用于没有返回值的方法，即`void`类型的方法。当遇到此指令时，当前方法立即结束，控制流返回到调用该方法的代码处。

2. **`ireturn`**
   - 当方法返回一个`int`类型的值时使用。此指令将栈顶的`int`值弹出并作为方法的返回值。

3. **`lreturn`**
   - 用于返回`long`类型的值。与`ireturn`类似，但处理的是64位的`long`类型。

4. **`freturn`**
   - 用于返回`float`类型的值。处理32位的`float`类型。

5. **`dreturn`**
   - 用于返回`double`类型的值。处理64位的`double`类型。

6. **`areturn`**
   - 用于返回对象引用或数组。将栈顶的对象引用作为返回值。

例：下面是一个简单的Java方法以及它的字节码表示：

```java
public class HelloWorld {
    public static void printHello() {
        System.out.println("Hello, World!");
    }

    public static int addNumbers(int a, int b) {
        return a + b;
    }
}
```

使用`javap -c`命令查看`printHello`和`addNumbers`方法的字节码：

```bash
Compiled from "HelloWorld.java"
public class HelloWorld extends java.lang.Object{
  public static void printHello();
    Code:
       0: getstatic     #2  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #3  // String Hello, World!
       5: invokevirtual #4  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return        

  public static int addNumbers(int, int);
    Code:
       0: iload_0
       1: iload_1
       2: iadd
       3: ireturn
}
```

对于`printHello`方法，字节码以`return`指令结束，因为这是一个`void`类型的方法。对于`addNumbers`方法，字节码以`ireturn`指令结束，因为它返回一个`int`类型的值。





### 同步指令

同步指令是用来实现线程安全的关键机制之一，主要通过管程（Monitor）的概念来实现。管程是一种抽象的数据类型，它可以控制对共享资源的访问，确保任何时刻只有一个线程可以访问被管程保护的代码段或对象。JVM提供了两种主要的同步指令来支持Java语言中的`synchronized`关键字：
- **`monitorenter`**：当一个线程执行到此指令时，它试图获取对象的管程锁。如果该对象的锁未被任何其他线程持有，那么当前线程将获得锁并继续执行。如果锁已被其他线程持有，当前线程将被阻塞，直到锁可用为止。
- **`monitorexit`**：当一个线程离开`synchronized`代码块时，此指令会释放对象的管程锁，允许其他等待的线程有机会获取锁。

::: info 同步指令实现细节
- **管程实现**：JVM中的管程实现基于对象头中的锁标志位和锁记录。当一个线程试图获取锁时，JVM会检查对象头中的锁标志位，如果锁是轻量级的，线程可能会直接获得锁；如果是重量级的，线程将被加入到等待队列中。
- **锁升级**：为了提高性能，JVM使用锁升级机制，即从偏向锁升级到轻量级锁，再升级到重量级锁，根据竞争程度动态调整锁的级别。
- **锁消除**：JVM编译器可能会分析代码并消除那些在编译时就能确定不会被并发访问的锁，以减少同步开销。
:::

与`synchronized`不同，`Lock`接口并没有直接对应的JVM指令，而是通过更高层次的API和JVM内部的锁实现机制来工作的。当使用`Lock`接口的实现（如`ReentrantLock`）时，JVM并不会直接使用`monitorenter`和`monitorexit`指令，而是使用了更底层的锁实现，这通常涉及原子变量和CPU级别的原语。

- `ReentrantLock`使用了`AbstractQueuedSynchronizer`（AQS）框架，这是一个抽象类，提供了实现自定义同步器的基础。AQS维护了一个共享的整数表示状态，以及一个FIFO线程等待队列。当一个线程请求锁时，AQS会检查当前的状态，如果锁可用，它会修改状态并允许线程继续。如果锁不可用，线程将被加入到等待队列中。

- `ReentrantLock`和其他基于AQS的同步器，如`Semaphore`和`CountDownLatch`，==使用了`Unsafe`类中的本机方法来实现原子更新和线程阻塞==。这意味着当一个线程尝试获取锁时，它实际上调用了`Unsafe`类中的`compareAndSwapInt`或`compareAndSwapObject`方法来更新AQS的状态，而当线程等待锁时，它将被挂起到一个操作系统级别的等待队列上。

总的来说，`Lock`接口的实现更复杂，它们利用了JVM的底层机制和操作系统提供的原语，而不是像`synchronized`那样直接映射到特定的JVM指令。这种设计允许更高级别的并发控制，同时也带来了更高的灵活性和潜在的性能优势。





### 访问常量池

常量池是一个非常重要的数据结构，它包含了类或接口编译期间生成的各种字面量和符号引用。常量池可以被看作是Class文件的一个组成部分，它在类加载阶段被加载到方法区（在HotSpot虚拟机中称为Metaspace），并在运行时成为运行时常量池的一部分。

JVM提供了多种指令来访问常量池中的信息，这些指令用于在执行过程中获取各种常量和引用。下面是一些常见的访问常量池的JVM指令：

1. **`ldc`**（Load Constant）
   - 这个指令用于将常量池中的一个常量加载到操作数栈顶。`ldc`指令可以加载整数、浮点数、字符串或符号引用。

2. **`ldc_w`** 和 **`ldc2_w`**
   - 这两个指令类似于`ldc`，但是它们使用宽索引，允许访问更大的常量池索引空间。`ldc_w`用于加载单个字节码宽度的常量，而`ldc2_w`用于加载双字节宽度的常量，如`long`和`double`。

3. **`getstatic`** 和 **`putstatic`**
   - 这些指令用于访问类或接口中的静态字段。`getstatic`用于从常量池中获取静态字段的值，并将其压入操作数栈。`putstatic`用于将操作数栈顶的值存储到静态字段中。

4. **`invoke*`** 指令
   - 所有的方法调用指令（如`invokevirtual`、`invokespecial`、`invokestatic`和`invokeinterface`）都需要访问常量池以获取方法的符号引用。这些指令会根据常量池中的信息找到正确的方法并进行调用。

5. **`checkcast`** 和 **`instanceof`**
   - 这些指令需要访问常量池中的类和接口的符号引用，以确定运行时对象的类型或进行类型转换。

6. **`new`**
   - 当创建一个新的对象实例时，`new`指令需要从常量池中获取类的符号引用，以便创建正确的对象实例。

7. **`multianewarray`**
   - 这个指令用于创建多维数组。它需要访问常量池中的数组类的符号引用。








## ASM库及其应用

ASM库是一个专门用于操作Java字节码的开源框架。它由Fabien Fouquet开发，主要用于在运行时动态生成类或者修改已存在的类(增强已有类的功能)。ASM库能够直接创建或修改`.class`文件，这使得它在许多需要进行字节码级操作的场景下非常有用。

::: info 以下是ASM库的一些关键特点和用途：

1. **字节码操作**：ASM允许程序员在字节码级别上分析和修改Java类。这意味着你可以改变类的方法、字段、注解，甚至可以添加新的类或方法。

2. **高性能**：ASM库的设计注重性能，它尽量减少内存消耗和CPU使用，这使得它非常适合在需要高速字节码操作的环境中使用，比如在编译器或动态代理系统中。

3. **API设计**：ASM提供了一套简洁的API，这些API遵循事件驱动模型。当你使用ASM创建或修改类时，你会收到一系列事件，这些事件允许你在适当的位置插入代码。

4. **动态生成类**：ASM可以用于在运行时动态生成Java类。这对于创建自定义的元编程解决方案、构建代码生成工具或测试框架等非常有帮助。

5. **字节码分析**：除了修改字节码，ASM还可以用于分析字节码。这对于反编译、代码审查和安全审计等场景非常有用。

6. **兼容性**：ASM库支持从Java 5到最新的Java版本的字节码格式，这意味着你可以使用它来处理不同版本的Java类文件。

7. **使用案例**：ASM被广泛应用于各种场景，包括但不限于编译器、动态代理库（如CGLIB）、性能监控工具、代码优化工具、安全框架等。
:::

ASM是一个强大的工具，它为Java开发者提供了在字节码级别上操作和分析代码的能力。无论是动态生成代码、优化现有代码还是进行代码分析，ASM都是一个值得掌握的库。




### ASM库的使用

ASM库使用基于访问者模式的API，这允许用户在字节码级别上创建和修改类。

首先，确保你的项目已经包含了ASM库的依赖。如果你使用Maven，可以在`pom.xml`文件中添加如下依赖：

```xml
<dependency>
    <groupId>org.ow2.asm</groupId>
    <artifactId>asm</artifactId>
    <version>9.3</version>
</dependency>
```

接下来开始使用ASM创建一个类：

1. **创建ClassWriter实例**：
   ClassWriter是负责生成字节码的主要类。你需要告诉ClassWriter你想生成的类的版本号。

   ```java
   ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_MAXS);
   ```

2. **定义类的访问标志、名称、超类、接口等**：
   使用`visit`方法来定义类的基本信息，包括访问标志、类名、超类名和实现的接口列表。

   ```java
   cw.visit(Opcodes.V1_8,
            Opcodes.ACC_PUBLIC + Opcodes.ACC_SUPER,
            "com/example/MyClass",
            null,
            "java/lang/Object",
            null);
   ```

3. **添加字段**：
   使用`visitField`方法来添加字段，并且不要忘记调用`visitEnd`结束字段的定义。

   ```java
   FieldVisitor fv = cw.visitField(
           Opcodes.ACC_PRIVATE,
           "myField",
           "Ljava/lang/String;",
           null,
           null);
   if (fv != null) {
       fv.visitEnd();
   }
   ```

4. **添加方法**：
   使用`visitMethod`方法来添加方法。对于构造函数和普通方法，你都需要调用`visitMethod`并提供相应的参数。

   添加构造函数：

   ```java
   MethodVisitor mv = cw.visitMethod(
           Opcodes.ACC_PUBLIC,
           "<init>",
           "()V",
           null,
           null);
   if (mv != null) {
       // 编写构造函数的字节码
       mv.visitCode();
       mv.visitVarInsn(ALOAD, 0);
       mv.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
       mv.visitInsn(RETURN);
       mv.visitMaxs(1, 1);
       mv.visitEnd();
   }
   ```

   添加一个普通方法：

   ```java
   mv = cw.visitMethod(
           Opcodes.ACC_PUBLIC,
           "hello",
           "()V",
           null,
           null);
   if (mv != null) {
       // 编写方法的字节码
       mv.visitCode();
       mv.visitLdcInsn("Hello, World!");
       mv.visitVarInsn(ALOAD, 0);
       mv.visitFieldInsn(PUTFIELD, "com/example/MyClass", "myField", "Ljava/lang/String;");
       mv.visitInsn(RETURN);
       mv.visitMaxs(2, 1);
       mv.visitEnd();
   }
   ```

5. **MethodVisitor编写字节码指令的相关方法介绍**：
   在上面的例子中，我们已经在添加方法的部分编写了字节码指令。`mv.visitCode()`之后和`mv.visitEnd()`之前的所有指令都构成了方法的字节码。
   ::: details MethodVisitor编写字节码指令的相关方法
   `MethodVisitor`是用于访问和修改方法的访问者。当你使用`ClassWriter.visitMethod`或`ClassReader.accept`时，你会得到一个`MethodVisitor`实例，然后可以使用它来生成或修改方法的字节码。下面是一些常用的`MethodVisitor`方法，它们用于生成不同的字节码指令：

    -  **访问方法代码块**:
        - `visitCode()`: 开始方法体的字节码。
        - `visitMaxs(int maxStack, int maxLocals)`: 定义方法的最大操作数栈深度（maxStack）和局部变量的数量（maxLocals）。这些值通常需要计算，而`ClassWriter.COMPUTE_FRAMES`或`ClassWriter.COMPUTE_MAXS`可以帮助计算正确的值。
        - `visitEnd()`: 结束方法体的字节码。

    -  **操作常量池**:
        - `visitLdcInsn(Object cst)`: 将常量推入操作数栈。常量可以是整型、浮点型、字符串或类型对象。
        - `visitIntInsn(int opcode, int operand)`: 执行只带有一个操作数的整型指令，例如`NEWARRAY`。

    - **操作变量**:
        - `.visitVarInsn(int opcode, int var)`: 操作局部变量。`opcode`可以是`ILOAD`、`ISTORE`、`ALOAD`等，`var`是局部变量的索引。
        - `visitVarInsn(int opcode, int local, int extendedIndex)`: 与`.visitVarInsn`类似，但在某些情况下用于访问更宽范围的局部变量。

    -  **执行操作**:
        - `visitInsn(int opcode)`: 执行不带操作数的指令，如`NOP`、`POP`、`DUP`等。
        - `visitTypeInsn(int opcode, String type)`: 执行与类型相关的指令，如`NEW`、`CHECKCAST`、`INSTANCEOF`等。
        - `visitFieldInsn(int opcode, String owner, String name, String desc)`: 访问字段，如`GETSTATIC`、`PUTFIELD`。
        - `visitMethodInsn(int opcode, String owner, String name, String desc, boolean itf)`: 调用方法，如`INVOKEVIRTUAL`、`INVOKESTATIC`。
        - `visitJumpInsn(int opcode, Label label)`: 执行跳转指令，如`IFEQ`、`GOTO`。
        - `visitLocalVariable(String name, String desc, String signature, Label start, Label end, int index)`: 定义局部变量的符号信息。

    -  **异常处理**:
        - `visitTryCatchBlock(Label start, Label end, Label handler, String type)`: 定义一个异常处理块。
        - `visitLocalVariableTable()`: 访问局部变量表。

    -  **标记位置**:
        - `visitLabel(Label label)`: 设置一个标签，用于跳转指令的目标或异常处理块的边界。

    -  **属性和注解**:
        - `visitAttribute(Attribute attr)`: 添加方法属性。
        - `visitAnnotation(String desc, boolean visible)`: 添加方法注解。
        - `visitTypeAnnotation(int typeRef, TypePath typePath, String desc, boolean visible)`: 添加类型注解。
    :::

6. **调用ClassWriter的toByteArray()方法获取字节码**：
   最后，使用`toByteArray`方法将所有定义的类信息转换成字节码数组。

   ```java
   byte[] b = cw.toByteArray();
   ```

最终，你可以将得到的字节码数组写入到`.class`文件中，或者将其加载到JVM中动态创建类。




### 常见ASM应用

ASM是一个强大的Java字节码操作和分析框架，允许你动态地生成类或者修改现有的类。以下是使用ASM进行这些操作的一些示例：

**动态生成类**：

1. 创建一个`ClassWriter`实例，指定版本号和输出模式。
2. 使用`ClassWriter.visitMethod`方法定义类的字段和方法。
3. 使用`MethodVisitor`来生成方法的字节码。
4. 使用`ClassWriter.toByteArray`获取生成的字节码。

```java
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "com/example/TestClass", null, "java/lang/Object", null);

{
    MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
    mv.visitCode();
    mv.visitVarInsn(ALOAD, 0);
    mv.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
    mv.visitInsn(RETURN);
    mv.visitMaxs(1, 1);
    mv.visitEnd();
}

byte[] b = cw.toByteArray();
```

<br/>

**修改方法体，添加或删除字节码指令**：

使用ASM修改方法体涉及创建一个`ClassReader`来读取现有的类文件，然后使用`ClassAdapter`和`MethodAdapter`来修改方法。

1. 使用`ClassReader`读取类文件。
2. 使用`ClassAdapter`来捕获并修改类结构。
3. 在`ClassAdapter`中使用`MethodAdapter`来修改具体方法的字节码。
4. 使用`ClassWriter`将修改后的类写入。

```java
ClassReader cr = new ClassReader("com/example/TestClass");
ClassWriter cw = new ClassWriter(cr, ClassWriter.COMPUTE_FRAMES);
ClassAdapter ca = new ClassAdapter(cw) {
    @Override
    public MethodVisitor visitMethod(int access, String name, String desc, String signature, String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, desc, signature, exceptions);
        return new MethodAdapter(mv) {
            @Override
            public void visitMethodInsn(int opcode, String owner, String name, String desc, boolean itf) {
                if (owner.equals("java/lang/System") && name.equals("out")) {
                    super.visitMethodInsn(INVOKESTATIC, "java/lang/System", "err", "Ljava/io/PrintStream;", false);
                }
                super.visitMethodInsn(opcode, owner, name, desc, itf);
            }
        };
    }
};
cr.accept(ca, 0);
byte[] b = cw.toByteArray();
```

<br/>

**实现类的动态代理或AOP**：

在Java中，动态代理通常通过`java.lang.reflect.Proxy`实现，但是使用ASM可以更加灵活和高效地实现动态代理和AOP（面向切面编程）。

1. 使用`ClassWriter`创建代理类。
2. 定义代理类的方法，使其调用接口方法并通过`INVOKEINTERFACE`调用代理逻辑。
3. 使用反射或直接加载生成的类。


```java
ClassWriter cw = new ClassWriter(0);
cw.visit(V1_8, ACC_PUBLIC + ACC_SUPER, "com/example/ProxyClass", null, "java/lang/Object", new String[]{"com/example/MyInterface"});

{
    MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, "<init>", "()V", null, null);
    mv.visitCode();
    mv.visitVarInsn(ALOAD, 0);
    mv.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
    mv.visitInsn(RETURN);
    mv.visitMaxs(1, 1);
    mv.visitEnd();
}

{
    MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, "myMethod", "()V", null, null);
    mv.visitCode();
    mv.visitVarInsn(ALOAD, 0);
    mv.visitMethodInsn(INVOKEINTERFACE, "com/example/MyInterface", "myMethod", "()V", true);
    mv.visitInsn(RETURN);
    mv.visitMaxs(1, 1);
    mv.visitEnd();
}

byte[] b = cw.toByteArray();
Class<?> proxyClass = new Loader().defineClass("com/example/ProxyClass", b);
Object proxyInstance = proxyClass.getConstructor().newInstance();
((MyInterface) proxyInstance).myMethod();
```

以上示例展示了如何使用ASM动态生成一个实现了`MyInterface`接口的代理类，并在`myMethod`方法中调用了接口方法。这只是一个基本的示例，实际的AOP逻辑可能包括额外的逻辑，如拦截器链、性能监控等。




### ASM与性能优化

ASM框架在Java性能优化方面扮演着重要角色，因为它允许开发者在运行时动态地修改和生成字节码。这种能力对于性能优化尤其有价值，因为可以直接针对特定场景定制和优化字节码，而无需重新编译整个应用程序。以下是一些常见的使用ASM进行性能优化的策略：

::: info 常见的ASM性能优化策略
#### 1. **字节码增强**

- **方法内联**：ASM可以用来识别小的、频繁调用的方法，并将其内联到调用者中，从而减少方法调用开销。
- **循环展开**：对于计算密集型的循环，可以通过ASM将循环体复制多次，减少循环控制结构的开销。
- **类型检查消除**：在多态调用中，如果类型检查在运行时总是返回相同的结果，ASM可以去除这些检查，直接调用正确的方法。

#### 2. **代码生成**

- **动态代理**：使用ASM生成动态代理类，避免了传统的代理模式带来的性能损失。
- **元数据处理**：ASM可以用于生成用于元数据处理的类，比如构建ORM映射或事件处理器，这可以减少运行时的反射开销。

#### 3. **静态字段初始化优化**

- 对于包含大量静态字段的类，可以使用ASM将这些字段的初始化逻辑延迟到真正需要使用时再执行，避免了不必要的初始化成本。

#### 4. **AOP（面向切面编程）**

- 使用ASM可以在运行时动态地向现有类添加切面，例如添加日志记录、安全检查或性能监控代码，而不会显著影响应用程序的性能。

#### 5. **性能监控和分析**

- 通过ASM，可以在方法的入口和出口点插入监控代码，收集性能数据，这对于理解程序的运行时行为和瓶颈至关重要。

#### 6. **内存优化**

- 通过对字节码的分析和修改，ASM可以帮助减少对象的创建和销毁，例如通过复用对象或使用更有效的数据结构。

#### 7. **JIT编译优化**

- 虽然JIT编译器已经相当智能，但在某些情况下，使用ASM手动调整字节码可以使JIT编译器的工作更加高效，从而产生更快的机器代码。

#### 8. **网络和I/O优化**

- 在网络和I/O密集型应用中，使用ASM优化网络包的序列化和反序列化过程，或者减少不必要的I/O操作，可以显著提高性能。

#### 9. **垃圾回收优化**

- 通过减少对象的分配和引用计数的操作，ASM可以帮助减少垃圾回收的频率和持续时间。
:::

例：使用ASM进行性能优化

假设我们有一个方法，它频繁地调用另一个小方法来获取某个值：

```java
public int getValue() {
    return smallMethod();
}

private int smallMethod() {
    // 一些简单的计算
    return 42;
}
```

我们可以使用ASM将`smallMethod()`内联到`getValue()`中，以减少方法调用的开销：

```java
// 使用ASM生成新的getValue方法
MethodVisitor mv = cw.visitMethod(ACC_PUBLIC, "getValue", "()I", null, null);
mv.visitCode();
// 直接在这里复制smallMethod的内容，而不是调用它
mv.visitInsn(ICONST_42); // 假设smallMethod的返回值是常数42
mv.visitInsn(IRETURN);
mv.visitMaxs(1, 1);
mv.visitEnd();
```

这样，每次调用`getValue()`时，不再有方法调用的开销，提高了性能。

总之，ASM提供了一种强大的工具，使开发者能够深入到Java应用程序的内部，对字节码进行精细的控制和优化，从而达到性能提升的目的。然而，使用ASM也需要谨慎，因为它可能会引入复杂性和潜在的错误，而且并非所有的性能问题都可以通过字节码级别的优化解决。






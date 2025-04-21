--- 

dir:
    collapsible: false
index: false
title: C/C++基础语法入门

---


## C语言及其发展史

C 语言是最流行的编程语言之一，排名网站网址为：https://www.tiobe.com/tiobe-index/

### C语言的发行版本
（1）K&R C（1978年）： 由柯尼汉和里奇合写的《C 程序设计语言》成为公认标准，简称为K&R C
（2）ANSI C（C89/C90，1989年）： 第一个ISO标准，也叫ANSI C，规范了K&R C，确保了可移植性
（3）C99（1999年）： 第一次大修订，引入许多特性如//注释、可变长度数组等，成为最流行版本
（4）C11（2011年）： 再次修订，增加_Generic、static_assert等功能，跟进新技术。
（5）C17（2018年）： C11在2017年修补，2018年发布的C17只解决了C11的缺陷，未加入新功能。
（6）C23： 2023年发布的C23计划增强安全性、消除实现定义行为、引入模块化语言等，提升安全和可靠性。

---

### C语言的应用场景

1. **系统级开发** ： 驱动/内核开发，嵌入式开发
    - 操作系统内核（Linux/Windows NT）  ， 驱动程序（硬件交互层）  
    - 嵌入式固件（MCU编程如STM32）

2. **高性能计算**： 游戏引擎（如Unity底层模块） ，高频交易系统，科学计算库（如BLAS/LAPACK）

3. **基础软件组件**：数据库（SQLite、Redis）， 编译器（GCC、LLVM） ，网络协议栈（TCP/IP实现）

4. **跨平台工具开发** ：解释器（Python早期版本），命令行工具（Git、Vim）



---

## C语言的开发环境


### GCC / GNU

GCC，最初代表GNU C Compiler，现在代表GNU Compiler Collection，是由自由软件基金会（FSF）开发的一个编译器系统。它支持多种编程语言和硬件架构，并且是开源的，任何人都可以使用、修改和分发它。以下是GCC的一些关键特性：

1. **多语言支持**：GCC不仅限于C语言编译，还支持其他多种编程语言，如C++、Objective-C、Fortran、Ada、Go以及Java等。每种语言都有其对应的前端，GCC通过这些前端来解析不同的源代码语言。

2. **可移植性**：GCC是一个高度可移植的编译器，能够运行在各种不同的硬件平台上，包括但不限于x86、ARM等。

3. **跨平台编译**：除了作为本地编译器外，GCC还能进行交叉编译，即可以在一个平台上编译另一个平台上的可执行文件。例如，在x86架构的机器上编译适用于ARM架构的程序。

4. **模块化设计**：GCC的设计是模块化的，这使得它可以很容易地加入对新语言和新CPU架构的支持。

5. **自由软件**：作为一个自由软件项目，GCC遵循GPL许可证发布，这意味着用户有权查看、修改并重新分发该软件。


::: info GNU
**GNU**（发音为 /ɡnuː/，递归缩写表示 **"GNU's Not Unix"**）是由 **Richard Stallman** 在1983年发起的自由软件操作系统项目。其目标是创建一个完全由自由软件组成的类Unix操作系统，使用户可以自由使用、修改和分发软件。

**GNU 与 Linux 的关系**: Linux内核（由Linus Torvalds开发） + GNU工具链 = **完整的操作系统**  
- Linux内核（进程管理/硬件驱动）
- GNU工具（编译器/Shell/基础命令）

**GNU 在现代技术中的体现**
- **开发工具链**：  
  - 即使在不使用Linux的系统上（如macOS），开发者仍依赖GNU工具（`grep`/`sed`/`gcc`）
- **嵌入式领域**：  
  - 许多IoT设备使用GNU工具链编译固件
- **开源文化**：  
  - GNU项目是Apache/MIT等许可证的思想源头

GNU不仅是技术项目，更是软件自由的象征。其工具链构成了现代开源开发的基石，从嵌入式设备到超级计算机无处不在。
:::

GCC的工作流程通常分为四个阶段：

- **预处理（Pre-processing）**：处理源代码中的预处理器指令，比如宏定义和头文件包含。
- **编译（Compiling）**：将预处理后的代码翻译成汇编语言代码。
- **汇编（Assembling）**：将汇编语言代码转换为目标机器码，生成目标文件。
- **链接（Linking）**：将一个或多个目标文件与所需的库链接起来，生成最终的可执行文件。

GCC还提供了一系列命令行选项，允许用户控制编译过程的各个方面，比如指定标准版本（如C99）、优化级别、调试信息等。由于其强大的功能和灵活性，GCC成为了类Unix系统下最常用的编译工具之一，并且也被广泛应用于许多嵌入式系统开发中。

### 开发工具选择
1）Visual Studio 工具
Visual Studio（简称 VS）是由微软公司发布的集成开发环境，它包括了整个软件生命周期中所需要的大部分工具，如UML工具、代码管控工具、集成开发环境（IDE）等。
官网地址：https://visualstudio.microsoft.com 

2）Code::Block工具
Code::Block是一个免费的跨平台IDE，它支持C、C++和Fortan程序的开发，Code::Block的最大特点是它支持通过插件的方式对IDE自身功能进行扩展，这使得Code::Block具有很强的灵活性，方便用户使用。
官网地址：https://www.codeblocks.org 

3）Clion工具
CLion是一款由JetBrains推出的跨平台C/C++集成开发环境（IDE），它具有智能编辑器、CMake构建支持、调试器、单元测试、代码分析等功能,可以极大提高C/C++开发效率。
官网地址：https://www.jetbrains.com/clion

4）VS Code
Visual Studio Code（简称VS Code）是一款由Microsoft开发的免费、开源的代码编辑器，它是一种轻量级但功能强大的集成开发环境（IDE），VS Code旨在提供一种优秀的编码体验，适用于各种编程语言和应用程序开发任务。
官网地址：https://code.visualstudio.com

5）在线编辑工具
CodingGround: https://tutorialspoint.com/compile_c_online.php
OnlineGDB:https://onlinegdb.com/online_c_compiler
Lightly：https://cde2f3ce.lightly.teamcode.com/

---

### MinGW-w64

MinGW (Minimalist GNU for Windows)

MinGW-w64 是一个用于Windows操作系统的开发工具集，其包含了C语言编译器 GCC（GNU Compiler Collection）。

- 官网地址：https://www.mingw-w64.org
- 下载地址：[Github](https://github.com/niXman/mingw-builds-binaries/releases/tag/13.2.0-rt_v11-rev1)，下载后解压设置环境变量即可, 如`C:\App\mingw64\bin`

```bash
# 检查版本
gcc --version
```


--- 

### VS code 配置

安装 C 语言扩展 ：`C/C++ Extension Pack` （包含了开发 C/C++ 所需要的多个扩展）, 安装后重启 VS code 即可。

新版VScode第一次运行时选择第一项即可自动生成相关的 `tasks.json` 配置文件:

![](https://image.ventix.top/img02/20250420182213187.png)

后续可直接运行或 debug 调试:

![](https://image.ventix.top/img02/20250420182359299.png)

![](https://image.ventix.top/img02/20250420182556669.png)

---

## C语言程序代码示例

### 第一个C程序

```c
#include <stdio.h>
int main() {
    printf("Hello World");
    return 0;
}
```
- `#include <stdio.h>`：引入标准输入输出库。
- `int main()`：主函数，程序入口点。
- `printf("Hello World");`：输出字符串“Hello World”到终端。
- `return 0;`：返回整型值0表示程序正常结束。



### 注释与代码风格

C语言提供两种注释方式，用于提高代码可读性和文档化：

---
- 单行注释: 从 `//` 开始到行尾结束,适用于简短说明或代码行尾备注, C99标准引入（早期C89不支持）
- 多行注释（块注释）: 可跨越多行, 不能嵌套使用, 兼容所有C标准（C89/C99/C11）

```c
#include <stdio.h>

/* 函数声明 */
int add(int x, int y);

int main() {
    // 调用加法函数并打印结果 
    printf("5 + 3 = %d\n", add(5, 3));
    return 0;
}

/*
 * 函数：add
 * 参数：x - 第一个加数
 *       y - 第二个加数
 * 返回：两数之和
 */
int add(int x, int y) {
    return x + y;
}
```


| **类型**       | **优点**                | **缺点**                | **适用场景**         |
|---------------|------------------------|------------------------|--------------------|
| 单行注释 `//`  | 简洁，不影响代码缩进     | 不支持多行              | 行尾简短说明        |
| 块注释 `/* */` | 可跨行，兼容性高         | 不能嵌套                | 函数说明/代码段禁用 |

---


::: tip 主流大括号风格

- K&R 风格（Kernighan & Ritchie）
    - **特点**：左括号 `{` 放在行尾，右括号 `}` 独占一行
    - **优点**：节省垂直空间，经典C语言书籍《The C Programming Language》使用
  ```c
  int main() {
      if (x > 0) {
          printf("Positive");
      } else {
          printf("Non-positive");
      }
      return 0;
  }
  ```

- Allman 风格（BSD 风格）
    - **特点**：左括号 `{` 和右括号 `}` 均独占一行
    - **优点**：代码块视觉隔离清晰，便于调试
  ```c
  int main()
  {
      if (x > 0)
      {
          printf("Positive");
      }
      else
      {
          printf("Non-positive");
      }
      return 0;
  }
  ```

| **风格**   | **优点**                | **缺点**          | **适用场景**         |
|------------|------------------------|------------------|---------------------|
| **K&R**    | 紧凑，节省行数          | 嵌套多时易混淆    | Linux/嵌入式开发     |
| **Allman** | 块分隔清晰              | 占用更多垂直空间  | 教学/团队协作项目    |

**最终建议**：  
1. 新项目优先选择 **K&R** 风格（行业主流）  
2. 在代码评审中强制要求括号规范  
:::


---


### 进制及进制转换

C语言支持以下几种常见进制的表示：

1. **十进制 (Decimal)**： 默认的整数表示方式， 直接书写数字即可

2. **八进制 (Octal)**：以数字 `0` 开头，后面跟八进制数字（0-7）
     ```c
     int num = 012; // 八进制12，等价于十进制的10
     ```
3. **十六进制 (Hexadecimal)**：以 `0x` 或 `0X` 开头，后面跟十六进制数字（0-9 和 A-F/a-f）
     ```c
     int num = 0x1A; // 十六进制1A，等价于十进制的26
     ```
4. **二进制 (Binary)**：C语言标准本身并不直接支持二进制字面量（如`0b1010`），但在某些编译器（如GCC和Clang）中可以通过扩展支持。
     ```c
     int num = 0b1010; // 二进制1010，等价于十进制的10
     ```
     如果需要跨平台兼容性，可以手动使用其他方法（如字符串或位运算）来表示二进制。

---

::: info 进制的输出样式

C语言通过`printf()`函数可以以不同的进制格式输出整数值。以下是常用的格式说明符及其作用：

1. **十进制输出**: 使用 `%d` 或 `%i` 格式说明符。
     ```c
     int num = 10;
     printf("Decimal: %d\n", num); // 输出：Decimal: 10
     ```
2. **八进制输出**: 使用 `%o` 格式说明符。
     ```c
     int num = 10;
     printf("Octal: %o\n", num); // 输出：Octal: 12
     ```
3. **十六进制输出**: 使用 `%x` 或 `%X` 格式说明符。
     - `%x` 输出小写字母（a-f）。
     - `%X` 输出大写字母（A-F）。
     ```c
     int num = 26;
     printf("Hexadecimal (lowercase): %x\n", num); // 输出：Hexadecimal (lowercase): 1a
     printf("Hexadecimal (uppercase): %X\n", num); // 输出：Hexadecimal (uppercase): 1A
     ```
4. **带前缀的十六进制输出**: 使用 `#` 标志可以在输出中添加前缀 `0x` 或 `0X`。
     ```c
     int num = 26;
     printf("Hexadecimal with prefix: %#x\n", num); // 输出：Hexadecimal with prefix: 0x1a
     printf("Hexadecimal with prefix: %#X\n", num); // 输出：Hexadecimal with prefix: 0X1A
     ```
5. **二进制输出**: C语言标准库没有直接支持二进制输出，但可以通过自定义函数实现。
     ```c
     void print_binary(int num) {
         if (num == 0) {
             printf("0");
             return;
         }
         char binary[33] = {0};
         int i = 32;
         while (num > 0) {
             binary[--i] = (num & 1) ? '1' : '0';
             num >>= 1;
         }
         printf("%s", binary + i);
     }

     int main() {
         int num = 10;
         printf("Binary: ");
         print_binary(num); // 输出：Binary: 1010
         printf("\n");
         return 0;
     }
     ```
:::



---


## C++核心特性简介

C++ 是一种通用编程语言，由 Bjarne Stroustrup 于 1985 年在贝尔实验室开发，作为 C 语言的扩展。它在 C 语言的基础上增加了面向对象编程（OOP）和泛型编程的特性，同时保持了 C 语言的高效性和底层控制能力。

| **特性**        | **C 语言**                          | **C++**                              |
|----------------|------------------------------------|--------------------------------------|
| **编程范式**    | 过程式编程                          | 多范式（过程式、面向对象、泛型）       |
| **标准库**      | 小型标准库（stdio.h, stdlib.h等）   | 庞大的标准模板库（STL）               |
| **内存管理**    | 手动（malloc/free）                | 手动+智能指针（auto_ptr, shared_ptr）|
| **字符串处理**  | 字符数组（char[]）                 | string类                            |
| **异常处理**    | 无                                 | try/catch机制                        |
| **函数特性**    | 简单函数                           | 函数重载、默认参数、内联函数           |
| **兼容性**      | C++可编译大多数C代码                | C不能编译C++特有语法                 |

::: info C++ 的核心扩展特性

1. **面向对象编程**
   - 类（class）和对象
   - 继承（单继承/多继承）
   - 多态（虚函数）
   - 封装（public/private/protected）

2. **标准模板库（STL）**
   - 容器（vector, list, map等）
   - 算法（sort, find等）
   - 迭代器

3. **现代C++特性（C++11/14/17/20）**
   - 自动类型推导（auto）
   - 范围for循环
   - Lambda表达式
   - 移动语义（右值引用）
:::

---

简单C++代码示例：

```cpp
#include <iostream>
#include <string>

// 使用命名空间避免std::前缀
using namespace std;

// 类定义
class Person {
private:
    string name;
    int age;
public:
    // 构造函数
    Person(string n, int a) : name(n), age(a) {}
    
    // 成员函数
    void introduce() {
        cout << "Hello, I'm " << name 
             << ", " << age << " years old." << endl;
    }
};

int main() {
    // 使用STL容器
    vector<string> languages = {"C", "C++", "Python"};
    
    // 范围for循环
    for (auto lang : languages) {
        cout << lang << " ";
    }
    cout << endl;
    
    // 创建对象
    Person p("Alice", 25);
    p.introduce();
    
    return 0;
}
```


C++ 在游戏开发、高频交易、图形处理、浏览器/数据库引擎等性能敏感领域占据主导地位，而 C 语言则更多用于操作系统内核、嵌入式系统等需要极致精简的场景。


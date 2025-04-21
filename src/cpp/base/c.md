---

order: 1
title: C语言基础语法

---


## 数据类型与变量

（1）变量是内存中的一个存储区域，该区域的数据可以在同一类型范围内不断变化。
（2）通过变量名，可以引用这块内存区域，获取里面存储的值。
（3）变量的构成包含三个要素：数据类型、变量名、存储的值。

变量必须先声明，后使用。可以先声明变量再赋值，也可以在声明变量的同时进行赋值。

::: tip 标识符
C语言中变量、函数、数组名、结构体等要素命名时使用的字符序列，称为标识符

- 标识符由字母、数字和下划线组成，且第一个字符必须是字母或下划线。
- 标识符**区分大小写**，长度限制取决于编译器和目标平台的具体实现
- 标识符不能是C语言的关键字。
- 标识符命名应具有描述性，便于理解和维护。

:::

---

### 整数类型

(1) 基本整数类型
| 类型        | 存储大小 (通常) | 取值范围 (通常)           | 格式化符号 |
|------------|---------------|--------------------------|-----------|
| `char`     | 1字节         | -128 到 127 或 0 到 255   | %c        |
| `short`    | 2字节         | -32,768 到 32,767        | %hd       |
| `int`      | 4字节         | -2,147,483,648 到 2,147,483,647 | %d        |
| `long`     | 4或8字节      | 取决于平台                | %ld       |
| `long long`| 8字节         | -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807 | %lld      |

 (2) 修饰符
- `signed`：有符号数（默认）
- `unsigned`：无符号数（范围从0开始）
- `short`：缩短整数长度
- `long`：扩展整数长度

```c
unsigned char byte = 255;  // 0 到 255
signed short temperature = -30;
unsigned long population = 7800000000;
```

C99新增类型: 固定宽度整数类型
```c
#include <stdint.h>

int8_t small;     // 精确8位有符号整数
uint16_t medium;  // 精确16位无符号整数
int32_t large;    // 精确32位有符号整数
int64_t huge;     // 精确64位有符号整数
```

---

### 浮点类型
| 类型       | 存储大小 | 精度       | 取值范围              | 格式化符号 |
|-----------|---------|-----------|----------------------|-----------|
| `float`   | 4字节   | 6-7位小数  | ±1.2×10^-38 到 ±3.4×10^38 | %f        |
| `double`  | 8字节   | 15-16位小数| ±2.3×10^-308 到 ±1.7×10^308 | %lf       |
| `long double` | 10或16字节 | 19-20位小数 | 更大范围              | %Lf       |

```c
float pi = 3.14159f;
double atomic_mass = 1.66053906660e-27;
long double very_precise = 3.141592653589793238L;
```

C99新增类型: 复数类型
```c
#include <complex.h>

double complex z = 1.0 + 2.0 * I;
```


---

### void类型
- 表示"无类型"
- 主要用途：
  - 函数不返回任何值：`void func()`
  - 函数无参数：`int func(void)`
  - 通用指针：`void*`



### 数据类型转换

#### 1. 隐式类型转换

自动发生的转换，遵循类型提升规则
```c
int i = 10;
float f = 3.14;
double d = i + f;  // i转换为float，然后结果转换为double
```

#### 2. 显式类型转换(强制转换)
```c
double x = 3.14159;
int y = (int)x;  // y = 3

int a = 10, b = 3;
float result = (float)a / b;  // 3.333...
```
强制转换可能导致数据丢失，应谨慎使用。

---

### 布尔类型

C99标准引入的布尔类型(`_Bool`或`bool`)本质上仍然是一种整数类型，其核心特点是：
- **存储形式**：实际仍以整数值存储（通常1字节）
- **取值规范**：`0`表示假(`false`)，任何非`0`值表示真(`true`)
- **类型安全**：相比传统方式，提供了更明确的语义标记

布尔类型的底层实现:
```c
// C标准中的定义（通常实现方式）
#define bool _Bool
#define true 1
#define false 0
```
布尔变量在内存中仍占用至少1字节空间，但逻辑上只应包含0或1。

::: info C99前的真假表示方法

在C99标准引入`<stdbool.h>`之前，开发者使用多种方式表示布尔值：

#### 1. 直接使用整数
```c
int is_ready = 1;  // 真
int is_empty = 0;   // 假
```

#### 2. 自定义宏定义
```c
#define TRUE 1
#define FALSE 0

typedef int BOOL;
BOOL flag = TRUE;
```

#### 3. 枚举类型
```c
typedef enum { false, true } bool;
bool file_exists = true;
```

#### 4. 位字段（结构体位域）
```c
struct {
    unsigned int is_active : 1;  // 只使用1位
} status;
status.is_active = 1;
```
:::


布尔类型标准头文件及基本用法：
```c
#include <stdbool.h>
```
该头文件提供：
- `bool`：布尔类型别名（实际为`_Bool`）
- `true`：值为1的常量
- `false`：值为0的常量

```c
bool is_raining = true;
bool is_sunny = false;

if (is_raining) {
    printf("Take an umbrella\n");
}
```
---

内存占用:
```c
printf("%zu\n", sizeof(bool));  // 通常是1（但标准只要求至少1）
```

---

与旧代码的兼容
```c
// 新旧布尔类型混用时的安全写法
#ifdef __STDC_VERSION__
#include <stdbool.h>
#else
typedef enum { false, true } bool;
#endif
```





---

### typedef别名

typedef：为现有类型创建别名， 提高代码可读性和可移植性

```c
typedef unsigned char BYTE;
typedef struct {
    int x;
    int y;
} Point;

BYTE data = 255;
Point p1 = {10, 20};
```

---


### 常量的定义

在C语言中，常量是程序运行期间不可改变的值。C语言提供了两种主要方式来定义常量：使用预处理指令`#define`和使用`const`关键字。

常量是程序中固定不变的值，与变量相对。使用常量的好处包括：
- 提高代码可读性（如`PI`比`3.14159`更易理解）
- 便于统一修改（只需修改一处定义）
- 避免意外修改导致错误

#### **`#define` 宏定义常量**

- **预处理阶段替换**：在编译前由预处理器进行文本替换
- **无类型检查**：只是简单的文本替换，不进行类型验证
- **不分配内存**：因为只是文本替换，没有存储概念
- **作用域**：从定义处到文件末尾，或直到`#undef`
- **常见用途**：定义数值常量、字符串常量、条件编译

```c
#include <stdio.h>

#define PI 3.14159
#define MAX_SIZE 100
#define WELCOME_MSG "Hello, World!"

int main() {
    double area = PI * 5 * 5;  // 编译前会被替换为 3.14159 * 5 * 5
    printf("%s\n", WELCOME_MSG);
    printf("Max elements: %d\n", MAX_SIZE);
    return 0;
}
```

#### **`const` 常量**

- **编译期处理**：由编译器处理，是真正的语言特性
- **类型安全**：有明确的类型，编译器会进行类型检查
- **分配内存**：通常分配只读存储空间（取决于实现）
- **作用域**：遵循C语言的作用域规则（块作用域、文件作用域等）
- **常见用途**：需要类型检查的常量、数组大小、函数参数

```c
#include <stdio.h>

const double PI = 3.14159;
const int MAX_SIZE = 100;
const char WELCOME_MSG[] = "Hello, World!";

int main() {
    const int local_const = 42;  // 局部常量
    
    double area = PI * 5 * 5;    // 使用方式与变量相同
    printf("%s\n", WELCOME_MSG);
    printf("Max elements: %d\n", MAX_SIZE);
    printf("Local const: %d\n", local_const);
    
    return 0;
}
```

#### `#define` 与 `const` 的关键区别

| **特性**            | **#define**                     | **const**                     |
|---------------------|--------------------------------|-------------------------------|
| **处理阶段**         | 预处理阶段（文本替换）          | 编译阶段                      |
| **类型检查**         | 无类型                         | 有类型，编译器会检查           |
| **内存分配**         | 不分配内存                     | 通常分配只读内存               |
| **作用域**           | 文件作用域（可被#undef取消）    | 遵循C语言作用域规则            |
| **调试可见性**       | 调试器中不可见（已被替换）      | 调试器中可见                   |
| **数组大小定义**     | 可用于静态数组大小              | C89中不能用于静态数组大小       |
| **指针使用**         | 不能定义指向常量的指针          | 可以定义指向常量的指针          |
| **复合类型**         | 不能定义结构体等复合类型常量    | 可以定义复合类型常量            |

---

::: tip 常量的高级用法
#### `#define` 的高级用法
```c
// 带参数的宏
#define MAX(a,b) ((a) > (b) ? (a) : (b))

// 字符串化
#define STR(x) #x
printf("%s\n", STR(Hello));  // 输出 "Hello"

// 符号连接
#define CONCAT(a,b) a##b
int CONCAT(var,1) = 10;      // 相当于 int var1 = 10;
```

#### `const` 的高级用法
```c
// 指针常量
const char *p1 = "Hello";    // 指向常量的指针
char *const p2 = "World";    // 常量指针

// 结构体常量
const struct Point {
    int x;
    int y;
} origin = {0, 0};

// 常量数组
const int days[] = {31, 28, 31, 30, 31};
```
:::

---

注意事项

1. **宏的副作用**：
   ```c
   #define SQUARE(x) x * x
   int result = SQUARE(2+3);  // 展开为 2+3 * 2+3 = 11，不是25
   // 应改为：
   #define SQUARE(x) ((x) * (x))
   ```

2. **C与C++的区别**： 在C++中，`const`常量默认有内部链接（可通过`extern`改变）， C++中`const`可以用于数组大小定义

3. **存储位置**： `const`变量通常存储在只读数据段（取决于实现），某些嵌入式系统中可能存储在Flash而非RAM

---

现代C的最佳实践——对于C99及以上版本的项目：

```c
// 现代C推荐方式
const double PI = 3.141592653589793;
const int MAX_USERS = 1000;

// 必须使用宏的情况
#define DEBUG_MODE 1
#ifdef DEBUG_MODE
    // 调试专用代码
#endif
```
- 优先使用`const`获得类型安全，仅在不适合使用`const`时才用`#define`
- 对宏定义使用全大写命名以便识别，为宏参数添加括号避免优先级问题

---


## C语言标准输入输出

在C语言中，输入输出操作主要通过标准库函数来实现。这些函数提供了与用户进行交互的能力，允许程序读取用户的输入或将信息输出给用户：

::: important 流(stream)
C语言的I/O设计基于流(stream)的概念，为各种设备提供了统一的接口.

流(Stream): 抽象数据源/目的地：流是对输入输出设备的抽象。主要有两种基本类型：
- 文本流：由字符组成的序列
- 二进制流：由原始字节组成的序列

常见预定义流：`stdin：标准输入流(键盘)`, `stdout：标准输出流(屏幕)`, `stderr：标准错误流(屏幕)`
:::

C语言的标准输入输出功能由`stdio.h`头文件提供的一系列函数支持。

### printf() 函数

printf() 函数 用于格式化输出数据到终端或指定的输出流, `int printf(const char *format, ...);`
  ```c
  #include <stdio.h>
  
  int main() {
      int num = 5;
      printf("The number is %d\n", num);
      return 0;
  }
  ```
  在这个例子中，`%d`是一个占位符，表示将要插入一个整数类型的值。

| 说明符 | 用途                | 示例       |
|--------|---------------------|------------|
| %d     | 十进制整数          | 123        |
| %u     | 无符号十进制        | 456u       |
| %f     | 浮点数              | 3.14159    |
| %c     | 单个字符            | 'A'        |
| %s     | 字符串              | "text"     |
| %p     | 指针地址            | &variable  |
| %x     | 十六进制(小写)      | 0x1a3      |
| %X     | 十六进制(大写)      | 0X1A3      |
| %%     | 百分号本身          | %          |


---


### scanf() 函数

scanf() 函数用于从标准输入（通常是键盘）读取数据并根据指定的格式存储到变量中: `int scanf(const char *format, ...);`

  ```c
  #include <stdio.h>
  
  int main() {
      int age;
      printf("Enter your age: ");
      scanf("%d", &age);
      printf("Your age is %d\n", age);
      return 0;
  }
  ```
  注意这里需要使用变量的地址（`&age`），因为`scanf()`需要知道在哪里存储输入的数据。

**格式化字符串的安全性**：当使用`printf()`和`scanf()`时，确保提供的格式字符串与实际参数匹配，否则可能导致未定义行为。

---

### 行 I/O 函数

- `gets()`：从标准输入读取一行文本（不推荐使用，因为它不能很好地处理缓冲区溢出）。
- `puts()`：向标准输出打印字符串，并自动添加换行符。

```c
char *gets(char *s);  // 危险！已弃用
char *fgets(char *s, int size, FILE *stream);  // 安全替代
```
如何安全读取一行：
```c
char line[100];
fgets(line, sizeof(line), stdin);  // 包括换行符
```
- fgets()
- fputs()

```c
int puts(const char *s);  // 输出字符串并自动添加换行
int fputs(const char *s, FILE *stream);  // 不自动添加换行
```
**安全性问题**：避免使用`gets()`，因为其可能导致缓冲区溢出。应考虑使用`fgets()`代替。

---

### 字符 I/O 函数

单字符输入输出:

```c
int getchar(void);              // 从stdin读取一个字符
int putchar(int c);             // 向stdout输出一个字符
int getc(FILE *stream);         // 从指定流读取
int putc(int c, FILE *stream);  // 向指定流写入
```
示例：
```c
int c;
while ((c = getchar()) != EOF) {  // EOF通常是-1
    putchar(toupper(c));
}
```

---

### 文件输入输出

除了标准输入输出之外，C语言还支持文件操作，允许程序直接读写磁盘上的文件。这通常涉及到`fopen()`、`fclose()`、`fread()`、`fwrite()`等函数。

| 模式 | 描述                     |
|------|--------------------------|
| "r"  | 只读(文件必须存在)       |
| "w"  | 只写(创建/截断文件)      |
| "a"  | 追加(写入文件末尾)       |
| "r+" | 读写(文件必须存在)       |
| "w+" | 读写(创建/截断文件)      |
| "a+" | 读/追加(写入文件末尾)    |
| "b"  | 二进制模式(如"rb","w+b") |

示例：文件读写
```c
#include <stdio.h>

int main() {
    FILE *file;
    file = fopen("example.txt", "w"); // 打开文件以写模式
    if (file == NULL) {
        printf("Could not open file.\n");
        return 1;
    }
    fprintf(file, "Hello World!\n"); // 向文件写入数据
    fclose(file); // 关闭文件
    
    file = fopen("example.txt", "r"); // 重新打开文件以读模式
    if (file == NULL) {
        printf("Could not open file.\n");
        return 1;
    }
    char buffer[100];
    while (fgets(buffer, 100, file) != NULL) { // 从文件读取数据
        printf("%s", buffer);
    }
    fclose(file); // 关闭文件
    return 0;
}
```

**错误处理**：对于所有涉及文件的操作，都应该检查返回值是否为NULL，以确保操作成功完成。


---





## 控制结构

### 条件语句
- **if-else**
  ```c
  if (condition) {
      // 执行代码块
  } else {
      // 执行其他代码块
  }
  ```

### 循环语句
- **for循环**
  ```c
  for (初始化; 条件; 更新) {
      // 循环体
  }
  ```
- **while循环**
  ```c
  while (条件) {
      // 循环体
  }
  ```
- **do-while循环**
  ```c
  do {
      // 循环体
  } while (条件);
  ```

### 跳转语句
- **continue**: 结束当前循环迭代，开始下一次迭代。
- **break**: 立即退出最近的循环或switch语句。
- **goto**: 跳转到指定标签处执行代码。

## 函数定义与调用

### 函数定义
```c
int add(int a, int b) {
    return a + b;
}
```

### 函数调用
```c
int result = add(5, 3);
printf("Result: %d\n", result);
```

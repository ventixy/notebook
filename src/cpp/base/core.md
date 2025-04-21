---

order: 10
title: C语言核心特性

---

## 数组（Arrays）

在C语言中，数组是一种用于存储相同类型数据的集合的数据结构。数组是程序设计中非常重要的工具，因为它可以高效地组织和操作大量数据。

::: info 数组的定义
数组是一种用于存储相同类型数据项（elements）的集合的数据结构。每个数据项可以通过索引（index）来访问，索引从0开始。
:::

### 声明与初始化
- 一维数组（One-dimensional Arrays）的声明语法如下：
    ```c
    type array_name[size];
    ```
    - `type`：数组元素的类型（如 `int`、`float`、`char` 等）。
    - `array_name`：数组的名称。
    - `size`：数组的大小，必须是一个正整数常量或宏。
    示例：
    ```c
    int numbers[5];   // 声明一个包含5个整数的数组
    float values[10]; // 声明一个包含10个浮点数的数组
    ```

- **初始化（Initialization）**：数组可以在声明时进行初始化，也可以在后续代码中赋值。
    - 静态初始化：
    ```c
    int arr[5] = {1, 2, 3, 4, 5}; // 初始化数组
    int arr2[] = {10, 20, 30};    // 编译器会自动推断数组大小为3
    ```
    - 动态赋值：
    ```c
    int arr[5];
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 2;
    }
    ```
---

**访问数组元素（Accessing Array Elements）**：数组元素通过索引访问，索引从0开始。
  ```c
  int arr[5] = {10, 20, 30, 40, 50};
  printf("%d\n", arr[0]); // 输出：10
  printf("%d\n", arr[2]); // 输出：30
  ```

::: tip 数组越界（Array Bounds Exceeded）
C语言不会检查数组索引是否越界，访问超出范围的索引会导致未定义行为（Undefined Behavior）。
```c
int arr[5] = {1, 2, 3, 4, 5};
printf("%d\n", arr[10]); // 越界访问
```
:::

---

**数组长度（Array Length）**：C语言不直接提供获取数组长度的方法，但可以通过 `sizeof` 运算符计算数组的大小（以字节为单位），然后除以单个元素的大小来得到数组长度。
  ```c
  int arr[5] = {1, 2, 3, 4, 5};
  int length = sizeof(arr) / sizeof(arr[0]);
  printf("Array length: %d\n", length);         // 输出：5
  ```

::: important 数组作为函数参数（Arrays as Function Arguments）：
数组作为函数参数时，实际上传递的是指向数组首元素的指针（Pointer to the First Element）。
```c
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
}
```
**注意（Note）**：当数组作为函数参数传递时，它会退化为指针（pointer），因此无法通过 `sizeof` 计算数组长度。
:::

---

### 多维数组

多维数组（Multi-dimensional Arrays）：最常见的是二维数组（Two-dimensional Arrays），即矩阵（Matrix）

**声明与初始化（Declaration and Initialization）**
```c
// 声明一个3x4的二维数组
int matrix[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};
```

**访问元素（Accessing Elements）**：通过两个索引访问二维数组中的元素
```c
printf("%d\n", matrix[0][0]); // 输出：1
printf("%d\n", matrix[1][2]); // 输出：7
```

**遍历二维数组（Traversing Multi-dimensional Arrays）**：使用嵌套循环遍历二维数组：
```c
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
        printf("%d ", matrix[i][j]);
    }
    printf("\n");
}
```

**多维数组的内存布局（Memory Layout of Multi-dimensional Arrays）**：多维数组在内存中以行优先的方式存储（Row-major Order）
```c
int matrix[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};
```
在内存中，`matrix` 的布局为：`1, 2, 3, 4, 5, 6`。



---


### 字符数组与字符串

字符数组与字符串（Character Arrays and Strings）：在C语言中，字符串是以 `\0`（空字符，Null Character）结尾的字符数组。

**字符数组的声明与初始化（Declaration and Initialization of Character Arrays）**
```c
char str1[6] = {'H', 'e', 'l', 'l', 'o', '\0'};  // 手动添加空字符
char str2[] = "Hello";   // 自动添加空字符（等价于上面的写法）
```

**字符串操作（String Operations）**
- C语言提供了许多标准库函数来处理字符串，这些函数位于 `<string.h>` 头文件中。
- **常用函数（Common Functions）**：
  - `strlen()`：计算字符串长度（不包括 `\0`）。
  - `strcpy()`：复制字符串（String Copy）。
  - `strcat()`：连接两个字符串（String Concatenation）。
  - `strcmp()`：比较两个字符串（String Comparison）。
  - `strchr()` 和 `strstr()`：查找字符或子字符串（Character or Substring Search）。

::: tip 字符数组与字符串的区别
**字符数组与字符串的区别（Difference between Character Arrays and Strings）**：字符数组不一定以 `\0` 结尾，而字符串必须以 `\0` 结尾。
:::

```c
#include <stdio.h>
#include <string.h>

int main() {
    char str1[20] = "Hello";
    char str2[20] = "World";

    // 字符串长度
    printf("Length of str1: %lu\n", strlen(str1)); // 输出：5

    // 字符串复制
    strcpy(str1, str2);
    printf("After strcpy: %s\n", str1); // 输出：World

    // 字符串连接
    strcat(str1, "!");
    printf("After strcat: %s\n", str1); // 输出：World!

    // 字符串比较
    if (strcmp(str1, str2) == 0) {
        printf("Strings are equal.\n");
    } else {
        printf("Strings are not equal.\n");
    }

    return 0;
}
```

---


### 动态数组

虽然C语言本身不支持**动态数组（Dynamic Arrays）**，但可以通过动态内存分配（Dynamic Memory Allocation）实现类似功能。

**动态分配一维数组（Dynamic Allocation of One-dimensional Arrays）**
```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int size;
    printf("Enter array size: ");
    scanf("%d", &size);

    // 动态分配数组
    int *arr = (int *)malloc(size * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed.\n");
        return 1;
    }

    // 初始化数组
    for (int i = 0; i < size; i++) {
        arr[i] = i + 1;
    }

    // 打印数组
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }

    // 释放内存
    free(arr);
    return 0;
}
```

**动态分配二维数组（Dynamic Allocation of Two-dimensional Arrays）**
```c
int rows = 3, cols = 4;

// 分配行指针数组
int **matrix = (int **)malloc(rows * sizeof(int *));
for (int i = 0; i < rows; i++) {
    matrix[i] = (int *)malloc(cols * sizeof(int));
}

// 使用后释放内存
for (int i = 0; i < rows; i++) {
    free(matrix[i]);
}
free(matrix);
```

---



## 函数（Function）

C语言中的函数（Function）是程序的基本构建模块，用于封装特定的功能。通过函数，可以将复杂的任务分解为多个小的、可管理的部分，从而提高代码的可读性、可维护性和复用性。

函数是程序设计的核心工具，具有以下特点：
1. **封装性**：通过函数封装特定功能，提高代码复用性。
2. **作用域**：通过局部、全局和静态变量控制数据的可见性和生命周期。
3. **递归**：利用递归解决复杂问题，但需要注意性能和栈溢出问题。
4. **函数指针**：支持高级编程技术，如回调函数和动态调用。

---

### 函数声明与定义

函数是一段完成特定任务的代码块，可以通过名字调用。函数的定义包括返回类型、函数名、参数列表和函数体。

```c
return_type function_name(parameter_list) {
    // 函数体
}
```
- `return_type`：函数返回值的类型（如 `int`、`float`、`void` 等）。如果函数不返回值，则使用 `void`。
- `function_name`：函数的名字，需遵循标识符命名规则。
- `parameter_list`：传递给函数的参数列表，可以为空。
- `函数体`：实现功能的具体代码。

```c
int add(int a, int b) {
    return a + b;
}
```

通过函数名和参数列表调用函数，执行其功能并返回结果
```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(3, 5);
    printf("Result: %d\n", result); // 输出：Result: 8
    return 0;
}
```


::: tip 函数声明与定义的区别
- **函数声明**（Function Declaration）：也称为函数原型（Function Prototype），告诉编译器函数的名称、返回类型和参数列表。
- **函数定义**（Function Definition）：包含函数的具体实现。
```c
// 函数声明
int add(int a, int b);

int main() {
    int result = add(3, 5);
    printf("Result: %d\n", result);
    return 0;
}

// 函数定义
int add(int a, int b) {
    return a + b;
}
```

**为什么需要函数声明？**
- 当一个函数在其定义之前被调用时，编译器需要知道这个函数的签名（如返回类型、参数列表等），以确保调用方式正确。如果没有事先声明，编译器将无法识别这些信息，从而导致错误。
- **跨文件使用**：如果函数定义位于一个源文件中，而你在另一个源文件中调用此函数，则必须在调用它的文件中对该函数进行声明。这通常通过头文件（.h 文件）来实现，使得多个源文件可以共享同一个函数声明。
- **增强模块化**：通过分离声明和定义，可以提高代码的模块化程度。开发人员可以在不关心具体实现的情况下先了解函数的功能和如何使用它，这有助于团队协作和代码维护

:::


---

### 作用域（Scope）

作用域决定了变量或函数在程序中的可见性和生命周期。

1. **局部作用域（Local Scope）**: 局部变量在函数内部声明，只能在该函数内访问。
  ```c
  void func() {
      int x = 10; // 局部变量
      printf("%d\n", x);
  }

  int main() {
      func();
      // printf("%d\n", x); // 错误：x 不在作用域内
      return 0;
  }
  ```

2. **全局作用域（Global Scope）**: 全局变量在所有函数外部声明，可以在整个程序中访问。
  ```c
  int global_var = 20; // 全局变量

  void func() {
      printf("%d\n", global_var);
  }

  int main() {
      func();
      printf("%d\n", global_var);
      return 0;
  }
  ```

3. **块作用域（Block Scope）**: 在 `{}` 中声明的变量具有块作用域，仅在该块内可见。
  ```c
  int main() {
      if (1) {
          int x = 10; // 块作用域
          printf("%d\n", x);
      }
      // printf("%d\n", x); // 错误：x 不在作用域内
      return 0;
  }
  ```

---

### `static` 关键字

`static` 关键字用于改变变量或函数的作用域和生命周期。

1. **静态局部变量（Static Local Variables）**
- 静态局部变量在函数内部声明，但其生命周期贯穿整个程序运行期间。
- 每次函数调用时，静态局部变量保留其之前的值。
```c
#include <stdio.h>

void counter() {
    static int count = 0; // 静态局部变量
    count++;
    printf("Count: %d\n", count);
}

int main() {
    counter(); // 输出：Count: 1
    counter(); // 输出：Count: 2
    counter(); // 输出：Count: 3
    return 0;
}
```

2. **静态全局变量（Static Global Variables）**: 静态全局变量只能在声明它的文件中访问，无法被其他文件引用。
```c
// 文件1.c
static int global_var = 10; // 静态全局变量

void func() {
    printf("%d\n", global_var);
}

// 文件2.c
extern int global_var; // 错误：global_var 无法被外部文件访问
```

3. **静态函数（Static Functions）**: 静态函数只能在声明它的文件中调用，无法被其他文件引用。
```c
// 文件1.c
static void helper() { // 静态函数
    printf("Helper function\n");
}

void func() {
    helper();
}

// 文件2.c
extern void helper(); // 错误：helper 无法被外部文件访问
```

---

### 递归（Recursion）

递归是指函数直接或间接地调用自身。递归通常用于解决可以分解为子问题的问题，如阶乘、斐波那契数列等。

1. **递归的基本结构**
- **基准条件（Base Case）**：递归的终止条件。
- **递归条件（Recursive Case）**：调用自身的部分。

```c
// 示例：计算阶乘
#include <stdio.h>

int factorial(int n) {
    if (n == 0) { // 基准条件
        return 1;
    } else {
        return n * factorial(n - 1); // 递归条件
    }
}

int main() {
    int result = factorial(5);
    printf("Factorial of 5: %d\n", result); // 输出：Factorial of 5: 120
    return 0;
}
```

2. **递归的优缺点**
- **优点**：
  - 代码简洁，易于理解。
  - 适用于分治法（Divide and Conquer）和回溯算法（Backtracking）。
- **缺点**：
  - 可能导致栈溢出（Stack Overflow），尤其是递归深度过大时。
  - 性能可能不如迭代（Iteration）高效。

**优化递归**：
- 使用尾递归（Tail Recursion）优化：确保递归调用是函数的最后一行操作。
- 示例：
  ```c
  int factorial_tail_recursive(int n, int result) {
      if (n == 0) {
          return result;
      } else {
          return factorial_tail_recursive(n - 1, n * result);
      }
  }

  int factorial(int n) {
      return factorial_tail_recursive(n, 1);
  }
  ```
  尾递归优化可以避免每次递归调用时都需要保存函数的局部变量和返回地址，从而减少栈的使用。参照：https://www.cnblogs.com/cpcpp/p/13539336.html

---

### 函数指针

函数指针（Function Pointers）是指向函数的指针变量，可以用于回调函数（Callback Function）等场景
```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

int main() {
    int (*operation)(int, int); // 函数指针

    operation = add;
    printf("Add: %d\n", operation(3, 5)); // 输出：Add: 8

    operation = subtract;
    printf("Subtract: %d\n", operation(3, 5)); // 输出：Subtract: -2

    return 0;
}
```

---


## 指针（Pointer）

指针（Pointer）是C语言的核心特性之一。通过指针，程序员可以直接操作内存地址，从而实现高效的数据处理和灵活的程序设计。
::: tip 什么是指针？
- 指针是一个变量，其值为另一个变量的内存地址。
- 指针允许我们直接访问和修改内存中的数据。

```c
type *pointer_name;
```
- `type`：指针指向的数据类型（如 `int`、`float`、`char` 等）。
- `*`：声明指针的关键符号。
- `pointer_name`：指针变量的名字。

```c
int x = 10; // 定义一个整型变量
int *p = &x; // 定义一个指向整型的指针，并将其初始化为 x 的地址
```
:::


---

### 取地址与解引用

1. **取地址运算符（&）**： `&` 运算符用于获取变量的内存地址。
  ```c
  int x = 10;
  printf("Address of x: %p\n", (void*)&x); // 输出 x 的地址
  ```

2. **解引用运算符（*）**： `*` 运算符用于访问指针所指向的内存地址中的值。
  ```c
  int x = 10;
  int *p = &x;
  printf("Value of x: %d\n", *p); // 输出：10
  ```


---

### 常见指针运算

指针支持多种运算，包括加法、减法、比较等。

1. **指针加法与减法**
- 指针加法或减法会根据指针的类型自动调整偏移量。
- 假设 `p` 是一个指向 `int` 类型的指针，则 `p + 1` 实际上会将指针移动 `sizeof(int)` 字节。

```c
int arr[5] = {1, 2, 3, 4, 5};
int *p = arr; // p 指向数组的第一个元素
printf("Value at p: %d\n", *p); // 输出：1
p++; // 移动到下一个元素
printf("Value at p: %d\n", *p); // 输出：2
```

#### 2. **指针之间的减法**
- 两个指针相减的结果是它们之间的元素个数（而非字节数）。
  ```c
  int arr[5] = {1, 2, 3, 4, 5};
  int *p1 = &arr[1];
  int *p2 = &arr[4];
  printf("Difference: %ld\n", p2 - p1); // 输出：3
  ```

3. **指针的比较**
- 可以使用关系运算符（如 `<`、`>`、`==` 等）比较两个指针。
  ```c
  int arr[5] = {1, 2, 3, 4, 5};
  int *p1 = &arr[1];
  int *p2 = &arr[3];
  if (p1 < p2) {
      printf("p1 points to a lower address than p2.\n");
  }
  ```


---



### 多级指针和空指针

在C语言中，多级指针（Multilevel Pointers）是指指向指针的指针。它们用于处理更复杂的数据结构和动态内存管理场景。

- 多级指针指的是一个指针变量存储另一个指针的地址。
- 每增加一级指针，就需要在声明时多加一个 `*` 符号。

```c
int x = 10;
int *p1 = &x; // p1 是指向 int 的一级指针
int **p2 = &p1; // p2 是指向 int* 的二级指针
int ***p3 = &p2; // p3 是指向 int** 的三级指针

// 使用多个 `*` 运算符来逐层解引用，直到获取到最终的值
printf("%d\n", ***p3); // 输出：10
```

---

**多级指针的应用**:

#### 1. **动态二维数组**
多级指针常用于动态分配和管理二维数组。

**示例**：创建一个动态二维整数数组
```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int rows = 3, cols = 4;
    int **matrix;

    // 分配行指针数组
    matrix = (int **)malloc(rows * sizeof(int *));
    for (int i = 0; i < rows; i++) {
        matrix[i] = (int *)malloc(cols * sizeof(int));
    }

    // 初始化矩阵
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            matrix[i][j] = i * cols + j;
        }
    }

    // 打印矩阵
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%d ", matrix[i][j]);
        }
        printf("\n");
    }

    // 释放内存
    for (int i = 0; i < rows; i++) {
        free(matrix[i]);
    }
    free(matrix);

    return 0;
}
```

#### 2. **函数参数传递**
多级指针可以用来修改函数外部的指针变量，从而实现更复杂的参数传递。

**示例**：交换两个指针变量的值
```c
#include <stdio.h>

void swapPointers(int **a, int **b) {
    int *temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    int *ptr1 = &x, *ptr2 = &y;

    printf("Before swap: ptr1 = %d, ptr2 = %d\n", *ptr1, *ptr2);
    swapPointers(&ptr1, &ptr2);
    printf("After swap: ptr1 = %d, ptr2 = %d\n", *ptr1, *ptr2);

    return 0;
}
```

#### 3. **字符串操作**
多级指针也常用于处理字符串数组或动态字符串列表。

**示例**：动态字符串数组
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    char *names[] = {"Alice", "Bob", "Charlie"};
    char **dynamicNames = (char **)malloc(3 * sizeof(char *));
    
    // 复制字符串到动态数组
    for (int i = 0; i < 3; i++) {
        dynamicNames[i] = (char *)malloc(strlen(names[i]) + 1);
        strcpy(dynamicNames[i], names[i]);
    }

    // 打印动态数组中的字符串
    for (int i = 0; i < 3; i++) {
        printf("%s\n", dynamicNames[i]);
    }

    // 释放内存
    for (int i = 0; i < 3; i++) {
        free(dynamicNames[i]);
    }
    free(dynamicNames);

    return 0;
}
```

#### 4. **链表节点**
在链表数据结构中，节点通常包含指向下一个节点的指针。对于双向链表或多级链表，可能需要使用多级指针。

**示例**：单向链表节点
```c
struct Node {
    int data;
    struct Node *next;
};

// 创建新节点
struct Node* createNode(int data) {
    struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

// 插入节点
void insertNode(struct Node **head, int data) {
    struct Node *newNode = createNode(data);
    if (*head == NULL) {
        *head = newNode;
    } else {
        struct Node *current = *head;
        while (current->next != NULL) {
            current = current->next;
        }
        current->next = newNode;
    }
}
```

::: tip 注意事项

#### 1. **内存管理**
- 使用多级指针时，必须小心管理内存，确保所有分配的内存都被正确释放，以避免内存泄漏。
- 对于每级指针分配的内存，都需要调用相应的 `free` 函数进行释放。

#### 2. **指针初始化**
- 在使用多级指针之前，应该将其初始化为 `NULL` 或者有效地址，否则可能导致未定义行为（Undefined Behavior）。

#### 3. **解引用错误**
- 解引用多级指针时要特别小心，确保每一层指针都指向有效的内存地址，否则会导致段错误（Segmentation Fault）。

:::

多级指针提供了强大的功能，使得我们可以处理更加复杂的数据结构和内存管理需求。通过掌握多级指针的概念及其应用，如动态二维数组、函数参数传递、字符串操作以及链表节点等，能够编写出更加高效和灵活的C语言程序。然而，使用多级指针也需要谨慎对待，特别是在内存管理和指针初始化方面，以避免常见的错误和问题。

---

::: info 空指针（NULL Pointer）
空指针是一个特殊的指针值，表示指针不指向任何有效的内存地址。
  ```c
  int *p = NULL; // 定义一个空指针
  if (p == NULL) {
      printf("Pointer is NULL.\n");
  }
  ```
:::


---

### 指针与数组

指针和数组在C语言中密切相关，许多操作可以通过指针来完成。

#### 1. **数组名是指针常量**
- 数组名本质上是一个指向数组第一个元素的指针常量。
  ```c
  int arr[5] = {1, 2, 3, 4, 5};
  int *p = arr; // 等价于 int *p = &arr[0];
  printf("First element: %d\n", *p); // 输出：1
  ```

#### 2. **通过指针访问数组元素**
- 可以通过指针加法和解引用运算符访问数组中的元素。
  ```c
  int arr[5] = {1, 2, 3, 4, 5};
  int *p = arr;
  for (int i = 0; i < 5; i++) {
      printf("%d ", *(p + i)); // 输出：1 2 3 4 5
  }
  ```

#### 3. **指针作为数组参数**
- 当数组作为函数参数传递时，实际上传递的是指向数组首元素的指针。
  ```c
  void printArray(int *arr, int size) {
      for (int i = 0; i < size; i++) {
          printf("%d ", *(arr + i));
      }
  }

  int main() {
      int arr[5] = {1, 2, 3, 4, 5};
      printArray(arr, 5);
      return 0;
  }
  ```

::: info 指针与字符串

在C语言中，字符串是以 `\0` 结尾的字符数组，因此指针经常用于处理字符串。

#### 1. **字符串指针**
- 字符串字面量本质上是一个字符数组，可以通过指针访问。
  ```c
  char str[] = "Hello";
  char *p = str;
  printf("String: %s\n", p); // 输出：Hello
  ```

#### 2. **字符串操作**
- 许多字符串操作函数（如 `strlen`、`strcpy` 等）都依赖指针。
  ```c
  #include <stdio.h>
  #include <string.h>

  int main() {
      char src[] = "Hello";
      char dest[20];

      strcpy(dest, src); // 复制字符串
      printf("Copied string: %s\n", dest);

      printf("Length: %lu\n", strlen(src)); // 输出长度
      return 0;
  }
  ```
:::

---

### 指针与函数

指针可以作为函数参数或返回值，使函数更加灵活。

#### 1. **指针作为函数参数**
- 使用指针作为参数可以避免复制大量数据，并允许函数直接修改原始数据。
  ```c
  void swap(int *a, int *b) {
      int temp = *a;
      *a = *b;
      *b = temp;
  }

  int main() {
      int x = 10, y = 20;
      swap(&x, &y);
      printf("x: %d, y: %d\n", x, y); // 输出：x: 20, y: 10
      return 0;
  }
  ```

#### 2. **指针作为函数返回值**
- 函数可以返回一个指针，通常用于动态分配的内存或全局变量。
  ```c
  int* createArray(int size) {
      int *arr = (int*)malloc(size * sizeof(int));
      if (arr == NULL) {
          printf("Memory allocation failed.\n");
          exit(1);
      }
      return arr;
  }

  int main() {
      int *arr = createArray(5);
      for (int i = 0; i < 5; i++) {
          arr[i] = i + 1;
      }
      for (int i = 0; i < 5; i++) {
          printf("%d ", arr[i]);
      }
      free(arr);
      return 0;
  }
  ```

#### 3. **函数指针**
- 函数指针是指向函数的指针，可以用于回调函数（Callback Function）等场景。
  ```c
  #include <stdio.h>

  int add(int a, int b) {
      return a + b;
  }

  int subtract(int a, int b) {
      return a - b;
  }

  int main() {
      int (*operation)(int, int); // 函数指针

      operation = add;
      printf("Add: %d\n", operation(3, 5)); // 输出：Add: 8

      operation = subtract;
      printf("Subtract: %d\n", operation(3, 5)); // 输出：Subtract: -2

      return 0;
  }
  ```


---


## 动态内存管理

指针常用于动态分配内存。

#### 1. **动态分配内存**
- 使用 `malloc`、`calloc` 和 `realloc` 动态分配内存。
- 示例：
  ```c
  int *arr = (int*)malloc(5 * sizeof(int));
  if (arr == NULL) {
      printf("Memory allocation failed.\n");
      return 1;
  }
  for (int i = 0; i < 5; i++) {
      arr[i] = i + 1;
  }
  free(arr); // 释放内存
  ```

#### 2. **内存泄漏**
- 如果忘记释放动态分配的内存，会导致内存泄漏。
- 示例：
  ```c
  void memoryLeak() {
      int *p = (int*)malloc(sizeof(int));
      // 忘记释放内存
  }
  ```

---


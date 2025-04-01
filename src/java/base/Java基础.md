---

order: 20
title: Java入门语法

---



## 变量和数据类型

### 变量和标识符

#### 1. 变量

​    The Java programming language uses both "fields" and "variables" as part of its terminology

​    变量就是系统为程序分配的一块内存单元，用来存储各种类型的数据。由于该存储单元中的数据可以发生改变，因此得名为"变量"

- 按所属的数据类型划分为：基本数据类型变量、引用数据类型变量
- 按被声明的位置划分：
  - 局部变量：方法或语句块内部定义的变量 
  - 成员变量：方法外部、类的内部定义的变量

#### 2. 标识符

Java 对包、类、方法、参数和变量等要素命名时使用的字符序列称为标识符。

规则如下: 

- 由字母、数字、下划线（_）和美元符号（$）组成。

- 不能以数字开头、区分大小、长度无限制。 

- 不能是 Java 中的保留关键字。 

命名规范： （建议） 

- 变量名规范：全部小写

- 类名规范：首字母大写，后面每个单词首字母大写（大驼峰式）

- 方法名规范： 首字母小写，后面每个单词首字母大写（小驼峰式）

#### 3. Java关键字

|            |              |           |            |        |
| ---------- | ------------ | --------- | ---------- | ------ |
| abstract   | assert       | boolean   | break      | byte   |
| case       | catch        | char      | class      | const  |
| continue   | default      | do        | double     | else   |
| enum       | extends      | final     | finally    | float  |
| for        | goto         | if        | implements | import |
| instanceof | int          | interface | long       | native |
| new        | package      | private   | protected  | public |
| return     | strictfp     | short     | static     | super  |
| switch     | synchronized | this      | throw      | throws |
| transient  | try          | void      | volatile   | while  |



### 基本数据类型

![](https://image.ventix.top/java/image-20211001100736886.png)

- char类型的字面量值需要用单引号括起来：如：'A' , '3' …..

- Java中的布尔类型占用多少个字节？  [Oracle文档的描述](http://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html) ：
  
  boolean: The boolean data type has only two possible values: true and false. Use this data type for simple flags that track true/false conditions. This data type represents one bit of information, but its "size" isn't something that's precisely defined.
  
  结论是取决于具体的java虚拟机，《Java虚拟机规范》一书中给出了 4个字节（boolean数组1个字节）的定义

- 默认值指的是动态初始化数组时的情形，其余情况下，栈上的局部变量是没有默认值的，声明局部变量后必须显式的初始化，否则无法使用

### 前缀和后缀

- **各数制的前缀：**
  
  | 二进制    | 八进制 | 十六进制   |
  |:------:|:---:|:------:|
  | 0b(0B) | 0   | 0x(0X) |
  
  ```java
  int a = 0b01001001;  // 二进制数：0100 1001   (十进制的 73)
  int b = 02316;       // 八进制数：2316        (十进制的 1230)
  int c = 0x54b3;      // 十六进制：54b3        (十进制的 21683)
  ```

- **数字的后缀：**
  
  - 长整型有一个后缀 L(推荐大写字母)
  - float类型的数值有一个后缀 F(f)
  - 没有后缀F的浮点数值（如3.14）默认为double类型。 当然，也可以在浮点数值后面添加后缀D或d（例如，3.14D）

### 数据类型转换

1. 数值类型之间的隐式转换：
- 如果两个操作数中有一个是double类型，另一个操作数就会转换为double类型

- 否则，如果其中一个操作数是float类型，另一个操作数将会转换为float类型

- 否则，如果其中一个操作数是long类型，另一个操作数将会转换为long类型

- 否则，两个操作数都将被转换为int类型
  
  ```java
  byte a1 = 11;
  byte a2 = 12;
  byte r1 = a1 + a2; // 报错！ a1 和 a2 进行运算会导致类型提升，结果为int
  ```
  
  ```java
  // 需要注意的是两个字面值常量或final常量相加并不会出现上述情况 （编译器优化）
  byte b = 12 + 12;  // √
  
  final byte b1 = 1;
  final byte b2 = 2;
  byte result = b1 + b2;  // √
  ```
2. 强制类型转换：（有可能造成精度降低或数据溢出，使用时要小心）
   
   ```java
   double num = 6.36;
   
   //强制转换: 在圆括号中给出想要转换的目标类型，后面紧跟待转换的变量名
   int i = (int)num;      //i=6 （数据丢失了小数部分）
   ```




## 基本输入输出

```java
//java键盘输入
import java.util.Scanner; 

Scanner sc = new Scanner(System.in);
String name = sc.next();                      // 输入字符串
int age = sc.nextInt();                       // 输入整数
double score = sc.nextDouble();               // 输入浮点数


//输出到控制台
System.out.println(1111);                //换行打印
System.out.print(1111);                  //不换行打印
System.out.write(2222);                  //字节输出
System.out.printf("%+8.3f\n", 3.14);     //按格式输出
```

### 输入类型判断

```java
//使用 hasNextInt() 判断输入类型
long Long;
String string;
double Double;
Scanner sc =new Scanner(System.in);
System.out.println("输入一个数");
if(sc.hasNextInt()){
    Long = sc.nextLong();
    System.out.println("您输入的是一个整数:"+Long);
}else if(sc.hasNextDouble()){
    Double = sc.nextDouble();
    System.out.println("您输入的是一个小数:"+Double);
}else if (sc.hasNext()){
    string = s.nextLine();
    System.out.println("您输入的是一个字符串:"+string);
}
```

### 转义字符

| 转义字符  | 作用                    | ASCII码 |
|:-----:|:---------------------:|:------:|
| \n    | 换行，将当前位置移到下一行开头       | 010    |
| \r    | 回车 ，将当前位置移到本行开头       | 013    |
| \t    | 水平制表(HT) （跳到下一个TAB位置） | 009    |
| `\\`  | 代表一个反斜线字符             | 092    |
| `\'`  | 代表一个单引号（撇号）字符         | 039    |
| `\''` | 代表一个双引号字符             | 034    |




## Java运算符

### 常用运算符
#### 算术运算符

| 运算符 | 运算    | 示例（`a=1, b=2`）                        |
|:---:|:-----:| ------------------------------------- |
| +   | 加     | `a + b  --> 3`                        |
| -   | 减     | `a - b  --> -1`                       |
| *   | 乘     | `a * b --> 2`                         |
| /   | 整除    | `a / b --> 0`                         |
| %   | 取模/求余 | `a % b --> 1`    （ 运算结果的符号与第一个操作数相同 ） |
| ++  | 自增    | `a++ 或 ++a --> a=2`                   |
| --  | 自减    | `b-- 或 --b --> b=1`                   |

#### 赋值运算符

| 运算符 | 描述  | 示例（`a=1, b=2`）             |
|:---:|:---:| -------------------------- |
| =   | 赋值  | `a = b , a = 2 `           |
| +=  | 加等于 | `a += b  <--> a = a + b`   |
| -=  | 减等于 | `a -= b  <--> a = a - b`   |
| *=  | 乘等于 | ``a *= b  <--> a = a * b`` |
| /=  | 除等于 | `a /= b  <--> a = a / b`   |
| %=  | 模等于 | `a %= b  <--> a = a % b`   |

#### 关系运算符

| 运算符 | 运算   | 示例（`a=1, b=2`）                                      |
|:---:|:----:| --------------------------------------------------- |
| >   | 大于   | `a > b  --> false`                                  |
| <   | 小于   | `a < b  --> true`                                   |
| >=  | 大于等于 | `a >= b --> false`                                  |
| <=  | 小于等于 | `a <= b --> true`                                   |
| ==  | 等于   | `a == b --> false` （基本数据类型比较值是否相等，引用类型则比较对象的地址是否相等） |
| !=  | 不等于  | `a != b --> true`                                   |

#### 布尔逻辑运算符

| 运算符          | 运算  | 说明                                             |
|:------------:|:---:| ---------------------------------------------- |
| &            | 与   | a`&`b，a和b都是true，结果为true，否则为false               |
| &#124;       | 或   | a &#124; b，a和b都是false，结果为false，否则为true         |
| ^            | 异或  | a`^`b，a和b结果不同为true，相同为false                    |
| !            | 非   | `!`a，结果和a的结果正好相反                               |
| &&           | 短路与 | 作用和`&`相同，但是有短路效果(短路：即只要其中一个可以确定表达式，其余不执行)      |
| &#124;&#124; | 短路或 | 作用和 &#124; 相同，但是有短路效果(短路：即只要其中一个可以确定表达式，其余不执行) |


#### 三目运算符

```java
/** X ? Y : Z  (X 为 boolean 类型表达式)
*  先计算 x 的值，若为 true，整个三目运算的结果为 表达式 y 的值，否则整个运算结果为 表达式 z 的值
*/

int a = -5;
int res = (a>=0) ? a : -a   //求绝对值
```

#### 字符串连接运算符

```java
String str1 = "He" + "llo";  //结果"Hello"
String str2 = "X" + 123；    //结果"X123"
```



### 位运算符

| 运算符    | 运算      | 示例说明                                                      |
|:------:|:-------:| --------------------------------------------------------- |
| <<     | 左移      | `a << 1` ：将a向左移动1位（在低位补0） 相当于 a*2<sup>1</sup>             |
| >>     | 右移      | `a >> 2` ：将a向右移动2位（值为正，高位补0，值为负，高位补1） 相当于 a/2<sup>2</sup> |
| >>>    | "无符号"右移 | `a >>> 3` ：将a向右移动3位（无论正负，都在高位补0） 相当于 a*2<sup>3</sup>      |
| &      | 与       | 只有 1 & 1 = 1，    1 & 0 = 0  ，  0 & 0 = 0                  |
| &#124; | 或       | 只有 0 &#124; 0 = 0，    1 &#124; 0 = 1  ，  1 &#124; 1 = 1   |
| `^`    | 异或      | 只有 0 `^` 1 = 1，    1 `^` 1 = 0  ，  0 `^` 0 = 0            |
| `~`    | 按位取反    | 只是简单的把二进制补码取反（不论符号位是正是负）                                  |

**异或运算的四个性质**：

**1）交换律**：可任意交换运算因子的位置，结果不变。 即a ^ b = b ^ a

**2）结合律**：（a ^ b）^ c  =  a ^ (b ^ c)

**3）**对于任何数x，都有x ^ x = 0， x ^ 0 = x， 即**同自己求异或为0，同0求异或为自己。**

**4）自反性** ：连续和同一个因子做异或运算，最终结果为自己：A ^ B ^ B = A ^ 0 = A

```java
// 交换两个整数的值
public class Demo {
    public static void main(String[] args) {
        int a = 3, b = 5;
        System.out.println("交换前：a = " + a + " , b = " + b); 

        //方法一：借助第三个变量交换
//        int temp = a;
//        a = b;
//        b = temp;

        //方法二 (数据较大时可能会出现精度损失)
//        a = a + b;
//        b = a - b;
//        a = a - b;

        /*方法三：使用位运算符
         *（异或 ^ ） : 1 ^ 0 = 1, 1 ^ 1 = 0, 0 ^ 0 = 0  ==> 
         *  1. 两个相同的数异或结果为0
         *  2. 任意整数与0异或，结果还是其本身
         *  3. 一个数连续和同一个数做异或运算，最终结果为自己
         */
        a = a ^ b;  
        b = a ^ b;   // 3^5^5
        a = a ^ b;   // 3^5^3

        System.out.println("交换后：a = " + a + " , b = " + b);

    }
}
```


### 运算符优先级

[Oracle给出的优先级](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html) operators in the following table are listed according to precedence order

| Operators            | Precedence                                                             |
|:--------------------:|:---------------------------------------------------------------------- |
| postfix              | expr++       expr--                                                    |
| unary                | ++expr      --expr        +expr    -expr     ~    !                    |
| multiplicative       | *     /    %                                                           |
| additive             | +    -                                                                 |
| shift                | <<     >>     >>>                                                      |
| relational           | <    >    <=    >=   instanceof                                        |
| equality             | ==   !=                                                                |
| bitwise AND          | &                                                                      |
| bitwise exclusive OR | ^                                                                      |
| bitwise inclusive OR | \|                                                                     |
| logical AND          | &&                                                                     |
| logical OR           | \|\|                                                                   |
| ternary              | ?  :                                                                   |
| assignment           | =    +=    -=    *=    /=    %=    &=   ^=   \|=    <<=    >>=    >>>= |



## 流程控制语句

1996 年，计算机科学家 Bohm 和 Jacopini 证明了：任何简单或复杂的算法都可以由**顺序结构、分支结构和循环结构**这三种基本 结构组合而成。它们的共同点是都包含一个入口和一个出口，它们的每个代码都有机会被执行，不会出现死循环。

- 顺序结构： 顺序结构是一种基本的控制结构，它按照语句出现的顺序执行操作 
- 分支结构 ：分支结构又被称为选择结构，根据条件成立与否来执行操作
- 循环结构： 循环结构是一种重复结构，如果条件成立，它会重复执行某一循环体，直到出现不满足的条件为止

### if 条件语句

The `if-then` statement is the most basic of all the control flow statements. 

It tells your program to execute a certain section of code *only if* a particular test evaluates to `true`.

```java
int testscore = 76;
char grade;

if (testscore >= 90) {
    grade = 'A';
} else if (testscore >= 80) {
    grade = 'B';
} else if (testscore >= 70) {
    grade = 'C';
} else if (testscore >= 60) {
    grade = 'D';
} else {
    grade = 'F';
}
```

### switch 语句

the `switch` statement can have a number of possible execution paths. 

A `switch` works with the `byte`, `short`, `char`, and `int` primitive data types. 

It also works with *enumerated types* , the [`String`](https://docs.oracle.com/javase/8/docs/api/java/lang/String.html) class, and a few special classes that wrap certain primitive types:

[`Byte`](https://docs.oracle.com/javase/8/docs/api/java/lang/Byte.html), [`Short`](https://docs.oracle.com/javase/8/docs/api/java/lang/Short.html), [`Character`](https://docs.oracle.com/javase/8/docs/api/java/lang/Character.html) and [`Integer`](https://docs.oracle.com/javase/8/docs/api/java/lang/Integer.html)

```java
int month = 8;
String season;
switch (month) {
    case 12: case 1: case 2:  
        season = "Winter";
        break;
    case 3: case 4: case 5:  
        season = "Spring";
        break;
    case 6: case 7: case 8:  
        season = "Summer";
        break;
    case 9: case 10: case 11:  
        season = "Autumn";
        break;
    default: 
        season = "Invalid month";
        break;
}
System.out.println(month + "月：" + season);
```

### while 循环

The `while` statement continually executes a block of statements while a particular condition is `true`. 

Its syntax can be expressed as:

```java
while (expression) {
     statement(s)
}
```

### do-while 循环

`do-while` evaluates its expression at the bottom of the loop instead of the top.

Therefore, the statements within the `do` block are always executed at least once

```java
do {
     statement(s)
} while (expression);
```

### for 循环

The `for` statement provides a compact way to `iterate over`(遍历) a range of values. Programmers often refer to it as the "for loop" because of the way in which it repeatedly loops until a particular condition is satisfied

```java
for (initialization; termination; increment) {
    statement(s)
}
```

- The *initialization* expression initializes the loop; it's executed once, as the loop begins.
- When the *termination* expression evaluates to `false`, the loop terminates.
- The *increment* expression is invoked after each iteration through the loop; it is perfectly acceptable for this expression to increment *or* decrement a value.

```java
for(int i = 1; i < 11; i++){
    System.out.println("Count is: " + i);
}
```

### break和continue

- break的作用是跳出当前循环块（for、while、do while）或程序块（switch）
- continue用于结束循环体中其后语句的执行，并跳回循环程序块的开头执行下一次循环
- break和continue可以配合语句标签使用

```java
label:
for (int i = 1; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
        if (j == 9) break label;
    }
}
```


## 方法（函数）

方法用于封装一段特定的逻辑功能。方法的主要要素有：权限修饰符 方法名、参数列表和返回值

```java
//格式：
权限修饰符 返回值类型声明 方法名称(参数列表){
    方法中封装的逻辑功能;
    return 返回值;
}
```

1. 权限修饰符

| 修饰符       | 同类  | 同包  | 子类（不同包） | 非子类（不同包） |
|:---------:|:---:|:---:|:-------:|:--------:|
| private   | √   |     |         |          |
| default   | √   | √   |         |          |
| protected | √   | √   | √       |          |
| public    | √   | √   | √       | √        |

2. 返回值：方法调用结束后可以返回一个数据，称之为返回值
   
   - 方法在声明时必须指定返回值的类型
   - 通过 return 语句返回，return 语句的作用在于结束方法且将数据返回
   - 如果方法没有返回值（即方法不需要返回数据），需将返回值类型声明为 void

3. 参数列表
   
   - 在调用时传递给方法，需要被方法处理的数据
   
   - 在方法定义时，需要声明该方法所需要的参数变量
   
   - 在方法调用时，会将实际参数值传递给方法的参数变量
   
   - 必须保证传递参数的类型和个数符合方法的声明

4. 形式参数和实际参数
   
   - 形式参数：是在定义函数名和函数体的时候使用的参数,目的是用来接收调用该函数时传入的参数
   - 实际参数：在调用有参函数时，主调函数和被调函数之间有数据传递关系。在主调函数中调用一个函数时，函数名后面括号中的参数称为“实际参数”。
   
   ```java
   public class Demo {
       public static void main(String[] args) {
           print("Tom");  //实参
       }
   
       public static void print(String name){ // 此处name为形参
           System.out.println(name);
       }
   }
   ```

### 可变参数

Java1.5提供了一个叫varargs的新功能，就是可变长度的参数。"Varargs"是"variable number of arguments"的意思。有时候也被简单的称为"variable arguments"。

定义实参个数可变的方法：只要在一个形参的"类型"与"参数名"之间加上三个连续的"."（即"..."，英文里的句中省略号），就可以让它和不确定个实参相匹配。

```java
public class Demo {
    static int sumVarargs(int... arr){
        int sum = 0;
        for(int i=0; i< arr.length; i++) {
            sum += arr[i];
        }
        return(sum);
    }
    public static void main(String args[]){
        int sum = sumVarargs(12, 23, 23, 24);
        System.out.println("和为: " + sum);    // 82
    }
}
```

- 每个方法只能有一个这样可变形参，且这个形参必须是形参列表的最后一个。

- 上面所说的不确定也包括0，所以不给可变参数传递实参也是可以的，注意这时传递的是一个空数组（int[]{}）而不是null。

### 参数传递

**为什么说Java中只有值传递？** 首先要明确`值传递`和`引用传递`的概念，一些常见的错误理解：

- 错误理解一：值传递和引用传递，区分的条件是传递的内容，如果是个值，就是值传递。如果是个引用，就是引用传递。
- 错误理解二：Java是引用传递。
- 错误理解三：传递的参数如果是普通类型，那就是值传递，如果是对象，那就是引用传递。

::: info 值传递（pass by value）和引用传递（pass by reference）
#### 值传递（pass by value）

是指在调用函数时将实际参数复制一份传递到函数中，这样在函数中如果对参数进行修改，将不会影响到实际参数。

#### 引用传递（pass by reference）

是指在调用函数时将实际参数的地址直接传递到函数中，那么在函数中对参数所进行的修改，将影响到实际参数。

=> 判断值传递和引用传递的依据就是函数中的修改是否影响到了**实际参数**；
:::

下面先看看java中基本数据类型的传递：

```java
public static void tripleValue(double x){
    x = x*3;
} 
public static void main(String[] args){ 
    double percent = 10; 
    tripleValue(percent);           // 调用函数后x为percent的拷贝
    System.out.println(percent) ;   // 结果x=30, 不出所料，原来的percent未改变
}
```

基本数据类型的值传递没有什么争议，关键在于对象的传递：

```java
 public static void swap(Employee a, Employee b){
     Employee temp = a;
     a = b;
     b = temp;
 }
 public static void main(String[] args){
     Employee a = new Employee("harry", 5000, 33);
     Employee b = new Employee("tony", 5600, 36);  // 创建两个Employee对象

    swap(a,b);  // 见下图：
}
```

![](https://image.ventix.top/java/image-20211009001020786.png)

上述的例子中，关键点在于参数传递过程中a, b所代表的的是对象的地址，在交换过程中，只是将其地址拷贝一份后再交换，根本影响不到a, b的地址值。如果在有些函数中有修改对象的属性，从而会导致所传递的参数变化了，但要明白其本质：是其指向的对象变化，传递的地址值根本没变过！

还有一种说法叫做 **按共享传递** (call by sharing) ：

按共享传递，是指在调用函数时，传递给函数的是实参的地址的拷贝（如果实参在栈中，则直接拷贝该值），这正是Java中的参数传递方式。在函数内部对参数进行操作时，需要先拷贝的地址寻找到具体的值，再进行操作。如果该值在栈中，那么因为是直接拷贝的值，所以函数内部对参数进行操作不会对外部变量产生影响。如果原来拷贝的是原值在堆中的地址，那么需要先根据该地址找到堆中对应的位置，再进行操作。因为传递的是地址的拷贝所以函数内对值的操作对外部变量是可见的。

【总结】Java中的传递，是值传递，而这个值，实际上是对象的引用。**而按共享传递其实只是按值传递的一个特例**，所以我们可以说Java的传递是按共享传递，或者说Java中的传递是值传递。

### 递归(recursion)

递归，在数学与计算机科学中，是指在方法的定义中使用方法自身。也就是说，递归算法是一种直接或者间接调用自身方
法的算法。**递归中的“递”就是入栈，“归”就是出栈**。

```java
/**斐波那契数列（Fibonacci sequence），又称黄金分割数列，
 * 因数学家莱昂纳多·斐波那契（Leonardo Fibonacci）以兔子繁殖为例子而引入，故又称为“兔子数列”，
 * 指的是这样一个数列：0、1、1、2、3、5、8、13、21、34、……
 * 在数学上，斐波那契数列以如下被以递推的方法定义：F(0)=0，F(1)=1, F(n)=F(n - 1)+F(n - 2)（n ≥ 2，n ∈ N*）
 * */
public class Fibonacci {
    public static void main(String[] args) {
        //System.out.println(fibonacciByRecursion(64));
        System.out.println(fibonacci(64));
    }

    public static int fibonacciByRecursion(int n) {
        if(n <= 1) return n;
        return fibonacciByRecursion(n - 1) + fibonacciByRecursion(n - 2);
    }

    public static int fibonacci(int n) {
        if(n <= 1) return n;

        int previousTwo = 0;
        int previous = 1;
        for (int i = 2; i <= n; i++) {
            int temp = previous + previousTwo;
            previousTwo = previous;
            previous = temp;
        }
        return previous;
    }
}
```

该例中，递归方式的时间复杂度是最高的 O(2<sup>n</sup>)，普通计算机最多只能求解到60左右就显得无能为力了。

递归的使用也要小心，尽量不使用时间复杂度高的，下列是一些常见的递归算法的时间复杂度：

| 递归关系                          | 时间复杂度                       | 举例           |
| ----------------------------- | --------------------------- | ------------ |
| T(n) = T(n/2) + O(1)          | T(n) = O(logn)              | 二分查找、欧几里得GCD |
| T(n) = T(n-1) + O(1)          | T(n) = O(n)                 | 线性查找         |
| T(n) = 2T(n/2) + O(1)         | T(n) = O(n)                 |              |
| T(n) = 2T(n/2) + O(n)         | T(n) = O(nlogn)             | 归并、快排        |
| T(n) = 2T(n/2) + O(nlogn)     | T(n) = O(nlog<sup>2</sup>n) |              |
| T(n) = T(n-1) + O(n)          | T(n) = O(n<sup>2</sup>)     | 选择排序、插入排序    |
| T(n) = 2T(n-1) + O(1)         | T(n) = O(2<sup>n</sup>)     | 汉诺塔          |
| T(n) = T(n-1) + T(n-2) + O(1) | T(n) = O(2<sup>n</sup>)     | 递归的斐波那契      |

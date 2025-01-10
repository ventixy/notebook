---

order: 1
title: JavaScript基础

---


## 一 JavaScript基础

### 1 JavaScript简介

**JavaScript的起源与发展** ： 

JavaScript最初由Brendan Eich在1995年创造，当时他受雇于网景通讯公司（Netscape Communications Corporation）。JavaScript的开发初衷是为了给网页增加交互性，使得网页不仅仅能展示静态内容，还能响应用户的操作。

JavaScript起初被称为“LiveScript”，但为了借助Java的知名度，很快改名为JavaScript。

::: info JavaSript运行环境
**浏览器环境**： 

在浏览器环境中，JavaScript主要负责实现客户端的动态功能，包括但不限于表单验证、页面元素操作、异步数据加载（Ajax）、动画效果、以及复杂的Web应用程序（如单页应用SPA）。浏览器中的JavaScript引擎负责解释和执行JavaScript代码，并通过Document Object Model (DOM) API与网页的内容进行交互，通过Browser Object Model (BOM) API与浏览器窗口进行交互。

浏览器中的JavaScript执行是基于事件驱动的单线程模型，这意味着同一时间只能执行一个任务，但通过异步编程技术（如事件监听、回调函数、Promise、async/await）可以处理并发操作。

**Node.js环境**：

Node.js是由Ryan Dahl在2009年基于Chrome V8 JavaScript引擎开发的一个开放源代码、跨平台的JavaScript运行环境。它让开发者能够在服务器端使用JavaScript编写高性能的网络应用。Node.js引入了事件驱动和非阻塞I/O模型，特别适合构建高并发、实时应用，如API服务器、聊天应用、实时通知系统等。

Node.js的出现打破了JavaScript只能运行在浏览器中的限制，它不仅内置了大量的模块来处理文件系统、网络请求等后端任务，还支持CommonJS模块规范和npm（Node Package Manager）作为包管理器，极大丰富了JavaScript的生态系统。
:::

总结来说，JavaScript从一个简单的网页脚本语言发展成为一个全面的、跨平台的编程语言，广泛应用于浏览器端、服务器端、移动应用、甚至物联网（IoT）等多个领域。浏览器环境和Node.js环境分别代表了JavaScript在前端和后端的应用场景，它们共同推动了JavaScript的广泛应用和发展。

### 2 JS变量和作用域

变量是程序中用于存储数据的占位符，它允许你存储值（如文本字符串、数字或对象）并在之后的代码中引用和操作这些值。在JavaScript中，可以使用`var`、`let`和`const`关键字来声明变量。

- **var**: ES6之前的标准声明方式，有变量提升现象，可能导致作用域问题。
- **let**: ES6引入的新关键字，解决了`var`的一些问题，如没有变量提升，支持块级作用域。
- **const**: 也是ES6引入的，用于声明一个常量，一旦赋值就不能再改变。


```javascript
var x = 10; // 使用var声明
let y = 20; // 使用let声明
const z = 30; // 使用const声明

console.log(x); // 输出: 10
console.log(y); // 输出: 20
console.log(z); // 输出: 30

// 试图修改const声明的变量会报错
// z = 40; // 报错：Assignment to constant variable.
```

作用域决定了变量的可访问性，即在何处可以读取或修改一个变量的值。JavaScript中有两种主要的作用域：

1. **全局作用域**: 在代码任何地方都能访问到的变量。通常直接在脚本文件或最外层函数之外声明的变量具有全局作用域。

2. **局部作用域/块级作用域**: 在特定代码块内可访问的变量，比如在一个函数内部或者使用`let`和`const`声明的变量在最近的一对花括号内有效。

```javascript
// 全局作用域示例
var globalVar = "我是全局变量";

function testScope() {
    // 局部作用域示例
    var localVar = "我是局部变量";
    
    console.log(globalVar); // 输出: 我是全局变量
    console.log(localVar); // 输出: 我是局部变量
}

testScope();
console.log(globalVar); // 输出: 我是全局变量
// console.log(localVar); // 错误：localVar is not defined

// 块级作用域示例
{
    let blockVar = "我是块级变量";
    console.log(blockVar); // 输出: 我是块级变量
}
// console.log(blockVar); // 错误：blockVar is not defined
```


- 变量是用来存储数据的，可以通过`var`、`let`或`const`声明。
- `var`有变量提升现象，可能引起作用域混乱；`let`和`const`提供了更好的控制，避免了这些问题。
- 作用域决定了变量的可见性和生命周期，全局作用域在整个脚本中都可访问，而局部作用域或块级作用域限制了变量的访问范围。正确管理作用域可以避免命名冲突，提高代码的可维护性。


### 3 JavaScript流程控制

**1. 条件语句** ：条件语句用于基于不同的条件执行不同的代码块。

**if...else**：

最基本的形式，如果条件为真，则执行if块内的代码，否则执行else块内的代码（如果存在else）。

```javascript
let score = 85;

if (score >= 90) {
    console.log("优秀");
} else if (score >= 80) {
    console.log("良好");
} else if (score >= 60) {
    console.log("及格");
} else {
    console.log("不及格");
}
```

**switch语句**：用于多路分支选择，基于表达式的值与多个case标签进行比较。

```javascript
let day = "Monday";

switch (day) {
    case "Monday":
        console.log("今天是周一");
        break;
    case "Tuesday":
        console.log("今天是周二");
        break;
    default:
        console.log("今天是其他日子");
}
```

**2. 循环语句**： 循环语句用于重复执行一段代码，直到满足某个条件为止。

**for循环**： for循环是最常用的循环结构，由初始化、条件表达式和迭代表达式三个部分组成。

```javascript
for (let i = 0; i < 5; i++) {
    console.log(i);
}
```

**while循环**： while循环在给定条件为真时重复执行代码块。

```javascript
let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}
```

**do...while**： 类似于while循环，但循环体至少会执行一次，即使初始条件就为假。

```javascript
let j = 0;
do {
    console.log(j);
    j++;
} while (j < 5);
```

**for...of**： 用于遍历可迭代对象（如数组、Set、Map等）的元素。

```javascript
let arr = [1, 2, 3, 4, 5];
for (let item of arr) {
    console.log(item);
}
```

**3. 分支跳转： break 和 continue**

- `break`：用于立即退出循环或switch语句。
- `continue`：跳过当前循环迭代的剩余部分，继续下一轮循环。

```javascript
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        break; // 当i等于5时，跳出循环
    }
    console.log(i);
}

for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
        continue; // 跳过偶数，只打印奇数
    }
    console.log(i);
}
```



## 二 JS常用数据类型 {#base_data_type_id}
JavaScript是一种弱类型、动态类型的编程语言，它支持多种数据类型，可以大致分为两大类：基本数据类型（Primitive Data Types）和对象类型（Object Data Types）

|      类型       |                                            说明                                            |
| --------------- | ------------------------------------------------------------------------------------------ |
| 值类型(基本类型) | 包含：数字(Number)、布尔(Boolean)、对空（Null）、未定义（Undefined）、Symbol、字符串（String） |
| 引用数据类型     | 包含：对象(Object)、数组(Array)、函数(Function)                                              |
```javascript
var x;               // x 为 undefined
var x = 5;           // 现在 x 为数字
var x = "John";      // 现在 x 为字符串（JavaScript 拥有动态类型。这意味着相同的变量可用作不同的类型）

//当声明新变量时，可以使用关键词 "new" 来声明其类型：
var carname=new String;
var x= new Number;
var y= new Boolean;
var cars= new Array;
var person= new Object;
```


### 1 数字(Number)
- JavaScript 只有一种数字类型。数字可以带小数点，也可以不带。 极大或极小的数字可以通过科学（指数）计数法来书写：
- 所有 JavaScript 数字均为 64 位，JavaScript 不是类型语言。与许多其他编程语言不同，JavaScript 不定义不同类型的数字，比如整数、短、长、浮点等等。
- 如果前缀为 0，则 JavaScript 会把数值常量解释为八进制数，如果前缀为 0 和 "x"，则解释为十六进制数。
默认情况下，JavaScript 数字为十进制显示。但是你可以使用 toString() 方法 输出16进制、8进制、2进制。
- 无穷大（Infinity）：当数字运算结果超过了JavaScript所能表示的数字上限（溢出），结果为一个特殊的无穷大（infinity）值，在JavaScript中以Infinity表示。
- NaN - 非数字值：NaN 属性是代表非数字值的特殊值。该属性用于指示某个值不是数字。可以把 Number 对象设置为该值，来指示其不是数字值。
你可以使用 isNaN() 全局函数来判断一个值是否是 NaN 值。除以0是无穷大，无穷大是一个数字:
- 数字可以是数字或者对象：数字可以私有数据进行初始化，就像 x = 123; JavaScript 数字对象初始化数据， var y = new Number(123);

```javascript
var x1=34.00;      //使用小数点来写
var x2=34;         //不使用小数点来写
var y=123e5;       // 12300000
var z=123e-5;      // 0.00123

var y = 0377;
var z = 0xFF;
var myNumber=128;
myNumber.toString(16);   // 返回 80
myNumber.toString(8);    // 返回 200
myNumber.toString(2);    // 返回 10000000

var x = 1000 / "Apple";
isNaN(x); // 返回 true
var y = 100 / "1000";
isNaN(y); // 返回 false
var x = 1000 / 0;
isNaN(x); // 返回 false

var x = 123;
var y = new Number(123);
typeof(x) // 返回 Number
typeof(y) // 返回 Object
(x === y) // 为 false，因为 x 是一个数字，y 是一个对象

Number.parseFloat()	   //将字符串转换成浮点数，和全局方法 parseFloat() 作用一致。
Number.parseInt()	   //将字符串转换成整型数字，和全局方法 parseInt() 作用一致。
Number.isFinite()	   //判断传递的参数是否为有限数字。
Number.isInteger()	   //判断传递的参数是否为整数。
Number.isNaN()	       //判断传递的参数是否为 isNaN()。
Number.isSafeInteger()	//判断传递的参数是否为安全整数。

var num = 123
num.toExponential()	 //返回一个数字的指数形式的字符串，如：1.23e+2
toFixed()	         //返回指定小数位数的表示形式。
b=a.toFixed(2);      // b="123.00" 返回指定小数位数的表示形式。
var a=123;
b=a.toPrecision(2); // b="1.2e+2"  返回一个指定精度的数字。
```


### 2 布尔(Boolean)

- 布尔（逻辑）只能有两个值：true 或 false。布尔常用在条件测试中。
- 如果布尔对象无初始值或者其值为: 0、-0、null、""、false、undefined、NaN 那么对象的值为 false。否则，其值为 true（即使当变量值为字符串 "false" 时）！

```javascript
var x=true;
var y=false;
```

<br/>

**（3）对空（Null）、未定义（Undefined）、Symbol**

- Undefined 这个值表示变量不含有值。可以通过将变量的值设置为 null 来清空变量。

<br/>



### 3. 字符串(String)

- 字符串可以是插入到引号中的任何字符。你可以使用 ==单引号或双引号== 
- 你可以使用==索引==位置来访问字符串中的每个字符：字符串的索引从 0 开始，这意味着第一个字符索引值为 [0],第二个为 [1], 以此类推。
- 可以使用内置属性 `length` 来计算字符串的长度：
- 字符串可以是对象，通常， JavaScript 字符串是原始值，可以使用字符创建： `var firstName = "John"`, 但我们也可以使用 new 关键字将字符串定义为一个对象： `var firstName = new String("John")`

```javascript
var carname = "Volvo XC60";
var carname = 'Volvo XC60';
var character = carname[7];

var txt = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var sln = txt.length;  //使用内置属性 length 来计算字符串的长度：

var x = "John";
var y = new String("John");
typeof x // 返回 String
typeof y // 返回 Object
(x === y) // 结果为 false，因为 x 是字符串，y 是对象
```

开发中建议避免创建`String`对象，主要原因是性能问题和可能的副作用：

1. **性能问题**：
   - 创建`String`对象比直接使用字符串字面量要慢。字符串字面量是JavaScript中的原始类型，而通过`new String()`方式创建的是一个对象。对象的创建和销毁都需要额外的时间和内存，特别是在需要处理大量字符串的场景下，这种额外的开销会影响性能。

2. **副作用**：
   - 使用`new String()`创建的字符串是对象，而不是原始类型的字符串。这意味着即使它们看起来值相同，但在进行比较时会出现预期之外的结果。
   ```javascript
   const strLiteral = "hello";
   const strObject = new String("hello");

   console.log(strLiteral === "hello"); // 输出：true
   console.log(strObject === "hello"); // 输出：false
   ```
   - 正如示例所示，一个是字符串原始类型，另一个是对象类型，它们在进行严格相等(`===`)比较时会返回`false`。此外，由于`strObject`是一个对象，它可以具有属性和方法，这可能导致不一致的行为。

3. **自动装箱和拆箱**：
   - JavaScript有一个称为"自动装箱"的特性，它允许原始类型的值在需要时自动被转换为相应的对象。这意味着，即便你没有显式创建一个`String`对象，JavaScript在需要时也会自动将字符串原始类型“装箱”成`String`对象，以便你可以调用`String`的方法。
   ```javascript
   const str = "hello";
   console.log(str.toUpperCase()); // 输出：HELLO
   ```
   - 在上面的例子中，即使`str`是一个原始类型的字符串，我们仍可以调用`toUpperCase()`方法，这是因为`str`在执行方法时被临时转换为了`String`对象。

因此，考虑到性能和潜在的副作用，在日常开发中，我们更倾向于使用字符串字面量而不是`String`对象。这种做法简洁明了，更容易避免出现预期之外的问题，同时还能提升代码的执行效率。


::: info 字符串常用方法
**获取及比较字符**

```javascript
// charAt() - 返回指定索引位置的字符
const str = 'HELLO WORLD';
console.log(str.charAt(4)); // 输出: "O"

// charCodeAt() - 返回指定索引位置字符的 Unicode 值
console.log(str.charCodeAt(4)); // 输出: 79

// localeCompare() - 用本地特定的顺序来比较两个字符串
console.log('a'.localeCompare('b')); // 输出: -1，因为"a"在"b"前面
```

**字符串常用操作**

```javascript
// concat() - 连接两个或多个字符串，返回连接后的字符串
const str1 = 'Hello';
const str2 = 'World';
console.log(str1.concat(' ', str2)); // 输出: "Hello World"

// slice() - 提取字符串的片断，并在新的字符串中返回被提取的部分
console.log(str.slice(1, 5)); // 输出: "ELLO"

// substr() - 从起始索引号提取字符串中指定数目的字符
console.log(str.substr(1, 4)); // 输出: "ELLO"

// substring() - 提取字符串中两个指定的索引号之间的字符
console.log(str.substring(1, 5)); // 输出: "ELLO"

// toLocaleLowerCase() - 根据主机的语言环境把字符串转换为小写
console.log(str.toLocaleLowerCase()); // 输出: "hello world"

// toLocaleUpperCase() - 根据主机的语言环境把字符串转换为大写
console.log(str1.toLocaleUpperCase()); // 输出: "HELLO"

// toLowerCase() - 把字符串转换为小写
console.log(str.toLowerCase()); // 输出: "hello world"

// toUpperCase() - 把字符串转换为大写
console.log(str1.toUpperCase()); // 输出: "HELLO"

// trim() - 移除字符串首尾空白
const str3 = '   hello world   ';
console.log(str3.trim()); // 输出: "hello world"
```

**搜索及替换**

```javascript
// indexOf() - 返回字符串中检索指定字符第一次出现的位置
console.log(str.indexOf('L')); // 输出: 2

// lastIndexOf() - 返回字符串中检索指定字符最后一次出现的位置
console.log(str.lastIndexOf('L')); // 输出: 3

// match() - 找到一个或多个正则表达式的匹配
const regex = /LO/;
console.log(str.match(regex)); // 输出: 匹配结果的数组

// replace() - 替换与正则表达式匹配的子串
console.log(str.replace('WORLD', 'EVERYONE')); // 输出: "HELLO EVERYONE"

// search() - 检索与正则表达式相匹配的值
console.log(str.search(/LO/)); // 输出: 3
```

**字符串生成及转换**

```javascript
// fromCharCode() - 将 Unicode 转换为字符串
console.log(String.fromCharCode(65, 66, 67)); // 输出: "ABC"

// toString() - 返回字符串对象值
const strObj = new String('hello world');
console.log(strObj.toString()); // 输出: "hello world"

// valueOf() - 返回某个字符串对象的原始值
console.log(strObj.valueOf()); // 输出: "hello world"
```

**分割字符串**

```javascript
// split() - 把字符串分割为子字符串数组
console.log(str.split(' ')); // 输出: ["HELLO", "WORLD"]
```
::: 

- 在搜索和替换等方法中，JavaScript支持使用 [正则表达式](./js2.md#regex-id)
- ES6中JavaScript还引入了 [模板字符串](./es6.md#template-string-id) ，进一步增强了字符串的能力


<br/>


### 4 Null和Undefined
1. **Null**: 表示一个特意设置为空的对象，只有一个值`null`。它是一个基本类型，但被认为是对象类型的特殊值。

   ```javascript
   let empty = null;
   ```

2. **Undefined**: 表示变量已被声明但未被赋值，只有一个值`undefined`。它也是一个基本类型。

   ```javascript
   let x;
   console.log(x); // 输出: undefined
   ```
::: info Null和Undefined的区别
`null`和`undefined`在JavaScript中都是表示“空值”或“无值”的特殊类型，但它们之间存在一些关键差异，以及在不同场景下的使用方式：

1. **数据类型与语义**:
   - `undefined`表示一个变量已被声明但没有被赋予任何值，或者是对象属性未被定义。它是表示缺少值的一种状态，可以视为一种系统级或错误情况的体现。
   - `null`则表示显式地指明一个变量的值为空，即没有对象实例。它通常用于表示变量应该是指向一个对象，但现在没有任何对象被分配给它，是一种程序级的有意为之的空值设定。

2. **类型检查**:
   - `typeof null`意外地返回 `"object"`，这被认为是JavaScript的一个历史遗留错误，因为`null`原本应被视为一个独立的特殊值。
   - `typeof undefined`正确地返回 `"undefined"`。

3. **使用场景**:
   - `undefined`常出现在变量被声明但未初始化时，或者函数未返回值时的默认返回值。
   - `null`常用于清空对象引用，或者作为函数参数表明该参数预期接收一个对象但当前没有提供。

#### `undefined`的使用场景:

- **变量声明**: 当声明了一个变量但没有赋值时，默认值为`undefined`。
- **函数参数**: 如果函数调用时没有提供应有的参数，对应的参数变量会被自动赋值为`undefined`。
- **对象属性访问**: 访问不存在的属性时返回`undefined`。

#### `null`的使用场景:

- **清空对象引用**: 当想要明确表示一个变量之前指向一个对象，现在不再指向任何对象时，可以赋值为`null`。
- **函数参数**: 有时用作函数的默认参数值，特别是当函数期望接收一个对象作为参数，而没有提供时，可以通过传递`null`来表示。
- **原型链的终点**: 在对象原型链的末端，`__proto__`属性指向`null`，表示原型链的结束。

总结来说，尽管`null`和`undefined`在某些逻辑判断中可能被视作等价（例如，它们在相等性比较中使用`==`时相等），但它们在概念上和使用目的上是不同的。开发者应该根据具体情况选择合适的一个来明确表达代码的意图。
:::


### 5 JavaScript对象类型

对象类型是可变的，可以包含数据和方法。

1. **Object**: 通用对象类型，可以存储键值对（properties）。所有非基本类型的数据都属于Object。

   ```javascript
   let person = {name: "Bob", age: 30};
   ```

2. **Array**: 特殊类型的对象，用于存储有序的元素集合，元素可以是任意类型。

   ```javascript
   let numbers = [1, 2, 3, 4];
   ```

3. **Function**: 函数是一等公民，既是对象也是可调用的实体。可以作为其他变量的值，也可以作为其他函数的参数或返回值。

   ```javascript
   function sayHello(name) {
       console.log("Hello, " + name);
   }
   ```

4. **Regular Expression**: 用于模式匹配和文本替换操作的特殊类型对象。

   ```javascript
   let pattern = /\d+/; // 匹配一个或多个数字
   ```

5. **Date**: 用于处理日期和时间。

   ```javascript
   let today = new Date();
   ```



## 三 JavaScript运算符

### 1 算术运算符

算术运算符用于执行基本的数学运算，如加、减、乘、除等。

- `+` 加
- `-` 减
- `*` 乘
- `/` 除
- `%` 求余
- `++` 自增
- `--` 自减

**示例**

```javascript
let a = 10;
let b = 5;

let sum = a + b; // 15
let difference = a - b; // 5
let product = a * b; // 50
let quotient = a / b; // 2
let remainder = a % b; // 0
let increment = a++; // a变为11, increment为10
let decrement = b--; // b变为4, decrement为5
```

### 2 比较运算符

比较运算符用于比较两个值，返回布尔值（`true`或`false`）。

- `==` 相等（不考虑类型）
- `===` 严格相等（考虑类型）
- `!=` 不等（不考虑类型）
- `!==` 严格不等（考虑类型）
- `<` 小于
- `>` 大于
- `<=` 小于等于
- `>=` 大于等于

**示例**

```javascript
let x = 10;
let y = '10';

console.log(x == y); // true, 因为仅比较值
console.log(x === y); // false, 因为类型不同
console.log(x != y); // false
console.log(x !== y); // true
console.log(x < 15); // true
```

### 3 逻辑运算符

逻辑运算符用于连接或反转布尔值。

- `&&` 与（两个操作数都为`true`时结果为`true`）
- `||` 或（至少有一个操作数为`true`时结果为`true`）
- `!` 非（反转操作数的布尔值）

**示例**

```javascript
let isTrue = true;
let isFalse = false;

console.log(isTrue && isFalse); // false
console.log(isTrue || isFalse); // true
console.log(!isTrue); // false
```

### 4 三元运算符

三元运算符是一种简化的条件表达式，格式为`条件 ? 表达式1 : 表达式2`。

**示例**

```javascript
let age = 18;
let canVote = age >= 18 ? "可以投票" : "不能投票";
console.log(canVote); // 输出: 可以投票
```

### 5 位运算符

位运算符直接对整数在内存中的二进制位进行操作。

- `&` 按位与
- `|` 按位或
- `^` 按位异或
- `~` 按位非
- `<<` 左移
- `>>` 右移
- `>>>` 无符号右移

**示例**

```javascript
let a = 5; // 二进制：0101
let b = 3; // 二进制：0011

let andResult = a & b; // 1 (0001)
let orResult = a | b; // 7 (0111)
let xorResult = a ^ b; // 6 (0110)
let notResult = ~a; // -6 (二进制：1111111111111101)

console.log(andResult, orResult, xorResult, notResult);
```


## 四 JavaScript函数
JavaScript中的函数是一等公民，意味着它们可以像其他数据类型一样被赋值给变量、作为参数传递给其他函数，甚至可以作为其他函数的返回值。

### 1 函数定义和使用

JavaScript提供了多种定义函数的方式：

- 函数声明

  ```javascript
  function sayHello(name) {
      console.log("Hello, " + name);
  }
  ```

- 函数表达式

  ```javascript
  const sayGoodbye = function(name) {
      console.log("Goodbye, " + name);
  };
  ```

- 箭头函数 （es6+）

  ```javascript
  const greet = (name) => {
      console.log(`Greetings, ${name}`);
  };
  ```

**调用函数**：

```javascript
sayHello("Alice");
sayGoodbye("Bob");
greet("Charlie");
```


### 2 JavaScript闭包

JavaScript中的闭包（Closure）是一个非常核心且强大的概念，它使得函数可以访问并记住其自身作用域、外部函数作用域乃至全局作用域中的变量，即使在其外部函数已经执行完毕。闭包的关键在于函数与其词法环境（作用域链）的组合保持活跃，形成了一个“封闭”的状态。

::: info 闭包的形成条件和作用
### 闭包的形成条件
1. **内部函数**：闭包通常是通过在一个函数内部定义另一个函数来创建的。
2. **访问外部作用域变量**：内部函数需要引用其外部函数的变量或参数。
3. **外部函数返回内部函数**：使得内部函数以某种形式（直接返回或赋值给某个变量）在外部函数执行结束后依然可以被访问。

### 闭包的作用
1. **数据封装**：通过闭包，可以创建私有变量，防止外部直接访问和修改内部状态。
2. **状态记忆**：使得函数可以“记住”并累积执行过程中的状态，实现计数器等功能。
3. **模块化**：通过闭包实现模块模式，减少全局变量的污染，增强代码的组织和可维护性。
:::

<br/>

**使用场景及代码示例**： 

#### 1. 数据封装

```javascript
function createCounter() {
    let count = 0; // 私有变量，只在createCounter作用域内可访问

    return {
        increment: function() {
            count++;
        },
        decrement: function() {
            count--;
        },
        getCount: function() {
            return count;
        }
    };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getCount()); // 输出: 2
// count变量在这里不可直接访问
```

#### 2. 状态记忆

```javascript
function makeAdder(x) {
    return function(y) {
        return x + y;
    };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(3)); // 输出: 8
console.log(add10(3)); // 输出: 13
```
在这个例子中，`makeAdder`函数返回的匿名函数记住了它被创建时的外部变量`x`的值。

#### 3. 事件处理与定时器

```javascript
function setupCounter(id) {
    let count = 0;

    document.getElementById(id).addEventListener('click', function() {
        count++;
        console.log("Button clicked " + count + " times.");
    });
}

setupCounter("myButton");
```
在这个例子中，事件处理器形成了一个闭包，维持了对`count`变量的引用，每次按钮点击时更新并记录点击次数。

**注意事项**： 
- **内存泄漏**：不当使用闭包可能会导致内存泄漏，尤其是当闭包长时间持有大量数据或DOM元素引用时。
- **性能考量**：大量使用闭包可能影响性能，尤其是在每个闭包中都保存大量数据的情况下。
- **理解上下文**：清楚闭包如何工作，何时使用，以及如何避免不必要的副作用，是使用闭包的关键。


## 五 JavaScript面向对象

### 1 对象字面量

对象字面量是直接创建一个对象的简单方式，通过大括号`{}`包裹一系列键值对来定义。

```javascript
let person = {
    name: "Alice",
    age: 30,
    sayHello: function() {
        console.log("Hello, my name is " + this.name);
    }
};

person.sayHello(); // 输出: Hello, my name is Alice
```

### 2 构造函数与原型链

构造函数用于初始化新创建的对象，使用`new`关键字调用。每个函数都有一个`prototype`属性，指向一个对象，这个对象就是将来实例化对象的原型对象。

```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sayHello = function() {
    console.log("Hello, my name is " + this.name);
};

let alice = new Person("Alice", 30);
alice.sayHello(); // 输出: Hello, my name is Alice
```

::: info JavaScript原型链
**原型（Prototype）**

在JavaScript中，每个函数都有一个`prototype`属性，这个属性是一个对象，被称为原型对象。当一个函数被用作构造函数创建新对象时，新创建的对象会自动链接到该构造函数的原型对象上，这意味着新对象可以从原型对象继承属性和方法。

**原型链（Prototype Chain）**

原型链是JavaScript中实现继承的主要方式。当试图访问一个对象的属性或方法时，如果该对象本身没有这个属性或方法，JavaScript引擎会向上查找该对象的原型对象，如果原型对象也没有，则继续查找原型的原型，如此递归直到找到为止或到达原型链的末端（通常是`Object.prototype`）。如果最终仍未找到，则返回`undefined`。

```javascript
console.log(alice.toString()); // 调用了Object.prototype.toString
```
::: 


### 3 `this`关键字

`this`的值在函数调用时确定，主要遵循以下规则：

- 在全局作用域或非严格模式下的普通函数中，`this`指向全局对象（浏览器中是`window`，Node.js中是`global`）。
- 在严格模式下，未明确指定上下文的函数中的`this`为`undefined`。
- 对象的方法调用时，`this`指向该对象。
- 构造函数中的`this`指向新创建的实例。
- 使用`.call`, `.apply`, 或 `.bind`方法可以手动绑定`this`。

```javascript
function printThis() {
    console.log(this);
}

printThis(); // 非严格模式下，输出全局对象

let obj = {printThis};
obj.printThis(); // 输出obj对象

// 使用.call绑定this
printThis.call({customThis: true}); // 输出{customThis: true}
```

**综合示例**：

```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(this.name + " makes a noise.");
};

let dog = new Animal("Doggy");
dog.speak(); // 输出: Doggy makes a noise.

// 改变speak方法的行为，不影响原有原型上的方法
let cat = new Animal("Kitty");
cat.speak = function() {
    console.log(this.name + " says meow.");
};
cat.speak(); // 输出: Kitty says meow.
dog.speak(); // 输出: Doggy makes a noise.
```


### 4 call()和对象的继承
在JavaScript中，`call()`方法是一个非常强大的函数原型(`Function.prototype.call`)上的方法，它允许你以一个指定的对象作为`this`值来调用一个函数，并可以传入额外的参数。`call()`方法在多个场景中都非常有用，特别是在需要灵活控制函数执行上下文或者复用函数逻辑时。

```javascript
functionName.call(thisArg, arg1, arg2, ...);
```

- `functionName`: 要调用的函数。
- `thisArg`: 在函数执行期间希望作为`this`的值。如果`thisArg`为`null`或`undefined`，则`this`指向全局对象（在浏览器中通常是`window`，Node.js中是`global`）。
- `arg1, arg2, ...`: 传递给函数的参数列表，可以在`thisArg`之后列出。

::: tip 注意
- `call()`方法执行后会立即调用函数，与之相似的是`apply()`方法，它们的主要区别在于传递参数的方式不同：`call()`接受的是参数列表，而`apply()`接受的是一个参数数组。
- 使用`call()`可以实现非常灵活的函数调用模式，但过度使用可能会导致代码难以理解和维护，因此应当适度并清晰地使用。
:::

<br/>

**应用场景与示例**：

#### 1. 改变`this`指向

当你想让一个对象的方法借用另一个对象的方法时，可以使用`call()`来改变`this`的指向。

```javascript
function greet() {
    console.log("Hello, " + this.name);
}

let person1 = {name: "Alice"};
let person2 = {name: "Bob"};

greet.call(person1); // 输出: Hello, Alice
greet.call(person2); // 输出: Hello, Bob
```

#### 2. 复用函数逻辑

如果你有一个通用的函数，希望在不同对象上调用时执行相同的操作但基于不同的上下文，可以利用`call()`。

```javascript
function logDetails(job, location) {
    console.log(`${this.name} is a ${job} from ${location}.`);
}

let user1 = {name: "John"};
let user2 = {name: "Jane"};

logDetails.call(user1, "developer", "New York"); // 输出: John is a developer from New York.
logDetails.call(user2, "designer", "San Francisco"); // 输出: Jane is a designer from San Francisco.
```

#### 3. 作为继承的工具

在经典的JavaScript继承模式中，`call()`常被用来继承父类的构造函数。

```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log("Some generic sound");
};

function Dog(name, breed) {
    Animal.call(this, name); // 使用call继承Animal构造函数
    this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype); // 设置Dog的原型链
Dog.prototype.constructor = Dog; // 修复构造函数引用

let myDog = new Dog("Rex", "German Shepherd");
myDog.speak(); // 输出: Some generic sound
console.log(myDog.name, myDog.breed); // 输出: Rex German Shepherd
```

::: info ES6中对于继承等特性的优化
ES6中的`class`和`extends`关键字提供了一种更简洁、更易于理解的方式来实现继承，相对于传统的原型链继承方式，它在语法上进行了封装和优化，使得继承过程更加直观，并且自动处理了一些常见的问题，比如原型链的设置和构造函数的引用修复。

1. **自动设置原型链**: 当你使用`class Child extends Parent`时，JavaScript引擎会自动为`Child`的原型设置一个指向`Parent`原型的链接，这就是原型链的自动建立。这意味着`Child`的实例可以访问到`Parent`原型上的方法和属性，实现了继承。

2. **构造函数引用的修复**: 在ES6的类继承中，当你在子类构造函数中需要调用父类的构造函数时，你可以使用`super`关键字。`super`不仅帮助你调用了父类的构造函数，而且还自动地修复了构造函数的引用问题，确保了`this`在父类构造函数中的正确指向。在子类的构造函数中，使用`super()`（不带参数）等价于调用`Parent.call(this)`，并且自动处理了构造函数的上下文。

3. **方法和静态方法**: ES6类中的方法自动被定义在原型上（非静态方法），而静态方法则直接定义在类本身上，这使得方法的组织和调用更加清晰。

4. **枚举性**: 类中的方法默认是不可枚举的，这意味着它们不会出现在`for...in`循环或`Object.keys()`等操作中，这有助于区分实例属性和原型方法。

综上所述，ES6的继承机制在原型链的自动化处理和构造函数引用修复上做了优化，使得开发者可以更专注于逻辑实现而非底层机制，提高了代码的可读性和易维护性。
:::


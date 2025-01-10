---

order: 5
title: JavaScript应用

---

## 日期和时间处理

在JavaScript中，日期和时间通常通过Date对象来处理。但Date对象本身在格式化等方面使用不方便，通常都会用一些第三方库：
- [`moment.js`](https://momentjs.cn/docs/#/-project-status/future/)  新项目不再建议使用
- [`Luxon`](https://luxon.nodejs.cn/) ： 由 Moment.js 团队的成员创建，它的 API 设计是对 Moment.js 的一个改进
- [`Day.js`](https://day.nodejs.cn/) : 旨在成为 Moment.js 的极简替代品，使用类似的 API
- [`date-fns`](https://date-fns.org/): 提供了一系列用于操作 JavaScript Date 对象的函数

### Date常用方法

在JavaScript中，日期和时间通常通过`Date`对象来处理。下面是一些使用`Date`对象处理日期和时间的常用方式：

```javascript
// 获取当前日期和时间
const now = new Date();

// 创建特定的日期和时间（月份是从0开始计数的，所以1代表2月）
const specificDate = new Date(2024, 1, 14, 11, 58, 48);
```

**获取日期和时间的部分**：

```javascript
const now = new Date();

const year = now.getFullYear();     // 获取年份
const month = now.getMonth() + 1;   // 获取月份（月份是从0开始的，所以实际月份需要加1）
const date = now.getDate();         // 获取日期

const hours = now.getHours();       // 获取小时
const minutes = now.getMinutes();   // 获取分钟
const seconds = now.getSeconds();   // 获取秒

const milliseconds = now.getMilliseconds();  // 获取毫秒

const dayOfWeek = now.getDay();              // 获取星期几 从星期日(0)到星期六(6)
```

**设置日期和时间的部分**：

```javascript
const now = new Date();

now.setFullYear(2025);       // 设置年份
now.setMonth(0);             // 设置月份（同样，月份是从0开始的）0 表示1月
now.setDate(15);             // 设置日期

now.setHours(12);            // 设置小时
now.setMinutes(30);          // 设置分钟
now.setSeconds(45);          // 设置秒
now.setMilliseconds(123);    // 设置毫秒
```


### 操作时间戳

```javascript
// 获取当前时间的时间戳（以毫秒为单位）
const timestamp = Date.now();

// 也可以从一个Date对象获取时间戳
const now = new Date();
const sameTimestamp = now.getTime(); // 和Date.now()的结果一样

// 使用Date对象的构造函数将一个时间戳（通常是以毫秒为单位的整数）转换为日期
const timestamp = 1673740800000; // 这是一个时间戳（毫秒）
const date = new Date(timestamp); // 创建一个新的日期对象，
```

**比较日期**

```javascript
const date1 = new Date(2024, 1, 14);
const date2 = new Date(2024, 1, 15);

// 日期的比较是通过比较时间戳来实现的
if (date1 < date2) {
    console.log('date1 is before date2');
} else {
    console.log('date1 is the same or after date2');
}
```




### 格式化日期和时间

**日期的解析和转换**

```javascript
// 将日期字符串解析为日期对象
const dateFromString = new Date('2024-02-14T11:58:48Z');

// 将日期对象转换为字符串
const dateString = dateFromString.toISOString();
// toISOString()方法返回的字符串格式为：YYYY-MM-DDTHH:mm:ss.sssZ
// T是一个时间分隔符，用于分隔日期和时间部分。  Z 代表UTC时间。
```

JavaScript原生的`Date`对象提供的格式化方法非常有限。你通常需要手动组合相应的日期和时间部分来创建自定义格式。例如：

```javascript
const now = new Date();
const year = now.getFullYear();
const month = ('0' + (now.getMonth() + 1)).slice(-2);
const date = ('0' + now.getDate()).slice(-2);
const hours = ('0' + now.getHours()).slice(-2);
const minutes = ('0' + now.getMinutes()).slice(-2);
const seconds = ('0' + now.getSeconds()).slice(-2);

const formattedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
// 输出格式: "YYYY-MM-DD HH:MM:SS"
console.log(formattedDateTime);
```

在现实的应用中，你可能会需要更复杂的日期操作和格式化，这时候可以使用第三方库如[`Luxon`](https://luxon.nodejs.cn/),`Day.js`或`date-fns`来简化处理。这些库提供了非常丰富和便潺的日期处理函数。



### 时区划分与表示

在互联网中对时间的表示涉及到多种时区。时区是地球表面分割成的标准时间区域，由于地球自转，不同地区的时间有所不同。主要时区包括：

- UTC（协调世界时，前称格林威治标准时间GMT）：作为时间标准，不受夏令时调整影响。
- EST（美国东部标准时间）：UTC - 5小时。
- CST（美国中部标准时间）：UTC - 6小时。
- PST（美国太平洋标准时间）：UTC - 8小时。
- IST（印度标准时间）：UTC + 5小时30分钟。
- CST（中国标准时间）：UTC + 8小时。
- JST（日本标准时间）：UTC + 9小时。

#### 如何表示时区
时区通常在时间后加上相应的缩写。例如，UTC + 8小时表示为`2024-02-14T13:58:48+08:00`或附上时区名称`2024-02-14T13:58:48 CST`。

#### 时间戳与时区
时间戳表示从1970年1月1日00:00:00 UTC到当前时间的总毫秒数。时间戳是全球统一的，不受时区影响。因此，不同地区在相同时间戳下的本地时间可能不同，但所代表的瞬间是相同的。

#### 时间戳换算
要将时间戳转换为不同时区的时间，你可以使用`Date`对象和相关的方法来处理。以下是一个将相同时间戳转换为多个时区时间的示例：

```javascript
const timestamp = 1673740800000; // 示例时间戳

// 创建一个Date对象
const date = new Date(timestamp);

//转换为UTC时间
console.log("UTC时间: ", date.toISOString());

// 转换为不同的时区，并显示其时区信息
function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
}

// 使用toLocaleString 替代 toString 来显示时区信息
console.log("美国东部时间(EST): ", convertTZ(date, "America/New_York").toLocaleString("en-US", { timeZone: "America/New_York", timeZoneName: "long" }));
console.log("中国标准时间(CST): ", convertTZ(date, "Asia/Shanghai").toLocaleString("en-US", { timeZone: "Asia/Shanghai", timeZoneName: "long" }));
console.log("日本标准时间(JST): ", convertTZ(date, "Asia/Tokyo").toLocaleString("en-US", { timeZone: "Asia/Tokyo", timeZoneName: "long" }));
```

在这个示例中，`convertTZ`函数接受一个`Date`对象和时区标识符，然后根据指定的时区返回一个新的`Date`对象，表示该时区下的时间。




## 常用数学运算

### Math常用方法
在JavaScript中，与数学计算相关的操作大多可以通过内置的`Math`对象来完成。`Math`对象提供了一系列的属性和方法用于执行常见的数学任务。
   ```javascript
   Math.PI; // π的值
   Math.E;  // 自然对数的底数e

   Math.abs(-10);    // 返回10，绝对值函数
   Math.pow(2, 3);   // 返回8，幂运算，同 2**3
   Math.sqrt(16);    // 返回4，开平方根
   Math.cbrt(27);    // 返回3，开立方根
   Math.round(0.9);  // 返回1，四舍五入
   Math.ceil(0.1);   // 返回1，向上取整
   Math.floor(0.9);  // 返回0，向下取整
   Math.max(1, 2);   // 返回2，最大值
   Math.min(1, 2);   // 返回1，最小值
   ```

2. **三角函数**
   ```javascript
   Math.sin(Math.PI / 2); // 返回1，正弦函数
   Math.cos(Math.PI);     // 返回-1，余弦函数
   Math.tan(Math.PI / 4); // 返回1，正切函数
   // 反三角函数也可以使用，例如 Math.asin(), Math.acos(), Math.atan()
   ```

3. **对数函数**
   ```javascript
   Math.log(Math.E);    // 返回1，自然对数
   Math.log10(100);     // 返回2，以10为底的对数
   Math.log2(8);        // 返回3，以2为底的对数
   ```


### 随机数生成

在JavaScript中，生成随机数主要依赖于`Math.random()`方法，它返回一个0（包含）至1（不包含）之间的伪随机浮点数。可以基于这个方法来创建多种随机数生成函数

以下是一些生成不同类型随机数的方法和例子：

1. **生成一个基本的随机浮点数**

   ```javascript
   const random = Math.random();  // 返回 一个 0-1 之间的浮点数
   console.log(random);           // 例如 0.123456789
   ```

2. **生成一个随机整数**

   假如你想要得到一个从0到`max` (不包括`max`)的随机整数，你可以使用下面这种方式：

   ```javascript
   function getRandomInt(max) {
     return Math.floor(Math.random() * Math.floor(max));
   }

   const randomInt = getRandomInt(10);
   console.log(randomInt); // 会输出0到9之间的整数
   ```

3. **生成指定范围内的随机整数**

   如果你需要的是一个在`min`和`max`之间的随机整数（包括`min`且不包括`max`），你可以通过下面的函数实现：

   ```javascript
   function getRandomIntInRange(min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min) + min);
   }

   const randomIntInRange = getRandomIntInRange(5, 10);
   console.log(randomIntInRange); // 输出5到9之间的整数
   ```

   如果你想包含`max`值，改变函数如下：

   ```javascript
   function getRandomIntInclusive(min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1) + min);
   }

   const randomIntInclusive = getRandomIntInclusive(5, 10);
   console.log(randomIntInclusive); // 输出5到10之间的整数
   ```

4. **生成指定范围的随机浮点数**

   要得到一个更加精确的、在`min`和`max`之间的随机浮点数，可以如下操作：

   ```javascript
   function getRandomFloatInRange(min, max) {
     return Math.random() * (max - min) + min;
   }

   const randomFloatInRange = getRandomFloatInRange(5, 10);
   console.log(randomFloatInRange); // 输出5到10之间的随机浮点数
   ```

这些方法都是基于`Math.random()`的，因此它们生成的是伪随机数，对于大多数非安全性要求的应用来说是足够的。但如果你需要密码学上安全的随机数，你应该使用Web Crypto API中的`crypto.getRandomValues()`方法，它比`Math.random()`提供更好的随机性。



### 准确的小数计算
JavaScript中的小数计算可能不准确，因为它使用IEEE 754浮点数进行计算，这会导致一些精度问题。例如：
```javascript
0.1 + 0.2; // 返回0.30000000000000004
```

为了进行精确的小数计算，可以使用以下方法：

**使用整数进行计算**
先将小数转换为整数，进行计算后再转回小数。
    ```javascript
    (0.1 * 10 + 0.2 * 10) / 10; // 返回0.3
    ```

**使用第三方库**

如`decimal.js`、`big.js`或者`bignumber.js`等，这些库专为精确小数计算设计。

以`decimal.js`为例，以下是如何在JavaScript中使用它进行精确的数值运算：

1. **首先，你需要安装`decimal.js`**: 如果你使用npm，可以运行：
   ```shell
   npm install decimal.js
   ```

2. **基本用法**: 引入`decimal.js`并创建`Decimal`实例来进行操作：
   ```javascript
   // 引入Decimal
   import { Decimal } from 'decimal.js';

   // 使用Decimal进行计算
   const result = new Decimal(0.1).plus(0.2); // 加法运算
   console.log(result.toString()); // 输出：'0.3'

   const result2 = new Decimal(0.7).times(3); // 乘法运算
   console.log(result2.toString()); // 输出：'2.1'
   ```

3. **链式调用**: `decimal.js`也支持链式调用来进行复杂的计算：
   ```javascript
   const result = new Decimal(10).plus(20).minus(5).times(3).div(4);
   console.log(result.toString()); // 输出计算结果
   ```

4. **比较和逻辑运算**: 可以使用`decimal.js`进行比较和逻辑运算：
   ```javascript
   const a = new Decimal(10);
   const b = new Decimal(10);

   if (a.equals(b)) {
     console.log('a 和 b 相等');
   }
   ```

5. **配置**: `decimal.js`允许配置全局参数，比如设置全局的小数点精度：
   ```javascript
   Decimal.set({ precision: 20, rounding: 4 });
   const a = new Decimal(1).div(7);
   console.log(a.toString()); // 根据设置的精度输出结果
   ```




## 数组和数组高阶函数 

JavaScript中的数组是一种特殊类型的对象，用于存储多个值的集合，这些值可以是任何类型，且不需要类型统一。数组的元素通过索引来访问，索引是从0开始的

### 数组的定义和使用

JavaScript中定义数组有多种方式：
数组初始化通常在定义时完成，可以通过静态初始化（直接给出元素值）或动态初始化（指定数组长度）。
1. **字面量定义**：
   ```javascript
   let array = [element0, element1, ..., elementN];
   ```
   例如：
   ```javascript
   let fruits = ['apple', 'banana', 'cherry'];
   ```

2. **构造函数定义**：
   ```javascript
   let array = new Array(element0, element1, ..., elementN);
   ```
   或
   ```javascript
   let array = new Array(length);
   ```
   例如：
   ```javascript
   let numbers = new Array(1, 2, 3);
   let emptyArray = new Array(3); // 创建一个长度为3的空数组
   ```

::: tip 空数组元素的默认值是什么
在JavaScript中，通过`let arr = new Array(3);`创建的数组，其元素并不会被初始化为`null`或`undefined`。实际上，这个数组的元素会被创建为"空位"（empty slots）。这些空位是特殊的，因为它们实际上并不是数组中的真实元素。

当你尝试访问一个包含空位的数组元素时，JavaScript会将其视为未定义（`undefined`），但这并不完全等同于数组元素直接被设置为`undefined`。

例如：
```javascript
let arr = new Array(3);
console.log(arr[0]); // 输出: undefined
```

尽管访问这个位置的结果是`undefined`，但实际上这个位置是一个空位。数组方法和迭代器的行为在遇到空位时会有些差异。例如，`map()`方法会跳过空位，而不会调用提供的函数。

一个简单的例子来说明这个差异：
```javascript
let arr = new Array(3); // 包含3个空位的数组
let mappedArr = arr.map(x => 1);
console.log(mappedArr); // 输出: [ <3 empty items> ]
```
在这个例子中，尽管原数组`arr`包含3个空位，`map()`函数并没有被调用，所以映射后的数组`mappedArr`也包含3个空位，而不是三个`1`。
如果明确将三个元素设置为`undefined`，如：`let arr = [undefined, undefined, undefined];`, 那么输出结果将是`[ 1, 1, 1 ]`

因此，虽然通过访问获取的结果是`undefined`，但要清楚`new Array(3)`创建的数组元素是空位，这与数组元素被直接设置为`undefined`是有区别的。
:::


#### **数组常用方法**： 

1. **访问和修改元素**：
   ```javascript
   console.log(array[index]); // 访问
   array[index] = newValue; // 修改
   ```

2. **获取长度**：
   ```javascript
   let length = array.length;
   ```

3. **添加/删除元素**：
   - **push**: 在数组末尾添加元素
     ```javascript
     array.push(element);
     ```
   - **pop**: 删除并返回数组的最后一个元素
     ```javascript
     let lastElement = array.pop();
     ```
   - **unshift**: 在数组开头添加元素
     ```javascript
     array.unshift(element);
     ```
   - **shift**: 删除并返回数组的第一个元素
     ```javascript
     let firstElement = array.shift();
     ```

4. **查找元素**：
   - **indexOf**: 返回元素在数组中的索引，未找到返回-1
     ```javascript
     let index = array.indexOf(searchElement);
     ```

5. **排序与反转**：
   - **sort**: 对数组元素进行排序，默认按字符串Unicode点排序
     ```javascript
     array.sort();
     ```
   - **reverse**: 反转数组中的元素顺序
     ```javascript
     array.reverse();
     ```



### 遍历数组
在JavaScript中，遍历数组是常见需求。不同的遍历方法适用于不同的场景和需求。下面详细介绍了几种常见方法：

**1. 使用传统的`for`循环**
- **特点**: 最基础的遍历方式，可以在任何时候中断循环（使用`break`或`continue`）。
  ```javascript
  const arr = ['Apple', 'Banana', 'Cherry'];
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
  ```

**2. 使用`forEach`方法**
- **特点**: Array的原生方法，适用于无需中断遍历的场景。不能使用`break`或`continue`，也不能从中返回值。
  ```javascript
  const arr = ['Apple', 'Banana', 'Cherry'];
  arr.forEach(function(item, index){
    console.log(item, index);
  });
  ```

**3. 使用`for...of`循环**
- **特点**: 可以直接获取数组的每个元素的值，简洁明了。与`for`循环一样，可以用`break`、`continue`和`return`。
  ```javascript
  const arr = ['Apple', 'Banana', 'Cherry'];
  for (const item of arr) {
    console.log(item);
  }
  ```


**4. 使用迭代器（`Iterator`）**
- **特点**: 使用`Symbol.iterator`属性，创建一个迭代器对象来访问集合的元素。
  ```javascript
  const arr = ['Apple', 'Banana', 'Cherry'];
  const iterator = arr[Symbol.iterator]();
  let result = iterator.next();
  while (!result.done) {
    console.log(result.value);
    result = iterator.next();
  }
  ```


 ### 数组高阶函数    

|  函数名  | 功能描述   | 示例 | 说明 |
| :-----: |:----------------------------|:----------------|:------|
|   map   | 映射：一一对应，遍历数组的所有元素，并对每一个元素执行指定的操作，返回一个新的数组 | `const newArr = arr.map(x => x * 2);` | 对数组中的每个元素进行操作，并生成新的数组返回，原数组不会被改变。 |
| reduce  | 累积： 每次计算的结果和数组中下一个元素再次计算，最后合并成一个结果返回 | `const sum = arr.reduce((acc, cur) => acc + cur, 0);` | 这是一个非常强大的函数，可以将数组中的元素通过特定操作累积成单个输出值，这在聚合、组合或累加值的情况下非常有用。 |
| filter  | 过滤：创建一个新的数组，新数组所有的元素都符合某种条件 | `const filteredArr = arr.filter(num => num > 0);` | 它返回一个新数组，该数组包含通过提供的函数实现的测试的所有元素。这对于筛选出满足条件的元素非常有用。 | 


#### 1. `map` 方法
- `map`函数会对数组里每一个元素按照指定的函数进行处理/映射，然后返回一个新的数组。这个过程不会改变原始数组。
- 注意`map`方法总是返回与原数组相同长度的新数组，即使某些元素在映射过程中没被修改或返回`undefined`。
- **使用场景**: 当需要将数组中的每个元素转换成其他值时使用，例如: 数字数组转为字符串数组、计算数组每个元素的平方等。
  ```javascript
  const numbers = [1, 2, 3, 4];
  const squares = numbers.map(num => num * num);
  console.log(squares); // 输出 [1, 4, 9, 16]
  ```

#### 2. `reduce` 方法
- `reduce` 方法对数组中的每个元素执行一个由你提供的“reducer”函数（升序执行），将其结果汇总为单个返回值。
- 调用`reduce`时可以提供一个初始值作为第二个参数，如果不提供，则数组的第一个元素将作为初始值。如果数组为空且没有提供初始值，会抛出TypeError。
- **使用场景**: 对数组中的所有元素进行累加、累乘、连接字符串、将数组转换成对象格式、查找数组中的最大/最小值等场景。
  ```javascript
  const nums = [1, 2, 3, 4];
  const sum = nums.reduce((acc, cur) => acc + cur, 0);
  console.log(sum); // 输出 10
  ```

#### 3. `filter` 方法
- `filter` 方法创建一个新数组，其包含通过所提供函数实现的测试的所有元素。这个方法不会改变原数组。
- **注意事项**: 只有为数组中的每个元素调用的函数返回`true`时，该元素才会包含在返回的数组中。如果所有元素都返回`false`，结果就是一个空数组。
- **使用场景**: 当需要从原始数组中筛选出符合特定条件的元素时使用，例如过滤掉不满足条件的元素、根据条件筛选对象数组等。
  ```javascript
  const mixedNumbers = [-3, -2, 0, 1, 2, 3];
  const positiveNumbers = mixedNumbers.filter(number => number > 0);
  console.log(positiveNumbers); // 输出 [1, 2, 3]
  ```



### ES6对数组的改进

ECMAScript 2015（也称为ES6）引入了多项改进和新功能，大大增强了JavaScript处理数组的能力。以下是ES6对数组进行的一些重要改进：

#### 1. `Array.from()`
这个方法可以从类数组或可迭代对象创建一个新的数组实例。

- 将类数组对象（如函数的`arguments`或`document.querySelectorAll`返回的结果）转换成数组。
- 使用场景：与`map`函数结合，进行元素的转换。

```javascript
// 类数组对象转换为数组
function f() {
  return Array.from(arguments);
}
console.log(f(1, 2, 3)); // 输出: [1, 2, 3]

// 字符串拆分成字符数组
console.log(Array.from('foo')); // 输出: ['f', 'o', 'o']
```

::: tip 注意
`arguments`是JavaScript中的一个预定义的局部变量，它在函数内部自动可用。即使你没有在参数列表中定义它，它也存在于每个函数的作用域中。`arguments`是一个类数组对象，它包含了调用函数时传递给函数的所有参数。

这就是为什么在函数`f`中即使没有定义参数，也能够通过`arguments`访问到传递进来的参数，并且能够使用`Array.from(arguments)`将其转换成一个真正的数组。

`arguments`对象有类似数组的特性，比如`length`属性，和能通过索引来访问各个元素，但它并不是一个真正的数组，所以它没有数组的方法，比如`map`、`filter`或者`reduce`。因此，如果你想要使用这些数组方法，你首先需要将`arguments`对象转换为一个真正的数组，这正是`Array.from()`方法的用武之地。这也是为什么上述`f`函数能够正常工作并返回一个数组的原因。
:::


#### 2. `Array.of()`
这个方法创建一个具有可变数量参数的新数组实例，而不考虑参数的数量或类型。

- 使用场景：创建数组时避免`new Array()`的一些陷阱。

```javascript
console.log(Array.of(7));       // 输出: [7]
console.log(Array.of(1, 2, 3)); // 输出: [1, 2, 3]
```

::: tip new Array()创建数组的不一致行为
使用`new Array()`构造函数创建数组时，主要的陷阱在于`new Array()`对待传入参数的方式不同，具体取决于参数的数量和类型。

#### 1. 单个数值参数
当你向`new Array()`传递一个单独的数值参数时，它会创建一个指定长度的数组，而不是包含该数值的数组。
```javascript
let arr = new Array(3);
console.log(arr); // 输出: [ <3 empty items> ]
console.log(arr.length); // 输出: 3
```
在这个例子中，`arr`是一个长度为3的空数组，而不是包含一个元素3的数组。

#### 2. 多个参数或非数值单个参数
如果传递给`new Array()`的是非数值的单个参数，或者是多个参数，它则会创建一个包含这些参数的数组。
```javascript
let arr1 = new Array(3, 2);
console.log(arr1); // 输出: [3, 2]

let arr2 = new Array('3');
console.log(arr2); // 输出: ['3']
```
在第一个例子中，`arr1`是一个包含两个元素（3和2）的数组。在第二个例子中，`arr2`是一个包含单个字符串元素`'3'`的数组。

#### 如何避免这些陷阱
这些不一致的行为可能会导致混乱，特别是对于初学者。为了避免这些陷阱，ECMAScript 2015 (ES6) 引入了`Array.of()`方法。`Array.of()`无论参数的数量或类型如何，都会创建一个包含所有传递给它的参数的数组。
```javascript
let arr = Array.of(3);
console.log(arr); // 输出: [3]
```
在这个例子中，使用`Array.of(3)`清晰且明确地创建了一个包含单个元素3的数组。这就避免了使用`new Array()`时可能出现的混乱。`Array.of()`提供了一种更直观、更一致的方式来创建数组，无论你希望数组包含什么类型的元素，或者是多少个元素。
:::


#### 3. `find()` 和 `findIndex()`
- `find()`方法返回数组中满足提供函数的第一个元素的值，否则返回`undefined`。
- `findIndex()`方法返回数组中满足提供测试函数的第一个元素的索引。不存在，则返回-1。

- 使用场景：在数组中查找元素或元素的索引。

```javascript
const array = [{name: "Apple", type: "fruit"}, {name: "Potato", type: "vegetable"}];
console.log(array.find(item => item.name === "Apple")); // 输出: {name: "Apple", type: "fruit"}
console.log(array.findIndex(item => item.name === "Potato")); // 输出: 1
```

#### 4. 扩展运算符 (Spread operator) `...`
扩展运算符`...`允许一个数组表达式或字符串在需要多个参数（函数调用）或多个元素（数组字面量）的地方展开。

**使用场景**：
- 合并数组。
- 将字符串转换成字符数组。
- 在函数调用时使用数组作为参数。

```javascript
// 合并数组
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combinedArr = [...arr1, ...arr2];
console.log(combinedArr); // 输出: [1, 2, 3, 4, 5, 6]

// 函数参数展开
function sum(x, y, z) {
  return x + y + z;
}
const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 输出: 6
```

#### 5. `Array.prototype.includes()`
这个方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回`true`，否则返回`false`。

- 使用场景：检查数组中是否包含某个元素。

```javascript
const pets = ['cat', 'dog', 'bat'];
console.log(pets.includes('cat'));  // 输出: true
console.log(pets.includes('at'));   // 输出: false
```

这些是ES6中对数组的部分改进，它们为开发人员提供了更强大，更灵活的工具来处理数组数据。



## 网络请求与数据传输

在JavaScript中发起网络请求主要有几种方式：通过原生的AJAX、Fetch API，以及使用第三方库比如axios等。

### AJAX
AJAX（Asynchronous JavaScript And XML）是最传统的发送网络请求的方法之一。虽然名字中包含XML，但现在JSON是更常用的数据格式。

**GET请求示例:**

```javascript
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.example.com/data", true);
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
xhr.send();
```

**POST请求示例（带参数）:**

```javascript
var xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.example.com/data", true);
xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
var data = JSON.stringify({"name": "John", "age": 30});
xhr.send(data);
```

### Fetch API
Fetch API提供了一个更现代、更强大而且更灵活的方法来进行网络请求。

**GET请求示例:**

```javascript
fetch("https://api.example.com/data")
  .then(response => response.json())  // 解析响应为JSON
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**POST请求示例（带参数）:**

```javascript
fetch("https://api.example.com/data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({"name": "John", "age": 30}),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Axios
[Axios](https://axios-http.com/)是一个基于Promise的HTTP客户端，适用于浏览器和Node.js。它允许浏览器和Node.js使用相同代码库进行HTTP通信
  
- **转换请求和响应数据**：自动将请求数据转换为JSON格式，反之亦然。
  
- **自动转换JSON数据**：当发送请求或接收响应时，Axios会自动将JSON数据进行序列化和反序列化。
  
- **客户端支持防御CSRF**：Axios包含了多种安全措施，比如可以配置一个CSRF token以防跨站请求伪造。
  
- **提供在请求时设置基础URL的能力**：方便进行API调用时不必每次都写完整的URL。
  
- **超时设置**：你可以指定在放弃请求前需要等待的毫秒数。
  
- **支持取消请求**：你可以使用cancel token取消进行中的请求。

Axios的小巧体积和简单易用的接口，加上它基于Promise的处理方式，使其成为开发现代web应用的流行选择。

**GET请求示例:**

```javascript
axios.get('https://api.example.com/data')
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
```

**POST请求示例（带参数）:**

```javascript
axios.post('https://api.example.com/data', {
    name: 'John',
    age: 30
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
```

### JSON

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式，易于人阅读和编写，也易于机器解析和生成。

**序列化（Stringify）**：

将JavaScript对象转换为JSON字符串。

```javascript
var obj = { name: "John", age: 30 };
var myJSON = JSON.stringify(obj);
console.log(myJSON); // 输出字符串{"name":"John","age":30}
```

**反序列化（Parse）**：

将JSON字符串转换为JavaScript对象。

```javascript
var myJSON = '{"name":"John", "age":30}';
var obj = JSON.parse(myJSON);
console.log(obj); // 输出JavaScript对象{name: "John", age: 30}
```





## Regex正则表达式 {#regex-id}

JavaScript中的正则表达式（Regular Expressions，简称regex）是一个强大的字符串匹配工具，它使用一种特殊的文本字符串来描述一个搜索模式，可用于字符串搜索、替换、测试等操作。

### Regex的创建和使用

1. **创建正则表达式**: 有两种方式可以创建一个正则表达式：

   - 使用字面量语法：
     ```javascript
     const regex = /pattern/flags;
     ```
   
   - 使用`RegExp`构造函数：
     ```javascript
     const regex = new RegExp('pattern', 'flags');
     ```
::: info 正则表达式的组成
   - **模式**：包含了各种字符和元字符（有特殊含义的字符），用于设定匹配规则。
   - **标志**：
     - `g` (全局搜索)
     - `i` (不区分大小写)
     - `m` (多行搜索)
     - `u` (Unicode模式)
     - `y` (粘性搜索)
     - `s` (dotAll模式，使`.`匹配包括换行符在内的所有字符)
:::


2. **JS中正则表达式的常用方法**:

   JavaScript的`String`对象提供了几个可以使用正则表达式的方法，例如：

   - `test()`: 测试给定的字符串是否符合正则表达式。
   - `exec()`: 在一个指定字符串中执行一个搜索匹配，返回一个结果数组或null。
   - `match()`: 返回一个数组，其中包含匹配的结果，如果没有匹配到，则返回null。
   - `search()`: 返回正则表达式在字符串中匹配到的位置索引，若未找到匹配则返回-1。
   - `replace()`: 替换与正则表达式匹配的子串。
   - `split()`: 使用正则表达式或固定字符串分割字符串。

3. **示例**: 查找字符串中所有的数字：
   ```javascript
   const text = 'Room 101 or Room 202';
   const regex = /\b\d+\b/g;
   const matches = text.match(regex);
   console.log(matches); // 输出: ["101", "202"]
   ```


### 通用Regex语法

1. **字符类别**: 
   
   在正则表达式中，某些元字符在方括号`[]`内表现为字符类别，它们匹配特定类型的字符：

   - `[abc]`: 匹配`a`、`b`或`c`中的任意一个字符
   - `[^abc]`: 匹配任何不是`a`、`b`或`c`的字符
   - `[0-9]`: 匹配任意一个数字字符
   - `\d`: 匹配任意一个数字，相当于[0-9]
   - `\D`: 匹配任何非数字的字符，相当于[^0-9]
   - `\w`: 匹配任意一个单词字符（字母、数字或下划线）
   - `\W`: 匹配任意一个非单词字符
   - `\s`: 匹配任意一个空白字符（空格、制表符、换行符等）
   - `\S`: 匹配任意一个非空白字符
   - `.`: 匹配任何单个字符，除了换行符（在`s`标志下也包括换行符）

2. **特殊字符**:

   正则表达式中的特殊字符包括：`. \ + * ? ^ $ { } [ ] | ( )`等。这些特殊字符如果要作为普通字符匹配，需要使用反斜杠`\`进行转义。

3. **量词**: 用于指定一个模式可以出现的次数：
   
   - `*`: 匹配0次或多次
   - `+`: 匹配1次或多次
   - `?`: 匹配0次或1次
   - `{n}`: 匹配确切的n次
   - `{n,}`: 匹配至少n次
   - `{n,m}`: 匹配n到m次

4. **分组和引用**: 

   - `(abc)`: 捕获分组，匹配并捕获括号中的表达式
   - `(?:abc)`: 非捕获分组，匹配但不捕获括号中的表达式
   - `\1`, `\2`, etc.: 引用之前捕获的分组内容

5. **边界匹配器**:
   
   - `^`: 匹配字符串的开始
   - `$`: 匹配字符串的结束
   - `\b`: 匹配单词边界
   - `\B`: 匹配非单词边界


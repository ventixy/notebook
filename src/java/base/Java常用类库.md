---

order: 50

---

# Java常用类库

## 一 常用类库

### 1. Objects

在JDK7版本的时候，Java引入了`java.util.Objects`工具类，用于封装一些平时使用频度很高或容易出错的操作，这些操作形成了Objects的各个方法。

```java
public final class Objects {

    public static boolean equals(Object a, Object b) {
        return (a == b) || (a != null && a.equals(b));
    }

    public static boolean deepEquals(Object a, Object b) {
        if (a == b)
            return true;
        else if (a == null || b == null)
            return false;
        else
            return Arrays.deepEquals0(a, b);
    }
}
```

equals()：有别于`Object.equals()`，这个方法可以避免空指针异常。

deepEquals()：`Object.equals()`用于比较两个对象的引用是否相同，而`deepEquals()`却扩展成了可以支持数组。

### 2. Arrays

Arrays 类是一个工具类，其中包含了数组操作的很多方法。这个 Arrays 类里均为 static 修饰的方法（static 修饰的方法可以直接通过类名调用）

```java
1. 对数组进行升序排序
Array.sort(Object[] array)

// 从元素下标为from,到下标为to-1的元素进行排序    
Arrays.sort(Object[] array, int from, int to)    

2. 为数组元素填充相同的值    
Arrays.fill(Object[] array,Object object)
// 对数组的部分元素填充一个值,从起始位置到结束位置，取头不取尾
Arrays.fill(Object[] array,int from,int to,Object object)    

3. 返回数组的字符串形式
Arrays.toString(Object[] array)
// 返回多维数组的字符串形式
Arrays.deepToString(Object[][] arrays)
```

### 3. System

1. 获取系统当前毫秒值 `public static long currentTimeMillis()`
   
   ```java
   System.out.println(System.currentTimeMillis());    // 1634043714170
   System.out.println(new Date().getTime());          // 1634043714170
   ```

2. 结束正在运行的Java程序 `public staitc void exit(int status)`
   
   ```java
   System.exit(0);
   ```

3. 运行JVM中的垃圾回收器，完成内存中垃圾的清除 `public static void gc()`
   
   ```java
    System.gc();    
   ```

4. 确定当前的系统属性 `public static getProperties()`
   
   ```java
   System.out.println(System.getProperties());
   ```

5. System类方法复制数组
   
   ```java
   public static native void arraycopy(Object src, int srcPos, Object dest, int destPos,int length);
   ```
   
   - Object src：要复制的原数组；
   - Int srcPos：数组源的起始索引；
   - Object dest：复制后的目标数组；
   - int destPos：目标数组起始索引；
   - int length，指定复制的长度；
   
   ```java
   public static void main(String[] args) {
       int[] arr1 = {1, 2, 3, 4, 5, 6};
       int[] arr2 = {8, 9, 10};
   
       System.arraycopy(arr1, 2, arr2, 0, 2);
       System.out.println(Arrays.toString(arr2));   // [3, 4, 10]
   }
   ```

## 二 数学工具

### 1. Math

Math 类位于 java.lang 包，封装了常用的数学运算，它的构造方法是 private 的，因此无法创建 Math 类的对象。

- Math 类中的所有方法都是类方法，可以直接通过类名来调用它们。

- Math 类中包含 $E$ 和 $PI$ 两个静态常量，正如它们名字所暗示的，它们的值分别等于 $e$（自然对数）和  $π$（圆周率）。

```java
// 随机数例子：
Math.random()                         // [0.0，1.0)之间的随机数
Math.random()*100                     // [0.0，100.0)之间的随机数
Math.random()*98 + 2                  // [2.0，100.0)之间的随机数
(int)(Math.random()*98 + 2)           // [2，100)之间的随机整数

// 产生随机数还可以借助java.util.Random类
Random random = new Random();    // 以当前时间为默认种子, 可以使用 Random(long seed) 以指定的种子值
int num = random.nextInt(100);   // 生成一个随机的int值，该值介于[0,100)的区间
double d = random.nextDouble();  //产生[0,1)范围的随机小数
```

**(1) 求最大值、最小值和绝对值**

| 方法                                   | 说明             |
| ------------------------------------ | -------------- |
| static int abs(int a)                | 返回 a 的绝对值      |
| static long abs(long a)              | 返回 a 的绝对值      |
| static float abs(float a)            | 返回 a 的绝对值      |
| static double abs(double a)          | 返回 a 的绝对值      |
| static int max(int x,int y)          | 返回 x 和 y 中的最大值 |
| static double max(double x,double y) | 返回 x 和 y 中的最大值 |
| static long max(long x,long y)       | 返回 x 和 y 中的最大值 |
| static float max(float x,float y)    | 返回 x 和 y 中的最大值 |
| static int min(int x,int y)          | 返回 x 和 y 中的最小值 |
| static long min(long x,long y)       | 返回 x 和 y 中的最小值 |
| static double min(double x,double y) | 返回 x 和 y 中的最小值 |
| static float min(float x,float y)    | 返回 x 和 y 中的最小值 |

**(2) 取整方法**

| 方法                             | 说明                                        |
| ------------------------------ | ----------------------------------------- |
| static double ceil(double a)   | 返回大于或等于 a 的最小整数（向上取整）                     |
| static  double floor(double a) | 返回小于或等于 a 的最大整数（向下取整）                     |
| static double rint(double a)   | 返回最接近 a 的整数值，如果有两个同样接近的整数，则结果取偶数（四舍六入五取偶） |
| static  int round(float a)     | 将原来的数字加上0.5后再向下取整 （四舍五入）                  |
| static long round(double a)    | 将原来的数字加上0.5后再向下取整（长整型 ）                   |

```java
System.out.println(Math.ceil(1.1));    // 2.0
System.out.println(Math.ceil(-1.1));   // -1.0 向上取整

System.out.println(Math.floor(1.1));   // 1.0
System.out.println(Math.floor(-1.1));  // -2.0 向下取整

System.out.println(Math.rint(-1.4));   // -1.0
System.out.println(Math.rint(-1.5));   // -2.0 （四舍六入五取偶）
System.out.println(Math.rint(-2.5));   // -2.0  

System.out.println(Math.round(1.4f));  // 1  (表示”四舍五入”)
System.out.println(Math.round(-1.5f)); // -1 (-1.5 + 0.5 = -1.0 取整为 -1)
System.out.println(Math.round(-1.51)); // -2 (-1.51 + 0.5 = -1.01 向下取整为 -2)
System.out.println(Math.round(-1.6f)); // -2 (-1.6 + 0.5 = -1.1 向下取整为 -2)
```

**(3) 指数运算**

| 方法                                    | 说明                   |
| ------------------------------------- | -------------------- |
| static double exp(double a)           | 返回 e 的 a 次幂          |
| static  double pow(double a,double b) | 返回以 a 为底数，以 b 为指数的幂值 |
| static double sqrt(double a)          | 返回 a 的平方根            |
| static  double cbrt(double a)         | 返回 a 的立方根            |
| static double log(double a)           | 返回 a 的自然对数，即 lna 的值  |
| static  double log10(double a)        | 返回以 10 为底 a 的对数      |

**(4) 三角函数**

| 方法                                      | 说明                                      |
| --------------------------------------- | --------------------------------------- |
| static double sin(double a)             | 返回角的三角正弦值，参数以孤度为单位                      |
| static  double cos(double a)            | 返回角的三角余弦值，参数以孤度为单位                      |
| static double asin(double a)            | 返回一个值的反正弦值，参数域在 [-1,1]，值域在 [-PI/2,PI/2] |
| static  double acos(double a)           | 返回一个值的反余弦值，参数域在 [-1,1]，值域在  [0.0,PI]    |
| static double tan(double a)             | 返回角的三角正切值，参数以弧度为单位                      |
| static  double atan(double a)           | 返回一个值的反正切值，值域在  [-PI/2,PI/2]            |
| static double toDegrees(double  angrad) | 将用孤度表示的角转换为近似相等的用角度表示的角                 |
| staticdouble  toRadians(double angdeg)  | 将用角度表示的角转换为近似相等的用弧度表示的角                 |






### 2. BigDecimal

`BigDecimal`是Java中用于进行高精度浮点数运算的主要类，特别适用于货币计算等对精度有严格要求的场景。

`BigDecimal`提供了多种构造方法来初始化对象，最常用的是通过字符串和double值。推荐使用字符串初始化，因为直接从double转换可能会因为二进制浮点数到十进制的转换不精确而引入误差。
- BigDecimal(double val)：实例化时将双精度型转换为 BigDecimal 类型
- BigDecimal(String val)：实例化时将字符串形式转换为 BigDecimal 类型

```java
import java.math.BigDecimal;

// 使用字符串初始化，推荐
BigDecimal bd1 = new BigDecimal("123.456");
// 也可以使用静态方法 valueOf
BigDecimal bd = BigDecimal.valueOf(123L);   

// 使用double初始化，注意可能的精度丢失
BigDecimal bd2 = new BigDecimal(123.456);
```


**常用方法**：
```java
BigDecimal add(BigDecimal augend)                                     // 加法操作
BigDecimal subtract(BigDecimal subtrahend)                            // 减法操作
BigDecimal multiply(BigDecimal multiplieand)                          // 乘法操作
BigDecimal divide(BigDecimal divisor,int scale,int roundingMode )     // 除法操作
```

::: info divide方法参数详解

1. **divisor（被除数）**:
   - 类型：`BigDecimal`
   - 含义：这个参数表示除法中的除数。即你要将当前`BigDecimal`实例（作为被除数）除以的值。

2. **scale（小数点后保留位数）**:
   - 类型：`int`
   - 含义：指定结果中小数部分的位数。如果结果自然的小数位数少于这个值，结果将被补足到指定的小数位数，补足方式由`roundingMode`决定。如果结果的小数位数超过这个值，按照`roundingMode`进行舍入。

3. **roundingMode（舍入模式）**:
   - 类型：`RoundingMode`
   - 含义：决定了当除法运算结果需要舍入时采用的策略。`RoundingMode`是一个枚举类型，提供了多种舍入规则，包括但不限于：

| `RoundingMode`模式名称       | 说明                                                         |
| --------------------------- | ------------------------------------------------------------ |
| BigDecimal.ROUND_UP         | 总是向前进位，不论正负。                                          |
| BigDecimal.ROUND_DOWN       | 直接去除多余小数，不进行进位。                                     |
| BigDecimal.ROUND_CEILING    | 正数向上舍入，负数向下舍入。                                       |
| BigDecimal.ROUND_FLOOR      | 正数向下舍入，负数向上舍入。                                       |
| BigDecimal.ROUND_HALF_DOWN | 五舍六入（正数时5舍去，负数时-5进位）                      |
| BigDecimal.ROUND_HALF_UP    | 最常见的模式，==四舍五入==，正数时5及以上进位，负数时-5及以下进位。                                                    |
| BigDecimal.ROUND_HALF_EVEN  | 五舍六入，末位为5时，若前一位为偶数则下舍，奇数则上入（==银行家舍入法==）。 |

`BigDecimal`的`ROUND_HALF_EVEN`舍入模式，也称为“银行家舍入法”，其规则可以概括为：

- **五舍六入**：如果要舍弃的末尾数字大于5（即等于或大于0.5），则向上进位；如果小于5（即0、1、2、3或4），则直接舍去。
  
- **偶数法则**：当要舍弃的末尾数字恰好为5时，进位还是舍去取决于它前一位（即保留的最低有效位）的奇偶性：
  - 如果前一位是偶数（包括0），则舍去该5，使得结果为偶数。这是为了保持数值的连续性，避免在连续的舍入操作中产生系统性的偏移。
  - 如果前一位是奇数，则将5进位，这样结果仍然是偶数。

简而言之，`ROUND_HALF_EVEN`旨在减少因连续舍入导致的累积误差，同时确保舍入后的结果尽可能为最近的偶数。这一规则广泛应用于金融和统计领域，因为它在长期内可以减少因四舍五入产生的整体偏差。
:::


**限制精度**：

1. **精确控制小数位数**：当进行算术运算或处理外部输入数据时，直接使用`double`或`float`等浮点类型可能会引入精度损失，造成==无限循环小数==的问题，尤其是在**除法**运算中。而`BigDecimal`的`setScale`方法允许我们明确指定小数点后保留的位数，从而确保计算结果的精度和可预测性。

2. **四舍五入和截断机制**：`setScale`方法提供了多种舍入模式（如`ROUND_HALF_UP`、`ROUND_DOWN`等），可以让我们在限制精度的同时决定如何处理舍入问题。这在处理财务数据时尤为重要，比如总金额的计算，往往需要精确到分，这时使用四舍五入或其他规则来处理小数点后的多余数字就显得非常重要。

3. **避免浮点数陷阱**：基础的浮点类型（如`double`和`float`）在表示某些分数或循环小数时，由于二进制表示的限制，可能会导致近似值和无限循环。`BigDecimal`基于十进制，通过`setScale`方法可以精确地控制数值表示，避免了这些陷阱。


**示例说明**：考虑一个简单的除法运算，比如计算10除以3：

```java
double result = 10.0 / 3.0; // 结果可能是3.3333333333333335，存在无限循环小数的近似问题
```

在除法计算中控制舍入方式：

```java
BigDecimal bd1 = new BigDecimal("10");
BigDecimal bd2 = new BigDecimal("3");
BigDecimal result = bd1.divide(bd2, 2, BigDecimal.ROUND_HALF_UP);  
// 结果为3.33，且进行了四舍五入
```

除了上述的避免计算中可能出现的无限小数问题，还可以直接使用`setScale`方法设置`BigDecimal`的小数位数，可以选择是否进行四舍五入。

```java
// 限制到两位小数，四舍五入
BigDecimal rounded = bd1.setScale(2, BigDecimal.ROUND_HALF_UP);

// 限制到两位小数，不进行四舍五入，直接截断
BigDecimal truncated = bd1.setScale(2, BigDecimal.ROUND_DOWN);

```



**数值比较**：
由于浮点数的特殊性，直接使用`equals`方法进行比较可能会因为精度问题得到错误的结果。应该使用`compareTo`方法进行比较，它会返回一个整数，表示两个数的相对大小。

```java
BigDecimal bd3 = new BigDecimal("123.456");
BigDecimal bd4 = new BigDecimal("123.457");

int compareResult = bd3.compareTo(bd4);
if (compareResult < 0) {
    System.out.println("bd3 小于 bd4");
} else if (compareResult > 0) {
    System.out.println("bd3 大于 bd4");
} else {
    System.out.println("bd3 等于 bd4");
}
```


**输出方式**：

`BigDecimal`类提供了`toString()`和`toPlainString()`两个方法用于将`BigDecimal`对象转换为字符串表示。这两个方法在大多数情况下会产生相同的输出，但在处理科学记数法时有所不同。

**区别与使用场景**：

- **区别**：主要区别在于处理大数值或小数值时是否采用科学记数法。`toString()`在数值过大或过小时可能会采用科学记数法，而`toPlainString()`始终使用普通的十进制表示，不使用指数形式。
  
- **使用场景**：
  - 当你需要保持数值的原始表示形式，避免科学记数法带来的可读性问题时，应使用`toPlainString()`。这对于财务报表、数据库存储或任何对格式有严格要求的场景特别重要。
  - 如果对输出格式没有特殊要求，或者期望在数值过大或过小时自动采用更紧凑的科学记数法表示，可以使用`toString()`。

下面的代码示例展示了如何使用`toString()`和`toPlainString()`方法输出一个大数值的`BigDecimal`实例：

```java
import java.math.BigDecimal;

public class BigDecimalDemo {
    public static void main(String[] args) {
        // 创建一个很大的BigDecimal数值
        BigDecimal bigNumber = new BigDecimal("123456789012345678901234567890.1234567890");

        // 使用toString()方法
        String toStringResult = bigNumber.toString();
        // 预期输出（取决于BigDecimal的具体值和环境，可能会是科学记数法）:
        // "1.234567890123456789E+28"
        System.out.println("toString()结果: " + toStringResult);

        // 使用toPlainString()方法
        String toPlainStringResult = bigNumber.toPlainString();
        // 预期输出: "123456789012345678901234567890.1234567890"
        // 不管数值多大，都会以普通十进制形式输出，不会使用科学记数法
        System.out.println("toPlainString()结果: " + toPlainStringResult);
    }
}
```
请注意，具体的输出结果（尤其是`toString()`的输出）==可能(仅仅是可能，不是一定)== 会根据JVM的具体实现和运行时环境略有不同，但上述注释中概述的原则保持不变：`toString()`可能会采用科学记数法表示极大或极小的数值，而`toPlainString()`则始终提供完整的十进制字符串表示。


::: tip 注意事项
1. **避免使用double初始化**：直接使用double值初始化`BigDecimal`可能导致精度丢失，优先使用字符串形式。
2. **精确计算**：进行加减乘除等运算时，确保每个操作数都是`BigDecimal`类型，以保证计算的精确性。
3. **性能考虑**：虽然`BigDecimal`提供了高度精确的计算能力，但其性能比基本数据类型低，因此在不需要高精度时应考虑使用基本类型。
4. **线程安全**：`BigDecimal`是不可变的，因此在多线程环境下是线程安全的，可以放心使用。
:::





## 三 日期日历

### 1. Date

Date 类表示系统特定的时间戳，可以精确到毫秒。Date 对象表示时间的默认顺序是星期、月、日、小时、分、秒、年。

Date 类有如下两个构造方法。

- Date()：此种形式表示分配 Date 对象并初始化此对象，以表示分配它的时间（精确到毫秒），使用该构造方法创建的对象可以获取本地的当前时间。
- Date(long date)：此种形式表示从 GMT 时间（格林尼治时间）1970 年 1 月 1 日 0 时 0 分 0 秒开始经过参数 date 指定的毫秒数。

```java
System.out.println(new Date());   // Tue Oct 12 20:08:43 CST 2021
System.out.println(new Date(0));  // Thu Jan 01 08:00:00 CST 1970
```

Date 类带 long 类型参数的构造方法获取的是距离 GMT 指定毫秒数的时间，而 GMT（格林尼治标准时间）与 CST（中央标准时间）相差 8 小时，也就是说 `1970 年 1 月 1 日 00:00:00 GMT` 与 `1970 年 1 月 1 日 08:00:00 CST` 表示的是同一时间。

Date类中的常用方法：

| 方法                              | 描述                                                       |
| ------------------------------- | -------------------------------------------------------- |
| boolean after(Date when)        | 判断此日期是否在指定日期之后                                           |
| boolean  before(Date when)      | 判断此日期是否在指定日期之前                                           |
| int compareTo(Date anotherDate) | 比较两个日期的顺序                                                |
| boolean  equals(Object obj)     | 比较两个日期的相等性                                               |
| long getTime()                  | 返回自 1970 年 1 月 1 日 00:00:00 GMT 以来，此 Date 对象表示的毫秒数       |
| String  toString()              | 把此 Date 对象转换为以下形式的 String:  dow mon dd hh:mm:ss zzz yyyy |

### 2. DateFormat

DateFormat 是日期/时间格式化子类的抽象类，它以与语言无关的方式格式化并解析日期或时间，在创建 DateFormat 对象时不能使用 new 关键字，而应该使用 DateFormat 类中的静态方法 getDateInstance()

```java
DateFormat df = DateFormat.getDatelnstance();
```

| 方法                                                                               | 描述                               |
| -------------------------------------------------------------------------------- | -------------------------------- |
| String format(Date date)                                                         | 将 Date 格式化日期/时间字符串               |
| Calendar getCalendar()                                                           | 获取与此日期/时间格式相关联的日历                |
| static DateFormat getDateInstance()                                              | 获取具有默认格式化风格和默认语言环境的日期格式          |
| static DateFormat getDateInstance(int style)                                     | 获取具有指定格式化风格和默认语言环境的日期格式          |
| static DateFormat getDateInstance(int style, Locale locale)                      | 获取具有指定格式化风格和指定语言环境的日期格式          |
| static DateFormat getDateTimeInstance()                                          | 获取具有默认格式化风格和默认语言环境的日期/时间 格式      |
| static DateFormat getDateTimeInstance(int dateStyle,int timeStyle)               | 获取具有指定日期/时间格式化风格和默认语言环境的 日期/时间格式 |
| static DateFormat getDateTimeInstance(int dateStyle,int timeStyle,Locale locale) | 获取具有指定日期/时间格式化风格和指定语言环境的 日期/时间格式 |
| static DateFormat getTimeInstance()                                              | 获取具有默认格式化风格和默认语言环境的时间格式          |
| static DateFormat getTimeInstance(int style)                                     | 获取具有指定格式化风格和默认语言环境的时间格式          |
| static DateFormat getTimeInstance(int style, Locale locale)                      | 获取具有指定格式化风格和指定语言环境的时间格式          |
| void setCalendar(Calendar newCalendar)                                           | 为此格式设置日历                         |
| Date parse(String source)                                                        | 将给定的字符串解析成日期/时间                  |

格式化样式主要通过 DateFormat 常量设置。将不同的常量传入到上表所示的方法中，以控制结果的长度。DateFormat 类的常量如下：

- SHORT：完全为数字，如 12.5.10 或 5:30pm。
- MEDIUM：较长，如 May 10，2021。
- LONG：更长，如 May 12，2021 或 11:15:32am。
- FULL：是完全指定，如 Tuesday、May 10、2021 AD 或 11:15:42am CST。

```java
DateFormat dateInstance = DateFormat.getDateInstance(DateFormat.FULL, Locale.CHINA);
DateFormat timeInstance = DateFormat.getTimeInstance(DateFormat.FULL, Locale.CHINA);

String date = dateInstance.format(new Date());
String time = timeInstance.format(new Date());

System.out.println(date);  // 2021年10月12日 星期二
System.out.println(time);  // 下午08时42分36秒 CST
```

**SimpleDateFormat**： 

如果使用 DateFormat 类格式化日期/时间并不能满足要求，那么就需要使用 DateFormat 类的子类——SimpleDateFormat。

SimpleDateFormat 类主要有如下 3 种构造方法：

- SimpleDateFormat()：用默认的格式和默认的语言环境构造 SimpleDateFormat。
- SimpleDateFormat(String pattern)：用指定的格式和默认的语言环境构造 SimpleDateF ormat。
- SimpleDateFormat(String pattern, Locale locale)：用指定的格式和指定的语言环境构造 SimpleDateF ormat。

SimpleDateFormat 自定义格式中常用的字母及含义：

| 字母  | 含义                                         | 示例                                                                               |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------- |
| y   | 年份。一般用 yy 表示两位年份，yyyy 表示 4 位年份             | 使用 yy 表示的年扮，如 11； 使用 yyyy 表示的年份，如 2021                                           |
| M   | 月份。一般用 MM 表示月份，如果使用 MMM，则会 根据语言环境显示不同语言的月份 | 使用 MM 表示的月份，如 05； 使用 MMM 表示月份，在 Locale.CHINA 语言环境下，如“十月”；在 Locale.US 语言环境下，如 Oct |
| d   | 月份中的天数。一般用 dd 表示天数                         | 使用 dd 表示的天数，如 10                                                                 |
| D   | 年份中的天数。表示当天是当年的第几天， 用 D 表示                 | 使用 D 表示的年份中的天数，如 295                                                             |
| E   | 星期几。用 E 表示，会根据语言环境的不同， 显示不 同语言的星期几         | 使用 E 表示星期几，在 Locale.CHINA 语 言环境下，如“星期四”；在 Locale.US 语 言环境下，如 Thu                 |
| H   | 一天中的小时数（0~23)。一般用 HH 表示小时数                 | 使用 HH 表示的小时数，如 18                                                                |
| h   | 一天中的小时数（1~12)。一般使用 hh 表示小时数                | 使用 hh 表示的小时数，如 10 (注意 10 有 可能是 10 点，也可能是 22 点）                                   |
| m   | 分钟数。一般使用 mm 表示分钟数                          | 使用 mm 表示的分钟数，如 29                                                                |
| s   | 秒数。一般使用 ss 表示秒数                            | 使用 ss 表示的秒数，如 38                                                                 |
| S   | 毫秒数。一般使用 SSS 表示毫秒数                         | 使用 SSS 表示的毫秒数，如 156                                                              |

```java
// Date对象转换成时间字符串
SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 E HH:mm:ss");
System.out.println(sdf.format(new Date()));  // 2021年10月12日 星期二 20:36:58

// 字符串转换成时间Date对象
SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
Date date = null;
try {
    date = simpleDateFormat.parse("2021-10-1");
}catch (ParseException e) {
    e.printStackTrace();
} 
System.out.println(date);  // Wed Oct 13 00:00:00 CST 2021
```

### 4. Calender

Calendar 类是一个抽象类，因此创建 Calendar 对象不能使用 new 关键字，它提供了一个 getInstance() 方法来获得 Calendar类的对象。getInstance() 方法返回一个 Calendar 对象，其日历字段已由当前日期和时间初始化。

```java
Calendar c = Calendar.getInstance();
```

| 方法                                                                             | 描述                                                                                             |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| void add(int field, int amount)                                                | 根据日历的规则，为给定的日历字段 field 添加或减去指定的时间量 amount                                                      |
| boolean after(Object when)                                                     | 判断此 Calendar 表示的时间是否在指定时间 when 之后，并返回判断结果                                                      |
| boolean before(Object when)                                                    | 判断此 Calendar 表示的时间是否在指定时间 when 之前，并返回判断结果                                                      |
| void clear()                                                                   | 清空 Calendar 中的日期时间值                                                                            |
| int compareTo(Calendar anotherCalendar)                                        | 比较两个 Calendar 对象表示的时间值（从格林威治时间 1970 年 01 月 01 日 00 时 00 分 00 秒至现在的毫秒偏移量），大则返回 1，小则返回 -1，相等返回 0 |
| int get(int field)                                                             | 返回指定日历字段的值                                                                                     |
| int getActualMaximum(int field)                                                | 返回指定日历字段可能拥有的最大值                                                                               |
| int getActualMinimum(int field)                                                | 返回指定日历字段可能拥有的最小值                                                                               |
| int getFirstDayOfWeek()                                                        | 获取一星期的第一天。根据不同的国家地区，返回不同的值                                                                     |
| static Calendar getInstance()                                                  | 使用默认时区和语言坏境获得一个日历                                                                              |
| static Calendar getInstance(TimeZone zone)                                     | 使用指定时区和默认语言环境获得一个日历                                                                            |
| static Calendar getInstance(TimeZone zone, Locale aLocale)                     | 使用指定时区和语言环境获得一个日历                                                                              |
| Date getTime()                                                                 | 返回一个表示此 Calendar 时间值（从格林威治时间 1970 年 01 月 01 日 00 时 00 分 00 秒至现在的毫秒偏移量）的 Date 对象                |
| long getTimeInMillis()                                                         | 返回此 Calendar 的时间值，以毫秒为单位                                                                       |
| void set(int field, int value)                                                 | 为指定的日历字段设置给定值                                                                                  |
| void set(int year, int month, int date)                                        | 设置日历字段 YEAR、MONTH 和 DAY_OF_MONTH 的值                                                            |
| void set(int year, int month, int date, int hourOfDay, int minute, int second) | 设置字段 YEAR、MONTH、DAY_OF_MONTH、HOUR、 MINUTE 和 SECOND 的值                                          |
| void setFirstDayOfWeek(int value)                                              | 设置一星期的第一天是哪一天                                                                                  |
| void setTimeInMillis(long millis)                                              | 用给定的 long 值设置此 Calendar 的当前时间值                                                                 |

Calendar 对象可以调用 set() 方法将日历翻到任何一个时间，当参数 year 取负数时表示公元前。Calendar 对象调用 get() 方法可以获取有关年、月、日等时间信息，参数 field 的有效值由 Calendar 静态常量指定。

Calendar 类中定义了许多常量，分别表示不同的意义。

- Calendar.YEAR：年份。
- Calendar.MONTH：月份。
- Calendar.DATE：日期。
- Calendar.DAY_OF_MONTH：日期，和上面的字段意义完全相同。
- Calendar.HOUR：12小时制的小时。
- Calendar.HOUR_OF_DAY：24 小时制的小时。
- Calendar.MINUTE：分钟。
- Calendar.SECOND：秒。
- Calendar.DAY_OF_WEEK：星期几。

```java
Calendar calendar = Calendar.getInstance();   // 如果不设置时间，则默认为当前时间
calendar.setTime(new Date());                 // 将系统当前时间赋值给 Calendar 对象

calendar.getTime();                           // 获取当前时间
int year = calendar.get(Calendar.YEAR);       // 获取当前年份
int month = calendar.get(Calendar.MONTH) + 1; // 获取当前月份（月份从 0 开始，所以加 1）
int day = calendar.get(Calendar.DATE);        // 获取日

int week = calendar.get(Calendar.DAY_OF_WEEK) - 1;    // 获取今天星期几（以星期日为第一天）
int hour = calendar.get(Calendar.HOUR_OF_DAY);        // 获取当前小时数（24 小时制）
int minute = calendar.get(Calendar.MINUTE);           // 获取当前分钟
int second = calendar.get(Calendar.SECOND);           // 获取当前秒数
int millisecond = calendar.get(Calendar.MILLISECOND); // 获取毫秒数

int dayOfMonth = calendar.get(Calendar.DAY_OF_MONTH);                 // 获取今天是本月第几天
int dayOfWeekInMonth = calendar.get(Calendar.DAY_OF_WEEK_IN_MONTH);   // 获取今天是本月第几周
int many = calendar.get(Calendar.DAY_OF_YEAR);                        // 获取今天是今年第几天

Calendar c = Calendar.getInstance();
c.set(2021, 11, 11);                     // 设置年月日，时分秒将默认采用当前值
```

### 5. 定时、周期任务

Timer是jdk中提供的一个定时器工具，使用的时候会在主线程之外起一个单独的线程执行指定的计划任务，可以指定执行一次或者反复执行多次。Timer主要由TimerTask，TimerThread，TaskQueue组成

- TimerTask是一个实现了Runnable接口的抽象类，代表一个可以被Timer执行的任务。

- TaskQueue就是用来保存TimerTask的队列，当有新的Task add进来时，会保存到改队列中。
  
  需要注意的是，TaskQueue的内部实现使用的是最小堆，堆顶的Task是最近即将到时间的Task，所以在调度任务时，每次只需要取出堆顶元素，判断时间是否已到即可，效率非常高

- TimerThread就是用来调度TaskQueue中的任务的线程。

```java
// 定时器Timer构造方法:
Timer timer = new Timer();  //其中会调用this("Timer-" + serialNumber());, 即它以Timer+序列号为该定时器的名字
Timer timer = new Timer(String name);         // 以name作为该定时器的名字
Timer timer = new Timer(boolean isDeamon);    // 是否将此定时器作为守护线程执行
Timer timer = new Timer(name, isDeamon);      // 定时器名字, 是否为守护线程
```

简单的定时任务示例：

```java
public class TimerDemo {
    public static void main(String[] args) {
        // 创建Timer对象
        final Timer timer = new Timer();

        try {
            // 任务执行时间
            final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = sdf.parse("2022-02-24 13:45:30");

            // 创建定时任务
            timer.schedule(new Task(), date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    private static class Task extends TimerTask{
        @Override
        public void run() {
            System.out.println("Boom!"); // 炸弹爆炸
        }
    }
}
```

**调用方法**：

```Java
schedule(TimerTask task, Date time) // 设定某个时间执行任务（只执行一次）
schedule(TimerTask task, long delay) // 安排在指定延迟后执行指定的任务(毫秒)

// 第一次在指定firstTime时间点执行任务，之后每隔period时间调用任务一次
schedule(TimerTask task,Date firstTime,long period) 

// delay时间后开始执行任务，并每隔period时间调用任务一次
schedule(TimerTask task,long delay,long period) 

scheduleAtFixedRate(TimerTask task,Date firstTime,long period) // 指定的时间开始进行重复的固定速率执行．

scheduleAtFixedRate(TimerTask task,long delay,long period)  // 指定的延迟后开始进行重复的固定速率执行．


public boolean cancel()    // 取消定时器
```

【注】schedule() 和 scheduleAtFixedRate()

- schedule()方法更注重保持间隔时间的稳定：保障每隔period时间可调用一次
- scheduleAtFixedRate()方法更注重保持执行频率的稳定：保障多次调用的频率趋近于period时间，如果某一次调用时间大于period，下一次就会尽量小于period，以保障频率接近于period


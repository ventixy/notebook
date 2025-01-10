---

order: 30

---

# Java面向对象

## 一 面向对象基础

面向对象简称 OO（Object Oriented）：是一种对现实世界理解和抽象的方法，是计算机编程技术发展到一定阶段后的产物。

20 世纪 80 年代以后，有了面向对象分析（OOA）、 面向对象设计（OOD）、面向对象程序设计（OOP）等新的系统开发方式模型的研究

- OOA：面向对象分析（Object Oriented Analysis）
- OOD：面向对象设计（Object Oriented Design）
- OOP：面向对象程序设计（Object Oriented Programming）

<br/>

面向对象具有继承、封装和多态 3 个核心特性

- 封装：保护信息——阻止在外部定义的代码随意访问内部代码和数据
- 继承：子类拥有父类的全部特征和行为（Java 只支持单继承）
- 多态：父类中定义的属性和方法被子类继承后，可以具有不同的属性或表现方式

Java 语言的基本封装单位是类。由于类的用途是封装复杂性，所以类的内部有隐藏实现复杂性的机制。Java 提供了私有和公有的访问模式，类的公有接口代表外部的用户应该知道或可以知道的每件东西，私有的方法数据只能通过该类的成员代码来访问，这就可以确保不会发生不希望的事情

<br/>

### 1. 类和对象

在面向对象中，类和对象是最基本、最重要的组成单元。类是对象的抽象，对象是类的具体。

- 类：客观世界某类群体的一些基本特征抽象

- 对象：就是表示一个个具体的东西
  
  <br/>

类是概念模型，定义对象的所有特性和所需的操作，对象是真实的模型，是一个具体的实体。

类是描述了一组有相同特性（属性）和相同行为（方法）的一组对象的集合。

对象或实体所拥有的特征在类中表示时称为类的属性，对象执行的操作称为类的方法。

<br/>

### 2. 类的定义

```java
// class：声明类的关键字。  class_name：类的名称。
[public] [abstract|final] class <class_name> [extends<class_name>] [implements<interface_name>] {
    // 定义属性部分 property_type表示成员变量的类型， property表示成员变量名称
    <property_type> <property1>;
    <property_type> <property2>;
    <property_type> <property3>;
    …
    // 定义方法部分 function()：表示成员方法名称
    function1();
    function2();
    function3();
    …
}
```

- 中括号“[]”中的部分表示可以省略，竖线 “|” 表示 “或关系”
  
  例如 abstract|final，说明可以使用 abstract 或 final 关键字，但是两个关键字不能同时出现

- `public`：表示可以被其他类和程序访问，每个 Java 程序的主类都必须是 public 类。

- `abstract`：如果类被 abstract 修饰，则该类为抽象类。
  
  抽象类不能被实例化，但抽象类中可以有抽象方法（使用 abstract 修饰的方法）和具体方法（没有使用 abstract 修饰的方法）。
  
  继承该抽象类的所有子类都必须实现该抽象类中的所有抽象方法（除非子类也是抽象类）。

- `final`：如果类被 final 修饰，则不允许被继承。

- `extends`：表示继承其他类。

- `implements`：表示实现某些接口。
  
  <br/>

```java
// 定义一个简单的 Person 类 (首先定义了两个属性，分别为 name 和 age，然后定义了一个名称为 tell() 的方法)
public class Person {
    private String name;    // 姓名
    private int age;        // 年龄

    public void show() {    // 定义说话的方法
        System.out.println(name+"今年"+age+"岁！");
    }
}
```

<br/>

```java
// 声明成员变量的语法
[public|protected|private] [static] [final] <type> <variable_name>
```

- public、protected、private：用于表示成员变量的访问权限。
- static：表示该成员变量为类变量，也称为静态变量。
- final：表示将该成员变量声明为常量，其值无法更改。

可以在声明成员变量的同时对其进行初始化，如果声明成员变量时没有对其初始化，则系统会使用默认值初始化成员变量

<br/>

```java
// 声明成员方法(定义类的行为) 一个完整的方法通常包括方法名称、方法主体、方法参数和方法返回值类型
[public|private|protected] [static] [abstract|final] <void|return_type> <method_name>([paramList]) {
    // 方法体
}
```

- public、private、protected：表示成员方法的访问权限。

- static：表示限定该成员方法为静态方法。

- final：表示限定该成员方法不能被重写或重载。

- abstract：表示限定该成员方法为抽象方法。
  
  抽象方法不提供具体的实现（必须被子类重写，除非子类也是抽象类），并且所属类必须为抽象类。

<br/>

### 3. 构造方法

构造方法是类的一种特殊方法，用来初始化类的一个新的对象，在创建对象（new 运算符）之后自动调用。

```java
class class_name {
    public class_name(){}               // 默认无参构造方法
    public ciass_name([paramList]){}    // 自定义构造方法
    …
    // 类主体
}
```

- 方法名必须与类名相同，可以有 0 个、1 个或多个参数

- 若不自定义构造函数，则 Java 会自动为该类生成一个默认的无参构造方法
  
  建议自定义无参构造方法，不要对编译器形成依赖，避免错误发生。
  当类中有非常量成员变量时，建议提供两个版本的构造方法，一个是无参构造方法，一个是全属性做参数的构造方法。
  当类中所有成员变量都是常量或者没有成员变量时，建议不提供任何版本的构造。

- 没有任何返回值，包括 void，默认返回类型就是对象类型本身
  
  注意：**如果为构造方法定义了返回值类型或使用 void 声明构造方法没有返回值，编译时不会出错，但 Java 会把这个所谓的构造方法当成普通方法来处理**。实际上，类的构造方法是有返回值的，当使用 new 关键字来调用构造方法时，构造方法返回该类的实例，可以把这个类的实例当成构造器的返回值，因此构造器的返回值类型总是当前类，无须定义返回值类型。但必须注意不要在构造方法里使用 return 来返回当前类的对象，因为构造方法的返回值是隐式的。

<br/>

注意：构造方法不能被` static、final、synchronized、abstract 和 native`修饰

- 构造方法用于初始化一个新对象，所以用 static 修饰没有意义。
- 构造方法不能被子类继承，所以用 final 和 abstract 修饰没有意义。
- 多个线程不会同时创建内存地址相同的同一个对象，所以用 synchronized 修饰没有必要

<br/>

**方法的重载：**

- 方法名称相同, 参数类型或参数长度不同, 可以完成方法的重载 ! 
- 方法的重载与返回值无关!
- 方法的重载 ,可以让我们在不同的需求下, 通过传递不同的参数调用方法来完成具体的功能。

<br/>

### 4. 对象的使用

```java
// 一个类要想真正的进行操作，则必须依靠对象，对象的定义格式如下:
ClassName objectName = new ClassName();

// 如果要想访问类中的属性或方法（方法的定义），则可以依靠以下的语法形式：
objectName.property;    //访问类中的属性
objectName.method();    //调用类中的方法
```

```java
Car car = new Car("Rolls Royce", "grey");
car.show();

new Car("Rolls Royce", "grey").show();  // 匿名对象（匿名对象只在堆内存中开辟空间，而不存在栈内存的引用）
```

<br/>

对象访问定位：Java程序需要通过栈上的引用数据来操作堆上的具体对象。

对象的访问方式取决于虚拟机实现，目前主流的访问方式有使用句柄和直接指针两种，HotSpot主要使用直接指针：

![](https://image.ventix.top/java/image-20211006105633370.png)

<br/>

### 5. 封装和this

封装（Encapsulation）是指一种将抽象性函式接口的实现细节部分包装、隐藏起来的方法。封装可以被认为是一个保护屏障，防止该类的代码和数据被外部类定义的代码随机访问。要访问该类的代码和数据，必须通过严格的接口控制。

<br/>

**实现Java封装的步骤：**

1. 修改属性的可见性来限制对属性的访问（一般限制为private）

2. 对每个值属性提供对外的公共方法访问，也就是创建一对赋取值方法，用于对私有属性的访问

```java
public class Person{
    private String name;
    private int age;

    public int getAge(){
      return age;
    }
    public String getName(){
      return name;
    }
    public void setAge(int age){
      this.age = age;
    }
    public void setName(String name){
      this.name = name;
    }
}
```

- 此处采用 **this** 关键字是为了解决实例变量和局部变量之间发生的同名的冲突
- 大部分时候，普通方法访问其他方法、成员变量时无须使用 this 前缀，但如果方法里有个局部变量和成员变量同名，但程序又需要在该方法里访问这个被覆盖的成员变量，则必须使用 this 前缀
- this 关键字最大的作用就是让类中一个方法，访问该类里的另一个方法或实例变量

```java
public class Student {
    String name;

    public Student() {
        this("张三");  // this( )访问构造方法(注意：在构造方法中使用时，必须是第一条语句)
    }
    public Student(String name) {
        this.name = name;
    }
}
```

<br/>

### 6. 静态(static)

static表示“静态”的意思，可以简单理解为：被static关键字修饰的方法或者变量不需要依赖于对象来进行访问，只要类被加载了，就可以通过类名去进行访问，并且不会因为对象的多次创建 而在内存中建立多份数据。

在类中，使用 static 修饰符修饰的属性（成员变量）称为静态变量，也可以称为类变量，常量称为静态常量，方法称为静态方法或类方法，它们统称为静态成员，归整个类所有。（静态方法不能调用非静态成员，编译会报错）

- **静态变量**：静态变量只分配一次内存，在加载类的过程中完成静态变量的内存分配，静态变量可以被类的所有实例共享

- **静态方法**：不能使用 this 关键字，也不能直接访问所属类的实例变量和实例方法，但是可以直接访问所属类的静态变量和静态方法。
  
  另外，和 this 关键字一样，super 关键字也与类的特定实例相关，所以在静态方法中也不能使用 super 关键字。

- **静态代码块**：static{ } 代码块只被执行一次，主要用于初始化类，为类的静态变量赋初始值，提升程序性能

```java
public class Student {
    private String name;
    public static String country = "China";

    public Student(String name) {
        this.name = name;
    }
    public Student() {
    }
}
```

```java
public class StudentTest {
    public static void main(String[] args) {
        Student tom = new Student("tom");
        Student jack = new Student("jack");

        System.out.println(tom.country);
        System.out.println(jack.country);
        System.out.println(Student.country);
    }
}
```

![](https://image.ventix.top/java/image-20211006232006308.png)

<br/>

### 7. 代码块

- 普通代码块：在执行的流程中 出现的 代码块， 我们称其为普通代码块。

- 构造代码块：在类中的成员代码块， 我们称其为构造代码块， 在每次对象创建时执行， 执行在构造方法之前。

- 静态代码块：在类中使用static修饰的成员代码块， 我们称其为静态代码块， 在类加载时执行。 每次程序启动到关闭 ，只会
  执行一次的代码块。

- 同步代码块
  
  构造方法 与 构造代码块 以及 静态代码块的执行顺序：静态代码块 --> 构造代码块 --> 构造方法

<br/>

### 8. package

包（package）：提供了类的多层命名空间，用于解决类的命名冲突、类文件管理等问题。包的 3 个作用如下：

1. 区分相同名称的类
2. 能够较好地管理大量的类
3. 控制访问范围

<br/>

**包定义**：

- package 语句应该放在源文件的第一行，在每个源文件中只能有一个包定义语句

- Java 包的命名规则如下：
  
  - 包名全部由小写字母（多个单词也全部小写）
  - 如果包名包含多个层次，每个层次用“.”分割
  - 包名一般由倒置的域名开头，比如 com.baidu，不要有 www
  - 自定义包不能 java 开头

- 如果在源文件中没有定义包，那么类、接口、枚举和注释类型文件将会被放进一个无名的包中，也称为默认包。
  
  在实际企业开发中，通常不会把类定义在默认包下

<br/>

**包导入**：

- import 语句位于 package 语句之后，类定义之前
- 如果不导包，则需要使用该类的全名（包名+类名）

```java
package 包名;          // 定义包

import 包名.类名;      // 使用 import 导入单个类
import 包名.*;        // 使用 import 语句导入指定包下全部类
```

<br/>

### 9. 权限修饰符

![](https://image.ventix.top/java/image-20211006223247048.png)

- public：只要使用 import 语句引入 public 类，就可以访问和引用这个类
- protected：允许其他包中它的子类来访问父类的特定属性和方法，否则可以使用默认访问控制符
- default：如果一个类没有访问控制符，说明它具有默认的访问控制特性，这种访问特性又称为包访问性（package private）
- private：只能被该类自身的方法访问和修改，而不能被任何其他类（包括该类的子类）访问和引用

<br/>

## 二 继承和多态

### 1. 继承和super

继承就是在已经存在类的基础上进行扩展，从而产生新的类。已经存在的类称为父类、基类或超类，而新产生的类称为子类或派生类。在子类中，不仅包含父类的属性和方法，还可以增加新的属性和方法。

```java
修饰符 class class_name extends extend_class {
    // 类的主体
}

// extends 关键字直接跟在子类名之后，其后面是该类要继承的父类名称。如：
public class Student extends Person{
}
```

- Java 不支持多继承，只允许一个类直接继承另一个类，即子类只能有一个直接父类
- 子类和父类间必须存在“是一个”即“is-a”的关系，否则不能用继承

<br/>

由于子类不能继承父类的构造方法，因此，如果要调用父类的构造方法，可以使用 super 关键字。

super 可以用来访问父类的构造方法、普通方法和属性。

```java
public class Person {
    public Person(String name) {
    }
}
public class Student extends Person {
    public Student(String name) {
        super(name);   // 调用父类中的构造方法  ( super()必须是在子类构造方法的方法体的第一行 )
    }
}
```

<br/>

**protected访问权限**： 

protected修饰的成员，在同类、同包下是可以随意访问的。

**但是在不同包下，必须在子类中，创建子类自身对象，才能够访问它从父类那里继承过来的protected成员，其它方式创建对象都不可以访问。**

在面向的访问权限控制的整个体系中，实际上如果没有继承，那么只需要两个访问权限就足够了：要么是给别人用的public，要么是不给别人用的private。但是有了继承后，**如果类中的某个成员，非常有价值，我们希望这个成员总是被子类使用，而不会被滥用**，出于保护这样一个成员的目的，protected就有意义了

<br/>

**继承的一些限制**：

1. 能不能继承父类的私有成员呢？
   
   首先，直接访问是访问不到的。 **但实际上子类会继承父类的私有成员，之所以不能访问，是因为没有访问权限。**

2. 能不能继承父类的构造器呢？
   
   首先构造器不能算成员，况且构造方法也不是普通方法，继承过来干嘛呢？构造器是不能被继承的。

3. 能不能继承父类的静态成员呢？
   
   首先，**如果子类没有父类中的同名静态成员时**，直接用子类类名点访问，是可以访问到父类中的静态成员的。**但这仅意味着子类能够使用父类的静态成员，并不意味着继承！**通常情况下，继承仅考虑普通成员而不考虑静态成员

4. 何时使用继承？
   
   **不要盲目的去使用继承，尤其不要单纯为了复用代码，而使用继承。使用继承应该严格考虑两个类是否具有"is-a"关系！** 

<br/>

### 2. 对象初始化

==子类对象的初始化问题==：

**Java对象的初始化顺序**原则：**父类优于子类，静态优于非静态**，只有在第一次创建对象的时候才会初始化静态块。

 **第一部分：类加载** 

1. 首先程序要从main方法启动，这意味着首先要触发具有main方法的那个类的类加载。
   
   类加载过程中，一定要考虑连环触发类加载的情况：
   
   1. 类中有静态成员变量创建对象，那么一定会触发其它类的类加载。
   2. 该类还有父类，于是触发父类类加载。

2. 类加载这个过程中，静态代码块的代码一定会执行，不要忘记了。

3. 如果有静态成员变量的显式赋值，那么显式赋值和静态代码块，按照代码的书写顺序从上往下执行。

4. 类加载整个程序运行期间只有一次，如有通过继承连环触发类加载，那么顺序是`先父后子`，从最顶层父类开始。
   
   <br/>
   
   **第二部分：创建对象**

5. 切记类加载是懒加载，有些类可能等到main方法执行到一半才触发类加载。
   
   - 这个就要随机应变了，以下步骤，都默认类加载全部结束了。

6. new对象时，首先去找到new对象的构造器，然后观察第一行
   
   ==a. 如果它的首行显式地调用了另一个构造器（可能是`this(参数)`，也可能是`super(参数)`）==
   
   - 那么程序会先跳转到那个构造器，再去看代码首行有没有显式调用另一个构造器
     - 直到找到一个构造器它隐含的super()指向Object类的无参构造
     - 于是开始按照这个类中构造代码块和显式赋值的代码书写顺序，从上到下执行其中的代码
     - 最后执行这个类的构造器
   - 开始执行被跳转的构造器，同样先执行显式赋值和构造代码块后执行构造器
   - 最后执行完new对象构造器，创建对象过程结束。
   
   ==b. 如果它的首行没有显式调用另一个构造器，那么必定隐含`super()`指向父类的无参构造器。==
   
   - 如果直接指向Object类的无参构造，那十分简单，直接不用管
     - 执行类中的显式赋值和构造代码块，最后执行构造器
   - 如果指向一个普通父类的无参构造，那就观察首行，根据情况执行步骤a或b
   - 最终一定父类构造器执行完毕，回到new对象的类中，执行完毕new对象构造器，创建对象过程结束。

------

<br/>

### 3. 重写和重载

- `方法重写（override）`：又称为方法覆盖，即在子类中如果创建了一个与父类中相同名称、相同返回值类型(详见说明)、相同参数列表的方法，只是方法体中的实现不同，以实现不同于父类的功能。
- `方法重载（overload）`：同一个类中包含了两个或两个以上方法名相同的方法，但形参列表不同。方法重载的要求是两同一不同：同一个类中方法名相同，参数列表不同。至于方法的其他部分，如**方法返回值类型、修饰符等，与方法重载没有任何关系**。

| 重写和重载   | 方法的重载（overload） | 方法的重写（override）           |
| ------- | --------------- | ------------------------- |
| 发生的类不同  | 必须在同类中          | 必须发生在父子类之间，肯定不是同一个类中      |
| 方法名     | 必须相同            | 必须相同                      |
| 参数列表    | 必须不同            | 必须相同                      |
| 访问权限修饰符 | 不影响，无所谓         | 子类方法的访问权限，不允许更严格（可以一致或宽松） |
| 返回值类型   | 不影响，无所谓         | 子类方法返回值类型保持兼容，不用完全一致      |
| 异常      | 不影响，无所谓         | 重写的方法不能抛出更多的异常            |

<br/>

在重写方法时，需要遵循下面的规则：

- 参数列表必须完全与被重写的方法参数列表相同。重写的方法可以使用 @Override 注解来标识。
- 声明为 final 的方法不能被重写，声明为 static 的方法不能被重写，但是能够再次声明。构造方法不能被重写。
- 返回的类型必须与被重写的方法的返回类型保持`兼容`（jdk1.5 之前返回值类型必须一样，之后的 Java 版本放宽了限制，引用数据类型的返回值类型必须小于或者等于父类方法的返回值类型，但基本数据类型和void依然必须一致）。
- 访问权限不能比父类中被重写方法的访问权限更低（public>protected>default>private）可以更为`宽松`，但一定不能更`严格`
- 重写方法一定不能抛出新的检査异常或者比被重写方法声明更加宽泛的检査型异常。例如，父类的一个方法声明了一个检査异常 IOException，在重写这个方法时就不能抛出 Exception，只能拋出 IOException 的子类异常，可以抛出非检査异常。

注意事项：

1. 父子类中一旦存在父子类同名的成员方法，那么**只要创建子类对象**，在任何位置都无法再`直接`访问到父类成员方法了，这就是继承中的`方法的覆盖`。
2. 方法的调用之所以体现为`覆盖`，这是因为方法的调用结果是根据对象的实际类型决定的，和引用没有任何关系。
3. 当然，方法的覆盖不是物理意义上的覆盖，只是方法的访问机制决定的。这个父类中的同名方法，仍然可以使用**super**关键字去访问到，当然前提是有访问权限。

<br/>

```java
// 阅读如下代码：
1) class Super{ 
2)        public float getNum(){return 3.0f;} 
3) }
4)
5) public class Sub extends Super{
6)    
7) } 
which method, placed at line 6, will cause a compiler error? B
A. public float getNum(){return 4.0f;} // 重写
B. public void getNum(){}  // 重写时基本数据类型和void必须相同 
C. public void getNum(double d){} // 参数列表相同才构成重写！！！ 这里不是方法重写
D. public double getNum(float d){return 4.0d;}
```

<br/>

**父类方法被子类覆盖，即使在父类中调用，调用到的也是子类方法**：

```java
public class Demo {
    public static void main(String[] args) {
        Father father = new Son(1000);
    }
}

class Father {
    int i = 10;

    public Father() {
        // 父类方法被子类覆盖，即使在父类中调用，调用到的也是子类方法
        // 而此时父类对象还在初始化过程中，子类对象更是还未开始初始化，其成员变量的值还是默认值
        System.out.println(getI());
    }

    public int getI() {
        return i;
    }
}

class Son extends Father {
    int i = 100;

    public Son(int i) {
        this.i = i;
    }

    public int getI() {
        return i;
    }
}
// 输出结果为 0 
```

<br/>

### 4. final修饰符

final ：最终，表示最终形态，不可改变。final 应用于类、方法和变量时意义是不同的，但本质是一样的，都表示不可改变。

- final 用在变量的前面表示变量的值不可以改变，此时该变量可以被称为常量。
  
  当使用 final 修饰基本类型变量时，不能对基本类型变量重新赋值，因此基本类型变量不能被改变。 但对于引用类型变量而言，它保存的仅仅是一个引用，final 只保证这个引用类型变量所引用的地址不会改变，即一直引用同一个对象，但这个对象完全可以发生改变。
  
  ```java
  public static final double PI= 3.14; // 全局常量 (使用final声明变量时，要求全部的字母大写)
  ```
  
  <br/>

- final 用在方法的前面表示方法不可以被重写。**（但是仍然可以被继承）**  
  
  比较多见于JDK源码中，比较常见的有：像Object类中的getClass()方法还有其中和线程相关的方法
  
  注意：并不是随便拿一个方法都能用final修饰的，比如：
  
  1. private方法，本来就无法重写，不需要多此一举。（可以修饰，但是会报警告）
  
  2. static方法，本来就无法重写，不需要多此一举。（可以修饰，但是会报警告）
  
  3. 构造方法，不能被继承，更不能重写，加final修饰会编译报错。
     
     <br/>

- final 用在类的前面表示该类不能有子类，即该类不可以被继承。
  
  思考：什么样的类需要设置成final？
  
  不需要或不想要被子类继承的类，才需要设置为final修饰。当你认为当一个类的设计已经足够完善，功能足够强大了，不需要再让子类去扩展它了。这时出于安全的考虑，就可以将一个类设置为final。这样类中成员，既不会被继承，更不会被修改。常见的final修饰的类，都在JDK的源码当中。比如四类八种基本数据类型的包装类、Void、String、System、Scanner等等

<br/>

==final修饰变量注意事项==：

- **final修饰局部变量** （方法中的局部位置有两个：方法体和形参列表）
  
  方法体中用final修饰局部变量，表示该变量一旦声明并初始化赋值，就不可再修改它的取值了
  
  **形参用final修饰后，不是表示该方法只能传入常量，而是实参一旦传入后就无法在方法体中修改了** 
  
  <br/>

- **final修饰成员变量** （注意它在内存中的位置，生命周期，使用方式等都不会改变）
  
  **成员常量的赋值，有且必须有一次** （显式赋值、构造代码块赋值、构造方法赋值，选择其一即可）
  
  <br/>
  
  **成员"常量"是不是真正意义上的常量?** 不是，因为成员"常量"属于对象，每个对象可能都有自身的常量取值，完全可能不同.
  
  **假如我们希望得到一个真正意义上的常量，在类的整个全局它的值都独一份，它应该是final修饰的静态成员变量。** 
  
  <br/>

- **final修饰静态成员变量**（常用）
  
  final修饰静态成员变量表示一个静态的"常量"，在**类的全局仅有一份**，所以final修饰静态成员变量，也称之为**"全局常量"** 
  
  和final修饰成员变量一样，全局常量的取值也不能依赖于默认值，必须 **（在类加载过程中）**明确一个值 （显式赋值或静态代码块赋值选择其一即可）
  
  ==如果使用静态代码测试类加载，那么访问类的全局常量，有些场景是不会触发类加载的==

### 5. 多态和转型

什么是多态（ **polymorphic** ）: **同一个事物，在不同的时刻/情况表现出不同的状态，就可以称之为多态。**

<br/>

在Java的多态当中，多态指的是：

1. 同一种事物：同一个引用（即父类的引用）
2. 不同的情况：指向不同的对象（不同的子类对象）
3. 不同的状态：调用同名方法会体现出不同的行为

==总结来说，Java中的多态指的是，同一个父类引用指向不同子类对象时，调用同名成员方法，根据指向实际对象的不同，得到的行为也会随之不不同==

<br/>

对面向对象来说，多态分为编译时多态和运行时多态。其中编译时多态是静态的，主要是指方法的重载，它是根据参数列表的不同来区分不同的方法。通过编译之后会变成两个不同的方法，在运行时谈不上多态。而运行时多态是动态的，它是通过动态绑定来实现的，也就是大家通常所说的多态性。

<br/>

Java多态有 3 个必要条件：继承、重写和向上转型。只有满足这 3 个条件，才能够在同一个继承结构中使用统一的逻辑实现代码处理不同的对象，从而执行不同的行为。

- 继承：在多态中必须存在有继承关系的子类和父类。
- 重写：子类对父类中某些方法进行重新定义，在调用这些方法时就会调用子类的方法。
- 向上转型：即必须存在**父类引用指向子类对象**，只有这样该引用调用父类的同名的子类重写的方法才能执行子类的方法实现

<br/>

**多态的访问特征**：

当父子类出现同名成员（变量或方法）时，使用多态的形式访问（多态的形式指：用父类引用指向子类对象，然后用引用名访问成员）时的访问特征。

- ==成员变量==：成员变量的访问是没有多态现象的，父子类存在同名成员变量，表现出属性的隐藏
  
  ==编译时（访问范围）看左边，运行时（访问结果）还看左边==

- ==成员方法==：多个子类同时重写了父类中的一个方法，并出现父类引用指向不同子类对象，并且用对象名点调用同名方法时，方法的调用结果就体现出多态的特点
  
  ==编译（访问范围）看左边，运行时（调用结果）看右边==

<br/>

**多态的优点**：

1. 要实现多态必须要继承，而继承提高了代码复用率，提升了程序的可维护性。（继承保证）

2. 有了多态后，用父类引用指向不同子类对象，只需要调用同名方法，就能自动根据不同子类对象，得出不同的行为。这大幅度简化了代码，提升了程序的扩展性。（多态保证）
   
   <br/>

**多态的缺点**：

> 多态肯定是有缺点的，而且很明显。由于多态中，使用父类引用指向子类对象，父类引用限制了子类对象的功能，这意味着：
> 
> - 子类独有的成员是无法使用父类引用访问的。
> 
> **而一旦你必须在这时候访问子类独有成员的话，这就需要把父类类型引用，再转换回子类类型的引用，从继承的方向上，这是从上到下的，称之为"向下转型"，这属于强制类型转换。**
> 
> `向下转型`是一种强转，它成功的条件相对比较苛刻。在操作之前，要先慎重考虑。
> 
> 强转失败会导致程序抛出异常：`ClassCastException`，导致程序终止执行。正是由于强转的条件苛刻，而且失败后果很严重，所以Java当中提供了检测手段，来保障强转的安全性。需要使用关键字 **instanceof**： 

<br/>

发生的前提： **必须将父类引用转换成它的子类引用，如果不是转换成它的子类引用，会编译报错** 

成功的前提：  **父类引用指向的真实对象的类型，就是要强转成的子类类型的对象或者子类对象。** 

<br/>

**instanceof关键字**: 

```java
// 判断某个对象是否是指定类的实例 (注意：instanceof 运算符只能用作对象的判断)
boolean result = obj instanceof Class 
```

```java
class Person {}
class Man extends Person{}

Person p1 = new Person();
Person p2 = new Man();  // 向上转型: 父类的对象引用指向子类实例
Man m1 = new Man();
System.out.println(p1 instanceof Man);//false
System.out.println(p2 instanceof Man);//true
System.out.println(m1 instanceof Man);//true
```

<br/>

### 6. abstract

```java
// 抽象类
abstract class class_name {
    abstract type method_name(parameter-iist);
}
```

- 抽象类不能使用 new 关键字创建对象。但是在子类创建对象时， 抽象父类构造方法同样会被调用。
- 抽象类不能使用final声明，因为final属修饰的类是不能有子类的 ， 而抽象类必须有子类实现。
- 如果一个子类继承抽象类，那么必须实现其所有的抽象方法。如果有未实现的抽象方法，那么子类也必须定义为
  abstract类

<br/>

- 如果一个方法使用 abstract 来修饰，则说明该方法是抽象方法，抽象方法只有声明没有实现。需要注意的是 abstract 关键字只能用于普通成员方法，不能用于 static 方法或者构造方法中。
- 抽象方法没有方法体，抽象方法必须存在于抽象类中，子类重写父类时，必须重写父类所有的抽象方法。
- 在使用 abstract 关键字修饰抽象方法时不能使用 private 修饰，因为抽象方法必须被子类重写。

<br/>

### 7. interface

```java
[public] interface interface_name [extends interface1_name[, interface2_name,…]] {
    // 接口体，其中可以包含定义常量和声明方法
    [public] [static] [final] type constant_name = value;          // 定义常量
    [public] [abstract] returnType method_name(parameter_list);    // 声明方法
}
```

- 接口没有普通成员变量、代码块、构造方法，也不能被实例化
- 一个接口可以有多个直接父接口，但接口只能继承接口，不能继承类
- 具有 public 访问控制符的接口，允许任何类使用；没有指定 public 的接口，其访问将局限于所属的包。
- 方法的声明不需要其他修饰符，在接口中声明的方法，将隐式地声明为公有的（public）和抽象的（abstract）。
- 在 Java 接口中声明的变量其实都是常量，接口中的变量声明，将隐式地声明为 public、static 和 final，即常量，所以接口中定义的变量必须初始化（且只能是直接赋值的方式）。

```java
<public> class <class_name> [extends superclass_name] [implements interface1_name[, interface2_name…]] {
    // 主体
}
```

- 一个类可以继承一个父类，并同时实现多个接口，implements 部分必须放在 extends 部分之后。
- 一个类实现了一个或多个接口之后，这个类必须完全实现这些接口里所定义的全部抽象方法（也就是重写这些抽象方法）；否则，该类将保留从父接口那里继承到的抽象方法，该类也必须定义成抽象类。

<br/>

**接口和抽象类的区别**：

1. 抽象类要被子类继承，接口要被类实现。

2. 接口只能声明抽象方法，抽象类中可以声明抽象方法，也可以写非抽象方法。

3. 接口里定义的变量只能是公共的静态的常量，抽象类中则可以定义普通变量。

4. 抽象类使用继承来使用， 无法多继承。 接口使用实现来使用， 可以多实现。接口可以继承多个接口

5. 抽象类中可以包含static方法 ，但是接口中不允许（静态方法不能被子类重写，因此接口中不能声明静态方法）
   
   但jdk1.8后，接口新增了default方法和static方法的实现

6. 接口不能有构造方法，但是抽象类可以有

| **区别点** | **抽象类**              | **接口**                   |
|:-------:|:--------------------:|:------------------------ |
| 定义      | 包含抽象方法的类             | 抽象方法和全局常量的集合             |
| 组成      | 构造方法、抽象方法、普通方法、常量、变量 | 常量、抽象方法、(jdk8:默认方法、静态方法) |
| 使用      | 子类继承抽象类(extends)     | 子类实现接口(implements)       |
| 关系      | 抽象类可以实现多个接口          | 接口不能继承抽象类，但允许继承多个接口      |
| 对象      | 不能创建对象，但是有构造方法       | 不能创建对象，也没有构造方法           |
| 局限      | 抽象类不能被多继承            | 接口之间能多继承，能被多实现           |
| 思想      | 作为模板或对共性属性和行为抽象，is-a | 作为标准或对共性行为抽象，like-a      |
| 访问权限    | 抽象类的成员，写访问权限比较自由。    | 接口的成员，必须是public修饰的       |

选择 :  **如果抽象类和接口都可以使用的话，优先使用接口，避免单继承的局限**   

总之，抽象类和接口除了都是抽象外，区别相当明显。抽象类是作为继承层次中的顶层父类存在的，接口则比较自由。

<br/>

### 8. 包装类

在Java中有一个设计的原则“一切皆对象”，那么这样一来Java中的一些基本的数据类型，就完全不符合于这种设计思
想，因为Java中的八种基本数据类型并不是引用数据类型，所以Java中为了解决这样的问题，引入了八种基本数据类型
的包装类。八种包装类也是分为两种大的类型的：

- Number：Integer、Short、Long、Double、Float、Byte都是Number的子类，表示是一个数字。
- Object：Character、Boolean都是Object的直接子类。

<br/>

**装箱和拆箱**：

- 基本数据类型转换为包装类的过程称为装箱，例如把 int 包装成 Integer 类的对象；

- 包装类变为基本数据类型的过程称为拆箱，例如把 Integer 类的对象重新简化为 int。

```java
// 装箱操作：
// 在JDK1.4及之前 ，如果要想装箱，直接使用各个包装类的构造方法即可，例如：
int temp = 10 ;                
Integer x = new Integer(temp) ; // 将基本数据类型变为包装类

// 从JDK1.5起，Java新增了自动装箱和自动拆箱，而且可以直接通过包装类进行四则运算和自增自建操作。例如：
Float f = 10.3f ; // 自动装箱
float x = f ;     // 自动拆箱
```

<br/>

**注意缓存的坑！！！**：

```java
// 阅读代码
public class Equals{
    public static void add3(Integer i){ 
       int val = i.intValue();
       val += 3; 
       i = new Integer(val); 
    }
    public static void main(String args[]){
        Integer i=new Integer(0); 
        add3(i); 
        System.out.println(i.intValue());
    }
}
what is the result?  B
A. compile fail
B. print out "0"
C. print out "3"
D. compile succeded but exception at line 3
```

Java中除了对Integer有缓存机制外，其中还有ByteCache，ShortCache，LongCache，CharacterCache分别对其对应的类型进行缓存，其中Byte，Short，Long的缓存范围都为-128——127，Character为0——127。特别要注意的是这几个缓存中，只有Integer的缓存上限（high）可以设置，其他的都不能进行设置，为固定范围。

<br/>

**字符串与数值的转换**：

```java
public class Demo {
    public static void main(String[] args) {
        String str1 = "30";
        String str2 = "30.3";

        int x = Integer.parseInt(str1);    // 将字符串变为int型
        float f = Float.parseFloat(str2);  // 将字符串变为float型

        int num = 500;
        String s = Integer.toString(num);  // 将整数转换为字符串
    }
}
```

<br/>

### 9. is-a & has a

面向对象的核心思想是：抽象、封装、继承、多态。在实践中用的比较多的术语就是 is a（是一个） ，和 has a（有一个）

<img src="https://image.ventix.top/java/image-20211008210850686.png" alt="image-20211008210850686" style="zoom: 33%;" />

- 继承（ is a）：主要是多态的体现。两个类之间是继承关系。
  
  ```java
  class Person{}
  class Student extends Person{}
  
  Person p = new Student()
  ```
  
  学生类继承了人类，那么我们可以说“学生是一个人类”，即 is-a是一个的关系。变量 p 声明为Person类型，但是可以给它赋值一个Student类型的对象。这就是多态的体现，是一种设计模式。

- 组合（has a）：has-a 也是一种设计模式。表示这个对象包含另外一个对象，也表示这个对象依赖于另一个对象。所谓的包含就是另一个对象它是这个对象的属性，仅此而已。两个类之间是组合关系。
  
  ```java
  //引擎类
  class Engine{} 
  
  // 汽车类：有一个引擎类的属性
  class Car{
    Engine engine;
  } 
  ```

<br/>

## 三 内部类

在Java中，可以将一个类定义在另一个类里面或者一个方法里面，这样的类称为内部类。

广泛意义上的内部类一般来说包括这四种：
1. 成员内部类
2. 静态内部类
3. 局部内部类
4. 匿名内部类

按照它是一个类，还是一个对象来分类：

1. **定义一个类，包括成员内部类、静态内部类和局部内部类** , 既然是定义了一个类，使用时还需要创建对象才能用。
2. **直接创建了一个对象，包括匿名内部类和Lambda表达式。** 由于已经通过语法创建了对象，可以直接使用。


::: tip 内部类的特点
- 内部类仍然是一个独立的类，在编译之后内部类会被编译成独立的`.class`文件，但是前面冠以外部类的类名和`$`符号。
- 内部类不能用普通的方式访问。内部类是外部类的一个成员，因此内部类可以自由地访问外部类的成员变量，无论是否为 private 。
- 内部类声明成静态的，就不能随便访问外部类的成员变量，但是仍然能访问外部类的静态成员变量。
:::


### 1. 成员内部类

成员内部类是最普通的内部类，它的定义为位于另一个类的内部（成员位置，可以**看成该类的一个成员** ）

- ==成员内部类可以看成该类的一个成员。所以，想要得到成员内部类对象，必须先创建外围类对象==
- 可以定义普通成员变量、成员方法、构造器、构造代码块
- 但没有静态声明（包括静态变量，静态方法，静态代码块）
- 但可以有静态全局常量。（只允许那些不触发类加载的，这些常量编译器会直接存在常量池中，和变量特点不一样。可以认为和这个类完全没有关系）

<br/>

**成员内部类的访问特点**：

1. **成员内部类内部访问外围类**  
   
   可以直接访问，不受权限限制
   
   ```java
   public class Demo {
       public static void main(String[] args) {
           Outer.Inner inner = new Outer().new Inner();
           inner.say();
       }
   }
   ```
   
   ![](https://image.ventix.top/java/image-20220210231711195.png)
   
   <br/>

2. **外围类访问成员内部类成员**  
   
   - 外围类的成员方法中访问成员内部类成员：
     
     ```java
     public class Demo {
         public static void main(String[] args) {
             new Outer().print();
         }
     }
     ```
     
     ```java
     public class Outer {
         private int a = 10;
     
         public void print() {
             Inner inner = new Inner();
             System.out.println(inner.a);  // 11
         }
     
         class Inner {
             private int a = 11;
         }
     }
     ```
   
   - 外围类的静态成员方法中访问成员内部类成员
     
     ```java
     public class Demo {
         public static void main(String[] args) {
             Outer.print();
         }
     }
     ```
     
     ```java
     public class Outer {
         private int a = 10;
     
         public static void print() {
             // 成员内部类对象依赖外围类对象而存在， 所以得先存在外围类对象再创建内部类对象
             Inner inner = new Outer().new Inner(); 
             System.out.println(inner.a);  
         }
     
         class Inner {
             private int a = 11;
         }
     }
     ```
     
     <br/>

3. **外部类访问成员内部类成员** 
   
   **注意**： 内部类的设计往往就是为了不让外界访问，一般都是 private 修饰的。此处讨论的外界可访问情形仅作为了解
   
   外部类要访问成员内部类成员，条件比较苛刻，由于成员内部类属于外围类的一个成员，所以首先外部类需要有外围类的访问权限，再次还需要成员内部类的访问权限。
   
   ```java
   public class Outer {
       private int a = 10;
   
       class Inner {
           private int a = 11;
           public int b = 12;
       }
   }
   ```
   
   ![](https://image.ventix.top/java/image-20220210233637084.png)

​        <br/>

4. **成员内部类访问外部类成员** 
   
   在成员内部类中访问外部类成员，和在普通类中访问其它类成员别无二致 
   
   ```java
   public class Demo {
       public static void main(String[] args) {
           Outer.Inner inner = new Outer().new Inner();
           inner.print();
       }
   }
   ```
   
   ```java
   public class Outer {
   
       class Inner {
           public void print() {
               Other other = new Other();
               System.out.println(other.a);
           }
       }
   }
   
   class Other {
       int a = 5;
   }
   ```

<br/>

### 2. 静态内部类

**（静态嵌套类）**： 在Oracle公司官网有一段文字解释静态内部类和成员内部类的区别：

Nested classes that are declared static are called static nested classes. Non-static nested classes are called inner classes.

翻译过来就是：声明为static的嵌套类称为静态嵌套类，非static嵌套类才被成为内部类。

理解这句话，关键点就在于nested和inner的区别：

1. nested，嵌套，指的是：`直接把一个类丢到另一个类中，两个类其实没太大关系。` 
2. inner，内部，指的是：`某个类本身就是另一个类的一部分，在内部。` 

这其实就已经说明白了，成员内部类和静态内部类的区别：

1. **成员内部类必须依赖外围类存在，创建成员内部类对象必须持有外围类对象的引用。** 

2. **静态内部类和外围类就是独立的两个类，只不过静态内部类借用外围类来保护自己罢了。** 
   
   **相比较而言，成员内部类和外围类的关系是：心脏——身体，CPU——计算机** 
   
   **而静态内部类和外围类的关系是：寄居蟹——螺壳** 

<br/>

静态内部类对象和外围类对象完全独立， **静态内部类对象不会持有外围类对象引用**，所以它是内部类中的异类。实际开发中，你就将它作为一个可以定义在类的内部，隐藏自身存在的一个普通类，去使用就可以了。

<br/>

**静态内部类的访问特点**： 

1. #### 静态内部类内部访问外围类
   
   不管是静态内部类中的静态方法还是成员方法，都没有外围类对象存在，需要创建对象访问 (`new Outer()`) 
   
   ```java
   public class Demo {
       public static void main(String[] args) {
           Outer.Inner inner = new Outer.Inner();
           inner.print();
       }
   }
   ```
   
   ```java
   public class Outer {
       private int a = 11;  
   
       static class Inner {
           public void print() {
               Outer outer = new Outer();
               System.out.println(outer.a); // 且不受访问权限限制
           }
       }
   }
   ```
   
   <br/>

2. #### 外围类访问静态内部类成员
   
   不管是外围类中的静态方法还是成员方法，都没有静态内部类对象存在，需要创建对象访问 (直接new对象就可以了)
   
   ```java
   public class Demo {
       public static void main(String[] args) {
           Outer outer = new Outer();
           outer.print();
       }
   }
   ```
   
   ```java
   public class Outer {
       public void print() { 
           Inner inner = new Inner();
           System.out.println(inner.a); // 同样不受访问权限限制,即便是静态方法也一样
       }
   
       static class Inner {
           private int a = 18; 
       }
   }
   ```
   
   <br/>

3. #### 外部类访问静态内部类成员
   
   主要就是考虑权限，先要有外围类权限，再要有静态内部类权限
   
   ![](https://image.ventix.top/java/image-20220211085657120.png)

<br/>

4. #### 静态内部类访问外部类成员
   
   创建对象访问即可，受权限控制
   
   <br/>

### 3. 局部内部类

定义在一个方法或者一个作用域里面的类（看成是局部变量即可），该类的有效范围仅在作用域内部。（这意味着要创建它的对象，必须在作用域内部创建）

::: info 局部内部类
1. 局部内部类是一种比成员内部类更加极致封装思想的体现，成员内部类在成员位置，类中都是可以访问到它的。但是局部内部类一旦出了作用域等就不再生效了。
2. **局部内部类的使用会显著增加代码层级，导致代码可读性很变差，所以如无必要不要使用局部内部类。如果你在局部位置碰到问题，希望有一个对象能够解决问题，需要定义一个类，同时又希望该类不被外界所感知，仅在方法内部生效，就可以使用局部内部类** 。当然，局部内部类在某些时候，还能节省一些代码量，会方便一些。
3. 局部内部类的成员特点和成员内部类一模一样：
   - 没有静态static声明，但可以创建全局常量（不触发类加载的）
   - 有构造方法和构造代码块
4. 局部内部类可以继承和实现外部的类或者接口，这是局部内部类的一个重要用途
:::
注意: 局部内部类就像是方法里面的一个局部变量一样，是不能有public、protected、private以及static修饰符的


::: tip 局部内部类的访问特点 
**局部内部类访问外围类成员仍不受权限限制。但局部内部类的作用域已被限制死了，外围类中只有装着局部内部类的作用域内，能访问到该局部内部类。** 外部类已经完全无法访问到局部内部类了
:::


1. #### 局部内部类在外围类的成员方法中
   
   外围类的成员方法中，是隐含自身类对象的引用的，并且这个引用编译器会自动加入到局部内部类中。也就是说， **处在外围类成员方法中的局部内部类，会持有外围类对象的引用。** 即可以直接在局部内部类的成员方法中，访问外围类的成员
   
   ```java
   public class Outer {
       private int a = 18;
   
       public void print() {
           class Inner {
               int a = 10;
   
               public void method() {
                   System.out.println("Inner a = " + a);
                   System.out.println("Outer a = " + Outer.this.a);
               }
           }
   
           Inner inner = new Inner();
           inner.method();
       }
   }
   ```
   
   ```java
   public class Demo {
       public static void main(String[] args) {
           Outer outer = new Outer();
           outer.print();
       }
   }
   
   /** 运行结果：
       Inner a = 10
       Outer a = 18
   */
   ```
   
   <br/>

2. #### 局部内部类在外围类的静态成员方法中
   
   与成员方法不同的是，静态方法中，局部内部类对象不会持有外围类对象的引用
   
   ```java
   public class Outer {
       private int a = 18;
   
       public static void print() {
           class Inner {
               int a = 10;
   
               public void method() {
                   System.out.println("Inner a = " + a);
                   System.out.println("Outer a = " + new Outer().a); //想要访问外围类成员，需要创建对象
               }
           }
   
           Inner inner = new Inner();
           inner.method();
       }
   }
   ```
   
   ```java
   public class Demo {
       public static void main(String[] args) {
           Outer .print();
       }
   }
   ```



### 4. 匿名内部类

**即没有名字的 局部内部类**： 是指没有类名的内部类，必须在创建时使用 new 语句来声明类

==匿名内部类的本质：是一个继承了类或者实现了接口的匿名子类对象==

::: info 匿名内部类的两种实现方式
- 继承一个类，重写其方法。
- 实现一个接口（可以是多个），实现其方法。
:::

代码示例：
```java
public class Demo {
    public static void main(String[] args) {
        final int NUM = 10;

        // 继承一个类，重写其方法 （父引用接收对象，然后再用引用访问方法）
        OuterClass oc = new OuterClass() {
            int a = 11;

            public void show() {
                System.out.println("匿名内部内的show");
            }
        };
        oc.show();
        // System.out.println(oc.a); 
        // 不能访问子类独有成员（真的无法访问，无法强转，因为子类已经匿名了)

        // 直接在后面调用方法，访问它的方法（当一个匿名对象使用）
        new OuterClass() {
            @Override
            public void show() {
                super.show();
            }

            public void print() {
                System.out.println("匿名内部类访问局部变量：NUM = " + NUM);
            }
        }.print();
    }
}

class OuterClass {
    public void show() {
        System.out.println("OuterClass show");
    }
}
```

1. 使用匿名内部类时，我们必须是继承一个类或者实现一个接口，但是两者不可兼得，同时也只能继承一个类或者实现一个接口。
2. 匿名内部类中是不能定义构造函数的。
3. 匿名内部类中不能存在任何的静态成员变量和静态方法。
4. 匿名内部类为局部内部类，所以局部内部类的所有限制同样对匿名内部类生效。
5. 匿名内部类不能是抽象的，它必须要实现继承的类或者实现的接口的所有抽象方法。
6. 只能访问final型的局部变量。局部内部类和匿名内部类访问的局部变量必须由 final 修饰，以保证内部类和外部类的数据一致性。但从 Java 8 开始，我们可以不加 final 修饰符，由系统默认添加，当然这在 Java 8 以前的版本是不允许的。Java 将这个功能称为 `Effectively final` 功能。

<br/>



## 四 Object类

Object类是所有类继承层次的祖先类，Java中所有类（包括数组）都直接或者间接的继承自该类，都实现了该类的方法

- 自定义类时，我们并不需要特别的标注`extends Object`，这是一个隐式的继承。如果一个类没有明确的指出它的父类，Object类就默认是这个类的父类

- **Object是没有成员变量定义的，并且由于子类对象的隐式初始化，Object类有且仅有一个默认提供的无参构造方法。所以我们学习Object类，主要关注它的成员方法** 
  
  - `getClass()`方法是Java反射的前置知识点。
  - `toString()`方法提供了将对象字符串化的方式。
  - `equals(Object obj)` **方法用于判断对象相等，非常重要。**
  - `hashCode()`**方法用于获取哈希值，在集合使用中非常重要。**
  - `finalize()`方法，仅作了解，实际意义很小。
  - `clone()`方法，一种创建对象的新方式。
  
  注：像`notify()`、`wait()`等成员方法的详细功能，在Java的线程相关笔记中

<br/>

### 1. toString

**在Java中，如果直接打印一个对象名（引用名），默认就会调用该类的toString方法**, 如果类中没有重写该方法，就会去使用Object类的默认实现 （把对象名和字符串操作连接起来的地方，会自动调用对象的`toString`方法）

关于`toString`方法的作用，在JDK文档中，有详细的说明，主要说以下四点：

1. 返回该对象（调用toString方法的对象）的字符串表示。
2. 通常，`toString`方法会返回一个“以文本方式表示”此对象的字符串。
3. 结果应是一个简明但易于读懂的信息表达式。
4. 建议所有子类都重写此方法。toString方法的默认实现是输出：`全限定类名 +  @  +  对象的十六进制地址值` 

<br/>

**注意事项**：

- toString方法就是**为了完成打印成员变量取值的工作的，不要在里面写一些奇怪的代码**。 
  
  IDEA的debug模式下，会自动调用类的toString方法，去在界面上展示对象。如果你在toString方法中写赋值语句，就会导致debug报错，但正常run不报错的奇怪情况

- toString方法可以快速自动生成，仍然用alt+insert。一般情况下，没有特殊需求，直接自动生成即可，没有必要手写。

- 如果类中有（自定义）引用数据类型成员变量，也需要重写它的toString方法，不然就会打印地址值了。

- 为了避免空指针异常，**打印对象名或对象名拼接字符串中**的**隐含调用的toString方法**能不写出来就不要写出来，不要画蛇添足。

<br/>

### 2. equals

用于指示其他某个对象是否与此对象 "相等"

```java
public boolean equals(Object obj)
```

- 该方法是有参数的，需要传入一个对象（任意一个对象就行）
- 方法是有返回值的，返回一个布尔类型的值，真或假

<br/>

**equals默认实现**： 

```java
public boolean equals(Object obj) {
 return (this ==obj);
}
```

双等号直接连接引用，比较对象的地址。即比较两个引用是否指向同一个对象，只有当两个引用完全指向同一个对象时，方法才会返回true，否则都会返回false

<br/>

**重写equals方法的常规协定**： Java官方为我们提供了官方的要求，称之为`equals方法重写的常规协定`：

1. 自反性：对于任何非空引用值 x，`x.equals(x)`都应返回 true
2. 排他性：当比对的不是同种类型的对象或者是一个null时，默认返回false
3. 对称性：对于任何非空引用值 x 和 y，当且仅当`y.equals(x)` 返回 true 时，x.equals(y) 才应返回true
4. 传递性：对于任何非空引用值 x、y 和 z，如果`x.equals(y)`返回 true，并且 `y.equals(z)` 返回 true，那么`x.equals(z)` 应返回 true。
5. 一致性：对于任何非空引用值 x 和 y，多次调用 `x.equals(y)`始终返回 true 或始终返回 false。

以上5点常规协定， **其中自反性和排它性需要写代码做判断，而对称性，一致性，传递性，只需要用成员变量的取值来判断对象相等，就自动满足它们。** 

```java
// Animal类的 equals 方法重写示例：
@Override
    public boolean equals(Object obj) {
        // 自反性：即自己和自己比较,应该无条件返回tru
        if (this ==obj) {
            return true;
        }
        // 排他性：如果传入的对象不是同种类型对象或者为null,直接认定不相等,返回false
        // 1.严格判断是否同一个类型
        if (obj ==null || this.getClass() != obj.getClass()) {
            return false;
        }
        // 2. 允许子类传入
        /* if(!(obj instanceof Animal)){
            return false;
        }
         */

        // 用成员变量的取值来判断对象相等,对称性,传递性,一致性自动满足
        Animal animal = (Animal) obj;
        return this.age ==animal.age && Objects.equals(animal.name, this.name) &&
                  Double.compare(this.price, animal.price) ==0;
    }
```

<br/>

**重写equals方法的注意事项**： 

- 在实现排他性时，实际上有两种选择：
  
  - **使用getClass方法比较**。  **这个比较是比较苛刻的，只有在完全是同一个类型时才会返回true** 
  - **使用instanceof比较**。 这个比较的条件就比较宽松了，可以允许传入子类对象

- equals方法也是可以用快捷键自动生成的，使用快捷键`alt + insert`。而且可以选择在实现`排它性`时的方式。

- 浮点数比较特殊，它具有规格化和非规格化的区别，还有非数(NaN)，无穷大，无穷小很多特殊的概念，正常情况下，如果仅仅比较数值，用`==`比较相等是够用的。但为了避免因浮点数特殊值，而出现的错误。实际开发中，从严谨角度出发，浮点数的比较仍然建议使用对应包装类型的`compare`方法去比较浮点数的大小：
  
  1. Float.compare(float a,float b)
  2. Double.compare(double a,doublet b)
  
  这两个方法在,a < b时返回-1(负数)，在a>b时，返回1(正数)，只有在两个浮点数相等时，才会返回0

- 如果类中有引用数据类型成员变量，需要去调用它们的equals方法完成比较。这就意味着还需要重写这个类的equals方法。

- 财务金额上的运算是不推荐使用浮点数的，会出现精度问题。推荐使用`BigDecimal`这个类完成运算

<br/>

### 3. hashCode

Java中的hashCode方法表示一种哈希映射的规则，它把一个无限大小的集合(某个类的对象)，映射到一个有限大小的集合(int整数)
即把一个对象变成一个int整数，这个int整数就是该对象的哈希值。在这个过程中,可能会出现"多对一"的情况,称之为"哈希冲突".

```java
public native int hashCode();
```

它是一个本地方法，返回该对象的哈希码值。支持此方法是为了提高哈希表（例如 java.util.Hashtable 提供的哈希表）的性能

Object类当中的哈希算法实现（本地方法）：是根据对象的地址计算出一个十进制int整数

- 如果对象的地址一样(同一个对象) 那么它们的哈希值是一定相同的(因为映射的定义告诉我们,集合A唯一映射集合B)
* 反之，如果不是同一个对象,一般来说哈希值是不同的.(但是出现相同的情况,也很正常,因为哈希冲突)

<br/>

**重写hashCode方法**： equals方法和hashCode方法要么都不重写,要么必须都同时重写（ 如果都不重写的话,它们都 是依据地址来计算的） ，即和equals方法保证一样的重写规则：使用相同的成员变量的取值重写

==一般来说,使用IDEA自动生成就可以了.如果有特殊需求,可以自己重写== 

<br/>

注意事项：

- toString方法的默认实现, 会调用该对象的hashCode方法、默认的hashCode方法实现是通过计算地址得到的一个值
  
       但是如果重写过hashCode方法,尤其是通过成员变量的取值重写,那么默认的toString方法就不会再打印地址值了.
       所以如果重写了hashCode方法,可以顺手一起重写toString方法

- 如果类中有引用数据类型成员变量,建议一起重写该类的hashCode方法

<br/>

### 4. clone

clone就是克隆,Java中的克隆是通过一个对象,获取一个和原先对象完全相同,但又相对独立的对象。

clone方法是完全不同于new对象的一种创建对象的方式,不依赖于构造器,依赖于本地方法创建对象。

<br/>

clone方法的使用步骤：

- 继承 java.lang.Cloneable接口
- 重写方法（突破protected访问权限的限制）
- 重写返回值类型(选 做,非必须)

<br/>

注意事项：

```
1.clone方法和new对象是平行的两种创建对象方式,clone不会调用构造方法
2.Cloneable接口说明,它是一个比较特殊的接口,它是一个空接口,它完全没有抽象方法.
  空接口的作用,它是一种标记接口，实现它虽然不能新增成员,但是能够允许做某些操作
3.clone方法不是final修饰的,如果确有必须,是可以重写的(这种需求很少见,一般使用Object类的默认实现就足够了)
*      重写clone方法的原则:
*          1. x.clone() != x 为 true
*          2. x.clone().getClass() ==x.getClass() 一般也为true
*          3. x.clone().equals(x) 一般情况下也为true

上述规定告诉我们：
1. 克隆必须是一个新的独立的对象
2. 克隆最好不要改变数据类型，除非你真的有需要。
3. 克隆后的两个对象调用equals方法，应该返回true。前提是，必须按照成员变量的取值重写equals方法。
   如果equals方法没有重写,依据地址比较两个对象,那结果肯定是false.
```

<br/>

**深度克隆**： 

- 如果类中有引用数据类型的成员变量,那就需要做深度克隆,来保证两个对象完全独立 
- 如果引用数据类型的成员变量的类中,还有引用数据类型,再做一次深度克隆即可 

在浅拷贝的基础上, 继续克隆成员变量引用所指向的对象,然后让克隆引用指向克隆后对象、最后克隆对象即可和原先对象保持完全独立

```java
public class CloneDemo {
    public static void main(String[] args) throws CloneNotSupportedException {
        Teacher t1 = new Teacher(22, "张三", new Student(12, "李四", new Star(18, "如花")));
        Teacher cloneTeacher = t1.clone();

        System.out.println(t1.stu);
        System.out.println(cloneTeacher.stu);

        System.out.println(t1.stu.s);
        System.out.println(cloneTeacher.stu.s);

        System.out.println(t1.stu ==cloneTeacher.stu);
        System.out.println(t1.stu.s ==cloneTeacher.stu.s);
    }
}

class Teacher implements Cloneable {
    int age;
    String name;
    Student stu;

    public Teacher() {
    }

    public Teacher(int age, String name, Student stu) {
        this.age = age;
        this.name = name;
        this.stu = stu;
    }

    @Override
    protected Teacher clone() throws CloneNotSupportedException {
        Teacher result = (Teacher) super.clone();
        result.stu = (Student) this.stu.clone();
        return result;
    }
}

class Student implements Cloneable {
    int age;
    String name;
    Star s;

    public Student() {
    }

    public Student(int age, String name, Star s) {
        this.age = age;
        this.name = name;
        this.s = s;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        Student cloneStudent = (Student) super.clone();
        cloneStudent.s = (Star) this.s.clone();
        return cloneStudent;
    }
}

class Star implements Cloneable {
    int age;
    String name;

    public Star() {
    }

    public Star(int age, String name) {
        this.age = age;
        this.name = name;
    }

    @Override
    protected Star clone() throws CloneNotSupportedException {
        return (Star) super.clone();
    }
}
```

![](https://image.ventix.top/java/image-20220214205624892.png)

<br/>

### 5. finalize

```java
protected void finalize() throws Throwable { }
```

finalize方法在Java中,是一个比较失败的设计.它是模仿借鉴自C++中的析构函数,来实现析构函数的作用,但是没有成功.（finalize方法仅做了解即可）

C++中和对象生命周期相关的两个函数:

- 和对象的"出生"相关的,构造函数.——对应Java的构造器或者构造方法

- 和对象的"销毁"相关的,析构函数.——对应Java的finalize方法

析构函数的作用是在销毁对象的同时,释放对象所占内存空间的同时,释放掉对象所占用的系统资源

对象往往会占用两种资源:

* 自身存储所占的内存空间

* 对象实现功能,需要占用系统的额外资源.
  
  (比如对象做IO操作时,需要占用的系统IO资源,还有做数据库操作时占用数据库资源,网络操作时,占用的网络资源)

资源1,往往都可以正常释放资源,而资源2也需要释放,如果对象一直占用系统资源,就会导致系统资源一直被占用却不使用的情况.

C++的析构函数就是来释放对象所占的额外资源的,做对象"销毁"的善后工作，finalize方法和析构函数类似,也是在对象销毁的同时被JVM自动调用, 理想情况下,Java程序员也可以把释放资源代码写入finalize方法，达到销毁对象的同时,释放对象所占系统资源的目的.

但是这种想法是实现不了的(C++中可以实现,Java中不行)这和GC是相关的,C++中的对象销毁具有准时性和确定性,析构函数的执行也具有确定性,能够及时的释放系统资源，但是Java的GC具有不确定性和非准时性,连带着finalize方法的执行也是不确定的,释放资源是非常重要的事情,重要的事情不能交给不靠谱的"人"做.

释放资源需要及时释放，所以Java中的,对象所占资源释放是全手动的,需要程序员手动完成,这样才能保证及时释放资源.

```java
// java垃圾回收具有 不确定性和非准时性 的实例说明
public class FinalizeDemo {
    public static void main(String[] args) {
        // 创建匿名对象
        new Person();
        // 通知GC进行垃圾回收,一旦GC回收匿名对象A,那么该类的finalize方法会自动执行
        System.gc();
    }
}

class Person {
    @Override
    protected void finalize() throws Throwable {
        System.out.println("释放资源!");
    }
}
```

多次运行上述代码，有时打印 "释放资源!"，有时又不打印，表示垃圾回收具有不确定性和非准时性

![](https://image.ventix.top/java/image-20220214210814669.png)

<br/>

### 6. getClass

通过一个本地方法的实现，去获取Class对象

```java
public final native Class<?> getClass();
```

<br/>

**Class对象（运行时类对象）**： 

- **程序运行期间，JVM通过类加载能够了解某个类型的信息，那如果程序员也想在程序的运行期间获取某个类的类型信息呢？** （这种需求是很常见的，因为如果运行期间程序员也能获取类型信息，那就意味着程序具有了动态性，大大提升程序的灵活性。）

- 为了满足程序员的这种需求，于是，JVM在类加载某个类的同时，会在堆上会自动创建一个该类的**运行时类对象**，也就是这个类的Class对象。Class对象当中，包含了该类的所有类型信息**（比如类名，方法、变量、构造器等）** 

![](https://image.ventix.top/java/image-20220214124021669.png)

<br/>

**使用`getClass`方法的注意事项** ：

- 对象是JVM在类加载时创建的，不是`getClass`方法创建的。Class对象和某个类的对象也没有关系（还有几种获取Class对象的方式，可以不创建某个类的对象也能获取类的Class对象
- **一个类的类加载只有一次，同一个类型的运行时Class对象在内存中，也只有唯一一个。**而不同类的Class对象必然不是同一个对象。 **这一点是非常重要的，用这个特点，可以判断两个引用所指向的对象是否是同一个类型的对象** 
- 运行时类的Class对象只有一个，而类的对象可以有无数个。有时，我们也把类的运行时对象，称之为"类对象"。而具体的类的对象，称之为"类的对象"

```java
public class ClassDemo {
    public static void main(String[] args) {
        Cat cat1 = new Cat();
        Cat cat2 = new Cat();
        System.out.println(cat1.getClass());
        System.out.println(cat2.getClass());

        Animal ac = new Cat();
        System.out.println(ac.getClass());
        System.out.println(cat1.getClass() ==cat2.getClass() && cat1.getClass() ==ac.getClass()); // true
    }
}

class Animal{}
class Cat extends Animal{}
```

![](https://image.ventix.top/java/image-20220214103004016.png)

<br/>

## 五 Java异常

### 1. 异常简介

Java中的异常是一个在程序执行期间发生的事件，它中断正在执行程序的正常指令流。

Java 通过面向对象的方法来处理异常。在一个方法的运行过程中，如果发生了异常，则这个方法会产生代表该异常的一个对象，并把它交给运行时的系统，运行时系统寻找相应的代码来处理这一异常。

我们把生成异常对象，并把它提交给运行时系统的过程称为`拋出（throw）`异常。运行时系统在方法的调用栈中查找，直到找到能够处理该类型异常的对象，这一个过程称为`捕获（catch）`异常。

<img title="" src="https://image.ventix.top/java/image-20211009131219704.png" alt="image-20211009131219704" style="zoom: 67%;">

- Error和 Exception都是 java.lang.Throwable 类的子类，只有继承了 Throwable 类的实例才能被 throw 或者 catch。

```java
try {
    // 可能会发生异常的语句
} catch(ExceptionType e) {
    // 处理异常语句
} finally {
    // 在任何情况下都必须执行的代码 ( 除非在try块、catch块中调用了退出虚拟机的方法System.exit(int status) )
}
```

**多异常捕获**：

```java
try{
    // 可能会发生异常的语句
} catch (FileNotFoundException e) {
    // 处理FileNotFoundException异常
} catch (IOException e) {
    // 处理IOException异常
} catch (ParseException e) {
    // 处理ParseException异常
}

// 不同类型的异常，若处理方法都一样。则可以采用Java 7 推出了多异常捕获技术，可以把这些异常合并处理：
try{
    // 可能会发生异常的语句
} catch (IOException | ParseException e) {
    // 统一处理IOException和ParseException
}
```

![](https://image.ventix.top/java/image-20211011112209555.png)

1. 如果 try 代码块中没有拋出异常，则执行完 try 代码块之后直接执行 finally 代码块，然后执行 try catch finally 语句块之后的语句。
2. 如果 try 代码块中拋出异常，并被 catch 子句捕捉，那么在拋出异常的地方终止 try 代码块的执行，转而执行相匹配的 catch 代码块，之后执行 finally 代码块。如果 finally 代码块中没有拋出异常，则继续执行 try catch finally 语句块之后的语句；如果 finally 代码块中拋出异常，则把该异常传递给该方法的调用者。
3. 如果 try 代码块中拋出的异常没有被任何 catch 子句捕捉到，那么将直接执行 finally 代码块中的语句，并把该异常传递给该方法的调用者。

<br/>

### 2. finally和return

除非在try块、catch块中调用了退出虚拟机的方法`System.exit(int status)`，否则finally语句块都会执行，但是当有return语句块存在时，返回值有时却会让人误解

下面先来看看finally语句块中存在return的情况：

```java
public class ExceptionDemo {
    public static void main(String[] args) {
        System.out.println("Result: " + test());  // 3 
    }

    private static int test() {
        int n = 1;
        try {
            System.out.println("try");
            return n += 1;  // n = 2
        }catch (Exception e){
            System.out.println("catch");
        }finally {
            n = n + 1;   // n = 3
            System.out.println("finally, n = " + n);
            return n;
        }
    }
}
```

![](https://image.ventix.top/java/image-20211009143706534.png)

<br/>

可以看到**finally块中的return会覆盖try块中的return**，若finally中没有return呢？

```java
public class ExceptionDemo {
    public static void main(String[] args) {
        System.out.println("Result: " + test());  // 2
    }

    private static int test() {
        int n = 1;
        try {
            System.out.println("try");
            return n += 1;
        }catch (Exception e){
            System.out.println("catch");
        }finally {
            n = n + 1;
            System.out.println("finally, n = " + n); // 3
        }
        return n;
    }
}
```

![](https://image.ventix.top/java/image-20211009143647721.png)

<br/>

该例中finally语句块的确是执行了，但返回值却是try语句块中的结果，这是因为return语句返回时涉及到了函数间的参数专递，Java的传递是值传递，基本数据类型都是直接拷贝栈中数值，原来函数中的变量再改变不会影响到已传递的值。

到此可以确定，若返回的是引用数据类型，finally语句中的改变必然是会生效的，因为传递的返回值和函数中的对象引用都是指向堆内存中的同一个对象，下面再通过一个例子检验一下：

```java
public class ExceptionDemo2 {
    public static void main(String[] args) {
        Person tom = new Person("tom", 18);
        tom = changeAge(tom);
        System.out.println("Result: tom's age = " + tom.getAge());
    }

    private static Person changeAge(Person p) {
        try {
            System.out.println("try");
            p.setAge(19);
            return p;
        }catch (Exception e){
            System.out.println("catch");
        }finally {
            p.setAge(20);
            System.out.println("finally");
        }
        return p;
    }
}
```

![](https://image.ventix.top/java/image-20211009143619632.png)

**结论**：

- finally块中的语句，在try或catch中的return语句执行之后、返回之前执行
- finally块中的return会覆盖try块中的return
- finally块中不存在return语句时，finally语句中的“干扰”并不会影响try、catch中return已经确定的返回值，若是返回结果是对象引用，其值（地址值）也不会改变，但是其指向对象的属性却是可能会变的。（参照java方法的参数传递）

<br/>

### 3. throw和throws

**throws 声明异常**：

当一个方法产生一个它不处理的异常时，那么就需要在该方法的头部声明这个异常，以便将该异常传递到方法的外部进行处理。使用 throws 声明的方法表示此方法不处理异常。throws 具体格式如下：

```java
returnType method_name(paramList) throws Exception 1,Exception2,…{
    //…
}
```

**方法重写时声明抛出异常的限制**：子类方法声明抛出的异常类型应该是父类方法声明抛出的异常类型的子类或相同，子类方法声明抛出的异常不允许比父类方法声明抛出的异常多。

<br/>

**throw 拋出异常**：

throw 语句用来直接拋出一个异常，后接一个可拋出的异常类对象，其语法格式如下：

```java
throw ExceptionObject;  // ExceptionObject 必须是 Throwable 类或其子类的对象
```

当 throw 语句执行时，它后面的语句将不执行，此时程序转向调用者程序，寻找与之相匹配的 catch 语句，执行相应的异常处理程序。如果没有找到相匹配的 catch 语句，则再转向上一层的调用程序。这样逐层向上，直到最外层的异常处理程序终止程序并打印出调用栈情况。

```java
public class Demo {
    public static void main(String[] args) {
        exceptionTest();
    }

    private static void exceptionTest() {
        // 抛出运行时异常
        throw new OutOfMemoryError("oom");
    }
}
```

```java
public class Demo {
    public static void main(String[] args) {
        try {
            exceptionTest();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }

    // 抛出编译时异常
    private static void exceptionTest() throws CloneNotSupportedException {
        throw new CloneNotSupportedException("clone failed");
    }
}
```

<br/>

**throws 关键字和 throw 关键字在使用上的几点区别如下**：

- throws 用来声明一个方法可能抛出的所有异常信息，表示出现异常的一种可能性，但并不一定会发生这些异常；
  
  throw 则是指拋出的一个具体的异常类型，执行 throw 则一定抛出了某种异常对象。

- 通常在一个方法（类）的声明处通过 throws 声明方法（类）可能拋出的异常信息，
  
  而在方法（类）内部通过 throw 声明一个具体的异常信息。

- throws 通常不用显示地捕获异常，可由系统自动将所有捕获的异常信息抛给上级方法； 
  
  throw 则需要用户自己捕获相关的异常，而后再对其进行相关包装，最后将包装后的异常信息抛出。

<br/>

### 4. 自定义异常

如果 Java提供的内置异常类型不能满足程序设计的需求，这时我们可以自己设计 Java 类库或框架，其中包括异常类型。

- 实现自定义（编译时）异常类需要继承 Exception 类或其子类（除RuntimeException 类及其子类外）
- 如果自定义（运行时）异常类需继承 RuntimeException 类或其子类

```java
class IntegerRangeException extends Exception {
    public IntegerRangeException() {
        super();
    }
    public IntegerRangeException(String s) {
        super(s);
    }
}
```

自定义异常类一般包含两个构造方法：一个是无参的默认构造方法，另一个构造方法以字符串的形式接收一个定制的异常消息，并将该消息传递给超类的构造方法。

<br/>

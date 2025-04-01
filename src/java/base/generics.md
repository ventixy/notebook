---

order: 70

---

# Java泛型

泛型，即“参数化类型”。顾名思义，就是将类型由原来的具体的类型'参数化'，此时类型也定义成参数形式，然后在使用/调用时传入具体的类型。事先不确定类型, 先写一个东西代指, 在使用的时候具体指定

- Java 泛型（generics）是 **JDK 5** 中引入的一个新特性, 泛型提供了编译时类型安全检测机制，该机制允许开发者在编译时检测到非法的类型。

- 泛型的本质是参数化类型，也就是说所操作的数据类型被指定为一个参数。在使用/调用时传入具体的类型（类型实参）。

- Java采用 **类型擦除(Type erasure generics)** 的方式实现泛型，即这个泛型只存在源码中。
  
  java中的泛型仅仅存在于编译之前, 经过编译之后全部泛型变成Object, 使用泛型变成类型强转

## 1. 注意事项

Java开发手册推荐使用：

```java
// 泛型的写法: 一般常用T E K V (语法上可以使用别的字符都可以, 但是习惯上用这些)
// T : type
// E : element
// K : key
// V : value

class User <T> {}
```

```java
// 我们可以在泛型定义的时候定义多个泛型(语法完全允许), 但是建议不要超过两个 
class User <T, E, X> {
    E name;
    T age;

    public User(E name, T age) {
        this.name = name;
        this.age = age;
    }
}
```

**泛型使用的写法**：

```java
User<Integer> zs1 = new User<Integer>("zs", 18);  // 在引用上 和  new 类型上都指定类型:  jdk1.5时候的写法

User<Integer> zs2 = new User<>("zs", 18);         // 只写引用, 后面省略: jdk1.7时候做的写法优化

 // 如果某个地方需要传泛型, 但是我们使用的时候没有指定具体的泛型类型, 这个泛型在这次使用中默认表现为Object
User zs = new User("zs", 18);
Object age = zs.age;
```

**泛型不允许使用基本类型**：

```java
// 泛型的使用不允许使用基本类型
// 报错: User<int> zs3 = new User<>("zs", 18);
```

**泛型的好处**：

```java
a. 提高了程序的安全性
b. 将运行期遇到的问题转移到了编译期
c. 省去了类型强转的麻烦
```

## 2. 泛型的使用

### 泛型类

```java
// 泛型类：（在实例化泛型类时，需要指明泛型类中的类型参数，并赋予泛型类属性相应类型的值）
public class ClassName<dataType1,dataType2,…>{
    private dataType1 propertyName1;
    private dataType2 propertyName2;
}

// 定义一个泛型类：
public class ClassName<T>{
    private T data;

    public T getData() {
        return data;
    }
    public void setData(T data) {
        this.data = data;
    }
}
// 注意1: 定义一个泛型类, 这个泛型作用域范围, 仅在类名之后和类体上
```

### 泛型接口

```java
// 泛型接口
public interface IntercaceName<T>{
    T getData();
}

// 实现接口时，可以选择指定泛型类型，也可以选择不指定
// 指定类型 如下：
public class Interface1 implements IntercaceName<String> {
    private String text;

    @Override
    public String getData() {
        return text;
    }
}

// 不指定类型：
public class Interface1<T> implements IntercaceName<T> {
    private T data;

    @Override
    public T getData() {
        return data;
    }
}
```

### 泛型方法

```java
// 泛型方法，例如: 
public static <T> List find(Class<T> cs,int userId){

    // 使用了泛型的方法不一定是泛型方法, 定义了泛型的方法才是泛型方法

}
```

- 是否拥有泛型方法，与其所在的类是不是泛型没有关系
- 如果 static 方法需要使用泛型能力，就必须使其成为泛型方法

## 3. 泛型通配

泛型是不允许类似数组一样协变的，但是有的时候, 我们又希望它能像数组一样, 产生类似协变的效果

泛型通配: 这个泛型通配就是为了模拟数组的协变, 又避免了数组协变的坏处(类型问题)

- `？`：任意类型，如果没有明确，那么就是Object以及任意的Java类了
  
  表示不确定的 java 类型，通常用于泛型方法的调用代码和形参，不能用于定义类和泛型方法

- `? extends E`（向下限定，E及其子类）
  
  上界通配符 `< ? extends E>`：限制泛型可用类型, 表示参数化的类型可能是所指定的类型，或者是此类型的子类。
  
  - 如果传入的类型不是 E 或者 E 的子类，编译不成功
  - 泛型中可以使用 E 的方法，否则需要强转成 E 才能使用
  
  ```java
  // 当没有使用 extends 关键字限制泛型类型时，其实是默认使用 Object 类作为泛型类型/
  public class ClassName<T> {}
  // 等同于：
  public class ClassName<T extends Object> {}
  ```

- `? super E` （向上限定，E及其父类）
  
  下界通配符 `< ? super E>`：表示参数化的类型可能是所指定的类型，或者是此类型的父类型，直至 Object

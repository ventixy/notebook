--- 

title: Python面向对象
order: 7
icon: class

---

## 面向对象基础

### 类和对象

在 Python 中，类是一种用于创建对象的蓝图或模板，对象则是根据类创建的具体实例。类定义了对象的属性和方法，可以用于创建多个具有相似特征和行为的对象。下面是对类和对象的详细介绍：

1. 类的定义：
    - 在 Python 中，使用 `class` 关键字来定义一个类，后面跟着类的名称。
    - 类由属性和方法组成。属性是类的数据成员，用于存储对象的状态；方法是类的函数成员，用于定义对象的行为。
    - 类可以包含构造方法 `__init__()`，用于初始化对象的属性。
    - 类的方法可以访问类的属性，并且可以通过 `self` 关键字来引用当前对象。

2. 对象的创建：
    - 使用类来创建对象的过程称为实例化。通过调用类的构造方法 `__init__()` 来创建对象，并传递初始化参数。
    - 每个对象都是类的一个实例，拥有类定义的属性和方法。
    - 可以根据需要创建多个对象，每个对象都是独立的，具有自己的属性值。

3. 类和对象的属性：
    - 类的属性是定义在类中的变量，用于存储对象的状态。
    - 每个对象都可以访问类的属性，并且可以通过对象名和点操作符来引用和修改属性的值。

4. 类和对象的方法：
    - 类的方法是定义在类中的函数，用于定义对象的行为。
    - 每个对象都可以调用类的方法，并且可以通过对象名和点操作符来调用方法。

代码示例：
```python
# 定义一个名为Person的类
class Person:
    # 构造方法，用于初始化对象的属性
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    # 类的方法，打印对象的信息
    def print_info(self):
        print(f"Name: {self.name}, Age: {self.age}")

# 创建Person类的对象
person1 = Person("Alice", 25)
person2 = Person("Bob", 30)

# 访问对象的属性
print(person1.name)  # 输出: Alice
print(person2.age)  # 输出: 30

# 调用对象的方法
person1.print_info()  # 输出: Name: Alice, Age: 25
person2.print_info()  # 输出: Name: Bob, Age: 30
```

注意事项：
- 在定义类时，类名通常使用首字母大写的驼峰命名法，以便与变量名区分开。
- 在类的方法中，第一个参数 `self` 代表当前对象本身，用于引用对象的属性和调用其他方法。
- 类的属性和方法都可以通过对象名来访问，但在类的方法内部，需要使用 `self` 关键字来引用对象。
- 每个对象都是独立的，对一个对象的属性或方法的修改不会影响其他对象。
- 类和对象是面向对象编程的核心概念，通过类和对象的使用，可以实现代码的封装、重用和扩展。


### 属性和方法

在 Python 中，类的属性和方法是类定义中的关键部分。下面详细介绍 Python 中类的属性和方法：

1. 类的属性：
   - 类的属性是定义在类中的变量，用于存储对象的状态和特征。
   - 类的属性可以在类的任何方法内部进行访问，也可以通过对象名来访问。
   - 类的属性可以在类的内部和外部进行定义和修改。

2. 实例属性：
   - 实例属性是属于特定对象的属性，每个对象都有自己的实例属性副本。
   - 实例属性通常在类的构造方法 `__init__()` 中初始化，也可以在其他方法中动态设置。
   - 实例属性的访问和修改都是通过对象名进行。

3. 类的方法：
   - 类的方法是定义在类中的函数，用于定义对象的行为和操作。
   - 类的方法可以访问和修改类的属性，也可以通过 `self` 参数来引用对象本身。
   - 类的方法可以通过对象名进行调用，也可以通过类名进行调用。

4. 类属性 vs 实例属性：
   - 类属性是属于整个类的属性，所有对象共享同一份类属性。
   - 实例属性是属于特定对象的属性，每个对象有自己的实例属性副本。

代码示例：
```python
class Car:
    # 类的属性
    color = "Red"

    def __init__(self, brand, model):
        # 实例属性
        self.brand = brand
        self.model = model

    def drive(self):
        # 类的方法
        print(f"Driving {self.brand} {self.model}")

    def get_color(self):
        # 类的方法
        print(f"The color of the car is {Car.color}")

# 访问类的属性
print(Car.color)  # 输出: Red

# 创建对象
car1 = Car("Toyota", "Corolla")
car2 = Car("Honda", "Accord")

# 访问实例属性
print(car1.brand)  # 输出: Toyota
print(car2.model)  # 输出: Accord

# 调用对象的方法
car1.drive()  # 输出: Driving Toyota Corolla
car2.drive()  # 输出: Driving Honda Accord

# 访问类的方法
car1.get_color()  # 输出: The color of the car is Red
car2.get_color()  # 输出: The color of the car is Red
```

注意事项：
- 类的属性定义在类的内部，而实例属性通常在构造方法 `__init__()` 中初始化。
- 类的方法定义在类的内部，可以访问和修改类的属性。
- 在类的方法中，使用 `self` 参数来引用对象本身，可以通过 `self` 来访问实例属性和调用其他方法。
- 类的属性和方法可以通过对象名进行访问和调用，也可以通过类名进行访问和调用。
- 类属性是所有对象共享的，而实例属性是每个对象独立的。对类属性的修改会影响所有对象，而对实例属性的修改只会影响特定对象。


### 私有属性和方法
在 Python 中，私有属性和方法是一种用于封装类内部实现细节并限制外部访问的机制。通过将属性和方法命名以双下划线（__）开头，可以将其定义为私有成员。下面是关于私有属性和方法的详细介绍：

1. 私有属性：
   - 私有属性是类中的成员变量，其命名以双下划线（__）开头，例如 `self.__name`。
   - 私有属性只能在类内部访问，无法在类外部直接访问。
   - 可以通过提供公共的访问方法（例如 getter 和 setter 方法）来间接访问私有属性。

2. 私有方法：
   - 私有方法是类中的成员方法，其命名以双下划线（__）开头，例如 `def __method(self):`。
   - 私有方法只能在类内部被调用，无法在类外部直接调用。
   - 私有方法通常用于内部实现和辅助功能，不会被外部直接调用。

::: info Python3官方文档中关于私有属性和方法的章节
https://docs.python.org/3/tutorial/classes.html#private-variables
::: 

代码示例：
```python
class MyClass:
    def __init__(self):
        self.__private_var = 42

    def __private_method(self):
        print("This is a private method.")

    def public_method(self):
        print("This is a public method.")
        self.__private_method()
        print(self.__private_var)

obj = MyClass()
obj.public_method()
# obj.__private_method()  # 无法直接调用私有方法
# print(obj.__private_var)  # 无法直接访问私有属性
```

::: warning 注意事项
- 私有属性和方法只是一种约定，并没有严格的访问控制机制。它们只是通过命名约定来表示其意图是私有的。
- 尽管无法直接访问私有属性和方法，但可以通过一些特殊的方式间接访问，例如使用公共的访问方法。
- 在 Python 中，鼓励使用"约定俗成"的方式，尊重私有属性和方法的命名约定，以避免不必要的访问和修改。
- 注意，在子类中可以重写父类的私有方法，但无法直接继承父类的私有属性。
:::

### 静态方法和类方法

在 Python 中，类方法和静态方法是用于在类中定义的特殊方法，它们与实例方法不同，具有一些特定的行为和用途。下面是关于类方法和静态方法的区别、示例代码和注意事项：

1. 类方法：
   - 类方法使用 `@classmethod` 装饰器进行修饰，第一个参数通常命名为 `cls`，表示类本身。
   - 类方法可以通过类名调用，也可以通过实例调用。
   - 类方法可以访问类属性，并且可以在方法内部修改类属性的值。
   - 类方法通常用于创建、操作或修改与类相关的数据。

   示例代码：
   ```python
   class MyClass:
       class_var = 10

       @classmethod
       def class_method(cls):
           print("This is a class method.")
           print(cls.class_var)

   MyClass.class_method()
   ```

   注意事项：
   - 类方法可以通过类名调用，也可以通过实例调用。但是，当通过实例调用时，类方法中的类变量是共享的，即所有实例共享同一个类变量。

2. 静态方法：
   - 静态方法使用 `@staticmethod` 装饰器进行修饰，没有特殊的参数要求。
   - 静态方法可以通过类名调用，也可以通过实例调用。
   - 静态方法无法访问类属性，也无法修改类属性的值。
   - 静态方法通常用于封装与类相关但不依赖于类状态的功能。

   示例代码：
   ```python
   class MyClass:
       @staticmethod
       def static_method():
           print("This is a static method.")

   MyClass.static_method()
   ```

   注意事项：
   - 静态方法在类中被定义，但与类的状态无关，因此它们不能访问或修改类属性。
   - 静态方法可以通过类名调用，也可以通过实例调用。然而，与类方法不同，通过实例调用静态方法并不会共享类变量。

::: info 静态方法和类方法总结
- 类方法用于操作类相关的数据，并可以访问和修改类属性。
- 静态方法用于封装独立于类状态的功能，无法访问或修改类属性。
- 类方法和静态方法都可以通过类名调用，也可以通过实例调用，但注意实例调用时的行为差异。
- 在选择使用类方法还是静态方法时，要根据具体的需求和功能设计来确定。
:::

::: danger 如果通过类名调用了类方法，而类方法又需要访问实例属性，会发生什么？
如果通过类名调用了类方法，而类方法又需要访问实例属性，会导致错误。类方法是属于整个类的，它不会自动获取到特定对象的实例属性。在类方法内部，无法直接通过 self 访问实例属性。

如果在类方法中需要访问实例属性，有两种解决方法：
- 1. 将实例作为参数传递给类方法

     在类方法的定义中，添加一个额外的参数，通常命名为 cls 或其他约定的名称

- 2. 将类方法转换为实例方法

     在类方法的定义上添加 @staticmethod 装饰器，将其转换为静态方法, 静态方法可以访问类的属性，也可以通过参数访问实例属性
```python
class MyClass:
    def __init__(self, value):
        self.value = value

    @classmethod
    def class_method(cls, instance):
        print(f"Value: {instance.value}")
        
    @staticmethod
    def static_method(instance):
        print(f"Value: {instance.value}")

# 创建对象
obj = MyClass(10)

# 通过类名调用类方法并传递对象作为参数
MyClass.class_method(obj)  # 输出: Value: 10

# 通过类名调用静态方法并传递对象作为参数
MyClass.static_method(obj)  # 输出: Value: 10
```
:::


### 常用魔法方法

在 Python 的面向对象编程中，有一些特殊的方法被称为魔法方法（Magic Methods）或特殊方法，它们以双下划线 `__` 开头和结尾。

这些方法在类中定义，用于执行特定的操作，例如对象的创建、销毁、比较、属性访问等。下面详细介绍几个常用的魔法方法：

1. `__init__(self, ...)`:
   - 初始化方法，在创建对象时自动调用。
   - 用于初始化对象的属性。

2. `__str__(self)`:
   - 字符串表示方法，用于返回对象的可读性好的字符串表示。
   - 当使用 `print()` 函数打印对象时自动调用。
   - 应返回一个字符串对象。

3. `__repr__(self)`:
   - 对象表示方法，用于返回对象的官方字符串表示。
   - 当直接输入对象名称并按回车键时自动调用。
   - 应返回一个字符串对象。

4. `__len__(self)`:
   - 长度方法，用于返回对象的长度。
   - 当使用 `len()` 函数获取对象的长度时自动调用。
   - 应返回一个整数。

5. `__getitem__(self, key)`:
   - 索引获取方法，用于通过索引访问对象的元素。
   - 当使用 `[]` 运算符获取对象的元素时自动调用。
   - 应返回一个元素。

6. `__setitem__(self, key, value)`:
   - 索引设置方法，用于通过索引设置对象的元素。
   - 当使用 `[]` 运算符设置对象的元素时自动调用。

7. `__delitem__(self, key)`:
   - 索引删除方法，用于通过索引删除对象的元素。
   - 当使用 `del` 关键字删除对象的元素时自动调用。

8. `__getattr__(self, name)`:
   - 属性获取方法，用于当试图访问不存在的属性时自动调用。
   - 在访问对象的属性时，如果属性不存在，则会调用该方法。

9. `__setattr__(self, name, value)`:
   - 属性设置方法，用于设置对象的属性。
   - 在设置对象的属性时自动调用。

10. `__delattr__(self, name)`:
   - 属性删除方法，用于删除对象的属性。
   - 在删除对象的属性时自动调用。

这些只是一小部分常用的魔法方法，Python 还提供了许多其他魔法方法，用于实现不同的行为和操作。通过定义这些魔法方法，可以使自定义的类更加灵活和易于使用。

Python官方文档：https://docs.python.org/3/reference/datamodel.html#special-method-names

代码示例：
```python
class MyClass:
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return f"MyClass(value={self.value})"

    def __repr__(self):
        return f"MyClass(value={self.value})"

    def __len__(self):
        return len(self.value)

    def __getitem__(self, index):
        return self.value[index]

    def __setitem__(self, index, value):
        self.value[index] = value

    def __delitem__(self, index):
        del self.value[index]

    def __getattr__(self, name):
        return f"Attribute '{name}' does not exist"

    def __setattr__(self, name, value):
        print(f"Setting attribute '{name}' to '{value}'")
        super().__setattr__(name, value)

    def __delattr__(self, name):
        print(f"Deleting attribute '{name}'")
        super().__delattr__(name)

# 创建对象
obj = MyClass([1, 2, 3])

# 调用魔法方法
print(obj)           # 调用 __str__ 方法
print(str(obj))      # 调用 __str__ 方法
print(repr(obj))     # 调用 __repr__ 方法
print(len(obj))      # 调用 __len__ 方法
print(obj[1])        # 调用 __getitem__ 方法
obj[1] = 4           # 调用 __setitem__ 方法
del obj[0]           # 调用 __delitem__ 方法
print(obj.attribute) # 调用 __getattr__ 方法
obj.attribute = 10   # 调用 __setattr__ 方法
del obj.attribute    # 调用 __delattr__ 方法
```

注意事项：
- 魔法方法在定义类时需要按照特定的命名规则进行命名，以确保能被正确调用。
- 每个魔法方法都有特定的功能和用途，应根据需要选择合适的方法进行定义。
- 魔法方法通常在对象的特定操作时自动调用，无需手动调用。
- 在实现魔法方法时，需要注意方法的参数和返回值，确保符合预期的行为。



## 继承和多态

### Inheritance
在 Python 中，继承是面向对象编程的重要概念之一。它允许一个类（称为子类或派生类）继承另一个类（称为父类或基类）的属性和方法。子类可以继承父类的特性，并可以添加新的属性和方法。继承可以帮助我们实现代码重用、组织代码结构和实现多态性。下面是继承的详细介绍：

Python3的官方文档中关于类和继承的章节：https://docs.python.org/3/tutorial/classes.html

1. 继承语法：
   - 子类可以通过在类定义中将父类作为基类来实现继承。
   - 语法：`class ChildClass(ParentClass):`

2. 继承类型：
   - 单继承：子类只继承一个父类。
   - 多继承：子类继承多个父类。

3. 方法重写：
   - 子类可以重写（覆盖）父类中的方法。
   - 子类中的方法可以与父类中的方法同名，当调用该方法时，将调用子类中的方法。

4. super() 函数：
   - super() 函数用于调用父类的方法，以便在子类中扩展或修改父类的行为。
   - 可以通过 `super().method()` 的方式调用父类的方法。

5. 多继承：
   - Python 支持多继承，即一个子类可以同时继承多个父类。
   - 多继承的顺序很重要，影响方法解析顺序（MRO）。
   - 可以使用 `class ChildClass(ParentClass1, ParentClass2):` 的方式实现多继承。

代码示例：
```python
class Animal:
    def __init__(self, name):
        self.name = name

    def eat(self):
        print(f"{self.name} is eating.")


class Dog(Animal):
    def bark(self):
        print(f"{self.name} is barking.")


class Cat(Animal):
    def purr(self):
        print(f"{self.name} is purring.")


dog = Dog("Buddy")
dog.eat()   # 调用父类的方法
dog.bark()  # 调用子类的方法

cat = Cat("Kitty")
cat.eat()   # 调用父类的方法
cat.purr()  # 调用子类的方法
```

::: warning Python继承注意事项
- 继承应该用于表示`is a`的关系，即子类是父类的一种特化。
- 子类继承了父类的属性和方法，但也可以添加新的属性和方法。
- 方法重写可以在子类中重新定义和实现父类的方法。
- 多继承时要注意方法解析顺序（MRO）以及可能引发的命名冲突问题。
- super() 函数可以用于在子类中调用父类的方法。
- 继承是一种强耦合的关系，应谨慎使用并遵循良好的设计原则。
:::


### polymorphism

在面向对象编程中，多态是一种允许不同类型的对象对同一方法做出不同响应的特性。Python 是一门支持多态的动态类型语言。下面是关于多态的详细介绍：

1. 多态的概念：
   - 多态是指同一操作可以作用于不同类型的对象，并且可以根据对象的类型执行不同的操作。
   - 多态实现了代码的通用性和灵活性，使得程序可以更加模块化、可扩展和易于维护。

2. 多态的实现方式：
   - 多态可以通过继承和方法重写来实现。
   - 当一个父类的方法被多个子类重写时，同样的方法调用会根据对象的实际类型调用不同的方法实现。

代码示例：
```python
class Animal:
    def sound(self):
        pass

class Cat(Animal):
    def sound(self):
        print("Meow!")

class Dog(Animal):
    def sound(self):
        print("Woof!")

def make_sound(animal):
    animal.sound()

cat = Cat()
dog = Dog()

make_sound(cat)  # 输出：Meow!
make_sound(dog)  # 输出：Woof!
```

注意事项：
- 多态是面向对象编程的重要概念，但在使用时要注意理解对象的类型和方法的重写。
- 多态可以提高代码的可读性和可维护性，但也可能引起一些意外行为，特别是在继承关系和方法重写方面需要小心处理。
- 在设计类和方法时，要考虑到可能的多态使用场景，以便更好地利用多态特性。


### 抽象类和接口

在 Python 中，虽然没有严格的抽象类和接口的概念，但可以使用一些机制来实现类似的功能。下面是对抽象类和接口的概念进行详述：

1. 抽象类：
   - 抽象类是一种不能被实例化的类，它只能被继承。
   - 抽象类通常用于定义一组相关的类的共同接口和行为，它包含了一些抽象方法和非抽象方法。
   - 抽象方法是在抽象类中声明但没有具体实现的方法，子类必须实现这些抽象方法才能被实例化。
   - 抽象类可以通过 `abc` 模块来定义，使用 `@abc.abstractmethod` 装饰器来标记抽象方法。

2. 接口：
   - 在 Python 中，没有显式的接口概念，因为 Python 鼓励使用鸭子类型（Duck Typing）而不是强制要求类实现特定的接口。
   - 鸭子类型是一种动态类型的风格，即只关注对象具有的方法和属性，而不关注对象的具体类型。
   - 在 Python 中，任何对象只要实现了特定的方法，就可以被视为拥有某个接口，而无需显式地声明或继承。

虽然 Python 中没有严格的抽象类和接口的语法，但可以通过使用抽象基类（Abstract Base Classes）和鸭子类型来实现类似的功能。Python 的 `abc` 模块提供了抽象基类的支持，可以通过继承抽象基类来实现类似于接口的效果。

::: warning 官方文档相应内容地址：
- Python3的官方文档中关于抽象基类的章节：https://docs.python.org/3/library/abc.html
::: 

需要注意的是，尽管 Python 中的抽象类和接口的概念可能不如其他语言那么严格和明确，但通过合理的设计和使用，仍然可以实现多态性和代码的可扩展性。

下面是一个关于 Python 抽象类和接口的使用示例：

```python
from abc import ABC, abstractmethod

# 定义抽象类作为接口
class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

# 定义具体类实现接口
class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14 * self.radius * self.radius

    def perimeter(self):
        return 2 * 3.14 * self.radius

# 创建对象并调用方法
rectangle = Rectangle(5, 4)
circle = Circle(3)

print(rectangle.area())     # 输出: 20
print(rectangle.perimeter())   # 输出: 18
print(circle.area())       # 输出: 28.26
print(circle.perimeter())     # 输出: 18.84
```

在上面的示例中，`Shape` 是一个抽象类作为接口，其中定义了两个抽象方法 `area()` 和 `perimeter()`，这两个方法必须在具体的子类中实现。`Rectangle` 和 `Circle` 分别是 `Shape` 接口的实现类，它们重写了 `area()` 和 `perimeter()` 方法，提供了自己的具体实现。

通过使用抽象类和接口的方式，可以确保子类实现了指定的方法，并且在使用时可以以统一的方式调用这些方法，从而实现了多态性和代码的可扩展性。



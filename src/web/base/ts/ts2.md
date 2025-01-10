---

order: 10
title: TypeScript进阶

---


## 类(Class)和面向对象
TypeScript 中的类是对 ECMAScript 6 (ES6) 类的一个超集，它在 ES6 类的基础上增加了一些额外的类型安全和功能特性。

### 类的定义和继承
TS中类的定义和继承等与ES6最大的区别就是TypeScript 允许在类的属性、方法参数和返回值上添加类型注解，提供静态类型检查
```typescript
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }

  bark() {
    console.log('Woof! Woof!');
  }
}

const dog = new Dog('Rex');
dog.bark();
dog.move(10);
```
TypeScript 不支持从多个类继承（无多重继承），但你可以通过接口来模拟这个功能。一个类可以实现多个接口


### 访问修饰符
TypeScript 提供了三种访问修饰符，用于在类内部控制成员的可访问性。

- `public`（默认）：成员是从类的外部可访问的。
- `private`：成员只能从类的内部访问。
- `protected`：成员能被派生类中访问。

```typescript
class Person {
  public name: string;
  private age: number;
  protected email: string;

  constructor(name: string, age: number, email: string) {
    this.name = name;
    this.age = age;
    this.email = email;
  }
}
```

### 抽象类和抽象方法
抽象类（Abstract Classes）和抽象方法（Abstract Methods）主要用于声明基类，它们提供了一种方式来定义必须由派生类实现的方法。

- 抽象类不能被实例化
- 抽象方法只能存在于抽象类中
- 抽象类可以包含非抽象成员
- 抽象类不能直接实例化，但仍可以拥有构造函数。这个构造函数用于被派生类的构造函数调用

```typescript
abstract class Department {
  constructor(public name: string) {}

  printName(): void {
    console.log('Department name: ' + this.name);
  }

  abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {
  constructor() {
    super('Accounting and Auditing'); // 构造函数中调用 super
  }

  printMeeting(): void {
    console.log('The Accounting Department meets each Monday at 10am.');
  }

  generateReports(): void {
    console.log('Generating accounting reports...');
  }
}
```



### 接口实现
在 TypeScript 中，接口（interface）用于定义对象或类的形状（shape），即它们需要具备的属性和方法。当一个类实现（implements）一个接口时，这个类就必须提供接口中所定义的所有属性和方法的实现。

```typescript
// 定义接口
interface InterfaceName {
  property1: type1;
  method1(param1: type2, param2: type3): returnType;
  // ...更多属性和方法
}

// 实现接口的类
class ClassName implements InterfaceName {
  property1: type1;

  constructor(param1: type2) {
    this.property1 = param1;
  }

  method1(param1: type2, param2: type3): returnType {
    // 方法实现
  }
  // ...实现接口中的其他方法
}
```

**注意事项**：

1. **必选与可选成员**：
   - 接口中可以定义必选成员和可选成员。必选成员在类中必须被实现，而可选成员则不一定。可选成员后面需加上 `?` 符号。
   ```typescript
   interface OptionalInterface {
     requiredMethod(): void;
     optionalMethod?: () => void; // 可选方法
   }
   ```
   
2. **公共访问修饰符**：
   - 当实现接口时，类中的相应成员需要是公共的（使用 `public` 关键字或隐式公共，即不指定访问修饰符），因为接口只关注公有部分。
   
3. **接口继承**：
   - 接口之间可以继承，实现类需要满足所有基接口的要求。
   ```typescript
   interface BaseInterface {
     baseMethod(): void;
   }
   
   interface DerivedInterface extends BaseInterface {
     derivedMethod(): void;
   }
   
   class MyClass implements DerivedInterface {
     baseMethod() { /*...*/ }
     derivedMethod() { /*...*/ }
   }
   ```
   
4. **多重实现**：
   - 一个类可以实现多个接口，只需在 `implements` 后面列出所有接口名，用逗号分隔。
   ```typescript
   interface InterfaceA { /*...*/ }
   interface InterfaceB { /*...*/ }
   
   class MyClass implements InterfaceA, InterfaceB {
     // 实现所有接口中定义的方法和属性
   }
   ```


## 高级类型(types)

除了 [基本类型](./ts.md#二-基本数据类型) 外，在 TypeScript 中还存在许多高级类型，它们提供了更丰富的类型操作，使得代码更加灵活和强大。


### 联合和交叉类型
**联合类型(Union Types)和交叉类型(Intersection Types)**：联合类型表示一个值可以是几种类型之一。交叉类型是将多个类型合并为一个类型。

- 当函数接受不同类型的参数时使用联合类型。
- 当你想要合并两个对象或者类型集合时使用交叉类型。

```typescript
type ID = string | number;

// Union Type 使用场景
function printId(id: ID) {
  console.log("Your ID is: " + id);
}

// Intersection Type 使用场景
type User = {
  name: string;
  age: number;
};

type Worker = {
  companyId: string;
};

type Employee = User & Worker;

function hireEmployee(employee: Employee) {
  console.log(`Hiring ${employee.name}, age ${employee.age}, for company ${employee.companyId}`);
}
```

### 类型别名和接口
**类型别名(Type Aliases)和接口(Interfaces)** ：类型别名可以定义一个类型的新名字。接口是定义对象类型的一种方式。

- 使用类型别名可以给一个类型起一个新的名字，通常用于联合类型或元组。
- 使用接口来定义对象的形状。注意：[类型别名和接口的区别](./ts.md#type_aliases_vs_interface_id)

```typescript
type Point = {
  x: number;
  y: number;
};

// 使用类型别名定义元组
type ResponseData = [string, number];

// Interface 使用场景
interface IAnimal {
  name: string;
  makeSound(): void;
}

class Dog implements IAnimal {
  constructor(public name: string) {}

  makeSound() {
    console.log("Woof! Woof!");
  }
}
```


### 映射类型
映射类型(Mapped Types)：通过现有的类型创建新类型，这种类型的属性是基于旧类型的属性变换得来的。

- 创建基于另一个类型的属性的新类型，而且这个新类型的属性会根据一定的逻辑进行转换。

```typescript
type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

type User = {
  id: number;
  name: string;
};

// ReadOnly User - 所有属性变为 readonly
type UserReadOnly = ReadOnly<User>;

// Optional User - 所有属性变为可选
type UserOptional = Optional<User>;
```

### 条件类型
条件类型(Conditional Types)：条件类型会根据条件表达式在两种类型之间选择。

- 当你的类型依赖于条件时，如一个类型依赖于另一个类型是否可以赋值给它。

```typescript
type Check<T> = T extends string ? "string type" : "non-string type";

type T1 = Check<string>; // T1 是 'string type'
type T2 = Check<number>; // T2 是 'non-string type'
```

### 索引类型和索引签名
索引类型(Index Types)可以查询另一个类型的属性的类型。索引签名(Index Signatures)用来声明那些未被明确声明的属性的类型。

- 当你要确保一个函数的参数性质和返回值性质相匹配时使用索引类型。
- 当你不知道对象具体有哪些属性，但是知道属性的值的类型时使用索引签名。

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]; // 这里利用索引类型查询
}

let x = { a: 1, b: 2, c: 3 };

getProperty(x, "a"); // 正确
// getProperty(x, "m"); // 错误：Argument of type '"m"' isn't assignable to '"a" | "b" | "c"'

interface Dictionary {
  [index: string]: string | number; // 索引签名
}

let dict: Dictionary = {};
dict['a'] = "string value";
dict['b'] = 42;
```

### 枚举成员和字面量类型
枚举成员类型(Enum Member Types)和字面量类型(Literal Types)：TypeScript 中的枚举成员成为单独的类型。字面量类型就是具体的值本身成为类型。

- 当你希望限制变量的值必须是某几个值中的一个时，可以使用枚举成员类型或字面量类型。

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

function move(direction: Direction) {
  // ...
}

move(Direction.Up); // 正确
// move("Upward"); // 错误

type CardinalDirection = "North" | "East" | "South" | "West";

function navigate(direction: CardinalDirection) {
  // ...
}

navigate("North"); // 正确
// navigate("Northeast"); // 错误
```

这些高级类型增加了 TypeScript 的灵活性和强大功能，使得类型系统既具有高度的表现力又具有细粒度的控制。


### 类型断言
类型断言（Type Assertion）是 TypeScript 提供给开发者的机制，用于告诉编译器你比它更了解某个值的类型。当你确定一个值的类型不是 TypeScript 推断的那样，或者你需要一个更具体的类型以访问某些属性或方法时，就可以使用类型断言来覆盖编译器的类型推断。类型断言不修改任何值，只是改变 TypeScript 如何检查该值的类型。

TypeScript 提供两种语法来书写类型断言：

1. 使用 `<Type>` 语法，放在值的前面：
   ```typescript
   let someValue = getSomeValue(); 
   (<string>someValue).toUpperCase(); // 告诉编译器someValue是string类型
   ```

2. 使用 `as Type` 语法，放在值的后面，这种方式更易读且推荐：
   ```typescript
   let someValue = getSomeValue(); 
   someValue as string).toUpperCase(); // 同样告知编译器someValue应被视为string类型
   ```

#### 应用场景1：DOM元素类型断言

当从 DOM 中获取元素时，TypeScript 只能推断出它是 `HTMLElement` 类型，如果你确定它是某个具体的元素类型，如 `HTMLInputElement`，可以使用类型断言来访问该元素特有的属性或方法。

```typescript
let inputElement = document.getElementById('myInput') as HTMLInputElement;
inputElement.value = 'Hello, TypeScript!'; // 现在可以访问.value属性
```

#### 应用场景2：联合类型精炼

当处理联合类型时，有时需要断言以告知编译器某个变量是联合类型中的具体某一种类型。

```typescript
function handleValue(value: string | number) {
    if (typeof value === 'string') {
        (value as string).toUpperCase(); // 确保value作为string处理
    } else {
        (value as number).toFixed(2); // 确保value作为number处理
    }
}
```

#### 应用场景3：第三方库或JSON解析

在使用第三方库或解析 JSON 数据时，TypeScript 可能无法准确推断出返回的数据类型，此时可以使用类型断言。

```typescript
let data = JSON.parse(jsonString) as MyDataType;
console.log(data.myProperty); // 访问MyDataType中的属性
```

**注意事项**:
- **谨慎使用**：类型断言绕过了编译器的类型检查，如果使用不当，可能导致运行时错误。
- **替代方案**：优先考虑类型注解和正确的类型设计，只有在没有更好选项时才使用类型断言。
- **代码清晰性**：使用 `as` 语法通常更易于阅读，尤其是在较长的表达式中。

类型断言是一种强大的工具，但应当审慎使用，确保在提升代码灵活性的同时，不牺牲类型系统的保护。



### 类型保护
**类型保护与区分类型 (Type Guards and Differentiating Types)**
在TypeScript中，类型保护（Type Guards）是一些表达式，它们在运行时检查以确保变量属于某个特定类型。类型保护可以帮助我们确保代码在编译时和运行时都是类型安全的。

**使用 `typeof` 进行类型保护：**

`typeof` 可以用来保证一个变量是 `string`, `number`, `boolean`, 或者 `symbol` 中的一种。

```typescript
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

console.log(padLeft("Hello world", 4)); //    Hello world
console.log(padLeft("Hello world", "_")); // _Hello world
```

**使用 `instanceof` 进行类型保护：**

`instanceof` 可以用来确认一个变量是一个特定的类或者对象的实例。

```typescript
class Bird {
  fly() {
    console.log("bird fly");
  }
  layEggs() {
    console.log("bird lay eggs");
  }
}

class Fish {
  swim() {
    console.log("fish swim");
  }
  layEggs() {
    console.log("fish lay eggs");
  }
}

function getSmallPet(): Bird | Fish {
  // ...
  return new Bird(); // 假设总是返回`Bird`实例
}

let pet = getSmallPet();
if (pet instanceof Bird) {
  pet.fly();
}
if (pet instanceof Fish) {
  pet.swim();
}
```

**使用字面量类型保护：**

可以使用联合类型和字面量类型来创建类型保护。

```typescript
type Shape = Circle | Square;
interface Circle {
  kind: "circle";
  radius: number;
}
interface Square {
  kind: "square";
  sideLength: number;
}

function handleShape(shape: Shape) {
  if (shape.kind === "circle") {
    // 这里我们知道`shape`的类型是`Circle`
    console.log("Circle with radius:", shape.radius);
  } else {
    // 这里TypeScript知道`shape`的类型必须是`Square`
    console.log("Square with side length:", shape.sideLength);
  }
}
```

**使用用户自定义类型保护函数：**

用户自定义的类型保护函数能够检查并确保变量是特定类型，并且这个信息会被TypeScript在编译时期所使用。

```typescript
interface Bird {
  type: "bird";
  fly(): void;
}

interface Fish {
  type: "fish";
  swim(): void;
}

function isBird(pet: Bird | Fish): pet is Bird {
  return (pet as Bird).fly !== undefined;
}

function move(pet: Bird | Fish) {
  if (isBird(pet)) {
    // pet在这个块内被确定为Bird类型
    return pet.fly();
  }
  // pet在这个块内被确定为Fish类型
  return pet.swim();
}
```



### 类型相关名词解释

**1. 元组类型 (Tuple Types)**  
元组类型表示一个已知元素数量和类型的数组，各元素的类型不必相同。

```typescript
let exampleTuple: [string, number];
exampleTuple = ['hello', 42]; // OK
exampleTuple = [10, 'hello']; // Error, wrong type order
exampleTuple = ['hello', 42, 'extra', 42]; // Error, too many items
exampleTuple = ['hello']; // Error, too few items
```

**2. 可选类型 (Optional Types)**  
可选类型是在接口或类型别名中定义的，用于表示某个属性可能不存在。

```typescript
interface MyType {
  required: string;
  optional?: string;
}

const example: MyType = { required: 'value' }; // OK
```

**3. 只读类型 (Readonly Types)**  
只读属性用于限制属性只能在对象被创建时赋值。

```typescript
interface MyType {
  readonly value: number;
}

const example: MyType = { value: 42 };
example.value = 43; // Error, can't modify read-only property
```

**4. 记录类型 (Record Types)**  
记录类型是将键类型和值类型相关联的方式，使用 `Record<K, T>`可以创建一个类型，它的键是 `K` 类型，值是 `T` 类型。

```typescript
const exampleRecord: Record<string, number> = {
  a: 1,
  b: 2,
  c: 3
}; // OK
```

**5. 辨别联合类型 (Discriminated Unions)**   
辨别联合类型是一种将多个类型组合成一个超集类型的方法，可以让 TypeScript 根据公共字段中的字面量值，自动推断出准确的类型。

```typescript
interface Dog {
  type: 'dog';
  bark: boolean;
}

interface Cat {
  type: 'cat';
  purr: boolean;
}

type Pet = Dog | Cat;

const examplePet: Pet = { type: 'dog', bark: true }; // OK
```


**6. 部分类型 (Partial Types)**  

`Partial<Type>` 是一个工具类型，它将给定类型的所有属性标记为可选（`?`）。这在你想要允许一个对象可能缺少某些属性时非常有用，比如在进行对象的初始化或更新操作时。

**使用场景**:
- 在构造函数或对象配置中，允许用户仅提供他们想要设置的属性值，而忽略其他属性。
- 在进行对象的深拷贝或合并时，确保新增或修改的属性不会影响原对象中未指定的其他属性。

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

function updateUser(user: User, updates: Partial<User>) {
    return {...user, ...updates};
}

const user: User = { id: 1, name: "Alice", email: "alice@example.com" };
const updatedUser = updateUser(user, { name: "Alicia" }); // 只更新了name属性
```

**7. 必需类型 (Required Types)**  

`Required<Type>` 是另一个工具类型，它将给定类型的所有属性标记为必需（删除所有可选标志符）。这对于强制要求对象必须包含某些属性时非常有用，尤其是在类型细化或接口继承时。

**使用场景**:
- 确保一个继承的接口或实现的类型不能有可选的属性。
- 在函数参数或类构造函数中，明确要求必须提供所有指定的属性。

```typescript
interface PartialUser {
    id?: number;
    name?: string;
    email?: string;
}

interface CompleteUser extends Required<PartialUser> {
    // 这里不需要再次定义属性，因为Required已将所有属性设为必需
}

function createUser(user: CompleteUser) {
    console.log(user.id, user.name, user.email);
}

createUser({ id: 2, name: "Bob", email: "bob@example.com" }); // 所有属性都是必需的
```


**8. 过剩属性检查 (Excess Property Checks)**  
当将一个对象直接赋值给一个接口类型变量时，TypeScript 会检查这个对象是否存在接口中没有定义的额外属性。

```typescript
interface MyType {
  a: number;
}

const example: MyType = { a: 1, b: 2 }; // Error, b is not in MyType
```





## 泛型(Generics)

泛型（Generics）是 TypeScript 提供的一种编程机制，允许你在定义函数、接口或类时将类型作为参数，使得这些定义能够适用于多种数据类型。泛型的核心目的是提高代码的重用性和灵活性，同时保持类型安全。

### 泛型函数/接口/类

泛型函数允许你创建一个通用的函数，它可以在调用时接受不同类型的参数，同时保持类型安全。

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let outputStr = identity<string>("hello"); // outputStr 类型为 string
let outputNum = identity<number>(123); // outputNum 类型为 number
```

泛型接口允许你定义一个接口，其中包含一个或多个类型参数，这样实现该接口的类或对象可以指定这些类型参数。

```typescript
interface Pair<T> {
    first: T;
    second: T;
}

const pairStr: Pair<string> = { first: "hello", second: "world" };
const pairNum: Pair<number> = { first: 1, second: 2 };
```

泛型类与泛型接口类似，允许类定义中包含类型参数，这样实例化的类可以指定具体类型。

```typescript
class GenericList<T> {
    private items: T[] = [];

    add(item: T) {
        this.items.push(item);
    }

    get(index: number): T | undefined {
        return this.items[index];
    }
}

const stringList = new GenericList<string>();
stringList.add("apple");
stringList.add("banana");

const numberList = new GenericList<number>();
numberList.add(1);
numberList.add(2);
```

### 泛型约束

泛型约束允许你对类型参数施加限制，即要求传入的类型必须满足某些条件，通常是实现了特定接口或具有特定属性。

```typescript
interface Lengthwise {
    length: number;
}

// 任何传给 logLength 函数的参数类型 T，都必须有一个名为 length 的属性，且该类型为 number
function logLength<T extends Lengthwise>(arg: T): void {
    console.log(arg.length);
}

logLength("hello"); // 字符串有length属性
logLength([1, 2, 3]); // 数组也有length属性
// logLength(123); // 错误，数字没有length属性
```

### 泛型的应用
以使用泛型创建可重用的组件为例：假设我们要创建一个简单的数据访问层，它可以为不同类型的数据提供CRUD操作，而不需要重复编写相似的逻辑。

```typescript
// 在接口定义和类定义中增加泛型约束，确保T具有id属性
interface DataAccess<T extends { id: number }> {
    getById(id: number): T | undefined;
    save(item: T): void;
}

class InMemoryDataAccess<T extends { id: number }> implements DataAccess<T> {
	private static _idCounter: number = 0; // 类级别计数器模拟唯一id生成
    private data: T[] = [];

    getById(id: number): T | undefined {
        return this.data.find(item => item.id === id);
    }

    save(item: T): void {
		if (!item.id) { // 如果没有id或id为0时，分配一个新的
			item.id = ++InMemoryDataAccess._idCounter;
		}

		const existingItemIndex = this.data.findIndex(dataItem => dataItem.id === item.id);
		if (existingItemIndex !== -1) {
			this.data[existingItemIndex] = item; // 更新现有项
		} else {
			this.data.push(item); // 或者添加新项
		}
    }
}

class User {
    id: number;
    name: string;

    constructor(name: string) {
        this.id = 0;       // 实际应用中应考虑更好的ID生成机制
        this.name = name;
    }
}

const userDao = new InMemoryDataAccess<User>();
const alice = new User("Alice");
const tom = new User("Tom");
userDao.save(alice);
userDao.save(tom);

const foundUser = userDao.getById(1);
console.log(foundUser?.name); // 输出: Alice
console.log(userDao)  
// InMemoryDataAccess {data: [ User { id: 1, name: 'Alice' }, User { id: 2, name: 'Tom' } ]}
```

在这个例子中，`InMemoryDataAccess` 类是一个泛型类，它实现了 `DataAccess` 接口，这意味着我们可以为任何需要持久化的实体类型（如 `User`）创建一个数据访问层，而不需要为每种实体类型重复编写相同的逻辑。






## 装饰器(Decorators)

装饰器是TypeScript中一个强大的特性，它允许在类声明、方法、访问器、属性或参数上附加元数据或修改其行为。装饰器本质上是一个函数，它在运行时被调用，并且可以修改类的行为或返回一个修改过的类。

装饰器的使用需在TypeScript配置中启用实验性特性，请确保在`tsconfig.json`文件中启用了装饰器特性：

```json
{
  "compilerOptions": {
    "target": "ES5", 
    "experimentalDecorators": true
  }
}
```

**使用场景和注意事项**：
1. 装饰器是实验性的，可能在未来版本中改变。
2. 装饰器可用于日志记录、权限验证、性能测试、类型检查等方面。
3. 牢记装饰器执行顺序：属性装饰器 → 方法参数装饰器 → 方法装饰器 → 类装饰器。
4. 在类属性上，装饰器可以添加元数据，但无法直接访问属性的值。


### 类装饰器

类装饰器在类声明之前被声明(紧靠着类声明)，类装饰器应用于类构造函数，可以用来监视，修改或替换类定义。

**使用场景**：
- 日志记录、性能测量、权限控制等横切关注点。
- 修改类的原型，添加新的方法或属性。
- 注册类到全局注册表或依赖注入容器。

```typescript
function logClass(constructor: Function) {
    console.log(`Creating instance of ${constructor.name}`);
}

@logClass
class MyClass {}

const myInstance = new MyClass(); // 控制台输出: Creating instance of MyClass
```

### 方法装饰器

方法装饰器在方法声明之前定义，可以用来修改方法的行为或添加额外的操作。

方法装饰器会在运行时传入下列3个参数：
1. 方法所在的类的原型对象
2. 方法的名称
3. 方法的属性描述符

```typescript
function readonly(target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.writable = false;
    return descriptor;
}

class Greeter {
    @readonly
    greet() {
        return "Hello, world!";
    }
}

const greeter = new Greeter();
greeter.greet = () => "Changed greeting"; // 这里会报错，因为greet方法变为只读
```
**使用场景**：
- 记录方法调用、性能监控。
- 修改方法返回值或拦截方法调用。
- 实现权限控制或验证。


### 属性装饰器

属性装饰器在属性声明之前定义，可以用来修改属性的定义或在属性上添加元数据。属性装饰器的调用时没有属性描述符这个参数(和方法装饰器不同)。

**使用场景**：
- 校验属性值、自动转换属性类型。
- 自动添加默认值或初始化逻辑。

```typescript
function formatLength(target: any, key: string) {
    let value: string;
    Object.defineProperty(target, key, {
        get: function() {
            return value;
        },
        set: function(newValue: string) {
            value = newValue.padEnd(10, ' ');
        }
    });
}

class Person {
    @formatLength
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

const person = new Person('Alice');
console.log(person.name); // 输出: Alice     （末尾补足空格至10字符）
```

### 参数装饰器

参数装饰器在方法参数之前定义，可以用来修改或检查参数值。参数装饰器会在运行时当作函数被调用，传入下列3个参数：
1. 函数所在类的原型
2. 方法名称
3. 参数在函数参数列表中的索引

```typescript
// 参数装饰器
function validate(target: any, key: string, index: number) {
    let methodDescriptor = Object.getOwnPropertyDescriptor(target, key);
    if (!methodDescriptor || !methodDescriptor.set) {
        methodDescriptor = {
            configurable: true,
            enumerable: false,
            writable: true,
            value: target[key]
        };
        Object.defineProperty(target, key, methodDescriptor);
    }
    
    const originalMethod = methodDescriptor.value;
    methodDescriptor.value = function(...args: any[]) {
        if (args[index] < 0) {
            throw new Error('Argument must be positive!');
        }
        return originalMethod.apply(this, args);
    };
    Object.defineProperty(target, key, methodDescriptor);
}

class Calculator {
    add(
        @validate positiveNumber: number, // 应用于第一个参数
        @validate anotherPositiveNumber: number // 应用于第二个参数
    ) {
        return positiveNumber + anotherPositiveNumber;
    }
}

const calc = new Calculator();
console.log(calc.add(2, 3)); // 正常工作
try {
    console.log(calc.add(-1, 2)); // 将抛出错误，因为-1不是一个正数
} catch (error) {
    console.error(error.message); // "Argument must be positive!"
}
```
**使用场景**：
- 参数验证、日志记录。
- 改变参数的传递方式。





## 模块和命名空间
在TypeScript中，模块和命名空间是两种不同的机制，用于组织代码、避免命名冲突和促进代码的复用。

### 模块导入和导出
**模块** 主要用于组织和封装代码，允许你将相关的功能组织在一起，并控制哪些部分对外部可见。模块可以是单文件的（例如，使用ES6模块语法），也可以跨文件组织（例如，使用外部模块）。

- **导出 (`export`)**: 使用 `export` 关键字来标识模块中希望公开的成员，让其他模块可以访问它们。
  ```typescript
  // math.ts
  export function add(a: number, b: number): number {
      return a + b;
  }
  ```

- **导入 (`import`)**: 使用 `import` 关键字来导入其他模块的导出成员。
  ```typescript
  // app.ts
  import { add } from './math';
  console.log(add(1, 2)); // 输出: 3
  ```

**注意事项**：
- ES6模块使用 `import` 和 `export`，默认使用静态加载。
- Node.js环境中，模块默认使用CommonJS格式，但TypeScript可以通过配置支持ES模块。
- 相对路径导入使用 `'./'` 或 `'../'` 开头。



### 命名空间

在TypeScript中，命名空间被设计用来组织代码和避免命名冲突。它提供了一种将相关接口、类、函数和变量等组织到一个容器中的方式，这使得管理和使用大型代码库变得更加容易。

命名空间在TypeScript中通过`namespace`关键字定义。在命名空间内定义的成员默认是私有的，如果你想在命名空间外部访问它们，需要使用`export`关键字将它们标记为公共成员。


下面是一个简单的示例，展示如何定义一个命名空间并在它内部定义一个类：

```typescript
namespace MyNamespace {
  export class MyClass {
    public display(): void {
      console.log("Hello from MyClass inside MyNamespace");
    }
  }
}

// 使用命名空间中的类
let myClass = new MyNamespace.MyClass();
myClass.display();
```
在这个示例中，`MyNamespace`是我们自定义的命名空间，`MyClass`是定义在该命名空间内的一个类。我们通过`export`关键字将`MyClass`导出，这样就可以在命名空间外部通过`MyNamespace.MyClass`的方式访问到它。


#### 命名空间的嵌套

命名空间还支持嵌套，即可以在一个命名空间内部定义另一个命名空间：

```typescript
namespace OuterNamespace {
  export namespace InnerNamespace {
    export class MyClass {
      public display(): void {
        console.log("Hello from MyClass inside InnerNamespace");
      }
    }
  }
}

let myClass = new OuterNamespace.InnerNamespace.MyClass();
myClass.display();
```
在这个示例中，`OuterNamespace`是外部命名空间，而`InnerNamespace`是定义在`OuterNamespace`内部的嵌套命名空间。嵌套命名空间中的成员也需要通过`export`关键字导出，以供外部访问。



命名空间是TypeScript提供的一个强大功能，用于增强代码的封装和组织。通过恰当地使用命名空间，可以在保持全局作用域的清洁的同时，有效地组织大型代码库。

**注意事项**：
- 命名空间可以嵌套，提供深层次的组织结构。
- 通常，推荐使用模块而不是命名空间，因为现代JavaScript生态更倾向于模块化。
- 如果需要使用命名空间，考虑使用 `import * as` 语法来导入整个命名空间，而不是逐个导入成员。


#### 命名空间的分割
对于非常大的代码库，可能希望将一个命名空间分割到多个文件中。这可以通过在每个文件中定义相同的命名空间来实现。TypeScript编译器会将这些文件中的命名空间视为一个统一的命名空间。

首先在`MyNamespace.ts`文件中定义命名空间：

```typescript
// MyNamespace.ts
namespace MyNamespace {
  export class MyClass {
    public display(): void {
      console.log("Hello from MyClass in MyNamespace.ts");
    }
  }
}
```
然后在`MyNamespace.Extensions.ts`文件中扩展同一个命名空间：

```typescript
// MyNamespace.Extensions.ts
/// <reference path="MyNamespace.ts" />

namespace MyNamespace {
  export class MyExtendedClass {
    public display(): void {
      console.log("Hello from MyExtendedClass in MyNamespace.Extensions.ts");
    }
  }
}
```
使用三斜线指令`/// <reference path="MyNamespace.ts" />`来告诉编译器`MyNamespace.Extensions.ts`依赖于`MyNamespace.ts`。

这样做的好处是可以保持代码的可管理性和组织性，同时支持将实现细节拆分成多个文件。


### 使用外部模块

**外部模块** 通常指的是通过npm安装的第三方库，或者项目外的代码文件。这些模块通常以`.d.ts`文件的形式提供类型定义。

**导入外部模块示例**：

```typescript
// 引入lodash库
import _ from 'lodash';

const numbers = [1, 2, 3, 4, 5];
console.log(_.sum(numbers)); // 输出: 15
```

**注意事项**：
- 对于没有内置类型定义的模块，可能需要安装对应的`@types`包。
- 保持模块的导入语句清晰，尽量减少“*”的使用，以便提高代码的可读性和维护性。
- 使用`"moduleResolution"`编译器选项来控制TypeScript如何解决模块路径。

总的来说，TypeScript中的模块和命名空间都是为了更好地组织和管理代码，但随着ECMAScript模块标准的普及，推荐优先使用模块化的方式来组织代码，以适应现代JavaScript开发的最佳实践。

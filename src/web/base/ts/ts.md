---

order: 1
title: TypeScript基础

---


## 一 TypeScript简介

### TypeScript
TypeScript 与 JavaScript 的关系：

1. **超集关系**：TypeScript 是 JavaScript 的一个超集，这意味着任何有效的 JavaScript 代码也是有效的 TypeScript 代码。你可以将 TypeScript 理解为在 JavaScript 的基础上增加了静态类型系统和其他一些高级语言特性。

2. **编译过程**：TypeScript 代码在运行前需要通过编译器转换为 JavaScript 代码。这个过程称为转译（transpilation），它允许 TypeScript 代码在任何支持 JavaScript 的环境中运行，无论是浏览器、Node.js 还是其他环境。

3. **新增特性**：除了类型系统，TypeScript 还引入了诸如类（classes）、接口（interfaces）、命名空间（namespaces，现在推荐使用模块（modules））、泛型（generics）等特性，这些特性提高了代码的结构化、可读性和可维护性。

TypeScript 的优势主要包括：

1. **类型安全**：TypeScript最大的优势之一是其静态类型系统。在编写代码的时候，你可以声明变量和函数参数的类型，TypeScript编译器会在编译期间进行类型检查。静态类型检查能够在开发阶段捕获许多潜在错误，减少运行时错误，使得代码更加健壮。

2. **提升开发效率**：编辑器和IDE能够基于类型信息提供智能代码补全、接口提示和错误检查，加快了编码速度并减少了查阅文档的需要。

3. **易于维护和协作**：类型注释作为代码的一部分，为大型项目和团队协作提供了更好的文档说明，使得维护和理解代码变得更加容易。

4. **现代化的语法特性**：TypeScript 支持最新的 JavaScript 特性，即使这些特性尚未在所有目标运行环境中普及，开发者仍可提前使用并享受到这些新特性带来的便利。

5. **良好的生态系统支持**：许多现代框架和库（如Angular、Vue 3、React等）都对 TypeScript 提供了官方支持，使得在这些技术栈中使用 TypeScript 变得十分自然和便捷。

6. **长期成本节省**：尽管 TypeScript 学习和初期设置可能会带来一定成本，但从长远来看，由于它能够减少错误、提升代码质量，对于大型项目和长期维护的软件产品来说，这种前期投资往往能够带来显著的时间和成本节约。

7. **兼容性**：因为TypeScript是JavaScript的超集，所以你可以逐步地将现有的JavaScript项目迁移到TypeScript。你甚至可以在同一个项目中同时使用TypeScript和JavaScript。


### 安装和配置

#### **安装 TypeScript**

在 Node.js 环境中安装 TypeScript 非常简单，可以通过 npm（Node.js 的包管理器）来完成。以下是安装步骤：

1. **确保已安装 Node.js**：首先，确保你的计算机上已经安装了 Node.js。可以在命令行输入 `node -v` 来查看当前安装的 Node.js 版本。

2. **安装 TypeScript**：打开命令行工具，然后运行以下命令来全局安装 TypeScript：

   ```
   npm install -g typescript
   ```

   或者，如果你想在特定项目中局部安装 TypeScript，可以导航到项目目录并运行：

   ```
   npm install --save-dev typescript
   ```

#### **配置 tsconfig.json**

`tsconfig.json` 是 TypeScript 项目的配置文件，用于指定编译选项和项目设置。创建和配置 `tsconfig.json` 的步骤如下：

1. **生成 tsconfig.json 文件**：在项目根目录下，你可以通过运行 TypeScript 编译器的初始化命令自动生成一个基本的 `tsconfig.json` 文件：

   ```
   tsc --init
   ```

   这个命令会在当前目录下创建一个 `tsconfig.json` 文件。

2. **编辑 tsconfig.json**：生成的 `tsconfig.json` 文件包含了许多配置选项，默认情况下，它已经为简单的项目设置了一些基本配置。你可以根据项目需求修改这些配置。以下是一些常见的配置项及其说明：

   ```json
   {
     "compilerOptions": {
       /* 基本设置 */
       "target": "es6", // 设置编译后的JavaScript版本，例如es5, es6等，默认值是 ES3
       "module": "commonjs", // 定义使用的模块系统，如 commonjs 或 es2015，module的默认值依赖于target的设置
       "esModuleInterop": true,  // 启用ES模块语法与CommonJS模块之间的互操作性。
       "outDir": "./dist", // 指定编译后的文件输出到哪个目录
       
       /* 严格类型检查 */
       "strict": true, // 启用所有严格类型检查选项
       "noImplicitAny": true, // True表示在表达式和声明上有隐含的any类型时报错，默认值是false

       /* 其他常用选项 */
       "sourceMap": true, // 生成源代码映射文件，方便调试
       "resolveJsonModule": true, // 允许导入JSON文件
       "allowJs": true, // 允许编译器编译.js文件
       "checkJs": false, // 是否对.js文件进行类型检查，默认为false
     },
     "include": [
       "src/**/*" // 指定要编译的文件或目录
     ],
     "exclude": [
       "node_modules" // 排除不需要编译的目录
     ]
   }
   ```

- `compilerOptions` 中包含了编译器的各种配置选项。
- `include` 和 `exclude` 属性定义了编译器处理文件的范围。

通过调整这些配置，你可以根据项目的需求定制 TypeScript 的编译行为。记得在修改配置后重新编译项目以使更改生效。


### 编译命令的使用
**编译TypeScript到JavaScript**：

1. **使用`tsc`编译TypeScript代码：**
   TypeScript编译器会利用`tsconfig.json`中的设置来编译代码。在命令行执行下面的命令：
   ```bash
   tsc    # npx tsc
   ```
   或者，如果你需要编译特定的文件，可以指定文件名：
   ```bash
   tsc path/to/your/file.ts
   ```
   执行以上命令后，TypeScript 编译器将会根据 `tsconfig.json` 中定义的规则将 `.ts` 文件编译成 `.js` 文件。

::: info npx tsc和tsc命令的区别
`npx tsc`和`tsc`命令在功能上相同，它们都用于执行TypeScript编译器。主要的区别在于它们如何查找和执行TypeScript编译器：

1. **`tsc`命令：**
   - 当你直接运行`tsc`命令时，它会首先查找是否有全局安装的TypeScript编译器（即你使用`npm install -g typescript`命令全局安装的TypeScript）。
   - 如果没有找到全局安装的编译器，它将尝试在当前项目的`node_modules`目录下找到局部安装的TypeScript编译器（即通过`npm install --save-dev typescript`命令安装在项目中的TypeScript）。
   - 如果在两者中都没找到，命令将报错。

2. **`npx tsc`命令：**
   - 使用`npx tsc`运行时，`npx`会首先在当前项目的`node_modules`目录中查找TypeScript编译器。
   - 如果在当前项目中没有找到TypeScript编译器，`npx`会临时下载最新版本的TypeScript编译器到一个临时目录，并执行它。这意味着即使你没有全局或者局部安装TypeScript编译器，你也可以使用`npx tsc`来编译TypeScript代码。
   - `npx`确保使用的是项目中具体依赖的版本，从而避免了可能因全局安装的版本和项目依赖的版本不一致而导致的问题。

总结来说，`npx tsc`命令更倾向于使用项目内部安装的TypeScript版本（如果有的话），并且能够在没有安装TypeScript的情况下临时安装并使用最新版本，这在确保编译环境的一致性和版本控制方面非常有用。而直接使用`tsc`命令则依赖于系统路径中可用的TypeScript版本，可能是全局安装的版本或项目内部依赖的版本。
:::



2. **运行JavaScript代码：**
   一旦TypeScript文件被编译成JavaScript，你就可以用Node.js或浏览器的方式来运行这些`.js`文件了。

3. **(可选)设置自动编译：**
   如果你想要在发生任何变化后自动编译TypeScript文件，可以使用`tsc`的 `-w` 或 `--watch` 参数来监视文件的变化并自动编译。
   ```bash
   tsc --watch
   ```
   或你可以在`package.json`中设置一个脚本命令来简化这个过程：
   ```json
   "scripts": {
     "watch": "tsc --watch"
   }
   ```
   然后，只需执行`npm run watch`即可开始监视和自动编译过程。


### 学习环境搭建

搭建一个用于快速学习和开发的TypeScript环境：
1. **安装Node.js和npm：**
   确保你已安装Node.js和npm（Node.js的包管理器）。npm是安装TypeScript和其他必要库的工具。

2. **全局安装TypeScript：**
   通过npm全局安装TypeScript编译器。在命令行中执行以下命令：
   ```bash
   npm install -g typescript
   ```
   这样你就可以在任何地方使用`tsc`命令。

3. **创建项目目录：**
   创建一个新目录用作你的项目文件夹，然后在该目录中打开命令行。

4. **初始化npm项目：**
   在项目目录中运行以下命令来创建一个`package.json`文件，它将存储项目的配置信息和依赖关系。
   ```bash
   npm init -y
   ```
   `-y`参数会自动填充`package.json`的默认值。

5. **本地安装TypeScript：**
   在项目文件夹中安装TypeScript作为开发依赖。虽然你已经全局安装了TypeScript，但是在本地安装可以确保项目的其他开发者在使用相同版本的TypeScript。
   ```bash
   npm install typescript --save-dev
   ```

6. **创建一个`tsconfig.json`文件：**
   这是TypeScript编译器的配置文件。可以手动创建此文件，也可以使用以下命令生成默认配置：
   ```bash
   npx tsc --init
   ```
   你可以根据需要编辑此文件，设置编译选项如`target`、`module`等。

7. **安装代码编辑器：**
   安装一个支持TypeScript的代码编辑器，例如Visual Studio Code（VS Code），这可以为你提供语法高亮、代码补全、错误提示等功能。

8. **编写TypeScript代码：**
   在你的项目文件夹中创建一个`.ts`文件，例如`index.ts`，然后开始编写TypeScript代码。

9. **编译TypeScript代码：**
   使用`tsc`命令来编译你的`.ts`文件。例如，如果你的文件名为`index.ts`，你可以运行以下命令：
   ```bash
   npx tsc
   ```
   这将根据`tsconfig.json`中的设置将TypeScript代码编译为JavaScript代码。

10. **运行JavaScript代码：**
    编译完成后，你可以通过Node.js运行生成的JavaScript文件：
    ```bash
    node index.js
    ```
    替换`index.js`为你的输出文件名。

11. **使用npm脚本：**
    你可以在`package.json`中设置脚本来简化编译和运行过程。例如：
    ```json
    "scripts": {
        "build": "npx tsc",
        "start": "node index.js",
        "build:start": "npx tsc && node index.js"
    }
    ```
    这样就可以使用`npm run build`来编译你的TypeScript代码，使用`npm run start`来运行编译后的JavaScript代码，也可以直接使用`npm run build:start`编译后立即运行

遵循以上步骤，你将可以快速地设置一个TypeScript学习和开发环境。随着你学习的深入，你可能还需要添加更多工具和配置来满足具体的开发需求，如调试工具、Linters、测试框架等。



## 二 基本数据类型

TypeScript 中保留了 JavaScript 的所有基本数据类型，并在此基础上进行了扩展。

以下是一些与 JavaScript 相同的基本数据类型：

1. **布尔型（Boolean）**：表示逻辑上的 `true` 或 `false` 值。
2. **数字（Number）**：表示整数和浮点数，支持二进制、八进制、十进制、十六进制表示法。
3. **字符串（String）**：一系列字符的集合，可以用单引号 `'` 或双引号 `"` 包围。
4. **空值（Null）**：表示一个故意未设置对象的值，只有一个字面量 `null`。
5. **未定义（Undefined）**：表示一个变量已被声明但未被赋值，只有一个字面量 `undefined`。

这些基本类型的使用可以参照：[JS基本数据类型](../js/js.md#base_data_type_id)


TypeScript还引入了额外的数据类型和特性来增强类型系统：

- **任意类型（Any）**：可以代表任何类型，当类型不确定时使用。
- **空类型 (Void)**：表示没有任何返回值的函数或无类型的情况。
- **永不存在的类型 (Never)**：表示永远不会出现的值的类型，常用于抛出异常或无限循环的函数。
- **Enum（枚举）**：定义一组命名的常量。
- **对象类型 (Object)**：用来表示非原始值的类型，比如对象字面量或类实例。
- **Array**：具有特定元素类型的数组，如 `number[]` 表示一个数字数组。
- **元组类型 (Tuple Types)**：固定长度和类型的数组。

除了这些，TS中还有更多的 [高级类型](./ts2.md#高级类型-types) 和类型使用规则
通过在 TypeScript 中使用这些类型，开发者可以获得更多的静态类型检查，有助于预防错误并提高代码的清晰度和可维护性。


### 数组和元组

TypeScript 的 `Array` 和 JavaScript 的 `Array` 在本质上是非常相似的，因为 TypeScript 是 JavaScript 的一个超集，这意味着所有在 JavaScript 中可以对数组的操作在 TypeScript 中也同样适用。然而，TypeScript 引入了类型系统，这给数组带来了一些额外的功能和约束：

1. **类型注解**：在 TypeScript 中，你可以为数组指定元素的类型。这意味着数组的所有元素都必须是同一类型或者是某些类型的联盟类型。例如，你可以声明一个只包含字符串的数组 `string[]` 或者包含数字和字符串的联合类型数组 `(number | string)[]`。

```typescript
let stringArray: string[] = ['apple', 'banana', 'cherry'];
let mixedArray: (number | string)[] = [1, 'two', 3];
```

2. **元组类型（Tuple）**：TypeScript 还支持元组类型，这是一种特殊的数组类型，它限制了数组的长度和每个元素的具体类型。这对于那些需要固定数量和类型的元素集合很有用。

```typescript
let tuple: [string, number] = ['hello', 42];
```

3. **推断类型**：TypeScript 会尝试根据数组的初始值推断出数组的类型，如果显式地指定了类型，TypeScript 编译器会检查数组的使用是否符合指定的类型，这有助于早期发现类型错误。

4. **静态类型检查**：由于类型注解的存在，TypeScript 在编译时会进行类型检查，如果尝试向数组中添加不符合类型的元素，或者错误地使用数组，TypeScript 编译器会报错，这有助于提高代码的健壮性和可靠性。



### Object

在 TypeScript (TS) 和 JavaScript (JS) 中，`Object` 都是一个基本的数据类型，用于存储键值对的集合。然而，TypeScript 对 `Object` 类型进行了扩展，引入了额外的类型系统特性，使得在处理对象时更加类型安全和具有表现力。下面是 TypeScript 中的 `Object` 与 JavaScript 中的 `Object` 的几个关键区别：

1. **类型注解**：
- **TypeScript** 允许为对象的属性指定类型，从而提供静态类型检查。例如，你可以定义一个接口或类型别名来精确描述对象的结构：
    ```typescript
    interface Person {
        name: string;
        age: number;
    }
    let person: Person = { name: "Alice", age: 30 };
    ```
- **JavaScript** 不具备这种内置的静态类型检查能力，对象的属性可以在运行时动态添加或修改，无需事先声明类型。

2. **更严格的空值处理**：
TypeScript 提供了如 `--strictNullChecks` 和 `--strictPropertyInitialization` 编译选项，这使得对 `Object` 的处理更为严格，例如要求对象的属性在使用前必须被初始化，或者禁止将 `null` 和 `undefined` 赋给非空类型的属性。


3. **对象字面量类型 (Object Literal Types)**：

对象字面量类型允许你直接使用对象字面量来定义一个变量的类型，而不需要预先定义接口或类型别名。

```typescript
let point: { x: number; y: number } = { x: 10, y: 20 };
```


4. **索引签名 (Index Signatures)**：

索引签名用于描述那些具有未知或动态键的对象。它们允许你在不知道具体键名的情况下对对象的结构进行类型约束，特别是对于那些键值对集合（如字典或映射）非常有用。

索引签名的语法在对象类型中通过方括号表示，键的类型放在前面，后面跟着一个冒号，然后是值的类型。

```typescript
interface StringArray {
  [index: number]: string; // 索引签名
}

let myArray: StringArray = ["Bob", "Alice"];
console.log(myArray[0]); // 输出 "Bob"
```

**模板字面量索引签名**：

TypeScript 还支持模板字面量作为索引签名的键类型，这在创建模式化的键名时特别有用。

```typescript
interface EventHandlers {
  [eventName: `${string}Changed`]: () => void;
}

let handlers: EventHandlers = {
  dataChanged: () => console.log("Data changed"),
  statusChanged: () => console.log("Status changed"),
};
```

在上面的例子中，`EventHandlers`接口可以接受任何以`Changed`结尾的字符串作为键，并且对应的值必须是无参数的函数类型。


5. **Any与Object的对比**：

在 TypeScript 中，`any` 类型可以表示可以是任何类型，而 `Object` 类型特指非原始类型（即除 `null`、`undefined`、`number`、`string`、`boolean`、`symbol`、`bigint` 和 `symbol` 之外的类型）。这在处理泛型或需要灵活类型时可能有区别。



### Any和Void

**Any 类型**：

`any` 类型表示可以是任何类型，相当于完全绕过了 TypeScript 的类型检查。当使用 `any` 类型时，你可以对变量进行任何操作，包括调用任何方法或赋予任何类型的值，而编译器不会报错。这在以下情况中可能有用：

- **过渡期间**：当你从 JavaScript 迁移到 TypeScript 时，可能有些部分代码的类型暂时不清楚，这时可以使用 `any` 来避免大量修改，但应尽快明确类型。
- **第三方库**：有时第三方库可能没有类型定义文件（`.d.ts` 或 `.d.tsx`），你可以暂时使用 `any` 来定义这些库的类型，直到找到或创建了正确的类型定义。
- **动态内容**：处理一些动态内容，比如来自用户输入或网络请求的数据，其确切类型未知时，虽然最好使用 `unknown`，但在某些情况下可能会选择 `any`。

**警告**：过度使用 `any` 会削弱 TypeScript 的类型安全优势，导致潜在的运行时错误，应该尽量避免。

#### **Void 类型**

`void` 类型表示没有任何类型，它通常用于表示函数不返回任何值。当一个函数没有返回值或者明确设计为不返回任何有意义的值时，其返回类型应声明为 `void`。例如：

```typescript
function logMessage(message: string): void {
    console.log(message);
}
```

- **返回值**：函数如果返回 `void`，可以不写返回语句，或者使用 `return;` 表示结束函数执行但不返回任何值。
- **变量**：很少将变量声明为 `void` 类型，因为它表示没有值，通常用于函数返回类型。

总结来说，`any` 类型提供了最大的灵活性但牺牲了类型安全，而 `void` 类型则明确表示没有返回值，增强了函数意图的表达和类型系统的严谨性。在实践中，应谨慎使用 `any` 并充分利用 TypeScript 的类型系统来提高代码质量。


### Unknown

在TypeScript中，`unknown`类型是一种安全的任意类型。尽管`any`类型同样允许赋予任意值，但`unknown`类型在你进行任何操作之前，需要先确保类型是你想要的类型。这就是`unknown`类型相比于`any`类型更安全的原因。

- 当你不确定一个变量的类型时，可以使用`unknown`。这比使用`any`更安全，因为它迫使你在对其进行操作之前进行类型检查。
- 当你从第三方库中获得了一个值，且该库没有TypeScript类型定义时。
- 当你从一个只知道是JSON对象的API接收到响应时。
- 在处理用户输入数据时，这时你无法确定用户输入的准确类型。

```typescript
let value: unknown;

// 赋值为字符串
value = "Hello World";

// 如果直接对unknown类型操作，TypeScript会报错
// console.log(value.toUpperCase()); // Error: Object is of type 'unknown'.

// 使用类型断言来明确类型
if (typeof value === "string") {
    console.log(value.toUpperCase()); // 正确: 输出 "HELLO WORLD"
}

// 另一个例子，我们把unknown类型用于函数返回值中
function getValue(): unknown {
    //... 可能返回任何类型的值
    return "This is a string";
}

// 使用类型检查来处理返回值
const unknownValue = getValue();

if (typeof unknownValue === "string") {
    console.log(unknownValue.toUpperCase());
}
```
在上述示例中，变量`value`被指定为`unknown`类型。我们不能直接对它进行操作，比如调用`toUpperCase()`函数，除非我们通过类型检查来确定它确实是一个`string`。在明确了类型之后，我们能安全地执行`toUpperCase`方法。

这让`unknown`类型成为一种遵守TypeScript类型系统规则时的灵活选择，同时也保证了代码类型的安全性。



### Never

TypeScript 中的 `never` 类型是一个特殊类型，它表示永不发生的值的类型。可用于**指示不可能的状态**: 即当某些变量或者返回类型在逻辑上是不可能的，但是TypeScript可能不会自动推断出来。在这种情况下，`never`类型作为一个工具可以手动注明某个状态是不可能达成的。

`never` 类型主要应用在以下几个场景：

1. **类型安全性**: 当你想确保函数不会意外地返回任何值时，使用`never`可以帮助你。它告诉TypeScript编译器和开发者，某个代码块不应该有返回值，这可以帮助捕捉编码错误。例如，如果你不小心在本应抛出异常的函数中添加了一个`return`语句，`never`类型的返回类型会导致TypeScript编译器产生错误。
```typescript
function throwError(errorMsg: string): never {
  // return 123
  throw new Error(errorMsg);
}
```

2. **穷尽性检查** (Exhaustiveness Checking): 当你使用联合类型时，`never`类型可以帮助确保你已经处理了联合类型中的所有可能值。这是通过在一个`switch`语句的`default`情况下使用`never`类型的变量来实现的。如果忘记处理新添加到联合中的类型，此时`default`情况会触发一个错误，因为存在未被处理的情况，并且 TypeScript 编译器会告诉你需要处理这个新类型。

下面是一个解释穷尽性检查的示范：

```typescript
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

type Shape = Circle | Square;
// type Shape = Circle | Square | Rectangle;
  
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck; // 这行代码仅仅是为了类型检查，实际运行时不会达到这里
  }
}
```

在这个例子中，如果`Shape`联合类型后来被添加了一个新的类型，例如`Rectangle`，而我们忘记在`getArea`函数中处理这个新类型，`default`分支就会被触发，因为`shape`无法赋值给类型`never`。这时我们就在编译时得到了错误提示，而不是在运行时遇到潜在的bug。

尽管`never`类型的代码路径看起来可能永远不会执行，但其主要作用是在编译时期帮我们确保代码的正确性和完整性，它是TypeScript类型系统强大表达能力的一部分，可以帮助我们避免错误和遗漏。



### Enum(枚举)

在TypeScript中，枚举（Enums）是一种特别的类别，它增强了JavaScript标准数据类型集。TypeScript允许我们使用枚举来定义一组命名常量。枚举可以是数字的，也可以是字符串的。

#### **数字枚举**

在TypeScript中，默认情况下，枚举是基于数字的。这些数字的枚举会自动增长，其中第一个枚举成员的值是0，接着是1，然后是2，以此类推。

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right
}

console.log(Direction.Up); // 输出 0
console.log(Direction[0]); // 输出 "Up"
```

#### **字符串枚举**

字符串枚举中的每个成员都必须被初始化为一个字符串字面量或者另一个字符串枚举成员。

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

console.log(Direction.Up); // 输出 "UP"
```

#### **异构枚举**

虽然不推荐，但TypeScript允许枚举混合字符串和数字成员。

```typescript
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}
```

#### **常量枚举**

常量枚举是完全内联的，其成员在使用时会被替换为实际的值。

```typescript
const enum Direction {
  Up,
  Down,
  Left,
  Right
}

let directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
console.log(directions)  // [ 0, 1, 2, 3 ]
```

在生成的JavaScript代码中，`Direction`枚举将会被移除，所有使用到`Direction`的地方将会被替换为硬编码的数字值。
其编译后的 `.js` 文件代码为：
```javascript
"use strict";
let directions = [0 /* Direction.Up */, 1 /* Direction.Down */, 2 /* Direction.Left */, 3 /* Direction.Right */];
console.log(directions);
```


#### **枚举成员类型和联合枚举类型**

你可以从枚举类型中获取单个枚举成员的类型，它由所有枚举成员的值组成的一个联合类型。

```typescript
enum ShapeKind {
  Circle,
  Square,
}

interface Circle {
  kind: ShapeKind.Circle;
  radius: number;
}

interface Square {
  kind: ShapeKind.Square;
  sideLength: number;
}

let c: Circle = {
  kind: ShapeKind.Circle,
  radius: 100,
}
```

在上面的示例中，`Circle`类型有一个`kind`属性，其类型是`ShapeKind.Circle`，这意味着它只能是`ShapeKind.Circle`的值。



## 三 类型注解和推断

TypeScript的类型注解和类型推断是其核心功能之一，它们提供了更多的运行时安全性，并且使得代码更加清晰。通过在编码阶段发现潜在的问题，它们可以显著提高开发效率。

### TS的类型推断

TypeScript拥有强大的类型推断能力。如果你在声明变量时直接进行赋值，TypeScript将自动推断出这个变量的类型。这意味着你不需要显式地为每个变量提供类型注解。

```typescript
let isDone = false;  // 自动推断为boolean
let age = 30;        // 自动推断为number
let firstName = "Alice"; // 自动推断为string

// 数组推断为字符串数组
let hobbies = ["Reading", "Coding"];
```

在上述例子中，尽管没有显式地使用类型注解，但TypeScript依然能够准确地推断出每个变量的类型。


### 添加类型注解

在一些情况下，TypeScript无法自动推断变量的类型，或者我们希望变量能够存储不同类型的值。这时，我们就需要使用类型注解来明确地指定变量的类型。

```typescript
let message: string;
message = "Hello, World!";

let count: number;
count = 10;

let isStudent: boolean;
isStudent = true;

// 显式指定数组类型
let scores: number[];
scores = [100, 95, 88];
```
TypeScript的类型系统远不止这些功能，还有接口（Interfaces）、枚举（Enums）、泛型（Generics）等高级特性，使得TypeScript成为开发大型JavaScript应用的强有力工具。



### 函数相关类型注解

在TypeScript中，不仅可以为变量添加类型注解，还可以为函数的参数和返回值指定类型。这有助于确保函数的正确使用和预期的返回。

```typescript
// 参数和返回类型都有注解，如：参数x和y都是number类型，返回值也是number类型
function add(x: number, y: number): number {
  return x + y;
}

// 为函数表达式添加类型注解
const multiply: (x: number, y: number) => number = (x, y) => x * y;


// 函数无返回值的情况（void类型）
function log(message: string): void {
  console.log(message);
}

// 可选参数： 通过在参数名之后加上?符号来表示该参数是可选的。可选参数必须跟在必选参数的后面。
function buildName(firstName: string, lastName?: string): string {
    if (lastName) return `${firstName} ${lastName}`;
    else return firstName;
}

// 默认参数： 只需在类型注解之后使用=操作符，后面跟上默认值即可
function buildAddress(city: string = "New York"): string {
    return `City: ${city}`;
}
```

函数的类型检查不只是针对返回类型，也包括参数类型。如果你试图调用函数时传递错误类型的参数，TypeScript会给出编译时错误。


#### **函数重载**： 
TypeScript的函数重载是通过类型检查与相应的类型注解在编译阶段提供编译器指导如何根据传入不同参数调用正确的函数实现。

- 注意JavaScript实际上没有函数重载的概念；当TypeScript代码编译成JavaScript时，只有一个函数体被创建。


要实现函数重载，在函数实现之前，你需要定义一系列的函数签名。这些签名定义了可以接受的参数类型和返回类型。在实际实现中，你需要使用类型守卫来处理不同类型的参数。

以下是函数重载在TypeScript中的一个简单使用示例：

```typescript
// 函数重载签名
function greet(name: string): string; // 单个字符串参数
function greet(age: number): string; // 单个数字参数
function greet(isMorning: boolean): string; // 单个布尔参数

// 函数实现
function greet(param: string | number | boolean): string {
    if (typeof param === 'string') {
        // 当参数是字符串类型时，按姓名问候
        return `Hello, ${param}!`;
    } else if (typeof param === 'number') {
        // 当参数是数字类型时，按年龄问候
        return `You are ${param} years old.`;
    } else {
        // 当参数是布尔类型时，按时间问候
        return param ? `Good morning!` : `Good evening!`;
    }
}

// 函数调用示例
console.log(greet("Alice"));   // 输出: Hello, Alice!
console.log(greet(42));        // 输出: You are 42 years old.
console.log(greet(true));      // 输出: Good morning!
```


## 四 接口(Interfaces)

TypeScript的接口（Interfaces）用于定义对象的类型。接口可以描述对象必须有哪些属性，以及这些属性的类型。

### 定义接口
最简单的接口可以定义一组属性及其类型，如：

```typescript
interface User {
  name: string;
  age: number;
}

let user: User = {
  name: 'Alice',
  age: 30
};
```

### 可选属性和只读属性
在接口中定义属性时，可以标记属性为可选的，或者只读的。

```typescript
interface User {
  readonly id: number;   // 只读属性
  name: string;
  age?: number;          // 可选属性
}

let user: User = {
  id: 1,
  name: 'Alice'
};

user.name = 'Bob'; // OK
// user.id = 2;    // Error: 因为id是只读的
```

### 索引签名
索引签名允许一个接口定义索引器，可以用来描述数组或对象字面量的类型：
```typescript
interface StringArray {
  [index: number]: string;    // 索引是数字且对应的值必须是字符串
}

// 创建符合 StringArray 接口的数组
const names: StringArray = ['Alice', 'Bob', 'Charlie'];

// 访问数组元素
console.log(names[0]); // 输出: Alice

// 尝试添加非字符串类型的元素会导致编译错误
// names.push(123); // 错误：类型“number”不能赋给类型“string”。

// 也可以用对象模拟数组行为，但不推荐这样做
const objAsArray: StringArray = {
  0: 'Alice',
  1: 'Bob',
  length: 2, // 注意，为了像数组一样迭代，你可能需要手动设置length属性
};

for(let i = 0; i < objAsArray.length; i++) {
  console.log(objAsArray[i]);
}
```


```typescript
interface Dictionary {
  [key: string]: any;    // 索引可以是任意字符串，而值可以是任意类型
}

// 创建一个符合 Dictionary 接口的对象
const userInfo: Dictionary = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
};

// 访问对象属性
console.log(userInfo.name); // 输出: Alice

// 添加不同类型的属性也是允许的
userInfo.favNumber = 7; 

// 修改已有属性的类型
userInfo.email = 'newemail@example.com'; // 从字符串变为字符串，这是允许的

// 尽管可以存储任意类型，但最好避免滥用`any`以保持类型安全
```



### 函数类型的接口
使用接口可以定义函数的类型：

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  return source.search(subString) > -1;
};
```

### 继承接口
接口可以继承一个或多个其他接口。

```typescript
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{};
square.color = 'blue';
square.sideLength = 10;
```

### 类型别名vs接口 {#type_aliases_vs_interface_id}
类型别名（Type Aliases）与接口类似，但不完全相同。它们的主要区别之一是类型别名不能被继承或者实现，它们一般在需要定义联合类型或元组类型时使用。

```typescript
type Point = {
  x: number;
  y: number;
};

// 以下是使用类型别名定义函数类型
type SetPoint = (x: number, y: number) => void;

let drawPoint: SetPoint = function(x: number, y: number) {
  // ...
};
```

接口和类型别名在很多情况下都可以互换使用，但是在需要使用类来实现它们，或者需要其他接口来继承它们的时候，则只能使用接口。


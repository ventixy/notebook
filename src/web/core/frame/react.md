--- 

order: 10
title: React.js

---


React的官方网站是：[https://reactjs.org](https://reactjs.org)
React中文文档地址：https://zh-hans.react.dev/learn


React是一个由Facebook（现Meta）开发的开源JavaScript库，主要用于构建用户界面。它采用组件化的方式来组织和构建UI，使得代码复用、状态管理及应用程序的维护变得更加高效。React通过使用虚拟DOM（Virtual DOM）技术来优化实际DOM的操作，从而提高了性能。React推崇声明式编程，使得代码逻辑更易于理解和预测。


**版本发展历史简述**
- **早期（2011-2012）**：React最初在Facebook内部为了解决动态生成复杂UI的问题而诞生，最初用于其News Feed部分。
- **React 0.10（2013年）**：React首次公开发布，开始获得开发者社区的关注。
- **React 16（2017年）**：引入了全新的核心架构“Fiber”，大大提升了React的性能和异步渲染能力。
- **React 17（2020年）**：主要改进了与DOM的交互方式，简化升级过程，没有太多直接影响开发者的重大新特性。
- **React 18（2022年）**：引入了并发模式和Suspense for Data Fetching，进一步优化了性能和用户体验，同时也加强了服务器端渲染（Server-Side Rendering, SSR）和流式渲染的支持。

::: info React与Vue3的对比
尽管React和Vue 3都是现代前端框架，它们在设计理念、学习曲线、社区支持和生态系统方面存在一些差异：

- **设计理念**：
  - **React**强调函数式编程和组件化的思想，推崇JSX来混合HTML和JavaScript，更偏向于底层，给予开发者更大的自由度。
  - **Vue 3**则提供了更全面的框架体验，通过模板、响应式系统和Composition API来简化状态管理和组件间通信，更加注重易用性和开发效率。

- **学习曲线**：
  - Vue 3通常被认为对于初学者更为友好，因为它提供了清晰的文档和更直观的模板语法。
  - React的学习曲线可能稍微陡峭一些，特别是对于那些不熟悉JSX和状态管理概念的开发者。

- **性能与优化**：
  - React通过React 18的并发模式和Suspense提高了渲染性能和用户体验。
  - Vue 3通过其新的响应式系统和改进的虚拟DOM算法同样实现了性能提升，尤其是在大规模应用中。

- **生态系统**：
  - React拥有庞大的生态系统，涵盖了大量的第三方库和工具，如Redux、React Router等。
  - Vue 3的生态系统虽然规模较小，但也足够丰富，且Vue 3自带的状态管理和 Composition API 减少了对外部状态管理库的依赖。
:::


## React使用方式

### 独立脚本方式
虽然React传统上通过npm包和模块打包器（如Webpack或Rollup）进行开发和构建，但也有像`React.js`或`ReactDOM.js`这样的UMD（Universal Module Definition）版本，可以直接通过CDN链接在网页中引入，实现类似于Vue的独立脚本使用方式。这种方式适用于快速原型开发或小规模项目。实现步骤如下：

1. 通过CDN链接引入了React和ReactDOM的开发版本。
2. 引入了Babel Standalone，它允许我们在浏览器中直接编写JSX代码而不需要预编译步骤。
3. 定义了一个简单的React组件`Welcome`，它接受一个`name`属性并返回一个带有问候语的`<h1>`元素。
4. 使用`ReactDOM.render()`方法将这个组件渲染到了页面上ID为`root`的DOM元素中。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>React独立脚本示例</title>
    <!-- 引入React库 -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <!-- 引入ReactDOM库 -->
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- 用于支持在浏览器中直接使用JSX -->
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
</head>
<body>

<div id="root"></div>

<script type="text/babel">
    // 使用JSX定义React组件
    function Welcome(props) {
        return <h1>Hello, {props.name}</h1>;
    }

    // 渲染React组件到页面上的DOM元素
    ReactDOM.render(
        <Welcome name="World" />, 
        document.getElementById('root')
    );
</script>

</body>
</html>
```
请注意，这种方式适合快速演示或学习用途，对于生产环境，推荐使用构建工具（如Webpack）来打包和优化你的React应用。



### 脚手架工具

React中最流行的脚手架工具是 [Create React App（CRA）](https://create-react-app.dev)，它是Facebook维护的一个官方脚手架，可以快速创建React应用并提供一套默认的构建配置。

以下是一个使用 [`npx`](../tool/node.md#npx) 创建React应用的示例：
```bash
npx create-react-app my-app
cd my-app
npm start
```
这会启动一个本地开发服务器，你的应用将在浏览器中自动打开，通常访问地址是`http://localhost:3000/`。


CRA创建的应用结构中，最重要的几个文件和目录如下：

- `src/index.js`：应用的入口文件。
- `src/App.js`：主组件文件，构成应用的主要结构。
- `public/index.html`：应用的HTML模板文件。

你可以直接修改`src/App.js`来开始构建你的应用。下面是一个简单的修改示例，更改默认的`App`组件以显示一条欢迎信息：

```jsx
// src/App.js
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My React App</h1>
        <p>Created with Create React App</p>
      </header>
    </div>
  );
}

export default App;
```

保存文件后，浏览器会自动刷新，显示你修改过的内容。


当准备部署应用时，可以运行以下命令来构建生产版本：

```bash
npm run build
```

这会在`my-app/build`目录下生成一个优化过的、可用于生产的静态文件集合。





### 服务器端渲染

React支持服务器端渲染，这使得初始页面加载时可以更快地向用户显示内容，并对SEO友好。



## React语法特性

### JSX语法

React的JSX语法基本上就是将HTML与JavaScript混合在一起，并在其中加入一些特定的语法。

```jsx
// 引入React库
import React from 'react';

// 使用JSX语法定义React元素
const element = <h1>Hello, world!</h1>;

// 使用JSX语法定义React组件
class Welcome extends React.Component {
  render() {
    // 在这里通过this.props访问父组件给该组件传递的props
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// 使用JSX语法将组件渲染到DOM中
ReactDOM.render(<Welcome name="Sara" />, document.getElementById('root'));

// 使用JSX语法定义包含子组件的父组件
function App() {
  return (
    <div>
      // 通过类似的HTML属性语法为组件传递props
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// 在JSX中嵌入表达式，表达式要写在大括号中
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

在以上示例中，你可以看到在JSX中可以直接写HTML标签，也可以像HTML属性一样来传递组件的props，同时在需要插入JavaScript表达式的地方，可以用大括号`{}`包围JavaScript表达式。

需要注意的是，因为 `class` 是JavaScript的保留关键字，所以在JSX中我们一般使用 `className` 来替代。

此外，JSX其实就是JavaScript对象，React 使用JSX来创建虚拟DOM对象，然后根据虚拟DOM来更新真实的DOM。


### Hook


### useState
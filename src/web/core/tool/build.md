---

order: 10
title: 常用构建/编译工具

---


常用构建工具 (Build Tools)：

1. [**Webpack**](https://webpack.docschina.org/concepts/) - 一种流行的模块打包器，能够处理各种资源文件（如JS、CSS、图片等），支持代码分割、热模块替换等高级功能，适用于构建复杂的前端应用。

2. [**Rollup**](https://cn.rollupjs.org/) - 专注于ES模块打包，适用于库和一些更关注体积优化的项目。

3. [**Parcel**](https://parceljs.org/docs/) - 零配置的打包工具，开箱即用，自动处理各种资源类型。

4. [**Gulp**](http://gulpjs.com) - 基于流的自动化任务运行器，通过可读性强的代码处理文件，如压缩、合并、编译等。

5. [**Grunt**](https://gruntjs.com) - 另一款成熟的任务自动化工具，通过配置文件定义各种任务。


::: info 使用建议

- **小型项目或快速原型**：**Parcel** 是一个很好的选择，它的零配置特性和快速启动能力可以让你迅速搭建并运行项目，无需花费大量时间在配置构建工具上。

- **中型项目**：**Webpack** 或 **Rollup** 可能更适合。如果你的项目依赖关系复杂，需要代码拆分和优化，Webpack 提供了丰富的配置选项和强大的生态支持。而对于库的开发或者对最终包体积有严格要求的项目，**Rollup** 的“树摇”能力将非常有用。

- **大型项目**：**Webpack** 通常是首选，尤其是在需要高度定制化的构建流程、优化资源加载策略或实现复杂的代码拆分时。它的灵活性和扩展性能够满足大型应用的复杂需求。

- **特定需求或习惯**：**Gulp** 和 **Grunt** 仍然有其应用场景，特别是对于那些已经习惯了这些工具的团队，或是项目中特定任务需要高度定制化处理时。Gulp 的流式处理特别适合处理大量文件转换任务。
:::



## Webpack

[**Webpack**](https://webpack.docschina.org/concepts/)：起初作为一个模块打包器，Webpack 专为解决JavaScript模块化问题而生，特别是在需要处理大量依赖和模块的复杂应用中。

随着时间发展，Webpack 成为了现代前端项目标配，支持代码拆分、加载器和插件系统，极大地增强了前端构建的灵活性和性能。虽然学习曲线较陡峭，但它提供的功能和优化策略对于构建大型SPA（单页应用）至关重要。

::: info 出现时期及流行时期
Webpack 最初于2012年首次发布, 2014年开始在前端社区普遍使用，当时的主要亮点是其独特的代码分割和懒加载功能。

随着React, Angular, Vue等现代前端框架的兴起，Webpack也被广泛采用作为模块打包器。到现在，Webpack依然是主流的前端构建工具之一。
:::


Webpack配置文件通常是项目的根目录下一个名为 `webpack.config.js` 的文件，该文件是一个Node.js模块，返回一个配置对象，Webpack根据这个对象进行打包构建：

```js
const path = require('path');

module.exports = {
  // 入口文件，路径相对于本文件所在的位置，可以直接使用模块名称，模块解析方式跟 Node.js 一样
  entry: './app/index.js', 

  // 输出配置
  output: { 
    // 输出文件，路径相对于本文件所在的位置
    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js',
  },

  // 模块加载器配置
  module: { 
    rules: [
      {
        // 对于.js文件使用babel-loader进行转码，presets定义语法
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },

  // 插件配置
  plugins: [], 

  // 开发服务器配置
  devServer: {},

  // 解析模块请求的选项
  resolve: {}, 
  
  // 优化配置，如模块拆分、压缩等
  optimization: {},
};
```

这只是webpack的基础配置，webpack的配置非常灵活，可以根据具体需求配置各种loader和plugin，实现各种功能，如处理CSS，处理图片，处理字体文件等。




## Rollup

[**Rollup**](https://cn.rollupjs.org/)：相比Webpack，Rollup 更专注于ES模块的打包，尤其是库的打包。

Rollup强调代码的“树摇”（tree shaking），即只打包实际用到的代码，从而生成更小的输出文件。Rollup 适合那些不需要复杂的运行时加载逻辑，追求极致体积优化的项目。

::: info 出现时期及流行时期
Webpack 最初于2012年首次发布, 2014年开始在前端社区普遍使用，当时的主要亮点是其独特的代码分割和懒加载功能。

随着React, Angular, Vue等现代前端框架的兴起，Webpack也被广泛采用作为模块打包器。到现在，Webpack依然是主流的前端构建工具之一。
:::



## Parcel

[**Parcel**](https://parceljs.org/docs/)：作为新一代的打包工具，Parcel 强调零配置，即开即用。它自动处理各种资源，包括代码转换、优化和热更新，极大地简化了开发者的工作。

Parcel 内置了对热门技术的支持，如React、Vue等，且具有较快的打包速度，非常适合快速原型开发或小型到中型项目。

::: info 出现时期及流行时期
Rollup 最初于2015年左右推出, 2016年开始热度渐盛。其专注于ES模块打包，产出结果更加精简，尤其对库和组件的打包十分友好。未来几年，随着ES模块的广泛应用，Rollup的使用会更加理想。
:::


## Gulp

[**Gulp**](http://gulpjs.com)：Gulp 几乎与Grunt同期出现，它主打的是基于流的处理方式，提高了构建速度和效率。

Gulp 利用Node.js的流技术，使得文件在处理过程中无需频繁地写入磁盘，这对于大型项目而言是一个显著的性能提升。Gulp 的配置更加简洁，鼓励代码重用，受到许多开发者的喜爱。

::: info 出现时期及流行时期
Gulp 最初于2013年发布，2014年开始广泛被使用，提供了一种新颖的基于流的代码处理方式，用户可以通过编写简洁的代码定义任务并处理文件。但随着 webpack 等工具的流行，Gulp 的使用频率有所下降。
:::


## Grunt

[**Grunt**](https://gruntjs.com)：作为早期的自动化构建工具，Grunt 凭借其强大的插件生态和易用性，在前端社区迅速流行起来。

Grunt采用配置优先的方式，通过定义任务和加载插件来自动化各种构建任务。但随着时间的推移，其基于文件的操作方式和相对较低的执行效率成为了一些大型项目中的瓶颈。

::: info 出现时期及流行时期
Grunt 最初于2012年发布，并在2013-2015年期间被大量使用，是最早的一批前端自动化构建工具。然而，由于配置较为繁琐，随着新一代构建工具（如webpack）的出现，Grunt 的使用率大大降低。
:::



## Babel编译器

Babel的官方网站是：[https://babeljs.io](https://babeljs.io)

Babel是一个广泛使用的JavaScript编译器，它使开发者能够使用最新的ECMAScript特性（如ES6、ES7等）编写代码，并将其转换为向后兼容的JavaScript版本，以便在当前的浏览器和环境中执行。这使得开发者能够在不牺牲老旧环境兼容性的前提下，利用新的语言特性和API。

- **语法转换**：将ES6及以后版本的JavaScript语法转换为ES5或更低版本的语法。
- **源代码转换**：通过插件系统，Babel可以不仅仅是语法转换，还能进行源代码的其他类型转换，例如添加polyfills以支持新的全局对象和方法。
- **预设(presets)**：一组预配置的插件集合，方便快速启用对特定JavaScript版本的支持，如`@babel/preset-env`用于转换到目标环境支持的JS版本。
- **插件(plugins)**：用于添加特定功能或转换，例如转换箭头函数、模板字符串等。


首先，需要在项目中安装Babel及其相关依赖。如果你使用npm，可以这样做：

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

接下来，创建一个Babel配置文件（通常是`babel.config.json`或`.babelrc.json`）在项目根目录下，来指定转换规则：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["> 1%, last 2 versions, not dead"]
        }
      }
    ]
  ]
}
```

这里，`@babel/preset-env`会根据你指定的目标环境自动选择需要的转换。


使用Babel CLI转换单个文件：

```bash
npx babel input.js --out-file output.js
```


::: info 在Webpack中集成Babel

首先，你需要安装Babel相关的依赖包，这通常包括`@babel/core`（Babel的核心）、`babel-loader`（让Babel与webpack协同工作的加载器）以及至少一个预设（preset），比如`@babel/preset-env`，用于转换你的ES6+代码到兼容的ES5版本。在你的项目根目录下，运行以下命令：

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

接下来，你需要在webpack的配置文件（通常是`webpack.config.js`）中添加对`babel-loader`的配置。以下是一个简单的示例：

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  // 其他配置...
  module: {
    rules: [
      {
        test: /\.m?js$/, // 匹配.js和.jsx文件，如果你想编译jsx文件，确保也安装了@babel/preset-react
        exclude: /(node_modules|bower_components)/, // 排除这些目录下的文件
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'] // 使用@babel/preset-env预设
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'], // 如果你也在编译jsx文件，确保包含这里
  },
  // 其他配置...
};
```

有时你可能需要在`.babelrc`文件或项目根目录下的`babel.config.js`中进一步配置Babel，尤其是当你需要使用额外的插件或自定义预设时。例如：

::: tabs#babel

@tab:active .babelrc
```json
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["> 1%, last 2 versions, not dead"]
        },
        "useBuiltIns": "usage", // 根据目标环境按需引入polyfill
        "corejs": 3 // 指定core-js版本
      }
    ]
  ]
}
```

@tab babel.config.js
```javascript
// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: [ '> 1%', 'last 2 versions', 'not dead' ],
        },
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
};
```
:::

完成上述步骤后，当你运行webpack构建命令（如`npx webpack`或`npm run build`，具体取决于你的项目设置）时，Babel将会自动对匹配的JavaScript文件进行转换，使其兼容目标环境。



如果要在Node.js项目中使用ES模块或新特性，可以使用`@babel/register`或`babel-node`：

```bash
npx babel-node script.js
```

或在你的脚本头部使用`@babel/register`：

```javascript
require("@babel/register");
require("./your-es6-script.js");
```

Babel是前端开发中不可或缺的工具，它使得开发者能够无缝地采用最新的JavaScript特性，而不必担心浏览器兼容性问题。通过配置和使用Babel，开发者可以专注于编写现代、高效的代码。
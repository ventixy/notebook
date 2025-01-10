---

order: 20
title: 代码质量与格式化

---


常用代码质量与格式化工具 (Code Quality & Formatting Tools)

1. [**ESLint**](https://zh-hans.eslint.org/docs/latest/use/getting-started) - 非常强大的JavaScript代码静态分析工具，用于发现潜在错误和不符合代码规范的地方，支持丰富的规则和插件系统。


2. [**Prettier**](https://prettier.io/)  - 代码格式化工具，自动格式化代码，确保团队间代码风格一致。


3. **Stylelint** - 类似于ESLint，但专用于CSS和SCSS等样式文件的静态分析和格式化。


4. **EditorConfig** - 跨编辑器的配置文件标准，帮助开发者在不同的编辑器中保持一致的代码风格。


::: tip 推荐方案
在开发中，最常用的代码质量和格式化工具方案可能是ESLint与Prettier的结合。

- ESLint：用于检查代码质量，即确保代码没有错误或潜在的问题。ESLint非常灵活，可以通过配置文件自定义规则，或者使用一些现有的配置集（如 Airbnb、Google、Standard 等）。ESLint主要关注的是代码的质量问题，比如未使用的变量，丢失的分号等。

- Prettier：用于代码格式化，以确保代码风格的一致性。Prettier配置简单，函数的换行、箭头函数括号的使用、字符串使用单引号还是双引号等这些格式问题，Prettier都能统一处理，使你的代码风格看起来更整洁一致。

这两个工具可以并行使用，在许多项目中你会看到这两个工具同时存在。ESLint 检查你的代码质量，Prettier 负责代码的格式。

ESLint与Prettier可以很好地集成在VSCode等常用的开发环境中，可以在你保存文件时自动修复和格式化你的代码，大大提高开发效率。
:::



## EsLint+Prettier

### EsLint
首先需要安装ESLint。在项目中安装是推荐的做法，因为这样可以确保每个项目都有自己的ESLint版本和配置：

```bash
npm install eslint --save-dev
```

在项目中设置一个基本的配置文件：

```bash
npx eslint --init
```

命令执行后，ESLint会询问几个关于你的代码风格和配置的问题，然后生成一个配置文件（ `.eslintrc.*` ）。 

接下来就可以开始使用ESLint来检查你代码了：

```bash
npx eslint yourfile.js
```

此命令会让ESLint检测 `yourfile.js` 文件，并在控制台输出报告。

在真实的项目中，可能想要为所有的JavaScript文件配置一个检查命令，你可以在 `package.json` 的 "scripts" 部分添加一个 "lint" 命令，如下：

```json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

然后就可以通过下列命令运行ESLint：

```bash
npm run lint
```

以上就是ESLint的基本使用方式。对于更详细的配置和规则，可以查阅ESLint的官方文档。ESLint的官方网站是：[https://eslint.org/](https://eslint.org/)。




### EsLint+Prettier

在项目中通常同时使用Prettier和ESLint, 此时可以使用 [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier#installation)

::: info eslint-config-prettier
 `eslint-config-prettier`是一个 ESLint 配置，它会禁用所有和 Prettier 冲突的 ESLint 规则。当同时使用 ESLint 和 Prettier 时，有些 ESLint 的规则可能会与 Prettier 的格式化设置产生冲突，这时候就可以使用 `eslint-config-prettier` , 它会自动关闭那些与Prettier冲突的ESLint规则，让你的代码更容易管理。

Prettier 的目标是自动化代码格式化，而 ESLint 旨在帮助你发现代码中的问题。虽然一些 ESLint 规则也涵盖了代码格式，但 Prettier 可以提供更多的格式定制，并且与 ESLint 结合使用可以让你同时享受到自动化代码格式化和发现代码问题的好处。
:::


以下是一个配置ESLint以使用`eslint-config-prettier`的基本步骤示例：

1. **安装所需依赖**：
首先需要安装`eslint`、`prettier`、`eslint-plugin-prettier`以及`eslint-config-prettier`。可以通过npm或yarn进行安装：

   ::: code-tabs#shell
   @tab:active npm
   ```bash
   npm install eslint prettier eslint-plugin-prettier eslint-config-prettier --save-dev
   ```
   @tab yarn
   ```bash
   yarn add eslint prettier eslint-plugin-prettier eslint-config-prettier --dev
   ```
   :::

2. **创建或修改ESLint配置文件**：
   通常需要在项目根目录下创建或编辑`.eslintrc.*`文件（可能是`.eslintrc.js`、`.eslintrc.yml`或`.eslintrc.json`）。下面以`.eslintrc.js`为例：

   ```javascript
   module.exports = {
     // 指定环境，以便ESLint可以理解你代码的上下文（比如浏览器环境、Node.js环境）
     env: {
       browser: true,
       es2021: true,
     },
     // 扩展基本的规则集，比如eslint:recommended
     extends: [
       'eslint:recommended',
       // 添加对Prettier规则的支持，注意将其放在最后以确保其规则优先级最高
       'plugin:prettier/recommended',
       // 如果你的项目中还使用了特定的框架，比如Vue或React，还可以添加对应的eslint配置
       // 例如：'plugin:vue/essential', '@vue/prettier', '@vue/typescript/recommended'
     ],
     // 插件列表，这里我们需要使用prettier插件
     plugins: ['prettier'],
     // 自定义规则，如果有的话
     rules: {
       // 这里可以添加或覆盖特定的规则，但使用'prettier/recommended'时，
       // 大部分格式相关的规则都会由Prettier接管，所以通常不需要额外配置格式规则
     },
   };
   ```

3. **配置Prettier**：
   除了在ESLint中配置外，还需要一个`.prettierrc`文件来指定Prettier的格式化规则。例如：

   ```json
   {
     "singleQuote": true,      // 使用单引号
     "trailingComma": "es5",   // 尾随逗号风格
     "semi": true,             // 语句结尾使用分号
     "tabWidth": 2,            // Tab缩进宽度
     "useTabs": false          // 使用空格代替Tab
   }
   ```

完成以上步骤后，当运行ESLint时，它将会自动应用Prettier的格式化规则，并且避免与Prettier的格式化产生冲突。同时，你也可以通过编辑器插件或命令行工具单独使用Prettier进行格式化。


### VSCode插件

::: info 在VSCode中结合使用Prettier和ESLint插件

#### 安装必要的VSCode插件

首先，确保安装了以下VSCode插件：
- **ESLint**: 用于识别并修复JavaScript和TypeScript代码中的潜在错误和不符合编码规范的地方。
- **Prettier**: 用于自动格式化代码，使其风格一致。
- **Vetur**（仅针对Vue项目）: 如果你的项目使用Vue，Vetur提供了对Vue文件的支持，包括ESLint和Prettier的集成。

#### VSCode设置

- 打开VSCode的设置（File > Preferences > Settings 或快捷键 `Ctrl + ,`）。
- 确保Prettier和ESLint插件被正确启用。
- 在设置中搜索`Editor: Default Formatter`，选择`Prettier - Code formatter`作为默认格式化程序。
- 开启保存时自动格式化：找到`Editor: Format On Save`，勾选此选项。
- 如果有需要，可以在`settings.json`中手动添加或调整相关设置，例如：
  ```json
  {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "[javascript]": {
      "editor.formatOnSave": true
    },
    "prettier.singleQuote": true,
    "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
    "eslint.run": "onSave"
  }
  ```

#### 解决冲突

如果遇到ESLint和Prettier的规则冲突，优先考虑按照Prettier的规则调整ESLint配置，避免在`.eslintrc.*`中直接规定与Prettier相矛盾的格式规则。

完成上述步骤后，每次保存文件时，VSCode会自动运用ESLint检查代码质量并使用Prettier格式化代码，确保代码既符合编码规范又风格统一。
:::
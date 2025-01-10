---

order: 1
title: Node和包管理

---

## Node.js基础

### Node.js简介
Node.js 是一个基于 Chrome V8 JavaScript 引擎构建的开源、跨平台的 JavaScript 运行环境。它允许在服务器端执行 JavaScript，使得开发者可以使用同一种语言编写前后端代码，Node.js 以其非阻塞 I/O 和事件驱动的架构而闻名，特别适合于构建高并发、高性能的实时应用、API 服务器、微服务、工具脚本等。

**特点与优势**：

1. **异步非阻塞I/O**：Node.js采用事件循环和回调函数，能高效处理并发请求，特别适合I/O密集型应用。
2. **单线程模型**：尽管JavaScript是单线程，但Node.js通过事件循环和异步处理，能够有效利用系统资源。
3. **庞大的生态系统**：npm（Node Package Manager）是世界上最大的软件注册表，提供了海量的开源库和工具。
4. **跨平台**：Node.js可在多种操作系统上运行，包括Windows、Linux和macOS。
5. **轻量级**：相比传统的Java、PHP等服务器端技术，Node.js启动速度快，资源消耗少。


### Node环境搭建
#### 在 Windows 或 macOS 上安装

1. **下载安装程序**：访问 Node.js 官方网站 [https://nodejs.org/](https://nodejs.org/)，根据你的操作系统下载对应的安装包。
2. **安装**：双击下载的安装程序，跟随向导完成安装过程。通常情况下，安装程序会自动添加 Node.js 到系统的 PATH 环境变量中，使你能在命令行直接使用 `node` 和 `npm` 命令。

除了基本的直接下载安装外，还可以借助 Nvm 管理多个 node 版本，参照：[NVM的安装和使用](../../../tool/usual/mac.md#node-js多版本管理)


#### 在 Linux 上安装

对于 Ubuntu 或 Debian 系统，可以使用 apt 包管理器安装，对于 CentOS 或 RHEL，则使用 yum 或 dnf：

::: tabs#Linux

@tab:active Ubuntu 或 Debian
```bash
sudo apt update
sudo apt install nodejs npm
```

@tab CentOS 或 RHEL
```bash
sudo yum install nodejs npm
# 或者对于较新的 CentOS/RHEL 使用 dnf
sudo dnf install nodejs npm
```
:::


#### 使用 Node.js运行 JavaScript 文件

1. **创建文件**：用文本编辑器创建一个名为 `app.js` 的文件。
2. **编写代码**：在 `app.js` 中输入简单的 JavaScript 代码，例如：
   ```javascript
   console.log("Hello, Node.js!");
   ```
3. **运行代码**：打开终端，进入该文件所在的目录，然后运行：
   ```bash
   node app.js
   ```
   你会在终端看到输出 “Hello, Node.js!”。


### REPL环境

REPL（Read-Eval-Print Loop，读取-求值-打印-循环）是一种简单的交互式编程环境，允许用户输入代码片段，立即执行并查看结果，从而快速测试和探索编程语言的功能。

Node.js的REPL使用：

1. **启动REPL**：打开命令行工具，输入`node`然后回车，即可进入Node.js的REPL环境。命令行会显示一个提示符，通常是`> `或者`>`，等待你输入JavaScript代码。

2. **输入代码**：在提示符后，你可以直接输入JavaScript表达式、声明、函数定义等，并回车执行。REPL会立刻执行你的代码并显示结果。

   - 例如，输入`2 + 2`并回车，REPL会输出`4`。

3. **变量与状态保持**：REPL会维持一个上下文环境，意味着你在其中定义的变量和函数可以在后续的输入中继续使用。

4. **多行输入**：如果需要输入多行代码（如函数定义），可以使用分号`;`或直接按回车进入下一行继续输入，直到输入结束符（如`}`）再回车执行。

5. **历史记录**：大多数REPL支持向上箭头浏览之前的输入历史，方便重复或修改之前的操作。

6. **退出REPL**：在Node.js的REPL中，输入`.exit`并回车，或者按下组合键`Ctrl+C`两次（在某些系统中），可以退出REPL环境。





### 事件驱动和非阻塞I/O

**Node.js 的事件驱动模型**

Node.js 的核心特性之一是其事件驱动的架构，这一模型主要依赖于事件循环（Event Loop）和回调函数（Callback）。事件驱动编程允许程序响应外部事件，而不是仅仅按照预定的顺序执行代码。在 Node.js 中，这一机制使得它能够高效地处理大量的并发请求，特别适合构建高吞吐量的网络应用。

1. **事件循环**：Node.js 的事件循环不断地检查是否有待处理的事件（比如网络请求、文件读写完成等），如果有，它就会取出对应的事件及其回调函数并执行。这种机制让 Node.js 能够在单个线程中处理多个并发任务，无需为每个请求创建新的线程或进程。

2. **回调函数**：当某个事件发生时，与之关联的回调函数会被放入事件队列等待执行。一旦当前正在执行的代码（包括之前的回调）完成，事件循环就会从队列中取出下一个回调执行。

3. **异步I/O**：Node.js 中的大多数I/O操作（如文件读写、网络通信）都是异步的，意味着它们不会阻塞主线程，而是在操作完成后通过回调通知事件循环。

**非阻塞I/O**

非阻塞I/O是事件驱动模型的基础。在传统的阻塞I/O模型中，当一个请求发出后，程序会暂停当前执行，直到请求完成并返回结果，这期间不能处理其他任务。而Node.js采用的非阻塞I/O则允许程序在等待I/O操作完成的同时继续执行其他任务。

1. **如何提高性能**：非阻塞I/O避免了线程在等待I/O操作时的空闲，充分利用CPU时间。在高并发场景下，由于Node.js使用单线程处理请求，没有线程上下文切换的开销，可以处理更多的并发连接，减少了内存消耗，提升了整体性能。

2. **libuv**：Node.js 的底层依赖于 libuv 库来实现跨平台的异步I/O和事件循环机制。libuv负责管理一个线程池来处理实际的I/O操作，而主线程（事件循环所在的线程）则专注于执行JavaScript代码和调度事件。

**事件循环处理并发请求**

当Node.js接收到多个请求时，它并不会为每个请求分配一个单独的线程，而是将请求的处理逻辑（主要是I/O操作）注册为事件监听器，并立即返回，继续处理下一个请求。当某个I/O操作完成时，事件循环会触发相应的事件，执行与之关联的回调函数，完成请求处理。因此，即使在处理大量并发请求时，Node.js也能保持低延迟和高吞吐量，因为它总是准备好去处理下一个事件，而不是等待某个操作完成。

总结来说，尽管Node.js在处理I/O时可能会在LibUV层使用线程池，但这与为每个请求或任务创建新线程的概念不同。Node.js通过异步I/O和事件循环机制，在单个主线程中实现了对多个并发任务的高效处理，减少了线程创建和切换的开销，提高了应用的整体性能。



## Node包管理器
### npm
npm（Node Package Manager） 是随 Node.js 一起安装的包管理器，它让开发者能够轻松地安装、管理和共享 Node.js 应用程序及其依赖关系。npm 提供了一个巨大的公开注册表，其中包含数百万个开源软件包，这些软件包可以通过简单的命令行操作进行安装和管理。

**npm 的特点**：
1. **包生态丰富**：npm 是目前世界上最大的软件包生态系统，覆盖了从Web框架、数据库驱动到实用工具等各类库。
2. **依赖管理**：自动处理依赖关系，确保安装的包及其依赖版本兼容，通过 `package.json` 和 `package-lock.json` 文件管理项目的依赖。
3. **脚本执行**：支持定义和执行自定义脚本，便于自动化构建、测试和部署任务。
4. **版本控制**：支持语义化版本控制，方便管理包的不同版本以及升级。
5. **全球镜像**：除了官方源，还有众多地区性镜像源可用，比如淘宝 NPM 镜像，可提高下载速度。


::: tip NVM 
nvm-windows的下载地址：https://github.com/coreybutler/nvm-windows/releases

在 nvm 的安装路径下(使用`nvm root`查看)，找到 `settings.txt`，在后面加上这两行，设置国内淘宝镜像源：
```bash
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

nvm-windows的相关命令参照：https://nvm.uihtm.com/
更详细的安装和使用介绍：https://www.cnblogs.com/rnny/p/17839190.html
:::

由于 Node.js 安装时会自动包含 npm，所以安装 Node.js 即安装了 npm。不过，有时候你可能需要更新 npm 到最新版本：

```bash
npm install -g npm
```


为了加快下载速度，特别是对于中国用户，可以配置使用淘宝 NPM 镜像：

1. **临时使用**：
   ```bash
   npm --registry=https://registry.npmmirror.com install <package-name>
   ```

2. **永久配置**：
   - 在命令行设置（仅限当前用户）：
     ```bash
     npm config set registry https://registry.npmmirror.com
     ```
   - 修改全局配置文件（所有用户）：
     找到 npm 的配置文件（通常是 `~/.npmrc` 或 `/etc/npmrc`），添加或修改 `registry=https://registry.npmmirror.com`。
     即便使用nvm安装了多个版本的node，所有的版本都适用于此配置文件


::: info 安装和使用 npm 包
1. **初始化项目**：在项目根目录下运行 `npm init`，按照提示填写信息，生成 `package.json` 文件。
2. **安装包**：例如安装 Express，运行：
   ```bash
   npm install express
   ```
3. **在代码中使用**：在 `app.js` 中引入并使用 Express：
   ```javascript
   const express = require('express');
   const app = express();
   app.get('/', (req, res) => res.send('Hello World!'));
   app.listen(3000, () => console.log('Example app listening on port 3000!'));
   ```
4. **运行服务器**：再次通过 `node app.js` 启动服务器，然后在浏览器访问 `http://localhost:3000`，可以看到 "Hello World!"。
:::

<br/>


### npm常用命令

#### 初始化项目

- `npm init`: 创建一个新的 `package.json` 文件，引导你填写项目信息。使用 `-y` 跳过提示并接受默认值，快速创建：

  ```bash
  npm init -y
  ```

#### 安装依赖

- `npm install <package>`: 安装指定的包到当前项目的 `node_modules` 目录，并添加到 `package.json` 的 `dependencies` 或 `devDependencies`（使用 `--save-dev`）。

- `npm i` 或 `npm install`: 无参数时，安装 `package.json` 中列出的所有依赖。

- `npm install --save`: 安装的同时将包添加到 `dependencies`。

- `npm install --save-dev`: 安装开发依赖，添加到 `devDependencies`。

#### 更新依赖

- `npm update`: 更新所有依赖到最新版本（不改变大版本号）。

- `npm update <package>`: 更新指定包到最新版本。

#### 卸载依赖

- `npm uninstall <package>`: 卸载指定包，并从 `package.json` 中移除记录。

#### 查看依赖

- `npm list`: 列出当前项目安装的所有依赖包。

- `npm list --global`: 查看全局安装的包。

#### 脚本执行

- `npm run <script>`: 执行 `package.json` 中 `scripts` 部分定义的脚本。

#### 发布包

- `npm login`: 登录 npm 账户。

- `npm publish`: 发布当前目录下的包到 npm 仓库。

#### 其他常用命令

- `npm cache clean --force`: 清理 npm 缓存。

- `npm view <package> versions`: 查看包的所有版本。

- `npm view <package> dependencies`: 查看包的依赖。

- `npm outdated`: 检查哪些依赖包有新版本可用。

- `npm help <command>`: 获取特定命令的帮助信息。

- `npm search <keyword>`: 搜索 npm 仓库中的包。


### npm create

`npm create` 是一个便捷的命令，它允许用户快速初始化一个新的项目，基于已存在的模板或包。这个命令是在npm的一个较新版本中引入的，旨在简化项目创建流程，特别是对于那些频繁使用特定模板或框架的开发者。


`npm create` 命令的基本形式是：

```bash
npm create [package-name] [project-name]
```

- `[package-name]` 是你想要用来创建项目的模板或包的名称。这些模板通常包含项目初始化所需的所有文件和配置，比如 `create-react-app`、`create-vite` 等。
- `[project-name]` 是你为新项目指定的名称，这个名称将作为新项目目录的名称。

如果省略了`[project-name]`，npm将会在当前目录下创建项目，使用默认的或你选择的包名作为目录名。


当你运行`npm create`时，npm会自动执行以下操作：

1. **安装模板包**：如果本地没有所需的模板包，npm会先将其安装到一个临时位置。
2. **执行模板脚本**：npm随后会调用模板包中的脚本或API来创建项目结构。这通常涉及文件的复制、配置文件的生成等。
3. **项目初始化**：最终，你得到一个包含所有必要文件和初步配置的新项目，可以直接开始开发。


- 创建一个React应用示例：

```bash
npm create react-app my-react-app
```
`npm create react-app my-app` 会寻找 `create-react-app` 包 并使用它来创建一个新的 React 应用


### npx

npx 是 npm 5.2.0 版本之后引入的一个命令行工具，它是 npm 包执行器。npx 的主要目的是为了简化执行 Node.js 包中的命令行工具的过程，特别是在不希望或不必全局安装这些工具的情况下。npx 的引入改善了开发者在使用 CLI 工具和其他托管在 npm 注册表上的可执行文件时的体验。

npx 与 npm 的关系紧密，可以视作 npm 的一部分或扩展功能。它们之间的主要区别包括：

1. **临时性与局部性**：npx 会在每次执行时临时下载（如果尚未存在）并执行所需的包，执行完毕后通常不会在系统中留下全局安装的痕迹。这有助于减少全局安装的包之间的冲突，并保持项目的环境纯净。

2. **自动安装依赖**：npx 会自动处理包的依赖关系，确保执行的命令或脚本可以在当前环境中正确运行，而不需要手动处理依赖安装。

3. **命令查找与执行**：npx 会智能地在本地 `node_modules/.bin` 目录、环境变量 `$PATH` 中查找命令，如果找不到，则直接从 npm 注册表下载并执行，使得执行命令变得简单直接。

4. **版本控制**：npx 支持指定执行命令的版本，这对于需要特定版本的工具来兼容项目的情况非常有用，避免了因全局安装版本不同而引发的问题。

总结来说，npx 是 npm 生态系统中的一个实用工具，它在不牺牲易用性的同时，增强了对包中命令行工具的管理和执行能力，特别适合于一次性任务或需要灵活版本控制的场景。




### pnpm
pnpm 是一种快速且高效的 Node.js 包管理器，它通过利用硬链接和归档文件来显著减少磁盘空间占用和提高安装速度。

**安装**: pnpm 可以通过 npm 安装为全局包：
```bash
npm install -g pnpm

# 设置 .pnpm-store 目录的位置
pnpm config set store-dir "D:\Develop\.pnpm-store"
setx PNPM_STORE "D:\Develop\.pnpm-store" /M
```

pnpm 使用 npm 配置文件（`.npmrc`）来指定下载源，格式与 npm 相同。

查看`pnpm`的配置项：
```bash
pnpm config list
```

pnpm 除了使用 `.npmrc` 外，还可以使用 `.pnpmfile.cjs` 进行更高级的配置，比如自定义生命周期脚本。

<br/>

**pnpm常见命令的使用**：

- **清理缓存**：`pnpm cache clean` 或 `pnpm cache clear`
- **查看版本**：`pnpm -v` 或 `pnpm version`

#### 初始化项目

进入你的项目目录，使用 `pnpm init` 来创建一个新的 `package.json` 文件，这个命令与 npm 的 `npm init` 类似：

```bash
pnpm init
```

在交互式提示中填写项目信息，或者使用 `-y` 参数跳过提示，接受默认设置：

```bash
pnpm init -y
```

#### 安装依赖

安装项目所需的依赖。`pnpm install` 会安装 `package.json` 文件中列出的所有依赖，同时也会读取 `package-lock.json` 或 `pnpm-lock.yaml` 文件来保证依赖的精确版本安装：

```bash
pnpm install
```

安装单个依赖包，并将其添加到 `dependencies` 或 `devDependencies`：

```bash
pnpm add <package-name>
```

安装依赖到开发环境（即添加到 `devDependencies`）：

```bash
pnpm add --save-dev <package-name>
```

#### 更新依赖

更新所有依赖到最新兼容版本：

```bash
pnpm update
```

更新特定包到最新版本：

```bash
pnpm update <package-name>
```

#### 卸载依赖

从项目中移除依赖包，并从 `package.json` 中删除相应的条目：

```bash
pnpm remove <package-name>
```

#### 查看依赖

查看已安装的依赖：

```bash
pnpm ls
```

查看具体包的依赖树：

```bash
pnpm ls <package-name>
```

#### 执行脚本

运行 `package.json` 中定义的脚本，类似于 npm：

```bash
pnpm run <script-name>
```

pnpm 使用 `pnpm-lock.yaml` 文件来锁定依赖版本和描述依赖关系图，这与 npm 使用的 `package-lock.json` 类似，但格式和机制有所不同。



::: tip 在 nvm 多版本 Node.js 环境下的配置设置影响
- **pnpm依赖于npm**: 在使用nvm切换版本后，如果对应版本下没有安装过pnpm，需要重新安装，每个node版本都对应一个独立的pnpm
- **共享全局 .npmrc**：所有通过 nvm 管理的 Node.js 版本共享一个全局的 `.npmrc` 文件，因此在此文件中设置的下载源适用于所有版本的 pnpm。
- **局部 .npmrc**：每个项目可以有自己独立的 `.npmrc` 文件，覆盖全局设置，这种配置是隔离的，不随 Node.js 版本变化。
- **环境变量**：通过环境变量（如 `NPM_CONFIG_REGISTRY`）设置的下载源也会影响所有 Node.js 版本下的 pnpm。
:::


::: info npm与pnpm
**npm与pnpm 的共同点**
- **包管理目的相同**：两者都用于管理 Node.js 项目的依赖，支持安装、更新、卸载包等操作。
- **使用 .npmrc 配置文件**：都使用 `.npmrc` 文件来配置包源和其他设置。

**npm与pnpm的区别**
- **依赖管理方式**：pnpm 采用“内容可寻址的文件系统”，避免了重复的依赖包，通过硬链接和快照机制节省磁盘空间和提高安装速度，而 npm 通常会为每个依赖包的每个版本复制所有文件到项目目录。
- **下载源配置**：虽然两者都可以通过 `.npmrc` 配置下载源，但 pnpm 在处理依赖时的优化机制使得它在某些场景下能更高效地使用这些源。
- **配置文件扩展**：pnpm 支持 `.pnpmfile.cjs`，提供比 npm 更多的自定义选项。

**npm和pnpm命令混用问题**
虽然从技术上讲，一个项目中可以同时安装了 `npm` 和 `pnpm` 并且在不同情境下分别使用它们来安装或管理依赖，但这并不是推荐的做法。主要原因是这样做可能会导致一些潜在问题和混乱：

1. **依赖管理混乱**：`npm` 和 `pnpm` 在处理依赖的方式上有所不同，尤其是 `pnpm` 使用了独特的依赖共享机制来优化磁盘使用和加快安装速度。混用可能导致依赖版本不一致，因为两个工具可能解析和安装依赖的逻辑有细微差别。

2. **Lockfile 不兼容**：==`npm` 使用 `package-lock.json` 文件锁定依赖版本，而 `pnpm` 使用 `pnpm-lock.yaml`==。这两个锁文件格式不同，各自反映了使用对应工具安装时的依赖状态。混用可能导致锁文件不一致，影响团队间的一致性和可复现性。

3. **脚本和配置差异**：尽管很多 `npm` 的命令在 `pnpm` 中有类似的实现，但两个工具的配置文件和一些高级特性可能有所不同。混合使用可能导致某些配置或脚本行为不符合预期。

4. **社区和维护问题**：当遇到问题时，混用两种包管理器可能使问题定位更加困难，因为社区和文档通常都是围绕单一工具的最佳实践来构建的。

因此，最佳实践是为一个项目选择一个包管理工具并坚持使用它，以避免上述潜在问题。如果决定从 `npm` 迁移到 `pnpm`，应该彻底地进行迁移，并且团队成员应统一使用 `pnpm` 来进行依赖管理。如果项目中已经存在 `pnpm-lock.yaml`，那么应完全使用 `pnpm` 进行依赖安装和管理，避免同时使用 `npm` 安装或更新依赖。如果需要回退到 `npm`，则应清理 `pnpm` 特有的文件（如删除 `pnpm-lock.yaml` 和 `node_modules`），然后使用 `npm` 重新安装依赖。
:::


### yarn

Yarn 是 Facebook 推出的一个快速、可靠、安全的依赖管理工具，与 npm 类似，用于 Node.js 项目中管理依赖包。下面是 Yarn 的一些基本使用方法和常用命令：

#### 安装 Yarn

- **通过 npm 安装**:
  
  ```bash
  npm install -g yarn
  ```

- **官方推荐安装方法**（因地区网络环境差异，请访问 [Yarn官网](https://yarnpkg.com) 获取最新安装指令）:

  通常包括使用 curl 或者 wget 下载安装脚本直接安装。

#### 初始化项目

- `yarn init`: 生成一个新的 `package.json` 文件，与 `npm init` 类似，通过交互式提问收集项目信息。

#### 安装依赖

- `yarn add <package>`: 安装并添加依赖到 `dependencies`。
- `yarn add <package> --dev`: 添加到 `devDependencies`。
- `yarn add <package>@<version>`: 安装特定版本的包。
- `yarn`: 或 `yarn install`, 安装 `package.json` 中列出的所有依赖。

#### 更新依赖

- `yarn upgrade <package>`: 更新指定包。
- `yarn upgrade <package>@<version>`: 更新到指定版本。
- `yarn upgrade-interactive`: 交互式地升级依赖。

#### 移除依赖

- `yarn remove <package>`: 从项目中移除依赖并更新 `package.json`。

#### 查看依赖

- `yarn list`: 列出所有已安装的依赖。
- `yarn info <package>`: 显示包的详细信息。

#### 运行脚本

- `yarn run <script>`: 执行 `package.json` 中定义的脚本。

#### 配置文件

- Yarn 使用 `yarn.lock` 文件来锁定依赖版本，确保每次安装时获得相同的依赖树。

::: info Yarn 与 npm 和 pnpm 的异同
**相同点**:
- 都是 Node.js 的包管理工具，用于解决项目依赖管理问题。
- 支持 `package.json` 文件来管理依赖信息。
- 都可以通过命令行安装、更新和管理依赖。

**不同点**:
- **性能与安装速度**:
  - Yarn 使用并行下载和缓存机制，提高安装速度；npm 在较新版本中也有所改进，但Yarn在并发下载上仍有一定的优势。
  - pnpm 通过共享依赖和快照机制进一步优化了速度和磁盘使用。

- **依赖管理**:
  - Yarn 使用 `yarn.lock` 文件来锁定依赖，保证一致性；
  - npm 使用 `package-lock.json` 达到类似效果。
  - pnpm 使用 `pnpm-lock.yaml`，并实现了一种更高效的依赖管理策略，避免了重复的包副本。

- **安全性**:
  - Yarn 和 npm 都有检查依赖安全性的功能，如 Yarn 的 `yarn audit` 类似于 npm 的 `npm audit`。
  - pnpm 同样关注安全性，但具体实现和报告可能有所不同。

- **配置与兼容性**:
  - Yarn 和 npm 都支持 `.npmrc` 配置文件，具有较高的兼容性。
  - pnpm 除了支持 `.npmrc`，还提供了额外的 `.pnpmfile.cjs` 自定义配置。
:::

总的来说，Yarn、npm 和 pnpm 都是强大的包管理工具，各有侧重。Yarn 强调速度和一致性，npm 是 Node.js 官方默认工具，生态丰富，而 pnpm 在空间效率和一致性方面表现出色。选择哪一个取决于个人或团队的具体需求和偏好。



## 项目依赖管理

### package.json

在前端开发中，`package.json`文件是项目的核心配置文件，它不仅记录了项目的元数据，还管理着项目的依赖关系。下面是一个`package.json`示例：

```json
{
  // 项目名称，应为唯一标识符
  "name": "my-front-end-project",
  
  // 项目版本，遵循语义化版本控制(SemVer)
  "version": "1.0.0",
  
  // 项目描述，简短介绍项目功能
  "description": "这是一个前端项目示例，展示依赖管理和配置",
  
  // 项目主入口文件，通常是服务器端或构建后的入口
  "main": "dist/index.js",
  
  // 脚本命令，简化日常开发任务
  "scripts": {
    // 启动开发服务器
    "start": "webpack serve --config webpack.dev.js",
    
    // 构建生产环境代码
    "build": "webpack --config webpack.prod.js",
    
    // 运行单元测试
    "test": "jest"
  },
  
  // 生产环境依赖，项目运行时所需
  "dependencies": {
    // React 库，用于构建用户界面
    "react": "^17.0.2",
    
    // React-DOM，React 的 DOM 版本，用于浏览器环境
    "react-dom": "^17.0.2"
  },
  
  // 开发环境依赖，仅用于开发和构建过程
  "devDependencies": {
    // Webpack，模块打包工具
    "webpack": "^5.52.1",
    
    // Webpack 的 CLI 工具，用于命令行操作
    "webpack-cli": "^4.8.0",
    
    // Jest，JavaScript 测试框架
    "jest": "^27.3.1",
    
    // ESLint，代码质量检查工具
    "eslint": "^7.32.0",
    
    // Babel，转译 ES6+ 代码为向后兼容版本
    "@babel/core": "^7.12.9",
    "@babel/preset-env": "^7.12.7",
    "@babel/preset-react": "^7.12.7"
  },
  
  // 关键字，用于提高包的可搜索性
  "keywords": [
    "frontend",
    "webpack",
    "react",
    "javascript"
  ],
  
  // 项目作者信息
  "author": "Your Name <your.email@example.com>",
  
  // 许可证声明
  "license": "MIT",
  
  // 项目仓库地址
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/my-front-end-project.git"
  },
  
  // 项目引擎要求，确保正确版本的 Node.js
  "engines": {
    "node": ">=12.0.0"
  }
}
```

此`package.json`示例展示了如何定义项目的基本信息、配置脚本命令、管理生产与开发环境依赖，以及指定项目的一些附加元数据。完整的配置项参考官方文档：[package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)



### 依赖包及版本号

在npm中，版本号遵循语义化版本控制（Semantic Versioning，简称semver）
格式为：`主版本号.次版本号.补丁版本号（MAJOR.MINOR.PATCH)`。
::: info 控制版本范围
1. **精确版本**：直接指定版本号，如`1.2.3`，表示安装特定版本。
2. **插入符（^）**：兼容/允许==次要版本==升级，如`^1.2.3`会安装`1.x.x`系列的最新版本，但不会跨过`1.x`升级到`2.x`。在希望获得新功能和改进时使用
3. **波浪线（~）**：兼容/允许==补丁版本==升级，如`~1.2.3`会安装`1.2.x`系列的最新版本，但不会跨过`1.2.x`升级到`1.3.x`。在追求稳定性时使用
4. **星号（*）**：匹配任何版本，但通常不推荐在生产环境中使用，因为可能导致不可预测的升级。
5. **大于号（>）、小于号（<）、大于等于号（>=）、小于等于号（<=）**：这些符号用于指定版本范围，如`>=1.2.0 <2.0.0`，表示任何`1.x`版本，但不包括`2.0.0`及更高版本。
6. **双连字符（-）**：指定版本范围，如`1.2.0 - 2.0.0`，与上面的`>=1.2.0 <2.0.0`效果相同。

使用这些符号时，npm会根据提供的条件选择符合条件的最新版本进行安装
:::

<br/>

**`dependencies`和`devDependencies`**

- **dependencies**: 这里列出的依赖项是在项目运行时所必需的。当应用部署到生产环境时，这些依赖会被安装。例如，像`express`这样的web框架或者`axios`用于发起HTTP请求的库，都是生产环境中需要的。

- **devDependencies**: 这里列出的是开发和构建过程中需要的依赖，但在你的应用程序实际运行时并不需要。这包括诸如代码检查工具`eslint`、测试框架`jest`或打包工具`webpack`等。

==如果一个依赖仅在开发或构建过程中使用，则应放在`devDependencies`；如果应用在运行时也需要它，则应放入`dependencies`==。正确地分类依赖有助于保持项目的清晰度和可维护性，同时也优化了生产环境的依赖安装过程。

- **添加到dependencies**：
  ```sh
  npm install <package-name> --save
  # 或者
  yarn add <package-name>
  ```

- **添加到devDependencies**：
  ```sh
  npm install <package-name> --save-dev
  # 或者
  yarn add <package-name> --dev
  ```
::: info 关于 `--save`
`--save`是一个npm（Node.js包管理器）命令行选项，它告诉npm在安装一个包时，不仅要将其添加到项目的`node_modules`目录中，还要将其名称和版本号记录到项目的`package.json`文件的`dependencies`部分。这样做的好处是，当其他人克隆你的项目或者在新环境中设置项目时，他们只需要运行`npm install`就能自动安装所有生产环境中必需的依赖。

随着时间的发展，==从npm 5开始（发布于2017年），`--save`选项的行为成为了默认行为==。这意味着当你直接运行`npm install <package>`而没有指定`--save`或`--save-dev`时，npm会自动将包添加到`dependencies`或`devDependencies`中，具体取决于上下文。这一改变是为了简化开发者的工作流，减少命令行中的输入。

所以，`--save`可以省略的原因是因为npm版本5及以上默认就具备了保存依赖到`package.json`的功能。不过，为了明确意图和兼容旧版npm或某些特定场景，你仍然可以选择显式使用`--save`。对于开发依赖（devDependencies），则依然需要使用`--save-dev`（或简写为`-D`）来指定。
:::


### npm执行脚本

在npm中，可以通过`scripts`字段在`package.json`文件中定义自定义脚本，这些脚本极大地便利了前端开发过程中的自动化任务，比如启动开发服务器、编译代码、运行测试等。

**如何自定义脚本**：

1. **打开`package.json`文件**：找到或创建`scripts`对象，它是一个键值对集合，键是脚本名，值是执行的命令。

2. **定义脚本**：在`scripts`对象内添加新的键值对。值可以是shell命令或本地可执行文件的路径，也可以调用其他npm脚本。实际开发中通常是由框架或者脚手架生成的。

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start", // 启动开发服务器（假设使用Create React App）
    "build": "react-scripts build", // 编译生产环境代码
    "test": "react-scripts test", // 运行测试
    "lint": "eslint './src/**/*.{js,jsx,ts,tsx}' --quiet", // 静默模式运行ESLint代码检查
    "precommit": "npm run lint && npm run test", // 在git commit前执行的脚本
    "deploy": "npm run build && gh-pages -d build" // 部署到GitHub Pages
  },
  // 其他配置...
}
```

**如何使用自定义脚本**：

- **命令行执行**：在项目根目录下，使用`npm run <script-name>`, `pnpm <script-name>`或`yarn <script-name>`来执行脚本。例如，`npm run start`会启动开发服务器。
- **省略run**：pnpm和yarn均可以不添加 run , npm则建议使用 `npm run xx`命令（虽然部分情况下，如脚本名是start等时也可以省略run）


::: info 常用脚本命令及其解释

- **start**: 通常用于启动开发服务器，监听文件更改并自动刷新浏览器，适合开发环境。例如，使用Create React App时，它会启动一个内置的WebPack开发服务器。

- **build**: 用于编译项目代码，进行压缩、优化等操作，生成准备部署到生产环境的静态文件。

- **test**: 运行项目的测试套件，确保代码质量和功能正确性。配合测试框架（如Jest）使用。

- **lint**: 代码质量检查，使用ESLint或其他工具自动检测代码中的潜在错误和风格问题。

- **precommit/prepush**: Git钩子脚本，可以在提交或推送代码前自动执行某些任务，如代码检查或运行测试，保证代码库的质量。

- **deploy**: 自动部署脚本，可以配置为将构建好的应用部署到特定平台，如GitHub Pages、Heroku或其他云服务。
::: 
自定义脚本极大地提高了开发效率，减少了重复劳动，让开发者能更专注于编写业务逻辑。通过组合不同的命令和工具，你可以根据项目需求灵活定制适合的脚本。





## 模块系统与核心模块

### Node模块系统

Node.js的模块系统是其强大功能之一，它允许开发者将代码组织成独立的、可重用的单元。Node.js支持两种主要的模块规范：[CommonJS 和 ES模块（ESM）](../../base/js/es6.md#module-id)。

::: tip Node.js中模块的导入导出注意事项
Node.js开始实验性支持ESM（ECMAScript Modules）是从Node.js 8.x版本开始的，但那时需要特定的标志来启用这一特性。到了Node.js 12.x版本，ESM的支持变得更加稳定，并且开始鼓励开发者使用，但仍需通过配置（如使用`.mjs`扩展名或`--experimental-modules`命令行标志）来启用, Node.js13及以上版本支持通过`package.json`配置开启ESM

**package.json设置**：在你的`package.json`文件中添加`"type": "module"`，这样Node.js就知道使用ES6 模块语法。

  ```json
  {
    "type": "module"
  }
  ```

从Node.js 14.x版本开始，ESM的支持更加成熟，并且在后续版本中不断得到改进。特别是Node.js 14引入了对Top-level await的支持（在模块顶层使用await关键字）作为实验性功能。

最终，==在Node.js 16及以后的长期支持（LTS）版本中，ESM已经成为默认支持且稳定的功能，不再需要标志来启用==，并且在Node.js 22版本中，对ESM的支持进一步增强，包括增加了对JavaScript模块图同步require的支持等特性，表明Node.js对ESM的支持已经非常全面和成熟。

注意，当你在Node.js中使用ES6模块时，你需要注意依赖包的兼容性。并非所有NPM包都支持ES6模块，你可能需要查看特定包的文档来了解如何正确地导入它们。
:::


#### CommonJS模块规范

**定义**：CommonJS是一种用于服务器端JavaScript的模块规范，它在Node.js中被广泛采用。在CommonJS中，每个`.js`文件都被视为一个独立的模块，有自己的作用域。

**导入模块**：使用`require()`函数来导入模块。`require()`接收模块路径作为参数，并返回模块导出的对象。

```javascript
const fs = require('fs'); // 导入Node.js的文件系统模块
```

**导出模块**：模块可以通过`module.exports`或`exports`对象来导出功能或数据给外部使用。`module.exports`是模块的默认导出对象，而`exports`是`module.exports`的一个引用，通常用于简化导出操作。

```javascript
// 导出一个函数
exports.sayHello = function() {
  console.log('Hello, World!');
};

// 或者直接修改module.exports
module.exports = {
  greet: function(name) {
    console.log(`Hello, ${name}!`);
  }
};
```

**注意**：`require()`是同步操作，且模块在首次加载时只执行一次，之后的`require()`调用将直接从缓存中获取模块。

#### ES模块（ESM）支持

**定义**：ES模块是ECMAScript标准的一部分，从ES6开始引入，它提供了原生的模块导入和导出语法，支持动态导入、顶级`await`等特性。

**导入模块**：使用`import`关键字导入模块。

```javascript
import { sayHello } from './hello.mjs'; // 导入指定的导出项
import * as hello from './hello.mjs'; // 导入所有导出项作为一个对象
import hello from './hello.mjs'; // 默认导出
```

**导出模块**：使用`export`关键字导出模块的成员。

```javascript
// 导出一个函数
export function sayHello() {
  console.log('Hello, World!');
}

// 默认导出
export default function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

**文件扩展名**：ES模块通常使用`.mjs`作为文件扩展名，而CommonJS模块使用`.js`。不过，Node.js也允许通过配置使用`.js`作为ES模块的扩展名。

**异步加载**：与CommonJS不同，ES模块的导入是异步的，这有助于避免加载时的阻塞。







### Node核心模块

Node.js 的模块系统是其设计的核心特性之一，它允许开发者将代码组织成独立的模块，便于复用和维护。Node.js 的模块系统遵循“CommonJS”规范，这使得每个模块都有自己的作用域，避免了全局变量的污染。

#### Node.js 模块的分类

1. **核心模块**：这些模块是Node.js的一部分，直接由Node.js提供，无需安装即可使用。例如`fs`（文件系统）、`http`（HTTP服务器）、`path`（路径处理）、`os`（操作系统相关的实用功能）等。

2. **文件模块**：当导入一个以`.js`、`.json`或编译后的`.node`（C++扩展）结尾的本地文件时，Node.js会将其视为文件模块。文件模块的路径可以是相对的或绝对的。

3. **第三方模块**：这些是通过npm（Node.js包管理器）安装的外部库。使用前需要先通过`npm install`命令安装。


#### 示例1：使用`fs`模块读取文件

```javascript
// 引入fs模块
const fs = require('fs');

// 异步读取文件
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});
```

#### 示例2：使用`http`模块创建一个简单的HTTP服务器

```javascript
const http = require('http');

// 根据req.url判断客户端请求的路径，返回不同的响应内容
const server = http.createServer((req, res) => {
  // 可以使用 req.method 判断请求方式，进行不同的处理
  // if (req.method === 'POST' && req.url === '/submit') { ... }  
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (req.url === '/') {
    res.statusCode = 200;
    res.end('欢迎来到首页\n');
  } else if (req.url === '/about') {
    res.statusCode = 200;
    res.end('关于我们的信息...\n');
  } else {
    res.statusCode = 404;
    res.end('页面未找到\n');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```




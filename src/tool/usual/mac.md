---

order: -10
title:  Mac常用工具和软件
icon: macos

---

## Homebrew软件管理

[Homebrew](https://brew.sh/) 是一款为 macOS 操作系统设计的开源软件包管理器，它极大地简化了在 macOS 上安装、更新、卸载软件包的过程。Homebrew 可以安装命令行工具、开发者工具、科学软件包等各种开源软件，同时也支持安装 macOS 应用程序（通过 Homebrew Cask）。

::: info 发展史介绍
Homebrew 由 Max Howell 创建于2009年，初衷是为了解决在 macOS 上安装软件的不便，尤其是对于开发者常用的开源工具。它迅速获得了开发者的喜爱，因为它提供了统一的命令行接口来管理软件包，解决了依赖关系管理的问题，避免了手动编译和配置的繁琐。随着时间的发展，Homebrew 不断完善，支持的软件包数量激增，社区活跃度高，成为了 macOS 用户不可或缺的工具之一。2017年，Homebrew 宣布成为一个非营利组织，进一步保障了项目的长期发展。
:::

- **Homebrew常见术语介绍**

| 术语       | 定义                                                                                                                                       | 本意或词源                                                                                          |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| Formula    | Homebrew 中用于描述软件包的脚本文件，包含了如何获取、编译和安装软件的信息。每个 Formula 对应一个可安装的软件包。Formulae 是 Formula 的复数形式。| “配方”，原指化学或烹饪中的配方，这里引申为软件安装的“配方”或“步骤”。                                                                                   |
| Cask       | Homebrew Cask 是 Homebrew 的一个扩展，专门用于安装 macOS 应用程序（GUI 应用）。每个 Cask 描述了一个可安装的 macOS 应用及其元数据。             | “桶”或“酒桶”，在计算机用语中，借用了存储容器的概念，用以存储和分发应用程序。                                                                      |
| Keg        | 一个 Formula 或 Cask 安装后在文件系统中的实际存放目录，位于 Cellar 内。每个软件包的特定版本都有自己的 Keg。                                    | “桶”，与 Cask 类似，这里特指存储啤酒的大桶，引申为软件包的存储位置。                                                                                    |
| Cellar     | Homebrew 存放所有已安装软件包（Kegs）的中心目录，默认位于 `/usr/local/Cellar`。Cellar 保存的是未经修改的原始安装文件。                        | “地窖”，原指用于储存葡萄酒、啤酒等的地下或半地下的房间，这里比喻为存储软件包的“地下室”。                                                            |
| Caskroom   | 类似于 Cellar，但专门用于存放通过 Cask 安装的 macOS 应用程序。Caskroom 的路径通常为 `/usr/local/Caskroom`。                                   | 结合了“Cask”和“Room”，形象地表示了存放 GUI 应用程序包的“房间”或“存储区”。                                                                           |
| Bottle     | 预先编译好的软件包，用户无需从源代码编译即可安装。Bottles 通常针对特定的 macOS 版本和硬件架构优化，加速安装过程。                             | “瓶子”，与“Cask”类似，都源于饮料容器的概念，这里特指封装好的、便于分发的软件包。                                                                     |
| Tap        | 第三方软件包库或仓库。用户可以通过 "brew tap" 命令添加 Tap 来扩展 Homebrew 可安装的软件包范围。Tap 可能由个人或组织维护。                    | “水龙头”，引申为可以从其中获取资源或信息的来源，这里指代可接入的软件包库，用户可以从中“汲取”新的 Formula 或 Cask。                                 |
| Brewfile   | 一个文本文件，列出了使用 Homebrew 安装的所有 Formula 和 Cask，以及它们的具体版本。可用于自动化重新安装或同步开发环境。                       | 结合了“brew”（酿造）和“file”（文件），创造了一个新词，形象地表示了一个包含 Homebrew 管理的软件包清单的文件。                                          |
s

### Homebrew安装与卸载

1. **打开终端**：首先，打开 macOS 的“终端”应用程序（Terminal）。
2. **安装命令**：在终端中，复制并粘贴以下命令，然后按回车键执行安装脚本：
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. **确认安装**：安装完成后，终端会显示 “Your system is ready to brew.”，表明 Homebrew 已成功安装，或者通过下列命令确认
    ```bash
    brew --version    # 查看版本号
    brew config       # 查看Homebrew的配置信息和系统环境的概览
    ```

国内镜像源和安装方式：
- 清华大学镜像源参考：https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/
- 中科大镜像源参考： https://mirrors.ustc.edu.cn/help/brew.git.html


::: tip 注意事项
- **权限问题**：在安装或更新过程中，可能需要输入密码或遇到权限问题，确保使用管理员权限操作。
- **Xcode Command Line Tools**：安装 Homebrew 之前，需要确保已安装 Xcode Command Line Tools。如果没有，Homebrew 安装脚本会提示安装。
- **Cask 安装**：安装 GUI 应用通常需要使用 Homebrew Cask，通过 `brew install --cask [application]` 完成。
:::


### Homebrew常用命令

- Homebrew路径相关命令

```bash
# 显示 Homebrew 本地的 Git 仓库
$ brew --repo

# 显示 Homebrew 安装路径
$ brew --prefix

# 显示 Homebrew Cellar 路径
$ brew --cellar

# 显示 Homebrew Caskroom 路径
$ brew --caskroom

# 缓存路径
$ brew --cache
```

- Homebrew常用命令

```bash
# 检查 Homebrew 当前配置是否合理，或者某些包存在的问题等。
$ brew doctor

# 搜索,支持模糊搜索
$ brew search <keyword>

$ brew upgrade                  # 更新所有已安装的包
$ brew upgrade <package-name>   # 更新指定包

# 列出已安装的包
$ brew list                     # 所有的软件，包括 Formulae  和 Cask
$ brew list --formulae          # 所有已安装的 Formulae
$ brew list --cask              # 所有已安装的 Casks
$ brew list <package-name>      # 列举某个 Formulate 或 Cask 的详细路径

# 列出可更新的包
$ brew outdated

# 锁定某个不想更新的包
$ brew pin <package-name>       # 锁定指定包
$ brew unpin <package-name>     # 取消锁定指定包

# 清理旧包
$ brew cleanup                  # 清理所有旧版本的包
$ brew cleanup <package-name>   # 清理指定的旧版本包
$ brew cleanup -n               # 查看可清理的旧版本包

# 查看已安装包的依赖
$ brew deps --installed --tree

# 查看包的信息
$ brew info <package>           # 显示某个包信息
$ brew info                     # 显示安装的软件数量、文件数量以及占用空间等

# 重置 Homebrew 缓存  解决由于缓存问题导致的安装失败
$ brew cache cleanup
```



### Homebrew安装软件

Homebrew 默认将软件安装到 `/usr/local/Cellar/` 目录下。这里存放的是软件的实际安装文件。然后，Homebrew 会创建符号链接（软链接）从 `/usr/local/Cellar/` 到 `/usr/local/bin/`、`/usr/local/sbin/` 或其他相应目录，以便于系统能够找到并执行这些程序。


- **安装软件包**：例如，要安装 Git，只需在终端输入 `brew install git` 并回车。
    ```bash
    # 示例：安装最新版的git 
    brew install git

    # 指定版本安装，例如安装 Node.js 的 14.x 版本 （并非所有软件包都支持这种直接指定版本的方式）
    brew install node@14    # brew install [软件名]@[版本号]

    # 手动指定 Formula 文件URL安装
    brew install https://raw.githubusercontent.com/Homebrew/homebrew-core/branch/formula_name.rb
    ```

可以直接从 GitHub 上的 Formula 仓库找到对应的 `.rb` 文件，然后使用该文件的 URL 来安装特定版本。如上，但需要注意将 `branch` 替换为正确的分支名，`formula_name.rb` 替换成实际的 Formula 文件名和路径。

::: tip 如何通过homebrw安装指定版本的软件
如果你想查找并安装某个软件通过 Homebrew 提供的较老版本，可以遵循以下步骤：

1. **查看 Formula 信息**:
   首先，使用 `brew info` 命令查看软件的基本信息。虽然这不一定直接列出所有历史版本，但它可能会给你一些线索，比如 Formula 文件的 GitHub 存储库位置。

   ```bash
   brew info 软件名
   ```

2. **访问 GitHub Formula 仓库**:
   大多数 Homebrew Formula 都托管在 GitHub 的 [Homebrew/core](https://github.com/Homebrew/homebrew-core) 仓库中。你可以直接访问这个仓库，通过搜索找到对应的 `.rb` Formula 文件。

3. **查看历史版本的 .rb 文件**:
   在 Formula 文件的 GitHub 页面上，点击 “History” 或者 “Commits” 查看该文件的提交历史。通过历史记录，你可以找到不同版本的 `.rb` 文件，每个提交可能对应着软件的不同版本。

4. **手动指定 Formula 文件**:
   找到你需要的版本的 `.rb` 文件后，复制该文件的原始 URL。然后使用这个 URL 直接通过 Homebrew 安装特定版本。

- **结合brew search**
    brew search 的搜索结果可能也会有部分版本信息，可以直接参考使用
    ```bash
    brew search mysql
    brew install mysql@5.7
    ```
:::

- **卸载Homebrew**
卸载 Homebrew 的过程相对直接，可以通过运行一个官方提供的卸载脚本来完成。以下是卸载 Homebrew 的步骤：

1. 首先，打开 macOS 的“终端”应用程序（Terminal）。

2. 在终端中，粘贴并执行以下命令来运行卸载脚本：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"
```

3. 脚本会提示您确认是否真的要卸载 Homebrew，按照提示操作。通常情况下，您需要输入 `y` 并回车以继续卸载过程。

4. 卸载过程将会移除 Homebrew 相关的文件和目录。但请注意，这个脚本不会自动移除通过 Homebrew 安装的所有软件。如果您也需要卸载这些软件，可能需要单独进行。

#### 注意事项

- 在执行卸载脚本之前，请确保没有正在运行的 Homebrew 进程。
- 卸载后，如果您打算重新安装 Homebrew，建议重启计算机后再进行安装。
- 考虑到 Homebrew 安装的软件可能遗留的文件和配置，为了完全清理，可能还需要检查 `/usr/local` 目录并手动删除与 Homebrew 相关的残留项，但需谨慎操作，避免误删其他重要文件。


### Homebrew及软件更新

- **更新 Homebrew**：定期更新 Homebrew 可以获取最新版本的软件包，使用命令 `brew update`。

    `brew update` 命令的主要作用是更新 Homebrew 自身及其包含的 Formula（软件包定义文件）列表。当你运行这个命令时，Homebrew 会连接到它的官方仓库，检查是否有任何新的 Formula 或现有 Formula 的更新。这一步骤确保你能获取到最新的软件版本信息，以便安装或更新软件包时使用的是最新版本。

    具体来说，`brew update` 会执行以下几个关键操作：
    1. **同步仓库**：从 GitHub 上的 Homebrew 主仓库拉取最新的 Formula 列表，这包括了所有可用软件包的最新定义。
    2. **更新 Homebrew 核心组件**：如果 Homebrew 本身有更新，这个命令也会自动更新其核心组件，确保你使用的是 Homebrew 的最新功能和修复。
    3. **清理过期数据**：有时，它还会清理不再使用的旧 Formula 文件和缓存，帮助保持本地 Homebrew 安装的整洁。

如果你想升级通过 Homebrew 安装的某个特定软件，比如 Git，你应该使用 `brew upgrade` 命令，并指定软件名。具体操作如下：

```bash
brew upgrade git
```

这条命令会让 Homebrew 查找 Git 的最新版本，并将其升级到最新版本。

如果你只是想检查是否有某个软件的更新，而不立即升级，可以使用 `brew outdated` 命令，它会列出所有可以升级的软件包：

```bash
brew outdated
```
在执行升级操作之前，`brew outdated` 命令可以帮助你决定是否有必要进行升级。需要注意的是，在升级过程中，如果软件有重大版本变更，最好查看其发布说明，以确保新版本与你的工作环境兼容。


### Homebrew卸载软件

要卸载通过 Homebrew 安装的软件包，比如想要卸载 `node`，只需在终端输入：

```bash
brew uninstall node
```

此命令会移除 `node` 及其关联的文件，但不会自动处理通过 `node` 安装的全局模块或配置文件。如果需要，这些通常需要手动清理。

#### 注意事项
1. **完全卸载**：有时候，卸载一个软件可能需要额外步骤来清理配置文件或依赖。Homebrew 默认不会自动删除所有相关文件，特别是那些可能影响其他软件的共享依赖。

2. **检查依赖**：卸载前考虑软件是否有其他依赖于它的软件。卸载一个包可能会导致依赖它的其他软件无法正常运行。

3. **暂无递归卸载**：如果一个软件包没有直接的卸载命令来移除其所有依赖，你可能需要手动检查并卸载这些依赖。Homebrew 暂无内置的递归卸载功能。

4. **清理缓存**：卸载后，为了节省磁盘空间，可以运行 `brew cleanup` 来清除已卸载软件的缓存文件和旧版本。


### Homebrew服务管理

对于需要作为后台服务运行的应用程序（例如数据库和Web服务器），Homebrew提供了一个`brew services`命令，用于管理这些服务的启动、停止和重启。

#### 启动服务

- **命令**：`brew services start <formula>`
- **作用**：启动`<formula>`指定的服务。如果服务已经运行，则此命令无操作。
- **示例**：`brew services start nginx`，启动nginx服务。

#### 停止服务

- **命令**：`brew services stop <formula>`
- **作用**：停止`<formula>`指定的服务。如果服务未运行，则此命令无操作。
- **示例**：`brew services stop nginx`，停止nginx服务。

#### 重启服务

- **命令**：`brew services restart <formula>`
- **作用**：重启`<formula>`指定的服务。如果服务未启动，它会先启动服务。
- **示例**：`brew services restart nginx`，重启nginx服务。

#### 列出所有服务

- **命令**：`brew services list`
- **作用**：列出当前用户通过Homebrew管理的所有服务，以及它们的状态（如started、stopped）。
- **示例**：`brew services list`，显示所有服务及其状态。

#### 运行服务

- **命令**：`brew services run <formula>`
- **作用**：直接运行`<formula>`指定的服务，而不是作为后台服务启动。这对于调试或只是想运行一个服务一次而不是持续运行非常有用。
- **示例**：`brew services run nginx`，单次运行nginx服务。




## MacOS命令和设置
### bash和zsh的使用

在Mac操作系统中，bash（Bourne Again SHell）和zsh（Z Shell）都是常用的命令行解释器，也称为shell。它们提供了一个与操作系统交互的界面，允许用户输入命令来执行各种任务。

```bash
# 查看macOS 的默认 Shell 
which $SHELL
```

::: info bash和zsh的异同
### 相同点

1. **基本命令兼容性**：zsh与bash高度兼容，大部分bash命令和脚本在zsh中也能正常运行。
2. **环境配置文件**：两者都使用配置文件来定制shell环境，比如bash使用`~/.bashrc`或`~/.bash_profile`，而zsh使用`~/.zshrc`。
3. **插件和扩展**：都可以通过插件和扩展增强功能，如自动补全、主题等。
4. **脚本语言**：两者都是基于shell的脚本语言，支持条件判断、循环、函数等编程结构。

### 不同点

1. **默认shell**：自macOS Catalina（2019年发布）开始，zsh成为了macOS的默认shell，而在此之前bash是默认shell。
2. **特性丰富性**：zsh提供了更多高级功能，如更强大的命令行补全、扩展历史、插件系统（如Oh My Zsh）、更好的语法高亮和提示符定制等。
3. **语法差异**：虽然高度兼容，但zsh在某些语法上与bash有所不同，比如变量命名规则、数组处理、函数定义等。
4. **性能**：在某些情况下，zsh可能因为更多的功能而稍微影响启动速度或资源消耗，但这通常对日常使用影响不大。
5. **自动补全**：zsh的自动补全系统更为先进，支持更复杂的匹配逻辑和上下文感知补全。
:::

#### 在macOS中切换bash和zsh

- **切换到bash**：
  ```bash
  chsh -s /bin/bash
  ```
  需要重新登录或执行 `exec bash` 来立即生效。

- **切换到zsh**：
  ```bash
  chsh -s /bin/zsh
  ```
  同样，可能需要重新登录或使用 `exec zsh`。

#### 配置文件

- **bash**：
  - 主配置文件通常为 `~/.bash_profile` 或 `~/.bashrc`，根据macOS版本和个人习惯有所不同。
  
- **zsh**：
  - 主配置文件为 `~/.zshrc`，用于命令别名、环境变量、插件加载等个性化配置。
  - `~/.zprofile` 用于登录时执行的配置，类似于bash的 `.bash_profile`。


bash和zsh各有优势，选择使用哪一个主要取决于个人偏好和工作需求。对于追求强大功能和高度定制化的用户，zsh可能是更好的选择，特别是配合Oh My Zsh这样的框架使用。而对于习惯bash或者需要在多系统间保持一致性的用户，继续使用bash也是完全可行的。在macOS上，用户可以根据需要轻松地在这两个shell之间切换。


### Oh My Zsh的使用

[Oh My Zsh](https://ohmyz.sh/) 是一个流行的、社区驱动的框架，用于增强和个性化 Zsh shell 的体验。它通过提供丰富的插件、主题和配置选项，使得命令行界面更加高效、美观和有趣。
#### 安装 Oh My Zsh

1. **基本安装**：
   打开终端，输入以下命令进行安装：
   ```bash
   sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
   ```
   安装脚本会自动设置 Zsh 为默认 shell（如果尚未设置），并安装 Oh My Zsh 及其默认配置。

#### 配置文件

- **.zshrc**：这是 Oh My Zsh 的主配置文件，位于用户家目录下。您可以在此文件中自定义设置，如添加插件、更改主题等。

#### 主题

- Oh My Zsh 提供了大量预先配置的主题，可以通过修改 `.zshrc` 文件中的 `ZSH_THEME` 变量来选择。例如：
  ```bash
  ZSH_THEME="robbyrussell"
  ```
- 更换主题只需将上述代码中的 `"robbyrussell"` 替换为您喜欢的主题名称。

#### 插件

- Oh My Zsh 支持数百个插件，用于增加额外的功能，如自动补全、git集成、颜色高亮等。
- 在 `.zshrc` 文件中，通过修改 `plugins` 数组来启用插件：
  ```bash
  plugins=(git git-flow zsh-syntax-highlighting zsh-autosuggestions)
  ```
- 确保插件已安装且路径正确，然后重启终端即可生效。

#### 自定义配置

- **别名（Aliases）**：在 `.zshrc` 文件中，您可以定义自己的命令别名，比如简化长命令。
- **自定义函数**：同样在 `.zshrc` 中，可以添加自定义函数以执行复杂任务。
- **环境变量**：在 `.zshrc` 或相应的环境文件中设置环境变量。

#### 更新 Oh My Zsh

- 保持 Oh My Zsh 更新很简单，只需在终端中运行：
  ```bash
  git -C ~/.oh-my-zsh pull
  ```

#### 常用命令

- **查看所有可用主题**：查看 `.oh-my-zsh/themes` 目录或在线浏览 Oh My Zsh 的 GitHub 页面。
- **查看所有可用插件**：查看 `.oh-my-zsh/plugins` 目录或查阅官方文档。

#### 高级技巧

- **自定义插件**：在 `~/.oh-my-zsh/custom/plugins/` 目录下创建自己的插件。
- **主题开发**：在 `~/.oh-my-zsh/themes/` 目录下创建或修改主题。
- **快捷方式**：利用 Zsh 的强大特性，如全局别名、快捷键绑定等，进一步提高效率。
- **故障排除**: 如果遇到问题，首先检查 `.zshrc` 文件的语法错误，可以使用 `zsh -xv` 命令进行调试。


### 环境配置和source命令

在macOS中，环境配置文件（`~/.bashrc`, 或 `~/.zshrc`）通常用于设置环境变量、定义别名（alias）、加载程序路径、配置shell行为等，以个性化和优化你的开发环境。

#### 1. 设置环境变量

环境变量用于存储操作系统或应用程序运行所需的全局信息，如路径、用户名、语言偏好等。

**示例**（在`.zshrc`或`.bash_profile`中设置JAVA_HOME）:
```bash
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk-17.0.2.jdk/Contents/Home"
```

#### 2. 添加到PATH

扩展你的系统路径，以便能够直接在命令行中调用自定义或第三方程序。

**示例**（添加Python虚拟环境到PATH）:
```bash
export PATH="$HOME/.pyenv/shims:$PATH"
```

#### 3. 别名设置

定义命令别名，简化常用或复杂的命令。

**示例**（创建一个`ll`别名来列出详细文件信息）:
```bash
alias ll="ls -lah"
```

#### 4. 函数定义

编写自定义函数，实现复杂操作的一键执行。

**示例**（定义一个函数来快速打开项目目录）:
```bash
project() {
    cd "/Users/yourusername/Documents/$1"
}
```
使用时只需输入`project myProject`就能跳转到相应的项目目录。

#### 5. Shell提示符（Prompt）定制

个性化你的命令行提示符，显示更多信息或美化界面。

**示例**（在zsh中使用Oh My Zsh或自定义PS1变量）:
```bash
PROMPT='%F{green}%n%f at %F{yellow}%m%f in %F{blue}%~%f$ '
```

#### 6. 加载额外配置

调用其他配置文件或脚本，以模块化管理配置。

**示例**（在`.zshrc`中加载额外的配置文件）:
```bash
source ~/.my_custom_config
```

#### 7. 软件包管理器配置

配置如Homebrew、npm、pip等的镜像源或环境变量。

**示例**（设置Homebrew国内镜像源）:
```bash
export HOMEBREW_BREW_GIT_REMOTE=https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git
export HOMEBREW_CORE_REPO=https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/core.git
```

#### 8. 自动化任务

虽然不直接在环境配置文件中，但可以通过配置crontab或使用launchd来设置定时任务。

**示例**（使用launchd创建定时任务）:
创建一个plist文件，如`com.example.dailybackup.plist`，配置定时备份任务。

注意：每次修改配置文件后，需要重新加载或执行`source`命令使其生效。


#### **`source`命令**
在Mac中，`source` 命令用于在当前shell会话中执行指定的脚本或配置文件。这通常用于重新加载环境配置，如 `~/.bash_profile`, `~/.bashrc`, 或 `~/.zshrc` 文件中的变更，而不需要退出并重新开启一个新的终端会话。

- **作用**：读取并执行指定文件中的命令。
- **语法**：`source filename` 或简写为 `. filename`。

```bash
source ~/.bashrc      # bash
source ~/.zshrc       # zsh
```

::: info `login shell` 与 `non-login shell`
在Unix-like系统中，包括macOS，"login shell"和"non-login shell"这两个术语用来区分用户登录系统或启动交互式shell时的不同情境，它们主要影响shell启动时读取配置文件的行为。

#### Login Shell
Login Shell 是指当用户首次登录或从休眠状态唤醒计算机, 或通过SSH连接到远程机器等场景时

- **配置文件**：对于bash，login shell 会读取以下配置文件：
   - `/etc/profile`
   - `~/.bash_profile` 或 `~/.bash_login` 或 `~/.profile`（按顺序查找，第一个存在的文件会被读取）
   
   对于zsh，login shell 通常会读取：
   - `/etc/zshenv`
   - `~/.zprofile`

#### Non-Login Shell
在Mac中，当你打开一个新的终端窗口时，默认情况下它是一个非登录shell，所以它会读取 `~/.bashrc` 或 `~/.zshrc`（取决于你使用的shell）来配置shell运行时环境。

在某些情况下，`.bash_profile` 会包含一行来源 `.bashrc` 文件，使得即使在登录shell中也会应用 `.bashrc` 中的设置。
:::


### curl和wget文件下载

在macOS中，有几个常用的命令行工具可用于网络下载文件，主要包括`curl`、`wget`（如果已安装）以及通过SSH和SCP进行的文件传输。

#### 1. `curl`

`curl` 是一个强大的命令行工具，用于传输数据，支持多种协议，包括HTTP、HTTPS、FTP等。它是macOS自带的工具，不需要额外安装。

**基本使用**:
- 下载文件：
  ```bash
  curl -O https://example.com/file.zip
  ```
  其中 `-O`（大写的字母O）选项表示将URL指向的文件保存到当前目录，并使用远程文件的名称。

- 下载并重命名文件：
  ```bash
  curl -o myFile.zip https://example.com/originalName.zip
  ```
  使用 `-o`（小写的字母o）选项可以指定下载文件的本地名称。

- 显示下载进度：
  ```bash
  curl --progress-bar https://example.com/largefile.iso
  ```

::: tip 通过代理使用curl

macOS和Linux系统中，`curl`遵循环境变量`http_proxy`、`https_proxy`、`all_proxy`来决定其代理设置。

先开启clashx等软件, 然后通过以下命令临时为`curl`设置代理：

```sh
export http_proxy="http://127.0.0.1:端口号"
export https_proxy="http://127.0.0.1:端口号"
curl http://example.com
```
将`端口号`替换成你ClashX代理的实际端口号（如7890）。这种方式设置的代理是临时的，关闭当前的终端会话后就会失效。

如果你希望代理设置持久化，可以将上述`export`命令添加到你的`~/.zshrc`或`~/.bash_profile`文件中：

```sh
echo 'export http_proxy="http://127.0.0.1:端口号"' >> ~/.zshrc
echo 'export https_proxy="http://127.0.0.1:端口号"' >> ~/.zshrc
```

然后，你需要重新加载配置文件，或者重新打开一个终端窗口。

### 使用命令行参数设置代理

如果你不想更改环境变量，`curl`命令本身支持通过命令行参数设置代理。使用`-x`或`--proxy` 参数：

```sh
curl -x http://127.0.0.1:7890  https://www.google.com
```

这种方法仅对当前使用的`curl`命令生效，不需要更改环境设置。

记得将上述的`端口号`替换成ClashX实际使用的端口号。设置完成后，`curl`命令应该就会通过指定的ClashX代理访问网络了。
:::


#### 2. `wget`（如果已安装）

`wget` 是另一个常用的下载工具，它在macOS上不是默认安装的，但可以通过Homebrew等包管理器安装。`wget` 提供了丰富的下载选项。

**安装 wget** (如果尚未安装，通过Homebrew安装):
```bash
brew install wget
```

**基本使用**:
- 直接下载文件：
  ```bash
  wget https://example.com/file.txt
  ```

- 断点续传下载：
  ```bash
  wget -c https://example.com/bigfile.iso
  ```
  `-c` 选项表示继续之前的下载。

#### 3. SSH/SCP

SSH（Secure Shell）和SCP（Secure Copy Protocol）可以用于安全地在本地和远程主机之间传输文件。

**SCP 示例**（从远程服务器下载文件到本地）:
```bash
scp user@remoteHost:/path/to/remote/file.txt ~/Downloads/
```

**SSH + SFTP 示例**（在SSH会话中下载文件）:
1. 首先，通过SSH连接到远程主机：
   ```bash
   ssh user@remoteHost
   ```
2. 在SSH会话中，使用`sftp`命令进入安全文件传输模式，然后下载文件：
   ```bash
   sftp> get /remote/path/to/file.txt ~/Downloads/
   ```




## MacOS常用工具和软件

### SDKMAN多版本管理

[SDKMAN](https://sdkman.io/) 是一个命令行工具，旨在方便地安装和管理多个软件开发工具包（SDK）的版本，包括但不限于Java、Groovy、Scala、Kotlin以及构建工具如Gradle和Maven。
SDKMAN 提供了一系列命令来帮助用户搜索、安装、切换、删除和列出不同的SDK版本。

以下是SDKMAN 的一些关键特性：

- 支持多种SDK的版本管理。
- 允许一键安装和切换不同版本的SDK。
- 可以处理不同版本之间的依赖和兼容性。
- 自动处理环境变量，如`JAVA_HOME`。
- 支持广泛的操作系统平台，如Linux、Mac和某些Unix平台。



在Mac或Linux系统中，通过在终端执行以下命令可以安装SDKMAN!：

```shell
curl -s "https://get.sdkman.io" | bash
```

安装完成后，执行如下命令以使配置生效：

```shell
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

- **SDKMAN管理多个JDK示例**

由于使用默认方式下载速度太慢，这里以先将JDK下载到本地的方式为例（[下载地址参考](https://sdkman.io/jdks)）

首先先下载几个常用的 JDK ， 全部解压，这里全部放在 `~/.sdkman/candidates/`目录下 , 然后使用sdkman安装管理

```bash
sdk install java jdk8 ~/.sdkman/candidates/jdk8u412-b08/Contents/Home

sdk install java jdk17 ~/.sdkman/candidates/jdk-17.0.11+9/Contents/Home

sdk install java jdk21 ~/.sdkman/candidates/jdk-21.0.3+9/Contents/Home
```

安装完成后可以设置默认的JDK版本了
```bash
sdk default java jdk21

java -version        # 查看当前JDK版本
source ~/.zshrc      # 如果上述命令未生效，尝试刷新配置文件再试

# 查看当前使用的JDK版本
sdk current java
```



- 管理环境变量

SDKMAN! 会自动管理环境变量，例如在Java安装后它会设置`JAVA_HOME`来指向选择的Java版本。这意味着用户不需要手动设置或更改这些环境变量。



SDKMAN! 可以使用以下命令更新到最新版本：

```shell
sdk selfupdate
```

通过提供这样一套简洁的接口和功能，SDKMAN! 极大地简化了开发环境的配置和管理过程，提高了开发者的效率。



### Node.js多版本管理

nvm（Node Version Manager）是一个命令行工具，主要用于 Node.js 的版本管理。它使用户能够在同一台计算机上安装和切换多个版本的 Node.js，而不会造成版本冲突的问题。这对于需要在不同项目中使用不同 Node.js 版本的开发者来说非常有用

要在Mac的ZSH中使用NVM（Node Version Manager），你可以遵循以下步骤进行安装和配置。这些步骤结合了NVM官方推荐的做法以及适合Mac环境的指导：

1. **打开终端**：首先，打开你的Mac的终端应用。

2. **安装依赖**：确保你的系统中已经安装了`curl`。大多数Mac系统默认都已安装，如果没有，可以通过Homebrew安装（如果你还没有Homebrew，可以访问[https://brew.sh](https://brew.sh) 并按照指引安装）。

3. **下载并安装NVM脚本**：在终端中运行以下命令来下载并安装NVM的安装脚本。这会自动处理安装过程并将NVM安装到你的用户目录下的`.nvm`目录中。

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```

   这里使用了特定版本号（例如`v0.39.7`）作为示例，你可以访问[NVM的GitHub页面](https://github.com/nvm-sh/nvm)查看最新的稳定版本号，并替换上述命令中的版本号。

4. **加载NVM**：为了使NVM在每个新的shell会话中都能使用，你需要在你的`.zshrc`配置文件中添加NVM的初始化命令。在终端中输入以下命令来编辑`.zshrc`：

   ```bash
   echo "export NVM_DIR=\"$HOME/.nvm\"" >> ~/.zshrc
   echo "[ -s \"$NVM_DIR/nvm.sh\" ] && \. \"$NVM_DIR/nvm.sh\"  # This loads nvm" >> ~/.zshrc
   ```

   如果你也想加载NVM的bash_completion（可选，但对命令补全有帮助），可以再加上这一行：

   ```bash
   echo "[ -s \"$NVM_DIR/bash_completion\" ] && \. \"$NVM_DIR/bash_completion\"  # This loads nvm bash_completion" >> ~/.zshrc
   ```

5. **使更改生效**：为了让修改后的`.zshrc`立即生效，无需重启终端，只需运行：

   ```bash
   source ~/.zshrc
   ```

**nvm常用命令**：
```bash
nvm -v              # 查看NVM版本, 等效于 nvm --version
nvm ls              # 列出已安装的Node.js版本，标记当前使用的版本
nvm current         # 查看当前正在使用的Node.js版本

nvm ls-remote            # 查看所有可安装的Node.js版本
nvm install <version>    # 安装指定版本的Node.js，例如: nvm install 14.15.0
nvm uninstall <version>  # 卸载指定版本的Node.js，例如: nvm uninstall 10.15.3

nvm use <version>        # 切换到指定版本的Node.js，如: nvm use 12.20.0

nvm alias default <version>    # 设置默认Node.js版本，新开终端时自动使用

nvm alias <name> <version>  # 创建版本别名，如: nvm alias node-latest 16.14.0
nvm unalias <name>          # 删除已创建的版本别名，如: nvm unalias node-latest
```

::: info 使用Homebrew安装nvm

1. **直接安装nvm**

   ```sh
   brew install nvm
   ```

2. **创建nvm目录：** 安装`nvm`后，需要创建一个目录来存储nvm的数据（包括安装的Node版本）。可以通过运行以下命令来创建该目录：

   ```sh
   mkdir ~/.nvm
   ```

**配置zsh环境变量**: 

1. **编辑zsh配置文件：** 打开`~/.zshrc`文件以编辑zsh的配置。你可以使用任意文本编辑器打开它，例如使用`vim`：

   ```sh
   vim ~/.zshrc
   ```

2. **添加nvm配置信息：** 在`~/.zshrc`文件中，添加以下行以配置nvm的环境变量：

   ```sh
   export NVM_DIR="$HOME/.nvm"
   [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
   [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
   ```

   这些行设置了nvm的目录并加载nvm到你的shell中。

3. **应用配置：** 配置完成后，保存并关闭文件。然后，在终端中运行以下命令以应用更改：

   ```sh
   source ~/.zshrc
   ```
:::



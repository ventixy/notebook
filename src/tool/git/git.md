---

order: 1
title:  Git版本控制

---

::: details SVN 和 Git的本质区别
SVN 和 Git 遵循不同的设计哲学，这些设计哲学导致了它们在使用和性能上的显著差异：

#### 设计哲学

1. **SVN（Subversion）**：
   - **基于差异（diff）**：SVN 跟踪文件的变化，每次提交记录的是相对于前一个版本的差异（diff）。这种设计使得存储空间相对较小，因为每个版本只存储增量信息。
   - **集中式版本控制系统**：SVN 使用一个中央仓库来管理所有版本控制的数据，客户端通过网络连接到这个中央仓库进行操作。

2. **Git**：
   - **基于快照**：Git 在每次提交中记录文件的完整内容（快照）。这种设计使得每个版本都是独立的，不需要通过版本间的差异组装得到。
   - **分布式版本控制系统**：Git 每个克隆的仓库都是一个完整的副本，包含所有历史记录，这使得离线操作成为可能。

#### 存储和性能

1. **存储空间**：
   - **SVN**：由于记录的是差异，SVN 的存储空间通常比 Git 小。每次提交只存储文件的增量信息，减少了冗余。
   - **Git**：由于记录的是快照，Git 的存储空间通常比 SVN 大。每次提交都存储文件的完整内容，但 Git 使用了一些优化技术（如压缩和打包）来减少存储空间的需求。

2. **性能**：
   - **SVN**：由于需要通过版本间的差异组装文件，SVN 的某些操作（如查看某个版本的文件内容）可能相对较慢。
   - **Git**：由于每个版本都是独立的快照，Git 的许多操作（如查看某个版本的文件内容、切换分支等）可以非常快速地完成，因为可以直接从数据库中获取完整的文件内容。

#### 优化技术

尽管 Git 记录的是快照，但它使用了一些优化技术来减少存储空间的需求：

- **压缩**：Git 会定期对对象进行压缩，生成 pack 文件，从而减少存储空间。
- **垃圾回收**：Git 会定期清理不再需要的对象，进一步优化存储空间。
- **Delta 编码**：在打包文件时，Git 也会使用 Delta 编码来减少冗余数据。

#### 实际对比

- **存储空间**：虽然 Git 记录的是快照，但由于优化技术，Git 的实际存储空间需求通常并不会比 SVN 大很多，尤其是在大型项目中。
- **性能**：Git 的操作速度通常比 SVN 快，尤其是对于离线操作和复杂的历史记录查询。

总结:

- **SVN**：基于差异的版本控制，存储空间较小，但某些操作可能较慢。
- **Git**：基于快照的版本控制，存储空间可能稍大，但操作速度快，支持分布式协作。

Git 通过记录快照来换取更快的操作速度，但通过优化技术，其实际存储空间需求并不会显著高于 SVN。这种设计使得 Git 在现代软件开发中非常受欢迎，特别是在需要频繁分支和合并的场景中。
:::


## Git基础命令使用

learn git branching: https://learngitbranching.js.org/

![](https://image.ventix.top/img01/202101101709051.png)

Git教程-GitHub：https://github.com/geeeeeeeeek/git-recipes 



### 安装和配置

Git官网：https://git-scm.com 

Windows下载地址：https://git-scm.com/download/win

::: tabs
@tab:active Linux
Linux 用户(以Ubuntu为例) : 
```bash
sudo apt-get install git
```

@tab Windows
直接下载安装即可

@tab MacOS
Mac 用户：Xcode Command Line Tools 自带 Git
```bash
xcode-select --install
```

:::


**【Git配置】**: 在使用 git 前，需要告诉 git 你是谁，在向 git 仓库中提交时需要用到。全局配置：

```bash
git config --global user.name 提交人姓名  # 1. 配置提交人姓名
git config --global user.email 提交人邮箱 # 2. 配置提交人姓名
git config --list                        # 3. 查看git配置信息
```

::: info SSH配置

生成秘钥：`ssh-keygen`  (秘钥存储目录：`C:\Users\用户\\.ssh`)

```bash
#进入git bash , 使用如下命令，连续三次回车
ssh-keygen -t rsa -C "msdrizzle@outlook.com"    

#查看公钥 (然后登录Gitee/Github,在设置中找到SSHKEY将id_rsa.pub文件的内容复制进去即可)
cat ~/.ssh/id_rsa.pub   
```
公钥文件名：`id_rsa.pub`, 私钥文件名：`id_rsa`
:::


::: details 管理多个Github账号的SSH密钥
同一个SSH密钥只能关联一个Github账号，如果需要在一台电脑上同时使用两个Gihub的仓库，需要配置不同的SSH密钥

生成第二个SSH密钥：
```bash
ssh-keygen -t rsa -b 4096 -C "xxxxx@163.com"
```
根据提示输入SSH密钥文件地址, 如: ` C:\Users\admin/.ssh/id_rsa2.pub`

```
cat ~/.ssh/id_rsa2.pub
```
配置第二个账号的SSH密钥

最后需要添加新SSH密钥到SSH代理：
```bash
 eval "$(ssh-agent -s)"ssh-add ~/.ssh/id_rsa2
```
并在 `~/.ssh/config` 文件中添加如下配置：
```bash
# 默认GitHub账户
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa

# 第二个GitHub账户
Host github-second-account
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa2
```

:::



### 新建/克隆仓库

1. 使用git管理一个已创建的项目：`git init` 

```bash
cd /path/to/myproject
git init
```
执行 `git init` 后, 会在当前目录下创建一个名为 `.git` 的子目录，这个目录包含了 Git 仓库的所有元数据和版本控制信息。


2. 创建一个新项目并使用Git管理：`git init <directory>`
```bash
cd /path/to
git init newproject
```
执行上述命令后，`/path/to/newproject` 目录会被创建，并且在该目录下会有一个 `.git` 子目录。



::: details 创建中央仓库/裸仓库

`git init --bare` 命令用于初始化一个裸仓库（bare repository）。与普通仓库不同的是，裸仓库并没有工作区或工作树（working tree），即没有我们通常所说的项目文件目录。相反，它只包含.git目录中所有的版本控制数据，这个.git目录实际上是整个仓库的数据库。

裸仓库的特点：

- **没有工作区**：裸仓库不会为你提供一个可以编辑文件的地方。因此，你不能直接在这个仓库中进行文件的修改操作。
- **集中管理**：由于缺乏工作区，裸仓库通常被用作远程仓库，用于多开发者之间的代码共享和协作。
- **节省空间**：因为没有工作区文件的存在，所以裸仓库占用的空间比带有工作区的仓库要小。

在团队开发中，通常会在服务器上创建一个裸仓库，作为所有开发者推送变更的目标仓库。

```bash
ssh <user>@<host>

cd path/above/repo

git init --bare my-project.git
```
- 一般来说，用 `--bare` 标记初始化的仓库以 `.git` 结尾。比如，一个叫`my-project`的仓库，它的空版本应该保存在 `my-project.git` 目录下。
- 裸库的目录下没有.git目录，一般将其作为远端备份或公共版本库，不能执行依赖于工作区的 Git 命令。

==在使用 GitHub、GitLab 或其他类似的在线 Git 托管服务时，通常不需要手动使用 `git init --bare` 命令来创建裸仓库。这是因为这些平台已经为用户提供了创建裸仓库的服务==。
:::


3. 克隆远程仓库：`git clone`

在已存在远程仓库时，使用 `git clone` 克隆项目到本地即可：

```bash
git clone https://github.com/user/repo.git
# 执行该命令会在当前目录下创建一个名为 `repo` 的目录，然后将仓库的内容克隆到这个目录中
```

如果你希望将仓库克隆到一个不同的目录中，可以显式指定本地目录。例如：
```bash
git clone https://github.com/user/repo.git mylocaldir
```
这条命令会克隆 `repo.git` 远程仓库，并在当前目录下创建一个名为 `mylocaldir` 的目录，然后将仓库的内容克隆到这个目录中。

::: tip
注意 远程仓库的 `.git` 拓展名克隆到本地时会被去除。它表明了本地仓库的非裸状态
:::



### 忽略文件

`git` 的忽略文件（`.gitignore`）是一个非常有用的工具，用于指定哪些文件或目录不应该被 `git` 跟踪。

1. **目的**：告诉 `git` 哪些文件或目录应该被忽略，不纳入版本控制。
2. **位置**：通常放在==仓库的根目录下==，文件名是 `.gitignore`。
3. **格式**：每一行指定一个模式，用于匹配文件或目录。

::: info 特殊字符
- **`*`**：匹配任意数量的任意字符。
- **`?`**：匹配任意单个字符。
- **`[abc]`**：匹配括号内的任意一个字符。
- **`[a-z]`**：匹配范围内的任意一个字符。
- **`**`**：匹配任意数量的目录层次。
:::

**常见的忽略规则**
#### 1. 忽略特定文件
```plaintext
# 忽略单个文件
file.txt
```

#### 2. 忽略特定类型的文件
```plaintext
# 忽略所有 .log 文件
*.log
```

#### 3. 忽略特定目录
```plaintext
# 忽略整个目录及其内容
dir/
```

#### 4. 忽略特定目录中的特定文件
```plaintext
# 忽略 dir/ 下的所有 .tmp 文件
dir/*.tmp
```

#### 5. 忽略特定路径下的文件
```plaintext
# 忽略 project/ 下的所有 .log 文件
project/*.log
```

#### 6. 忽略特定路径下的目录
```plaintext
# 忽略 project/ 下的所有 build 目录
project/build/
```

#### 7. 忽略所有子目录中的特定文件
```plaintext
# 忽略所有子目录中的 .DS_Store 文件
**/.DS_Store
```

#### 8. 忽略所有子目录中的特定目录
```plaintext
# 忽略所有子目录中的 node_modules 目录
**/node_modules/
```

#### 9. 忽略特定路径下的所有文件
```plaintext
# 忽略 logs/ 目录下的所有文件
logs/*
```

#### 10. 忽略特定路径下的所有目录
```plaintext
# 忽略 logs/ 目录下的所有目录
logs/**/
```

#### 11. 忽略特定路径下的所有文件和目录
```plaintext
# 忽略 logs/ 目录下的所有文件和目录
logs/**
```

#### 12. 忽略特定路径下的所有文件，但保留某些文件
```plaintext
# 忽略 logs/ 目录下的所有文件，但保留 logs/error.log
logs/*
!logs/error.log
```


**忽略已跟踪的文件**

如果已经将某个文件或目录添加到仓库中，然后又将其添加到 `.gitignore` 文件中，`git` 仍然会继续跟踪这些文件。要停止跟踪这些文件，你需要先从仓库中删除它们，然后再提交：

```sh
# 删除文件但仍保留在工作区中
git rm --cached file.txt

# 删除目录但仍保留在工作区中
git rm -r --cached dir/

# 提交更改
git commit -m "Stop tracking ignored files"
```

**检查忽略规则**： 可以使用 `git check-ignore` 命令来检查某个文件是否被忽略：

```sh
# 检查 file.txt 是否被忽略
git check-ignore file.txt
```




### 查看仓库状态

1. `git status` 命令显示工作目录和缓存区的状态。你可以看到哪些更改被缓存了，哪些还没有，以及哪些还未被 Git 追踪

```bash
git status            # 输出的命令很详细，但有些繁琐
```
`git status` 是一个相对简单的命令。 它告诉你 `git add` 和 `git commit` 的进展

::: details  `git status -s` 或 `git status --short` 命令

如果用 `git status -s` 或 `git status --short` 命令，会得到更为紧凑的格式输出，标记的具体含义如下：

- 新添加的未跟踪文件前面有 ?? 标记，
- 新添加到暂存区中的文件前面有 A 标记，
- 修改过的文件前面有 M标记。M 有两个可以出现的位置:
    - 出现在右边的 M 表示该文件被修改了但是还没放入暂存区
    - 出现在靠左边的 M 表示该文件被修改了并放入了暂存区

输出标记会有两列,第一列是对staging区域而言,第二列是对working目录而言
:::


2. `git log` 命令显示已提交的快照。你可以列出项目历史，筛选，以及搜索特定更改。
`git status` 查看的是工作目录和缓存区，而 `git log` 只作用于提交的项目历史。

```bash
# 使用默认格式显示完整地项目历史。如果输出超过一屏，你可以用 `空格键` 来滚动，按 `q` 退出。
git log

# 用 `<limit>` 限制提交的数量。比如 `git log -n 3` 只会显示 3 个提交
git log -n <limit>
```


### 提交到本地仓库

 1. 将工作目录中的变化添加到暂存区： `git add`

```bash
git add <file>        # 将 `<file>` 中的更改加入下次提交的缓存
git add <directory>   # 将 `<directory>` 下的更改加入下次提交的缓存

git add .    # 提交新文件(new)和被修改(modified)文件，不包括被删除(deleted)文件
git add -u   # 提交被修改(modified)和被删除(deleted)文件，不包括新文件(new)
git add -A   # 提交所有变化
```


2. 将暂存区（staging area）中的更改记录到仓库的历史记录中: `git commit`

```bash
git commit -m "<message>"  
```


::: info 自动将所有已跟踪文件的更改添加到暂存区，然后提交
 一次性完成暂存和提交操作，适用于已跟踪文件的更改：
```bash
git commit -a -m "Fixed typo in README"
```
该命令相当于执行了 `git add` 和 `git commit` 两个命令

【注意】：`git commit -a` 只会处理==已跟踪==文件的更改，不会处理新添加的未跟踪文件。如果你有新的文件需要添加到仓库中，仍然需要手动使用 `git add` 命令。
:::



3. 修改最近一次提交的信息或内容

`git commit --amend` 允许你在不创建新提交记录的情况下，更新最近的一次提交。这在以下几种情况下特别有用：

- **添加遗漏的更改**：如果你忘记在最近一次提交中添加某些文件或更改。
   ```sh
   # 暂存遗漏的文件
   git add newfile.txt

   # 修改最近一次提交
   git commit --amend --no-edit
   ```
- **修改最近一次提交信息并添加新的更改**：假设你需要修改最近一次提交的信息，并且还有新的更改需要添加。

   ```sh
   # 暂存新的更改(修改了README.md的内容，并新增了newfile.txt文件)
   git add README.md
   git add newfile.txt

   # 修改提交信息并添加新的更改
   git commit --amend -m "Fix typo in README and add newfile.txt"
   ```

`git commit --amend` 更适合在本地==尚未推送到远程仓库的情况下==使用。在多人合作开发的情形下，如果已经将提交推送到远程仓库，修改后再新增一个提交通常是更合适的做法。





### 远程仓库连接

`git remote` 命令允许你创建、查看和删除和其它仓库之间的连接:

```bash
#列出你和其他远程仓库之间的连接（-v 同时显示每个连接的 URL）
git remote -v

#创建一个新的远程仓库连接。添加之后 name 可作为 url 的别名在其他 Git 命令中使用                            
git remote add <name> <url>              

# 删除名为<name>的远程仓库连接
git remote rm <name>
# 将远程连接从 <old-name> 重命名为 <new-name>                     
git remote rename <old-name> <new-name>  
```

需要将代码同时推送到多个远程仓库的情形：
```bash
git remote add origin https://gitee.com/username/repo.git
git remote set-url --add origin https://github.com/username/repo.git
```


### 远程代码同步

1. `git fetch` : 下载远程仓库中的所有分支和标签，但不会自动合并到当前分支

```bash
git fetch [remote-name]    # 例：git fetch origin

# 查看远程分支
git branch -r

#  查看远程分支 main 的最新提交
git log origin/main
```

2. `git merge` : 将一个分支的更改合并到当前分支中

```bash
git merge [branch-name]   # 例如：git merge origin/main
```

如果合并过程中出现冲突，Git 会提示你解决冲突。解决冲突后，需要手动 `git add` 冲突文件，然后 `git commit` 完成合并。


3. `git pull` : 等同于 `git fetch` 和 `git merge` 的组合

```bash
git pull [remote-name] [branch-name]  # 如：git pull origin main

# 拉取远程仓库的最新代码并合并到当前分支
git pull 

# 和上一个命令相同，但使用 `git rebase` 合并远程分支和本地分支，而不是使用 `git merge`
git pull --rebase [remote-name]
```

git pull 强制覆盖本地代码：https://blog.csdn.net/yaoyutian/article/details/119105728


### 推送到远程仓库

`git push`：将本地分支的更新，推送到远程

例：将本地的master分支推送到origin远程主机的master分支:

```shell
# 将本地的 master 分支推送到远程仓库的 master 分支,如果后者不存在，则会被新建 (第一次推送)
git push -u origin master      
# -u选项指定一个默认远程主机，这样后面就可以不加任何参数使用git push

# 推送当前分支的更改到其关联的上游分支(后续推送)            
git push     

# 推送所有分支到远程仓库
git push origin --all
```

删除远程仓库的分支/强制覆盖, 慎用！

```shell
git push origin :master          #推送一个空的本地分支到远程分支,等同于:
git push origin --delete master

# 强制用本地的代码去覆盖掉远程仓库的代码 (-f为force，意为：强行、强制)
git push -f origin master        
```





## Git分支管理及应用

一个项目只允许有一个主分支，通常用来合并其他开发完毕的分支

`git branch`: 查看当前分支（git branch命令会列出所有的分支，当前分支面前会标有一个*号）例:
```bash
$ git branch
* dev
  master
```

### 创建/切换分支

1. 创建分支：Git 中创建分支是一个非常常见的操作，用于在不同的功能或特性之间隔离开发工作

```bash
# 创建一个新的分支
git branch new-branch-namer

# 切换到新创建的分支
git checkout new-branch-name
```

2. 创建一个新的分支并立即切换到该分支

```bash
git checkout -b new-branch-name   # -b 参数表示创建并切换分支
```
例：创建一个名为 dev 的新分支，并立即切换到该分支
```bash
# 新分支的起点是当前分支的最新提交
git checkout -b dev

# 新分支的起点是远程仓库 origin 中的 dev 分支
git checkout -b dev origin/dev
```

3. 如果需要删除一个分支，可以使用以下命令：

```bash
git branch -d branch-name
```



### 合并分支

`git merge`用于将一个分支的更改合并到另一个分支中

例：假设现在需要将源分支(feature-branch)合并到目标分支(main)：
```bash
# 1. 切换到目标分支
git checkout main

# 2. 合并源分支
git merge feature-branch
```

- **快进合并（Fast-Forward Merge）**: 如果目标分支的最新提交是源分支的祖先，Git 会执行快进合并（Fast-Forward Merge），即直接将目标分支的指针移动到源分支的最新提交。

- **非快进合并（Non-Fast-Forward Merge）**: 如果目标分支的最新提交不是源分支的祖先，Git 会创建一个新的合并提交，将两个分支的更改整合在一起。

- **无快进合并（No Fast-Forward Merge）**: 如果你希望强制创建一个新的合并提交，即使可以进行快进合并，可以使用 `--no-ff` 选项：
```bash
git merge --no-ff feature-branch
```

如果合并过程中出现冲突。解决冲突后，需要手动 `git add` 冲突文件，然后提交





### 解决合并冲突

如果有冲突，Git 会提示你解决冲突。示例：

现有这样一个项目（共有两次提交）：

![](https://image.ventix.top/img01/202101101711452.png)

共有两个项目成员（Neil 和 itdrizzle）进行开发：

![](https://image.ventix.top/img01/202101101713329.png)

Neil 先对 demo.txt 文件进行了修改：

```bash
git
test
Neil change file  # 新增的内容
```

然后进行了提交，并push到了 远程仓库

![](https://image.ventix.top/img01/202101101714618.png)

现在 itdrizzle 还不知道有人 进行了提交，他也想对 demo.txt 文件进行一些修改：

![](https://image.ventix.top/img01/202101101715829.png)

同样，他也进行了 提交 并push 到远程仓库：

![](https://image.ventix.top/img01/202101101716605.png)

显然，结果不尽人意，冲突已经发生，需要解决

itdrizzle 这时先将远程仓库的代码拉取到本地，而且使用了 git pull ，希望能自动合并

![](https://image.ventix.top/img01/202101101717509.png)

结果显然不行，需要 itdrizzle 手动解决冲突再进行提交：

![](https://image.ventix.top/img01/202101101718653.png)

解决冲突后，itdrizzle 再次进行了提交：

![](https://image.ventix.top/img01/202101101718656.png)

此时 Neil 再去 git pull 即可获取最新的项目信息：

![](https://image.ventix.top/img01/202101101718521.png)






### 分支的使用场景


::: tabs

@tab 功能开发分支

每个新的功能或特性开发都在一个独立的分支上进行
```bash
# 1. 创建功能分支
git checkout -b feature-branch

# 2. 在 feature-branch 上进行开发工作, 单元测试和集成测试

# 3. 测试通过后，将功能分支合并到主分支
git checkout main
git merge feature-branch
```
这样可以避免开发过程中对主分支的影响，确保主分支始终处于可部署状态。

@tab Bug修复分支

当发现生产环境中存在Bug时，可以在一个独立的分支上进行修复
```bash
# 1. 创建Bug修复分支
git checkout -b bugfix-branch

# 2. 在 bugfix-branch 上进行Bug修复,进行单元测试和回归测试

# 3. 测试通过后，将Bug修复分支合并到主分支
git checkout main
git merge bugfix-branch
```

@tab 发布分支

发布分支用于准备即将发布的版本，包含最终的测试、文档更新和构建优化等工作。
```bash
# 1. 创建发布分支
git checkout -b release-1.0

# 2. 准备发布：在 release-1.0 分支上进行最终的测试、文档更新和构建优化

# 3. 准备完成后，将发布分支合并到主分支
git checkout main
git merge release-1.0

# 4. 为发布的版本打标签
git tag v1.0
git push origin v1.0
```

@tab:active 热修复分支

当生产环境中出现紧急问题时，需要快速修复并发布热修复版本
```bash
# 1. 创建热修复分支
git checkout -b hotfix-branch

# 2. 在 hotfix-branch 上进行紧急修复, 进行快速测试

# 3. 测试通过后，将热修复分支合并到主分支和当前的发布分支
git checkout main
git merge hotfix-branch
git checkout release-1.0
git merge hotfix-branch

# 4. 为热修复版本打标签
git tag v1.0.1
git push origin v1.0.1
```
:::



## 其他常用功能及命令


### 撤销本地修改

::: tabs

@tab:active 撤销/删除工作区中修改

场景描述: 已经对一些文件进行了修改，但还没有执行 `git add` 操作，这些修改还未被暂存。

- **撤销所有未暂存的修改**：
  ```sh
  git checkout -- .
  ```
  将工作目录中的所有文件恢复到最近一次提交的状态，未暂存的修改将被删除。

- **撤销特定文件的未暂存修改**：
  ```sh
  git checkout -- <file>
  ```
  将指定文件恢复到最近一次提交的状态，未暂存的修改将被删除。

@tab 撤销暂存区中的修改

场景描述：已经对一些文件进行了修改，并且已经执行了 `git add` 操作，这些修改已经被暂存。

- **撤销所有暂存区的修改**：
  ```sh
  git reset
  ```
  将所有已暂存的修改从暂存区移除，但保留工作目录中的修改。

- **撤销特定文件的暂存区修改**：
  ```sh
  git reset <file>
  ```
  将指定文件从暂存区移除，但保留工作目录中的修改。

【注意】`git rm --cached <file>`：用于从版本控制中移除文件，但仍然保留文件在本地工作区中，通常用于移除敏感文件或不再需要版本控制的文件。

@tab 撤销已提交的修改

场景描述: 已经对一些文件进行了修改，并且已经提交了这些修改。

- **撤销最后一次提交，保留工作区中的修改**：
  ```sh
  git reset HEAD~1
  ```
  撤销最后一次提交，但保留工作目录中的修改。

- **撤销最后一次提交，删除工作区中的修改**：
  ```sh
  git reset --hard HEAD~1
  ```
  撤销最后一次提交，并删除工作目录中的修改。请注意，这个操作是不可逆的。
- **彻底撤销特定提交，删除工作区中的修改**：
  ```sh
  git reset --hard <commit-hash>
  ```
  将当前分支的HEAD指针重置到指定的提交，并删除所有后续的提交和未提交的修改。请注意，这个操作是不可逆的。

- **撤销特定提交，保留工作区中的修改**：
  ```sh
  git revert <commit-hash>
  ```
  创建一个新的提交，撤销指定提交的更改。这种方法不会改变提交历史，适用于已经推送的提交。

:::







### 撤销远程修改

开发过程中发现自己提交到远程仓库的代码有问题，需要撤销

1. **找到需要撤销的提交的哈希值**：
   ```sh
   git log
   ```
   查看提交历史，找到需要撤销的提交的哈希值（例如 `abc1234`）。

2. **创建一个新的提交来撤销指定的提交**：
   ```sh
   git revert abc1234
   ```
   创建一个新的提交，撤销指定提交的更改。

3. **推送新的提交到远程仓库**：
   ```sh
   git push
   ```
   将新的提交推送到远程仓库，撤销之前的错误提交。



::: info 情景2： 远程仓库被新人提交了大量的依赖文件，需要删除

1. **通知团队成员暂停提交代码**：发送邮件或即时消息，告知团队成员暂停提交代码，直到问题解决。

2. **找到需要回退的提交的哈希值**：
   ```sh
   git log
   ```
   查看提交历史，找到需要回退到的提交的哈希值（例如 `abc1234`）。

3. **将本地分支回退到目标提交**：
   ```sh
   git reset --hard abc1234
   ```
   将本地分支回退到指定的提交，删除所有后续的提交。

4. **强制推送回退后的状态到远程仓库**：
   ```sh
   git push --force
   ```
   将本地分支的状态强制推送到远程仓库，覆盖远程仓库的历史。

5. **通知团队成员继续工作**：发送邮件或即时消息，告知团队成员可以继续提交代码，并提醒他们拉取最新的代码：
     ```sh
     git pull --rebase
     ```
:::






### git stash

`git stash` 允许你暂时保存当前工作目录中的更改，而不需要提交这些更改。这对于以下几种场景特别有用：

1. **切换任务**：当你正在开发一个功能，但突然需要切换到另一个任务时，可以使用 `git stash` 暂存当前的更改，以便稍后恢复。
2. **解决冲突**：当你需要拉取最新的代码，但本地有未提交的更改时，可以使用 `git stash` 暂存更改，然后再拉取最新的代码。

::: info git stash 基本用法

#### 1. 暂存当前更改
```sh
git stash
```
这个命令会将当前工作目录中的所有更改（包括已跟踪和未跟踪的文件）暂存起来，并将工作目录恢复到最近一次提交的状态。

#### 2. 查看暂存列表
```sh
git stash list
```
这个命令会列出所有暂存的更改。每个暂存的更改都会有一个唯一的标识符，格式为 `stash@{n}`，其中 `n` 是一个整数。

#### 3. 应用最近的暂存
```sh
git stash apply
```
这个命令会将最近一次暂存的更改重新应用到工作目录中，但不会从暂存列表中移除该暂存。

#### 4. 应用特定的暂存
```sh
git stash apply stash@{n}
```
这个命令会将指定的暂存重新应用到工作目录中，但不会从暂存列表中移除该暂存。

#### 5. 应用并移除最近的暂存
```sh
git stash pop
```
这个命令会将最近一次暂存的更改重新应用到工作目录中，并从暂存列表中移除该暂存。

#### 6. 应用并移除特定的暂存
```sh
git stash pop stash@{n}
```
这个命令会将指定的暂存重新应用到工作目录中，并从暂存列表中移除该暂存。

#### 7. 删除特定的暂存
```sh
git stash drop stash@{n}
```
这个命令会从暂存列表中删除指定的暂存。

#### 8. 删除所有暂存
```sh
git stash clear
```
这个命令会从暂存列表中删除所有的暂存。
:::


::: tip 进阶用法

#### 1. 暂存部分更改
如果你只想暂存部分更改，可以使用 `git add` 选择性地暂存某些文件或文件的部分内容，然后再使用 `git stash`。

```sh
git add file1.txt
git stash
```

#### 2. 暂存未跟踪的文件
默认情况下，`git stash` 不会暂存未跟踪的文件（即从未被 `git add` 添加过的文件）。如果你希望暂存未跟踪的文件，可以使用 `--include-untracked` 选项。

```sh
git stash --include-untracked
```

#### 3. 创建带注释的暂存
你可以为暂存添加注释，以便更好地管理和识别不同的暂存。

```sh
git stash save "这是一个临时保存的更改"
```

#### 4. 查看暂存的详细信息
你可以查看某个暂存的详细信息，包括更改的内容。

```sh
git stash show stash@{n} -p
```
:::

示例: 假设你在开发一个新的功能，但突然需要修复一个紧急的Bug。你可以按照以下步骤操作：

1. **暂存当前更改**：
   ```sh
   git stash
   ```

2. **切换到修复Bug的分支**：
   ```sh
   git checkout -b bugfix-branch
   ```

3. **修复Bug并提交**：
   ```sh
   # 进行Bug修复
   git add .
   git commit -m "Fix urgent bug"
   ```

4. **切换回原来的分支**：
   ```sh
   git checkout feature-branch
   ```

5. **恢复暂存的更改**：
   ```sh
   git stash pop
   ```

通过这些步骤，你可以轻松地在不同的任务之间切换，同时保持工作区的整洁。







### git rebase

`git rebase` 这个命令经常被人认为是一种 Git 巫术，初学者应该避而远之。

`git rebase` 和`git merge` 做的事其实是差不多的。它们都被设计来将一个分支的更改并入另一个分支，但是方式和结果有些不同。

将 master 分支合并到 feature 分支的命令：
```bash
git checkout feature
git merge master

# 或者，你也可以把它们压缩在一行里:
git merge master feature
```

![](https://image.ventix.top/img01/202201101721194.png)


you can ==rebase the feature branch onto main branch== using the following commands:
```bash
git checkout feature
git rebase main
```
rebase 会使项目历史呈现出完美的线性，但也会失去安全性和可跟踪性

::: danger The golden rule of rebasing
Rebase 的黄金法则: ==绝不要在公共的分支上使用它==。

For example:  rebased main onto feature branch
![](https://image.ventix.top/img01/202201101721628.png)
这将导致你的代码仓库中 master 分支上的所有提交都移到 feature 分支后面，但其他所有的开发者还在原来的 master 上工作，你的 master 分支和其他人的 master分支已经"分叉了"。

如果你想把 rebase 之后的 master 分支推送到远程仓库，Git 会阻止你这么做，因为两个分支包含冲突。但你可以传入 `--force` 标记来强行推送：
```bash
git push --force        # 小心 不推荐使用这个命令！
```
:::


rebase的使用场景一：

::: details 清理本地正在开发的分支
隔一段时间执行一次交互式 rebase，可以保证你的 feature 分支中的每一个提交都是专注和有意义的
```bash
git checkout feature 

# 交互式 rebase，使用feature 分支中早先的一个提交作为rebase的基(base)
git rebase -i HEAD~3
```
通过指定 `HEAD~3` 作为新的基提交，实际上没有移动分支, 只是将之后的 3 次提交重写了
![](https://image.ventix.top/img01/202201101721802.png)
`HEAD~n`: 表示从当前 HEAD 开始往前数 n 个提交。

如果你想用这个方法重写整个 feature 分支，`git merge-base` 命令非常方便地找出 feature 分支开始分叉的基:
```bash
git merge-base feature master   # 这段命令返回基提交的 ID，你可以接下来将它传给 git rebase
```
:::

- 调用 `git rebase` 的时候，你有两个基（base）可以选择：上游分支（比如 master）或者你 feature 分支中早先的一个提交


rebase的使用场景二：

::: details 将上游分支上的更改并入feature分支
rebase 到远程分支而不是 master 也是完全合理的。当你和另一个开发者在同一个 feature 分支上协作的时候，你可能会用到rebase，将别人的更改并入自己的仓库

例: 如果你和另一个开发者 都往 feature 分支上添加了几个提交，如果对方推送到了远程仓库，我们 fetch 之后，要么通过merge合并远程仓库到本地分支，要么把本地分支rebase到远程分支上。

这里的 rebase 没有违反 rebase 黄金法则，因为只有你的本地分支上的 commit 被移动了，之前的所有东西都没有变。

- `git pull` 命令默认会执行一次merge，但你可以传入`--rebase` 来强制它通过rebase来整合远程分支

:::


::: info 交互式 rebase
交互式 rebase 是 Git 中一个非常强大的功能，它允许你在提交历史中进行各种操作，比如重排、合并或编辑特定的提交。

可以通过以下命令启动交互式 rebase：

```bash
git rebase -i <branch>/HEAD~n/commitID
```

#### 编辑提交

启动后，Git 会打开一个文本编辑器，并列出一系列可操作的提交。每个提交前面都有一个命令词，默认是 `pick`，表示保留该提交。可以选择以下操作之一：

- `pick` 或 `p`: 保留提交。
- `reword` 或 `r`: 类似于 pick，但是会停下来让你修改该提交的信息。
- `edit` 或 `e`: 编辑提交。这会暂停 rebase 流程，让你有机会修改该提交的内容，包括文件更改。
- `squash` 或 `s`: 将此提交与前一个提交合并。第一个提交的信息会被保留，除非你也选择了 `fixup`。
- `fixup` 或 `f`: 类似于 squash，但它会丢弃该提交的信息，只保留更改。
- `exec` 或 `x`: 在提交上执行 shell 命令。
- `break` 或 `b`: 停止 rebase。
- `drop` 或 `d`: 删除提交。

#### 完成交互式 Rebase

完成编辑后，保存并关闭编辑器。Git 将按照你的指示执行相应的操作。对于选择了 `edit` 的提交，Git 会在应用该提交后暂停，让你有机会做进一步的修改。完成修改后，你需要继续 rebase 过程：

```bash
git add .
git rebase --continue
```

如果遇到冲突，解决冲突后也需要手动添加已解决的文件，然后继续 rebase。

:::
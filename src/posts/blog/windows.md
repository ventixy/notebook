---
article: true
date: 2021-06-03
category:
  - tool
tag:
  - CMD
  - PowerShell
  - WSL
  - Terminal
shortTitle: windows
title: Windows命令和工具
order: 1
---


## 一 CMD常用命令

###  目录和文件

1. 切换目录，产看目录文件

```bash

cd directory            # 切换目录

d:                      # 切换到 d 盘

cd /d e:\software       # 跳转到其他硬盘的其他文件夹，注意此处必须加/d参数。否则无法跳转。

dir                     # 查看当前目录下的文件，类似于linux下的ls
```

2. 创建和删除目录

```bash
# 创建目录
md 目录名（文件夹）

# 删除目录（rd 或 rmdir）
rd 目录名（文件夹）
# 强制删除文件文件夹和文件夹内所有文件
rd /s /q 盘符:\某个文件夹
```
::: info rd 或 rmdir 命令参数
- `/S`：删除指定目录及其所有子目录。
- `/Q`：安静模式，与`/S`一起使用时不会提示确认信息。
:::

3. 文件操作（复制，移动，删除）

```bash
# 复制文件：把一个文件拷贝到另一个地方。
copy 路径\文件名 路径\文件名 

# 移动文件：把一个文件移动（就是剪切+复制）到另一个地方
move 路径\文件名 路径\文件名 

# 删除文件(这个是专门删除文件的，不能删除文件夹)
del 文件名
# 强制删除文件，文件名必须加文件后缀名
del /f /s /q 盘符:\文件名 
```
::: info del命令参数
- `/F`：强制删除只读文件。
- `/Q`：安静模式，在删除文件时不提示用户确认。
- `/P`：删除每个文件之前提示用户确认。
- `/S`：删除指定目录及其子目录下的匹配文件。
- `/A`：根据属性选择要删除的文件。例如：`/A:S` 表示删除隐藏文件。
:::



<br/>

### 进程和服务

```bash
netstat -ano | findstr 8102  # 查找指定端口号的进程信息（进程ID）

taskkill /pid 45768 /f       # 强杀 指定id（45768）的进程
```

::: info taskkill命令参宿解释
`/P` [password] 为提供的用户上下文指定密码。如果忽略，提示输入。
`/F` 指定要强行终止的进程。
`/FI` filter 指定筛选进或筛选出查询的的任务。
`/PID` process id 指定要终止的进程的PID。
`/IM` image name 指定要终止的进程的映像名称。通配符 '*'可用来指定所有映像名。
`/T` Tree kill: 终止指定的进程和任何由此启动的子进程。
`/?` 显示帮助/用法。
:::


### 网络相关命令

```bash
# 用来测试网络是否畅通
ping ip(主机名)

# 查看本机ip
ipconfig
```



### 其他命令

1. 帮助命令

使用help命令，查看所有的dos命令

```bash
help
```

找到命令之后，使用 `命令+ /?` 来查看该命令下的其他属性

```bash
# 例如：查看 rd 命令的使用及参数解释
rd  /?       
```


2. 辅助符号或命令

```bash
# | 代表前一个的输出代表后一个的输入
netstat -ano|find "192.168.1.10"    # 查找特定ip的网络连接及进程号

# 重定向输出符号 > 和 >>
jstack 12912 >d:/s.txt              #  > 重定向输出并覆盖源文件 (打印线程到指定文件) 
echo hello >>c:\1.txt               #  >> 重定向输出追加到文件末尾 (在1.txt文件末尾加上hello)
```



code 



explore





### PowerShell

GitHub：https://github.com/PowerShell/PowerShell/releases/

也可以直接去官网下载： 

https://docs.microsoft.com/zh-cn/powershell/scripting/install/installing-powershell-on-windows

<br>


#### 1. SSH

使用SSH连接到远程服务器，前提是服务器已安装并启用SSH服务

```shell

# 命令格式：ssh username@hostip 如：

ssh root@192.168.5.150          # 输入密码即可

```

<br/>

####  2. new-guid



## 二 WSL/WSL2

[运行 WSL 2 的要求](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual#step-2---check-requirements-for-running-wsl-2)：
- win10
    - 对于 x64 系统：版本 1903 或更高版本，内部版本为 18362.1049 或更高版本。
    - 对于 ARM64 系统：版本 2004 或更高版本，内部版本为 19041 或更高版本。
- win11


[WSL 1 和 WSL 2 的比较](https://learn.microsoft.com/zh-cn/windows/wsl/compare-versions)


### 安装和配置

1. 启用子系统相关功能

在控制面版中打开 `启用或关闭windows功能` （或者直接在搜索框搜索`功能`），勾选 `适用于Linux的Windows子系统` 和 `虚拟机平台` 。也可以通过管理员身份打开 PowerShell，然后输入以下命令：

```bash
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

完成后重启计算机即可。成功启用功能后即可安装子系统,以及使用`wsl`相关命令

2. 安装Linux子系统

在微软商店中搜索WSL，选择所需的Linux发行版（如Ubuntu20）下载安装，安装完成启动子系统时如果出现一些`??????????`之类的符号，则需要升级Linux内核：

```bash
wsl --update
```

此时可以通过点击安装完成的Linux系统图标启动Linux子系统

根据提示设置用户名及密码即可（Ubuntu子系统的默认root密码为空）

3. 修改hostname

进入Linux子系统后，修改配置文件：

```bash
sudo vim /etc/wsl.conf
```

添加下列内容：

```bash
[network]
hostname=自己想要的主机名
generateHosts=false
```

`:wq`保存退出

::: tip 修改hosts
```bash
sudo vim /etc/hosts
```
添加下列内容：
```bash
127.0.0.1       Ubuntu22
```
:::

修改后需要重启子系统才生效，在Windows终端中使用下列命令：

```bash
wsl --shutdown

wsl
```



### WSL常用命令

1. wsl版本及配置信息

```bash
wsl --version   # WSL及其组件的版本信息

wsl --status    # wsl配置信息
```


2. 查看当前所有已安装的子系统及运行状态

```bash
wsl -l -v    # 简写
wsl --list --verbose
```

3. 设置默认wsl版本(1或2)和默认子系统(即使用wsl命令直接启动的系统)

```bash
wsl --set-default-version <Version>       # <Version> 为 1或2

wsl --set-default <Distribution Name>     # 设置默认 Linux 发行版，简写为
wsl -s <Distribution Name>

```

4. 已安装子系统的WSL版本修改

```bash
wsl --set-version Ubuntu-20.04 2          # 将 Ubuntu 20.04 发行版设置为使用 WSL 2
```



更多命令参照官网介绍：[WSL基本命令](https://learn.microsoft.com/zh-cn/windows/wsl/basic-commands)



### 启动和关闭

启动并进入某个子系统：

```bash
wsl                           # 进入默认子系统
wsl -d <Distri> <command>     # 进入名为<Distri>的子系统

# 还可以指定用户 ，<Username> 如 root
wsl -d <Distri> --user <Username> <command>
```

关闭，卸载某个子系统：

```bash
wsl --terminate <Distri>    # 关闭某个子系统, 或简写为
wsl -t <Distri>

wsl --shutdown              # 关闭所有子系统

wsl --unregister <Distri>   # 卸载某个子系统
```


### 常见操作

1. 在Windows中访问子系统中的文件：在`文件资源管理器`的输入框中输入 `\\wsl$` 回车即可

2. 关于WSL的IP地址，通过`ip addr show`或`ifconfig`查看，通常会有一个 `eth0` ，其 IP 地址是 WSL2 的虚拟机地址。Windows 主机与 WSL2 虚拟机之间有直通网络（类似于NAT模式），因此两者可以通过 `localhost` 或 WSL2 的具体 IP 地址互相访问。






## 三 Windows Terminal

Windows 终端概述 ：https://docs.microsoft.com/zh-cn/windows/terminal/



```shell

schemes 数组是用来定义配色方案的。

name ：        这个配色方案的 ID 。
background ：  背景颜色。
foreground ：  输出显示字体颜色，ssh 输入命令颜色。
black ：       箭头左边三角，git 目录的 .git 目录下提示箭头背景提示文字。
red ：         ssh 后 vim 打开文本文件已输入行普通字符显示文字。
green ：       git 目录的 .git 目录下提示箭头背景提示。
yellow ：      git 目录的分支箭头背景提示。
blue ：        目录箭头本体。
purple ：      ssh 后 vim 等工具打开文件后的 { 和 }等符号本体，git 更新完后显示的分支箭头背景提示。
cyan ：        引号及内部字符。
white ：       未知。
brightBlack ： cd 等 命令后面的 .. 和 * 等特殊符号，以及命令参数字符颜色。
brightRed ：   系统提示字符颜色：错误的命令，git status 显示。
brightGreen ： ssh 用户权限显示。
brightYellow ：输入的命令字符。
brightBlue ：  ssh 文件夹等高亮显示，ssh 目录，vim 打开文本文件未输入行 ~ 字符显示。
brightPurple ：未知。
brightCyan ：  ssh vim 等工具打开文件后的 { 和 } 等符号背景。
brightWhite ： 目录箭头左边和中间的提示文字。

"cursorColor": 光标颜色

```

<br/>

### Oh-My-Posh

官方文档和介绍：https://www.powershellgallery.com/packages/oh-my-posh

在Windows terminal中安装Oh-My-Posh：https://ohmyposh.dev/docs/installation/windows

<br>

**第一步：安装 oh-my-posh** ：

以管理员方式打开 PowerShell  （注意网络不好可能会安装失败）

```shell
winget install JanDeDobbeleer.OhMyPosh -s winget
```

![](https://image.ventix.top/img01/202101101748981.png)

<br/>


**第二步：安装和设置字体**：https://ohmyposh.dev/docs/installation/fonts

上述地址中介绍了 oh-my-posh 提供了在 powershell中选择安装字体的方式，如下：
```bash
oh-my-posh font install
```
但是效果还不稳定，会出现字体安装不全的情形。所以字体安装还是以自行下载安装为主：

下载地址：https://www.nerdfonts.com/ ，建议安装 [Nerd Font](https://www.nerdfonts.com/font-downloads)

推荐使用 **DejaVuSansMono Nerd Font** 或者 **Cousine Nerd Font**，这两款字体比较全，适配也还不错。

下载后解压安装字体即可

**设置字体**：（修改JSON或在terminal界面中直接设置）

用管理员身份打开Powershell(Windows Terminal)，在设置界面中打开 `settings.json` ，

在 `"defaults"：{}`的括号里面写Font.face的内容：

```json
    "profiles":
    {
        "defaults": 
        {
            "font": 
            {
                "face": "MesloLGM NF"
            }
        },
    }
```

<br/>

**第三步：oh-my-posh相关配置** ：

安装成功后进行初始化设置, 若想要配置永久生效，需要修改对应的配置文件：
```shell
code $profile   
```
该命令会使用VScode打开文件，将下面的初始化命令加入其中即可 （配置后每次打开Powershell都会执行脚本文件中的命令）

```shell
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\kali.omp.json" | Invoke-Expression
```

然后输入下面的命令，来让配置生效：
```shell
. $PROFILE
```

上面过程中kali是主题的一种，如果要其他主题的话，那么在命令行里面输入：

```bash
Get-PoshThemes
```

选一个喜欢的，比如喜欢jandedobbeleer这个主题，按上面的步骤把$PROFILE里面的`"kali.omp.json"`改成`"jandedobbeleer.omp.json"`就行了。
在这个过程中很可能会出现一些图标不显示，显示一半，或者各种方框乱码，一般都是字体的问题，安装字体, 多重启windows Terminal几次即可。

<br>

设置命令行自动补全和提示：
```shell
Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete
```

<br/>

### 毛玻璃特效

下载字体：https://github.com/microsoft/cascadia-code/releases

解压后安装所有 ttf 字体 （为所有用户安装）

修改 JSON 文件：

```JSON
{
    "commandline": "gsudo.exe powershell.exe -nologo",
    // "commandline": "powershell.exe",
    "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
    "hidden": false,
    "name": "Windows PowerShell",
    // 添加如下内容
    "acrylicOpacity": 0.7,
    "colorScheme" : "Frost",
    "cursorColor" : "#000000",
    "fontFace" : "Cascadia Code PL",
    "useAcrylic": true
}
```

详细内容参照官网：[Windows 终端中的毛玻璃主题](https://learn.microsoft.com/zh-cn/windows/terminal/custom-terminal-gallery/frosted-glass-theme) 

<br>

### 安装gsudo

gsudo：管理员打开工具

GitHub：https://github.com/gerardog/gsudo

<br/>

```shell
# 安装方式：

1. Github下载msi格式，安装即可，或下载zip格式，解压配置环境变量即可

https://github.com/gerardog/gsudo/releases/tag/v1.2.0


2. 通过 PowerShell 命令安装

winget install gsudo

```

Windows terminal默认是非管理员打开的，安装 gsudo 后 在powershell 或cmd设置项下将命令行改为

```shell
gsudo.exe powershell.exe -nologo  #或

gsudo.exe cmd.exe 
```

`-nologo`  参数作用是去掉启动时前面那一串版权声明等信息, 可以不加

如果不想要默认管理员打开, 上面命令行处可以不改, 在需要管理员权限的命令前加上sudo再运行就可以, 跟Linux一样



<br/>



### 添加GitBash

从设置  `打开JSON文件` ，在 ` "profiles" --> "defaults"  -->  "list"` 中添加新的配置：

```JSON
"profiles": 
{
    "defaults": {},
    "list": 
    [
        {
            "guid": "{b453ae62-4e3d-5e58-b989-0a998ec441b7}",
            "hidden": false,
            "name": "Git Bash",
            "commandline": "gsudo \"C:\\Program Files\\Git\\bin\\bash.exe\"",
            "colorScheme":"One Half Dark",
            "icon": "C:\\Program Files\\Git\\mingw64\\share\\git\\git-for-windows.ico"
        }

    ]
}
```

注意： commandline 中 需要的是git安装目录下的  bin 下的 bash.exe，而不是 Git-Bash.exe

<br/>

### SSH免密自动登陆

**第一步 在本地生成SSH密钥对**：

powershell中输入以下命令，根据提示设置密钥保存路径、密钥密码（默认为空），建议按默认设置，一直按回车成功生成密钥文件，生成的密钥文件共有两个，ssh_key对应私钥可存储在本地，ssh_key.pub对应公钥需要放在到远程服务器

```bash
ssh-keygen -t rsa
```
![](https://image.ventix.top/img01/202101101750804.png)

**第二步 在远程主机安装公钥**：

将上面生成的公钥文件上传至远程主机即可（注意需要远程主机存在相应的目录及权限）：

```bash
sftp root@192.168.10.11             # 回车输入密码

# put 本地公钥文件 远程主机目录(默认以家目录开头)
sftp> put C:\Users\Administrator/.ssh/id_rsa.pub .ssh/  

# 上传完成后使用 exit 退出
sftp> exit
```
比如这里就需要在远程主机的家目录 先创建 `.ssh` 目录才能上传 ：`mkdir -m 700 ~/.ssh `

![](https://image.ventix.top/img01/202101101750738.png)

**连接到远程主机，修改密钥及所在文件夹权限**
```bash
chmod -R 700 ~/.ssh        #如此文件夹已存在，也要确保权限为700

cd .ssh
chmod 600 id_rsa.pub       #cd 密钥.pub所在目录，然后设置其权限

sudo mv ~/.ssh/id_rsa.pub ~/.ssh/authorized_key_from_mywindows
```

**第三步 在远程主机打开密钥登陆功能** (编辑sshd配置文件)
```bash
sudo vim /etc/ssh/sshd_config

RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_key_from_mywindows
PermitRootLogin yes
PasswordAuthentication no #此行会关闭密码登录功能，请确认密钥登陆功能设置好后再添加
```
以上内容在配置文件里都有对应行，但被注释了起来，可通过删除注释符号设置，也可直接追加到文件末尾，配置完成后重启sshd：

```bash
systemctl restart sshd
```

**第四步 设置WindowsTerminal的SSH快捷方式**

在WindowsTerminal配置文件里增加内容，复制完之后更改配置如下，主要必须更改如下参数，其余按需修改
```bash
ssh -i  C:\Users\Administrator/.ssh/id_rsa root@192.168.10.11
```

重启窗口打开即可使用（无需输入密码）

<br>





## 四 常见问题及解决方法


### 禁止运行脚本

例如：终端显示“pnpm : 无法加载文件 C:\Program Files\nodejs\npm.ps1，因为在此系统上禁止运行脚本”

使用管理员方式打开 `PowerShell`:

```bash
# 查询状态, 返回 Restricted 说明状态是禁止的
get-ExecutionPolicy

# 更改状态
set-ExecutionPolicy RemoteSigned

# 如果提示需要管理员权限，可加参数运行
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```



### 激活及其他工具

图吧工具箱：https://www.tbtool.cn/

Office下载工具：https://www.officetool.plus/zh-cn/

::: tip Activator
GitHub：https://github.com/zbezj/HEU_KMS_Activator/releases

夸克网盘：https://pan.quark.cn/s/1e265d309856

百度网盘: https://pan.baidu.com/s/1xv4Y9WN2JHyJ5RdupC44mw 提取码: yqrn
:::


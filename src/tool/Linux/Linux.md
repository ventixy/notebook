---

order: 10
title:  Linux常用命令
shortTitle: Linux命令
icon: linux01

---

VM和Linux的安装参照：[VM和Linux](/posts/blog/vm.md)，[WSL2](/tool/usual/windows.md#二-wsl-wsl2)

一些在线网站：[鸟哥的 Linux 私房菜 基础学习篇](http://cn.linux.vbird.org/linux_basic/linux_basic.php) , [鸟哥的 Linux 私房菜 服务器架设篇](http://cn.linux.vbird.org/linux_server/)


## Linux的常见命令

### Linux命令基础

介绍Linux的命令提示符，查看命令的帮助信息，查看系统及硬件信息，语言设置以及关机重启命令

::: info Linux基础
#### 1. 命令行提示符

Linux命令行结尾的提示符有 “#” 和 “$” 两种不同的符号

```shell
[root@hostname ~]#        # <==这是超级管理员root用户对应的命令行。
[hostname@hostname ~]$    # <==这是普通用户oldboy对应的命令行。
```

> 命令行提示符@前面的字符代表当前登录的用户（可用whoami查询）
>
> @后面的为主机名（可用hostname查询）



<br/>

Linux命令提示符由PS1环境变量控制

```shell
set|grep PS1            # 注意PS要大写

> PS1='[\u@\h \W]\$ '   # 可以通过全局配置文件/etc/bashrc或/etc/profile进行按需配置和调整
```



<br/>



#### 2. 查看命令帮助

  ==使用 man 或 --help 获取命令帮助信息==：

man命令是Linux系统中最核心的命令之一，因为通过它可以查看其他Linux命令的使用信息。

当然了，man命令不仅可以查看命令的使用帮助，还可以查看软件服务配置文件、系统调用、库函数等的帮助信息



```shell
man ls                        # 使用man 产看 ls 相关的信息

ls --help                     # --help 虽然有时这个输出很简单，但是相应地查看起来也会更方便
```

工作中建议结合使用，“命令--help”获取的是常用的帮助信息，“man命令”获取的是更多更复杂的帮助信息

<br/>



 ==使用help命令==：

在Linux系统里有一些特殊的命令，它们就是bash程序的内置命令，例如 `cd、history、read` 等，这些命令在系统目录里不存在真实的程序文件（存在于bash程序里），对于这部分命令，查看帮助的方法就是使用help命令

```shell
help cd            # 如果使用man cd，那么通常是查不到帮助信息的，而是会进入bash的帮助页面
```

<br/>



  ==使用info获取帮助信息==：

Linux系统中的info命令是一个查看程序对应文档信息的命令，可以作为man及help命令的帮助补充，不过一般在企业运维工作中，很少会有机会需要使用info去查询命令的使用帮助，因此，知道有这个命令就可以了，普通读者无需关注太多。使用info命令查看命令帮助的语法操作和man类似



<br/>






#### 3. 查看系统信息

linux查看cpu、内存、版本信息

```shell
# 查看CPU信息
cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c 
cat /proc/cpuinfo | grep physical | uniq -c 

getconf LONG_BIT   
#32 (说明当前CPU运行在32bit模式下, 但不代表CPU不支持64bit) 

dmidecode | grep "Product Name"    # 查看机器型号 

lsb_release -a  # 查看操作系统版本


# 查看内存信息
free
cat /proc/meminfo  # 查看详细内存信息 

```



<br/>

#### 4. Linux语言设置

```shell
locale                  # 查看当前使用的语言
locale -a               # 查看系统中可以使用的语言

vi /etc/locale.conf     # 修改以下内容（LANG="zh_CN.UTF-8" ==> LANG="en_US.UTF-8" ）

#LANG="zh_CN.UTF-8"
LANG="en_US.UTF-8"


```
:::



::: details 关机/重启/注销

 ==重启或关机命令：shutdown== 

shutdown是一个用来安全关闭或重启Linux系统的命令，系统在关闭之前会通知所有的登录用户，系统即将关闭，此时所有的新用户都不可以登录，与shutdown功能类似的命令还有init、halt、poweroff、reboot。

1）注意shutdown命令和后面的选项之间至少要有一个空格。

2）通常情况下，我们执行的shutdown命令为 `shutdown -h now` 或 `shutdown -r now`。



![](https://image.ventix.top/img01/202101101729451.png)



> shutdown命令的工作过程就是当用户执行了对应参数并附带关机时间的命令之后，
>
> 通知所有用户即将关机的信息，并且在这个时间段内禁止新用户登录，
>
> 仅当到了指定的关机时间时，shutdown命令才会根据所接收的参数选项，发送请求给系统的init进程，请求将系统调整到对应参数的状态（例如-h参数），系统关机状态实际上对应的是Linux系统里的运行级别0。
>
> 和系统关机相关的运行级别有：0（关机运行级别）-halt，6（重启运行级别）-reboot，更多相关内容可查看/etc/inittab文件。



<br/>

 ==关机与重启命令：halt/poweroff/reboot==：

从RedHat或CentOS 6开始，你会发现halt、poweroff、reboot这三个命令对应的都是同一个man帮助文档，而halt和poweroff命令是reboot命令的链接文件，通常情况下，我们执行这三个命令时都不带任何参数。

> 为什么halt、poweroff命令是reboot命令的链接文件，但是分别执行命令后效果不一样呢？
>
> 查看一下reboot命令的man帮助，可以发现reboot命令有2个参数--halt和--power-off，作用分别和halt、poweroff命令一样。

<br/>

![](https://image.ventix.top/img01/202101101729509.png)
:::



### cd/pwd/ls

 ==cd：切换目录==：cd命令是 “change directory” 中每个单词的首字母缩写，其功能是从当前工作目录切换到指定的工作目录。

```shell
cd -                 # 返回当前用户上一次所在的目录
cd ..                # 切换到当前目录的上一级目录
cd ~                 # 进入当前用户的家目录
```

<br/>


==pwd：显示当前所在的位置== ：pwd命令是 “print working directory” 中每个单词的首字母缩写，其功能是显示当前工作目录的绝对路径。


在实际工作中，我们在命令行操作命令时，经常会在各个目录路径之间进行切换，此时可使用pwd命令快速查看当前我们所在的目录路径。



<br/>

ls 命令是Linux下最常用的指令之一。==ls：显示目录下的内容及相关属性信息==：

- ls命令可以理解为英文单词list的缩写，其功能是列出目录的内容及其内容属性信息（list directory contents）。

- 该命令有点类似于DOS系统下的dir命令，有趣的是，Linux下其实也有dir命令，但我们更习惯于使用ls。

ls命令常用参数：

| 常用参数 | 参数说明                                         |
| :------: | ------------------------------------------------ |
|    -a    | 显示所有文件及目录 (包括以“.”开头的隐藏文件)     |
|    -l    | 使用长格式列出文件及目录信息  （有时可以使用 `ll` 命令代替 `ls -l`）                    |
|    -r    | 将文件以相反次序显示(默认依英文字母次序)         |
|    -t    | 根据最后的修改时间排序                           |
|    -A    | 同 -a ，但不列出 “.” (当前目录) 及 “..” (父目录) |
|    -S    | 根据文件大小排序                                 |
|    -R    | 递归列出所有子目录                               |

stat命令：用于显示文件的状态信息。stat命令的输出信息比ls命令的输出信息要更详细


<br>



### mkdir/touch

 ==mkdir：创建目录==：mkdir命令是“make directories”中每个单词的粗体字母组合而成，其功能是创建目录，默认情况下，如果要创建的目录已存在，则会提示此文件已存在；而不会继续创建目录。

```shell
mkdir dir1 dir2                # mkdir命令可以同时创建多个目录

# 使用-p参数递归创建目录, 加-v参数显示创建目录的过程(其实这个-v没有什么实际用途)
mkdir -p dir/test
mkdir -pv dir/test
```

使用mkdir创建多级目录时，建议直接使用-p参数，可以避免出现“No such file or directory”这样没有文件或目录的报错了，不会影响已存在的目录。

<br/>

同时创建多个目录及多级子目录 (注意大括号内不能有空格)
```shell
mkdir -pv dir/{dir_1,dir_2}/{dir_a,dir_b}

```



<br/>



 ==touch：创建空文件或改变文件的时间戳属性==：

touch命令有两个功能：一是创建新的空文件；二是改变已有文件的时间戳属性。

![](https://image.ventix.top/img01/202101101730679.png)

```shell
touch a.txt b.txt          # 创建多个文件

touch log{01..05}          # log01  log02  log03  log04  log05  (注意是两个点)
```

<br/>


::: tip 修改文件时间

- **modifiy time (mtime)**：当该文件的『内容』变更时，就会升级这个时间！内容数据指的是文件的内容，而不是文件的属性或权限喔！

- **changetime (ctime)**： 当该文件的『状态 (status)』改变时，就会升级这个时间，举例来说，像是权限与属性被更改了，都会升级这个时间啊。

- **access time (atime)**：当『该文件的内容被读取』时，就会升级这个读取时间 (access)。举例来说，我们使用 `cat` 去读取 `/etc/man_db.conf`， 就会升级该文件的 atime 了。

```shell
ls -l 文件名                      # 查看 mtime
ls -l --time=ctime 文件名         # 查看 ctime
ls -l --time=atime 文件名         # 查看 atime
```

![](https://image.ventix.top/img01/202101101731453.png)


touch：将某个文件的所有日期更新为系统当前时间， 或将(mtime 与 atime)修改为指定时间 

![](https://image.ventix.top/img01/202101101731191.png)

![](https://image.ventix.top/img01/202101101732079.png)
:::


change time 只能通过修改系统时间来自定义（但是一般情况下修改系统时间需要root权限）
::: details 通过改变系统时间来修改change time 
```shell

[root@DevMachine temp]# date -s 06/06/2022 >> a.bash

# 文件的atime和mtime已经改变，但是ctime时间没变
[root@DevMachine temp]# stat a.bash
  File: ‘a.bash’
  Size: 29              Blocks: 8          IO Block: 4096   regular file
Device: fd00h/64768d    Inode: 67415159    Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Context: unconfined_u:object_r:admin_home_t:s0
Access: 2022-03-03 23:23:00.000000000 +0800
Modify: 2022-06-06 00:00:00.000000000 +0800
Change: 2022-06-06 00:00:00.000000000 +0800
 Birth: -
 
#此时系统时间已经改变
[root@DevMachine temp]# date "+%F %T"
2022-06-06 00:00:56

# 更新系统时间为正常时间
[root@DevMachine temp]# /usr/sbin/ntpdate ntp.api.bz
 1 Apr 11:21:35 ntpdate[1803]: step time server 114.118.7.161 offset -5661630.439834 sec

# 系统时间已经更新正常
[root@DevMachine temp]# date "+%F %T"
2022-04-01 11:21:44

# 系统时间已经还原，ctime修改已完成
[root@DevMachine temp]# stat a.bash
  File: ‘a.bash’
  Size: 29              Blocks: 8          IO Block: 4096   regular file
Device: fd00h/64768d    Inode: 67415159    Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Context: unconfined_u:object_r:admin_home_t:s0
Access: 2022-03-03 23:23:00.000000000 +0800
Modify: 2022-06-06 00:00:00.000000000 +0800
Change: 2022-06-06 00:00:00.000000000 +0800
 Birth: -
 
```
:::




### cp/mv/rm

==cp：复制文件或目录==: cp命令可以理解为英文单词copy的缩写，其功能为复制文件或目录。

![](https://image.ventix.top/img01/202101101733552.png)

```shell
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.ori
```

|          写法           |        `target` 是目录         |   `target` 是文件或不存在   |
| ---------------------- | ----------------------------- | -------------------------- |
| `cp -r source target`  | `source` 复制到 `target/`      | `source` 重命名为 `target` |
| `cp -r source target/` | `source` 复制到 `target/`      | 错误，`target/` 无效        |
| `cp -r source/ target` | `source/` 内容复制到 `target/` | 错误，`target` 无效         |





<br/>

==mv：移动或重命名文件==: mv命令可以理解为英文单词move的缩写，其功能是移动或重命名文件（move/rename files）

```shell
mv a.txt b.txt             # 若b.txt 不存在，则将 a.txt 重命名为 b.txt
```
|         写法         |        `target` 是目录         |   `target` 是文件或不存在   |
| ------------------- | ----------------------------- | -------------------------- |
| `mv source target`  | `source` 移动到 `target/`      | `source` 重命名为 `target` |
| `mv source target/` | `source` 移动到 `target/`      | 错误，`target/` 无效        |
| `mv source/ target` | `source/` 内容移动到 `target/` | 错误，`target` 无效         |



<br/>

==rm：删除文件或目录==: rm命令可以理解为英文单词remove的缩写，其功能是删除一个或多个文件或目录（remove files or directories）。这是Linux系统里最危险的命令之一，请慎重使用。

![](https://image.ventix.top/img01/202101101734001.png)

```shell
rm -rf ./kubernetes/dashboard/*      # 递归强制删除dashboard目录内部文件和目录
rm -rf ./kubernetes/dashboard        # 删除dashboard整个目录(包括内部文件目录) 等同于：
rm -rf ./kubernetes/dashboard/
```


<br/>

==rmdir：删除空目录==: rmdir命令用于删除空目录（remove empty directories），当目录不为空时，命令不起作用。rmdir命令在实际工作中使用的极少






### 查看文件内容

  ==cat、tac、nl 直接查看文件内容== : 

- cat 由第一行开始显示文件内容，cat 是 Concatenate （连续）的简写
- tac 从最后一行开始显示，可以看出 tac 是 cat 的倒著写！
- nl  显示的时候，顺道输出行号！

这些命令在文件行数较多时使用并不方便、推荐使用下面介绍的 more 和 less

::: info more 和 less 

 more、less 不仅可以分页查看文件，less还支持文件内容搜索

- **more**: 一页一页的显示文件内容

  ```shell
  空白键 (space)  ：代表向下翻一页；
  Enter          ：代表向下翻『一行』；
  /字串           ：代表在这个显示的内容当中，向下搜寻『字串』这个关键字；
  :f             ：立刻显示出档名以及目前显示的行数；
  q              ：代表立刻离开 more ，不再显示该文件内容。
  b 或 [ctrl]-b  ：代表往回翻页，不过这动作只对文件有用，对管线无用。
  ```

- **less**: 命令是一个更强大的分页查看工具，提供了更多的功能和灵活性。还可以往前翻页！

  ```shell
  空白键       ：向下翻动一页；
  [pagedown]  ：向下翻动一页；
  [pageup]    ：向上翻动一页；
  /字串        ：向下搜寻『字串』的功能；
  ?字串        ：向上搜寻『字串』的功能；
  n           ：重复前一个搜寻 (与 / 或 ? 有关！)
  N           ：反向的重复前一个搜寻 (与 / 或 ? 有关！)
  q           ：退出 less 这个程序；
  ```
  - 前进/后退，翻页
    - `空格键`/ `pagedown`：显示下一屏内容。
    - `b`/ `pageup`：回退一屏内容。
    - `d`：向前翻半屏。
    - `y`：向上翻半屏。
    - `Enter`：显示下一行内容。
  - 搜索字符串
    - `/`：搜索字符串。
    - `?`：反向搜索字符串。
    - `n`：重复上一次搜索。
    - `N`：反向重复上一次搜索。
  - `g`：跳到文件开头。
  - `G`：跳到文件结尾。
  - `h`：显示帮助信息。
  - `q`：退出 `less` 命令。
```bash
less -N content.txt     # 显示文件内容并显示行号
```
:::


<br/>

  ==head、tail 从头（尾）查看文件（指定行数）== : 		

- head  只看头几行 （若没有加上 -n 这个选项时，默认只显示十行）
- tail     只看尾巴几行 （默认也是显示十行，若要显示非十行，就加 -n number 的选项即可）

```shell

head -n 1 /etc/my.cnf            # 查看第一行文件

tail -n +100 /etc/man_db.conf    # 代表该文件从100行以后都会被列出来

```

例：假如想要显示 /etc/man.config 的第 11 到第 20 行呢？

```shell 
# 取前 20 行，再取后十行，所以结果就是：
head -n 20 /etc/man_db.conf | tail -n 10 
```



<br/>



### 压缩和打包

`tar` 命令用于打包和解包文件，但它本身并不进行压缩。通常与 `gzip`、`bzip2` 或 `xz` 结合使用来实现压缩。

```sh
# 打包并使用 gzip 压缩
tar -czvf archive.tar.gz file1.txt file2.txt mydirectory

# 打包并使用 bzip2 压缩
tar -cjvf archive.tar.bz2 file1 file2 directory  

# 打包并使用 xz 压缩
tar -cJvf archive.tar.xz file1 file2 directory  


# 解压 gzip 压缩的 tar 归档文件
tar -xzvf archive.tar.gz  

# 解压 bzip2 压缩的 tar 归档文件
tar -xjvf archive.tar.bz2  

# 解压 xz 压缩的 tar 归档文件
tar -xJvf archive.tar.xz  
```
::: tip 常见参数解释
  - `-c`: 创建一个新的归档文件, `tar -c` 用于指定创建归档文件
  - `-v`:  显示详细信息，即在执行过程中显示处理的文件名。
  - `-f`: 指定归档文件的名称, `tar -f archive.tar` 用于指定归档文件的名称为 `archive.tar`
  - `-x`:  从归档文件中提取文件。`tar -x` 用于从归档文件中提取文件
:::

`gzip`、`bzip2` 和 `xz` 可用于单独压缩文件（单个文件）:
```bash
# 使用 gzip 单独压缩文件
gzip file.txt  # 压缩 file.txt，生成 file.txt.gz

# 使用 gzip 解压文件
gunzip file.txt.gz  # 解压 file.txt.gz，恢复为 file.txt
```

| 特性           | gzip                    | bzip2                     | xz                              |
|----------------|----------------------|----------------------------|-------------------------------|
| 压缩/解压速度       | 最快                            | 适中                       | 慢                      |
| 压缩比(以文本为例)   | 适中 (50% 到 70%)       | 高 (30% 到 50%)      | 最高 (20% 到 40%)     |
| 内存占用情况  | 低                         | 中等                  | 高，尤其是在高压缩级别下                   |





### 追加与重定向

在 Linux 中，重定向和追加是用于控制命令输出的重要机制。通过重定向，可以将命令的标准输出（stdout）或标准错误（stderr）重定向到文件或其他流中。通过追加，可以将输出添加到文件的末尾，而不是覆盖现有内容。

```bash
echo "Hello, World!" > greeting.txt           # 输出重定向 (Output Redirection)
ls non_existent_file 2> error_log.txt         # 错误重定向 (Error Redirection)
ls non_existent_file &> combined_log.txt      # 同时重定向 stdout 和 stderr

echo "Another line" >> greeting.txt           # 输出追加 (Append Output)
ls non_existent_file 2>> error_log.txt        # 错误追加 (Append Error)
ls non_existent_file &>> combined_log.txt     # 同时追加 stdout 和 stderr
```

::: info 重定向 (Redirection) 与 追加 (Appending)
#### 重定向 (Redirection)
重定向：如果文件不存在，那么会创建文件。如果文件已经存在，那么会覆盖文件中的内容
- 输出重定向 (`>`)：将标准输出重定向到文件，覆盖现有内容。
- 错误重定向 (`2>`)：将标准错误重定向到文件，覆盖现有内容。
- 同时重定向 stdout 和 stderr (`&>`)：将标准输出和标准错误重定向到同一个文件，覆盖现有内容。

#### 追加 (Appending)
追加：如果文件不存在，依然会创建文件。文件已存在时不会覆盖原来文件中的内容

- 输出追加 (`>>`)：将标准输出追加到文件的末尾，不覆盖现有内容。
- 错误追加 (`2>>`)：将标准错误追加到文件的末尾，不覆盖现有内容。
- 同时追加 stdout 和 stderr (`&>>`)：将标准输出和标准错误追加到同一个文件的末尾，不覆盖现有内容。
:::



### 文件权限管理

Linux里面，任何一个文件都具有『`User`, `Group`及`Others`』三种身份的权限

![](https://image.ventix.top/img01/202101101735327.png)

`rwx`这三个参数对文件和目录的意义是不同的，如下：

| 文件/目录权限参数 |      文件       |               目录               | 对应权限分数 |
| :--: | :-------------: | :------------------------------: | :------: |
|  r   |   可读(read)    |  r (read contents in directory)  |    4     |
|  w   |   可写(write)   | w (modify contents of directory) |    2     |
|  x   | 可执行(execute) |       x (access directory)       |    1     |

::: info 权限参数 rwx 在文件目录中的区别
#### 在文件中的含义
- r (read)：     可读取此文件的实际内容，如读取文本文件的文字内容等；
- w (write)：    可以编辑、新增或者是修改该文件的内容(但不含删除该文件)；
- x (execute)：  该文件具有可以被系统执行的权限。

#### 在目录中的含义
- **r (read contents in directory)**：表示具有读取目录结构列表的权限，所以当你具有读取(r)一个目录的权限时，表示你==可以查询该目录下的文件名数据==。 所以可以利用 ls 这个指令将该目录的内容列表显示出来！

- **w (modify contents of directory)**：可写入权限对目录来说表示你具有操作该目录结构列表的权限，也就是底下这些权限：
    - 建立新的文件与目录；
    - 删除已经存在的文件与目录(不论该文件的权限是什么！)
    - 将已存在的文件或目录进行更名；
    - 移动该目录内的文件、目录位置。

- **x (access directory)**：目录不可以被执行，目录的x代表的是==用户能否进入该目录使其成为工作目录==！ 所谓的工作目录(work directory)就是你目前所在的目录！举例来说，当你登入Linux时， 你所在的家目录就是你当下的工作目录。而变换目录的指令是『cd』(change directory)
:::



**修改文件的权限**:  `chmod`
::: warning chmod 修改文件/目录权限
方式一：明确列出三种身份对应的权限
```shell
sudo chmod u=rwx,g=rw,o=r fileName
# u：表示文件拥有者， g：表示同组的成员， o：表示其他组的成员
```


方式二：通过数字来指代权限
```bash
sudo chmod 764 fileName
```
:::

例1：如果要将该文件变成可执行文件，并且不让其他人修改的话， 那么就需要 `-rwxr-xr-x` 这样的权限，即 `chmod 755 test.sh`

例2：如果有些文件你不希望被其他人看到，那么应该将文件的权限设定为： `-rwxr-----` ， 即 `chmod 740 filename` 


### 用户和用户组

用户管理：用户管理涉及创建、修改、删除用户账户，以及管理用户的密码和权限

::: info 用户管理
1. 创建用户命令：`useradd`

```bash
sudo useradd -m -s /bin/bash username         

# 添加用户的时候指定组
sudo useradd -m -s /bin/bash -g groupName username
```
   `-m`：         指创建用户逇同时给这个用户创建一个家目录
   `-s`:          指定shell的版本为bash
 
2. 查看用户信息和切换用户： `id` ， `su`

```bash
id john        # 查看用户 john 的 UID、GID 和所属组等信息
 
su username    # 切换到指定用户
```

3. 修改用户信息和密码

```bash
usermod -aG sudo john       # 将用户 john 添加到 sudo 组
usermod -s /bin/bash john   # 修改用户 john 的默认 shell 为 /bin/bash

passwd john                 # 设置用户 john 的密码
```

4. 删除用户： `groupdel`

```bash
userdel john          # 删除用户 john
userdel -r john       # 删除用户 john 并删除其主目录
```
:::


组管理：用户组管理涉及创建、修改、删除用户组，以及管理用户组的成员

::: tip 用户组管理
```shell
sudo groupadd groupName     # 添加组

getent group developers     # 查看用户组信息
groups john                 # 查看用户所属组

# 修改用户组信息
groupmod -n newgroup oldgroup  # 将用户组 oldgroup 重命名为 newgroup

groupdel developers         # 删除用户组
```
:::



## 进程与服务管理

### Linux进程管理

Linux 进程管理涉及启动、停止、监控和管理运行中的进程。

::: info 查看进程状态
- `ps`：显示当前系统的进程状态。
  - -e 显示所有的进程
  - -f 全格式
  - -a 表示显示终端上所有的进程
  - -u 以用户的格式来显示进程信息
  - -x 显示后台运行的进程
- `top`：动态显示系统中进程的资源使用情况。
- `htop`：类似于 `top`，但提供了更丰富的交互式界面。
```sh
ps -ef  可以显示父进程的信息
ps aux  可以显示进程占用的资源信息

# 搜索进程（常用）
ps -ef | grep 进程名或进程id
ps aux | grep 进程名或进程id


# 使用 top 命令实时查看进程
top  # 实时显示系统中进程的资源使用情况

# 使用 htop 命令实时查看进程（需要安装）
htop  # 实时显示系统中进程的资源使用情况
```
:::


**启动进程**: 
```sh
# 前台启动
./script.sh  # 在前台启动脚本

# 后台启动
./script.sh &  # 在后台启动脚本

# 使用 nohup 命令在后台启动并使其在终端关闭后继续运行
nohup ./script.sh &  # 在后台启动脚本，并使其在终端关闭后继续运行
```

**终止进程**：
```sh
# 使用 kill 命令终止进程
kill 1234     # 发送 SIGTERM 信号终止 PID 为 1234 的进程
kill -9 1234  # 发送 SIGKILL 信号强制终止 PID 为 1234 的进程

# 使用 pkill 命令终止进程
pkill script.sh  # 终止所有名为 script.sh 的进程

# 使用 killall 命令终止进程
killall script.sh  # 终止所有名为 script.sh 的进程
```

**控制进程优先级**:
```sh
# 使用 nice 命令启动进程并设置优先级
nice -n 10 ./script.sh  # 启动脚本并设置优先级为 10

# 使用 renice 命令更改进程优先级
renice -n 10 -p 1234  # 将 PID 为 1234 的进程优先级设置为 10
```


  




### Linux服务管理

在Linux系统中，服务管理是一个非常重要的任务，涉及到启动、停止、重启、查看状态等操作。传统的Linux系统使用 `init` 作为初始化进程，而近年来，越来越多的Linux发行版转而使用 `systemd` 作为初始化系统。

- **init 系统**：服务通过 `/etc/init.d/` 下的脚本进行管理，命令相对简单。
- **systemd 系统**：服务通过 `systemctl` 命令进行管理，提供了更多的功能和灵活性。

如果不确定当前系统使用的是哪种初始化系统，可以通过以下命令来确认：

```sh
cat /proc/1/comm
```

如果输出是 `systemd`，则当前系统使用的是 `systemd` 初始化系统。如果输出是 `sysvinit` 或其他类似的字符串，则当前系统使用的是传统的 `init` 系统。



::: tabs

@tab init服务管理

在使用 `init` 系统的传统Linux发行版中，服务通常通过 `/etc/init.d/` 目录下的脚本来控制。服务脚本通常遵循一定的命名规则，例如 `service_name.sh`。 常见命令：

- **启动服务**：
  ```sh
  /etc/init.d/service_name start
  ```

- **停止服务**：
  ```sh
  /etc/init.d/service_name stop
  ```

- **重启服务**：
  ```sh
  /etc/init.d/service_name restart
  ```

- **重新加载配置文件**：
  ```sh
  /etc/init.d/service_name reload
  ```

- **查看服务状态**：
  ```sh
  /etc/init.d/service_name status
  ```

- **设置服务开机启动**：
  在 `init` 系统下，可以使用 `chkconfig`（对于支持 `chkconfig` 的发行版）或手动编辑 `/etc/rc.local` 文件来设置服务开机启动。

  ```sh
  chkconfig --add service_name
  chkconfig service_name on
  ```

示例：假设我们要管理名为 `nginx` 的服务：

```sh
/etc/init.d/nginx start
/etc/init.d/nginx stop
/etc/init.d/nginx restart
/etc/init.d/nginx status
```

在一些 Linux 发行版中，可以使用 service 命令来管理服务，这可以简化命令：
```bash
sudo service nginx start
sudo service nginx stop
sudo service nginx restart
sudo service nginx status
```

@tab:active systemd服务管理

`systemd` 是一种现代化的初始化系统，提供了更为丰富的功能和更精细的服务控制。在使用 `systemd` 的Linux发行版中，服务由 `.service` 文件控制，通常位于 `/lib/systemd/system/` 或 `/etc/systemd/system/` 目录下。常见命令：

- **启动服务**：
  ```sh
  sudo systemctl start service_name.service
  ```

- **停止服务**：
  ```sh
  sudo systemctl stop service_name.service
  ```

- **重启服务**：
  ```sh
  sudo systemctl restart service_name.service
  ```

- **重新加载配置文件**：
  ```sh
  sudo systemctl reload-or-restart service_name.service
  ```

- **查看服务状态**：
  ```sh
  sudo systemctl status service_name.service
  ```

- **设置服务开机启动**：
  ```sh
  sudo systemctl enable service_name.service
  ```

- **取消服务开机启动**：
  ```sh
  sudo systemctl disable service_name.service
  ```

- **查看所有已启用的服务**：
  ```sh
  sudo systemctl list-unit-files --type=service --state=enabled
  ```

- **查看所有已禁用的服务**：
  ```sh
  sudo systemctl list-unit-files --type=service --state=disabled
  ```

示例：在 `systemd` 系统下管理名为 `nginx` 的服务：

```sh
sudo systemctl start nginx.service
sudo systemctl stop nginx.service
sudo systemctl restart nginx.service
sudo systemctl status nginx.service
sudo systemctl enable nginx.service
sudo systemctl disable nginx.service
```
:::







## SSH和网络管理

### 常用网络工具

```shell

# 安装网络管理工具
sudo apt install net-tools

# 查看ip
ifconfig

# 通过网络中的心跳机制查看网络是否正常
ping ip


# 端口号查询
netstat -anp | grep port

lsof -i:port

# windows下
netstat -ano | findstr port

```



<br/>



### SSH远程连接

```shell

# 首先需要给远程服务器（Linux服务器）安装ssh

## 搜索ssh是否已经安装
ps -ef | grep ssh


# 假如没有搜索到，则需要安装ssh服务
apt update

# 安装ssh
sudo apt install openssh-server

# 重启ssh
sudo service ssh restart 

# 执行完了以上指令之后，我们可以搜索ssh服务是否已经启动
ps -ef | grep ssh

```

阿里云、华为云、腾讯云等云服务器会默认安装好ssh服务。



<br/>



### Linux防火墙



Centos7默认是开启防火墙的：

```bash

# 1、查看防火墙的配置
firewall-cmd --state
firewall-cmd --list-all

# 开启防火墙
systemctl start firewalld


# 开放某个端口 （ 以80端口为例 ）
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --reload    #重新加载防火墙配置才会起作用

# 移除以上规则
firewall-cmd --permanent --remove-port=80/tcp
firewall-cmd --reload


# 放通某个端口段
firewall-cmd --permanent --zone=public --add-port=1000-2000/tcp
firewall-cmd --reload

```

<br>

IP限制：

```bash

# 放通某个IP访问，默认允许
firewall-cmd --permanent --add-rich-rule='rule family=ipv4 source address=192.168.1.169 accept'
firewall-cmd --reload

# 禁止某个IP访问
firewall-cmd --permanent --add-rich-rule='rule family=ipv4 source address=10.0.0.42 drop'
firewall-cmd --reload

# 放通某个IP访问某个端口
firewall-cmd --permanent --add-rich-rule='rule family=ipv4 source address=192.168.1.169 port protocol=tcp port=6379 accept'
firewall-cmd --reload

# 移除以上规则
firewall-cmd --permanent --remove-rich-rule='rule family="ipv4" source address="192.168.1.169" port port="6379" protocol="tcp" accept'
firewall-cmd --reload

# 放通某个IP段访问
firewall-cmd --permanent --add-rich-rule='rule family=ipv4 source address=10.0.0.0/24 accept'

```








---

order: 5
title:  Linux常用命令

---




## Linux的常见命令

### 查看命令帮助

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









### ls和du命令
ls 命令是Linux下最常用的指令之一。==ls：显示目录下的内容及相关属性信息==，ls命令可以理解为英文单词list的缩写，其功能是列出目录的内容及其内容属性信息（list directory contents）。该命令有点类似于DOS系统下的dir命令，有趣的是，Linux下其实也有dir命令，但我们更习惯于使用ls。

```bash
ls -al

# 以长格式以及易于阅读的文件大小格式展示
ls -lh /
# 查看根目录的每个文件目录大小并按照文件大小排序
ls -lhSr /  
```
ls命令常用参数：

| 常用参数 |                             参数说明                             |
| :------: | --------------------------------------------------------------- |
|    -a    | 显示所有文件及目录 (包括以“.”开头的隐藏文件)                        |
|    -l    | 使用长格式列出文件及目录信息  （有时可以使用 `ll` 命令代替 `ls -l`） |
|    -h    | 代表“human readable”, 以易于阅读的文件大小格式展示                 |
|    -r    | 反向排序                                                         |
|    -S    | 根据文件大小排序                                                 |
|    -t    | 根据最后的修改时间排序                                            |
|    -R    | 递归列出所有子目录                                                |

对于目录，`ls -lh` 通常只显示目录元数据的大小（通常很小，如 4KB），而不是目录中所有文件的总大小。如果需要查看目录占用的磁盘空间，需要使用 `du -h`
<br/>

`du`命令，全称为“disk usage”，是一个用于==估算文件空间使用情况==的命令行工具。它可以帮助用户查看目录或文件在磁盘上的占用空间大小。

```bash
du -sh /etc  # 分别展示/etc目录下所有文件目录的大小

du -ah /etc  # 统计/etc目录的总大小

du -h / -d 1 # 查看根目录下文件及一级目录的大小
```

- `-a` 或 `--all`: 显示每个文件的大小，而不仅仅是目录。
- `-h` 或 `--human-readable`: 以人类可读的格式显示大小（K, M, G等）。
- `-s` 或 `--summarize`: 显示总计，对于查看某个目录的整体大小很有用。
- `-d [N]` 或 `--max-depth=N`：此选项指定du命令递归进入子目录的最大深度




### 目录基础操作

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

==rmdir：删除空目录==: rmdir命令用于删除空目录（remove empty directories），当目录不为空时，命令不起作用。rmdir命令在实际工作中使用的极少

<br/>



### 文件基础命令

 
`stat`命令：用于显示文件的状态信息。stat命令的输出信息比`ls`命令的输出信息要更详细
```bash
ls -al a.txt

stat a.txt
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





### cp/mv/rm

==cp：复制文件或目录==: cp命令可以理解为英文单词copy的缩写，其功能为复制文件或目录。

```bash
# 复制并重命名文件
cp dir1/a.cpp dir4/a-copy.cpp

# 复制目录
cp -r dir1 dir4  # 等同于 cp -r dir1 dir4/ 或 cp -r dir1/ dir4
# 将dir1目录下的全部文件复制到dir4, 但不包含dir1，注意与上面的区别
cp -r dir2/. dir4
```

![](https://image.ventix.top/img01/202101101733552.png)







<br/>

==mv：移动或重命名文件==: mv命令可以理解为英文单词move的缩写，其功能是移动或重命名文件（move/rename files）

```shell
# 重命令（注意目标目录是否存在的区别）
mv dir4 mydir      # 若mydir不存在，则将dir4重命令为mydir
mv a.txt b.txt     # 则将 a.txt 重命名为 b.txt (目标文件已存在时会提示是否覆盖)

mv dir2 dir3       # dir3已经存在时，该命令的作用是将dir2移动到dir3里面

mv cc/aa/* dir5    # 将cc/aa目录下的所有文件复制到dir5
# 注意 cc/aa/* 移动所有非隐藏文件， cc/aa/.* 移动所有隐藏文件
```



<br/>

==rm：删除文件或目录==: rm命令可以理解为英文单词remove的缩写，其功能是删除一个或多个文件或目录（remove files or directories）。这是Linux系统里最危险的命令之一，请慎重使用。
```shell
rm -rf ./kubernetes/dashboard/*      # 递归强制删除dashboard目录内部文件和目录

rm -rf ./kubernetes/dashboard        # 删除dashboard整个目录(包括内部文件目录) 等同于：
rm -rf ./kubernetes/dashboard/
```

![](https://image.ventix.top/img01/202101101734001.png)




<br/>




### 压缩和打包

`tar` 命令用于打包和解包文件，但它本身并不进行压缩。通常与 `gzip`、`bzip2` 或 `xz` 结合使用来实现压缩。

```bash
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







### 文件权限管理

Linux里面，任何一个文件都具有『`User`, `Group`及`Others`』三种身份的权限

![](https://image.ventix.top/img01/202101101735327.png)

`rwx`这三个参数对文件和目录的意义是不同的，如下：

| 文件/目录权限参数 |      文件       |               目录               | 对应权限分数 |
| :--: | :-------------: | :------------------------------: | :------: |
|  r   |   可读(read)    |  r (read contents in directory)  |    4     |
|  w   |   可写(write)   | w (modify contents of directory) |    2     |
|  x   | 可执行(execute) |       x (access directory)       |    1     |

**修改文件/目录的权限**:  `chmod`

```shell
sudo chmod u=rwx,g=rw,o=r fileName
# u：表示文件拥有者， g：表示同组的成员， o：表示其他组的成员

sudo chmod 764 fileName
```
例1：如果要将该文件变成可执行文件，并且不让其他人修改的话， 那么就需要 `-rwxr-xr-x` 这样的权限，即 `chmod 755 test.sh`

例2：如果有些文件你不希望被其他人看到，那么应该将文件的权限设定为： `-rwxr-----` ， 即 `chmod 740 filename` 


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






### 用户和用户组

用户管理：用户管理涉及创建、修改、删除用户账户，以及管理用户的密码和权限

查看用户信息和切换用户： `id` ， `su`

```bash
who            # 关注谁登录到了系统
w              # 显示当前登录到系统的用户及其执行的进程信息

id john        # 查看用户 john 的 UID、GID 和所属组等信息
 
su username    # 切换到指定用户
```

::: info 用户管理
1. 创建用户命令：`useradd`

```bash
sudo useradd -m -s /bin/bash username         

# 添加用户的时候指定组
sudo useradd -m -s /bin/bash -g groupName username
```
   `-m`：         指创建用户逇同时给这个用户创建一个家目录
   `-s`:          指定shell的版本为bash
 

2. 修改用户信息和密码

```bash
usermod -aG sudo john       # 将用户 john 添加到 sudo 组
usermod -s /bin/bash john   # 修改用户 john 的默认 shell 为 /bin/bash

passwd john                 # 设置用户 john 的密码
```

3. 删除用户： `groupdel`

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

进程（process）：是正在执行的程序实例。每个进程都有一个唯一的进程ID（PID），用于标识该进程。当一个进程启动另一个进程时，原始进程称为父进程，新启动的进程称为子进程。

### 查看Linux进程

Linux中常用查看进程的方式：

```bash
# 搜索进程（常用）
ps -ef | grep 进程名或进程id
ps aux | grep 进程名或进程id

pstree  # 以树状结构显示进程及其子进程 （加-p参数显示更多）

# 使用 top 命令实时查看进程(按 q 退出)
top  # 按 k 终止进程。按 P 按 CPU 使用率排序。按 M 按内存使用率排序。
# 使用 htop 命令实时查看进程（需要安装）
htop 
```

`ps`: 显示当前终端或指定用户的进程状态。当单独使用`ps`命令时，默认情况下它仅显示与当前终端会话相关的进程信息，为了获取更全面的信息，需要指定额外的选项来扩展查询范围

| 参数（选项） |                                                                 描述                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `-e`        | 显示所有进程，包括其他用户的进程。等同于`-A`。                                                                                            |
| `-f`        | 使用完整格式列表（full-format listing）。这增加了额外的信息列，如UID、PID、PPID、C、STIME、TTY、TIME和CMD。                                 |
| `-a`        | 显示与终端相关的所有进程，不仅仅是当前用户的。它不会显示没有控制终端的进程。结合`-x`可以显示所有进程。                                          |
| `-u`        | 选择列出哪些用户的进程。如果没有指定用户，则默认为当前用户。当与`-a`一起使用时，它将以用户导向的格式显示信息，如用户名、CPU使用率、内存使用情况等。 |
| `-x`        | 显示没有控制终端的进程。通常与`-a`组合使用来显示所有进程，无论它们是否关联到一个终端。                                                        |
| `-l`        | 提供长格式输出（long format），提供更详细的进程信息，例如状态（S）、优先级（PRI）等。                                                        |






### Linux进程管理

Linux 进程管理涉及启动、停止、监控和管理运行中的进程。


**启动进程**: 
```bash
# 前台启动
./script.sh  # 在前台启动脚本

# 后台启动
./script.sh &  # 在后台启动脚本

# 使用 nohup 命令在后台启动并使其在终端关闭后继续运行
nohup ./script.sh &  # 在后台启动脚本，并使其在终端关闭后继续运行
```

**终止进程**：
```bash
# 使用 kill 命令终止进程
kill 1234     # 发送 SIGTERM 信号终止 PID 为 1234 的进程
kill -9 1234  # 发送 SIGKILL 信号强制终止 PID 为 1234 的进程

# 使用 pkill 命令终止进程
pkill script.sh  # 终止所有名为 script.sh 的进程

# 使用 killall 命令终止进程
killall script.sh  # 终止所有名为 script.sh 的进程
```

**控制进程优先级**:
```bash
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



### Linux防火墙

在 CentOS 中，`firewalld` 是默认的防火墙管理工具。可以使用 `firewall-cmd` 命令来管理防火墙的状态和规则。

- **查看状态**：使用 `firewall-cmd --state` 或 `firewall-cmd --info-all`。
- **临时关闭**：使用 `systemctl stop firewalld`。
- **永久关闭**：使用 `systemctl stop firewalld` 和 `systemctl disable firewalld`。
- **重新启用**：使用 `systemctl start firewalld` 和 `systemctl enable firewalld`。

要查看当前防火墙的状态，可以使用以下命令：

```bash
sudo firewall-cmd --state
```

这个命令会返回 `running` 或者 `not running`，分别表示防火墙是否正在运行。

如果你想获得更详细的输出，包括活动区域、接口和服务等信息，可以使用：

```bash
sudo firewall-cmd --info-all
```

或者查看特定区域的信息：

```bash
sudo firewall-cmd --zone=public --list-all
```
<br/>

特定端口号的防火墙规则设置：

```bash
# 查看端口号是否开启,如果是no，就说明没有开放
firewall-cmd --query-port=9200/tcp                           

firewall-cmd --zone=public --add-port=6379/tcp --permanent   #开通6379端口(redis)
firewall-cmd --zone=public --add-port=8848/tcp --permanent   #开通8848端口(nacos)
firewall-cmd --zone=public --add-port=3306/tcp --permanent   #开通3306端口(mysql)

firewall-cmd --reload    # 重启防火墙，端口正常开启
```



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








---

order: 1
title:  Linux基础设置

---

VM和Linux的安装参照：[VM和Linux](/posts/om/vm.md)，[WSL2](/posts/blog/windows.md#二-wsl-wsl2)

一些在线网站：[鸟哥的 Linux 私房菜 基础学习篇](http://cn.linux.vbird.org/linux_basic/linux_basic.php) , [鸟哥的 Linux 私房菜 服务器架设篇](http://cn.linux.vbird.org/linux_server/)


## Linux基础信息


### 系统版本和host

```bash
lsb_release -a  # 查看操作系统版本

uname -a
```

查看和设置hostname:

```bash
hostname

hostnamectl set-hostname xxx
bash
```
使用 `hostnamectl set-hostname 主机名` 来设置主机名后，使用 `bash` 命令让主机名不重启即可生效



### 内存和硬盘信息

查看内存信息
```bash
free -h

cat /proc/meminfo  # 查看详细内存信息 
```

产看硬盘信息：
```bash
df -h

lsblk
```




### CPU和机器型号


linux查看cpu、内存、版本信息

```shell
# 查看CPU信息
cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c 
cat /proc/cpuinfo | grep physical | uniq -c 

getconf LONG_BIT   
#32 (说明当前CPU运行在32bit模式下, 但不代表CPU不支持64bit) 

dmidecode | grep "Product Name"    # 查看机器型号 
```




### 命令行提示符

Linux命令行结尾的提示符有 “#” 和 “$” 两种不同的符号

```shell
[root@hostname ~]#        # <==这是超级管理员root用户对应的命令行。
[hostname@hostname ~]$    # <==这是普通用户对应的命令行。
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





### time和watch

统计命令执行时间：time命令
```bash
time ls /
```

使用 `watch` 命令监控变化：

```bash
watch -n 2 netstat -tuln
```





## Linux常用设置




### 系统语言修改

```shell
locale                  # 查看当前使用的语言
locale -a               # 查看系统中可以使用的语言

vi /etc/locale.conf     # 修改以下内容（LANG="zh_CN.UTF-8" ==> LANG="en_US.UTF-8" ）

#LANG="zh_CN.UTF-8"
LANG="en_US.UTF-8"
```




### 时间日期设置

查看时间和日期：

```bash
# 显示或设置系统的日期和时间
date
date MMDDhhmm[[CC]YY][.ss]  # 手动设置系统日期和时间

# 显示当前的硬件时钟时间
hwclock
# 设置硬件时钟到指定的时间
hwclock --set --date="YYYY-MM-DD HH:MM:SS" 

# 显示当前的系统时间、时区、NTP同步状态等信息
timedatectl
# 设置系统时间
timedatectl set-time "YYYY-MM-DD HH:MM:SS" 
# 启用或禁用NTP时间同步
timedatectl set-ntp true/false
```

时区信息及修改方式：

```bash
# 查询所有时区（信息太多，过滤再查看） New_York
timedatectl list-timezones | grep 'Shanghai'  

# 设置时区
timedatectl set-timezone Asia/Shanghai
```



<br/>




### 关机和重启
常用关机命令: `shutdown`, `halt`, `poweroff`, `init 0`
```bash
sudo shutdown -h now      # 立即关机
sudo shutdown -h +10      # 定时关机
sudo shutdown -c          # 取消关机

sudo halt                 # 立即停止系统，但不切断电源

sudo poweroff             # 立即关闭系统并切断电源

sudo init 0               # 切换系统运行级别，其中运行级别0表示关机
```

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

重启命令: `reboot`, `shutdown -r`, `init 6`

```bash
sudo reboot              # 立即重启系统
sudo shutdown -r now     # 用于重启系统
sudo shutdown -r +10     # 10分钟后重启

sudo init 6              # 用于重启系统，运行级别6表示重启
```

 ==关机与重启命令：halt/poweroff/reboot==：

从RedHat或CentOS 6开始，你会发现halt、poweroff、reboot这三个命令对应的都是同一个man帮助文档，而halt和poweroff命令是reboot命令的链接文件，通常情况下，我们执行这三个命令时都不带任何参数。

> 为什么halt、poweroff命令是reboot命令的链接文件，但是分别执行命令后效果不一样呢？
>
> 查看一下reboot命令的man帮助，可以发现reboot命令有2个参数--halt和--power-off，作用分别和halt、poweroff命令一样。



![](https://image.ventix.top/img01/202101101729509.png)



<br/>

### Linux启动级别

Linux系统可通过运行级别（runlevel）来控制系统的启动方式和服务的启动情况。`SysV init`系统定义了以下几种运行级别：

| runlevel |   systemd Target    |                         说明                          |
| -------- | ------------------- | ----------------------------------------------------- |
| 0        | `poweroff.target`   | 关闭系统，通常用于完全关机                              |
| 1        | `rescue.target`     | 单用户模式，主要用于系统维护和修复                       |
| 2        | /                   | 多用户模式，但不启用网络服务                             |
| 3        | `multi-user.target` | 完整多用户模式，提供命令行界面                           |
| 4        | /                   | 未预先分配使用（具体用途因发行版而异）                    |
| 5        | `graphical.target`  | 图形化多用户模式，除了命令行外，还会启动GUI, 如GNOME或KDE |
| 6        | `reboot.target`     | 重启系统，用于重新启动计算机                             |


```bash
# 切换当前的运行级别。
sudo init 1           # 切换到单用户模式
sudo init 5           # 切换到图形界面模式

# 显示最近的系统运行级别
runlevel       # N 3
# N 表示之前的运行级别（如果没有则为 N），3 表示当前运行级别
```

在现代Linux系统中，systemd 已经取代了传统的 init 系统。systemd 使用目标（target）来管理系统的启动级别。
```bash
systemctl get-default            # 查看当前目标

# 设置默认目标
sudo systemctl set-default multi-user.target

# 切换到图形界面目标
sudo systemctl isolate graphical.target
# 切换到多用户目标
sudo systemctl isolate multi-user.target
```



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





### http proxy

Windows + Linux虚拟机的 代理设置：

- 在Windows上装有`clash` 并开启代理，记住顶部的端口号 `7890`
- `clash`开启`allow LAN`，注意绑定：`0.0.0.0`

```bash
可以通过设置以下环境变量来配置 HTTP 和 HTTPS 代理：
export http_proxy=http://192.168.83.54:7890
export https_proxy=http://192.168.83.54:7890
export ftp_proxy=http://192.168.83.54:7890

# 取消代理设置，只需将这些变量设置为空或者直接删除它们：
unset http_proxy
unset https_proxy
unset ftp_proxy
```

永久代理设置：将代理命令写入配置文件 `~/.profile` 或 `~/.bashrc` 或 `~/.zshrc` 中
```bash
vim /etc/profile

# 添加下面的内容
export http_proxy=http://192.168.83.54:7890
export https_proxy=http://192.168.83.54:7890
export no_proxy=localhost,127.0.0.1,192.168.0.0/16

# source
source /etc/profile
```

注意：ping 使用的是 ICMP 协议，不支持代理。可以执行 `curl -vv https://www.google.com ` 看看有没有走代理。

::: important Kubernetes 和 Docker 代理设置
Docker 配置代理，编辑代理配置文件：
```bash
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo vim /etc/systemd/system/docker.service.d/http-proxy.conf

# 添加下面内容
[Service]
Environment="HTTP_PROXY=http://192.168.83.54:7890"
Environment="HTTPS_PROXY=http://192.168.83.54:7890"
Environment="NO_PROXY=localhost,127.0.0.1,192.168.0.0/16,172.17.16.0/20"

# 重启Docker
systemctl daemon-reload && systemctl restart docker
```
如果 Kubernetes 集群的组件需要访问本地服务（例如 API Server 或 etcd），确保在环境变量 NO_PROXY 中添加 Kubernetes 的服务网段（如 10.96.0.0/12）。
:::

<br>

Git 设置代理： 
```bash
git config --global http.proxy http://192.168.5.79:7890
git config --global https.proxy http://192.168.5.79:7890

# Git 取消代理设置：
git config --global --unset http.proxy
git config --global --unset https.proxy
```



<br>



### 终端配色方案

原生Shell配色: 

更改到 centos 的 /etc/bashrc 中即可永久生效： ` vim /etc/bashrc  `         # 填入如下内容
```bash

if [ "${-#*i}" != "$-" ];then
    # interactively shell
    PS1="[\[\033[01;31m\]\u\[\033[00m\]@\[\033[36;36m\]\h\[\033[00m\] \[\033[01;34m\]\w\[\033[00m\]]$ "
    trap 'echo -ne "\e[0m"' DEBUG
fi

```

可以在/etc/profile中也去加载/etc/bashrc：

```bash

cat >> /etc/profile << EOF
if [ -f /etc/bashrc ]; then 
    . /etc/bashrc
fi
EOF

```
刷新即永久生效： `source /etc/profile` 


<br/>

参数说明-->PS1的定义中个常用的参数的含义如下：
```bash
\d ：#代表日期，格式为weekday month date，例如："Mon Aug 1"
\H ：#完整的主机名称
\h ：#仅取主机的第一个名字
\T ：#显示时间为24小时格式，如：HH：MM：SS
\t ：#显示时间为12小时格式 , 如：HH：MM：SS
\A ：#显示时间为12小时格式：HH：MM
\u ：#当前用户的账号名称
\v ：#BASH的版本信息
\w ：#完整的工作目录名称
\W ：#利用basename取得工作目录名称，所以只会列出最后一个目录
#  ：#下达的第几个命令
$  ：#提示字符，如果是root时，提示符为：`#` ，普通用户则为：`$`

```

设置颜色: 在`PS1`中设置字符颜色的格式为：`[\e[F;Bm]`
- `F`为字体颜色，编号为`30-37`
- `B`为背景颜色，编号为`40-47`

格式：`[\e[F;Bm]`需要改变颜色的部分`[\e[0m]` , `F B` 值分别对应的颜色
```bash
30 40 黑色
31 41 红色
32 42 绿色
33 43 黄色
34 44 蓝色
35 45 紫红色
36 46 青蓝色
37 47 白色
```

---


## LVM及硬盘管理

Linux 中可以使用 `lsblk` 命令查看机器的硬盘信息：
```bash
[root@rocky ~]$ lsblk -d
NAME    MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
sda       8:0    0   1G  0 disk
sdb       8:16   0   2G  0 disk
nvme0n1 259:0    0  80G  0 disk
```
在 Linux 中 传统硬盘（如SATA、SCSI等）通常以 `/dev/sdX` 的形式命名，而 NVMe SSD 则是 `/dev/nvmeXnY`（其中 `X` 是控制器编号，`Y` 是命名空间编号）

---

Linux 的文件系统结构设计使得它看起来不像 Windows 那样直接将每个分区映射为一个驱动器字母（如 `C:、D:` 等）。Linux 使用一种称为“挂载”（mount）的机制，将各个分区关联到文件系统的特定目录（挂载点）上。

在 Linux 中，通过编辑 `/etc/fstab` 文件，可以在系统启动时自动挂载指定的分区到特定的挂载点:
```bash
# <file system> <dir>   <type>  <options>       <dump>  <pass>
/dev/sda1       /       ext4    defaults        0       1
/dev/sda2       /home   ext4    defaults        0       2
/dev/sda3       swap    swap    defaults        0       0
```
这段配置表示：`/dev/sda1` 被挂载到根目录 `/`，使用 `ext4` 文件系统。`/dev/sda2` 被挂载到 `/home` 目录。`/dev/sda3` 被用作交换空间。

---

### 添加新硬盘

确保硬盘被正确识别（可以使用 `lsblk` 或 `sudo fdisk -l` 查看）

```bash
[root@rocky ~]$ lsblk -d
NAME    MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
sda       8:0    0   1G  0 disk
sdb       8:16   0   2G  0 disk
nvme0n1 259:0    0  80G  0 disk
```

在 `/dev/` 目录下也有相关文件：

```bash
[root@rocky ~]$ ls /dev/sd* /dev/nvme*
/dev/nvme0  /dev/nvme0n1  /dev/nvme0n1p1  /dev/nvme0n1p2  /dev/sda  /dev/sdb
```



### 硬盘分区

分区前后通常需要查看硬盘的分区情况：

```bash
fdisk -l /dev/sda        # 查看sda这块硬盘的分区情况

lsblk                    # 查看所有硬盘的分区信息
```

Linux分区工具介绍：

|   工具    | 支持的分区表 |                            特点                            |
| -------- | ----------- | ---------------------------------------------------------- |
| `fdisk`  | MBR、GPT    | 传统工具，适合简单分区操作                                   |
| `gdisk`  | GPT         | 专为 GPT 设计，功能更强大                                    |
| `parted` | MBR、GPT    | 支持多种分区表，并且具有更多的高级功能(调整分区大小和脚本化操作) |




::: tabs

@tab fdisk

使用 `fdisk` 创建新分区（默认为`MBR`分区，也就是`DOS` 分区表）

1. **启动 `fdisk` 工具**：使用 `fdisk` 启动交互式分区程序：
   ```bash
   sudo fdisk /dev/sdb
   ```
2. **查看现有分区**：在 `fdisk` 提示符下，输入 `p` 来打印当前硬盘上的分区表：

3. **创建新分区**：输入 `n` 来创建一个新分区 （可以提前输入`g`转换为`GPT`类型）

4. **选择分区类型**：选择创建主分区（primary partition）或扩展分区（extended partition）。
   - 输入 `p` 创建主分区。
   - 输入 `e` 创建扩展分区（如果需要多个逻辑分区）。

5. **指定分区编号**： 一般默认即可（MBR分区通常是 `1` 到 `4`）

6. **指定第一个扇区**：按回车键接受默认的第一个扇区（通常是第一个可用的扇区）。

7. **指定最后一个扇区**：输入你想分配给该分区的大小（例如 `+5G` 表示分配 5GB 的空间），或者直接按回车键使用剩余的所有空间。
   ```bash
   Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-41943039, default 41943039): +5G
   ```
8. **检查分区表**：再次输入 `p` 查看新的分区表，确认分区是否正确创建。

9. **保存并退出**：输入 `w` 保存更改并退出 `fdisk`：
   ```plaintext
   Command (m for help): w
   ```

@tab:active gdisk

使用 `gdisk` 进行分区的过程与 `fdisk` 类似，它是专门设计用于 GPT（GUID Partition Table）分区表的工具

1. **启动 `gdisk` 工具**：使用 `gdisk` 启动交互式分区程序：
   ```bash
   sudo gdisk /dev/sdb
   ```

2. **创建新的 GPT 分区表（如果需要）**：如果你的硬盘还没有初始化为 GPT 分区表，或者你想重新初始化它，可以在 `gdisk` 提示符下输入 `o` 来创建一个新的空 GPT 分区表。
   ```plaintext
   Command (? for help): o
   This option deletes all partitions and creates a new protective MBR.
   Proceed? (Y/N): y
   ```

3. **查看现有分区**： 在 `gdisk` 提示符下，输入 `p` 来打印当前硬盘上的分区表：

4. **创建新分区**：输入 `n` 来创建一个新分区：

5. **选择分区编号**：按回车键接受默认的第一个可用分区编号（例如 `1`）。

6. **指定第一个扇区**：按回车键接受默认的第一个可用扇区。

7. **指定最后一个扇区**：输入你想分配给该分区的大小（例如 `+5G` 表示分配 5GB 的空间），或者直接按回车键使用剩余的所有空间。
   ```bash
   Last sector (xxx-yyy, default yyy): +5G
   ```

8. **选择分区类型**：默认情况下，新分区的类型是 "Linux filesystem" (代码 `8300`)。如果你想改变分区类型，可以输入 `t` 并根据需要选择不同的类型代码。例如，对于 EFI 系统分区，你可以输入 `ef00`。
   ```bash
   Command (? for help): t
   Partition number (1-128): 1
   Hex code or GUID (L to show codes, 0 for empty): ef00
   ```

9. **检查分区表**: 再次输入 `p` 查看新的分区表，确认分区是否正确创建。

10. **保存并退出**:  输入 `w` 保存更改并退出 `gdisk`

:::






### 格式化分区




### 挂载







### LVM基础介绍







## Linux发行版及镜像


### CentOS7YUM源

镜像下载：[阿里云镜像](https://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/) 

配置 yum 镜像源：

```bash
# 1. 备份现有的仓库配置文件，以防需要恢复
cp /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak

# 2. 下载并替换新的仓库配置文件
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

# 或者使用其他镜像源 (清华大学镜像源/中科大镜像源)
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.tuna.tsinghua.edu.cn help/centos/7/CentOS-Base.repo

wget -O /etc/yum.repos.d/CentOS-Base.repo http://centos.ustc.edu.cn/centos/7/os/x86_64/CentOS-Base.repo
```

更新仓库信息并清理缓存：
```bash
yum clean all && yum makecache
```

CentOS替代方案：Rocky Linux，AlmaLinux



### 本地YUM源配置

**设置系统光盘自动挂载**

1. 插入系统安装光盘（虚拟机中将ISO镜像文件挂载到虚拟机的光驱上）
2. 选择一个目录作为光盘的挂载点。通常会选择`/mnt/cdrom`或`/media/cdrom`这样的路径
3. 编辑`/etc/fstab`文件实现自动挂载
    ```bash
   vim /etc/fstab
   # 添加以下内容
   /dev/cdrom  /mnt/cdrom  iso9660  defaults  0 0
    ```
4. 手动挂载一次以验证设置：`mount -a`



**配置本地YUM源**（CentOS7）

1. 在`/etc/yum.repos.d/`目录下，创建一个新的`.repo`文件
    ```bash
   vim /etc/yum.repos.d/local.repo
    ```
2. 编辑`.repo`文件，加入如下内容
    ```bash
    [LocalRepo]
    name=Local Repository
    baseurl=file:///mnt/cdrom/
    enabled=1
    gpgcheck=1
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-redhat-release
    ```
3. 清理并更新YUM缓存，测试配置是否成功
    ```bash
   yum clean all && yum makecache 
   yum list available  
   yum list | wc -l
    ```
    
在 Rocky Linux 8 及其类似版本（如 CentOS 8、AlmaLinux 8 等）中，配置本地 YUM 源时有时会将配置文件分成两个部分或两个文件的做法，通常指的是将应用程序（AppStream）和操作系统基础组件（BaseOS）的仓库分开配置。



### YUM和DNF

yum 和 dnf 都是 Red Hat 系列 Linux 发行版中的软件包管理工具，用于处理 RPM 包的安装、更新、查询和删除等操作。

- Yum (Yellowdog Updater Modified) 是较早出现的包管理工具，广泛应用于基于 RPM 的早期发行版
- DNF (Dandified Yum) 是作为 Yum 的下一代替代品开发的，首次出现在 Fedora 18 中。从 RHEL 8 开始，Red Hat 官方推荐使用 DNF 而不是 Yum。

|   特性/工具   |            Yum            |         DNF          |
| ------------ | ------------------------- | -------------------- |
| **语言基础** | Python                    | C/C++（libsolv）     |
| **性能**     | 较慢，特别是在大型仓库环境下 | 快速高效的依赖解析     |
| **内存使用** | 较高                       | 优化更好              |
| **API支持**  | 较少                       | 更强大，更适合开发集成 |
| **兼容性**   | 广泛应用于旧版本系统         | 新版本系统的标准选择   |

在8的版本中，使用用yum和dnf几乎是一样的

```bash
yum list available

dnf module list nginx
```

阿里云Epel 镜像配置参考：[Epel 镜像](https://developer.aliyun.com/mirror/epel)




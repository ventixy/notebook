---
article: true
date: 2023-02-19
category:
  - linux
tag:
  - linux 
  - Rocky
  - CentOS
shortTitle: Linux基础常识
title: Linux基础信息及发展记录
---


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
```




### 内存和硬盘信息

查看内存信息
```bash
free -h

cat /proc/meminfo  # 查看详细内存信息 
```

产看硬盘信息：
```bash
df -h
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



### 命令执行时间
time命令
```bash
time ls /
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

Linux系统可通过运行级别（runlevel）来控制系统的启动方式和服务的启动情况。传统的`SysV init`系统定义了以下几种运行级别：

- **0**: 关机状态。
- **1**: 单用户模式，通常用于维护和修复系统。
- **2**: 多用户模式，但没有启用网络服务（较少使用）。
- **3**: 完整多用户模式，命令行界面，无图形用户界面。
- **4**: 未使用或用户自定义（取决于发行版）。
- **5**: 图形化用户界面，即桌面环境。
- **6**: 重启系统。

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














## Linux发展记录
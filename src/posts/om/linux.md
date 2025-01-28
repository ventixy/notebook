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


```bash
# 查看内存信息
free -h
cat /proc/meminfo  # 查看详细内存信息 
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
init 0      # 关机  （也可使用telinit）

# 显示最近的系统运行级别
runlevel
```

然而，随着systemd成为大多数现代Linux发行版的初始化系统，上述概念被target所取代，如multi-user.target相当于runlevel 3，graphical.target相当于runlevel 5等。

虽然init和runlevel概念在基于systemd的系统中依然存在，但它们更多是为了保持向后兼容性。现代Linux系统主要依赖于systemd提供的功能和命令来进行系统和服务的管理。















## Linux发展记录
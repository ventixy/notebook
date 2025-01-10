---

order: 1
title:  VMware/Linux安装
shortTitle: Linux安装
icon: application

---


# VMware/Linux安装

## 一 VMware虚拟机

### 1. NAT与桥接网络模式
vmware为我们提供了三种网络工作模式，它们分别是：Bridged(桥接模式)、NAT(网络地址转换模式)、Host-Only(仅主机模式)。

所有的虚拟系统是可以相互通信的，但虚拟系统和真实的网络是被隔离开的。 理解：**VM中**所有虚拟机可相互通信，但真实机器与虚拟机之间不能**相互**访问

#### VMware相关虚拟设备

VMnet0：这是VMware用于虚拟 `桥接网络` 下的虚拟交换机;

VMnet1：这是VMware用于虚拟 `Host-Only` 网络下的虚拟交换机;

VMnet8：这是VMware用于虚拟 `NAT网络` 下的虚拟交换机;

VMware Network Adapter VMnet1：这是Host用于与Host-Only虚拟网络进行通信的虚拟网卡;

VMware Network Adapter VMnet8：这是Host用于与NAT虚拟网络进行通信的虚拟网卡;

在主机中CMD 命令提示符的情况下，输入ipconfig便可以查询到 `VMware Network Adapter VMnet1`、`VMware Network Adapter VMnet8` 的IP地址，win10系统直接搜索 `网络连接` 即可查看相关网卡信息

<br>

#### 桥接网络模式及设置

在桥接模式下，VMware虚拟出来的操作系统就像是局域网中的一独立的主机，它可以访问该类网段内任何一台机器。

桥接网络环境下需要做到：

1.为虚拟机系统配置IP地址、子网掩码。

2.在桥接的模式下虚拟机必须与物理机处于同一网段，(举个例子,物理机IP:192.168.1.2，虚拟机IP:192.168.1.3)这样虚拟系统才能和真实主机进行通信。

关于桥接网络的小知识：

当你想利用VMware在局域网内新建一个虚拟服务器，为局域网用户提供网络服务，就应该选择桥接模式。可将虚拟机模拟接入主机所在的局域网。桥接网络，相当于，虚拟机与主机同接在一台交换机上，同时上网，虚拟机对物理机网络的直接影响较小~

<br>

#### NAT网络模式及设置

在NAT网络中，会使用到VMnet8虚拟交换机，物理机上的 `VMware Network Adapter VMnet8 虚拟网卡` 将会和 `VMnet8交换机`相连接，来实现物理机与虚拟机之间的通信。

注意：`VMware Network Adapter VMnet8 虚拟网卡` 仅仅是用于主机和VMnet8网段通信使用，它并不为VMnet8网段提供路由功能，处于虚拟NAT网络下的Guest是使用虚拟的NAT服务器连接的Internet的。

VMware Network Adapter VMnet8虚拟网卡它仅仅是为Host和NAT虚拟网络下的Guest通信提供一个接口，所以，即便去掉这块虚拟网卡，虚拟机仍然是可以上网的，只是物理机将无法再访问VMnet8网段而已。

**NAT网络环境下需要做到**： 

1.主机需要开启vmdhcp和vmnat服务。(服务的开启，在我的电脑当中右键“管理”可以设置)

2.NAT模式下的虚拟机的TCP/IP配置信息将由VMnet8(NAT)虚拟网络的DHCP服务器自动分配，需要开启DHCP功能。

**关于NAT网络的小知识**：

使用NAT模式，就是让虚拟系统借助NAT(网络地址转换)功能，通过物理机所在的网络来访问外网。NAT 模式下的网络，相当于说虚拟机是通过接入物理机连接上的网络，等于物理机是个路由器，申请到一个上网名额，带着隐藏在它下面的虚拟机上网。自然所有虚拟机使用的网络总和都限制在实机一个网络通道内。虚拟机会抢占物理机的网络~对物理机上网会有很大的影响!

<br>

### 2. 设置虚拟机静态网络IP

NAT模式下虚拟机IP可能会变，我们可以通过设置静态 IP ，这样的话 IP 就不会发生改变

VMware 点击 编辑 ——> 虚拟网络编辑器 (如图：)

![](https://image.ventix.top/img01/202101101724339.png)

::: code-tabs#shell

@tab Centos

```bash
ip addr
vim /etc/sysconfig/network-scripts/ifcfg-ens33
service network restart  # 刷新网络服务 centos8使用: ifup  ens33
```


@tab Ubuntu

```bash
sudo vim /etc/netplan/00-installer-config.yaml   # 文件名可能会不同
sudo netplan apply                               # 应用更改
```
:::

::: details ifcfg-ens33

Centos下的网络配置文件内容参考：

```properties
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
UUID=ee4084e5-a3b6-43f0-8b06-80a20d647a10
DEVICE=ens33
ONBOOT=yes
IPADDR=192.168.42.10
NETMASH=255.255.255.0
GATEWAY=192.168.42.2
DNS1=192.168.42.2
```
:::

::: details 00-installer-config.yaml

Ubuntu下网络配置文件参考：

```yaml
# This is the network config written by 'subiquity'
network:
  ethernets:
    ens33:
      dhcp4: false
      addresses: [192.168.42.11/24]
      gateway4: 192.168.42.2
      nameservers:
              addresses: [8.8.8.8, 1.1.1.1]
  version: 2

```
:::

::: note 主机连不上虚拟机

注意虚拟机IP和VMnet8需要在同一个网段上，可通过 ping 命令测试
参考：http://blog.iis7.com/article/33159.html
:::

<br/>

### 3. Linux虚拟机硬盘扩容
给VMware下的Linux扩展磁盘空间（以CentOS7为例）
::: info 扩容步骤
一 关闭虚拟机，删除快照，按如下步骤扩容 ：

`VM -> Settings... -> Hardware -> Hard Disk -> Utilities -> Expand`

输入你想要扩展到多少G。（本次新增加了 30G）

<br>

二 对新增加的硬盘进行分区、格式化

```bash
df -h              # 查看硬盘信息和挂载点
fdisk -l           # 查看磁盘信息

fdisk /dev/sda　　   # 操作 /dev/sda 的分区表
: p　　　　　　　     # 查看已分区数量（我看到有两个 /dev/sda1 /dev/sda2）
: n　　　　　　　     # 新增加一个分区
: p　　　　　　　     # 分区类型我们选择为主分区
: 3　　　　　　　     # 分区号选3（因为1,2已经用过了，见上）
: 回车　　　　　      # 默认（起始扇区）
: 回车　　　　　      # 默认（结束扇区）
: t　　　　　　　     # 修改分区类型
: 3　　　　　　　     # 选分区3
: 8e　　　　　　      # 修改为LVM（8e就是LVM）
: w　　　　　　       # 写分区表
: q　　　　　　       # 完成，退出fdisk命令

# 系统提示你重启，重启系统即可

mkfs.ext3 /dev/sda3  # 开机后，格式化sda3
```

<br>

三 添加新LVM到已有的LVM组，实现扩容
```bash
lvm　　　　　　　　　　　　　　　　　　       #进入lvm管理

lvm> pvcreate /dev/sda3　　　　　　　　　    #这是初始化刚才的分区，必须的
lvm> vgextend centos /dev/sda3　　　        #将初始化过的分区加入到虚拟卷组vg_dc01
lvm> lvextend -L +29.9G /dev/centos/root　　#扩展已有卷的容量（实际大小会比30G略小）
lvm> pvdisplay　　　　　　　　　　　　　　    #查看卷容量，这时你会看到一个很大的卷了
lvm> quit　　　　　　　　　　　　　　　　　    #退出
```
:::
以上只是卷扩容了，下面是文件系统的真正扩容，输入以下命令：
::: tabs
@tab Centos6
```bash
resize2fs /dev/centos/root
```

@tab Centos7+
```bash
xfs_growfs /dev/centos/root
```
:::


<br/>

### 4. 虚拟机自启动设置

#### 创建启动/关闭脚本

```bash
# 在系统的某个安静的盘中创建一个vm_start.bat文件，然后使用编辑器打开。写入: 
"C:\Program Files (x86)\VMware\VMware Workstation\vmrun.exe" start "D:\VirtualMachines\DevMachines\DevMachines.vmx" nogui


# 再次创建一个vm_stop.bat文件
"C:\Program Files (x86)\VMware\VMware Workstation\vmrun.exe" stop "D:\VirtualMachines\DevMachines\DevMachines.vmx"

#测试运行文件: 双击启动文件vm_start.bat，如果弹出dos窗口且虚拟机启动则无误,双击停止文件vm_stop.bat，如果弹出dos窗口且虚拟机停止则无误
```

<br/>

#### 添加到自启动任务

`Win+ R`  -> `gpedit.msc` -> 用户配置 -> windows设置 -> 鼠标双击脚本(登录/注销) -> 鼠标双击“登录”或“注销”分别添加启动、关闭脚本

【Q】主机访问不到虚拟机的服务的解决办法: 检查防火墙状态

<br>

### 5. Linux防火墙设置

```bash
firewall-cmd --query-port=9200/tcp                           #查看端口号是否开启,如果是no，就说明没有开放

firewall-cmd --zone=public --add-port=6379/tcp --permanent   #开通6379端口(redis)

firewall-cmd --zone=public --add-port=8848/tcp --permanent   #开通8848端口(nacos)

firewall-cmd --zone=public --add-port=3306/tcp --permanent   #开通3306端口(mysql)



firewall-cmd --reload                                        #重启防火墙，端口正常开启

systemctl restart docker                                     #如果是docker容器的化则要重启下docker服务 
```

<br/>


## 二 vagrant安装

### 1. 安装准备

**virtualbox + vagrant 安装**：

1. 下载安装 [Virtual box](https://www.virtualbox.org/) 的`主程序`和`拓展包`，安装后修改虚拟机存放位置（需要cpu开启虚拟化）

   <br/>

2. 下载安装 [Vagrant](https://www.vagrantup.com/) （ Vagrant 是没有图形界面的，安装程序会自动把安装路径加入到 PATH 环境变量 ）

```
vagrant version
```

- 配置vagrant (虚拟机镜像文件存储目录，默认为：C:\Users\用户名\.vagrant.d)  —— `VAGRANT_HOME`

![](https://image.ventix.top/img01/202101101726397.png)

<br/>


3. 下载虚拟机镜像
   使用 Vagrant 创建虚机时，需要指定一个镜像，也就是 box。开始这个 box 不存在，所以 Vagrant 会先从网上（[镜像网站](https://app.vagrantup.com/boxes/search)）下载，然后缓存在本地目录中。但默认下载往往会比较慢，我们可以自己下载镜像文件。常用的两个 Linux 操作系统镜像的下载地址：

- CentOS [官网下载](http://cloud.centos.org/centos/) ，[CentOS-7.box （点击下载）](http://cloud.centos.org/centos/7/vagrant/x86_64/images/CentOS-7.box) 列表中有一个 vagrant 目录，选择其中的 .box 后缀的文件下载即可。

- Ubuntu [官网下载](http://cloud-images.ubuntu.com/) ，[清华大学镜像站下载](https://mirror.tuna.tsinghua.edu.cn/ubuntu-cloud-images/) ，同样选择针对 vagrant 的 .box 文件即可。

  <br/>


```shell

添加 box ：接下来我们需要将下载后的 .box 文件添加到 vagrant 中：

```

<br/>

```shell

# 如果这是第一次运行，此时 VAGRANT_HOME 目录下会自动生成若干的文件和文件夹，其中有一个 boxes 文件夹，
# 这就是要存放 box 文件的地方。

vagrant box list

#执行 vagrant box add 命令添加 box: (命令后面跟着的是镜像文件的路径，通过 --name centos-7 为这个 box 指定名字)
vagrant box add E:\Package\VM\VirtualBox\CentOS-7.box --name centos-7

vagrant box list        #再次查询，可以看到有了一个 box

```

<br/>



### 2. 安装虚拟机

Vagrant新建虚拟机

```shell

#先进入vagrant工作目录（Vagrantfile所在的目录）再执行命令
vagrant init centos-7

#首次执行会先安装再启动，之后就是启动的功能（注意要在Vagrantfile所在的目录执行）
vagrant up

```

<br/>

```shell
# 常用命令
vagrant status         #查看虚拟机状态
vagrant ssh            #以 vagrant 用户直接登入虚拟机中，使用 exit; 退出

vagrant halt           #关闭虚拟机
vagrant suspend        #暂停虚拟机
vagrant resume         #恢复虚拟机
vagrant reload         #重载虚拟机(可能会重启失败，需要重启宿主机才能开机虚拟机)
vagrant destroy        #删除虚拟机
```

<br/>

配置私有网络：

上述创建的虚拟机网络默认使用的是 `网络地址转换（NAT）+ 端口转发` 的方式，

我们需要修改 `Vagrantfile`，为虚拟机设置指定的私有网络地址：

```shell

# 取消改行的注释，根据下图宿主机的IP地址，修改前三段地址一致即可
config.vm.network "private_network", ip: "192.168.56.10"

```

<br/>

```
ipconfig
```

![](https://image.ventix.top/img01/202101101727590.png)

```shell

# 修改Vagrantfile文件后，需要重启虚拟机，若重启失败可删除重装，先修改Vagrantfile，再vagrant up
vagrant reload

```

<br/>



更改虚拟机配置（[Provider配置](https://www.vagrantup.com/docs/providers/virtualbox/configuration)）

```shell
config.vm.provider "virtualbox" do |v|
v.memory = 4096
v.cpus = 4
end
```

> 【注意】修改Vagrantfile可能会导致虚拟机无法启动，可在安装前先修改好Vagrantfile文件。系统用户密码均为 ：vagrant

<br/>



## 三 Ubuntu

官网：https://ubuntu.com/

### 1. vm tools
[安装 Open VM Tools](https://docs.vmware.com/cn/VMware-Tools/11.3.0/com.vmware.vsphere.vmwaretools.doc/GUID-C48E1F14-240D-4DD1-8D4C-25B6EBE4BB0F.html) 

```bash

请确保已更新软件包索引：
sudo apt-get update

如果虚拟机具有 GUI（X11 等），请安装或升级 open-vm-tools-desktop：
sudo apt-get install open-vm-tools-desktop

否则，请使用以下命令安装 open-vm-tools：
sudo apt-get install open-vm-tools

```


<br/>

### 2. 语言和输入法


<br/>












<br/>


## 四 Manjaro

### 1. vm tools
Manjaro原版中的open-vm-tools与VMware不匹配

Github地址：https://github.com/rasa/vmware-tools-patches

```bash

1、卸载open-vm-tools
sudo pacman -R open-vm-tools

2、下载vmwaretools补丁
git clone https://github.com/rasa/vmware-tools-patches.git

3、进入vmware-tools-patches目录
cd vmware-tools-patches

4、运行补丁
sudo ./patched-open-vm-tools.sh

5、重启
reboot

```

<br>

### 2. AUR助手
Yay (Yet another Yogurt) 是一个 AUR 助手，它允许用户在 Manjaro 上安装和管理软件包系统。
在安装过程中，它会自动从 PKGBUIDS 安装软件包。Yay 取代了早已停产的 Aurman 和 Yaourt。
自发布以来，Yay 已被证明是出色的帮手，并且是原生 Pacman 包管理器的完美替代品。

```bash

sudo pacman -Syu                      # 更新系统

sudo pacman -S yay                    # 下载yay


yay -S 软件名                          # 安装软件
yay -R 软件名                          # 卸载软件
yay -Ss 软件模糊名（或者精确的名字）     # 搜索软件


yay -S google-chrome                  # 安装Chrome

```

<br>



### 3. 安装deb包

arch 系列如果要安装 dep 软件包，需要通过 deptap 工具转换后才能安装

```bash

1、安装debtap：使用yay安装debtap，

sudo pacman -S yay   # 如果没有yay，需要使用pacman安装yay：

sudo yay -S debtap   # 安装debtap：


2、deb包转换arch包，需要先运行下述命令，否则会出错：

sudo debtap -u

sudo debtap -q xxxxx.deb   #使用debtap将deb包转换为arch包

# 在转换过程中会提示是否需要编辑相关信息，直接按回车即可，转换完成后，将会生成一个后缀为.pkg.tar.rst的文件。


3、安装，使用pacman安装转换的arch包：

sudo pacman -U xxxx.pkg.tar.rst

```





<br>



## 五 常用Linux设置


### 1. 解压安装jdk

[jdk 8u202之前的版本下载地址](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html)   &nbsp;  [jdk全版本下载地址](https://www.oracle.com/java/technologies/oracle-java-archive-downloads.html)

- 先检查是否已经安装jdk

```shell
java -version

rpm -qa|grep openjdk -i   # 检查系统安装的openjdk

rpm -e --nodeps XXX(需要删除的软件名) #如果存在openjdk,就用这个命令逐一删除
```

- 创建jdk安装目录和软件包存储目录，并上传jdk文件。将文件解压剪贴到jdk安装目录后配置环境变量即可。

```shell
mkdir /usr/java
mkdir /home/software

tar -zxvf jdk-8u191-linux-x64.tar.gz
mv jdk1.8.0_191/ /usr/java/
```

- 配置环境变量，（修改profile文件）

```shell
vim /etc/profile  #配置环境变量，加入如下信息：(按esc退出插入模式后 :wq 保存退出)
```

```
export JAVA_HOME=/usr/java/jdk1.8.0_191
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=$JAVA_HOME/bin:$PATH
```

- 刷新profile，使其生效

```shell
source /etc/profile
```
<br>



### 2. http proxy

Windows + Linux虚拟机的 代理设置：

- 为避免Linux配置`clash`的一些麻烦，只在Windows上装有`clash`，并已有可用的服务
- 虚拟机采用桥接模式（似乎也有不采用桥接模式而成功的例子，但是我没有成功）
- `clash`开启`allow LAN`，并开启代理

<br>

linux下通过图形界面设置的代理，终端和浏览器一般不使用该代理，需要分别设置

```bash

# 终端设置(Linux 终端设置 HTTP 代理、注意只对当前终端有效)：
$ export http_proxy=http://192.168.5.64:7890
$ export https_proxy=http://192.168.5.64:7890

$ export http_proxy=socks5://127.0.0.1:1080
$ export https_proxy=socks5://127.0.0.1:1080

$ export ALL_PROXY=http://192.168.5.64:7890


# Linux 终端中取消代理设置：
$ unset http_proxy
$ unset https_proxy
$ unset ALL_RPOXY

```

注意：ping 使用的是 ICMP 协议，不支持代理。可以执行 `curl -vv https://www.google.com ` 看看有没有走代理。

永久代理设置：将代理命令写入配置文件 ~/.profile 或 ~/.bashrc 或 ~/.zshrc 中

<br>

```bash

# Git 设置代理：
git config --global http.proxy http://192.168.5.79:7890
git config --global https.proxy http://192.168.5.79:7890

# Git 取消代理设置：
git config --global --unset http.proxy
git config --global --unset https.proxy

```



<br>



### 3. 终端配色方案

#### 原生Shell配色

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


设置颜色: 在PS1中设置字符颜色的格式为：[\e[F;Bm]
F为字体颜色，编号为30-37
B为背景颜色，编号为40-47

格式：[\e[F;Bm]需要改变颜色的部分[\e[0m] , F B 值分别对应的颜色

30 40 黑色

31 41 红色

32 42 绿色

33 43 黄色

34 44 蓝色

35 45 紫红色

36 46 青蓝色

37 47 白色

```

<br>


### 4. On-my-zsh

什么是zsh: https://blog.csdn.net/lovedingd/article/details/124128721
和bash一样，zsh也是终端内的一个命令行解释器，简称：shell。顾名思义就是机器外面的一层壳，用于人机交互。接收用户或其他程序的命令，把这些命令转化成内核能理解的语言。

具体表现为其作用是用户输入一条命令，shell 就立即解释执行一条。不局限于系统、语言等概念、操作方式和表现方式等。比如：我们使用的cd、wget、curl和mount等命令。

传统的shell（如：bash），命令和显示的文字以单色为主；而zsh不仅支持彩色字体，还支持命令填充：

一般情况下，Linux是不自带zsh的，你可以使用命令查看，终端输入：

```bash
cat /etc/shells 
```
正常情况下，应该是没有/bin/zsh的, 解决方法很简单，使用apt-get或者yum安装即可

::: code-tabs#shell

@tab Centos

```bash
yum install zsh
```

@tab Ubuntu

```bash
apt-get install zsh
```
:::


安装后，重新使用`cat /etc/shells`命令查看，最后，设置为默认shell并重启终端：

```bash
chsh -s /bin/zsh

exit;
```

<br>


Oh-my-zsh十分简单，可以看看项目地址：https://github.com/ohmyzsh/ohmyzsh

官方配置非常简单，但是因为项目官方脚本在GitHub的原因，国内访问可能有点困难

官方安装-->Linux/Mac打开终端，输入官方提供的脚本：

```bash

sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

```
为了保证脚本能顺利运行，你的Linux/Mac服务器需要：

- 提前安装git、curl
- 可以成功连接GitHub
- 如果有~/.zshrc文件，最好提前备份

<br>

脚本安装, 考虑到官方的方法，需要连接GitHub；如果你的设备无法有效访问GitHub。可以使用下列的脚本：

```

zsh -c "$(curl -fsSL 'https://api.host.mintimate.cn/fileHost/public/download/1P0R')"

```
为了保证脚本能顺利运行，你的Linux/Mac服务器需要：
- 提前安装curl、unzip
- 如果有~/.zshrc文件，最好提前备份，否则本脚本自动更改原本的.zshrc文件为zshrcBak

<br>
手动安装
其实，手动配置重复的内容就是我写的脚本配置：

- 在oh-my-zsh的github主页，手动将zip包下载下来。
- 将zip包解压，拷贝至~/.oh-my-zsh目录。
- 执行cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
    或手动复制~/.oh-my-zsh/templates/zshrc.zsh-template内文件内容到~/.zshrc内。
    （如果没有~/.zshrc文件，可以手动创建）
- 重启终端或终端输入source ~/.zshrc使配置生效

<br>
On-my-zsh的功能和使用简介：

- 自带填充：主要使用到zsh的Tab功能

- 粘贴自动转义：
   使用Oh-my-zsh，默认是使用自动粘贴转义。但是这样容易出差错。
   为此，如果需要关闭自动转义，可以打开~/.zshrc文件，添加DISABLE_MAGIC_FUNCTIONS=true字段
   
zsh的强大不仅仅如此，还可以安装更多强大插件，感兴趣可以自己进行探索。
而Oh-my-zsh的使用也不仅仅如此，可以自行阅读开发者文档：https://github.com/ohmyzsh/ohmyzsh
---
article: true
date: 2022-04-06
category:
  - 虚拟机
  - Linux
tag:
  - Virtual Machines
  - VMware
  - Xshell
  - VM
  - Linux
  - CentOS
shortTitle: VM和Linux安装
title: Virtual Machines | Linux安装  | 终端工具
---



## VMware Workstation


### 虚拟交换机和网卡

在VMware`虚拟网络编辑器`中，也有三个 **虚拟交换机** 分别对应不同的网络模式：
::: info VMware相关网络虚拟设备
VMnet0：这是VMware用于虚拟 `桥接网络` 下的虚拟交换机;

VMnet1：这是VMware用于虚拟 `Host-Only` （仅主机）网络下的虚拟交换机;

VMnet8：这是VMware用于虚拟 `NAT网络` 下的虚拟交换机;
:::


![](https://image.ventix.top/img02/20220122173703373.png)


在主机的`网络连接`里面可以看到多了两块 **网卡** ：
```bash
VMware Network Adapter VMnet1：这是Host用于与Host-Only虚拟网络进行通信的虚拟网卡;

VMware Network Adapter VMnet8：这是Host用于与NAT虚拟网络进行通信的虚拟网卡;
```

vmware为我们提供了三种网络工作模式，它们分别是：Bridged(桥接模式)、NAT(网络地址转换模式)、Host-Only(仅主机模式)。


### Bridged(桥接)

桥接模式（Bridge Mode）通过将两个或多个局域网连接在一起，形成一个扩展的局域网，使得这些局域网的设备能够互相通信。在桥接模式中，设备之间的数据流量可以直接传输，并且不经过路由器进行转发。

桥接模式下所有虚拟机都和主机在同一网段，可以把它们看成是"平等"的关系

::: tip Bridged(桥接模式)配置静态IP
1. 在VM的虚拟机 `设置` --> `网络适配器` 将网络连接模式选择为桥接模式
    并确保 `编辑` --> `虚拟网络编辑器` 中将桥接 `VMnet0` 桥接至主机中的正确网卡
    ![](https://image.ventix.top/img02/20220122211601570.png)
2. 先通过 `ipconfig` 查看宿主机的网络信息（因为桥接模式虚拟机与宿主机在同一网段下）
    ```bash
   连接特定的 DNS 后缀 . . . . . . . :
   IPv4 地址 . . . . . . . . . . . . : 192.168.243.54
   子网掩码  . . . . . . . . . . . . : 255.255.255.0
   默认网关. . . . . . . . . . . . . : 192.168.243.158
    ```
3. 进入虚拟机修改配置文件，以CentOS7为例：
```bash
vi /etc/sysconfig/network-scripts/ifcfg-ens33   # 打开ifcfg-ens33⽂件，修改配置
```
在桥接模式下，虚拟机IP地址需要与主机在同一网段，如果需要联网，则网关与DNS需要与主机网卡一致: 
 ```bash
BOOTPROTO=static                  # 更改为静态 
ONBOOT=yes                        # 设置开机⾃动启⽤⽹络连接 
IPADDR=192.168.243.222            # 虚拟机的静态ip，
NETMASK=255.255.255.0             # 和 主机 的子网掩码一致 
GATEWAY=192.168.243.158           # 和 主机 的网关IP一致 
DNS1=192.168.243.158              # 和 主机 的网关IP一致 
```
修改完成后重启网络：`service network restart `

:::

验证联网情况【可以和本机互通、也可以访问互联网】

::: info 主机防火墙及入站规则配置
注意在虚拟机内能 ping 通外网，如`www.baidu.com`，但是 ping 主机 IP 没有任何反应，这种情况大概率是主机防火墙阻止了 ICMP，可以添加一条入站规则来解决：

打开“Windows Defender 防火墙” -> “高级设置” -> “入站规则”，创建一条允许 ICMPv4 或 ICMPv6 的规则
:::

桥接模式IP地址资源有限，存在IP冲突的可能，主机所在网络环境不稳定或者设备多时不建议使用




### NAT模式
在NAT(网络地址转换模式)中，会使用到VMnet8虚拟交换机，物理机上的 `VMware Network Adapter VMnet8 虚拟网卡` 将会和 `VMnet8交换机`相连接，来实现物理机与虚拟机之间的通信。



::: important NAT(网络地址转换模式)设置
1. 在系统的虚拟机设置中将网络连接模式设置为NAT模式：

2. 通过 VMware的【虚拟网络编辑器】，查看并记住VMnet8 对应的 网关地址、子网掩码等信息

3. 进入虚拟机修改配置文件， 具体操作参照：[虚拟机静态网络IP设置](#虚拟机静态网络ip)
:::

注意：`VMware Network Adapter VMnet8 虚拟网卡` 仅仅是用于主机和VMnet8网段通信使用，它并不为VMnet8网段提供路由功能，处于虚拟NAT网络下的Guest是使用虚拟的NAT服务器连接的Internet的。

VMware Network Adapter VMnet8虚拟网卡它仅仅是为Host和NAT虚拟网络下的Guest通信提供一个接口，所以，即便禁用掉这块虚拟网卡，虚拟机仍然是可以上网的，只是物理机将无法再访问虚拟机了。



### 仅主机模式

Host-Only(仅主机模式) 可看成是NAT模式去除了虚拟NAT设备，然后使用VMware Network Adapter VMnet1虚拟网卡连接VMnet1虚拟交换机来与虚拟机通信的，Host-Only模式将虚拟机与外网隔开，使得虚拟机成为一个独立的系统，只与主机相互通讯。

网络: **虚拟机是不可访问主机和互联网的，但主机可以访问虚拟机**

更多信息参照：[虚拟机网络设置](https://cloud.tencent.com/developer/article/2452065)



### 虚拟机静态网络IP

NAT模式下虚拟机IP可能会变，我们可以通过设置静态 IP ，这样的话 IP 就不会发生改变

VMware 点击 编辑 ——> 虚拟网络编辑器 (如图：)

![](https://image.ventix.top/img01/202101101724339.png)

注意图中的 NETMASH 有误，应该是 `NETMASK`，该选项也可以配置为：`PREFIX=24`

::: code-tabs#shell

@tab Ubuntu

```bash
sudo vim /etc/netplan/00-installer-config.yaml   # 文件名可能会不同
sudo netplan apply                               # 应用更改
```

@tab Centos7

```bash
ip addr
vim /etc/sysconfig/network-scripts/ifcfg-ens33
service network restart  # 刷新网络服务 centos8使用: ifup  ens33
```


@tab:active Rocky

```bash
ifconfig
vim /etc/sysconfig/network-scripts/ifcfg-ens160

# NetworkManager 提供了一个命令行工具 nmcli 来管理和配置网络连接
sudo nmcli connection reload && sudo nmcli connection up ens160

# 也可以使用 systemctl 重启 NetworkManager 服务
systemctl restart NetworkManager
```
:::

::: details CentOS —— ifcfg-ens33

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
IPADDR=192.168.16.10
NETMASK=255.255.255.0
GATEWAY=192.168.16.2
DNS1=192.168.16.2
```
:::

::: details Ubuntu —— 00-installer-config.yaml

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

<br/>

### 添加硬盘或扩容

1. 给Linux虚拟机添加硬盘

关机后在虚拟机编辑中添加硬盘，选择类型（传统硬盘如SATA、SCSI等，固态硬盘SSD）和大小后确定即可

再次开机时选择 `打开电源时进入固件` 调整系统盘的顺序正确即可

进入Linux系统后可以使用 `lsblk` 命令查看硬盘信息，确保硬盘被正确识别后进行 [分区和挂载](/tool/Linux/setting.md#硬盘分区和挂载)

---

2. 给VMware下的Linux扩展磁盘空间（以CentOS7为例）
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

### 虚拟机自启动设置

创建启动/关闭脚本: 

```bash
# 在系统的某个安静的盘中创建一个vm_start.bat文件，然后使用编辑器打开。写入: 
"C:\Program Files (x86)\VMware\VMware Workstation\vmrun.exe" start "D:\VirtualMachines\DevMachines\DevMachines.vmx" nogui


# 再次创建一个vm_stop.bat文件
"C:\Program Files (x86)\VMware\VMware Workstation\vmrun.exe" stop "D:\VirtualMachines\DevMachines\DevMachines.vmx"

#测试运行文件: 双击启动文件vm_start.bat，如果弹出dos窗口且虚拟机启动则无误,双击停止文件vm_stop.bat，如果弹出dos窗口且虚拟机停止则无误
```

<br/>

 添加到自启动任务: 

`Win+ R`  -> `gpedit.msc` -> 用户配置 -> windows设置 -> 鼠标双击脚本(登录/注销) -> 鼠标双击“登录”或“注销”分别添加启动、关闭脚本

【Q】主机访问不到虚拟机的服务的解决办法: 检查防火墙状态

<br>




## Oracle VirtualBox

### VirtualBox安装

1. 下载安装 [Virtual box](https://www.virtualbox.org/) 的`主程序`和`拓展包`，安装后修改虚拟机存放位置（需要cpu开启虚拟化）

   <br/>

2. 下载安装 [Vagrant](https://www.vagrantup.com/) （ Vagrant 是没有图形界面的，安装程序会自动把安装路径加入到 PATH 环境变量 ）

```
vagrant version
```

- 配置vagrant (虚拟机镜像文件存储目录，默认为：C:\Users\用户名\.vagrant.d)  —— `VAGRANT_HOME`

![](https://image.ventix.top/img01/202101101726397.png)

<br/>


###  下载Vagrant镜像
   使用 Vagrant 创建虚机时，需要指定一个镜像，也就是 box。开始这个 box 不存在，所以 Vagrant 会先从网上（[镜像网站](https://app.vagrantup.com/boxes/search)）下载，然后缓存在本地目录中。但默认下载往往会比较慢，我们可以自己下载镜像文件。常用的两个 Linux 操作系统镜像的下载地址：

- CentOS [官网下载](http://cloud.centos.org/centos/) ，[CentOS-7.box （点击下载）](http://cloud.centos.org/centos/7/vagrant/x86_64/images/CentOS-7.box) 列表中有一个 vagrant 目录，选择其中的 .box 后缀的文件下载即可。

- Ubuntu [官网下载](http://cloud-images.ubuntu.com/) ，[清华大学镜像站下载](https://mirror.tuna.tsinghua.edu.cn/ubuntu-cloud-images/) ，同样选择针对 vagrant 的 .box 文件即可。

添加 box ：接下来我们需要将下载后的 .box 文件添加到 vagrant 中：

```shell
# 如果这是第一次运行，此时 VAGRANT_HOME 目录下会自动生成若干的文件和文件夹，其中有一个 boxes 文件夹，
# 这就是要存放 box 文件的地方。
vagrant box list

#执行 vagrant box add 命令添加 box: (命令后面跟着的是镜像文件的路径，通过 --name centos-7 为这个 box 指定名字)
vagrant box add E:\Package\VM\VirtualBox\CentOS-7.box --name centos-7

vagrant box list        #再次查询，可以看到有了一个 box
```

<br/>


### Vagrant新建虚拟机
先进入vagrant工作目录（Vagrantfile所在的目录）再执行命令
```bash
vagrant init centos-7

vagrant up
```
首次执行会先安装再启动，之后就是启动的功能（注意要在Vagrantfile所在的目录执行）

::: info Vagrant常用命令
```shell
vagrant status         #查看虚拟机状态
vagrant ssh            #以 vagrant 用户直接登入虚拟机中，使用 exit; 退出

vagrant halt           #关闭虚拟机
vagrant suspend        #暂停虚拟机
vagrant resume         #恢复虚拟机
vagrant reload         #重载虚拟机(可能会重启失败，需要重启宿主机才能开机虚拟机)
vagrant destroy        #删除虚拟机
```
:::


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










## Linux安装和设置

### CentOS

安装CentOS时，推荐使用自定义分区，使用标准分区方式分为：`/boot` 1G，`/swap` 4G，剩余全给 `/`

其他推荐的设置：

- 注意选择安装 `server`，没必要使用默认的GUI界面
- 将时区选择为 `Asia/Shanghai`
- 配置静态IP：IPv4选项中选择 `munual` 而不是 `dhcp` , 并添加自定义IP


::: tip Windows Terminal 连接 VM 中的虚拟机
前置条件：VM中的Linux虚拟机需要运行 sshd 服务，且防火墙开放22端口

```bash
# Windows Terminal 中执行下列命令连接虚拟机
ssh root@192.168.243.222
```
虚拟机的IP地址可通过 `ip addr show` 或者 `ifconfig` 查看

第一次连接时，可能会提示你确认主机的指纹，输入 `yes` 并按回车键继续，输入密码即可

**配置 Windows Terminal 快速访问**
在Windows Terminal 中，通过 `设置` --> `添加新配置文件` :
```bash
{
    "name": "CentOS7",
    "commandline": "ssh root@192.168.243.222",
    "startingDirectory": "%USERPROFILE%",
    "icon": "xxx.png"
}
```
:::

在重新安装系统，但是使用了与之前相同的IP，在终端中可能会出现：

```bash
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ED25519 key sent by the remote host is
SHA256:2ULWhC8+ftFced58wmhGFvmaC8ni0nXq5lN3IoMQ0hQ.
Please contact your system administrator.
Add correct host key in C:\\Users\\admin/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in C:\\Users\\admin/.ssh/known_hosts:13
Host key for 192.168.16.80 has changed and you have requested strict checking.
Host key verification failed.
```
此时执行下列命令（从本地 `~/.ssh/known_hosts` 文件中删除与 该 IP 地址 相关联的条目）：

```bash
ssh-keygen -R 192.168.16.80   # IP换成自己服务器的地址
```


---



### Ubuntu

官网：https://ubuntu.com/

**1. vm tools**
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

**2. 语言和输入法**


<br/>












<br/>


### Manjaro

**1. vm tools**
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

**2. AUR助手**
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



**3. 安装deb包**

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




### On-my-zsh

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
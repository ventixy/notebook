---
article: true
date: 2025-03-08
category:
  - NUC
  - Ubuntu
tag:
  - NUC8
  - Ubuntu
shortTitle: Intel NUC8
title: NUC8折腾记录
order: 40
---


## NUC8黑苹果



---

## NUC8安装Ubuntu

Intel的NUC8i5BEK用来搞黑苹果性能还是不太够，所以打算换个Ubuntu试试。

### 准备工作

1. 下载Ubuntu镜像（如：`ubuntu-24.10-desktop-amd64.iso`）：[华为云下载](https://repo.huaweicloud.com/ubuntu-releases/24.10/)

2. 制作/烧录安装U盘, 我使用的是 [balenaEtcher](https://etcher.balena.io/), 下载完工具后插入U盘，然后选择镜像文件，点击`Flash!`即可。

---

### 安装Ubuntu

启动NUC8，按下`F2`进入BIOS设置，将 U 盘的启动优先级设置为最高，然后保存并退出。

选择安装系统后开始安装，安装过程中会有一些设置，这里不再赘述，如果发现 wifi 和蓝牙相关驱动报错先无视即可，安装完成后再手动安装相应驱动

安装完成后，可以安装一些常用的软件：
```bash
sudo apt install -y openssh-server
sudo apt install net-tools -y
```

注意：安装完成后，如果没有没有网线，可利用手机的 USB共享网络 来连接网络。





---

### 安装三方驱动

由于我的 NUC 买的时候就是硬改过的，所以 wifi 和 蓝牙 Ubuntu原生并没有驱动，安装系统后需要手动安装下驱动

```bash
sudo apt purge bcmwl-kernel-source
sudo apt-get install -y broadcom-sta-source
sudo apt-get install -y broadcom-sta-dkms
sudo apt-get install -y broadcom-sta-common
```

参照：
- https://bugs.launchpad.net/bugs/1878045
- https://bugs.launchpad.net/ubuntu/+source/bcmwl/+bug/1878045



---
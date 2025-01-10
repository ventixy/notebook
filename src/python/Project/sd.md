---

order: -1
title: Stable diffusion
icon: tab

---

## Webui的安装 

windows下Anaconda环境安装stable-diffusion-webui

### 相关工具的准备

所需工具：git, anaconda, pytorch环境

相关内容参照：[Python常用环境的安装](/python/BasicSyntax/env)


### 下载源码
准备好环境后就可以拉代码了：
```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
```

### 依赖库安装

可以创建/克隆一个新环境 sdw 出来操作：
```bash
conda create --name sdw --clone pytorch
conda activate sdw

# 进入 stable-diffusion-webui 目录安装项目依赖包
pip3 install -r requirements.txt 
```

### 修改启动脚本

使用conda就不需要stable-diffusion-webui自己去安装venv虚拟环境了，可以通过修改`webui-user.bat`实现：

1) 复制一个`webui-user.bat`，命名为 `webui-new.bat`

2) 将`VENV_DIR`设置为"-"，指示其跳过venv的安装

3) 添加启动参数，使其可以在局域网内访问

```bash
@echo off

set PYTHON=
set GIT=
set VENV_DIR=-
set COMMANDLINE_ARGS= --listen --enable-insecure-extension-access

call webui.bat
```

### 首次运行

在命令行中，确保已通过conda激活了对应虚拟环境时，可直接通过下面的命令启动：
```bash
.\webui-new.bat
```
第一次运行时还需要很长时间去下载一些比较大的扩展程序和模型...


## Webui的使用
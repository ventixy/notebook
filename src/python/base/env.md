--- 

order: 1
title: Python环境安装

---

## Python

使用Python进行编程需要安装Python解释器，以及一些常用的第三方库。

### 下载和安装

Python解释器可以从官网下载：

Python官网地址：https://www.python.org/

Python下载地址：https://www.python.org/downloads/ （选择平台后下载即可）

::: warning Python环境变量
注意安装过程中会出现 `Add Python to PATH` 选项，勾选即可，如果没有选择或错过，则需手动添加一下环境变量，这样才能在命令行中使用Python命令
:::


常用的第三方库有numpy、pandas、matplotlib等，可以使用pip命令安装。

### 第三方库管理
python的第三方库管理器一般都使用pip，可以根据所开发项目的需要，使用pip相关命令安装不同库

Pyhon3.4以后，pip都默认跟Python一块安装，pip在python安装目录中的scripts目录下

::: info pip常用命令
```bash
pip --version                   # 查看pip版本
pip list                        # 查看已经安装的第三方库

# 使用pip安装（指定版本的）第三方库（可以使用参数i指定pip源）：
pip install robotframework==2.8.7 -i https://pypi.tuna.tsinghua.edu.cn/simple

pip uninstall requests          # 卸载指定的已安装库
pip install -U requests         # 更新指定的库
```
更新pip版本：
```bash
python -m pip install --upgrade pip 
```
:::

通常在实际应用和项目开发中，都需要安装多个库，此时可以通过使用 `requirements.txt` 文件的方式批量安装。

将本地的库和版本号导出到`requirements.txt`文件中:
```bash
pip freeze > requirements.txt
```

通过`requirements.txt`文件批量安装：
```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

## Anaconda

Anaconda集成了Python解释器和常用的第三方库，可以方便地进行科学计算和数据分析

Anaconda官网地址：https://www.anaconda.com/

Anaconda下载地址：https://www.anaconda.com/download/ （选择对应平台下载即可）

::: info Anaconda相关环境变量
安装了Anaconda后同样需要检查并配置环境变量，通常需要需要如下两个（以安装在 `C:\ProgramData` 为例）：

- `C:\ProgramData\anaconda3` 该目录下包含python.exe，可使用 `python -V`命令进行检验
- `C:\ProgramData\anaconda3\Scripts`  conda自带脚本，配置后可使用 `conda info` 等命令
:::


### conda源配置

- conda 可以通过修改`.condarc` 文件来配置镜像源。由于 Windows 用户可能无法直接创建名为`.condarc` 的文件，可先在 cmd 中执行以下命令，生成.condarc 文件后，再进行修改。

```bash
conda config --set show_channel_urls yes
```
执行玩上述命令后，生成的.condarc 文件位于用户文件夹中 C:\Users\xxx，(xxx)是你实际的用户名

打开`.condarc` 文件，将其中内容替换为以下代码，保存退出即可：
```
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch-lts: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  deepmodeling: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/
```


### conda常用命令
```bash
conda --version                                  # 查看conda版本
conda update conda                               # 更新至最新的conda

conda update --all                               # 更新当前环境所有包
conda update package_name                        # 指定包至最新

conda env list                                   # 查看已有的虚拟环境
conda create -n python_3.9 python=3.9            # 创建虚拟环境
conda create --name Py_3.9 --clone python_3.9    # 复制虚拟环境
conda activate python_3.9                        # 激活虚拟环境

conda remove -n python_3.9 --all                 # 删除虚拟环境

conda list                                       # 查看当前环境所有包情况
conda search numpy                               # 查看numpy有哪些版本

conda install numpy                              # 安装numpy包在当前环境
conda remove numpy                               # 删除当前环境中的numpy包

conda config --remove-key channels               # 回复默认源
```


### conda虚拟环境
#### 创建虚拟环境

使用Anaconda的一大原因是其可以管理多个版本的Python环境，通过Anaconda可以创建不同的虚拟环境并指定所需的Python版本，即可以在同一台计算机上同时管理和使用多个不同版本的Python。这对于在不同项目中使用不同版本的Python或测试代码在不同版本中的兼容性非常有用。

可以使用如下命令查看系统中的虚拟环境：
```bash
conda env list          # 查看虚拟环境列表
conda info              # 查看Anaconda相关配置信息，包括虚拟环境的存储位置等
```

::: danger Anaconda创建虚拟环境
打开终端或命令提示符窗口，在命令中指定要使用的Python版本来创建虚拟环境:
```bash
# 创建一个名为"myenv"的环境，并使用Python 3.7版本
conda create --name myenv python=3.7  

# 指定目录位置并创建一个名为 python3_7 的环境
conda create --prefix=C:\ProgramData\anaconda3\envs\python3_7 python=3.7

# 克隆环境
conda create --name sdw --clone pytorch
```
:::

#### 激活虚拟环境
创建虚拟环境后，你需要激活它才能在其中工作。运行以下命令来激活名为"myenv"的虚拟环境：

::: code-tabs#shell

@tab macOS/Linux

```bash
source activate myenv
```

@tab:active Windows

```bash
conda activate myenv
```
:::

在虚拟环境激活后，你可以使用conda命令来安装需要的包和软件。例如，要安装numpy包，运行以下命令：
```bash
conda install numpy
```
一旦你的虚拟环境激活并安装了所需的包和软件，你可以在该环境中运行你的Python程序或执行其他操作。确保始终在虚拟环境中执行你的代码，以隔离不同环境中的Python版本和包依赖。

#### 退出虚拟环境

当你完成工作或需要切换到另一个虚拟环境时，可以通过以下命令退出当前环境：
::: code-tabs#shell

@tab macOS/Linux

```bash
source deactivate
```

@tab:active Windows

```bash
conda deactivate
```
:::

如果不再需要进行其他任务，直接关闭命令行即可。


#### 删除虚拟环境

注意删除之前要先退出待删除的虚拟环境
```bash
conda deactivate
conda remove -n tf2 --all
```


## AI环境搭建

### pytorch

使用pytorch一定要先去官网，官网会自动获取当前电脑的配置信息并给出相关包的安装命令，我们唯一需要注意的只有自己显卡驱动支持的最新CUDAversion即可，可以使用下面的命令查看：
```bash
nvidia-smi
```
若非要使用C++等其他方式进行开发任务，单纯的使用pytorch只需要安装pytorch（自带cuda和cudnn库）就行了
pytorch官网：https://pytorch.org/  

或者直接访问：[StartLocally](https://pytorch.org/get-started/locally), 也可以访问其 [历史版本](https://pytorch.org/get-started/previous-versions/)

```bash
# 先利用conda创建并激活一个适用于pytorch的虚拟环境
conda create -n pytorch python=3.8
conda activate pytorch

# 执行官网页面给你生成的pytorch安装命令
conda install pytorch torchvision torchaudio pytorch-cuda=11.8 -c pytorch -c nvidia
```
安装完成后启动python,检查是否可以正常使用：
```python
import torch
print(torch.cuda.is_available())
```
返回是`True`即可



### tensorflow

30系显卡深度学习环境配置：https://blog.csdn.net/weixin_44791964/article/details/120657664




## Tesseract OCR

Tesseract，一款由HP实验室开发由Google维护的开源OCR（Optical Character Recognition , 光学字符识别）引擎

- 官方网站：https://github.com/tesseract-ocr/tesseract
- 官方文档：https://github.com/tesseract-ocr/tessdoc
- 语言包地址：https://github.com/tesseract-ocr/tessdata
- 下载地址：https://digi.bib.uni-mannheim.de/tesseract/

::: tip 安装
这里下载编译好的exe来安装：
1. 安装过程可以附带选择要安装的语言包（开梯子的话），另外可以单独下载语言包，复制到tessdata文件夹里面即可。
2. 设置环境变量，例：`C:\Program Files\Tesseract-OCR`
3. 检查查看是否安装成功

```bash
# 查看版本
tesseract -v

# 查看已安装的可识别语言
tesseract --list-langs
```
::: 


::: info Python使用示例
- 安装pytesseract库
```bash
pip install pytesseract -i https://pypi.tuna.tsinghua.edu.cn/simple
```

- 示例代码
```python
import pytesseract
from PIL import Image
file = r"my.png"

# 配置 Tesseract OCR 引擎的路径（根据您的实际安装路径进行设置）
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# 建议图像识别前，先对图像进行灰度化和 二值化，以提高文本识别率
# image = Image.open(file)
# Img = image.convert('L')   # 灰度化
# #自定义灰度界限，这里可以大于这个值为黑色，小于这个值为白色。
# threshold可根据实际情况进行调整(最大可为255)。
# threshold = 180
# table = []
# for i in range(256):
#     if i < threshold:
#         table.append(0)
#     else:
#         table.append(1)
# photo = Img.point(table, '1')  #图片二值化
# #保存处理好的图片
# photo.save(newfile)

image = Image.open(file)
# 解析图片，lang='chi_sim'表示识别简体中文，默认为English
# 如果是只识别数字，可再加上参数config='--psm 6 --oem 3 -c tessedit_char_whitelist=0123456789'
content = pytesseract.image_to_string(image, lang='chi_sim')
print(content)
```
:::

::: danger 注意事项
使用时要注意环境变量的问题，一般有下面两种方式：
- 将tesseract安装目录添加至电脑的环境变量。

- 在代码中指定tesseract的路径
```python
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```
:::

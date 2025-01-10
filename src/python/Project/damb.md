---

order: -5
title: DAMB
icon: app

---

## 一 项目环境准备

### 1. 训练环境准备

基本环境要求：Anaconda的Python开发环境、N卡及相关机器学习相关软件


### 2. 使用环境搭建

不同于训练环境，使用环境不需要 cuda 相关的包, 操作前先配置好 conda 源，下载会更快

```bash
conda create -n yolov8 python=3.10
conda activate yolov8

pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

pip uninstall opencv_python
pip install opencv-contrib-python

```

修改好角色配置文件，启动`Main.py`即可



## 二 图像处理及目标检测

### 1. 获取窗口截图

刚开始我们需要先获取供训练AI所需的图片，这里需要使用一些Python的第三方库：
pywin32, numpy, opencv-python 

这里简单描述一下实现思路：先使用 pywin32 获取指定的窗口句柄，然后利用相关API获取到位图对象

```python
import win32con
import win32gui
import win32ui

hwnd = win32gui.FindWindow(None, "xxx")
print("窗口句柄：", hwnd)

# 游戏窗口基本大小信息
left, top, right, bot = win32gui.GetWindowRect(hwnd)
width = right - left
height = bot - top
print(width, height)

# 获取窗口设备上下文句柄
target_dc = win32gui.GetWindowDC(hwnd)
# 将窗口设备上下文句柄转换为设备上下文对象
img_dc = win32ui.CreateDCFromHandle(target_dc)
# 创建一个兼容的设备上下文对象
mem_dc = img_dc.CreateCompatibleDC()

# 创建位图对象(未分配内存)
picture_bitmap = win32ui.CreateBitmap()
# 为位图对象分配内存，并创建一个与原始设备上下文对象兼容的位图
picture_bitmap.CreateCompatibleBitmap(img_dc, width, height)

# 将位图对象选入到设备上下文对象、以便进行绘图操作
mem_dc.SelectObject(picture_bitmap)
# 将原始设备上下文中的内容复制到位图对象中
mem_dc.BitBlt((0, 0), (width, height), img_dc, (0, 0), win32con.SRCCOPY)

# 此时位图对象picture_bitmap中存储了从窗口截取的图像

# 保存位图对象到文件
picture_bitmap.SaveBitmapFile(mem_dc, "target.jpg")

# 释放资源
mem_dc.DeleteDC()
win32gui.DeleteObject(picture_bitmap.GetHandle())
img_dc.DeleteDC()
win32gui.ReleaseDC(hwnd, target_dc)

```

### 2. 视频转换为图片

在后续使用labelImg标记图片共yolov训练时，需要使用大量图片，自己截图显然太慢了，除了小部分需要特定截图外，多数图片都可以通过录屏后转换为图片即可

通过 openCV 将视频转换为图片的示例：

```python
import cv2
import os
import time

vidcap = cv2.VideoCapture(r'./video/107.mp4')
tag = "107"
success, image = vidcap.read()
count = 0
folder_count = 0
real_num = 0
localtime = time.localtime(time.time())   #获取当前时间
time = time.strftime('%Y%m%d', time.localtime(time.time()))      #把获取的时间转换成"年月日格式”
while success:
    # 每xx帧保留一张图片
    if count % 50 == 0:
        folder_name = time + tag + "-%03d" % folder_count
        if not os.path.exists(folder_name):
            os.makedirs(folder_name)
        cv2.imwrite(folder_name + "/" + time + tag + "%05d.jpg" % count, image)  # save frame as JPEG file
        # 每xxx张图片新建一个目录
        real_num += 1
        if real_num % 500 == 0:
            folder_count += 1
    success, image = vidcap.read()
    count += 1
print("count: ", count)
print("real: ", real_num)
```

### 3. LabelImg图像标记

先安装 labelimg :
```bash
pip install labelimg -i https://pypi.tuna.tsinghua.edu.cn/simple
```

直接在命令行启动即可：
```bash
labelimg
```

常用快捷键：
1. 常用操作

- 创建矩形 w
- 保存 Ctrl + s
- 下一张 d
- 上一张 a
- Ctrl + z：撤销上一次操作
- Ctrl + y：重做上一次撤销操作

2. 标注工具选择

labelimg支持多种标注工具，包括矩形、圆形、线条和点等。使用快捷键可以方便地切换标注工具。

- r：选择矩形工具
- c：选择圆形工具
- l：选择线条工具
- p：选择点工具

3. 标注形状调整

对于不同的标注形状，我们可以使用不同的快捷键进行调整。

- Alt + ↑：矩形或圆形高度增加
- Alt + ↓：矩形或圆形高度减少
- Alt + →：矩形或圆形宽度增加
- Alt + ←：矩形或圆形宽度减少
- w：线条宽度增加
- s：线条宽度减少

4. 标注边缘微调

当我们标注完一个物体后，我们可以使用快捷键微调标注的边缘，以精确地覆盖物体。

- e：选中当前标注框，并进入微调模式
- w：上移
- s：下移
- a：左移
- d：右移
- i：上调整大小
- k：下调整大小
- j：左调整大小
- l：右调整大小


### 4. Yolov目标检测


## 三 串口通信及自动操作

### 1. CH9329
CH9329 芯片是由沁恒生产的一种串口转HID键盘鼠标芯片。
它可以将上位机发送的串口数据转换为标准的USB键鼠设备信号，
并将其发送给下位机，从而实现硬件级别的键鼠模拟。

官网信息：

https://special.wch.cn/zh_cn/USBChips/#/

https://www.wch.cn/products/CH9329.html


Github参考：

https://github.com/beijixiaohu/CH9329_COMM


```bash
pip install ch9329Comm -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install pyserial  -i https://pypi.tuna.tsinghua.edu.cn/simple 
pip install pyautogui -i https://pypi.tuna.tsinghua.edu.cn/simple
```



## 四 相关特殊功能实现





















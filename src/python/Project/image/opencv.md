--- 

order: 9
title: OpenCV图像处理
icon: flex

---

## OpenCV快速上手

OpenCV（Open Source Computer Vision Library）是一个开源的计算机视觉和图像处理库，提供了丰富的函数和工具，用于处理图像、视频和计算机视觉任务。OpenCV库支持多种编程语言，其中就包括Python。

下面是关于OpenCV库的详细信息：

1. 官方网站：https://opencv.org/
2. 官方教程地址：https://docs.opencv.org/5.x/d6/d00/tutorial_py_root.html
3. 官方GitHub仓库：https://github.com/opencv/opencv

### 安装和使用示例

安装OpenCV库：
可以使用pip命令安装OpenCV库：
```bash
pip install opencv-python -i https://pypi.tuna.tsinghua.edu.cn/simple
```

下面是OpenCV库的简单使用示例代码：

```python
import cv2

# 读取图像
image = cv2.imread('image.jpg')

# 显示图像
cv2.imshow('Image', image)
cv2.waitKey(0)
cv2.destroyAllWindows()

# 将图像转换为灰度图像
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# 保存灰度图像
cv2.imwrite('gray_image.jpg', gray_image)
```

上述示例代码展示了一些常见的OpenCV库的用法：

1. 使用`cv2.imread()`函数读取图像文件，并将图像存储为一个NumPy数组。
2. 使用`cv2.imshow()`函数显示图像。这个函数创建一个窗口并在其中显示图像。`cv2.waitKey(0)`会等待用户按下任意键后关闭窗口。
3. 使用`cv2.cvtColor()`函数将彩色图像转换为灰度图像。这个函数采用一个彩色图像数组和一个颜色转换参数作为输入，并返回一个灰度图像数组。
4. 使用`cv2.imwrite()`函数将灰度图像保存为图像文件。

以上只是OpenCV库的简单示例，该库还提供了许多其他功能，如图像处理、图像滤波、边缘检测、图像特征提取、目标检测、图像拼接、视频处理等。您可以参考OpenCV官方文档和示例代码，了解更多关于OpenCV库的详细用法和功能。



### 默认通道顺序

OpenCV库的默认通道顺序为BGR（蓝色、绿色、红色），与经常使用的RGB（红色、绿色、蓝色）顺序不同。这种差异起源于历史原因，主要有以下几个方面的考虑：

1. 兼容性：
    - OpenCV最初是在Intel架构下开发的，而在Intel的处理器架构中，像素的字节顺序是BGR顺序。
    - 为了保持与原始数据和其他软件的兼容性，OpenCV选择了BGR顺序作为默认通道顺序。

2. 与硬件的兼容性：
    - 在某些硬件和图像采集设备中，例如摄像机、摄像头等，也采用了BGR顺序。
    - 通过在默认情况下使用BGR顺序，OpenCV可以更方便地与这些设备进行集成和交互。

3. 传统习惯：
    - 一些早期的计算机视觉库和软件工具采用了BGR顺序，而OpenCV的设计考虑了与这些传统工具的兼容性。
    - 在某些领域，特别是在计算机视觉和图像处理领域，BGR顺序在一些算法和研究中被广泛使用。

虽然OpenCV的默认通道顺序是BGR，但它提供了函数和方法来进行颜色空间转换，如`cv2.cvtColor()`函数可以方便地在BGR和RGB之间进行转换。因此，可以根据需要在OpenCV中灵活地处理不同的颜色通道顺序。

对于一些常见的图像处理任务，如显示图像、保存图像等，可能需要注意默认通道顺序的差异，并在使用OpenCV时正确处理通道顺序以获得正确的结果。

::: tip 查看OpenCV（cv2）图像对象的通道类型和顺序
要查看OpenCV（cv2）图像对象的通道类型和顺序，可以使用`cv2.imshow()`函数显示图像，通过观察颜色来判断：

```python
import cv2

# 读取图像
image = cv2.imread('image.jpg')

# 显示图像
cv2.imshow('Image', image)
cv2.waitKey(0)
cv2.destroyAllWindows()
```
:::


### 基本图像数据信息

在OpenCV中，`shape`是用于获取图像数据的维度和通道数的属性。它返回一个包含图像高度、宽度和通道数的元组。以下是对`shape`属性以及类似的常用属性和方法的详细解释：

1. `shape`属性：
    - `shape`属性用于获取图像数据的维度和通道数。
    - 对于彩色图像，`shape`属性返回一个包含高度、宽度和通道数的元组，例如`(height, width, channels)`。
    - 对于灰度图像，`shape`属性返回一个包含高度和宽度的元组，例如`(height, width)`。

2. 其他常用属性和方法：
    - `dtype`属性：获取图像数据的数据类型，例如`uint8`表示无符号8位整数。
    - `size`属性：返回图像数据的总像素数，即高度乘以宽度。
    - `ndim`属性：返回图像数据的维度数，对于灰度图像为2，对于彩色图像为3。
    - `copy()`方法：创建图像数据的副本，可以对副本进行修改而不影响原始图像。
    - `resize()`方法：调整图像的大小，可以指定新的尺寸和插值方法。

以下是一个示例代码，演示如何使用上述属性和方法：

```python
import cv2

# 读取图像
image = cv2.imread('image.jpg')

# 获取图像形状
height, width, channels = image.shape
print("图像形状：", width, "x", height, "x", channels)

# 获取图像数据类型
data_type = image.dtype
print("图像数据类型：", data_type)

# 获取图像总像素数
total_pixels = image.size
print("图像总像素数：", total_pixels)

# 获取图像维度数
num_dims = image.ndim
print("图像维度数：", num_dims)

# 创建图像数据的副本
image_copy = image.copy()

# 修改副本图像的一部分
image_copy[100:200, 100:200] = [255, 0, 0]  # 将一个区域设置为蓝色

# 调整图像大小
resized_image = cv2.resize(image, (500, 500))

# 显示图像
cv2.imshow('Original Image', image)
cv2.imshow('Copied Image', image_copy)
cv2.imshow('Resized Image', resized_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

### 图像对象的转换

以下是OpenCV图像对象与其他常用图像对象之间的相互转换示例：

1. OpenCV图像对象（cv2.Mat）与PIL图像对象之间的转换：
```python
import cv2
from PIL import Image

# OpenCV图像对象转PIL图像对象
cv_image = cv2.imread('image.jpg')
pil_image = Image.fromarray(cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB))

# PIL图像对象转OpenCV图像对象
pil_image = Image.open('image.jpg')
cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
```

2. OpenCV图像对象（cv2.Mat）与pywin32中的位图对象之间的转换：
```python
import cv2
import win32gui
import win32ui
import win32con

# OpenCV图像对象转pywin32位图对象
cv_image = cv2.imread('image.jpg')
h, w = cv_image.shape[:2]
bitmap = win32ui.CreateBitmap()
bitmap.CreateCompatibleBitmap(win32ui.GetDC(None), w, h)
bitmap.SetBitmapBits(cv_image.tobytes())

# pywin32位图对象转OpenCV图像对象
hbitmap = bitmap.GetHandle()
np_image = np.array(win32gui.GetObject(hbitmap))[:, :, :3]
cv_image = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
```

3. OpenCV图像对象（cv2.Mat）与Numpy数组之间的转换：
```python
import cv2
import numpy as np

# OpenCV图像对象转Numpy数组
cv_image = cv2.imread('image.jpg')
# 注意通道顺序，根据实际情况确认是否需要改变
# image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)  
np_image = np.array(cv_image)    # 创建一个新的Numpy数组，将图像数据复制到新数组中
np_image = np.asarray(cv_image)  # 与原始图像对象共享相同的内存

# Numpy数组转OpenCV图像对象
np_image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
cv_image = cv2.cvtColor(np_image, cv2.COLOR_RGB2BGR)
```

请注意，在进行图像对象之间的转换时，要确保图像的颜色通道顺序和数据类型匹配，以避免图像数据的损坏或不正确的转换结果。


## 图像处理常用方法

### 颜色空间转换

`cv2.cvtColor()`是OpenCV中的一个函数，用于颜色空间转换（Color Space Conversion）。它可以将一幅图像从一个颜色空间转换为另一个颜色空间。下面是对`cv2.cvtColor()`方法的各个参数的解释：

```python
cv2.cvtColor(src, code[, dst[, dstCn]])
```

- `src`：需要转换颜色空间的输入图像。
- `code`：指定颜色空间转换的类型。可以使用预定义的常量值或整数进行指定，例如`cv2.COLOR_BGR2RGB`。
- `dst`：可选参数，指定输出图像的目标存储。如果未指定，则函数会创建一个新的输出图像。
- `dstCn`：可选参数，指定输出图像的通道数。如果为0，则函数会根据`code`参数自动确定通道数。

以下是一个示例代码，展示了如何使用`cv2.cvtColor()`将一张彩色图像从BGR颜色空间转换为灰度颜色空间：

```python
import cv2

# 读取图像
image = cv2.imread('image.jpg')

# 将图像从BGR转换为灰度
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# 显示原始图像和转换后的灰度图像
cv2.imshow('Original Image', image)
cv2.imshow('Gray Image', gray_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

::: tip Color Conversion Codes
在OpenCV的`cv2.cvtColor()`方法中，常用的颜色空间转换类型（Color Conversion Codes）包括：

- BGR ↔ Gray：
   - `cv2.COLOR_BGR2GRAY`：将BGR图像转换为灰度图像。
   - `cv2.COLOR_GRAY2BGR`：将灰度图像转换为BGR图像。

- BGR ↔ RGB：
   - `cv2.COLOR_BGR2RGB`：将BGR图像转换为RGB图像。
   - `cv2.COLOR_RGB2BGR`：将RGB图像转换为BGR图像。

- BGR ↔ HSV：
   - `cv2.COLOR_BGR2HSV`：将BGR图像转换为HSV图像。
   - `cv2.COLOR_HSV2BGR`：将HSV图像转换为BGR图像。

- BGR ↔ HLS：
   - `cv2.COLOR_BGR2HLS`：将BGR图像转换为HLS图像。
   - `cv2.COLOR_HLS2BGR`：将HLS图像转换为BGR图像。

- BGR ↔ Lab：
   - `cv2.COLOR_BGR2Lab`：将BGR图像转换为Lab图像。
   - `cv2.COLOR_Lab2BGR`：将Lab图像转换为BGR图像。

- BGR ↔ YUV：
   - `cv2.COLOR_BGR2YUV`：将BGR图像转换为YUV图像。
   - `cv2.COLOR_YUV2BGR`：将YUV图像转换为BGR图像。

这些是一些常用的颜色空间转换类型，您可以根据需要选择适当的转换类型。如果您需要其他转换类型，可以查阅OpenCV官方文档中的完整转换类型列表。
:::

对于更详细的文档和 ColorConversionCodes，请参考OpenCV的官方文档：[cv::cvtColor()](https://docs.opencv.org/5.x/d8/d01/group__imgproc__color__conversions.html#ga397ae87e1288a81d2363b61574eb8cab)


### 调整图像大小

在OpenCV中，`resize()`是用于调整图像大小的方法，它可以根据指定的尺寸和插值方法对图像进行缩放。以下是对`resize()`方法以及各种插值方法的详细解释：

1. `resize()`方法：
    - `resize()`方法用于调整图像的大小，可以指定新的尺寸和插值方法。
    - 语法：`cv2.resize(src, dsize[, dst[, fx[, fy[, interpolation]]]])`
    - `src`：原始图像，==可以是`np.ndarray`或`cv2.Mat`对象==。
    - `dsize`：新的图像尺寸，可以是`(width, height)`元组或整数值。
    - `fx`：水平方向的缩放因子。
    - `fy`：垂直方向的缩放因子。
    - `interpolation`：插值方法，用于指定调整图像大小时的像素值插值算法。

2. 插值方法：
    - OpenCV提供了多种插值方法，用于确定调整图像大小时像素值的插值方式：
        - `cv2.INTER_NEAREST`：最近邻插值，使用离目标像素最近的像素值。
        - `cv2.INTER_LINEAR`：双线性插值，使用目标像素周围的4个像素进行插值计算。
        - `cv2.INTER_CUBIC`：双三次插值，使用目标像素周围的16个像素进行插值计算。
        - `cv2.INTER_LANCZOS4`：Lanczos插值，使用目标像素周围的8个像素进行插值计算。

以下是一个示例代码，演示如何使用`resize()`方法调整图像的大小，并使用不同的插值方法：

```python
import cv2

# 读取图像
image = cv2.imread('image.jpg')

# 调整图像大小
resized_nearest = cv2.resize(image, (300, 300), interpolation=cv2.INTER_NEAREST)
resized_linear = cv2.resize(image, (300, 300), interpolation=cv2.INTER_LINEAR)
resized_cubic = cv2.resize(image, (300, 300), interpolation=cv2.INTER_CUBIC)
resized_lanczos = cv2.resize(image, (300, 300), interpolation=cv2.INTER_LANCZOS4)

# 显示调整后的图像
cv2.imshow('Original Image', image)
cv2.imshow('Nearest Neighbor Interpolation', resized_nearest)
cv2.imshow('Bilinear Interpolation', resized_linear)
cv2.imshow('Bicubic Interpolation', resized_cubic)
cv2.imshow('Lanczos Interpolation', resized_lanczos)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

使用OpenCV的`resize()`方法时，请确保了解不同插值方法的特性，并根据具体需求选择适当的插值方法来调整图像大小。

::: tip OpenCV常用插值方式对比
在OpenCV中，`resize()`方法的默认插值方式是`cv2.INTER_LINEAR`，即双线性插值。

以下是对几种常见插值方法的特点对比，包括计算速度、内存占用、最终图像质量、PSNR（峰值信噪比）和 SSIM（结构相似性指数）等指标：

| 插值方法      | 计算速度 | 内存占用 | 图像质量    | PSNR           | SSIM           |
|---------------|----------|----------|-------------|----------------|----------------|
| 最近邻插值     | 快       | 低       | 一般        | 低             | 低             |
| 双线性插值     | 快       | 低       | 较好        | 中等           | 中等           |
| 双三次插值     | 中等     | 中等     | 较好        | 较高           | 较高           |
| Lanczos插值   | 慢       | 高       | 最好        | 较高           | 较高           |

需要注意的是，不同的插值方法在不同的情况下可能会产生不同的结果。因此，最佳的插值方法选择应该基于具体的需求和实际情况进行评估和决策。
:::

对于更详细的文档和更多插值方法，请参考OpenCV的官方文档：[cv::resize()](https://docs.opencv.org/5.x/da/d54/group__imgproc__transform.html#ga47a974309e9102f5f08231edc7e7529d) 




### 图像模板匹配

模板匹配是OpenCV中一个常用的图像处理技术，用于在图像中查找与给定模板最相似的图像区域。

OpenCV中的`matchTemplate`函数用于执行模板匹配。它采用输入图像和模板图像作为输入，并根据选择的匹配方法计算它们之间的相似度。

下面是对OpenCV中的`matchTemplate`方法进行详细介绍：

**1. matchTemplate方法的参数：**

```python
cv2.matchTemplate(image, templ, method[, result[, mask]])
```

- `image`：待搜索的输入图像（大图像）。
- `templ`：模板图像（小图像），用于在输入图像中进行匹配。
- `method`：匹配方法，指定匹配算法。
- `result`：可选参数，用于存储匹配结果的输出图像。
- `mask`：可选参数，指定感兴趣区域（ROI）。

**2. 返回值解析：**

`matchTemplate`方法返回一个结果图像，其中每个像素值表示该位置的匹配程度。可以使用`minMaxLoc`函数找到结果图像中的最大匹配值和位置。

**3. 不同匹配方法的特点：**

- `cv2.TM_SQDIFF`：平方差匹配，计算模板和图像区域之间的像素差的平方和。
- `cv2.TM_SQDIFF_NORMED`：归一化平方差匹配，计算归一化的平方差。
- `cv2.TM_CCORR`：互相关匹配，计算模板和图像区域之间的互相关。
- `cv2.TM_CCORR_NORMED`：归一化互相关匹配，计算归一化的互相关。
- `cv2.TM_CCOEFF`：归一化相关系数匹配，计算归一化的相关系数。
- `cv2.TM_CCOEFF_NORMED`：归一化相关系数匹配，计算归一化的相关系数。

| 算法                | 执行效率           | 内存占用        | 推荐颜色空间     | 最佳匹配      |
|---------------------|------------------|----------------|------------------|-----------|
| TM_SQDIFF           | 较高             | 较低           | 灰度图像         | 最小值       | 
| TM_SQDIFF_NORMED    | 低               | 较低           | 灰度图像         | 最小值       | 
| TM_CCORR            | 中等             | 较高           | 灰度图像或彩色图像 | 最大值 | 
| TM_CCORR_NORMED     | 低               | 较高           | 灰度图像或彩色图像 | 最大值 | 
| TM_CCOEFF           | 中等             | 较高           | 灰度图像或彩色图像 | 最大值 |
| TM_CCOEFF_NORMED    | 低               | 较高           | 灰度图像或彩色图像 | 最大值 | 

::: tip 注意事项
- 执行效率：不同算法的执行效率可能因具体实现和图像尺寸而有所差异，一般而言，`TM_SQDIFF`和`TM_CCORR`的执行效率较高，`TM_SQDIFF_NORMED`和`TM_CCORR_NORMED`的执行效率较低，`TM_CCOEFF`和`TM_CCOEFF_NORMED`的执行效率居中。
- 内存占用：不同算法的内存占用可能会有所差异，但一般而言，使用彩色图像进行匹配的算法（如`TM_CCORR`、`TM_CCORR_NORMED`、`TM_CCOEFF`和`TM_CCOEFF_NORMED`）可能需要更多的内存。
- 推荐颜色空间：对于灰度图像，可以使用任何算法进行匹配。对于彩色图像，可以使用`TM_CCORR`、`TM_CCORR_NORMED`、`TM_CCOEFF`和`TM_CCOEFF_NORMED`进行匹配。
- 最佳匹配：对于`TM_SQDIFF`和`TM_SQDIFF_NORMED`，最小值表示最佳匹配；对于`TM_CCORR`、`TM_CCORR_NORMED`、`TM_CCOEFF`和`TM_CCOEFF_NORMED`，最大值表示最佳匹配。
- 使用场景：不同算法适用于不同的使用场景，`TM_SQDIFF`和`TM_SQDIFF_NORMED`适用于目标定位和模板识别，`TM_CCORR`、`TM_CCORR_NORMED`、`TM_CCOEFF`和`TM_CCOEFF_NORMED`适用于模板匹配和目标跟踪。
:::

使用`matchTemplate`方法时，根据实际情况选择合适的匹配方法，并根据具体需求调整阈值和后处理操作，以获得最佳的匹配结果。


**3. 代码示例：**

以下是一个使用彩色图像进行模板匹配的代码示例：

```python
import cv2

def template_matching_color(image, template):
    # 将图像转换为彩色图像
    img = cv2.imread(image)
    template_img = cv2.imread(template)

    # 执行模板匹配
    result = cv2.matchTemplate(img, template_img, cv2.TM_CCOEFF_NORMED)

    # 获取最佳匹配结果
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
    top_left = max_loc
    bottom_right = (top_left[0] + template_img.shape[1], top_left[1] + template_img.shape[0])

    # 在图像中绘制矩形框
    cv2.rectangle(img, top_left, bottom_right, (0, 255, 0), 2)

    # 显示结果图像
    cv2.imshow("Matched Image", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# 调用函数进行模板匹配
template_matching_color('image.jpg', 'template.jpg')
```














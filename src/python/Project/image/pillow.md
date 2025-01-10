--- 

order: 5
title: Pillow图像处理
icon: geometry

---


PIL（Python Imaging Library）是一个用于图像处理的Python库，而Pillow是PIL的一个分支，可以说是PIL的现代版本。Pillow库基于PIL库进行了改进和扩展，并且在功能和性能上更优秀。

以下是Pillow的一些特色和优势：

1. 简单易用：Pillow库具有简单易用的API接口，使图像处理变得简单且容易上手。它提供了直观的方法和函数，可以轻松地加载、保存、编辑和处理图像。

2. 兼容性广泛：Pillow支持多种常见的图像格式，包括JPEG、PNG、GIF、BMP、TIFF等。这意味着您可以使用Pillow来处理和转换各种图像格式，而无需依赖其他库或工具。

3. 图像处理功能丰富：Pillow提供了广泛的图像处理功能和算法。它支持图像的调整大小、裁剪、旋转、翻转、滤镜应用、色彩空间转换等。您可以使用这些功能来进行图像增强、特效处理、数据预处理等各种图像处理任务。

4. 与NumPy和Matplotlib的集成：Pillow与NumPy和Matplotlib等流行的科学计算和可视化库紧密集成。您可以轻松地在Pillow和这些库之间进行图像数据的转换和交互，以实现更复杂的图像处理和分析任务。


## Pillow快速上手


### 文档和资源

- Pillow官方文档地址：[https://pillow.readthedocs.io/](https://pillow.readthedocs.io/)
- Pillow官方入门教程：[Pillow tutorial](https://pillow.readthedocs.io/en/stable/handbook/tutorial.html)


以下是一些其他有关Pillow的常用资源网站，它们提供了额外的教程、示例代码和社区支持：

1. Pillow官方GitHub仓库：[https://github.com/python-pillow/Pillow](https://github.com/python-pillow/Pillow)
    - 这是Pillow库的官方GitHub仓库，您可以在这里找到最新的源代码、问题追踪和贡献指南。

2. Pillow的PyPI页面：[https://pypi.org/project/Pillow/](https://pypi.org/project/Pillow/)
    - 这是Pillow库在PyPI（Python Package Index）上的页面，您可以在这里查看最新版本的Pillow库，并获取安装说明和版本历史。

3. Pillow的Stack Overflow标签：[https://stackoverflow.com/questions/tagged/pillow](https://stackoverflow.com/questions/tagged/pillow)
    - Stack Overflow是一个广泛使用的问答平台，Pillow有一个专门的标签页面，您可以在这里搜索和提问与Pillow相关的问题，并查看其他人的答案和解决方案。



### 安装和使用

Pillow库的安装命令为
```bash
pip install Pillow -i https://pypi.tuna.tsinghua.edu.cn/simple
````

示例代码：
```python
from PIL import Image

# 打开图像文件
with Image.open('image.jpg') as image:
    # 显示图像
    image.show()
    
    # 调整图像大小
    resized_image = image.resize((800, 600))
    
    # 保存图像
    resized_image.save('resized_image.jpg')
```


### 注意事项和建议

在使用Pillow库进行图像处理时，以下是一些注意事项和建议，以确保您的操作顺利进行：

1. 安装Pillow库：在开始使用Pillow之前，确保已正确安装Pillow库。您可以使用`pip install Pillow`命令来安装最新版本的Pillow库。

2. 图像格式支持：Pillow库支持多种图像格式，但并非所有格式的特性都得到完全支持。在处理图像时，确保您使用的图像格式是Pillow库所支持的，并且了解特定格式的限制和兼容性问题。

3. 图像模式和通道顺序：Pillow库支持不同的图像模式（如RGB、灰度等），并且可以在不同的模式之间进行转换。在处理图像时，确保选择正确的图像模式，并了解每种模式的特点和适用场景。

4. 使用上下文管理器：在使用Pillow库打开和处理图像文件时，建议使用上下文管理器（`with`语句），以确保在处理完成后及时关闭文件句柄，避免资源泄漏。

5. 注意图像尺寸和内存占用：大尺寸的图像可能会占用大量内存，特别是在进行像素级操作时。在处理大图像时，务必注意内存使用情况，并考虑采取适当的优化措施，如分块处理或缩小图像尺寸。

6. 处理图像时的数据类型转换：Pillow库中的一些函数和方法可能会返回不同的数据类型，如PIL Image对象或NumPy数组。在进行连续的图像处理操作时，注意数据类型之间的转换，以便正确地使用相应的函数和方法。

7. 图像保存质量设置：在保存图像时，注意保存质量设置。对于压缩格式（如JPEG），可以通过调整保存质量参数来控制图像的压缩比例和输出文件大小。

8. 错误处理和异常处理：在处理图像时，特别是在读取和保存图像文件时，应考虑错误处理和异常处理。确保适当地处理可能发生的错误或异常情况，并提供适当的错误消息和反馈。

::: danger 图像格式和颜色模式注意事项
当使用Pillow库打开JPEG（.jpg）和PNG（.png）图像时，默认情况下它们都被解释为RGB（红、绿、蓝）模式的格式。

- 对于JPEG图像，它们通常是彩色图像，由红、绿、蓝三个颜色通道组成，因此默认被解释为RGB模式。无论图像原始的颜色模式是什么，Pillow库都将其转换为RGB模式。

- 对于PNG图像，它们可以是灰度图像、彩色图像或带透明度的RGBA图像。当打开PNG图像时，Pillow库会根据图像的颜色通道信息来确定颜色模式。如果图像只有一个颜色通道，则被解释为灰度模式（L），如果有三个通道，则被解释为RGB模式。
如果使用Pillow库打开一个带透明度的RGBA图像，默认的PIL Image对象将是RGBA模式。

当使用Pillow的`open()`函数打开一个带透明度的RGBA图像时，返回的PIL Image对象将保留图像的透明度通道，并将其作为第四个通道。这意味着PIL Image对象的模式将是RGBA（红、绿、蓝、透明度），其中包含RGB通道和透明度通道。

可以通过查看PIL Image对象的`mode`属性来确认其颜色模式。如果是RGBA模式，`mode`属性的值将为'RGBA'。示例如下：

```python
from PIL import Image

# 打开带透明度的RGBA图像
with Image.open('rgba_image.jpg') as image:
    # 检查图像的模式
    print(image.mode)  # 输出：RGBA
```
:::

### 通道和颜色模式

在Pillow库中，图像对象（PIL Image对象）包含了图像的数据和元数据，其中包括数据格式、通道和颜色模式等。下面对这些概念进行详解：

1. 数据格式（Data Format）：
   - 图像对象中的数据格式指的是图像数据的组织方式和表示形式。==在Pillow中，图像数据以二维数组或三维数组的形式存在，通常是基于NumPy数组存储的==。
   - 对于彩色图像，常见的数据格式是三维数组，其中每个元素代表一个像素点，包含红、绿、蓝三个通道的像素值。对于灰度图像，常见的数据格式是二维数组，每个元素代表一个像素点的灰度值。
   - Pillow支持不同的数据类型，包括整数类型（如uint8）和浮点类型（如float32），可以根据需求进行选择和转换。

2. 通道（Channels）：
   - 在彩色图像中，通道指的是组成图像的不同颜色信息。常见的彩色图像通道是红色（R）、绿色（G）和蓝色（B）通道，通常使用RGB颜色模式。
   - 对于每个像素点，通道值表示了该像素在红、绿、蓝颜色分量上的强度或亮度。
   - 除了RGB模式，Pillow还支持其他一些颜色模式，如灰度模式（L）和索引模式（P）等，每种颜色模式对应不同的通道表示方式。

3. 颜色模式（Color Mode）：
   - 颜色模式指的是图像中使用的颜色表示方式。在Pillow中，不同的颜色模式可以决定图像的通道数和数据存储方式。
   - 常见的颜色模式包括：
      - RGB（红、绿、蓝）：每个像素由三个通道（红、绿、蓝）组成，表示彩色图像。
      - RGBA（红、绿、蓝、透明度）：每个像素由四个通道（红、绿、蓝、透明度）组成，表示具有透明度信息的彩色图像。
      - L（灰度）：每个像素只有一个通道，表示灰度图像。
      - P（索引）：每个像素由一个索引值表示，根据调色板（Palette）中的映射关系确定实际颜色，适用于有限颜色集的图像。
   - Pillow还支持其他颜色模式，如CMYK（青、洋红、黄、黑）和YCbCr等，用于特定的图像处理需求。


==在Pillow库中，默认的颜色模式是`RGB（红、绿、蓝）`模式，默认的通道顺序是`红色（R）、绿色（G）、蓝色（B）`==。

下面是使用代码示例说明常见颜色模式和通道之间的转换：

1. 默认颜色模式和通道的转换示例：
```python
from PIL import Image

# 打开图像，默认使用RGB颜色模式, 通道顺序为：R、G、B
image = Image.open('image.jpg')

# 转换为灰度图像
gray_image = image.convert('L')

# 转换为带透明度的RGBA图像
rgba_image = image.convert('RGBA')
# 转换为只有红色通道的图像
red_channel = rgba_image.split()[0]

# 保存为PNG格式的RGBA图像
image.save('saved_rgba_image.png')
# 保存为JPEG格式的灰度图像
gray_image.save('gray_image.jpg')
# 保存为PNG格式的灰度图像
gray_image.save('gray_image.png')
```


2. RGBA模式的代码示例：
```python
from PIL import Image

# 打开带透明度的RGBA图像
image = Image.open('rgba_image.png')

# 转换为RGB图像，忽略透明度通道
rgb_image = image.convert('RGB')

# 获取透明度通道
alpha_channel = image.split()[-1]

# 保存为JPEG格式的RGB图像（忽略透明度通道）
rgb_image.save('saved_rgba_image.jpg')
```

3. 灰度模式的代码示例：
```python
from PIL import Image

# 打开灰度图像
image = Image.open('gray_image.png')

# 转换为RGB图像，将灰度转换为彩色
rgb_image = image.convert('RGB')
```

通过使用`convert()`方法和通道分割（`split()`）等操作，可以将图像对象在不同的颜色模式和通道之间进行转换。在进行转换时，请注意目标颜色模式和通道的适用性，并根据实际需求选择正确的转换方法。


## Pillow常用方法

### 图像的基本属性
使用pillow打开图像至内存中后，可以通过PIL图像对象查看一些基本信息。

对应官网文档：https://pillow.readthedocs.io/en/stable/reference/Image.html#image-attributes

| 属性             | 解释                                                         | 详细解释                                                   |
|------------------|--------------------------------------------------------------|--------------------------------------------------------------|
| filename         | 图像的文件名                                                 | `image.filename` 返回图像对象的文件名。 |
| format           | 图像的文件格式                                               | `image.format` 返回图像对象的文件格式。 |
| mode             | 图像的颜色模式                                               | `image.mode` 返回图像对象的颜色模式。 |
| size             | 图像的尺寸（宽度和高度）                                     | `image.size` 返回图像对象的尺寸，以元组形式表示。 |
| width            | 图像的宽度                                                   | `image.width` 返回图像对象的宽度。 |
| height           | 图像的高度                                                   | `image.height` 返回图像对象的高度。 |
| palette          | 图像的调色板（仅适用于索引颜色模式）                           | `image.palette` 返回图像对象的调色板，仅适用于索引颜色模式的图像。 |
| info             | 图像的元信息                                                 | `image.info` 返回图像对象的元信息。 |
| is_animated      | 图像是否为动画                                               | `getattr(image, 'is_animated', False)` 判断图像对象是否为动画图像。 |
| n_frames         | 图像中的帧数（仅适用于动画图像）                               | `getattr(image, 'n_frames', 1)` 返回动画图像中的帧数，仅适用于动画图像。 |

部分代码示例：
```python
from PIL import Image

# 打开图像
with Image.open('image.jpg') as image:
    # 图像的文件格式
    image_format = image.format
    
    # 图像的颜色模式
    image_mode = image.mode
    
    # 图像的尺寸（宽度和高度）
    image_size = image.size
    
    # 图像的元信息
    image_info = image.info
```

类似的常用的方法：
| 方法              | 解释                                                      | 详细解释                                                          |
|-------------------|-----------------------------------------------------------|-------------------------------------------------------------------|
| getbands()        | 返回图像中的颜色通道列表。                                  | `image.getbands()` 返回图像对象中的颜色通道列表。 |
| getbbox()         | 返回图像的非零像素的边界框。                                        | `image.getbbox()` 返回一个矩形，表示图像中非零像素的边界框。 |
| getpixel()        | 返回指定坐标位置的像素值。                                  | `image.getpixel((100, 100))` 返回图像对象指定坐标位置的像素值。 |
| getchannel()      | 返回指定通道的图像数据。                                    | `image.getchannel('R')` 返回图像对象中红色通道的图像数据。 |
| getdata()         | 返回图像像素的迭代器。                                      | `image.getdata()` 返回一个像素值的迭代器，按照图像的颜色模式进行迭代。 |
| getextrema()      | 返回图像每个通道的像素值范围。                              | `image.getextrema()` 返回一个元组，其中每个元素表示图像每个通道的像素值范围。 |
| getcolors()       | 返回图像中颜色的计数和调色板。                              | `image.getcolors()` 返回一个列表，其中每个元素是颜色计数和对应的颜色值。 |

```python
from PIL import Image

# 打开图像
with Image.open('image.jpg') as image:
    # 获取图像中的颜色通道列表
    bands = image.getbands()

    # Calculates the bounding box of the non-zero regions in the image
    bbox = image.getbbox()
    # Returns four coordinates in the format (left, upper, right, lower)

    # 返回指定通道的图像数据
    red_channel = image.getchannel('R')
```


### 数据类型转换

以下是Pillow库中PIL Image对象与NumPy数组、pywin32中的位图对象以及OpenCV的图像对象之间的转换示例：

1. PIL Image对象与NumPy数组之间的转换：
   ```python
   import numpy as np
   from PIL import Image

   # PIL Image对象转换为NumPy数组
   pil_image = Image.open('image.jpg')
   numpy_array = np.array(pil_image)

   # NumPy数组转换为PIL Image对象
   pil_image = Image.fromarray(numpy_array)
   ```

2. PIL Image对象与pywin32中的位图对象之间的转换：
   ```python
   import win32gui
   import win32ui
   from PIL import Image

   # PIL Image对象转换为pywin32位图对象
   pil_image = Image.open('image.jpg')
   width, height = pil_image.size
   dc = win32gui.GetDC(0)
   bmp = win32ui.CreateBitmap()
   bmp.CreateCompatibleBitmap(dc, width, height)
   mem_dc = dc.CreateCompatibleDC()
   mem_dc.SelectObject(bmp)
   mem_dc.BitBlt((0, 0), (width, height), dc, (0, 0), win32con.SRCCOPY)
   bmp.SaveBitmap('bitmap.bmp')

   # pywin32位图对象转换为PIL Image对象
   win_bitmap = win32ui.CreateBitmap()
   win_bitmap.LoadBitmap('bitmap.bmp')
   pil_image = Image.frombuffer('RGB', (width, height), win_bitmap.GetBitmapBits(True), 'raw', 'BGRX', 0, 1)
   ```

3. PIL Image对象与OpenCV的图像对象之间的转换：
   ```python
   import cv2
   from PIL import Image

   # PIL Image对象转换为OpenCV图像对象
   pil_image = Image.open('image.jpg')
   opencv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

   # OpenCV图像对象转换为PIL Image对象
   pil_image = Image.fromarray(cv2.cvtColor(opencv_image, cv2.COLOR_BGR2RGB))
   ```

请注意，在进行数据类型转换时，确保数据格式和通道顺序正确，以避免出现颜色失真或数据不一致的问题。同时，还应注意图像大小、数据类型和颜色模式的匹配。


### 图像的裁剪

`Image.crop()` 方法用于裁剪图像，可以从原始图像中提取出感兴趣的区域。该方法接受一个表示裁剪区域的矩形框作为参数，并返回一个新的图像对象，该图像对象包含了裁剪后的区域。

详细解释：
- `Image.crop(box)` 方法接受一个表示裁剪区域的矩形框 `box` 作为参数，其中 `box` 是一个元组 `(left, upper, right, lower)`，分别表示左上角和右下角的坐标。
- 通过指定裁剪区域的坐标，`Image.crop()` 方法会返回一个新的图像对象，该对象包含了裁剪后的图像区域。
- 注意，裁剪区域的坐标必须在原始图像的尺寸范围内，否则会抛出异常。

代码示例：
```python
from PIL import Image

# 打开图像并进行裁剪
with Image.open('image.jpg') as image:
    # 定义裁剪区域
    box = (100, 100, 300, 300)  # 左上角坐标为 (100, 100)，右下角坐标为 (300, 300)

    # 进行裁剪
    cropped_image = image.crop(box)

    # 显示裁剪后的图像
    cropped_image.show()
```

::: tip Image.crop()注意事项
在 Pillow 中，`Image.crop()` 方法返回的是一个新的图像对象，而不是原始图像的视图对象或引用。因此，裁剪后的图像对象是原始图像的副本，而不是视图或内存共享。

当调用 `Image.crop()` 方法时，它会创建一个新的图像对象，并将裁剪后的图像数据复制到新的图像对象中。这意味着裁剪后的图像对象是独立的，对其进行修改不会影响原始图像对象。

这种复制行为确保了裁剪后的图像对象与原始图像对象之间的数据隔离，因此您可以对裁剪后的图像对象进行任何操作，而不会影响原始图像对象。
:::


### 调整图像尺寸

`Image.resize()` 方法用于调整图像的尺寸大小。它可以将图像调整为指定的尺寸，可以是固定的宽度和高度，或者是按比例缩放。

详细解释：
- `Image.resize(size, resample=None)` 方法接受一个表示目标尺寸的元组 `size` 作为参数，其中 `size` 是一个包含宽度和高度的二元组。
- 可选参数 `resample` 指定了调整尺寸时使用的重采样方法，默认为 `None`，表示使用默认的重采样方法。
- 调整尺寸后，`Image.resize()` 方法会返回一个新的图像对象，该对象具有新的尺寸。

代码示例：
```python
from PIL import Image

# 打开图像并进行尺寸调整
with Image.open('image.jpg') as image:
    # 定义目标尺寸
    new_size = (800, 600)  # 新的宽度和高度

    # 进行尺寸调整
    resized_image = image.resize(new_size)

    # 显示调整后的图像
    resized_image.show()
```


















--- 

order: 7
title: NumPy图像处理
icon: engine

---

## Numpy图像处理基础

### 为什么Numpy可以处理图像

计算机图像基础回顾：
- 计算机图像是由像素组成的二维或三维数据结构。每个像素表示图像中的一个点，具有特定的位置和颜色信息。在二维图像中，每个像素包含了纵向和横向的位置信息以及对应的颜色值。而在三维图像中，还会包含深度或通道信息，用于表示颜色的不同分量（如红、绿、蓝）或其他特征。
- 对于彩色图像，通常使用RGB（红、绿、蓝）颜色模型，其中每个像素的颜色由三个通道的强度值表示。对于灰度图像，只有一个通道，表示像素的亮度或灰度级别。

Numpy库简介：
- NumPy是一个用于科学计算的强大库，提供了高效的多维数组操作和数值计算功能。其核心数据结构是多维数组（ndarray），它是一个能够存储同类型数据的连续块。Numpy还提供了高效的内存管理和向量化操作，使得对大型图像进行高性能的数值计算和图像处理变得更加简单和高效。

为什么Numpy可以处理图像的原因：
- 由于图像数据本质上是多维数组，可以将图像数据表示为NumPy数组。NumPy提供了丰富的数组操作函数和方法，使得图像处理任务变得更加方便和灵活。使用NumPy，我们可以轻松地对图像进行裁剪、调整大小、旋转、滤波、亮度调整等操作，而无需编写冗长的循环或逐像素操作。
- 此外，NumPy还与其他图像处理库（如Pillow和OpenCV）紧密结合，可以轻松地进行图像数据的转换、交互和集成。

::: tip 总结
NumPy之所以能够成为图像处理任务的理想选择，是因为其高效的多维数组操作能力和与其他图像处理库的良好集成性，使得图像处理变得更加便捷和高效。
:::


### 加载图片资源到内存

Numpy本身并不能直接读取图片资源，要使用NumPy进行图像处理，可以使用Pillow库（也称为PIL）加载硬盘中的图像，并将其转换为NumPy数组。下面是详细步骤：

1. 安装Pillow库（如果尚未安装），可以使用以下命令在命令行中进行安装：
   ```
   pip install Pillow
   ```

2. 导入所需的库：
   ```python
   from PIL import Image
   import numpy as np
   ```

3. 使用Pillow库打开图像文件：
   ```python
   image = Image.open('image.jpg')
   ```

4. 将图像转换为NumPy数组：
   ```python
   image_array = np.array(image)
   ```

完成上述步骤后，`image_array` 就是包含图像数据的NumPy数组。可以使用NumPy数组的各种功能和函数对图像进行处理和分析。

以下是完整的代码示例：

```python
from PIL import Image
import numpy as np

# 打开图像文件
image = Image.open('image.jpg')

# 将图像转换为NumPy数组
image_array = np.array(image)

# 打印图像数组的形状和数据类型
print("图像数组的形状:", image_array.shape)
print("图像数组的数据类型:", image_array.dtype)
```

请确保将 `'image.jpg'` 替换为实际的图像文件路径。这样就可以将硬盘中的图像加载到内存，并将其转换为NumPy数组，以便后续使用NumPy进行图像处理操作。


### 数组和常用图像对象的转换

要在NumPy数组和常用图像对象之间进行相互转换，可以使用Pillow（PIL）、OpenCV和pywin32库中提供的相应方法。下面是各个库之间相互转换的示例：

1. NumPy数组和PIL图像对象之间的转换：
```python
import numpy as np
from PIL import Image

# NumPy数组转为PIL图像对象
image_array = np.array([[255, 0, 0], [0, 255, 0], [0, 0, 255]], dtype=np.uint8)
pil_image = Image.fromarray(image_array)

# PIL图像对象转为NumPy数组
image_array = np.array(pil_image)
```

2. NumPy数组和OpenCV图像对象之间的转换：
```python
import numpy as np
import cv2

# NumPy数组转为OpenCV图像对象
image_array = np.array([[255, 0, 0], [0, 255, 0], [0, 0, 255]], dtype=np.uint8)
opencv_image = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)

# OpenCV图像对象转为NumPy数组
image_array = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2RGB)
```

3. NumPy数组和pywin32中的位图对象之间的转换：
```python
import numpy as np
import win32ui

# NumPy数组转为pywin32位图对象
image_array = np.array([[255, 0, 0], [0, 255, 0], [0, 0, 255]], dtype=np.uint8)
bitmap = win32ui.CreateBitmapFromBuffer(image_array.shape[1], image_array.shape[0], image_array.tobytes())

# pywin32位图对象转为NumPy数组
image_array = np.frombuffer(bitmap.GetBitmapBits(), dtype=np.uint8).reshape((bitmap.GetHeight(), bitmap.GetWidth(), 3))
```

注意，在转换过程中，可能需要考虑颜色通道顺序、数据类型以及形状等因素，以确保转换正确无误。




## Numpy图像处理示例

### 使用Numpy裁剪图像

使用NumPy进行图像裁剪的步骤和实现方式如下(以下是完整的代码示例)：

```python
import numpy as np
from PIL import Image

# 打开图像并转换为NumPy数组
image = Image.open('image.jpg')
image_array = np.array(image)

# 定义裁剪区域
x_start, y_start = 100, 100  # 裁剪区域的左上角坐标
x_end, y_end = 300, 300  # 裁剪区域的右下角坐标

# 裁剪图像
cropped_image = image_array[y_start:y_end, x_start:x_end]

# 将裁剪后的图像保存为文件
cropped_image_pil = Image.fromarray(cropped_image)
cropped_image_pil.save('cropped_image.jpg')
```

::: tip 注意事项
- 裁剪区域的坐标需要在图像的尺寸范围内，否则会导致索引错误。
- 使用NumPy进行裁剪时，裁剪区域的索引顺序是 `(y_start:y_end, x_start:x_end)`，其中 `y` 表示行（纵向）， `x` 表示列（横向）。
- 裁剪后的图像将保留原始图像的数据类型和颜色通道顺序。
- 如果需要保存裁剪后的图像，请确保保存前将NumPy数组转换为PIL图像对象，然后使用 `save()` 方法保存为文件。
- 在裁剪图像时，本质是对Numpy数组进行索引和切片，并不会创建图像的副本，而是直接返回裁剪后的图像视图。如果对裁剪后的图像进行修改，会影响到原始图像。
::: 



### 使用Numpy调整图片尺寸

NumPy提供了resize函数，可以用于调整数组的尺寸。 下面是使用NumPy实现图像尺寸调整的示例代码：

```python
import numpy as np
from PIL import Image

# 打开图像并转换为NumPy数组
image = Image.open('image.jpg')
image_array = np.array(image)

# 定义目标尺寸
target_width = 800  # 新的目标宽度
target_height = 600  # 新的目标高度

# 调整图像尺寸
resized_image = np.resize(image_array, (target_height, target_width, image_array.shape[2]))

# 将调整后的图像保存为文件
resized_image_pil = Image.fromarray(resized_image)
resized_image_pil.save('resized_image.jpg')
```

::: tip 注意事项和建议
1. 使用NumPy的resize函数进行图像尺寸调整时，会直接修改数组的形状，可能会引起图像内容的拉伸或压缩。确保目标尺寸与原始图像的宽高比一致，以避免图像失真。 调整尺寸后的数组可以比原始数组的尺寸大或小
   - 如果调整后的新形状大于原始数组的大小，数组将会扩展并填充额外的元素。这可能会导致数据的重复或扩展。
   - 如果调整后的新形状小于原始数组的大小，数组将会缩小，丢失一些元素。这可能会导致数据的丢失或压缩。

2. 虽然NumPy的resize函数可以实现简单的图像尺寸调整，但Pillow库提供了更多的调整选项和插值方法，可以更精确地控制图像的质量和效果。因此，建议使用Pillow库的resize方法进行图像尺寸调整，以获得更好的结果。
::: 



### 通道和颜色模式调整


--- 

order: 1
title: Numpy
icon: sort

---


## 认识Numpy库

NumPy（Numerical Python）是一个用于科学计算的Python库，它提供了多维数组对象和一系列用于处理数组的函数。在NumPy中，多维数组被称为NumPy数组或ndarray（N-dimensional array）。
每个NumPy数组都具有相同类型和大小的元素。

学习NumPy是掌握科学计算和数据分析的重要一步。


### 官方文档
- NumPy官方网站提供了详细的文档和教程，包括用户指南、教程和示例代码。

::: info NumPy的官方文档地址
https://numpy.org/doc/stable/user/absolute_beginners.html#welcome-to-numpy
:::

使用建议：
1. 查阅文档：NumPy的官方文档是学习和使用NumPy的重要资源，其中包含了详细的API参考、教程、示例代码和常见问题解答等。建议在使用NumPy时，经常查阅官方文档，以了解函数的使用方式、参数说明和示例代码。

2. 学习教程：NumPy提供了丰富的教程，涵盖了从基本概念到高级应用的各个方面。通过阅读教程，您可以系统地学习NumPy的各种功能和用法，提升您的数值计算和数据处理能力。

3. 示例代码：NumPy官方文档中提供了大量的示例代码，这些代码可以帮助您理解NumPy的使用方法，并提供了实际问题的解决方案。尝试运行这些示例代码，并根据自己的需求进行修改和扩展，以加深对NumPy的理解。



### 学习资源
- 在线教程和视频：通过在线教程和视频学习NumPy的基础知识和常见应用。
- 书籍和教材：选择一本优质的NumPy教材，如《Python for Data Analysis》或《NumPy Beginner's Guide》等，系统学习NumPy的用法和实践。
 

### 安装和使用
- 安装NumPy库，可以通过pip命令在Python环境中进行安装。
```bash
pip install numpy -i https://pypi.tuna.tsinghua.edu.cn/simple
```
安装后即可在代码中导入使用：
```python
import numpy as np

# 通过Python列表创建一维数组
arr1 = np.array([1, 2, 3, 4, 5])

# 通过Python列表创建二维数组
arr2 = np.array([[1, 2, 3], [4, 5, 6]])

# 创建全零数组
zeros = np.zeros((2, 3))

# 创建全一数组
ones = np.ones((3, 2))

# 创建指定范围的数组
range_arr = np.arange(0, 10, 2)
```


## ndarray和数据类型

NumPy的核心概念是多维数组（ndarray），它是一个用于存储和处理大规模数据的容器。
NumPy数组在计算科学和数据分析领域得到广泛应用，它提供了高效的数据结构和操作函数，使得数据处理变得更加简单和高效。

::: warning NumPy数组和Python列表的比较
|               | NumPy数组                                            | Python列表                                      |
| ------------- | ---------------------------------------------------- | ---------------------------------------------- |
| 存储方式      | 固定类型、连续存储区域                               | 动态数组，可以容纳不同类型的元素               |
| 性能          | 高效的数值计算，特别适用于大规模数据                  | 相对较慢，特别在大规模数据处理时较慢           |
| 功能          | 数学函数、统计函数、线性代数运算等专门用于数值计算    | 提供了丰富的内置方法和操作符                    |
| 内存占用      | 通常比较节省内存，元素在内存中是连续存储的            | 占用的内存相对较大，元素是分散存储的             |

NumPy数组和Python列表在性能、功能和内存占用等方面有显著的差异。如果需要进行大规模的数值计算和科学数据分析，通常更适合使用NumPy数组。
而如果需要灵活的数据结构，可以容纳不同类型的元素，并且需要频繁地插入、删除或重新分配内存，那么Python列表可能更合适。

参照官方文档：[What’s the difference between a Python list and a NumPy array?](https://numpy.org/doc/stable/user/absolute_beginners.html#whats-the-difference-between-a-python-list-and-a-numpy-array)
:::

### 数组的创建

下面是NumPy中常见的数组创建方式、代码示例以及一些注意事项：

1. 使用`np.array()`函数从Python列表或元组创建数组：
```python
import numpy as np

list_data = [1, 2, 3, 4, 5]
array_from_list = np.array(list_data)
print(array_from_list)

tuple_data = (6, 7, 8, 9, 10)
array_from_tuple = np.array(tuple_data)
print(array_from_tuple)
```

2. 使用`np.zeros()`和`np.ones()`函数创建全零数组和全一数组：
```python
import numpy as np

zeros_array = np.zeros((3, 4))                # 创建一个3行4列的全零数组
print(zeros_array)
ones_array = np.ones((2, 3), dtype=np.int64)  # 创建一个2行3列的全一数组(并指定元素数据类型为int64)
print(ones_array)
```

3. 使用`np.arange()`函数创建按指定步长的等差数组：
```python
import numpy as np

range_array = np.arange(0, 10, 2)  # 创建一个从0到10（不包含10）的步长为2的等差数组
print(range_array)
```

4. 使用`np.linspace()`函数创建等间隔的数组：
```python
import numpy as np

linspace_array = np.linspace(0, 1, 5)  # 创建一个从0到1（包含1）的等间隔的长度为5的数组
print(linspace_array)
```

5. 使用随机函数生成随机数组：
```python
import numpy as np

random_array = np.random.rand(3, 2)  # 创建一个3行2列的随机数组（取值范围为0到1之间的均匀分布）
print(random_array)
```

6. 通过复制现有数组创建新数组：
```python
import numpy as np

existing_array = np.array([1, 2, 3, 4, 5])
new_array = np.copy(existing_array)  # 创建一个现有数组的副本
print(new_array)
```

::: warning 注意事项
- 在创建数组时，确保传递给创建函数的数据是合法且正确的，以避免出现意外的结果或错误。 注意数组的维度和形状，确保创建的数组满足需要。
- 对于使用随机函数生成的随机数组，根据需要选择适当的随机分布函数，并设置合适的参数。
- 注意NumPy数组的数据类型，默认情况下，`np.array()`函数会根据输入数据自动确定数据类型，但可以使用`dtype`参数指定所需的数据类型。
- 避免在大规模数据上创建过多的临时数组，以节省内存空间。
- 注意数组的索引和切片操作，确保正确访问和操作数组中的元素。
:::
可参照官方文档：[How to create a basic array](https://numpy.org/doc/stable/user/absolute_beginners.html#how-to-create-a-basic-array)


### 维度（Dimension）

在NumPy中，维度（Dimension）指的是数组的轴（axis），用于表示数组的不同方向。维度是描述数组形状和元素排列方式的重要概念。

NumPy提供了一些用于操作和处理维度的API，让您可以轻松管理数组的维度。下面是一些常用的维度相关的NumPy API，以及它们的使用示例和注意事项：

1. ndarray.ndim：获取数组的维度数。

   示例：
   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6]])
   print(arr.ndim)  # 输出：2
   ```

   注意事项：ndim返回的是整数值，表示数组的维度数。

   官方文档地址：[ndarray.ndim](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.ndim.html)

2. np.newaxis：为数组增加一个维度。

   示例：
   ```python
   import numpy as np

   arr = np.array([1, 2, 3])
   new_arr = arr[np.newaxis, :]
   print(new_arr.shape)  # 输出：(1, 3)
   ```

   注意事项：np.newaxis用于在指定位置插入一个维度。

   官方文档地址：[numpy.newaxis](https://numpy.org/doc/stable/reference/constants.html#numpy.newaxis)


### 形状（Shape）

在NumPy中，形状（Shape）指的是数组的维度大小，即每个维度上的元素个数。形状描述了数组的结构和维度排列方式。

形状与维度密切相关，但两者有一些区别：

- 维度（Dimension）是描述数组的不同方向的概念，用于表示数组的轴（axis）的数量。
- 形状（Shape）是一个元组，包含每个维度的大小，描述了数组在各个轴上的元素个数。

NumPy提供了一些用于获取和操作数组形状的API。下面是一些常用的形状相关的NumPy API，以及它们的使用示例和注意事项：

1. ndarray.shape：获取数组的形状，即每个维度的大小。

   示例：
   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6]])
   print(arr.shape)  # 输出：(2, 3)
   ```

   注意事项：shape返回的是一个元组，包含每个维度的大小。

   官方文档地址：[ndarray.shape](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.shape.html)

2. ndarray.reshape：改变数组的形状，重新排列元素。

   示例：
   ```python
   import numpy as np

   arr = np.array([1, 2, 3, 4, 5, 6])
   new_arr = arr.reshape((2, 3))
   print(new_arr)
   ```

   注意事项：reshape并不改变原始数组，而是返回一个新的数组。

   官方文档地址：[ndarray.reshape](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.reshape.html)

3. ndarray.flatten：将多维数组转换为一维数组。

   示例：
   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6]])
   flat_arr = arr.flatten()
   print(flat_arr)
   ```

   注意事项：flatten返回的是一个新的一维数组，不影响原始数组的形状。

   官方文档地址：[ndarray.flatten](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.flatten.html)


### 元素和数据类型

1. 数据类型（dtype）：
   NumPy数组中的元素可以具有不同的数据类型，如整数、浮点数、布尔值等。NumPy提供了一些常见的数据类型，包括：
    - int：整数类型（如int8、int16、int32、int64）。
    - uint：无符号整数类型（如uint8、uint16、uint32、uint64）。
    - float：浮点数类型（如float16、float32、float64）。
    - complex：复数类型（如complex64、complex128）。
    - bool：布尔类型（True或False）。
    - object：Python对象类型。
    - string_：固定长度字符串类型。
    - unicode_：固定长度Unicode类型。

2. 数组的数据类型转换：
   NumPy数组可以通过使用数组的`astype()`方法进行数据类型转换。例如，可以使用`arr.astype(dtype)`将数组`arr`的数据类型转换为`dtype`指定的数据类型。

::: warning 注意事项
- ==NumPy数组中的所有元素类型必须相同==，这有助于提高计算效率。
- 使用NumPy数组进行数值计算时，尽量避免使用Python中的循环，而是使用NumPy提供的函数和操作符进行向量化计算，以获得更高的执行效率。
- 在处理大规模数据时，尽量避免创建过多的临时数组，以节省内存和提高性能。
- 对于大型数组，可以使用NumPy的分块操作和延迟计算功能，以降低内存使用量。
- 在处理浮点数时，要注意浮点数运算的精度问题，避免由于浮点数精度导致的计算错误。
:::



## 数据处理和计算

### 索引-indexing

相对于python中的索引，在NumPy中，索引具有更多的特性和灵活性，可以进行更复杂的操作。下面是对NumPy中索引的详细介绍、代码示例和注意事项：

1. 整数索引：
   - 使用单个整数或整数数组进行索引，可以选择数组中的特定元素。
   - 可以使用负数索引从末尾开始访问元素。

   ```python
   import numpy as np

   arr = np.array([1, 2, 3, 4, 5])

   # 使用单个整数进行索引
   print(arr[0])   # 输出: 1
   print(arr[-1])  # 输出: 5

   # 使用整数数组进行索引
   index = np.array([1, 3])
   print(arr[index])  # 输出: [2 4]
   ```

2. 布尔索引：
   - 使用布尔数组进行索引，可以根据指定条件选择数组中的元素。
   - 可以使用逻辑运算符和比较运算符创建布尔数组。

   ```python
   import numpy as np

   arr = np.array([1, 2, 3, 4, 5])

   # 使用布尔数组进行索引
   mask = np.array([True, False, True, False, True])
   print(arr[mask])  # 输出: [1 3 5]

   # 使用条件创建布尔数组
   condition = arr > 2
   print(arr[condition])  # 输出: [3 4 5]
   ```

3. 多维数组索引：
   - 对于多维数组，可以使用逗号分隔的整数索引或整数数组索引来访问元素。
   - 可以在每个维度上分别指定索引或索引数组来选择元素。

   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

   # 使用整数索引访问元素
   print(arr[1, 2])  # 输出: 6

   # 使用整数数组索引访问元素
   rows = np.array([0, 2])
   cols = np.array([1, 2])
   print(arr[rows, cols])  # 输出: [2 9]
   ```

4. 切片和索引的组合：

   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

   print(arr[0:2, 1])  # 输出: [2 5]
   print(arr[:, 1:3])  # 输出: [[2 3] [5 6] [8 9]]
   ```

::: warning 注意事项
- 索引操作中的整数索引、整数数组索引和布尔索引可以同时使用。
- 通过索引获取的数组是原始数组的视图，即修改获取的数组将影响原始数组。
- 使用布尔索引时，确保布尔数组的长度与原始数组的长度相同。
- 注意使用多维数组索引时，逗号分隔的索引元组的顺序和数量要与原始数组的维度相匹配。
:::

### 切片-slicing

在NumPy中，切片是一种常用的操作，用于获取数组的子数组。下面是对NumPy中切片的详细介绍，包括与Python中切片的异同、代码示例以及注意事项：

1. 切片操作：
   - 切片使用冒号`:`来表示，可以指定起始索引、终止索引和步长来定义切片的范围。
   - ==切片操作返回的是原始数组的视图，不会创建新的数组==。修改切片中的元素会影响原始数组。

   ```python
   import numpy as np

   arr = np.array([1, 2, 3, 4, 5])

   # 使用切片获取子数组
   sub_array = arr[1:4]  # 获取索引1到3的元素
   print(sub_array)  # 输出: [2 3 4]

   # 修改切片中的元素会影响原始数组
   sub_array[0] = 10
   print(arr)  # 输出: [1 10 3 4 5]
   ```

2. 切片范围：
   - 起始索引：包含在切片范围内。
   - 终止索引：不包含在切片范围内。
   - 步长：指定切片的间隔，默认为1。可以使用负数步长实现逆向切片。

   ```python
   import numpy as np

   arr = np.array([1, 2, 3, 4, 5])

   # 切片范围示例
   slice_range = arr[1:4]  # 包含索引1, 2, 3
   print(slice_range)  # 输出: [2 3 4]

   # 切片范围和步长示例
   slice_range_step = arr[1:5:2]  # 包含索引1和3，步长为2
   print(slice_range_step)  # 输出: [2 4]

   # 逆向切片示例
   reverse_slice = arr[::-1]  # 逆向切片
   print(reverse_slice)  # 输出: [5 4 3 2 1]
   ```

3. 多维数组切片：
   - 对于多维数组，可以在每个维度上使用切片来获取子数组。

   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

   # 多维数组切片示例
   sub_array = arr[1:, :2]  # 获取第二行及之后的行，前两列
   print(sub_array)
   # 输出:
   # [[4 5]
   #  [7 8]]

   # 修改切片中的元素会影响原始数组
   sub_array[0, 0] = 10
   print(arr)
   # 输出:
   # [[ 1  2  3]
   #  [10  5  6]
   #  [ 7  8  9]]
   ```

::: warning python和numpy的切片对比
异同点：
   - 相同点：都可以用来获取数组的子数组，都使用冒号`:`来表示切片。
   - 不同点：
     - NumPy中的切片操作返回的是原始数组的视图，而Python中的切片操作会创建新的列表。
     - NumPy数组支持多维切片，可以在每个维度上指定不同的切片范围。

注意事项：
   - 在使用切片操作时，注意切片范围的起始索引和终止索引，确保获取正确的切片范围。
   - 理解NumPy数组切片的视图机制，以避免对原始数组产生意外的修改。
   - 注意多维数组切片的维度和范围设置，确保切片操作的合法性。
:::

切片是NumPy中常用的操作之一，通过合理使用切片操作可以方便地选择数组中的元素子集，并且注意对切片的操作不会创建新的数组，而是对原始数组进行修改。


### 数组形状操作

NumPy提供了一系列用于操作数组形状的API，可以改变数组的维度、大小和形状。

下面是对NumPy中数组形状操作相关API的详细介绍，包括代码示例和注意事项：

1. reshape()：改变数组的形状。
   - reshape()函数可以改变数组的形状为指定的维度。
   - 注意：reshape()函数返回的是数组的视图，即共享相同的数据缓冲区，所以修改返回的数组会影响原始数组。

   ```python
   import numpy as np

   arr = np.array([1, 2, 3, 4, 5, 6])

   # 改变数组的形状为2行3列
   new_arr = arr.reshape(2, 3)
   print(new_arr)
   # 输出:
   # [[1 2 3]
   #  [4 5 6]]

   # 修改返回的数组会影响原始数组
   new_arr[0, 0] = 10
   print(arr)
   # 输出: [10  2  3  4  5  6]
   ```

2. resize()：修改数组的大小和形状。
   - resize()函数可以==直接修改数组的大小和形状==，与reshape()不同，resize()可以修改原始数组的大小。
   - 如果新的大小大于原始数组的大小，则会在末尾添加重复的元素。
   - 如果新的大小小于原始数组的大小，则会删除多余的元素。

   ```python
   import numpy as np

   arr = np.array([1, 2, 3, 4, 5, 6])

   # 修改数组的大小和形状为2行4列
   arr.resize(2, 4)
   print(arr)
   # 输出:
   # [[1 2 3 4]
   #  [5 6 1 2]]
   ```

3. transpose()：交换数组的维度。
   - transpose()函数可以==交换数组的维度==，常用于转置矩阵。
   - 如果数组的维度超过2维，则可以使用轴编号来指定要交换的维度。

   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6]])

   # 交换数组的维度，转置矩阵
   transposed_arr = arr.transpose()
   print(transposed_arr)
   # 输出:
   # [[1 4]
   #  [2 5]
   #  [3 6]]
   ```

4. flatten()：将多维数组转换为一维数组。
   - flatten()函数可以将多维数组转换为一维数组，按照行优先的顺序展开。
   - 注意：==flatten()函数返回的是数组的副本==，不会修改原始数组。

   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6]])

   # 将多维数组展开为一维数组
   flattened_arr = arr.flatten()
   print(flattened_arr)
   # 输出: [1 2 3 4 5 6]
   ```

::: warning 注意事项
   - 在进行数组形状操作时，需要确保操作的合法性，即新的形状与原始数组的大小兼容。
   - reshape()和resize()函数返回的是数组的视图或直接修改原始数组，而flatten()函数返回的是数组的副本。
:::


### 去重和集合操作

在NumPy中，可以使用一些数组去重和集合操作的API来处理数组中的重复元素和集合操作。下面是对NumPy中数组去重和集合操作相关API的详细介绍，包括代码示例和注意事项：

1. np.unique()：返回数组中的唯一元素。
   - np.unique()函数返回数组中的唯一元素，并按升序排序。
   - 可以通过设置参数`return_counts=True`来获取每个唯一元素的出现次数。

   ```python
   import numpy as np

   arr = np.array([1, 2, 3, 2, 4, 1, 3])

   # 获取数组中的唯一元素
   unique_arr = np.unique(arr)
   print(unique_arr)
   # 输出: [1 2 3 4]

   # 获取每个唯一元素的出现次数
   unique_arr, counts = np.unique(arr, return_counts=True)
   print(unique_arr)  # 输出: [1 2 3 4]
   print(counts)      # 输出: [2 2 2 1]
   ```

2. np.union1d()：返回两个数组的并集。
   - np.union1d()函数返回两个数组的并集，即包含两个数组中所有唯一元素的数组。

   ```python
   import numpy as np

   arr1 = np.array([1, 2, 3, 4])
   arr2 = np.array([3, 4, 5, 6])

   # 返回两个数组的并集
   union_arr = np.union1d(arr1, arr2)
   print(union_arr)
   # 输出: [1 2 3 4 5 6]
   ```

3. np.intersect1d()：返回两个数组的交集。
   - np.intersect1d()函数返回两个数组的交集，即包含两个数组中共有的唯一元素的数组。

   ```python
   import numpy as np

   arr1 = np.array([1, 2, 3, 4])
   arr2 = np.array([3, 4, 5, 6])

   # 返回两个数组的交集
   intersect_arr = np.intersect1d(arr1, arr2)
   print(intersect_arr)
   # 输出: [3 4]
   ```

4. np.setdiff1d()：返回两个数组的差集。
   - np.setdiff1d()函数返回两个数组的差集，即返回在第一个数组中但不在第二个数组中的元素。

   ```python
   import numpy as np

   arr1 = np.array([1, 2, 3, 4])
   arr2 = np.array([3, 4, 5, 6])

   # 返回两个数组的差集
   diff_arr = np.setdiff1d(arr1, arr2)
   print(diff_arr)
   # 输出: [1 2]
   ```

::: warning 注意事项
   - 进行数组去重和集合操作时，NumPy的函数通常返回排序后的结果。
   - 在进行集合操作时，输入的数组不需要是有序的。
   - 注意数组的数据类型，有些函数对于字符串类型的数组可能会有不同的行为。
:::


### 数组的排序

在NumPy中，提供了一些用于数组排序操作的API，可以对数组进行排序。下面是对NumPy中数组排序操作相关API的详细介绍，包括代码示例和注意事项：

1. np.sort()：对数组进行排序。
   - np.sort()函数返回一个已排序的数组，按照升序排序。
   - 默认情况下，它会返回排序后的数组的副本，不会修改原始数组。
   - 可以通过设置参数`axis`来指定沿着某个轴排序。

   ```python
   import numpy as np

   arr = np.array([3, 1, 2, 5, 4])

   # 对数组进行排序
   sorted_arr = np.sort(arr)
   print(sorted_arr)
   # 输出: [1 2 3 4 5]
   ```

2. ndarray.sort()：就地对数组进行排序。
   - ndarray.sort()方法对数组进行排序，会直接修改原始数组，不返回任何值。
   - 可以通过设置参数`axis`来指定沿着某个轴排序。

   ```python
   import numpy as np

   arr = np.array([3, 1, 2, 5, 4])

   # 就地对数组进行排序
   arr.sort()
   print(arr)
   # 输出: [1 2 3 4 5]
   ```

3. np.argsort()：返回数组排序后的索引。
   - np.argsort()函数返回数组排序后的索引值，而不是直接返回排序后的数组。
   - 返回的索引数组可以用于在原始数组上获取排序后的值。

   ```python
   import numpy as np

   arr = np.array([3, 1, 2, 5, 4])

   # 返回排序后的索引
   sorted_indices = np.argsort(arr)
   print(sorted_indices)
   # 输出: [1 2 0 4 3]

   # 使用索引数组获取排序后的值
   sorted_arr = arr[sorted_indices]
   print(sorted_arr)
   # 输出: [1 2 3 4 5]
   ```

::: warning 注意事项
   - 默认情况下，排序操作是按照升序进行的。
   - 可以通过设置参数`kind`来指定排序算法，如快速排序（'quicksort'）或归并排序（'mergesort'）。
   - 对多维数组进行排序时，可以通过设置参数`axis`来指定沿着哪个轴进行排序。
   - ndarray.sort()方法会直接修改原始数组，而np.sort()函数会返回排序后的数组的副本。
:::

::: info 关于排序中的kind参数
在NumPy的排序操作中，`kind`参数用于指定排序算法的类型。下面是常见的`kind`参数取值以及它们的应用场景和优劣：

1. `'quicksort'`：
   - 应用场景：适用于大多数情况，特别是对于中等大小的数组。
   - 优势：具有较快的排序速度，通常是默认的排序算法。
   - 劣势：在最坏的情况下，其时间复杂度为 O(n^2)。

2. `'mergesort'`：
   - 应用场景：适用于需要稳定排序的情况，以及对于较大的数组。
   - 优势：具有稳定的排序性质，在最坏的情况下，其时间复杂度为 O(n log n)。
   - 劣势：相对于快速排序，需要更多的内存空间。

3. `'heapsort'`：
   - 应用场景：适用于需要保持较小尺寸的数组完全排序的情况。
   - 优势：具有较稳定的性能，不受输入数据分布的影响。
   - 劣势：在最坏的情况下，其时间复杂度为 O(n log n)，并且相对于快速排序和归并排序，其速度较慢。

总体而言，`'quicksort'`是最常用的排序算法，适用于大多数情况。`'mergesort'`适用于需要稳定排序和较大数组的情况。`'heapsort'`适用于较小尺寸的数组完全排序的情况。

默认情况下，==NumPy的排序函数会根据输入数据的大小和类型选择最合适的算法==。如果对算法选择有特定要求，可以显式地指定`kind`参数。

以下是示例代码，演示了如何指定`kind`参数：

```python
import numpy as np

arr = np.array([3, 1, 2, 5, 4])

# 使用快速排序算法对数组进行排序
sorted_arr = np.sort(arr, kind='quicksort')
print(sorted_arr)
# 输出: [1 2 3 4 5]

# 使用归并排序算法对数组进行排序
sorted_arr = np.sort(arr, kind='mergesort')
print(sorted_arr)
# 输出: [1 2 3 4 5]

# 使用堆排序算法对数组进行排序
sorted_arr = np.sort(arr, kind='heapsort')
print(sorted_arr)
# 输出: [1 2 3 4 5]
```

总结：
根据具体的需求和数据大小，可以选择合适的排序算法。大多数情况下，默认的快速排序算法是一个不错的选择，而归并排序适用于需要稳定排序和较大数组的情况。堆排序适用于较小尺寸的数组完全排序的情况。
:::


### 数组的广播机制

在NumPy中，数组广播（Array Broadcasting）是一种用于处理不同形状的数组进行运算的机制。
广播允许在没有显式复制数据的情况下，对不同形状的数组进行元素级操作。这种机制使得在NumPy中进行数组运算更加灵活和高效。

下面是对NumPy中数组广播的详细介绍，包括相关API的代码示例和注意事项：

1. 广播规则：
   - 广播规则描述了在进行元素级操作时，NumPy如何处理不同形状的数组。
   - ==NumPy的广播规则==：
      - 如果两个数组的维度不同，将较低维度的数组通过在前面插入长度为1的维度来进行扩展，直到两个数组的维度数相同。
      - 如果两个数组在某个维度上的长度不匹配，其中一个数组的大小为1，那么这个维度上的数组将被扩展为较大的大小。
      - 如果两个数组在任何维度上的大小都不匹配，并且两个数组都不等于1，那么会引发"ValueError"异常，表示无法进行广播。

2. 示例代码：
   ```python
   import numpy as np

   # 广播示例1
   a = np.array([1, 2, 3])
   b = np.array([4, 5, 6])

   # 对形状不同的数组进行加法运算
   result = a + b
   print(result)
   # 输出: [5 7 9]

   # 广播示例2
   c = np.array([[1, 2, 3], [4, 5, 6]])
   d = np.array([10, 20, 30])

   # 对形状不同的数组进行乘法运算
   result = c * d
   print(result)
   # 输出: [[10 40 90]
   #        [40 100 180]]
   ```

::: warning 注意事项
- 广播操作可能会导致大量的内存消耗，尤其是在涉及大型数组时，因为它涉及到数据的复制。
- 在进行广播操作时，应确保维度匹配和数组形状的一致性，以避免出现意外的结果。
- 在涉及多个数组进行广播运算时，可以使用`np.broadcast()`函数获取广播对象的详细信息，以便更好地理解广播过程。
  1. `np.broadcast()`函数的语法：
     ```python
     np.broadcast(array1, array2, ...)
     ```

  2. 参数说明：
     - `array1, array2, ...`：要进行广播的数组对象。

  3. 返回值：
     - `np.broadcast()`函数返回一个广播对象，该对象包含有关广播过程的详细信息。

  4. 示例代码：
     ```python
     import numpy as np

     a = np.array([1, 2, 3])
     b = np.array([[4], [5], [6]])

     # 获取广播对象
     broadcast_obj = np.broadcast(a, b)

     # 获取广播对象的形状
     shape = broadcast_obj.shape
     print(shape)
     # 输出: (3, 3)
     ```
:::

官方文档：[Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html#basics-broadcasting)

参考文章：[广播机制的理解](https://zhuanlan.zhihu.com/p/402163854)



### 文件输入/输出

NumPy提供了一组强大的文件输入输出（I/O）函数，用于读取和写入数组数据到磁盘文件。这些函数使得在NumPy中处理大量数据变得更加方便。

下面是对NumPy文件输入输出的详细介绍，包括相关API、代码示例和注意事项。

1. `np.savetxt()`和`np.loadtxt()`：
   - `np.savetxt()`函数用于将数组保存到文本文件中，每个数组元素以指定的格式写入文件。
   - `np.loadtxt()`函数用于从文本文件中加载数组数据。
   - 这些函数支持基本的文本文件格式，如CSV（逗号分隔值）。
   - 注意事项：确保文本文件的格式与加载的数据匹配，以免出现错误。

   示例代码：
   ```python
   import numpy as np

   # 保存数组到文本文件
   arr = np.array([[1, 2, 3], [4, 5, 6]])
   np.savetxt('data.txt', arr, fmt='%d')

   # 从文本文件加载数组数据
   loaded_arr = np.loadtxt('data.txt')
   print(loaded_arr)
   ```

2. `np.save()`和`np.load()`：
   - `np.save()`函数用于将一个或多个数组保存到二进制文件中，使用`.npy`扩展名。
   - `np.load()`函数用于从二进制文件中加载保存的数组数据。
   - 这些函数提供了快速和高效的二进制数据存储和加载方法。
   - 注意事项：保存的二进制文件只能由NumPy读取，无法与其他软件或文本编辑器直接交互。

   示例代码：
   ```python
   import numpy as np

   # 保存数组到二进制文件
   arr = np.array([[1, 2, 3], [4, 5, 6]])
   np.save('data.npy', arr)

   # 从二进制文件加载数组数据
   loaded_arr = np.load('data.npy')
   print(loaded_arr)
   ```

3. `np.savez()`和`np.load()`：
   - `np.savez()`函数用于将一个或多个数组保存到一个压缩的二进制文件中，使用`.npz`扩展名。
   - `np.load()`函数用于从压缩的二进制文件中加载保存的数组数据。
   - 这些函数提供了将多个数组打包到一个文件中的功能。
   - 注意事项：压缩的二进制文件只能由NumPy读取，无法与其他软件或文本编辑器直接交互。

   示例代码：
   ```python
   import numpy as np

   # 保存多个数组到压缩的二进制文件
   arr1 = np.array([1, 2, 3])
   arr2 = np.array([4, 5, 6])
   np.savez('data.npz', arr1=arr1, arr2=arr2)

   # 从压缩的二进制文件加载数组数据
   loaded_data = np.load('data.npz')


   loaded_arr1 = loaded_data['arr1']
   loaded_arr2 = loaded_data['arr2']
   print(loaded_arr1)
   print(loaded_arr2)
   ```
   

## 常用统计和数学函数

### 常用统计函数

NumPy提供了许多常用的统计函数，用于计算数组的各种统计指标。下面是对NumPy中常用的统计函数的详细介绍，包括相关API、代码示例和注意事项。

1. `np.mean()`：
   - `np.mean()`函数用于计算数组的平均值。
   - 可以通过指定`axis`参数来沿指定轴计算平均值。
   - 注意事项：确保数组的数据类型适合进行平均值计算。

   示例代码：
   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6]])

   # 计算全局平均值
   print(np.mean(arr))

   # 沿行轴计算平均值
   print(np.mean(arr, axis=0))

   # 沿列轴计算平均值
   print(np.mean(arr, axis=1))
   ```

2. `np.median()`：
   - `np.median()`函数用于计算数组的中位数。
   - 可以通过指定`axis`参数来沿指定轴计算中位数。
   - 注意事项：确保数组的数据类型适合进行中位数计算。

   示例代码：
   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6]])

   # 计算全局中位数
   print(np.median(arr))

   # 沿行轴计算中位数
   print(np.median(arr, axis=0))

   # 沿列轴计算中位数
   print(np.median(arr, axis=1))
   ```

3. `np.sum()`：
   - `np.sum()`函数用于计算数组元素的和。
   - 可以通过指定`axis`参数来沿指定轴计算和。
   - 注意事项：确保数组的数据类型适合进行求和计算。

   示例代码：
   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6]])

   # 计算全局和
   print(np.sum(arr))

   # 沿行轴计算和
   print(np.sum(arr, axis=0))

   # 沿列轴计算和
   print(np.sum(arr, axis=1))
   ```

4. `np.std()`：
   - `np.std()`函数用于计算数组的标准差。
   - 可以通过指定`axis`参数来沿指定轴计算标准差。
   - 注意事项：确保数组的数据类型适合进行标准差计算。

   示例代码：
   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6]])

   # 计算全局标准差
   print(np.std(arr))

   # 沿行轴计算标准差
   print(np.std(arr, axis=0))

   # 沿列轴计算标准差
   print(np.std(arr, axis=1))
   ```

5. `np.max()`和`np.min()`：
   - `np.max()`函数用于找到数组的最大值，`np.min()`函数用于找到数组的最小值。
   - 可以通过指定`axis`参数来沿指定轴找到最大值或最小值。
   - 注意事项：确保数组的数据类型适合进行最大值或最小值的查找。

   示例代码：
   ```python
   import numpy as np

   arr = np.array([[1, 2, 3], [4, 5, 6]])

   # 查找全局最大值和最小值
   print(np.max(arr))
   print(np.min(arr))

   # 沿行轴查找最大值和最小值
   print(np.max(arr, axis=0))
   print(np.min(arr, axis=0))

   # 沿列轴查找最大值和最小值
   print(np.max(arr, axis=1))
   print(np.min(arr, axis=1))
   ```


### 基本数学函数

NumPy提供了一组基本的数学函数，用于执行各种数学操作和计算。这些函数支持对数组进行逐元素的数学运算。下面是对NumPy中常用的基本数学函数的详细介绍，包括相关API、代码示例和注意事项。

1. `np.abs()`：
   - `np.abs()`函数用于计算数组中元素的绝对值。
   - 可以对整个数组或特定轴进行操作。
   - 注意事项：确保数组的数据类型适合进行绝对值计算。

   示例代码：
   ```python
   import numpy as np

   arr = np.array([-1, -2, 3, 4])

   # 计算数组元素的绝对值
   abs_arr = np.abs(arr)
   print(abs_arr)
   ```

2. `np.sqrt()`：
   - `np.sqrt()`函数用于计算数组中元素的平方根。
   - 可以对整个数组或特定轴进行操作。
   - 注意事项：确保数组的数据类型适合进行平方根计算。

   示例代码：
   ```python
   import numpy as np

   arr = np.array([4, 9, 16])

   # 计算数组元素的平方根
   sqrt_arr = np.sqrt(arr)
   print(sqrt_arr)
   ```

3. `np.exp()`：
   - `np.exp()`函数用于计算数组中元素的指数函数。
   - 可以对整个数组或特定轴进行操作。
   - 注意事项：确保数组的数据类型适合进行指数函数计算。

   示例代码：
   ```python
   import numpy as np

   arr = np.array([1, 2, 3])

   # 计算数组元素的指数函数
   exp_arr = np.exp(arr)
   print(exp_arr)
   ```

4. `np.log()`和`np.log10()`：
   - `np.log()`函数用于计算数组中元素的自然对数。
   - `np.log10()`函数用于计算数组中元素的以10为底的对数。
   - 可以对整个数组或特定轴进行操作。
   - 注意事项：确保数组的数据类型适合进行对数计算，并注意处理零值或负值。

   示例代码：
   ```python
   import numpy as np

   arr = np.array([1, 10, 100])

   # 计算数组元素的自然对数
   log_arr = np.log(arr)
   print(log_arr)

   # 计算数组元素的以10为底的对数
   log10_arr = np.log10(arr)
   print(log10_arr)
   ```

5. `np.sin()`, `np.cos()`, `np.tan()`：
   - `np.sin()`函数用于计算数组中元素的正弦值。
   - `np.cos()`函数用于计算数组中元素的余弦值。
   - `np.tan()`函数用于计算数组中元素的正切值。
   - 可以对整个数组或特定轴进行操作。
   - 注意事项：确保

数组的数据类型适合进行三角函数计算。

示例代码：
   ```python
   import numpy as np

   arr = np.array([0, np.pi/4, np.pi/2])

   # 计算数组元素的正弦值
   sin_arr = np.sin(arr)
   print(sin_arr)

   # 计算数组元素的余弦值
   cos_arr = np.cos(arr)
   print(cos_arr)

   # 计算数组元素的正切值
   tan_arr = np.tan(arr)
   print(tan_arr)
   ```



### 线性代数函数

NumPy提供了丰富的线性代数函数，用于执行矩阵和向量的各种线性代数运算。下面是对NumPy中常用的线性代数函数的详细介绍，包括相关API、代码示例和注意事项。

1. `np.dot()`：
   - `np.dot()`函数用于计算两个数组的矩阵乘法。
   - 可以计算两个一维数组的点积，或者计算两个二维数组的矩阵乘法。
   - 注意事项：确保输入的数组形状满足矩阵乘法的要求。

   示例代码：
   ```python
   import numpy as np

   arr1 = np.array([1, 2, 3])
   arr2 = np.array([4, 5, 6])

   # 计算一维数组的点积
   dot_product = np.dot(arr1, arr2)
   print(dot_product)

   mat1 = np.array([[1, 2], [3, 4]])
   mat2 = np.array([[5, 6], [7, 8]])

   # 计算二维数组的矩阵乘法
   matrix_product = np.dot(mat1, mat2)
   print(matrix_product)
   ```

2. `np.linalg.inv()`：
   - `np.linalg.inv()`函数用于计算矩阵的逆矩阵。
   - 只能计算方阵的逆矩阵，即输入矩阵的行数和列数相等。
   - 注意事项：确保输入的矩阵是可逆的，即行列式不为零。

   示例代码：
   ```python
   import numpy as np

   mat = np.array([[1, 2], [3, 4]])

   # 计算矩阵的逆矩阵
   inv_mat = np.linalg.inv(mat)
   print(inv_mat)
   ```

3. `np.linalg.det()`：
   - `np.linalg.det()`函数用于计算矩阵的行列式。
   - 只能计算方阵的行列式，即输入矩阵的行数和列数相等。
   - 注意事项：确保输入的矩阵是可逆的，即行列式不为零。

   示例代码：
   ```python
   import numpy as np

   mat = np.array([[1, 2], [3, 4]])

   # 计算矩阵的行列式
   det = np.linalg.det(mat)
   print(det)
   ```

4. `np.linalg.eig()`：
   - `np.linalg.eig()`函数用于计算方阵的特征值和特征向量。
   - 只能计算方阵的特征值和特征向量。
   - 注意事项：确保输入的矩阵是方阵。

   示例代码：
   ```python
   import numpy as np

   mat = np.array([[1, 2], [3, 4]])

   # 计算矩阵的特征值和特征向量
   eigenvalues, eigenvectors = np.linalg.eig(mat)
   print("Eigenvalues:", eigenvalues)
   print("Eigenvectors:", eigenvectors)
   ```

5. `np.linalg.solve()`：
   - `np.linalg.solve()`函数用于解线性方程组。
   - 只能解形如`Ax = b`的线性方程组，其中`A`为系数矩阵，`b`为常数向量，`x`为未知向量。
   - 注意事项：确保输入的系数矩阵`A`是可逆的。

   示例代码：
   ```python
   import numpy as np

   A = np.array([[1, 2], [3, 4]])
   b = np.array([5, 6])

   # 解线性方程组 Ax = b
   x = np.linalg.solve(A, b)
   print(x)
   ```















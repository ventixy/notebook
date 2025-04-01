--- 

title: Python文件操作
order: 9
icon: file

---

## Python常见文件操作

### 打开和关闭

打开文件：使用内置的`open()`函数来打开文件，并返回一个文件对象。可以指定文件名、文件模式和可选的编码方式等参数。

关闭文件：使用文件对象的close()方法关闭已打开的文件，并释放相关的系统资源。

```python
# 打开文件并写入内容
file = open('example.txt', 'w')
file.write('Hello, World!')
file.close()

# 打开文件并读取内容
file = open('example.txt', 'r')
content = file.read()
print(content)
file.close()
```

::: info open()函数
- 作用：用于打开文件，并返回一个文件对象，以便后续对文件进行读取或写入操作。
- 语法：`open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)`
- 常用参数：
  - file：文件名或路径。
  - mode：打开文件的模式，默认为 'r'（只读模式）。 常见的模式有：
    - 'r'：只读模式。
    - 'w'：写入模式，会覆盖原有内容。
    - 'a'：追加模式，在文件末尾追加内容。
    - 'x'：创建模式，创建新文件并写入内容。
    - 'b'：二进制模式，用于处理二进制文件。
    - 't'：文本模式，用于处理文本文件。
- 其他参数：包括 buffering、encoding、errors、newline、closefd 和 opener 等，用于指定文件的缓冲设置、编码方式和错误处理等。
:::

### 文件的读写

在 Python 中，文件操作提供了多种读写函数来处理文件的读取和写入。下面是对一些常见的文件读写函数及其参数的详细介绍：

1. 文件读取函数：
    - `read(size=-1)`：从文件中读取指定大小的数据，如果未指定大小，则读取整个文件内容。返回一个字符串或字节串对象。
    - `readline(size=-1)`：从文件中读取一行数据，如果未指定大小，则读取整行内容。返回一个字符串或字节串对象。
    - `readlines(hint=-1)`：从文件中读取所有行，并将其存储在一个列表中。如果指定了 `hint` 参数，则读取指定的行数。

2. 文件写入函数：
    - `write(str)`：将字符串或字节串写入文件。返回写入的字符数。
    - `writelines(lines)`：将一个字符串列表或字节串列表写入文件，每个字符串作为一行数据。

代码示例：
```python
# 文件读取示例
file = open('example.txt', 'r')

# 读取整个文件内容
content = file.read()
print(content)

# 读取一行数据
line = file.readline()
print(line)

# 读取多行数据
lines = file.readlines()
print(lines)

file.close()

# 文件写入示例
file = open('example.txt', 'w')

# 写入字符串
file.write('Hello, World!')

# 写入多行数据
lines = ['Line 1\n', 'Line 2\n', 'Line 3\n']
file.writelines(lines)

file.close()
```

注意事项：
- 在进行文件读写操作时，要确保文件存在且可读写。否则会抛出相关的异常。
- 在使用文件读取函数时，要注意文件指针的位置。读取完整个文件内容后，文件指针会指向文件末尾。
- 在使用文件写入函数时，要注意写入的数据类型必须与文件打开的模式相匹配。如果打开文件时使用了二进制模式，写入的数据也需要是字节串。
- 在读写文件后，要及时关闭文件以释放系统资源，可以使用 `with` 语句来自动关闭文件。


### 文件定位函数

在 Python 中，文件定位函数 `seek()` 和 `tell()` 用于在文件中移动文件指针的位置和获取当前文件指针的位置。下面是对这两个函数的详细介绍，以及相关的参数、代码示例和注意事项：

1. ==`seek()`== 函数：
    - 作用：用于移动文件指针到指定位置。
    - 语法：`file.seek(offset[, whence])`
    - 参数：
        - `offset`：表示偏移量，即将文件指针移动的距离。可以为正数、负数或零。
        - `whence`：表示起始位置，默认为 0（文件起始位置）。
            - `0`：从文件起始位置开始计算偏移。
            - `1`：从当前文件指针位置开始计算偏移。
            - `2`：从文件末尾位置开始计算偏移。
    - 注意事项：
        - `offset` 和 `whence` 的值都必须是整数。
        - 移动的偏移量可以是字节单位，也可以是行单位（当文件以文本模式打开时）。
        - 当 `whence` 参数为 0 时，偏移量必须是非负数；当 `whence` 参数为 1 或 2 时，偏移量可以是负数。
        - 移动文件指针后，可以继续读取或写入文件的数据。

2. ==`tell()`== 函数：
    - 作用：用于获取当前文件指针的位置。
    - 语法：`file.tell()`
    - 返回值：返回一个整数，表示当前文件指针的位置。

代码示例：
```python
file = open('example.txt', 'r')

# 获取当前文件指针位置
position = file.tell()
print('当前文件指针位置:', position)

# 移动文件指针到指定位置
file.seek(5)
position = file.tell()
print('移动后的文件指针位置:', position)

# 读取文件内容
content = file.read()
print(content)

file.close()
```

注意事项：
- 在使用 `seek()` 函数时，要确保指定的偏移量和起始位置是合法的，以免超出文件范围或产生错误的结果。
- 在使用 `tell()` 函数时，要在正确的时机调用，以获取准确的文件指针位置。文件指针的位置是相对于文件的字节偏移量，而不是行号。
- 在移动文件指针后，可以继续对文件进行读取或写入操作，但要注意读取或写入的位置和内容是否正确。


### 编码和解码

在 Python 文件操作中，读取或写入文件时，由于字符编码不匹配或处理不当，会导致文件内容显示为乱码的现象。为了正确处理文件的编码和解码，可以采取以下措施：

- 在读取文件时，要使用正确的编码格式将文件内容解码为字符串。
- 在写入文件时，要使用正确的编码格式将字符串编码为字节流。
- 可以使用字符串的 `encode()` 方法进行编码，使用字节流的 `decode()` 方法进行解码。

代码示例：
```python
# 读取文件内容并解码为字符串
with open('example.txt', 'r', encoding='utf-8') as file:
    content = file.read()
    print(content)

# 写入字符串内容并编码为字节流
with open('output.txt', 'w', encoding='utf-8') as file:
    content = '这是一段中文内容'
    file.write(content)
```

::: danger 编码和解码
- 在读取文件时，要确保使用正确的编码格式，否则可能会出现乱码问题。
- 在写入文件时，要使用与读取时相同的编码格式，以确保数据的一致性。
- 如果文件的编码格式不明确，可以尝试不同的编码格式进行读取，找到正确的编码格式。
- 在处理非文本文件时（例如图片、视频等），不需要进行编码和解码操作，直接读写二进制数据即可。
:::

### 文件路径问题

在 Python 的文件操作中，路径问题是一个重要的考虑因素。正确处理路径可以确保程序能够准确找到目标文件或目录，并进行相应的操作。下面是对文件路径问题的详细介绍，以及相关的代码示例和注意事项：

1. 绝对路径和相对路径：
    - 绝对路径：完整指定文件或目录的路径，从根目录开始。例如：`/usr/local/example.txt`
    - 相对路径：相对于当前工作目录的路径。例如：`example.txt`、`../folder/example.txt`
    - 注意事项：
        - 绝对路径可以直接定位文件或目录，不受当前工作目录的影响。
        - 相对路径依赖于当前工作目录，可能会受到工作目录变化的影响。

2. 获取当前工作目录：
    - `os.getcwd()`：返回当前工作目录的路径。
    - `Path.cwd()`（使用 `pathlib` 模块）：返回当前工作目录的路径。

3. 构建文件路径：
    - 使用字符串拼接：可以通过字符串拼接的方式构建文件路径。
    - 使用 `os.path.join()`：使用 `os.path.join()` 函数可以安全地构建文件路径，自动处理路径分隔符。
    - 使用 `Path` 对象（使用 `pathlib` 模块）：使用 `Path` 对象可以方便地操作路径。

代码示例：
```python
import os
from pathlib import Path

# 获取当前工作目录
current_dir = os.getcwd()
print('当前工作目录:', current_dir)

# 构建文件路径 - 字符串拼接
file_path = current_dir + '/example.txt'
print('文件路径:', file_path)

# 构建文件路径 - os.path.join()
file_path = os.path.join(current_dir, 'example.txt')
print('文件路径:', file_path)

# 构建文件路径 - Path对象
file_path = Path(current_dir) / 'example.txt'
print('文件路径:', file_path)
```

::: danger 文件路径注意事项
- 在构建文件路径时，要注意使用正确的路径分隔符，Unix-like 系统使用斜杠（/），Windows 系统使用反斜杠（\）。
- 可以使用 `os.sep` 或 `Path` 对象的 `Path.sep` 属性获取当前操作系统的路径分隔符。
- 在跨平台开发时，建议使用 `os.path.join()` 或 `Path` 对象来构建文件路径，以保证跨平台的兼容性。
:::


### 当前文件所在目录

有很多文章和教程都使用`os.path.join(os.getcwd(), 'example.txt')`来获取文件所在目录并用来拼接当前目录中其他文件的绝对路径，有时候或许没问题，但当python文件处于项目中较深层次的目录时，这样做就会出错，
这是因为在项目中 `os.getcwd()`获取到的不一定是文件实际所在目录，其获取的是当前工作目录，注意区分，详情及正确方法请见下述案例：

```python
import os

print(os.getcwd())
print(os.path.abspath(__file__))
# 输出结果：
# C:\Project\Demo\dirTest\utils
# C:\Project\Demo\dirTest\utils\demo\test.py

# 获取当前文件所在目录的正确方式：os.path.dirname
current_file = os.path.abspath(__file__)
current_dir = os.path.dirname(__file__)
path = os.path.join(current_dir, 'example.txt')  # 拼接绝对路径的通用方式
print(current_file)       # C:\Project\Demo\dirTest\utils\demo\test.py
print(current_dir)        # C:\Project\Demo\dirTest\utils\demo
print(path)               # C:\Project\Demo\dirTest\utils\demo\example.txt

# 只获取目录名
directory_name = os.path.basename(current_dir)
print(directory_name)  # demo
```
使用os.path.dirname(__file__)可以在任何Python脚本中获取当前文件的实际目录。

请注意，__file__是Python中的一个内置变量，它表示当前模块（文件）的路径。
需要注意的是，__file__在交互式环境（如Python解释器的交互模式或Jupyter Notebook）中可能无效，因为该变量的值在交互式环境中并不总是可用。
在这种情况下，可以考虑使用其他方法，如使用inspect模块来获取当前文件的路径。

```python
import inspect

current_file = inspect.getfile(inspect.currentframe())
current_dir = os.path.dirname(os.path.abspath(current_file))
print(current_dir)
```
这种方法可以在交互式环境中正常工作，并且可以获取到当前文件的实际路径。


## OS模块的文件操作


### os.rename
用于将文件或目录重命名。
参数 src 是要重命名的源文件名或目录名，dst 是目标文件名或目录名。
注意事项：要确保源文件或目录存在，目标文件或目录不存在，并且在所在目录下具有重命名的权限。
```python
import os

# 重命名文件
src = 'old_name.txt'
dst = 'new_name.txt'
os.rename(src, dst)
```

### os.remove
用于删除指定的文件。
参数 path 是要删除的文件路径。
注意事项：要确保文件存在，并且具有删除权限。
```python
import os

# 删除文件
file_path = 'example.txt'
os.remove(file_path)
```

### os.mkdir
用于创建一个新的目录。
参数 path 是要创建的目录路径。
注意事项：要确保目录不存在，并且在所在目录下具有创建目录的权限。
```python
import os

# 创建目录
new_dir = 'new_directory'
os.mkdir(new_dir)
```

### os.rmdir
用于删除指定的空目录。
参数 path 是要删除的目录路径。
注意事项：要确保目录存在、为空，并且具有删除权限。
```python
import os

# 删除目录
dir_path = 'directory_to_delete'
os.rmdir(dir_path)
```

### os.getcwd
用于获取当前工作目录的路径。
返回值是一个字符串，表示当前工作目录的路径。
```python
import os

# 获取当前工作目录
current_dir = os.getcwd()
print(f'当前工作目录：{current_dir}')
```
::: danger 关于os.getcwd()的高度注意事项
`os.getcwd()`获取到的是当前工作目录，==不一定是文件所在的实际目录！！！==

若需要准确获取当前文件所在目录请参照：[获取当前文件所在目录章节](/AI/zh/python/base/file.html#当前文件所在目录)
:::

### os.listdir
返回指定目录中的文件和目录列表。
参数 path 是要列出的目录路径。
返回值是一个包含目录中文件和目录名称的列表。
```python
import os

# 列出目录中的文件和目录
directory = 'my_folder'
contents = os.listdir(directory)
print(f'目录 {directory} 中的内容:')
for item in contents:
    print(item)
```
在使用 os.listdir() 函数时，要注意给定的路径必须是一个目录，否则会抛出异常。

### os.chdir
用于改变当前工作目录。
参数 path 是要切换到的目标目录路径。
注意事项：要确保目标目录存在，并且具有访问权限。
```python
import os

# 切换工作目录
target_dir = 'new_directory'
os.chdir(target_dir)
print(f'当前工作目录：{os.getcwd()}')
```


### os.path.abspath
返回给定路径的绝对路径。
参数 path 是要获取绝对路径的路径。
返回值是一个字符串，表示给定路径的绝对路径。
```python
import os

# 获取绝对路径
path = 'example.txt'
absolute_path = os.path.abspath(path)
print(f'绝对路径: {absolute_path}')
```


### os.path.isfile
检查给定路径是否是一个文件。 参数 path 是要检查的路径。
返回值是一个布尔值，True 表示路径是一个文件，False 表示路径不是一个文件。
```python
import os

# 检查是否是一个文件
path = 'example.txt'
if os.path.isfile(path):
    print(f'{path} 是一个文件')
else:
    print(f'{path} 不是一个文件')
```

### os.path.isdir
检查给定路径是否是一个目录。
参数 path 是要检查的路径。
返回值是一个布尔值，True 表示路径是一个目录，False 表示路径不是一个目录。
```python
import os

# 检查路径是否是一个目录
path = 'my_folder'
if os.path.isdir(path):
    print(f'{path} 是一个目录')
else:
    print(f'{path} 不是一个目录')
```


### os.path.exists
检查给定路径是否存在。
参数 path 是要检查的路径。
返回值是一个布尔值，True 表示路径存在，False 表示路径不存在。
```python
import os

# 检查路径是否存在
path = 'example.txt'
if os.path.exists(path):
    print(f'{path} 存在')
else:
    print(f'{path} 不存在')
```


















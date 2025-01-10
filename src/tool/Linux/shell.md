---

order: 20
title:  Shell脚本编程
shortTitle: Shell编程
icon: terminal

---


1. [Shell基础概述](#shell基础概述)
2. [Shell变量](#shell变量)
3. [常用命令和运算符](#常用命令和运算符)
4. [Shell流程控制](#shell流程控制)
5. [Shell函数和工具](#shell函数和工具)

---

## Shell基础概述

### Shell脚本入门介绍

Shell 是一个命令行解释器，它为用户提供了与操作系统交互的接口。Shell 脚本是一种简单的编程语言，允许用户编写一系列命令来自动执行任务。通过 Shell 脚本，可以自动化日常操作、简化复杂的任务，并提高工作效率。

### Shell环境类型

- **Bash（Bourne Again Shell）**：最常用的 Shell，兼容 Bourne Shell。
- **Zsh**：功能丰富的 Shell，支持插件和主题，用户体验更好。
- **Ksh（Korn Shell）**：结合了 C Shell 和 Bourne Shell 的特点，适合脚本编写。
- **Tcsh/Csh**：C Shell 及其改进版本，语法更接近 C 语言。

### 编写格式与执行方式

- **编写格式**：Shell 脚本通常以 `.sh` 为扩展名，第一行应包含解释器路径，如 `#!/bin/bash`。
- **执行方式**：
  - 直接运行：赋予文件可执行权限后直接运行 `./script.sh`。
  - 通过解释器：使用解释器运行脚本 `bash script.sh` 或 `sh script.sh`。
  - 在命令行中逐条输入命令。

### 多命令处理

- **分号分隔**：在同一行上用分号 `;` 分隔多个命令。
- **逻辑运算符**：使用 `&&` 表示成功后继续执行，`||` 表示失败后执行。
- **管道**：使用 `|` 将一个命令的输出作为另一个命令的输入。
- **后台执行**：在命令末尾添加 `&` 符号可以让命令在后台运行。

---

## Shell变量

### 自定义变量

- **全局变量**：在整个脚本中都可见，可以在任何地方声明和使用。
- **局部变量**：仅在特定范围内有效，例如函数内部。
- **常量**：一旦赋值就不能再改变，通常使用 `readonly` 关键字定义。

```bash
VARIABLE=value           # 定义变量
echo $VARIABLE           # 输出变量值
readonly CONSTANT=42     # 定义常量
```

### 字符串和数组

- **字符串格式**：双引号 `"` 支持变量替换和转义字符；单引号 `'` 不进行任何特殊处理。
- **拼接**：直接将两个字符串连接起来或使用 `+` 操作符。
- **截取**：使用 `${VAR:offset:length}` 格式从字符串中提取子串。

```bash
STR="Hello, World!"
echo "${STR:0:5}"        # 截取 "Hello"
```

- **数组的定义**：使用 `()` 定义数组，元素之间用空格分隔。
- **获取**：通过索引访问数组元素，使用 `@` 获取所有元素。
- **拼接**：可以直接将两个数组相加。
- **删除**：使用 `unset` 删除数组中的某个元素。

```bash
ARRAY=("apple" "banana" "cherry")
echo "${ARRAY[1]}"       # 输出 "banana"
echo "${ARRAY[@]}"       # 输出所有元素
unset ARRAY[1]           # 删除 "banana"
```

### 特殊符号变量

- **获取输入参数**：`$1`, `$2`, ... 表示第 n 个参数；`$@` 表示所有参数。
- **退出状态码**：`$?` 获取上一条命令的退出状态。
- **进程ID**：`$$` 获取当前 Shell 进程 ID；`$!` 获取最近一次后台运行命令的 PID。

### 环境变量

- **环境变量**：如 `PATH`, `HOME` 等，影响系统的全局行为。
- **自定义系统环境变量**：可以在 `~/.bashrc` 或 `/etc/environment` 中添加。
- **加载流程**：启动时读取配置文件，修改后需要重新加载（`. ~/.bashrc`）。
- **识别Shell环境类型**：可以通过 `$SHELL` 环境变量查看当前使用的 Shell 类型。

---

## 常用命令和运算符

### Shell内置命令

- **设置别名**：`alias` 创建命令的快捷方式。
- **退出**：`exit` 或 `logout` 退出当前会话。
- **输入输出**：`read` 从键盘读取输入；`echo` 输出文本到终端。
- **declare**：用于声明变量属性，如整数、只读等。
- **test**：条件测试命令，相当于 `[ ]`。

### Shell计算命令

- **(()), let, $[]**：进行算术运算。
- **bc**：高精度计算器工具，支持小数运算。

```bash
let "sum = 5 + 3"         # 使用 let 进行算术运算
echo $(( 5 + 3 ))         # 使用 (( )) 进行算术运算
echo "$[5 + 3]"           # 使用 $[] 进行算术运算 (已废弃)
echo "scale=2; 5 / 3" | bc  # 使用 bc 进行浮点运算
```

### Shell运算符

- **算术运算符**：`+`, `-`, `*`, `/`, `%`
- **比较运算符**：`-eq`, `-ne`, `-lt`, `-le`, `-gt`, `-ge`（适用于整数）
- **布尔运算符**：`&&`, `||`, `!`
- **逻辑运算符**：`-a`（AND），`-o`（OR）
- **文件测试**：`-f`, `-d`, `-e`, `-r`, `-w`, `-x` 等，用于检查文件属性。

---

## Shell流程控制

### if else

```bash
if [ condition ]; then
    # do something
elif [ another_condition ]; then
    # do something else
else
    # default action
fi
```

### case语句

```bash
case $variable in
    pattern1)
        # code block for pattern1
        ;;
    pattern2)
        # code block for pattern2
        ;;
    *)
        # default action
        ;;
esac
```

### select语句

```bash
select choice in option1 option2 option3; do
    case $choice in
        option1) echo "You selected option 1";;
        option2) echo "You selected option 2";;
        option3) echo "You selected option 3";;
        *) echo "Invalid option";;
    esac
done
```

### while/until

```bash
while [ condition ]; do
    # do something
done

until [ condition ]; do
    # do something
done
```

### for循环

```bash
for i in {1..5}; do
    echo "Number: $i"
done

for file in *.txt; do
    echo "Processing $file"
done
```

---

## Shell函数和工具

### 系统函数

- **预定义函数**：如 `cd`, `pwd`, `ls` 等，它们是 Shell 内置命令。
- **自定义函数**：用户可以定义自己的函数来封装重复使用的代码块。

```bash
function_name() {
    # function body
}
```

### 自定义函数

```bash
greet_user() {
    echo "Hello, $1!"
}

greet_user "Alice"
```

### cut

- **字段切割**：从文件或标准输入中按列提取数据。
- **选项**：`-d` 指定分隔符，`-f` 指定要提取的字段。

```bash
cut -d',' -f1,3 file.csv
```

### sed

- **流编辑器**：用于解析和转换文本。
- **常用命令**：`s/pattern/replacement/` 替换模式，`d` 删除行，`p` 打印行。

```bash
sed 's/foo/bar/' input.txt
```

### awk

- **文本处理工具**：强大的文本分析和处理程序。
- **基本用法**：`awk '{print $1}'` 打印每一行的第一个字段。

```bash
awk '{print $1}' file.txt
```

### sort

- **排序工具**：对文件内容进行排序。
- **选项**：`-n` 数值排序，`-r` 逆序排序，`-k` 指定排序字段。

```bash
sort -n -k2 file.txt
```

---

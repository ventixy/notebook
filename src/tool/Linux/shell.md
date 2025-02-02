---

order: 20
title:  Shell编程

---


## Shell基础及变量

Shell 是一个命令行解释器，它为用户提供了与操作系统交互的接口。

```bash
echo $SHELL          # /bin/bash
cat /etc/shells      # 查看系统已有的shell
```

::: info Shell环境类型

- **Bash（Bourne Again Shell）**：最常用的 Shell，兼容 Bourne Shell。
- **Zsh**：功能丰富的 Shell，支持插件和主题，用户体验更好。
- **Ksh（Korn Shell）**：结合了 C Shell 和 Bourne Shell 的特点，适合脚本编写。
- **Tcsh/Csh**：C Shell 及其改进版本，语法更接近 C 语言。
:::

### 脚本执行方式

Shell 脚本通常以 `.sh` 为扩展名，第一行应包含解释器路径，如 `#!/bin/bash`。

- **注释**：单行注释使用 `#` 符号，多行可用：`: <<'COMMENT' ... COMMENT`
- **分号分隔**：在同一行上用分号 `;` 分隔多个命令。
- **管道**：使用 `|` 将一个命令的输出作为另一个命令的输入。

```bash
vim test.sh

#!/bin/bash
echo "Hello shell"
ls /

chmod +x test.sh
./test.sh
```

**脚本执行方式**：
  - 直接运行：赋予文件可执行权限后直接运行 `./test.sh` 或 `/root/test.sh`。
  - 通过解释器：使用解释器运行脚本 `bash test.sh` 或 `sh test.sh`。
  - 在当前 shell 环境中执行：`source test.sh` 或 `. test.sh` （文件中定义的变量、函数等对当前 shell 生效）
  - 重定向或管道符：`sh < test.sh` 或 `cat test.sh | sh`





### 自定义变量

- **全局变量**：在整个脚本中都可见，可以在任何地方声明和使用。
- **局部变量**：仅在特定范围内有效，例如函数内部 `local local_var="local var"`
- **常量**：一旦赋值就不能再改变，通常使用 `readonly` 关键字定义。

```bash
VARIABLE="value"         # 定义全局变量
echo $VARIABLE           # 输出变量值

readonly CONSTANT=42     # 定义常量
```
注意：==变量赋值时等号两边不能有空格== ，还有`$VARIABLE`紧邻 `.` 或 `-` 时几乎都是正常的，但是紧邻其他字母时会将整体作为一个变量名，如`echo $VARIABLENAME`会显示为空

::: tip 变量命名规则

1. 名称格式：变量名只能包含字母（a-z, A-Z）、数字（0-9）和下划线（_）。不能以数字开头。

2. 大小写：Shell 变量是区分大小写的。通常情况下，环境变量和导出的变量都使用大写字母，而局部变量使用小写字母或混合大小写。

:::

使用`$`直接引用变量，如`$VARIABLE`，如果变量名后面紧跟其他字符，可能会导致解析错误。

在脚本中，尤其是在处理字符串拼接或者当变量名紧邻其他字符时，建议使用花括号 `{}` 来明确变量边界

```bash
#!/bin/bash
FILE_NAME="readme"
FILE_PATH="${HOME}/my_folder/${FILE_NAME}.txt"
echo $FILE_PATH
```
`${HOME}`为系统预定义的环境变量。



### declare

`declare`：用于声明变量并设置其属性，如整数、只读、数组等


```bash
# 1. 声明整数变量
declare -i num=10

# 2. 声明只读变量
declare -r name="Alice"

# 3. 声明数组变量
declare -a fruits=("Apple" "Banana" "Cherry")

# 4. 声明环境变量
declare -x MY_VAR="Hello"
bash -c 'echo $MY_VAR'     # 输出 Hello
```

| 选项  |                   描述                   |
| ---- | ---------------------------------------- |
| `-i` | 声明为整数                                |
| `-r` | 声明为只读, 示例： `declare -r PI=3.1415` |
| `-a` | 声明为数组                                |
| `-x` | 声明为环境变量                            |





### 命令替换与反引号

命令替换（Command Substitution） `$()`：用于执行命令并将输出结果替换到当前位置，命令替换可以通过两种方式实现：使用反引号 `` `command` `` 或者使用更为现代和推荐的 `$(command)` 语法

```bash
total_files=$(ls | wc -l)
echo "Total files: $total_files"
```

使用反引号 `` `command` `` ：

```bash
$(ls | wc -l) 等同于 `ls | wc -l`
```
- **反引号 `` `command` ``**：一种传统的命令替换方法，适用于简单的场景，但在处理复杂情况时不够灵活，且易读性较差。
- **`$(command)`**：现代、推荐的方式，提供了更好的可读性和灵活性，特别是对于嵌套命令替换等复杂情形。



### 常用数据类型
在 Linux Shell 编程中，虽然不像其他编程语言那样有丰富的数据类型系统，但仍然支持几种基本的数据类型：字符串、整数和数组。

1. **字符串（String）**：Shell 中最基本的数据类型，可以包含字母、数字、空格和特殊字符。
2. **整数（Integer）**：用于数值计算。
3. **数组（Array）**：一组有序的值，可以通过索引来访问其中的元素。


::: tabs

@tab: active 字符串（String）

```bash
# 定义字符串
greeting='Hello, $USER!'
echo $greeting  # 输出: Hello, $USER!

greeting="Hello, $USER!"
echo $greeting  # 输出: Hello, root! (假设当前用户是root)

# 字符串拼接
first_name="John"
last_name="Doe"
full_name="$first_name $last_name"
echo $full_name  # 输出: John Doe

# 字符串截取
text="Hello, World!"
echo ${text:0:5}  # 输出: Hello
echo ${text:7}    # 输出: World!
```

1. **单引号与双引号的区别**
    - **单引号 `'...'`**： 在单引号内的所有字符都被视为普通字符，不会进行变量替换或转义处理。
    - **双引号 `"..."`**： 双引号内的内容允许变量替换和转义字符（如 `\n`, `\t` 等）。

2. **字符串拼接**:  直接将两个字符串放在一起即可实现拼接

3. **字符串截取**: 使用 `${string:start:length}` 语法来截取子串。

@tab 数组（Array）

```bash
# 定义数组
fruits=("apple" "banana" "cherry")

# 获取数组元素
echo ${fruits[0]}  # 输出: apple

# 获取整个数组
echo ${fruits[@]}  # 输出: apple banana cherry

# 数组拼接
more_fruits=("date" "elderberry")
all_fruits=("${fruits[@]}" "${more_fruits[@]}")
echo ${all_fruits[@]}  # 输出: apple banana cherry date elderberry

# 删除数组元素
unset fruits[1]
echo ${fruits[@]}  # 输出: apple cherry

# 删除整个数组
unset fruits
```


1. 定义数组：可以通过多种方式定义数组
  ```bash
  arr=("element1" "element2" "element3")
  declare -a arr=("element1" "element2" "element3")
  ```

2. 获取数组元素: 使用 `${array[index]}` 来获取指定索引处的元素。数组索引从 0 开始。`${arr[@]}`表示获取整个数组

3. 数组拼接：可以通过直接赋值的方式将一个数组的元素添加到另一个数组中。

4. 删除数组元素：使用 `unset` 命令删除数组中的特定元素。

:::




### 环境变量

在 Linux 系统中，环境变量（Environment Variables）是操作系统或用户定义的动态值

```bash
# 显示所有环境变量
printenv
env
export

# 查看特定环境变量
printenv PATH
echo $PATH
```


环境变量的配置涉及多个文件，不同的 shell 及运行模式会影响这些文件的加载顺序：


1. **登录 shell**：加载 `/etc/profile` -> `~/.bash_profile` -> `~/.bashrc`
2. **非登录 shell**：加载 `/etc/bashrc` -> `~/.bashrc`
3. **脚本执行**：不自动加载 `~/.bashrc`
4. **全局环境变量** 推荐 `/etc/environment` 或 `/etc/profile`
5. **用户级环境变量** 推荐 `~/.bashrc` 或 `~/.profile`

全局配置文件（对所有用户生效）
|        配置文件        |                      作用                       |          适用范围           |
| --------------------- | ----------------------------------------------- | -------------------------- |
| `/etc/profile`        | 系统级环境变量，如 `PATH`、`UMASK` 等          | 适用于所有用户的登录 shell   |
| `/etc/profile.d/*.sh` | 由 `/etc/profile` 调用 | 适用于所有用户的登录 shell   |
| `/etc/bashrc`    | 交互式 shell（非登录 shell）时的全局环境变量    | 适用于所有用户的交互式 shell |
| `/etc/environment`    | 仅用于存储环境变量，不能包含 shell 语法            | 适用于所有用户的全局环境      |


用户级配置文件（仅对当前用户生效）
| 配置文件 | 作用 | 适用范围 |
|----------|------|--------|
| `~/.bash_profile` | 定义用户级环境变量，默认加载 `~/.bashrc` | 适用于用户的登录 shell |
| `~/.bashrc` | 定义用户级环境变量及别名 | 适用于用户的交互式 shell |
| `~/.profile` | 仅在 `~/.bash_profile` 不存在时才会被 `bash` 读取 | 适用于用户的登录 shell |
| `~/.bash_logout` | 退出 shell 时执行的脚本 | 适用于用户的登录 shell |
| `~/.zshrc` | `zsh` 专用的配置文件 | 适用于 `zsh` 交互式 shell |
| `~/.zprofile` | `zsh` 登录 shell 配置 | 适用于 `zsh` 登录 shell |

---




变量生效方式

|             命令             |           作用           |       生效范围        |
| ---------------------------- | ----------------------- | -------------------- |
| `export VAR=value`           | 设置环境变量              | 当前 shell 及其子进程 |
| `source 文件名` 或 `. 文件名` | 使 shell 重新加载环境变量 | 当前 shell 及其子进程 |



**修改环境变量的推荐做法：**  

- 如果是 Bash 脚本（如 `cron` 任务），手动 `source /etc/profile` 以确保加载变量。  
- 如果变量仅用于 **用户登录后的操作**，放到 `~/.bashrc` 或 `~/.bash_profile`。  
-  如果变量需要在 **系统服务或定时任务中生效**，放到 `/etc/environment` 或 `systemd` 的 `Environment=` 配置里。  


```bash
# 临时生效（仅当前 shell）
export PATH=$PATH:/opt/bin

# 永久生效（当前用户）
echo 'export PATH=$PATH:/opt/bin' >> ~/.bashrc
source ~/.bashrc

# 永久生效（所有用户）
echo 'export PATH=$PATH:/opt/bin' >> /etc/profile
source /etc/profile

# 在 systemd 服务配置中手动指定环境变量
vim /etc/systemd/system/myapp.service
# 添加/修改为类似下面的配置
[Service]
Environment="JAVA_HOME=/usr/lib/jvm/java-11-openjdk"
Environment="PATH=/usr/local/bin:/usr/bin:/bin:$JAVA_HOME/bin"
ExecStart=/usr/bin/java -jar /opt/myapp/app.jar
# 然后重载 systemd 并重启服务
sudo systemctl daemon-reexec && sudo systemctl restart myapp
```



::: tip 全局 Bash 配置文件

在不同的 Linux 发行版中，全局 Bash 配置文件的命名可能会有所不同：  

1. **Debian / Ubuntu 系列（包括 Debian、Ubuntu、Linux Mint 等）**  
   - 采用 `/etc/bash.bashrc` 作为全局 `bashrc` 配置文件。  
   
2. **Red Hat / CentOS / Rocky Linux / AlmaLinux / Fedora 系列**  
   - 采用 `/etc/bashrc`，而不是 `/etc/bash.bashrc`。  
   - `/etc/profile` 中通常会调用 `/etc/bashrc` 以确保其被加载。  

:::








### shell特殊变量



| 变量 | 含义 | 示例输出 |
|------|------|---------|
| `$0` | 当前脚本的名称 | `./test.sh` |
| `$1`, `$2`, ... | 位置参数，第 1、2、3 个参数 | `arg1`, `arg2`, `arg3` |
| `$*` | 以 **一个整体** 形式显示所有参数 | `arg1 arg2 arg3` |
| `$@` | 以 **分开的形式** 显示所有参数 | `arg1` `arg2` `arg3` |
| `$#` | 传递给脚本的参数个数 | `3` |
| `$$` | 当前 Shell 脚本的 **进程 ID（PID）** | `12345` |
| `$!` | 最近一个在后台运行的 **进程 ID（PID）** | `12346` |
| `$?` | 上一个命令的 **返回值**（0 表示成功，非 0 表示错误） | `2`（上一个 `ls` 命令失败） |




```bash
#!/bin/bash

echo "================ Shell 特殊变量示例 ================"

# 显示脚本名称
echo "\$0（当前脚本名称）: $0"

# 显示传递给脚本的参数
echo "\$1（第一个参数）: $1"
echo "\$2（第二个参数）: $2"
echo "\$3（第三个参数）: $3"
echo "..."

# 显示所有参数
echo "\$*（所有参数，作为一个整体）: $*"
echo "\$@（所有参数，分开显示）: $@"

# 显示参数个数
echo "\$#（参数个数）: $#"

# 显示当前进程 ID
echo "\$$（当前脚本的进程 ID）: $$"

# 启动一个后台任务
sleep 2 &
echo "\$!（最近后台任务的进程 ID）: $!"

# 显示上一个命令的退出状态
ls /nonexistent_dir 2>/dev/null
echo "\$?（上一个命令的返回值）: $?"

echo "================= 结束 ================="
```

假设将脚本命名为 `test.sh`，并赋予执行权限：
```sh
chmod +x test.sh
```

运行脚本并传递参数：
```sh
./test.sh arg1 arg2 arg3
```

示例输出
```bash
================ Shell 特殊变量示例 ================
$0（当前脚本名称）: ./test.sh
$1（第一个参数）: arg1
$2（第二个参数）: arg2
$3（第三个参数）: arg3
...
$*（所有参数，作为一个整体）: arg1 arg2 arg3
$@（所有参数，分开显示）: arg1 arg2 arg3
$#（参数个数）: 3
$$（当前脚本的进程 ID）: 3229
$!（最近后台任务的进程 ID）: 3230
$?（上一个命令的返回值）: 2
================= 结束 =================
```






## 常用命令和运算符

### 输入输出命令

- **`read`**：用于从键盘读取输入，支持提示信息、静默模式和超时设置。
- **`echo`**：用于输出文本，支持转义字符和不换行输出。

```bash
#!/bin/bash

# 读取用户输入
read -p "Enter your name: " name
echo "Hello, $name!"

# 读取密码（静默模式）
read -s -p "Enter your password: " password
echo -e "\nPassword entered."
```

| 选项      | 描述                     |
|-----------|--------------------------|
| `-p`      | 显示提示信息             |
| `-s`      | 静默模式（不显示输入内容） |
| `-t`      | 设置超时时间（秒）       |
| `-n`      | 限制输入的字符数         |



`echo`： 将文本输出到标准输出（通常是终端）

- `-n`: 不输出末尾的换行符 
- `-e`: 启用转义字符解释   


```bash
# 不输出换行符
echo -n "Enter your name: ";read name

# 启用转义字符
echo -e "Hello,\nWorld!"
```











### 数学运算

在 Bash Shell 中，数学运算的方式有多种，包括 `(( ))`、`let`、`$[]`、`expr`、`bc` 等

|   方法   | 是否支持浮点 |          适用场景          |    推荐级别    |
| ------- | ----------- | ------------------------- | ------------- |
| `(( ))` | ❌ 否       | **推荐**的整数运算方式     | ⭐⭐⭐⭐⭐ |
| `let`   | ❌ 否       | 类似 `(( ))`, 同样推荐使用 | ⭐⭐⭐⭐⭐ |
| `$[]`   | ❌ 否       | 旧语法，不推荐             | ⭐           |
| `expr`  | ❌ 否       | POSIX 兼容，但低效         | ⭐⭐         |
| `bc`    | ✅ 是       | **推荐**的浮点运算方式     | ⭐⭐⭐⭐⭐ |
| `awk`   | ✅ 是       | 适用于单行计算             | ⭐⭐⭐⭐    |

```bash
# 1. (( expr )) 适用于整数运算，不支持浮点数, 
(( sum = a + b ))
# 作为条件语句时，表达式 结果非零为真，0 为假
if (( a > b )); then

# 2. let：和 (( )) 类似
let sum=a+b

# 3. $[]：旧式整数运算（已被 (( )) 替代）
sum=$[a + b]

# 4. expr：POSIX 兼容但较低效
sum=$(expr $a + $b)
# 计算乘法（`*` 号要加引号防止被 Shell 解析）
product=$(expr $a \* $b)

# 5. bc：支持浮点运算，计算需要通过管道 | 传输表达式
echo "3.5 + 2.1" | bc       # 输出：5.6
echo "scale=2; 5 / 3" | bc  # 设置精度 scale
# 计算 π * r² 示例
area=$(echo "scale=4; 3.1415 * 2.5 * 2.5" | bc)
echo "圆的面积: $area"  # 输出: 19.6344

# 6. awk：既支持整数也支持浮点
awk 'BEGIN {print 3.5 + 2.1}'  # 输出：5.6
awk 'BEGIN {print sqrt(16)}'   # 输出：4 （计算平方根）
```








### 常见运算符

**算术运算符**用于执行基本的数学运算。Shell 中可以使用 `$(( ))` 或 `let` 来进行算术运算。

| 运算符 | 描述 |                          示例                           |
| ------ | ---- | ------------------------------------------------------ |
| `+`    | 加法 | `echo $((5 + 3))` → `8`                                |
| `-`    | 减法 | `echo $((5 - 3))` → `2`                                |
| `*`    | 乘法 | `echo $((5 * 3))` → `15` 或 `product=$(expr $a \* $b)` |
| `/`    | 除法 | `echo $((10 / 2))` → `5`                               |
| `%`    | 取模 | `echo $((10 % 3))` → `1`                               |



**比较运算符**用于比较两个值。在 Shell 中，比较运算符通常用于 `test` 命令或 `[ ]` 中。

| 运算符 |               描述                |           示例            |
| ------ | -------------------------------- | ------------------------ |
| `-eq`  | 等于（Equal）                     | `[ 5 -eq 5 ]` → `true`   |
| `-ne`  | 不等于（Not Equal）               | `[ 5 -ne 3 ]` → `true`   |
| `-lt`  | 小于（Less Than）                 | `[ 5 -lt 10 ]` → `true`  |
| `-le`  | 小于等于（Less Than or Equal）    | `[ 5 -le 5 ]` → `true`   |
| `-gt`  | 大于（Greater Than）              | `[ 10 -gt 5 ]` → `true`  |
| `-ge`  | 大于等于（Greater Than or Equal） | `[ 10 -ge 10 ]` → `true` |



**布尔运算符**用于组合多个条件。

|  运算符   |     描述      |                   示例                   |
| -------- | ------------ | ---------------------------------------- |
| `&&`     | 逻辑与（AND） | `[ 5 -gt 3 ] && [ 10 -lt 20 ]` → `true`  |
| ``\|\|`` | 逻辑或（OR）  | `[ 5 -lt 3 ] \|\| [ 10 -gt 5 ]` → `true` |
| `!`      | 逻辑非（NOT） | `! [ 5 -eq 3 ]` → `true`                 |

```bash
if [ $a -gt $b ] && [ $a -lt $c ]; then
    echo "$a is between $b and $c"
fi
```


**逻辑运算符**用于在 `test` 命令或 `[ ]` 中组合多个条件。

| 运算符 |      描述       |                 示例                 |
| ------ | -------------- | ----------------------------------- |
| `-a`   | 逻辑与（`AND`） | `[ 5 -gt 3 -a 10 -lt 20 ]` → `true` |
| `-o`   | 逻辑或（`OR`）  | `[ 5 -lt 3 -o 10 -gt 5 ]` → `true`  |

```bash
if [ $a -gt $b -a $a -lt $c ]; then
    echo "$a is between $b and $c"
fi
```



**字符串比较运算符**用于比较字符串

| 运算符 |      描述       |              示例              |
| ------ | --------------- | ----------------------------- |
| `=`    | 等于            | `[ "abc" = "abc" ]` → `true`  |
| `!=`   | 不等于           | `[ "abc" != "def" ]` → `true` |
| `-z`   | 字符串长度为 0   | `[ -z "" ]` → `true`          |
| `-n`   | 字符串长度不为 0 | `[ -n "abc" ]` → `true`       |



**文件测试运算符**用于检查文件或目录的属性

| 运算符 |             描述              |               示例               |
| ------ | ----------------------------- | ------------------------------- |
| `-e`   | 文件存在                       | `[ -e /path/to/file ]` → `true` |
| `-f`   | 检查指定路径是否指向一个普通文件 | `[ -f /path/to/file ]` → `true` |
| `-d`   | 是目录                         | `[ -d /path/to/dir ]` → `true`  |
| `-r`   | 文件可读                       | `[ -r /path/to/file ]` → `true` |
| `-w`   | 文件可写                       | `[ -w /path/to/file ]` → `true` |
| `-x`   | 文件可执行                     | `[ -x /path/to/file ]` → `true` |





### 条件测试命令


**`test`**：用于条件测试，支持文件属性、字符串比较和数值比较。 `test` 命令等同于 `[ ]`，`[` 是 `test` 的别名。

示例 1 - 文件测试：假设我们要检查一个文件是否存在并且是一个普通文件。

使用 `test` 命令
```bash
FILE="/path/to/file"

if test -f "$FILE"; then
    echo "File exists and is a regular file."
else
    echo "File does not exist or is not a regular file."
fi
```

使用 `[ ]`
```bash
FILE="/path/to/file"

if [ -f "$FILE" ]; then
    echo "File exists and is a regular file."
else
    echo "File does not exist or is not a regular file."
fi
```



示例2 : 结合 `&&` 和 `||` 进行更复杂的条件判断

```bash
FILE="/path/to/newfile"

if [ ! -f "$FILE" ]; then
    echo "File does not exist. Creating it now..."
    touch "$FILE"
else
    echo "File already exists."
fi
```

或者可以简化为：
```bash
FILE="/path/to/newfile"

[ ! -f "$FILE" ] && touch "$FILE" || echo "File already exists."
```


::: tip 注意事项

1. **空格的重要性**：在 `[ ]` 中，方括号与条件表达式之间必须有空格分隔，否则会导致语法错误。
   ```bash
   if [ "$STR1" = "$STR2" ]; then  # 正确
   if [$STR1 = $STR2]; then        # 错误
   ```

2. **引号的使用**：当变量可能为空或包含空格时，应该用双引号包裹变量以避免解析错误。
   ```bash
   if [ "$VAR" = "value" ]; then  # 推荐
   if [ $VAR = value ]; then      # 不推荐，特别是当 VAR 可能为空或含空格时
   ```
3. 在 Shell 中，退出状态码 `0` 表示成功或真（`true`），而非零值表示失败或假（`false`）
    ```bash
   [ "abc" = "abc" ];echo $?     # 0
   [ "abc" = "abce" ];echo $?    # 1
    ```
:::















## Shell流程控制语句

### if else

`if` 语句用于根据条件执行不同的代码块。`elif` 可以用来处理多个条件分支，而 `else` 则提供了默认的执行路径

```bash
if [ condition ]; then
    # do something
elif [ another_condition ]; then
    # do something else
else
    # default action
fi
```
- 条件表达式通常用 `[ ]` 或 `[[ ]]` 包围。并确保在 `[ ]` 和条件之间留有空格。
- 使用 `[[ ]]` 更加灵活，支持更多的操作符，如正则表达式匹配。

```bash
#!/bin/bash

read -p "Enter a number: " num

if [[ $num -gt 10 ]]; then
    echo "Number is greater than 10."
elif [[ $num -eq 10 ]]; then
    echo "Number is exactly 10."
else
    echo "Number is less than 10."
fi
```


### case语句

`case` 语句允许根据变量值的不同模式执行不同的代码块。它非常适合于多路分支选择的情况

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
- 模式匹配使用` )` 结尾，并且每个模式块后跟 `;;` 表示结束。使用 `*` 作为默认匹配模式
- 支持通配符（如 `*, ?, [...]`）进行模式匹配。

```bash
#!/bin/bash

read -p "Enter fruit name: " fruit

case $fruit in
    apple|orange)
        echo "It's an orange or apple."
        ;;
    banana)
        echo "It's a banana."
        ;;
    *)
        echo "Unknown fruit."
        ;;
esac
```



### select语句

`select` 语句生成一个简单的菜单，用户可以通过输入数字选择选项。适合用于交互式的脚本中让用户做出选择

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
需要结合 `case` 语句来处理用户的输入。用户输入无效时可以设置默认行为。

```bash
#!/bin/bash

echo "Select your favorite color:"
select color in red blue green yellow; do
    case $color in
        red)
            echo "You selected red."
            break
            ;;
        blue)
            echo "You selected blue."
            break
            ;;
        green)
            echo "You selected green."
            break
            ;;
        yellow)
            echo "You selected yellow."
            break
            ;;
        *)
            echo "Invalid option, please select again."
            ;;
    esac
done
```




### while/until

`while` 循环会在条件为真时重复执行循环体内的命令

```bash
while [ condition ]; do
    # do something
done
```

`until` 循环则相反，它会在条件为假时重复执行循环体内的命令

```bash
until [ condition ]; do
    # do something
done
```
在循环体内修改影响条件的变量以避免无限循环

```bash
#!/bin/bash

# While loop example
counter=0
while [ $counter -lt 5 ]; do
    echo "Counter is $counter"
    ((counter++))
done

# Until loop example
counter=0
until [ $counter -ge 5 ]; do
    echo "Counter is $counter"
    ((counter++))
done
```




### for循环

for 循环有两种常见形式：遍历序列和遍历文件名通配符

```bash
#!/bin/bash

# For loop with sequence
for i in {1..5}; do
    echo "Number: $i"
done

# For loop with file patterns
for file in *.txt; do
    if [ -f "$file" ]; then
        echo "Processing $file"
    else
        echo "No .txt files found."
    fi
done
```

- 使用 `{1..5}` 语法可以快速生成数字序列。
- 使用通配符（如 `*.txt`）可以遍历匹配的文件名





## 自定义函数的应用

在 Shell 脚本中，函数是一种将代码组织成可重用块的方式。它们有助于提高代码的可读性、维护性和模块化程度

1. 定义函数，`function` 关键字可省略

```bash
function function_name {
    commands  # 函数体
}
```

2. 定义之后，可以通过简单地写出函数名来调用它（如果函数需要参数，则在函数名后加上空格分隔的参数列表）：

```bash
function_name arg1 arg2 ...
```

3. Shell 函数默认返回最后一个命令的退出状态码。也可以显式地使用 `return` 语句指定一个返回值，但请注意，`return` 只能返回整数值（`0-255`），并且通常用于表示成功（`0`）或失败（非零）。

    如果想返回字符串或其他复杂数据类型，可以考虑通过输出到标准输出（`stdout`）并捕获该输出。
    

简易计算器示例：
```bash
#!/bin/bash

# 函数：加法
add() {
    echo $(($1 + $2))
}

# 函数：减法
subtract() {
    echo $(($1 - $2))
}

# 函数：乘法
multiply() {
    echo $(($1 * $2))
}

# 函数：除法
divide() {
    if [ $2 -eq 0 ]; then
        echo "Error: Division by zero"
        return 1
    else
        echo "scale=2; $1 / $2" | bc
    fi
}

# 函数：显示菜单并获取用户输入
show_menu_and_get_input() {
    echo "Simple Calculator"
    echo "1. Add"
    echo "2. Subtract"
    echo "3. Multiply"
    echo "4. Divide"
    echo "5. Exit"
    
    read -p "Choose an option (1-5): " choice
    
    case $choice in
        1|2|3|4)
            read -p "Enter first number: " num1
            read -p "Enter second number: " num2
            ;;
        5)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid option, please try again."
            show_menu_and_get_input
            ;;
    esac
    
    return $choice
}

# 主程序逻辑
while true; do
    show_menu_and_get_input
    choice=$?

    case $choice in
        1)
            result=$(add $num1 $num2)
            ;;
        2)
            result=$(subtract $num1 $num2)
            ;;
        3)
            result=$(multiply $num1 $num2)
            ;;
        4)
            result=$(divide $num1 $num2)
            if [ $? -ne 0 ]; then continue; fi  # 如果除法出错则跳过输出结果
            ;;
        *)
            continue  # 忽略其他情况（理论上不会到达这里）
            ;;
    esac

    echo "Result: $result"
done
```



1. **变量作用域**：如上所述，使用 `local` 可以限制变量的作用范围，避免意外覆盖全局变量。
   
2. **函数内的条件判断和循环**：函数内可以包含任何合法的 Shell 语法，包括条件语句 (`if`, `case`) 和循环 (`while`, `for`, `until`)。
   
3. **函数的递归调用**：Shell 支持函数的递归调用，但在编写递归函数时应注意避免无限递归导致栈溢出。

4. **错误处理**：可以通过检查 `$?` 获取上一条命令的退出状态码来进行基本的错误处理。








<br/>

















 cut

- **字段切割**：从文件或标准输入中按列提取数据。
- **选项**：`-d` 指定分隔符，`-f` 指定要提取的字段。

```bash
cut -d',' -f1,3 file.csv
```



sed

- **流编辑器**：用于解析和转换文本。
- **常用命令**：`s/pattern/replacement/` 替换模式，`d` 删除行，`p` 打印行。

```bash
sed 's/foo/bar/' input.txt
```


awk

- **文本处理工具**：强大的文本分析和处理程序。
- **基本用法**：`awk '{print $1}'` 打印每一行的第一个字段。

```bash
awk '{print $1}' file.txt
```


sort

- **排序工具**：对文件内容进行排序。
- **选项**：`-n` 数值排序，`-r` 逆序排序，`-k` 指定排序字段。

```bash
sort -n -k2 file.txt
```

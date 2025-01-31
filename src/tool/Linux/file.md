---

order: 10
title:  文件编辑与查看

---

## 查看文件内容

### cat/tac/nl

  ==cat、tac、nl 直接查看文件内容== : 

- cat 由第一行开始显示文件内容，cat 是 Concatenate （连续）的简写
- tac 从最后一行开始显示，可以看出 tac 是 cat 的倒着写！
- nl  显示的时候，顺道输出行号！

这些命令在文件行数较多时使用并不方便、推荐使用下面介绍的 more 和 less


### more/less
 more、less 不仅可以分页查看文件，less还支持文件内容搜索
 
::: info more 和 less 

- **more**: 一页一页的显示文件内容

  ```shell
  空白键 (space)  ：代表向下翻一页；
  Enter          ：代表向下翻『一行』；
  /字串           ：代表在这个显示的内容当中，向下搜寻『字串』这个关键字；
  :f             ：立刻显示出档名以及目前显示的行数；
  q              ：代表立刻离开 more ，不再显示该文件内容。
  b 或 [ctrl]-b  ：代表往回翻页，不过这动作只对文件有用，对管线无用。
  ```

- **less**: 命令是一个更强大的分页查看工具，提供了更多的功能和灵活性。还可以往前翻页！

  ```shell
  空白键       ：向下翻动一页；
  [pagedown]  ：向下翻动一页；
  [pageup]    ：向上翻动一页；
  /字串        ：向下搜寻『字串』的功能；
  ?字串        ：向上搜寻『字串』的功能；
  n           ：重复前一个搜寻 (与 / 或 ? 有关！)
  N           ：反向的重复前一个搜寻 (与 / 或 ? 有关！)
  q           ：退出 less 这个程序；
  ```
  - 前进/后退，翻页
    - `空格键`/ `pagedown`：显示下一屏内容。
    - `b`/ `pageup`：回退一屏内容。
    - `d`：向前翻半屏。
    - `y`：向上翻半屏。
    - `Enter`：显示下一行内容。
  - 搜索字符串
    - `/`：搜索字符串。
    - `?`：反向搜索字符串。
    - `n`：重复上一次搜索。
    - `N`：反向重复上一次搜索。
  - `g`：跳到文件开头。
  - `G`：跳到文件结尾。
  - `h`：显示帮助信息。
  - `q`：退出 `less` 命令。
```bash
less -N content.txt     # 显示文件内容并显示行号
```
:::


### head/tail

  ==head、tail 从头（尾）查看文件（指定行数）== : 		

- head  只看头几行 （若没有加上 -n 这个选项时，默认只显示十行）
- tail     只看尾巴几行 （默认也是显示十行，若要显示非十行，就加 -n number 的选项即可）

```shell

head -n 1 /etc/my.cnf            # 查看第一行文件

tail -n +100 /etc/man_db.conf    # 代表该文件从100行以后都会被列出来

```

例：假如想要显示 /etc/man.config 的第 11 到第 20 行呢？

```shell 
# 取前 20 行，再取后十行，所以结果就是：
head -n 20 /etc/man_db.conf | tail -n 10 
```



<br/>




### find文件查找

`find` 是 Linux 中一个功能强大的文件查找工具，用于在指定目录下查找符合条件的文件或目录。

```bash
find [路径] [表达式]
```
- **路径**：指定查找的起始目录，默认为当前目录（`.`）。
- **表达式**：定义查找条件，如文件名、类型、大小等。

::: tabs

@tab 文件名
   - `-name`：按文件名匹配（区分大小写）。
   - `-iname`：按文件名匹配（不区分大小写）。
   - `-regex`：按正则表达式匹配。

   ```bash
   find /home -name "*.txt"          # 查找 /home 目录下所有 .txt 文件
   find . -iname "readme"            # 查找当前目录下名为 readme 的文件（不区分大小写）
   find /var/log -regex ".*\.log"    # 查找 /var/log 目录下所有 .log 文件
   ```

@tab 文件类型
   - `-type`：按文件类型查找。
     - `f`：普通文件。
     - `d`：目录。
     - `l`：符号链接。

   ```bash
   find /etc -type f                 # 查找 /etc 目录下所有普通文件
   find . -type d                    # 查找当前目录下所有子目录
   find /usr/bin -type l             # 查找 /usr/bin 目录下所有符号链接
   ```

@tab 文件大小
   - `-size`：按文件大小查找。
     - `+n`：大于 n 个单位。
     - `-n`：小于 n 个单位。
     - `n`：等于 n 个单位。
     - 单位：`c`（字节）、`k`（KB）、`M`（MB）、`G`（GB）。

   ```bash
   find /var -size +100M             # 查找 /var 目录下大于 100MB 的文件
   find . -size -10k                 # 查找当前目录下小于 10KB 的文件
   find /home -size 1G               # 查找 /home 目录下等于 1GB 的文件
   ```

@tab 时间
   - `-mtime`：按文件修改时间查找（天数）。
   - `-atime`：按文件访问时间查找（天数）。
   - `-ctime`：按文件状态变更时间查找（天数）。
   - `-mmin`：按文件修改时间查找（分钟）。
   - `-amin`：按文件访问时间查找（分钟）。
   - `-cmin`：按文件状态变更时间查找（分钟）。

   ```bash
   find /var/log -mtime -7           # 查找 /var/log 目录下 7 天内修改过的文件
   find . -atime +30                 # 查找当前目录下 30 天前访问过的文件
   find /tmp -cmin -60               # 查找 /tmp 目录下 60 分钟内状态变更的文件
   ```

@tab 权限
   - `-perm`：按文件权限查找。
     - `mode`：精确匹配权限。
     - `-mode`：包含指定权限。
     - `/mode`：任意权限位匹配。

   ```bash
   find /etc -perm 644               # 查找 /etc 目录下权限为 644 的文件
   find . -perm -u=r                 # 查找当前目录下用户可读的文件
   find /var -perm /u=x              # 查找 /var 目录下用户可执行的文件
   ```

@tab 用户
   - `-user`：按文件所有者查找。
   - `-group`：按文件所属用户组查找。

   ```bash
   find /home -user alice            # 查找 /home 目录下属于用户 alice 的文件
   find /var -group www-data         # 查找 /var 目录下属于用户组 www-data 的文件
   ```

@tab 组合条件
   - `-a` 或 `-and`：逻辑与（默认）。
   - `-o` 或 `-or`：逻辑或。
   - `!` 或 `-not`：逻辑非。

   ```bash
   find /var -name "*.log" -size +10M  # 查找 /var 目录下大于 10MB 的 .log 文件
   find . -type f -mtime -7            # 查找当前目录下 7 天内修改过的普通文件
   find /home -user bob -not -name "*.tmp"  # 查找 /home 目录下属于 bob 且不是 .tmp 的文件
   ```

@tab 执行操作
   - `-exec`：对查找到的文件执行命令。
   - `-delete`：删除查找到的文件。
   - `-print`：打印查找到的文件路径（默认行为）。

   ```bash
   find /tmp -type f -mtime +30 -delete  # 删除 /tmp 目录下 30 天前的文件
   find . -name "*.bak" -exec rm {} \;   # 删除当前目录下所有 .bak 文件
   find /var/log -name "*.log" -exec gzip {} \;  # 压缩 /var/log 目录下所有 .log 文件
   ```
@tab:active grep
通过结合 `find` 和 `grep`，可以高效地查找某目录下包含指定内容的文件
```bash
# 查找当前目录下包含 "hello" 的文件
find . -type f -exec grep -l "hello" {} +

# 查找 /var/log 目录下包含 "error" 的文件
find /var/log -type f -exec grep -l "error" {} +
# 查找 /home 目录下包含 "password" 的 .txt 文件
find /home -type f -name "*.txt" -exec grep -l "password" {} +

# 查找 /etc 目录下包含 "127.0.0.1" 的文件，并显示匹配行的内容
find /etc -type f -exec grep -H "127.0.0.1" {} +
```
::: 

高级用法示例：
   ```bash
   find . -empty                      # 查找当前目录下所有空文件或空目录
   find /var/log -type f | wc -l      # 统计 /var/log 目录下文件数量
   
   # 查找大于 100MB 的文件并按大小排序
   find /var -type f -size +100M -exec ls -lh {} \; | sort -k5,5h  
   
   # 查找 /home 目录下 .txt 文件，但排除 /home/alice 目录
   find /home -path "/home/alice" -prune -o -name "*.txt" -print 
   ```




### grep内容搜索

`grep`名字来源于 **Global Regular Expression Print**（全局正则表达式打印）。`grep` 是一个强大的文本搜索工具，支持正则表达式和多种选项。

```bash
grep [选项] 模式 [文件...]
```
- **模式**：要搜索的字符串或正则表达式。
- **文件**：要搜索的文件（可以是一个或多个文件）。如果不指定文件，`grep` 会从标准输入读取数据。

| 选项          | 说明                                                                 |
|---------------|--------------------------------------------------------------------|
| `-i`          | 忽略大小写（case-insensitive）。                                     |
| `-v`          | 反向匹配，显示不包含模式的行。                                        |
| `-r` 或 `-R`  | 递归搜索目录中的文件。                                               |
| `-n`          | 显示匹配行的行号。                                                   |
| `-c`          | 统计匹配的行数（而不是显示匹配的内容）。                               |
| `-l`          | 只显示包含匹配模式的文件名，而不是匹配的行。                           |
| `-w`          | 匹配整个单词，而不是部分匹配。                                        |
| `-A NUM`      | 显示匹配行及其后面的 NUM 行。                                         |
| `-B NUM`      | 显示匹配行及其前面的 NUM 行。                                         |
| `-C NUM`      | 显示匹配行及其前后各 NUM 行。                                         |
| `-e PATTERN`  | 指定多个模式。                                                       |
| `-f FILE`     | 从文件中读取模式（每行一个模式）。                                     |
| `--color`     | 高亮显示匹配的文本。                                                 |

```bash
# 1. 在文件中搜索包含指定字符串的行
grep "hello" file.txt  # 在 `file.txt` 中查找包含 `hello` 的行

# 2.忽略大小写：查找 `hello`、`Hello`、`HELLO` 等
grep -i "hello" file.txt

# 3. 显示行号: 使用 `-n` 选项显示匹配行的行号
grep -n "hello" file.txt

# 4. 统计匹配行数: 只显示匹配的行数，而不是具体内容
grep -c "hello" file.txt

# 5. 反向匹配: 显示所有不包含 `hello` 的行
grep -v "hello" file.txt

# 6. 递归搜索目录：在目录及其子目录中查找包含 `hello` 的文件
grep -r "hello" /path/to/dir

# 7. 匹配整个单词: 只匹配 `hello`，而不匹配 `hello123` 或 `helloworld`
grep -w "hello" file.txt

# 8. 显示上下文: 显示匹配行及其前后各 2 行
grep -C 2 "hello" file.txt

# 9. 从文件中读取模式
# 从 `patterns.txt` 中读取多个模式（每行一个模式），并在 `file.txt` 中搜索
grep -f patterns.txt file.txt

# 10 高亮显示匹配内容: 匹配的 `hello` 会以颜色高亮显示
grep --color "hello" file.txt
```

`grep` 支持基本正则表达式（BRE）和扩展正则表达式（ERE）。使用 `-E` 选项启用扩展正则表达式。

- 查找以 `hello` 开头的行：
  ```bash
  grep "^hello" file.txt
  ```
- 查找以 `world` 结尾的行：
  ```bash
  grep "world$" file.txt
  ```
- 查找包含 `hello` 或 `world` 的行：
  ```bash
  grep -E "hello|world" file.txt
  ```
- 查找包含数字的行：
  ```bash
  grep -E "[0-9]" file.txt
  ```

`grep` 可以与其他命令结合使用，例如 `ps`、`ls`、`cat` 等。

查找包含 `nginx` 的进程：
```bash
ps aux | grep nginx
```

列出当前目录下包含 `test` 的文件：
```bash
ls | grep test
```

在文件中查找内容并显示行号：
```bash
cat file.txt | grep -n "hello"
```





## 修改/编辑文件



### 追加与重定向

在 Linux 中，重定向和追加是用于控制命令输出的重要机制。通过重定向，可以将命令的标准输出（stdout）或标准错误（stderr）重定向到文件或其他流中。通过追加，可以将输出添加到文件的末尾，而不是覆盖现有内容。

```bash
echo "Hello, World!" > greeting.txt           # 输出重定向 (Output Redirection)
ls non_existent_file 2> error_log.txt         # 错误重定向 (Error Redirection)
ls non_existent_file &> combined_log.txt      # 同时重定向 stdout 和 stderr

echo "Another line" >> greeting.txt           # 输出追加 (Append Output)
ls non_existent_file 2>> error_log.txt        # 错误追加 (Append Error)
ls non_existent_file &>> combined_log.txt     # 同时追加 stdout 和 stderr
```

::: info 重定向 (Redirection) 与 追加 (Appending)
#### 重定向 (Redirection)
重定向：如果文件不存在，那么会创建文件。如果文件已经存在，那么会覆盖文件中的内容
- 输出重定向 (`>`)：将标准输出重定向到文件，覆盖现有内容。
- 错误重定向 (`2>`)：将标准错误重定向到文件，覆盖现有内容。
- 同时重定向 stdout 和 stderr (`&>`)：将标准输出和标准错误重定向到同一个文件，覆盖现有内容。

#### 追加 (Appending)
追加：如果文件不存在，依然会创建文件。文件已存在时不会覆盖原来文件中的内容

- 输出追加 (`>>`)：将标准输出追加到文件的末尾，不覆盖现有内容。
- 错误追加 (`2>>`)：将标准错误追加到文件的末尾，不覆盖现有内容。
- 同时追加 stdout 和 stderr (`&>>`)：将标准输出和标准错误追加到同一个文件的末尾，不覆盖现有内容。
:::



### 修改文件时间

- **modifiy time (mtime)**：当该文件的『内容』变更时，就会升级这个时间！内容数据指的是文件的内容，而不是文件的属性或权限喔！

- **changetime (ctime)**： 当该文件的『状态 (status)』改变时，就会升级这个时间，举例来说，像是权限与属性被更改了，都会升级这个时间啊。

- **access time (atime)**：当『该文件的内容被读取』时，就会升级这个读取时间 (access)。举例来说，我们使用 `cat` 去读取 `/etc/man_db.conf`， 就会升级该文件的 atime 了。

```shell
ls -l 文件名                      # 查看 mtime
ls -l --time=ctime 文件名         # 查看 ctime
ls -l --time=atime 文件名         # 查看 atime
```

![](https://image.ventix.top/img01/202101101731453.png)


touch：将某个文件的所有日期更新为系统当前时间， 或将(mtime 与 atime)修改为指定时间 

![](https://image.ventix.top/img01/202101101731191.png)

![](https://image.ventix.top/img01/202101101732079.png)



change time 只能通过修改系统时间来自定义（但是一般情况下修改系统时间需要root权限）
::: details 通过改变系统时间来修改change time 
```shell

[root@DevMachine temp]# date -s 06/06/2022 >> a.bash

# 文件的atime和mtime已经改变，但是ctime时间没变
[root@DevMachine temp]# stat a.bash
  File: ‘a.bash’
  Size: 29              Blocks: 8          IO Block: 4096   regular file
Device: fd00h/64768d    Inode: 67415159    Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Context: unconfined_u:object_r:admin_home_t:s0
Access: 2022-03-03 23:23:00.000000000 +0800
Modify: 2022-06-06 00:00:00.000000000 +0800
Change: 2022-06-06 00:00:00.000000000 +0800
 Birth: -
 
#此时系统时间已经改变
[root@DevMachine temp]# date "+%F %T"
2022-06-06 00:00:56

# 更新系统时间为正常时间
[root@DevMachine temp]# /usr/sbin/ntpdate ntp.api.bz
 1 Apr 11:21:35 ntpdate[1803]: step time server 114.118.7.161 offset -5661630.439834 sec

# 系统时间已经更新正常
[root@DevMachine temp]# date "+%F %T"
2022-04-01 11:21:44

# 系统时间已经还原，ctime修改已完成
[root@DevMachine temp]# stat a.bash
  File: ‘a.bash’
  Size: 29              Blocks: 8          IO Block: 4096   regular file
Device: fd00h/64768d    Inode: 67415159    Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Context: unconfined_u:object_r:admin_home_t:s0
Access: 2022-03-03 23:23:00.000000000 +0800
Modify: 2022-06-06 00:00:00.000000000 +0800
Change: 2022-06-06 00:00:00.000000000 +0800
 Birth: -
 
```
:::



### 常见文本编辑器

**命令行编辑器**：适合在终端环境中使用，尤其是远程服务器或无图形界面的系统。
  - 初学者可以从 **Nano** 开始。
  - 高级用户推荐 **Vim** 或 **Emacs**。

| **类型**         | **编辑器**      | **特点**                                                                 | **适用场景**                          | **学习难度** |
|------------------|----------------|------------------------------------------------------------------------|--------------------------------------|-------------|
| **命令行编辑器** | Vi/Vim         | 模式编辑，高度可定制，适合复杂任务                                         | 系统管理员、开发人员、远程服务器编辑       | 高          |
|                  | Nano           | 简单易用，适合快速编辑                                                   | 初学者、简单配置文件编辑                 | 低          |
|                  | Emacs          | 功能强大，支持扩展和插件，可变成IDE                                        | 开发人员、高级用户、复杂文本处理           | 高          |
| **图形界面编辑器** | Gedit          | 简单易用，适合日常文本编辑                                                | 桌面用户、日常文档编辑                   | 低          |
|                  | Sublime Text   | 界面美观，功能强大，支持插件扩展                                           | 开发人员、设计师、大型项目开发             | 中          |
|                  | Atom           | 开源，支持大量插件，适合团队协作                                           | 开发人员、团队协作、项目管理               | 中          |
|                  | VS Code        | 功能强大，支持多种语言和框架，内置调试工具                                   | 开发人员、团队协作、编程和调试             | 中          |

---

**图形界面编辑器**：适合在桌面环境中使用，提供更直观的操作体验。
  - 日常编辑推荐 **Gedit**。
  - 开发推荐 **VS Code** 或 **Sublime Text**。
  - 开源爱好者推荐 **Atom**



## Vim使用技巧



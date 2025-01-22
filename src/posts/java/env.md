---
article: true
date: 2019-11-10
category:
  - java
  - jdk
tag:
  - java
  - jdk
shortTitle: Java开发环境
title: 不同操作系统的Java开发环境搭建
order: 1
---

## Linux环境


解压安装jdk: [jdk 8u202之前的版本下载地址](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html)   &nbsp;  [jdk全版本下载地址](https://www.oracle.com/java/technologies/oracle-java-archive-downloads.html)

- 先检查是否已经安装jdk

```shell
java -version

rpm -qa|grep openjdk -i   # 检查系统安装的openjdk

rpm -e --nodeps XXX(需要删除的软件名) #如果存在openjdk,就用这个命令逐一删除
```

- 创建jdk安装目录和软件包存储目录，并上传jdk文件。将文件解压剪贴到jdk安装目录后配置环境变量即可。

```shell
mkdir /usr/java
mkdir /home/software

tar -zxvf jdk-8u191-linux-x64.tar.gz
mv jdk1.8.0_191/ /usr/java/
```

- 配置环境变量，（修改profile文件）

```shell
vim /etc/profile  #配置环境变量，加入如下信息：(按esc退出插入模式后 :wq 保存退出)
```

```
export JAVA_HOME=/usr/java/jdk1.8.0_191
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=$JAVA_HOME/bin:$PATH
```

- 刷新profile，使其生效

```shell
source /etc/profile
```
<br>





## Windows

### 下载安装JDK

到 [oracle官网](https://www.oracle.com/java/technologies/downloads/) 下载适合的JDK安装包，注意要选择自己系统对应的版本


根据提示依次点击下一步即可完成安装

```bash
# 安装完成后我们测试一下是否正确完成安装
java -version
```

非安装包直接解压配置环境变量即可


### 配置环境变量

Windows下可以直接通过搜索环境变量在图形界面进行设置，也可以使用命令设置

1. 新建`JAVA_HOME`系统环境变量，值为jdk所在目录，如`D:\Develop\jdk\jdk-21.0.5`
2. 编辑 `Path` 环境变量，新建 `%JAVA_HOME%\bin`, `%JAVA_HOME%\jre\bin`
3. (可选) 新建 `CLASSPATH`，值为 `.;%JAVA_HOME%\lib\tools.jar;%JAVA_HOME%\lib\dt.jar`


::: info 通过PowerShell命令/脚本设置Windows环境变量
将以下内容复制粘贴到编辑器中，保存文件为：`set_env.ps1`, 打开PowerShell，切换到目标目录，然后运行脚本`.\set_env.ps1`
```bash
# 设置 JAVA_HOME 系统环境变量
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "D:\Develop\jdk\jdk-21.0.5", "Machine")

# 设置 MAVEN_HOME 系统环境变量
[System.Environment]::SetEnvironmentVariable("MAVEN_HOME", "D:\Develop\maven\apache-maven-3.8.8", "Machine")

# 获取当前的系统 Path 环境变量值
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")

# 添加新的路径到 Path 环境变量
$newPath = "$currentPath;%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;%MAVEN_HOME%\bin"
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")

# (可选) 设置 CLASSPATH 系统环境变量
[System.Environment]::SetEnvironmentVariable("CLASSPATH", ".;%JAVA_HOME%\lib\tools.jar;%JAVA_HOME%\lib\dt.jar", "Machine")
```
设置环境变量后，需要关闭当前的命令提示符窗口，重新打开一个新的命令提示符窗口，才能使新的环境变量生效。
:::


配置完可以通过下列CMD命令查看结果：
```bash
java -version

echo %JAVA_HOME%
```

【注意】不要使用CMD命令， 使用 setx 命令设置 path 时会把用户的path也加入进去，而且变量会被替换为实际地址。


## MacOS

MacOS中配置JAVA_HOME和环境变量的方法如下：

```bash
# 查看JAVA所在的路径 最后一行即为路径
/usr/libexec/java_home -V

# 当前用户目录下查看一下是否有.bash_profile文件
ls -a
# 若没有则需要新建此文件
touch .bash_profile

# 打开文件
open -e .bash_profile
```

若文件是空的，直接复制下面的内容进去即可，若原本有内容，加在直接末尾即可

```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home
PATH=$JAVA_HOME/bin:$PATH:.
CLASSPATH=$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:.
export JAVA_HOME
export PATH
export CLASSPATH
```
其中JAVA_HOME 的地址为前面 通过 `/usr/libexec/java_home -V` 命令查看的最后一行内容

```bash
# 保存文件后 需要刷新配置文件
source .bash_profile

# 查看 JAVA_HOME
echo $JAVA_HOME
```



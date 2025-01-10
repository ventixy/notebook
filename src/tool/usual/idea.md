---

order: 1
title:  IDEA和Eclipse
shortTitle: JetbrainsIDEA
icon: intellij-idea

---



## 一 IDEA设置

一个神奇的网站：https://zhile.io/

ja-netfilter code：https://jetbra.in/s

插件市场：https://plugins.jetbrains.com/


<br>

### 1. 常用插件

- Lombok

- Maven Helper

- 



<br>



### 2. 自动导包

自动导包、自动删除不需要的import语句

![](https://image.ventix.top/img01/202101101736156.png)


<br>

### 3. 注释模板

创建类时自动生成注释的模板、示例：

```java
/**
 * @description ${NAME}
 * @since ${DATE} ${TIME}
 * @author  idrizzle
 */
```

![](https://image.ventix.top/img01/202101101736331.png)





创建方法模板：

**File–>Settings–>Editor–>Live Templates、点击右边的 + 号, 选择 Template Group** 、创建自己的组名

![](https://image.ventix.top/img01/202101101737626.png)



选择自己的组名，点击”+”号，选择Live Template、填写Abbreviation，Description，Template text

```java
**
$params$ 
 * @author itdrizzle
 * @since $date$ $time$ 
 * @return $return$
 */
```

![](https://image.ventix.top/img01/202101101737521.png)



点击 Define 选择java，也可以选择everywhere 、设置Edit variables 

![](https://image.ventix.top/img01/202101101737299.png)

```groovy
groovyScript("def result=''; def params=\"${_1}\".replaceAll('[\\\\[|\\\\]|\\\\s]', '').split(',').toList(); for(i = 0; i < params.size(); i++) {result+=' * @param ' + params[i] + ((i < params.size() - 1) ? '\\r\\n' : '')}; return result", methodParameters())
```

```groovy
groovyScript("def result=\"${_1}\"; if(result == \"void\"){return \"\";}else{return \"{@link \"+result+\"}\";}", methodReturnType())
```

【注】使用方式：先键入 /*aa 再按tab健即可

<br>


## 二 常用快捷键

### 1. 编辑快捷键

| idea快捷键      | 功能或作用                        | eclipse对应快捷键                         |
| --------------- | --------------------------------- | ----------------------------------------- |
| Alt+insert      | 生成get，set方法                  | Shift+Alt+S                               |
| Ctrl+Alt+L      | 格式化代码                        | 先选择代码 然后 Ctrl+I格式化代码          |
| Ctrl+Alt+T      | 把代码包在一个块内，如：try/catch |                                           |
| Ctrl+Shift+U    | 切换代码大小写                    | Ctrl+Shift+X（大写） Ctrl+Shift+Y（小写） |
| Ctrl+F4         | 关闭当前代码窗                    | Ctrl+W                                    |
| Ctrl+Alt+左右键 | 快速定位到上一次编辑的位置        | Ctrl+Q                                    |

【注】Ctrl+Alt+L 常和其他快捷键冲突、改用Ctrl+Shift+Alt+L

<br>

### 2. 其他快捷键













<br>


## 三 常见问题



### 1. Cannot Download Sources

利用idea自动下载源码时，提示Cannot Download Sources、IDEA 出现Cannot Download Sources 的解决办法：

点击terminal，在其中命令台中 输入 ：

```
mvn dependency:resolve -Dclassifier=sources
```

如图：

![](https://image.ventix.top/img01/202101101742956.png)

<br>









国内下载vscode速度慢问题解决

![](https://image.ventix.top/img01/202101101743207.png)

```bash

vscode.cdn.azure.cn       # <--------就是左边这个 (国内的镜像)

```



<br/>



### 2. 控制台中文乱码

控制台中文乱码最常见的应该就是在IDEA中通过Tomcat启动项目了，

很多教程都只是随意处理一下Tomcat或是IDEA中的编码，但两者配合使用时，中间还要经过OS呢！

想要`根治这个乱码问题，不如连系统编码一起统一了`，省得以后还有麻烦

解决办法如下：

```bash

# 处理方法：全部编码统一为 UTF-8

1. 修改Tomcat的编码 (目录位置参考下面)
	`D:\Develop\env\tomcat\apache-tomcat-8.5.72\conf\logging.properties`
	
    java.util.logging.ConsoleHandler.encoding = UTF-8

2. 修改操作系统的编码 （Windows）

3. 修改idea的编码

2018版：C:\Users\msdri\.IntelliJIdea2018.3\config\idea64.exe.vmoptions 

2021版：C:\Users\msdri\AppData\Roaming\JetBrains\IntelliJIdea2021.3\idea64.exe.vmoptions 

```

<br>

Tomcat：

![](https://image.ventix.top/img01/202101101745123.png)

<br/>

修改Windows的编码：

设置 → 时间和语言 —— 语言 —— 管理语言设置 

![](https://image.ventix.top/img01/202101101745240.png)

<br/>

修改IDEA的编码：

除非没有启动过IDEA，否则请在 help ——> Edit Custom VM Options 中打开修改，不然不会生效

进行过（不明骚操作的）可以直接去C盘用户目录下寻找对应文件，参考路径如下：

![](https://image.ventix.top/img01/202101101745023.png)

```bash

-Dfile.encoding=UTF-8
-Dconsole.encoding=UTF-8

```

<br/>

IDEA设置中的编码修改：

![](https://image.ventix.top/img01/202101101746355.png)










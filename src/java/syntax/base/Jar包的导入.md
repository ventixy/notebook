---

order: 10

---

# Jar包的导入

虽然maven导入jar包更简单实用，但也存在需要在普通java项目中导入jar包的需求。

注：演示的IDEA为2021版，其他版本可能略有差异

1. 项目目录下新建 lib 目录，并将需要导入的 jar 包复制到该文件夹
   如：（以导入 mysql驱动包为例）
   ![](https://image.ventix.top/java/2314931117358.png)

2. 将 lib 目录下的所有依赖导入到指定模块

打开 File -> Project Structure （Ctrl + Shift + Alt + S）-> 点击 加号 -> 选择我们创建的 lib 目录 -> 确认即可

![](https://image.ventix.top/java/4916538137524.png)

然后选择需要该依赖的模块，点击 OK 

![](https://image.ventix.top/java/5079139130193.png)

此时我们打开该模块的依赖，可以看到 lib 下的依赖已经导入成功

![](https://image.ventix.top/java/4217641126748.png)

导入成功后该jar包还可以打开查看源码 (*^▽^*) 

![](https://image.ventix.top/java/4686251122502.png)

3. 项目中途导入新的jar包

新版IDEA直接将jar包复制到 lib 文件夹即可

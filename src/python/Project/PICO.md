---

order: 2
title: PICO RP2040

---


🍓Raspberry Pi Pico 简介 参照 Pico中文站：https://pico.org.cn/

<img src="https://pico.org.cn/images/pico-r3-pinout.svg" />

英文文档地址：https://datasheets.raspberrypi.com/pico/getting-started-with-pico.pdf


## 🍓Raspberry Pi Pico

- Thonny (经典开发方式，之前官方主推的方式，性能略差)
- VS code : 性能强，速度快，配置简单，但是资料较少

树莓派 Pico C SDK 入门：https://geekdaxue.co/read/jacky-qa5zo@vgqebl/gmn6zsgy9cmznxbf


### Thonny开发方式

🧰 所需工具

| 工具 | 用途 | 下载地址/说明 |
|------|------|----------------|
| **CMake** | 项目构建系统 | [CMake](https://cmake.org/download/)|
| **GNU Arm Toolchain** | 编译 ARM Cortex-M0+ 代码 | [ARM GCC compiler](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads) |
| **Pico SDK** | RP2040 官方开发包 | [pico-sdk github](https://github.com/raspberrypi/pico-sdk) |
| **Thonny / UF2 拖拽 / OpenOCD** | 烧录工具 | 拖动 `.uf2` 文件最简单 |


环境变量：`PICO_SDK_PATH` 指向本地SDK路径（例如/home/pi/pico/pico-sdk或Windows的D:\RP2040\pico-sdk）

更多经典开发方式的内容参照：https://github.com/mobyw/pico-getting-started



---

### VS code 插件

VSCode的Raspberry Pi Pico插件支持一键创建项目并自动配置工具链（包括CMake和pico-sdk）。

- 安装插件：VS code 插件市场搜索 `Raspberry Pi Pico` ，安装完成后左侧工具栏出现 `Raspberry Pi Pico` 的图标，点击即用
- 创建项目：点击左侧工具栏的 `Raspberry Pi Pico` 图标，选择对应的项目和需求即可

![](https://image.ventix.top/img02/20250410183356538.png)

首次创建项目安装插件时，工具链（如CMake、交叉编译器）和SDK会被下载到本地固定路径（用户目录下的 `.pico-sdk` 或自定义路径）。后续新建项目时，插件会直接引用本地已存在的文件，无需重复下载

::: info 安装驱动（Zadig）
Raspberry Pi Pico 驱动问题解决方案：使用 Zadig 工具安装正确的驱动程序：

1. 下载 Zadig 工具：https://zadig.akeo.ie/

2. 确保您的 Pico 处于 BOOTSEL 模式（按住 BOOTSEL 按钮的同时连接 USB）

3. 运行 Zadig 工具

4. 在 Zadig 中：
   - 从设备列表中选择您的 RP2040 设备（可能显示为 "RP2 Boot" 或类似名称）
   - 如果没有看到设备，请在 Options 菜单中选择 "List All Devices"
   - 在驱动选项中选择 "WinUSB"
   - 点击 "Install Driver" 或 "Replace Driver"

5. 安装完成后，断开并重新连接您的 Pico（保持在 BOOTSEL 模式）
:::

更多相关内容参照：[Get started with Raspberry Pi Pico-series and VS Code](https://www.raspberrypi.com/news/get-started-with-raspberry-pi-pico-series-and-vs-code/)

---


###  CmakeLists.txt 

`CMakeLists.txt` 是 **CMake 构建系统的核心配置文件**，用于定义如何编译、链接和生成 RP2040 Pico 的固件。它指定了：
- 源代码文件
- 依赖库（如 Pico SDK）
- 编译选项
- 目标输出（UF2、ELF、BIN 等）

---

<span style="color:#1E90FF">**1 CMake 基础配置**</span>
```cmake
cmake_minimum_required(VERSION 3.12)
```
功能：指定 CMake 的最低版本要求（Pico SDK 需要 ≥3.12）。

```cmake
include($ENV{PICO_SDK_PATH}/external/pico_sdk_import.cmake)
```
功能：导入 Pico SDK 的 CMake 配置。
关键变量：`PICO_SDK_PATH` 是环境变量，需指向 Pico SDK 的安装路径（如 `~/pico-sdk`）。

---

<span style="color:#1E90FF">**2 项目定义（项目名称和支持的语言）** </span>
```cmake
project(my_pico_project C CXX ASM)
```
功能：定义项目名称和支持的语言（C、C++、汇编）。

```cmake
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)
```
功能：设置 C/C++ 语言标准。

---

<span style="color:#1E90FF">**3 初始化 Pico SDK** </span>
```cmake
pico_sdk_init()
```
功能：初始化 Pico SDK，加载必要的工具链和编译选项。

---

<span style="color:#1E90FF">**4 添加可执行文件**</span>
```cmake
add_executable(my_pico_project
    src/main.c
    src/my_code.c
)
```
- **功能**：定义可执行文件的名称和源代码文件列表。
- **路径说明**：通常源代码放在 `src/` 目录下。

---

<span style="color:#1E90FF">**5 链接 Pico 库**</span>
```cmake
target_link_libraries(my_pico_project
    pico_stdlib
    hardware_gpio
    hardware_uart
)
```
- **功能**：链接 Pico SDK 的库：
  - `pico_stdlib`：标准库（必需）。
  - `hardware_*`：硬件驱动库（如 GPIO、UART、I2C 等）。
- **扩展**：根据需求添加其他库（如 `pico_multicore` 用于多核编程）。

---

<span style="color:#1E90FF">**6 生成 UF2 文件**</span>
```cmake
pico_add_extra_outputs(my_pico_project)
```
- **功能**：生成 `.uf2` 文件（用于拖拽烧录到 Pico）和 `.hex`/`.bin` 文件。

---

<span style="color:#1E90FF">**7 其他常见配置**</span>
```cmake
# 启用 USB 输出（用于调试）
pico_enable_stdio_usb(my_pico_project 1)

# 启用 UART 输出
pico_enable_stdio_uart(my_pico_project 1)

# 自定义编译选项
target_compile_definitions(my_pico_project PRIVATE
    MY_CONFIG=1
)
```

---

**关键 CMake 函数详解**
| 函数/指令                | 作用                                                                 |
|--------------------------|----------------------------------------------------------------------|
| `pico_sdk_init()`        | 初始化 Pico SDK，必须调用。                                         |
| `pico_add_extra_outputs` | 生成 UF2/BIN/HEX 文件。                                             |
| `pico_enable_stdio_*`    | 启用调试输出（USB/UART）。                                          |
| `target_link_libraries`  | 链接硬件库（如 `hardware_i2c`）。                                   |
| `target_include_directories` | 添加头文件搜索路径（如自定义库）。                              |

---

::: info 常见问题

**Q1: 如何修改 UF2 文件名？**
- 在 `project()` 中定义的名称会作为 UF2 文件名。

**Q2: 如何添加汇编文件？**
- 在 `add_executable` 中直接添加 `.S` 或 `.s` 文件：
  ```cmake
  add_executable(my_project src/startup.S)
  ```

**Q3: 如何减少代码大小？**
- 链接时优化：
  ```cmake
  target_link_libraries(my_project pico_stdlib -flto)
  ```
:::









---


## 📁Pico模拟键鼠项目

目标：

> ✅ **使用 C++ 开发 RP2040 的 HID 键鼠模拟器**  （单个开发板模拟一个键盘或一个鼠标）
    需要做到和真实键鼠一样的报文发送, 兼顾防检测，人工鼠标轨迹等
> ✅ **最终由 Python 脚本实时控制模拟键鼠** 
> ✅ **考虑动态控制 HID 报文，甚至修改 PID**  


::: details pico模拟键鼠项目
当前项目是一个使用VSCode的Raspberry Pi Pico插件创建的项目，参照下面的信息完成项目：

注意：tusb_config.h 这个文件是必需的，因为它告诉 TinyUSB 库你的项目需要启用哪些 USB 功能（比如 CDC、HID）、设备的 VID/PID 是多少、有多少个接口等等。

实现目标：
使用pico模拟一个仿真的键鼠设备（可配置VID/PID等信息），就键鼠方面使用一个接口模拟键盘，一个接口模拟相对鼠标，鼠标要在设备中实现贝塞尔曲线模拟人工轨迹。一个接口模拟相对鼠标，实现瞬间精准定位到指定坐标位置。并可以在同一台电脑上使用CDC进行控制键鼠，键盘等要具备全键信息。总之要尽可能模拟真实设备行为。

键鼠实现思路：
我有一些简单的实现思路供你参考，可以看tinyusb是否维护了按键状态，如果没有，可以自己在固件维护一个按键状态信息和是否有变化的信息，以此来模拟真实键盘的实现，同时维护一个待发送缓冲区，启用一个线程/任务来按照真实键盘的频率扫描按键是否有变化来更新待发送缓冲区和是否有变化的信息。鼠标的实现同样参照真实鼠标的实现。

- 相对鼠标
- 绝对鼠标

示例代码要求：
给出python进行控制的使用示例代码，在demo目录下实现: pico.py中实现控制主要的代码，test.py中实现使用示例代码

:::





---

📦 开源项目推荐（可借鉴）

- [tinyusb/hid_composite](https://github.com/hathach/tinyusb/tree/master/examples/device/hid_composite)
- [rp2040-hid-joystick](https://github.com/MHeironimus/ArduinoJoystickLibrary)

---


🔥 实战部署流程（简化步骤）

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1️⃣ | 克隆 Pico SDK 和 TinyUSB | 并设置为 `git submodule` |
| 2️⃣ | 写好 `main.cpp` 和控制协议 | 参考我提供的框架 |
| 3️⃣ | 构建工程（用 CMake） | 生成 `.uf2` 固件 |
| 4️⃣ | 将 RP2040 插入 BOOT 模式 | 按住 BOOTSEL 插电 |
| 5️⃣ | 拖动 `.uf2` 文件进 RP2040 | 烧录完成，模拟键鼠就工作了 |
| 6️⃣ | 用 Python 控制串口 | 实时模拟操作行为！

---


## 🧪C++ 固件实现逻辑

HID + CDC 初始化：
- 使用 TinyUSB 同时注册两个接口：
  - HID（报告设备为鼠标/键盘）
  - CDC（用于串口通信）

主循环：
- 每次通过 CDC 接口接收一行字符串
- 解析为动作命令，如：
  ```
  KEY A DOWN
  MOUSE MOVE 20 -10
  CLICK LEFT
  ```

动作执行：
- 转换为 HID 报文发送（通过 `tud_hid_mouse_report()` 或 `tud_hid_keyboard_report()`）

---

## 🧰Python 控制端

```python
import serial
import time

# 打开 RP2040 CDC 串口
ser = serial.Serial('COM5', 115200)

# 模拟按 A 键
ser.write(b'KEY A DOWN\n')
time.sleep(0.1)
ser.write(b'KEY A UP\n')

# 模拟鼠标移动
ser.write(b'MOUSE MOVE 30 10\n')

# 模拟点击
ser.write(b'CLICK LEFT\n')
```


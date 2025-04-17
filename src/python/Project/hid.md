---

order: 1
title: HID设备及USB

---


HID（Human Interface Device）是计算机与人类交互的接口设备的标准，如键盘、鼠标、游戏控制器等。HID标准由USB规范定义，旨在为这些设备提供一种统一且易于实现的方式进行通信。HID协议不仅限于USB设备，也可以通过蓝牙等其他传输方式工作。


---

## HID—键鼠工作原理 

### 键盘工作原理

以 Windows 系统下 USB HID 设备为例：

---

#### **1️⃣ 键盘基础工作原理**

✅ 键盘做的事：
- 通过扫描键盘矩阵，检测哪个按键被按下；
- 转换为 HID 报文格式；
- 等待主机通过 USB IN 请求轮询，再将 HID 报文响应给主机。

✅ HID 报文内容（8字节）：

```bash
[Modifier][Reserved][Key1][Key2][Key3][Key4][Key5][Key6]
```

- 同一时间最多报告 6 个按键（不包括修饰键）；
- 修饰键（Ctrl、Alt、Shift等）在第一个字节中以位表示；
- 报文表示"**当前所有被按下的键**"。

---

#### **2️⃣ 报文何时发送？**

✅ 键盘本身不会"主动发送"报文，而是主机持续发送 IN 请求，键盘**在被轮询到时**返回状态数据：

| 状态变化        | 是否响应有效报文 | 报文内容                    |
|-----------------|------------------|-----------------------------|
| 按下一个新按键  | ✅                | 新 keycode 出现在报文中     |
| 松开某个按键    | ✅                | 该 keycode 不再出现在报文中 |
| 长按不放        | ✅                | ✳ 只在状态改变时发送报文 |
| 无键按下        | ✅                | 报文为全零（或返回 NAK）     |

键盘内部工作原理模拟：
  - 维护一个内部缓冲区，用于存储当前键盘状态，当有状态变化时新的键盘状态被写入这个缓冲区（缓冲区包含修饰键状态和最多6个普通按键的键值）
  - 主机以固定间隔（通常是8ms或更短）发送IN令牌包请求报告，键盘中断处理程序接收到这个请求后，检查是否有新的报告需要发送
    - 如果有新报告，则从缓冲区读取并发送
    - 如果没有变化，可能会发送NAK
```cpp
bool tud_hid_keyboard_report(uint8_t report_id, uint8_t modifier, uint8_t keycode[6])
{
  // 将键盘状态保存到内部缓冲区
  _kbd_report.modifier = modifier;
  memcpy(_kbd_report.keycode, keycode, 6);
  
  // 标记有新报告需要发送
  _kbd_new_report = true;
  
  // 尝试检查USB端点状态，如果端点空闲，将数据写入端点缓冲区，并标记为"就绪"。
  // 如果USB总线忙，则等待下一次轮询
  return tud_hid_report(report_id, &_kbd_report, sizeof(_kbd_report));
}
```

当收到主机的IN请求时才会真正发送数据报：
```cpp
// 简化的伪代码，展示键盘发送数据的处理逻辑
void handle_usb_interrupt(void) {
  if (is_in_token_received() && _kbd_new_report) {
    // 发送缓冲区中的报告
    usb_send_data(_kbd_report, sizeof(_kbd_report));
    _kbd_new_report = false;
  }
}
```
鼠标和键盘的工作原理基本相同，都遵循USB HID协议的规则，不能真正"主动"发送数据。只是保存状态，主机的请求到来后才真正发送

---

#### **3️⃣ USB 通信细节**

✅ 轮询机制说明：

- USB HID 是 **中断传输类型**，但不是真正的"中断"，而是**主机轮询设备**；
- 主机会以 HID 描述符中设置的轮询间隔（如 8ms、2ms、1ms）向键盘发起 **IN 请求**；
- 键盘仅在主机发起 IN 请求时响应报文；
- 无键变化时，通常会返回全零报文（如果所有键都已释放），或返回 **NAK**（表示没有新数据）；
- 键盘不能主动发送数据，只能响应主机请求。

---

#### **4️⃣ 操作系统如何处理输入？**

Windows系统下的常见输入流程：

```
键盘 → USB 报文 → HID 驱动 → 内核事件 → 应用程序消息
```

| 类型          | 获取方式                         | 特点                           | 应用场景       |
|---------------|----------------------------------|--------------------------------|----------------|
| 标准输入消息  | `WM_KEYDOWN / WM_KEYUP / WM_CHAR` | 来自 Windows 消息队列，由系统管理 | 普通桌面程序   |
| 底层输入状态  | `GetAsyncKeyState()` / `RawInput` | 直接读取按键状态或原始数据，跳过消息队列 | 游戏 / 高性能应用 |

- `GetAsyncKeyState(key)`：返回当前键是否按下、是否曾按下过；游戏引擎通常每帧轮询判断输入；
- `RawInput`：低级别 API，可读取 HID 层原始报文，支持多设备、原始码、来源识别等。

---

::: info 重复键（Repeat Rate）机制

✅ 重复按键是由 **操作系统模拟** 的，不是键盘自己重复发数据。

流程如下：

1. 首次按下按键 → `WM_KEYDOWN`
2. 延迟一段时间（约 250-500ms，取决于系统设置）
3. 然后系统开始模拟重复触发 `WM_KEYDOWN`（约 33～50ms 一次，取决于系统设置）
4. 松开键 → `WM_KEYUP` 停止重复

📌 可在 "控制面板 > 键盘 > 重复延迟 / 重复速度" 设置参数
:::

在游戏等场景中模拟高频重复键的方式：

1. 使用定时器或主循环控制"按下-松开"周期；
2. 模拟生成交替的按下/松开报文；
3. 避免系统自身的重复机制影响。

---

#### **5️⃣ 游戏/应用程序如何监听按键？**

- 游戏逻辑以"每帧"为单位（如 60FPS = 每帧约 16.67ms）；
- 每帧轮询当前按键状态，判断是否：

  - 首次按下 → 触发事件；
  - 持续按住 → 维持某状态；
  - 松开 → 触发释放逻辑；

---

::: important 🧠 最关键的几个要点

- ✅ **键盘不会主动发送数据，必须等主机发送 IN 请求才能响应**；
- ✅ **无论是否有键按下，只要主机轮询，设备都要响应（返回数据或 NAK）**；
- ✅ **重复键是操作系统模拟，不是键盘生成的**；
- ✅ **键盘状态的采集和输入派发，是主机和 OS 共同完成的**；
- ✅ **游戏程序通常每帧主动轮询按键状态，不依赖消息事件**；
- ✅ **键盘会持续报告当前按下的所有按键状态，而不仅是变化的按键**；
:::

---

### 鼠标的运作机制

🖱️ 鼠标也属于 HID 设备，通信逻辑和键盘类似，但使用习惯不同。

---

#### 🧩 报文结构（常见为3～5字节）：

```c
Byte 0: 按键位图（bit0=左键，bit1=右键，bit2=中键）
Byte 1: X轴相对位移（int8）
Byte 2: Y轴相对位移（int8）
Byte 3: 滚轮（int8，可选）
Byte 4: 水平滚轮（int8，可选）
```

---

#### 鼠标与键盘行为对比：

| 功能             | 键盘                   | 鼠标                       |
|------------------|------------------------|----------------------------|
| 报文发送时机     | 主机轮询时响应当前状态  | 主机轮询时响应当前状态     |
| 空闲时是否发送   | 通常为全零或 NAK       | 通常为全零或 NAK          |
| 数据内容         | 当前按下的键列表        | 按键状态 + 坐标增量        |
| 是否支持重复信号 | 系统模拟                | 持续移动产生连续增量值     |
| 通常读取方式     | 消息 + 查询            | 消息 + 查询 + 原始报文    |

---

#### ⛓️ 轮询周期说明

- 鼠标轮询间隔由设备端配置（HID 描述符中的 `bInterval`）；
- 常见为 8ms（125Hz），游戏鼠标常为 1ms（1000Hz）；
- 主机固定时间发出 IN 请求，设备持续回应当前状态；
- 没有变化时，也会回应全 0 或返回 NAK。

---

#### 📥 驱动处理流程

1. 鼠标响应主机 IN 请求 → 发送 HID 报文；
2. 报文被 HID 驱动解析（hidclass.sys）；
3. 数据进入 input stack，由 `mouhid.sys` / `mouclass.sys` 分发；
4. Windows 消息系统生成 `WM_MOUSEMOVE`, `WM_LBUTTONDOWN` 等事件；
5. 或者通过 RawInput 获取原始数据（带来源和原始码等信息）。

---

#### 🧪 想模拟真实鼠标，务必注意：

1. **报文持续性**：主机轮询时设备必须一直有响应（哪怕是无变化）；
2. **状态保持**：如左键持续按下，每个报文都要携带左键按下状态；
3. **移动值为相对坐标**：如 int8_t，值越大表示移动越快；
4. **频率匹配真实设备**：如模拟 1ms 间隔响应，更贴近真实鼠标；
5. **保持节奏一致**：突变、卡顿可能导致主机识别异常设备；
6. **人工轨迹模拟**：真实人类移动鼠标时有加速和减速过程，模拟时应考虑这些特性。

---

### HID 设备工作流程

1. **初始化阶段**  
   主机插入设备 → 发送 GET_DESCRIPTOR 请求 → 设备返回 HID 描述符（含 Report Descriptor）

2. **数据传输阶段**  
   主机定期发送 IN 请求 → 设备根据当前状态返回 Input Report：
   - 键盘：修饰键 + 按键列表（最多6键）；
   - 鼠标：按键 + 移动量 + 滚轮等；

下图是 Windows下USB HID设备（键鼠）报文流动路径：

![](https://image.ventix.top/img02/20230407221113827.png)

Windows 下 USB HID 数据流动路径

```
USB 设备
 → USB 协议栈（usbhub.sys, usbport.sys）
 → HID 驱动（hidclass.sys）
 → HID 子驱动（kbdhid.sys / mouhid.sys）
 → 键盘/鼠标类驱动（kbd.sys / mouclass.sys）
 → 内核用户桥接（Win32k.sys）
 → 用户程序消息队列
```

---

#### 相关 API 概览

1. **`GetAsyncKeyState()`**  
   - 查询内核中"键盘状态表"，不依赖消息队列；
   - 可在窗口未激活时探测按键状态；
   - 来源路径：
     ```
     USB设备 → HID驱动 → kbd.sys（更新状态表） → GetAsyncKeyState()
     ```

2. **`RawInput`**  
   - 读取未经 OS 转换的原始 HID 报文；
   - 可判断输入来源、区分多个设备、访问扫描码；
   - 来源路径：
     ```
     USB设备 → HID驱动 → hidclass.sys → RawInput
     ```

3. **`WM_KEYDOWN` 等消息**  
   - 传统 Windows 消息系统中的输入消息；
   - 路径：
     ```
     USB设备 → HID驱动 → kbd.sys/mouclass.sys → Win32k.sys → 应用程序消息队列
     ```

---










### 设备VID/PID

Vendor ID (VID) 和 Product ID (PID) 是用于唯一标识USB设备的两个重要参数。它们在设备连接到计算机时被操作系统用来识别和区分不同的硬件设备。

- VID代表厂商识别码（Vendor Identification），是由USB实施者论坛（USB Implementers Forum, USB-IF）分配给每个USB设备制造商的一个16位数字代码
- PID代表产品识别码（Product Identification），同样是一个16位数字代码，但这个编号是由设备制造商自行分配的，用于识别其生产的特定型号或版本的产品


Windows系统下 获取键盘/鼠标的 Vendor ID (VID) 和 Product ID (PID)

1. **通过设备管理器**：
   - 打开`设备管理器` → 展开`键盘`或`鼠标和其他指针设备`。
   - 右键目标设备 → `属性` → `详细信息` → 选择`硬件ID`。
   - 找到类似`HID\VID_1234&PID_5678`的字符串，其中`1234`是VID，`5678`是PID。

2. **使用Python代码扫描**（推荐）：
   ```python
   import hid

   # 列出所有HID设备
   for device in hid.enumerate():
       print(f"设备名: {device['product_string']}")
       print(f"  VID: {device['vendor_id']:04X}")
       print(f"  PID: {device['product_id']:04X}")
       print("-" * 50)
   ```






---

### HID相关工具

🎯 HID 报文监控工具（USB 层）

| 工具名 | 官网/下载地址 | 简要说明 |
|--------|----------------|----------|
| **USBlyzer** | [https://www.usblyzer.com/](https://www.usblyzer.com/) | 商业软件，支持 HID 报文分析，试用可用 |
| **USBPcap** | [https://desowin.org/usbpcap/](https://desowin.org/usbpcap/) | 免费开源 USB 抓包驱动，可结合 Wireshark 使用 |
| **Wireshark** | [https://www.wireshark.org/](https://www.wireshark.org/) | 配合 USBPcap 使用查看 USB 报文 |
| **USBTrace** | [http://www.sysnucleus.com/index.html](http://www.sysnucleus.com/index.html) | 专业 USB 报文监控工具，支持 HID，商业授权 |
| **Device Monitoring Studio** | [https://www.hhdsoftware.com/device-monitoring-studio](https://www.hhdsoftware.com/device-monitoring-studio) | 支持 USB、串口、网络等多协议，强大 |

---

🔧 CH9329 / HID 相关调试工具（来自 WCH 官方）

| 工具名 | 下载地址 | 说明 |
|--------|----------|------|
| **CH9329工具集（含 HIDTest/HIDView）** | [http://www.wch.cn/downloads/CH9329.html](http://www.wch.cn/downloads/CH9329.html) （点击“工具软件”或“相关下载”） | 官方串口转 HID 调试工具，能查看/发送 HID 报文 |
| **CH9329资料合集** | [http://www.wch.cn/products/CH9329.html](http://www.wch.cn/products/CH9329.html) | 数据手册、控制码对照、指令集说明 |

---

🧰 键鼠事件监控工具（非 HID 报文级）

| 工具名 | 下载地址 | 说明 |
|--------|----------|------|
| **Interception Driver** | [https://github.com/oblitum/Interception](https://github.com/oblitum/Interception) | 驱动级键鼠拦截工具，可用于低层监控或重映射 |
| **Interception Tools（Python绑定）** | [https://github.com/oblitum/Interception](https://github.com/oblitum/Interception) | 同上，配合 Python 可记录和发送输入事件 |
| **PyHook (旧)** | [https://github.com/ethanhs/pyhook](https://github.com/ethanhs/pyhook) | Python2/3 的键盘钩子模块，可用于事件记录 |
| **PyWin32** | [https://pypi.org/project/pywin32/](https://pypi.org/project/pywin32/) | 支持键盘钩子，但非 HID 报文层级 |

---

🧱 HID 开发辅助（库）

| 工具/库 | 地址 | 说明 |
|---------|------|------|
| **HidSharp (.NET/C#)** | [https://github.com/mikeobrien/HidSharp](https://github.com/mikeobrien/HidSharp) | .NET 下的 USB HID 库，可监听/发送 HID 报文 |



---








## Universal Serial Bus

USB全称为Universal Serial Bus（通用串行总线），是一种快速、灵活的总线接口

更多关于USB的介绍参照，USB官网：https://usb.org/， USB中文网：https://www.usbzh.com/

---

USB（Universal Serial Bus）设备按照功能可分为两大类：**集线器（Hub）** 和 **功能设备（Function Device）**。它们在 USB 架构中扮演不同的角色，共同构建 USB 的树形拓扑结构。


| 特性 | 集线器（Hub） | 功能设备（Function Device） |
|------|--------------|--------------------------|
| **作用** | 扩展 USB 接口 | 提供具体功能 |
| **Class Code** | `0x09`（Hub Class） | 取决于功能（如 `0x03` 为 HID） |
| **数据传输** | 仅转发数据 | 直接处理数据 |
| **层级关系** | 可级联（最多 5 级） | 仅作为终端设备 |
| **典型设备** | USB 分线器 | 键盘、U 盘、摄像头 |

---

### USB集线器（Hub）

**作用**：扩展 USB 接口数量，允许连接多个设备（如 USB 分线器）

- **层级关系**：
  - 主机（Host）连接 **根集线器（Root Hub）**。
  - 根集线器可级联多个 **外部集线器（External Hub）**，最多支持 **5 级层级**（主机 + 4 级 Hub）。
- **供电方式**：
  - **自供电（Self-powered）**：依赖外部电源，可提供更大电流（如台式机 USB Hub）。
  - **总线供电（Bus-powered）**：依赖 USB 总线供电（如笔记本 USB 分线器）。


::: info 集线器的工作流程
1. **检测连接**：通过监测 D+/D- 信号变化判断设备插入。
2. **复位设备**：向新设备发送复位信号（Reset）。
3. **枚举设备**：主机通过 Hub 对下游设备进行枚举。
4. **数据中继**：在主机和设备间转发数据包（全速/低速设备需速度匹配）。
:::

**集线器的描述符**
- **Hub Descriptor**：描述集线器特性（如端口数量、供电模式）。
- **Class Code**：集线器的设备类代码为 `0x09`（USB Hub Class）。

---

### USB功能设备

USB功能设备（Function Device）提供具体功能（如存储、输入、音频等），直接与主机通信。

**常见典型设备**：
  - **HID 设备**：键盘、鼠标（`Class Code = 0x03`）。
  - **Mass Storage**：U 盘、移动硬盘（`Class Code = 0x08`）。
  - **CDC（通信设备）**：串口转换器（`Class Code = 0x02`）。
  - **Audio/Video**：麦克风、摄像头（`Class Code = 0x01/0x0E`）。

**功能设备的分类**

| 类型 | 特点 | 示例 |
|------|------|------|
| **单一功能设备** | 仅实现一种功能 | USB 鼠标 |
| **复合设备（Composite）** | 包含多个接口（Interface），每个接口独立功能 | 带键盘的 USB 音箱 |
| **组合设备（Compound）** | 内部包含 Hub + 功能设备（如 USB 网卡 + Hub） | 某些多功能扩展坞 |


**功能设备的描述符**
- **Device Descriptor**：设备的基本信息（厂商 ID、产品 ID）。
- **Configuration Descriptor**：设备的配置（接口、端点）。
- **Interface Descriptor**：功能定义（如 HID、Mass Storage）。
- **Endpoint Descriptor**：数据传输方式（IN/OUT 端点）。



---

### 复合设备与组合设备

复合设备（Composite Device）与组合设备（Compound Device）

**复合设备**：一个物理设备包含 **多个逻辑功能**（通过多个 Interface 实现）。
- **示例**：
  - USB 耳机（音频 + 麦克风）。
  - 带指纹识别的键盘（HID + Biometric）。
- **驱动加载**：主机为每个 Interface 加载独立驱动。

![](https://image.ventix.top/img02/20250415140601710.png)

---

**组合设备**：内部集成 **Hub + 功能设备**，表现为一个设备。
- **示例**：
  - 某些 USB 网卡（Hub + 以太网功能）。
  - 多功能扩展坞（Hub + HDMI + 存储）。
- **硬件实现**：芯片内部集成 Hub 控制器和功能模块。



---



### 配置/接口/端点

USB 设备采用分层结构描述其功能，从高到低依次为：**设备（Device）→ 配置（Configuration）→ 接口（Interface）→ 端点（Endpoint）**。这种层级关系通过 **描述符（Descriptors）** 在枚举过程中传递给主机，以确定设备的通信方式和工作模式。

| 层级 | 作用 | 关键描述符 | 示例 |
|------|------|------------|------|
| **设备** | 物理实体 | Device Descriptor | 厂商 ID、产品 ID |
| **配置** | 工作模式 | Configuration Descriptor | 功耗、接口数量 |
| **接口** | 功能模块 | Interface Descriptor | HID、Mass Storage |
| **端点** | 数据通道 | Endpoint Descriptor | 中断 IN、批量 OUT |

---

**1. 设备（Device）** 是 USB 连接的物理实体（如 U 盘、键盘），每个设备有唯一的 **设备地址（Address）**。设备通过 **设备描述符（Device Descriptor）** 向主机报告基本信息。

**设备描述符（Device Descriptor）**

| 字段 | 说明 |
|------|------|
| `bLength` | 描述符长度（固定 18 字节） |
| `bDescriptorType` | 描述符类型（`0x01` 表示设备） |
| `idVendor` / `idProduct` | 厂商 ID 和产品 ID（用于驱动匹配） |
| `bNumConfigurations` | 支持的配置数量（通常为 1） |

- 主机通过 `GET_DESCRIPTOR` 请求获取设备描述符，确定设备的 **基本能力** 和 **最大数据包大小（`bMaxPacketSize0`）**。
- 设备在枚举阶段默认使用地址 `0`，主机通过 `SET_ADDRESS` 为其分配新地址。

---

**2. 配置（Configuration）** 是设备的一种工作模式（如高功耗模式/低功耗模式），同一时间只能激活一个配置。配置通过 **配置描述符（Configuration Descriptor）** 描述其特性。

**配置描述符**

| 字段 | 说明 |
|------|------|
| `bLength` | 描述符长度（固定 9 字节） |
| `wTotalLength` | 整个配置的总长度（包括接口、端点描述符） |
| `bNumInterfaces` | 包含的接口数量 |
| `bConfigurationValue` | 配置编号（主机用 `SET_CONFIGURATION` 激活） |

- 主机通过 `GET_DESCRIPTOR` 请求获取配置描述符，了解设备的 **接口数量** 和 **功耗需求**。
- 一个设备可以有多个配置（如摄像头的高分辨率模式和省电模式），但主机只能激活其中一个。

**为什么需要多配置？**: 适应不同功耗或功能需求（如设备在电池模式下关闭某些功能）
  
---

**3. 接口（Interface）** 代表设备的一种独立功能（如键盘的按键输入、LED 背光控制）。复合设备（Composite Device）通过多个接口实现多功能（如 USB 耳机包含音频播放和麦克风输入）。

**接口描述符（Interface Descriptor）**

| 字段 | 说明 |
|------|------|
| `bInterfaceNumber` | 接口编号（从 0 开始） |
| `bAlternateSetting` | 备用接口设置（用于动态切换功能） |
| `bNumEndpoints` | 接口包含的端点数量（不包括端点 0） |
| `bInterfaceClass` | 接口类（如 `0x03` 表示 HID 设备） |

- 主机根据 `bInterfaceClass` 加载对应的驱动程序（如 `0x08` 对应 Mass Storage 驱动）。
- 一个接口可以包含 **多个备用设置（Alternate Setting）**，用于动态调整功能（如摄像头切换分辨率）。

**复合设备的接口分配**：复合设备的每个接口独立编号（如 Interface 0 为键盘，Interface 1 为触摸板）

---

**4. 端点（Endpoint）** 是设备与主机通信的逻辑通道，每个端点有唯一的 **端点地址（Endpoint Address）**。端点 **0（Endpoint 0）** 是默认控制端点，用于枚举和配置。

**端点描述符（Endpoint Descriptor）**

| 字段 | 说明 |
|------|------|
| `bEndpointAddress` | 端点地址（Bit 7 表示方向：`0=OUT`, `1=IN`） |
| `bmAttributes` | 传输类型（`0x01=等时`, `0x02=批量`, `0x03=中断`） |
| `wMaxPacketSize` | 单次传输的最大数据包大小 |

主机通过端点地址（如 `0x81` 表示 IN 端点 1）与设备交换数据。 每个端点独立工作，例如：
- 键盘使用 **中断 IN 端点** 报告按键。
- U 盘使用 **批量 IN/OUT 端点** 传输文件。

**端点 0 的特殊性**：所有 USB 设备必须支持 **端点 0**，用于控制传输（枚举和配置）
  









---

### USB设备枚举过程

USB 设备插入主机后，主机通过 **枚举（Enumeration）** 过程识别设备并加载合适的驱动程序。枚举过程是 USB 通信的基础，涉及多个标准请求和描述符交换。

::: info USB 枚举的基本流程

**1.1 设备连接（Attachment）**
- 设备插入主机（或上电），主机检测到 **VBUS（5V电源）** 和 **D+/D- 信号线** 电平变化（全速/高速设备拉高 D+，低速设备拉高 D-）。
- 主机检测到设备后，发送 **复位（Reset）信号**（持续至少 10ms 的 SE0 状态）。

**1.2 获取设备描述符（Get Device Descriptor）**
- 主机发送 **标准请求 `GET_DESCRIPTOR`**（类型 `Device`），设备返回 **设备描述符（Device Descriptor）**，包含：
  - `bLength`（描述符长度）
  - `bDescriptorType`（描述符类型，如 `0x01` 表示设备描述符）
  - `idVendor`（厂商 ID）
  - `idProduct`（产品 ID）
  - `bNumConfigurations`（配置数量）等。

> **注意**：主机可能只读取前 8 字节（`bLength` 到 `bNumConfigurations`），以确定后续通信的最大数据包大小（`bMaxPacketSize0`）。

**1.3 分配地址（Set Address）**
- 主机发送 **`SET_ADDRESS` 请求**，为设备分配一个 **唯一的设备地址（1~127）**。
- 设备收到地址后，后续通信使用该地址（默认地址 `0` 仅用于枚举阶段）。

**1.4 获取完整设备描述符（Get Full Device Descriptor）**
- 主机再次发送 `GET_DESCRIPTOR`，读取完整的 **设备描述符**（18 字节）。

**1.5 获取配置描述符（Get Configuration Descriptor）**
- 主机发送 `GET_DESCRIPTOR`（类型 `Configuration`），设备返回 **配置描述符（Configuration Descriptor）**，包含：
  - `bLength`、`bDescriptorType`
  - `wTotalLength`（整个配置的总长度，包括接口、端点描述符）
  - `bNumInterfaces`（接口数量）
  - `bConfigurationValue`（配置编号）等。

**1.6 获取接口和端点描述符（Get Interface/Endpoint Descriptors）**
- 主机继续读取 **接口描述符（Interface Descriptor）** 和 **端点描述符（Endpoint Descriptor）**，了解设备的通信方式：
  - **接口描述符**：定义设备的功能（如 HID、Mass Storage 等）。
  - **端点描述符**：定义数据传输方式（控制/中断/批量/同步）和最大包大小。

**1.7 选择配置（Set Configuration）**
- 主机发送 **`SET_CONFIGURATION` 请求**，激活设备的某个配置（通常 `bConfigurationValue = 1`）。
- 设备进入 **已配置（Configured）状态**，可以正常通信。

**1.8 加载驱动程序**
- 主机根据 `idVendor` 和 `idProduct` 匹配并加载合适的 **USB 驱动程序**（如 HID、UVC、CDC 等）。
- 如果是 **复合设备（Composite Device）**，可能需要加载多个驱动。
:::

---

**USB 设备状态**

| 状态 | 说明 |
|------|------|
| **Attached** | 设备已连接，但未供电 |
| **Powered** | 设备已供电（VBUS） |
| **Default** | 设备复位，使用默认地址 `0` |
| **Address** | 已分配唯一地址 |
| **Configured** | 已选择配置，可正常通信 |
| **Suspended** | 设备进入低功耗模式 |

**USB 描述符（Descriptors）**

| 描述符类型 | 说明 |
|------------|------|
| **Device Descriptor** | 设备的基本信息（厂商 ID、产品 ID、版本等） |
| **Configuration Descriptor** | 设备的配置信息（接口、端点等） |
| **Interface Descriptor** | 设备的功能（如 HID、Mass Storage） |
| **Endpoint Descriptor** | 数据传输方式（控制/中断/批量/同步） |
| **String Descriptor** | 可选的文本信息（如厂商名称、产品名称） |











## USBPcap抓包实践

要使用Wireshark+USBPcap抓包，安装Wireshark时要手动勾选USBPcap才能使用，安装重启后打开Wireshark会出现USBPcap选项：

![](https://image.ventix.top/img02/20250411140029217.png)

可能会出现多个USBPcap接口（如USBPcap1~USBPcap4），这是因为当电脑中存在多个USB根集线器（Root Hub）时，每个根集线器会对应一个独立的USBPcap接口。

通常捕获 USBPcap1 或 USBPcap2 即可，可自行逐一尝试

---

Wireshark抓取USB数据包示例及各个字段的含义：

![](https://image.ventix.top/img02/20250411142853187.png)

| 字段名        | 含义                                                         |
|---------------|--------------------------------------------------------------|
| **No**        | 数据包的序列号，按照捕获顺序递增。                           |
| **Time**      | 数据包被捕获的时间戳，相对于捕获开始的时间。                 |
| **Source**    | 数据包的源地址，对于USB流量来说，这通常是发起通信的一方（例如主机或特定的USB设备）。 |
| **Destination** | 数据包的目的地址，即接收方（例如主机或其他USB设备）。       |
| **Protocol**  | 使用的协议类型，在USB流量中通常显示为“USB”或更具体的子协议名称。 |
| **Length**    | 数据包的长度，以字节为单位，表示该数据包包含的数据量大小。   |
| **Info**      | 提供有关数据包的额外信息，如请求类型、传输方向（IN/OUT）、控制传输的具体命令等，有助于理解数据包的内容及其作用。 |


设备地址解析：USB设备地址中的每一位数字代表的是设备在USB树形结构中的位置：

- 第一位数字：表示该设备连接到哪个根集线器（Root Hub）。例如，1意味着它直接连接到了第一个根集线器。
- 第二位数字：表示该设备连接到了前一级设备的哪个端口。比如，3意味着设备连接到了上一级设备的第三个端口。
- 第三位数字：对于复合设备（Composite Device），这个数字代表的是接口号。对于非复合设备，这个值通常是0。

因此，一个完整的设备地址如`1.3.0`可以解读为：设备位于第一个根集线器下，通过第三个端口连接，并且不是复合设备的一部分（因为接口号为0）。

注意：这里的地址并不直接对应于物理上的USB接口

::: important 抓包常见过滤条件
1. 分局VID和PID过滤，找到对应ID设备的地址
usb.idVendor == 0x1bcf

2. 按设备地址过滤：
usb.device_address == <device_address>：替换 <device_address> 为要监控的实际设备地址

3. 按传输类型过滤：
usb.transfer_type == 0x02：仅显示批量传输（Bulk Transfer）的数据包。
usb.transfer_type == 0x03：仅显示中断传输（Interrupt Transfer）的数据包。
usb.transfer_type == 0x01：仅显示控制传输（Control Transfer）的数据包。
usb.transfer_type == 0x04：仅显示等时传输（Isochronous Transfer）的数据包。

4. 按传输方向过滤
usb.endpoint_address.direction=="in": 过滤所有从设备到主机的数据包
usb.endpoint_address.direction=="out": 过滤所有从主机到设备的数据包
:::

---



### USB Request Block

URB（USB Request Block） 是 USB 协议栈中的核心数据结构，用于描述 主机（Host）与设备（Device）之间的通信请求

通过 Wireshark 中解析 USB 数据包的核心内容如下:


| 字段名称                  | 含义                                                                 |
|---------------------------|----------------------------------------------------------------------|
| **Source/Destination**    | 数据包的发起方和目标方（主机或设备）。                                 |
| **USBPcap pseudoheader**  | USBPcap 工具添加的伪头部，包含捕获元信息。                             |
| **IRP ID**                | I/O 请求包的唯一标识符，用于关联请求和响应。                           |
| **USBD_STATUS**           | USB 驱动程序的状态码，表示请求的结果（成功、失败、取消等）。           |
| **IRP Information**       | 标志位字段，描述请求的方向（FDO -> PDO 或 PDO -> FDO）。               |
| **URB Function**          | URB 的功能类型（如批量传输、中断传输等）。                             |
| **Bus ID**                | USB 总线的编号。                                                     |
| **Device Address**        | 目标设备的地址（范围通常是 1 到 127）。                                |
| **Endpoint**              | 端点信息，包括传输方向（IN/OUT）和端点编号。                          |
| **URB Transfer Type**     | 传输类型（批量、中断、控制、等时）。                                   |
| **Packet Data Length**    | 数据包中实际携带的数据负载长度。                                       |
| **[Request in]**          | 响应对应的请求帧编号。                                                |
| **[Response in]**         | 请求对应的响应帧编号。                                                |
| **[Time from request]**   | 从请求发出到收到响应的时间间隔。                                      |
| **bInterfaceClass**       | 设备的接口类，描述设备的功能类型（如无线控制器、存储设备等）。         |

---


<span style="color:#1E90FF">**IRP Information** </span> 是一个标志位字段，用于描述请求的方向和其他信息。
  - `0000 000.`：保留位，未使用。
  - `.... ...0`：方向为 `FDO -> PDO`（从功能驱动程序对象到物理驱动程序对象）
    `.... ...1`：方向为 `PDO -> FDO`（从物理驱动程序对象到功能驱动程序对象）

PDO:物理驱动程序对象(Physical Driver Object)，FDO:功能驱动程序对象(Function Driver Object)

---


<span style="color:#1E90FF">**URB Transfer Type**</span> 表示传输的类型。示例：

| 传输类型       | 用途                                | 典型设备               | Wireshark 显示      |
|--------------------|-----------------------------------------|----------------------------|-------------------------|
| **中断传输**       | 小数据、低延迟、定期轮询                | 鼠标、键盘                 | `URB_INTERRUPT` (0x01)         |
| **控制传输**       | 设备枚举、配置、命令控制                | 所有设备（端点0）          | `URB_CONTROL` (0x02)          |
| **批量传输**       | 大数据量、无实时性要求                  | U盘、打印机                | `URB_BULK` (0x03)             |
| **等时传输**       | 实时流数据（无重传机制）                | 摄像头、音频设备           | `URB_ISOCHRONOUS` (0x04)      |


---

<span style="color:#1E90FF">**bInterfaceClass**</span> 表示设备的接口类，用于描述设备的功能类型。
  - `Wireless Controller (0xe0)`：无线控制器类（如蓝牙适配器）。
  - `Mass Storage (0x08)`：存储设备类（如 U 盘）。
  - `HID (0x03)`：人机接口设备类（如键盘、鼠标）。

---

<span style="color:#1E90FF">**Endpoint 的传输方向**</span>

在 USB 协议中，Endpoint（端点） 的传输方向是 从设备视角 定义的，与主机和设备的请求-响应模式无关。具体规则如下：

| **方向标识** | **端点号示例** | **数据流向（设备视角）** | **主机行为**                     |
|--------------|----------------|--------------------------|----------------------------------|
| **IN**       | `0x81`         | 设备 → 主机              | 主机发送 `IN Token`，设备返回数据 |
| **OUT**      | `0x01`         | 主机 → 设备              | 主机发送 `OUT Token` + 数据      |

- **误区**：认为 `IN` 是主机请求，`OUT` 是设备响应。  
- **纠正**：方向是固定的，由端点描述符定义，与请求-响应逻辑无关。

---

### URB Function 

URB 的 Function 字段标识其具体操作类型，以下是常见分类（基于 Windows 和 Linux 内核定义）

#### **1. 数据传输类**

- `URB_FUNCTION_CONTROL_TRANSFER`， `0x0002` : 控制传输请求，用于设备枚举、配置、状态查询等操作 。例：获取设备描述符（`GET_DESCRIPTOR`）

- `URB_FUNCTION_BULK_OR_INTERRUPT_TRANSFER`， `0x0009` ：执行批量或中断传输。例： U盘读写、鼠标/键盘数据上报        

- `URB_FUNCTION_ISOCHRONOUS_TRANSFER`， `0x000a` ：等时传输，适用于实时流数据（如音频/视频）例：摄像头视频流                     

---

#### **2. 设备管理类**
| **URB Function**                     | **值 (十六进制)** | **描述 - 示例场景**                     |
|---------------------------------------|-------------------|-------------------------------------------------------------------------------------------|
| `URB_FUNCTION_GET_DESCRIPTOR_FROM_DEVICE` | 0x0008         | 获取设备/配置/字符串描述符      -                                          设备枚举阶段                     |
| `URB_FUNCTION_SET_DESCRIPTOR_TO_DEVICE`   | 0x000b         | 向设备设置描述符信息             -                                         更新设备描述符                   |
| `URB_FUNCTION_SET_CONFIGURATION`      | 0x0007            | 设置设备的配置（激活接口）         -                                       设备初始化                       |
| `URB_FUNCTION_SET_INTERFACE`          | 0x000c            | 切换接口的备用设置（Alternate Setting）       -                            切换USB音频设备的采样率          |
| `URB_FUNCTION_SELECT_CONFIGURATION`   | 0x0007            | 选择设备的配置（与 `SET_CONFIGURATION` 类似）   -                         动态切换设备模式                 |
| `URB_FUNCTION_SELECT_INTERFACE`       | 0x000c            | 动态选择接口（多配置设备）                    -                           切换USB复合设备的工作模式        |

---

#### **3. 状态与特性管理类**
| **URB Function**                     | **值 (十六进制)** | **描述**                                                                 | **示例场景**                     |
|---------------------------------------|-------------------|--------------------------------------------------------------------------|----------------------------------|
| `URB_FUNCTION_GET_STATUS_FROM_DEVICE` | 0x0000            | 查询设备或端点的状态                                                     | 调试设备错误                     |
| `URB_FUNCTION_SET_FEATURE_TO_DEVICE`  | 0x0003            | 设置设备特性（如启用远程唤醒）                                           | 启用特定功能                     |
| `URB_FUNCTION_CLEAR_FEATURE_TO_DEVICE`| 0x0004            | 清除设备特性（如禁用远程唤醒）                                           | 关闭特定功能                     |

---

#### **4. 端点与管道管理类**
| **URB Function**                     | **值 (十六进制)** | **描述**                                                                 | **示例场景**                     |
|---------------------------------------|-------------------|--------------------------------------------------------------------------|----------------------------------|
| `URB_FUNCTION_RESET_PIPE`             | -                 | 重置端点（清除错误状态）                                                 | 设备通信超时后恢复               |
| `URB_FUNCTION_ABORT_PIPE`             | -                 | 中止端点的未完成请求                                                     | 强制停止传输                     |

---

#### **5. 厂商与类特定功能**
| **URB Function**                     | **值 (十六进制)** | **描述**                                                                 | **示例场景**                     |
|---------------------------------------|-------------------|--------------------------------------------------------------------------|----------------------------------|
| `URB_FUNCTION_VENDOR_DEVICE`          | 0x001b            | 发送厂商特定命令到设备                                                   | 自定义设备控制                   |
| `URB_FUNCTION_CLASS_DEVICE`           | 0x001e            | 发送类特定请求给设备                                                     | USB HID 设备控制                 |
| `URB_FUNCTION_CLASS_INTERFACE`        | 0x001f            | 发送类特定请求给接口                                                     | 配置 USB 音频接口参数            |


---



### USB监听(hidapi)
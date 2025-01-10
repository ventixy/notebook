--- 

title: Pywin32
icon: windows

---

## 一 Pywin32相关介绍

Pywin32 是Python编程中针对 Windows 的扩展库，提供了对大部分 Win32 API 的访问、创建、和使用COM对象的能力以及Pythonwin环境。

### Windows消息机制

Windows消息机制是指Windows系统和应用程序之间通过发送和接收消息来进行通信的一种方式。

Windows是一个 ==消息驱动== 的系统，应用程序想要实现某个功能需由消息来触发，对消息的响应和处理表示其要实现的功能。

Windows消息有 ==队列消息== 和 ==非队列消息== 之分，队列消息会先保存在消息队列中，等待应用程序从中取出并分发到各窗口处理；非队列消息会绕过消息队列直接发送到窗口过程被处理。

::: tip 提示
Windows消息由一个结构体（MSG）表示，包含了接收该消息的窗口句柄（hwnd）、消息常量标识符（message）、32位消息特定附加信息（wParam和lParam）、消息创建时的时间（time）和鼠标创建时的光标位置（pt）等信息。

在Windows中MSG结构体定义如下：
```cpp
typedef struct tagMsg
{
       HWND    hwnd;       //接受该消息的窗口句柄
       UINT    message;    //消息常量标识符，也就是我们通常所说的消息号
       WPARAM  wParam;     //32位消息的特定附加信息，确切含义依赖于消息值
       LPARAM  lParam;     //32位消息的特定附加信息，确切含义依赖于消息值
       DWORD   time;       //消息创建时的时间
       POINT   pt;         //消息创建时的鼠标/光标在屏幕坐标系中的位置
}MSG;
```
:::


### Windows窗口句柄
Windows的窗口句柄，是指在Windows系统中用来标识和操作窗口的一个值。窗口句柄的类型是 HWND ，它是一个32位无符号整数，全系统唯一。窗口句柄是一个指向系统内部数据结构的引用，这个数据结构包含了窗口的属性和状态，如位置、大小、样式、文本、子窗口等。

::: tip HWND的具体含义
- H 是类型描述，表示句柄 (handle) ，是一个系统分配和管理的值，应用程序不能修改或创建句柄。
- WND 是变量对象描述，表示窗口 (window) ，是一个在屏幕上显示的矩形区域。
- HWND 是一个基本类型，和 char 、 int 等同级别的，可以把它当做 long 型去看待，和身份证号一样。
:::

Windows的窗口句柄有以下几个特点：
- 窗口句柄是由系统分配和管理的，应用程序不能修改或创建窗口句柄。
- 窗口句柄在窗口的生命周期内是固定不变的，但是在不同的进程或会话中，同一个窗口的句柄可能不同。
- 窗口句柄可以通过一些函数来获取，如 FindWindow 、 GetWindow 、 GetDlgItem 等。
- 窗口句柄可以通过一些函数来使用，如 SendMessage 、 SetWindowPos 、 ShowWindow 等。
- 窗口句柄可以用来与其他框架或语言进行互操作，如 WinUI 、 WPF 、 WinForms 、 Python 等。


## 二 Pywin32的使用

### 安装 pywin32

在当前Python环境下安装 pywin32 的命令如下：
```bash
pip install Pywin32 -i https://pypi.tuna.tsinghua.edu.cn/simple
```

- win32api ：模块内定义了常用的一些 API函数，例如：MessageBox
- win32gui ：模块内定义了一些有关 图形操作的API，例如：FindWindow
- win32con ：模块内定义了 windows API 内的宏，即 宏常量。

下面将介绍几个常用API的使用:


### FindWindow

win32gui.FindWindow用于检索顶级窗口的句柄，其类名和窗口名与指定的字符串匹配。这个函数不搜索子窗口，也不区分大小写。要搜索子窗口，可以使用win32gui.FindWindowEx函数。

::: info win32gui.FindWindow()语法
```python
import win32gui
hwnd = win32gui.FindWindow(lpClassName, lpWindowName)  
# hwnd = win32gui.FindWindow(none, "Notepad")  # 获取记事本窗口的句柄
```
- lpClassName是窗口类名或由之前调用win32gui.RegisterClass或win32gui.RegisterClassEx函数创建的类原子。如果lpClassName指向一个字符串，它指定窗口类名。窗口类名可以是任何使用win32gui.RegisterClass或win32gui.RegisterClassEx注册的名称，或者任何预定义的控件类名称。如果lpClassName是None，它找到任何标题与lpWindowName参数匹配的窗口。
- lpWindowName是窗口名（窗口的标题）。如果这个参数是None，所有窗口名都匹配。

如果函数成功，返回值是具有指定类名和窗口名的窗口的句柄。如果函数失败，返回值是None。
:::

win32gui.FindWindow可以用来获取指定窗口的句柄，然后对其进行一些操作，如移动、调整、激活、发送消息等。 也可以用来过滤出符合一定条件的窗口，如类名、标题、控件ID等。

### GetDesktopWindow

win32gui.GetDesktopWindow() 是一个 Python 函数，用来调用 Windows API 中的 GetDesktopWindow 函数，检索桌面窗口的句柄。桌面窗口覆盖整个屏幕，是绘制其他窗口顶部的区域。桌面窗口的句柄可以用来进行一些操作，如截屏、设置壁纸、查找子窗口等。

::: info win32gui.GetDesktopWindow()语法如下
```python
import win32gui
hwin = win32gui.GetDesktopWindow()
```
win32gui.GetDesktopWindow() 的返回值是一个 HWND 类型的值，表示桌面窗口的句柄。如果要使用这个句柄，可以调用一些其他的 win32gui 函数，如 win32gui.GetWindowRect 、 win32gui.SetWindowPos 、 win32gui.EnumChildWindows 等。
::: 

### EnumChildWindows

win32gui.EnumChildWindows() 用来调用 Windows API 中的 EnumChildWindows 函数，枚举属于指定父窗口的子窗口。子窗口是指在父窗口的工作区内创建的窗口，它们与父窗口共享相同的消息队列和输入状态。

::: info win32gui.EnumChildWindows()语法如下
```python
import win32gui
result = win32gui.EnumChildWindows(hWndParent, lpEnumFunc, lParam)
```

参数和返回值详解：
- hWndParent 是要枚举其子窗口的父窗口的句柄。如果此参数为 None ，则此函数等效于 win32gui.EnumWindows() ，枚举所有顶级窗口。
- lpEnumFunc 是一个应用程序定义的回调函数，它将在每个子窗口上调用。回调函数的签名为 def callback(hWnd, lParam) ，其中 hWnd 是子窗口的句柄，lParam 是传递给 win32gui.EnumChildWindows() 的应用程序定义值。回调函数必须返回一个布尔值，如果返回 True ，则继续枚举，如果返回 False ，则停止枚举。
- lParam 是一个应用程序定义值，它将传递给回调函数。
- result 是一个布尔值，表示函数是否成功。如果成功，则返回 True ，如果失败，则返回 False 。可以调用 win32api.GetLastError() 来获取更多的错误信息。
:::

### GetWindowText

win32gui.GetWindowText() 用来调用 Windows API 中的 GetWindowTextW 函数，获取指定窗口句柄的标题栏文本。

::: info win32gui.GetWindowText()语法如下
```python
import win32gui
text = win32gui.GetWindowText(hwnd)
```

参数和返回值详解：
- hwnd 是要获取文本的窗口或控件的句柄，可以是任何有效的 HWND 值，如 `win32gui.GetDesktopWindow()` 返回的桌面窗口句柄。
- text 是一个字符串。如果窗口没有标题栏或文本，如果标题栏为空，或者如果窗口或控件句柄无效，则返回值是一个空字符串。
:::

win32gui.GetWindowText(hwnd) 可以用来获取窗口或控件的标题、标签、内容等信息，然后对它们进行一些操作，如显示、比较、修改等。 也可以用来过滤出符合一定条件的窗口或控件，如类名、标题、控件ID等。


### GetWindowRect

win32gui.GetWindowRect(hWnd) 用来调用 Windows API 中的 GetWindowRect 函数，检索指定窗口的边界矩形的尺寸。尺寸以相对于屏幕左上角的屏幕坐标提供。

::: info win32gui.GetWindowRect()语法如下
```python
import win32gui
left, top, right, bottom = win32gui.GetWindowRect(hWnd)
```

参数和返回值详解：
- hWnd 是要获取边界矩形的窗口的句柄，可以是任何有效的 HWND 值。
- left, top, right, bottom 是四个整数，表示窗口的左上角和右下角的屏幕坐标。符合 RECT 结构的约定，返回的矩形的右下角坐标是独占的。换句话说，位于 (right, bottom) 的像素紧邻矩形外。
:::

win32gui.GetWindowRect(hWnd) 可以用来获取窗口的位置、大小、形状等信息，然后对它们进行一些操作，如移动、调整、截图等。 也可以用来过滤出符合一定条件的窗口，如在某个区域内、超出屏幕范围等。

::: tip RECT结构
RECT结构是一个定义矩形的左上角和右下角的坐标的数据结构。它在Windows API和C++中经常使用，有以下形式：
```cpp
typedef struct tagRECT {
  LONG left;
  LONG top;
  LONG right;
  LONG bottom;
} RECT;
```

RECT结构的成员如下：
- left：指定矩形左上角的X坐标。
- top：指定矩形左上角的Y坐标。
- right：指定矩形右下角的X坐标。
- bottom：指定矩形右下角的Y坐标。

RECT结构可以用来表示窗口、区域、位图等的位置、大小、形状等信息，可以与一些函数和类进行互操作，如：
- GetWindowRect、SetWindowPos等函数，用于获取或设置窗口的RECT。
- CRect类，是对RECT的封装，提供了一些方便的操作和转换方法。
- CDC类，提供了一些绘图函数，如FillRect、Draw3dRect等，可以使用RECT作为参数。
:::

### GetWindowDC

win32gui.GetWindowDC()获取了窗口设备上下文句柄

设备上下文（Device Context）是一个用于绘图的数据结构，它封装了与显示设备相关的信息。

::: info win32gui.GetWindowDC的语法
```python
import win32gui
wDC = win32gui.GetWindowDC(hwnd)  # 获取窗口设备上下文句柄
```

hwnd是一个窗口句柄。如果此值为None，win32gui.GetWindowDC将获取整个屏幕的设备上下文。如果函数成功，则返回值是指定窗口的设备上下文的句柄。如果函数失败，则返回值为None。
:::

win32gui.GetWindowDC适用于窗口的非客户区域中的特殊绘图效果。非客户区域是指窗口中不包括工作区的部分，如标题栏、菜单和滚动条。绘图完成后，必须调用win32gui.ReleaseDC函数才能释放设备上下文。

### CreateDCFromHandle

win32ui.CreateDCFromHandle将窗口设备上下文句柄转换为设备上下文对象。

::: info win32ui.CreateDCFromHandle的语法
```python
import win32gui
wDC = win32gui.GetWindowDC(hwnd)             # 获取窗口设备上下文句柄
mfcDC = win32gui.CreateDCFromHandle(wDC)     # 将窗口设备上下文句柄转换为设备上下文对象
saveDC = mfcDC.CreateCompatibleDC()          # 创建一个兼容的设备上下文对象
```
:::

win32ui.CreateDCFromHandle的用途有以下几点：
- 可以用来创建一个内存设备上下文，用于在内存中绘制位图，然后将其复制到屏幕或打印机上。
- 可以用来创建一个打印机设备上下文，用于在打印机上绘制图形或文本。
- 可以用来创建一个显示设备上下文，用于在屏幕上绘制窗口或控件。


### CreateBitmap

win32ui.CreateBitmap()可以创建一个位图对象，该对象表示一个未分配内存的位图。

::: info win32ui.CreateBitmap的语法
```python
import win32gui

saveBitMap = win32ui.CreateBitmap()   # 返回一个未分配内存的位图

# 为位图对象分配内存，并创建一个与原始设备上下文对象mfcDC兼容的位图。
saveBitMap.CreateCompatibleBitmap(mfcDC, width, height) 

saveDC.SelectObject(saveBitMap)  # 将位图对象选入到设备上下文对象、以便进行绘图操作
# 将原始设备上下文(mfcDC)中的内容复制到位图对象中
saveDC.BitBlt((0, 0), (width, height), mfcDC, (0, 0), win32con.SRCCOPY)
```
- BitBlt函数用于在设备上下文之间进行位块传输（Bit Block Transfer）。
- 使用 BitBlt 函数将 mfcDC 设备上下文的 (0, 0) 到 (width, height) 区域的图像复制到位图对象中，
- 使用 win32con.SRCCOPY 常量作为光栅操作码，表示直接复制源区域的像素值。

此时，位图对象saveBitMap中存储了从窗口截取的图像
:::















## 三 Pywin32应用总结

### 获取窗口句柄

获取指定窗口标题应用的窗口句柄：
```python
import win32gui

hwnd = win32gui.FindWindow(None, "地下城与勇士：创新世纪")
print("窗口句柄：", hwnd)
```

获取桌面窗口的句柄：
```python
import win32gui

hdesktop = win32gui.GetDesktopWindow()
print("桌面窗口句柄：", hdesktop)
```

根据某个窗口句柄、获取其全部子窗口的句柄（下面以获取桌面窗口的子窗口句柄为例）：
```python
import win32gui

hdesktop = win32gui.GetDesktopWindow()
print("桌面窗口句柄：", hdesktop)

# 获取桌面窗口的所有子窗口句柄
hwndChildList = []
win32gui.EnumChildWindows(hd, lambda hwnd, param: param.append(hwnd), hwndChildList)
for hwnd in hwndChildList:
    text = win32gui.GetWindowText(hwnd)
    print(hwnd, text)
```














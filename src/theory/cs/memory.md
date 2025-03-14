---

order: 70
title: 内存管理

---

## 内存管理基础

::: info 内存管理的主要功能
1. **内存分配**：为进程分配内存空间
2. **内存回收**：回收进程释放的内存空间
3. **地址转换**：逻辑地址到物理地址的映射
4. **内存保护**：确保进程只能访问自己的内存空间
5. **内存共享**：允许多个进程共享同一块内存
:::

### 内存分配策略

::: tip 主要的内存分配算法
1. **首次适应（First Fit）**
   - 分配第一个足够大的空闲分区
   - 实现简单，效率较高

2. **最佳适应（Best Fit）**
   - 分配最小的足够大的空闲分区
   - 空间利用率高，但查找时间长

3. **最坏适应（Worst Fit）**
   - 分配最大的空闲分区
   - 避免产生太多小碎片

4. **伙伴系统**
   - 基于2的幂进行分配
   - 便于合并，减少外部碎片
:::

### 地址转换

::: info 地址转换机制
1. **逻辑地址**
   - 程序产生的地址
   - 相对地址，从0开始

2. **物理地址**
   - 实际的内存地址
   - 通过地址映射转换得到

3. **地址绑定**
   - 编译时绑定
   - 加载时绑定
   - 运行时绑定
:::

### 内存保护

::: tip 内存保护机制
1. **界限寄存器**
   - 存储进程的上下界地址
   - 防止越界访问

2. **访问权限控制**
   - 读/写/执行权限
   - 页表项中的保护位

3. **段保护**
   - 段级别的访问控制
   - 支持共享和保护
:::

## 虚拟内存

::: info 虚拟内存的基本概念
- **定义**：将物理内存和外存结合，提供更大的地址空间
- **优点**：
  1. 提供更大的地址空间
  2. 实现进程隔离
  3. 支持共享内存
  4. 提高内存利用率

- **实现方式**：
  1. 请求分页
  2. 请求分段
  3. 段页式
:::

### 页面置换算法

::: tip 常见的页面置换算法
1. **最优算法（OPT）**
   - 理论最优，实际无法实现
   - 替换最长时间内不会被访问的页面

2. **先进先出（FIFO）**
   - 替换最先进入的页面
   - 实现简单，但性能不佳

3. **最近最少使用（LRU）**
   - 替换最长时间未被访问的页面
   - 性能好但实现复杂

4. **时钟算法（Clock）**
   - LRU的近似实现
   - 使用循环队列和使用位
:::

### 工作集

::: info 工作集管理
- **工作集**：进程在一段时间内实际访问的页面集合
- **工作集窗口**：用于确定工作集的时间范围
- **页面调度**：根据工作集进行内存分配和回收
- **抖动问题**：进程频繁换入换出页面的现象
:::
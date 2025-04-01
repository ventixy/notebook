---

order: 70
title: JVM性能调优

---


JVM性能调优(Performance Tuning)是指一系列技术和实践，旨在优化Java应用程序在JVM上的执行效率，提升应用程序的响应时间和资源利用率。性能调优的目标通常包括降低CPU和内存的使用率，减少垃圾收集（GC）的停顿时间，提高吞吐量，以及增强系统的稳定性和可预测性。


## 监控与分析

JVM监控工具是用于监控和分析Java应用程序运行时状态的工具集。这些工具能够帮助开发者和运维人员理解应用程序的性能、资源使用情况以及潜在的问题。

JVM监控工具主要包括：常用基础命令，可视化工具（如jconsole，visualvm等），商业级的性能分析工具（如：YourKit和JProfiler，提供了更深入的代码级性能分析和内存泄漏检测）


### 基础命令工具

JVM（Java Virtual Machine）提供了一系列命令行工具，用于监控和管理正在运行的Java应用程序。

::: info JVM相关命令工具

#### jps (JVM Process Status Tool)

- **用途**：列出本地或远程主机上所有正在运行的Java应用程序的进程ID（JVM ID）和主类名。
- **语法**：`jps [-q] [hostid]`
- **参数**：
  - `-q`：只显示进程ID，不显示主类名。
  - `hostid`：可选参数，用于指定远程主机的IP或主机名。

#### jinfo (Configuration Info for Java)

- **用途**：查询和更新运行中的Java应用程序的JVM配置参数。
- **语法**：`jinfo [option] pid`
- **参数**：
  - `option`：如`-flag`用于查询或设置标志，`-sysprops`用于打印系统属性。
  - `pid`：Java应用程序的进程ID。

#### jstat (JVM Statistics Monitoring Tool)

- **用途**：监控JVM的运行时统计信息，如内存使用、类加载、垃圾回收等。
- **语法**：`jstat [option] pid [interval]`
- **参数**：
  - `option`：如`-gcutil`用于显示GC利用率，`-gccapacity`用于显示GC容量信息。
  - `pid`：Java应用程序的进程ID。
  - `interval`：可选参数，用于指定输出刷新间隔（毫秒）。

#### jstatd (JVM Statistics Daemon)

- **用途**：在远程主机上启用jstat工具的远程监控功能，需要在远程主机上运行jstatd守护进程。
- **语法**：`jstatd [option]`
- **参数**：
  - `option`：如`-Joption`用于向守护进程JVM传递JVM选项。

#### jstack (Thread Stack Trace)

- **用途**：获取正在运行的Java应用程序的所有线程的堆栈跟踪。
- **语法**：`jstack pid`
- **参数**：
  - `pid`：Java应用程序的进程ID。

#### jmap (Heap Memory Map)

- **用途**：显示Java堆的内存映射，也可以生成堆转储文件。
- **语法**：`jmap [option] pid`
- **参数**：
  - `option`：如`-histo`用于显示对象直方图，`-dump`用于生成堆转储文件。
  - `pid`：Java应用程序的进程ID。

#### jhat (Heap Dump Analyzing Tool)

- **用途**：分析由jmap生成的堆转储文件，提供一个HTTP服务器供浏览器访问。
- **语法**：`jhat [option] heapfile`
- **参数**：
  - `option`：如`-Joption`用于向jhat JVM传递JVM选项。
  - `heapfile`：由jmap生成的堆转储文件。
:::


**使用场景**：
- **性能监控**：jstat、jmap、jstack常用于性能监控和问题排查，帮助理解内存使用、线程状态和垃圾回收行为。
- **配置查询**：jinfo用于查询和修改运行中的Java应用程序的JVM配置。
- **远程监控**：jstatd在远程主机上启用jstat的远程监控能力，配合jps和jstat使用。
- **堆分析**：jmap和jhat用于分析堆内存，检测内存泄漏等问题。

::: info jcmd (Java Command Line Tool)

`jcmd` 是一个非常强大的命令行工具，用于控制和调试正在运行的Java应用程序。它可以执行各种操作，包括但不限于垃圾收集、线程堆栈转储、JVM配置查询、系统属性查看以及对HotSpot虚拟机的低级操作。`jcmd` 的功能类似于`jinfo`, `jmap`, `jstack` 等工具的组合，并且提供了更统一的接口来执行这些任务。

```shell
jcmd [options] <pid> | <remote id>
```
- `<pid>`：本地Java应用程序的进程ID。
- `<remote id>`：远程Java应用程序的标识符，格式为`hostid:jid`，其中`jid`是远程主机上的Java应用ID。
- `[options]`：具体的操作选项，例如`GC.run`、`VM.command_line`、`Thread.print`等。

**常见操作**:
- **GC.run**：强制执行一次垃圾回收。
- **VM.command_line**：显示JVM启动时的命令行参数。
- **VM.system_properties**：显示系统属性。
- **Thread.print**：打印所有线程的堆栈跟踪，相当于`jstack`的功能。
- **`HotSpot.Flag.print`**：显示所有HotSpot虚拟机的标志。
- **`HotSpot.Flag.<flag>`**：查询或设置特定的HotSpot虚拟机标志。

**优点**:
- **统一性**：`jcmd` 提供了一个统一的接口来执行多种不同的JVM监控和管理任务。
- **灵活性**：通过简单的命令行参数，可以执行复杂的操作，比如控制垃圾回收或者查看详细的JVM配置。
- **远程控制**：支持对远程Java应用程序的监控和管理。

**使用场景**:
- **性能调试**：当应用程序出现性能瓶颈时，可以通过`jcmd` 执行垃圾收集或查看线程堆栈来定位问题。
- **配置验证**：检查应用程序的启动参数和系统属性是否符合预期。
- **故障排除**：在应用程序崩溃或挂起时，通过`jcmd` 获取线程堆栈或系统状态信息来帮助诊断问题。

`jcmd` 的引入简化了Java应用程序的管理和调试过程，使得开发者和运维人员能够更加高效地处理与JVM相关的各种问题。
:::


### JConsole

JConsole是Java Development Kit (JDK) 中的一个图形化工具，用于监控和管理运行在Java虚拟机(JVM)上的应用程序。它允许用户查看JVM的各个方面，如内存使用、垃圾收集(GC)活动、线程信息、类加载情况等，并且可以远程监控JVM实例。

JConsole可以通过两种方式启动：
1. **命令行**：在命令行中直接输入 `jconsole` 命令。
2. **GUI Shell**：在JDK的bin目录下找到并双击 `jconsole.exe` 文件（Windows系统）或 `jconsole`（Unix/Linux系统）。

启动JConsole后，会出现一个连接对话框，要求你输入要连接的JVM的详细信息：
- **本地进程**：可以选择本地计算机上正在运行的Java进程。
- **远程进程**：需要输入远程主机的地址和JMX服务URL。例如，`service:jmx:rmi:///jndi/rmi://hostname:port/jmxrmi`。
- **JMX Service URL**：可以直接输入JMX服务URL来连接到JVM。在远程监控JVM时，确保目标机器上启用了JMX代理，并且防火墙或安全策略不会阻止JConsole的连接。对于安全性敏感的应用程序，确保只在受信任的网络环境中使用JConsole，因为它可能暴露敏感的运行时信息。


一旦成功连接到JVM，JConsole会展示多个功能面板：

1. **概览**（Overview）：显示JVM的基本信息，如版本、启动时间、运行时间、内存使用情况等。
2. **内存**（Memory）：展示JVM的内存使用详情，包括堆内存和非堆内存的使用情况，以及垃圾收集器的统计信息。
3. **线程**（Threads）：显示JVM中所有线程的信息，包括线程ID、名称、状态和堆栈跟踪。
4. **类**（Classes）：显示已加载类的数量，以及加载和卸载类的统计信息。
5. **JMX**（MBeans）：列出可用的MBeans（Managed Beans），可以查看和修改MBeans的属性和操作。
6. **环境**（Environment）：显示JVM的系统属性和环境变量。


JConsole的监控信息对于识别和解决性能问题非常有用。例如：
- **内存使用**：可以观察到堆内存的使用趋势，以及垃圾收集的频率和停顿时间，有助于识别内存泄漏或内存不足的问题。
- **线程监控**：可以检查是否有死锁或线程阻塞的情况，以及线程的活跃程度。
- **类信息**：可以查看类加载和卸载的状态，帮助理解应用程序的类生命周期。

在进行性能调优时，应先在非生产环境中测试任何更改，以避免对生产系统造成意外影响。



### VisualVM

VisualVM是Java Development Kit (JDK) 的一部分，它是一个免费的、开源的、跨平台的工具，用于监视和分析运行在Java虚拟机 (JVM) 上的应用程序的性能。VisualVM整合了多个JDK工具，如jstat、jmap、jstack、jinfo和JConsole的功能，提供了一个统一的图形用户界面，使开发者和系统管理员能够更有效地进行性能分析和故障排查。其主要功能包括：

- **监视**：VisualVM可以监视本地和远程JVM的运行状况，包括内存使用、CPU使用、线程状态、垃圾收集活动等。
- **分析**：它提供了CPU和内存分析工具，可以用来追踪热点代码和潜在的内存泄漏。
- **堆转储和线程快照**：VisualVM可以生成堆转储文件和线程快照，用于离线分析。
- **MBeans浏览**：可以浏览和操作管理Bean (MBeans)，这是JMX (Java Management Extensions) 的一部分，用于管理JVM和应用程序。
- **JMX代理**：可以连接到远程JMX代理，以监控远程JVM。
- **插件扩展**：VisualVM支持插件，允许添加更多功能，如visualGC插件用于更深入的垃圾收集分析。


**使用步骤**:

1. **启动VisualVM**：
   - 你可以通过JDK的bin目录下的`visualvm`或`visualvm.exe`（取决于操作系统）来启动它。

2. **连接到JVM**：
   - 打开VisualVM后，你会看到本地运行的Java应用程序列表。选择你想要监控的应用程序。
   - 如果你想监控远程JVM，可以点击左上角的“+”号，然后选择“JMX connection”，输入远程JVM的JMX服务URL。

3. **监视和分析**：
   - **监视**：在VisualVM中，你可以看到应用程序的内存使用情况、CPU使用情况、线程状态和垃圾收集活动。这些信息在主窗口的图表和表格中显示。
   - **CPU分析**：点击“Profiler”选项卡，选择“CPU”进行CPU采样分析。这将显示哪些方法和类正在消耗最多的CPU时间。
   - **内存分析**：在“Profiler”选项卡中，选择“Memory”进行内存分析。这可以帮助你识别可能的内存泄漏。
   - **堆转储和线程快照**：在“Snapshot”选项卡中，你可以创建堆转储或线程快照，用于进一步的离线分析。

4. **MBeans浏览**：
   - 在“MBeans”选项卡中，你可以浏览和操作应用程序的MBeans，这对于调试和管理非常有用。

5. **使用插件**：
   - 为了使用插件，如visualGC，你需要先下载并安装插件。插件可以在VisualVM的官方网站或GitHub页面找到。

6. **保存和导出数据**：
   - VisualVM允许你保存会话，以便以后再次查看。你也可以导出图表和报告。

::: info JDK中找不到VisualVM的原因

如果发现JDK安装目录下的`bin`文件夹中没有有`visualvm`或`jvisualvm.exe`文件，可能是因为：

1. **JDK版本**：从JDK 9开始，Oracle JDK不再捆绑VisualVM作为标准分发的一部分。这意味着如果您安装的是JDK 9或更高版本的Oracle JDK，您将不会在默认安装中找到VisualVM。然而，对于OpenJDK，某些构建仍然可能会包含VisualVM。

2. **安装类型**：如果您选择了最小或自定义安装，可能在安装过程中没有选择包含VisualVM的选项。某些JDK的轻量级安装包可能不包含这个工具。

解决这个问题的方法通常是直接从Oracle或其他可信赖的来源下载VisualVM的独立版本。下载完成后，按照指示进行安装，并确保将其添加到您的PATH环境变量中，以便在任何位置都能运行它。

另外，如果您使用的是Linux或macOS系统，可以考虑使用包管理器（如apt、yum、brew等）来安装VisualVM。

最后，如果您使用的是IntelliJ IDEA、Eclipse或NetBeans等IDE，这些IDE通常也内置了类似VisualVM的性能监控和分析工具，可以作为替代方案。
:::

VisualVM是一个非常有用的工具，特别是在进行性能调优和故障排除时。它不仅提供了实时的监控数据，还允许你进行深入的分析，以理解应用程序的运行行为和性能瓶颈。



### GC日志分析

GC（Garbage Collection）日志分析是在Java应用程序性能调优和故障排查中的一项重要技能。GC日志包含了JVM垃圾回收器的活动细节，通过对这些日志的分析，可以洞察应用程序的内存使用模式、垃圾收集的频率和效率，从而找出可能存在的性能瓶颈，如频繁的垃圾收集、长时间的暂停（Stop The World事件），以及内存泄露等问题。

要生成GC日志，需要在启动Java应用程序时给JVM传递相应的参数。常见的参数有：

- `-Xloggc:<filename>`：指定GC日志的输出文件名。
- `-XX:+PrintGCDetails`：打印详细的GC信息，包括每个收集事件的详细描述。
- `-XX:+PrintGC`：打印基本的GC信息，如GC前后堆的使用情况。
- `-XX:+PrintGCTimeStamps`：在日志中打印GC事件的相对时间戳。
- `-XX:+PrintGCDateStamps`：在日志中打印GC事件的绝对日期和时间。
- `-XX:+PrintAdaptiveSizePolicy`：打印有关年轻代大小调整的策略信息。
- `-XX:+PrintTenuringDistribution`：打印每个新对象在晋升到老年代前的存活次数。
- `-XX:+PrintFLSStatistics`：打印FastLockStriping（并行收集器中的一种锁机制）的统计数据。

GC日志通常包含以下信息：

- **GC类型**：`[GC]` 表示年轻代垃圾收集；`[Full GC]` 表示整个堆的垃圾收集。
- **时间戳**：GC事件发生的时间，可以是相对时间或绝对时间。
- **内存使用情况**：包括Eden区、Survivor区、Old区和PermGen/Metaspace的使用前后的大小。
- **停顿时间**：GC事件导致的暂停时间，即STW（Stop The World）时间。

虽然可以手动分析GC日志，但使用专门的工具会更加高效。一些常用的GC日志分析工具包括：
- **VisualVM**：集成了GC日志分析功能，可以可视化地展示GC活动。
- **MAT (Memory Analyzer Tool)**：专门用于分析Java应用程序的内存使用，可以导入GC日志进行分析。
- **GCeasy**：一款在线的GC日志分析工具，可以自动分析日志并提供报告。
- **JMC (Java Mission Control)**：包含在Oracle JDK中，提供详细的GC分析和性能监控功能。
- **Logstash + Kibana**：可以用来解析和可视化GC日志，适用于大规模日志分析。

**常见问题与调优方向**：
- **频繁的年轻代GC**：可能意味着对象的生存周期过短，需要检查代码是否存在不必要的对象创建。
- **长时间的Full GC**：可能导致应用程序响应变慢，需要检查老年代的使用情况，考虑增加堆大小或调整老年代的GC策略。
- **高GC停顿时间**：影响应用程序的响应时间，可能需要调整GC算法或参数，减少GC停顿。

通过持续的GC日志分析，可以逐步优化JVM的内存管理，提升应用程序的性能和稳定性。



### GCViewer

GCViewer是一个开源的图形化工具，专门设计用于分析Java虚拟机(JVM)的垃圾回收(Garbage Collection, GC)日志。它能够将复杂的GC日志转换成易于理解的图表和统计信息，帮助开发者和系统管理员诊断和优化JVM的内存使用和GC行为。

::: info GCViewer的作用
1. **可视化GC日志**：GCViewer将GC日志中的数据转换成图表，直观显示GC事件的频率、停顿时间、内存使用情况等。
2. **GC性能分析**：通过分析GC日志，GCViewer可以帮助识别性能瓶颈，如频繁的GC、长时间的Full GC等。
3. **JVM配置优化**：基于GC日志分析，GCViewer可以提供JVM参数调优建议，比如年轻代和老年代的大小、GC算法选择等。
4. **异常检测**：能够检测出异常的GC行为，如内存泄漏、配置不当等问题。
:::

**使用GCViewer的方法**:

首先，你需要在运行Java应用时启用GC日志记录。这通常通过在JVM启动参数中加入如下命令实现：

```sh
-Xloggc:/path/to/gc.log -XX:+PrintGCDetails -XX:+PrintGCDateStamps
```

下载并解压GCViewer的最新版本，双击`.jar`文件启动工具。你也可以从其GitHub仓库获取最新源码并自行编译。

在GCViewer中，通过“File”菜单下的“Open File”选项，选择之前生成的GC日志文件。

加载日志后，GCViewer将自动生成一系列图表，包括但不限于：

- **GC事件时间线**：显示所有GC事件的时间分布。
- **堆内存使用**：展示GC前后堆内存的使用情况。
- **GC停顿时间**：列出每次GC的持续时间和类型。
- **年轻代与老年代的内存变化**：显示各代内存随时间的变化趋势。

使用GCViewer的过滤和缩放功能来聚焦特定时间段或GC类型，深入分析问题所在。

::: tip
- 在分析GC日志时，注意观察GC停顿时间是否超出可接受范围，以及Full GC的频率和触发原因。
- 根据GCViewer提供的信息，尝试调整JVM参数，比如改变年轻代和老年代的大小，选择不同的GC算法，或调整其他相关参数，以达到最佳性能。
:::

通过上述步骤，你可以利用GCViewer有效地分析和优化Java应用的GC行为，提高应用的稳定性和响应速度。







## 调整JVM参数

实践中，调优是一个迭代的过程，可能需要监控应用性能，分析GC日志，进行多次测试和调整。工具如VisualVM、JConsole和GCViewer可以帮助监控和分析JVM的状态和GC行为，从而更好地进行调优。

### 垃圾收集器

根据应用需求选择适合的GC，如Parallel Collector, Concurrent Mark Sweep (CMS), Garbage First (G1), ZGC或Shenandoah。

选择垃圾回收器和相关参数时，需要考虑以下因素：
- **应用特性**：高吞吐量、低延迟、内存效率。
- **硬件资源**：CPU核心数量、内存大小。
- **业务需求**：响应时间要求、系统稳定性。

::: info 选择垃圾回收器
- **串行回收器**：适用于单核CPU的小型应用，使用 `-XX:+UseSerialGC`。
- **并行回收器**：适用于多核CPU的场景，关注高吞吐量的应用，使用 `-XX:+UseParallelGC` 或 `-XX:+UseParallelOldGC`。
- **并发标记清扫回收器（CMS）**：适用于对停顿时间敏感的应用，使用 `-XX:+UseConcMarkSweepGC`。
- **G1回收器**：适用于大堆内存的应用，具有可预测的停顿时间，使用 `-XX:+UseG1GC`。
:::

在确定使用何种垃圾回收器后，可以据其调整与之相关的其他参数，如：
::: info 垃圾回收器参数调优
- **Serial**：
  - 无特别参数，主要关注堆内存分配。

- **Parallel**：
  - `-XX:ParallelGCThreads`：设置并行GC线程的数量。
  - `-XX:MaxGCPauseMillis`：设置期望的最长GC停顿时间。

- **CMS回收器**：
  - `-XX:CMSInitiatingOccupancyFraction`：设置触发CMS收集的堆使用百分比。
  - `-XX:CMSTriggerInterval`：设置CMS收集的频率。

- **G1回收器**：
  - `-XX:MaxGCPauseMillis`：设置期望的最长GC停顿时间。
  - `-XX:InitiatingHeapOccupancyPercent`：设置触发混合GC的堆使用百分比。
  - `-XX:G1ReservePercent`：设置G1预留的内存百分比，用于防止堆耗尽。
:::






### 查看配置参数

可以使用`-XX:+PrintCommandLineFlags`选项来查看JVM启动时使用的默认参数：

```bash
# 查看JVM启动时使用的默认参数，包括垃圾收集器的信息
java -XX:+PrintCommandLineFlags -version
```

常见的JVM内存相关配置参数：

- 堆内存的大小配置（通常使用`-Xms` 和 `-Xmx`，JDK5后可以使用`-XX:InitialHeapSize`和`-XX:MaximumHeapSize`）

- 年轻代和老年代的大小比例设置（通过 `-XX:NewRatio`, `-XX:SurvivorRatio` 或 `-XX:NewSize` 和 `-XX:MaxNewSize`, G1则使用`-XX:G1NewSizePercent` 和 `-XX:G1MaxNewSizePercent`）

- 方法区内存大小设置（永久代或元空间）


### 堆内存配置

**堆内存**：通过 `-Xms` 和 `-Xmx` 参数设置初始堆大小和最大堆大小。一般推荐 `-Xms` 和 `-Xmx` 设置相同的值以避免动态调整带来的性能影响。

`-Xms`和`-Xmx`参数并没有预设的默认值，它们取决于你的系统环境和JVM的版本。JVM通常会根据系统可用的内存和一些预设的规则来确定默认的堆大小。例如，对于64位JVM，默认的初始堆大小（`-Xms`）可能是物理内存的1/64，而最大堆大小（`-Xmx`）可能是物理内存的1/4。具体的默认值可能会因JVM的具体版本和系统配置有所不同。

::: info 自定义堆内存配置思路

1. **了解应用需求**：分析你的应用在生产环境中需要多少内存。如果应用主要是CPU密集型而非内存密集型，你可能不需要很大的堆。如果应用需要处理大量数据，可能需要更大的堆。

2. **平衡初始和最大堆大小**：通常推荐`-Xms`和`-Xmx`设置为相同的值，这样可以避免JVM在运行过程中动态调整堆大小，减少不必要的性能损耗。

3. **参考物理内存**：一个好的起点是将`-Xms`和`-Xmx`设置为你机器物理内存的一定比例，例如，如果你的服务器有16GB的RAM，你可能希望设置`-Xms`和`-Xmx`为大约12GB的30%至50%，即3.6GB至8GB，具体取决于应用的需求和你是否需要保留内存给其他系统进程。

4. **监控和调优**：在应用上线后，应使用性能监控工具（如VisualVM或JConsole）来监控JVM的内存使用情况，根据监控结果调整`-Xms`和`-Xmx`的值，直到找到最佳的配置。
:::

例如，如果你的服务器有8GB的RAM，你可能想要设置`-Xms`和`-Xmx`如下：

```bash
java -Xms2g -Xmx2g -jar yourapplication.jar  # 为JVM分配2GB的初始堆和最大堆
```

实际的配置应根据具体需求和监测结果进行调整。在生产环境中，通常会设置更高的值，例如4GB或更高，特别是对于大型应用或数据密集型服务。

::: tip `-XX:InitialHeapSize`和`-XX:MaximumHeapSize`
在JDK5及之后的版本中，`-Xms`和`-Xmx`参数的默认行为已经可以被`-XX:InitialHeapSize`和`-XX:MaximumHeapSize`所取代。也就是说，如果不显式指定`-XX:InitialHeapSize`和`-XX:MaximumHeapSize`，JVM才会使用`-Xms`和`-Xmx`

示例配置：假设希望JVM的堆内存初始大小为1GB，最大大小为2GB，可以使用以下参数：
```bash
java -XX:InitialHeapSize=1g -XX:MaximumHeapSize=2g yourApp.jar
```
:::


### 年轻代和老年代

**年轻代和老年代比例**：通过 `-XX:NewRatio` 或 `-XX:NewSize` 和 `-XX:MaxNewSize` 控制年轻代与老年代的比例。

1. `-XX:NewRatio`
该参数用于设置老年代与年轻代的大小比例。例如，`-XX:NewRatio=2`意味着老年代的大小将是年轻代的两倍。

2. `-XX:NewSize` 和 `-XX:MaxNewSize`
    - `-XX:NewSize`用于设置年轻代的初始大小。
    - `-XX:MaxNewSize`用于设置年轻代的最大大小。

    当需要显式指定年轻代的初始和最大大小时，使用这两个参数。它们可以替代`-XX:NewRatio`，提供更直接的控制。

3. `-XX:SurvivorRatio`

- **功能**：该参数用于控制年轻代中Eden区与两个Survivor区的大小比例。默认情况下，年轻代由一个Eden区和两个Survivor区组成，比例为8:1:1。如果`-XX:SurvivorRatio=8`，则意味着Eden区与每个Survivor区的大小比例为8:1。
- **适用场景**：当需要调整年轻代内部的Eden区与Survivor区的大小比例以优化短生命周期对象的垃圾回收效率时，使用此参数。

::: info `-XX:PretenureSizeThreshold` 和 `-XX:MaxTenuringThreshold`
`-XX:PretenureSizeThreshold` 和 `-XX:MaxTenuringThreshold` 是两个与对象晋升到老年代（Old Generation）有关的重要参数。它们分别控制了对象直接进入老年代的大小阈值和对象在年轻代（Young Generation）中经历的垃圾回收次数阈值，对于优化JVM的内存管理和垃圾回收行为具有重要作用。

**`-XX:PretenureSizeThreshold`**：

- **功能**：此参数用于设置对象的大小阈值。如果一个新创建的对象大小超过了这个阈值，那么这个对象将直接在老年代中分配内存，而不是先在年轻代中分配。这样做的目的是为了避免大对象频繁在年轻代中进行复制，从而减少年轻代的垃圾回收开销。

- **默认值**：在不同的JDK版本中，`-XX:PretenureSizeThreshold`的默认值可能不同。在一些版本中，它的默认值可能被设置为0，意味着默认情况下所有对象都会先在年轻代中分配，除非特别配置。

**`-XX:MaxTenuringThreshold`**：

- **功能**：此参数用于设置对象在年轻代中经过多少次垃圾回收后将晋升到老年代。对象在年轻代中的每一次幸存（即未被垃圾回收）都会增加其“年龄”（Tenuring）。当对象的年龄达到`-XX:MaxTenuringThreshold`设定的值时，它将被移动到老年代。

- **默认值**：`-XX:MaxTenuringThreshold`的默认值通常为15。这意味着默认情况下，一个对象必须在年轻代中幸存15次垃圾回收才能晋升到老年代。
:::


注意：以上参数适用于 G1垃圾收集器（如Serial、Parallel、CMS）之前的 版本中。

::: info `-XX:G1NewSizePercent` 和 `-XX:G1MaxNewSizePercent`
`-XX:G1NewSizePercent` 和 `-XX:G1MaxNewSizePercent` 是Java虚拟机（JVM）中专用于G1（Garbage-First）垃圾收集器的参数，用于控制年轻代在堆总大小中所占的百分比。G1收集器旨在提供更可预测的暂停时间，同时尽量减少全局垃圾回收的频率和持续时间。

#### `-XX:G1NewSizePercent`

此参数用于设置初始年轻代（Young Generation）的大小占整个堆内存的百分比。它告诉JVM在启动时，年轻代应占据堆内存的多少比例。
  
#### `-XX:G1MaxNewSizePercent`

这个参数用于设置年轻代可以扩展到的最大百分比，即年轻代在堆内存中最大能占据的百分比。这在JVM运行期间，当需要更多内存时，年轻代可以增长到的最大值。

假设你希望年轻代在堆内存中的初始占比为5%，最大占比为60%，可以使用以下命令行参数：

```bash
java -XX:G1NewSizePercent=5 -XX:G1MaxNewSizePercent=60 yourApp.jar
```

- G1收集器将堆划分为多个固定大小的区域（Region），年轻代和老年代的概念在这里变得模糊，因为这些区域可以动态地分配给年轻代或老年代。因此，通过`-XX:G1NewSizePercent`和`-XX:G1MaxNewSizePercent`来控制年轻代的大小，实际上是在控制年轻代占据的Region数量和比例。
  
- 设置`-XX:G1NewSizePercent`和`-XX:G1MaxNewSizePercent`时，应考虑到应用程序的特性，比如对象的生命周期、内存使用模式等。如果应用程序产生大量短暂生存期的对象，可能需要增大年轻代的大小，以减少频繁的垃圾回收操作。

- 过大或过小的年轻代大小都可能影响性能。年轻代太小会导致频繁的Minor GC，而年轻代太大则可能导致Full GC的频率增加，因为G1收集器需要更多的Region来处理老年代的垃圾回收。
:::

G1垃圾收集器采用了自适应的晋升策略，它会根据当前的堆内存使用情况和垃圾回收的频率来自动调整晋升规则。这意味着G1会根据运行时的实际条件动态决定对象的晋升时机。而不再需要用户显式指定`-XX:PretenureSizeThreshold`或`-XX:MaxTenuringThreshold`这样的参数。



### 方法区配置

**永久代或元空间**：在JDK 8及以前版本，通过 `-XX:PermSize` 和 `-XX:MaxPermSize` 控制永久代大小；在JDK 8及以上版本，使用 `-XX:MetaspaceSize` 和 `-XX:MaxMetaspaceSize` 控制元空间大小。垃圾收集器主要关注堆内存的管理，特别是年轻代和老年代的垃圾回收，因此元空间相关的参数也与垃圾回收器没什么关系了。

::: info 方法区（Method Area）参数调优
方法区（Method Area），在JDK 8及以前的版本中被称为永久代（Permanent Generation，PermGen），是JVM的一部分，用于存储类的信息、静态变量、常量池等内容。在JDK 8中，永久代被元空间（Metaspace）所替代，元空间的实现不再局限于JVM的堆内存中，而是使用本机的直接内存。

#### 永久代（PermGen）相关的JVM参数

在JDK 8之前的版本中，可以使用以下参数来调整永久代的大小：

- `-XX:PermSize=<size>`：设置永久代的初始大小。例如，`-XX:PermSize=64m` 将永久代的初始大小设置为64MB。
- `-XX:MaxPermSize=<size>`：设置永久代的最大大小。例如，`-XX:MaxPermSize=128m` 将永久代的最大大小设置为128MB。

#### 元空间（Metaspace）相关的JVM参数

在JDK 8及以后的版本中，永久代被元空间所替代，相关参数如下：

- `-XX:MetaspaceSize=<size>`：设置元空间的初始大小。元空间的大小并不是固定的，它会根据需要动态增长，但是初始大小会影响其增长速度。例如，`-XX:MetaspaceSize=128m`。
- `-XX:MaxMetaspaceSize=<size>`：设置元空间的最大大小。如果设置了这个参数，元空间的大小将不会超过这个值。如果不设置，元空间的大小将受到本机物理内存的限制。例如，`-XX:MaxMetaspaceSize=256m`。

#### 调优策略

1. **监控元空间使用**：使用JMX、VisualVM或JConsole等工具监控元空间的使用情况，以确定是否需要调整元空间的大小。

2. **初始大小调整**：如果发现元空间经常接近其最大值或增长速度过快，可以适当增加`-XX:MetaspaceSize`的值，以减少元空间的频繁增长带来的开销。

3. **最大大小限制**：如果应用的类信息量很大，可能会导致元空间耗尽物理内存，这时应设置`-XX:MaxMetaspaceSize`来限制元空间的最大大小，防止内存溢出。

4. **类卸载**：如果应用中包含大量动态加载和卸载的类，可以考虑实现类的卸载机制，以便在不再需要类信息时将其从元空间中移除。

5. **类数据共享（CDS）**：在JDK 8及以后的版本中，可以使用类数据共享（Class Data Sharing）来减少元空间的占用。CDS允许多个JVM实例共享相同的类信息，从而节省内存。
:::



### 其他调优参数

- `-XX:+UseCompressedOops`：使用压缩的对象指针，节省内存。
- `-XX:+UseStringDeduplication`：减少字符串重复，节省内存。
- `-XX:+HeapDumpOnOutOfMemoryError` 和 `-XX:HeapDumpPath=<path>`：在OOM错误时自动创建堆转储文件。

::: info 参数详解
#### `-XX:+UseCompressedOops`

**含义**：此参数指示JVM使用压缩的对象指针（Ordinary Object Pointers，简称OOPs）。在64位JVM中，如果不启用该参数，对象指针会占用64位（即8字节）。启用后，JVM会使用32位（4字节）来表示对象指针，从而节省内存空间。

**优点**：
- 减少了内存占用，因为对象引用的开销降低。
- 有助于提高垃圾回收的效率，因为垃圾回收器处理的指针数量减少了。

**适用场景**：
- 高内存使用量的应用，尤其是那些具有大量对象引用的应用。
- 64位JVM环境下，以节省内存为主要目标时。

#### `-XX:+UseStringDeduplication`

**含义**：此参数启用字符串去重功能，这是JDK 8中引入的一个新特性。它会自动检测和删除字符串常量池中的重复字符串，从而减少内存消耗。

**优点**：
- 显著减少内存中的字符串常量池占用，尤其是当应用中存在大量相同字符串时。
- 改善应用的性能，因为减少了内存复制和比较的次数。

**适用场景**：
- 字符串处理密集型的应用，如文本分析、数据库连接池等。
- 应用中字符串重复率高的情况。

#### `-XX:+HeapDumpOnOutOfMemoryError` 和 `-XX:HeapDumpPath=<path>`

- `-XX:+HeapDumpOnOutOfMemoryError`：当JVM遇到`OutOfMemoryError`时，自动创建一个堆转储快照（heap dump）。
- `-XX:HeapDumpPath=<path>`：指定堆转储快照的保存路径。

**优点**：
- 在内存溢出时提供关键的诊断信息，帮助开发者定位问题。
- 快速获取应用运行时的内存使用情况，包括对象分布、大小等，便于问题排查和性能调优。

**适用场景**：
- 生产环境中，当应用出现不可预期的`OutOfMemoryError`时，为了快速定位问题。
- 开发和测试阶段，用于分析和预防潜在的内存泄漏。
:::


JIT编译优化：

- **逃逸分析**：使用-XX:+DoEscapeAnalysis，允许JVM优化局部变量的存储位置。
- **标量替换**：使用-XX:+EliminateAllocations来减少对象创建。

::: info JIT编译优化

#### 逃逸分析：`-XX:+DoEscapeAnalysis`

**含义**：`-XX:+DoEscapeAnalysis` 参数开启逃逸分析（Escape Analysis），用于分析局部变量的生命周期和作用域，判断局部变量是否“逃逸”出方法的作用域，即是否被外部访问或存储到堆上。

- **逃逸分析**（Escape Analysis）是一种强大的优化手段，它分析局部变量的使用模式，判断哪些变量可以安全地分配在栈上而不是堆上，从而减少垃圾收集的压力和提高程序的性能。
- **栈上分配**（On-Stack Replacement, OSR）：基于逃逸分析的结果，JVM可以将不会逃逸出方法的局部变量分配在栈上，而不是在堆上分配，这样可以避免频繁的对象创建和垃圾回收。

#### 标量替换：`-XX:+EliminateAllocations`

**含义**：`-XX:+EliminateAllocations` 参数用于开启标量替换（Scalar Replacement），旨在减少对象的创建，从而减少内存分配和垃圾收集的压力。

- **标量替换**（Scalar Replacement）是指将对象字段替换为其原始类型的标量变量的过程。例如，如果一个对象仅包含几个简单的字段（如整数、浮点数等），JIT编译器可能会决定不创建整个对象，而是直接使用这些字段的值。这样可以避免不必要的对象创建和随后的垃圾回收开销，提高程序的运行效率。
:::



## 测试与最佳实践

- **持续监控和调优**：性能调优是一个迭代过程，需要不断测试和调整。

- **A/B测试**：在生产环境中实施小规模测试，评估不同配置的效果。

- **遵循官方文档和社区建议**：阅读JVM官方文档和Java社区的最佳实践，了解最新的调优技巧。

性能调优通常需要结合应用的具体场景和需求，采取针对性的策略。同时，重要的是要认识到，过度调优可能会带来不必要的复杂性和维护成本，因此应该在性能收益和开发维护成本之间找到一个平衡点。

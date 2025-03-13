import{_ as l}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,b as n,o as t}from"./app-CJjIwsM3.js";const a={};function r(s,i){return t(),e("div",null,i[0]||(i[0]=[n('<p>操作系统是管理计算机硬件与软件资源的计算机程序，同时也是计算机系统的内核与基石。</p><h2 id="进程管理" tabindex="-1"><a class="header-anchor" href="#进程管理"><span>进程管理</span></a></h2><h3 id="进程与线程" tabindex="-1"><a class="header-anchor" href="#进程与线程"><span>进程与线程</span></a></h3><div class="hint-container info"><p class="hint-container-title">进程与线程的基本概念</p><ul><li><strong>进程（Process）</strong>：是操作系统进行资源分配和调度的基本单位，每个进程都有独立的内存空间。</li><li><strong>线程（Thread）</strong>：是CPU调度和分派的基本单位，线程共享所属进程的资源。</li></ul><p>在Java中：</p><ul><li>一个JVM实例就是一个进程</li><li>Java线程是映射到操作系统的原生线程上的</li><li>通过<code>java.lang.Thread</code>类可以创建和管理线程</li></ul></div><h3 id="进程调度" tabindex="-1"><a class="header-anchor" href="#进程调度"><span>进程调度</span></a></h3><div class="hint-container tip"><p class="hint-container-title">常见的进程调度算法</p><ol><li><strong>先来先服务（FCFS）</strong>：按照进程到达的先后顺序进行调度</li><li><strong>短作业优先（SJF）</strong>：优先调度运行时间短的进程</li><li><strong>优先级调度</strong>：Java线程的优先级（1-10）就是基于此实现</li><li><strong>时间片轮转</strong>：多线程并发执行的基础</li><li><strong>多级反馈队列</strong>：结合多个队列的优势</li></ol></div><h3 id="进程通信" tabindex="-1"><a class="header-anchor" href="#进程通信"><span>进程通信</span></a></h3><p>进程间通信（IPC）的主要方式：</p><ul><li>管道（Pipe）：用于父子进程间通信</li><li>消息队列：进程间传递格式化数据</li><li>共享内存：多个进程共享同一块内存空间</li><li>信号量：用于进程同步和互斥</li><li>Socket：网络通信的基础</li></ul><p>Java中的进程通信主要通过Socket或者借助中间件实现。</p><h2 id="内存管理" tabindex="-1"><a class="header-anchor" href="#内存管理"><span>内存管理</span></a></h2><h3 id="内存管理基础" tabindex="-1"><a class="header-anchor" href="#内存管理基础"><span>内存管理基础</span></a></h3><div class="hint-container info"><p class="hint-container-title">内存管理的主要功能</p><ol><li><strong>内存分配与回收</strong>：与Java的堆内存管理类似</li><li><strong>地址转换</strong>：虚拟地址到物理地址的映射</li><li><strong>内存保护</strong>：进程间内存隔离</li><li><strong>内存共享</strong>：共享内存段</li></ol></div><h3 id="虚拟内存" tabindex="-1"><a class="header-anchor" href="#虚拟内存"><span>虚拟内存</span></a></h3><div class="hint-container tip"><p class="hint-container-title">虚拟内存的重要性</p><ul><li>让物理内存扩充成更大的虚拟内存</li><li>提供内存隔离，保护进程地址空间</li><li>在Java中，堆内存的动态扩展机制也是基于虚拟内存实现的</li></ul></div><h3 id="页面置换算法" tabindex="-1"><a class="header-anchor" href="#页面置换算法"><span>页面置换算法</span></a></h3><p>常见的页面置换算法：</p><ul><li><strong>最佳置换算法（OPT）</strong>：理论最优，实际无法实现</li><li><strong>最近最少使用（LRU）</strong>：置换最长时间未使用的页面</li><li><strong>先进先出（FIFO）</strong>：置换最早进入内存的页面</li></ul><p>JVM的垃圾回收算法在设计时也参考了这些经典算法。</p><h2 id="文件系统" tabindex="-1"><a class="header-anchor" href="#文件系统"><span>文件系统</span></a></h2><h3 id="文件管理" tabindex="-1"><a class="header-anchor" href="#文件管理"><span>文件管理</span></a></h3><div class="hint-container info"><p class="hint-container-title">文件系统的主要功能</p><ol><li><strong>文件存储</strong>：数据的物理组织</li><li><strong>目录管理</strong>：文件的逻辑组织</li><li><strong>文件共享</strong>：多用户访问控制</li><li><strong>文件保护</strong>：访问权限控制</li></ol></div><p>Java的<code>File</code>类和NIO包提供了对文件系统的访问接口。</p><h3 id="磁盘调度" tabindex="-1"><a class="header-anchor" href="#磁盘调度"><span>磁盘调度</span></a></h3><p>常见的磁盘调度算法：</p><ul><li><strong>先来先服务（FCFS）</strong>：按请求顺序访问磁盘</li><li><strong>最短寻道时间优先（SSTF）</strong>：优先访问最近的磁道</li><li><strong>扫描算法（SCAN）</strong>：电梯算法，双向扫描磁道</li></ul><h2 id="i-o管理" tabindex="-1"><a class="header-anchor" href="#i-o管理"><span>I/O管理</span></a></h2><h3 id="i-o控制方式" tabindex="-1"><a class="header-anchor" href="#i-o控制方式"><span>I/O控制方式</span></a></h3><div class="hint-container tip"><p class="hint-container-title">I/O控制的主要方式</p><ol><li><strong>程序直接控制</strong>：CPU轮询等待I/O完成</li><li><strong>中断驱动</strong>：I/O完成时通过中断通知CPU</li><li><strong>DMA方式</strong>：直接内存访问，减少CPU干预</li><li><strong>通道控制方式</strong>：专门的I/O处理器</li></ol><p>Java的NIO（New I/O）就是基于操作系统的非阻塞I/O实现的。</p></div><h3 id="设备管理" tabindex="-1"><a class="header-anchor" href="#设备管理"><span>设备管理</span></a></h3><p>操作系统对设备管理的主要任务：</p><ul><li>设备的分配与回收</li><li>设备驱动程序管理</li><li>设备独立性保证</li></ul><h2 id="linux系统基础" tabindex="-1"><a class="header-anchor" href="#linux系统基础"><span>Linux系统基础</span></a></h2><h3 id="系统调用" tabindex="-1"><a class="header-anchor" href="#系统调用"><span>系统调用</span></a></h3><div class="hint-container info"><p class="hint-container-title">重要的系统调用</p><ul><li><strong>进程控制</strong>：fork、exec、wait等</li><li><strong>文件操作</strong>：open、read、write等</li><li><strong>设备操作</strong>：ioctl等</li><li><strong>信息维护</strong>：getpid、alarm等</li><li><strong>通信</strong>：pipe、shmget等</li></ul><p>Java通过JNI（Java Native Interface）间接使用这些系统调用。</p></div><h3 id="文件权限" tabindex="-1"><a class="header-anchor" href="#文件权限"><span>文件权限</span></a></h3><p>Linux文件权限的基本概念：</p><ul><li>读（r）、写（w）、执行（x）权限</li><li>用户（u）、组（g）、其他（o）的权限分配</li><li>权限的数字表示方式</li></ul><div class="hint-container tip"><p class="hint-container-title">Java开发中的应用</p><ol><li>在部署Java应用时需要正确设置文件权限</li><li>使用<code>java.nio.file.attribute</code>包可以操作文件权限</li><li>容器化部署时需要特别注意权限问题</li></ol></div>',39)]))}const h=l(a,[["render",r],["__file","os.html.vue"]]),p=JSON.parse('{"path":"/theory/cs/os.html","title":"操作系统基础","lang":"en-US","frontmatter":{"order":50,"title":"操作系统基础","description":"操作系统是管理计算机硬件与软件资源的计算机程序，同时也是计算机系统的内核与基石。 进程管理 进程与线程 进程与线程的基本概念 进程（Process）：是操作系统进行资源分配和调度的基本单位，每个进程都有独立的内存空间。 线程（Thread）：是CPU调度和分派的基本单位，线程共享所属进程的资源。 在Java中： 一个JVM实例就是一个进程 Java线程...","head":[["meta",{"property":"og:url","content":"https://x.app/theory/cs/os.html"}],["meta",{"property":"og:site_name","content":"doc"}],["meta",{"property":"og:title","content":"操作系统基础"}],["meta",{"property":"og:description","content":"操作系统是管理计算机硬件与软件资源的计算机程序，同时也是计算机系统的内核与基石。 进程管理 进程与线程 进程与线程的基本概念 进程（Process）：是操作系统进行资源分配和调度的基本单位，每个进程都有独立的内存空间。 线程（Thread）：是CPU调度和分派的基本单位，线程共享所属进程的资源。 在Java中： 一个JVM实例就是一个进程 Java线程..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2025-03-13T01:07:22.000Z"}],["meta",{"property":"article:author","content":"ventixy"}],["meta",{"property":"article:modified_time","content":"2025-03-13T01:07:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"操作系统基础\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-13T01:07:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"ventixy\\",\\"url\\":\\"https://www.ventix.top\\"}]}"]]},"headers":[{"level":2,"title":"进程管理","slug":"进程管理","link":"#进程管理","children":[{"level":3,"title":"进程与线程","slug":"进程与线程","link":"#进程与线程","children":[]},{"level":3,"title":"进程调度","slug":"进程调度","link":"#进程调度","children":[]},{"level":3,"title":"进程通信","slug":"进程通信","link":"#进程通信","children":[]}]},{"level":2,"title":"内存管理","slug":"内存管理","link":"#内存管理","children":[{"level":3,"title":"内存管理基础","slug":"内存管理基础","link":"#内存管理基础","children":[]},{"level":3,"title":"虚拟内存","slug":"虚拟内存","link":"#虚拟内存","children":[]},{"level":3,"title":"页面置换算法","slug":"页面置换算法","link":"#页面置换算法","children":[]}]},{"level":2,"title":"文件系统","slug":"文件系统","link":"#文件系统","children":[{"level":3,"title":"文件管理","slug":"文件管理","link":"#文件管理","children":[]},{"level":3,"title":"磁盘调度","slug":"磁盘调度","link":"#磁盘调度","children":[]}]},{"level":2,"title":"I/O管理","slug":"i-o管理","link":"#i-o管理","children":[{"level":3,"title":"I/O控制方式","slug":"i-o控制方式","link":"#i-o控制方式","children":[]},{"level":3,"title":"设备管理","slug":"设备管理","link":"#设备管理","children":[]}]},{"level":2,"title":"Linux系统基础","slug":"linux系统基础","link":"#linux系统基础","children":[{"level":3,"title":"系统调用","slug":"系统调用","link":"#系统调用","children":[]},{"level":3,"title":"文件权限","slug":"文件权限","link":"#文件权限","children":[]}]}],"git":{"createdTime":1741828042000,"updatedTime":1741828042000,"contributors":[{"name":"drizzle","email":"msdrizzle@outlook.com","commits":1}]},"readingTime":{"minutes":3.56,"words":1067},"filePathRelative":"theory/cs/os.md","localizedDate":"March 13, 2025","excerpt":"<p>操作系统是管理计算机硬件与软件资源的计算机程序，同时也是计算机系统的内核与基石。</p>\\n<h2>进程管理</h2>\\n<h3>进程与线程</h3>\\n<div class=\\"hint-container info\\">\\n<p class=\\"hint-container-title\\">进程与线程的基本概念</p>\\n<ul>\\n<li><strong>进程（Process）</strong>：是操作系统进行资源分配和调度的基本单位，每个进程都有独立的内存空间。</li>\\n<li><strong>线程（Thread）</strong>：是CPU调度和分派的基本单位，线程共享所属进程的资源。</li>\\n</ul>\\n<p>在Java中：</p>\\n<ul>\\n<li>一个JVM实例就是一个进程</li>\\n<li>Java线程是映射到操作系统的原生线程上的</li>\\n<li>通过<code>java.lang.Thread</code>类可以创建和管理线程</li>\\n</ul>\\n</div>","autoDesc":true}');export{h as comp,p as data};

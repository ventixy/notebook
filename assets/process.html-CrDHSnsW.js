import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as t,b as e,o as n}from"./app-CJjIwsM3.js";const r={};function o(a,l){return n(),t("div",null,l[0]||(l[0]=[e('<h2 id="进程与线程" tabindex="-1"><a class="header-anchor" href="#进程与线程"><span>进程与线程</span></a></h2><div class="hint-container info"><p class="hint-container-title">进程与线程的基本概念</p><ul><li><p><strong>进程（Process）</strong>：是操作系统进行资源分配和调度的基本单位，每个进程都有独立的内存空间。进程是一个独立的执行环境，拥有独立的内存空间和系统资源。</p></li><li><p><strong>线程（Thread）</strong>：是CPU调度和分派的基本单位，线程共享所属进程的资源。线程是进程内的一个执行单元，多个线程共享进程的内存空间和资源。</p></li></ul><p>在Java中：</p><ul><li>一个JVM实例就是一个进程</li><li>Java线程是映射到操作系统的原生线程上</li><li>通过<code>java.lang.Thread</code>类可以创建和管理线程</li></ul></div><h3 id="进程的特点" tabindex="-1"><a class="header-anchor" href="#进程的特点"><span>进程的特点</span></a></h3><ul><li>独立性：进程是资源分配的基本单位，每个进程都有独立的地址空间</li><li>动态性：进程是程序的一次执行过程，是动态的</li><li>并发性：多个进程可以并发执行</li><li>异步性：进程按各自独立的、不可预知的速度向前推进</li></ul><h3 id="线程的特点" tabindex="-1"><a class="header-anchor" href="#线程的特点"><span>线程的特点</span></a></h3><ul><li>轻量级：创建和销毁成本低</li><li>共享性：同一进程内的线程共享进程的资源</li><li>并发性：多线程可以并发执行</li><li>灵活性：线程切换开销小</li></ul><h2 id="进程调度" tabindex="-1"><a class="header-anchor" href="#进程调度"><span>进程调度</span></a></h2><div class="hint-container tip"><p class="hint-container-title">常见的进程调度算法</p><ol><li><p><strong>先来先服务（FCFS）</strong></p><ul><li>按照进程到达的先后顺序进行调度</li><li>优点：公平简单</li><li>缺点：对短作业不利</li></ul></li><li><p><strong>短作业优先（SJF）</strong></p><ul><li>优先调度运行时间短的进程</li><li>优点：有利于短作业</li><li>缺点：可能导致长作业饥饿</li></ul></li><li><p><strong>优先级调度</strong></p><ul><li>按照进程的优先级进行调度</li><li>分为抢占式和非抢占式</li><li>Java线程的优先级（1-10）就是基于此实现</li></ul></li><li><p><strong>时间片轮转</strong></p><ul><li>每个进程被分配一个时间片</li><li>时间片用完后被切换到队列末尾</li><li>多线程并发执行的基础</li></ul></li><li><p><strong>多级反馈队列</strong></p><ul><li>结合多个队列的优势</li><li>可以同时兼顾短作业和交互式作业</li></ul></li></ol></div><h2 id="进程间通信" tabindex="-1"><a class="header-anchor" href="#进程间通信"><span>进程间通信</span></a></h2><div class="hint-container info"><p class="hint-container-title">进程间通信（IPC）的主要方式</p><ol><li><p><strong>管道（Pipe）</strong></p><ul><li>半双工通信方式</li><li>数据单向流动</li><li>适用于父子进程间通信</li></ul></li><li><p><strong>命名管道（Named Pipe）</strong></p><ul><li>可以在不相关的进程间通信</li><li>支持多个进程间的通信</li></ul></li><li><p><strong>消息队列（Message Queue）</strong></p><ul><li>消息的链表</li><li>存放在内核中</li><li>消息具有特定的格式</li></ul></li><li><p><strong>共享内存（Shared Memory）</strong></p><ul><li>最快的IPC方式</li><li>多个进程共享同一块内存空间</li><li>需要同步机制配合</li></ul></li><li><p><strong>信号量（Semaphore）</strong></p><ul><li>主要用于进程间同步</li><li>也可用于进程间通信</li></ul></li><li><p><strong>套接字（Socket）</strong></p><ul><li>可用于不同机器间的进程通信</li><li>最为灵活的通信方式</li></ul></li></ol></div><h3 id="同步与互斥" tabindex="-1"><a class="header-anchor" href="#同步与互斥"><span>同步与互斥</span></a></h3><ul><li><strong>互斥</strong>：对共享资源的互斥访问</li><li><strong>同步</strong>：进程间的协调执行关系</li></ul><div class="hint-container tip"><p class="hint-container-title">实现机制</p><ol><li><strong>信号量</strong>：P、V操作</li><li><strong>管程</strong>：封装的互斥访问方法</li><li><strong>条件变量</strong>：等待和通知机制</li></ol></div>',13)]))}const c=i(r,[["render",o],["__file","process.html.vue"]]),d=JSON.parse('{"path":"/theory/cs/process.html","title":"进程管理","lang":"en-US","frontmatter":{"order":60,"title":"进程管理","description":"进程与线程 进程与线程的基本概念 进程（Process）：是操作系统进行资源分配和调度的基本单位，每个进程都有独立的内存空间。进程是一个独立的执行环境，拥有独立的内存空间和系统资源。 线程（Thread）：是CPU调度和分派的基本单位，线程共享所属进程的资源。线程是进程内的一个执行单元，多个线程共享进程的内存空间和资源。 在Java中： 一个JVM实例...","head":[["meta",{"property":"og:url","content":"https://x.app/theory/cs/process.html"}],["meta",{"property":"og:site_name","content":"doc"}],["meta",{"property":"og:title","content":"进程管理"}],["meta",{"property":"og:description","content":"进程与线程 进程与线程的基本概念 进程（Process）：是操作系统进行资源分配和调度的基本单位，每个进程都有独立的内存空间。进程是一个独立的执行环境，拥有独立的内存空间和系统资源。 线程（Thread）：是CPU调度和分派的基本单位，线程共享所属进程的资源。线程是进程内的一个执行单元，多个线程共享进程的内存空间和资源。 在Java中： 一个JVM实例..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2025-03-13T01:07:22.000Z"}],["meta",{"property":"article:author","content":"ventixy"}],["meta",{"property":"article:modified_time","content":"2025-03-13T01:07:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"进程管理\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-13T01:07:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"ventixy\\",\\"url\\":\\"https://www.ventix.top\\"}]}"]]},"headers":[{"level":2,"title":"进程与线程","slug":"进程与线程","link":"#进程与线程","children":[{"level":3,"title":"进程的特点","slug":"进程的特点","link":"#进程的特点","children":[]},{"level":3,"title":"线程的特点","slug":"线程的特点","link":"#线程的特点","children":[]}]},{"level":2,"title":"进程调度","slug":"进程调度","link":"#进程调度","children":[]},{"level":2,"title":"进程间通信","slug":"进程间通信","link":"#进程间通信","children":[{"level":3,"title":"同步与互斥","slug":"同步与互斥","link":"#同步与互斥","children":[]}]}],"git":{"createdTime":1741828042000,"updatedTime":1741828042000,"contributors":[{"name":"drizzle","email":"msdrizzle@outlook.com","commits":1}]},"readingTime":{"minutes":2.6,"words":781},"filePathRelative":"theory/cs/process.md","localizedDate":"March 13, 2025","excerpt":"<h2>进程与线程</h2>\\n<div class=\\"hint-container info\\">\\n<p class=\\"hint-container-title\\">进程与线程的基本概念</p>\\n<ul>\\n<li>\\n<p><strong>进程（Process）</strong>：是操作系统进行资源分配和调度的基本单位，每个进程都有独立的内存空间。进程是一个独立的执行环境，拥有独立的内存空间和系统资源。</p>\\n</li>\\n<li>\\n<p><strong>线程（Thread）</strong>：是CPU调度和分派的基本单位，线程共享所属进程的资源。线程是进程内的一个执行单元，多个线程共享进程的内存空间和资源。</p>\\n</li>\\n</ul>\\n<p>在Java中：</p>\\n<ul>\\n<li>一个JVM实例就是一个进程</li>\\n<li>Java线程是映射到操作系统的原生线程上</li>\\n<li>通过<code>java.lang.Thread</code>类可以创建和管理线程</li>\\n</ul>\\n</div>","autoDesc":true}');export{c as comp,d as data};

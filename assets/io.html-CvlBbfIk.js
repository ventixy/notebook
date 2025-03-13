import{_ as l}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as t,b as n,o as e}from"./app-CJjIwsM3.js";const o={};function r(s,i){return e(),t("div",null,i[0]||(i[0]=[n('<h2 id="文件系统" tabindex="-1"><a class="header-anchor" href="#文件系统"><span>文件系统</span></a></h2><div class="hint-container info"><p class="hint-container-title">文件系统的基本概念</p><ul><li><strong>文件</strong>：是对磁盘等外部存储介质上数据的逻辑抽象</li><li><strong>文件系统</strong>：负责管理和存储文件的系统软件</li><li><strong>目录</strong>：由文件索引项组成的特殊文件</li></ul><p>文件系统的主要功能：</p><ol><li>文件的存储、检索和修改</li><li>文件的共享和保护</li><li>文件的命名和组织</li><li>提供用户接口</li></ol></div><h3 id="文件管理" tabindex="-1"><a class="header-anchor" href="#文件管理"><span>文件管理</span></a></h3><div class="hint-container tip"><p class="hint-container-title">文件的基本操作</p><ol><li><p><strong>创建文件</strong></p><ul><li>申请目录项</li><li>分配存储空间</li></ul></li><li><p><strong>读写文件</strong></p><ul><li>顺序访问</li><li>随机访问</li></ul></li><li><p><strong>删除文件</strong></p><ul><li>释放目录项</li><li>回收存储空间</li></ul></li><li><p><strong>文件保护</strong></p><ul><li>访问控制列表（ACL）</li><li>用户权限管理</li></ul></li></ol></div><h3 id="目录管理" tabindex="-1"><a class="header-anchor" href="#目录管理"><span>目录管理</span></a></h3><div class="hint-container info"><p class="hint-container-title">目录结构</p><ol><li><strong>单级目录</strong>：所有文件在同一目录下</li><li><strong>两级目录</strong>：区分系统文件和用户文件</li><li><strong>树形目录</strong>：现代操作系统普遍采用</li><li><strong>图形目录</strong>：允许文件共享的目录结构</li></ol></div><h3 id="磁盘调度" tabindex="-1"><a class="header-anchor" href="#磁盘调度"><span>磁盘调度</span></a></h3><div class="hint-container tip"><p class="hint-container-title">常见的磁盘调度算法</p><ol><li><p><strong>先来先服务（FCFS）</strong></p><ul><li>按照请求到达的顺序进行调度</li><li>公平但性能不佳</li></ul></li><li><p><strong>最短寻道时间优先（SSTF）</strong></p><ul><li>优先处理距当前磁头最近的请求</li><li>可能导致饥饿现象</li></ul></li><li><p><strong>扫描算法（SCAN）</strong></p><ul><li>电梯算法</li><li>磁头沿一个方向移动直到没有请求</li></ul></li><li><p><strong>循环扫描（C-SCAN）</strong></p><ul><li>单向扫描</li><li>返回时直接移动到起始位置</li></ul></li></ol></div><h2 id="i-o管理" tabindex="-1"><a class="header-anchor" href="#i-o管理"><span>I/O管理</span></a></h2><div class="hint-container info"><p class="hint-container-title">I/O管理的基本功能</p><ol><li><p><strong>设备管理</strong></p><ul><li>设备的分配与回收</li><li>设备的启动与控制</li></ul></li><li><p><strong>缓冲管理</strong></p><ul><li>减少CPU和I/O设备速度不匹配的影响</li><li>提高系统的并发度</li></ul></li><li><p><strong>设备驱动程序</strong></p><ul><li>实现设备的具体操作</li><li>提供统一的设备接口</li></ul></li></ol></div><h3 id="i-o控制方式" tabindex="-1"><a class="header-anchor" href="#i-o控制方式"><span>I/O控制方式</span></a></h3><div class="hint-container tip"><p class="hint-container-title">主要的I/O控制方式</p><ol><li><p><strong>程序直接控制</strong></p><ul><li>CPU轮询检查I/O设备状态</li><li>适用于简单的I/O操作</li></ul></li><li><p><strong>中断驱动方式</strong></p><ul><li>I/O完成时通过中断通知CPU</li><li>减少CPU等待时间</li></ul></li><li><p><strong>DMA方式</strong></p><ul><li>直接内存访问</li><li>数据传输不需要CPU干预</li></ul></li><li><p><strong>通道方式</strong></p><ul><li>专门的I/O处理器</li><li>实现I/O操作的并行处理</li></ul></li></ol></div>',12)]))}const c=l(o,[["render",r],["__file","io.html.vue"]]),h=JSON.parse('{"path":"/theory/cs/io.html","title":"文件与IO管理","lang":"en-US","frontmatter":{"order":80,"title":"文件与IO管理","description":"文件系统 文件系统的基本概念 文件：是对磁盘等外部存储介质上数据的逻辑抽象 文件系统：负责管理和存储文件的系统软件 目录：由文件索引项组成的特殊文件 文件系统的主要功能： 文件的存储、检索和修改 文件的共享和保护 文件的命名和组织 提供用户接口 文件管理 文件的基本操作 创建文件 申请目录项 分配存储空间 读写文件 顺序访问 随机访问 删除文件 释放目...","head":[["meta",{"property":"og:url","content":"https://x.app/theory/cs/io.html"}],["meta",{"property":"og:site_name","content":"doc"}],["meta",{"property":"og:title","content":"文件与IO管理"}],["meta",{"property":"og:description","content":"文件系统 文件系统的基本概念 文件：是对磁盘等外部存储介质上数据的逻辑抽象 文件系统：负责管理和存储文件的系统软件 目录：由文件索引项组成的特殊文件 文件系统的主要功能： 文件的存储、检索和修改 文件的共享和保护 文件的命名和组织 提供用户接口 文件管理 文件的基本操作 创建文件 申请目录项 分配存储空间 读写文件 顺序访问 随机访问 删除文件 释放目..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2025-03-13T01:07:22.000Z"}],["meta",{"property":"article:author","content":"ventixy"}],["meta",{"property":"article:modified_time","content":"2025-03-13T01:07:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"文件与IO管理\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-13T01:07:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"ventixy\\",\\"url\\":\\"https://www.ventix.top\\"}]}"]]},"headers":[{"level":2,"title":"文件系统","slug":"文件系统","link":"#文件系统","children":[{"level":3,"title":"文件管理","slug":"文件管理","link":"#文件管理","children":[]},{"level":3,"title":"目录管理","slug":"目录管理","link":"#目录管理","children":[]},{"level":3,"title":"磁盘调度","slug":"磁盘调度","link":"#磁盘调度","children":[]}]},{"level":2,"title":"I/O管理","slug":"i-o管理","link":"#i-o管理","children":[{"level":3,"title":"I/O控制方式","slug":"i-o控制方式","link":"#i-o控制方式","children":[]}]}],"git":{"createdTime":1741828042000,"updatedTime":1741828042000,"contributors":[{"name":"drizzle","email":"msdrizzle@outlook.com","commits":1}]},"readingTime":{"minutes":1.94,"words":582},"filePathRelative":"theory/cs/io.md","localizedDate":"March 13, 2025","excerpt":"<h2>文件系统</h2>\\n<div class=\\"hint-container info\\">\\n<p class=\\"hint-container-title\\">文件系统的基本概念</p>\\n<ul>\\n<li><strong>文件</strong>：是对磁盘等外部存储介质上数据的逻辑抽象</li>\\n<li><strong>文件系统</strong>：负责管理和存储文件的系统软件</li>\\n<li><strong>目录</strong>：由文件索引项组成的特殊文件</li>\\n</ul>\\n<p>文件系统的主要功能：</p>\\n<ol>\\n<li>文件的存储、检索和修改</li>\\n<li>文件的共享和保护</li>\\n<li>文件的命名和组织</li>\\n<li>提供用户接口</li>\\n</ol>\\n</div>","autoDesc":true}');export{c as comp,h as data};

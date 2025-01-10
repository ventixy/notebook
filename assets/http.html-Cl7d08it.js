import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,b as s,d as t,o as l,r}from"./app-CEu6_qkY.js";const p={};function h(d,i){const e=r("Mermaid");return l(),a("div",null,[i[0]||(i[0]=s('<h2 id="http协议及网络" tabindex="-1"><a class="header-anchor" href="#http协议及网络"><span>HTTP协议及网络</span></a></h2><h3 id="网络模型-分层" tabindex="-1"><a class="header-anchor" href="#网络模型-分层"><span>网络模型(分层)</span></a></h3><ul><li><p>OSI(Open System Interaction)七层模型：将网络分为7层；</p></li><li><p>TCP/IP 模型 ： 将网络分为5层（4层）</p></li></ul><figure><img src="https://image.ventix.top/java/image-20220406222111262.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>分层是逻辑上面的概念</strong>，并不是指的是物理网络中被拆分了若干层。</p><div class="hint-container info"><p class="hint-container-title">为什么要分层？</p><p>目的主要是为了解耦。比如传输层有TCP、UDP两种传输方式。</p><p>分层最大的好处就是今后如果希望将传输方式从TCP转换成UDP，只需要变更传输层即可，其他层不需要变化</p></div><h3 id="http协议介绍" tabindex="-1"><a class="header-anchor" href="#http协议介绍"><span>HTTP协议介绍</span></a></h3><p><strong>如果希望客户端和服务器之间能够进行正常的通讯，双方在传递数据时只需要遵守固定的格式即可</strong> 这个格式其实就是<strong>协议</strong>。</p><p>HTTP协议：客户端和服务器在进行通讯时，发送的HTTP请求和响应应当具有的特定的格式。</p><div class="hint-container info"><p class="hint-container-title">HTTP的诞生：HTTP和HTML</p><p>HTTP:Hyper Text Transfer Protocol.</p><p>HTML:Hyper Text Markup Language.</p><p>html、http均是由同一个人发明的。tim berners lee。科研人员。做实验、写论文、做分享、听分享</p><p>论文如何排版？html</p><p>论文如何传输给其他人？http</p><p>http诞生之初主要就是为了传递html的。</p></div><p>超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是⼀种⽤于分布式、协作式和 超媒体信息系统的<strong>应用层协议</strong> （TCP/UDP为运输层协议）</p><table><thead><tr><th>HTTP请求方法</th><th>描述</th></tr></thead><tbody><tr><td>GET</td><td>向指定的资源发出“显示”请求、使用GET方法应该只用在读取数据</td></tr><tr><td>HEAD</td><td>同上、但只获取其中“关于该资源的信息”（元信息或称元数据）</td></tr><tr><td>POST</td><td>向指定资源提交数据，请求服务器进行处理（例如提交表单或者上传⽂件）</td></tr><tr><td>PUT</td><td>向指定资源位置上传其最新内容</td></tr><tr><td>DELETE</td><td>请求服务器删除 Request-URI 所标识的资源</td></tr><tr><td>TRACE</td><td>回显服务器收到的请求，主要⽤于测试或诊断</td></tr><tr><td>OPTIONS</td><td>使服务器传回该资源所⽀持的所有HTTP请求⽅法</td></tr></tbody></table><br><h3 id="tcp三次握手" tabindex="-1"><a class="header-anchor" href="#tcp三次握手"><span>TCP三次握手</span></a></h3><p>当客户端想要通过HTTP从服务器获取资源时，首先需要通过TCP建立连接，然后才能发送HTTP请求并接收响应。具体步骤如下：</p><ol><li><strong>TCP连接建立</strong>：客户端和服务器之间通过三次握手建立TCP连接。</li><li><strong>HTTP请求</strong>：一旦TCP连接建立成功，客户端就可以通过该连接发送HTTP请求给服务器。</li><li><strong>HTTP响应</strong>：服务器处理完HTTP请求后，通过同一TCP连接返回HTTP响应给客户端。</li><li><strong>关闭TCP连接</strong>：在某些情况下，比如HTTP/1.0中的非持久连接或者HTTP/1.1中的显式关闭连接（通过<code>Connection: close</code>头），客户端和服务器会在数据交换完成后关闭TCP连接。</li></ol><p>需要注意的是，在HTTP/1.1中默认启用了持久连接（Persistent Connections），这意味着客户端和服务器之间的TCP连接可以保持打开状态，并用于多个HTTP请求。而HTTP/2和HTTP/3进一步改进了这种机制，使用单一的TCP连接来处理多个并发请求，从而提高了效率。</p><p>TCP（传输控制协议）是一种面向连接的、可靠的、基于字节流的传输层通信协议。在发送数据之前，TCP需要先建立连接，这个过程被称为“三次握手”。</p>',18)),t(e,{id:"mermaid-169",code:"eJwrTi0sTc1LTnXJTEwvSszlUgAC55zM1LwSXTu74NSistQiK4XgSD8NoELbCk2wPEQYKA9RCJbXdnT2Bqup1FFITM62rdA2hCjGMAykEKSiEqYiL78kVSEfKAdVqwNT6Zyfl5eaXJKZn6eQWlySmJSTWZyRmsIFAMJZOQw="}),i[1]||(i[1]=s(`<div class="hint-container info"><p class="hint-container-title">TCP三次握手过程</p><ol><li><strong>第一次握手（SYN请求）</strong>：客户端向服务器发送一个带有SYN标志的数据包，请求建立连接。</li><li><strong>第二次握手（SYN+ACK确认）</strong>：服务器收到客户端的SYN包后，会回应一个带有SYN和ACK标志的数据包。</li><li><strong>第三次握手（ACK确认）</strong>：客户端收到服务器的SYN+ACK后，会发送一个带有ACK标志的数据包确认连接建立完成。</li></ol></div><p>三次握手完成，客户端和服务器之间的连接建立成功。</p><ul><li>进行三次握手，即建立一个可靠的TCP连接。</li><li>访问网站时，<strong>一般都是使用TCP</strong>，游戏中一般使用UDP。</li><li>TCP连接建立之后，其实就是形成了一个socket。</li></ul><h3 id="http工作流程" tabindex="-1"><a class="header-anchor" href="#http工作流程"><span>HTTP工作流程</span></a></h3><div class="hint-container info"><p class="hint-container-title">整个访问流程</p><p>1.用户在浏览器地址栏输入对应的网络地址，首先进行域名解析（浏览器缓存、操作系统缓存、hosts文件、DNS服务器）</p><p>2.进行TCP三次握手，建立TCP连接</p><p>3.浏览器会帮助用户生成HTTP请求，首先向下经过TCP（拆包、加上tcp头部），经过ip层，加上ip头部标签</p><p>4.再次向下经过链路层，网卡从客户端机器出去，在网络中中转传输，到达服务器主机机器</p><p>5.到达服务器网络层，将数据包的ip头部去掉，经过tcp层，将tcp头部去掉，并且同时将数据包进行合并，到达应用层之后，取出里面的请求报文，加以解析（能够正常进行解析的前提是通讯双方遵守同样的格式、准则），识别出客户端需要请求的资源，对其做出响应，主要是生成HTTP响应，将文件的内容写入到响应中。</p><p>6.HTTP响应经过tcp，进行拆包，加上tcp头部标签，经过ip，加上ip头部标签，经由链路层出去，在网络中中转传输，到达客户端机器</p><p>7.客户端机器接收到数据之后，经由链路层进入主机，经过ip，脱去ip标签、经过网络层、脱去tcp标签，同时进行合并数据包，合并之后，得到完整的HTTP响应</p><p>8.浏览器拿到HTTP响应之后，对其进行解析（双方同样遵守着一个原则），浏览器取出HTML部分进行解析，如果此时遇到了css标签、js标签、img标签等，此时会自行再次往对应的地址去发起新的HTTP请求，整个过程和上述完全一致........</p><p>9.当浏览器拿到了当前页面所需要的全部资源时，将页面进行渲染，将完整的页面呈现在用户的面前。</p></div><p><strong>域名解析</strong>（把字符变成ip地址）</p><figure><img src="https://image.ventix.top/java/image-20220406223751075.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>其中有一个常识性知识：<code>127.0.0.1</code> , <code>localhost</code> 永远指向的是本机。</p><div class="hint-container info"><p class="hint-container-title">HTTP 请求/响应的步骤：</p><ol><li><p>客户端（浏览器）连接到Web服务器：与Web服务器的HTTP端⼝（默认为80）建立⼀个TCP Socket连接</p></li><li><p>发送HTTP请求：客户端通过socket向Web服务器发送⼀个请求报文（由请求行、请求头部、 空⾏和请求数据4部分组成）</p></li><li><p>服务器接受请求并返回HTTP响应：Web服务器解析请求、同样通过socket响应数据到客户端</p></li><li><p>释放TCP连接：</p><p>在HTTP/1.0中默认使⽤短连接（每次HTTP操作均建立一次连接、任务结束就中断连接）</p><p>从HTTP/1.1起，默认使用长连接，用以保持一段时间的连接</p><p>HTTP协议的长连接和短连接，实质上是TCP协议的长连接和短连接</p></li><li><p>客户端浏览器解析HTML内容：客户端浏览器读取响应数据HTML，根据HTML的语法 对其进行格式化，并在浏览器窗口中显示</p><p>客户端浏览器⾸先解析状态行，查看表明请求是否成功的状态代码</p><p>然后解析每⼀个响应头，响应头告 知以下为若干字节的HTML文档和文档的字符集</p></li></ol></div><h2 id="http请求报文" tabindex="-1"><a class="header-anchor" href="#http请求报文"><span>HTTP请求报文</span></a></h2><p>一般情况下，客户端发送的HTTP请求，以及服务器返回的HTTP响应，一般情况下，我们也称之为HTTP请求报文、HTTP响应报文</p><div class="hint-container info"><p class="hint-container-title">抓取HTTP报文</p><p>抓取HTTP报文通常使用网络分析工具，如Wireshark、Fiddler或Chrome DevTools等。</p></div><h3 id="请求报文格式" tabindex="-1"><a class="header-anchor" href="#请求报文格式"><span>请求报文格式</span></a></h3><p>HTTP请求报文是客户端（通常是Web浏览器）与服务器之间通信的基础。主要由三个部分组成：</p><ol><li><strong>请求行</strong> (Request Line)</li><li><strong>请求头</strong> (Request Headers)</li><li><strong>请求正文</strong> (Request Body)</li></ol><figure><img src="https://image.ventix.top/java/image-20220407104919963.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="hint-container info"><p class="hint-container-title">HTTP请求报文格式</p><h4 id="请求行" tabindex="-1"><a class="header-anchor" href="#请求行"><span>请求行</span></a></h4><p>请求行包含三个字段：请求方法、请求URI和HTTP版本。</p><ul><li><strong>请求方法</strong>：GET、POST、PUT、DELETE等。</li><li><strong>请求URI</strong>：请求的资源标识符。</li><li><strong>HTTP版本</strong>：如HTTP/1.1。</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>GET /index.html HTTP/1.1</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="请求头" tabindex="-1"><a class="header-anchor" href="#请求头"><span>请求头</span></a></h4><p>请求头包含了客户端向服务器发送的各种信息，例如客户端类型、接受的内容类型、认证信息等。</p><ul><li><strong>通用头部</strong> (General Headers)：适用于任何HTTP消息。</li><li><strong>请求头部</strong> (Request Headers)：客户端向服务器发送的信息。</li><li><strong>实体头部</strong> (Entity Headers)：与实体主体相关的元信息。</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Host: www.example.com</span></span>
<span class="line"><span>User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3</span></span>
<span class="line"><span>Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="请求正文" tabindex="-1"><a class="header-anchor" href="#请求正文"><span>请求正文</span></a></h4><p>请求正文中包含了要发送给服务器的数据，主要在POST、PUT等请求中使用。也可用来传输大量的数据，比如文件上传。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>username=johndoe&amp;password=secretpassword</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></div><h3 id="请求头信息" tabindex="-1"><a class="header-anchor" href="#请求头信息"><span>请求头信息</span></a></h3><p>请求头（Request Headers）在HTTP请求中扮演着非常重要的角色，它们提供了客户端与服务器之间通信所需的额外信息。</p><div class="hint-container info"><p class="hint-container-title">常见的请求头及应用场景</p><h4 id="_1-accept" tabindex="-1"><a class="header-anchor" href="#_1-accept"><span>1. Accept</span></a></h4><ul><li><strong>定义</strong>：客户端可以接受的MIME类型。MIME类型用于定义Internet上文件的格式，采用大类型/小类型的形式，例如 <code>text/html</code> 表示HTML文档。</li><li>客户端可以通过这个头告诉服务器它可以接受哪些类型的资源。例如，一个请求可能只接受HTML文档或JSON数据。服务器可以根据这个头来确定应该返回哪种类型的响应。<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Accept: text/html, application/xhtml+xml, */*</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ul><h4 id="_2-accept-charset" tabindex="-1"><a class="header-anchor" href="#_2-accept-charset"><span>2. Accept-Charset</span></a></h4><ul><li><strong>定义</strong>：客户端可以接受的字符集。字符集指定了如何表示文本数据。</li><li>如果服务器支持多种字符集，它可以根据这个头来选择合适的字符集。<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Accept-Charset: utf-8, iso-8859-1; q=0.5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ul><h4 id="_3-accept-encoding" tabindex="-1"><a class="header-anchor" href="#_3-accept-encoding"><span>3. Accept-Encoding</span></a></h4><ul><li><strong>定义</strong>：客户端能够解码的数据编码方式，例如gzip、deflate等。</li><li>服务器可以使用客户端支持的编码方式来压缩响应数据，减少传输带宽。<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Accept-Encoding: gzip, deflate, br</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ul><h4 id="_4-accept-language" tabindex="-1"><a class="header-anchor" href="#_4-accept-language"><span>4. Accept-Language</span></a></h4><ul><li><strong>定义</strong>：客户端首选的语言种类。</li><li>当服务器支持多语言版本时，可以根据这个头来返回相应的语言版本。<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Accept-Language: en-US, en;q=0.5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ul><h4 id="_5-host" tabindex="-1"><a class="header-anchor" href="#_5-host"><span>5. Host</span></a></h4><ul><li><strong>定义</strong>：请求的目标主机名和端口号。</li><li>必须包含在每个HTTP请求中，用于指示服务器应该为哪个域名服务。<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Host: www.example.com</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ul><h4 id="_6-referer" tabindex="-1"><a class="header-anchor" href="#_6-referer"><span>6. Referer</span></a></h4><ul><li><strong>定义</strong>：包含一个URL，表明客户端是从哪个页面链接过来的。</li><li><strong>应用场景</strong>： <ul><li>服务器可以通过这个头来跟踪用户的来源页面。</li><li>可以用于防盗链，即防止其他网站直接链接到你的资源。<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Referer: http://www.example.com/page1.html</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ul></li></ul></div><p><strong>直接访问与通过链接访问的区别</strong>:</p><p>当用户直接访问一个页面（例如直接在地址栏输入URL访问2.html）与通过另一个页面上的链接访问该页面时，HTTP请求报文的主要区别在于<code>Referer</code>头的存在与否。</p><ul><li><p><strong>直接访问</strong>：用户直接在地址栏输入URL或通过书签访问2.html。HTTP请求报文通常不会包含<code>Referer</code>头。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>GET /2.html HTTP/1.1</span></span>
<span class="line"><span>Host: www.example.com</span></span>
<span class="line"><span>User-Agent: Mozilla/5.0 ...</span></span>
<span class="line"><span>Accept: text/html,application/xhtml+xml,...</span></span>
<span class="line"><span>Accept-Language: en-US,en;q=0.5</span></span>
<span class="line"><span>Accept-Encoding: gzip, deflate, br</span></span>
<span class="line"><span>Connection: keep-alive</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>通过链接访问</strong>：用户通过1.html中的链接点击访问2.html。HTTP请求报文会包含<code>Referer</code>头，指示用户是从哪个页面过来的。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>GET /2.html HTTP/1.1</span></span>
<span class="line"><span>Host: www.example.com</span></span>
<span class="line"><span>User-Agent: Mozilla/5.0 ...</span></span>
<span class="line"><span>Accept: text/html,application/xhtml+xml,...</span></span>
<span class="line"><span>Accept-Language: en-US,en;q=0.5</span></span>
<span class="line"><span>Accept-Encoding: gzip, deflate, br</span></span>
<span class="line"><span>Referer: http://www.example.com/1.html</span></span>
<span class="line"><span>Connection: keep-alive</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><p>总结来说，<code>Referer</code>头的存在与否可以帮助服务器了解用户的来源，这对于统计分析和防盗链等用途非常重要。</p><h3 id="http协议版本" tabindex="-1"><a class="header-anchor" href="#http协议版本"><span>HTTP协议版本</span></a></h3><p>HTTP协议发展历程：0.9、1.0、1.1版本（HTTP/1.1）</p><p><strong>1.0和1.1版本之间最大的区别在于一个TCP连接内是否允许发送多个HTTP请求</strong></p><ul><li><p><strong>在1.0版本，一个TCP连接内，只允许发送一个HTTP请求</strong></p></li><li><p><strong>在1.1版本，一个TCP连接内，可以发送多个HTTP请求，也就是我们所说的支持长连接。</strong></p></li></ul><h3 id="get与post" tabindex="-1"><a class="header-anchor" href="#get与post"><span>GET与POST</span></a></h3><p><strong>GET</strong> 和 <strong>POST</strong> 是两种最常用的HTTP请求方法，它们的主要区别是<mark>语义</mark>的区别，<strong>GET的语义是获取数据，POST的语义是提交数据</strong>。</p><div class="hint-container info"><p class="hint-container-title">get和post请求的区别</p><h4 id="_1-http规范-语义的区别" tabindex="-1"><a class="header-anchor" href="#_1-http规范-语义的区别"><span>1 HTTP规范（语义的区别）</span></a></h4><ul><li>GET 请求用来获取数据，指定的资源经服务器端解析后返回响应内容。</li><li>POST 请求用来提交数据，请求服务器进行处理（例如提交表单或者上传文件）。数据被包含在请求体中。</li></ul><h4 id="_2-请求参数位置-习惯性做法" tabindex="-1"><a class="header-anchor" href="#_2-请求参数位置-习惯性做法"><span>2 请求参数位置（习惯性做法）</span></a></h4><ul><li><strong>GET</strong> 请求的参数通常会被附加在URL后面，使用问号（<code>?</code>）分隔URL和参数，参数之间使用<code>&amp;</code>符号连接。</li><li><strong>POST</strong> 方法将参数放在请求体中。</li></ul><p>HTTP规范并没有明确要求GET和POST请求参数必须放置在哪里，这种习惯性做法并不是HTTP规范强制要求的，而是由于历史原因和技术实践逐渐形成的，更多的是出于实际应用的需求和约定俗成的做法。</p><h4 id="_3-浏览器行为" tabindex="-1"><a class="header-anchor" href="#_3-浏览器行为"><span>3 浏览器行为</span></a></h4><ul><li><strong>GET</strong> 请求的URL长度有限制（虽然这取决于浏览器，但一般不超过2048个字符），而 <strong>POST</strong> 请求没有此限制。</li><li><strong>GET</strong> 请求可以被浏览器缓存，而 <strong>POST</strong> 请求不会被缓存。</li><li><strong>GET</strong> 请求可以被收藏，而 <strong>POST</strong> 请求通常不能被直接收藏。</li></ul></div><p>在实际应用中，你甚至可以在POST请求中通过URL参数传递数据，或者在GET请求中将数据放在请求体中。然而，这样做可能会导致一些问题，比如浏览器可能无法正确处理，或者不符合API设计的最佳实践。</p><h2 id="http响应报文" tabindex="-1"><a class="header-anchor" href="#http响应报文"><span>HTTP响应报文</span></a></h2><p>HTTP响应报文是服务器对客户端请求的回复，它同样由几个部分组成：状态行、响应头、空行和响应正文。抓取HTTP响应报文的方法与抓取请求报文类似，可以使用各种网络分析工具，如Wireshark、Fiddler或Chrome DevTools等。</p><h3 id="响应报文格式" tabindex="-1"><a class="header-anchor" href="#响应报文格式"><span>响应报文格式</span></a></h3><p>HTTP响应报文由以下几部分组成：</p><ol><li><strong>状态行</strong> (Status Line)</li><li><strong>响应头</strong> (Response Headers)</li><li><strong>空行</strong> (Empty Line)</li><li><strong>响应正文</strong> (Response Body)</li></ol><div class="hint-container info"><p class="hint-container-title">响应报文格式</p><h4 id="_1-状态行" tabindex="-1"><a class="header-anchor" href="#_1-状态行"><span>1. 状态行</span></a></h4><p>状态行包含HTTP版本、状态码和状态消息。</p><ul><li><strong>HTTP版本</strong>：如HTTP/1.1。</li><li><strong>状态码</strong>：三位数字，表示响应的状态。</li><li><strong>状态消息</strong>：描述状态码的文字信息，例如&quot;OK&quot;。</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>HTTP/1.1 200 OK</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="_2-响应头" tabindex="-1"><a class="header-anchor" href="#_2-响应头"><span>2. 响应头</span></a></h4><p>响应头包含了服务器发送给客户端的额外信息，包括但不限于：</p><ul><li><strong>通用头部</strong> (General Headers)：适用于任何HTTP消息。</li><li><strong>响应头部</strong> (Response Headers)：服务器向客户端发送的信息。</li><li><strong>实体头部</strong> (Entity Headers)：与实体主体相关的元信息。</li></ul><p>常见的响应头包括：</p><ul><li><strong>Content-Type</strong>：指定响应正文的MIME类型。</li><li><strong>Content-Length</strong>：指定响应正文的长度。</li><li><strong>Date</strong>：服务器生成响应的日期和时间。</li><li><strong>Server</strong>：服务器软件的信息。</li><li><strong>Cache-Control</strong>：指示响应是否可缓存及其缓存策略。</li><li><strong>Expires</strong>：指定响应何时过期。</li><li><strong>Set-Cookie</strong>：设置或修改客户端的Cookie。</li><li><strong>Location</strong>：用于重定向的情况，指定新的资源位置。</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Content-Type: text/html; charset=UTF-8</span></span>
<span class="line"><span>Content-Length: 1234</span></span>
<span class="line"><span>Date: Thu, 01 Aug 2024 12:00:00 GMT</span></span>
<span class="line"><span>Server: Apache/2.4.41 (Ubuntu)</span></span>
<span class="line"><span>Cache-Control: max-age=3600</span></span>
<span class="line"><span>Expires: Thu, 01 Aug 2024 13:00:00 GMT</span></span>
<span class="line"><span>Set-Cookie: sessionid=abc123; expires=Thu, 01-Aug-2024 12:00:00 GMT; path=/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-空行" tabindex="-1"><a class="header-anchor" href="#_3-空行"><span>3. 空行</span></a></h4><p>空行用于分隔响应头和响应正文。</p><h4 id="_4-响应正文" tabindex="-1"><a class="header-anchor" href="#_4-响应正文"><span>4. 响应正文</span></a></h4><p>响应正文包含了服务器发送给客户端的实际数据，例如HTML文档、图片、JSON数据等。</p><p>示例：</p><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;!</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">DOCTYPE</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> html</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">html</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">head</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">title</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;Example Page&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">title</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">head</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">body</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">h1</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;Hello, World!&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">h1</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">p</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;This is an example page.&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">p</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">body</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">html</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div><h3 id="常见的状态码" tabindex="-1"><a class="header-anchor" href="#常见的状态码"><span>常见的状态码</span></a></h3><p>HTTP状态码用于表示服务器响应的状态，分为五类：</p><ul><li><strong>1xx</strong>：信息性状态码，表示请求已被接收，继续处理。</li><li><strong>2xx</strong>：成功状态码，表示请求已成功被服务器接收、理解，并接受。</li><li><strong>3xx</strong>：重定向状态码，表示需要客户端采取进一步的操作才能完成请求。</li><li><strong>4xx</strong>：客户端错误状态码，表示请求中有语法错误或请求无法被服务器所理解。</li><li><strong>5xx</strong>：服务器错误状态码，表示服务器遇到了一个未曾预料的情况，无法完成对请求的处理。</li></ul><div class="hint-container tip"><p class="hint-container-title">常见状态码举例：</p><ul><li><strong>200 OK</strong>：请求成功。</li><li><strong>201 Created</strong>：创建了一个新资源。</li><li><strong>301 Moved Permanently</strong>：资源永久移动到了新位置。</li><li><strong>302 Found (临时重定向)</strong>：资源暂时移动到了新位置。</li><li><strong>400 Bad Request</strong>：客户端请求有语法错误或无法被服务器理解。</li><li><strong>401 Unauthorized</strong>：请求未授权。</li><li><strong>403 Forbidden</strong>：请求被拒绝。</li><li><strong>404 Not Found</strong>：请求的资源不存在。</li><li><strong>500 Internal Server Error</strong>：服务器遇到内部错误。</li><li><strong>503 Service Unavailable</strong>：服务器目前无法使用（可能是过载或停机维护）。</li></ul></div><h2 id="https协议简介" tabindex="-1"><a class="header-anchor" href="#https协议简介"><span>HTTPS协议简介</span></a></h2><p>HTTPS协议是HTTP协议的安全版本，它通过在HTTP之上使用SSL/TLS协议来保护通信内容的安全性。</p><h3 id="https概述" tabindex="-1"><a class="header-anchor" href="#https概述"><span>HTTPS概述</span></a></h3><p>HTTPS（Hypertext Transfer Protocol Secure）是一种安全的HTTP协议，它使用SSL/TLS协议来确保数据传输的安全性。SSL（Secure Sockets Layer）是早期的安全协议，而TLS（Transport Layer Security）是SSL的后继者，提供了更高级别的安全性。</p><p>当客户端尝试访问一个HTTPS网站时，会经历以下几个步骤：</p><ol><li><strong>握手阶段</strong>：客户端与服务器之间进行SSL/TLS握手过程，确定加密算法并交换必要的证书。</li><li><strong>证书验证</strong>：客户端验证服务器证书的有效性。</li><li><strong>密钥交换</strong>：客户端使用服务器的公钥加密一个随机生成的对称密钥，并发送给服务器。</li><li><strong>数据传输</strong>：一旦建立了加密通道，所有的数据都将使用这个对称密钥进行加密和解密。</li></ol><p>HTTPS协议通过SSL/TLS提供的加密和认证机制来保护通信的安全性。它利用混合加密技术来提高加密效率，并通过数字证书确保服务器的身份可信。此外，HTTPS还提供了数据完整性的校验，确保数据在传输过程中不被篡改。这些机制共同构成了HTTPS协议的基础，使得互联网上的敏感信息能够安全地传输。</p><h3 id="https加密机制" tabindex="-1"><a class="header-anchor" href="#https加密机制"><span>HTTPS加密机制</span></a></h3><p>HTTPS协议使用了多种加密技术来保证数据的安全传输，主要包括对称加密、非对称加密和混合加密。</p><div class="hint-container info"><p class="hint-container-title">对称加密与非对称加密</p><h4 id="对称加密" tabindex="-1"><a class="header-anchor" href="#对称加密"><span>对称加密</span></a></h4><p>对称加密使用同一个密钥进行加密和解密，效率高但密钥管理困难。在HTTPS中，对称加密主要用于加密大量的数据传输，因为它的速度较快。</p><h4 id="非对称加密" tabindex="-1"><a class="header-anchor" href="#非对称加密"><span>非对称加密</span></a></h4><p>非对称加密使用一对公钥和私钥，公钥可以公开，私钥则必须保密。数据使用公钥加密后只能使用对应的私钥解密。非对称加密的安全性很高，但是计算成本较高，不适合加密大量数据。</p></div><p>HTTPS使用<mark>混合加密</mark>来结合对称加密和非对称加密的优点。具体流程如下：</p><ol><li><strong>建立连接</strong>：客户端向服务器发起HTTPS连接请求。</li><li><strong>交换公钥</strong>：服务器将自己的公钥发送给客户端。</li><li><strong>生成会话密钥</strong>：客户端使用服务器的公钥加密一个随机生成的对称密钥（会话密钥），然后发送给服务器。</li><li><strong>加密数据传输</strong>：服务器收到会话密钥后，使用自己的私钥解密得到会话密钥，之后所有数据都使用这个会话密钥进行对称加密和解密。</li></ol><h3 id="数字证书" tabindex="-1"><a class="header-anchor" href="#数字证书"><span>数字证书</span></a></h3><p>为了验证服务器的身份，HTTPS使用数字证书来确保客户端与正确的服务器进行通信。数字证书通常包含以下信息：</p><ul><li>服务器的身份信息。</li><li>发行该证书的认证机构（CA）。</li><li>公钥。</li><li>有效期。</li><li>CA的数字签名。</li></ul><div class="hint-container info"><p class="hint-container-title">证书的颁发</p><h4 id="证书的颁发" tabindex="-1"><a class="header-anchor" href="#证书的颁发"><span>证书的颁发</span></a></h4><ol><li><strong>证书申请</strong>：服务器管理员向认证机构（CA）提交证书签名请求（CSR）。</li><li><strong>身份验证</strong>：CA验证服务器的身份。</li><li><strong>证书颁发</strong>：CA颁发数字证书。</li><li><strong>安装证书</strong>：服务器安装证书。</li></ol><h4 id="证书链" tabindex="-1"><a class="header-anchor" href="#证书链"><span>证书链</span></a></h4><p>证书链是指从服务器的证书到信任根证书的一系列证书。客户端可以通过验证证书链中的每个证书的签名来确认最终服务器证书的有效性。</p></div><h3 id="完整性校验" tabindex="-1"><a class="header-anchor" href="#完整性校验"><span>完整性校验</span></a></h3><p>HTTPS协议使用消息认证码（MAC）或数字签名来确保数据的完整性和防止中间人攻击。TLS协议使用散列函数来生成MAC，这有助于检测数据在传输过程中是否被篡改。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>SHA1</span></span>
<span class="line"><span>C71D49A6144772F352806201EF564951BE55EDD5</span></span>
<span class="line"><span></span></span>
<span class="line"><span>下载完成后务必进行SHA1校验（推荐使用iHasher），与网站核对一致后再使用。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,61))])}const g=n(p,[["render",h],["__file","http.html.vue"]]),T=JSON.parse('{"path":"/java/frame/javaweb/http.html","title":"HTTP协议基础","lang":"en-US","frontmatter":{"order":1,"title":"HTTP协议基础","description":"HTTP协议及网络 网络模型(分层) OSI(Open System Interaction)七层模型：将网络分为7层； TCP/IP 模型 ： 将网络分为5层（4层） 分层是逻辑上面的概念，并不是指的是物理网络中被拆分了若干层。 为什么要分层？ 目的主要是为了解耦。比如传输层有TCP、UDP两种传输方式。 分层最大的好处就是今后如果希望将传输方式从T...","head":[["meta",{"property":"og:url","content":"https://x.app/java/frame/javaweb/http.html"}],["meta",{"property":"og:site_name","content":"Home"}],["meta",{"property":"og:title","content":"HTTP协议基础"}],["meta",{"property":"og:description","content":"HTTP协议及网络 网络模型(分层) OSI(Open System Interaction)七层模型：将网络分为7层； TCP/IP 模型 ： 将网络分为5层（4层） 分层是逻辑上面的概念，并不是指的是物理网络中被拆分了若干层。 为什么要分层？ 目的主要是为了解耦。比如传输层有TCP、UDP两种传输方式。 分层最大的好处就是今后如果希望将传输方式从T..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://image.ventix.top/java/image-20220406222111262.png"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2025-01-10T15:19:41.000Z"}],["meta",{"property":"article:author","content":"ventixy"}],["meta",{"property":"article:modified_time","content":"2025-01-10T15:19:41.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"HTTP协议基础\\",\\"image\\":[\\"https://image.ventix.top/java/image-20220406222111262.png\\",\\"https://image.ventix.top/java/image-20220406223751075.png\\",\\"https://image.ventix.top/java/image-20220407104919963.png\\"],\\"dateModified\\":\\"2025-01-10T15:19:41.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"ventixy\\",\\"url\\":\\"https://www.ventix.top\\"}]}"]]},"headers":[{"level":2,"title":"HTTP协议及网络","slug":"http协议及网络","link":"#http协议及网络","children":[{"level":3,"title":"网络模型(分层)","slug":"网络模型-分层","link":"#网络模型-分层","children":[]},{"level":3,"title":"HTTP协议介绍","slug":"http协议介绍","link":"#http协议介绍","children":[]},{"level":3,"title":"TCP三次握手","slug":"tcp三次握手","link":"#tcp三次握手","children":[]},{"level":3,"title":"HTTP工作流程","slug":"http工作流程","link":"#http工作流程","children":[]}]},{"level":2,"title":"HTTP请求报文","slug":"http请求报文","link":"#http请求报文","children":[{"level":3,"title":"请求报文格式","slug":"请求报文格式","link":"#请求报文格式","children":[]},{"level":3,"title":"请求头信息","slug":"请求头信息","link":"#请求头信息","children":[]},{"level":3,"title":"HTTP协议版本","slug":"http协议版本","link":"#http协议版本","children":[]},{"level":3,"title":"GET与POST","slug":"get与post","link":"#get与post","children":[]}]},{"level":2,"title":"HTTP响应报文","slug":"http响应报文","link":"#http响应报文","children":[{"level":3,"title":"响应报文格式","slug":"响应报文格式","link":"#响应报文格式","children":[]},{"level":3,"title":"常见的状态码","slug":"常见的状态码","link":"#常见的状态码","children":[]}]},{"level":2,"title":"HTTPS协议简介","slug":"https协议简介","link":"#https协议简介","children":[{"level":3,"title":"HTTPS概述","slug":"https概述","link":"#https概述","children":[]},{"level":3,"title":"HTTPS加密机制","slug":"https加密机制","link":"#https加密机制","children":[]},{"level":3,"title":"数字证书","slug":"数字证书","link":"#数字证书","children":[]},{"level":3,"title":"完整性校验","slug":"完整性校验","link":"#完整性校验","children":[]}]}],"git":{"createdTime":1736522381000,"updatedTime":1736522381000,"contributors":[{"name":"drizzle","email":"msdrizzle@outlook.com","commits":1}]},"readingTime":{"minutes":18.31,"words":5494},"filePathRelative":"java/frame/javaweb/http.md","localizedDate":"January 10, 2025","excerpt":"<h2>HTTP协议及网络</h2>\\n<h3>网络模型(分层)</h3>\\n<ul>\\n<li>\\n<p>OSI(Open System Interaction)七层模型：将网络分为7层；</p>\\n</li>\\n<li>\\n<p>TCP/IP 模型 ： 将网络分为5层（4层）</p>\\n</li>\\n</ul>\\n<figure><img src=\\"https://image.ventix.top/java/image-20220406222111262.png\\" alt=\\"\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption></figcaption></figure>\\n<p><strong>分层是逻辑上面的概念</strong>，并不是指的是物理网络中被拆分了若干层。</p>","autoDesc":true}');export{g as comp,T as data};

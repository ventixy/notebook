import{_ as g}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,b as o,d as p,w as r,r as T,o as d,a as t,e as n}from"./app-C_BVzpIO.js";const h={};function c(u,l){const e=T("Tabs");return d(),a("div",null,[l[4]||(l[4]=o('<h2 id="hyper-text-transfer" tabindex="-1"><a class="header-anchor" href="#hyper-text-transfer"><span>Hyper Text Transfer</span></a></h2><p>超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是⼀种⽤于分布式、协作式和 超媒体信息系统的 <strong>应用层协议</strong> （TCP/UDP为运输层协议）</p><div class="hint-container info"><p class="hint-container-title">HTTP协议版本介绍</p><p>HTTP协议发展历程：0.9、1.0、1.1版本（HTTP/1.1）、HTTP/2.0、HTTP/3.0：</p><ul><li>HTTP/0.9：仅支持GET方法，只能发送HTML格式的数据，不支持请求头和响应头</li><li>HTTP/1.0：增加了POST、HEAD等请求方法，引入头部信息：支持请求头和响应头 <ul><li>多数据格式：不仅可以传输纯文本，还可以传输图片、视频等多种媒体类型</li><li>短连接：每次请求都需要建立新的TCP连接，效率较低</li></ul></li><li><span style="color:#1E90FF;"><strong>HTTP/1.1</strong></span>：通过<code>Connection: keep-alive</code>默认保持TCP连接打开，允许多个请求复用同一个TCP连接，还支持分块传输编码、断点续传等功能</li><li>HTTP/2.0：采用更高效的二进制格式代替文本格式，提高解析效率</li><li>HTTP/3.0：放弃了TCP，转而使用基于UDP的QUIC协议，进一步提升了性能并减少了延迟</li></ul><p>尽管HTTP/2.0和HTTP/3.0提供了显著的性能改进，但HTTP/1.1仍然是广泛使用的版本之一</p></div><p><strong>如果希望客户端和服务器之间能够进行正常的通讯，双方在传递数据时只需要遵守固定的格式即可</strong> 这个格式其实就是<strong>协议</strong></p><p>HTTP协议：客户端和服务器在进行通讯时，发送的HTTP请求和响应应当具有的特定的格式</p><hr><h3 id="http请求报文" tabindex="-1"><a class="header-anchor" href="#http请求报文"><span>HTTP请求报文</span></a></h3><p>HTTP请求报文是客户端（通常是Web浏览器）与服务器之间通信的基础。主要由三个部分组成：请求行 (Request Line)，请求头 (Request Headers)，请求正文 (Request Body)</p><p>不同于一些底层网络协议（如TCP/IP），后者可能会利用固定长度或特定位置的比特/字节来定义和区分字段，HTTP作为一种应用层协议，采用的是基于文本的格式，使得它更加灵活和易于人类阅读</p><figure><img src="https://image.ventix.top/img02/20220213003008567.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>请求行 (Request Line)包含三个字段：<strong>请求方法</strong>(如GET、POST等)、<strong>请求URI</strong> 和 <strong>HTTP版本</strong></p><p>请求头 (Request Headers)：请求头用于描述请求的元数据，指导服务器如何处理和优化响应</p><p>请求正文 (Request Body) 中包含了要的数据，主要在POST、PUT等请求中使用。也可用来传输大量的数据，比如文件上传</p><hr><h3 id="常见请求头字段" tabindex="-1"><a class="header-anchor" href="#常见请求头字段"><span>常见请求头字段</span></a></h3><p>HTTP请求头（Request Headers）包含了客户端发送给服务器的关于请求、客户端本身以及所需响应的信息。这些头部字段帮助服务器理解请求的具体细节，并据此做出适当的响应</p><ol><li><p><strong>Host</strong>：指定请求的目标主机名和端口号，这是HTTP/1.1强制要求的字段，用于支持虚拟主机服务</p></li><li><p><strong>User-Agent</strong>： 提供了发起请求的用户代理（通常是浏览器）的信息，包括名称、版本号和其他属性。这有助于服务器根据不同的客户端特性定制响应内容</p></li><li><p><strong>Accept</strong>：列出了客户端能够理解的内容类型（MIME类型，如text/html, application/json等），让服务器知道客户端期望接收的数据格式</p></li><li><p><strong>Accept-Language</strong>：表示客户端偏好的自然语言，帮助服务器选择合适的语言版本返回给客户端</p></li><li><p><strong>Accept-Encoding</strong>：客户端支持的内容编码方式（如gzip, deflate），允许服务器在传输时对数据进行压缩以节省带宽。</p></li><li><p><strong>Connection</strong>：控制网络连接的行为，如<code>keep-alive</code>保持连接打开以便于后续请求，或<code>close</code>指示服务器立即关闭连接。</p></li><li><p><strong>Content-Type</strong>：当使用POST或PUT方法时，指定请求体中的媒体类型，告知服务器客户端发送的数据格式。</p></li><li><p><strong>Content-Length</strong>：标识请求体的大小（以字节为单位），仅当有请求体时适用</p></li><li><p><strong>Authorization</strong>：包含认证凭据，用于验证客户端的身份，通常与Base64编码后的用户名和密码一起使用</p></li><li><p><strong>Cookie</strong>：包含之前由服务器通过<code>Set-Cookie</code>头设置的cookie信息，使客户端可以向服务器发送状态信息</p></li><li><p><strong>Referer</strong>：显示当前页面是从哪个页面链接过来的，有助于追踪用户的浏览路径</p></li><li><p><strong>Origin</strong>：在跨域请求中指明请求来源，帮助服务器判断是否允许该请求</p></li></ol><hr><p>HTTP头部字段的数量并不是固定的，HTTP协议甚至允许自定义头部字段以满足特定需求</p><ul><li><p>HTTP头部字段不是通过位数来区分的，而是通过文本格式进行解析：每个HTTP头部字段都是一个<code>名称: 值</code>对，其中名称和值之间用冒号（<code>:</code>）加上<code>空格</code>分隔。字段名是大小写不敏感的</p></li><li><p>顺序无关性：头部字段的顺序一般不影响其含义，除了某些特定情况下的特殊字段（如Connection字段中的元素）</p></li></ul><p>每个头部字段都以回车换行（CRLF, <code>\\r\\n</code>）结束。头部字段集合以一个额外的CRLF行（即两个连续的CRLF）结束，这标志着头部与可能跟随的实体主体之间的分界</p><hr><h3 id="http响应报文" tabindex="-1"><a class="header-anchor" href="#http响应报文"><span>HTTP响应报文</span></a></h3><p>HTTP响应报文是服务器返回给客户端的消息，包含了请求的结果信息以及可能的资源数据。响应报文由三部分组成：状态行、响应头部和实体主体（可选）</p><figure><img src="https://image.ventix.top/img02/20250213225605790.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>状态行 (Status Line)：包含HTTP版本、状态码（如<code>200</code>）和状态消息（如<code>ok</code>）</p><p>响应头部 (Response Headers)：包含了一系列 <code>名称: 值</code> 对，提供了关于响应或其载荷的信息</p><p>空行 (Blank Line)：一个仅包含CRLF（回车换行）的行，用于标记头部字段的结束和实体主体的开始</p><hr><h3 id="常见的状态码" tabindex="-1"><a class="header-anchor" href="#常见的状态码"><span>常见的状态码</span></a></h3><p>HTTP状态码是服务器对客户端请求的响应状态的数字代码。它们帮助客户端理解服务器处理请求的结果，并根据这些结果采取适当的行动</p><p>HTTP状态码分为五个类别，每个类别的第一个数字定义了响应的类别</p><ol><li><strong>1xx（信息性响应）</strong>：请求已被接收，继续处理。</li><li><strong>2xx（成功响应）</strong>：请求已成功被服务器接收、理解和处理。</li><li><strong>3xx（重定向）</strong>：需要客户端采取进一步操作以完成请求。</li><li><strong>4xx（客户端错误）</strong>：请求包含语法错误或无法完成。</li><li><strong>5xx（服务器错误）</strong>：服务器在尝试处理请求时遇到错误。</li></ol><p>下面是每种类别常见的HTTP状态码：</p><p><span style="color:#1E90FF;"><strong>1xx - 信息性响应</strong></span></p><ul><li><strong>100 Continue</strong>：客户端应继续其请求。</li><li><strong>101 Switching Protocols</strong>：服务器理解并同意客户端升级协议的要求。</li></ul><p><span style="color:#1E90FF;"><strong>2xx - 成功响应</strong></span></p><ul><li><strong>200 OK</strong>：标准的成功响应，表示请求已被成功处理。</li><li><strong>201 Created</strong>：请求成功且服务器创建了一个新的资源。</li><li><strong>204 No Content</strong>：服务器成功处理了请求，但不需要返回任何实体内容。</li></ul><p><span style="color:#1E90FF;"><strong>3xx - 重定向</strong></span></p><ul><li><strong>301 Moved Permanently</strong>：请求的资源已被永久移动到新位置，后续对该资源的请求都应指向给出的新URI。</li><li><strong>302 Found</strong>：请求的资源临时从不同的URI响应请求。</li><li><strong>304 Not Modified</strong>：资源未被修改，可以使用缓存的版本。</li></ul><p><span style="color:#1E90FF;"><strong>4xx - 客户端错误</strong></span></p><ul><li><strong>400 Bad Request</strong>：由于明显的客户端错误（如请求格式错误），服务器无法处理请求。</li><li><strong>401 Unauthorized</strong>：请求需要用户验证。</li><li><strong>403 Forbidden</strong>：服务器理解请求但拒绝执行。</li><li><strong>404 Not Found</strong>：请求的资源在服务器上不存在。</li><li><strong>405 Method Not Allowed</strong>：请求方法对指定资源不适用。</li></ul><p><span style="color:#1E90FF;"><strong>5xx - 服务器错误</strong></span></p><ul><li><strong>500 Internal Server Error</strong>：服务器遇到了未知情况，阻止了它完成请求。</li><li><strong>501 Not Implemented</strong>：服务器不具备完成请求的功能。</li><li><strong>502 Bad Gateway</strong>：作为网关或代理的服务器收到无效响应。</li><li><strong>503 Service Unavailable</strong>：服务器暂时无法处理请求（可能是过载或维护）。</li><li><strong>504 Gateway Timeout</strong>：作为网关或代理的服务器未能及时从上游服务器获得响应。</li></ul><hr><h3 id="get与post" tabindex="-1"><a class="header-anchor" href="#get与post"><span>GET与POST</span></a></h3><p><strong>GET</strong>和<strong>POST</strong>的主要区别在于<strong>语义</strong>：GET用于获取数据，POST用于提交数据</p><ul><li><strong>GET</strong>： 适用于获取数据，如查询、搜索等。 参数暴露在URL中，安全性较低。</li><li><strong>POST</strong>： 适用于提交数据，如表单提交、文件上传等。 参数在请求体中，安全性较高。</li></ul><hr><p><span style="color:#1E90FF;"><strong>1. 语义区别：</strong></span></p><ul><li><strong>GET</strong>：用于<strong>获取数据</strong>。请求指定的资源，服务器解析后返回响应内容。</li><li><strong>POST</strong>：用于<strong>提交数据</strong>。请求服务器处理数据（如提交表单或上传文件），数据包含在请求体中。</li></ul><p><span style="color:#1E90FF;"><strong>2. 请求参数位置</strong></span></p><ul><li><strong>GET</strong>： 参数通常附加在URL后，使用<code>?</code>分隔URL和参数，参数间用<code>&amp;</code>连接。 <ul><li>例如：<code>/api/data?id=1&amp;name=test</code></li></ul></li><li><strong>POST</strong>： 参数通常放在<strong>请求体</strong>中。例如：<code>{&quot;id&quot;: 1, &quot;name&quot;: &quot;test&quot;}</code></li></ul><blockquote><p><strong>注意</strong>：HTTP规范并未强制规定参数位置，上述做法是约定俗成的习惯。虽然可以在POST请求中通过URL传递数据，或者在GET请求中将数据放入请求体中，但这不符合常规使用习惯，并可能导致兼容性问题或安全隐患。</p></blockquote><p><span style="color:#1E90FF;"><strong>3. 浏览器行为</strong></span></p><ul><li><strong>GET</strong>： URL长度有限制（通常不超过2048字符）。 请求可被<strong>缓存</strong>和<strong>收藏</strong>。</li><li><strong>POST</strong>： 无URL长度限制。 请求<strong>不会被缓存</strong>，通常<strong>无法直接收藏</strong>。</li></ul><hr><h3 id="http工作流程" tabindex="-1"><a class="header-anchor" href="#http工作流程"><span>HTTP工作流程</span></a></h3><ol><li><p><strong>域名解析</strong>： 用户在浏览器地址栏输入URL后，浏览器首先进行域名解析（依次查询浏览器缓存、操作系统缓存、hosts文件、DNS服务器）。</p></li><li><p><strong>建立TCP连接</strong>： 浏览器与服务器通过<strong>TCP三次握手</strong>建立连接。</p></li><li><p><strong>生成HTTP请求</strong>： 浏览器生成HTTP请求报文，向下经过：</p><ul><li><strong>传输层（TCP）</strong>：拆包并添加TCP头部。</li><li><strong>网络层（IP）</strong>：添加IP头部。</li><li><strong>链路层</strong>：通过网卡发送到网络中。</li></ul></li><li><p><strong>请求传输</strong>： 数据包在网络中经过多次中转，最终到达服务器。</p></li><li><p><strong>服务器处理请求</strong>： 服务器接收到数据包后，逐层解析：</p><ul><li><strong>网络层（IP）</strong>：去掉IP头部。</li><li><strong>传输层（TCP）</strong>：去掉TCP头部并合并数据包。</li><li><strong>应用层（HTTP）</strong>：解析HTTP请求报文，识别请求的资源并生成HTTP响应。</li></ul></li><li><p><strong>返回HTTP响应</strong>：服务器将HTTP响应报文向下经过：</p><ul><li><strong>传输层（TCP）</strong>：拆包并添加TCP头部。</li><li><strong>网络层（IP）</strong>：添加IP头部。</li><li><strong>链路层</strong>：通过网卡发送到网络中。</li></ul></li><li><p><strong>响应传输</strong>： 数据包在网络中经过多次中转，最终到达客户端。</p></li><li><p><strong>客户端接收响应</strong>： 客户端接收到数据包后，逐层解析：</p><ul><li><strong>网络层（IP）</strong>：去掉IP头部。</li><li><strong>传输层（TCP）</strong>：去掉TCP头部并合并数据包。</li><li><strong>应用层（HTTP）</strong>：解析HTTP响应报文。</li></ul></li><li><p><strong>渲染页面</strong>： 浏览器解析HTML内容，若遇到CSS、JS、图片等资源，则再次发起HTTP请求获取资源。 当所有资源加载完成后，浏览器渲染页面并呈现给用户。</p></li></ol><hr><div class="hint-container info"><p class="hint-container-title">HTTP工作流程总结</p><ol><li><strong>域名解析</strong>：浏览器解析URL中的域名。</li><li><strong>建立TCP连接</strong>：通过三次握手建立连接。</li><li><strong>生成HTTP请求</strong>：浏览器生成请求报文，经过TCP、IP、链路层发送。</li><li><strong>请求传输</strong>：数据包通过网络传输到服务器。</li><li><strong>服务器处理请求</strong>：服务器解析请求并生成响应。</li><li><strong>返回HTTP响应</strong>：服务器将响应报文经过TCP、IP、链路层发送。</li><li><strong>响应传输</strong>：数据包通过网络传输到客户端。</li><li><strong>客户端接收响应</strong>：客户端解析响应报文。</li><li><strong>渲染页面</strong>：浏览器解析HTML并加载资源，最终渲染页面。</li></ol></div><hr><h2 id="https原理及应用" tabindex="-1"><a class="header-anchor" href="#https原理及应用"><span>HTTPS原理及应用</span></a></h2><p>HTTPS协议是HTTP协议的安全版本，它通过在HTTP之上使用SSL/TLS协议来保护通信内容的安全性</p><div class="hint-container info"><p class="hint-container-title">HyperText Transfer Protocol Secure</p><p>HTTPS（HyperText Transfer Protocol Secure，超文本传输安全协议）是 HTTP（超文本传输协议）与 SSL/TLS（Secure Sockets Layer / Transport Layer Security，安全套接字层/传输层安全协议）相结合的安全通信协议。通过加密和身份认证来确保数据在客户端与服务器之间的安全传输</p><p>HTTPS 的主要功能：</p><ol><li><strong>数据加密（Encryption）</strong> —— 保护数据不被窃听。</li><li><strong>数据完整性（Integrity）</strong> —— 保护数据不被篡改。</li><li><strong>身份认证（Authentication）</strong> —— 确保通信双方身份的真实性。</li></ol></div><hr><h3 id="https报文格式" tabindex="-1"><a class="header-anchor" href="#https报文格式"><span>HTTPS报文格式</span></a></h3><p>HTTPS 本质上仍然是 HTTP，但增加了 <strong>SSL/TLS 加密层</strong>，报文结构与 HTTP 相似，主要区别在于：</p><ol><li><strong>端口号不同</strong>：HTTP 使用 <strong>80</strong> 端口，而 HTTPS 使用 <strong>443</strong> 端口。</li><li><strong>传输方式不同</strong>： <ul><li>HTTP：明文传输，容易被中间人攻击（如窃听、篡改）。</li><li>HTTPS：使用 SSL/TLS 加密，数据经过加密后传输，确保安全性。</li></ul></li><li><strong>握手阶段（SSL/TLS Handshake）</strong>： <ul><li>HTTP 直接请求-响应。</li><li>HTTPS 需要先进行 SSL/TLS 握手，协商加密方式，建立安全连接后再传输数据。</li></ul></li></ol><hr><h3 id="https加密机制" tabindex="-1"><a class="header-anchor" href="#https加密机制"><span>HTTPS加密机制</span></a></h3><p>HTTPS 结合了 <strong>对称加密（Symmetric Encryption）</strong> 和 <strong>非对称加密（Asymmetric Encryption）</strong>，充分利用二者的优点。</p><p><span style="color:#1E90FF;"><strong>对称加密（Symmetric Encryption）</strong></span>：发送方与接收方使用 <strong>相同的密钥</strong> 进行加密和解密。速度快，适合大数据量传输，但密钥管理复杂。常见算法：</p><ul><li><strong>AES（Advanced Encryption Standard，高级加密标准）</strong>：目前主流对称加密算法。</li><li><strong>DES（Data Encryption Standard，数据加密标准）</strong>：已被认为不安全。</li><li><strong>3DES（Triple DES，三重数据加密）</strong>：比 DES 安全，但速度慢。</li></ul><p>✅ 速度快，适合大数据量传输。<br> ❌ 需要安全管理密钥，密钥泄露后数据易被破解。</p><p>在HTTPS中，对称加密主要用于加密大量的数据传输，因为它的速度较快</p><hr><p><span style="color:#1E90FF;"><strong>非对称加密（Asymmetric Encryption）</strong></span>：使用 <strong>公钥（Public Key）</strong> 进行加密，使用 <strong>私钥（Private Key）</strong> 进行解密（或者反向操作）。 适用于身份认证、密钥交换，但速度慢。 常见算法：</p><ul><li><strong>RSA（Rivest-Shamir-Adleman）</strong>：常用的非对称加密算法。</li><li><strong>ECC（Elliptic Curve Cryptography，椭圆曲线密码学）</strong>：比 RSA 更高效，适用于移动设备。</li><li><strong>Diffie-Hellman（DH）</strong>：主要用于密钥交换，而非加密。</li></ul><p>✅ 密钥管理相对简单，可用于身份认证。<br> ❌ 计算量大，加解密速度慢，不适合大数据量传输。</p><hr><h3 id="ssl-tls握手流程" tabindex="-1"><a class="header-anchor" href="#ssl-tls握手流程"><span>SSL/TLS握手流程</span></a></h3><p>HTTPS 主要使用 <strong>非对称加密传输密钥</strong>，然后使用 <strong>对称加密传输数据</strong>，结合了二者的优点。</p><ul><li><p>SSL（Secure Sockets Layer）是早期的安全协议，而TLS（Transport Layer Security）是SSL的后继者，提供了更高级别的安全性</p></li><li><p>TLS 1.3 是 TLS 协议的最新版本，相较于 TLS 1.2，它在<strong>性能</strong>和<strong>安全性</strong>方面有显著提升：</p><p><strong>1 更快的访问速度</strong></p><ul><li><strong>TLS 1.2</strong>：需要 <strong>2-RTT（两次往返）</strong> 完成握手。</li><li><strong>TLS 1.3</strong>：仅需 <strong>1-RTT（一次往返）</strong> 完成握手，支持 <strong>0-RTT</strong> 模式，进一步减少延迟。</li><li><strong>性能提升</strong>：TLS 1.3 的握手时间减半，访问速度更快，尤其对移动端用户友好。</li></ul><p><strong>2 更强的安全性</strong></p><ul><li><strong>移除不安全的加密算法</strong>：TLS 1.3 删除了 RSA 密钥传输、CBC 模式密码、RC4 流密码、SHA-1 哈希函数等易受攻击的算法。</li><li><strong>强制前向安全性</strong>：TLS 1.3 仅支持前向安全的密钥交换机制（如 ECDHE）。</li><li><strong>减少明文暴露</strong>：ServerHello 之后的所有握手消息都加密传输，减少了明文暴露的风险。</li></ul><p><strong>3 简化与优化</strong></p><ul><li><strong>废弃不必要功能</strong>：TLS 1.3 不再支持重协商、压缩和静态 RSA 密钥交换。</li><li><strong>更简洁的协议设计</strong>：减少了握手步骤和复杂性，提高了协议的健壮性。</li></ul></li></ul><hr>',85)),p(e,{id:"801",data:[{id:"TLS 1.2 握手过程"},{id:"TLS 1.3 握手过程"}],active:1},{title0:r(({value:i,isActive:s})=>l[0]||(l[0]=[n("TLS 1.2 握手过程")])),title1:r(({value:i,isActive:s})=>l[1]||(l[1]=[n("TLS 1.3 握手过程")])),tab0:r(({value:i,isActive:s})=>l[2]||(l[2]=[t("p",null,[n("TLS 1.2 的完整握手需要 "),t("strong",null,"2-RTT"),n("，具体步骤如下：")],-1),t("ol",null,[t("li",null,[t("strong",null,"Client Hello"),n("： 客户端发送支持的 TLS 版本、加密套件列表和随机数（Client Random）。")]),t("li",null,[t("strong",null,"Server Hello"),n("： 服务器选择 TLS 版本、加密套件，并发送随机数（Server Random）和数字证书。")]),t("li",null,[t("strong",null,"密钥交换"),n("： 客户端生成预主密钥（Pre-Master Secret），用服务器的公钥加密后发送给服务器。")]),t("li",null,[t("strong",null,"Server Key Exchange"),n("（可选）： 如果使用 ECDHE 等算法，服务器会发送自己的公钥参数。")]),t("li",null,[t("strong",null,"Server Hello Done"),n("： 服务器通知客户端握手信息发送完毕。")]),t("li",null,[t("strong",null,"客户端验证证书"),n("： 客户端验证服务器的数字证书。")]),t("li",null,[t("strong",null,"Client Key Exchange"),n("： 客户端发送加密后的预主密钥。")]),t("li",null,[t("strong",null,"生成主密钥"),n("： 客户端和服务器使用 Client Random、Server Random 和预主密钥生成主密钥（Master Secret）。")]),t("li",null,[t("strong",null,"Change Cipher Spec"),n("： 双方通知对方后续消息将使用协商的密钥加密。")]),t("li",null,[t("strong",null,"Finished"),n("： 双方发送加密的 Finished 消息，验证握手是否成功。")])],-1)])),tab1:r(({value:i,isActive:s})=>l[3]||(l[3]=[t("p",null,[n("TLS 1.3 的握手仅需 "),t("strong",null,"1-RTT"),n("，支持 "),t("strong",null,"0-RTT"),n(" 模式，具体步骤如下：")],-1),t("ol",null,[t("li",null,[t("strong",null,"Client Hello"),n("： 客户端发送支持的 TLS 版本、加密套件列表、随机数（Client Random）和密钥共享参数（如 ECDHE 公钥）。")]),t("li",null,[t("strong",null,"Server Hello"),n("： "),t("ul",null,[t("li",null,"服务器选择 TLS 版本、加密套件，发送随机数（Server Random）和密钥共享参数。"),t("li",null,"服务器同时发送数字证书和 Finished 消息。")])]),t("li",null,[t("strong",null,"客户端验证证书"),n("： 客户端验证服务器的数字证书。")]),t("li",null,[t("strong",null,"生成主密钥"),n("： 客户端和服务器使用 ECDHE 参数生成主密钥（Master Secret）。")]),t("li",null,[t("strong",null,"Change Cipher Spec"),n("： 客户端通知服务器后续消息将使用协商的密钥加密。")]),t("li",null,[t("strong",null,"Finished"),n("： 客户端发送加密的 Finished 消息，验证握手是否成功。")])],-1),t("p",null,[t("strong",null,"0-RTT 模式")],-1),t("ul",null,[t("li",null,"在 0-RTT 模式下，客户端可以在第一次握手时直接发送加密的应用数据，无需等待服务器响应"),t("li",null,"适用场景：适用于对延迟敏感的应用（如网页加载、API 请求）。")],-1)])),_:1}),l[5]||(l[5]=o(`<hr><p>目前，主流浏览器均已支持 TLS 1.3：</p><ul><li><strong>Chrome</strong>：从 Chrome 70 开始默认支持 TLS 1.3。</li><li><strong>Firefox</strong>：从 Firefox 63 开始默认支持 TLS 1.3。</li><li><strong>Safari</strong>：从 Safari 12.1 开始支持 TLS 1.3。</li><li><strong>Edge</strong>：基于 Chromium 的 Edge 浏览器默认支持 TLS 1.3。</li></ul><p><strong>总结</strong></p><ul><li><strong>TLS 1.3 的优势</strong>： <ul><li>更快的握手速度（1-RTT，支持 0-RTT）。</li><li>更强的安全性（移除不安全的加密算法，强制前向安全性）。</li><li>更简洁的协议设计。</li></ul></li><li><strong>TLS 1.2 的局限性</strong>： <ul><li>握手时间较长（2-RTT）。</li><li>支持不安全的加密算法（如 RSA 密钥传输、SHA-1）。</li></ul></li><li><strong>未来趋势</strong>： <ul><li>TLS 1.3 已成为主流，逐步取代 TLS 1.2。</li><li>随着浏览器和服务器对 TLS 1.3 的支持普及，HTTPS 的性能和安全性将进一步提升。</li></ul></li></ul><p>通过对比 TLS 1.2 和 TLS 1.3 的握手过程，可以清晰地看到 TLS 1.3 在性能和安全性上的显著优势。随着互联网安全需求的不断提高，TLS 1.3 将成为 HTTPS 通信的标准协议。</p><hr><h3 id="数字证书" tabindex="-1"><a class="header-anchor" href="#数字证书"><span>数字证书</span></a></h3><p>为了验证服务器的身份，HTTPS使用数字证书来确保客户端与正确的服务器进行通信。数字证书通常包含以下信息：</p><ul><li>服务器的身份信息。</li><li>发行该证书的认证机构（CA）。</li><li>公钥。</li><li>有效期。</li><li>CA的数字签名。</li></ul><div class="hint-container info"><p class="hint-container-title">证书的颁发</p><h4 id="证书的颁发" tabindex="-1"><a class="header-anchor" href="#证书的颁发"><span>证书的颁发</span></a></h4><ol><li><strong>证书申请</strong>：服务器管理员向认证机构（CA）提交证书签名请求（CSR）。</li><li><strong>身份验证</strong>：CA验证服务器的身份。</li><li><strong>证书颁发</strong>：CA颁发数字证书。</li><li><strong>安装证书</strong>：服务器安装证书。</li></ol><h4 id="证书链" tabindex="-1"><a class="header-anchor" href="#证书链"><span>证书链</span></a></h4><p>证书链是指从服务器的证书到信任根证书的一系列证书。客户端可以通过验证证书链中的每个证书的签名来确认最终服务器证书的有效性。</p></div><hr><h3 id="digital-signature" tabindex="-1"><a class="header-anchor" href="#digital-signature"><span>Digital Signature</span></a></h3><p>数字签名（Digital Signature）： 确保 <strong>数据完整性</strong> + <strong>身份认证</strong>。流程：</p><ol><li>发送方计算消息的哈希值（Message Digest）。</li><li>使用私钥对哈希值进行加密，生成 <strong>数字签名</strong>。</li><li>接收方用发送方的公钥解密 <strong>数字签名</strong>，并计算消息的哈希值进行对比，验证消息是否被篡改。</li></ol><p><strong>常见算法</strong>：</p><ul><li>RSA 签名</li><li>ECDSA（基于椭圆曲线的数字签名算法）</li></ul><hr><h3 id="完整性校验" tabindex="-1"><a class="header-anchor" href="#完整性校验"><span>完整性校验</span></a></h3><p>HTTPS协议使用消息认证码（MAC）或数字签名来确保数据的完整性和防止中间人攻击。TLS协议使用散列函数来生成MAC，这有助于检测数据在传输过程中是否被篡改。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">SHA1</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">C71D49A6144772F352806201EF564951BE55EDD5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>下载完成后务必进行SHA1校验（推荐使用iHasher），与网站核对一致后再使用。</p><hr><p>散列函数（Hash Function）：将原始数据转换为固定长度的哈希值（不可逆）。 主要用于 <strong>数据完整性校验</strong>，防止数据被篡改。 常见算法：</p><ul><li><strong>MD5（已不安全）</strong></li><li><strong>SHA-256（Secure Hash Algorithm 256-bit）</strong>（主流）</li><li><strong>SHA-3（更强的哈希算法）</strong></li></ul><hr><h3 id="https内容总结" tabindex="-1"><a class="header-anchor" href="#https内容总结"><span>HTTPS内容总结</span></a></h3><table><thead><tr><th><strong>概念</strong></th><th><strong>作用</strong></th><th><strong>核心算法</strong></th></tr></thead><tbody><tr><td>对称加密</td><td>保护数据不被窃听</td><td>AES、DES、3DES</td></tr><tr><td>非对称加密</td><td>主要用于密钥交换、身份认证</td><td>RSA、ECC、Diffie-Hellman</td></tr><tr><td>消息摘要</td><td>确保数据完整性，防篡改</td><td>MD5（不安全）、SHA-256</td></tr><tr><td>数字签名</td><td>确保身份真实性 + 数据完整性</td><td>RSA、ECDSA</td></tr><tr><td>SSL/TLS 握手</td><td>交换密钥，建立安全连接</td><td>TLS 1.2、TLS 1.3</td></tr><tr><td>HTTPS 报文</td><td>HTTP + SSL/TLS 加密</td><td>基于 HTTP 结构扩展</td></tr></tbody></table><ol><li><strong>防窃听</strong>（Eavesdropping）：数据加密（对称 + 非对称）。</li><li><strong>防篡改</strong>（Tampering）：消息摘要（SHA-256）。</li><li><strong>防冒充</strong>（Impersonation）：数字签名 + 证书验证。</li></ol><p>HTTPS 通过 <strong>SSL/TLS 加密、身份认证、完整性校验</strong>，大幅提升了 Web 传输的安全性，是现代网络安全通信的基础</p><hr><p>HTTPS使用<mark>混合加密</mark>来结合对称加密和非对称加密的优点。具体流程如下：</p><ol><li><strong>建立连接</strong>：客户端向服务器发起HTTPS连接请求。</li><li><strong>交换公钥</strong>：服务器将自己的公钥发送给客户端。</li><li><strong>生成会话密钥</strong>：客户端使用服务器的公钥加密一个随机生成的对称密钥（会话密钥），然后发送给服务器。</li><li><strong>加密数据传输</strong>：服务器收到会话密钥后，使用自己的私钥解密得到会话密钥，之后所有数据都使用这个会话密钥进行对称加密和解密。</li></ol>`,33))])}const H=g(h,[["render",c],["__file","http.html.vue"]]),m=JSON.parse('{"path":"/theory/cs/http.html","title":"HTTP/HTTPS","lang":"en-US","frontmatter":{"order":40,"title":"HTTP/HTTPS","description":"Hyper Text Transfer 超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是⼀种⽤于分布式、协作式和 超媒体信息系统的 应用层协议 （TCP/UDP为运输层协议） HTTP协议版本介绍 HTTP协议发展历程：0.9、1.0、1.1版本（HTTP/1.1）、HTTP/2.0、HTTP/3.0： ...","head":[["meta",{"property":"og:url","content":"https://x.app/theory/cs/http.html"}],["meta",{"property":"og:site_name","content":"doc"}],["meta",{"property":"og:title","content":"HTTP/HTTPS"}],["meta",{"property":"og:description","content":"Hyper Text Transfer 超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是⼀种⽤于分布式、协作式和 超媒体信息系统的 应用层协议 （TCP/UDP为运输层协议） HTTP协议版本介绍 HTTP协议发展历程：0.9、1.0、1.1版本（HTTP/1.1）、HTTP/2.0、HTTP/3.0： ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://image.ventix.top/img02/20220213003008567.png"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2025-02-28T15:16:05.000Z"}],["meta",{"property":"article:author","content":"ventixy"}],["meta",{"property":"article:modified_time","content":"2025-02-28T15:16:05.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"HTTP/HTTPS\\",\\"image\\":[\\"https://image.ventix.top/img02/20220213003008567.png\\",\\"https://image.ventix.top/img02/20250213225605790.png\\"],\\"dateModified\\":\\"2025-02-28T15:16:05.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"ventixy\\",\\"url\\":\\"https://www.ventix.top\\"}]}"]]},"headers":[{"level":2,"title":"Hyper Text Transfer","slug":"hyper-text-transfer","link":"#hyper-text-transfer","children":[{"level":3,"title":"HTTP请求报文","slug":"http请求报文","link":"#http请求报文","children":[]},{"level":3,"title":"常见请求头字段","slug":"常见请求头字段","link":"#常见请求头字段","children":[]},{"level":3,"title":"HTTP响应报文","slug":"http响应报文","link":"#http响应报文","children":[]},{"level":3,"title":"常见的状态码","slug":"常见的状态码","link":"#常见的状态码","children":[]},{"level":3,"title":"GET与POST","slug":"get与post","link":"#get与post","children":[]},{"level":3,"title":"HTTP工作流程","slug":"http工作流程","link":"#http工作流程","children":[]}]},{"level":2,"title":"HTTPS原理及应用","slug":"https原理及应用","link":"#https原理及应用","children":[{"level":3,"title":"HTTPS报文格式","slug":"https报文格式","link":"#https报文格式","children":[]},{"level":3,"title":"HTTPS加密机制","slug":"https加密机制","link":"#https加密机制","children":[]},{"level":3,"title":"SSL/TLS握手流程","slug":"ssl-tls握手流程","link":"#ssl-tls握手流程","children":[]},{"level":3,"title":"数字证书","slug":"数字证书","link":"#数字证书","children":[]},{"level":3,"title":"Digital Signature","slug":"digital-signature","link":"#digital-signature","children":[]},{"level":3,"title":"完整性校验","slug":"完整性校验","link":"#完整性校验","children":[]},{"level":3,"title":"HTTPS内容总结","slug":"https内容总结","link":"#https内容总结","children":[]}]}],"git":{"createdTime":1740755765000,"updatedTime":1740755765000,"contributors":[{"name":"drizzle","email":"msdrizzle@outlook.com","commits":1}]},"readingTime":{"minutes":19.24,"words":5773},"filePathRelative":"theory/cs/http.md","localizedDate":"February 28, 2025","excerpt":"<h2>Hyper Text Transfer</h2>\\n<p>超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是⼀种⽤于分布式、协作式和 超媒体信息系统的 <strong>应用层协议</strong> （TCP/UDP为运输层协议）</p>\\n<div class=\\"hint-container info\\">\\n<p class=\\"hint-container-title\\">HTTP协议版本介绍</p>\\n<p>HTTP协议发展历程：0.9、1.0、1.1版本（HTTP/1.1）、HTTP/2.0、HTTP/3.0：</p>\\n<ul>\\n<li>HTTP/0.9：仅支持GET方法，只能发送HTML格式的数据，不支持请求头和响应头</li>\\n<li>HTTP/1.0：增加了POST、HEAD等请求方法，引入头部信息：支持请求头和响应头\\n<ul>\\n<li>多数据格式：不仅可以传输纯文本，还可以传输图片、视频等多种媒体类型</li>\\n<li>短连接：每次请求都需要建立新的TCP连接，效率较低</li>\\n</ul>\\n</li>\\n<li><span style=\\"color:#1E90FF\\"><strong>HTTP/1.1</strong></span>：通过<code>Connection: keep-alive</code>默认保持TCP连接打开，允许多个请求复用同一个TCP连接，还支持分块传输编码、断点续传等功能</li>\\n<li>HTTP/2.0：采用更高效的二进制格式代替文本格式，提高解析效率</li>\\n<li>HTTP/3.0：放弃了TCP，转而使用基于UDP的QUIC协议，进一步提升了性能并减少了延迟</li>\\n</ul>\\n<p>尽管HTTP/2.0和HTTP/3.0提供了显著的性能改进，但HTTP/1.1仍然是广泛使用的版本之一</p>\\n</div>","autoDesc":true}');export{H as comp,m as data};

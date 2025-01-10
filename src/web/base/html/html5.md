---

order: 10
title: HTML5新特性

---

## HTML5新增标签

::: tip HTML5新增特性

HTML5带来了许多新特性和改进，以下是一些主要的：

- 离线存储：通过Application Cache（应用程序缓存）和Web Storage API（Web存储API），HTML5允许网页在用户的设备上存储数据，使得网页能在离线状态下工作。

- 多媒体支持：HTML5引入了 `<audio>` 和 `<video>` 标签，使得开发者可以直接在网页上嵌入音频和视频内容，而无需依赖第三方插件。

- Web Sockets：Web Sockets API 提供了一种在用户的浏览器与服务器之间建立持久连接的方式，使得实时通信和双向数据传输成为可能。

- 语义化标签：HTML5引入了许多新的语义化标签，如 `<header>`, `<footer>`, `<article>`, `<section>` 等，这些标签有助于搜索引擎更好地理解网页内容，同时提高了代码的可读性。

- Canvas绘图：通过 `<canvas>` 元素和Canvas API，开发者可以在网页上绘制图形、制作动画等。

- 拖放API：HTML5的拖放API允许用户通过拖放操作来与网页元素进行交互。
:::



### 1. 语义化标签

HTML语义化是指使用具有明确含义的标签来构建网页内容。这样做的好处包括：

- 易于理解：语义化标签使得代码更易于人类阅读和理解。

- 对搜索引擎友好：搜索引擎能够更好地解析语义化标签，从而提高网页在搜索结果中的排名。

- 对辅助技术友好：语义化标签使得屏幕阅读器等辅助技术能够更准确地解析网页内容，从而帮助残障人士更好地使用网页。

常见的语义化标签包括 `<header>, <footer>, <nav>, <article>, <section>, <aside>` 等


新增语义化标签
```html
<header>:   头部标签
<nav>:       导航标签
<article>:  内容标签
<section>:  块级标签
<aside>:    侧边栏标签
<footer>:   尾部标签
```

**注意：**
- 这种语义化标准主要针对搜索引的
- 这些新标签页面中可以使用多次的
- 在E9中,需要把这些元素转换为块级元素
- 移动端更喜欢使用这些标签

<br/>



### 2. 多媒体标签

**① 音频 audio**
```html
<audio controls="controls">
  <source src="song.ogg" type="audio/ogg">
  <source src="song.mp3" type="audio/mpeg">
</audio>
```

<table class="dataintable"> 
  <tbody><tr>
    <th style="width:20%;">属性</th>
    <th style="width:16%;">值</th>
    <th>描述</th>
  </tr>
  <tr>
    <td class="html5_new"><a href="/tags/att_audio_autoplay.asp" title="HTML5 <audio> autoplay 属性">autoplay</a></td>
    <td>autoplay</td>
    <td>如果出现该属性，则音频在就绪后马上播放。</td>
  </tr>
  <tr>
    <td class="html5_new"><a href="/tags/att_audio_controls.asp" title="HTML5 <audio> controls 属性">controls</a></td>
    <td>controls</td>
    <td>如果出现该属性，则向用户显示控件，比如播放按钮。</td>
  </tr>
    <tr>
    <td class="html5_new"><a href="/tags/att_audio_loop.asp" title="HTML5 <audio> loop 属性">loop</a></td>
    <td>loop</td>
    <td>如果出现该属性，则每当音频结束时重新开始播放。</td>
  </tr>
  <tr>
    <td class="html5_new"><a href="/tags/att_audio_preload.asp" title="HTML5 <audio> preload 属性">preload</a></td>
    <td>preload</td>
    <td>如果出现该属性，则音频在页面加载时进行加载，并预备播放如果使用 "autoplay"，则忽略该属性。</td>
  </tr>
  <tr>
    <td class="html5_new"><a href="/tags/att_audio_src.asp" title="HTML5 <audio> src 属性">src</a></td>
    <td><i>url</i></td>
    <td>要播放的音频的 URL。</td>
  </tr>
</tbody></table>


**② 视频**
```html
<video src="movie.ogg" controls="controls"></video>
<!-- 静音播放 -->
<video width="320" height="240" autoplay="autoplay" muted="muted" loop="loop"> 
  <source src="movie.ogg" type="video/ogg">
  <source src="movie.mp4" type="video/mp4">
</video>
```

<br/>


## HTML5表单新特性

HTML 和 HTML5 在表单方面的主要区别在于 HTML5 引入了一系列新的表单元素和属性，这些改进增强了表单的交互性、可用性和数据验证能力。下面将详细解释这些区别，并给出相应的示例。

### 1. 新的表单输入类型

   HTML5 为 `<input>` 标签引入了一些新的 type 属性值，这些值提供了不同的输入控件，使得收集数据更加便捷。例如：

- email：用于电子邮件地址的输入。
- date：用于选择日期的输入。
- number：用于数字的输入，可以通过 min、max、step 等属性进行范围限制和步长设置。
- range：用于一定范围内的数字输入，通常显示为滑动条。
- color：用于颜色选择。
- search：用于搜索字段，在某些浏览器中显示为圆角框。
- tel：用于电话号码的输入，虽然不会进行电话号码格式的验证，但提供了语义化的提示。

示例：

```html
<form>  
  <label for="email">电子邮件:</label>  
  <input type="email" id="email" name="email" required>  

<label for="birthdate">出生日期:</label>  
<input type="date" id="birthdate" name="birthdate">

<label for="quantity">数量:</label>  
<input type="number" id="quantity" name="quantity" min="1" max="10" step="1">
</form>
```

### 2. 表单验证

HTML5 提供了原生的表单验证功能，通过在表单控件上添加 required 属性，可以确保用户在提交表单前填写了必填字段。此外，新的输入类型如 email 会自动验证输入内容是否符合相应的格式。

示例：

```html
<form>  
  <label for="username">用户名:</label>  
  <input type="text" id="username" name="username" required>  

<label for="email">电子邮件:</label>  
<input type="email" id="email" name="email" required>

  <input type="submit" value="提交">  
</form>
```

### 3. 新的表单属性
- autofocus：此属性规定在页面加载时，哪个表单元素应自动获得焦点。
- placeholder：此属性提供了一种在表单元素中显示提示信息的机制，通常显示为灰色的占位文本。
- form：此属性允许你将表单控件与表单本身分离，使得布局更加灵活。
- novalidate：将此属性添加到 `<form>` 标签可以禁用浏览器的默认验证。

示例：

```html
<form>  
  <label for="fname">名字:</label>  
  <input type="text" id="fname" name="fname" placeholder="请输入你的名字" autofocus>  

  <input type="submit" value="提交">  
</form>
```

### 4. 进度和度量
HTML5 引入了 `<progress>` 和 `<meter>` 元素，分别用于表示任务的进度和特定范围的度量。

示例：

```html
<progress value="70" max="100">70%</progress>
<meter value="0.8" min="0" max="1">80%</meter>
```

### 5. 表单输出
   HTML5 的 `<output>` 元素表示计算结果或用户操作的结果。

示例：

```html
<form oninput="result.value=parseInt(a.value)+parseInt(b.value)">  
  <input type="number" id="a" value="5"> +  
  <input type="number" id="b" value="3"> =  
  <output name="result"></output>  
</form>
```
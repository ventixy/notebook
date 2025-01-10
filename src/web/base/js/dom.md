---

order: 8
title: DOM和BOM

---

## DOM文档对象模型

文档对象模型（Document Object Model，简称DOM），是一个用于表示HTML、XML等结构化文档的编程接口。

DOM将一个文档视作一个由节点构成的树型结构，每个节点代表文档中的一个部分，比如一个元素（如`<p>`标签）、文本节点、属性或者注释等。

DOM的核心概念包括：

1. **节点（Node）**：文档中的每个内容都是一个节点，包括元素节点、属性节点、文本节点等。
2. **元素（Element）**：HTML或XML中的标签即为元素节点，可以有属性和子节点（如文本节点或其它元素节点）。
3. **属性（Attribute）**：元素上的特性，如`<img src="image.jpg">`中的`src`就是一个属性。
4. **文档对象（Document Object）**：代表整个文档的根节点，是访问文档中其他所有节点的起点。



### 获取DOM元素

**1. 根据ID获取元素**

使用 `getElementById` 方法可以获取具有特定ID的元素。ID应该是文档中唯一的，因此这个方法返回的是一个单独的元素或`null`（如果没有找到匹配的元素）。

```javascript
// 假设有一个ID为"myElement"的元素
var element = document.getElementById("myElement");
console.log(element);
```
上述代码会找到ID为`myElement`的DOM元素，并将其引用存储在变量`element`中。


**2. 根据标签名获取元素**

使用 `getElementsByTagName` 方法可以获取具有特定标签名的所有元素。这个方法返回一个HTMLCollection集合，即使只找到一个匹配的元素也是如此。

```javascript
// 获取所有<p>元素
var paragraphs = document.getElementsByTagName("p");
console.log(paragraphs);
```
上述代码会找到所有`<p>`标签的DOM元素，并将它们的引用存储在一个名为`paragraphs`的HTMLCollection中。



**3. H5新增获取元素方式**

HTML5引入了新的DOM选择方法，例如：

- **getElementsByClassName**：根据类名获取元素，返回一个HTMLCollection。
- **querySelector**：根据CSS选择器获取第一个匹配的元素。
- **querySelectorAll**：根据CSS选择器获取所有匹配的元素，返回一个NodeList。

```javascript
// 使用getElementsByClassName
var elementsWithClass = document.getElementsByClassName("specialClass");
console.log(elementsWithClass);

// 使用querySelector获取第一个匹配的元素
var firstMatch = document.querySelector(".anotherClass");
console.log(firstMatch);

// 使用querySelectorAll获取所有匹配的元素
var allMatches = document.querySelectorAll("#container p");
console.log(allMatches);
```
- `getElementsByClassName` 示例会找到所有拥有`specialClass`类的元素。
- `querySelector` 示例会找到第一个拥有`.anotherClass`类的元素。
- `querySelectorAll` 示例会找到`#container`内的所有`<p>`元素。


除了上述方法，可以通过属性选择器、组合选择器等方式利用`querySelector`或`querySelectorAll`来获取。

```javascript
// 获取所有checked的checkbox
var checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
console.log(checkedCheckboxes);
```
上述代码会找到所有被选中的复选框元素，即`type`属性为`checkbox`且处于`checked`状态的`<input>`元素。



### DOM节点操作

1. **创建元素节点**：
   - **方式1**：使用`document.createElement()`创建了一个新的`<p>`元素，并设置了其文本内容。
   - **方式2**：直接通过`innerHTML`属性给`container`的内部HTML赋值，这种方式简便但会替换原有的所有内容。
   - **方式3**：使用`insertAdjacentHTML()`方法在`container`内部的末尾插入HTML字符串，这种方式不会影响已有的内容。

2. **删除节点**：找到`container`的最后一个子元素并使用`removeChild()`方法将其删除。

3. **复制（克隆）节点**：通过`cloneNode(true)`方法深复制第一个子元素（即第一个`<p>`元素），然后将克隆得到的元素追加到`container`的末尾。

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>DOM操作示例</title>
<script>
window.onload = function() {
  // 获取节点
  var container = document.getElementById('container'); // 通过ID获取容器元素

  // 创建元素节点
  // 方式1：使用document.createElement()
  var newElement1 = document.createElement('p');
  newElement1.textContent = '我是通过createElement创建的段落。';
  
  // 方式2：innerHTML直接赋值（注意这会覆盖容器内原有内容）
  var newHTML = '<p>我是通过innerHTML直接赋值的方式创建的段落。</p>';
  container.innerHTML = newHTML;
  
  // 方式3：使用insertAdjacentHTML()，不会覆盖原有内容
  container.insertAdjacentHTML('beforeend', '<p>我是通过insertAdjacentHTML创建的段落。</p>');
  
  // 将新创建的元素添加到容器中
  container.appendChild(newElement1);

  // 删除节点
  var lastChild = container.lastElementChild;
  if (lastChild) {
    container.removeChild(lastChild); // 删除最后一个子元素
  }

  // 复制（克隆）节点
  var firstP = container.firstElementChild;
  if (firstP) {
    var clonedP = firstP.cloneNode(true); // true表示深复制，包括子元素和属性
    container.appendChild(clonedP); // 将克隆的节点添加到容器末尾
  }
};
</script>
</head>
<body>
<div id="container">
  <!-- 此处将进行DOM操作 -->
</div>
</body>
</html>
```

::: info document.write()
实际上，`document.write()`方法不推荐用于创建或修改现有的DOM元素，因为它主要用于在页面加载过程中直接向文档流中写入HTML内容。一旦文档加载完成（即`document.readyState`变为`interactive`或`complete`），再调用`document.write()`会清空当前文档并重新开始写入新的HTML，导致丢失原有的DOM结构和事件绑定。

以下是使用`document.write()`直接在页面输出HTML内容的一个简单示例，但请注意这不是推荐的做法来创建或管理DOM元素：

```html
<!DOCTYPE html>
<html>
<head>
<title>Document Write 示例</title>
<script>
window.onload = function() {
  // 不推荐的做法：使用document.write在页面加载后写入内容
  // 注意：这会覆盖页面现有内容！
  document.write('<p>这是通过document.write添加的段落。</p>');
};
</script>
</head>
<body>
<!-- 页面原始内容 -->
</body>
</html>
```

**重要提示**：在现代Web开发实践中，应使用如`createElement`、`appendChild`、`innerHTML`或`insertAdjacentHTML`等方法来操作DOM，这些方法更加灵活且不会破坏已有页面结构。对于创建元素节点，推荐使用如下所示的更现代和安全的方法：

```javascript
var newElement = document.createElement('p');
newElement.textContent = '通过createElement创建的内容';
document.body.appendChild(newElement);
```

这样不仅能够安全地添加新元素，还能够更好地控制和维护DOM结构。
:::



### DOM事件

DOM事件是用户与网页交互（如点击、鼠标移动、键盘输入等）或某些页面状态变化（如加载完成）时触发的响应机制。事件处理是Web开发中的核心概念之一。

**常见事件**：
- `click`： 鼠标点击
- `mouseover` / `mouseout`：鼠标悬停/离开
- `keydown` / `keyup`：按键按下/释放
- `load`：页面或资源加载完成
- `submit`：表单提交
- `change`：表单元素值改变
- `mousemove`：鼠标移动

通过DOM API，可以为页面上的元素添加、移除事件监听器，以及阻止事件的默认行为或传播。

::: info DOM事件操作
#### 注册和删除事件
- **内联方式**：在HTML元素中直接使用 `onclick`、`onmouseover` 等属性。通过元素的事件属性直接赋值一个函数。
    删除事件方式：直接将事件属性设置为 `null`。
- **监听注册方式**：使用 `addEventListener` 方法，可以为同一个元素的同一事件添加多个监听器
    删除事件方式：使用 `removeEventListener`，需要传递与注册时相同的参数。


#### 事件冒泡与捕获

- **事件冒泡**：事件从最深的节点开始，逐级向上层节点传播直到文档根。
- **事件捕获**：与冒泡相反，事件先从根节点开始，向目标节点传播。

#### 事件对象和事件委托

事件对象（如 `event`）在事件处理函数中自动传递，包含了与事件相关的信息，如 `event.type`（事件类型）、`event.target`（事件源）等。

事件委托是一种高效的事件处理方式，通过在父元素上监听事件，利用事件冒泡机制处理子元素的事件。这对于动态生成的元素特别有效。
:::



下面是一个演示了事件委托、自定义属性和事件对象使用的简单示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>DOM 事件示例</title>
<style>
  .list-item { cursor: pointer; }
</style>
<script>
document.addEventListener('DOMContentLoaded', function() {
  // 父元素委托处理子元素的点击事件
  document.getElementById('listContainer').addEventListener('click', function(event) {
    // 确保点击的是列表项
    if (event.target.classList.contains('list-item')) {
      // 使用事件对象访问自定义属性
      var itemId = event.target.dataset.itemId;
      alert('你点击了项目ID: ' + itemId);
      
      // 阻止事件冒泡到document级别
      event.stopPropagation();
    }
  });

});
</script>
</head>
<body>
<div id="listContainer">
  <div class="list-item" data-item-id="1">项目1</div>
  <div class="list-item" data-item-id="2">项目2</div>
  <div class="list-item" data-item-id="3">项目3</div>
</div>
</body>
</html>
```

- 使用 `DOMContentLoaded` 事件确保DOM加载完成后再执行脚本。
- 在 `listContainer` 上通过事件委托监听 `click` 事件，节省资源，适用于动态添加的列表项。
- 判断点击的目标是否含有 `list-item` 类，以确保只处理列表项的点击。
- 通过 `event.target.dataset.itemId` 访问自定义属性 `data-item-id`，显示点击项目的ID。
- 调用 `event.stopPropagation();` 阻止事件继续向上冒泡。



## BOM浏览器对象模型

浏览器对象模型（Browser Object Model，简称BOM）是针对浏览器窗口和框架的JavaScript对象的集合，它提供了与浏览器窗口进行交互的能力。

BOM没有一个统一的标准，这意味着不同的浏览器可能会有不同的实现，这为跨浏览器兼容性带来了挑战。尽管如此，大部分现代浏览器遵循了类似的模式，确保了基本功能的一致性。


### BOM常用对象

BOM（Browser Object Model，浏览器对象模型）提供了与浏览器窗口及功能交互的一系列对象。

1. **window对象**：==BOM的核心对象，代表浏览器窗口，也是ECMAScript的全局对象==。它包含了所有全局变量和函数，并且是其他BOM对象的宿主。

2. **document对象**：代表当前页面的HTML文档，是window对象的一个属性。通过它可以访问和操作页面中的所有元素。

3. **location对象**：提供了当前页面URL的信息，并且可以使用它来导航到新的URL。

4. **navigator对象**：提供了关于浏览器的信息，如名称、版本和用户代理字符串。

5. **screen对象**：提供了关于用户屏幕的信息，如可用宽度、高度、色彩深度等。



下面的代码示例展示了如何使用这些对象来获取和显示一些基本信息：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>BOM常用对象示例</title>
</head>
<body>

<script>
    // 使用window对象的alert方法显示信息
    window.alert("欢迎来到BOM示例页面!");

    // 使用document对象获取并显示页面标题
    var pageTitle = document.title;
    alert("页面标题是: " + pageTitle);

    // 使用location对象获取当前页面URL并显示
    var currentURL = window.location.href;
    alert("当前页面的URL是: " + currentURL);

    // 使用navigator对象获取浏览器信息
    var browserInfo = "浏览器名称: " + navigator.appName + "\n版本: " + navigator.appVersion;
    alert(browserInfo);

    // 使用screen对象获取屏幕信息
    var screenWidth = screen.width;
    var screenHeight = screen.height;
    alert("您的屏幕分辨率为: " + screenWidth + "x" + screenHeight);
</script>

</body>
</html>
```


### BOM常见事件

BOM（浏览器对象模型）提供了一系列事件，允许开发者监听和响应浏览器窗口、框架、以及文档的各种状态变化和用户交互

**1. `onload` 事件**

当整个页面（包括所有依赖资源如图片、样式表、脚本等）加载完成时触发。常用于执行那些需要确保所有页面资源都已加载完毕的代码，比如初始化脚本、计算布局等。

```html
<!DOCTYPE html>
<html>
<head>
    <title>OnLoad 示例</title>
    <script>
        window.onload = function() {
            alert("页面加载完成了！");
            // 这里可以执行需要在页面加载完毕后执行的代码
        };
    </script>
</head>
<body>
    <h1>欢迎来到我的网站</h1>
    <img src="example.jpg" alt="示例图片" />
</body>
</html>
```

**2. `onbeforeunload` 和 `onunload` 事件**

- `onbeforeunload`：在窗口、文档或资源即将卸载前触发，常用于提示用户确认是否离开页面（例如，当表单数据未保存时）。
- `onunload`：在窗口、文档完全卸载后触发，适合执行清理工作，但由于兼容性和性能问题，此事件使用较少。

```html
<!DOCTYPE html>
<html>
<head>
    <title>OnBeforeUnload 示例</title>
    <script>
        window.onbeforeunload = function() {
            return "你确定要离开吗？你可能有未保存的数据。";
        };
    </script>
</head>
<body>
    <h1>请填写表单</h1>
    <!-- 表单内容省略 -->
</body>
</html>
```

**3. `onscroll` 事件**

当元素的滚动条位置发生变化时触发。常用于实现滚动监听，如无限滚动加载、固定导航栏等效果。

```html
<!DOCTYPE html>
<html>
<head>
    <title>OnScroll 示例</title>
    <style>
        #scrollArea {
            height: 200px;
            overflow-y: scroll;
            border: 1px solid black;
        }
    </style>
    <script>
        document.getElementById('scrollArea').onscroll = function() {
            console.log("滚动中...");
            // 这里可以添加滚动时执行的逻辑
        };
    </script>
</head>
<body>
    <div id="scrollArea">
        <p>内容...</p>
        <!-- 大量重复内容以产生滚动条 -->
    </div>
</body>
</html>
```

**4. `onresize` 事件**

当浏览器窗口被调整大小时触发。可用于响应式设计，调整页面布局或元素尺寸。

```html
<!DOCTYPE html>
<html>
<head>
    <title>OnResize 示例</title>
    <script>
        window.onresize = function() {
            console.log("窗口大小改变了...");
            // 这里可以添加调整窗口大小时的响应逻辑
        };
    </script>
</head>
<body>
    <h1>调整窗口大小试试看</h1>
</body>
</html>
```


### 移动端触屏事件

移动端触屏事件（Touch Events）是专为触摸屏设备设计的一组事件，允许开发者捕获和响应用户的触摸交互，如轻触、滑动、长按等。

::: info 实现拖动
在实现拖动功能时，主要涉及到三个核心的触屏事件：`touchstart`、`touchmove`、`touchend`，有时还会用到`touchcancel`。

1. **touchstart**: 当用户的手指首次触摸屏幕时触发。这通常是拖动操作开始的信号。

2. **touchmove**: 当用户在屏幕上移动已放置的手指时触发。这个事件会在手指移动的过程中持续触发，可以用来跟踪手指的移动轨迹。

3. **touchend**: 当用户的手指从屏幕上抬起时触发。这标志着拖动操作的结束。

4. **touchcancel**: 当系统取消了触摸过程，如来电、系统对话框弹出等情况导致的触摸中断时触发。

**实现拖动的三个步骤**: 

1. **初始化**: 在`touchstart`事件中记录初始触点的位置，并设置标志表示拖动已经开始。

2. **跟踪移动**: 在`touchmove`事件中计算手指移动的距离，并根据这个距离更新元素的位置，实现视觉上的拖动效果。

3. **结束**: 在`touchend`事件中清除拖动标志，可以做一些收尾工作，比如限制元素移动范围、保持一定的动画效果等。
:::


以下是一个简单的HTML页面，使用JavaScript实现一个可拖动的`<div>`元素：

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>移动端拖动示例</title>
<style>
.draggable {
  width: 100px;
  height: 100px;
  background-color: red;
  position: absolute;
}
</style>
<script>
document.addEventListener('DOMContentLoaded', function() {
  var draggable = document.getElementById('draggable');
  var startX, startY, isDragging = false;

  draggable.addEventListener('touchstart', function(e) {
    e.preventDefault(); // 防止页面滚动
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  draggable.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    e.preventDefault(); // 防止页面滚动
    var newX = e.touches[0].clientX;
    var newY = e.touches[0].clientY;
    var diffX = newX - startX;
    var diffY = newY - startY;
    draggable.style.transform = `translate(${diffX}px, ${diffY}px)`;
  });

  draggable.addEventListener('touchend', function(e) {
    isDragging = false;
  });
});
</script>
</head>
<body>
<div id="draggable" class="draggable"></div>
</body>
</html>
```
在这个示例中首先获取了一个带有`draggable`类名的`<div>`元素，并为其添加了`touchstart`、`touchmove`、`touchend`事件监听器。当用户触摸并开始移动这个`<div>`时，它会跟随手指移动，实现拖动效果。注意，这里使用了CSS的`transform`属性来改变元素的位置，而不是直接修改`left`和`top`，因为`transform`更高效且不会引发页面重排。



### BOM定时器

BOM中的定时器功能允许开发者在特定的时间间隔之后执行代码，这对于创建动态和交互式的Web应用程序非常有用。主要通过两个函数来实现：`setTimeout` 和 `setInterval`。

**1. `setTimeout`**

`setTimeout`函数用于在指定的时间（以毫秒为单位）之后调用一次指定的函数或者执行一段代码。它返回一个ID，可以用来取消这个定时器（通过`clearTimeout`函数）。

```javascript
var timeoutID = setTimeout(function|code, delay[, arg1, arg2, ...]);
```

- `function|code`：要执行的函数或者一段代码（字符串形式）。
- `delay`：延迟时间，单位为毫秒。
- `arg1, arg2, ...`：传递给函数的参数（如果`function|code`是函数的话）。

```javascript
function sayHello() {
    console.log("你好，世界！");
}

// 在2秒后执行sayHello函数
var timeoutID = setTimeout(sayHello, 2000);
```

**2. `setInterval`**

`setInterval`函数用于按照指定的周期（以毫秒为单位）重复调用函数或者执行代码段。与`setTimeout`不同，它会持续执行，直到被显式地清除（通过`clearInterval`函数）。

```javascript
var intervalID = setInterval(function|code, interval[, arg1, arg2, ...]);
```

`function|code`、`interval`、`arg1, arg2, ...` 的含义同上。

```javascript
function showTime() {
    var now = new Date();
    console.log(now.toLocaleTimeString());
}

// 每隔1秒执行一次showTime函数
var intervalID = setInterval(showTime, 1000);
```

**清除定时器**：

- 使用`clearTimeout(timeoutID)`来取消由`setTimeout`设置的定时器。
- 使用`clearInterval(intervalID)`来取消由`setInterval`设置的定时器。

```javascript
var timeoutID = setTimeout(function() {
    console.log("这个消息将不会显示");
}, 6000);

// 在3秒后清除定时器，防止消息显示
setTimeout(function() {
    clearTimeout(timeoutID);
    console.log("定时器已清除");
}, 3000);
```



### this指向问题

在JavaScript中，`this`关键字的指向问题是一个复杂且经常引起混淆的概念，尤其是在BOM（Browser Object Model）的上下文中。`this`的值通常取决于函数调用的上下文，而不是函数定义的位置。在BOM中，`this`通常指向调用当前函数的对象，但在不同的场景下，它的指向可能会有所不同。

**1. 全局上下文中的`this`**

在全局作用域中，非严格模式下，`this`指向全局对象（在浏览器环境中是`window`对象）。在严格模式（'use strict';）下，`this`会是`undefined`。

```javascript
console.log(this === window); // true，非严格模式下
```

**2. 函数调用中的`this`**

- 在普通函数调用中，如果函数不是作为某个对象的方法被调用，`this`同样会指向全局对象（非严格模式）或`undefined`（严格模式）。
- 如果函数是作为某个对象的方法调用，`this`则指向该对象。

```javascript
var obj = {
    func: function() {
        console.log(this === obj); // true
    }
};
obj.func(); // 方法调用，this指向obj
```

**3. 构造函数中的`this`**

当使用`new`关键字调用构造函数时，`this`指向新创建的实例对象。

```javascript
function Person(name) {
    this.name = name;
    console.log(this); // 新创建的Person实例
}
var person = new Person("Alice");
```

**4. DOM事件处理函数中的`this`**

在为DOM元素绑定事件处理器时，无论使用匿名函数还是命名函数，`this`通常指向触发事件的DOM元素本身。

```html
<button id="myButton">点击我</button>
<script>
document.getElementById("myButton").addEventListener("click", function() {
    console.log(this === document.getElementById("myButton")); // true
});
</script>
```

**5. `setTimeout`和`setInterval`中的`this`**

在使用`setTimeout`或`setInterval`时，由于它们是在全局上下文中执行回调函数，非箭头函数情况下，`this`通常会指向全局对象。使用箭头函数可以维持外层的`this`值。

```javascript
var obj = {
    myMethod: function() {
        setTimeout(function() {
            console.log(this === window); // true，非严格模式
            // 或者 undefined，严格模式
        }, 1000);
        
        setTimeout(() => {
            console.log(this === obj); // true，箭头函数维持外层的this
        }, 2000);
    }
};
obj.myMethod();
```

`this`的指向在JavaScript中较为灵活，需根据函数的调用方式、所在环境（全局、对象方法、构造函数等）、以及是否使用箭头函数等因素综合判断。在BOM编程中，理解`this`的行为对于正确处理事件、定时器等功能至关重要。



### 元素位置和尺寸

**元素偏移量offset**：

偏移量（offset）是指元素相对于其带有定位（position不是static的）的最近父元素的左上角位置。这包括了任何边距、边框和滚动的距离。主要通过`offsetTop`、`offsetLeft`、`offsetWidth`和`offsetHeight`四个属性获取。

```javascript
function logOffset(elementId) {
  var element = document.getElementById(elementId);
  console.log("Offset Top: " + element.offsetTop);
  console.log("Offset Left: " + element.offsetLeft);
  console.log("Offset Width: " + element.offsetWidth);
  console.log("Offset Height: " + element.offsetHeight);
}

logOffset('myElement');
```

**元素可视区client**：

可视区（client）是指元素内部没有被滚动条隐藏的部分，即用户当前可见的部分的尺寸。主要通过`clientTop`、`clientLeft`、`clientWidth`和`clientHeight`属性获取。

```javascript
function logClient(elementId) {
  var element = document.getElementById(elementId);
  console.log("Client Top: " + element.clientTop);
  console.log("Client Left: " + element.clientLeft);
  console.log("Client Width: " + element.clientWidth);
  console.log("Client Height: " + element.clientHeight);
}

logClient('myElement');
```

**元素滚动scroll**：

滚动属性（scroll）反映了元素滚动条的位置以及可滚动区域的尺寸。主要通过`scrollTop`、`scrollLeft`、`scrollWidth`和`scrollHeight`属性获取。

- `scrollTop`/`scrollLeft`: 获取或设置元素在垂直/水平方向上被卷起的像素数。
- `scrollWidth`/`scrollHeight`: 获取元素内容总宽度/高度，包括不可见的部分（可能由于滚动而未显示）。

```javascript
function logScroll(elementId) {
  var element = document.getElementById(elementId);
  console.log("Scroll Top: " + element.scrollTop);
  console.log("Scroll Left: " + element.scrollLeft);
  console.log("Scroll Width: " + element.scrollWidth);
  console.log("Scroll Height: " + element.scrollHeight);
}

logScroll('myScrollableElement');
```

在实际应用中，这些属性的准确值可能会受到CSS样式（如`box-sizing`、`overflow`等）的影响，因此在使用时需要考虑样式上下文。




## jQuery函数库

jQuery是一个JavaScript函数库（是一个轻量级的 "写的少，做的多" 的库），由John Resig于2006年创建。

jQuery的官网地址： https://jquery.com/  


以下是jQuery的主要特点和功能概述：

1. **DOM操作简化**：jQuery提供了一套简单易用的API来选取和操作DOM元素，比如添加、删除、修改元素以及遍历DOM树，使得这些操作比原生JavaScript更加直接和高效。

2. **事件处理**：它有一套统一的事件处理机制，使得跨浏览器的事件绑定变得简单一致，同时支持事件委托，提高性能和灵活性。

3. **CSS操作**：jQuery可以轻松地操作元素的样式，包括添加、移除、切换CSS类，以及直接操作元素的样式属性。

4. **动画效果**：内置了一系列动画方法，如淡入淡出、滑动和自定义动画，使得网页元素的动态效果实现变得轻而易举。

5. **Ajax支持**：简化了Ajax请求的发送过程，提供了对XML、JSON等多种数据格式的支持，以及错误处理和成功回调的简单配置。

6. **链式操作**：jQuery支持链式编程风格，允许开发者在一个语句中连续调用多个方法，使得代码更加紧凑和易读。

7. **插件系统**：jQuery有一个强大的插件生态系统，开发者可以很容易地为jQuery扩展新功能，或者使用现有的数千个插件来增强应用的功能和效果。

8. **跨浏览器兼容性**：jQuery内部处理了浏览器之间的差异性，确保大部分功能可以在多种浏览器环境中无缝运行，包括老版本的IE浏览器。




### 导入jQuery

```html
<body>
    <!-- 引入jQuery 也可使用cdn等方式引入-->
    <script src="js/jquery-1.11.1.js"></script>
    <script>
        // 入口函数(第一种): 简单易用（推荐使用）
        $(function () {   
            ...  // 此处是页面 DOM 加载完成的入口
        }); 

        // 入口函数(第二种): 繁琐，但是也可以实现
        $(document).ready(function(){
            ...  // 此处是页面DOM加载完成的入口
        });
    </script>
</body>
```

由于其易用性和强大功能，jQuery在很长一段时间内是Web开发的标配，虽然随着现代浏览器对原生JavaScript API的支持增强，以及新的库和框架（如React、Vue.js等）的兴起，jQuery的使用有所减少，但它仍然在很多现有项目和特定场景下发挥着作用。

::: info DOM对象和jQuery对象的相互转换
```javascript
// 1.DOM对象转换成jQuery对象，方法只有一种
var box = document.getElementById('box');  // 获取DOM对象
var jQueryObject = $(box);                 // 把DOM对象转换为 jQuery 对象

// 2.jQuery 对象转换为 DOM 对象有两种方法：
var domObject1 = $('div')[0];             // 2.1 jQuery对象[索引值]
var domObject2 = $('div').get(0)          // 2.2 jQuery对象.get(索引值)
```
实际开发比较常用的是把DOM对象转换为jQuery对象，这样能够调用功能更加强大的jQuery中的方法
:::




### 常用选择器

jQuery 选择器支持已经存在的 CSS 选择器，除此之外它还有一些自定义的选择器、 jQuery 中所有选择器都以美元符号开头：`$()` 

jQuery supports most CSS3 selectors, as well as some non-standard selectors.   [查看官网文档](https://learn.jquery.com/using-jquery-core/selecting-elements/)  

| 常用选择器 | 语法              | 描述                                     |
| ---------------- | ----------------- | ---------------------------------------- |
| 标签选择器       | `$("div")`        | 获取同一类标签的所有元素                 |
| 类选择器         | `$(".className")` | 获取指定类名的元素                       |
| ID选择器         | `$("#id")`        | 获取指定id的元素                         |
| 并集选择器       | `$("div,#id,li")` | 将每一个选择器匹配到的元素合并后一起返回 |
| 全局选择器       | `$("*")`          | 获取所有元素                             |

| jQuery选择器 | 语法               | 描述                                       |
| ------------ | ------------------ | ------------------------------------------ |
| 交集选择器   | `$("div.box")`     | 获取类名为box的div标签（中间没有符号）     |
| 子代选择器   | `$("ul>li")`       | 获取亲儿子层级的元素                       |
| 后代选择器   | `$("ul li")`       | 获取所有后代元素（这里指ul下的所有li元素） |
| 相邻选择器   | `$("label+input")` | 获取前面有一个label标签的input元素         |
| 同辈选择器   | `$("form~input")`  | 获取与form同层级的input元素                |



匹配包含给定属性的元素

```javascript
$("div[id]");                  //获取所有有id属性的div的元素集合
$("div[class]");               //获取所有有class属性的div的元素集合

$("input[name='userName']");   //获取所有input标签中name属性是userName元素的集合

$("input[name^='user']");      //获取所有input标签中name属性是user开头的元素的集合
$("input[name$='user']");      //获取所有input标签中name属性是user结尾的元素的集合
$("input[name*='user']");      //获取所有input标签中name属性包含了user的元素的集合

$("input[id][name^='user']");  //获取所有input标签中既有id属性又有name属性（以user开头）的元素的集合
```



| 选择器             | 语法示例                         | 说明                                                   |
| ------------------ | -------------------------------- | ------------------------------------------------------ |
| parent()           | `$("li"). parent()`              | 查找父级                                               |
| children(selector) | `$("u1").children("1i")`         | 相当于$(ul>li")，最近一级(亲儿子)                      |
| find(selector)     | `$("u1").find("1i")`             | 相当于$("ul li""), 后代选择器                          |
| siblings(selector) | `$(".first").siblings("1i")`     | 查找兄弟节点，不包括自己本身                           |
| nextAll([expr])    | `$(".first").nextAll()`          | 查找当前元素之后所有的同辈元素                         |
| prevtAl1([expr])   | `$(".last").prevAll()`           | 查找当前元素之前所有的同辈元素                         |
| hasClass(class)    | `$('div').hasClass("protected")` | 检查当前的元素是否含有某个特定的类，如果有，则返回true |
| eq(index)          | `$("li").eq(2)`                  | 相当于$("li:eq(2)"), index从o开始                      |



**伪类选择器**：

常用的伪类选择器（Pseudo-Selectors）

| 伪类选择器 | 语法示例            | 描述                                      |
| ---------- | ------------------- | ----------------------------------------- |
| :first     | `$('li:first')`     | 获取第一个li元素                          |
| :last      | `$("li:last")`      | 获取最后一个li元素                        |
| :eq(index) | `$("li:eq(2)")`     | 获取索引号为2的li元素，索引号index从0开始 |
| :odd       | `$("li:odd")`       | 获取索引号为奇数的li元素                  |
| :even      | `$("li:even")`      | 获取索引号为偶数的li元素                  |
| :animated  | `$("div:animated")` | 所有正在执行动画的div元素                 |
| :visible   | `$("div:visible")`  | 获取所有真实可见的元素                    |
| :hidden    | `$("div:hidden")`   | 获取隐藏的元素                            |

**Note:**  这里显示和隐藏是根据它是否真实显示或不显示来判定，并非根据其`visibility` 或 `display` 的值，见文档解释：

When using the `:visible` and `:hidden` pseudo-selectors,  jQuery tests the actual visibility of the element, not its CSS `visibility` or `display` properties.  jQuery looks to see if the element's physical height and width on the page are both greater than zero.



常用的表单选择器

| Selecting Form Elements | 语法示例              | 描述                                                         |
| ----------------------- | --------------------- | ------------------------------------------------------------ |
| :checked                | `$("input:checked")`  | 获取选中的项（checkboxes, radio, selects 均可）              |
| :disabled               | `$("input:disabled")` | any `<input>` elements with the `disabled` attribute         |
| :enabled                | `$("input:enabled")`  | any elements that *do not* have a `disabled` attribute       |
| :input                  | `$("form :input")`    | all `<input>`, `<textarea>`, `<select>`, and `<button>` elements |
| :selected               | `$("form :selected")` | any selected items in `<option>` elements                    |

**Note:**  In order to get the best performance using `:selected`,  first select elements with a standard jQuery selector, then use `.filter( ":selected" )`, or precede the pseudo-selector with a tag name or some other selector.



**Selecting by type**： jQuery provides pseudo selectors to select form-specific elements according to their type

- [`:password`](http://api.jquery.com/password-selector/) ：*Selects all elements of type password.* （use `[type="password"]` instead）

- [`:reset`](http://api.jquery.com/reset-selector/) ：*Selects all elements of type reset* （use `[type="reset"]` instead）

- [`:radio`](http://api.jquery.com/radio-selector/) ：*Selects all elements of type radio* （use `[type="radio"]` instead）

- [`:text`](http://api.jquery.com/text-selector/) ：*Selects all input elements of type text.* （use `[type="text"]` instead）

- [`:submit`](http://api.jquery.com/submit-selector/) ：*Selects all elements of type submit.* （use `input[type="submit"], button[type="submit"]` instead）

- [`:checkbox`](http://api.jquery.com/checkbox-selector/) ：*Selects all elements of type checkbox.* （use `[type="checkbox"]` instead）

- [`:button`](http://api.jquery.com/button-selector/) ：*Selects all button elements and elements of type button.* 

  （first select the elements using a pure CSS selector, then use [`.filter(":button")`](https://api.jquery.com/filter/)）

- [`:image`](http://api.jquery.com/image-selector/) ：*Selects all elements of type image.* （use `[type="image"]` instead）

- [`:file`](http://api.jquery.com/file-selector/) ：*Selects all elements of type file.* （use `[type="file"]` instead）



### 属性和样式

`.attr() `– Get or set the value of the provided attribute

```javascript
var img=$("img");

img.attr("src","img/cat.jpg");      //设置属性
var src=img.attr("src");            //获取属性
img.removeAttr("title");            //移除属性

// Manipulating multiple attributes.
$( "#myDiv a:first" ).attr({
    href: "newDestination.html",
    rel: "nofollow"
});
```

CSS, Styling, & Dimensions ：

jQuery中常用的样式操作有两种：css() 和 设置类样式方法 （注意：css() 多用于样式少时操作，多了则不太方便）

jQuery 可以使用 css 方法来修改简单元素样式； 也可以操作类，修改多个样式

```javascript
// 获取CSS样式属性
$( "h1" ).css( "fontSize" );            // Returns a string such as "19px".

// 设置CSS样式属性
$( "h1" ).css( "fontSize", "100px" );  // Setting an individual property.
 
// 设置多个CSS样式属性
$( "h1" ).css({
    fontSize: "100px",
    color: "red"
});

// Using CSS Classes for Styling
$("div").addClass("redBg");
$("div").addClass("redBg fontColor");
$("div").removeClass("fontColor");
$("div").removeClass();            //没有参数的时候直接移除所有的样式
$("div").toggleClass("fontColor"); //匹配元素如果有当前的样式就删除，如果没有就添加

// Basic dimensions methods.
$( "h1" ).width( "50px" );        // Sets the width of all <h1> elements.
$( "h1" ).width();                // Gets the width of the first <h1> element.
$( "h1" ).height( "50px" );       // Sets the height of all <h1> elements.
$( "h1" ).height();               // Gets the height of the first <h1> element.        
```



**文本属性值**：

jQuery的文本属性值常见操作有三种：`html() 、 text() 、 val()   `、分别对应JS中的 innerHTML 、innerText 和 value 属性

```javascript
$("div").html();               // 获取元素内容 (包括嵌套在内部的标签)
$("div").html("123");          // 设置元素内容 

$("div").text();               // 获取元素文本内容 (不包含标签)
$("div").text("123");          // 设置元素文本内容 

$("input").val();              // 获取表单值 
$("input").val("123");         // 设置表单值 
```



### 元素的操作

​jQuery 元素主要操作方法：遍历、创建、添加和删除，克隆和移动

- **遍历： `each()` 方法**

  each()方法遍历匹配的每一个元素、里面的回调函数有2个参数：索引号和DOM元素对象（不是jquery对象）

  要想使用jquery方法，需要给这个dom元素转换为jquery对象

  ```javascript
  // 1. each() 方法遍历元素 
  $("div").each(function(i, domEle) {
      console.log(i);                    // 回调函数第一个参数一定是索引号
      console.log(domEle);               // dom元素对象、使用jQuery方法需要转换 $(domEle)
      $(domEle).css("color", "red");
  });
  
  // 2. $.each() 方法遍历元素 主要用于遍历数据，处理数据
  $.each(arr, function(i, ele) {
      console.log(i);
      console.log(ele);
  });
  ```

- **创建、添加、删除元素**

  ```js
  // 创建元素
  $("<li></li>");          // 动态的创建了一个li元素
  $("<a/>", {
      html: "This is a <strong>new</strong> link",
      "class": "new",
      href: "foo.html"
  });                      // Creating a new element with an attribute object.
  
  // 添加元素 
  element.append("内容");   // 把内容添加到匹配元素内部最后面，类似原生appendChild
  element.prepend("内容")   // 把内容放入匹配元素内部最前面
  
  element.after("内容");    // 把内容放入目标元素后面
  element.before("内容");   // 把内容放入目标元素前面
  
  // 删除元素
  element.remove();         // 删除元素本身
  element.empty();          // 删除匹配的元素集合中所有的子节点
  element.html("");         // 清空匹配的元素内容
  ```

  内部添加元素，生成之后它们是父子关系。外部添加元素，生成之后他们是兄弟关系

   	`empty()`和`html("")`作用等价，都可以删除元素里面的内容，只不过html还可以设置内容



- **克隆和移动元素**

  ```javascript
  var li=$("#myList li:first").appendTo("#myList");  // 将第一个li移动到最后
  $("#myList").append($( "#myList li:first"));       // 同上
  
  $("#myList li:first").clone().appendTo("#myList"); // 将第一个li复制一份添加到最后
  ```

  
### jQuery事件

jQuery offers convenience methods for most native browser events.  [参照官网关于事件的文档](https://learn.jquery.com/events/event-basics/) 

These methods — including `.click()`, `.focus()`, `.blur()`, `.change()`, etc

```js
// Event setup using a convenience method
$( "p" ).click(function() {
    console.log( "You clicked a paragraph!" );
});

```

2011年11月，jQuery 1.7版发布。该版本新增了新的事件API：`on()`和`off()`、统一了jQuery中所有对文档绑定事件的操作

```js
// Equivalent event setup using the `.on()` method
$( "p" ).on( "click", function() {
    console.log( "click" );
});

// Multiple events, same handler （多个事件、同一个处理函数）
$( "input" ).on(
    "click change", 	// Bind handlers for multiple events
    function() {
        console.log( "An input was clicked or changed!" );
    }
);

// Binding multiple events with different handlers （不同的事件，不同的处理函数）
$( "p" ).on({
    "click": function() { console.log( "clicked!" ); },
    "mouseover": function() { console.log( "hovered!" ); }
});
```



- `on()`: 用于事件绑定，目前最好用的事件绑定方法
- `off()`: 事件解绑

```js
//  on可以实现事件委托（委派）
// click 是绑定在ul 身上的，但是触发的对象是 ul 里面的小li 、相当于： $("ul li").click();
$("ul").on("click", "li", function() {
    alert(11);
});

// on可以给未来动态创建的元素绑定事件
$("ol").on("click", "li", function() {
    alert(11);
})
var li = $("<li>我是后来创建的</li>");
$("ol").append(li);
```

off()方法可以移除通过on()方法添加的事件处理程序

```javascript
$("p").off();                 // 解绑p元素所有事件处理程序
$("p").off( "click");         // 解绑p元素上面的点击事件
$("ul").off( "click", "li");  // 解绑事件委托
```

如果有的事件只想触发—次，可以使用`one()`来绑定事件

```javascript
$("p").one("click", function() {
    alert(11);
});
```



`trigger() / triggerHandler()`: 事件触发

```javascript
// 1. 元素.事件()、会触发元素的默认行为
$("div").click();

// 2. 元素.trigger("事件")、会触发元素的默认行为
$("input").trigger("focus");  

// 3. 元素.triggerHandler("事件") 但是不会触发元素的默认行为
$("input").triggerHandler("focus");

// 绑定事件
$("div").on("click", function() { alert(11);});
$("input").on("focus", function() { $(this).val("你好吗");});
```



### 生成二维码

jquery.qrcode.js 是一个纯浏览器 生成 QRcode 的 jQuery 插件（可以从https://github.com/jeromeetienne/jquery-qrcode 获取）

它使用非常简单，生成的 QRcode 无需下载图片，并且不依赖第三方服务，插件压缩之后大小小于 4K


使用步骤：

1. 下载并引入 [Jquery.js](file/jquery-1.11.1.js) 文件、[jquery.qrcode.js](file/jquery.qrcode.js) 文件、 （utf-16转utf-8:  [utf.js](file/utf.js) ）

   ```html
   <script src="js/jquery-1.11.1.js"></script>
   <script src="js/jquery.qrcode.js"></script>
   <script src="js/utf.js"></script>
   ```

2. 网页中编写一个div 用于显示二维码

   ```html
   <div id="qrcode"></div>
   ```

3. 通过jquery对象的qrcode函数生成二维码

   ```javascript
   // 准备二维码的规格对象(JSON)
   var config  = {
       width:数字,	           // 值是number类型, 表示的单位是px  必须传递
       height:数字,	           // 值是number类型, 表示的单位是px  必须传递 
       text:"内容",	           // text就表示二维码中存储的数据  必须传递
       correctLevel:数字,       // 取值为0|1|2|3 表示二维码的纠错级别0:L/1:M/2:Q/3:H ,默认0  可选参数
       background:"#rrggbb",   // 默认白色, 表示二维码的后景颜色 可选参数
       foreground:"#rrggbb",   // 默认黑色, 表示二维码的前景颜色 可选参数
       render:"绘制模式"        // 取值:table/canvas , 默认table 可选参数
   };
   // 通过选择器, 查找到上述的div ,得到Jquery对象, 通过jquery对象的qrcode函数生成二维码
   $("#qrcode").qrcode(config);
   ```


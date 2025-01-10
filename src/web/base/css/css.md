---

order: 1
title: CSS选择器与盒模型

---





## CSS基础和样式

### 书写规范及注释

1. **属性名与值全部小写**：CSS中标签名、属性名和属性值都使用小写。
2. **属性名和属性值之间保留一个空格**：如`color: red;`。
3. **语句结尾加分号**：每条CSS语句的结尾加分号，即使是最后一条规则。
4. **缩进与对齐**：用两个或四个空格进行缩进，确保代码结构清晰。

**注释**：
  ```css
  /* 这是单行注释 */
  p {
      color: red; /* 行内注释 */
  }

  /*
   * 这是多行注释，
   * 可以分为几行
   */
  ```


### 样式表分类

- **内联样式表（Inline CSS）**：
  直接在HTML元素的`style`属性中写CSS。优点是简单，不用替换文件；缺点是可维护性差，不易复用。
  
  ```html
  <p style="color: blue; font-size: 16px;">这是一个段落。</p>
  ```

- **内部样式表（Internal CSS）**：
  在HTML文件的`<style>`标签中书写CSS。适用于单独页面的样式定义。
  
  ```html
  <style>
    p {
        color: blue;
        font-size: 16px;
    }
  </style>
  ```

- **外部样式表（External CSS）**：
  在单独的CSS文件中书写，然后通过HTML的`<link>`标签引用。适用于多个页面共享样式。
  
  ```html
  <!-- HTML 文件 -->
  <link rel="stylesheet" href="styles.css">
  
  /* styles.css 文件 */
  p {
      color: blue;
      font-size: 16px;
  }
  ```

**注意事项**：
- 优先在项目中使用外部样式表以提高代码复用性和可维护性。
- 内部样式表适用于单页面快速开发和测试。
- 内联样式应尽量避免，以保持HTML的整洁和可读性。


### 常用样式介绍

- **颜色（Color）**：`color`用来设置文本颜色，`background-color`用来设置背景颜色。
- **字体（Font）**：`font-family`用来设置字体，`font-size`用来设置字体大小，`font-weight`用来设置字体粗细。
- **文本（Text）**：`text-align`用来设置文本对齐方式，`text-decoration`用来设置文本装饰，`line-height`用来设置行高。
- **页面布局（Layout）**：`display`用来设置元素显示方式，`position`用来设置元素定位方式，`margin`用来设置外边距，`padding`用来设置内边距。
- **边框（Border）**：`border-width`用来设置边框宽度，`border-style`用来设置边框样式，`border-color`用来设置边框颜色。

```css
/* 设置段落样式 */
p {
    color: blue; /* 字体颜色 */
    font-size: 16px; /* 字体大小 */
    line-height: 1.5; /* 行高 */
}

/* 设置容器样式 */
.container {
    width: 80%; /* 容器宽度 */
    margin: 0 auto; /* 自动外边距（水平居中） */
    padding: 20px; /* 内边距 */
    border: 2px solid black; /* 边框 */
}
```



### 背景颜色和图片

| 属性                    | 作用                        | （常用）值                                   |
| --------------------- | :---------------------- | :--------------------------------------- |
| `background-color`    | 背景颜色                   | 预定义的颜色值 / 十六进制 / RGB / RGBA   |
| `background-image`    | 背景图片                   | `url(图片路径)`                          |
| `background-repeat`   | 是否平铺 (复用)              | `repeat` / `no-repeat` / `repeat-x` / `repeat-y` |
| `background-position` | 背景图片位置的起始位置           | `length` / `position`                   |
| `background-attachment` | 背景固定还是滚动            | `scroll` / `fixed`                       |
| `background`           | 综合简写                    | `color url(图片路径) repeat attachment position;` |

注: **background-position**  必须先指定`background-image`属性，常用于背景图片居中对齐。

#### `background-position` 详细讲解
- `position`语法：`background-position: <horizontal> <vertical>;`
- 值可以是长度单位 (如 `px`, `em`), 或者方位名词 (如 `left`, `center`, `right`, `top`, `bottom`)

**示例解释**：
   ```css
   background-position: right top;       /* 背景图片右上角对齐容器右上角 */
   background-position: center center;   /* 背景图片居中对齐 */
   background-position: right;           /* 背景图片水平靠右，垂直居中 */
   background-position: 10px 50px;       /* 背景图片从容器左上角 10px 右移, 50px 下移 */
   background-position: 10px;            /* 背景图片从容器左上角 10px 右移，垂直居中 */
   background-position: right 20px;      /* 背景图片水平靠右，垂直移动 20px */
   ```
```css
/*--- 背景颜色样式示例 ---*/

/* 背景颜色设置 */
.bg-color-example {
    background-color: #00aaff; /* 十六进制颜色 */
}

/* 背景图片设置 */
.bg-image-example {
    background-image: url('background.jpg'); /* 背景图片 */
    background-repeat: no-repeat;   /* 不重复背景图片 */
    background-position: center center; /* 背景图片居中 */
    background-attachment: fixed;   /* 背景图片固定不滚动 */
}

/* 背景透明设置 */
.bg-transparent-example {
    background: rgba(166, 166, 255, 0.1); /* 将背景颜色设为半透明 */
}

/* 背景简写示例 */
.bg-shortcut-example {
    background: #00aaff url('background.jpg') no-repeat fixed center; /* 背景简写 */
    /* 同时使用背景颜色和背景图像时，背景颜色会在图片后面显示，图片加载完成后覆盖在颜色之上。 */
}
```



### 文本和字体样式

#### 文本属性

| 文本属性        | 表示     | 注意点                                                                                 |
| :-------------- | :------- | :----------------------------------------------------------------------------------- |
| `color`         | 颜色     | 预定义的颜色值 / 十六进制 / RGB代码（常用十六进制，比如: `#fff`）                          |
| `line-height`   | 行高     | 控制行与行之间的距离，通常以数字、百分比或长度单位表示                                   |
| `text-align`    | 水平对齐 | 可以设定文字水平的对齐方式（`left`、`center`、`right`、`justify`）                      |
| `text-indent`   | 首行缩进 | 通常用于段落首行缩进，单位常用`em`（如 `text-indent: 2em;`）                          |
| `text-decoration` | 文本修饰 | 添加下划线 `underline` 、取消下划线 `none`，还可以设置`overline`和`line-through`等文本修饰 |
| `text-transform` | 文本转换 | 控制文本转换为大写或小写 (`uppercase`、`lowercase`、`capitalize`)                    |


```css
/* 文本样式示例 */
.text-style-example {
    color: #333;          /* 十六进制颜色 */
    line-height: 1.5;     /* 行高 */
    text-align: justify;  /* 水平对齐方式 */
    text-indent: 2em;     /* 首行缩进 */
    text-decoration: underline;   /* 下划线 */
    text-transform: capitalize;   /* 首字母大写 */
}
```

#### 字体属性

| 字体属性    | 表示     | 注意点                                                                   |
| :---------- | :------- | :--------------------------------------------------------------------- |
| `font-size` | 字号     | 我们通常用的单位是`px` (像素)，必须跟上单位                               |
| `font-family` | 字体     | 可以一次设置多个字体，浏览器不支持第一个字体，则会尝试下一个；字体名如果包含空格需加引号    |
| `font-weight` | 字体粗细 | 加粗是 `700` 或者 `bold`，不加粗是 `normal` 或者 `400` (数字不要加单位)   |
| `font-style`  | 字体样式 | 倾斜是 `italic`，不倾斜是 `normal`（工作中最常用 `normal`）                |
| `font`        | 字体连写 | 1. 字体连写是有顺序的不能随意换位置，2. 其中字号和字体必须同时出现               |

```css
/* 字体样式示例 */
.font-style-example {
    font-size: 16px;                   /* 字号 */
    font-family: "Arial", sans-serif;  /* 字体 */
    font-weight: bold;                 /* 字体粗细 */
    font-style: normal;                /* 字体样式 */
}

/* 字体连写示例 */
.font-shorthand-example {
    font: italic bold 16px/1.5 "Arial", sans-serif;  /* 字体连写 */
}
```

::: info 文本居中实现方式
- **水平居中**：常用`text-align: center;`，也可使用Flexbox和Grid布局。
- **垂直居中**：方法较多，常用方法包括行高法、Table-cell法、Flexbox、Grid布局和绝对定位法。

### 水平居中

#### 1. 使用 `text-align`

`text-align:center;` 是文本水平居中的最常用方法，适用于块级元素中的文本。

```css
.horizontal-center {
    text-align: center;
}
```

```html
<div class="horizontal-center">
    <p>这是水平居中的文本。</p>
</div>
```

#### 2. 使用 Flexbox

Flexbox 是一个强大的布局工具，也可以用于实现文本的水平居中。

```css
.flex-horizontal-center {
    display: flex;
    justify-content: center;
}
```

```html
<div class="flex-horizontal-center">
    <p>这是使用Flexbox实现水平居中的文本。</p>
</div>
```

### 垂直居中

垂直居中通常比水平居中稍复杂，有几种常用的方法：

#### 1. 行高（Line Height）法

这种方法适用于单行文本，通过将行高设置为元素的高度来实现。

```css
.line-height-center {
    height: 100px;
    line-height: 100px; /* 行高等于元素高度 */
    text-align: center; /* 可选，为了水平居中 */
}
```

```html
<div class="line-height-center">
    <p>这是使用行高实现垂直居中的文本。</p>
</div>
```

#### 2. Table-cell 法

这个方法将父元素的 `display` 属性设为 `table`，将子元素的 `display` 属性设为 `table-cell`，然后使用 `vertical-align` 属性。

```css
.table-cell-center {
    display: table;
    height: 100px;
    width: 100%;
}

.table-cell-center p {
    display: table-cell;
    vertical-align: middle;
    text-align: center; /* 可选，为了水平居中 */
}
```

```html
<div class="table-cell-center">
    <p>这是使用Table-cell实现垂直居中的文本。</p>
</div>
```

#### 3. Flexbox 法

Flexbox 是实现垂直居中的强大方法之一。除了水平居中外，还可以实现垂直居中。

```css
.flex-center {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
    height: 100px;
}
```

```html
<div class="flex-center">
    <p>这是使用Flexbox实现水平和垂直居中的文本。</p>
</div>
```

:::


### Display属性

HTML标签一般分为块标签和行内标签两种类型，它们也称块元素和行内元素。
|  元素模式  |       元素排列       |       设置样式       |    默认宽度     |          包含          |
| --------- | -------------------- | -------------------- | -------------- | --------------------- |
| 块级元素   | 一行只能放一个块级元素 | 可以设置宽度高度       | 容器的100%      | 容器级可以包含任何标签   |
| 行内元素   | 一行可以放多个行内元素 | 不可以直接设置宽度高度 | 它本身内容的宽度 | 容纳文本或则其他行内元素 |
| 行内块元素 | 一行放多个行内块元素   | 可以设置宽度和高度     | 它本身内容的宽度 |                       |

::: info Display属性
`display` 属性用于定义元素的显示类型，它决定了元素在页面中的布局方式。常见的显示类型有：
- **block**：块级元素，占据父元素的全部宽度。
  常见的块元素有`<h1>~<h6>、<p>、<div>、<ul>、<ol>、<li>`等，其中`<div>`标签是最典型的块元素。
- **inline**：内联元素，不会换行，只占据自身所需宽度。
  常见的行内元素有`<a>、<strong>、<b>、<em>、<i>、<span>`等，其中`<span>`标签最典型的行内元素。
- **inline-block**：内联块级元素，像内联元素那样排列，但其内容表现为块级。
  在行内元素中有几个特殊的标签——`<img />、<input />、<td>`，可以对它们设置宽高和对齐属性
- **none**：隐藏元素，不占空间。
- **flex** 和 **grid**：带有布局功能的复杂显示模式。
:::



## CSS选择器及权重

### 基础选择器

基础选择器（Basic Selectors）：

- **通配符选择器（Universal Selector）**：选择所有元素（`*`）。
- **类型选择器（Type Selector）**：也称为元素（标签）选择器，选择所有某一类型的元素（如`p`、`div`）。
- **类选择器（Class Selector）**：选择特定类名的所有元素（如`.classname`）。
- **ID选择器（ID Selector）**：选择特定ID的所有元素（如`#idname`）。
- **属性选择器（Attribute Selector）**：选择具有特定属性的元素（如`[type="text"]`）。

```css
/* 通配符选择器：设置所有元素的字体 */
* {
    font-family: Arial, sans-serif;
}

/* 类型选择器(元素/标签选择器)：设置所有p元素的颜色 */
p {
    color: blue;
}

/* 类选择器：设置类名为example的元素的背景颜色 */
.example {
    background-color: yellow;
}

/* ID选择器：设置ID为header的元素的高度 */
#header {
    height: 100px;
}

/* 属性选择器：设置所有type属性值为text的input元素的宽度 */
input[type="text"] {
    width: 200px;
}
```

### 复合选择器

复合选择器（Compound Selectors）：
- **后代选择器（Descendant Selector）**：如选择div中的所有p元素（`div p`）。
- **子选择器（Child Selector）**：如选择div中的直接子元素p（`div > p`）。
- **相邻兄弟选择器（Adjacent Sibling Selector）**：如选择紧接在h1之后的p元素（`h1 + p`）。
- **通用兄弟选择器（General Sibling Selector）**：如选择h1之后的所有p元素（`h1 ~ p`）。
- **交集选择器 (Intersection Selector)**：如选择同时具有class1和class2的元素（`.class1.class2`）
- **并集选择器 (Union Selector)**：如选择所有具有class1或class2类的元素（`.class1, .class2`）
- **链接伪类选择器 (Link Pseudo-classes)**：用于匹配链接的不同状态

#### 后代选择器 (Descendant Selector)
选择某元素后代中的特定元素。它可以匹配目标元素的所有后代元素。

```css
/* 选择div中的所有p元素 */
div p {
    color: red;
}
```

#### 子选择器 (Child Selector)
选择某元素子代中的特定元素。它只匹配目标元素的直接子元素。

```css
/* 选择div中的直接子元素p */
div > p {
    color: green;
}
```

#### 相邻兄弟选择器 (Adjacent Sibling Selector)
选择紧接在某元素后的第一个兄弟元素。

```css
/* 选择紧接在h1之后的p元素 */
h1 + p {
    font-weight: bold;
}
```

#### 通用兄弟选择器 (General Sibling Selector)
选择某元素之后的所有兄弟元素。

```css
/* 选择h1之后的所有p元素 */
h1 ~ p {
    font-style: italic;
}
```


#### 交集选择器 (Intersection Selector)
选择同时满足多个条件的元素。即一个元素需同时匹配多个选择器。

```css
/* 选择同时具有class1和class2的元素 */
.class1.class2 {
    background-color: yellow;
}
```

```html
<div class="class1 class2">交集选择器示例</div>
<div class="class1">这不是交集选择器示例</div>
```

#### 并集选择器 (Union Selector)
选择满足任意一个条件的元素。即匹配多个选择器中的任意一个选择器。

```css
/* 选择所有具有class1或class2类的元素 */
.class1, .class2 {
    border: 1px solid black;
}
```

```html
<div class="class1">并集选择器示例1</div>
<div class="class2">并集选择器示例2</div>
```

#### 链接伪类选择器 (Link Pseudo-classes)
专用于链接的伪类选择器，用于控制链接的不同状态。

- `:link`：尚未访问的链接。
- `:visited`：已访问的链接。
- `:hover`：鼠标悬停在链接上时。
- `:active`：点击激活的链接。

```css
/* 尚未访问的链接 */
a:link {
    color: blue;
}

/* 已访问的链接 */
a:visited {
    color: purple;
}

/* 鼠标悬停在链接上 */
a:hover {
    color: red;
}

/* 点击激活的链接 */
a:active {
    color: green;
}
```

```html
<a href="https://www.example.com" target="_blank">示例链接</a>
```



### 选择器权重计算

| CSS三大特性      | 说明                                                         |
|-----------|------------------------------------------------------------|
| 层叠性    | 一个属性通过两个相同选择器设置到同一个元素上（样式冲突），那么其中一个属性就会被另一个属性层叠掉（覆盖）。样式冲突遵循就近原则，即哪个样式近就执行哪个样式。如果样式不冲突，不会层叠。 |
| 继承性    | 子标签会继承父标签的某些样式（例如，`text-`、`font-`、`line-`这些开头的属性以及`color`属性可以继承）。 |
| 优先级    | 定义CSS样式时，经常出现两个或更多规则应用在同一元素上，此时若选择器相同，则执行层叠性；若选择器不同，就会出现优先级的问题。 |

::: info CSS权重计算公式
CSS Specificity（特殊性）的计算直接影响样式的最终应用。

| 选择器                 | 权重公式       |
|------------------------|----------------|
| 继承选择器或全局选择器 `*`  | `0, 0, 0, 0`   |
| 元素（标签）选择器     | `0, 0, 0, 1`   |
| 类选择器、伪类选择器(如`.class1`, `:hover` 等)   | `0, 0, 1, 0`   |
| 属性选择器             | `0, 0, 1, 0`   |
| ID 选择器              | `0, 1, 0, 0`   |
| 行内样式 `style=""`    | `1, 0, 0, 0`   |
| `!important`             | `∞`（无穷大）<br/>  行内样式的 `!important` 权重最高  |

- 权重值从左到右依次递减，左边的数值更大，权重更高。
- 权重级别之间不可超越，不存在进位。
:::

多个基础选择器组合使用时，权重会叠加:

```css
/* 后代选择器 */
div ul li {
    color: blue;   /* 权重为 0, 0, 0, 3 */
}

/* 类选择器与后代选择器的组合 */
.nav ul li {
    border: 1px solid black; /* 权重为 0, 0, 1, 2 */
}

/* 伪类选择器 */
a:hover {
    text-decoration: underline; /* 权重为 0, 0, 1, 1 */
}

/* 类选择器与标签选择器 */
.nav a {
    color: red; /* 权重为 0, 0, 1, 1 */
}
```

- 注意：数位之间没有进制关系，例如：`0, 0, 0, 5 + 0, 0, 0, 5 = 0, 0, 0, 10` 而不是 `0, 0, 1, 0`，不会存在10个 div 元素选择器的权重能超越一个类选择器权重的情况。


::: tip 继承的权重为0
对于继承自父元素的样式，其权重为0。
- 如果某标签的样式是通过选择器直接应用的，则需要按照上述权重公式计算。
- 如果某标签的样式是继承来的（未被任何选择器直接选中），其权重为0。
:::

**总结**：
- **层叠性**决定了同一选择器多次应用时，靠近元素的样式会覆盖之前的样式。
- **继承性**指某些特定属性可以从父元素继承给子元素，但继承的权重为0。
- **优先级**依靠权重计算公式，较高权重的选择器将覆盖较低权重的选择器。




## 盒模型(Box Model)

### CSS盒模型
CSS 盒模型描述了一个元素及其内容、内边距（padding）、边框（border）和外边距（margin）如何组合在一起。盒模型的组成部分主要包括：
- **Content（内容）**：元素的实际内容（文本、图像等）。
- **Padding（内边距）**：围绕内容的空白区域。
- **Border（边框）**：围绕内边距（如果有）的边框。
- **Margin（外边距）**：最外层的外边距，围绕边框。


<img src="https://www.runoob.com/images/box-model.gif">


### Margin/Padding

#### 内边距（Padding）

内边距（Padding）控制的是元素内容与其边框（Border）之间的距离。

1. **单边属性写法**
   - `padding-top`: 设置顶部内边距
   - `padding-right`: 设置右侧内边距
   - `padding-bottom`: 设置底部内边距
   - `padding-left`: 设置左侧内边距

   示例：
   ```css
   .example-padding {
       padding-top: 10px;
       padding-right: 15px;
       padding-bottom: 20px;
       padding-left: 25px;
   }
   ```

2. **简写形式**
   通过单行设置全部内边距，简写形式如下：
   ```css
   .example-padding {
       padding: top right bottom left; /* 顺序依次为 上 右 下 左 */
   }
   ```
   具体简写规则：
   - **4个值**：上，右，下，左
   - **3个值**：上，左右，下
   - **2个值**：上下，左右
   - **1个值**：所有方向相同

   示例：
   ```css
   .example-padding {
       padding: 10px 15px 20px 25px; /* 上 10px, 右 15px, 下 20px, 左 25px */
   }

   .example-padding-1 {
       padding: 10px 15px 20px; /* 上 10px, 左右 15px, 下 20px */
   }

   .example-padding-2 {
       padding: 10px 15px; /* 上下 10px, 左右 15px */
   }

   .example-padding-3 {
       padding: 10px; /* 四边均为 10px */
   }
   ```


#### 外边距（Margin）

外边距（Margin）控制的是元素边框（Border）与相邻元素或容器边框之间的距离。

1. **单边属性写法**
   - `margin-top`: 设置顶部外边距
   - `margin-right`: 设置右侧外边距
   - `margin-bottom`: 设置底部外边距
   - `margin-left`: 设置左侧外边距

   示例：
   ```css
   .example-margin {
       margin-top: 10px;
       margin-right: 15px;
       margin-bottom: 20px;
       margin-left: 25px;
   }
   ```

2. **简写形式**
   通过单行设置全部外边距，简写形式如下：
   ```css
   .example-margin {
       margin: top right bottom left; /* 顺序依次为 上 右 下 左 */
   }
   ```
   具体简写规则：
   - **4个值**：上，右，下，左
   - **3个值**：上，左右，下
   - **2个值**：上下，左右
   - **1个值**：所有方向相同

   示例：
   ```css
   .example-margin {
       margin: 10px 15px 20px 25px; /* 上 10px, 右 15px, 下 20px, 左 25px */
   }

   .example-margin-1 {
       margin: 10px 15px 20px; /* 上 10px, 左右 15px, 下 20px */
   }

   .example-margin-2 {
       margin: 10px 15px; /* 上下 10px, 左右 15px */
   }

   .example-margin-3 {
       margin: 10px; /* 四边均为 10px */
   }
   ```


::: tip 注意事项
1. **重叠外边距（Margin Collapsing）**
   - 垂直方向的相邻两元素外边距如果相遇，较大的外边距将会“吞掉”较小的那个，而不是叠加。这是为了避免相邻的块元素被两个外边距累加后变得间隔过开。
     ```css
     .box1 {
         margin-bottom: 20px;
         background-color: lightgrey;
         height: 50px;
     }
     .box2 {
         margin-top: 30px;
         background-color: lightpink;
         height: 50px;
     }
     ```
     ```html
     <div class="box1">Box 1</div>
     <div class="box2">Box 2</div>
     ```
     实际效果：两段元素之间的间距为较大的外边距，即 30px，而不是 50px。

2. **内边距影响盒子尺寸**
   - 默认情况下，内边距会增加盒子的总尺寸（宽高），这会导致实际显示的盒子比指定的宽高要大。
   - 可以使用 `box-sizing: border-box;` 来包括 padding 和 border，在指定的宽高之内。
     ```css
     .box {
         width: 100px;
         height: 100px;
         padding: 20px;
         border: 5px solid black;
         box-sizing: border-box; /* 包括 padding 和 border */
     }
     ```

3. **避免负值的内边距**
   - 内边距不允许负值，尝试设置负值会导致样式无效。
   - 外边距可以使用负值来实现元素的部分重叠。
     ```css
     .negative-margin {
         margin-top: -10px; /* 元素向上移动10px，与上一个元素重叠 */
     }
     ```

4. **使用百分比内边距与外边距**
   - 内外边距可以使用百分比值，此时值是相对于包含块（父元素）的宽度来计算。
     ```css
     .percentage-padding {
         padding: 5%; /* 相对于父元素宽度的5% */
     }
     ```
:::




### Border边框

边框用来为元素增加视觉边界。常见属性包括：
- `border-width`：边框宽度。
- `border-style`：边框样式（solid、dashed、dotted 等）。
- `border-color`：边框颜色。


#### 边框圆角 (Border Radius)
`border-radius` 属性用于给元素的边框设置圆角。

```css
.rounded-box {
    border: 2px solid #000; /* 黑色实线边框 */
    border-radius: 10px;    /* 四角圆角半径为10px */
}
```

```html
<div class="rounded-box">这是带圆角边框的盒子</div>
```

需要注意的是，如果 `border-radius` 设定值过大，也依然会被元素尺寸的边界约束。

#### 边框阴影 (Box Shadow)
`box-shadow` 属性用于给元素添加阴影效果。

```css
.shadow-box {
    border: 1px solid #ccc; /* 灰色边框 */
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5); /* 阴影 */
}
```

```html
<div class="shadow-box">这是带阴影的盒子</div>
```

`box-shadow` 参数解析：
- 第一个值为水平偏移量。
- 第二个值为垂直偏移量。
- 第三个值为模糊半径。
- 第四个值是可选的扩展半径。
- 颜色值（`rgba` 表示透明度）。







### box-sizing属性

`box-sizing`定义了元素盒模型的计算方式，决定了元素的宽度和高度如何包括边框、内边距以及内容区域。此属性有助于简化布局过程，特别是在处理包含边框和内边距的元素时。

1. **content-box**（默认值）:
   - **含义**: 元素的宽度和高度只包括内容区域，不包括边框和内边距。增加边框和内边距会导致元素尺寸变大。
   - **使用场景**: 当你需要遵循传统的W3C盒模型时。

2. **border-box**:
   - **含义**: 元素的宽度和高度包括内容区域、边框和内边距。设置的宽度和高度固定，不会因边框和内边距而变化。
   - **使用场景**: 这是进行布局时的推荐选择，因为它让元素尺寸更容易预测，尤其是在响应式设计中

```css
/* 将所有元素的盒模型设置为border-box */
*, *::before, *::after {
  box-sizing: border-box;
}

/* 具体元素的定制 */
.example {
  width: 300px; /* 宽度包含边框和内边距 */
  height: 200px; /* 高度包含边框和内边距 */
  padding: 20px;
  border: 5px solid #333;
  box-sizing: border-box;
}
```

在上述代码示例中，首先通过通配符选择器`*`将页面上所有元素的`box-sizing`属性设置为`border-box`，这是一种常见的做法，有助于全局统一盒模型计算方式，简化布局工作。随后，定义了一个`.example`类，展示了如何设置一个固定尺寸的盒子，其中宽度和高度包括了边框和内边距，由于使用了`border-box`，即便增加了内边距和边框，该元素的总尺寸仍然保持为300px宽和200px高。














## CSS应用实践
### 显示与隐藏

| 属性           | 区别                   | 用途                                                         |
| -------------- | ---------------------- | ------------------------------------------------------------ |
| **display**    | 隐藏对象，不保留位置   | 配合后面js做特效，比如下拉菜单，原先没有，鼠标经过，显示下拉菜单， 应用极为广泛 |
| **visibility** | 隐藏对象，保留位置     | 使用较少                                                     |
| **overflow**   | 只是隐藏超出大小的部分 | 1. 可以清除浮动  2. 保证盒子里面的内容不会超出该盒子范围     |

~~~css
display: none   隐藏对象  特点： 隐藏之后，不再保留位置。
display：block  除了转换为块级元素之外，同时还有显示元素的意思。
~~~

~~~css
visibility：visible ; 　对象可视
visibility：hidden; 　  对象隐藏  特点： 隐藏之后，继续保留原有位置。
~~~

**overflow溢出** ：检索或设置当对象的内容超过其指定高度及宽度时如何管理内容

|    属性值    |                  描述                  |
| ----------- | ------------------------------------- |
| **visible** | 不剪切内容也不添加滚动条                 |
| **hidden**  | 不显示超过对象尺寸的内容，超出的部分隐藏掉 |
| **scroll**  | 不管超出内容否，总是显示滚动条            |
| **auto**    | 超出自动显示滚动条，不超出不显示滚动条     |

<br/>

**溢出的文字省略号显示**：

~~~css
white-space: nowrap;         /*1. 先强制一行内显示文本*/
overflow: hidden;            /*2. 超出的部分隐藏*/
text-overflow: ellipsis;     /*3. 文字用省略号替代超出的部分*/
~~~

&nbsp;

<br/>



### 用户界面样式

|     属性     |        用途         |                          用途                           |
| ------------ | ------------------ | ------------------------------------------------------- |
| **鼠标样式** | 更改鼠标样式cursor   | 样式很多，重点记住 pointer                                |
| **轮廓线**   | 表单默认outline      | outline 轮廓线，我们一般直接去掉，border是边框，我们会经常用 |
| 防止拖拽     | 主要针对文本域resize | 防止用户随意拖拽文本域，造成页面布局混乱，我们resize:none    |

**鼠标样式cursor** ：设置或检索在对象上移动的鼠标指针采用何种系统预定义的光标形状。
```html
<ul>
  <li style="cursor:default">我是小白</li>
  <li style="cursor:pointer">我是小手</li>
  <li style="cursor:move">我是移动</li>
  <li style="cursor:text">我是文本</li>
  <li style="cursor:not-allowed">我是文本</li>
</ul>
```

**轮廓线 outline** ：是绘制于元素周围的一条线，位于边框边缘的外围，可起到突出元素的作用。 
```html
 <input  type="text"  style="outline: 0;"/>
```

**防止拖拽文本域resize** ：实际开发中，我们文本域右下角是不可以拖拽： 
```html
<textarea  style="resize: none;"></textarea>
```
<br/>



### 水平/垂直居中

- 有宽度的块级元素居中对齐，是margin: 0 auto;
- 让文字居中对齐，是 text-align: center;
- vertical-align

**水平居中**

对于**有固定宽度的块级元素**，使用`margin: 0 auto;`可以让元素在其父容器内水平居中。这种方法依赖于块级元素的宽度是确定的，并且父容器能够提供足够的空间。

```html
<div class="container">
  <div class="block-element">我是水平居中的块级元素</div>
</div>
```

```css
.container {
  width: 100%;
  text-align: center; /* 用于文本或行内元素的居中，但此处用于辅助理解 */
}

.block-element {
  width: 200px;
  margin: 0 auto;
  background-color: lightblue;
  padding: 20px;
}
```

**垂直居中**

**文本居中**

对于**文本内容**，使用`text-align: center;`可以让行内文本在父元素中水平居中。

```html
<div class="text-center">
  这段文字将在容器中居中显示。
</div>
```

```css
.text-center {
  text-align: center;
}
```

**单行或多行文本块垂直居中**

对于**单个块级元素**的垂直居中，可以结合Flexbox或Grid布局快速实现。

```html
<div class="flex-container">
  <div class="flex-item">我是垂直居中的文本。</div>
</div>
```

```css
.flex-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 为了演示，设定一个高度 */
}

.flex-item {
  /* 不需要特别样式，仅内容即可 */
}
```

**图片或行内块元素的垂直对齐**：

对于**图片**或**表单**等**行内块元素**，它们默认与父级容器的基线对齐，可能导致下方出现空白缝隙。

::: info 行内块空白间隙解决方法
1. **使用`vertical-align`**

```html
<div class="image-container">
  <img src="image.jpg" alt="示例图片">
</div>
```

```css
.image-container {
  line-height: 0; /* 减少基线影响，可选 */
}

img {
  vertical-align: middle; /* 或top/bottom等 */
}
```

2. **转换为块级元素**

```css
img {
  display: block; /* 转换为块级元素，消除空白缝隙 */
}
```
通过上述方法，你可以有效地解决水平和垂直居中问题，以及消除行内块元素下方的空白缝隙。
:::




### margin负值

margin负值之美：

1). 负边距+定位：水平垂直居中：一个绝对定位的盒子， 利用 父级盒子的 50%， 然后 往左(上) 走 自己宽度的一半 ，可以实现盒子水平垂直居中。

2). 压住盒子相邻边框


<br/>



### CSS三角形

~~~css
 div {
 	width: 0; 
    height: 0;
    line-height:0；
    font-size: 0;
    
	border-top: 10px solid red;
	border-right: 10px solid green;
	border-bottom: 10px solid blue;
	border-left: 10px solid #000; 
 }
~~~

**做法如下：**
1. 我们用css 边框可以模拟三角效果
2. 宽度高度为0
3. 我们4个边框都要写， 只保留需要的边框颜色，其余的不能省略，都改为 transparent 透明就好了
4. 为了照顾兼容性 低版本的浏览器，加上 font-size: 0;  line-height: 0;

<br/>











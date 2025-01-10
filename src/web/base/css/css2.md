---

order: 10
title: CSS布局

---

在现代Web开发中，最常用的CSS布局方式主要包括以下几种：

1. **正常流（Normal Flow）**：元素按照HTML文档中的顺序从上到下、从左到右排列的默认布局方式

2. **浮动布局（Floats）**：通过`float`属性（如`float: left;`或`float: right;`）使元素脱离正常文档流，允许文本和其他元素环绕它们。

3. **定位布局（Positioning）**：虽然不作为主要布局体系使用，但在调整元素微布局、实现覆盖层、弹出框等特定布局需求时仍然非常有用。
   - **静态定位（Static）**：元素在正常文档流中布局。
   - **相对定位（Relative）**：元素在正常位置的基础上进行偏移，但保留原占位。
   - **绝对定位（Absolute）**：元素相对于最近的非 static 定位祖先元素定位，完全脱离文档流。
   - **固定定位（Fixed）**：元素相对于浏览器窗口定位，不随滚动条滚动。

4. **Flex布局（Flexible Box或Flexbox）**：由于其灵活性和强大的对齐功能，Flex布局成为创建响应式和动态界面的首选方法。它特别适合于构建单一维度上的布局，比如导航栏、组件排列和各种复杂的一维布局。

5. **Grid布局（CSS Grid）**：对于二维布局，Grid布局是目前最强大且灵活的选择，特别是在处理多列或多行的复杂布局时。它能够轻松创建均匀分布的网格系统，非常适合页面结构布局，如网页主体内容、图片画廊和商品列表等。

6. **响应式布局（Responsive Design）**：结合使用媒体查询、百分比单位、Flex或Grid布局等，响应式布局确保了网站能在不同设备和屏幕尺寸上提供良好的用户体验。这种方法几乎是现代网页设计的标准实践。

7. **流式布局（Fluid Layout）**：尽管随着Flex和Grid布局的普及，流式布局的使用有所减少，但它仍然是实现内容区域随窗口大小变化而自适应的一种简单有效方式，特别是结合响应式设计时。





## 浮动布局(Floats)

### CSS Float

浮动是CSS中一种布局方式，通过`float`属性来实现。

当一个元素被设置为浮动（`float: left;` 或 `float: right;`）时，它会从文档的正常流中移出，移到其父容器的左侧或右侧，并且周围的文本或其他内联元素会围绕这个浮动元素排列，这对于实现文本环绕图片等效果非常有用。

正常流下的元素按顺序堆叠，一个接一个排列，而浮动元素则可以“飘”在文本旁边，改变了原本的顺序和堆叠方式。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>浮动布局示例</title>
    <style>
        .container {
            border: 1px solid #000;
            overflow: auto; /* 解决高度坍塌问题 */
        }
        .box {
            width: 100px;
            height: 100px;
            margin: 10px;
            background-color: #f00;
        }
        .float-left {
            float: left;
        }
        .float-right {
            float: right;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="box float-left">左浮动</div>
    <div class="box float-right">右浮动</div>
    <p>这里是段落文本，看看左浮动和右浮动的盒子是如何影响我的排列的。</p>
</div>

</body>
</html>
```

在这个例子中，有两个红色方块（`.box`），一个左浮动，一个右浮动。它们会分别贴着容器的左右两侧排列，而段落文本会围绕这两个浮动元素显示，体现了浮动布局的基本效果。



### 如何清除浮动

浮动元素会导致其父容器==高度塌陷==，即父容器的高度不会自动扩展以包含浮动元素，这被称为“高度塌陷”问题。

为了解决这个问题，需要清除浮动。有几种方法可以清除浮动：

1. **使用clearfix**: 通过在父元素上应用特定的CSS规则，创建一个伪元素来清除浮动，使得父元素能够包裹住所有的浮动子元素，维持正常的高度和背景显示。
   
   ```css
   .clearfix::after {
       content: "";
       display: table;
       clear: both;
   }
   ```

   然后在HTML中为父元素添加这个类：
   
   ```html
   <div class="container clearfix">
   ```

2. **使用overflow**: 在父容器上设置`overflow: auto;` 或 `overflow: hidden;`，这可以隐式地创建一个新的BFC（块格式化上下文），从而包含浮动元素，避免高度塌陷。

3. **使用clear属性**: 在紧跟浮动元素之后的元素上使用`clear`属性，例如`clear: both;`，用来防止该元素与之前的浮动元素在同一行显示（clear属性指定元素两侧不能出现浮动元素）

::: info clearfix和overflow的异同
**clearfix** 和 **overflow** 在处理浮动元素导致的布局问题时，虽然都可以达到一定的效果，但它们的作用原理和应用场景有所不同：

#### Clearfix 的作用与特点：
Clearfix 主要用于解决父容器因为内部浮动元素而无法正确包围（即高度塌陷）的问题。可以无侵入地强制父容器包含其所有浮动的子元素，保持正常的布局流。Clearfix通常通过伪元素（`:before` 或 `:after`）实现，添加一个看不见的内容，并设置 `clear:both` 或 `display:table` 等属性来清除浮动。这样，即使内部元素全部浮动，父容器也能正确计算自己的高度。

#### Overflow 的作用与特点：
Overflow 属性主要控制元素在内容溢出时的行为，包括是否剪裁内容、显示滚动条等。当将其设置为 `hidden` 或 `auto` 时，可以间接解决浮动引起的问题，因为它迫使浏览器重新计算容器的布局，从而包含浮动元素。这种方式简单易用，但在某些情况下可能产生副作用，比如隐藏超出容器的内容或意外触发滚动条，特别是当容器内的元素动态变化或者有绝对定位的子元素时，可能会导致布局出现问题。

区别总结：
- **目的不同**：clearfix 直接针对浮动引起的布局问题，确保父容器能正确包裹浮动元素；而 overflow 的主要目的是处理内容溢出，其解决浮动问题是一种副作用。
- **副作用**：overflow:hidden 可能隐藏超出容器的内容或添加不需要的滚动条；clearfix 则是一种更为精确的解决方案，不会引起这些额外问题。
- **适用场景**：当只需要解决浮动问题而不涉及内容溢出时，clearfix 是更好的选择。如果还需要处理内容溢出的情况，overflow 的设置就显得更加灵活，但需要权衡其可能带来的影响。
- **兼容性与灵活性**：clearfix 需要借助 CSS 伪元素和特定的 CSS 规则，旧版浏览器可能需要不同的clearfix实现；overflow 属性更为通用且历史悠久，兼容性较好，但解决浮动问题不是其设计初衷。

综上所述，选择使用 clearfix 还是 overflow，应基于具体的设计需求和兼容性考虑。在现代Web开发中，clearfix通常被视为解决浮动问题的最佳实践，而 overflow 更多用于控制内容溢出的显示方式。
:::

**clear属性示例代码**：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>clear属性示例</title>
    <style>
        .float-left {
            float: left;
            width: 100px;
            height: 100px;
            background-color: #f00;
        }
        .clear {
            clear: both; /* 防止下方元素与上方浮动元素同行 */
            height: 50px;
            background-color: #0f0;
        }
    </style>
</head>
<body>

<div class="float-left">浮动元素</div>
<div class="float-left">另一个浮动元素</div>
<div class="clear">我不会与上面的浮动元素同行显示</div>

</body>
</html>
```

在这个例子中，`.clear`类用于一个元素，以确保它不会与前两个浮动的红色方块位于同一行，而是从新的一行开始显示，背景为绿色。





## 定位布局(Positioning)

### Position属性

CSS的`position`属性决定了元素在页面上的定位方式，主要有四种值：static、relative、absolute、fixed。这些值会影响元素在正常文档流中的位置和相互之间的关系。

1. **static**（静态定位）：默认值，元素按照正常文档流进行排列，不接受top、bottom、left、right属性的值。
2. **relative**（相对定位）：元素相对于其正常位置（即未进行定位时的位置）进行偏移，但仍在文档流中保留其原来的空间。
3. **absolute**（绝对定位）：元素脱离正常文档流，相对于最近的非static定位祖先元素进行定位（如果没有这样的祖先，则相对于body定位）。它可以覆盖页面上的其他元素。
4. **fixed**（固定定位）：元素完全脱离文档流，相对于浏览器窗口进行定位，即使页面滚动，元素也会保持在视口的固定位置。



### 相对定位(Relative)

**相对定位（Relative Positioning）的使用场景**：

1. **微调元素位置**：当你想要对元素进行细微的位置调整，但又希望它保持在文档流中的位置和影响（不影响周围元素布局），相对定位是一个很好的选择。例如，调整图片的对齐或稍微偏移一段文本以达到视觉平衡。

2. **作为绝对定位的参考点**：绝对定位的元素需要一个已定位的（非static）祖先元素来确定其位置，相对定位的元素经常被用作这个参考点。如果你想要在一个容器内部精确定位一个元素，首先对该容器应用相对定位，然后在内部元素上使用绝对定位。

3. **叠加元素**：相对定位的元素可以通过设置`z-index`属性来实现层叠效果，这在创建遮罩层、悬停效果或实现简单的UI动画时非常有用。

4. **不改变布局结构**：当需要改变元素的位置而不影响页面的流动布局时，使用相对定位可以避免因元素脱标导致的布局混乱。

::: tip 注意事项和建议
- **谨慎使用偏移量**：虽然相对定位允许你使用`top`、`right`、`bottom`、`left`属性来移动元素，但过度使用可能会使CSS难以维护。尽量保持布局的简洁性和可读性。
- **避免嵌套过深**：尽管相对定位不会改变文档流，但过度依赖它进行复杂布局可能导致HTML结构变得冗长和难以管理。考虑结合使用其他布局技术，如Flexbox或Grid，以获得更高效、清晰的布局。
- **考虑性能和可访问性**：虽然相对定位对页面性能影响较小，但确保任何位置调整不会影响到页面的可访问性，如确保内容的阅读顺序仍然合理，不因微调而变得混乱。
:::

**相对定位（Relative Positioning）实现代码示例**:

```html
<!DOCTYPE html>
<html>
<head>
<style>
.relative-box {
  position: relative;
  width: 100px;
  height: 100px;
  background-color: red;
  left: 20px;
  top: 20px;
}
</style>
</head>
<body>

<p>这是一个没有定位的段落。</p>
<div class="relative-box">我是相对定位的盒子。</div>
<p>相对定位的元素不会影响其他元素的位置。</p>

</body>
</html>
```

- **是否脱标**：不脱标，元素依然占据其在文档流中的位置。
- **移动位置基准**：相对于元素自身在文档流中的原始位置进行偏移。
- **元素模式转换**：虽然进行了定位，但元素依然是块级元素或行内元素的特性，不改变其模式。


### 绝对定位(Absolute)

绝对定位是CSS布局中一种强大的技术，它允许元素脱离正常的文档流，精确控制其在父容器或其他已定位祖先中的位置

**绝对定位（Absolute Positioning）的使用场景**：

1. **弹出框与模态窗口**：绝对定位常用于创建覆盖在主要内容之上的弹出框、提示信息或模态窗口，因为可以轻松地将其置于页面的任意位置，并且不影响周围元素的布局。

2. **悬浮元素**：如固定导航栏、侧边栏或回到顶部按钮，这些元素需要始终保持在屏幕的特定位置，不受滚动影响。

3. **复杂的界面组件**：在设计复杂的UI组件（如卡片、自定义下拉菜单）时，绝对定位可以帮助精确控制内部子元素的位置，实现更加精细的布局效果。

4. **层叠元素**：通过调整`z-index`值，绝对定位的元素可以轻松实现层叠效果，这对于创建具有深度感的用户界面非常有用。

::: tip 注意事项和建议
- **明确定位上下文**：绝对定位的元素会相对于最近的已定位祖先元素（非`static`定位）定位，如果没有这样的祖先，则相对于`body`定位。因此，在使用绝对定位前，明确其定位上下文非常重要，必要时应给父元素设定`position: relative;`。

- **避免布局混乱**：绝对定位的元素脱离了正常文档流，可能会导致周围的文本或其他元素布局出现问题。确保周围内容的布局不受影响，或者适当调整以适应绝对定位元素的存在。
:::

**绝对定位（Absolute Positioning）实现代码示例**:

```html
<!DOCTYPE html>
<html>
<head>
<style>
.container {
  position: relative;
  width: 700px;
  height: 90px;
  background-color: lightgrey;
}

.absolute-box {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: blue;
  top: 20px;
  right: 20px;
}
</style>
</head>
<body>

<div class="container">
  <p>这是一个包含绝对定位元素的容器。</p>
  <div class="absolute-box">我是绝对定位的盒子。</div>
</div>
<p>绝对定位的元素不会影响其他非定位元素的位置。</p>

</body>
</html>
```
- **是否脱标**：完全脱标，不占用文档流空间，周围的元素会像它不存在一样进行排列。
- **移动位置基准**：相对于最近的非static定位祖先元素定位，如果没有这样的祖先，则相对于body定位。
- **元素模式转换**：块级元素或行内元素变为块级定位元素，具有块级元素的特性。



### 固定定位(Fixed)

固定定位是CSS布局中一种特殊定位方式，它使元素相对于浏览器视口定位，即使用户滚动页面，该元素也会保持在屏幕上固定的位置。

**固定定位（Fixed Positioning）的使用场景**：

1. **导航栏**：最常见的应用之一是创建始终位于页面顶部或底部的导航菜单，无论用户如何滚动页面，导航始终保持可见，方便用户随时切换页面。

2. **悬浮按钮**：如返回顶部按钮、“分享”、“购物车”图标等，这些元素通常固定在页面边缘，便于用户快速访问。

3. **通知栏或警告信息**：有时需要展示重要通知或警告信息，固定在屏幕顶部或底部，确保用户不会错过。

4. **滚动提示或进度条**：在长页面滚动过程中，固定位置的滚动指示器或阅读进度条可以提供良好的用户体验。


**固定定位（Fixed Positioning）实现代码示例**:

```html
<!DOCTYPE html>
<html>
<head>
<style>
.fixed-box {
  position: fixed;
  width: 100px;
  height: 100px;
  background-color: green;
  bottom: 20px;
  right: 20px;
}
</style>
</head>
<body>

<p>向下滚动页面，看看固定定位的盒子。</p>
<div class="fixed-box">我是固定定位的盒子，始终在页面的右下角。</div>

</body>
</html>
```

- **是否脱标**：完全脱标，不占用文档流空间。
- **移动位置基准**：相对于浏览器窗口（视口）定位。
- **元素模式转换**：同绝对定位，块级元素或行内元素变为块级定位元素，具有块级元素的特性。固定定位常用于制作固定的导航栏、工具提示等。


### z-index属性

`z-index` 用于控制具有定位（`position`属性不是`static`）的元素在Z轴上的堆叠顺序。

在网页设计中，当两个或多个元素在二维平面上重叠时，`z-index`可以帮助决定哪个元素显示在最上层，哪个元素会被遮挡。

- **层叠上下文（Stacking Context）**：在CSS中，每个元素都存在于一个层叠上下文中，这个上下文决定了元素以及其子元素的堆叠顺序。当元素的定位方式（`position`属性）为`relative`、`absolute`、`fixed`或`sticky`，并且指定了非默认的`z-index`值时，它会在其所在层叠上下文中按照`z-index`值来排列。
  
- **数值规则**：`z-index`可以接受整数值、0或负整数值。大多数现代浏览器支持的`z-index`最大值是一个32位有符号整数的最大值，即2147483647。
数值越大，元素在堆叠中的层级越高，也就越靠前显示。
默认情况下，元素的`z-index`为`auto`，相当于0，在未特别设定的情况下，后来的元素会覆盖在先的元素。

- **局部与全局**：每个创建了新层叠上下文的元素，其内部的元素`z-index`值仅在该上下文中有效，不会直接影响到外部的层叠顺序。这意味着，即使内部元素的`z-index`值非常高，如果没有改变外部上下文，也不会影响到整个页面的堆叠顺序。

***使用场景***：
- **导航栏和头部**：保持导航栏在页面顶部，即使用户滚动页面也能轻松访问。
- **弹出框和模态窗口**：确保模态窗口或提示框总是出现在最顶层，不被其他内容遮挡。
- **浮动元素和层叠内容**：在设计复杂布局时，精确控制哪些元素在视觉上应该覆盖其他元素。

::: tip 注意事项
- 只有当元素的定位模式不是`static`时（即为`relative`、`absolute`、`fixed`或`sticky`），`z-index`属性才生效。
- 理解层叠上下文的创建规则对于正确使用`z-index`至关重要，因为这直接影响到`z-index`值的相对性。
- 在设置`z-index`时，应当考虑元素之间的相对层级关系，以及可能需要调整的其他元素的`z-index`，以避免意料之外的层叠效果。
:::

<br/>

以下是一个体现相对层级关系和局部与全局的`z-index`使用的示例，假设我们有一个网页布局，其中包含一个带有导航栏和内容区的头部，以及一个弹出模态窗口。

HTML结构如下：

```html
<div class="header">
  <nav class="navbar">导航栏</nav>
</div>
<div class="content">
  主要内容区域
  <div class="modal">弹出模态窗口</div>
</div>
```

对应的CSS样式：

```css
.header {
  position: relative;
  z-index: 1; /* 创建一个层叠上下文，使得导航栏在默认情况下高于内容区 */
}

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #333;
  color: #fff;
  z-index: 2; /* 导航栏内部的层级，确保任何导航元素都在头部背景之上 */
}

.content {
  position: relative;
  z-index: 0; /* 默认层级，低于.header */
}

.modal {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 300px;
  height: 200px;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10; /* 弹出模态窗口的z-index设置得很高，确保它在所有内容之上 */
}
```

**解析**:

- `.header`设置`position: relative; z-index: 1;`，创建了一个局部的层叠上下文，使得导航栏可以在视觉上高于内容区，但这个层级只在`.header`内部有效，不影响全局。

- `.navbar`作为`.header`的子元素，其`z-index: 2;`只在`.header`的上下文中起作用，确保导航栏元素在任何可能存在的子元素之上。

- `.content`设置`position: relative; z-index: 0;`，维持默认层级，位于`.header`之下。

- 最后，`.modal`弹出模态窗口设置了很高的`z-index: 10;`，这个值是在全局范围内考虑的，确保模态窗口能覆盖页面上的所有其他元素，包括`.header`和`.content`中的内容，因为它是直接相对于`body`（或最近的已定位祖先）定位，且其`z-index`值足够高。




## Flex布局(Flexbox)

**弹性布局（Flexible Box Layout，简称Flex布局或Flexbox）** 是CSS3中的一种布局模式，旨在提供一种更加有效且灵活的方式来布局、对齐和分配容器内的项目（flex items）

弹性布局的核心思想是让容器能够调整其内部项目的大小和顺序，以最佳方式填充可用空间，==尤其擅长处理一维布局问题（行或列）==，大大简化了复杂的对齐和响应式设计的实现。

**弹性布局的关键特性**：
- **弹性容器（Flex Container）**：通过设置`display: flex;`或`display: inline-flex;`，将一个元素变为弹性容器，控制其内部的弹性项目如何布局。
- **弹性项目（Flex Items）**：弹性容器内的子元素自动成为弹性项目，可以使用属性如`flex`, `align-self`, `order`等进行进一步的布局控制。
- **主轴与侧轴**：弹性布局定义了一个主轴（默认为水平方向）和一个侧轴（垂直于主轴），并通过`flex-direction`属性改变轴的方向。
- **对齐与分配**：使用`justify-content`, `align-items`, `align-content`等属性控制项目在主轴和侧轴上的对齐方式，以及多行弹性项目之间的间距。
- **伸缩性**：允许项目在需要时自动缩小或填充额外空间，通过`flex-grow`, `flex-shrink`, `flex-basis`属性控制。

::: tip 兼容性
Flex布局的兼容性已经非常广泛，现代浏览器（包括Chrome、Firefox、Safari、Edge、Opera）的最新版本以及Internet Explorer 11都支持Flexbox。然而，早期版本的浏览器（特别是IE10及更早版本）对Flexbox的支持有限，可能需要使用特定的前缀（如`-webkit-`, `-ms-`）或采用较旧的语法。

为了确保更广泛的兼容性，开发者应关注以下几点：
- 使用 autoprefixer 工具或相应的编译器配置（如Webpack配合PostCSS）自动添加必要的浏览器前缀。
- 查阅Can I Use等在线资源，了解特定Flex属性在不同浏览器中的支持情况，必要时采取回退策略或渐进增强方案。
- 对于需要支持老旧浏览器的项目，可能需要编写额外的CSS代码或使用其他布局方法（如浮动、定位或CSS Grid）作为替代或补充。
:::


### 常用属性介绍

- [`display`](./css.md#display属性): 指定 HTML 元素的显示类型（如块级、内联、行内块、flex或grid等）

- `flex-direction`: 指定了弹性容器中子元素的排列方式

- `justify-content`: 设置弹性盒子元素在主轴方向上的对齐方式

- `align-items`: 弹性盒子元素在侧轴（纵轴，与主轴垂直的方向）方向上的对齐方式

- `flex-wrap`: 设置弹性盒子的子元素超出父容器时是否换行，以及换行后的排列方式

- `align-content`: 修改 flex-wrap 属性的行为，类似 align-items

- `flex-flow`: 是flex-direction和flex-wrap属性的简写形式

- `order`: 用于改变弹性盒子模型中子元素的排列顺序，数值越小，显示越靠前

- `align-self`: 允许单个弹性子元素覆盖容器的align-items设置

- `flex`: 用于设置弹性盒子的子元素如何分配剩余空间（flex-grow）、如何收缩（flex-shrink）以及基础大小（flex-basis）的简写属性



### flex和inline-flex

`flex`和`inline-flex`都是CSS中用于实现弹性布局（Flexbox）的`display`属性值，它们共享许多相同的特性和用途，但主要区别在于它们对元素的布局模式和外部影响上：

1. **块级与行内块级行为**：
   - **flex**: 当一个元素的`display`属性设置为`flex`时，该元素会成为一个块级弹性容器。这意味着它会像常规的块级元素一样独占一行，其宽度默认为100%的父容器宽度（除非显式设置宽度），并且可以包含多个行内元素或块级元素，并以弹性布局的方式排列这些子元素。
   
   - **inline-flex**: 而当设置为`inline-flex`时，元素表现为一个行内块级弹性容器。这意味着它像`inline-block`元素那样参与行内布局，即它不会独占一行，其宽度由内容决定，并且相邻的行内元素可以与其并排显示。同时，它内部的元素依然按照弹性布局规则排列。

2. **布局影响**：
   - **flex**容器作为块级元素，会影响页面的流式布局，它下面的元素会另起一行显示。
   - **inline-flex**容器由于是行内元素，不会引起换行，它周围的文本或行内元素会与其在同一行显示，这使得布局更加灵活，特别是在需要混合文本和弹性布局元素时。

3. **应用场景**：
   - **flex**更适合用于需要控制布局块的整体布局，如页面的主要容器、分栏布局等。
   - **inline-flex**则适用于需要==在文本流中嵌入弹性布局的场景，如内联菜单、图标集合等==，这些场景要求元素既能保持弹性布局的优势，又能与文本紧密集成。

总结来说，`flex`和`inline-flex`都启用了弹性布局，主要区别在于它们的外部布局模式：`flex`作为块级元素使用，影响周围布局；而`inline-flex`作为行内块级元素，与文本流更好地融合



### flex-direction

`flex-direction`是CSS中用于控制弹性容器（flex container）内弹性项目（flex items）排列方向的一个属性。它决定了弹性项目沿着容器的主轴（main axis）分布的方式，进而影响整个布局的流向。以下是`flex-direction`的四个基本属性值及其含义：

1. **row**（默认值）:
   - **描述**: 弹性项目按照与文本方向相同的水平行进行排列。在大多数情况下，这表示从左到右的顺序。
   - **应用场景**: 适用于需要水平列表或行内元素水平布局的情况，如导航菜单、工具栏等。

2. **row-reverse**:
   - **描述**: 弹性项目同样按照水平行排列，但方向与默认的row相反，即从右到左。
   - **应用场景**: 当需要创建镜像布局或者实现特定的对齐效果时使用，例如在某些语言的阅读习惯是从右至左的文化背景下。

3. **column**:
   - **描述**: 弹性项目按照垂直列进行排列，从上到下。
   - **应用场景**: 适用于需要垂直堆叠元素的布局，比如表单字段、卡片列表等。

4. **column-reverse**:
   - **描述**: 弹性项目按照垂直列排列，但方向与默认的column相反，即从下到上。
   - **应用场景**: 当需要在布局的底部开始排列元素，或者实现某些特殊效果时使用，比如聊天界面中消息列表的逆序显示。

```css
.flex-container {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    width: 400px;
    height: 250px;
    background-color: lightgrey;
}
```

通过调整`flex-direction`属性，可以灵活地控制弹性容器内部的布局流向，从而适应不同的设计需求，特别是在响应式设计和多变的用户界面中尤为重要。此外，`flex-direction`的设置也会影响到其他与弹性布局相关的属性，如`justify-content`和`align-items`的效果，因为这些属性的定义是基于主轴和侧轴的。


### justify-content

`justify-content`是CSS中用于控制弹性容器（flex container）内部弹性项目（flex items）在主轴（main axis）上的对齐方式的一个属性。主轴是根据`flex-direction`属性定义的方向，可以是水平的也可以是垂直的。

`justify-content`提供了多种对齐选项。下面是它的几个关键属性值：

1. **flex-start**（默认值）:
   - **描述**: 弹性项目会紧靠在主轴的起始位置排列。如果是水平方向，这意味着项目会从左端开始排列；如果是垂直方向，则从顶部开始。
   - **应用场景**: 适合于不需要特别对齐效果，或者希望内容从容器的一端开始排列的情况。

2. **flex-end**:
   - **描述**: 弹性项目会紧靠在主轴的结束位置排列。水平方向上，项目会从右端开始；垂直方向上，则从底部开始。
   - **应用场景**: 当希望内容靠右或底部对齐，或者需要创建特定的视觉流时使用。

3. **center**:
   - **描述**: 弹性项目会居中对齐在主轴上。无论是水平还是垂直方向，项目都会位于容器的正中间。
   - **应用场景**: 当需要实现居中对齐效果，使内容在视觉上平衡时使用。

4. **space-between**:
   - **描述**: 弹性项目会均匀分布在主轴上，第一个项目与容器的起始边缘对齐，最后一个项目与结束边缘对齐，项目之间的间隔相等。
   - **应用场景**: 适用于需要等间距分布项目，如导航菜单、分隔的按钮组等。

5. **space-around**:
   - **描述**: 弹性项目也会均匀分布在主轴上，但每个项目的两侧间隔相等。这意味着项目之间的间隔比项目到容器边缘的间隔稍大。
   - **应用场景**: 当需要项目间有相等的间距，同时保持一定距离于容器边缘时使用。

6. **space-evenly**（较新浏览器支持）:
   - **描述**: 类似于`space-around`，但项目之间的间隔和项目到容器边缘的间隔完全相等，提供了最均匀的分布。
   - **应用场景**: 对于需要绝对均匀分布每个项目，且每个间隔都相等的布局而言非常有用。

::: tip 关于 `space-evenly` 的兼容性
- **现代浏览器**: 大多数现代浏览器已经支持 `space-evenly`，包括 Chrome、Firefox、Safari、Edge 和 Opera 的最新版本。
  
- **Internet Explorer**: Internet Explorer 不支持 `space-evenly`，因为 IE 对 Flexbox 的支持有限且不完整，特别是对于较老的版本（如 IE11 及以下）。
:::


```css
.flex-container {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
    width: 400px;
    height: 250px;
    background-color: lightgrey;
}
```

下为 `flex-direction: row;` 时的各个`justify-content`属性值效果：

<img src="https://www.runoob.com/wp-content/uploads/2016/04/2259AD60-BD56-4865-8E35-472CEABF88B2.jpg"/>

通过使用`justify-content`，能够轻松地调整弹性项目在主轴上的布局，无需手动调整边距或添加额外的空元素，极大地提高了布局的灵活性和响应性。


### align-items

`align-items`属性控制弹性容器中弹性项目在侧轴（与主轴垂直的轴）上的对齐方式

**align-items属性**：

1. **flex-start**:  项目靠侧轴起始端对齐。适合顶部对齐布局。注意保持默认间距，不影响项目自身尺寸

2. **flex-end**:  项目靠侧轴结束端对齐。常用于底部对齐元素。同样不调节项目尺寸。

3. **center**:  项目沿侧轴居中。增加布局的视觉中心。维持项目原本大小不变。

4. **stretch**（默认值）:  项目拉伸填满侧轴。确保等高列，多栏布局统一。谨防内容因过高被裁剪。

5. **baseline**:  项目依据文本基线对齐。适合文本内容排版，非文本元素表现各异。

**使用场景**：
- **flex-start**: 顶部导航、列表顶部元素。
- **flex-end**: 底部工具栏、页脚组件。
- **center**: 中心对称布局、图片展示。
- **stretch**: 列表或卡片等高布局。
- **baseline**: 表格、多行文本对齐。

**注意事项**： 考虑跨浏览器兼容性，尤其是使用`stretch`和`baseline`时的差异表现。


以下是一个简单的示例，展示了`align-items`属性使用不同值时的效果：

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>align-items 示例</title>
<style>
  .container {
    display: flex;
    width: 300px;
    height: 200px; /* 增加高度以突出显示效果 */
    border: 1px solid black;
    margin-bottom: 10px;
  }
  .item {
    flex: 1; /* 让每个项目占据相同宽度 */
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
	border: 1px solid red;
  }
  .start { background-color: lightblue; } /* align-items: flex-start */
  .end { background-color: lightgreen; } /* align-items: flex-end */
  .center { background-color: lightyellow; } /* align-items: center */
  .stretch { background-color: lightpink; } /* align-items: stretch (默认) */
  .baseline { background-color: lightsalmon; } /* align-items: baseline */
</style>
</head>
<body>

<div class="container start" style="align-items: flex-start;">
  <div class="item" style="height: 50px;">Flex Start</div>
  <div class="item" style="height: 150px;">Taller Content</div>
</div>

<div class="container end" style="align-items: flex-end;">
  <div class="item" style="height: 50px;">Flex End</div>
  <div class="item" style="height: 150px;">Taller Content</div>
</div>

<div class="container center" style="align-items: center;">
  <div class="item" style="height: 50px;">Center</div>
  <div class="item" style="height: 150px;">Taller Content</div>
</div>

<div class="container stretch" style="align-items: stretch;">
  <div class="item">Stretch</div>
  <div class="item">Stretched to Fill</div>
</div>

<div class="container baseline" style="align-items: baseline;">
  <div class="item">Baseline</div>
  <div class="item" style="height: 30px; font-size: 10px;">Baseline2</div>
</div>

</body>
</html>
```


### flex-wrap

`flex-wrap` 是 CSS Flexbox 布局中的一个重要属性，它控制弹性容器内的项目在一行排布不下时是否换行以及换行的方向。

**属性值及含义**:

1. **nowrap**（默认值）:
   - **含义**: 弹性项目将在一条直线上排列，即使这会导致溢出容器。项目宽度可能会被挤压以适应容器，以避免换行。如果项目尺寸固定且总宽度超过容器，它们将尝试缩小到最小尺寸，但仍可能溢出容器边界。
   - **使用场景**: 当希望所有项目保持在同一行，即使这会导致溢出或需要使用滚动时。

2. **wrap**:
   - **含义**: 如果项目在一条直线上无法全部放下，项目将换行显示，以避免溢出容器。新行会在必要时创建，且项目尺寸不会被挤压。
   - **使用场景**: 适用于项目数量或大小不确定，需要保证每个项目完全可见，且容器不需要滚动的情况。

3. **wrap-reverse**:
   - **含义**: 类似于`wrap`，但在换行时，新行会出现在上方（水平方向）或左侧（垂直方向），即行的堆叠顺序与正常流向相反。项目依然根据容器的自然流方向排列，只是整体的行顺序被反转。
   - **使用场景**: 特殊的布局需求，比如某些特定的动画效果或逆序排列的场景。

```css
.container {
  display: flex;
  flex-wrap: nowrap; /* 默认值，不换行 */
}

.container-wrap {
  display: flex;
  flex-wrap: wrap; /* 换行显示 */
}

.container-wrap-reverse {
  display: flex;
  flex-wrap: wrap-reverse; /* 反向换行显示 */
}
```


### align-content

`align-content` 主要用于多行 Flexbox 或 Grid 布局中，用来控制这些行之间的间距以及它们在容器中的对齐方式。

这个属性只在弹性容器具有多行（即 `flex-wrap` 设置为 `wrap` 或 `wrap-reverse`）时起作用。如果容器只有一行（默认的 `flex-wrap: nowrap`），`align-content` 的设置将不起作用，因为没有多余的空间来分配给不同的行。

**可用值及其含义**:

1. **stretch** (默认值):
   - **含义**: 每一行将会被拉伸以填满整个容器的交叉轴空间。这意味着行间的空间会被均匀分配，使得每行高度（对于垂直方向的交叉轴）或宽度（对于水平方向的交叉轴）相等。

2. **flex-start**:
   - **含义**: 所有行都紧靠容器的起始边对齐，不留额外空间。行间无间距或对齐，仅在容器边缘留有必要的最小间距。

3. **flex-end**:
   - **含义**: 所有行都紧靠容器的结束边对齐，不留额外空间。同样，行间无间距，但这次是在容器的另一端对齐。

4. **center**:
   - **含义**: 行在容器的交叉轴上居中对齐，行间空间均匀分布，使得整个行组在容器中居中。

5. **space-between**:
   - **含义**: 首行贴紧容器的起始边，末行贴紧容器的结束边，行间空间均匀分布。这样每两行之间会有相等的间距，而首尾不与任何行共享这个间距。

6. **space-around**:
   - **含义**: 行间空间均匀分布，包括行与容器边缘之间也有同样的间距。这意味着每行周围的间距是相邻行间距的一半。

**注意**:
- `align-content` 不会影响单个项目的对齐，要控制单个项目在交叉轴上的对齐方式，应该使用 `align-items`（针对容器）或 `align-self`（针对单个项目）属性。
- 在 Grid 布局中，`align-content` 的行为与 Flexbox 类似，但应用于 Grid 的行之间而非单个网格项。



### order排序

`order`属性允许改变弹性容器内子元素的排列顺序。

在默认情况下，弹性项目按照它们在文档流中的顺序排列，即源代码中的顺序。通过设置`order`属性，你可以打破这种默认顺序，实现更加灵活的布局控制。

**基本语法**:
```css
.order-class {
  order: <integer>;
}
```

**属性值**:
- `<integer>`：一个整数值，用来确定弹性项目在容器中的排列顺序。默认情况下，所有项目的`order`值为`0`。正值会将项目排在无序或值较小的项目之后，负值则排在前面。项目会按照`order`值的升序排列，值相同的项目则按照它们在源代码中的顺序排列。

**使用场景**:
1. **优先级展示**：当你希望特定的项目在列表中优先显示，比如将重要通知或紧急信息置于顶部，可以通过设置较小的`order`值实现。
2. **动态排序**：在需要根据用户交互或数据变化动态调整项目顺序的场景下，`order`属性可以配合JavaScript使用，动态调整布局。
3. **响应式设计**：在不同屏幕尺寸下，根据需要调整元素的排列顺序，以优化用户体验。
4. **交替布局**：在需要创建交错或特定对齐效果的布局时，通过调整项目的`order`值可以实现复杂的设计。

**注意事项**:
- `order`属性==只影响元素在视觉上的排列顺序，不会影响DOM结构或元素的源代码顺序==，也不会影响元素的文档流位置。
- 使用负数的`order`值可以让元素在源代码顺序之前显示。
- 当多个元素具有相同的`order`值时，它们按照源代码中的顺序排列。
- 对于非弹性容器中的元素，`order`属性无效。

**示例**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flex Order Property Example</title>
<style>
  .flex-container {
    display: flex;
    flex-direction: column; /* 可以根据需要调整为row或其它值 */
    gap: 10px; /* 项目间的间隔 */
  }
  .item {
    background-color: lightblue;
    padding: 10px;
    margin: 5px;
    text-align: center;
    border: 1px solid darkblue;
  }
</style>
</head>
<body>

<div class="flex-container">
  <div class="item" style="order: 1;">Third in visual, first in source.</div>
  <div class="item">Second in both visual and source.</div>
  <div class="item" style="order: -1;">First in visual, third in source.</div>
</div>

</body>
</html>
```
在此例中，虽然第三个`<div>`在源代码中是第一个，但由于其`order`值为`1`，它会显示在最后。第一个`<div>`尽管在源代码中排第三，但其`order`值为`-1`，所以在视觉上排到了最前面。




### align-self

`align-self`属性主要用于控制弹性盒子（Flexbox）布局中单个 flex 子项在侧轴（通常是纵轴，当flex容器的主轴为水平时）上的对齐方式。

这个属性允许你为每个子项单独指定对齐规则，从而覆盖容器上设置的默认 `align-items` 属性

```css
align-self: auto | flex-start | flex-end | center | baseline | stretch;
```

**参数值解释**: 
- **auto**（默认值）：子项的对齐方式继承其父容器的 `align-items` 属性值。如果父容器没有明确设置 `align-items`，则默认为 `stretch`。
- **flex-start**：子项与交叉轴的起始位置对齐。
- **flex-end**：子项与交叉轴的结束位置对齐。
- **center**：子项在交叉轴上居中对齐。
- **baseline**：子项根据其基线对齐。这适用于包含文本的元素，使得文本的基线对齐。
- **stretch**（默认值，当 `align-self` 设置为 `auto` 且父容器没定义高度时）：拉伸子项以填满整个交叉轴，即在纵轴上拉伸以充满父容器的高度。

::: info 注意事项
- `align-self` 仅适用于弹性盒子模型中的子元素，并且对非弹性容器或非弹性子元素无效。
- 该属性提供了灵活性，使得在需要的时候可以为特定的子项设置不同的对齐方式，而无需为每个子项创建单独的容器。
- 尽管 `align-self` 能覆盖 `align-items` 的设置，但它不会影响其他兄弟元素的对齐，每个子项可以通过独立的 `align-self` 值来定制自己的对齐方式。
- 不同于 `align-items` 属性应用于容器并影响所有子元素，`align-self` 是应用于单个 flex 子项的。
:::



### flex 属性

Flex属性是`flex-grow`, `flex-shrink`, 和 `flex-basis`这三个属性的简写形式。通过设置或检索这些属性，可以控制弹性盒子模型对象的子元素如何分配空间

1. `flex-grow`
- **作用**：定义了弹性项目在容器有多余空间时如何增长。
- **值**：一个无单位的数字，表示项目的放大比例。默认值为`0`，意味着项目不会放大以填充额外空间。如果所有项目的`flex-grow`都设置为`1`，则它们会等分剩余空间；若某项目的值大于1，则它将占据更多空间。

2. `flex-shrink`
- **作用**：定义了弹性项目在容器空间不足时如何缩小。
- **值**：一个无单位的数字，表示项目的缩小比例。默认值为`1`，意味着项目会按照相同比例缩小以适应容器。如果设置为`0`，则项目将不缩小。

3. `flex-basis`
- **作用**：定义了在分配多余空间之前，项目的初始大小。
- **值**：可以是`auto`、`inherit`、`initial`、`unset`，或者是具体的长度单位（如`px`, `%`, `em`, `rem`等）或关键词`content`（用于某些特定情况）。默认值为`auto`，意味着项目大小基于其内容大小计算。

`flex`属性的简写形式：

```css
flex: <flex-grow> <flex-shrink> <flex-basis>;
```

或者更简化的形式，使用关键字`auto`、`initial`、`none`等：

```css
flex: auto; /* 等同于 flex: 1 1 auto; */
flex: none; /* 等同于 flex: 0 0 auto; */
flex: initial; /* 等同于 flex: 0 1 auto; */
```


```css
.container {
  display: flex;
}

.item1 {
  flex: 2 1 100px; /* 该元素将首先尝试占据100px的宽度，然后按比例放大，且在缩小时也有一定灵活性 */
}

.item2 {
  flex: 1; /* 简化形式，相当于 flex: 1 1 0%，先按比例分配剩余空间，然后均等缩小 */
}

.item3 {
  flex: auto; /* 会根据内容大小自动调整，如果有剩余空间则按比例分配 */
}
```

::: tip 注意事项
- `flex`属性只对弹性容器的直接子元素（弹性项目）有效。
- 弹性容器必须通过`display: flex`或`display: inline-flex`来定义。
- 在实际应用中，合理搭配使用`justify-content`, `align-items`, `align-self`等属性可以进一步完善布局设计。
:::





## Grid布局(CSS Grid)

CSS Grid布局是一种二维布局系统，它使开发者能更加灵活地创建和控制网页布局，特别是在处理复杂且结构化的网格布局时更为高效。Grid布局允许你在容器中创建行和列的网格结构，然后将子元素放入这些网格单元格中，实现精确的布局控制。



- **Grid Container**: 设置为`display: grid;`的元素成为Grid容器，定义了一个网格布局上下文。
- **Grid Items**: Grid容器内的直接子元素称为Grid项，它们会被放置到网格的行和列中。
- **Grid Lines**: 网格线定义了每个行和列的边界，水平线称为行线，垂直线称为列线。
- **Grid Tracks**: 行线和列线之间的空间称为轨道，即行轨道（row tracks）和列轨道（column tracks）。
- **Grid Cells**: 由行和列交叉形成的单元格称为网格单元格。
- **Grid Areas**: 可以合并多个单元格定义更大的布局区域。



#### Grid Container Properties

- **display: grid;**: 将元素设置为Grid容器。
- **grid-template-columns**: 定义每一列的宽度，例如`grid-template-columns: 100px 1fr 20%;`。
- **grid-template-rows**: 定义每一行的高度，例如`grid-template-rows: auto 1fr minmax(100px, auto);`。
- **grid-template-areas**: 定义网格区域，用字符串命名区域，例如`grid-template-areas: "header header" "sidebar main" "footer footer";`。
- **grid-gap**: 设置网格线间的间隔，现已拆分为`row-gap`和`column-gap`。

#### Grid Item Properties

- **grid-column**: 控制项跨越的列范围，例如`grid-column: 2 / span 2;`表示从第二列开始，跨两列。
- **grid-row**: 控制项跨越的行范围，例如`grid-row: 1 / 3;`表示从第一行到第三行。
- **grid-area**: 指定项所占的网格区域名称，对应`grid-template-areas`中定义的名称。



假设我们要创建一个简单的三栏布局，左边是导航，中间是主要内容，右边是广告。

```html
<div class="grid-container">
  <div class="header">Header</div>
  <div class="nav">Navigation</div>
  <div class="main">Main Content</div>
  <div class="aside">Sidebar</div>
  <div class="footer">Footer</div>
</div>
```

```css
.grid-container {
  display: grid;
  grid-template-columns: 20% 60% 20%;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  gap: 10px;
}

.nav { grid-area: nav; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.header { grid-area: header; }
.footer { grid-area: footer; }
```

在这个示例中，我们定义了一个三列的网格布局，通过`grid-template-areas`指定了不同部分的位置，使得导航、主要内容、侧边栏分别占据各自的列，而头部和底部横跨所有列。`gap`属性则添加了网格线之间的间距。

CSS Grid布局的强大之处在于它提供了高度灵活的布局控制能力，能够轻松应对各种复杂的页面布局需求，特别是那些需要同时考虑行和列对齐的场景。
---

order: 25
title:  JavaServer Pages
shortTitle: JavaServer Pages

---


JSP全名为Java Server Pages，中⽂名叫java服务器⻚⾯，其根本是⼀个简化的Servlet设计

一个JSP页面由**元素**和**模板数据**组成。元素是必须由JSP容器处理的部分，而模板数据（HTML）是JSP容器不处理的部分



注释：在JSP页面中，可以使用两种类型的注释

- 一种是HTML注释，这种注释可以在客户端看到
- 一种是为JSP页面本身所做的注释，通常是给程序员看的，我们称之为JSP注释

```html
<!-- HTML注释 -->
```

```html
<%-- JSP注释 --%>
```

<br>



## 1. JSP运行机制

JSP是一种建立在Servlet规范功能之上的动态网页技术、JSP文件在用户第一次请求时，会被编译成Servlet，然后再由这个Servlet处理用户的请求，所以JSP也可以被看成是运行时的Servlet。（Web容器和JSP容器是同义的）

![](https://image.ventix.top/java/image-20211101170023815.png)

JSP容器管理JSP页面生命周期的两个阶段：

- 转换阶段（translation phase）：当有一个对JSP页面的客户请求到来时，JSP容器检验JSP页面的语法是否正确，将JSP页面转换为Servlet源文件，然后调用javac工具类编译Servlet源文件生成字节码文件

- 执行阶段（execution phase）：Servlet容器加载转换后的Servlet类，实例化一个对象处理客户端的请求，在请求处理完成后，响应对象被JSP容器接收，容器将HTML格式的响应信息发送到客户端

Note：

- 当第一次加载JSP页面时，因为要将JSP文件转换为Servlet类，所以响应速度较慢

- 当再次请求时，JSP容器就会直接执行第一次请求时产生的Servlet，而不会重新转换JSP文件，所以其执行速度和原始的Servlet执行速度几乎相同

- 在JSP执行期间，JSP容器会检查JSP文件，看是否有更新或修改。如果有更新或修改，则JSP容器会再次编译JSP或Servlet；如果没有更新或修改，就直接执行前面产生的Servlet，这也是JSP相对于Servlet的好处之一

<br>



## 2. JSP指令元素

指令元素（directive element）：主要用于为转换阶段提供整个JSP页面的相关信息，指令不会产生任何输出到当前的输出流中

三大指令: page指令、include指令和taglib指令

```html
<%--1. page指令  (要注意的是，在page指令中只有import属性可以重复设置)--%>
<%@page import="javax.servlet.*, java.util.Vector" %>
<%@page import="java.util.Random" %>

<%-- page指令不常用的属性：
language：当前JSP编译后的语言！默认为java，当前也只能选择java
info：当前JSP的说明信息,可以通过调用Servlet接口的getServletInfo()方法来得到
isThreadSafe：当前JSP是否执行只能单线程访问，默认为false，表示支持并发访问
session：当前页面是否可以使用session，默认为false，表示在JSP页面中可以使用隐含的session对象
extends：指定JSP编译的servlet的父类！ 
--%>
```

<br>

| page指令常用属性                             | 默认值 | 作用                                                         |
| -------------------------------------------- | ------ | ------------------------------------------------------------ |
| import="importList"                          |        | 指定在脚本环境中可以使用的Java类                             |
| buffer="none\|size kb"                       | 8kb    | 指定out对象（类型为JspWriter）使用的缓冲区大小，如果设置为none，则将不使用缓冲区 |
| autoFlush="true\|false"                      | true   | 当缓冲区满的时候，缓存的输出是否应该自动刷新                 |
| errorPage="error_url"                        |        | 当JSP页面发生异常时，将转向哪一个错误处理页面。如果一个页面通过使用该属性定义了错误页面，那么在web.xml文件中定义的任何错误页面将不会被使用 |
| isErrorPage="true\|false"                    | false  | 用于指定当前的JSP页面是否是另一个JSP页面的错误处理页面       |
| pageEncoding="peinfo"                        |        | 指定JSP页面使用的字符编码。如果没有设置这个属性，则JSP页面使用contentType属性指定的字符集，如果这两个属性都没有指定，则使用字符集“ISO-8859-1” |
| contentType="ctinfo"                         |        | 用于响应的JSP页面的MIME类型和字符编码                        |
| isELIgnored="true\|false"                    | false  | 在JSP页面中是否执行或忽略EL表达式(Servlet 2.3或之前版本的格式，则默认值是true) |
| deferredSyntaxAllowedAsLiteral="true\|false" |        | JSP页面的模板文本中是否允许出现字符序列`#{`                  |
| trimDirectiveWhitespaces="true\|false"       | false  | 指示模板中的空白应该如何处理(默认值是false，即不删除空白)    |

```html

<%--2. include指令 --%>
<%--用于在JSP页面中静态包含一个文件，该文件可以是JSP页面、HTML网页、文本文件或一段Java代码--%>
<%@include file="demo.jsp"%>

<%-- 3. taglib指令是用来在当前jsp页面中导入第三方的标签库--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
prefix：指定标签前缀，这个东西可以随意起名
uri：   指定第三方标签库的uri（唯一标识）

```

<br>

## 3. JSP脚本元素

脚本元素（scripting element）包括：声明（declaration）、脚本段（scriptlet）、表达式（expression）

JSP 2.0增加了EL表达式，作为脚本元素的另一个选择

```java
<%--脚本元素（scripting element）--%>
<%--1. 声明（declaration）：用于在JSP页面中声明合法的变量和方法。以“<%!”开始，以“%>”结束 --%>
<%!
    public String getTodaysDate() {
        return (new Date()).toString();
    }
%>

<%--2. 脚本（scripts）：合法的Java代码。以“<%”开始，以“%>”结束。--%>
<%
    for(Enumeration<String> e = request.getHeaderNames(); e.hasMoreElements();){
        String header = e.nextElement();
        out.println(header + ": " + request.getHeader(header) + "<br />");
    }
    String message = "Thank you";
%>

<%--3. 表达式（expression）：计算表达式的值，并使用隐式对象out将结果以字符串的形式输出 --%>
Today is <%=java.util.Calendar.getInstance().getTime() %>
Today is
<%
    out.println(java.util.Calendar.getInstance().getTime());
%>

```

<br>

## 4. JSP动作元素

动作元素（action element）：动作元素为请求处理阶段提供信息

- 与JSP指令元素不同的是，JSP动作元素在请求处理阶段起作用。JSP动作元素是用XML语法写成的
- 利用JSP动作可以动态地插入文件、重用JavaBean组件、把用户重定向到另外的页面、为Java插件生成HTML代码

- 动作元素基本上都是预定义的函数，JSP规范定义了一系列的标准动作，它用JSP作为前缀，可用的标准动作元素如下

| 语法            | 描述                                          |
| --------------- | --------------------------------------------- |
| jsp:include     | 在页面被请求的时候引入一个文件                |
| jsp:useBean     | 寻找或者实例化一个JavaBean                    |
| jsp:setProperty | 设置JavaBean的属性                            |
| jsp:getProperty | 输出某个JavaBean的属性                        |
| jsp:forward     | 把请求转到一个新的页面                        |
| jsp:plugin      | 根据浏览器类型为Java插件生成OBJECT或EMBED标记 |
| jsp:element     | 定义动态XML元素                               |
| jsp:attribute   | 设置动态定义的XML元素属性                     |
| jsp:body        | 设置动态定义的XML元素内容                     |
| jsp:text        | 在JSP页面和文档中使用写入文本的模板           |

```html

<jsp:useBean id="test" class="com.example.main.TestBean" />

<jsp:setProperty name="test" property="message" value="hehe..." />
<jsp:getProperty name="test" property="message" />

```

```java

public class TestBean {
   private String message;
 
   public String getMessage() {
      return(message);
   }
   public void setMessage(String message) {
      this.message = message;
   }
}

```



<br>

## 5. JSP隐含对象

在JSP中一共有9个隐含对象，这个9个对象我可以在JSP中直接使用

| 隐含对象    | 类型                                   | 说明                                     |
| ----------- | -------------------------------------- | ---------------------------------------- |
| request     | javax.servlet.http.HttpServletRequest  | 可以获取用户发送的请求信息               |
| response    | javax.servlet.http.HttpScrvletResponse | 向浏览器发送响应信息                     |
| pageContext | javax.scrvlet.jsp.PageContext          | 当前页面的上下文                         |
| session     | javax.scrvlet.http.HttpSession         | 域对象，用来共享数据                     |
| application | javax.servlet.ServletContext           | 代表整个WEB应用，是JavaWeb中最大的域对象 |
| out         | javax.servlet.jsp.JspWriter            | 向页面输出内容                           |
| config      | javax.servlet.ServletConfig            | 当前JSP的配置信息(初始化参数)            |
| page        | java.lang.Object                       | 代表当前JSP的对象                        |
| exception   | java.lang.Throwable                    | 页面中的异常                             |

<br>



# 六 EL表达式和JSTL

## 6. EL表达式语言

表达式语言（Expression Language，简称EL）语法简单，使用方便。所有的EL表达式都是以 `${` 开始，以 `}` 结束

当EL表达式作为标签的属性值时，还可以使用`#{expr}`语法，这是在JSP 2.1版本中引入的延迟表达式（Deferred Expression）的语法

| EL基础操作符 |             **描述**             |
| :----------: | :------------------------------: |
|      .       | 访问一个Bean属性或者一个映射条目 |
|      []      |    访问一个数组或者链表的元素    |
|     ( )      |   组织一个子表达式以改变优先级   |
|      +       |                加                |
|      -       |              减或负              |
|      *       |                乘                |
|   / or div   |                除                |
|   % or mod   |               取模               |
|   == or eq   |           测试是否相等           |
|   != or ne   |           测试是否不等           |
|   < or lt    |           测试是否小于           |
|   > or gt    |           测试是否大于           |
|   <= or le   |         测试是否小于等于         |
|   >= or ge   |         测试是否大于等于         |
|  && or and   |            测试逻辑与            |
|  \|\| or or  |            测试逻辑或            |
|   ! or not   |             测试取反             |
|    empty     |           测试是否空值           |

```html

<!--使用表达式及操作符-->
Box Perimeter is: ${2*box.width + 2*box.height}

```

<br>

| EL隐含对象       | **描述**                      |
| :--------------- | :---------------------------- |
| pageScope        | page 作用域                   |
| requestScope     | request 作用域                |
| sessionScope     | session 作用域                |
| applicationScope | application 作用域            |
| param            | Request 对象的参数，字符串    |
| paramValues      | Request对象的参数，字符串集合 |
| header           | HTTP 信息头，字符串           |
| headerValues     | HTTP 信息头，字符串集合       |
| initParam        | 上下文初始化参数              |
| cookie           | Cookie值                      |
| pageContext      | 当前页面的pageContext         |

pageScope，requestScope，sessionScope，applicationScope变量用来访问存储在各个作用域层次的变量

```html

<!-- 脚本元素和表达式取值对比 -->
<%=pageContext.getAttribute("address1") %>
<%=pageContext.getAttribute("address", PageContext.REQUEST_SCOPE) %>
<%=pageContext.getAttribute("address", PageContext.SESSION_SCOPE) %>
<%=pageContext.getAttribute("address", pageContext.APPLICATION_SCOPE) %>

${pageScope.address1 }
${requestScope.address }
${sessionScope.address }
${applicationScope.address }

<!-- 需求2: 通过el表达式 从不确定域中获取数据 -->
<%=pageContext.findAttribute("address") %>

```

当表达式没有指定变量或者对象的范围时， 那么容器会依次从 `pageContext—>request—>session—>application` 中查找该变量或对象

**注意：**

1. EL表达式只可以从四大域中获取数据，但不可以存放数据

2. EL表达式中的内容会显示到浏览器上
3. 使用pageContext的getAttribute方法或者findAttribute方法从4个范围中取出数据的时候、如果指定的key不存在、会返回null，而使用el表达式取出的时候指定的key不存在，页面上什么都不会显示

<br>



## 7. JSP标准标签库

JSP标准标签库（JavaServer Pages Standard Tag Library，JSTL）是一个JSP标签集合，它封装了JSP应用的通用核心功能

JSTL 库安装：

- 官方下载地址：http://tomcat.apache.org/taglibs/
- 菜鸟下载地址：[jakarta-taglibs-standard-1.1.2.zip](http://static.runoob.com/download/jakarta-taglibs-standard-1.1.2.tar.gz)

maven引入：

```xml
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
    <version>1.2</version>
</dependency>
<!--  jstl-1.2之后可不再使用standard.jar-->
```

<br>

| JSTL标签分类 | 引用语法                                                     |      |
| ------------ | ------------------------------------------------------------ | ---- |
| 核心标签     | <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> |      |
| 格式化标签   | <%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> |      |
| SQL标签      | <%@ taglib prefix="sql"  uri="http://java.sun.com/jsp/jstl/sql" %> |      |
| XML标签      | <%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml" %> |      |
| JSTL函数     | <%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %> |      |

<br>

## 8. JSTL核心标签

Core标签库主要包括了`一般用途的标签`、`条件标签`、`迭代标签`和`与URL相关的标签 `

```html

<!-- 在JSP页面中使用Core标签库，要使用taglib指令，指定引用的标签库 -->
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

```

<br>

一般用途的标签有：`<c:out>`、`<c:set>`、`<c:remove>`和`<c:catch>`

```html

<%-- 1. <c:out>: 类似于JSP的表达式<%=expression%>，或者EL表达式${el-expression} --%>
<c:out value="hello"></c:out>

<%-- 2. <c:set>: 用于设置范围变量（即范围属性）的值或者JavaBean对象的属性 --%>
<c:set var="width" value="25" scope="page" />
<c:out value="width: ${width}" /> <br/>

<%-- 3. <c:remove>: 用于移除指定范围的某个变量 --%>
<C:remove var="width" scope="page" />

<%-- 4. <c:catch>用于捕获在其中嵌套的操作所抛出的异常对象，并将异常信息保存到变量中 --%>
<c:catch var="exception">
    <%
        int temp = 5/0;
    %>
</c:catch>
<c:out value="exception: ${exception}" />

```

<br>

条件标签包括`<c:if>`、`<c:choose>`、`<c:when>`和`<c:otherwise>`

```html

<%-- 1. <c:if> 用于实现Java语言中if语句的功能 --%>
<c:if test="${3 > 0}">
    显示: 3>0为true <br/>
</c:if>

<%-- 2. <c:choose>、<c:when>和<c:otherwise>一起实现互斥条件的执行，类似于Java语言的if/else if/else语句 --%>
<c:set var="username" value="admin" scope="application" />
<c:choose>
    <c:when test="${username == 'zhangsan'}">
        ${username} 是一个普通用户！ <br/>
    </c:when>
    <c:when test="${username == 'admin'}">
        ${username} 是管理员！ <br/>
    </c:when>
    <c:otherwise>
        ${username} 是一个临时访客！ <br/>
    </c:otherwise>
</c:choose>

```

<br>

迭代标签有`<c:forEach>`和`<c:forTokens>`

```html

<%-- 1. <c:forEach>用于对包含了多个对象的集合进行迭代 --%>
<c:forEach var="i" begin="1" end="5">
    Item <c:out value="${i}"/><br/>
</c:forEach>

<%
    Map<String, Object> map = new HashMap<>();
    map.put("key1", "value1");
    map.put("key2", "value2");
    map.put("key3", "value3");
    request.setAttribute("testMap", map);
%>
<c:forEach items="${requestScope.testMap}" var="entry">
    ${entry} <br/>  <%--  等同于： ${entry.key} = ${entry.value} <br/>  --%>
</c:forEach>

<%-- 2. <c:forTokens>用于迭代字符串中由分隔符分隔的各成员 --%>
<c:forTokens items="zhangsan:lisi:wangwu" delims=":" var="name">
    ${name} <br/>
</c:forTokens>

```

<br>

超链接、页面的包含和重定向是Web应用中常用的功能，在JSTL中，也提供了相应的标签来完成这些功能，

这些标签包括`<c:import>`、`<c:url>`、`<c:redirect>`和`<c:param>`

- `<c:import>` 用于导入一个基于URL的资源
- `<c:url>` 使用正确的URL重写规则构造一个URL
- `<c:param>` 为一个URL添加请求参数
- `<c:redirect>` 将客户端的请求重定向到另一个资源

```html

<%-- 1. <c:import>标签类似于 <jsp:include>动作元素 --%>
<c:import url="demo.jsp"/>

<%-- 2.  <c:url>和<c:param>用于构造一个URL、<c:redirect>遵循和<c:url>同样的重写规则 --%>
<c:url value="http://localhost:8080/login" var="loginUrl">
    <c:param name="username" value="admin"/>
    <c:param name="password" value="admin"/>
</c:url>
<a href="${loginUrl}" >登录</a>

```

<br>

## 9. JSTL其他标签

格式化标签包括`<fmt:timeZone>`、`<fmt:setTimeZone>`、`<fmt:formatNumber>`、`<fmt:parseNumber>`、`<fmt:formatDate>`和`<fmt:parseDate>`

```html

<%-- <fmt:formatDate>标签用于使用不同的方式格式化日期 --%>
<c:set var="now" value="<%=new Date() %>"/>
<fmt:formatDate value="${now}" type="both" dateStyle="long" timeStyle="long"/><br/>
<fmt:formatDate value="${now}" pattern="yyyy-MM-dd HH:mm:ss"/> <br/>

```

<br>
---

order: 30
title:  同源策略与跨域请求
shortTitle: 解决跨域问题

---



## 一 同源策略与跨域请求

**首先，跨域不是问题。是一种安全机制** 



### 1. 同源策略介绍

跨域是浏览器加载了与当前域名、协议、端口不同另一站点下的资源，这与各大支持JavaScript的浏览器的同源策略是违背的。

所谓[ **同源策略** ](https://baike.baidu.com/item/同源策略)，它是由Netscape提出的一个著名的安全策略。是防止外网的脚本恶意攻击服务器的一种措施。

现在所有支持JavaScript 的浏览器都会使用这个策略。

所谓同源是指，域名，协议，端口相同。



### 2. 跨域请求的问题

-- 前后端分离的开发环境下

跨域并不会阻止请求的发出，也不会阻止请求的接受，跨域是浏览器为了保护当前页面，你的请求得到了响应，浏览器不会把响应的数据交给页面上的回调，取而代之的是去提示你这是一个跨域数据。提示就是一个报错提醒



知道了浏览器是如何处理的了，才能对症下药来解决这个问题，下面介绍几种常用的跨域解决方法



## 二 解决跨域请求的问题

### 1. 跨域资源共享CORS

这是最靠谱也是非常科学的解决方案，通过`Access-Control-Allow-Origin`响应头，告诉浏览器如果请求`我的资源的页面` 是 `我这个响应头里记录了的"源"`，则不要拦截此响应，允许数据通行。



| header头字段                     | 含义                                                         | 取值                       |
| -------------------------------- | ------------------------------------------------------------ | -------------------------- |
| Access-Control-Allow-Credentials | 响应头表示是否可以将对请求的响应暴露给页面。返回true则可以，其他值均不可以。 | true/false                 |
| Access-Control-Allow-Headers     | 表示此次请求中可以使用那些header字段                         | 符合请求头规范的字符串     |
| Access-Control-Allow-Methods     | 表示此次请求中可以使用那些请求方法                           | GET/POST(多个使用逗号隔开) |



<br>



### 2. 跨域请求与Cookie







<br>



### 3. 前端解决方案JSONP

当服务端没有返回`Access-Control-Allow-Origin`这样的字段时，是否就意味着不能使用此资源了吗？不！只能说不建议使用此资源了。但我们还有另一种办法，那就是通过JSONP。



 

## 三 SpringBoot跨域配置

java解决CORS跨域请求的方式，主要有以下几种方式可供选择：

1. 返回新的CorsFilter
2. 重写 WebMvcConfigurer
3. 使用注解 @CrossOrigin
4. 自定义web filter 实现跨域 （手动设置响应头 ：HttpServletResponse）



### 1. CorsFilter★★★

返回新的CorsFilter(全局跨域)

在任意配置类，返回一个 新的 CorsFIlter Bean ，并添加映射路径和具体的CORS配置路径。

```java
/**
 *
 * 设置跨域请求
 **/
@Configuration
public class CorsConfig {
    private CorsConfiguration buildConfig() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*"); // 1 设置访问源地址
        corsConfiguration.addAllowedHeader("*"); // 2 设置访问源请求头
        corsConfiguration.addAllowedMethod("*"); // 3 设置访问源请求方法
        return corsConfiguration;
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
         // 4 对接口配置跨域设置 “*”代表全部。”**”代表适配所有接口。 
        source.registerCorsConfiguration("/**", buildConfig());
        return new CorsFilter(source);
    }
}
```



<br>



### 2. WebMvcConfigurer

重写WebMvcConfigurer(全局跨域)

```java

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                //是否发送Cookie
                .allowCredentials(true)
                //放行哪些原始域
                .allowedOrigins("*")
                .allowedMethods(new String[]{"GET", "POST", "PUT", "DELETE"})
                .allowedHeaders("*")
                .exposedHeaders("*");
    }
}


```



<br>



### 3. @CrossOrgin

可以用在方法上，也可以用在类上。如果你不设置他的**value**属性，或者是**origins**属性，就默认是可以允许所有的URL/域访问

```java

//@CrossOrigin  表示所有的URL均可访问此资源
@CrossOrigin(origins = "http://127.0.0.1:8093")//表示只允许这一个url可以跨域访问这个controller
@RestController
@RequestMapping("/testCorss")
public class CorssOriginController {

    //可以对方法运用该注解
    //@CrossOrigin(origins = "http://127.0.0.1:8093")
    @GetMapping("/getString")
    public String getString(){
        return "跨域成功！";
    }

}

```

- **value** 属性可以设置多个URL。
- **origins** 属性也可以设置多个URL。
- **maxAge** 属性指定了准备响应前的缓存持续的最大时间。就是探测请求的有效期。
- **allowCredentials** 属性表示用户是否可以发送、处理 cookie。默认为false
- **allowedHeaders** 属性表示允许的请求头部有哪些。
- **methods** 属性表示允许请求的方法，默认get，post，head。



<br>



### 4. 通过filter实现跨域

使用自定义filter，手动设置响应头实现跨域，定义一个类、实现Filter接口即可

```java

@Component
public class MyCorsFilter implements Filter {

  public void doFilter(ServletRequest req, ServletResponse res, 
  FilterChain chain) throws IOException, ServletException {
  
    HttpServletResponse response = (HttpServletResponse) res;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    response.setHeader("Access-Control-Max-Age", "3600");
    response.setHeader("Access-Control-Allow-Headers", "x-requested-with,content-type");
    chain.doFilter(req, res);
    
  }
  
  public void init(FilterConfig filterConfig) {}
  public void destroy() {}
    
}

```

<br>



也可以通过手动设置响应头实现局部跨域：

再具体的方法中使用 HttpServletResponse 对象添加响应头(Access-Control-Allow-Origin)来授权放行即可

```java

@RequestMapping("/index")
public String index(HttpServletResponse response) {

    response.addHeader("Access-Allow-Control-Origin","*");
    return "index";
}

```


























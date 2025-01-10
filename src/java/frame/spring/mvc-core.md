---

order: 50
title:  SpringMVC应用实践

---


## Controller和Handler

在Spring MVC框架中，Controller是MVC架构中的“C”部分，即控制器。它是一个用来接收HTTP请求的组件，处理用户的输入，为用户请求执行适当的业务逻辑，并返回相应的视图给用户。以下是Controller的一些关键特点：

1. **控制器的角色和职责：**
   - **请求映射：** 利用`@RequestMapping`或者具体的映射注解（如`@GetMapping`，`@PostMapping`等），将特定的请求路径映射到控制器的方法上。
   - **请求处理：** 接受用户的输入数据，调用业务层代码处理用户请求。
   - **数据模型填充：** 将业务处理的结果放入模型中，模型数据可以直接返回或者通过`ModelAndView`对象传递给视图。
   - **视图选择：** 决定返回给用户的视图名称，可以是重定向、转发，或返回一个具体视图的名称。
   - **异常处理：** 控制器可以有自己的异常处理逻辑，或者通过 `@ExceptionHandler` 注解处理特定异常。

2. **定义控制器组件：**
   在Spring MVC中，通过`@Controller`注解来定义一个控制器。此注解表明被标注的类是一个Spring组件，并且将它作为控制器注册至Spring上下文中。

3. **请求处理方法：**
   控制器内部的方法会通过注解来映射请求路径，并处理各种类型的请求参数

4. **响应处理：**
   控制器方法可以使用`@ResponseBody`注解或者返回`ResponseEntity`来提供RESTful风格的web服务。响应体通常是通过转换器（如Jackson库）自动转换成JSON或XML。

在实际应用中，可以根据需要创建多个控制器，每个控制器负责管理应用程序的不同部分。Spring框架提供的灵活性让开发者可以很容易地设计和实现清晰的REST API和Web页面控制逻辑。


### 传统Servlet开发模式

在Spring MVC框架中，虽然注解方式提供了便利和强大的编程模型，但有时候开发者可能需要回退到更底层的Servlet API。Spring MVC 通过与底层的Servlet API的兼容性使这成为可能。下面是一些获取请求参数和返回响应的传统Servlet方式：

1. **HttpServletRequest 和 HttpServletResponse**
   传统的Servlet API 中的 `HttpServletRequest` 和 `HttpServletResponse` 在Spring MVC控制器中仍然是可以使用的。这允许开发者直接操作请求和响应对象。

   示例获取参数：
   ```java
   @RequestMapping("/greet")
   public void greet(HttpServletRequest request, HttpServletResponse response) throws IOException {
       String name = request.getParameter("name");
       if (name == null) {
           name = "World";
       }
       response.getWriter().write("Hello, " + name);
   }
   ```

2. **HttpSession**
   同样，可以直接操作 `HttpSession` 对象来管理会话数据。

   示例操作会话：
   ```java
   @GetMapping("/session")
   public String getSessionData(HttpServletRequest request) {
       HttpSession session = request.getSession();
       String data = (String) session.getAttribute("data");
       // ...
   }
   ```

3. **获取请求头信息**
   直接从 `HttpServletRequest` 获取请求头信息。

   示例获取请求头：
   ```java
   @RequestMapping("/headerInfo")
   public void displayHeaderInfo(HttpServletRequest request, HttpServletResponse response) throws IOException {
       String host = request.getHeader("Host");
       response.getWriter().println("Host: " + host);
   }
   ```

4. **获取Cookie信息**
   Servlet API 允许直接从 `HttpServletRequest` 读取 cookies。

   示例读取Cookie：
   ```java
   @GetMapping("/cookieInfo")
   public void readCookie(HttpServletRequest request, HttpServletResponse response) throws IOException {
       Cookie[] cookies = request.getCookies();
       if (cookies != null) {
           for (Cookie cookie : cookies) {
               response.getWriter().println(cookie.getName() + " : " + cookie.getValue());
           }
       }
   }
   ```

5. **返回响应内容**
   使用 `HttpServletResponse` 直接操作响应内容，包括设置状态码、编写响应体等。

   示例写入响应：
   ```java
   @PostMapping("/submitData")
   public void submitData(HttpServletRequest request, HttpServletResponse response) throws IOException {
       // 处理请求数据...
       response.setStatus(HttpServletResponse.SC_CREATED); // 设置状态码为201
       response.getWriter().println("Data created successfully");
   }
   ```

通过这种方式，即使在注解驱动的Spring MVC程序中，开发者也可以使用Servlet原生的API来处理HTTP请求和响应。虽然这不是常用的做法，因为它对测试和模拟不够友好，但在一些特殊场景下可能非常有用，比如处理非标准的HTTP操作或者使用了特殊Servlet API特性的情形。


### 请求处理方法相关注解

1. **@RequestMapping**
   `@RequestMapping`注解是最基础的请求映射注解，通过其属性来定义请求的类型、路径、参数、头信息以及其他请求限制条件。它可以用在类或方法上。示例：
   ```java
   @RequestMapping(value = "/users", method = RequestMethod.GET)
   public String listUsers(Model model) {
       // ...
   }
   ```
   
2. **@GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @PatchMapping**
   这些注解是`@RequestMapping`的特定快捷形式，分别用于处理HTTP的GET, POST, PUT, DELETE, PATCH请求。它们只能应用于方法上。示例：
   ```java
   @GetMapping("/users")
   public String getUsers(Model model) {
       // ...
   }

   @PostMapping("/users")
   public String addUser(@ModelAttribute User user, Model model) {
       // ...
   }
   ```

### 请求参数相关注解
**请求参数绑定的注解：**
   - **@RequestParam** - 用于访问请求参数的值（即查询字符串或表单参数）。示例：
     ```java
     @GetMapping("/greet")
     public String greet(@RequestParam(name = "name", required = false, defaultValue = "World") String name) {
         // ...
     }
     ```
   - **@PathVariable** - 用于访问URI中的变量。示例：
     ```java
     @GetMapping("/users/{id}")
     public String getUser(@PathVariable("id") Long id, Model model) {
         // ...
     }
     ```
   - **@RequestBody** - 用于访问请求体的内容，通常用于接收 ==JSON或XML格式== 的数据。示例：
     ```java
     @PostMapping("/users")
     public ResponseEntity<User> createUser(@RequestBody User user) {
         // ...
     }
     ```
   - **@RequestHeader** - 用于访问请求头中的特定属性。示例：
     ```java
     @GetMapping("/check")
     public String checkHeader(@RequestHeader("User-Agent") String userAgent) {
         // ...
     }
     ```
   - **@CookieValue** - 用于访问Cookie中的值。示例：
     ```java
     @GetMapping("/prefs")
     public String getPreferences(@CookieValue("theme") String theme) {
         // ...
     }
     ```
   - **@ModelAttribute** - 用于从 ==表单== 提交的数据中，把请求参数绑定到一个对象上。示例：
     ```java
     @PostMapping("/users")
     public String submit(@ModelAttribute User user) {
         // ...
     }
     ```

### URI路径映射规则

在Spring MVC中，`@RequestMapping`注解（以及派生的快捷映射注解，如`@GetMapping`、`@PostMapping`等）的`value`属性用于将控制器中的方法与HTTP请求的URL路径进行映射。了解这个映射的规则和注意事项对于编写可维护和易理解的代码至关重要。

下面详细解释`value`属性的规则和应注意的事项：

1. **基本映射：**
   `value`属性定义了方法处理的请求URI的模式。 URI模式可以是精确的字符串或带有通配符的模式。
   
   示例：
   ```java
   @RequestMapping(value = "/home")
   public String home() {
       return "home";
   }
   ```
   
   上面的例子将会匹配准确路径`/home`的GET请求。

2. **通配符：**
   - `*`代表任意数量的字符。
   - `**`代表任意数量的目录。
   
   示例：
   ```java
   @RequestMapping(value = "/files/*")
   public String getFiles() {
       // 会匹配 /files/x, /files/y 等路径
   }

   @RequestMapping(value = "/docs/**")
   public String getDocs() {
       // 会匹配 /docs/x, /docs/x/y, /docs/x/y/z 等路径
   }
   ```

3. **路径变量：**
   花括号`{}`中的内容表示路径变量，可将某段URI映射到方法的参数上。
   
   示例：
   ```java
   @RequestMapping(value = "/users/{userId}")
   public String getUser(@PathVariable("userId") String userId) {
       // ...
   }
   ```
   
   上面的例子会将URI中`/users/1`的`1`部分注入方法的`userId`参数中。

4. **正则表达式：**
   `@RequestMapping`支持在路径变量中使用正则表达式来进一步限制匹配。
   
   示例：
   ```java
   @RequestMapping(value = "/files/{filename:.+}")
   public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
       // ...
   }
   ```
   
   正则表达式`.+`确保`filename`可以包括点（`.`）后的文件扩展名。

::: tip 注意事项
- **路径唯一性：** 确保不同的控制器方法不要映射到相同的路径，否则可能导致意外的行为。
- **尾斜杠：** 默认情况下，Spring MVC对于URL路径末尾的斜杠是有区别的。你可以通过配置来改变这个行为。
- **路径前缀：** 如果在控制器类级别也使用了`@RequestMapping`，那么类级别的路径会作为该控制器中所有方法的前缀。
- **合理组织：** 为了增强代码的可理解性，建议将相关功能的处理方法组织在同一个控制器中，并通过路径反映它们之间的关系。
- **避免与静态资源冲突：** 确保映射的路径不要与应用中使用的静态资源的路径相冲突，例如 `/images`, `/js`, `/css` 等路径。
:::
通过合理利用`value`属性及其通配符和变量，开发者可以创建灵活且强大的URL路径映射规则，根据项目结构和需求设计出清晰和结构化的URL模式。这是有效组织Spring MVC控制器的关键部分，有助于保证应用程序的清晰性和可维护性。


### 响应视图或Json数据

1. 返回视图（例如JSP页面）

为了返回一个视图，你需要创建一个方法，它的返回类型为`String`，它返回视图名称，并且通常使用`@RequestMapping`或其一种变体`@GetMapping`、`@PostMapping`等注解标注。

```java
@Controller
public class MyViewController {

    @GetMapping("/greeting")
    public String greeting(Model model) {
        model.addAttribute("message", "Hello, World!");
        return "greeting"; // 返回的是view的名称，默认路径是src/main/resources/templates/greeting.html
    }
}
```

你的视图文件（如`greeting.jsp`）可能位于`/WEB-INF/views/`（这是一个常见的位置），并包含用于显示信息的代码。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Greeting Page</title>
</head>
<body>
    <h1>${message}</h1>
</body>
</html>
```

2. 返回JSON数据

相反，如果你想返回JSON数据，需要使用`@RestController`注解或者在方法上使用`@ResponseBody`注解。然后返回一个对象或者集合类型的数据，Spring将自动使用Jackson这样的库进行序列化到JSON。

```java
@RestController
public class MyDataController {

    @GetMapping("/data")
    public MyData getData() {
        MyData data = new MyData();
        data.setId(1);
        data.setName("John Doe");
        return data; // 对象将自动转换为JSON格式
    }

    // 简单的POJO类
    public static class MyData {
        private int id;
        private String name;
        // 省略getter和setter
    }
}
```


### RESTful Web服务
RESTful（Representational State Transfer）是一种软件架构风格，它定义了一组约束和原则，用于创建Web服务。RESTful服务使用HTTP协议的标准方法（如GET、POST、PUT、DELETE等）对资源进行操作，通常以JSON或XML的形式进行数据交换。借助于其简单、轻量、易于理解和实现的特点，RESTful服务成为构建Web应用程序中非常流行的一种方式。

RESTful服务的基本原则

1. **资源的标识**：在REST架构中，所有的东西都被视为资源，每个资源都被一个URI（统一资源标识符）所唯一标识。
2. **无状态性**：每个请求从客户端到服务器必须包含所有必要的信息来理解和处理请求。服务器不会存储任何客户端请求的状态信息。
3. **可缓存**：服务器响应的数据应该标明自己是否可以被缓存。
4. **统一接口**：REST服务通过统一和预定义的接口操作资源，例如使用HTTP标准方法。
5. **分层系统**：REST允许你使用分层的系统架构，每一层只知道与之相邻的一层。

RESTful Web服务的HTTP方法

- **GET**：获取资源。
- **POST**：创建新资源。
- **PUT**：更新已有资源。
- **DELETE**：删除资源。


假设我们在开发一个用户管理系统的RESTful Web服务，用户资源可以用CRUD（创建、读取、更新、删除）操作进行管理。以下是使用Spring Boot来创建这样一个服务的一个示例：

首先，我们定义一个`User`类来表示用户资源：

```java
public class User {
    private Long id;
    private String name;
    private String email;
    // 省略构造函数、getter和setter方法
}
```

然后，我们创建一个`UserController`类来处理关于用户资源的HTTP请求：

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final Map<Long, User> users = new ConcurrentHashMap<>();

    // 获取所有用户
    @GetMapping
    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }

    // 通过ID获取单个用户
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = users.get(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    // 创建新用户
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        users.put(user.getId(), user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    // 更新用户
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        users.put(id, user);
        return ResponseEntity.ok(user);
    }

    // 删除用户
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        users.remove(id);
        return ResponseEntity.ok().build();
    }
}
```

在这个例子中，`UserController`类定义了五个方法，分别对应于用户资源的CRUD操作以及获取所有用户的操作。这些方法通过`@RestController`和`@RequestMapping`注解与相应的HTTP请求绑定。每个方法都使用适当的HTTP方法注解（如`@GetMapping`、`@PostMapping`等）来处理特定类型的请求，并通过返回`ResponseEntity`来封装HTTP响应。


通过遵循REST架构原则和使用Spring Boot这样的现代框架，开发人员可以相对容易地创建高效、可扩展的Web服务。上面的示例仅展示了如何使用Spring Boot来简单地实现一个RESTful服务，实际应用中，服务的实现可能需要处理更复杂的业务逻辑、数据验证、异常处理、安全性等方面的考虑。


## 请求参数类型转换和格式化

### 接受请求参数的方式

#### 1. 路径变量（Path Variables）

**使用步骤：**
- 在控制器方法中使用`@PathVariable`注解绑定URI模板变量。
- 在`@RequestMapping`的路径中使用花括号（`{variable}`）定义变量。

**代码示例：**
```java
@Controller
@RequestMapping("/users")
public class UserController {

    @GetMapping("/{id}")
    public String getUser(@PathVariable("id") Long userId, Model model) {
        // 假设userService.getUserById()用于获取用户
        User user = userService.getUserById(userId);
        model.addAttribute("user", user);
        return "userView";
    }
}
```

#### 2. 请求参数（Request Parameters）

**使用步骤：**
- 使用`@RequestParam`来绑定单个请求参数。
- 可指定请求参数的名称、是否必须以及默认值。

**代码示例：**
```java
@Controller
public class ProductController {

    @GetMapping("/products")
    public String searchProducts(@RequestParam(name = "q", required = false) String query, Model model) {
        List<Product> products = productService.searchProducts(query);
        model.addAttribute("products", products);
        return "productsView";
    }
}
```

#### 3. 请求体（Request Body）

**使用步骤：**
- 使用`@RequestBody`注解绑定请求体到方法参数。
- 常与`@PostMapping`等用于处理HTTP POST请求的映射注解一起使用。

**代码示例：**
```java
@Controller
@RequestMapping("/orders")
public class OrderController {

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        Order savedOrder = orderService.saveOrder(order);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }
}
```

#### 4. 表单对象（Form Objects）

**使用步骤：**
- 创建一个JavaBean用作表单的模型。
- 使用`@ModelAttribute`注解方法参数来接收表单字段。

**代码示例：**
```java
@Controller
@RequestMapping("/registrations")
public class RegistrationController {

    @PostMapping
    public String submitForm(@ModelAttribute RegistrationForm form) {
        // 处理表单数据，如注册用户
        registrationService.register(form);
        return "redirect:/home";
    }
}
```

在HTML中相应表单：
```html
<form method="POST" action="/registrations">
    <input type="text" name="username" />
    <input type="email" name="email" />
    <input type="submit" value="Register" />
</form>
```


### 常用类型转换注解

1. **@InitBinder**
   - 用于自定义请求参数的绑定和验证。
   - 在控制器中定义带有`@InitBinder`注解的方法来初始化`WebDataBinder`。
   - 可以注册自定义的编辑器和验证器。
   **代码示例：**
    ```java
    @Controller
    public class MyController {

        @InitBinder
        protected void initBinder(WebDataBinder binder) {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, false));
        }

        // 接收日期参数的控制器方法
    }
    ```

2. **@DateTimeFormat**
   - 与`@RequestParam`, `@PathVariable`, `@ModelAttribute`等注解一同使用，指定日期/时间参数的格式化方式。
   - 可以自动将字符串转换成日期/时间类型。
   **使用步骤：**
    - 为日期字段添加`@DateTimeFormat`注解。

    **代码示例：**
    ```java
    public class MyForm {
        
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        private Date date;

        // 省略了其他字段和getter/setter方法
    }

    @Controller
    public class MyController {

        @PostMapping("/submit-form")
        public String submit(@ModelAttribute MyForm form) {
            // form.getDate() 将已正确转换为Date类型
            return "success";
        }
    }
    ```
::: tip 区别和使用场景
- **@InitBinder：**
  - 通常用于Controller内部特有的数据绑定和验证需求。
  - 用于自定义WebDataBinder以应对特定的绑定策略，例如日期和集合类型。

- **@DateTimeFormat：**
  - 主要用于日期和时间类型的参数接收。
  - 可以指定日期/时间的格式，简化日期类型的数据绑定。

- **Formatter和Converter：**
  - Formatter一般用于处理文本数据与特定对象之间的格式化和解析。
  - Converter适用于更广泛的类型转换情况，不仅限于字符串。
  - Formatter通常用于表单和URL参数的处理，而Converter适用于API和内部数据之间的转换。

- **ConversionService：**
  - 作为应用程序中所有类型转换的中心服务。
  - 可以在服务层或其他组件中重用已经注册的Converter和Formatter。
:::


### Formatter转换器
- 实现`org.springframework.format.Formatter`接口，用于自定义格式转换规则。
- 适用于文本和特定对象类型之间的转换。
- 一旦注册到全局格式化器（FormatterRegistry）中，在整个应用程序中均可用。

在Spring MVC中，使用`Formatter`接口来转换日期格式是一种非常灵活的方法，它允许你将字符串和日期类型之间互相转换。这在处理表单数据或者URL参数时尤其有用。下面将通过一个使用`Formatter`来转换日期格式的代码示例进行详细说明。

1). 定义一个日期格式转换器

首先，你需要实现`Formatter`接口来定义一个自定义的日期格式转换器。这个转换器能够将字符串转换成日期(`parse`方法)并将日期转换回字符串(`print`方法)。

```java
import org.springframework.format.Formatter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class DateFormatter implements Formatter<Date> {

    private String dateFormatPattern;

    public DateFormatter(String dateFormatPattern) {
        this.dateFormatPattern = dateFormatPattern;
    }

    @Override
    public String print(Date date, Locale locale) {
        if(date == null) {
            return "";
        }
        return new SimpleDateFormat(dateFormatPattern, locale).format(date);
    }

    @Override
    public Date parse(String text, Locale locale) throws ParseException {
        if(text == null || text.isEmpty()) {
            return null;
        }
        return new SimpleDateFormat(dateFormatPattern, locale).parse(text);
    }
}
```

在上述代码中，`DateFormatter`类通过构造函数接收一个日期格式字符串(`dateFormatPattern`)，这个字符串将用于`SimpleDateFormat`的实例化。`print`方法用于将`Date`类型转换成`String`类型，而`parse`方法则将`String`类型转换成`Date`类型。

2). 注册日期格式转换器

在Spring配置中，你需要将上述定义的日期格式转换器注册到Spring MVC的转换服务中，这样Spring MVC就能够自动使用该转换器将字符串和日期类型互相转换了。

如果你的应用是基于Java配置的，你可以通过一个配置类实现`WebMvcConfigurer`接口并重写`addFormatters`方法来注册自定义的`DateFormatter`。

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatter(new DateFormatter("yyyy-MM-dd"));
    }
}
```

3). 使用转换器

一旦注册，你就可以在控制器的方法参数中使用`@RequestParam`、`@ModelAttribute`或其他相应注解和日期类型一起使用，Spring MVC会自动调用你的`DateFormatter`来处理字符串和日期类型的转换。

例如，在提交表单时，你可能有一个`@ModelAttribute`参数：

```java
@PostMapping("/submit")
public String handleSubmit(@ModelAttribute("event") Event event) {
    // 使用event.getDate()，这里的date已经被自动转换成了Date类型
    // 逻辑处理...
    return "redirect:/success";
}
```

HTML表单：

```html
<form action="/submit" method="post">
    <input type="text" name="date" />
    <input type="submit" value="Submit" />
</form>
```

在这个例子中，表单中的`date`字段会自动使用我们注册的`DateFormatter`转换器进行转换，无需在控制器中手动解析日期字符串。



### Converter转换器
- 实现`org.springframework.core.convert.converter.Converter`接口，定义一个自定义的类型转换规则。
- 当需要将一种类型转换成另一种类型时使用。

1). 创建日期格式转换器

首先，你需要创建一个实现了`Converter`接口的类。在这个类里，定义字符串到日期的转换逻辑。

```java
import org.springframework.core.convert.converter.Converter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class StringToDateConverter implements Converter<String, Date> {
    private String datePattern;

    public StringToDateConverter(String datePattern) {
        this.datePattern = datePattern;
    }

    @Override
    public Date convert(String source) {
        if (source == null || source.isEmpty()) {
            return null;
        }
        SimpleDateFormat dateFormat = new SimpleDateFormat(datePattern);
        try {
            return dateFormat.parse(source);
        } catch (ParseException e) {
            throw new IllegalArgumentException("invalid date format. Please use this pattern\"" 
                + datePattern + "\"");
        }
    }
}
```

在这个`StringToDateConverter`类中，我们接收一个日期格式字符串（`datePattern`），并在`convert`方法中使用它来解析字符串。如果解析失败，它会抛出`IllegalArgumentException`异常。

2). 注册日期格式转换器

接下来，在Spring的配置类中注册这个转换器。这可以在实现了`WebMvcConfigurer`接口的配置类中完成。通过重写`addFormatters`方法，我们将自定义转换器添加到格式化注册机制中。

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToDateConverter("yyyy-MM-dd"));
    }
}
```

3). 使用自定义转换器

在注册了转换器之后，你可以在Spring MVC控制器的方法中直接使用它。无需任何额外注解调用自定义转换器，Spring会自动使用它。

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;
import java.util.Date;

@Controller
public class EventController {

    @GetMapping("/event")
    public String getEvent(@RequestParam("date") Date eventDate, Model model) {
        // eventDate 参数将由 StringToDateConverter 自动转换
        model.addAttribute("eventDate", eventDate);
        return "event";
    }
}
```

这样，在你调用`/event?date=2023-04-05`这样的URL时，URL中的`date`参数会被自动转换为`java.util.Date`类型，并传递给`getEvent`方法的`eventDate`参数。

在这个例子中，Spring MVC框架会拦截到HTTP请求，解析`date`参数，并调用你的`StringToDateConverter`将其转换为`Date`对象。这一过程完全自动化，不需要在控制器中编写任何额外的解析代码。这使得在控制器逻辑中处理日期变得更简洁、更直观。

### ConversionService
- 是一个集中的类型转换服务，可以管理多个Converter和Formatter。
- Controller或Service都可以使用它来进行类型转换操作。

`ConversionService`是Spring框架提供的一个核心接口，用于类型转换。这个接口定义了一个统一的类型转换系统，可以在整个Spring应用程序中使用，包括Spring MVC、数据绑定、SpEL表达式解析等场景。与直接使用`Converter`接口或`Formatter`接口的方式相比，`ConversionService`提供了一个集中的方式来注册和管理转换器，使得类型转换逻辑更加模块化和复用性更高。

**与`Converter`和`Formatter`的区别** ：

- **复用性和可管理性**：`ConversionService`允许在应用程序的多个地方复用同一个转换器，而不必为每个需要转换的场景分别定义转换器。这提高了转换逻辑的一致性和可维护性。

- **集中管理**：通过`ConversionService`，所有的转换器(`Converter`和`Formatter`)可以在一个地方注册和管理，而不是分散在各处。

- **通用性**：`ConversionService`不仅支持Spring MVC框架中的数据绑定和类型转换，还可以用于任何需要类型转换的场景，如配置属性转换、SpEL表达式的评估等。

**如何使用`ConversionService`** ：

- **定义Converter或Formatter**：
    首先，定义你的转换器，如下定义一个可以转换多种日期格式的适配器
    ```java
    import org.springframework.core.convert.converter.Converter;
    import java.text.ParseException;
    import java.text.SimpleDateFormat;
    import java.util.ArrayList;
    import java.util.Date;
    import java.util.List;

    public class MultiDateFormatConverter implements Converter<String, Date> {

        private static final List<String> formats = new ArrayList<>();

        static {
            // Define all the date formats you need to support
            formats.add("yyyy-MM-dd");
            formats.add("dd/MM/yyyy");
            formats.add("MM-dd-yyyy");
            // Add more formats as necessary
        }

        @Override
        public Date convert(String source) {
            if(source == null || source.isEmpty()) {
                return null;
            }

            for (String format : formats) {
                SimpleDateFormat dateFormat = new SimpleDateFormat(format);
                dateFormat.setLenient(false); // Set lenient to false to strictly parse dates
                try {
                    // Try to parse the source string
                    return dateFormat.parse(source);
                } catch (ParseException e) {
                    // If parsing fails, continue to the next format
                }
            }

            throw new IllegalArgumentException("Invalid date format. Please use one of the supported formats: " + formats);
        }
    }
    ```

- **创建ConversionService并注册转换器**：
    接下来，创建一个`ConversionService`的实例，并将你的转换器注册到其中。Spring提供了`DefaultConversionService`，它是`ConversionService`的一个默认实现，方便使用。

- **在Spring配置中注册ConversionService**：
    最后，你可以通过编程方式或者配置方式，将你的`ConversionService`实例注册到Spring应用上下文中。

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.support.DefaultConversionService;

@Configuration
public class AppConfig {

    @Bean
    public ConversionService conversionService() {
        DefaultConversionService conversionService = new DefaultConversionService();
        conversionService.addConverter(new MultiDateFormatConverter());
        return conversionService;
    }
}
```

一旦注册了`ConversionService`，Spring就可以自动使用它进行类型转换。例如，在Spring MVC中，如果你有一个`@RequestParam`或者`@ModelAttribute`标注的日期参数，Spring会自动使用注册到`ConversionService`中的转换器将字符串转换为日期类型。

::: tip 注意手动调用和自动调用转换器的情形
在Spring MVC中，确实，如果您已经通过`@Configuration`类将自定义的转换器注册到了`ConversionService`并且这个`ConversionService`是Spring上下文管理的一部分，那么对于使用了`@RequestParam`或`@ModelAttribute`注解的方法参数，Spring会自动使用这些注册到`ConversionService`中的转换器来进行类型转换。这意味着，对于大多数标准的用例，您不需要手动调用`ConversionService`的`convert`方法进行转换。

以下是这种自动转换的例子：

```java
@GetMapping("/event")
public String handleRequest(@RequestParam("date") Date date) {
    // do something with date
    return "event";
}
```

在上面的代码片段中，当一个请求包含类似`?date=2023-04-17`这样的日期参数时，如果你有一个字符串到日期(`Date`)的转换器注册到了`ConversionService`，Spring MVC会自动使用这个转换器将字符串参数转换为`Date`对象。

然而，有些情况下您可能还是需要手动使用`ConversionService`进行转换。例如，如果转换逻辑在服务层或者你需要在一个不涉及Web请求处理的组件中进行类型转换时。在这些情况下，你可以通过依赖注入获得`ConversionService`实例，并手动调用其`convert`方法来进行需求的转换。这种方式提供了更大的灵活性，允许在应用程序的任何地方复用相同的转换逻辑。

手动调用`ConversionService`的例子可能如下所示：

```java
@Service
public class EventService {

    private final ConversionService conversionService;

    @Autowired
    public EventService(ConversionService conversionService) {
        this.conversionService = conversionService;
    }

    public void processEvent(String dateStr) {
        Date date = conversionService.convert(dateStr, Date.class);
        // 使用转换后的日期进行处理
    }
}
```

因此，是否手动调用`ConversionService`取决于您的具体需求和上下文。在Web层处理由`@RequestParam`或`@ModelAttribute`注解的参数时，通常可以依赖Spring自动进行转换；而在更复杂或自定义的逻辑中，手动调用可能提供更高的灵活性和控制。
:::


::: danger 在Spring框架中注册自定义转换器的两种方式
1. 使用`WebMvcConfigurer`接口：
   这种方式通常用于Spring MVC项目中。通过实现`WebMvcConfigurer`接口并重写`addFormatters`方法，可以将自定义转换器直接添加到FormatterRegistry中。这种方式不需要显式定义`ConversionService`的`Bean`，因为Spring MVC将自动使用它来进行数据绑定和类型转换，尤其是对于HTTP请求和响应。

   这种方法直接和Spring MVC的Web层集成，便于直接在控制器中处理来自HTTP请求的参数转换。

2. 定义`ConversionService`的`Bean`：
   另一种方式是在配置类中创建一个`ConversionService`的`Bean`。`ConversionService`是Spring框架中一个独立的类型转换体系，它可以在整个应用程序中的任意位置使用，不仅限于处理Web请求。

   这种方式提供了更多的灵活性，因为它允许将`ConversionService`注入到任何需要进行类型转换的组件中。如果你的应用不仅仅是Web应用，或者你想要在非Web层（如服务层或数据访问层）使用自定义转换器，这种方式可能更符合需求。

简单来说，第一种方法更专注于Web层面的转换（如HTTP请求到控制器方法的参数转换），而第二种更通用，可以用于整个应用程序范围内的类型转换。根据应用程序的结构和需求，开发者可以选择最合适的注册方式。
:::


## 请求参数校验与结果处理

### 使用Validation API

Bean Validation API是一套Java规范，允许通过注解来声明如何对Java Bean进行验证。这个API的规范标识是JSR 303和JSR 349，现行版本为Hibernate Validator，它提供了Bean Validation的默认实现。使用Bean Validation，你可以在实体类中直接使用注解来声明验证规则，简化了代码并提高了可读性。这些验证规则会自动应用到Java Bean的属性上，易于维护和重用。

可以通过以下依赖来引入Hibernate Validator：
```xml
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.1.7.Final</version>
</dependency>

<dependency>
    <groupId>javax.validation</groupId>
    <artifactId>validation-api</artifactId>
    <version>2.0.1.Final</version>
</dependency>
```
请注意，版本号可能会随着时间而变化。一般来说，Spring Boot的starter依赖（spring-boot-starter-validation）已经自动包含了Hibernate Validator和相关的Bean Validation API，所以在使用Spring Boot时，通常只需添加该starter依赖即可
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

::: tip 一些常用的Bean Validation注解
- `@NotNull`：确保Bean的属性值不为null。
- `@Min(value)`和`@Max(value)`：确保Bean的属性值在给定的范围内。
- `@Size(min=, max=)`：确保Bean的属性值（字符串、集合、数组等）的大小在给定的范围内。
- `@Email`：确保Bean的属性值为电子邮件格式。
- `@NotBlank`：确保Bean的字符串属性值非空且不仅包含空白字符。
:::

#### 使用Validation API进行验证

要使用Validation API，首先要在你的Java Bean属性上添加相应的验证注解。然后，你可以在接受用户输入的地方（如Spring MVC的控制器中）使用`@Valid`或`@Validated`注解来触发验证。

代码示例: 假设你有一个用户注册的场景，需要验证用户输入的数据：

**实体类（User.java）**:

```java
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class User {

    @NotBlank(message = "用户名不能为空")
    private String username;

    @Email(message = "邮箱格式不正确")
    private String email;

    // 标准的getter和setter
}
```

**控制器（UserController.java）**:

```java
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/user")
public class UserController {

    @GetMapping("/register")
    public String showRegistrationForm() {
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@Valid User user, BindingResult result) {
        if (result.hasErrors()) {
            return "register";
        }

        // 保存用户或进行其他处理
        return "redirect:/user/success";
    }
}
```

在这个例子中：

1. 在`User`类中，通过添加`@NotBlank`和`@Email`注解，声明了对用户名和邮箱的验证要求。
2. 在`UserController`中，通过在`registerUser`方法的`User`参数前添加`@Valid`注解，触发了`User`实例的验证。如果存在验证错误，`BindingResult`对象会被填充错误信息。
3. 通过检查`BindingResult`对象来判断是否存在验证错误，并根据验证结果返回不同的视图。

使用Bean Validation API进行数据验证可以大幅简化验证逻辑，使其更加模块化和易于维护。通过声明式的注解，你可以轻松定义字段的验证规则，并在整个应用中重用这些规则。

### 实现Validator接口
Spring的`Validator`接口允许你创建自定义的验证逻辑。下面是使用Spring的`Validator`接口进行验证的一个例子：

假设有一个用户实体`User`需要验证，首先要定义`User`类：

```java
public class User {
    private String username;
    private String email;

    // getters and setters
}
```

然后创建一个实现了`Validator`接口的自定义验证器类`UserValidator`：

```java
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

public class UserValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return User.class.equals(clazz);
    }

    @Override
    public void validate(Object obj, Errors errors) {
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "field.required", "Username is required.");
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email", "field.required", "Email is required.");
        User user = (User) obj;
        if (!user.getEmail().contains("@")) {
            errors.rejectValue("email", "email.invalid", "Email is not valid.");
        }
    }
}
```

在这个`UserValidator`类中，`validate`方法定义了具体的验证逻辑。首先使用`ValidationUtils.rejectIfEmptyOrWhitespace`简单地检查字段是否为空或者只有空格。然后，详细检查电子邮件是否包含'@'符号。

接下来，在Spring的控制器中使用`UserValidator`：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class UserController {

    private final UserValidator userValidator;

    @Autowired
    public UserController(UserValidator userValidator) {
        this.userValidator = userValidator;
    }

    @GetMapping("/user/register")
    public ModelAndView showRegistrationForm() {
        return new ModelAndView("register", "user", new User());
    }

    @PostMapping("/user/register")
    public String registerUser(@ModelAttribute("user") User user, BindingResult result) {
        userValidator.validate(user, result);
        if (result.hasErrors()) {
            return "register";
        }
        
        // ... 对user进行数据保存等进一步处理
        
        return "redirect:/user/success";
    }
}
```

在`UserController`中，首先注入了自定义的`UserValidator`。在处理用户注册的POST请求的`registerUser`方法中，手动调用`userValidator.validate(user, result)`触发验证。如果`result`中发现错误，它们会被反馈回注册表单视图。

在注册表单视图中，你需要展示错误信息。如果你使用的是Thymeleaf模板引擎，代码如下：

```html
<form action="#" th:action="@{/user/register}" th:object="${user}" method="post">
  <div>
      <label for="username">Username:</label>
      <input type="text" id="username" th:field="*{username}" />
      <span th:if="${#fields.hasErrors('username')}" th:errors="*{username}">Username Error</span>
  </div>
  <div>
      <label for="email">Email:</label>
      <input type="text" id="email" th:field="*{email}" />
      <span th:if="${#fields.hasErrors('email')}" th:errors="*{email}">Email Error</span>
  </div>
  <div>
      <button type="submit">Register</button>
  </div>
</form>
```

这里使用了`th:errors`来显示对应字段的验证错误消息。如果有错误，消息会显示在输入字段旁边。

通过使用Spring的`Validator`接口，你可以创建非常具体和复杂的验证逻辑，并且可以在不同的地方重用这些逻辑。这比在实体类中使用注解声明验证规则更灵活，但同样也更繁琐。你通常会在需要非常特定或复杂的验证逻辑时选择这种方式。


### 分组验证(Group validation)

在复杂的业务场景中，我们经常需要根据不同的操作对同一个对象进行不同的验证。`@Validated`注解和分组验证（Group validation）功能允许我们针对不同场景执行不同的验证规则。

首先，创建验证分组接口，用于标识不同的验证场景：

```java
public interface ValidationGroups {
    interface Create {}
    interface Update {}
}
```

接下来，在实体类中使用分组接口为不同的验证规则进行分组：

```java
public class User {

    // 在创建（Create）操作时验证
    @NotNull(groups = ValidationGroups.Create.class)
    private Long id;

    // 在创建（Create）和更新（Update）操作时验证
    @NotBlank(groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    private String email;
    
    // ...
}
```

然后，在控制器中通过在`@Validated`注解中指定分组来触发相应的验证规则：

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @PostMapping("/create")
    public String createUser(@Validated(ValidationGroups.Create.class) @RequestBody User user) {
        // 处理创建用户逻辑
        return "User created";
    }

    @PutMapping("/update")
    public String updateUser(@Validated(ValidationGroups.Update.class) @RequestBody User user) {
        // 处理更新用户逻辑
        return "User updated";
    }
}
```
通过上述代码，可以在创建或更新`User`实例时根据情境选择适当的验证规则。

::: tip 分组验证的应用场景
- 创建和更新操作：在RESTful API设计中，创建（POST）和更新（PUT）通常使用相同的对象模型。但在创建时可能不需要ID字段（由系统生成），而在更新时则是必须的。通过分组验证，你可以为创建和更新定义不同的验证规则。
- 分步骤的表单提交：在复杂的表单流程中，用户可能需要分多个步骤提交数据。每个步骤可能只需要验证表单的一部分。可以为每个步骤创建不同的验证组，确保只验证当前步骤的数据。
- 用户角色和权限：根据用户的角色或权限来决定是否执行特定字段的验证。例如，普通用户可能不需要验证某些只有管理员才需要填写的字段。
- 条件性验证：在某些条件下，某些字段可能是必填的，而在其他条件下则不是。可以通过分组检验来根据条件决定是否需要验证这些字段。
- 视图层验证：在多视图应用中，不同的视图可能需要验证不同的字段集。分组验证允许你为每个视图定义一个专门的验证逻辑。
:::


### 跨字段验证(Cross-field validation)

跨字段验证涉及到了基于多个字段的值进行逻辑判断的需求，例如，确认密码字段是否与密码字段相匹配。为了实现跨字段验证，你通常需要自定义验证注解并创建相应的验证器。

假设你要验证两个字段`password`和`confirmPassword`是否相同：

1. 定义一个自定义的注解`FieldMatch`：

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = FieldMatchValidator.class)
public @interface FieldMatch {
    String message() default "The fields must match";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    String first();
    String second();

    @Target({ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @interface List {
        FieldMatch[] value();
    }
}
```

2. 创建该注解的验证器`FieldMatchValidator`：

```java
public class FieldMatchValidator implements ConstraintValidator<FieldMatch, Object> {
    private String firstFieldName;
    private String secondFieldName;

    @Override
    public void initialize(FieldMatch constraintAnnotation) {
        firstFieldName = constraintAnnotation.first();
        secondFieldName = constraintAnnotation.second();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        try {
            final Object firstObj = BeanUtils.getProperty(value, firstFieldName);
            final Object secondObj = BeanUtils.getProperty(value, secondFieldName);

            return firstObj == null && secondObj == null || firstObj != null && firstObj.equals(secondObj);
        } catch (final Exception ignore) {
            // ignore
        }
        return true;
    }
}
```

3. 在需要进行跨字段验证的类上使用`@FieldMatch`注解：

```java
@FieldMatch.List({
    @FieldMatch(first = "password", second = "confirmPassword", message = "The password fields must match"),
})
public class UserRegistrationDto {
    // 对应字段的getter和setter
}
```

通过自定义注解`FieldMatch`实现了密码和确认密码两个字段之间的匹配验证。

这种方式使得验证逻辑更加灵活和强大，可以应对各种复杂的业务需求。

::: tip 跨字段验证的应用场景
- 字段比较：最常见的跨字段验证情况就是密码和确认密码必须匹配，需要验证其中两个字段是否一致。
- 依赖关系验证：当一个字段的值依赖于另一个字段的值时，比如“结束日期”不能早于“开始日期”。
- 复杂规则的业务逻辑验证：例如，地址验证中，如果国家是“美国”，则要求“州”字段必须是有效的美国州名称；对于其它国家，则无此要求。
- 全局业务规则：可能涉及到多个字段，比如一组字段的总和不得超过特定的数值。
- 条件式验证：如果字段A的值满足某一条件，则字段B必须非空，否则可以为空。
:::


### 使用AOP进行参数校验

面向切面编程（AOP）是一种编程范式，旨在通过将横切关注点（如日志、事务管理、安全性和参数校验）从业务逻辑中分离出来，提高代码的模块化。在Spring框架中，通常可以使用AOP来实现参数校验，从而使得代码更加简洁和易于管理。

**AOP进行参数校验**的使用场景包括但不限于：

1. 统一处理入口参数校验，减少在每个方法中重复进行参数校验的代码。
2. 在业务方法执行之前，校验传入参数的有效性，如果参数不符合要求，可以直接返回错误响应，阻止方法执行。
3. 对于RESTful API等场合，可以进行全局的请求参数校验，提升API的健壮性。
4. 在调用重要业务逻辑之前进行权限校验或参数格式校验，确保数据的准确性和安全性。

示例代码：

假设有一个简单的服务方法，需要校验传入的用户年龄是否符合要求：

```java
public class UserService {

    public void addUser(String name, int age) {
        System.out.println("Adding user: " + name + ", age: " + age);
        // 添加用户的逻辑
    }
}
```

现在，我们使用Spring AOP来实现对`addUser`方法的年龄参数进行校验。

1. **定义一个切面类（Aspect Class）进行参数校验**：

```java
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ValidationAspect {

    @Pointcut("execution(* com.example.service.UserService.addUser(..))")
    public void validateAgePointcut() {}

    @Before("validateAgePointcut()")
    public void validateAgeBefore(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        if (args.length == 2 && args[1] instanceof Integer) {
            int age = (Integer) args[1];
            if (age < 18) {
                throw new IllegalArgumentException("Age must be greater than or equal to 18.");
            }
        }
    }
}
```

在这个例子中，我们定义了一个切面`ValidationAspect`，并指定了一个切入点`validateAgePointcut`，它匹配`UserService`中的`addUser`方法。然后，我们用`@Before`注解定义了一个在目标方法执行之前运行的建议（Advice），它会执行参数校验逻辑。如果年龄参数不符合要求（小于18岁），则抛出一个异常。

2. **确保你的Spring配置支持AOP**：

确保在Spring配置中已经启用了AOP的自动代理。如果你使用的是Java配置，可以通过`@EnableAspectJAutoProxy`注解来启用：

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy
public class AppConfig {
    // 其他Bean的配置
}
```

使用AOP进行参数校验能够使得校验逻辑与业务逻辑分离，提高代码的重用性和清晰度。需要注意的是，虽然通过AOP能够实现强大的横切逻辑，但过度使用可能会使得程序逻辑变得难以跟踪，因此请根据实际需求谨慎使用。


### 参数校验示例与结果处理

让我们以一个常见的注册场景为例，其中需要进行跨字段验证：验证两次输入的密码是否一致，并确保用户年龄在合法范围内。我们将使用Spring Boot作为基础，利用Hibernate Validator进行校验，并通过自定义异常处理来实现统一处理校验结果。

首先，定义一个用户注册的请求对象，包含用户名、密码、确认密码和年龄字段。

```java
import javax.validation.constraints.*;

public class UserRegistrationRequest {
    
    @NotNull(message = "用户名不能为空")
    private String username;
    
    @NotNull(message = "密码不能为空")
    private String password;
    
    @NotNull(message = "确认密码不能为空")
    private String confirmPassword;
    
    @Min(value = 18, message = "年龄必须至少为18")
    @Max(value = 150, message = "年龄不得超过150")
    private int age;

    // 省略构造函数、getter和setter方法
}
```

接着，创建一个自定义注解用于跨字段验证（比如，验证密码和确认密码是否一致）。

```java
import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordMatchesValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordMatches {

    String message() default "密码和确认密码不匹配";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
```

定义`PasswordMatchesValidator`来实现这个注解的逻辑。

```java
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    @Override
    public void initialize(PasswordMatches constraintAnnotation) {
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        UserRegistrationRequest user = (UserRegistrationRequest) obj;
        return user.getPassword().equals(user.getConfirmPassword());
    }
}
```

在`UserRegistrationRequest`类上使用`@PasswordMatches`注解。

```java
@PasswordMatches
public class UserRegistrationRequest {
    // 字段定义
}
```

现在，我们创建一个系统全局异常处理器来统一处理校验异常。

```java
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                                 .getAllErrors()
                                 .stream()
                                 .map(ObjectError::getDefaultMessage)
                                 .collect(Collectors.toList());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}
```

最后，在控制器中使用这个请求对象。

```java
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Validated @RequestBody UserRegistrationRequest request) {
        // 注册用户的业务逻辑
        return ResponseEntity.ok("用户注册成功");
    }
}
```

通过这种方式，我们能够在用户注册对象`UserRegistrationRequest`中进行复杂的跨字段验证（确保密码和确认密码一致），并且通过全局异常处理器`GlobalExceptionHandler`来统一处理不符合验证规则的情况，返回统一格式的错误信息。这样，无论是单字段验证还是跨字段验证，所有校验失败的情况都可以得到统一且友好的处理。

::: danger MethodArgumentNotValidException统一校验异常处理
在Spring框架中，当使用 `@Valid` 或 `@Validated` 注解对控制器层(Controller)方法的参数进行校验，并且校验失败时，Spring会自动抛出 `MethodArgumentNotValidException` 异常。这个异常包含了所有验证失败的详细信息。通过全局异常处理器（使用 `@ControllerAdvice` 或 `@RestControllerAdvice` 注解标记的类）中定义一个方法，并用 `@ExceptionHandler(MethodArgumentNotValidException.class)` 标记这个方法，就可以捕获到这个异常，并进行自定义的处理。

这里是更详细的实现代码示例：

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // 从异常ex中提取错误信息
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(fieldError -> fieldError.getDefaultMessage())
            .collect(Collectors.toList());

        // 将错误信息以HTTP状态码400（BAD REQUEST）返回
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}
```

这个方法的关键是，它利用了 `MethodArgumentNotValidException` 异常中包含的 `BindingResult` 对象，该对象保存了所有的字段错误(`FieldError`)。方法通过映射(`map`)每个 `FieldError` 到其默认消息(`getDefaultMessage()`)来获取所有验证消息，并将它们收集到一个列表中，最终返回这个包含错误消息的列表。通过这种方式，前端可以收到一个包含所有验证错误信息的响应体，从而能提供更准确的用户反馈。
:::


## 过滤器和拦截器的应用

在Spring MVC中，拦截器（Interceptors）和过滤器（Filters）是两种在请求处理生命周期中不同阶段拦截请求进行处理的组件。它们都能实现类似的功能，但它们的使用范围和控制粒度不同。

### 过滤器（Filter）

过滤器是基于Java Servlet API的一部分。过滤器主要用于处理传入请求和传出响应的数据流；处理用户认证、日志记录、请求数据的预处理等；多个过滤器可以构成一个过滤链。

#### 应用示例

创建一个过滤器类，实现`Filter`接口：

```java
public class MyFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 过滤器初始化时调用
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        // 在此处编写过滤逻辑，例如日志记录、安全检查等
        System.out.println("Filter is called before controller logic.");
        
        // 继续调用下一个过滤器或目标资源
        chain.doFilter(request, response);
        
        // 响应返回之后的处理
        System.out.println("Filter is called after controller logic.");
    }

    @Override
    public void destroy() {
        // 过滤器销毁时调用
    }
}
```

在Spring的配置文件或类中注册过滤器：

```java
@WebFilter(urlPatterns = "/*")
public class MyFilter implements Filter {
    // ...
}
```

或者，在Spring Boot项目中：

```java
@Bean
public FilterRegistrationBean<MyFilter> loggingFilter(){
    FilterRegistrationBean<MyFilter> registrationBean = new FilterRegistrationBean<>();
    registrationBean.setFilter(new MyFilter());
    registrationBean.addUrlPatterns("/api/*"); // 设置过滤器的URL模式
    return registrationBean; 
}
```

### 拦截器（Interceptor）

拦截器是Spring MVC提供的一种更加细粒度的请求处理机制，它更加依赖于Spring的上下文。拦截器中可以注入Spring管理的Bean，同时它们可以针对特定的Controller的方法进行拦截操作。

#### 应用示例

创建一个拦截器类，实现`HandlerInterceptor`接口：

```java
public class MyInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 控制器（Controller）方法调用之前
        System.out.println("Interceptor preHandle method is called.");
        return true; // 必须返回true，否则会阻止请求继续进行
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // 控制器（Controller）方法调用之后，视图渲染之前
        System.out.println("Interceptor postHandle method is called.");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 整个请求结束后，即视图渲染结束后
        System.out.println("Interceptor afterCompletion method is called.");
    }
}
```

在Spring的配置类中注册拦截器：

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new MyInterceptor()).addPathPatterns("/api/**");
    }
}
```

下表总结了过滤器（Filter）和拦截器（Interceptor）在Java Web开发中的不同特点、优缺点、使用方式和应用场景：

| 特点            | 过滤器（Filter）                                      | 拦截器（Interceptor）                        |
|-----------------|-----------------------------------------------------|-----------------------------------------|
| 定义            | 基于Servlet API。                                     | 基于Spring框架。                            |
| 配置方式         | 在web.xml中配置或通过@WebFilter注解。                     | 在Spring的配置类中用WebMvcConfigurer的addInterceptors方法注册。     |
| 调用时间         | 请求进入Web容器后，进入Servlet之前调用。 处理完请求后，转发给Servlet或静态资源之前。 | 请求经过DispatcherServlet后调用。 在Controller处理之前、之后以及视图渲染之后调用。 |
| 拦截范围         | 可以对几乎所有的请求进行操作。                             | 只能拦截经过DispatcherServlet处理的请求。                  |
| 可控制粒度       | 较粗。因为它位于Web容器级别。                              | 较细。因为它是Spring上下文中的一部分。                     |
| 能否注入Spring Bean | 不可以。因为它位于容器级别，不由Spring管理。                   | 可以。因为它被Spring管理。                         |
| 通常使用场景      | - 请求日志记录。<br>- 请求和响应的通用处理，如设置字符集。<br>- 访问控制和认证。 | - 记录应用程序的行为。<br>- 处理业务逻辑，如权限检查。<br>- 更细粒度的请求响应修改。       |
| 优点            | - 应用于所有请求。<br>- 控制请求的流入流出。<br>- 不依赖于Spring。<br>- 可以对静态资源请求进行拦截。| - 完全集成于Spring框架。<br>- 可以使用Spring的功能，如依赖注入。<br>- 与Controller集成，可以对方法进行精细控制。   |
| 缺点            | - 不能很好地与Spring集成。<br>- 不能通过Spring配置灵活地操作请求和响应。           | - 只能用于Spring or Spring Boot应用。<br>- 不直接作用于低级的请求和响应对象。           |

过滤器和拦截器都能够提供类似的功能：它们都可以在请求的某个阶段进行处理，如安全检查、日志记录等。然而，由于Spring的拦截器更好地与Spring生态系集成，通常它们在使用Spring进行Web开发时更加方便和强大。另一方面，过滤器提供了一种不依赖于Spring的选择，可以在不使用Spring的应用中或者需要在Servlet之前进行干预时使用。

总的来说，过滤器更适合于请求入口和出口处的公共处理逻辑，而拦截器适用于业务处理过程中的细节控制和处理。
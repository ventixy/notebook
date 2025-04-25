---

order: 1
title:  Spring AI

---

Spring AI 是一个 Spring Framework 的子项目，旨在简化将人工智能 (AI) 功能集成到 Spring 应用程序中的过程。它提供了一套统一的 API 和抽象，允许开发者与各种 AI 提供商（如 OpenAI, Azure OpenAI, Google Vertex AI Gemini, Ollama 等）进行交互

官方文档：https://docs.spring.io/spring-ai/reference/1.0/getting-started.html


## spring-ai-openai

下面将以 spring-ai-openai 为例，介绍 Spring AI 的使用

### 环境要求和依赖

* Java Development Kit (JDK) 17 或更高版本。
* Maven 或 Gradle 构建工具。
* 一个 Spring Boot 3.x 项目。
* 一个 OpenAI 账户对应的 API 密钥 (API Key)。

::: tip  GPT_API_free
API-KEY: 可通过Github项目 - [GPT_API_free](https://github.com/chatanywhere/GPT_API_free) 获取 （在文档中点击 `领取内测免费API Key` 即可）
:::

---

示例项目创建和演示：

1. 新建Springboot3.x 项目（JDK选择17/21，依赖选中Spring Web）

2. **依赖导入 (Maven)**：要在项目中使用 Spring AI 与 OpenAI，需要在 `pom.xml` 文件中添加以下依赖：

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
    <version>1.0.0-M7</version> 
</dependency>
```

::: info `spring-ai-bom`: Bill of Materials (BOM)
用于统一管理 Spring AI 相关模块的版本，推荐使用。例如：

```xml
    <properties>
        <java.version>21</java.version>
        <spring-ai.version>1.0.0-M7</spring-ai.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-starter-model-openai</artifactId>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.ai</groupId>
                <artifactId>spring-ai-bom</artifactId>
                <version>${spring-ai.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```
存在父工程的项目中，可以将版本号相关的配置放在父工程的 `pom.xml` 中，子工程只需继承父工程即可。
:::

导入Spring AI 的依赖时，maven 的 下载源最好设置为默认地址（删除/注释掉 `settings.xml` 中的镜像配置 ），因为阿里云只有Spring AI Alibaba 的包。

---


### application.yml

在 `src/main/resources/application.yml` (或 `.properties`) 文件中配置 OpenAI 的 API 密钥和其他可选参数：

```yaml
spring:
  application:
    name: spring-ai-demo
  ai:
    openai:
      api-key: ${OPENAI_API_KEY} # 推荐使用环境变量或 Secrets Management
      base-url: https://api.chatanywhere.tech # 可选：如果使用非官方的API
      chat:
        options:
          model: gpt-3.5-turbo # 可选：指定模型：gpt-3.5-turbo
          # 控制生成文本的随机性，值越高越随机 (0.0 - 2.0)，例如 0.7
          temperature: 0.7 
          # 控制生成文本的多样性，例如 0.9
          #top-p: 1.0
server:
  port: 8123
  servlet:
    context-path: /api
# springdoc-openapi
springdoc:
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: alpha
  api-docs:
    path: /v3/api-docs
  group-configs:
    - group: 'default'
      paths-to-match: '/**'
      packages-to-scan: top.ventix.springaidemo.controller
# knife4j
knife4j:
  enable: true
  setting:
    language: zh_cn
```

**配置说明:**

* `spring.ai.openai.api-key`: **极其重要且必需**。这是你的 OpenAI 凭证。强烈建议不要将其硬编码在配置文件中，而是使用环境变量 (`${OPENAI_API_KEY}`)、Vault、或其他安全的 Secrets Management 方式注入。
* `spring.ai.openai.chat.options.model`: 指定要使用的聊天模型。OpenAI 不断推出新模型，请根据需求和 OpenAI 文档选择。
* `spring.ai.openai.chat.options.temperature`: 控制输出的随机性。较低的值（如 0.2）使输出更确定、更集中；较高的值（如 0.8）使输出更随机、更有创意。
* `spring.ai.openai.chat.options.top-p`: 一种替代 temperature 的采样方法，称为 nucleus sampling。
* 其他如 `max-tokens` (最大生成令牌数) 等参数也可以在这里配置。

---

### 核心接口和类

* **`ChatClient`**:
    * **核心交互接口**，用于与 AI 聊天模型进行交互。
    * 由 Spring AI 自动配置（基于你的依赖和 `application.yml` 配置）。
    * 你可以直接在你的 Service 或 Controller 中 `@Autowired` 注入它。
    * 主要方法：
        * `call(String message)`: 发送单条用户消息，获取单条回复。
        * `call(Prompt prompt)`: 发送一个包含更复杂信息的 `Prompt` 对象（可以包含系统消息、多轮用户/助手消息），获取回复 `ChatResponse`。
        * `stream(Prompt prompt)`: 发送 `Prompt` 并以流式方式接收响应（返回 `Flux<ChatResponse>`），适用于需要实时显示或处理长响应的场景。

* **`Prompt`**:
    * 封装了发送给 AI 模型的输入。
    * 可以包含：
        * **一条简单的字符串**: `new Prompt("你的问题")`
        * **一个或多个 `Message` 对象**: `new Prompt(List.of(systemMessage, userMessage))`
    * 可以附加 `PromptOptions` 来覆盖全局配置（如临时指定不同的模型、温度等）。

* **`Message`**:
    * 表示对话中的一条消息。有几种主要类型：
        * `UserMessage`: 代表用户的输入。 (`new UserMessage("用户的提问")`)
        * `AssistantMessage`: 代表 AI 助手的回复。 (`new AssistantMessage("AI的回答")`)，通常是从 `ChatResponse` 中获取。
        * `SystemMessage`: 用于给 AI 提供指令、上下文或设定其角色/行为。 (`new SystemMessage("你是一个乐于助人的天气预报机器人。")`)

* **`ChatResponse`**:
    * 封装了来自 AI 模型的响应。
    * 主要方法：
        * `getResult()`: 获取主要的 AI 回复消息 (`AssistantMessage`)。
        * `getResults()`: 获取所有回复消息（通常只有一个，但接口设计上支持多个）。
        * `getMetadata()`: 获取响应的元数据，可能包含 token 使用情况、结束原因等信息 (`ChatResponseMetadata`)。

* **`ChatModel`**:
    * 这是一个比 `ChatClient` **更低层级**的接口，直接代表了与特定 AI 提供商的聊天 API 的交互。
    * `ChatClient` 通常内部会使用一个 `ChatModel` 的实现。
    * 对于大多数应用场景，直接使用 `ChatClient` 已经足够且更方便。只有在需要更精细控制或实现特定高级功能时，才可能直接与 `ChatModel` 交互。

---


### ChatClient

Spring AI 中的 `ChatClient` 是一个高级接口，用于简化与 AI 聊天模型的交互。

`ChatClient` 采用了 **Builder 模式** 和 **Fluent API** 设计，主要包含以下核心组件：

1. **ChatClient 接口**：定义了创建请求的基本方法
2. **Builder 接口**：用于配置默认参数和构建 ChatClient 实例
3. **ChatClientRequestSpec 接口**：定义请求规范
4. **CallResponseSpec/StreamResponseSpec**：处理同步/异步响应


```java
// 1. 创建基础客户端
ChatClient client = ChatClient.create(chatModel);

// 2. 使用Builder配置默认值
ChatClient client = ChatClient.builder(chatModel)
    .defaultSystem("你是一个有帮助的AI助手")
    .defaultUser("请用中文回答")
    .build();

// 3. 发起请求并处理响应
String response = client.prompt()
    .user("解释一下量子计算")
    .call()
    .content();

// 4. 流式响应
Flux<String> stream = client.prompt()
    .user("讲一个故事")
    .stream()
    .content();
```

**扩展点分析**:

1. **Advisor 机制**：
   - 通过 `Advisor` 接口实现请求/响应拦截
   - 支持链式调用

2. **结构化输出转换**：
   - 支持通过 `StructuredOutputConverter` 转换响应
   - 支持泛型类型引用 (`ParameterizedTypeReference`)

3. **工具上下文**：
   - 可通过 `defaultToolContext` 设置工具调用的共享上下文






---

### 接入代码示例

假设你创建了一个简单的 Spring Boot RestController：

```java
package top.ventix.springaidemo.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SimpleAiController {

    private final ChatClient chatClient;
    private final OpenAiChatModel chatModel;

    public SimpleAiController(OpenAiChatModel openAiChatModel) {
        this.chatModel = openAiChatModel;
        this.chatClient = ChatClient.builder(openAiChatModel)
                .defaultSystem("你是一个强大的全能程序员")
                .defaultUser("请用中文回答")
                .build();
    }

    @GetMapping("/model")
    public String chat(String prompt) {
        return chatModel.call(prompt);
    }

    @GetMapping("/client")
    public String ask(@RequestParam String req) {
        return chatClient.prompt()
                .user(req)
                .call()
                .content();
    }
}
```




更多使用示例：

```java
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class ChatController {

    private final ChatClient chatClient;

    // 通过构造函数注入自动配置好的 ChatClient
    @Autowired
    public ChatController(ChatClient.Builder chatClientBuilder) {
        // 你可以通过 Builder 在这里进一步定制 ChatClient，
        // 例如设置默认的系统提示、用户提示模板等
        this.chatClient = chatClientBuilder.build();
    }

    // 示例 1: 简单问答
    @GetMapping("/ai/simple")
    public Map<String, String> simpleChat(@RequestParam(value = "message", defaultValue = "给我讲个关于编程的笑话") String message) {
        // 直接使用 call(String) 发送用户消息
        String responseContent = chatClient.prompt().user(message).call().content();
        // 或者使用旧版API (未来可能移除):
        // String responseContent = chatClient.call(message);

        return Map.of("response", responseContent);
    }

    // 示例 2: 使用 Prompt 对象，包含系统消息
    @GetMapping("/ai/prompt")
    public Map<String, Object> promptChat(@RequestParam(value = "topic", defaultValue = "Spring Framework") String topic) {
        // 定义系统消息，设定 AI 角色
        SystemMessage systemMessage = new SystemMessage("""
                你是一个经验丰富的 Java 和 Spring 技术专家。
                请用简洁明了、通俗易懂的语言回答问题。
                如果问题不清晰，请要求澄清。
                """);

        // 定义用户消息
        UserMessage userMessage = new UserMessage("简单介绍一下 " + topic + " 的核心概念。");

        // 创建 Prompt 对象
        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));

        // 调用 ChatClient
        ChatResponse chatResponse = chatClient.prompt(prompt).call().chatResponse();


        // 从 ChatResponse 获取结果
        String assistantContent = chatResponse.getResult().getOutput().getContent();
        // 获取元数据 (例如 token 使用情况，取决于模型和实现)
        Map<String, Object> metadata = chatResponse.getMetadata().toMap();


        return Map.of(
                "response", assistantContent,
                "metadata", metadata
        );
    }

    // 示例 3: 使用 Prompt Builder (推荐方式)
    @GetMapping("/ai/builder")
    public Map<String, String> builderChat(@RequestParam(value = "message", defaultValue = "解释一下什么是 RESTful API") String message) {

         String response = chatClient.prompt()
                 .system("你是一个友好的AI助手。") // 设置系统提示
                 .user(message)                     // 设置用户消息
                 .call()                            // 发起调用
                 .content();                        // 获取 String 类型的响应内容

        return Map.of("response", response);
    }

    // 示例 4: 流式响应 (需要 WebFlux 支持或手动处理 Flux)
    // 注意：这个示例需要在项目中添加 spring-boot-starter-webflux 依赖
    // 并且返回类型是 Flux<String>
    /*
    @GetMapping(value = "/ai/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChat(@RequestParam(value = "message", defaultValue = "写一首关于春天的短诗") String message) {
        Prompt prompt = new Prompt(new UserMessage(message));
        return chatClient.prompt(prompt)
                .stream() // 调用 stream 方法
                .content(); // 从每个 ChatResponse 片段中提取内容字符串
    }
    */
}
```















---

## Spring AI Alibaba

Spring AI Alibaba 开源项目基于 Spring AI 构建，是阿里云通义系列模型及服务在 Java AI 应用开发领域的最佳实践，提供高层次的 AI API 抽象与云原生基础设施集成方案，帮助开发者快速构建 AI 应用。

- JDK：Spring AI Alibaba 基于 Spring Boot 3.x 开发，因此本地 JDK 版本要求为 17 及以上


- API-KEY: 可通过 [阿里云百炼平台](https://bailian.console.aliyun.com/console?tab=model#/api-key) 获取 API-KEY。

Spring AI Alibaba 文档参照：https://java2ai.com/docs/dev/overview
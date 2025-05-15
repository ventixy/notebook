---

order: 110
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
<!-- 注意：由于 spring-ai 相关依赖包还没有发布到中央仓库，如出现 spring-ai-core 等
    相关依赖解析问题，请在项目的 pom.xml 依赖中加入如下仓库配置 -->
    <repositories>
        <repository>
            <id>spring-milestones</id>
            <name>Spring Milestones</name>
            <url>https://repo.spring.io/milestone</url>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
    </repositories>
```
存在父工程的项目中，可以将版本号相关的配置放在父工程的 `pom.xml` 中，子工程只需继承父工程即可。
:::

导入Spring AI 的依赖时，maven 的 下载源最好设置为默认地址（删除/注释掉 `settings.xml` 中的其他镜像配置 ）

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
* `spring.ai.openai.chat.options.model`: 指定要使用的聊天模型。
* `spring.ai.openai.chat.options.temperature`: 控制输出的随机性。较低的值（如 0.2）使输出更确定、更集中；较高的值（如 0.8）使输出更随机、更有创意。
* `spring.ai.openai.chat.options.top-p`: 一种替代 temperature 的采样方法，称为 nucleus sampling。
* 其他如 `max-tokens` (最大生成令牌数) 等参数也可以在这里配置。

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

## 核心接口和类

**核心交互接口**
* **`ChatClient`**: 核心交互接口，提供与 AI 聊天模型交互的简化 API。通常包含同步和异步方法。

* **`ChatModel`**: 比 `ChatClient` 更低层级的接口，直接与特定 AI 提供商的聊天 API 交互。


**请求/响应相关**
* **`Prompt`**: 封装发送给 AI 模型的输入，包含一个或多个 `Message` 对象。
* **`Message`**: 表示对话中的一条消息，主要类型包括：
  * `SystemMessage` - 系统指令消息
  * `UserMessage` - 用户输入消息
  * `AssistantMessage` - AI 助手回复消息
  * `FunctionMessage` - 函数调用相关消息
* **`ChatResponse`**: 封装来自 AI 模型的响应，包含返回的 `Message` 和元数据。
* **`PromptTemplate`**: 用于动态生成 `Prompt` 的模板工具。

**函数调用相关**
* **`FunctionCallback`**: 定义 AI 模型请求调用函数时的处理逻辑。
* **`FunctionCallbackRegistry`**: 管理注册的 `FunctionCallback` 实例。

**高级功能**
* **`Advisor`**: 提供建议和指导的接口，可用于构建 AI 辅助决策系统。
* **`Retriever`**: 信息检索接口，用于从数据源获取相关信息。
* **`DocumentReader`**: 文档内容读取和解析接口。
* **`EmbeddingClient`**: 处理文本嵌入向量的生成和操作。
* **`VectorStore`**: 向量存储和检索接口。

**配置与上下文**
* **`AiContext`**: 维护 AI 交互的上下文信息。
* **`AiClientConfig`**: 配置 AI 客户端的基础设置。
* **`AiTemplate`**: 提供高级封装的操作模板类。

**异常类**
* **`AiClientException`**: AI 客户端操作的基础异常。
* **`AiRateLimitException`**: 速率限制异常。
* **`AiServiceException`**: 服务调用异常。




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
```

**ChatClient 链式调用示例**：

```java
// 构建复杂对话
String analysis = client.prompt("分析当前市场趋势")
                  .system("你是一个资深市场分析师")
                  .user("帮我分析2024年的整体市场情况")
                  .call()
                  .content();
```

| 方法名          | 作用描述                                                                                 |
|-----------------|------------------------------------------------------------------------------------------|
| `prompt(String)`| 设置聊天请求的提示词（prompt），用于指导模型生成特定内容。                                |
| `system(String)`| 定义系统角色，指定模型在响应中扮演的角色（如“资深市场分析师”）。                         |
| `user(String)`  | 设置用户输入的内容，即具体的请求或问题（如“帮我分析2024年的整体市场情况”）。              |
| <span style="color:red; font-weight:bold">`call()`</span>       | 返回一个 `CallResponseSpec` 对象，用于进一步处理请求（未立即触发模型调用）。              |
| <span style="color:red; font-weight:bold">`content()`</span>    | 在 `CallResponseSpec` 中实际触发模型调用，发送请求并获取返回的响应内容作为最终结果返回。  |









---


### Advisors

Spring AI 的 [**Advisors API**](https://docs.spring.io/spring-ai/reference/1.0/api/advisors.html) 提供了一种灵活的机制，用于拦截、修改和增强 AI 驱动的交互。

---

::: tip 什么是 Advisors
Advisors 本质上是一系列可插拔的拦截器，可以在调用 AI 模型之前或之后执行额外的逻辑，常用于：
1. **请求前处理**：在将请求发送给 AI 模型之前修改提示词（如重新措辞或校验安全性）。
2. **响应后处理**：对 AI 模型的响应进行处理（如记录日志或提取关键信息）。
:::

**执行顺序**：Advisors 按照 `getOrder()` 方法的返回值确定执行顺序：值越小，优先级越高。


---

Advisors 可以在以下两个阶段创建：
1. **框架初始化阶段**：在 `ChatClient` 构建器中配置默认 Advisors：
     ```java
     var chatClient = ChatClient.builder(chatModel)
         .defaultAdvisors(
             new MessageChatMemoryAdvisor(chatMemory), // 维护对话上下文的拦截器
             new QuestionAnswerAdvisor(vectorStore)    // 实现 RAG 的拦截器
         )
         .build();
     ```

2. **运行时动态添加**：在运行时动态添加或配置 Advisors：
     ```java
     String response = chatClient.prompt()
         .advisors(advisor -> advisor.param("chat_memory_conversation_id", "123"))
         .call()
         .content();
     ```

::: important 自定义 Advisor 
1. **实现以下接口之一或同时实现两者（更建议同时实现）**：
- CallAroundAdvisor：用于处理同步请求和响应（非流式）
- StreamAroundAdvisor：用于处理流式请求和响应
```java
public class MyCustomAdvisor implements CallAroundAdvisor, StreamAroundAdvisor {
    // 实现方法...
}
```
2. **实现核心方法（aroundCall & aroundStream）**
- 对于非流式处理 (CallAroundAdvisor)，实现 aroundCall 方法
- 对于流式处理 (StreamAroundAdvisor)，实现 aroundStream 方法

3. **设置执行顺序和唯一名称（标识符）**
- 通过实现getOrder()方法指定 Advisor 在链中的执行顺序。值越小优先级越高，越先执行
- 通过getName()方法为每个 Advisor 提供一个唯一标识符
:::


Spring AI 内置了一些Advisor，如： 
- SimpleLoggerAdvisor 日志拦截器（以 Debug 级别输出日志）
- Re-Reading Advisor（重读）：通过让模型重新阅读问题来提高推理能力

下面是一个简单的示例，展示如何创建一个自定义的 Advisor：

```java
public class LoggerAdvisor implements CallAroundAdvisor, StreamAroundAdvisor {

    public static final Function<AdvisedRequest, String> DEFAULT_REQUEST_TO_STRING = Record::toString;
    public static final Function<ChatResponse, String> DEFAULT_RESPONSE_TO_STRING = ModelOptionsUtils::toJsonString;

    private static final Logger logger = LoggerFactory.getLogger(top.ventix.aiagent.advisors.LoggerAdvisor.class);

    private final Function<AdvisedRequest, String> requestToString;

    private final Function<ChatResponse, String> responseToString;

    private final int order;

    public LoggerAdvisor() {
        this(DEFAULT_REQUEST_TO_STRING, DEFAULT_RESPONSE_TO_STRING, 0);
    }

    public LoggerAdvisor(int order) {
        this(DEFAULT_REQUEST_TO_STRING, DEFAULT_RESPONSE_TO_STRING, order);
    }

    public LoggerAdvisor(Function<AdvisedRequest, String> requestToString, Function<ChatResponse, String> responseToString, int order) {
        this.requestToString = requestToString;
        this.responseToString = responseToString;
        this.order = order;
    }

    @Override
    public String getName() {
        return this.getClass().getSimpleName();
    }

    @Override
    public int getOrder() {
        return this.order;
    }

    private AdvisedRequest before(AdvisedRequest request) {
        logger.info("request: {}", this.requestToString.apply(request));
        return request;
    }

    private void observeAfter(AdvisedResponse advisedResponse) {
        logger.info("response: {}", this.responseToString.apply(advisedResponse.response()));
    }

    @Override
    public String toString() {
        return top.ventix.aiagent.advisors.LoggerAdvisor.class.getSimpleName();
    }

    @Override
    public AdvisedResponse aroundCall(AdvisedRequest advisedRequest, CallAroundAdvisorChain chain) {

        advisedRequest = before(advisedRequest);

        AdvisedResponse advisedResponse = chain.nextAroundCall(advisedRequest);

        observeAfter(advisedResponse);

        return advisedResponse;
    }

    @Override
    public Flux<AdvisedResponse> aroundStream(AdvisedRequest advisedRequest, StreamAroundAdvisorChain chain) {

        advisedRequest = before(advisedRequest);

        Flux<AdvisedResponse> advisedResponses = chain.nextAroundStream(advisedRequest);

        return new MessageAggregator().aggregateAdvisedResponse(advisedResponses, this::observeAfter);
    }
}
```



---


### ChatMemory

Spring AI 的对话记忆实现非常巧妙，解耦了“存储” 和 “记忆算法”，使得我们可以单独修改 ChatMemory 存储来改变对话记忆的保存位置，而无需修改保存对话记忆的流程。

::: info ChatMemoryAdvisor
想要实现对话记忆功能，可以使用 Spring AI 的 ChatMemoryAdvisor，它主要有几种内置的实现方式：
- MessageChatMemoryAdvisor：将对话历史作为一系列独立的消息添加到提示中，保留原始对话的完整结构
- PromptChatMemoryAdvisor：将对话历史添加到提示词的系统文本部分，因此可能会失去原始的消息边界
- VectorStoreChatMemoryAdvisor：可以用向量数据库来存储检索历史对话

一般情况下，更建议使用 MessageChatMemoryAdvisor。更符合大多数现代 LLM 的对话模型设计，能更好地保持上下文连贯性
:::

 ChatMemoryAdvisor 都依赖 Chat Memory 进行构造，Chat Memory 负责历史对话的存储，定义了保存消息、查询消息、清空消息历史的方法

Spring AI 内置了几种 Chat Memory，可以将对话保存到不同的数据源中，比如：
- InMemoryChatMemory：内存存储
- CassandraChatMemory：在 Cassandra 中带有过期时间的持久化存储
- Neo4jChatMemory：在 Neo4j 中没有过期时间限制的持久化存储
- JdbcChatMemory：在 JDBC 中没有过期时间限制的持久化存储

下面将自定义一个 Chat Memory，将对话保存到 Redis 中：

```java
@Component
public class RedisChatMemory implements ChatMemory {

    @Autowired
    private RedisTemplate<String, byte[]> byteArrayRedisTemplate;
    private static final Kryo kryo = new Kryo();
    
    static {
        kryo.setRegistrationRequired(false);
        // 设置实例化策略
        kryo.setInstantiatorStrategy(new StdInstantiatorStrategy());
    }

    @Override
    public void add(String conversationId, List<Message> messages) {
        List<Message> conversationMessages = getOrCreateConversation(conversationId);
        conversationMessages.addAll(messages);
        saveConversation(conversationId, conversationMessages);
    }

    @Override
    public List<Message> get(String conversationId, int lastN) {
        List<Message> allMessages = getOrCreateConversation(conversationId);
        return allMessages.stream()
                .skip(Math.max(0, allMessages.size() - lastN))
                .toList();
    }

    @Override
    public void clear(String conversationId) {
        byteArrayRedisTemplate.delete(conversationId);
    }

    private List<Message> getOrCreateConversation(String conversationId) {
        byte[] rawBytes = byteArrayRedisTemplate.opsForValue().get(conversationId);
        if (rawBytes != null && rawBytes.length > 0) {
            try (Input input = new Input(new ByteArrayInputStream(rawBytes))) {
                return kryo.readObject(input, ArrayList.class);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return new ArrayList<>();
    }

    private void saveConversation(String conversationId, List<Message> messages) {
        try (ByteArrayOutputStream bos = new ByteArrayOutputStream();
             Output output = new Output(bos)) {
            kryo.writeObject(output, messages);
            output.flush();
            byteArrayRedisTemplate.opsForValue().set(conversationId, bos.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

`RedisTemplate<String, byte[]>` 的配置如下：

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, byte[]> byteArrayRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, byte[]> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        // Key使用String序列化器
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        // Value使用ByteArray序列化器
        template.setValueSerializer(RedisSerializer.byteArray());
        template.setHashValueSerializer(RedisSerializer.byteArray());

        template.afterPropertiesSet(); // 初始化
        return template;
    }
}
```

---


### 结构化输出

结构化输出转换器（[Structured Output Converter](https://docs.spring.io/spring-ai/reference/api/structured-output-converter.html)）是 Spring AI 提供的一种实用机制，用于将大语言模型返回的文本输出转换为结构化数据格式，如 JSON、XML 或 Java 类

::: info 结构化输出转换器 工作流程
- 调用前：转换器会在提示词后面附加格式指令，明确告诉模型应该生成何种结构的输出，引导模型生成符合指定格式的响应。

- 调用后：转换器将模型的文本输出转换为结构化类型的实例，比如将原始文本映射为 JSON、XML 或特定的数据结构。

StructuredOutputConverter 接口 集成了 2 个关键接口：
```java
public interface StructuredOutputConverter<T> extends Converter<String, T>, 
                                                      FormatProvider {
}
```
- `FormatProvider` 接口：提供特定的格式指令给 AI 模型
- Spring 的 `Converter<String, T>` 接口：负责将模型的文本输出转换为指定的目标类型 T
:::

注意，结构化输出转换器只是 尽最大努力 将模型输出转换为结构化数据，AI 模型不保证一定按照要求返回结构化输出。

有些模型可能无法理解提示词或无法按要求生成结构化输出。建议在程序中实现验证机制或者异常处理机制来确保模型输出符合预期。

**使用示例**：
```java
@RestController
@RequestMapping("/json")
public class JsonController {
    private final ChatClient chatClient;

    public JsonController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @GetMapping("/chat")
    public String simpleChat(@RequestParam(value = "query", defaultValue = "请以JSON格式介绍你自己") String query) {
        return chatClient.prompt(query).call().content();
    }


    record ActorsFilms(String actor, List<String> movies) {
    }

    @GetMapping("/chat-format")
    public String simpleChatFormat(@RequestParam(value = "actor", defaultValue = "Tom Hanks") String actor) throws JsonProcessingException {
        ActorsFilms actorsFilms = chatClient.prompt()
                .user(u -> u.text("Generate the filmography of 5 movies for {actor}.")
                        .param("actor", actor))
                .call()
                .entity(ActorsFilms.class);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(actorsFilms);
    }
}
```

对于复杂数据结构，考虑使用 `ParameterizedTypeReference` ，例如：[MapOutputConverter](https://docs.spring.io/spring-ai/reference/api/structured-output-converter.html#_map_output_converter)

::: important 结构化输出的实现原理

1. 在调用大模型之前，`FormatProvider` 为 AI 模型提供特定的格式指令，使其能够生成可以通过 Converter 转换为指定目标类型的文本输出
```java
    StructuredOutputConverter outputConverter = ...
    String userInputTemplate = """
        ... user text input ....
        {format}
        """; // user input with a "format" placeholder.
    Prompt prompt = new Prompt(
       new PromptTemplate(
			   this.userInputTemplate,
          Map.of(..., "format", outputConverter.getFormat()) // replace the "format" placeholder with the converter's format.
       ).createMessage());
```
通常使用 `PromptTemplate` 将格式指令附加到用户输入的末尾

2. `Converter` 负责将模型的输出文本转换为指定类型的实例
:::

---


## Spring AI Ollama

有时，我们希望在本地环境中部署(或者企业内部部署)和使用大语言模型（LLM），以便更好地控制数据隐私、降低延迟，并在没有网络连接的情况下使用。


### 本地安装大模型

可以使用开源项目 **Ollama** 来快速部署和管理本地大模型。Ollama 极大地简化了安装过程，无需手动执行复杂的脚本和配置环境。它不仅提供了易用的命令行界面，还支持通过 API 进行调用，方便与各种应用程序集成。

**官方网站:** [https://ollama.com/](https://ollama.com/)

**1 下载和安装 Ollama**

访问 Ollama 官方下载页面 ([https://ollama.com/download](https://ollama.com/download))，根据你的操作系统选择合适的版本下载并安装。

---

**2 验证安装和查看帮助**

安装完成后，打开终端（Terminal、Command Prompt 或 PowerShell），执行以下命令来验证 Ollama 是否安装成功并查看可用的命令选项：

```bash
ollama --help
```

你会看到 Ollama 的用法说明，包括如何运行模型、拉取模型、列出本地模型等。

---

**3 下载并运行一个模型**

Ollama 支持许多开源模型。你可以使用 `ollama run` 命令来下载（如果本地没有）并运行一个模型。例如，运行一个较小且常用的模型 `qwen2:7b` (通义千问2 7B参数版本)：

```bash
ollama run qwen2:7b
```

* 首次运行此命令时，Ollama 会自动从模型库下载 `qwen2:7b` 模型文件。这可能需要一些时间，取决于你的网络速度和模型大小。
* 下载完成后，Ollama 会启动该模型，并在终端提供一个交互式聊天界面，你可以直接输入提示开始对话。
* 要退出交互式聊天，通常可以输入 `/bye`。

---

::: tip 常用 Ollama 命令

* `ollama pull <model_name>:<tag>`: 提前下载指定的模型。例如: `ollama pull llama3` (默认下载 latest tag)。
* `ollama list`: 列出你本地已经下载的所有模型。
* `ollama rm <model_name>`: 删除本地的一个模型。
* `ollama run <model_name>`: 运行一个模型（如果未下载则先下载）。

**注意:** 运行 `ollama run` 命令时，如果 Ollama 服务尚未在后台运行，它会自动启动该服务。该服务默认监听在 `http://localhost:11434`，提供 REST API 接口供其他程序调用。
:::


---

### 接入配置及代码

**1 添加 Spring AI Ollama 依赖**

在你的 Spring Boot 项目中，需要添加 Spring AI 对 Ollama 支持的 starter 依赖。

**Maven (`pom.xml`):**

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-ollama-spring-boot-starter</artifactId>
    </dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

**管理版本:** 推荐使用 Spring AI 的 BOM (Bill of Materials) 来统一管理 Spring AI 相关依赖的版本。

**2 配置 Ollama 连接**

在你的 `application.properties` 或 `application.yml` 文件中配置 Spring AI 连接到本地 Ollama 服务。

```yaml
spring:
  ai:
    ollama:
      base-url: http://localhost:11434 # 默认值，通常可省略
      chat:
        options:
          model: qwen2:7b # 指定默认模型
          # temperature: 0.7 # 其他可选参数
```

确保 `spring.ai.ollama.chat.options.model` 指向的模型已通过 `ollama run` 或 `ollama pull` 下载到本地并部署成功

---

**3 编写调用代码**

现在可以在 Spring 服务或控制器中注入 `ChatClient` 并使用它与 Ollama 模型进行交互。`ChatClient` 是 Spring AI 提供的通用接口。

```java
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AiController {

    private final ChatClient chatClient;

    // 通过构造函数注入 ChatClient
    // Spring AI 会根据你的配置 (发现 ollama starter 和配置) 自动创建合适的 ChatClient Bean
    @Autowired
    public AiController(ChatClient.Builder chatClientBuilder) {
        // 你可以使用 Builder 来进一步定制 ChatClient 的行为，
        // 例如设置默认的系统提示、函数调用等。
        // 这里我们直接构建默认的 ChatClient。
        this.chatClient = chatClientBuilder.build();
    }

    @GetMapping("/ai/generate")
    public String generate(@RequestParam(value = "prompt", defaultValue = "给我讲个关于程序员的笑话") String prompt) {
        // 使用 chatClient.call() 发送提示并获取响应
        // .prompt() 设置用户输入
        // .call() 发起调用
        // .content() 获取模型生成的文本内容
        return chatClient.prompt()
                .user(prompt) // 设置用户提示
                .call()       // 发起请求
                .content();   // 获取返回的文本内容
    }

    // 也可以直接注入具体的实现类，但不推荐，因为降低了可移植性
    /*
    private final OllamaChatClient ollamaChatClient;

    @Autowired
    public AiController(OllamaChatClient ollamaChatClient) {
        this.ollamaChatClient = ollamaChatClient;
    }

    @GetMapping("/ai/generate-specific")
    public String generateSpecific(@RequestParam(value = "prompt", defaultValue = "Why is the sky blue?") String prompt) {
        return ollamaChatClient.call(prompt);
    }
    */
}
```














---

## Spring AI Alibaba

Spring AI Alibaba 是基于 Spring AI 构建的扩展框架。

- **Spring AI**：主要面向国外主流模型（如 OpenAI、Azure、Amazon Bedrock），提供国际化支持

- **Spring AI Alibaba**：专注于阿里通义系列模型（如Qwen-2.5）及国内开源模型的深度集成

Spring AI Alibaba 文档参照：[Spring AI Alibaba](https://java2ai.com/docs/dev/overview), [DashScope](https://java2ai.com/docs/dev/models/dashScope)

::: tip 阿里云 DashScope 平台
阿里云 DashScope 平台提供了多种 AI 模型的 API 服务，各个大模型的接入方式参考：
- DeepSeek: https://java2ai.com/docs/dev/models/deepseek/
- Ollama: https://java2ai.com/docs/dev/models/ollama

注意：模型服务灵积(DashScope)已升级至大模型服务平台百炼(sfm)
:::

---

**环境要求和依赖**：

Spring AI Alibaba 的环境要求和 Spring AI 相同, 只需获取相应的API-KEY即可：

- JDK：Spring AI Alibaba 基于 Spring Boot 3.x 开发，因此本地 JDK 版本要求为 17 及以上


- API-KEY: 可通过 [阿里云百炼平台](https://bailian.console.aliyun.com/console?tab=model#/api-key) 获取 API-KEY。


---

依赖与SpringAI基本一致，只需要替换对应的starter即可：

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
        <!-- Spring AI Alibaba  -->
        <dependency>
            <groupId>com.alibaba.cloud.ai</groupId>
            <artifactId>spring-ai-alibaba-starter</artifactId>
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
<!-- 注意：由于 spring-ai 相关依赖包还没有发布到中央仓库，如出现 spring-ai-core 等
    相关依赖解析问题，请在项目的 pom.xml 依赖中加入如下仓库配置 -->
    <repositories>
        <repository>
            <id>spring-milestones</id>
            <name>Spring Milestones</name>
            <url>https://repo.spring.io/milestone</url>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
    </repositories>
```



---



配置及代码示例:

在 `src/main/resources/application.yml` (或 `.properties`) 文件中配置 API 密钥和其他可选参数：

```yaml
spring:
  ai:
    dashscope:
      api-key: ${AI_DASHSCOPE_API_KEY}
```

`${AI_DASHSCOPE_API_KEY}` 是一个环境变量(需要自己配置)，用于存储 DashScope 的 API 密钥。或者也可以将密钥直接配置在 api-key 后面即可。

---

代码示例：
```java
package top.ventix.aiagent.controller;

import com.alibaba.cloud.ai.dashscope.api.DashScopeApi;
import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatOptions;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Flux;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/client")
public class DashScopeChatClientController {

    private static final String DEFAULT_PROMPT = "你好，介绍下你自己！";

    private final ChatClient dashScopeChatClient;

    public DashScopeChatClientController(ChatModel chatModel) {

        // 构造时，可以设置 ChatClient 的参数
        // {@link org.springframework.ai.chat.client.ChatClient};
        this.dashScopeChatClient = ChatClient.builder(chatModel)
                // 实现 Logger 的 Advisor
                .defaultAdvisors(
                        new SimpleLoggerAdvisor()
                )
                // 设置 ChatClient 中 ChatModel 的 Options 参数
                .defaultOptions(
                        DashScopeChatOptions.builder()
                                .withModel(DashScopeApi.ChatModel.QWEN_MAX.getModel())
                                .withTopP(0.7)
                                .build()
                )
                .build();
    }

    // 也可以使用如下的方式注入 ChatClient
    // public DashScopeChatClientController(ChatClient.Builder chatClientBuilder) {
    //
    //  	this.dashScopeChatClient = chatClientBuilder.build();
    // }

    /**
     * ChatClient 简单调用
     */
    @GetMapping("/simple/chat")
    public String simpleChat() {

        return dashScopeChatClient.prompt(DEFAULT_PROMPT).call().content();
    }

    /**
     * ChatClient 流式调用
     */
    @GetMapping("/stream/chat")
    public Flux<String> streamChat(HttpServletResponse response) {

        response.setCharacterEncoding("UTF-8");
        return dashScopeChatClient.prompt(DEFAULT_PROMPT).stream().content();
    }

}
```
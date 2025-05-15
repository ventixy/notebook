---
article: true
date: 2025-05-15
category:
  - java
  - Spring AI
tag:
  - java
  - Spring AI
  - Kryo
  - 序列化和反序列化
shortTitle: Kryo序列化问题
title: Kryo序列化和Redis存储
order: 5
---

# 深藏不露的Bug：当Kryo序列化遇上`toString()`，AI工具为何集体“迷失”？

在软件开发中，我们时常与各种Bug不期而遇。有些Bug显而易见，错误日志直指病灶；而另一些则如冰山一角，表面现象可能误导我们偏离真正的根源。

本文将详细复盘一个在Java项目中，因错误处理Kryo序列化字节流而导致的Bug: `ClassNotFoundException`，揭示一个使用Kryo序列化后又使用 `toString()` 导致的Bug。

---

## 项目背景和问题分析

AI工具日趋强大，为了熟悉Spring AI和体验现在AI编程工具的潜力，我选择了使用AI来辅助我开发一个基于Spring AI的项目。

### 一个令人困惑的Bug

在使用Spring AI构建聊天功能时，实现对话记忆（`ChatMemory`）时计划采用Kryo进行序列化，并存储于Redis中。

于是我在IDEA中通过 通义灵码 插件实现了 `RedisChatMemory` 类，以实现基于Redis的AI对话记忆功能。代码如下：

```java
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.Output;
import com.esotericsoftware.kryo.io.Input;
import org.objenesis.strategy.StdInstantiatorStrategy;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

@Component
public class RedisChatMemory implements ChatMemory {

    private final StringRedisTemplate redisTemplate;
    private static final Kryo kryo = new Kryo();
    
    static {
        kryo.setRegistrationRequired(false);
        // 设置实例化策略
        kryo.setInstantiatorStrategy(new StdInstantiatorStrategy());
    }

    @Autowired
    public RedisChatMemory(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
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
        redisTemplate.delete(conversationId);
    }

    private List<Message> getOrCreateConversation(String conversationId) {
        String data = redisTemplate.opsForValue().get(conversationId);
        if (data != null && !data.isEmpty()) {
            try (Input input = new Input(new ByteArrayInputStream(data.getBytes()))) {
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
            redisTemplate.opsForValue().set(conversationId, bos.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

然而，系统在运行中突然抛出异常：

```bash
com.esotericsoftware.kryo.KryoException: Unable to find class: org.springframework.ai.chat.messages.AssistantMessago
	at com.esotericsoftware.kryo.util.DefaultClassResolver.readName(DefaultClassResolver.java:182)
	...
Caused by: java.lang.ClassNotFoundException: org.springframework.ai.chat.messages.AssistantMessago
	...
```

`AssistantMessago`——一个明显的类名拼写错误（应为`AssistantMessage`）。乍一看确实很奇怪，怎么出现了一个奇怪的类名呢？

---

### AI大模型的“常规”诊断

在最初的排查阶段，借助了多个市面上主流的AI编程助手（DeepSeek, 千问，ChatGPT ... ）。当把错误日志和相关代码片段喂给它们时，得到的建议高度相似：

1.  **清理Redis脏数据**：既然是`ClassNotFoundException`，且类名错误，那么最直接的嫌疑就是数据源。AI们纷纷建议检查并删除Redis中可能存在的、由早期错误代码（比如真的有过`AssistantMessago`这个类，或手动写入了错误数据）产生的脏数据。
2.  **增加反序列化容错**：在代码的`getOrCreateConversation`方法中，增加`try-catch`块，捕获反序列化异常，并在解析失败时删除Redis中对应的记录，并记录错误日志，避免程序崩溃。
3.  **在Kryo中注册常用的类名**： 尝试手动注所需类给 Kryo

这些建议从错误日志的字面意义上看是合理的，也是开发者在面对类似问题时的常规处理思路。照此操作，手动清理Redis中的数据后，问题依然存在。不死心的我又询问了几个大模型（claude, gemini），Gemini2.5Pro终于给出了一个详细且准确的回答。

---

### 序列化问题分析

其实问题就在`RedisChatMemory`中负责将Kryo序列化对象存入Redis的`saveConversation`方法。这段最初由AI工具生成的代码中，隐藏着一个关键的错误：

```java
// @Autowired
// private StringRedisTemplate stringRedisTemplate;

private void saveConversation_BUG(String conversationId, List<Message> messages) {
    try (ByteArrayOutputStream bos = new ByteArrayOutputStream();
         Output output = new Output(bos)) { // Kryo的Output流
        kryo.writeObject(output, messages);
        output.flush();
        // ** 万恶之源！**
        // AI生成的代码在此处错误地将二进制byte[]通过toString()转为String
        stringRedisTemplate.opsForValue().set(conversationId, bos.toString());
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```
可以看到，为了将 byte[] 存储到 Redis 中，我们使用了 `ByteArrayOutputStream.toString()` 方法。然而，这是一个错误的做法，因为 `toString()` 方法会尝试使用 JVM 默认的字符集将 byte[] 转换为字符串。这就留下了一个巨大的安全隐患：

  * **二进制数据转换为字符串**：`toString()`方法会尝试将二进制数据按照JVM默认的字符集进行解码。
  * **潜在的数据损坏**：如果二进制数据中包含了无法被默认字符集解码的字符，这些字符可能会被替换（如`?`），或者直接被丢弃。

::: info 错误的本质， 为何AI难以发现？

- Kryo序列化产生的是精确的二进制`byte[]`。`ByteArrayOutputStream.toString()`则会尝试使用JVM平台默认的字符集将这个`byte[]`**解码**成字符串。

- **通过 Keyo 序列化的数据，并不能直接使用 `toString()` 方法进行反序列化**

:::

**AI工具为何集体“迷失”？** 这里的本义是可以通过 Keyo 序列化不同实现类，但是由于常用的redis存储都是`String`类型，所以AI直接使用`toString()`方法进行了转换。

  * **关注表面现象**：多数AI模型在处理错误时，更倾向于从错误日志的直接信息（如`ClassNotFoundException`对应“类找不到”）出发，给出最常见的解决方案（如清理数据、检查类路径）。
  * **缺乏深层语义理解**：虽然AI能理解代码的语法结构，但对于`bos.toString()`用在二进制数据上的深层语义后果——即字符集转换可能导致二进制信息丢失——这种隐蔽的逻辑错误，AI可能缺乏足够的上下文和推理能力去精确识别。它可能“知道”`toString()`是合法的Java方法调用，但未能洞察其在此场景下的不当。
  * **训练数据的局限性**：如果AI的训练数据中缺乏这类因不当类型转换导致数据损坏的复杂案例，或者这类案例的信号不够强，它就很难学习到这种特定的错误模式。

讽刺的是，这个Bug本身就源于AI生成的代码，这提示我们AI在生成的代码尤其时涉及底层细节（如I/O、序列化、编码）时，仍需人工的严格审查。

---








## 两种Bug修复方案

### 方案一：Base64编码 


如果一定要使用`StringRedisTemplate`，或有在Redis中存储文本化表示的需求，可以考虑使用Base64编码（反序列化时先通过`Base64`解码）。

**`RedisChatMemory.java` (核心代码)**

```java
// ... (Kryo及其他引入) ...
import java.util.Base64;
// ...
// @Autowired
// private StringRedisTemplate stringRedisTemplate;
// ...
private void saveConversation(String conversationId, List<Message> messages) {
    try (ByteArrayOutputStream bos = new ByteArrayOutputStream();
         Output output = new Output(bos)) {
        kryo.writeObject(output, messages);
        output.flush();
        // 获取byte[]后，使用Base64编码
        String base64EncodedData = Base64.getEncoder().encodeToString(bos.toByteArray()); 
        stringRedisTemplate.opsForValue().set(conversationId, base64EncodedData);
    } catch (Exception e) { /* ... */ }
}

private List<Message> getOrCreateConversation(String conversationId) {
    String base64Data = stringRedisTemplate.opsForValue().get(conversationId);
    if (base64Data != null && !base64Data.isEmpty()) {
        try {
            byte[] data = Base64.getDecoder().decode(base64Data); // 解码回byte[]
            // ... (后续Kryo反序列化) ...
        } catch (Exception e) { /* ... */ }
    }
    return new ArrayList<>();
}
```

  * **优点**：兼容`StringRedisTemplate`，存储值为文本（易于观察但非直接可读）。
  * **缺点**：Base64增加约33%存储和网络开销，编解码消耗CPU。

---

### 方案二：直接存储`byte[]` 

使用`RedisTemplate<String, byte[]>`，此为最佳实践 (推荐)， 对于纯二进制数据，这是性能最优的方案。可通过Redis配置 (`RedisConfig.java`) `RedisTemplate<String, byte[]>` 直接存储`byte[]`

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

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

**`RedisChatMemory.java` (核心代码)**

```java
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
```

  * **优点**：存储和CPU效率最高，代码直接，最能发挥Kryo优势。
  * **缺点**：Redis CLI中查看值为二进制乱码，不便人工直接观察。

---

## 总结：拥抱AI但保持警惕

这次经历深刻地提醒我们：

1.  序列化和反序列化过程一定要用相同或匹配的方式，否则可能引入灾难性的数据损坏。

2.  **AI编程助手的双刃剑**：AI能极大提高开发效率，辅助生成代码，甚至诊断一些常见问题。但对于涉及底层机制、隐蔽逻辑或特定领域知识的复杂Bug，当前的AI（即使是较先进的模型）仍可能“只见树木，不见森林”。它们给出的“标准答案”可能无法触及问题本质。

3.  **人工审查与批判性思维的重要性**：AI生成的代码，尤其是涉及I/O、序列化、并发、事务等关键部分，必须经过经验丰富的开发者严格审查。不能盲目信任，要保持批判性思维。

4.  **新一代AI的潜力**：如此次案例 Gemini 2.5 Pro所展现的，AI在深度理解和复杂问题诊断方面的能力正在飞速进步。未来，更强大的AI或许能更早、更准地发现这类隐蔽问题。


无论工具如何发展，对计算机科学基础（如数据类型、编码、I/O流）的扎实掌握，始终是开发者诊断和解决复杂问题的基石。





-----
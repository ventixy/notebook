---

order: 30
title:  幂等与防重

---


在分布式系统和微服务架构中，接口幂等性和防重是两个相关但不同的概念。它们都旨在解决由于网络问题、客户端重试等原因导致的重复请求问题，但在实现和应用场景上有所区别。

1. **目的不同**：
   - **幂等性**：确保多次请求的结果一致，避免副作用。
   - **防重**：防止短时间内重复请求，避免不必要的处理。

2. **时间范围不同**：
   - **幂等性**：通常不受时间限制，只要请求的参数相同，结果就一致。
   - **防重**：通常在一定的时间窗口内有效，超过时间窗口后可以重新请求。

3. **实现机制不同**：
   - **幂等性**：通常需要持久化存储（如数据库）来记录请求的状态。
   - **防重**：通常使用缓存或内存来记录请求的状态，过期时间较短。




## 接口幂等性

**幂等性（Idempotence）** 是指一个操作或请求在多次执行后，结果与只执行一次相同。换句话说，无论执行多少次，结果都不会改变。

#### 特点
- **结果一致性**：多次执行同一操作，结果保持一致。
- **客户端透明**：客户端可以安全地重试请求，而不用担心产生副作用。

#### 应用场景
- **支付系统**：确保用户多次点击支付按钮不会重复扣款。
- **订单系统**：确保用户多次提交订单请求不会创建多个订单。
- **数据更新**：确保数据更新操作不会因多次请求而重复更新。

#### 实现方法
- **唯一标识符**：为每个请求生成一个唯一的标识符，并在数据库中记录该标识符。
- **版本号**：使用版本号或时间戳来确保数据的一致性。
- **状态机**：使用状态机来管理操作的状态，确保每个操作只能从一个特定的状态转换到另一个特定的状态。


#### 幂等性示例

```java
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class IdempotentService {
    private final ConcurrentHashMap<String, Boolean> requestCache = new ConcurrentHashMap<>();

    public void processRequest(String requestId, String data) {
        // 检查请求是否已经处理过
        if (requestCache.putIfAbsent(requestId, true) == null) {
            // 请求未处理过，进行业务逻辑处理
            System.out.println("Processing request with ID: " + requestId);
            // 模拟业务逻辑处理
            // ...
        } else {
            // 请求已经处理过，返回之前的处理结果
            System.out.println("Request with ID: " + requestId + " has already been processed.");
        }
    }

    public static void main(String[] args) {
        IdempotentService service = new IdempotentService();
        
        // 生成唯一请求ID
        String requestId1 = UUID.randomUUID().toString();
        String requestId2 = UUID.randomUUID().toString();
        
        // 模拟客户端发送请求
        service.processRequest(requestId1, "Data1");
        service.processRequest(requestId1, "Data1"); // 重复请求
        service.processRequest(requestId2, "Data2");
    }
}
```






## 防重复提交

**防重（Duplicate Prevention）** 是指防止同一个请求在短时间内被多次处理。防重的主要目的是避免因网络延迟、客户端重试等原因导致的重复请求。

#### 特点
- **时间窗口限制**：通常在一定的时间窗口内防止重复请求。
- **临时存储**：使用缓存或内存来记录请求的状态，防止短时间内重复请求。

#### 应用场景
- **表单提交**：防止用户多次提交相同的表单。
- **验证码发送**：防止用户短时间内多次请求发送验证码。
- **接口调用**：防止客户端短时间内多次调用同一接口。

#### 实现方法
- **缓存**：使用缓存（如 Redis）记录请求的唯一标识符，并设置过期时间。
- **内存**：使用内存中的数据结构（如 `ConcurrentHashMap`）记录请求的唯一标识符，并设置过期时间。
- **数据库**：在数据库中记录请求的状态，并在处理请求前进行检查。



#### 防重示例

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class DuplicatePreventionService {
    private final ConcurrentHashMap<String, Long> requestCache = new ConcurrentHashMap<>();
    private final int expirationInSeconds = 60; // 过期时间，单位为秒

    public void processRequest(String requestId, String data) {
        // 检查请求是否已经在缓存中
        Long timestamp = requestCache.get(requestId);
        if (timestamp != null && System.currentTimeMillis() - timestamp < TimeUnit.SECONDS.toMillis(expirationInSeconds)) {
            // 请求在缓存中且未过期，拒绝处理
            System.out.println("Request with ID: " + requestId + " is duplicated and within the expiration time.");
            return;
        }

        // 请求不在缓存中或已过期，进行业务逻辑处理
        System.out.println("Processing request with ID: " + requestId);
        // 模拟业务逻辑处理
        // ...

        // 记录请求到缓存中
        requestCache.put(requestId, System.currentTimeMillis());
    }

    public static void main(String[] args) {
        DuplicatePreventionService service = new DuplicatePreventionService();
        
        // 生成唯一请求ID
        String requestId1 = "requestId1";
        String requestId2 = "requestId2";
        
        // 模拟客户端发送请求
        service.processRequest(requestId1, "Data1");
        service.processRequest(requestId1, "Data1"); // 重复请求
        service.processRequest(requestId2, "Data2");
    }
}
```
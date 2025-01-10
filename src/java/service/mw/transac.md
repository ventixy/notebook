---

order: 10
title:  分布式事务

---




## 分布式事务理论

分布式事务是指涉及多个数据库或服务的操作，这些操作需要作为一个整体来提交或回滚。在微服务架构中，一个业务流程可能涉及多个服务的调用，每个服务可能有自己的数据库。为了确保数据的一致性，需要一种机制来协调这些服务之间的事务。分布式事务的挑战：

1. **数据一致性**：确保所有操作要么全部成功，要么全部失败。
2. **性能**：分布式事务通常比单数据库事务更慢，因为需要额外的协调和通信。
3. **网络问题**：网络故障可能导致部分操作成功而部分操作失败。
4. **死锁**：多个事务之间的资源竞争可能导致死锁。



### XA 协议

XA 协议（2PC两阶段提交）是一种标准的分布式事务协议，通过两阶段提交来确保事务的原子性。
- **阶段**：
  - **准备阶段**：所有参与者准备提交事务，并回复协调者是否准备好。
  - **提交阶段**：协调者根据准备阶段的结果决定提交或回滚事务。
- **优点**：
  - 强一致性：确保所有参与者要么全部提交，要么全部回滚。
- **缺点**：
  - 性能较差：两阶段提交增加了网络通信开销。
  - 死锁风险：长时间持有资源可能导致死锁。
- **适用场景**：对数据一致性要求极高，且性能要求不是特别高的场景。
- **示例框架**：JTA（Java Transaction API），Atomikos

XA 协议（3PC三阶段提交）在二阶段的基础上增加了超时机制。但同样性能不佳，开销甚至更大，没有落地实现。


### TCC

- **定义**：TCC（Try-Confirm-Cancel） 是一种补偿事务模式，通过 Try、Confirm 和 Cancel 三个步骤来实现分布式事务。
- **步骤**：
  - **Try**：尝试执行操作，预留资源。
  - **Confirm**：确认操作，正式提交。
  - **Cancel**：取消操作，释放资源。
- **优点**：
  - 灵活性高：可以根据业务逻辑自定义补偿操作。
  - 性能较好：避免了两阶段提交的性能问题。
- **缺点**：
  - 实现复杂：需要为每个业务操作实现 Try、Confirm 和 Cancel 方法。
- **适用场景**：对数据一致性和性能都有较高要求的场景。
- **示例框架**：Hmily，TCC-Framework

### Saga 模式

- **定义**：Saga 模式是一种长事务管理方法，通过一系列补偿操作来确保事务的一致性。
- **步骤**：
  - **每个操作**：每个服务调用都是一个独立的事务。
  - **补偿操作**：如果某个操作失败，执行前面所有操作的补偿操作。
- **优点**：
  - 灵活性高：可以根据业务逻辑灵活设计补偿操作。
  - 性能较好：避免了两阶段提交的性能问题。
- **缺点**：
  - 实现复杂：需要为每个操作设计补偿操作。
  - 长事务管理：需要管理长事务的复杂性。
- **适用场景**：对数据一致性和性能都有较高要求的场景。
- **示例框架**：Dromedary，Spring Cloud Saga

### 事务消息

使用事务消息解决分布式事务的基本流程：

1. **开始本地事务**：当一个服务需要执行一个业务操作（如扣减库存），并且这个操作成功后需要通知另一个服务（如下单成功后需要通知物流服务准备发货）。

2. **预发送消息**：在本地事务成功提交之前，先将消息预发送到消息队列。这一步通常不会真正将消息发布出去，而是将其标记为“待确认”状态。

3. **提交本地事务**：如果本地事务成功提交，则向消息队列发送确认信息，告知消息队列可以正式发送该消息。此时，消息队列会正式发送这条消息给订阅者。

4. **消息消费**： 消息队列中的消息被消费者接收后，消费者执行相应的业务逻辑（如物流服务接收到消息后进行发货准备）。

5. **确认消息接收**： 消费者完成业务逻辑处理后，需要向消息队列发送确认信息，表明消息已被成功处理。这样，消息队列可以确认该消息已经被正确消费，从而避免重复发送。

6. **回查机制**： 如果消息发送方在一段时间内没有收到消费者的确认信息，或者消息发送方的本地事务失败，则可以通过回查机制来检查消息的状态。例如，消息发送方可以主动查询消费者的处理状态，或者设置定时任务来重试未被确认的消息。

- **适用场景**：对数据一致性的即时性要求不高，但对性能要求较高的场景。
- **示例框架**：RabbitMQ，Kafka，RocketMQ


## 分布式事务框架

### Seata

Seata 是一个开源的分布式事务解决方案，旨在提供高性能和易用的分布式事务服务。Seata 支持多种事务模式，包括 AT 模式、TCC 模式、SAGA 模式和 XA 模式。

Seata 通过两阶段提交协议（2PC）来实现分布式事务的管理。其核心组件包括：

1. **事务协调器（Transaction Coordinator, TC）**：全局事务的管理者，负责事务的提交或回滚。
2. **事务管理器（Transaction Manager, TM）**：控制全局事务的边界，开始全局事务并最终提交或回滚全局事务。
3. **资源管理器（Resource Manager, RM）**：管理分支事务，负责与 TC 通信，报告事务状态并接收事务的提交或回滚指令。

Seata 支持以下几种事务模式：

::: tabs

@tab:active AT 模式

**AT 模式** 是 Seata 默认的事务模式，基于自动化的 SQL 解析和事务管理，适用于大多数关系型数据库。

1. **开始全局事务**：
   - TM 调用 `GlobalTransactional` 注解的方法，开始一个新的全局事务。
   - TM 向 TC 注册全局事务，并获取全局事务ID（XID）。

2. **执行分支事务**：
   - RM 在执行 SQL 语句时，会解析 SQL 并记录 undo log 和 lock。
   - RM 向 TC 注册分支事务，关联到当前的全局事务。

3. **提交全局事务**：
   - TM 调用 `GlobalTransactional` 注解的方法结束时，向 TC 发送全局提交请求。
   - TC 收到请求后，向所有注册的 RM 发送分支提交请求。
   - RM 收到分支提交请求后，提交本地事务，并删除 undo log。
   - RM 向 TC 返回提交结果，TC 记录全局事务的状态为提交成功。

4. **回滚全局事务**：
   - 如果 TM 发现某个分支事务失败，向 TC 发送全局回滚请求。
   - TC 收到请求后，向所有注册的 RM 发送分支回滚请求。
   - RM 收到分支回滚请求后，使用 undo log 回滚本地事务。
   - RM 向 TC 返回回滚结果，TC 记录全局事务的状态为回滚成功。

5. **异常处理**：
   - 如果在事务过程中发生异常，TM 会捕获异常并进行适当的处理，如回滚事务。

```java
import io.seata.spring.annotation.GlobalTransactional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StockService stockService;

    @GlobalTransactional
    public void placeOrder(Order order) {
        // 插入订单
        orderRepository.save(order);

        // 扣减库存
        stockService.decreaseStock(order.getProductId(), order.getQuantity());
    }
}
```

@tab TCC 模式

**TCC 模式** 是一种显式的事务控制模式，要求业务方提供三个方法：try、confirm 和 cancel。

1. **开始全局事务**：
   - TM 调用 `GlobalTransactional` 注解的方法，开始一个新的全局事务。
   - TM 向 TC 注册全局事务，并获取全局事务ID（XID）。

2. **执行 try 方法**：
   - RM 调用业务方提供的 try 方法，进行资源预留。
   - RM 向 TC 注册分支事务，关联到当前的全局事务。

3. **提交全局事务**：
   - TM 调用 `GlobalTransactional` 注解的方法结束时，向 TC 发送全局提交请求。
   - TC 收到请求后，向所有注册的 RM 发送分支确认请求。
   - RM 收到分支确认请求后，调用 confirm 方法，完成事务提交。
   - RM 向 TC 返回确认结果，TC 记录全局事务的状态为提交成功。

4. **回滚全局事务**：
   - 如果 TM 发现某个分支事务失败，向 TC 发送全局回滚请求。
   - TC 收到请求后，向所有注册的 RM 发送分支取消请求。
   - RM 收到分支取消请求后，调用 cancel 方法，回滚资源预留。
   - RM 向 TC 返回取消结果，TC 记录全局事务的状态为回滚成功。

5. **异常处理**：
   - 如果在事务过程中发生异常，TM 会捕获异常并进行适当的处理，如回滚事务。

```java
import io.seata.tcc.TccAction;

@Service
public class StockService {

    @TccAction
    public boolean decreaseStock(@TccParam(name = "productId") int productId, @TccParam(name = "quantity") int quantity) {
        // try 方法：预留库存
        boolean result = tryDecreaseStock(productId, quantity);
        if (!result) {
            return false;
        }

        // confirm 方法：扣减库存
        confirmDecreaseStock(productId, quantity);

        // cancel 方法：恢复库存
        cancelDecreaseStock(productId, quantity);

        return true;
    }

    private boolean tryDecreaseStock(int productId, int quantity) {
        // 预留库存
        return true;
    }

    private void confirmDecreaseStock(int productId, int quantity) {
        // 扣减库存
    }

    private void cancelDecreaseStock(int productId, int quantity) {
        // 恢复库存
    }
}
```

@tab SAGA 模式

**SAGA 模式** 是一种长事务模式，适用于跨多个服务的长流程事务。

1. **定义事务编排**：
   - 定义事务的编排规则，包括每个步骤的正向操作和补偿操作。
   - 使用 DSL 或编程方式定义事务编排规则。

2. **开始全局事务**：
   - TM 调用 `GlobalTransactional` 注解的方法，开始一个新的全局事务。
   - TM 向 TC 注册全局事务，并获取全局事务ID（XID）。

3. **执行正向操作**：
   - RM 按照编排规则依次执行每个步骤的正向操作。
   - 每个步骤成功后，RM 向 TC 注册分支事务，关联到当前的全局事务。

4. **提交全局事务**：
   - TM 调用 `GlobalTransactional` 注解的方法结束时，向 TC 发送全局提交请求。
   - TC 收到请求后，记录全局事务的状态为提交成功。

5. **回滚全局事务**：
   - 如果某个步骤失败，TM 向 TC 发送全局回滚请求。
   - TC 收到请求后，按照编排规则依次执行每个步骤的补偿操作。
   - 每个步骤成功后，RM 向 TC 返回补偿结果，TC 记录全局事务的状态为回滚成功。

6. **异常处理**：
   - 如果在事务过程中发生异常，TM 会捕获异常并进行适当的处理，如回滚事务。

```java
import io.seata.saga.dtm.DTMSaga;
import io.seata.saga.dtm.DTMSagaBuilder;

@Service
public class OrderService {

    @Autowired
    private DTMSaga saga;

    @GlobalTransactional
    public void placeOrder(Order order) {
        // 定义事务编排规则
        DTMSagaBuilder builder = DTMSagaBuilder.newBuilder()
                .addStep("createOrder", "createOrderCompensation")
                .addStep("decreaseStock", "increaseStock");

        // 开始全局事务
        saga.start(builder.build());

        // 执行正向操作
        createOrder(order);
        decreaseStock(order.getProductId(), order.getQuantity());
    }

    private void createOrder(Order order) {
        // 创建订单
    }

    private void createOrderCompensation(Order order) {
        // 创建订单的补偿操作
    }

    private void decreaseStock(int productId, int quantity) {
        // 扣减库存
    }

    private void increaseStock(int productId, int quantity) {
        // 恢复库存
    }
}
```

@tab XA 模式

**XA 模式** 是一种传统的分布式事务模式，基于 XA 协议实现两阶段提交。

1. **开始全局事务**：
   - TM 调用 `GlobalTransactional` 注解的方法，开始一个新的全局事务。
   - TM 向 TC 注册全局事务，并获取全局事务ID（XID）。

2. **执行分支事务**：
   - RM 在执行 SQL 语句时，通过 XA 协议与数据库交互，记录事务状态。
   - RM 向 TC 注册分支事务，关联到当前的全局事务。

3. **提交全局事务**：
   - TM 调用 `GlobalTransactional` 注解的方法结束时，向 TC 发送全局提交请求。
   - TC 收到请求后，向所有注册的 RM 发送分支提交请求。
   - RM 收到分支提交请求后，提交本地事务。
   - RM 向 TC 返回提交结果，TC 记录全局事务的状态为提交成功。

4. **回滚全局事务**：
   - 如果 TM 发现某个分支事务失败，向 TC 发送全局回滚请求。
   - TC 收到请求后，向所有注册的 RM 发送分支回滚请求。
   - RM 收到分支回滚请求后，回滚本地事务。
   - RM 向 TC 返回回滚结果，TC 记录全局事务的状态为回滚成功。

5. **异常处理**：
   - 如果在事务过程中发生异常，TM 会捕获异常并进行适当的处理，如回滚事务。

```java
import io.seata.spring.annotation.GlobalTransactional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StockService stockService;

    @GlobalTransactional
    public void placeOrder(Order order) {
        // 插入订单
        orderRepository.save(order);

        // 扣减库存
        stockService.decreaseStock(order.getProductId(), order.getQuantity());
    }
}
```

:::

Seata 通过多种事务模式提供了灵活的分布式事务解决方案。每种模式都有其特定的应用场景：

- **AT 模式**：适用于大多数关系型数据库，基于自动化的 SQL 解析和事务管理。
- **TCC 模式**：适用于需要显式事务控制的场景，要求业务方提供 try、confirm 和 cancel 方法。
- **SAGA 模式**：适用于跨多个服务的长流程事务，通过编排规则定义正向和补偿操作。
- **XA 模式**：基于传统的 XA 协议实现两阶段提交，适用于需要强一致性的场景。





### RabbitMQ

RabbitMQ 是一款广泛使用的开源消息中间件，支持多种消息模式，包括直接、扇形、主题和头部交换等。虽然 RabbitMQ 不像 RocketMQ 那样内置了事务消息的支持，但它可以通过 AMQP 协议提供的事务机制来实现类似的功能。

::: tabs

@tab:active 生产者端

1. **开启事务**：
   - 生产者在发送消息前，需要调用 `channel.txSelect()` 方法开启事务。
   - 开启事务后，所有后续的操作（如发送消息）都将在事务上下文中进行。

2. **发送消息**：
   - 生产者调用 `channel.basicPublish()` 方法发送消息到指定的交换机和路由键。
   - 消息将被暂存，但不会立即投递给消费者。

3. **执行本地事务**：
   - 生产者在发送消息后，执行本地事务，如数据库操作等。
   - 如果本地事务成功，调用 `channel.txCommit()` 方法提交事务。
   - 如果本地事务失败，调用 `channel.txRollback()` 方法回滚事务。

4. **事务提交或回滚**：
   - 如果本地事务成功，调用 `channel.txCommit()` 方法提交事务，消息将被正式发送并投递给消费者。
   - 如果本地事务失败，调用 `channel.txRollback()` 方法回滚事务，消息将被丢弃。

5. **异常处理**：
   - 如果在事务过程中发生异常，生产者应捕获异常并进行适当的处理，如记录日志或重试。

```java
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

public class TransactionProducer {
    public static void main(String[] args) throws Exception {
        // 创建连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");

        // 创建连接
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        // 开启事务
        channel.txSelect();

        try {
            // 发送消息
            String message = "Hello RabbitMQ";
            channel.basicPublish("exchangeName", "routingKey", null, message.getBytes());

            // 执行本地事务
            // 模拟本地事务操作
            System.out.println("Executing local transaction...");
            Thread.sleep(1000); // 模拟耗时操作
            // 假设事务成功

            // 提交事务
            channel.txCommit();
            System.out.println("Transaction committed and message sent successfully.");
        } catch (Exception e) {
            // 回滚事务
            channel.txRollback();
            System.out.println("Transaction rolled back due to error: " + e.getMessage());
        } finally {
            // 关闭通道和连接
            channel.close();
            connection.close();
        }
    }
}
```

@tab 消费者端

1. **订阅消息**：
   - 消费者订阅感兴趣的队列，并设置消息监听器（`DeliverCallback` 和 `CancelCallback`）。

2. **接收消息**：
   - 当消息被正式发送并投递给消费者时，RabbitMQ 将消息传递给消费者的回调函数。
   - 消费者接收到消息后，调用回调函数中的逻辑处理消息。

3. **处理消息**：
   - 消费者在回调函数中执行具体的业务逻辑，如更新数据库记录等。
   - 消费者需要调用 `channel.basicAck()` 方法确认消息已被成功处理。
   - 如果消费者未能成功处理消息，可以选择调用 `channel.basicNack()` 方法拒绝消息，并设置重新入队标志。

4. **确认消息**：
   - 如果消费者成功处理消息，调用 `channel.basicAck()` 方法确认消息已被成功消费。
   - 如果消费者未能成功处理消息，调用 `channel.basicNack()` 方法拒绝消息，并设置重新入队标志，表示需要重新消费该消息。

```java
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

public class TransactionConsumer {
    public static void main(String[] args) throws Exception {
        // 创建连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");

        // 创建连接
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        // 设置队列名称
        String queueName = "queueName";

        // 设置消息监听器
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println("Received message: '" + message + "'");

            try {
                // 处理消息
                // 模拟业务逻辑处理
                System.out.println("Processing message...");
                Thread.sleep(1000); // 模拟耗时操作
                // 假设处理成功

                // 确认消息
                channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                System.out.println("Message processed and acknowledged.");
            } catch (Exception e) {
                // 拒绝消息并重新入队
                channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, true);
                System.out.println("Message processing failed: " + e.getMessage());
            }
        };

        // 设置取消监听器
        CancelCallback cancelCallback = consumerTag -> {
            System.out.println("Consumer cancelled: " + consumerTag);
        };

        // 开始消费消息
        channel.basicConsume(queueName, false, deliverCallback, cancelCallback);

        // 保持程序运行
        while (true) {
            Thread.sleep(1000);
        }
    }
}
```
:::





### RocketMQ

RocketMQ 是一款阿里巴巴开源的分布式消息中间件，广泛应用于大规模分布式应用中。它支持多种消息模型，包括普通消息、顺序消息、延迟消息以及事务消息等。其中，[事务消息](https://rocketmq.apache.org/zh/docs/featureBehavior/04transactionmessage#%E5%8A%9F%E8%83%BD%E5%8E%9F%E7%90%86) 特别适用于需要保证消息发送和本地事务一致性的场景。

RocketMQ 的事务消息机制主要依赖于两阶段提交协议来保证消息发送与本地事务的一致性：

::: tabs

@tab:active 生产者端

1. **发送半消息**：
   - 生产者调用 `sendMessageInTransaction` 方法发送消息，并指定一个事务监听器（`TransactionListener`）。
   - RocketMQ 接收到消息后，将其标记为半消息并存储。

2. **执行本地事务**：
   - RocketMQ 调用生产者提供的事务监听器中的 `executeLocalTransaction` 方法，执行本地事务。
   - 生产者在 `executeLocalTransaction` 方法中执行具体的业务逻辑，如数据库操作等。

3. **返回事务状态**：
   - 根据本地事务的执行结果，生产者返回一个事务状态（如 `TransactionStatus.CommitMessage` 或 `TransactionStatus.RollbackMessage`）给 RocketMQ。
   - 如果本地事务成功，返回 `CommitMessage`，表示消息可以提交。
   - 如果本地事务失败，返回 `RollbackMessage`，表示消息应该回滚。

4. **消息提交或回滚**：
   - 如果生产者返回 `CommitMessage`，RocketMQ 将半消息标记为可投递状态，并投递给消费者。
   - 如果生产者返回 `RollbackMessage`，RocketMQ 删除半消息，不再投递给消费者。

5. **超时检查**：
   - 如果 RocketMQ 在超时时间内没有收到生产者的事务状态通知，它会调用事务监听器中的 `checkLocalTransaction` 方法进行回查。
   - 生产者需要在 `checkLocalTransaction` 方法中根据本地事务的状态，再次返回事务状态给 RocketMQ。

```java
import org.apache.rocketmq.client.producer.TransactionListener;
import org.apache.rocketmq.client.producer.TransactionMQProducer;
import org.apache.rocketmq.common.message.Message;
import org.apache.rocketmq.common.message.MessageExt;
import org.apache.rocketmq.remoting.exception.RemotingException;

public class TransactionProducer {
    public static void main(String[] args) throws InterruptedException, RemotingException, MQClientException {
        // 创建事务消息生产者实例
        TransactionMQProducer producer = new TransactionMQProducer("transaction_producer_group");
        producer.start();

        // 设置事务监听器
        producer.setTransactionListener(new TransactionListener() {
            @Override
            public LocalTransactionState executeLocalTransaction(Message msg, Object arg) {
                // 执行本地事务
                try {
                    // 模拟本地事务操作
                    System.out.println("Executing local transaction...");
                    Thread.sleep(1000); // 模拟耗时操作
                    // 假设事务成功
                    return LocalTransactionState.COMMIT_MESSAGE;
                } catch (Exception e) {
                    // 事务失败
                    return LocalTransactionState.ROLLBACK_MESSAGE;
                }
            }

            @Override
            public LocalTransactionState checkLocalTransaction(MessageExt msg) {
                // 回查本地事务状态
                System.out.println("Checking local transaction status...");
                // 根据实际情况返回事务状态
                return LocalTransactionState.COMMIT_MESSAGE;
            }
        });

        // 发送事务消息
        Message msg = new Message("TopicTest", "TagA", "Key1", ("Hello RocketMQ").getBytes());
        producer.sendMessageInTransaction(msg, null);

        // 关闭生产者
        producer.shutdown();
    }
}
```


@tab 消费者端

1. **订阅消息**：
   - 消费者订阅感兴趣的 Topic，并设置消息监听器（`MessageListenerConcurrently` 或 `MessageListenerOrderly`）。

2. **接收消息**：
   - 当消息被标记为可投递状态后，RocketMQ 将消息投递给订阅了该 Topic 的消费者。
   - 消费者接收到消息后，调用消息监听器中的 `consumeMessage` 方法处理消息。

3. **处理消息**：
   - 消费者在 `consumeMessage` 方法中执行具体的业务逻辑，如更新数据库记录等。
   - 消费者需要返回一个消费状态（如 `ConsumeConcurrentlyStatus.CONSUME_SUCCESS` 或 `ConsumeConcurrentlyStatus.RECONSUME_LATER`）给 RocketMQ。

4. **确认消息**：
   - 如果消费者成功处理消息，返回 `ConsumeConcurrentlyStatus.CONSUME_SUCCESS`，表示消息已被成功消费。
   - 如果消费者未能成功处理消息，返回 `ConsumeConcurrentlyStatus.RECONSUME_LATER`，表示需要重新消费该消息。

```java
import org.apache.rocketmq.client.consumer.DefaultMQPushConsumer;
import org.apache.rocketmq.client.consumer.listener.ConsumeConcurrentlyContext;
import org.apache.rocketmq.client.consumer.listener.ConsumeConcurrentlyStatus;
import org.apache.rocketmq.client.consumer.listener.MessageListenerConcurrently;
import org.apache.rocketmq.common.message.MessageExt;

public class TransactionConsumer {
    public static void main(String[] args) throws MQClientException {
        // 创建消费者实例
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("transaction_consumer_group");
        consumer.subscribe("TopicTest", "TagA");

        // 设置消息监听器
        consumer.registerMessageListener(new MessageListenerConcurrently() {
            @Override
            public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs, ConsumeConcurrentlyContext context) {
                for (MessageExt msg : msgs) {
                    // 处理消息
                    try {
                        // 模拟业务逻辑处理
                        System.out.println("Received message: " + new String(msg.getBody()));
                        // 假设处理成功
                        return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
                    } catch (Exception e) {
                        // 处理失败，需要重新消费
                        return ConsumeConcurrentlyStatus.RECONSUME_LATER;
                    }
                }
                return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
            }
        });

        // 启动消费者
        consumer.start();
        System.out.println("Consumer started.");
    }
}
```
:::





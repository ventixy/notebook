---
title: Java常见面试题分析
index: false
icon: java
category:
  - Java
  - Interview
---


## 复习计划

### JavaWeb 3

#### Day1
- JavaWeb是什么（静态资源和动态资源）
- tomcat是什么以及作用
- HTTP协议的作用以及组成（请求行，请求头，请求体）
- 浏览器输入一个网址后，看到返回结构，都经历了哪些流程

#### Day2
- HTTP之请求消息Request
- HTTP之响应消息Response
- URI和URL的区别
- MVC架构

#### Day3
- 三大组件Servlet，Filter，Listener
- 什么是JDBC
- 什么是Mybatis
- #{}和${}区别
- xml中有哪些标签
- 动态sql



### MySQL 8 

#### Day1 概念
  - MySQL的DDL和DML分别是什么含义？怎么写？
  - MySQL的三范式？反范式？
  - MySQL中的笛卡尔积（为什么要小表驱动大表）

#### Day2 结构和事务
  - InnoDB与MyISAM的区别
  - B树和B+树的区别
  - 一个B+树中大概能存放多少条索引记录？怎么计算？
  - 介绍一下MySQL中事务的特性
  - ACID是怎么保证的
  - 介绍一下MySQL中事务的隔离级别
  - MySQL的可重复读是怎么实现的？
  - 可重复读解决了幻读问题吗？
  - InnoDB如何管理page页
  - 什么是buffer pool
  - 如何判断一个页是否在bufferpool中缓存

#### Day3 索引
  - 索引有哪几种类型？使用索引一定可以提升效率吗？
  - 说一下聚簇索引与非聚簇索引
  - 介绍一下最左前缀法则
  - 为什么LIKE以%开头会失效（覆盖索引不会失效）
  - explain用过吗，有哪些主要字段（mysql查询过程）
  - type字段中有哪些常见的值
  - Extra有哪些主要指标，各自的含义是什么
  - 什么是自适应哈希索引

#### Day4 日志
- 什么是索引下推
- 什么是覆盖索引
- 什么是索引跳跃
- undolog、redolog、binlog的作用是什么
- binlog与redolog的区别
- mysql的binlog有几种日志格式分别有什么区别
- binlog和redolog的刷盘时机
- 讲一讲mysql的错误日志/慢查询日志/查询日志/中继日志

#### Day5 锁
- 请说一下数据库锁的种类
- 请说一下共享锁和排他锁
- 说一下mysql的死锁原因
- InnoDB的行锁是怎么实现的
- 说一下意向锁是解决什么问题的
- 请说一下间隙锁

#### Day6 架构
- 介绍一下mysql的体系架构
- mysql内部支持缓存查询吗
- 说一下mysql执行一条查询语句的内部执行过程
- 说一下mysql执行一条更新语句的内部执行过程
- 说一下两阶段提交
- 说一下mysql的主从复制

#### Day7 调优
- 谈一谈你对mysql优化的理解
- 什么是分库分表什么时候进行分库分表
- 项目中有用到分库分表吗
- shardingsphere和mycat怎么选择？
- 怎么定位和分析慢sql
- 怎么分析慢sql
- 分布式ID都知道哪些？（四种）

#### Day8 调优
- 说一下Innodb内存相关的参数优化
- Innodb日志相关的参数优化了解过吗
- 如何进行分页查询优化
- 如何做慢查询优化
- mysql8.0有哪些优化？



### JUC 7

#### Day1 基础
- 什么是进程什么是线程？
- 讲一讲串行/并行/并发？
- 讲一讲同步/异步/阻塞/非阻塞？
- 讲一讲线程的创建方式？
- 线程的状态？
- 线程中常用的方法？
- 线程的结束方式？

#### Day2 三大特性
- 讲一讲并发编程三大特性？
- 讲一下JMM内存模型
- 怎么保证原子性？
- 怎么保证可见性？
- 怎么保证有序性？

#### Day3 锁
- 讲一下锁的分类
- synchronized和ReentrantLock的区别
- synchronized JDK1.6的优化

#### Day4 阻塞队列
- 讲一下对象的结构
- 讲一下AQS
- AQS为什么用双向链表？为什么有一个虚拟的head节点？
- JUC包下哪些地方用到了AQS（AQS的应用）
- ReentrantLock公平和非公平怎么实现的？
- 讲一下ReentrantReadWriteLock
- 有哪些阻塞队列？
- 讲一讲BlockingQueue的生产方法
- 讲一讲BlockingQueue的消费方法
- ArrayBlockingQueue和LinkedBlockingQueue的区别？
- PriorityBlockingQueue底层基于什么实现的？
- DelayQueue的实现原理知道吗？
- SynchronousQueue的特点？



#### Day5 线程池
- 讲一下JDK自带的线程池？
- 怎么自定义线程池？
- 自定义线程池有哪些参数？
- 怎么决定线程池的参数？
- 线程池的状态？
- 拒绝策略有哪些？
- 线程池监控工具？

#### Day6 并发集合
- 知道哪些并发安全的集合？
- Vector怎么保证的？
- HashTable怎么保证的？

#### Day7 并发工具
- ConcurrentHashMap怎么保证的？
- CopyOnWriteArrayList怎么保证的？
- 知道哪些并发工具？
- CountDownLatch实现原理
- CyclicBarrier实现原理
- Semaphore实现原理





### Spring 6

#### Day1 Spring基础
  - 什么是IOC
  - 什么是AOP
  - 什么是DI
  - spring框架的作用
  - spring框架中用到哪些设计模式
- **进阶**
  - 什么是循环依赖？spring是怎么解决循环依赖的？
  - spring循环依赖为什么需要三级缓存
  - spring的常用注解
  - @Component和@Controller和@Repository和@Service有什么区别
  - @Autowired和@Resource两个注解的区别

#### Day2 生命周期和事务
  - bean的生命周期
  - spring中支持的作用域有几种
  - bean的扩展点
  - spring事务的实现方式
  - spring事务的隔离级别
  - spring事务的失效场景
  - spring事务的传播特性

#### Day3 spring进阶
  - spring中bean单例对象是否是线程安全的
  - Advice有哪些通知类型
  - BeanFactoryPostProcessor的理解
  - BeanPostProcessor的理解
  - FactoryBean和BeanFactory的区别
  - BeanFactory和ApplicationContext区别

#### SpringMVC
  - springmvc框架的作用
  - springmvc有哪些组件
  - mvc分层代表什么
  - springmvc常用注解
  - springmvc执行流程



#### SpringBoot

  - 什么是Spring Boot
  - 什么是Spring Boot Starter
  - 介绍几个常用的Starter
  - 怎么运行Spring Boot项目
  - 怎么重新加载Spring Boot上的更改而不用重启服务器
  - Spring Boot打成的jar包和普通jar有什么区别

#### Day2
  - Spring Boot怎么实现定时任务
  - Spring Boot需要独立的容器运行吗
  - Spring Boot的自动装配
  - @Import注解的理解
  - Spring Boot的常用注解
  - Spring Boot有哪些配置文件？怎么指定不同环境？
  - Spring Boot的拦截器



### SpringCloud 3

#### Day1
  - 讲一下CAP和BASE
  - Spring Cloud中有哪些组件
  - 分布式和微服务有什么区别
  - 为什么要用Spring Cloud
  - Raft协议知道吗

#### Day2
  - 什么是服务注册
  - Nacos和Eureka的区别
  - 什么是服务监控
  - 怎么定位一个慢接口慢在哪里？
  - 什么是配置中心

#### Day3 
  - Ribbon和nginx的区别
  - Feign和OpenFeign什么区别
  - Gateway网关有什么作用
  - Sentinel的作用




### 消息队列 4

#### Day1 概念
- 讲一下MQ的作用？优点？缺点？
- 四种MQ的比较

#### Day2 使用
- 说一说RabbitMQ中的AMQP
- RabbitMQ中交换器四种类型
- 如何解决重复消费（消息幂等）
- RabbitMQ上的一个queue中存放message是否有数量限制
- 项目中怎么使用MQ的？

#### Day3 消息
- RocketMQ的Producer三种生产消息的方式
- RocketMQ的Consumer两种消费模式
- RocketMQ的Consumer两种监听方式
- RocketMQ的可视化管理工具用过吗？
- RocketMQ怎么发顺序消息
- RocketMQ的批量消息
- RocketMQ的延时消息
- RocketMQ的过滤消息
- RocketMQ的事务消息
- 事务消息的机制了解吗？讲一讲回查机制？

#### Day4 架构
- RocketMQ怎么保证高可用
- RocketMQ为什么快
- RocketMQ怎么保证消息可靠
- RocketMQ的存储机制了解吗？（应对高并发写入、顺序写、commitlog consumequeue两个文件）
- RocketMQ中Broker的刷盘策略有哪些
- RocketMQ中的Broker部署方式
- RocketMQ怎么实现路由注册
- RocketMQ怎么实现路由发现









## 面试题

### Spring 相关
1. 如果要你实现 Spring IOC，你会注意哪些问题？
2. Spring 声明式事务原理？哪些场景事务会失效？
3. 如果让你实现一个 Dubbo，会考虑用哪些技术解决哪些问题？
4. 如何设计 RPC 框架在 10 万 QPS 下实现毫秒级的服务调用？
5. 如果让你设计一个分布式链路跟踪系统？你怎么做？

### Redis 相关
1. Redis 中多大的 Key 算热 key，该如何解决？
2. Redis 雪崩、穿透以及热点账户问题。
3. 布隆过滤器过滤无效的请求，说一下代码实现思路。
4. Redis 里面 LRU、LFU 缺点是什么？有什么解决的办法？
5. 如果有非常多的请求不断访问 Redis 中一个很大的 value，这种情况怎么处理？
6. 有一批百万数据量的数据需要写入 Redis 中，有什么合适的方案？

### JVM 和 GC
1. [线上问题排查] 如果 JVM 出现频繁 FullGC 该如何解决？
2. [线上问题排查] JVM OOM 问题如何排查和解决？
3. 使用哪些参数可以实现发生 OOM 时自动生成 dump 文件？
4. Java 中的对象一定在堆上分配吗？

### 数据库相关
1. MySQL 有哪几种锁？锁是如何用的？用在哪种索引上？
2. 如果查询优化器选错了索引怎么办？
3. InnoDB 的索引结构和 MyISAM 有区别吗？
4. 请简要说明 MySQL 中 MyISAM 和 InnoDB 引擎的区别。
5. 数据迁移过程，TiDB 数据迁移到 MySQL 的全过程？双读双写怎么做？
6. 为什么索引要用 B+ 树来实现呢，而不是 B 树？
7. 为什么 MySOL 的默认隔离级别是 RR？

8. 常见的索引结构有哪些？哈希表结构属于哪种场景？


### 并发编程与线程管理
1. ThreadLocal 参数如何传递，线程池如何传递？
2. Java 线程和操作系统线程的区别。
3. 线程和线程池的生命周期。
4. 线程同步和线程协作是怎么理解的？
5. Netty 相比原生的 IO 模型有啥优势？

### 分布式系统与消息队列
1. Kafka 的消费者可能有哪些状态？Kafka 的高水位是什么？
2. MQ 熟悉哪几个？RabbitMQ 和其他 MQ 的区别？它们都是怎么保证消息的顺序？
3. 什么是分布式事务？和常规的单一服务下的事务有什么区别？
4. 和外部机构的 API 交互如何防止外部机构服务不可用拖垮调用服务？

### 设计模式与架构
1. 设计模式中的策略模式有用过吗？怎么用的？
2. 在项目中，学校之间会有些共性的特征，我们如何去封装这些共性特征？
3. 短 URL 生成器设计：百亿短 URL 怎样做到无冲突？
4. 如果让你设计一个分布式链路跟踪系统？你怎么做？




### 项目经验与优化
1. 聊聊你印象最深刻的项目，或者做了什么优化。
2. 所有的项目都过了一遍，问了一下细节。
3. 秒杀过程中的一致性问题（场景题）。
4. 分布式锁加锁失败后的等待逻辑是如何实现的？
5. 续期机制如何实现？是让持有锁的线程自己去续期还是专门发起一个续期的线程？二者哪个好？

6. 为什么 K8s 的设计里有 Pod，而不是直接用容器？



---

order: 20
title:  Spring事务管理

---


## 一 Spring整合数据库

### 1 JDBC Template

Spring设计之初，核心在于简化程序相关代码的开发。在实际商业项目开发与运行过程中，数据库成了极为重要的数据存储中介，几乎所有项目都是以数据库操作为核心展开的。

为了简化这传统JDBC的操作。Spring提供了JDBC可重用设计方案：JDBC Template（JDBC模板）

```bash

ORMapping组件:

JDBC是一个标准，所以注定了其内容会极其琐碎。为了提升项目开发速度，出现了大量ORMapping组件（对象关系映射），

即结合配置文件（或注解）与反射机制实现JDBC的可重用定义。

例如，JDO、Hibernate、EntityBean、IBatis、MyBatis、JPA等都属于此类组件。

JDBC Template是ORMapping设计中最小的一种组件。

```


通过对比可以发现，使用JDBC Template且基于Spring开发管理，虽然程序代码不够智能，但与传统JDBC相比，开发者多数情况下只需要关注SQL定义以及返回结果的处理即可。

<br>

所需依赖：

```xml
<properties>
    <spring.version>5.2.15.RELEASE</spring.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.9.9.1</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>${spring.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>${spring.version}</version>
    </dependency>

    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>1.2.8</version>
    </dependency>

    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.47</version>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13.2</version>
        <scope>test</scope>
    </dependency>

</dependencies>

```

项目中引入spring-jdbc依赖支持库后，就可以直接使用JDBC Template进行项目开发了


### 2 Spring整合Mybatis

**mybatis-spring**：

mybatis-spring文档介绍：http://mybatis.org/spring/zh/index.html 

```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>2.0.6</version>
</dependency>

```


##  二 Spring事务管理

项目开发中，事务是一个重要的数据库控制手段。利用事务操作，可以保证若干更新操作同时成功或失败，也可以防止并发访问数据库所造成的数据不同步问题

事务的核心特征：A 原子性、C 一致性、I 隔离性、D 持久性

事务并发引起的问题：脏读、不可重复读、虚（幻）读

数据库的隔离级别：

| 隔离级别 | 脏读 | 不可重复读 | 虚读 |
| -------- | ---- | ---------- | ---- |
| 读未提交 | ×    | ×          | ×    |
| 读已提交 | √    | ×          | ×    |
| 可重复读 | √    | √          | ×    |
| 串行化   | √    | √          | √    |

MySql默认的隔离级别是什么：可重复读



<br>



### 1. 事务的传播行为

事务的传播行为：<font color='red'>**Propagation**</font> Behavior，多个事务的方法之间如何处理事务，即：

假设有两个方法、且存在着调用关系，这时候需要考虑如果发生了异常，谁提交，谁回滚

<br>

**REQUIRED**：默认的传播行为, 也是最常用的

- 如果没有事务，则单独增加一个事务；
- 如果已经包含事务，则加入进来，当做是一个事务

<span style='color:yellow;background:red;font-size:文字大小;font-family:字体;'>**同生共死**</span>，要么一起提交，要么一起回滚

```bash

示例：

service1里有一个method1，service2里有一个method2，如果method1调用了method2，

那么称谁method1是外围，method2是内部

```

> 假设method1增加了事务，method2增加了事务，并且传播行为是REQUIRED
>
> 如果method1发生异常，谁提交，谁回滚  → 都回滚
>
> 如果method2发生异常，谁提交，谁回滚  → 都回滚

<br>

**REQUIRES_NEW** 

- 如果没有事务，则单独增加一个事务
- 如果已经包含事务，则作为一个新的事务

<span style='color:yellow;background:red;font-size:文字大小;font-family:字体;'>**自私型**</span> ，外围不能影响内部，但是内部可以影响外围

> service1里有一个method1，service2里有一个method2，如果method1调用了method2，
>
> 假设method1增加了事务，method2增加了事务，并且传播行为是REQUIRES_NEW
>
> 如果method1发生异常，谁提交，谁回滚  → method1回滚、method2提交
>
> 如果method2发生异常，谁提交，谁回滚  → 都回滚

通常指的是内部方法比外围的方法更重要的情况

<br>

**NESTED** 

- 如果没有事务，则单独增加一个事务
- 如果已经包含事务，则以嵌套事务的方式运行

<span style='color:yellow;background:red;font-size:文字大小;font-family:字体;'>**无私型**</span>，外围可以影响内部，但是内部不会影响外围

> service1里有一个method1，service2里有一个method2，如果method1调用了method2
>
> 假设method1增加了事务，method2增加了事务，并且传播行为是NESTED
>
> 如果method1发生异常，谁提交，谁回滚  → 都回滚
>
> 如果method2发生异常，谁提交，谁回滚  → method2回滚

通常指的是外围的方法比内部的方法更重要的情况，外围的方法是内部方法的基础

如：注册账号方法和发优惠券方法，注册账号方法会调用发优惠券方法



<br>



### 2. Spring事务处理架构



#### PlatformTransactionManager

事务处理的核心标准接口：PlatformTransactionManager 

Spring要管理事务，必然要使用平台事务管理器（帮我们开启事务、提交事务、事务的回滚）

此接口定义了事务控制的核心标准，在实际开发过程中可能有若干种数据库操作事务控制会实现此接口，这样就可以被Spring进行统一管理

![](https://image.ventix.top/java/image-20220428211852285.png)

HibernateTransactionManager → Hibernate( ssh → ssm)

<font color='red'>**DataSourceTransactionManager **</font>→ MyBatis

<br>

```java

public interface PlatformTransactionManager extends TransactionManager {
    //根据事务的定义获得事务的状态
    TransactionStatus getTransaction(@Nullable TransactionDefinition var1) 
        throws TransactionException;
    
    //提交 → 传入的参数是事务的状态
    void commit(TransactionStatus var1) throws TransactionException;
    
	//回滚 → 传入的参数是事务的状态
    void rollback(TransactionStatus var1) throws TransactionException;
}

```

<br>



#### TransactionStatus

TransactionStatus事务状态，提供的方法是和事务状态相关的方法

![image-20220428102824373](https://gitee.com/stone4j/picture-bed/raw/master/img/image-20220428102824373.png)

<br>



#### TransactionDefinition

TransactionDefinition接口，主要定义了事务的传播属性和隔离级别，同时确定了该事务是否只为只读事务以及超时时间配置

```java
public interface TransactionDefinition {
    int PROPAGATION_REQUIRED = 0;
    int PROPAGATION_SUPPORTS = 1;
    int PROPAGATION_MANDATORY = 2;
    int PROPAGATION_REQUIRES_NEW = 3;
    int PROPAGATION_NOT_SUPPORTED = 4;
    int PROPAGATION_NEVER = 5;
    int PROPAGATION_NESTED = 6;
    int ISOLATION_DEFAULT = -1;
    int ISOLATION_READ_UNCOMMITTED = 1;
    int ISOLATION_READ_COMMITTED = 2;
    int ISOLATION_REPEATABLE_READ = 4;
    int ISOLATION_SERIALIZABLE = 8;
    int TIMEOUT_DEFAULT = -1;

    default int getPropagationBehavior() {
        return 0;
    }

    default int getIsolationLevel() {
        return -1;
    }

    default int getTimeout() {
        return -1;
    }

    default boolean isReadOnly() {
        return false;
    }

    @Nullable
    default String getName() {
        return null;
    }

    static TransactionDefinition withDefaults() {
        return StaticTransactionDefinition.INSTANCE;
    }
}
```



<br>



### 3. 事务的使用案例

Spring事务需要spring-tx依赖 → 已经通过 spring-jdbc 引入进来了 

```xml

<!--DataSourceTransactionManager-->
<bean id="transactionManager"class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="datasource"/>
</bean>

```

![image-20220428111047330](https://gitee.com/stone4j/picture-bed/raw/master/img/image-20220428111047330.png)

<br>



#### TransactionTemplate 

手动管理事务，需要提供一个TransactionTemplate实例 → 可以使用Spring容器管理起来

```xml

<bean class="org.springframework.transaction.support.TransactionTemplate">
    <property name="transactionManager" ref="transactionManager"/>
</bean>

```

![image-20220428113105521](https://gitee.com/stone4j/picture-bed/raw/master/img/image-20220428113105521.png)

```java

@FunctionalInterface
public interface TransactionCallback<T> {
    //在事务里做什么事情 → 哪一些内容需要增加上事务
    @Nullable
    T doInTransaction(TransactionStatus var1);
}

```

这部分内容是需要增加事务的内容 → 应该放到doInTransaction

doInTransaction方法的返回值 → 作为TransactionTemplate的execute方法的返回值

```java

@Override
public void transfer(Integer fromId, Integer destId, Integer money) {
    
    Integer execute = template.execute(new TransactionCallback<Integer>() {
        
        @Override
        public Integer doInTransaction(TransactionStatus transactionStatus) {
            Integer fromMoney = accountMapper.queryMoneyByPrimaryKey(fromId);
            Integer destMoney = accountMapper.queryMoneyByPrimaryKey(destId);

            fromMoney -= money;
            destMoney += money;

            accountMapper.updateMoneyByPrimaryKey(fromId, fromMoney);
            int i = 1 / 0;
            accountMapper.updateMoneyByPrimaryKey(destId, destMoney);
            return 5; //doInTransaction返回值是多少，execute的值就是多少
        }
    });

}

```

<br>



#### TransactionProxyFactoryBean

通过委托类组件向容器中注册代理组件 → 通过FactoryBean的形式来注册的。代理组件做的增强是事务

```xml

<bean id="accountServiceProxy" class="org.springframework.transaction.interceptor.TransactionProxyFactoryBean">
    <property name="target" ref="accountServiceImpl"/>
    <property name="transactionManager" ref="transactionManager"/>
    <!--针对于委托类组件中的方法配置Definition-->
    <!--properties类型的值在property子标签里使用props子标签-->
    <property name="transactionAttributes">
        <props>
            <!--key:方法名-->
            <!--value：definition-->
            <!--Definition要按照规定的写法来书写，才能够正确解析-->
            <!--了解-->
            <!--
                传播行为：PROPAGATION_XXX
                隔离级别：ISOLATION_XXX
                只读属性：readOnly
                超时时间：timeout_数字 单位是秒
                不回滚的异常：+XXXException → 异常的全限定类名
                回滚的异常：-XXXException
                多个值通过逗号分开
            -->
            <!--<prop key="transfer">PROPAGATION_REQUIRED,readOnly</prop>-->
            <prop key="transfer">PROPAGATION_REQUIRED</prop>
        </props>
    </property>
</bean>

```

<br>



#### Transaction advice

advisor的方式：需要引用 advice组件 （ implements MethodInterceptor接口）

Spring事务已经提供了这样的一个实现类 → 通过这样的事务通知类提供一个事务的通知组件

```xml

<!--TransactionInterceptor这样的通知组件-->
<!--spring对事务的支持提供了一个额外的标签 → TransactionInterceptor的配置-->
<!--tx的schema约束 → tx:advice-->
<tx:advice id="transactionAdvice" transaction-manager="transactionManager">
    <!--方法和Definition对应关系的配置-->
    <tx:attributes>
        <tx:method name="transfer" isolation="REPEATABLE_READ" propagation="REQUIRED" />
    </tx:attributes>
</tx:advice>

<aop:config>
    <aop:advisor advice-ref="transactionAdvice" pointcut="execution(* com..service..*(..))"/>
</aop:config>

```

<br>

详细说明：

```xml

<!--声明式事务-->
<!--1.声明事务管理器-->
<bean class="org.springframework.jdbc.datasource.DataSourceTransactionManager" id="transactionManager2">
    <property name="dataSource" ref="myDataSource"/>
</bean>

<!--2.声明业务方法的事务属性（隔离级别，传播行为，超时）
            id：给业务方法配置事务段代码起个名字，唯一值
            transaction-manager:事务管理器的id
-->
<tx:advice id="serviceAdvice" transaction-manager="transactionManager2">
    <!--给具体的业务方法增加事务的说明-->
    <tx:attributes>
        <!-- 给具体的业务方法，说明他需要的事务属性
                name：业务方法名称，配置name的值 
					1.业务方法的名称（类中的某一个方法） 
					2.带有部分通配符的方法名称 
					3.使用*
                propagation：指定传播行为
                isolation：隔离级别
                read-only：是否只读，默认为false
                timeout：超时时间
                rollback-for：指定回滚的异常类列表，使用的异常类的全限定名称(多个异常时用都好分割)
                -->
        <tx:method name="buy"
                   isolation="DEFAULT"
                   propagation="REQUIRED"
                   timeout="20"
                   rollback-for="java.lang.NullPointerException"
                   />

        <!--在业务方法有命名规则的时候，可以对一些方法使用事务-->
        <tx:method name="add*" propagation="REQUIRED" timeout="20" isolation="DEFAULT"/>
        <tx:method name="delete*" propagation="REQUIRED" timeout="20" isolation="DEFAULT"/>
        <!--以上方法以外的-->
        <tx:method name="*"/>
    </tx:attributes>
</tx:advice>
<!--通过上述方法的声明，但是我们并不知道是哪个类的方法，让上述声明生效的方法：切入点表达式-->
<!--声明切入点表达式：表示哪些包中的哪些类的方法参与事务-->
<aop:config>
    <!--声明切入点表达式
          expression：切入点表达式，表示哪些类中的哪些方法要参与事务
            id：切入点表达式的名称，唯一值
            -->
    <aop:pointcut id="servicePointCut" expression="execution(* *..service..*.*(..))"/>
    <!-- 关联切入点表达式和事务的通知-->
    <aop:advisor advice-ref="serviceAdvice" pointcut-ref="servicePointCut"/>
</aop:config>

```

<br>



#### ★★★@Transactional

```xml

<!-- 打开事务的注解开关 -->

<tx:annotation-driven transaction-manager="transactionManager"/>

```

<br>

```java

//注解可以出现在类上或方法上，如果出现在类上，意味着每个方法都增加上事务
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Transactional {
    @AliasFor("transactionManager")
    String value() default "";

    @AliasFor("value")
    String transactionManager() default "";

    Propagation propagation() default Propagation.REQUIRED;

    Isolation isolation() default Isolation.DEFAULT;

    int timeout() default -1;

    boolean readOnly() default false;

    Class<? extends Throwable>[] rollbackFor() default {};

    String[] rollbackForClassName() default {};

    Class<? extends Throwable>[] noRollbackFor() default {};

    String[] noRollbackForClassName() default {};
}

```


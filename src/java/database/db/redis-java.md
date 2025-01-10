---

order: 60
title:  Java操作Redis

---


## 1. Jedis

引入依赖：

Maven Repository: redis.clients » jedis ：https://mvnrepository.com/artifact/redis.clients/jedis

```xml

<!-- https://mvnrepository.com/artifact/redis.clients/jedis -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.3.0</version>
</dependency>

```

<br>



```java

public class SortedSetDemo {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("192.168.5.150");
        jedis.auth("itdrizzle");

        String ssk = "sorted_set_key";

        jedis.del(ssk);

        Map<String, Double> map = new HashMap<>();
        map.put("user1", 88.0);
        map.put("user2", 56.0);
        map.put("user3", 75.0);
        map.put("user4", 85.0);
        map.put("user5", 68.0);

        jedis.zadd(ssk, map);
        jedis.expire(ssk, 120);

        System.out.println("jedis.zrange(ssk, 0, -1) = " + jedis.zrange(ssk, 0, -1));
        System.out.println("jedis.zrangeWithScores(ssk, 0, 2) = " + jedis.zrangeWithScores(ssk, 0, 2));

        System.out.println("jedis.zrank(ssk, \"user2\") = " + jedis.zrank(ssk, "user2"));
        System.out.println("jedis.zscore(ssk, \"user2\") = " + jedis.zscore(ssk, "user2"));

        System.out.println("jedis.zcard(ssk) = " + jedis.zcard(ssk));
        System.out.println("jedis.zcount(ssk, 60, 80) = " + jedis.zcount(ssk, 60, 80));

        jedis.close();
    }
}

```



## 2. Lettuce

Lettuce 是另一个流行的 Redis Java 客户端，支持同步、异步和响应式编程模型。

在 pom.xml 中添加 Lettuce 依赖：
```xml
<dependency>
    <groupId>io.lettuce.core</groupId>
    <artifactId>lettuce-core</artifactId>
    <version>6.2.0.RELEASE</version>
</dependency>
```

使用示例：
```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

public class LettuceExample {
    public static void main(String[] args) {
        // 创建 Redis 客户端
        RedisClient client = RedisClient.create("redis://localhost:6379");
        try (StatefulRedisConnection<String, String> connection = client.connect()) {
            RedisCommands<String, String> syncCommands = connection.sync();

            // 设置键值对
            syncCommands.set("key", "value");
            System.out.println("Set key: value");

            // 获取键值对
            String value = syncCommands.get("key");
            System.out.println("Get key: " + value);

            // 删除键值对
            syncCommands.del("key");
            System.out.println("Delete key");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```



## 3. Spring Data

- 引入redis依赖，完成redis相关配置（pom文件和application.yaml）

```xml
<!--  引入 redis 依赖   -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

```yaml
spring:
  redis:
    database: 1
    host: 139.155.174.119
    port: 6379
    password: 000000
```

- redisTemplate的基本使用

```java
@Autowired
private StringRedisTemplate redisTemplate;

redisTemplate.hasKey(key)                                   //判断是否有key所对应的值
redisTemplate.opsForValue().get(key)                        //取出key值所对应的值
redisTemplate.opsForValue().multiGet(keys)                  //批量查询，对应mget

redisTemplate.opsForValue().set(key, value)                 //设置当前的key以及value值
redisTemplate.opsForValue().set(key, value, timeout, unit)  //设置当前的key以及value值并且设置过期时间

redisTemplate.delete(key)                                   //删除单个key值
redisTemplate.delete(keys)                                  //批量删除key,其中keys:Collection<K> keys

redisTemplate.dump(key)                                     //将当前传入的key值序列化为byte[]类型

redisTemplate.expire(key, timeout, unit)                    //设置过期时间
redisTemplate.getExpire(key)                                //返回剩余时间

redisTemplate.opsForValue().increment(key, increment)       //设置自增
```

```java
//批量查询，管道pipeline
List<Object> result = redisTemplate.executePipelined(new RedisCallback<String>() {
	@Override
	public String doInRedis(RedisConnection connection) throws DataAccessException {
		StringRedisConnection src = (StringRedisConnection)connection;

		for (String k : keys) {
			src.get(k);
		}
		return null;
	}
});
```

- Hash类型：是一个string类型的field和value的映射表，hash特别适合用于存储对象。

```java
redisTemplate.opsForHash().hasKey(key, field)                   //查看hash表中指定字段是否存在
redisTemplate.opsForHash().keys(key)                            //获取所有hash表中字段
redisTemplate.opsForHash().entries(key)                         //对应命令：HGETALL key，返回哈希表 key中，所有的域和值
redisTemplate.opsForHash().get(key, field)                      //获取变量key中的指定field

redisTemplate.opsForHash().put(key, field, value)               //新增hash值
redisTemplate.opsForHash().putIfAbsent(key, field, value)       //新增hash值(仅当hashKey不存在时才设置)
redisTemplate.opsForHash().putAll(key, maps)                    //map集合的形式添加键值对

redisTemplate.opsForHash().increment(key, field, increment);    //给哈希表key中的指定字段的整数值加上增量increment

redisTemplate.opsForHash().delete(key, fields)                  //删除一个或者多个hash表字段
```

- List 类型

```java
redisTemplate.opsForList().size(key)                            //获取当前key的List列表长度
redisTemplate.opsForList().index(key, index)                    //获取指定位置的值
redisTemplate.opsForList().range(key, start, end)               //获取列表指定范围内的元素(start开始位置, 0是开始位置，end 结束位置, -1返回所有)

redisTemplate.opsForList().leftPush(key, value)                 //存储在list的头部，即添加一个就把它放在最前面的索引处
redisTemplate.opsForList().leftPushAll(key, value)              //把多个值存入List中(value可以是多个值，也可以是一个Collection value)
redisTemplate.opsForList().leftPushIfPresent(key, value)        //List存在的时候再加入
redisTemplate.opsForList().leftPush(key, pivot, value)          //如果pivot存在则在pivot前面添加

redisTemplate.opsForList().set(key, index, value)               //设置指定索引处元素的值

redisTemplate.opsForList().rightPop(key)                        //移除并获取列表最后一个元素
```

- Set类型

```java
redisTemplate.opsForSet().size(key)                             //获取集合的大小
redisTemplate.opsForSet().isMember(key, value)                  //判断集合是否包含value

redisTemplate.opsForSet().add(key, values)                      //添加元素

redisTemplate.opsForSet().remove(key, values)                   //移除元素(单个值、多个值)
redisTemplate.opsForSet().pop(key)                              //删除并且返回一个随机的元素
```

- Zset类型，ZSetOperations提供了一系列方法对有序集合进行操作(有序集合是按照元素的score值由小到大进行排列)

```java
redisTemplate.opsForZSet().add(key, value, score)
redisTemplate.opsForZSet().remove(key, values)
redisTemplate.opsForZSet().incrementScore(key, value, delta)                //增加元素的score值，并返回增加后的值

redisTemplate.opsForZSet().rank(key, value)                                 //返回元素在集合的排名,有序集合是按照元素的score值由小到大排列
redisTemplate.opsForZSet().reverseRangeWithScores(key, start,end)           //获取集合中给定区间的元素(start 开始位置，end 结束位置)
redisTemplate.opsForZSet().reverseRangeByScore(key, min, max, start, end)   //获取分数在最小和最大值之间的元素,在此基础上再返回指定区间的元素
```


## 4. Redisson

Redisson 是一个 Redis 的 Java 客户端，支持 Redis 的所有特性，并且提供了丰富的高级特性。

在 pom.xml 中添加 Redisson 依赖：
```xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>3.16.3</version>
</dependency>
```

示例代码：
```java
import org.redisson.Redisson;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class RedissonExample {
    public static void main(String[] args) {
        // 创建 Redisson 客户端
        Config config = new Config();
        config.useSingleServer().setAddress("redis://127.0.0.1:6379");
        RedissonClient redisson = Redisson.create(config);

        // 获取一个字符串桶对象
        RBucket<String> bucket = redisson.getBucket("key");
        
        // 设置键值对
        bucket.set("value");
        System.out.println("Set key: value");

        // 获取键值对
        String value = bucket.get();
        System.out.println("Get key: " + value);

        // 删除键值对
        bucket.delete();
        System.out.println("Delete key");

        // 关闭 Redisson 客户端
        redisson.shutdown();
    }
}
```


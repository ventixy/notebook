---

order: 20
title:  分布式锁

---


在微服务架构中，分布式锁是一种用于协调多台服务器上进程之间的同步操作的机制。分布式锁可以确保在分布式环境中只有一个进程能够执行某个关键操作，从而避免数据不一致等问题。



## 分布式锁的使用场景

1. **高并发环境下的资源竞争**：
   - 例如，在秒杀系统中，多个用户同时请求购买同一个商品，需要确保每个商品只能被一个用户购买。

2. **数据一致性**：
   - 在分布式系统中，多个节点可能同时访问和修改同一份数据，需要确保数据的一致性。

3. **任务调度**：
   - 在分布式任务调度系统中，确保只有一个节点能够执行某个任务，避免重复执行。

4. **缓存更新**：
   - 在缓存更新策略中，确保只有一个节点能够更新缓存，避免缓存击穿问题。




## 基于 Redis 的分布式锁

Redis 是一个高性能的内存数据库，常用于实现分布式锁。Redis 提供了一些原生命令，如 `SETNX` 和 `EXPIRE`，可以用来实现分布式锁。

##### 原理

1. **获取锁**：
   - 使用 `SETNX` 命令尝试设置一个键值对，如果键不存在，则设置成功，表示获取锁成功。
   - 使用 `EXPIRE` 命令为键设置过期时间，防止死锁。

2. **释放锁**：
   - 使用 `DEL` 命令删除键，表示释放锁。

##### 代码示例

```java
import redis.clients.jedis.Jedis;

public class RedisDistributedLock {
    private Jedis jedis;
    private String lockKey;
    private String lockValue;
    private int expireTime;

    public RedisDistributedLock(Jedis jedis, String lockKey, String lockValue, int expireTime) {
        this.jedis = jedis;
        this.lockKey = lockKey;
        this.lockValue = lockValue;
        this.expireTime = expireTime;
    }

    public boolean acquireLock() {
        long expires = System.currentTimeMillis() + expireTime + 1;
        String expiresStr = String.valueOf(expires);

        if (jedis.setnx(lockKey, expiresStr) == 1) {
            // 锁获取成功
            return true;
        }

        String currentValueStr = jedis.get(lockKey);
        if (currentValueStr != null && Long.parseLong(currentValueStr) < System.currentTimeMillis()) {
            // 锁已过期
            String oldValueStr = jedis.getSet(lockKey, expiresStr);
            if (oldValueStr != null && oldValueStr.equals(currentValueStr)) {
                // 防止多线程条件竞争
                return true;
            }
        }

        return false;
    }

    public void releaseLock() {
        String currentValueStr = jedis.get(lockKey);
        if (currentValueStr != null && currentValueStr.equals(lockValue)) {
            jedis.del(lockKey);
        }
    }
}
```

## 基于 ZooKeeper 的分布式锁

ZooKeeper 是一个分布式的协调服务，常用于实现分布式锁。ZooKeeper 提供了临时节点和顺序节点，可以用来实现分布式锁。

##### 原理

1. **获取锁**：
   - 创建一个临时顺序节点。
   - 获取当前节点的所有子节点，找到最小的一个子节点。
   - 如果当前节点是最小的子节点，则获取锁成功。
   - 否则，监听比当前节点小的节点，等待其删除后再尝试获取锁。

2. **释放锁**：
   - 删除当前节点，表示释放锁。

##### 代码示例

```java
import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooDefs.Ids;
import org.apache.zookeeper.ZooKeeper;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;

public class ZookeeperDistributedLock implements Watcher {
    private ZooKeeper zooKeeper;
    private String lockPath;
    private CountDownLatch countDownLatch;

    public ZookeeperDistributedLock(ZooKeeper zooKeeper, String lockPath) {
        this.zooKeeper = zooKeeper;
        this.lockPath = lockPath;
    }

    @Override
    public void process(WatchedEvent event) {
        if (event.getType() == Event.EventType.NodeDeleted) {
            countDownLatch.countDown();
        }
    }

    public boolean acquireLock() throws KeeperException, InterruptedException {
        String lockNode = zooKeeper.create(lockPath + "/lock-", "".getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);
        System.out.println("Created lock node: " + lockNode);

        List<String> children = zooKeeper.getChildren(lockPath, false);
        Collections.sort(children);

        String currentLockNode = lockNode.substring(lockPath.length() + 1);
        String smallestChild = children.get(0);

        if (currentLockNode.equals(smallestChild)) {
            // 获取锁成功
            return true;
        }

        for (int i = 0; i < children.size(); i++) {
            if (children.get(i).equals(currentLockNode)) {
                String prevChild = children.get(i - 1);
                countDownLatch = new CountDownLatch(1);
                zooKeeper.exists(lockPath + "/" + prevChild, this);
                countDownLatch.await();
                break;
            }
        }

        return true;
    }

    public void releaseLock() throws KeeperException, InterruptedException {
        zooKeeper.delete(lockPath, -1);
        System.out.println("Released lock node: " + lockPath);
    }
}
```

## 基于数据库的分布式锁

数据库也可以用来实现分布式锁，通常通过乐观锁或悲观锁的方式实现。

##### 原理

1. **获取锁**：
   - 使用 `UPDATE` 语句尝试更新某个字段，如果更新成功，则表示获取锁成功。
   - 使用 `SELECT FOR UPDATE` 语句锁定行，防止其他事务修改。

2. **释放锁**：
   - 使用 `UPDATE` 语句将字段恢复到初始状态，表示释放锁。

##### 代码示例

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DatabaseDistributedLock {
    private Connection connection;
    private String lockKey;
    private String lockValue;

    public DatabaseDistributedLock(Connection connection, String lockKey, String lockValue) {
        this.connection = connection;
        this.lockKey = lockKey;
        this.lockValue = lockValue;
    }

    public boolean acquireLock() throws SQLException {
        String sql = "UPDATE distributed_lock SET locked = 1, lock_value = ? WHERE lock_key = ? AND locked = 0";
        PreparedStatement stmt = connection.prepareStatement(sql);
        stmt.setString(1, lockValue);
        stmt.setString(2, lockKey);

        int rowsAffected = stmt.executeUpdate();
        return rowsAffected > 0;
    }

    public void releaseLock() throws SQLException {
        String sql = "UPDATE distributed_lock SET locked = 0, lock_value = NULL WHERE lock_key = ? AND lock_value = ?";
        PreparedStatement stmt = connection.prepareStatement(sql);
        stmt.setString(1, lockKey);
        stmt.setString(2, lockValue);

        stmt.executeUpdate();
    }
}
```




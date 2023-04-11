# 动态代理

模拟某企业用户管理业务，

- 需包含用户登录，用户删除，用户查询功能，并要统计每个功能的耗时。

- 分析 定义一个UserService表示用户业务接口，规定必须完成用户登录，用户删除，用户查询功能。

- 定义一个实现类UserServiceImpl实现UserService，并完成相关功能，且统计每个功能的耗时。

- 定义测试类，创建实现类对象，调用方法。

```java
public interface UserService {
    User login(String username, String password);
    boolean deleteUser(int id);
    User getUser(int id);
}
```

```java
public class UserServiceImpl implements UserService {
    private UserDAO userDao;
    private TimeRecorder timeRecorder;

    public UserServiceImpl(UserDAO userDao, TimeRecorder timeRecorder) {
        this.userDao = userDao;
        this.timeRecorder = timeRecorder;
    }

    public User login(String username, String password) {
        long startTime = System.currentTimeMillis();
        User user = userDao.getUserByUsernameAndPassword(username, password);
        long endTime = System.currentTimeMillis();
        timeRecorder.recordTime("login", endTime - startTime);
        return user;
    }

    public boolean deleteUser(int id) {
        long startTime = System.currentTimeMillis();
        boolean success = userDao.deleteUserById(id);
        long endTime = System.currentTimeMillis();
        timeRecorder.recordTime("deleteUser", endTime - startTime);
        return success;
    }

    public User getUser(int id) {
        long startTime = System.currentTimeMillis();
        User user = userDao.getUserById(id);
        long endTime = System.currentTimeMillis();
        timeRecorder.recordTime("getUser", endTime - startTime);
        return user;
    }
}
```

```java
public interface UserDAO {
    User getUserByUsernameAndPassword(String username, String password);
    boolean deleteUserById(int id);
    User getUserById(int id);
}
```

```java
public class UserDAOImpl implements UserDAO {
    // 省略实现
}
```

```java
public class TimeRecorder {
    private Map<String, Long> times = new HashMap<>();

    public void recordTime(String method, long time) {
        times.put(method, time);
    }

    public void printTimes() {
        System.out.println("Method\tTime (ms)");
        for (Map.Entry<String, Long> entry : times.entrySet()) {
            System.out.println(entry.getKey() + "\t" + entry.getValue());
        }
    }
}
```

测试类：

```java
public class Test {
    public static void main(String[] args) {
        UserDAO userDao = new UserDAOImpl();
        TimeRecorder timeRecorder = new TimeRecorder();
        UserService userService = new UserServiceImpl(userDao, timeRecorder);

        // 测试登录功能
        User user = userService.login("admin", "admin");
        System.out.println(user);

        // 测试删除功能
        boolean success = userService.deleteUser(1);
        System.out.println(success);

        // 测试查询功能
        User user2 = userService.getUser(2);
        System.out.println(user2);

        // 输出各个方法的耗时
        timeRecorder.printTimes();
    }
}
```

可见大量重复的代码逻辑

**使用动态代理优化**

首先，我们需要定义一个动态代理处理器 TimeRecorderHandler，该处理器会拦截 UserServiceImpl 的所有方法，并在方法执行前后进行计时：

```java
public class TimeRecorderHandler implements InvocationHandler {
    private Object target;

    public TimeRecorderHandler(Object target) {
        this.target = target;
    }

    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = method.invoke(target, args);
        long endTime = System.currentTimeMillis();
        System.out.println(method.getName() + " took " + (endTime - startTime) + " ms");
        return result;
    }
}
```

接下来，我们修改 UserServiceImpl 类的构造函数，使用动态代理生成 UserService 接口的实现类：

```java
public class UserServiceImpl implements UserService {
    private UserDAO userDao;
    private UserService userService;

    public UserServiceImpl(UserDAO userDao) {
        this.userDao = userDao;
        this.userService = (UserService) Proxy.newProxyInstance(
                UserService.class.getClassLoader(),
                new Class[] { UserService.class },
                new TimeRecorderHandler(this)
        );
    }

    public User login(String username, String password) {
        return userDao.getUserByUsernameAndPassword(username, password);
    }

    public boolean deleteUser(int id) {
        return userDao.deleteUserById(id);
    }

    public User getUser(int id) {
        return userDao.getUserById(id);
    }
}
```

最后，我们可以创建测试类并调用 UserService 的各个方法来测试：

```java
public class Test {
    public static void main(String[] args) {
        UserDAO userDao = new UserDAOImpl();
        UserService userService = new UserServiceImpl(userDao);

        // 测试登录功能
        User user = userService.login("admin", "admin");
        System.out.println(user);

        // 测试删除功能
        boolean success = userService.deleteUser(1);
        System.out.println(success);

        // 测试查询功能
        User user2 = userService.getUser(2);
        System.out.println(user2);
    }
}
```

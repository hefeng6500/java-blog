# 注解

Java 注解（Annotation）是 JDK 5 引入的一个特性，它允许程序员在源代码中添加一些额外的元数据信息，**以便于编译器、工具或运行时环境做出相应的处理**。注解本身并不影响程序的逻辑，而是提供了一种与程序元素（如类、方法、字段等）关联的元数据信息。

## 自定义注解

```java
public @interface 注解名称 {
    public 属性类型 属性名() default 默认值;
}

```

- value属性，如果只有一个value属性的情况下，使用value属性的时候可以省略value名称不写!!, 如 `@MyAnnotation(value = "Hello World")`

- 但是如果有多个属性,  且多个属性没有默认值，那么value名称是不能省略的。

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.reflect.Method;

@Retention(RetentionPolicy.RUNTIME)
@interface MyAnnotation {
    String value();
}

class MyClass {
    @MyAnnotation(value = "Hello World")
    public void myMethod() {
        System.out.println("MyMethod is called");
    }
}

public class Main {
    public static void main(String[] args) throws NoSuchMethodException {
        Method method = MyClass.class.getMethod("myMethod");
        MyAnnotation annotation = method.getAnnotation(MyAnnotation.class);
        String value = annotation.value();
        System.out.println("Value of annotation: " + value);
    }
}

```

## 元注解

注解注解的注解

| 元注解      | 说明                          | 取值范围                                                     |
| ----------- | ----------------------------- | ------------------------------------------------------------ |
| @Target     | 指定注解的使用范围            | ElementType.ANNOTATION_TYPE（注解类型）<br/>ElementType.CONSTRUCTOR（构造函数）<br/>ElementType.FIELD（字段）<br/>ElementType.LOCAL_VARIABLE（局部变量）<br/>ElementType.METHOD（方法）<br/>ElementType.PACKAGE（包）<br/>ElementType.PARAMETER（参数）<br/>ElementType.TYPE（类型）等 |
| @Retention  | 指定注解的生命周期            | RetentionPolicy.SOURCE（源码级别，不会保留在编译后的字节码中）<br/>RetentionPolicy.CLASS（类文件级别，会保留在编译后的字节码中，但不会被加载到 JVM 中）<br/>RetentionPolicy.RUNTIME（运行时级别，会保留在编译后的字节码中，并被加载到 JVM 中） |
| @Documented | 指定注解是否包含在 JavaDoc 中 | 无                                                           |
| @Inherited  | 指定注解是否可以被子类继承    | 无                                                           |

### 注解解析

注解解析指的是使用 Java 反射技术获取已定义的注解，并从注解中提取信息以执行一些特定的操作。通常，我们可以通过以下步骤来解析注解：

1. 获取类、方法、字段等程序元素的元数据信息（如 Class、Method、Field 等）。
2. 判断该程序元素是否存在特定的注解，如果存在则获取该注解的实例对象。
3. 通过注解实例对象的属性来获取注解信息，然后根据注解信息执行相应的操作。

```java
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface MyAnnotation {
    String value();
    int num();
}

```

```java
public class AnnotationParser {
    public static void main(String[] args) throws Exception {
        // 获取方法对象
        Method method = AnnotationParser.class.getMethod("testMethod");
        // 判断方法是否有 @MyAnnotation 注解
        if (method.isAnnotationPresent(MyAnnotation.class)) {
            // 获取 @MyAnnotation 注解对象
            MyAnnotation annotation = method.getAnnotation(MyAnnotation.class);
            // 打印注解信息
            System.out.println("value = " + annotation.value() + ", num = " + annotation.num());
            // 根据注解信息执行操作
            System.out.println("执行 testMethod() 方法");
        }
    }

    @MyAnnotation(value = "test", num = 1)
    public void testMethod() {
    }
}

```

## 动态代理

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

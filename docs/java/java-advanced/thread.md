# 多线程

## 多线程的创建

1. 继承 Thread 类
   定义一个类，继承 Thread 类，并重写 run()方法，run()方法中是线程执行的代码。

```java
class MyThread extends Thread {
    public void run() {
        // 线程执行的代码
    }
}

// 创建并启动线程
MyThread thread = new MyThread();
thread.start();

```

2. 实现 Runnable 接口
   定义一个类实现 Runnable 接口，并重写 run()方法，run()方法中是线程执行的代码。然后创建 Thread 对象，并传入实现了 Runnable 接口的对象作为参数，调用 start()方法启动线程。

```java
class MyRunnable implements Runnable {
    public void run() {
        // 线程执行的代码
    }
}

// 创建并启动线程
MyRunnable runnable = new MyRunnable();
Thread thread = new Thread(runnable);
thread.start();

```

3. JDK 5.0 新增：实现 Callable 接口
   Callable 接口是一个泛型接口，它定义了一个名为 call()的方法，它可以在执行完后返回一个结果。和 Runnable 接口不同，它允许抛出异常。

```java
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

class MyCallable implements Callable<Integer> {
    @Override
    public Integer call() throws Exception {
        // 线程执行的代码
        return 1;
    }
}

// 创建并启动线程
MyCallable callable = new MyCallable();
FutureTask<Integer> futureTask = new FutureTask<>(callable);
Thread thread = new Thread(futureTask);
thread.start();

```



优缺点比较

| 方式             | 优点                                                         | 缺点                                                   |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| 继承Thread类     | 编程比较简单，可以直接使用Thread类中的方法                   | 扩展性较差，不能再继承其他的类，不能返回线程执行的结果 |
| 实现Runnable接口 | 扩展性强，实现该接口的同时还可以继承其他的类。               | 编程相对复杂，不能返回线程执行的结果                   |
| 实现Callable接口 | 扩展性强，实现该接口的同时还可以继承其他的类。可以得到线程执行的结果 | 编程相对复杂                                           |


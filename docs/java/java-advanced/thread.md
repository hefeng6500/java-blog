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

try {
    Integer result = futureTask.get();
    System.out.println("线程执行结果：" + result);
} catch (Exception e) {
    e.printStackTrace();
}

```

优缺点比较

| 方式             | 优点                                                         | 缺点                                                   |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| 继承Thread类     | 编程比较简单，可以直接使用Thread类中的方法                   | 扩展性较差，不能再继承其他的类，不能返回线程执行的结果 |
| 实现Runnable接口 | 扩展性强，实现该接口的同时还可以继承其他的类。               | 编程相对复杂，不能返回线程执行的结果                   |
| 实现Callable接口 | 扩展性强，实现该接口的同时还可以继承其他的类。可以得到线程执行的结果 | 编程相对复杂                                           |

## 常用方法

| 方法名          | 说明               | 用途                                |
| --------------- | ------------------ | ----------------------------------- |
| start()         | 启动线程           | 创建并启动一个新线程                |
| run()           | 线程执行的代码     | 线程启动后执行的代码                |
| join()          | 等待线程结束       | 主线程等待子线程执行完毕再继续执行  |
| sleep()         | 线程休眠           | 让线程休眠一定时间                  |
| interrupt()     | 中断线程           | 中断正在执行的线程                  |
| isInterrupted() | 判断线程是否被中断 | 判断线程是否被中断                  |
| yield()         | 让出CPU            | 让线程释放CPU，使其他线程有机会执行 |
| setPriority()   | 设置线程优先级     | 设置线程的优先级                    |
| getName()       | 获取线程名称       | 获取线程的名称                      |
| setName()       | 设置线程名称       | 设置线程的名称                      |

**join()**

让一个线程等待另一个线程执行完成后再继续执行。可以使用join()方法让主线程等待子线程执行完成，或者让一个线程等待其他线程执行完成。

```java
public class ThreadJoinExample extends Thread {
    public void run() {
        System.out.println("子线程开始执行");
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("子线程执行完毕");
    }
    public static void main(String[] args) throws InterruptedException {
        ThreadJoinExample thread = new ThreadJoinExample();
        thread.start();
        System.out.println("主线程开始执行");
        thread.join();
        System.out.println("主线程执行完毕");
    }
}
// 主线程开始执行
// 子线程开始执行

等待5s 

// 子线程执行完毕
// 主线程执行完毕

```

## 线程安全

Java线程安全是指多线程并发访问共享资源时，保证数据在多线程环境下的正确性和一致性。在多线程环境下，由于线程执行的先后顺序和执行时间的不确定性，可能会出现一些问题，如竞态条件（Race Condition）、死锁、内存泄漏等，这些问题都会导致程序出现不可预料的错误。因此，在多线程编程中，保证线程安全是非常重要的。

Java中提供了一些线程安全的机制，包括同步锁、volatile变量、原子类, Lock锁等。

1. **同步锁**

   同步锁是Java中最常用的线程安全机制，可以使用synchronized关键字来实现。同步锁可以保证同一时间只有一个线程可以访问共享资源，其他线程需要等待。同步锁的实现基于Java中的对象锁，当一个线程获取了该对象的锁时，其他线程必须等待锁的释放才能继续执行。

   ```java 
   public class SynchronizedExample {
       private int count = 0;
   
       public synchronized void increment() {
           count++;
       }
   
       public synchronized void decrement() {
           count--;
       }
   
       public synchronized int getCount() {
           return count;
       }
   }
   
   ```

   **同步代码块**

   同步代码块是一种使用synchronized关键字对某个代码块进行同步的机制，它可以将对共享资源的访问限制在同一时间内只有一个线程进行。

   一个同步代码块可以通过指定一个锁对象来实现同步。在进入同步代码块之前，线程必须先获得该锁对象的锁，当线程离开同步代码块时，它将释放该锁。

   ```java
   public class SynchronizedBlockExample {
       private int count = 0;
       private final Object lock = new Object();
   
       public void increment() {
           synchronized(lock) {
               count++;
           }
       }
   
       public void decrement() {
           synchronized(lock) {
               count--;
           }
       }
   
       public int getCount() {
           synchronized(lock) {
               return count;
           }
       }
   }
   
   ```

   锁对象的规范要求？

   1. 锁对象必须是一个引用类型的对象。
   2. 锁对象必须是final修饰的，以确保锁对象的引用不会发生变化。
   3. 锁对象必须是所有线程所共享的对象，即不能创建多个锁对象，每个线程使用自己的锁对象，否则就会出现线程间的同步问题。
   4. 锁对象必须是线程安全的，即在多线程环境下不会出现竞态条件的情况，可以使用一些线程安全的对象，如ConcurrentHashMap、AtomicInteger等作为锁对象。

2. **变量**

   volatile关键字可以保证线程之间的可见性，即一个线程修改了一个volatile变量的值，其他线程可以立即看到这个变化。这是因为volatile变量在修改时会立即同步到主内存中，而其他线程在访问时会先从主内存中读取该变量的最新值。

   ```java
   public class VolatileExample {
       private volatile int count = 0;
   
       public void increment() {
           count++;
       }
   
       public void decrement() {
           count--;
       }
   
       public int getCount() {
           return count;
       }
   }
   
   ```

3. **原子类**

   原子类是一种线程安全的类，可以在多线程环境下安全地对其进行操作，而不需要使用同步锁等机制。Java中提供了一些原子类，例如AtomicInteger、AtomicBoolean等，可以在多线程环境下安全地对其进行操作。

   ```java
   import java.util.concurrent.atomic.AtomicInteger;
   
   public class AtomicExample {
       private AtomicInteger count = new AtomicInteger(0);
   
       public void increment() {
           count.incrementAndGet();
       }
   
       public void decrement() {
           count.decrementAndGet();
       }
   
       public int getCount() {
           return count.get();
       }
   }
   ```

4. **Lock 锁**

   Lock锁是Java中的一个显式锁，可以用于控制多个线程对共享资源的访问。与隐式锁（即synchronized关键字）不同，Lock锁需要手动获取和释放，更加灵活，也更加安全。Lock锁最主要的实现类是ReentrantLock。

   ```java
   public class LockExample {
       private int count = 0;
       private final Lock lock = new ReentrantLock();
   
       public void increment() {
           lock.lock();
           try {
               count++;
           } finally {
               lock.unlock();
           }
       }
   
       public void decrement() {
           lock.lock();
           try {
               count--;
           } finally {
               lock.unlock();
           }
       }
   
       public int getCount() {
           lock.lock();
           try {
               return count;
           } finally {
               lock.unlock();
           }
       }
   }
   ```

   在这个例子中，使用ReentrantLock作为锁对象，通过调用lock()方法获取锁，使用try-finally代码块来确保锁的释放。increment、decrement和getCount方法都使用了锁，以保证线程安全。注意到在获取锁之后，必须使用try-finally语句块确保锁的释放，否则如果在获取锁之后发生异常，就会导致锁无法释放，从而出现死锁等问题。

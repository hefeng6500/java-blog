# Java 进阶

## static 关键字

修饰作用，可以被共享访问，修改

- 修饰静态成员

  ```java
  public class User {
      static String name;
      int age;
  }

  ```

- 修饰静态方法

  ```java
  public class Student {
      private String name;
      // 1. 实例方法: 无static修饰的，属于对象的
      public void study(){
      	System.out.println(name +  “在好好学习~~~”);
      }
      // 2. 静态方法：有static修饰，属于类和对象共享的
      public static int getMax(int a , int b){
          return a > b ? a : b;
      }
      public static void main(String[] args) {
          // 1. 类名.静态成员方法
          System.out.println(Student.getMax(10 , 2));
          // 注意：同一个类中访问静态成员类名可以不写
          System.out.println(getMax(2 , 10));
          // 2. 对象.实例成员方法
          // study(); // 会报错
          Student s = new  Student();
          s.name = "猪八戒";
          s.study();
          // 3. 对象.静态成员方法。（不推荐）
          System.out.println(s.getMax(20 , 10));
      }
  }
  
  ```

注意：

- 静态方法只能访问静态的成员，不可以直接访问实例成员。
- 实例方法可以访问静态的成员，也可以访问实例成员。
- 静态方法中是不可以出现 `this` 关键字的。
- 类名.静态成员变量(推荐)
- 对象.静态成员变量(不推荐)。



### static 应用

- 工具类

  特点：内部都是一些静态方法，每个方法完成一个功能；一次编写，处处可用，提高代码的重用性

- 代码块

  **静态代码块:** 
  格式：static{}
  特点：需要通过static关键字修饰，随着类的加载而加载，并且自动触发、只执行一次
  使用场景：在类加载的时候做一些静态数据初始化 的操作，以便后续使用。
  
   **构造代码块**（了解，见的少）：
  格式：{}
  特点：每次创建对象，调用构造器执行时，都会执行该代码块中的代码，并且在构造器执行前执行
  使用场景：初始化实例资源。

- 单例

​			饿汉单例：定义一个类，把构造器私有，定义一个静态变量存储一个对象

```java
/** a、定义一个单例类 */
public class SingleInstance {
    /** c.定义一个静态变量存储一个对象即可 :属于类，与类一起加载一次 */
    public static SingleInstance instance = new SingleInstance ();
    
    /** b.单例必须私有构造器*/
    private SingleInstance (){
    	System.out.println("创建了一个对象");
    }
}

```



​		懒汉单例：定义一个类，把构造器私有，定义一个静态变量存储一个对象，提供一个返回单例对象的方法

```java
/** 定义一个单例类 */
class SingleInstance{
    /** 定义一个静态变量存储一个对象即可 :属于类，与类一起加载一次 */
    public static SingleInstance instance ; // null
    /** 单例必须私有构造器*/
    private SingleInstance(){}
    /** 必须提供一个方法返回一个单例对象  */
    public static SingleInstance getInstance(){
        ...
       
        return ...;
    }
}
```


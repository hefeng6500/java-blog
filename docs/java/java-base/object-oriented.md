# 面向对象

## 成员属性、方法、构造器

```java
public class Test {
    public static void main(String[] args) {
          // 1、成员变量（代表属性,一般是名词)
          String name = "apple";
          double price = 99.99;

          // 2、成员方法（代表行为,一般是动词）
          public void start(){

          }
          public void run(){

          }

          // 3、构造器 （后几节再说）
          public Test(){}

          public Test(String name, double price){
            this.name = name;
            this.price = price;
          }

          // 4、代码块 （后面再学）
          // 5、内部类 （后面再学）
    }
```

创建类

```java
Test t = new Test("orange", 98.00);
System.out.println(t.name); // orange
System.out.println(t.price); // 98.00

```

- 无参数构造器：（默认存在的）：初始化对象时，成员变量的数据均采用默认值
- 有参数构造器：在初始化对象的时候，同时可以接收参数为对象进行赋值

## this 关键字

**出现在构造器和成员方法中，代表当前对象的地址。可以用于指定访问当前对象的成员。**

## 面向对象三大特征

- 封装
- 继承
- 多态

**封装**

如何正确设计对象的属性和方法。对象代表什么，就得封装对应的数据，并提供数据对应的行为。

优点：让编程变得很简单，有什么事，找对象，调方法就行。

**如何进行封装更好？**

成员变量使用 `private` (私有、隐藏)关键字修饰
为每个成员变量提供配套 `public` 修饰的的 `getter`、`setter` 方法暴露其取值和赋值

```java
public class Student {
    private int age;

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age >= 0 && age <= 200) {
            this.age = age;
        } else {
            System.out.println("请检查年龄数值!!");
        }
    }
}
```

### JavaBean(实体类)

JavaBean 是一种 JAVA 语言写成的可重用组件。JavaBean 符合一定规范编写的 Java 类，不是一种技术，而是一种规范

标准 JavaBean 规范：

- 成员变量使用 `private` 修饰
- 提供成员变量对应的 `setXxx()` / `getXxx()`方法
- 必须提供一个无参构造器；有参数构造器是可写可不写的
- 这个类应是可序列化的。实现 `serializable` 接口

### POJO(Plain Ordinary Java Object)

简单普通的 java 对象。主要用来指代那些没有遵循特定的 java 对象模型，约定或者框架的对象。

POJO 的内在含义是指那些:
有一些 `private` 的参数作为对象的属性，然后针对每一个参数定义 `get` 和 `set` 方法访问的接口。
没有从任何类继承、也没有实现任何接口，更没有被其它框架侵入的 java 对象。



### 示例：

> **需求**
> 使用面向对象编程，模仿电影信息的展示。
>
> 
>
> **分析**
> 一部电影是一个 Java 对象，需要先设计电影类，再创建电影对象。
> 三部电影对象可以采用数组存储起来。
> 依次遍历数组中的每个电影对象，取出其信息进行展示。



```java
public class Movie {
    private String name;
    private double score;
    private String actor;

    public Movie(String name, double score, String actor) {
        this.name = name;
        this.score = score;
        this.actor = actor;
    }

    public String getName() {
        return name;
    }

    public double getScore() {
        return score;
    }

    public String getActor() {
        return actor;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

}


```

```java
public class Main {
    public static void main(String[] args) {
        Movie[] movies = new Movie[3];
        movies[0] = new Movie("《长津湖》", 9.7, "吴京");
        movies[1] = new Movie("《我和我的父辈》", 9.6, "吴京");
        movies[2] = new Movie("《扑水少年》", 9.5, "王川");

        for (int i = 0; i < movies.length; i++) {
            Movie movie = movies[i];
            System.out.println("片名：" + movie.getName());
            System.out.println("评分：" + movie.getScore());
            System.out.println("主演：" + movie.getActor());
        }
    }
}
```

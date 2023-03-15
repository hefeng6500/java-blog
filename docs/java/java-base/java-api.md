# 常用 API

**API: Application Programming Interface,应用程序编程接口**

Java API 文档 Java 8：https://docs.oracle.com/javase/8/docs/api/index.html

Java API 文档 Java 19：https://docs.oracle.com/en/java/javase/19/docs/api/index.html

## String

`java.lang.String` 类代表字符串，`String` 类定义的变量可以用于指向字符串对象

```java
 String string = "Hello World!";
```

特点：

- **String 其实常被称为不可变字符串类型，它的对象在创建后不能被更改。**
- **以 "" 方式给出的字符串对象，在字符串常量池中存储，而且相同内容只会在其中存储一份**
- **通过构造器 new 对象，每 new 一次都会产生一个新对象，保存在堆内存中**

```java
public static void main(String[] args) {
  String name = "传智";
  name += "教育";
  name +="中心";
  System.out.println(name);
}
```

![](./assets/4.png)

"传智"，"教育"，"中心" 都存储在字符串常量池中是不能更改的，`String` 变量每次的修改其实都是产生并指向了新的字符串对象。

### 字符串内容比较

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String sysLoginName = "itheima";
        Scanner sc = new Scanner(System.in);
        System.out.println("请您输入您的登录名称");

        String loginName = sc.next();
        System.out.println(sysLoginName == loginName); // false
    }
}

```

字符串的内容比较不适合用 "==" 比较

```java
public class String01 {
    public static void main(String[] args) {
        String s1 = new String("Hello");
        String s2 = "Hello";

        System.out.println(s1.equals(s2));
        System.out.println(s1 == s2);
    }
}
```

| 方法名                                                 | 说明                                                                         |
| ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| public boolean equals (Object anObject)                | 将此字符串与指定对象进行比较。只关心字符内容是否一致！                       |
| public boolean equalsIgnoreCase (String anotherString) | 将此字符串与指定对象进行比较，忽略大小写比较字符串。只关心字符内容是否一致！ |
| ==                                                     | 内存地址相等                                                                 |

示例：

```java
  String s1 = "abc";
  String s2 = "ab";
  String s3 = s2 + "c";

  System.out.println(s1 == s3); // false
```

虽然字符串相同，但是内存地址不相同

**特例：**

```java
  String s1 = "abc";
  String s2 = "a" + "b" + "c";
  System.out.println(s1 == s2); // true
```

**Java 存在编译优化机制，程序在编译时："a" + "b" + "c" 会直接转成 "abc"**

## ArrayList

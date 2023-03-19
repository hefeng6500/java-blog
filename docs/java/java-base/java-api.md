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



**API**

| 方法名                                                       | 说明                                                     |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| public int length()                                          | 返回此字符串的长度                                       |
| public char charAt(int index)                                | 获取某个索引位置处的字符                                 |
| public char[] toCharArray()：                                | 将当前字符串转换成字符数组返回                           |
| public String substring(int beginIndex, int endIndex)        | 根据开始和结束索引进行截取，得到新的字符串（包前不包后） |
| public String substring(int beginIndex)                      | 从传入的索引处截取，截取到末尾，得到新的字符串           |
| public String replace(CharSequence target, CharSequence replacement) | 使用新值，将字符串中的旧值替换，得到新的字符串           |
| public String[] split(String regex)                          | 根据传入的规则切割字符串，得到字符串数组返回             |



## ArrayList

**数组**： 类型确定，长度固定
**集合**：集合的大小不固定，启动后可以动态变化，类型也可以选择不固定



```java
import java.util.ArrayList;

public class ArrayList01 {
    public static void main(String[] args) {
        ArrayList arrayList = new ArrayList<>();

        arrayList.add("Hello");
        arrayList.add("World");
        arrayList.add(100);
        arrayList.add(99.99);
        arrayList.add(true);
        arrayList.add(1, "测试");

        System.out.println(arrayList);
    }
}
```



| 方法名                               | 说明                               |
| ------------------------------------ | ---------------------------------- |
| public boolean add(E e)              | 将指定的元素追加到此集合的末尾     |
| public void add(int index,E element) | 在此集合中的指定位置插入指定的元素 |
|                                      |                                    |

集合对象的**泛型**

```java
import java.util.ArrayList;

public class ArrayList02 {
    public static void main(String[] args) {
        ArrayList<String> arrayList = new ArrayList<>();

        arrayList.add("Hello");
        arrayList.add("world");
//        arrayList.add(1); 编译时报错


        ArrayList<Integer> arrayList1 = new ArrayList<>();
//        ArrayList<int> arrayList1 = new ArrayList<>(); 编译时报错

        arrayList1.add(12);
    }
}

```

泛型只能支持引用数据类型，不支持基本数据类型



ArrayList 常用方法

| 方法名称                          | 说明                                   |
| --------------------------------- | -------------------------------------- |
| public E get(int index)           | 返回指定索引处的元素                   |
| public int size()                 | 返回集合中的元素的个数                 |
| public E remove(int index)        | 删除指定索引处的元素，返回被删除的元素 |
| public boolean remove(Object o)   | 删除指定的元素，返回删除是否成功       |
| public E set(int index,E element) | 修改指定索引处的元素，返回被修改的元素 |


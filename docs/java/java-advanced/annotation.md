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

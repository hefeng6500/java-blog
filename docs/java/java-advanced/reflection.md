# 反射

反射是指在程序运行时，可以通过程序获取任意一个类的内部信息，并能够直接操作该类的内部属性和方法。Java反射机制是在Java虚拟机(JVM)中实现的，通过它可以在程序运行时动态地加载类、调用类的方法、访问和设置类的成员变量。



**特点：**

- 编译成Class文件进入运行阶段的时候，泛型会自动擦除
- 反射是作用在运行时的技术，此时已经不存在泛型了。



**反射的作用？**

- 可以在运行时得到一个类的全部成分然后操作。

- 可以破坏封装性。（很突出）

- 也可以破坏泛型的约束性。（很突出）

- 更重要的用途是适合：做Java高级框架

- 基本上主流框架都会基于反射设计一些通用技术功能。



**demo**

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ReflectDemo {
    public static void main(String[] args) {
        try {
            // 获取类的Class对象
            Class<?> clazz = Class.forName("com.example.User");

            // 获取类的所有构造方法
            Constructor<?>[] constructors = clazz.getDeclaredConstructors();
            System.out.println("Class的构造方法：");
            for (Constructor<?> constructor : constructors) {
                System.out.println(constructor);
            }

            // 创建对象实例
            System.out.println("\n创建对象实例：");
            Object obj = clazz.newInstance();
            System.out.println("创建的对象实例：" + obj);

            // 获取类的所有方法
            System.out.println("\nClass的方法：");
            Method[] methods = clazz.getDeclaredMethods();
            for (Method method : methods) {
                System.out.println(method);
            }

            // 调用指定方法
            System.out.println("\n调用setName方法：");
            Method setNameMethod = clazz.getDeclaredMethod("setName", String.class);
            setNameMethod.invoke(obj, "Tom");

            // 访问指定属性
            System.out.println("\n访问age属性：");
            Field ageField = clazz.getDeclaredField("age");
            ageField.setAccessible(true);
            ageField.set(obj, 18);
            System.out.println("age属性的值：" + ageField.get(obj));

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```

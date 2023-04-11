# 单元测试

 单元测试的基本步骤：

1. 导入 JUnit 框架

   在项目根目录下创建一个名为 “lib” 的文件夹，将 JUnit 库文件复制到“lib”文件夹中，选中lib下导入的 junit，右键，作为 library

   下载地址：

   - JUnit 4: <https://github.com/junit-team/junit4/wiki/Download-and-Install>
   - JUnit 5: <https://github.com/junit-team/junit5/releases>

2. 创建测试类

   ```java
   package com.yang.test;
   
   public class Calculator {
       public int add(int a, int b) {
           return a + b;
       }
   
       public int reduce(int a, int b) {
           return a - b;
       }
   }
   ```

   ```java
   package com.yang.test;
   
   import org.junit.*;
   
   import static org.junit.Assert.assertEquals;
   
   public class CalculatorTest {
   
       @Test
       public void testAdd() {
           Calculator calculator = new Calculator();
   
           int result = calculator.add(2, 3);
   
           assertEquals(5, result);
           System.out.println("add 执行完毕！");
       }
   
       @Test
       public void testReduce() {
           Calculator calculator = new Calculator();
   
           int result = calculator.reduce(6, 3);
   
           assertEquals(3, result);
           System.out.println("reduce 执行完毕！");
       }
   
       @Before
       public void testBefore() {
           System.out.println("用来修饰实例方法，该方法会在每一个测试方法执行之前执行一次。\n");
       }
   
       @After
       public void testAfter() {
           System.out.println("用来修饰实例方法，该方法会在每一个测试方法执行之后执行一次。");
       }
   
       @BeforeClass
       public static void testBeforeClass() {
           System.out.println("用来静态修饰方法，该方法会在所有测试方法之前只执行一次。");
       }
   
       @AfterClass
       public static void testAfterClass() {
           System.out.println("用来静态修饰方法，该方法会在所有测试方法之后只执行一次。\n");
       }
   }
    // 用来静态修饰方法，该方法会在所有测试方法之前只执行一次。

    // 用来修饰实例方法，该方法会在每一个测试方法执行之前执行一次。

    // add 执行完毕！
    // 用来修饰实例方法，该方法会在每一个测试方法执行之后执行一次。
    // 用来修饰实例方法，该方法会在每一个测试方法执行之前执行一次。

    // reduce 执行完毕！
    // 用来修饰实例方法，该方法会在每一个测试方法执行之后执行一次。
    // 用来静态修饰方法，该方法会在所有测试方法之后只执行一次。
   ```

3. 运行测试

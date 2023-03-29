# 日志

Java 日志是记录应用程序运行时状态和异常信息的一种机制。Java 提供了多个日志框架，包括 Java 自带的 `java.util.logging`、`Log4j`、`Logback` 等。

## java 日志框架发展背景

1. **最初的 System.out.println:** 在 Java 刚开始出现时，开发者通常使用 System.out.println 来输出日志信息。这种方式简单易用，但不够灵活，不能满足大规模应用的需求。

2. **JDK1.4 引入 java.util.logging:** JDK1.4 引入了 `java.util.logging` 框架，该框架提供了更加灵活和可配置的日志功能，可以输出多种级别的日志信息，并支持日志的过滤、格式化、存储等操作。但该框架在使用上较为繁琐，需要编写大量的配置代码。

3. **Log4j 的出现：** Apache Log4j 是一个第三方的 Java 日志框架，它于 2001 年首次发布，提供了更加简单易用、灵活性强的日志功能。Log4j 支持多种输出方式，可以灵活地配置日志的格式和级别，并提供了灵活的过滤器机制。Log4j 很快成为了 Java 开发中最受欢迎的日志框架之一。

4.**SLF4J 和 Logback 的出现：** 由于 Log4j 1.x 版本的性能和稳定性问题，Log4j 开发团队推出了 Log4j 2.x 版本，但该版本在向后兼容性上存在问题，因此 SLF4J（Simple Logging Facade for Java）框架应运而生。SLF4J 提供了一套简单的 API，可以和多种不同的日志实现进行绑定，比如 Log4j、`java.util.logging` 等。同时，Logback 是由 Log4j 的原始开发者 Ceki Gülcü 开发的一款新的日志框架，它提供了高性能、可靠性强、灵活易用的日志功能，目前已经成为了 SLF4J 的默认实现。

5. **JDK1.4 引入 j.u.l 和 JDK9 引入 j.u.l.Loggers：** 随着 JDK1.4 引入了 `java.util.logging`，开发人员可以直接使用 JDK 自带的日志框架，而不需要引入其他第三方库。JDK 9 中引入了 j.u.l.Loggers 支持对 logger 配置的缩小作用范围。这些功能的引入使得 j.u.l 成为一个更为强大和灵活的日志框架。

## Logback 日志框架

https://logback.qos.ch

Logback 是由 Log4j 的原始开发者 Ceki Gülcü 开发的一款 Java 日志框架，它是 SLF4J 的默认实现。Logback 可以作为 Log4j 的替代品，提供了高性能、可靠性强、灵活易用的日志功能。

Logback 框架包括三个组件：

| 组件名称        | 功能描述                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| logback-core    | 日志框架的核心组件，提供了日志输出的基本功能，比如日志级别、格式化等。                                              |
| logback-classic | 基于 logback-core 开发的组件，提供了和 Log4j 兼容的 API，并且可以通过配置文件或编程方式对日志输出进行细粒度的控制。 |
| logback-access  | 提供了对 HTTP 请求的日志记录，可以记录访问时间、访问者 IP 等信息。                                                  |

Logback 具有以下特点：

- 高性能：Logback 使用异步日志记录，可以减少日志输出对应用程序的影响。同时，Logback 还支持条件日志记录，可以根据需要选择是否记录日志。

- 灵活易用：Logback 支持多种输出方式，比如控制台、文件、邮件等。同时，Logback 可以通过配置文件或编程方式对日志输出进行细粒度的控制。

- 可靠性强：Logback 可以在运行时动态改变日志配置，同时还提供了失败重试、日志备份等机制，可以保证日志记录的可靠性

## 快速入门

1. 导入 Logback 框架到项目中去。在项目下新建文件夹 lib，导入 Logback 的 jar 包到该文件夹下

2. 将存放 jar 文件的 lib 文件夹添加到项目依赖库中去。

   - logback-classic-1.2.3.jar
   - logback-core-1.2.3.jar
   - slf4j-api-1.7.26.jar

3. 将 Logback 的核心配置文件 logback.xml 直接拷贝到 src 目录下（必须是 src 下）

4. 创建 Logback 框架提供的 Logger 日志对象，后续使用其方法记录系统的日志信息。

logback.xml 配置如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!--
        CONSOLE ：表示当前的日志信息是可以输出到控制台的。
    -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <!--输出流对象 默认 System.out 改为 System.err-->
        <target>System.out</target>
        <encoder>
            <!--格式化输出：%d表示日期，%thread表示线程名，%-5level：级别从左显示5个字符宽度
                %msg：日志消息，%n是换行符-->
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%-5level]  %c [%thread] : %msg%n</pattern>
        </encoder>
    </appender>

    <!-- File是输出的方向通向文件的 -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
            <charset>utf-8</charset>
        </encoder>
        <!--日志输出路径-->
        <file>D:/code/itheima-data.log</file>
        <!--指定日志文件拆分和压缩规则-->
        <rollingPolicy
                class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!--通过指定压缩文件名称，来确定分割文件方式-->
            <fileNamePattern>D:/code/itheima-data2-%d{yyyy-MMdd}.log%i.gz</fileNamePattern>
            <!--文件拆分大小-->
            <maxFileSize>1MB</maxFileSize>
        </rollingPolicy>
    </appender>

    <!--

    level:用来设置打印级别，大小写无关：TRACE, DEBUG, INFO, WARN, ERROR, ALL 和 OFF
   ， 默认debug
    <root>可以包含零个或多个<appender-ref>元素，标识这个输出位置将会被本日志级别控制。
    -->
    <root level="ALL">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE" />
    </root>
</configuration>
```

示例：

```java
package com.yang.logback;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Test {

    //    创建 Logback 日志对象，代表日志技术
    public static final Logger LOGGER = LoggerFactory.getLogger("Test.class");

    public static void main(String[] args) {
        LOGGER.info("Hello");
        LOGGER.debug("debugger");

        LOGGER.error("Error message");
        LOGGER.trace("trace");

        try {
            int a = 10;
            int b = 0;

            System.out.println(a / b);
        } catch (Exception e) {
            e.printStackTrace();
            LOGGER.error(e.toString());
        }
    }
}

```

### 日志级别

TRACE < DEBUG < INFO < WARN < ERROR; 默认级别是 DEBUG，对应其方法
当在 `logback.xml` 文件中设置了某种日志级别后，系统将只输出当前级别，以及高于当前级别的日志。

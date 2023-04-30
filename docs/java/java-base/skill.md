# Java 技巧

### 1. windows 本地多个版本 Java 之间如何切换?

答：修改系统环境变量

```text
# 需要把这两行放在下面两行之前，就可以手动配置 java 版本
%JAVA_HOME%\bin;
%JAVA_HOME%\jre\bin;

C:\Program Files\Common Files\Oracle\Java\javapath;
C:\Program Files (x86)\Common Files\Oracle\Java\javapath;
```

再设置 JAVA_HOME 地址

```text
# 比方设置 java 17 版本
C:\Program Files\Java\jdk-17
```

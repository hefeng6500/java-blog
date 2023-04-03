# File

Java 中的 File 类代表文件或目录的抽象路径名

- 绝对路径：从盘符开始
  ```java
  File file1 = new File("D:\\dir\\a.txt");
  ```
- 相对路径：不带盘符，默认直接到当前工程下的目录寻找文件

  ```java
  File file3 = new File("dir\\a.txt");
  ```

示例：

```java
// 创建文件
File file = new File("test.txt");
file.createNewFile();
file.delete();

// 创建文件夹
File file1 = new File("dirname");
file1.mkdir();
file1.delete();

File dir = new File("testDirname");
dir.mkdir();

File newFile = new File("./testDirname/hello.txt");
File newFile1 = new File("./testDirname/world.txt");

newFile.createNewFile();
newFile1.createNewFile();

String[] fileList = dir.list();

System.out.println(fileList.length);

// 遍历文件夹下的文件
File[] files = dir.listFiles();

for (File fileItem : files) {
    System.out.println(fileItem.getName());
}

// 重命名
File newFile2 = new File("./testDirname/newname.txt");
newFile.renameTo(newFile2);

File[] files2 = dir.listFiles();
for (File fileItem : files2) {
    System.out.println(fileItem.getName());
}
```

**递归遍历子目录**

```java
public static void listFiles(File dir) {
    File[] files = dir.listFiles();
    for (File file : files) {
        if (file.isDirectory()) {
            listFiles(file); // 递归遍历子目录
        } else {
            System.out.println(file.getName()); // 输出文件名
        }
    }
}

```

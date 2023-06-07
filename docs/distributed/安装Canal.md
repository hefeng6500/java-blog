# 安装和配置 Canal

下面我们就开启 mysql 的主从同步机制，让 Canal 来模拟 salve

# 1.开启 MySQL 主从

Canal 是基于 MySQL 的主从同步功能，因此必须先开启 MySQL 的主从功能才可以。

这里以之前用 Docker 运行的 mysql 为例：

## 1.1.开启 binlog

打开 mysql 容器挂载的日志文件，我的在`/tmp/mysql/conf`目录:

![image-20210813153241537](assets/image-20210813153241537.png)

修改文件：

```sh
vi /tmp/mysql/conf/my.cnf
```

添加内容：

```ini
log-bin=/var/lib/mysql/mysql-bin
binlog-do-db=heima
```

配置解读：

- `log-bin=/var/lib/mysql/mysql-bin`：设置 binary log 文件的存放地址和文件名，叫做 mysql-bin
- `binlog-do-db=heima`：指定对哪个 database 记录 binary log events，这里记录 heima 这个库

最终效果：

```ini
[mysqld]
skip-name-resolve
character_set_server=utf8
datadir=/var/lib/mysql
server-id=1000
log-bin=/var/lib/mysql/mysql-bin
binlog-do-db=heima
```

## 1.2.设置用户权限

接下来添加一个仅用于数据同步的账户，出于安全考虑，这里仅提供对 heima 这个库的操作权限。

```sql
create user canal@'%' IDENTIFIED by 'canal';
GRANT SELECT, REPLICATION SLAVE, REPLICATION CLIENT,SUPER ON *.* TO 'canal'@'%' identified by 'canal';
FLUSH PRIVILEGES;
```

重启 mysql 容器即可

```
docker restart mysql
```

测试设置是否成功：在 mysql 控制台，或者 Navicat 中，输入命令：

```
show master status;
```

![image-20200327094735948](assets/image-20200327094735948.png)

# 2.安装 Canal

## 2.1.创建网络

我们需要创建一个网络，将 MySQL、Canal、MQ 放到同一个 Docker 网络中：

```sh
docker network create heima
```

让 mysql 加入这个网络：

```sh
docker network connect heima mysql
```

## 2.3.安装 Canal

课前资料中提供了 canal 的镜像压缩包:

![image-20210813161804292](assets/image-20210813161804292.png)

大家可以上传到虚拟机，然后通过命令导入：

```
docker load -i canal.tar
```

然后运行命令创建 Canal 容器：

```sh
docker run -p 11111:11111 --name canal \
-e canal.destinations=heima \
-e canal.instance.master.address=mysql:3306  \
-e canal.instance.dbUsername=canal  \
-e canal.instance.dbPassword=canal  \
-e canal.instance.connectionCharset=UTF-8 \
-e canal.instance.tsdb.enable=true \
-e canal.instance.gtidon=false  \
-e canal.instance.filter.regex=heima\\..* \
--network heima \
-d canal/canal-server:v1.1.5
```

说明:

- `-p 11111:11111`：这是 canal 的默认监听端口
- `-e canal.instance.master.address=mysql:3306`：数据库地址和端口，如果不知道 mysql 容器地址，可以通过`docker inspect 容器id`来查看
- `-e canal.instance.dbUsername=canal`：数据库用户名
- `-e canal.instance.dbPassword=canal` ：数据库密码
- `-e canal.instance.filter.regex=`：要监听的表名称

表名称监听支持的语法：

```
mysql 数据解析关注的表，Perl正则表达式.
多个正则之间以逗号(,)分隔，转义符需要双斜杠(\\)
常见例子：
1.  所有表：.*   or  .*\\..*
2.  canal schema下所有表： canal\\..*
3.  canal下的以canal打头的表：canal\\.canal.*
4.  canal schema下的一张表：canal.test1
5.  多个规则组合使用然后以逗号隔开：canal\\..*,mysql.test1,mysql.test2
```

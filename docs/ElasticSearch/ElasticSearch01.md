# 分布式搜索引擎 01

-- elasticsearch 基础

# 0.学习目标

# 1.初识 elasticsearch

## 1.1.了解 ES

### 1.1.1.elasticsearch 的作用

elasticsearch 是一款非常强大的开源搜索引擎，具备非常多强大功能，可以帮助我们从海量数据中快速找到需要的内容

例如：

- 在 GitHub 搜索代码

  ![image-20210720193623245](assets/image-20210720193623245.png){data-zoomable}

- 在电商网站搜索商品

  ![image-20210720193633483](assets/image-20210720193633483.png){data-zoomable}

- 在百度搜索答案

  ![image-20210720193641907](assets/image-20210720193641907.png){data-zoomable}

- 在打车软件搜索附近的车

  ![image-20210720193648044](assets/image-20210720193648044.png){data-zoomable}

### 1.1.2.ELK 技术栈

elasticsearch 结合 kibana、Logstash、Beats，也就是 elastic stack（ELK）。被广泛应用在日志数据分析、实时监控等领域：

![image-20210720194008781](assets/image-20210720194008781.png){data-zoomable}

而 elasticsearch 是 elastic stack 的核心，负责存储、搜索、分析数据。

![image-20210720194230265](assets/image-20210720194230265.png){data-zoomable}

### 1.1.3.elasticsearch 和 lucene

elasticsearch 底层是基于**lucene**来实现的。

**Lucene**是一个 Java 语言的搜索引擎类库，是 Apache 公司的顶级项目，由 DougCutting 于 1999 年研发。官网地址：https://lucene.apache.org/ 。

![image-20210720194547780](assets/image-20210720194547780.png){data-zoomable}

**elasticsearch**的发展历史：

- 2004 年 Shay Banon 基于 Lucene 开发了 Compass
- 2010 年 Shay Banon 重写了 Compass，取名为 Elasticsearch。

![image-20210720195001221](assets/image-20210720195001221.png){data-zoomable}

### 1.1.4.为什么不是其他搜索技术？

目前比较知名的搜索引擎技术排名：

![image-20210720195142535](assets/image-20210720195142535.png){data-zoomable}

虽然在早期，Apache Solr 是最主要的搜索引擎技术，但随着发展 elasticsearch 已经渐渐超越了 Solr，独占鳌头：

![image-20210720195306484](assets/image-20210720195306484.png){data-zoomable}

### 1.1.5.总结

什么是 elasticsearch？

- 一个开源的分布式搜索引擎，可以用来实现搜索、日志统计、分析、系统监控等功能

什么是 elastic stack（ELK）？

- 是以 elasticsearch 为核心的技术栈，包括 beats、Logstash、kibana、elasticsearch

什么是 Lucene？

- 是 Apache 的开源搜索引擎类库，提供了搜索引擎的核心 API

## 1.2.倒排索引

倒排索引的概念是基于 MySQL 这样的正向索引而言的。

### 1.2.1.正向索引

那么什么是正向索引呢？例如给下表（tb_goods）中的 id 创建索引：

![image-20210720195531539](assets/image-20210720195531539.png){data-zoomable}

如果是根据 id 查询，那么直接走索引，查询速度非常快。

但如果是基于 title 做模糊查询，只能是逐行扫描数据，流程如下：

1）用户搜索数据，条件是 title 符合`"%手机%"`

2）逐行获取数据，比如 id 为 1 的数据

3）判断数据中的 title 是否符合用户搜索条件

4）如果符合则放入结果集，不符合则丢弃。回到步骤 1

逐行扫描，也就是全表扫描，随着数据量增加，其查询效率也会越来越低。当数据量达到数百万时，就是一场灾难。

### 1.2.2.倒排索引

倒排索引中有两个非常重要的概念：

- 文档（`Document`）：用来搜索的数据，其中的每一条数据就是一个文档。例如一个网页、一个商品信息
- 词条（`Term`）：对文档数据或用户搜索数据，利用某种算法分词，得到的具备含义的词语就是词条。例如：我是中国人，就可以分为：我、是、中国人、中国、国人这样的几个词条

**创建倒排索引**是对正向索引的一种特殊处理，流程如下：

- 将每一个文档的数据利用算法分词，得到一个个词条
- 创建表，每行数据包括词条、词条所在文档 id、位置等信息
- 因为词条唯一性，可以给词条创建索引，例如 hash 表结构索引

如图：

![image-20210720200457207](assets/image-20210720200457207.png){data-zoomable}

倒排索引的**搜索流程**如下（以搜索"华为手机"为例）：

1）用户输入条件`"华为手机"`进行搜索。

2）对用户输入内容**分词**，得到词条：`华为`、`手机`。

3）拿着词条在倒排索引中查找，可以得到包含词条的文档 id：1、2、3。

4）拿着文档 id 到正向索引中查找具体文档。

如图：

![image-20210720201115192](assets/image-20210720201115192.png){data-zoomable}

虽然要先查询倒排索引，再查询倒排索引，但是无论是词条、还是文档 id 都建立了索引，查询速度非常快！无需全表扫描。

### 1.2.3.正向和倒排

那么为什么一个叫做正向索引，一个叫做倒排索引呢？

- **正向索引**是最传统的，根据 id 索引的方式。但根据词条查询时，必须先逐条获取每个文档，然后判断文档中是否包含所需要的词条，是**根据文档找词条的过程**。

- 而**倒排索引**则相反，是先找到用户要搜索的词条，根据词条得到保护词条的文档的 id，然后根据 id 获取文档。是**根据词条找文档的过程**。

是不是恰好反过来了？

那么两者方式的优缺点是什么呢？

**正向索引**：

- 优点：
  - 可以给多个字段创建索引
  - 根据索引字段搜索、排序速度非常快
- 缺点：
  - 根据非索引字段，或者索引字段中的部分词条查找时，只能全表扫描。

**倒排索引**：

- 优点：
  - 根据词条搜索、模糊搜索时，速度非常快
- 缺点：
  - 只能给词条创建索引，而不是字段
  - 无法根据字段做排序

## 1.3.es 的一些概念

elasticsearch 中有很多独有的概念，与 mysql 中略有差别，但也有相似之处。

### 1.3.1.文档和字段

elasticsearch 是面向**文档（Document）**存储的，可以是数据库中的一条商品数据，一个订单信息。文档数据会被序列化为 json 格式后存储在 elasticsearch 中：

![image-20210720202707797](assets/image-20210720202707797.png){data-zoomable}

而 Json 文档中往往包含很多的**字段（Field）**，类似于数据库中的列。

### 1.3.2.索引和映射

**索引（Index）**，就是相同类型的文档的集合。

例如：

- 所有用户文档，就可以组织在一起，称为用户的索引；
- 所有商品的文档，可以组织在一起，称为商品的索引；
- 所有订单的文档，可以组织在一起，称为订单的索引；

![image-20210720203022172](assets/image-20210720203022172.png){data-zoomable}

因此，我们可以把索引当做是数据库中的表。

数据库的表会有约束信息，用来定义表的结构、字段的名称、类型等信息。因此，索引库中就有**映射（mapping）**，是索引中文档的字段约束信息，类似表的结构约束。

### 1.3.3.mysql 与 elasticsearch

我们统一的把 mysql 与 elasticsearch 的概念做一下对比：

| **MySQL** | **Elasticsearch** | **说明**                                                                           |
| --------- | ----------------- | ---------------------------------------------------------------------------------- |
| Table     | Index             | 索引(index)，就是文档的集合，类似数据库的表(table)                                 |
| Row       | Document          | 文档（Document），就是一条条的数据，类似数据库中的行（Row），文档都是 JSON 格式    |
| Column    | Field             | 字段（Field），就是 JSON 文档中的字段，类似数据库中的列（Column）                  |
| Schema    | Mapping           | Mapping（映射）是索引中文档的约束，例如字段类型约束。类似数据库的表结构（Schema）  |
| SQL       | DSL               | DSL 是 elasticsearch 提供的 JSON 风格的请求语句，用来操作 elasticsearch，实现 CRUD |

是不是说，我们学习了 elasticsearch 就不再需要 mysql 了呢？

并不是如此，两者各自有自己的擅长支出：

- Mysql：擅长事务类型操作，可以确保数据的安全和一致性

- Elasticsearch：擅长海量数据的搜索、分析、计算

因此在企业中，往往是两者结合使用：

- 对安全性要求较高的写操作，使用 mysql 实现
- 对查询性能要求较高的搜索需求，使用 elasticsearch 实现
- 两者再基于某种方式，实现数据的同步，保证一致性

![image-20210720203534945](assets/image-20210720203534945.png){data-zoomable}

## 1.4.安装 es、kibana

### 1.4.1.安装

[安装 elasticsearch](./install-elasticsearch.md)

### 1.4.2.分词器

[安装 elasticsearch](./install-elasticsearch.md)

### 1.4.3.总结

分词器的作用是什么？

- 创建倒排索引时对文档分词
- 用户搜索时，对输入的内容分词

IK 分词器有几种模式？

- ik_smart：智能切分，粗粒度
- ik_max_word：最细切分，细粒度

IK 分词器如何拓展词条？如何停用词条？

- 利用 config 目录的 IkAnalyzer.cfg.xml 文件添加拓展词典和停用词典
- 在词典中添加拓展词条或者停用词条

# 2.索引库操作

索引库就类似数据库表，mapping 映射就类似表的结构。

我们要向 es 中存储数据，必须先创建“库”和“表”。

## 2.1.mapping 映射属性

mapping 是对索引库中文档的约束，常见的 mapping 属性包括：

- type：字段数据类型，常见的简单类型有：
  - 字符串：text（可分词的文本）、keyword（精确值，例如：品牌、国家、ip 地址）
  - 数值：long、integer、short、byte、double、float、
  - 布尔：boolean
  - 日期：date
  - 对象：object
- index：是否创建索引，默认为 true
- analyzer：使用哪种分词器
- properties：该字段的子字段

例如下面的 json 文档：

```json
{
  "age": 21,
  "weight": 52.1,
  "isMarried": false,
  "info": "黑马程序员Java讲师",
  "email": "zy@itcast.cn",
  "score": [99.1, 99.5, 98.9],
  "name": {
    "firstName": "云",
    "lastName": "赵"
  }
}
```

对应的每个字段映射（mapping）：

- age：类型为 integer；参与搜索，因此需要 index 为 true；无需分词器
- weight：类型为 float；参与搜索，因此需要 index 为 true；无需分词器
- isMarried：类型为 boolean；参与搜索，因此需要 index 为 true；无需分词器
- info：类型为字符串，需要分词，因此是 text；参与搜索，因此需要 index 为 true；分词器可以用 ik_smart
- email：类型为字符串，但是不需要分词，因此是 keyword；不参与搜索，因此需要 index 为 false；无需分词器
- score：虽然是数组，但是我们只看元素的类型，类型为 float；参与搜索，因此需要 index 为 true；无需分词器
- name：类型为 object，需要定义多个子属性
  - name.firstName；类型为字符串，但是不需要分词，因此是 keyword；参与搜索，因此需要 index 为 true；无需分词器
  - name.lastName；类型为字符串，但是不需要分词，因此是 keyword；参与搜索，因此需要 index 为 true；无需分词器

## 2.2.索引库的 CRUD

这里我们统一使用 Kibana 编写 DSL 的方式来演示。

### 2.2.1.创建索引库和映射

#### 基本语法：

- 请求方式：PUT
- 请求路径：/索引库名，可以自定义
- 请求参数：mapping 映射

格式：

```json
PUT /索引库名称
{
  "mappings": {
    "properties": {
      "字段名":{
        "type": "text",
        "analyzer": "ik_smart"
      },
      "字段名2":{
        "type": "keyword",
        "index": "false"
      },
      "字段名3":{
        "properties": {
          "子字段": {
            "type": "keyword"
          }
        }
      },
      // ...略
    }
  }
}
```

#### 示例：

```sh
PUT /heima
{
  "mappings": {
    "properties": {
      "info":{
        "type": "text",
        "analyzer": "ik_smart"
      },
      "email":{
        "type": "keyword",
        "index": "falsae"
      },
      "name":{
        "properties": {
          "firstName": {
            "type": "keyword"
          }
        }
      },
      // ... 略
    }
  }
}
```

### 2.2.2.查询索引库

**基本语法**：

- 请求方式：GET

- 请求路径：/索引库名

- 请求参数：无

**格式**：

```
GET /索引库名
```

**示例**：

![image-20210720211019329](assets/image-20210720211019329.png){data-zoomable}

### 2.2.3.修改索引库

倒排索引结构虽然不复杂，但是一旦数据结构改变（比如改变了分词器），就需要重新创建倒排索引，这简直是灾难。因此索引库**一旦创建，无法修改 mapping**。

虽然无法修改 mapping 中已有的字段，但是却允许添加新的字段到 mapping 中，因为不会对倒排索引产生影响。

**语法说明**：

```json
PUT /索引库名/_mapping
{
  "properties": {
    "新字段名":{
      "type": "integer"
    }
  }
}
```

**示例**：

![image-20210720212357390](assets/image-20210720212357390.png){data-zoomable}

### 2.2.4.删除索引库

**语法：**

- 请求方式：DELETE

- 请求路径：/索引库名

- 请求参数：无

**格式：**

```
DELETE /索引库名
```

在 kibana 中测试：

![image-20210720212123420](assets/image-20210720212123420.png){data-zoomable}

### 2.2.5.总结

索引库操作有哪些？

- 创建索引库：PUT /索引库名
- 查询索引库：GET /索引库名
- 删除索引库：DELETE /索引库名
- 添加字段：PUT /索引库名/\_mapping

# 3.文档操作

## 3.1.新增文档

**语法：**

```json
POST /索引库名/_doc/文档id
{
    "字段1": "值1",
    "字段2": "值2",
    "字段3": {
        "子属性1": "值3",
        "子属性2": "值4"
    },
    // ...
}
```

**示例：**

```json
POST /heima/_doc/1
{
    "info": "黑马程序员Java讲师",
    "email": "zy@itcast.cn",
    "name": {
        "firstName": "云",
        "lastName": "赵"
    }
}
```

**响应：**

![image-20210720212933362](assets/image-20210720212933362.png){data-zoomable}

## 3.2.查询文档

根据 rest 风格，新增是 post，查询应该是 get，不过查询一般都需要条件，这里我们把文档 id 带上。

**语法：**

```json
GET /{索引库名称}/_doc/{id}
```

**通过 kibana 查看数据：**

```js
GET / heima / _doc / 1;
```

**查看结果：**

![image-20210720213345003](assets/image-20210720213345003.png){data-zoomable}

## 3.3.删除文档

删除使用 DELETE 请求，同样，需要根据 id 进行删除：

**语法：**

```js
DELETE / { 索引库名 } / _doc / id值;
```

**示例：**

```json
# 根据id删除数据
DELETE /heima/_doc/1
```

**结果：**

![image-20210720213634918](assets/image-20210720213634918.png){data-zoomable}

## 3.4.修改文档

修改有两种方式：

- 全量修改：直接覆盖原来的文档
- 增量修改：修改文档中的部分字段

### 3.4.1.全量修改

全量修改是覆盖原来的文档，其本质是：

- 根据指定的 id 删除文档
- 新增一个相同 id 的文档

**注意**：如果根据 id 删除时，id 不存在，第二步的新增也会执行，也就从修改变成了新增操作了。

**语法：**

```json
PUT /{索引库名}/_doc/文档id
{
    "字段1": "值1",
    "字段2": "值2",
    // ... 略
}

```

**示例：**

```json
PUT /heima/_doc/1
{
    "info": "黑马程序员高级Java讲师",
    "email": "zy@itcast.cn",
    "name": {
        "firstName": "云",
        "lastName": "赵"
    }
}
```

### 3.4.2.增量修改

增量修改是只修改指定 id 匹配的文档中的部分字段。

**语法：**

```json
POST /{索引库名}/_update/文档id
{
    "doc": {
         "字段名": "新的值",
    }
}
```

**示例：**

```json
POST /heima/_update/1
{
  "doc": {
    "email": "ZhaoYun@itcast.cn"
  }
}
```

## 3.5.总结

文档操作有哪些？

- 创建文档：POST /{索引库名}/\_doc/文档 id { json 文档 }
- 查询文档：GET /{索引库名}/\_doc/文档 id
- 删除文档：DELETE /{索引库名}/\_doc/文档 id
- 修改文档：
  - 全量修改：PUT /{索引库名}/\_doc/文档 id { json 文档 }
  - 增量修改：POST /{索引库名}/\_update/文档 id { "doc": {字段}}

# 4.RestAPI

ES 官方提供了各种不同语言的客户端，用来操作 ES。这些客户端的本质就是组装 DSL 语句，通过 http 请求发送给 ES。官方文档地址：https://www.elastic.co/guide/en/elasticsearch/client/index.html

其中的 Java Rest Client 又包括两种：

- Java Low Level Rest Client
- Java High Level Rest Client

![image-20210720214555863](assets/image-20210720214555863.png){data-zoomable}

我们学习的是 Java HighLevel Rest Client 客户端 API

## 4.0.导入 Demo 工程

### 4.0.1.导入数据

首先导入课前资料提供的数据库数据：

![image-20210720220400297](assets/image-20210720220400297.png){data-zoomable}

数据结构如下：

```sql
CREATE TABLE `tb_hotel` (
  `id` bigint(20) NOT NULL COMMENT '酒店id',
  `name` varchar(255) NOT NULL COMMENT '酒店名称；例：7天酒店',
  `address` varchar(255) NOT NULL COMMENT '酒店地址；例：航头路',
  `price` int(10) NOT NULL COMMENT '酒店价格；例：329',
  `score` int(2) NOT NULL COMMENT '酒店评分；例：45，就是4.5分',
  `brand` varchar(32) NOT NULL COMMENT '酒店品牌；例：如家',
  `city` varchar(32) NOT NULL COMMENT '所在城市；例：上海',
  `star_name` varchar(16) DEFAULT NULL COMMENT '酒店星级，从低到高分别是：1星到5星，1钻到5钻',
  `business` varchar(255) DEFAULT NULL COMMENT '商圈；例：虹桥',
  `latitude` varchar(32) NOT NULL COMMENT '纬度；例：31.2497',
  `longitude` varchar(32) NOT NULL COMMENT '经度；例：120.3925',
  `pic` varchar(255) DEFAULT NULL COMMENT '酒店图片；例:/img/1.jpg',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 4.0.2.导入项目

然后导入课前资料提供的项目:

![image-20210720220503411](assets/image-20210720220503411.png){data-zoomable}

项目结构如图：

![image-20210720220647541](assets/image-20210720220647541.png){data-zoomable}

### 4.0.3.mapping 映射分析

创建索引库，最关键的是 mapping 映射，而 mapping 映射要考虑的信息包括：

- 字段名
- 字段数据类型
- 是否参与搜索
- 是否需要分词
- 如果分词，分词器是什么？

其中：

- 字段名、字段数据类型，可以参考数据表结构的名称和类型
- 是否参与搜索要分析业务来判断，例如图片地址，就无需参与搜索
- 是否分词呢要看内容，内容如果是一个整体就无需分词，反之则要分词
- 分词器，我们可以统一使用 ik_max_word

来看下酒店数据的索引库结构:

```json
PUT /hotel
{
  "mappings": {
    "properties": {
      "id": {
        "type": "keyword"
      },
      "name":{
        "type": "text",
        "analyzer": "ik_max_word",
        "copy_to": "all"
      },
      "address":{
        "type": "keyword",
        "index": false
      },
      "price":{
        "type": "integer"
      },
      "score":{
        "type": "integer"
      },
      "brand":{
        "type": "keyword",
        "copy_to": "all"
      },
      "city":{
        "type": "keyword",
        "copy_to": "all"
      },
      "starName":{
        "type": "keyword"
      },
      "business":{
        "type": "keyword"
      },
      "location":{
        "type": "geo_point"
      },
      "pic":{
        "type": "keyword",
        "index": false
      },
      "all":{
        "type": "text",
        "analyzer": "ik_max_word"
      }
    }
  }
}
```

几个特殊字段说明：

- location：地理坐标，里面包含精度、纬度
- all：一个组合字段，其目的是将多字段的值 利用 copy_to 合并，提供给用户搜索

地理坐标说明：

![image-20210720222110126](assets/image-20210720222110126.png){data-zoomable}

copy_to 说明：

![image-20210720222221516](assets/image-20210720222221516.png){data-zoomable}

### 4.0.4.初始化 RestClient

在 elasticsearch 提供的 API 中，与 elasticsearch 一切交互都封装在一个名为 RestHighLevelClient 的类中，必须先完成这个对象的初始化，建立与 elasticsearch 的连接。

分为三步：

1）引入 es 的 RestHighLevelClient 依赖：

```xml
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
</dependency>
```

2）因为 SpringBoot 默认的 ES 版本是 7.6.2，所以我们需要覆盖默认的 ES 版本：

```xml
<properties>
    <java.version>1.8</java.version>
    <elasticsearch.version>7.12.1</elasticsearch.version>
</properties>
```

3）初始化 RestHighLevelClient：

初始化的代码如下：

```java
RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
        HttpHost.create("http://192.168.150.101:9200")
));
```

这里为了单元测试方便，我们创建一个测试类 HotelIndexTest，然后将初始化的代码编写在@BeforeEach 方法中：

```java
package cn.itcast.hotel;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestHighLevelClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;

public class HotelIndexTest {
    private RestHighLevelClient client;

    @BeforeEach
    void setUp() {
        this.client = new RestHighLevelClient(RestClient.builder(
                HttpHost.create("http://192.168.150.101:9200")
        ));
    }

    @AfterEach
    void tearDown() throws IOException {
        this.client.close();
    }
}
```

## 4.1.创建索引库

### 4.1.1.代码解读

创建索引库的 API 如下：

![image-20210720223049408](assets/image-20210720223049408.png){data-zoomable}

代码分为三步：

- 1）创建 Request 对象。因为是创建索引库的操作，因此 Request 是 CreateIndexRequest。
- 2）添加请求参数，其实就是 DSL 的 JSON 参数部分。因为 json 字符串很长，这里是定义了静态字符串常量 MAPPING_TEMPLATE，让代码看起来更加优雅。
- 3）发送请求，client.indices()方法的返回值是 IndicesClient 类型，封装了所有与索引库操作有关的方法。

### 4.1.2.完整示例

在 hotel-demo 的 cn.itcast.hotel.constants 包下，创建一个类，定义 mapping 映射的 JSON 字符串常量：

```java
package cn.itcast.hotel.constants;

public class HotelConstants {
    public static final String MAPPING_TEMPLATE = "{\n" +
            "  \"mappings\": {\n" +
            "    \"properties\": {\n" +
            "      \"id\": {\n" +
            "        \"type\": \"keyword\"\n" +
            "      },\n" +
            "      \"name\":{\n" +
            "        \"type\": \"text\",\n" +
            "        \"analyzer\": \"ik_max_word\",\n" +
            "        \"copy_to\": \"all\"\n" +
            "      },\n" +
            "      \"address\":{\n" +
            "        \"type\": \"keyword\",\n" +
            "        \"index\": false\n" +
            "      },\n" +
            "      \"price\":{\n" +
            "        \"type\": \"integer\"\n" +
            "      },\n" +
            "      \"score\":{\n" +
            "        \"type\": \"integer\"\n" +
            "      },\n" +
            "      \"brand\":{\n" +
            "        \"type\": \"keyword\",\n" +
            "        \"copy_to\": \"all\"\n" +
            "      },\n" +
            "      \"city\":{\n" +
            "        \"type\": \"keyword\",\n" +
            "        \"copy_to\": \"all\"\n" +
            "      },\n" +
            "      \"starName\":{\n" +
            "        \"type\": \"keyword\"\n" +
            "      },\n" +
            "      \"business\":{\n" +
            "        \"type\": \"keyword\"\n" +
            "      },\n" +
            "      \"location\":{\n" +
            "        \"type\": \"geo_point\"\n" +
            "      },\n" +
            "      \"pic\":{\n" +
            "        \"type\": \"keyword\",\n" +
            "        \"index\": false\n" +
            "      },\n" +
            "      \"all\":{\n" +
            "        \"type\": \"text\",\n" +
            "        \"analyzer\": \"ik_max_word\"\n" +
            "      }\n" +
            "    }\n" +
            "  }\n" +
            "}";
}
```

在 hotel-demo 中的 HotelIndexTest 测试类中，编写单元测试，实现创建索引：

```java
@Test
void createHotelIndex() throws IOException {
    // 1.创建Request对象
    CreateIndexRequest request = new CreateIndexRequest("hotel");
    // 2.准备请求的参数：DSL语句
    request.source(MAPPING_TEMPLATE, XContentType.JSON);
    // 3.发送请求
    client.indices().create(request, RequestOptions.DEFAULT);
}
```

## 4.2.删除索引库

删除索引库的 DSL 语句非常简单：

```json
DELETE /hotel
```

与创建索引库相比：

- 请求方式从 PUT 变为 DELTE
- 请求路径不变
- 无请求参数

所以代码的差异，注意体现在 Request 对象上。依然是三步走：

- 1）创建 Request 对象。这次是 DeleteIndexRequest 对象
- 2）准备参数。这里是无参
- 3）发送请求。改用 delete 方法

在 hotel-demo 中的 HotelIndexTest 测试类中，编写单元测试，实现删除索引：

```java
@Test
void testDeleteHotelIndex() throws IOException {
    // 1.创建Request对象
    DeleteIndexRequest request = new DeleteIndexRequest("hotel");
    // 2.发送请求
    client.indices().delete(request, RequestOptions.DEFAULT);
}
```

## 4.3.判断索引库是否存在

判断索引库是否存在，本质就是查询，对应的 DSL 是：

```json
GET /hotel
```

因此与删除的 Java 代码流程是类似的。依然是三步走：

- 1）创建 Request 对象。这次是 GetIndexRequest 对象
- 2）准备参数。这里是无参
- 3）发送请求。改用 exists 方法

```java
@Test
void testExistsHotelIndex() throws IOException {
    // 1.创建Request对象
    GetIndexRequest request = new GetIndexRequest("hotel");
    // 2.发送请求
    boolean exists = client.indices().exists(request, RequestOptions.DEFAULT);
    // 3.输出
    System.err.println(exists ? "索引库已经存在！" : "索引库不存在！");
}
```

## 4.4.总结

JavaRestClient 操作 elasticsearch 的流程基本类似。核心是 client.indices()方法来获取索引库的操作对象。

索引库操作的基本步骤：

- 初始化 RestHighLevelClient
- 创建 XxxIndexRequest。XXX 是 Create、Get、Delete
- 准备 DSL（ Create 时需要，其它是无参）
- 发送请求。调用 RestHighLevelClient#indices().xxx()方法，xxx 是 create、exists、delete

# 5.RestClient 操作文档

为了与索引库操作分离，我们再次参加一个测试类，做两件事情：

- 初始化 RestHighLevelClient
- 我们的酒店数据在数据库，需要利用 IHotelService 去查询，所以注入这个接口

```java
package cn.itcast.hotel;

import cn.itcast.hotel.pojo.Hotel;
import cn.itcast.hotel.service.IHotelService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.util.List;

@SpringBootTest
public class HotelDocumentTest {
    @Autowired
    private IHotelService hotelService;

    private RestHighLevelClient client;

    @BeforeEach
    void setUp() {
        this.client = new RestHighLevelClient(RestClient.builder(
                HttpHost.create("http://192.168.150.101:9200")
        ));
    }

    @AfterEach
    void tearDown() throws IOException {
        this.client.close();
    }
}

```

## 5.1.新增文档

我们要将数据库的酒店数据查询出来，写入 elasticsearch 中。

### 5.1.1.索引库实体类

数据库查询后的结果是一个 Hotel 类型的对象。结构如下：

```java
@Data
@TableName("tb_hotel")
public class Hotel {
    @TableId(type = IdType.INPUT)
    private Long id;
    private String name;
    private String address;
    private Integer price;
    private Integer score;
    private String brand;
    private String city;
    private String starName;
    private String business;
    private String longitude;
    private String latitude;
    private String pic;
}
```

与我们的索引库结构存在差异：

- longitude 和 latitude 需要合并为 location

因此，我们需要定义一个新的类型，与索引库结构吻合：

```java
package cn.itcast.hotel.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HotelDoc {
    private Long id;
    private String name;
    private String address;
    private Integer price;
    private Integer score;
    private String brand;
    private String city;
    private String starName;
    private String business;
    private String location;
    private String pic;

    public HotelDoc(Hotel hotel) {
        this.id = hotel.getId();
        this.name = hotel.getName();
        this.address = hotel.getAddress();
        this.price = hotel.getPrice();
        this.score = hotel.getScore();
        this.brand = hotel.getBrand();
        this.city = hotel.getCity();
        this.starName = hotel.getStarName();
        this.business = hotel.getBusiness();
        this.location = hotel.getLatitude() + ", " + hotel.getLongitude();
        this.pic = hotel.getPic();
    }
}

```

### 5.1.2.语法说明

新增文档的 DSL 语句如下：

```json
POST /{索引库名}/_doc/1
{
    "name": "Jack",
    "age": 21
}
```

对应的 java 代码如图：

![image-20210720230027240](assets/image-20210720230027240.png){data-zoomable}

可以看到与创建索引库类似，同样是三步走：

- 1）创建 Request 对象
- 2）准备请求参数，也就是 DSL 中的 JSON 文档
- 3）发送请求

变化的地方在于，这里直接使用 client.xxx()的 API，不再需要 client.indices()了。

### 5.1.3.完整代码

我们导入酒店数据，基本流程一致，但是需要考虑几点变化：

- 酒店数据来自于数据库，我们需要先查询出来，得到 hotel 对象
- hotel 对象需要转为 HotelDoc 对象
- HotelDoc 需要序列化为 json 格式

因此，代码整体步骤如下：

- 1）根据 id 查询酒店数据 Hotel
- 2）将 Hotel 封装为 HotelDoc
- 3）将 HotelDoc 序列化为 JSON
- 4）创建 IndexRequest，指定索引库名和 id
- 5）准备请求参数，也就是 JSON 文档
- 6）发送请求

在 hotel-demo 的 HotelDocumentTest 测试类中，编写单元测试：

```java
@Test
void testAddDocument() throws IOException {
    // 1.根据id查询酒店数据
    Hotel hotel = hotelService.getById(61083L);
    // 2.转换为文档类型
    HotelDoc hotelDoc = new HotelDoc(hotel);
    // 3.将HotelDoc转json
    String json = JSON.toJSONString(hotelDoc);

    // 1.准备Request对象
    IndexRequest request = new IndexRequest("hotel").id(hotelDoc.getId().toString());
    // 2.准备Json文档
    request.source(json, XContentType.JSON);
    // 3.发送请求
    client.index(request, RequestOptions.DEFAULT);
}
```

## 5.2.查询文档

### 5.2.1.语法说明

查询的 DSL 语句如下：

```json
GET /hotel/_doc/{id}
```

非常简单，因此代码大概分两步：

- 准备 Request 对象
- 发送请求

不过查询的目的是得到结果，解析为 HotelDoc，因此难点是结果的解析。完整代码如下：

![image-20210720230811674](assets/image-20210720230811674.png){data-zoomable}

可以看到，结果是一个 JSON，其中文档放在一个`_source`属性中，因此解析就是拿到`_source`，反序列化为 Java 对象即可。

与之前类似，也是三步走：

- 1）准备 Request 对象。这次是查询，所以是 GetRequest
- 2）发送请求，得到结果。因为是查询，这里调用 client.get()方法
- 3）解析结果，就是对 JSON 做反序列化

### 5.2.2.完整代码

在 hotel-demo 的 HotelDocumentTest 测试类中，编写单元测试：

```java
@Test
void testGetDocumentById() throws IOException {
    // 1.准备Request
    GetRequest request = new GetRequest("hotel", "61082");
    // 2.发送请求，得到响应
    GetResponse response = client.get(request, RequestOptions.DEFAULT);
    // 3.解析响应结果
    String json = response.getSourceAsString();

    HotelDoc hotelDoc = JSON.parseObject(json, HotelDoc.class);
    System.out.println(hotelDoc);
}
```

## 5.3.删除文档

删除的 DSL 为是这样的：

```json
DELETE /hotel/_doc/{id}
```

与查询相比，仅仅是请求方式从 DELETE 变成 GET，可以想象 Java 代码应该依然是三步走：

- 1）准备 Request 对象，因为是删除，这次是 DeleteRequest 对象。要指定索引库名和 id
- 2）准备参数，无参
- 3）发送请求。因为是删除，所以是 client.delete()方法

在 hotel-demo 的 HotelDocumentTest 测试类中，编写单元测试：

```java
@Test
void testDeleteDocument() throws IOException {
    // 1.准备Request
    DeleteRequest request = new DeleteRequest("hotel", "61083");
    // 2.发送请求
    client.delete(request, RequestOptions.DEFAULT);
}
```

## 5.4.修改文档

### 5.4.1.语法说明

修改我们讲过两种方式：

- 全量修改：本质是先根据 id 删除，再新增
- 增量修改：修改文档中的指定字段值

在 RestClient 的 API 中，全量修改与新增的 API 完全一致，判断依据是 ID：

- 如果新增时，ID 已经存在，则修改
- 如果新增时，ID 不存在，则新增

这里不再赘述，我们主要关注增量修改。

代码示例如图：

![image-20210720231040875](assets/image-20210720231040875.png){data-zoomable}

与之前类似，也是三步走：

- 1）准备 Request 对象。这次是修改，所以是 UpdateRequest
- 2）准备参数。也就是 JSON 文档，里面包含要修改的字段
- 3）更新文档。这里调用 client.update()方法

### 5.4.2.完整代码

在 hotel-demo 的 HotelDocumentTest 测试类中，编写单元测试：

```java
@Test
void testUpdateDocument() throws IOException {
    // 1.准备Request
    UpdateRequest request = new UpdateRequest("hotel", "61083");
    // 2.准备请求参数
    request.doc(
        "price", "952",
        "starName", "四钻"
    );
    // 3.发送请求
    client.update(request, RequestOptions.DEFAULT);
}
```

## 5.5.批量导入文档

案例需求：利用 BulkRequest 批量将数据库数据导入到索引库中。

步骤如下：

- 利用 mybatis-plus 查询酒店数据

- 将查询到的酒店数据（Hotel）转换为文档类型数据（HotelDoc）

- 利用 JavaRestClient 中的 BulkRequest 批处理，实现批量新增文档

### 5.5.1.语法说明

批量处理 BulkRequest，其本质就是将多个普通的 CRUD 请求组合在一起发送。

其中提供了一个 add 方法，用来添加其他请求：

![image-20210720232105943](assets/image-20210720232105943.png){data-zoomable}

可以看到，能添加的请求包括：

- IndexRequest，也就是新增
- UpdateRequest，也就是修改
- DeleteRequest，也就是删除

因此 Bulk 中添加了多个 IndexRequest，就是批量新增功能了。示例：

![image-20210720232431383](assets/image-20210720232431383.png){data-zoomable}

其实还是三步走：

- 1）创建 Request 对象。这里是 BulkRequest
- 2）准备参数。批处理的参数，就是其它 Request 对象，这里就是多个 IndexRequest
- 3）发起请求。这里是批处理，调用的方法为 client.bulk()方法

我们在导入酒店数据时，将上述代码改造成 for 循环处理即可。

### 5.5.2.完整代码

在 hotel-demo 的 HotelDocumentTest 测试类中，编写单元测试：

```java
@Test
void testBulkRequest() throws IOException {
    // 批量查询酒店数据
    List<Hotel> hotels = hotelService.list();

    // 1.创建Request
    BulkRequest request = new BulkRequest();
    // 2.准备参数，添加多个新增的Request
    for (Hotel hotel : hotels) {
        // 2.1.转换为文档类型HotelDoc
        HotelDoc hotelDoc = new HotelDoc(hotel);
        // 2.2.创建新增文档的Request对象
        request.add(new IndexRequest("hotel")
                    .id(hotelDoc.getId().toString())
                    .source(JSON.toJSONString(hotelDoc), XContentType.JSON));
    }
    // 3.发送请求
    client.bulk(request, RequestOptions.DEFAULT);
}
```

## 5.6.小结

文档操作的基本步骤：

- 初始化 RestHighLevelClient
- 创建 XxxRequest。XXX 是 Index、Get、Update、Delete、Bulk
- 准备参数（Index、Update、Bulk 时需要）
- 发送请求。调用 RestHighLevelClient#.xxx()方法，xxx 是 index、get、update、delete、bulk
- 解析结果（Get 时需要）

export default {
  base: "/java-blog/",
  title: "Java 从入门到精通",
  description: "Just playing around.",

  themeConfig: {
    sidebar: [
      {
        text: "Java基础",
        items: [
          { text: "Java基础", link: "/java/java-base/" },
          { text: "面向对象", link: "/java/java-base/object-oriented" },
          { text: "常用 API", link: "/java/java-base/java-api" },
          { text: "学习案例", link: "/java/java-base/case" },
          { text: "IDEA", link: "/java/java-base/idea" },
          { text: "必先利其器", link: "/java/java-base/skill" },
        ],
      },
      {
        text: "Java进阶",
        items: [
          { text: "集合", link: "/java/java-advanced/collection" },
          { text: "异常", link: "/java/java-advanced/exception" },
          { text: "日志", link: "/java/java-advanced/log" },
          { text: "File", link: "/java/java-advanced/file" },
          { text: "IO 流", link: "/java/java-advanced/io" },
          { text: "多线程", link: "/java/java-advanced/thread" },
          { text: "网络通信", link: "/java/java-advanced/net" },
          { text: "学习案例", link: "/java/java-advanced/case" },
          { text: "单元测试", link: "/java/java-advanced/unit-test" },
          { text: "反射", link: "/java/java-advanced/reflection" },
          { text: "注解", link: "/java/java-advanced/annotation" },
          { text: "动态代理", link: "/java/java-advanced/dynamic-proxy" },
        ],
      },
      {
        text: "Java Web",
        items: [
          {
            text: "MySQL",
            link: "/java/java-web/mysql",
          },
          {
            text: "JDBC",
            link: "/java/java-web/jdbc",
          },
          {
            text: "Maven",
            link: "/java/java-web/maven",
          },
          {
            text: "MyBatis",
            link: "/java/java-web/mybatis",
          },
          {
            text: "Servlet",
            link: "/java/java-web/servlet",
          },
          {
            text: "JSP",
            link: "/java/java-web/jsp",
          },
        ],
      },
      {
        text: "Spring",
        items: [
          {
            text: "Spring",
            link: "/spring/",
            items: [
              {
                text: "day01",
                link: "/spring/spring_day01/",
              },
              {
                text: "day02",
                link: "/spring/spring_day02/",
              },
              {
                text: "day03",
                link: "/spring/spring_day03/",
              },
            ],
          },
          {
            text: "Spring MVC",
            link: "/spring-mvc/",
            items: [
              {
                text: "day01",
                link: "/spring-mvc/01/",
              },
              {
                text: "day02",
                link: "/spring-mvc/02/",
              },
            ],
          },
          {
            text: "Spring Boot",
            link: "/spring-boot/",
          },
          {
            text: "Spring 原理解读",
            link: "/spring-source-analysis/",
            items: [
              {
                text: "容器接口",
                link: "/spring-source-analysis/container-interface",
              },
            ],
          },
        ],
      },
      {
        text: "项目实战",
        items: [
          {
            text: "瑞吉外卖",
            link: "/demo/reggie/",
            items: [
              {
                text: "项目介绍",
                link: "/demo/reggie/introduce",
              },
              {
                text: "环境搭建",
                link: "/demo/reggie/env/",
              },
              {
                text: "登录功能开发",
                link: "/demo/reggie/login/",
              },
              {
                text: "员工管理功能开发",
                link: "/demo/reggie/employee/",
              },
              {
                text: "分类管理功能开发",
                link: "/demo/reggie/category/",
              },
              {
                text: "菜品管理功能开发",
                link: "/demo/reggie/dishes/",
              },
              {
                text: "订单明细功能开发",
                link: "/demo/reggie/orders/",
              },
            ],
          },
        ],
      },
    ],

    algolia: {
      appId: "NTK6UE6C60",
      apiKey: "f76c9116ffd2549bdc3f0e5cb7a940c3",
      indexName: "java-blog",
      placeholder: "请输入关键词",
      buttonText: "Search",
    },
  },
};

export default {
  base: "/java-blog/",
  title: "Java",
  description: "Just playing around.",

  themeConfig: {
    sidebar: [
      {
        text: "Java基础",
        items: [
          { text: "Java基础", link: "/java/java-base/" },
          { text: "面向对象", link: "/java/java-base/object-oriented" },
          { text: "常用 API", link: "/java/java-base/java-api" },
        ],
      },
      {
        text: "Java进阶",
        items: [{ text: "JavaSE进阶", link: "/java/java-advanced/" }],
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
          { text: "Spring Boot", link: "/spring-boot/" },
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
                link: "/demo/reggie/category/",
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
      placeholder: "Ctrl + K",
      buttonText: "Search",
    },
  },
};

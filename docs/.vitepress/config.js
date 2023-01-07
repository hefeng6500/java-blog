export default {
  base: "/java-blog/",
  title: "Java",
  description: "Just playing around.",

  themeConfig: {
    sidebar: [
      {
        text: "JavaSE",
        items: [
          { text: "JavaSE基础", link: "/java/java-base/" },
          { text: "JavaSE进阶", link: "/java/java-advanced/" },
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
          { text: "Spring Boot", link: "/spring-boot/" },
        ],
      },
      {
        text: "项目实战",
        items: [{ text: "瑞吉外卖", link: "/demo/rjwm" }],
      },
    ],

    algolia: {
      appId: "NTK6UE6C60",
      apiKey: "978a34e34575102884fd83825053de4c",
      indexName: "java-blog",
      placeholder: "Ctrl + K",
      buttonText: "Search",
    },
  },
};

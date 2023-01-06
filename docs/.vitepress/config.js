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
    ],

    algolia: {
      appId: "NTK6UE6C60",
      apiKey: "e04b2af42199559bc5ded7ce310f4a05",
      indexName: "java-blog",
      placeholder: "Ctrl + K",
      buttonText: "Search",
    },
  },
};

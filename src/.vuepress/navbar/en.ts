import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  { text: "  AI  ", icon: "ai-robot", link: "/AI/" },
  {
    text: "Java", icon: "java",
    children: [
      { 
        text: "Java开发知识体系", icon: "java", children: [
          { text: "Java基础语法入门", link: "/java/base/" },
          { text: "Java进阶及核心特性", link: "/java/core/" },
          { text: "JavaWeb及常用框架", link: "/java/frame/" },
          { text: "数据库与ORM框架", link: "/java/database/" },
          { text: "分布式与微服务架构", link: "/java/service/" }
        ]
      }, 
      {
        text: "Java项目及解决方案", icon: "app",
        children: [
          { text: "常见工具和环境", link: "/project/base/" },
          { text: "电商项目综合实践", link: "/project/mall/" },
          { text: "项目场景解决方案", link: "/project/solution/" }
        ],
      },
      "/java/interview/"
    ],
  },
  {
    text: "Web", icon: "net",
    children: ["/web/base/", "/web/core/", "/web/security/"],
  },
  {
    text: "Python", icon: "python",
    children: ["/python/base/", "/python/frame/", "/python/image/", "/python/Project/"],
  },
  {
    text: "C++", icon: "cpp",
    children: ["/cpp/base/", "/cpp/ed/"],
  },
  {
    text: "Blog", icon: "blog",
    children: ["/blog", "/posts/blog/", "/posts/cs/", "/posts/java/", "/posts/db/", "/posts/om/"],
  },
]);

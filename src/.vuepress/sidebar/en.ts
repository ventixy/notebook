import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [ "" ],

  "/posts/cs/": [{text: "Blog-Computer and science", icon: "es6", link: "/posts/cs/", children: "structure"}],
  "/posts/java/": [{text: "Blog-Java开发相关博客", icon: "es6", link: "/posts/java/", children: "structure"}],
  "/posts/db/": [{text: "Blog-数据库相关博客", icon: "es6", link: "/posts/db/", children: "structure"}],
  "/posts/om/": [{text: "Blog-系统运维博客", icon: "es6", link: "/posts/om/", children: "structure"}],
  "/posts/blog/": [{text: "Blog-日常博客记录", icon: "es6", link: "/posts/blog/", children: "structure"}],

  "/project/base/": [{text: "常用工具及项目环境", icon: "project", link: "/project/base/", children: "structure"}],
  "/project/mall/": [{text: "电商项目综合实践", icon: "project", link: "/project/mall/", children: "structure"}],
  "/project/ai/": [{text: "AI综合应用开发实践", icon: "project", link: "/project/ai/", children: "structure"}],
  "/project/solution/": [{text: "项目常见场景解决方案", icon: "project", link: "/project/solution/", children: "structure"}],

  "/java/base/": [{text: "Java基础语法介绍", icon: "java", link: "/java/base/", children: "structure"}],
  "/java/core/": [{text: "Java进阶及核心特性", icon: "java", link: "/java/core/", children: "structure"}],
  "/java/frame/": [{text: "JavaWeb及常用框架", icon: "spring-framework", link: "/java/frame/", children: "structure"}],
  "/java/service/": [{text: "分布式组件与微服务架构", icon: "java", link: "/java/service/", children: "structure"}],
  "/java/database/": [{text: "数据库与ORM框架", icon: "db", link: "/java/database/", children: "structure"}],
  "/java/interview/": [{ text: "Java开发面试题库", icon: "java", link: "/java/interview/", children: "structure"}],

  "/web/base/": [{text: "前端开发基础语法介绍", icon: "es6", link: "/web/base/", children: "structure"}],
  "/web/core/": [{text: "前端开发工具和框架", icon: "es6", link: "/web/core/", children: "structure"}],
  "/web/security/": [{text: "性能优化与Web安全", icon: "es6", link: "/web/security/", children: "structure"}],

  "/python/base/": [{text: "Python编程基础语法", icon: "python", link: "/python/base/", children: "structure"}],
  "/python/frame/": [{text: "Python常用库和框架", icon: "python", link: "/python/frame/", children: "structure"}],
  "/python/image/": [{text: "Python图像识别与处理", icon: "python", link: "/python/image/", children: "structure"}],
  "/python/Project/": [{text: "Python相关项目文档", icon: "python", link: "/python/Project/", children: "structure"}],

  "/AI/base/": [{text: "AI理论基础入门", icon: "ai-robot", link: "/AI/base/", children: "structure"}],
  "/AI/apply/": [{text: "AI常见工具应用实践", icon: "ai-robot", link: "/AI/apply/", children: "structure"}],

  "/tool/": [{text: "常用开发工具和环境", icon: "tools", link: "/tool/", children: "structure"}],
  
  "/theory/cs/": [{text: "计算机网络和操作系统", icon: "computer", link: "/theory/cs/",children: "structure"}],
  "/theory/ds/": [{text: "数据结构与算法", icon: "stream", link: "/theory/ds/", children: "structure"}],
  "/theory/design/": [{text: "设计模式理论与实践", icon: "es6", link: "/theory/cs/", children: "structure"}],
});

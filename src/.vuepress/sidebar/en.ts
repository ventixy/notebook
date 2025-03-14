import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/": [
    "",
  ],
  "/posts/": [
    {
      text: "My Blog",
      icon: "es6",
      link: "/blog",
      children: "structure",
    },
  ],
  "/project/": [
    {
      text: "项目实践及系统架构设计",
      icon: "project",
      link: "/project/",
      children: "structure",
    },
  ],
  "/java/": [
    {
      text: "Java Programming",
      icon: "java",
      link: "/java/",
      children: "structure",
    },
  ],
  "/python/": [
    {
      text: "Python And AI",
      icon: "python",
      link: "/python/",
      children: "structure",
    },
  ],
  "/tool/": [
    {
      text: "常用开发工具和环境",
      icon: "tools",
      link: "/tool/",
      children: "structure",
    },
  ],
  "/web/": [
    {
      text: "前端开发知识体系",
      icon: "es6",
      link: "/web/",
      children: "structure",
    },
  ],
  "/interview/": [
    {
      text: "Java开发面试内容",
      icon: "java",
      link: "/interview/",
      children: "structure",
    },
  ],
  "/theory/cs/": [
      {
        text: "计算机网络和操作系统",
        icon: "computer",
        link: "/theory/cs/",
        children: "structure",
      }
  ],
  "/theory/ds/": [
    {
      text: "数据结构与算法",
      icon: "stream",
      link: "/theory/ds/",
      children: "structure",
    }
  ],
  "/theory/design/": [
    {
      text: "设计模式理论与实践",
      icon: "es6",
      link: "/theory/cs/",
      children: "structure",
    }
  ],
});

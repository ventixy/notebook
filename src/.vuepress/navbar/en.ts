import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  {
    text: "Blog", icon: "blog",
    children: ["/blog", "/posts/cs/", "/posts/java/", "/posts/db/", "/posts/om/", "/posts/blog/"],
  },
  {
    text: "Java", icon: "java",
    children: ["/java/syntax/", "/java/frame/", "/java/service/", "/java/database/", "/java/interview/"],
  },
  {
    text: "Project", icon: "app",
    children: ["/project/base/", "/project/mall/", "/project/ai/", "/project/solution/"],
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
    text: "AI", icon: "ai-robot",
    children: ["/AI/base/", "/AI/apply/"],
  },

  {
    text: "Other", icon: "project",
    children: ["/tool/theme.md"],
  },
]);

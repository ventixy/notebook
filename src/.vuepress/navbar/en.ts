import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  {text: "Blog", icon: "blog", link: "/blog"},
  {text: "Java", icon: "java", link: "/java/"},
  {text: "Project", icon: "app", link: "/project/"},
  {text: "Web", icon: "net", link: "/web/"},
  {text: "Python", icon: "python", link: "/python/"},

  {
    text: "Other",
    icon: "project",
    children: ["/interview/", "/tool/theme.md"],
  },
]);

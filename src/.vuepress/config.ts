import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "doc",
      description: "docs for develop note",
    },
    // "/zh/": {
    //   lang: "zh-CN",
    //   title: "开发笔记",
    //   description: "个人开发笔记记录",
    // },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});

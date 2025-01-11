import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "x.app",
  author: {
    name: "ventixy",
    url: "https://www.ventix.top",
  },
  repo: "ventixy/notebook",

  logo: "logo.svg",
  favicon: "jav.ico",

  iconAssets: "//at.alicdn.com/t/c/font_3708474_z1p3kxj9i5c.css",

  docsDir: "src",
  breadcrumb: false,    // 是否全局启用路径导航

  locales: {
    "/": {
      navbar: enNavbar,   // navbar
      sidebar: enSidebar,   // sidebar
 
      footer: "Default footer",
      displayFooter: true,

      metaLocales: {
        editLink: "Edit this page on GitHub",
      },
    },

    "/zh/": {      //  Chinese locale config
      navbar: zhNavbar,
      sidebar: zhSidebar,

      footer: "默认页脚",
      displayFooter: true,

      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },
  },

  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
      "/zh/demo/encrypt.html": ["1234"],
    },
  },

  plugins: {
    // You should generate and use your own comment service
    comment: {
      provider: "Giscus",
      repo: "vuepress-theme-hope/giscus-discussions",
      repoId: "R_kgDOG_Pt2A",
      category: "Announcements",
      categoryId: "DIC_kwDOG_Pt2M4COD69",
    },

    components: {
      components: ["Badge", "VPCard"],
    },

    blog: {
      filter: ({ frontmatter, filePathRelative }) => 
        frontmatter.article === true && Boolean(filePathRelative) && !frontmatter.home,
      
    },

    // All features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      component: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,

      // install flowchart.ts before enabling it
      flowchart: true,
      // gfm requires mathjax-full to provide tex support
      gfm: true,
      // install mathjax-full before enabling it
      mathjax: true,
      // install mermaid before enabling it
      mermaid: true,
      
      plantuml: true,

    },

    
  },

  blog: {
    name: "ventix",
    avatar: "avatar.svg",
    description: "A java programmer",
    // intro: "/intro.html",
    intro: "/blog.html",
    medias: {
      // BiliBili: "https://example.com",
      Gitee: "https://example.com",
      GitHub: "https://example.com",
      Gitlab: "https://example.com",
      Gmail: "mailto:info@example.com",
      QQ: "https://example.com",
      // Whatsapp: "https://example.com",
      // Youtube: "https://example.com",
      // Zhihu: "https://example.com",
      // VuePressThemeHope: {
      //   icon: "https://theme-hope-assets.vuejs.press/logo.svg",
      //   link: "https://theme-hope.vuejs.press",
      // },
    },
  },
});

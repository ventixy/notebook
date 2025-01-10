---

order: -1
title: Theme-Hope
icon: web-design

---



## 环境及项目创建

https://theme-hope.vuejs.press/

### 快速安装

环境准备及项目创建参照：

https://theme-hope.vuejs.press/guide/intro/install.html


### 项目迁移

克隆代码：
```bash
git clone git@github.com:drizzletow/notebook.git
```

下载依赖并启动项目：

```bash
pnpm install

pnpm docs:dev
```


## 项目相关配置

https://theme-hope.vuejs.press/config/theme/basic.html

### 导航栏与侧边栏

https://theme-hope.vuejs.press/config/theme/layout.html#navbar-config

https://theme-hope.vuejs.press/zh/guide/layout/navbar.html#%E5%AF%BC%E8%88%AA%E6%A0%8F%E9%93%BE%E6%8E%A5


## MarkDown拓展

高亮：`==内容==`

### Tabs选项

https://theme-hope.vuejs.press/guide/markdown/content/tabs.html

```bash
::: tabs

@tab title 1

<!-- tab 1 content -->

@tab title 2

<!-- tab 2 content -->

<!-- 👇 tab 3 will be activated by default -->

@tab:active title 3

<!-- tab 3 content -->

:::

```


### CodeTabs

https://theme-hope.vuejs.press/guide/markdown/code/code-tabs.html

```bash

    ::: code-tabs#shell

    @tab pnpm

    ```bash
    pnpm add -D vuepress-theme-hope
    ```

    @tab yarn

    ```bash
    yarn add -D vuepress-theme-hope
    ```

    @tab:active npm

    ```bash
    npm i -D vuepress-theme-hope
    ```

    :::
```



### GMF/Hint

GFM alert：https://theme-hope.vuejs.press/guide/markdown/stylize/alert.html

Hint Box: https://theme-hope.vuejs.press/guide/markdown/stylize/hint.html

```bash
::: important
Important container
:::

::: info
Information container
:::

::: note
Note container
:::

::: tip
Tip container
:::

::: warning
Warning container
:::

::: caution
Caution container
:::

::: details
Details container
:::
```


### Tex&Chart

Tex: https://theme-hope.vuejs.press/guide/markdown/grammar/math.html#syntax

Chart: https://theme-hope.vuejs.press/guide/markdown/chart/chartjs.html
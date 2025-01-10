---

order: 1
title: Vue.js

---

Vue官方文档：https://cn.vuejs.org/guide/introduction.html


::: info Vue发展历史

1. **初期（2013年以前）**：
   Vue的前身名为"Seed"，由尤雨溪开发。2013年12月，Vue.js正式发布首个版本0.6.0，标志着Vue作为一个独立项目的开始。

2. **Vue 1.x（2014-2015）**：
   - 2014年初，Vue进行了第一次重大重构（0.11版），增强了其生产环境下的适用性。
   - 2014年10月，Vue引入了单文件组件（SFC，Single File Components）的概念，通过vueify和Browserify打包。
   - 2015年6月，Vue 0.12.0发布，代号为“Dragon Ball”，获得Laravel社区的关注，Vue开始在JavaScript社区内崭露头角。
   - 同年10月，Vue 1.0.0（代号Evangelion）发布，这是Vue历史上的第一个重要里程碑，伴随其一同发布的还有vue-router、vuex和vue-cli，标志着Vue成为了一个成熟的渐进式框架。

3. **Vue 2.x（2016-2020）**：
   - 2016年10月，Vue 2.0发布，这是Vue的第二个重要里程碑。Vue 2.0引入了虚拟DOM的改进，优化了性能，并支持服务端渲染（SSR）。
   - Vue 2.x时代持续了数年，期间不断迭代更新，增加了如Vue CLI 3、Vue 2.6等重要更新，提升了开发者的体验和框架的性能。

4. **Vue 3.x（2020至今）**：
   - Vue 3在2020年发布，带来了显著的性能提升、更好的类型支持、Composition API等特性，使得状态管理和组件逻辑组织更加灵活。
   - Vue 3强调了对Composition API的采用，它提供了一种新的代码组织方式，与Options API并行存在，给予开发者更多选择。
   - 随着Vue 3的成熟，生态系统中的库如Vue Router、Vuex等也相应升级，以更好地配合Vue 3的功能和理念。

Vue的发展过程中，始终保持着渐进式框架的特点，即开发者可以根据需要选择框架的组成部分进行使用，这使得Vue在不同的项目规模和复杂度下都能发挥出高效率。

:::

## Vue使用方式

### 独立脚本方式

Vue可以像jQuery一样作为一个独立的JavaScript库直接引入到HTML中，适用于快速原型开发或小型项目。

**实现步骤**：

- 下载Vue.js文件或从CDN引用。
- 在HTML中引入Vue.js文件。
- 直接在页面上使用Vue实例。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Vue独立脚本示例</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
</head>
<body>
    <div id="app">
        {{ message }}
    </div>
    <script>
        new Vue({
            el: '#app',
            data: {
                message: 'Hello Vue with script tag!'
            }
        });
    </script>
</body>
</html>
```



### WebComponent

参照vue文档： [Vue 与 Web Components](https://cn.vuejs.org/guide/extras/web-components.html)

Vue可以通过Custom Elements规范（Web Components的一部分）封装成自定义元素，使其能够在任何支持Web Components的环境中使用。

**实现步骤**：

- 使用Vue的`Vue.defineComponent`和`Vue.createApp`来定义和创建组件。
- 通过`defineCustomElement`将其转换为自定义元素。
- 注册自定义元素。

**代码示例**（Vue 3）:

```javascript
// MyComponent.js
import { defineComponent, defineCustomElement } from 'vue';

const MyComponent = defineComponent({
  template: '<h1>Hello from Web Component!</h1>'
});

customElements.define('my-vue-component', defineCustomElement(MyComponent));
```

在HTML中使用自定义元素：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Vue as Web Component</title>
    <script src="https://unpkg.com/vue@next"></script>
    <script src="MyComponent.js"></script> <!-- 引入上面编写的Vue组件 -->
</head>
<body>
    <my-vue-component></my-vue-component>
</body>
</html>
```

### 使用脚手架工具

`create-vue`和`@vue/cli`都是Vue.js项目创建工具

- [**`@vue/cli`**](https://cli.vuejs.org/zh/guide/installation.html)是Vue.js官方提供的现代化的命令行工具（Vue CLI），用于快速搭建Vue项目的脚手架。它支持Vue 2和Vue 3的项目创建，并且集成了项目模板选择、配置管理、插件安装等功能。

::: tabs#Linux
@tab:active npm
```bash
npm install -g @vue/cli
# npm update -g @vue/cli

vue create hello-world
# vue ui   # 以图形化界面创建和管理项目

cd hello-world
npm run serve
```


@tab npx
```bash
npx @vue/cli create my-vue-app

cd my-vue-app
npm run serve
```
:::
早期Vue CLI的包名为`vue-cli`（主要对应Vue CLI 2.x版本），后来改名为`@vue/cli`（Vue CLI 3.x及以上版本），引入了许多改进，包括更好的配置灵活性、Vue UI图形界面、更快的项目初始化速度等

- [**`create-vue`**](https://github.com/vuejs/create-vue) 是针对Vue3的简化创建工具，专为Vue 3项目设计，使用Vite作为默认的构建工具，而非Webpack。

```bash
npm create vue@latest
# npm create vue@legacy   # Vue 2 (support IE11)

cd vue-project
npm install
npm run format
npm run dev
```




### 全栈/SSR

Vue支持 [服务器端渲染（Server-Side Rendering）](https://cn.vuejs.org/guide/scaling-up/ssr.html)，这可以改善SEO和首屏加载速度。


**实现步骤**：

- 使用`@vue/cli-plugin-ssr`或`nuxt.js`等工具。
- 配置服务器端渲染相关设置。
- 在服务器上渲染Vue应用并返回HTML字符串。

**使用Nuxt.js的示例**：

- 首先安装Nuxt.js：

```bash
npm install -g create-nuxt-app
create-nuxt-app my-ssr-app
```

- 选择需要的选项，如服务器渲染支持。
- 开发和配置应用，Nuxt.js会自动处理SSR相关的配置和路由。
- 运行应用：

```bash
cd my-ssr-app
npm run dev
```





## Vue3常见特性


### 组合式API
- Vue 2 主要使用选项式API（Options API），逻辑分散在 `data`, `methods`, `computed`, `watch` 等属性中。
- Vue 3 强烈推荐使用组合式API（Composition API），它允许你通过 `setup()` 函数集中管理组件的状态和逻辑，更易于复用和组织代码。


::: code-tabs#shell
@tab:active 选项式API

```javascript
// 选项式API（Options API）逻辑分散在 `data`, `methods`, `computed`, `watch` 等属性中
export default {
  data() {
    return {
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2;
    }
  },
  watch: {
    count(newValue, oldValue) {
      console.log(`count changed from ${oldValue} to ${newValue}`);
    }
  }
};
```

@tab 组合式API

```javascript
import { ref, computed, watch } from 'vue';
// 在组合式API中，我们使用 `ref` 来定义响应式变量，`computed` 来创建计算属性，`watch` 来观察变化
// 并通过 `setup()` 函数集中管理这些逻辑，使代码更易于理解和维护

export default {
  setup() {
    const count = ref(0);

    function increment() {
      count.value++;
    }

    const doubleCount = computed(() => count.value * 2);

    watch(count, (newValue, oldValue) => {
      console.log(`count changed from ${oldValue} to ${newValue}`);
    });

    return {
      count,
      increment,
      doubleCount
    };
  }
};
```
:::


### 生命周期钩子
- Vue 2 使用传统的生命周期钩子函数，如 `created`, `mounted`, `updated`, `destroyed` 等。
- Vue 3 引入了新的生命周期钩子，如 `setup()`，它在组件创建之初被调用，且不能访问 `this`。同时，一些原有的生命周期钩子在Vue 3中被重命名或废弃，比如 `beforeDestroy` 变为 `beforeUnmount`。




### 多根节点支持
- Vue 2 要求每个组件模板有一个根元素，否则会报错。
- Vue 3 支持多根节点，可以返回多个顶级元素，它们会被自动包裹在一个虚拟的Fragment中。


### TypeScript支持
- Vue 2 虽然可以与TypeScript一起使用，但选项式API对TypeScript的支持不如Vue 3自然。
- Vue 3 有更好的TypeScript集成，特别是在使用组合式API时，类型推导更加准确和方便。



### 响应式系统
- Vue 2 使用 `Object.defineProperty` 实现响应式。
- Vue 3 使用 `Proxy`，提供了更强大的响应式系统，可以监听数组、对象的所有属性变化，包括新增和删除。



### Vite构建工具

- Vue 2 传统上使用webpack进行构建。
- Vue 3 推荐使用Vite，它基于ES模块热更新，启动和更新速度更快。

[Vite](https://cn.vitejs.dev/) 是一个轻量级的、速度极快的构建工具，对 Vue SFC 提供第一优先级支持


::: info Vite与Webpack的区别
Vite与Webpack的一个显著区别在于，Vite的设计哲学倾向于零配置或极简配置。Vite默认情况下并不依赖于一个中心化的配置文件，如Webpack中的`webpack.config.js`，而是通过项目根目录下的`vite.config.js`（或`vite.config.ts`）来提供配置，但这个配置文件是可选的，且初始项目可能不需要任何配置即可直接运行。

当你需要自定义Vite的行为时，可以创建`vite.config.js`文件。这个配置文件通常比Webpack的配置更为简洁，因为Vite利用了ES模块的按需加载能力和浏览器原生支持的功能，减少了配置的复杂度。

```javascript
// vite.config.js
export default {
  base: '/my-project/', // 应用的基本路径
  build: {
    outDir: 'dist', // 打包输出目录
    assetsDir: 'assets', // 静态资源目录
  },
  server: {
    port: 3000, // 开发服务器端口
    host: '0.0.0.0', // 允许外部访问
  },
  plugins: [
    // 可以在这里添加Vite的插件
  ],
  // ...其他配置项
}
```

在这个配置中，你可以指定项目的基础路径、打包输出目录、开发服务器配置、以及添加自定义插件等。相比Webpack，Vite的配置通常更为直观和简洁，尤其在处理现代前端开发需求时，比如热更新、ES模块开发服务器等方面，Vite提供了开箱即用的体验。

需要注意的是，尽管Vite的配置较为简洁，但它依然提供了丰富的API和插件系统，以支持更复杂的构建需求，如别名配置、CSS预处理器集成、TypeScript配置等。
:::
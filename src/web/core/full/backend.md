--- 

order: 1
title: Node后端开发

---



Node.js 自诞生以来，凭借其非阻塞 I/O 和事件驱动的特性，在后端开发领域占据了一席之地。然而，从最初使用原生模块处理 HTTP 请求，到 Express.js 带来的便捷，再到 NestJS 提供的企业级应用架构，Node.js 的后端开发范式经历了一系列重要的演进。



## Node.js原生开发

最初，使用 Node.js 处理网络请求需要直接操作内置的 `http` 模块。开发者需要：
1.  引入 `http` 和 `url` 模块。
2.  使用 `http.createServer` 创建服务器实例。
3.  在回调函数中接收请求对象 (`req`) 和响应对象 (`res`)。
4.  手动解析请求信息：
    *   `req.url`: 获取请求路径（不含域名和端口）。
    *   `req.method`: 获取请求方法 (GET, POST 等)。
    *   `req.headers`: 获取请求头。
    *   `url.parse(req.url, true)`: 解析 URL，获取路径名 (`pathname`) 和查询参数 (`query`)。
5.  手动处理请求体（如 POST 请求）：
    *   监听 `req` 对象的 `data` 事件来接收数据片段 (chunk)。
    *   监听 `end` 事件来确认数据接收完毕。
    *   根据 `Content-Type` 请求头（如 `application/json`, `application/x-www-form-urlencoded`）选择不同的方式解析请求体数据。
6.  设置响应头 (`res.writeHead`) 并发送响应数据 (`res.end`)。
7.  启动服务器并监听指定端口 (`server.listen`)。

**原生 Node.js 处理请求的痛点：**
*   **繁琐**: 大量重复的底层代码，如解析 URL、处理请求体、设置响应头等。
*   **缺乏结构**: 没有统一的组织方式，代码容易变得混乱，难以维护和扩展。
*   **错误处理复杂**: 需要手动实现健壮的错误处理机制。

---

### 处理GET请求

**示例：原生 Node.js 处理 GET 请求**
```javascript
// native_node_get.js
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    // 解析请求的 URL
    const parsedUrl = url.parse(req.url, true);
    // 获取路径和查询参数
    const path = parsedUrl.pathname;
    const queryParams = parsedUrl.query;

    // 设置响应头
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`原生 Node: 你请求的路径是: ${path}, 查询参数是: ${JSON.stringify(queryParams)}`);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`原生 Node GET 服务器运行在 http://localhost:${PORT}/`);
});
```
---

### 处理POST请求

**原生 Node.js 处理 POST 请求**
```javascript
// native_node_post.js
const http = require('http');
const querystring = require('querystring'); // 用于解析 x-www-form-urlencoded

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // 持续接收数据片段
        });
        req.on('end', () => {
            let parsedBody;
            const contentType = req.headers['content-type'];

            if (contentType === 'application/json') {
                try {
                    parsedBody = JSON.parse(body);
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Invalid JSON');
                    return;
                }
            } else if (contentType === 'application/x-www-form-urlencoded') {
                parsedBody = querystring.parse(body);
            } else {
                parsedBody = body; // 其他类型直接作为原始数据
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: '数据接收成功', data: parsedBody }));
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('只接受 POST 请求');
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`原生 Node POST 服务器运行在 http://localhost:${PORT}/`);
});
```
可以看到，即便是简单的 GET 和 POST 请求，使用原生 Node.js 也需要编写不少模板代码，且缺乏统一的错误处理和参数解析机制。

---

## 后端相关开发框架

主要的Node.js后端框架及其简介：

1.  **Socket.io** (约 2010年：专注于实时双向通信，封装WebSocket等技术，提供简单的API。

2.  **Express.js** (约 2010年)：最经典、最流行的Node.js框架，极简、灵活、无主见，拥有庞大社区。

3.  **Restify** (约 2011年)：早期专注于构建语义正确、健壮的RESTful API服务。

4.  **DerbyJS** (约 2011年)：MVC全栈框架，专注于实时协作应用，通过Racer实现数据实时同步。

5.  **Sails.js** (约 2012年)：功能完备的MVC框架，受Ruby on Rails启发，内置ORM和自动API生成。

6.  **Hapi.js** (约 2012年，Walmart内部使用更早，后开源)：强调安全性和代码质量，配置驱动，插件丰富，适合高安全性API。

7.  **Koa.js** (约 2013年)：Express原班人马打造，更轻量，利用ES6+特性 (如async/await) 优雅处理异步。

8.  **LoopBack** (约 2013年)：由IBM支持，专注于快速创建端到端REST API，具有强大的数据建模和连接器。

9.  **Total.js** (约 2013-2014年)：提供完整解决方案的平台/框架，功能全面，包含CMS、电商等模块。

10. **Feathers.js** (约 2014年)：轻量级的实时应用和REST API构建框架，采用服务化架构。

11. **AdonisJS** (约 2015年 v1.0)：功能齐全的MVC框架，受Laravel启发，TypeScript优先，提供ORM和CLI。

12. **Strapi** (约 2015年开始开发，后续逐渐流行)：领先的开源Headless CMS，允许快速构建可定制的API并管理内容。

13. **Next.js** (约 2016年)：React生态下的现代Web框架，支持SSR、SSG和API路由，基于Node.js后端。

14. **Fastify** (约 2016年)：以高性能和低开销著称，通过JSON Schema校验和序列化，插件架构良好。

15. **Egg.js** (约 2016-2017年，阿里内部使用更早，后开源)：阿里巴巴出品的企业级框架，基于Koa，遵循“约定优于配置”，适合大型应用。

16. **Moleculer** (约 2016-2017年)：快速、可扩展的渐进式微服务框架，提供微服务核心功能。

17. **Nest.js** (约 2017年)：现代化的框架，基于TypeScript，深受Angular启发，适合构建微服务和大型应用。

18. **Polka** (约 2017年)：极其轻量和快速的Web服务器，可作为Express的极简替代品。

---






### Express.js

Express.js 在原生 Node.js 的基础上做了大量封装，大大简化了 Web 应用的开发。
*   **路由系统**: 提供了更简洁的路由定义方式 (`app.get()`, `app.post()` 等)。
*   **中间件**: 强大的中间件机制，方便处理请求预处理、日志、错误处理等。
*   **请求参数获取**: 内置了对 URL 参数、查询参数和请求体的解析。
    *   `req.path`: 获取路径。
    *   `req.query`: 获取查询参数对象。
    *   `req.body`: (通过中间件如 `express.json()` 或 `express.urlencoded()`) 获取解析后的请求体。

**示例：Express.js 处理 GET 请求**
```javascript
// express_get.js
const express = require('express');
const app = express();
const PORT = 3002;

app.get('/', (req, res) => {
    const path = req.path;
    const queryParams = req.query;
    res.send(`Express 说: 你请求的路径是: ${path}, 查询参数是: ${JSON.stringify(queryParams)}`);
});

app.listen(PORT, () => {
    console.log(`Express GET 服务器跑起来啦, 在 http://localhost:${PORT}`);
});
```

**示例：Express.js 处理 POST 请求**
```javascript
// express_post.js
const express = require('express');
const app = express();
const PORT = 3003;

// 使用中间件来解析 JSON 和 URL 编码的请求体
app.use(express.json()); // 解析 application/json
app.use(express.urlencoded({ extended: true })); // 解析 application/x-www-form-urlencoded

app.post('/submit', (req, res) => {
    const bodyData = req.body; // 直接获取解析后的请求体数据
    res.send(`Express 说: 收到了你的 POST 数据: ${JSON.stringify(bodyData)}`);
});

app.listen(PORT, () => {
    console.log(`Express POST 服务器跑起来啦, 在 http://localhost:${PORT}`);
});
```
Express 极大地简化了开发，但当项目规模变大时，代码组织仍然是一个挑战。开发者需要自行决定如何组织路由、控制器、服务等，这可能导致不同开发者或不同项目之间的代码风格迥异，维护性下降。

**Express.js 的灵活性与问题：**
*   **优点**: 轻量、灵活、庞大的社区和丰富的中间件。
*   **问题**:
    *   **缺乏强制的架构**: 开发者需要自行组织代码，项目一大，不同开发者的代码风格五花八门，路由和业务逻辑管理可能变得混乱。
    *   **维护性挑战**: 自由度过高有时反而导致维护成本增加，尤其是在团队协作中。

---


### Koa.js

Koa.js 是由 Express 原班人马打造的下一代 Node.js Web 框架，旨在提供一个更小、更富有表现力、更健壮的 Web 应用和 API 的开发基础。Koa 不在内核方法中绑定任何中间件，它把所有内容都交给优雅的中间件栈来处理。
*   **Context (ctx) 对象**: Koa 将 Node.js 的 `request` 和 `response` 对象封装到单个 `ctx` 对象中，为编写 Web 应用和 API 提供了更方便的接口。
*   **中间件 (Async/Await)**: Koa 的中间件基于 `async/await` 实现，以一种级联的方式执行，使得异步代码的编写和错误处理更加直观和简单。
*   **请求参数获取**:
    *   `ctx.path`: 获取请求路径。
    *   `ctx.query`: 获取解析后的查询参数对象。
    *   `ctx.request.body`: (需要配合中间件如 `koa-bodyparser`) 获取解析后的请求体。

**示例：Koa.js 处理 GET 请求**
```javascript
// koa_get.js
const Koa = require('koa');
const Router = require('koa-router'); // Koa 推荐使用独立的路由中间件
const app = new Koa();
const router = new Router();
const PORT = 3004;

router.get('/', async (ctx) => {
    const path = ctx.path;
    const queryParams = ctx.query;
    ctx.body = `Koa 说: 你请求的路径是: ${path}, 查询参数是: ${JSON.stringify(queryParams)}`;
});

app.use(router.routes()).use(router.allowedMethods()); // 加载路由中间件

app.listen(PORT, () => {
    console.log(`Koa GET 服务器跑起来啦, 在 http://localhost:${PORT}`);
});
```

**示例：Koa.js 处理 POST 请求**
```javascript
// koa_post.js
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser'); // 用于解析请求体的中间件
const app = new Koa();
const router = new Router();
const PORT = 3005;

app.use(bodyParser()); // 使用 bodyParser 中间件

router.post('/submit', async (ctx) => {
    const bodyData = ctx.request.body; // 获取解析后的请求体数据
    ctx.body = `Koa 说: 收到了你的 POST 数据: ${JSON.stringify(bodyData)}`;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`Koa POST 服务器跑起来啦, 在 http://localhost:${PORT}`);
});
```
Koa 通过其现代的 `async/await` 语法和 `ctx` 对象简化了异步流程控制和请求/响应处理。但与 Express 类似，Koa 核心非常轻量，许多功能（如路由、请求体解析）依赖第三方中间件，项目结构依然需要开发者自行规划。

**Koa.js 的特点与挑战：**
*   **优点**: 更现代的 `async/await` 中间件流程，`ctx` 对象设计优雅，核心轻量，提供了高度的定制化能力。
*   **问题**:
    *   **最小内核**: 核心功能非常精简，大部分常用功能 (如路由、请求体解析、静态文件服务等) 都需要引入额外的中间件。
    *   **与 Express 类似的架构自由度**: 开发者仍需自行决定项目的组织结构。虽然 `async/await` 改善了代码可读性，但在大型项目中，缺乏统一的架构指导可能导致与 Express 类似的代码组织和维护性问题。

---

### Fastify

Fastify 是一个高性能、低开销的 Web 框架，专注于提供最佳的开发者体验和出色的性能。它通过智能的路由和插件架构，以及对 JSON Schema 的原生支持来实现这些目标。
*   **高性能**: Fastify 的设计哲学之一就是速度，其路由和 JSON 处理都经过了高度优化。
*   **插件化架构**: 核心保持精简，功能通过可重用的插件进行扩展。Fastify 拥有一个完善的插件生态系统。
*   **Schema 校验**: 强烈推荐并原生支持使用 JSON Schema 来校验路由、请求体和响应体，这不仅可以提高应用的健壮性，还能自动生成 OpenAPI (Swagger) 文档。
*   **请求参数获取**:
    *   `request.url` (原始 URL) 或 `request.routerPath` (匹配的路由路径模式)。
    *   `request.query`: 获取查询参数对象。
    *   `request.body`: Fastify 默认会解析 `application/json` 和 `application/x-www-form-urlencoded` 类型的请求体。

**示例：Fastify 处理 GET 请求**
```javascript
// fastify_get.js
const fastify = require('fastify')({ logger: true }); // 推荐开启日志
const PORT = 3006;

fastify.get('/', async (request, reply) => {
    // request.url 包含查询参数, request.routerPath 是定义的路径模式
    // 为了与 Express 的 req.path 行为类似 (仅路径部分), 可以用 request.raw.url.split('?')[0]
    const path = request.raw.url.split('?')[0];
    const queryParams = request.query;
    reply.send(`Fastify 说: 你请求的路径是: ${path}, 查询参数是: ${JSON.stringify(queryParams)}`);
});

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
        fastify.log.info(`Fastify GET 服务器在 http://localhost:${PORT} 上待命`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
```

**示例：Fastify 处理 POST 请求**
```javascript
// fastify_post.js
const fastify = require('fastify')({ logger: true });
const PORT = 3007;

// Fastify 默认支持解析 'application/json' 和 'application/x-www-form-urlencoded'
// 如果需要其他类型的解析器，可以通过 fastify.addContentTypeParser() 添加

fastify.post('/submit', async (request, reply) => {
    const bodyData = request.body; // 直接获取解析后的请求体数据
    reply.send(`Fastify 说: 收到了你的 POST 数据: ${JSON.stringify(bodyData)}`);
});

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
        fastify.log.info(`Fastify POST 服务器在 http://localhost:${PORT} 上待命`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
```
Fastify 以其出色的性能和对 Schema 的强调脱颖而出。它的插件系统和封装概念 (encapsulation) 有助于构建模块化和结构化的应用，这在一定程度上缓解了 Express 和 Koa 在大型项目中可能遇到的代码组织问题。

**Fastify 的优势与考量：**
*   **优点**:
    *   **极高的性能**: 通常是 Node.js Web 框架中性能最好的之一。
    *   **内置 Schema 校验**: 提升数据可靠性，并易于生成 API 文档。
    *   **强大的插件系统与封装**: 有助于代码组织和模块化，更利于大型项目维护。
    *   **良好的开发者体验**: API 设计友好，自带日志等功能。
*   **考量**:
    *   **相对较小的社区和生态**: 虽然增长迅速，但与 Express 相比，社区规模和第三方插件数量仍有差距。
    *   **一定的学习曲线**: 其插件架构、封装（encapsulation）和 Hooks 等概念可能需要开发者花一些时间来熟悉。但这种结构化特性往往能带来长期的维护优势。
    *   **更“有主张” (Opinionated)**: Fastify 在某些方面比 Express 更具主张性 (例如推荐使用 Schema)，这对于喜欢完全自由的开发者可能需要适应，但对于追求规范和性能的团队则是一个优点。




---

### NestJS

NestJS 站在 Express（或 Fastify）的肩膀上，提供了一个更高级别、更结构化的应用框架。它引入了许多现代后端框架（如 Java Spring, Angular）的设计理念，旨在解决 Express 等框架在大型应用中遇到的架构问题。

**NestJS 的核心价值：**
1.  **提供强大的应用架构**:
    *   借鉴了 Angular 的模块化、组件化思想。
    *   引入了**模块 (Modules)**、**控制器 (Controllers)**、**服务 (Services)**、**提供者 (Providers)**、**DTO (Data Transfer Objects)**、**装饰器 (Decorators)**、**依赖注入 (Dependency Injection)** 等概念。
    *   这种架构使得大型应用的开发和维护变得更加规范和高效。

2.  **TypeScript 原生支持**:
    *   NestJS 的第一行代码就是用 TS 构建的，与 TS 结合得非常好，充分利用了强类型带来的优势。

3.  **面向切面编程 (AOP)**:
    *   通过**守卫 (Guards)**、**拦截器 (Interceptors)**、**管道 (Pipes)**、**异常过滤器 (Exception Filters)** 等机制，优雅地处理横切关注点（如认证、授权、数据校验与转换、日志、错误处理）。

4.  **平台无关性**:
    *   虽然默认使用 Express，但可以轻松切换到 Fastify 等其他 HTTP 平台，核心业务逻辑保持不变。

**示例：NestJS 处理 GET 和 POST 请求 (使用装饰器和 DTO)**

```typescript
// 在一个 controller.ts 文件中 (通常在特定模块下)
import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto'; // 假设的 DTO

@Controller('items') // 路由前缀 /items
export class ItemsController {

    // GET /items/:id?version=1
    @Get(':id')
    findItemById(
        @Param('id', ParseIntPipe) id: number, // 从路径中获取 id, 并通过 ParseIntPipe 转换为数字
        @Query('version') version: string,   // 从查询参数中获取 version
    ): string {
        return `你要找的商品 ID 是: ${id}, 版本是: ${version || '未指定'}`;
    }

    // POST /items
    @Post()
    createItem(@Body() createItemDto: CreateItemDto): string { // 使用 DTO 接收和校验请求体
        // createItemDto.name, createItemDto.price 可以直接使用
        return `成功创建商品: ${createItemDto.name}, 价格: ${createItemDto.price}`;
    }
}

// dto/create-item.dto.ts
export class CreateItemDto {
    readonly name: string;
    readonly price: number;
}
```
在 NestJS 中：
*   **控制器和方法**使用装饰器 (`@Controller`, `@Get`, `@Post`) 声明路由。
*   **请求参数**通过装饰器 (`@Param`, `@Query`, `@Body`) 注入到方法参数中，清晰明了。
*   **数据校验和转换**可以通过管道 (Pipes) 优雅地实现，如 `ParseIntPipe`。
*   **请求体**通常使用 DTO 进行封装和校验，提高了代码的可读性和健壮性。
*   **响应**: NestJS 会自动处理响应。默认情况下，如果方法返回一个基本类型、数组或对象，NestJS 会自动将其序列化为 JSON（或基于 `Accept` 头的其他格式）并设置合适的 `Content-Type`。你无需手动调用 `res.send()` 或 `res.json()` (除非有特殊需求)。

**NestJS 与 Egg.js/MidwayJS 的比较：**
*   **生态**: NestJS 拥有庞大且高度活跃的全球开发者社区。Egg.js 和 MidwayJS 主要面向国内和中文用户，由阿里开发。
*   **架构**:
    *   NestJS 依赖注入、模块系统、装饰器等架构模式借鉴了 Java Spring 和 Angular，已经非常成熟和经过广泛验证，非常适合大型项目。
    *   Egg.js 和 MidwayJS 在这方面也在不断进步，MidwayJS 也学习并引入了依赖注入等。
*   **TS 原生性**:
    *   NestJS 的第一行代码就是用 TS 构建，所有特性都与 TS 融合得非常好。
    *   Egg.js 的 TS 支持是后续加入的，并非框架设计的核心。MidwayJS 虽然也是 TS 优先，但在与 Nest 深度融合的 TS 特性上，Nest 更胜一筹。

## Node后端框架的选择

1.  **原生 Node.js**: 最底层，最基础，但用起来麻烦。
2.  **Express.js**: 在原生基础上做了封装，大大简化了 Web 开发，提供了路由、中间件等核心功能，非常灵活。但其灵活性也导致在大型项目中缺乏统一的架构规范。
3.  **NestJS**: 更进一步，基于 Express (或可切换成 Fastify)，引入了 TypeScript、装饰器、模块化、依赖注入等概念，提供了一套强大的、约定优于配置的架构。这使得：
    *   **开发更规范**: 代码组织清晰，职责分明。
    *   **维护更容易**: 不同开发者写的代码风格趋于一致，可读性高。
    *   **大型应用友好**: 其架构模式非常适合构建复杂、可扩展的企业级应用。
    *   **开箱即用**: 提供了许多内置功能和最佳实践，如 WebSocket、GraphQL、微服务支持、全局生态等。

NestJS 通过提供一个结构化的框架，让开发者能够将精力更多地放在业务逻辑的实现上，而不是花费大量时间去思考和搭建应用的基础架构。它强制了一定的规范，但这种规范最终会带来更高的开发效率和更好的代码质量，尤其是在团队协作和长期项目维护中。
--- 

order: 20
title: NestJs

---

## NestJS简介

NestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。它借鉴了许多 Java Spring 框架的设计理念，并引入了许多新的概念和特性，旨在为开发者提供一个开箱即用的应用架构，从而能够轻松构建出结构清晰、易于维护的应用程序。

1.  **核心语言与范式**：
    *   NestJS 主要使用 **TypeScript (TS)** 编写，充分利用其强类型特性带来的开发时优势和代码可维护性，但同时也支持使用纯 JavaScript (JS) 进行开发。
    *   它巧妙地融合了**面向对象编程 (OOP)**、**函数式编程 (FP)** 以及**函数响应式编程 (FRP)** 的优点，为开发者提供了灵活多样的编程选择。

2.  **底层与抽象**：
    *   默认情况下，NestJS 的底层 HTTP 服务器框架是 **Express**，这是一个在 Node.js 社区中广泛使用且成熟的框架。如果对性能有极致追求，NestJS 也允许开发者轻松切换到底层为 **Fastify** 的实现。
    *   NestJS 在这些底层框架（如 Express 或 Fastify）之上提供了一个高级**抽象层**，这使得开发者不必直接处理底层框架的细节，而是通过 NestJS 提供的模块化、面向切面的方式进行开发。
    *   尽管提供了抽象，NestJS 依然保持了**灵活性**，允许开发者在需要时直接访问和使用底层平台（如 Express 的 `req`, `res` 对象）的 API。

NestJS 鼓励使用**模块化**的方式来组织代码。每个模块都有自己的范围，包含控制器、服务、数据传输对象 (DTO)、守卫、过滤器等。这种模块化的设计使得代码结构清晰，易于维护。

::: tip 为什么选择 NestJS？它解决了什么痛点？

1.  **弥补 Node.js 后端架构的空白**：
    *   Node.js 本身提供的原生 API（如 `http.createServer`）功能非常基础，直接用它们构建复杂应用效率低下。
    *   虽然 Express 和 Koa 等框架非常流行，但它们本身更像是一个轻量级的请求处理“架子”，缺乏完整的、约定俗成的应用架构。开发者在使用它们时，往往需要自行组织路由、中间件、依赖管理、模块化等，当项目规模逐渐增大后，代码结构容易变得混乱，维护成本随之升高。
    *   NestJS 解决了这一痛点，它提供了一个经过深思熟虑的应用架构（深受 Angular 启发），包含了模块、控制器、服务等明确的组织单元，使得开发者能够轻松构建出结构清晰、高内聚、低耦合且易于测试和维护的应用程序。

2.  **完善的架构与规范**：
    *   **模块化设计**：NestJS 强制或强烈建议使用模块 (Module) 来组织应用。每个模块可以包含自己的控制器 (Controller)、服务 (Service)、数据传输对象 (DTO)、守卫 (Guard)、过滤器 (Filter) 等，各司其职，边界清晰。
    *   **代码组织**：基于其架构，什么代码应该放在哪里，什么文件实现什么功能，都有比较明确的规范和最佳实践，这使得团队协作更加顺畅，新成员也更容易理解和接手项目。
    *   NestJS 的架构设计适用于各种规模的项目，无论是小型应用还是大型企业级系统，都能从中受益。
:::


## NestJS基础概览

### Nest CLI

NestJS 提供了一个强大的命令行界面工具 (Nest CLI)，通过 `@nestjs/cli` 包安装。它能够极大地简化项目的创建和维护工作，帮助开发者快速搭建项目骨架和生成各种组件。

常用命令包括：
*   `nest new <project-name>`: 创建一个新的 NestJS 项目。
*   `nest generate module <module-name>` (或 `nest g mo <module-name>`): 生成一个新的模块。
*   `nest generate controller <controller-name>` (或 `nest g co <controller-name>`): 生成一个新的控制器。
*   `nest generate service <service-name>` (或 `nest g s <service-name>`): 生成一个新的服务。
*   类似地，还可以生成 `guard`, `pipe`, `interceptor`, `filter` 等。

使用 Nest CLI 可以确保项目结构的一致性，并自动处理一些基础的配置和导入，提高开发效率。

---

### 路由 (Route)

在 Web 应用中，我们通过不同的 URL 地址来访问不同的功能或资源。例如：
*   `/user/create` (用于创建用户)
*   `/user/list` (用于查看用户列表)
*   `/book/create` (用于添加新的书籍)
*   `/book/list` (用于查看书籍列表)

这些不同的网址路径，在 NestJS 中就被称为“路由 (Route)”。它们是应用程序的入口点，负责将特定的 HTTP 请求导向到相应的处理逻辑。

---

### 控制器 (Controller)

控制器 (Controller) 负责处理传入的请求并将响应返回给客户端。你可以将控制器想象成一个“交通警察”，它根据请求的路由（URL 和 HTTP 方法），决定将请求分派给哪个具体的处理函数。

```typescript
// src/app.controller.ts
import { Controller, Get } from '@nestjs/common'; // 从 @nestjs/common 导入 Controller 和 Get 装饰器
import { AppService } from './app.service';     // 导入 AppService

@Controller() // @Controller() 装饰器将这个类标记为一个控制器。
              // 括号内可以指定该控制器下所有路由的统一前缀，例如 @Controller('users')
export class AppController {
  // 通过构造函数注入 AppService 的实例
  // private readonly appService: AppService 是一种 TypeScript 的简写形式，
  // 它会自动创建同名的私有只读成员变量，并将注入的实例赋值给它。
  constructor(private readonly appService: AppService) {}

  @Get() // @Get() 装饰器将 HTTP GET 请求映射到这个 getHello 方法。
         // 括号内可以指定该路由的子路径，例如 @Get('hello')
  getHello(): string {
    // 调用 AppService 中的方法来获取数据或执行业务逻辑
    return this.appService.getHello();
  }
}
```

*   **装饰器 (Decorators)**：NestJS 大量使用装饰器（一种特殊的声明，可以附加到类声明、方法、访问符、属性或参数上）。
    *   `@Controller()`：用于声明一个类是控制器。
    *   `@Get()`：将 HTTP GET 请求映射到类中的特定方法。类似地，还有 `@Post()`, `@Put()`, `@Delete()`, `@Patch()` 等装饰器，分别对应不同的 HTTP 方法。
*   **处理器 (Handler)**：控制器中具体负责处理某个路由请求的方法，我们称之为“处理器 (Handler)”。在上面的例子中，`getHello()` 方法就是一个处理器。

---


### 获取请求数据

客户端在发起请求时，通常会携带一些数据，比如 URL 路径中的参数、URL 查询字符串中的参数，或者请求体中的数据。NestJS 提供了多种方便的装饰器来获取这些数据：

*   **`@Param()`**: 用于提取 URL 路径中的动态参数。
    例如，对于路由 `/cats/:id`，可以使用 `@Param('id') id: string` 来获取路径中 `id` 的值。
    ```typescript
    @Get(':id')
    findOne(@Param('id') id: string): string {
      return `This action returns cat with id: #${id}`;
    }
    ```

*   **`@Query()`**: 用于提取 URL 查询字符串中的参数。
    例如，对于 URL `/cats?name=Tom&age=2`，可以使用 `@Query('name') name: string` 来获取 `name` 的值。
    ```typescript
    @Get()
    findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
      return `This action returns all cats (limit: ${limit}, offset: ${offset})`;
    }
    ```

*   **`@Body()`**: 用于提取 HTTP 请求体中的数据，通常用于 `POST` 或 `PUT` 请求。
    ```typescript
    @Post()
    async create(@Body() createCatDto: CreateCatDto) {
      // createCatDto 会包含请求体中的 JSON 数据
      return 'This action adds a new cat';
    }
    ```

---

###  DTO数据传输对象

在处理请求体数据时，我们通常会定义一个 DTO (Data Transfer Object)。DTO 是一个简单的类或接口，专门用来定义和封装请求或响应数据的结构。使用 DTO 的好处是：
*   **结构清晰**：明确了期望的数据格式。
*   **类型安全**：结合 TypeScript，可以在编译时进行类型检查。
*   **数据校验**：可以配合 NestJS 的 `ValidationPipe` 等管道对传入的数据进行校验。

```typescript
// src/cats/dto/create-cat.dto.ts
export class CreateCatDto {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}
```
在控制器中使用：
```typescript
// src/cats/cats.controller.ts
import { CreateCatDto } from './dto/create-cat.dto';

@Post()
async create(@Body() catData: CreateCatDto) {
  // catData 是一个 CreateCatDto 类型的实例
  this.catsService.create(catData);
}
```
这个流程可以简化为：`请求 -> DTO (数据封装与校验) -> Controller`。

---

### 服务 (Service)

控制器 (Controller) 的主要职责是处理 HTTP 请求的路由和参数，而不应该包含过多的业务逻辑。具体的业务逻辑，如数据存取、复杂计算、与其他服务的交互等，都应该放在服务 (Service) 层中。

服务是一个由 `@Injectable()` 装饰器标记的类，它可以被注入到控制器或其他服务中。这种分离使得代码更加模块化、可测试和可维护。

控制器负责“传达指令”和“解析参数”，而服务则负责“执行核心任务”。

```typescript
// src/cats/cats.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface'; // 假设 Cat 接口定义了猫的结构
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable() // @Injectable() 装饰器使这个类成为一个可以被 Nest IoC 容器管理的提供者
export class CatsService {
  private readonly cats: Cat[] = []; // 示例：用一个数组模拟数据库

  create(cat: CreateCatDto): Cat {
    const newCat = { id: Date.now(), ...cat };
    this.cats.push(newCat);
    console.log('Service: Creating cat:', newCat);
    return newCat;
  }

  findAll(): Cat[] {
    console.log('Service: Finding all cats');
    return this.cats;
  }

  findOne(id: number): Cat {
    console.log('Service: Finding cat with id:', id);
    const cat = this.cats.find(cat => cat.id === id);
    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return cat;
  }
}
```
在控制器中注入并使用服务：
```typescript
// src/cats/cats.controller.ts
import { Controller, Get, Post, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {} // 通过构造函数注入 CatsService

  @Post()
  @HttpCode(201) // 设置成功创建的 HTTP 状态码为 201
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    console.log('Controller: Received create request with data:', createCatDto);
    return this.catsService.create(createCatDto); // 调用服务的方法处理业务逻辑
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    console.log('Controller: Received findAll request');
    return this.catsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Cat> { // ParseIntPipe 将路径参数 'id' 转换为数字
    console.log('Controller: Received findOne request for id:', id);
    return this.catsService.findOne(id);
  }
}
```

---


### 模块 (Module)

随着应用功能的增加，控制器和服务的数量也会增多。为了更好地组织代码，避免所有组件都堆积在根模块中，NestJS 引入了模块 (Module) 的概念。模块是具有 `@Module()` 装饰器的类，它可以将相关的控制器、服务以及其他模块组织在一起，形成一个高内聚的功能单元。

例如，我们可以创建一个 `UsersModule` 来管理所有与用户相关的组件（如 `UserController`, `UserService`），再创建一个 `BooksModule` 来管理书籍相关的组件。

```typescript
// src/app.module.ts (通常是根模块)
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';
// 假设我们有 UsersModule
// import { UsersModule } from './users/users.module';

@Module({
  imports: [/* UsersModule */], // 如果需要使用其他模块导出的提供者，在这里导入它们
  controllers: [CatsController],  // 列出该模块中包含的控制器
  providers: [CatsService],     // 列出该模块中包含的提供者（如服务）
})
export class AppModule {}
```
`@Module()` 装饰器接受一个对象，其中：
*   `imports`: 导入其他模块，使得本模块可以使用被导入模块导出的提供者。
*   `controllers`: 注册本模块内的控制器。
*   `providers`: 注册本模块内的提供者（如服务）。Nest IoC 容器会实例化这些提供者，并使其可以在模块内共享。
*   `exports`: （可选）导出本模块的提供者，以便其他模块可以导入并使用它们。


---



### 实体 (Entity)

当我们的服务需要与数据库进行交互时，通常会使用到实体 (Entity)。实体是程序代码中对数据库表结构的一种对象化表示。例如，如果数据库中有一张名为 `users` 的用户表，那么在代码中可能会定义一个 `User` 实体类，该类的属性（如 `id`, `username`, `email`）对应于 `users` 表中的列。

NestJS 通常与 TypeORM 或 Mongoose (针对 MongoDB) 等 ORM/ODM 库结合使用来操作数据库和定义实体。

```typescript
// src/users/entities/user.entity.ts
// 使用 TypeORM 示例
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users') // @Entity('users') 将这个类映射到数据库中的 'users' 表
export class User {
  @PrimaryGeneratedColumn('uuid') // 定义 id 为主键，并使用 uuid 生成策略
  id: string;

  @Column({ length: 50, unique: true }) // 定义 username 列，长度限制50，且值唯一
  username: string;

  @Column({ length: 100 }) // 定义 password 列
  password: string;

  @Column({ name: 'email_address', length: 100, unique: true }) // 定义 email 列，指定列名为 email_address
  email: string;

  @Column({ default: true }) // 定义 isActive 列，默认为 true
  isActive: boolean;

  @CreateDateColumn() // 自动在插入时记录创建时间
  createdAt: Date;

  @UpdateDateColumn() // 自动在更新时记录修改时间
  updatedAt: Date;
}
```
通过使用这些装饰器，我们定义了实体与数据库表之间的映射关系，ORM 库会根据这些定义来生成 SQL 查询或数据库操作。

### MVC 模式

NestJS 的整体架构思想与经典的 MVC (Model-View-Controller) 模式非常相似，尽管在纯 API 应用中 "View" 的概念有所不同。

*   **M (Model)**: 模型层，在 NestJS 中通常对应**服务层 (Service)** 和**数据访问层 (Repository/DAO)**，以及它们操作的**实体 (Entity)** 和底层**数据库**。它们负责处理业务逻辑和数据持久化。
*   **V (View)**: 视图层，在传统的 Web 应用中指用户界面。在构建 API 时，"View" 可以被理解为**数据的表现形式**，即控制器如何将处理结果序列化 (例如转换为 JSON 格式) 并返回给客户端。
*   **C (Controller)**: 控制器层，与前面介绍的一致，负责接收和解析 HTTP 请求，调用相应的服务处理业务，并将服务返回的结果组织成响应发送给客户端。

**一个典型的请求处理流程如下**：
`客户端请求 -> Controller -> Service -> Repository/DAO (与数据库交互) -> 数据库 -> (数据返回) Repository/DAO -> Service -> Controller -> 客户端响应`

---

## NestJS核心特性

### IoC 与 DI

控制反转 (IoC, Inversion of Control) 和依赖注入 (DI, Dependency Injection) 是 NestJS 的核心特性，也是现代框架中常见的设计模式。

简单来说，**你不再需要手动创建和管理对象的实例及其依赖关系**。
*   当你定义一个服务 (如 `CatsService`) 并用 `@Injectable()` 标记它时，NestJS 的 IoC 容器就知道了如何创建这个服务的实例。
*   当一个控制器 (如 `CatsController`) 需要使用这个服务时，你只需要在控制器的构造函数中声明这个依赖 (如 `constructor(private readonly catsService: CatsService)`)。
*   NestJS 的 IoC 容器会自动解析这个依赖，找到（或创建）`CatsService` 的实例，并将其“注入”到 `CatsController` 中。

你不需要关心 `CatsService` 是如何被创建和初始化的，IoC 容器替你完成了这些工作。这大大降低了组件之间的耦合度，并使得代码更易于测试和维护。

注入依赖主要有两种方式：
1.  **构造器注入 (Constructor Injection)**：这是最常见也是推荐的方式，通过在类的构造函数参数中声明依赖。
    ```typescript
    constructor(private readonly catsService: CatsService) {}
    ```
2.  **属性注入 (Property Injection)**：较少使用，可以通过 `@Inject()` 装饰器直接在类属性上声明依赖。
    ```typescript
    @Inject(CatsService)
    private readonly catsServiceInstance: CatsService;
    ```
---


### AOP (面向切面编程)

面向切面编程 (AOP, Aspect Oriented Programming) 是一种编程范式，它允许开发者将横切关注点（cross-cutting concerns，即那些分散在应用中多个模块的通用功能，如日志记录、权限校验、事务管理、性能监控等）从核心业务逻辑中分离出来，形成独立的“切面 (Aspect)”。

NestJS 提供了多种实现 AOP 的机制，它们可以在请求处理流程的不同阶段“切入”，执行这些通用逻辑，而无需在每个控制器或服务方法中重复编写相同的代码。

NestJS 中主要的 AOP 组件包括：

*   **中间件 (Middleware)**: 在路由处理程序执行**之前**被调用。主要用于处理原始的请求 (request) 和响应 (response) 对象，或者调用 `next()` 函数将控制权传递给下一个中间件或路由处理器。与 Express 中间件类似。
*   **守卫 (Guard)**: 在路由处理器执行**之前**运行，主要用于**权限控制**。守卫会根据特定条件（如用户角色、Token 有效性）决定当前请求是否被允许访问目标处理器。
*   **拦截器 (Interceptor)**: 功能非常强大，可以在路由处理器执行的**之前和之后**绑定额外的逻辑。它们可以：
    *   转换方法返回的结果。
    *   转换方法抛出的异常。
    *   扩展基础方法行为。
    *   完全覆盖一个方法。
    *   例如，记录请求响应时间、缓存响应结果、统一响应格式等。
*   **管道 (Pipe)**: 在路由处理器执行**之前**，对传入的参数进行**数据转换**（如将字符串转换为数字）和**数据校验**（如检查参数是否符合特定格式或规则）。
*   **异常过滤器 (Exception Filter)**: 用于捕获在应用中未被处理的异常，并根据异常类型发送一个定制化的、对用户友好的响应。

这些组件构成了 NestJS 中一个精妙的请求处理流水线：
`请求 -> 全局中间件 -> 模块中间件 -> 全局守卫 -> 控制器守卫 -> 路由守卫 -> 全局拦截器 (前置) -> 控制器拦截器 (前置) -> 路由拦截器 (前置) -> 全局管道 -> 控制器管道 -> 路由管道 -> 路由参数管道 -> 控制器 (处理器方法) -> 路由拦截器 (后置) -> 控制器拦截器 (后置) -> 全局拦截器 (后置) -> (若发生异常) 异常过滤器 -> 响应`


---




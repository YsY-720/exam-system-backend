# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## 常用命令

- 安装依赖：`pnpm install`
- 构建默认应用：`pnpm build`
- 构建指定 Nest 项目：`pnpm nest build user`、`pnpm nest build exam`、`pnpm nest build answer`、`pnpm nest build analyse`
- 启动默认应用：`pnpm start`
- watch 启动默认应用：`pnpm start:dev`
- debug 启动默认应用：`pnpm start:debug`
- 生产启动默认应用：`pnpm start:prod`
- 格式化应用和库源码：`pnpm format`
- ESLint 自动修复：`pnpm lint`
- 运行全部单元测试：`pnpm test`
- watch 测试：`pnpm test:watch`
- 覆盖率测试：`pnpm test:cov`
- 调试测试：`pnpm test:debug`
- e2e 测试：`pnpm test:e2e`
- 运行单个测试文件：`pnpm jest path/to/file.spec.ts`
- Prisma 生成客户端：`pnpm prisma generate`

## 项目架构

这是一个 NestJS monorepo，`nest-cli.json` 中开启了 `monorepo: true`，默认根应用是 `apps/exam-system-backend`。

主要应用位于 `apps/`：

- `apps/exam-system-backend`：默认 Nest 应用。
- `apps/user`：用户服务，入口为 `apps/user/src/main.ts`，默认监听 `3001`。
- `apps/exam`：考试服务，入口为 `apps/exam/src/main.ts`，同时启动 TCP 微服务，端口 `8888`，HTTP 默认监听 `3002`。
- `apps/answer`：答题相关服务。
- `apps/analyse`：分析相关服务。

共享库位于 `libs/`：

- `libs/prisma`：封装 PrismaModule 和 PrismaService，通过 `@app/prisma` 路径别名引用。
- `libs/redis`：封装 RedisModule 和 RedisService，通过 `@app/redis` 路径别名引用。

TypeScript 路径别名在根 `tsconfig.json` 中配置：

- `@app/prisma` -> `libs/prisma/src`
- `@app/redis` -> `libs/redis/src`

## Prisma 与数据库

Prisma schema 位于 `prisma/schema.prisma`，当前使用 Prisma 7 的新 generator：

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../libs/prisma/generated/prisma"
  moduleFormat = "cjs"
}
```

生成客户端输出到 `libs/prisma/generated/prisma`，`PrismaService` 从 `../generated/prisma/client` 导入 `PrismaClient`，并使用 `@prisma/adapter-mariadb` 连接 MySQL/MariaDB。

`.env` 中需要提供数据库连接配置，当前代码通过 `@nestjs/config` 的 `ConfigService` 读取：

- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_NAME`
- `DATABASE_URL` 供 Prisma CLI 使用

`PrismaModule` 中引入了 `ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" })`，使配置在导入 `PrismaModule` 的应用中可用。

## 构建注意事项

项目使用 `module: "nodenext"` 和 `moduleResolution: "nodenext"`。Nest CLI 当前启用 webpack 构建。

由于 Prisma 7 生成的 TypeScript 文件内部会使用 `.js` 后缀导入，例如从 `client.ts` 导入 `./internal/class.js`，但源码文件实际是 `.ts`，根目录 `webpack.config.js` 配置了：

```js
extensionAlias: {
  ".js": [".js", ".ts"],
}
```

不要随意删除这个配置，否则 webpack 构建可能无法解析 Prisma 生成客户端中的相对导入。

## 测试配置

Jest 配置在 `package.json` 中：

- 测试根目录包含 `apps/` 和 `libs/`。
- 使用 `ts-jest` 转换 TypeScript。
- `moduleNameMapper` 映射 `@app/prisma` 和 `@app/redis` 到对应库源码。
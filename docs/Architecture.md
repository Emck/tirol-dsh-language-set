# Architecture

> `@tirol/dsh-language-set` v0.1.3 — 架构设计文档

## 项目定位

`@tirol/dsh-language-set` 是一个 **DSH Cordis 插件**，用于通过系统提示词注入（System Prompt Injection）分别控制 AI 的回复语言和思维语言。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| TypeScript | 6.0.3 | 开发语言，编译目标 ES2024 |
| tsdown | 0.22.14 | ESM 构建工具 |
| Vitest | 4.1.11 | 单元测试框架 |
| @deepseek-ai/schemastery | ^3.18.2 | 运行时 Schema 校验 |
| @deepseek-ai/cordis | ^4.0.2 | DSH 插件框架 |
| Node.js | >=22.19.0 || >=24.0.0 | 运行环境要求 |

## 项目结构

```
.
├── src/                    # TypeScript 源码
│   ├── index.ts            # 插件入口：name, inject, apply
│   └── config.ts           # Config Schema 定义
├── tests/                  # 单元测试
│   ├── index.spec.ts      # 插件导出验证
│   └── config.spec.ts     # 配置测试
├── lib/                    # 构建产物 (ESM + .d.mts)
│   ├── index.mjs           # ESM 模块
│   ├── index.d.mts         # TypeScript 声明文件
│   ├── package.json        # 复制的包元数据
│   └── cordis.patch.yml    # 复制的补丁配置
├── cordis.dev.yml          # Cordis 开发环境配置
├── cordis.patch.yml        # Cordis 生产补丁配置
├── tsconfig.json           # TypeScript 编译配置
├── tsdown.config.ts        # tsdown 构建配置
├── vitest.config.ts        # Vitest 测试配置
├── package.json            # 包元数据与依赖
├── README.md               # 项目说明文档
├── LICENSE                 # MIT License
└── docs/                   # 开发文档
    ├── API.md              # API 参考文档
    ├── Architecture.md     # 架构设计文档 (本文件)
    ├── Development.md      # 开发指南
    ├── Configuration.md    # 配置指南
    └── Release.md          # 发布指南
```

## 架构分层

```
┌─────────────────────────────────────────┐
│         Cordis Runtime                 │
│  (DSH Plugin Framework)               │
├─────────────────────────────────────────┤
│  @tirol/dsh-language-set (Plugin)     │
│  ┌───────────────────────────────┐    │
│  │  apply(ctx, config)           │    │
│  │  ┌─────────────────────────┐  │    │
│  │  │ System Prompt Injection │  │    │
│  │  │  - user:language (1)    │  │    │
│  │  │  - thinking:language (2)│  │    │
│  │  └─────────────────────────┘  │    │
│  │  ┌─────────────────────────┐  │    │
│  │  │ Command Registration    │  │    │
│  │  │  - language config      │  │    │
│  │  │  - language show        │  │    │
│  │  └─────────────────────────┘  │    │
│  │  ┌─────────────────────────┐  │    │
│  │  │ Effect (Dispose)        │  │    │
│  │  │  - cleanup sections     │  │    │
│  │  └─────────────────────────┘  │    │
│  └───────────────────────────────┘    │
├─────────────────────────────────────────┤
│  @deepseek-ai/schemastery             │
│  (Runtime Schema Validation)          │
├─────────────────────────────────────────┤
│  @deepseek-ai/dsh-system-prompt       │
│  (Type Definitions)                   │
└─────────────────────────────────────────┘
```

## 数据流

### 插件初始化流程

```
Cordis Runtime
     │
     ├── 1. 读取 cordis.patch.yml
     │      → id: "dsh-language-set"
     │      → name: "@tirol/dsh-language-set"
     │      → config.lang: "zh-CN" (示例)
     │
     ├── 2. 加载插件模块
     │      → import { name, inject, apply } from '@tirol/dsh-language-set'
     │      → name = "dsh-language-set"
     │      → inject = ["systemPrompt"]
     │
     ├── 3. 校验依赖服务
     │      → systemPrompt service available? ✓
     │
     ├── 4. 调用 apply(ctx, config)
     │      → Config({}) 创建默认配置
     │      → 注入 user:language section (order: 1)
     │      → 注入 thinking:language section (order: 2)
     │      → 可选注册 language 命令
     │      → 注册 effect dispose 清理函数
     │
     └── 5. 插件生效
            → AI 回复语言由 systemPrompt 控制
            → AI 思维语言由 systemPrompt 控制
```

### 插件卸载流程

```
Cordis Runtime 卸载插件
     │
     ├── 1. 调用 effect 返回的 dispose 函数
     │      → dispose_replylang()  // 移除 user:language section
     │      → dispose_thinkinglang() // 移除 thinking:language section
     │
     └── 2. 插件清理完成
```

## 依赖关系

### 运行时依赖（devDependencies）

| 包名 | 版本 | 用途 |
|------|------|------|
| `@deepseek-ai/cordis` | ^4.0.2 | DSH 插件框架，提供 Context、effect、systemPrompt API |
| `@deepseek-ai/dsh-system-prompt` | 0.0.1-rc.1 | DSH 系统提示词类型定义 |
| `@deepseek-ai/schemastery` | ^3.18.2 | 运行时 Schema 校验，Config Schema 工厂 |

### 构建工具（devDependencies）

| 包名 | 版本 | 用途 |
|------|------|------|
| `typescript` | 6.0.3 | TypeScript 编译器 |
| `tsdown` | 0.22.14 | ESM 构建工具 |
| `vitest` | ^4.1.10 | 单元测试框架 |
| `@types/node` | ^22.20.2 | Node.js 类型定义 |

### 零运行时依赖

本插件**无运行时依赖**（`dependencies: {}`），所有依赖均为开发时依赖。构建产物 `lib/index.mjs` 中不打包 cordis 和 schemastery，通过 `neverBundle` 配置保持外部引用。

## 构建产物

| 文件 | 大小 | 说明 |
|------|------|------|
| `lib/index.mjs` | 3.29 kB (gzip: 1.09 kB) | ESM 模块，包含 Config Schema 和 apply 函数 |
| `lib/index.d.mts` | 1.20 kB (gzip: 0.48 kB) | TypeScript ESM 声明文件 |
| `lib/package.json` | — | 复制的包元数据 |
| `lib/cordis.patch.yml` | — | 复制的补丁配置 |

## DSH 插件规范

本插件遵循 DSH Cordis 插件规范：

| 规范项 | 实现方式 |
|--------|----------|
| 插件标识 | `export const name = 'dsh-language-set'` |
| 服务依赖 | `export const inject = ['systemPrompt']` |
| Effect 注册 | `ctx.effect()` 返回 dispose 清理函数 |
| 配置校验 | `@deepseek-ai/schemastery` Schema 校验 |
| Bundle Manifest | `package.json` → `dsh.bundle.patch` → `cordis.patch.yml` |
| 输出格式 | ESM (`.mjs`) + ESM 声明 (`.d.mts`) |

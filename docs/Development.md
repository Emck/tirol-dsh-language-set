# Development Guide

> `@tirol/dsh-language-set` v0.1.2 — 开发指南

## 环境要求

| 工具 | 最低版本 | 说明 |
|------|----------|------|
| Node.js | `^22.19.0` 或 `>=24.0.0` | 运行环境和编译目标 |
| pnpm | `11.25.0` | 包管理器 |

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 构建

```bash
pnpm run build
```

使用 `tsdown` 将 TypeScript 源码编译至 `lib/` 目录，输出 ESM 模块（`.mjs`）和声明文件（`.d.mts`）。

### 运行测试

```bash
pnpm run test
```

使用 `vitest` 运行单元测试，覆盖配置默认值、自定义值、合并逻辑和插件导出验证。

### 类型检查

```bash
pnpm run typecheck
```

仅执行 TypeScript 类型检查（`tsc --noEmit`），不生成文件。

### 完整校验

```bash
pnpm run check
```

依次执行：类型检查 → 测试 → 构建。

## 开发工作流

### 修改源码

1. 编辑 `src/` 目录下的 TypeScript 文件
2. 运行 `pnpm run build` 编译
3. 运行 `pnpm run test` 验证测试

### 添加测试

测试文件位于 `tests/` 目录，使用 Vitest 的 BDD API：

```ts
import { describe, expect, it } from 'vitest';

describe('feature name', () => {
    it('should do something', () => {
        expect(actual).toBe(expected);
    });
});
```

测试文件命名规范：`<module>.spec.ts`

### 运行单个测试文件

```bash
pnpm run test tests/config.spec.ts
```

### 运行单个测试

```bash
pnpm run test -- -t "test name"
```

## 构建配置详解

### tsconfig.json

| 选项 | 值 | 说明 |
|------|-----|------|
| `target` | `ES2024` | 编译目标版本 |
| `lib` | `["ES2024"]` | 可用的 API 库 |
| `module` | `NodeNext` | ES 模块输出格式 |
| `moduleResolution` | `NodeNext` | Node.js 风格模块解析 |
| `strict` | `true` | 启用严格模式 |
| `declaration` | `true` | 生成 `.d.mts` 声明文件 |
| `declarationDir` | `lib/types` | 声明文件输出目录 |
| `allowImportingTsExtensions` | `true` | 允许导入 `.ts` 扩展名 |
| `rewriteRelativeImportExtensions` | `true` | 自动重写相对导入扩展名 |
| `skipLibCheck` | `true` | 跳过库文件类型检查 |

### tsdown.config.ts

```ts
import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],  // 入口文件
    format: ['esm'],           // ESM 格式
    dts: true,                // 生成声明文件
    clean: true,              // 构建前清理输出目录
    outDir: 'lib',            // 输出目录
    sourcemap: false,         // 不生成 source map
    minify: false,            // 不压缩代码
    deps: {
        neverBundle: [
            '@deepseek-ai/cordis',
            '@deepseek-ai/schemastery',
        ],
    },
});
```

**`neverBundle` 配置说明：** cordis 和 schemastery 不打包进构建产物，保持外部引用。这确保 Cordis 框架使用其自身的版本，避免版本冲突。

## 测试策略

### 测试覆盖范围

| 模块 | 测试文件 | 测试数 | 覆盖内容 |
|------|----------|--------|----------|
| `src/index.ts` | `tests/index.spec.ts` | 2 | 插件导出验证、re-import 稳定性 |
| `src/config.ts` | `tests/config.spec.ts` | 21 | Config interface、defaults、custom values、merge |

### 测试分类

**插件导出测试** (`tests/index.spec.ts`)：
- 验证 `name`、`inject`、`apply` 导出正确性
- 验证跨 re-import 导出稳定性

**配置测试** (`tests/config.spec.ts`)：
- Config interface — TypeScript 类型兼容性
- Config defaults — 所有字段默认值验证
- Config custom values — 自定义值、null/undefined 行为
- Config Merge — 配置合并逻辑

## Cordis 开发环境

### cordis.dev.yml

开发环境配置文件，用于本地开发和调试：

```yaml
- id: hmr
  disabled: false
  config:
    root: [
        "/path/to/dsh-language-set/src",
    ]

- insert:
    - id: logger
      name: "@deepseek-ai/cordis-plugin-logger-console"
      config:
        levels:
          default: 3
          hmr: 3

    - id: dsh-language-set
      name: "/path/to/dsh-language-set/src/index.ts"
      config:
        lang: "zh-CN"
        command: true
        verbose: true
```

**关键配置：**
- **HMR**：热模块重载，监听 `src/` 目录变化
- **Logger**：控制台日志，debug 级别（3）
- **插件配置**：开发环境启用 verbose 和 command

## 代码规范

### TypeScript 配置

- 启用严格模式（`strict: true`）
- 使用 ES2024 作为编译目标
- 使用 NodeNext 模块解析
- 允许 `.ts` 扩展名导入（开发时）

### 文件命名

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 源码 | `snake_case.ts` | `config.ts`, `index.ts` |
| 测试 | `<module>.spec.ts` | `config.spec.ts`, `index.spec.ts` |
| 配置 | `<tool>.config.<ext>` | `tsdown.config.ts`, `vitest.config.ts` |

### 注释规范

- 使用 JSDoc 风格注释描述函数和接口
- 关键逻辑添加行内注释说明

## 调试技巧

### 启用详细日志

在 `cordis.dev.yml` 中设置：

```yaml
config:
    verbose: true
    command: true
```

启用后插件会：
- 输出配置 JSON 日志
- 输出注入的系统提示词内容
- 注册 `language` 命令用于调试

### 使用 language 命令

```bash
# 查看当前配置
> language config

# 查看注入的系统提示词
> language show
```

### HMR 热更新

开发时启用 HMR，修改 `src/` 目录下的文件后自动重新加载。

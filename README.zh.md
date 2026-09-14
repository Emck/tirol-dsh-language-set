# @tirol/dsh-language-set

[![DSH Plugin](https://badgen.net/badge/format/DSH%20bundle/8257D0)](README.md)
[![License: MIT](https://badgen.net/badge/license/MIT/green)](LICENSE)

中文 | [English](README.md)

通过系统提示词注入分别控制 AI 的回复语言和思维语言的[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`)插件

## 快速开始

### 安装

```bash
dsh plugin --profile web add @tirol/dsh-language-set
```

### 源代码安装

```bash
git clone https://github.com/Emck/tirol-dsh-language-set.git
cd tirol-dsh-language-set

pnpm install
pnpm check

dsh plugin --profile web add .
```


### 使用

安装成功重启dsh服务立即生效，默认语言为中文。

修改 profiles/web/cordis.patch.yml 配置可改变语言（当前仅支持中文和英文）。

## 功能特性

- **回复语言控制** — 控制 AI 回复用户的语言
- **思维语言控制** — 控制 AI 内部思考的语言
- **灵活配置** — 支持七个配置项
- **命令支持** — 可选注册 `language` 命令

## 配置说明

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `lang` | `string` | `'en-US'` | 全局默认语言 |
| `replylang` | `string \| null` | `null` | 回复语言，`null` 时回退到 `lang` |
| `thinkinglang` | `string \| null` | `null` | 思维语言，`null` 时回退到 `lang` |
| `replytext` | `string \| null` | `null` | 回复提示文本，自定义覆盖默认模板 |
| `thinkingtext` | `string \| null` | `null` | 思维提示文本，自定义覆盖默认模板 |
| `command` | `boolean` | `false` | 是否启用 `language` 命令 |
| `verbose` | `boolean` | `false` | 是否启用详细日志模式 |

### 配置示例

编辑 `profiles/web/cordis.patch.yml` 添加插件配置：

```yml
- id: dsh-language-set
  config:
    lang: "zh-CN"
    command: true
    verbose: true
```

## 内置命令

当 `command: true` 时，插件会注册 `language` 命令：

```bash
# 查看当前配置
> language config

# 查看注入的系统提示词
> language show
```

## 依赖项

| 依赖 | 版本 | 用途 |
|------|------|------|
| `@deepseek-ai/cordis` | ^4.0.2 | DSH 插件框架 |
| `@deepseek-ai/dsh-system-prompt` | 0.0.1-rc.1 | DSH 系统提示词类型定义 |
| `@deepseek-ai/schemastery` | ^3.18.2 | 运行时 Schema 校验 |

> ⚠️ 所有依赖均为 **开发时依赖**，构建产物无运行时依赖。

## 脚本命令

| 脚本 | 命令 | 说明 |
|------|------|------|
| `build` | `tsdown` | 编译 TypeScript 到 `lib/` (ESM) |
| `test` | `vitest run tests` | 运行单元测试 |
| `typecheck` | `tsc --noEmit` | 仅类型检查 |
| `check` | `pnpm run check` | 完整校验：typecheck → test → build |

## DSH 插件规范

本插件遵循 DSH Cordis 插件规范：

- **插件标识** — `export const name = 'dsh-language-set'`
- **服务依赖** — `export const inject = ['systemPrompt']`
- **Effect 注册** — `ctx.effect()` 返回 dispose 清理函数
- **配置校验** — `@deepseek-ai/schemastery` Schema 校验
- **Bundle Manifest** — `package.json` → `dsh.bundle.patch` → `cordis.patch.yml`

## 文档

| 文档 | 说明 |
|------|------|
| [API Reference](./docs/API.md) | API 参考：导出、类型定义、内置命令 |
| [Architecture](./docs/Architecture.md) | 架构设计：项目结构、数据流、依赖关系 |
| [ChangeLog](./docs/ChangeLog.md) | 版本变更日志：变更内容、新增功能、修复问题 |
| [Configuration](./docs/Configuration.md) | 配置指南：字段说明、使用示例 |
| [Development](./docs/Development.md) | 开发指南：环境要求、构建配置、调试技巧 |
| [Release](./docs/Release.md) | 发布指南：发布流程、版本策略、常见问题 |

## 许可证

MIT © Emck

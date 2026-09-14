# Configuration Guide

> `@tirol/dsh-language-set` v0.1.2 — 配置指南

## Config Schema

插件使用 `@deepseek-ai/schemastery` 进行运行时配置校验，所有字段均有默认值。

### 配置字段一览

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `lang` | `string` | `'en-US'` | 全局默认语言 |
| `replylang` | `string \| null` | `null` | 回复语言，`null` 时回退到 `lang` |
| `replytext` | `string \| null` | `null` | 回复提示文本，`null` 时使用默认模板 `By default, reply to users in {language}.` |
| `thinkinglang` | `string \| null` | `null` | 思维语言，`null` 时回退到 `lang` |
| `thinkingtext` | `string \| null` | `null` | 思维提示文本，`null` 时使用默认模板 `By default, think to users in {language}.` |
| `command` | `boolean` | `false` | 是否启用 `language` 命令 |
| `verbose` | `boolean` | `false` | 是否启用详细日志模式 |

### 字段详细说明

#### `lang` — 全局默认语言

所有语言配置的兜底值。当 `replylang` 和 `thinkinglang` 为 `null` 时，使用此值。

**示例：**
```ts
Config({ lang: 'zh-CN' });
// → { lang: 'zh-CN', replylang: undefined, thinkinglang: undefined, ... }
```

#### `replylang` — 回复语言

控制 AI 回复用户时使用的语言。默认为 `null`，表示回退到 `lang`。

**示例：**
```ts
// 使用全局默认语言
Config({ lang: 'zh-CN' });
// → replylang 未定义，回退到 lang = 'zh-CN'

// 显式指定回复语言
Config({ lang: 'en-US', replylang: 'zh-CN' });
// → 回复使用中文，思维使用英文
```

#### `thinkinglang` — 思维语言

控制 AI 内部思考时使用的语言。默认为 `null`，表示回退到 `lang`。

**示例：**
```ts
// 思维使用中文，回复使用英文
Config({ lang: 'en-US', thinkinglang: 'zh-CN' });
```

#### `replytext` — 回复提示文本

自定义回复语言的提示文本。默认为 `null`，使用默认模板：

```
By default, reply to users in {language}.
```

#### `command` — 启用命令

是否注册 `language` 命令行。默认为 `false`。

**示例：**
```ts
Config({ command: true });
// → 注册 language 命令，支持 config / show 子命令
```

#### `verbose` — 详细日志模式

是否输出调试日志。默认为 `false`。

**示例：**
```ts
Config({ verbose: true });
// → 输出配置 JSON、注入的系统提示词内容、卸载日志
```

## 配置合并

使用 `Config.merge()` 方法合并多个配置对象：

```ts
const merged = Config.merge(
    Config({ lang: 'en-US' }),      // 基础配置
    { replylang: 'zh-CN' },         // 覆盖回复语言
    { thinkinglang: 'it-IT' }       // 覆盖思维语言
);
// → { lang: 'en-US', replylang: 'zh-CN', thinkinglang: 'it-IT' }
```

**合并规则：**
- 基于 `Object.assign` 实现，后传入的配置优先覆盖前面的值
- `null` 值会被保留（不会回退到默认值）
- `undefined` 值会被忽略（不覆盖已有值）

## 配置使用示例

### 基础用法 — 中文回复

```ts
import { apply } from '@tirol/dsh-language-set';

// 注入插件，使用中文回复
await apply(ctx, { lang: 'zh-CN' });
```

### 高级用法 — 中英文分离

```ts
// 回复用中文，思维用英文
await apply(ctx, {
    lang: 'en-US',           // 兜底语言：英文
    replylang: 'zh-CN',      // 回复语言：中文
    thinkinglang: null,      // 思维语言：回退到 lang = 英文
});
```

### 完全自定义提示文本

```ts
// 使用自定义提示文本
await apply(ctx, {
    replytext: 'Please respond in Chinese.',
    thinkingtext: 'Think in English.',
});
```

### 启用调试模式

```ts
// 启用命令和详细日志
await apply(ctx, {
    command: true,
    verbose: true,
});
```

## Cordis 配置文件

### cordis.patch.yml（生产环境）

用于 Cordis 生产环境，通过插件名称注册：

```yaml
- insert:
    - id: dsh-language-set
      name: "@tirol/dsh-language-set"
      config:
        lang: "zh-CN"
```

**说明：**
- `id`：插件标识符，必须与代码中的 `name` 一致
- `name`：模块名称，使用 npm 包名
- `config`：传递给插件的配置对象

### cordis.dev.yml（开发环境）

用于本地开发和调试，包含 HMR、Logger 和插件配置：

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

**说明：**
- `hmr`：热模块重载，监听源码目录变化
- `logger`：控制台日志插件，debug 级别
- `dsh-language-set`：开发环境使用文件路径注册插件

## 语言代码参考

支持的语言代码（示例）：

| 代码 | 语言 |
|------|------|
| `en-US` | English |
| `zh-CN` | Simplified Chinese |

**注意：** 插件内部通过 `makeLanguageDesc()` 将语言代码映射为英文描述：
- `zh-CN` → "Simplified Chinese"
- 其他所有值 → "English"

如需支持更多语言描述，需修改 `src/index.ts` 中的 `makeLanguageDesc()` 函数。

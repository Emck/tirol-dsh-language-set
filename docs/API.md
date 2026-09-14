# API Reference

> `@tirol/dsh-language-set` v0.1.3 — 完整的 API 文档

## 模块导出

### `name`

```ts
export const name: "dsh-language-set"
```

插件标识符，固定值为 `'dsh-language-set'`。该名称与 `cordis.patch.yml` 中的 `id` 保持一致，用于 Cordis 框架识别和注册插件。

### `inject`

```ts
export const inject: string[]
// → ['systemPrompt']
```

依赖注入列表，声明本插件需要 `systemPrompt` 服务。Cordis 框架会在调用 `apply()` 前确保该服务可用。

### `apply`

```ts
export function apply(ctx: Context, config?: Config): Promise<void>
```

插件主函数，接收 Cordis `Context` 和可选的配置对象。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `ctx` | `Context` | Cordis 运行时上下文，提供 `systemPrompt`、`effect`、`logger`、`commands` 等服务 |
| `config` | `Config` (optional) | 插件配置对象，未提供时使用默认值 |

**行为：**

1. 对 `config` 做空值回退保护（`config || Config({})`）
2. 通过 `ctx.systemPrompt.section()` 注入两个系统提示词段落：
   - `user:language`（order: 1）— 控制回复语言
   - `thinking:language`（order: 2）— 控制思维语言
3. 在 verbose 模式下记录注入的系统提示词内容
4. 可选注册 `language` 命令（当 `config.command === true` 时）
5. 通过 `ctx.effect()` 注册可逆副作用，插件卸载时自动清理注入的段落

**返回：** `Promise<void>` — 无返回值

---

## 类型定义

### `Config`

```ts
interface Config {
    lang: string;              // 全局默认语言，默认 'en-US'
    replylang: string;         // 回复语言，默认 ''（回退到 lang）
    replytext: string;         // 回复提示文本，默认 ''
    thinkinglang: string;      // 思维语言，默认 ''（回退到 lang）
    thinkingtext: string;      // 思维提示文本，默认 ''
    command: boolean;          // 启用 language 命令，默认 false
    verbose: boolean;          // 详细日志模式，默认 false
}
```

### `Config` — Schema 工厂函数

```ts
const Config: Schemastery<Config>
```

使用 `@deepseek-ai/schemastery` 构建的配置 Schema，支持运行时校验和默认值合并。

**用法：**

```ts
import { Config } from '@tirol/dsh-language-set/config';

const config = Config({
    lang: 'zh-CN',
    replylang: '',
    thinkinglang: '',
});
```

### `Config.merge`

```ts
Config.merge: (...configs: Partial<Config>[]) => Partial<Config>
```

配置合并方法，基于 `Object.assign` 实现。支持多个配置对象按顺序合并，后传入的配置优先覆盖前面的值。

**用法：**

```ts
const merged = Config.merge(
    Config({ lang: 'en-US' }),
    { replylang: 'zh-CN' },
    { thinkinglang: 'it-IT' }
);
// → { lang: 'en-US', replylang: 'zh-CN', thinkinglang: 'it-IT' }
```

---

## 内置命令

当 `config.command === true` 时，插件会注册一个 `language` 命令。

### `language config`

显示当前插件配置。

```
> language config
Config is {"lang":"zh-CN"}
```

### `language show`

显示注入的系统提示词内容。

```
> language show
{"name":"user:language","text":"By default, reply to users in Simplified Chinese."}
{"name":"thinking:language","text":"By default, think to users in Simplified Chinese."}
```

### `language` (无参数)

等同于 `language config`。

---

## 语言描述映射

插件内部通过 `makeLanguageDesc()` 函数将语言代码映射为英文描述：

| 语言代码 | 描述 |
|----------|------|
| `zh-CN` | "Simplified Chinese" |
| 其他所有值 | "English" |

该函数用于生成系统提示词中的语言描述文本。

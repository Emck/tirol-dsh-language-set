# @tirol/dsh-language-set

[![DSH Plugin](https://badgen.net/badge/format/DSH%20bundle/8257D0)](README.md)
[![License: MIT](https://badgen.net/badge/license/MIT/green)](LICENSE)

English | [中文](README.zh.md)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugin that controls AI's reply language and thinking language separately via system prompt injection.

## Quick Start

### Install

```bash
dsh plugin --profile web add @tirol/dsh-language-set
```

### Install from Source Code

```bash
git clone https://github.com/Emck/tirol-dsh-language-set.git
cd tirol-dsh-language-set

pnpm install
pnpm check

dsh plugin --profile web add .
```

### Usage

After successful installation, restart the DSH service to take effect immediately. The default language is Chinese.

Modify `profiles/web/cordis.patch.yml` configuration to change the language (currently only Chinese and English are supported).

## Features

- **Reply Language Control** — Controls the language AI uses when replying to users
- **Thinking Language Control** — Controls the language AI uses for internal thinking
- **Flexible Configuration** — Supports seven configuration options
- **Command Support** — Optionally registers the `language` command

## Configuration

| Field | Type | Default | Description |
|-------|------|---------|------------|
| `lang` | `string` | `'en-US'` | Global default language |
| `replylang` | `string \| null` | `null` | Reply language, falls back to `lang` when `null` |
| `thinkinglang` | `string \| null` | `null` | Thinking language, falls back to `lang` when `null` |
| `replytext` | `string \| null` | `null` | Reply prompt text, customizes the default template |
| `thinkingtext` | `string \| null` | `null` | Thinking prompt text, customizes the default template |
| `command` | `boolean` | `false` | Whether to enable the `language` command |
| `verbose` | `boolean` | `false` | Whether to enable verbose logging mode |

### Configuration Example

Edit `profiles/web/cordis.patch.yml` to add plugin configuration:

```yml
- id: dsh-language-set
  config:
    lang: "zh-CN"
    command: true
    verbose: true
```

## Built-in Commands

When `command: true`, the plugin registers a `language` command:

```bash
# View current configuration
> language config

# View injected system prompts
> language show
```

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `@deepseek-ai/cordis` | ^4.0.2 | DSH plugin framework |
| `@deepseek-ai/dsh-system-prompt` | 0.0.1-rc.1 | DSH system prompt type definitions |
| `@deepseek-ai/schemastery` | ^3.18.2 | Runtime Schema validation |

> ⚠️ All dependencies are **dev-time only**; the build output has no runtime dependencies.

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `tsdown` | Compile TypeScript to `lib/` (ESM) |
| `test` | `vitest run tests` | Run unit tests |
| `typecheck` | `tsc --noEmit` | Type check only |
| `check` | `pnpm run check` | Full validation: typecheck → test → build |

## DSH Plugin Specification

This plugin follows the DSH Cordis plugin specification:

- **Plugin Identifier** — `export const name = 'dsh-language-set'`
- **Service Dependency** — `export const inject = ['systemPrompt']`
- **Effect Registration** — `ctx.effect()` returns a dispose cleanup function
- **Schema Validation** — `@deepseek-ai/schemastery` Schema validation
- **Bundle Manifest** — `package.json` → `dsh.bundle.patch` → `cordis.patch.yml`

## Documentation

| Document | Description |
|----------|-------------|
| [API Reference](./docs/API.md) | API reference: exports, type definitions, built-in commands |
| [Architecture](./docs/Architecture.md) | Architecture design: project structure, data flow, dependencies |
| [ChangeLog](./docs/ChangeLog.md) | Version changelog: changes, new features, bug fixes |
| [Configuration](./docs/Configuration.md) | Configuration guide: field descriptions, usage examples |
| [Development](./docs/Development.md) | Development guide: environment requirements, build config, debugging tips |
| [Release](./docs/Release.md) | Release guide: release process, version strategy, FAQ |

## License

MIT © Emck

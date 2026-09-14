# ChangeLog

> `@tirol/dsh-language-set` — 版本变更日志

## [0.1.2] — 2026-09-14

### ✨ Features

- **npm 发布支持** — 添加 `publishConfig.access: public` 配置，支持 npmjs.com 发布
- **npm 元数据** — 添加 `repository`、`homepage`、`bugs` 字段，完善 npm 包信息

### 📝 Documentation

- **综合文档** — 新增 docs/ 目录下完整开发文档（API、Architecture、Configuration、Development、Release）
- **ChangeLog** — 新增版本变更日志文档

### 🔧 Chores

- **版本升级** — package.json 版本号更新为 `0.1.2`
- **测试迁移** — 将测试从 `plugin.spec.ts` 迁移至 `index.spec.ts`

---

## [0.1.1] — 2026-09-14

### ✨ Features

- **新增配置字段** — 添加 `replytext`、`thinkingtext`、`command`、`verbose` 四个配置项
- **内置命令支持** — 可选注册 `language` 命令，支持 `config` / `show` 子命令
- **可逆副作用** — 通过 `ctx.effect()` 注册可卸载的副作用，插件卸载时自动清理注入的系统提示词段落

### 🔄 Refactors

- **测试拆分** — 将测试拆分为 `index.spec.ts`（插件导出验证）和 `config.spec.ts`（配置逻辑测试）

### 📝 Documentation

- **README 重写** — 优化 README.md 结构，添加 badges、快速开始、内置命令、文档索引等章节
- **综合文档** — 新增 docs/ 目录下完整开发文档（API、Architecture、Configuration、Development、Release）
- **README 更新** — 补充项目概述、功能特性、配置说明、依赖表、DSH 插件规范等内容

### 🔧 Chores

- **添加 keywords** — package.json 中添加 keywords 字段
- **更新 gitignore** — 更新 .gitignore 配置

---

## [0.1.0] — 2026-09-13

### ✨ Initial Release

- **项目初始化** — 创建基础项目结构
- **核心功能** — 实现通过系统提示词注入控制 AI 回复语言和思维语言
- **构建配置** — 使用 tsdown 构建 ESM
- **测试框架** — 配置 Vitest 单元测试
- **配置文件** — package.json、tsconfig.json、.gitignore、.prettierrc.json
- **Cordis 配置** — cordis.dev.yml（开发环境）、cordis.patch.yml（生产补丁）

---

[0.1.2]: https://github.com/Emck/tirol-dsh-language-set/releases/tag/v0.1.2
[0.1.1]: https://github.com/Emck/tirol-dsh-language-set/compare/v0.1.1...v0.1.2
[0.1.0]: https://github.com/Emck/tirol-dsh-language-set/releases/tag/v0.1.0

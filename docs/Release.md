# Release Guide

> `@tirol/dsh-language-set` v0.1.2 — 发布指南

## 发布前检查清单

### 构建验证

```bash
# 完整校验流程
pnpm run check
```

依次执行：
1. **类型检查** — `tsc --noEmit` 零错误
2. **单元测试** — 23/23 tests passed
3. **构建** — `tsdown` 成功输出 `lib/index.mjs` + `lib/index.d.mts`

### Tarball 验证

```bash
# 预览打包内容
pnpm pack --dry-run
```

**预期输出文件清单：**
```
cordis.patch.yml
lib/index.d.mts
lib/index.mjs
LICENSE
package.json
README.md
```

### 依赖检查

```bash
# 查看依赖树
npm ls --depth=0
```

**预期结果：** 无运行时依赖（`dependencies: {}`），所有依赖均为 devDependencies。

## 发布步骤

### 1. 更新版本号

编辑 `package.json`，修改 `version` 字段：

```json
{
    "version": "0.1.2"
}
```

### 2. 运行完整校验

```bash
pnpm run check
```

确保类型检查、测试、构建全部通过。

### 3. 提交版本变更

```bash
git add package.json
git commit -m "chore: bump version to 0.1.2"
git tag v0.1.2
git push origin main --tags
```

### 4. 构建并发布

```bash
# 清理并重新构建
rm -rf lib
pnpm run build

# 发布到 npm registry
pnpm publish
```

**注意：** `prepack` 钩子会自动执行 `check`（typecheck + test + build），所以 `pnpm publish` 会先运行完整校验再打包发布。

### 5. 验证发布结果

```bash
# 在测试项目中安装
pnpm add @tirol/dsh-language-set@0.1.2

# 验证导入
node -e "import('@tirol/dsh-language-set').then(m => console.log(m.name, m.inject))"
```

## 版本策略

本项目使用 **语义化版本（SemVer）**：

| 版本格式 | 含义 | 示例 |
|----------|------|------|
| `0.x.x` | 开发阶段，API 可能变动 | `0.1.2` |
| `x.0.0` | 主版本更新，可能有 breaking changes | `1.0.0` |
| `x.x.0` | 功能更新，向后兼容 | `0.2.0` |
| `x.x.x` | Bug 修复，向后兼容 | `0.1.3` |

当前版本 `0.1.2` 处于开发阶段，API 可能变动。

## 发布后操作

### 1. 创建 GitHub Release

- 标签：`v0.1.x`
- 标题：`@tirol/dsh-language-set v0.1.x`
- 内容：版本变更日志

### 2. 更新 README.md

确保 README.md 中的版本号与发布版本一致。

### 3. 通知团队

- 更新项目文档
- 通知依赖项目的维护者

## 回滚策略

### 发布后发现严重问题

```bash
# 方法一：npm unpublish（仅限 24 小时内）
npm unpublish @tirol/dsh-language-set@0.1.2

# 方法二：发布修复版本
# 修改 package.json version 为 0.1.3
# 重新执行发布流程
```

**注意：** npm 不允许覆盖已发布的版本。

## 常见问题

### Q: `npm pack` 报错 "Your cache folder contains root-owned files"

**A:** 执行以下命令修复：

```bash
sudo chown -R $(whoami) ~/.npm
```

### Q: 构建产物中包含不必要的文件

**A:** 检查 `package.json` 的 `files` 字段，确保只包含必要的文件：

```json
{
    "files": [
        "lib",
        "cordis.patch.yml",
        "README.md",
        "README.zh.md",
        "LICENSE"
    ]
}
```

### Q: 测试失败

**A:** 
1. 运行 `pnpm run typecheck` 检查类型错误
2. 运行 `pnpm run test` 查看具体失败的测试
3. 修复代码后重新运行 `pnpm run check`

### Q: 构建产物过大

**A:** 
1. 检查 `tsdown.config.ts` 的 `neverBundle` 配置
2. 确认没有引入不必要的运行时依赖
3. 当前产物大小：`lib/index.mjs` = 3.29 kB (gzip: 1.09 kB)

## 发布检查清单

- [ ] `pnpm run typecheck` — 零错误
- [ ] `pnpm run test` — 23/23 tests passed
- [ ] `pnpm run build` — 构建成功
- [ ] `pnpm pack --dry-run` — 文件清单正确
- [ ] `package.json` version 已更新
- [ ] `README.md` 版本号已同步
- [ ] Git tag 已创建
- [ ] `pnpm publish` 成功

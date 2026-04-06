---
title: 从nvm迁移到fnm
description: ""
pubDate: 2026-04-06
tags: ["nvm", "fnm"]
---

如果你使用 nvm 管理 Node.js 版本，每次打开新终端时 nvm 的初始化脚本会显著拖慢 zsh 启动速度。fnm 是一个用 Rust 编写的极速 Node.js 版本管理工具，由 Vercel 开发，能大幅缩短启动时间，且完全兼容 `.nvmrc` 文件。

## 安装 fnm

用 Homebrew

```shell
brew install fnm
```

或

```shell
curl -fsSL https://fnm.vercel.app/install | bash
```

## 配置 shell

在 `~/.zshrc` 中加入 

```shell
# fnm - Fast Node Manager
eval "$(fnm env --use-on-cd --shell zsh)"
# 配置镜像源
export FNM_NODE_DIST_MIRROR="https://npmmirror.com/mirrors/node"
```

| 参数 | 说明 |
| --- | --- |
| `--use-on-cd` | 进入目录时自动读取 `.node-version` 或 `.nvmrc` 并切换 |
| `--shell <shell>` | 指定 shell |
| `--version-file-strategy recursive` | 向上递归查找版本文件 (可选) |

## 迁移 nvm 已安装的 node.js 版本

```shell
ls ~/.nvm/versions/node/
```

查看已安装的 node.js 版本，之后使用 fnm 安装

```shell
# 大版本号
fnm install 24
# 或使用精确版本号
fnm install 24.12.0
```

设置默认版本

```shell
fnm default 24
```

## 迁移全局安装的 npm 包

fnm 不支持自动迁移，故需要手动安装

查看 nvm 上原有 npm 已安装的全局包

```shell
~/.nvm/versions/node/v24.12.0/bin/npm list -g --depth=0
```

如下：

```shell
/Users/rubisco/.nvm/versions/node/v24.12.0/lib
├── @google/gemini-cli@0.33.1
├── @openai/codex@0.104.0
├── claude-mem@2.0.9
├── corepack@0.34.5
├── generator-code@1.11.17
├── npm@11.6.2
├── picgo@2.0.2
├── pm2@6.0.14
├── pnpm@10.33.0
├── tldr@3.4.0
└── ...
```

在 `.zshrc` 中先去掉 nvm 相关的设置，但暂时不要删除 `~/.nvm` 文件夹（防止旧 npm 环境丢失）

之后用一个简单脚本把旧环境中的全局包重新安装到新环境里

```shell
# 旧 npm 可执行文件路径
export OLD_NPM=~/.nvm/versions/node/v24.12.0/bin/npm
# 旧 npm 全局包
export PACKAGES=$("$OLD_NPM" list -g --depth=0 --json | jq -r '.dependencies | keys | join(" ")')

# 设置新的默认 node 环境
fnm default 24

npm i -g $PACKAGES
```

## 确认迁移完成 

```shell
fnm current
# 24.12.0

which npm
# /Users/rubisco/.local/state/fnm_multishells/92089_1775456569024/bin/npm
which node
# /Users/rubisco/.local/state/fnm_multishells/92089_1775456569024/bin/node

npm ls -g --depth=0
```

> [!important]
> 需要注意的是，fnm 安装的 node 版本在 `~/.local/share/fnm/node-versions/installation` 下，但 `which node` 输出的路径一般是 `/Users/rubisco/.local/state/fnm_multishells/92089_1775456569024/bin/node`，这是因为 fnm 使用多 Shell 机制，每个 Shell 会话有独立的 PATH。

## 清理原有的 nvm 路径

```shell
rm -rf ~/.nvm
```

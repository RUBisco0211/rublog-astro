---
title: Raycast拓展发布避坑
description: ""
pubDate: 2026-04-01
tags: ["Raycast"]
recommend: true
---

## 初次发布

参考 [Raycast官方文档](https://developers.raycast.com/basics/prepare-an-extension-for-store) 中对项目资源的推荐组织方式，包括图标、截图、`package.json`、`CHANGELOG.md`等。

### 项目结构

``` shell
.
├── assets
│   └── extension-icon.png # 应用图标
├── metadata
│   ├── picgo-1.png # Raycast Store 页面中展示的截图
│   ├── picgo-2.png
│   ├── ..
├── src # 源代码
├── package-lock.json
├── package.json
├── raycast-env.d.ts
├── README.md 
├── CHANGELOG.md # 更新日志
│   ..

```

### 图标

推荐使用 Raycast 官方推荐的图标制作工具 [Icon Maker by Raycast](https://ray.so/icon) 进行制作，默认存放在`assets`文件夹下，命名为`extension-icon.png`，尺寸为`512 * 512`。

### 商店页面截图

推荐使用 Raycast 提供的截图工具（如下），默认快捷键`cmd + option + shift + M`。

![capture](https://cloudflare-imgbed-1v8.pages.dev/file/img/rublog/1775375423540_raycast-capture.png)

并存放在`metadata`文件夹下，发布后会显示到商店页面中，最多可显示 6 张截图。

![store](https://cloudflare-imgbed-1v8.pages.dev/file/img/rublog/1775375480444_store.png)

### CHANGELOG.md

按如下格式写好你的更新日志，并留出发布日期的占位符`{PR_MERGE_DATE}`，这个日期会在你的 PR 被官方拓展仓库合并后替换为合并日期。

```md
# Picgo Changelog

## [Initial Version] - {PR_MERGE_DATE}

- Add command `Upload Images`, supports local or clipboard images uploading via **PicGo**.
- Remembering your uploader configuration with **Raycast LocalStorage**.
- ...
```
### 发布流程

完成以上设置后，运行`npm run publish`即`npx @raycast/api@latest publish`，Raycast 会自动跑一次 build、lint等检查流程，然后 fork 一次官方的拓展仓库 https://github.com/raycast/extensions ，并从这个 fork 仓库向官方仓库提交 PR，在官方审核通过并 merge 之后，即可上线 [Raycast Store](https://www.raycast.com/store)。


## 后续更新

在完成新 feature 或者 bugfix 之后，要进行拓展更新。

### 拉取其他人的 contribution

如果你的扩展有其他人贡献了代码（或者你直接在 GitHub 上编辑过），直接运行 `npm run publish` 会失败。此时需要先运行`npx @raycast/api@latest pull-contributions`来拉取贡献更改，并且在本地解决冲突。

**需要注意的是**，这个命令拉取的 contribution 是依赖于你本地`CHANGELOG.md`中声明的最新版本的，在运行之前务必写好你的更新内容，并留出`{PR_MERGE_DATE}`占位符（如下）。否则这个命令可能拉取上个版本的 contribution 代码，解决冲突时会引入莫名其妙的旧代码。

```md
# Picgo Changelog

## [Bugfix: Plugin Search Error] - {PR_MERGE_DATE}

- Fix error when a plugin package data has no `description` field.

## [New Preferences] - 2026-02-21

- Add preference `Auto Copy URLs` to control whether to copy right after uploads complete.
- ...
```

拉取贡献后，在没有其他人贡献的情况下，需要解决的冲突基本上就只有`CHANGELOG.md`中的更新日志内容了（Raycast 官方会在你上个版本 PR 的基础上提交一次来填充这个`{PR_MERGE_DATE}`，导致冲突）。

解决完毕后，再运行一次`npm run publish`即可发起 PR，后续流程和首次发布一致。

---
name: publish-post
description: 在本博客仓库(Rublog,Astro 5 / Litos 主题)新增一篇文章并发布上线。当用户要求写博客文章、新增 post、发布文章,或问"怎么发文章/加一篇文章"时使用。
---

# 发布文章

在本仓库发布一篇文章的完整流程:创建文章目录 → 撰写正文 → 本地验证 → 推送触发部署。

## 1. 创建文章目录

每篇文章是一个独立目录,入口文件为 `index.md`(纯 Markdown)或 `index.mdx`(需要 JSX/组件时):

```
src/content/posts/<文章目录名>/
├── index.md
└── assets/          # 可选,文章图片等资源
```

- 目录名即 URL slug,用短横线或中文均可(仓库中两种都有先例,如 `从nvm迁移到fnm`)。
- 图片放在同级 `assets/` 目录,正文中**相对路径**引用:`![](assets/xxx.png)`。

## 2. 撰写文章

入口文件必须以 frontmatter 开头。`title`、`description`、`pubDate` 为必填:

```yaml
---
title: 文章标题
description: 一句话摘要(列表页和 SEO 用)
pubDate: 2026-09-03        # YAML 会解析为 Date,直接写 YYYY-MM-DD
tags: ["标签A", "标签B"]    # 可选
cover: ./assets/cover.png  # 可选,封面图(相对路径或 assets/xxx.png)
draft: true                # 可选,草稿模式:不进列表、不发布,本地预览用
---
```

完整字段定义见 `src/content.config.ts` 的 `posts` collection schema(还有 `updatedDate`、`author`、`recommend`、`pinned`、`postType`、`coverLayout`、`license` 等,均有默认值或可省略)。

正文支持增强语法(参考现成范例 `src/content/posts/enhance/index.mdx`):

- Callout 提示块:`> [!note]` / `[!tip]` / `[!warning]` / `[!caution]`,可加 `-`/`+` 控制折叠。
- 代码块标题与行号:```yaml title="文件名"。
- 图片属性后缀:`![](assets/a.png)(style: width:600px;)`、`(class:no-zoom)`、`(class:img-light)`/`(class:img-dark)` 明暗适配。
- KaTeX 数学公式、GitHub 卡片链接、badges 等 remark/rehype 插件能力。

写作风格对齐已有文章:中文、`##` 二级标题起、正文里可穿插解释性段落。

## 3. 本地验证

包管理器是 pnpm。发布前必须通过构建校验(它会跑 `astro check`,frontmatter 字段类型错误会在此暴露):

```bash
pnpm run build
```

验证通过的标准:命令以 0 退出,无类型错误。想边写边看效果可另开 `pnpm run dev`。

草稿预览:`draft: true` 的文章在 dev 模式可通过直接 URL 访问,但不出现在列表/RSS。

## 4. 发布

发布机制:**推送到 GitHub `main` 分支,Netlify 自动构建部署**(仓库根有 `netlify.toml`,构建命令 `pnpm run build`,发布目录 `dist`)。没有手动发布步骤。

```bash
git add src/content/posts/<文章目录名>/
git commit -m "post: 文章标题"
git push origin main
```

推送后到 Netlify 确认构建成功,线上站点即可看到新文章;Gitalk 评论区会在首次访问时自动创建对应 issue。

## 注意事项

- `.env` 里的 GitHub OAuth 凭据仅用于评论系统,与文章发布无关,不要改动。
- `pubDate` 使用未来日期时文章仍会构建,但注意列表排序以它为准。
- 修改已发布文章后,可加 `updatedDate` 字段标记更新时间。

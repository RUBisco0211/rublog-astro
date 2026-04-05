---
title: 清理 WSL 环境中生成的 Zone.Identifier 文件
description: ""
pubDate: 2026-04-05
tags: ["WSL"]
---

在 Windows 与 WSL 文件系统之间拷贝文件时，系统会自动生成一类隐藏文件，例如`xxx:Zone.Identifier`，这些文件的存在通常并不会影响正常使用，但它们会：

-   在 `git status` 中显示为“未知文件”，影响版本管理
-   在脚本或编译任务中被误识别为输入文件
-   在递归遍历或文件匹配操作时造成干扰
-   在某些编辑器或工具中触发解析错误

## 所以这是什么

这些 `:Zone.Identifier` 文件是 Windows NTFS 的附加数据流（Alternate Data Stream, ADS）。 

当你从网络下载文件或复制自不同安全区域的来源时，Windows 会自动为文件添加一个附加属性，用来标记“文件来源的安全区域”。
例如，通过浏览器下载的可执行文件，会附带一个 Zone.Identifier 流，其内容大致如下：

```
[ZoneTransfer]
ZoneId=3
ReferrerUrl=https://example.com/
```

这在 Windows 下用于 安全提示（“此文件来自互联网，是否确定要运行？”）。 但是在 WSL 中，这种附加信息被视为一个独立的伪文件，从而显得很突兀。

## 怎么清理？

```bash
find /path/to/dir -type f -name "*Zone.Identifier" -delete
```

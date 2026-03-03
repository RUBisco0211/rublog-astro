---
title: 为开源项目贡献代码
description: ""
pubDate: 2026-01-05
recommend: true
tags: ["GitHub", "Git"]
---


## 总体流程鸟瞰

**标准开源贡献流程：**

```
Fork 原项目
 ↓
Clone 自己的 fork
 ↓
添加 upstream（原项目）
 ↓
从 upstream/main 创建 feature 分支
 ↓
在 feature 分支上开发
 ↓
同步 upstream/main（rebase 或 merge）
 ↓
Push 到自己的 fork
 ↓
向原项目发 Pull Request
```



## Fork 原项目

1. 打开目标开源项目（比如 `owner/repo`）
    
2. 点击右上角 **Fork**
    
3. 得到你的仓库：
    
    ```
    yourname/repo
    ```
    

> **重要**：  
> 你 **没有** 原项目的写权限，只能：
> 
> - push 到 **自己的 fork**
>     
> - 向原项目发 **PR**
>     



## Clone 你的 fork 

```bash
git clone https://github.com/yourname/repo.git
cd repo
```

此时：

- `origin` → 你的 fork
    
- **还不知道原项目在哪**
    



## 添加 upstream

```bash
git remote add upstream https://github.com/owner/repo.git
```

检查：

```bash
git remote -v
```

应该看到：

```
origin    https://github.com/yourname/repo.git (fetch)
origin    https://github.com/yourname/repo.git (push)
upstream  https://github.com/owner/repo.git (fetch)
upstream  https://github.com/owner/repo.git (push)
```

> 📌 **约定俗成**
> 
> - `origin`：你自己的仓库
>     
> - `upstream`：原项目（所有人共同维护）
>     



## 永远不要在 main 上直接开发

### 确保本地 main 是“干净的”

```bash
git checkout main
git fetch upstream
git reset --hard upstream/main
```

含义：

- 本地 `main` **永远和原项目 main 一致**
    
- 本地 `main` 只是“基线”，不用来写代码
    



### 从最新 main 创建 feature 分支

```bash
git checkout -b feature/my-awesome-feature
```

分支命名建议：

- `feature/xxx`
    
- `fix/xxx`
    
- `docs/xxx`
    



## 在 feature 分支上开发

```bash
# 修改代码
git status
git add .
git commit -m "feat: add xxx support"
```

你可以多次 commit，没问题。

## 跟进 upstream/main 的最新改动

在你开发期间，**别人可能已经往 main 合并了新代码**，你必须同步。

### 拉取 upstream 最新代码

```bash
git fetch upstream
```



### 推荐方式：rebase（开源项目首选）

```bash
git rebase upstream/main
```

效果是：

```
upstream/main ── A ── B ── C
                      \
feature ─────────────── D ── E
```

➡️ 你的提交「接在最新 main 后面」，**历史干净**

#### 如果出现冲突：

```bash
# 手动解决冲突
git add <冲突文件>
git rebase --continue
```



### ⚠️ 为什么不用 merge？

```bash
git merge upstream/main
```

会产生：

```
Merge branch 'main'
```

很多开源项目 **明确要求不要 merge main**，而是 rebase。

> 👉 看项目的 `CONTRIBUTING.md`  
> 没写的话：**默认 rebase**



## 推送 feature 分支到你的 fork

```bash
git push origin feature/my-awesome-feature
```

⚠️ 如果你 **rebase 过并且之前 push 过**：

```bash
git push --force-with-lease origin feature/my-awesome-feature
```

> `--force-with-lease` 比 `--force` 安全  
> 不会误覆盖别人提交



## 在 GitHub 上创建 Pull Request

1. 打开你的 fork 页面
    
2. GitHub 会提示：
    
    ```
    Compare & Pull Request
    ```
    
3. 确认：
    
    ```
    base: owner/repo  ← main
    head: yourname/repo ← feature/my-awesome-feature
    ```
    

### PR 描述建议写清楚：

```markdown
### What
- 实现了 XXX 功能

### Why
- 解决了 XXX 问题

### How
- 使用了 XXX 方法

### Test
- [ ] 本地测试
- [ ] 单元测试
```



## PR 审核期间你还可以继续改

审稿人可能会说：

> Please fix xxx

你只需要：

```bash
# 仍然在 feature 分支
修改代码
git add .
git commit -m "fix: address review comments"
git push origin feature/my-awesome-feature
```

PR 会 **自动更新**

## PR 合并后你本地该怎么做

```bash
git checkout main
git fetch upstream
git reset --hard upstream/main
git branch -d feature/my-awesome-feature
```

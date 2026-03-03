---
title: 使用 Git tag 和 GitHub Actions 进行版本发布
description: ""
pubDate: 2026-02-07
tags: ["GitHub", "Git"]
---

## Git tag 的最佳实践

发布版本时应使用 annotated tag，而不是 lightweight tag。annotated tag 包含作者、时间和说明信息，更符合“发布事件”的语义，也更利于 GitHub、CI 系统和后续审计工具识别。

```bash
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3
```

Tag 应只打在已经合并到主分支并通过 CI 的 commit 上。推荐的顺序是先完成合并并验证，再进行打 tag 操作，而不是在功能分支或本地未验证的提交上直接打 tag。

Tag 命名应保持统一、简洁且机器友好。实践中最推荐使用语义化版本号，并以 `v` 作为前缀，例如 `v1.0.0`、`v2.3.1`。这种格式在 GitHub Actions 中易于匹配和解析，也方便自动化工具进行版本比较。

已发布的 tag 应视为不可变对象。不要删除或强制更新已经推送到远端的 tag，否则会破坏发布的可复现性，并可能影响依赖该版本的用户或系统。如果发布后发现问题，应通过发布新的补丁版本或热修版本来修正。

---

## GitHub Actions 触发发布的最佳实践

发布流程应由 tag 触发，而不是由分支触发。tag 本身就是一个明确的发布信号，用它作为触发条件可以避免误发布，也能确保每次发布都对应一个确定的代码状态。

```yaml title=".github/workflow.yaml"
on:
  push:
    tags:
      - "v*"
```

在发布 workflow 中，版本号应始终从 tag 中推导，而不是手动维护或在配置中硬编码。通过从 `GITHUB_REF` 中提取 tag 名称，可以保证构建产物、发布记录和代码版本完全一致。

```yaml title=".github/workflow.yaml"
- name: Extract version
  run: echo "VERSION=${GITHUB_REF#refs/tags/}" >> $GITHUB_ENV
```

CI 与发布流程应在逻辑上分离。CI 负责在每次提交或合并时验证代码质量，而发布 workflow 只在打 tag 时运行，专注于构建最终产物和对外发布。两者可以复用构建脚本或公共 action，但触发条件和权限应明确区分。

发布 workflow 应尽量保持简单和确定性，只包含构建、打包和发布所需的步骤，避免在发布阶段引入额外的不稳定逻辑或复杂依赖，以降低发布失败的风险。

---

## GitHub Release 的最佳实践

推荐通过 GitHub Actions 自动创建 GitHub Release，并将其与 tag 一一对应。可以使用现成的 release action 自动生成发布说明和上传构建产物。

```yaml title=".github/workflow.yaml"
- uses: softprops/action-gh-release@v1
  with:
    tag_name: ${{ env.VERSION }}
    name: ${{ env.VERSION }}
    generate_release_notes: true
```

每个 tag 应对应一组唯一且不可变的构建产物。产物文件名中应包含版本号和平台信息，避免使用 `latest` 之类的模糊标识，从而确保可追溯性和可复现性。

```text
myapp-v1.2.3-linux-amd64.tar.gz
myapp-v1.2.3-darwin-arm64.tar.gz
```

发布 workflow 中应遵循最小权限原则，只授予创建 Release 和上传产物所需的权限，避免不必要的仓库或组织级权限。

```yaml title=".github/workflow.yaml"
permissions:
  contents: write
```

---

## 推荐的发布流程总结

代码合并到主分支并通过 CI 校验后，由人工确认并打一个符合规范的 annotated tag。tag 推送到远端后触发 GitHub Actions 自动构建、打包并创建 GitHub Release，对外提供稳定、可复现的版本。

核心原则是让 tag 代表不可变的发布事实，让 GitHub Actions 成为自动化执行者，让 GitHub Release 成为对外交付的正式载体。三者职责清晰，发布流程才能长期稳定运行。

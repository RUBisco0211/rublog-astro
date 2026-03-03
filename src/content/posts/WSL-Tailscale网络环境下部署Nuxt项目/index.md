---
title: WSL+Tailscale 网络环境下部署Nuxt项目
description: ""
pubDate: 2026-03-01
tags: ["WSL", "Tailscale", "Nuxt", "Caddy"]
---

## 开启Tailscale的HTTPS 功能

在生成证书之前，必须先在 Tailscale 控制台开启功能：

1. 登录 [Tailscale Admin Console](https://login.tailscale.com/admin/dns)。
2. 在 **DNS** 选项卡中，确保 **MagicDNS** 已启用。
3. 下拉找到 **HTTPS Certificates**，点击 **Enable HTTPS**。

### 生成证书文件

在你的 WSL 终端中执行以下命令。建议直接把文件生成到 Caddy 存放证书的目录：

```shell
# 1. 创建目录（如果还没建）
sudo mkdir -p /etc/caddy/certs/

# 2. 生成证书（将域名换成你自己的）
# 这个命令会自动向 Let's Encrypt 申请证书并保存到指定路径
sudo tailscale cert \
  --cert-file /etc/caddy/certs/server.crt \
  --key-file /etc/caddy/certs/server.key \
  rubisco-winpc.tailbd6e7c.ts.net
```

### 设置权限

由于你是用 `sudo` 生成的文件，默认所有者是 `root`，后台运行的 `caddy` 用户可能读不到。必须修改权限：

```shell
# 将证书目录及其文件的所有权交给 caddy 用户
sudo chown -R caddy:caddy /etc/caddy/certs/

# 设置标准权限
sudo chmod 755 /etc/caddy/certs/
sudo chmod 644 /etc/caddy/certs/server.crt /etc/caddy/certs/server.key
```

### 证书更新说明

- **有效期**：Tailscale 提供的 Let's Encrypt 证书有效期通常为 **90 天**。
- **如何更新**：如果你是按照上面的方式手动生成文件并配置在 Caddyfile 里的，**Tailscale 不会自动帮你更新磁盘上的文件**。你需要定期（例如每两个月）重新执行一次上面的 `tailscale cert` 命令。

## Nuxt 项目准备

在项目根目录下确保 `nuxt.config.ts` 的 `baseURL` 为 `'/'`（若部署在根路径），然后执行构建：

```shell
# 构建生产环境代码
rm -rf .output && npm run build
```

## 使用 PM2 管理进程

使用 PM2 启动 Nuxt 渲染器。建议显式指定端口和主机：

```shell
# 启动并命名
PORT=3000 HOST=127.0.0.1 pm2 start .output/server/index.mjs --name "xxx"

# 保存当前列表（关键：这会生成 ~/.pm2/dump.pm2）
pm2 save
```

## 配置 Caddy 反向代理

### 安装 Caddy

通过官方仓库安装可以确保获取最新版本，并自动注册系统服务。

```shell
# 安装必要的依赖
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https

# 添加 Caddy 官方 GPG 密钥
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg

# 添加 Caddy 官方存储库
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list

# 更新软件源并安装
sudo apt update
sudo apt install caddy
```

### 配置https反向代理

编辑 `/etc/caddy/Caddyfile`。利用 Tailscale 提供的域名实现全自动 HTTPS。

```text title=/etc/caddy/Caddyfile
{
    # 如果 80 端口被 Windows 占用，可以自定义 http 端口
    http_port 8080
}

# 替换成你的 Tailscale 完整域名
rubisco-winpc.tailbd6e7c.ts.net {
    # 将根目录所有请求转发给 Nuxt
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
    }

    # 指定你的证书路径（如果使用 Tailscale 自动证书则不需这两行）
    tls /etc/caddy/certs/server.crt /etc/caddy/certs/server.key
}
```

**启动 Caddy 服务：**

```shell
sudo systemctl restart caddy
```

### 进阶：无需手动生成文件

Caddy 有一个“黑科技”：它能直接从 Tailscale 的进程里实时获取证书，无需任何 `.crt` 文件。

如果你想省掉手动生成和更新证书的麻烦，可以这样做 [Caddy certificates on Tailscale · Tailscale Docs](https://tailscale.com/docs/integrations/web-servers/caddy/caddy-certificates)：

1. **修改 Tailscale 配置**，允许 Caddy 获取证书： 编辑 `/etc/default/tailscaled`，添加一行： `TS_PERMIT_CERT_UID=caddy` 然后重启 Tailscale ：`sudo systemctl restart tailscaled`
2. **修改 Caddyfile**，删掉 `tls` 那一行：
   
```text title="/etc/caddy/Caddyfile" 
rubisco-winpc.tailbd6e7c.ts.net {
    reverse_proxy localhost:3000
    # 无需手动指定 tls 路径，Caddy 会自动找 Tailscale 要证书
}
```

3. **重启 Caddy**。这样证书就会由 Caddy 和 Tailscale 自动协商并**自动续期**，你再也不用管它了。



## 配置开机自启动 

由于 WSL2 并不是真正的独立系统，它需要 Windows 开机后触发。

### Caddy 自启 (Linux 侧)

Caddy 作为标准的 Systemd 服务，只需一次配置：

```shell
sudo systemctl enable caddy
```

### PM2 自启 (Windows 引导侧)

不要使用复杂的 `pm2 startup` systemd 脚本（WSL 兼容性差），直接利用 Windows 启动项拉起：

1. 按下 `Win + R`，输入 `shell:startup` 并回车。
    
2. 新建一个 **快捷方式**。
    
3. **对象位置** 填入（注意路径换成你自己的）：
    
```shell
wsl.exe -d Ubuntu -u rubisco0211 -- /home/rubisco0211/.nvm/versions/node/v22.14.0/bin/pm2 resurrect
```
    
_解释：`resurrect` 命令会读取 `pm2 save` 的备份，瞬间复活所有服务。_

    
4. 快捷方式属性里可设为 **“最小化”** 运行，避免弹窗。
    

## 常用维护命令

| **任务**            | **命令**                                     |
| ----------------- | ------------------------------------------ |
| **查看服务状态**        | `pm2 list` / `sudo systemctl status caddy` |
| **更新代码后重启**       | `npm run build && pm2 reload nuxt-root`    |
| **修改配置后重启 Caddy** | `sudo systemctl reload caddy`              |
| **查看 Nuxt 日志**    | `pm2 logs nuxt-root`                       |
| **检查端口占用**        | `sudo ss -tulpn`                           |
|                   |                                            |

---

## 避坑指南

- **重定向循环**：如果出现 "Too many redirects"，请检查 Caddy 是否用了 `handle_path`（剥离了路径）但 Nuxt 内部又在寻找该路径。
- **管理端口冲突**：如果 Caddy 启动报 `2019` 端口占用，请 `sudo pkill -9 caddy` 后再试。
- **浏览器缓存**：调试重定向问题时，**务必使用无痕模式**，否则浏览器会死记硬背之前的错误路径。

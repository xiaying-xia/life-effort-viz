# 人生努力可视化

把日常努力变成经验值（XP）和等级（Lv），可视化你的成长。支持安装到手机主屏幕，像 App 一样使用。

## 功能

- **6 大维度**：健康、学习、财务、社交、事业、创作
- **习惯打卡**：一键打卡，自动加 XP
- **动态播报**：实时记录「健康 +50 XP · 运动 30 分钟」
- **目标管理**：完成目标获得奖励 XP
- **PWA**：可安装到 iPhone / Android 主屏幕

## 快速开始

```bash
cd ~/Projects/life-effort-viz
npm install
npm run dev
```

浏览器打开 http://localhost:5174

## 安装为 App

部署到公网后，手机用 4G/5G 也能打开，无需和电脑同一 WiFi。

**线上地址：** https://xiaying-xia.github.io/life-effort-viz/

详细部署步骤见 [docs/部署到公网.md](docs/部署到公网.md)

### iPhone
1. 用 **Safari** 打开网页（`npm run dev:lan` 后用手机访问电脑 IP:5174）
2. 点击分享 → **添加到主屏幕**

### Android
1. Chrome 打开网页
2. 菜单 → **安装应用** 或 **添加到主屏幕**

### 局域网访问（手机测试）

```bash
npm run dev:lan
```

确保手机和电脑在同一 WiFi，访问 `http://<电脑IP>:5174`

## 数据

所有数据保存在浏览器 localStorage，不上传服务器。

## 构建

```bash
npm run build
npm run preview
```

构建产物在 `dist/`，可部署到 Vercel、GitHub Pages 等。

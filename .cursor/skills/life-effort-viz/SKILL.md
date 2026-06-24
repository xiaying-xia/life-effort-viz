---
name: life-effort-viz
description: >-
  维护「人生努力可视化」PWA（life-effort-viz）：Vue3 习惯/任务/目标/奖励、
  LocalStorage、GitHub Pages 部署、朱顶红+💎宝石 UI。在用户要改努力可视化、
  行动中心、任务总览、习惯打卡、配色、宝石图标、手机 PWA，或提到 life-effort-viz 时使用。
---

# 人生努力可视化（life-effort-viz）

## 项目概览

把日常努力变成 XP → 六维度升级 → 手机 PWA 可视化。

| 项 | 值 |
|---|---|
| 本地路径 | `~/Projects/life-effort-viz` |
| GitHub | `xiaying-xia/life-effort-viz` |
| 线上 | https://xiaying-xia.github.io/life-effort-viz/ |
| 技术栈 | Vue 3 + Vite 8 + vite-plugin-pwa |
| 数据 | LocalStorage `life-effort-viz-v3` |
| 开发端口 | `5174`（`npm run dev`） |

## 核心功能

- **六维度**：健康/学习/财务/社交/事业/创作 — XP、等级、进度条
- **行动中心**：维度升级进度（习惯/目标/任务 XP 来源明细）、习惯打卡、目标、动态
- **任务**：日/周/月维度、总览统计、周期重复、CRUD
- **习惯 / 目标 / 奖励**：完整增删改；奖励含心愿单、金币、已购买
- **成长记录**：时间线统计

## UI 规范

- **配色**：蓝粉紫 pastel（`#9ACBFB` `#B6DBFB` `#FCA7C4` `#FDC2D7` `#C5ABD3`），见 `src/style.css`
- **朱顶红**：`HandDrawnIcon name="amaryllis"`，内联 SVG
- **宝石 💎**：`GemIcon`，菱形切割 + 火彩动画；`sparkle intense` 用于侧边栏菜单（一直闪）
- **侧边栏宝石色**：成长蓝 / 行动粉 / 目标紫 / 任务青 / 习惯绿 / 奖励金 / 设置薰衣草
- **副标题**：「今天也要发光啊」
- **图标必须用内联 SVG 组件**，不要用 `<img src="/icons/...">`（GitHub Pages 易 404）

## 关键文件

| 文件 | 职责 |
|------|------|
| `src/composables/useGameStore.js` | 全部状态与业务逻辑 |
| `src/App.vue` | 布局、路由、侧边栏 |
| `src/components/AppSidebar.vue` | 左侧导航 + 菜单宝石 |
| `src/components/GemIcon.vue` | 💎 宝石（color/intense/phase） |
| `src/components/HandDrawnIcon.vue` | 朱顶红 |
| `src/views/ActionCenter.vue` | 行动中心 |
| `src/views/TasksPage.vue` | 任务总览+列表 |
| `src/views/HabitsPage.vue` / `RewardsPage.vue` | 习惯/奖励 |
| `src/components/GoalBoard.vue` | 目标 |
| `src/utils/period.js` | 日/周/月周期工具 |
| `vite.config.js` | PWA + GitHub Pages base |
| `docs/部署到公网.md` | 部署说明 |

## 开发流程

```bash
cd ~/Projects/life-effort-viz
npm install          # 首次
npm run dev          # 本地预览 http://127.0.0.1:5174
npm run build        # 验证构建
npm run build:pages  # GitHub Pages 构建
npm run deploy:pages # 发布到 gh-pages（手机更新必做）
```

## 部署注意

- Pages 源：**gh-pages** 分支，root 目录
- 终端 `git push` 可能失败 → 用户常用 **GitHub Desktop** 推 main
- `deploy:pages` 需在本机终端执行；PWA 更新需完全关闭 App 再打开
- **不要擅自 commit**，除非用户明确要求

## 改功能检查清单

1. 先 `move_agent_to_root` 到 `~/Projects/life-effort-viz`
2. 读相关 vue/store 再改，保持最小 diff
3. 任务周期逻辑走 `utils/period.js` + store 的 `refreshRecurringTasks`
4. 新图标用内联 SVG 组件（参考 `GemIcon.vue`）；Vue 模板里避免 `:fill="\`url(#...\`"`，用 computed 拼接
5. `npm run build` 通过后再告知用户部署
6. 中文 UI 文案

## 默认数据

首次加载含 10 习惯、6 目标、3 任务；用户 LocalStorage 数据从 v1/v2 迁移到 v3，勿随意改 STORAGE_KEY 除非做迁移。

## Cursor Automation 任务

**任务名**：`人生努力可视化 · 改功能`

下次要改功能时，在 Cursor **Automations** 里找到并运行该任务，直接说需求即可（例如「侧边栏宝石再大一点」）。

预填配置备份：`.cursor/automation/life-effort-viz-maintain.prefill.json`

新建/恢复任务：Automations → New → 触发器选手动/Webhook → 仓库 `xiaying-xia/life-effort-viz` main → 指令粘贴 prefill 里的 prompt。

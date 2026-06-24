# life-effort-viz 参考

## 页面路由（App.vue `page` ref）

| id | 页面 | 组件 |
|----|------|------|
| growth | 总的成长记录 | GrowthRecord.vue |
| action | 行动中心 | ActionCenter.vue |
| goals | 目标 | GoalBoard.vue |
| tasks | 任务 | TasksPage.vue |
| habits | 习惯 | HabitsPage.vue |
| rewards | 奖励 | RewardsPage.vue |
| settings | 系统设置 | InstallPrompt + QuickLog |

## GemIcon 颜色

`blue` `pink` `purple` `gold` `green` `coral` `cyan` `lavender`

Props: `size`, `sparkle`, `intense`, `phase`（错开动画）

## Store 主要 API

- 习惯：`checkInHabit`, `addHabit`, `updateHabit`, `deleteHabit`
- 目标：`completeGoal`, `addGoal`, `updateGoal`, `deleteGoal`, `reopenGoal`
- 任务：`completeTask`, `addTask`, `updateTask`, `deleteTask`, `reopenTask`, `taskOverviewStats`
- 奖励：`addReward`, `updateReward`, `deleteReward`, `redeemReward`
- XP：`addXp`, `dimensionsWithXp`（含 `xpBreakdown`）

## 常见改动入口

- 改菜单/宝石 → `AppSidebar.vue`
- 改全局色 → `src/style.css`
- 改任务日周月 → `useGameStore.js` + `TasksPage.vue`
- 改 PWA → `vite.config.js`, `index.html`

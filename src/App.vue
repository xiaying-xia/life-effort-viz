<script setup>
import { ref } from 'vue'
import { useGameStore } from './composables/useGameStore.js'
import DimensionProgress from './components/DimensionProgress.vue'
import HabitList from './components/HabitList.vue'
import ActivityFeed from './components/ActivityFeed.vue'
import GoalBoard from './components/GoalBoard.vue'
import QuickLog from './components/QuickLog.vue'
import InstallPrompt from './components/InstallPrompt.vue'

const { dimensionsWithXp, recentLogs, resetAllData } = useGameStore()

const tab = ref('home')
const toast = ref(null)
let toastTimer = null

function showToast(message, ok = true) {
  toast.value = { message, ok }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = null
  }, 2200)
}

function onReset() {
  if (confirm('确定清空所有数据？此操作不可恢复。')) {
    resetAllData()
    showToast('数据已重置', true)
  }
}

const tabs = [
  { id: 'home', label: '行动中心', icon: '🎮' },
  { id: 'log', label: '快速记录', icon: '⚡' },
  { id: 'goals', label: '目标', icon: '🎯' },
  { id: 'settings', label: '设置', icon: '⚙️' },
]
</script>

<template>
  <div class="app">
    <header class="header">
      <div>
        <h1>人生努力可视化</h1>
        <p class="subtitle">把日常努力变成经验值</p>
      </div>
      <div class="header-badge">Lv UP</div>
    </header>

    <main class="main">
      <template v-if="tab === 'home'">
        <InstallPrompt />

        <section class="card">
          <div class="card-title">📈 升级进度</div>
          <DimensionProgress
            v-for="dim in dimensionsWithXp"
            :key="dim.id"
            :dimension="dim"
          />
        </section>

        <div class="grid-2">
          <section class="card">
            <div class="card-title">✅ 习惯打卡</div>
            <HabitList @toast="showToast" />
          </section>
          <section class="card">
            <div class="card-title">📢 动态播报</div>
            <ActivityFeed :logs="recentLogs" />
          </section>
        </div>
      </template>

      <template v-else-if="tab === 'log'">
        <section class="card">
          <div class="card-title">⚡ 快速记录</div>
          <p class="hint">不在习惯列表里的努力，也可以手动记录</p>
          <QuickLog @toast="showToast" />
        </section>
        <section class="card">
          <div class="card-title">📢 最近动态</div>
          <ActivityFeed :logs="recentLogs" />
        </section>
      </template>

      <template v-else-if="tab === 'goals'">
        <section class="card">
          <div class="card-title">🎯 目标管理</div>
          <GoalBoard @toast="showToast" />
        </section>
      </template>

      <template v-else-if="tab === 'settings'">
        <section class="card">
          <div class="card-title">📲 安装为 App</div>
          <InstallPrompt />
          <ul class="settings-list">
            <li>iPhone：Safari 打开 → 分享 → 添加到主屏幕</li>
            <li>Android：Chrome 打开 → 菜单 → 安装应用</li>
            <li>电脑：地址栏右侧会出现安装图标</li>
          </ul>
        </section>
        <section class="card">
          <div class="card-title">💾 数据说明</div>
          <p class="hint">
            所有数据保存在本机浏览器，不会上传到服务器。清除浏览器数据会丢失记录。
          </p>
        </section>
        <section class="card danger">
          <div class="card-title">⚠️ 重置数据</div>
          <p class="hint">清空所有 XP、打卡记录和目标进度</p>
          <button class="btn btn-ghost" @click="onReset">重置全部数据</button>
        </section>
      </template>
    </main>

    <nav class="bottom-nav">
      <button
        v-for="t in tabs"
        :key="t.id"
        class="nav-item"
        :class="{ active: tab === t.id }"
        @click="tab = t.id"
      >
        <span class="nav-icon">{{ t.icon }}</span>
        <span class="nav-label">{{ t.label }}</span>
      </button>
    </nav>

    <Transition name="toast">
      <div
        v-if="toast"
        class="toast"
        :class="{ fail: !toast.ok }"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
  padding-top: calc(16px + env(safe-area-inset-top, 0px));
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #fff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 13px;
  color: var(--muted);
  margin-top: 4px;
}

.header-badge {
  font-size: 12px;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 720px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

.hint {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 12px;
  line-height: 1.5;
}

.settings-list {
  list-style: none;
  font-size: 14px;
  line-height: 2;
  color: var(--muted);
}

.danger {
  border-color: rgba(239, 68, 68, 0.3);
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: var(--safe-bottom);
  z-index: 50;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 4px 8px;
  color: var(--muted);
  font-size: 11px;
}

.nav-item.active {
  color: var(--accent2);
}

.nav-icon {
  font-size: 20px;
}

.nav-label {
  font-weight: 600;
}

.toast.fail {
  border-color: rgba(239, 68, 68, 0.4);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>

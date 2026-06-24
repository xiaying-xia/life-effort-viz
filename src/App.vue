<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from './composables/useGameStore.js'
import AppSidebar from './components/AppSidebar.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import GoalBoard from './components/GoalBoard.vue'
import QuickLog from './components/QuickLog.vue'
import ActionCenter from './views/ActionCenter.vue'
import GrowthRecord from './views/GrowthRecord.vue'
import TasksPage from './views/TasksPage.vue'
import HabitsPage from './views/HabitsPage.vue'
import RewardsPage from './views/RewardsPage.vue'
import DecoAnimation from './components/DecoAnimation.vue'
import HandDrawnIcon from './components/HandDrawnIcon.vue'
import GemIcon from './components/GemIcon.vue'

const { resetAllData } = useGameStore()

const page = ref('action')
const mobileMenuOpen = ref(false)
const toast = ref(null)
let toastTimer = null

const pageTitles = {
  growth: '总的成长记录',
  action: '行动中心',
  goals: '目标',
  tasks: '任务',
  habits: '习惯',
  rewards: '奖励',
  settings: '系统设置',
}

const pageTitle = computed(() => pageTitles[page.value] || '')

function showToast(message, ok = true) {
  toast.value = { message, ok }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 2200)
}

function navigate(id) {
  page.value = id
}

function onReset() {
  if (confirm('确定清空所有数据？此操作不可恢复。')) {
    resetAllData()
    showToast('数据已重置', true)
  }
}
</script>

<template>
  <div class="layout">
    <DecoAnimation />
    <AppSidebar
      :active="page"
      :mobile-open="mobileMenuOpen"
      @navigate="navigate"
      @close-mobile="mobileMenuOpen = false"
    />

    <div class="main-wrap">
      <header class="topbar">
        <button class="menu-btn" @click="mobileMenuOpen = true">☰</button>
        <div class="topbar-title-wrap">
          <div class="topbar-icons">
            <HandDrawnIcon name="amaryllis" :size="26" />
            <GemIcon color="blue" :size="24" />
          </div>
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="topbar-badge">
          <GemIcon color="gold" :size="20" />
          <span>Lv UP</span>
        </div>
      </header>

      <main class="content">
        <GrowthRecord v-if="page === 'growth'" />
        <ActionCenter v-else-if="page === 'action'" @toast="showToast" @navigate="navigate" />
        <section v-else-if="page === 'goals'" class="card">
          <div class="card-title">🎯 目标管理</div>
          <GoalBoard @toast="showToast" />
        </section>
        <TasksPage v-else-if="page === 'tasks'" @toast="showToast" />
        <HabitsPage v-else-if="page === 'habits'" @toast="showToast" />
        <RewardsPage v-else-if="page === 'rewards'" @toast="showToast" />
        <template v-else-if="page === 'settings'">
          <InstallPrompt />
          <section class="card">
            <div class="card-title">⚡ 快速记录</div>
            <QuickLog @toast="showToast" />
          </section>
          <section class="card">
            <div class="card-title">💾 数据说明</div>
            <p class="hint">数据保存在本机浏览器，清除缓存会丢失记录。</p>
          </section>
          <section class="card danger-card">
            <div class="card-title">⚠️ 重置数据</div>
            <button class="btn btn-ghost" @click="onReset">重置全部数据</button>
          </section>
        </template>
      </main>
    </div>

    <Transition name="toast">
      <div v-if="toast" class="toast" :class="{ fail: !toast.ok }">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100%;
  display: flex;
  position: relative;
}

.main-wrap {
  flex: 1;
  margin-left: 220px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.main-wrap::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  pointer-events: none;
  opacity: 0.12;
  background: radial-gradient(circle at 70% 30%, #F04A3A 0%, transparent 65%);
}

.topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top, 0px));
  border-bottom: 2px dashed var(--border);
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 40;
  box-shadow: var(--shadow-sm);
}

.menu-btn {
  display: none;
  font-size: 22px;
  padding: 4px 10px;
  color: var(--accent-deep);
  background: var(--surface2);
  border-radius: 12px;
}

.topbar-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.topbar-icons {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.topbar h1 {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-strong);
}

.topbar-badge {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--btn-gradient);
  color: #fff;
  box-shadow: 0 4px 12px rgba(252, 167, 196, 0.35);
  animation: twinkle 3s ease-in-out infinite;
}

.content {
  flex: 1;
  padding: 20px 24px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  max-width: 1100px;
}

.hint {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
}

.danger-card {
  border-color: rgba(251, 113, 133, 0.35);
  background: rgba(240, 253, 250, 0.95);
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

@media (max-width: 768px) {
  .main-wrap {
    margin-left: 0;
  }
  .menu-btn {
    display: block;
  }
  .content {
    padding: 16px;
  }
}
</style>

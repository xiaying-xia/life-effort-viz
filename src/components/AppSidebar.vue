<script setup>
defineProps({
  active: { type: String, default: 'action' },
  mobileOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['navigate', 'close-mobile'])

const menuItems = [
  { id: 'growth', label: '总的成长记录', icon: '📊' },
  { id: 'action', label: '行动中心', icon: '🎮' },
  { id: 'goals', label: '目标', icon: '🎯' },
  { id: 'tasks', label: '任务', icon: '📋' },
  { id: 'habits', label: '习惯', icon: '✅' },
  { id: 'rewards', label: '奖励', icon: '🎁' },
]

function go(id) {
  emit('navigate', id)
  emit('close-mobile')
}
</script>

<template>
  <aside class="sidebar" :class="{ open: mobileOpen }">
    <div class="sidebar-brand">
      <span class="brand-icon">✨</span>
      <div>
        <div class="brand-title">努力可视化</div>
        <div class="brand-sub">今天也要加油鸭 💗</div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <button
        v-for="item in menuItems"
        :key="item.id"
        class="nav-link"
        :class="{ active: active === item.id }"
        @click="go(item.id)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <button
        class="nav-link"
        :class="{ active: active === 'settings' }"
        @click="go('settings')"
      >
        <span class="nav-icon">⚙️</span>
        <span class="nav-label">系统设置</span>
      </button>
    </div>
  </aside>
  <div
    v-if="mobileOpen"
    class="sidebar-overlay"
    @click="emit('close-mobile')"
  />
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 220px;
  background: rgba(255, 255, 255, 0.85);
  border-right: 2px solid var(--border);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  z-index: 60;
  padding-top: env(safe-area-inset-top, 0px);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  border-bottom: 2px dashed var(--border);
}

.brand-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(252, 167, 196, 0.4));
  animation: twinkle 4s ease-in-out infinite;
}

.brand-title {
  font-size: 15px;
  font-weight: 800;
  line-height: 1.3;
  background: linear-gradient(135deg, #9ACBFB, #FCA7C4, #C5ABD3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-sub {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
}

.sidebar-footer {
  padding: 8px;
  border-top: 2px dashed var(--border);
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
}

.nav-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  margin-bottom: 4px;
  transition: background 0.15s, color 0.15s, transform 0.12s;
}

.nav-link:hover {
  background: var(--accent-soft);
  color: var(--text-strong);
}

.nav-link.active {
  background: linear-gradient(135deg, rgba(154, 203, 251, 0.45), rgba(252, 167, 196, 0.28));
  color: #7c5a8a;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(197, 171, 211, 0.12);
    backdrop-filter: blur(2px);
    z-index: 55;
  }
}
</style>

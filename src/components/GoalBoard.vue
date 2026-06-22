<script setup>
import { ref } from 'vue'
import { useGameStore } from '../composables/useGameStore.js'

const emit = defineEmits(['toast'])
const { activeGoals, doneGoals, getDimension, completeGoal } = useGameStore()
const tab = ref('active')

function onComplete(goalId) {
  if (!confirm('确认完成此目标？将获得奖励 XP')) return
  const result = completeGoal(goalId)
  emit('toast', result.message, result.ok)
}
</script>

<template>
  <div class="goal-tabs">
    <button
      class="tab"
      :class="{ active: tab === 'active' }"
      @click="tab = 'active'"
    >
      进行中 ({{ activeGoals.length }})
    </button>
    <button
      class="tab"
      :class="{ active: tab === 'done' }"
      @click="tab = 'done'"
    >
      已完成 ({{ doneGoals.length }})
    </button>
  </div>

  <div class="goal-list">
    <template v-if="tab === 'active'">
      <div v-for="goal in activeGoals" :key="goal.id" class="goal-item">
        <div>
          <div class="goal-name">{{ goal.name }}</div>
          <div class="goal-meta">
            {{ getDimension(goal.dimensionId)?.icon }}
            {{ getDimension(goal.dimensionId)?.name }}
            · 完成奖励 +{{ goal.rewardXp }} XP
          </div>
        </div>
        <button class="btn btn-sm btn-ghost" @click="onComplete(goal.id)">
          完成
        </button>
      </div>
      <div v-if="activeGoals.length === 0" class="empty">暂无进行中的目标</div>
    </template>

    <template v-else>
      <div v-for="goal in doneGoals" :key="goal.id" class="goal-item done">
        <div>
          <div class="goal-name">✓ {{ goal.name }}</div>
          <div class="goal-meta">
            {{ getDimension(goal.dimensionId)?.icon }}
            {{ getDimension(goal.dimensionId)?.name }}
          </div>
        </div>
      </div>
      <div v-if="doneGoals.length === 0" class="empty">还没有完成的目标</div>
    </template>
  </div>
</template>

<style scoped>
.goal-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.tab {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.04);
}
.tab.active {
  background: var(--accent);
  color: #fff;
}
.goal-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.goal-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}
.goal-item.done {
  opacity: 0.7;
}
.goal-name {
  font-size: 14px;
  font-weight: 600;
}
.goal-meta {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}
.empty {
  text-align: center;
  color: var(--muted);
  font-size: 14px;
  padding: 16px;
}
</style>

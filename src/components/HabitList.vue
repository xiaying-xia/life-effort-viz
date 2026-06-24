<script setup>
import { useGameStore } from '../composables/useGameStore.js'

defineProps({
  compact: { type: Boolean, default: false },
  manageable: { type: Boolean, default: false },
})

const emit = defineEmits(['toast', 'edit', 'delete'])
const { state, checkInHabit, isHabitCheckedToday, getDimension, getHabitWeekProgress } = useGameStore()

function onCheck(habitId) {
  const result = checkInHabit(habitId)
  emit('toast', result.message, result.ok)
}

const enabledHabits = () => state.habits.filter((h) => h.enabled)
</script>

<template>
  <div class="habit-list" :class="{ compact }">
    <div
      v-for="habit in enabledHabits()"
      :key="habit.id"
      class="habit-item"
    >
      <div class="habit-info">
        <div class="habit-name">{{ habit.name }}</div>
        <div class="habit-meta">
          {{ getDimension(habit.dimensionId)?.icon }}
          {{ getDimension(habit.dimensionId)?.name }}
          · +{{ habit.xp }} XP
        </div>
        <div class="progress-row">
          <div class="bar-track">
            <div
              class="bar-fill"
              :style="{
                width: getHabitWeekProgress(habit.id).percent + '%',
                background: getDimension(habit.dimensionId)?.color,
              }"
            />
          </div>
          <span class="pct">{{ getHabitWeekProgress(habit.id).percent }}%</span>
        </div>
      </div>
      <div class="habit-actions">
        <button
          class="btn btn-sm"
          :class="isHabitCheckedToday(habit.id) ? 'done' : 'btn-primary'"
          :disabled="isHabitCheckedToday(habit.id)"
          @click="onCheck(habit.id)"
        >
          {{ isHabitCheckedToday(habit.id) ? '✓ 已打卡' : '今日打卡' }}
        </button>
        <template v-if="manageable">
          <button class="btn btn-ghost btn-sm" @click="emit('edit', habit)">编辑</button>
          <button class="btn btn-ghost btn-sm" @click="emit('delete', habit.id)">删除</button>
        </template>
      </div>
    </div>
    <div v-if="enabledHabits().length === 0" class="empty">暂无启用的习惯</div>
  </div>
</template>

<style scoped>
.habit-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 360px;
  overflow-y: auto;
}

.habit-list.compact {
  max-height: 280px;
}

.habit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  background: var(--item-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.habit-info {
  flex: 1;
  min-width: 0;
}

.habit-name {
  font-size: 14px;
  font-weight: 600;
}

.habit-meta {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.bar-track {
  flex: 1;
  height: 6px;
  background: var(--surface2);
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s;
}

.pct {
  font-size: 11px;
  color: var(--muted);
  min-width: 32px;
}

.habit-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.done {
  background: var(--success-soft);
  color: #15803d;
}

.empty {
  text-align: center;
  color: var(--muted);
  font-size: 13px;
  padding: 16px;
}
</style>

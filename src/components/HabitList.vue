<script setup>
import { useGameStore } from '../composables/useGameStore.js'

const emit = defineEmits(['toast'])
const { state, checkInHabit, isHabitCheckedToday, getDimension } = useGameStore()

function onCheck(habitId) {
  const result = checkInHabit(habitId)
  emit('toast', result.message, result.ok)
}

const enabledHabits = () => state.habits.filter((h) => h.enabled)
</script>

<template>
  <div class="habit-list">
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
      </div>
      <button
        class="btn btn-sm"
        :class="isHabitCheckedToday(habit.id) ? 'done' : 'btn-primary'"
        :disabled="isHabitCheckedToday(habit.id)"
        @click="onCheck(habit.id)"
      >
        {{ isHabitCheckedToday(habit.id) ? '✓ 已打卡' : '打卡' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.habit-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
}
.habit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
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
.done {
  background: rgba(34, 197, 94, 0.2);
  color: var(--success);
}
</style>

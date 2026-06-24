<script setup>
import { ref } from 'vue'
import { useGameStore } from '../composables/useGameStore.js'
import HabitList from '../components/HabitList.vue'

const emit = defineEmits(['toast'])
const {
  state,
  getDimension,
  getHabitWeekProgress,
  addHabit,
  updateHabit,
  deleteHabit,
  toggleHabit,
} = useGameStore()

const editingId = ref(null)
const form = ref(emptyForm())

function emptyForm() {
  return {
    name: '',
    dimensionId: 'health',
    xp: 30,
    frequency: 'daily',
    weeklyTarget: 7,
  }
}

function startEdit(habit) {
  editingId.value = habit.id
  form.value = {
    name: habit.name,
    dimensionId: habit.dimensionId,
    xp: habit.xp,
    frequency: habit.frequency,
    weeklyTarget: habit.weeklyTarget || (habit.frequency === 'weekly' ? 3 : 7),
  }
}

function cancelEdit() {
  editingId.value = null
  form.value = emptyForm()
}

function submitForm() {
  const result = editingId.value
    ? updateHabit(editingId.value, form.value)
    : addHabit(
        form.value.name,
        form.value.dimensionId,
        form.value.xp,
        form.value.frequency,
        form.value.weeklyTarget,
      )
  emit('toast', result.message, result.ok)
  if (result.ok) {
    editingId.value = null
    form.value = emptyForm()
  }
}

function onDelete(id) {
  if (!confirm('确定删除此习惯？打卡记录也会清除')) return
  deleteHabit(id)
  if (editingId.value === id) cancelEdit()
  emit('toast', '已删除', true)
}
</script>

<template>
  <div class="habits-page">
    <section class="card">
      <div class="card-title">✅ 今日习惯打卡</div>
      <HabitList @toast="(msg, ok) => emit('toast', msg, ok)" />
    </section>

    <section class="card">
      <div class="card-title">{{ editingId ? '✏️ 编辑习惯' : '➕ 添加习惯' }}</div>
      <form class="habit-form" @submit.prevent="submitForm">
        <input v-model="form.name" class="input" placeholder="习惯名称，如：冥想 10 分钟" required />
        <div class="row">
          <select v-model="form.dimensionId" class="select">
            <option v-for="d in state.dimensions" :key="d.id" :value="d.id">
              {{ d.icon }} {{ d.name }}
            </option>
          </select>
          <input v-model.number="form.xp" type="number" class="num-input" min="1" placeholder="XP" />
          <select v-model="form.frequency" class="select narrow">
            <option value="daily">每日</option>
            <option value="weekly">每周</option>
          </select>
          <input
            v-model.number="form.weeklyTarget"
            type="number"
            class="num-input"
            min="1"
            max="7"
            title="每周目标次数"
          />
          <button type="submit" class="btn btn-primary btn-sm">{{ editingId ? '保存' : '添加' }}</button>
        </div>
        <button v-if="editingId" type="button" class="link-btn" @click="cancelEdit">取消编辑</button>
      </form>
    </section>

    <section class="card">
      <div class="card-title">📊 习惯库 & 本周完成率</div>
      <div v-for="habit in state.habits" :key="habit.id" class="habit-row">
        <div class="habit-main">
          <div class="habit-top">
            <span class="habit-name" :class="{ off: !habit.enabled }">{{ habit.name }}</span>
            <div class="habit-actions">
              <button class="btn btn-ghost btn-sm" @click="toggleHabit(habit.id)">
                {{ habit.enabled ? '停用' : '启用' }}
              </button>
              <button class="btn btn-ghost btn-sm" @click="startEdit(habit)">编辑</button>
              <button class="btn btn-ghost btn-sm" @click="onDelete(habit.id)">删除</button>
            </div>
          </div>
          <div class="habit-meta">
            {{ getDimension(habit.dimensionId)?.icon }}
            {{ getDimension(habit.dimensionId)?.name }}
            · +{{ habit.xp }} XP · {{ habit.frequency === 'daily' ? '每日' : '每周' }}
            · 目标 {{ habit.weeklyTarget || 7 }} 次/周
          </div>
          <div class="progress-wrap">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width: getHabitWeekProgress(habit.id).percent + '%',
                  background: getDimension(habit.dimensionId)?.color,
                }"
              />
            </div>
            <span class="progress-text">
              {{ getHabitWeekProgress(habit.id).done }}/{{ getHabitWeekProgress(habit.id).target }}
              ({{ getHabitWeekProgress(habit.id).percent }}%)
            </span>
          </div>
        </div>
      </div>
      <div v-if="state.habits.length === 0" class="empty">还没有习惯，请在上方添加</div>
    </section>
  </div>
</template>

<style scoped>
.habits-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.habit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.select {
  flex: 1;
  min-width: 100px;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
}

.select.narrow {
  flex: 0 0 80px;
}

.num-input {
  width: 64px;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
  text-align: center;
}

.link-btn {
  font-size: 12px;
  color: var(--accent-deep);
  font-weight: 600;
  align-self: flex-start;
}

.habit-row {
  padding: 14px 0;
  border-bottom: 2px dashed var(--border);
}

.habit-row:last-child {
  border-bottom: none;
}

.habit-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.habit-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
}

.habit-name {
  font-size: 15px;
  font-weight: 600;
  flex: 1;
}

.habit-name.off {
  opacity: 0.45;
  text-decoration: line-through;
}

.habit-meta {
  font-size: 12px;
  color: var(--muted);
  margin: 4px 0 8px;
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--surface2);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: var(--muted);
  min-width: 72px;
  text-align: right;
}

.empty {
  text-align: center;
  color: var(--muted);
  padding: 16px;
}
</style>

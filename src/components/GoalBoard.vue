<script setup>
import { ref } from 'vue'
import { useGameStore } from '../composables/useGameStore.js'

const emit = defineEmits(['toast'])
const {
  state,
  activeGoals,
  doneGoals,
  getDimension,
  addGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  reopenGoal,
} = useGameStore()

const tab = ref('active')
const editingId = ref(null)
const form = ref(emptyForm())

function emptyForm() {
  return { name: '', dimensionId: 'health', rewardXp: 200, note: '' }
}

function startEdit(goal) {
  editingId.value = goal.id
  form.value = {
    name: goal.name,
    dimensionId: goal.dimensionId,
    rewardXp: goal.rewardXp,
    note: goal.note || '',
  }
}

function cancelEdit() {
  editingId.value = null
}

function submitForm() {
  const result = editingId.value
    ? updateGoal(editingId.value, form.value)
    : addGoal(form.value.name, form.value.dimensionId, form.value.rewardXp, form.value.note)
  emit('toast', result.message, result.ok)
  if (result.ok) editingId.value = null
}

function onComplete(goalId) {
  if (!confirm('确认完成此目标？将获得奖励 XP')) return
  const result = completeGoal(goalId)
  emit('toast', result.message, result.ok)
}

function onDelete(id) {
  if (!confirm('确定删除此目标？')) return
  deleteGoal(id)
  if (editingId.value === id) editingId.value = null
  emit('toast', '已删除', true)
}

function onReopen(id) {
  const result = reopenGoal(id)
  emit('toast', result.message, result.ok)
  if (result.ok) tab.value = 'active'
}
</script>

<template>
  <div class="goal-board">
    <form class="add-form" @submit.prevent="submitForm">
      <div class="form-head">
        <span>{{ editingId ? '✏️ 编辑目标' : '➕ 添加目标' }}</span>
        <button v-if="editingId" type="button" class="link-btn" @click="cancelEdit">取消编辑</button>
      </div>
      <input v-model="form.name" class="input" placeholder="目标名称" required />
      <div class="row">
        <select v-model="form.dimensionId" class="select">
          <option v-for="d in state.dimensions" :key="d.id" :value="d.id">
            {{ d.icon }} {{ d.name }}
          </option>
        </select>
        <input v-model.number="form.rewardXp" type="number" class="xp-input" min="1" placeholder="奖励XP" />
        <button type="submit" class="btn btn-primary btn-sm">{{ editingId ? '保存' : '添加' }}</button>
      </div>
      <input v-model="form.note" class="input" placeholder="备注（选填）" />
    </form>

    <div class="goal-tabs">
      <button class="tab" :class="{ active: tab === 'active' }" @click="tab = 'active'">
        进行中 ({{ activeGoals.length }})
      </button>
      <button class="tab" :class="{ active: tab === 'done' }" @click="tab = 'done'">
        已完成 ({{ doneGoals.length }})
      </button>
    </div>

    <div class="goal-list">
      <template v-if="tab === 'active'">
        <div v-for="goal in activeGoals" :key="goal.id" class="goal-item">
          <div class="goal-info">
            <div class="goal-name">{{ goal.name }}</div>
            <div class="goal-meta">
              {{ getDimension(goal.dimensionId)?.icon }}
              {{ getDimension(goal.dimensionId)?.name }}
              · 完成奖励 +{{ goal.rewardXp }} XP
            </div>
            <div v-if="goal.note" class="goal-note">{{ goal.note }}</div>
          </div>
          <div class="actions">
            <button class="btn btn-primary btn-sm" @click="onComplete(goal.id)">完成</button>
            <button class="btn btn-ghost btn-sm" @click="startEdit(goal)">编辑</button>
            <button class="btn btn-ghost btn-sm" @click="onDelete(goal.id)">删除</button>
          </div>
        </div>
        <div v-if="activeGoals.length === 0" class="empty">暂无进行中的目标</div>
      </template>

      <template v-else>
        <div v-for="goal in doneGoals" :key="goal.id" class="goal-item done">
          <div class="goal-info">
            <div class="goal-name">✓ {{ goal.name }}</div>
            <div class="goal-meta">
              {{ getDimension(goal.dimensionId)?.icon }}
              {{ getDimension(goal.dimensionId)?.name }}
            </div>
          </div>
          <div class="actions">
            <button class="btn btn-ghost btn-sm" @click="onReopen(goal.id)">恢复</button>
            <button class="btn btn-ghost btn-sm" @click="onDelete(goal.id)">删除</button>
          </div>
        </div>
        <div v-if="doneGoals.length === 0" class="empty">还没有完成的目标</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.goal-board {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.add-form {
  background: var(--item-bg);
  border: 2px dashed var(--border);
  border-radius: var(--radius-sm);
  padding: 14px;
}

.form-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 10px;
  color: var(--text-strong);
}

.link-btn {
  font-size: 12px;
  color: var(--accent-deep);
  font-weight: 600;
}

.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
  margin-bottom: 8px;
}

.row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.select {
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
}

.xp-input {
  width: 80px;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
  text-align: center;
}

.goal-tabs {
  display: flex;
  gap: 8px;
}

.tab {
  flex: 1;
  padding: 8px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  background: rgba(240, 253, 250, 0.5);
}

.tab.active {
  background: var(--btn-gradient);
  color: #fff;
}

.goal-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.goal-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  background: var(--item-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.goal-item.done {
  opacity: 0.75;
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

.goal-note {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex-shrink: 0;
}

.empty {
  text-align: center;
  color: var(--muted);
  font-size: 14px;
  padding: 16px;
}
</style>

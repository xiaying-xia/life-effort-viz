<script setup>
import { ref } from 'vue'
import { useGameStore } from '../composables/useGameStore.js'
import DimensionProgress from '../components/DimensionProgress.vue'
import HabitList from '../components/HabitList.vue'
import ActivityFeed from '../components/ActivityFeed.vue'
import HandDrawnIcon from '../components/HandDrawnIcon.vue'

const emit = defineEmits(['toast', 'navigate'])

const {
  state,
  dimensionsWithXp,
  recentLogs,
  activeGoals,
  getDimension,
  addGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  addHabit,
  updateHabit,
  deleteHabit,
} = useGameStore()

const showGoalForm = ref(false)
const showHabitForm = ref(false)
const editingGoalId = ref(null)
const editingHabitId = ref(null)

const goalForm = ref({ name: '', dimensionId: 'health', rewardXp: 200 })
const habitForm = ref({ name: '', dimensionId: 'health', xp: 30, frequency: 'daily', weeklyTarget: 7 })

function toast(msg, ok) {
  emit('toast', msg, ok)
}

function submitGoal() {
  const result = editingGoalId.value
    ? updateGoal(editingGoalId.value, goalForm.value)
    : addGoal(goalForm.value.name, goalForm.value.dimensionId, goalForm.value.rewardXp)
  toast(result.message, result.ok)
  if (result.ok) {
    showGoalForm.value = false
    editingGoalId.value = null
    goalForm.value = { name: '', dimensionId: 'health', rewardXp: 200 }
  }
}

function submitHabit() {
  const result = editingHabitId.value
    ? updateHabit(editingHabitId.value, habitForm.value)
    : addHabit(
        habitForm.value.name,
        habitForm.value.dimensionId,
        habitForm.value.xp,
        habitForm.value.frequency,
        habitForm.value.weeklyTarget,
      )
  toast(result.message, result.ok)
  if (result.ok) {
    showHabitForm.value = false
    editingHabitId.value = null
    habitForm.value = { name: '', dimensionId: 'health', xp: 30, frequency: 'daily', weeklyTarget: 7 }
  }
}

function editGoal(goal) {
  editingGoalId.value = goal.id
  goalForm.value = { name: goal.name, dimensionId: goal.dimensionId, rewardXp: goal.rewardXp }
  showGoalForm.value = true
}

function editHabit(habit) {
  editingHabitId.value = habit.id
  habitForm.value = {
    name: habit.name,
    dimensionId: habit.dimensionId,
    xp: habit.xp,
    frequency: habit.frequency,
    weeklyTarget: habit.weeklyTarget || 7,
  }
  showHabitForm.value = true
}

function removeGoal(id) {
  if (!confirm('删除此目标？')) return
  deleteGoal(id)
  toast('已删除', true)
}

function removeHabit(id) {
  if (!confirm('删除此习惯？')) return
  deleteHabit(id)
  toast('已删除', true)
}

function completeGoalQuick(id) {
  if (!confirm('确认完成目标？')) return
  const result = completeGoal(id)
  toast(result.message, result.ok)
}
</script>

<template>
  <div class="action-center">
    <section class="card upgrade-panel">
      <div class="card-title">
        <HandDrawnIcon name="amaryllis" :size="22" />
        <span>升级进度</span>
      </div>
      <p class="panel-hint">习惯打卡、目标完成、任务完成获得的 XP 都会累计到对应维度</p>
      <DimensionProgress
        v-for="dim in dimensionsWithXp"
        :key="dim.id"
        :dimension="dim"
      />
    </section>

    <div class="dashboard-grid">
      <section class="card">
        <div class="card-head">
          <div class="card-title">✅ 习惯打卡</div>
          <button class="btn btn-ghost btn-sm" @click="showHabitForm = !showHabitForm">
            {{ showHabitForm ? '收起' : '+ 添加' }}
          </button>
        </div>

        <form v-if="showHabitForm" class="mini-form" @submit.prevent="submitHabit">
          <input v-model="habitForm.name" class="input" placeholder="习惯名称" required />
          <div class="row">
            <select v-model="habitForm.dimensionId" class="select">
              <option v-for="d in state.dimensions" :key="d.id" :value="d.id">
                {{ d.icon }} {{ d.name }}
              </option>
            </select>
            <input v-model.number="habitForm.xp" type="number" class="num" min="1" />
            <button type="submit" class="btn btn-primary btn-sm">{{ editingHabitId ? '保存' : '添加' }}</button>
          </div>
        </form>

        <HabitList
          manageable
          compact
          @toast="toast"
          @edit="editHabit"
          @delete="removeHabit"
        />
      </section>

      <section class="card">
        <div class="card-title">📢 动态播报</div>
        <ActivityFeed :logs="recentLogs" />
      </section>

      <section class="card goals-preview">
        <div class="card-head">
          <div class="card-title">🎯 目标</div>
          <button class="btn btn-ghost btn-sm" @click="showGoalForm = !showGoalForm">
            {{ showGoalForm ? '收起' : '+ 添加' }}
          </button>
        </div>

        <form v-if="showGoalForm" class="mini-form" @submit.prevent="submitGoal">
          <input v-model="goalForm.name" class="input" placeholder="目标名称" required />
          <div class="row">
            <select v-model="goalForm.dimensionId" class="select">
              <option v-for="d in state.dimensions" :key="d.id" :value="d.id">
                {{ d.icon }} {{ d.name }}
              </option>
            </select>
            <input v-model.number="goalForm.rewardXp" type="number" class="num" min="1" />
            <button type="submit" class="btn btn-primary btn-sm">{{ editingGoalId ? '保存' : '添加' }}</button>
          </div>
        </form>

        <div v-if="activeGoals.length === 0" class="empty">暂无进行中的目标</div>
        <div v-for="goal in activeGoals" :key="goal.id" class="goal-chip">
          <span class="goal-status">进行中</span>
          <span class="goal-name">{{ goal.name }}</span>
          <span class="goal-dim">
            {{ getDimension(goal.dimensionId)?.icon }}
            +{{ goal.rewardXp }} XP
          </span>
          <div class="chip-actions">
            <button class="icon-btn" title="完成" @click="completeGoalQuick(goal.id)">✓</button>
            <button class="icon-btn" title="编辑" @click="editGoal(goal)">✎</button>
            <button class="icon-btn" title="删除" @click="removeGoal(goal.id)">×</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.action-center {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upgrade-panel {
  background: linear-gradient(180deg, rgba(182, 219, 251, 0.35), var(--surface));
}

.panel-hint {
  font-size: 12px;
  color: var(--muted);
  margin: -6px 0 12px;
  line-height: 1.4;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 16px;
}

.goals-preview {
  grid-column: 1 / -1;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.card-head .card-title {
  margin-bottom: 0;
}

.mini-form {
  margin-bottom: 12px;
  padding: 10px;
  background: var(--item-bg);
  border-radius: 12px;
  border: 1px dashed var(--border);
}

.input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 2px solid var(--border);
  background: #fff;
  margin-bottom: 8px;
  font-size: 13px;
}

.row {
  display: flex;
  gap: 6px;
}

.select {
  flex: 1;
  padding: 8px;
  border-radius: 10px;
  border: 2px solid var(--border);
  background: #fff;
  font-size: 13px;
}

.num {
  width: 56px;
  padding: 8px;
  border-radius: 10px;
  border: 2px solid var(--border);
  background: #fff;
  text-align: center;
  font-size: 13px;
}

.goal-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--item-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 8px;
  font-size: 14px;
  flex-wrap: wrap;
}

.goal-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(252, 167, 196, 0.45);
  color: #a8557a;
  flex-shrink: 0;
}

.goal-name {
  flex: 1;
  min-width: 80px;
  font-weight: 600;
}

.goal-dim {
  font-size: 12px;
  color: var(--muted);
}

.chip-actions {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.icon-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--surface2);
  border: 1px solid var(--border);
  font-size: 14px;
  color: var(--text-strong);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty {
  color: var(--muted);
  font-size: 14px;
  text-align: center;
  padding: 16px;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>

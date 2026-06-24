<script setup>
import { ref } from 'vue'
import { useGameStore } from '../composables/useGameStore.js'
import { PERIOD_LABELS } from '../utils/period.js'

const emit = defineEmits(['toast'])
const {
  pendingTasks,
  doneTasks,
  taskOverviewStats,
  getDimension,
  completeTask,
  addTask,
  updateTask,
  deleteTask,
  reopenTask,
  state,
} = useGameStore()

const tab = ref('overview')
const listTab = ref('pending')
const editingId = ref(null)
const form = ref(emptyForm())

function emptyForm() {
  return {
    name: '',
    dimensionId: 'career',
    xp: 30,
    priority: 'medium',
    period: 'daily',
    recurring: true,
  }
}

function startEdit(task) {
  editingId.value = task.id
  form.value = {
    name: task.name,
    dimensionId: task.dimensionId,
    xp: task.xp,
    priority: task.priority || 'medium',
    period: task.period || 'daily',
    recurring: task.recurring !== false,
  }
  tab.value = 'list'
}

function cancelEdit() {
  editingId.value = null
  form.value = emptyForm()
}

function submitForm() {
  const result = editingId.value
    ? updateTask(editingId.value, form.value)
    : addTask(
        form.value.name,
        form.value.dimensionId,
        form.value.xp,
        form.value.priority,
        form.value.period,
        form.value.recurring,
      )
  emit('toast', result.message, result.ok)
  if (result.ok) {
    editingId.value = null
    form.value = emptyForm()
  }
}

function onComplete(id) {
  const result = completeTask(id)
  emit('toast', result.message, result.ok)
}

function onDelete(id) {
  if (!confirm('确定删除此任务？')) return
  deleteTask(id)
  if (editingId.value === id) cancelEdit()
  emit('toast', '已删除', true)
}

function onReopen(id) {
  const result = reopenTask(id)
  emit('toast', result.message, result.ok)
  if (result.ok) listTab.value = 'pending'
}

const priorityLabel = { high: '高', medium: '中', low: '低' }

const overviewColors = {
  daily: 'linear-gradient(135deg, #9ACBFB, #B6DBFB)',
  weekly: 'linear-gradient(135deg, #FCA7C4, #FDC2D7)',
  monthly: 'linear-gradient(135deg, #C5ABD3, #B6DBFB)',
}
</script>

<template>
  <div class="tasks-page">
    <section class="card">
      <div class="tabs main-tabs">
        <button class="tab" :class="{ active: tab === 'overview' }" @click="tab = 'overview'">
          📊 总览
        </button>
        <button class="tab" :class="{ active: tab === 'list' }" @click="tab = 'list'">
          📋 任务列表
        </button>
      </div>

      <div v-if="tab === 'overview'" class="overview">
        <p class="overview-hint">按日 / 周 / 月统计本周期任务完成情况，完成后对应维度 XP 会计入行动中心进度</p>
        <div class="overview-grid">
          <div
            v-for="stat in taskOverviewStats"
            :key="stat.period"
            class="overview-card"
            :style="{ background: overviewColors[stat.period] }"
          >
            <div class="overview-label">{{ stat.label }}任务</div>
            <div class="overview-num">{{ stat.done }}/{{ stat.total }}</div>
            <div class="overview-bar">
              <div class="overview-fill" :style="{ width: stat.percent + '%' }" />
            </div>
            <div class="overview-meta">已完成 {{ stat.percent }}% · 待完成 {{ stat.pending }}</div>
          </div>
        </div>
      </div>

      <template v-else>
        <div class="card-title sub">{{ editingId ? '✏️ 编辑任务' : '➕ 新建任务' }}</div>
        <form class="add-form" @submit.prevent="submitForm">
          <input v-model="form.name" class="input" placeholder="任务名称，如：完成周报" required />
          <div class="row">
            <select v-model="form.dimensionId" class="select">
              <option v-for="d in state.dimensions" :key="d.id" :value="d.id">
                {{ d.icon }} {{ d.name }}
              </option>
            </select>
            <select v-model="form.period" class="select narrow">
              <option value="daily">每日</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
            </select>
            <input v-model.number="form.xp" type="number" class="xp-input" min="1" max="999" />
            <select v-model="form.priority" class="select narrow">
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
            <button type="submit" class="btn btn-primary btn-sm">{{ editingId ? '保存' : '添加' }}</button>
          </div>
          <label class="check-row">
            <input v-model="form.recurring" type="checkbox" />
            <span>周期重复（新周期自动重置为待完成）</span>
          </label>
          <button v-if="editingId" type="button" class="link-btn" @click="cancelEdit">取消编辑</button>
        </form>

        <div class="tabs list-tabs">
          <button class="tab" :class="{ active: listTab === 'pending' }" @click="listTab = 'pending'">
            待完成 ({{ pendingTasks.length }})
          </button>
          <button class="tab" :class="{ active: listTab === 'done' }" @click="listTab = 'done'">
            已完成 ({{ doneTasks.length }})
          </button>
        </div>

        <div class="task-list">
          <template v-if="listTab === 'pending'">
            <div v-for="task in pendingTasks" :key="task.id" class="task-item">
              <div>
                <div class="task-name">{{ task.name }}</div>
                <div class="task-meta">
                  {{ getDimension(task.dimensionId)?.icon }}
                  {{ getDimension(task.dimensionId)?.name }}
                  · {{ PERIOD_LABELS[task.period] || '每日' }}
                  · +{{ task.xp }} XP
                  · 优先级 {{ priorityLabel[task.priority] || '中' }}
                  <span v-if="task.recurring" class="tag">重复</span>
                </div>
              </div>
              <div class="actions">
                <button class="btn btn-primary btn-sm" @click="onComplete(task.id)">完成</button>
                <button class="btn btn-ghost btn-sm" @click="startEdit(task)">编辑</button>
                <button class="btn btn-ghost btn-sm" @click="onDelete(task.id)">删除</button>
              </div>
            </div>
            <div v-if="pendingTasks.length === 0" class="empty">暂无待完成任务</div>
          </template>
          <template v-else>
            <div v-for="task in doneTasks" :key="task.id" class="task-item done">
              <div>
                <div class="task-name">✓ {{ task.name }}</div>
                <div class="task-meta">
                  {{ getDimension(task.dimensionId)?.icon }}
                  {{ PERIOD_LABELS[task.period] || '每日' }}
                  · +{{ task.xp }} XP
                </div>
              </div>
              <div class="actions">
                <button class="btn btn-ghost btn-sm" @click="onReopen(task.id)">恢复</button>
                <button class="btn btn-ghost btn-sm" @click="onDelete(task.id)">删除</button>
              </div>
            </div>
            <div v-if="doneTasks.length === 0" class="empty">本周期还没有完成的任务</div>
          </template>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.tasks-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-tabs {
  margin-bottom: 16px;
}

.overview-hint {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 14px;
  line-height: 1.5;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.overview-card {
  border-radius: 16px;
  padding: 16px;
  color: #fff;
  box-shadow: var(--shadow-sm);
}

.overview-label {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.95;
}

.overview-num {
  font-size: 28px;
  font-weight: 800;
  margin: 8px 0;
}

.overview-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 8px;
}

.overview-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  transition: width 0.3s;
}

.overview-meta {
  font-size: 11px;
  opacity: 0.9;
}

.card-title.sub {
  margin-top: 4px;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
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
  flex: 0 0 72px;
}

.xp-input {
  width: 64px;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
  text-align: center;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--muted);
}

.link-btn {
  font-size: 12px;
  color: var(--accent-deep);
  font-weight: 600;
  align-self: flex-start;
}

.tabs {
  display: flex;
  gap: 8px;
}

.list-tabs {
  margin-bottom: 12px;
}

.tab {
  flex: 1;
  padding: 8px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  background: rgba(197, 171, 211, 0.15);
}

.tab.active {
  background: var(--btn-gradient);
  color: #fff;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  background: var(--item-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.task-item.done {
  opacity: 0.65;
}

.task-name {
  font-size: 14px;
  font-weight: 600;
}

.task-meta {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}

.tag {
  display: inline-block;
  margin-left: 4px;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent-deep);
  font-size: 10px;
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
  padding: 16px;
}

@media (max-width: 720px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}
</style>

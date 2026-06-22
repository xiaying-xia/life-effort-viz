import { reactive, computed, watch } from 'vue'
import { todayKey } from '../utils/level.js'

const STORAGE_KEY = 'life-effort-viz-v1'

const DEFAULT_DIMENSIONS = [
  { id: 'health', name: '健康', icon: '💪', color: '#22c55e' },
  { id: 'study', name: '学习', icon: '📚', color: '#3b82f6' },
  { id: 'finance', name: '财务', icon: '💰', color: '#eab308' },
  { id: 'social', name: '社交', icon: '🤝', color: '#f97316' },
  { id: 'career', name: '事业', icon: '💼', color: '#6366f1' },
  { id: 'creative', name: '创作', icon: '🎨', color: '#ec4899' },
]

const DEFAULT_HABITS = [
  { id: 'h1', name: '运动 30 分钟', dimensionId: 'health', xp: 50, frequency: 'daily' },
  { id: 'h2', name: '23:30 前睡觉', dimensionId: 'health', xp: 30, frequency: 'daily' },
  { id: 'h3', name: '阅读 30 分钟', dimensionId: 'study', xp: 30, frequency: 'daily' },
  { id: 'h4', name: '学习/复盘 1 小时', dimensionId: 'study', xp: 40, frequency: 'daily' },
  { id: 'h5', name: '每日记账', dimensionId: 'finance', xp: 20, frequency: 'daily' },
  { id: 'h6', name: '理财学习 20 分钟', dimensionId: 'finance', xp: 25, frequency: 'weekly' },
  { id: 'h7', name: '主动联系 1 位朋友', dimensionId: 'social', xp: 25, frequency: 'weekly' },
  { id: 'h8', name: '深度工作 1 小时', dimensionId: 'career', xp: 40, frequency: 'daily' },
  { id: 'h9', name: '复盘今日工作', dimensionId: 'career', xp: 20, frequency: 'daily' },
  { id: 'h10', name: '表达/写作 10 分钟', dimensionId: 'creative', xp: 35, frequency: 'daily' },
]

const DEFAULT_GOALS = [
  { id: 'g1', name: '体脂率降到 20% 以下', dimensionId: 'health', status: 'active', rewardXp: 300, note: '' },
  { id: 'g2', name: '读完 12 本书', dimensionId: 'study', status: 'active', rewardXp: 200, note: '' },
  { id: 'g3', name: '建立 6 个月应急金', dimensionId: 'finance', status: 'active', rewardXp: 500, note: '' },
  { id: 'g4', name: '每月组织 1 次线下聚会', dimensionId: 'social', status: 'active', rewardXp: 150, note: '' },
  { id: 'g5', name: '完成年度 KPI 120%', dimensionId: 'career', status: 'active', rewardXp: 400, note: '' },
  { id: 'g6', name: '发布 10 篇原创内容', dimensionId: 'creative', status: 'active', rewardXp: 250, note: '' },
]

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return null
}

function createDefaultState() {
  const xp = {}
  DEFAULT_DIMENSIONS.forEach((d) => { xp[d.id] = 0 })
  return {
    dimensions: DEFAULT_DIMENSIONS,
    xp,
    habits: DEFAULT_HABITS.map((h) => ({ ...h, enabled: true })),
    logs: [],
    goals: DEFAULT_GOALS.map((g) => ({ ...g })),
    checkins: {},
  }
}

const state = reactive(loadState() ?? createDefaultState())

watch(
  () => ({ ...state, logs: [...state.logs] }),
  () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dimensions: state.dimensions,
        xp: state.xp,
        habits: state.habits,
        logs: state.logs.slice(0, 500),
        goals: state.goals,
        checkins: state.checkins,
      }),
    )
  },
  { deep: true },
)

let idCounter = Date.now()

function nextId(prefix) {
  idCounter += 1
  return `${prefix}_${idCounter}`
}

export function useGameStore() {
  const dimensionsWithXp = computed(() =>
    state.dimensions.map((d) => ({
      ...d,
      totalXp: state.xp[d.id] ?? 0,
    })),
  )

  const recentLogs = computed(() =>
    [...state.logs].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 30),
  )

  const activeGoals = computed(() => state.goals.filter((g) => g.status === 'active'))
  const doneGoals = computed(() => state.goals.filter((g) => g.status === 'done'))

  function getDimension(id) {
    return state.dimensions.find((d) => d.id === id)
  }

  function addXp(dimensionId, amount, description, source = 'manual', habitId = null) {
    if (!dimensionId || amount <= 0) return null
    state.xp[dimensionId] = (state.xp[dimensionId] ?? 0) + amount
    const dim = getDimension(dimensionId)
    const log = {
      id: nextId('log'),
      time: new Date().toISOString(),
      dimensionId,
      dimensionName: dim?.name ?? '',
      description,
      xp: amount,
      source,
      habitId,
    }
    state.logs.unshift(log)
    return log
  }

  function isHabitCheckedToday(habitId) {
    return state.checkins[`${habitId}_${todayKey()}`] === true
  }

  function checkInHabit(habitId) {
    const habit = state.habits.find((h) => h.id === habitId)
    if (!habit || !habit.enabled) return { ok: false, message: '习惯不存在' }
    if (isHabitCheckedToday(habitId)) return { ok: false, message: '今日已打卡' }
    state.checkins[`${habitId}_${todayKey()}`] = true
    addXp(habit.dimensionId, habit.xp, habit.name, 'habit', habitId)
    return { ok: true, message: `+${habit.xp} XP` }
  }

  function manualLog(dimensionId, description, xp) {
    if (!description?.trim()) return { ok: false, message: '请填写行为描述' }
    const amount = Number(xp) || 30
    addXp(dimensionId, amount, description.trim(), 'manual')
    return { ok: true, message: `+${amount} XP` }
  }

  function completeGoal(goalId) {
    const goal = state.goals.find((g) => g.id === goalId)
    if (!goal || goal.status === 'done') return { ok: false, message: '目标无效' }
    goal.status = 'done'
    addXp(goal.dimensionId, goal.rewardXp, `完成目标：${goal.name}`, 'goal')
    return { ok: true, message: `目标完成 +${goal.rewardXp} XP` }
  }

  function resetAllData() {
    const fresh = createDefaultState()
    Object.assign(state, fresh)
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    state,
    dimensionsWithXp,
    recentLogs,
    activeGoals,
    doneGoals,
    getDimension,
    addXp,
    isHabitCheckedToday,
    checkInHabit,
    manualLog,
    completeGoal,
    resetAllData,
  }
}

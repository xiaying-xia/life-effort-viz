import { reactive, computed, watch } from 'vue'
import { todayKey, getLevelProgress } from '../utils/level.js'
import { weekStartKey, isInCurrentPeriod, PERIOD_LABELS } from '../utils/period.js'

const STORAGE_KEY = 'life-effort-viz-v3'

const DEFAULT_DIMENSIONS = [
  { id: 'health', name: '健康', icon: '💪', color: '#FCA7C4' },
  { id: 'study', name: '学习', icon: '📚', color: '#9ACBFB' },
  { id: 'finance', name: '财务', icon: '💰', color: '#C5ABD3' },
  { id: 'social', name: '社交', icon: '🤝', color: '#FDC2D7' },
  { id: 'career', name: '事业', icon: '💼', color: '#B6DBFB' },
  { id: 'creative', name: '创作', icon: '🎨', color: '#C5ABD3' },
]

const DEFAULT_HABITS = [
  { id: 'h1', name: '运动 30 分钟', dimensionId: 'health', xp: 50, frequency: 'daily', weeklyTarget: 7 },
  { id: 'h2', name: '23:30 前睡觉', dimensionId: 'health', xp: 30, frequency: 'daily', weeklyTarget: 7 },
  { id: 'h3', name: '阅读 30 分钟', dimensionId: 'study', xp: 30, frequency: 'daily', weeklyTarget: 7 },
  { id: 'h4', name: '学习/复盘 1 小时', dimensionId: 'study', xp: 40, frequency: 'daily', weeklyTarget: 5 },
  { id: 'h5', name: '每日记账', dimensionId: 'finance', xp: 20, frequency: 'daily', weeklyTarget: 7 },
  { id: 'h6', name: '理财学习 20 分钟', dimensionId: 'finance', xp: 25, frequency: 'weekly', weeklyTarget: 3 },
  { id: 'h7', name: '主动联系 1 位朋友', dimensionId: 'social', xp: 25, frequency: 'weekly', weeklyTarget: 3 },
  { id: 'h8', name: '深度工作 1 小时', dimensionId: 'career', xp: 40, frequency: 'daily', weeklyTarget: 5 },
  { id: 'h9', name: '复盘今日工作', dimensionId: 'career', xp: 20, frequency: 'daily', weeklyTarget: 5 },
  { id: 'h10', name: '表达/写作 10 分钟', dimensionId: 'creative', xp: 35, frequency: 'daily', weeklyTarget: 5 },
]

const DEFAULT_GOALS = [
  { id: 'g1', name: '体脂率降到 20% 以下', dimensionId: 'health', status: 'active', rewardXp: 300, note: '', deadline: '' },
  { id: 'g2', name: '读完 12 本书', dimensionId: 'study', status: 'active', rewardXp: 200, note: '', deadline: '' },
  { id: 'g3', name: '建立 6 个月应急金', dimensionId: 'finance', status: 'active', rewardXp: 500, note: '', deadline: '' },
  { id: 'g4', name: '每月组织 1 次线下聚会', dimensionId: 'social', status: 'active', rewardXp: 150, note: '', deadline: '' },
  { id: 'g5', name: '完成年度 KPI 120%', dimensionId: 'career', status: 'active', rewardXp: 400, note: '', deadline: '' },
  { id: 'g6', name: '发布 10 篇原创内容', dimensionId: 'creative', status: 'active', rewardXp: 250, note: '', deadline: '' },
]

const DEFAULT_TASKS = [
  { id: 't1', name: '整理本周工作计划', dimensionId: 'career', xp: 30, status: 'pending', priority: 'high', period: 'weekly', recurring: true, completedAt: null },
  { id: 't2', name: '回复 3 条重要消息', dimensionId: 'social', xp: 20, status: 'pending', priority: 'medium', period: 'daily', recurring: true, completedAt: null },
  { id: 't3', name: '写一篇学习笔记', dimensionId: 'study', xp: 35, status: 'pending', priority: 'medium', period: 'daily', recurring: true, completedAt: null },
]

function normalizeTask(t) {
  const period = ['daily', 'weekly', 'monthly'].includes(t.period) ? t.period : 'daily'
  return {
    id: t.id,
    name: t.name || '',
    dimensionId: t.dimensionId || 'career',
    xp: Number(t.xp) || 30,
    status: t.status === 'done' ? 'done' : 'pending',
    priority: t.priority || 'medium',
    period,
    recurring: t.recurring !== false,
    completedAt: t.completedAt || null,
  }
}

const DEFAULT_REWARDS = []

function normalizeReward(r) {
  return {
    id: r.id,
    name: r.name || '',
    description: r.description || '',
    cost: Number(r.cost) || 0,
    priceYuan: r.priceYuan != null && r.priceYuan !== '' ? String(r.priceYuan) : '',
    image: r.image || '',
    link: r.link || '',
    dimensionId: r.dimensionId || null,
    claimed: r.claimed || 0,
    status: r.status === 'purchased' ? 'purchased' : 'wishlist',
    purchasedAt: r.purchasedAt || null,
  }
}

const DEFAULT_COIN_SETTINGS = { yuanPerCoin: 10 }

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.rewards) data.rewards = data.rewards.map(normalizeReward)
      if (data.tasks) data.tasks = data.tasks.map(normalizeTask)
      if (!data.coinSettings) data.coinSettings = { ...DEFAULT_COIN_SETTINGS }
      return data
    }
    for (const key of ['life-effort-viz-v2', 'life-effort-viz-v1']) {
      const legacyRaw = localStorage.getItem(key)
      if (!legacyRaw) continue
      const old = JSON.parse(legacyRaw)
      return {
        ...createDefaultState(),
        ...old,
        tasks: old.tasks?.length ? old.tasks.map(normalizeTask) : DEFAULT_TASKS.map((t) => ({ ...t })),
        rewards: (old.rewards || DEFAULT_REWARDS).map(normalizeReward),
        coinSettings: old.coinSettings || { ...DEFAULT_COIN_SETTINGS },
        coins: old.coins ?? Math.floor(
          Object.values(old.xp || {}).reduce((a, b) => a + b, 0) / 10,
        ),
      }
    }
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
    tasks: DEFAULT_TASKS.map((t) => normalizeTask({ ...t })),
    rewards: DEFAULT_REWARDS.map(normalizeReward),
    checkins: {},
    coins: 0,
    coinSettings: { ...DEFAULT_COIN_SETTINGS },
  }
}

const state = reactive(loadState() ?? createDefaultState())

watch(
  state,
  () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dimensions: state.dimensions,
        xp: state.xp,
        habits: state.habits,
        logs: state.logs.slice(0, 500),
        goals: state.goals,
        tasks: state.tasks,
        rewards: state.rewards,
        checkins: state.checkins,
        coins: state.coins,
        coinSettings: state.coinSettings,
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

function refreshRecurringTasks() {
  for (const task of state.tasks) {
    if (!task.recurring || task.status !== 'done' || !task.completedAt) continue
    if (!isInCurrentPeriod(task.completedAt, task.period || 'daily')) {
      task.status = 'pending'
      task.completedAt = null
    }
  }
}

refreshRecurringTasks()

export function useGameStore() {
  const dimensionsWithXp = computed(() => {
    refreshRecurringTasks()
    return state.dimensions.map((d) => ({
      ...d,
      totalXp: state.xp[d.id] ?? 0,
      ...getLevelProgress(state.xp[d.id] ?? 0),
      xpBreakdown: getDimensionXpBreakdown(d.id),
    }))
  })

  const totalXp = computed(() =>
    Object.values(state.xp).reduce((sum, v) => sum + (v || 0), 0),
  )

  const recentLogs = computed(() =>
    [...state.logs].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 30),
  )

  const allLogs = computed(() =>
    [...state.logs].sort((a, b) => b.time.localeCompare(a.time)),
  )

  const activeGoals = computed(() => state.goals.filter((g) => g.status === 'active'))
  const doneGoals = computed(() => state.goals.filter((g) => g.status === 'done'))
  const pendingTasks = computed(() => {
    refreshRecurringTasks()
    return state.tasks.filter((t) => t.status === 'pending')
  })
  const doneTasks = computed(() => {
    refreshRecurringTasks()
    return state.tasks.filter((t) => t.status === 'done')
  })

  const taskOverviewStats = computed(() => {
    refreshRecurringTasks()
    return ['daily', 'weekly', 'monthly'].map((period) => {
      const tasks = state.tasks.filter((t) => (t.period || 'daily') === period)
      const total = tasks.length
      const done = tasks.filter(
        (t) => t.status === 'done' && isInCurrentPeriod(t.completedAt, period),
      ).length
      return {
        period,
        label: PERIOD_LABELS[period],
        total,
        done,
        pending: Math.max(0, total - done),
        percent: total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0,
      }
    })
  })
  const wishlistRewards = computed(() =>
    state.rewards.filter((r) => r.status !== 'purchased'),
  )
  const purchasedRewards = computed(() =>
    state.rewards.filter((r) => r.status === 'purchased'),
  )

  const yuanPerCoin = computed(() =>
    Math.max(0.1, Number(state.coinSettings?.yuanPerCoin) || DEFAULT_COIN_SETTINGS.yuanPerCoin),
  )

  const logsByDate = computed(() => {
    const map = {}
    for (const log of allLogs.value) {
      const date = log.time.slice(0, 10)
      if (!map[date]) map[date] = []
      map[date].push(log)
    }
    return map
  })

  function priceToCoins(yuan) {
    const y = Number(yuan)
    if (!y || y <= 0) return 1
    return Math.max(1, Math.ceil(y / yuanPerCoin.value))
  }

  function coinsToYuan(coins) {
    const c = Number(coins)
    if (!c || c <= 0) return '0'
    const total = c * yuanPerCoin.value
    return total % 1 === 0 ? String(total) : total.toFixed(1)
  }

  function setYuanPerCoin(value) {
    const n = Number(value)
    if (!n || n <= 0) return { ok: false, message: '比例必须大于 0' }
    state.coinSettings = { yuanPerCoin: n }
    return { ok: true, message: `已更新：1 金币 = ¥${n}` }
  }

  function getDimensionXpBreakdown(dimensionId) {
    const result = { habit: 0, goal: 0, task: 0, manual: 0 }
    for (const log of state.logs) {
      if (log.dimensionId !== dimensionId) continue
      const xp = log.xp || 0
      if (log.source === 'habit') result.habit += xp
      else if (log.source === 'goal') result.goal += xp
      else if (log.source === 'task') result.task += xp
      else result.manual += xp
    }
    return result
  }

  function getDimension(id) {
    return state.dimensions.find((d) => d.id === id)
  }

  function addCoins(amount) {
    state.coins = Math.max(0, (state.coins || 0) + amount)
  }

  function addXp(dimensionId, amount, description, source = 'manual', habitId = null) {
    if (!dimensionId || amount <= 0) return null
    state.xp[dimensionId] = (state.xp[dimensionId] ?? 0) + amount
    addCoins(Math.floor(amount / 10))
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

  function getHabitWeekProgress(habitId) {
    const habit = state.habits.find((h) => h.id === habitId)
    if (!habit) return { done: 0, target: 7, percent: 0 }
    const target = habit.weeklyTarget || (habit.frequency === 'weekly' ? 3 : 7)
    const start = weekStartKey()
    let done = 0
    for (const [key, val] of Object.entries(state.checkins)) {
      if (!val || !key.startsWith(`${habitId}_`)) continue
      const date = key.slice(habitId.length + 1)
      if (date >= start) done += 1
    }
    const percent = target > 0 ? Math.min(100, Math.round((done / target) * 100)) : 0
    return { done, target, percent }
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

  function completeTask(taskId) {
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task || task.status === 'done') return { ok: false, message: '任务无效' }
    task.status = 'done'
    task.completedAt = new Date().toISOString()
    addXp(task.dimensionId, task.xp, `完成任务：${task.name}`, 'task')
    return { ok: true, message: `任务完成 +${task.xp} XP` }
  }

  function addTask(name, dimensionId, xp = 30, priority = 'medium', period = 'daily', recurring = true) {
    if (!name?.trim()) return { ok: false, message: '请填写任务名称' }
    const p = ['daily', 'weekly', 'monthly'].includes(period) ? period : 'daily'
    state.tasks.unshift(normalizeTask({
      id: nextId('task'),
      name: name.trim(),
      dimensionId,
      xp: Number(xp) || 30,
      status: 'pending',
      priority,
      period: p,
      recurring: recurring !== false,
      completedAt: null,
    }))
    return { ok: true, message: '任务已添加' }
  }

  function deleteTask(taskId) {
    const idx = state.tasks.findIndex((t) => t.id === taskId)
    if (idx >= 0) state.tasks.splice(idx, 1)
  }

  function updateTask(taskId, payload) {
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task) return { ok: false, message: '任务不存在' }
    if (payload.name !== undefined) {
      const name = payload.name.trim()
      if (!name) return { ok: false, message: '名称不能为空' }
      task.name = name
    }
    if (payload.dimensionId !== undefined) task.dimensionId = payload.dimensionId
    if (payload.xp !== undefined) task.xp = Number(payload.xp) || 30
    if (payload.priority !== undefined) task.priority = payload.priority
    if (payload.period !== undefined) {
      task.period = ['daily', 'weekly', 'monthly'].includes(payload.period) ? payload.period : task.period
    }
    if (payload.recurring !== undefined) task.recurring = !!payload.recurring
    return { ok: true, message: '任务已更新' }
  }

  function reopenTask(taskId) {
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task) return { ok: false, message: '任务不存在' }
    task.status = 'pending'
    task.completedAt = null
    return { ok: true, message: '已移回待完成' }
  }

  function addGoal(name, dimensionId, rewardXp = 200, note = '') {
    if (!name?.trim()) return { ok: false, message: '请填写目标名称' }
    state.goals.unshift({
      id: nextId('goal'),
      name: name.trim(),
      dimensionId,
      status: 'active',
      rewardXp: Number(rewardXp) || 200,
      note: note?.trim() || '',
      deadline: '',
    })
    return { ok: true, message: '目标已添加' }
  }

  function updateGoal(goalId, payload) {
    const goal = state.goals.find((g) => g.id === goalId)
    if (!goal) return { ok: false, message: '目标不存在' }
    if (payload.name !== undefined) {
      const name = payload.name.trim()
      if (!name) return { ok: false, message: '名称不能为空' }
      goal.name = name
    }
    if (payload.dimensionId !== undefined) goal.dimensionId = payload.dimensionId
    if (payload.rewardXp !== undefined) goal.rewardXp = Number(payload.rewardXp) || 200
    if (payload.note !== undefined) goal.note = payload.note.trim()
    return { ok: true, message: '目标已更新' }
  }

  function deleteGoal(goalId) {
    const idx = state.goals.findIndex((g) => g.id === goalId)
    if (idx >= 0) state.goals.splice(idx, 1)
  }

  function reopenGoal(goalId) {
    const goal = state.goals.find((g) => g.id === goalId)
    if (!goal) return { ok: false, message: '目标不存在' }
    goal.status = 'active'
    return { ok: true, message: '已移回进行中' }
  }

  function addHabit(name, dimensionId, xp = 30, frequency = 'daily', weeklyTarget = null) {
    if (!name?.trim()) return { ok: false, message: '请填写习惯名称' }
    const freq = frequency === 'weekly' ? 'weekly' : 'daily'
    const target = weeklyTarget ?? (freq === 'weekly' ? 3 : 7)
    state.habits.unshift({
      id: nextId('habit'),
      name: name.trim(),
      dimensionId,
      xp: Number(xp) || 30,
      frequency: freq,
      weeklyTarget: Number(target) || 7,
      enabled: true,
    })
    return { ok: true, message: '习惯已添加' }
  }

  function updateHabit(habitId, payload) {
    const habit = state.habits.find((h) => h.id === habitId)
    if (!habit) return { ok: false, message: '习惯不存在' }
    if (payload.name !== undefined) {
      const name = payload.name.trim()
      if (!name) return { ok: false, message: '名称不能为空' }
      habit.name = name
    }
    if (payload.dimensionId !== undefined) habit.dimensionId = payload.dimensionId
    if (payload.xp !== undefined) habit.xp = Number(payload.xp) || 30
    if (payload.frequency !== undefined) {
      habit.frequency = payload.frequency === 'weekly' ? 'weekly' : 'daily'
    }
    if (payload.weeklyTarget !== undefined) {
      habit.weeklyTarget = Number(payload.weeklyTarget) || 7
    }
    if (payload.enabled !== undefined) habit.enabled = !!payload.enabled
    return { ok: true, message: '习惯已更新' }
  }

  function deleteHabit(habitId) {
    const idx = state.habits.findIndex((h) => h.id === habitId)
    if (idx >= 0) state.habits.splice(idx, 1)
    for (const key of Object.keys(state.checkins)) {
      if (key.startsWith(`${habitId}_`)) delete state.checkins[key]
    }
  }

  function redeemReward(rewardId) {
    const reward = state.rewards.find((r) => r.id === rewardId)
    if (!reward) return { ok: false, message: '奖励不存在' }
    if (reward.status === 'purchased') return { ok: false, message: '该奖励已购买' }
    if (reward.dimensionId) {
      const prog = getLevelProgress(state.xp[reward.dimensionId] ?? 0)
      if (prog.level < 2) return { ok: false, message: '对应维度等级不足' }
    }
    if ((state.coins || 0) < reward.cost) return { ok: false, message: '金币不足' }
    state.coins -= reward.cost
    reward.claimed = (reward.claimed || 0) + 1
    reward.status = 'purchased'
    reward.purchasedAt = new Date().toISOString()
    return { ok: true, message: `已兑换并标记已购买：${reward.name}` }
  }

  function reopenWishlist(rewardId) {
    const reward = state.rewards.find((r) => r.id === rewardId)
    if (!reward) return { ok: false, message: '奖励不存在' }
    reward.status = 'wishlist'
    reward.purchasedAt = null
    return { ok: true, message: '已重新加入心愿单' }
  }

  function addReward(payload) {
    const name = payload.name?.trim()
    if (!name) return { ok: false, message: '请填写奖励名称' }
    const cost = Number(payload.cost)
    if (!cost || cost < 1) return { ok: false, message: '请设置兑换金币（至少 1）' }
    state.rewards.unshift(normalizeReward({
      id: nextId('reward'),
      name,
      description: payload.description?.trim() || '',
      cost,
      priceYuan: payload.priceYuan != null ? String(payload.priceYuan).trim() : '',
      image: payload.image || '',
      link: payload.link?.trim() || '',
      dimensionId: payload.dimensionId || null,
      claimed: 0,
    }))
    return { ok: true, message: '已添加到心愿单' }
  }

  function updateReward(rewardId, payload) {
    const reward = state.rewards.find((r) => r.id === rewardId)
    if (!reward) return { ok: false, message: '奖励不存在' }
    if (payload.name !== undefined) {
      const name = payload.name.trim()
      if (!name) return { ok: false, message: '名称不能为空' }
      reward.name = name
    }
    if (payload.description !== undefined) reward.description = payload.description.trim()
    if (payload.cost !== undefined) {
      const cost = Number(payload.cost)
      if (!cost || cost < 1) return { ok: false, message: '金币至少为 1' }
      reward.cost = cost
    }
    if (payload.priceYuan !== undefined) reward.priceYuan = String(payload.priceYuan).trim()
    if (payload.image !== undefined) reward.image = payload.image
    if (payload.link !== undefined) reward.link = payload.link.trim()
    if (payload.dimensionId !== undefined) reward.dimensionId = payload.dimensionId || null
    return { ok: true, message: '已保存' }
  }

  function deleteReward(rewardId) {
    const idx = state.rewards.findIndex((r) => r.id === rewardId)
    if (idx >= 0) state.rewards.splice(idx, 1)
  }

  function toggleHabit(habitId) {
    const habit = state.habits.find((h) => h.id === habitId)
    if (habit) habit.enabled = !habit.enabled
  }

  function resetAllData() {
    const fresh = createDefaultState()
    Object.keys(state).forEach((k) => delete state[k])
    Object.assign(state, fresh)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('life-effort-viz-v2')
    localStorage.removeItem('life-effort-viz-v1')
  }

  return {
    state,
    dimensionsWithXp,
    totalXp,
    recentLogs,
    allLogs,
    logsByDate,
    activeGoals,
    doneGoals,
    pendingTasks,
    doneTasks,
    taskOverviewStats,
    wishlistRewards,
    purchasedRewards,
    yuanPerCoin,
    priceToCoins,
    coinsToYuan,
    setYuanPerCoin,
    getDimensionXpBreakdown,
    getDimension,
    getHabitWeekProgress,
    addXp,
    isHabitCheckedToday,
    checkInHabit,
    manualLog,
    completeGoal,
    completeTask,
    addTask,
    updateTask,
    deleteTask,
    reopenTask,
    addGoal,
    updateGoal,
    deleteGoal,
    reopenGoal,
    addHabit,
    updateHabit,
    deleteHabit,
    redeemReward,
    reopenWishlist,
    addReward,
    updateReward,
    deleteReward,
    toggleHabit,
    resetAllData,
  }
}

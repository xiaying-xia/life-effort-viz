/** Level thresholds: cumulative XP required to reach each level (1-indexed) */
export const LEVEL_THRESHOLDS = [0, 500, 1000, 1800, 2600, 3600, 4600, 6100, 7600, 9600]

export const MAX_LEVEL = 10

export function getLevel(totalXp) {
  let level = 1
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
      break
    }
  }
  return Math.min(level, MAX_LEVEL)
}

export function getLevelProgress(totalXp) {
  const level = getLevel(totalXp)
  if (level >= MAX_LEVEL) {
    return { level, current: 0, needed: 0, percent: 100, label: '满级' }
  }
  const floor = LEVEL_THRESHOLDS[level - 1] ?? 0
  const ceiling = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const current = totalXp - floor
  const needed = ceiling - floor
  const percent = needed > 0 ? Math.min(100, Math.round((current / needed) * 100)) : 100
  return { level, current, needed, percent, label: `${current}/${needed}` }
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function formatTime(iso) {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const time = d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  if (isToday) return `今天 ${time}`
  return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) + ' ' + time
}

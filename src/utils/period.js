import { todayKey } from './level.js'

export function weekStartKey(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() || 7
  d.setDate(d.getDate() - day + 1)
  return d.toISOString().slice(0, 10)
}

export function monthStartKey(date = new Date()) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

export function isInCurrentPeriod(isoTime, period) {
  if (!isoTime) return false
  const date = isoTime.slice(0, 10)
  if (period === 'daily') return date === todayKey()
  if (period === 'weekly') return date >= weekStartKey()
  if (period === 'monthly') return date >= monthStartKey()
  return false
}

export const PERIOD_LABELS = {
  daily: '每日',
  weekly: '每周',
  monthly: '每月',
}

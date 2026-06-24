<script setup>
import { computed } from 'vue'
import { getLevelProgress } from '../utils/level.js'

const props = defineProps({
  dimension: { type: Object, required: true },
})

const progress = computed(() => getLevelProgress(props.dimension.totalXp))

const breakdown = computed(() => props.dimension.xpBreakdown || { habit: 0, goal: 0, task: 0, manual: 0 })

const breakdownParts = computed(() => {
  const b = breakdown.value
  const parts = []
  if (b.habit > 0) parts.push(`习惯 +${b.habit}`)
  if (b.goal > 0) parts.push(`目标 +${b.goal}`)
  if (b.task > 0) parts.push(`任务 +${b.task}`)
  if (b.manual > 0) parts.push(`记录 +${b.manual}`)
  return parts
})
</script>

<template>
  <div class="dim-row">
    <div class="dim-head">
      <span class="dim-label">
        {{ dimension.icon }} {{ dimension.name }}
        <span class="dim-lv">Lv.{{ progress.level }}</span>
      </span>
      <span class="dim-xp">{{ progress.label }}</span>
    </div>
    <div class="bar-track">
      <div
        class="bar-fill"
        :style="{
          width: progress.percent + '%',
          background: dimension.color,
        }"
      />
    </div>
    <div v-if="breakdownParts.length" class="dim-breakdown">
      {{ breakdownParts.join(' · ') }}
    </div>
  </div>
</template>

<style scoped>
.dim-row {
  margin-bottom: 14px;
}
.dim-row:last-child {
  margin-bottom: 0;
}
.dim-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 14px;
}
.dim-label {
  font-weight: 600;
}
.dim-lv {
  margin-left: 6px;
  font-size: 12px;
  color: var(--muted);
  font-weight: 500;
}
.dim-xp {
  font-size: 12px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.bar-track {
  height: 12px;
  background: var(--surface2);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}
.dim-breakdown {
  margin-top: 4px;
  font-size: 11px;
  color: var(--muted);
  line-height: 1.4;
}
</style>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../composables/useGameStore.js'
import ActivityFeed from '../components/ActivityFeed.vue'
import DimensionProgress from '../components/DimensionProgress.vue'

const { dimensionsWithXp, totalXp, allLogs, logsByDate, state } = useGameStore()

const stats = computed(() => {
  const habitCount = allLogs.value.filter((l) => l.source === 'habit').length
  const taskCount = allLogs.value.filter((l) => l.source === 'task').length
  const goalCount = allLogs.value.filter((l) => l.source === 'goal').length
  return { habitCount, taskCount, goalCount, days: Object.keys(logsByDate.value).length }
})

const sortedDates = computed(() =>
  Object.keys(logsByDate.value).sort((a, b) => b.localeCompare(a)),
)
</script>

<template>
  <div class="growth-page">
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-val">{{ totalXp }}</div>
        <div class="stat-label">累计 XP</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ state.coins || 0 }}</div>
        <div class="stat-label">可用金币</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ stats.days }}</div>
        <div class="stat-label">活跃天数</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ allLogs.length }}</div>
        <div class="stat-label">总记录数</div>
      </div>
    </div>

    <section class="card">
      <div class="card-title">📈 六维成长概览</div>
      <DimensionProgress
        v-for="dim in dimensionsWithXp"
        :key="dim.id"
        :dimension="dim"
      />
    </section>

    <section class="card">
      <div class="card-title">📅 成长时间线</div>
      <div v-if="sortedDates.length === 0" class="empty">还没有成长记录</div>
      <div v-for="date in sortedDates" :key="date" class="day-group">
        <div class="day-head">
          {{ date }}
          <span class="day-xp">
            +{{ logsByDate[date].reduce((s, l) => s + l.xp, 0) }} XP
          </span>
        </div>
        <ActivityFeed :logs="logsByDate[date]" :max-items="999" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.growth-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
}

.stat-val {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-deep), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

.day-group {
  margin-bottom: 16px;
}

.day-head {
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.day-xp {
  color: var(--success);
}

.empty {
  color: var(--muted);
  text-align: center;
  padding: 24px;
}

@media (max-width: 640px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

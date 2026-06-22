<script setup>
import { formatTime } from '../utils/level.js'

defineProps({
  logs: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="feed">
    <div v-if="logs.length === 0" class="empty">还没有记录，完成第一个习惯吧 🎯</div>
    <div v-for="log in logs" :key="log.id" class="feed-item">
      <div class="feed-text">
        <span class="dim-tag">「{{ log.dimensionName }}」</span>
        <span class="xp">XP +{{ log.xp }}</span>
        · {{ log.description }}
      </div>
      <div class="feed-time">{{ formatTime(log.time) }}</div>
    </div>
  </div>
</template>

<style scoped>
.feed {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
}
.empty {
  text-align: center;
  color: var(--muted);
  font-size: 14px;
  padding: 24px 0;
}
.feed-item {
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border-left: 3px solid var(--accent);
}
.feed-text {
  font-size: 14px;
  line-height: 1.45;
}
.dim-tag {
  color: var(--accent2);
  font-weight: 600;
}
.xp {
  color: var(--success);
  font-weight: 700;
  font-size: 13px;
}
.feed-time {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}
</style>

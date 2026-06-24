<script setup>
import { formatTime } from '../utils/level.js'

defineProps({
  logs: { type: Array, default: () => [] },
  maxItems: { type: Number, default: 20 },
})
</script>

<template>
  <div class="feed">
    <div v-if="logs.length === 0" class="empty">还没有记录，完成第一个习惯吧 🎯</div>
    <div v-for="log in logs.slice(0, maxItems)" :key="log.id" class="feed-item">
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
  border-radius: 14px;
  background: var(--item-bg);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
}
.feed-text {
  font-size: 14px;
  line-height: 1.45;
}
.dim-tag {
  color: var(--accent-deep);
  font-weight: 700;
}
.xp {
  color: #16a34a;
  font-weight: 700;
  font-size: 13px;
}
.feed-time {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}
</style>

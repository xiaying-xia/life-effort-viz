<script setup>
import { ref, computed } from 'vue'
import { getLevelProgress } from '../utils/level.js'
import { useGameStore } from '../composables/useGameStore.js'

const props = defineProps({
  dimension: { type: Object, required: true },
})

const progress = computed(() => getLevelProgress(props.dimension.totalXp))
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
  height: 10px;
  background: var(--surface2);
  border-radius: 999px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}
</style>

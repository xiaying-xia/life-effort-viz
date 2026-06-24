<script setup>
import { ref } from 'vue'
import { useGameStore } from '../composables/useGameStore.js'

const emit = defineEmits(['toast'])
const { state, manualLog } = useGameStore()

const description = ref('')
const dimensionId = ref('health')
const xp = ref(30)

function submit() {
  const result = manualLog(dimensionId.value, description.value, xp.value)
  emit('toast', result.message, result.ok)
  if (result.ok) {
    description.value = ''
  }
}
</script>

<template>
  <form class="quick-log" @submit.prevent="submit">
    <input
      v-model="description"
      class="input"
      placeholder="做了什么？例如：跑步 5 公里"
      maxlength="80"
    />
    <div class="row">
      <select v-model="dimensionId" class="select">
        <option v-for="d in state.dimensions" :key="d.id" :value="d.id">
          {{ d.icon }} {{ d.name }}
        </option>
      </select>
      <input v-model.number="xp" type="number" class="xp-input" min="1" max="999" />
      <button type="submit" class="btn btn-primary btn-sm">记录</button>
    </div>
  </form>
</template>

<style scoped>
.quick-log {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 2px solid var(--border);
  background: #fff;
  outline: none;
}
.input:focus {
  border-color: var(--accent);
}
.row {
  display: flex;
  gap: 8px;
}
.select {
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
}
.xp-input {
  width: 64px;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
  text-align: center;
}
</style>

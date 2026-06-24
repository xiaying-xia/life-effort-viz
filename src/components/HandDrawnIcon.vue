<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (v) => ['amaryllis', 'peony', 'jewelry'].includes(v),
  },
  size: { type: [Number, String], default: 32 },
})

const src = computed(() => `${import.meta.env.BASE_URL}icons/${props.name}.svg`)
</script>

<template>
  <img
    class="hand-icon"
    :src="src"
    :width="size"
    :height="size"
    alt=""
    aria-hidden="true"
    decoding="async"
  />
</template>

<style scoped>
.hand-icon {
  display: block;
  flex-shrink: 0;
  object-fit: contain;
  -webkit-user-select: none;
  user-select: none;
}
</style>

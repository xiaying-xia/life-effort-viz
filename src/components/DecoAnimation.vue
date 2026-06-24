<script setup>
import HandDrawnIcon from './HandDrawnIcon.vue'

const decos = [
  { name: 'amaryllis', style: { left: '6%', top: '10%', animationDelay: '0s', animationDuration: '6s', size: 36 } },
  { name: 'jewelry', style: { left: '88%', top: '14%', animationDelay: '1.5s', animationDuration: '7s', size: 30 } },
  { name: 'jewelry', style: { left: '92%', top: '52%', animationDelay: '2.2s', animationDuration: '8s', size: 28 } },
  { name: 'amaryllis', style: { left: '4%', top: '65%', animationDelay: '0.8s', animationDuration: '7.5s', size: 30, opacity: 0.38 } },
  { name: 'jewelry', style: { left: '72%', top: '6%', animationDelay: '3s', animationDuration: '6.5s', size: 26, opacity: 0.45 } },
  { name: 'amaryllis', style: { left: '16%', top: '38%', animationDelay: '1.8s', animationDuration: '9s', size: 22, opacity: 0.28 } },
  { name: 'jewelry', style: { left: '48%', top: '88%', animationDelay: '2s', animationDuration: '7s', size: 26, opacity: 0.4 } },
  { name: 'amaryllis', style: { left: '34%', top: '18%', animationDelay: '3.5s', animationDuration: '8s', size: 22, opacity: 0.28 } },
  { name: 'jewelry', style: { left: '58%', top: '72%', animationDelay: '1s', animationDuration: '6s', size: 32, opacity: 0.42 } },
]
</script>

<template>
  <div class="deco-layer" aria-hidden="true">
    <div class="corner corner-tl">
      <HandDrawnIcon name="amaryllis" :size="68" />
    </div>
    <div class="corner corner-tr">
      <HandDrawnIcon name="jewelry" :size="52" />
    </div>
    <div class="corner corner-br">
      <HandDrawnIcon name="jewelry" :size="48" />
    </div>
    <div
      v-for="(d, i) in decos"
      :key="i"
      class="deco"
      :style="{
        left: d.style.left,
        top: d.style.top,
        animationDelay: d.style.animationDelay,
        animationDuration: d.style.animationDuration,
        opacity: d.style.opacity,
      }"
    >
      <HandDrawnIcon :name="d.name" :size="d.style.size" />
    </div>
  </div>
</template>

<style scoped>
.deco-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.corner {
  position: absolute;
  opacity: 0.28;
}

.corner-tl {
  top: 52px;
  left: 232px;
  transform: rotate(-10deg);
}

.corner-tr {
  top: 80px;
  right: 48px;
  transform: rotate(8deg);
  opacity: 0.32;
}

.corner-br {
  bottom: 28px;
  right: 36px;
  transform: rotate(14deg) scaleX(-1);
  opacity: 0.3;
}

.deco {
  position: absolute;
  animation: float-deco 7s ease-in-out infinite;
}

@keyframes float-deco {
  0%, 100% {
    transform: translateY(0) rotate(-4deg);
  }
  50% {
    transform: translateY(-14px) rotate(5deg);
  }
}

@media (max-width: 768px) {
  .corner-tl {
    left: auto;
    right: 16px;
    top: 78px;
    opacity: 0.2;
  }
  .corner-tr {
    top: auto;
    bottom: 100px;
    left: 12px;
    right: auto;
    opacity: 0.22;
  }
  .corner-br {
    opacity: 0.2;
  }
}

@media (prefers-reduced-motion: reduce) {
  .deco {
    animation: none;
  }
}
</style>

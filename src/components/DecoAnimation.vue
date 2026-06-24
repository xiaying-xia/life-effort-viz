<script setup>
const decos = [
  { icon: '✨', style: { left: '8%', top: '12%', animationDelay: '0s', animationDuration: '5s', fontSize: '18px' } },
  { icon: '⭐', style: { left: '92%', top: '18%', animationDelay: '1.2s', animationDuration: '7s', fontSize: '16px' } },
  { icon: '💗', style: { left: '85%', top: '55%', animationDelay: '2.4s', animationDuration: '6s', fontSize: '20px' } },
  { icon: '♡', style: { left: '5%', top: '68%', animationDelay: '0.8s', animationDuration: '8s', fontSize: '22px' } },
  { icon: '✦', style: { left: '72%', top: '8%', animationDelay: '3s', animationDuration: '5.5s', fontSize: '14px' } },
  { icon: '💜', style: { left: '18%', top: '42%', animationDelay: '1.8s', animationDuration: '6.5s', fontSize: '16px' } },
  { icon: '⭐', style: { left: '48%', top: '85%', animationDelay: '2s', animationDuration: '7.5s', fontSize: '15px' } },
  { icon: '✨', style: { left: '35%', top: '22%', animationDelay: '3.5s', animationDuration: '5s', fontSize: '17px' } },
  { icon: '♡', style: { left: '58%', top: '38%', animationDelay: '4s', animationDuration: '8s', fontSize: '19px' } },
  { icon: '💫', style: { left: '78%', top: '78%', animationDelay: '1s', animationDuration: '6s', fontSize: '18px' } },
  { icon: '💙', style: { left: '62%', top: '62%', animationDelay: '2.2s', animationDuration: '9s', fontSize: '14px' } },
  { icon: '✦', style: { left: '28%', top: '78%', animationDelay: '0.5s', animationDuration: '7s', fontSize: '13px' } },
]
</script>

<template>
  <div class="deco-layer" aria-hidden="true">
    <span
      v-for="(d, i) in decos"
      :key="i"
      class="deco"
      :style="d.style"
    >{{ d.icon }}</span>
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

.deco {
  position: absolute;
  opacity: 0.45;
  animation: float-deco 6s ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(197, 171, 211, 0.45));
}

@keyframes float-deco {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0.35;
  }
  50% {
    transform: translateY(-14px) rotate(8deg) scale(1.08);
    opacity: 0.65;
  }
}

@media (prefers-reduced-motion: reduce) {
  .deco {
    animation: none;
    opacity: 0.25;
  }
}
</style>

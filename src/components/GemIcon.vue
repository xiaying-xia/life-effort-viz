<script setup>
import { useId, computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'blue',
    validator: (v) =>
      ['blue', 'pink', 'purple', 'gold', 'green', 'coral', 'cyan', 'lavender'].includes(v),
  },
  size: { type: [Number, String], default: 24 },
  sparkle: { type: Boolean, default: true },
  intense: { type: Boolean, default: false },
  phase: { type: Number, default: 0 },
})

const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

const animDelay = computed(() => `${props.phase * 0.22}s`)

const palettes = {
  blue: { light: '#BAE6FD', mid: '#38BDF8', deep: '#0284C7', dark: '#0369A1' },
  pink: { light: '#FBCFE8', mid: '#F472B6', deep: '#EC4899', dark: '#BE185D' },
  purple: { light: '#DDD6FE', mid: '#A78BFA', deep: '#8B5CF6', dark: '#6D28D9' },
  gold: { light: '#FEF08A', mid: '#FACC15', deep: '#EAB308', dark: '#CA8A04' },
  green: { light: '#BBF7D0', mid: '#4ADE80', deep: '#22C55E', dark: '#15803D' },
  coral: { light: '#FED7AA', mid: '#FB923C', deep: '#F97316', dark: '#C2410C' },
  cyan: { light: '#A5F3FC', mid: '#22D3EE', deep: '#06B6D4', dark: '#0E7490' },
  lavender: { light: '#E9D5FF', mid: '#C084FC', deep: '#A855F7', dark: '#7E22CE' },
}

const p = palettes[props.color] ?? palettes.blue

const bodyFill = computed(() => 'url(#' + `gem-body-${uid}` + ')')
const topFill = computed(() => 'url(#' + `gem-top-${uid}` + ')')
const glowFill = computed(() => 'url(#' + `gem-glow-${uid}` + ')')
</script>

<template>
  <svg
    class="gem-icon"
    :class="{ 'gem-sparkle': sparkle, 'gem-intense': intense }"
    :style="sparkle ? { animationDelay: animDelay } : undefined"
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient :id="`gem-body-${uid}`" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" :stop-color="p.light"/>
        <stop offset="35%" :stop-color="p.mid"/>
        <stop offset="70%" :stop-color="p.deep"/>
        <stop offset="100%" :stop-color="p.dark"/>
      </linearGradient>
      <linearGradient :id="`gem-top-${uid}`" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
        <stop offset="100%" :stop-color="p.light" stop-opacity="0.6"/>
      </linearGradient>
      <radialGradient :id="`gem-glow-${uid}`" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- 💎 经典菱形切割 -->
    <path
      d="M32 6 L54 26 L32 58 L10 26 Z"
      :fill="bodyFill"
      stroke="#ffffff"
      stroke-width="0.8"
      stroke-opacity="0.5"
    />
    <!-- 冠部刻面 -->
    <path d="M32 6 L54 26 L32 26 Z" :fill="topFill" opacity="0.85"/>
    <path d="M32 6 L10 26 L32 26 Z" :fill="topFill" opacity="0.55"/>
    <!-- 亭部刻面 -->
    <path d="M32 26 L54 26 L32 58 Z" :fill="p.deep" opacity="0.75"/>
    <path d="M32 26 L10 26 L32 58 Z" :fill="p.dark" opacity="0.85"/>
    <!-- 中央腰棱高光 -->
    <path d="M18 26 L32 26 L32 58 L18 26" stroke="#ffffff" stroke-width="0.6" opacity="0.35" fill="none"/>
    <path d="M46 26 L32 26 L32 58 L46 26" stroke="#ffffff" stroke-width="0.6" opacity="0.25" fill="none"/>
    <line x1="10" y1="26" x2="54" y2="26" stroke="#ffffff" stroke-width="0.7" opacity="0.5"/>
    <!-- 内部光泽 -->
    <ellipse cx="32" cy="24" rx="10" ry="6" :fill="glowFill"/>

    <!-- 火彩闪光点 -->
    <g v-if="sparkle" class="glints">
      <path d="M32 12 L33 15 L32 18 L31 15 Z" fill="#ffffff" opacity="0.95"/>
      <circle cx="24" cy="22" r="1.5" fill="#ffffff" class="g-a"/>
      <circle cx="40" cy="22" r="1.3" fill="#ffffff" class="g-b"/>
      <circle cx="32" cy="38" r="1.8" fill="#ffffff" class="g-c"/>
      <path d="M20 28 L21 30 L20 32 L19 30 Z" fill="#ffffff" opacity="0.8" class="g-b"/>
      <path d="M44 28 L45 30 L44 32 L43 30 Z" fill="#ffffff" opacity="0.8" class="g-a"/>
      <circle cx="28" cy="44" r="1" fill="#ffffff" class="g-c"/>
      <circle cx="36" cy="48" r="0.9" fill="#ffffff" class="g-a"/>
    </g>
  </svg>
</template>

<style scoped>
.gem-icon {
  display: block;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 3px rgba(56, 189, 248, 0.35));
}

.gem-sparkle .g-a {
  animation: gem-glint 1.6s ease-in-out infinite;
}

.gem-sparkle .g-b {
  animation: gem-glint 1.6s ease-in-out infinite 0.5s;
}

.gem-sparkle .g-c {
  animation: gem-glint 1.4s ease-in-out infinite 0.9s;
}

.gem-sparkle {
  animation: gem-shimmer 3s ease-in-out infinite;
}

.gem-intense.gem-sparkle {
  animation: gem-shimmer-intense 1.8s ease-in-out infinite;
}

.gem-intense.gem-sparkle .g-a {
  animation: gem-glint-intense 1.1s ease-in-out infinite;
}

.gem-intense.gem-sparkle .g-b {
  animation: gem-glint-intense 1.1s ease-in-out infinite 0.35s;
}

.gem-intense.gem-sparkle .g-c {
  animation: gem-glint-intense 1s ease-in-out infinite 0.65s;
}

@keyframes gem-glint {
  0%, 100% { opacity: 0.15; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1.35); }
}

@keyframes gem-glint-intense {
  0%, 100% { opacity: 0.35; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.5); }
}

@keyframes gem-shimmer {
  0%, 100% { filter: drop-shadow(0 1px 3px rgba(56, 189, 248, 0.3)); }
  50% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.85)) drop-shadow(0 0 14px rgba(56, 189, 248, 0.5)); }
}

@keyframes gem-shimmer-intense {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5)) drop-shadow(0 2px 6px rgba(56, 189, 248, 0.45)); }
  50% { filter: drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 20px rgba(147, 197, 253, 0.85)); }
}

@media (prefers-reduced-motion: reduce) {
  .gem-sparkle,
  .gem-sparkle .g-a,
  .gem-sparkle .g-b,
  .gem-sparkle .g-c {
    animation: none;
  }
}
</style>

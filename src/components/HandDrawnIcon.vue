<script setup>
import { useId } from 'vue'

defineProps({
  name: {
    type: String,
    required: true,
    validator: (v) => ['amaryllis', 'jewelry'].includes(v),
  },
  size: { type: [Number, String], default: 32 },
})

const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
</script>

<template>
  <svg
    class="hand-icon"
    :class="{ 'jewelry-sparkle': name === 'jewelry' }"
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- 朱顶红 -->
    <template v-if="name === 'amaryllis'">
      <path d="M30 58 C22 52 18 42 20 32 C22 22 28 18 32 20 C34 28 34 48 30 58Z" fill="#6BBF59"/>
      <path d="M34 58 C42 50 46 38 44 28 C42 18 36 16 32 18 C30 26 30 46 34 58Z" fill="#4FAF45"/>
      <path d="M32 58 L32 28" stroke="#3D9A3A" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="32" cy="24" rx="3" ry="5" fill="#E85D4A"/>
      <g transform="translate(32,14)">
        <ellipse cx="0" cy="-5" rx="5" ry="9" fill="#F04A3A"/>
        <ellipse cx="0" cy="-5" rx="5" ry="9" fill="#E63E32" transform="rotate(60)"/>
        <ellipse cx="0" cy="-5" rx="5" ry="9" fill="#F04A3A" transform="rotate(120)"/>
        <ellipse cx="0" cy="-5" rx="5" ry="9" fill="#E63E32" transform="rotate(180)"/>
        <ellipse cx="0" cy="-5" rx="5" ry="9" fill="#F04A3A" transform="rotate(240)"/>
        <ellipse cx="0" cy="-5" rx="5" ry="9" fill="#E63E32" transform="rotate(300)"/>
        <circle cx="0" cy="0" r="3.5" fill="#FFD166"/>
        <circle cx="0" cy="0" r="1.8" fill="#FFAA33"/>
      </g>
      <g transform="translate(22,20) rotate(-18)">
        <ellipse cx="0" cy="-4" rx="3.5" ry="6.5" fill="#F25545"/>
        <ellipse cx="0" cy="-4" rx="3.5" ry="6.5" fill="#E63E32" transform="rotate(72)"/>
        <ellipse cx="0" cy="-4" rx="3.5" ry="6.5" fill="#F25545" transform="rotate(144)"/>
        <ellipse cx="0" cy="-4" rx="3.5" ry="6.5" fill="#E63E32" transform="rotate(216)"/>
        <ellipse cx="0" cy="-4" rx="3.5" ry="6.5" fill="#F25545" transform="rotate(288)"/>
        <circle cx="0" cy="0" r="2.2" fill="#FFD166"/>
      </g>
      <g transform="translate(42,22) rotate(15)">
        <ellipse cx="0" cy="-3.5" rx="3" ry="5.5" fill="#F25545"/>
        <ellipse cx="0" cy="-3.5" rx="3" ry="5.5" fill="#E63E32" transform="rotate(72)"/>
        <ellipse cx="0" cy="-3.5" rx="3" ry="5.5" fill="#F25545" transform="rotate(144)"/>
        <ellipse cx="0" cy="-3.5" rx="3" ry="5.5" fill="#E63E32" transform="rotate(216)"/>
        <ellipse cx="0" cy="-3.5" rx="3" ry="5.5" fill="#F25545" transform="rotate(288)"/>
        <circle cx="0" cy="0" r="1.8" fill="#FFD166"/>
      </g>
    </template>

    <!-- 高级珠宝：簇镶彩宝 + 火彩 -->
    <template v-else>
      <defs>
        <linearGradient :id="`ruby-${uid}`" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF8FAB"/>
          <stop offset="35%" stop-color="#E91E63"/>
          <stop offset="70%" stop-color="#AD1457"/>
          <stop offset="100%" stop-color="#FF4081"/>
        </linearGradient>
        <linearGradient :id="`emerald-${uid}`" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A5F3B4"/>
          <stop offset="50%" stop-color="#22C55E"/>
          <stop offset="100%" stop-color="#15803D"/>
        </linearGradient>
        <linearGradient :id="`sapphire-${uid}`" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C4B5FD"/>
          <stop offset="50%" stop-color="#7C3AED"/>
          <stop offset="100%" stop-color="#5B21B6"/>
        </linearGradient>
        <linearGradient :id="`topaz-${uid}`" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="50%" stop-color="#FACC15"/>
          <stop offset="100%" stop-color="#CA8A04"/>
        </linearGradient>
        <radialGradient :id="`diamond-${uid}`" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="45%" stop-color="#E0F2FE"/>
          <stop offset="100%" stop-color="#93C5FD"/>
        </radialGradient>
        <linearGradient :id="`gold-${uid}`" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#F5E6A8"/>
          <stop offset="50%" stop-color="#D4AF37"/>
          <stop offset="100%" stop-color="#B8860B"/>
        </linearGradient>
      </defs>

      <!-- 项链链 -->
      <path
        d="M10 22 C10 12 22 6 32 6 C42 6 54 12 54 22"
        :stroke="`url(#gold-${uid})`"
        stroke-width="2"
        stroke-linecap="round"
        fill="none"
      />
      <circle cx="32" cy="6" r="2" :fill="`url(#diamond-${uid})`"/>

      <!-- 簇镶底座 -->
      <path
        d="M22 24 C26 20 38 20 42 24 L38 30 L26 30 Z"
        :fill="`url(#gold-${uid})`"
        opacity="0.85"
      />

      <!-- 绿叶宝石 -->
      <path d="M18 34 L22 28 L24 36 Z" :fill="`url(#emerald-${uid})`"/>
      <path d="M18 34 L22 28 L24 36 Z" stroke="#fff" stroke-width="0.4" opacity="0.5" fill="none"/>
      <path d="M46 34 L42 28 L40 36 Z" :fill="`url(#emerald-${uid})`"/>
      <path d="M46 34 L42 28 L40 36 Z" stroke="#fff" stroke-width="0.4" opacity="0.5" fill="none"/>

      <!-- 环绕小钻 -->
      <circle cx="20" cy="26" r="2.2" :fill="`url(#diamond-${uid})`"/>
      <circle cx="44" cy="26" r="2.2" :fill="`url(#diamond-${uid})`"/>
      <circle cx="24" cy="42" r="2" :fill="`url(#topaz-${uid})`"/>
      <circle cx="40" cy="42" r="2" :fill="`url(#sapphire-${uid})`"/>
      <circle cx="32" cy="48" r="1.8" :fill="`url(#diamond-${uid})`"/>

      <!-- 侧瓣彩宝 -->
      <path d="M14 38 L18 32 L20 40 Z" fill="#F472B6"/>
      <path d="M14 38 L18 32 L20 40 Z" stroke="#fff" stroke-width="0.35" opacity="0.45" fill="none"/>
      <path d="M50 38 L46 32 L44 40 Z" fill="#F472B6"/>
      <path d="M50 38 L46 32 L44 40 Z" stroke="#fff" stroke-width="0.35" opacity="0.45" fill="none"/>

      <!-- 主石：方形红宝石 -->
      <rect
        x="24"
        y="30"
        width="16"
        height="14"
        rx="1"
        :fill="`url(#ruby-${uid})`"
        transform="rotate(-2 32 37)"
      />
      <path
        d="M24 30 L32 37 L40 30 M24 30 L32 37 L24 44 M40 30 L32 37 L40 44 M24 44 L32 37 L40 44"
        stroke="#fff"
        stroke-width="0.5"
        opacity="0.55"
        transform="rotate(-2 32 37)"
      />

      <!-- 火彩高光 -->
      <g class="fire-glints">
        <path d="M28 33 L29 35 L28 37 L27 35 Z" fill="#fff" opacity="0.9"/>
        <circle cx="36" cy="34" r="1.2" fill="#fff" opacity="0.75"/>
        <path d="M12 24 L13 26 L12 28 L11 26 Z" fill="#fff" opacity="0.7"/>
        <path d="M52 24 L53 26 L52 28 L51 26 Z" fill="#fff" opacity="0.7"/>
        <circle cx="20" cy="26" r="0.8" fill="#fff" class="spark-a"/>
        <circle cx="44" cy="26" r="0.8" fill="#fff" class="spark-b"/>
        <circle cx="32" cy="36" r="1" fill="#fff" class="spark-c"/>
        <path d="M30 50 L31 52 L30 54 L29 52 Z" fill="#fff" opacity="0.6" class="spark-a"/>
        <path d="M48 36 L49 38 L48 40 L47 38 Z" fill="#fff" opacity="0.55" class="spark-b"/>
      </g>
    </template>
  </svg>
</template>

<style scoped>
.hand-icon {
  display: block;
  flex-shrink: 0;
}

.jewelry-sparkle .spark-a {
  animation: glint 2.2s ease-in-out infinite;
}

.jewelry-sparkle .spark-b {
  animation: glint 2.2s ease-in-out infinite 0.7s;
}

.jewelry-sparkle .spark-c {
  animation: glint 1.8s ease-in-out infinite 1.1s;
}

@keyframes glint {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

@media (prefers-reduced-motion: reduce) {
  .jewelry-sparkle .spark-a,
  .jewelry-sparkle .spark-b,
  .jewelry-sparkle .spark-c {
    animation: none;
    opacity: 0.8;
  }
}
</style>

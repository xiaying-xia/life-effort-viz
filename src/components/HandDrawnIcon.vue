<script setup>
defineProps({
  name: {
    type: String,
    required: true,
    validator: (v) => ['amaryllis', 'peony', 'jewelry'].includes(v),
  },
  size: { type: [Number, String], default: 32 },
})
</script>

<template>
  <svg
    class="hand-icon"
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

    <!-- 牡丹 -->
    <template v-else-if="name === 'peony'">
      <path d="M18 52 C14 44 14 34 18 28 C22 22 26 24 28 30 C26 38 24 48 18 52Z" fill="#5CB85C"/>
      <path d="M46 54 C50 46 50 36 46 30 C42 24 38 26 36 32 C38 40 40 50 46 54Z" fill="#4FAF45"/>
      <path d="M32 56 L32 34" stroke="#3D9A3A" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="32" cy="22" rx="14" ry="11" fill="#F8A4C8"/>
      <ellipse cx="32" cy="22" rx="14" ry="11" fill="#F48FB8" transform="rotate(45 32 22)"/>
      <ellipse cx="32" cy="22" rx="14" ry="11" fill="#F8A4C8" transform="rotate(90 32 22)"/>
      <ellipse cx="32" cy="22" rx="14" ry="11" fill="#F06292" transform="rotate(135 32 22)"/>
      <ellipse cx="32" cy="22" rx="10" ry="8" fill="#EC407A" transform="rotate(22 32 22)"/>
      <ellipse cx="32" cy="22" rx="10" ry="8" fill="#F48FB8" transform="rotate(67 32 22)"/>
      <ellipse cx="32" cy="22" rx="10" ry="8" fill="#EC407A" transform="rotate(112 32 22)"/>
      <ellipse cx="32" cy="22" rx="10" ry="8" fill="#F48FB8" transform="rotate(157 32 22)"/>
      <circle cx="32" cy="22" r="5" fill="#FFD54F"/>
      <circle cx="30" cy="21" r="1.2" fill="#FF8F00"/>
      <circle cx="34" cy="21" r="1.2" fill="#FF8F00"/>
      <circle cx="32" cy="24" r="1.2" fill="#FF8F00"/>
    </template>

    <!-- 珠宝 -->
    <template v-else>
      <path d="M14 28 C14 18 24 12 32 12 C40 12 50 18 50 28" stroke="#C5ABD3" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M32 12 L32 8" stroke="#B89AD0" stroke-width="2" stroke-linecap="round"/>
      <path d="M28 28 L32 34 L36 28 Z" fill="#E8D4F8" stroke="#C5ABD3" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M32 34 L26 44 L32 52 L38 44 Z" fill="#9ACBFB" stroke="#7AB8F0" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M32 34 L29 44 L32 48 L35 44 Z" fill="#B6DBFB" opacity="0.7"/>
      <ellipse cx="30" cy="42" rx="2" ry="3" fill="#fff" opacity="0.55" transform="rotate(-20 30 42)"/>
      <path d="M22 26 L24 30 L22 34 L20 30 Z" fill="#FCA7C4"/>
      <path d="M42 26 L44 30 L42 34 L40 30 Z" fill="#FCA7C4"/>
      <circle cx="32" cy="14" r="2.5" fill="#FFD166" stroke="#F0B429" stroke-width="0.8"/>
    </template>
  </svg>
</template>

<style scoped>
.hand-icon {
  display: block;
  flex-shrink: 0;
}
</style>

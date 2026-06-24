<script setup>
import { ref, onMounted } from 'vue'

const deferredPrompt = ref(null)
const canInstall = ref(false)
const isStandalone = ref(false)

onMounted(() => {
  isStandalone.value =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    canInstall.value = true
  })
})

async function install() {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  await deferredPrompt.value.userChoice
  deferredPrompt.value = null
  canInstall.value = false
}
</script>

<template>
  <div v-if="!isStandalone && (canInstall || true)" class="install-banner card">
    <div class="install-text">
      <strong>📲 安装到手机</strong>
      <p v-if="canInstall">点击下方按钮，像 App 一样添加到主屏幕</p>
      <p v-else>
        iPhone：Safari 分享 →「添加到主屏幕」<br />
        Android：Chrome 菜单 →「安装应用」
      </p>
    </div>
    <button v-if="canInstall" class="btn btn-primary btn-sm" @click="install">
      安装 App
    </button>
  </div>
</template>

<style scoped>
.install-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, rgba(204, 251, 241, 0.55), rgba(167, 243, 208, 0.45));
  border-color: rgba(45, 212, 191, 0.35);
}
.install-text strong {
  font-size: 14px;
  color: var(--text-strong);
}
.install-text p {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
  line-height: 1.5;
}
</style>

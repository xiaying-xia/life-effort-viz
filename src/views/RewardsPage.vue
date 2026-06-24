<script setup>
import { ref, watch, computed } from 'vue'
import { useGameStore } from '../composables/useGameStore.js'
import { getLevelProgress } from '../utils/level.js'

const emit = defineEmits(['toast'])
const {
  state,
  wishlistRewards,
  purchasedRewards,
  yuanPerCoin,
  priceToCoins,
  coinsToYuan,
  setYuanPerCoin,
  addReward,
  updateReward,
  deleteReward,
  redeemReward,
  reopenWishlist,
} = useGameStore()

const tab = ref('wishlist')
const showForm = ref(false)
const editingId = ref(null)
const autoFromPrice = ref(true)
const ratioInput = ref(yuanPerCoin.value)

const form = ref(emptyForm())

function emptyForm() {
  return {
    name: '',
    description: '',
    cost: 50,
    priceYuan: '',
    link: '',
    image: '',
  }
}

watch(
  () => form.value.priceYuan,
  (val) => {
    if (!autoFromPrice.value || showForm.value === false) return
    const y = parseFloat(val)
    if (y > 0) form.value.cost = priceToCoins(y)
  },
)

const formCoinHint = computed(() => {
  if (!form.value.cost) return ''
  return `≈ ¥${coinsToYuan(form.value.cost)}（按 1 金币 = ¥${yuanPerCoin.value}）`
})

const displayRewards = computed(() =>
  tab.value === 'purchased' ? purchasedRewards.value : wishlistRewards.value,
)

function openAdd() {
  editingId.value = null
  autoFromPrice.value = true
  form.value = emptyForm()
  showForm.value = true
}

function openEdit(reward) {
  editingId.value = reward.id
  autoFromPrice.value = false
  form.value = {
    name: reward.name,
    description: reward.description,
    cost: reward.cost,
    priceYuan: reward.priceYuan,
    link: reward.link,
    image: reward.image,
  }
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editingId.value = null
}

function submitForm() {
  const result = editingId.value
    ? updateReward(editingId.value, form.value)
    : addReward(form.value)
  emit('toast', result.message, result.ok)
  if (result.ok) cancelForm()
}

function onPriceInput() {
  autoFromPrice.value = true
}

function onCostInput() {
  autoFromPrice.value = false
}

function applyRatio() {
  const result = setYuanPerCoin(ratioInput.value)
  emit('toast', result.message, result.ok)
  if (result.ok && autoFromPrice.value && form.value.priceYuan) {
    form.value.cost = priceToCoins(form.value.priceYuan)
  }
}

function onImagePick(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    emit('toast', '请选择图片文件', false)
    return
  }
  if (file.size > 800 * 1024) {
    emit('toast', '图片请小于 800KB', false)
    return
  }
  const reader = new FileReader()
  reader.onload = () => { form.value.image = reader.result }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function formatPurchasedDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}

function onRedeem(id) {
  if (!confirm('确认兑换？将扣除金币并标记为「已购买」')) return
  const result = redeemReward(id)
  emit('toast', result.message, result.ok)
  if (result.ok) tab.value = 'purchased'
}

function onReopen(id) {
  const result = reopenWishlist(id)
  emit('toast', result.message, result.ok)
  if (result.ok) tab.value = 'wishlist'
}

function onDelete(id) {
  if (!confirm('确定删除？')) return
  deleteReward(id)
  emit('toast', '已删除', true)
}

function canRedeem(reward) {
  if (reward.status === 'purchased') return false
  if ((state.coins || 0) < reward.cost) return false
  if (reward.dimensionId) {
    const prog = getLevelProgress(state.xp[reward.dimensionId] ?? 0)
    if (prog.level < 2) return false
  }
  return true
}
</script>

<template>
  <div class="rewards-page">
    <section class="card coins-banner">
      <div class="coins-val">🪙 {{ state.coins || 0 }}</div>
      <div class="coins-hint">每 10 XP → +1 金币 · 当前 1 金币 = ¥{{ yuanPerCoin }}</div>
    </section>

    <section class="card ratio-card">
      <div class="card-title">💱 金币换算比例</div>
      <p class="hint">填真实价格后，系统按此比例自动算兑换金币。例：¥1999，比例 10 → 需 200 金币</p>
      <div class="ratio-row">
        <span>1 金币 = ¥</span>
        <input v-model.number="ratioInput" type="number" class="ratio-input" min="0.1" step="0.1" />
        <button class="btn btn-ghost btn-sm" @click="applyRatio">保存比例</button>
      </div>
    </section>

    <section class="card">
      <div class="section-head">
        <div class="card-title">🎁 我的心愿单</div>
        <button v-if="tab === 'wishlist'" class="btn btn-primary btn-sm" @click="openAdd">
          + 添加奖励
        </button>
      </div>

      <div class="tabs">
        <button class="tab" :class="{ active: tab === 'wishlist' }" @click="tab = 'wishlist'">
          待兑换 ({{ wishlistRewards.length }})
        </button>
        <button class="tab" :class="{ active: tab === 'purchased' }" @click="tab = 'purchased'">
          已购买 ({{ purchasedRewards.length }})
        </button>
      </div>

      <div v-if="showForm && tab === 'wishlist'" class="reward-form">
        <div class="form-title">{{ editingId ? '编辑奖励' : '添加新奖励' }}</div>

        <div class="image-field">
          <div v-if="form.image" class="preview-wrap">
            <img :src="form.image" alt="预览" class="preview-img" />
            <button type="button" class="remove-img" @click="form.image = ''">移除图片</button>
          </div>
          <label v-else class="upload-box">
            <span>📷 点击上传图片</span>
            <input type="file" accept="image/*" hidden @change="onImagePick" />
          </label>
        </div>

        <input v-model="form.name" class="input" placeholder="名称，如：AirPods Pro" />
        <div class="row-2">
          <div class="field">
            <label>真实价格 ¥（填后自动算金币）</label>
            <input
              v-model="form.priceYuan"
              class="input"
              placeholder="1999"
              inputmode="decimal"
              @input="onPriceInput"
            />
          </div>
          <div class="field">
            <label>兑换金币</label>
            <input
              v-model.number="form.cost"
              type="number"
              class="input"
              min="1"
              @input="onCostInput"
            />
            <span v-if="formCoinHint" class="field-hint">{{ formCoinHint }}</span>
          </div>
        </div>
        <input v-model="form.link" class="input" placeholder="购买链接（选填）" />
        <textarea
          v-model="form.description"
          class="textarea"
          placeholder="备注 / 激励语"
          rows="2"
        />
        <div class="form-actions">
          <button type="button" class="btn btn-ghost btn-sm" @click="cancelForm">取消</button>
          <button type="button" class="btn btn-primary btn-sm" @click="submitForm">
            {{ editingId ? '保存' : '添加' }}
          </button>
        </div>
      </div>

      <div v-if="displayRewards.length === 0" class="empty">
        {{ tab === 'wishlist' ? '还没有奖励，点「添加奖励」开始' : '还没有已购买的记录' }}
      </div>

      <div class="reward-grid">
        <article
          v-for="reward in displayRewards"
          :key="reward.id"
          class="reward-card"
          :class="{ purchased: reward.status === 'purchased' }"
        >
          <div class="card-image">
            <img v-if="reward.image" :src="reward.image" :alt="reward.name" />
            <div v-else class="no-image">🎁</div>
            <span v-if="reward.status === 'purchased'" class="badge-purchased">已购买</span>
          </div>
          <div class="card-body">
            <h3 class="reward-name">{{ reward.name }}</h3>
            <p v-if="reward.description" class="reward-desc">{{ reward.description }}</p>
            <div class="price-row">
              <span v-if="reward.priceYuan" class="price-yuan">¥{{ reward.priceYuan }}</span>
              <span class="cost">🪙 {{ reward.cost }}</span>
            </div>
            <p v-if="reward.purchasedAt" class="purchased-date">
              购买于 {{ formatPurchasedDate(reward.purchasedAt) }}
            </p>
            <div class="card-actions">
              <template v-if="reward.status !== 'purchased'">
                <button
                  class="btn btn-sm"
                  :class="canRedeem(reward) ? 'btn-primary' : 'btn-ghost'"
                  :disabled="!canRedeem(reward)"
                  @click="onRedeem(reward.id)"
                >
                  兑换
                </button>
                <button class="btn btn-ghost btn-sm" @click="openEdit(reward)">编辑</button>
              </template>
              <template v-else>
                <button class="btn btn-ghost btn-sm" @click="onReopen(reward.id)">
                  重新加入心愿
                </button>
              </template>
              <a
                v-if="reward.link"
                :href="reward.link"
                target="_blank"
                rel="noopener"
                class="btn btn-ghost btn-sm"
              >
                链接
              </a>
              <button class="btn btn-ghost btn-sm" @click="onDelete(reward.id)">删除</button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.rewards-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coins-banner {
  text-align: center;
  background: linear-gradient(135deg, rgba(254, 240, 138, 0.3), rgba(167, 243, 208, 0.45));
  border-color: rgba(45, 212, 191, 0.35);
}

.coins-val {
  font-size: 36px;
  font-weight: 800;
  color: var(--accent-deep);
}

.coins-hint {
  font-size: 13px;
  color: var(--muted);
  margin-top: 6px;
}

.ratio-card .hint {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 10px;
  line-height: 1.5;
}

.ratio-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-strong);
}

.ratio-input {
  width: 88px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
  text-align: center;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.section-head .card-title {
  margin-bottom: 0;
}

.tabs {
  display: flex;
  gap: 8px;
  margin: 12px 0 16px;
}

.tab {
  flex: 1;
  padding: 8px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  background: rgba(240, 253, 250, 0.7);
  border: 1px solid var(--border);
}

.tab.active {
  background: var(--btn-gradient);
  color: #fff;
  border-color: transparent;
}

.reward-form {
  background: rgba(240, 253, 250, 0.9);
  border: 2px dashed var(--border);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin-bottom: 20px;
}

.form-title {
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--text-strong);
}

.image-field {
  margin-bottom: 12px;
}

.upload-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  border: 2px dashed var(--accent);
  border-radius: 16px;
  color: var(--muted);
  cursor: pointer;
  background: #fff;
}

.preview-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 16px;
  border: 2px solid var(--border);
}

.remove-img {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--danger);
}

.input,
.textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: #fff;
  margin-bottom: 10px;
}

.row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.field label {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 4px;
}

.field-hint {
  display: block;
  font-size: 11px;
  color: var(--accent-deep);
  margin-top: -6px;
  margin-bottom: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.empty {
  text-align: center;
  color: var(--muted);
  padding: 32px;
  font-size: 14px;
}

.reward-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.reward-card {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.reward-card.purchased {
  border-color: rgba(134, 239, 172, 0.8);
}

.card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  background: linear-gradient(180deg, #ccfbf1, #f0fdfa);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  font-size: 48px;
}

.badge-purchased {
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #86efac, #4ade80);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
}

.card-body {
  padding: 12px;
}

.reward-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-strong);
}

.reward-desc {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}

.price-row {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  align-items: baseline;
}

.price-yuan {
  font-size: 18px;
  font-weight: 800;
  color: #f59e0b;
}

.cost {
  font-size: 13px;
  color: var(--muted);
}

.purchased-date {
  font-size: 11px;
  color: #16a34a;
  margin-top: 6px;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

@media (max-width: 480px) {
  .row-2 {
    grid-template-columns: 1fr;
  }
}
</style>

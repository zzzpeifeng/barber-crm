<template>
  <div class="page-container">
    <van-nav-bar title="会员详情" left-arrow @click-left="goBack" />
    
    <div v-if="loading" class="loading-container">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
    
    <div v-else-if="member" class="content-container">
      <!-- 会员基本信息 -->
      <div class="card member-info-card">
        <div class="card-header">
          <h3 class="member-name">{{ member.name }}</h3>
        </div>
        <div class="card-content">
          <div class="detail-item">
            <span class="label">手机号：</span>
            <span class="value">{{ member.phone }}</span>
          </div>
          <div v-if="member.address" class="detail-item">
            <span class="label">地址：</span>
            <span class="value">{{ member.address }}</span>
          </div>
          <div class="detail-item">
            <span class="label">注册时间：</span>
            <span class="value">{{ formatDate(member.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- 积分信息 -->
      <div class="card points-card">
        <div class="card-header">
          <div class="section-title">积分总览</div>
        </div>
        <div class="card-content">
          <div class="points-summary">
            <div class="points-item">
              <span class="label">当前积分</span>
              <span class="value points-current">{{ pointsSummary?.currentPoints || 0 }}</span>
            </div>
            <div class="points-item">
              <span class="label">累计获得</span>
              <span class="value">{{ pointsSummary?.totalEarned || 0 }}</span>
            </div>
            <div class="points-item">
              <span class="label">累计消费</span>
              <span class="value">{{ pointsSummary?.totalUsed || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 积分操作 -->
      <div class="card actions-card">
        <div class="card-header">
          <div class="section-title">积分操作</div>
        </div>
        <div class="card-content">
          <div class="action-buttons">
            <van-button 
              type="warning" 
              size="small" 
              @click="openConsumeModal"
            >
              消费
            </van-button>
            <van-button 
              type="primary" 
              size="small" 
              @click="openSetModal"
            >
              设置
            </van-button>
          </div>
        </div>
      </div>

      <!-- 积分变更记录 -->
      <div class="card transactions-card">
        <div class="card-header">
          <div class="section-title">积分操作记录</div>
        </div>
        <div class="card-content">
          <div class="transaction-list" v-if="transactions.length > 0">
            <van-cell
              v-for="transaction in transactions"
              :key="transaction.id"
              :title="getTransactionTypeText(transaction.changeType)"
              :label="`${formatDate(transaction.createdAt)} ${transaction.reason || ''}`"
              :value="`${transaction.changeType === 'increase' ? '+' : '-'}${transaction.pointsChange}`"
              :value-class="getTransactionValueClass(transaction.changeType)"
              :border="false"
            />
          </div>
          <div v-else class="empty-text">暂无记录</div>
        </div>
      </div>
    </div>

    <!-- 积分消费弹窗 -->
    <van-popup 
      v-model:show="showConsumeModal" 
      round 
      :style="{ width: '80%', padding: '20px' }"
    >
      <div class="modal-content">
        <h3 class="modal-title">积分消费</h3>
        <van-form @submit="handleConsume">
          <div class="form-item">
            <div class="label">消费积分</div>
            <van-stepper 
              v-model="consumeForm.points" 
              :min="1" 
              integer 
              input-width="100px" 
              button-size="32px"
            />
          </div>
          <van-field
            v-model="consumeForm.reason"
            label="备注"
            placeholder="请输入备注"
            rows="2"
            autosize
            type="textarea"
            class="remark-field"
          />
          <div class="modal-actions">
            <van-button plain block @click="showConsumeModal = false" type="default" class="mr-2">取消</van-button>
            <van-button type="warning" block native-type="submit">确定</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 积分设置弹窗 -->
    <van-popup 
      v-model:show="showSetModal" 
      round 
      :style="{ width: '80%', padding: '20px' }"
    >
      <div class="modal-content">
        <h3 class="modal-title">积分设置</h3>
        <van-form @submit="handleSet">
          <div class="form-item">
            <div class="label">调整积分</div>
            <van-stepper 
              v-model="setForm.points" 
              integer 
              input-width="100px" 
              button-size="32px"
            />
            <div class="hint">正数增加，负数扣除</div>
          </div>
          <van-field
            v-model="setForm.reason"
            label="备注"
            placeholder="请输入备注"
            rows="2"
            autosize
            type="textarea"
            class="remark-field"
          />
          <div class="modal-actions">
            <van-button plain block @click="showSetModal = false" type="default" class="mr-2">取消</van-button>
            <van-button type="primary" block native-type="submit">确定</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { memberApi } from '@/api/member'
import { pointsApi } from '@/api/points'
import { useAuthStore } from '@/stores/auth'
import type { Member, MemberPointsSummary, MemberPointsTransaction } from '@/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const member = ref<Member | null>(null)
const pointsSummary = ref<MemberPointsSummary | null>(null)
const transactions = ref<MemberPointsTransaction[]>([])

const showConsumeModal = ref(false)
const showSetModal = ref(false)

const consumeForm = ref({
  points: 1,
  reason: ''
})

const setForm = ref({
  points: 0,
  reason: ''
})

const shopId = computed(() => authStore.user?.merchantId)
const memberId = Number(route.params.memberId)

const openConsumeModal = () => {
  consumeForm.value = { points: 1, reason: '' }
  showConsumeModal.value = true
}

const openSetModal = () => {
  setForm.value = { points: 0, reason: '' }
  showSetModal.value = true
}

const loadMember = async () => {
  loading.value = true
  try {
    console.log('Loading member:', memberId, 'ShopId:', shopId.value)
    member.value = await memberApi.getMember(memberId)
    if (member.value) {
      await loadPointsSummary()
      await loadTransactions()
    }
  } catch (error: any) {
    showToast(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const loadPointsSummary = async () => {
  if (!shopId.value) return
  
  try {
    pointsSummary.value = await pointsApi.getSummary(memberId, shopId.value)
  } catch (error: any) {
    console.error('加载积分总览失败:', error)
  }
}

const loadTransactions = async () => {
  if (!shopId.value) return
  
  try {
    transactions.value = await pointsApi.getTransactions(memberId, shopId.value)
  } catch (error: any) {
    console.error('加载变更记录失败:', error)
  }
}

const handleConsume = async () => {
  if (!shopId.value) return
  
  const points = Number(consumeForm.value.points)
  if (points <= 0) {
    showToast('消费积分必须大于0')
    return
  }
  
  if (pointsSummary.value?.currentPoints && pointsSummary.value.currentPoints < points) {
    showToast('当前积分不足')
    return
  }

  try {
    await pointsApi.changePoints({
      memberId,
      shopId: shopId.value,
      changeType: 'decrease',
      pointsChange: points,
      reason: consumeForm.value.reason || '积分消费',
      operatorId: authStore.user?.id || 0
    })
    
    showSuccessToast('消费成功')
    showConsumeModal.value = false
    await loadMember() // Refresh all data
  } catch (error: any) {
    showToast(error.message || '操作失败')
  }
}

const handleSet = async () => {
  if (!shopId.value) return
  
  const points = Number(setForm.value.points)
  if (points === 0) {
    showToast('调整积分不能为0')
    return
  }
  
  const changeType = points > 0 ? 'increase' : 'decrease'
  const absPoints = Math.abs(points)

  if (changeType === 'decrease' && pointsSummary.value?.currentPoints && pointsSummary.value.currentPoints < absPoints) {
    showToast('当前积分不足以扣除')
    return
  }

  try {
    await pointsApi.changePoints({
      memberId,
      shopId: shopId.value,
      changeType,
      pointsChange: absPoints,
      reason: setForm.value.reason || '积分设置',
      operatorId: authStore.user?.id || 0
    })
    
    showSuccessToast('设置成功')
    showSetModal.value = false
    await loadMember() // Refresh all data
  } catch (error: any) {
    showToast(error.message || '操作失败')
  }
}

const goBack = () => {
  router.back()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const getTransactionTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    increase: '增加',
    decrease: '扣除',
    reset: '重置'
  }
  return typeMap[type] || type
}

const getTransactionValueClass = (type: string) => {
  if (type === 'increase') return 'text-green-600'
  if (type === 'decrease') return 'text-red-600'
  return 'text-gray-600'
}

onMounted(() => {
  loadMember()
})
</script>

<style scoped>
.content-container {
  padding: 16px;
  padding-bottom: 40px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.card-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.card-content {
  padding: 16px;
}

.member-name {
  margin: 0;
  color: #1a1a1a;
  font-size: 18px;
  font-weight: 600;
}

.detail-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
}

.points-summary {
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.points-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.points-item .label {
  font-size: 12px;
  color: #64748b;
}

.points-item .value {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
}

.points-current {
  color: #2563eb !important;
  font-size: 24px !important;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 10px 0;
}

.action-buttons .van-button {
  width: 120px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-title {
  text-align: center;
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
}

.form-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
}

.form-item .label {
  font-size: 14px;
  color: #64748b;
}

.form-item .hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.remark-field {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
}

.modal-actions {
  display: flex;
  margin-top: 24px;
  gap: 12px;
}

.modal-actions .van-button {
  flex: 1;
  border-radius: 8px;
}

.mr-2 {
  margin-right: 8px;
}

.text-green-600 { color: #16a34a; }
.text-red-600 { color: #dc2626; }
.text-gray-600 { color: #4b5563; }

.empty-text {
  text-align: center;
  padding: 20px;
  color: #94a3b8;
  font-size: 14px;
}

/* Click effects */
:deep(.van-button:active) {
  transform: scale(0.96);
  transition: transform 0.1s;
}

:deep(.van-stepper__minus:active),
:deep(.van-stepper__plus:active) {
  background-color: #f1f5f9;
  transform: scale(0.9);
  transition: transform 0.1s;
}
</style>
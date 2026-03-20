<template>
  <div>
    <div class="table-header">
      <h1 class="page-title">门店管理</h1>
      <el-button type="primary" @click="handleOpenCreateDialog">
        <el-icon><Plus /></el-icon>
        新增门店
      </el-button>
    </div>

    <!-- 搜索表单 -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="商家">
          <el-select
            v-model="searchForm.merchantId"
            placeholder="请选择商家"
            clearable
            style="width: 250px"
            @change="onMerchantChange"
          >
            <el-option
              v-for="merchant in merchants"
              :key="merchant.id"
              :label="merchant.name"
              :value="merchant.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺">
          <el-select
            v-model="searchForm.shopId"
            placeholder="请选择店铺"
            clearable
            :disabled="!searchForm.merchantId"
          >
            <el-option
              v-for="shop in filteredShops"
              :key="shop.id"
              :label="shop.name"
              :value="shop.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入门店名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadStores">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="stores"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="门店名称" min-width="120" />
        <el-table-column prop="shopName" label="所属店铺" min-width="120" />
        <el-table-column prop="merchantName" label="所属商家" min-width="120" />
        <el-table-column prop="address" label="门店地址" min-width="180" />
        <el-table-column prop="phone" label="联系电话" min-width="120" />
        <el-table-column prop="createdAt" label="创建时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editStore(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteStore(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingStore ? '编辑门店' : '新增门店'"
      width="600px"
    >
      <el-form
        ref="storeFormRef"
        :model="storeForm"
        :rules="storeRules"
        label-width="100px"
      >
        <el-form-item label="所属商家" prop="merchantId">
          <el-select
            v-model="selectedMerchantId"
            placeholder="请选择商家"
            style="width: 100%"
            @change="onMerchantSelectChange"
            clearable
          >
            <el-option
              v-for="merchant in merchants"
              :key="merchant.id"
              :label="merchant.name"
              :value="merchant.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属店铺" prop="shopId">
          <el-select
            v-model="storeForm.shopId"
            placeholder="请选择店铺"
            style="width: 100%"
            :disabled="!selectedMerchantId"
            clearable
            @change="onShopSelectChange"
          >
            <el-option
              v-for="shop in merchantShops"
              :key="shop.id"
              :label="shop.name"
              :value="shop.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="storeForm.name" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="storeForm.address" placeholder="请输入门店地址" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="storeForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="storeForm.remark"
            type="textarea"
            placeholder="请输入备注"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitStore">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { storeApi } from '@/api/store'
import { shopApi } from '@/api/shop'
import { merchantApi } from '@/api/merchant'
import type { Store, Shop, Merchant } from '@/types'

const loading = ref(false)
const submitting = ref(false)
const stores = ref<Store[]>([])
const shops = ref<Shop[]>([])
const merchants = ref<Merchant[]>([])
const showCreateDialog = ref(false)
const editingStore = ref<Store | null>(null)
const selectedMerchantId = ref<number | undefined>(undefined)
// 弹窗专用的店铺列表，独立于全局 shops
const dialogShops = ref<Shop[]>([])

const test_merchantId = ref<number | undefined>(undefined)
test_merchantId.value = 2

const storeFormRef = ref<FormInstance>()

const searchForm = reactive({
  merchantId: undefined as number | undefined,
  shopId: undefined as number | undefined,
  name: ''
})

const storeForm = reactive({
  merchantId: undefined as number | undefined,
  shopId: undefined as number | undefined,
  name: '',
  address: '',
  phone: '',
  remark: ''
})

const storeRules: FormRules = {
  merchantId: [{ required: true, message: '请选择所属商家', trigger: 'change' }],
  shopId: [{ required: true, message: '请选择所属店铺', trigger: 'change' }],
  name: [{ required: true, message: '请输入门店名称', trigger: 'blur' }]
}

const filteredShops = computed(() => {
  if (!searchForm.merchantId) return []
  return shops.value.filter(shop => shop.merchantId === searchForm.merchantId)
})

const merchantShops = computed(() => {
  if (!selectedMerchantId.value) return []
  // 使用弹窗专用的店铺列表进行精确过滤
  return dialogShops.value.filter(shop => shop.merchantId === selectedMerchantId.value)
})

const loadMerchants = async () => {
  try {
    const data = await merchantApi.getMerchants()
    // request 拦截器已经解包了响应，直接使用返回的数据
    merchants.value = data || []
  } catch (error: any) {
    ElMessage.error(error.message || '加载商家失败')
  }
}

const loadShops = async () => {
  try {
    const data = await shopApi.getShops()
    // request 拦截器已经解包了响应，直接使用返回的数据
    shops.value = data || []
  } catch (error: any) {
    ElMessage.error(error.message || '加载店铺失败')
  }
}

const loadStores = async () => {
  loading.value = true
  try {
    const data = await storeApi.getStores(searchForm.shopId)
    // request 拦截器已经解包了响应，直接使用返回的数据
    stores.value = data || []
    if (searchForm.name) {
      stores.value = stores.value.filter(store =>
        store.name.includes(searchForm.name)
      )
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const onMerchantChange = () => {
  searchForm.shopId = undefined
}

const onMerchantSelectChange = async () => {
  storeForm.shopId = undefined
  // 当选择商家后，精确加载该商家的店铺数据到弹窗专用列表
  if (selectedMerchantId.value) {
    await loadDialogShopsByMerchant(selectedMerchantId.value)
  }
  // 清除商家字段的验证错误
  storeFormRef.value?.clearValidate(['merchantId'])
}

const onShopSelectChange = () => {
  // 选择店铺后，清除商家和店铺的验证错误
  storeFormRef.value?.clearValidate(['merchantId', 'shopId'])
}

// 根据商家ID加载弹窗专用的店铺数据（精确加载，不影响全局shops）
const loadDialogShopsByMerchant = async (merchantId: number) => {
  try {
    const data = await shopApi.getShops(merchantId)
    dialogShops.value = data || []
  } catch (error: any) {
    ElMessage.error(error.message || '加载店铺失败')
  }
}

const resetSearch = () => {
  searchForm.merchantId = undefined
  searchForm.shopId = undefined
  searchForm.name = ''
  loadStores()
}

const editStore = async (store: Store) => {
  resetForm()
  editingStore.value = store

  // 基于 shopId 精确加载所属商家的店铺数据
  // 注意：store.shopId 是所属店铺的 ID，需要通过该店铺找到对应的 merchantId
  const targetShop = shops.value.find(s => s.id === store.shopId)
  const merchantId = targetShop?.merchantId || store.shopId

  selectedMerchantId.value = merchantId

  // 精确加载该商家的店铺数据到弹窗专用列表
  await loadDialogShopsByMerchant(merchantId)

  Object.assign(storeForm, {
    merchantId: merchantId,
    shopId: store.shopId,
    name: store.name,
    address: store.address,
    phone: store.phone,
    remark: store.remark
  })
  showCreateDialog.value = true
}

const deleteStore = (store: Store) => {
  ElMessageBox.confirm(
    `确定要删除门店"${store.name}"吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await storeApi.deleteStore(store.id)
      ElMessage.success('删除成功')
      loadStores()
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败')
    }
  })
}

const submitStore = async () => {
  if (!storeFormRef.value) return

  try {
    await storeFormRef.value.validate()
    submitting.value = true

    // 基于 selectedMerchantId 和 shopId 精确提交数据
    const submitData = {
      name: storeForm.name,
      address: storeForm.address,
      phone: storeForm.phone,
      remark: storeForm.remark,
      shopId: storeForm.shopId,
      // 使用弹窗中选择的商家 ID，确保数据准确关联
      merchantId: selectedMerchantId.value!
    }

    if (editingStore.value) {
      await storeApi.updateStore(editingStore.value.id, submitData)
      ElMessage.success('更新成功')
    } else {
      await storeApi.createStore(submitData)
      ElMessage.success('创建成功')
    }

    showCreateDialog.value = false
    editingStore.value = null
    selectedMerchantId.value = undefined
    dialogShops.value = [] // 清空弹窗专用店铺列表
    Object.assign(storeForm, {
      merchantId: undefined,
      shopId: undefined,
      name: '',
      address: '',
      phone: '',
      remark: ''
    })
    loadStores()
    // 重新加载所有店铺数据
    await loadShops()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const resetForm = () => {
  Object.assign(storeForm, {
    merchantId: undefined,
    shopId: undefined,
    name: '',
    address: '',
    phone: '',
    remark: ''
  })
  editingStore.value = null
  selectedMerchantId.value = undefined
  storeFormRef.value?.clearValidate()
}

const handleOpenCreateDialog = () => {
  resetForm()
  // 清空弹窗专用店铺列表，确保新增时从空白状态开始
  dialogShops.value = []
  showCreateDialog.value = true
}

const handleCloseDialog = () => {
  resetForm()
  showCreateDialog.value = false
}

onMounted(() => {
  loadMerchants()
  loadShops()
  loadStores()
})
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
</style>
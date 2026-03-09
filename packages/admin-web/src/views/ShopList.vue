<template>
  <div>
    <div class="table-header">
      <h1 class="page-title">店铺管理</h1>
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        新增店铺
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
          >
            <el-option
              v-for="merchant in merchants"
              :key="merchant.id"
              :label="merchant.name"
              :value="merchant.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入店铺名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadShops">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="shops"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="店铺名称" min-width="120" />
        <el-table-column prop="merchant.name" label="所属商家" min-width="120" />
        <el-table-column prop="description" label="店铺简介" min-width="150" />
        <el-table-column prop="createdAt" label="创建时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editShop(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteShop(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingShop ? '编辑店铺' : '新增店铺'"
      width="600px"
    >
      <el-form
        ref="shopFormRef"
        :model="shopForm"
        :rules="shopRules"
        label-width="100px"
      >
        <el-form-item label="所属商家" prop="merchantId">
          <el-select
            v-model="shopForm.merchantId"
            placeholder="请选择商家"
            style="width: 100%"
          >
            <el-option
              v-for="merchant in merchants"
              :key="merchant.id"
              :label="merchant.name"
              :value="merchant.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="shopForm.name" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="店铺简介" prop="description">
          <el-input
            v-model="shopForm.description"
            type="textarea"
            placeholder="请输入店铺简介"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitShop">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { shopApi } from '@/api/shop'
import { merchantApi } from '@/api/merchant'
import type { Shop, Merchant } from '@/types'

const loading = ref(false)
const submitting = ref(false)
const shops = ref<Shop[]>([])
const merchants = ref<Merchant[]>([])
const showCreateDialog = ref(false)
const editingShop = ref<Shop | null>(null)

const shopFormRef = ref<FormInstance>()

const searchForm = reactive({
  merchantId: undefined as number | undefined,
  name: ''
})

const shopForm = reactive({
  merchantId: undefined as number | undefined,
  name: '',
  description: ''
})

const shopRules: FormRules = {
  merchantId: [{ required: true, message: '请选择所属商家', trigger: 'change' }],
  name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }]
}

const loadMerchants = async () => {
  try {
    merchants.value = await merchantApi.getMerchants()
  } catch (error: any) {
    ElMessage.error(error.message || '加载商家失败')
  }
}

const loadShops = async () => {
  loading.value = true
  try {
    shops.value = await shopApi.getShops(searchForm.merchantId)
    if (searchForm.name) {
      shops.value = shops.value.filter(shop => 
        shop.name.includes(searchForm.name)
      )
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.merchantId = undefined
  searchForm.name = ''
  loadShops()
}

const editShop = (shop: Shop) => {
  editingShop.value = shop
  Object.assign(shopForm, shop)
  showCreateDialog.value = true
}

const deleteShop = (shop: Shop) => {
  ElMessageBox.confirm(
    `确定要删除店铺"${shop.name}"吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await shopApi.deleteShop(shop.id)
      ElMessage.success('删除成功')
      loadShops()
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败')
    }
  })
}

const submitShop = async () => {
  if (!shopFormRef.value) return
  
  try {
    await shopFormRef.value.validate()
    submitting.value = true
    
    if (editingShop.value) {
      await shopApi.updateShop(editingShop.value.id, shopForm)
      ElMessage.success('更新成功')
    } else {
      await shopApi.createShop(shopForm)
      ElMessage.success('创建成功')
    }
    
    showCreateDialog.value = false
    editingShop.value = null
    Object.assign(shopForm, {
      merchantId: undefined,
      name: '',
      description: ''
    })
    loadShops()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

onMounted(() => {
  loadMerchants()
  loadShops()
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
<template>
  <div>
    <div class="table-header">
      <h1 class="page-title">商家管理</h1>
      <el-button type="primary" @click="handleOpenCreateDialog">
        <el-icon><Plus /></el-icon>
        新增商家
      </el-button>
    </div>

    <!-- 搜索表单 -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="商家名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入商家名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadMerchants">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="merchants"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商家名称" min-width="150" />
        <el-table-column prop="phone" label="商家电话" min-width="130" />
        <el-table-column prop="loginAccount" label="登录账号" min-width="120" />
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editMerchant(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteMerchant(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingMerchant ? '编辑商家' : '新增商家'"
      width="600px"
    >
      <el-form
        ref="merchantFormRef"
        :model="merchantForm"
        :rules="merchantRules"
        label-width="100px"
      >
        <el-form-item label="商家名称" prop="name">
          <el-input v-model="merchantForm.name" placeholder="请输入商家名称" />
        </el-form-item>
        <el-form-item label="商家电话" prop="phone">
          <el-input v-model="merchantForm.phone" placeholder="请输入商家电话" />
        </el-form-item>
        <el-form-item label="登录账号" prop="loginAccount">
          <el-input
            v-model="merchantForm.loginAccount"
            placeholder="请输入登录账号"
            :disabled="!!editingMerchant"
          />
        </el-form-item>
        <el-form-item label="密码" prop="passwordHash" v-if="!editingMerchant">
          <el-input
            v-model="merchantForm.passwordHash"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="merchantForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitMerchant">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { merchantApi } from '@/api/merchant'
import type { Merchant } from '@/types'

const loading = ref(false)
const submitting = ref(false)
const merchants = ref<Merchant[]>([])
const showCreateDialog = ref(false)
const editingMerchant = ref<Merchant | null>(null)

const merchantFormRef = ref<FormInstance>()

const searchForm = reactive({
  name: ''
})

const merchantForm = reactive({
  name: '',
  phone: '',
  loginAccount: '',
  passwordHash: '',
  remark: ''
})

const merchantRules: FormRules = {
  name: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
  loginAccount: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
  passwordHash: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const resetForm = () => {
  editingMerchant.value = null
  Object.assign(merchantForm, {
    name: '',
    phone: '',
    loginAccount: '',
    passwordHash: '',
    remark: ''
  })
  if (merchantFormRef.value) {
    merchantFormRef.value.clearValidate()
  }
}

const handleOpenCreateDialog = () => {
  resetForm()
  showCreateDialog.value = true
}

const handleCloseDialog = () => {
  showCreateDialog.value = false
}

const loadMerchants = async () => {
  loading.value = true
  try {
    const data = await merchantApi.getMerchants()
    merchants.value = data || []
    if (searchForm.name) {
      merchants.value = merchants.value.filter(m =>
        m.name.includes(searchForm.name)
      )
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.name = ''
  loadMerchants()
}

const editMerchant = (merchant: Merchant) => {
  resetForm()
  editingMerchant.value = merchant
  Object.assign(merchantForm, {
    name: merchant.name,
    phone: merchant.phone || '',
    loginAccount: merchant.loginAccount,
    passwordHash: '',
    remark: merchant.remark || ''
  })
  showCreateDialog.value = true
}

const deleteMerchant = (merchant: Merchant) => {
  ElMessageBox.confirm(
    `确定要删除商家"${merchant.name}"吗？此操作将同时删除该商家下的所有店铺、门店和用户数据，不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await merchantApi.deleteMerchant(merchant.id)
      ElMessage.success('删除成功')
      loadMerchants()
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败')
    }
  })
}

const submitMerchant = async () => {
  if (!merchantFormRef.value) return
  
  try {
    await merchantFormRef.value.validate()
    submitting.value = true
    
    const submitData = {
      ...merchantForm,
      passwordHash: merchantForm.passwordHash || undefined
    }
    
    if (editingMerchant.value) {
      await merchantApi.updateMerchant(editingMerchant.value.id, submitData)
      ElMessage.success('更新成功')
    } else {
      await merchantApi.createMerchant(submitData)
      ElMessage.success('创建成功')
    }
    
    showCreateDialog.value = false
    resetForm()
    loadMerchants()
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
})
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}
</style>

<template>
  <div>
    <div class="table-header">
      <h1 class="page-title">商家用户管理</h1>
      <el-button type="primary" @click="handleOpenCreateDialog">
        <el-icon><Plus /></el-icon>
        新增用户
      </el-button>
    </div>

    <!-- 搜索表单 -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名/姓名">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入用户名或姓名"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadMerchantUsers">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="merchantUsers"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="merchant.name" label="所属商家" min-width="120" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="realName" label="真实姓名" min-width="120" />
        <el-table-column prop="role" label="角色" min-width="100">
          <template #default="{ row }">
            {{ getRoleText(row.role) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editMerchantUser(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteMerchantUser(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingMerchantUser ? '编辑用户' : '新增用户'"
      width="600px"
    >
      <el-form
        ref="merchantUserFormRef"
        :model="merchantUserForm"
        :rules="merchantUserRules"
        label-width="100px"
      >
        <el-form-item label="所属商家" prop="merchantId">
          <el-select
            v-model="merchantUserForm.merchantId"
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
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="merchantUserForm.username"
            placeholder="请输入用户名"
            :disabled="!!editingMerchantUser"
          />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="merchantUserForm.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select
            v-model="merchantUserForm.role"
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option label="店主" value="owner" />
            <el-option label="经理" value="manager" />
            <el-option label="员工" value="staff" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="passwordHash" v-if="!editingMerchantUser">
          <el-input
            v-model="merchantUserForm.passwordHash"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="merchantUserForm.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitMerchantUser">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { merchantUserApi } from '@/api/merchant-user'
import { merchantApi } from '@/api/merchant'
import type { MerchantUser, Merchant } from '@/types'

const loading = ref(false)
const submitting = ref(false)
const merchantUsers = ref<MerchantUser[]>([])
const merchants = ref<Merchant[]>([])
const showCreateDialog = ref(false)
const editingMerchantUser = ref<MerchantUser | null>(null)

const merchantUserFormRef = ref<FormInstance>()

const searchForm = reactive({
  name: ''
})

const merchantUserForm = reactive({
  merchantId: undefined as number | undefined,
  username: '',
  realName: '',
  passwordHash: '',
  role: 'owner' as 'owner' | 'manager' | 'staff',
  status: 1
})

const merchantUserRules: FormRules = {
  merchantId: [{ required: true, message: '请选择所属商家', trigger: 'change' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  passwordHash: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const resetForm = () => {
  editingMerchantUser.value = null
  Object.assign(merchantUserForm, {
    merchantId: undefined,
    username: '',
    realName: '',
    passwordHash: '',
    role: 'owner',
    status: 1
  })
  if (merchantUserFormRef.value) {
    merchantUserFormRef.value.clearValidate()
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
  try {
    const data = await merchantApi.getMerchants()
    merchants.value = data || []
  } catch (error: any) {
    ElMessage.error(error.message || '加载商家失败')
  }
}

const loadMerchantUsers = async () => {
  loading.value = true
  try {
    const data = await merchantUserApi.getMerchantUsers()
    merchantUsers.value = data || []
    if (searchForm.name) {
      merchantUsers.value = merchantUsers.value.filter(user =>
        user.realName?.includes(searchForm.name) || user.username.includes(searchForm.name)
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
  loadMerchantUsers()
}

const getRoleText = (role: string) => {
  const roleMap: Record<string, string> = {
    owner: '店主',
    manager: '经理',
    staff: '员工'
  }
  return roleMap[role] || role
}

const getStatusText = (status: number) => {
  return status === 1 ? '正常' : '禁用'
}

const getStatusType = (status: number) => {
  return status === 1 ? 'success' : 'danger'
}

const editMerchantUser = (merchantUser: MerchantUser) => {
  resetForm()
  editingMerchantUser.value = merchantUser
  Object.assign(merchantUserForm, {
    merchantId: merchantUser.merchantId,
    username: merchantUser.username,
    realName: merchantUser.realName || '',
    passwordHash: '',
    role: merchantUser.role,
    status: merchantUser.status
  })
  showCreateDialog.value = true
}

const deleteMerchantUser = (merchantUser: MerchantUser) => {
  ElMessageBox.confirm(
    `确定要删除用户"${merchantUser.realName || merchantUser.username}"吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await merchantUserApi.deleteMerchantUser(merchantUser.id)
      ElMessage.success('删除成功')
      loadMerchantUsers()
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败')
    }
  })
}

const submitMerchantUser = async () => {
  if (!merchantUserFormRef.value) return
  
  try {
    await merchantUserFormRef.value.validate()
    submitting.value = true
    
    const submitData = {
      ...merchantUserForm,
      passwordHash: merchantUserForm.passwordHash || undefined
    }
    
    if (editingMerchantUser.value) {
      await merchantUserApi.updateMerchantUser(editingMerchantUser.value.id, submitData)
      ElMessage.success('更新成功')
    } else {
      await merchantUserApi.createMerchantUser(submitData)
      ElMessage.success('创建成功')
    }
    
    showCreateDialog.value = false
    resetForm()
    loadMerchantUsers()
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
  loadMerchantUsers()
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
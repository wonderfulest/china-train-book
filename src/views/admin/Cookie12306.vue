<template>
  <div class="cookie-management">
    <el-card class="cookie-card">
      <template #header>
        <div class="card-header">
          <span>12306 Cookie 管理</span>
          <el-button type="primary" @click="loadCookies">
            <el-icon><Refresh /></el-icon> 刷新列表
          </el-button>
        </div>
      </template>

      <div class="update-section">
        <h3>添加新 Cookie</h3>
        <el-form :model="form" ref="formRef" :rules="rules">
          <el-form-item prop="label">
            <el-input
              v-model="form.label"
              placeholder="输入标签名称 (例如: user1)"
            />
          </el-form-item>
          <el-form-item prop="cookie">
            <el-input
              v-model="form.cookie"
              type="textarea"
              :rows="4"
              placeholder="粘贴 12306 cookie 内容"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createCookieHandler" :loading="creating">
              添加 Cookie
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="cookie-list">
        <h3>Cookie 列表</h3>
        <el-table :data="cookies" style="width: 100%" border>
          <el-table-column prop="label" label="标签" width="120" />
          <el-table-column prop="callCount" label="调用次数" width="100" align="center" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.expired ? 'danger' : 'success'">
                {{ row.expired ? '已过期' : '有效' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" align="center">
            <template #default="{ row }">
              {{ formatDateTime(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" label="更新时间" align="center">
            <template #default="{ row }">
              {{ formatDateTime(row.updatedAt) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-button
                link
                type="primary"
                @click="editCookie(row)"
              >
                编辑
              </el-button>
              <el-button
                link
                type="primary"
                @click="() => form.cookie = row.cookieValue"
              >
                使用
              </el-button>
              <el-button
                link
                type="danger"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="instructions">
        <h3>使用说明</h3>
        <ol>
          <li>登录 <a href="https://www.12306.cn" target="_blank">12306.cn</a></li>
          <li>打开浏览器开发者工具 (F12) 并切换到网络 (Network) 标签页</li>
          <li>找到任意一个发送到 12306.cn 的请求，复制其 Cookie 头部信息</li>
          <li>在上方表单中输入标签名称并粘贴 cookie 内容</li>
          <li>点击“添加 Cookie”保存</li>
        </ol>
      </div>
    </el-card>

    <!-- Edit Cookie Dialog -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑 Cookie"
      width="50%"
    >
      <el-form :model="editForm" ref="editFormRef" :rules="rules">
        <el-form-item prop="label">
          <el-input
            v-model="editForm.label"
            placeholder="输入标签名称"
          />
        </el-form-item>
        <el-form-item prop="cookie">
          <el-input
            v-model="editForm.cookie"
            type="textarea"
            :rows="4"
            placeholder="粘贴 12306 cookie 内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateCookie" :loading="updating">
            更新
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Cookie12306">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { createCookie, updateCookie as updateCookieApi, deleteCookie, getCookies } from '@/api/modules/admin'

const formRef = ref(null)
const editFormRef = ref(null)
const cookies = ref([])
const creating = ref(false)
const updating = ref(false)
const editDialogVisible = ref(false)

const form = ref({
  label: '',
  cookie: ''
})

const editForm = ref({
  id: null,
  label: '',
  cookie: ''
})

const rules = {
  label: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
  cookie: [{ required: true, message: '请输入 cookie 内容', trigger: 'blur' }]
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const loadCookies = async () => {
  try {
    const response = await getCookies()
    if (response.code === '0') {
      cookies.value = response.data
    } else {
      ElMessage.error(response.message || '加载 Cookie 列表失败')
    }
  } catch (error) {
    console.error('Error loading cookies:', error)
    ElMessage.error('Failed to load cookies')
  }
}

const createCookieHandler = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      creating.value = true
      try {
        const response = await createCookie(form.value.cookie, form.value.label)
        if (response.code === '0') {
          ElMessage.success('Cookie 添加成功！')
          form.value.cookie = ''
          form.value.label = ''
          await loadCookies()
        } else {
          ElMessage.error(response.message || '添加 Cookie 失败')
        }
      } catch (error) {
        console.error('添加 Cookie 出错:', error)
        ElMessage.error('添加 Cookie 失败')
      } finally {
        creating.value = false
      }
    }
  })
}

const editCookie = (row) => {
  editForm.value = {
    id: row.id,
    label: row.label,
    cookie: row.cookieValue
  }
  editDialogVisible.value = true
}

const updateCookie = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      updating.value = true
      try {
        const response = await updateCookieApi(
          editForm.value.id,
          editForm.value.cookie,
          editForm.value.label
        )
        if (response.code === '0') {
          ElMessage.success('Cookie 更新成功！')
          editDialogVisible.value = false
          await loadCookies()
        } else {
          ElMessage.error(response.message || '更新 Cookie 失败')
        }
      } catch (error) {
        console.error('更新 Cookie 出错:', error)
        ElMessage.error('更新 Cookie 失败')
      } finally {
        updating.value = false
      }
    }
  })
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个 Cookie 吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const response = await deleteCookie(row.id)
    if (response.code === '0') {
      ElMessage.success('Cookie 删除成功')
      await loadCookies()
    } else {
      ElMessage.error(response.message || '删除 Cookie 失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除 Cookie 出错:', error)
      ElMessage.error('删除 Cookie 失败')
    }
  }
}

onMounted(() => {
  loadCookies()
})
</script>

<style scoped>
.cookie-management {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
}

.cookie-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.update-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.update-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #303133;
  font-size: 18px;
}

.cookie-list {
  margin-bottom: 30px;
}

.cookie-list h3 {
  margin-bottom: 20px;
  color: #303133;
  font-size: 18px;
}

.instructions {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.instructions h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #303133;
  font-size: 18px;
}

.instructions ol {
  padding-left: 20px;
  margin: 0;
  line-height: 1.8;
  color: #606266;
}

.instructions a {
  color: #409eff;
  text-decoration: none;
}

.instructions a:hover {
  color: #79bbff;
}

:deep(.el-form-item__content) {
  line-height: 32px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #303133;
  font-weight: 600;
}

:deep(.el-dialog) {
  border-radius: 8px;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px;
  border-bottom: 1px solid #dcdfe6;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  margin: 0;
  padding: 20px;
  border-top: 1px solid #dcdfe6;
}
</style>

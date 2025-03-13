<template>
  <div class="order-list-container">
    <div class="page-header">
      <h1>我的订单</h1>
    </div>

    <el-card class="order-list-card" shadow="hover">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>
      
      <div v-else-if="orders.length === 0" class="empty-orders">
        <el-empty description="暂无订单记录" />
        <el-button type="primary" @click="goToHome">立即预订</el-button>
      </div>
      
      <div v-else>
        <el-table :data="orders" style="width: 100%" border>
          <el-table-column label="订单号" prop="orderId" width="180" />
          <el-table-column label="出发站" prop="from" />
          <el-table-column label="到达站" prop="to" />
          <el-table-column label="出发日期" prop="date" />
          <el-table-column label="车次" prop="trainNo" width="100" />
          <el-table-column label="座位类型" prop="seatType" width="120" />
          <el-table-column label="价格" prop="price" width="100">
            <template #default="scope">
              <span>¥{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button 
                v-if="scope.row.status === 'unpaid'" 
                type="primary" 
                size="small" 
                @click="goToPayment(scope.row)"
              >
                去支付
              </el-button>
              <el-button 
                type="info" 
                size="small" 
                @click="viewOrderDetail(scope.row)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrders } from '@/api/modules/orders'

const router = useRouter()
const loading = ref(true)
const orders = ref([])

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    // 这里应该调用实际的API获取订单列表
    // 目前使用模拟数据
    const response = await getOrders()
    orders.value = response.data || []
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败，请稍后重试')
    orders.value = []
  } finally {
    loading.value = false
  }
}

// 获取状态标签类型
const getStatusType = (status) => {
  const statusMap = {
    'unpaid': 'warning',
    'paid': 'success',
    'completed': 'success',
    'cancelled': 'info',
    'refunding': 'warning',
    'refunded': 'info'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'unpaid': '待支付',
    'paid': '已支付',
    'completed': '已完成',
    'cancelled': '已取消',
    'refunding': '退款中',
    'refunded': '已退款'
  }
  return statusMap[status] || '未知状态'
}

// 跳转到支付页面
const goToPayment = (order) => {
  router.push(`/trains/pay?orderId=${order.orderId}`)
}

// 查看订单详情
const viewOrderDetail = (order) => {
  // 这里可以跳转到订单详情页或者显示一个对话框
  ElMessage.info('查看订单详情功能开发中...')
}

// 跳转到首页
const goToHome = () => {
  router.push('/')
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.order-list-card {
  margin-bottom: 20px;
}

.loading-container {
  padding: 20px;
}

.empty-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.empty-orders .el-button {
  margin-top: 20px;
}
</style>

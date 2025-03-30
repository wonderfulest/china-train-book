<template>
  <div class="faq-container">
    <h1 class="faq-title">常见问题</h1>
    
    <!-- 购票流程 -->
    <div class="faq-section">
      <h2>购票相关</h2>
      <el-collapse>
        <el-collapse-item title="如何购买火车票？" name="1">
          <p>购票流程非常简单：</p>
          <ol>
            <li>在首页输入出发地、目的地和日期</li>
            <li>选择合适的车次和座位类型</li>
            <li>填写乘客信息（姓名、证件类型、证件号码等）</li>
            <li>确认订单信息</li>
            <li>选择支付方式完成支付</li>
            <li>支付成功后可查看订单详情和下载电子车票</li>
          </ol>
        </el-collapse-item>

        <el-collapse-item title="可以提前多久购票？" name="2">
          <p>您可以在出发日期前30天开始购票。建议您尽早购票，以确保有更多的座位选择。</p>
        </el-collapse-item>

        <el-collapse-item title="支持哪些支付方式？" name="3">
          <p>目前支持以下支付方式：</p>
          <ul>
            <li>PayPal支付</li>
            <li>信用卡支付</li>
            <li>借记卡支付</li>
          </ul>
        </el-collapse-item>

        <el-collapse-item title="订单支付成功后多久可以取票？" name="4">
          <p>支付成功后，系统会立即生成电子车票，您可以：</p>
          <ul>
            <li>直接使用电子车票乘车（需要出示订单信息和有效证件）</li>
            <li>在火车站自助取票机上打印纸质车票</li>
            <li>在火车站售票窗口打印纸质车票</li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 退票政策 -->
    <div class="faq-section">
      <h2>退票相关</h2>
      <el-collapse>
        <el-collapse-item title="如何申请退票？" name="5">
          <p>退票步骤：</p>
          <ol>
            <li>登录账号，进入"我的订单"</li>
            <li>找到需要退票的订单，点击"申请退票"</li>
            <li>确认退票信息</li>
            <li>等待退款处理（一般1-7个工作日内完成）</li>
          </ol>
        </el-collapse-item>

        <el-collapse-item title="退票收费标准是怎样的？" name="6">
          <p>退票手续费根据距离发车时间收取：</p>
          <ul>
            <li>发车前15天（含）以上：全额退款</li>
            <li>发车前48小时至15天：收取票价5%的手续费</li>
            <li>发车前24小时至48小时：收取票价10%的手续费</li>
            <li>发车前24小时以内：收取票价20%的手续费</li>
          </ul>
        </el-collapse-item>

        <el-collapse-item title="退款多久能到账？" name="7">
          <p>退款时间取决于您的支付方式：</p>
          <ul>
            <li>PayPal：1-3个工作日</li>
            <li>信用卡：3-7个工作日</li>
            <li>借记卡：3-5个工作日</li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 改签政策 -->
    <div class="faq-section">
      <h2>改签相关</h2>
      <el-collapse>
        <el-collapse-item title="如何办理改签？" name="8">
          <p>改签步骤：</p>
          <ol>
            <li>登录账号，进入"我的订单"</li>
            <li>找到需要改签的订单，点击"申请改签"</li>
            <li>选择新的车次和座位</li>
            <li>支付差价（如有）</li>
            <li>完成改签</li>
          </ol>
        </el-collapse-item>

        <el-collapse-item title="改签有什么限制？" name="9">
          <p>改签需要注意以下几点：</p>
          <ul>
            <li>只能改签同一出发地和目的地的车次</li>
            <li>改签后的车票价格高于原车票需补差价</li>
            <li>改签后的车票价格低于原车票将退还差价</li>
            <li>每张车票限改签一次</li>
            <li>发车前2小时内不能在线改签</li>
          </ul>
        </el-collapse-item>

        <el-collapse-item title="改签收费标准是怎样的？" name="10">
          <p>改签费用说明：</p>
          <ul>
            <li>发车前48小时以上：免收改签手续费</li>
            <li>发车前24-48小时：收取改签手续费20元/张</li>
            <li>发车前24小时以内：收取改签手续费30元/张</li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 其他问题 -->
    <div class="faq-section">
      <h2>其他问题</h2>
      <el-collapse>
        <el-collapse-item title="如何查看订单状态？" name="11">
          <p>查看订单方式：</p>
          <ol>
            <li>登录账号后点击"我的订单"</li>
            <li>可查看所有订单的状态，包括：待支付、已支付、已完成、已退票等</li>
            <li>点击具体订单可查看详细信息</li>
          </ol>
        </el-collapse-item>

        <el-collapse-item title="忘记取票怎么办？" name="12">
          <p>如果您忘记取票，可以：</p>
          <ul>
            <li>使用电子车票直接乘车（需要出示订单信息和有效证件）</li>
            <li>在火车站自助取票机上重新打印</li>
            <li>在火车站售票窗口寻求帮助</li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style scoped>
.faq-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.faq-title {
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 32px;
}

.faq-section {
  margin-bottom: 40px;
}

.faq-section h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  border-bottom: 2px solid var(--button-color, #f39c12);
  padding-bottom: 10px;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  font-size: 18px;
  color: #666;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2px;
}

:deep(.el-collapse-item__content) {
  padding: 20px;
  color: #666;
  line-height: 1.6;
}

:deep(.el-collapse-item__wrap) {
  border: none;
}

ul, ol {
  padding-left: 20px;
  margin: 10px 0;
}

li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .faq-container {
    padding: 10px;
  }

  .faq-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .faq-section h2 {
    font-size: 20px;
  }

  :deep(.el-collapse-item__header) {
    font-size: 16px;
    padding: 15px;
  }

  :deep(.el-collapse-item__content) {
    padding: 15px;
  }
}
</style> 
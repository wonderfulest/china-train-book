<template>
  <el-container class="layout-container">
    <TheHeader />

    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>

    <TheFooter />
  </el-container>
</template>

<script setup>
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<style scoped>
#app {
  width: 100%;
  min-width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.layout-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.el-main {
  margin-top: 64px;
  flex: 1;
  padding: 0;
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .el-main {
    margin-top: 60px;
  }
}
</style>
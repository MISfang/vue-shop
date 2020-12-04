<template>
  <div id="app">
    <!-- 路由站位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
#nprogress .bar {
  background: linear-gradient(to right, #2980b9, #2c3e50) !important;
}
</style>

<template>
  <div>
    <h1>这是主页</h1>
    <el-button type="danger" round @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="stylus" scoped></style>>

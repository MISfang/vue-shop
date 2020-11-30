<template>
  <el-container class="home_container">
    <!-- 这个是头部区域 -->
    <el-header>
      <div>
        <img src="..\assets\heima.png" alt="" />
        <span>vue实战后台管理系统</span>
      </div>
      <el-button type="info" round @click="logout">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左边侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 这是菜单最上方的折叠与展开按钮 -->
        <div class="toggle-button" @click="toggleChange">
          <i class="el-icon-s-home"></i>
        </div>
        <!-- 下面是菜单具体代码 -->
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#323744"
          text-color="#fff"
          active-text-color="#369bff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
          router
        >
          <!-- 单独的菜单 -->
          <!-- 一级带上二级的菜单模板 -->
          <el-submenu
            v-for="item in menulist"
            :key="item.id"
            :index="item.id + ''"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 这是二级菜单 -->
            <!-- 在menu开启了router属性后，会以index开启路由连接跳转 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <i class="el-icon-star-on"></i>
              {{ subItem.authName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <!-- 在这里加一个欢迎界面 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: {},
      iconsObj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-help",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-data"
      },
      isCollapse: false,
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取菜单数据的方法
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
    },
    // 菜单页面的折叠与展开功能
    toggleChange() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse == false) {
      }
      this.toggleIcon = "el-icon-s-unfold";
    },
    // 解决链接激活状态的方法
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }
  }
};
</script>

<style lang="less" scoped>
.el-header {
  z-index: 2;
  background-color: #373c41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
  box-shadow: 0 0px 20px 10px rgba(0, 0, 0, 0.4);

  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  z-index: 2;
  background-color: #323744;
  box-shadow: 4px 20px 20px 10px rgba(0, 0, 0, 0.4);
}
.el-main {
  background-color: #eaedf2;
}
.home_container {
  height: 100%;
}
.el-menu {
  border-right: 0;
}
.toggle-button {
  background-color: #485164;
  font-size: 20px;
  line-height: 32px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

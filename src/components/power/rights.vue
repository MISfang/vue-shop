<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-table
        :data="rightslist"
        border
        stripe
        highlight-current-row
        @current-change="handleCurrentChange"
        height="500"
      >
        <el-table-column type="index" width="100" label="索引值">
        </el-table-column>
        <el-table-column label="权限名称" prop="authName" width="420">
        </el-table-column>
        <el-table-column label="路径" prop="path" width="420">
        </el-table-column>
        <el-table-column label="权限等级" prop="level" width="296">
          <!-- 通过自定义插槽的方式来定义渲染的内容 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightslist: []
    };
  },
  created() {
    // 页面一创建就执行该函数
    this.getRightsList();
  },
  methods: {
    // 选中单行的方法
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败！");
      }
      this.rightslist = res.data;
      console.log(this.rightslist);
    }
  }
};
</script>

<style lang="less" scoped>
.el-table td,
.el-table th {
  text-align: center !important;
}
</style>

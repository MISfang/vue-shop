<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 下面的卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 左边的输入框 -->
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 右边的按钮 -->
        <el-col :span="6">
          <el-button type="primary" round @click="goAddPage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 上方功能区结束 -->
      <!-- 下方表格区 -->
      <el-table :data="goodList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格"
          prop="goods_price"
          width="80"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="goods_number"
          width="80"
        ></el-table-column>
        <el-table-column
          label="重量"
          prop="goods_weight"
          width="80"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="100px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="相关操作" width="112px">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="goodsDelete(scope.row.goods_id)"
                circle
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 下面的分页区域 -->
      <div class="block">
        <div class="daoHang">
          <el-pagination
            @size-change="cateHandleSizeChange"
            @current-change="cateHandleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 30]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  // 数据
  data() {
    return {
      // 输入框输入的内容
      inputText: "",
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },

      // 从后台获取的商品列表对应的参数
      goodList: [],
      // 商品总数量
      total: 0
    };
  },
  // 生命周期函数，随着页面创建被调用
  created() {
    this.getGoodsList();
  },
  // 事件处理函数
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败了！");
      }
      this.goodList = res.data.goods;
      this.total = res.data.total;
    },
    // -------------------------------------
    // 分页区域对应的处理函数
    cateHandleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    cateHandleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    // -----------------------------------------------
    // 删除商品对应的方法
    async goodsDelete(goods_id) {
      const confirmResult = await this.$confirm("是否确定删除改商品", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除！");
      }
      if (confirmResult == "confirm") {
        const { data: res } = await this.$http.delete(
          //   "roles/" + role.id + "rights/" + rightId
          `goods/${goods_id}`
        );
        if (res.meta.status !== 200) {
          return this.$message.error("删除商品失败！");
        }
        this.$message.success("删除商品成功！");
        this.getGoodsList();
      }
    },
    // ---------------------------------------
    // 点击添加商品对应的方法
    goAddPage() {
      this.$router.push("/goods/add");
    }
  }
};
</script>

<style lang="less" scoped>
.daoHang {
  margin: 0 auto;
  width: 700px;
  margin-top: 12px;
  margin-bottom: -10px;
}
</style>

<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
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
          <el-button type="primary" round>添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 上方功能区结束 -->

      <!-- 下方的订单列表区域 -->
      <el-table :data="orderList" border stripe>
        <!-- 最左边的索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 右边的列 -->
        <el-table-column
          label="订单编号"
          prop="order_number"
          width="400"
        ></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="160"
        ></el-table-column>
        <el-table-column label="是否已付款" prop="pay_status" width="100">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status == '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="120"
        ></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="240">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              circle
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 最下方的分页功能 -->
      <!-- 下面的分页区域 -->
      <div class="block">
        <div class="daoHang">
          <el-pagination
            @size-change="cateHandleSizeChange"
            @current-change="cateHandleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background
          >
          </el-pagination>
        </div>
      </div>

      <!-- ------------------------------------------------------- -->
      <!-- 点击修改地址弹出的对话框 -->
      <el-dialog
        title="修改收获地址"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addressDialogClose"
      >
        <!-- 弹出框的主题内容 -->
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address01">
            <!-- 级联选择器 -->
            <el-cascader
              :options="cityData"
              v-model="addressForm.address01"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address02">
            <el-input v-model="addressForm.address02"></el-input>
          </el-form-item>
        </el-form>
        <!-- 主题内容结束 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- --------------------------------------------------- -->
      <!-- 点击查看物流进度的弹框 -->
      <el-dialog
        title="物流进度"
        :visible.sync="progressDialogVisible"
        width="50%"
      >
        <!-- 弹出框的主题内容 -->
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
        <!-- 主题内容结束 -->
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 导入对应的地县市js包
import cityData from "./citydata.js";

export default {
  data() {
    return {
      // 请求体数据
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      //   总的订单条数
      total: 0,
      orderList: [],

      //   ---------------------------------------------
      // 弹出的对话框的参数
      //   控制显示与隐藏的参数
      dialogVisible: false,

      // ----------------------------------------------------
      // 修改地址的数据
      addressForm: {
        address01: [],
        address02: ""
      },
      //   修改数据表单的验证规则
      addressFormRules: {
        address01: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        address02: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },

      //   导进来的市地县数据包
      cityData,

      //   --------------------------------------------
      // 物流进度的弹框
      progressDialogVisible: false,

      //   物流表单数据
      progressInfo: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: ""
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: ""
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: ""
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: ""
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: ""
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: ""
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: ""
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: ""
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: ""
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: ""
        }
      ]
    };
  },
  created() {
    this.getOrderList();
  },
  computed: {},
  methods: {
    //   获取订单列表的方法
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据源失败了！");
      }
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    // -------------------------------------
    // 分页区域对应的处理函数
    cateHandleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    cateHandleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // -----------------------------------------------

    // 修改地址的弹出框的方法
    showBox() {
      this.dialogVisible = true;
    },
    // 关闭表单时候重置一下表单
    addressDialogClose() {
      this.$refs.addressFormRef.resetFields();
    },

    // --------------------------------------------------

    // 这个地方后台接口有点问题，做假数据吧！

    showProgress() {
      this.progressDialogVisible = true;
      console.log(this.progressInfo);
      //   const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      //   if (res.meta.status !== 200) {
      //     return this.$message.error("获取物流数据失败了！");
      //   }
      //   this.$message.success("获取物流信息成功！");
      //   this.progressInfo = res.data;
      //   console.log(this.progressInfo);
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
.el-cascader {
  width: 100%;
}
</style>

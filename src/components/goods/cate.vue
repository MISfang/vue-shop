<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 下面的卡片 -->
    <el-card>
      <!-- 最上方的按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" round @click="showcateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 下方的树形表格 -->
      <tree-table
        border
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-row-hover
        show-index
        class="setFont"
        max-height="575px"
      >
        <!-- 第一个判断是否删除的模板 -->
        <template v-slot:isok="scope">
          <!-- 这里有两种写法 -->
          <!-- slot="isok" slot-scope="scope" -->
          <!-- v-slot:isok='scope' -->
          <div>
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color:#2ecc71"
            ></i>
            <i class="el-icon-error" v-else style="color:#e74c3c"></i>
          </div>
        </template>
        <!-- 第一个模板结束 -->

        <!-- 第二个贴等级标签的模板 -->
        <template v-slot:order="scope">
          <div>
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag type="info" v-if="scope.row.cat_level === 2">三级</el-tag>
          </div>
        </template>
        <!-- 第二个模板结束 -->

        <!-- 第三个操作的模板 -->
        <template v-slot:opt="">
          <div class="setButton">
            <el-button type="primary" icon="el-icon-edit" round size="medium"
              >编辑按钮</el-button
            >
            <el-button type="danger" icon="el-icon-delete" round size="medium"
              >删除按钮</el-button
            >
          </div>
        </template>
      </tree-table>

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
    </el-card>

    <!-- 点击添加按钮弹出的卡片 -->
    <el-dialog
      title="添加分类"
      :visible.sync="cateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 这是主要内容区域 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        class="demo-ruleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 下面那个选框 -->
        <el-form-item label="父级(必选)：" prop="cat_pid">
          <el-cascader
            v-model="selectOptionList"
            :options="parentCateList"
            @change="parentCateChange"
            :props="cascaderProps"
            :clearable="true"
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 内容区域结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 数据
  data() {
    return {
      // 指定对应的查询条件
      queryInfo: {
        tyep: 3,
        pagenum: 1,
        pagesize: 5
      },

      // 商品分类的数据列表
      cateList: [],

      // 获取的商品总数量
      total: 0,

      // 为table指定列的样式
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          // 当前这一页使用的模板名称
          template: "isok",
          width: "200px"
        },
        {
          label: "排序",
          type: "template",
          // 当前这一页使用的模板名称
          template: "order",
          width: "200px"
        },
        {
          label: "操作",
          type: "template",
          // 当前这一页使用的模板名称
          template: "opt"
        }
      ],

      // 控制添加按钮弹出框可见的变量
      cateDialogVisible: false,

      // 添加商品的数据对象
      addCateForm: {
        // 添加分类的名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 添加元素的level值
        cat_level: 0
      },

      // 添加商品表单的校验规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "click",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },

      // 选中的分类的id数组
      selectOptionList: []
    };
  },
  // 生命周期函数，随着页面创建被调用
  created() {
    this.getCateList();
  },
  // 事件处理函数
  methods: {
    // 获取商品分类数据列表的方法
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表数据失败！");
      }
      // 把数据列表赋值给cateList
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 处理每页数量的方法
    cateHandleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getCateList();
    },

    // 处理当前页码值发生变化的方法
    cateHandleCurrentChange(ret) {
      this.queryInfo.pagenum = ret;
      this.getCateList();
    },

    // 绑定添加商品按钮弹出对话框
    showcateDialog() {
      this.getParentCateList();
      this.cateDialogVisible = true;
    },

    // 只获取父节点的商品分类
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类列表数据失败！");
      }
      this.parentCateList = res.data;
    },
    // 选择项一旦发生变化，通过v-model双向数据绑定，立即同步
    parentCateChange() {
      // 先做判断，看看用户是否选择了父级分类
      if (this.selectOptionList.length > 0) {
        this.addCateForm.cat_pid = this.selectOptionList[
          this.selectOptionList.length - 1
        ];
        this.addCateForm.cat_level = this.selectOptionList.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    // 点击确定提交表单
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败！");
        }
        this.$message.success("添加分类成功了！");
        this.getCateList();
        this.cateDialogVisible = false;
      });
    },
    // 关闭表单进行表单重置
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.selectOptionList = [];
    }
  }
};
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 10px;
  margin-top: -10px;
}
.daoHang {
  margin: 0 auto;
  width: 600px;
  margin-top: 12px;
  margin-bottom: -10px;
}
.setFont {
  font-size: 14px !important;
}
.setButton {
  height: 66.4px;
  line-height: 66.4px;
  text-align: center;
}
.el-cascader {
  width: 100%;
}
</style>

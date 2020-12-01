<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 下面的卡片视图 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级商品设置相关参数"
        type="info"
        effect="dark"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类条 -->
      <el-row>
        <el-col>
          <span>请选择商品：</span>
          <!-- 选择商品的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            @change="CateChange"
            :props="cascaderProps"
            :clearable="true"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 下面的卡片视图tabs标签页面 -->
      <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
        <!-- 第一个是添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            round
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 下方的表格 -->
          <el-table :data="manyData" border stripe>
            <el-table-column type="expand" class="Isdisplay">
              <!-- 展开列表的具体内容 -->
              <template slot-scope="scope">
                <!-- 这个是渲染的普通的对话框 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 这个是v-if与v-else结合做的一个添加标签的组件 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="对应操作">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_id)"
                    >修改</el-button
                  >
                  <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    @click="removeParams(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 第一个是添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            round
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 下方的表格 -->
          <el-table :data="staticData" border stripe>
            <el-table-column type="expand" class="Isdisplay">
              <!-- 展开列表的具体内容 -->
              <template slot-scope="scope">
                <!-- 这个是渲染的普通的对话框 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 这个是v-if与v-else结合做的一个添加标签的组件 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="对应操作">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_id)"
                    >修改</el-button
                  >
                  <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    @click="removeParams(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 点击添加参数和属性的对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="resetAddDialog"
    >
      <!-- 内容主体 -->
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="120px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容主体结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- ---------------------------------------------- -->
    <!-- 修改的对话框 -->
    <el-dialog
      :title="modifyText"
      :visible.sync="modifyParamsDialogVisible"
      width="50%"
      @close="resetModifyDialog"
    >
      <!-- 内容主体 -->
      <el-form
        :model="modifyParamsForm"
        :rules="modifyParamsFormRules"
        ref="modifyParamsFormRef"
        label-width="120px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="modifyParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容主体结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyParamsYes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 数据
  data() {
    return {
      // 从后端获取的全部商品列表
      cateList: [],

      // 级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "click",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },

      // 级联选择框绑定的数组
      selectedCateKeys: [],

      // 默认的下方tabs框
      activeName: "many",

      // 用于保存动态数据
      manyData: [],

      // 用于保存静态数据
      staticData: [],

      // -------------------------------------------------------
      // 下面是对话框对应的参数
      // 控制对话框的显示与隐藏
      addParamsDialogVisible: false,
      // 添加参数的数据
      addParamsForm: {},
      // 添加参数表单的验证规则
      addParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },

      // ---------------------------------------
      // 修改对话框的相关参数
      modifyParamsDialogVisible: false,
      // 添加参数的数据
      modifyParamsForm: {},
      // 添加参数表单的验证规则
      modifyParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      // ----------------------------------------------------
      // 控制添加标签的显示与隐藏的变量
      inputVisible: false,
      // 输入对应的值
      inputValue: ""
    };
  },
  // 生命周期函数，随着页面创建被调用
  created() {
    this.getGoodsList();
  },

  // 计算属性
  computed: {
    // 控制按钮是否被禁用
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) return true;
      return false;
    },
    // 拿到对应三级分类的id值
    getCateId() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },

    // 动态标题的计算属性
    titleText() {
      if (this.activeName === "many") {
        return "添加动态参数";
      } else {
        return "添加静态属性";
      }
    },

    // 修改对话框的标题

    modifyText() {
      if (this.activeName === "many") {
        return "修改动态参数";
      } else {
        return "修改静态属性";
      }
    }
  },
  // 事件处理函数
  methods: {
    // 不传参数，获取全部商品分类
    async getGoodsList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取全部商品列表失败！");
      this.cateList = res.data;
    },
    // 级联选择框选中变化会触发的事件
    CateChange() {
      this.getParamsData();
    },

    // 下方的tab栏的点击事件
    tabClick() {
      this.getParamsData();
    },

    // 获取商品相关数据，抽离成为一个新的函数
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        // 不分动态还是静态，两个一块给你清空一下
        this.manyData = [];
        this.staticData = [];
        return;
      }
      // 根据所选分类的id和所处的面板，获取对应的数据
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败！");
      }

      // 这个厉害了
      // 通过forEach循环和字符串分割把长字符串分个成一个数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];

        // 为了解决那里new tag标签公用一个vale和id的联动问题
        item.inputVisible = false;
        item.inputValue = "";
      });

      // 获取相关数据以后还需亚判断是动态数据还是静态数据
      if (this.activeName == "many") {
        this.manyData = res.data;
      } else {
        this.staticData = res.data;
      }
    },

    // ------------------------------------------------------
    // 下面是弹出的添加对话框对应的方法

    // 当点击取消时重置表单
    resetAddDialog() {
      this.$refs.addParamsFormRef.resetFields();
    },

    // 点击确定做表单预校验，并向服务器传递参数
    addParams() {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return this.$message.error("数据有误！");
        const { data: res } = await this.$http.post(
          `categories/${this.getCateId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) this.$message.error("添加参数失败了！");
        this.$message.success("添加商品参数成功啦！");

        // 添加成功以后隐藏对话框！
        this.addParamsDialogVisible = false;
        this.getParamsData();
      });
    },

    // -------------------------------------------------
    // 下面是修改弹出的对话框
    // 重置表单
    resetModifyDialog() {
      this.$refs.modifyParamsFormRef.resetFields();
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.getCateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败！");
      }
      this.modifyParamsForm = res.data;
      this.modifyParamsDialogVisible = true;
    },
    // 点击确定以后先预验证，然后向服务器发送数据
    modifyParamsYes() {
      this.$refs.modifyParamsFormRef.validate(async valid => {
        if (!valid) return this.$message.error("数据有误！");
        const { data: res } = await this.$http.put(
          `categories/${this.getCateId}/attributes/${this.modifyParamsForm.attr_id}`,
          {
            attr_name: this.modifyParamsForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改商品参数失败了！");
        }

        this.$message.success("修改商品参数成功啦！");

        // 添加成功以后隐藏对话框！
        this.modifyParamsDialogVisible = false;
        this.getParamsData();
      });
    },

    // -------------------------------------------------
    // 下面是删除对应的方法
    async removeParams(id) {
      // 先弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "删除该属性，是否确定！",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除！");
      }
      if (confirmResult == "confirm") {
        const { data: res } = await this.$http.delete(
          `categories/${this.getCateId}/attributes/${id}`
        );
        if (res.meta.status !== 200) {
          return this.$message.error("删除用户失败！");
        }
        this.$message.success("删除用户成功！");
        this.getParamsData();
      }
    },

    // tag标签对应的事件处理函数
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 如果没有return出来，这说明用户输入了正式的数据
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";

      // 完成对应的离线操作
      // 现在把离线的数据提交到服务器那边
      this.saveAttrVals(row);
    },
    // 下面按钮的事件
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 删除标签的处理事件
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
      // 然后直接保存到服务器中就行
    },
    // 对attr_vals的操作抽离封装成为一个单独的函数，组件化思想
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.getCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新标签失败！");
      }
      this.$message.success("更新标签成功！");
    }
  }
};
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 20px;
}
.el-tabs {
  margin-top: 20px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 100px !important;
}
</style>

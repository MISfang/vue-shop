<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisable = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :data="userList"
        stripe
        style="width: 100%"
        border
        highlight-current-row
        @current-change="handleCurrent"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <!-- 这是一列 -->
        <el-table-column prop="username" label="用户名" width="200">
        </el-table-column>
        <!-- 一列结束 -->

        <el-table-column prop="email" label="邮箱" width="220">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="220">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="200">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="160">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#409eff"
              inactive-color="#91949a"
              @click="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="修改"
              placement="bottom"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="bottom"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="设置权限"
              placement="bottom"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格结束 -->

      <!-- 下面是底部导航 -->
      <div>
        <div class="daoHang">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 点击添加用户以后弹出的对话框 -->
    <el-dialog
      title="填写用户信息"
      :visible.sync="addDialogVisable"
      width="50%"
      @close="resetDialog"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="120px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 下方按钮功能 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击修改用户信息的弹出对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetEditDialog"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormrules"
        ref="editFormRef"
        label-width="120px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容区结束 -->
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击设置权限的弹框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="resetRoleDialog"
    >
      <!-- 主体内容 -->
      <div>
        <p>当前用户名称：{{ userInfo.username }}</p>
        <p>当前用户角色：{{ userInfo.role_name }}</p>
        <el-select
          v-model="selectRoleId"
          clearable
          placeholder="请选择"
          filterable
        >
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <!-- 内容区结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 结束 -->
  </div>
</template>

<script>
export default {
  data() {
    // 自定义表单校验规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请检查输入的邮箱是否有误！"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请检查输入的手机号是否有误！"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      // 控制添加对话框的显示与隐藏
      addDialogVisable: false,

      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,

      // 设置权限的对话框的显示与隐藏
      setDialogVisible: false,

      userInfo: {},

      // 定义所有角色数据
      rolesList: {},
      // 已经选择的角色id值
      selectRoleId: "",

      // 添加用户数据
      addForm: {
        username: "(测试)李彬彬",
        password: "123456",
        email: "1419961594@163.com",
        mobile: "15737503442",
        currentRow: null
      },
      // 添加数据的表单验证规则
      addFormrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度应该在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度应该在 6 到 15 个字符",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      editFormrules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      editForm: {}
    };
  },
  // 页面一旦创建，就会立即执行该函数
  created() {
    this.getUserList();
  },
  methods: {
    // 实现点击选择
    // 结束
    // 实现最下面的页码功能
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(ret) {
      this.queryInfo.pagenum = ret;
      this.getUserList();
    },
    // 结束
    // 点击取消时，重置对话框
    // ①添加表单的
    resetDialog() {
      this.$refs.addFormRef.resetFields();
    },
    // ②修改表单的
    resetEditDialog() {
      this.$refs.editFormRef.resetFields();
    },

    // 点击选中表单
    handleCurrent() {
      this.currentRow = val;
    },
    // 修改按钮的事件，显示对话框
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editForm = res.data;
    },

    // （添加用户）提交表单时候预校验,并向服务器提交数据
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error("表单有误！");
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) this.$message.error("添加用户失败了！");
        this.$message.success("添加用户成功啦！");

        // 添加成功以后隐藏对话框！
        this.addDialogVisable = false;
        this.getUserList();
      });
    },

    // 修改数据时，弹出表单，并向服务器提交修改数据
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改用户信息失败了！");

        // 添加成功以后隐藏对话框！
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success("修改用户信息成功啦！");
      });
    },

    // 点击保存用户修改的角色
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.info("请选择角色后在点击确定！");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("更新用户角色失败了！");
      this.$message.success("更新用户角色成功了！");
      this.getUserList();
      this.setDialogVisible = false;
    },
    // 设置角色的弹出窗口，并向服务器提交
    async setRole(userInfo) {
      this.userInfo = userInfo;

      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取所有角色列表失败！");
      }
      this.rolesList = res.data;
      this.setDialogVisible = true;
    },

    // 根据id删除对应的用户信息
    async removeUserById(id) {
      // 先弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "删除该用户的数据，是否确定！",
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
        const { data: res } = await this.$http.delete("users/" + id);
        if (res.meta.status !== 200) {
          return this.$message.error("删除用户失败！");
        }
        this.$message.success("删除用户成功！");
        this.getUserList();
      }
    },

    // 监听状态数据，并处理到后台
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `users/{$userinfo.id}/state/{$userinfo.mg_status}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("错误！");
        userinfo.mg_status = !userinfo.mg_status;
      }
      this.$message.success("更新用户状态成功！");
    },
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    resetRoleDialog() {
      (this.selectRoleId = ""), (this.userInfo = {});
    }
  }
};
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
.daoHang {
  margin: 0 auto;
  width: 450px;
}
.el-form {
  margin-left: -20px;
  margin-right: 40px;
}
</style>

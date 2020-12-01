<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 下面的卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" round @click="addRolesDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 下面的表格 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'ycenter']"
            >
              <!-- 左侧一级权限 -->
              <el-col :span="4">
                <el-tag closable @close="removeById(item1.id, scope.row)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-d-arrow-right"></i>
              </el-col>
              <!-- 右侧二级和三级权限 -->
              <el-col :span="20">
                <!-- 通过for循环，嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'ycenter']"
                >
                  <!-- 这个是二级权限 -->
                  <el-col :span="4">
                    <el-tag
                      type="success"
                      closable
                      @close="removeById(item2.id, scope.row)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <!-- 这个是三级权限 -->
                  <el-col :span="16">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeById(item3.id, scope.row)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button
                type="primary"
                icon="el-icon-edit"
                round
                @click="rolesEditDialog(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                round
                @click="removeRolesById(scope.row.id)"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-setting"
                round
                @click="showSetRightDialog(scope.row)"
                >设置权限</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 这是点击设置按钮弹出的对话框 -->
    <el-dialog title="分配权限页面" :visible.sync="dialogVisible" width="50%">
      <!-- 弹出权限选择框的内容 -->
      <!-- 这是用树形控件来渲染全部权限 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      >
      </el-tree>
      <!-- 内容部分结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 下面这个是点击编辑按钮弹出的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetAddDialog"
    >
      <!-- 内容主体区域 -->
      <el-form :model="rolesEditForm" ref="editFormRef" label-width="120px">
        <el-form-item label="角色名称">
          <el-input v-model="rolesEditForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesEditForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容区结束 -->
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolesEdit()">确 定</el-button>
      </span>
      <!-- 页脚结束 -->
    </el-dialog>

    <!-- ---------------------- -->
    <!-- 点击添加角色后弹出的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="resetAddDialog"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="rolesAddForm"
        ref="AddFormRef"
        label-width="120px"
        :rules="addRolesFormRules"
      >
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="rolesAddForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roledesc">
          <el-input v-model="rolesAddForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容区结束 -->
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
      <!-- 页脚结束 -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      dialogVisible: false,
      //   所有权限的数据
      rightsList: [],
      //   定义树形结构基本的显示规则
      treeProps: {
        children: "children",
        label: "authName"
      },
      //   点击展开，默认勾选上的权限
      defkeys: [],

      // 被操作的那个用户的id值
      roleId: "",

      // --------------------------------------------------------
      // 这个是编辑功能的显示控制参数
      editDialogVisible: false,
      // 编辑角色对应的数据
      rolesEditForm: {},

      // ---------------------------------------------------------
      // 点击添加角色的显示控制参数
      addRolesDialogVisible: false,
      rolesAddForm: {
        roleName: "",
        roleDesc: ""
      },
      // 添加数据的表单验证规则
      addFormrules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度应该在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        roledesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度应该在 6 到 15 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //   获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message("请求角色列表失败！");
      }
      this.rolesList = res.data;
    },
    // 点击小叉号删除对应的权限
    async removeById(rightId, role) {
      // 弹框提示用户，是否要删除
      // 先弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "是否确定收回该用户这个权限",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消操作！");
      }
      if (confirmResult == "confirm") {
        const { data: res } = await this.$http.delete(
          //   "roles/" + role.id + "rights/" + rightId
          `roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status !== 200) {
          return this.$message.error("收回权限失败！");
        }
        this.$message.success("收回权限成功！");

        // 如果直接渲染的话会发生页面的全部渲染，不建议这样的用
        // 可以更新一下数据就OK了
        // this.getRolesList();
        role.children = res.data;
      }
    },

    // 点击分配权限，弹出相应地窗口
    async showSetRightDialog(role) {
      // 把id值保存到data，以供下面的点击确定时候使用
      this.roleId = role.id;
      //   控制改对话框的显示
      this.dialogVisible = true;

      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("请求权限列表失败！");
      }
      this.rightsList = res.data;

      //   先把该数组清空
      this.defkeys = [];
      //   调用获取所有三级数据的id值得方法
      this.getLeafLeys(role, this.defkeys);
    },
    // 点击获取所有三级节点的id值
    getLeafLeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeafLeys(item, arr);
      });
    },

    // 点击提交分配权限
    async allotRights() {
      this.dialogVisible = false;
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(",");
      // 数组准备完成，向服务器发起请求
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("保存分配权限失败，请重试！");
      }
      this.$message.success("保存分配权限成功！");
      this.getRolesList();
    },

    // -------------------------------------------
    // 编辑按钮绑定的点击事件，触发编辑对话框弹出
    async rolesEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色信息失败！");
      }
      console.log(res.data);
      this.rolesEditForm = res.data;
    },

    // 编辑按钮，点击确定后向服务器发送请求修改数据
    rolesEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.rolesEditForm.roleId,
          {
            roleName: this.rolesEditForm.roleName,
            roleDesc: this.rolesEditForm.roleDesc
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("保存修改角色信息失败了！");

        // 修改成功以后隐藏对话框！
        this.editDialogVisible = false;
        this.getRolesList();
        this.$message.success("保存修改角色信息成功啦！");
      });
    },

    // 点击删除对应的角色
    async removeRolesById(id) {
      const confirmResult = await this.$confirm(
        "删除用户的数据，是否确定！",
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
        const { data: res } = await this.$http.delete("roles/" + id);
        if (res.meta.status !== 200) {
          return this.$message.error("删除角色失败！");
        }
        this.$message.success("删除角色成功！");
        this.getRolesList();
      }
    },

    // 添加新角色，点击确定处理方法

    addRole() {
      this.$refs.AddFormRef.validate(async valid => {
        if (!valid) return this.$message.error("数据有误！");
        const { data: res } = await this.$http.post("roles", this.rolesAddForm);
        if (res.meta.status !== 201) this.$message.error("添加角色失败了！");
        this.$message.success("添加角色成功啦！");

        // 添加成功以后隐藏对话框！
        this.addRolesDialogVisible = false;
        this.getRolesList();
      });
    },
    // ----------------------
    // 点击取消时，重置对话框
    resetEditDialog() {
      this.$refs.resetEditDialog.resetFields();
    },
    resetAddDialog() {
      this.$refs.resetEditDialog.resetFields();
    }
  }
};
</script>

<style lang="less">
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.ycenter {
  display: flex;
  align-items: center;
}
</style>

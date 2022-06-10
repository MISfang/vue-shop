<template>
  <div class="login_container">
    <div class="login_container">
      <!-- 这个是登录组件 -->

      <div class="login_box">
        <div class="avatar_box">
          <img src="../assets/图层 5.png" alt="" />
        </div>

        <!-- 表单 -->
        <el-form
          label-width="0px"
          class="form_box"
          :model="loginForm"
          :rules="rules"
          ref="loginformRef"
        >
          <!-- 用户名区域 -->
          <el-form-item label="" prop="username">
            <el-input
              prefix-icon="el-icon-user-solid"
              v-model="loginForm.username"
              class="input_name"
              placeholder="请输入用户名:"
            ></el-input>
          </el-form-item>
          <!-- 密码区域区域 -->
          <el-form-item label="" prop="password">
            <el-input
              prefix-icon="el-icon-question"
              v-model="loginForm.password"
              class="input_word"
              type="password"
              placeholder="请输入密码:"
            ></el-input>
          </el-form-item>
          <!-- 下方按钮区域 -->
          <el-form-item class="btns">
            <el-button type="primary" class="button_left" @click="login"
              >登录</el-button
            >
            <el-button type="success" @click="loginformRef">重置表单</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输用户名!", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    loginformRef() {
      this.$refs.loginformRef.resetFields();
    },
    login() {
      this.$refs.loginformRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        console.log(res);
        // 判断是否登录失败，如果失败则执行if语句
        if (res.meta.status !== 200)
          return this.$message({
            message: "登录失败，请重试！",
            type: "error",
            center: true,
            showClose: true
          });
        // 登录失败不成立，则判断为登录成功，执行下方登录成功语句
        this.$message({
          message: "登录成功",
          type: "success",
          center: true
        });
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  // position: relative;
  height: 100%;
  background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
}
.login_box {
  width: 450px;
  height: 300px;
  background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 20px 60px 10px rgba(0, 0, 0, 0.2);

  .avatar_box {
    width: 130px;
    height: 130px;
    padding: 2px;
    border-radius: 50%;
    border: 10px solid #d6e1e7;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 50%;
    transform: translate(-50%, -40%);
    background-color: #c0e4f6;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #b7e9e9;
    }
  }
}
.btns {
  display: flex;
  justify-content: space-around;
}
.form_box {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 80px;
  box-sizing: border-box;
}
.button_left {
  margin-right: 30px;
}
.input_name :hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
}
.input_word :hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
}
.h1 {
  margin-left: 670px;
  letter-spacing: 5px;
  color: black;
}
</style>

<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_img">
        <img src="../assets/logo.png" />
      </div>
      <el-form :rules="rules" ref="form" :model="form" label-width="80px" class="login_form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input prefix-icon="el-icon-lock" show-password v-model="form.password" ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('form')">登录</el-button>
          <el-button type="info" @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('login', this.form)
          if (res.meta.status !== 200) return this.$message.error('登录失败')
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('home')
          /*
          1. 将登录成功后的 token，保存到客户端的sessionStorage中去
           1.1 项目中除了登录之外的其他api接口，必须在登录之后才能访问
           1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
            2.通过编程式导航跳转到后台主页，路由地址是/home
          */
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  created () {},
  mounted () {}
}
</script>
<style lang="less" scoped>
// @import url(); 引入公共css类
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.avatar_img {
  position: absolute;
  top: -25%;
  left: 50%;
  width: 130px;
  height: 130px;
  transform: translateX(-50%);
  border: 1px solid #eee;
  border-radius: 50%;
  text-align: center;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
}
.avatar_img img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;

  // margin: 5px;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
    display: flex;
    justify-content: flex-end;
}

</style>

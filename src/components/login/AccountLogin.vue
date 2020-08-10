<template>
  <el-form
    :model="loginForm"
    :rules="loginFormRules"
    ref="loginFormRef"
    label-width="80px"
    class="form_box"
  >
    <el-form-item label="账号：" prop="userName">
      <el-input v-model="loginForm.userName">
        <!-- <svg slot="prefix" class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bussiness-man"></use>
        </svg>-->
        <i slot="prefix" class="iconfont icon-bussiness-man"></i>
      </el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        @keyup.native.enter="submitLogin('loginFormRef')"
      >
        <i slot="prefix" class="iconfont icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item class="btn_box">
      <el-button type="primary" @click="submitLogin('loginFormRef')">登录</el-button>
      <el-button type="info" @click="resetForm('loginFormRef')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { mixins } from '../../js/mixin'

export default {
  mixins: [mixins],
  methods: {
    submitLogin(loginFormRef) {
      this.$refs[loginFormRef].validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('/login', {
          username: this.loginForm.userName,
          password: this.loginForm.password
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('登录成功')
        // 登陆成功将获取到的token存入到sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 登录成功跳转到主页面
        this.$router.push({ name: 'Home' })
      })
    }
  }
}
</script>

<template>
  <el-form
    :model="loginForm"
    :rules="loginFormRules"
    ref="loginFormRef"
    label-width="80px"
    class="form_box"
  >
    <el-form-item label="邮箱：" prop="userName">
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
import { mixins } from '@/js/mixin'

export default {
  mixins: [mixins],
  data: function() {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginFormRules: {
        userName: [{ required: true, message: '账号必输', trigger: 'blur' }],
        password: [{ required: true, message: '密码必输', trigger: 'blur' }]
      }
    }
  }
}
</script>

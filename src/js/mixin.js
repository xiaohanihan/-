export const mixins = {
  data: function () {
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
  },
  methods: {
    submitLogin(loginFormRef) {
      this.$refs[loginFormRef].validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('/login', {
          username: this.loginForm.userName,
          password: this.loginForm.password
        })
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

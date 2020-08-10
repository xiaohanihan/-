<template>
  <div class="login_container">
    <div class="login_box">
      <div class="img_box">
        <img src="../assets/logo.png" alt />
      </div>
      <component :is="currentCom"></component>
      <!-- <account-login></account-login>   -->
    </div>
  </div>
</template>

<script>
import AccountLogin from './login/AccountLogin.vue'
import PhoneLogin from './login/PhoneLogin.vue'

export default {
  components: { AccountLogin, PhoneLogin },
  name: 'Login',
  data() {
    return {
      currentCom: 'PhoneLogin'
    }
  },
  methods: {
    resetForm(loginFormRef) {
      this.$refs[loginFormRef].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4c6d;
  height: 100%;
  width: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  border-radius: 3px;
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  bottom: 0;
  .form_box {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .btn_box {
      display: flex;
      // flex-direction: row-reverse;
      justify-content: flex-end;
    }
  }
}
.img_box {
  width: 130px;
  height: 130px;
  border: 1px solid gray;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px grey;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
}
</style>

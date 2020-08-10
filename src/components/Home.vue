<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/images/head.jpeg" />
        电商后台管理系统
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="asideWidth + 'px'">
        <div class="collapse">III</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#3b3e4e"
          :unique-opened="true"
          text-color="#ffffff"
          :collapse="isCollapse"
          router
          :default-active="activeMenu"
        >
          <el-submenu :index="item.id + ''" :key="item.id" v-for="item in menuList">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span slot="title">{{item.authName}}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :index="subItem.id + ''"
              :key="subItem.id"
              :route="subItem.path"
              @click="menuClick(subItem.id)"
            >
              <i class="el-icon-location"></i>
              {{subItem.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <!-- //当前进入的路由 meta里面 keepAlive为false时走这里 下面 if 判断进行了取反处理 -->
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data: function() {
    return {
      isCollapse: false,
      menuList: [],
      iconList: {
        125: 'iconfont icon-bussiness-man',
        103: 'iconfont icon-integral-fill',
        101: 'iconfont icon-apparel',
        102: 'iconfont icon-default-template',
        145: 'iconfont icon-tradingdata'
      },
      activeMenu: ''
    }
  },
  methods: {
    goNext() {
      this.$router.push({ name: 'About' })
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    menuClick(activeIndex) {
      window.sessionStorage.setItem('activeIndex', activeIndex + '')
      this.activeIndex = activeIndex
    }
  },
  computed: {
    asideWidth: function() {
      return this.isCollapse ? 64 : 200
    }
  },
  mounted: async function() {
    const { data: res } = await this.$http.get('/menus')
    this.menuList = res.data
    this.activeMenu = window.sessionStorage.getItem('activeIndex')
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #404549;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    color: #d6dde6;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
.el-aside {
  background-color: #3b3e4e;
  .collapse {
    background-color: #555b72;
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: #ffffff;
    text-align: center;
  }
}
.e-main {
  background-color: #eef0f4;
}
.el-submenu .iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: 0px;
}
</style>

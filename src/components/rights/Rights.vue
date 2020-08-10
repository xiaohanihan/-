<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList"
                style="width: 100%"
                border
                stripe>
        <el-table-column type="index"
                         label="#">
        </el-table-column>
        <el-table-column label="权限名称"
                         prop="authName">
        </el-table-column>
        <el-table-column label="路径"
                         prop="path">
        </el-table-column>
        <el-table-column label="权限名称"
                         prop="level">
          <template slot-scope="scope">
            <el-tag type="info"
                    v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success"
                    v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning"
                    v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return { rightsList: [] }
  },
  created: function () {
    this.$http.get('/rights/list').then((result) => {
      console.log(result)
      if (result.data.meta.status === 200) {
        this.rightsList = result.data.data
      }
    })
  }
}
</script>

<style lang="less" scoped>
</style>

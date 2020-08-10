<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/'}">
        <span @click="firstPageClick">首页</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-input placeholder="请输入内容" v-model="testValue">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="userList" style="width: 100%" :border="true" stripe>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="role_name" label="状态" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="changeState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)"></el-button>
            <el-tooltip effect="dark" content="分配权限" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showDistributeDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-bind:current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 5]"
        :page-size="queryInfo.pagesize"
        layout="prev, pager, next, jumper,sizes,total"
        popper-class="user_drop"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleClose('addFormRef')"
    >
      <el-form ref="addFormRef" status-icon :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addFormRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="handleClose('editFormRef')"
    >
      <el-form
        ref="editFormRef"
        status-icon
        :model="editForm"
        :rules="editRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit('editFormRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="distributeRightVisible"
      width="50%"
      @close="closeDistriDialog"
    >
      <div>
        <p>当前用户：{{distributeUserInfo.username}}</p>
        <p>当前角色：{{distributeUserInfo.role_name}}</p>
        <p>
          分配的新角色：
          <el-select v-model="seletedRoleId" placeholder="请选择新角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <div slot="footer">
        <el-button @click="distributeRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDistrubuteNewRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'))
      }
      const regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!regPhone.test(value)) {
        return callback(new Error('电话格式不正确'))
      }
      return callback()
    }
    return {
      queryInfo: {
        query: null,
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名应在3到10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '密码应在3到10个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkPhone, message: '电话格式不正确', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkPhone, message: '电话格式不正确', trigger: 'blur' }
        ]
      },
      distributeRightVisible: false,
      // 正在被分配角色的用户信息
      distributeUserInfo: {},
      seletedRoleId: '',
      // 所有的角色
      roleList: [],
      testValue: ''
    }
  },
  methods: {
    firstPageClick() {
      window.sessionStorage.setItem('activeIndex', null)
    },
    async getUserList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      this.userList = res.data.users
      this.pagenum = res.data.pagenum
      this.total = res.data.total
    },
    changeState(rowData) {
      this.$http
        .put(`/users/${rowData.id}/state/${rowData.mg_state}`)
        .then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg)
          }
          this.$message.success(res.data.meta.msg)
        })
    },
    handleSizeChange(e) {
      this.queryInfo.pagesize = e
    },
    handleCurrentChange(e) {
      this.queryInfo.pagenum = e
    },
    handleClose(refName) {
      this.$refs[refName].resetFields()
    },
    // 添加用户
    submitAdd(refName) {
      this.$refs[refName].validate(valid => {
        // 验证失败，直接返回
        if (!valid) {
          return false
        }
        // 验证成功则执行提交的操作
        this.$http.post('/users', this.addForm).then(result => {
          const data = result.data
          this.$message({
            showClose: true,
            message: data.meta.msg,
            type: data.meta.status === 201 ? 'success' : 'error'
          })
          if (data.meta.status === 201) {
            this.dialogVisible = false
          }
        })
      })
    },
    // 编辑用户
    editUser(rowData) {
      this.editForm.username = rowData.username
      this.editForm.email = rowData.email
      this.editForm.mobile = rowData.mobile
      this.editForm.id = rowData.id
      this.editDialogVisible = true
    },
    // 编辑用户提交
    submitEdit(refName) {
      console.log(this.editForm)
      this.$refs[refName].validate(valid => {
        // 验证失败，直接返回
        if (!valid) {
          return false
        }
        // 验证成功则执行提交的操作
        this.$http
          .put(`/users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          .then(result => {
            const data = result.data
            this.$message({
              showClose: true,
              message: data.meta.msg,
              type: data.meta.status === 200 ? 'success' : 'error'
            })
            if (data.meta.status === 200) {
              this.editDialogVisible = false
              this.getUserList()
            }
          })
      })
    },
    // 删除用户
    deleteUser(userId) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: result } = await this.$http.delete(`/users/${userId}`)
          if (result.meta.status === 200) {
            this.$message.success('删除成功')
            this.getUserList()
          } else {
            this.$message.error('删除失败：' + result.meta.msg)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showDistributeDialog(rowData) {
      this.distributeRightVisible = true
      this.distributeUserInfo = rowData

      this.$http.get('/roles').then(result => {
        console.log(result)

        if (result.data.meta.status === 200) {
          this.roleList = result.data.data
        }
      })
    },
    // 分配新角色
    submitDistrubuteNewRole() {
      const id = this.distributeUserInfo.id
      this.$http
        .put(`/users/${id}/role`, {
          rid: this.seletedRoleId
        })
        .then(result => {
          this.$message({
            message: result.data.meta.msg,
            type: result.data.meta.status === 200 ? 'success' : 'error'
          })
          if (result.data.meta.status === 200) {
            this.getUserList()
            this.distributeRightVisible = false
          }
        })
    },
    // 关闭分配角色对话框
    closeDistriDialog() {
      this.distributeUserInfo = {}
    }
  },
  created: function() {
    this.getUserList()
  },
  watch: {
    queryInfo: {
      handler: function(e) {
        this.getUserList()
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}

.el-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  font-weight: 400;
  /deep/ .el-pagination__sizes {
    /deep/ input {
      letter-spacing: 0.2em;
    }
  }
}
</style>

<template>
  <div>
    <el-input v-model="inputValue"></el-input>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="10" class="el-row-margin">
      <el-col :span="6">
        <el-button type="primary" @click="dialogVisible = true,formType = 'add'">添加权限</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="el-row-margin">
      <el-table :data="roleList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
              :class="['el-row-bottom-border',index1 ===0?'el-row-top-border':'']"
              class="box-vertical"
            >
              <!-- 一级菜单 -->
              <el-col :span="4">
                <el-tag closable @close="removeRole" type>{{item1.authName}}</el-tag>
              </el-col>
              <el-col :span="20">
                <el-row
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                  :class="['box-vertical','el-row-bottom-border',index2===item1.children.length-1?'border-bottom-none':'']"
                >
                  <!-- 二级菜单 -->
                  <el-col :span="6">
                    <el-tag closable type="success">{{item2.authName}}</el-tag>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级菜单 -->
                    <el-tag
                      closable
                      @close="removeRole(scope.row.id,item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" min-width="250px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="dialogVisible = true,formType = 'edit',
              addRightFormModel.roleId=scope.row.id,
              addRightFormModel.roleName=scope.row.roleName,
              addRightFormModel.roleDesc=scope.row.roleDesc"
            >编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" @click="getSelectTreeNode(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog title="提示" :visible.sync="dialogVisible" @close="closeDialog('addRightFormRef')">
      <el-form
        ref="addRightFormRef"
        :model="addRightFormModel"
        label-width="80px"
        :rules="addRightFormRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRightFormModel.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRightFormModel.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addRightFormRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="权限分配" :visible.sync="distributeRightFormVisible" @close="closeRightDialog">
      <el-tree
        :data="rightTreeList"
        show-checkbox
        node-key="id"
        :props="treeProps"
        default-expand-all
        :default-checked-keys.sync="selectedNode"
        ref="distributeRightRef"
      ></el-tree>

      <span slot="footer">
        <el-button @click="distributeRightFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data() {
    const roleDescValidator = (rule, value, callback) => {
      if (value.length < 4 || value.length > 10) {
        return callback(new Error('角色描述需在4至10个字符'))
      }
      return callback()
    }

    return {
      roleList: [],
      dialogVisible: false,
      addRightFormModel: {
        roleName: '',
        roleDesc: ''
      },
      addRightFormRules: {
        roleName: [
          { required: true, message: '角色名称必输', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '角色名称需要在2到8个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '角色描述必输', trigger: 'blur' },
          { validator: roleDescValidator, trigger: 'blur' }
        ]
      },
      formType: '',
      distributeRightFormVisible: false,
      // 权限树状图数据
      rightTreeList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 打开后选中的节点
      selectedNode: [],
      // 正在分配权限的id
      distributingId: null,
      inputValue: ''
    }
  },
  methods: {
    async getRoleList() {
      const { data: result } = await this.$http('/roles')
      if (result.meta.status === 200) {
        this.roleList = result.data
      } else {
        this.roleList = []
      }
    },
    removeRole(roleId, rightId) {
      this.$http.delete(`roles/${roleId}/rights/${rightId}`).then(result => {
        const meta = result.data.meta
        if (meta.status !== 200) {
          return this.$message.error(meta.msg)
        }
        this.$message.success(meta.msg)
        // 刷新列表
        const d = this.roleList.find(item => item.id === roleId)
        d.children = result.data.data
      })
    },
    submitAdd(formRef, roleId) {
      this.$refs[formRef].validate(valid => {
        if (valid) {
          // 新增
          if (this.formType === 'add') {
            this.$http.post('/roles', this.addRightFormModel).then(result => {
              const meta = result.data.meta
              if (meta.status === 201) {
                this.$message.success(meta.msg)
                this.getRoleList()
                this.dialogVisible = false
              } else {
                this.$message.error(meta.msg)
              }
            })
          } else {
            // 编辑
            this.$http
              .put(
                `/roles/${this.addRightFormModel.roleId}`,
                this.addRightFormModel
              )
              .then(result => {
                const meta = result.data.meta
                if (meta.status === 200) {
                  this.$message.success(meta.msg)
                  this.getRoleList()
                  this.dialogVisible = false
                } else {
                  this.$message.error(meta.msg)
                }
              })
          }
        }
      })
    },
    closeDialog(formRef) {
      this.$refs[formRef].resetFields()
    },
    // 删除角色
    deleteRole(id) {
      this.$confirm('确认删除角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete(`/roles/${id}`).then(result => {
            if (result.data.meta.status === 200) {
              this.$message.success(result.data.meta.msg)
              this.getRoleList()
            } else {
              this.$message.error(result.data.meta.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getRightTreeList() {
      this.$http.get('/rights/tree').then(result => {
        if (result.data.meta.status === 200) {
          this.rightTreeList = result.data.data
        } else {
          this.rightTreeList = []
        }
      })
    },
    // 获得选中的树形节点
    getSelectTreeNode(rowData) {
      this.distributingId = rowData.id
      // 递归获得所有的节点数据
      const getDefChildren = (childrens, arr) => {
        childrens.forEach(element => {
          if (element.children) {
            getDefChildren(element.children, this.selectedNode)
          } else {
            arr.push(element.id)
          }
        })
      }

      // 获得树形图权限数据
      this.getRightTreeList()

      getDefChildren(rowData.children, this.selectedNode)

      // 打开弹窗
      this.distributeRightFormVisible = true
    },
    closeRightDialog() {
      this.selectedNode = []
    },
    // 分配权限确定
    submitRight() {
      const ids = [
        ...this.$refs.distributeRightRef.getCheckedKeys(),
        ...this.$refs.distributeRightRef.getHalfCheckedKeys()
      ]

      const idParam = ids.join(',')

      this.$http
        .post(`/roles/${this.distributingId}/rights`, {
          rids: idParam
        })
        .then(result => {
          if (result.data.meta.status === 200) {
            this.$message.success(result.data.meta.msg)
            this.distributeRightFormVisible = false
            this.getRoleList()
          } else {
            this.$message.error(result.data.meta.msg)
          }
        })
    }
  },
  created() {
    // 获得list权限数据
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.el-row-margin {
  margin-top: 15px;
}

.el-row-bottom-border {
  border-bottom: 1px solid black;
}

.el-row-top-border {
  border-top: 1px solid black;
}

// .el-table {
//   .el-row {
//     padding: 5px 0;
//   }
// }

.box-vertical {
  display: flex;
  align-items: center;
}

.border-bottom-none {
  border-bottom: none;
}

.el-tag {
  margin: 7px;
}

/deep/ .el-dialog {
  .el-dialog__body {
    height: 400px;
    overflow: scroll;
  }
}
</style>

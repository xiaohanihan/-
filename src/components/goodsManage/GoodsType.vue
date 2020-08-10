<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加分类</el-button>
        </el-col>
      </el-row>

      <el-row>
        <zk-table
          ref="table"
          index-text="#"
          :data="gridData"
          :columns="columns"
          :stripe="props.stripe"
          :border="props.border"
          :show-row-hover="props.showRowHover"
          :show-index="props.showIndex"
          :tree-type="props.treeType"
          :is-fold="props.isFold"
          :expand-type="false"
          :selection-type="props.selectionType"
        >
          <template slot="enabledTemp" slot-scope="scope">
            <i class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
            <i class="el-icon-error" v-else></i>
          </template>

          <template slot="sortTemp" slot-scope="scope">
            <el-tag>{{getLevel(scope.row.cat_level)}}</el-tag>
          </template>

          <template slot="editTemplate" slot-scope="scope">
            <el-button type="primary" size="mini" @click="editDialogClick(scope.row)">
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-button type="danger" size="mini">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </zk-table>
      </el-row>
    </el-card>

    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="50%">
      <div>
        <p>
          分类名称：
          <el-input v-model="editCatProp.cat_name"></el-input>
        </p>
      </div>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加" :visible.sync="addDialogVisible" width="50%">
      <div>
        <p>
          分类名称：
          <el-input v-model="addCatProp.cat_name"></el-input>
        </p>
        <p>
          父级分类：
          <el-cascader
            expand-trigger="hover"
            :options="gridData"
            v-model="selectedKeys"
            @change="parentKeyChange"
          ></el-cascader>
        </p>
      </div>
      <div slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      gridData: [],
      props: {
        stripe: true,
        border: true,
        showRowHover: true,
        showIndex: true,
        treeType: true,
        isFold: true,
        selectionType: false
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '400px'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          minWidth: '50px',
          type: 'template',
          template: 'enabledTemp'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'sortTemp'
        },
        {
          label: '操作',
          prop: 'edit',
          minWidth: '200px',
          type: 'template',
          template: 'editTemplate'
        }
      ],
      pageObj: {
        pagenum: 0,
        pagesize: 5
      },
      editDialogVisible: false,
      // 编辑的分类名称
      editCatProp: {
        cat_id: '',
        cat_name: ''
      },
      addDialogVisible: false,
      // 添加的分类属性值
      addCatProp: {
        cat_name: '',
        cat_level: '',
        cat_pid: ''
      },
      selectedKeys: []
    }
  },
  methods: {
    async getCategorys(type) {
      const data = await this.$http.get('/categories', {
        params: this.pageObj,
        type: !type ? 3 : type
      })
      return data
    },
    getLevel(catLevel) {
      let res = ''
      if (catLevel === 0) {
        res = '一'
      } else if (catLevel === 1) {
        res = '二'
      } else {
        res = '三'
      }
      return '级别' + res
    },
    editDialogClick(rowData) {
      this.editCatProp.cat_name = rowData.cat_name
      this.editCatProp.cat_id = rowData.cat_id
      this.editDialogVisible = true
    },
    // 编辑事件提交
    editSubmit() {
      this.$http
        .put(`/categories/${this.editCatProp.cat_id}`, {
          cat_name: this.editCatProp.cat_name
        })
        .then(result => {
          const meta = result.data.meta
          if (meta.status === 200) {
            this.$message.success(meta.msg)
            this.editDialogVisible = false
            this.getCategorys()
          } else {
            this.$message.error(meta.msg)
          }
        })
    },
    // 添加事件提交
    addSubmit() {
      this.addDialogVisible = false
    },
    parentKeyChange() {}
  },
  async mounted() {
    // 获得所有三级菜单数据并赋给表格
    const data = await this.getCategorys()
    console.log(data)
    if (data.data.meta.status === 200) {
      this.gridData = data.data.result
    }
  }
}
</script>

<style lang="less" scoped>
.el-icon-success {
  color: green;
}

.el-card {
  margin-top: 15px;
}

.zk-table {
  margin-top: 15px;
}

.el-input {
  width: 50%;
}
</style>

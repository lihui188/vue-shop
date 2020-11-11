<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="openAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="goodsClassifyList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        border
        class="table_content"
      >
        <template v-slot:isok="scope">
          <i
            v-if="scope.row.cat_deleted"
            class="el-icon-success"
            style="color:lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color:red"></i>
        </template>
        <template v-slot:sort="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            type="success"
            >二级</el-tag
          >
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <template v-slot:operation="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="openDelete(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="pageSizes"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name" label-width="100px">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="100px">
          <el-cascader
            v-model="parentCateId"
            :options="parentCateList"
            :props="cascaderConfig"
            clearable  @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="isAddCate">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name" label-width="100px">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="isEditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 级连选择器配置对象
      cascaderConfig: { expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children', checkStrictly: true },
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      parentCateList: [],
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      total: 0,
      pageSizes: [5, 10, 20, 50],
      goodsClassifyList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      editCateForm: {},
      parentCateId: [],
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // this.getClassifyList()
    this.handleSizeChange(this.pageSizes[0])
  },
  mounted() {},
  methods: {
    async getClassifyList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.goodsClassifyList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getClassifyList()
    },
    // 监听
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getClassifyList()
    },
    openAddCate() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    addCateDialogClosed() {
      this.parentCateId = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.$refs.addCateFormRef.resetFields()
    },
    // 点击确定添加分类
    isAddCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('categories', this.addCateForm)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.error(res.meta.msg)
          this.addCateDialogVisible = false
          this.getClassifyList()
        }
      })
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCateList = res.data
    },
    parentCateChange() {
      if (this.parentCateId.length > 0) {
        this.addCateForm.cat_pid = this.parentCateId[this.parentCateId.length - 1]
        this.addCateForm.cat_level = this.parentCateId.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    showEditDialog(id) {
      this.$http.get(`categories/${id}`).then(res => {
        res = res.data
        if (res.meta.status === 200) {
          this.editCateForm = res.data
        }
      })
      this.editCateDialogVisible = true
    },
    isEditCate() {
      var params = {
        cat_name: this.editCateForm.cat_name
      }
      this.$refs.addCateFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, params)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.editCateDialogVisible = false
          this.getClassifyList()
        }
      })
    },
    openDelete(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          if (res === 'confirm') {
            this.$http.delete(`categories/${id}`).then(res => {
              res = res.data
              if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
              } else {
                this.$message.success(res.meta.msg)
                this.getClassifyList()
              }
            })
          }
        })
        .catch(res => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.el-cascader{
  width: 100%;
}
</style>

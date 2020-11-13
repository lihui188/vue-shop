<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            :props="cascaderConfig"
            v-model="selectCateId"
            :options="cateList"
            clearable
            @change="selectCate"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBthDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe class="table_content">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index" @close="handleClose(scope.row,index)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column width="180" label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="openDelete(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBthDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe class="table_content">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index" @close="handleClose(scope.row,index)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column width="180" label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="openDelete(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name" label-width="100px">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name" label-width="100px">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      cateList: [],
      // 选中分类的id值
      selectCateId: [],
      // el-cascader的配置
      cascaderConfig: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 被激活页签的名称
      activeName: 'many',
      // 动态参数列表数据
      manyTableData: [],
      // 静态列表参数数据
      onlyTableData: [],
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '清输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '清输入参数名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  mounted() {},
  computed: {
    isBthDisabled() {
      if (this.selectCateId.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectCateId.length === 3) {
        return this.selectCateId[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态属性'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data
    },
    selectCate() {
      this.getParamsData()
    },
    handleClick(tab, event) {
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selectCateId.length !== 3) {
        this.selectCateId = []
        this.onlyTableData = this.manyTableData = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    async showEditDialog(attrId) {
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        { attr_sel: this.activeName }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    openDelete(attrId) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          if (res === 'confirm') {
            this.$http
              .delete(`categories/${this.cateId}/attributes/${attrId}`)
              .then(res => {
                res = res.data
                if (res.meta.status !== 200) {
                  this.$message.error(res.meta.msg)
                } else {
                  this.$message.success(res.meta.msg)
                  this.getParamsData()
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
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const {
            data: res
          } = await this.$http.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getParamsData()
          this.editDialogVisible = false
        }
      })
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            }
          )
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.getParamsData()
          this.addDialogVisible = false
        }
      })
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    handleClose(row, i) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag,.button-new-tag {
  margin: 5px;
  width: 120px;
}
</style>

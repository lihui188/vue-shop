/* eslint-disable no-useless-return */
<template>
  <div class="">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe class="table_content">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          label="姓名"
          prop="username"
          width="120"
        ></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column
          label="角色"
          prop="role_name"
          width="120"
        ></el-table-column>
        <el-table-column label="状态" prop="mg_state" width="80">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="openDelete(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="setRole(scope.row)"
              >分配角色</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="100px">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" label-width="100px">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑用户"
      :visible.sync="EditDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form
        :model="editUserForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" label-width="100px">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="40%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          分配角色：<el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    // 校验邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      setRoleDialogVisible: false,
      dialogVisible: false,
      EditDialogVisible: false,
      pageSizes: [5, 10, 20, 50],
      input3: '',
      selectRoleId: '',
      // 获取用户列表参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addForm: {
        username: '',
        password: '123456',
        email: '123456@qq.com',
        mobile: '13556002688'
      },
      editUserForm: {
        username: '',
        email: '',
        mobile: ''
      },
      userInfo: {},
      rolesList: [],
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // this.getUserList()
    this.handleSizeChange(this.pageSizes[0])
  },
  mounted() {},
  methods: {
    getUserList() {
      this.$http.get('users', { params: this.queryInfo }).then(res => {
        res = res.data
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
    // 监听pagesize改变的事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 监听
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    userStateChange(userInfo) {
      this.$http
        .put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        .then(res => {
          res = res.data
          if (res.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state
            return this.$message.error('状态设置失败')
          }
          this.$message.success('更新用户状态成功！')
        })
    },
    handleClose() {
      this.dialogVisible = true
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 可以发起网络请求
          this.$http.post('users', this.addForm).then(res => {
            res = res.data
            if (res.meta.status !== 201) {
              this.addDialogClosed()
              this.$message.error(res.meta.msg)
            } else {
              this.$message.success(res.meta.msg)
              this.dialogVisible = false
              this.getUserList()
            }
          })
        }
      })
    },
    showEditDialog(id) {
      this.$http.get(`users/${id}`).then(res => {
        res = res.data
        if (res.meta.status === 200) {
          this.editUserForm = res.data
        }
      })
      this.EditDialogVisible = true
    },
    editUserInfo() {
      var params = {
        email: this.editUserForm.email,
        mobile: this.editUserForm.mobile
      }
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 可以发起网络请求
          this.$http.put(`users/${this.editUserForm.id}`, params).then(res => {
            res = res.data
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg)
            } else {
              this.$message.success(res.meta.msg)
              this.EditDialogVisible = false
              this.getUserList()
            }
          })
        }
      })
    },
    // 根据id删除用户信息
    openDelete(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          if (res === 'confirm') {
            this.$http.delete(`users/${id}`).then(res => {
              res = res.data
              if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
              } else {
                this.$message.success(res.meta.msg)
                this.getUserList()
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
    setRole(userInfo) {
      this.userInfo = userInfo
      this.$http.get('roles').then(res => {
        res = res.data
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        } else {
          this.rolesList = res.data
          this.setRoleDialogVisible = true
        }
      })
    },
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.getUserList()
        this.setRoleDialogVisible = false
      }
    },
    setRoleDialogClosed() {
      this.selectRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.table_content {
  margin: 10px 0 10px;
}
</style>

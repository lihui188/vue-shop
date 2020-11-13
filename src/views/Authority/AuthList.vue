<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRole">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe class="table_content">
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                ><i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="openDelete(scope.row.id)"
            >删除</el-button>

            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightdialogVisible"
      width="40%"
      @close="setRightClose"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="40%"
      @close="addRoleClosed"
    >
<el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName" label-width="100px">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
</el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="40%"
      @close="editRoleClosed"
    >
<el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName" label-width="100px">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
</el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      setRightdialogVisible: false,
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      rolesList: [],
      rightsList: [],
      defKeys: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      roleId: '',
      addRoleFormRules: {
        roleName: [{
          required: true, message: '请输入角色名称', trigger: 'blur'
        }],
        roleDesc: [{
          required: true, message: '请输入角色描述', trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  mounted() {},
  methods: {
    setRightClose() {
      this.defKeys = []
    },
    getRolesList() {
      this.$http.get('roles').then(res => {
        res = res.data
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        }
        this.rolesList = res.data
      })
    },
    removeRightById(role, rightId) {
      this.$confirm('此操作将修改改用户权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          if (res === 'confirm') {
            this.$http
              .delete(`roles/${role.id}/rights/${rightId}`)
              .then(res => {
                res = res.data
                if (res.meta.status !== 200) {
                  this.$message.error(res.meta.msg)
                } else {
                  this.$message.success(res.meta.msg)
                  role.children = res.data
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
    // 分配权限
    showSetRightDialog(role) {
      this.$http.get('rights/tree').then(res => {
        res = res.data
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        }
        this.rightsList = res.data
        this.roleId = role.id
        this.getLeafKeys(role, this.defKeys)
      })
      this.setRightdialogVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr }).then(res => {
        res = res.data
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getRolesList()
        this.setRightdialogVisible = false
      })
    },
    showAddRole() {
      this.addRoleDialogVisible = true
    },
    addRoleClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    addRoles() {
      this.$refs.addRoleFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入必填内容')
        }
        this.$http.post('roles', this.addRoleForm).then(res => {
          res = res.data
          if (res.meta.status !== 201) {
            this.addRoleClosed()
            this.$message.error(res.meta.msg)
          } else {
            this.$message.success(res.meta.msg)
            this.addRoleDialogVisible = false
            this.getRolesList()
          }
        })
      })
    },
    showEditDialog(id) {
      this.$http.get(`roles/${id}`).then(res => {
        res = res.data
        if (res.meta.status === 200) {
          this.addRoleForm = res.data
        }
      })
      this.editRoleDialogVisible = true
    },
    editRoleClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    editRoles() {
      var params = {
        roleName: this.addRoleForm.roleName,
        roleDesc: this.addRoleForm.roleDesc
      }
      this.$refs.addRoleFormRef.validate(valid => {
        if (valid) {
          // 可以发起网络请求
          this.$http.put(`roles/${this.addRoleForm.roleId}`, params).then(res => {
            res = res.data
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg)
            } else {
              this.$message.success('修改成功')
              this.editRoleDialogVisible = false
              this.getRolesList()
            }
          })
        }
      })
    },
    openDelete(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          if (res === 'confirm') {
            this.$http.delete(`roles/${id}`).then(res => {
              res = res.data
              if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
              } else {
                this.$message.success(res.meta.msg)
                this.getRolesList()
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
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

<template>
  <div class="manage_container">
    <el-backtop :right="100" :bottom="100" target=".manage_container">
      <div
      style="{
        height: 100%;
        width: 100%;
        background-color: #3A5FCD;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #fff;
      }"
    >
    ↑
    </div>
    </el-backtop>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe class="table_content">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  mounted() {},
  methods: {
    getRightsList() {
      this.$http.get('rights/list').then(res => {
        res = res.data
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg)
        }
        this.rightsList = res.data
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.manage_container{
  overflow:scroll;
  height: 100%;
}
</style>

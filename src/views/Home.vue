<template>
  <el-container>
    <el-header class="home_header">
      <div class="left">
        <strong>
          电商后台管理系统
        </strong>
      </div>
      <el-button class="right" type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <common-aside :menus="menus"></common-aside
      ></el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from '../components/CommonAside'
export default {
  components: { CommonAside },
  data() {
    return {
      menus: []
    }
  },
  created() {
    this.getAsideMenus()
  },
  mounted() {},
  methods: {
    getAsideMenus() {
      this.$http.get('menus').then(res => {
        res = res.data
        this.menus = res.data
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      })
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('login')
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  color: #fff;
}
.home_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside{
  background-color: #545C64;
}
</style>

<template>
<div>
  <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu
    :collapse="isCollapse"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#409EFF"
    unique-opened
    :collapse-transition="false"
    :router="true"
    :default-active="$route.path"
  >
    <el-menu-item
      :index="item.path"
      v-for="item in noChildren"
      :key="item.id"
      @click="clickMenu(item)"
    >
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{ item.authName }}</span>
    </el-menu-item>
    <el-submenu
      :index="item.id + ''"
      v-for="(item, index) in hasChildren"
      :key="index"
    >
      <template slot="title">
        <i :class="icons[item.id]"></i>
        <span>{{ item.authName }}</span>
      </template>
      <el-menu-item
        :index="'/'+subItem.path"
        v-for="(subItem, subIndex) in item.children"
        :key="subIndex"
        @click="saveNavState('/'+subItem.path)"
      >
        <i class="el-icon-menu"></i>
        <span>{{ subItem.authName }}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</div>
</template>

<script>
export default {
  props: {
    menus: Array
  },
  computed: {
    noChildren() {
      return this.menus.filter(item => !item.children)
    },
    hasChildren() {
      return this.menus.filter(item => item.children)
    }
  },
  data() {
    return {
      icons: {
        125: 'iconfont icon-User',
        103: 'iconfont icon-tianchongxing-',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-dingdanguanli',
        145: 'iconfont icon-tongji'
      },
      activePath: '',
      isCollapse: false
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    saveNavState(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu {
  height: 100%;
  border: none;
  h3 {
    color: #ffffff;
    text-align: center;
    line-height: 48px;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

<template>
<div class=''>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe class="table_content">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
        ></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
          width="120"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="80"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          width="180"
        >
         <template v-slot="scope">
           {{scope.row.add_time|dateFormat}}
         </template>
         </el-table-column>
        <el-table-column
          label="操作"
          width="120"
        >
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
              @click="openDelete(scope.row.goods_id)"
            ></el-button>
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
</div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 分页参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [],
      total: 0,
      pageSizes: [8, 10, 20, 50]

    }
  },
  created() {
    this.handleSizeChange(this.pageSizes[0])
  },
  mounted() {

  },
  methods: {
    getGoodsList() {
      this.$http.get('goods', { params: this.queryInfo }).then(res => {
        res = res.data
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 监听
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    showEditDialog() {},
    openDelete(goodId) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          if (res === 'confirm') {
            this.$http.delete(`goods/${goodId}`).then(res => {
              res = res.data
              if (res.meta.status !== 200) {
                this.$message.error(res.meta.msg)
              } else {
                this.$message.success(res.meta.msg)
                this.getGoodsList()
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
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类

</style>

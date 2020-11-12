<template>
<div class=''>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe class="table_content">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
        ></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="80"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="80">
          <template v-slot="scope">
            <el-tag type="success" size="mini" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" size="mini" v-else>未付款</el-tag>
         </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="80"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          prop="create_time"
          width="170"
        >
        <template v-slot="scope">
           {{scope.row.create_time|dateFormat}}
         </template>
         </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showProgress"
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
    <el-dialog
      title="编辑地址"
      :visible.sync="EditDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1" label-width="100px">
        <el-cascader
            :props="cascaderConfig"
            v-model="selectCityId"
            :options="cityData"
            clearable
            @change="selectCity"
          ></el-cascader>
          <!-- <el-input v-model="addressForm.address1"></el-input> -->
        </el-form-item>
        <el-form-item label="详细地址" prop="address2" label-width="100px">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="物流详情"
      :visible.sync="progressDialogVisible"
      width="40%"
    >
<el-timeline>
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp">
      {{activity.content}}
    </el-timeline-item>
  </el-timeline>
    </el-dialog>
</div>
</template>

<script>
import cityData from '../../assets/js/citydata.js'
export default {
  components: {},
  data() {
    return {
      selectCityId: [],
      cascaderConfig: {
        expandTrigger: 'hover',
        label: 'label',
        value: 'value',
        children: 'children'
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      EditDialogVisible: false,
      progressDialogVisible: false,
      total: 0,
      pageSizes: [5, 10, 20, 50],
      orderList: [],
      editUserForm: {},
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{
          required: true, message: '请选择省市区', trigger: 'blur'
        }],
        address2: [{
          required: true, message: '请输入详细地址', trigger: 'blur'
        }]
      },
      cityData,
      progressInfo: [],
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  created() {
    this.handleSizeChange(this.pageSizes[0])
  },
  mounted() {

  },
  methods: {
    getOrderList() {
      this.$http.get('orders', { params: this.queryInfo }).then(res => {
        res = res.data
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败')
        }
        this.orderList = res.data.goods
        this.total = res.data.total
      })
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },
    // 监听
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    },
    showEditDialog(id) {
      this.EditDialogVisible = true
    },
    addDialogClosed() {
      this.$refs.addressFormRef.resetFields()
      this.selectCityId = []
    },
    selectCity() {
      console.log(this.selectCityId)
    },
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
    async showProgress() {
      // const { data: res } = await this.$http.get('kuaidi/1106975712662')
      // if (res.meta.status !== 200) {
      //   return this.$message.error(res.meta.msg)
      // }
      // console.log(res.data)
      this.progressDialogVisible = true
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.el-cascader{
  width:100%;
}
</style>

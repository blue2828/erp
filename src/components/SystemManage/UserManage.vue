<template>
  <div>
  <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="用户账号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="userName"
      label="用户名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="empName"
      label="员工编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="imgHeader"
      label="用户头像"
      width="180">
    </el-table-column>
    <el-table-column
      prop="updaterName"
      label="信息修改人">
    </el-table-column>
    <el-table-column
      prop="updaterName"
      label="信息修改时间">
    </el-table-column>
  </el-table>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    @prev-click="prevClick"
    @next-click="nextClick"
    @current-change="currentChange"
    :page-size="pageSize"
    :current-page="currentPage"
  >
  </el-pagination>
  </div>
</template>

<script>
    export default {
      name: 'UserManage',
      data() {
        return {
          tableData: [],
          currentPage: 1,
          total: 0, //总条目数
          pageSize: 10 //每页显示条目个数
        }
      },
      methods: {
        fetchTableData () {
          let _this = this;
          this.$http.get('/api/sys/usr/getAllUser',
            {
              params: { currentPage: this.currentPage, pageSize: this.pageSize }
            }
          ).then(res => { //http://localhost:8088/ == /api
            let userInfo = res.data;
            _this.total = userInfo.total;
            setTimeout(() => {
              alert(_this.total);
            }, 1000);
          }).catch(() => {
            this.$notify({
              type: 'error',
              message: '服务器请求失败',
              title: '数据请求结果',
              duration: 2000
            });
          });
        },
        prevClick (val) {
          this.currentPage = val;
          this.fetchTableData ();
        },
        nextClick (val) {
          this.currentPage = val;
          this.fetchTableData()
        },
        currentChange (val) {
          this.currentPage = val;
          this.fetchTableData();
        }
      },
      created() {
        this.fetchTableData ();
      }
    }
</script>

<style scoped>

</style>

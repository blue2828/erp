<template>
  <div>
    <el-table
      :data="tableData"
      border
      stripe
      highlight-current-row
      type="selection"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55"
        align="center"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="id"
        label="用户账号"
        :sortable="true"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        label="用户名"
        width="180">
        <template slot-scope="scope">
          <el-tag :type="scope.row.tag">{{scope.row.userName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :sortable="true"
        align="center"
        prop="empNo"
        label="员工编号"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="imgHeader"
        label="用户头像"
        width="120">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" width="64" height="64">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="updaterName"
        label="信息修改人">
      </el-table-column>
      <el-table-column
        align="center"
        prop="updateTime"
        label="信息修改时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            circle
            type="primary"
            icon="el-icon-edit"
            >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(scope.row.id)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
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
  import manHeader from '@/assets/images/manHeader.jpg';
  import wmHeader from '@/assets/images/wmHeader.jpg';
    export default {
      name: 'UserManage',
      data() {
        return {
          tableData: [],
          currentPage: 1,
          total: 0, //总条目数
          pageSize: 10, //每页显示条目个数
          manHeader: manHeader
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
            let total = res.data.total;
            let userInfo = res.data;
            let tag = ['info', 'success', 'warning', 'danger'];
            userInfo = userInfo.userInfo.filter((value, index, arr) => { //服务器返回的数据结构不能直接使用，通过filter筛选有用的字段
              value.tag = tag[this.randomData(0, 3)];
              value['empNo'] = value.employee.id;
              value['updaterName'] = value.user.userName;
              value['updateTime'] = this.formatTimeStampToTime(value.updateTime, false);
              $.ajax({ //获取用户头像
                url: '/api/sys/usr/getUserImg',
                async: false,
                dataType: 'json',
                data: { idOrName: value.id },
                success: function (res) {
                  switch (res) {
                    case '' : //如果头像不存在，即用户没有设置头像
                      switch (value.employee.sex) {
                        case 0 : //0表示性别是女，默认头像wmHeader.jpg
                          value['imgUrl'] = wmHeader;
                          break;
                        default : //否则默认头像manHeader.jpg
                          value['imgUrl'] = manHeader;
                      }
                      break;
                    default :
                      value['imgUrl'] = 'data:image/png;base64,' + res
                  }
                },
                error: function (e) {
                  _this.$message({
                    type: 'error',
                    message: '服务器请求失败',
                    showClose: true
                  });
                }
              });

              return arr ;
            });
            _this.tableData = userInfo;
            _this.total = total;
          }).catch(() => {
            _this.$notify({
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
        },
        handleDelete (id) {
          alert(id);
        }
      },
      created() {
        this.fetchTableData ();
      }
    }
</script>

<style scoped>

</style>

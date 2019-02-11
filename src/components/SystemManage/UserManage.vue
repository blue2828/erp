<template>
  <div>
    <el-dialog :modal-append-to-body="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-row>
          <el-col :span="8"><div style="border: 1px solid white;"></div></el-col>
          <el-col :span="8">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img :src="imageUrl" style="width: 120px;height: 120px;border: 4px solid rgba(68, 87, 107, 1);border-radius: 50%;">
            </el-upload>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="0" :status="success"></el-progress>
          </el-col>
          <el-col :span="8"><div style="border: 1px solid white;"></div></el-col>
           </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="用户账号" :label-width="formLabelWidth">
              <el-input v-model="form.id" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
          <el-col :span="10">
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-select v-model="form.userName" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="员工编号" :label-width="formLabelWidth">
              <el-input v-model="form.code" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
          <el-col :span="10">
            <el-form-item label="活动区域" :label-width="formLabelWidth">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-row>
      <el-col :span="1"><el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button></el-col>
      <el-col :span="23"></el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      stripe
      highlight-current-row
      type="selection"
      style="width: 100%;margin-top: 4px;">
      <el-table-column
        type="selection"
        width="55"
        align="center"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="userOrder"
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
          <img :src="scope.row.imgUrl" width="64" height="64" style="border-radius: 50%;">
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
            @click="handleDelete(scope.row.id, scope.row.index)"
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
          manHeader: manHeader,
          dialogFormVisible: false,
          form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          },
          formLabelWidth: '120px',
          dialogTitle: ''
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
              value['empNo'] = value.employee.code;
              value['updaterName'] = value.user.userName;
              value['updateTime'] = this.formatTimeStampToTime(value.updateTime, false);
              value['index'] = index;
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
        handleDelete (id, index) {
          this.$confirm('确定要删除吗', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.get('/api/sys/usr/deleteUser', {
              params: {
                ids: id
              }
            }).then(res => {
              switch (res.data.success) {
                case true :
                  this.$message.success({
                    showClose: true,
                    message: '删除成功'
                  });
                  this.tableData.splice(index, 1);
                  break;
                default :
                  this.$message.error({
                    showClose: true,
                    message: res.data.errMsg == undefined ? "删除失败" : res.data.errMsg
                  });
              }
            }).catch(() => {
              this.$message({
                showClose: true,
                type: 'error',
                message: '服务器请求失败'
              });
            });
          });
        },
        handleAdd () {
          this.dialogFormVisible = true;
          this.dialogTitle = '新增用户';
        }
      },
      created() {
        this.fetchTableData ();
      }
    }
</script>

<style scoped>

</style>

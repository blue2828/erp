<template>
  <div>
    <el-dialog :modal-append-to-body="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :hide-required-asterisk="true" ref="userForm" :status-icon="true">
        <el-row>
          <el-col :span="4"><div style="border: 1px solid white;"></div></el-col>
          <el-col :span="16">
            <el-upload
              ref="uploadField"
              class="avatar-uploader"
              action="/api/sys/usr/uploadUserImg"
              :show-file-list="false"
              :limit="1"
              :data="currentEditUser"
              :drag="true"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img :src="formImageUrl" style="width: 120px;height: 120px;border: 4px solid rgba(68, 87, 107, 1);border-radius: 50%;">
            </el-upload>
            <el-progress v-if="showProgress" :stroke-width="10" :percentage="uploadPercentage" :status="uploadStatus"></el-progress>
          </el-col>
          <el-col :span="4"><div style="border: 1px solid white;"></div></el-col>
           </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="用户账号" :label-width="formLabelWidth" v-if="showExtraFormItem"
                prop="userOrder"
                          :rules="[{ required: true, message: '账号不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.userOrder" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2"  v-if="showExtraFormItem"><div style="border: 1px solid white;"></div></el-col>
          <el-col :span="10">
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName"
               :rules="[{ required: true, message: '用户名不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.userName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2"  v-if="!showExtraFormItem"><div style="border: 1px solid white;"></div></el-col>
          <el-col :span="10" v-if="!showExtraFormItem">
            <el-form-item label="关联员工" :label-width="formLabelWidth" prop="code">
              <el-input @mousedown.native="propTransfer" v-model="form.code" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!showExtraFormItem">
          <el-col :span="10">
            <el-form-item label="用户角色" :label-width="formLabelWidth" prop="role">
              <el-input @mousedown.native="propTransfer" v-model="form.code" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2"  v-if="!showExtraFormItem"><div style="border: 1px solid white;"></div></el-col>
          <el-col :span="10"  v-if="!showExtraFormItem"><div style="border: 1px solid white;"></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="员工编号" prop="code" :label-width="formLabelWidth" v-if="showExtraFormItem">
              <el-input v-model="form.code" autocomplete="off" @mousedown.native="propTransfer"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
          <el-col :span="10">
            <el-form-item v-if="showExtraFormItem" label="用户角色" :label-width="formLabelWidth" prop="role">
              <el-input @mousedown.native="propTransfer" v-model="form.code" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="showBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :modal-append-to-body="false" title="关联员工" :visible.sync="referEmployeeDV">
      <el-row>
        <el-col :span="3"><div style="border: 1px solid white;"></div></el-col>
        <el-col :span="20">
          <el-transfer
            @change="onChangeTransfer"
            :titles="['员工', '已关联']"
            filterable
            filter-placeholder="请输入关键词搜索"
            v-model="selectedEp"
            style="text-align: left;"
            :data="EpdataSource">
          </el-transfer>
        </el-col>
        <el-col :span="1"><div style="border: 1px solid white;"></div></el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="closeEpRefer">关 闭</el-button>
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
            @click="handleEdit(scope.row)"
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
          referEmployeeDV: false,
          form: {
            id: '',
            userName: '',
            code: '',
            userOrder: '',
            empId: ''
          },
          formLabelWidth: '120px',
          dialogTitle: '',
          uploadPercentage: 0,
          showProgress: false,
          uploadStatus: 'text',
          showUploadBtn: false,
          uploadBtn: 'el-icon-upload',
          formImageUrl: '',
          currentEditUser: {
            id: '',
            index: ''
          },
          showExtraFormItem: '',
          showBtnLoading: false,
          showREDVLoading: false,
          selectedEp: [],
          EpdataSource: this.getEpDataSource(),
          transferFromAdd: false
        }
      },
      methods: {
        getEpDataSource () {
          let data;
          let that = this;
          $.ajax({
            url: '/api/baseConfig/employee/queryAllEmployee',
            data: { currentPage: 1 },
            dataType: 'json',
            async: false,
            success: function (res) {
              let EpdataSource = [];
              let remoteData = [];
              remoteData = res.employeeInfo;
              remoteData.forEach((info, index) => {
                EpdataSource.push({
                  label: info.code + ' ' + info.empName,
                  key: info.code
                });
              });
              data = EpdataSource;
            },
            error: function () {
              that.$message.error({
                showClose: true,
                message: '获取员工数据失败',
                duration: 2000
              });
            }
          });
          return data;
        },
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
              value['empId'] = value.employee.id;
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
                  this.total = this.total - 1;
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
        handleEdit (info) {
          this.transferFromAdd = false;
          this.form = {
            id: info.id,
            userName: info.userName,
            code: info.empNo,
            userOrder: info.userOrder,
            empId: info.empId
          };
          this.showExtraFormItem = true;
          this.formImageUrl = info.imgUrl;
          this.dialogFormVisible = true;
          this.dialogTitle = '编辑用户';
          this.currentEditUser.id = info.id;
          this.currentEditUser.index = info.index;
        },
        beforeAvatarUpload (file) {
          let that = this;
          let isImage = this.isImg(file.type);
          if (!isImage) {
            this.$message.error({
              showClose: true,
              message: '不支持的图片格式',
              duration: 2000
            });
            return false;
          }
          let fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function (e) {
            that.formImageUrl = this.result;
          };
          this.showProgress = true;
        },
        handleAvatarSuccess (res, file) {
          let that = this;
          switch (res.success) {
            case true :
              this.uploadStatus = 'success';
              this.uploadPercentage = 100;
              if (this.currentEditUser.id == this.$store.getters.getCurrentUser.id)
                this.$store.dispatch('setAvatarUrl', that.formImageUrl);
              this.$refs['uploadField'].clearFiles();
              let timer = setTimeout(() => {
                this.showProgress = false;
                clearTimeout(timer);
              }, 2000);
              this.tableData = this.tableData.filter((value, index, arr) => {
                if (index == this.currentEditUser.index)
                  value.imgUrl = that.formImageUrl;
                return arr;
              });
              break;
            default :
              this.$message.error({
                showClose: true,
                message: res.errMsg,
                duration: 2000
              });
          }
        },
        handleAdd () {
          this.transferFromAdd = true;
          this.form = {
            id: '',
            userName: '',
            code: '',
            userOrder: '',
            empId: ''
          }
          this.showExtraFormItem = false;
          this.formImageUrl = manHeader;
          this.dialogFormVisible = true;
          this.dialogTitle = '新增用户';
        },
        handleSubmit () {
          this.$refs['userForm'].validate(valid => {
            switch (valid) {
              case true:
                if (!this.isNumed(this.form.userOrder)) {
                  this.$message.error({
                    showClose: true,
                    messsage: '用户账号为数值',
                    duration: 2000
                  });
                  return false;
                }
                this.$http.get('/api/sys/usr/saveUserInfo', {
                  params: {
                    id: this.form.id,
                    userOrder: this.form.userOrder,
                    userName: this.form.userName,
                    employeeId: this.form.empId,
                    updaterId: this.$store.getters.getCurrentUser.id
                  }
                }).then(res => {
                  switch (res.data.success) {
                    case true :
                      this.$message.success({
                        showClose: true,
                        message: '保存成功',
                        duration: 2000
                      });
                      this.dialogFormVisible = false;
                      this.fetchTableData();
                      break;
                    default :
                      this.$message.error({
                        showClose: true,
                        message: res.data.errMsg,
                        duration: 2000
                      });
                  }
                }).catch(() => {
                  this.$message.error({
                    showClose: true,
                    message: '连接服务器失败',
                    duration: 2000
                  });
                });
                break;
              default:
                alert('false');
                return false;
            }
          });
        },
        closeEpRefer () {
          this.referEmployeeDV = false;
          this.selectedEp = [];
        },
        propTransfer () {
          this.referEmployeeDV = true; //打开穿梭框
          switch (this.selectedEp.length) { //如果选中的员工的数组长度
            case 0 : //长度如果是0
              if (this.form.code != undefined && this.form.code != null && this.form.code != '') {
                if (!this.transferFromAdd) {
                  this.selectedEp.push(this.form.code);
                  this.EpdataSource = this.EpdataSource.filter((value, index, arr) => {
                    if (value.key != this.selectedEp[0] && this.form.code != '')
                      value.disabled = true; //disabled设置成true就是禁止勾选
                    return arr;
                  });
                }
              }
              break;
            default :
              if (this.transferFromAdd) { //如果点击的事添加的按钮，如果当前已经选中有员工，就把选中员工的数组清空
                this.selectedEp = [];
                this.EpdataSource = this.EpdataSource.filter((value, index, arr) => { //筛选，把disabled全部去掉，即全部可选
                  value.disabled = false;
                  return arr;
                });
                return;
              }
              this.selectedEp = this.selectedEp.filter((value, index, arr) => {
                return value == this.form.code;
              });
              this.EpdataSource = this.EpdataSource.filter((value, index, arr) => {
                if (this.selectedEp.length != 1)
                  value.disabled = true;
                return arr;
              });
          }
        },
        onChangeTransfer (moveArr, direction) {
          switch (direction) {
            case 'left' :
              switch (this.selectedEp.length) {
                case 0 :
                  this.EpdataSource = this.EpdataSource.filter((value, index, arr) => {
                      value.disabled = false;
                    return arr;
                  });
                  this.form.code = '';
                  this.form.empId = '';
                  break;
              }
              break;
            default :
              switch (this.selectedEp.length) {
                case 1 :
                  this.EpdataSource = this.EpdataSource.filter((value, index, arr) => {
                    if (value.key != this.selectedEp[0])
                      value.disabled = true;
                    return arr;
                  });
                  this.form.code = moveArr[0];
                  this.tableData.forEach((value, index, arr) => {
                    if (value.empNo == moveArr[0]) {
                      this.form.empId = value.empId;
                      return false;
                    }
                  });
                  break;
              }
          }
        }
      },
      created() {
        this.fetchTableData ();
      }
    }
</script>

<style scoped>

</style>

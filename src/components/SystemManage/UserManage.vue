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
              :auto-upload="false"
              action="/api/sys/usr/saveUserInfo"
              :show-file-list="false"
              :data="currentEditUser"
              :drag="true"
              :on-change="onImgSelectChange"
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
              <el-select v-model="selectedEp" filterable clearable  placeholder="请选择">
                <el-option
                  v-for="item in epOptions"
                  :key="item.id"
                  :label="item.empName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!showExtraFormItem">
          <el-col :span="10">
            <el-form-item label="用户角色" :label-width="formLabelWidth" prop="role">
              <el-select v-model="selectedRole" multiple filterable clearable  placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2"  v-if="!showExtraFormItem"><div style="border: 1px solid white;"></div></el-col>
          <el-col :span="10"  v-if="!showExtraFormItem"><div style="border: 1px solid white;"></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="员工编号" prop="code" :label-width="formLabelWidth" v-if="showExtraFormItem">
              <el-select v-model="selectedEp" filterable clearable  placeholder="请选择">
                <el-option
                  v-for="item in epOptions"
                  :key="item.id"
                  :label="item.empName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
          <el-col :span="10">
            <el-form-item v-if="showExtraFormItem" label="用户角色" :label-width="formLabelWidth" prop="role">
              <el-select v-model="selectedRole" multiple filterable clearable  placeholder="请选择" >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="closeInfoFrame">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="showBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-row>
      <el-col :span="2"><el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button></el-col>
      <el-col :span="3"><el-button type="danger" icon="el-icon-delete" @click="handleDelete(checkboxSelectData, -1, true)">批量删除</el-button></el-col>
      <el-col :span="2"><el-button type="info" icon="el-icon-printer" @click="handleExport">导出</el-button></el-col>
      <el-col :span="6">
        <el-input :clearable="true" v-model="searchAccount" autocomplete="off" placeholder="根据用户名或者用户账号搜索"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" @click="fetchTableData">搜索</el-button>
      </el-col>
      <el-col :span="9"></el-col>
    </el-row>
    <el-table
      @selection-change="onTableChange"
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
            @click="handleDelete(scope.row.id, scope.row.index, false)"
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
  import Qs from 'qs';
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
          currentEditUser: {},
          editUser: {},
          formLabelWidth: '120px',
          dialogTitle: '',
          uploadPercentage: 0,
          showProgress: false,
          uploadStatus: 'text',
          showUploadBtn: false,
          uploadBtn: 'el-icon-upload',
          formImageUrl: '',
          showExtraFormItem: '',
          showBtnLoading: false,
          showREDVLoading: false,
          selectedRole: [],
          selectedEp: '',
          epOptions: '',
          roleOptions: '',
          isSelectedImgFile: false, //是否已经选中头像图片
          isEdit: false,
          checkboxSelectData: [],
          searchAccount: ''
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
              that.epOptions = res.employeeInfo;
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
              params: { currentPage: this.currentPage, pageSize: this.pageSize, searchAccount: this.searchAccount }
            }
          ).then(res => { //http://localhost:8088/ == /api
            let total = res.data.total;
            let userInfo = res.data;
            let tag = ['info', 'success', 'warning', 'danger'];
            let newArr = [];
            userInfo = userInfo.userInfo.filter((value, index, arr) => { //服务器返回的数据结构不能直接使用，通过filter筛选有用的字段
              value.tag = tag[this.randomData(-1, 3)];
              value['empNo'] = value.employee == null ? '暂未关联' : value.employee.code;
              value['updaterName'] = value.user[0].userName;
              value['updateTime'] = this.formatTimeStampToTime(value.updateTime, false);
              value['index'] = index;
              value['empId'] = value.employee == null ? '' : value.employee.id;
              value['roleList'] = value.roleList;
              $.ajax({ //获取用户头像
                url: '/api/sys/usr/getUserImg',
                async: false,
                dataType: 'json',
                data: { idOrName: value.id },
                success: function (res) {
                  switch (res) {
                    case '' : //如果头像不存在，即用户没有设置头像
                      switch (value.employee == null ? 1 : value.employee.sex) {
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
            /**
             * 去重
             * @type {Array}
             */
            newArr = userInfo.filter((value, index, arr) => {
              if (index != userInfo.length - 1) {
                return arr[index].id != arr[index + 1].id;
              }
            });
            let newOneArr = newArr.filter((value, index, arr) => {
              return value.id == userInfo[userInfo.length - 1].id;
            });
            if (newOneArr.length == 0)
              newArr.push(userInfo[userInfo.length - 1]);
            _this.tableData = newArr;
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
        onTableChange (selection) {
          switch (selection.length) {
            case 0 :
              this.checkboxSelectData = [];
              break;
            default:
              this.checkboxSelectData = selection;
          }
        },
        handleDelete (id, index, dulpicate) {
          if (dulpicate && this.checkboxSelectData.length == 0) {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: '请选择需要删除的数据'
            });
            return;
          }
          this.$confirm('确定要删除吗', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            switch (dulpicate) {
              case true :
                this.checkboxSelectData.forEach((value, index, arr) => {
                  ids.push(value.id);
                });
                break;
            }
            this.$http.get('/api/sys/usr/deleteUser', {
              params: {
                ids: dulpicate ? ids.join(",") : id
              }
            }).then(res => {
              switch (res.data.success) {
                case true :
                  this.$message.success({
                    showClose: true,
                    message: '删除成功'
                  });
                  this.fetchTableData();
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
        handleExport () {

          if (this.checkboxSelectData.length == 0) {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: '请选择需要导出的数据'
            });
            return;
          }

          let requiredAttr = ['empNo', 'updaterName', 'userOrder', 'userName', 'updateTime'];
          let copyData = [];
          this.checkboxSelectData.forEach((value, index, arr) => {
            let obj = {};
            Object.keys(value).forEach((val, key, array) => {
              if ($.inArray(val, requiredAttr) > -1) {
                obj[val] = value[val];
              }
            });
            copyData.push(obj);
          });
          let newdata = new URLSearchParams();
          newdata.append("data", JSON.stringify(copyData));
          window.open('/api/sys/usr/exportUserInfoToExcel?data=' + newdata, '_blank');
        },
        handleEdit (info) {
          this.isEdit = true;
          let roleIdSet = new Set();
          this.selectedRole = [];
          this.selectedEp = info.empId;
          this.editUser = info;
          this.$http.get('/api/sys/role/getRolesByUserId', {
            params: {
              userId: info.id
            }
          }).then((res) => {
            res.data.roleList.forEach((value, index, arr) => {
              this.selectedRole.push(value.id);
            });
          }).catch(() => {
            this.$message.error({
              showClose: true,
              message: '请求当前修改的用户角色失败',
              duration: 2000
            });
          });
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
        },
        onImgSelectChange (file, fileList) {
            this.formImageUrl = URL.createObjectURL(file.raw);
            this.isSelectedImgFile = true;
        },
        beforeAvatarUpload (file) {
          let isImage = this.isImg(file.type);
          if (!isImage) {
            this.$message.error({
              showClose: true,
              message: '不支持的图片格式',
              duration: 2000
            });
            return false;
          }
          this.showProgress = true;
          let promise = new Promise((resolve) => {
            this.$nextTick(function () {
              resolve(true);
            });
          });
          return promise;
        },
        handleAvatarSuccess (res, file) {
          let that = this;
          this.showBtnLoading = false;
          switch (res.success) {
            case true :
              this.uploadStatus = 'success';
              this.uploadPercentage = 100;
              if (this.currentEditUser.id == this.$store.getters.getCurrentUser.id) //如果修改的用户是当前登录用户，重新获取头像
                // （如果修改了头像，则index.vue的两个头像会跟着改变）
                this.$store.dispatch('setAvatarUrl', that.formImageUrl);
              let timer = setTimeout(() => {
                this.showProgress = false;
                clearTimeout(timer);
              }, 2000);
              break;
            default :
              this.$message.error({
                showClose: true,
                message: res.errMsg,
                duration: 2000
              });
              this.showBtnLoading = false;
          }
          this.fetchTableData();
          this.dialogFormVisible = false;
        },
        handleAdd () {
          this.selectedRole = [];
          this.selectedEp = '';
          this.isEdit = false;
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
          this.showBtnLoading = true;
          let params = {
            id: this.form.id,
            userOrder: this.form.userOrder,
            userName: this.form.userName,
            employeeId: this.selectedEp,
            updaterId: this.$store.getters.getCurrentUser.id,
            roleIds: this.selectedRole.join(","),
            isEdit: this.isEdit
          };
          switch (this.isEdit) { //如果是添加的是把id去掉，不然后台会报类型转换错误
            case false :
              delete params.id;
              break;
          }
          this.currentEditUser = params;
          if (this.isSelectedImgFile) {
            this.$refs.uploadField.submit();
            return false;
          }
          this.$refs['userForm'].validate(valid => {
            switch (valid) {
              case true:
                if (!this.isNumed(this.form.userOrder) && this.isEdit) {
                  this.$message.error({
                    showClose: true,
                    message: '用户账号为数值',
                    duration: 2000
                  });
                  this.showBtnLoading = false;
                  return false;
                }
                if(this.selectedRole.length == 0) {
                  this.$message.error({
                    showClose: true,
                    message: '请选择角色',
                    duration: 2000
                  });
                  this.showBtnLoading = false;
                  return false;
                }
                this.$http.get('/api/sys/usr/saveUserInfo', {
                  params: params
                }).then(res => {
                  this.showBtnLoading = false;
                  switch (res.data.success) {
                    case true :
                      this.$message({
                        type: 'success',
                        showClose: true,
                        message: '保存成功',
                        duration: 2000
                      });
                      this.dialogFormVisible = false;
                      break;
                    default :
                      this.$message.error({
                        showClose: true,
                        message: res.data.errMsg,
                        duration: 2000
                      });
                  }
                  this.fetchTableData();
                  this.dialogFormVisible = false;
                }).catch(() => {
                  this.fetchTableData();
                  this.showBtnLoading = false;
                  this.$message.error({
                    showClose: true,
                    message: '连接服务器失败',
                    duration: 2000
                  });
                });
                break;
              default:
                return false;
            }
          });
        },
        closeInfoFrame () {
          this.dialogFormVisible = false;
          this.selectedRole = [];
          this.isSelectedImgFile = false;
          this.showBtnLoading = false;
          this.showProgress = false;
          this.formImageUrl = manHeader;
        }
      },
      created() {
        this.fetchTableData ();
      },
      mounted() {
        this.$http.get('/api/sys/role/queryAllRoles').then(res => {
          let roleIdsSet = new Set();
          let roles = [];
          res.data.roleList.forEach((value, index, arr) => {
            roleIdsSet.add(value.id);
          });
          roleIdsSet.forEach((value, index, arr) => {
            let temp = res.data.roleList.filter((val, key, array) => {
              return val.id == value;
            });
            roles.push(temp[0]);
          });
          this.roleOptions = roles;
        }).catch(() => {
          this.$notify.error({
            message: '获取角色列表失败',
            title: '系统提示',
            duration: 2000
          });
        });
        this.getEpDataSource();
      }
    }
</script>

<style scoped>

</style>

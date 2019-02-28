<template>
  <el-row>
    <el-col :span="5">
      <el-table
        @current-change="handleCurrentChange"
        ref="roleTable"
        highlight-current-row
        size="mini"
        :data="tableData"
        style="width: 226px;">
        <el-table-column
          align="center"
          prop="roleName"
          label="员工权限"
          width="100">
          <template slot-scope="scope" >
            <span v-if="currentEditRoleId != scope.row.id">{{ scope.row.roleName }}</span>
            <el-input v-model="currentEditUserName" size="small" v-if="editRoleName && currentEditRoleId == scope.row.id"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="126"
          prop=""
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="small" circle @click="onEdit(scope.row)">{{ currentEditRoleId != scope.row.id ? '修改' : '保存' }}</el-button>
            <el-button type="danger" size="small" circle @click="saveRole_Permission">配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="19">
      <div v-for="(value, index) in parentName">
          <div :style="{ margin: index != 0 ? '16px 0 0 10px' : '0 0 0 10px', textAlign: 'left' }">
            <span style="font-size: 14px;color: #606266;margin-right: 20px;">{{ value.parentName }}</span>
            <el-checkbox :label="val.name" name="type" v-for="val in value.sub" v-model="val.checked"></el-checkbox>
          </div>
      </div>
      <div style="text-align: left;margin-top: 20px;">
        <el-button type="primary" @click="saveRole_Permission">保存</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
    export default {
        name: "Role_Permission",
        data () {
          return {
            tableData: [],
            editRoleName: false,
            currentEditUserName: '',
            currentEditRoleId: '',
           // permissionList: [],
            parentName: [],
            tempPermission: [],
            isEdit: false,
            currentRow: '',
            entryVue: 0
          }
        },
      methods: {
        fetchRoleTbData () {
          return new Promise((resolve, reject) => {
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
              roles = roles.filter((value, index, arr) => {
                value.index = index;
                return arr;
              });
              this.tableData = roles;
              resolve(this.tableData);
            }).catch(() => {
              this.$notify.error({
                message: '获取角色列表失败',
                title: '系统提示',
                duration: 2000
              });
            });
          });
        },
        onEdit (arg) {
          this.isEdit = !this.isEdit;
          this.currentEditRoleId = arg.id;
          this.editRoleName = true;
          if (this.isEdit) {
            this.currentEditUserName = arg.roleName;
            return;
          }
          this.$http.get('/api/sys/role/editRole', {
            params: {
              'id': arg.id,
              'roleName': this.currentEditUserName,
              'updaterId': this.$store.getters.getCurrentUser.id
            }
          }).then(res => {
            switch (res.data.success) {
              case true :
                this.editRoleName = false;
                this.currentEditRoleId = -1;
                this.fetchRoleTbData().then(res => {
                  this.$refs.roleTable.setCurrentRow(this.tableData[arg.index]);
                });
                this.$message.success({
                  showClose: true,
                  message: '保存成功',
                  duration: 2000
                });
                break;
              default :
                this.$message.error({
                  showClose: true,
                  message: res.data.errMsg,
                  duration: 2000
                });
            }
          });
        },
        fetchPermissionData () {
          return new Promise((resolve, reject) => {
            this.$http.get('/api/sys/permission/getAllPermissionOnly').then(res => {
              //this.permissionList = res.data.list;
              let tempNameSet = new Set();
              let tempIdSet = new Set();
              res.data.list.forEach((value, index, arr) => {
                tempNameSet.add(value.parentName);
                tempIdSet.add(value.parentId);
              });
              this.parentName = [];
              let tempNameArr = [];
              tempNameSet.forEach(value => {
                tempNameArr.push(value);
              });
              let tempIdArr = [];
              tempIdSet.forEach(value => {
                tempIdArr.push(value);
              });
              tempNameArr.forEach((value, index) => {
                tempIdArr.forEach((val, key) => {
                  if (index == key ) {
                    this.parentName.push({ 'parentId': val, 'parentName': value, sub: [] });
                  }
                })
              });
              res.data.list.forEach((value, index, arr) => {
                this.parentName.forEach((val, key, array) => {
                  if (value.parentId == val.parentId)
                    val.sub.push({ 'id': value.id, 'permission': value.permission, 'name': value.name, checked: false });
                });
              });
            }).catch(() => {
              this.$message.error({
                message: '获取菜单列表失败',
                duration: 2000,
                showClose: true
              });
            });
          });
        },
        handleCurrentChange (val) {
          this.currentRow = val;
          this.clearPsChecked();
          this.fetchPsByRoleId(val);
        },
        async syncFetchPermissionData () {
          await this.fetchPermissionData();
        },
        fetchPsByRoleId (val) {
          return new Promise((resolve, reject) => {
            this.$http.get('api/sys/permission/getPsByRoleId', {
              params: {
                roleId: this.currentRow.id == undefined || this.currentRow.id == '' || this.currentRow.id == null ? val.id : this.currentRow.id
              }
            }).then(res => {
              let temp = [];
              temp = this.parentName.filter((value, index, arr) => {
                value.sub.filter((v, i, a) => {
                  res.data.list.forEach((val, key, array) => {
                    if (val.id == v.id)
                      v.checked = true;
                  });
                  return a;
                });
                return arr;
              });
              this.parentName = temp;
            }).catch(() => {
              this.$notify.error({
                title: '获取当前选中行的角色对应菜单',
                message: '获取失败',
                showClose: true,
                duration: 2000
              });
            });
          });
        },
        clearPsChecked () {
            let temp = this.parentName.filter((value, index, arr) => {
              value.sub.filter((val, key, array) => {
                val.checked = false;
                return array;
              });
              return arr;
            });
            this.parentName = temp;
        },
        saveRole_Permission () {
          let temp = [];
          this.parentName.forEach((value, index, arr) => {
            value.sub.forEach((val, key, array) => {
              switch (val.checked) {
                case true:
                  temp.push({ roleId: this.currentRow.id, p_id: val.id });
                  break;
              }
            });
          });
          let toRemoteParams = new URLSearchParams();
          toRemoteParams.append('role_permission', JSON.stringify(temp));
          this.$http({
            url: '/api/sys/role/saveRole_Permission',
            method: 'post',
            data: toRemoteParams
          }).then(res => {
            switch (res.data.success) {
              case true:
                this.$message.success({
                  message: '保存成功',
                  showCose: true,
                  duration: 2000
                });
                break;
              default:
                this.$notify.error({
                  title: '系统提示',
                  message: res.data.errMsg,
                  showCose: true,
                  duration: 2000
                });
            }
          }).catch(() => {
            this.$notify.error({
              title: '系统提示',
              message: '请求服务器保存失败',
              showCose: true,
              duration: 2000
            });
          });
        }
      },
      created() {
        this.syncFetchPermissionData();
        let roleTbData = this.fetchRoleTbData();
        roleTbData.then(res => {
          this.$refs.roleTable.setCurrentRow(res[0]);  //默认选中第表格第一行
          this.fetchPsByRoleId();
          //this.entryVue = 1;
        });
    }
    }
</script>

<style scoped>
</style>

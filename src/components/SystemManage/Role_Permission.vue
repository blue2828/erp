<template>
  <el-row>
    <el-col :span="5">
      <el-table
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
            <el-button type="primary" size="small" circle @click="onEdit(scope.row)">{{ currentEditRoleId != scope.row.id ? '修改' : '保存'}}</el-button>
            <el-button type="danger" size="small" circle>配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="19">
      <div v-for="(value, index) in parentName">
          <div style="margin-left: 10px;text-align: left;">
            <span style="font-size: 14px;color: #606266;">{{ value.parentName }}</span>
            <el-checkbox :label="val.name" name="type" v-for="val in value.sub"></el-checkbox>
          </div>
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
            permissionList: [],
            parentName: [],
            tempPermission: []
          }
        },
      methods: {
        onEdit (arg) {
          this.currentEditRoleId = arg.id;
          this.editRoleName = true;
          this.currentEditUserName = arg.roleName;
        },
        fetchPermissionData () {
          return new Promise((resolve, reject) => {
            this.$http.get('/api/sys/permission/getAllPermissionOnly').then(res => {
              this.permissionList = res.data.list;
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
                    this.parentName.push({'parentId': val, 'parentName': value, sub: []});
                  }
                })
              });
              res.data.list.forEach((value, index, arr) => {
                this.parentName.forEach((val, key, array) => {
                  if (value.parentId == val.parentId)
                    val.sub.push({ 'id': value.id, 'permission': value.permission, 'name': value.name});
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
        async changeAsyncToSync () {
          await this.fetchPermissionData();
        }
      },
      created() {
          this.changeAsyncToSync();
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
          this.tableData = roles;
        }).catch(() => {
          this.$notify.error({
            message: '获取角色列表失败',
            title: '系统提示',
            duration: 2000
          });
        });
      }
    }
</script>

<style scoped>

</style>

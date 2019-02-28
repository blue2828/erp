<template>
  <div>
    <el-row>
      <el-col :span="2"><el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button></el-col>
      <el-col :span="3"><el-button type="danger" icon="el-icon-delete" @click="handleDelete(checkboxSelectData, -1, true)">批量删除</el-button></el-col>
      <el-col :span="2"><el-button type="info" icon="el-icon-printer" @click="handleExport">导出</el-button></el-col>
      <el-col :span="17">
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.goodsOrder" autocomplete="off" placeholder="员工编号"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.goodsName" autocomplete="off" placeholder="员工名称"></el-input>
        <el-select v-model="selectedSex" clearable  placeholder="性别" style="width: 120px;">
          <el-option label="女" value="0"/>
          <el-option label="男" value="1"/>
        </el-select>
        <el-date-picker v-model="selectedBirthday" type="date" placeholder="生日" />
        <el-button type="primary" icon="el-icon-search" @click="fetchTableData">搜索</el-button>
      </el-col>
    </el-row>
    <el-table
      @selection-change="onTableChange"
      :data="tableData"
      width="100%"
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="员工编号">
              <span>{{ props.row.code }}</span>
            </el-form-item>
            <el-form-item label="员工名称">
              <span><el-tag :type="props.row.tag">{{ props.row.empName }}</el-tag></span>
            </el-form-item>
            <el-form-item label="身份证">
              <span>{{ props.row.idCard.substring(0, 3) }}******{{ props.row.idCard.substring(props.row.idCard.length - 4) }}</span>
            </el-form-item>
            <el-form-item label="手机">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.strSex }}</span>
            </el-form-item>
            <el-form-item label="生日">
              <span>{{ props.row.birthday }}</span>
            </el-form-item>
            <el-form-item label="住址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="邮箱">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="身份">
              <span>{{ props.row.roleNames }}</span>
            </el-form-item>
            <el-form-item label="信息修改人">
              <span>{{ props.row.userName }}</span>
            </el-form-item>
            <el-form-item label="信息修改时间">
              <span>{{ props.row.updateTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="code"
        label="员工编号"
        :sortable="true"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="员工名称"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.tag">{{ scope.row.empName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        prop="idCard"
        label="身份证">
      </el-table-column>
      <el-table-column
        sortable
        align="center"
        prop="mobile"
        label="手机">
      </el-table-column>
      <el-table-column
        align="center"
        prop="strSex"
        label="性别">
      </el-table-column>
      <el-table-column
        align="center"
        prop="birthday"
        label="生日"
        width="120"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="address"
        label="住址">
      </el-table-column>
      <el-table-column
        align="center"
        prop="email"
        label="邮箱"
        width="120"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="roleNames"
        label="身份">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="150"
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
    export default {
        name: "EmployeeManage",
      data () {
        return {
          tableData: [],
          currentPage: 1,
          total: 0, //总条目数
          pageSize: 10, //每页显示条目个数
          searchForm: {
            empName: '',
            code: '',
          },
          selectedSex: '',
          selectedBirthday: ''
        }
      },
      methods: {
        fetchTableData () {
          this.$http.get('/api/baseConfig/employee/queryAllEmployee', {
            params: {
              empName: this.searchForm.empName,
              code: this.searchForm.code,
              s_sex: this.selectedSex,
              s_birthday: this.selectedBirthday,
              currentPage: this.currentPage,
              pageSize: this.pageSize
            }
          }).then(res => {
            let _this = this;
            this.total = res.data.count;
            let tag = ['info', 'success', 'warning', 'danger'];
            let tempData = res.data.employeeInfo.filter((value, index, arr) => {
              value.tag = tag[this.randomData(-1, 3)];
              value.strSex = value.sex == 0 ? '女' : '男';
              value.updateTime = this.formatTimeStampToTime(value.updateTime, false);
              value.birthday = this.formatTimeStampToTime(value.birthday, true);
              value.idCard = value.idCard.substring(0, 3) + '******' + value.idCard.substring(value.idCard.length - 4);
              value.userName = value.user[0] == null || value.user[0] == undefined ? '无' : value.user[0].userName;
              let tempRoleNameArr = new Set();
              if (value.selfUser != null && value.selfUser != undefined) {
                value.selfUser.forEach((val, key, array) => {
                  val.roleList.forEach((v, i, a) => {
                    tempRoleNameArr.add(v.roleName);
                  });
                });
              }
              let temp = [];
              tempRoleNameArr.forEach(value => {
                temp.push(value);
              });
              value.roleNames = temp.join(",");
              return arr;
            });
            this.tableData = tempData;
          }).catch(() => {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: '获取员工信息失败'
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
        onTableChange () {

        },
        handleDelete () {

        },
        handleEdit () {

        },
        handleAdd () {

        },
        handleExport () {

        }
      },
      created () {
        this.fetchTableData();
      }
    }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

<template>
  <div>
    <el-dialog :modal-append-to-body="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :hide-required-asterisk="true" ref="repoForm" :status-icon="true">
        <el-row>
          <el-col :span="10">
            <el-form-item label="仓库名称" :label-width="formLabelWidth"
                          prop="repoName"
                          :rules="[{ required: true, message: '仓库名称不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.repoName" autocomplete="off"></el-input>
            </el-form-item>
            <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
          </el-col>
          <el-col :span="10">
            <el-form-item label="地址" :label-width="formLabelWidth"
                          prop="address"
                          :rules="[{ required: true, message: '地址不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.address" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="管理员" :label-width="formLabelWidth"
                          prop="adminId"
            >
              <el-select v-model="selectedEp" filterable clearable  placeholder="请选择">
                <el-option
                  v-for="item in epOptions"
                  :key="item.id"
                  :label="item.empName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
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
        <el-input :clearable="true" v-model="searchSth" autocomplete="off" placeholder="根据仓库名或者仓库编号搜索"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" @click="fetchTableData">搜索</el-button>
      </el-col>
      <el-col :span="9"></el-col>
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
            <el-form-item label="仓库编号">
              <span>{{ props.row.repoCode }}</span>
            </el-form-item>
            <el-form-item label="仓库名称">
              <span><el-tag :type="props.row.tag">{{ props.row.repoName }}</el-tag></span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="管理员">
              <span>{{ props.row.employee.empName }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.mark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="repoCode"
        label="仓库编号"
        :sortable="true"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="仓库名称"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.tag">{{ scope.row.repoName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="address"
        label="地址">
      </el-table-column>
      <el-table-column
        align="center"
        prop="employee.empName"
        label="管理员">
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
        name: "RepoManage",
      data () {
        return {
          tableData: [],
          currentPage: 1,
          total: 0, //总条目数
          pageSize: 10, //每页显示条目个数
          searchSth: '',
          dialogTitle: '',
          form: {

          },
          showBtnLoading: false,
          dialogTitle: '',
          dialogFormVisible: false,
          checkboxSelectData: [],
          formLabelWidth: '120px',
          epOptions: [],
          selectedEp: ''
        }
      },
      methods: {
        fetchTableData () {
          let toRemoteParams = new URLSearchParams();
          toRemoteParams.append('orderOrName', this.searchSth);
          toRemoteParams.append('pageEntity', { currentPage: this.currentPage, pageSize: this.pageSize });
          this.$http({
            url: '/api/baseConfig/repo/queryAllRepo',
            method: 'post',
            data: toRemoteParams
          }).then(res => {
            let _this = this;
            this.total = res.data.count;
            let tag = ['info', 'success', 'warning', 'danger'];
            let tempData = res.data.list.filter((value, index, arr) => {
              value.tag = tag[this.randomData(-1, 3)];
              return arr;
            });
            this.tableData = tempData;
          }).catch(() => {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: '获取仓库信息失败'
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
        closeInfoFrame () {
          this.dialogFormVisible = false;
          this.$refs.repoForm.resetFields();
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
          });
        },
        handleEdit (row) {
          this.dialogTitle = '编辑仓库';
          this.dialogFormVisible = true;
          this.form = row;
          this.selectedEp = row.employee.id;
        },
        handleAdd () {
          this.dialogTitle = '新增仓库';
          this.dialogFormVisible = true;
        },
        handleSubmit () { //提交表单
          this.showBtnLoading = true;
          let params = this.form;
          this.$refs['repoForm'].validate(valid => {
            switch (valid) {
              case true:
                /* this.$http.get('/api/baseConfig/goods/editGoods', { //请求保存订单的ajax /api表示的事http://localhost:8088/
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
                       let timer = setTimeout(() => {
                         this.showProgress = false;
                         clearTimeout(timer);
                       }, 1000);
                       this.dialogFormVisible = false;
                       this.closeInfoFrame();
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
                 });*/
                break;
              default:
                this.showBtnLoading = false;
                return false;
            }
          });
        },
        handleExport () {

        },
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
        }
      },
      created () {
        this.fetchTableData();
        this.getEpDataSource();
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

<template>
  <div>
    <el-dialog :modal-append-to-body="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :hide-required-asterisk="true" ref="supplierForm" :status-icon="true">
        <el-row>
          <el-col :span="10">
            <el-form-item label="供应商名称" :label-width="formLabelWidth"
                          prop="supName"
                          :rules="[{ required: true, message: '供应商名称不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.supName" autocomplete="off"></el-input>
            </el-form-item>
            <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系人" :label-width="formLabelWidth"
                          prop="linkMan"
                          :rules="[{ required: true, message: '联系人不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.linkMan" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="联系电话" :label-width="formLabelWidth"
                          prop="mobile"
                          :rules="[{ required: true, message: '联系电话不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>
            <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系地址" :label-width="formLabelWidth"
                          prop="address"
                          :rules="[{ required: true, message: '联系地址不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.address" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="form.mark"></el-input>
          </el-form-item>
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
        <el-input :clearable="true" v-model="searchSth" autocomplete="off" placeholder="供应商名称"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" v-model="searchSth" @click="fetchTableData">搜索</el-button>
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
            <el-form-item label="编号">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="供应商名称">
              <span><el-tag :type="props.row.tag">{{ props.row.supName }}</el-tag></span>
            </el-form-item>
            <el-form-item label="联系人">
              <span>{{ props.row.linkMan }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="联系地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.mark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="id"
        label="编号"
        :sortable="true"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="供应商名称"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.tag">{{ scope.row.supName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="linkMan"
        label="联系人">
      </el-table-column>
      <el-table-column
        align="center"
        prop="mobile"
        label="联系电话">
      </el-table-column>
      <el-table-column
        align="center"
        prop="sub_address"
        label="联系地址">
      </el-table-column>
      <el-table-column
        align="center"
        prop="sub_mark"
        label="描述">
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
        name: "SupplierManage",
      data () {
        return {
          tableData: [],
          currentPage: 1,
          total: 0, //总条目数
          pageSize: 10, //每页显示条目个数
          searchSth: '',
          dialogTitle: '',
          dialogFormVisible: false,
          formLabelWidth: '120px',
          showBtnLoading: false,
          form: {
            id: '',
            supName: '',
            linkMan: '',
            mobile: '',
            address: '',
            mark: '',
          },
          checkboxSelectData: [],
          isEdit: false
        }
      },
      methods: {
        fetchTableData () { //获取销售订单
          let toRemoteParams = new URLSearchParams();
          toRemoteParams.append('supplierName', this.searchSth);
          toRemoteParams.append('pageEntity', { currentPage: this.currentPage, pageSize: this.pageSize });
          this.$http({
            url: '/api/buyManage/supplier/queryAllSupplier',
            method: 'post',
            data: toRemoteParams
          }).then(res => {
            let _this = this;
            this.total = res.data.count;
            let tag = ['info', 'success', 'warning', 'danger'];
            let tempData = res.data.list.filter((value, index, arr) => {
              value.tag = tag[this.randomData(-1, 3)];
              value.sub_address = value.address.substring(0, 7) + (value.address.length > 7 ? '...' : '');
              value.sub_mark = value.mark.substring(0, 7) + (value.address.length > 7 ? '...' : '');
              return arr;
            });
            this.tableData = tempData;
          }).catch(() => {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: '获取供应商信息失败'
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
          });
        },
        handleEdit (row) {
          this.dialogTitle = '编辑供应商';
          this.dialogFormVisible = true;
          this.form = row;
          this.isEdit = true;
        },
        handleAdd () {
          this.dialogTitle = '新增供应商';
          this.dialogFormVisible = true;
          this.isEdit = false;
        },
        handleExport () {

        },
        closeInfoFrame () {
          this.dialogFormVisible = false;
          this.$refs.supplierForm.resetFields();
        },
        handleSubmit () { //提交表单
          this.showBtnLoading = true;
          let params = this.form;
          params.isEdit = this.isEdit;
          this.$refs['supplierForm'].validate(valid => {
            switch (valid) {
              case true:
                this.$http.get('/api/buyManage/supplier/saveSupplier', { //请求保存订单的ajax /api表示的事http://localhost:8088/
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
                });
                break;
              default:
                this.showBtnLoading = false;
                return false;
            }
          });
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

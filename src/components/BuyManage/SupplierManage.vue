<template>
  <div>
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
          searchSth: ''
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

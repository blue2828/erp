<template>
  <div>
    <el-dialog :modal-append-to-body="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :hide-required-asterisk="true" ref="goodForm" :status-icon="true">
        <el-row>
          <el-col :span="10">
            <el-form-item label="目标客户" :label-width="formLabelWidth"
                          prop="customerId"
            >
              <el-select v-model="form.customerId" filterable clearable  placeholder="请选择">
                <el-option
                  v-for="item in cusOptions"
                  :key="item.id"
                  :label="item.cusName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2"><span style="border: 1px solid white;"></span></el-col>
          <el-col :span="10">
            <el-form-item label="售出数量" :label-width="formLabelWidth"
                          prop="count"
                          :rules="[{ required: true, message: '请输入售出数量' }]"
            >
              <el-input :clearable="true" v-model="form.count" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="单价" :label-width="formLabelWidth"
                          prop="unitPrice"
                          :rules="[{ required: true, message: '请输入单价' }]"
            >
              <el-input :clearable="true" v-model="form.unitPrice" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2"><span style="border: 1px solid white;"></span></el-col>
          <el-col :span="10">
            <el-form-item label="付款" :label-width="formLabelWidth"
                          prop="state"
            >
              <el-select v-model="form.state" filterable clearable  placeholder="请选择">
                <el-option
                  label="已付款"
                  value="0">
                </el-option>
                <el-option
                  label="未付款"
                  value="1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.descs"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="closeInfoFrame">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="showBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-row>
      <el-col :span="13">
        <el-button type="info" icon="el-icon-printer" @click="handleExport">导出</el-button>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.goodsName" autocomplete="off" placeholder="货品名称"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.type" autocomplete="off" placeholder="货品类别"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.repoName" autocomplete="off" placeholder="仓库"></el-input>
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
            <el-form-item label="货品编号">
              <span>{{ props.row.goods.goodOrder }}</span>
            </el-form-item>
            <el-form-item label="货品名称">
              <span><el-tag :type="props.row.tag">{{ props.row.goods.goodsName }}</el-tag></span>
            </el-form-item>
            <el-form-item label="规格">
              <span>{{ props.row.goods.size }}</span>
            </el-form-item>
            <el-form-item label="货品类型">
              <span>{{ props.row.goods.g_type }}</span>
            </el-form-item>
            <el-form-item label="计量单位">
              <span>{{ props.row.goods.unit }}</span>
            </el-form-item>
            <el-form-item label="采购价">
              <span>{{ props.row.goods.buyPrice }}</span>
            </el-form-item>
            <el-form-item label="零售价">
              <span>{{ props.row.goods.salePrice }}</span>
            </el-form-item>
            <el-form-item label="库存量">
              <span>{{ props.row.realCount }}</span>
            </el-form-item>
            <el-form-item label="销售量">
           <span>{{ props.row.saleCount }}</span>
            </el-form-item>
            <el-form-item label="存放仓库">
              <span>{{ props.row.repository.repoName }}</span>
            </el-form-item>
            <el-form-item label="采购价">
              <span>{{ props.row.goods.buyPrice }}</span>
            </el-form-item>
            <el-form-item label="销售价">
              <span>{{ props.row.goods.salePrice }}</span>
            </el-form-item>
            <el-form-item label="库存总值">
              <span>{{ props.row.totalPrice }}</span>
            </el-form-item>
            <el-form-item label="售价总值">
              <span>{{ props.row.totalSalePrice }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="goods.goodOrder"
        label="货品编号"
        :sortable="true"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="货品名称"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.tag">{{ scope.row.goods.goodsName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="goods.g_type"
        label="商品类别"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="goods.picture"
        label="货品图片"
      >
        <template slot-scope="scope">
          <img :src="scope.row.goods.picture" width="64" height="64" style="border-radius: 50%;">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="repository.repoName"
        label="仓库">
      </el-table-column>
      <el-table-column
        align="center"
        prop="realCount"
        label="库存量">
      </el-table-column>
      <el-table-column
        :sortable="true"
        align="center"
        prop="saleCount"
        label="销售量">
      </el-table-column>
      <el-table-column
        :sortable="true"
        align="center"
        prop="totalPrice"
        label="库存总值">
      </el-table-column>
      <el-table-column
        align="center"
        prop="totalSalePrice"
        :sortable="true"
        label="售价总值">
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
            @click="handleSale(scope.row)"
          >售出</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(scope.row.id, scope.row.index, false)"
          >调拨</el-button>
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
  import goodsDefaultIcon from '@/assets/images/goodsDefaultIcon.jpg';
    export default {
        name: "StockView",
      data () {
        return {
          tableData: [],
          currentPage: 1,
          total: 0, //总条目数
          pageSize: 10, //每页显示条目个数
          searchForm: {
            goodsName: '',
            type: '',
            repoName: ''
          },
          formLabelWidth: '120px',
          dialogTitle: '',
          dialogFormVisible: false,
          form: {
            customerId: '',
            unitPrice: '',
            count: '',
            descs: '',
            state: ''
          },
          cusOptions: [],
          showBtnLoading: false,
          currentEditOrder: ''
        }
      },
      methods: {
        fetchTableData () {
          let toRemoteParams = new URLSearchParams();
          //toRemoteParams.append('goods', this.searchForm);
          toRemoteParams.append('pageEntity', { currentPage: this.currentPage, pageSize: this.pageSize });
          this.$http({
            url: '/api/stockMange/stockView/queryAllStock',
            method: 'post',
            data: toRemoteParams
          }).then(res => {
            let _this = this;
            this.total = res.data.count;
            let tag = ['info', 'success', 'warning', 'danger'];
            let tempData = res.data.list.filter((value, index, arr) => {
              value.tag = tag[this.randomData(-1, 3)];
              $.ajax({ //获取商品图片
                url: '/api/baseConfig/goods/getGoodsImg',
                async: false,
                dataType: 'json',
                data: { id: value.goods.g_id },
                success: function (res) {
                  switch (res) {
                    case '' : //如果头像不存在，即用户没有设置头像
                      value.goods.picture = goodsDefaultIcon;
                      break;
                    default :
                      value.goods.picture = 'data:image/png;base64,' + res
                  }
                },
                error: function (e) {
                  _this.$message({
                    type: 'error',
                    message: '请求服务器获取商品图片失败',
                    showClose: true
                  });
                }
              });
              $.ajax({
                url: '/api/saleManage/saleOrder/querySomeSaleOrder',
                async: false,
                dataType: 'json',
                data: { g_id: value.goods.g_id },
                success: function (result) {
                  let saleCount = 0;
                  result.list.forEach((val, key, array) => {
                    saleCount += val.checkState == 3 ? val.count : 0;
                  });
                  value.realCount = value.purchaseOrder.count - saleCount;
                  value.saleCount = saleCount;
                  value.totalSalePrice = value.goods.salePrice * (value.purchaseOrder.count - saleCount);
                  value.totalPrice = value.goods.buyPrice * (value.purchaseOrder.count - saleCount);
                }
              });
              return arr;
            });
            this.tableData = tempData;
          }).catch(() => {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: '获取货品信息失败'
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
        handleAdd () {

        },
        onTableChange () {

        },
        handleDelete () {

        },
        handleExport () {

        },
        handleSale (row) {
          this.dialogFormVisible = true;
          this.dialogTitle = '商品销售';
          this.currentEditOrder = row;
          this.form.unitPrice = row.goods.salePrice;
          this.fetchCusData().then(res => {
            this.cusOptions = res;
          });
        },
        fetchCusData () {
          return new Promise((resolve, reject) => {
            this.$http.get('/api/saleManage/customer/queryAllCustomer').then(res => {
              resolve(res.data.list);
            });
          });
        },
        closeInfoFrame () { //清空表单
          this.dialogFormVisible = false;
          this.$refs.goodForm.resetFields();
          this.form.customerId = '';
          this.form.state = '';
        },
        handleSubmit () {
          this.$confirm('确定要售出吗', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.showBtnLoading = true;
            if (!this.isNotNulled(this.form.customerId)) {
              this.$message.error({
                showClose: true,
                duration: 2000,
                message: '请选择目标客户'
              });
              this.showBtnLoading = false;
              return false;
            }
            if (!this.isNotNulled(this.form.state)) {
              this.$message.error({
                showClose: true,
                duration: 2000,
                message: '请选择付款项'
              });
              this.showBtnLoading = false;
              return false;
            }
            if (this.form.count > this.currentEditOrder.realCount) {
              this.$message.error({
                showClose: true,
                duration: 2000,
                message: '欲售出数量已超出库存数量'
              });
              this.showBtnLoading = false;
              return false;
            }
            this.$refs['goodForm'].validate(valid => {
              if (valid) {
                this.isNotNulled(this.form.count) ? undefined : this.form.count = 0;
                this.isNotNulled(this.form.unitPrice) ? undefined : this.form.unitPrice = 0.0;
                this.isNotNulled(this.form.state) ? undefined : this.form.state = 0;
                this.form.goodId = this.currentEditOrder.goods.g_id;
                this.form.repoId = this.currentEditOrder.repository.id;
                let that = this;
                $.ajax({
                  url: '/api/saleManage/saleOrder/saveSaleOrder',
                  method: 'post',
                  dataType: 'json',
                  data: that.form,
                  success: function (res) {
                    that.showBtnLoading = false;
                    switch (res.success) {
                      case true :
                        that.$message({
                          type: 'success',
                          showClose: true,
                          message: '保存成功',
                          duration: 2000
                        });
                        let timer = setTimeout(() => {
                          that.$router.push('/saleOrder');
                          that.$emit('headCallBack', '/saleOrder');
                        }, 1000);
                        that.dialogFormVisible = false;
                        that.closeInfoFrame();
                        break;
                      default :
                        that.$message.error({
                          showClose: true,
                          message: res.errMsg,
                          duration: 2000
                        });
                    }
                    that.fetchTableData();
                    that.dialogFormVisible = false;
                  },
                  error: function () {
                    that.fetchTableData();
                    that.showBtnLoading = false;
                    that.$message.error({
                      showClose: true,
                      message: '连接服务器失败',
                      duration: 2000
                    });
                  }
                });
              }else {
                this.showBtnLoading = false;
                return false;
              }
            });
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

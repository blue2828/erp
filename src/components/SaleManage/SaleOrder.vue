<template>
  <div>
    <el-row>
      <el-col :span="2"><el-button type="success" icon="el-icon-erp-xiaoshou" @click="handleSale">销售</el-button></el-col>
      <el-col :span="3"><el-button type="danger"  @click="handleCancel(checkboxSelectData, -1, true)">批量退单</el-button></el-col>
      <el-col :span="2"><el-button type="info" icon="el-icon-printer" @click="handleExport">导出</el-button></el-col>
      <el-col :span="17">
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.orderNumber" autocomplete="off" placeholder="订单编号"></el-input>
        <el-select v-model="selectedOrderType" clearable  placeholder="订单类型" style="width: 120px;">
          <el-option label="销售订单" value="0"/>
          <el-option label="销售退货" value="1"/>
        </el-select>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.goodsName" autocomplete="off" placeholder="货品名称"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.cusName" autocomplete="off" placeholder="客户"></el-input>
        <el-select v-model="searchForm.repoId" filterable clearable  placeholder="仓库" style="width: 120px;">
          <el-option
            v-for="item in repoOptions"
            :key="item.id"
            :label="item.repoName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top: 4px;">
      <el-col :span="6">
        <el-input :clearable="true" style="width: 130px;" v-model="searchForm.empName" autocomplete="off" placeholder="经办员工姓名"></el-input>
        <el-select v-model="selectedCheckState" clearable  placeholder="审批状态" style="width: 120px;">
          <el-option label="待审批" value="1"/>
          <el-option label="审批不通过" value="2"/>
          <el-option label="审批通过" value="3"/>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" @click="fetchTableData">搜索</el-button>
      </el-col>
      <el-col :span="16"></el-col>
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
            <el-form-item label="订单号">
              <span>{{ props.row.orderNumber }}</span>
            </el-form-item>
            <el-form-item label="货品编号">
              <span>{{ props.row.goods.goodOrder }}</span>
            </el-form-item>
            <el-form-item label="订单类型">
              <span>{{ props.row.s_o_type == 0 || props.row.s_o_type == null || props.row.s_o_type == undefined || props.row.s_o_type == '' || props.row.s_o_type == -1  ? '销售订单' : '销售退单'}}</span>
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
            <el-form-item label="单价">
              <span>{{ props.row.unitPrice }}</span>
            </el-form-item>
            <el-form-item label="总价">
              <span>{{ props.row.totalPrice }}</span>
            </el-form-item>
            <el-form-item label="数量">
              <span>{{ props.row.count }}</span>
            </el-form-item>
            <el-form-item label="客户">
              <span>{{ props.row.customer.cusName }}</span>
            </el-form-item>
            <el-form-item label="订单创建时间">
              <span>{{ props.row.creatime }}</span>
            </el-form-item>
            <el-form-item label="仓库">
              <span>{{ props.row.repository.repoName }}</span>
            </el-form-item>
            <el-form-item label="出库时间">
              <span>{{ props.row.takeTime }}</span>
            </el-form-item>
            <el-form-item label="销售员">
              <span>{{ props.row.employee.empName }}</span>
            </el-form-item>
            <el-form-item label="审批状态">
              <span>{{ props.row.checkStateStr }}</span>
            </el-form-item>
            <el-form-item label="审批时间">
              <span>{{ props.row.checkTime }}</span>
            </el-form-item>
            <el-form-item label="审批人">
              <span>{{ props.row.user == undefined || props.row.user == null ? "" : props.row.user[0].userName }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="orderNumber"
        label="订单编号"
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
        prop="goods.picture"
        label="货品图片"
      >
        <template slot-scope="scope">
          <img :src="scope.row.goods.picture" width="64" height="64" style="border-radius: 50%;">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="goods.unit"
        label="计量单位">
      </el-table-column>
      <el-table-column
        :sortable="true"
        align="center"
        prop="unitPrice"
        label="单价">
      </el-table-column>
      <el-table-column
        align="center"
        prop="totalPrice"
        :sortable="true"
        label="总价">
      </el-table-column>
      <el-table-column
        align="center"
        prop="checkStateStr"
        label="审批状态">
      </el-table-column>
      <el-table-column
        align="center"
        prop="checkTime"
        label="审批时间">
      </el-table-column>
      <el-table-column
        align="center"
        prop="user[0].userName"
        label="审批人">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            circle
            @click="handleCancel(scope.row.id, scope.row.index, false)"
          >退单</el-button>
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
        name: "SaleOrder",
      data () {
        return {
          tableData: [],
          currentPage: 1,
          total: 0, //总条目数
          pageSize: 10, //每页显示条目个数
          searchForm: {
            goodsName: '',
            orderNumber: '',
            supName: '',
            empName: '',
            repoId: ''
          },
          selectedOrderType: '',
          repoOptions: [],
          selectedRepo: '',
          selectedCheckState: '',
          checkboxSelectData: []
        }
      },
      methods: {
        fetchTableData () {
         /* let toRemoteParams = new URLSearchParams();
          toRemoteParams.append('pageEntity', { currentPage: this.currentPage, pageSize: this.pageSize });*/
          this.isNotNulled(this.selectedCheckState) ? this.searchForm.checkState = this.selectedCheckState : this.searchForm.checkState = -1;
          this.isNotNulled(this.selectedOrderType) ? this.searchForm.s_o_type = this.selectedOrderType : this.searchForm.s_o_type = -1;
          let _this = this;
          $.ajax({
            url: '/api/saleManage/saleOrder/queryAllSaleOrder',
            method: 'post',
            dataType: 'json',
            data: this.searchForm,
            async: false,
            success: function (res) {
              _this.total = res.count;
              let tag = ['info', 'success', 'warning', 'danger'];
              let tempData = res.list.filter((value, index, arr) => {
                value.tag = tag[_this.randomData(-1, 3)];
                value.inTime = _this.formatTimeStampToTime(value.inTime, false);
                value.creatime = _this.formatTimeStampToTime(value.creatime, false);
                value.checkTime = _this.formatTimeStampToTime(value.checkTime, false);
                value.checkStateStr = value.checkState == 1 ? '待审批' : value.checkState == 2 ? '审批不通过' : value.checkState == 3 ? "审批通过" : '待审批';
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
                return arr;
              });
              _this.tableData = tempData;
            },
            error: function () {
              _this.$message.error({
                showClose: true,
                duration: 2000,
                message: '获取货品信息失败'
              });
            }
          });
        },
        fetchRepo () {
          this.$http({
            url: '/api/baseConfig/repo/queryAllRepo',
            method: 'post'
          }).then(res => {
            this.repoOptions = res.data.list;
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
        handleSale () {
          this.$confirm('前往库存查看销售？', '系统提示', {
            confirmButtonText: '前往',
            cancelButtonText: '留在本页',
            type: 'warning'
          }).then(() => {
            this.$router.push('/stockView');
            this.$emit('headCallBack', '/stockView');
          });
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
        handleDelete () {

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
          let requiredAttr = ['orderNumber', 's_o_type', 'goods', 'unitPrice', 'totalPrice', 'count', 'customer', 'creatime', 'state', 'repository',
            'takeTime', 'employee', 'checkStateStr', 'checkTime', 'user'];
          let copyData = [];
          this.checkboxSelectData.forEach((value, index, arr) => {
            let obj = {};
            Object.keys(value).forEach((val, key, array) => {
              if ($.inArray(val, requiredAttr) > -1) {
                if (val == 'goods') {
                  obj.goodOrder = value.goods.goodOrder;
                  obj.goodsName = value.goods.goodsName;
                  obj.size = value.goods.size;
                  obj.g_type = value.goods.g_type;
                  obj.unit = value.goods.unit;
                  return true;
                }
                if (val == 'customer') {
                  obj.cusName = value.customer.cusName;
                  return true;
                }
                if (val == 'repository') {
                  obj.repoName = value.repository.repoName;
                  return true;
                }
                if (val == 'employee') {
                  obj.empName = value.employee.empName;
                  return true;
                }
                if (val == 'user') {
                  obj.userName = value.user == undefined || value.user == null ? "" : value.user[0].userName;
                  return true;
                }
                if (val == 'state') {
                  obj.state = value.state == 0 ? "已付款" : '未付款';
                  return true;
                }
                if (val == 's_o_type') {
                  obj.s_o_type = value.s_o_type == 0 ? "采购订单" : '采购退单';
                  return true;
                }
                obj[val] = value[val];
              }
            });
            copyData.push(obj);
          });
          let newdata = new URLSearchParams();
          newdata.append("data", JSON.stringify(copyData));
          window.open('/api/saleManage/saleOrder/exportSOrderInfoToExcel?data=' + newdata, '_blank');
        },
        handleCancel (id, index, dulpicate) {
          if (dulpicate && this.checkboxSelectData.length == 0) {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: '请选择需要退单的行'
            });
            return;
          }
          this.$confirm('确定要退单吗', '系统提示', {
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
            this.$http.get('/api/saleManage/saleOrder/saleOrderCancel', {
              params: {
                id: dulpicate ? ids.join(",") : id
              }
            }).then(res => {
              switch (res.data.success) {
                case true :
                  this.$message.success({
                    showClose: true,
                    message: '退单成功'
                  });
                  this.fetchTableData();
                  break;
                default :
                  this.$message.error({
                    showClose: true,
                    message: !this.isNotNulled(res.data.errMsg) ? "退单失败" : res.data.errMsg
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
        }
      },
      created () {
        this.fetchTableData();
        this.fetchRepo();
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

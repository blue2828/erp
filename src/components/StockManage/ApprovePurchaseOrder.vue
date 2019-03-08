<template>
  <div>
    <el-row>
      <el-col :span="2"><el-button type="success" @click="handleApprove(checkboxSelectData, -1, true, true)">批量审批</el-button></el-col>
      <el-col :span="4"><el-button type="danger" @click="handleApprove(checkboxSelectData, -1, true, false)">批量取消审批</el-button></el-col>
      <el-col :span="2"><el-button type="info" icon="el-icon-printer" @click="handleExport">导出</el-button></el-col>
      <el-col :span="14">
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.goodsOrder" autocomplete="off" placeholder="订单编号"></el-input>
        <el-select v-model="selectedOrderType" clearable  placeholder="订单类型" style="width: 120px;">
          <el-option label="采购订单" value="0"/>
          <el-option label="采购退货" value="1"/>
        </el-select>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.goodsName" autocomplete="off" placeholder="货品名称"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.supName" autocomplete="off" placeholder="供应商"></el-input>
        <el-select v-model="selectedRepo" filterable clearable  placeholder="仓库" style="width: 120px;">
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
          <el-option label="录入" value="1"/>
          <el-option label="待审批" value="2"/>
          <el-option label="审批不通过" value="3"/>
          <el-option label="审批通过" value="4"/>
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
            <el-form-item label="订单类型">
              <span>{{ props.row.p_o_type == 0 ? '采购订单' : '采购退货' }}</span>
            </el-form-item>
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
              <span>{{ props.row.goods.type }}</span>
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
            <el-form-item label="供应商">
              <span>{{ props.row.supplier.supName }}</span>
            </el-form-item>
            <el-form-item label="订单创建时间">
              <span>{{ props.row.creatime }}</span>
            </el-form-item>
            <el-form-item label="仓库">
              <span>{{ props.row.repository.repoName }}</span>
            </el-form-item>
            <el-form-item label="入库时间">
              <span>{{ props.row.inTime }}</span>
            </el-form-item>
            <el-form-item label="采购员">
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
            circle
            type="primary"
            @click="handleApprove(scope.row, scope.row.index, false, scope.row.checkState == 3 ? false : true)"
          >{{ scope.row.checkState == 3 ? '取消审批' : '审批' }}</el-button>
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
        name: "ApprovePurchaseOrder",
      data () {
        return {
          tableData: [],
          currentPage: 1,
          total: 0, //总条目数
          pageSize: 10, //每页显示条目个数
          searchForm: {
            goodsName: '',
            goodsOrder: '',
            type: '',
            size: '',
            buyPrice: 0.0,
            salePrice: 0.0
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
          let toRemoteParams = new URLSearchParams();
          //toRemoteParams.append('goods', this.searchForm);
          toRemoteParams.append('isState4', false);
          toRemoteParams.append('pageEntity', { currentPage: this.currentPage, pageSize: this.pageSize });
          this.$http({
            url: '/api/baseConfig/goods/queryAllGoods',
            method: 'post',
            data: toRemoteParams
          }).then(res => {
            let _this = this;
            this.total = res.data.count;
            let tag = ['info', 'success', 'warning', 'danger'];
            let tempData = res.data.list.filter((value, index, arr) => {
              value.tag = tag[this.randomData(-1, 3)];
              value.inTime = this.formatTimeStampToTime(value.inTime, false);
              value.creatime = this.formatTimeStampToTime(value.creatime, false);
              value.checkTime = this.formatTimeStampToTime(value.checkTime, false);
              value.checkStateStr = value.checkState == 1 ? '待审批' : value.checkState == 2 ? '审批不通过' : value.checkState == 3 ? "审批通过" : '审批通过';
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
        onTableChange (selection) {
          switch (selection.length) {
            case 0 :
              this.checkboxSelectData = [];
              break;
            default:
              this.checkboxSelectData = selection;
          }
        },
        handleApprove (row, index, dulpicate, approveOp) {
          if (dulpicate && this.checkboxSelectData.length == 0) {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: `请选择需要${approveOp ? `审批` : `取消审批`}的行`
            });
            return;
          }
          this.$confirm(`确定要${approveOp ? `审批` : `取消审批`}吗`, '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let collection = [];
            switch (dulpicate) {
              case true :
                this.checkboxSelectData.forEach((value, index, arr) => {
                  collection.push({ p_o_id: value.p_o_id, g_id: value.goods.g_id, repoId: value.repository.id });
                });
                break;
              default :
                collection.push({ p_o_id: row.p_o_id, g_id: row.goods.g_id, repoId: row.repository.id });
            }
            $.post('/api/buyManage/purchaseOrder/purchaseOrderApprove', {
              checkState: approveOp ? 3 : 2,
              g_po_col: JSON.stringify(collection)
            }, (res) => {
              switch (res.success) {
                case true :
                  this.$message.success({
                    showClose: true,
                    message: `${approveOp ? `审批成功` : `取消审批成功`}`
                  });
                  break;
                default :
                  this.$message.error({
                    showClose: true,
                    message: !this.isNotNulled(res.errMsg) ? `${approveOp ? `审批失败` : `取消审批失败`}` : res.errMsg
                  });
              }
              this.fetchTableData();
            }, 'json');
          });
        },
        handleExport () {

        },
        handleEdit () {

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

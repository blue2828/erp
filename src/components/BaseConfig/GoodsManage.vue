<template>
  <div>
    <el-row>
      <el-col :span="2"><el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button></el-col>
      <el-col :span="3"><el-button type="danger" icon="el-icon-delete" @click="handleDelete(checkboxSelectData, -1, true)">批量删除</el-button></el-col>
      <el-col :span="2"><el-button type="info" icon="el-icon-printer" @click="handleExport">导出</el-button></el-col>
      <el-col :span="17">
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.goodsOrder" autocomplete="off" placeholder="货品编号"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.goodsName" autocomplete="off" placeholder="货品名称"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.size" autocomplete="off" placeholder="货品规格"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.g_type" autocomplete="off" placeholder="货品类型"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.buyPrice" autocomplete="off" placeholder="采购价"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.salePrice" autocomplete="off" placeholder="零售价"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 4px;">
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="fetchTableData">搜索</el-button>
        </el-col>
        <el-col :span="22"></el-col>
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
              <span>{{ props.row.goodOrder }}</span>
            </el-form-item>
            <el-form-item label="货品名称">
              <span><el-tag :type="props.row.tag">{{ props.row.goodsName }}</el-tag></span>
            </el-form-item>
            <el-form-item label="规格">
              <span>{{ props.row.size }}</span>
            </el-form-item>
            <el-form-item label="货品类型">
              <span>{{ props.row.g_type }}</span>
            </el-form-item>
            <el-form-item label="计量单位">
              <span>{{ props.row.unit }}</span>
            </el-form-item>
            <el-form-item label="采购价">
              <span>{{ props.row.buyPrice }}</span>
            </el-form-item>
            <el-form-item label="零售价">
              <span>{{ props.row.salePrice }}</span>
            </el-form-item>
            <el-form-item label="数量">
                <span>{{ props.row.count }}</span>
              </el-form-item>
            <el-form-item label="供应商">
              <span>{{ props.row.supName }}</span>
            </el-form-item>
            <el-form-item label="存放仓库">
              <span>{{ props.row.repoName }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.mark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="goodOrder"
        label="货品编号"
        :sortable="true"
        >
      </el-table-column>
      <el-table-column
        align="center"
        label="货品名称"
        >
        <template slot-scope="scope">
          <el-tag :type="scope.row.tag">{{ scope.row.goodsName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="size"
        label="规格"
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="picture"
        label="货品图片"
        >
        <template slot-scope="scope">
          <img :src="scope.row.picture" width="64" height="64" style="border-radius: 50%;">
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="g_type"
        label="货品类型">
      </el-table-column>
      <el-table-column
        align="center"
        prop="unit"
        label="计量单位">
      </el-table-column>
      <el-table-column
        :sortable="true"
        align="center"
        prop="buyPrice"
        label="采购价">
      </el-table-column>
      <el-table-column
        :sortable="true"
        align="center"
        prop="salePrice"
        label="零售价">
      </el-table-column>
      <el-table-column
        align="center"
        prop="count"
        :sortable="true"
        label="数量">
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
  import goodsDefaultIcon from '@/assets/images/goodsDefaultIcon.jpg';
    export default {
        name: "GoodsManage",
        data () {
          return {
            tableData: [],
            currentPage: 1,
            total: 0, //总条目数
            pageSize: 10, //每页显示条目个数
            searchForm: {
              goodsName: '',
              goodsOrder: '',
              g_type: '',
              size: '',
              buyPrice: 0.0,
              salePrice: 0.0
            }
          }
        },
        methods: {
          fetchTableData () {
            let toRemoteParams = new URLSearchParams();
            //toRemoteParams.append('goods', this.searchForm);
            toRemoteParams.append('pageEntity', { currentPage: this.currentPage, pageSize: this.pageSize });
            toRemoteParams.append('isState4', true);
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
                value.goodOrder = value.goods.goodOrder;
                value.goodsName = value.goods.goodsName;
                value.size = value.goods.size;
                value.g_type = value.goods.g_type;
                value.unit = value.goods.unit;
                value.buyPrice = value.goods.buyPrice;
                value.salePrice = value.goods.salePrice;
                value.supName = value.supplier.supName;
                value.repoName = value.repository.repoName;
                value.mark = value.goods.mark;
                $.ajax({ //获取商品图片
                  url: '/api/baseConfig/goods/getGoodsImg',
                  async: false,
                  dataType: 'json',
                  data: { id: value.goods.g_id },
                  success: function (res) {
                    switch (res) {
                      case '' : //如果头像不存在，即用户没有设置头像
                        value['picture'] = goodsDefaultIcon;
                        break;
                      default :
                        value['picture'] = 'data:image/png;base64,' + res
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
          onTableChange () {

          },
          handleDelete () {

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

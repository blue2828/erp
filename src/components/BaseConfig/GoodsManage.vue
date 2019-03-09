<template>
  <div>
    <el-dialog :modal-append-to-body="false" :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :hide-required-asterisk="true" ref="goodForm" :status-icon="true">
        <el-row>
          <el-col :span="4"><div style="border: 1px solid white;"></div></el-col>
          <el-col :span="16">
            <el-upload
              ref="uploadField"
              class="avatar-uploader"
              :auto-upload="false"
              action="/api/baseConfig/goods/editGoods"
              :show-file-list="false"
              :data="currentEditGood"
              :drag="true"
              :on-change="onImgSelectChange"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img :src="formImageUrl" style="width: 120px;height: 120px;border: 4px solid rgba(68, 87, 107, 1);border-radius: 50%;">
            </el-upload>
            <el-progress v-if="showProgress" :stroke-width="10" :percentage="uploadPercentage" :status="uploadStatus"></el-progress>
          </el-col>
          <el-col :span="4"><div style="border: 1px solid white;"></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="货品名称" :label-width="formLabelWidth"
                          prop="goodsName"
                          :rules="[{ required: true, message: '货品名称不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.goodsName" autocomplete="off"></el-input>
            </el-form-item>
            <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
          </el-col>
          <el-col :span="10">
            <el-form-item label="计量单位" :label-width="formLabelWidth"
                          prop="unit"
                          :rules="[{ required: true, message: '计量单位不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.unit" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="货品类型" :label-width="formLabelWidth"
                          prop="g_type"
                          :rules="[{ required: true, message: '货品类型不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.g_type" autocomplete="off"></el-input>
            </el-form-item>
            <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
          </el-col>
          <el-col :span="10">
            <el-form-item label="规格" :label-width="formLabelWidth"
                          prop="size"
                          :rules="[{ required: true, message: '规格不能为空' }]"
            >
              <el-input :clearable="true" v-model="form.size" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注">
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
      <el-col :span="2"><el-button type="info" icon="el-icon-printer" @click="handleExport">导出</el-button></el-col>
      <el-col :span="17">
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.goodOrder" autocomplete="off" placeholder="货品编号"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.goodsName" autocomplete="off" placeholder="货品名称"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.size" autocomplete="off" placeholder="货品规格"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchForm.g_type" autocomplete="off" placeholder="货品类型"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="buyPrice" autocomplete="off" placeholder="采购价"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="salePrice" autocomplete="off" placeholder="零售价"></el-input>
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
              goodOrder: '',
              g_type: '',
              size: '',
              buyPrice: '',
              salePrice: ''
            },
            form: {
              goodsName: '',
              unit: '',
              g_type: '',
              size: '',
              mark: ''
            },
            showBtnLoading: false,
            dialogTitle: '',
            dialogFormVisible: false,
            buyPrice: '',
            salePrice: '',
            checkboxSelectData: [],
            showProgress: false,
            formImageUrl: '',
            uploadStatus: 'text',
            uploadPercentage: 0,
            currentEditGood: {},
            formLabelWidth: '120px'
          }
        },
        methods: {
          onImgSelectChange (file, fileList) { //图片选取后的执行的函数
            this.formImageUrl = URL.createObjectURL(file.raw);
            this.isSelectedImgFile = true;
          },
          handleAvatarSuccess (res, file) { //图片上传成功后的函数
            let that = this;
            this.showBtnLoading = false;
            switch (res.success) {
              case true :
                this.uploadStatus = 'success';
                this.uploadPercentage = 100;
                let timer = setTimeout(() => {
                  this.showProgress = false;
                  clearTimeout(timer);
                }, 2000);
                break;
              default :
                this.$message.error({
                  showClose: true,
                  message: res.errMsg,
                  duration: 2000
                });
                this.showBtnLoading = false;
            }
            this.fetchTableData();
            this.dialogFormVisible = false;
            this.closeInfoFrame();
          },
          beforeAvatarUpload (file) { //图片上传前执行的函数
            let isImage = this.isImg(file.type);
            if (!isImage) {
              this.$message.error({
                showClose: true,
                message: '不支持的图片格式',
                duration: 2000
              });
              return false;
            }
            this.showProgress = true;
            let promise = new Promise((resolve) => {
              this.$nextTick(function () {
                resolve(true);
              });
            });
            return promise;
          },
          closeInfoFrame () { //清空表单
            this.dialogFormVisible = false;
            this.$refs.goodForm.resetFields();
            this.showBtnLoading = false;
            this.showProgress = false;
            this.formImageUrl = goodsDefaultIcon;
            this.form.mark = '';
          },
          fetchTableData () {
           this.isNotNulled(this.buyPrice) ? this.searchForm.buyPrice = this.buyPrice : this.searchForm.buyPrice = -1.0;
           this.isNotNulled(this.salePrice) ? this.searchForm.salePrice = this.salePrice : this.searchForm.salePrice = -1.0;
           this.searchForm.currentPage = this.currentPage;
           this.searchForm.pageSize = this.pageSize;
           this.searchForm.isState4 = true;
            let _this = this;
            $.ajax({
              url: '/api/baseConfig/goods/queryAllGoods',
              method: 'post',
              dataType: 'json',
              data: _this.searchForm,
              async: false,
              success: function (res) {
                _this.total = res.count;
                let tag = ['info', 'success', 'warning', 'danger'];
                let tempData = res.list.filter((value, index, arr) => {
                  value.tag = tag[_this.randomData(-1, 3)];
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
          handleSubmit () { //提交表单
            this.showBtnLoading = true;
            let params = this.form;
            this.currentEditGood = params;
            this.$refs['goodForm'].validate(valid => {
              switch (valid) {
                case true:
                  if (this.isSelectedImgFile) {
                    this.$refs.uploadField.submit();
                    return false;
                  }
                  this.$http.get('/api/baseConfig/goods/editGoods', { //请求保存订单的ajax /api表示的事http://localhost:8088/
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
          },
          closeInfoFrame () {

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
            this.$confirm('前往采购？', '系统提示', {
              confirmButtonText: '前往',
              cancelButtonText: '留在本页',
              type: 'warning'
            }).then(() => {
              this.$router.push({ path: '/buyOrder?msg=handleAdd' });
              this.$emit('headCallBack', '/buyOrder')
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
          handleExport () {
            if (this.checkboxSelectData.length == 0) {
              this.$message.error({
                showClose: true,
                duration: 2000,
                message: '请选择需要导出的数据'
              });
              return;
            }
            let requiredAttr = ['goodOrder', 'goodsName', 'size', 'g_type', 'unit', 'buyPrice', 'salePrice', 'count', 'supName', 'repoName', 'mark'];
            let copyData = [];
            this.checkboxSelectData.forEach((value, index, arr) => {
              let obj = {};
              Object.keys(value).forEach((val, key, array) => {
                if ($.inArray(val, requiredAttr) > -1)
                  obj[val] = value[val];
              });
              copyData.push(obj);
            });
            let newdata = new URLSearchParams();
            newdata.append("data", JSON.stringify(copyData));
            window.open('/api/baseConfig/goods/exportGoodInfoToExcel?data=' + newdata, '_blank');
          },
          handleEdit (row) {
            this.formImageUrl = row.picture;
            this.dialogTitle = '编辑商品';
            this.dialogFormVisible = true;
            this.form = {
              g_id: row.goods.g_id,
              goodsName: row.goodsName,
              unit: row.unit,
              g_type: row.g_type,
              size: row.size,
              mark: row.mark
            };
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

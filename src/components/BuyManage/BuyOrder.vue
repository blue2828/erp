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
              action="/api/buyManage/purchaseOrder/savePurchaseOrder"
              :show-file-list="false"
              :data="currentEditOrder"
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
            <el-form-item label="采购价" :label-width="formLabelWidth"
                          prop="buyPrice"
                          :rules="[{ required: true, message: '请填入采购价' }]"
            >
              <el-input :clearable="true" v-model="form.buyPrice" autocomplete="off" placeholder="单位元"></el-input>
            </el-form-item>
            <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
          </el-col>
          <el-col :span="10">
            <el-form-item label="规格" :label-width="formLabelWidth"
                          prop="size"
                          :rules="[{ required: true, message: '请填入规格' }]"
            >
              <el-input :clearable="true" v-model="form.size" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="货品类型" :label-width="formLabelWidth"
                          prop="g_type"
                          :rules="[{ required: true, message: '请填入货品类型' }]"
            >
              <el-input :clearable="true" v-model="form.g_type" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="数量" :label-width="formLabelWidth"
                          prop="count"
                          :rules="[{ required: true, message: '请填入采购数量' }]"
            >
              <el-input :clearable="true" v-model="form.count" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="供应商" :label-width="formLabelWidth"
                          prop="supplierId"
            >
              <el-select v-model="selectedSupplier" filterable clearable  placeholder="请选择">
                <el-option
                  v-for="item in spOptions"
                  :key="item.id"
                  :label="item.supName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="预存放仓库" :label-width="formLabelWidth"
                          prop="repoId"
            >
              <el-select v-model="selectedRepo" filterable clearable  placeholder="请选择">
                <el-option
                  v-for="item in repoOptions"
                  :key="item.id"
                  :label="item.repoName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="付款" :label-width="formLabelWidth"
                          prop="isPay"
            >
              <el-select v-model="isPay" filterable clearable  placeholder="请选择">
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
          <el-col :span="10">
            <el-form-item label="预售价" :label-width="formLabelWidth"
                          prop="salePrice"
                          :rules="[{ required: true, message: '请填入预售价' }]"
            >
              <el-input :clearable="true" v-model="form.salePrice" autocomplete="off" placeholder="单位元"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="showExtraFormItem">
          <el-col :span="10">
            <el-form-item label="采购员" :label-width="formLabelWidth"
                          prop="empId"
            >
              <el-select v-model="form.selectedEp" filterable clearable  placeholder="请选择">
                <el-option
                  v-for="item in empOptions"
                  :key="item.id"
                  :label="item.empName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-col :span="2"><div style="border: 1px solid white;"></div></el-col>
          </el-col>
          <el-col :span="10">
            <el-form-item label="入库时间" :label-width="formLabelWidth"
                          prop="unit"

            >
              <el-date-picker
                v-model="form.inTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
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
      <el-col :span="2"><el-button type="success" icon="el-icon-plus" @click="handleAdd">采购</el-button></el-col>
      <el-col :span="3"><el-button type="danger" icon="el-icon-delete" @click="handleCancel(checkboxSelectData, -1, true)">批量退单</el-button></el-col>
      <el-col :span="2"><el-button type="info" icon="el-icon-printer" @click="handleExport">导出</el-button></el-col>
      <el-col :span="17">
        <el-input :clearable="true" style="width: 120px;" v-model="searchFormForPOrder.orderNumber" autocomplete="off" placeholder="订单编号"></el-input>
        <el-select v-model="searchFormForPOrder.p_o_type" clearable  placeholder="订单类型" style="width: 120px;">
          <el-option label="采购订单" value="0"/>
          <el-option label="采购退货" value="1"/>
        </el-select>
        <el-input :clearable="true" style="width: 120px;" v-model="searchFormForGood.goodsName" autocomplete="off" placeholder="货品名称"></el-input>
        <el-input :clearable="true" style="width: 120px;" v-model="searchFormForSupplier.supName" autocomplete="off" placeholder="供应商"></el-input>
        <el-select v-model="searchFormForRepo.id" filterable clearable  placeholder="仓库" style="width: 120px;">
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
        <el-input :clearable="true" style="width: 130px;" v-model="searchFormForEmp.empName" autocomplete="off" placeholder="经办员工姓名"></el-input>
        <el-select v-model="searchFormForPOrder.checkState" clearable  placeholder="审批状态" style="width: 120px;">
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
            <el-form-item label="供应商">
              <span>{{ props.row.supplier.supName }}</span>
            </el-form-item>
            <el-form-item label="订单创建时间">
              <span>{{ props.row.creatime }}</span>
            </el-form-item>
            <el-form-item label="付款">
              <span>{{ props.row.state == 0 ? "已付款" : '未付款' }}</span>
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
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
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
  import goodsDefaultIcon from '@/assets/images/goodsDefaultIcon.jpg';
    export default {
        name: "BuyOrder",
      data () {
        return {
          tableData: [],
          currentPage: 1,
          total: 0, //总条目数
          pageSize: 10, //每页显示条目个数
          searchFormForGood: {
            goodsName: '',
            g_type: '',
            size: '',
            buyPrice: 0.0,
            salePrice: 0.0
          },
          searchFormForPOrder: {
            orderNumber: '',
            p_o_type: '',
            checkState: ''
          },
          searchFormForSupplier: {
            supName: ''
          },
          searchFormForRepo: {
            id: ''
          },
          searchFormForEmp: {
            empName: ''
          },
          isEdit: false,
          form: {
            g_id: '',
            goodsName: '',
            unit: '',
            buyPrice: '',
            size: '',
            g_type: '',
            mark: "",
            count: '',
            salePrice: '',
            selectedEp: '',
            inTime: '',
            p_o_id: ''
          },
          empOptions: [],
          formLabelWidth: '120px',
          repoOptions: [],
          spOptions: [],
          selectedRepo: '',
          isPay: '',
          selectedCheckState: '',
          dialogTitle: '',
          dialogFormVisible: false,
          currentEditOrder: {},
          formImageUrl: '',
          showExtraFormItem: '',
          showProgress: false,
          uploadPercentage: 0,
          uploadStatus: 'text',
          showBtnLoading: false,
          selectedSupplier: '',
          isSelectedImgFile: false //是否已经选中头像图片
        }
      },
      methods: {
        onImgSelectChange (file, fileList) {
          this.formImageUrl = URL.createObjectURL(file.raw);
          this.isSelectedImgFile = true;
        },
        handleAvatarSuccess (res, file) {
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
        beforeAvatarUpload (file) {
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
        closeInfoFrame () {
          this.dialogFormVisible = false;
          this.$refs.goodForm.resetFields();
          this.selectedSupplier = '';
          this.selectedRepo = '';
          this.isPay = '';
          this.isSelectedImgFile = false;
          this.showBtnLoading = false;
          this.showProgress = false;
          this.formImageUrl = goodsDefaultIcon;
          this.form.mark = '';
        },
        handleSubmit () {
          this.showBtnLoading = true;
          let params = this.form;
          switch (this.isEdit) { //如果是添加的是把id去掉，不然后台会报类型转换错误
            case false :
              delete params.g_id;
              break;
          }
          this.isNotNulled(params.inTime) ? delete params.inTime : undefined;
          params.isEdit = this.isEdit;
          params.handleUserId = this.$store.getters.getCurrentUser.id;
          params.supId = this.selectedSupplier;
          params.repoId = this.selectedRepo;
          params.state = this.isPay;
          this.currentEditOrder = params;
          this.$refs['goodForm'].validate(valid => {
            switch (valid) {
              case true:
                if (!this.isNumed(this.form.count)) {
                  this.$message.error({
                    showClose: true,
                    duration: 2000,
                    message: '数量应为数值'
                  });
                  this.showBtnLoading = false;
                  return false;
                }
                if (!this.isNumed(this.form.salePrice)) {
                  this.$message.error({
                    showClose: true,
                    duration: 2000,
                    message: '预售价应为数值'
                  });
                  this.showBtnLoading = false;
                  return false;
                }
                if (!this.isNumed(this.form.buyPrice)) {
                  this.$message.error({
                    showClose: true,
                    duration: 2000,
                    message: '采购价应为数值'
                  });
                  this.showBtnLoading = false;
                  return false;
                }
                if (!this.isNumed(this.selectedSupplier)) {
                  this.$message.error({
                    showClose: true,
                    duration: 2000,
                    message: '请选择供应商'
                  });
                  this.showBtnLoading = false;
                  return false;
                }
                if (!this.isNumed(this.selectedRepo)) {
                  this.$message.error({
                    showClose: true,
                    duration: 2000,
                    message: '请选择仓库'
                  });
                  this.showBtnLoading = false;
                  return false;
                }
                if (!this.isNumed(this.isPay)) {
                  this.$message.error({
                    showClose: true,
                    duration: 2000,
                    message: '预售价应为数值'
                  });
                  this.showBtnLoading = false;
                  return false;
                }
                if (!this.isNotNulled(this.form.selectedEp) && this.isEdit) {
                  this.$message.error({
                    showClose: true,
                    duration: 2000,
                    message: '采购员不能为空'
                  });
                  this.showBtnLoading = false;
                  return false;
                }
                if (this.isSelectedImgFile) {
                  this.$refs.uploadField.submit();
                  return false;
                }
                this.$http.get('/api/buyManage/purchaseOrder/savePurchaseOrder', {
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
                return false;
            }
          });
        },
        initIntParams () {
          this.searchFormForRepo.id = this.isNotNulled(this.searchFormForRepo.id) ? -1 : this.searchFormForRepo.id;
          this.searchFormForPOrder.checkState = this.isNotNulled(this.searchFormForPOrder.checkState) ? -1 : this.searchFormForPOrder.checkState;
          this.searchFormForPOrder.p_o_type = this.isNotNulled(this.searchFormForPOrder.p_o_type) ? -1 : this.searchFormForPOrder.p_o_type;
        },
        fetchTableData () {
          $.post('/api/baseConfig/goods/queryAllGoods', {
            orderNumber: this.searchFormForPOrder.orderNumber, p_o_type: this.searchFormForPOrder.p_o_type == '' ? -1 : this.searchFormForPOrder.p_o_type,
            goodsName: this.searchFormForGood.goodsName,
            supName: this.searchFormForSupplier.supName,
            id: this.searchFormForRepo.id == '' ? -1 : this.searchFormForRepo.id,
            empName: this.searchFormForEmp.empName,
            checkState: this.searchFormForPOrder.checkState == '' ? -1 : this.searchFormForPOrder.checkState,
            currentPage: this.currentPage, pageSize: this.pageSize
          }, (res) => {
            let _this = this;
            this.total = res.count;
            let tag = ['info', 'success', 'warning', 'danger'];
            let tempData = res.list.filter((value, index, arr) => {
              value.tag = tag[this.randomData(-1, 3)];
              value.inTime = this.formatTimeStampToTime(value.inTime, false);
              value.creatime = this.formatTimeStampToTime(value.creatime, false);
              value.checkTime = this.formatTimeStampToTime(value.checkTime, false);
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
            this.tableData = tempData;
          }, 'json');
         /* this.$http({
            url: '/api/baseConfig/goods/queryAllGoods',
            method: 'post',
            data: toRemoteParams,
            contentType: 'application/json;charset=UTF-8'
          }).then(res => {
            let _this = this;
            this.total = res.data.count;
            let tag = ['info', 'success', 'warning', 'danger'];
            let tempData = res.data.list.filter((value, index, arr) => {
              value.tag = tag[this.randomData(-1, 3)];
              value.inTime = this.formatTimeStampToTime(value.inTime, false);
              value.creatime = this.formatTimeStampToTime(value.creatime, false);
              value.checkTime = this.formatTimeStampToTime(value.checkTime, false);
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
            this.tableData = tempData;
          }).catch(() => {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: '获取货品信息失败'
            });
          });*/
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
          this.showExtraFormItem = false;
          this.formImageUrl = goodsDefaultIcon;
          this.dialogFormVisible = true;
          this.dialogTitle = '采购';
        },
        onTableChange () {

        },
        handleCancel () {

        },
        handleExport () {

        },
        handleEdit (info) {
          this.fetchEp();
          this.isEdit = true;
          this.showExtraFormItem = true;
          this.form = {
              g_id: info.goods.g_id ,
              goodsName: info.goods.goodsName,
              unit: info.goods.unit,
              buyPrice: info.goods.buyPrice,
              size: info.goods.size,
              g_type: info.goods.g_type,
              mark: info.goods.mark,
              count: info.count,
              salePrice: info.goods.salePrice,
              selectedEp: info.employee.id,
              inTime: new Date(info.inTime),
              p_o_id: info.p_o_id
          },
          this.selectedSupplier = info.supplier.id;
          this.selectedRepo = info.repository.id;
          this.isPay = info.state.toString();
          this.formImageUrl = info.goods.picture;
          this.dialogFormVisible = true;
          this.dialogTitle = '编辑用户';
        },
        fetchSupplier () {
          this.$http({
            url: '/api/buyManage/supplier/queryAllSupplier',
            method: 'post'
          }).then(res => {
            this.spOptions = res.data.list;
          }).catch(() => {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: '获取供应商信息失败'
            });
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
        fetchEp () {
          this.$http({
            url: '/api/baseConfig/employee/queryAllEmployee',
            method: 'post'
          }).then(res => {
            this.empOptions = res.data.employeeInfo;
          }).catch(() => {
            this.$message.error({
              showClose: true,
              duration: 2000,
              message: '获取仓库信息失败'
            });
          });
        }
      },
      created () {
        this.fetchTableData();
        this.fetchSupplier();
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

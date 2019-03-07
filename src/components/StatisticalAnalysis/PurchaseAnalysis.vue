<template>
    <div style="border: 1px solid white;background: white;width: 100%;">
      <el-row style="margin-top: 10px;">
        <el-col :span="12">
          <el-button @click="btnClick(index, value, true, false)" v-for="(value, index) in firstBtns" :type="value.type" :size="value.size">{{ value.text }}</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="14">
          <span style="color: #606266;">日期</span>
          <el-date-picker type="daterange" v-model="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期"/>
          <el-button @click="btnClick(index, value, false, true)" v-for="(value, index) in secodeBtns" :type="value.type" :size="value.size">{{ value.text }}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <div>
          <span style="color: #606266;font-weight: bold;">采购总额：<span style="font-weight: normal;color: #1AB394;">￥{{ parseFloat(buyMoneyInTitle) == NaN || new Number(buyMoneyInTitle).toFixed(2) == 0.00 ? 0.00 : buyMoneyInTitle }}</span></span>
          <span style="color: #606266;font-weight: bold;margin-left: 40px;">采购笔数：<span style="font-weight: normal;color: #1AB394;">{{ buyCountInTitle == '' ? 0 : buyCountInTitle }}</span>笔</span></div>
      </el-row>
      <el-row>
        <div :id="echarsId" style="width: 80vw;height: 300px;"></div>
      </el-row>
      <el-table
        :data="tableData"
        width="100%"
        stripe
        border
        highlight-current-row
        style="width: 100%;margin-top: 4px;">
        <el-table-column
          align="center"
          prop="creatime"
          label="日期"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="tableTitleTotalMoney"
          prop="totalPrice"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="count"
          :label="tableTitleTotalCount">
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    export default {
        name: "PurchaseAnalysis",
        data () {
          return {
            firstBtns: [
              { type: 'danger', size: 'mini', text: '本周' },
              { type: '', size: 'mini', text: '上周' },
              { type: '', size: 'mini', text: '本月' },
              { type: '', size: 'mini', text: '上月' },
              { type: '', size: 'mini', text: '本季度' },
              { type: '', size: 'mini', text: '上季度' },
              { type: '', size: 'mini', text: '本年' },
              { type: '', size: 'mini', text: '去年' }
            ],
            secodeBtns:  [
              { type: 'success', size: 'mini', text: '按日查' },
              { type: '', size: 'mini', text: '按月查' },
              { type: 'primary', size: 'mini', text: '查询' }
            ],
            daterange: this.thisWeek(),
            buyMoneyInTitle: 0.00,
            buyCountInTitle: 0,
            xAxisDate: ['周一','周二','周三','周四','周五','周六','周日'],
            buyMoneyInXAxis: [],
            echarsId: 'echarsId',
            currentClickBtn: {},
            tableTitleTotalMoney: '0.00',
            tableTitleTotalCount: '0',
            tableData: []
          }
        },
      methods: {
        btnClick (index, values, isFirst, isSecond) {
          let that = this;
          let tempArr = [];
          switch (isFirst) {
            case true :
              this.currentClickBtn = { whichBtns: 0, index: index };
              tempArr = this.firstBtns.filter ((val, key, array) => {
                switch (key == index) {
                  case true :
                    val.type = 'danger';
                    break;
                  default :
                    val.type = '';
                }
                return array;
              });
              this.firstBtns = tempArr;
              break;
            default :
              //if (isSecond) {
                this.currentClickBtn = { whichBtns: 1, index: index };
                tempArr = this.secodeBtns.filter((val, key, array) => {
                  if (index == array.length - 1 || key == array.length - 1) //如果点的事查询按钮就不改变颜色
                    return true;
                  switch (key == index) {
                    case true :
                      val.type = 'success';
                      break;
                    default :
                      val.type = '';
                  }
                  return array;
                });
                this.secodeBtns = tempArr;
              if (index == 2)
                this.fetchDatas();
          }
         if (isFirst) {
             switch (index) {
               case 0 :
                 this.daterange = this.thisWeek();
                 break;
               case 1 :
                 this.daterange = this.lastWeek();
                 break;
               case 2 :
                 this.daterange = this.thisMonth();
                 break;
               case 3 :
                 this.daterange = this.lastMonth();
                 break;
               case 4 :
                 this.daterange = this.thisQuarter();
                 break;
               case 5 :
                 this.daterange = this.lastQuarter();
                 break;
               case 6 :
                 this.daterange = this.thisYear();
                 break;
               case 7 :
                 this.daterange = this.lastYear();
                 break;
             }
           this.fetchDatas();
         }
        },
        drawEchars () {
          let option;
          let myChart = this.$echarts.init(document.getElementById("echarsId"));
          option = {
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.xAxisDate
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '采购金额',
                type: 'line',
                stack: '总量',
                data: this.buyMoneyInXAxis
              }
            ]
          };
          myChart.setOption(option);
        },
        fetchDatas () {
          let selectedSecondBtn = this.secodeBtns.filter((val, index, arr) => {
            return val.type == 'success';
          });
          let queryDateOp = selectedSecondBtn[0];
          let s_start_year = this.daterange[0].split('-')[0];
          let s_end_year = this.daterange[1].split('-')[0];
          let s_start_month = this.daterange[0].split('-')[1];
          let s_end_month = this.daterange[1].split('-')[1];
          let s_start_day = '01';
          let s_end_day = parseInt(s_end_month) == 2 ? this.isLeapYear(s_end_year) ? 29 : 28 : this.isThirtyOneDayOfMonth(parseInt(s_end_month)) ? 31 : 30;
          let queryParam = queryDateOp.text.indexOf('月') > -1 ? {queryTime: JSON.stringify({'queryTime': [`${s_start_year}-${s_start_month}-${s_start_day}`, `${s_end_year}-${s_end_month}-${s_end_day}`]})}
           : {queryTime: JSON.stringify({'queryTime': [this.daterange[0], this.daterange[1]]})};
          var that = this;
          $.ajax({
            url: '/api/statisticalAnalysis/purchaseAnalysis/queryAllPurchaseOrderByCon',
            method: 'post',
            dataType: 'json',
            data: queryParam,
            async: false,
            success: function (res) {
              let tempMoneyArr = [];
              let dateSet = new Set();
              res.list.forEach((val, key, arr) => {
                tempMoneyArr.push(val.totalPrice);
                dateSet.add(that.formatTimeStampToTime(val.creatime, true));
              });
              let tableMap = new Map();
              dateSet.forEach(val => {
                let tempMoneyCountByDate = 0;
                let tempCountByDate = 0;
                res.list.forEach ((value, key, arr) => {
                  switch (that.formatTimeStampToTime(value.creatime, true) == val) {
                    case true :
                      tempMoneyCountByDate += value.totalPrice;
                      tempCountByDate ++;
                      break;
                  }
                });
                tableMap.set('info', { creatime: val, totalPrice: tempMoneyCountByDate, count: tempCountByDate });
              });
              let tableDs = [];
              tableMap.forEach((val, index, arr) => {
                tableDs.push(val);
              });
              that.tableData = tableDs;
              let buyMoneyInTitle = 0.00;
              let buyCountInTitle = 0;
              tempMoneyArr.forEach(val => {
                buyMoneyInTitle += parseFloat(val);
              });
              that.buyMoneyInTitle = buyMoneyInTitle;
              that.buyCountInTitle = res.count;
              that.tableTitleTotalMoney = `采购额(合计：￥${buyMoneyInTitle})`;
              that.tableTitleTotalCount =  `采购笔数(合计：${ res.count == 0 ? 0 : res.count })`;
              switch (that.currentClickBtn.whichBtns) {
                case 0 :
                  that.handleAfterFetch();
                  break;
                default :
                  that.handleAfterFetch();
              }
              let tempIndexArr = [];
              let selectedSecondBtn = that.secodeBtns.filter((val, index, arr) => {
                return val.type == 'success';
              });
              let queryDateOp = selectedSecondBtn[0];
              let tempMoneyInXAxisArr = [];
              //let week = ['周一','周二','周三','周四','周五','周六','周日'];
              if (that.xAxisDate[0].indexOf('周') > -1) {
                tableDs.forEach((val, key, arr) => {
                  tempIndexArr.push({ index: new Date(val.creatime).getDay() || 7, money: val.totalPrice });
                });
              } else if (queryDateOp.text.indexOf('月') > -1) {
                tableDs.forEach((val, key, arr) => {
                  if (that.xAxisDate.indexOf(val.creatime.substring(0, val.creatime.lastIndexOf("-"))) > -1)
                    tempIndexArr.push({ index: that.xAxisDate.indexOf(val.creatime.substring(0, val.creatime.lastIndexOf("-"))), money: val.totalPrice });
                });
              } else {
                tableDs.forEach((val, key, arr) => {
                  if (that.xAxisDate.indexOf(val.creatime) > -1)
                    tempIndexArr.push({ index: that.xAxisDate.indexOf(val.creatime), money: val.totalPrice });
                });
              }
              for (let what = 0; what < that.xAxisDate.length; what ++) {
                tempIndexArr.forEach((val, index, arr) => {
                  if (val.index == what)
                    tempMoneyInXAxisArr.push(val.money);
                  else
                    tempMoneyInXAxisArr.push('0');
                });
              }
              that.buyMoneyInXAxis = tempMoneyInXAxisArr;
              //that.xAxisDate = that.daterange;
            }
          });
        },
        doForCase4And5 (isQueryByMonth) {
          var that = this;
          var month = parseInt(that.daterange[0].split('-')[1]);
          var last_month = parseInt(that.daterange[1].split('-')[1]);
          that.xAxisDate = [];
          var m_month = last_month - 1;
          var year = that.daterange[0].split('-')[0];
          if (isQueryByMonth) {
            for (let h = 0; h < 3; h ++) {
              h == 0 ? that.xAxisDate.push(`${year}-${month.toString().length > 1 ? month : `0${month}`}`) : h == 1 ? that.xAxisDate.push(`${year}-${m_month.toString().length > 1 ? m_month : `0${m_month}`}`) :
                that.xAxisDate.push(`${year}-${last_month.toString().length > 1 ? last_month : `0${last_month}`}`);
            }
          }
           else {
            var isThirtyOne = that.isThirtyOneDayOfMonth(m_month);
            var day1;
            if (month == 2)
              day1 = that.isLeapYear(that.daterange[0].split('-')[0]) ? 29 : 28;
            else
              day1 = that.isThirtyOneDayOfMonth(month) ? 31 : 30;
            var day2;
            switch (isThirtyOne) { //中间一个月是否是31天
              case true :
                day2 = 31;
                break;
              default :
                var isThirty = that.isThirtyDayOfMonth(m_month);
                switch (isThirty) {
                  case true :
                    day2 = 30;
                    break;
                  default :
                    if (that.isLeapYear(that.daterange[0].split('-')[0]))
                      day2 = 29;
                    else
                      day2 = 28;
                }
            }
            var day3 = that.daterange[1].split('-')[2];
            var dayCount = parseInt(day1) + parseInt(day2) + parseInt(day3);
            var tempCount = 1;
            var tempCount2 = 1;
            for (let k = 1; k <= dayCount; k ++) {
              switch (k <= parseInt(day1)) {
                case true :
                  that.xAxisDate.push(`${that.daterange[0].split('-')[0]}-${that.daterange[0].split('-')[1]}-${k.toString().length > 1 ? k : `0${k}`}`);
                  break;
                default :
                  switch (k <= parseInt(day1) + parseInt(day2)) {
                    case true :
                      that.xAxisDate.push(`${that.daterange[0].split('-')[0]}-${m_month.toString().length > 1 ? m_month : `0${m_month}`}-${tempCount.toString().length > 1 ? tempCount : `0${tempCount}`}`);
                      tempCount ++;
                      break;
                    default :
                      that.xAxisDate.push(`${that.daterange[0].split('-')[0]}-${that.daterange[1].split('-')[1]}-${tempCount2.toString().length > 1 ? tempCount2 : `0${tempCount2}`}`);
                      tempCount2 ++;
                  }

              }
            }
          }
        },
        doForCase6and7 (isQueryByMonth) {
          let year = this.daterange[0].split('-')[0];
          let isLeapYear = this.isLeapYear(year);
          let febDayCount;
          if (isLeapYear)
            febDayCount = 29;
          else
            febDayCount = 28;
          this.xAxisDate = [];
          if (isQueryByMonth) {
            for (let b = 1; b <= 12; b ++)
              this.xAxisDate.push(`${year}-${b.toString().length > 1 ? b : `0${b}`}`);
          }
           else {
            for (let a = 1; a <= 12; a ++) {
              switch (this.isThirtyOneDayOfMonth(a)) {
                case true :
                  for (let d = 1; d <= 31; d ++)
                    this.xAxisDate.push(`${year}-${a.toString().length > 1 ? a : `0${a}`}-${d.toString().length > 1 ? d : `0${d}`}`);
                  break;
                default :
                  switch (this.isThirtyDayOfMonth(a)) {
                    case true :
                      for (let d2 = 1; d2 <= 30; d2 ++)
                        this.xAxisDate.push(`${year}-${a.toString().length > 1 ? a : `0${a}`}-${d2.toString().length > 1 ? d2 : `0${d2}`}`);
                      break;
                    default :
                      for (let d3 = 1; d3 <= febDayCount; d3 ++)
                        this.xAxisDate.push(`${year}-${a.toString().length > 1 ? a : `0${a}`}-${d3.toString().length > 1 ? d3 : `0${d3}`}`);
                  }
              }
            }
          }
        },
        handleAfterFetch () {
          let selectedSecondBtn = this.secodeBtns.filter((val, index, arr) => {
            return val.type == 'success';
          });
          let queryDateOp = selectedSecondBtn[0];
          let s_start_year = this.daterange[0].split('-')[0];
          let s_end_year = this.daterange[1].split('-')[0];
          let s_start_month = this.daterange[0].split('-')[1];
          let s_end_month = this.daterange[1].split('-')[1];
          let s_start_day = '01';
          let s_end_day = parseInt(s_end_month) == 2 ? this.isLeapYear(s_end_year) ? 29 : 28 : this.isThirtyOneDayOfMonth(parseInt(s_end_month)) ? 31 : 30;
          let queryParam = queryDateOp.text.indexOf('月') > -1 ? {queryTime: JSON.stringify({'queryTime': [`${s_start_year}-${s_start_month}-${s_start_day}`, `${s_end_year}-${s_end_month}-${s_end_day}`]})}
            : {queryTime: JSON.stringify({'queryTime': [this.daterange[0], this.daterange[1]]})};
          var that = this;
          switch (that.currentClickBtn.index) { //第一排按钮
            case 0 : //如果是第一个，即本周
              if (queryDateOp.text.indexOf('月') > -1) //如果是按月查
                that.xAxisDate = s_start_month == s_end_month ? [`${s_start_year}-${s_start_month}`] : [`${s_start_year}-${s_start_month}`, `${s_end_year}-${s_end_month}`];
              else //按日查
                that.xAxisDate = ['周一','周二','周三','周四','周五','周六','周日'];
              break;
            case 1 :
              if (queryDateOp.text.indexOf('月') > -1) //如果是按月查
                that.xAxisDate = s_start_month == s_end_month ? [`${s_start_year}-${s_start_month}`] : [`${s_start_year}-${s_start_month}`, `${s_end_year}-${s_end_month}`];
              else //按日查
                that.xAxisDate = ['周一','周二','周三','周四','周五','周六','周日'];
              break;
            case 2 :
              that.xAxisDate = [];
              if (queryDateOp.text.indexOf('月') > -1)
                that.xAxisDate.push(`${s_start_year}-${s_start_month}`);
              else {
                var dateCount = that.daterange[1].split('-')[2] - that.daterange[0].split('-')[2] + 1;
                for (let i = 1; i <= parseInt(dateCount); i ++) {
                  that.xAxisDate.push(that.daterange[0].split('-')[0] + '-' + that.daterange[0].split('-')[1] + '-' + (i.toString().length > 1 ? i : `0${i}`));
                }
              }
              break;
            case 3 :
              if (queryDateOp.text.indexOf('月') > -1)
                that.xAxisDate.push(`${s_start_year}-${s_start_month}`);
              else {
                var dateCount = that.daterange[1].split('-')[2] - that.daterange[0].split('-')[2] + 1;
                that.xAxisDate = [];
                for (let i = 1; i <= parseInt(dateCount); i ++) {
                  that.xAxisDate.push(that.daterange[0].split('-')[0] + '-' + that.daterange[0].split('-')[1] + '-' + (i.toString().length > 1 ? i : `0${i}`));
                }
              }
              break;
            case 4 : //本季度
              that.doForCase4And5(queryDateOp.text.indexOf('月') > -1);
              break;
            case 5 :
              that.doForCase4And5(queryDateOp.text.indexOf('月') > -1);
              break;
            case 6 :
              that.doForCase6and7(queryDateOp.text.indexOf('月') > -1);
              break;
            case 7 :
              that.doForCase6and7(queryDateOp.text.indexOf('月') > -1);
              break;
          }
        }
      },
      watch : {
        buyMoneyInXAxis: function () {
          this.drawEchars();
        },
        xAxisDate: function () {
          this.drawEchars();
        }
      },
      mounted() {
        this.drawEchars();
        this.fetchDatas();
      }
    }
</script>

<style scoped>

</style>

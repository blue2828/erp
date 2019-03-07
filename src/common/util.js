export default {
  install (Vue, options) {
    Vue.prototype.formatTimeStampToTime = function (time, isDate) {
      switch (time) {
        case null :
          return "";
        case undefined :
          return "";
      }
      let result = undefined;
      let d = new Date(time);
      switch (isDate) {
        case false :
          result = d.getFullYear() + '-' + ((d.getMonth() + 1).toString().length > 1 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' +
            (d.getDate().toString().length > 1 ? d.getDate() : '0' + d.getDate()) + " " + (d.getHours().toString().length > 1 ? d.getHours() : '0' + d.getHours()) + ":" +
            (d.getMinutes().toString().length > 1 ? d.getMinutes() : '0' + d.getMinutes()) + ":" + (d.getSeconds().toString().length > 1 ? d.getSeconds() : '0' + d.getSeconds());
          break;
        default :
          result = d.getFullYear() + '-' + ((d.getMonth() + 1).toString().length > 1 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' +
          (d.getDate().toString().length > 1 ? d.getDate() : '0' + d.getDate());
      }
      return result;
    };
    Vue.prototype.randomData = function (maxData, minData) {
      return Math.round(Math.random() * (maxData - minData + 1) + minData)
    };
    Vue.prototype.isImg = function (type) {
      let requiredType = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
      requiredType = requiredType.filter((value, index, arr) => {
        return type.indexOf(value) > -1;
      });
      return requiredType.length > 0;
    }
    Vue.prototype.isNotNulled = function (inputVal) {
      return inputVal != undefined && inputVal != null && inputVal != '';
    }
    Vue.prototype.getUserImgAndSetToStore = function () {
      if (!this.isNotNulled(this.$store.getters.getAvatar)) {
        let that = this;
        $.ajax({
          url: '/api/sys/usr/getUserImg',
          data: { fromIndexVue: true },
          dataType: 'json',
          async: false,
          success: function (res) {
            switch (res) {
              case '' :
                $.ajax({
                  url: '/api/sys/usr/getCurrentUser',
                  dataType: 'json',
                  async: false,
                  success: function (result) {
                    if (result.currentUser != null && result.currentUser != undefined || result.currentUser != '') {
                      that.$store.dispatch('setAvatarUrl', result.currentUser.employee.sex == 0 ? wmHeader : manHeader);
                    }
                    else {
                      that.$store.dispatch('setAvatarUrl', manHeader);
                    }
                  }
                });
                break;
              default :
                that.$store.dispatch('setAvatarUrl', 'data:image/png;base64,' + res);
            }
          },
          error: function () {
            that.$notify({
              title: '系统提示',
              type: 'error',
              message: '获取用户头像失败',
              duration: 2000
            });
          }
        });
      }
    }
    Vue.prototype.isNumed = function (inputVal) {
      if (/^[0-9]+(\.)?\d{0,10}/.test(inputVal))
        return true;
      else
        return false;
    };
    Vue.prototype.isThirtyOneDayOfMonth = function (month) {
      return [1, 3, 5, 7, 8, 10, 12].indexOf(month) > -1;
    };
    Vue.prototype.isThirtyDayOfMonth = function (month) {
      return [4, 6, 9, 11].indexOf(month) > -1;
    };
    Vue.prototype.countDaysOfMonth = function (month, year) {
      let count;
      switch (this.isThirtyOneDayOfMonth(month)) {
        case true :
          count = 31;
          break;
        default :
          switch (this.isThirtyDayOfMonth(month)) {
            case true :
              count = 30;
              break;
            default :
              switch (this.isLeapYear(year)) {
                case true :
                  count = 29;
                  break;
                default :
                  count = 28;
              }
          }
      }
      return count;
    };
    Vue.prototype.isLeapYear = function (year) { //普通年能被4整除且不能被100整除的为闰年。（如2004年就是闰年,1900年不是闰年）世纪年能被400整除的是闰年，闰年2月29天。
      let flag = false;
      if (year % 1000 == 0) { //世纪年
        if (year % 400 == 0)
          flag = true;
      } else {
        if (year % 4 == 0 && year % 100 != 0)
          flag = true;
      }
      return flag;
    }
    Vue.prototype.commonThisWeekCompute = function (d, daysOfMonth, start) {
      let end;
      let startDay = start.split('-')[2];
      if (d.getMonth() + 1 == 12) { //如果是十二月
        switch (daysOfMonth - startDay >= 6) {
          case false : //如果当前日期的下一周就是下一个月了，同时下一个月又是下一年
            end = `${d.getFullYear() + 1}-01-0${6 - (daysOfMonth - startDay)}`;
            break;
          default :
            end = `${d.getFullYear()}-12-${this.mkSingleStrToDb(parseInt(startDay) + 6)}`;
        }
      } else {
        switch (daysOfMonth - startDay >= 6) {
          case false : //如果当前日期的下一周就是下一个月了
            end = `${d.getFullYear()}-${this.mkSingleStrToDb(d.getMonth() + 2)}-0${6 - (daysOfMonth - startDay)}`;
            break;
          default :
            end = `${d.getFullYear()}-${this.mkSingleStrToDb(d.getMonth() + 1)}-${this.mkSingleStrToDb(parseInt(startDay) + 6)}`;
        }
      }
      return end;
    };
    Vue.prototype.mkSingleStrToDb = function (str) {
      return str.toString().length > 1 ? str : `0${str}`;
    };
    Vue.prototype.firstDayOfWeek = function (d) {
      let temp = this.mkSingleStrToDb(d.getDate() - (d.getDay() || 7) + 1);
      return temp < 0 ? this.countDaysOfMonth(d.getMonth() + 1 == 1 ? 12 : d.getMonth, d.getMonth == 0 ? d.getFullYear() - 1 : d.getFullYear()) + temp : temp;
    };
    Vue.prototype.thisWeek = function () {
      let d = new Date();
      let start = `${d.getFullYear()}-${this.mkSingleStrToDb(d.getMonth() + 1)}-${this.firstDayOfWeek(d)}`;
      let end;
      let dayOfMonth = this.countDaysOfMonth(d.getMonth() + 1, d.getFullYear());
      end = this.commonThisWeekCompute(d, dayOfMonth, start);
      return [start, end];
    }
    Vue.prototype.commonLastWeekCompute = function (d, daysOfLastMonth, firstDayOfThisWeek) {
      let start, end;
      if (firstDayOfThisWeek - 7 >= 0) { //如果当天是月份的7号之后的号数
        start = `${d.getFullYear()}-${this.mkSingleStrToDb(d.getMonth() + 1)}-${this.mkSingleStrToDb(firstDayOfThisWeek - 7)}`;
        end = `${d.getFullYear()}-${this.mkSingleStrToDb(d.getMonth() + 1)}-${this.mkSingleStrToDb(firstDayOfThisWeek - 1)}`;
      } else {
        switch (firstDayOfThisWeek == 1) { //如果是1号
          case true :
            end = `${d.getFullYear() }-${this.mkSingleStrToDb(d.getMonth())}-${daysOfLastMonth}`;
            start =  `${d.getFullYear() }-${this.mkSingleStrToDb(d.getMonth())}-${daysOfLastMonth - (6 - (firstDayOfThisWeek - 1))}`;
            break;
          default :
            end = `${d.getFullYear() }-${this.mkSingleStrToDb(d.getMonth() + 1)}-${firstDayOfThisWeek - 1}`;
            start = `${d.getFullYear() }-${this.mkSingleStrToDb(d.getMonth())}-${daysOfLastMonth - (6 - (firstDayOfThisWeek - 1))}`;
        }
      }
      return [start, end];
    };
    Vue.prototype.lastWeek = function () {
      let d = new Date();
      let end, start;
      let thisWeek = this.thisWeek();
      let firstDayOfThisWeek = thisWeek[0].split('-')[2];
      switch (d.getMonth() + 1) {
        case 1 : //如果当天是一月
          switch (firstDayOfThisWeek) {
            case 1 :  //如果当天是一号
              end = `${d.getFullYear() - 1}-12-31`; //那么上周结束日期就是去年12月31号
              start = `${d.getFullYear() - 1}-12-24`;
              break;
            default : //是一月但不是一月一号
              end =  `${d.getFullYear()}01${this.mkSingleStrToDb(firstDayOfThisWeek - 1)}`;
              if (firstDayOfThisWeek - 7 >= 0)
                start = `${d.getFullYear()}-01${this.mkSingleStrToDb(firstDayOfThisWeek - 7)}`;
              else
                start = `${d.getFullYear() - 1}12${31 - (6 - (firstDayOfThisWeek - 1))}`  ;
          }
          break;
        default : //如果不是一月
          let daysOfLastMonth = this.countDaysOfMonth(d.getMonth(), d.getFullYear());
          let result = this.commonLastWeekCompute(d, daysOfLastMonth, firstDayOfThisWeek);
          start = result[0];
          end = result[1];
    };
      return [start, end];
  }
  Vue.prototype.thisMonth = function () {
      let d = new Date();
      let start, end;
      let isFeb = this.isLeapYear(d.getMonth() + 1) ? 29 : 28;
      let daysOfMonth = this.isThirtyOneDayOfMonth(d.getMonth() + 1) ? 31 : d.getMonth() == 2 ? isFeb : 30;
      start = d.getFullYear() + '-' + ((d.getMonth() + 1).toString().length > 1 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-01';
      end = d.getFullYear() + '-' + ((d.getMonth() + 1).toString().length > 1 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' + daysOfMonth;
      return [start, end];
  }
    Vue.prototype.lastMonth = function () {
      let d = new Date();
      let start, end;
      switch (d.getMonth() + 1) {
        case 1 :
          start = d.getFullYear() - 1 + '-12-01';
          end = d.getFullYear() - 1 + '-12-31';
          break;
        default :
          let isFeb = this.isLeapYear(d.getMonth()) ? 29 : 28;
          let daysOfMonth = this.isThirtyOneDayOfMonth(d.getMonth()) ? 31 : d.getMonth() == 2 ? isFeb : 30;
          start = d.getFullYear() + '-' + (d.getMonth().toString().length > 1 ? d.getMonth() : '0' + d.getMonth() + '-01');
          end = d.getFullYear() + '-' + (d.getMonth().toString().length > 1 ? d.getMonth() : '0' + d.getMonth() + '-' + daysOfMonth);
      }
      return [start, end];
    };

    Vue.prototype.thisQuarter = function () {
      let quarter = ['1,2,3', '4,5,6', '7,8,9', '10,11,12'];
      let d = new Date();
      let start, end;
      quarter.forEach((val, key, arr) => {
        switch (val.split(",").indexOf((d.getMonth() + 1).toString()) > -1) {
          case true :
            let tempArr = quarter[key].split(',');
            let isFeb = this.isLeapYear(d.getFullYear()) ? 29 : 28;
            let daysOfMonth = this.isThirtyOneDayOfMonth(tempArr[0]) ? 31 : tempArr[0] == 2 ? isFeb : 30;
            start = d.getFullYear() + '-' + (tempArr[0].length > 1 ? tempArr[0] : '0' + tempArr[0]) + '-01';
            daysOfMonth = this.isThirtyOneDayOfMonth(parseInt(tempArr[2])) ? 31 : tempArr[2] == 2 ? isFeb : 30;
            end = d.getFullYear() + '-' + (tempArr[2].length > 1 ? tempArr[2] : '0' + tempArr[2]) + '-' + daysOfMonth;
            return false;
        }
      });
      return [start, end];
    };
    Vue.prototype.lastQuarter = function () {
      let quarter = ['1,2,3', '4,5,6', '7,8,9', '10,11,12'];
      let d = new Date();
      let start, end;
      quarter.forEach((val, key, arr) => {
        if (val.split(",").indexOf('1') > -1 || val.split(",").indexOf('2') > -1 || val.split(",").indexOf('3') > -1) {
          start = d.getFullYear() - 1 + '-10-01';
          end = d.getFullYear() - 1 + '-12-31';
          return false;
        }
        switch (val.split(",").indexOf((d.getMonth() + 1).toString()) > -1) {
          case true :
            let tempArr = quarter[key - 1].split(',');
            let isFeb = this.isLeapYear(d.getFullYear()) ? 29 : 28;
            let daysOfMonth = this.isThirtyOneDayOfMonth(tempArr[0]) ? 31 : tempArr[0] == 2 ? isFeb : 30;
            start = d.getFullYear() + '-' + (tempArr[0].length > 1 ? tempArr[0] : '0' + tempArr[0]) + '-01';
            daysOfMonth = this.isThirtyOneDayOfMonth(parseInt(tempArr[2])) ? 31 : tempArr[2] == 2 ? isFeb : 30;
            end = d.getFullYear() + '-' + (tempArr[2].length > 1 ? tempArr[2] : '0' + tempArr[2]) + '-' + daysOfMonth;
            return false;
        }
      });
      return [start, end];
    };
    Vue.prototype.thisYear = function () {
      let d = new Date();
      let start, end;
      start = d.getFullYear() + '-01-01';
      end = d.getFullYear() + '-12-31';
      return [start, end];
    };
    Vue.prototype.lastYear = function () {
      let d = new Date();
      let start, end;
      start = d.getFullYear() - 1 + '-01-01';
      end = d.getFullYear() - 1 + '-12-31';
      return [start, end];
    };
}
}

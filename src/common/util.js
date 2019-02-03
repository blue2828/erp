export default {
  install (Vue, options) {
    Vue.prototype.formatTimeStampToTime = function (time, isDate) {
      let result = undefined;
      let d = new Date(time);
      result = d.getFullYear() + '-' + ((d.getMonth() + 1).length > 1 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' +
        (d.getDate().length > 1 ? d.getDate() : '0' + d.getDate());
      switch (isDate) {
        case false :
          result = result + " " + (d.getHours().length > 1 ? d.getHours() : '0' + d.getHours()) + ":" +
            (d.getMinutes().length > 1 ? d.getMinutes() : '0' + d.getMinutes()) + ":" + (d.getSeconds().length > 1 ? d.getSeconds() : '0' + d.getSeconds());
      }
      return result;
    };
    Vue.prototype.randomData = function (maxData, minData) {
      return Math.floor(Math.random() * (maxData - minData + 1) + minData)
    };
  }
}

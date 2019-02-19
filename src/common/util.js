export default {
  install (Vue, options) {
    Vue.prototype.formatTimeStampToTime = function (time, isDate) {
      let result = undefined;
      let d = new Date(time);
      switch (isDate) {
        case false :
          result = d.getFullYear() + '-' + ((d.getMonth() + 1).toString().length > 1 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) + '-' +
            (d.getDate().toString().length > 1 ? d.getDate() : '0' + d.getDate());
          break;
      }
      result = result + " " + (d.getHours().toString().length > 1 ? d.getHours() : '0' + d.getHours()) + ":" +
        (d.getMinutes().toString().length > 1 ? d.getMinutes() : '0' + d.getMinutes()) + ":" + (d.getSeconds().toString().length > 1 ? d.getSeconds() : '0' + d.getSeconds());
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
      if (/^[0-9]+$/.test(inputVal))
        return true;
      else
        return false;
    };
  }
}

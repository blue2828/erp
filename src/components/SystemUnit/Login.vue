<template>
  <div id="container" >
    <div class="imgContainer">
      <img :src="imgSrc" class="imgHeader">
    </div>
    <div class="loginField">
      <el-form :model="loginForm" ref="loginForm" :status-icon="statusIcon" :size="formItemSize">
        <el-form-item>
          <el-input @blur="handleImg" style="margin-top: 40px;" class="inputSize" placeholder="账号/姓名"  prefix-icon="el-icon-erp-ai-user" v-model="loginForm.account"/>
        </el-form-item>
        <el-form-item>
          <el-input style="margin-top: 10px;" class="inputSize" type="password" placeholder="密码"  prefix-icon="el-icon-erp-mima"
                    @keyup.enter.native="doLogin" v-model="loginForm.password"/>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="rememberMe" class="rememberMe">记住我</el-checkbox>
          <a href="#" style="color: #E4E7ED;margin-left:200px;">注册</a>
        </el-form-item>
        <el-form-item>
          <el-button @click="doLogin" type="primary" icon="el-icon-erp-denglu" style="opacity: 0.8;margin-left: 50px;width: 300px;">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import manHeader from '@/assets/images/manHeader.jpg';
  import wmHeader from '@/assets/images/wmHeader.jpg';
    export default {
      data() {
        return {
          loginForm: {
            account: '',
            password: ''
          },
          statusIcon: true,
          formItemSize: 'medium',
          rememberMe: false,
          imgSrc: manHeader
        }
      },
      name: "Login",
      methods: {
        doLogin () {
          switch (this.loginForm.account) {
            case '' :
              this.$message({
                showClose: true,
                message: '请输入账号',
                type: 'error'
              });
              return;
          }
          switch (this.loginForm.password) {
            case '' :
            this.$message({
              showClose: true,
              message: '请输入密码',
              type: 'error'
            });
            return;
          }
          this.$http.get('/api/sys/usr/validateUser', {
              params: {
                userNameOrId: this.loginForm.account,
                password: this.loginForm.password,
                rememberMe: this.rememberMe
              }
            }).then((res) => {
              let msg = res.data.msg;
              switch (res.data.success) {
                case true :
                  this.$router.push('index');
                  break;
                default :
                  this.$message({
                    showClose: true,
                    message: msg,
                    type: 'error'
                  });
              }
            }).catch(() => {
            console.log("服务器访问失败");
            this.$message({
              showClose: true,
              message: '服务器访问失败',
              type: 'error'
            });
          });
        },
        handleImg: function() { //根据输入框请求服务器实现头像跟输入的用户头像对应
          let that = this;
          switch (this.loginForm.account) {
            case '' : //如果账号/用户名框无输入则return不执行下面请求服务器的代码
              return;
            default :
              this.$http.get('/api/sys/usr/getUserImg', {
                params: {
                  idOrName: this.loginForm.account
                }
              }).then(res => {
                switch (res.data) {
                  case '' : //如果头像不存在，即用户没有设置头像
                    $.ajax({
                      url: '/api/sys/usr/getUserByIdOrName', //根据输入账号或者用户名获取用户信息
                      dataType: 'json',
                      data: { idOrName: this.loginForm.account },
                      async: false,
                      success: function (result) {
                        if (result.resultUser != null && result.resultUser != undefined || result.resultUser != '') {//如果存在这个用户
                          that.imgSrc = result.resultUser.employee.sex == 0 ? wmHeader : manHeader; //如果是0 则女，头像为wmHeader，否则manHeader
                          that.$store.dispatch('setAvatarUrl', result.resultUser.employee.sex == 0 ? wmHeader : manHeader)
                        }
                        else {
                          that.imgSrc = manHeader;
                          that.$store.dispatch('setAvatarUrl', manHeader);
                        }
                      }
                    });
                    break;
                  default :
                    that.imgSrc = 'data:image/png;base64,' + res.data; //如果头像存在，则直接设置头像为获取到的
                    that.$store.dispatch('setAvatarUrl', 'data:image/png;base64,' + res.data);
                }
              }).catch(() => {
                this.$notify({
                  type: 'error',
                  message: '从服务器获取头像失败',
                  title: '系统提示',
                  duration: 2000
                });
              });
          }
        }
      },
      mounted() {
        this.$http.get('/api/sys/usr/isLogined').then((res) => {
          switch (res.data.isLogined) {
            case true :
              this.$router.push('index');
              break;
          }
        }).catch((e) => {
          console.log('=====服务器访问失败===' + e.message());
        });
      }
    }
</script>

<style scoped>
  #container {
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: url('../../assets/images/login_bg.jpeg');
    z-index: -1;
  }
  .imgContainer {
    width: 100px;
    height: 100px;
    border: 4px solid rgba(68, 87, 107, 0.8);
    border-radius: 50%;
    margin: 5vh 0 0 46.3vw;
  }
  .imgHeader {
    opacity: 0.8;
    width: 100px;
    height: 100px;
    z-index: 1000;
    border-radius: 50%;
  }
  .loginField {
    display: flex;
    position: fixed;
    width: 400px;
    height: 300px;
    background-color: rgba(68, 87, 107, 0.3);
    margin: 32vh 0 0 35.2vw;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 18px;
  }
  .inputSize {
    opacity: 0.5;
    width: 300px;
    margin-left: 50px;
  }
  .rememberMe {
    margin: 0 0 0 50px;
  }
</style>

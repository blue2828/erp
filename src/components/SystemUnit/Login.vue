<template>
  <div id="container" >
    <div class="imgContainer">
      <img src="../../assets/images/manHeader.jpg" class="imgHeader">
    </div>
    <div class="loginField">
      <el-form :model="loginForm" ref="loginForm" :status-icon="statusIcon" :size="formItemSize">
        <el-form-item>
          <el-input style="margin-top: 40px;" class="inputSize" placeholder="账号/姓名"  prefix-icon="el-icon-erp-ai-user" v-model="loginForm.account"/>
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
    export default {
      data() {
        return {
          loginForm: {
            account: '',
            password: ''
          },
          statusIcon: true,
          formItemSize: 'medium',
          rememberMe: false
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
          this.$http.get('/api/sys/usr/validateUser').then((res) => {
            alert(res.msg);
            alert(res.data.msg);
          }).catch(() => {
            console.log("检查服务器");
            this.$message({
              showClose: true,
              message: '检查服务器',
              type: 'error'
            });
          });
        }
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

<template>
  <el-container style="width: 100%; height: 100%;display: flex; position: fixed;top: 0;bottom: 0;left: 0;right: 0;">
    <el-header>
    <el-menu
      style="width: 100%;display: flex;position: fixed;top: 0;left: 0;right: 0;float: right;"
      :default-active="this.$router.path"
      router
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <div style="color: white;font-size: 18px;width: 84%;text-align: left;margin-left: 30px;">进销存后台管理</div>
      <el-menu-item index="4">订单管理</el-menu-item>
      <el-dropdown trigger="click" style="position: fixed;left: 94vw;top: 10px;" @command="handleCommand">
      <span class="el-dropdown-link" style="cursor: pointer;color: white;">
        <img :src="getImgHeader" width="30" height="30" ref="littleImgHeader" style="border-radius: 50%;"><i class="el-icon-arrow-down el-icon--right"></i>
      </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item disabled>用户：{{currentUser.userName}}</el-dropdown-item>
          <el-dropdown-item command="doEditInfo">编辑资料</el-dropdown-item>
          <el-dropdown-item command="doUpdatePwd">修改密码</el-dropdown-item>
          <el-dropdown-item command="doLogout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>

    </el-header>
    <el-container>
      <el-aside :width="asideWidth">
        <el-menu router :default-active="defaultUrl" :collapse="isCollapse">
          <el-menu-item index="" :style="logoItemHeight" style="padding-top: 0;">
            <div class="imgContainer" :style="imgContainerCss">
              <img :src="getImgHeader" class="imgHeader" ref="bigImgHeader"  :style="imgCss">
            </div>
          </el-menu-item>
          <el-submenu index="0">
            <template slot="title">
              <i class="el-icon-erp-caigoudingdan"></i>
              <span>采购管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/supplierManage">供应商管理</el-menu-item>
              <el-menu-item index="/buyOrder">采购订单</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-erp-xiaoshou"></i>
                    <span>销售管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="/customerManage">客户管理</el-menu-item>
                    <el-menu-item index="saleOrder">销售订单</el-menu-item>
                  </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2" >
                   <template slot="title">
                     <i class="el-icon-erp-kucunguanli"></i>
                     <span>库存管理</span>
                   </template>
                   <el-menu-item-group>
                      <el-menu-item index="2-1">库存查看</el-menu-item>
                      <el-menu-item index="2-2">销售审批</el-menu-item>
                      <el-menu-item index="2-3">采购审批</el-menu-item>
                   </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                    <template slot="title">
                      <i class="el-icon-erp-icon"></i>
                      <span>统计分析</span>
                    </template>
                    <el-menu-item-group>
                       <el-menu-item index="3-1">采购分析</el-menu-item>
                       <el-menu-item index="3-2">销售分析</el-menu-item>
                       </el-menu-item-group>
              </el-submenu>
              <el-submenu index="4">
                    <template slot="title">
                      <i class="el-icon-erp-kaifajichushezhi"></i>
                      <span>基础设置</span>
                    </template>
                    <el-menu-item-group>
                       <el-menu-item index="/goodsManage">商品管理</el-menu-item>
                       <el-menu-item index="/repoManage">仓库管理</el-menu-item>
                       <el-menu-item index="/employeeManage">员工管理</el-menu-item>
                       </el-menu-item-group>
              </el-submenu>
              <el-submenu index="5">
                    <template slot="title">
                      <i class="el-icon-erp-xitongguanli"></i>
                      <span>系统管理</span>
                    </template>
                    <el-menu-item-group>
                       <!--<el-menu-item index="5-1">菜单管理</el-menu-item>-->
                       <el-menu-item index="/role_Permission">角色管理</el-menu-item>
                       <el-menu-item index="/userManage">用户管理</el-menu-item>
                    </el-menu-item-group>
              </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-col :span="24" class="breadcrumb-container">
            <img @click="doCollapse" :src="toggle_img" @mouseout="outOfImg" @mouseover="overImg"
                 :style="{cursor: 'pointer',position: 'fixed',left: imgLeftBorder}" >
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24">
            <div style="margin-top:10px">
              <router-view></router-view>
            </div>
          </el-col>
        </el-main>
        <el-footer></el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
  import indent from '@/assets/images/indent.png';
  import indent_selected from '@/assets/images/indent_selected.png';
  import outdent from '@/assets/images/outdent.png';
  import outdent_selected from '@/assets/images/outdent_selected.png';
  import manHeader from '@/assets/images/manHeader.jpg';
  import wmHeader from '@/assets/images/wmHeader.jpg';
  import Login from './Login';
  export default {
    name: 'Index',
    data() {
      return {
        socketPath: 'ws://localhost:8088/pushMsg',
        socket: '',
        activeIndex: '1',
        activeIndex2: '1',
        toggle_img: indent,
        isCollapse: false,
        asideWidth: '200px',
        imgLeftBorder: '220px',
        defaultUrl: '/userManage',
        imgSrc: manHeader,
        imgContainerCss: {
          margin: '8px 0 0 30px',
          width: '80px',
          height: '80px'
        },
        imgCss: {
          width: '80px',
          height: '80px'
        },
        logoItemHeight: { height: '100px' },
        currentUser: {}
      };
    },
    methods: {
      doCollapse () {
        this.isCollapse = ! this.isCollapse;
        this.toggle_img = this.isCollapse ? outdent : indent;
        this.asideWidth = this.isCollapse ? '65px' : '200px';
        this.imgLeftBorder = this.isCollapse ? '85px' : '220px';
        this.imgCss = this.isCollapse ? { width: '30px', height: '30px', marginBottom: '24px' } : { width: '80px', height: '80px' };
        this.imgContainerCss = this.isCollapse ? { marginTop: '8px', width: '30px', height: '30px',  border: '2px solid rgba(68, 87, 107, 0.8)' } :
          { margin: '8px 0 0 30px', width: '80px', height: '80px', border: '4px solid rgba(68, 87, 107, 0.8)' };
        this.logoItemHeight = this.isCollapse ? { height: '50px', paddingTop: '4px'} : { height: '100px' };
      },
      overImg () {
        this.toggle_img = this.isCollapse ? outdent_selected : indent_selected;
      },
      outOfImg () {
        this.toggle_img = this.isCollapse ? outdent : indent;
      },
      handleCommand (command) {
        switch (command) {
          case 'doLogout' :
            this.$http.get('/api/sys/usr/logout').then(res => {
              switch (res.data.success) {
                case true :
                  this.$router.push("/");
                  break;
                default:
                  this.$message({
                    message: '退出登录失败',
                    showClose: true,
                    type: 'error',
                    duration: 2000
                  });
              }
            }).catch(() => {
              this.$message({
                message: '退出登录失败',
                showClose: true,
                type: 'error',
                duration: 2000
              });
            });
            break;
        }
      },
      initSocket () {
        this.socket = new WebSocket(this.socketPath);
        this.socket.onopen = this.socketOpen;
        this.socket.onerror = this.socketErr;
        this.socket.onmessage = this.onSocketMsg;
      },
      socketOpen () {
        console.log("websocket连接成功");
      },
      socketClose () {
        console.log("websocket已经关闭");
      },
      onSocketMsg (msg) {
        msg = JSON.parse(msg.data);
        if (null != msg && undefined != msg) {
          if (undefined != msg.errMsg) {
            this.$notify.error({
              title: '系统提示',
              message: msg.errMsg,
              duration: 2000
            });
            if (msg.errMsg.indexOf("登录") > -1)
              this.$router.push("/");
          }
        }
      },
      socketErr () {
        console.log("websocket连接出错");
      },
      sendMsg (msg) {
        this.socket.send(msg);
      }
    },
    watch: {
      '$router': function (newVal, oldVal) {
        this.defaultUrl = this.$router.path;
      }
    },
    created() {
      this.$http.get('/api/sys/usr/getCurrentUser').then(res => {
        let info = res.data.currentUser;
        if (info != null && info != undefined)
          this.currentUser = info;
        this.$store.dispatch('setCurrentUser', info);
      }).catch(() => {
        console.log("获取当前用户信息失败");
      });
      this.$http.get('/api/sys/usr/isLogined').then((res) => {
        let isLogined = res.data.isLogined;
        if (!isLogined) {
          this.$notify({
            type: 'error',
            message: '未登录',
            title: '警告',
            duration: 2000
          });
          let timeout = setTimeout(() => {
            this.$router.push("/");
          }, 2000);
        }
      }).catch(() => {
        console.log("请求服务器判断是否已登录失败");
      });
    },
    computed: {
      getImgHeader: function () {
        return this.$store.getters.getAvatar;
      }
    },
    mounted() {
      this.initSocket();
      let that = this;
      let href = window.location.href;
      this.defaultUrl = href.split("#")[1];
      let thisUrl = href.split("#")[1];
      switch (thisUrl.indexOf("index") > -1) {
        case true :
          that.$router.push("/userManage");
          break;
      }
      /**
       * 刷新除了登录组件之外的路由会导致store里面的avatar销毁，所以不存在再次获取头像，并set到store里面
       */
      this.getUserImgAndSetToStore();
    }
  }
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .breadcrumb-inner {
    margin-top: 36px;
  }
  .imgContainer {
    border: 4px solid rgba(68, 87, 107, 0.8);
    padding: 0;
    border-radius: 50%;
  }
  .imgHeader {
    opacity: 0.8;
    border-radius: 50%;
  }
</style>

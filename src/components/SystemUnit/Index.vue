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
      <div style="color: white;font-size: 18px;width: 60%;text-align: left;margin-left: 30px;">进销存后台管理</div>
      <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
    </el-menu>

    </el-header>
    <el-container>
      <el-aside :width="asideWidth">
        <el-menu router :default-active="defaultUrl" :collapse="isCollapse">
          <el-menu-item index="logo" :style="logoItemHeight" style="padding-top: 0;">
            <div class="imgContainer" :style="imgContainerCss">
              <img :src="imgSrc" class="imgHeader" :style="imgCss">
            </div>
          </el-menu-item>
          <el-submenu index="0">
            <template slot="title">
              <i class="el-icon-erp-caigoudingdan"></i>
              <span>采购管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">供应商管理</el-menu-item>
              <el-menu-item index="1-2">采购订单</el-menu-item>
              <el-menu-item index="1-3">采购退货</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-erp-xiaoshou"></i>
                    <span>销售管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="1-1">客户管理</el-menu-item>
                    <el-menu-item index="1-2">销售订单</el-menu-item>
                    <el-menu-item index="1-3">销售退货</el-menu-item>
                  </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2" >
                   <template slot="title">
                     <i class="el-icon-erp-kucunguanli"></i>
                     <span>库存管理</span>
                   </template>
                   <el-menu-item-group>
                      <el-menu-item index="2-1">采购审核</el-menu-item>
                      <el-menu-item index="2-2">销售审核</el-menu-item>
                   <el-submenu index="2-3">
                      <template slot="title">库存查看</template>
                      <el-menu-item index="2-3-1">库存调拨</el-menu-item>
                   </el-submenu>
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
                       <el-menu-item index="4-1">商品管理</el-menu-item>
                       <el-menu-item index="4-2">仓库管理</el-menu-item>
                       <el-menu-item index="4-3">员工管理</el-menu-item>
                       </el-menu-item-group>
              </el-submenu>
              <el-submenu index="5">
                    <template slot="title">
                      <i class="el-icon-erp-xitongguanli"></i>
                      <span>系统管理</span>
                    </template>
                    <el-menu-item-group>
                       <el-menu-item index="5-1">菜单管理</el-menu-item>
                       <el-menu-item index="5-2">角色管理</el-menu-item>
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
        logoItemHeight: { height: '100px' }
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
      }
    },
    watch: {
      '$router': function (newVal, oldVal) {
        this.defaultUrl = this.$router.path;
      }
    },
    created() {
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
    mounted() {
      let that = this;
      let href = window.location.href;
      this.defaultUrl = href.split("#")[1];
      this.$router.push("/userManage");
      this.$http.get('/api/sys/usr/getUserImg', {
        params: {
          fromIndexVue: true
        }
      }).then(res => {
        switch (res.data) {
          case '' :
            $.ajax({
              url: '/api/sys/usr/getCurrentUser',
              dataType: 'json',
              async: false,
              success: function (result) {
                if (result.currentUser != null && result.currentUser != undefined || result.currentUser != '')
                  that.imgSrc = result.currentUser.employee.sex == 0 ? wmHeader : manHeader;
                else
                  that.imgSrc = manHeader;
              }
            });
            break;
          default :
            that.imgSrc = 'data:image/png;base64,' + res.data; //如果头像存在，则直接设置头像为获取到的
        }
      }).catch(() => {
        this.$notify({
          title: '系统提示',
          type: 'error',
          message: '获取用户头像失败',
          duration: 2000
        });
      });
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

<template>
  <el-container style="width: 100%; height: 100%;display: flex; position: fixed;top: 0;bottom: 0;left: 0;right: 0;">
    <el-header>
    <div class="line"></div>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1">处理中心</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3" disabled>消息中心</el-menu-item>
      <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
    </el-menu>

    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu >
          <el-submenu index="0">
            <template slot="title">
              <i class="el-icon-location"></i>
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
                    <i class="el-icon-location"></i>
                    <span>销售管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="1-1">客户管理</el-menu-item>
                    <el-menu-item index="1-2">销售订单</el-menu-item>
                    <el-menu-item index="1-3">销售退货</el-menu-item>
                  </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                   <template slot="title">
                     <i class="el-icon-location"></i>
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
                      <i class="el-icon-location"></i>
                      <span>统计分析</span>
                    </template>
                    <el-menu-item-group>
                       <el-menu-item index="3-1">采购分析</el-menu-item>
                       <el-menu-item index="3-2">销售分析</el-menu-item>
                       </el-menu-item-group>
              </el-submenu>
              <el-submenu index="4">
                    <template slot="title">
                      <i class="el-icon-location"></i>
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
                      <i class="el-icon-location"></i>
                      <span>系统管理</span>
                    </template>
                    <el-menu-item-group>
                       <el-menu-item index="5-1">菜单管理</el-menu-item>
                       <el-menu-item index="5-2">角色管理</el-menu-item>
                       <el-menu-item index="5-3">用户管理</el-menu-item>
                       </el-menu-item-group>
              </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main></el-main>
        <el-footer></el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<script>
    export default {
      data () {
        return {
        };
      },
      name: "Index"
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
    line-height: 160px;
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
</style>

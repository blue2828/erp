<template>
  <el-container style="width: 100%; height: 100%;display: flex; position: fixed;top: 0;bottom: 0;left: 0;right: 0;">
    <el-header></el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu >
          <el-submenu index="0">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
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

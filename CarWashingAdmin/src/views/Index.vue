<template>
  <el-container>
    <el-aside width="2.1rem">
      <side-nav></side-nav>
    </el-aside>
    <el-container>
      <el-header height=".41rem">
        <head-nav></head-nav>
      </el-header>
      <el-main>
        <div class="main-wrapper">
          <keep-alive><router-view></router-view></keep-alive>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import SideNav from '@/components/SideNav'
  import HeadNav from '@/components/HeadNav'
  export default {
    name: "Index",
    components: {
      SideNav,
      HeadNav,
    },
    mounted() {
      if (!JSON.parse(sessionStorage.getItem('user'))) {
        this.$router.push('/')
    }
    },
    data() {
      return { }
    }
  }
</script>
<style>
  .el-main {
    padding: .1rem;
  }
</style>
<style scoped>
  .el-container {
    height: 100%;
  }

  .el-aside {
    background-color: #072847;
    height: 100%;
    margin: -1px;
  }

  .el-main {
    background-color: #F2F2F2;
  }


  .main-wrapper {
    background-color: #FFF;
    padding: .1rem;
    border-radius: .04rem;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
</style>


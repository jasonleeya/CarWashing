<template>
<div class="header">
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-if="this.$route.path.indexOf('main')!==-1&&this.$route.path.indexOf('modifypwd')===-1" :to="{ path: '/main/index' }">管理员页面</el-breadcrumb-item>
    <el-breadcrumb-item v-if="this.$route.path.indexOf('branch')!==-1&&this.$route.path.indexOf('modifypwd')===-1" :to="{ path: '/branch/order' }">分店员页面</el-breadcrumb-item>
    <el-breadcrumb-item v-if="this.$route.path==='/main/manager'" :to="{path:'/main/manager'}">分店管理员</el-breadcrumb-item>
    <el-breadcrumb-item v-if="this.$route.path==='/main/servicecontent'" :to="{path:'/main/servicecontent'}">服务内容维护</el-breadcrumb-item>
    <el-breadcrumb-item v-if="this.$route.path==='/main/brand'" :to="{path:'/main/brand'}">品牌维护</el-breadcrumb-item>
    <el-breadcrumb-item v-if="this.$route.path==='/main/carclassify'" :to="{path:'/main/carclassify'}">品牌维护</el-breadcrumb-item>
    <el-breadcrumb-item v-if="this.$route.path==='/main/cartype'" :to="{path:'/main/cartype'}">车型维护</el-breadcrumb-item>
    <el-breadcrumb-item v-if="this.$route.path==='/main/shop'" :to="{path:'/main/shop'}">店铺维护</el-breadcrumb-item>
    <el-breadcrumb-item v-if="this.$route.path==='/main/feedback'" :to="{path:'/main/feedback'}">反馈意见浏览</el-breadcrumb-item>
    <el-breadcrumb-item v-if="this.$route.path==='/branch/order'" :to="{path:'/branch/order'}">订单浏览</el-breadcrumb-item>
    <el-breadcrumb-item v-if="this.$route.path==='/branch/modifystate'" :to="{path:'/branch/modifystate'}">订单状态修改</el-breadcrumb-item>
    <el-breadcrumb-item v-if="this.$route.path==='/main/modifypwd'" :to="{path:'/main/modifypwd'}">修改密码</el-breadcrumb-item>
  </el-breadcrumb>

  <el-dropdown>
  <span class="el-dropdownel-nk">
    {{type==='1'?'总管理员':'分店管理员'}}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item><router-link tag="span" to="/main/modifypwd">修改密码</router-link></el-dropdown-item>
      <el-dropdown-item><span @click="handleLogout">退出登录</span></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</div>
</template>

<script>
    export default {
        name: "Header",
      data() {
          return{
            type:JSON.parse(sessionStorage.getItem('user')).type
          }
      },
      methods:{
        handleLogout() {
          console.log(111)
          this.$store.commit('logout');
          this.$router.push('/')

        }
      }
    }
</script>

<style scoped>
  .header {
    position: relative;
  }
.el-breadcrumb {
  line-height: .41rem;
}
 .el-dropdown {
   position: absolute;
   right: 0;
   top: 50%;
   transform: translateY(-50%);
 }
</style>

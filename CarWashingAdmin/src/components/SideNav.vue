<template>
      <el-menu
        default-active="2"
        background-color="#072847"
        text-color="#fff"
        active-text-color="#ff5733">


        <el-menu-item index="1">
          <i class="iconfont index-ico">&#xe64d;</i>
          <span slot="title"><router-link tag="span" to="/main/index">首页</router-link></span>
        </el-menu-item>


        <el-submenu index="2" v-if="type==='1'">
          <template slot="title">
            <i class="iconfont admin-ico">&#xe628;</i>
            <span>管理员页面</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1" ><router-link tag="span" to="/main/manager">分店管理员</router-link></el-menu-item>
            <el-menu-item index="2-2"><router-link tag="span" to="/main/servicecontent">服务内容维护</router-link></el-menu-item>
            <el-menu-item index="2-3"><router-link tag="span" to="/main/brand">品牌维护</router-link></el-menu-item>
            <el-menu-item index="2-4"><router-link tag="span" to="/main/cartype">车型维护</router-link></el-menu-item>
            <el-menu-item index="2-5"><router-link tag="span" to="/main/carclassify">分类管理</router-link></el-menu-item>
            <el-menu-item index="2-6"><router-link tag="span" to="/main/shop">店铺维护</router-link></el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="3">
          <template slot="title">
            <i class="iconfont branch-ico">&#xe680;</i>
            <span>分店页面</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1"><router-link tag="span" to="/branch/order">浏览订单</router-link></el-menu-item>
            <el-menu-item index="3-2"><router-link tag="span" to="/branch/modifystate">待施工订单</router-link></el-menu-item>
            <el-menu-item index="3-3"><router-link tag="span" to="/main/feedback">反馈意见浏览</router-link></el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>

</template>

<script>
    export default {
        name: "SideNav",
      data() {
          return{
          type:JSON.parse(sessionStorage.getItem('user')).type
          }
      }
    }
</script>

<style scoped>
  .branch-ico {
    font-size: .2rem;
  }
</style>

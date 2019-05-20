<template>
  <tabbar class="tabs">
    <tabbar-item link="/" :selected="this.$route.path==='/'" >
      <span slot="label">车辆保养</span>
      <span slot="icon" class="iconfont tab-ico maintain-ico">&#xe61d;</span>
      <span slot="icon-active" class="iconfont tab-ico  maintain-ico">&#xe61d;</span>
    </tabbar-item>
    <tabbar-item  link="/user" :selected="this.$route.path==='/user'">
      <span slot="label">个人中心</span>
      <span slot="icon" class="iconfont tab-ico user-ico">&#xe8e9;</span>
      <span slot="icon-active" class="iconfont tab-ico  user-ico">&#xe8e9;</span>

    </tabbar-item>
  </tabbar>
</template>

<script>
  import {Tabbar, TabbarItem} from 'vux'

  export default {
    name: 'Tabs',
    components: {
      Tabbar,
      TabbarItem
    },data(){
      return{

      }
    }
  }
</script>

<style scoped>
.tab-ico {
 font-size: .24rem;
}

</style>

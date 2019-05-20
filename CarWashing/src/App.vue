<template>
  <div id="app">
    <x-header class="header" v-if="isShowBack">
      <span @click="back "
            slot="overwrite-left"
            class="iconfont close-ico"
            v-if="isShowBack"></span>
      <span class="title">{{title}}</span>
    </x-header>
    <x-header class="header" v-if="!isShowBack"><span class="title">{{title}}</span>
    </x-header>
    <keep-alive><router-view v-if="$route.meta.keepAlive"></router-view></keep-alive>
     <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!--<tabs class="tabs" v-if="isShowTabs"></tabs>-->
  </div>
</template>

<script>
  import {XHeader} from 'vux'
  import Tabs from '@/components/Tabs'

  export default {
    name: 'App',
    components: {
      XHeader,
      Tabs
    },
    data () {
      return {
        title: '',
        isShowTabs: false,
        isShowBack: true,
      }
    },
    mounted () {
      if (this.$cookie.get('userInfo')) {
        this.$store.dispatch('setUser',JSON.parse(this.$cookie.get('userInfo')))
      }
    },
    methods: {
      back () {
        this.$router.back(-1)
      },

      setTitle () {
        switch (this.$route.name) {
          case 'Login':
            this.title = '用户登录'
            return
          case 'Maintain':
            this.title = '选择服务项目'
            return
          case 'User':
            this.title = '个人中心'
            return
          case 'CarManage':
            this.title = '车辆管理'
            return
          case 'MyOrder':
            this.title = '我的订单'
            return
          case 'Comment':
            this.title = '评论'
            return
          case 'Feedback':
            this.title = '反馈'
            return
        }

      },
      ShowTabs () {
        this.isShowTabs = this.$route.path === '/' || this.$route.path === '/user'
      },
      showBack () {
        //  isShowBack
        this.isShowBack = this.$route.path === '/' || this.$route.path === '/user' || this.$route.name === 'Login'||this.$route.path === '/onlyweixin'
      }
    },
    beforeMount () {
      this.setTitle()
      this.ShowTabs()
      this.showBack()

    },
    updated () {
      this.setTitle()
      this.ShowTabs()
      this.showBack()

    },

  }
</script>

<style scoped lang="less">
  @import '~vux/src/styles/1px.less';

  .title {
    font-size: .15rem;
    padding-left: .05rem;
    font-weight: bold;
  }

  #app {
    height: 100%;
    width: 100%;
    position: fixed;

  }

  .header, .tabs {
    z-index: 999;
  }

  .tabs {

  }
</style>

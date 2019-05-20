<template>
  <div>
    <group class="group">
      <cell class="cell" link="/carmanage" title="车辆管理"><span slot="icon" class="iconfont">&#xe604;</span>
        <span class="iconfont arrow">&#xe632;</span></cell>

      <cell class="cell" link="/myorder" title="我的订单"><span slot="icon" class="iconfont">&#xe605;</span>
        <span class="iconfont arrow">&#xe632;</span></cell>

      <cell class="cell" link="/feedback" title="意见反馈"><span slot="icon" class="iconfont">&#xe602;</span>
        <span class="iconfont arrow">&#xe632;</span></cell>

      <cell class="cell" title="联系客服"><a class="tel " href="tel:02362409229">023-62409229</a><span class="iconfont"
                                                                                                   slot="icon">&#xe603;</span>
      </cell>
    </group>
  </div>
</template>

<script>
  import {Cell, Group} from 'vux'

  export default {
    name: 'UserList',
    components: {
      Group, Cell
    }, data () {
      return {
        itemsList: [{
          title: '车辆管理',
          value: '',
          link: '/carmanage'
        }, {
          title: '我的订单',
          value: '',
          link: '/myorder'
        }, {
          title: '意见反馈',
          value: '',
          link: '/feedback'
        }]
      }
    }
  }
</script>
<style>
  .weui-cell_access .weui-cell__ft:after {
    border-color: transparent!important;
  }
</style>
<style scoped>
  .tel {
    color: #999;
  }

  .group {
    margin-top: -.2rem;
  }

  .cell {
    height: 36px;
  }

  .arrow {
    margin-right: -15px;
  }

</style>

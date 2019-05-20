<template>
    <div>
      <msg class="msg" title="请在微信端打开" description="检测到您未使用的浏览器不是微信内置浏览器，请在微信端打开此链接。" icon="warn" ></msg>
    </div>
</template>

<script>
  import {Msg} from 'vux'
  export default {
    name: 'OnlyWeiXin',
    components:{
      Msg
    }
  }
</script>

<style scoped>
  .msg {
    margin-top: 1rem;
  }
</style>

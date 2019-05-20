<template>
  <div class="unit-head">
    <div class="title">
      <slot name="title">标题</slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>

  </div>
</template>

<script>
  export default {
    name: "UnitHead"
  }
</script>

<style scoped>
  .unit-head {
    position: relative;
    height: .41rem;
    line-height: .41rem;
  }
  .title {
    position: relative;
    font-size: .16rem;
    font-weight: bold;
    height: .41rem;
    line-height: .41rem;
    padding-left: .1rem;
    /*margin-left: .1rem;*/
  }
  .title:before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: inline-block;
    width: .03rem;
    height: .22rem;
    background-color: #ff5733;
    left: 0;
  }
  .right {
    height: .4rem;
    position: absolute;
    right: 0;
    top: -.05rem;
  }
</style>

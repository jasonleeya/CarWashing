<template>
  <div>
    <grid class="grid" :cols="cols">
      <grid-item class="item" v-for="(item,index) in itemData" :key="index">
        <div class="item-wrapper">
          <input :id="index"
                 type="radio"
                 name="1"
                 :value="item.id"
                 v-model="choose">
          <label :for="index"></label>
          <div class="title">{{item.name}} </div>
          <div class="money"><span>￥</span>{{item.money}}</div>
        </div>

      </grid-item>
      <!--<router-link to="/carmanage">-->
        <!--<div class="sort-id-empty" v-if="!sortId">去添加车辆  >></div>-->
      <!--</router-link>-->

    </grid>
  </div>
</template>

<script>
  import {Grid, GridItem} from 'vux'

  export default {
    name: 'MaintainCheckerItem',
    props: {
      sortId: String
    },
    components: {
      Grid, GridItem
    },
    data () {
      return {
        cols: 2,
        choose: '',
        sId: '',
        itemData: []
      }
    },
    mounted () {
      let thi=this
      this.itemData=[]
      if (!this.sortId) {
        this.mySelect('projectList', {page: 1, page_size: 100}).then(function (data) {
          for (let i = 0; i < data.length; i++) {
            if (data[0].sort_id === data[i].sort_id) {
            thi.itemData.push(data[i])
            }
          }
        })
      }

    },
    watch: {
      choose (newVal, oldVal) {
        if (oldVal !== newVal) {
          let money = 0;
          for (let i = 0; i < this.itemData.length; i++) {
            if (newVal === this.itemData[i].id) {
              money=this.itemData[i].money
            }
          }
          this.$emit('Choose', {projectId:newVal,money:money})
        }
      }
      , sortId (n,o) {
        let thi = this
        this.mySelect('findProjectByCar', {id: parseInt(n)}).then(function (data) {
          thi.itemData=data
        })
      }
    }
  }
</script>
<style>

  .weui-grid:after, .weui-grid:before, .weui-grids:before {
    border: none !important;
  }

  .weui-grid:active {
    background-color: transparent !important;
  }
</style>
<style scoped>
  .grid {
    padding: .08rem .1rem;
    /*margin-bottom: -.13rem;*/
  }

  .item {
    margin-top: -.22rem;
  }

  .item-wrapper {
    position: relative;
    width: 100%;
    height: 1rem;
  }

  input {
    display: none;
  }

  label {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid #3D6FA7;
    border-radius: .05rem;
  }

  input[type='radio']:checked + label {
    background-color: rgba(172, 208, 255, 0.66);
    position: relative;
  }

  input[type='radio']:checked + label:after {
    content: '';
    display: block;
    width: .54rem;
    height: .54rem;
    background-image: url("../assets/imgs/check.png");
    background-repeat: no-repeat;
    background-size: 36px;
    position: absolute;
    bottom: -18px;
    right: -18px;
  }

  .title {
    font-size: .2rem;
    font-weight: bold;
    color: #000;
    width: 80%;
    text-align: center;
    position: absolute;
    top: .1rem;
    margin-left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    line-height: 1.3em;
  }

  .money {
    position: absolute;
    top: .6rem;
    margin-left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    text-align: center;
    color: rgb(253, 166, 79);
    font-size: .27rem;
    font-weight: bold;
  }
  .money span {
    font-size: 20px;
    position: absolute;

    left: -18px;

  }
.sort-id-empty {
  height: 1.5rem;
  line-height: 1.5rem;
  font-size: .2rem;
  color: #3D6FA7;
  text-align: center;
}
  .current-numb {
    font-size: .12rem;
    color: black;
    display: inline-block;
    width: 100%;
    text-align: center;
    line-height: .15rem;
    height: .2rem;
  }
</style>

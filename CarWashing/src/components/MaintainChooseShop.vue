<template>
  <div>
    <div class="choose-wrapper" @click="isSelectedProject">
      <span class="shop-name">{{value[0]}}</span>
      <span class="queue">{{pQueue!==''?pQueue+'人排队':'0人排队'}}</span>
      <span slot="title" class="iconfont choose-more">&#xe610;</span>
      <p class="address">{{address?address:'未知地址'}}</p>
      <popup-picker class="picker"
                    :data="shopList"
                    :columns="2"
                    v-model="value"
                    :disabled="isPickerisDisabled"
                    :display-format="format">
        <span slot="title">&nbsp;</span>
      </popup-picker>
    </div>


  </div>
</template>

<script>
  import {Group, PopupPicker} from 'vux'

  export default {
    name: 'MaintainChooseShop',
    components: {
      Group, PopupPicker
    },
    data () {
      return {
        value: ['未知店铺', 0],
        format: function (value, name) {
          return ``
        },
        timer: null,
        address: '',
        shopList: [],
        pQueue:'',
        isPickerisDisabled:true
      }
    },
    mounted () {

      this.getStart()
      // this.getQueue()
      if (this.$cookie.get('choosedShop')) {
        this.$store.dispatch('setShop', this.$cookie.get('choosedShop'))
      }
    },

    beforeDestroy () {
      clearInterval(this.timer)
    },
    methods: {
      getStart () {
        let thi = this
        this.mySelectAll('shopList', {page: 1, page_size: 500})
          .then(function (res) {
            // thi.shopList = res.data
            for (let i = 0; i < res.Total; i++) {
              res.data[i].value = res.data[i].name

              res.data.push({
                name: '店铺'+res.data[i].number + '人排队',
                value: res.data[i].number + '',
                parent: res.data[i].name
              })

            }

            if (!thi.$cookie.get('choosedShop')) {
              thi.$cookie.set('choosedShop', JSON.stringify({
                name: res.data[0].name,
                id: res.data[0].id
              }
              ), 3000)

              thi.$store.dispatch('setShop', {
                name: res.data[0].name,
                id:res.data[0].id
              })
              thi.value[0] = res.data[0].name
            } else {
              thi.value[0] = JSON.parse(thi.$cookie.get('choosedShop')).name

              let id
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].name === JSON.parse(thi.$cookie.get('choosedShop')).name) {
                  id = res.data[i].id
                }
              }

              thi.$store.dispatch('setShop', {
                name: JSON.parse(thi.$cookie.get('choosedShop')).name,
                id:id
              })
            }
            thi.address = res.data[0].adress
          })

        thi.mySelect('getQueueByShop', {id: JSON.parse(thi.$cookie.get('choosedShop')).id}).then(function (data2) {
          thi.value[1] = data2
        })

      },

      getQueue () {
        if (this.timer) {
          clearInterval(this.timer)
        } else {
          this.timer = setInterval(() => {
            let thi = this
            this.mySelect('getQueueByShop', {id: JSON.parse(thi.$cookie.get('choosedShop')).id}).then(function (data) {
              thi.value[1] = data
              thi.$forceUpdate()
            })


          }, 10000)
        }
      },
      isSelectedProject () {
        if (this.pQueue === '') {
          this.$emit('showToast','请先选择套餐')
        } else {
          this.isPickerisDisabled = false
          this.shopList=[]
          this.shopList=this.$store.state.shopLineList
        }
      },


    },
    watch: {
      value (n, o) {

        let id

        let thi = this
        let shop = this.value[0]
        for (let i = 0; i < this.shopList.length; i++) {
          if (this.value[0] === this.shopList[i].name) {
            this.address = this.shopList[i].adress
          }
          if (this.shopList[i].name === n[0]) {
            id = this.shopList[i].id
          }
        }
        this.$cookie.set('choosedShop', JSON.stringify({
          name:n[0],
          id:id
        }), 3000)
        console.log(this.$cookie.get('choosedShop'))

        this.$store.dispatch('setShop', {name: n[0], id: id})
        this.$emit('shoopChange')
        this.mySelect('getQueueByShop', {id: id}).then(function (data) {
          thi.value[1] = data
          thi.$forceUpdate()
        })
      },
      '$store.state.pQueue':function () {
        this.pQueue=this.$store.state.pQueue
      }
    }

  }
</script>

<style>
  .vux-popup-header-right {
    color: #3D6FA7 !important;
  }

  .weui-cell_access .weui-cell__ft:after {
    display: none;
  }

  .vux-tap-active:active {
    background-color: transparent !important;
  }

  .weui-cell_access .weui-cell__ft:after {
    border-color: transparent !important;
  }
</style>
<style scoped>
  .choose-wrapper {
    background-color: white;
    width: 100%;
    height: .6rem;
    box-sizing: border-box;
    padding: .05rem .1rem 0;
    border: 1px solid #3D6FA7;;
    transform: translateX(-50%);
    margin-left: 50%;
    border-radius: .05rem;
    font-size: .16rem;
    line-height: .25rem;
    text-align: center;
  }

  .queue {
    position: relative;
    font-size: .14rem;
    right: .2rem;
  }

  .shop-name {
    margin-right: .3rem;
    font-weight: bold;
    font-size: .15rem;
  }

  .address {
    font-size: .12rem;
  }

  .queue:before {
    position: absolute;
    top: 50%;
    left: -.1rem;
    transform: translateY(-50%);
    content: "";
    display: inline-block;
    width: 1.5px;
    height: .25rem;
    background-color: #3D6FA7;

  }

  .choose-more {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: .1rem;
    font-size: .12rem;
    color: #3D6FA7;
  }

  .picker {
    width: 100%;
    height: .4rem;
    top: 0;
    position: absolute;
    background-color: transparent;
  }
</style>
<!--
 list: [{
          name: '汽车服务1店',
          value: '汽车服务1店',
        }, {
          name: '汽车服务2店',
          value: '汽车服务2店',
        }, {
          name: '汽车服务3店',
          value: '汽车服务3店',
        }, {
          name: '汽车服务4店',
          value: '汽车服务4店',
        }, {
          name: '汽车服务5店',
          value: '汽车服务5店',
        }, {
          name: 1,
          value: '1',
          parent: '汽车服务1店'
        }, {
          name: 2,
          value: '1',
          parent: '汽车服务2店'
        }, {
          name: 3,
          value: '3',
          parent: '汽车服务3店'
        }, {
          name: 4,
          value: '4',
          parent: '汽车服务4店'
        }, {
          name: 5,
          value: '5',
          parent: '汽车服务5店'
        }]-->

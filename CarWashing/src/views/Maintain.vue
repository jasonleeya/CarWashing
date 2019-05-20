<template>
  <div class="maintain">
    <p class="current-car-type">当前车辆:
      <router-link to="/carmanage" tag="span"><span class="current-car">{{currentCar?currentCar:'未设置'}}</span></router-link>

    </p>
    <div class="scroll">
      <div>
        <maintain-checker-item v-show="currentCarSortId!=='111'" :sortId="currentCarSortId" @Choose="handleChoose" ></maintain-checker-item>
      </div>
    </div>
    <!--<span class="up-updata">上拉加载更多项目</span>-->
    <!--<span class="current-numb"> {{ProjectQueue!==null?'当前项目排队人数：'+ProjectQueue+'人':'请选择项目'}}</span>-->

    <maintain-choose-shop @shoopChange="handleShopChange" @showToast="showToast" class="shop-choose"></maintain-choose-shop>
    <button class="confirm-btn" @click="comfirmToPay">确认支付</button>
    <toast v-model="toast.isSHow" type="text" :time="800" is-show-mask :text="toast.text" :position="toast.top"></toast>

  </div>
</template>

<script>
  import MaintainCheckerItem from '../components/MaintainCheckerItem'
  import MaintainChooseShop from '@/components/MaintainChooseShop'
  import {Toast} from 'vux'

  export default {
    name: 'Maintain',
    components: {
      MaintainCheckerItem,
      MaintainChooseShop,
      Toast
    },
    data () {
      return {
        chooseVal: '',
        currentCar: '',
        project: '',
        carId: '',
        currentCarSortId: '111',
        toast: {
          isSHow: false,
          position: 'middle',
          text: '111'
        },
        shopId: '',
        ProjectQueue:null,
        showMore:false
      }
    },
    mounted () {
      // window.addEventListener('beforeunload', e => {
      //   sessionStorage.removeItem('pid')
      // });
      if (!this.$cookie.get('openid')) {
        window.location.href = 'http://xchcar.com/user/wx.php'
      }

      // this.mySelect('export')
      console.log('openid:', this.$cookie.get('openid'))
      // if (!this.$store.state.isLogin) {
      //   this.$router.push('/login')
      // }
      // console.log(this.$store.state.isLogin)
      // console.log(this.$store.state)
      // console.log(JSON.parse(this.$cookie.get('userInfo')))

      let thi = this
      this.mySelect('carLsit', {id: this.$store.state.currentUser.id}).then(function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].assigns === '1') {
            thi.currentCar = data[i].name + data[i].series_name
            thi.currentCarSortId = data[i].sort_id

            if (data[i].series_name.indexOf(data[i].name) === -1) {
              thi.chooseShow = data[i].name + data[i].series_name
            } else {
              thi.currentCar = data[i].series_name
            }

            thi.project = data[i].sort_id
            thi.carId = data[i].vehicle_id
          }
        }
      })

      this.mySelect('shopList', {page: 1, page_size: 100}).then(function (data) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === JSON.parse(thi.$cookie.get('choosedShop'))[0]) {
            thi.shopId = data[i].id
            console.log(data[i].id)
          }
        }

      })

    },

    methods: {
      handleShopChange () {
        let thi = this
        this.mySelect('ProjectQueue', {
          shop_id: this.$store.state.choosedShop.id,
          project_id: parseInt(this.chooseVal.projectId),
        }).then(function (data) {
          thi.ProjectQueue=data
          thi.$store.dispatch('setQueue',data)
        })
      },
      handleChoose (val) {
        this.chooseVal = val
        this.$store.dispatch('setChoosedProject',parseInt(this.chooseVal.projectId))
        // sessionStorage.setItem('pid',this.chooseVal.projectId)



        let thi = this
        this.mySelect('ProjectQueue', {
          shop_id: this.$store.state.choosedShop.id,
          project_id: parseInt(this.chooseVal.projectId),
        }).then(function (data) {
          thi.ProjectQueue=data
          thi.$store.dispatch('setQueue',data)
        })

        this.mySelectAll('shopLine',{project_id:this.chooseVal.projectId})
          .then(function (res) {

            for (let i = 0; i <res.Total; i++) {
              res.data[i].value = res.data[i].name

              res.data.push({
                name: res.data[i].line + '人排队',
                value: res.data[i].line + '',
                parent: res.data[i].name
              })

            }

            thi.$store.dispatch('setShopList',res.data)
          })
      },
      comfirmToPay () {
        if (!this.carId) {
          this.toast.isSHow = true
          this.toast.text = '请绑定车辆'
        } else if (!this.chooseVal.money) {
          this.toast.isSHow = true
          this.toast.text = '请选择套餐'

        } else {

          let thi = this
          // this.toast.isSHow = true
          // this.toast.text = this.$cookie.get('openid')

          this.mySelect('createOrder', {
            user_id: parseInt(this.$store.state.currentUser.id),
            project_id: parseInt(this.chooseVal.projectId),
            money: parseFloat(this.chooseVal.money),
            vehicle_id: parseInt(this.carId),
            shop_id: this.$store.state.choosedShop.id,
            openid: this.$cookie.get('openid'),
            head: this.$cookie.get('headimgurl'),
            // head: this.$cookie.get('headimgurl'),
            name: this.$cookie.get('nickname')
          }).then(function (qdata) {
            console.log(qdata)

            WeixinJSBridge.invoke('getBrandWCPayRequest', {
              'appId': qdata.appId,     //公众号名称
              'timeStamp': qdata.timeStamp.toString(), //时间戳，自1970年以来的秒数
              'nonceStr': qdata.nonceStr, //随机串
              'package': qdata.package,
              'signType': qdata.signType,//微信签名方式：
              'paySign': qdata.paySign //微信签名
            }, function (res) {
              if (res.err_msg === 'get_brand_wcpay_request:ok') {

                thi.toast.isSHow = true
                thi.toast.text = '支付成功'
                thi.$router.push({name: 'successMessage', params: {aid}})
              } else {
                thi.toast.isSHow = true
                thi.toast.text = '支付取消'
              }
            })

          })

        }
      },
      showToast (text) {
        this.toast.isSHow = true
        this.toast.text = text
      }
    }
  }
</script>
<style>
  .weui-cell_access .weui-cell__ft:after {
    border-color: transparent;
  }
</style>
<style scoped>
  .current-car-type {
    font-size: .16rem;
    width: 100%;
    text-align: center;
    margin-top: .15rem;
  }


  .confirm-btn {
    position: absolute;
    bottom: .15rem;
    width: 90%;
    height: .4rem;
    line-height: .4rem;
    margin-top: .5rem;
    margin-left: 50%;
    transform: translateX(-50%);
    background-color: #3D6FA7;
    border-radius: .2rem;
    color: #fff;
    font-size: .16rem;
    font-weight: bold;
  }

  .shop-choose {
    width: 88%;
    margin-left: 50%;
    transform: translateX(-50%);
    position: absolute;
    bottom: .7rem;
  }

  .current-car {
    font-weight: bold;
  }

  .scroll {
    height: 50vh;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .scroll::-webkit-scrollbar{
    display:none;
  }
  .current-numb {
    font-size: .16rem;
    display: inline-block;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 1.5rem;
  }
  .up-updata {
    font-size: .14rem;
    display: inline-block;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 1.6rem;
  }
</style>

<template>
  <div class="branch-business-volume-wrapper">
    <unit-head>
      <span slot="title">分店营业额</span>
    </unit-head>
    <div class="business-volume-content">
      <div class="choose-branch">

        <el-dropdown @command="handleCommand"  >
          <span class="el-dropdown-link">
          {{ShopChoosed}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">

            <el-dropdown-item :disabled="managerType==='2'"  v-for="item in ShopBusinessVolume" :key="item.shopId"
                              :command="{id:item.shopId,shop:item.shopName}">
              {{item.shopName}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div class="business-volume">
          {{businessVolumeShow}}
        </div>
        <div class="yuan">（元）</div>
      </div>
    </div>
    <template><span v-loading.fullscreen.lock="fullscreenLoading"></span></template>
  </div>

</template>

<script>
  import UnitHead from '@/components/UnitHead';

  export default {
    name: "IndexBranchBusinessVolume",
    components: {
      UnitHead
    },
    mounted() {
      this.getStart()

    },

    data() {
      return {
        fullscreenLoading: false,

        ShopChoosed: '',
        businessVolumeShow: '0',
        ShopBusinessVolume: [],
        managerType:JSON.parse(sessionStorage.getItem('user')).type,
        managerShopId:JSON.parse(sessionStorage.getItem('user')).shop_id,
      }
    },
    methods: {
      getStart() {
        let thi = this;
        thi.mySelect('shopList').then(function (data) {
          thi.$bus.emit('changeShop', data[0].id);
          for (var item in data) {
            thi.ShopBusinessVolume.push({
              shopId: data[item].id,
              shopName: data[item].name
            });
          }
          if (thi.managerType === '1') {
            thi.ShopChoosed = data[0].name
            thi.mySelect('shopSum', {id: data[0].id}).then(function (data) {
              thi.businessVolumeShow = data
            })
          } else {
            for (let i = 0; i < data.length; i++) {
              if (data[i].id === thi.managerShopId) {
                thi.ShopChoosed = data[i].name
              }
            }
            thi.mySelect('shopSum', {id: thi.managerShopId}).then(function (data) {
              thi.businessVolumeShow = data
            })
          }
        });


      },
      handleCommand(com) {
        if (this.managerType === '1') {
          this.$bus.emit('changeShop', com.id);
          let thi = this;
          this.mySelect('shopSum', {id: com.id}).then(function (data) {
            thi.businessVolumeShow = data;
            thi.ShopChoosed = com.shop;
          })
        }


      }
    }

  }

</script>

<style scoped>
  .branch-business-volume-wrapper {
    width: 100%;
    height: 2.18rem;
  }

  .business-volume-content {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #072847;
    border-radius: .04rem;
  }

  .el-dropdown {
    background-color: #0e3c66;
    /*width: 45%;*/
    padding: 0 30px;
    height: .31rem;
    color: #FFF;
    text-align: center;
    line-height: .31rem;
    margin: .1rem;
  }

  .business-volume {
    position: absolute;
    font-size: .5rem;
    color: #ff5733;
    font-weight: bold;
    text-align: center;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }

  .yuan {
    position: absolute;
    color: #ff5733;
    font-size: .16rem;
    right: .4rem;
    bottom: .2rem;
  }
</style>

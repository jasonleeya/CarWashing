<template>
  <div class="wrapper">
      <div class="scroll" ref="scroll">
          <div class="content">
            <car-manage-item v-for="(item,index) of carList"
                             :key="index"
                             :defaultCar="defaultCar"
                             :carId="item.carId"
                             :carErea="item.carErea"
                             :carType="item.carType"
                             :brandId="item.brand_id"
                             :brand="item.brand"
                             :seriesId="item.series_id"
                             :sortId="item.sort_id"
                             :vehicleId="item.vehicle_id"
                             :plateList="plateList"
                             :isAdd="item.isAdd"
                             :defaultState="item.assigns"
                             @refresh="handleRefresh"
                             @changeDefault="handleChangeDefault"
                             @changeErea="handleChangeErea"
            ></car-manage-item>
            <span class="car-list-empty" v-if="shouldShowEmpty">抱歉，你还没有添加车辆哦</span>

      </div>
    </div>

    <div class="wrapper">
      <div class="add-car" @click="addCar">
        新增车辆
      </div>
    </div>
  </div>

</template>

<script>
  import CarManageItem from '@/components/CarManageItem'
  import {Scroller} from 'vux'

  export default {
    name: 'CarManage',
    components: {
      CarManageItem,
      Scroller

    },
    data () {
      return {
        defaultCar: 'A88888',
        plateList: [],
        carList: [],
        shouldShowEmpty: false,
        carListTrueLength: ''
      }
    },
    mounted () {
      this.getCarList()


    },
    updated () {


      // if (this.carList.length === 1) {
      //   this.setDefault(this)
      // }

    },
    methods: {

      getCarList () {
        let thi = this
        const userId = this.$store.state.currentUser.id
        this.mySelect('carLsit', {id: userId}).then(function (data) {
          for (let i = 0; i < data.length; i++) {
            data[i].carErea = data[i].plate.substring(0, 1)
            data[i].carId = data[i].plate.substring(1)
            data[i].carType = data[i].series_name
            data[i].brand=data[i].name
            data[i].isAdd = false
            thi.plateList.push(data[i].plate)
          }
          thi.carList = data
          if (data.length === 1) {
            thi.setDefault(thi)
          }
          thi.carListTrueLength = data.length


        })
      },
      setDefault (thi) {

        this.mySubmit('defaultCar', {
          user_id: thi.$store.state.currentUser.id,
          id: thi.carList[0].vehicle_id,
          assigns: 1,
        })

      },
      handleChangeDefault (newCar) {
        this.defaultCar = newCar
      },
      handleChangeErea (cahngeCar) {
      },
      handleRefresh () {
        // this.carList = []
        this.getCarList()
      },

      addCar () {
        this.$refs.scroll.scrollTop=this.$refs.scroll.scrollHeight
        if (this.carListTrueLength===this.carList.length) {
          this.carList.push({
            carId: '',
            carErea: '',
            carType: '',
            isAdd: true
          })
        }
      }
    },
    watch: {
      carList () {
        this.shouldShowEmpty = this.carList.length === 0;
      }
    }
  }
</script>

<style scoped>


  .wrapper {
    height: 100%;
    background-color: #f8f8f5;
  }

  input {
    display: none;
  }

  .add-car {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: .5rem;
    text-align: center;
    line-height: .5rem;
    font-size: .16rem;
    font-weight: bold;
    background-color: #3D6FA7;
    color: #fff;

  }
.scroll {
  overflow-x: scroll;
  -webkit-overflow-scrolling:touch;
  height: 100%;
}
  .content {
    padding-bottom: 100px;
  }
  .car-list-empty {
    display: inline-block;
    font-size: .18rem;
    text-align: center;
    width: 100%;
    color: #c5c3c4;
    margin-left: 50%;
    margin-top: 50%;
    transform: translate(-50%,-50%);
  }
</style>

<template>
  <div>
    <group class="group" gutter="0">
      <div class="main">
        <div class="car-info">
          <div class="car-id">
            {{changeErea===''||changeId===''?'请填写车牌号':changeErea+changeId}}
          </div>
          <div class="car-type">{{changeType===''?'请选择车型':changeType}}</div>
        </div>
        <span v-if="!isShowEditItem" class="iconfont edit" @click="toggleEditItem">{{isShowEditItem===false?'&#xe640;':'OK'}}</span>
        <div class="confirm-and-cancel" v-if="isShowEditItem">
          <span @click="handleCancel" id="cancel">取消</span>
          <span @click="handleConfirm" id="confirm">确定</span>
        </div>
      </div>

      <div v-show="isShowEditItem" class="cell car-plate"  >
        <span class="star">*</span>
        <span class="title">车牌号</span>
        <span class="select-area"
              @click="showEreaDialog=true">
         <label class="select-label">
           <!--<span v-if="!changeErea">选择地区</span>-->
          <select v-model="changeErea" class="select" name="select" id="select">
            <option v-for="item in provinceShort">{{item}}</option>
          </select></label>
        </span>
        <span class="edit-car-id" @click="editId">{{changeId===''?'填写车牌号':changeId}}</span>
      </div>


      <div v-if="isShowEditItem" class="cell">
        <div slot="child" class="side-bar-wrapper">
          <span class="star" >*</span>
          <span class="car-type-title">车辆类型</span>
          <span class="car-type-choosed">{{changeType}}</span>
          <span class="iconfont car-typeright-arrow">&#xe632;</span>
          <car-manage-choose-car-type-sidebar class="side-bar"
                                              @chooseDone="handleSeriesChoosed"></car-manage-choose-car-type-sidebar>

        </div>
      </div>

      <cell class="option" v-if="!isAdd" :title="defaultState==='1'?'当前车辆':'设置为当前车辆'">
        <span class="iconfont select-default"
              slot="icon"
              :class="{
                'checked':defaultState==='1',
                'unchecked':defaultState!=='1'
              }"
              @click="selectDefault"
        >&#xe600;</span>
        <span class="iconfont delete-car"
              slot="icon"
              @click="deleteCar">&#xe601;</span>

      </cell>

    </group>

    <div>
      <confirm v-model="showConfirm"
               show-input
               title="填写车牌号，例如：A88888"
               ref="confirm"
               @on-confirm="onConfirm5"
               @on-show="onShow"
      >
      </confirm>
      <confirm v-model="showConfirm2"
               title=""
               @on-confirm="onConfirm6">
        <p style="text-align:center;">确定删除吗?</p>
      </confirm>
    </div>

    <toast v-model="toast.isSHow" type="text" :time="800" is-show-mask :text="toast.text" :position="toast.top"></toast>

  </div>
</template>

<script>
  import {Group, Cell, Confirm, Toast} from 'vux'
  import CarManageChooseCarTypeSidebar from '@/components/CarManageChooseCarTypeSidebar'
  import XButton from 'vux/src/components/x-button/index'

  export default {
    name: 'CarManageItem',
    components: {
      XButton,
      Group,
      Cell,
      Confirm,
      CarManageChooseCarTypeSidebar,
      Toast

    },
    // props: ['defaultCar', 'carErea', 'carId', 'carType'],
    props: {
      defaultCar: String,
      carErea: String,
      carId: String,
      carType: String,
      brandId: String,
      brand: String,
      seriesId: String,
      sortId: String,
      vehicleId: String,
      plateList: Array,
      isAdd: Boolean,
      defaultState: String,

    },
    data () {
      return {
        openSide: false,
        changeType: this.carType,
        changeId: this.carId,
        changeErea: this.carErea?this.carErea:'渝',
        isChecked: false,
        showConfirm: false,
        showConfirm2: false,
        isShowEditItem: false,
        provinceShort: ['渝','京', '津', '沪',  '冀', '豫', '云', '辽', '黑', '湘', '皖', '鲁', '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '粤', '青', '藏', '川', '宁', '琼',],
        seriesChooseValue: [],
        paramasCache: [],
        carName: '',
        toast: {
          isSHow: false,
          position: 'middle',
          text: '111'
        },
      }
    },
    mounted () {
      if (!this.isAdd) {
        this.seriesChooseValue.brand_id = this.brandId
        this.seriesChooseValue.series_id = this.seriesId
        this.seriesChooseValue.sort_id = this.sortId
        if (this.carType.indexOf(this.brand) === -1) {
          this.changeType = this.brand + '    ' + this.carType
        } else {
          this.changeType = this.carType
        }
      } else {
        this.isShowEditItem=true
      }

      this.paramasCache = JSON.parse(JSON.stringify({
        changeType: this.changeType,
        changeId: this.changeId,
        changeErea: this.changeErea,
        seriesChooseValue: {
          brand_id: this.brandId,
          series_id: this.seriesId,
          sort_id: this.sortId
        }
      }))

    },
    methods: {
      handleSeriesChoosed (value) {
        this.seriesChooseValue = value
        if (value.series_name.indexOf(value.brand_name) === -1) {
          this.changeType = value.brand_name + value.series_name
        } else {
          this.changeType = value.series_name
        }
      },
      handleConfirm () {
        if (this.isAdd) {
          console.log('add')
          // for (let i = 0; i < this.plateList.length; i++) {
          //   if (this.plateList[i] === this.changeErea + this.changeId) {
          //     this.toast.isSHow = true
          //     this.toast.text = '已存在此车牌号'
          //     return
          //   }
          // }
          if (!this.changeErea) {
            this.toast.isSHow = true
            this.toast.text = '请选择地区'
          }else if (!this.changeId) {
            this.toast.isSHow = true
            this.toast.text = '请输入车牌号'
          }else if (!this.seriesChooseValue.series_id) {
            this.toast.isSHow = true
            this.toast.text = '请选择车品牌和车型'
          } else {
            let thi = this
            const paramas = {
              user_id: this.$store.state.currentUser.id,
              plate: this.changeErea + this.changeId,
              brand_id: this.seriesChooseValue.brand_id,
              style_id: this.seriesChooseValue.series_id,
              sort_id: this.seriesChooseValue.sort_id,
            }
            this.mySubmit('carAdd', paramas).then(function (state) {
              if (state === 200) {
                thi.$emit('refresh')
                thi.isShowEditItem = !thi.isShowEditItem
              }
            })
          }


        } else {
          console.log('edit')
          // for (let i = 0; i < this.plateList.length; i++) {
          //   if (this.plateList[i] === this.changeErea + this.changeId
          //     && this.carErea + this.carId !== this.changeErea + this.changeId) {
          //     this.toast.isSHow = true
          //     this.toast.text = '已存在此车牌号'
          //     return
          //   }
          // }

          const pram = {
            user_id: this.$store.state.currentUser.id,
            plate: this.changeErea + this.changeId,
            brand_id: parseInt(this.seriesChooseValue.brand_id),
            style_id: parseInt(this.seriesChooseValue.series_id),
            sort_id: parseInt(this.seriesChooseValue.sort_id),
            id: parseInt(this.vehicleId)
          }
          let thi = this
          this.mySubmit('carEdit', pram).then(function (state) {
            if (state === 200) {
              thi.$emit('refresh')
              thi.isShowEditItem = !thi.isShowEditItem
            }

          })

        }
      },
      handleCancel () {
        this.isShowEditItem = !this.isShowEditItem
        this.reduceCache()
        this.$emit('refresh')
      },
      reduceCache () {
        this.changeId = this.paramasCache.changeId
        this.changeErea = this.paramasCache.changeErea
        this.changeType = this.paramasCache.changeType
        this.seriesChooseValue = this.paramasCache.seriesChooseValue
      },
      toggleEditItem () {
        if (this.isShowEditItem) {

        }
        this.isShowEditItem = !this.isShowEditItem
      },
      onShow () {
        this.$refs.confirm.setInputValue(this.changeId)
      },
      onConfirm5 (value) {
        var oldCarId = this.changeId
        if (!(/^[A-Z]{1}[A-Z0-9]{5,6}$/).test(value.toLocaleUpperCase())) {
          this.toast.isSHow = true
          this.toast.text = '输入的车牌号不正确'
          this.changeId = oldCarId
        } else {
          this.changeId = value.toLocaleUpperCase()
        }

      },
      editId () {
        this.showConfirm = true
      },
      selectDefault () {
        let thi = this
        this.mySubmit('defaultCar', {
          user_id: this.$store.state.currentUser.id,
          id: this.vehicleId,
          assigns: 1,
        })
          .then(function (state) {
            if (state === 200) {
              thi.$emit('refresh')

            }
          })

      },
      onConfirm6 () {
        let thi = this
        this.mySubmit('carDel', {id: this.vehicleId}).then(function (state) {
          if (state === 200) {
            thi.toast.isSHow = true
            thi.toast.text = '删除成功'
            thi.$emit('refresh')
          }
        })
      },
      deleteCar () {
        this.showConfirm2 = true

      }
    },
    watch: {
      defaultCar: {
        handler (newCar) {
          this.isChecked = newCar === this.changeId
        },
        deep: true,
        immediate: true,
      },
    },

  }
</script>
<style>
  .weui-mask {
    background: rgba(0, 0, 0, 0.1) !important;
  }

  .weui-dialog__btn_primary {
    color: #3D6FA7 !important;
  }

  .vux-prompt-msgbox::placeholder {
    content: '111111111';
  }
</style>

<style scoped>
  .side-bar {
    position: absolute;
  }

  .group {
    margin-bottom: .2rem;
  }

  .main {
    position: relative;
    height: .6rem;
  }

  .car-info {
    position: absolute;
    left: .2rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .car-id {
    font-size: .18rem;
    font-weight: bold;
  }

  .car-type {
    font-size: .14rem;
  }

  .cell {
    height: .4rem;
    line-height: .4rem;
    margin-left: .2rem;
  }
.car-plate {
  border-top: 1px solid #EAEAEA;
  border-bottom: 1px solid #EAEAEA;
}
.option {
  border-top: 1px solid #EAEAEA;
}
  .edit {
    color: #3D6FA7;
    position: absolute;
    right: .15rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .side-bar {
    position: absolute;
    top: 0;
  }

  .star {
    color: red;
    display: inline-block;
    line-height: .2rem;
  }

  /*.car-type-title {*/
    /*line-height: .2rem;*/
    /*height: .2rem;*/
    /*display: inline-block;*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: .3rem;*/
  /*}*/

  .car-typeright-arrow {
    position: absolute;
    right: .15rem;
  }

  .side-bar-wrapper {
    width: 100%;
    height: .2rem;
    position: relative;
  }
  .select-area {
    position: absolute;
    right: 1rem;
  }
  .edit-car-id {
    position: absolute;
    right: .15rem;
    font-weight: bold;
  }
  .select-area, .edit-car-id {
    color: #000;
    /*font-weight: bold;*/
    margin-right: .05rem;
  }

  .ico-down {
    color: #9c9c9c;
  }

  .select {
    border: none;
    outline: none;
    background-color: transparent;
    margin-top: -.04rem;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-left: 60px;
    margin-left: -60px;
    padding-right: 20px;
    margin-right: -20px;
    z-index: 100;
  }

  .select-default {
    margin-right: .05rem;
    margin-left: .05rem;
  }
  .select-label:after {
    display: inline-block;
    content: '▼';
    font-size: .14rem;
  }
  .select-label span {
    margin-right: -.1rem;
  }
  .checked {
    color: #ff8d1a;
  }

  .unchecked {
    color: #999999;
  }

  .delete-car {
    position: absolute;
    right: 0;
    margin-right: .12rem;
    color: #999999;
    font-size: .2rem;
  }

  .confirm-and-cancel {
    float: right;
    line-height: .6rem;
    margin-right: .2rem;
    font-size: .14rem;
  }

  #confirm {
    padding: .05rem;
    border-radius: .05rem;
    height: .2rem;
    width: .4rem;
    background-color: #3D6FA7;
    color: #FFF;
    margin-left: .1rem;
  }

  .car-type-choosed {
    position: absolute;
    top: 0;
    right: .3rem;
    font-weight: bold;
    margin-right: .1rem;
    font-size: .15rem;
  }
</style>

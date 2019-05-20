<template>
  <div class="wrapper">
    <div class="open-sidebar" @click="showSidebar">
    </div>

    <div class="sidebar" v-show="show" >
      <div class="click-to-close" @click="sideOut=false">
        <span class="iconfont left-arrow">&#xe632;</span>
      </div>
      <transition name="out"
                  @after-leave="show=false">
        <div class="content" v-show="sideOut">
          <span class="title">车型选择</span>
          <!--<span class="choose-show">{{chooseShow}}</span>-->
          <!--<span class="confirm-btn" @click="chooseConfirm">确定</span>-->
          <div class="search-wrapper">
              <input id="search" v-model="searchValue" type="text" placeholder="搜索品牌、型号">
              <span @click="handleSearch" class="iconfont find">&#xe64b;</span>
          </div>

          <span class="brand-title">车辆品牌</span><span class="series-title">车辆型号</span>
          <div class="scroller-wrapper">

            <scroller  ref="searchL"   class="scroller-l" @on-scroll-bottom="leftScrollBottom" :lock-x="true" height="58vh">
              <ul>
                <li @click="handleBrandClick(item.id)" v-for="item in brandList" :key="item.name">{{item.first}}  {{item.name}}</li>
              </ul>
              <load-more v-if="!onSearch&&brandList.length===0||onLeftLoading" tip="loading"></load-more>
            </scroller>

            <scroller ref="searchR" class="scroller-r" :lock-x="true" height="58vh">
              <ul>
                <li @click="handleSeriesClick(item.brand_id,item.id,item.name,item.series_name,item.sort_id)" v-for="item in seriesList" :key="item.series_name">
                  {{item.series_name}}
                </li>
              </ul>
              <load-more v-if="!onSearch&&seriesList.length===0" tip="loading"></load-more>
            </scroller>
          </div>
          <confirm v-model="confirmShow"
                   title="您确认选择吗"
                   @on-confirm="onConfirm">
            <p>{{chooseShow}}</p>
          </confirm>
        </div>

      </transition>
      <toast v-model="toast.isSHow" type="text" :time="2000" is-show-mask :text="toast.text" :position="toast.top"></toast>
    </div>
  </div>
</template>

<script>
  import {Picker, Search, Group, Cell, Scroller, LoadMore,Confirm,Toast} from 'vux'

  export default {
    name: 'CarManageChooseCarTypeSidebar',
    components: {
      LoadMore,
      Picker,
      Search,
      Group,
      Cell,
      Scroller,
      Confirm,
      Toast
    },
    data () {
      return {
        show: false,
        sideOut: false,
        results: [],
        value: 'test',
        carTypeList: [],
        brandList: [],
        seriesList: [],
        chooseSeries: '',
        searchValue: '',
        scrollTopLeft: '',
        brandPage: 1,
        onLeftLoading: false,
        onSearch:false,
        chooseValue: [],
        chooseShow: '',
        confirmShow:false,
        toast: {
          isSHow: false,
          position: 'middle',
          text: '111'
        },
      }
    },
    mounted () {
      this.refreshBrandList(this.brandPage)
      this.refreshseriesList(1)
    },

    methods: {
      getResult (val) {
        this.results = []
        if (val) {
          for (var i = 0; i < this.carTypeList.length; i++) {
            if (this.carTypeList[i].name.search(val) !== -1) {
              this.results.push({title: this.carTypeList[i].name, other: ''})
            }
          }
        }
      },
      refreshBrandList (page) {
        this.onLeftLoading = true
        let thi = this
        this.mySelect('BrandLists', {page: page, page_size: 50}).then(function (data) {
          // thi.brandList = data
          for (let i = 0; i < data.length; i++) {
            thi.brandList.push(data[i])
          }
          thi.brandPage++
          thi.onLeftLoading = false
        })
      },
      refreshseriesList (brandId) {
        let thi = this
        this.mySelect('findSeriesByBrand', {id: brandId}).then(function (data) {
          thi.$refs.searchR.reset({top:0})
          thi.seriesList = data
        })
      },
      leftScrollBottom () {
        if (!this.onSearch) {
          if (this.onLeftLoading) {

          } else {

            this.refreshBrandList(this.brandPage)
          }
        }
      },

      handleBrandClick (value) {
        this.seriesList = []
        this.refreshseriesList(value)
      },
      handleSeriesClick (brandId ,seriesId,brandName,seriesName,sortId) {
        console.log(brandId, brandName, seriesId, seriesName, sortId)
        // this.toast.isSHow = true
        // this.toast.text = '已选择'+seriesName+',请点击右上角确定'
        this.chooseValue={
          brand_id:brandId,
          brand_name:brandName,
          series_id:seriesId,
          series_name:seriesName,
          sort_id:sortId
        }
        if (seriesName.indexOf(brandName)===-1) {
          this.chooseShow = brandName  + seriesName
        } else {
          this.chooseShow = seriesName
        }
        if (this.chooseShow) {
          this.confirmShow = true
        } else {
          this.sideOut = false
        }

      },
      showSidebar () {
        this.show = true
        this.sideOut = true
      },

      chooseConfirm () {
        if (this.chooseShow) {
          this.confirmShow = true
        } else {
          this.sideOut = false
        }

      },
      onConfirm () {
        this.chooseShow=''
        this.confirmShow=false
        this.sideOut = false
        this.$emit('chooseDone',this.chooseValue)
      },
      handleSearch () {
        this.brandPage=1
        this.searchBrandAndSeries()
        this.onLeftLoading = false
        this.$refs.searchL.reset({top:0})
        this.$refs.searchR.reset({top:0})
      },
      searchBrandAndSeries () {
        let thi = this
        this.mySelect('brandFind', {name: this.searchValue}).then(function (data) {
          thi.brandList = data
        })
        this.mySelect('SeriesFind', {series_name: this.searchValue,page:1,page_size: 1000}).then(function (data) {
          thi.seriesList = data
          for (let i = 0; i < data.length;i++) {
            data[i].brand_id=data[i].id
            data[i].id=data[i].series_id
          }
        })
      }

    },
    watch: {
      searchValue () {
        if (this.searchValue === '') {
          this.onSearch = false
          this.brandList=[]
          this.refreshBrandList(this.brandPage)
          this.refreshseriesList(1)
        } else {
          this.onSearch = true
        }
      }
    }
  }

</script>
<style>
  .weui-search-bar__cancel-btn {
    font-size: .14rem;
    margin-right: .2rem;
    color: #3D6FA7 !important;
  }

  #group-left {
    height: 80% !important;
  }
</style>
<style scoped>
  .wrapper {
    width: 100%;
    z-index: 999;
  }

  .open-sidebar {
    width: 100%;
    height: 40px;
  }

  .out-enter-active {
    transition: all .3s ease;
  }

  .out-leave-active {
    transition: all .3s ease;
    transform: translateX(100%);
  }

  .out-enter, .slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  .sidebar {
    width: 100%;
    height: 100%;
    /*background-color: rgba(0, 0, 0, 0.1);*/
    position: fixed;
    top: 0;
    margin-top: .5rem;
    margin-bottom: .5rem;
    /*z-index: 999;*/
  }

  .content {
    width: 90%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    right: 0;

  }

  .click-to-close {
    width: 10%;
    height: 100%;
    position: fixed;
    left: 0;
  }

  .left-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: .5rem;
    color: #3D6FA7;
    width: 100%;
    text-align: center;
  }

  .title {
    position: absolute;
    top: -.05rem;
    left: .15rem;
    display: inline-block;
    font-size: .2rem;
    font-weight: bold;
  }

  .confirm-btn {
    display: inline-block;
    background-color: #3D6FA7;
    height: .18rem;
    font-size: .14rem;
    color: #FFF;
    padding: .05rem;
    border-radius: .03rem;
    position: absolute;
    right: .25rem;
    top: .1rem;

  }

  .picker-wrapper {
    position: absolute;
    width: 100%;
    height: 1.4rem;
    overflow: hidden;
    top: 1.2rem;
  }

  .picker {
    height: 1rem;
    width: 100%;
    position: absolute;
    top: -.5rem;
  }



  .scroller-wrapper {
    position: absolute;
    top: 1rem;
    padding:0 .2rem;
    width: 100%;
  }

  .scroller-l {
    width: 45%;
    float: left;

  }
  .scroller-l li:hover {
    background-color: #f2f2f2;
  }



  .scroller-r {
    width: 55%;
    float: right;
  }
  .search-wrapper {
    position: absolute;
    top: .3rem;
    width: 75%;
    margin: 0 .2rem;
  }
  .search-wrapper input {
    width: 100%;
    border: 2px solid #3D6FA7;
    border-radius: .05rem;
    line-height: .3rem;
    height: .3rem;
    padding-left: .1rem;
  }
  .search-wrapper input::placeholder {
    color: #a5a7a7;
    font-size: .12rem;
  }
  .find {
    position: absolute;
    color: #fff;
    right: -.121rem;
    display: inline-block;
    height: .31rem;
    width: .5rem;
    line-height: .3rem;
    top: .05rem;
    text-align: center;
    background-color: #3D6FA7;
  }
  /*.choose-show {*/
    /*display: inline-block;*/
    /*font-weight: bold;*/
    /*text-align: left;*/
    /*font-size: .14rem;*/
  /*}*/
  .brand-title {
    display: inline-block;
    margin-top: .05rem;
    margin-left: .2rem;
    font-weight: bold;
    position: absolute;
    top: .6rem;
  }

  .series-title {
    display: inline-block;
    position: absolute;
    left: 51%;
    font-weight: bold;
    top: .65rem;
  }
li {
  border-bottom: 1px solid #e8e8e8;
  height: 30px;
  line-height: 30px;
}

</style>

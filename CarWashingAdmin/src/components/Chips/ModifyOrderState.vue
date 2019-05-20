<template>
  <div class="modify-order-state">
    <unit-head>
      <span slot="title">待施工订单</span>
      <div slot="right">
        <el-input size="mini" v-model="searchInput" :placeholder="'按车牌号搜索...'" style="width: 250px">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
    {{chooseShop}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="managerType==='2'"  command="all">全部店铺</el-dropdown-item>
            <el-dropdown-item :disabled="managerType==='2'" v-for="item in shopList" :key="item.id" :command="item.id">{{item.name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </unit-head>

    <el-table
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="head"
        align="center"
        label="头像"
        width="70px">
        <template slot-scope="scope">
          <img class="user-avatar" :src=" scope.row.head" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="paytime"
        align="center"
        label="下单时间">
      </el-table-column>
      <el-table-column
        prop="plate"
        align="center"
        label="车牌">
      </el-table-column>
      <el-table-column
        prop="series_name"
        align="center"
        label="车型">
      </el-table-column>
      <el-table-column
        prop="user_name"
        align="center"
        label="昵称">
      </el-table-column>
      <el-table-column
        prop="project_name"
        align="center"
        label="项目">
      </el-table-column>
      <el-table-column
        prop="money"
        align="center"
        label="金额">
      </el-table-column>
      <el-table-column
        prop="user_name"
        align="center"
        label="昵称">
      </el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        label="手机号"
        min-width="100px">
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="WechatNumber"-->
      <!--align="center"-->
      <!--label="微信号">-->
      <!--</el-table-column>-->



      <el-table-column
        label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="changeState(scope.$index, scope.row)">确认完工
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: right"
      background
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="dataTotal">
    </el-pagination>
  </div>
</template>

<script>
  import UnitHead from '@/components/UnitHead'

  export default {
    name: "ModifyOrderState",
    components: {
      UnitHead
    },
    data() {
      return {
        searchInput: '',
        tableData: [],
        chooseShop: '',
        shopList: [],
        shopId: parseInt(JSON.parse(sessionStorage.getItem('user')).shop_id),
        currentPage: 1,
        pageSize: 10,
        dataTotal: 0,
        managerType:JSON.parse(sessionStorage.getItem('user')).type
      }
    },
    mounted() {
      this.getStart()
    },
    methods: {
      getStart() {
        if (JSON.parse(sessionStorage.getItem('user')).type === '1') {
          this.getAllOrderList(this, this.currentPage, this.pageSize);
          this.chooseShop = '全部店铺'
        } else {
          this.getOrderByShopId(this, this.shopId, this.currentPage, this.pageSize);
        }
        this.getShopList(this);
      },
      getAllOrderList(thi, page, pageSize) {
        this.mySelectAll('undoneOrderList', {
          page: page,
          page_size: pageSize,
        }).then(function (res) {
          for (let i = 0; i < res.data.length; i++) {
            if (!res.data[i].money) {
              res.data[i].money = '(无记录)'
            }
            if (!res.data[i].sort_name) {
              res.data[i].sort_name = '(未绑定)'
            }
            if (!res.data[i].plate) {
              res.data[i].plate = '(未绑定)'
            }
            if (!res.data[i].user_name) {
              res.data[i].user_name = '(未设置)'
            }
            if (!res.data[i].head) {
              res.data[i].head = require('@/assets/imgs/avatar_default.jpg');
            } else {
              res.data[i].head = global.posturl.basePicUrl + res.data[i].head
            }
            res.data[i].paytime =thi.transformTime(parseInt(res.data[i].paytime))

            // res.data[i].head =global.posturl.basePicUrl+ res.data[i].head
          }
          thi.tableData = res.data
          thi.dataTotal = res.Total
        });
      },
      getOrderByShopId(thi, shopId, page, pageSize) {
        this.mySelectAll('undoneOrderList',
          {
            shop_id: shopId,
            page: page,
            page_size: pageSize
          })
          .then(function (res) {
            for (let i = 0; i < res.data.length; i++) {
              if (!res.data[i].money) {
                res.data[i].money = '(无记录)'
              }
              if (!res.data[i].sort_name) {
                res.data[i].sort_name = '(未绑定)'
              }
              if (!res.data[i].plate) {
                res.data[i].plate = '(未绑定)'
              }
              if (!res.data[i].user_name) {
                res.data[i].user_name = '(未设置)'
              }
              if (!res.data[i].head) {
                res.data[i].head = require('@/assets/imgs/avatar_default.jpg');
              } else {
                res.data[i].head = global.posturl.basePicUrl + res.data[i].head
              }

              res.data[i].paytime =thi.transformTime(parseInt(res.data[i].paytime))

              // res.data[i].head =global.posturl.basePicUrl+ res.data[i].head
            }
            thi.tableData = res.data;
            thi.dataTotal = res.Total
          });
      },
      handleCommand(command) {
        console.log(command);
        for (let i = 0; i < this.shopList.length; i++) {
          if (this.shopList[i].id === command) {
            this.chooseShop = this.shopList[i].name
          }
        }
        if (command === 'all') {
          this.getAllOrderList(this, this.currentPage, this.pageSize)
          this.chooseShop = '全部店铺'
        } else {
          this.getOrderByShopId(this, command, this.currentPage, this.pageSize)
        }
      },
      getShopList(thi) {
        this.mySelect('shopList').then(function (data) {
          thi.shopList = data;
          for (let i = 0; i < data.length; i++) {
            if (data[i].id === JSON.parse(sessionStorage.getItem('user')).shop_id) {
              thi.chooseShop = data[i].name
            }
          }
        })
      },

      changeState(index, row) {
        this.$confirm('你确定完成' + this.tableData[index].user_name + '的订单了吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '还没有',
          type: 'warning'
        }).then(() => {
          let thi = this;
          this.mySubmit('OrderState', {id: row.order_id, state: 1}).then(function (state) {
            if (state === 200) {
              // thi.getAllOrderList(thi, thi.currentPage, thi.pageSize)
              thi.$message({
                type: 'success',
                message: '订单已完成'
              });
              if (thi.chooseShop === '全部店铺') {
                thi.getAllOrderList(thi, thi.currentPage, thi.pageSize);
              } else {
                thi.getOrderByShopId(thi, thi.shopId, thi.currentPage, thi.pageSize)
              }
            }

          });
          // this.getAllOrderList(this, this.currentPage, this.pageSize)

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '赶快完成哦'
          });
        });
      },
      handleSearch() {
        let thi = this
        this.mySelect('findOrderByPlate', {
          plate: this.searchInput,
          user_id: parseInt(JSON.parse(sessionStorage.getItem('user')).id),
          shop_id: JSON.parse(sessionStorage.getItem('user')).shop_id
        }).then(function (data) {
          for (let i = 0; i < data.length; i++) {
            if (!data[i].money) {
              data[i].money = '(无记录)'
            }
            if (!data[i].sort_name) {
              data[i].sort_name = '(未绑定)'
            }
            if (!data[i].plate) {
             data[i].plate = '(未绑定)'
            }
            if (!data[i].user_name) {
              data[i].user_name = '(未设置)'
            }
            if (!data[i].head) {
              data[i].head = require('@/assets/imgs/avatar_default.jpg');
            } else {
              data[i].head = global.posturl.basePicUrl + data[i].head
            }
            data[i].paytime =thi.transformTime(parseInt(data[i].paytime))

            // res.data[i].head =global.posturl.basePicUrl+ res.data[i].head
          }
          thi.tableData = data;
        });
      },
      handleCurrentChange() {

      },
   transformTime (time) {
    let newDate = new Date()
    newDate.setTime(time * 1000)
    return newDate.toLocaleDateString()
  },
    },
    watch: {
      searchInput() {
        if (this.searchInput === '') {
          this.getAllOrderList(this, this.currentPage, this.pageSize)
        }
      }
    }
  }
</script>
<style>
  .el-input-group__append {
    background-color: #ff5733 !important;
  }

  .el-icon-search:before {
    color: #FFF;
  }

  .el-input--mini {
    border: 1px solid #d5d5d5;
  }

  .el-input__inner::placeholder {
    color: #9c9c9c;
  }
</style>
<style scoped>
  .user-avatar {
    width: .3rem;
  }

  .el-input {
    position: absolute;
    right: 2rem;
    top: .1rem;
  }

  .el-dropdown {
    position: relative;
    right: .2rem;
    top: 0;
  }
</style>

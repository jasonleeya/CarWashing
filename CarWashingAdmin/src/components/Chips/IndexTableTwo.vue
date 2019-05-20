<template>
  <div class="index-table-two">
    <unit-head>
      <span slot="title">按客户统计消费项目金额</span>
      <el-input size="mini" slot="right" v-model="searchInput" :placeholder="searchType" style="width: 250px">
        <el-select v-model="searchType" slot="prepend" placeholder="请选择">
          <el-option label="按车型搜" value="按车型搜"></el-option>
          <el-option label="按手机号搜" value="按手机号搜"></el-option>
          <el-option label="按车辆分类搜" value="按车辆分类搜"></el-option>
        </el-select>
        <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </unit-head>


    <el-table
      :fit="true"
      border
      size="mini"
      :data="tableData"
      style="width: 100%">

      <el-table-column
        align="center"
        label="用户头像"
      >

        <template slot-scope="scope">
          <img class="user-avatar" :src=" scope.row.head" alt="">
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="用户名"
        prop="user_name">
      </el-table-column>

      <el-table-column
        align="center"
        label="手机号"
        prop="phone">
      </el-table-column>

      <el-table-column
        align="center"
        label="车牌"
        prop="plate">
      </el-table-column>

      <el-table-column
        align="center"
        label="车型"
        prop="series_name">
      </el-table-column>
      <el-table-column
        align="center"
        label="车辆分类"
        prop="sort_name">
      </el-table-column>

      <!--<el-table-column-->
        <!--align="center"-->
        <!--label="消费总额"-->
        <!--prop="money">-->
      <!--</el-table-column>-->

      <el-table-column
        label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleSeeDetails(scope.$index, scope.row)">查看详情
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-size="pagination.size"
      :current-page="pagination.current"
      layout="prev, pager, next,jumper,total"
      :total="pagination.total">
    </el-pagination>

    <el-dialog top="30%" title="消费详情" :visible.sync="showDetailDialog">
      消费总额： {{totalMoney}}元
      <br>
      <br>
      <el-table
        border
        size="mini"
        :data="consumeDetail">
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="money"
          label="消费金额（元）">
        </el-table-column>
        <el-table-column
          prop="paytime"
          label="消费时间">
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>
<script>
  import UnitHead from '@/components/UnitHead';

  export default {
    name: "IndexTableTwo",
    components: {
      UnitHead
    },
    data() {
      return {
        searchType: '按车型搜',
        searchInput: '',

        showDetailDialog: false,
        tableData: [],
        consumeDetail: [],
        onSearch: false,
        pagination: {
          size: 10,
          current: 1,
          total: 0
        },
        shopId: 1,
        totalMoney:0
      }
    },
    mounted() {
      this.getStart()
      let thi = this


      if (JSON.parse(sessionStorage.getItem('user')).type === '1') {
        this.$bus.on('changeShop', function (data) {
          thi.shopId = data;
          thi.getUserInfoList(thi.pagination.current, thi.shopId)
        })
      } else {
        thi.getUserInfoList(thi.pagination.current, JSON.parse(sessionStorage.getItem('user')).shop_id)
      }

    },

    methods: {
      getStart() {
        // this.getUserInfoList(1,this.shopId)
      },
      getUserInfoList(page, shopId) {
        let thi = this;
        const params = {
          page: page,
          page_size: this.pagination.size,
          shop_id: shopId

        };
        this.mySelectAll('brandProUserSum', params).then(function (res) {
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


          }
          thi.tableData = res.data;
          thi.pagination.total = res.Total
        })
      },
      handleSeeDetails(index, row) {
        this.totalMoney=0
        let thi = this;
        this.showDetailDialog = true;
        this.axios.post(global.posturl.host + '/admin/Sum_part/details', {
          vehicle_id: row.vehicle_id,
          shop_id: this.shopId
        })
          .then(function (res) {
            for (let i = 0; i < res.data.data.length; i++) {
              res.data.data[i].paytime = thi.transformTime(parseInt(res.data.data[i].paytime));
              thi.totalMoney+=parseFloat(res.data.data[i].money)
            }
            thi.consumeDetail = res.data.data
          });
      },
      handleSizeChange(ps) {
        if (this.onSearch === false) {
          this.pagination.size = ps;
          this.pagination.current = 1;
          this.getUserInfoList(1, this.shopId);
        } else {
          this.pagination.size = ps;
          this.pagination.current = 1;
          this.getSearchList();
        }
      },
      handleCurrentChange(cur) {
        if (this.onSearch === false) {
          this.pagination.current = cur;
          this.getUserInfoList(this.pagination.current, this.shopId);
        } else {
          this.pagination.current = cur;
          this.getSearchList()
        }
      },
      handleSearch() {
        this.getSearchList()
      },

      getSearchList() {
        let thi = this;

        if (this.searchType === '按车型搜') {
          const paramas = {
            page: this.pagination.current,
            page_size: this.pagination.size,
            series_name: this.searchInput,
            shop_id: this.shopId
          };
          this.mySelectAll('brandNameFind', paramas)
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


              }
              thi.tableData = res.data;
              thi.pagination.total = res.Total
            })
        }
        if (this.searchType === '按手机号搜') {
          const paramas = {
            page: this.pagination.current,
            page_size: this.pagination.size,
            phone: this.searchInput,
            shop_id: this.shopId
          };
          this.mySelectAll('brandPhoneFind', paramas)
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


              }
              thi.tableData = res.data;
              thi.pagination.total = res.Total
            })
        }
        if (this.searchType === '按车辆分类搜') {
          const paramas = {
            page: this.pagination.current,
            page_size: this.pagination.size,
            sort_name: this.searchInput,
            shop_id: this.shopId
          };
          this.mySelectAll('sortFind', paramas)
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


              }
              thi.tableData = res.data;
              thi.pagination.total = res.Total
            })
        }
      },
      transformTime(time) {
        let newDate = new Date()
        newDate.setTime(time * 1000)
        return newDate.toLocaleString()
      }

    }, watch: {
      searchInput() {
        if (this.searchInput === '') {
          this.onSearch = false;
          this.getUserInfoList(1, this.shopId);
        } else {
          this.onSearch = true
        }
      }
    }
  };
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

  /*  .el-input .el-input--suffix {
      background-color: #ff5733;

    }*/
</style>
<style scoped>
  .index-table-two {
    margin-top: .1rem;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .user-avatar {
    width: .3rem;
  }
</style>

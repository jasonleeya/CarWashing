<template>
  <div class="order-browse">
    <unit-head>
      <span class="" slot="title">订单浏览</span>

      <div  slot="right">
        <download-excel
          class = "export-excel-wrapper"
          :data = "exportData"
          name = "order.xls">
          <el-button type="danger" class="export" size="mini">导出表格</el-button>

        </download-excel>
        <el-input  size="mini" v-model="searchInput" :placeholder="'按车牌号搜索...'" style="width: 250px">
          <el-button type="danger" @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
    {{chooseShop}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="managerType==='2'" command="all">全部店铺</el-dropdown-item>
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

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="头像：">
              <img class="user-avatar" :src="props.row.head" alt="">
            </el-form-item>
            <el-form-item label="昵称：">
              <span>{{ props.row.user_name }}</span>
            </el-form-item>
            <el-form-item label="联系电话：">
              <span>{{ props.row.phone }}</span>
            </el-form-item>
            <el-form-item label="车型：">
              <span>{{ props.row.series_name }}</span>
            </el-form-item>
            <el-form-item label="车牌号：">
              <span>{{ props.row.plate }}</span>
            </el-form-item>
            <el-form-item label="消费项目：">
              <span>{{ props.row.project_name }}</span>
            </el-form-item>
            <el-form-item label="消费金额：">
              <span>{{ props.row.money }}</span>
            </el-form-item>

            <el-form-item label="评价等级：">
              <!--<span>{{ props.row.evaluateLevel }}</span>-->
              <el-rate
                v-model="props.row.grade"
                disabled
                show-text
                :texts="['极差', '失望', '一般', '满意', '很满意']"
                text-color="#ff9900"
                score-template="{value}">
              </el-rate>
            </el-form-item>
            <el-form-item label="评论内容：">
              <span>{{ props.row.content	 }}</span>
            </el-form-item>
            <el-form-item label="订单ID：">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="时间：">
              <span>{{ props.row.add_time }}</span>
            </el-form-item>
            <el-form-item label="状态：">
              <span>{{ props.row.state==='1'?'已完成':'未完成'}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        type="index"
        label="序号">
      </el-table-column>
      <el-table-column
        label="日期"
        prop="add_time">
      </el-table-column>
      <el-table-column
        label="车牌"
        prop="plate">
      </el-table-column>
      <el-table-column
        label="车型"
        prop="series_name">
      </el-table-column>
      <el-table-column
        label="昵称"
        prop="user_name">
      </el-table-column>
      <el-table-column
        label="联系电话"
        prop="phone">
      </el-table-column>
      <el-table-column
        label="消费项目"
        prop="project_name">
      </el-table-column>
      <el-table-column
        label="消费金额"
        prop="money">
      </el-table-column>
      <el-table-column
        label="评论"
        prop="content">
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: right"
      background
      @size-change="handleSizeChange"
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
  import downloadExcel from 'vue-json-excel'

  export default {
    name: "OrderBrowse",
    components: {
      UnitHead,
      downloadExcel
    },
    data() {
      return {
        searchInput: '',
        chooseShop: '',
        tableData: [],
        shopList: [],
        shopId: JSON.parse(sessionStorage.getItem('user')).shop_id,
        currentPage: 1,
        pageSize: 10,
        dataTotal: 0,
        managerType: JSON.parse(sessionStorage.getItem('user')).type,
        exportData:[]
      }
    },
    mounted() {
      this.getStart();
      let thi=this
      this.mySelect('export',{
        user_id:JSON.parse(sessionStorage.getItem('user')).id
      }).then(function (data) {

        for (let i = 0; i < data.length; i++) {
          thi.exportData.push(
            {
              "用户名":data[i].user_name,
              "手机号":data[i].phone,
              "车型":data[i].series_name,
              "车牌号":data[i].plate,
              "项目名称":data[i].project_name,
              "订单号":"'"+data[i].order_sn,
              "消费金额":data[i].money,
              "消费店铺":data[i].shop_name,
              "评价内容":data[i].content,
              "评分":data[i].grade,
              "状态":data[i].state,
              "交易时间":data[i].paytime,

            }
          )
        }

      })
    },
    methods: {
      handleCommand(command) {
        console.log(command);
        for (let i = 0; i < this.shopList.length; i++) {
          if (this.shopList[i].id === command) {
            this.chooseShop = this.shopList[i].name
          }
        }
        if (command === 'all') {
          this.getAllOrderList(this, this.currentPage, this.pageSize);
          this.chooseShop = '全部店铺'
        } else {
          this.getOrderByShopId(this, command, this.currentPage, this.pageSize)
        }
      },

      getStart() {
        if (JSON.parse(sessionStorage.getItem('user')).type === '1') {
          this.getAllOrderList(this, this.currentPage, this.pageSize);
          this.chooseShop = '全部店铺'
        } else {
          this.getOrderByShopId(this, this.shopId, this.currentPage, this.pageSize);
        }
        this.getShopList(this)
      },

      getAllOrderList(thi, page, pageSize) {
        this.mySelectAll('orderList', {
          page: page,
          page_size: pageSize
        }).then(function (res) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].grade = parseInt(res.data[i].grade)
            res.data[i].add_time =thi.transformTime(parseInt(res.data[i].add_time))



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
          thi.dataTotal = res.Total

        });
      },
      getOrderByShopId(thi, shopId, page, pageSize) {
        this.mySelectAll('brandOrderList', {
          shop_id: shopId,
          page: page,
          page_size: pageSize
        })
          .then(function (res) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].grade = parseInt(res.data[i].grade)
              res.data[i].add_time =thi.transformTime(parseInt(res.data[i].add_time))
            }

            thi.tableData = res.data;
            thi.dataTotal = res.Total
          });
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
      handleSizeChange(ps) {

      },
      handleCurrentChange(curr) {
        this.currentPage = curr;
        if (this.chooseShop === '全部店铺') {
          this.getAllOrderList(this, curr, this.pageSize);
        }
        // else {
        //   this.getOrderByShopId(this,)
        // }
      },

      handleSearch() {
        let thi = this
        this.mySelect('findOrder', {
          plate: this.searchInput,
          admin_id: JSON.parse(sessionStorage.getItem('user')).id,
          shop_id:JSON.parse(sessionStorage.getItem('user')).shop_id
        }).then(function (data) {
          for (let i = 0; i < data.length; i++) {
            data[i].add_time =thi.transformTime(parseInt(data[i].add_time))
          }
          thi.tableData = data;
        });
      },
      transformTime (time) {
        let newDate = new Date()
        newDate.setTime(time * 1000)
        return newDate.toLocaleDateString()
      },
      handleExport() {
        // this.axios.post(global.posturl.host+global.posturl.export,{
        //   user_id:JSON.parse(sessionStorage.getItem('user')).id
        // }).then(function (res) {
        //   // 创建a标签
        //   var elementA = document.createElement('a');
        //
        //   //文件的名称为时间戳加文件名后缀
        //   elementA.download = +new Date() + ".xsl";
        //   elementA.style.display = 'none';
        //
        //   //生成一个blob二进制数据，内容为json数据
        //   var blob = new Blob([res.data]);
        //
        //   //生成一个指向blob的URL地址，并赋值给a标签的href属性
        //   elementA.href = URL.createObjectURL(blob);
        //   document.body.appendChild(elementA);
        //   elementA.click();
        //   document.body.removeChild(elementA);
        //
        // })





      }
    }
    , watch: {
      searchInput() {
        if (this.searchInput === '') {
          this.getStart();
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


  .el-dropdown-link {
    display: inline-block;
    line-height: .28rem;
    height: .28rem;
    border: 1px solid #cacaca;
    border-radius: .04rem;
    padding: 0 .1rem;


  }
  .el-input {
    position: absolute;
    right: 2.2rem;
    top: .1rem;
  }

  .el-dropdown {
    position: relative;
    right: .2rem;
    top: 0;

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

  .el-rate {
    margin-top: .1rem;
  }
  .export {
    position: absolute;
    right: 5rem;
    top: .1rem;
  }
</style>

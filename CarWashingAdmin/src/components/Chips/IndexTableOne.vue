<template>
 <div class="index-table-one">
   <unit-head>
     <span slot="title">按服务项目统计次数金额</span>
   </unit-head>
   <el-table
     size="mini"
     :data="tableData"
     border
     :show-summary="true"
     :summary-method="computeTotal"
     style="width: 100%; margin-top: 20px">
     <el-table-column
       align="center"
       prop="projectName"
       label="项目名称"
       width="180">
     </el-table-column>
     <el-table-column
       align="center"
       prop="price"
       label="单价金额（元）">
     </el-table-column>
     <el-table-column
       align="center"
       prop="frequency"
       label="次数">
     </el-table-column>
     <el-table-column
       align="center"
       prop="totalAmount"
       label="总金额">
     </el-table-column>
   </el-table>
 </div>
</template>

<script>
  import UnitHead from '@/components/UnitHead';

  export default {
    name: "IndexTableOne",
    components: {
      UnitHead
    },
    data() {
      return {
        tableData: [],
        changeShop:''
      }

    },
    mounted() {
      this.getStart();
      let thi=this
      if (JSON.parse(sessionStorage.getItem('user')).type === '1') {
        this.$bus.on('changeShop', function (shop) {
          // thi.changeShop = shop;
          thi.getTableData(shop)
        });
      } else {
        thi.getTableData(JSON.parse(sessionStorage.getItem('user')).shop_id )
      }
    },
    methods: {
      getStart() {
       // this.getTableData(1)

      },
      computeTotal(prams) {
        const sums = [];
        const {colums, data} = prams;
        sums[0] = '总计';
        var totalMoney = null;
        var totalTimes = null;
        for (let i = 0; i < data.length; i++) {
          totalMoney += parseFloat(data[i].totalAmount);
          totalTimes+=parseInt(data[i].frequency)
        }
        sums[2] = totalTimes;
        sums[3] = parseFloat(totalMoney).toFixed(2);
        return sums;
      },
      getTableData(shopId) {
        let thi=this
        this.mySelect('brandProjectSum',{shop_id:parseInt(shopId)}).then(function (data) {
          console.log(data)
          thi.tableData=[]
          for (var item in data) {
            thi.tableData.push({
              projectName: data[item].name,
              price: data[item].money,
              frequency: data[item].number,
              totalAmount: data[item].sum_money
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
.el-table {
  margin-top: 0 !important;
  min-height: 2.2rem;
}
</style>

<template>
  <div class="my-order">

   <div class="scroll">
     <x-table :cell-bordered="false" style="background-color:#fff;">
       <thead>
       <tr>
         <th width="20%">下单时间</th>
         <th width="20%">车牌</th>
         <th width="20%">服务内容</th>
         <th width="20%">金额</th>
         <!--<th width="15%">状态</th>-->
         <th width="20%">状态</th>
       </tr>
       </thead>
       <tbody>
       <tr v-for="item in orderList" :key="item.orderId">
         <td class="time-td">{{item.paytime}}</td>
         <td class="id-td">{{item.plate}}</td>
         <td class="type-td">{{item.name}}</td>
         <td class="money-td">￥{{item.money}}</td>
         <!--<td class="state-td">{{item.state==='1'?'完成':'未完成'}}</td>-->
         <td class="comment-state-td">
           <span v-if="item.state==='2'">未完成</span>
           <span v-if="item.state==='1'">
           <router-link tag="div" :to="item.evaluate==='2'?'/comment/'+item.order_id+'/'+item.shop_id+'/'+item.vehicle_id+'/'+item.project_id:''"
                        class="commen-state"
                        :class="{'no-comment':(item.evaluate==='2')}"
           >{{item.evaluate==='2'?'评论':'已评论'}}
           </router-link></span>
         </td>
       </tr>
       </tbody>
     </x-table>
   </div>
    <div v-if="orderList.length===0" class="order-list-empty"> 还没有订单哦</div>
  </div>
</template>

<script>
  import {XTable} from 'vux'

  export default {
    name: 'MyOrder',
    components: {
      XTable
    },
    data () {
      return {
        orderList: [

        ],
      }
    },
    mounted () {


      this.getStart()
    },
    methods:{
      getStart () {
        let thi=this
        this.mySelect('orderLists',{id:this.$store.state.currentUser.id}).then(function (data) {
          for (let i = 0; i < data.length; i++) {
            data[i].paytime=thi.transformTime(parseInt(data[i].paytime))

          }
              thi.orderList=data
        })
      },
      transformTime (time) {
        let newDate = new Date()
        newDate.setTime(time * 1000)
        return newDate.toLocaleDateString()
      }
    }

  }
</script>

<style scoped>


  th {
    font-size: .16rem;
    font-weight: bold !important;
  }

  td {
    font-size: .15rem;
    line-height: .18rem;
    height: .5rem;
  }

  .id-td {
    font-weight: bold;
    padding-left: .1rem;
  }

  .money-td {
    color: #ff8d1a;
    font-weight: bold;
  }

  .time-td {
    color: #878787;
  }

  .no-comment {
    background-color: #3D6FA7;
    color: #ffffff;
    height: .2rem;
    width: .4rem;
    line-height: .2rem;
    font-size: .14rem;
    transform: translateX(-50%);
    margin-left: 50%;
    border-radius: .04rem;
    padding-top: .01rem;
  }
.order-list-empty {
  display: inline-block;
  text-align: center;
  margin-top: .2rem;
  color: #cacaca;
  font-size: .16rem;
  width: 100%;
}
  .my-order {
    overflow-x: scroll;
    -webkit-overflow-scrolling:touch;
    height: 100%;
  }
</style>

<template>
  <div class="look-over-feedback">
    <unit-head>
    <span slot="title">反馈意见
    </span>
    </unit-head>

    <el-table
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="序号"
      width="60px">
      </el-table-column>

      <el-table-column
        align="center"
        label="用户头像">
        <template slot-scope="scope">
          <img class="user-avatar" :src=" scope.row.head" alt="">
        </template>
      </el-table-column>

        <el-table-column
        align="center"
        prop="user_name"
        label="昵称">
      </el-table-column>

      <el-table-column
        align="center"
        prop="phone"
        label="联系电话">
      </el-table-column>

      <el-table-column
        align="center"
        prop="content"
        label="意见内容">
      </el-table-column>
      <el-table-column
        align="center"
        prop="add_time"
        label="时间">
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
  </div>
</template>

<script>
  import UnitHead from '@/components/UnitHead'

  export default {
    name: "LookOverFeedback",
    components: {
      UnitHead
    },
    data() {
      return {
        pagination: {},
        tableData: [
       ]
      }
    },
    mounted() {
      this.getStart()
    },
    methods:{
      getStart() {
        this.getFeedbackList(this)
      },
      getFeedbackList(thi) {
      this.mySelectAll('feedbackList',{page:this.pagination.current,page_size:this.pagination.size}).then(function (res) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].head =global.posturl.basePicUrl+ res.data[i].head
          res.data[i].add_time =thi.transformTime(parseInt(res.data[i].add_time))

        }

        thi.tableData = res.data;
        thi.pagination.total=res.Total
      })
      },
      handleSizeChange(ps) {

      },
      handleCurrentChange(cur) {
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
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}
</style>

<template>
  <div class="branch-manager">
    <unit-head>
      <span slot="title">品牌维护</span>
      <div slot="right">
        <el-input size="mini" v-model="searchInput" :placeholder="'按品牌名搜索...'" style="width: 250px">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="handleAdd" size="mini" class="add-manager" icon="el-icon-circle-plus">
          新增品牌
        </el-button>
      </div>
    </unit-head>
    <el-table
      size="mini"
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
        v-for="item in tableHead"
        align="center"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label">
      </el-table-column>


      <el-table-column
        label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: right"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataTotal">
    </el-pagination>

    <el-dialog :title="this.dialogType==='edit'?'编辑品牌名'  :'添加品牌名'" :visible.sync="dialogShow"
               width="300px">

      <el-form size="mini" label-position="right" label-width="70px">
        <el-form-item
          label="品牌名称">
          <el-input v-model="dialogData.name"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancle">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleComfirm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import UnitHead from '@/components/UnitHead'
  import {chineseToPinYin} from '@/assets/js/ChineseToPinyin'

  export default {
    name: "ServiceContentMaintain",
    components: {
      UnitHead
    },
    data() {
      return {
        currentPage: 1,
        pagesize: 10,
        dataTotal: 1,
        searchInput: '',
        dialogShow: false,
        dialogType: 'add',
        dialogData: {},
        editIndex: '',
        tableHead: [{
          prop: "name",
          label: "品牌名",
        }],
        tableData: [],
      }
    },
    mounted() {
      this.getStart()
    },
    methods: {
      getStart() {
        this.getBrandList(this)
      },
      getBrandList(thi, cur) {
        const paramas = {
          page: cur,
          page_size: thi.pagesize
        };
        this.mySelectAll('brandLists', paramas).then(function (data) {
          thi.tableData = data.data;
          thi.dataTotal = data.Total

        });
      },
      handleSizeChange(ps) {
        this.pagesize = ps;
        this.getBrandList(this, 1)
      },
      handleCurrentChange(cur) {
        this.currentPage = cur;
        this.getBrandList(this, cur)
      },

      handleEdit(index, row) {
        this.dialogType = 'edit';
        this.dialogShow = true;
        this.dialogData = JSON.parse(JSON.stringify(row));
        this.editIndex = index
      },
      handleDelete(index, row) {
        this.$confirm('你确定要删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let thi = this;
          this.mySubmit('brandDel', {id: row.id}).then(function (state) {
            if (state === 200) {
              thi.tableData.splice(index, 1);
            }
          });
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleAdd() {
        this.dialogShow = true;
        this.dialogType = 'add';
      },
      handleComfirm() {
        if (this.dialogType === 'edit') {
          if (this.dialogData.name === '') {

            this.$alert('品牌名不能为空', '', {
              confirmButtonText: '确定',
            });
          } else {
            this.dialogShow = false;
            let thi = this;
            const paramas = {
              id: this.dialogData.id,
              name: this.dialogData.name,
              first: chineseToPinYin(this.dialogData.name,).slice(0,1)?chineseToPinYin(this.dialogData.name,).slice(0,1):'Z'
            };

            this.mySubmit('brandEdit', paramas).then(function (state) {
              if (state === 200) {
                thi.tableData.splice(thi.editIndex, 1, thi.dialogData);
                thi.dialogData = {};
                thi.editIndex = ''
              }
            })

          }
        }
        if (this.dialogType === 'add') {
          if (this.dialogData.name === undefined) {

            this.$alert('品牌名不能为空', '', {
              confirmButtonText: '确定',
            });
          }  else {
            this.dialogShow = false;
            this.tableData.push(this.dialogData);
            let thi = this;
            const paramas = {
              name: this.dialogData.name,
              first: chineseToPinYin(this.dialogData.name,).slice(0,1)?chineseToPinYin(this.dialogData.name,).slice(0,1):'Z'
            };
            this.mySubmit('brandAdd', paramas).then(function (state) {
              if (state === 200) {
                thi.getBrandList(thi)
              }
            })
          }
        }

      },
      handleSearch() {
        let thi = this;
        this.mySelect('brandFind', {name: thi.searchInput})
          .then(function (data) {
            thi.tableData = data

          });
      },


      handleCancle() {
        this.dialogShow = false;

      },


    }
    ,
    watch: {
      searchInput(n, o) {
        if (this.searchInput === '') {
          this.getBrandList(this)
        }


      }
    }
  }
</script>
<style>
  .el-input-group__append {
    background-color: #ff5733;
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
  .el-input {
    margin-right: 1.2rem;
  }

  .add-manager {
    position: absolute;
    top: .1rem;
    right: 0;
    background-color: #ff5733 !important;
    color: #FFF;
    width: 1.1rem;
  }

  .el-pagination {
    margin-right: 1rem;
  }

</style>

<template>
  <div class="branch-manager">
    <unit-head>
      <span slot="title">车型维护</span>
      <div slot="right">
        <el-input size="mini" v-model="searchInput" :placeholder="'按车型搜索...'" style="width: 250px">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="handleAdd" size="mini" class="add-manager" icon="el-icon-circle-plus">
          新增车型
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

    <el-dialog :title="this.dialogType==='edit'?'编辑项目'  :'添加项目'" :visible.sync="dialogShow"
               width="300px">

      <el-form size="mini" label-position="right" label-width="70px">
        <el-form-item
          label="品牌">


          <el-select
            v-model="searchByBrandValue"
            filterable
            :clearable="true"
            :disabled="dialogType==='edit'"
            remote
            placeholder="请输入车品牌"
            :remote-method="handleSearchByBrand"
            :loading="searchByBrandLoading">
            <el-option
              v-for="(item,index) in searchByBrandOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>


        </el-form-item>
        <el-form-item
          label="车系">
          <el-input v-model="dialogData.series_name"></el-input>
        </el-form-item>
        <el-form-item
        label="选择分类">
        <select  v-model="dialogData.sort_name" >
          <option v-for="item in carClassifyList" :value="item.name">{{item.name}}</option>
        </select>
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

  export default {
    name: "CartypeMaintain",
    components: {
      UnitHead
    }, props: {
      title: String,
      searchType: String,
      tableKey: String,
    },
    data() {
      return {
        currentPage: 1,
        pagesize: 10,
        dataTotal: 1,
        searchInput: '',
        searchByBrandValue: '',
        searchByBrandLoading: false,
        searchByBrandOptions: [],
        carClassifyList: [],
        dialogShow: false,
        dialogType: 'add',
        dialogData: {},
        editIndex: '',
        onSearch: false,
        tableHead: [{
          prop: "name",
          label: "品牌",
        }, {
          prop: "series_name",
          label: "车系",
        }, {
          prop: "sort_name",
          label: "类型",
        }],
        tableData: [],
      }
    },
    mounted() {
      this.getStart()
    },
    methods: {
      getStart() {
        this.getCarTypeList(this, 1);
        this.getCarClassify()
      },
      getCarTypeList(thi, cur) {
        const paramas = {
          page: cur,
          page_size: thi.pagesize
        };
        this.mySelectAll('carTypeList', paramas).then(function (data) {
          thi.tableData = data.data;
          thi.dataTotal = data.Total

        });
      },
      getCarClassify() {
        let thi = this;
        this.mySelect('carClassify').then(function (data) {
          thi.carClassifyList = data;
        });
      },

      handleCurrentChange(cur) {
        this.currentPage = cur;
        if (this.onSearch === false) {
          this.getCarTypeList(this, cur);
        } else {
          this.getSearchList()
        }

      },
      handleSizeChange(ps) {
        this.pagesize = ps;
        if (this.onSearch === false) {
          this.getCarTypeList(this, 1);
        } else {
          this.getSearchList()
        }

        this.currentPage = 1;

      },
      handleEdit(index, row) {
        this.dialogType = 'edit';
        this.dialogShow = true;
        this.dialogData = JSON.parse(JSON.stringify(row));
        this.searchByBrandValue = this.dialogData.name;
        this.editIndex = index
      },
      handleDelete(index, row) {
        this.$confirm('你确定要删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const paramas = {
            id: row.series_id
          };
          let thi = this;
          this.mySubmit('carTypeDel', paramas).then(function (state) {
            if (state === 200) {
              thi.getCarTypeList(thi, thi.currentPage);

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
          if (this.dialogData.series_name === '') {
            this.$alert('车系不能为空', '', {
              confirmButtonText: '确定',
            });
          } else {
            this.dialogShow = false;
            let thi = this;
            for (let item in this.dialogData) {
              this.dialogData.brand_id = this.dialogData.id
            }

            for (let i = 0; i < this.carClassifyList.length; i++) {
              if (this.carClassifyList[i].name === this.dialogData.sort_name) {
                this.dialogData.sort_id=this.carClassifyList[i].id
              }
            }

            const paramas = {
              id: this.dialogData.series_id,
              series_name: this.dialogData.series_name,
              brand_id: this.dialogData.brand_id,
              sort_id: this.dialogData.sort_id,
            };

            this.mySubmit('carTypeEdit', paramas)
              .then(function (state) {
                if (state === 200) {
                  thi.getCarTypeList(thi, thi.currentPage);
                }
              });


          }
        }
        if (this.dialogType === 'add') {
          if (!this.searchByBrandValue) {
            this.$alert('请选择所属品牌', '', {
              confirmButtonText: '确定'
            });
          } else if (!this.dialogData.series_name) {
            this.$alert('请输入品牌', '', {
              confirmButtonText: '确定',
            });
          } else {
            this.dialogShow = false;
            let thi = this;

            for (let i = 0; i < this.carClassifyList.length; i++) {
              if (this.carClassifyList[i].name === this.dialogData.sort_name) {
                this.dialogData.sort_id=this.carClassifyList[i].id
              }
            }
            const paramas = {
              brand_id: this.searchByBrandValue,
              series_name: this.dialogData.series_name,
              sort_id:this.dialogData.sort_id
            };
            this.mySubmit('carTypeAdd', paramas).then(function (state) {
              if (state === 200) {
                thi.getCarTypeList(thi,1)
              }
            });
          }
        }

      },

      handleCancle() {
        this.dialogShow = false;

      },
      handleSearch() {
        this.getSearchList()
      },
      getSearchList() {
        let thi = this;
        const paramas = {
          series_name: thi.searchInput,
          page: this.currentPage,
          page_size: this.pagesize
        };
        this.mySelectAll('carTypeFind', paramas)
          .then(function (data) {
            thi.dataTotal = data.Total
            thi.tableData = data.data
          });
      },
      handleSearchByBrand(query) {
        this.searchByBrandOptions = []
        let thi = this;
        console.log(query)
        this.axios.post('http://hytwfy.top/served/public/admin/vehicle_brand/find?name=' + query)
          .then(function (res) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (Object.prototype.toString.call(res.data.data[i]) === "[object Object]") {
                thi.searchByBrandOptions.push({value: res.data.data[i].id, label: res.data.data[i].name})
              }
            }
          }).catch(function (err) {
          console.log(err)
        });
      },


    }, watch: {
      dialogShow() {
        if (this.dialogShow === false) {
          this.dialogData = {};
          this.editIndex = '';
          this.searchByBrandValue = ''
        }
      },
      searchInput(n, o) {
        if (this.searchInput === '') {
          this.onSearch = false;
          this.getCarTypeList(this, 1);
        } else {
          this.currentPage = 1;
          this.onSearch = true
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
  .el-pagination {
    margin-right: 1rem;
  }

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
</style>


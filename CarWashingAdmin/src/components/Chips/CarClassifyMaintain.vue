<template>
  <div class="branch-manager">
    <unit-head>
      <span slot="title">分类管理</span>
      <div slot="right">
        <el-button @click="handleAdd" size="mini" class="add-manager" icon="el-icon-circle-plus">
          新增分类
        </el-button>
      </div>
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
        v-for="item in tableHead"
        align="center"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label">
      </el-table-column>


      <el-table-column
        label="操作"
        align="center"
        width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleViewProject(scope.$index, scope.row)">查看项目
          </el-button>
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

    <el-dialog title="项目详情" :visible.sync="detialShow"
               width="300px">
      <el-table
        border
        :data="detailTableData">
        <el-table-column
          align="center"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="项目名">
        </el-table-column>
        <el-table-column
          align="center"
          prop="money"
          label="金额">
        </el-table-column>
      </el-table>


      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="this.dialogType==='edit'?'编辑分类'  :'添加分类'" :visible.sync="dialogShow"
               width="300px">

      <el-form size="mini" label-position="right" label-width="70px">
        <el-form-item
          label="车辆类型">
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

  export default {
    name: "CarClassifyMaintain",
    components: {
      UnitHead
    },
    data() {
      return {
        searchInput: '',
        dialogShow: false,
        detialShow: false,
        detailTableData: [],
        dialogType: 'add',
        dialogData: {},
        editIndex: '',
        tableHead: [{
          prop: "name",
          label: "车辆分类",
        }],
        tableData: [],
      }
    },
    mounted() {
      this.getStart()
    },
    methods: {
      getStart() {
        this.getProjectList(this)
      },
      getProjectList(thi) {
        this.mySelect('carClassify').then(function (data) {
          thi.tableData = data;
        });
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
          this.mySubmit('SortDel', {id: row.id}).then(function (state) {
            if (state === 200) {
              // this.tableData.splice(index, 1);
              thi.getProjectList(thi)
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
      handleViewProject(index, row) {
        this.detialShow = true;
        let thi = this;
        const paramas = {
          id: row.id
        };
        this.mySelect('ShortDetails', paramas).then(function (data) {
         thi.detailTableData=data

        })
      },
      handleAdd() {
        this.dialogShow = true;
        this.dialogType = 'add';
      },
      handleComfirm() {
        if (this.dialogType === 'edit') {
          if (this.dialogData.name === '') {

            this.$alert('分类不能为空', '', {
              confirmButtonText: '确定',
            });
          } else {
            this.dialogShow = false;
            let thi = this;
            const paramas = {
              id: this.dialogData.id,
              name: this.dialogData.name
            };

            this.mySubmit('SortEdit', paramas).then(function (state) {
              if (state === 200) {
                // thi.tableData.splice(thi.editIndex, 1, thi.dialogData);
                thi.getProjectList(thi)
              }
            })
          }
        }
        if (this.dialogType === 'add') {
          if (this.dialogData.name === undefined) {

            this.$alert('分类名不能为空', '', {
              confirmButtonText: '确定',
            });
          } else {
            this.dialogShow = false;
            let thi = this;
            this.mySubmit('SortAdd', {name: thi.dialogData.name}).then(function (state) {
              if (state === 200) {
                // thi.tableData.push(thi.dialogData);
                thi.getProjectList(thi)
              }

            });

          }
        }

      },


      handleCancle() {
        this.dialogShow = false;

      }
    }
    ,
    watch: {
      searchInput(n, o) {
        if (this.searchInput === '') {
          this.getProjectList(this)
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
</style>

<template>
  <div class="branch-manager">
    <unit-head>
      <span slot="title">服务内容维护</span>
      <div slot="right">
        <el-input size="mini" v-model="searchInput" :placeholder="'按项目名称搜索...'" style="width: 250px">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="handleAdd" size="mini" class="add-manager" icon="el-icon-circle-plus">
          新增项目
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


    <el-dialog :title="this.dialogType==='edit'?'编辑项目'  :'添加项目'" :visible.sync="dialogShow"
               width="300px">

      <el-form size="mini" label-position="right" label-width="70px">
        <el-form-item
          label="项目名称">
          <el-input v-model="dialogData.name"></el-input>
        </el-form-item>
        <el-form-item
          label="项目金额">
          <el-input v-model="dialogData.money" type="number"></el-input>
        </el-form-item>
        <el-form-item
          label="项目分类">
          <label>
            <select v-model="dialogData.type">
              <option
                v-for="item in projectType"
                :key="item.sort_id"
                :value="item.name">
                {{item.name}}
              </option>
            </select>
          </label>
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
    name: "ServiceContentMaintain",
    components: {
      UnitHead
    },
    data() {
      return {
        searchInput: '',
        dialogShow: false,
        dialogType: 'add',
        dialogData: {},
        editIndex: '',
        projectType: [],
        tableHead: [{
          prop: "name",
          label: "项目名称",
        }, {
          prop: "money",
          label: "项目金额",
        }, {
          prop: "sort_name",
          label: "分类",
        }],
        tableData: [{name: '全合成机油保养套餐', money: 299},
          {name: '全合成机油保养套餐', money: 299},
          {name: '全合成机油保养套餐', money: 299},],
      }
    },
    mounted() {
      this.getStart()
    },

    methods: {
      getStart() {
        this.getCarClassify(this);
        this.getProjectList(this);
      },
      getProjectList(thi) {
        this.mySelect('projectList').then(function (data) {
      /*    for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < thi.projectType.length; j++) {
              if (data[i].sort_id === thi.projectType[j].sort_id) {
                data[i].type = thi.projectType[j].name
              }
            }
          }*/
          thi.tableData = data;
        });
      },
      getCarClassify(thi) {
        this.mySelect('carClassify').then(function (data) {
          //
          for (let i = 0; i < data.length; i++) {
            data[i].sort_id=data[i].id
          }
          thi.projectType = data;
          thi.$forceUpdate()
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
          this.mySubmit('projectDel', {id: row.id}).then(function (state) {
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

            this.$alert('项目名不能为空', '', {
              confirmButtonText: '确定',
            });
          } else if (this.dialogData.money === '') {
            this.$alert('项目金额不能为空', '', {
              confirmButtonText: '确定',
            });
          } else {
            this.dialogShow = false;
            let thi = this;
            let getId = '';
            for (let i = 0; i < this.projectType.length; i++) {
              if (this.projectType[i].name === this.dialogData.type) {
                getId = parseInt(this.projectType[i].sort_id)
              }
            }
            const paramas = {
              id: this.dialogData.id,
              name: this.dialogData.name,
              sort_id: getId,
              money: this.dialogData.money
            };

            this.mySubmit('projectEdit', paramas).then(function (state) {
              if (state === 200) {
                thi.tableData.splice(thi.editIndex, 1, thi.dialogData);
                thi.dialogData = {};
                thi.editIndex = '';
                thi.getProjectList(thi)
              }
            })

          }
        }
        if (this.dialogType === 'add') {
          if (this.dialogData.name === undefined) {

            this.$alert('项目名不能为空', '', {
              confirmButtonText: '确定',
            });
          } else if (this.dialogData.money === undefined) {
            this.$alert('项目金额不能为空', '', {
              confirmButtonText: '确定',
            });
          } else {
            this.dialogShow = false;
            this.tableData.push(this.dialogData);
            let thi = this;
            let getId = '';
            for (let i = 0; i < this.projectType.length; i++) {
              if (this.projectType[i].name === this.dialogData.type) {
                getId = parseInt(this.projectType[i].sort_id)
              }
            }
            const paramas = {
              name: this.dialogData.name,
              money: this.dialogData.money,
              sort_id: getId
            };
            this.mySubmit('projectAdd', paramas).then(function (state) {
              if (state === 200) {
                thi.getProjectList(thi)
              }
            })
          }
        }

      },
      handleSearch() {
        let thi = this;
        this.mySelect('projectFind', {name: thi.searchInput})
          .then(function (data) {
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < thi.projectType.length; j++) {
                if (data[i].sort_id === thi.projectType[j].sort_id) {
                  data[i].type = thi.projectType[j].name
                }
              }
            }
            thi.tableData=data

          });
      },


      handleCancle() {
        this.dialogShow = false;

      }
    }
    ,
    watch: {
      searchInput(n,o) {
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

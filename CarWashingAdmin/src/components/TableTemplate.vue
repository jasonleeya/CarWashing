<template>
  <div class="branch-manager">
    <unit-head>
      <span slot="title">{{title}}</span>
      <div slot="right">
        <el-input size="mini" v-model="searchInput" :placeholder="'按'+searchType+'搜索...'" style="width: 250px">
          <el-button  slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="handleAdd" size="mini" class="add-manager" icon="el-icon-circle-plus">
          新增{{tableKey}}
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


    <el-dialog :title="this.dialogType==='edit'?'编辑'+tableKey :'添加'+tableKey" :visible.sync="addDialogShow"
               width="300px">

      <el-form size="mini" label-position="right" label-width="70px">
        <el-form-item
          v-for="item in tableHead"
          :key="item.prop"
          :label="item.label"
        >
          <el-input v-model="newItem[item.prop]" :type="item.type"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleAddCancle">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleAddComfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import UnitHead from '@/components/UnitHead'

  export default {
    name: "TableTemplate",
    components: {
      UnitHead
    }, props: {
      title: String,
      searchType: String,
      tableKey: String,
      head: Array,
      data: Array,
    },
    data() {
      return {
        searchInput: '',
        addDialogShow: false,
        dialogType: 'add',
        oprateRow: {
          oprateData: {},
          row: null
        },
        newItem: {},
        tableHead: this.head,
        tableData: this.data,
      }
    },
    methods: {
      handleEdit(index, row) {
        this.oprateRow.oprateData = JSON.parse(JSON.stringify(this.tableData[index]));
        this.oprateRow.row = index;
        this.dialogType = 'edit';
        this.addDialogShow = true;
        this.newItem = this.oprateRow.oprateData
      },
      handleDelete(index, row) {
        this.$confirm('你确定要删除此' + this.tableKey  + '吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(index, 1);
          //TODO deleteMnnager
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
        this.addDialogShow = true;

        this.dialogType = 'add';
      },
      handleAddComfirm() {
        for (let i = 0; i < this.head.length; i++) {
          if (!this.newItem[this.head[i].prop]) {
            this.$alert('请填写完整表单', '', {
              confirmButtonText: '确定',
            });
            return
          }
        }

        if (this.dialogType === 'add') {
          var copy = JSON.parse(JSON.stringify(this.newItem));
          this.addDialogShow = false;
          this.tableData.push(copy);
          this.clearNewItem()
        }
        if (this.dialogType === 'edit') {
          this.addDialogShow = false;
          this.tableData.splice(this.oprateRow.row, 1, this.oprateRow.oprateData)
        }

      },
      clearNewItem() {
        for (var item in this.newItem) {
          this.newItem[item] = '';
        }
      },

      handleAddCancle() {
        this.addDialogShow = false;
        this.clearNewItem()

      }
    },watch:{
      addDialogShow(n,o) {
        if (this.addDialogShow === false) {
          this.newItem = {};
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
  .el-input {
    margin-right: 1.2rem;
  }

  .add-manager {
    position: absolute;
    top: .1rem;
    right: 0;
    background-color: #ff5733;
    color: #FFF;
    width: 1.1rem;
  }
</style>

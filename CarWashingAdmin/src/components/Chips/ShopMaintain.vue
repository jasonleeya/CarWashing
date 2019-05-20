<!--<template>
  <table-template
    title="店铺维护"
    tableKey="店铺"
    searchType="店铺"
    :head="shopHead"
    :data="shopData">
  </table-template>
</template>

<script>
  import TableTemplate from '@/components/TableTemplate';
  export default {
        name: "ShopMaintain",
    components:{
          TableTemplate
    },
    data(){
          return{
            shopHead: [
              {
                prop: 'shopName',
                lable: '店铺名称',
                type: 'text'
              }, {
                prop: 'address',
                lable: '地址',
                type: 'text'
              }, {
                prop: 'personInCharge',
                lable: '负责人',
                type: 'text'
              }, {
                prop: 'phoneNumber',
                lable: '联系电话',
                type: 'tel'

              }
            ],
            shopData: [
              {
                shopName: '店铺一',
                address: '遥远的地方',
                personInCharge: '李某',
                phoneNumber: 18888888888
              }, {
                shopName: '店铺一',
                address: '遥远的地方',
                personInCharge: '李某',
                phoneNumber: 18888888888
              }, {
                shopName: '店铺一',
                address: '遥远的地方',
                personInCharge: '李某',
                phoneNumber: 18888888888
              }
            ]
          }
    }
    }
</script>

<style scoped>

</style>-->
<template>
  <div class="branch-manager">
    <unit-head>
      <span slot="title">店铺维护</span>
      <div slot="right">

        <el-button @click="handleAdd" size="mini" class="add-manager" icon="el-icon-circle-plus">
          新增店铺
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
          label="店铺名称">
          <el-input v-model="dialogData.name"></el-input>
        </el-form-item>
        <el-form-item
          label="地址">
          <el-input v-model="dialogData.adress"></el-input>
        </el-form-item>
        <el-form-item
          label="负责人">
          <el-input v-model="dialogData.princioal"></el-input>
        </el-form-item>
        <el-form-item
          label="联系电话">
          <el-input v-model="dialogData.tel"></el-input>
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
    name: "TableTemplate",
    components: {
      UnitHead
    }, props: {
      title: String,
      searchType: String,
      tableKey: String,
    },
    data() {
      return {
        searchInput: '',
        dialogShow: false,
        dialogType: 'add',
        dialogData: {},
        editIndex: '',
        tableHead: [
          {
            prop: 'name',
            label: '店铺名称',
          }, {
            prop: 'adress',
            label: '地址',
          }, {
            prop: 'princioal',
            label: '负责人',
          }, {
            prop: 'tel',
            label: '联系电话',
          }
        ],
        tableData: [],
      }
    },
    mounted() {
      this.getStart()
    },
    methods: {
      getStart() {
        this.getShopList(this)
      },
      getShopList(thi) {
        this.mySelect('shopList').then(function (data) {
          thi.tableData = data
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
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.mySubmit('ShopDel',{id: row.id}).then(function (state) {
            if (state === 200) {
              thi.getShopList(thi)
            }
          })
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
            this.$alert('店铺名不能为空', '', {
              confirmButtonText: '确定',
            });
          } else if (this.dialogData.adress === '') {
            this.$alert('地址不能为空', '', {
              confirmButtonText: '确定',
            });
          } else if (this.dialogData.princioal === '') {
            this.$alert('负责人不能为空', '', {
              confirmButtonText: '确定',
            });
          } else if (this.dialogData.tel === '') {
            this.$alert('电话不能为空', '', {
              confirmButtonText: '确定',
            });
          } else {
            this.dialogShow = false;
            let thi = this;
            const paramas = {
              id: this.dialogData.id,
              name: this.dialogData.name,
              adress: this.dialogData.adress,
              princioal: this.dialogData.princioal,
              tel: this.dialogData.tel
            };
            this.mySubmit('ShopEdit', paramas).then(function (state) {
              if (state === 200) {
                thi.getShopList(thi)
              }
            });
          }
        }
        if (this.dialogType === 'add') {
          if (this.dialogData.name === '') {
            this.$alert('店铺名不能为空', '', {
              confirmButtonText: '确定',
            });
          } else if (this.dialogData.adress === '') {
            this.$alert('地址不能为空', '', {
              confirmButtonText: '确定',
            });
          } else if (this.dialogData.princioal === '') {
            this.$alert('负责人不能为空', '', {
              confirmButtonText: '确定',
            });
          } else if (this.dialogData.tel === '') {
            this.$alert('电话不能为空', '', {
              confirmButtonText: '确定',
            });
          } else {
            this.dialogShow = false;
            let thi = this;
            const paramas = {
              name: this.dialogData.name,
              adress: this.dialogData.adress,
              princioal: this.dialogData.princioal,
              tel: this.dialogData.tel,
            };

            this.mySubmit('ShopAdd', paramas).then(function (state) {
              if (state === 200) {
                thi.getShopList(thi)
              }
            })
          }
        }

      },

      handleCancle() {
        this.dialogShow = false;

      }
    }, watch: {
      dialogShow() {
        if (this.dialogShow === false) {
          this.dialogData = {};
          this.editIndex = ''
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
    background-color: #ff5733 !important;
    color: #FFF;
    width: 1.1rem;
  }
</style>


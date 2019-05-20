<template>
  <div class="branch-manager">
    <unit-head>
      <span slot="title">分店管理员</span>
      <div slot="right">
        <el-input size="mini" v-model="searchInput" :placeholder="'按姓名搜索...'" style="width: 250px">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="handleAdd" size="mini" class="add-manager" icon="el-icon-circle-plus">
          新增管理员
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

    <el-dialog :title="this.dialogType==='edit'?'编辑管理员' :'添加管理员'" :visible.sync="showDialog"
               width="300px">

      <el-form size="mini" label-position="right" label-width="70px">

        <el-form-item
          key="user"
          label="账号">
          <el-input v-model="dialogData.user" type="text"></el-input>
        </el-form-item>

        <el-form-item
          key="name"
          label="姓名">
          <el-input v-model="dialogData.name" type="text"></el-input>
        </el-form-item>

        <el-form-item
          key="phone"
          label="手机号">
          <el-input v-model="dialogData.phone" type="text"></el-input>
        </el-form-item>

        <el-form-item
          label="所属店铺">
          <!--<el-input  v-model="dialogData.shop_name"  type="text"></el-input>-->
          <select  v-model="dialogData.shop_name" >
            <option v-for="item of shopList" :value="item.name">{{item.name}}</option>
          </select>
        </el-form-item>

        <el-form-item
          key="modifyPassword"
          :label="dialogType==='edit'?'修改密码':'密码'">
          <el-input v-model="password" :placeholder="dialogType==='edit'?'密码不可见,可修改':''" type="text"></el-input>
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
    name: "BranchManager",
    components: {
      UnitHead
    },
    data() {
      return {
        searchInput: '',
        dialogType: 'edit',
        showDialog: false,
        password: '',
        dialogData: {},
        editIndex: '',
        addManager: {},
        shopList: [],
        tableHead: [
          {
            prop: "user",
            label: "账号",
          }, {
            prop: "name",
            label: "姓名",
          }, {
            prop: "phone",
            label: "电话",
          }, {
            prop: "shop_name",
            label: "所属店铺",
          },
        ],
        tableData: []
      }
    },
    mounted() {
      this.getStart()
    },
    methods: {
      handleEdit(index, row) {
        this.showDialog = true;
        this.dialogType = 'edit';
        this.dialogData = JSON.parse(JSON.stringify(row));
        this.editIndex = index
      },
      handleAdd() {
        this.dialogData = {};
        this.showDialog = true;
        this.dialogType = 'add';
      },
      handleDelete(index, row) {
        let thi=this
        this.$confirm('你确定要删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            thi.mySubmit('managerDel',{id:row.id}).then(function (state) {
              if (state === 200) {
                // thi.tableData.splice(thi.editIndex, 1);
                thi.getStart()

                thi.clearEdit()
              }
            })
            thi.$message({
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
      handleComfirm() {
        if (this.dialogType === 'edit') {
          if (this.dialogData.user === '') {
            this.$alert('账号不能为空', '', {
              confirmButtonText: '确定',

            });
          }else if (this.dialogData.phone.length>11) {
            this.$alert('手机号位数需少于11', '', {
              confirmButtonText: '确定',
            });
          } else if (this.dialogData.shop_name === '') {
            this.$alert('所属店铺不能为空', '', {
              confirmButtonText: '确定',
            });
          } else {

            this.showDialog = false;

            let thi = this;
            let getId = '';
            for (let i = 0; i < this.shopList.length; i++) {
              if (this.shopList[i].name === this.dialogData.shop_name) {
                getId=this.shopList[i].id
              }
            }

            const params = {
              id: thi.dialogData.id,
              user: thi.dialogData.user,
              name: thi.dialogData.name,
              phone: thi.dialogData.phone,
              shop_id: getId,
              pwd: thi.password
            };
            this.mySubmit('managerEdit',params).then(function (state) {
              if (state === 200) {
                thi.tableData.splice(thi.editIndex, 1, thi.dialogData);
                thi.clearEdit()
              }
            })
          }
        }


        if (this.dialogType === 'add') {


          if (this.dialogData.user === undefined) {
            this.$alert('账号不能为空', '', {
              confirmButtonText: '确定',
            })
          } else if (this.dialogData.name === undefined) {
            this.$alert('姓名不能为空', '', {
              confirmButtonText: '确定',
            });
          } else if (this.dialogData.phone === undefined) {
            this.$alert('手机号不能为空', '', {
              confirmButtonText: '确定',
            });
          }else if (this.dialogData.phone.length>11) {
            this.$alert('手机号位数需少于11', '', {
              confirmButtonText: '确定',
            });
          } else if (this.dialogData.shop_name === undefined) {
            this.$alert('所属店铺不能为空', '', {
              confirmButtonText: '确定',
            });
          } else if (this.password === '') {
            this.$alert('密码不能为空', '', {
              confirmButtonText: '确定',
            });
          } else {
            this.showDialog = false;
            let thi = this;
            for (let i = 0; i < this.shopList.length; i++) {
              if (this.shopList[i].name === this.dialogData.shop_name) {
                this.dialogData.shop_id = this.shopList[i].id;
              }
            }
            const params = {
              user:thi.dialogData.user,
              name:thi.dialogData.name,
              phone:thi.dialogData.phone,
              shop_id: thi.dialogData.shop_id,
              pwd:thi.password
            };
            this.mySubmit('managerAdd',params).then(function (state) {
              if (state === 200) {
                thi.tableData.push(thi.dialogData);
                thi.clearEdit()
                  thi.getManagerList(thi)
              }
            })


          }
        }

      },
      clearEdit() {
        this.dialogData = {};
        this.editIndex = '';
        this.password = ''
      },
      handleCancle() {
        this.showDialog = false
      },
      handleSearch() {
        let thi = this;
        this.mySelect('managerFind', {name: thi.searchInput})
          .then(function (data) {
            thi.tableData=data
          });
      },

      getStart() {
        let thi = this;
        this.getManagerList(thi)
        this.mySelect('shopList').then(function (data) {
          for (let i = 0; i < data.length; i++) {
            thi.shopList.push({
              name: data[i].name,
              id:data[i].id
            })
          }
        });

      }
      ,
      getManagerList(thi) {
        const params = {};
        thi.mySelect('managerLists').then(function (data) {
          if (data) {
            thi.tableData = data
          }
        });

      }
    },
    watch: {
      searchInput(n,o) {
        if (this.searchInput === '') {
             this.getManagerList(this)
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
    background-color: #ff5733!important;
    color: #FFF;
    width: 1.1rem;
  }
</style>

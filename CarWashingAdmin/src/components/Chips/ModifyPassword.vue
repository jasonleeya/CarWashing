<template>
  <div>
    <unit-head>
      <span slot="title">修改密码</span>
    </unit-head>
    <div class="content">
      <p>旧密码</p>
      <el-input v-model="oldPassword" placeholder="请输入旧密码"></el-input>
      <p>新密码</p>
      <el-input v-model="newPassword" placeholder="请输入新密码"></el-input>
      <p>确认新密码</p>
      <el-input v-model="newPasswordConfirm" placeholder="请确认新密码"></el-input>
      <br>
      <el-button @click="loginBtn" type="danger">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
  import UnitHead from "@/components/UnitHead";

  export default {
    name: "ModifyPassword",
    components: {
      UnitHead
    },
    data() {
      return{
        oldPassword: '',
        newPassword:'',
        newPasswordConfirm:''
      }
    },
    methods:{
      loginBtn() {
        if (this.newPassword !== this.newPasswordConfirm) {
          alert('两次输入密码不同');
        } else {
          let thi = this;
          this.mySelect('modifyPwd', {
            id: JSON.parse(sessionStorage.getItem('user')).id,
            new_pwd: this.newPassword,
            pwd: this.oldPassword
          }).then(function (state) {
            if (state === 200) {
              console.log('修改密码成功')
            }

          });
        }
      }
    }
  }
</script>

<style scoped>
  .el-input {
    width: 200px;
  }

  .content {
    width: 200px;
    margin: .4rem auto;
  }

  p {
    font-size: .16rem;
    margin: .1rem 0;
  }

  .el-button {
    margin-left: 50%;
    transform: translate(-50%,.2rem);
  }
</style>

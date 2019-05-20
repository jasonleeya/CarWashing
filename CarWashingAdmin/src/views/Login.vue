<template>
  <div class="login">
    <img src="../assets/imgs/login_bg.jpg" alt="">
    <div class="login-wrapper">
      <div class="login-inner">
        <div class="title">登录账户</div>
        <input v-model="adminLogin.account" type="text" placeholder="输入账号">
        <input v-model="adminLogin.password" type="password" placeholder="输入密码">
        <div class="forget-password">
          忘记密码,联系总管理员
        </div>
        <div @click="adminLoginBtn" class="login-btn">
          登陆
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        adminLogin: {
          account: '',
          password: '',
        },
      }
    },

    methods: {
      adminLoginBtn() {
        let thi = this;
        if (!this.adminLogin.account) {
          thi.$message({
            type: 'warning',
            message:'请输入账号'
          });
        } else if (!this.adminLogin.password) {
          thi.$message({
            type: 'warning',
            message:'请输入密码'
          });
        } else {
          this.mySelectAll('adminLogin', {
            user: this.adminLogin.account,
            pwd: this.adminLogin.password
          }).then(function (res) {
            if (res.code === 200) {
              thi.$store.commit('login', res.data);
              sessionStorage.setItem('user', JSON.stringify(res.data));

              // console.log(thi.$store.state.login.user);

              thi.$router.push('/main/index');
            } else {
              thi.$message({
                type: 'warning',
                message: res.msg
              });
            }
          });

        }

      }
    }
  }
</script>


<style scoped lang="less">
  .login {
    position: fixed;
  }

  img {
    width: 100%;
  }

  .login-wrapper {
    position: absolute;
    right: 1.23rem;
    top: 1.21rem;
    width: 3.71rem;
    height: 3.39rem;
    background-color: rgba(255, 255, 255, .4);
    border-radius: .05rem;
    padding: .3rem;
    box-sizing: border-box;

    .login-inner {
      width: 100%;
      height: 100%;
      background-color: white;
      padding: .3rem;
      box-sizing: border-box;
    }

    .title {
      font-size: .3rem;
    }

    input {
      width: 2.3rem;
      height: .4rem;
      border: 1px solid #e1e1e1;
      border-radius: .05rem;
      margin-left: 50%;
      transform: translateX(-50%);
      margin-top: .2rem;
      font-size: .16rem;
      padding-left: .2rem;
    }

    .forget-password {
      font-size: .1rem;
      color: #235b88;
      float: right;
      margin-top: .1rem;
    }

    .login-btn {
      width: 2.5rem;
      height: .4rem;
      margin-left: 50%;
      transform: translateX(-50%);
      background-color: #235b88;
      font-size: .18rem;
      text-align: center;
      line-height: .4rem;
      color: #FFF;
      border-radius: .05rem;
      margin-top: .35rem;
    }
  }
</style>

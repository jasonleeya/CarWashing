<template>
  <div class="login">
    <div class="title">用户登录</div>
    <div class="input-wrapper">
      <input class="enter-phone-number"
             type="number"
             placeholder="请输入手机号"
             v-model="phoneNumber">
      <div class="countdown" v-if="countdown.isShowCountdown">{{countdown.time}}s</div>
    </div>
    <div class="input-wrapper capcha-wrapper">
      <input class="enter-captcha"
             type="number"
             placeholder="请输入验证码"
             v-model="captcha">
      <button type="button" :disabled="btnDisabled" class="get-captcha"
              @click="sendMsg"
      >获取验证码
      </button>
    </div>
    <button @click="login" class="login-btn" type="button">登录</button>
    <p class="protocol">如果你的手机号尚未注册，我们将会为你自动注册，并视为您已同意 <a href="#">《洗车公众号用户服务协议》</a>和<a href="#">《洗车公众号隐私政策》</a></p>
    <toast v-model="toast.isSHow" type="text" :time="800" is-show-mask :text="toast.text" :position="toast.top"></toast>
  </div>
</template>

<script>
  import {Toast} from 'vux'

  export default {
    name: 'Login',
    components: {
      Toast
    },
    data () {
      return {
        phoneNumber: '',
        captcha: '',
        toast: {
          isSHow: false,
          position: 'middle',
          text: '111'
        },
        btnDisabled: false,
        countdown: {
          isShowCountdown: false,
          time: 60,
          timeOut: null
        },

      }
    },
    methods: {
      sendMsg () {
        if (this.phoneNumber === '') {
          this.toast.isSHow = true
          this.toast.text = '手机号不能为空'
        } else if (!(/^1[34578]\d{9}$/.test(this.phoneNumber))) {
          this.toast.isSHow = true
          this.toast.text = '手机号格式不正确'
        } else {
          if (!this.countdown.timeOut) {
            this.countdownStart()
            this.btnDisabled = true
          }
          this.getCaptcha()
        }
      },
      getCaptcha () {
        const phone = parseInt(this.phoneNumber)
        this.mySubmit('getCaptcha', {phone: phone, pwd: phone}).then(function (state) {
          console.log(state)

        })
      },
      login () {
        if (!(/^1[34578]\d{9}$/.test(this.phoneNumber))) {
          this.toast.isSHow = true
          this.toast.text = '手机号格式不正确'
        } else if (!this.captcha) {
          this.toast.isSHow = true
          this.toast.text = '请填写验证码'
        } else {
          let thi = this
          this.mySelectAll('login', {phone: parseInt(this.phoneNumber), captcha: parseInt(this.captcha)})
            .then(function (res) {
              if (res.code === 303) {
                thi.toast.isSHow = true
                thi.toast.text = '验证码不正确'
              } else if (res.code === 200) {
                thi.$store.dispatch('setUser', res.data)
                thi.$cookie.set('userInfo', JSON.stringify(res.data), 10000)
                thi.$router.push({path: '/'})
              }
            })
        }

        /*
        *
        * headimgurl http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2Fvi_32%2FxukcObEZFg4vNtELdRbEcgosUrY6zPJE1LV7uvLicicRsjz2zgoFTT2yCCftzrS4nFFtZbqJhQNhgVpocTgtKtrw%2F0
        * nickname J-Lee
        * openid oEcd01HnmOT7pXo8MIpY_RZux6QM
        * userInfo %7B%22id%22%3A%2218%22%2C%22phone%22%3A%2218883814448%22%2C%22name%22%3Anull%2C%22adress%22%3Anull%2C%22head%22%3A%22http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2Fvi_32%2FxukcObEZFg4vNtELdRbEcgosUrY6zPJE1LV7uvLicicRsjz2zgoFTT2yCCftzrS4nFFtZbqJhQNhgVpocTgtKtrw%2F0%22%2C%22add_time%22%3A%221555038252%22%2C%22last_time%22%3A%221556438177%22%2C%22update_time%22%3A%221555908798%22%2C%22state%22%3A%221%22%7D
        * */
        /*    const data = {
              adress: null,
              head: null,
              id: '1',
              name: null,
              phone: '18883814448',
              state: '1'
            }
            this.$cookie.set('userInfo',JSON.stringify(data),1)
            this.$store.dispatch('setUser', data)*/

        /*if (this.$cookie.get('openid')) {
          this.$router.push({path: '/'})
        } else {
          window.location.href = 'http://xchcar.com/user/wx.php'
        }*/
        // this.$router.push({path: '/'})
        // window.location.href = 'http://xchcar.com/user/wx.php'

      },
      countdownStart () {
        if (this.countdown.time > 0) {
          this.countdown.time--
          this.countdown.timeOut = setTimeout(this.countdownStart, 1000)
          this.countdown.isShowCountdown = true
        } else {
          this.countdown.time = 60
          this.countdown.timeOut = null
          this.countdown.isShowCountdown = false
          this.btnDisabled = false
        }

      }
    },
    watch: {
      phoneNumber () {
        if (this.phoneNumber.length > 11) {
          this.phoneNumber = String(this.phoneNumber).slice(0, 11)
        }
      }, captcha () {

        if (this.captcha.length > 6) {
          this.captcha = String(this.captcha).slice(0, 6)
        }
      }
    }
  }
</script>

<style scoped>
  .title {
    width: 3rem;
    font-size: .16rem;
    margin: .25rem auto;
  }

  .input-wrapper {
    position: relative;
    width: 3rem;
    height: .4rem;
    margin: .1rem auto;
  }

  input {
    width: 3rem;
    height: .4rem;
    border: 1px solid #dadada;
    border-radius: .2rem;
    font-size: .14rem;
    padding-left: .2rem;
    box-sizing: border-box;
  }

  input::placeholder {
    color: #c0c3c1;
  }

  .countdown {
    position: absolute;
    right: .2rem;
    top: 0;
    font-size: .2rem;
    height: .4rem;
    line-height: .4rem;
  }

  .get-captcha {
    position: absolute;
    top: 0;
    right: .2rem;
    font-size: .16rem;
    line-height: .4rem;
    height: .4rem;
    color: #888;
    background-color: transparent;
  }

  .get-captcha:before {
    content: "";
    display: inline-block;
    width: 1px;
    height: .24rem;
    background-color: #888;
    position: absolute;
    top: .08rem;
    left: -.05rem;
  }

  .login-btn {
    width: 3rem;
    height: .4rem;
    background-color: #3D6FA7;
    margin-top: .3rem;
    border-radius: .2rem;
    color: #ffffff;
    font-size: .16rem;
    font-weight: bold;
    transform: translateX(-50%);
    margin-left: 50%;
  }

  .protocol {
    width: 3rem;
    margin: .3rem .25rem;
    transform: translateX(-50%);
    margin-left: 50%;
    font-size: .1rem;
  }
</style>

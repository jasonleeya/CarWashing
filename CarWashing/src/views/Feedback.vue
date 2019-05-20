<template>
  <div class="feedback">
    <p class="text-pl">反馈:</p>
    <div>
      <x-textarea :height=150 v-model="feedbackValue" class="text-area" :max="200"
                  placeholder="感谢您的意见反馈..."></x-textarea>
    </div>
    <div class="submit-btn" @click="submitfeedback">发送</div>
    <toast v-model="toast.isSHow" type="text" :time="800" is-show-mask :text="toast.text" :position="toast.top"></toast>

  </div>
</template>

<script>
  import {Rater, XTextarea,Toast} from 'vux'

  export default {
    name: 'Feedback',
    components: {
      XTextarea,Toast
    },
    data () {
      return {
        feedbackValue: '',
        toast: {
          isSHow: false,
          position: 'middle',
          text: '111'
        },
      }
    },
    mounted () {


    },
    methods: {
      submitfeedback () {
        let thi=this
        if (this.feedbackValue === '') {
          this.toast.isSHow = true
          this.toast.text = '请填写内容'
        } else {
          this.mySubmit('feedback', {
            user_id: this.$store.state.currentUser.id,
            content: this.feedbackValue
          }).then(function (state) {
            if (state === 200) {
              thi.toast.isSHow = true
              thi.toast.text = '提交反馈成功'
              setTimeout(function () {
                thi.$router.push('/user')
              },1500)
            }

          })

        }
      }
    }

  }
</script>
<style>
  .text-area textarea {
    font-size: .16rem;
    background-color: #e5e5e5;
  }

  .weui-textarea-counter {
    font-size: .16rem;
  }
</style>
<style scoped>
  .feedback {
    margin: .2rem;
  }

  .score {
    font-size: .14rem;
    height: .28rem;
    line-height: .28rem;

  }

  .rater {
    vertical-align: middle;
  }

  .text-area {

    background-color: #e5e5e5;
  }

  .text-pl {
    margin-top: .2rem;
    margin-bottom: .05rem;
    font-size: .16rem;
  }

  .submit-btn {
    margin-top: .3rem;
    text-align: center;
    margin-left: 50%;
    transform: translateX(-50%);
    background-color: #3D6FA7;
    width: 80%;
    height: .4rem;
    border-radius: .2rem;
    color: #FFF;
    line-height: .4rem;
    font-size: .16rem;
  }
</style>

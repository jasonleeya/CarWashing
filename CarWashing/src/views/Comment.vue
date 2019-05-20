<template>
  <div class="comment">
    <span class="score">评价星级:</span>
    <rater class="rater" v-model="raterValue"></rater>
    <p class="text-pl">评论:</p>
    <div >
      <x-textarea :height=150 v-model="commentValue" class="text-area" :max="200"  placeholder="此次服务还满意吗？说出您的评价吧"></x-textarea>
    </div>
    <div class="submit-btn" @click="submitComment">提交</div>
    <toast v-model="toast.isSHow" type="text" :time="800" is-show-mask :text="toast.text" :position="toast.top"></toast>

  </div>
</template>

<script>
  import {Rater,XTextarea,Toast} from 'vux'

  export default {
    name: 'Comment',
    components: {
      Rater,
      XTextarea,
      Toast
    },
    data () {
      return {
        raterValue: 5,
        commentValue: '',
        toast: {
          isSHow: false,
          position: 'middle',
          text: '111'
        },
      }
    },
    mounted () {


    },
    methods:{
      submitComment(){
        if (this.commentValue === '') {
          this.toast.isSHow = true
          this.toast.text = '请填写评论'
        }else {
        let thi=this
          this.mySubmit('commentAdd', {
            ...this.$route.params,
            user_id: this.$store.state.currentUser.id,
            content: this.commentValue,
            grade: this.raterValue
          }).then(function (state) {
            if (state === 200) {
              thi.toast.isSHow = true
              thi.toast.text = '评论成功'
              thi.$router.go(-1)
            }
          })


      }}
    }

  }
</script>
<style>
  .text-area textarea{
    font-size: .16rem;
    background-color: #e5e5e5;
  }
  .weui-textarea-counter {
    font-size: .16rem;
  }
</style>
<style scoped>
  .comment {
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

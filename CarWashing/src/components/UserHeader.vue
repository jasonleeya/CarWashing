<template>
  <div class="header">
    <img class="bg-img" src="@/assets/imgs/user_header_bg.png" alt="">
    <div class="avatar-wrapper">
      <!--<el-upload-->
      <!--class="avatar-uploader"-->
      <!--action="http://xchcar.com/served/index/user/picture"-->
      <!--:show-file-list="false"-->
      <!--:on-success="handleAvatarSuccess"-->
      <!--:before-upload="beforeAvatarUpload">-->
      <!--<img  :src="userInfo.avatarUrl" class="user-avatar">-->
      <!--</el-upload>-->
      <img :src="weChatInfo.weChatAvatarUrl" class="user-avatar">

    </div>


    <p class="user-name"  >{{weChatInfo.weChatName}}</p>
    <p class="user-phone-number">{{userInfo.phoneNumber}}</p>
    <confirm v-model="modifyNameConfrim"
             show-input
             ref="modifyName"
             title="修改昵称"
             @on-confirm="onModifyNameConfirm"
             @on-show="onModifyNameShow">
    </confirm>


  </div>
</template>

<script>
  import {Confirm} from 'vux'

  export default {
    name: 'UserHeader',
    components: {
      Confirm
    },
    data () {
      return {
        userInfo: {
          avatarUrl: require('@/assets/imgs/avatar_default.png'),
          userName: '点击设置昵称',
          phoneNumber: 18888888888,
        },
        weChatInfo: {},
        getPicUrl: '',
        modifyNameConfrim: false
      }
    },
    mounted () {
      this.getUserInfo()
      this.getAvatarAndNickname()
    },
    methods: {
      getAvatarAndNickname () {
        if (this.$cookie.get('headimgurl')){
          this.weChatInfo.weChatName = this.$cookie.get('nickname')
        }
        if (this.$cookie.get('nickname')) {

          this.weChatInfo.weChatAvatarUrl = this.$cookie.get('headimgurl')
        }
      },
      getUserInfo () {
        let thi = this
        this.mySelect('userInfo', {id: this.$store.state.currentUser.id}).then(function (data) {
          thi.userInfo = {
            // avatarUrl: data.head?global.posturl.picBaseUrl+data.head:thi.weChatInfo.weChatAvatarUrl,
            // userName:data.name?data.name:thi.weChatInfo.weChatName,
            phoneNumber: data.phone
          }
          thi.getPicUrl = data.head
        })
      },

      handleAvatarSuccess (res, file) {
        this.userInfo.avatarUrl = global.posturl.picBaseUrl + res.data.picture
        let pictureUrl = res.data.picture

        let thi = this
        this.mySubmit('userInfoEdit', {
          id: this.$store.state.currentUser.id,
          head: pictureUrl,
          name: this.userInfo.userName,
        }).then(function (data) {
          thi.$message.info('上传图片成功')
        })

      },
      beforeAvatarUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isLt2M
      },

      changeUserName () {
        this.modifyNameConfrim = true
      },
      onModifyNameShow () {
        this.$refs.modifyName.setInputValue(this.userInfo.userName)
      },
      onModifyNameConfirm (value) {
        let thi = this
        this.mySubmit('userInfoEdit', {
          id: this.$store.state.currentUser.id,
          head: this.getPicUrl,
          name: value,
        }).then(function (state) {
          if (state === 200) {
            console.log('昵称修改成功')
          }
        })
        console.log(value)
        this.userInfo.userName = value
      }
    }
  }
</script>

<style scoped>
  .header {
    position: relative;
  }

  .bg-img {
    width: 100%;
  }

  .user-avatar {
    width: .66rem;
    height: .66rem;
    border-radius: .33rem;
    position: absolute;
    top: .2rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .user-name {
    position: absolute;
    top: .95rem;
    left: 50%;
    transform: translateX(-50%);
    min-width: 50px;
    text-align: center;
    font-size: .18rem;
    font-weight: bold;
    color: #fff;
    height: 20px;
    display: block;
  }

  .user-phone-number {
    position: absolute;
    top: 1.2rem;
    width: 100%;
    text-align: center;
    font-size: .14rem;
    color: #fff;
  }

  input[type='file'] {
    position: absolute;
    top: .2rem;
    left: 50%;
    transform: translateX(-50%);
    display: inline-block;
    width: .66rem;
    height: .66rem;
    opacity: 0;
  }

  /*.avatar-uploader {
    position: absolute;
    top: .2rem;
    left: 50%;
    transform: translateX(-50%);
  }*/
</style>



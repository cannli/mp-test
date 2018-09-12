<template>
  <div class="container">
    <div class="userinfo" @click='login'>
      <img :src="userinfo.avatarUrl" style="width: 200rpx;height: 200rpx; margin: 50rpx;border-radius: 50%;">
      <p>{{userinfo.nickName}}</p>
      <button v-if='!userinfo.openId&&canIUse' open-type='getUserInfo' type='primary' @getuserinfo='login'>点击登录</button>
      <p v-if='!canIUse'>请升级微信版本</p>
    </div>
    <year-progress></year-progress>
    <button v-if='userinfo.openId' type="primary" class="btn" @click='scanBook'>添加图书</button>
  </div>
</template>

<script>
  import qcloud from 'wafer2-client-sdk'
  import config from '@/config'
  import {showSuccess,showModal, post} from '@/util'
  import YearProgress from '@/components/YearProgress'

  export default {
    data() {
      return {
        userinfo: {
          avatarUrl: '../../../static/img/me.png'
        },
        canIUse: wx.canIUse('button.open-type.getUserInfo')
      }
    },
    methods: {
      async addBook(isbn) {
        const res = await post('/weapp/addbook', {
          isbn,
          openid: this.userinfo.openId
        })
        showModal('添加成功', `${res.title}添加成功`)
      },
      scanBook() {
        wx.scanCode({
          success: res => {
            if (res.result) {
              console.log(res.result)
              this.addBook(res.result)
            }
          },
          fail: res => {
            console.log(res + '扫描失败~')
          }
        })
      },
      login(e) {
        console.log(e.mp.detail.userInfo)
        let user = wx.getStorageSync('userinfo')
        const self = this
        if (!user) {
          qcloud.setLoginUrl(config.loginUrl)
          qcloud.login({
            success: userInfo => {
              qcloud.request({
                url: config.userUrl,
                login: true,
                success: userRes => {
                  console.log('登陆成功', userInfo)
                  showSuccess('登录成功')
                  wx.setStorageSync('userinfo', userInfo)
                  self.userinfo = userRes.data.data
                },
                fail: () => {
                  console.log('登陆失败')
                }
              })
            }
          })
        }
      }
    },
    components: {
      YearProgress
    },
    onShow() {
      let userinfo = wx.getStorageSync('userinfo')
      if (userinfo) {
        this.userinfo = userinfo
      }
    }
  }
</script>

<style scoped>
  .container {
    padding: 0 30 rpx;
  }

  .userinfo {
    margin-top: 100 rpx;
    margin-bottom: 50 rpx;
    text-align: center;
  }

  /* img {
     width: 150 rpx;
     height: 150 rpx;
     margin: 5 rpx;
     border-radius: 50%;
   }*/

  button {
    width: 80%;
    background-color: #f00;
    color: #000;
    font-size: 14px;
  }


</style>

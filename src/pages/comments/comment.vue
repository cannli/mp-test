<template>
  <div>
    <p>个人自行</p>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        motto: 'Hello World',
        userInfo: {}
      }
    },

    components: {},

    methods: {
      getUserInfo() {
        // 调用登录接口
        wx.login({
          success: () => {
            wx.getUserInfo({
              success: res => {
                this.userInfo = res.userInfo
                console.log(this.userInfo, 'dddddd')
              }
            })
          }
        })
      },
      clickHandle(msg, ev) {
        console.log('clickHandle:', msg, ev)
      }
    },

    created() {
      // 调用应用实例的方法获取全局数据
      this.getUserInfo()
    }
  }
</script>

<style scoped>

</style>

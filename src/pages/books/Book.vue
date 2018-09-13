<template>
  <div>
    <TopSwiper :tops='tops'></TopSwiper>
    <card v-for='book in books' :key='book.id' :book='book'></card>
    <p class='text-footer' v-if='!more'>
      没有更多数据
    </p>
  </div>
</template>
<script>
  // 35条数据
  // 每次加载10条
  // 0页   0-10
  // 1     10-20
  // 2     20-30（5）
  // page 当前第几页

  // 没有更多数据
  // 1. page=0 不能显示这条提醒
  // 2. page>0 数据长度<10 停止触底加载

  import {get} from '@/util'
  import card from '@/components/card'
  import TopSwiper from '@/components/TopSwiper'

  export default {
    components: {
      card,
      TopSwiper
    },
    data() {
      return {
        books: [],
        page: 0,
        more: true,
        tops: []
      }
    },
    methods: {
      async getList(init) {
        if (init) {
          this.page = 0
          this.more = true
        }
        wx.showNavigationBarLoading()
        const books = await get('/weapp/booklist', {page: this.page})
        if (books.list.length < 10 && this.page > 0) {
          this.more = false
        }
        if (init) { // init为true时，表示第一次进来，或 下拉刷新 直接把后台数据付给books,不累加
          this.books = books.list
          wx.stopPullDownRefresh()
        } else {
          // 下拉刷新，不能直接覆盖books 而是累加
          this.books = this.books.concat(books.list)
        }
        wx.hideNavigationBarLoading()
      },
      async getTop() { // 获取图片轮播，按降序查询
        const tops = await get('/weapp/top')
        this.tops = tops.list
      }
    },
    onPullDownRefresh() {  // 下拉更新
      console.log(222)
      this.getList(true)
      this.getTop()
    },
    onReachBottom() {  // 上拉刷新
      if (!this.more) {
        // 没有更多了
        return false
      }
      this.page = this.page + 1
      this.getList()
    },
    mounted() {
      this.getList(true)
      this.getTop()
    }
  }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">
  .book-card {
    padding: 5px;
    overflow: hidden;
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 14px;

    .thumb {
      width: 90px;
      height: 90px;
      float: left;
      margin: 0 auto;
      overflow: hidden;

      .img {
        max-width: 100%;
        max-height: 100%;
      }

    }
    .detail {
      margin-left: 100px;

      .row {
        line-height: 20px;
        margin-bottom: 3px;
      }

      .right {
        float: right;

      }

      .left {
        margin-right: 80px;
      }

    }

  }

</style>

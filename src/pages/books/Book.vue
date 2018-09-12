<template>
  <div>
    <TopSwiper :tops='tops'></TopSwiper>
    <!-- <Card :key='book.id' v-for='book in books' :book='book'></Card>-->
    <a :href="detailUrl" v-for='book in books'>

      <div class="book-card">
        <div class="thumb" @click.stop="">
          <img :src="book.image"
               class="img"
               mode="aspectFit"
          />
        </div>
        <div class="detail">
          <div class="row text-primary">
            <div class="right">
              {{book.rate}}
              <Rate :value='book.rate'></Rate>
            </div>
            <div class="left">
              {{book.title}}
            </div>
          </div>
          <div class="row">
            <div class="right text-primary">
              浏览量:{{book.count}}
            </div>
            <div class="left">

              {{book.author}}
            </div>
          </div>
          <div class="row">
            <div class="right">
              {{book.user_info.nickName}}
            </div>
            <div class="left">
              {{book.publisher}}
            </div>
          </div>
        </div>
      </div>
    </a>
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
  import Card from '@/components/Card'
  import TopSwiper from '@/components/TopSwiper'

  export default {
    components: {
      Card,
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
          console.log(this.more, '55555555555')
        }
        if (init) {
          this.books = books.list
          wx.stopPullDownRefresh()
        } else {
          // 下拉刷新，不能直接覆盖books 而是累加
          this.books = this.books.concat(books.list)
        }
        console.log(this.books, 'this.books')
        wx.hideNavigationBarLoading()
      },
      async getTop() {
        const tops = await get('/weapp/top')
        this.tops = tops.list
      }
    },
    onPullDownRefresh() {
      this.getList(true)
      this.getTop()
    },
    onReachBottom() {
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
<style lang='scss'>
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

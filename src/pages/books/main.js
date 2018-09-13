import Vue from 'vue'
import App from './Book.vue'

const app = new Vue(App)
app.$mount()
export default{
  config: {
    enablePullDownRefresh: true
  }
}

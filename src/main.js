import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import '@/assets/style/reset.css'

// 引入 第三方组件 挂载函数
import use from './use/index'
// 引入 自定义组件 挂载函数
import install from './components/index'
// 引入 socket
import socket from './callServer/socket/index'
// 引入 ajax
import ajax from './callServer/ajax/index'
// 鸟图片标记
import birdList from './birdList/index'
// 原生交互的方法
import nativeApi from './native/index'
import animate from './assets/animate.css'

Vue.config.productionTip = false

use(Vue)
install(Vue)
Vue.prototype.$socket = socket
Vue.prototype.$ajax = ajax
Vue.prototype.$birdList = birdList
Vue.prototype.$nativeApi = nativeApi

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

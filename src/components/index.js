import myDrap from './my-drap'
import myOverlay from './my-overlay'
import myCollapse from './my-collapse'
import myPrompt from './my-prompt'
import myRecycle from './my-recycle'
import myLevelup from './my-levelup'

// 将 引入的 组件, 保存到数组中
let components = [
    myDrap,
    myOverlay,
    myCollapse,
    myPrompt,
    myRecycle,
    myLevelup
]

// 遍历地在组件上, 定义 install 方法
components.forEach( component => {
    component.install = function (Vue) {
        Vue.component(component.name, component)
    }
})

// 挂载 到 Vue 上
function install (Vue) {
    components.forEach( item => {
        Vue.use(item)
    })
    // 自写的函数, 挂载到 vue 原型链上
    Vue.prototype.$translateNumer = translateNumer
}

// 数字过大转换函数
function translateNumer (number) {
    number = Number(number)
    if ( number >= 100000000000 ) {
        number = `${(number / 100000000000).toFixed(2)}t`
    } else if ( number >= 1000000000 ) {
        number = `${(number / 1000000000).toFixed(2)}b`
    } else if ( number >= 1000000 ) {
        number = `${(number / 1000000).toFixed(2)}m`
    } else if (number >= 1000) {
        number = `${(number / 1000).toFixed(2)}k`
    } else {
        number = number.toFixed(2)
    }
    // console.log(number)
    return number
}

export default install

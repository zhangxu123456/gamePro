// 引入 axios
import axios from 'axios'
import config from '../config'

// 引入 api 对象
import api from './api'
/**
 * 由于 公司的后端 其代码 大多沿用 垃圾系统的老旧垃圾代码, 
 * 以至于 状态码 没有统一约定, 数据结构不明确等原因, 
 * 决定 保留 hander 层 对数据 在前端进行统一筛选处理
 */
import hander from './hander'
// 引入 提示框
import { Dialog } from 'vant'
// 引入 formData 转换 函数, cookie 处理模块
import { formData, cookie } from 'myuijs'

axios.defaults.baseURL = config.ajaxHost // 默認全局域名

/**
 * 后端 交互 模块
 *  port, 为用于 判断 何处调用 之 参数,
 *      api[port], 调用 api 对象 中, 封装 的 对应 接口
 *      detaDeal[port], 调用 对应接口 相关的 数据 处理 函数
 *  data, 为调用者 传递的 数据
 */
export default function (port, data = {}) {
    console.log('调用接口名',port)
    // 將 數據 轉換 爲 後端 可 處理的 表單格式
    let newData = formData(data)
    // cookie 存在 token ,则将 token 添加到数据中, 移动到 api 中 进行添加了
    // let token = cookie.getCookie('token') || '7786382cfa5be872206c21633d1dcb4a'
    // newData.append('token', token)

    // 接口不存在提示
    if (!api[port]) return Dialog({ message: `所传接口 "${port}" 不存在` })
    
    // 返回 promise 實例
    return new Promise( resolve => {
        // console.log(resolve)
        axios.post(api[port], newData)
        .then( res => {
            console.log(api[port])
            console.log(res)
            // 将获取的数据, 传递给 hander 函数, 进行 筛选 处理, 返回 最终处理结构
            let result = hander(port, res.data)
            resolve(result)
        })
        .catch( err => {
            console.warn(err)
            // 對 错误, 進行統一處理
            Dialog.alert({
                title: '请求出错',
                message: err
            })
        })
    })
}
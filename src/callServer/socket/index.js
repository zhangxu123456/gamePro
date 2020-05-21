import config from '../config'
import store from '@/store/index'
import { Toast } from 'vant'

class SocketListen {
    _socket = null // 用户保存 socket 对象
    _timer = null // 计时器
    _address = `ws://${config.hostname}:5050` // 连接的地址
    // 钩子函数
    _hook = {
        onGoldMsg: null, // 金币钩子
        onNoticeMsg: null, // 公告钩子
        onOfflineIncome: null, // 离线收益钩子
    }
    constructor () {
        this._connect()
    }

    // 发送消息
    send (message) {
        let jsonStr = JSON.stringify(message)
        this._socket.send(jsonStr)
    }

    // 连接
    _connect () {
        // 如果 用户id 不存在, 则每隔一秒重新连接
        if (!store.state.userInfo.id) {
            this._timer && clearInterval(this._timer)
            this._timer = setInterval(() => {
                this._connect()
            }, 1000)
            return false
        } else {
            this._timer && clearInterval(this._timer)
        }
        let socket = new WebSocket(this._address)
        // 链接成功
        socket.onopen = () => {
            console.log('握手成功' + this._address)
            Toast.clear()
            // 发送 id 以 登录
            let loginMsg = JSON.stringify({
                id: store.state.userInfo.id,
                type: 'login'
            })
            socket.send( loginMsg )
        }

        // 接受消息
        socket.onmessage = (evt) => {
            let message = JSON.parse(evt.data)
            this._onMessage(message)
        }

        // 定时重连
        socket.onclose = () => {
            console.log('连接关闭，定时重连')
            Toast.loading({
                message: '网络中断...',
                forbidClick: true,
                duration: 0
            })
            this._connect()
        }

        // 出现错误, 打印日志
        socket.onerror = function () {
            console.log('出现错误')
        }
        // 将 socket 对象, 保存到 私有变量中
        this._socket = socket
    }

    // 接受消息
    _onMessage (message) {
        switch (message.type) {
            case 'ping':
                this._heartbeat()
                break
            case 1:
                // console.log(message)
                this._hook.onGoldMsg && this._hook.onGoldMsg(message)
                break
            case 2:
                this._hook.onNoticeMsg && this._hook.onNoticeMsg(message)
                break
            case 3:
                this._hook.onOfflineIncome && this._hook.onOfflineIncome(message)
                break
            default:
                break
        }
    }

    // 心跳
    _heartbeat () {
        this._socket.send( JSON.stringify({ type: 'pong' }) )
    }

    // 获取消息监听
    listen (listener) {
        this._hook = {
            ...listener
        }
    }
}

export default new SocketListen()
/**
 * 封裝原生 api 方法, 供外部模塊/組件調用
 *   为防止原生误调用, 此处统一使用 _ 作为方法/变量名的 前缀
 */
import { Dialog } from 'vant'
import store from '@/store/index'

class Native {
    // 監聽原生調用 callNative 的 鈎子函數
    _hooks = {
        adWatched: null
    }

    /**
     * 觀看视频廣告
     * @param {*} callback, 外部需要在原生執行完操作之後 進行操作 的回調
     */
    _watchAD (callback) {
        // 將 
        this._hooks.adWatched = callback
        window.android && window.android.showVideoAd()
        // // 調用原生提供的 api 方法
        window.webkit && window.webkit.messageHandlers.showVideoAd.postMessage('')
    }

    /**
     * 分享
     * @param {*} data, 传递给原生的数据 
     */
    _share (data) {
        // 调用原生的方法, 进行操作
        // console.log(data)
        window.android && window.android.shareAction( JSON.stringify(data) )
        window.webkit && window.webkit.messageHandlers.shareAction.postMessage( data )
    }
    
    /**
     * 底部廣告
     */
    _bottomAD () {
        window.android && window.android.showBannerAd()
        window.webkit && window.webkit.messageHandlers.showBannerAd.postMessage('')
    }

    /**
     * 分红页面
     */
    _goBonus () {
        window.android && window.android.goBonus()
        window.webkit && window.webkit.messageHandlers.goBonus.postMessage('')
    }

    /**
     * 展示红包
     */
    _redEnvelope (data) {
        let { max, logid } = data
        let json = {
            lq_red_max: max,
            logid
        }
        // console.log(json)
        window.android && window.android.showRed( JSON.stringify(json) )
        window.webkit && window.webkit.messageHandlers.showRed.postMessage(json)
    }

    /**
     * 关闭底部广告
     */
    _closeBannerAd () {
        window.android && window.android.closeBannerAd()
        window.webkit && window.webkit.messageHandlers.closeBannerAd.postMessage('')
    }

    /**
     * 刷新
     */
    // reloadView () {
    //     // window.android && window.android.reloadView()
    //     // window.webkit && window.webkit.messageHandlers.reloadView.postMessage('')
    // }

    /**
     * 怎么玩页面
     */
    goUrl (title, url) {
        // console.log(url)
        window.android && window.android.goUrl(title, url)
        window.webkit && window.webkit.messageHandlers.goUrl.postMessage({
            title,
            url
        })
    }
}

/**
 * 此處封裝供原生調用的方法
 */
class CallNative extends Native {
    // 广告观看結束, 
    adWatched (arg) {
        try {
            // 如果定义了钩子函数, 则调用执行
            this._hooks.adWatched && this._hooks.adWatched()
            // 更新 vuex 中的 视频观看次数数据
            let amount = store.state.userInfo.videoAmount - 1
            if (amount < 0) return false // 次数达到0, 不需再更新数据
            store.commit('updateUserInfo', {
                videoAmount: amount
            })
        } catch (err) {
            Dialog.alert({
                message: err
            })
        }
    }
    // 底部广告弹出后原生调用, 暂时用不着
    // bottomADed (arg) {
    //     // cookie.setCookie('token', arg)
    //     // Dialog.alert({
    //     //     message: cookie.getCookie('token')
    //     // })
    // }
}

// 實例化, 並保存到全局變量, 供 原生調用
const nativeApi = new CallNative()
window.callNative = nativeApi

export default nativeApi
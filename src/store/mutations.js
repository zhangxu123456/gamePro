/* */
let timer = null // 计时器
export default {
    // 更新用户信息
    updateUserInfo (state, info) {
        Object.entries(info).forEach( item => {
            state.userInfo[item[0]] = item[1]
            // console.log( state.userInfo )
        })
        // 老的处理方式, 2020年1月7日 11:10:17
        // state.userInfo = {
        //     ...state.userInfo,
        //     ...info
        // }
    },
    // 更新鸟列表
    updateBirdList (state, message) {
        let { index, info } = message
        let { id, mark, income, level, receive } = info
        state.birdList[index].id = id
        state.birdList[index].mark = mark
        state.birdList[index].income = income
        state.birdList[index].level = level
        state.birdList[index].receive = receive
    },
    // 初始化鸟列表, 将后端存储的数据, 整个替换为内存的数据
    initBirdList (state, list) {
        state.birdList = list
    },
    // 更新商店商品数据
    updateShopData (state, list) {
        state.shopData = list
    },
    // 初始化 specialBirdNames
    initSpecialBirdNames (state, data) {
        state.specialBirdNames = {
            ...data
        }
    },
    // 在线奖励 倒计时
    countdownTime (state) {
        let { userInfo } = state
        userInfo.timeOfCountdown -= userInfo.onlineTime
        timer = setInterval(() => {
            userInfo.timeOfCountdown -= 1
            if ( userInfo.timeOfCountdown <= 0 ) {
                userInfo.timeOfCountdown = 0
                clearInterval(timer)
            }
        }, 1000)
    },
    // 重置 在线奖励倒计时
    resetCountdownTime (state, data) {
        // console.log(data)
        // 清除计时器
        timer && clearInterval(timer)
        let { userInfo } = state
        let { onlineTime } = data
        userInfo.onlineTime = onlineTime
        userInfo.timeOfCountdown = 3600
        userInfo.timeOfCountdown -= userInfo.onlineTime
        timer = setInterval(() => {
            userInfo.timeOfCountdown -= 1
            if ( userInfo.timeOfCountdown <= 0 ) {
                userInfo.timeOfCountdown = 0
                clearInterval(timer)
            }
        }, 1000)
    },
    // 设置 图鉴数据
    setPictorialBook (state, list) {
        state.pictorialBook = list
    },
    setGoldShort(state,prop){
        state.isGoldShort = prop
    }
}
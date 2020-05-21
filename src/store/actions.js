// 引入 ajax 处理模块
import ajax from '@/callServer/ajax/index'

export default {
    setGoldShort({commit},prop){
        commit('setGoldShort',prop)
    },
    // 获取商店数据, 并更新
    async getShopData ({ commit }) {
        let res = await ajax('shop')
        if (!res) return false
        // console.log(res)
        commit('updateShopData', res)
    },
    // 购买商品
    async toBugGoods ({ commit, state }, args) {
        let { level, type, item } = args
        let res = await ajax('buyGoods', {
            game_level: level,
            type,
        })
        // console.log(res)
        if (!res) return false
        // 购买成功, 减去用户账户上的金币, 并更新 vuex
        commit('updateUserInfo', {
            gold: Number(state.userInfo.gold) - Number(item.price)
        })
        // 遍历获取空位置的索引
        let indexEmpty = -1
        state.birdList.some( (item, index) => {
            if (!item.id) {
                indexEmpty = index
                return true
            }
        })
        // 如果 indexEmpty 为 -1 则说明位置已满
        if ( indexEmpty === -1 ) return console.log('位置已满')
        // 提取 返回的 数据
        // console.log(res)
        let { id, level: resLevel, typeName, income, price, receive } = res
        let mark = resLevel > 37 ? typeName : resLevel
        // 更新 最新的 价格
        item.price = price
        // 更新 vuex 上的 数据
        commit('updateBirdList', {
            index: indexEmpty,
            info: {
                id,
                mark,
                income,
                level: resLevel,
                receive,
            }
        })
        // 更新 后端数据库中 保存的 数据
        await ajax('birdsGroup', {
            type: 1,
            weizhi: JSON.stringify(state.birdList)
        })
        // 返回 true
        return true
    },
    // 获取特殊鸟图鉴
    async getPictorialBook ({ commit }) {
        let res = await ajax('pictorialBook')
        if (!res) return false
        // console.log(res)
        // 提取数组中的 mark 和 name 作为 键值, 保存到 对象中
        let data = {}
        res.forEach( item => {
            let { mark, name } = item
            data[mark] = name
        })
        commit('initSpecialBirdNames', data)
        commit('setPictorialBook', res)
        // return res
    },
    // 神鸟合成
    async birdMixing ({ commit, state }, args) {
        let { drapedId, collisionedId, drapedIndex, collisionedIndex } = args
        // console.log(args)
        let res = await ajax('mixing', {
            game_id1: drapedId,
            game_id2: collisionedId
        })
        if (!res) return false
        // console.log(res)
        // 提取信息
        let { bird, red } = res
        let { id, level, typeName, income, levelName, receive } = bird
        let mark = level > 37 ? typeName : level
        // 更新 vuex 上的 数据, 将拖拽位置的数据清空
        commit('updateBirdList', {
            index: drapedIndex,
            info: {
                id: null,
                mark: null,
                income: 0,
                level: -1,
                receive: 0
            }
        })
        // 更新 vuex 上的 数据, 将碰撞位置的数据更新为合成后的数据
        commit('updateBirdList', {
            index: collisionedIndex,
            info: {
                id,
                mark,
                income,
                level,
                receive,
            }
        })
        // 更新后端数据库中, 保存的 位置信息
        ajax('birdsGroup', {
            type: 1,
            weizhi: JSON.stringify(state.birdList)
        })
        return {
            level,
            levelName,
            red,
            mark
        }
    }
}

// 引入 提示框
import { Dialog, Toast } from 'vant'
import store from "@/store"

// token 过期, 返回 app 返回 app
function reBackApp () {
    window.webkit && window.webkit.messageHandlers.goLogin.postMessage('')
    return false
}

// 错误提示
function prompt (message) {
    Dialog.alert({
        title: '提示',
        message
    })
    return false
}

const hander = {
    shop (data) {
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if ( Number(status) !== 1) return prompt(result.message)
        // 提取垃圾数据中有用的数据
        let list = result.list.map( item => {
            let {
                status,
                zx_money: price,
                status_1: status1,
                level,
                goodsname:
                goodsName
            } = item
            return {
                canBuyWithGold: Number(status) === 1, // 可否通过金币购买, 1 为可购买, 0 为不可购买
                price,
                canBuyWithEgg: !!status1, // 可否通过彩蛋币购买, undefined/null/0, 则不可购买
                level,
                goodsName
            }
        })
        return list
    },
    buyGoods (data) {
        let msg = 'jb'
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if ( Number(status) === 4 ) {
            Toast(result.message)
          // console.log(result.message)
            if (result.message === '位置已满!') {
            return false
            } else {
            return msg
            }
        }
        if ( Number(status) !== 1){
            store.dispatch("setGoldShort",true)
            return false
        }
        // 提取有用的信息
        let { goodsType, id, goodslevel, income, receive } = result.list
        return {
            level: Number(goodslevel),
            id,
            typeName: goodsType,
            income: Number(income),
            price: Number(result.zx_moeny),
            receive: Number(receive)
        }
    },
    turntableList (data) {
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if ( Number(status) !== 1) return prompt(result.message)
        // 奖品图片与后端参数的映射
        let markPrizeImg = {
            '0': 'prize_gold.png', // 金币
            '1': 'prize_egg.png', // 彩蛋币
            '2': 'prize_red_packet.png', // 现金
            '3': 'prize_ticket.png' // 转盘券
        }
        // let markPrizeImg = {
        //     'jinbi': 'prize_gold.png',
        //     'xianjin': 'prize_red packet.png',
        //     'caidan': 'prize_egg.png',
        //     'dzp': 'prize_ticket.png'
        // }
        // 提取有用的数据
        let list = result.dzplist.map( item => {
            let { goodsname: name, id, status: mapMark } = item
            return {
                name,
                img: markPrizeImg[mapMark],
                id,
                mapMark
            }
        })
        return list
    },
    toTurn (data) {
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if ( Number(status) !== 1) return prompt(result.message)
        let { id, status: type, money } = result.dzplist
        return {
            id,
            type, // 奖品类型, 0: 金币, 1 彩蛋币, 2 现金, 3转盘券
            amount: Number(money), // 奖品数量
        }
    },
    userInfo (data) {
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if ( Number(status) !== 1) return prompt(result.message)
        let { member, game, set, money: dividend, zx_miao: onlineTime } = result
        // 提取并返回有用信息
        let list = game.map( item => {
            let { goodslevel, id, goodsType, income, receive } = item
            return {
                level: Number(goodslevel),
                id,
                typeName: goodsType,
                income: Number(income),
                receive: Number(receive)
            }
        })
        let { id, jinbi: gold, game_level: level, dzp: ticket, yqq: invitedTicket, game_level_goods: gameLevel, qd_num: eggsNums, k_video: videoAmount } = member
        return {
            list,
            info: {
                id,
                gold,
                level: Number(level),
                dividend,
                ticket,
                invitedTicket,
                levelName: gameLevel.goodsname,
                birdType: isNaN( Number(gameLevel.goodsType) ) ? gameLevel.goodsType : 'jin',
                eggsNums: Number(eggsNums),
                onlineIncome: gameLevel.income,
                offlineIncome: gameLevel.lx_income,
                // kefuQR: kefu,
                setting: {
                    kefuQR: set.kefu,
                    shareLink: set.fx_lj,
                    shareContent: set.fx_sm
                }, // 后端设置
                onlineTime,
                videoAmount: Number(videoAmount),
            }
        }
    },
    birdsGroup (data) {
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if ( Number(status) !== 1) return prompt(result.message)
        if ( !result.weizhi ) return true // 如果位置不存在, 则说明是修改操作, 返回 true 表示成功
        let list = result.weizhi.replace(/&quot;/g, '"')
        // console.log('aaaaaaa==>', list)
        try {
            list = JSON.parse(list)
        } catch (err) {
            return true
        }
        // 如果数据格式不是数组, 则返回 true
        if ( !(list instanceof Array) ) return true
        // 返回解析后的 JSON
        return list
    },
    recycle (data) {
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if ( Number(status) !== 1) return prompt(result.message)
        let { jinbi, credit_b: egg, credit_red: red, dzp: ticket } = result
        // 返回获得的最新金币
        return {
            gold: Number(jinbi),
            egg: Number(egg),
            red: Number(red),
            ticket: Number(ticket),
            message: '回收成功'
        }
    },
    mixing (data) {
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if ( Number(status) !== 1) return prompt(result.message)
        // 提取有用的数据
        let { id, goodslevel, income, goodsType, goodsname, receive } = result.games
        let { status: redStatus, red_max: max, red_min: min, logid } = result.red
        return {
            bird: {
                id,
                level: Number(goodslevel),
                typeName: goodsType,
                income: Number(income),
                levelName: goodsname,
                receive: Number(receive)
            },
            red: {
                status: Number(redStatus),
                max,
                min,
                logid
            }
        }
    },
    breakEggs (data) {
        // 奖品图片与后端参数的映射
        // let markPrizeImg = {
        //     '0': 'icon_gold.png', // 金币
        //     '1': 'icon_cdb.png', // 彩蛋币
        //     '2': 'red_pag.png', // 现金
        //     '3': 'icon_draft.png' // 卡片稿子
        // }
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if ( Number(status) !== 1) return prompt(result.message)
        // 提取有用的数据
        let { goodsname, status: prizeMark, img, money } = result.qdlist
        let type = Number(prizeMark) // 0 金币 1 彩蛋币 2 现金 3 卡片稿子
        return {
            prizeName: goodsname,
            amount: Number(money),
            type,
            // img: markPrizeImg[prizeMark],
            prizeMark,
            cardImg: img
        }
    },
    pictorialBook (data) {
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if ( Number(status) !== 1) return prompt(result.message)
        // console.log(result)
        let list = result.list.map( item => {
            let { goodsname, jn, js, goodsType, is } = item
            return {
                name: goodsname,
                skill: jn,
                ways: js, // 获取途径
                mark: goodsType, // 用作图片标记
                own: Number(is) === 1
            }
        })
        return list
    },
    ranking (data) {
        console.log(data)
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if ( Number(status) !== 1) return prompt(result.message)
        let { phb_list: phbList, member } = result
        // 解析后端数据
        console.log(result.phb_list)
        if ( result.phb_list !== 0) {
            let list = phbList.map( item => {
                let { nickname, avatar, game_level: level, goodsname, jinbi } = item
                return {
                    name: nickname,
                    avatar,
                    level,
                    levelName: goodsname,
                    gold: jinbi
                }
            })
            return {
                list,
                userInfo: {
                    name: member.nickname,
                    avatar: member.avatar,
                    level: member.game_level,
                    levelName: member.goodsname,
                    gold: member.jinbi,
                    ranking: member.pm
                }
            }
        }
        return {
            userInfo: {
                name: member.nickname,
                avatar: member.avatar,
                level: member.game_level,
                levelName: member.goodsname,
                gold: member.jinbi,
                ranking: member.pm
            }
        }
    },
    fivefiveopen (data) {
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if (Number(status) !== 1) return prompt(result.message)
        let { games, shan } = result
        let { goodslevel, id, goodsType, income } = games
        return {
            bird: {
                level: Number(goodslevel),
                id,
                typeName: goodsType,
                income: Number(income),
            },
            del: shan
        }
    },
    onlinePrize (data) {
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if (Number(status) !== 1) return prompt(result.message)
        let { money, zx_miao: onlineTime, id } = result
        return {
            money,
            onlineTime,
            id
        }
    },
    watchedVideo (data) {
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if (Number(status) !== 1) return prompt(result.message)
        let { money } = result
        return {
            money: Number(money)
        }
    },
    clickBaoBox (data) {
        console.log("宝箱",data)
        let { status, result } = data
        if ( Number(status) === -2) return reBackApp()
        if (Number(status) !== 1) return prompt(result.message)
        let { money } = result
        return {
            gold: money
        }
    }
}

export default function (port, data) {
    // console.log(data)
    if (typeof data !== 'object') {
        Dialog.alert({
            title: '服务器错误',
            message: '返回的数据不是JSON'
        })
        return false
    }
    return hander[port](data)
}

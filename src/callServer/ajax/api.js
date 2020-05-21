/**
 * 后端 请求, api 的 封装
 */
import { cookie } from 'myuijs'

let common = '/app/index.php?i=96&c=entry&m=wx_shop&do=mobile&' // 公共字段

// 获取 cookie 的 token
// let token = cookie.getCookie('token') || 'fb5d150e14054c2c026e24cb939b2403'
let token = cookie.getCookie('token') || 'b76cfd6f076043746f59be1316ebafc4'
console.log(cookie)
export default {
    userInfo: `${common}r=game.game&token=${token}`, // 用户信息
    birdsGroup: `${common}r=game.game.weizhi&token=${token}`, // 鸟布局信息
    shop: `${common}r=game.game.splist&token=${token}`, // 商店
    buyGoods: `${common}r=game.game.buy&token=${token}`, // 购买鸟
    turntableList: `${common}r=game.game.dzp&token=${token}`, // 大转盘奖品列表
    toTurn: `${common}r=game.game.dzp_jiang&token=${token}`, // 开始抽奖
    recycle: `${common}r=game.game.receive&token=${token}`, // 回收神鸟
    mixing: `${common}r=game.game.hecheng&token=${token}`, // 神鸟合成
    breakEggs: `${common}r=game.game.qd_jiang&token=${token}`, // 砸蛋
    pictorialBook: `${common}r=game.game.getTj&token=${token}`, // 图鉴
    ranking: `${common}r=game.game.phb_list&token=${token}`, // 排行榜
    fivefiveopen: `${common}r=game.game.wuheyi&token=${token}`, // 五凤合成
    onlinePrize: `${common}r=game.game.zx_lq&token=${token}`, // 在线奖励获取
    clickBaoBox: `${common}r=game.game.baox&token=${token}`, // 点击了宝箱
    watchedVideo: `${common}r=game.game.k_video&token=${token}`, // 观看完视频之后, 获取奖励
}
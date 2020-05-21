
export default {
    // 用户信息
    userInfo: {
        id: '', // 用户id
        gold: 0, // 金币
        level: 0, // 等级
        dividend: 0, // 分红
        ticket: 0, // 转盘券
        invitedTicket: 0, // 邀请券
        levelName: '', // 等级对应的宠物名
        eggsNums: '', // 敲蛋的次数
        onlineTime: 0, // 在线时间, 秒
        timeOfCountdown: 3600, // 在线奖励领取时间倒计时, 秒
        birdType: 'jin', // 当前等级的鸟类型
        onlineIncome: 0, // 在线收益,
        offlineIncome: 0, // 离线收益
        videoAmount: 0, // 可观看视频广告的次数
        // 后端设置
        setting: {
            kefuQR: '', // 客服二维码
            shareLink: '', // 分享链接,
            shareContent: '', // 分享内容
        }
    },
    // 鸟数组
    birdList: [
        {
            id: null, // 鸟的id
            mark: null, // 标记, 映射 img
            income: 0, // 每只鸟的收成
            level: -1, // 等级
            receive: 0, // 回收价格
        },
        {
            id: null,
            mark: null,
            income: 0,
            level: -1,
            receive: 0,
        },
        {
            id: null,
            mark: null,
            income: 0,
            level: -1,
            receive: 0,
        },
        {
            id: null,
            mark: null,
            income: 0,
            level: -1,
            receive: 0,
        },
        {
            id: null,
            mark: null,
            income: 0,
            level: -1,
            receive: 0,
        },
        {
            id: null,
            mark: null,
            income: 0,
            level: -1,
            receive: 0,
        },
        {
            id: null,
            mark: null,
            income: 0,
            level: -1,
            receive: 0,
        },
        {
            id: null,
            mark: null,
            income: 0,
            level: -1,
            receive: 0,
        },
        {
            id: null,
            mark: null,
            income: 0,
            level: -1,
            receive: 0,
        },
        {
            id: null,
            mark: null,
            income: 0,
            level: -1,
            receive: 0,
        },
        {
            id: null,
            mark: null,
            income: 0,
            level: -1,
            receive: 0,
        },
        {
            id: null,
            mark: null,
            income: 0,
            level: -1,
            receive: 0,
        },
    ],
    // 商店商品数据
    shopData: [],
    // 用于保存特殊鸟其名的对象
    specialBirdNames: {
        jin: '',
        mu: '',
        shui: '',
        huo: '',
        tu: '',
        nan: '',
        nv: '',
        top: '',
        qinglv: ''
    },
    // 图鉴
    pictorialBook: [],
    isGoldShort:false
}
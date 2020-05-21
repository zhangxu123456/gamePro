// 引入 spriteJs库 对应 模块
import { Scene, Group, Sprite, Label } from 'spritejs'
// 引入 资源
import assets from './assets'
// 引入 ajax 模块
import ajax from '@/callServer/ajax/index'
// 引入 store 数据
import store from '@/store/index'
import { Music } from './music'

// 判断是为 16:9 还是 18:9 的设备尺寸
let isNewScreen = window.innerHeight / window.innerWidth >= 1.85 // 为 18:9

class Turntable {
    _scene = null // 场景
    _layer = null // 层
    _canvasWidth = 750 // 画布宽
    _canvasHeight = isNewScreen ? 1524 : 1334 // // 画布高, 16:9尺寸的设备 为 1334, 18:9 尺寸的设备为 1624
    _table = null // 存储用于旋转的 Group 对象
    _prizeList = [] // 存储奖品容器 group 对象, 用于后续设置抽中高亮
    _data = null // 后端奖品数组
    _currentWinIndex = -1 // 当前抽中的索引
    _turning = false // 抽奖状态锁
    _ticketLabel = null // 转盘券数量展示
    _theResult = null // 抽奖结果
    _startBtn = null // 开始按钮
    _isOver = false // 不可再抽奖
    // 钩子函数对象
    _hooks = {
        onClose: null, // 关闭事件钩子函数
        onResult: null, // 转盘出结果钩子函数
    }
    _initnum = 0 // 奖品初始位置

    constructor (data) {
        this._init()
        this._data = data
    }

    // 回调监听
    listen (hooks) {
        this._hooks = {
            ...hooks
        }
    }

    // 初始化
    async _init () {
        // console.log(this._layer)
        let { _canvasWidth, _canvasHeight } = this
        // 初始化, 创建 画布场景
        this._scene = new Scene('#turntable', {
            viewport: ['auto', 'auto'], 
            resolution: [_canvasWidth, _canvasHeight]
        })
        this._layer = this._scene.layer()
        // 加载 资源
        await this._loading()
        this._createStage()
        this._placePrize()
    }

    // 创建 静态场景布局
    _createStage () {
        // 创建标题
        let title = new Sprite()
        title.attr({
            textures: 'bg_img_title.png',
            zIndex: 1,
            size: [445, 209],
            pos: [153, 250]
        })

        // 创建底部背景
        let bottomBg = new Group()
        bottomBg.attr({
            bgimage: {
                display: 'stretch',
                src: 'turntable_bg.png'
            },
            size: [750, 1217],
            pos: [0, 0],
            // border: [1, 'red']
        })

        // 创建关闭按钮
        let closeBtn = new Sprite()
        closeBtn.attr({
            textures: 'btn_close.png',
            size: [70, 70],
            anchor: [0.5, 0.5],
            pos: [375, 1250]
        })

        // 邀请券
        let ticket = new Sprite()
        ticket.attr({
            textures: 'prize_ticket.png',
            size: [70, 62],
            pos: [240, 970]
        })

        // 邀请券文字
        let ticketLabel = new Label()
        ticketLabel.attr({
            text: `转盘券: ${store.state.userInfo.ticket}`,
            font: '24px bold AkrobatBloack',
            color: 'white',
            pos: [240, 985],
            textShadow: 'black 1px 1px 2px',
            width: 230,
            textAlign: 'right'
        })
        
        // 创建启动按钮
        let startBtn = new Label()
        startBtn.attr({
            bgimage: {
                src: 'btn_start.png',
                display: 'stretch'
            },
            anchor: 0.5,
            font: '30px bold AkrobatBloack',
            width: 179,
            height: 98,
            pos: [375, 1090],
            text: '开始转盘',
            textIndent: 30,
            lineHeight: 90,
            color: 'white',
            // filter: {
            //     saturate: '5%'
            // }
        })

        // 创建圆盘
        // let table = new Group()
        // table.attr({
        //     bgimage: {
        //         src: 'turntable.png',
        //         display: 'stretch'
        //     },
        //     anchor: 0.5,
        //     size: [680, 680],
        //     pos: [41 + 340, 216 + 340],
        // })

        // 添加
        bottomBg.append(startBtn, ticket, ticketLabel)
        this._layer.append(title, bottomBg, closeBtn)
        this._ticketLabel = ticketLabel
        this._startBtn = startBtn

        // 为启动按钮设置点击动态效果, 以及回调开始
        this._touchAnimated(startBtn, () => {
            this._startTurntable()
        }, true)
        // 关闭按钮动效事件
        this._touchAnimated(closeBtn, this._hooks.onClose)
        // 如果可转盘条件为不成立
        if ( Number(store.state.userInfo.ticket) === 0 && Number(store.state.userInfo.invitedTicket) === 0 ) {
            this._isOver = true
            this._startBtn.attr({
                filter: {
                    saturate: '5%'
                }
            })
        }
    }

    // 放置奖品
    _placePrize () {
        let groupSize = 500 // 外层组的尺寸
        let prizeSize = 158 // 每个奖品的尺寸
        // 圆的半径 和 圆心坐标
        let radius = groupSize / 2 - prizeSize / 2
        let circleCenter = [groupSize / 2, groupSize / 2]

        // 创建 奖品组
        let prizeGroup = new Group()
        prizeGroup.attr({
            anchor: 0.5,
            size: [groupSize, groupSize + 11],
            pos: [160 + groupSize / 2, 450 + groupSize / 2],
            // border: [1, 'green'],
        })

        // 遍历创建九个奖品容器, 以及放置奖品
        this._data.forEach( (item, i) => {
            // 获取对应角度在圆上的坐标
            let x = (i % 3) * 158
            let y = Math.floor(i / 3) * 158

            // 创建奖品容器
            let prizeContainer = new Group()
            prizeContainer.attr({
                bgimage: {
                    src: 'content_icon_dial.png',
                    display: 'stretch'
                },
                anchor: 0.5,
                size: [158, 158],
                pos: [x + 60, y + 100],
            })
            
            // 创建奖品
            let prize = new Sprite()
            prize.attr({
                textures: item.img,
                anchor: 0.5,
                pos: [75, 65],
                height: 60
                // size: [60, 60]
            })
            let name = new Label()
            name.attr({
                text: item.name,
                font: '20px bold AkrobatBloack',
                color: '#E1C556',
                width: 150,
                textAlign: 'center',
                pos: [0, 95]
            })

            // 添加
            prizeContainer.append(prize, name)
            prizeGroup.append(prizeContainer)
            // 添加到容器中
            this._prizeList.push(prizeContainer)
        })
        // 添加
        this._layer.append(prizeGroup)
        this._table = prizeGroup
    }

    /**
     * 
     * @param {*} sprite 旋转的对象
     * @param {*} num 总旋转次数, 用于停止旋转
     * @param {*} turns 当前旋转圈数. 用于标记旋转
     */
    
    async _transition (sprite, num, turns) {
        let num1 = this._initnum - 1
        try {
            await sprite.transition(0.2).attr({
                // rotate: 40 * turns + 180,
            })

            if (num1 < 0) {
                num1 = 8
            } else if (num1 > 8) {
                num1 = 0
            }

            this._prizeList[num1].attr({
                bgimage: {
                    src: 'content_icon_dial.png',
                    display: 'stretch'
                }
            })

            this._prizeList[this._initnum].attr({
                bgimage: {
                    src: 'content_icon_dial_selected.png',
                    display: 'stretch'
                }
            })
            
            if (num < 1) {
                this._prizeList[this._initnum].attr({
                    bgimage: {
                        src: 'content_icon_dial.png',
                        display: 'stretch'
                    }
                })
            }

            this._initnum++
            if (this._initnum === 9) {
                this._initnum = 0
            }
            num--
            turns++ // 递增当前全书
            if (num > 0) {
                this._transition(sprite, num, turns)
            } else {
                this._initnum = 0
                this._prizeList[this._currentWinIndex].attr({
                    bgimage: {
                        src: 'content_icon_dial_selected.png',
                        display: 'stretch'
                    },
                    // shadow: {
                    //     blur: 50,
                    //     color: '#ffb600',
                    //     offset: [0, 0],
                    // }
                })
                // 抽奖结束, 开锁
                this._turning = false
                // console.log(this._theResult)
                // 如果 转盘券 为0, 这时候说明减少的是邀请券
                if ( Number(store.state.userInfo.ticket) === 0 ) {
                    store.commit('updateUserInfo', {
                        invitedTicket: Number(store.state.userInfo.invitedTicket) - 1
                    })
                }
                // 更新 转盘券, 老的处理方式, 2020年1月7日 15:00:56
                // let ticket = store.state.userInfo.ticket - 1
                // // type 0: 金币, 1 彩蛋币, 2 现金, 3转盘券
                // if ( this._theResult.type === '3' ) {
                //     ticket = ticket + this._theResult.amount
                // } else if ( this._theResult.type === '0' ) {
                //     store.commit('updateUserInfo', {
                //         gold: Number(store.state.userInfo.gold) + this._theResult.amount
                //     })
                // }
                // store.commit('updateUserInfo', {
                //     ticket: ticket >= 0 ? ticket : 0
                // })
                // 执行钩子函数
                this._hooks.onResult && this._hooks.onResult(this._theResult)
                this._ticketLabel.attr({
                    text: `转盘券: ${store.state.userInfo.ticket}`
                })
                // 判断 转盘条件 满足
                if ( Number(store.state.userInfo.ticket) === 0 && Number(store.state.userInfo.invitedTicket) === 0 ) {
                    this._isOver = true
                    this._startBtn.attr({
                        filter: {
                            saturate: '5%'
                        }
                    })
                }
            }
        } catch (err) {
            console.warn(err)
        }
    }

    // 启动转盘事件函数
    async _startTurntable () {
        ;(new Music()).play('other')

        // 重置转盘样式
        this._currentWinIndex !== -1 && this._prizeList[this._currentWinIndex].attr({
            bgimage: {
                src: 'content_icon_dial.png',
                display: 'stretch'
            }
        })
        // 请求抽奖结果
        let res = await ajax('toTurn')
        this._theResult = res
        if (!res) return false
        // 获取 抽中奖品在 奖品列表中的 索引
        let winIndex = -1 // 中奖产品所在的索引
        this._data.some( (item, index) => {
            if (item.id === res.id) {
                winIndex = index // 保存符合条件的索引
                return true
            }
        })
        if (winIndex === -1) return alert('返回数据出错')
        // 重置转盘位置
        this._table.attr({
            // rotate: 0
        })
        this._currentWinIndex = winIndex // 将当前抽中的索引保存
        this._turning = true // 标记开始抽奖
        // 旋转, 转一圈 9, 从 10 开始计算, 10 => 0(第一个奖品)
        this._transition(this._table, 10 + winIndex, 0)
    }

    // 点击动效事件
    _touchAnimated (btn, callback, isStartBtn) {
        btn.on('touchstart', (evt) => {
            if (isStartBtn && this._isOver) return false
            if (this._turning) return false // 如果正在抽奖, 则终止函数
            evt.stopDispatch()
            btn.attr({
                scale: 0.95
            })
        })
        btn.on('touchend', (evt) => {
            if (isStartBtn && this._isOver) return false
            if (this._turning) return false // 如果正在抽奖, 则终止函数
            evt.stopDispatch()
            btn.attr({
                scale: 1
            })
            // 执行回调
            callback && callback()
        })
    }
    
    // 加载资源
    async _loading () {
        // 监听加载事件, 更新 页面 进度显示
        this._scene.on('preload', (evt) => {
            console.log(`加载中... ${( (evt.loaded.length / evt.resources.length).toFixed(2) ) * 100}%`)
        })
        // 等待 加载完 资源
        await this._scene.preload(...assets.turntable)
    }
}

export default Turntable
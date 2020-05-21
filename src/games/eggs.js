// 引入 spriteJs库 对应 模块
import { Scene, Group, Sprite, Label } from 'spritejs'
// 引入 资源
import assets from './assets'
// 引入 vuex 
import store from '@/store/index'
// 引入 ajax
import ajax from '@/callServer/ajax/index'
import { Music } from './music'

// 判断是为 16:9 还是 18:9 的设备尺寸
let isNewScreen = window.innerHeight / window.innerWidth >= 1.85 // 为 18:9

class eggs {
    _scene = null // 场景
    _layer = null // 层
    _canvasWidth = 750 // 画布宽
    _canvasHeight = isNewScreen ? 1624 : 1334 // // 画布高, 16:9尺寸的设备 为 1334, 18:9 尺寸的设备为 1624
    _groupBg = null // 背景组
    _eggsNums = null // 敲蛋次数对象
    _breaking = false // 正在敲击限制, 放置多次敲击
    // 钩子函数对象
    _hooks = {
        onClose: null, // 关闭事件钩子函数
        onBreaked: null // 蛋被敲下事件钩子函数
    }

    constructor () {
        this._init()
    }

    /**
     * 提供 与 外部通讯的接口
     * @param {*} hooks Object, 钩子函数所在对象
     * @param {*} hooks.onClose, // 关闭事件钩子函数
     * @param {*} hooks.onBreaked, // 蛋被敲下事件钩子函数
     */
    listen (hooks) {
        // 将监听的钩子函数, 挂载到私有变量上
        this._hooks = {
            ...hooks
        }
    }
    
    // 重置 金蛋 视图
    resetEggsView () {
        this._layer.clear() // 清空画布
        this._breaking = false // 可以再次敲击
        this._createStage() // 重新绘制画面
    }

    // 初始化
    async _init () {
        let { _canvasWidth, _canvasHeight } = this
        // 初始化, 创建 画布场景
        this._scene = new Scene('#eggs', {
            viewport: ['auto', 'auto'], 
            resolution: [_canvasWidth, _canvasHeight]
        })
        this._layer = this._scene.layer()
        // 加载 资源
        await this._loading()
        this._createStage()
    }

    // 创建静态布局
    _createStage () {
        let bgSize = [585, 880]
        let { _canvasWidth, _canvasHeight } = this
        
        // 创建组背景
        let groupBg = new Group()
        groupBg.attr({
            bgimage: {
                src: 'img_pop-up.png',
                display: 'stretch'
            },
            size: bgSize,
            anchor: 0.5,
            pos: [_canvasWidth / 2, _canvasHeight / 2],
        })

        // 关闭按钮
        let closeBtn = new Sprite()
        closeBtn.attr({
            textures: 'btn_close.png',
            size: [70, 70],
            anchor: [0.5, 0.5],
            pos: [_canvasWidth / 2 + bgSize[0] / 2 - 12, _canvasHeight / 2 - bgSize[1] / 2 + 65]
        })

        // 标题
        let title = new Sprite()
        title.attr({
            textures: 'img_name_cd.png',
            size: [119, 63],
            pos: [245, 25]
        })

        // 创建次数显示
        let eggsNums = new Label()
        eggsNums.attr({
            text: `次数: ${store.state.userInfo.eggsNums}`,
            font: 'small-caps bold 35px Arial',
            color: 'white',
            width: 585,
            textAlign: 'center',
            pos: [0, 754],
        })

        // 添加
        groupBg.append(title, eggsNums)
        this._layer.append(groupBg, closeBtn)
        this._eggsNums = eggsNums

        // 创建彩蛋
        this._createEggs(groupBg)

        // 关闭按钮击动效
        this._touchAnimated(closeBtn, () => {
            // 点击关闭按钮, 触发关闭钩子函数
            this._hooks.onClose && this._hooks.onClose()
        })

        // 背景组
        this._groupBg = groupBg
    }

    // 创建 彩蛋组
    _createEggs (groupBg) {
        let size = [475, 575]
        let pos = [55, 169]

        // 创建组
        let eggGroup = new Group()
        eggGroup.attr({
            size,
            pos,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            // border: [1, 'red']
        })

        // 遍历创建彩蛋
        for (let i = 0; i < 9; i++) {
            // 单个鸡蛋组
            let eggitems = new Group()
            eggitems.attr({
                size: [156, 156],
                // border: [1, 'green']
            })

            // 彩蛋
            let egg = new Sprite()
            egg.attr({
                textures: 'img_egg_default.png',
                size: [156, 156]
            })
            eggitems.append(egg)
            eggGroup.append(eggitems)

            // 绑定敲蛋事件
            this._breakEggEvent(eggitems)
        }
        // 添加
        groupBg.append(eggGroup)
    }

    // 碎蛋视图
    _breakEggView (group, img) {
        // 高光
        let light = new Sprite()
        light.attr({
            textures: 'img_light.png',
            size: [132, 132],
            pos: [81, 66],
            anchor: 0.5,
        })

        // 奖品
        let prize = new Sprite()
        prize.attr({
            textures: img,
            size: [60, 60],
            pos: [48, 0]
        })

        // 破碎的蛋
        let breakedEgg = new Sprite()
        breakedEgg.attr({
            textures: 'img_egg_active.png',
            size: [156, 156]
        })

        // 高光旋转动画
        light.animate([
            { rotate: 0 },
            { rotate: 360 },
        ], {
            duration: 1800,
            iterations: Infinity,
        })

        // 添加
        group.append(light, prize, breakedEgg)
    }

    // 锤子砸下的特效
    async _breakingAnimate (pos) {
        ;(new Music()).play('panel')

        let [x, y] = pos
        // x 坐标, 点击的 彩蛋所在 eggitems组 的 坐标 + 彩蛋外部容器 eggGroup组 x 轴偏移坐标 + 彩蛋所在组的 width
        x = x + 55 + 156
        // y 坐标, 点击的 彩蛋所在 eggitems组 的 坐标 + 彩蛋外部组容器 eggGroup组 y 轴偏移坐标 + 锤子的 height
        y = y + 169 + 90
        // 创建锤子
        let hammer = new Sprite()
        hammer.attr({
            textures: 'icon_hammer.png',
            size: [90, 90],
            anchor: [1, 1],
            pos: [x, y],
            // border: [1, 'red']
        })
        
        // 添加
        // group.append(hammer)
        this._groupBg.append(hammer)

        await hammer.transition(0.2).attr({
            rotate: 45
        })
        await hammer.transition(0.05).attr({
            rotate: 0
        })
        return true
    }

    // 敲蛋事件
    _breakEggEvent (egg) {
        egg.on('click', async (evt) => {
            evt.stopDispatch()
            if (this._breaking) return false // 如果正在敲击, 则终止函数
            this._breaking = true
            // 发送 ajax, 获取奖品
            let res = await ajax('breakEggs')
            if (!res) return false
            await this._breakingAnimate(egg.xy)
            egg.clear() // 清空子元素
            // 新增敲碎的蛋, 以及 奖品
            this._breakEggView(egg, res.img)
            // 响应 敲蛋 钩子函数, 将后端数据传递出去
            this._hooks.onBreaked && this._hooks.onBreaked(res)
        })
    }

    // 点击动效事件
    _touchAnimated (btn, callback) {
        btn.on('touchstart', (evt) => {
            evt.stopDispatch()
            btn.attr({
                scale: 0.95
            })
        })
        btn.on('touchend', (evt) => {
            evt.stopDispatch()
            btn.attr({
                scale: 1
            })
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
        await this._scene.preload(...assets.eggs)
    }
}

export default eggs
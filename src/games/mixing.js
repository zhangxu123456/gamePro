// 引入 spriteJs库 对应 模块
import { Scene, Group, Sprite, Label } from 'spritejs'
// 引入 资源
import assets from './assets'
// 引入 vuex 
import store from '@/store/index'

// 判断是为 16:9 还是 18:9 的设备尺寸
let isNewScreen = window.innerHeight / window.innerWidth >= 1.85 // 为 18:9

// 鸟图片映射
const specialBirdMap = {
    jin: 'bird_img_jin.png',
    mu: 'bird_img_mu.png',
    shui: 'bird_img_shui.png',
    huo: 'bird_img_huo.png',
    tu: 'bird_img_tu.png',
    nan: 'bird_img_nan.png',
    nv: 'bird_img_nv.png',
    top: 'bird_img_top.png',
}

class Mixing {
    _scene = null // 场景
    _layer = null // 层
    _canvasWidth = 750 // 画布宽
    _canvasHeight = isNewScreen ? 1524 : 1334 // // 画布高, 16:9尺寸的设备 为 1334, 18:9 尺寸的设备为 1624
    _light = null // 高亮对象
    _birdsOuterGroup = null // 旋转外层组
    _mixedInfo = null
    _resultData = null // 合成结果数据
    _mixing = false // 合成状态, 为true,不允许关闭页面
    // 钩子函数对象
    _hooks = {
        onClose: null, // 关闭事件钩子函数
        onFinished: null, // 合成完成钩子函数
    }
    /**
     * @param {*} mixedInfo 要合成的鸟的信息
     */
    constructor (mixedInfo) {
        this._mixedInfo = mixedInfo
        this._init()
    }

    // 回调监听
    listen (hooks) {
        this._hooks = {
            ...hooks
        }
    }

    // 初始化
    async _init () {
        let { _canvasWidth, _canvasHeight } = this
        // 初始化, 创建 画布场景
        this._scene = new Scene('#mixing', {
            viewport: ['auto', 'auto'], 
            resolution: [_canvasWidth, _canvasHeight]
        })
        this._layer = this._scene.layer()
        // 加载 资源
        await this._loading()
        this._createStage()
    }

    // 创建静态场景布局
    _createStage () {
        // 创建标题
        let title = new Sprite()
        title.attr({
            textures: 'bg_img_sjhc.png',
            size: [368, 184],
            pos: [191, 210],
            zIndex: '-1'
        })

        // 创建圆盘
        let table = new Sprite()
        table.attr({
            textures: 'bg_img_table.png',
            size: [693, 580],
            pos: [24, 330],
        })

        // 创建关闭按钮
        let closeBtn = new Sprite()
        closeBtn.attr({
            textures: 'btn_close.png',
            size: [70, 70],
            anchor: [0.5, 0.5],
            pos: [656, 279]
        })

        // 创建鸟组
        let birdsGroup = this._createBirdsGroup()
        console.log(birdsGroup)
        // 创建抽中高光
        let light = new Sprite()
        light.attr({
            textures: 'light_selected.png',
            anchor: 0.5,
            size: [140, 260],
            pos: [368, 500],
            opacity: 1,
        })

        // 创建指针
        let pointer = new Sprite()
        pointer.attr({
            textures: 'icon_pointer.png',
            anchor: 0.5,
            size: [40, 80],
            pos: [368, 500],
        })

        // let startBtnText = new Label()
        // startBtnText.attr({
        //     text: `开始合成`,
        //     font: 'small-caps bold 25px Arial',
        //     color: 'white',
        //     width: 585,
        //     anchor: 0.5,
        //     textAlign: 'center',
        //     pos: [375, 1050]
        // })

        // 创建开始按钮
        let startBtn = new Sprite()
        startBtn.attr({
            anchor: 0.5,
            textures: 'btn_start.png',
            size: [120, 120],
            pos: [368, 600]
        })

        // 添加
        this._layer.append(title, table, closeBtn, birdsGroup, light, startBtn, pointer)
        this._light = light

        // 按钮添加动效
        this._touchAnimated(closeBtn, () => {
            if (this._mixing) return false
            this._hooks.onClose && this._hooks.onClose()
        })
        this._touchAnimated(startBtn, async () => {
            if (this._mixing) return false
            this._mixing = true
            // console.log('开始')
            let res = await store.dispatch('birdMixing', this._mixedInfo)
            let { mark } = res
            let roundNum = 17 // 转盘走圈所的次数
            // console.log(res)
            // 将 结果的数据, 保存到私有变量 中
            this._resultData = res
            // 遍寻找到 对应 mark 所在 specialBirdMap 中的 索引
            let theIndex = Object.keys(specialBirdMap).findIndex( key => { return key === mark } )
            roundNum += theIndex
            this._transition(this._birdsOuterGroup, roundNum, 0)
        })
    }

    // 创建鸟所在组
    _createBirdsGroup () {
        let groupSize = 520 // 外层组的尺寸
        // 圆的半径 和 圆心坐标
        let radius = groupSize / 2 - 76
        let circleCenter = [groupSize / 2, groupSize / 2]

        let birdsOuterGroup = new Group()
        birdsOuterGroup.attr({
            anchor: 0.5,
            size: [groupSize, groupSize],
            pos: [105 + groupSize / 2, 355 + groupSize / 2],
            // border: [1, 'red'],
            rotate: 180
        })
        // 遍历生成鸟
        Object.entries(specialBirdMap).forEach( (item, i) => {
            // 获取对应角度在圆上的坐标
            let x = circleCenter[0] + Math.sin(2 * Math.PI / 360 * (45 * i) ) * radius
            let y = circleCenter[1] + Math.cos(2 * Math.PI / 360 * (45 * i) ) * radius
            // 创建鸟内部容器
            let innerGroup = new Group()
            innerGroup.attr({
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'column',
                alignItems: 'center',
                // justifyContent: 'space-around',
                anchor: 0.5,
                size: [141, 141],
                pos: [x, y],
                rotate: 180 - i * 45,
                // border: [1, 'red']
            })
            
            // 创建鸟视图
            let bird = new Sprite()
            bird.attr({
                textures: item[1],
                anchor: 0.5,
                pos: [75, 50],
                height: 90
                // size: [60, 60]
            })
            // 创建鸟名字
            let name = new Label()
            name.attr({
                text: store.state.specialBirdNames[item[0]],
                textAlign: 'center',
                bgcolor: 'rgba(255,255,255, 0.5)',
                // width: 80,
                font: 'small-caps bold 21px Arial',
                color: '#6C2127',
                padding: [10, 15, 5, 15],
                borderRadius: 20
            })

            // 添加
            innerGroup.append(bird, name)
            birdsOuterGroup.append(innerGroup)
        })
        this._birdsOuterGroup = birdsOuterGroup
        return birdsOuterGroup
    }
    /**
     * 
     * @param {*} sprite 旋转的对象
     * @param {*} num 总旋转次数, 用于停止旋转
     * @param {*} turns 当前旋转圈数. 用于标记旋转
     * @param {*} data 合成结果的数据
     */
    async _transition (sprite, num, turns) {
        try {
            await sprite.transition(0.15).attr({
                rotate: 45 * turns + 180,
            })
            num--
            turns++ // 递增当前全书
            if (num > 0) {
                this._transition(sprite, num, turns)
            } else {
                console.log('over')
                // 旋转结束, 打高光
                this._light.transition(0.2).attr({
                    opacity: 1
                })
                // 执行完成回调
                this._hooks.onFinished && this._hooks.onFinished(this._resultData)
                this._mixing = false // 合成关闭, 更替状态
            }
        } catch (err) {
            console.warn(err)
        }
    }
    // 加载资源
    async _loading () {
        // 监听加载事件, 更新 页面 进度显示
        this._scene.on('preload', (evt) => {
            console.log(`加载中... ${( (evt.loaded.length / evt.resources.length).toFixed(2) ) * 100}%`)
        })
        // 等待 加载完 资源
        await this._scene.preload(...assets.mixing)
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
            // 执行回调
            callback && callback()
        })
    }
}

export default Mixing
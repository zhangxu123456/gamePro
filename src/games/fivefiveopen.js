// 引入 spriteJs库 对应 模块
import { Scene, Group, Sprite, Label } from 'spritejs'
// 引入 资源
import assets from './assets'
// 引入 vuex 
import store from '@/store/index'
import { Toast } from 'vant'

// 判断是为 16:9 还是 18:9 的设备尺寸
let isNewScreen = window.innerHeight / window.innerWidth >= 1.85 // 为 18:9

// 鸟图片映射
const specialBirdMap = {
    jin: 'bird_img_jin',
    mu: 'bird_img_mu',
    shui: 'bird_img_shui',
    huo: 'bird_img_huo',
    tu: 'bird_img_tu',
}

class Fivefiveopen {
    _scene = null // 场景
    _layer = null // 层
    _canvasWidth = 750 // 画布宽
    _canvasHeight = isNewScreen ? 1524 : 1334 // // 画布高, 16:9尺寸的设备 为 1334, 18:9 尺寸的设备为 1624
    _mixing = false // 用于限制合成开始后关闭页面
    _fiveNum = 0 // 用于判断疯的数量是否达到五条

    // 钩子函数对象
    _hooks = {
        onClose: null, // 关闭事件钩子函数
        onMixing: null, // 开始合成事件钩子函数
        onMixed: null, // 合成完成
    }

    constructor () {
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
        this._scene = new Scene('#fivefiveopen', {
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
        // 关闭按钮
        let closeBtn = new Sprite()
        closeBtn.attr({
            textures: 'btn_close.png',
            size: [60, 60],
            anchor: 0.2,
            pos: [660, 220]
        })

        // 创建圆盘
        let table = new Sprite()
        table.attr({
            textures: 'bg_img_sjhc.png',
            size: [700, 560],
            pos: [25, 300]
        })

        // 创建圆盘中心
        let tableCenter = new Sprite()
        tableCenter.attr({
            textures: 'btn_start_center.png',
            anchor: 0.5,
            size: [180, 160],
            pos: [368, 576],
            zIndex: '100'
        })

        // 创建鸟组
        let birdsGroup = this._createBirdsGroup()

        // 创建开始按钮
        let startBtn = new Sprite()
        startBtn.attr({
            textures: 'btn_start.png',
            anchor: 0.5,
            size: [260, 240],
            pos: [373, 570],
        })

        // 创建开始按钮文字
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

        // 创建标题
        let title = new Sprite()
        title.attr({
            textures: 'bg_img_title.png',
            size: [400, 326],
            pos: [191, 210],
            zIndex: '-1'
        })

        // 添加
        this._layer.append(title, closeBtn, table, tableCenter, birdsGroup, startBtn)
        // 添加点击动效, 关闭事件
        this._touchAnimated(closeBtn, () => {
            if (this._mixing) return false
            this._hooks.onClose && this._hooks.onClose()
        })
        // 添加点击动效, 开始合成事件
        this._touchAnimated(startBtn, () => {
            if (this._fiveNum < 5) {
                Toast('你尚未集齐五凤')
                return false
            }
            // 执行 开始合成 钩子函数
            this._hooks.onMixing && this._hooks.onMixing()
            this._mixing = true
            // 执行合成特效
            this._mixingEffect(startBtn, birdsGroup, tableCenter)
        })
    }

    // 合成特效
    _mixingEffect (startBtn, birdsGroup, tableCenter) {
        startBtn.remove() // 移除开始按钮
        let fiveBird = birdsGroup.children // 五鸟数组
        let toCenterNum = 0 // 用于监听五鸟拉向中心动画的完成程度, 达到 5 则动画全部完成

        // 圆盘中心进行旋转
        tableCenter.animate([
            { rotate: 0 },
            { rotate: 360 },
        ], {
            duration: 100,
            iterations: Infinity,
        })

        // 一秒后, 将五鸟拉向中心
        setTimeout(() => {
            fiveBird.forEach( async item => {
                item.children[1].remove() // 移除文字
                // 拉向中心的动画
                await item.transition(0.5).attr({
                    translate: [0, 560 / 2 - 76], // 参数2 为圆半径 同 _createBirdsGroup 函数
                    opacity: 0
                })
                toCenterNum++ // 完成一次动画, 递增一次
                // 达到 5 ,则执行粒子特效
                if (toCenterNum === 5) {
                    // 完成特效, 执行回调函数
                    this._starEffect(this._layer, () => {
                        // 停止动画
                        this._layer.timeline.playbackRate = 0
                        this._mixing = false // 合成完成
                        this._hooks.onMixed && this._hooks.onMixed()
                    })
                }
            })
        }, 1000)
    }

    // 粒子爆炸效果
    _starEffect (base, callback) {
        let { _canvasWidth, _canvasHeight } = this
        let stars = []
        let nums = 0 // 监视完成动画的次数计数器
        let starNum = 100
        // 创建 五十颗星星
        for (let i = 0; i < starNum; i++) {
            let star = new Sprite()
            let sca = Math.random() * 5 // 随机缩放尺寸
            star.attr({
                textures: 'star_effect.png',
                size: [30, 30],
                anchor: 0.5,
                pos: [_canvasWidth / 2, 685],
                scale: sca,
            })
            base.append(star)
            stars.push(star)
        }
        // 遍历星星数组, 随机向四周扩散
        stars.forEach( async item => {
            let tx = Math.floor(Math.random() * (_canvasWidth / 2 - (-_canvasWidth / 2) + 1) + (-_canvasWidth / 2) )
            let ty = Math.floor(Math.random() * (_canvasHeight / 2 - (-_canvasHeight / 2) + 1) + (-_canvasHeight / 2) )
            await item.transition(1).attr({
                translate: [tx, ty],
                scale: 0
            })
            nums++ // 递增
            // nums 达到 总星星全部完成动画, 执行回调函数
            if (nums === starNum && callback) callback()
        })
    }

    // 创建鸟所在组
    _createBirdsGroup () {
        let groupSize = 540 // 外层组的尺寸
        // 圆的半径 和 圆心坐标
        let radius = groupSize / 2 - 90
        let circleCenter = [groupSize / 2, groupSize / 2]

        let birdsOuterGroup = new Group()
        birdsOuterGroup.attr({
            anchor: 0.5,
            size: [groupSize, groupSize + 70],
            pos: [105 + groupSize / 2, 360 + groupSize / 2],
            // border: [1, 'red'],
            rotate: 180
        })

        // 遍历生成鸟
        Object.entries(specialBirdMap).forEach( (item, i) => {
            // 判断 birdList 中 是否存在 对应的 五鸟(mark)
            let isHas = store.state.birdList.some( ele => ele.mark === item[0] )
            let textures = isHas ? `${item[1]}.png` : `${item[1]}_sketch.png`
            isHas && this._fiveNum++
            // 获取对应角度在圆上的坐标
            let x = circleCenter[0] + Math.sin(2 * Math.PI / 360 * (72 * i) ) * radius
            let y = circleCenter[1] + Math.cos(2 * Math.PI / 360 * (72 * i) ) * radius + 80
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
                rotate: 180 - i * 72,
                // border: [1, 'red']
            })
            
            // 创建鸟视图
            let bird = new Sprite()
            bird.attr({
                textures: textures,
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
        return birdsOuterGroup
    }

    // 加载资源
    async _loading () {
        // 监听加载事件, 更新 页面 进度显示
        this._scene.on('preload', (evt) => {
            console.log(`加载中... ${( (evt.loaded.length / evt.resources.length).toFixed(2) ) * 100}%`)
        })
        // 等待 加载完 资源
        await this._scene.preload(...assets.fivefiveopen)
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

export default Fivefiveopen
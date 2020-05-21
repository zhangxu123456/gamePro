// 引入 spriteJs库 对应 模块
import { Scene, Group, Sprite, Label, Resource } from 'spritejs'
// 引入 资源
import assets from './assets'
// 引入 vuex
import store from '@/store/index'
// 引入 ajax 处理函数
import ajax from '@/callServer/ajax/index'
import { Dialog } from 'vant'
import { Music } from './music'

// 判断是为 16:9 还是 18:9 的设备尺寸
let isNewScreen = window.innerHeight / window.innerWidth >= 1.85 // 为 18:9

class BirdGame {
    _scene = null // 场景
    _layer = null // 层
    _birdBox = null // 外层主层容器, 12座鸟所在的 group
    _canvasWidth = 750 // 画布宽
    _canvasHeight = isNewScreen ? 950 : 750 // 画布高, 16:9尺寸的设备 为 750, 18:9 尺寸的设备为 950
    _itemSize = this._canvasWidth / 4 // 单个鸟座的尺寸
    _birdBaseList = [] // 鸟座数组
    _mixing = false // 合成中控制器, 用于控制合成过程中, 不合法的操作
    _moveBird = null // 拖拽鸟的对象
    // _birdGroupList = [] // 鸟组列表, 用于 socket 获取数据时, 展示特效, 这个现在用不着了, 使用 _birdBaseList 完成这个的任务, 2020年1月2日 13:49:41
    // 钩子函数
    _hooks = {
        onRecycle: null, // 回收监听
        onMixed: null, // 合成监听
        onClickBox: null, // 宝箱点击
        onFiveOpen: null, // 五凤合成
    }
    // 初始化
    async init () {
        console.log('初始化监视')
        let { _canvasWidth, _canvasHeight } = this
        let birdBoxHeight = this._itemSize * (isNewScreen ? 4 : 3) // 鸟座外层盒子的高度, 根据 设备的不同设置不同的高度
        // 初始化, 创建 画布场景
        this._scene = new Scene('#gameBox', {
            viewport: ['auto', 'auto'],
            resolution: [_canvasWidth, _canvasHeight]
        })
        this._layer = this._scene.layer()
        // 创建 鸟座外层盒子
        this._birdBox = new Group()
        this._birdBox.attr({
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            width: _canvasWidth,
            height: birdBoxHeight,
            anchor: [1, 1],
            pos: [_canvasWidth, _canvasHeight * 0.85],
            // border: [1, 'green']
        })
        this._layer.append(this._birdBox)
        // 加载 资源
        await this._loading()
        // 创建 鸟底座层 和 飞行宝箱
        this._createBirdBase()
        this._createBox()
    }

    // 钩子函数监听
    listen (hooks) {
        this._hooks = {
            ...hooks
        }
    }

    // 更新 canvas 鸟视图
    updateBirdView () {
        // this._birdGroupList.length = 0 // 清空
        this._birdBaseList.length = 0 // 清空
        this._birdBox.clear() // 清除 鸟座盒子 所有子元素
        this._moveBird && this._moveBird.remove() // 移除移动中的鸟
        this._moveBird = null
        this._createBirdBase() // 重新渲染
    }

    // 弹出金币特效
    async goldEffect (message) {
        let theGroup = null
        // console.log(this._birdBaseList)
        // 遍历 获取 对应 id 的 鸟座, 若不存在, 则终止函数
        theGroup = this._birdBaseList.find( item => {
            return item.$ctx.id === message.id
        })

        if (!theGroup) return false
      let bigBird = new Sprite()

      bigBird.attr({
        textures: `bird_img_${theGroup.$ctx.level}.png`,
        size: [this._itemSize * 0.7, this._itemSize * 0.7],
        pos: [this._itemSize / 2, this._itemSize - 115],
        anchor: 0.5,
      })
      bigBird.transition(0.3).attr({
        scale: 1.3,
        
      })
      setTimeout(function () {
        bigBird.transition(0.3).attr({
          scale: 1,
        })
        setTimeout(function () {
          bigBird.remove()
        }, 300)
      }, 300)
      theGroup.append(bigBird)

        // 多余的 _birdGroupList, 2020年1月2日 13:50:16
        // theGroup = this._birdGroupList.find( item => {
        //     return item.$ctx.id === message.id
        // })
        if (!theGroup) return false
        // 创建 金币
        let goldNum = new Label()
        await Resource.loadTexture({ id: '9scale', src: require('../assets/images/icon/icon_lingqu_small.png') })
        goldNum.attr({
            text: message.gold,
            pos: [this._itemSize / 2, 100],
            // pos: [this._itemSize / 2, 38],
            width: this._itemSize,
            textAlign: 'center',
            font: 'oblique small-caps bold 25px Arial',
            color: 'red',
            anchor: 0.5,
            bgimage: {
                id: '9scale',
                display: 'undefined',
                offset: [50, 0]
            }
            // border: [1, 'red']
        })
        if (parseInt(message.gold) <= 0 ) {
            return
        }
        theGroup.append(goldNum)
        ;(new Music()).play('money')

        // 过渡动画
        await goldNum.transition(2).attr({
            translate: [0, -70],
            scale: 1.2,
            opacity: 1
            // translate: [0, -18],
            // scale: 1.5,
            // opacity: 0.5
        })
        // 移除
        goldNum.remove()
    }
    pushts (level, empindex) {
      let { _itemSize } = this
      let birdnew = new Sprite()
      let basex = -236
      let basey = -502
      if (empindex === 1) {
        basex = basex + 188
      }
      if (empindex === 2) {
        basex = basex + 188 * 2
      }
      if (empindex === 3) {
        basex = basex + 188 ** 3
      }
      if (empindex === 4) {
        basey = basey + 188
      }
      if (empindex === 5) {
        basey = basey + 188
        basex = basex + 188
      }
      if (empindex === 6) {
        basey = basey + 188
        basex = basex + 188 * 2
      }
      if (empindex === 7) {
        basey = basey + 188
        basex = basex + 188 * 3
      }
      if (empindex === 8) {
        basey = basey + 188 * 2
      }
      if (empindex === 9) {
        basey = basey + 188 * 2
        basex = basex + 188
      }
      if (empindex === 10) {
        basey = basey + 188 * 2
        basex = basex + 188 * 2
      }
      if (empindex === 11) {
        basey = basey + 188 * 2
        basex = basex + 188 * 3
      }
      birdnew.attr({
        textures: `bird_img_${level}.png`,
        anchor: [0.5, 0.5],
        pos: [330, 650],
      })
      birdnew.transition(0.3).attr({
        translate: [basex, basey],
        scale: 1,
        opacity: 1
        // translate: [0, -18],
        // scale: 1.5,
        // opacity: 0.5
      })
      setTimeout(function () {
        birdnew.remove()
      }, 1000)
      this._layer.append(birdnew)
    }

    // 创建 鸟座
    _createBirdBase () {
        let { _itemSize } = this
        // 创建 12 个鸟座
        for (let i = 0; i < 12; i++) {
            // 创建鸟座组
            let birdGroup = new Group()
            birdGroup.attr({
                size: [_itemSize, (_itemSize)],
                // border: [1, 'red']
            })
            // 保存 尿座
            // this._birdGroupList.push(birdGroup)
            // 添加鸟座图片
            let birdBase = new Sprite()
            birdBase.attr({
                textures: 'base.png',
                anchor: [1, 1],
                pos: [_itemSize * 0.9, _itemSize],
            })

            // 添加
            birdGroup.append(birdBase)
            this._birdBox.append(birdGroup)

            // 将某些 关系上下文的信息 保存到 $ctx 变量中
            birdGroup.$ctx = {
                id: store.state.birdList[i].id,
                index: i,
                level: store.state.birdList[i].level,
                mark: store.state.birdList[i].mark
            }
            this._birdBaseList.push(birdGroup)
            // 创建 神鸟
            this._createBird(birdGroup, i)
        }
    }

    // 创建 神鸟
    _createBird (birdGroup, index) {
        let info = store.state.birdList[index]
        // 如果 mark 为空, 则中断 函数
        if (!info.mark) return false
        // 创建 神鸟
        let bird = new Sprite()
        bird.attr({
            textures: `bird_img_${info.mark}.png`,
            // size: [this._itemSize * 0.8, this._itemSize * 0.8],
            width: this._itemSize * 0.8,
            anchor: [1, 1],
            pos: [this._itemSize * 0.9, this._itemSize - 40],
            // border: [1, 'red']
        })
         // 将某些 关系上下文的信息 保存到 $ctx 变量中
        bird.$ctx = {
            id: info.id,
            index: index,
            level: info.level,
            img: `bird_img_${info.mark}.png`,
            mark: info.mark,
            receive: info.receive
        }
        // 创建神鸟的等级
        let level = this._createLevel(info.level)

        birdGroup.append(bird)
        birdGroup.append(level)

        // 为神鸟绑定事件
        this._bindEvent(bird)
        // this.goldEffect(bird)
    }

    // 创建 与 神鸟相对应 的 等级UI
    _createLevel (num) {
        // 创建 等级灯笼
        let levelBox = new Group()
        levelBox.attr({
            bgimage: {
                display: 'stretch',
                src: 'levelBox.png'
            },
            anchor: [1, 1],
            size: [this._itemSize * 0.3, this._itemSize * 0.3],
            pos: [this._itemSize - 5, this._itemSize - 10],
        })
        // 创建等级文本
        let level = new Label()
        level.attr({
            text: num,
            size: [this._itemSize * 0.3, this._itemSize * 0.3],
            fillColor: '#bc5b16',
            textAlign: 'center',
            lineHeight: this._itemSize * 0.3,
            font: 'oblique small-caps bold 25px Arial',
        })
        // 将等级添加到等级组中
        levelBox.append(level)
        return levelBox
    }

    // 为每只神鸟绑定事件
    _bindEvent (bird) {
        let { $ctx } = bird
        let moveBird = null // 用于拖拽的鸟
        let startX = -1 // 开始的 x轴 坐标
        let startY = -1 // 开始的 y轴 坐标
        bird.on('touchstart', (evt) => {
            evt.stopDispatch()
            if (this._mixing) return false
            // 获取触碰之时的坐标 并 赋值 初始坐标
            let { x, y } = evt
            startX = x
            startY = y
            // 设置原来鸟的滤镜
            bird.attr({
                filter: {
                    brightness: '20%'
                }
            })
            // 创建用于拖拽的临时鸟
            moveBird = new Sprite()
            moveBird.attr({
                textures: $ctx.img,
                size: [this._itemSize * 0.8, this._itemSize * 0.8],
                pos: [x, y],
                anchor: 0.5,
            })

            this._layer.append(moveBird)
            this._moveBird = moveBird
        })
        bird.on('touchmove', (evt) => {
            evt.stopDispatch()
            if (this._mixing || !moveBird) return false
            // 拖拽鸟
            let { x, y } = evt
            moveBird.attr({
                translate: [x - startX, y - startY]
            })
        })
        bird.on('touchend', async (evt) => {
            evt.stopDispatch()
            if (this._mixing || !moveBird) return false
            let isFuck = false // 用于判断即将合成的鸟是否为雌雄同体
            // 如果 移动到 右下角
            let { _canvasWidth, _canvasHeight, _itemSize } = this
            if ( evt.x > _canvasWidth - _itemSize * 0.4 && evt.y > _canvasHeight - _itemSize * 0.4 ) {
                ;(new Music()).play('back')

                // 执行钩子函数, 传递, 回收的鸟的信息
                this._hooks.onRecycle && this._hooks.onRecycle({
                    id: $ctx.id,
                    index: $ctx.index,
                    receive: $ctx.receive
                })
                // 触碰结束, 移除临时鸟
                moveBird.remove()
                this._moveBird = null
                // 重置滤镜恢复原样
                bird.attr({
                    filter: ''
                })
                return false
            }
            // 碰撞检测
            let collisioned = this._birdBaseList.find( (item) => {
                return moveBird.OBBCollision(item)
            })
            // console.log($ctx)
            // console.log(collisioned.$ctx)
            // 触碰结束, 移除临时鸟
            moveBird.remove()
            // 重置滤镜恢复原样
            bird.attr({
                filter: ''
            })
            // 如果 没有 碰撞对象, 则终止函数
            if (!collisioned) return false
            // 如果碰撞的对象, 拥有相同的 index, 说明为 相同对象, 终止函数
            if (collisioned.$ctx.index === $ctx.index) return false
            // 如果碰撞对象 $ctx 没有 id, 则说明为空位置, 进行移位
            if (!collisioned.$ctx.id) {
                console.log('空位置')
                // 拷贝 拖拽对象在 vuex 中的 信息
                let currentInfo = JSON.parse( JSON.stringify(store.state.birdList[$ctx.index]) )
                // 将 拖拽对象的 信息, 移动到 碰撞的 空位置
                store.commit('updateBirdList', {
                    index: collisioned.$ctx.index,
                    info: currentInfo
                })
                // 清空重置拖拽对象位置的信息
                store.commit('updateBirdList', {
                    index: $ctx.index,
                    info: {
                        id: null,
                        mark: null,
                        income: 0,
                        level: -1,
                        receive: 0,
                    }
                })
                // 更新视图
                this.updateBirdView()
                // 更新 后端数据库中 保存的 数据
				ajax('birdsGroup', {
					type: 1,
					weizhi: JSON.stringify(store.state.birdList)
                })
                return false
            }
            // 如果等级不相等, 则进行移位
            if (collisioned.$ctx.level !== $ctx.level) {
                // console.log('移位')
                let { index: selfIndex } = $ctx
                let { index: collisionedIndex } = collisioned.$ctx
                let { birdList } = store.state
                // 拷贝 拖拽者/被碰撞者 的 数据
                let selfData = JSON.parse( JSON.stringify(birdList[selfIndex]) )
                let collisionedData = JSON.parse( JSON.stringify(birdList[collisionedIndex]) )
                // 置换二者位置上的数据
                store.commit('updateBirdList', {
                    index: selfIndex,
                    info: collisionedData
                })
                store.commit('updateBirdList', {
                    index: collisionedIndex,
                    info: selfData
                })
                // 更新视图
                this.updateBirdView()
                // 更新 后端数据库中 保存的 数据
				ajax('birdsGroup', {
					type: 1,
					weizhi: JSON.stringify(birdList)
                })
                return false
            }
            // 如果碰撞的对象皆为 37 级, 不执行爆炸效果, 直接返回信息, 另作处理
            if ($ctx.level === 37) {
                console.log('37级的合成')
                ;(new Music()).play('make')
                this._toMixing($ctx, collisioned.$ctx, true, isFuck)
                // 获取 被拖拽者的 信息
                // let { id: drapedId, index: drapedIndex } = $ctx
                // // 获取 被碰撞者的 信息
                // let { id: collisionedId, index: collisionedIndex } = collisioned.$ctx
                // // 执行钩子函数, 将碰撞二者的信息传递给 钩子函数外部 进行执行, 第二个参数表示 为 37级合成, 要外部使用不同的处理方式
                // this._hooks.onMixed && this._hooks.onMixed({
                //     drapedId,
                //     collisionedId,
                //     drapedIndex,
                //     collisionedIndex
                // }, true)
                return false
            }
            // 如果拖拽/碰撞的对象有top, 则终止函数
            if (collisioned.$ctx.mark === 'top' || $ctx.mark === 'top') return false
            // 如果拖拽/碰撞的对象为情侣疯, 则终止函数执行
            if ($ctx.level > 37 && ($ctx.mark === 'qinglv' || collisioned.$ctx.mark === 'qinglv' ) ) return false
            // 男女合成, 设置 isFuck 为 true
            if ( ($ctx.mark === 'nan' && collisioned.$ctx.mark === 'nv') || ($ctx.mark === 'nv' && collisioned.$ctx.mark === 'nan') ) {
                console.log('男女合成')
                isFuck = true
            }
            // 如果合成的二者等级超过37级 且 不是 男女合成
            if ( $ctx.level > 37 && !isFuck ) {
                console.log('五凤')
                // console.log(store.state.birdList)
                this._hooks.onFiveOpen && this._hooks.onFiveOpen()
                return false
            }
            // 正常渲染爆炸效果, 执行合成
            this._mixing = true // 设置 状态为 正在合成中
            ;(new Music()).play('make')
            let startEffectPromise = this._starEffect(collisioned)
            let toMixingPromise = this._toMixing($ctx, collisioned.$ctx, null, isFuck)
            await Promise.all([startEffectPromise, toMixingPromise])
            // 3 毫秒后, 重置 _mixing 状态
            setTimeout(() => {
                this._mixing = false
            }, 200)
            // 原来的处理方式
            /* eslint-disable */
            // this._starEffect(collisioned, () => {
            //     console.log('爆炸结束')
            //     // 3毫秒后, 将 _mixing 设置为 true
            //     setTimeout(() => {
            //         this._mixing = false
            //     }, 300)
            //     // console.log($ctx)
            //     // console.log(collisioned.$ctx)
            //     // 获取 被拖拽者的 信息
            //     let { id: drapedId, index: drapedIndex } = $ctx
            //     // 获取 被碰撞者的 信息
            //     let { id: collisionedId, index: collisionedIndex } = collisioned.$ctx
            //     // 执行钩子函数, 将碰撞二者的信息传递给 钩子函数外部 进行执行
            //     this._hooks.onMixed && this._hooks.onMixed({
            //         drapedId,
            //         collisionedId,
            //         drapedIndex,
            //         collisionedIndex
            //     }, null, isFuck)
            // })
        })
    }

    /**
     * 进行合成
     * @param {*} drapedCtx 拖拽者
     * @param {*} collisionedCtx 碰撞者
     * @param {*} isMax 是否是最大等级 37级
     * @param {*} isFuck 是否为男女合成
     */
    async _toMixing (drapedCtx, collisionedCtx, isMax, isFuck) {
        if (!this._hooks.onMixed) {
            Dialog.alert({
                message: 'onMixed 钩子函数必须存在'
            })
            return false
        }
        // 获取 被拖拽者的 信息
        let { id: drapedId, index: drapedIndex } = drapedCtx
        // 获取 被碰撞者的 信息
        let { id: collisionedId, index: collisionedIndex } = collisionedCtx
        // 执行钩子函数, 将碰撞二者的信息传递给 钩子函数外部 进行执行
        let res = await this._hooks.onMixed({
            drapedId,
            collisionedId,
            drapedIndex,
            collisionedIndex
        }, isMax, isFuck)
        return res
    }

    // 合成特效, 粒子爆炸效果
    _starEffect (birdBase, callback) {
        return new Promise( resolve => {
            let { _itemSize } = this
            let stars = []
            let nums = 0 // 监视完成动画的次数计数器
            // const url = './assets/images/bz.png'
            // 创建 五十颗星星
            for (let i = 0; i < 50; i++) {
                let star = new Sprite()
                let sca = Math.random() * 2.8 // 随机缩放尺寸
                // const url = 'http://i1.fuimg.com/717281/5ef28cc96e048888.png';
                star.attr({
                              textures: 'star_effect.png',
                              size: [30, 20],
                              anchor: 0.5,
                              pos: [_itemSize / 2, _itemSize / 2],
                              scale: sca,

                })
                birdBase.append(star)
                stars.push(star)
            }
            // 遍历星星数组, 随机向四周扩散
            stars.forEach( async item => {
                let tx = Math.floor(Math.random() * (65 - (-65) + 1) + (-65) )
                let ty = Math.floor(Math.random() * (65 - (-65) + 1) + (-65) )
                await item.transition(0.26).attr({
                    translate: [tx,ty],
                    scale: 0
                })
                nums++ // 递增
                // nums 达到 总星星全部完成动画, 执行回调函数
                if (nums === 50) {
                    resolve(true)
                }
            })
        })
    }
    // 合成特效, 粒子爆炸效果, 一开始的处理方式, 2020年1月3日 10:37:50
    /* eslint-disable */
    // _starEffect (birdBase, callback) {
    //     let { _itemSize } = this
    //     let stars = []
    //     let nums = 0 // 监视完成动画的次数计数器
    //     // 创建 五十颗星星
    //     for (let i = 0; i < 50; i++) {
    //         let star = new Sprite()
    //         let sca = Math.random() * 2.8 // 随机缩放尺寸
    //         star.attr({
    //             textures: 'star_effect.png',
    //             size: [30, 20],
    //             anchor: 0.5,
    //             pos: [_itemSize / 2, _itemSize / 2],
    //             scale: sca,
    //         })
    //         birdBase.append(star)
    //         stars.push(star)
    //     }
    //     // 遍历星星数组, 随机向四周扩散
    //     stars.forEach( async item => {
    //         let tx = Math.floor(Math.random() * (65 - (-65) + 1) + (-65) )
    //         let ty = Math.floor(Math.random() * (65 - (-65) + 1) + (-65) )
    //         await item.transition(0.25).attr({
    //             translate: [tx, ty],
    //             scale: 0
    //         })
    //         nums++ // 递增
    //         // nums 达到 总星星全部完成动画, 执行回调函数
    //         if (nums === 50 && callback) callback()
    //     })
    // }

    // 创建宝箱
    _createBox () {
        let boxGroup = new Group()
        boxGroup.attr({
            pos: [0, 0],
            border: [1, 'transparent']
        })

        // 创建宝箱是视图
        let leftWing = new Sprite()
        leftWing.attr({
            textures: 'baobox/leftwing.png',
            size: [130, 80],
            pos: [130, 40],
            anchor: [1, 0.5]
        })
        let box = new Sprite()
        box.attr({
            textures: 'baobox/icon_box.png',
            size: [120, 102],
            pos: [100, 0]
        })
        let rightWing = new Sprite()
        rightWing.attr({
            textures: 'baobox/rightwing.png',
            size: [130, 80],
            pos: [200, 40],
            anchor: [0, 0.5]
        })
        // 添加
        boxGroup.append(leftWing, rightWing, box)
        this._layer.append(boxGroup)

        // 为翅膀添加动画
        leftWing.animate([
            { rotate: -5 },
            { rotate: -20 },
            { rotate: -5 },
        ], {
            duration: 1350,
            iterations: Infinity,
        })
        rightWing.animate([
            { rotate: 5 },
            { rotate: 20 },
            { rotate: 5 },
        ], {
            duration: 1350,
            iterations: Infinity,
        })
        // 整体飞行动画
        boxGroup.animate([
            { x: -this._canvasWidth, y: 0 },
            { x: -this._canvasWidth, y: 0 },
            { x: -this._canvasWidth / 2, y: 80 },
            { x: this._canvasWidth * 0.5, y: 0 },
            { x: this._canvasWidth * 1.5, y: 0 },
            { x: this._canvasWidth * 1.5, y: 0 },
        ], {
            duration: 30000,
            iterations: Infinity,
        })

        // 宝箱点击事件
        boxGroup.on('click', (evt) => {
            evt.stopDispatch()
            this._hooks.onClickBox && this._hooks.onClickBox()
        })
    }

    // 加载资源
    async _loading () {
        // 监听加载事件, 更新 页面 进度显示
        this._scene.on('preload', (evt) => {
            console.log(`加载中... ${( (evt.loaded.length / evt.resources.length).toFixed(2) ) * 100}%`)
        })
        // 等待 加载完 资源
        await this._scene.preload(...assets.bird)
    }
}

export default new BirdGame() // 由于 该 游戏 ,在整个页面的生命周期中, 只会初始化一次, 因此, 暴露单例

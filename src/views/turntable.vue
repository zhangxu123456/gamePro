<template>
    <my-overlay>
        <div id="turntable">
            <div id="turntable_top">
                <img id="turntable_title" src="@/assets/images/decoration/img_name_xyzp.png" alt="标题">
                <img @click="$router.back(-1)" id="turntable_close" class="iconBtn closeBtn" src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
            </div>
            <div class="canvas-main">
                <div class="canvas-list" :style="{transform:rotate_angle,transition:rotate_transition}">
                    <div class="canvas-item" :style="{transform: 'rotate('+(index * width)+'deg)', zIndex:index, }" v-for="(iteml,index) in prizeList" :key="index">
                        <div class="canvas-item-text" :style="'transform:rotate('+(index )+')'">
                            <div :class="['con-box',resId == iteml.id ?  'conActive' : '']">
                                <img :src="prizeImg[iteml.mapMark]">
                                <p class="b" style="font-size: 32upx;">{{iteml.name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="canvas-bottom">
                <div class="canvas-b-main">
                    <img  src="@/assets/images/textures/material/turntable/prize_ticket.png">
                    <p>转盘券：{{userInfo.ticket}}</p>
                </div>
                <div class="canvas-b-btn" @click="playReward">
                    <img src="@/assets/images/decoration/btn_qdzp.png">
                </div>
            </div>
        </div>
        <my-prompt :show="promptShow" @confirm="onConfirm">
            <div class="prize_eggs">
                <img class="card_prize" :src="prizeImg[resultIndex]" alt="奖品">
                <span>恭喜获得{{ prizeAmount }}{{ prizeName[resultIndex] }}</span>
            </div>
        </my-prompt>
    </my-overlay>
</template>

<script>
// import Turntable from '@/games/turntable'
import { mapState } from 'vuex'
import { Music } from '@/games/music'

export default {
    name: 'turntable',
    data () {
        return {
            prizeName: ['个金币', '个彩蛋币', '块钱', '个转盘券'], // 奖品名称, 对应 type
            prizeImg: [
                require('@/assets/images/textures/material/turntable/prize_gold.png'),
                require('@/assets/images/textures/material/turntable/prize_egg.png'),
                require('@/assets/images/textures/material/turntable/prize_red_packet.png'),
                require('@/assets/images/textures/material/turntable/prize_ticket.png'),
            ],
            promptShow: false,
            prizeAmount: 0,
            resultIndex: 0, // 得奖奖品标记, 对应 返回的 type

            resId: -1,
            prizeList: [ 
                {
                    name: '',
                    mapMark: 0,
                    img: '',
                    id: 0
                }
            ],
            width: 0,
            animationData: {},
            btnDisabled: '',
            runDeg: 0,
            rotate_angle: 'rotate(0)',
            rotate_transition: 'transform 4s ease-in-out'
        }
    },
    computed: {
        // state 状态
        ...mapState([
            'userInfo'
        ]),
		// 每秒收益
		goldIncreasing: (state) => {
			let gold = 0
			state.birdList.forEach( item => {
				gold += item.income || 0
			})
			return gold
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        async getData () {
            let res = await this.$ajax('turntableList')
            this.prizeList = res
            this.width = 360 / res.length
            // if (!res) return false
            // // 创建 大转盘, 传递奖品数组
            // let game = new Turntable(res)
            // game.listen({
            //     onClose: () => {
            //         this.$router.back(-1)
            //     },
            //     onResult: ({ type, amount }) => {
            //         ;(new Music()).play('panel')
            //         // console.log(info)
            //         this.resultIndex = Number(type)
            //         this.prizeAmount = amount
            //         this.promptShow = true
            //         let ticket = this.userInfo.ticket - 1
            //         // type 0: 金币, 1: 彩蛋币, 2: 现金, 3: 转盘券
            //         if ( type === '3' ) {
            //             ticket = ticket + amount
            //         } else if ( type === '0' ) {
            //             this.$store.commit('updateUserInfo', {
            //                 gold: Number(this.userInfo.gold) + amount
            //             })
            //         }
            //         // 更新票券
            //         this.$store.commit('updateUserInfo', {
            //             ticket: ticket >= 0 ? ticket : 0
            //         })
            //     }
            // })
        },
        onConfirm () {
            ;(new Music()).play('other')

            // 抽中的是彩蛋币, 进行广告
            if (this.resultIndex === 1) {
                this.$nativeApi._watchAD(() => {
                    this.promptShow = false
                })
                return false
            }
            this.promptShow = false
            this.resId = -1
        },
        animation (index) {
            // 中奖index
            let list = this.prizeList
            // var awardIndex = 1 || Math.round(Math.random() * (awardsNum.length - 1)); //随机数
            let runNum = 4 // 旋转8周

            // 旋转角度
            this.runDeg = this.runDeg || 0
            this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - index * (360 / list.length)) + 1
            this.rotate_angle = 'rotate(' + this.runDeg + 'deg)'
            this.btnDisabled = 'disabled'
      },
      // 发起抽奖
      async playReward () {
        ;(new Music()).play('other')
        let res = await this.$ajax('toTurn')
        // this._theResult = res
        console.log(res)
        let type = res.type
        this.prizeList.some( (item, index) => {
            if (item.id === res.id) {
                this.prizeAmount = res.amount
                this.resultIndex = res.type // 保存符合条件的索引
                console.log(index)
                this.animation(index)
                return true
            }
        })
        setTimeout(() => {
            this.resId = res.id
            this.promptShow = true
            let ticket = this.userInfo.ticket - 1
            // type 0: 金币, 1: 彩蛋币, 2: 现金, 3: 转盘券
            if ( type === '3' ) {
                ticket = ticket + res.amount
            } else if ( type === '0' ) {
                this.$store.commit('updateUserInfo', {
                    gold: Number(this.userInfo.gold) + res.amount
                })
            }
            // 更新票券
            this.$store.commit('updateUserInfo', {
                ticket: ticket >= 0 ? ticket : 0
            })
        }, 4000)
      }
    }
}
</script>
<style lang="less" scoped>
#turntable {
    width: 610 / @widthScale;
    height: 1219/ @widthScale;
}
#turntable_top {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    #turntable_title {
        // margin-left: 174 / @widthScale;
        // margin-top: 57 / @widthScale;
        width: 440 / @widthScale;
        height: 200 / @widthScale
    }
    #turntable_close {
        position: absolute;
        right: -30 / @widthScale;
        top: -10 / @heightScale;
    }
}
.canvas-main{
    width: 610 / @widthScale;
    height: 610 / @widthScale;
    background-image: url('~@/assets/images/decoration/img_pop_zp.png');
    background-size: 100% 100%;
    margin-top: -66 / @widthScale;
    z-index: 1;
    position: relative;
}
.canvas-list {
    width: 690 / @widthScale;
    height: 690 / @widthScale;
        position: absolute;
        left: -40 / @widthScale;
        top: -40 / @widthScale;
        z-index: 9999;
    }

    .canvas-item {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        color: #e4370e;
        /* text-shadow: 0 1upx 1upx rgba(255, 255, 255, 0.6); */
    }

    .canvas-item-text {
        position: relative;
        display: block;
        padding-top: 46upx;
        margin: 0 auto;
        text-align: center;
        -webkit-transform-origin: 50% 300upx;
        transform-origin: 50% 300upx;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .canvas-item-text img{
        width: 60 / @widthScale;
        height: auto;
        margin-top: -10 / @widthScale;
    }
    .canvas-item-text p {
        font-size: 0.6rem;
        color: #fff;
    }
    .con-box{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 140 / @widthScale;
        height: 140 / @widthScale;
        background-image: url('~@/assets/images/decoration/img_pop_zpjp.png');
        background-size: 100% 100%;
    }
    .conActive{
        background-image: url('~@/assets/images/decoration/img_pop_zpjped.png');
        background-size: 100% 100%;
    }
    .canvas-bottom{
        margin: 0 auto;
        margin-top: -100 / @widthScale;
        width: 440 / @widthScale;
        height: 400 / @widthScale;
        background-image: url('~@/assets/images/decoration/img_pop_zpdb.png');
        background-size: 100% 100%;
        position: relative;
    }
    .canvas-b-main{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 80 / @widthScale;
        padding-top: 130 / @widthScale;
        >img {
            width: 60 / @widthScale;
            height: 60 / @widthScale;
        }
        >p {
            font-size: 0.6rem;
            color: #fff;
        }
    }
    .canvas-b-btn{
        position: absolute;
        bottom: 50 / @widthScale;
        left: 63 / @widthScale;
        z-index: inherit;
        >img {
            width: 310 / @widthScale;
            height: 140 / @widthScale;
        }
    }
/deep/ #prompt {
    height: 600 / @widthScale;
    #prompt_top {
        height: 90 / @widthScale;
        .prompt_title {
            // margin-top: 17 / @widthScale;
            height: 52 / @widthScale
        }
    }
    .prize_eggs {
        .flex;
        flex-direction: column;
        align-items: center;
        > img.icon_prize {
            width: 80 / @widthScale;
            margin-bottom: 46 / @widthScale;
        }
        > img.card_prize {
            margin-bottom: 46 / @widthScale;
            margin-top: -100 / @widthScale;
            height: 120 / @widthScale;
            width: auto;
        }
        > span {
            color: #6C2127;
            font-weight: bold;
            font-size: 0.9rem;
        }
    }
    #prompt_confirm {
        margin-top: 65 / @widthScale;
    }
}
</style>
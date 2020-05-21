<template>
    <my-overlay>
        <div id="eggs">
             <!-- <div id="eggs_top">
                <img id="eggs_title" src="@/assets/images/decoration/img_name_cd.png" alt="标题">
                <img @click="$router.back(-1)" id="eggs_close" class="iconBtn closeBtn" src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
            </div>
            <div id="contents">
                <div class="item-box">
                    <div class="item" v-for="(item, index) in 9" :key="index" @click="knockEggs">
                        <img src="@/assets/images/textures/material/eggs/img_egg_default.png" alt="金蛋图标">
                    </div>
                </div>
                <p class="eggs-num">次数：{{userInfo.eggsNums}}</p>
            </div> -->
        </div>
        <my-prompt :show="promptShow" @confirm="onConfirm">
            <div class="prize_eggs">
                <img v-if="prizeType === 3" class="card_prize" :src="cardImg" alt="奖品">
                <img v-else class="icon_prize" :src="prizes[currentMark]" alt="奖品">
                <span>恭喜获得<span v-show="prizeAmount">{{prizeAmount}}个</span>{{ prizeName }}</span>
            </div>
        </my-prompt>
    </my-overlay>
</template>

<script>
import Eggs from '@/games/eggs'
import { mapState } from 'vuex'
import { Music } from '../games/music'

export default {
    name: 'eggs',
    data () {
        return {
            promptShow: false,
            // 奖品图片映射
            prizes: {
                '0': require('@/assets/images/textures/material/eggs/icon_gold.png'),
                '1': require('@/assets/images/textures/material/eggs/icon_cdb.png'),
                '2': require('@/assets/images/textures/material/eggs/red_pag.png'),
                '3': require('@/assets/images/textures/material/eggs/icon_draft.png'),
            },
            prizeName: '',
            prizeAmount: 0,
            prizeType: -1,
            currentMark: '', // 当前中奖映射
            cardImg: '', // 卡片稿子图片
            eggs: null, // 游戏对象
        }
    },
    computed: {
        ...mapState([
            'birdList',
            'userInfo',
            'shopData'
        ]),
    },
    mounted () {
        this.gameInit()
    },
    methods: {
        gameInit () {
            ;(new Music()).play('other')

            let eggs = new Eggs()
            this.eggs = eggs
            // 关闭钩子函数
            eggs.listen({
                // 关闭按钮钩子函数
                onClose: () => {
                    this.$router.back(-1)
                },
                // 敲蛋钩子函数
                onBreaked: (info) => {
                    // console.log(info)
                    // 提取数据, 奖品名称, 奖品的映射标志
                    let { prizeName, prizeMark, cardImg, amount, type } = info
                    this.prizeName = prizeName
                    this.prizeType = type // 0 金币 1 彩蛋币 2 现金 3 卡片稿子
                    this.currentMark = Number(prizeMark)
                    this.cardImg = cardImg
                    this.prizeAmount = amount
                    // 更新 vuex 中的 次数
                    let { userInfo } = this.$store.state
                    let num = userInfo.eggsNums - 1
                    num >= 0 && this.$store.commit('updateUserInfo', {
                        eggsNums: num
                    })
                    // 300毫秒后, 展示提示, 让子弹飞一会
                    setTimeout(() => {
                        this.$nativeApi._watchAD( async () => {
                            this.promptShow = true
                            // 如果类型为金币, 则更新金币数量
                            if (type === 0) {
                                this.$store.commit('updateUserInfo', {
                                    gold: userInfo.gold + amount
                                })
                            }
                        })
                    }, 300)
                }
            })
        },
        onConfirm () {
            this.promptShow = false
            // 重新刷新 砸蛋 canvas 视图
            this.eggs.resetEggsView()
        },
        knockEggs () {
            
        }
    }
}
</script>
<style lang="less" scoped>
#eggs {
    height: 100vh;
    width: 100vw;
    // background-image: url('~@/assets/images/decoration/bg_img_cd.png');
    // background-size: 100% 100%;
    // width: 585 / @widthScale;
    // height: 780 / @widthScale;
    // box-sizing: border-box;
}
#eggs_top {
    position: relative;
    height: 110 / @widthScale;
    display: flex;
    justify-content: center;
    align-items: center;
    #eggs_title {
        // margin-left: 247 / @widthScale;
        // margin-top: 57 / @widthScale;
        width: 108 / @widthScale;
        height: 58 / @widthScale
    }
    #eggs_close {
        position: absolute;
        left: 541 / @widthScale;
        top: 34 / @heightScale;
    }
}
#contents {
    width: 585 / @widthScale;
    height: 700 / @widthScale;
    // margin: 0 57 / @widthScale;
    // margin-top: 50 / @heightScale;
   overflow: hidden;
    div.item-box{
         .flex;
        flex-wrap: wrap;
        margin-top: 10 / @widthScale;
        padding: 0 49 / @widthScale;
        box-sizing: border-box;
    }
    div.item  {
        .flex;
        justify-content: center;
        align-items: center;
        margin: 10 / @widthScale;
        > img {
            width: 142 / @widthScale;
            height:160 / @widthScale;
        }  
    }
    .eggs-num{
        width: 100%;
        text-align: center;
        line-height: 80 / @widthScale;
        color: #fff;
        font-size: 0.9rem;
        font-weight: bold;
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
        width: 180 / @widthScale;
    }
    > span {
        color: #6C2127;
        font-weight: bold;
        font-size: 0.9rem;
    }
}
</style>
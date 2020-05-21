<template>
    <my-overlay>
        <div id="fivefiveopen"></div>
        <!-- 五五开提醒 -->
		<my-prompt :show="promptShow" @confirm="onConfirm">
            <div class="prize_eggs">
                <img class="card_prize" src="@/assets/images/bird/bird_img_top.png" alt="鸟">
                <span>恭喜获得{{ specialBirdNames['top'] }}</span>
            </div>
        </my-prompt>
    </my-overlay>
</template>

<script>
import { mapState } from 'vuex'
import Fivefiveopen from '@/games/fivefiveopen'
import game from '@/games/bird'

export default {
    name: 'fivefiveopen',
    data: () => {
        return {
            promptShow: false,
        }
    },
    computed: {
        // state 状态
        ...mapState([
            'birdList',
            'specialBirdNames'
        ])
    },
    mounted () {
        this.getData()
    },
    methods: {
        getData () {
            let fivefiveopen = new Fivefiveopen()
            fivefiveopen.listen({
                onClose: () => {
                    this.$router.back(-1)
                },
                // 开始合成
                onMixing: async () => {
                    // console.log('开始合成')
                    let res = await this.$ajax('fivefiveopen')
                    if (!res) return false
                    let { bird, del } = res
                    // console.log(res)
                    // 深拷贝 鸟数组, 将鸟数组中 id 与 del 数组相同的元素, 全部重置
                    let birdList = JSON.parse( JSON.stringify(this.birdList) )
                    del.forEach( id => {
                        birdList.some( item => {
                            if (item.id === id) {
                                item.id = null
                                item.mark = null
                                item.income = 0
                                item.level = -1
                                return true
                            }
                        })
                    })
                    // 将新获得的 大鸟 添加到 空位置
                    birdList.some( item => {
                        if (!item.id) {
                            let { id, level, typeName, income } = bird
                            item.id = id
                            item.mark = typeName
                            item.income = income
                            item.level = level
                            return true
                        }
                    })
                    // 重置 后端以及vuex 保存的 bird 信息
                    await this.$ajax('birdsGroup', {
                        type: 1,
                        weizhi: JSON.stringify(birdList)
                    })
                    this.$store.commit('initBirdList', birdList)
                    // 更新 canvas 视图
                    game.updateBirdView()
                },
                // 合成完成
                onMixed: () => {
                    // console.log('合成完成')
                    this.promptShow = true
                }
            })
        },
        // 提醒确认
        onConfirm () {
            this.promptShow = false
            this.$router.replace({
                path: '/'
            })
        }
    }
}
</script>
<style lang="less" scoped>
#fivefiveopen {
    height: 100vh;
    width: 100vw;
}
.prize_eggs {
    .flex;
    flex-direction: column;
    align-items: center;
    > img.card_prize {
        margin-bottom: 46 / @widthScale;
        margin-top: -100 / @widthScale;
        width: 36vw;
    }
    > span {
        color: #6C2127;
        font-weight: bold;
        font-size: 0.9rem;
    }
}
</style>
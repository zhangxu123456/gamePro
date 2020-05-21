<template>
    <my-overlay>
        <div id="mixing"></div>
        <my-prompt :show="promptShow" @confirm="onConfirm">
            <div class="prize_eggs">
                <img class="card_prize" :src="$birdList.special[mark].normal" alt="鸟">
                <span>恭喜获得{{ birdName }}</span>
            </div>
        </my-prompt>
    </my-overlay>
</template>

<script>
import Mixing from '@/games/mixing'
import birdGame from '@/games/bird'

export default {
    name: 'mixing',
    data () {
        return {
            promptShow: false,
            mark: 'jin',
            birdName: '',
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        async getData () {
            let { did, cid, dindex, cindex } = this.$route.query
            // 创建游戏, 传递数据
            let mixing = new Mixing({
                drapedId: did,
                collisionedId: cid,
                drapedIndex: dindex,
                collisionedIndex: cindex
            })
            mixing.listen({
                onClose: () => {
                    this.$router.back(-1)
                },
                // 合成完成钩子函数
                onFinished: (data) => {
                    // console.log('完成钩子')
                    // console.log(data)
                    let { levelName, mark } = data
                    this.mark = mark
                    this.birdName = levelName
                    // 更新游戏视图
                    birdGame.updateBirdView()
                    // 弹出提示框
                    this.promptShow = true
                    // 重置获取图鉴数据
                    this.$store.dispatch('getPictorialBook')
                }
            })
        },
        // 提示确定
        onConfirm () {
            // 隐藏提示, 跳转路由
            this.promptShow = false
            this.$router.replace({
                path: '/'
            })
        }
    }
}
</script>
<style lang="less" scoped>
#mixing {
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
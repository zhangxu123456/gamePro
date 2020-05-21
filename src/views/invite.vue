<template>
    <my-overlay>
        <div id="invite">
            <div id="invite_top">
                <img id="invite_title" src="@/assets/images/decoration/img_name_yqq.png" alt="标题">
                <img @click="reBack()" id="invite_close" class="iconBtn closeBtn" src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
            </div>
            <div id="directions">
                <p>
                    <img src="@/assets/images/icon/icon_ticket.png" alt="邀请券图标">
                </p>
                <p>
                    我的邀请券: {{ userInfo.invitedTicket }} 张
                </p>
                <p>
                    一张邀请券=1名有效好友
                </p>
            </div>
            <van-divider :style="{ borderColor: '#B9985D', padding: '0 0.9rem', margin: '8.3rem 0 2.3rem' }"/>
            <div id="shareIconBox">
                <p>
                    <img @click="share(0)" class="iconBtn" src="@/assets/images/icon/icon_wx.png" alt="图标">
                    <span>微信</span>
                </p>
                <p>
                    <img @click="share(1)" class="iconBtn" src="@/assets/images/icon/icon_pyq.png" alt="图标">
                    <span>朋友圈</span>
                </p>
                <p>
                    <img @click="share(2)" class="iconBtn" src="@/assets/images/icon/icon_wb.png" alt="图标">
                    <span>微博</span>
                </p>
                <p>
                    <img @click="share(3)" class="iconBtn" src="@/assets/images/icon/icon_qq.png" alt="图标">
                    <span>QQ</span>
                </p>
                <p>
                    <img @click="share(4)" class="iconBtn" src="@/assets/images/icon/icon_qqkj.png" alt="图标">
                    <span>QQ空间</span>
                </p>
            </div>
        </div>
    </my-overlay>
</template>

<script>
import { mapState } from 'vuex'
import config from '@/callServer/config'
import { Music } from '@/games/music.js'

export default {
    name: 'invite',
    data () {
        return {
            birdImgs: this.$birdList.normal, // 鸟图片数组
            specialBird: this.$birdList.special,
        }
    },
    // state 状态
    computed: {
        ...mapState([
            'userInfo'
        ]),
    },
    mounted () {
        // 调用底部广告方法
        // window.webkit && window.webkit.messageHandlers.showBannerAd.postMessage('')
        ;(new Music()).play('other')
        this.$nativeApi._bottomAD()
    },
    methods: {
        /**
         * @param {*} index // 0: 微信, 1: 朋友圈, 2: 微博, 3: QQ, 4: QQ空间 
         */
        share (type) {
            // 调用原生的方法, 进行操作
            // window.webkit && window.webkit.messageHandlers.shareAction.postMessage(type)
            let img = this.birdImgs[this.userInfo.level - 1] || this.specialBird[this.userInfo.birdType].normal
            let imgUrl = `http://${config.hostname}/game/${img}`
            // 从 vuex 中 提取 分享链接, 以及分享内容
            let { setting, levelName } = this.userInfo
            let { shareLink, shareContent } = setting
            // 将 等级名 拼接成 分享 标题
            let title = `我养了一只${levelName},你也来试试?`
            this.$nativeApi._share({
                type,
                img: imgUrl,
                link: shareLink,
                content: shareContent,
                title
            })
        },
        // 返回
        reBack () {
            // this.$nativeApi.reloadView()
            this.$nativeApi._closeBannerAd() // 关闭底部广告
            this.$router.back(-1)
        }
    }
}
</script>
<style lang="less" scoped>
#invite {
    background-image: url('~@/assets/images/decoration/bg_img_invite.png');
    background-size: 100% 100%;
    width: 610 / @widthScale;
    height: 934 / @widthScale;
    box-sizing: border-box;
}
#invite_top {
    position: relative;
    height: 136 / @widthScale;
    display: flex;
    justify-content: center;
    align-items: center;
    #invite_title {
        // margin-left: 222 / @widthScale;
        // margin-top: 57 / @widthScale;
        width: 167 / @widthScale;
        height: 64 / @widthScale
    }
    #invite_close {
        position: absolute;
        left: 542 / @widthScale;
        top: 34 / @heightScale;
    }
}
#directions {
    text-align: center;
    p:first-child {
        img {
            width: 89 / @widthScale;
            height: 78 / @widthScale;
            margin-top: 90 / @widthScale;
        }
    }
    > p:nth-child(2) {
        color: #a5280c;
        font-weight: bold;
        font-size: 1.2rem;
        margin-top: 21 / @widthScale;
    }
    > p:nth-child(+3) {
        color: #AFA179;
        font-size: 0.9rem;
        margin-top: 21 / @widthScale;
    }
}
#shareIconBox {
    .flex;
    justify-content: space-around;
    padding: 0 1rem;
    box-sizing: border-box;
    > p {
        .flex;
        flex-direction: column;
        align-items: center;
        > img {
            width: 60 / @widthScale;
            height: 60 / @widthScale;
            margin-bottom: 20 / @widthScale;
        }
        > span {
            color: #fff;
            font-size: 0.7rem;
        }
    }
}
</style>
<template>
    <my-overlay>
        <div id="ranking">
            <div id="ranking_top">
                <img id="ranking_title" src="@/assets/images/decoration/img_name_phb.png" alt="标题">
                <img @click="$router.back(-1)" id="ranking_close" class="iconBtn closeBtn" src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
            </div>
            <my-drap id="contents">
                <div id="userSelf" class="item">
                    <p class="rank">
                        <span>{{ user.ranking }}</span>
                    </p>
                    <p>
                        <img class="avatar" :src="user.avatar || require('@/assets/images/def_ava.jpg')" alt="头像">
                    </p>
                    <p>
                        <span>{{ user.name }}</span>
                        <span>{{ user.levelName }} LV.{{ user.level }}</span>
                    </p>
                    <p>
                        <img class="goldIcon" src="@/assets/images/icon/icon_jinbi.png" alt="金币图标">
                        <span>
                            {{ $translateNumer(user.gold || 0) }}
                        </span>
                    </p>
                </div>
                <div class="item" v-for="(item, index) in list" :key="index">
                    <p>
                        <span v-if="index < 3">
                            <img class="rank_tap_icon" :src="rankTap[index]" alt="排行图标">
                        </span>
                        <span v-else>{{ index + 1 }}</span>
                    </p>
                    <p>
                        <img class="avatar" :src="item.avatar || require('@/assets/images/def_ava.jpg')" alt="头像">
                    </p>
                    <p>
                        <span>{{ item.name }}</span>
                        <span>{{ item.levelName }} LV.{{ item.level }}</span>
                    </p>
                    <p>
                        <img class="goldIcon" src="@/assets/images/icon/icon_jinbi.png" alt="金币图标">
                        <span>
                            {{ $translateNumer(item.gold || 0) }}
                        </span>
                    </p>
                </div>
            </my-drap>
            <div id="inviteBtnBox" class="iconBtn">
                <p @click="show = true">
                    <img src="@/assets/images/icon/btn_yqhy.png" alt="按钮图片">
                    <span>邀请好友</span>
                </p>
            </div>
        </div>
        <van-popup
        id="share"
        round
        v-model="show"
        position="bottom"
        >
            <div>
                邀请卡已准备好, 发给好友吧
            </div>
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
        </van-popup>
    </my-overlay>
</template>

<script>
import config from '@/callServer/config'

export default {
    name: 'ranking',
    data () {
        return {
            show: false, // 弹出层
            rankTap: [
                require('@/assets/images/icon/icon_one.png'),
                require('@/assets/images/icon/icon_two.png'),
                require('@/assets/images/icon/icon_three.png'),
            ],
            list: [],
            user: {},
            birdImgs: this.$birdList.normal, // 鸟图片数组
            specialBird: this.$birdList.special, // 特殊鸟
        }
    },
    mounted () {
            this.getData()
    },
    methods: {
        async getData () {
            let res = await this.$ajax('ranking')
            console.log(res + 1)
            if (!res) return false
            // console.log(res)
            let { list, userInfo } = res
            this.list = list
            this.user = userInfo
        },
        // 分享
        share (type) {
            // 调用原生的方法, 进行操作
            // window.webkit && window.webkit.messageHandlers.shareAction.postMessage(type)
            let userInfo = this.$store.state.userInfo
            let img = this.birdImgs[userInfo.level - 1] || this.specialBird[userInfo.birdType].normal
            let imgUrl = `http://${config.hostname}/game/${img}`
            // 从 vuex 中 提取 分享链接, 以及分享内容
            let { setting, levelName } = this.$store.state.userInfo
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
            this.show = false
        }
    }
}
</script>
<style lang="less" scoped>
#ranking {
    background-image: url('~@/assets/images/decoration/img_pop_rank.png');
    background-size: 100% 100%;
    width: 610 / @widthScale;
    height: 1219/ @widthScale;
}
#ranking_top {
    position: relative;
    height: 110 / @widthScale;
    display: flex;
    justify-content: center;
    align-items: center;
    #ranking_title {
        // margin-left: 174 / @widthScale;
        // margin-top: 57 / @widthScale;
        width: 264 / @widthScale;
        height: 64 / @widthScale
    }
    #ranking_close {
        position: absolute;
        left: 556 / @widthScale;
        top: 26 / @heightScale;
    }
}
#contents {
    width: 527 / @widthScale;
    height: 856.375 / @widthScale;
    margin-left: 53 / @widthScale;
    margin-top: 43 / @heightScale;
    overflow: hidden;
    div.item {
        .flex;
        padding: 0.5rem 0.65rem;
        box-sizing: border-box;
        color: red;
        border: 1px solid transparent;
        .avatar {
            width: 70 / @widthScale;
            height: 70 / @widthScale;
            border-radius: 3px;
            border: 1px solid #784421;
        }
        .goldIcon {
            width: 36 / @widthScale;
            height: 36 / @widthScale;
        }
        > p:first-child {
            .flex;
            align-items: center;
            > span {
                .flex;
                .font_akb;
                align-items: center;
                justify-content: center;
                width: 35 / @widthScale;
                font-size: 1rem;
                border: 1px solid transparent;
                font-weight: bold;
                img.rank_tap_icon  {
                    width: 41 / @widthScale;
                    height: 65.19 / @widthScale;
                }
            }
        }
        > p:nth-child(2) {
            .flex;
            align-items: center;
            justify-content: center;
            width: 85 / @widthScale;
            height: 85 / @widthScale;
            background-image: url('~@/assets/images/decoration/content_bg_head.png');
            background-size: 100% 100%;
            margin-right: 0.5rem;
            margin-left: 0.5rem;
        }
        > p:nth-child(3) {
            .flex;
            flex-grow: 1;
            flex-direction: column;
            justify-content: space-around;
            width: 5rem;
            > span:first-child {
                .overflow_ellipsis_multiLine(1);
                font-size: 0.85rem;
            }
            > span:nth-child(2) {
                font-size: 0.5rem;
                font-weight: bold;
            }
        }
        > p:nth-child(4) {
            .flex;
            align-items: center;
            width: 5rem;
            overflow: hidden;
            > span {
                .font_akb;
                position: relative;
                top: 2px;
                margin-left: 3px;
            }
        }
    }
    div#userSelf {
        background-image: url('~@/assets/images/decoration/self_rank_bg.png');
        background-size: 100% 100%;
        border: 1px solid #784421;
        border-radius: 5px;
        .rank{
            span{
                display: inline-block;
                width: 40 / @widthScale;
                height: 40 / @widthScale;
                background:#F4D426;
                color: #5F3003;
                border-radius: 50%;
                line-height: 40 / @widthScale;
                text-align: center;
            }
        }
        // > p:first-child {
        //     > span {
        //         width: 40 / @widthScale;
        //         height: 40 / @widthScale;
        //         box-sizing: border-box;
        //         background-color: #FFEDAE;
        //         border: 1px solid #784421;
        //         border-radius: 50%;
        //         font-size: 0.65rem;
        //     }
        // }
        // > p:nth-child(2) {
        //     margin-left: 5px;
        // }
    }

}
#inviteBtnBox {
    width: 100%;
    margin-top: 0.75rem;
    > p {
        width: 179 / @widthScale;
        height: 98 / @widthScale;
        margin: 0 auto;
        position: relative;
        img {
            width: 179 / @widthScale;
            height: 98 / @widthScale;
        }
        span {
            .text_outer_order;
            position: absolute;
            display: block;
            width: 100%;
            height: 90 / @widthScale;
            top: 0;
            // margin-top: -45 / @widthScale;
            text-align: center;
            font-size: 0.9rem;
            color: white;
            text-shadow: #000 1px 1px 2px;
            line-height: 90 / @widthScale;
        }
    }
}
#share {
    padding-bottom: 2rem;
    > div:first-child {
        margin: 2rem 0;
        text-align: center;
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
                color: #6C2127;
                font-size: 0.7rem;
            }
        }
    }
}

</style>

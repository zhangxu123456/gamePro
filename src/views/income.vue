<template>
    <my-overlay>
        <div id="income">
            <div id="income_top">
                <img id="income_title" src="@/assets/images/decoration/img_name_income.png" alt="标题-恭喜换的">
                <img @click="$router.back(-1)" id="income_close" class="iconBtn closeBtn" src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
            </div>
            <div id="income_goldIcon">
                <img src="@/assets/images/decoration/img_gold.png" alt="金币图标">
            </div>
            <div id="income_goldNum">
                {{ $translateNumer(money) }}
            </div>
            <div id="income_confirm" class="iconBtn" v-if="false">
                <img src="@/assets/images/icon/btn_yqhy.png" alt="按钮">
                <span>确定</span>
            </div>
            <div id="offIncome_confirm" v-if="type === 'video' && !outer.isReback">
                <div class="iconBtn" @click="confirm()">
                    <span>确定</span>
                </div>
                <div class="iconBtn" @click="watchAD()">
                    <img src="@/assets/images/icon/icon_play.png" alt="视频图标">
                    <span>观看视频翻倍</span>
                </div>
            </div>
            <div id="recycle_confirm" v-if="outer.isReback">
                <!-- <div class="iconBtn cancel">
                    <span>取消</span>
                </div> -->
                <div class="iconBtn confirm" @click="confirm()">
                    <span>确定</span>
                </div>
            </div>
            <footer>
                每天凌晨0点整刷新视频次数(剩余{{ $store.state.userInfo.videoAmount }}次)
            </footer>
        </div>
    </my-overlay>
</template>

<script>
export default {
    name: 'income',
    props: ['type'],
    data () {
        return {
            money: '',
            outer: {
                logid: '', // 广告ID
                isReback: false, // 看完广告返回了
            },
        }
    },
    mounted () {
        this.getData()
        // this.bindNativeHook()
    },
    methods: {
        // 获取数据
        async getData () {
            let res = await this.$ajax('onlinePrize')
            if (!res) return false
            let { money, onlineTime, id } = res
            this.money = money
            this.outer.logid = id
            // 更新用户的金币数量
            this.$store.commit('updateUserInfo', {
                gold: Number(this.$store.state.userInfo.gold) + Number(money)
            })
            // 重置 vuex
            this.$store.commit('resetCountdownTime', {
                onlineTime
            })
        },
        // 原生钩子绑定
        bindNativeHook () {
            // 广告观看完毕钩子函数, 原来的处理方式, 2019年12月27日 14:23:34
            // nativeHook.adWatched = async () => {
            //     try {
            //         let res = await this.$ajax('watchedVideo', {
            //             logid: this.outer.logid
            //         })
            //         if (!res) return false
            //         let { money } = res
            //         this.outer.isReback = true
            //         // 更新用户的金币数量
            //         this.$store.commit('updateUserInfo', {
            //             gold: Number(this.$store.state.userInfo.gold) + Number(money)
            //         })
            //     } catch (err) {
            //         this.$dialog.alert({
            //             message: err
            //         })
            //     }
            // }
        },
        // 确认返回
        confirm () {
            this.$router.replace({
                path: '/'
            })
        },
        // 观看广告
        watchAD () {
            // window.webkit && window.webkit.messageHandlers.showVideoAd.postMessage('')
            console.log('观看广告')
            this.$nativeApi._watchAD( async () => {
                try {
                    this.outer.isReback = true
                    let res = await this.$ajax('watchedVideo', {
                        logid: this.outer.logid
                    })
                    if (!res) return false
                    let { money } = res
                    // 更新用户的金币数量
                    this.$store.commit('updateUserInfo', {
                        gold: Number(this.$store.state.userInfo.gold) + money
                    })
                } catch (err) {
                    this.$dialog.alert({
                        message: err
                    })
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
#income {
    background-image: url('~@/assets/images/decoration/img_pop_userInfo.png');
    background-size: 100% 100%;
    width: 585 / @widthScale;
    height: 877.5 / @widthScale;
}
#income_top {
    position: relative;
    #income_title {
        margin-left: 207 / @widthScale;
        margin-top: 25.25 / @widthScale;
        width: 180 / @widthScale;
        height: 54 / @widthScale;
    }
    #income_close {
        position: absolute;
        left: 527 / @widthScale;
        top: 14 / @heightScale;
    }
}
#income_goldIcon {
    text-align: center;
    margin-top: 113 / @widthScale;
    > img {
        width: 407 / @widthScale;
        position: relative;
        left: 0.4rem;
    }
}
#income_goldNum {
    .font_akb;
    background-color: #DBBC85;
    color: #784421;
    border: 1px solid rgba(185,152,93,1);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    width: 360 / @widthScale;
    height: 69.84 / @widthScale;
    line-height: 69.84 / @widthScale;
    padding-top: 0.6px;
    margin: 0 auto;
    margin-top: 50 / @widthScale;
    text-align: center;
    font-weight: bold;
    font-size: 1.25rem;
    box-sizing: border-box;
}
#income_confirm {
    position: relative;
    width: 220 / @widthScale;
    height: 89 / @widthScale;
    margin: 0 auto;
    margin-top: 69 / @widthScale;
    > img {
        width: 100%;
        height: 100%;
    }
    > span {
        .text_outer_order;
        display: inline-block;
        position: absolute;
        width: 100%;
        left: 83 / @widthScale;
        top: 25 / @widthScale;
        color: white;
        font-size: 0.9rem;
    }
}
#offIncome_confirm {
    .flex;
    justify-content: space-around;
    margin-top: 53 / @widthScale;
    padding: 0 1rem;
    > div {
        .flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        font-size: 0.8rem;
        padding-bottom: 0.35rem;
    }
    > div:first-child {
        width: 159 / @widthScale;
        height: 89 / @widthScale;
        background-image: url('~@/assets/images/icon/btn_yqhy.png');
        background-size: 100% 100%;
        text-align: center;
        > span {
            .text_outer_order;
            color: white;
        }
    }
    > div:nth-child(2) {
        width: 247 / @widthScale;
        height: 89 / @widthScale;
        background-image: url('~@/assets/images/icon/btn_yqhy.png');
        background-size: 100% 100%;
        > img {
            width: 33 / @widthScale;
            height: 33 / @widthScale;
            margin-right: 0.2rem;
        }
        > span {
            .text_outer_order;
            color: white;
        }
    }
}
#recycle_confirm {
    .flex;
    justify-content: space-around;
    margin-top: 53 / @widthScale;
    padding: 0 1rem;
    > div {
        .flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        font-size: 0.8rem;
        padding-bottom: 0.35rem;
    }
    > div.cancel {
        width: 220 / @widthScale;
        height: 89 / @widthScale;
        background-image: url('~@/assets/images/icon/btn_yqhy_death.png');
        background-size: 100% 100%;
        text-align: center;
        padding-right: 2px;
        box-sizing: border-box;
        > span {
            .text_outer_order;
            color: white;
        }
    }
    > div.confirm {
        width: 220 / @widthScale;
        height: 89 / @widthScale;
        background-image: url('~@/assets/images/icon/btn_yqhy.png');
        background-size: 100% 100%;
        > span {
            .text_outer_order;
            color: white;
        }
    }
}
footer {
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #784421;
}
</style>
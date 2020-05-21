<template>
    <my-overlay>
        <div id="userInfo">
            <div id="userInfo_top">
                <img id="userInfo_title" src="@/assets/images/decoration/img_name_sn.png" alt="标题">
                <img @click="$router.back(-1)" id="userInfo_close" class="iconBtn closeBtn" src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
            </div>
            <div id="detail_info">
                <div>
                    <img 
                    :src="birdImgs[userInfo.level - 1] || specialBird[userInfo.birdType].normal" 
                    alt="鸟"
                    >
                </div>
                <div>
                    {{ userInfo.name }}({{ userInfo.levelName }})
                </div>
                <div>
                    <p>
                        <span><img src="@/assets/images/icon/icon_gold.png" alt=""><div>{{ $translateNumer(userInfo.onlineIncome) }}</div></span>
                        <span>在线金币</span>
                    </p>
                    <p>
                        <span><img src="@/assets/images/icon/icon_gold.png" alt=""><div>{{ $translateNumer(userInfo.offlineIncome) }}</div></span>
                        <span>离线金币</span>
                    </p>
                </div>
            </div>
            <van-divider :style="{ borderColor: '#B9985D', padding: '0 0.85rem', margin: '1.2rem 0' }" />
            <div id="setting">
                <h3>游戏设置</h3>
                <div id="offlineRing">
                    <p>
                        <span>离线金币奖励通知</span>
                        <span>离线2小时后触发提醒功能</span>
                    </p>
                    <p>
                        <van-switch v-model="offlineRing" size="1.2rem" active-color="#EEA22B" inactive-color="#fff" />
                    </p>
                </div>
                <van-divider :style="{ borderColor: '#B9985D' }" />
                <div id="hasMusic">
                    <p>音效</p>
                    <p>
                        <van-switch v-model="hasMusic" size="1.2rem" active-color="#EEA22B" inactive-color="#fff" />
                    </p>
                </div>
            </div>
        </div>
    </my-overlay>
</template>

<script>
import { mapState } from 'vuex'
import { Music } from '../games/music'

export default {
    name: 'userInfo',
    data () {
        return {
            offlineRing: true, // 离线提醒
            hasMusic: true, // 音效
            birdImgs: this.$birdList.normal,
            specialBird: this.$birdList.special,
        }
    },
    // state 状态
    computed: {
        ...mapState([
            'userInfo',
        ]),
    },
    mounted () {
        localStorage.setItem('play', 'OK')
        console.log(localStorage.getItem('play'))
        ;(new Music()).play('other')
    },
}
</script>
<style lang="less">
#userInfo {
    background-image: url('~@/assets/images/decoration/img_pop_userInfo.png');
    background-size: 100% 100%;
    width: 610 / @widthScale;
    height: 1219 / @widthScale;
}
#userInfo_top {
    position: relative;
    display: flex;
    height: 140 / @widthScale;
    justify-content: center;
    align-items: center;
    #userInfo_title {
        // margin-left: 197 / @widthScale;
        // margin-top: 57 / @widthScale;
        width: 216 / @widthScale;
        height: 64 / @widthScale;
    }
    #userInfo_close {
        position: absolute;
        left: 552 / @widthScale;
        top: 34 / @heightScale;
    }
}
#detail_info {
    margin-top: 585 / @widthScale * 0.09;
    > div {
        margin: 0 auto;
    }
    > div:first-child {
        width: 260 / @widthScale;
        margin-bottom: 0.5rem;
        > img {
            width: 100%;
            height: 100%;
        }
    }
    > div:nth-child(2) {
        background-image: url('~@/assets/images/decoration/img_title.png');
        background-size: 100% 100%;
        width: 344 / @widthScale;
        height: 76 / @widthScale;
        line-height: 76 / @widthScale;
        text-align: center;
        box-sizing: border-box;
        // padding-top: 31.5 / @widthScale;
        font-weight: bold;
        color: #fff;
        margin-bottom: 0.8rem;
    }
    > div:nth-child(3) {
        .flex;
        align-items: center;
        background-color: #DBBC85;
        border: 1px solid #B9985D;
        box-shadow:0px 0px 5px 0px rgba(0, 0, 0, 0.3);
        border-radius:5px;
        width: 518 / @widthScale;
        height: 141 / @widthScale;
        padding-top: 1.5px;
        background: rgba(219,188,133,.8);
        > p {
            .flex;
            flex-direction: column;
            align-items: center;
            width: 50%;
            > span:first-child {
                .flex;
                color: #62401a;
                font-weight: bold;
                font-size: 0.85rem;
                margin-bottom: 2px;
                img{
                     width: 38 / @widthScale;
                    height: 38 / @widthScale;
                }
                div{
                    // background: rgba(0, 0, 0, 0.3);
                    padding: 1vw 2vw;
                    // border-radius: 0 3vw 3vw 0;
                }
            }
            > span:nth-child(2) {
                font-size: 0.8rem;
                color: #62401a;
                position: relative;
                align-items: center;
                margin-top:11 / @widthScale;
            }
        }
    }
}
#setting {
    box-sizing: border-box;
    padding: 0 1.8rem;
    font-weight: bold;
    h3 {
        text-align: center;
        color: #5b1b1b;
    }
    #offlineRing {
        .flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.85rem;
        > p:first-child {
            .flex;
            flex-direction: column;
            > span:first-child {
                font-size: 0.9rem;
                color: #5b1b1b;
                margin-bottom: 0.5rem;
            }
            > span:nth-child(2) {
                color: #999999;
                font-size: 0.7rem;
                font-weight: 400;
            }
        }
    }
    #hasMusic {
        .flex;
        justify-content: space-between;
        > p:first-child {
            color: #5b1b1b;
            font-size: 0.9rem;
        }
    }
}
</style>
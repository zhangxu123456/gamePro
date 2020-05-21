<template>
    <transition>
        <my-overlay v-if="show">
            <div id="prompt">
                <div id="prompt_top">
                    <img v-if="receive" class="prompt_title" src="@/assets/images/decoration/img_name_hssn.png" alt="标题">
                    <img v-else-if="offline" class="prompt_title" src="@/assets/images/decoration/img_name_lxsy.png" alt="标题">
                    <img v-else-if="goldShort" class="prompt_title" src="@/assets/images/decoration/img_jb.png" alt="标题">
                    <img v-else class="prompt_title" src="@/assets/images/decoration/img_name_income.png" alt="标题">
                    <img @click="onClose ? $emit('close') : $emit('confirm')" id="prompt_close" class="iconBtn closeBtn" src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
                </div>
                <div id="prompt_main">
                    <div id="prompt_content">
                        <slot></slot>
                    </div>
                    <div class="twoBtn" id="prompt_confirm" v-if="!video && !receive">
                        <p class="iconBtn" @click="$emit('confirm')">确定</p>
                    </div>
                    <div class="twoBtn" id="video_confirm" v-if="video">
                        <div class="iconBtn" @click="$emit('confirm')">
                            确定
                        </div>
                        <div class="iconBtn" @click="$emit('onVideo')">
                            <img src="@/assets/images/icon/icon_play.png" alt="视频图标">
                            <span>观看视频翻倍</span>
                        </div>
                    </div>
                    <div class="twoBtn" id="receive_confirm" v-if="receive">
                        <div class="iconBtn" @click="$emit('close')">
                            <span>取消</span>
                        </div>
                        <div class="iconBtn" @click="$emit('confirm')">
                            <span>确定</span>
                        </div>
                    </div>
                </div>
                <footer>
                    <slot name="foot"></slot>
                </footer>
            </div>
        </my-overlay>
    </transition>
</template>

<script>
export default {
    name: 'my-prompt',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        // 观看视频
        video: {
            type: Boolean,
            default: false
        },
        // 回收神鸟
        receive: {
            type: Boolean,
            default: false
        },
        // 离线收益
        offline: {
            type: Boolean,
            default: false
        },
        // 传此变量将 close 和 confirm 分开处理
        onClose: {
            type: Boolean,
            default: false
        },
        goldShort:{
            type: Boolean,
            default: false
        }
    }
}
</script>
<style lang="less" scoped>
#prompt {
    background-image: url('~@/assets/images/decoration/bg_img_bjk.png');
    background-size: 100% 100%;
    width: 610 / @widthScale;
    height: 934 / @widthScale;
    box-sizing: border-box;
    position: relative;
}
#prompt_top {
    position: relative;
     height: 136 / @widthScale;
    display: flex;
    justify-content: center;
    align-items: center;
    .prompt_title {
        // margin-left: 197 / @widthScale;
        // margin-top: 57 / @widthScale;
        width: 216 / @widthScale;
        height: 64 / @widthScale
    }
    #prompt_close {
        position: absolute;
        left: 552 / @widthScale;
        top: 30 / @heightScale;
    }
}
#prompt_main {
    margin-top: 144 / @widthScale;
    > div#prompt_content {
        .flex;
        justify-content: center;
    }
    > div#prompt_confirm {
        // position: absolute;
        // top: 506 / @widthScale;
        // width: 100%;
        > p.iconBtn {
            .text_outer_order;
            color: white;
            width: 220 / @widthScale;
            height: 89 / @widthScale;
            margin: 0 auto;
            background-image: url('~@/assets/images/icon/btn_yqhy.png');
            background-size: 100% 100%;
            box-sizing: border-box;
            padding-left: 81 / @widthScale;
            padding-top: 24.5 / @widthScale;
            margin-bottom: 20 / @widthScale;
        }
    }
}
.twoBtn {
    .flex;
    justify-content: space-around;
    margin-top: 40 / @widthScale;
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
        display: inline;
        width: 179 / @widthScale;
        height: 98 / @widthScale;
        line-height: 98 / @widthScale;
        background-image: url('~@/assets/images/icon/btn_yqhy.png');
        background-size: 100% 100%;
        text-align: center;
        color: #fff;
        // > span {
        //     .text_outer_order;
        //     color: white;
        //     // line-height: 98 / @widthScale;
        // }
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
#receive_confirm {
    > div:nth-child(1) {
        width: 220 / @widthScale;
        background-image: url('~@/assets/images/icon/btn_yqhy_death.png');
    }
    > div:nth-child(2) {
        width: 220 / @widthScale;
    }
}
footer {
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #784421;
}
// 过度动画
.v-enter-active, .v-leave-active {
    transition: all .4s;
}
.v-enter, .v-leave-to {
    opacity: 0;
}
</style>

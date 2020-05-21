<template>
    <transition>
        <my-overlay v-if="show">
            <div id="prompt">
                <div id="prompt_top">
                    <img class="prompt_title" src="@/assets/images/decoration/img_name_sj.png" alt="标题">
                    <img @click="$emit('close')" id="prompt_close" class="iconBtn closeBtn" src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
                </div>
                <div id="prompt_main">
                    <div id="prompt_content">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </my-overlay>
    </transition>
</template>

<script>
export default {
    name: 'my-levelup',
    props: {
        show: {
            type: Boolean,
            default: false
        },
    }
}
</script>
<style lang="less" scoped>
#prompt {
    background-image: url('~@/assets/images/decoration/bg_img_invite.png');
    background-size: 100% 100%;
    width: 610 / @widthScale;
    height: 934 / @widthScale;
    box-sizing: border-box;
    position: relative;
}
#prompt_top {
    position: relative;
    display: flex;
    height: 136 / @widthScale;
    justify-content: center;
    align-items: center;
    .prompt_title {
        // margin-left: 195 / @widthScale;
        // margin-top: 57 / @widthScale;
        width: 216 / @widthScale;
        height: 64 / @widthScale
    }
    #prompt_close {
        position: absolute;
        left: 550 / @widthScale;
        top: 34 / @heightScale;
    }
}
#prompt_main {
    margin-top: 50 / @widthScale;
    > div#prompt_content {
        .flex;
        justify-content: center;
        // height: 450 / @widthScale;
        width: 450 / @widthScale;
        margin: 0 auto;
        background-image: url('~@/assets/images/decoration/bg_light.png');
        background-size: 100% 100%;
    }
    > div#prompt_confirm {
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
        }
    }
}
// 过度动画
.v-enter-active, .v-leave-active {
    transition: all .4s;
}
.v-enter, .v-leave-to {
    opacity: 0;
}
</style>
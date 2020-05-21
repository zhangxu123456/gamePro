<template>
    <my-overlay>
        <div id="customerService">
            <div id="customerService_top">
                <img id="customerService_title" src="@/assets/images/decoration/img_name_kf.png" alt="标题-客服">
                <img @click="$router.back(-1)" id="customerService_close" class="iconBtn closeBtn" src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
            </div>
            <div id="customerService_main">
                <img :src="kefuQR" alt="二维码">
                <span>
                    详情请咨询微信客服
                </span>
            </div>
        </div>
    </my-overlay>
</template>

<script>
export default {
    name: 'customerService',
    data () {
        return {
            kefuQR: this.$store.state.userInfo.setting.kefuQR
        }
    },
    mounted () {
    }
}
</script>
<style lang="less" scoped>
#customerService {
    background-image: url('~@/assets/images/decoration/img_pop_kf.png');
    background-size: 100% 100%;
    width: 610 / @widthScale;
    height: 934 / @widthScale;
}
#customerService_top {
    position: relative;
    height: 110 / @widthScale;
    display: flex;
    justify-content: center;
    align-items: center;
    #customerService_title {
        // margin-left: 247 / @widthScale;
        // margin-top: 56 / @widthScale;
        width: 119 / @widthScale;
        height: 64 / @widthScale;
    }
    #customerService_close {
        position: absolute;
        left: 550 / @widthScale;
        top: 34 / @heightScale;
    }
}
#customerService_main {
    .flex;
    flex-direction: column;
    align-items: center;
    margin-top: 159 / @widthScale;
    > img {
        width: 314 / @widthScale;
    }
    > span {
        margin-top: 116 / @widthScale;
        color: #fff;
        font-weight: bold;
    }
}
</style>
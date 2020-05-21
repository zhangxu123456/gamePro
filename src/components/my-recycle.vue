<template>
    <my-overlay>
        <div id="my-recycle">
            <div id="income_top">
                <img id="income_title" src="@/assets/images/decoration/img_name_hssn.png" alt="标题-回收神鸟">
                <img @click="$router.back(-1)" id="income_close" class="iconBtn closeBtn" src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
            </div>
            <div id="income_goldIcon">
                <img src="@/assets/images/decoration/img_gold.png" alt="金币图标">
            </div>
            <div id="income_goldNum">
                +23456.44k
            </div>
            <div id="recycle_confirm">
                <div class="iconBtn">
                    <span>取消</span>
                </div>
                <div class="iconBtn">
                    <span>确定</span>
                </div>
            </div>
        </div>
    </my-overlay>
</template>

<script>
export default {
    name: 'my-recycle',
    props: ['type'],
    data () {
        return {
            
        }
    },
}
</script>
<style lang="less" scoped>
#my-recycle {
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
    > div:first-child {
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
    > div:nth-child(2) {
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
</style>
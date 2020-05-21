<template>
    <my-overlay>
        <div id="pictorialBook">
            <div id="pictorialBook_top">
                <img id="pictorialBook_title" src="@/assets/images/decoration/img_name_sntj.png" alt="标题">
                <img @click="$router.back(-1)" id="pictorialBook_close" class="iconBtn closeBtn"
                     src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
            </div>
            <!-- <my-drap id="pictorial_main">
                <div class="item" v-for="(item, index) in $store.state.pictorialBook" :key="index">
                    <div :class="[item.mark === 'top' && 'limited']">
                        <img :src="$birdList.special[item.mark][item.own ? 'normal' : 'sketch']" alt="图鉴">
                        <span>{{ item.name }}</span>
                    </div>
                    <div>
                        <div>
                            <h3>技能:</h3>
                            <p>{{ item.skill }}</p>
                        </div>
                        <div>
                            <h3>获取途径:</h3>
                            <p v-for="(ele, i) in item.ways" :key="i">
                                {{ ele }}
                            </p>
                        </div>
                    </div>
                </div>
            </my-drap> -->
            <my-drap id="pictorial_main">
                <div class="item" v-for="(item, index) in $store.state.pictorialBook" :key="index">
                    <div :class="[item.mark === 'top' && 'limited']">
                        <div>
                            <img :src="$birdList.special[item.mark][item.own ? 'normal' : 'sketch']" alt="图鉴">
                        </div>

                        <span>{{ item.name }}</span>
                    </div>
                    <div>
                        <div>
                            <span>技能</span>
                            <!-- <img src="@/assets/images/decoration/jn_title.png" alt=""> -->
                            <p>{{ item.skill }}</p>
                        </div>
                        <div>
                            <span>获取途径</span>
                            <!-- <img src="@/assets/images/decoration/get_title.png" alt=""> -->
                            <p v-for="(ele, i) in item.ways" :key="i">
                                {{ ele }}
                            </p>
                        </div>
                    </div>
                </div>
            </my-drap>
        </div>
    </my-overlay>
</template>

<script>
    export default {
        name: 'pictorialBook',
        data () {
        },
        mounted () {
            this.getData()
        },
        methods: {
            async getData () {
                this.$store.dispatch('getPictorialBook')
                // 老的处理方式, 2020年1月3日 14:47:50
                // let res = await this.$store.dispatch('getPictorialBook')
                // this.list = res
                // console.log(res)
            }
        }
    }
</script>
<style lang="less" scoped>
    #pictorialBook {
        background-image: url('~@/assets/images/decoration/bg_img_sntj.png');
        background-size: 100% 100%;
        // width: 634 / @widthScale;
        width: 610 / @widthScale;
        height: 1219 / @widthScale;
        box-sizing: border-box;
    }

    #pictorialBook_top {
        position: relative;
        height: 110 / @widthScale;
        display: flex;
        justify-content: center;
        align-items: center;
        #pictorialBook_title {
            // margin-left: 227 / @widthScale;
            // margin-left: 195 / @widthScale;
            // margin-top: 60 / @widthScale;
            width: 200 / @widthScale;
            height: 58 / @widthScale
        }

        #pictorialBook_close {
            position: absolute;
            // left: 576 / @widthScale;
            left: 560 / @widthScale;
            top: 26 / @heightScale;
        }
    }

    #pictorial_main {
        margin-top: 57 / @widthScale;
        padding: 0 47 / @widthScale;
        height: 970 / @widthScale;

        .item {
            .flex;

            > div:first-child {
                .flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                width: 150 / @widthScale;
                height: 220 / @widthScale;
                background: #f6df99;
                // background: radial-gradient( circle,#FFEDAD,#EBD589 );
                box-shadow: 0px 0px 4px 0px rgba(185, 162, 81, 1) inset;
                border-radius: 5px;
                margin-right: 0.625rem;

                div {
                    width: 100%;
                    height: 218/@widthScale;
                    // background-image: url('~@/assets/images/decoration/img_tjk.png');
                    // background-size: 100% 100%;
                    display: flex;
                    justify-content: center;
                    > img {
                        width: 120 / @widthScale;
                        height: 116 / @widthScale;
                        // margin-left: 25/@widthScale;
                        margin-top: 29/@widthScale;
                    }
                }

                > span {
                    display: inline-block;
                    width: 179 / @widthScale;
                    height: 76 / @widthScale;
                    // background-image: url('~@/assets/images/decoration/bg_mzk.png');
                    // background-size: 100% 100%;
                    font-size: 0.8rem;
                    color: #784421;
                    font-weight: bold;
                    text-align: center;
                    line-height: 76 / @widthScale;
                    color: #74501c;
                }
            }

            > div:nth-child(2) {
                flex: 1;
                // width: 332 / @widthScale;
                // background-image: url('~@/assets/images/decoration/jneng_bg.png');
                // background-size: 100% 100%;
                border-radius: 5px;
                box-sizing: border-box;
                padding: 0.625rem;
                background: #f6df99;

                > div {
                    > span {
                        color:#74501c;
                        font-size: 0.8rem;
                        font-weight: bold;
                    }

                    > img {
                        // font-size: 0.85rem;
                        // font-weight: bold;
                        // color: #784421;
                        // padding-bottom: 0.4rem;
                        height: 33 / @widthScale;
                    }

                    > p {
                        margin-top: 0.4rem;
                        font-size: 0.75rem;
                        color: #652420;
                        line-height: 1.1rem;
                    }
                }

                > div:first-child {
                    padding-bottom: 0.625rem;
                    border-bottom: 0.5px solid #784421;
                }

                > div:nth-child(2) {
                    padding-top: 0.625rem;
                }
            }

            .limited {
                position: relative;
                overflow: hidden;
            }

            .limited::after {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                background-image: url('~@/assets/images/decoration/icon_xianliang.png');
                background-size: 100% 100%;
                width: 70 / @widthScale;
                height: 70 / @widthScale;
            }
        }

        .item:not(:last-child) {
            padding-bottom: 1rem;
            border-bottom: 0.5px solid #784421;
        }

        .item:not(:first-child) {
            padding-top: 1rem;
        }
    }
</style>
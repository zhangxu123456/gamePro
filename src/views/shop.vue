<template>
    <my-overlay>
        <div id="shop">
            <div id="shop_top">
                <img id="shop_title" src="@/assets/images/decoration/img_name_shop.png" alt="标题">
                <img @click="$router.back(-1)" id="shop_close" class="iconBtn closeBtn" src="@/assets/images/decoration/btn_close.png" alt="关闭按钮">
            </div>
            <!-- <div id="shop_gold">
                <img src="@/assets/images/icon/icon_shop_gold.png" alt="金币图标">
                <span>{{ userInfo.gold }}</span>
            </div> -->
            <!-- <my-drap id="contents">
                <div class="item" v-for="(item, index) in shopData" :key="index">
                    <p>{{ item.level >= 10 ? item.level : `0${item.level}` }}</p>
                    <p>
                        <img v-if="item.canBuyWithGold || item.canBuyWithEgg" :src="$birdList.normal[index]" alt="宠物">
                        <img v-else :src="$birdList.sketch[index]" alt="宠物剪影">
                    </p>
                    <p>{{ item.goodsName }}</p>
                    <p 
                    :class="[ (item.canBuyWithGold || item.canBuyWithEgg) ? 'active iconBtn': 'death']" 
                    @click="(item.canBuyWithGold || item.canBuyWithEgg) && buyGoods(item.level, item.canBuyWithEgg ? 1 : 0, item)"
                    >
                        <img :src="setItemIcon(item)" alt="金币图标">
                        <span v-if="item.canBuyWithGold || item.canBuyWithEgg">{{ $translateNumer(item.price) }}</span>
                        <span v-else class="label_canbuy">{{ Number(item.level) + 4 }}</span>
                    </p>
                </div>
            </my-drap> -->
            <my-drap id="contents">
                <div class="jinbi">
                    <img src="@/assets/images/icon/icon_gold.png" alt="金币">
                    <p>{{ userInfo.gold }}</p>
                </div>
                <section>
                    <div class="item" v-for="(item, index) in shopData" :key="index">
                        <div class="item-left">
                            <div>
                                {{item.level}}
                            </div>
                            <p class="shoop_item_img">
                                <img v-if="item.canBuyWithGold || item.canBuyWithEgg" :src="$birdList.normal[index]" alt="宠物">
                                <img v-else :src="$birdList.sketch[index]" alt="宠物剪影">
                            </p>
                            <p class="leval_name">{{ item.goodsName }}</p>
                        </div>
                        <p 
                        :class="[ (item.canBuyWithGold || item.canBuyWithEgg) ? 'active iconBtn': 'death']" 
                        @click="(item.canBuyWithGold || item.canBuyWithEgg) && buyGoods(item.level, item.canBuyWithEgg ? 1 : 0, item)"
                        >
                            <img :src="setItemIcon(item)" alt="金币图标">
                            <span v-if="item.canBuyWithGold || item.canBuyWithEgg">{{ $translateNumer(item.price) }}</span>
                            <span v-else class="label_canbuy">{{ Number(item.level) + 4 }}</span>
                        </p>
                        <!-- <div v-if="!(item.canBuyWithGold || item.canBuyWithEgg)" class="item_mask">{{ item.level >= 10 ? item.level : `0${item.level}` }}</div>
                        <p class="leval_name">{{ item.level >= 10 ? item.level : `0${item.level}` }}{{ item.goodsName }}</p>
                        <p class="shoop_item_img">
                            <img v-if="item.canBuyWithGold || item.canBuyWithEgg" :src="$birdList.normal[index]" alt="宠物">
                            <img v-else :src="$birdList.sketch[index]" alt="宠物剪影">
                        </p>
                        <p 
                        :class="[ (item.canBuyWithGold || item.canBuyWithEgg) ? 'active iconBtn': 'death']" 
                        @click="(item.canBuyWithGold || item.canBuyWithEgg) && buyGoods(item.level, item.canBuyWithEgg ? 1 : 0, item)"
                        >
                            <img :src="setItemIcon(item)" alt="金币图标">
                            <span v-if="item.canBuyWithGold || item.canBuyWithEgg">{{ $translateNumer(item.price) }}</span>
                            <span v-else class="label_canbuy">{{ Number(item.level) + 4 }}</span>
                        </p> -->
                    </div>
                </section>
            </my-drap>
        </div>
    </my-overlay>
</template>

<script>
import game from '@/games/bird'
import { mapState } from 'vuex'
import { userInfo } from 'os'

export default {
    name: 'shop',
    data () {
        return {
            list: [],
            itemIcon: {
                gold: require('@/assets/images/icon/icon_shop_gold.png'),
                egg: require('@/assets/images/icon/icon_shop_egg.png'),
                lock: require('@/assets/images/icon/icon_lock.png')
            }
        }
    },
    computed: {
        // state 状态
        ...mapState([
            'birdList',
            'userInfo',
            'shopData'
        ]),
    },
    mounted () {
        this.getData()
    },
    methods: {
        async getData () {
            this.$store.dispatch('getShopData')
        },
        /**
         * 购买商品
         * @param {*} level 商品等级
         * @param {*} type 货币类型, 0金币, 1彩蛋币
         * @param {*} item 当前列表单个元素
         */
        async buyGoods (level, type, item) {
            let res = await this.$store.dispatch('toBugGoods', {
                level,
                type,
                item
            })
            if (!res) return false
            // 更新 游戏 视图
            game.updateBirdView()
            // 以下为原来的处理方法, 已移除到 vuex 中进行处理
            /* eslint-disable */
            // let res = await this.$ajax('buyGoods', {
            //     game_level: level,
            //     type,
            // })
            // if (!res) return false
            // // 购买成功, 减去用户账户上的金币, 并更新 vuex
            // this.$store.commit('updateUserInfo', {
            //     gold: Number(this.userInfo.gold) - Number(item.price)
            // })
            // // 遍历获取空位置的索引
            // let indexEmpty = -1
            // this.birdList.some( (item, index) => {
            //     if (!item.id) {
            //         indexEmpty = index
            //         return true
            //     }
            // })
            // // 如果 indexEmpty 为 -1 则说明位置已满
            // if ( indexEmpty === -1 ) return console.log('位置已满')
            // // 提取 返回的 数据
            // let { id, level: resLevel, typeName, income, price } = res
            // let mark = resLevel > 37 ? typeName : resLevel
            // // 更新 最新的 价格
            // item.price = price
            // // 更新 vuex 上的 数据
            // this.$store.commit('updateBirdList', {
            //     index: indexEmpty,
            //     info: {
            //         id,
            //         mark,
            //         income,
            //         level: resLevel
            //     }
            // })
            // // 更新 游戏 视图
            // game.updateBirdView()
            // // 更新 后端数据库中 保存的 数据
            // await this.$ajax('birdsGroup', {
            //     type: 1,
            //     weizhi: JSON.stringify(this.birdList)
            // })
        },
        // 根据后端数据, 设置 icon
        setItemIcon (data) {
            let { canBuyWithGold, canBuyWithEgg } = data
            if (canBuyWithGold && !canBuyWithEgg) {
                return this.itemIcon.gold
            }
            if (!canBuyWithGold && canBuyWithEgg) {
                return this.itemIcon.egg
            }
            if (!canBuyWithGold && !canBuyWithGold) {
                return this.itemIcon.lock
            }
        }
    }
}
</script>
<style lang="less" scoped>
#shop {
    background-image: url('~@/assets/images/decoration/bg_img_sntj.png');
    background-size: 100% 100%;
    width: 610 / @widthScale;
    height: 1219 / @widthScale;
    box-sizing: border-box;
}
#shop_top {
    position: relative;
    height: 110 / @widthScale;
    display: flex;
    justify-content: center;
    align-items: center;
    #shop_title {
        // margin-left: 247 / @widthScale;
        // margin-top: 57 / @widthScale;
        width: 108 / @widthScale;
        height: 58 / @widthScale
    }
    #shop_close {
        position: absolute;
        left: 541 / @widthScale;
        top: 34 / @heightScale;
    }
}
#shop_gold {
    .flex;
    align-items: center;
    width: 520 / @widthScale;
    height: 100 / @widthScale;
    background-color: #DBBC85;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3) inset;
    border-radius: 5px;
    margin: 0 auto;
    margin-top: 57 / @widthScale;
    > img {
        width: 70 / @widthScale;
        height: 70 / @widthScale;
        margin-left: 23 / @widthScale;
        margin-right: 20 / @widthScale;
    }
    > span {
        .font_akb;
        color: #784421;
        font-size: 1.25rem;
        margin-top: 3.5px;
    }
}
#contents {
    width: 496 / @widthScale;
    height: 1000 / @widthScale;
    // margin: 0 57 / @widthScale;
    // margin-top: 50 / @heightScale;
    padding: 0 57 / @widthScale;
    section{
        .flex;
        width: 100%;
        flex-direction: column;
        flex-wrap: wrap;
    }
    div.item {
        .flex;
        position: relative;
        width: 100%;
        height: 160 / @widthScale;
        // background-image: url('~@/assets/images/decoration/shop_item_bg.png');
        // background-size: 100% 100%;
        // margin-bottom: 63/@widthScale;
        border-bottom: 0.5px solid #784421;
        align-items: center;
        >div.item-left{
            .flex;
            flex: 1;
            align-items: center;
            > div {
                width: 60 / @widthScale;
                height: 80 / @widthScale;
                background-image: url('~@/assets/images/icon/icon_levelBox.png');
                background-size: 100% 100%;
                color: #72451c;
                font-size: 0.5rem;
                text-align: center;
                line-height: 70 / @widthScale;
                flex-shrink: 0;
            }
            .leval_name{
                width: 120 / @widthScale;
                height: 46 / @widthScale;
                line-height: 46 / @widthScale;
                background: #f5de98;
                border-radius: 5px;
                color: #75541f;
                font-size: 0.8rem;
                text-align: center;
                font-weight: bold;
                margin-left: 10 / @widthScale;
            }
            .shoop_item_img{
                img{
                    width: 120 / @widthScale;
                    height: 130 / @widthScale;
                    margin-left: -15 / @widthScale;
                    // margin: 0 10%; 
                    // margin-top: 10/@widthScale;
                }
            }
        }
        .iconBtn{
            .flex;
            width: 190 / @widthScale;
            height: 72 / @widthScale;
            background-image: url('~@/assets/images/icon/btn_yqhy.png');
            background-size: 100% 100%;
            justify-content: flex-start;
            align-items: center;
            box-sizing: border-box;
            padding-bottom: 9 / @widthScale;
            margin-top: 12/@widthScale;
            color: #fff;
            font-size: 0.8rem;
            font-weight: bold;
            img{
                width: 42 / @widthScale;
                height: 42 / @widthScale;
                margin-left: 24 / @widthScale;
                margin-right: 3 / @widthScale;
            }
        }
        .death{
            .flex;
            width: 190 / @widthScale;
            height: 72 / @widthScale;
            background-image: url('~@/assets/images/icon/btn_death.png');
            background-size: 100% 100%;
            justify-content: flex-start;
            align-items: center;
            box-sizing: border-box;
            // padding: 0 20 / @widthScale;
            padding-bottom: 9 / @widthScale;
            color: #fff;
            font-size: 0.6rem;
            font-weight: bold;
            img{
                width: 36 / @widthScale;
                height: 36 / @widthScale;
                margin-left: 24 / @widthScale;
                margin-right: 40 / @widthScale;
            }
        }
        .item_mask{
            position: absolute;top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background:rgba(0,0,0,.7) url('~@/assets/images/icon/img_notuse.png');
            background-size: 100% 100%;
            text-align: center;
            line-height: 222 / @widthScale;
            color: #fff;
            font-size: 1.5rem;
            font-weight: bold;
        }
    }
    // div.item:nth-of-type(3n+2){
    //     margin-left:25/@widthScale; 
    //     margin-right:25/@widthScale;
    // }
    // div.item:not(:first-child) {
    //     padding-top: 0.5rem;
    // }
    // div.item:not(:last-child) {
    //     border-bottom: 0.5px solid #784421;
    //     padding-bottom: 0.5rem;
    // }
    .jinbi{
        width: 100%;
        // height: 60 / @widthScale;
        display: flex;
        align-items: center;
        background:rgba(199, 114, 35, 0.4);
        box-shadow: 0 0 5px #72451c inset;
        border-radius: 5px;
        padding: 25 / @widthScale 0;
        margin-top: 20 / @widthScale;
        >img{
            width: 40 / @widthScale;
            height: 40 / @widthScale;
            margin: 0 26 / @widthScale;
        }
        >p{
            font-size: 1.1rem;
            font-weight: bold;
            color: #72451c;
        }
    }
}
</style>
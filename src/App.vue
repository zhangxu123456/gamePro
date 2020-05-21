<template>
	<div id="app" @click="actionShow = false">
		<div id="top">
			<div @click="audio('other')">
				<p>
					<img src="@/assets/images/icon/icon_jinbi.png" alt="按钮图标">
				</p>
				<p>
          <span :class="[goldActive?'font_akb animated infinite pulse':'font_akb']">{{ $translateNumer(userInfo.gold) }}</span>
					<span>{{ $translateNumer(goldIncreasing / 5) }}/秒</span>
				</p>
			</div>
			<router-link tag="div" to="/userInfo" class="iconBtn">
				<p>
					<img class="cur_lev_img"
					:src="birdImgs[userInfo.level - 1] || specialBird[userInfo.birdType].normal"
					alt="当前等级"
					>
				</p>
				<p>
					<span class="font_akb">{{ userInfo.levelName }}</span>
					<span>Lv.{{ userInfo.level }}</span>
				</p>
			</router-link>
			<div @click="audio('other')">
				<img class="iconBtn"
				src="@/assets/images/icon/icon_qiandai.png" alt="按钮图标"
				@click="toNative()"
				>
				<span class="font_akb">{{ $translateNumer(userInfo.dividend || 0) }}</span>
			</div>

			<!--<div class="top_left">-->
				<!--<img :src="member_img" alt="" class="member_img">-->
				<!--<div class="level_name">-->
					<!--<p class="name">{{ userInfo.levelName }}</p>-->
					<!--<p class="level"><img src="@/assets/images/icon/level_icon.png" alt=""> lv:{{ userInfo.level }}</p>-->
				<!--</div>-->
			<!--</div>-->
			<!--<div class="top_right">-->
				<!--<div>-->
					<!--<img src="@/assets/images/icon/icon_shop_gold.png" alt="">-->
					<!--<span>{{ $translateNumer(userInfo.gold) }}</span>-->
				<!--</div>-->
				<!--<div>-->
					<!--<img src="@/assets/images/icon/second_icon.png" alt="">-->
					<!--<span>{{ $translateNumer(userInfo.gold) }}</span>-->
				<!--</div>-->
			<!--</div>-->
		</div>
		<div id="entry">
			<div>
				<img
				class="iconBtn"
				v-for="(item, index) in entryIcon"
				:key="index"
				:src="item.icon" alt="弹窗图标"
				@click.stop="entryTodo(item.to, item.property, item.href)"
				>
				<my-collapse>
					<p id="action" v-show="actionShow">
						<span @click="jumpPage('活动', `http://${config.hostname}/newH5/activity_new.html`)">
							<img src="@/assets/images/decoration/icon_huodong.png" alt="活动图标"  @click="audio('other')">
							<span>活动</span>
						</span>
						<span @click="jumpPage('消息', `http://${config.hostname}/newH5/system_xx.html`)">
							<img src="@/assets/images/decoration/icon_message.png" alt="消息图标"  @click="audio('other')">
							<span>消息</span>
						</span>
					</p>
				</my-collapse>
			</div>
			<div
			:class="[userInfo.timeOfCountdown === 0 && 'iconBtn']"
			@click="userInfo.timeOfCountdown === 0 && getPrize()"
			>
				<img src="@/assets/images/icon/icon_lingqu.png" alt="金币图标">
				<span>{{userInfo.timeOfCountdown === 0 ? '领取' : timeOfCountdown}}</span>
			</div>
		</div>
		<!-- <div id="notice" v-show="true">
			<van-notice-bar
				:speed="50"
				color="#333"
				background="rgba(255, 255, 255, 0.3)"
				:text="notice"
			/>
		</div> -->
		<div id="gameBox"></div>
		<div id="entry_bottom">
			<router-link tag="div" to="/invite">
				<img class="btnBtm iconBtn" src="@/assets/images/icon/btn_yqq.png" alt="图标">
				<span>邀请券</span>
			</router-link>
			<router-link tag="div" to="/eggs">
				<img class="btnBtm iconBtn" src="@/assets/images/icon/btn_cd.png" alt="图标">
				<span>彩蛋</span>
			</router-link>
			<div id="toBuyBtn" class="iconBtn" @click="toBuy()">
				<p>
					<img class="goodsBird" :src="birdImgs[Number(maxCanBuy.level) - 1]" alt="鸟">
				</p>
				<p>
					<span>Lv.{{ maxCanBuy.level }}</span>
					<span>
						<img class="goldIcon" src="@/assets/images/icon/icon_gold.png" alt="金币图片">
						<span>{{ $translateNumer(maxCanBuy.price || 0) }}</span>
					</span>
				</p>
			</div>
			<div tag="div" @click="pageTo('/shop')" >
				<img class="btnBtm iconBtn" src="@/assets/images/icon/btn_shop.png" alt="图标">
				<span>商店</span>
			</div>
			<div @click="audio('other')">
				<img class="btnBtm" src="@/assets/images/icon/btn_huishou.png" alt="图标">
				<span>回收</span>
			</div>
		</div>

		<!-- 雌雄同体提醒 -->
		<my-prompt :show="promptShow" @confirm="onConfirm">
            <div class="prize_eggs">
                <img class="card_prize" src="@/assets/images/bird/bird_img_qinglv.png" alt="鸟">
                <span>+{{ qinglvName }}</span>
            </div>
        </my-prompt>

		<!-- 宝箱奖励提醒 -->
		<my-prompt :show="baoBoxPromptShow" @confirm="onBaoBoxConfirm" onClose @close="onBXClose">
            <div class="prize_eggs baobox">
                <img class="card_prize" src="@/assets/images/decoration/img_gold.png" alt="金币">
                <span>+{{ $translateNumer(baoBoxGold) }}</span>
            </div>
			<template #foot>
				每天凌晨0点整刷新视频次数(剩余{{ userInfo.videoAmount }}次)
			</template>
        </my-prompt>

		<!-- 金币不足提醒  isGoldShort-->
		<my-prompt :show="isGoldShort" @confirm="onBaoBoxConfirm('isGoldShort')" onClose goldShort @close="onBXClose('isGoldShort')">
            <div class="prize_eggs baobox">
                <img class="card_prize" src="@/assets/images/decoration/img_gold.png" alt="金币">
               <!-- <span>+{{ $translateNumer(baoBoxGold) }}</span> -->
		   		<div class="tipsText">恭喜获得14.49m金币,观看广告获取</div>
            </div>
			<template #foot>
				每天凌晨0点整刷新视频次数(剩余{{ userInfo.videoAmount }}次)
			</template>
        </my-prompt>

		<!-- 回收神鸟提醒 -->
		<my-prompt :show="receivePromptShow" @confirm="receiveConfirm" onClose receive @close="receivePromptShow = false">
            <div class="prize_eggs receiveView">
                <img class="card_prize" src="@/assets/images/decoration/img_gold.png" alt="金币">
                <span>+{{ receiveInfo && $translateNumer(receiveInfo.receive) }}</span>
            </div>
        </my-prompt>

		<!-- 离线收益 -->
		<my-prompt
		:show="offlineShow"
		:video="isVideo"
		offline
		@confirm="offlineShow = false"
		@onVideo="watchedAD()"
		>
            <div class="prize_eggs baobox offlineIncome">
                <img class="card_prize" src="@/assets/images/decoration/img_gold.png" alt="金币">
                <span>+{{ $translateNumer(offlineGold) }}</span>
            </div>
			<template #foot>
				每天凌晨0点整刷新视频次数(剩余{{ userInfo.videoAmount }}次)
			</template>
        </my-prompt>

		<!-- 升级提醒 -->
		<my-levelup :show="levelupShow" @close="levelupShow = false">
			<div class="levelUpBox">
				<img :src="birdImgs[levelupMark] || specialBird[levelupMark].normal" alt="升级的鸟">
				<span>{{ levelupName }}</span>
			</div>
		</my-levelup>

		<!-- 回收红包提醒 -->
		<my-prompt :show="receiveRedShow" @confirm="receiveRedShow = false">
            <div class="receive_red">
                <img class="card_prize" src="@/assets/images/textures/material/eggs/red_pag.png" alt="红包">
                <span>获得红包{{ receiveRedAmount }}元</span>
            </div>
        </my-prompt>

		<transition name="router">
			<keep-alive :include="includeList">
				<router-view />
			</keep-alive>
		</transition>
	</div>
</template>

<script>
import game from '@/games/bird'
import { mapState } from 'vuex'
import { toLocaleString } from 'myuijs'
import config from '@/callServer/config'
import { Music } from '@/games/music'

export default {
	name: 'app',
	data () {
		return {
			config,
			// 条目图标
			entryIcon: [
				{
					icon: require('@/assets/images/icon/btn_phb.png'),
					to: '/ranking'
				},
				{
					icon: require('@/assets/images/icon/btn_play.png'),
					href: `http://${config.hostname}/newH5/lightly_ime.html`
				},
				{
					icon: require('@/assets/images/icon/btn_tj.png'),
					to: '/pictorialBook'
				},
				{
					icon: require('@/assets/images/icon/btn_xyzp.png'),
					to: '/turntable'
				},
				{
					icon: require('@/assets/images/icon/btn_kf.png'),
					to: '/customerService'
				},
				{
					icon: require('@/assets/images/icon/btn_hd.png'),
					property: 'actionShow'
				},
			],
			birdImgs: this.$birdList.normal, // 鸟图片数组
			specialBird: this.$birdList.special,
			actionShow: false,
			// 要进行缓存的组件
			includeList: [
				'shop',
				'pictorialBook',
				'ranking',
			],
			// 公告
			notice: '',
			// 显示提醒
			promptShow: false,
			qinglvName: '', // 情侣疯的名字
			baoBoxPromptShow: false, // 宝箱奖励提醒
			baoBoxGold: '', // 宝箱金币奖励
			noticeTimer: null, // 公告计时器
			// 离线收益
			offlineShow: false, // 离线收益展示
			offlineGold: '',
			offlineVideoID: '', // 观看广告后发送给后端的id
			isVideo: true, // 是要展示观看视频按钮
			// 回收神鸟
			receivePromptShow: false,
			receiveInfo: null, // 回收鸟的信息
			receiveing: false, // 回收中
			// 升级提示
			levelupShow: false,
			levelupMark: 0,
			levelupName: '',
			// 回收红包
			receiveRedShow: false,
			receiveRedAmount: 0,
			member_img: '',
			list: [],
      		goldActive: false,
			NUM: 0
		}
	},
	computed: {
        // state 状态
        ...mapState({
			birdList: 'birdList',
			userInfo: 'userInfo',
			isGoldShort: state => state.isGoldShort,
			// 最大能买的商品
			maxCanBuy ({ shopData }) {
				let theMax = shopData.find( (item, index) => {
					return shopData[index + 1].canBuyWithGold === false
				})
				// console.log(theMax)
        return theMax || {}
			},
			timeOfCountdown ({ userInfo }) {
				// 转换为 秒, 并调用 myuijs 的模块, 进行 格式化
				return userInfo.timeOfCountdown <= 0 ? '领取' : toLocaleString(Number(userInfo.timeOfCountdown) * 1000, 'mm:ss')
			}
		}),
		// 每秒收益
		goldIncreasing: (state) => {
			let gold = 0
			state.birdList.forEach( item => {
				gold += item.income || 0
			})
			return gold
		}
    },
	mounted () {
		this.getData()
		// 获取商店列表
		this.$store.dispatch('getShopData')
		// 获取图鉴的数据
		this.$store.dispatch('getPictorialBook')

		console.log(this.$store)
	},
	methods: {
		async getData () {
			let res = await this.$ajax('userInfo')
      let res1 = await this.$ajax('ranking')
			this.member_img = res1.userInfo.avatar ? res1.userInfo.avatar : '@/assets/images/def_ava.jpg'
			if (!res) return false
			this.list = res.list
			// 将 鸟列表 数据传递过去
			this.getBirdsInfo(res.list)
			// 更新 vuex 数据
			this.$store.commit('updateUserInfo', {
				...res.info
			})
			// 开启倒计时
			this.$store.commit('countdownTime')
		},
		async getBirdsInfo (list) {
			/* eslint-disable */
			// 获取 后端 鸟组信息
			let res = await this.$ajax('birdsGroup')
			console.log(JSON.stringify(res))
			if (!res) return false
			// console.log(JSON.parse( JSON.stringify(list) ))
			// console.log(JSON.parse( JSON.stringify(res) ))
			// 如果 返回的 数据 为 数组格式
			if ( res instanceof Array ) {
				// 遍历 res 数组, 同步 res 和 list 数据
				let listSysncedIndex = [] // 已经同步过的 list 的元素索引
				// 遍历 res 同步 list 数据
				res.forEach( item => {
					// 如果 id 为 null, 则终止函数
					if (!item.id) return false
					// 判断 是否 拥有 相同 id
					let theSame = list.find( (ele, index) => {
						if (ele.id === item.id) {
							listSysncedIndex.push(index) // 将 即将用于同步的 index 保存到 数组中
							return true
						}
					})
					// 如果没有相同的, 且 item.id 不为空, 则 重置 当前的 元素
					if (!theSame && item.id) {
						item.id = null
						item.mark = null
						item.income = 0
						item.level = -1
						item.receive = 0
						return false
					}
					// 同步 相同  id 的数据
					let { id, level, typeName, income, receive } = theSame
					let mark = level > 37 ? typeName : level
					item.id = id
					item.mark = mark
					item.income = income
					item.level = level
					item.receive = receive
				})
				// 遍历 list 将 未同步的 数据 同步到 res 中
        list.forEach( (item, index) => {
					// 如果 相对应的 index 包含在 已经同步过的 数组 中, 则终止函数
					if ( listSysncedIndex.includes(index) ) return false
					// 获取 空位置的 对象
          // let theNull = res.find( ele =>ele.id === null)
          let theNull={};
          // 同步数据
					let { id, level, typeName, income, receive } = item
					let mark = level > 37 ? typeName : level
					theNull.id = id
					theNull.mark = mark
					theNull.income = income
					theNull.level = level
					theNull.receive = receive
				})
				// 更新 vuex 的 birdList 数据
				this.$store.commit('initBirdList', res)
			} else if ( !(res instanceof Array ) && list.length > 0 ) {
				// 如果 res 不是数组, 然而, list 的长度 大于 0, 说明为游戏初始化时
				// 深拷贝 vuex 中定义的数据
				let birdList = JSON.parse( JSON.stringify(this.birdList) )
				// 遍历数组, 将 list 中的 信息, 保存到 birdList 中
        console.log(list);
        list.forEach( (item, i) => {
					let { id, level, typeName, income, receive } = item
					let mark = level > 37 ? typeName : level
					birdList[i] = {
						id,
						mark,
						income,
						level,
						receive
					}
				})
				// 更新 后端数据库中 保存的 数据
				await this.$ajax('birdsGroup', {
					type: 1,
					weizhi: JSON.stringify(birdList)
				})
				// 初始化 vuex 中 birdList 的 数据
				this.$store.commit('initBirdList', birdList)
			}
			// console.log(this.birdList)
			// 初始化游戏
			this.gameInit()
		},
		// 一开始的处理方式, 2020年1月6日 09:56:55
		async getBirdsInfo_old (list) {
			/* eslint-disable */
			// // 获取 后端 鸟组信息
			// let res = await this.$ajax('birdsGroup')
			// if (!res) return false
			// // console.log(JSON.parse( JSON.stringify(list) ))
			// // console.log(JSON.parse( JSON.stringify(res) ))
			// // 如果 返回的 数据 为 数组格式
			// if ( res instanceof Array ) {
			// 	// 判断 后端存储的 list 与 res 保存的数据情况 是否一致
			// 	// 遍历 res 判断 数组元素中, 获知 id 不对空的元素 有多少, 并保存索引, 用于后续判断
			// 	let indexNotEmpty = [] // 不为空的元素索引
			// 	res.forEach( (item, index) => {
			// 		if ( item.id ) {
			// 			indexNotEmpty.push(index)
			// 		}
			// 	})
			// 	// 如果 不为空 的元素 数量 多于 list 的 长度
			// 	if ( indexNotEmpty.length > list.length ) {
			// 		console.log('than')
			// 		// 遍历不为空 元素的 索引, 获取 不为空元素, 与 list 的元素 进行判断
			// 		indexNotEmpty.forEach( index => {
			// 			// 遍历 list
			// 			let hasSame = list.some( ele => {
			// 				return ele.id === res[index].id
			// 			})
			// 			// 如果 找不到匹配的元素, 则重置该 位置的 元素
			// 			if ( !hasSame ) {
			// 				res[index].id = null
			// 				res[index].mark = null
			// 				res[index].income = 0
			// 				res[index].level = -1
			// 				res[index].receive = 0
			// 			}
			// 		})
			// 		// console.log( JSON.parse( JSON.stringify(res) ) )
			// 		// 完全没必要, 且导致bug 的代码 2020年1月4日 16:39:57
			// 		// 遍历 list, 将元素添加到 空位置
			// 		// list.forEach( item => {
			// 		// 	// 找到空位置, 添加元素
			// 		// 	res.some( (ele, i) => {
			// 		// 		if ( !ele.id ) {
			// 		// 			res[i].id = item.id
			// 		// 			res[i].mark = item.level > 37 ? item.typeName : item.level
			// 		// 			res[i].income = item.income
			// 		// 			res[i].level = item.level
			// 		// 			res[i].receive = item.receive
			// 		// 			return true
			// 		// 		}
			// 		// 	})
			// 		// })
			// 	} else if ( indexNotEmpty.length < list.length ) {
			// 		console.log('less')
			// 		// 如果 不为空 的 元素数量 少于 list 的 长度
			// 		// 遍历不为空的数组, 将 res 中 id 与 list 完全不匹配的元素 置空
			// 		indexNotEmpty.forEach( item => {
			// 			let hasSame = list.some( ele => { return ele.id === res[item].id } )
			// 			if (!hasSame) {
			// 				res[item].id = null
			// 				res[item].mark = null
			// 				res[item].income = 0
			// 				res[item].level = -1
			// 				res[item].receive = 0
			// 			}
			// 		})
			// 		// 遍历 list ,将 多出 res 的元素 提取出来
			// 		list.forEach( item => {
			// 			// 遍历 不为空的 元素, 将 id 进行 对比, 如果 能够遍寻得到, 则说明 为相同的 的元素
			// 			let isSame = indexNotEmpty.some( index => {
			// 				return res[index].id === item.id
			// 			})
			// 			// 如果 不是相同的, 则 遍历 res, 找到 空的位置, 将 改元素 添加进去
			// 			if (!isSame) {
			// 				res.some( (ele, i) => {
			// 					// 找到空位置, 添加元素
			// 					if ( !ele.id ) {
			// 						res[i].id = item.id
			// 						res[i].mark = item.level > 37 ? item.typeName : item.level
			// 						res[i].income = item.income
			// 						res[i].level = item.level
			// 						res[i].receive = item.receive
			// 						return true
			// 					}
			// 				})
			// 			}
			// 		})
			// 	} else {
			// 		// 二者数据数量相等, 遍历 list, 将 list 中 的 数据, 覆盖到 对应 res 中
			// 		let indexList = [] // 用于保存数据没错 或者 已经 替换过的 元素索引
			// 		list.forEach( item => {
			// 			let { level, id, typeName, income, receive } = item
			// 			// 遍历 res, 寻找 id 相同的元素, 替换掉其中的属性
			// 			let isHas = res.some( (ele, index) => {
			// 				if ( ele.id === id ) {
			// 					res[index].id = id
			// 					res[index].mark = level > 37 ? typeName : level
			// 					res[index].income = income
			// 					res[index].level = level
			// 					res[index].receive = receive
			// 					indexList.push(index)
			// 					return true
			// 				}
			// 			})
			// 			// 如果 没有 找到 id 相同的元素, 则说明, 数据出错了, 需要将对应的数据, 覆盖掉 res 中的数据
			// 			if (!isHas) {
			// 				res.some( (ele, index) => {
			// 					// 找出存在 Id 的变量, 则 索引不存在 与 indexList 中的
			// 					if ( ele.id && !indexList.includes(index)) {
			// 						res[index].id = id
			// 						res[index].mark = level > 37 ? typeName : level
			// 						res[index].income = income
			// 						res[index].level = level
			// 						res[index].receive = receive
			// 						indexList.push(index)
			// 						return true
			// 					}
			// 				})
			// 			}
			// 		})
			// 	}
			// 	// 更新 vuex 的 birdList 数据
			// 	this.$store.commit('initBirdList', res)
			// } else if ( !(res instanceof Array ) && list.length > 0 ) {
			// 	// 如果 res 不是数组, 然而, list 的长度 大于 0, 说明为游戏初始化时
			// 	// 深拷贝 vuex 中定义的数据
			// 	let birdList = JSON.parse( JSON.stringify(this.birdList) )
			// 	// 遍历数组, 将 list 中的 信息, 保存到 birdList 中
			// 	list.forEach( (item, i) => {
			// 		let { id, level, typeName, income, receive } = item
			// 		let mark = level > 37 ? typeName : level
			// 		birdList[i] = {
			// 			id,
			// 			mark,
			// 			income,
			// 			level,
			// 			receive
			// 		}
			// 	})
			// 	// 更新 后端数据库中 保存的 数据
			// 	await this.$ajax('birdsGroup', {
			// 		type: 1,
			// 		weizhi: JSON.stringify(birdList)
			// 	})
			// 	// 初始化 vuex 中 birdList 的 数据
			// 	this.$store.commit('initBirdList', birdList)
			// }
			// // console.log(this.birdList)
			// // 初始化游戏
			// this.gameInit()
		},
		gameInit () {
			// 初始化游戏
			game.init()
			// 监听钩子函数
			game.listen({
				// 回收钩子函数
				onRecycle: (info) => {
					// console.log(info)
					this.receiveInfo = info // 设置 回收鸟信息
					this.receivePromptShow = true

					// 一开始的处理方式, 2020年1月4日 12:05:15
					// this.$dialog.confirm({
					// 	message: '确定要回收吗?'
					// })
					// .then( async () => {
					// 	let { id, index } = info
					// 	// 进行回收
					// 	let res = await this.$ajax('recycle', {
					// 		game_id: id
					// 	})
					// 	if (!res) return false

					// 	// 根据返回的 获得 金币, 更新 vuex 用户信息中的金币
					// 	let { gold } = res
					// 	this.$store.commit('updateUserInfo', {
					// 		gold: Number(this.userInfo.gold) + gold
					// 	})

					// 	// 重置 对应 index vuex 中的 鸟列表
					// 	this.$store.commit('updateBirdList', {
					// 		index,
					// 		info: {
					// 			id: null,
					// 			mark: null,
					// 			income: 0,
					// 			level: -1
					// 		}
					// 	})

					// 	// 更新 后端数据库中 保存的 鸟列表数据
					// 	await this.$ajax('birdsGroup', {
					// 		type: 1,
					// 		weizhi: JSON.stringify(this.birdList)
					// 	})

					// 	// 更新 鸟视图
					// 	game.updateBirdView()
					// })
					// .catch( () => {
					// 	console.log('不回收')
					// })
				},
				/**
				 * 合成钩子函数
				 * @param {*} info 两只合成鸟的信息
				 * @param {*} isMax 用于判断是否为 37级 的合成
				 * @param {*} isFuck 用于判断是否为 男女鸟合成
				 */
				onMixed: async (info, isMax, isFuck) => {
					/* eslint-disable */
					// 如果为 37级合成, 跳转路由进行处理
					if (isMax) {
						let { drapedId, collisionedId, drapedIndex, collisionedIndex } = info
						this.$router.push({
							name: 'mixing',
							query: {
								did: drapedId,
								cid: collisionedId,
								dindex: drapedIndex,
								cindex: collisionedIndex
							}
						})
						return false
					}
					// 调用 vuex 的 actions 进行合成
					let res = await this.$store.dispatch('birdMixing', info)
					if (!res) return false
					let { level, levelName, red } = res
					// 更新 canvas 视图
					game.updateBirdView()
					// 如果最新蛋的等级, 大于 vuex 中 用户的 等级, 则更新用户等级 以及 对应等级名, 并重新请求商店数据
					if (level > this.userInfo.level) {
						// console.log('升级')
						// 展示提示
						// console.log(res)
						this.levelupShow = true
						this.levelupMark = res.mark - 1
						this.levelupName = res.levelName
						// 更新用户数据
						this.$store.commit('updateUserInfo', {
							level,
							levelName
						})
						// 获取商店数据
						this.$store.dispatch('getShopData')
					}
					// 如果为男女风合成, 则进行提醒
					if (isFuck) {
						this.qinglvName = levelName
						this.promptShow = true
					}
					// 如果有红包, 且不是为 37 级 合成的
					if (red.status === 1) {
						console.log('有红包')
						this.$nativeApi._redEnvelope(red)
					}
					return true
				},
				// 宝箱点击钩子函数
				onClickBox: async () => {
					let res = await this.$ajax('clickBaoBox')
					if (!res) return false
					// 显示宝箱提醒
					this.baoBoxPromptShow = true
					this.baoBoxGold = res.gold
					// 绑定原生回调接口, 2020年1月4日 10:03:33
					// nativeHook.adWatched = async () => {
					// 	try {
					// 		let res = await this.$ajax('watchedVideo')
					// 		if (!res) return false
					// 		let { money } = res
					// 		// 更新用户的金币数量
					// 		this.$store.commit('updateUserInfo', {
					// 			gold: Number(this.userInfo.gold) + Number(money)
					// 		})
					// 		// 关闭宝箱
					// 		this.onBXClose()
					// 	} catch (err) {
					// 		this.$dialog.alert({
					// 			message: err
					// 		})
					// 	}
					// }
					// // 显示宝箱提醒
					// this.baoBoxPromptShow = true
					// this.baoBoxGold = res.gold
				},
				// 五凤合成钩子函数
				onFiveOpen: () => {
					console.log('五凤合成...')
					this.$router.push({
						name: 'fivefiveopen'
					})
				}
			})
			// socket 监听
			this.$socket.listen({
				// 收到 socket 的 金币 消息
				onGoldMsg: (message) => {
					console.log("消息次数",message)
					let { id, income } = message
					// 弹出金币特效
					this.NUM++
					(function(NUM){
						setTimeout(function(){
							game.goldEffect({
								id,
								gold: income
							})
						},400*NUM);
					}(this.NUM))

					if(this.NUM===12){
						this.NUM =0
					}
					
					// 递增

					this.$store.commit('updateUserInfo', {
						gold: Number(this.userInfo.gold) + Number(income)
					})
          		this.goldActive = true
				setTimeout(() => {
					this.goldActive = false
				}, 700)
				},
				// 公告
				onNoticeMsg: (message) => {
					this.notice = message.mes
					this.noticeTimer && clearTimeout(this.noticeTimer)
					// 3秒后移除
					this.noticeTimer = setTimeout(() => {
						this.notice = ''
					}, 10000)
				},
				// 离线收益
				onOfflineIncome: (message) => {
					// console.log(message)
					this.offlineGold = message.jinbi
					this.offlineVideoID = Number(message.sy_id)
					this.offlineShow = true
					// 更新用户的金币数量
                    this.$store.commit('updateUserInfo', {
                        gold: Number(this.userInfo.gold) + Number(this.offlineVideoID)
                    })
				}
			})
		},
		// 条目函数执行的操作
		entryTodo (to, property, href) {
			if (href) {
				// this.$nativeApi.goUrl(href)
                this.audio('other')

				this.jumpPage('怎么玩', href)
				return false
			}
			if (to && to !== '/') {
                this.audio('other')
				this.$router.push({
					path: to
				})
			} else if (property) {
                this.audio('other')
				this[property] = !this[property]
			}
		},
        pageTo (to) {
            this.audio('other')
		    this.$router.push({path: to})
        },
		audio(id) {
			(new Music).play(id)
		},
		// 进行购买
    async toBuy () {
      console.log(this.$store.state.birdList)
      let empindex =-1
      let emp = this.$store.state.birdList.find( (item, index) => {
        if ( item.id  < 1){
          if (empindex<0){
            empindex =  index
          }
        }
      })
      this.audio('buy1')
      let { level, canBuyWithEgg } = this.maxCanBuy
      let res = await this.$store.dispatch('toBugGoods', {
        level,
        type: canBuyWithEgg ? 1 : 0,
        item: this.maxCanBuy
      })
       console.log("test",res)
      if (!res) return false
      // 更新 游戏 视图
      console.log(empindex)
      game.pushts(level,empindex)

      setTimeout(function () {
        game.updateBirdView()
      },700)
      // game.updateBirdView()
    },

		// 提醒确认
		onConfirm () {
			this.promptShow = false
		},
		// 获取奖励
		async getPrize () {
			this.audio('other')

			this.$router.push({
				name: 'income',
				params: {
					type: 'video'
				}
			})
		},
		// 前往原生页面
		toNative () {
			this.$nativeApi._goBonus()
			// window.webkit && window.webkit.messageHandlers.goBonus.postMessage('')
		},
		// 宝箱点击确认
		onBaoBoxConfirm () {
			console.log('宝箱确认')

		 if(this.userInfo.videoAmount<=0){
		        this.$dialog.alert({
                        message: "当日视频次数不足"
                  })
				  return false
		 }				
			
     
	 			 if(arguments[0]){
						this.$store.dispatch("setGoldShort",false)
					}else{
						 this.baoBoxPromptShow = false
					}
			// 调用原生观看广告的接口
			this.$nativeApi._watchAD( async () => {
				try {
					// 关闭宝箱
					let res = await this.$ajax('watchedVideo')
					if (!res) return false
					let { money } = res
					// 更新用户的金币数量
					this.$store.commit('updateUserInfo', {
						gold: Number(this.userInfo.gold) + Number(money)
					})
				} catch (err) {
					this.$dialog.alert({
						message: err
					})
				}
			})
		},
		// 宝箱关闭
		onBXClose () {
			// nativeHook.adWatched = null // 重置钩子
			this.baoBoxPromptShow = false
			if(arguments[0]){
				this.$store.dispatch("setGoldShort",false)
			}
		},
		// 回收页面确定
		async receiveConfirm () {
			console.log('确认回收')
			if (this.receiveing) return false // 回收中 终止函数
			this.receiveing = true
			let { id, index } = this.receiveInfo
			// 进行回收
			let res = await this.$ajax('recycle', {
				game_id: id
			})
			if (!res) {
				this.receiveing = false
				return false
			}
			// console.log(res)
			// 根据返回的 获得 金币, 更新 vuex 用户信息中的金币/转盘券
			let { gold, red, ticket } = res
			this.$store.commit('updateUserInfo', {
				gold: Number(this.userInfo.gold) + gold,
				ticket: Number(this.userInfo.ticket) + ticket
			})

			// 如果存在红包, 则展示红包
			if (red && red > 0) {
				this.receiveRedAmount = red
				this.receiveRedShow = true
			}

			// 重置 对应 index vuex 中的 鸟列表
			this.$store.commit('updateBirdList', {
				index,
				info: {
					id: null,
					mark: null,
					income: 0,
					level: -1
				}
			})

			// 更新 后端数据库中 保存的 鸟列表数据
			await this.$ajax('birdsGroup', {
				type: 1,
				weizhi: JSON.stringify(this.birdList)
			})

			// 更新 鸟视图
			game.updateBirdView()
			// 重置 回收鸟信息, 隐藏提示框
			this.receiveInfo = null
			this.receivePromptShow = false
			this.receiveing = false
		},
		// 跳转页面
		jumpPage (title, href) {
			this.$nativeApi.goUrl(title, href)
			// window.location.href = href
			// window.open(href)
		},
		// 观看广告
		watchedAD () {
			console.log('观看视频')
			this.$nativeApi._watchAD( async () => {
                try {
					this.isVideo = false // 切换 提示类型
                    let res = await this.$ajax('watchedVideo', {
                        logid: this.offlineVideoID
                    })
                    if (!res) return false
					let { money } = res
					this.offlineGold += Number(money)  // 增加显示的金币
                    // 更新用户的金币数量
                    this.$store.commit('updateUserInfo', {
                        gold: Number(this.userInfo.gold) + money
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

<style lang="less">
.iconBtn:active {
	-webkit-transform: scale(0.95);
	transform: scale(0.95);
	-webkit-transition: all 0.1s;
	transition: all 0.1s;
}
.van-overlay {
    .flex;
    align-items: center;
    justify-content: center;
}
#app {
	.flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	background-image: url(./assets/images/bg_img.e2334dca.png);
	background-size: 100% 100%;
	font-family: SourceRegular;
}
#top {
	/*background-image: url(./assets/images/decoration/top_bg.png);*/
	background-size: 100% 100%;
	width: 640/@widthScale;
	height: 217 / @widthScale;
	.flex;
	 > div {
	 	position: absolute;
	 	img {
	 		width: 65 / @widthScale;
	 		margin-right: 11 / @widthScale;
	 	}
	 }
	 > div:first-child {
	 	.flex;
	 	top: 23 / @heightScale;
	 	left: 18 / @widthScale;
	 	> p:nth-child(2) {
	 		.flex;
	 		flex-direction: column;
	 		position: relative;
	 		top: 1.5px;
	 		span:first-child {
	 			color: #FEC230;
	 			font-size: 1.1rem;
	 		}
	 		span:nth-child(2) {
	 			font-size: 0.8rem;
	 			color: rgba(255, 255, 255, 0.3);
	 		}
	 	}
	 }
	 > div:nth-child(2) {
	 	.flex;
	 	position: relative;
	 	align-items: center;
	 	background-image: url(./assets/images/decoration/top_btn_bird.png);
	 	background-size: 100% 100%;
	 	width: 218 / @widthScale;
	 	height: 94.83 / @widthScale;
	 	margin-top: 53 / @heightScale;
	 	margin-left: 241 / @widthScale;
	 	.cur_lev_img {
	 		width: 64 / @widthScale;
	 	}
	 	> p:first-child {
	 		margin-left: 18 / @widthScale;
	 	}
	 	> p:nth-child(2) {
	 		.flex;
	 		flex-direction: column;
	 		color: rgba(255, 229, 88, 0.7);
	 		text-shadow: 1px 1px 1px #571816;
	 		font-size: 0.8rem;
	 		span:nth-child(2) {
	 			font-size: 0.75rem;
	 			margin-top: 0.1rem;
	 		}
	 	}
	 }
	 > div:nth-child(3) {
	 	.flex;
	 	align-items: center;
	 	top: 25 / @heightScale;
	 	left: 525 / @widthScale;
	 	> span {
	 		font-size: 1.25rem;
	 		color: #FEC230;
	 	}
	 }
	/*margin-top: 1rem;*/
	padding: 0 25/@heightScale 0 25/@heightScale;
	/*<!--padding: 0 60/@heightScale 0 25/@heightScale;-->*/
	justify-content: space-between;
	.top_left{
		.flex;
		width: 400 / @heightScale;
		.member_img{
			width: 18vw;
			height: 18vw;
			margin: 40/@heightScale 20/@heightScale 0 0;
			border-radius: 3vw;
		}
		.level_name{
			.flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 10/@heightScale 0;
			height: 120/@heightScale;
			margin-top: 1.7rem;
			color: #fff;
			text-shadow: #000 1px 1px 2px;
			img{
				width: 62/@heightScale;
				height: 71/@heightScale;
				vertical-align: middle;
			}
		}
	}
	.top_right{
		.flex;
		width: 200 / @heightScale;
		flex-direction: column;
		margin-top: 47/@heightScale;
		&>div{
			.flex;
			align-items: center;
			font-family: AkrobatBloack;
			font-size: 1rem;
			width: 100%;
			height: 50/@heightScale;
			background: #3D7119;
			margin-bottom: 25/@heightScale;
			border-radius: 25/@heightScale;
			border: 1px solid #FFEB1B;
			color: #FFEB1B;
			img{
				width: 48/@heightScale;
				height: 48/@heightScale;
			}
		}
	}
}
#entry {
	.flex;
	justify-content: space-around;
    margin-bottom: 2rem;
	> div {
		.flex;
	}
	> div:first-child {
		position: relative;
		.iconBtn {
			width: 102 / @widthScale;
			height: 102 / @widthScale;
		}
		#action {
			.flex;
			position: absolute;
			right: 0;
			top: 100%;
			background-image: url('~@/assets/images/decoration/bg_huodong.png');
			background-size: 100% 100%;
			width: 247 / @widthScale;
			height: 153 / @widthScale;
			margin-right: -70 / @widthScale;
			z-index: 999;
			> span {
				.flex;
				flex-direction: column;
				margin-top: 38 / @widthScale;
				align-items: center;
				> img {
					width: 70 / @widthScale;
					margin-bottom: 3px;
				}
				> span {
					color: #FFEF79;
					font-size: 0.75rem;
				}
			}
			> span:first-child {
				margin-left: 32 / @widthScale;
				margin-right: 38 / @widthScale;
			}
			> span:nth-child(2) {
				> span {
					margin-left: -5px;
				}
			}
		}
	}
	> div:nth-child(2) {
		flex-direction: column;
		align-items: center;
		margin-top: -0.8rem;
		> img {
			width: 70 / @widthScale;
		}
		> span {
			color: white;
			font-size: 0.7rem;
			height: 1.2rem;
			 line-height: 1.2rem;
			 background-color: #FEC230;
			 padding: 0 0.4rem;
			 border-radius: 5px;
			text-align: center;
			 margin-top: 6px;
		}
	}
}
#notice {
	margin: 0.5rem 30/@widthScale 0;
	box-sizing: border-box;
	padding: 0 1rem;
	position: absolute;
	top: 345 / @widthScale;
	width: 690/@widthScale;
	height: 60/@widthScale;
	.van-notice-bar {
		height: auto;
		padding: 0.2rem 1rem;
	}
}
#gameBox {
	flex-grow: 1;
	width: 100vw;
}
#entry_bottom {
	.flex;
	justify-content: space-between;
	width: 100%;
	padding-bottom: 1rem;
	img.btnBtm {
		width: 110 / @widthScale;
	}
	> div:not(#toBuyBtn) {
		.flex;
		flex-direction: column;
		align-items: center;
		color: white;
		font-size: 0.8rem;
		text-shadow: 1px 1px 1px #5E3119;
	}
	#toBuyBtn {
		.flex;
		align-items: center;
		background-image: url(./assets/images/decoration/btn_zhaohuan.png);
		background-size: 100% 100%;
		width: 260 / @widthScale;
		height: 135.2 / @widthScale;
		box-sizing: border-box;
		padding-left: 25 / @widthScale;
		.goodsBird {
			width: 84 / @widthScale;
		}
		.goldIcon {
			width: 20 / @widthScale;
		}
		> p:nth-child(2) {
			.flex;
			flex-direction: column;
			margin-left: 15 / @widthScale;
			> span:first-child {
				color: rgba(255, 229, 88, 0.7);
				text-shadow: 1px 1px 1px #571816;
			}
			> span:nth-child(2) {
				.flex;
				align-items: center;
				color: white;
				font-size: 0.65rem;
				margin-top: 5px;
				background-color: #521316;
				box-sizing: border-box;
				padding: 4px 5px;
				padding-top: 5px;
				border-radius: 2em;
				> img {
					margin-right: 3px;
				}
			}
		}
	}
}

.prize_eggs, .receive_red {
    .flex;
    flex-direction: column;
    align-items: center;
    > img.card_prize {
        margin-bottom: 46 / @widthScale;
        margin-top: -100 / @widthScale;
        width: 36vw;
    }
    > span {
		width:356/@widthScale;
		height:88/@widthScale;
		line-height:88/@widthScale;
		// margin: 0 auto;
		text-align: center;
		display: inline;
        color: #fff;
        font-weight: bold;
		font-size: 1.5rem;
		background-image: url('~@/assets/images/decoration/img_title.png');
		background-size: 100% 100%;
    }
}
.prize_jb, .receive_red {
  .flex;
  flex-direction: column;
  align-items: center;
  > img.card_prize {
    margin-bottom: 46 / @widthScale;
    margin-top: -100 / @widthScale;
    width: 36vw;
  }
  > span {
    width:356/@widthScale;
    height:88/@widthScale;
    line-height:88/@widthScale;
    // margin: 0 auto;
    text-align: center;
    display: inline;
    color: #fff;
    font-weight: bold;
    font-size: 1.5rem;
    background-image: url('~@/assets/images/decoration/img_jb.png');
    background-size: 100% 100%;
  }
}
.receive_red {
	> img.card_prize {
		width: 25vw;
		margin-top: -50 / @widthScale;
    }
}
.baobox, .receiveView {
	> img.card_prize {
        margin-bottom: 46 / @widthScale;
        margin-top: -100 / @widthScale;
        width: 45vw;
    }
}
.receiveView, .offlineIncome {
	> span {
		font-family: AkrobatBloack;
		color: #fff;
		font-size: 1.8rem;
		display: inline-block;
		width: 356 / @widthScale;
		height: 88 / @widthScale;
		line-height: 88 / @widthScale;
		text-align: center;
		// background-color: #DBBC85;
		background-image: url(./assets/images/decoration/input_bg.png);
		background-size: 100% 100%;
		box-shadow: 0 0 5px #B9985D inset;
		border-radius: 5px;
	}
}
.offlineIncome {
	> img.card_prize {
		margin-bottom: 25 / @widthScale;
	}
}
.levelUpBox {
	.flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	height: 100%;
	> span {
		.text_outer_order;
		display: inline-block;
		margin-top: 2rem;
		width: 356 / @widthScale;
		height: 88 / @widthScale;
		background-image: url('~@/assets/images/decoration/img_title.png');
        background-size: 100% 100%;
		// background-color: #a0633b;
		color: white;
		text-align: center;
		line-height: 89 / @widthScale;
		border-radius: 5px;
		// box-shadow: 1px 1px 10px #ffcb00 inset;
		// border: 1px solid #ffcb00;
	}
	img {
		width: 370 / @widthScale;
		// height: 410 / @widthScale;
		margin-top: 1rem;
	}
}
// 路由过度动画
.router-enter-active, .router-leave-active {
    transition: all .4s;
}
.router-enter, .router-leave-to {
    opacity: 0;
}
.tipsText{color: #6D1F22;font-weight: bold;}
</style>

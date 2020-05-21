/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'

const eggs = () => import(/* webpackChunkName: "eggs" */ '@/views/eggs.vue')
const income = () => import(/* webpackChunkName: "income" */ '@/views/income.vue')
const invite = () => import(/* webpackChunkName: "invite" */ '@/views/invite.vue')
const pictorialBook = () => import(/* webpackChunkName: "pictorialBook" */ '@/views/pictorialBook.vue')
const ranking = () => import(/* webpackChunkName: "ranking" */ '@/views/ranking.vue')
const shop = () => import(/* webpackChunkName: "shop" */ '@/views/shop.vue')
const turntable = () => import(/* webpackChunkName: "turntable" */ '@/views/turntable.vue')
const userInfo = () => import(/* webpackChunkName: "userInfo" */ '@/views/userInfo.vue')
const mixing = () => import(/* webpackChunkName: "mixing" */ '@/views/mixing.vue')
const fivefiveopen = () => import(/* webpackChunkName: "fivefiveopen" */ '@/views/fivefiveopen.vue')
const customerService = () => import(/* webpackChunkName: "customerService" */ '@/views/customerService.vue')

Vue.use(VueRouter)

const routes = [
    {
		path: '/eggs',
		name: 'eggs',
		component: eggs
    },
    {
		path: '/income/:type?',
		name: 'income',
		component: income,
		props: true
    },
    {
		path: '/invite',
		name: 'invite',
		component: invite
    },
    {
		path: '/pictorialBook',
		name: 'pictorialBook',
		component: pictorialBook
    },
    {
		path: '/ranking',
		name: 'ranking',
		component: ranking
    },
    {
		path: '/shop',
		name: 'shop',
		component: shop
    },
    {
		path: '/turntable',
		name: 'turntable',
		component: turntable
    },
    {
		path: '/userInfo',
		name: 'userInfo',
		component: userInfo
    },
    {
		path: '/mixing',
		name: 'mixing',
		component: mixing
    },
    {
		path: '/fivefiveopen',
		name: 'fivefiveopen',
		component: fivefiveopen
    },
    {
		path: '/customerService',
		name: 'customerService',
		component: customerService
    },
]

const router = new VueRouter({
  	routes
})

export default router

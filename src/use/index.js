/**
 * 挂载第三方组件
 */
import 'vant/lib/index.css'
import { 
    Overlay,
    Divider,
    Switch,
    NoticeBar,
    Popup
} from 'vant'

const vants = [
    Overlay,
    Divider,
    Switch,
    NoticeBar,
    Popup
]

export default function (Vue) {
    vants.forEach( item => {
        Vue.use(item)
    })
}
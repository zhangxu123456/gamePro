<template>
    <div ref="drapOuter" style="overflow: hidden;">
        <div
        ref="drapTarget"
        style="width: 100%;"
        @touchstart="dragStart"
        @touchmove.prevent="dragMove"
        @touchend="dragEnd">
            <slot name="default"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'my-drap',
    data () {
        return {
            // 滑动参数
            drag: {
                startY: -1, 
                endY: 0
            },
        }
    },
    methods: {
        dragStart (evt) {
            this.$refs.drapTarget.style.transition = '' // 重置 滑动目标的 transition 属性
            let { clientY } = evt.targetTouches[0] // 获取坐标
            this.drag.startY = clientY + this.drag.endY // 计算新的
        },
        dragMove (evt) {
            let { clientY } = evt.targetTouches[0]
            let { drapTarget } = this.$refs
            let { startY } = this.drag
            drapTarget.style.transform = `translateY(${clientY - startY}px)`
            // 时刻更新最新坐标
            this.drag.endY = -(clientY - startY)
        },
        dragEnd (evt) {
            let { endY } = this.drag
            let { drapTarget, drapOuter } = this.$refs
            // 最大滑动距离
            let maxDrap = drapTarget.clientHeight - drapOuter.clientHeight
            if (endY > maxDrap) {
                // 如果超过最大滑动距离, 则设置 0.2s 内滚回最大滑动距离, 并重置 endY
                drapTarget.style.transform = `translateY(${-maxDrap}px)`
                drapTarget.style.transition = 'all 0.2s'
                this.drag.endY = maxDrap
            } else if (endY < 0) {
                // 如果低于最小滑动距离(0), 则设置 0.2s 内滚动会 0位置, 并重置 endY
                drapTarget.style.transform = `translateY(0)`
                drapTarget.style.transition = 'all 0.2s'
                this.drag.endY = 0
            }
        }
    }
}
</script>
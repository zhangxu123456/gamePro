<template>
    <div class="my-overlay">
        <slot name="default"></slot>
    </div>
</template>

<script>
export default {
    name: 'my-overlay',
}
</script>
<style lang="less" scoped>
.my-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    z-index: 10;
}
</style>
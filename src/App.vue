<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
// import { mapActions } from 'vuex';
// export default {
//     methods: {
//         ...mapActions([
//             'getProducts'
//         ])
//     },
//     created () {
//         this.getProducts();
//     }
// }
</script>>

<style lang="less">
#app {
    .van-button--info {
        background-color: #409eff;
        border-color: #409eff;
    }
    .van-button--plain.van-button--info {
        background-color: #fff;
        color: #409eff;
    }
}
.van-dialog {
    max-width: 500px;
}
.bg-f5 {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 40px;
}
</style>
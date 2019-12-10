<template>
<div class='top-bar'>
    <van-nav-bar
        :title="title"
        :left-arrow="leftArrow"
        @click-left="onClickLeft"
    />
</div>
</template>

<script>

export default {
    name: 'Topbar',
    components: {},
    props: {
        title: {
            type: String,
            default: () => '',
        },
        leftArrow: {
            type: Boolean,
            default: () => true,
        }
    },
    data() {
        return {
            
        };
    },
    methods: {
        onClickLeft() {
            if (window.plus) {
                var webview = plus.webview.currentWebview()
                webview.back()
            } else {
                this.$router.go(-1);
            }
        }
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.top-bar {
    height: 46px;
    width: 100%;
    .van-nav-bar {
        position: fixed;
        width: 100%;
        max-width: 600px;
    }
}
</style>
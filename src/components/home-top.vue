<template>
<div class='top-bar'>
    <van-nav-bar
        :left-text="title"
        @click-right="onClickRight"
    >
        <div class="right" slot="right">
            <slot></slot>
            <span class="handler-name">{{handlerName}}</span>
        </div>
    </van-nav-bar>
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
        handlerName: {
            type: String,
            default: () => '',
        }
    },
    data() {
        return {
            
        };
    },
    methods: {
        onClickRight() {
            this.$emit('onClickRight')
        }
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
@bar_height: 45px;
.top-bar {
    height: @bar_height;
    width: 100%;
    box-shadow: 0 0 6px #ffe9c7;
    .van-nav-bar {
        position: fixed;
        width: 100%;
        max-width: 600px;
        height: @bar_height;
        line-height: @bar_height;
        .van-nav-bar__left {
            font-size: 15/11rem;
            .van-nav-bar__text {
                color: #666;
                font-weight: 500;
                &:active {
                    background-color: #fff;
                }
            }
        }
        .van-icon {
            color: #555;
            font-size: 15/11rem;
            padding: 3px 0;
        }
    }
    .right {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 10/11rem;
        height: @bar_height;
        justify-content: center;
        .handler-name {
            line-height: 20px;
        }
    }
}
</style>
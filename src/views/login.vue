<template>
<div class='login'>
    <topbar :left-arrow="false" title="登录"></topbar>    
    <div class="container">
        <div class="form-wp">
            <van-cell-group>
                <van-field
                    v-model="account"
                    type="text"
                    placeholder="工号"
                    left-icon="graphic"
                />
            </van-cell-group>
            <van-cell-group>
                <van-field
                    v-model="password"
                    type="password"
                    placeholder="密码"
                    left-icon="lock"
                />
            </van-cell-group>
        </div>
        <!-- <div class="access">
            <van-checkbox v-model="accessChecked">
                已阅读并同意
            </van-checkbox>
            <span class="deco" @click="showAuthDialog=true">《码力任务平台注册协议》</span>
        </div> -->
        <!-- <van-button class="submit deco-btn" icon="exchange" type="primary">{{loginTypeText}}</van-button> -->
        <van-button class="submit" type="info" @click="submitLogin">登 录</van-button>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
// import SmscodeBtn from '@/components/smscode-button.vue';
import common from '@/components/common';
export default {
    name: 'Login',
    components: { Topbar },
    data() {
        return {
            account: '',
            password: '',
        };
    },
    computed: {
    },
    methods: {
        submitLogin() {
            if (!this.account) {
                this.$notify('请输入工号')
                return false
            }
            if (!this.password) {
                this.$notify('请输入密码')
                return false
            }
            let data = {
                mobile: this.account,
                password: this.password,
            }
            this.$fly.post('/ydjf/login', common.obj2formdata(data))
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                if (s == 1) {
                    this.$toast(m);
                    localStorage.setItem('loginId', d.id);
                    localStorage.setItem('token', d.token);
                    localStorage.setItem('userName', this.account);
                    localStorage.setItem('isadmin', d.isadmin);
                    this.$router.replace('/');
                } else {
                    this.$notify(m);
                }
            })
        }
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.login {
    min-height: 100vh;
    background-color: #f5f5f5;
    .container {
        padding: 15/11rem;
        display: flex;
        flex-direction: column;
        padding-top: 100/11rem;
        .form-wp {
            .van-cell-group {
                .van-field__left-icon {
                    margin-right: 10px;
                    .van-icon {
                        font-size: 20px;
                    }
                }
                &:first-child {
                    .van-field__left-icon {
                        color: #66CCFF;
                    }
                }
                &:nth-child(2), &:nth-child(4) {
                    .van-field__left-icon {
                        color: rgb(255, 168, 37);
                    }
                }
                &:nth-child(3) {
                    .van-field__left-icon {
                        color: #31d777;
                    }
                }
            }
        }
        .van-cell-group {
            margin-bottom: 15/11rem;
            background-color: #f5f5f5;
            border-color: #f5f5f5;
            &.flex-box {
                display: flex;
                align-items: center;
                .img-code {
                    width: 120px;
                    margin-left: 10px;
                    height: 46px;
                }
            }
            .van-cell {
                border-radius: 10px;
                padding: 13px 15px;
                font-size: 15/11rem;
            }
        }
        .submit {
            width: 100%;
            margin-top: 20/11rem;
            // border-color: #409eff;
            // background-color: #409eff;
            font-size: 16/11rem;
            border-radius: 10px;
            // &.deco-btn {
            //     background-color: #fff;
            //     color: rgb(255, 160, 17);
            //     font-size: 15/11rem;
            //     margin-top: 10/11rem;
            // }
        }
    }
}
</style>
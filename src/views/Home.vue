<template>
<div class='home bg-f5'>
    <home-top title="积分兑换" @onClickRight="onClickRight">
        <span class="exit" style="font-size:12px;color:#666;">{{userName}}<i style="color:#dedede;margin:0 8px;">|</i>退出</span>
    </home-top>  
    <div class="container">
        <div class="myJF" :style="{ justifyContent: kyjf ? 'space-between' : 'center' }">
            <div class="binding" v-if="kyjf">
                <h3>手机号{{mobile}}</h3>
                <h3 class="value">可用积分：<span>{{kyjf}}</span></h3>
            </div>
            <van-button v-if="kyjf" class="btn" type="info" plain size="small" @click="clearCookies">更换号码</van-button>
            <van-button v-else class="btn" type="info" plain size="small" @click="startEx">积分查询</van-button>
        </div>
        <div class="checkout">
            <h3 class="title">可兑换积分产品：</h3>
            <div class="checkout-content">
                <!-- <div
                    class="item"
                    v-for="(item, index) in items"
                    :key="index"
                    :class="{ 'checked': checked==index }"
                    @click="checked=index"
                >
                    {{item.value}}
                </div> -->
                <van-button
                    class="item"
                    v-for="(item, index) in products"
                    :key="index"
                    :plain="checked!=index"
                    @click="checkedHandler(index, item)"
                    hairline
                    type="warning"
                    :disabled="item.score>thisScore"
                >
                    {{item.name}}
                </van-button>
            </div>
            <div class="sh-info" v-if="checked!=-1">
                <p class="title" style="padding-top:15px;background:#f5f5f5;">选择发货商品：</p>
                <van-radio-group v-model="goodsRadio">
                    <van-cell-group>
                        <van-cell v-for="(item, index) in productList" :key="index" :title="item" clickable @click="goodsRadio = (index+1)">
                            <van-radio slot="right-icon" :name="index+1" />
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
                <p class="title" style="padding-top:20px;background:#f5f5f5;">填写收货地址：</p>
                <van-cell-group>
                    <van-field v-model="name" label="姓名" placeholder="请输入姓名" />
                    <van-field v-model="sjmobile" type="tel" label="手机号" placeholder="请输入收件人手机号" />
                    <van-field v-model="areaName" type="textarea" label="选择地区" readonly placeholder="请选择地区" @click="areaShow=true" />
                    <van-field v-model="address" type="textarea" label="详细地址" placeholder="请输入详细地址" />
                    <!-- <van-field v-model="postcode" type="number" label="邮编" placeholder="请输入收件人邮编" /> -->
                </van-cell-group>
            </div>
        </div>
        <div class="btn-wp">
            <van-button class="btn" type="info" @click="confirmCheck" :disabled="confirmCheckText=='积分不足'||thisScore==0" :loading="confirmCheckLoading" loading-type="spinner">{{confirmCheckText}}</van-button>
            <van-button class="btn text-btn" type="info" plain to="/order">查看我的订单</van-button>
        </div>
    </div>
    <van-dialog
        v-model="queryDialog"
        title="积分查询"
        show-cancel-button
        :before-close="beforeCloseQuery"
    >
        <div class="dialog-content">
            <div class="form-wp">
                <van-cell-group>
                    <van-field v-model="mobile" type="tel" placeholder="输入手机号">
                    </van-field>
                </van-cell-group>
                <van-cell-group class="flex-box">
                    <van-field
                        v-model="verifyCode"
                        type="number"
                        placeholder="短信验证码"
                    />
                    <smscode-btn ref="getQueryCode" class="code" plain :mobile="mobile" @getCode="getCode" :delayed="60"></smscode-btn>
                </van-cell-group>
            </div>
        </div>
    </van-dialog>
    <van-dialog
        v-model="submitDialog"
        title="确认兑换"
        show-cancel-button
        :before-close="beforeCloseSubmit"
    >
        <div class="dialog-content">
            <div class="form-wp">
                <!-- <van-cell-group>
                    <van-field v-model="servicepassword" type="password" placeholder="输入服务密码">
                    </van-field>
                </van-cell-group> -->
                <van-cell-group class="flex-box">
                    <van-field
                        v-model="confirmcode"
                        type="number"
                        placeholder="短信确认码"
                    />
                    <smscode-btn ref="getConfirmcode" plain class="code" :mobile="mobile" @getCode="getConfirmcode" :delayed="60"></smscode-btn>
                </van-cell-group>
                <p class="tip">提示：<span>确认码有效时间为60秒</span></p>
            </div>
        </div>
    </van-dialog>
    <van-dialog
        v-model="showError"
        :show-confirm-button="false"
    >
        <div v-if="errorType==0" class="errorType">
            <div class="error-body">
                <div class="waiting">{{awaitTime}}秒</div>
                <br>
            </div>
            <p class="error-text">正在提交请耐心等待</p>
        </div>
        <div v-if="errorType==1" class="errorType success">
            <div class="error-body">
                <van-icon name="success" size="65" />
            </div>
            <p class="error-text">扣分成功</p>
        </div>
        <div v-if="errorType==2" class="errorType">
            <div class="error-body">
                <van-icon name="warning-o" size="65" color="#f80" />
            </div>
            <p class="error-text">{{errMsg}}</p>
            <!-- <p class="error-deco">请提醒客户使用最新验证码</p> -->
        </div>
        <div class="error-btns">
            <van-button v-if="errorType==1" plain class="btn" type="info" @click="cancelHandle">返回首页</van-button>
            <van-button v-if="errorType==1 && canIexchange" class="btn" type="info" @click="continueHandle">再办一单</van-button>
            <van-button v-if="errorType==2" class="btn" type="info" @click="showError=false">关闭</van-button>
        </div>
    </van-dialog>
    <van-popup v-model="areaShow" position="bottom">
        <van-area
            :area-list="areaList"
            :value="mobileLoc"
            @confirm="confirmArea"
            @cancel="areaShow=false"
            :visible-item-count="9"
        />
    </van-popup>
</div>
</template>

<script>
import HomeTop from '@/components/home-top.vue';
import SmscodeBtn from '@/components/smscode-button.vue';
import common from '@/components/common';
import areaList from '@/area';
import { mapGetters, mapActions } from 'vuex';
import { setInterval } from 'timers';

const OVER_TIME = 60;

export default {
    name: 'Home',
    components: { HomeTop, SmscodeBtn },
    data() {
        return {
            queryDialog: false,
            submitDialog: false,
            mobile: '',
            verifyCode: '',
            checked: -1,
            item: null,
            kyjf: '',
            servicepassword: '000000',
            confirmcode: '',
            confirmCheckLoading: false,
            userName: '',
            orderid: '',
            // exchange错误处理
            showError: false,
            errorType: 0,
            // showError: true,
            // errorType: 1,
            errMsg: '',
            awaitTime: OVER_TIME,
            awaitTimeIntv: null,
            // 收货信息
            name: '',
            sjmobile: '',
            areaName: '',
            address: '',
            postcode: '650000',
            areaList,
            areaShow: false,
            mobileLoc: '',
            productList: [],
            goodsRadio: 1,
        };
    },
    computed: {
        ...mapGetters([
            'products'
        ]),
        thisScore() {
            return this.kyjf ? parseInt(this.kyjf) : 0;
        },
        confirmCheckText() {
            return this.products.filter(item => item.score<this.thisScore).length == 0 && this.thisScore != 0 ? '积分不足' : '去兑换'
        },
        canIexchange() {
            if (!this.item) return false;
            let Dvalue = parseInt(this.kyjf) - parseInt(this.item.score);
            return this.products.some(item => Dvalue >= parseInt(item.score))
        }
    },
    watch: {
        // 收货号码变化的时候，获取手机号归属地
        sjmobile(v, o) {
            if (common.isVerificationNumber(v)) {
                this.$fly.get('/ydjf/getmobileloc', { mobile: v })
                .then((res) => {
                    if (typeof res === 'string') res = JSON.parse(res);
                    let { content } = res;
                    content = JSON.parse(content)
                    let city = content.response[v].detail.area[0].city;
                    let province = content.response[v].detail.province;
                    let provinceList = this.areaList.province_list;
                    let cityList = this.areaList.city_list;
                    let cityName = '';
                    let provinceName = '';
                    for (const key in cityList) {
                        const element = cityList[key];
                        if (element.includes(city)) {
                            this.mobileLoc = key;
                            cityName = cityList[key];
                        }
                    }
                    for (const key in provinceList) {
                        const element = provinceList[key];
                        if (element.includes(province)) {
                            provinceName = provinceList[key];
                        }
                    }
                    this.areaName = provinceName + ' ' + cityName + ' ';
                }).catch((err) => {
                    this.$dialog.alert({
                        title: '错误',
                        message: err,
                        confirmButtonText: '关闭'
                    });
                })
            }
        },
        // 查询手机号变化的时候，检测是否输入重复手机号
        mobile(v, o) {
            if (common.isVerificationNumber(v)) {
                this.$refs.getQueryCode.clearTimer();
            }
        },
        // verifyCode(v, o) {
        //     if (v.length != 6) return false;
        //     if (v == sessionStorage.getItem('verifyCode')) {
        //         this.$dialog.alert({
        //             title: '提示',
        //             message: '请输入最新的验证码！'
        //         }).then(() => {
        //             this.verifyCode = '';
        //         })
        //     } else {
        //         sessionStorage.setItem('verifyCode', v);
        //     }
        // }
    },
    methods: {
        ...mapActions([
            'getProducts'
        ]),
        // 开始兑换
        startEx() {
            this.clearCookies().then((res) => {
                this.queryDialog = true;
            })
        },
        // 登录移动积分商城验证码
        getCode(mobile) {
            this.$fly.post('/ydjf/sendydcode', common.obj2formdata({ mobile }))
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                this.$toast(m);
            }).catch((err) => {
                this.$dialog.alert({
                    title: '错误',
                    message: err || '请重新发送验证码',
                    confirmButtonText: '关闭'
                });
            })
        },
        // 兑换积分产品之前获取手机确认码
        getConfirmcode(mobile) {
            this.$fly.post('/ydjf/sendconfirmcode', common.obj2formdata({ mobile }))
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                this.$toast(m);
            }).catch((err) => {
                this.$dialog.alert({
                    title: '错误',
                    message: err || '请重新发送验证码',
                    confirmButtonText: '关闭'
                });
            })
        },
        // 兑换积分产品
        beforeCloseSubmit(action, done) {
            if (action === 'confirm') {
                /*
                ** 2019-11-11修改：不需输入服务密码
                */
                if (!this.servicepassword) {
                    this.$notify('请输入服务密码')
                    done(false)
                    return false
                }
                if (!this.confirmcode) {
                    this.$notify('请输入确认码')
                    done(false)
                    return false
                }
                if (this.confirmcode == sessionStorage.getItem('confirmcode')) {
                    this.$dialog.alert({
                        title: '提示',
                        message: '请输入最新的确认码！'
                    }).then(() => {
                        this.confirmcode = '';
                    })
                    done(false)
                    return false
                }
                sessionStorage.setItem('confirmcode', this.confirmcode);
                let data = {
                    mobile: this.mobile,
                    code: this.confirmcode,
                    servicepassword: encodeForPwd(this.servicepassword),
                    // scoreid: this.item.id,
                    orderid: this.orderid,
                    score: parseInt(this.kyjf) - parseInt(this.item.score),
                    adminid: localStorage.getItem('loginId'),
                    // 给移动的收货信息
                    shmobile: this.sjmobile,
                    shname: this.name,
                    shadd: this.areaName + this.address,
                    postcode: this.postcode,
                }
                this.errorTypeDialog(true, 0);
                this.$fly.post('/ydjf/exchange', common.obj2formdata(data))
                .then((res) => {
                    if (typeof res === 'string') res = JSON.parse(res);
                    let { d, m, s } = res;
                    if (s == 1) {
                        this.errorTypeDialog(true, 1);
                        done();
                    } else {
                        // this.errorTypeDialog(true, 1);
                        // done();
                        this.errorTypeDialog(true, 2, m);
                        done(false);
                    }
                }).catch((err) => {
                    this.errorTypeDialog(true, 2, err);                    
                    // this.$toast('登录失效或系统错误');
                    done(false);
                })
            } else {
                done();
            }
        },
        errorTypeDialog(isShow, type, msg='') {
            this.showError = isShow;
            this.errorType = type;
            this.errMsg = msg;
            window.clearInterval(this.awaitTimeIntv)
            if (type == 0) {
                this.awaitTime = OVER_TIME;
                this.awaitTimeIntv = window.setInterval(() => {
                    this.awaitTime--;
                }, 1000)
            }
        },
        // 登录移动积分商城，获取到积分值
        beforeCloseQuery(action, done) {
            // console.log(encodeForPwd('865375'));
            if (action === 'confirm') {
                if (!this.mobile) {
                    this.$notify('请输入手机号')
                    done(false)
                    return false
                }
                if (!this.verifyCode) {
                    this.$notify('请输入短信验证码')
                    done(false)
                    return false
                }
                if (this.verifyCode == sessionStorage.getItem('verifyCode')) {
                    this.$dialog.alert({
                        title: '提示',
                        message: '请输入最新的验证码！'
                    }).then(() => {
                        this.verifyCode = '';
                    })
                    done(false)
                    return false
                }
                sessionStorage.setItem('verifyCode', this.verifyCode);
                let data = {
                    mobile: this.mobile,
                    code: this.verifyCode
                }
                const toast = this.$toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    mask: true,
                    message: '查询中..',
                    loadingType: 'spinner',
                    selector: '#custom-selector'
                });
                this.$fly.post('/ydjf/logintoyd', common.obj2formdata(data))
                .then((res) => {
                    if (typeof res === 'string') res = JSON.parse(res);
                    let { d, m, s } = res;
                    if (s == 1) {
                        this.$toast.success({
                            message: m,
                            duration: 2000,
                        });
                        this.kyjf = d.kyjf || ''
                        // this.kyjf = '35550'
                        done();                     
                    } else {
                        this.$toast.clear();
                        this.$dialog.alert({
                            title: '错误',
                            message: m,
                            confirmButtonText: '关闭'
                        });
                        done(false);
                    }
                }).catch((err) => {
                    this.$toast.clear();
                    this.$dialog.alert({
                        title: '错误',
                        message: err,
                        confirmButtonText: '关闭'
                    });
                    done(false);
                })
            } else {
                done();
            }
        },
        // 选择积分包切换
        checkedHandler(index, item) {
            this.checked = index;
            this.item = item;
            // 初始化收货信息
            this.goodsRadio = 1;
            this.sjmobile = this.mobile;
            this.productItem = this.products.find(el => el.id == item.id) || {};            
            let productsArr = this.productItem.goods || '';
            this.productList = productsArr.split(',') || [];
        },
        // 确认选择积分包
        confirmCheck() {
            if (!this.item) {
                this.$notify('请先选择积分产品')
                return false
            }
            if (!this.name) {
                this.$notify('请输入收货人姓名')
                return false
            }
            if (!this.sjmobile) {
                this.$notify('请输入收货人手机号')
                return false
            }
            if (!this.areaName) {
                this.$notify('请选择收货地区')
                return false
            }
            if (!this.address) {
                this.$notify('请输入收货详细地址')
                return false
            }
            this.confirmCheckLoading = true;
            this.saveOrder1()
            .then(() => {
                return this.saveOrder2()
            }).then(() => {
                return this.saveOrder3()
            }).then(() => {
                this.submitDialog = true;
            }).catch((err) => {
                this.$dialog.alert({
                    title: '错误',
                    message: err,
                    confirmButtonText: '关闭'
                });
            }).finally(() => {
                this.confirmCheckLoading = false;
            })
        },
        saveOrder1() {
            return this.$fly.post('/ydjf/order', common.obj2formdata({
                wareid: this.item.wareid,
                score: this.item.score,
                mobile: this.mobile,
            })).then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                if (s == 1) {
                    return Promise.resolve();                    
                } else {
                    return Promise.reject(m)
                }
            }).catch((err) => {
                return Promise.reject(err)                
            })
        },
        saveOrder2() {
            return this.$fly.post('/ydjf/saveorder', common.obj2formdata({
                scoreid: this.item.id,
                adminid: localStorage.getItem('loginId'),
                mobile: this.mobile,
            })).then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                if (s == 1) {
                    this.orderid = d;
                    return Promise.resolve();                    
                } else {
                    return Promise.reject(m)
                }
            }).catch((err) => {
                return Promise.reject(err)                
            })
        },
        saveOrder3() {
            return this.$fly.post('/ydjf/saveadd', common.obj2formdata({
                name: this.name,
                sjmobile: this.sjmobile,
                orderid: this.orderid,
                address: this.areaName + this.address,
                goods: this.productList[this.goodsRadio-1]
            })).then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                if (s == 1) {
                    return Promise.resolve();
                } else {
                    return Promise.reject(m)
                }
            }).catch((err) => {
                return Promise.reject(err)                
            })
        },
        // 清除移动登录cookie
        clearCookies() {
            return this.$fly.post('/ydjf/clearcookies')
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                if (s == 1) {
                    this.kyjf = '';
                    this.mobile = '';
                    this.verifyCode = '';
                    this.checked = -1;
                    if (this.$refs.getConfirmcode) {
                        this.$refs.getConfirmcode.clearTimer();
                    }
                } else {
                    this.$notify(m);
                }
            }).catch((err) => {
                this.$dialog.alert({
                    title: '错误',
                    message: err,
                    confirmButtonText: '关闭'
                });
            })
        },
        // 退出系统
        onClickRight() {
            this.$dialog.confirm({
                title: '提示',
                message: '确定要退出登录吗？'
            }).then(() => {
                this.clearCookies().then(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('loginId');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('isadmin');
                    this.$router.replace('/login');
                })
            }).catch(() => {
                this.testAPI();
            })
        },

        testAPI() {
            return this.$fly.post('/ydjf/test')
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
            })
        },

        // 取消办单
        cancelHandle() {
            this.$toast.loading();
            this.clearCookies().then(() => {
                this.showError = false;
            }).finally(() => {
                this.$toast.clear();
            })
        },
        // 继续办单
        continueHandle() {
            this.kyjf = parseInt(this.kyjf) - parseInt(this.item.score);
            this.item = null;
            this.checked = null;
            this.showError = false;
        },

        // 选择商品、收货地址相关操作
        confirmArea(area) {
            this.areaName = `${area[0].name} ${area[1].name} ${area[2].name} `;
            this.areaShow = false;
        },
    },
    mounted() {
        this.getProducts()
        // 加载移动加密JS start
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'https://jf.10086.cn/scripts/encodeForPwd_jso-min.js';
        document.body.appendChild(s);
        // 加载移动加密JS end
        // this.errorTypeDialog(true, 0)
    },
    activated () {
        this.getProducts()
        this.userName = localStorage.getItem('userName');
    }
}
</script>

<style lang='less'>
.home {
    min-height: 100vh;
    background-color: #fff;
    padding-bottom: 40px;
    .container {
        .myJF {
            padding: 25px 15px;
            background-color: #409eff;
            color: #fff;
            display: flex;
            // flex-direction: column;
            // align-items: center;
            // justify-content: space-between;
            .binding {
                font-size: 14/11rem;
                // width: 100%;
                .value {
                    margin-top: 10px;
                    span {
                        font-size: 16/11rem;
                        font-weight: 700;
                    }
                }
            }
            .btn {
                height: 36px;
                padding: 0 20px;
                font-size: 13/11rem;
                border-radius: 6px;
                box-shadow: 0 0 6px #2f86e0;
                // margin-bottom: 15px;
            }
        }
        .checkout {
            .title {
                margin: 0;
                padding: 30px 15px 15px;
                color: rgba(69, 90, 100, 0.6);
                font-weight: normal;
                font-size: 14px;
            }
            .checkout-content {
                display: flex;
                flex-wrap: wrap;
                padding: 0 15px;
                .item {
                    // border-radius: 6px;
                    margin: 0 8px 8px 0;
                }
            }
            .sh-info {
                border: 1px solid #eee;
                // width: 80%;
                margin: 0 15px;
                border-radius: 5px;
                .van-cell {
                    padding: 10px 16px;
                }
            }
        }
        .btn-wp {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 30px 0;
            .btn {
                width: 200px;
                margin-bottom: 10px;
            }
            .text-btn {
                border: 0;
            }
        }
    }
    .dialog-content {
        padding: 15px 10px;
        .form-wp {
            width: 100%;
            .van-cell-group {
                margin-bottom: 15/11rem;
                // background-color: #f5f5f5;
                // border-color: #f5f5f5;
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
                    background-color: #f5f5f5;
                }
            }
            .flex-box {
                display: flex;
                align-items: center;
                .code {
                    width: 150px;
                    margin-left: 5px;
                    height: 50px;
                    line-height: 50px;
                    border-radius: 10px;
                    font-size: 12/11rem;
                    padding: 0;
                    border: 1px solid #409eff;
                }
            }
            .tip {
                color: #f30;
                font-size: 13/11rem;
                padding: 0 5px;
            }
            .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
                border: 0;
            }
        }
    }
    .errorType {
        padding: 20/11rem 0;
        display: flex;
        align-items: center;
        flex-direction: column;
        &.success {
            color: #07c160;
        }
        .waiting {
            font-size: 16/11rem;
            // padding-bottom: 10/11rem;
        }
        .error-text {
            font-size: 15/11rem;
        }
        .error-deco {
            padding-top: 10/11rem;
            font-size: 12/11rem;
            color: #f30;
        }
    }
    .error-btns {
        border-top: 1px solid #f1f1f1;
        display: flex;
        .btn {
            width: 100%;
        }
    }
    .van-dialog__confirm, .van-dialog__confirm:active {
        background-color: #409eff;
        color: #fff;
        .van-button__loading {
            width: 100%;
            background: #eee;
            padding: 1px 0;
            opacity: .6;
        }
        .van-loading__spinner {
            opacity: 0;            
        }
    }
}
</style>
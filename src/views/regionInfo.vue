<template>
<div class='region-info'>
    <topbar title="收货地址"></topbar>
    <div class="score-wp">
        <div class="score">
            <h3>兑换前：</h3>
            <span>{{kyjf}}</span>
        </div>
        <div class="score">
            <h3>已扣：</h3>
            <span>{{oldScore}}</span>
        </div>
        <div class="score">
            <h3>剩余：</h3>
            <span>{{newScore}}</span>
        </div>
    </div>
    <p class="tip">填写收货地址</p>
    <van-cell-group>
        <van-field v-model="name" label="姓名" placeholder="请输入姓名" />
        <van-field v-model="mobile" type="tel" label="手机号" placeholder="请输入收件人手机号" />
        <van-field v-model="areaName" type="textarea" label="选择地区" readonly placeholder="请选择地区" @click="areaShow=true" />
        <van-field v-model="address" type="textarea" label="详细地址" placeholder="请输入详细地址" />
    </van-cell-group>
    <p class="tip">选择发货商品</p>
    <van-radio-group v-model="radio">
        <van-cell-group>
            <van-cell v-for="(item, index) in productList" :key="index" :title="item" clickable @click="radio = (index+1)">
                <van-radio slot="right-icon" :name="index+1" />
            </van-cell>
        </van-cell-group>
    </van-radio-group>
    <div class="btn-wp">
        <van-button class="btn" type="info" :loading="isLoading" @click="onSubmit">确 定</van-button>
    </div>
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
import Topbar from '@/components/top-bar.vue';
import common from "../components/common";
import areaList from '@/area';
import { mapGetters } from 'vuex';
export default {
    name: 'RegionInfo',
    components: { Topbar },
    data() {
        return {
            mobile: '',
            id: '',
            kyjf: '',
            oldScore: '',
            newScore: '',
            productItem: {},

            name: '',
            areaName: '',
            address: '',
            areaList,
            areaShow: false,
            mobileLoc: '',
            productList: [],
            radio: 1,
            isLoading: false,
        };
    },
    computed: {
        ...mapGetters([
            'products'
        ])
    },
    watch: {
        products() {
            this.initData();
        }
    },
    methods: {
        getMobileLoc() {
            this.$fly.get('/ydjf/getmobileloc', { mobile: this.mobile })
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { content } = res;
                content = JSON.parse(content)
                let city = content.response[this.mobile].detail.area[0].city;
                let province = content.response[this.mobile].detail.province;
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
            })
        },
        confirmArea(area) {
            this.areaName = `${area[0].name} ${area[1].name} ${area[2].name} `;
            this.areaShow = false;
        },
        onSubmit() {
            this.$fly.post('/ydjf/saveadd', common.obj2formdata({
                name: this.name,
                sjmobile: this.mobile,
                orderid: this.id,
                address: this.areaName + this.address,
                goods: this.productList[this.radio-1]
            })).then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { m, s, d } = res
                if (s==1) {
                    this.$toast(m);
                    this.$router.replace('/')
                } else {
                    this.$notify(m)
                }
            })
        },
        initData() {
            this.mobile = this.$route.query.mobile;
            this.id = this.$route.query.id;
            this.kyjf = this.$route.query.kyjf;
            this.productItem = this.products.filter(item => item.id == this.$route.query.scoreid)[0] || {}        
            this.oldScore = this.productItem.score;
            this.newScore = this.$route.query.result;
            let productsArr = this.productItem.goods || '';
            this.productList = productsArr.split(',') || [];
        }
    },
    mounted() {
        this.initData();
        this.getMobileLoc();
    },
}
</script>

<style lang='less'>
.region-info {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 20px;
    .score-wp {
        padding: 10/11rem 15/11rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        .score {
            display: flex;
            align-items: baseline;
            h3 {
                font-size: 12/11rem;
            }
            span {
                color: #ff7140;
                font-size: 13/11rem;
            }
        }
    }
    .tip {
        background-color: #409eff;
        padding: 10/11rem 15/11rem;
        color: #fff;
        font-size: 13/11rem;
    }
    .van-cell {
        padding: 15px 16px;
    }
    .btn-wp {
        display: flex;
        justify-content: center;
        padding: 30px 0;
        .btn {
            width: 80%;
        }
    }
}
</style>
<template>
<div class='area-select'>
    <h3 class="label">选择地区：</h3>
    <van-cell-group class="input-group">
        <van-field v-model="prov" placeholder="选择省" readonly @click="selectProv" right-icon="arrow-down" />
        <van-field v-model="city" placeholder="选择市" readonly @click="selectCity" right-icon="arrow-down" />
        <van-field v-model="dist" placeholder="选择区" readonly @click="selectDist" right-icon="arrow-down" />
    </van-cell-group>
    <van-popup v-model="showSheet" closeable>
        <div class="sheet-wp">
            <h3 class="sheet-wp-title">选择{{sheetTitle}}</h3>
            <div class="sheet-wp-content">
                <van-button
                    class="item"
                    v-for="(item, index) in sheetItems"
                    :key="item.code"
                    :plain="checked(item.name)"
                    @click="checkedHandler(index, item)"
                    hairline
                    type="info"
                >
                    {{item.name}}
                </van-button>
            </div>
        </div>
    </van-popup>
</div>
</template>

<script>
import areaData from '@/yd-area';
import common from '@/components/common';

export default {
    name: 'AreaSelect',
    components: {},
    props: {
        mobile: {
            type: String,
            default: () => '',
        }
    },
    data() {
        let areas = areaData.data;
        return {
            showSheet: false,
            sheetTitle: '',
            sheetItems: [],
            // checked: -1,

            areas,
            provList: areas.provinceList,
            cityList: [],
            distList: [],
            prov: '',
            city: '',
            dist: '',
        };
    },
    watch: {
        prov(v, o) {
            this.city = '';
            this.dist = '';
            this.$emit('getArea', '');
            let code = this.provList.find(el => el.name == v).code;
            this.cityList = this.areas.cityList[code] || [];
        },
        city(v, o) {
            this.dist = '';
            this.$emit('getArea', '');
            setTimeout(() => {
                let cityItem = this.cityList.find(el => el.name == v) || {};
                this.distList = this.areas.districtList[cityItem.code] || [];
            }, 0);
        },
        // 收货号码变化的时候，获取手机号归属地
        mobile(v, o) {
            if (common.isVerificationNumber(v)) {
                this.$fly.get('/ydjf/getmobileloc', { mobile: v })
                .then((res) => {
                    if (typeof res === 'string') res = JSON.parse(res);
                    let { content } = res;
                    content = JSON.parse(content)
                    let city = content.response[v].detail.area[0].city;
                    let province = content.response[v].detail.province;
                    let provinceItem = this.provList.find(el => el.name.includes(province) || province.includes(el.name)) || {};
                    this.prov = provinceItem.name || '';
                    setTimeout(() => {
                        let cityItem = this.cityList.find(el => el.name.includes(city) || city.includes(el.name)) || {};
                        this.city = cityItem.name || '';
                    }, 0)
                }).catch((err) => {
                    this.$dialog.alert({
                        title: '错误',
                        message: err,
                        confirmButtonText: '关闭'
                    });
                })
            }
        },
    },
    methods: {
        selectProv() {
            this.sheetTitle = '省';
            this.sheetItems = this.provList;
            this.showSheet = true;
        },
        selectCity() {
            if (!this.prov) {
                this.$toast('请先选择省');
                return false;
            }
            this.sheetTitle = '市';
            this.sheetItems = this.cityList;
            this.showSheet = true;
        },
        selectDist() {
            if (!this.city) {
                this.$toast('请先选择市');
                return false;
            }
            this.sheetTitle = '区';
            this.sheetItems = this.distList;
            this.showSheet = true;
        },
        checked(name) {
            let eme = { '省': 'prov', '市': 'city', '区': 'dist'};
            return this[eme[this.sheetTitle]] != name;
        },
        checkedHandler(index, item) {
            // this.checked = index;
            if (this.sheetTitle == '省') {
                this.prov = item.name;
            }
            if (this.sheetTitle == '市') {
                this.city = item.name;
            }
            if (this.sheetTitle == '区') {
                this.dist = item.name;
                this.$emit('getArea', `${this.prov} ${this.city} ${this.dist}`);
            }
            this.showSheet = false;
            this.sheetItems = [];
        }
    },
    mounted() {
        console.log(111, this.mobile);
        
    },
}
</script>

<style lang='less'>
.area-select {
    padding-left: 16px;
    padding-bottom: 8px;
    .label {
        padding: 10px 0;
        font-size: 14px;
        font-weight: normal;
    }
    .input-group {
        display: flex;
        .van-cell {
            border-right: 1px solid #f5f5f5;
            cursor: pointer;
            &:last-child {
                border: 0;
            }
            &:first-child {
                border-left: 1px solid #f5f5f5;
            }
        }
    }
    .van-popup--center {
        border-radius: 6px;
        width: 75%;
        min-width: 300px;
        max-width: 650px;
    }
    .sheet-wp {
        padding: 5px 0;
        &-title {
            text-align: center;
            padding: 10px;
            font-size: 15px;
            font-weight: 600;
            border-bottom: 1px solid #eee;
            color: #666;
        }
        &-content {
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            .item {
                // border-radius: 6px;
                margin: 0 8px 8px 0;
                height: 36px;
                line-height: 34px;
                padding: 0 12px;
            }
        }
    }
}
</style>
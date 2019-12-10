<template>
<div class='my-order bg-f5'>
    <topbar title="我的订单"></topbar> 
    <div class="container">
        <div class="nothing" v-if="nothing">
            <img src="../assets/img/nothing.png" alt="">
            <p>暂无记录</p>
        </div>
        <div class="item" v-for="(item, index) in items" :key="index">
            <h2 class="title">
                <span class="name">手机号：{{item.mobile}}</span>
                <span class="amount">兑换积分：<strong>{{item.score}}</strong></span>
            </h2>
            <p class="flex">
                <span class="label">收货姓名：</span>
                <span class="value">{{item.name1 || ''}}</span>
            </p>
            <p class="flex">
                <span class="label">收货电话：</span>
                <span class="value">{{item.sjmobile || ''}}</span>
            </p>
            <p class="flex">
                <span class="label">发货商品：</span>
                <span class="value">{{item.goods || ''}}</span>
            </p>
            <p class="flex">
                <span class="label">收货地址：</span>
                <span class="value">{{item.address || ''}}</span>
            </p>
            <p class="date">{{item.donetime}}</p>
        </div>
    </div>
    <van-pagination 
        v-model="currentPage" 
        :page-count="pageCount"
        mode="simple" 
        @change="getOrders"
    />
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '@/components/common';

const PAGE_SIZE = 20;

export default {
    name: 'MyOrder',
    components: { Topbar },
    data() {
        return {
            items: [],
            jfList: [],
            nothing: false,
            currentPage: 1,
            pageTotal: 0,
        };
    },
    computed: {
        pageCount() {
            return Math.ceil(this.pageTotal / PAGE_SIZE);
        }
    },
    methods: {
        getOrders() {
            let data = {
                adminid: localStorage.getItem('loginId'),
                page: this.currentPage,
                status: '1',
            }
            this.$fly.get('/ydjf/getmyorder', data)
            .then((res) => {
                if (typeof res === 'string') res = JSON.parse(res);
                let { d, m, s } = res;
                if (s == 1) {
                    if (d.data) {
                        let list = d.data.list || [];
                        this.items = list;
                        this.pageTotal = d.data.paging.total
                    }
                    this.nothing = this.items.length == 0               
                } else {
                    this.$notify(m);
                }
            })
        },
    },
    mounted() {
        this.getOrders();
    },
}
</script>

<style lang='less'>
.my-order {
    .container {
        padding: 10px;
        .item {
            padding: 10px;
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 0 0 6px #eee;
            margin-bottom: 10px;
            width: 100%;
            .title {
                display: flex;
                align-items: center;
                font-size: 14/11rem;
                justify-content: space-between;
                padding-bottom: 5px;
                .amount {
                    strong {
                        font-size: 15/11rem;
                        color: #f40;
                    }
                }
                .name {
                    // font-weight: 700;
                }
            }
            .flex {
                display: flex;
                color: #676767;
                font-size: 12px;
                .label {
                    display: block;
                    width: 60px;
                }
                .value {
                    flex: 1;
                }
            }
            .date {
                color: #666;
                padding: 5px 0;
                font-size: 13/11rem;
            }
        }
        .nothing {
            text-align: center;
            padding: 40px 0;
            img {
                width: 100px;
                opacity: .4;
            }
            p {
                padding: 10px;
                font-size: 14/11rem;
                color: #999;
            }
        }
    }
    .van-pagination {
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #fff;
        z-index: 1;
        padding-top: 5px;
        max-width: 600px;
    }
}
</style>
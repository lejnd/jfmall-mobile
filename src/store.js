import Vue from 'vue'
import Vuex from 'vuex'
import common from './components/common.vue'

Vue.use(Vuex)

const vm = Vue.prototype;

const state = {
    products: [],
}

const getters = {
    products: (state) => state.products,
}

const actions = {
    // 获取产品包
    getProducts: ({ commit }) => {
        return vm.$fly.post('/ydjf/getscoreproduct', common.obj2formdata({ status: '1' }))
        .then((res) => {
            if (typeof res === 'string') res = JSON.parse(res);
            let { d, m, s } = res;
            if (s == 1) {
                commit('getProducts', d.products); 
            } else {
                vm.$notify(m);
            }
        })
    },
}

const mutations = {
    getProducts(state, data) {
        let isadmin = localStorage.getItem('isadmin') || '';
        let userName = localStorage.getItem('userName') || '';

        // 只有创度团队 isadmin==2 时才显示 38500 积分
        let host = window.location.host;
        if (isadmin != '2' && host == 'fwjf.kmfx1.com') {
            data = data.filter(item => item.score != '38500');
        } 
        // if (!userName.includes('保山') && host == 'fwjf.kmfx1.com') {
        //     data = data.filter(item => item.score != '9660');
        // } 
        state.products = data;
    }
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})

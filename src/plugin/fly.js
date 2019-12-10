import Vue from 'vue';
import router from '../router'
import fly from 'flyio';

// const debug = process.env.NODE_ENV !== 'production'

// fly.config = {
//     headers: {
//         Authorization: localStorage.getItem('Authorization') || '',
//         'Content-Type': 'application/json',
//     },
//     // baseURL: debug ? '/api' : '',             //请求基地址
//     timeout: 8000,             //超时时间，为0时则无超时限制
//     withCredentials: true,
// }

//添加请求拦截器
fly.interceptors.request.use((request)=>{
    //给所有请求添加自定义header
    request.headers['X-Tag']="flyio";
    request.headers['token'] = localStorage.getItem('token') || '';
    request.headers['adminid'] = localStorage.getItem('loginId') || '';
    request.headers['Content-Type'] = 'application/json';
    request.timeout = 60000;
    request.withCredentials = true;
    // return request;
})

//添加响应拦截器，
fly.interceptors.response.use(
    (response) => {
        //只将请求结果的data字段返回
        if (response.status == 200) {
            // return JSON.parse(response.data);
            return Promise.resolve(response.data);
        } else {
            return Promise.reject(response + '错误')
        }
    },
    (err) => {
        //发生网络错误后会走到这里        
        if (err.status == 404) {
            console.log('接口不存在');
            return Promise.reject("404 接口不存在")
        } else if (err.status == 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('loginId');
            localStorage.removeItem('userName');
            router.replace('/login')
            console.log('请重新登录');
            return Promise.reject("登录失效，请重新登录")
        } else if (err.message.includes('timeout')) {
            console.log(err);
            return Promise.reject("请求超时，请重试")
        } else {
            console.log(err);
            return Promise.reject("连接错误，请稍后重试")        
        }
    }
)

Vue.prototype.$fly = fly;
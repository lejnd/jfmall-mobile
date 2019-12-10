import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                requiresAuth: true,
                keepAlive: true,
            },
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "login" */ './views/login.vue'),
            meta: {}
        },
        {
            path: '/order',
            name: 'Order',
            component: () => import(/* webpackChunkName: "Order" */ './views/order.vue'),
            meta: {}
        },
        {
            path: '/region',
            name: 'regionInfo',
            component: () => import( /* webpackChunkName: "regionInfo" */ './views/regionInfo.vue')
        }
    ]
})

// authorization verify
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const loginId = localStorage.getItem('loginId');    // eslint-disable-line no-undef
        if (!loginId) {
            next({
                path: '/login',
                query: { redirect: to.fullPath },
            });
        } else {
            next();
        }
        next();
    } else {
        next();
    }
});

export default router;

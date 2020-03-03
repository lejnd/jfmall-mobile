const debug = process.env.NODE_ENV !== 'production'

console.log('debug:', debug)

module.exports = {
    // publicPath: '../addons/ewei_shopv2/static/vue_pay/',
    publicPath: debug ? '/' : '/static/',
    filenameHashing: false,
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/ydjf': {
                ws: false,
                target: 'http://test.kmfx1.com', 
                // target: 'http://test1127.kmfx1.com', 
                changOrigin: true,
                // pathRewrite: {
                //     '^/ydjf': 'ydjf1'
                // }
            },
        }
    }
}

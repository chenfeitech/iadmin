module.exports = {
    //关闭ESlint语法规范
    lintOnSave: false,
    // 解决跨域问题
    devServer: {
        // vue项目启动时的ip地址和端口
        host: '127.0.0.1',
        port: 8992,
        proxy: {
            // 匹配所有以 /api 开头的url
            '/api': {
                // 请求的目标主机
                target: process.env.VUE_APP_URL,
                // https需要配置secure
                // secure:true,
                changeOrigin: true,
                ws: true,
                // 这样重写会把路径中 /api 消去
                // pathRewrite: {
                //   '^/api': '/api'
                // }
                logLevel:"debug",
            }
        },
        //关闭ESlint语法规范
        overlay: {
            warning: false,
            errors: false
        }
    },
}

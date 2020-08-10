
console.log(process.env.NODE_ENV)
module.exports = {
  devServer: {
    port: 3000,
    open: false
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.plugin('html').tap(args => {
        args[0].isProd = true
        args[0].title = '正式环境'
        return args
      })
    })

    config.when(process.env.NODE_ENV === 'development', config => {
      config.plugin('html').tap(args => {
        args[0].isProd = false
        args[0].title = '测试环境'
        return args
      })
    })
  }
}
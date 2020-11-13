module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        'vue-quill-editor': 'VueQuillEditor',
        'element-ui': 'ELEMENT'
      })
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  },
  // 基本路径
  publicPath: './',
  // 构建时的输出的目录
  outputDir: 'dist',
  // 放置静态资源的目录
  assetsDir: 'static',
  // html的输出路径
  indexPath: 'index.html',
  // 文件名哈希
  filenameHashing: true,
  devServer: {
    open: true,
    port: 3000
  }
}

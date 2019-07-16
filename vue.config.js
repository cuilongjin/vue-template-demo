const path = require('path')
// const vConsolePlugin = require('vconsole-webpack-plugin') // 引入 移动端模拟开发者工具 插件 （另：https://github.com/liriliri/eruda）
const CompressionPlugin = require('compression-webpack-plugin') // Gzip
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // Webpack包文件分析器
const baseUrl = process.env.NODE_ENV === 'production' ? '/static/' : '/' // font scss资源路径 不同环境切换控制

// webpack配置
// https://cli.vuejs.org/zh/guide/webpack.html
const configureWebpack = config => {
  // 生产 and 测试环境
  let pluginsPro = [
    new CompressionPlugin({
      // 文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-webpack-plugin)
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
      threshold: 8192,
      minRatio: 0.8
    }),
    //	Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
    // new BundleAnalyzerPlugin(),

    // 打包时删除 debugger 和 console
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          drop_debugger: true,
          drop_console: true
        }
      },
      sourceMap: true,
      parallel: true
    })
  ]
  // 开发环境
  let pluginsDev = [
    //  移动端模拟开发者工具 (https://github.com/diamont1001/vconsole-webpack-plugin  https://github.com/Tencent/vConsole)
    // new vConsolePlugin({
    //   filter: [], // 需要过滤的入口文件
    //   enable: true // 发布代码前记得改回 false
    // })
  ]
  if (process.env.NODE_ENV === 'production') {
    // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
    config.plugins = [...config.plugins, ...pluginsPro]
  } else {
    // 为开发环境修改配置...
    // config.plugins = [...config.plugins, ...pluginsDev]
  }
}

/**
 * 对内部的 webpack 配置进行更细粒度的修改 https://github.com/neutrinojs/webpack-chain see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
 */
const chainWebpack = config => {
  /**
   * 删除懒加载模块的 prefetch，降低带宽压力
   * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
   * 而且预渲染时生成的prefetch标签是modern版本的，低版本浏览器是不需要的
   */
  // 移除 prefetch 插件
  config.plugins.delete('prefetch')
  // 移除 preload 插件
  config.plugins.delete('preload')

  /* 配置绝对路径 */
  config.resolve.alias.set('~', path.resolve('public'))
  // config.resolve.alias.set('@', path.resolve('src'))

  /* 使用 svg-sprite-loader 处理 svg */
  // 默认规则忽略 src/icons 文件夹
  config.module
    .rule('svg')
    .exclude.add(path.resolve(__dirname, 'src/icons'))
    .end()

  // src/icons 文件夹下的 svg 使用 svg-sprite-loader
  config.module
    .rule('svg-sprite-loader')
    .include.add(path.resolve(__dirname, 'src/icons'))
    .end()
    .test(/\.svg$/)
    .use('svg-sprite')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'icon-[name]'
    })
    .end()
    .use('svgo-loader')
    .loader('svgo-loader')
    .tap(options => {
      options = {
        plugins: [
          { removeXMLNS: true }, // 删除xmlns属性（对于内联svg，默认情况下禁用）
          { convertStyleToAttrs: true } // 将css样式转换为svg元素属性
        ]
      }
      return options
    })

  // if(process.env.NODE_ENV === 'production') { // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
  // } else {// 为开发环境修改配置...
  // }

  // config.plugin('html').tap(args => {
  //   args[0].minify = false
  //   return args
  // })
}

module.exports = {
  // https://cli.vuejs.org/zh/config/
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  // filenameHashing: false,
  pages: {
    index: {
      // page 的入口
      entry: 'src/pages/index/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page'
    },
    pageA: {
      entry: 'src/pages/pageA/main.js',
      template: 'public/index.html',
      filename: 'pageA.html'
    },

    // 当使用只有入口的字符串格式时, 模板会被推导为 `public/pageB.html`
    // 并且如果找不到的话，就回退到 `public/index.html`, 输出文件名会被推导为 `pageB.html`
    pageB: 'src/pages/pageB/main.js'
  },
  lintOnSave: true,
  runtimeCompiler: false,
  productionSourceMap: false,
  parallel: require('os').cpus().length > 1,
  pwa: {},

  // 调整 webpack 配置
  configureWebpack,
  // 对内部的 webpack 配置进行更细粒度的修改
  chainWebpack,

  // CSS 相关 loader
  css: {
    modules: false, // 启用 CSS modules 默认 false
    extract: true, // 是否使用 css 分离插件，默认生产环境下是 true，开发环境下是 false
    sourceMap: false, // 是否为 CSS 开启 source map, 默认 false
    // css预设器配置项
    loaderOptions: {
      less: {},
      sass: {}
    }
  },

  // webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
  devServer: {
    // host: 'localhost',
    // port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器
    hotOnly: true, // 热更新

    /**
     * 可以是字符串或对象
     */
    // proxy: '<url>' // 任何未知请求代理到 <url>
    proxy: {
      '/api/': {
        target: '<url>', // 目标服务器
        changeOrigin: true,
        // ws: true, //websocket支持
        secure: false
      },
      '/pbsevice/*': {
        target: '<url>',
        changeOrigin: true,
        secure: false
      }
    }
  },

  // 第三方插件配置 https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
  pluginOptions: {
    'style-resources-loader': {
      // https://github.com/yenshih/style-resources-loader
      preProcessor: 'scss', // 声明类型
      patterns: [
        // path.resolve(__dirname, './src/assets/scss/_common.scss'),
      ]
      // injector: 'append'
    }
  }
}

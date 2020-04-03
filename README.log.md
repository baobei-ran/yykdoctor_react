# 开发日志

   1. 在 config/webpack.config.js 中设置

    搜索 output 在output： {}, 后面加入 即可
    externals: {   // 打包时，不打入进去， 使用cdn引入
      'html2canvas': 'html2canvas',
      'swiper': 'Swiper',
    },
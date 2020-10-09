/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2020-09-30 20:27:12
 */
// ref: https://umijs.org/config/

export default {
  treeShaking: true, 
  history: 'hash',
  // publicPath: '/static/p2/',
  publicPath: '/p2/',
  theme: {
    'primary-color': '#39bbdb',
    // 'primary-color': '#94CEDC', 甲方原来颜色
    // 'primary-color': '#4279E4', 蓝色
    // 'primary-color': '#009688', 绿色
    'heading-color': '#191919',
    'text-color': '#404040',
    'text-color-secondary': '#666666'
  },
  //webpack copy favicon 文件，由于document.ejs没有引入，所以不会自动打包输出
  copy: ['/src/assets/favicon.png'],
  //部署到非根目录路径
  base: 'p2',
  hash: true,
  //静态资源到非根目录
  proxy: {
    '/api/v1': {
      target: 'http://39.106.111.52/api',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    },
    '/api': {
      target: 'http://39.106.111.52/p2/api',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  },
  targets: { chrome: 49, firefox: 45, safari: 10, edge: 13, ios: 10 },
  routes: [
    {
      path: '/',
      redirect: '/sample'
    },
    {
      path: '/',
      component: '../layouts/GlobalRouter',
      routes: [
        {
          path: '/sample',
          component: '../layouts/PageHeader',
          routes: [
            {
              path: '/sample',
              component: '../pages/SampleList/index'
            },
            {
              path: '/sample/:id/crf',
              component: '../pages/CRFdetail/index'
            }
          ]
        }
      ]
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'pet-flask-refactor',
        dll: false,

        routes: {
          exclude: [/models\//, /services\//, /model\.(t|j)sx?$/, /service\.(t|j)sx?$/, /components\//]
        }
      }
    ],
    [
      'babel-plugin-transform-react-remove-prop-types',
      {
        mode: 'wrap',
        ignoreFilenames: ['node_modules']
      }
    ]
  ]
}

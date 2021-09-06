import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: '/',
  runtimePublicPath: true,
  nodeModulesTransform: {
    type: 'none',
  },
  // https://github.com/umijs/umi/issues/6766
  mfsu: {},
  routes: [
    {
      path: '/',
      component: '../layouts',
      routes: [
        { path: '/', component: 'preview' },
        { path: '/pure', component: 'pure' },
        { path: '/protest', component: 'protest' },
      ],
    },
  ],
  title: false,
  fastRefresh: {},
  mock: false,
  locale: {},
  favicon: 'https://i.alipayobjects.com/common/favicon/favicon.ico',

  externals: {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
    'plotly.js-dist': 'Plotly',
    lodash: '_',
    'chroma-js': 'chroma',
  },
  scripts: process.env.NODE_ENV === 'development' ? [
    'https://gw.alipayobjects.com/os/lib/react/16.13.1/umd/react.development.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/16.13.1/umd/react-dom.development.js',
    'https://gw.alipayobjects.com/os/lib/plotly.js-dist/2.3.1/plotly.js',
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.js',
    'https://gw.alipayobjects.com/os/lib/chroma-js/2.1.2/chroma.min.js',
  ] : [
    'https://gw.alipayobjects.com/os/lib/react/16.13.1/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/16.13.1/umd/react-dom.production.min.js',
    'https://gw.alipayobjects.com/os/lib/plotly.js-dist/2.3.1/plotly.js',
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.js',
    'https://gw.alipayobjects.com/os/lib/chroma-js/2.1.2/chroma.min.js',
  ],
  esbuild:{}
});

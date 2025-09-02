// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV } = process.env;
// config/config.ts
export default defineConfig({
  hash: true,
  extraBabelIncludes: ['@bytemd'],
  chainWebpack(config) {
    config.module
        .rule('mjs')
        .test(/\.mjs$/)
        .include
        .add(/node_modules/)
        .end()
        .type('javascript/auto');
  },
  antd: {
    dark: false,
  },
  dva: {
    hmr: true,
  },
  history: {
    type: 'hash',
  },
  locale: {
    // default zh-CN
    // enable: true,
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
    // baseSeparator: '-', // 语言文件命名分隔符（如 zh-CN.ts）
  },
  // plugins: ['@umi/plugins/dist/locale'],
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'border-radius-base': '4px',
    'font-size-base': '13px',
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
  lessLoader: {
    modifyVars: {
      'root-entry-name': 'default'
    }
  },
});

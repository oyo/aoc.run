import { defineConfig } from 'vite-plus'
import Config from './src/aoc/config'

export default defineConfig({
  base: `${Config.BASE_UI}/`,
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: Config.PORT,
    strictPort: true,
    proxy: {
      '/static': {
        target: Config.BASE_AOC,
        changeOrigin: true,
      },
      '/aoc/': {
        target: Config.BASE_AOC,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/aoc/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader('cookie', process.env.AOC_COOKIE)
          })
          proxy.on('proxyRes', (proxyRes, _req, _res) => {
            proxyRes.headers['Expires'] = 'Sun, 17 Jan 2038 19:14:07 GMT'
          })
        },
      },
    },
  },
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    semi: false,
    singleQuote: true,
    ignorePatterns: ['dist/**'],
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
})

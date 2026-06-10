// aoc proxy server
//
// already configured as vite built-in proxy in vite.config.js but
// keeping it as a separate script in case vite should become obsolete
//
// export AOC_COOKIE='session=<your_aoc_session_cookie>'
// node src/aoc/proxy
// open http://localhost:4001/aoc/2025/day/1/input

import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import Config from './config.js'

const app = express()

app.use(
  '/aoc',
  createProxyMiddleware({
    target: Config.BASE_AOC,
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      '^/aoc': '/',
    },
    on: {
      proxyReq: (proxyReq) => {
        proxyReq.setHeader('cookie', process.env.AOC_COOKIE)
      },
      proxyRes: (proxyRes) => {
        proxyRes.headers['Expires'] = 'Sun, 17 Jan 2038 19:14:07 GMT'
      },
      error: (err, req, res) => {
        console.error('Proxy error:', err)
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        })
        res.end('Proxy error occurred.')
      },
    },
  }),
)

app.listen(Config.PORT, () => {
  console.log(`AoC proxy listening on port ${Config.PORT}`)
})

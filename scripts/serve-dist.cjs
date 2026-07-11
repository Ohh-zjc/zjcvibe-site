const http = require('http')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..', 'dist')
const port = Number(process.env.PORT || 5173)
const base = '/dongtinghu'

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
}

function sendIndex(res) {
  fs.readFile(path.join(root, 'index.html'), (error, data) => {
    if (error) {
      res.statusCode = 404
      res.end('Not found')
      return
    }
    res.setHeader('Content-Type', contentTypes['.html'])
    res.end(data)
  })
}

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split('?')[0])

  if (!pathname.startsWith(base)) {
    res.statusCode = 302
    res.setHeader('Location', `${base}/`)
    res.end()
    return
  }

  const relativePath = pathname.slice(base.length) || '/'
  const filePath = path.join(root, relativePath === '/' ? 'index.html' : relativePath)

  if (!filePath.startsWith(root)) {
    res.statusCode = 403
    res.end('Forbidden')
    return
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendIndex(res)
      return
    }
    res.setHeader('Content-Type', contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream')
    res.end(data)
  })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Static preview: http://localhost:${port}${base}/`)
})

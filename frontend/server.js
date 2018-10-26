const express = require('express')
const path = require('path')
const next = require('next')

const routes = require('./routes')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = routes.getRequestHandler(app)

// loaded translations we can bootstrap our routes
app.prepare().then(() => {
  const server = express()

  // serve general static files
  server.use('/static', express.static(path.join(__dirname, '/static')))

  // use next.js
  server.get('*', (req, res) => handle(req, res))

  server.listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})

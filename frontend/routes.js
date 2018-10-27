const routes = (module.exports = require('next-routes')())

routes.add('/', 'index')
routes.add('/claim', 'claim')
routes.add('/addreth/:addreth', 'addreth')

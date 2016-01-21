const dev = process.NODE_ENV !== 'production'

// Register babel and others in development
if (dev) {
  require('./lib/server/dev')
}

const code = dev ? 'lib' : 'build'
require(`./${code}/server/index`)

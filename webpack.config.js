const getConfig = require('hjs-webpack')

var config = getConfig({
  in: 'lib/client/index.js',
  out: 'public',
  html: function (context) {
    return {
      'index.html': context.defaultTemplate({
        title: 'Stack'
      })
    }
  }
})

if (config.devServer) {
  config.devServer.proxy = {
    '*': 'http://localhost:4321'
  }
}

console.dir(config, {depth: 10})

module.exports = config

require('babel-register')
require.extensions['.less'] = function () { return null }
global.__SERVER__ = true

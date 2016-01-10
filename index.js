const fs = require('fs')
const formBody = require('body/form')
const bodyParser = require('body-parser')
const express = require('express')

const server = express()

var app = {
  rooms: {}
}

server.use(express.static('public'))
server.use(bodyParser.urlencoded({ extended: true }))

server.post('/create', (req, res) => {
  const room_name = req.body.room_name

  // TODO: Validate body.room_name

  res.redirect(`/room/${room_name}`)
})

server.use((req, res) => {
  var name, parts
  if (req.url.indexOf('/room/') === 0) {
    parts = req.url.match(/\/room\/(.+)/)
    name = decodeURIComponent(parts && parts[1])
    if (!name) error(res)
    else {
      app.rooms[name] = app.rooms[name] || createRoom(name)
      fs.createReadStream('public/room.html').pipe(res)
    }
  } else if (req.url.indexOf('/add/') === 0 && req.method === 'POST') {
    parts = req.url.match(/\/add\/(.+)/)
    name = decodeURIComponent(parts && parts[1])
    if (!name) error(res)
    else {
      formBody(req, {}, (err, body) => {
        if (err) error(res)
        else {
          push(app.rooms[name] || createRoom(name), body.queue_name)
          if (req.headers.accept === 'application/json') {
            res.end(JSON.stringify(app.rooms[name]))
          } else {
            redirect(res, `/room/${name}`).end()
          }
        }
      })
    }
  } else if (req.url.indexOf('/pop/') === 0 && req.method === 'POST') {
    parts = req.url.match(/\/pop\/(.+)/)
    name = decodeURIComponent(parts && parts[1])
    if (!name) error(res)
    else {
      pop(app.rooms[name] || createRoom(name))
      if (req.headers.accept === 'application/json') {
        res.end(JSON.stringify(app.rooms[name]))
      } else {
        redirect(res, `/room/${name}`).end()
      }
    }
  } else if (req.url.indexOf('/queue/') === 0) {
    parts = req.url.match(/\/queue\/(.+)/)
    name = decodeURIComponent(parts && parts[1])
    if (!name) error(res)
    else {
      res.end(JSON.stringify(app.rooms[name]))
    }
  } else {
    res.end('nope')
  }
})

server.listen(process.env.PORT || 4321)

function redirect (res, url) {
  res.writeHead(302, {
    'Location': url
  })
  return res
}

function error (res) {
  res.statusCode = 500
  res.end('error')
  return res
}

function createRoom () {
  return { queue: [], lastUpdated: now() }
}

function push (room, name) {
  room.queue.push(name)
  room.lastUpdated = now()
}

function pop (room) {
  room.queue.shift()
  room.lastUpdated = now()
}

function now () {
  return new Date().toJSON()
}

setInterval(() => {
  var n = Date.now()
  Object.keys(app.rooms).forEach((key) => {
    if (n - new Date(app.rooms[key].lastUpdated) > 24 * 60 * 60 * 1000) {
      delete app.rooms[key]
    }
  })
}, /* once a day */ 24 * 60 * 60 * 1000)

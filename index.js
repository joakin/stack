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

server.get('/room/:name', (req, res) => {
  const name = req.params.name

  app.rooms[name] = app.rooms[name] || createRoom(name)

  res.sendFile(__dirname + '/public/room.html')
})

server.post('/add/:room_name', (req, res) => {
  const room_name = req.params.room_name
  const queue_name = req.body.queue_name

  // TODO: Validate `room_name` room exists

  push(app.rooms[room_name] || createRoom(room_name), queue_name)

  res.format({
    json: () => res.json(app.rooms[room_name])
  })
})

server.post('/pop/:room_name', (req, res) => {
  const room_name = req.params.room_name

  // TODO: Validate `room_name` room exists

  pop(app.rooms[room_name] || createRoom(room_name))

  res.format({
    json: () => res.json(app.rooms[room_name])
  })
})

server.use((req, res) => {
  var name, parts
  if (req.url.indexOf('/queue/') === 0) {
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

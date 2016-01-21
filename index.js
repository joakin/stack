const bodyParser = require('body-parser')
const express = require('express')

const server = express()

var app = {
  rooms: {}
}

server.use(express.static('public'))
server.use(bodyParser.urlencoded({ extended: true }))

server.get('/api/room/:name', (req, res) => {
  const name = req.params.name
  app.rooms[name] = app.rooms[name] || createRoom(name)
  res.json(app.rooms[name])
})

server.post('/api/add/:room_name', (req, res) => {
  const room_name = req.params.room_name
  const stack_name = req.body.stack_name

  // TODO: Validate `room_name` room exists

  push(app.rooms[room_name] || createRoom(room_name), stack_name)

  res.json(app.rooms[room_name])
})

server.post('/api/pop/:room_name', (req, res) => {
  const room_name = req.params.room_name

  // TODO: Validate `room_name` room exists

  pop(app.rooms[room_name] || createRoom(room_name))

  res.json(app.rooms[room_name])
})

server.get('*', (req, res) => res.sendFile(__dirname + '/public/index.html'))

server.listen(process.env.PORT || 4321)

function createRoom (name) {
  return { name: name, participants: [], lastUpdated: now() }
}

function push (room, name) {
  room.participants.push(name)
  room.lastUpdated = now()
}

function pop (room) {
  room.participants.shift()
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

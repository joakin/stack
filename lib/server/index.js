import bodyParser from 'body-parser'
import express from 'express'
import {room, addParticipant, removeParticipant} from '../client/state'
import path from 'path'

const server = express()

let app = {
  rooms: {}
}

server.use(express.static('public'))
server.use(bodyParser.urlencoded({ extended: true }))

server.get('/api/room/:name', (req, res) => {
  const name = req.params.name
  app.rooms[name] = app.rooms[name] || room({name})
  res.json(app.rooms[name])
})

server.post('/api/add/:room_name', (req, res) => {
  const room_name = req.params.room_name
  const stack_name = req.body.stack_name

  // TODO: Validate `room_name` room exists

  const room = app.rooms[room_name] || room({name: room_name})
  app.rooms[room_name] = addParticipant(room_name, stack_name, {room}).room

  res.json(app.rooms[room_name])
})

server.post('/api/pop/:room_name', (req, res) => {
  const room_name = req.params.room_name

  // TODO: Validate `room_name` room exists

  const room = app.rooms[room_name] || room({name: room_name})
  app.rooms[room_name] = removeParticipant(room_name, {room}).room

  res.json(app.rooms[room_name])
})

server.get('*', (req, res) => res.sendFile(path.resolve('./public/index.html')))

server.listen(process.env.PORT || 4321)

setInterval(() => {
  var n = Date.now()
  Object.keys(app.rooms).forEach((key) => {
    if (n - new Date(app.rooms[key].lastUpdated) > 24 * 60 * 60 * 1000) {
      delete app.rooms[key]
    }
  })
}, /* once a day */ 24 * 60 * 60 * 1000)

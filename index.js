const http = require('http')
const fs = require('fs')
const formBody = require('body/form')

var app = {
  rooms: {}
}

http.createServer((req, res) => {
  var name, parts
  if (req.url === '/') {
    fs.createReadStream('index.html').pipe(res)
  } else if (req.url === '/style.css') {
    fs.createReadStream('style.css').pipe(res)
  } else if (req.url === '/create' && req.method === 'POST') {
    formBody(req, {}, (err, body) =>
      err ? error(res)
        : redirect(res, `/room/${body.room_name}`).end())
  } else if (req.url === '/room/' && req.method === 'POST') {
    fs.createReadStream('index.html').pipe(res)
  } else if (req.url.indexOf('/room/') === 0) {
    parts = req.url.match(/\/room\/(.+)/)
    name = decodeURIComponent(parts && parts[1])
    if (!name) error(res)
    else {
      app.rooms[name] = app.rooms[name] || createRoom(name)
      fs.createReadStream('room.html').pipe(res)
    }
  } else if (req.url.indexOf('/add/') === 0 && req.method === 'POST') {
    parts = req.url.match(/\/add\/(.+)/)
    name = decodeURIComponent(parts && parts[1])
    if (!name) error(res)
    else {
      formBody(req, {}, (err, body) => {
        if (err) error(res)
        else {
          addParticipant(app.rooms[name] || createRoom(name), body.queue_name)
          redirect(res, `/room/${name}`).end()
        }
      })
    }
  } else if (req.url.indexOf('/pop/') === 0 && req.method === 'POST') {
    parts = req.url.match(/\/pop\/(.+)/)
    name = decodeURIComponent(parts && parts[1])
    if (!name) error(res)
    else {
      pop(app.rooms[name] || createRoom(name))
      redirect(res, `/room/${name}`).end()
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
}).listen(process.env.PORT || 4321)

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
  return { queue: [] }
}

function addParticipant (room, name) { room.queue.push(name) }

function pop (room) { room.queue.shift() }

import md from './mdown'
import escapeHTML from './escape-html'
import ajaxifyForm from './ajaxify-form'

const rawRoomName = window.location.pathname.match(/\/room\/(.+)/)[1]
const roomName = escapeHTML(decodeURIComponent(rawRoomName))
console.log(roomName)

document.querySelector('h1').innerHTML += ' ' + roomName.trim()
ajaxifyForm('form', roomName, newRoom)
ajaxifyForm('formpop', roomName, newRoom)

let queue = document.getElementById('queue')
let state = { queue: [], lastUpdated: null }
let minutesTillStaleAlarm = 5 * 60 * 1000
let mute = document.getElementById('mute')

askForQueue()

setInterval(askForQueue, 1000)
setInterval(checkStale, minutesTillStaleAlarm)

function askForQueue () {
  let req = new XMLHttpRequest()
  req.onreadystatechange = function () {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 200) {
        let room = JSON.parse(req.responseText)
        console.log(room)
        newRoom(room)
      } else {
        console.log('nope', req.status)
      }
    }
  }
  req.open('GET', '/room/'+roomName)
  req.setRequestHeader('Accept', 'application/json')
  req.send(null)
}

function checkStale () {
  if (new Date() - new Date(state.lastUpdated) > minutesTillStaleAlarm) {
    if (state.queue.length > 0) {
      playAudio('baby')
    }
  }
}

function newRoom (room) {
  if (state.queue.length !== room.queue.length) {
    playAudio('bing')
  }
  renderRoom(room)
  state = room
}

function renderRoom (room) {
  queue.innerHTML = room.queue.map(renderLi).join('')
}

function renderLi (name) { return '<li>' + md.render(escapeHTML(name)) + '</li>' }

function playAudio (id) {
  if (!mute.checked) {
    document.getElementById(id).cloneNode().play()
  }
}


import md from './mdown'
import escapeHTML from './escape-html'
import ajaxifyForm from './ajaxify-form'
import askForQueue from './ask-for-queue'

const rawRoomName = window.location.pathname.match(/\/room\/(.+)/)[1]
const roomName = escapeHTML(decodeURIComponent(rawRoomName))
console.log(roomName)

document.querySelector('h1').innerHTML += ' ' + roomName.trim()
ajaxifyForm('form', roomName, newRoom)
ajaxifyForm('formpop', roomName, newRoom)

let queue = document.getElementById('queue')
let state = { queue: [], lastUpdated: null }
const minutesTillStaleAlarm = 5 * 60 * 1000
let mute = document.getElementById('mute')

askForQueue(roomName, newRoom)

setInterval(() => askForQueue(roomName, newRoom), 1000)
setInterval(checkStale, minutesTillStaleAlarm)

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


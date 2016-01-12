import escapeHTML from './escape-html'
import ajaxifyForm from './ajaxify-form'
import askForQueue from './ask-for-queue'
import renderQueue from './render-queue'
import checkStale, {MINUTES_TILL_STALE_ALARM} from './check-state-stale'

const rawRoomName = window.location.pathname.match(/\/room\/(.+)/)[1]
const roomName = escapeHTML(decodeURIComponent(rawRoomName))
console.log(roomName)

document.querySelector('h1').innerHTML += ' ' + roomName.trim()
ajaxifyForm('form', roomName, newRoom)
ajaxifyForm('formpop', roomName, newRoom)

let queue = document.getElementById('queue')
let state = { queue: [], lastUpdated: null }
let mute = document.getElementById('mute')

askForQueue(roomName, newRoom)

setInterval(() => askForQueue(roomName, newRoom), 1000)
setInterval(() =>
  checkStale(state, () => playAudio('baby')),
  MINUTES_TILL_STALE_ALARM)

function newRoom (room) {
  if (state.queue.length !== room.queue.length) {
    playAudio('bing')
  }
  renderQueue(room, queue)
  state = room
}

function playAudio (id) {
  if (!mute.checked) {
    document.getElementById(id).cloneNode().play()
  }
}


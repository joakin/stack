import escapeHTML from './escape-html'
import ajaxifyForm from './ajaxify-form'
import askForStack from './ask-for-stack'
import renderStack from './render-stack'
import checkStale, {MINUTES_TILL_STALE_ALARM} from './check-state-stale'

const rawRoomName = window.location.pathname.match(/\/room\/(.+)/)[1]
const roomName = escapeHTML(decodeURIComponent(rawRoomName))
console.log(roomName)

document.querySelector('h1').innerHTML += ' ' + roomName.trim()
ajaxifyForm('form', roomName, newRoom)
ajaxifyForm('formpop', roomName, newRoom)

let stack = document.getElementById('stack')
let state = { stack: [], lastUpdated: null }
let mute = document.getElementById('mute')

askForStack(roomName, newRoom)

setInterval(() => askForStack(roomName, newRoom), 1000)
setInterval(() =>
  checkStale(state, () => playAudio('baby')),
  MINUTES_TILL_STALE_ALARM)

function newRoom (room) {
  if (state.stack.length !== room.stack.length) {
    playAudio('bing')
  }
  renderStack(room, stack)
  state = room
}

function playAudio (id) {
  if (!mute.checked) {
    let original = document.getElementById(id)
    let clone = original.cloneNode()
    clone.volume = original.getAttribute('volume')
    clone.play()
  }
}

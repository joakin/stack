import md from './mdown'
var room_name = escapeHTML(decodeURIComponent(location.pathname.match(/\/room\/(.+)/)[1]))
console.log(room_name)
document.querySelector('h1').innerHTML += ' ' + room_name.trim()
hijackForm('form', room_name)
hijackForm('formpop', room_name)
var queue = document.getElementById('queue')
var state = { queue: [], lastUpdated: null }
var minutesTillStaleAlarm = 5 * 60 * 1000
var mute = document.getElementById('mute')

askForQueue()

setInterval(askForQueue, 1000)
setInterval(checkStale, minutesTillStaleAlarm)

function askForQueue () {
  var req = new XMLHttpRequest()
  req.onreadystatechange = function () {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 200) {
        var room = JSON.parse(req.responseText)
        console.log(room)
        newRoom(room)
      } else {
        console.log('nope', req.status)
      }
    }
  }
  req.open('GET', '/room/'+room_name)
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

function escapeHTML (s) {
  var tmp = document.createElement('span')
  tmp.textContent = s
  return tmp.innerHTML
}

function submitForm (form, fn) {
  var params = toArray(form.querySelectorAll('[name]')).reduce((s, input, i) => {
    s += (i === 0 ? '' : '&') +
      encodeURIComponent(input.name) + '=' +
      encodeURIComponent(input.value)
    return s
  }, '')
  var req = new XMLHttpRequest()
  req.onreadystatechange = function () {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 200) {
        try {
          var resp = JSON.parse(req.responseText)
          fn(null, resp)
        } catch (e) {
          fn(e)
        }
      } else {
        fn(new Error('Request failed w/ status code', req.status))
      }
    }
  }

  req.open('POST', form.action)
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  req.setRequestHeader('Accept', 'application/json')
  req.send(params)
}

function toArray (xs) { return Array.prototype.slice.call(xs) }

function hijackForm (formid, room_name) {
  var form = document.getElementById(formid)
  form.setAttribute('action', form.getAttribute('action') + '/' + room_name)
  form.onsubmit = (e) => {
    submitForm(form, (err, resp) => {
      if (err) console.log(err.message)
      else {
        console.log(resp)
        newRoom(resp)
      }
    })
    return false
  }
}

function playAudio (id) {
  if (!mute.checked) {
    document.getElementById(id).cloneNode().play()
  }
}


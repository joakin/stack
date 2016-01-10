var md = mdown()
var room_name = escapeHTML(decodeURIComponent(location.pathname.match(/\/room\/(.+)/)[1]))
console.log(room_name)
document.querySelector('h1').innerHTML += ' ' + room_name.trim()
hijackForm('form', room_name)
hijackForm('formpop', room_name)
var queue = document.getElementById('queue')
var state = { queue: [], lastUpdated: null }
var minutesTillStaleAlarm = 5 * 60 * 1000

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
  document.getElementById(id).cloneNode().play()
}

// From https://gist.github.com/renehamburger/12f14a9bd9297394e5bd
function mdown () {
  return {
    rules: [
      {regex: /(#+)(.*)/g, replacement: header},                                         // headers
      {regex: /!\[([^\[]+)\]\(([^\)]+)\)/g, replacement: '<img src=\'$2\' alt=\'$1\'>'}, // image
      {regex: /\[([^\[]+)\]\(([^\)]+)\)/g, replacement: '<a href=\'$2\'>$1</a>'},        // hyperlink
      {regex: /(\*\*|__)(.*?)\1/g, replacement: '<strong>$2</strong>'},                  // bold
      {regex: /(\*|_)(.*?)\1/g, replacement: '<em>$2</em>'},                             // emphasis
      {regex: /\~\~(.*?)\~\~/g, replacement: '<del>$1</del>'},                           // del
      {regex: /\:\"(.*?)\"\:/g, replacement: '<q>$1</q>'},                               // quote
      {regex: /`(.*?)`/g, replacement: '<code>$1</code>'},                               // inline code
      {regex: /\n\*(.*)/g, replacement: ulList},                                         // ul lists
      {regex: /\n[0-9]+\.(.*)/g, replacement: olList},                                   // ol lists
      {regex: /\n(&gt;|\>)(.*)/g, replacement: blockquote},                              // blockquotes
      {regex: /\n-{5,}/g, replacement: '\n<hr />'},                                      // horizontal rule
      {regex: /\n([^\n]+)\n/g, replacement: para},                                       // add paragraphs
      {regex: /<\/ul>\s?<ul>/g, replacement: ''},                                        // fix extra ul
      {regex: /<\/ol>\s?<ol>/g, replacement: ''},                                        // fix extra ol
      {regex: /<\/blockquote><blockquote>/g, replacement: '\n'}                          // fix extra blockquote
    ],
    addRule: function (regex, replacement) {
      regex.global = true
      regex.multiline = false
      this.rules.push({regex: regex, replacement: replacement})
    },
    // Render some Markdown into HTML.
    render: function (text) {
      text = '\n' + text + '\n'
      this.rules.forEach(function (rule) {
        text = text.replace(rule.regex, rule.replacement)
      })
      return text.trim()
    }
  }

  function para (text, line) {
    var trimmed = line.trim()
    if (/^<\/?(ul|ol|li|h|p|bl)/i.test(trimmed)) {
      return '\n' + line + '\n'
    }
    return '\n<p>' + trimmed + '</p>\n'
  }

  function ulList (text, item) {
    return '\n<ul>\n\t<li>' + item.trim() + '</li>\n</ul>'
  }

  function olList (text, item) {
    return '\n<ol>\n\t<li>' + item.trim() + '</li>\n</ol>'
  }

  function blockquote (text, tmp, item) {
    return '\n<blockquote>' + item.trim() + '</blockquote>'
  }

  function header (text, chars, content) {
    var level = chars.length
    return '<h' + level + '>' + content.trim() + '</h' + level + '>'
  }
}

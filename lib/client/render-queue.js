import md from './mdown'
import escapeHTML from './escape-html'

export default function renderQueue (room, queueDiv) {
  queueDiv.innerHTML = room.queue.map(renderLi).join('')
}

function renderLi (name) { return '<li>' + md.render(escapeHTML(name)) + '</li>' }

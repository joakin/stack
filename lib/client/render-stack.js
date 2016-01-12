import md from './mdown'
import escapeHTML from './escape-html'

export default function renderStack (room, stackDiv) {
  stackDiv.innerHTML = room.stack.map(renderLi).join('')
}

function renderLi (name) { return '<li>' + md.render(escapeHTML(name)) + '</li>' }

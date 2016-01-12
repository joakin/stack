export default function escapeHTML (s) {
  let tmp = document.createElement('span')
  tmp.textContent = s
  return tmp.innerHTML
}

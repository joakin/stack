export default function askForQueue (roomName, onResponse) {
  let req = new window.XMLHttpRequest()
  req.onreadystatechange = function () {
    if (req.readyState === window.XMLHttpRequest.DONE) {
      if (req.status === 200) {
        let room = JSON.parse(req.responseText)
        console.log(room)
        onResponse(room)
      } else {
        console.log('nope', req.status)
      }
    }
  }
  req.open('GET', '/room/' + roomName)
  req.setRequestHeader('Accept', 'application/json')
  req.send(null)
}
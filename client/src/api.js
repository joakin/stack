import fetch from 'isomorphic-fetch'
import qs from 'qs'

const {Request, Headers} = window

function post (url, params) {
  const request = new Request(url, {
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    })
  })
  return fetch(request, {
    method: 'post',
    body: params ? qs.stringify(params) : ''
  }).then((response) => response.json())
}

export function add (roomName, participant) {
  return post(`/api/add/${roomName}`, {
    stack_name: participant
  })
}

export function remove (roomName) {
  return post(`/api/pop/${roomName}`)
}

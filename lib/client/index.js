import 'babel-polyfill'
import injectTapEventPlugin from 'react-tap-event-plugin'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import { createHistory, useBasename } from 'history'
import App from './components/app'
import MainPage from './components/main-page'
import Room from './components/room'

import './index.less'

injectTapEventPlugin()

let baseUrl = window.location.pathname.indexOf('/webpack-dev-server') === 0
  ? '/webpack-dev-server' : '/'
const browserHistory = useBasename(createHistory)({
  basename: baseUrl
})

addAudioElements()

if (!('EventSource' in window)) {
  window.alert(
    'Your browser does not support EventSource, so stack won\'t work.\n\n' +
    'Please use stack in other browser that is not IE. (http://caniuse.com/#feat=eventsource)'
  )
}

render(
  <Router history={browserHistory}>
    <Route path={baseUrl} component={App}>
      <IndexRoute component={MainPage} />
      <Route path='room/:roomName' component={Room} />
      <Route path='*' component={MainPage} />
    </Route>
  </Router>
, document.getElementById('root'))

function addAudioElements () {
  let container = document.createElement('div')
  const volume = 0.05
  container.innerHTML = `
    <audio id='bing' volume='${volume}' preload='auto' src='/blast.mp3'></audio>
    <audio id='baby' volume='${volume}' preload='auto' src='/baby.mp3'></audio>
  `
  document.body.appendChild(container)
}

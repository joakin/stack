import React from 'react'
import Mute from './mute'
import {preventedDefault} from './utils'
import * as api from '../api'
import askForStack from '../ask-for-stack'
import checkStale, {MINUTES_TILL_STALE_ALARM} from '../check-state-stale'

export default React.createClass({

  propTypes: {
    params: React.PropTypes.object,
    muted: React.PropTypes.bool,
    room: React.PropTypes.object,
    onMute: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    onPop: React.PropTypes.func,
    onNewRoom: React.PropTypes.func
  },

  getInitialState () {
    return {
      participantName: '',
      pollInterval: null,
      staleInterval: null
    }
  },

  componentWillMount () { this.switchRoom(this.props) },

  componentWillReceiveProps (nextProps) {
    this.switchRoom(nextProps)

    if (this.props.room.participants.length !== nextProps.room.participants.length) {
      playAudio('bing', this.props.muted)
    }
  },

  switchRoom (props) {
    props.switchRoom(props.params.roomName)
  },

  componentDidMount () {
    this.setState({
      pollInterval: setInterval(this.pollRoom, 1000),
      staleInterval: setInterval(() =>
        checkStale(this.props.room, () => playAudio('baby', this.props.muted)),
        MINUTES_TILL_STALE_ALARM
      )
    })
  },

  pollRoom () { askForStack(this.props.room.name, this.receivedRoom) },

  receivedRoom (room) { this.props.onNewRoom(room) },

  addParticipant () {
    const {onAdd, params} = this.props
    onAdd(params.roomName, this.state.participantName)

    api.add(params.roomName, this.state.participantName)
      .then(this.receivedRoom)
  },

  removeParticipant () {
    const {onPop, params} = this.props
    onPop(params.roomName)

    api.remove(params.roomName)
      .then(this.receivedRoom)
  },

  render () {
    const {
      params,
      muted, onMute,
      room
    } = this.props
    const {roomName} = params
    const {participantName} = this.state
    console.log('render', room)

    return (
      <div className='Room'>
        <Mute muted={muted} onChange={onMute}/>
        <h1>Stack room: {roomName}</h1>
        <form onSubmit={preventedDefault(this.addParticipant)}>
          <fieldset>
            <legend>Push to stack</legend>
            <label htmlFor='stack_name'>Who</label>
            <input id='stack_name' name='stack_name' type='text'
              value={participantName} onChange={this.onNameChange}/>
            <input type='submit' value='Push'/>
          </fieldset>
        </form>
        <h2>
          Stack
          <form onSubmit={preventedDefault(this.removeParticipant)}>
            <input type='submit' value='Pop'/>
          </form>
        </h2>
        <ol id='stack'>
          {room.participants.map((p, i) =>
            <li key={`${i}-${p}`}>{p}</li>)}
        </ol>
      </div>
    )
  },

  onNameChange (e) {
    this.setState({ participantName: e.target.value })
  }

})

function playAudio (id, muted) {
  if (!muted) {
    let original = document.getElementById(id)
    let clone = original.cloneNode()
    clone.volume = original.getAttribute('volume')
    clone.play()
  }
}

import React from 'react'
import {
  initialState, toggleMuted, addParticipant, removeParticipant, switchRoom,
  updateRoom
} from '../state'

export default React.createClass({

  propTypes: {
    params: React.PropTypes.object,
    children: React.PropTypes.object
  },

  getActions () {
    return {
      onMute: toggleMuted,
      onAdd: addParticipant,
      onPop: removeParticipant,
      switchRoom,
      onNewRoom: updateRoom
    }
  },

  getInitialState () {
    const actions = this.bindActionsToState(this.getActions())
    return {
      state: initialState(),
      actions
    }
  },

  render () {
    const {children} = this.props
    return (
      <div className='App'>
        {children && React.cloneElement(children, {
          ...this.state.actions,
          ...this.state.state
        })}
      </div>
    )
  },

  bindActionsToState (obj) {
    return Object.keys(obj).reduce((a, k) => {
      a[k] = this.bindActionToState(obj[k])
      return a
    }, {})
  },

  bindActionToState (action) {
    return (...args) => {
      const newState = action(...args.concat(this.state.state))
      if (newState !== this.state.state) {
        this.setState({
          state: newState
        })
        console.log('NEW STATE', newState)
      }
    }
  }

})

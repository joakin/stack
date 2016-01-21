import React from 'react'
import {Link} from 'react-router'
import AppBar from 'material-ui/lib/app-bar'
import {
  initialState, toggleMuted, addParticipant, removeParticipant, switchRoom,
  updateRoom
} from '../../state'

import './app.less'

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
        <AppBar
          title={
            <Link className='App-title' to='/'>Stack</Link>
          }
          showMenuIconButton={false} />
        <div className='App-content'>
          {children && React.cloneElement(children, {
            ...this.state.actions,
            ...this.state.state
          })}
        </div>
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
        window.STATE = newState
      }
    }
  }

})

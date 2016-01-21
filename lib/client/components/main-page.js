import React from 'react'

export default React.createClass({

  propTypes: {
    history: React.PropTypes.object
  },

  getInitialState: function () {
    return {roomName: ''}
  },

  onRoomNameChange (e) {
    this.setState({roomName: e.target.value})
  },

  render () {
    return (
      <div className='MainPage'>
        <h1>Stack</h1>
        <form method='POST' action='/api/create' onSubmit={this.onSubmit}>
          <fieldset>
            <legend>Create room</legend>
            <label htmlFor='room_name'>Name</label>
            <input id='room_name' name='room_name' type='text'
              value={this.state.roomName} onChange={this.onRoomNameChange}/>
            <input type='submit' value='Create'/>
          </fieldset>
        </form>
      </div>
    )
  },

  onSubmit (e) {
    e.preventDefault()
    const roomName = this.state.roomName
    if (roomName.trim()) {
      this.props.history.pushState(null, `/room/${roomName}`)
    }
  }

})

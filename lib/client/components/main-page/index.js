import React from 'react'
import Card from 'material-ui/lib/card/card'
import CardTitle from 'material-ui/lib/card/card-title'
import CardText from 'material-ui/lib/card/card-text'
import CardActions from 'material-ui/lib/card/card-actions'
import Divider from 'material-ui/lib/divider'
import TextField from 'material-ui/lib/text-field'
import RaisedButton from 'material-ui/lib/raised-button'

import './main-page.less'

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
        <Card>
          <CardText>
            Welcome to Stack, a tool to keep track of participation when meeting with groups of people.
          </CardText>
          <Divider />
          <CardTitle title='Create room'
            subtitle='Enter a name to visit a room'/>
          <form className='MainPage-form' onSubmit={this.onSubmit}>
            <TextField
              hintText='Enter a room name to visit it'
              floatingLabelText='Room name'
              style={{ marginTop: '-25px' }}
              value={this.state.roomName} onChange={this.onRoomNameChange} />
            <RaisedButton primary label='Go' type='submit'/>
          </form>
        </Card>
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

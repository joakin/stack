import React from "react";

import { Card, CardTitle, CardText } from "material-ui/Card";
import Divider from "material-ui/Divider";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

import "./main-page.css";

export default class MainPage extends React.Component {
  state = { roomName: "" };

  onRoomNameChange = e => {
    this.setState({ roomName: e.target.value });
  };

  render() {
    return (
      <div className="MainPage">
        <Card>
          <CardText>
            Welcome to Stack, a tool to keep track of participation when meeting
            with groups of people.
          </CardText>
          <Divider />
          <CardTitle
            title="Create room"
            subtitle="Enter a name to visit a room"
          />
          <form className="MainPage-form" onSubmit={this.onSubmit}>
            <TextField
              hintText="Enter a room name to visit it"
              floatingLabelText="Room name"
              style={{ marginTop: "-25px" }}
              value={this.state.roomName}
              onChange={this.onRoomNameChange}
            />
            <RaisedButton primary label="Go" type="submit" />
          </form>
        </Card>
      </div>
    );
  }

  onSubmit = e => {
    e.preventDefault();
    const roomName = this.state.roomName;
    if (roomName.trim()) {
      this.props.history.push(`/room/${roomName}`);
    }
  };
}

import React from "react";
import Mute from "../mute";
import { preventedDefault } from "../utils";
import * as api from "../../api";
import checkStale, { MINUTES_TILL_STALE_ALARM } from "../../check-state-stale";

import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";

import { Card, CardTitle, CardActions } from "material-ui/Card";
import Divider from "material-ui/Divider";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import { List, ListItem } from "material-ui/List";

import "./room.css";

const { EventSource } = window;

export default class Room extends React.Component {
  state = {
    participantName: "",
    pollInterval: null,
    staleInterval: null
  };

  componentWillMount() {
    this.switchRoom(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.switchRoom(nextProps);

    if (
      this.props.room.participants.length !== nextProps.room.participants.length
    ) {
      playAudio("bing", this.props.muted);
    }
  }

  switchRoom(props) {
    props.switchRoom(props.match.params.roomName);
  }

  componentDidMount() {
    this.setEventSource();
    this.setState({
      staleInterval: setInterval(
        () =>
          checkStale(this.props.room, () =>
            playAudio("warningbell", this.props.muted)
          ),
        MINUTES_TILL_STALE_ALARM
      )
    });
  }

  componentWillUnmount() {
    this.state.events.close();
    window.clearInterval(this.state.staleInterval);
  }

  setEventSource() {
    var es = new EventSource(`/api/room/${this.props.match.params.roomName}`);
    es.addEventListener("open", () =>
      console.log(`Connection open at ${es.url}`)
    );
    es.addEventListener("message", event => {
      const room = JSON.parse(event.data).room;
      this.receivedRoom(room);
    });
    es.addEventListener("error", e => {
      console.log(`Connection error at ${es.url}.`, e);
    });

    this.setState({ events: es });
  }

  receivedRoom = room => {
    this.props.onNewRoom(room);
  };

  addParticipant = () => {
    const { onAdd, match: { params } } = this.props;
    const participantName = this.state.participantName;
    if (participantName.trim()) {
      onAdd(params.roomName, participantName);

      api.add(params.roomName, participantName).then(this.receivedRoom);
    }
  };

  removeParticipant = () => {
    const { onPop, match: { params } } = this.props;
    onPop(params.roomName);

    api.remove(params.roomName).then(this.receivedRoom);
  };

  render() {
    const { match: { params }, muted, onMute, room } = this.props;
    const { roomName } = params;
    const { participantName } = this.state;

    return (
      <div className="Room">
        <Card>
          <Toolbar className="Room-toolbar">
            <ToolbarGroup firstChild float="left">
              <ToolbarTitle className="Room-title" text={roomName} />
            </ToolbarGroup>

            <ToolbarGroup float="right">
              <Mute muted={muted} onChange={onMute} />
            </ToolbarGroup>
          </Toolbar>

          <form
            className="Room-add-participant"
            onSubmit={preventedDefault(this.addParticipant)}
          >
            <TextField
              hintText="Jane Doe"
              floatingLabelText="Name"
              style={{ marginTop: "-25px" }}
              value={participantName}
              onChange={this.onNameChange}
            />
            <RaisedButton
              primary
              label="Add participant to queue"
              type="submit"
            />
          </form>

          <Divider />

          <CardTitle
            className="Room-has-the-floor"
            title={
              <span style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                <span
                  className="Room-has-the-floor-name"
                  style={{ color: "rgba(0, 0, 0, 0.87)" }}
                >
                  {room.hasTheFloor || "Nobody"}
                </span>
                <span> has the floor</span>
              </span>
            }
          />

          <Divider />

          <div className="Room-queue-heading">
            <CardTitle
              className="Room-queue-heading-title"
              title="Queue"
              subtitle="List of participants waiting to intervene"
            />

            <CardActions className="Room-remove-participant">
              <RaisedButton
                label="Next participant"
                onClick={preventedDefault(this.removeParticipant)}
              />
            </CardActions>
          </div>

          <div className="Room-queue">
            <List>
              {room.participants.map((p, i) => (
                <ListItem key={`${i}-${p}`} style={{ fontSize: "inherit" }}>
                  {i + 1}. {p}
                </ListItem>
              ))}
            </List>
          </div>
        </Card>
      </div>
    );
  }

  onNameChange = e => {
    this.setState({ participantName: e.target.value });
  };
}

function playAudio(id, muted) {
  if (!muted) {
    let original = document.getElementById(id);
    let clone = original.cloneNode();
    clone.volume = original.getAttribute("volume");
    clone.play();
  }
}

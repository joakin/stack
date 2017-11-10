import React from "react";
import { Link } from "react-router-dom";
import AppBar from "material-ui/AppBar";
import {
  initialState,
  toggleMuted,
  addParticipant,
  removeParticipant,
  switchRoom,
  updateRoom
} from "../../state";

import "./app.css";

export default class App extends React.Component {
  getActions() {
    return {
      onMute: toggleMuted,
      onAdd: addParticipant,
      onPop: removeParticipant,
      switchRoom,
      onNewRoom: updateRoom
    };
  }

  constructor() {
    super();
    const actions = this.bindActionsToState(this.getActions());
    this.state = {
      state: initialState(),
      actions
    };
  }

  render() {
    const { children } = this.props;
    return (
      <div className="App">
        <AppBar
          title={
            <Link className="App-title" to="/">
              Stack
            </Link>
          }
          showMenuIconButton={false}
        />
        <div className="App-content">
          {children &&
            children({
              actions: this.state.actions,
              state: this.state.state
            })}
        </div>
      </div>
    );
  }

  bindActionsToState(obj) {
    return Object.keys(obj).reduce((a, k) => {
      a[k] = this.bindActionToState(obj[k]);
      return a;
    }, {});
  }

  bindActionToState(action) {
    return (...args) => {
      const newState = action(...args.concat(this.state.state));
      if (newState !== this.state.state) {
        this.setState({
          state: newState
        });
        window.STATE = newState;
      }
    };
  }
}

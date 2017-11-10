import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import App from "./components/app";
import MainPage from "./components/main-page";
import Room from "./components/room";

import "./index.css";

addAudioElements();

if (!("EventSource" in window)) {
  window.alert(
    "Your browser does not support EventSource, so stack won't work.\n\n" +
      "Please use stack in other browser that is not IE. (http://caniuse.com/#feat=eventsource)"
  );
}

render(
  <Router>
    <MuiThemeProvider>
      <App>
        {({ actions, state }) => (
          <Switch>
            <Route path="/" exact component={MainPage} />
            <Route
              path="/room/:roomName"
              render={props => <Room {...props} {...state} {...actions} />}
            />
            <Route component={MainPage} />
          </Switch>
        )}
      </App>
    </MuiThemeProvider>
  </Router>,
  document.getElementById("root")
);

function addAudioElements() {
  let container = document.createElement("div");
  const volume = 0.05;
  container.innerHTML = `
    <audio id='bing' volume='${volume}' preload='auto' src='/blast.mp3'></audio>
    <audio id='warningbell' volume='${volume}' preload='auto' src='/warningbell.mp3'></audio>
  `;
  document.body.appendChild(container);
}

import bodyParser from "body-parser";
import express from "express";
import { room, addParticipant, removeParticipant } from "../client/src/state";
import path from "path";
import EventEmitter from "events";

const server = express();

let app = {
  rooms: {}
};

const events = new EventEmitter();

server.use(express.static("build"));
server.use(bodyParser.urlencoded({ extended: true }));

server.get("/api/room/:name", (req, res) => {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache"
  });
  const name = req.params.name;
  app.rooms[name] = app.rooms[name] || room({ name });

  const eventName = `change:${name}`;
  const sendEvent = () =>
    res.write('data: {"room": ' + JSON.stringify(app.rooms[name]) + "}\n\n");

  sendEvent(res, name);

  events.on(eventName, sendEvent);
  res.on("close", () => {
    try {
      events.removeListener(eventName, sendEvent);
    } catch (e) {
      console.log(e.stack);
    }
  });
});

server.post("/api/add/:room_name", (req, res) => {
  const room_name = req.params.room_name;
  const stack_name = req.body.stack_name;

  // TODO: Validate `room_name` room exists

  const room = app.rooms[room_name] || room({ name: room_name });
  app.rooms[room_name] = addParticipant(room_name, stack_name, { room }).room;

  events.emit(`change:${room_name}`);
  res.json(app.rooms[room_name]);
});

server.post("/api/pop/:room_name", (req, res) => {
  const room_name = req.params.room_name;

  // TODO: Validate `room_name` room exists

  const room = app.rooms[room_name] || room({ name: room_name });
  app.rooms[room_name] = removeParticipant(room_name, { room }).room;

  events.emit(`change:${room_name}`);
  res.json(app.rooms[room_name]);
});

server.get("*", (req, res) => res.sendFile(path.resolve("./build/index.html")));

const PORT = process.env.PORT || 4321;
server.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);

setInterval(() => {
  const n = Date.now();
  Object.keys(app.rooms).forEach(key => {
    if (n - new Date(app.rooms[key].lastUpdated) > 24 * 60 * 60 * 1000) {
      delete app.rooms[key];
    }
  });
}, /* once a day */ 24 * 60 * 60 * 1000);

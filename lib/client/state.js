function now () {
  return new Date().toJSON()
}

export function newRoom (props) {
  return {
    name: null,
    participants: [],
    lastUpdated: now(),
    ...props
  }
}

export function initialState () {
  return {
    muted: false,
    room: newRoom()
  }
}

export function toggleMuted (state) {
  return {
    ...state,
    muted: !state.muted
  }
}

export function addParticipant (roomName, name, state) {
  return {
    ...state,
    room: {
      ...state.room,
      participants: state.room.participants.concat(name)
    }
  }
}

export function removeParticipant (roomName, state) {
  return {
    ...state,
    room: {
      ...state.room,
      participants: state.room.participants.slice(1)
    }
  }
}

export function switchRoom (roomName, state) {
  if (state.room.name !== roomName) {
    return {
      ...state,
      room: newRoom({name: roomName})
    }
  }
  return state
}

export function updateRoom (room, state) {
  return {
    ...state, room
  }
}

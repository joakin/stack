function now () {
  return new Date().toJSON()
}

export function room (props) {
  return {
    name: null,
    participants: [],
    hasTheFloor: null,
    lastUpdated: now(),
    ...props
  }
}

export function initialState () {
  return {
    muted: false,
    room: room()
  }
}

export function toggleMuted (state) {
  return {
    ...state,
    muted: !state.muted
  }
}

export function addParticipant (roomName, name, state) {
  const currentParticipants = state.room.participants
  // Don't add repeated entries to the participants list
  if (
    (currentParticipants.length > 0 &&
    currentParticipants[currentParticipants.length - 1] === name) ||
    (currentParticipants.length === 0 &&
     state.room.hasTheFloor === name)
  ) {
    return state
  } else {
    return {
      ...state,
      room: {
        ...state.room,
        participants: currentParticipants.concat(name),
        lastUpdated: now()
      }
    }
  }
}

export function removeParticipant (roomName, state) {
  const participants = state.room.participants
  return {
    ...state,
    room: {
      ...state.room,
      hasTheFloor: participants.length > 0 ? participants[0] : null,
      participants: participants.slice(1),
      lastUpdated: now()
    }
  }
}

export function switchRoom (roomName, state) {
  if (state.room.name !== roomName) {
    return {
      ...state,
      room: room({name: roomName})
    }
  }
  return state
}

export function updateRoom (room, state) {
  return {
    ...state, room
  }
}

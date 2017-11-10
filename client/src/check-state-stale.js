
export const MINUTES_TILL_STALE_ALARM = 5 * 60 * 1000

export default function checkStale (room, onStale) {
  if (new Date() - new Date(room.lastUpdated) > MINUTES_TILL_STALE_ALARM) {
    if (room.participants.length > 0) {
      onStale()
    }
  }
}


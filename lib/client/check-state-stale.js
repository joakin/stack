
export const MINUTES_TILL_STALE_ALARM = 5 * 60 * 1000

export default function checkStale (state, onStale) {
  if (new Date() - new Date(state.lastUpdated) > MINUTES_TILL_STALE_ALARM) {
    if (state.queue.length > 0) {
      onStale()
    }
  }
}


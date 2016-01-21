export function preventedDefault (fn) {
  return (e) => {
    e.preventDefault()
    fn(e)
  }
}

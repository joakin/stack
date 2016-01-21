import React from 'react'

export default ({muted, onChange}) => {
  let change = (e) => onChange()
  return (
    <div className='Mute'>
      <label htmlFor='mute_checkbox'>Mute</label>
      <input id='mute_checkbox' type='checkbox'
        checked={muted} onChange={change}/>
    </div>
  )
}

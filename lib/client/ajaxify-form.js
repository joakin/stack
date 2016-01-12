import submitForm from './submit-form'

export default function (formid, roomName, onResponse) {
  let form = document.getElementById(formid)
  form.setAttribute('action', form.getAttribute('action') + '/' + roomName)
  form.onsubmit = (e) => {
    submitForm(form, (err, resp) => {
      if (err) console.log(err.message)
      else {
        console.log(resp)
        onResponse(resp)
      }
    })
    return false
  }
}


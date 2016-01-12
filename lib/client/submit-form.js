import toArray from './to-array'

export default function submitForm (form, fn) {
  const params = toArray(form.querySelectorAll('[name]')).reduce((s, input, i) => {
    s += (i === 0 ? '' : '&') +
      encodeURIComponent(input.name) + '=' +
      encodeURIComponent(input.value)
    return s
  }, '')
  let req = new window.XMLHttpRequest()
  req.onreadystatechange = function () {
    if (req.readyState === window.XMLHttpRequest.DONE) {
      if (req.status === 200) {
        try {
          let resp = JSON.parse(req.responseText)
          fn(null, resp)
        } catch (e) {
          fn(e)
        }
      } else {
        fn(new Error('Request failed w/ status code', req.status))
      }
    }
  }

  req.open('POST', form.action)
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  req.setRequestHeader('Accept', 'application/json')
  req.send(params)
}

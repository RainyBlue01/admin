export function LoginCheck() {
  let token = JSON.parse(localStorage.getItem('token'))
  if (token) {
    return true
  } else {
    return false
  }
}

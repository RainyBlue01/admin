import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return localStorage.getItem("token")
}

export function setToken(token) {
  return localStorage.setItem("token",JSON.stringify(token))
}

export function removeToken() {
  return localStorage.removeItem("token")
}

export function setUser(data) {
  return localStorage.setItem("user",JSON.stringify(data))
}

export function getUser(data) {
  return localStorage.getItem("user")
}

export function removeUser(data) {
  return localStorage.removeItem("user")
}

import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UuidKey = 'uuid'

export function getToken() {
  return Cookies.get(TokenKey)
  // return localStorage.getItem(TokenKey)
}
export function getUuid(uuid) {
  return Cookies.get(UuidKey, uuid)
  // return localStorage.getItem(UuidKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
  // return localStorage.setItem(TokenKey, token)
}
export function setUuid(uuid) {
  return Cookies.set(UuidKey, uuid)
  // return localStorage.setItem(UuidKey, uuid)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function removeUuid() {
  return Cookies.remove(UuidKey)
}

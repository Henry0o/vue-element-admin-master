export default function str2Int(str) {
  let first = str.substr(0, 1)
  let second = str.substr(1, 1)
  let res = 0
  let temp = 0
  temp = (str.charCodeAt(1) - 48) * 16 + (str.charCodeAt(2) - 48)
  if (temp >= 48 && temp <= 57) {
    res = temp - 48
  } else if (temp >= 65 && temp <= 70) {
    res = temp - 65 + 10
  }
  return res

}

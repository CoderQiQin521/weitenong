const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// ArrayBuffer转16进度字符串示例
const ab2hex = buffer => {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr;
}

const ab2hexyj = buffer => {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return '0x' + ('00' + bit.toString(16)).slice(-2).toUpperCase()
    }
  )
  return hexArr;
}

const arrayBufferToHexString = (buffer) => {
  let bufferType = Object.prototype.toString.call(buffer)
  if (buffer != '[object ArrayBuffer]') {
    return
  }
  let dataView = new DataView(buffer)

  let hexStr = [];
  for (let i = 0; i < dataView.byteLength; i++) {
    let str = dataView.getUint8(i);
    // let hex = (str & 0xff).toString(16);
    let hex = str.toString(16);
    // hex = (hex.length === 1) ? '0' + hex : hex;
    // hexStr += hex;
    hexStr.push(hex)
  }
  // return hexStr.toUpperCase();
  return hexStr;
}

let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
let pass = /^[a-zA-Z0-9]{6,20}$/

/**
 *
 * @param {number} phone
 * @returns {boolean}
 */
const verifyPhone = phone => reg.test(phone)
const verifyPass = pass => pass.test(pass)

module.exports = {
  formatTime: formatTime,
  verifyPhone,
  verifyPass,
  ab2hexyj,
  ab2hex,
  arrayBufferToHexString
}

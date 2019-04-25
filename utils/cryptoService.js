const Crypto = require("./cryptojs/cryptojs.js").Crypto;

// 加密
function encrypt(word, key) {
  var mode = new Crypto.mode.ECB(Crypto.pad.NoPadding);
  // var eb = Crypto.charenc.UTF8.stringToBytes(word);
  var eb = word;
  var kb = key;
  // var vb = Crypto.charenc.UTF8.stringToBytes("8765432187654321");//IV
  var ub = Crypto.AES.encrypt(eb, kb, { mode: mode, asBytes: true });
  return ub;
}

// 解密
function decrypt(bCipherArray, key) {
  var mode = new Crypto.mode.ECB(Crypto.pad.NoPadding);
  var eb = bCipherArray;
  var kb = key;
  // var vb = Crypto.charenc.UTF8.stringToBytes("8765432187654321");//IV
  var ub = Crypto.AES.decrypt(eb, kb, { mode: mode, asBytes: true });
  return ub;
}

function test(str){
  // var key = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46];
  var key = [0x3A, 0x60, 0x43, 0x2A, 0x5C, 0x01, 0x21, 0x1F, 0x29, 0x1E, 0x0F, 0x4E, 0x0C, 0x13, 0x28, 0x25]
  var encStr = encrypt(str, key);
  console.log("encrypt byte array:["+encStr+"]");
  console.log("encrypt 16:["+encStr.map(item => {
    return item.toString(16)
  })+"]");
  var decStr = decrypt(encStr, key);
  console.log("decrypt data:[" + decStr + "]");
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt,
  test: test
}
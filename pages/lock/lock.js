// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

function ab2hexyj(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return '0x' + ('00' + bit.toString(16)).slice(-2).toUpperCase()
    }
  )
  return hexArr;
}

//字符串转ArrayBuffer
function string2buffer(str) {
  // 首先将字符串转为16进制
  let val = ""
  for (let i = 0; i < str.length; i++) {
    if (val === '') {
      val = str.charCodeAt(i).toString(16)
    } else {
      val += ',' + str.charCodeAt(i).toString(16)
    }
  }
  // 将16进制转化为ArrayBuffer
  return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  })).buffer
}
// 16进制转字符串
function hexCharCodeToStr(hexCharCodeStr) {
　　var trimedStr = hexCharCodeStr.trim();
　　var rawStr = 
　　trimedStr.substr(0,2).toLowerCase() === "0x"
　　? 
　　trimedStr.substr(2) 
　　: 
　　trimedStr;
　　var len = rawStr.length;
　　if(len % 2 !== 0) {
　　　　alert("Illegal Format ASCII Code!");
　　　　return "";
　　}
　　var curCharCode;
　　var resultStr = [];
　　for(var i = 0; i < len;i = i + 2) {
　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
　　　　resultStr.push(String.fromCharCode(curCharCode));
　　}
　　return resultStr.join("");
}
var key = [0x3A, 0x60, 0x43, 0x2A, 0x5C, 0x01, 0x21, 0x1F, 0x29, 0x1E, 0x0F, 0x4E, 0x0C, 0x13, 0x28, 0x25]
//加密方法
// function Encrypt(word) {
//   let srcs = CryptoJS.enc.Utf8.parse(word);
//   let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
//   return encrypted.ciphertext.toString().toUpperCase();
// }


var cryptoService = require('../../utils/cryptoService')
// pages/lock/lock.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    deviceId: "",
    serviceId: "",
    characteristicId: "",
    readId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.deviceId);
    let deviceId = options.deviceId,
    name = options.name
    this.setData({
      name,
      deviceId
    })
  },
  //连接设备
  connectTO: function () {
    var that = this,
    deviceId = this.data.deviceId
    
    wx.createBLEConnection({
        deviceId: deviceId,
        success: function (res) {
            console.log('连接设备: ', res);
            // that.setData({
            //     connectedDeviceId: e.currentTarget.id,
            //     msg: "已连接" + e.currentTarget.id,
            //     msg1: "",
            // })
            that.getBLEDeviceServices()
        },
        fail: function () {
          wx.showToast({
            title: '连接蓝牙设备失败',
            icon: 'none'
          })
        },
        complete: function () {
            console.log("调用结束");
        }
    })
  },
  // 获取连接设备的service服务
  getBLEDeviceServices: function () {
    var that = this;
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.deviceId,
      success: function (res) {
        console.log('获取连接设备的service服务: ', res);
        let serviceId = res.services[0].uuid
        that.setData({
          serviceId: serviceId
        })
        that.getBLEDeviceCharacteristics()
      }
    })
  },
  //获取连接设备的所有特征值  for循环获取不到值
  getBLEDeviceCharacteristics: function () {
    var that = this;
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.deviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: that.data.serviceId,
      success: function (res) {
        console.log('所有特征值: ', res.characteristics);
        that.setData({
          characteristicId: res.characteristics[0].uuid,
          readId: res.characteristics[1].uuid
        })
          // for (var i = 0; i < res.characteristics.length; i++) {
          //   console.log("每个特征码", res.characteristics[i].uuid);
          //   if (res.characteristics[i].properties.notify) {
          //     that.setData({
          //       characteristicId: res.characteristics[i].uuid
          //     })
          //   }
          // }
        that.notifyBLECharacteristicValueChange()
          
      },
      fail: function () {
          console.log("fail");
      },
      complete: function () {
          console.log("complete");
      }
    })
  },
  // 启用低功耗蓝牙设备特征值变化时的 notify 功能
  notifyBLECharacteristicValueChange() {
    var that = this
    
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.readId,
      complete(res) {
        console.log('notify: ', res);
        wx.onBLECharacteristicValueChange(function(characteristic) {
          console.log('characteristic: ', characteristic);
        })
        that.writeBLECharacteristicValue(['0x06', '0x01', '0x01', '0x01'])

        wx.onBLECharacteristicValueChange(function (characteristic) {
          console.log('响应数据characteristic: ', characteristic);
          if (characteristic.characteristicId.toLowerCase().indexOf("36f6") != -1) {
            var char6value = new Uint8Array(characteristic.value, 0);
            console.log('char6value: ', char6value);

            // 转化响应数据
            let lockData = ab2hexyj(char6value)
            console.log('响应数据: ', lockData);

            // 解密
            lockData = cryptoService.decrypt(lockData, key).map(item => {
              return '0x' + item.toString(16).toUpperCase()
            })
            console.log('解密: ', lockData);
            // cryptoService.test([0xBA, 0x13, 0x9E, 0xF9, 0xC0, 0xE4, 0x80, 0xA5, 0xAB, 0xD4, 0xE2, 0xAB, 0xD3, 0xDB, 0x91, 0x47])

            let op = ['0x05', '0x01', '0x06']
            op[3] = '0x30'
            op[4] = '0x30'
            op[5] = '0x30'
            op[6] = '0x30'
            op[7] = '0x30'
            op[8] = '0x30'
            op[9] = lockData[3]
            op[10] = lockData[4]
            op[11] = lockData[5]
            op[12] = lockData[6]
            op[13] = '0x30'
            op[14] = '0x30'
            op[15] = '0x30'
            console.log('token: ', lockData[3],lockData[4],lockData[5],lockData[6]);
            
            console.log(op);
            
            that.oo(op)
            // that.writeBLECharacteristicValue(op)
            // console.log('ab2hex: ', ab2hexyj(characteristic.value).join(''));
            // var re = ab2hexyj(characteristic.value).join('')
            // console.log(cryptoService.decrypt(re, key))
          }
        })
      },
      fail(res){
        console.log('notify失败: ', res);
      }
    })
  },
  // [0xCA, 0xFB, 0x4A, 0xC9, 0x88, 0x96, 0x6A, 0x67, 0x63, 0x39, 0xFE, 0x49, 0x07, 0x05, 0xB1, 0xF9]
  // 向低功耗蓝牙设备特征值中写入二进制数据
  writeBLECharacteristicValue: function (sData) {
    /*
      宜家锁收发数据js中为16位数据,可以为字符串,不影响结果
    */

    var that = this;
    var sendData = null;

    // var word = [0x06, 0x01, 0x01, 0x01, 0x2C, 0x2C, 0x62, 0x58, 0x26, 0x67, 0x42, 0x66, 0x01, 0x33, 0x31, 0x41]
    // var word = ['0x06', '0x01', '0x01', '0x01', '0x2C', '0x2C', '0x62', '0x58', '0x26', '0x67', '0x42', '0x66', '0x01', '0x33', '0x31', '0x41']
    let len = 16 - sData.length
    for(let i = 0; i < len; i++) {
      sData.push('0x30')
    }
    console.log('len: ', len);
    console.log('sData: ', sData);
            
    

    // 期望得到的数据 [0xCA, 0xFB, 0x4A, 0xC9, 0x88, 0x96, 0x6A, 0x67, 0x63, 0x39, 0xFE, 0x49, 0x07, 0x05, 0xB1, 0xF9]
    var qres = '0xCA 0xFB 0x4A 0xC9 0x88 0x96 0x6A 0x67 0x63 0x39 0xFE 0x49 0x07 0x05 0xB1 0xF9'

    // 加密
    var bData = cryptoService.encrypt(sData, key).map(item => {
      return '0x' + item.toString(16).toUpperCase()
    })
    console.log('加密后的数据: ', bData)

    console.log('期望得到的数据: ', qres);
    
    // var bData = cryptoService.encrypt(sData, key);
    // 转换为ArrayBuffer
    var enDataBuf = new Uint8Array(bData);
    sendData = enDataBuf.buffer;
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.characteristicId,
      value: sendData,
      success: function (res) {
        console.log(that.data.deviceId,that.data.serviceId,that.data.characteristicId);
        
        console.log('蓝牙写入成功: ', res);
      },
      fail: function (res) {
        // 10007 当前特征值不支持此操作
        console.log('蓝牙写入失败: ', res);
      }
    })
  },
  oo(sData) {
    var sendData = null;
    var that = this
    var key = [0x3A, 0x60, 0x43, 0x2A, 0x5C, 0x01, 0x21, 0x1F, 0x29, 0x1E, 0x0F, 0x4E, 0x0C, 0x13, 0x28, 0x25]

    // 期望得到的数据
    var qres = '0xCA 0xFB 0x4A 0xC9 0x88 0x96 0x6A 0x67 0x63 0x39 0xFE 0x49 0x07 0x05 0xB1 0xF9'
    
    // 加密
    var bData = cryptoService.encrypt(sData, key).map(item => {
      return '0x' + item.toString(16).toUpperCase().replace(/\'/g, "");
    })
    console.log('加密后的数据: ', bData)

    console.log('期望得到的数据: ', qres);
    
    // var bData = cryptoService.encrypt(sData, key);
    // 转换为ArrayBuffer
    var enDataBuf = new Uint8Array(bData);
    sendData = enDataBuf.buffer;
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.characteristicId,
      value: sendData,
      success: function (res) {
        console.log('开锁写入成功: ', res);
      },
      fail: function (res) {
        // 10007 当前特征值不支持此操作
        console.log('蓝牙写入失败: ', res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
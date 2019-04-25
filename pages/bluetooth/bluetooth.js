// pages/bluetooth/bluetooth.js
var cryptoService = require('../../utils/cryptoService')

var deviceId = ''; //设备ID
var serviceId=''; //服务ID，一个设备下能有多个服务
var characteristicId = ''; //特征值ID，一个服务下能有多个特征值，其中某个才是可写的（可发送二进制数据给设备）

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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: "",
    sousuo: "",
    connectedDeviceId: "", //已连接设备uuid
    services: "", // 连接设备的服务
    characteristics: "",   // 连接设备的状态值
    writeServicweId: "", // 可写服务uuid
    writeCharacteristicsId: "",//可写特征值uuid
    readServicweId: "", // 可读服务uuid
    readCharacteristicsId: "",//可读特征值uuid
    notifyServicweId: "", //通知服务UUid
    notifyCharacteristicsId: "", //通知特征值UUID
    inputValue: "",
    characteristics1: "", // 连接设备的状态值
  },
  lanya1() {
    var that = this
    if (wx.openBluetoothAdapter) {
      wx.openBluetoothAdapter({
        success(res) {
          console.log('初始化蓝牙模块: ', res);
          
        },
        fail(err) {
          console.log('err: ', err);
          wx.showToast({
            title: '当前蓝牙适配器不可用',
            icon: 'none'
          })
        }
      })
    }else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  lanya2() {
    var that = this;
    wx.getBluetoothAdapterState({
      success: function (res) {
        that.setData({
            msg: "本机蓝牙适配器状态" + "/" + JSON.stringify(res.errMsg),
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
        })
        //监听蓝牙适配器状态
        wx.onBluetoothAdapterStateChange(function (res) {
            that.setData({
                sousuo: res.discovering ? "在搜索。" : "未搜索。",
                status: res.available ? "可用。" : "不可用。",
            })
        })
      },
      fail(err) {
        wx.showToast({
          title: '请开启系统蓝牙再试',
          icon: 'none'
        })
      }
    })
  },
  // 搜索周边设备
  lanya3() {
    var that = this;
    wx.startBluetoothDevicesDiscovery({
      services: ['FFF0'],
      success: function (res) {
        that.setData({
            msg: "搜索设备" + JSON.stringify(res),
        })
        //监听蓝牙适配器状态
        wx.onBluetoothAdapterStateChange(function (res) {
            that.setData({
                sousuo: res.discovering ? "在搜索。" : "未搜索。",
                status: res.available ? "可用。" : "不可用。",
            })
        })
      }
    })
  },
  // 获取所有已发现的设备
  lanya4: function () {
    var that = this;
    wx.getBluetoothDevices({
      success: function (res) {
        console.log('获取所有已发现的设备: ', res);

        res.devices.forEach(item => {
          console.log('设备唯一识别: ', that.arrayBufferToHexString(item.advertisData))
          item.advertisData = that.arrayBufferToHexString(item.advertisData)
        })


        that.setData({
            msg: "搜索设备" + JSON.stringify(res.devices),
            devices: res.devices,
        })
        //监听蓝牙适配器状态
        wx.onBluetoothAdapterStateChange(function (res) {
            that.setData({
                sousuo: res.discovering ? "在搜索。" : "未搜索。",
                status: res.available ? "可用。" : "不可用。",
            })
        })
      }
    })
  },
  shibie(e) {
    console.log(e);
    
  },
  //停止搜索周边设备
  lanya5: function () {
    var that = this;
    wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
            that.setData({
                msg: "停止搜索周边设备" + "/" + JSON.stringify(res.errMsg),
                sousuo: res.discovering ? "在搜索。" : "未搜索。",
                status: res.available ? "可用。" : "不可用。",
            })
        }
    })
  },
   //连接设备
   connectTO: function (e) {
    var that = this;
    console.log('id', e.currentTarget.id);
    
    wx.createBLEConnection({
        deviceId: e.currentTarget.id,
        success: function (res) {
            console.log('连接设备: ', res);
            that.setData({
                connectedDeviceId: e.currentTarget.id,
                msg: "已连接" + e.currentTarget.id,
                msg1: "",
            })
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
   lanya6: function () {
    var that = this;
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log('获取连接设备的service服务: ', res);
        that.setData({
            services: res.services,
            msg: JSON.stringify(res.services),
        })
      }
    })
  },
  //获取连接设备的所有特征值  for循环获取不到值
  lanya7: function () {
    var that = this;
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: that.data.services[0].uuid,
      success: function (res) {
        console.log('所有特征值: ', res);
          for (var i = 0; i < res.characteristics.length; i++) {
              if (res.characteristics[i].properties.notify) {
                  console.log("11111111", that.data.services[0].uuid);
                  console.log("特征码", res.characteristics[i].uuid);
                  that.setData({
                      notifyServicweId: that.data.services[0].uuid,
                      notifyCharacteristicsId: res.characteristics[i].uuid,
                  })
              }
              if (res.characteristics[i].properties.write) {
                  that.setData({
                      writeServicweId: that.data.services[0].uuid,
                      writeCharacteristicsId: res.characteristics[i].uuid,
                  })

              } else if (res.characteristics[i].properties.read) {
                  that.setData({
                      readServicweId: that.data.services[0].uuid,
                      readCharacteristicsId: res.characteristics[i].uuid,
                  })
              }
          }
          console.log('device getBLEDeviceCharacteristics:', res.characteristics);

          that.setData({
              msg: JSON.stringify(res.characteristics),
          })
        },
        fail: function () {
            console.log("fail");
        },
        complete: function () {
            console.log("complete");
        }
    })

    // wx.getBLEDeviceCharacteristics({
    //     // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    //     deviceId: that.data.connectedDeviceId,
    //     // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
    //     serviceId: that.data.services[1].uuid,
    //     success: function (res) {
    //         for (var i = 0; i < res.characteristics.length; i++) {
    //             if (res.characteristics[i].properties.notify) {
    //                 that.setData({
    //                     notifyServicweId: that.data.services[1].uuid,
    //                     notifyCharacteristicsId: res.characteristics[i].uuid,
    //                 })
    //             }
    //             if (res.characteristics[i].properties.write) {
    //                 that.setData({
    //                     writeServicweId: that.data.services[1].uuid,
    //                     writeCharacteristicsId: res.characteristics[i].uuid,
    //                 })

    //             } else if (res.characteristics[i].properties.read) {
    //                 that.setData({
    //                     readServicweId: that.data.services[1].uuid,
    //                     readCharacteristicsId: res.characteristics[i].uuid,
    //                 })

    //             }
    //         }
    //         console.log('device getBLEDeviceCharacteristics1:', res.characteristics);

    //         that.setData({
    //             msg1: JSON.stringify(res.characteristics),
    //         })
    //     },
    //     fail: function () {
    //         console.log("fail1");
    //     },
    //     complete: function () {
    //         console.log("complete1");
    //     }
    // })
  },
  hexStringToArrayBuffer(str) {
    if (!str) {
      return new ArrayBuffer(0);
    }
    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer)
    let ind = 0;
    for (var i = 0, len = str.length; i < len; i += 2) {
      let code = parseInt(str.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
    }
    return buffer;
  },
  ab2hex(buffer) {
    const hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('')
  },
  buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },
  arrayBufferToHexString(buffer) {
    let bufferType = Object.prototype.toString.call(buffer)
    if (buffer != '[object ArrayBuffer]') {
      return
    }
    let dataView = new DataView(buffer)

    var hexStr = '';
    for (var i = 0; i < dataView.byteLength; i++) {
      var str = dataView.getUint8(i);
      var hex = (str & 0xff).toString(16);
      hex = (hex.length === 1) ? '0' + hex : hex;
      hexStr += hex;
    }

    return hexStr.toUpperCase();
  },
  notice() {
    var that = this
  
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: that.data.connectedDeviceId,
      serviceId: that.data.services[0].uuid,
      characteristicId: that.data.notifyCharacteristicsId,
      complete(res) {
        wx.onBLECharacteristicValueChange(function (characteristic) {
          console.log('characteristic: ', characteristic);

          if (characteristic.characteristicId.toLowerCase().indexOf("fff6") != -1) {
            var char6value = new Uint8Array(characteristic.value, 0);
      
            var tmp = "";
            tmp = String.fromCharCode.apply(String, char6value);

            if (tmp.substring(0, 3) == 'KEY') 
            { 
              var btRandrom = char6value.subarray(3); 
              console.log('btRandrom: ', btRandrom);
              console.log("match key");
              that.write(btRandrom, 'UL057385')
            }else {
              if (tmp.toUpperCase() == "UNLOCK") {
                //开锁成功
                console.log('开锁成功');
              } else {
                //开锁失败
                console.log('开锁失败');
              }
            }
          }
        })
      },
      fail(res){
        console.log(res);
      }
    })
  },
  write: function (btRandrom, sData) {
    var that = this;
    var sendData = null;

    if (btRandrom) {
      var key = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46];
      var cryptoKey = new Uint8Array(key);
      for (var i = 0; i < btRandrom.length; i++) {
        cryptoKey[i] = btRandrom[i];
      }

      var bData = cryptoService.encrypt(sData, cryptoKey);

      var enDataBuf = new Uint8Array(bData);
      sendData = enDataBuf.buffer;

    } 
    wx.writeBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: that.data.services[0].uuid,
      characteristicId: that.data.notifyCharacteristicsId,
      value: sendData,
      success: function (res) {
        console.log('蓝牙写入', res);
        
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  //发送
  lanya8: function () {
    var that = this;
    // 这里的回调可以获取到 write 导致的特征值改变
    wx.onBLECharacteristicValueChange(function (characteristic) {
        console.log('characteristic value changed:1', characteristic)
    })
    var buf = new ArrayBuffer(16)
    var dataView = new DataView(buf)
    // wx.request({
    //   url:'',
    //   success: function (data) {
    //       var arr = data.data.data.split(",");
    //       console.log(arr);
    //       for (var i = 0; i < arr.length; i++) {
    //           dataView.setInt8(i, arr[i]);
    //       }
    //       console.log('str', buf);
    //       console.log("writeServicweId", that.data.writeServicweId);
    //       console.log("writeCharacteristicsId", that.data.writeCharacteristicsId);
          
    //   }
    // })

    // function Encrypt(word, key)
    // {
    //       var mode = new Crypto.mode.ECB(Crypto.pad.NoPadding);
    //       var eb = Crypto.charenc.UTF8.stringToBytes(word);
    //       var kb = key;
    //       var vb = Crypto.charenc.UTF8.stringToBytes("8765432187654321");//IV
    //       var ub = Crypto.AES.encrypt(eb, kb, { iv: vb, mode: mode, asBytes: true });
    //       return ub;
    // }

    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
      serviceId: that.data.writeServicweId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
      characteristicId: that.data.writeCharacteristicsId,
      // 这里的value是ArrayBuffer类型
      value: buf,
      success: function (res) {
          console.log('writeBLECharacteristicValue success', res.errMsg)
      }
  })
  },
  //断开设备连接
  lanya0: function () {
      var that = this;
      wx.closeBLEConnection({
          deviceId: that.data.connectedDeviceId,
          success: function (res) {
              that.setData({
                  connectedDeviceId: "",
              })
          }
      })
  },
  //接收消息
  lanya10: function () {
    var that = this;
    // 必须在这里的回调才能获取
    wx.onBLECharacteristicValueChange(function (characteristic) {
        let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
        console.log(hex)
      
    })
    console.log(that.data.readServicweId);
    console.log(that.data.readCharacteristicsId);
    wx.readBLECharacteristicValue({
        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: that.data.connectedDeviceId,
        // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
        serviceId: that.data.readServicweId,
        // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
        characteristicId: that.data.readCharacteristicsId,
        success: function (res) {
          console.log('res: ', res);
            console.log('readBLECharacteristicValue:', res.errMsg);
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.openBluetoothAdapter) {
      this.lanya1()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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
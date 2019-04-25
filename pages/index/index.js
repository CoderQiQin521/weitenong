//index.js
let http = require('../../http/request')
let api = require('../../http/api')
let utils = require('../../utils/util')
let config = require('../../utils/config')
let cryptoService = require('../../utils/cryptoService')
let pay = require('../../utils/pay')
const app = getApp()

// function arrayBufferToHexString(buffer) {
//   let bufferType = Object.prototype.toString.call(buffer)
//   if (buffer != '[object ArrayBuffer]') {
//     return
//   }
//   let dataView = new DataView(buffer)

//   let hexStr = '';
//   for (let i = 0; i < dataView.byteLength; i++) {
//     let str = dataView.getUint8(i);
//     let hex = (str & 0xff).toString(16);
//     hex = (hex.length === 1) ? '0' + hex : hex;
//     hexStr += hex;
//   }
//   return hexStr.toUpperCase();
// }
function getQueryVariable(url,variable)
{     
       var query = url.substring(url.indexOf('?') + 1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
Page({
  data: {
    keyword: '',
    indexData: {},
    bindData: {},
    openKey: [],
    qcode: '',
    sys: '', // 手机系统,区分ios和andriod
    firm: 0 // 1.asdd  2.yj
  },
  onLoad: function (e) {
    // https%3A%2F%2Fweitenong.dd371.com%3Fcode%3D100103519

    let code = getQueryVariable(decodeURIComponent(e.q), 'code');
    // console.log('code: ', code);
    this.setData({ qcode: code });
    if(code) {
      wx.navigateTo({
        url: '/pages/input/input?code=' + code
      })
    }
  },
  onShareAppMessage() {

  },
  onShow: function() {
    let uid = wx.getStorageSync('uid');

    if (!uid) {
      wx.reLaunch({
        url: "/pages/login/login"
      })
    }else {
      let sys = wx.getSystemInfoSync()
      this.setData({ sys: sys.platform })

      http.request('GET', api.ApiIndex).then(res => {
        if (res.error_code === 0) {
          this.setData({ indexData: res.data })
        }
      })
    }
  },
  inputWord(e) {
    let word = e.detail.trim();
    this.setData({ keyword: word });
  },
  onSearch() {
    wx.navigateTo({
      url: "/pages/search/search?keywords="+this.data.keyword
    });
  },
  previewImage(e) {
    let urls = this.data.indexData.banner.map(item => item.image);
    let img = e.currentTarget.dataset.img;
    wx.previewImage({
      current: img,
      urls: urls
    })
  },
  toDelivery() {
    // 先后台绑定快递柜,再前台绑定
    http.request('GET', api.Api.express.status).then(res => {
      if (res.error_code === 0) {
        wx.navigateTo({
          url: '/pages/delivery/delivery'
        })
      }else if(res.error_code === 1) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  // 调用手机二维码
  scanCodeCabinet() {
    this.init()
  },
  // 初始化wx蓝牙模块
  init() {
    let that = this
    // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
    if (!wx.openBluetoothAdapter) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return;
    }

    wx.openBluetoothAdapter({
      success(res) {
        that.getBluetoothAdapterState()
      },
      fail(err) {
        wx.showToast({
          title: '请开启手机蓝牙再试',
          icon: 'none'
        })
      }
    })
  },
  // 获取本机蓝牙适配器状态。
  getBluetoothAdapterState() {
    let that = this
    wx.getBluetoothAdapterState({
      success(res) {
        let { available, discovering } = res,
            code = that.data.qcode;

        if(!available) {
          wx.showToast({
            title: '请开启手机蓝牙再试',
            icon: 'none'
          })
          return
        }

        that.runLock(code);
      },
      fail(err) {

      }
    })
  },
  scanCode() {
    let that = this
    // 调用二维码相机
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success(res) {
        let code = res.result
         
        that.runLock(code);
      }
    })
  },
  runLock(code) {
    // 判断用户身份 express/user_type
    http.request('GET', api.ApiExpressUserype).then(res => {
      if (res.error_code === 0) { // 如果是业主
        console.log('你的身份是业主');
        // 业主下单 express/save
        http.request('GET', api.ApiExpressSave).then(res => {
          if (res.error_code === 0) {
            let did = res.data.did
            // 业主开锁 express/user_unlock
            http.request('POST', api.ApiExpressUserLock, { did, code: code }).then(res => {
              if (res.error_code === 0) {  // 可以开锁
                let bindData = res.data;
                that.setData({ bindData, firm: res.data.id })
                console.log('bindData: ', bindData);
                that.openLock();
              }
            })
          }else if(res.error_code === 1) {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
      }else if(res.error_code === 1) { // 如果是快递员或其它人
        console.log('你的身份是快递员或其它人');
        // 其他人下单 express/other_save
        http.request('GET', api.ApiExpressOtherSave, { code }).then(res => {
          if (res.error_code === 0) {
            let did = res.data.did
            // 判断订单是否支付 express/jugde_dd
            http.request('GET', api.ApiExpressJugdeDd + '?did=' + did).then(res => {
              if (res.error_code === 0) {
                // 其他人开锁 express/other_unlock
                http.request('POST', api.ApiExpressOtherUnlock, { did, code }).then(res => {
                  console.log(res);
                  
                  if(res.error_code === 0) {
                    let bindData = res.data;
                    console.log('bindData: ', bindData);
                    that.setData({ bindData, firm: res.data.id })
                    that.openLock();
                  }else {
                    wx.showToast({
                      title: res.msg,
                      icon: 'none'
                    })
                    return
                  }
                })
              }else if (res.error_code === 1) {
                // 微信支付 pay/pays_order?did=4
                console.log('去支付');
                http.request('GET', api.Api.default.pay, { did }).then(res => {
                  pay.pay(res).then(res => {
                    // 其他人开锁 express/other_unlock
                    http.request('POST', api.ApiExpressOtherUnlock, { did, code }).then(res => {
                      if (res.error_code !== 0) {
                        wx.showToast({
                          title: res.msg,
                          icon: 'none'
                        })
                        return
                      }
                      let bindData = res.data;
                      that.setData({ bindData, firm: res.data.id });
                      that.openLock();
                    })
                  })
                })
              }
            })
          }else if(res.error_code === 1) {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
      }else if(res.error_code === 503) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/bindPhone/bindPhone'
          })
        }, 2000)
      }
    })
  },
  // 监听蓝牙适配器状态变化事件
  onBluetoothAdapterStateChange() {
    let that = this
    wx.onBluetoothAdapterStateChange(function(res) {
      console.log('监听蓝牙适配器状态变化事件res: ', res)
      let { available, discovering } = res
      if (available) {
        wx.showLoading({
          title: '蓝牙开启中...',
          mask: true
        })
        setTimeout(() => {
          wx.hideLoading()
          that.init()
        }, 2000)
      }else {
        wx.showToast({
          title: '您关闭了手机蓝牙',
          icon: 'none'
        })
      }
    })
  },
  // 搜索周边设备  that.getBLEDeviceServices(deviceId)
  startBluetoothDevicesDiscovery() {
    let that = this;
    wx.startBluetoothDevicesDiscovery({
      services: ['FFF0', 'FEE7'], // 过滤其他设备
      success: function (res) {
        that.onBluetoothDeviceFound()
      }
    })
  },
  // 监听寻找到新设备的事件
  onBluetoothDeviceFound() {
    let that = this,
        bindData = this.data.bindData,
        firm = this.data.firm;

    wx.onBluetoothDeviceFound(function(res) {
      console.log('寻找到新设备=> ', res);
      let advertisData = null; //ios下通过设备advertisData获取设备id

      res.devices.forEach(item => {
        if(firm === 1) {
          advertisData = utils.arrayBufferToHexString(item.advertisData).substr(4,12);

          if(bindData.deviceId.replace(/:/g,'') === advertisData) {
            console.log('pipei1',item.deviceId);
            
            bindData.deviceId = item.deviceId;
            that.setData({ bindData })
            that.connectTO(item.deviceId, bindData.serviceId, bindData.readId);
            wx.stopBluetoothDevicesDiscovery();
          }
        }else if(firm === 2) {
          advertisData = utils.ab2hex(new Uint8Array(item.advertisData, 0)).slice(2).join(':').toUpperCase();

          if(bindData.deviceId === advertisData) {
            bindData.deviceId = item.deviceId;
            that.setData({ bindData })
            that.connectTO(item.deviceId, bindData.serviceId, bindData.readId);
            wx.stopBluetoothDevicesDiscovery();
          }
        }
      })
    });

    // 超时后,自动关闭 
    setTimeout(() => {
      wx.stopBluetoothDevicesDiscovery() 
    }, config.BLUETIMEOUT)
  },
  // 获取连接设备的service服务uuid
  getBLEDeviceServices: function (deviceId) {
    let that = this,
        firm = this.data.firm,
        bindData = this.data.bindData;
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId: deviceId,
      success: function (res) {
        console.log('获取连接设备的service服务: ', res);
        let serviceId = res.services[0].uuid
        bindData.deviceId = deviceId
        bindData.serviceId = serviceId
        that.setData({
          bindData
        })
        //TODO: 貌似不用获取特征码,可以直接开锁
        // if(firm === 1) { // 判断厂商设备
        //   that.asddnotifyBLECharacteristicValueChange(deviceId, serviceId, bindData.writeId);
        // }else if(firm === 2) {
        //   that.notifyBLECharacteristicValueChange(deviceId, serviceId, bindData.readId);
        // }
        that.getBLEDeviceCharacteristics(deviceId, serviceId)
      }
    })
  },
  //获取连接设备的所有特征值uuid  for循环获取不到值
  getBLEDeviceCharacteristics: function(deviceId, serviceId) {
    let that = this,
        firm = this.data.firm,
        bindData = this.data.bindData;
    wx.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId,
      success: function (res) {
        if(firm === 1) {
          that.notifyBLECharacteristicValueChange(deviceId, serviceId, res.characteristics[0].uuid)
        }else if(firm === 2) {
          that.notifyBLECharacteristicValueChange(deviceId, serviceId, res.characteristics[1].uuid)
        }


        // console.log('res: ', res);
        // bindData.writeId = res.characteristics[0].uuid
        // if(res.characteristics[1]) {
        //   bindData.readId = res.characteristics[1].uuid
        // }

        // that.setData({ bindData })
        
        // if(bindData.firm_code === 'fee7') { // 判断厂商设备
        //   that.notifyBLECharacteristicValueChange(deviceId, serviceId, bindData.readId)
        // } else if(bindData.firm_code === 'fff0') {
        //   that.asddnotifyBLECharacteristicValueChange(deviceId, serviceId, bindData.writeId)
        // }
      },
      fail: function () {},
      complete: function () {}
    })
  },
  // 开锁
  openLock() {
    let sys = this.data.sys;
    console.log('openLock',sys);
    /*
    ios和安卓的区别在连接后要不要再次获取设备id 和 服务uuid
    */
    if (sys === 'ios') {
      this.iosPhone();
    }else if(sys === 'android') {
      this.androidPhone();
    }
    
    // 检查是否有已连接设备
    // wx.getConnectedBluetoothDevices({
    //   success: function (res) {
    //     console.log('检查是否有已连接设备res: ', res);
    //     if(res.devices.length) {
    //       that.writeBLECharacteristicValue(openKey)
    //     }else {
    //       that.connectTO(bindData.deviceId, bindData.serviceId, bindData.readId)
    //     }
    //   }
    // })
  },
  iosPhone() {
    this.startBluetoothDevicesDiscovery()
  },
  androidPhone() {
    let bindData = this.data.bindData;
    this.connectTO(bindData.deviceId, bindData.serviceId, bindData.readId);
  },
  /* 
    asdd厂家开锁逻辑
  */
  asddLock(sData, btRandrom) {
    let sendData = null,
        bindData = this.data.bindData;

    if (btRandrom) {
      let cryptoKey = new Uint8Array(config.KEY_ASDD);
      for (let i = 0; i < btRandrom.length; i++) {
        cryptoKey[i] = btRandrom[i];
      }

      let bData = cryptoService.encrypt(sData, cryptoKey);
      let enDataBuf = new Uint8Array(bData);
      sendData = enDataBuf.buffer;
    }
    return sendData;
  },
  // 向低功耗蓝牙设备特征值中写入二进制数据(宜家)
  yijiaLock(sData) {
    /*
      宜家锁收发数据js中为16位数据,可以为字符串,不影响结果
      向蓝牙锁写入分2步:
      1. 处理指令
      2. 加密
    */
    let that = this,
        sendData = null,
        bindData = this.data.bindData,
        len = 16 - sData.length;

    // 1处理指令
    for(let i = 0; i < len; i++) {
      sData.push('0x30')
    }

    // 期望得到的数据 [0xCA, 0xFB, 0x4A, 0xC9, 0x88, 0x96, 0x6A, 0x67, 0x63, 0x39, 0xFE, 0x49, 0x07, 0x05, 0xB1, 0xF9]
    // let qres = '0xCA 0xFB 0x4A 0xC9 0x88 0x96 0x6A 0x67 0x63 0x39 0xFE 0x49 0x07 0x05 0xB1 0xF9'
    // console.log('期望得到的数据: ', qres);

    // 2加密
    let bData = cryptoService.encrypt(sData, config.KEY_YIJIA).map(item => {
      return '0x' + item.toString(16).toUpperCase()
    })

    // 转换为ArrayBuffer
    let enDataBuf = new Uint8Array(bData);
    sendData = enDataBuf.buffer;
    return sendData;
  },
  writeBLECharacteristicValue(sData, btRandrom) {
    let firm = this.data.firm,
        bindData = this.data.bindData,
        sendData = null,
        that = this;
    //TODO: 处理发送数据sendData
    if(firm === 1) {
      sendData = this.asddLock(sData, btRandrom)
    }else {
      sendData = this.yijiaLock(sData)
    }

    //TODO: 封装写入函数
    wx.writeBLECharacteristicValue({
      deviceId: bindData.deviceId,
      serviceId: bindData.serviceId,
      characteristicId: bindData.writeId,
      value: sendData,
      success(res) {
        console.log('蓝牙写入成功: ', res);
      },
      fail(err) {
        // 10007 当前特征值不支持此操作
        console.log('蓝牙写入失败: ', err);
      }
    })
  },
  // 连接设备
  connectTO: function (deviceId, serviceId, characteristicId) {
    let that = this,
        sys = this.data.sys,
        bindData = this.data.bindData;
        
    wx.createBLEConnection({
      deviceId: deviceId,
      success: function (res) {
        console.log("设备连接成功");

        if(sys === 'ios') {
          // 获取服务id
          that.getBLEDeviceServices(deviceId)
        }else if(sys === 'android') {
          // 获取服务id
          that.notifyBLECharacteristicValueChange(deviceId, serviceId, characteristicId)
        }
      },
      fail: function (err) {
        console.log('连接设备失败err: ', err);
        wx.showToast({
          title: '连接设备失败',
          icon: 'none'
        })
      },
      complete: function () {}
    });
  },
  // 启用低功耗蓝牙设备特征值变化时的 notify 功能
  notifyBLECharacteristicValueChange(deviceId, serviceId, characteristicId) {
    let that = this,
        firm = this.data.firm;

    if(firm === 1) {
      wx.notifyBLECharacteristicValueChange({
        state: true,
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: characteristicId,
        complete(res) {
          wx.onBLECharacteristicValueChange(function (characteristic) {
            if (characteristic.characteristicId.toLowerCase().indexOf("fff6") != -1) {
              var char6value = new Uint8Array(characteristic.value, 0);
        
              var tmp = "";
              tmp = String.fromCharCode.apply(String, char6value);
  
              if (tmp.substring(0, 3) == 'KEY') 
              { 
                let btRandrom = char6value.subarray(3); 
                that.writeBLECharacteristicValue(config.DIRECTIVE.asdd.open, btRandrom)
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
        fail(err){
          console.log(err);
        }
      })
    }else if(firm === 2) {
      wx.notifyBLECharacteristicValueChange({
        state: true,
        deviceId: deviceId,
        serviceId: serviceId,
        characteristicId: characteristicId,
        success(res) {
          // 写入数据,获取Token
          that.writeBLECharacteristicValue(config.DIRECTIVE.yijia.token)
        },
        complete(res) {
          // 监听设备变化
          wx.onBLECharacteristicValueChange(function (characteristic) {
            if (characteristic.characteristicId.toLowerCase().indexOf("36f6") != -1) {
              let char6value = new Uint8Array(characteristic.value, 0);
              // 转化响应数据
              let lockData = utils.ab2hexyj(char6value)
              // 解密
              lockData = cryptoService.decrypt(lockData, config.KEY_YIJIA).map(item => {
                return '0x' + item.toString(16).toUpperCase()
              })
  
              let pass = ['0x30', '0x30', '0x30', '0x30', '0x30', '0x30']
              pass = config.DIRECTIVE.yijia.open.concat(pass).concat(lockData[3],lockData[4],lockData[5],lockData[6])
              that.setData({ openKey: pass })
  
              that.writeBLECharacteristicValue(pass)
            }
          })
        },
        fail(err){
          console.log('notify接口err: ', err);
          wx.showToast({
            title: 'notify接口开启失败',
            icon: 'none'
          })
        }
      })
    }
  }
})

// pages/nearby/nearby.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devices: [],
    connectedDevice: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.init()
  },
  onFind() {
    this.init()
  },
  init() {
    var that = this
    if (!wx.openBluetoothAdapter) {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return
    }

    wx.openBluetoothAdapter({
      success(res) {
        that.getBluetoothAdapterState()
      },
      fail(err) {
        wx.showToast({
          title: '当前蓝牙适配器不可用',
          icon: 'none'
        })
      },
      complete() {
        // that.onBluetoothAdapterStateChange()
      }
    })
  },
  // 获取本机蓝牙适配器状态。
  getBluetoothAdapterState() {
    let that = this
    wx.getBluetoothAdapterState({
      success(res) {
        let { available, discovering } = res

        if(!available) {
          wx.showToast({
            title: '请开启手机蓝牙再试',
            icon: 'none'
          })
          return
        } 
        if(available && discovering) {
          wx.showToast({
            title: '蓝牙已经在搜索',
            icon: 'none'
          })
          return
        } 
        that.devicesDiscovery()
      },
      fail(err) {

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
          title: '手机蓝牙正在开启中',
          mask: true
        })
        setTimeout(() => {
          wx.hideLoading()
          // that.init()
        }, 2000)
      }else {
        wx.showToast({
          title: '您关闭了手机蓝牙',
          icon: 'none'
        })
      }
    })
  },
  // 搜索周边设备
  devicesDiscovery() {
    let that = this;
    wx.startBluetoothDevicesDiscovery({
      services: ['FFF0', 'FEE7'], // 过滤其他设备
      success: function (res) {
        console.log(res);
        
        // setTimeout(() => {
        //   that.stopDevicesDiscovery()
        // }, 3000)
        that.onBluetoothDeviceFound()
        // //监听蓝牙适配器状态
        // wx.onBluetoothAdapterStateChange(function (res) {
            
        // })
      }
    })
  },
  // 监听寻找到新设备的事件
  onBluetoothDeviceFound() {
    let that = this
    wx.onBluetoothDeviceFound(function(res) {
      console.log('寻找到新设备res: ', res);
      // devicesArr.concat(res.devices)
      that.setData({ devices: that.data.devices.concat(res.devices) })
    })
  },
  // 获取所有已发现的设备
  getBluetoothDevices: function () {
    var that = this;
    wx.getBluetoothDevices({
      success: function (res) {
        console.log('获取所有已发现的设备: ', res);
        let devicesArr = res.devices
        wx.onBluetoothDeviceFound(function(res) {
          devicesArr.concat(res.devices)
          that.setData({ devices: devicesArr })
        })
        
        //是否有已连接设备
        wx.getConnectedBluetoothDevices({
            success: function (res) {
                console.log(JSON.stringify(res.devices));
                that.setData({
                  connectedDevice: res.devices
                })
            }
        })

        //监听蓝牙适配器状态
        // wx.onBluetoothAdapterStateChange(function (res) {
        //     that.setData({
        //         sousuo: res.discovering ? "在搜索。" : "未搜索。",
        //         status: res.available ? "可用。" : "不可用。",
        //     })
        // })
      }
    })
  },
  connect(e) {
    let deviceId = e.currentTarget.id,
    name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: "/pages/lock/lock?deviceId=" + deviceId + "&name=" + name
    })
  },
  //停止搜索周边设备
  stopDevicesDiscovery: function () {
    var that = this;
    wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          wx.showToast({
            title: '停止搜索周边设备'
          })
        }
    })
  },
  onClose() {
    wx.closeBluetoothAdapter({
      success(res) {
        wx.showToast({
          title: '蓝牙已经关闭'
        })
      },
      fail(err) {

      }
    })
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
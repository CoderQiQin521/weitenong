// pages/address/address.js
var http = require('../../http/request')
var api = require('../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getAddr: [],
    isCreate: false
  },
  backCreate(e) {
    let isCreate = this.data.isCreate
    let { aid } = e.currentTarget.dataset

    if(!isCreate) return
    wx.setStorageSync('aid', aid)
    wx.navigateBack()
  },
  onSwipeCell(event) {
    let that = this
    let { aid } = event.currentTarget.dataset,
    getAddr = this.data.getAddr
    let oIndex = getAddr.findIndex(item => item.default === 1)
    let index = getAddr.findIndex(item => item.aid === aid)
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
        http.request('POST', api.ApiUserChange, { aid }).then(res => {
          if (res.error_code === 0) {
            getAddr[oIndex].default = 0
            getAddr[index].default = 1
            that.setData({ getAddr })
          }
        })
        instance.close();
        break;
      case 'cell':
        instance.close();
        break;
      case 'right':
        wx.showModal({
          title: "确定删除吗？",
          success: function(res) {
            if ( res.confirm ) {
              http.request('POST', api.ApiUserAddrDel, { aid }).then(res => {
                if (res.error_code === 0) {
                  getAddr.splice(index, 1)
                  that.setData({ getAddr })
                }
                wx.showToast({
                  title: res.msg,
                  icon: res.error_code === 0 ? 'success' : 'none'
                })
              })
            }
            instance.close();
          }
        })
        // Dialog.confirm({
        //   message: '确定删除吗？'
        // }).then(() => {
        //   instance.close();
        // });
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.create) {
      this.setData({ isCreate: true })
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
    http.request('GET', api.ApiUserAddr).then(res => {
      if (res.error_code === 0) {
        this.setData({ getAddr: res.data })
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
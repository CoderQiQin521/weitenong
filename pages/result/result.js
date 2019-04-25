// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resData: {}
  },
  toIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { type } = options,
        resData= {}
    switch (type) {
      case '1':
        resData = {
          type: 'success',
          title: '购买成功',
          msg: '再来一单吧'
        }
        break;
      case '2':
        resData = {
          type: 'cancel',
          title: '购买失败',
          msg: '您已取消支付'
        }
        break;
      case '3':
        resData = {
          type: 'success',
          title: '提交成功',
          msg: '我们将以最快的速度给您回应'
        }
        break;
      case '4':
        resData = {
          type: 'cancel',
          title: '提交失败',
          msg: '系统繁忙,请稍后再试'
        }
        break;
      case '5':
        resData = {
          type: 'success',
          title: '评价成功',
          msg: '看看别的商品'
        }
        break;
      default:
        break;
    }
    this.setData({
      resData
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
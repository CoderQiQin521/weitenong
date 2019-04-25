const pay = (params) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: params.timeStamp,
      nonceStr: params.nonceStr,
      package: params.package,
      signType: 'MD5',
      paySign: params.paySign,
      success(res) {
        resolve(res)
       },
      fail(err) {
        reject(err)
        wx.showToast({
          title: '您已取消支付',
          icon: 'none',
          success: res => {
            setTimeout(() => {
              // 关闭所有页面
              wx.reLaunch({
                url: '/pages/result/result?type=2'
              })
            }, 1000)
          }
        })
      }
    })
  })
}

module.exports = {
  pay
}
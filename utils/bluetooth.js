/* wx蓝牙模块
 * @Author: coderqiqin@aliyun.com 
 * @Date: 2019-03-28 09:45:19 
 * @Last Modified by:   CoderQiQin 
 * @Last Modified time: 2019-03-28 09:45:19 
 */

// 初始化
const openBluetoothAdapter = (cb,errcb, complete) => {
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
      cb(res)
    },
    fail(err) {
      errcb(err)
    },
    complete() {
      complete()
    }
  })
}

module.exports = {
  openBluetoothAdapter
}
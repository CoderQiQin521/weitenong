/*
 * @Author: coderqiqin@aliyun.com 
 * @Date: 2019-04-03 15:12:52 
 * @Last Modified by:   CoderQiQin 
 * @Last Modified time: 2019-04-03 15:12:52 
 */
const request = (method, url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      header: { token: '50a00a9b8d3402ed4f1b3ed4b890294b', uid: wx.getStorageSync('uid') },
      data: data,
      success: res => {
        if (res.statusCode === 200) {
          let resData = res.data
          if(res.data.error_code === 502) {
            wx.removeStorageSync('uid')
            wx.navigateTo({
              url: '/pages/login/login'
            })
            return
          }
          resolve(resData)
        } else {
          reject(res)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

module.exports = {
  request
}
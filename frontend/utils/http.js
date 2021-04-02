let API = require('../utils/api.js');
const http = ({ url = '', data = {}, ...other } = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: API.BASE_URL+url,
      data: data,
      header: {
        'content-type': 'application/json', // 默认值 ,
        'cookie': wx.getStorageSync('sessionId')
      },
      method: 'post',
      ...other,
      complete: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
            if(res.statusCode == 401){
                wx.removeStorageSync('cookie')
                wx.redirectTo({
                  url: '/pages/login/login'
                })
            }else{
                reject(res)
            }
        }
      }
    })
  })
}

const _post = (url, data = {}) => {
  return http({
    url,
    data,
    method: 'post'
  })
}
const _uploadFile = function (opt) {
    var header = Object.assign({
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'cookie': wx.getStorageSync('cookie') //请求带cookie
    }, opt.header);
    let uploadTask = wx.uploadFile({
        url: API.BASE_URL+ opt.url, // 仅为示例，非真实的接口地址
        filePath: opt.filePath,
        name: opt.name || 'file',
        header: header,
        success(res) {
            let data = res.data
            if (typeof opt.successFn == 'function' && res.statusCode == 200) {
                opt.successFn(JSON.parse(data));
            }else{
                if(typeof opt.errorFn == 'function'){
                    opt.errorFn(data);
                }
            }
            // do something
            console.log("上传成功")
            console.log(res)
        }
    })
    uploadTask.onProgressUpdate((res) => {
        console.log('上传进度', res.progress)
        console.log('已经上传的数据长度', res.totalBytesSent)
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        if (typeof opt.progressFn == 'function') {
            opt.progressFn(res);
        }
    })
}

module.exports={
  _post,
  http,
  _uploadFile
}
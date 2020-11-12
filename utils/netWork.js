var requestHandler = {
  url: '',
  data: {},
  method: '',
  success: function (res) {
  },
  fail: function () {
  },
  complete: function () {
  }
}

function request(requestHandler) {
  var data = requestHandler.data;
  var url = requestHandler.url;
  var method = requestHandler.method;
  var header = requestHandler.header;
  wx.showLoading({
    title: '加载中...',
    mask: true
  })
  wx.request({
    url: url,
    data: data,
    method: method,
    header: header,
    success: function (res) {
      if (res.data.code == 11090005) {
        wx.showModal({
          content: '您还没有登录或登录过期，请登录',
          confirmText: '去登录',
          confirmColor: "#F5A623",
          cancelText: '回首页',
          success(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/my/agreement/agreement',
              })
            } else if (res.cancel) {
              wx.reLaunch({
                url: '/pages/index/index/index',
              })
            }
          }
        })
      }
      wx.hideLoading();
      requestHandler.success(res)

    },
    fail: function () {
      wx.hideLoading();
      requestHandler.fail();
    },
    complete: function () {

    }
  })
}

module.exports = {
  request: request
}
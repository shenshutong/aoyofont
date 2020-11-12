// pages/my/discounts/discounts.js
const app = getApp();
var netapi = require("../../../utils/api.js");
var netWork = require('../../../utils/netWork.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuBotton: app.globalData.menuBotton,
    menuHeight: app.globalData.menuHeight,
    cateItems: [
        {
            cate_id: 0,
            cate_name: '未使用',
        },
        {
            cate_id: 1,
            cate_name: ' 已使用',
        },
        {
            cate_id: -1,
            cate_name: '已失效'
        }
    ],
    curNav: 0,
    curIndex: 0,
    discounts: []
  },
  //优惠券条件筛选
  switchRightTab: function (e) {
    let id = e.target.dataset.id, index = e.target.dataset.index;
    this.getCouponListByStatus(id)
    this.setData({
        curNav: id,
        curIndex: index
    })
  },
  //返回上一页
  backMyIndex: function () {
    wx.navigateBack({
        delta: 1
    })
  },


   //查询优惠券
   getCouponListByStatus(index) {
    var index = index ? index : 0;
    var that = this;
    //var getCouponListByStatus = netapi.getCouponListByStatus;
    var num = Number([index]);
    wx.request({
        url:'http://localhost:8081/user/showMyDiscount',
        method: "POST",
        header: {
            "content-type": "application/json",
            "Ltoken": wx.getStorageSync('token'),
            "LclientCode": 3
        },
        success: function (res) {
          console.log(res.data)
          if(res.data != '' && res.data != null){
              that.setData({
                maxcount:res.data.length,
                discounts:res.data,
              })
          }
        }
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCouponListByStatus();
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
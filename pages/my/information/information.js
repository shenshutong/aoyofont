// pages/my/information/information.js
const app = getApp()
var netapi = require("../../../utils/api.js");
var netWork = require('../../../utils/netWork.js');
//var token = wx.getStorageSync('token');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuBotton: app.globalData.menuBotton,
    menuHeight: app.globalData.menuHeight,
    imagePrefix: netapi.imagePrefix,//图片路径
    //photo: "",//头像
    aoyo_nikeName: "",//昵称
    aoyo_phone: '',//手机号
    aoyo_name: "",//真实姓名
    aoyo_sex: 0,//性别
    aoyo_birthday: "",//生日
    aoyo_age: "",//年龄
    show: false,
    sexItems: [{
        name: '男',
        value: '1',
        checked: true
    }, {
        name: '女',
        value: '2',
        checked: false
    }]

  },

  backMyOne:function(){
      wx.navigateBack({
        delta: 1,
      })
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
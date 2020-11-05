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
        discounts: []
    },
    //返回上一页
    backMyIndex: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //查询优惠券列表
    getCouponListByStatus() {
        var that = this;
        // var getCustomAllowReceiveCouponList = netapi.getCustomAllowReceiveCouponList;
        netWork.request({
            url: "http://localhost:8081/coupon/getCouponNewList",
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    discounts: _data
                })
            }
        })
    },
    //领取优惠劵
    receive(e) {
        var that = this;
        var id = e.target.dataset.id;
        wx.request({
            url: "http://localhost:8081/coupon/getCoupon",//receiveCoupon,
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: {
                "couponNewId":id
            },
            success: function (res) {
                if (res.data.flag == false) {
                    wx.showToast({
                        title: res.data.message,
                        icon: "none",
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: '领取成功',
                        duration: 2000
                    }),
                    that.onLoad()
                }
            }
        })
    },
    onShow: function(){
        if (app.globalData.Flag) {
              app.globalData.Flag = false;
              this.getData();//调用接口获取数据
        }  
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
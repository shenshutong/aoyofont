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
        var getCustomAllowReceiveCouponList = netapi.getCustomAllowReceiveCouponList;
        netWork.request({
            url: getCustomAllowReceiveCouponList,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                var _data = res.data.data;
                _data.forEach((item, index) => {
                    if (item.coupon_type_id == 2) {
                        item.coupon_amt = item.coupon_amt * 10
                    }
                })
                that.setData({
                    discounts: _data
                })
            }
        })
    },
    //领取优惠劵
    receive(e) {
        var typeid = e.target.dataset.typeid;
        var id = e.target.dataset.id;
        var receiveCoupon = netapi.receiveCoupon;
        wx.request({
            url: receiveCoupon,
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: {
                id: Number(id),
                classId: Number(typeid)
            },
            success: function (res) {
                if (res.data.status == false) {
                    wx.showToast({
                        title: res.data.desc,
                        icon: "none",
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: '领取成功',
                        duration: 2000
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
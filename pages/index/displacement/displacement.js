// pages/index/displacement/displacement.js
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
        car_id: 0,
        carName: "",
        carimg: "",
        offlineOrderFLg: 0,
        newCastomid: 0,
        items: []//发动机排量
    },
    //返回上一页
    backAddCarType: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //查询生产年份
    goYear: function (e) {
        var disId = e.target.dataset.id;
        wx.navigateTo({
            url: '/pages/index/proYear/proYear?id=' + disId + "&carID=" + this.data.car_id + "&carName=" + this.data.carName + "&carImg=" + this.data.carimg + "&offlineOrderFLg=" + this.data.offlineOrderFLg + "&newCastomid=" + this.data.newCastomid
        })
    },
    //查询发动机排量
    getCarEngineCapacity(id) {
        var getCarEngineCapacity = netapi.getCarEngineCapacity;
        var that = this;
        netWork.request({
            url: getCarEngineCapacity,
            data: {
                car_series_id: id
            },
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    items: _data
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.offlineOrderFLg) {
            this.setData({
                offlineOrderFLg: options.offlineOrderFLg,
                newCastomid: options.newCastomid
            })
        }
        this.setData({
            car_id: options.id,
            carName: options.carName,
            carimg: options.carImg
        })
        this.getCarEngineCapacity(options.id);
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
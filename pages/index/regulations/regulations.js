const app = getApp();
var netWork = require('../../../utils/netWork.js');
var netapi = require("../../../utils/api.js");

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
        wzList: []
    },
    //返回上一页
    backIndex3: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //查询违章结果
    getCloseJG(data) {
        var that = this;
        var getCarIllegal = netapi.getCarIllegal;
        var data = JSON.parse(data);
        netWork.request({
            url: getCarIllegal,
            data: data,
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    wzList: _data
                })
            }
        })
    },
	/**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: function (options) {
        this.getCloseJG(options.data);
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
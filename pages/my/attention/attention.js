const app = getApp();
var netapi = require("../../../utils/api.js");
var netWork = require('../../../utils/netWork.js');
// pages/my/attention/attention.js
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
        CustomCollectionList: [],//关注商品列表
    },
    //返回上一页
    backIndexMy: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //关注列表
    getCustomCollection() {
        //var queryCustomCollection = netapi.queryCustomCollection;
        var that = this;
        netWork.request({
            url: 'http://localhost:8081/user/commodityCollection',
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: {
                customId: wx.getStorageSync('SYSTEM_USER').USER_ID
            },
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    CustomCollectionList: _data
                })
            }
        })
    },
    //去商品详情
    goShoppDetail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/index/shoppDetail/index?commodityId=' + id
        })
    },
    //取消关注
    qunfollow(e) {
        var that = this;
        var id = e.target.dataset.index;
        //var deleteCustomCollection = netapi.deleteCustomCollection;
        wx.showModal({
            content: '取消关注此商品',
            success(res) {
                if (res.confirm) {
                    netWork.request({
                        url: 'http://localhost:8081/user/deleteCollection',
                        method: "GET",
                        header: {
                            "content-type": "application/json",
                            "Ltoken": wx.getStorageSync('token'),
                            "LclientCode": 3
                        },
                        data: {
                            collectionId: id
                        },
                        success: function (res) {
                            wx.showToast({
                                title: '取消关注成功',
                              })
                            if (res.data.status) {
                                that.getCustomCollection();
                            }
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    //添加至购物车
    addShoppCar(e) {
        var id = e.currentTarget.dataset.id;
        var addShoppCardUrl = netapi.addShoppCard + "?commodityId=" + id;
        netWork.request({
            url: addShoppCardUrl,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: (res) => {
                wx.showToast({
                    title: res.data.desc,
                    icon: 'success',
                    duration: 1500
                })
            }
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
        this.getCustomCollection();//查询关注商品收藏
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
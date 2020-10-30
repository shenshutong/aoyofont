// pages/shop/shopDetail/shopDetail.js
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
        imagePrefix: netapi.imagePrefix,//图片路径
        groupID: "",//门店ID
        shoppAdress: "",
        groupName: "",
        imagePrefix: netapi.imagePrefix,//图片路径
        groupDeatil: {},
        groupLatitude: "",
        groupLongitude: ""
    },
    //返回门店列表
    backHome: function () {
        const pages = getCurrentPages();
        if (pages.length === 2) {
            wx.navigateBack({
                delta: 1
            });
        } else if (pages.length === 1) {
            wx.navigateBack({
                delta: 1
            });
        } else {
            wx.navigateBack({
                delta: 1
            });
        }
    },
    //门店详情--------------------------------------
    getGroupDetail: function (id) {
        var groupDetailUrl = netapi.groupDetail + "?groupId=" + id;
        netWork.request({
            url: groupDetailUrl,
            success: (res) => {
                var _data = res.data;
                this.setData({
                    groupDeatil: _data,
                    shoppAdress: _data.groupAddressDetails,
                    groupName: _data.groupName,
                    groupLongitude: _data.groupLongitude,
                    groupLatitude: _data.groupLatitude
                })
            }
        })
    },

    //跳转服务页面----------------------------
    goFuwu : function(e){
        console.log(1)
    },
    //门店导航
    call_map: function (e) {
        let that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                wx.openLocation({
                    latitude: Number(that.data.groupLatitude),
                    longitude: Number(that.data.groupLongitude),
                    name: that.data.groupName,
                    address: that.data.shoppAdress,
                    scale: 18,
                    success: function (res) {

                    },
                    fail: function (err) {
                        wx.showToast({
                            title: '调用地图失败，请返回重试',
                        })
                    },
                })
            },
            fail: function (err) {

            }
        })
    },
    /**
     * 生命周期函数--监听页面加载---------------------------------------------
     */
    onLoad: function (options) {
        var that = this;
        var groupID = options.groupId;
        that.setData({
            groupID: groupID
        })
        that.getGroupDetail(options.groupId);
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
        let url = encodeURIComponent('/pages/shop/shopDetail/shopDetail?groupId=' + this.data.groupID);
        return {
            title: "店铺详情",
            path: `/pages/index/index/index?url=${url}`
        }
    }
})
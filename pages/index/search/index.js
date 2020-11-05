const app = getApp();
var netapi = require("../../../utils/api.js");
var netWork = require('../../../utils/netWork.js');

// pages/index/search/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuBotton: app.globalData.menuBotton,
        menuHeight: app.globalData.menuHeight,
        searchHistoryList: [],
        searchHotList: [],
        isshow: true,
        inputValue: ""
    },
    //返回上一页
    backHome: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //清空搜索历史
    delsteHisSearch: function () {
        var _this = this;
        var delSearchHistory = netapi.delSearchHistory;
        wx.showModal({
            title: '提示',
            content: '确定删除搜索历史吗',
            success(res) {
                if (res.confirm) {
                    netWork.request({
                        url: delSearchHistory,
                        method: "GET",
                        header: {
                            "content-type": "application/json",
                            "Ltoken": wx.getStorageSync('token'),
                            "LclientCode": 3
                        },
                        success: (res) => {
                            var _data = res.data.data;
                            _this.setData({
                                searchHistoryList: _data,
                                isshow: false
                            })
                        }
                    })

                }
            }
        })
    },
    //热门搜索
    getSearchHot: function () {
        var hotList = netapi.searchHot;
        netWork.request({
            url: hotList,
            success: (res) => {
                var _data = res.data.data;
                this.setData({
                    searchHotList: _data
                })
            }
        })
    },
    //搜索历史
    getSearchHistory: function () {
        var searchHistory = netapi.searchHistory;
        netWork.request({
            url: searchHistory,
            data: {
                customId: wx.getStorageSync('SYSTEM_USER').USER_ID ? wx.getStorageSync('SYSTEM_USER').USER_ID : -1
            },
            success: (res) => {
                var _data = res.data.data;
                if (_data <= 0) {
                    this.setData({
                        isshow: false
                    })
                }
                this.setData({
                    searchHistoryList: _data
                })
            }
        })
    },
    getInputValue(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    //搜索商品
    searchShopp: function () {
        wx.navigateTo({
            url: '/pages/index/shoppList/shoppList?commodityName=' + this.data.inputValue
        })
    },
    //搜索历史
    goShoppList: function (e) {
        var value = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/index/shoppList/shoppList?commodity_name=' + value
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
        this.getSearchHot();//热门搜索
        this.getSearchHistory();//搜索历史
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
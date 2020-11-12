// pages/classify/classify.js
const app = getApp();
var netapi = require("../../../utils/api.js");
//var netWork = require('../../../utils/netWork.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuBotton: app.globalData.menuBotton,
        menuHeight: app.globalData.menuHeight,
        cateItems: [],
        shoppDetailList: [],
        curNav: 1,
        curIndex: 0
    },
//    //搜索商品
//    searchShopp: function () {
//     var that=this;
//     if(this.data.inputValue!=null && this.data.inputValue!=''){
//         that.inputValue='搜索商品';
//         wx.navigateTo({
//             url: '/pages/classify/shoppList/shoppList?commodityName=' + this.data.inputValue
//         })
//     }else{
//         that.inputValue='搜索商品';
//         wx.navigateTo({
//             url: '/pages/classify/shoppList/shoppList?commodityName=' + '搜索商品'
//         })
//     }
// },
 
    //商品分类列表
    ShoppTypeList: function () {
        var shoppTypeUrl = netapi.shoppTypeUrl;
        wx.request({
            url: shoppTypeUrl,
            success: (res) => {
                var _data = res.data
                var shoppDetailUrl = netapi.shoppTypeDetail + "?appClassId=" + _data[0].appClassId;
                wx.request({
                    url: shoppDetailUrl,
                    success: (res) => {
                        var _data = res.data;
                        this.setData({
                            shoppDetailList: _data
                        })
                    }
                })
                this.setData({
                    cateItems: _data
                })
            }
        })
    },

    switchRightTab: function (e) {
        var data = e.currentTarget.dataset.id;
        var shoppDetailUrl = netapi.shoppTypeDetail + "?appClassId=" + data;
        wx.request({
            url: shoppDetailUrl,
            success: (res) => {
                var _data = res.data;
                this.setData({
                    shoppDetailList: _data
                })
            }
        })
    },
    //点击品牌
    iqoo: function (e) {
        let name = e.currentTarget.dataset.name;
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/classify/shoppList/shoppList?commodityName=' + name + "&brandId=" + id
        })
    },
    //搜索商品
    goSearch: function () {
        wx.navigateTo({
            url: '/pages/index/search/index',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.ShoppTypeList(); //商品分类列表
       
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
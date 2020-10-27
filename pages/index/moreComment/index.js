const app = getApp();
var netapi = require("../../../utils/api.js");
var netWork = require('../../../utils/netWork.js');
// pages/index/moreComment/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuBotton: app.globalData.menuBotton,
        menuHeight: app.globalData.menuHeight,
        commentList: [],//评论列表
        photoList: [],
        photo2: [],
        videoClos: false,
        imgclose: false,
        count: 0
    },
    //返回上一页
    backshoppDetail: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //查询商品评论
    getCommodityToMongoJSON(id) {
        var that = this;
        var getCommentByCommoditId = netapi.getCommentByCommoditId;
        netWork.request({
            url: getCommentByCommoditId,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: {
                commoditId: id,
                start: 0,
                length: 0
            },
            success: function (res) {
                var _data = res.data.data;
                var arr = that.data.photoList;
                _data.forEach(item => {
                    var commentList = item.context.files;
                    var newArr = [];
                    commentList.forEach((item, index) => {
                        var filename = item;
                        var index1 = filename.lastIndexOf(".");
                        var index2 = filename.length;
                        var type = filename.substring(index1, index2);
                        if (type == ".mp4" || type == ".avi" || type == ".flv" || type == ".webm") {
                            commentList = []
                            var obj = {};
                            obj.type = "1";
                            obj.name = item;
                            newArr.push(obj)
                        }

                        if (type == ".png" || type == ".jpg" || type == ".jpeg") {
                            arr.push(item)
                            var obj = {};
                            obj.type = "2";
                            obj.name = item;
                            newArr.push(obj)
                        }
                    })
                    item.context.files = newArr;
                })
                that.setData({
                    commentList: _data,
                    photoList: arr
                })
            }
        })
    },
    //预览图片，放大预览
    preview(event) {
        let currentUrl = event.currentTarget.dataset.src;
        let newArr = [];
        this.data.photoList.forEach((item, index) => {
            newArr.push(item)
        })
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls: newArr // 需要预览的图片http链接列表
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            count: options.count
        })
        this.getCommodityToMongoJSON(options.shoppid);//评论列表查询
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
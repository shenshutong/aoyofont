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
        groupAllList: [],//门店列表
        lng: "",//经度
        lat: "",//纬度
        option1: [
            { text: '距离', value: 1 },
            { text: '销量', value: 2 },
            { text: '评分', value: 3 },
            { text: '品牌', value: 4 },
        ],
        value1: 1,
        id: 0,
        status: 1,
        isload: false,
        thisIndex: 6,
        dataShow: false,
        visible: false,
        filterID: "",
        filterName: "",
        carType: '',
        carImg: ""
    },
    //查询所有商户
    getGroupAll: function () {
        var that = this;
        var getGroupAllUrl = netapi.nearbyShopUrl;
        var detail = wx.getStorageSync('groupValue')
        netWork.request({
            url: getGroupAllUrl,
            data: {
                lng: that.data.lng,
                lat: that.data.lat,
                start: 0,
                length: that.data.thisIndex,
                filter_type: detail ? detail : '1',
                code: that.data.id,
                custom_id: wx.getStorageSync('SYSTEM_USER').USER_ID ? wx.getStorageSync('SYSTEM_USER').USER_ID : 0
            },
            success: (res) => {
                if (that.data.thisIndex >= res.data.total) {
                    that.setData({
                        isload: false,
                        dataShow: true
                    })
                }
                var groupList = res.data.data;
                if (groupList) {
                    groupList.forEach((item, idnex) => {
                        if (item.distance_now) {
                            item.distance_now = item.distance_now.toFixed(2);
                        }
                        if (item.groupService != null) {
                            if (item.groupService.length >= 3) {
                                item.groupService.length = 2
                            }
                        }
                        if (item.group_score >= 5) {
                            item.group_score = 5
                        }
                    })
                }
                that.setData({
                    groupAllList: groupList,
                    isload: false
                })
            }
        })

    },
    //门店商品列表
    goShopDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/shop/shopCommodity/shopCommodity?id=' + id
        })
    },
    //分页
    updatePage: function () {
        let index = this.data.thisIndex;
        index += 6;
        this.setData({
            isload: true,
            thisIndex: index
        });
        this.getGroupAll();
    },
    //筛选
    filterList: function () {
        this.setData({
            visible: !this.data.visible
        })
    },
    //筛选门店
    mySelect: function (e) {
        var value = e.currentTarget.dataset.id;
        var name = e.currentTarget.dataset.name;
        wx.setStorageSync('groupValue', value);
        this.getGroupAll();//查询所有商户列表
        this.setData({
            visible: false,
            filterID: value,
            filterName: name,
        })
    },
    //查询默认车辆
    getCustomCarwhetherIs() {
        var getCustomCarwhetherIs = netapi.getCustomCarwhetherIs;
        var that = this;
        wx.request({
            url: getCustomCarwhetherIs,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                if (res.data.status == true) {
                    var _data = res.data.data;
                    that.setData({
                        carType: _data[0].car_model[0].car_series_name,
                        carImg: _data[0].car_model[0].car_brand_logo_url_1
                    })
                } else {
                    that.setData({
                        carType: '',
                        custom_car_id: ''
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.latitud) {
            this.setData({
                lat: options.latitud,
                lng: options.longitud
            })
        } else {
            this.setData({
                lat: wx.getStorageSync('lat'),
                lng: wx.getStorageSync('lng')
            })
        }
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
        var that = this;
        var id = wx.getStorageSync('cityID');
        var code = wx.getStorageSync('cityCode');
        that.setData({
            id: id ? id : code
        })
        that.getGroupAll();
        that.getCustomCarwhetherIs();//查询默认车辆
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
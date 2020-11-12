// pages/shopping/delivery/delivery.js
const app = getApp();
var netapi = require("../../../utils/api.js");
var util = require("../../../utils/util.js");
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
        addressList: [],//收获地址
        defultAddress: []
    },
    //返回上一页
    backOrder: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //新建收货地址
    goAdd: function () {
        wx.navigateTo({
            url: '/pages/shopping/newAddress/newAddress'
        })
    },
    //查询收货地址
    addressList: function () {
        var that = this;
        //var addressListUrl = netapi.addressList;

        netWork.request({
            url: 'http://localhost:8081/user/showAddressList',
            method: "POST",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                console.log(res.data);
                var _data = res.data.data;
                console.log(_data);
                if (_data) {
                    const params = _data.filter(function (_data) {
                        return _data.defaultAddress == "1";
                    })
                    params.forEach((_data, index) => {
                        _data.telephone = util.telHideCenter(_data.telephone)
                    })
                    const params1 = _data.filter(function (_data) {
                        return _data.defaultAddress == "2";
                    })
                    params1.forEach((_data, index) => {
                        _data.telephone = util.telHideCenter(_data.telephone)
                    })
                    console.log(params);
                    that.setData({
                        addressList: params1,
                        defultAddress: params
                    })
                }else{
                    that.setData({
                        addressList: [],
                        defultAddress: []
                    })
                }

            }
        })
    },
    //编辑收货地址
    goAddressDetail: function (e) {
        var id = e.target.dataset.id;
        wx.navigateTo({
            url: '/pages/shopping/newAddress/newAddress?id=' + id,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.addressList();//查询收货地址
    },
})
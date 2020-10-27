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
        items: [],//车型信息
        carID: 0,
        car_dis: 0,
        carName: "",
        carImg: "",
        offlineOrderFLg: 0,
        newCastomid: 0,
        yearID: 0
    },
    //返回上一页
    backYear: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //查询车辆车型
    getCarModelName(carID, car_dis, id) {
        var getCarModelName = netapi.getCarModelName;
        var that = this;
        netWork.request({
            url: getCarModelName,
            data: {
                car_series_id: carID,
                car_engine_capacity: car_dis,
                car_model_year: id
            },
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    items: _data
                })
            }
        })
    },
    //添加车辆
    carBrand(e) {
        var that = this;
        var id = e.target.dataset.id;
        if (that.data.offlineOrderFLg == 1) {
            var saveCustomCar1 = netapi.saveCustomCar1;
            var param = {
                car_model_id: id
            }
            param = JSON.stringify(param);
            netWork.request({
                url: saveCustomCar1,
                data: {
                    "param": param,
                    customId: that.data.newCastomid
                },
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded",
                    "Ltoken": wx.getStorageSync('token'),
                    "LclientCode": 3
                },
                success: function (res) {
                    wx.reLaunch({
                        url: '/pages/my/CustomsDtation/CustomsDtation',
                    })
                }
            })
        } else if (that.data.offlineOrderFLg == 2) {
            var saveCustomCar1 = netapi.saveCustomCar1;
            var param = {
                car_model_id: id
            }
            param = JSON.stringify(param);
            netWork.request({
                url: saveCustomCar1,
                data: {
                    "param": param,
                    customId: that.data.newCastomid
                },
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded",
                    "Ltoken": wx.getStorageSync('token'),
                    "LclientCode": 3
                },
                success: function (res) {
                    wx.reLaunch({
                        url: '/pages/my/sheetCustoms/sheetCustoms',
                    })
                }
            })
        } else {
            var saveCustomCar = netapi.saveCustomCar;
            netWork.request({
                url: saveCustomCar,
                data: {
                    "param": {
                        car_model_id: id
                    }
                },
                method: "GET",
                header: {
                    "content-type": "application/json",
                    "Ltoken": wx.getStorageSync('token'),
                    "LclientCode": 3
                },
                success: function (res) {
                    wx.reLaunch({
                        url: '/pages/my/carport/carport',
                    })
                }
            })
        }

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
            carID: options.carID,
            car_dis: options.car_dis,
            yearID: options.id,
            carName: options.carName,
            carImg: options.carImg
        })
        this.getCarModelName(options.carID, options.car_dis, options.id)
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
})
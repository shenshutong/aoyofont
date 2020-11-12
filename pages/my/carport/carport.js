const app = getApp();
// pages/my/carport/carport.js
var netapi = require("../../../utils/api.js");
var netWork = require('../../../utils/netWork.js');
var token = wx.getStorageSync('token');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuBotton: app.globalData.menuBotton,
        menuHeight: app.globalData.menuHeight,
        list: [],
        total: 0
    },
    //返回上一页
    backOneMy: function () {
        const pages = getCurrentPages();
        if (pages.length === 2) {
            wx.navigateBack({
                delta: 1
            });
        } else if (pages.length === 1) {
            wx.reLaunch({
                url: '/pages/my/index/index',
            })
        } else if (pages.length === 3) {
            wx.navigateBack({
                delta: 2
            });
        } else {
            wx.navigateBack({
                delta: 1
            });
        }
    },
    //查询所有车辆
    getCustomCarList() {
        var getCustomCarList = netapi.getCustomCarList;
        var that = this;
        netWork.request({
            url: getCustomCarList,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                var _data = res.data.data;
                var total = res.data.total;
                that.setData({
                    list: _data,
                    total: total
                })
            }
        })
    },
    //设置为默认
    defelut(e) {
        var id = e.target.dataset.id;
        var that = this;
        var customCarIsNo = netapi.customCarIsNo;
        netWork.request({
            url: customCarIsNo,
            data: {
                custom_car_id: id
            },
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                if (res.data.status) {
                    that.getCustomCarList();
                }
            }
        })
    },
    //删除车辆
    deleteCar(e) {
        var deleteCustomCar = netapi.deleteCustomCar;
        var id = e.target.dataset.id;
        var code = e.target.dataset.code;
        var that = this;
        netWork.request({
            url: deleteCustomCar,
            data: {
                custom_car_id: id,
                whether_id: code
            },
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                if (res.data.status) {
                    that.getCustomCarList();
                }
            }
        })
    },
    //认证车辆
    myAuthent(e) {
        var id = e.target.dataset.id;
        wx.navigateTo({
            url: '/pages/my/authentication/authentication?id=' + id,
        })
    },
    //解绑行驶证
    goJdriving(e) {
        var idDriving = e.target.dataset.id;
        wx.navigateTo({
            url: '/pages/my/authentication/authentication?idDriving=' + idDriving,
        })
    },
    //添加车辆
    GoAddCar() {
        wx.navigateTo({
            url: '/pages/index/addCarType/addCarType',
        })
    },
    //车辆信息
    goLovecar(e) {
        var carid = e.currentTarget.dataset.id;
        var customId = wx.getStorageSync('SYSTEM_USER').USER_ID;
        wx.navigateTo({
            url: '/pages/my/loveCar/loveCar?id=' + carid + "&customid=" + customId
        })
    },
    //查询违章
    goChaweiZ(e) {
        var vin = e.currentTarget.dataset.vin;
        var fh = e.currentTarget.dataset.fh;
        var code = e.currentTarget.dataset.code;
        var name = e.currentTarget.dataset.name;//姓名
        var addr = e.currentTarget.dataset.addr;//住址
        var img = e.currentTarget.dataset.img;//证件图片
        var registertime = e.currentTarget.dataset.registertime;//注册日期
        var issuedate = e.currentTarget.dataset.issuedate;//发证日期
        var model = e.currentTarget.dataset.model;//品牌型号
        var usecharacter = e.currentTarget.dataset.usecharacter;//使用性质
        var vehicletype = e.currentTarget.dataset.vehicletype;//车辆类型
        var param = {
            custom_name: name,//姓名
            driving_img_url: img,//证件图片
            addr: addr,//住址
            model: model,//品牌型号
            use_character: usecharacter,//使用性质
            vehicle_type: vehicletype,//车辆类型
            register_time: registertime,//注册日期
            issue_date: issuedate//发证日期
        }
        var data = {
            code: code,
            type: "02",
            vin: vin,
            engine: fh,
            "param": param
        }
        var obj = JSON.stringify(data);
        wx.navigateTo({
            url: '/pages/index/regulations/regulations?data=' + obj,
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
        this.getCustomCarList();//查询所有车辆
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
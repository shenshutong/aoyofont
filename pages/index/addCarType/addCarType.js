// pages/index/addCarType/addCarType.js
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
        searchCtiy: '',
        searchValue: '',
        carTiele: "",
        carImg: "",
        imagePrefix: netapi.imagePrefix,//图片路径
        toView: '',//用来做定位联动
        cityList: [],//车辆列表
        searchNav: [],//zimusuoyin
        visible: false,
        searchShow: false,
        searchCarList: [],
        carHotList: [],//热门车辆
        carChridren: [],//车辆子集
        offlineOrderFLg: 0,
        newCastomid: 0
    },
    // 返回主页
    backfirst: function () {
        wx.navigateBack({
            delta: 1
        })
    },
     //打开弹出层
     isshow() {
        this.setData({
            visible: true,
        })
    },
    //关闭弹出层
    closePopUp() {
        this.setData({
            visible: false
        })
    },

    // 获取热门车辆品牌
    getHotCar() {
        var getHotCar = netapi.getHotCar;
        var that = this;
        wx.request({
            url: getHotCar,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    carHotList: _data
                    
                })
               
            }
        })
    },
     //获取所有车辆品牌
    getCarList() {
        var getCarList = netapi.getCarList;
        var that = this;
        wx.request({
            url: getCarList,
            success: function (res) {
                var _data = res.data.data;
                console.log(_data)
                let searchNav = that.data.searchNav;
                console.log(searchNav)
                let cityList = that.data.cityList;
                for (var i in _data) {
                    searchNav.push(i);
                    var obj = {};
                    obj.title = i;
                    obj.lists = _data[i];
                    cityList.push(obj)
                }
                that.setData({
                    searchNav: searchNav,
                    cityList: cityList
                })
            }
        })
    },
       // 获取车辆名称以及数据索引
    selectcity(e) {
        var that = this;
        let title = e.currentTarget.dataset.title;
        let img = e.currentTarget.dataset.img;
        let id = e.currentTarget.dataset.id;
        var addHotCar = netapi.addHotCar;
        var addCarSubset = netapi.addCarSubset + "?carBrandId=" + id;
        var data = {
            car_brand_id: id
        }
         //添加车辆热门
         wx.request({
            url: addHotCar,
            data: data,
            success: function (res) {
                 console.log(res)
            }
        });
        //添加车辆子集品牌
        netWork.request({
            url: addCarSubset,
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    carChridren: _data
                })
            }
        });
        this.setData({ visible: true, carTiele: title, carImg: img });
    },
     //点击英文字母进行跳转到相应位置
     cityScroll(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            toView: `car${index}`
        })
    },
    //选择发动机排量
    goDispla: function (e) {
        var carCid = e.target.dataset.id;
        wx.navigateTo({
            url: '/pages/index/displacement/displacement?id=' + carCid + "&carName=" + this.data.carTiele + "&carImg=" + this.data.carImg + "&offlineOrderFLg=" + this.data.offlineOrderFLg + "&newCastomid=" + this.data.newCastomid
        })
    },
    //搜索车辆品牌
    searchCity: function () {
        this.setData({
            searchShow: true
        })
    },
    //点击取消
    cancelSearch: function () {
        this.SearchNone();
    },
    //点击遮罩层消失
    SearchNone: function () {
        this.setData({
            searchShow: false,
            searchValue: ''
        })
    },
    //获取搜索车辆信息
    searchCar: function (e) {
        let searchValue = e.detail.value;
        var that = this;
        that.setData({
            searchValue: searchValue
        });
        var searchCar = netapi.searchCar + "?name=" + that.data.searchValue;
        wx.request({
            url: searchCar,
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    searchCarList: _data
                })
            }
        })
    },
    //点击搜索出来的每一项
    goIndex(e) {
        var carCid = e.target.dataset.id;
        var carCname = e.target.dataset.title;
        wx.navigateTo({
            url: '/pages/index/displacement/displacement?id=' + carCid + "&carName=" + carCname
        })
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
        this.getHotCar();
        this.getCarList();
        this.searchCar();
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
const app = getApp();
var netWork = require('../../../utils/netWork.js');
var netapi = require("../../../utils/api.js");
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');

var qqmapsdk = new QQMapWX({
    key: 'PJTBZ-3P6RW-HOBRW-OLTH6-AWCN3-RTF3I' // 必填
});

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
        toView: '',//用来做定位联动
        cityList: [],
        searchNav: [],
        nowCity: "",
        hotCityList: [],
        searchShow: false,
        searchCityList: []
    },
    //返回上一页
    backHome: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    hotCity: function (e) {
        this.selectcity(e)
    },
    //点击取消
    cancelSearch: function () {
        this.SearchNone();
    },
    //获取输入的城市
    getCity: function (e) {
        let searchValue = e.detail.value;
        var that = this;
        that.setData({
            searchValue: searchValue
        });
        var searchCity = netapi.searchCity + "?name=" + that.data.searchValue;
        netWork.request({
            url: searchCity,
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    searchCityList: _data
                })
            }
        })
    },
    // 获取城市名称以及数据索引 并且返回上一页
    selectcity(e) {
        let title = e.currentTarget.dataset.title;
        let id = e.currentTarget.dataset.id;
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
            title: title,
            id: id
        })
        wx.navigateBack({
            success: function () {
                prevPage.onLoad(); // 执行前一个页面的onLoad方法
            }
        });

        var addHotCity = netapi.addhotCityList;
        var data = {
            code: id
        }
        wx.request({
            url: addHotCity,
            data: data,
            success: function (res) {
                console.log(res)
            }
        })
    },
    //获取城市列表
    getCitySList: function () {
        var url = netapi.cityList;
        var that = this;
        netWork.request({
            url: url,
            success: function (res) {
                var _data = res.data.data;
                let searchNav = that.data.searchNav;
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
    //热门城市列表
    getHotCityList: function () {
        var hotList = netapi.hotCityList;
        var that = this;
        netWork.request({
            url: hotList,
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    hotCityList: _data
                })
            }
        })
    },
    //搜索城市
    searchCity: function () {
        this.setData({
            searchShow: true
        })
    },
    //点击遮罩层消失
    SearchNone: function () {
        this.setData({
            searchShow: false,
            searchValue: ''
        })
    },
    //选择城市
    goIndex: function (e) {
        this.selectcity(e)
    },
	/**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: function (options) {
        this.getCitySList();//城市列表
        this.getHotCityList();//热门城市列表
    },
    // 点击英文字母进行跳转到相应位置
    cityScroll(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            toView: `city${index}`
        })
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
        this.setData({
            nowCity: wx.getStorageSync('cityName')
        })
        //授权地理位置
        var _this = this;
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                const latitude = res.latitude;//纬度
                const longitude = res.longitude;//经度
                wx.setStorage({ key: 'lng', data: longitude });
                wx.setStorage({ key: 'lat', data: latitude });
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    success: function (res) {//成功后的回调
                        var res = res.result;
                        _this.setData({
                            nowCity: res.ad_info.city ? res.ad_info.city : "定位失败"
                        })
                    }
                })
            },
            fail(res) {
                wx.getSetting({
                    success: function (res) {
                        var statu = res.authSetting;
                        if (!statu['scope.userLocation']) {
                            wx.showModal({
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                                success: function (tip) {
                                    if (tip.confirm) {
                                        wx.openSetting({
                                            success: function (data) {
                                                if (data.authSetting["scope.userLocation"] === true) {
                                                    wx.showToast({
                                                        title: '授权成功',
                                                        icon: 'success',
                                                        duration: 1000,
                                                    })
                                                } else {
                                                    wx.showToast({
                                                        title: '授权失败',
                                                        icon: 'success',
                                                        duration: 1000
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
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
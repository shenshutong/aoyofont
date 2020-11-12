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
        toView: '',//用来做定位联动
        searchShow: false,
        cityList: [],
        searchNav: [],
        nowCity: "上海",
        hotCityList: ["北京市", "天津市", "广州市","阿拉善"]
    },
    backHome: function () {
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
    hotCity: function (e) {
        this.selectcity(e)
    },
    //   获取输入的城市
    // getCity: function (e) {
    //     let searchValue = e.detail.value;
    //     this.setData({
    //         searchValue: searchValue
    //     })
    // },
    // 传输要查找的城市
    chooseCity: function () {
        let cityName = this.data.searchValue;
        wx.reLaunch({
            url: '../index/index?cityName=' + cityName,
        });
    },
    //   获取城市的数据
    getCItyList() {
        var getCityList = netapi.getCityList;
        var that = this;
        wx.request({
            url: getCityList,
            success: function (res) {
                var _data = res.data.data;
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
    //获取搜索城市信息
    searchCityList: function (e) {
        let searchValue = e.detail.value;
        var that = this;
        that.setData({
            searchValue: searchValue
        });
        var searchCityList = netapi.searchCityList + "?name=" + that.data.searchValue;
        wx.request({
            url: searchCityList,
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    searchCityList: _data
                })
            }
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
    // 获取城市名称以及数据索引
    selectcity(e) {
        let title = e.currentTarget.dataset.title;
        wx.showToast({
            title: 'title:' + title,
            icon: 'none'
        })
    },
	/**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: function (options) {
        this.getCItyList();
        this.searchCityList();
        qqmapsdk = new QQMapWX({
            key: 'ACUBZ-DBG3X-JGX4H-7RXDI-4KFLQ-JVBWH' // 必填
        });
    },
    // 点击英文字母进行跳转到相应位置
    cityScroll(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            toView: `city${index}`
        })
    },
    // 点击英文字母进行跳转到相应位置
    cityScroll(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            toView: `city${index}`
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCItyList();
        this.searchCityList();
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
        // var _this = this;
        //调用定位方法
        // _this.getUserLocation();
    },
    //定位方法
    getUserLocation: function () {
        var _this = this;
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    //未授权
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                //取消授权
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                //确定授权，通过wx.openSetting发起授权请求
                                wx.openSetting({
                                    success: function (res) {
                                        if (res.authSetting["scope.userLocation"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            //再次授权，调用wx.getLocation的API
                                            _this.geo();
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    //用户首次进入页面,调用wx.getLocation的API
                    _this.geo();
                }
                else {
                    console.log('授权成功')
                    //调用wx.getLocation的API
                    _this.geo();
                }
            }
        })
    },
    // 获取定位城市
    geo: function () {
        var _this = this;
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: function (res) {
                        console.log(res)  //获取成功
                        console.log(res.result.address_component.province)  //当前位置省会
                        console.log(res.result.address_component.city)  //当前位置城市
                        console.log(res.result.address_component.district)  //当前位置区域
                        _this.setData({
                            nowCity: res.result.address_component.city
                        })
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
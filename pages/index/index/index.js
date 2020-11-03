const app = getApp();
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var netapi = require("../../../utils/api.js");
var netWork = require('../../../utils/netWork.js');
var qqmapsdk = new QQMapWX({
    key: 'ACUBZ-DBG3X-JGX4H-7RXDI-4KFLQ-JVBWH' // 必填
});

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [
 
        ],
     
        indicatorDots: true, //小点，根据图的数量自动增加小点
     
        autoplay: true, //是否自动轮播
     
        interval: 3000, //间隔时间
     
        duration: 1000, //滑动时间
    
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuBotton: app.globalData.menuBotton,
        menuHeight: app.globalData.menuHeight,
        city: "",
        car: "",
        carImg: "",
        swiperList: [],//轮播图
        Services: [],//首页type
        shoppList: [],//商品分类
        shopList: [],//附近门店
        latitud: null,
        longitud: null,
        markers: [],
        diDeail: "",
        imagePrefix: netapi.imagePrefix,//图片路径
        KFtell: '',
        showModal: false,
        id: '',
        title: '',
        custom_car_id: 0
    },

    //商品分类
    getCommodityIconPlate() {
        var that = this;
        // var CommodityIconPlate = netapi.getCommodityIconPlate;
        netWork.request({
            url: "http://localhost:8081/AoyoIndex/getCommodityPanel",
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    shoppList: _data
                })
            }
        })
    },
    //点击查看商品列表
    goShoppList(e) {
        var path = e.currentTarget.dataset.path;
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: path + id
        })
    },
    //选择城市
    goCity: function () {
        wx.navigateTo({
            url: '/pages/index/city/city'
        })
    },
    //商品详情
    itemDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/index/shoppDetail/index?commodityId=' + id
        })
    },
    //搜索页面
    goSearchPage: function () {
        wx.navigateTo({
            url: '/pages/index/search/index'
        })
    },
    //添加车型
    goCarType: function () {
        wx.navigateTo({
            url: '/pages/index/addCarType/addCarType'
        })
    },
    //拨打客服电话
    callPhone: function () {
        this.setData({
            showModal: true
        })
    },
    preventTouchMove: function () {
    },
    //关闭弹出框
    hideModal: function () {
        this.setData({
            showModal: false
        });
    },
    //关闭弹出框
    onCancel: function () {
        this.hideModal();
    },
    //对话框确认按钮点击事件
    onConfirm: function () {
        var that = this;
        wx.makePhoneCall({
            phoneNumber: that.data.KFtell
        })
        that.hideModal();
    },
    //预览图片，放大预览
    preview(event) {
        let currentUrl = event.currentTarget.dataset.src;
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls: this.data.swiperList // 需要预览的图片http链接列表
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
                    wx.setStorage({
                        data: _data[0].car_model[0].car_series_name,
                        key: 'carType',
                    })
                    that.setData({
                        car: _data[0].car_model[0].car_series_name,
                        custom_car_id: _data[0].custom_car_id,
                        carImg: _data[0].car_model[0].car_brand_logo_url_1
                    })
                } else {
                    that.setData({
                        car: '',
                        custom_car_id: ''
                    })
                }
            }
        })
    },
    //进入车辆详情信息
    goCarDetail(e) {
        var id = e.target.dataset.id;
        wx.navigateTo({
            url: '/pages/my/loveCar/loveCar?id=' + id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //轮播图
        wx.showLoading({
            title: '加载中',
       })
        this.text();

        wx.stopPullDownRefresh();
        this.indexType();//首页类型
        // this.sweiperF();//轮播图
        this.indexTell();//客服电话
        this.getCommodityIconPlate();//商品分类

        //授权地理位置
        var _this = this;
        wx.getLocation({
            type: 'gcj02',
            isHighAccuracy: true,//开启高精度定位
            success(res) {
                const latitude = res.latitude;//纬度
                const longitude = res.longitude;//经度
                wx.setStorage({ key: 'lng', data: longitude });
                wx.setStorage({ key: 'lat', data: latitude });
                var mks = [];
                mks.push({
                    latitude: latitude,
                    longitude: longitude
                });
                _this.setData({
                    latitud: latitude,
                    longitud: longitude,
                    markers: mks
                })
                _this.startSport();//实时定位
                _this.fjShoppList(latitude, longitude);//查找附近门店信息
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    success: function (res) {//成功后的回调
                        var res = res.result;
                        _this.setData({
                            diDeail: res.address,
                            city: res.ad_info.city
                        })
                        wx.setStorage({
                            key: 'cityName',
                            data: res.ad_info.city,
                        })
                        _this.getCityID(res.ad_info.city);
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

        if (options.url) {
            let url = decodeURIComponent(options.url);
            wx.navigateTo({
                url
            })
        }
    },
    //首页type
    indexType: function () {
        netWork.request({
            url: 'http://localhost:8081/AoyoIndex/getIndexPlatformImage',//后端传数据的路径
            success: (res) => {
                var _data = res.data.data;
                this.setData({
                    Services: _data
                })
            }
        })
    },
     //轮播图片
    text: function() {
        var that = this;//这部必须有，非常重要
        wx.request( {//从后端获取数据
            url: 'http://localhost:8081/AoyoIndex/getIndexImage',//后端传数据的路径
            data: {},
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                that.setData({
                    imgUrls: res.data.data
                })//这里的imgUrls和<wxml>的imgUrls是同一个变量，就是将从后端获取到的数据赋值给imgUrls，传到前面使用
                wx.hideLoading();//隐藏加载
            },error(){
                console.log("查询失败")
            }
        })
    },
    // 首页轮播图
    // sweiperF: function () {
    //     var indexSweiperUrl = netapi.indexSweiper;
    //     this.setData({
    //         swiperList: []
    //     })
    //     netWork.request({
    //         url: indexSweiperUrl,
    //         success: (res) => {
    //             var _data = res.data.data;
    //             var arr = this.data.swiperList;
    //             _data.forEach((item, index) => {
    //                 var obj = {};
    //                 obj.imgUrl = item.platform_image_uri;
    //                 obj.imgID = item.platform_image_id;
    //                 arr.push(obj)
    //             })
    //             this.setData({
    //                 swiperList: arr
    //             })
    //         }
    //     })
    // },
    //客服电话
    indexTell: function () {
        var indexTypeUrl = netapi.tellUrl;
        netWork.request({
            url: indexTypeUrl,
            success: (res) => {
                console.log(res.data)
                if(res.data.data!=null){
                    var _data = res.data.data;
                    _data.forEach((item, index) => {
                        this.setData({
                            KFtell: item.service_tel
                        })
                    })
                }
            }
        })
    },
    //附近门店
    fjShoppList: function (latitude, longitude) {
        var nearbyShop = netapi.nearbyShopUrl;
        netWork.request({
            url: nearbyShop,
            data: {
                lng: longitude,
                lat: latitude,
                filter_type: 5,
                code: 0
            },
            success: (res) => {
                var shopList = res.data.data;
                if (shopList) {
                    shopList.forEach((item, idnex) => {
                        item.distance_now = item.distance_now.toFixed(2);
                    })
                }
                this.setData({
                    shopList: shopList
                })
            }
        })
    },
    //查看更多
    lookGroupList: function () {
        var longitud = this.data.longitud;
        var latitud = this.data.latitud;
        wx.switchTab({
            url: '/pages/shop/index/index?longitud=' + longitud + "&latitud=" + latitud,
        })
    },
    //跳转门店详情
    goGroupDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/shop/shopCommodity/shopCommodity?id=' + id
        })
    },
    //首次查找城市code
    getCityID: function (cityname) {
        var that = this;
        var OneCityID = netapi.OneCityID;
        wx.request({
            url: OneCityID,
            data: {
                name: cityname
            },
            success: function (res) {
                var _data = res.data.data;
                _data.forEach((item, index) => {
                    that.setData({
                        id: item.city_code
                    })
                    wx.setStorage({
                        key: 'cityCode',
                        data: item.city_code
                    })
                })
            }
        })
    },
    //首页type功能
    getTypePage(e) {
        var id = e.currentTarget.dataset.id;
        var path = e.currentTarget.dataset.path;
        if (id == 5) {
            wx.navigateTo({
                url: path
            })
        }
        if (id == 4) {
            wx.navigateTo({
                url: path
            })
        }
        if (id == 3) {
            wx.navigateTo({
                url: path

            })
        }
        if (id == 2) {
            wx.navigateTo({
                url: path
            })
        }
        if (id == 1) {
            wx.navigateTo({
                url: path
            })
        }
    },
    // 后台运行gps
    startSport: function () {
        wx.getSetting({
            success: function (res) {
                var statu = res.authSetting;
                if (!statu['scope.userLocationBackground']) {
                    wx.showModal({
                        content: '请将位置信息改为“使用小程序期间和离开小程序后',
                        confirmText: '去设置',
                        cancelText: '已设置',
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
                                            wx.startLocationUpdateBackground({
                                                success: function (res) {
                                                    wx.onLocationChange(function (res) {
                                                        var latitude = res.latitude;
                                                        var longitude = res.longitude;
                                                        qqmapsdk.reverseGeocoder({
                                                            location: {
                                                                latitude: latitude,
                                                                longitude: longitude
                                                            },
                                                            success: function (res) {//成功后的回调
                                                                var upLocation = netapi.upLocation;
                                                                var res = res.result;
                                                                // 上传数据给服务端
                                                                wx.request({
                                                                    url: upLocation,
                                                                    method: "POST",
                                                                    header: {
                                                                        "Content-Type": "application/x-www-form-urlencoded",
                                                                        "Ltoken": wx.getStorageSync('token'),
                                                                        "LclientCode": 3
                                                                    },
                                                                    data: {
                                                                        province: res.ad_info.province,
                                                                        city: res.ad_info.city,
                                                                        county: res.ad_info.district,
                                                                        addr: res.address,
                                                                        lat: latitude,
                                                                        lon: longitude
                                                                    },
                                                                    success: function (res) {
                                                                        console.log(res)
                                                                    }
                                                                })
                                                            }
                                                        })

                                                    })
                                                },
                                                fail: function (res) {
                                                    console.log("失败了")
                                                }
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
    },
    //活动
    closeHd() {
        wx.navigateTo({
            url: '/pages/index/receiveCoupon/receiveCoupon',
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getCustomCarwhetherIs();//查询默认车辆
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];
        if (currPage.data.id) {
            this.data.id = currPage.data.id;
            this.data.title = currPage.data.title;
            wx.setStorage({
                key: 'cityID',
                data: currPage.data.id,
            })
            wx.setStorage({
                key: 'cityName1',
                data: currPage.data.title,
            })
        }


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
        this.onLoad();
        this.onShow();
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
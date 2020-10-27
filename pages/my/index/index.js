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
        all: 0,
        now: 0,
        pending: 0,
        evaluate: 0,
        accomplish: 0,
        nikeName: "",
        tell: "",
        photo: "",
        KFtell: '',
        showModal: false,
        carTotl: 0,
        attentionCount: 0,
        nameAuthention: false,
        custom_car_id: 0,
        xsKdshow: false,
        buttonShow: false,
        bangdingwx: "绑定微信",
        xsKdshow: false
    },
    //订单列表
    goorderList: function () {
        wx.navigateTo({
            //url: '/pages/my/orderList/orderList?index=0'
        })
    },
    //优惠券
    goyouhui: function () {
        wx.navigateTo({
           // url: '/pages/my/discounts/discounts'
        })
    },
    //关注商品
    goguanzhu: function () {
        wx.navigateTo({
           // url: '/pages/my/attention/attention'
        })
    },
    //个人信息
    goInfor: function () {
        wx.navigateTo({
            url: '/pages/my/information/information'
        })
    },
    //我的车库
    gomeCarKu: function () {
        wx.navigateTo({
            //url: '/pages/my/carport/carport'
        })
    },
    //收货地址
    goAddressList: function () {
        wx.navigateTo({
           // url: '/pages/shopping/receiver/receiver',
        })
    },
    //查询订单数量
    OrderCommodityCount: function () {
        var OrderCommodityCount = netapi.OrderCommodityCount;
        var that = this;
        netWork.request({
            url: OrderCommodityCount,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                var _data = res.data.data;
                if (_data) {
                    that.setData({
                        now: _data.pendingPayment,
                        pending: _data.processing,
                        evaluate: _data.comment,
                        accomplish: _data.completed,
                        all: _data.all
                    })
                }

            }
        })
    },
    //进行中
    goPending: function () {
        wx.navigateTo({
           // url: '/pages/my/orderList/orderList?index=1'
        })
    },
    //待付款
    goMoney: function () {
        wx.navigateTo({
           // url: '/pages/my/orderList/orderList?index=2'
        })
    },
    //待评价
    goComment: function () {
        wx.navigateTo({
           // url: '/pages/my/orderList/orderList?index=3'
        })
    },
    //已完成
    goSuccess: function () {
        wx.navigateTo({
           // url: '/pages/my/orderList/orderList?index=4'
        })
    },
    //个人信息查询
    getinformation: function () {
        var information = netapi.informationList;
        var that = this;
        wx.request({
            url: information,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                if (res.data.status == true) {
                    var _data = res.data.data[0];
                    that.setData({
                        nikeName: _data.nickname,
                        tell: _data.mobile == null ? '' : _data.mobile,
                        photo: _data.photo
                    })
                }

            }
        })
    },
    bindGetUserInfo(e) {
        var that = this;
        wx.showModal({
            content: '奥友车生活需要获取您的信息',
            success(res) {
                if (res.confirm) {
                    wx.login({
                        timeout: 1500, //超时时间
                        fail(res) {
                            wx.showToast({
                                title: '微信登录调用失败',
                                icon: 'none',
                                duration: 2000
                            })
                        },
                        success(res1) {
                            var wcode = res1.code;
                            var bindWeChat = netapi.bindWeChat;
                            var confirmUpdateBind = netapi.confirmUpdateBind;
                            wx.request({
                                url: bindWeChat,
                                method: "POST",
                                header: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "Ltoken": wx.getStorageSync('token'),
                                    "LclientCode": 3
                                },
                                data: {
                                    js_code: wcode // 需要传到后台的值
                                },
                                success: function (res) {
                                    var seesion_key = res.data.data;
                                    if (res.data.code == 1) {
                                        that.setData({
                                            bangdingwx: "绑定成功"
                                        })
                                        wx.setStorageSync('SYSTEM', {
                                            CUSTOM_WX_UNIONID: res.data.data.wx_unionid
                                        })
                                    }
                                    if (res.data.code == 11050118) {
                                        wx.showModal({
                                            content: res.data.desc,
                                            success(res) {
                                                if (res.confirm) {
                                                    wx.request({
                                                        url: confirmUpdateBind,
                                                        method: "GET",
                                                        header: {
                                                            "Content-Type": "application/x-www-form-urlencoded",
                                                            "Ltoken": wx.getStorageSync('token'),
                                                            "LclientCode": 3
                                                        },
                                                        success: function (res) {
                                                            if (res.data.status == true) {
                                                                that.setData({
                                                                    bangdingwx: "绑定成功"
                                                                })
                                                                wx.setStorageSync('SYSTEM', {
                                                                    CUSTOM_WX_UNIONID: res.data.data.wx_unionid
                                                                })
                                                            }
                                                        }
                                                    })
                                                } else if (res.cancel) {
                                                    console.log('用户点击取消')
                                                }
                                            }
                                        })
                                    }
                                    if (res.data.code == 11050002) {
                                        wx.getUserInfo({
                                            withCredentials: true,
                                            success: function (res) {
                                                var encryptData = res.encryptedData;
                                                var iv = res.iv;
                                                var bindDecodeInfo = netapi.bindDecodeInfo;//授权openid
                                                wx.request({
                                                    url: bindDecodeInfo,
                                                    method: "POST",
                                                    header: {
                                                        "Content-Type": "application/x-www-form-urlencoded",
                                                        "Ltoken": wx.getStorageSync('token'),
                                                        "LclientCode": 3
                                                    },
                                                    data: {
                                                        encryptDataB64: encryptData, // 需要传到后台的值
                                                        sessionKeyB64: seesion_key,
                                                        ivB64: iv
                                                    },
                                                    success: function (res) {
                                                        if (res.data.code == 11050085) {
                                                            that.setData({
                                                                showModal: true
                                                            })
                                                        } else {
                                                            wx.reLaunch({ url: "/pages/index/index/index", })
                                                        }

                                                    }
                                                })
                                            },
                                            fail: function (res) {
                                                wx.showToast({
                                                    title: '获取微信授权失败',
                                                    icon: 'none',
                                                    duration: 2000
                                                })
                                            }
                                        })
                                    }
                                }
                            })

                            if (!res1.code) {
                                wx.showToast({
                                    title: '获取微信凭证失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                                return;
                            }
                        }
                    })
                    //用户点击允许授权
                    // if (e.detail.userInfo) {
                    //     console.log(e)
                    //     var iv = e.detail.iv;
                    //     var encryptedData = e.detail.encryptedData;
                    //     var bindDecodeInfo = netapi.bindDecodeInfo;
                    //     wx.request({
                    //         url: bindDecodeInfo,
                    //         data: {

                    //         }
                    //     })
                    // }
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    //客服电话
    indexTell: function () {
        var indexTypeUrl = netapi.tellUrl;
        netWork.request({
            url: indexTypeUrl,
            success: (res) => {
                var _data = res.data.data;
                _data.forEach((item, index) => {
                    this.setData({
                        KFtell: item.service_tel
                    })
                })
            }
        })
    },
    //拨打客服电话
    customerService: function () {
        this.setData({
            showModal: true
        })
    },
    hideModal: function () {
        this.setData({
            showModal: false
        });
    },
    //对话框确认按钮点击事件
    onConfirm: function () {
        var that = this;
        wx.makePhoneCall({
            phoneNumber: that.data.KFtell
        })
        that.hideModal();
    },
    //查询车辆数量
    carCount: function () {
        var carCount = netapi.carCount;
        var that = this;
        wx.request({
            url: carCount,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                if (res.data.status == true) {
                    var total = res.data.data.custom_car_count;
                    that.setData({
                        carTotl: total
                    })
                }

            }
        })
    },
    //关注列表数量
    getCustomCollection() {
        var queryCustomCollection = netapi.queryCustomCollection;
        var that = this;
        wx.request({
            url: queryCustomCollection,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: {
                customId: wx.getStorageSync('SYSTEM_USER').USER_ID
            },
            success: function (res) {
                var _data = res.data.total;
                that.setData({
                    attentionCount: _data
                })
            }
        })
    },
    //实名认证
    goNameAuth() {
        wx.navigateTo({
           // url: '/pages/my/nameAuthentication/nameAuthentication',
        })
    },
    //查询实名认证信息
    getNameOption() {
        var that = this;
        var getCustomLicenseById = netapi.getCustomLicenseById;
        wx.request({
            url: getCustomLicenseById,
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                if (res.data.status == true) {
                    var data = res.data.data;
                    if (data.length > 0) {
                        that.setData({
                            nameAuthention: true
                        })
                    } else {
                        that.setData({
                            nameAuthention: false
                        })
                    }
                }
            }
        })
    },
    //查询我得爱车
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
                        custom_car_id: _data[0].custom_car_id
                    })
                }
            }
        })
    },
    //我的爱车
    goMyLikeCar(e) {
        var id = e.currentTarget.dataset.id;
        var customId = wx.getStorageSync('SYSTEM_USER').USER_ID;
        wx.navigateTo({
           // url: '/pages/my/loveCar/loveCar?id=' + id + "&customid=" + customId
        })
    },
    //线下开单
    goofflineOrders() {
        wx.navigateTo({
            //url: '/pages/my/offlineOrders/offlineOrders'
        })
    },
    //扫码开单
    gocodeSheet() {
        var that = this;
        wx.scanCode({
            success: (res) => {
                wx.hideLoading();
                var orderCode = res.result;
                wx.navigateTo({
                 //   url: '/pages/my/codeSheet/codeSheet?orderCode=' + orderCode
                })
            },
            fail: function (res) {
                wx.hideLoading();
                wx.showToast({
                    title: "二维码识别失败",
                    icon: 'none',
                    duration: 2000
                });
            }
        })

    },
    //工单列表
    goServeList() {
        wx.navigateTo({
          //  url: '/pages/my/workList/workList'
        })
    },
    //退出登录
    editLogin() {
        wx.showModal({
            content: '是否退出登录',
            success(res) {
                if (res.confirm) {
                    wx.clearStorage();
                    wx.reLaunch({
                        url: '/pages/my/login/login'
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
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
        this.getinformation();//个人信息查询
        this.OrderCommodityCount(); //查询订单数量
        this.indexTell();//客服电话
        this.carCount();
        this.getCustomCollection();//查询关注商品收藏
        this.getNameOption();//查询实名认证
        this.getCustomCarwhetherIs();//查询我得爱车
        if (wx.getStorageSync('SYSTEM_USER').UNIONID == null) {
            this.setData({
                buttonShow: true
            })
        } else {
            this.setData({
                buttonShow: false
            })
        }
        if (wx.getStorageSync('SYSTEM_GROUPUSER') != "") {
            this.setData({
                xsKdshow: true
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
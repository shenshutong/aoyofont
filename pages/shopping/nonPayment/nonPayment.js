const app = getApp();
var netapi = require("../../../utils/api.js");
var netWork = require('../../../utils/netWork.js');
const base64 = require('../../../utils/base64.js')
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
        content: {},
        KFtell: '',
        showModal: false,
        showModal1: false,
        showModal2: false,
        showModal3: false,
        orderStatus: 1,
        cancelStatus: 1,//取消订单后的状态
        countdown: {
            minute: '',
            second: ''
        },
        captchaImage: "",
        cancelContent: "",//取消订单内容
        currentNoteLen: 0,//输入的字数
        cancelContent1: "",//申请退货原因
        currentNoteLen1: 0,//输入的字数
        noteMaxLen: 100, //字数限制
        reasonForProcessingOrder: "",
        codeQshow: true
    },
    //查询订单详情
    getOrderDetail(code) {
        var that = this;
        //var queryOrderCommodityByTimeAPP = netapi.queryOrderCommodityByTimeAPP;
        netWork.request({
            url: 'http://localhost:8081/user/showOrderDetail',
            data: {
                id: code
            },
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                var data = res.data;
                console.log(data);
                that.setData({
                    content: data
                })
                var timestamp = Date.parse(that.data.content.orderInputTime);
                var timeNum = 0.5;
                timestamp = timestamp + (timeNum * 60) * 60 * 1000;
                var dayText = that.formatTime(timestamp, 'Y/M/D h:m:s');
                that.startCountdown(that.data.content.orderInputTime, dayText);
            }
        })
    },
    //查询单件商品
    getOnlyShoppDetail(id) {
        var that = this;
        var queryOrderCommodityById = netapi.queryOrderCommodityById;
        netWork.request({
            url: queryOrderCommodityById,
            data: {
                orderDetailId: id
            },
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                var data = res.data.data;
                if (data.price) {
                    data.price = data.price.toFixed(2);
                }
                that.setData({
                    content: data
                })
            }

        })
    },
    //查询套餐详情
    getTcDetail(code) {
        var that = this;
        var queryOrderCommodityByTimeAPP = netapi.queryOrderCommodityByTimeAPP;
        netWork.request({
            url: queryOrderCommodityByTimeAPP,
            data: {
                timeCode: code
            },
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                var data = res.data.data;
                if (data.suitName != null) {
                    that.setData({
                        cancelStatus: 3,
                        orderStatus: 3
                    })
                }
                that.setData({
                    content: data
                })
            }
        })
    },
    startCountdown: function (serverTime, endTime) {
        var that = this;
        var millisecond = Date.parse(endTime) - Date.parse(new Date());
        var interval = setInterval(function () {
            millisecond -= 1000;
            if (millisecond <= 0) {
                clearInterval(interval);
                that.setData({
                    countdown: {
                        day: '00',
                        hour: '00',
                        minute: '00',
                        second: '00'
                    }
                });
                return;
            }
            that.transformRemainTime(millisecond);
        }, 1000);
    },
    // 剩余时间(毫秒)处理转换时间
    transformRemainTime: function (millisecond) {
        var that = this;
        var countdownObj = that.data.countdown;
        countdownObj.minute = that.formatTime1(parseInt(millisecond / 1000 / 60 % 60));//分钟
        countdownObj.second = that.formatTime1(parseInt(millisecond / 1000 % 60));//当前的秒
        that.setData({
            countdown: countdownObj
        });
    },
    //日期格式转换
    formatTime(number, format) {
        var n = number;
        var date = new Date(n);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second;
    },
    //门店导航
    call_map: function (e) {
        var groupLatitude = e.currentTarget.dataset.lat;
        var longitude = e.currentTarget.dataset.log;
        var name = e.currentTarget.dataset.name;
        var address = e.currentTarget.dataset.address;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                wx.openLocation({
                    latitude: Number(groupLatitude),
                    longitude: Number(longitude),
                    name: name,
                    address: address,
                    scale: 18,
                    success: function (res) {

                    },
                    fail: function (err) {
                        wx.showToast({
                            title: '调用地图失败，请返回重试',
                        })
                    },
                })
            },
            fail: function (err) {

            }
        })
    },
    //格式化时间为2位
    formatTime1: function (time) {
        if (time < 10)
            return '0' + time;
        return time;
    },
    //拨打客服电话
    callPhone: function () {
        this.setData({
            showModal: true
        })
    },
    preventTouchMove: function () {
    },
    hideModal: function () {
        this.setData({
            showModal: false
        });
    },
    //返回上一页
    backS: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    onCancel: function () {
        this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
        var that = this;
        wx.makePhoneCall({
            phoneNumber: that.data.KFtell
        })
        that.hideModal();
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
    //微信支付
    wchatPaymentB(e) {
        var that = this;
        var price = that.data.content.price;
        var code = that.data.content.timeCode;
        var time = that.data.content.orderInputTime;
        var paymentOrderAPP = netapi.paymentOrderAPP;
        var data = {
            money: price,
            time: time,
            timeCode: code
        };
        netWork.request({
            url: paymentOrderAPP,
            data: data,
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                var _data = res.data.data.wx;
                var order = res.data.data.order;
                //微信支付
                wx.requestPayment({
                    'timeStamp': _data.timeStamp,
                    'nonceStr': _data.nonceStr,
                    'package': _data.package,
                    'signType': _data.signType,
                    'paySign': _data.paySign,
                    'success': function (res) {
                        wx.navigateTo({
                            url: '/pages/shopping/payment/payment?obj=' + JSON.stringify(order)
                        })
                    },
                    'fail': function (res1) {

                    },
                    'complete': function (res2) {
                        console.log(res2)
                    }
                })
            }
        })
    },
    //取消订单
    cancelOeder() {
        this.setData({
            showModal1: true
        })
    },
    preventTouchMove1: function () {
    },
    hideModal1: function () {
        this.setData({
            showModal1: false
        });
    },
    onCancel1: function () {
        this.hideModal1();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm1: function () {
        var that = this;
        var cancelOrderByTimeCode = netapi.cancelOrderByTimeCode;
        if (that.data.currentNoteLen >= 5) {
            netWork.request({
                url: cancelOrderByTimeCode,
                data: {
                    reason: that.data.cancelContent,
                    timeCode: that.data.content.timeCode
                },
                header: {
                    "content-type": "application/json",
                    "Ltoken": wx.getStorageSync('token'),
                    "LclientCode": 3
                },
                success: function (res) {
                    if (res.data.status == true) {
                        that.setData({
                            orderStatus: 2,
                            cancelStatus: 2
                        })
                        wx.showToast({
                            title: "订单取消成功",
                            icon: 'none',
                            duration: 1500
                        })
                        that.hideModal1();
                    } else {
                        wx.showToast({
                            title: "订单取消失败",
                            icon: 'none',
                            duration: 1500
                        })
                        that.hideModal1();
                    }
                }
            })
        } else {
            wx.showToast({
                title: "请至少输入5个字",
                icon: 'none',
                duration: 1500
            })
        }
    },
    //申请退货
    tuiOrder() {
        this.setData({
            showModal2: true
        })
    },
    //二维码
    getQRCode(e) {
        var that = this;
        var code = e.currentTarget.dataset.code;
        var getQrCode = netapi.getQrCode;
        wx.request({
            url: getQrCode,
            data: {
                order_code: code
            },
            success: function (res) {
                var code = res.data.data.orderQrCode.replace(/[\r\n]/g, "");
                that.setData({
                    captchaImage: 'data:image/jpeg;base64,' + code
                })
            }
        })

        this.setData({
            showModal3: true
        })
    },
    preventTouchMove2: function () {
    },
    preventTouchMove3: function () {
    },
    hideModal2: function () {
        this.setData({
            showModal2: false
        });
    },
    hideModal3: function () {
        this.setData({
            showModal3: false
        });
    },
    onCancel2: function () {
        this.hideModal2();
    },
    //更换选择预约服务
    goServe(e) {
        var code = e.currentTarget.dataset.code;
        wx.navigateTo({
            url: '/pages/shopping/appointment/appointment?code=' + code + '&updeFlg=1',
        })
    },
    //进入商品详情
    goShoppDetail(e) {
        var id = e.currentTarget.dataset.shopid;
        wx.navigateTo({
            url: '/pages/index/shoppDetail/index?commodityId=' + id,
        })
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm2: function () {
        var that = this;
        var orderReturnX = netapi.orderReturnX;
        if (that.data.currentNoteLen1 >= 5) {
            netWork.request({
                url: orderReturnX,
                data: {
                    returnDetail: that.data.cancelContent1,
                    orderId: this.data.content.order[0].orderId,
                    orderDetailId: this.data.content.order[0].commoditys[0].order_detail_id
                },
                header: {
                    "content-type": "application/json",
                    "Ltoken": wx.getStorageSync('token'),
                    "LclientCode": 3
                },
                success: function (res) {
                    if (res.data.status == true) {
                        wx.showToast({
                            title: "退货成功",
                            icon: 'none',
                            duration: 1500
                        })
                        if (res.data.data == 11050125) {
                            wx.showToast({
                                title: res.data.desc,
                                icon: 'none',
                                duration: 2000
                            })
                        } else {
                            that.setData({
                                orderStatus: 2,
                                cancelStatus: 4
                            })
                            wx.showToast({
                                title: res.data.data,
                                icon: 'none',
                                duration: 1500
                            })
                            that.hideModal2();
                        }

                    }
                }
            })
        } else {
            wx.showToast({
                title: "请至少输入5个字",
                icon: 'none',
                duration: 1500
            })
        }
    },
    //获取取消订单内容
    textareaValue(e) {
        var value = e.detail.value;
        var len = parseInt(value.length);
        this.setData({
            cancelContent: value,
            currentNoteLen: len
        })
    },
    //获取申请退货原因
    textareaValue1(e) {
        var value = e.detail.value;
        var len = parseInt(value.length);
        this.setData({
            cancelContent1: value,
            currentNoteLen1: len
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.Timecode) {
            this.getTcDetail(options.Timecode)
        }
        if (options.orderDetelt == -1) {
            this.setData({
                cancelStatus: 3,
                orderStatus: 3
            })
        }

        if (options.obj) {
            this.setData({
                content: JSON.parse(options.obj)
            })
        }
        //订单详情
        if (options.code) {
            this.getOrderDetail(options.code);//查询订单详情
        }
        if (this.data.content.orderInputTime) {
            var timestamp = Date.parse(this.data.content.orderInputTime);
            var timeNum = 0.5;
            timestamp = timestamp + (timeNum * 60) * 60 * 1000;
            var dayText = this.formatTime(timestamp, 'Y/M/D h:m:s')
            this.startCountdown(this.data.content.orderInputTime, dayText);
        }

        if (options.order_detail_id) {
            this.getOnlyShoppDetail(options.order_detail_id);//查询单件商品
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
        this.indexTell();//客服电话
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
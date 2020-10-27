const app = getApp();
var netapi = require("../../../utils/api.js");
let times = 60;
let timer = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuBotton: app.globalData.menuBotton,
        menuHeight: app.globalData.menuHeight,
        verCodeTxt: "获取验证码",
        phone_ver_code: "",//验证码
        phone_ver_code1: "",//验证码
        phoneNumber: "",//手机号
        showModal: false,
        flg: true,
        disable: false,
        imgCodeShow: false,
        imgCode: ""
    },
    //返回首页  
    backHome() {
        wx.switchTab({
            url: '/pages/index/index/index',
        })
    },
    // 获取验证码
    phone_ver_code(e) {
        var that = this;
        var value = e.detail.value;
        that.setData({
            phone_ver_code: value
        })
    },
    // 获取图片验证码
    phone_ver_code1(e) {
        var that = this;
        var value = e.detail.value;
        that.setData({
            phone_ver_code1: value
        })
    },
    // 手机号
    phone_code(e) {
        var that = this;
        that.setData({
            phoneNumber: parseInt(e.detail.value)
        })
    },
    //计时器
    countdown() {
        var that = this;
        timer = setInterval(function () {
            if (times >= 1) {
                that.setData({
                    verCodeTxt: times + '秒',
                    disable: true,
                })
                times--;
            } else {
                that.setData({
                    verCodeTxt: '重新获取',
                    disable: false,
                })
                times = 60;
                clearInterval(timer);
            }
        }, 1000)
    },
    //获取验证码
    ver_code() {
        var that = this;
        var phone_num = that.data.phoneNumber;//手机号
        var sendSMSCode = netapi.sendSMSCode;//验证码url
        var sendIMGyzm = netapi.sendIMGyzm;//发送图片验证码
        if (phone_num.toString().length != 0 && phone_num.toString().length == 11) {
            if (this.data.disable == false) {
                that.setData({
                    disable: true,
                })
                wx.request({
                    url: sendSMSCode,
                    data: {
                        mobile: phone_num,
                        vcode: that.data.phone_ver_code1
                    },
                    success: function (res) {
                        if (res.data.code == 11070005) {
                            wx.showToast({
                                title: res.data.desc,
                                icon: 'none',
                                duration: 1000
                            })
                            that.setData({
                                imgCodeShow: true,
                            })
                            that.getImgCode(phone_num)
                        }
                        that.countdown();
                    }
                })
            }
        } else {
            wx.showToast({
                title: '手机号有误,请重新输入',
                icon: 'none',
                duration: 2000
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        times = 60;
        clearInterval(timer);
        this.setData({
            verCodeTxt: '获取验证码'
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

    },
    //微信登录
    login_wx() {
        var that = this;
        that.setData({
            flg: false
        })
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
                var wxLoginDL = netapi.wxLogin;
                wx.request({
                    url: wxLoginDL,
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    data: {
                        js_code: wcode // 需要传到后台的值
                    },
                    success: function (res) {
                        var token = res.data.data.token;
                        var session_key = res.data.data.session_key;
                        var code = res.data.code;
                        wx.setStorageSync('session_key', session_key);
                        if (code == 1) {
                            wx.setStorageSync('token', token);
                        }
                        if (code != 11050002) {
                            wx.setStorageSync('SYSTEM_USER', {
                                CUSTOM_ALIAS: res.data.data.custom.nickname, //用户昵称
                                CUSTOM_IMAGE: res.data.data.custom.photo, //用户头像
                                USER_ID: res.data.data.custom.custom_id, //用户id
                                UNIONID: res.data.data.custom.wx_unionid
                            })
                            wx.setStorageSync('SYSTEM_GROUPUSER', res.data.data.user)
                            if (res.data.data.user) {
                                wx.setStorageSync('SYSTEM', {
                                    CUSTOM_WX_UNIONID: res.data.data.user.USER_WX_UNIONID,
                                })
                            }
                            wx.reLaunch({ url: "/pages/index/index/index", })
                        }
                        if (code == 11050002) {
                            wx.setStorageSync('token', token);
                            wx.getUserInfo({
                                withCredentials: true,
                                success: function (res) {
                                    var encryptData = res.encryptedData;
                                    var iv = res.iv;
                                    var DecodeInfo = netapi.DecodeInfo;//授权openid
                                    wx.request({
                                        url: DecodeInfo,
                                        method: "POST",
                                        header: {
                                            "Content-Type": "application/x-www-form-urlencoded",
                                            "Ltoken": token,
                                            "LclientCode": 3
                                        },
                                        data: {
                                            encryptDataB64: encryptData, // 需要传到后台的值
                                            sessionKeyB64: session_key,
                                            ivB64: iv
                                        },
                                        success: function (res) {
                                            if (res.data.code == 11050085) {
                                                wx.navigateTo({
                                                    url: '/pages/my/bindingPhone/bindingPhone',
                                                })
                                            } else {
                                                wx.setStorageSync('SYSTEM_USER', {
                                                    CUSTOM_ALIAS: res.data.data.custom.nickname, //用户昵称
                                                    CUSTOM_IMAGE: res.data.data.custom.photo, //用户头像
                                                    USER_ID: res.data.data.custom.custom_id, //用户id
                                                    UNIONID: res.data.data.custom.wx_unionid
                                                })
                                                wx.setStorageSync('SYSTEM_GROUPUSER', res.data.data.user)
                                                if (res.data.data.user) {
                                                    wx.setStorageSync('SYSTEM', {
                                                        CUSTOM_WX_UNIONID: res.data.data.user.USER_WX_UNIONID,
                                                    })
                                                }
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
    },
    //手机号登录前验证
    login: function () {
        var _this = this;
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (_this.data.phoneNumber.toString() == '') {
            wx.showToast({
                title: '手机号码不能为空',
                icon: 'none',
                duration: 2000
            })
        } else if (_this.data.phoneNumber.toString().length != 11) {
            wx.showToast({
                title: '手机号码格式不正确',
                icon: 'none',
                duration: 2000
            })
        }
        else if (!myreg.test(_this.data.phoneNumber.toString())) {
            wx.showToast({
                title: '手机号码格式不正确',
                icon: 'none',
                duration: 2000
            })
        }

        else if (_this.data.verCodeTxt == '获取验证码') {
            wx.showToast({
                title: '请先获取验证码',
                icon: 'none',
                duration: 2000
            })
        } else {
            if (_this.data.phone_ver_code.toString() == '') {
                wx.showToast({
                    title: '验证码不能为空',
                    icon: 'none',
                    duration: 2000
                })
            } else if (_this.data.phone_ver_code.toString().length < 6) {
                wx.showToast({
                    title: '验证码格式不正确',
                    icon: 'none',
                    duration: 2000
                })
            } else {
                _this.login_Mobile();
            }
        }
    },
    //手机号登录
    login_Mobile() {
        var that = this;
        var flgStatus = that.data.flg;
        if (flgStatus == false) {
            var wxLoginRegisterCustom = netapi.wxLoginRegisterCustom;
            wx.request({
                url: wxLoginRegisterCustom,
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Ltoken": wx.getStorageSync('token'),
                    "LclientCode": 3
                },
                data: {
                    mobile: that.data.phoneNumber,//手机号
                    code: that.data.phone_ver_code,//验证码
                    vcode: that.data.phone_ver_code1//图片验证码
                },
                success: function (res) {
                    if (res.data.status == true) {
                        wx.setStorageSync('token', res.data.data.token);
                        wx.setStorageSync('SYSTEM_USER', {
                            CUSTOM_ALIAS: res.data.data.custom.nickname, //用户昵称
                            CUSTOM_IMAGE: res.data.data.custom.photo, //用户头像
                            CUSTOM_MOBILE: res.data.data.custom.mobile, //手机号
                            USER_ID: res.data.data.custom.custom_id, //用户id
                            UNIONID: res.data.data.custom.wx_unionid
                        })
                        wx.setStorageSync('SYSTEM_GROUPUSER', res.data.data.user);
                        if (res.data.data.user) {
                            wx.setStorageSync('SYSTEM', {
                                CUSTOM_WX_UNIONID: res.data.data.user.USER_WX_UNIONID,
                            })
                        }
                        wx.reLaunch({ url: "/pages/index/index/index", })
                    } else {
                        wx.showToast({
                            icon: 'none',
                            title: res.data.desc
                        })
                    }
                }
            })
        } else {
            var loginByMobile = netapi.loginByMobile;
            wx.request({
                url: loginByMobile,
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: {
                    mobile: that.data.phoneNumber,//手机号
                    code: that.data.phone_ver_code,//验证码
                    vcode: that.data.phone_ver_code1
                },
                success: function (res) {
                    if (res.data.status == true) {
                        wx.reLaunch({ url: "/pages/index/index/index", })
                        wx.setStorageSync('token', res.data.data.token);
                        wx.setStorageSync('SYSTEM_USER', {
                            CUSTOM_ALIAS: res.data.data.custom.nickname, //用户昵称
                            CUSTOM_IMAGE: res.data.data.custom.photo, //用户头像
                            CUSTOM_MOBILE: res.data.data.custom.mobile, //手机号
                            USER_ID: res.data.data.custom.custom_id, //用户id
                            UNIONID: res.data.data.custom.wx_unionid
                        })
                        wx.setStorageSync('SYSTEM_GROUPUSER', res.data.data.user);
                        if (res.data.data.user) {
                            wx.setStorageSync('SYSTEM', {
                                CUSTOM_WX_UNIONID: res.data.data.user.USER_WX_UNIONID,
                            })
                        }
                    } else {
                        wx.showToast({
                            title: res.data.desc,
                            icon: "none",
                            duration: 1500
                        })
                    }
                }
            })
        }

    },
    getImgCodeT() {
        this.setData({
            imgCode: ""
        })
        var phone_num = this.data.phoneNumber;
        this.getImgCode(phone_num)
    },
    //获取图片验证码
    getImgCode(phone_num) {
        var that = this;
        var num = Math.random();
        var sendIMGyzm = netapi.sendIMGyzm;//发送图片验证码
        var imgcode = sendIMGyzm + '?mobile=' + phone_num + "&num=" + num;
        that.setData({
            imgCode: imgcode
        })
    }
})
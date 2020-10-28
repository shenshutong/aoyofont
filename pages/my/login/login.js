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
        phoneNumber: "",//手机号
        password:"",//密码
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
   
    
   
   
   
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // times = 60;
        // clearInterval(timer);
        // this.setData({
        //     verCodeTxt: '获取验证码'
        // })
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

    //获取手机号
    phoneInput:function(e){
        this.setData({
           phoneNumber:e.detail.value
        })
    },

    //获取输入密码
    passwordInput:function(e){
        this.setData({
            password:e.detail.value
        })
    },


   
    //手机号登录前验证
    login: function () {
        var _this = this;
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (this.data.phoneNumber.toString() == '' && this.data.password.length=='') {
            wx.showToast({
                title: '手机号或密码不能为空',
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
        }else{
            wx.request({
              url: 'http://localhost:8081/user/userlogin',
              method:'post',
              data:{
                  phone:_this.data.phoneNumber,
                  password:_this.data.password
              },
              header:{
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success(res){
                if(res.data!=null){
                    console.log("登录成功")
                    wx.switchTab({
                      url: '/pages/index/index/index',
                    })
                }
              }
            })

        }
    }
   
  
})
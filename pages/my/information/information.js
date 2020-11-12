// pages/my/information/information.js
const app = getApp();
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
    imagePrefix: netapi.imagePrefix,//图片路径
    aoyoAlblumCover: "",//头像
    aoyoNikeName: "",//昵称
    aoyoPhone: '',//手机号
    aoyoName: "",//真实姓名
    aoyoSex: 0,//性别
    aoyoBirthday: "",//生日
    aoyoUserId:'',
    date: "",//年月日
    show: false,
    aoyoSex: [{
        name: '男',
        value: '1',
        checked: true
    }, {
        name: '女',
        value: '2',
        checked: false
    }]
  },
   //返回上一页
   backMyOne: function () {
    wx.navigateBack({
        delta: 1
    })
  },
     //修改头像
    changeAvatar: function (e) {
        const _this = this;
        //var uploadImg = netapi.uploadImg;
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
              var tempFilePaths = res.tempFiles;
               //启动上传等待中...
                wx.showToast({
                    title: '正在上传...',
                    icon: 'loading',
                    mask: true,
                    duration: 10000
                })
              wx.uploadFile({
                  //url: uploadImg,
                  url:'http://localhost:8081/user/uploadPhoto',
                  filePath: tempFilePaths[0].path,
                  name: 'file',
                  header: {
                      "Content-Type": "multipart/form-data",
                      'accept': 'application/json',
                  },
                  success(res) {
                      //let data = JSON.parse(res.data);
                      var _data = res.data;
                      _this.setData({
                        aoyoAlblumCover:_data.aoyoAlblumCover
                      })
                  }
              })
          }
      })
    },
    //修改姓名
    goRealName: function () {     
        wx.navigateTo({
            url: '/pages/my/realName/realName'
        })
    },
    //修改手机号
    goEditTell: function () {
        wx.navigateTo({
            url: '/pages/my/editIphone/editIphone?tell=' + this.data.tell
        })
    },
   //性别
   radioChange: function (e) {
    var value = e.detail.value;
    this.setData({
        aoyoSex: value
    })
    },
    getDateTime: function (e) {
        var value = e.detail.value;
        this.setData({
            aoyoBirthday: value
        })
    },
    //选择生日
    optionBirthday: function () {

    },
   //个人信息查询
   getinformation: function () {
    //var information = netapi.informationList;
    var that = this;
    netWork.request({
        //url: information,
        url:'http://localhost:8081/user/showUserInfo',
        method: "POST",
        header: {
            "content-type": "application/json",
            "Ltoken": wx.getStorageSync('token'),
            "LclientCode": 3
        },
        success: function (res) {
            console.log(res.data+'111')
            var _data = res.data;
            console.log(res.data);
            var arr;
            if (_data.aoyoBirthday) {
                arr = _data.aoyoBirthday.split(/[ ]+/);
            }
            if (arr) {
                _data.aoyoBirthday = arr[0];
            }
            if (_data.aoyoSex == 1) {
                that.setData({
                    aoyoSex: [{
                        name: '男',
                        value: '0',
                        checked: true
                    },
                    {
                        name: '女',
                        value: '1',
                        checked: false
                    },
                    ]
                })
            } else {
                that.setData({
                    aoyoSex: [{
                        name: '男',
                        value: '0',
                        checked: false
                    },
                    {
                        name: '女',
                        value: '1',
                        checked: true
                    },
                    ]
                })
            }
            console.log( _data.aoyoAlblumCover)
            that.setData({
                aoyoNikeName: _data.aoyoNikeName,
                aoyoPhone: _data.aoyoPhone,
                aoyoName: _data.aoyoName,
                aoyoBirthday: _data.aoyoBirthday,
                aoyoAlblumCover: _data.aoyoAlblumCover
            })
        }
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getinformation();//个人信息查询

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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    var value = currPage.data.predata;
    var zname = currPage.data.name;
    if (value) {
        this.setData({
            aoyoNikeName: value
        })
    }
    if (zname) {
        this.setData({
            name: zname
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
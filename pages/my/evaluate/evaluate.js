// pages/my/evaluate/evaluate.js
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
        imagePrefix: netapi.imagePrefix,//图片路径
        one_2: 0,
        two_2: 5,
        photo: [],
        array: ['拍照/录像', '从相册中选择'],//选择上传文件方式
        videoShow: false,
        imgShow: false,
        shoppDetail: [],
        commoditId: 0,//商品id
        groupId: 0, //商户id
        contentShop: "",
        code: 0,
        detailID: 0,
        cameraShow: false,
        cameraHeight: '',
        cameraWidth: ''
    },
    //返回上一页
    backorderList: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //选择评分
    in_xin: function (e) {
        var in_xin = e.currentTarget.dataset.in;
        var one_2;
        if (in_xin === 'use_sc2') {
            one_2 = Number(e.currentTarget.id);
        } else {
            one_2 = Number(e.currentTarget.id) + this.data.one_2;
        }
        this.setData({
            one_2: one_2,
            two_2: 5 - one_2
        })
    },
    //上传图片或者视频
    addPhotoV(e) {
        var that = this;
        var upLoadFileEv = netapi.upLoadFileEv;
        wx.chooseMedia({
            count: 1,
            mediaType: ['image', 'video'],
            sourceType: ['album'],
            maxDuration: 15,
            camera: 'back',
            success(res) {
                var item = res.tempFiles;
                wx.showLoading({
                    title: '上传中',
                })
                wx.uploadFile({
                    url: upLoadFileEv,
                    filePath: item[0].tempFilePath,
                    name: 'file',
                    header: {
                        "Content-Type": "multipart/form-data",
                        'accept': 'application/json',
                        "Ltoken": wx.getStorageSync('token'),
                        "LclientCode": 3
                    },
                    success(res) {
                        wx.hideLoading();
                        let data = JSON.parse(res.data);
                        //判断是否上传成功
                        if (data.status == false) {
                            wx.showToast({
                                title: '上传失败，请重新上传',
                                icon: 'none',
                                duration: 1500
                            })
                        } else {
                            wx.showToast({
                                title: '上传成功',
                                icon: 'none',
                                duration: 1500
                            })
                        }
                        var photo = that.data.photo;
                        photo.push(data.data);
                        that.setData({
                            photo: photo
                        })
                    }
                })
                if (res.type == 'image') {
                    that.setData({
                        imgShow: true
                    })
                } else {
                    that.setData({
                        videoShow: true
                    })
                }
            }
        })
    },
    addPhotoV1() {
        this.setData({
            cameraShow: true
        })
    },
    //删除某张图片
    deleteImg(e) {
        var index = e.target.dataset.index;
        var arr = this.data.photo;
        arr.splice(index, 1);
        this.setData({
            photo: arr
        })
    },
    //查询单件商品详情
    getOnlyShoppDetail(id) {
        var that = this;
        var shoppDetailUrl = netapi.shoppDetailUrl;
        netWork.request({
            url: shoppDetailUrl,
            data: {
                "param": {
                    "commodity_id": id,
                    "custom_id": wx.getStorageSync('SYSTEM_USER').USER_ID
                }
            },
            success: (res) => {
                var data = res.data.data;
                that.setData({
                    shoppDetail: data
                })

            }
        })
    },
    //提交评论
    submitComment() {
        var shoppPush = netapi.shoppPush;
        var that = this;
        var param = {
            context: that.data.contentShop,
            files: that.data.photo
        }
        var context = JSON.stringify(param);
        if (that.data.contentShop.length < 5) {
            wx.showToast({
                title: '请至少填写5个字',
                icon: 'none',
                duration: 1500
            })
        } else {
            netWork.request({
                url: shoppPush,
                data: {
                    commoditId: that.data.shoppID,
                    groupId: that.data.groupId,
                    orderId: that.data.code,
                    score: that.data.one_2,
                    detailId: that.data.detailID,
                    'context': context
                },
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Ltoken": wx.getStorageSync('token'),
                    "LclientCode": 3
                },
                success: function (res) {
                    if (res.data.status == true) {
                        var pages = getCurrentPages(); // 当前页面
                        var beforePage = pages[pages.length - 2]; // 前一个页面
                        wx.navigateBack({
                            success: function () {
                                beforePage.getcommentList(); // 执行前一个页面的getcommentList方法
                            }
                        });
                    }
                }
            })
        }

    },
    //获取评论内容
    getTextareaCon(e) {
        var value = e.detail.value;
        this.setData({
            contentShop: value
        })
    },
    // 拍照
    takePhoto() {
        var that = this;
        var ctx = wx.createCameraContext();
        var upLoadFile = netapi.upLoadFile;
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                wx.uploadFile({
                    url: upLoadFile,
                    filePath: res.tempImagePath,
                    name: 'file',
                    header: {
                        "Content-Type": "multipart/form-data",
                        'accept': 'application/json',
                        "Ltoken": wx.getStorageSync('token'),
                        "LclientCode": 3
                    },
                    success(res) {
                        wx.hideLoading();
                        let data = JSON.parse(res.data);
                        var photo = that.data.photo;
                        photo.push(data.data);
                        if (data.status == false) {
                            wx.showToast({
                                title: '上传失败，请重新上传',
                                icon: 'none',
                                duration: 1500
                            })
                        } else {
                            wx.showToast({
                                title: '上传成功',
                                icon: 'none',
                                duration: 1500
                            })
                            that.setData({
                                photo: photo,
                                imgShow: true,
                                cameraShow: false
                            })
                        }
                    }
                })
            },
            fail() {
                //拍照失败
                console.log("拍照失败");
            }
        })
    },
    //开始录像的方法
    startShootVideo() {
        var ctx = wx.createCameraContext();
        ctx.startRecord({
            success: (res) => {
                wx.showLoading({
                    title: '正在录像',
                })
            }
        })
    },
    //结束录像
    stopShootVideo() {
        var that = this;
        var ctx = wx.createCameraContext();
        var upLoadFile = netapi.upLoadFile;
        ctx.stopRecord({
            success: (res) => {
                wx.hideLoading();
                wx.uploadFile({
                    url: upLoadFile,
                    filePath: res.tempVideoPath,
                    name: 'file',
                    header: {
                        "Content-Type": "multipart/form-data",
                        'accept': 'application/json',
                        "Ltoken": wx.getStorageSync('token'),
                        "LclientCode": 3
                    },
                    success(res) {
                        wx.hideLoading();
                        let data = JSON.parse(res.data);
                        var photo = that.data.photo;
                        photo.push(data.data);
                        if (data.status == false) {
                            wx.showToast({
                                title: '上传失败，请重新上传',
                                icon: 'none',
                                duration: 1500
                            })
                        } else {
                            wx.showToast({
                                title: '上传成功',
                                icon: 'none',
                                duration: 1500
                            })
                            that.setData({
                                photo: photo,
                                videoShow: true,
                                cameraShow: false
                            })
                        }
                    }
                })
            },
            fail() {
                wx.hideLoading();
            }
        })
    },
    //手指触摸开始
    handleTouchStart: function (e) {
        this.startTime = e.timeStamp;
    },
    //手指触摸结束
    handleTouchEnd: function (e) {
        this.endTime = e.timeStamp;
        if (this.endTime - this.startTime > 350) {
            //长按操作 调用结束录像方法
            this.stopShootVideo();
        }

    },
    //点击拍照
    handleClick: function (e) {
        if (this.endTime - this.startTime < 350) {
            this.takePhoto();
        }
    },
    //长按按钮 - 录像
    handleLongPress: function (e) {
        this.startShootVideo();
    },
    setCameraSize() {
        const res = wx.getSystemInfoSync();
        this.setData({
            cameraHeight: res.windowHeight,
            cameraWidth: res.windowWidth
        })
    },
    //选择位置
    bindPickerChange: function (e) {
        var val = e.detail.value;
        if (val == 1) {
            this.addPhotoV();
        } else {
            this.addPhotoV1();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            shoppID: options.id,
            groupId: options.groupID,
            code: options.code,
            detailID: options.detailID
        })
        this.getOnlyShoppDetail(options.id);
        this.setCameraSize();
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
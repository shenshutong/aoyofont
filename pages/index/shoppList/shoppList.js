// pages/shop/shopCommodity/shopCommodity.js
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
        active: false,
        activeT: true,
        cateItems: [
            {
                cate_id: 0,
                cate_name: '全部',
            },
            {
                cate_id: 1,
                cate_name: '推荐',
            },
            {
                cate_id: 2,
                cate_name: ' 附近',
            },
            {
                cate_id: 3,
                cate_name: '价格'
            },
            {
                cate_id: 4,
                cate_name: '门店'
            }
        ],
        curNav: 0,
        curIndex: 0,
        imagePrefix: netapi.imagePrefix,//图片路径
        inputValue: "",//商品名称
        GroupShoppTab: [],
        city: "xxx",
        storeShow: false,
        storeList: [],
        KFtell: '',
        panelId: 0,//分类id
        showModal: false
    },
    //商品筛选条件
    switchRightTab: function (e) {
        let id = e.target.dataset.id, index = e.target.dataset.index;
        var panel_id = this.data.panelId;
        this.setData({
            curNav: id,
            curIndex: index
        })
        if (id == 0) {
            this.setData({
                storeShow: false
            })
            var data = {
                "param": {
                    "commodity_name": this.data.inputValue,
                    "panelId": Number(panel_id)
                },
            }
            this.getShoppList(data);
        }
        if (id == 1) {
            this.setData({
                storeShow: false
            })
            var data;
            var val = this.data.inputValue;
            if (val) {
                data = {
                    "param": {
                        "commodity_name": this.data.inputValue,
                        "recommendCommodity": 1,
                        "panelId": Number(panel_id)
                    },
                }
            } else {
                data = {
                    "param": {
                        "recommendCommodity": 1,
                        "panelId": Number(panel_id)
                    },
                }
            }
            this.getShoppList(data);
        }
        if (id == 2) {
            this.setData({
                storeShow: false
            })
            var data;
            var val = this.data.inputValue;
            if (val) {
                data = {
                    "param": {
                        "lng": wx.getStorageSync('lng'),
                        "lat": wx.getStorageSync('lat'),
                        "nearbyCommodity": 1,
                        "commodity_name": this.data.inputValue,
                        "panelId": Number(panel_id)
                    },
                }
            } else {
                data = {
                    "param": {
                        "lng": wx.getStorageSync('lng'),
                        "lat": wx.getStorageSync('lat'),
                        "nearbyCommodity": 1,
                        "panelId": Number(panel_id)
                    },
                }
            }
            this.getShoppList(data);
        }
        if (id == 3) {
            this.setData({
                active: !this.data.active,
                activeT: !this.data.activeT,
                storeShow: false
            })
            if (this.data.active) {
                var data;
                var val = this.data.inputValue;
                if (val) {
                    data = {
                        "param": {
                            "commodity_name": this.data.inputValue,
                            "commodity_selling_price": -1,
                            "panelId": Number(panel_id)
                        },
                    }
                } else {
                    data = {
                        "param": {
                            "commodity_selling_price": -1,
                            "panelId": Number(panel_id)
                        },
                    }
                }
                this.getShoppList(data);
            } else {
                var data;
                var val = this.data.inputValue;
                if (val) {
                    data = {
                        "param": {
                            "commodity_name": this.data.inputValue,
                            "commodity_selling_price": -2,
                            "panelId": Number(panel_id)
                        },
                    }
                } else {
                    data = {
                        "param": {
                            "commodity_selling_price": -2,
                            "panelId": Number(panel_id)
                        },
                    }
                }
                this.getShoppList(data);
            }
        }
        if (id == 4) {
            this.setData({
                storeShow: true,
            })
            var data;
            var val = this.data.inputValue;
            if (val) {
                data = {
                    "param": {
                        "commodity_name": this.data.inputValue,
                        "groupFilter": 1,
                        "custom_id": wx.getStorageSync('SYSTEM_USER').USER_ID,
                        "panelId": Number(panel_id)
                    },
                }
            } else {
                data = {
                    "param": {
                        "groupFilter": 1,
                        "custom_id": wx.getStorageSync('SYSTEM_USER').USER_ID,
                        "panelId": Number(panel_id)
                    },
                }
            }
            var shoppListUrl = netapi.shoppDetailUrl;
            netWork.request({
                url: shoppListUrl,
                data: data,
                success: (res) => {
                    var _data = res.data.data;
                    _data.forEach((item, index) => {
                        if (item.groupFeatured.length >= 3) {
                            item.groupFeatured.length = 2
                        }
                    })
                    this.setData({
                        storeList: _data
                    })
                }
            })
        }
    },
    // 返回上一页
    backHome: function () {
        var pages = getCurrentPages(); // 当前页面
        var beforePage = pages[pages.length - 2]; // 前一个页面
        wx.navigateBack({
            success: function () {
                beforePage.onLoad(); // 执行前一个页面的onLoad方法
            }
        })
    },
    //获取商品列表
    getShoppList: function (data) {
        var shoppListUrl = netapi.getCommodityListByClassId;
        netWork.request({
            url: shoppListUrl,
            data: data,
            success: (res) => {
                var _data = res.data.data;
                this.setData({
                    GroupShoppTab: _data
                })
            }
        })
    },
    //加入购物车
    addShoppCard: function (e) {
        var id = e.currentTarget.dataset.id;
        var addShoppCardUrl = netapi.addShoppCard + "?commodityId=" + id;
        netWork.request({
            url: addShoppCardUrl,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: (res) => {
                wx.showToast({
                    title: res.data.desc,
                    icon: 'success',
                    duration: 1500
                })
            }
        })

    },
    //商品详情
    goShoppDetail: function (e) {
        var id = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: '/pages/index/shoppDetail/index?commodityId=' + id
        })
    },
    //点击门店进入门店商品列表
    goStoreList(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/shop/shopCommodity/shopCommodity?id=' + id
        })
    },
    //获取搜索框内容
    getSearchVal(e) {
        var val = e.detail.value;
        this.setData({
            inputValue: val
        })
    },
    //顶部搜索框
    SearchComShopList() {
        var that = this;
        var val = that.data.inputValue;
        var groupShoppList = netapi.shoppDetailUrl;
        if (val) {
            netWork.request({
                url: groupShoppList,
                data: {
                    "param": {
                        commodity_name: val,
                        custom_id: wx.getStorageSync('SYSTEM_USER').USER_ID
                    }
                },
                success: function (res) {
                    var _data = res.data.data;
                    that.setData({
                        GroupShoppTab: _data
                    })
                }
            })
        } else {
            wx.showToast({
                title: '请输入商品关键词',
                icon: 'none',
                duration: 1500//持续的时间
            })
        }

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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            inputValue: options.commodity_name,
            panelId: options.panel_id
        })
        var data = {
            "param": {
                "panelId": Number(options.panel_id),
                "custom_id": wx.getStorageSync('SYSTEM_USER').USER_ID
            },
        }
        this.getShoppList(data);
        this.indexTell();//客服电话

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
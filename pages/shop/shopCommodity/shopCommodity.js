// pages/shop/shopCommodity/shopCommodity.js
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
                cate_name: ' 新品',
            },
            {
                cate_id: 3,
                cate_name: '服务'
            }
        ],
        curNav: 0,
        curIndex: 0,
        groupId: "",//商户ID
        imagePrefix: netapi.imagePrefix,//图片路径
        GroupShoppTab: [],
        shopCardImg: "",
        shopCardName: "",
        visible: false,
        shoppType: [],
        searchVal: "",
        KFtell: ""//客服电话
    },
    //点击筛选商品
    switchRightTab: function (e) {
        let id = e.target.dataset.id, index = e.target.dataset.index;
        this.setData({
            curNav: id,
            curIndex: index
        })
        if (id == 0) {
            this.setData({
                GroupShoppTab: []
            })
            var data;
            if (this.data.searchVal) {
                data = {
                    "param": {
                        "group_id": Number(this.data.groupId),
                        "commodity_name": this.data.searchVal,
                        "recommendCommodity": -1,
                    }
                };
            } else {
                data = {
                    "param": {
                        "group_id": Number(this.data.groupId),
                    }
                };
            }
            this.groupShoppList(data);//门店商品
        }
        if (id == 1) {
            this.setData({
                GroupShoppTab: []
            })
            var data;
            if (this.data.searchVal) {
                data = {
                    "param": {
                        "group_id": Number(this.data.groupId),
                        "recommendCommodity": 1,
                        "commodity_name": this.data.searchVal
                    }
                };
            } else {
                data = {
                    "param": {
                        "group_id": Number(this.data.groupId),
                        "recommendCommodity": 1
                    }
                };
            }
            this.groupShoppList(data);//门店商品
        }
        if (id == 2) {
            this.setData({
                GroupShoppTab: []
            })
            var data;
            if (this.data.searchVal) {
                data = {
                    "param": {
                        "group_id": Number(this.data.groupId),
                        "newCommodity": 3,
                        "commodity_name": this.data.searchVal
                    }
                };
            } else {
                data = {
                    "param": {
                        "group_id": Number(this.data.groupId),
                        "newCommodity": 3
                    }
                };
            }
            this.groupShoppList(data);//门店商品
        }
        if (id == 3) {
            this.setData({
                GroupShoppTab: []
            })
            var data;
            if (this.data.searchVal) {
                data = {
                    "param": {
                        "group_id": Number(this.data.groupId),
                        "commodity_kind": 2,
                        "commodity_name": this.data.searchVal
                    }
                };
            } else {
                data = {
                    "param": {
                        "group_id": Number(this.data.groupId),
                        "commodity_kind": 2
                    }
                };
            }
            this.groupShoppList(data);//门店商品
        }
    },
    // 返回首页
    backHome: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //查看商品详情------------------------
    goShopDetail: function () {
        wx.navigateTo({
            url: '/pages/shop/shopDetail/shopDetail?groupId=' + Number(this.data.groupId)
        })
    },
    //商户商品列表推荐----------------------
    groupShoppList: function () {
        var groupShoppList = netapi.shoppDetailUrl + '?groupId=' + Number(this.data.groupId);
        netWork.request({
            url: groupShoppList,
            success: (res) => {
                var _data = res.data;
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
    //门店详情--------------------------------
    shopCardOptions: function () {
        var groupDetail = netapi.groupDetail + '?groupId=' + Number(this.data.groupId);
        netWork.request({
            url: groupDetail,
            success: (res) => {
                var _data = res.data;
                this.setData({
                    shopCardImg: _data.groupImg,
                    shopCardName: _data.groupName
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载--------------------------
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            groupId: options.id
        })
        var data = {
            "param": {
                "group_id": Number(this.data.groupId),
                "recommendCommodity": -1,
                "cutom_id": wx.getStorageSync('SYSTEM_USER').USER_ID
            },
        }
        that.groupShoppList();//门店商品
        that.shopCardOptions();//门店信息
    },
    //分类推荐
    selectcity() {
        var that = this;
        that.setData({ visible: true });
        var queryCommodityClassByGroupId = netapi.queryCommodityClassByGroupId;
        wx.request({
            url: queryCommodityClassByGroupId,
            data: {
                groupId: that.data.groupId
            },
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    shoppType: _data
                })
            }
        })
    },
    //关闭弹出层
    closePopUp() {
        this.setData({
            visible: false
        })
    },
    //获取搜索框内容
    getSearchVal(e) {
        var val = e.detail.value;
        this.setData({
            searchVal: val
        })
    },
    //根据分类查询商品
    getTypeShoppList(e) {
        var that = this;
        var id = e.target.dataset.id;
        var groupShoppList = netapi.shoppDetailUrl;
        var val = that.data.searchVal;
        var data;
        if (val) {
            data = {
                "param": {
                    type_id: id,
                    group_id: that.data.groupId,
                    commodity_name: that.data.searchVal,
                    cutom_id: wx.getStorageSync('SYSTEM_USER').USER_ID
                }
            }
        } else {
            data = {
                "param": {
                    type_id: id,
                    group_id: that.data.groupId,
                    cutom_id: wx.getStorageSync('SYSTEM_USER').USER_ID
                }
            }
        }
        netWork.request({
            url: groupShoppList,
            data: data,
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    GroupShoppTab: _data
                })
            }
        })
    },
    //顶部搜索框
    SearchComShopList() {
        var that = this;
        var val = that.data.searchVal;
        var groupShoppList = netapi.shoppDetailUrl;
        var data;
        if (val) {
            data = {
                "param": {
                    commodity_name: val,
                    group_id: that.data.groupId
                }
            }
        } else {
            data = {
                "param": {
                    group_id: that.data.groupId
                }
            }
        }
        netWork.request({
            url: groupShoppList,
            data: data,
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    GroupShoppTab: _data
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
    //对话框确认按钮点击事件
    onConfirm: function () {
        var that = this;
        wx.makePhoneCall({
            phoneNumber: that.data.KFtell
        })
        that.hideModal();
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
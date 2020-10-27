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
        shoppID: "",
        swiperList: [],
        cateItems: [
            {
                cate_id: 1,
                cate_name: '商品介绍',
            },
            {
                cate_id: 2,
                cate_name: '规格参数',
            },
            {
                cate_id: 3,
                cate_name: '包装售后'
            }
        ],
        curNav: 'nav' + 1,
        curIndex: 0,
        shoppType: "19款 17英寸 普通款",
        show: false,
        commentList: [],
        active: 0,
        specificationL: [],//规格参数左
        specificationR: [],//规格参数右
        shoppDesc: "",//商品描述
        shoppPrice: "",//价格
        norms: [],//规格参数
        featured: [],//特色服务
        current: "",//预览图片路径
        visible: false,
        showModal: false,
        collection: null,
        group_id: 0,//商户id
        KFtell: '',//客服电话
        html: "",
        commodit_comment_count: ""
    },
    // 返回首页
    backHome: function () {
        const pages = getCurrentPages();
        if (pages.length === 2) {
            wx.navigateBack({
                delta: 1
            });
        } else if (pages.length === 1) {
            wx.reLaunch({
                url: '/pages/index/index/index',
            })
        } else if (pages.length === 3) {
            wx.navigateBack({
                delta: 1
            });
        } else {
            wx.navigateBack({
                delta: 1
            });
        }
    },
    isshow() {
        this.setData({
            visible: true,
        })
    },
    closePopUp() {
        this.setData({
            visible: false
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
    onConfirm: function () {
        var that = this;
        wx.makePhoneCall({
            phoneNumber: that.data.KFtell
        })
        that.hideModal();
    },
    //查看更多评论
    lookMoreComment: function () {
        wx.navigateTo({
            url: '/pages/index/moreComment/index?shoppid=' + this.data.shoppID + "&count=" + this.data.commodit_comment_count
        })
    },
    //加入购物车
    successShoppCar: function () {
        var id = this.data.shoppID;
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
                if (res.data.status == true) {
                    wx.showToast({
                        title: res.data.desc,
                        icon: 'none',
                        duration: 1500
                    })
                } else {
                    wx.showToast({
                        title: res.data.desc,
                        icon: 'none',
                        duration: 1500
                    })
                }
            }
        })
    },
    onClose() {
        this.setData({ show: false });
    },
    //查询商品详情
    getShoppDetail: function (id) {
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
                var imgs = res.data.data[0].imgs;
                var norms = res.data.data[0].norms;
                var featured = res.data.data[0].featured;
                var shoppDesc = res.data.data[0].commodity_name;
                var shoppPrice = res.data.data[0].commodity_selling_price;
                var collection = res.data.data[0].collection;
                var group_id = res.data.data[0].group_id;
                var commodity_number = res.data.data[0].commodity_number;
                var commodit_comment_count = res.data.data[0].commodit_comment_count;
                that.setData({
                    swiperList: imgs,
                    shoppDesc: shoppDesc,
                    commodit_comment_count: commodit_comment_count,
                    shoppPrice: shoppPrice,
                    norms: norms,
                    featured: featured,
                    collection: collection,
                    group_id: group_id,
                })

                // 获取商品介绍详情
                if (res.data.data[0].commodity_number) {
                    var getCommodityToMongoJSON = netapi.getCommodityToMongoJSON;
                    wx.request({
                        url: getCommodityToMongoJSON,
                        data: {
                            commodityCode: commodity_number
                        },
                        success: function (res) {
                            var desc = res.data.afterSale;
                            var desc1 = res.data.desc;
                            desc1 = desc1.replace(/\<img/gi, '<img style="width:100%;height:auto" ');
                            desc = desc.replace(/\<img/gi, '<img style="width:100%;height:auto" ');
                            that.setData({
                                html: desc,
                                html1: desc1
                            })
                        }
                    })
                }
            }
        })
    },
    //预览图片，放大预览
    preview(event) {
        let currentUrl = event.currentTarget.dataset.src;
        let newArr = [];
        this.data.swiperList.forEach((item, index) => {
            newArr.push(this.data.imagePrefix + item.commodity_img_url)
        })
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls: newArr // 需要预览的图片http链接列表
        })
    },
    //客服电话
    indexTell: function () {
        var indexTypeUrl = netapi.tellUrl;
        wx.request({
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
    //关注商品
    attentionShopp() {
        var that = this;
        var id = that.data.shoppID;
        var CustomCollection = netapi.CustomCollection;
        netWork.request({
            url: CustomCollection,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: {
                customId: wx.getStorageSync('SYSTEM_USER').USER_ID,
                commodityId: id
            },
            success: function (res) {
                var status = res.data.status;
                if (status) {
                    that.setData({
                        collection: true
                    })
                }
            }
        })
    },
    //立即购买
    nowbuy() {
        var that = this;
        var arr = [];
        var ShoppArr = [];
        var obj = {};
        var obj1 = {};
        obj.commodity_id = that.data.shoppID;
        obj1.commodity_id = that.data.shoppID;
        obj.commodity_selling_price = that.data.shoppPrice;
        obj1.commodity_unit_price = that.data.shoppPrice;
        obj.join_shopping_cart_count = 1;
        obj1.commodity_count = 1;
        obj.group_id = that.data.group_id;
        obj1.group_id = that.data.group_id;
        obj.commodity_name = that.data.shoppDesc;
        obj.commodity_img = that.data.swiperList[0].commodity_img_url;
        arr.push(obj);
        ShoppArr.push(obj1);
        var list = JSON.stringify(arr);
        var list1 = JSON.stringify(ShoppArr);
        wx.navigateTo({
            url: '/pages/shopping/shoppOrder/shoppOrder?price=' + this.data.shoppPrice + "&param=" + list + "&param1=" + list1 + "&type=3"
        })
    },
    //查询商品评论
    getCommodityToMongoJSON() {
        var that = this;
        var getCommentByCommoditId = netapi.getCommentByCommoditId;
        var id = that.data.shoppID;
        wx.request({
            url: getCommentByCommoditId,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: {
                commoditId: id,
                start: 0,
                length: 1
            },
            success: function (res) {
                var _data = res.data.data;
                _data.forEach(item => {
                    var commentList = item.context.files;
                    var newArr = [];
                    commentList.forEach((item, index) => {
                        var filename = item;
                        var index1 = filename.lastIndexOf(".");
                        var index2 = filename.length;
                        var type = filename.substring(index1, index2);
                        if (type == ".mp4" || type == ".avi" || type == ".flv" || type == ".webm") {
                            commentList = []
                            var obj = {};
                            obj.type = "1";
                            obj.name = item;
                            newArr.push(obj)
                        }

                        if (type == ".png" || type == ".jpg" || type == ".jpeg") {
                            var obj = {};
                            obj.type = "2";
                            obj.name = item;
                            newArr.push(obj)
                        }
                    })
                    item.context.files = newArr;
                })
                that.setData({
                    commentList: _data
                })
            }
        })
    },
    /** 
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            shoppID: options.commodityId
        })
        that.getShoppDetail(options.commodityId);//商品详情
        that.getCommodityToMongoJSON();//评论列表查询
        this.indexTell();//客服电话

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
        let url = encodeURIComponent('/pages/index/shoppDetail/index?commodityId=' + this.data.shoppID);
        return {
            title: "商品详情",
            path: `/pages/index/index/index?url=${url}`
        }
    }
})
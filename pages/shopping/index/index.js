// pages/shopping/shopping.js
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
        shoppList: [],// 商品列表
        totalAmount: 0,//总共金额
        isshow: false,//控制店铺是否选中状态
        itemIsShow: false,//控制店铺商品是否选中状态
        shoppSum: 0,//商品总数目
        deleteShow: false,
        jsButtonShow: true,
        address: ""
    },
    //删除单件商品
    onClose(event) {
        var that = this;
        var id = event.target.dataset.index;
        const { position, instance } = event.detail;
        switch (position) {
            case 'left':
            case 'cell':
                instance.close();
                break;
            case 'right':
                wx.showModal({
                    content: '确定要删除吗',
                    success(res) {
                        if (res.confirm) {
                            var addAndDelUrl = netapi.addAndDel;
                            var data = {
                                carId: id,
                                deleteFlag: -1
                            }
                            netWork.request({
                                url: addAndDelUrl,
                                data: data,
                                method: "GET",
                                header: {
                                    "content-type": "application/json",
                                    "Ltoken": wx.getStorageSync('token'),
                                    "LclientCode": 3
                                },
                                success: function () {
                                    that.getShoppCardList();
                                    wx.showToast({
                                        title: '删除成功',
                                        icon: 'success',
                                        duration: 1500//持续的时间
                                    })
                                    instance.close();
                                }
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
                break;
        }
    },
    //选中事件
    selectList: function (e) {
        let sum = 0;
        let allSum = 0;
        let Findex = e.currentTarget.dataset.findex;//父元素下标
        let Sindex = e.currentTarget.dataset.index;//子元素下标
        let carts = this.data.shoppList;
        let arr = carts[Findex].commoditys;
        let commodityStatusView = arr[Sindex].commodityStatusView;
        arr[Sindex].commodityStatusView = !commodityStatusView;
        arr.forEach((item, index) => {
            if (item.commodityStatusView == true) {
                sum++
            }
        })
        //判断商铺是否选中
        if (sum >= carts[Findex].effectiveCount) {
            carts[Findex].groupStatusView = true;
        } else {
            carts[Findex].groupStatusView = false;
        }
        //商铺全选判断全选按钮时候选中
        carts.forEach((item, index) => {
            if (item.groupStatusView == true) {
                allSum++
            }
        })

        if (allSum >= carts.length) {
            this.setData({
                isshow: true
            });
        } else {
            this.setData({
                isshow: false
            });
        }
        this.setData({
            shoppList: carts
        });
        this.getTotalPrice();
    },
    //计算金额
    getTotalPrice() {
        let carts = this.data.shoppList;// 获取购物车列表
        let total = 0;
        let sum = 0;
        carts.forEach((item) => {
            item.commoditys.forEach((item) => {
                if (item.commodityStatusView) {
                    total += item.join_shopping_cart_count * item.commodity_selling_price;
                    sum += item.join_shopping_cart_count;
                }
            })
        })
        this.setData({                                // 最后赋值到data中渲染到页面
            totalAmount: total.toFixed(2),
            shoppSum: sum
        });
    },
    //全选 全不选
    checkAll: function () {
        let that = this;
        let selectAllStatus = that.data.isshow;    // 是否全选状态
        selectAllStatus = !selectAllStatus;
        let carts = that.data.shoppList;
        carts.forEach((item, index) => {
            item.groupStatusView = selectAllStatus;
            item.commoditys.forEach((item, index) => {
                if (item.enabled_static == 1) {
                    item.commodityStatusView = false;
                } else {
                    item.commodityStatusView = selectAllStatus;
                }
            })
        })
        that.setData({
            isshow: selectAllStatus,
            shoppList: carts
        })
        this.getTotalPrice()
    },
    //店铺全选 全不选
    dianAll: function (e) {
        let sum = 0;
        let allSum = 0;
        let index = e.currentTarget.dataset.index;
        let carts = this.data.shoppList;
        let arr = carts[index];
        arr.groupStatusView = !arr.groupStatusView;
        carts.forEach((item, index) => {
            if (item.groupStatusView == true) {
                allSum++;
            }
        })
        if (allSum >= carts.length) {
            this.setData({
                isshow: true
            })
        } else {
            this.setData({
                isshow: false
            })
        }
        arr.commoditys.forEach((item, index) => {
            if (item.commodityStatusView == false) {
                sum++;
            }
            if (item.enabled_static == 1) {
                item.commodityStatusView = false
            } else {
                item.commodityStatusView = !item.commodityStatusView;
            }
        })
        if (sum >= arr.commoditys.length) {
            arr.groupStatusView = true;
        } else {
            arr.groupStatusView = false;
        }
        this.setData({
            shoppList: carts,
        })
        this.getTotalPrice();
    },
    // 增加数量
    addCount: function (e) {
        var id = e.target.dataset.id;//商品id
        var addAndDelUrl = netapi.addAndDel;
        var data = {
            carId: id,
            num: 1
        }
        wx.request({
            url: addAndDelUrl,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: data,
            success: function (res) {
                console.log(res)
            }
        })
        let Findex = e.currentTarget.dataset.findex;//父元素下标
        let Sindex = e.currentTarget.dataset.index;//子元素下标
        let carts = this.data.shoppList;
        let arr = carts[Findex].commoditys;
        let num = arr[Sindex].join_shopping_cart_count;
        num = num + 1;
        arr[Sindex].join_shopping_cart_count = num;
        this.setData({
            shoppList: carts
        });
        this.getTotalPrice();
    },
    //减少数量
    minusCount: function (e) {
        var id = e.target.dataset.id;//商品id
        var addAndDelUrl = netapi.addAndDel;
        var data = {
            carId: id,
            num: -1
        }
        wx.request({
            url: addAndDelUrl,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: data,
            success: function (res) {
                console.log(res)
            }
        })
        let Findex = e.currentTarget.dataset.findex;//父元素下标
        let Sindex = e.currentTarget.dataset.index;//子元素下标
        let carts = this.data.shoppList;
        let arr = carts[Findex].commoditys;
        let num = arr[Sindex].join_shopping_cart_count;
        num = num - 1;
        arr[Sindex].join_shopping_cart_count = num;
        this.setData({
            shoppList: carts
        });
        this.getTotalPrice();
    },
    //结算
    goShoppOrder: function () {
        if (this.data.shoppSum > 0) {
            let carts = this.data.shoppList;
            let newArr = [];
            let ShoppArr = [];
            carts.forEach((item, index) => {
                var groupId = item.groupId;
                var groupName = item.groupName;
                var flg = true;
                item.commoditys.forEach((item) => {
                    if (item.commodityStatusView) {
                        var obj = {};
                        var obj1 = {};
                        obj.commodity_id = item.commodity_id;
                        obj1.commodity_id = item.commodity_id;
                        if (flg) {
                            obj.group_name = groupName;
                            flg = false;
                        } else {
                            obj.group_name = "groupName";
                        }
                        obj.group_id = groupId;
                        obj1.group_id = groupId;
                        obj.commodity_name = item.commodity_name;
                        obj.shopping_cart_id = item.shopping_cart_id;
                        obj.commodity_selling_price = item.commodity_selling_price;
                        obj1.commodity_unit_price = item.commodity_selling_price;
                        obj.join_shopping_cart_count = item.join_shopping_cart_count;
                        obj1.commodity_count = item.join_shopping_cart_count;
                        obj.commodity_img = item.imgs[0].commodity_img_url;
                        newArr.push(obj);
                        ShoppArr.push(obj1)
                    }
                })
            })
            var list = JSON.stringify(newArr);
            var list1 = JSON.stringify(ShoppArr);
            wx.navigateTo({
                url: '/pages/shopping/shoppOrder/shoppOrder?price=' + this.data.totalAmount + "&param=" + list + "&param1=" + list1 + "&type=1"
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '您还没有选择商品哦！'
            })
        }
    },
    //查询购物车商品
    getShoppCardList: function () {
        var that = this;
        var shoppList = netapi.shoppCardList;
        netWork.request({
            url: shoppList,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    shoppList: _data,
                })
            }
        })
    },
    //编辑商品
    editDetele: function () {
        this.setData({
            deleteShow: true,
            jsButtonShow: false,
        })
    },
    //完成
    successDetele: function () {
        this.setData({
            deleteShow: false,
            jsButtonShow: true,
        })
    },
    //删除商品
    closeButtonDetele: function () {
        var that = this;
        if (this.data.shoppSum > 0) {
            wx.showModal({
                content: '确定要删除吗',
                success(res) {
                    if (res.confirm) {
                        var _data = that.data.shoppList;
                        var newArr = [];
                        _data.forEach((item, index) => {
                            var data = item.commoditys.filter(function (item) {
                                return item.commodityStatusView == true;
                            })
                            data.forEach((item) => {
                                newArr.push(item.shopping_cart_id)
                            })
                        })
                        var AllDeteleList = netapi.AllDeteleList;
                        var str = "";
                        str = newArr.map(function (elem) {
                            return elem;
                        }).join(",");
                        var data_id = {
                            cartIdList: str
                        }
                        netWork.request({
                            url: AllDeteleList,
                            data: data_id,
                            method: "GET",
                            header: {
                                "content-type": "application/json",
                                "Ltoken": wx.getStorageSync('token'),
                                "LclientCode": 3
                            },
                            success: function () {
                                that.getShoppCardList();
                                that.setData({
                                    deleteShow: false,
                                    jsButtonShow: true,
                                    shoppSum: 0,
                                    totalAmount: 0
                                })
                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 1500//持续的时间
                                })
                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '请选择要删除的商品！'
            })
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getShoppCardList();
        this.setData({
            isshow: false,
            shoppSum: 0,
            totalAmount: 0,
            address: wx.getStorageSync('cityName')
        })
    },
    //点击商品进入详情
    goShoppDetail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/index/shoppDetail/index?commodityId=' + id
        })
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
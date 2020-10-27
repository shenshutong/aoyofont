const app = getApp();
var netWork = require('../../../utils/netWork.js');
var netapi = require("../../../utils/api.js");

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
        upkeepList: [],
        total: 0
    },
    //返回上一页
    backIndex2: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    // 单选按钮事件
    radioChange(e) {
        var Findex = e.detail.value;
        let carts = this.data.upkeepList;
        carts.forEach((item, index) => {
            if (index == Findex) {
                carts[index].selectedStatus = true;
            } else {
                item.selectedStatus = false;
            }
        })
        this.setData({
            upkeepList: carts
        })
        this.getTotalPrice(Findex);
    },
    //查询镀晶套餐
    getUpkeepList() {
        var that = this;
        var querySuitDetail = netapi.querySuitDetail;
        netWork.request({
            url: querySuitDetail,
            data: {
                suitType: 1
            },
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    upkeepList: _data
                })
            }
        })
    },
    //计算金额
    getTotalPrice(index) {
        let carts = this.data.upkeepList[index];// 获取购物车列表
        let total = 0;
        if (carts.selectedStatus == true) {
            carts.commoditys.forEach((item) => {
                total += item.commodityCount * item.commodityPrice;
            })

            if (carts.discount_tser == 1) {
                this.setData({
                    total: (total - carts.discount_value).toFixed(2)
                })
            }
            if (carts.discount_tser == 2) {
                this.setData({
                    total: (total * carts.discount_value).toFixed(2)
                })
            }
        }

    },
    // 增加数量
    addCount: function (e) {
        let Findex = e.currentTarget.dataset.findex;//父元素下标
        let Sindex = e.currentTarget.dataset.index;//子元素下标
        let carts = this.data.upkeepList;
        let arr = carts[Findex].commoditys;
        let num = arr[Sindex].commodityCount;
        num = num + 1;
        arr[Sindex].commodityCount = num;
        this.setData({
            upkeepList: carts
        });
        this.getTotalPrice(Findex);
    },
    //减少数量
    minusCount: function (e) {
        let Findex = e.currentTarget.dataset.findex;//父元素下标
        let Sindex = e.currentTarget.dataset.index;//子元素下标
        let carts = this.data.upkeepList;
        let arr = carts[Findex].commoditys;
        let num = arr[Sindex].commodityCount;
        num = num - 1;
        arr[Sindex].commodityCount = num;
        this.setData({
            upkeepList: carts
        });
        this.getTotalPrice(Findex);
    },
    //去结算
    goShoppOrder() {
        if (this.data.total > 0) {
            var shoppList = this.data.upkeepList;
            var arr = [];
            var newArr = [];
            var discount_tser;
            var discount_value;
            var suit_name;
            var suitId;
            shoppList.forEach((item, index) => {
                if (item.selectedStatus == true) {
                    var group_id = item.group_id;
                    suit_name = item.suit_name;
                    suitId = item.suit_id;
                    discount_tser = item.discount_tser;//优惠方式
                    discount_value = item.discount_value;//优惠金额
                    item.commoditys.forEach((item, index) => {
                        var obj = {};
                        var obj1 = {};
                        obj.commodity_id = item.commodity_id;
                        obj1.commodity_id = item.commodity_id;
                        obj.group_id = group_id;
                        obj1.group_id = group_id;
                        obj.commodity_name = item.commodityName;
                        obj.commodity_selling_price = item.commodityPrice;
                        obj1.commodity_unit_price = item.commodityPrice;
                        obj.join_shopping_cart_count = item.commodityCount;
                        obj1.commodity_count = item.commodityCount;
                        obj.commodity_img = item.imgs[0].commodity_img_url;
                        arr.push(obj);
                        newArr.push(obj1);
                    })
                }
            })
            var list = JSON.stringify(arr);
            var list1 = JSON.stringify(newArr);
            wx.navigateTo({
                url: '/pages/shopping/shoppOrder/shoppOrder?discount_tser=' + discount_tser + "&param2=" + list + "&discount_value=" + discount_value + "&suitName=" + suit_name + "&type=2" + "&list1=" + list1 + "&suitId=" + suitId
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '您还没有选择套餐哦！'
            })
        }
    },
    //商品详情
    goShoppDetail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/index/shoppDetail/index?commodityId=' + id
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
        this.getUpkeepList();//查询保养套餐
        this.setData({
            total: 0
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
// pages/my/orderList/orderList.js
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
       
        thisIndex: 0,
        list: [],//全部
        unpaid: [],//待支付
        underway: [],//进行中
        comment: [],//待评价
        success: [],//已完成
        status: [],
        sendOrderStatus:[
            {
                name:'待支付',
                value:'1'
            },{
                name:'进行中',
                value:'2'
            },{
                name:'待评价',
                value:'3'
            },{
                name:'已完成',
                value:'4'
            }
        ],
        cateItems: [
            {
                cate_id: 0,
                name: '全部',
            },
            {
                cate_id: 1,
                name: ' 待支付',
            },
            {
                cate_id: 2,
                name: '进行中'
            },
            {
                cate_id: 3,
                name: '待评价'
            },
            {
                cate_id: 4,
                name: '已完成'
            }
        ],
    },
    //tab 点击每一项
    tabClick: function (e) {
        var thisIndex = e.detail.id;
        this.setData({
            thisIndex: thisIndex
        })
        if (thisIndex == 0) {
            this.getOrderList();
        }
        // if (thisIndex == 1) {
        //     this.getunpaidList();
        // }
        // if (thisIndex == 2) {
        //     this.underwayList();
        // }
        // if (thisIndex == 3) {
        //     this.getcommentList();//进行中
        // }
        // if (thisIndex == 4) {
        //     this.getsuccessList();//已完成
        // }
    },
    // onChange(event) {
    //     console.log(event.detail.name)
    // },
    //去评价
    goevaluate: function (e) {
        var commID = e.currentTarget.dataset.id;
        var groupID = e.currentTarget.dataset.groupid;
        var code = e.currentTarget.dataset.code;
        var detailID = e.currentTarget.dataset.detailid;
        wx.navigateTo({
            url: '/pages/my/evaluate/evaluate?id=' + commID + "&groupID=" + groupID + "&code=" + code + "&detailID=" + detailID
        })
    },
    //返回上一页
    backMy: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //查询订单
    getOrderList: function () {
        var that = this;
        netWork.request({
            url: 'http://localhost:8081/user/showOrderList',
            method: "POST",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                 console.log(res.data)
                 var list = res.data;
                 that.setData({
                    list:list,
                 })
            }
        })
    },
   
    
    //删除订单
    delOrder(e) {
        var that = this;
        var id = e.target.dataset.id;
        //var updateOrderById = netapi.updateOrderById;
        wx.showModal({
            content: '确认删除订单吗',
            success: function (res) {
                if (res.confirm) {
                    netWork.request({
                        url: 'http://localhost:8081/user/deleteOrder',
                        header: {
                            "content-type": "application/json",
                            "Ltoken": wx.getStorageSync('token'),
                            "LclientCode": 3
                        },
                        data: {
                            //"param": {
                                orderId: id,
                                //delete_flag: 2
                            //}
                        },
                        success: function (res) {
                            console.log("删除成功");
                            wx.showToast({
                              title: '删除成功',
                            })
                            var data = res.data.status;
                            if (data == true) {
                                that.getOrderList();
                            }
                           
                        }
                    })
                } else {//这里是点击了取消以后
                    console.log('用户点击取消')
                }
            }
        })

    },

     //查询订单详情
     getOrderDetail(e) {
        var timeCode = e.currentTarget.dataset.code;
        wx.navigateTo({
            url: '/pages/shopping/nonPayment/nonPayment?code=' + timeCode,
        })
    },


    //加入购物车
    // addShoppIng(e) {
    //     var id = e.target.dataset.id;
    //     var addShoppCardUrl = netapi.addShoppCard + "?commodityId=" + id;
    //     var token = wx.getStorageSync('token');
    //     netWork.request({
    //         url: addShoppCardUrl,
    //         method: "GET",
    //         header: {
    //             "content-type": "application/json",
    //             "Ltoken": token,
    //             "LclientCode": 3
    //         },
    //         success: (res) => {
    //             if (res.data.status == true) {
    //                 wx.showToast({
    //                     title: res.data.desc,
    //                     icon: 'success',
    //                     duration: 1500
    //                 })
    //             }
    //         }
    //     })
    // },
    //申请退货
    // applySales(e) {
    //     var orderid = e.target.dataset.orderid;
    //     var order_detail_id = e.target.dataset.order_detail_id;
    //     wx.navigateTo({
    //         url: '/pages/shopping/nonPayment/nonPayment?orderid=' + orderid + '&order_detail_id=' + order_detail_id + '&orderDetelt=-1',
    //     })

    // },
    //套餐申请退货
    // applySalesTc(e) {
    //     var code = e.currentTarget.dataset.code;
    //     var orderid = e.currentTarget.dataset.orderid;
    //     wx.navigateTo({
    //         url: '/pages/shopping/nonPayment/nonPayment?orderid=' + orderid + '&Timecode=' + code
    //     })
    // },
   
   
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var index = options.index;
        this.setData({
            thisIndex: index
        })
        if (index == 0) {
            this.getOrderList();//全部
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
        this.getOrderList();//全部
        // this.getunpaidList();//待支付
        // this.underwayList();//进行中
        // this.getcommentList();//进行中
        // this.getsuccessList();//已完成
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
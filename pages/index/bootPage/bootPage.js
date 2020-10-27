// pages/index/bootPage/bootPage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        countDownNum: 3,
        timer: '', //定时器
    },
    //进入首页
    goIndex() {
        wx.reLaunch({
            url: '/pages/index/index/index'
        })
    },
    //定时器
    countDown: function () {
        let that = this;
        let countDownNum = 3; //获取倒计时初始值 
        that.setData({
            countDownNum: countDownNum
        })
        that.setData({
            timer: setInterval(function () {
                countDownNum--;
                that.setData({
                    countDownNum: countDownNum
                })
                if (countDownNum == 0) {
                    clearInterval(that.data.timer);
                    //关闭定时器之后，可作其他处理     
                    wx.switchTab({
                        url: '/pages/index/index/index',
                    })
                }
            }, 1000)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.countDown();
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
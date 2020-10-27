// pages/index/authentication/authentication.js
const app = getApp();
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
        photo: "",//证件图片
        carTell: "",//车牌号
        carCode: "",//识别码
        carFDJ: "",//发动机
        name: '',//姓名
        yngh: "",//是否过户
        address: "",//地址
        use_character: "",//使用性质
        vehicle_type: "",//车辆类型
        model: "",//品牌型号
        register_date: "",//注册时间
        issue_date: "",//发证时间
        index: 0,
        array: [
            {
                id: 0, name: '请选择车辆类型'
            },
            {
                id: '01', name: '大型汽车'
            },
            {
                id: '02', name: '小型汽车'
            },
            {
                id: '03', name: '使馆汽车'
            },
            {
                id: '04', name: '领馆汽车'
            },
            {
                id: '05', name: '境外汽车'
            },
            {
                id: '06', name: '外籍汽车'
            },
            {
                id: '07', name: '两三轮摩托车'
            },
            {
                id: '08', name: '轻便摩托车'
            },
            {
                id: '09', name: '使馆摩托车'
            },
            {
                id: '10', name: '领馆摩托车'
            },
            {
                id: '11', name: '境外摩托车'
            },
            {
                id: '12', name: '外籍摩托车'
            },
            {
                id: '13', name: '农用运输车'
            },
            {
                id: '14', name: '拖拉机'
            },
            {
                id: '15', name: '挂车'
            },
            {
                id: '16', name: '教练汽车'
            },
            {
                id: '17', name: '教练摩托车'
            },
            {
                id: '26', name: '香港入境车'
            },
            {
                id: '27', name: '澳门入境车'
            },
            {
                id: '51', name: '新能源大车'
            },
            { id: '52', name: '新能源小车' },
        ],
        carTypeId: 0
    },
    //上传证件图片
    changeAvatar: function () {
        const _this = this;
        var uploadImgJsz = netapi.uploadImgJsz;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                wx.showLoading({
                    title: '上传中',
                })
                const tempFilePaths = res.tempFiles;
                wx.uploadFile({
                    url: uploadImgJsz,
                    filePath: tempFilePaths[0].path,
                    name: 'file',
                    header: {
                        "Content-Type": "multipart/form-data",
                        'accept': 'application/json',
                    },
                    success(res) {
                        wx.hideLoading();
                        let data = JSON.parse(res.data);
                        console.log(data)
                        if (data.status == false) {
                            wx.showToast({
                                title: '识别失败，请重新上传',
                                icon: 'none',
                                duration: 1500
                            })
                        } else {
                            _this.setData({
                                photo: data.data.fileUri,
                                name: data.data.owner,
                                carTell: data.data.plate_num,
                                carCode: data.data.vin,
                                carFDJ: data.data.engine_num,
                                address: data.data.addr,
                                vehicle_type: data.data.vehicle_type,
                                use_character: data.data.use_character,
                                model: data.data.model,
                                issue_date: data.data.issue_date,
                                register_date: data.data.register_date
                            })
                        }

                    }
                })
            }
        })
    },
    //车牌号
    getCarTell(e) {
        var value = e.detail.value;
        this.setData({
            carTell: value
        })
    },
    //识别码
    getCarCode(e) {
        var value = e.detail.value;
        this.setData({
            carCode: value
        })
    },
    //发动机
    getCarFDJ(e) {
        var value = e.detail.value;
        this.setData({
            carFDJ: value
        })
    },
    //姓名
    getName(e) {
        var value = e.detail.value;
        this.setData({
            name: value
        })
    },
    //查询违章信息
    binding() {
        var that = this;
        if (that.data.carTypeId == 0) {
            wx.showToast({
                title: '请选择车辆类型',
                icon: 'none'
            })
        } else {
            var data = {
                code: that.data.carTell,//车牌号
                type: that.data.carTypeId,//车辆类型
                vin: that.data.carCode,//vin码
                engine: that.data.carFDJ,//发动机号码
                "param": {
                    custom_name: that.data.name,//姓名
                    driving_img_url: that.data.photo,//证件图片
                    addr: that.data.address,//住址
                    model: that.data.model,//品牌型号
                    use_character: that.data.use_character,//使用性质
                    vehicle_type: that.data.vehicle_type,//车辆类型
                    register_time: that.data.register_date,//注册日期
                    issue_date: that.data.issue_date//发证日期
                },

            }
            var obj = JSON.stringify(data);
            wx.navigateTo({
                url: '/pages/index/regulations/regulations?data=' + obj,
            })
        }
    },
    //汽车类型
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value,
            carTypeId: this.data.array[e.detail.value].id
        })
    },
    //返回上一页
    backfirst() {
        wx.navigateBack({
            delta: 1,
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
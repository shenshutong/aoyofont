// pages/my/loveCar/loveCar.js
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
        defelut: false,
        visible: false,
        yrz: [],
        xsValue: "",//行驶里程
        actualService: '',//行驶里程
        headingCode: "",//车辆识别码
        engine: "",//发动机型号
        date: '',//上路时间
        regisedate: "",//注册时间
        carName: "",//车主姓名
        identity: "",//身份证号码
        InsuranceDue: "",//保险到期日
        array: ['是', '否'],//是否过户
        yngh: "",//是否过户
        city: "",//投保城市
        bxName: "",//保险公司名称
        bxid: 0,//保险公司id
        carKx: "",//车辆款型
        fdjMax: "0",//发动机排量
        carYear: "",//生产年份
        licensePlate: "",//车牌号
        carTitle: "",//车辆name
        custom_car_id: 0,//车辆id
        carDefult: 0,//是否默认
        car_model_id: 0,
        carbxID: 0,
        carImg: "",
        authentication: false,
        car_series_id: 0,//车辆id
        cardisName: "",
        carOptions: [],
        driving_id: 0,//认证id

        /************************************城市信息*********************************/

        value: [0, 0, 0], // 地址选择器省市区 暂存 currentIndex
        regionValue: [0, 0, 0], // 地址选择器省市区 最终 currentIndex
        provinces: [], // 一级地址
        citys: [], // 二级地址
        areas: [], // 三级地址
        visible: false,
        isCanConfirm: true, //是否禁止在第一列滚动期间点击确定提交数据
        sID: "",//省id
        qID: "",//区市id
        xID: ""//区县id
    },
    //返回上一页
    backorderList() {
        const pages = getCurrentPages();
        if (pages.length === 2) {
            wx.navigateBack({
                delta: 1
            });
        } else if (pages.length === 1) {
            wx.reLaunch({
                url: '/pages/my/carport/carport'
            })
        } else if (pages.length >= 4) {
            wx.reLaunch({
                url: '/pages/my/carport/carport'
            })
        } else {
            wx.navigateBack({
                delta: 1
            });
        }
    },
    //行驶里程
    getActualService(e) {
        var value = e.detail.value;
        this.setData({
            xsValue: value
        })
    },
    //修改行驶里程
    getXSvalue() {
        var that = this;
        var saveCarXX = netapi.saveCarXX;
        that.setData({
            actualService: that.data.xsValue
        })
        netWork.request({
            url: saveCarXX,
            data: {
                road_haul: that.data.actualService ? that.data.actualService : 0,
                custom_car_id: that.data.custom_car_id
            },
            success: function (res) {
                if (res.data.status == true) {
                    wx.showToast({
                        title: "编辑成功",
                        icon: "none"
                    })
                } else {
                    wx.showToast({
                        title: res.data.desc,
                        icon: "none"
                    })
                }
            }
        })
    },
    //车辆识别码
    getheadingCode(e) {
        var value = e.detail.value;
        this.setData({
            headingCode: value
        })
    },
    //车辆识别码
    getengine(e) {
        var value = e.detail.value;
        this.setData({
            engine: value
        })
    },
    //车主姓名
    getcarName(e) {
        var value = e.detail.value;
        this.setData({
            carName: value
        })
    },
    //身份证号码
    getidentity(e) {
        var value = e.detail.value;
        this.setData({
            identity: value
        })
    },
    //保险到期日
    bindDateChange2: function (e) {
        this.setData({
            InsuranceDue: e.detail.value
        })
    },
    //是否过户
    bindPickerChange: function (e) {
        this.setData({
            yngh: e.detail.value
        })
    },
    //投保城市
    bindDateChangeCity(e) {
        this.setData({
            city: e.detail.value[1]
        })
    },
    //保险公司
    goinsuranceCompany() {
        wx.navigateTo({
            url: '/pages/my/insuranceCompany/insuranceCompany',
        })
    },
    //查询车辆信息
    getCarOpthions(id, customID) {
        var getCustomCarDetailsById = netapi.getCustomCarDetailsById;
        var that = this;
        netWork.request({
            url: getCustomCarDetailsById,
            data: {
                custom_car_id: id,
                custom_id: wx.getStorageSync('SYSTEM_USER').USER_ID
            },
            success: function (res) {
                var _data = res.data.data;
                that.setData({
                    carOptions: _data
                })
                if (_data[0].custom_driving) {
                    var arr = _data[0].custom_driving[0].register_time.split(/[ ]+/);
                    _data[0].custom_driving[0].register_time = arr[0];
                    that.setData({
                        licensePlate: _data[0].custom_driving[0].plate_number ? _data[0].custom_driving[0].plate_number : '',
                        regisedate: _data[0].custom_driving[0].register_time ? _data[0].custom_driving[0].register_time : '',
                        date: _data[0].custom_driving[0].register_time ? _data[0].custom_driving[0].register_time : '',
                        engine: _data[0].custom_driving[0].engine_number ? _data[0].custom_driving[0].engine_number : '',
                        headingCode: _data[0].custom_driving[0].vin_number ? _data[0].custom_driving[0].vin_number : '',
                        driving_id: _data[0].custom_driving[0].driving_id ? _data[0].custom_driving[0].driving_id : '',
                        authentication: true
                    })
                } else {
                    that.setData({
                        authentication: false
                    })
                }
                if (_data[0].car_insurance_message) {
                    var arr = _data[0].car_insurance_message[0].car_end_time.split(/[ ]+/);
                    _data[0].car_insurance_message[0].car_end_time = arr[0];
                    if (_data[0].car_insurance_message[0].name18 == null) {
                        _data[0].car_insurance_message[0].name18 = "";
                    }
                    that.setData({
                        bxName: _data[0].car_insurance_message[0].insurance_company_name,
                        carName: _data[0].car_insurance_message[0].car_owner_name,
                        city: _data[0].car_insurance_message[0].name18,
                        identity: _data[0].car_insurance_message[0].id_number,
                        InsuranceDue: _data[0].car_insurance_message[0].car_end_time,
                        yngh: _data[0].car_insurance_message[0].whether_id - 1,
                        sID: _data[0].car_insurance_message[0].code ? Number(_data[0].car_insurance_message[0].code) : '',
                        qID: _data[0].car_insurance_message[0].city_id ? Number(_data[0].car_insurance_message[0].city_id) : '',
                        xID: _data[0].car_insurance_message[0].area_id ? Number(_data[0].car_insurance_message[0].area_id) : '',
                        bxid: _data[0].car_insurance_message[0].insurance_company_id,
                        carbxID: _data[0].car_insurance_message[0].car_insurance_message_id
                    })
                }
                if (_data[0].whether_id == 1) {
                    that.setData({
                        defelut: true
                    })
                } else {
                    that.setData({
                        defelut: false
                    })
                }
                that.setData({
                    carTitle: _data[0].car_detai[0].car_brand_name ? _data[0].car_detai[0].car_brand_name : '',
                    carImg: _data[0].car_detai[0].car_brand_logo_url_1 ? _data[0].car_detai[0].car_brand_logo_url_1 : '',
                    carKx: _data[0].car_detai[0].car_model_name ? _data[0].car_detai[0].car_model_name : '',
                    carYear: _data[0].car_detai[0].car_model_year ? _data[0].car_detai[0].car_model_year : '',
                    fdjMax: _data[0].car_detai[0].car_engine_capacity ? _data[0].car_detai[0].car_engine_capacity : '',
                    car_series_id: _data[0].car_detai[0].car_series_id ? _data[0].car_detai[0].car_series_id : '',
                    custom_car_id: _data[0].custom_car_id,
                    carDefult: _data[0].whether_id,
                    car_model_id: _data[0].car_model_id,
                    actualService: _data[0].road_haul,
                    xsValue: _data[0].road_haul
                })
            }
        })
    },
    //保存车辆信息
    saveCarXX() {
        var updateCustomCarInsurance = netapi.updateCustomCarInsurance;
        var that = this;
        if (that.data.InsuranceDue && that.data.identity && that.data.city && that.data.bxid && that.data.carName) {
            netWork.request({
                url: updateCustomCarInsurance,
                data: {
                    "param": {
                        "car_end_time": that.data.InsuranceDue + ' 00:00:00',
                        "id_number": that.data.identity,
                        "whether_id": Number(that.data.yngh) + 1,
                        "car_owner_name": that.data.carName,
                        "province_id": Number(that.data.sID),
                        "city_id": Number(that.data.qID),
                        "area_id": Number(that.data.xID),
                        "insurance_company_id": that.data.bxid,
                        "custom_car_id": that.data.custom_car_id
                    },
                    car_insurance_message_id: that.data.carbxID
                },
                success: function (res) {
                    if (res.data.status) {
                        wx.reLaunch({
                            url: '/pages/my/carport/carport'
                        })
                    } else {
                        wx.showToast({
                            title: res.data.desc,
                            icon: 'none',
                            duration: 1000
                        })
                    }
                }
            })
        } else {
            wx.showToast({
                title: '请完善车险信息',
                icon: 'none',
                duration: 1000
            })
        }
    },
    //去认证
    goAuthenTicn() {
        wx.navigateTo({
            url: '/pages/my/authentication/authentication?id=' + this.data.custom_car_id,
        })
    },
    //解绑行驶证
    goJdriving(e) {
        var idDriving = e.target.dataset.id;
        wx.navigateTo({
            url: '/pages/my/authentication/authentication?idDriving=' + idDriving,
        })
    },
    //选择发动机排量
    goCarSeries() {
        var obj = {
            custom_car_id: this.data.custom_car_id,
            car_model_id: this.data.car_model_id,
            road_haul: this.data.actualService,
            whether_id: this.data.carDefult
        }
        var carDetail = JSON.stringify(obj);
        wx.navigateTo({
            url: '/pages/my/displace/displace?id=' + this.data.car_series_id + "&carName=" + this.data.carTitle + "&carDetail=" + carDetail + "&carImg=" + this.data.carImg + "&type=loveCarID"
        })
    },
    //选择生产年份
    goCarYear() {
        var obj = {
            custom_car_id: this.data.custom_car_id,
            car_model_id: this.data.car_model_id,
            road_haul: this.data.actualService,
            whether_id: this.data.carDefult
        }
        var carDetail = JSON.stringify(obj);
        wx.navigateTo({
            url: '/pages/my/carYear/carYear?carID=' + this.data.car_series_id + "&id=" + this.data.fdjMax + "&carName=" + this.data.carTitle + "&carDetail=" + carDetail + "&carImg=" + this.data.carImg + "&type=loveCarID"
        })
    },
    //选择车型
    goCarLtype() {
        var obj = {
            custom_car_id: this.data.custom_car_id,
            car_model_id: this.data.car_model_id,
            road_haul: this.data.actualService,
            whether_id: this.data.carDefult
        }
        var carDetail = JSON.stringify(obj);
        wx.navigateTo({
            url: '/pages/my/carLType/carLType?carID=' + this.data.car_series_id + "&car_dis=" + this.data.fdjMax + "&id=" + this.data.carYear + "&carName=" + this.data.carTitle + "&carDetail=" + carDetail + "&carImg=" + this.data.carImg + "&type=loveCarID"
        })
    },
    //提示认证车辆
    goRzCar() {
        if (this.data.licensePlate == "") {
            wx.showToast({
                title: '快去认证车辆吧',
                icon: "none"
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.id == 0) {
            wx.showModal({
                content: '暂无爱车，快去添加吧',
                success(res) {
                    if (res.confirm) {
                        wx.reLaunch({
                            url: '/pages/index/addCarType/addCarType',
                        })
                    } else if (res.cancel) {
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                }
            })
        }
        this.getCarOpthions(options.id);
        this.queryApiAddress();//收货地址查询
    },
    //投保城市
    pickAddress() {
        this.setData({
            visible: true,
            value: [...this.data.regionValue]
        })
    },
    // 点击地区选择取消按钮
    cityCancel(e) {
        this.setData({
            visible: false
        })
    },
    //收货地址查询
    queryApiAddress: function () {
        var that = this;
        var addressLabel = netapi.queryApiAddress;
        netWork.request({
            url: addressLabel,
            success: function (res) {
                var _data = res.data.data;
                var id = _data[0].code;
                that.setData({
                    provinces: _data,
                })
                var addressLabel = netapi.queryApiAddress + "?code=" + id;
                netWork.request({
                    url: addressLabel,
                    success: function (res) {
                        var _data = res.data.data;
                        var id = _data[0].code;
                        that.setData({
                            citys: _data
                        })
                        var addressLabel = netapi.queryApiAddress + "?code=" + id;
                        netWork.request({
                            url: addressLabel,
                            success: function (res) {
                                var _data = res.data.data;
                                that.setData({
                                    areas: _data
                                })
                            }
                        })
                    }
                })
            }
        })
    },
    chooseStart(e) {
        this.setData({
            isCanConfirm: false
        })
    },
    chooseEnd(e) {
        this.setData({
            isCanConfirm: true
        })
    },
    //城市联动
    cityChange(e) {
        var value = e.detail.value;
        var that = this;
        let {
            provinces,
            citys,
            areas
        } = this.data
        var provinceNum = value[0];
        var cityNum = value[1];
        var areaNum = value[2];
        var streetNum = value[3];
        if (this.data.value[0] !== provinceNum) {
            var id = provinces[provinceNum].code;
            var addressLabel = netapi.queryApiAddress + "?code=" + id;
            wx.request({
                url: addressLabel,
                success: function (res) {
                    var _data = res.data.data;
                    that.setData({
                        citys: _data
                    })
                    var id = _data[0].code;
                    var addressLabel = netapi.queryApiAddress + "?code=" + id;
                    wx.request({
                        url: addressLabel,
                        success: function (res) {
                            var _data = res.data.data;
                            var id = _data[0].code;
                            var addressLabel = netapi.queryApiAddress + "?code=" + id;
                            that.setData({
                                areas: _data
                            })
                            wx.request({
                                url: addressLabel,
                                success: function (res) {
                                    var _data = res.data.data;
                                    that.setData({
                                        street: _data
                                    })
                                }
                            })
                        }
                    })
                }
            })
            this.setData({
                value: [provinceNum, 0, 0, 0],
            })
        } else if (this.data.value[1] !== cityNum) {
            var id = citys[cityNum].code;
            var addressLabel = netapi.queryApiAddress + "?code=" + id;
            wx.request({
                url: addressLabel,
                success: function (res) {
                    var _data = res.data.data;
                    that.setData({
                        areas: _data
                    })
                }
            })
            this.setData({
                value: [provinceNum, cityNum, 0, 0],
                areas: this.data.areas[citys[cityNum].code],
            })
        } else if (this.data.value[2] !== areaNum) {
            var id = areas[areaNum].code;
            var addressLabel = netapi.queryApiAddress + "?code=" + id;
            wx.request({
                url: addressLabel,
                success: function (res) {
                    var _data = res.data.data;
                    that.setData({
                        street: _data
                    })
                }
            })
            this.setData({
                value: [provinceNum, cityNum, areaNum, 0],
                street: this.data.street[areas[areaNum].code]
            })
        } else {
            this.setData({
                value: [provinceNum, cityNum, areaNum, streetNum]
            })
        }
    },
    // 点击地区选择确定按钮
    citySure(e) {
        if (this.data.isCanConfirm) {
            var value = this.data.value;
            this.setData({
                visible: false,
                sID: Number(this.data.provinces[value[0]].code),
                qID: this.data.citys[value[1]].code,
                xID: this.data.areas[value[2]].code,
                city: this.data.citys[value[1]].name
            })

            try {
                var region = (this.data.provinces[value[0]].name || '') + '-' + (this.data.citys[value[1]].name || '');
                if (this.data.areas.length > 0) {
                    region = region + '-' + this.data.areas[value[2]].name || '';
                } else {
                    this.data.value[2] = 0
                }
                if (this.data.street.length > 0) {
                    if (value.length == 3) {
                        region = region + '-' + this.data.street[0].name;
                        this.setData({
                            visible: false,
                            jdID: this.data.street[0].code,
                        })
                    } else {
                        region = region + '-' + this.data.street[value[3]].name;
                        this.setData({
                            visible: false,
                            jdID: this.data.street[value[3]].code,
                        })
                    }
                } else {
                    this.data.value[3] = 0
                }
            } catch (error) {
                console.log('adress select something error')
            }

            this.setData({
                region: region,
                lastCitys: this.data.citys,
                lastAreas: this.data.areas,
                lastStreet: this.data.street,
                regionValue: [...this.data.value]
            }, () => {
            })
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
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];
        if (currPage) {
            this.data.bxid = currPage.data.bxid;
            this.data.bxName = currPage.data.bxName;
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
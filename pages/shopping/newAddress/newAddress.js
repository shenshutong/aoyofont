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
        region: [],
        text: "",
        address: '', //详细收货地址（四级）
        value: [0, 0, 0], // 地址选择器省市区 暂存 currentIndex
        regionValue: [0, 0, 0], // 地址选择器省市区 最终 currentIndex
        provinces: [], // 一级地址
        citys: [], // 二级地址
        areas: [], // 三级地址
        street: [],
        visible: false,
        isCanConfirm: true, //是否禁止在第一列滚动期间点击确定提交数据
        tag: [],//收货标签
        curNav: 1,
        curIndex: 0,
        sID: "",//省id
        qID: "",//区市id
        xID: "",//区县id
        jdID: "",//街道id
        consigneeName: "",//姓名
        telephone: "",//手机号
        addressDetails: "",//详细地址
        addressLabelId: 1,//标签id
        defulitValue: 2,//是否默认地址
        addressPeopleID: "",
        ssqxVlue: "",
        checkedStatus: null,
        saveNewButton: null,
        saveButton: null,
        addressId: 0,
        showModal: false,
        deleteShow: false,
        hiddenmodalput: true,
        labelValue: "",
        show: 0,
        ErrDesc: "",
        code:'',
        aoyoAddress:{}
    },
    //返回上一页
    backlist: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    //是否是默认地址
    switch1Change: function (e) {
        if (e.detail.value == true) {
            this.setData({
                defulitValue: 1
            })
        } else {
            this.setData({
                defulitValue: 2
            })
        }
    },
    //标签id
    selectD: function (e) {
        let id = e.target.dataset.id, index = e.target.dataset.index;
        this.setData({
            curNav: id,
            curIndex: index,
            addressLabelId: id
        })
    },
    //收货人姓名
    addressName(e) {
        this.setData({
            consigneeName: e.detail.value
        })
    },
    //收货人手机号
    addressinpone(e) {
        this.setData({
            telephone: e.detail.value
        })
    },
    //收货人详细地址
    addressDetail(e) {
        this.setData({
            addressDetails: e.detail.value
        })
    },
    //收货标签查询
    getAddressLabel: function () {
        var that = this;
        //var addressLabel = netapi.getAddressLabel;

        netWork.request({
            url: 'http://localhost:8081/user/addressLabel',
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                var _data = res.data.data;
             
                that.setData({
                    tag: _data
                })
            }
        })
    },
    //收货地址查询
    queryApiAddress: function (e) {
        var that = this;
        //var addressLabel = netapi.queryApiAddress;
        netWork.request({
            url: 'http://localhost:8081/user/showProvince',

            success: function (res) {
                var _data = res.data.data;
                var id = _data[0].code;
                that.setData({
                    provinces: _data,
                })
               // var addressLabel = netapi.queryApiAddress + "?code=" + id;
                netWork.request({
                    url: 'http://localhost:8081/user/showCitys?code='+id,
                    success: function (res) {
                        var _data = res.data.data;
                        var id = _data[0].code;
                        that.setData({
                            citys: _data
                        })
                       // var addressLabel = netapi.queryApiAddress + "?code=" + id;
                        netWork.request({
                            url: 'http://localhost:8081/user/showAreas?code='+id,
                            success: function (res) {
                                var _data = res.data.data;
            
                                var id = _data[0].code
                                that.setData({
                                    areas: _data
                                })
                                //var addressLabel = netapi.queryApiAddress + "?code=" + id;
                                netWork.request({
                                    url:'http://localhost:8081/user/showStreet?code='+id,
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
            }
        })
    },
    //新增收货地址
    saveAddress: function(){
        console.log(this.data.consigneeName)
        //var addressAddUrl = netapi.addressAdd;
        netWork.request({
            url: 'http://localhost:8081/user/initAddress',
            method: "POST",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: {
                "consigneeName": this.data.consigneeName,
                "telephone": this.data.telephone,
                "addressLabelId": this.data.addressLabelId,
                "provinceId": this.data.provinceId,
                "cityId": this.data.cityId,
                "areaId": this.data.areaId,
                "streetId": this.data.streetId,
                "addressDetails": this.data.addressDetails,
                "defaultAddress": Number(this.data.defulitValue)
            },
            success: function (res) {
                if(res.data){
                    wx.showToast({
                        title: '添加成功',
                      })
                    wx.navigateTo({
                      url: '/pages/shopping/receiver/receiver',
                    })
                }else{
                    wx.showToast({
                        title: 'error',
                      })
                }
             
            }
        })

    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAddressLabel();//收货标签查询
        this.queryApiAddress();//收货地址查询
        this.cityChange();
        if (options.id) {
            this.setData({
                saveNewButton: false,
                saveButton: true,
                addressId: options.id,
                deleteShow: true
            })
        } else {
            this.setData({
                saveNewButton: true,
                saveButton: false,
            })
        }
        this.queryApiAddressOne(options.id);
    },
    //修改 删除
    editDeleAddress: function () {
        var editDeletAddress = netapi.editDeletAddress;
        var that = this;
        netWork.request({
            url: editDeletAddress,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: {
                "param": {
                    "address_id": that.data.addressId,
                    "consignee_name": that.data.inputNameValue,
                    "telephone": that.data.inputIphoneValue,
                    "address_label_id": that.data.labelID,
                    "province_id": that.data.sID,
                    "city_id": that.data.qID,
                    "county_id": that.data.xID,
                    "street_id": that.data.jdID,
                    "address_details": that.data.inputDetailsValue,
                    "default_address": Number(that.data.defulitValue)
                },
            },
            success: function (res) {
                wx.setStorage({
                    key: "addressID",  // 存储的key值
                    data: that.data.addressId   // 需要存储的值
                })
                wx.navigateBack({
                    delta: 2,
                })
                that.setData({
                    inputNameValue: "",
                    inputIphoneValue: "",
                    inputDetailsValue: "",
                    ssqxVlue: "",
                    labelID: 1
                })
            }
        })
    },
    //收货信息查询
    queryApiAddressOne: function (addressPeopleID) {
        var that = this;
        var addressLabel = netapi.addressList;
        if (addressPeopleID) {
            netWork.request({
                url: addressLabel,
                method: "GET",
                header: {
                    "content-type": "application/json",
                    "Ltoken": wx.getStorageSync('token'),
                    "LclientCode": 3
                },
                data: {
                    "param": {
                        "address_id": addressPeopleID,
                    }
                },
                success: function (res) {
                    var _data = res.data.data;
                    _data.forEach((item, index) => {
                        if (item.default_address == 1) {
                            that.setData({
                                checkedStatus: true
                            })
                        } else if (item.default_address == 2) {
                            that.setData({
                                checkedStatus: false
                            })
                        }
                        that.setData({
                            inputNameValue: item.consignee_name,
                            inputIphoneValue: item.telephone,
                            inputDetailsValue: item.address_details,
                            ssqxVlue: item.name46 + '-' + item.name38 + '-' + item.name34 + '-' + item.name41,
                            curNav: item.address_label_id,
                            sID: item.province_id,
                            qID: item.city_id,//区市id
                            xID: item.county_id,//区县id
                            jdID: item.street_id,//街道id
                            labelID: item.default_address,//街道id
                            defulitValue: item.default_address
                        })
                    })
                }
            })
        }
    },
    closePopUp() {
        this.setData({
            visible: false
        })
    },
    pickAddress() {
        this.setData({
            visible: true,
            value: [...this.data.regionValue]
        })
    },
    //城市联动
    cityChange:function(e) {
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
                url: 'http://localhost:8081/user/showCitys?code='+id,
                success: function (res) {
                    var _data = res.data.data;
                    that.setData({
                        citys: _data
                    })
                    var id = _data[0].code;
                    var addressLabel = netapi.queryApiAddress + "?code=" + id;
                    wx.request({
                        url: 'http://localhost:8081/user/showAreas?code='+id,
                        success: function (res) {
                            var _data = res.data.data;
                            var id = _data[0].code;
                            var addressLabel = netapi.queryApiAddress + "?code=" + id;
                            that.setData({
                                areas: _data
                            })
                            wx.request({
                                url: 'http://localhost:8081/user/showStreet?code='+id,
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
                url: 'http://localhost:8081/user/showAreas?code='+id,
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
            //var addressLabel = netapi.queryApiAddress + "?code=" + id;
            wx.request({
                url: 'http://localhost:8081/user/showStreet?code='+id,
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
    // 点击地区选择取消按钮
    cityCancel(e) {
        this.setData({
            visible: false
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
    // 点击地区选择确定按钮
    citySure(e) {
        if (this.data.isCanConfirm) {
            var value = this.data.value;
            this.setData({
                visible: false,
                sID: Number(this.data.provinces[value[0]].code),
                qID: this.data.citys[value[1]].code,
                xID: this.data.areas[value[2]].code,
            })
            // 将选择的城市信息显示到输入框

            try {
                var region = (this.data.provinces[value[0]].pname || '') + '-' + (this.data.citys[value[1]].name || '');
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
    //删除收货地址
    deleteAddress: function () {
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
        this.setData({
            showModal: false
        });
    },
    modalinput: function () {
        this.setData({
            hiddenmodalput: !this.data.hiddenmodalput
        })
    },
    getLabelContent: function (e) {
        var value = e.detail.value;
        this.setData({
            labelValue: value
        })
    },
    //添加标签
    confirm: function () {
        var addLabel = netapi.addLabel;
        var that = this;
        netWork.request({
            url: addLabel,
            data: {
                labelName: that.data.labelValue,
                labelOriginal: 2
            },
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            success: function (res) {
                if (res.data.status == true) {
                    that.setData({
                        hiddenmodalput: !that.data.hiddenmodalput
                    })
                    that.getAddressLabel();
                }
            }
        })
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
        var editDeletAddress = netapi.editDeletAddress;
        var that = this;
        netWork.request({
            url: editDeletAddress,
            method: "GET",
            header: {
                "content-type": "application/json",
                "Ltoken": wx.getStorageSync('token'),
                "LclientCode": 3
            },
            data: {
                "param": {
                    "address_id": that.data.addressId,
                    "consignee_name": that.data.inputNameValue,
                    "telephone": that.data.inputIphoneValue,
                    "address_label_id": that.data.labelID,
                    "province_id": that.data.sID,
                    "city_id": that.data.qID,
                    "county_id": that.data.xID,
                    "street_id": that.data.jdID,
                    "address_details": that.data.inputDetailsValue,
                    "default_address": Number(that.data.defulitValue),
                    "delete_flag": -1
                },
            },
            success: function (res) {
                var pages = getCurrentPages(); // 当前页面
                var beforePage = pages[pages.length - 2]; // 前一个页面
                wx.navigateBack({
                    success: function () {
                        beforePage.onLoad(); // 执行前一个页面的onLoad方法
                    }
                });
                wx.setStorage({
                    key: 'addressID',
                    data: null,
                })
            }
        })
        this.setData({
            showModal: false
        });
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
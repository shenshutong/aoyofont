//请求路径
// const baseUrl = "https://api.aoyosh.com/";
const baseUrl = "https://test-api.miyouzhiyun.com/";

//图片路径
// const imagePrefix = "https://biz.aoyosh.com/";
const imagePrefix = "";

//首页
var indexTypeUrl = baseUrl + "functionIconDriver/getFunctionButtonList";//首页类型
var indexSweiper = baseUrl + "platformDriver/getCarouselList";//首页轮播图
var tellUrl = baseUrl + 'serviceDriver/getServiceUserList';//客服电话
var likeShoppUrl = baseUrl + 'customBrowseDriver/queryBrowse';//猜你喜欢
var nearbyShopUrl = baseUrl + 'storeDriver/getStoreList';//首页附近门店
var shoppDetailUrl = baseUrl + 'commodityDriver/queryCommodityApi';//商品详情、列表
var getCommodityListByClassId = baseUrl + 'commodity/class/getCommodityListByClassId';//商品详情、列表
var addShoppCard = baseUrl + 'customShoppingCarDriver/addShoppingCar';//加入购物车
var searchHot = baseUrl + 'hotClassDriver/queryHotClass';//热门搜索
var searchHistory = baseUrl + 'customQueryHistoryDriver/queryCustomQueryHistory';//搜索历史
var delSearchHistory = baseUrl + 'customQueryHistoryDriver/deleteAllCustomQueryHistory';//删除搜索历史
var cityList = baseUrl + 'cityLocationDriver/getcityLocationList';//查询城市列表
var hotCityList = baseUrl + 'cityLocationDriver/getHotCityList';//查询城市列表
var addhotCityList = baseUrl + 'cityLocationDriver/saveCityLocation';//添加热门城市
var OneCityID = baseUrl + 'storeDriver/getLocationName';//首次定位查找城市ID
var searchCity = baseUrl + 'cityLocationDriver/getcityLocationByName';//模糊搜索城市
var getCustomCarwhetherIs = baseUrl + 'carManageDriver/getCustomCarwhetherIs';//查询默认车辆
var CustomCollection = baseUrl + 'customCollectionDriver/addCustomCollection';//关注商品
var getCarIllegal = baseUrl + 'car/illegal/getCarIllegal';//查询违章
var querySuitDetail = baseUrl + 'suitAPPDriver/querySuitDetail';//套餐查询
var upLocation = baseUrl + 'location/upLocation';//实时上传地理位置
var getCommentByCommoditId = baseUrl + 'comment/getCommentByCommoditId';//查询评论列表
var getCommodityToMongoJSON = baseUrl + 'commodityDriver/getCommodityToMongoJSON';//获取商品介绍
var getCommodityIconPlate = baseUrl + 'commodityPanelDriver/getCommodityPanel';//查询首页商品分类
var getCustomAllowReceiveCouponList = baseUrl + 'coupon/getCustomAllowReceiveCouponList';//查询可领取的优惠劵
var receiveCoupon = baseUrl + 'coupon/receiveCoupon';//领取优惠劵


//车辆
var getHotCar = baseUrl + 'carBrandHotDriver/getCarBrandHotList';//查询热门车辆品牌
var getSearcchCar = baseUrl + 'carBrandHotDriver/getCarSeriesByName';//搜索车辆品牌
var getCarList = baseUrl + 'carBrand/getCarBrandParentList';//查询车辆品牌
var addHotCar = baseUrl + 'carBrandHotDriver/saveCarBrandHot';//添加车辆热门品牌
var addCarSubset = baseUrl + 'carBrand/getCarBrandList';//添加车辆子集品牌
var getCarEngineCapacity = baseUrl + 'carBrand/getCarEngineCapacity';//查询发动排量
var getCarModelYear = baseUrl + 'carBrand/getCarModelYear';//查询车辆年份信息
var getCarModelName = baseUrl + 'carBrand/getCarModelName';//查询车辆车型
var getCarModelById = baseUrl + 'carBrand/getCarModelById';//查询车辆信息
var getCarInsuranceCompanyList = baseUrl + 'carManageDetailsDriver/getCarInsuranceCompanyList';//保险公司信息
var saveCustomCar = baseUrl + 'carManageDetailsDriver/saveCustomCar';//添加用户车辆信息
var getCustomCarList = baseUrl + 'carManageDriver/getCustomCarList';//查询用户下的车辆信息
var customCarIsNo = baseUrl + 'carManageDriver/customCarIsNo';//设置为默认车辆
var deleteCustomCar = baseUrl + 'carManageDriver/deleteCustomCar';//删除车辆
var uploadPicture = baseUrl + 'carDrivingDriver/uploadPicture';//行驶证图片上传
var saveCarDriving = baseUrl + 'carDrivingDriver/saveCarDriving';//绑定行驶证
var getCarDrivingById = baseUrl + 'carDrivingDriver/getCarDrivingById';//查询行驶证信息
var deleteCarDriving = baseUrl + 'carDrivingDriver/deleteCarDriving';//解绑行驶证
var getCustomCarDetailsById = baseUrl + 'carManageDetailsDriver/getCustomCarDetailsById';//查询车辆信息
var saveCarXX = baseUrl + 'carManageDetailsDriver/updateCustomCar';//修改行驶里程
var updateCustomCarInsurance = baseUrl + 'carManageDetailsDriver/updateCustomCarInsurance';//保存车险信息
var updateCustomCarBrand = baseUrl + 'carManageDetailsDriver/updateCustomCarBrand';//修改车辆信息

//门店
var groupAll = baseUrl + 'groupApiDriver/queryAllGroup';//查询所有商户
var groupDetail = baseUrl + 'groupApiDriver/queryGroupDetail';//门店详情
var queryCommodityClassByGroupId = baseUrl + 'commodityDriver/queryCommodityClassByGroupId';//门店分类筛选
var queryGroupAppointmentRules = baseUrl + 'customAppointmentDriver/queryGroupAppointmentRules';//预约查询
var addCustomAppointment = baseUrl + 'customAppointmentOrderDriver/addCustomAppointment';//预约

//购物车
var shoppCardList = baseUrl + 'customShoppingCarDriver/queryShoppingCar';//查询购物车商品
var addAndDel = baseUrl + 'customShoppingCarDriver/updateShoppingCar';//加、减商品
var addressList = baseUrl + 'customAddressDriver/queryCustomAddress';//收货地址查询
var addressAdd = baseUrl + 'customAddressDriver/addCustomAddress';//收货地址添加
var getAddressLabel = baseUrl + 'addressLabelDriver/queryAddressLabel';//收货标签查询
var queryApiAddress = baseUrl + 'addressApiDriver/queryApiAddress';//收货地址查询
var editDeletAddress = baseUrl + 'customAddressDriver/updateCustomAddress';//收货地址编辑 、删除
var AllDeteleList = baseUrl + 'customShoppingCarDriver/deleteShoppingCarList';//全部删除购物车商品
var AllShoppList = baseUrl + 'commodityDriver/settlementCommoditys';//订单页面获取商品列表
var placeOrder = baseUrl + 'orderDriver/addOrderCommodityAPP';//下订单
var addLabel = baseUrl + 'addressLabelDriver/addAddressLabel';//添加标签
var getOrderByTimeCodeAPP = baseUrl + 'orderDriver/getOrderByTimeCodeAPP';//查询当前订单下的商户
var replaceAppointmentOrder = baseUrl + 'customAppointmentOrderDriver/replaceAppointmentOrder';//更换服务

//我的
var OrderCommodity = baseUrl + 'orderDriver/queryOrderCommodityAPP';//查询订单
var OrderCommodityCount = baseUrl + 'orderCommodityDriver/queryOrderStatusCount';//查询订单数量
var informationList = baseUrl + 'customAPPDriver/queryCustomById';//个人信息查询
var updateCustom = baseUrl + 'customAPPDriver/updateCustom';//个人信息编辑
var uploadImg = baseUrl + 'customAPPDriver/uploadPicture';//个人头像上传
var uploadImgJsz = baseUrl + 'carDrivingDriver/uploadDrivingImg';//行驶证上传
var wxLogin = baseUrl + 'applet/login/loginByWeChat';//微信登录
var bindWeChat = baseUrl + 'applet/login/bindWeChat';//绑定微信
var wxLoginRegisterCustom = baseUrl + 'applet/login/wxLoginRegisterCustom';//注册手机号
var DecodeInfo = baseUrl + 'applet/login/loginDecodeInfo';//获取openid
var bindDecodeInfo = baseUrl + 'applet/login/bindDecodeInfo';//绑定微信号
var confirmUpdateBind = baseUrl + 'applet/login/confirmUpdateBind';
var mobileDecodeInfo = baseUrl + 'applet/login/mobileDecodeInfo';//解析手机号
var loginByMobile = baseUrl + 'applet/login/loginByMobile';//手机号登录
var sendSMSCode = baseUrl + 'applet/sms/sendSMSCode';//手机验证码
var sendImgCode = baseUrl + 'applet/login/sendImgCode';//验证码图片
var sendsmsyzm = baseUrl + 'applet/sms/sendSMSCode';//修改手机号发送验证码
var sendIMGyzm = baseUrl + 'applet/sms/sendImgCode';//修改手机号发送图片验证码
var checkSMSCode = baseUrl + 'applet/sms/checkSMSCode';//确认修改手机号
var carCount = baseUrl + 'carManageDriver/getCustomCarCount';//查询车辆数量
var queryCustomCollection = baseUrl + 'customCollectionDriver/queryCustomCollection';//查询关注商品收藏列表
var deleteCustomCollection = baseUrl + 'customCollectionDriver/deleteCustomCollection';//取消关注
var uploadFaceIdentityImg = baseUrl + 'customLicenseDriver/uploadFaceIdentityImg';//上传身份证正面
var uploadBackIdentityImg = baseUrl + 'customLicenseDriver/uploadBackIdentityImg';//上传身份证反面
var saveCustomLicense = baseUrl + 'customLicenseDriver/saveCustomLicense';//绑定身份证
var paymentOrderAPP = baseUrl + 'orderDriver/paymentOrderAPP';//待付款微信支付
var getCustomLicenseById = baseUrl + 'customLicenseDriver/getCustomLicenseById';//查询实名认证信息
var cancelOrderByTimeCode = baseUrl + 'orderDriver/cancelOrderByTimeCode';//取消订单
var updateOrderById = baseUrl + 'orderDriver/updateOrderById';//删除订单
var queryOrderCommodityByTimeAPP = baseUrl + 'orderDriver/queryOrderCommodityByTimeAPP';//查询订单详情
var orderReturnX = baseUrl + 'orderReturnDriver/orderReturnX';//申请退货
var queryOrderCommodityById = baseUrl + 'orderCommodityDriver/queryOrderCommodityById';//申请退货单间商品
var shoppPush = baseUrl + 'comment/push';//评价商品
var getQrCode = baseUrl + 'getQRCodeDriver/getQrCode';//获取二维码
var cancelAppointmentOrder = baseUrl + 'customAppointmentOrderDriver/cancelAppointmentOrder';//取消服务
var upsertOptions = baseUrl + 'work/order/upsertOptions';//线下开工
var getCustomByMobile = baseUrl + 'work/custom/getCustomByMobile';//根据手机号查询用户信息
var getCustomCarList1 = baseUrl + 'work/custom/getCustomCarList';//根据用户id获取车辆信息
var addProgressNode = baseUrl + 'work/progress/addProgressNode';//添加工作流
var upLoadFile = baseUrl + 'work/progress/upLoadFile';//上传工作流图片
var getLocationListByWorkOrderId = baseUrl + 'work/progress/getLocationListByWorkOrderId';//获取工作流
var getProgressNode = baseUrl + 'work/progress/getProgressNode';//获取单节点信息
var registeredByMobile = baseUrl + 'work/custom/registeredByMobile';//注册手机号
var saveCustomCar1 = baseUrl + 'work/custom/saveCustomCar';//添加新用户车辆
var getCommOrderById = baseUrl + 'getQRCodeDriver/getCommOrderById';//扫描二维码获取商品信息
var getWorkOrderList = baseUrl + 'work/order/getWorkOrderList';//获取工单列表
var upLoadFileWork = baseUrl + 'work/order/upLoadFile';//上传客户手签图片
var customSignture = baseUrl + 'work/order/custom_signture';//工单完成
var getWokerOrderServiceByOrderId = baseUrl + 'work/order/getWokerOrderInfoByOrderId';//查看工单的所有服务项目
var delOptions = baseUrl + 'work/order/delOptions';//删除服务项
var upsertOptionsByOnline = baseUrl + 'work/order/upsertOptionsByOnline';//扫码开单
var cancel = baseUrl + 'work/order/cancel';//取消工单
var getWOrkerOrderLocations = baseUrl + 'work/order/getWOrkerOrderLocations';//获取工单地图
var upLoadFileEv = baseUrl + 'comment/upLoadFile';//评论上传
var queryCustomByCustomId = baseUrl + 'customAPPDriver/queryCustomByCustomId';//查询商品会员id
var getUseAgreement = baseUrl + 'useAgreementDriver/getUseAgreement';//用户协议
var getCouponListByStatus = baseUrl + 'coupon/getCustomCouponListByStatus';//优惠券查询
var getProgressNodeByWorkOrderId = baseUrl + 'work/progress/getProgressNodeByWorkOrderId';//查看当前工作状态


//node的导出方式
module.exports = {
  indexTypeUrl: indexTypeUrl,
  upLoadFileWork: upLoadFileWork,
  customSignture: customSignture,
  delOptions: delOptions,
  cancel: cancel,
  receiveCoupon: receiveCoupon,
  getCustomAllowReceiveCouponList: getCustomAllowReceiveCouponList,
  getCommodityListByClassId: getCommodityListByClassId,
  getCommodityIconPlate: getCommodityIconPlate,
  getUseAgreement: getUseAgreement,
  getCouponListByStatus: getCouponListByStatus,
  queryCustomByCustomId: queryCustomByCustomId,
  getProgressNodeByWorkOrderId: getProgressNodeByWorkOrderId,
  updateCustomCarInsurance: updateCustomCarInsurance,
  getCommentByCommoditId: getCommentByCommoditId,
  upLoadFileEv: upLoadFileEv,
  getWOrkerOrderLocations: getWOrkerOrderLocations,
  upsertOptionsByOnline: upsertOptionsByOnline,
  indexSweiper: indexSweiper,
  getWorkOrderList: getWorkOrderList,
  registeredByMobile: registeredByMobile,
  saveCustomCar: saveCustomCar,
  getCommodityToMongoJSON: getCommodityToMongoJSON,
  getWokerOrderServiceByOrderId: getWokerOrderServiceByOrderId,
  addProgressNode: addProgressNode,
  getCustomByMobile: getCustomByMobile,
  carCount: carCount,
  getProgressNode: getProgressNode,
  upLoadFile: upLoadFile,
  upLocation: upLocation,
  getCustomCarList: getCustomCarList,
  confirmUpdateBind: confirmUpdateBind,
  querySuitDetail: querySuitDetail,
  CustomCollection: CustomCollection,
  getCustomCarwhetherIs: getCustomCarwhetherIs,
  imagePrefix: imagePrefix,
  saveCarXX: saveCarXX,
  getCommOrderById: getCommOrderById,
  likeShoppUrl: likeShoppUrl,
  saveCustomCar1: saveCustomCar1,
  getCustomCarList1: getCustomCarList1,
  OneCityID: OneCityID,
  tellUrl: tellUrl,
  upsertOptions: upsertOptions,
  replaceAppointmentOrder: replaceAppointmentOrder,
  shoppPush: shoppPush,
  updateCustomCarBrand: updateCustomCarBrand,
  uploadImgJsz: uploadImgJsz,
  wxLoginRegisterCustom: wxLoginRegisterCustom,
  deleteCarDriving: deleteCarDriving,
  cancelAppointmentOrder: cancelAppointmentOrder,
  getLocationListByWorkOrderId: getLocationListByWorkOrderId,
  queryGroupAppointmentRules: queryGroupAppointmentRules,
  getCustomCarDetailsById: getCustomCarDetailsById,
  getCarDrivingById: getCarDrivingById,
  queryCommodityClassByGroupId: queryCommodityClassByGroupId,
  saveCarDriving: saveCarDriving,
  uploadPicture: uploadPicture,
  bindWeChat: bindWeChat,
  addCustomAppointment: addCustomAppointment,
  customCarIsNo: customCarIsNo,
  bindDecodeInfo: bindDecodeInfo,
  getOrderByTimeCodeAPP: getOrderByTimeCodeAPP,
  getCarEngineCapacity: getCarEngineCapacity,
  getCarInsuranceCompanyList: getCarInsuranceCompanyList,
  deleteCustomCar: deleteCustomCar,
  getCarModelById: getCarModelById,
  getCarModelName: getCarModelName,
  getCarModelYear: getCarModelYear,
  checkSMSCode: checkSMSCode,
  getSearcchCar: getSearcchCar,
  addHotCar: addHotCar,
  getQrCode: getQrCode,
  getCustomCarList: getCustomCarList,
  addCarSubset: addCarSubset,
  getHotCar: getHotCar,
  getCarList: getCarList,
  sendIMGyzm: sendIMGyzm,
  searchCity: searchCity,
  nearbyShopUrl: nearbyShopUrl,
  shoppDetailUrl: shoppDetailUrl,
  addShoppCard: addShoppCard,
  groupAll: groupAll,
  getCarIllegal: getCarIllegal,
  getCustomLicenseById: getCustomLicenseById,
  sendsmsyzm: sendsmsyzm,
  groupDetail: groupDetail,
  paymentOrderAPP: paymentOrderAPP,
  cancelOrderByTimeCode: cancelOrderByTimeCode,
  searchHot: searchHot,
  searchHistory: searchHistory,
  delSearchHistory: delSearchHistory,
  updateOrderById: updateOrderById,
  shoppCardList: shoppCardList,
  addAndDel: addAndDel,
  addressList: addressList,
  addressAdd: addressAdd,
  getAddressLabel: getAddressLabel,
  queryApiAddress: queryApiAddress,
  editDeletAddress: editDeletAddress,
  AllDeteleList: AllDeteleList,
  cityList: cityList,
  hotCityList: hotCityList,
  addhotCityList: addhotCityList,
  AllShoppList: AllShoppList,
  orderReturnX: orderReturnX,
  placeOrder: placeOrder,
  OrderCommodity: OrderCommodity,
  OrderCommodityCount: OrderCommodityCount,
  informationList: informationList,
  updateCustom: updateCustom,
  uploadImg: uploadImg,
  wxLogin: wxLogin,
  DecodeInfo: DecodeInfo,
  mobileDecodeInfo: mobileDecodeInfo,
  loginByMobile: loginByMobile,
  sendSMSCode: sendSMSCode,
  sendImgCode: sendImgCode,
  queryOrderCommodityById: queryOrderCommodityById,
  queryCustomCollection: queryCustomCollection,
  deleteCustomCollection: deleteCustomCollection,
  uploadFaceIdentityImg: uploadFaceIdentityImg,
  uploadBackIdentityImg: uploadBackIdentityImg,
  saveCustomLicense: saveCustomLicense,
  queryOrderCommodityByTimeAPP: queryOrderCommodityByTimeAPP,
  addLabel: addLabel
}




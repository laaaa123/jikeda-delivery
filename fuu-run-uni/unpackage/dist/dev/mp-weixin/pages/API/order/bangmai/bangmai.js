"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_request = require("../../../../request/request.js");
const request_apis_order = require("../../../../request/apis/order.js");
const request_apis_tag = require("../../../../request/apis/tag.js");
const request_apis_address = require("../../../../request/apis/address.js");
const common_assets = require("../../../../common/assets.js");
const _sfc_main = {
  setup() {
    const notify = common_vendor.useNotify();
    const showPrimary = (message) => {
      notify.primary(message);
    };
    const showSuccess = (message) => {
      notify.success(message);
    };
    const showDanger = (message) => {
      notify.danger(message);
    };
    const showWarning = (message) => {
      notify.warning(message);
    };
    const hideNotify = () => {
      notify.hide();
    };
    return { showPrimary, showSuccess, showDanger, showWarning, hideNotify };
  },
  data() {
    return {
      btnSubmitLoading: false,
      tabValue: 0,
      totalPrice: "--",
      routeInfo: {},
      pricingInfo: {},
      nearbyRiderInfo: {},
      uploadUrl: request_request.upload_url,
      specifiedTimeText: "尽快配送",
      genderText: "不限",
      uploaderData: {
        type: 1,
        name: ""
      },
      autoCancelText: "30分钟",
      currAttachMoney: 0,
      currEstimatedPrice: 0,
      currVolumeLengthCm: "",
      currVolumeWidthCm: "",
      currVolumeHeightCm: "",
      currInsuredAmount: 0,
      activeTagIndex: -1,
      tagRemark: "",
      tagList: [
        {
          name: "其它",
          remark: ""
        }
      ],
      currSchool: null,
      //当前校区
      submitForm: {
        serviceType: 1,
        // 帮买
        schoolId: null,
        // 学校id
        weight: "小于2KG",
        // 物品重量
        detail: "",
        // 订单详情
        tag: "",
        // 物品类型
        isTimed: 0,
        // 是否指定配送时间
        specifiedTime: null,
        // 具体指定配送时间
        autoCancelTtl: 1800,
        // 付款未接单自动取消时间 秒
        gender: 2,
        // 限制性别 2不限
        additionalAmount: 0,
        // 追加金额
        volumeLengthCm: null,
        volumeWidthCm: null,
        volumeHeightCm: null,
        insuredAmount: 0,
        estimatedPrice: 0,
        //商品预估价格
        attachImages: [],
        // 附件图片的ossid
        attachFiles: [],
        // 附件文件的ossid
        startAddress: {
          id: "",
          name: "",
          phone: "",
          title: "",
          detail: "",
          lat: "",
          lon: ""
        },
        endAddress: {
          id: "",
          name: "",
          phone: "",
          title: "",
          detail: "",
          lat: "",
          lon: ""
        }
      },
      headers: {
        Authorization: "Bearer " + common_vendor.index.getStorageSync("token"),
        "Content-Type": "multipart/form-data"
      },
      ossList: [],
      showGenderPopup: false,
      showDatePopup: false,
      showServiceTypePopup: false,
      showImagePopup: false,
      showMoneyPopup: false,
      showVolumePopup: false,
      showInsuredPopup: false,
      showCancelTimePopup: false,
      showStartAddressPopup: false,
      showEndAddressPopup: false,
      showPricePopup: false,
      genderData: [
        {
          text: "不限",
          value: 2
        },
        {
          text: "男",
          value: 1
        },
        {
          text: "女",
          value: 0
        }
      ],
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2022, 4, 10, 10, 10),
      rangeValue: 2,
      cancelTimes: [
        {
          text: "30分钟",
          value: 1800
        },
        {
          text: "1小时",
          value: 3600
        },
        {
          text: "2小时",
          value: 7200
        },
        {
          text: "3小时",
          value: 10800
        },
        {
          text: "5小时",
          value: 18e3
        },
        {
          text: "10小时",
          value: 36e3
        },
        {
          text: "24小时",
          value: 86400
        },
        {
          text: "48小时",
          value: 172800
        }
      ],
      startAddressList: [],
      endAddressList: []
    };
  },
  onLoad(options) {
    this.initData();
    this.applyHomePrefill(options);
    this.getAddresses();
    this.getTags();
    this.cacurlatePrice();
  },
  onReachBottom() {
  },
  computed: {
    hasPricingInfo() {
      return this.pricingInfo && this.pricingInfo.payableAmount != null;
    },
    priceItems() {
      return Array.isArray(this.pricingInfo.items) ? this.pricingInfo.items : [];
    },
    weightText() {
      return this.submitForm.weight || "默认1KG";
    },
    volumeSizeText() {
      const { volumeLengthCm, volumeWidthCm, volumeHeightCm } = this.submitForm;
      if (!volumeLengthCm && !volumeWidthCm && !volumeHeightCm)
        return "未填写";
      return `${volumeLengthCm || "-"}×${volumeWidthCm || "-"}×${volumeHeightCm || "-"}cm`;
    },
    insuredAmountText() {
      const amount = Number(this.submitForm.insuredAmount || 0);
      return amount > 0 ? `${amount.toFixed(2)}元` : "未保价";
    },
    selectedTagRequiresSize() {
      const item = this.tagList[this.activeTagIndex];
      return item && Number(item.sizeRequired) === 1;
    }
  },
  methods: {
    applyHomePrefill(options = {}) {
      ["startAddress", "endAddress"].forEach((key) => {
        if (!options[key])
          return;
        try {
          const address = JSON.parse(decodeURIComponent(options[key]));
          this.normalizeOrderAddress(address);
          this.submitForm[key] = {
            ...this.submitForm[key],
            ...address
          };
        } catch (e) {
          common_vendor.index.__f__("log", "at pages/API/order/bangmai/bangmai.vue:499", e);
        }
      });
      this.refreshRouteEstimate();
    },
    submitOrder() {
      let that = this;
      let form = this.submitForm;
      this.normalizeOrderAddress(form.startAddress);
      this.normalizeOrderAddress(form.endAddress);
      if (!this.validateItemSize())
        return;
      let ossIds = [];
      let ossList = this.ossList;
      for (var i = 0; i < ossList.length; i++) {
        ossIds.push(ossList[i].ossId);
      }
      form.attachImages = ossList;
      that.btnSubmitLoading = true;
      const SUBSCRIBE_ID = "uQ8cRcy8jM8Rb09EUDZopOZgCLQcrxlFlGNzVez8_-w";
      if (common_vendor.wx$1.requestSubscribeMessage) {
        common_vendor.wx$1.requestSubscribeMessage({
          tmplIds: [SUBSCRIBE_ID],
          complete() {
            request_apis_order.postSubmitOrder(form).then((res) => {
              common_vendor.index.__f__("log", "at pages/API/order/bangmai/bangmai.vue:523", res);
              common_vendor.index.requestPayment({
                timeStamp: res.data.timeStamp,
                // 时间戳
                nonceStr: res.data.nonceStr,
                // 随机字符串
                package: res.data.packageValue,
                signType: res.data.signType,
                // 签名算法
                paySign: res.data.paySign,
                // 签名
                success: function(response) {
                  common_vendor.index.__f__("log", "at pages/API/order/bangmai/bangmai.vue:531", "支付成功", response);
                  that.showSuccess("支付成功");
                  setTimeout(() => {
                    common_vendor.index.redirectTo({
                      url: "/pages/API/order/detail/detail?id=" + res.data.orderId
                    });
                  }, 1500);
                },
                fail: function(err) {
                  common_vendor.index.__f__("log", "at pages/API/order/bangmai/bangmai.vue:541", "支付失败", err);
                  that.showDanger("支付失败");
                  setTimeout(() => {
                    common_vendor.index.redirectTo({
                      url: "/pages/API/order/detail/detail?id=" + res.data.orderId
                    });
                  }, 1500);
                },
                complete() {
                  that.btnSubmitLoading = false;
                }
              });
            }).catch((err) => {
              that.showDanger(err);
            }).finally((res) => {
              that.btnSubmitLoading = false;
            });
          }
        });
      } else {
        common_vendor.wx$1.showModal({
          title: "提示",
          content: "请更新您微信版本，来获取订阅消息功能",
          showCancel: false
        });
      }
    },
    cacurlatePrice() {
      this.normalizeOrderAddress(this.submitForm.startAddress);
      this.normalizeOrderAddress(this.submitForm.endAddress);
      if (!this.hasCoordinate(this.submitForm.startAddress) || !this.hasCoordinate(this.submitForm.endAddress)) {
        this.pricingInfo = {};
        this.totalPrice = "--";
        return;
      }
      request_apis_order.postPricingEstimate({
        schoolId: this.submitForm.schoolId,
        serviceType: this.submitForm.serviceType,
        weight: this.submitForm.weight,
        volumeLengthCm: this.submitForm.volumeLengthCm,
        volumeWidthCm: this.submitForm.volumeWidthCm,
        volumeHeightCm: this.submitForm.volumeHeightCm,
        insuredAmount: this.submitForm.insuredAmount,
        additionalAmount: this.submitForm.additionalAmount,
        startAddress: this.submitForm.startAddress,
        endAddress: this.submitForm.endAddress
      }).then((res) => {
        const data = res.data || {};
        this.pricingInfo = data;
        this.routeInfo = {
          distanceM: data.distanceM,
          durationSec: data.durationSec,
          distanceText: data.distanceText,
          durationText: data.durationText,
          provider: data.routeProvider,
          routeType: data.routeType,
          fallbackUsed: data.fallbackUsed
        };
        this.totalPrice = data.payableAmount == null ? "--" : Number(data.payableAmount).toFixed(2);
      }).catch((err) => {
        this.pricingInfo = {};
        this.totalPrice = "--";
        this.showDanger(err || "计费失败");
      });
    },
    normalizeOrderAddress(address) {
      if (!address)
        return address;
      if (!address.lng && address.lon)
        address.lng = address.lon;
      if (!address.lon && address.lng)
        address.lon = address.lng;
      return address;
    },
    hasCoordinate(address) {
      return address && address.lat && (address.lng || address.lon);
    },
    getPickupAddress() {
      return this.hasCoordinate(this.submitForm.startAddress) ? this.submitForm.startAddress : this.submitForm.endAddress;
    },
    refreshNearbyRiderCount() {
      const pickupAddress = this.getPickupAddress();
      this.normalizeOrderAddress(pickupAddress);
      if (!this.hasCoordinate(pickupAddress)) {
        this.nearbyRiderInfo = {};
        return;
      }
      request_apis_order.getNearbyRiderCount({
        lng: pickupAddress.lng || pickupAddress.lon,
        lat: pickupAddress.lat
      }).then((res) => {
        const data = res.data || {};
        const count = data.nearbyRiderCount || 0;
        this.nearbyRiderInfo = {
          count,
          text: count > 0 ? `附近约${count}名骑手可接单` : "附近骑手较少，接单可能变慢"
        };
      }).catch(() => {
        this.nearbyRiderInfo = {};
      });
    },
    refreshRouteEstimate() {
      this.normalizeOrderAddress(this.submitForm.startAddress);
      this.normalizeOrderAddress(this.submitForm.endAddress);
      this.refreshNearbyRiderCount();
      if (!this.hasCoordinate(this.submitForm.startAddress) || !this.hasCoordinate(this.submitForm.endAddress)) {
        this.routeInfo = {};
        return;
      }
      request_apis_order.postRouteEstimate({
        startAddress: this.submitForm.startAddress,
        endAddress: this.submitForm.endAddress
      }).then((res) => {
        this.routeInfo = res.data || {};
        this.cacurlatePrice();
      }).catch(() => {
        this.routeInfo = {};
        this.cacurlatePrice();
      });
    },
    onGenderConfirm(e) {
      let item = e.selectedOptions[0];
      this.submitForm.gender = item.value;
      this.genderText = item.text;
      this.showGenderPopup = false;
    },
    onConfirmCancelTime(e) {
      let item = e.selectedOptions[0];
      this.submitForm.autoCancelTtl = item.value;
      this.autoCancelText = item.text;
      this.showCancelTimePopup = false;
    },
    formatAmount(value) {
      const amount = Number(value || 0);
      return Number.isNaN(amount) ? "0.00" : amount.toFixed(2);
    },
    formatKg(value) {
      const amount = Number(value || 0);
      return Number.isNaN(amount) ? "0.00" : amount.toFixed(2);
    },
    normalizeDecimal(value) {
      value = String(value == null ? "" : value);
      value = value.replace(/[^\d.]/g, "");
      value = value.replace(/\.{2,}/g, ".");
      value = value.replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");
      if (value.includes(".")) {
        const parts = value.split(".");
        value = `${parts[0]}.${parts[1].substring(0, 2)}`;
      }
      value = value.replace(/^0+(\d)/, "$1");
      if (value.startsWith("."))
        value = "0" + value;
      return value;
    },
    toNullableNumber(value) {
      const normalized = this.normalizeDecimal(value);
      return normalized === "" ? null : Number(normalized);
    },
    hasAnyVolume() {
      return Number(this.submitForm.volumeLengthCm || 0) > 0 || Number(this.submitForm.volumeWidthCm || 0) > 0 || Number(this.submitForm.volumeHeightCm || 0) > 0;
    },
    hasCompleteVolume() {
      return Number(this.submitForm.volumeLengthCm || 0) > 0 && Number(this.submitForm.volumeWidthCm || 0) > 0 && Number(this.submitForm.volumeHeightCm || 0) > 0;
    },
    requiresVolumeByTag(tagName = this.submitForm.tag) {
      const item = this.tagList.find((tag) => tag.name === tagName);
      return item && Number(item.sizeRequired) === 1;
    },
    validateItemSize() {
      if (this.hasAnyVolume() && !this.hasCompleteVolume()) {
        this.showWarning("物品尺寸需要完整填写长、宽、高");
        this.openVolumePopup();
        return false;
      }
      if (this.requiresVolumeByTag() && !this.hasCompleteVolume()) {
        this.showWarning("该物品类型需要填写长、宽、高");
        this.openVolumePopup();
        return false;
      }
      return true;
    },
    toPrice(value) {
      return this.normalizeDecimal(value);
    },
    openVolumePopup() {
      this.currVolumeLengthCm = this.submitForm.volumeLengthCm || "";
      this.currVolumeWidthCm = this.submitForm.volumeWidthCm || "";
      this.currVolumeHeightCm = this.submitForm.volumeHeightCm || "";
      this.showVolumePopup = true;
    },
    openInsuredPopup() {
      this.currInsuredAmount = this.submitForm.insuredAmount || 0;
      this.showInsuredPopup = true;
    },
    onConfirmVolume() {
      this.submitForm.volumeLengthCm = this.toNullableNumber(this.currVolumeLengthCm);
      this.submitForm.volumeWidthCm = this.toNullableNumber(this.currVolumeWidthCm);
      this.submitForm.volumeHeightCm = this.toNullableNumber(this.currVolumeHeightCm);
      this.showVolumePopup = false;
      this.cacurlatePrice();
    },
    onConfirmInsured() {
      const value = this.normalizeDecimal(this.currInsuredAmount);
      this.submitForm.insuredAmount = value === "" ? 0 : Number(value);
      this.currInsuredAmount = this.submitForm.insuredAmount;
      this.showInsuredPopup = false;
      this.cacurlatePrice();
    },
    onConfimEstimatedPrice() {
      let value = this.currEstimatedPrice;
      value = this.toPrice(value);
      this.submitForm.estimatedPrice = value;
      this.currEstimatedPrice = value;
      this.cacurlatePrice();
      this.showPricePopup = false;
    },
    onConfimAttachMoney() {
      let value = this.currAttachMoney;
      value = this.toPrice(value);
      this.submitForm.additionalAmount = value;
      this.currAttachMoney = value;
      this.cacurlatePrice();
      this.showMoneyPopup = false;
    },
    onTimedConfirm(e) {
      common_vendor.index.__f__("log", "at pages/API/order/bangmai/bangmai.vue:776", e);
      let day = e.selectedOptions[2].value;
      let hour = e.selectedOptions[3].value;
      let minute = e.selectedOptions[4].value;
      this.submitForm.isTimed = 1;
      this.submitForm.specifiedTime = this.parseLocalDateTime(this.currentDate);
      this.specifiedTimeText = day + "日 " + hour + ":" + minute;
      this.showDatePopup = false;
    },
    parseLocalDateTime(date) {
      const localDateTime = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0") + " " + String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0") + ":" + String(date.getSeconds()).padStart(2, "0");
      return localDateTime;
    },
    onTimedCancel() {
      this.submitForm.isTimed = 0;
      this.submitForm.specifiedTime = null;
      this.specifiedTimeText = "尽快配送";
      this.showDatePopup = false;
    },
    confirmTag() {
      if (this.activeTagIndex < 0) {
        this.showServiceTypePopup = false;
        this.cacurlatePrice();
        return;
      }
      if (this.activeTagIndex == this.tagList.length - 1 && this.submitForm.tag == "") {
        this.showWarning("请先输入物品类型");
        return;
      }
      if (this.activeTagIndex != this.tagList.length - 1) {
        const selectedTag = this.tagList[this.activeTagIndex];
        this.submitForm.tag = selectedTag.name;
      }
      this.showServiceTypePopup = false;
      if (this.requiresVolumeByTag() && !this.hasCompleteVolume()) {
        this.showWarning("该物品类型需要填写尺寸");
        this.openVolumePopup();
        return;
      }
      this.cacurlatePrice();
    },
    setActiveTag(index) {
      this.activeTagIndex = index;
      this.tagRemark = this.tagList[index].remark;
    },
    initData() {
      this.currSchool = this.$store.state.currSchool;
      this.submitForm.schoolId = this.currSchool.id;
    },
    updateAddress(data, type) {
      if (type == "start") {
        this.submitForm.startAddress = data;
      } else if (type == "end") {
        this.submitForm.endAddress = data;
      }
      this.refreshRouteEstimate();
    },
    showStartAddresses() {
      this.showStartAddressPopup = true;
    },
    showEndAddresses() {
      this.showEndAddressPopup = true;
    },
    toAddAddress(type) {
      let data = null;
      if (type == "start") {
        data = JSON.stringify(this.submitForm.startAddress);
      } else {
        data = JSON.stringify(this.submitForm.endAddress);
      }
      common_vendor.index.navigateTo({
        url: "/pages/API/address/add/add?data=" + data + "&type=" + type
      });
    },
    selectedStartAddress(prevExistAdd, nowExistAdd, arr) {
      if (nowExistAdd.provinceName + nowExistAdd.addressDetail == this.submitForm.endAddress.title + "-" + this.submitForm.endAddress.detail) {
        this.showWarning("取送地址不能相同");
        return;
      }
      this.submitForm.startAddress = {
        id: nowExistAdd.id,
        name: nowExistAdd.name,
        phone: nowExistAdd.phone,
        title: nowExistAdd.provinceName,
        detail: nowExistAdd.addressDetail.startsWith("-") ? nowExistAdd.addressDetail.slice(1) : nowExistAdd.addressDetail,
        lat: nowExistAdd.lat,
        lon: nowExistAdd.lon,
        lng: nowExistAdd.lon
      };
      this.refreshRouteEstimate();
    },
    selectedEndAddress(prevExistAdd, nowExistAdd, arr) {
      if (nowExistAdd.provinceName + nowExistAdd.addressDetail == this.submitForm.startAddress.title + "-" + this.submitForm.startAddress.detail) {
        this.showWarning("取送地址不能相同");
        return;
      }
      this.submitForm.endAddress = {
        name: nowExistAdd.name,
        phone: nowExistAdd.phone,
        title: nowExistAdd.provinceName,
        detail: nowExistAdd.addressDetail.startsWith("-") ? nowExistAdd.addressDetail.slice(1) : nowExistAdd.addressDetail,
        lat: nowExistAdd.lat,
        lon: nowExistAdd.lon,
        lng: nowExistAdd.lon
      };
      this.refreshRouteEstimate();
    },
    getTags() {
      request_apis_tag.getListTag({
        schoolId: this.currSchool.id,
        serviceType: this.submitForm.serviceType
      }).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/bangmai/bangmai.vue:898", res);
        this.tagList.unshift(...res.data);
      }).catch((err) => {
        this.showDanger(err);
      });
    },
    getAddresses() {
      request_apis_address.getListAddress({ pageNum: 1, pageSize: 20 }).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/bangmai/bangmai.vue:906", res);
        let rows = res.data;
        this.startAddressList = this.mapFields(rows);
        this.endAddressList = this.mapFields(rows);
      }).catch((err) => {
        this.showDanger(err);
      });
    },
    fileClick(file) {
      file = file.fileItem;
      common_vendor.index.__f__("log", "at pages/API/order/bangmai/bangmai.vue:916", file);
      let imgsArray = [];
      imgsArray[0] = file.url;
      common_vendor.index.previewImage({
        current: 0,
        urls: imgsArray
      });
    },
    oversize(files) {
      common_vendor.index.__f__("log", "at pages/API/order/bangmai/bangmai.vue:925", files);
      this.showWarning("文件大小超出5MB");
    },
    uploadDelete(e) {
      let index = e.index;
      this.ossList.splice(index, 1);
    },
    uploadSuccess(e) {
      let data = e.data.data;
      data = JSON.parse(data);
      let ossId = data.data.ossId;
      this.ossList.push(ossId);
    },
    onWeightChange(e) {
      common_vendor.index.__f__("log", "at pages/API/order/bangmai/bangmai.vue:939", e);
      if (e == 2) {
        this.submitForm.weight = "小于2KG";
      } else if (e == 20) {
        this.submitForm.weight = "大于20KG";
      } else {
        this.submitForm.weight = e + "KG左右";
      }
      this.cacurlatePrice();
    },
    showDatePopupClick() {
      this.initDate();
      this.showDatePopup = true;
    },
    initDate() {
      const now = /* @__PURE__ */ new Date();
      const currentMinutes = now.getMinutes();
      const roundedMinutes = Math.ceil(currentMinutes / 15) * 15;
      if (roundedMinutes >= 60) {
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);
      } else {
        now.setMinutes(roundedMinutes);
      }
      this.currentDate = now;
      this.minDate = now;
      const max = /* @__PURE__ */ new Date();
      max.setDate(max.getDate() + 7);
      this.maxDate = max;
    },
    mapFields(data) {
      return data.map((formData) => ({
        id: formData.id,
        addressDetail: "-" + formData.detail,
        cityName: "",
        // 默认值为空
        countyName: "",
        // 默认值为空
        provinceName: formData.title,
        selectedAddress: false,
        townName: "",
        // 默认值为空
        name: formData.name,
        phone: formData.phone,
        lat: formData.lat,
        lon: formData.lon
      }));
    }
  }
};
if (!Array) {
  const _easycom_nut_notify2 = common_vendor.resolveComponent("nut-notify");
  const _component_template = common_vendor.resolveComponent("template");
  const _easycom_nut_button2 = common_vendor.resolveComponent("nut-button");
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_tab_pane2 = common_vendor.resolveComponent("nut-tab-pane");
  const _easycom_nut_tabs2 = common_vendor.resolveComponent("nut-tabs");
  const _easycom_nut_textarea2 = common_vendor.resolveComponent("nut-textarea");
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_picker2 = common_vendor.resolveComponent("nut-picker");
  const _easycom_nut_popup2 = common_vendor.resolveComponent("nut-popup");
  const _easycom_nut_date_picker2 = common_vendor.resolveComponent("nut-date-picker");
  const _easycom_nut_tag2 = common_vendor.resolveComponent("nut-tag");
  const _easycom_nut_input2 = common_vendor.resolveComponent("nut-input");
  const _easycom_nut_range2 = common_vendor.resolveComponent("nut-range");
  const _easycom_nut_uploader2 = common_vendor.resolveComponent("nut-uploader");
  const _easycom_nut_address2 = common_vendor.resolveComponent("nut-address");
  (_easycom_nut_notify2 + _component_template + _easycom_nut_button2 + _easycom_nut_cell2 + _easycom_nut_tab_pane2 + _easycom_nut_tabs2 + _easycom_nut_textarea2 + _easycom_nut_icon2 + _easycom_nut_picker2 + _easycom_nut_popup2 + _easycom_nut_date_picker2 + _easycom_nut_tag2 + _easycom_nut_input2 + _easycom_nut_range2 + _easycom_nut_uploader2 + _easycom_nut_address2)();
}
const _easycom_nut_notify = () => "../../../../node-modules/nutui-uniapp/components/notify/notify.js";
const _easycom_nut_button = () => "../../../../node-modules/nutui-uniapp/components/button/button.js";
const _easycom_nut_cell = () => "../../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_tab_pane = () => "../../../../node-modules/nutui-uniapp/components/tabpane/tabpane.js";
const _easycom_nut_tabs = () => "../../../../node-modules/nutui-uniapp/components/tabs/tabs.js";
const _easycom_nut_textarea = () => "../../../../node-modules/nutui-uniapp/components/textarea/textarea.js";
const _easycom_nut_icon = () => "../../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_picker = () => "../../../../node-modules/nutui-uniapp/components/picker/picker.js";
const _easycom_nut_popup = () => "../../../../node-modules/nutui-uniapp/components/popup/popup.js";
const _easycom_nut_date_picker = () => "../../../../node-modules/nutui-uniapp/components/datepicker/datepicker.js";
const _easycom_nut_tag = () => "../../../../node-modules/nutui-uniapp/components/tag/tag.js";
const _easycom_nut_input = () => "../../../../node-modules/nutui-uniapp/components/input/input.js";
const _easycom_nut_range = () => "../../../../node-modules/nutui-uniapp/components/range/range.js";
const _easycom_nut_uploader = () => "../../../../node-modules/nutui-uniapp/components/uploader/uploader.js";
const _easycom_nut_address = () => "../../../../node-modules/nutui-uniapp/components/address/address.js";
if (!Math) {
  (_easycom_nut_notify + _easycom_nut_button + _easycom_nut_cell + _easycom_nut_tab_pane + _easycom_nut_tabs + _easycom_nut_textarea + _easycom_nut_icon + _easycom_nut_picker + _easycom_nut_popup + _easycom_nut_date_picker + _easycom_nut_tag + _easycom_nut_input + _easycom_nut_range + _easycom_nut_uploader + _easycom_nut_address)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: common_vendor.o($options.showStartAddresses, "be"),
    c: common_vendor.p({
      size: "mini",
      type: "primary"
    }),
    d: common_vendor.o(($event) => $options.toAddAddress("start"), "0c"),
    e: common_vendor.p({
      title: "起点  " + $data.submitForm.startAddress.title + " " + $data.submitForm.startAddress.detail,
      ["sub-title"]: $data.submitForm.startAddress.name + " " + $data.submitForm.startAddress.phone
    }),
    f: common_assets._imports_1,
    g: common_vendor.o(($event) => $options.showEndAddresses($event), "d9"),
    h: common_vendor.p({
      size: "mini",
      type: "primary"
    }),
    i: common_vendor.o(($event) => $options.toAddAddress("end"), "96"),
    j: common_vendor.p({
      title: "终点  " + $data.submitForm.endAddress.title + " " + $data.submitForm.endAddress.detail,
      ["sub-title"]: $data.submitForm.endAddress.name + " " + $data.submitForm.endAddress.phone
    }),
    k: common_vendor.p({
      title: "指定地点"
    }),
    l: common_assets._imports_0,
    m: common_vendor.p({
      title: "跑腿员将在周边合适地点购买"
    }),
    n: common_assets._imports_1,
    o: common_vendor.o(($event) => $options.showEndAddresses($event), "12"),
    p: common_vendor.p({
      size: "mini",
      type: "primary"
    }),
    q: common_vendor.o(($event) => $options.toAddAddress("end"), "a5"),
    r: common_vendor.p({
      title: "终点  " + $data.submitForm.endAddress.title + " " + $data.submitForm.endAddress.detail,
      ["sub-title"]: $data.submitForm.endAddress.name + " " + $data.submitForm.endAddress.phone
    }),
    s: common_vendor.p({
      title: "就近购买"
    }),
    t: common_vendor.o(($event) => $data.tabValue = $event, "92"),
    v: common_vendor.p({
      ["animated-time"]: "0",
      background: "linear-gradient(180deg, rgb(220 240 255) 0%, rgba(255,255,255,1) 100%);",
      modelValue: $data.tabValue
    }),
    w: $data.nearbyRiderInfo.text
  }, $data.nearbyRiderInfo.text ? {
    x: common_vendor.p({
      title: "附近骑手",
      desc: $data.nearbyRiderInfo.text
    })
  } : {}, {
    y: common_vendor.o($options.showDatePopupClick, "db"),
    z: common_vendor.p({
      ["is-link"]: true,
      title: "配送时间",
      desc: $data.specifiedTimeText
    }),
    A: common_vendor.o(($event) => $data.showGenderPopup = true, "52"),
    B: common_vendor.p({
      ["is-link"]: true,
      title: "性别限制",
      desc: $data.genderText
    }),
    C: common_assets._imports_1$1,
    D: common_vendor.o(($event) => $data.showServiceTypePopup = true, "0a"),
    E: common_vendor.p({
      ["is-link"]: true,
      title: "物品类型",
      desc: $data.submitForm.tag == "" ? "" : $data.submitForm.tag + "-" + $data.submitForm.weight
    }),
    F: common_vendor.o(($event) => $data.showServiceTypePopup = true, "5d"),
    G: common_vendor.p({
      ["is-link"]: true,
      title: "计费重量",
      desc: $options.weightText
    }),
    H: common_vendor.o($options.openVolumePopup, "6e"),
    I: common_vendor.p({
      ["is-link"]: true,
      title: "物品尺寸",
      desc: $options.volumeSizeText
    }),
    J: common_vendor.o($options.openInsuredPopup, "a9"),
    K: common_vendor.p({
      ["is-link"]: true,
      title: "保价金额",
      desc: $options.insuredAmountText
    }),
    L: common_vendor.o(($event) => $data.submitForm.detail = $event, "3a"),
    M: common_vendor.p({
      placeholder: "请输入详细描述",
      ["limit-show"]: true,
      ["max-length"]: "100",
      modelValue: $data.submitForm.detail
    }),
    N: common_vendor.p({
      name: "/static/icons/添加图片.png"
    }),
    O: common_vendor.o(($event) => $data.showImagePopup = true, "82"),
    P: common_assets._imports_2$1,
    Q: common_vendor.o(($event) => $data.showMoneyPopup = true, "1e"),
    R: common_vendor.p({
      ["is-link"]: true,
      title: "追加金额",
      desc: $data.submitForm.additionalAmount
    }),
    S: common_vendor.o(($event) => $data.showPricePopup = true, "7a"),
    T: common_vendor.p({
      ["is-link"]: true,
      title: "商品预估价格",
      desc: $data.submitForm.estimatedPrice
    }),
    U: common_vendor.o(($event) => $data.showCancelTimePopup = true, "f2"),
    V: common_vendor.p({
      ["is-link"]: true,
      title: "自动取消",
      desc: $data.autoCancelText
    }),
    W: common_assets._imports_3$1,
    X: common_vendor.p({
      title: "支付方式",
      desc: "微信支付"
    }),
    Y: $options.hasPricingInfo
  }, $options.hasPricingInfo ? common_vendor.e({
    Z: $data.routeInfo.distanceText
  }, $data.routeInfo.distanceText ? {
    aa: common_vendor.t($data.routeInfo.distanceText),
    ab: common_vendor.t($data.routeInfo.durationText)
  } : {}, {
    ac: common_vendor.t($options.formatKg($data.pricingInfo.actualWeightKg)),
    ad: common_vendor.t($options.formatKg($data.pricingInfo.volumeWeightKg)),
    ae: common_vendor.t($options.formatKg($data.pricingInfo.chargeWeightKg)),
    af: common_vendor.f($options.priceItems, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: item.remark
      }, item.remark ? {
        c: common_vendor.t(item.remark)
      } : {}, {
        d: common_vendor.t($options.formatAmount(item.amount)),
        e: index
      });
    }),
    ag: common_vendor.t($options.formatAmount($data.pricingInfo.payableAmount))
  }) : {}, {
    ah: common_vendor.t($data.totalPrice),
    ai: $data.routeInfo.distanceText
  }, $data.routeInfo.distanceText ? {
    aj: common_vendor.t($data.routeInfo.distanceText),
    ak: common_vendor.t($data.routeInfo.durationText)
  } : {}, {
    al: $data.btnSubmitLoading,
    am: common_vendor.o((...args) => $options.submitOrder && $options.submitOrder(...args), "c3"),
    an: common_vendor.o(($event) => $data.showGenderPopup = false, "b2"),
    ao: common_vendor.o($options.onGenderConfirm, "72"),
    ap: common_vendor.p({
      columns: $data.genderData,
      title: "性别限制"
    }),
    aq: common_vendor.o(($event) => $data.showGenderPopup = $event, "58"),
    ar: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showGenderPopup
    }),
    as: common_vendor.o($options.onTimedConfirm, "42"),
    at: common_vendor.o($options.onTimedCancel, "e3"),
    av: common_vendor.o(($event) => $data.currentDate = $event, "aa"),
    aw: common_vendor.p({
      ["min-date"]: $data.minDate,
      ["max-date"]: $data.maxDate,
      type: "datetime",
      ["minute-step"]: 15,
      ["is-show-chinese"]: true,
      ["ok-text"]: "指定时间",
      ["cancel-text"]: "尽快配送",
      modelValue: $data.currentDate
    }),
    ax: common_vendor.o(($event) => $data.showDatePopup = $event, "df"),
    ay: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showDatePopup
    }),
    az: common_vendor.o((...args) => $options.confirmTag && $options.confirmTag(...args), "98"),
    aA: common_vendor.f($data.tagList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(Number(item.sizeRequired) === 1 ? " 需尺寸" : ""),
        c: index,
        d: common_vendor.o(($event) => $options.setActiveTag(index), index),
        e: "247f922b-29-" + i0 + ",247f922b-28",
        f: common_vendor.p({
          ["custom-color"]: "#fa2400",
          plain: index === $data.activeTagIndex ? false : true
        })
      };
    }),
    aB: common_vendor.t($data.tagRemark),
    aC: $data.tagRemark != "",
    aD: $options.selectedTagRequiresSize
  }, $options.selectedTagRequiresSize ? {} : {}, {
    aE: common_vendor.o(($event) => $data.submitForm.tag = $event, "1e"),
    aF: common_vendor.p({
      placeholder: "其它",
      ["max-length"]: "8",
      ["show-word-limit"]: true,
      modelValue: $data.submitForm.tag
    }),
    aG: $data.activeTagIndex == $data.tagList.length - 1,
    aH: common_vendor.t($data.submitForm.weight),
    aI: common_vendor.o($options.onWeightChange, "ca"),
    aJ: common_vendor.o(($event) => $data.rangeValue = $event, "9f"),
    aK: common_vendor.p({
      max: 20,
      min: 2,
      modelValue: $data.rangeValue
    }),
    aL: common_vendor.o(($event) => $data.showServiceTypePopup = $event, "ac"),
    aM: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showServiceTypePopup
    }),
    aN: common_vendor.o($options.fileClick, "59"),
    aO: common_vendor.o($options.uploadSuccess, "98"),
    aP: common_vendor.o($options.uploadDelete, "55"),
    aQ: common_vendor.o($options.oversize, "1d"),
    aR: common_vendor.p({
      headers: $data.headers,
      data: $data.uploaderData,
      maximize: 5242880,
      name: "file",
      maximum: "5",
      url: $data.uploadUrl
    }),
    aS: common_vendor.o(($event) => $data.showImagePopup = $event, "48"),
    aT: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showImagePopup
    }),
    aU: common_vendor.p({
      name: "/static/icons/RMB.png"
    }),
    aV: common_vendor.o($options.onConfimAttachMoney, "31"),
    aW: common_vendor.p({
      type: "primary",
      size: "small"
    }),
    aX: common_vendor.o(($event) => $data.currAttachMoney = $event, "9c"),
    aY: common_vendor.p({
      type: "digit",
      modelValue: $data.currAttachMoney
    }),
    aZ: common_vendor.o(($event) => $data.showMoneyPopup = $event, "84"),
    ba: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showMoneyPopup
    }),
    bb: common_vendor.p({
      name: "/static/icons/RMB.png"
    }),
    bc: common_vendor.o($options.onConfimEstimatedPrice, "69"),
    bd: common_vendor.p({
      type: "primary",
      size: "small"
    }),
    be: common_vendor.o(($event) => $data.currEstimatedPrice = $event, "1f"),
    bf: common_vendor.p({
      type: "digit",
      modelValue: $data.currEstimatedPrice
    }),
    bg: common_vendor.o(($event) => $data.showPricePopup = $event, "36"),
    bh: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showPricePopup
    }),
    bi: common_vendor.o(($event) => $data.currVolumeLengthCm = $event, "bc"),
    bj: common_vendor.p({
      type: "digit",
      placeholder: "长(cm)",
      modelValue: $data.currVolumeLengthCm
    }),
    bk: common_vendor.o(($event) => $data.currVolumeWidthCm = $event, "3b"),
    bl: common_vendor.p({
      type: "digit",
      placeholder: "宽(cm)",
      modelValue: $data.currVolumeWidthCm
    }),
    bm: common_vendor.o(($event) => $data.currVolumeHeightCm = $event, "22"),
    bn: common_vendor.p({
      type: "digit",
      placeholder: "高(cm)",
      modelValue: $data.currVolumeHeightCm
    }),
    bo: common_vendor.o($options.onConfirmVolume, "9a"),
    bp: common_vendor.p({
      block: true,
      type: "primary"
    }),
    bq: common_vendor.o(($event) => $data.showVolumePopup = $event, "e1"),
    br: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showVolumePopup
    }),
    bs: common_vendor.p({
      name: "/static/icons/RMB.png"
    }),
    bt: common_vendor.o(($event) => $data.currInsuredAmount = $event, "7e"),
    bv: common_vendor.p({
      type: "digit",
      placeholder: "不保价可填0",
      modelValue: $data.currInsuredAmount
    }),
    bw: common_vendor.o($options.onConfirmInsured, "57"),
    bx: common_vendor.p({
      block: true,
      type: "primary"
    }),
    by: common_vendor.o(($event) => $data.showInsuredPopup = $event, "d8"),
    bz: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showInsuredPopup
    }),
    bA: common_vendor.o($options.onConfirmCancelTime, "0f"),
    bB: common_vendor.o(($event) => $data.showCancelTimePopup = false, "6a"),
    bC: common_vendor.p({
      columns: $data.cancelTimes,
      title: "未接单自动取消"
    }),
    bD: common_vendor.o(($event) => $data.showCancelTimePopup = $event, "3b"),
    bE: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showCancelTimePopup
    }),
    bF: common_vendor.o($options.selectedStartAddress, "82"),
    bG: common_vendor.o(($event) => $data.showStartAddressPopup = $event, "01"),
    bH: common_vendor.p({
      type: "exist",
      ["exist-address"]: $data.startAddressList,
      ["is-show-custom-address"]: false,
      ["exist-address-title"]: "取货地址",
      visible: $data.showStartAddressPopup
    }),
    bI: common_vendor.o($options.selectedEndAddress, "d6"),
    bJ: common_vendor.o(($event) => $data.showEndAddressPopup = $event, "02"),
    bK: common_vendor.p({
      type: "exist",
      ["exist-address"]: $data.endAddressList,
      ["is-show-custom-address"]: false,
      ["exist-address-title"]: "送货地址",
      visible: $data.showEndAddressPopup
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/order/bangmai/bangmai.js.map

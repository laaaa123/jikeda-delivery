"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_apis_region = require("../../../../request/apis/region.js");
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
      btnLoading: false,
      tabValue: 0,
      showPopup: false,
      province: [],
      city: [
        {
          "name": "",
          "id": 1
        }
      ],
      country: [],
      town: [],
      currSchool: null,
      submitForm: {
        "title": null,
        "detail": null,
        "lon": null,
        "lat": null,
        "name": null,
        "phone": null,
        "isDefault": false
      },
      userInfo: null
    };
  },
  onLoad(options) {
    this.currSchool = this.$store.state.currSchool;
    this.initData(options);
  },
  onReachBottom() {
  },
  methods: {
    editAddress() {
      let form = this.submitForm;
      if (!form || !form.detail || !form.title || !form.lat || !form.name || !form.phone) {
        this.showWarning("请填写完整");
        return;
      }
      form.isDefault = form.isDefault ? 1 : 0;
      this.btnLoading = true;
      request_apis_address.putEditAddress(form).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/address/edit/edit.vue:139", res);
        form.isDefault = form.isDefault == 1 ? true : false;
        this.showSuccess("修改成功");
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        this.btnLoading = false;
      });
    },
    initData(options) {
      let that = this;
      this.userInfo = this.$store.state.userInfo;
      request_apis_address.getAddressById(options.addressId).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/address/edit/edit.vue:157", res);
        let address = res.data;
        that.submitForm = address;
        that.submitForm.isDefault = address.isDefault == 1 ? true : false;
      }).catch((err) => {
        this.showDanger(err);
      });
    },
    chooseLocation() {
      let that = this;
      common_vendor.index.chooseLocation({
        ...this.getChooseLocationOptions(),
        success(res) {
          common_vendor.index.__f__("log", "at pages/API/address/edit/edit.vue:171", res);
          that.submitForm.title = res.name;
          that.submitForm.lat = res.latitude;
          that.submitForm.lon = res.longitude;
          that.submitForm.lng = res.longitude;
        },
        fail(e) {
          common_vendor.index.__f__("log", "at pages/API/address/edit/edit.vue:178", e);
        }
      });
    },
    getChooseLocationOptions() {
      const currentCity = this.$store.state.currentCity || common_vendor.index.getStorageSync("currentCity") || {};
      const currentLocation = this.$store.state.currentLocation || common_vendor.index.getStorageSync("currentLocation") || {};
      const useCurrentLocation = currentCity.manualSelected !== true;
      const lat = this.submitForm.lat || (useCurrentLocation ? currentLocation.latitude : null) || currentCity.centerLat;
      const lng = this.submitForm.lng || this.submitForm.lon || (useCurrentLocation ? currentLocation.longitude : null) || currentCity.centerLng;
      const options = {};
      if (lat && lng) {
        options.latitude = Number(lat);
        options.longitude = Number(lng);
      }
      return options;
    },
    addressClose(e) {
      common_vendor.index.__f__("log", "at pages/API/address/edit/edit.vue:196", e);
      e.data.addressStr;
      let region1 = e.data.province.name;
      let region2 = e.data.city.name;
      let lat = e.data.city.lat;
      let lon = e.data.city.lon;
      this.submitForm.title = region1 + "-" + region2;
      this.submitForm.lat = lat;
      this.submitForm.lon = lon;
    },
    addressChange(e) {
      common_vendor.index.__f__("log", "at pages/API/address/edit/edit.vue:207", e);
      if (e.value.type == 0) {
        this.queryRegionChildren(e.value.id);
      }
    },
    showRegion() {
      this.showPopup = !this.showPopup;
      this.queryRegion();
    },
    queryRegion() {
      request_apis_region.listRegion({
        schoolId: this.currSchool.id,
        type: 0,
        parentId: null
      }).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/address/edit/edit.vue:222", res);
        this.province = res.data;
      });
    },
    queryRegionChildren(parentId) {
      request_apis_region.listRegion({
        schoolId: this.currSchool.id,
        type: 1,
        parentId
      }).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/address/edit/edit.vue:232", res);
        this.city = res.data;
      });
    }
  }
};
if (!Array) {
  const _easycom_nut_notify2 = common_vendor.resolveComponent("nut-notify");
  const _component_template = common_vendor.resolveComponent("template");
  const _easycom_nut_input2 = common_vendor.resolveComponent("nut-input");
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_tab_pane2 = common_vendor.resolveComponent("nut-tab-pane");
  const _easycom_nut_tabs2 = common_vendor.resolveComponent("nut-tabs");
  const _easycom_nut_checkbox2 = common_vendor.resolveComponent("nut-checkbox");
  const _easycom_nut_button2 = common_vendor.resolveComponent("nut-button");
  const _easycom_nut_address2 = common_vendor.resolveComponent("nut-address");
  const _easycom_nut_safe_area2 = common_vendor.resolveComponent("nut-safe-area");
  (_easycom_nut_notify2 + _component_template + _easycom_nut_input2 + _easycom_nut_cell2 + _easycom_nut_tab_pane2 + _easycom_nut_tabs2 + _easycom_nut_checkbox2 + _easycom_nut_button2 + _easycom_nut_address2 + _easycom_nut_safe_area2)();
}
const _easycom_nut_notify = () => "../../../../node-modules/nutui-uniapp/components/notify/notify.js";
const _easycom_nut_input = () => "../../../../node-modules/nutui-uniapp/components/input/input.js";
const _easycom_nut_cell = () => "../../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_tab_pane = () => "../../../../node-modules/nutui-uniapp/components/tabpane/tabpane.js";
const _easycom_nut_tabs = () => "../../../../node-modules/nutui-uniapp/components/tabs/tabs.js";
const _easycom_nut_checkbox = () => "../../../../node-modules/nutui-uniapp/components/checkbox/checkbox.js";
const _easycom_nut_button = () => "../../../../node-modules/nutui-uniapp/components/button/button.js";
const _easycom_nut_address = () => "../../../../node-modules/nutui-uniapp/components/address/address.js";
const _easycom_nut_safe_area = () => "../../../../node-modules/nutui-uniapp/components/safearea/safearea.js";
if (!Math) {
  (_easycom_nut_notify + _easycom_nut_input + _easycom_nut_cell + _easycom_nut_tab_pane + _easycom_nut_tabs + _easycom_nut_checkbox + _easycom_nut_button + _easycom_nut_address + _easycom_nut_safe_area)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$3,
    b: common_vendor.o(($event) => $data.submitForm.name = $event, "fa"),
    c: common_vendor.p({
      placeholder: "输入框无边框",
      border: false,
      modelValue: $data.submitForm.name
    }),
    d: common_vendor.p({
      title: "姓名"
    }),
    e: common_assets._imports_1$2,
    f: common_vendor.o(($event) => $data.submitForm.phone = $event, "80"),
    g: common_vendor.p({
      placeholder: "输入框无边框",
      border: false,
      modelValue: $data.submitForm.phone
    }),
    h: common_vendor.p({
      title: "手机号"
    }),
    i: common_vendor.o($options.showRegion, "dc"),
    j: common_vendor.p({
      ["is-link"]: true,
      title: "选择地点",
      desc: $data.submitForm.title
    }),
    k: common_vendor.o(($event) => $data.submitForm.detail = $event, "71"),
    l: common_vendor.p({
      placeholder: "输入框无边框",
      border: false,
      modelValue: $data.submitForm.detail
    }),
    m: common_vendor.p({
      title: "详细地址"
    }),
    n: common_vendor.p({
      title: "快捷地址"
    }),
    o: common_vendor.o($options.chooseLocation, "b7"),
    p: common_vendor.p({
      ["is-link"]: true,
      title: "选择地点",
      desc: $data.submitForm.title
    }),
    q: common_vendor.o(($event) => $data.submitForm.detail = $event, "d7"),
    r: common_vendor.p({
      placeholder: "输入框无边框",
      border: false,
      modelValue: $data.submitForm.detail
    }),
    s: common_vendor.p({
      title: "详细地址"
    }),
    t: common_vendor.p({
      title: "自选地址"
    }),
    v: common_vendor.o(($event) => $data.tabValue = $event, "fa"),
    w: common_vendor.p({
      background: "linear-gradient(180deg, rgb(220 240 255) 0%, rgba(255,255,255,1) 100%);",
      modelValue: $data.tabValue
    }),
    x: common_vendor.o(_ctx.test, "06"),
    y: common_vendor.o(($event) => $data.submitForm.isDefault = $event, "59"),
    z: common_vendor.p({
      modelValue: $data.submitForm.isDefault
    }),
    A: common_vendor.o($options.editAddress, "ae"),
    B: common_vendor.p({
      loading: $data.btnLoading,
      block: true,
      type: "info"
    }),
    C: common_vendor.o($options.addressChange, "7d"),
    D: common_vendor.o($options.addressClose, "07"),
    E: common_vendor.o(($event) => $data.showPopup = $event, "ee"),
    F: common_vendor.p({
      province: $data.province,
      city: $data.city,
      country: $data.country,
      town: $data.town,
      ["custom-address-title"]: "请选择所在地区",
      visible: $data.showPopup
    }),
    G: common_vendor.p({
      position: "bottom"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/address/edit/edit.js.map

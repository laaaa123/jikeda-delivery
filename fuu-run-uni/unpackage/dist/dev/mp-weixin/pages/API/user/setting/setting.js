"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_assets = require("../../../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      pop: false,
      orderDefaultShow: ""
    };
  },
  onLoad() {
    this.orderDefaultShow = common_vendor.index.getStorageSync("orderDefaultShow");
  },
  onShow() {
  },
  methods: {
    toAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/API/user/setting/agreement/agreement"
      });
    },
    showSelectOrder() {
      let that = this;
      common_vendor.wx$1.showActionSheet({
        itemList: ["我的发布", "我的接单"],
        //按钮的文字数组，数组长度最大为 6
        success(res) {
          common_vendor.index.__f__("log", "at pages/API/user/setting/setting.vue:48", res);
          common_vendor.index.setStorageSync("orderDefaultShow", res.tapIndex == 0 ? "我的发布" : "我的接单");
          that.orderDefaultShow = res.tapIndex == 0 ? "我的发布" : "我的接单";
        },
        fail(res) {
          common_vendor.index.__f__("log", "at pages/API/user/setting/setting.vue:53", res.errMsg);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.orderDefaultShow),
    b: common_assets._imports_0$1,
    c: common_vendor.o((...args) => $options.showSelectOrder && $options.showSelectOrder(...args), "18"),
    d: common_assets._imports_0$1,
    e: common_vendor.o((...args) => $options.toAgreement && $options.toAgreement(...args), "0b")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/user/setting/setting.js.map

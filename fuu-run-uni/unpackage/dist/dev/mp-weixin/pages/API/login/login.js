"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  onLoad() {
    this.$root.login();
  }
};
if (!Array) {
  const _easycom_nut_loading_page2 = common_vendor.resolveComponent("nut-loading-page");
  _easycom_nut_loading_page2();
}
const _easycom_nut_loading_page = () => "../../../node-modules/nutui-uniapp/components/loadingpage/loadingpage.js";
if (!Math) {
  _easycom_nut_loading_page();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      loading: true,
      ["loading-text"]: "登陆中"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/API/login/login.js.map

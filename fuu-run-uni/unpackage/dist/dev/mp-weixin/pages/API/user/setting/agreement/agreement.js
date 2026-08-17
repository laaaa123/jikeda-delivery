"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const request_apis_login = require("../../../../../request/apis/login.js");
const _sfc_main = {
  data() {
    return {
      html: ``
    };
  },
  onLoad() {
    request_apis_login.getAgreement().then((res) => {
      common_vendor.index.__f__("log", "at pages/API/user/setting/agreement/agreement.vue:19", res);
      this.html = res.data;
    });
  },
  onShow() {
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.html
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/API/user/setting/agreement/agreement.js.map

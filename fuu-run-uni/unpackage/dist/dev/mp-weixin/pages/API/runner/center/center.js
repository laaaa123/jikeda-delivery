"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_apis_payment = require("../../../../request/apis/payment.js");
const request_apis_login = require("../../../../request/apis/login.js");
const _sfc_main = {
  data() {
    return {
      creditScore: 100,
      todayEarnings: "0.00",
      totalEarnings: "0.00",
      todayOrders: 0,
      totalOrders: 0,
      wallet: {},
      userInfo: {
        userWx: {
          creditScore: 0
        }
      }
    };
  },
  onLoad() {
    this.getInfo();
    this.getWalletInit();
  },
  methods: {
    getWalletInit() {
      request_apis_payment.getWallet().then((res) => {
        common_vendor.index.__f__("log", "at pages/API/runner/center/center.vue:90", res);
        this.wallet = res.data;
      });
    },
    getInfo() {
      request_apis_login.getInfo().then((res) => {
        let info = res;
        this.$store.commit("login", info.data.user);
        this.$store.commit("setConfig", info.data.config);
        this.userInfo = this.$store.state.userInfo;
      }).catch((err) => {
        this.showDanger(err);
      });
    },
    handleWithdraw() {
      common_vendor.index.navigateTo({
        url: "/pages/API/runner/center/recode/recode?balance=" + this.wallet.balance
      });
    },
    handleDetails() {
      common_vendor.index.navigateTo({
        url: "/pages/API/runner/center/capitalflow/capitalflow"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.userInfo.userWx.creditScore),
    b: common_vendor.t($data.wallet.balance),
    c: common_vendor.t($data.wallet.withdrawn),
    d: common_vendor.o((...args) => $options.handleWithdraw && $options.handleWithdraw(...args), "eb"),
    e: common_vendor.o((...args) => $options.handleDetails && $options.handleDetails(...args), "4b")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5dbf37d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/runner/center/center.js.map

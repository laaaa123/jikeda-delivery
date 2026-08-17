"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
common_vendor.dayjs.extend(common_vendor.relativeTime);
common_vendor.dayjs.locale("zh-cn");
const _sfc_main = {
  data() {
    return {
      showAgentPop: false,
      title: "Hello",
      userInfo: {
        userWx: {}
      },
      visible1: false
      //检查有没有选择校区dialog
    };
  },
  onLoad() {
  },
  onShow() {
    this.initData();
  },
  methods: {
    toSetting() {
      common_vendor.index.navigateTo({
        url: "/pages/API/user/setting/setting"
      });
    },
    toCenter() {
      common_vendor.index.navigateTo({
        url: "/pages/API/runner/center/center"
      });
    },
    toOrderList() {
      common_vendor.index.navigateTo({
        url: "/pages/API/order/list/list"
      });
    },
    toAddressList() {
      common_vendor.index.navigateTo({
        url: "/pages/API/address/list/list"
      });
    },
    toSelectSchool() {
      common_vendor.index.navigateTo({
        url: "/pages/API/school/select/select"
      });
    },
    toRunnerIntro() {
      common_vendor.index.navigateTo({
        url: "/pages/API/runner/introduce/introduce"
      });
    },
    checkSchool() {
      let school = this.$store.state.currSchool;
      if (school == null || school == void 0 || school == "") {
        this.visible1 = true;
      } else {
        this.toRunnerIntro();
      }
    },
    toProfile() {
      common_vendor.index.navigateTo({
        url: "/pages/API/user/profile/profile"
      });
    },
    initData() {
      this.userInfo = this.$store.state.userInfo;
      this.userInfo.comesTime = this.getRegisterTimeMessage(this.userInfo.createTime);
      common_vendor.index.__f__("log", "at pages/tabBar/my/my.vue:198", this.userInfo);
      common_vendor.index.__f__("log", "at pages/tabBar/my/my.vue:199", this.userInfo);
    },
    getRegisterTimeMessage(createTime) {
      return common_vendor.dayjs().diff(common_vendor.dayjs(createTime), "day") < 1 ? "欢迎使用" : `您已经使用 ${common_vendor.dayjs(createTime).toNow(true)}啦！`;
    }
  }
};
if (!Array) {
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_dialog2 = common_vendor.resolveComponent("nut-dialog");
  (_easycom_nut_icon2 + _easycom_nut_dialog2)();
}
const _easycom_nut_icon = () => "../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_dialog = () => "../../../node-modules/nutui-uniapp/components/dialog/dialog.js";
if (!Math) {
  (_easycom_nut_icon + _easycom_nut_dialog)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d;
  return common_vendor.e({
    a: common_vendor.t($data.userInfo.userWx.nickname),
    b: common_vendor.p({
      size: "10px",
      name: "rect-right"
    }),
    c: common_vendor.t($data.userInfo.comesTime),
    d: $data.userInfo.userWx.avatar,
    e: common_vendor.o((...args) => $options.toProfile && $options.toProfile(...args), "f0"),
    f: ((_b = (_a = $data.userInfo) == null ? void 0 : _a.userWx) == null ? void 0 : _b.isRunner) === 1
  }, ((_d = (_c = $data.userInfo) == null ? void 0 : _c.userWx) == null ? void 0 : _d.isRunner) === 1 ? {
    g: common_assets._imports_0$2,
    h: common_assets._imports_0$1,
    i: common_vendor.o((...args) => $options.toCenter && $options.toCenter(...args), "bb")
  } : {}, {
    j: common_assets._imports_2,
    k: common_assets._imports_0$1,
    l: common_vendor.o((...args) => $options.checkSchool && $options.checkSchool(...args), "b1"),
    m: common_assets._imports_3,
    n: common_assets._imports_0$1,
    o: common_vendor.o((...args) => $options.toOrderList && $options.toOrderList(...args), "0e"),
    p: common_assets._imports_4,
    q: common_assets._imports_0$1,
    r: common_vendor.o((...args) => $options.toAddressList && $options.toAddressList(...args), "82"),
    s: common_assets._imports_5,
    t: common_assets._imports_0$1,
    v: common_assets._imports_6,
    w: common_assets._imports_0$1,
    x: common_vendor.o((...args) => $options.toSetting && $options.toSetting(...args), "c7"),
    y: common_assets._imports_7,
    z: common_assets._imports_0$1,
    A: common_vendor.o(($event) => $data.showAgentPop = true, "a0"),
    B: common_vendor.o(_ctx.onOk, "c4"),
    C: common_vendor.o(($event) => $data.showAgentPop = $event, "cc"),
    D: common_vendor.p({
      title: "温馨提示",
      content: "请咨询客服申请校区代理",
      ["no-cancel-btn"]: true,
      visible: $data.showAgentPop
    }),
    E: common_vendor.o($options.toSelectSchool, "ea"),
    F: common_vendor.o(($event) => $data.visible1 = $event, "66"),
    G: common_vendor.p({
      title: "未选择校区",
      content: "是否前往选择校区？",
      visible: $data.visible1
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tabBar/my/my.js.map

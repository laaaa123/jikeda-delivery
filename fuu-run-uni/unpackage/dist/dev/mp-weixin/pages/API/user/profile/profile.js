"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_request = require("../../../../request/request.js");
const request_apis_user = require("../../../../request/apis/user.js");
const request_apis_login = require("../../../../request/apis/login.js");
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
      btnPhoneLoading: false,
      btnSubmitLoading: false,
      showPhoneButton: true,
      title: "Hello",
      userInfo: {
        userWx: {
          nickname: ""
        }
      },
      uploadUrl: request_request.upload_url,
      updateForm: {
        avatar: "",
        nickname: ""
      },
      headers: {
        Authorization: "Bearer " + common_vendor.index.getStorageSync("token"),
        "Content-Type": "multipart/form-data"
      },
      uploaderData: {
        type: 4,
        name: ""
      }
    };
  },
  onLoad() {
    this.initData();
  },
  onReachBottom() {
  },
  methods: {
    getPhoneNumber(e) {
      common_vendor.index.__f__("log", "at pages/API/user/profile/profile.vue:184", e);
      let code = e && e.detail ? e.detail.code : null;
      if (!code || code === "undefined" || code === "null") {
        this.showDanger("未获取到手机号授权码，请重新点击授权");
        return;
      }
      this.btnPhoneLoading = true;
      request_apis_user.getBindPhone({ phoneCode: code }).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/user/profile/profile.vue:192", res);
        this.getInfo();
        this.getCanReqPhone();
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        this.btnPhoneLoading = false;
      });
    },
    getInfo() {
      request_apis_login.getInfo().then((res) => {
        let info = res;
        this.$store.commit("login", info.data.user);
        this.$store.commit("setConfig", info.data.config);
        this.freshUserInfo();
      }).catch((err) => {
        this.showDanger(err);
      });
    },
    updateProfile() {
      this.btnSubmitLoading = true;
      request_apis_user.putUpdateProfile(this.updateForm).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/user/profile/profile.vue:215", res);
        this.getInfo();
        this.showSuccess("设置成功");
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        this.btnSubmitLoading = false;
      });
    },
    oversize(files) {
      common_vendor.index.__f__("log", "at pages/API/user/profile/profile.vue:225", files);
      common_vendor.index.showToast({
        title: "文件大小超出5MB",
        icon: "none"
      });
    },
    uploadSuccess(e) {
      common_vendor.index.__f__("log", "at pages/API/user/profile/profile.vue:232", e);
      let data = e.data.data;
      data = JSON.parse(data);
      let url = data.data.url;
      this.updateForm.avatar = url;
      this.userInfo.userWx.avatar = url;
    },
    initData() {
      this.freshUserInfo();
      this.getCanReqPhone();
    },
    getCanReqPhone() {
      request_apis_user.getCanReqPhone().then((res) => {
        common_vendor.index.__f__("log", "at pages/API/user/profile/profile.vue:245", res);
        this.showPhoneButton = res.data;
      });
    },
    freshUserInfo() {
      this.userInfo = this.$store.state.userInfo;
      common_vendor.index.__f__("log", "at pages/API/user/profile/profile.vue:251", this.userInfo);
      this.updateForm.avatar = this.userInfo.userWx.avatar;
      this.updateForm.nickname = this.userInfo.userWx.nickname;
    }
  }
};
if (!Array) {
  const _easycom_nut_notify2 = common_vendor.resolveComponent("nut-notify");
  const _component_template = common_vendor.resolveComponent("template");
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_uploader2 = common_vendor.resolveComponent("nut-uploader");
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_input2 = common_vendor.resolveComponent("nut-input");
  const _easycom_nut_cell_group2 = common_vendor.resolveComponent("nut-cell-group");
  const _easycom_nut_button2 = common_vendor.resolveComponent("nut-button");
  (_easycom_nut_notify2 + _component_template + _easycom_nut_cell2 + _easycom_nut_uploader2 + _easycom_nut_icon2 + _easycom_nut_input2 + _easycom_nut_cell_group2 + _easycom_nut_button2)();
}
const _easycom_nut_notify = () => "../../../../node-modules/nutui-uniapp/components/notify/notify.js";
const _easycom_nut_cell = () => "../../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_uploader = () => "../../../../node-modules/nutui-uniapp/components/uploader/uploader.js";
const _easycom_nut_icon = () => "../../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_input = () => "../../../../node-modules/nutui-uniapp/components/input/input.js";
const _easycom_nut_cell_group = () => "../../../../node-modules/nutui-uniapp/components/cellgroup/cellgroup.js";
const _easycom_nut_button = () => "../../../../node-modules/nutui-uniapp/components/button/button.js";
if (!Math) {
  (_easycom_nut_notify + _easycom_nut_cell + _easycom_nut_uploader + _easycom_nut_icon + _easycom_nut_input + _easycom_nut_cell_group + _easycom_nut_button)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.updateForm.avatar,
    b: common_vendor.p({
      size: "large",
      desc: "更换头像"
    }),
    c: common_vendor.o($options.uploadSuccess, "53"),
    d: common_vendor.o($options.oversize, "0b"),
    e: common_vendor.p({
      headers: $data.headers,
      data: $data.uploaderData,
      maximize: 5242880,
      name: "file",
      accept: "image/*",
      url: $data.uploadUrl
    }),
    f: common_vendor.p({
      name: "/static/icons/姓名.png"
    }),
    g: common_vendor.o(($event) => $data.updateForm.nickname = $event, "d1"),
    h: common_vendor.p({
      ["max-length"]: "8",
      type: "nickname",
      placeholder: "请输入昵称",
      modelValue: $data.updateForm.nickname
    }),
    i: common_vendor.p({
      size: "large",
      desc: "昵称"
    }),
    j: common_vendor.p({
      title: "展示信息"
    }),
    k: common_vendor.o($options.updateProfile, "e2"),
    l: common_vendor.p({
      loading: $data.btnSubmitLoading,
      block: true,
      type: "primary"
    }),
    m: common_vendor.p({
      name: "/static/icons/手机号.png"
    }),
    n: common_vendor.o($options.getPhoneNumber, "eb"),
    o: common_vendor.p({
      loading: $data.btnPhoneLoading,
      ["open-type"]: "getPhoneNumber",
      type: "primary",
      size: "small"
    }),
    p: common_vendor.o(($event) => $data.userInfo.userWx.phone = $event, "89"),
    q: common_vendor.p({
      placeholder: "请绑定手机号",
      disabled: true,
      clearable: true,
      modelValue: $data.userInfo.userWx.phone
    }),
    r: common_vendor.p({
      title: "手机号"
    }),
    s: $data.showPhoneButton,
    t: common_vendor.p({
      name: "/static/icons/手机号.png"
    }),
    v: common_vendor.o($options.getPhoneNumber, "0e"),
    w: common_vendor.p({
      loading: $data.btnPhoneLoading,
      ["open-type"]: "getPhoneNumber",
      type: "primary",
      size: "small"
    }),
    x: common_vendor.o(($event) => $data.userInfo.userWx.phone = $event, "6f"),
    y: common_vendor.p({
      placeholder: "请绑定手机号",
      disabled: true,
      clearable: true,
      modelValue: $data.userInfo.userWx.phone
    }),
    z: common_vendor.p({
      title: "手机号"
    }),
    A: !$data.showPhoneButton,
    B: common_vendor.p({
      name: "/static/profile/business-icon-buyers-club.png"
    }),
    C: common_vendor.p({
      size: "large",
      title: "uuid",
      desc: $data.userInfo.uid
    }),
    D: common_vendor.p({
      name: "/static/profile/customer-official.png"
    }),
    E: common_vendor.p({
      size: "large",
      title: "身份",
      desc: $data.userInfo.userWx.isRunner == 1 ? "跑腿员" : "普通用户"
    }),
    F: $data.userInfo.userWx.isRunner == 1
  }, $data.userInfo.userWx.isRunner == 1 ? {
    G: common_vendor.p({
      name: "/static/profile/business-icon-buyers-club.png"
    }),
    H: common_vendor.p({
      size: "large",
      title: "跑腿学校",
      desc: $data.userInfo.userWx.schoolName
    })
  } : {}, {
    I: $data.userInfo.userWx.isRunner == 1
  }, $data.userInfo.userWx.isRunner == 1 ? {
    J: common_vendor.p({
      name: "/static/profile/order-success.png"
    }),
    K: common_vendor.p({
      size: "large",
      title: "接单状态",
      desc: $data.userInfo.userWx.canTake == 1 ? "可接单" : "不可接单"
    })
  } : {}, {
    L: $data.userInfo.userWx.isRunner == 1
  }, $data.userInfo.userWx.isRunner == 1 ? {
    M: common_vendor.p({
      name: "/static/profile/name-card.png"
    }),
    N: common_vendor.p({
      size: "large",
      title: "真实姓名",
      desc: $data.userInfo.userWx.realname
    })
  } : {}, {
    O: $data.userInfo.userWx.isRunner == 1
  }, $data.userInfo.userWx.isRunner == 1 ? {
    P: common_vendor.p({
      name: "/static/profile/genderless.png"
    }),
    Q: common_vendor.p({
      size: "large",
      title: "性别",
      desc: $data.userInfo.userWx.gender == 1 ? "男" : "女"
    })
  } : {}, {
    R: common_vendor.p({
      name: "/static/profile/order.png"
    }),
    S: common_vendor.p({
      size: "large",
      title: "下单状态",
      desc: $data.userInfo.userWx.canOrder == 1 ? "可下单" : "不可下单"
    }),
    T: common_vendor.p({
      name: "/static/profile/time.png"
    }),
    U: common_vendor.p({
      size: "large",
      title: "注册时间",
      desc: $data.userInfo.createTime
    }),
    V: common_vendor.p({
      title: "其它"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/user/profile/profile.js.map

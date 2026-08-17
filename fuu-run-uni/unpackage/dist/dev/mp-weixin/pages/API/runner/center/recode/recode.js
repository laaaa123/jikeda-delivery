"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const request_apis_payment = require("../../../../../request/apis/payment.js");
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
      btnDisable: false,
      btnLoading: false,
      placeholderCard: "请输入支付宝账号/手机号",
      placeholderRemark: "可注明备注",
      balance: 0,
      // 账户余额
      showPlatformPicker: false,
      selectedPlatform: 0,
      // 0-支付宝 1-银行卡
      platformOptions: [
        { text: "支付宝转账", value: 0 },
        { text: "银行卡转账", value: 1 }
      ],
      form: {
        platform: 0,
        card: "",
        // 支付宝账号
        remark: "",
        // 备注
        cash: ""
        // 提现金额
      },
      lastRecord: {
        status: 3
      }
      // 添加最近提现记录
    };
  },
  computed: {
    isValid() {
      const { cash } = this.form;
      const numAmount = Number(cash);
      if (!cash || numAmount < 10 || numAmount > Number(this.balance)) {
        return false;
      }
      return true;
    }
  },
  onLoad(options) {
    this.balance = options.balance;
    this.getLastRecord();
  },
  methods: {
    onPlatformConfirm({ selectedValue, selectedOptions }) {
      common_vendor.index.__f__("log", "at pages/API/runner/center/recode/recode.vue:182", selectedValue);
      this.selectedPlatform = selectedValue[0];
      let value = selectedValue[0];
      if (value == 0) {
        this.placeholderCard = "请输入支付宝账号/手机号";
        this.placeholderRemark = "可注明备注";
      }
      if (value == 1) {
        this.placeholderCard = "请输入银行卡号";
        this.placeholderRemark = "注明 开户银行 和 持卡人姓名";
      }
      this.showPlatformPicker = false;
      this.form.cash = "";
      this.form.remark = "";
      this.form.card = "";
    },
    handleAmountInput(e) {
      const value = e.detail.value;
      this.form.amount = value.replace(/[^\d.]/g, "").replace(/\.{2,}/g, ".").replace(/^(\d+)\.(\d\d).*$/, "$1.$2");
    },
    handleSubmit() {
      common_vendor.index.__f__("log", "at pages/API/runner/center/recode/recode.vue:207", 11);
      this.btnLoading = true;
      if (!this.isValid) {
        this.showWarning("提现金额不合法");
        this.btnLoading = false;
        return;
      }
      request_apis_payment.postRecodeSubmit(this.form).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/runner/center/recode/recode.vue:216", res);
        this.showSuccess("申请成功，请耐心等待");
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        this.btnLoading = false;
      });
    },
    // 获取最近提现记录
    getLastRecord() {
      request_apis_payment.getRecodeLast().then((res) => {
        common_vendor.index.__f__("log", "at pages/API/runner/center/recode/recode.vue:231", res);
        if (res.data.status == 2) {
          this.btnDisable = true;
        }
        this.lastRecord = res.data;
      });
    },
    // 获取状态对应的样式类名
    getStatusClass(status) {
      const statusMap = {
        0: "rejected",
        1: "success",
        2: "pending"
      };
      return statusMap[status] || "pending";
    },
    // 获取状态对应的文字
    getStatusText(status) {
      const statusMap = {
        0: "已驳回",
        1: "已通过",
        2: "审核中"
      };
      return statusMap[status] || "审核中";
    },
    // 获取平台对应的文字
    getPlatformText(platform) {
      return platform === "1" ? "支付宝" : "银行卡";
    },
    // 格式化卡号（隐藏中间部分）
    maskCard(card) {
      if (!card)
        return "";
      if (card.length <= 8)
        return card;
      return card.substr(0, 4) + "****" + card.substr(-4);
    },
    // 格式化时间
    formatTime(time) {
      if (!time)
        return "";
      return time.replace("T", " ").split(".")[0];
    }
  }
};
if (!Array) {
  const _easycom_nut_notify2 = common_vendor.resolveComponent("nut-notify");
  const _component_template = common_vendor.resolveComponent("template");
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_input2 = common_vendor.resolveComponent("nut-input");
  const _easycom_nut_button2 = common_vendor.resolveComponent("nut-button");
  const _easycom_nut_picker2 = common_vendor.resolveComponent("nut-picker");
  const _easycom_nut_popup2 = common_vendor.resolveComponent("nut-popup");
  (_easycom_nut_notify2 + _component_template + _easycom_nut_cell2 + _easycom_nut_input2 + _easycom_nut_button2 + _easycom_nut_picker2 + _easycom_nut_popup2)();
}
const _easycom_nut_notify = () => "../../../../../node-modules/nutui-uniapp/components/notify/notify.js";
const _easycom_nut_cell = () => "../../../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_input = () => "../../../../../node-modules/nutui-uniapp/components/input/input.js";
const _easycom_nut_button = () => "../../../../../node-modules/nutui-uniapp/components/button/button.js";
const _easycom_nut_picker = () => "../../../../../node-modules/nutui-uniapp/components/picker/picker.js";
const _easycom_nut_popup = () => "../../../../../node-modules/nutui-uniapp/components/popup/popup.js";
if (!Math) {
  (_easycom_nut_notify + _easycom_nut_cell + _easycom_nut_input + _easycom_nut_button + _easycom_nut_picker + _easycom_nut_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.balance),
    b: common_vendor.o(($event) => $data.showPlatformPicker = true, "1b"),
    c: common_vendor.p({
      title: "提现平台",
      desc: $data.platformOptions[$data.selectedPlatform].text,
      ["is-link"]: true
    }),
    d: common_vendor.o(($event) => $data.form.card = $event, "ba"),
    e: common_vendor.p({
      label: "支付宝账号",
      placeholder: $data.placeholderCard,
      type: "text",
      modelValue: $data.form.card
    }),
    f: common_vendor.o([($event) => $data.form.cash = $event.detail.value, (...args) => $options.handleAmountInput && $options.handleAmountInput(...args)], "14"),
    g: $data.form.cash,
    h: common_vendor.o(($event) => $data.form.remark = $event, "8c"),
    i: common_vendor.p({
      label: "备注",
      placeholder: $data.placeholderRemark,
      type: "text",
      modelValue: $data.form.remark
    }),
    j: common_vendor.o(($event) => $options.handleSubmit(), "eb"),
    k: common_vendor.p({
      loading: $data.btnLoading,
      disabled: $data.btnDisable,
      block: true,
      type: "info"
    }),
    l: common_vendor.t($options.getStatusText($data.lastRecord.status)),
    m: common_vendor.n($options.getStatusClass($data.lastRecord.status)),
    n: common_vendor.t($data.lastRecord.cash),
    o: common_vendor.t($options.getPlatformText($data.lastRecord.platform)),
    p: common_vendor.t($options.maskCard($data.lastRecord.card)),
    q: common_vendor.t($options.formatTime($data.lastRecord.createTime)),
    r: $data.lastRecord.feedback
  }, $data.lastRecord.feedback ? {
    s: common_vendor.t($data.lastRecord.feedback)
  } : {}, {
    t: $data.lastRecord.status != 3 && $data.lastRecord != null,
    v: common_vendor.o($options.onPlatformConfirm, "49"),
    w: common_vendor.o(($event) => $data.showPlatformPicker = false, "f8"),
    x: common_vendor.p({
      columns: [$data.platformOptions]
    }),
    y: common_vendor.o(($event) => $data.showPlatformPicker = $event, "6a"),
    z: common_vendor.p({
      position: "bottom",
      visible: $data.showPlatformPicker
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b2115249"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/API/runner/center/recode/recode.js.map

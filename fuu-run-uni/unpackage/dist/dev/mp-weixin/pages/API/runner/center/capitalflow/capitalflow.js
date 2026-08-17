"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const request_apis_payment = require("../../../../../request/apis/payment.js");
const _sfc_main = {
  data() {
    return {
      queryParams: {
        type: null,
        beginTime: null,
        endTime: null,
        pageSize: 20,
        pageNum: 1
      },
      rows: [],
      total: 0,
      hasMore: true,
      showTypeSelector: false,
      skeletonLoading: true,
      dateText: "一周内",
      date: ["2019-12-23", "2019-12-26"],
      startDate: "",
      endDate: "",
      dateVisible: false,
      selectedTypeName: "全部类型",
      typeOptions: [[
        { text: "全部类型", value: null },
        { text: "订单收入", value: "0" },
        { text: "提现支出", value: "1" }
      ]],
      scrollHeight: 0
      // 添加滚动区域高度
    };
  },
  onLoad() {
    this.skeletonLoading = true;
    this.initDate();
    this.initData();
    this.getList();
    this.initScrollHeight();
  },
  methods: {
    getList() {
      let temp = this.queryParams;
      temp.params = JSON.stringify(temp.params);
      request_apis_payment.getListCapital(temp).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/runner/center/capitalflow/capitalflow.vue:100", res);
        this.total = res.total;
        let data = res.rows;
        this.rows.push(...data);
        this.queryParams.pageNum += 1;
        this.hasMore = data.length === this.queryParams.pageSize;
        this.skeletonLoading = false;
        common_vendor.index.stopPullDownRefresh();
      }).catch((err) => {
        this.skeletonLoading = false;
        common_vendor.index.showToast({
          title: err,
          icon: "none",
          duration: 3e3
        });
      });
    },
    initData() {
      this.currSchool = this.$store.state.currSchool;
    },
    initDate() {
      const currentDate = /* @__PURE__ */ new Date();
      const startDate = /* @__PURE__ */ new Date();
      startDate.setFullYear(currentDate.getFullYear() - 2);
      const endDate = /* @__PURE__ */ new Date();
      endDate.setDate(currentDate.getDate() + 1);
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      this.queryParams.startDate = this.getDate(-7);
      this.queryParams.endDate = this.getDate(0);
      this.date[0] = this.getDate(-7);
      this.date[1] = this.getDate(0);
      this.startDate = formatDate(startDate);
      this.endDate = formatDate(endDate);
    },
    setChooseDate(param) {
      this.date = [...[param[0][3], param[1][3]]];
    },
    openDate() {
      this.dateVisible = true;
    },
    closeDate() {
      this.dateVisible = false;
      this.queryParams.beginTime = this.date[0] + " 00:00:00";
      this.queryParams.endTime = this.date[1] + " 00:00:00";
      let formattedEndTime = this.date[1].split("-").slice(1).join("-");
      this.dateText = this.date[0] + "至" + formattedEndTime;
      this.resizePage();
      this.getList();
    },
    getDate(daysOffset) {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() + daysOffset);
      return date.toISOString().split("T")[0];
    },
    resizePage() {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 20;
      this.rows = [];
      this.total = 0;
      this.hasMore = true;
    },
    onTypeConfirm({ selectedValue, selectedOptions }) {
      this.selectedType = selectedValue[0];
      this.selectedTypeName = selectedOptions[0].text;
      this.showTypeSelector = false;
      this.queryParams.type = selectedValue[0];
      this.resizePage();
      this.getList();
    },
    // 初始化滚动区域高度
    initScrollHeight() {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      this.scrollHeight = systemInfo.windowHeight - common_vendor.index.upx2px(120) - systemInfo.statusBarHeight;
    },
    // 处理滚动到底部
    handleScrollToLower() {
      if (this.hasMore && !this.skeletonLoading) {
        this.getList();
      }
    },
    // 获取流水标题
    getFlowTitle(item) {
      if (item.type === 0) {
        return "订单收益";
      } else if (item.type === 1) {
        return "跑腿提现";
      } else {
        return "其他";
      }
    },
    // 获取金额样式类
    getAmountClass(item) {
      return item.type === 0 ? "income" : "expense";
    },
    // 获取金额显示文本
    getAmountText(item) {
      let amount = 0;
      if (item.type === 0) {
        amount = item.profitRunner || 0;
        return `+${amount}`;
      } else if (item.type === 1) {
        amount = item.profitRunner || 0;
        return `-${amount}`;
      }
      return `${amount}`;
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
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_skeleton2 = common_vendor.resolveComponent("nut-skeleton");
  const _easycom_nut_empty2 = common_vendor.resolveComponent("nut-empty");
  const _easycom_nut_divider2 = common_vendor.resolveComponent("nut-divider");
  const _easycom_nut_safe_area2 = common_vendor.resolveComponent("nut-safe-area");
  const _easycom_nut_calendar2 = common_vendor.resolveComponent("nut-calendar");
  const _easycom_nut_picker2 = common_vendor.resolveComponent("nut-picker");
  const _easycom_nut_popup2 = common_vendor.resolveComponent("nut-popup");
  (_easycom_nut_cell2 + _easycom_nut_skeleton2 + _easycom_nut_empty2 + _easycom_nut_divider2 + _easycom_nut_safe_area2 + _easycom_nut_calendar2 + _easycom_nut_picker2 + _easycom_nut_popup2)();
}
const _easycom_nut_cell = () => "../../../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_skeleton = () => "../../../../../node-modules/nutui-uniapp/components/skeleton/skeleton.js";
const _easycom_nut_empty = () => "../../../../../node-modules/nutui-uniapp/components/empty/empty.js";
const _easycom_nut_divider = () => "../../../../../node-modules/nutui-uniapp/components/divider/divider.js";
const _easycom_nut_safe_area = () => "../../../../../node-modules/nutui-uniapp/components/safearea/safearea.js";
const _easycom_nut_calendar = () => "../../../../../node-modules/nutui-uniapp/components/calendar/calendar.js";
const _easycom_nut_picker = () => "../../../../../node-modules/nutui-uniapp/components/picker/picker.js";
const _easycom_nut_popup = () => "../../../../../node-modules/nutui-uniapp/components/popup/popup.js";
if (!Math) {
  (_easycom_nut_cell + _easycom_nut_skeleton + _easycom_nut_empty + _easycom_nut_divider + _easycom_nut_safe_area + _easycom_nut_calendar + _easycom_nut_picker + _easycom_nut_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.dateVisible = true, "7b"),
    b: common_vendor.p({
      title: "日期范围",
      desc: $data.dateText
    }),
    c: common_vendor.o(($event) => $data.showTypeSelector = true, "c4"),
    d: common_vendor.p({
      title: "收益类型",
      desc: $data.selectedTypeName
    }),
    e: common_vendor.f(6, (item, index, i0) => {
      return {
        a: index,
        b: "671eb25a-2-" + i0
      };
    }),
    f: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "2"
    }),
    g: $data.skeletonLoading,
    h: common_vendor.f($data.rows, (item, index, i0) => {
      return {
        a: common_vendor.t($options.getFlowTitle(item)),
        b: common_vendor.t($options.formatTime(item.createTime)),
        c: common_vendor.t($options.getAmountText(item)),
        d: common_vendor.n($options.getAmountClass(item)),
        e: index
      };
    }),
    i: !$data.skeletonLoading,
    j: common_vendor.p({
      description: "暂无数据"
    }),
    k: $data.total == 0 && !$data.skeletonLoading,
    l: common_vendor.p({
      dashed: true
    }),
    m: !$data.hasMore && $data.total != 0 && !$data.skeletonLoading,
    n: common_vendor.o((...args) => $options.handleScrollToLower && $options.handleScrollToLower(...args), "7f"),
    o: $data.scrollHeight + "px",
    p: common_vendor.p({
      position: "bottom"
    }),
    q: common_vendor.o(($event) => $options.closeDate("dateVisible"), "16"),
    r: common_vendor.o($options.setChooseDate, "dd"),
    s: common_vendor.o(($event) => $data.dateVisible = $event, "ec"),
    t: common_vendor.p({
      ["default-value"]: $data.date,
      type: "range",
      ["start-date"]: $data.startDate,
      ["end-date"]: $data.endDate,
      visible: $data.dateVisible
    }),
    v: common_vendor.o($options.onTypeConfirm, "6d"),
    w: common_vendor.o(($event) => $data.showTypeSelector = false, "d9"),
    x: common_vendor.p({
      columns: $data.typeOptions
    }),
    y: common_vendor.o(($event) => $data.showTypeSelector = $event, "ca"),
    z: common_vendor.p({
      position: "bottom",
      visible: $data.showTypeSelector
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-671eb25a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/API/runner/center/capitalflow/capitalflow.js.map

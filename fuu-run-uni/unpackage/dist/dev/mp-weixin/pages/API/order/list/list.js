"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_apis_order = require("../../../../request/apis/order.js");
const common_assets = require("../../../../common/assets.js");
common_vendor.dayjs.extend(common_vendor.relativeTime);
common_vendor.dayjs.locale("zh-cn");
const { safeAreaInsets } = common_vendor.index.getSystemInfoSync();
const _sfc_main = {
  data() {
    return {
      safeAreaInsets,
      skeletonLoading: true,
      dateText: "选择日期",
      date: ["2019-12-23", "2019-12-26"],
      startDate: "",
      endDate: "",
      dateVisible: false,
      scrollTop: 0,
      state: {
        status: [
          {
            text: "全部订单",
            value: null
          },
          {
            text: "待支付",
            value: 0
          },
          {
            text: "待接单",
            value: 1
          },
          {
            text: "待配送",
            value: 2
          },
          {
            text: "配送中",
            value: 3
          },
          {
            text: "已送达",
            value: 4
          },
          {
            text: "已取消",
            value: 5
          },
          {
            text: "已完成",
            value: 10
          },
          {
            text: "已申诉",
            value: 11
          }
        ],
        orderOrTake: [
          {
            text: "我的发布",
            value: 0
          },
          {
            text: "我的接单",
            value: 1
          }
        ],
        value1: null,
        value2: 0
      },
      currSchool: null,
      tabValue: 0,
      title: "Hello",
      queryParams: {
        schoolId: null,
        status: null,
        orderOrTake: 0,
        beginTime: null,
        endTime: null,
        pageSize: 20,
        pageNum: 1
      },
      rows: [],
      total: 0,
      hasMore: true
    };
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pages/API/order/list/list.vue:191", safeAreaInsets);
    this.skeletonLoading = true;
    this.initDate();
    this.initData();
    this.getList();
  },
  onReachBottom() {
    if (this.hasMore) {
      this.getList();
    }
  },
  onPullDownRefresh() {
  },
  methods: {
    toDetail(id) {
      if (this.state.value2 == 1) {
        common_vendor.index.navigateTo({
          url: "/pages/API/order/runner/runner?orderId=" + id
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/API/order/detail/detail?id=" + id
        });
      }
    },
    back() {
      common_vendor.index.navigateBack();
    },
    chooseOrderOrTake(e) {
      this.queryParams.orderOrTake = e;
      this.resizePage();
      this.skeletonLoading = true;
      this.getList();
    },
    chooseStatus(e) {
      common_vendor.index.__f__("log", "at pages/API/order/list/list.vue:231", e);
      this.queryParams.status = e;
      this.resizePage();
      this.skeletonLoading = true;
      this.getList();
    },
    setChooseDate(param) {
      this.date = [...[param[0][3], param[1][3]]];
    },
    openDate() {
      this.dateVisible = true;
    },
    closeDate() {
      this.dateVisible = false;
      common_vendor.index.__f__("log", "at pages/API/order/list/list.vue:245", this.date);
      this.queryParams.beginTime = this.date[0] + " 00:00:00";
      this.queryParams.endTime = this.date[1] + " 00:00:00";
      let formattedEndTime = this.date[1].split("-").slice(1).join("-");
      this.dateText = this.date[0] + "至" + formattedEndTime;
      this.resizePage();
      common_vendor.index.__f__("log", "at pages/API/order/list/list.vue:251", 222);
      this.getList();
    },
    changeTab(e) {
      let key = e.paneKey;
      if (key == "0")
        this.queryParams.orderOrTake = 0;
      if (key == "1")
        this.queryParams.orderOrTake = 1;
      this.resizePage();
      common_vendor.index.__f__("log", "at pages/API/order/list/list.vue:260", 111);
      this.getList();
    },
    initData() {
      this.currSchool = this.$store.state.currSchool;
      let orderDefaultShow = common_vendor.index.getStorageSync("orderDefaultShow");
      if (orderDefaultShow == "我的发布") {
        this.state.value2 = 0;
        this.queryParams.orderOrTake = 0;
      }
      if (orderDefaultShow == "我的接单") {
        this.state.value2 = 1;
        this.queryParams.orderOrTake = 1;
      }
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
      this.startDate = formatDate(startDate);
      this.endDate = formatDate(endDate);
      this.date[0] = this.getDate(-7);
      this.date[1] = this.getDate(0);
      common_vendor.index.__f__("log", "at pages/API/order/list/list.vue:296", this.date);
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
    getList() {
      request_apis_order.getListOrderUser(this.queryParams).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/list/list.vue:312", res);
        this.total = res.total;
        let data = res.rows;
        for (var i = 0; i < data.length; i++) {
          data[i].timeAgo = common_vendor.dayjs(data[i].createTime).fromNow();
        }
        this.rows.push(...data);
        this.queryParams.pageNum += 1;
        this.hasMore = data.length > 0;
        this.skeletonLoading = false;
        common_vendor.index.stopPullDownRefresh();
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err,
          icon: "none",
          duration: 3e3
        });
      });
    }
  }
};
if (!Array) {
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_navbar2 = common_vendor.resolveComponent("nut-navbar");
  const _easycom_nut_menu_item2 = common_vendor.resolveComponent("nut-menu-item");
  const _easycom_nut_menu2 = common_vendor.resolveComponent("nut-menu");
  const _easycom_nut_skeleton2 = common_vendor.resolveComponent("nut-skeleton");
  const _easycom_nut_tag2 = common_vendor.resolveComponent("nut-tag");
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_button2 = common_vendor.resolveComponent("nut-button");
  const _easycom_nut_empty2 = common_vendor.resolveComponent("nut-empty");
  const _easycom_nut_divider2 = common_vendor.resolveComponent("nut-divider");
  const _easycom_nut_calendar2 = common_vendor.resolveComponent("nut-calendar");
  (_easycom_nut_icon2 + _easycom_nut_navbar2 + _easycom_nut_menu_item2 + _easycom_nut_menu2 + _easycom_nut_skeleton2 + _easycom_nut_tag2 + _easycom_nut_cell2 + _easycom_nut_button2 + _easycom_nut_empty2 + _easycom_nut_divider2 + _easycom_nut_calendar2)();
}
const _easycom_nut_icon = () => "../../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_navbar = () => "../../../../node-modules/nutui-uniapp/components/navbar/navbar.js";
const _easycom_nut_menu_item = () => "../../../../node-modules/nutui-uniapp/components/menuitem/menuitem.js";
const _easycom_nut_menu = () => "../../../../node-modules/nutui-uniapp/components/menu/menu.js";
const _easycom_nut_skeleton = () => "../../../../node-modules/nutui-uniapp/components/skeleton/skeleton.js";
const _easycom_nut_tag = () => "../../../../node-modules/nutui-uniapp/components/tag/tag.js";
const _easycom_nut_cell = () => "../../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_button = () => "../../../../node-modules/nutui-uniapp/components/button/button.js";
const _easycom_nut_empty = () => "../../../../node-modules/nutui-uniapp/components/empty/empty.js";
const _easycom_nut_divider = () => "../../../../node-modules/nutui-uniapp/components/divider/divider.js";
const _easycom_nut_calendar = () => "../../../../node-modules/nutui-uniapp/components/calendar/calendar.js";
if (!Math) {
  (_easycom_nut_icon + _easycom_nut_navbar + _easycom_nut_menu_item + _easycom_nut_menu + _easycom_nut_skeleton + _easycom_nut_tag + _easycom_nut_cell + _easycom_nut_button + _easycom_nut_empty + _easycom_nut_divider + _easycom_nut_calendar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.dateText),
    b: common_vendor.o(($event) => $options.openDate("dateVisible"), "cb"),
    c: common_vendor.o($options.back, "ec"),
    d: common_vendor.p({
      name: "left"
    }),
    e: common_vendor.p({
      desc: "编辑",
      fixed: "true",
      placeholder: "true"
    }),
    f: common_vendor.p({
      name: "triangle-down"
    }),
    g: common_vendor.o($options.chooseStatus, "63"),
    h: common_vendor.o(($event) => $data.state.value1 = $event, "b6"),
    i: common_vendor.p({
      options: $data.state.status,
      modelValue: $data.state.value1
    }),
    j: common_vendor.o($options.chooseOrderOrTake, "c7"),
    k: common_vendor.o(($event) => $data.state.value2 = $event, "42"),
    l: common_vendor.p({
      options: $data.state.orderOrTake,
      modelValue: $data.state.value2
    }),
    m: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "3"
    }),
    n: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "3"
    }),
    o: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "3"
    }),
    p: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "3"
    }),
    q: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "3"
    }),
    r: $data.skeletonLoading,
    s: common_vendor.f($data.rows, (item, index, i0) => {
      return common_vendor.e({
        a: item.serviceType == 0
      }, item.serviceType == 0 ? {
        b: "0ab8ad22-11-" + i0,
        c: common_vendor.p({
          ["custom-color"]: "#e9f7ff",
          ["text-color"]: "#248fce"
        })
      } : {}, {
        d: item.serviceType == 1
      }, item.serviceType == 1 ? {
        e: "0ab8ad22-12-" + i0,
        f: common_vendor.p({
          ["custom-color"]: "#f9e2c0",
          ["text-color"]: "#ef940d"
        })
      } : {}, {
        g: item.serviceType == 2
      }, item.serviceType == 2 ? {
        h: "0ab8ad22-13-" + i0,
        i: common_vendor.p({
          ["custom-color"]: "#f9dfff",
          ["text-color"]: "#e077ec"
        })
      } : {}, {
        j: common_vendor.t(item.tag),
        k: item.status == 0
      }, item.status == 0 ? {} : {}, {
        l: item.status == 1
      }, item.status == 1 ? {} : {}, {
        m: item.status == 2
      }, item.status == 2 ? {} : {}, {
        n: item.status == 3
      }, item.status == 3 ? {} : {}, {
        o: item.status == 4
      }, item.status == 4 ? {} : {}, {
        p: item.status == 5
      }, item.status == 5 ? {} : {}, {
        q: item.status == 10
      }, item.status == 10 ? {} : {}, {
        r: item.status == 11
      }, item.status == 11 ? {} : {}, {
        s: common_vendor.t(item.detail),
        t: item.startAddress != null
      }, item.startAddress != null ? {
        v: common_assets._imports_0,
        w: "0ab8ad22-14-" + i0,
        x: common_vendor.p({
          title: item.startAddress.title + "" + item.startAddress.detail
        })
      } : {}, {
        y: "0ab8ad22-15-" + i0,
        z: common_vendor.p({
          title: item.endAddress.title + "" + item.endAddress.detail
        }),
        A: common_vendor.t(item.totalAmount),
        B: common_vendor.t(item.timeAgo),
        C: common_vendor.o(($event) => $options.toDetail(item.id), index),
        D: "0ab8ad22-16-" + i0,
        E: index
      });
    }),
    t: common_assets._imports_1,
    v: common_vendor.p({
      type: "info"
    }),
    w: common_vendor.p({
      description: "暂无数据"
    }),
    x: $data.total == 0 && $data.skeletonLoading == false,
    y: common_vendor.p({
      dashed: true
    }),
    z: !$data.hasMore && $data.total != 0 && $data.skeletonLoading == false,
    A: common_vendor.s("width: 100%;height: 100%;padding-top:" + ($data.safeAreaInsets.top + 10) + "px;padding-bottom:" + ($data.safeAreaInsets.bottom + 10) + "px;"),
    B: common_vendor.o(($event) => $options.closeDate("dateVisible"), "ed"),
    C: common_vendor.o($options.setChooseDate, "3f"),
    D: common_vendor.o(($event) => $data.dateVisible = $event, "4a"),
    E: common_vendor.p({
      ["default-value"]: $data.date,
      type: "range",
      ["start-date"]: $data.startDate,
      ["end-date"]: $data.endDate,
      visible: $data.dateVisible
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/order/list/list.js.map

"use strict";
const common_vendor = require("../../../common/vendor.js");
const request_apis_order = require("../../../request/apis/order.js");
const request_apis_runner = require("../../../request/apis/runner.js");
const request_websocket = require("../../../request/websocket.js");
const common_assets = require("../../../common/assets.js");
common_vendor.dayjs.extend(common_vendor.relativeTime);
common_vendor.dayjs.locale("zh-cn");
const _sfc_main = {
  data() {
    return {
      skeletonLoading: true,
      locationTimer: null,
      currSchool: null,
      tabValue: 0,
      title: "Hello",
      queryParams: {
        schoolId: null,
        status: null,
        pageSize: 20,
        pageNum: 1
      },
      rows: [],
      total: 0,
      hasMore: true,
      showRecommendPopup: false,
      recommendedOrder: null,
      acceptingRecommend: false,
      shownRecommendOrderIds: []
    };
  },
  onLoad() {
    this.skeletonLoading = true;
    this.initData();
  },
  onShow() {
    this.initData();
    request_websocket.ws.init();
    common_vendor.index.$off("ws-message", this.handleWsMessage);
    common_vendor.index.$on("ws-message", this.handleWsMessage);
    this.startLocationTimer();
    this.refreshList();
  },
  onHide() {
    common_vendor.index.$off("ws-message", this.handleWsMessage);
    this.clearLocationTimer();
  },
  onUnload() {
    common_vendor.index.$off("ws-message", this.handleWsMessage);
    this.clearLocationTimer();
  },
  onReachBottom() {
    if (this.hasMore) {
      this.getList();
    }
  },
  onPullDownRefresh() {
    this.skeletonLoading = true;
    this.refreshList();
  },
  methods: {
    toOrderDetailRunner(e) {
      common_vendor.index.__f__("log", "at pages/tabBar/order/order.vue:228", e);
      common_vendor.index.navigateTo({
        url: "/pages/API/order/runner/runner?orderId=" + e.id
      });
    },
    handleWsMessage(message) {
      if (!message || message.type !== "NEW_RECOMMENDED_ORDER") {
        return;
      }
      this.recommendedOrder = this.buildRecommendedOrder(message);
      this.showRecommendPopup = true;
      common_vendor.index.showToast({
        title: message.title || "附近有新订单",
        icon: "none",
        duration: 2e3
      });
      this.refreshList();
    },
    buildRecommendedOrder(message) {
      return {
        orderId: message.orderId,
        title: message.title || "附近新订单",
        pickupTitle: message.pickupTitle,
        deliveryTitle: message.deliveryTitle,
        distanceToPickupText: message.distanceToPickupText,
        payableAmount: message.payableAmount,
        dispatchScore: message.dispatchScore,
        recommendReason: message.recommendReason
      };
    },
    buildRecommendedOrderFromRow(order) {
      const startAddress = order.startAddress || {};
      const endAddress = order.endAddress || {};
      return {
        orderId: order.id,
        title: "系统推荐订单",
        pickupTitle: startAddress.title || startAddress.name || "取件地址",
        deliveryTitle: endAddress.title || endAddress.name || "送达地址",
        distanceToPickupText: order.distanceToPickupText,
        payableAmount: order.totalAmount,
        dispatchScore: order.dispatchScore,
        recommendReason: order.recommendReason
      };
    },
    showFirstRecommendedOrder(orders) {
      if (this.showRecommendPopup || !orders || orders.length === 0) {
        return;
      }
      const target = orders.find((item) => item.recommended && this.shownRecommendOrderIds.indexOf(item.id) === -1);
      if (!target) {
        return;
      }
      this.shownRecommendOrderIds.push(target.id);
      this.recommendedOrder = this.buildRecommendedOrderFromRow(target);
      this.showRecommendPopup = true;
    },
    closeRecommendPopup() {
      this.showRecommendPopup = false;
    },
    viewRecommendedOrder() {
      if (!this.recommendedOrder || !this.recommendedOrder.orderId) {
        return;
      }
      this.showRecommendPopup = false;
      common_vendor.index.navigateTo({
        url: "/pages/API/order/runner/runner?orderId=" + this.recommendedOrder.orderId
      });
    },
    acceptRecommendedOrder() {
      if (!this.recommendedOrder || !this.recommendedOrder.orderId || this.acceptingRecommend) {
        return;
      }
      this.acceptingRecommend = true;
      request_apis_order.getAccept(this.recommendedOrder.orderId).then(() => {
        const orderId = this.recommendedOrder.orderId;
        common_vendor.index.showToast({
          title: "接单成功",
          icon: "success"
        });
        this.showRecommendPopup = false;
        this.refreshList();
        common_vendor.index.navigateTo({
          url: "/pages/API/order/runner/runner?orderId=" + orderId
        });
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err || "接单失败",
          icon: "none",
          duration: 3e3
        });
        this.refreshList();
      }).finally(() => {
        this.acceptingRecommend = false;
      });
    },
    tabChange(e) {
      let key = e.paneKey;
      if (key == "0")
        this.queryParams.status = null;
      if (key == "1")
        this.queryParams.status = 1;
      this.resizePage();
      this.skeletonLoading = true;
      this.refreshList();
    },
    initData() {
      this.currSchool = this.$store.state.currSchool || common_vendor.index.getStorageSync("currentSchool") || {};
      const userInfo = this.$store.state.userInfo || {};
      const userWx = userInfo.userWx || {};
      this.queryParams.schoolId = this.currSchool.id || userWx.schoolId || null;
    },
    resizePage() {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 20;
      this.rows = [];
      this.total = 0;
      this.hasMore = true;
    },
    refreshList() {
      this.resizePage();
      this.reportCurrentLocation().finally(() => {
        this.getList();
      });
    },
    startLocationTimer() {
      this.clearLocationTimer();
      this.reportCurrentLocation();
      this.locationTimer = setInterval(() => {
        this.reportCurrentLocation();
      }, 3e4);
    },
    clearLocationTimer() {
      if (this.locationTimer) {
        clearInterval(this.locationTimer);
        this.locationTimer = null;
      }
    },
    reportCurrentLocation() {
      return new Promise((resolve, reject) => {
        common_vendor.index.getLocation({
          type: "gcj02",
          success(res) {
            request_apis_runner.reportRiderLocation({
              lng: res.longitude,
              lat: res.latitude,
              locationSource: "miniapp"
            }).then(resolve).catch(reject);
          },
          fail(err) {
            reject(err);
          }
        });
      });
    },
    getList() {
      const nearbyParams = {
        status: this.queryParams.status,
        pageSize: this.queryParams.pageSize,
        pageNum: this.queryParams.pageNum
      };
      request_apis_order.getNearbyOrderHall(nearbyParams).then((res) => {
        common_vendor.index.__f__("log", "at pages/tabBar/order/order.vue:387", res);
        let data = res.rows;
        for (var i = 0; i < data.length; i++) {
          data[i].timeAgo = common_vendor.dayjs(data[i].createTime).fromNow();
        }
        res.rows = data;
        this.total = res.total;
        this.rows.push(...res.rows);
        this.showFirstRecommendedOrder(res.rows);
        this.queryParams.pageNum += 1;
        this.hasMore = res.rows.length > 0;
        this.skeletonLoading = false;
        common_vendor.index.stopPullDownRefresh();
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err || "附近订单查询失败",
          icon: "none",
          duration: 3e3
        });
      });
    }
  }
};
if (!Array) {
  const _easycom_nut_skeleton2 = common_vendor.resolveComponent("nut-skeleton");
  const _easycom_nut_tag2 = common_vendor.resolveComponent("nut-tag");
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_button2 = common_vendor.resolveComponent("nut-button");
  const _easycom_nut_empty2 = common_vendor.resolveComponent("nut-empty");
  const _easycom_nut_divider2 = common_vendor.resolveComponent("nut-divider");
  const _easycom_nut_safe_area2 = common_vendor.resolveComponent("nut-safe-area");
  const _easycom_nut_tab_pane2 = common_vendor.resolveComponent("nut-tab-pane");
  const _easycom_nut_tabs2 = common_vendor.resolveComponent("nut-tabs");
  const _easycom_nut_popup2 = common_vendor.resolveComponent("nut-popup");
  (_easycom_nut_skeleton2 + _easycom_nut_tag2 + _easycom_nut_cell2 + _easycom_nut_button2 + _easycom_nut_empty2 + _easycom_nut_divider2 + _easycom_nut_safe_area2 + _easycom_nut_tab_pane2 + _easycom_nut_tabs2 + _easycom_nut_popup2)();
}
const _easycom_nut_skeleton = () => "../../../node-modules/nutui-uniapp/components/skeleton/skeleton.js";
const _easycom_nut_tag = () => "../../../node-modules/nutui-uniapp/components/tag/tag.js";
const _easycom_nut_cell = () => "../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_button = () => "../../../node-modules/nutui-uniapp/components/button/button.js";
const _easycom_nut_empty = () => "../../../node-modules/nutui-uniapp/components/empty/empty.js";
const _easycom_nut_divider = () => "../../../node-modules/nutui-uniapp/components/divider/divider.js";
const _easycom_nut_safe_area = () => "../../../node-modules/nutui-uniapp/components/safearea/safearea.js";
const _easycom_nut_tab_pane = () => "../../../node-modules/nutui-uniapp/components/tabpane/tabpane.js";
const _easycom_nut_tabs = () => "../../../node-modules/nutui-uniapp/components/tabs/tabs.js";
const _easycom_nut_popup = () => "../../../node-modules/nutui-uniapp/components/popup/popup.js";
if (!Math) {
  (_easycom_nut_skeleton + _easycom_nut_tag + _easycom_nut_cell + _easycom_nut_button + _easycom_nut_empty + _easycom_nut_divider + _easycom_nut_safe_area + _easycom_nut_tab_pane + _easycom_nut_tabs + _easycom_nut_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f(6, (item, index, i0) => {
      return {
        a: index,
        b: "4413c354-2-" + i0 + ",4413c354-1"
      };
    }),
    b: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "2"
    }),
    c: $data.skeletonLoading,
    d: common_vendor.f($data.rows, (item, index, i0) => {
      return common_vendor.e({
        a: item.serviceType == 0
      }, item.serviceType == 0 ? {
        b: "4413c354-3-" + i0 + ",4413c354-1",
        c: common_vendor.p({
          ["custom-color"]: "#e9f7ff",
          ["text-color"]: "#248fce"
        })
      } : {}, {
        d: item.serviceType == 1
      }, item.serviceType == 1 ? {
        e: "4413c354-4-" + i0 + ",4413c354-1",
        f: common_vendor.p({
          ["custom-color"]: "#f9e2c0",
          ["text-color"]: "#ef940d"
        })
      } : {}, {
        g: item.serviceType == 2
      }, item.serviceType == 2 ? {
        h: "4413c354-5-" + i0 + ",4413c354-1",
        i: common_vendor.p({
          ["custom-color"]: "#f9dfff",
          ["text-color"]: "#e077ec"
        })
      } : {}, {
        j: item.recommended
      }, item.recommended ? {
        k: "4413c354-6-" + i0 + ",4413c354-1",
        l: common_vendor.p({
          ["custom-color"]: "#e7fff2",
          ["text-color"]: "#07C160"
        })
      } : {}, {
        m: common_vendor.t(item.tag),
        n: item.status == 0
      }, item.status == 0 ? {} : {}, {
        o: item.status == 1
      }, item.status == 1 ? {} : {}, {
        p: item.status == 2
      }, item.status == 2 ? {} : {}, {
        q: item.status == 3
      }, item.status == 3 ? {} : {}, {
        r: item.status == 4
      }, item.status == 4 ? {} : {}, {
        s: item.status == 10
      }, item.status == 10 ? {} : {}, {
        t: item.status == 11
      }, item.status == 11 ? {} : {}, {
        v: item.startAddress != null
      }, item.startAddress != null ? {
        w: common_assets._imports_0,
        x: "4413c354-7-" + i0 + ",4413c354-1",
        y: common_vendor.p({
          title: item.startAddress.title + "" + item.startAddress.detail
        })
      } : {}, {
        z: "4413c354-8-" + i0 + ",4413c354-1",
        A: common_vendor.p({
          title: item.endAddress.title + "" + item.endAddress.detail
        }),
        B: common_vendor.t(item.totalAmount),
        C: common_vendor.t(item.timeAgo),
        D: item.distanceToPickupText
      }, item.distanceToPickupText ? {
        E: common_vendor.t(item.distanceToPickupText)
      } : {}, {
        F: item.recommendReason
      }, item.recommendReason ? {
        G: common_vendor.t(item.recommendReason)
      } : {}, {
        H: common_vendor.o(($event) => $options.toOrderDetailRunner(item), index),
        I: "4413c354-9-" + i0 + ",4413c354-1",
        J: index
      });
    }),
    e: common_assets._imports_1,
    f: common_vendor.p({
      type: "info"
    }),
    g: !$data.skeletonLoading,
    h: common_vendor.p({
      description: "暂无数据"
    }),
    i: $data.total == 0 && !$data.skeletonLoading,
    j: common_vendor.p({
      dashed: true
    }),
    k: !$data.hasMore && $data.total != 0 && !$data.skeletonLoading,
    l: common_vendor.p({
      position: "bottom"
    }),
    m: common_vendor.p({
      title: "全部订单"
    }),
    n: common_vendor.f(6, (item, index, i0) => {
      return {
        a: index,
        b: "4413c354-14-" + i0 + ",4413c354-13"
      };
    }),
    o: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "2"
    }),
    p: $data.skeletonLoading,
    q: common_vendor.f($data.rows, (item, index, i0) => {
      return common_vendor.e({
        a: item.serviceType == 0
      }, item.serviceType == 0 ? {
        b: "4413c354-15-" + i0 + ",4413c354-13",
        c: common_vendor.p({
          ["custom-color"]: "#e9f7ff",
          ["text-color"]: "#248fce"
        })
      } : {}, {
        d: item.serviceType == 1
      }, item.serviceType == 1 ? {
        e: "4413c354-16-" + i0 + ",4413c354-13",
        f: common_vendor.p({
          ["custom-color"]: "#f9e2c0",
          ["text-color"]: "#ef940d"
        })
      } : {}, {
        g: item.serviceType == 2
      }, item.serviceType == 2 ? {
        h: "4413c354-17-" + i0 + ",4413c354-13",
        i: common_vendor.p({
          ["custom-color"]: "#f9dfff",
          ["text-color"]: "#e077ec"
        })
      } : {}, {
        j: item.recommended
      }, item.recommended ? {
        k: "4413c354-18-" + i0 + ",4413c354-13",
        l: common_vendor.p({
          ["custom-color"]: "#e7fff2",
          ["text-color"]: "#07C160"
        })
      } : {}, {
        m: common_vendor.t(item.tag),
        n: item.status == 0
      }, item.status == 0 ? {} : {}, {
        o: item.status == 1
      }, item.status == 1 ? {} : {}, {
        p: item.status == 2
      }, item.status == 2 ? {} : {}, {
        q: item.status == 3
      }, item.status == 3 ? {} : {}, {
        r: item.status == 4
      }, item.status == 4 ? {} : {}, {
        s: item.status == 10
      }, item.status == 10 ? {} : {}, {
        t: item.status == 11
      }, item.status == 11 ? {} : {}, {
        v: item.startAddress != null
      }, item.startAddress != null ? {
        w: common_assets._imports_0,
        x: "4413c354-19-" + i0 + ",4413c354-13",
        y: common_vendor.p({
          title: item.startAddress.title + "" + item.startAddress.detail
        })
      } : {}, {
        z: "4413c354-20-" + i0 + ",4413c354-13",
        A: common_vendor.p({
          title: item.endAddress.title + "" + item.endAddress.detail
        }),
        B: common_vendor.t(item.totalAmount),
        C: common_vendor.t(item.timeAgo),
        D: item.distanceToPickupText
      }, item.distanceToPickupText ? {
        E: common_vendor.t(item.distanceToPickupText)
      } : {}, {
        F: item.recommendReason
      }, item.recommendReason ? {
        G: common_vendor.t(item.recommendReason)
      } : {}, {
        H: common_vendor.o(($event) => $options.toOrderDetailRunner(item), index),
        I: "4413c354-21-" + i0 + ",4413c354-13",
        J: index
      });
    }),
    r: common_assets._imports_1,
    s: common_vendor.p({
      type: "info"
    }),
    t: !$data.skeletonLoading,
    v: common_vendor.p({
      description: "暂无数据"
    }),
    w: $data.total == 0 && !$data.skeletonLoading,
    x: common_vendor.p({
      dashed: true
    }),
    y: !$data.hasMore && $data.total != 0 && !$data.skeletonLoading,
    z: common_vendor.p({
      position: "bottom"
    }),
    A: common_vendor.p({
      title: "待接单"
    }),
    B: common_vendor.o($options.tabChange, "05"),
    C: common_vendor.o(($event) => $data.tabValue = $event, "fd"),
    D: common_vendor.p({
      modelValue: $data.tabValue
    }),
    E: $data.recommendedOrder
  }, $data.recommendedOrder ? common_vendor.e({
    F: common_vendor.t($data.recommendedOrder.title || "附近新订单"),
    G: common_vendor.t($data.recommendedOrder.payableAmount || "--"),
    H: common_vendor.t($data.recommendedOrder.pickupTitle || "取件地址"),
    I: common_vendor.t($data.recommendedOrder.deliveryTitle || "送达地址"),
    J: $data.recommendedOrder.distanceToPickupText
  }, $data.recommendedOrder.distanceToPickupText ? {
    K: common_vendor.t($data.recommendedOrder.distanceToPickupText)
  } : {}, {
    L: $data.recommendedOrder.dispatchScore
  }, $data.recommendedOrder.dispatchScore ? {
    M: common_vendor.t($data.recommendedOrder.dispatchScore)
  } : {}, {
    N: $data.recommendedOrder.recommendReason
  }, $data.recommendedOrder.recommendReason ? {
    O: common_vendor.t($data.recommendedOrder.recommendReason)
  } : {}, {
    P: common_vendor.o($options.viewRecommendedOrder, "f7"),
    Q: common_vendor.o($options.acceptRecommendedOrder, "97"),
    R: common_vendor.p({
      loading: $data.acceptingRecommend
    }),
    S: common_vendor.o((...args) => $options.closeRecommendPopup && $options.closeRecommendPopup(...args), "c0")
  }) : {}, {
    T: common_vendor.o(($event) => $data.showRecommendPopup = $event, "8b"),
    U: common_vendor.p({
      position: "bottom",
      round: true,
      ["safe-area-inset-bottom"]: true,
      visible: $data.showRecommendPopup
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tabBar/order/order.js.map

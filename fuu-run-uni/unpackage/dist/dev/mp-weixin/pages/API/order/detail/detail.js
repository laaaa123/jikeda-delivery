"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_apis_order = require("../../../../request/apis/order.js");
const common_assets = require("../../../../common/assets.js");
common_vendor.dayjs.extend(common_vendor.relativeTime);
common_vendor.dayjs.locale("zh-cn");
const _sfc_main = {
  data() {
    return {
      showPricePopup: false,
      visible1: false,
      appealList: [],
      showOrderProgressPopup: false,
      orderSteps: [],
      config: {},
      defaultCompletionImageList: [],
      showCompletionImagePopup: false,
      skeletonLoading: true,
      collapseText: "展开订单信息",
      cancelForm: {
        orderId: null,
        cancelReason: null
      },
      visibleConfirmDialog: false,
      visibleCancelDialog: false,
      title: "Hello",
      showNav: false,
      userInfo: {
        userWx: {}
      },
      visible1: false,
      //检查有没有选择校区dialog
      showFilePopup: false,
      showImagePopup: false,
      cancelBeforeText: "",
      order: {
        attachFiles: [],
        attachImages: [],
        completionImages: [],
        avatarRunner: null,
        nicknameRunner: null,
        orderMain: {
          startAddress: null,
          endAddress: null
        },
        orderPayment: {},
        progress: {}
      },
      countdownStart: Date.now(),
      countdownEnd: Date.now() + 10 * 1e3
    };
  },
  onPageScroll(e) {
    if (e.scrollTop > 48) {
      this.showNav = true;
    } else {
      this.showNav = false;
    }
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:490", "detail onLoad");
    const checkOperationStatus = setInterval(() => {
      if (this.$store.state.appLaunch) {
        this.skeletonLoading = true;
        this.config = this.$store.state.config;
        this.getDetail(options.id);
        clearInterval(checkOperationStatus);
        common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:497", "首页的js文件中的代码执行");
      }
    }, 100);
  },
  onShow() {
  },
  onPullDownRefresh() {
    this.getDetail(this.order.orderMain.id);
  },
  methods: {
    toHome() {
      common_vendor.index.redirectTo({
        url: "/pages/tabBar/index/index"
      });
    },
    openLocation(address) {
      common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:517", address);
      common_vendor.index.openLocation({
        // 目标位置的经纬度
        latitude: parseFloat(address.lat),
        longitude: parseFloat(address.lon),
        // 目标位置的名称
        name: address.title,
        // 目标位置的详细地址
        address: address.detail,
        // 地图缩放比例
        scale: 18,
        // 调用成功时的回调函数
        success: function(res) {
          common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:530", "调用成功：", res);
        },
        // 调用失败时的回调函数
        fail: function(res) {
          common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:534", "调用失败：", res);
        },
        // 调用完成时的回调函数
        complete: function(res) {
          common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:538", "调用完成：", res);
        }
      });
    },
    cancelBefore() {
      request_apis_order.getCancelBefore(this.order.orderMain.id).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:544", res);
        this.cancelBeforeText = res.data;
        this.visibleCancelDialog = true;
      });
    },
    toChat() {
      const SUBSCRIBE_ID = "nFzHoJjaKP8W6jdiFZkXsX6Z2A1u6O1F7wGrNAUpBlY";
      let that = this;
      if (common_vendor.wx$1.requestSubscribeMessage) {
        common_vendor.wx$1.requestSubscribeMessage({
          tmplIds: [SUBSCRIBE_ID],
          success(res) {
            common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:556", res);
          },
          fail(res) {
            common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:559", res);
          },
          complete() {
            common_vendor.index.navigateTo({
              url: "/pages/API/chat/chat?orderId=" + that.order.orderMain.id
            });
          }
        });
      } else {
        common_vendor.wx$1.showModal({
          title: "提示",
          content: "请更新您微信版本，来获取订阅消息功能",
          showCancel: false
        });
      }
    },
    previewAppealedImage(index, index1) {
      let images = this.appealList[index].imageUrls;
      common_vendor.index.previewImage({
        current: index1,
        urls: images
      });
    },
    showActionProcess() {
      common_vendor.index.showLoading();
      request_apis_order.getAppealOrder(this.order.orderMain.id).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:586", res);
        this.appealList = res.data;
        this.visible1 = true;
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err,
          icon: "none",
          duration: 2e3
        });
      }).finally((res) => {
        common_vendor.index.hideLoading();
      });
    },
    toAppeal() {
      common_vendor.index.navigateTo({
        url: "/pages/API/order/appeal/appeal?orderId=" + this.order.orderMain.id
      });
    },
    getPhone() {
      common_vendor.index.showLoading();
      request_apis_order.getPhoneOrder(this.order.orderMain.id).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:608", res);
        common_vendor.index.makePhoneCall({
          phoneNumber: res.data.phone
        });
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err,
          icon: "none",
          duration: 2e3
        });
      }).finally((res) => {
        common_vendor.index.hideLoading();
      });
    },
    confirmSubmit() {
      common_vendor.index.showLoading();
      request_apis_order.getConfirmOrder(this.order.orderMain.id).then((res) => {
        common_vendor.index.showToast({
          title: "已完成",
          icon: "none",
          duration: 2e3
        });
        this.visibleConfirmDialog = false;
        this.getDetail(this.order.orderMain.id);
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err,
          icon: "none",
          duration: 2e3
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    previewCompletionImage(index) {
      let imageList = this.order.completionImages.map((item) => {
        return item.fileUrl;
      });
      common_vendor.index.previewImage({
        current: index,
        urls: imageList
      });
    },
    previewImage(index) {
      let imageList = this.order.attachImages.map((item) => {
        return item.fileUrl;
      });
      common_vendor.index.previewImage({
        current: index,
        urls: imageList
      });
    },
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0)
        return "0 B";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    viewFile(item) {
      common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:671", item);
      common_vendor.index.downloadFile({
        url: item.fileUrl,
        //仅为测试接口，并非真实的
        success: function(res) {
          var filePath = res.tempFilePath;
          common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:677", filePath);
          common_vendor.index.openDocument({
            filePath,
            showMenu: true,
            success: function(res2) {
              common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:682", "打开文档成功");
              common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:683", res2);
            },
            fail(err) {
              common_vendor.index.showToast({
                title: err,
                icon: "none",
                duration: 3e3
              });
            }
          });
        },
        fail(err) {
          common_vendor.index.showToast({
            title: err,
            icon: "none",
            duration: 3e3
          });
        }
      });
    },
    collapseChange(modelValue, currName, status) {
      common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:704", status);
      if (status)
        this.collapseText = "收起订单信息";
      else
        this.collapseText = "展开订单信息";
    },
    countdownHandleEnd() {
      common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:710", "结束及时");
      this.getDetail(this.order.orderMain.id);
    },
    copyOrderId(id) {
      common_vendor.index.setClipboardData({
        data: id,
        success: function() {
          common_vendor.index.showToast({
            title: "复制成功",
            icon: "none"
          });
        },
        fail: function() {
          common_vendor.index.showToast({
            title: "复制失败",
            icon: "none"
          });
        }
      });
    },
    cancelSubmit() {
      this.cancelForm.orderId = this.order.orderMain.id;
      request_apis_order.postCancelOrder(this.cancelForm).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:733", res);
        setTimeout(() => {
          this.getDetail(this.order.orderMain.id);
        }, 800);
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err,
          icon: "none",
          duration: 3e3
        });
      });
    },
    payAgain() {
      let that = this;
      request_apis_order.getPayAgain(this.order.orderMain.id).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:749", res);
        common_vendor.index.requestPayment({
          timeStamp: res.data.timeStamp,
          // 时间戳
          nonceStr: res.data.nonceStr,
          // 随机字符串
          package: res.data.packageValue,
          signType: res.data.signType,
          // 签名算法
          paySign: res.data.paySign,
          // 签名
          success: function(res2) {
            common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:757", "支付成功", res2);
            setTimeout(() => {
              that.getDetail(res2.data.orderId);
            }, 1500);
          },
          fail: function(err) {
            common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:764", "支付失败", err);
            common_vendor.index.showToast({
              title: "取消支付",
              icon: "none",
              duration: 2e3
            });
          }
        });
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err,
          icon: "none",
          duration: 3e3
        });
      });
    },
    back() {
      common_vendor.index.navigateBack();
    },
    getDetail(id) {
      let that = this;
      request_apis_order.getDetailOrderUser(id).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:786", res);
        let data = res.data;
        data.orderPayment = data.orderPayment || {};
        data.progress = data.progress || {};
        data.attachFiles = data.attachFiles || [];
        data.attachImages = data.attachImages || [];
        data.completionImages = data.completionImages || [];
        let status = data.orderMain.status;
        if (status == 0)
          data.orderMain.statusText = "待支付";
        if (status == 1)
          data.orderMain.statusText = "待接单";
        if (status == 2)
          data.orderMain.statusText = "待配送";
        if (status == 3)
          data.orderMain.statusText = "配送中";
        if (status == 4)
          data.orderMain.statusText = "已送达";
        if (status == 5)
          data.orderMain.statusText = "已取消";
        if (status == 10)
          data.orderMain.statusText = "已完成";
        if (status == 11)
          data.orderMain.statusText = "已关闭";
        let serviceType = data.orderMain.serviceType;
        if (serviceType == 0)
          data.orderMain.serviceTypeText = "帮取送";
        if (serviceType == 1)
          data.orderMain.serviceTypeText = "帮买";
        if (serviceType == 2)
          data.orderMain.serviceTypeText = "万能帮";
        data.orderMain.typeText = data.orderMain.serviceTypeText + "-" + data.orderMain.tag;
        let attachFiles = data.attachFiles;
        for (var i = 0; i < attachFiles.length; i++) {
          attachFiles[i].fileSize = that.formatBytes(attachFiles[i].fileSize);
          attachFiles[i].icon = that.getFileIcon(attachFiles[i].fileType);
        }
        data.attachFiles = attachFiles;
        if (data.completionImages.length != 0) {
          let tmpList = this.convertCompletionImages(data.completionImages);
          this.defaultCompletionImageList = tmpList;
        }
        if (data.orderMain.status == 0) {
          const createTimestamp = common_vendor.dayjs(data.orderMain.createTime, "YYYY-MM-DD HH:mm:ss").valueOf();
          const nowstamp = common_vendor.dayjs(Date.now(), "YYYY-MM-DD HH:mm:ss").valueOf();
          const stamp = this.config.payCancelTtl * 60 * 1e3 + 2e3 - (nowstamp - createTimestamp);
          this.countdownEnd = Date.now() + stamp;
        }
        if (data.orderMain.status == 1) {
          const createTimestamp = common_vendor.dayjs(data.orderMain.createTime, "YYYY-MM-DD HH:mm:ss").valueOf();
          const nowstamp = common_vendor.dayjs(Date.now(), "YYYY-MM-DD HH:mm:ss").valueOf();
          const stamp = data.orderMain.autoCancelTtl * 1e3 + 2e3 - (nowstamp - createTimestamp);
          this.countdownEnd = Date.now() + stamp;
        }
        if (data.orderMain.status == 4) {
          const createTimestamp = common_vendor.dayjs(data.orderMain.createTime, "YYYY-MM-DD HH:mm:ss").valueOf();
          const nowstamp = common_vendor.dayjs(Date.now(), "YYYY-MM-DD HH:mm:ss").valueOf();
          const stamp = this.config.autoCompleteTtl * 60 * 1e3 * 60 + 2e3 - (nowstamp - createTimestamp);
          this.countdownEnd = Date.now() + stamp;
        }
        this.order = data;
        that.skeletonLoading = false;
        common_vendor.index.stopPullDownRefresh();
        this.buildTimeLine();
      }).catch((err) => {
        common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:847", err);
        common_vendor.index.showToast({
          title: err,
          icon: "none",
          duration: 3e3
        });
      });
    },
    getCountEnd() {
    },
    getFileIcon(extension) {
      const fileTypes = {
        documents: {
          extensions: ["pdf"],
          icon: "pdf-icon.png"
          // PDF文件图标
        },
        word: {
          extensions: ["doc", "docx"],
          icon: "word-icon.png"
          // Word文件图标
        },
        excel: {
          extensions: ["xls", "xlsx"],
          icon: "excel-icon.png"
          // Excel文件图标
        },
        powerpoint: {
          extensions: ["ppt", "pptx"],
          icon: "ppt-icon.png"
          // PowerPoint文件图标
        },
        unknown: {
          extensions: [],
          icon: "unknown-icon.png"
          // 未知文件类型图标
        }
      };
      for (let category in fileTypes) {
        if (fileTypes[category].extensions.includes(extension)) {
          return fileTypes[category].icon;
        }
      }
      return fileTypes.unknown.icon;
    },
    buildTimeLine() {
      let orderMain = this.order.orderMain || {};
      let orderProgress = this.order.progress || {};
      let orderPayment = this.order.orderPayment || {};
      let createTime = orderMain.createTime;
      let paymentTime = orderPayment.paymentTime;
      let refundPendingTime = orderPayment.refundPendingTime;
      let refundTime = orderPayment.refundTime;
      let acceptedTime = orderProgress.acceptedTime;
      let deliveringTime = orderProgress.deliveringTime;
      let deliveredTime = orderProgress.deliveredTime;
      let completedTime = orderProgress.completedTime;
      let cancelTime = orderProgress.cancelTime;
      let times = [
        { time: createTime, description: "订单已提交" },
        { time: paymentTime, description: "支付成功" },
        { time: refundPendingTime, description: "开始退款" },
        { time: refundTime, description: "退款已到账" },
        { time: acceptedTime, description: "跑腿员已接单" },
        { time: deliveringTime, description: "配送中" },
        { time: deliveredTime, description: "订单已送达" },
        { time: completedTime, description: "订单已完成" },
        { time: cancelTime, description: "订单已取消" }
      ];
      common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:917", times);
      this.orderSteps = times.filter((item) => item.time).sort((a, b) => new Date(b.time.replace(/-/g, "/")) - new Date(a.time.replace(/-/g, "/")));
      common_vendor.index.__f__("log", "at pages/API/order/detail/detail.vue:922", this.orderSteps);
    },
    // 格式化时间
    formatTime(time) {
      if (!time)
        return "";
      return common_vendor.dayjs(time).format("MM月DD日 HH:mm");
    },
    convertCompletionImages(data) {
      let tmpList = [];
      for (var i = 0; i < data.length; i++) {
        let tmpData = {};
        tmpData.uid = data[i].id;
        tmpData.name = data[i].fileName;
        tmpData.url = data[i].fileUrl;
        tmpData.type = "image";
        tmpData.status = "success";
        tmpList.push(tmpData);
      }
      return tmpList;
    }
  }
};
if (!Array) {
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_navbar2 = common_vendor.resolveComponent("nut-navbar");
  const _easycom_nut_skeleton2 = common_vendor.resolveComponent("nut-skeleton");
  const _easycom_nut_countdown2 = common_vendor.resolveComponent("nut-countdown");
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_ellipsis2 = common_vendor.resolveComponent("nut-ellipsis");
  const _easycom_nut_collapse_item2 = common_vendor.resolveComponent("nut-collapse-item");
  const _easycom_nut_collapse2 = common_vendor.resolveComponent("nut-collapse");
  const _easycom_nut_safe_area2 = common_vendor.resolveComponent("nut-safe-area");
  const _easycom_nut_dialog2 = common_vendor.resolveComponent("nut-dialog");
  const _easycom_nut_input2 = common_vendor.resolveComponent("nut-input");
  const _easycom_nut_popup2 = common_vendor.resolveComponent("nut-popup");
  const _easycom_nut_action_sheet2 = common_vendor.resolveComponent("nut-action-sheet");
  const _component_template = common_vendor.resolveComponent("template");
  (_easycom_nut_icon2 + _easycom_nut_navbar2 + _easycom_nut_skeleton2 + _easycom_nut_countdown2 + _easycom_nut_cell2 + _easycom_nut_ellipsis2 + _easycom_nut_collapse_item2 + _easycom_nut_collapse2 + _easycom_nut_safe_area2 + _easycom_nut_dialog2 + _easycom_nut_input2 + _easycom_nut_popup2 + _easycom_nut_action_sheet2 + _component_template)();
}
const _easycom_nut_icon = () => "../../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_navbar = () => "../../../../node-modules/nutui-uniapp/components/navbar/navbar.js";
const _easycom_nut_skeleton = () => "../../../../node-modules/nutui-uniapp/components/skeleton/skeleton.js";
const _easycom_nut_countdown = () => "../../../../node-modules/nutui-uniapp/components/countdown/countdown.js";
const _easycom_nut_cell = () => "../../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_ellipsis = () => "../../../../node-modules/nutui-uniapp/components/ellipsis/ellipsis.js";
const _easycom_nut_collapse_item = () => "../../../../node-modules/nutui-uniapp/components/collapseitem/collapseitem.js";
const _easycom_nut_collapse = () => "../../../../node-modules/nutui-uniapp/components/collapse/collapse.js";
const _easycom_nut_safe_area = () => "../../../../node-modules/nutui-uniapp/components/safearea/safearea.js";
const _easycom_nut_dialog = () => "../../../../node-modules/nutui-uniapp/components/dialog/dialog.js";
const _easycom_nut_input = () => "../../../../node-modules/nutui-uniapp/components/input/input.js";
const _easycom_nut_popup = () => "../../../../node-modules/nutui-uniapp/components/popup/popup.js";
const _easycom_nut_action_sheet = () => "../../../../node-modules/nutui-uniapp/components/actionsheet/actionsheet.js";
if (!Math) {
  (_easycom_nut_icon + _easycom_nut_navbar + _easycom_nut_skeleton + _easycom_nut_countdown + _easycom_nut_cell + _easycom_nut_ellipsis + _easycom_nut_collapse_item + _easycom_nut_collapse + _easycom_nut_safe_area + _easycom_nut_dialog + _easycom_nut_input + _easycom_nut_popup + _easycom_nut_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.back, "26"),
    b: common_vendor.p({
      name: "left"
    }),
    c: common_vendor.t($data.showNav ? "订单" + $data.order.orderMain.statusText : ""),
    d: common_vendor.p({
      ["safe-area-inset-top"]: "true",
      fixed: "true",
      placeholder: "false"
    }),
    e: common_vendor.t($data.order.orderMain.statusText),
    f: common_vendor.o(($event) => $data.showOrderProgressPopup = true, "04"),
    g: common_vendor.o($options.back, "88"),
    h: common_vendor.p({
      name: "right"
    }),
    i: !$data.skeletonLoading,
    j: common_vendor.p({
      title: false,
      width: "30%",
      height: "24px",
      animated: true,
      row: "1"
    }),
    k: $data.skeletonLoading,
    l: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "3"
    }),
    m: $data.skeletonLoading,
    n: $data.order.orderMain.status == 0
  }, $data.order.orderMain.status == 0 ? {
    o: common_vendor.o(($event) => $options.countdownHandleEnd(), "16"),
    p: common_vendor.p({
      format: "mm:ss",
      ["end-time"]: $data.countdownEnd,
      ["start-time"]: $data.countdownStart
    }),
    q: common_vendor.p({
      ["custom-color"]: "#1296db",
      name: "/static/icons/微信支付.png"
    }),
    r: common_vendor.o((...args) => $options.payAgain && $options.payAgain(...args), "01"),
    s: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/取消订单.png"
    }),
    t: common_vendor.o(($event) => $data.visibleCancelDialog = true, "f2")
  } : {}, {
    v: $data.order.orderMain.status == 1
  }, $data.order.orderMain.status == 1 ? {
    w: common_vendor.o(($event) => $options.countdownHandleEnd(), "b4"),
    x: common_vendor.p({
      ["end-time"]: $data.countdownEnd,
      ["start-time"]: $data.countdownStart
    }),
    y: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/取消订单.png"
    }),
    z: common_vendor.o((...args) => $options.cancelBefore && $options.cancelBefore(...args), "1b")
  } : {}, {
    A: $data.order.orderMain.status == 2
  }, $data.order.orderMain.status == 2 ? {
    B: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/取消订单.png"
    }),
    C: common_vendor.o((...args) => $options.cancelBefore && $options.cancelBefore(...args), "e5")
  } : {}, {
    D: $data.order.orderMain.status == 3
  }, $data.order.orderMain.status == 3 ? {
    E: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/取消订单.png"
    }),
    F: common_vendor.o((...args) => $options.cancelBefore && $options.cancelBefore(...args), "12")
  } : {}, {
    G: $data.order.orderMain.status == 4
  }, $data.order.orderMain.status == 4 ? {
    H: common_vendor.o(($event) => $options.countdownHandleEnd(), "8f"),
    I: common_vendor.p({
      ["end-time"]: $data.countdownEnd,
      ["start-time"]: $data.countdownStart
    }),
    J: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/完成订单.png"
    }),
    K: common_vendor.o(($event) => $data.visibleConfirmDialog = true, "6c"),
    L: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/查看订单.png"
    }),
    M: common_vendor.o(($event) => $data.showCompletionImagePopup = true, "68"),
    N: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/订单申诉.png"
    }),
    O: common_vendor.o((...args) => $options.toAppeal && $options.toAppeal(...args), "83")
  } : {}, {
    P: $data.order.orderMain.status == 5
  }, $data.order.orderMain.status == 5 ? {
    Q: common_vendor.t($data.order.progress.cancelReason == null ? "暂无" : $data.order.progress.cancelReason),
    R: $data.order.orderPayment.paymentStatus == 2,
    S: $data.order.orderPayment.paymentStatus == 3,
    T: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/再来一单.png"
    }),
    U: common_vendor.o(($event) => $data.visibleCancelDialog = true, "13")
  } : {}, {
    V: $data.order.orderMain.status == 10
  }, $data.order.orderMain.status == 10 ? {
    W: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/查看订单.png"
    }),
    X: common_vendor.o(($event) => $data.showCompletionImagePopup = true, "8a")
  } : {}, {
    Y: $data.order.orderMain.status == 11
  }, $data.order.orderMain.status == 11 ? {
    Z: $data.order.orderPayment.paymentStatus == 2,
    aa: $data.order.orderPayment.paymentStatus == 3,
    ab: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/查看申诉.png"
    }),
    ac: common_vendor.o((...args) => $options.showActionProcess && $options.showActionProcess(...args), "37"),
    ad: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/订单申诉.png"
    }),
    ae: common_vendor.o((...args) => $options.toAppeal && $options.toAppeal(...args), "d5")
  } : {}, {
    af: !$data.skeletonLoading,
    ag: $data.order.avatarRunner,
    ah: common_vendor.t($data.order.nicknameRunner),
    ai: common_vendor.o($options.toChat, "c6"),
    aj: common_vendor.p({
      name: "/static/icons/消息.png"
    }),
    ak: common_vendor.o($options.getPhone, "75"),
    al: common_vendor.p({
      name: "/static/icons/电话.png"
    }),
    am: $data.order.orderMain.runnerId != null && !$data.skeletonLoading,
    an: common_vendor.p({
      avatar: true,
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "1"
    }),
    ao: $data.order.orderMain.runnerId != null && $data.skeletonLoading,
    ap: common_vendor.p({
      title: "类型",
      desc: $data.order.orderMain.typeText
    }),
    aq: $data.order.orderMain.startAddress == null && $data.order.orderMain.serviceType == 1
  }, $data.order.orderMain.startAddress == null && $data.order.orderMain.serviceType == 1 ? {
    ar: common_assets._imports_0,
    as: common_vendor.p({
      title: "就近购买",
      ["sub-title"]: ""
    })
  } : {}, {
    at: $data.order.orderMain.startAddress != null
  }, $data.order.orderMain.startAddress != null ? {
    av: common_assets._imports_0,
    aw: common_vendor.o(($event) => $options.openLocation($data.order.orderMain.startAddress), "18"),
    ax: common_vendor.p({
      title: $data.order.orderMain.startAddress.title + " " + $data.order.orderMain.startAddress.detail,
      ["sub-title"]: $data.order.orderMain.startAddress.name + " " + $data.order.orderMain.startAddress.phone
    })
  } : {}, {
    ay: $data.order.orderMain.endAddress != null
  }, $data.order.orderMain.endAddress != null ? {
    az: common_assets._imports_1,
    aA: common_vendor.o(($event) => $options.openLocation($data.order.orderMain.endAddress), "45"),
    aB: common_vendor.p({
      title: $data.order.orderMain.endAddress.title + " " + $data.order.orderMain.endAddress.detail,
      ["sub-title"]: $data.order.orderMain.endAddress.name + " " + $data.order.orderMain.endAddress.phone
    })
  } : {}, {
    aC: common_vendor.p({
      direction: "end",
      rows: "2",
      expandText: "展开",
      collapseText: "收起",
      content: "备注:" + $data.order.orderMain.detail
    }),
    aD: $data.order.attachImages.length > 0
  }, $data.order.attachImages.length > 0 ? {
    aE: common_vendor.o(($event) => $data.showImagePopup = true, "78"),
    aF: common_vendor.p({
      ["is-link"]: true,
      title: "附加图片",
      desc: $data.order.attachImages.length + "张"
    })
  } : {}, {
    aG: $data.order.attachFiles.length > 0
  }, $data.order.attachFiles.length > 0 ? {
    aH: common_vendor.o(($event) => $data.showFilePopup = true, "68"),
    aI: common_vendor.p({
      ["is-link"]: true,
      title: "附加文件",
      desc: $data.order.attachFiles.length + "个"
    })
  } : {}, {
    aJ: common_vendor.o(($event) => $data.showPricePopup = true, "67"),
    aK: common_vendor.p({
      ["is-link"]: true,
      title: "实付款",
      desc: "￥" + $data.order.orderPayment.actualPayment
    }),
    aL: $data.order.orderMain.weight != null
  }, $data.order.orderMain.weight != null ? {
    aM: common_vendor.p({
      title: "物品重量",
      desc: $data.order.orderMain.weight
    })
  } : {}, {
    aN: common_vendor.p({
      name: "/static/icons/复制.png"
    }),
    aO: common_vendor.o(($event) => $options.copyOrderId($data.order.orderMain.id), "a5"),
    aP: common_vendor.p({
      ["is-link"]: true,
      title: "订单号",
      desc: $data.order.orderMain.id + " "
    }),
    aQ: common_vendor.p({
      title: "下单时间",
      desc: $data.order.orderMain.createTime
    }),
    aR: $data.order.orderMain.gender == 1
  }, $data.order.orderMain.gender == 1 ? {
    aS: common_vendor.p({
      title: "性别限制",
      desc: "男"
    })
  } : {}, {
    aT: $data.order.orderMain.gender == 2
  }, $data.order.orderMain.gender == 2 ? {
    aU: common_vendor.p({
      title: "性别限制",
      desc: "不限制"
    })
  } : {}, {
    aV: $data.order.orderMain.gender == 0
  }, $data.order.orderMain.gender == 0 ? {
    aW: common_vendor.p({
      title: "性别限制",
      desc: "女"
    })
  } : {}, {
    aX: $data.order.orderMain.isTimed == 1
  }, $data.order.orderMain.isTimed == 1 ? {
    aY: common_vendor.p({
      title: "指定配送时间",
      desc: $data.order.orderMain.specifiedTime
    })
  } : {}, {
    aZ: common_vendor.p({
      title: $data.collapseText,
      name: 1,
      rotate: "-180"
    }),
    ba: common_vendor.o($options.collapseChange, "3a"),
    bb: common_vendor.o(($event) => _ctx.activeName = $event, "84"),
    bc: common_vendor.p({
      accordion: true,
      modelValue: _ctx.activeName
    }),
    bd: !$data.skeletonLoading,
    be: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "1"
    }),
    bf: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "5"
    }),
    bg: $data.skeletonLoading,
    bh: common_vendor.p({
      position: "bottom"
    }),
    bi: common_vendor.o(($event) => $data.visibleConfirmDialog = false, "9d"),
    bj: common_vendor.o($options.confirmSubmit, "04"),
    bk: common_vendor.o(($event) => $data.visibleConfirmDialog = $event, "19"),
    bl: common_vendor.p({
      content: "确定订单已完成？",
      visible: $data.visibleConfirmDialog
    }),
    bm: common_vendor.t($data.cancelBeforeText),
    bn: $data.cancelBeforeText != "",
    bo: common_vendor.o(($event) => $data.cancelForm.cancelReason = $event, "63"),
    bp: common_vendor.p({
      type: "text",
      placeholder: "填写原因",
      ["max-length"]: "10",
      ["show-word-limit"]: true,
      modelValue: $data.cancelForm.cancelReason
    }),
    bq: common_vendor.o(($event) => $data.visibleCancelDialog = false, "de"),
    br: common_vendor.o($options.cancelSubmit, "0b"),
    bs: common_vendor.o(($event) => $data.visibleCancelDialog = $event, "cd"),
    bt: common_vendor.p({
      title: "确定取消订单？",
      visible: $data.visibleCancelDialog
    }),
    bv: common_vendor.f($data.order.attachImages, (item, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.previewImage(index), index),
        b: item.fileUrl,
        c: index
      };
    }),
    bw: common_vendor.o(($event) => $data.showImagePopup = $event, "de"),
    bx: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showImagePopup
    }),
    by: common_vendor.f($data.order.attachFiles, (item, index, i0) => {
      return {
        a: "/static/fileicon/" + item.icon,
        b: common_vendor.t(item.fileName),
        c: common_vendor.t(item.fileSize),
        d: common_vendor.o(($event) => $options.viewFile(item), index),
        e: index
      };
    }),
    bz: common_vendor.o(($event) => $data.showFilePopup = $event, "d8"),
    bA: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showFilePopup
    }),
    bB: common_vendor.f($data.order.completionImages, (item, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.previewCompletionImage(index), index),
        b: item.fileUrl,
        c: index
      };
    }),
    bC: common_vendor.o(($event) => $data.showCompletionImagePopup = $event, "82"),
    bD: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showCompletionImagePopup
    }),
    bE: common_vendor.t($data.order.orderMain.totalAmount),
    bF: common_vendor.t($data.order.orderPayment.additionalAmount),
    bG: common_vendor.o(($event) => $data.showPricePopup = $event, "75"),
    bH: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showPricePopup
    }),
    bI: common_vendor.f($data.orderSteps, (step, index, i0) => {
      return common_vendor.e({
        a: index == $data.orderSteps.length - 1
      }, index == $data.orderSteps.length - 1 ? {
        b: common_assets._imports_2$2
      } : index == 0 ? common_vendor.e({
        d: step.description == "订单已申诉" || step.description == "订单已取消"
      }, step.description == "订单已申诉" || step.description == "订单已取消" ? {
        e: common_assets._imports_3$2
      } : {
        f: common_assets._imports_4$2
      }) : {
        g: common_assets._imports_2$2
      }, {
        c: index == 0,
        h: common_vendor.t(step.description),
        i: common_vendor.t($options.formatTime(step.time)),
        j: index
      });
    }),
    bJ: common_vendor.o(($event) => $data.showOrderProgressPopup = $event, "da"),
    bK: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showOrderProgressPopup
    }),
    bL: common_vendor.f($data.appealList, (item, index, i0) => {
      return common_vendor.e({
        a: item.orderAppeal.appealStatus == 1
      }, item.orderAppeal.appealStatus == 1 ? {
        b: "19cfd5cf-55-" + i0 + "," + ("19cfd5cf-54-" + i0),
        c: common_vendor.p({
          title: "申诉理由",
          desc: item.orderAppeal.appealReason
        }),
        d: common_vendor.f(item.imageUrls, (item1, index1, i1) => {
          return {
            a: common_vendor.o(($event) => $options.previewAppealedImage(index, index1), index),
            b: item1
          };
        }),
        e: index,
        f: "19cfd5cf-56-" + i0 + "," + ("19cfd5cf-54-" + i0),
        g: common_vendor.p({
          title: "真实姓名"
        }),
        h: "19cfd5cf-57-" + i0 + "," + ("19cfd5cf-54-" + i0),
        i: common_vendor.p({
          title: "更新时间",
          desc: item.orderAppeal.updateTime
        }),
        j: common_vendor.t(item.orderAppeal.remarks == "" ? "暂无" : item.orderAppeal.remarks),
        k: "19cfd5cf-54-" + i0 + "," + ("19cfd5cf-53-" + i0),
        l: common_vendor.p({
          title: "已通过",
          name: index,
          value: item.orderAppeal.appealTime
        })
      } : {}, {
        m: item.orderAppeal.appealStatus == 0
      }, item.orderAppeal.appealStatus == 0 ? {
        n: "19cfd5cf-59-" + i0 + "," + ("19cfd5cf-58-" + i0),
        o: common_vendor.p({
          title: "申诉理由",
          desc: item.orderAppeal.appealReason
        }),
        p: common_vendor.f(item.imageUrls, (item1, index1, i1) => {
          return {
            a: common_vendor.o(($event) => $options.previewAppealedImage(index, index1), index),
            b: item1
          };
        }),
        q: index,
        r: "19cfd5cf-60-" + i0 + "," + ("19cfd5cf-58-" + i0),
        s: common_vendor.p({
          title: "真实姓名"
        }),
        t: "19cfd5cf-61-" + i0 + "," + ("19cfd5cf-58-" + i0),
        v: common_vendor.p({
          title: "更新时间",
          desc: item.orderAppeal.updateTime
        }),
        w: common_vendor.t(item.orderAppeal.remarks == "" ? "暂无" : item.orderAppeal.remarks),
        x: "19cfd5cf-58-" + i0 + "," + ("19cfd5cf-53-" + i0),
        y: common_vendor.p({
          title: "已驳回",
          name: index,
          value: item.orderAppeal.appealTime
        })
      } : {}, {
        z: item.orderAppeal.appealStatus == 2
      }, item.orderAppeal.appealStatus == 2 ? {
        A: "19cfd5cf-63-" + i0 + "," + ("19cfd5cf-62-" + i0),
        B: common_vendor.p({
          title: "申诉理由",
          desc: item.orderAppeal.appealReason
        }),
        C: common_vendor.f(item.imageUrls, (item1, index1, i1) => {
          return {
            a: common_vendor.o(($event) => $options.previewAppealedImage(index, index1), index),
            b: item1
          };
        }),
        D: index,
        E: "19cfd5cf-64-" + i0 + "," + ("19cfd5cf-62-" + i0),
        F: common_vendor.p({
          title: "真实姓名"
        }),
        G: "19cfd5cf-65-" + i0 + "," + ("19cfd5cf-62-" + i0),
        H: common_vendor.p({
          title: "更新时间",
          desc: item.orderAppeal.updateTime
        }),
        I: common_vendor.t(item.orderAppeal.remarks == "" ? "暂无" : item.orderAppeal.remarks),
        J: "19cfd5cf-62-" + i0 + "," + ("19cfd5cf-53-" + i0),
        K: common_vendor.p({
          title: "审核中",
          name: index,
          value: item.orderAppeal.appealTime
        })
      } : {}, {
        L: index,
        M: "19cfd5cf-53-" + i0 + ",19cfd5cf-52",
        N: common_vendor.p({
          accordion: true,
          ["v-model"]: index
        })
      });
    }),
    bM: common_vendor.o(($event) => $data.visible1 = $event, "31"),
    bN: common_vendor.p({
      title: "申请记录",
      visible: $data.visible1
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/order/detail/detail.js.map

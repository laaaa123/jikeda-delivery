"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_apis_order = require("../../../../request/apis/order.js");
const request_request = require("../../../../request/request.js");
const common_assets = require("../../../../common/assets.js");
common_vendor.dayjs.extend(common_vendor.relativeTime);
common_vendor.dayjs.locale("zh-cn");
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
      showOrderProgressPopup: false,
      visible1: false,
      appealList: [],
      config: {},
      showImagePopup: false,
      showFilePopup: false,
      showCompletionPopup: false,
      showCompletionImagePopup: false,
      btnCompleteLoading: false,
      btnUpdateImagesLoading: false,
      headers: {
        Authorization: "Bearer " + common_vendor.index.getStorageSync("token"),
        "Content-Type": "multipart/form-data"
      },
      ossList: [],
      uploadUrl: request_request.upload_url,
      uploaderData: {
        type: 3,
        name: ""
      },
      defaultImageList: [],
      // 图片列表
      defaultCompletionImageList: [],
      //已上传的凭证列表
      defaultSuppleImageList: [],
      //补充的凭证列表
      agreeRunnerItems: 0,
      rememberRunnerItems: 0,
      skeletonLoading: true,
      collapseText: "展开订单信息",
      cancelForm: {
        orderId: null,
        cancelReason: null
      },
      visibleCancelDialog: false,
      visibleAcceptDialog: false,
      title: "Hello",
      showNav: false,
      userInfo: {
        userWx: {}
      },
      visible1: false,
      //检查有没有选择校区dialog
      showCompletionPopup: false,
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
      countdownEnd: Date.now() + 10 * 1e3,
      cancelBeforeText: ""
    };
  },
  onLoad(options) {
    this.skeletonLoading = true;
    common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:474", "runner onLoad");
    const checkOperationStatus = setInterval(() => {
      if (this.$store.state.appLaunch) {
        common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:477", options);
        this.initData();
        this.getDetail(options.orderId);
        clearInterval(checkOperationStatus);
        common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:481", "首页的js文件中的代码执行");
      }
    }, 100);
  },
  onReachBottom() {
  },
  onPullDownRefresh() {
    common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:489", 11);
    this.getDetail(this.order.orderMain.id);
  },
  methods: {
    toAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/API/user/setting/agreement/agreement"
      });
    },
    openLocation(address) {
      common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:500", address);
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
          common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:513", "调用成功：", res);
        },
        // 调用失败时的回调函数
        fail: function(res) {
          common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:517", "调用失败：", res);
        },
        // 调用完成时的回调函数
        complete: function(res) {
          common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:521", "调用完成：", res);
        }
      });
    },
    cancelBefore() {
      request_apis_order.getCancelBefore(this.order.orderMain.id).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:527", res);
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
            common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:539", res);
          },
          fail(res) {
            common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:542", res);
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
    viewFile(item) {
      common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:560", item);
      common_vendor.index.downloadFile({
        url: item.fileUrl,
        //仅为测试接口，并非真实的
        success: function(res) {
          var filePath = res.tempFilePath;
          common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:566", filePath);
          common_vendor.index.openDocument({
            filePath,
            showMenu: true,
            success: function(res2) {
              common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:571", "打开文档成功");
              common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:572", res2);
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
    previewImage(index) {
      let imageList = this.order.attachImages.map((item) => {
        return item.fileUrl;
      });
      common_vendor.index.previewImage({
        current: index,
        urls: imageList
      });
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
        common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:611", res);
        this.appealList = res.data;
        this.visible1 = true;
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        common_vendor.index.hideLoading();
      });
    },
    getPhone() {
      common_vendor.index.showLoading();
      request_apis_order.getPhoneOrder(this.order.orderMain.id).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:624", res);
        common_vendor.index.makePhoneCall({
          phoneNumber: res.data.phone
        });
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        common_vendor.index.hideLoading();
      });
    },
    updateImages() {
      this.btnUpdateImagesLoading = true;
      if (this.ossList.length == 0) {
        this.showWarning("凭证不可为空");
        this.btnUpdateImagesLoading = false;
        return;
      }
      let form = {
        orderId: this.order.orderMain.id,
        completionImages: this.ossList
      };
      request_apis_order.postUpdateImages(form).then((res) => {
        this.showCompletionImagePopup = false;
        this.showSuccess("补充成功");
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        this.btnUpdateImagesLoading = false;
        this.getDetail(this.order.orderMain.id);
      });
    },
    completeOrder() {
      if (this.ossList.length == 0) {
        this.showWarning("请先上传凭证");
        return;
      }
      let form = {
        orderId: this.order.orderMain.id,
        completionImages: this.ossList
      };
      this.btnCompleteLoading = true;
      request_apis_order.postCompleteOrder(form).then((res) => {
        this.showCompletionPopup = false;
        this.showSuccess("已提交完成");
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        this.btnCompleteLoading = false;
        this.getDetail(this.order.orderMain.id);
      });
    },
    imageClick(file) {
      file = file.fileItem;
      common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:678", file);
      let imgsArray = [];
      imgsArray[0] = file.url;
      common_vendor.index.previewImage({
        current: 0,
        urls: imgsArray
      });
    },
    oversize(files) {
      common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:687", files);
      this.showWarning("文件大小超出5MB");
    },
    uploadDelete(e) {
      let index = e.index;
      this.ossList.splice(index, 1);
    },
    uploadSuccess(e) {
      common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:695", e);
      let data = e.data.data;
      data = JSON.parse(data);
      let ossId = data.data.ossId;
      this.ossList.push(ossId);
    },
    beginDelivery() {
      common_vendor.index.showLoading();
      request_apis_order.getBeginDelivery(this.order.orderMain.id).then((res) => {
        this.showSuccess("订单配送中");
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        common_vendor.index.hideLoading();
        this.getDetail(this.order.orderMain.id);
      });
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
    collapseChange(modelValue, currName, status) {
      common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:730", status);
      if (status)
        this.collapseText = "收起订单信息";
      else
        this.collapseText = "展开订单信息";
    },
    acceptSubmit() {
      if (this.agreeRunnerItems == 0) {
        this.showWarning("请先同意跑腿协议");
        this.rememberRunnerItems = 0;
        return;
      }
      common_vendor.index.setStorageSync("rememberRunnerItems", this.rememberRunnerItems);
      common_vendor.index.setStorageSync("agreeRunnerItems", this.agreeRunnerItems);
      request_apis_order.getAccept(this.order.orderMain.id).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:744", res);
        this.showSuccess("接单成功");
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        this.getDetail(this.order.orderMain.id);
      });
    },
    acceptOrderBefore() {
      common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:753", 1);
      if (this.rememberRunnerItems == 1) {
        this.acceptSubmit();
      } else {
        this.visibleAcceptDialog = true;
      }
    },
    initData() {
      let rememberRunnerItems = common_vendor.index.getStorageSync("rememberRunnerItems");
      common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:763", rememberRunnerItems);
      if (rememberRunnerItems == "")
        this.rememberRunnerItems = 0;
      else
        this.rememberRunnerItems = 1;
      this.config = this.$store.state.config;
      this.currSchool = this.$store.state.currSchool;
    },
    getDetail(id) {
      let that = this;
      request_apis_order.getDetailOrderUser(id).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:773", res);
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
          attachFiles[i].fileSize = this.formatBytes(attachFiles[i].fileSize);
          attachFiles[i].icon = that.getFileIcon(attachFiles[i].fileType);
        }
        data.attachFiles = attachFiles;
        if (data.orderMain.status == 1) {
          const createTimestamp = common_vendor.dayjs(data.orderMain.createTime, "YYYY-MM-DD HH:mm:ss").valueOf();
          const nowstamp = common_vendor.dayjs(Date.now(), "YYYY-MM-DD HH:mm:ss").valueOf();
          const stamp = data.orderMain.autoCancelTtl * 1e3 + 2e3 - (nowstamp - createTimestamp);
          this.countdownEnd = Date.now() + stamp;
        }
        if (data.orderMain.status == 10) {
          const createTimestamp = common_vendor.dayjs(data.orderMain.createTime, "YYYY-MM-DD HH:mm:ss").valueOf();
          const nowstamp = common_vendor.dayjs(Date.now(), "YYYY-MM-DD HH:mm:ss").valueOf();
          const stamp = this.config.autoCompleteTtl * 60 * 1e3 * 60 + 2e3 - (nowstamp - createTimestamp);
          this.countdownEnd = Date.now() + stamp;
        }
        if (data.completionImages.length != 0) {
          let tmpList = this.convertCompletionImages(data.completionImages);
          this.defaultCompletionImageList = tmpList;
        }
        data.moneyReward = this.calculateRunnerProfit(data.orderMain.totalAmount);
        this.order = data;
        this.skeletonLoading = false;
        common_vendor.index.stopPullDownRefresh();
        this.buildTimeLine();
      }).catch((err) => {
        this.showDanger(err);
      }).finally(() => {
        this.ossList = [];
        this.defaultSuppleImageList = [];
        common_vendor.index.stopPullDownRefresh();
      });
    },
    // 格式化时间
    formatTime(time) {
      if (!time)
        return "";
      return common_vendor.dayjs(time).format("MM月DD日 HH:mm");
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
      common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:865", times);
      this.orderSteps = times.filter((item) => item.time).sort((a, b) => new Date(b.time.replace(/-/g, "/")) - new Date(a.time.replace(/-/g, "/")));
      common_vendor.index.__f__("log", "at pages/API/order/runner/runner.vue:870", this.orderSteps);
    },
    calculateRunnerProfit(price) {
      let school = this.currSchool;
      let profit = school.profitRunner / (school.profitRunner + school.profitAgent + school.profitPlat);
      return (price * profit).toFixed(2);
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
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0)
        return "0 B";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
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
  const _easycom_nut_notify2 = common_vendor.resolveComponent("nut-notify");
  const _component_template = common_vendor.resolveComponent("template");
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_skeleton2 = common_vendor.resolveComponent("nut-skeleton");
  const _easycom_nut_countdown2 = common_vendor.resolveComponent("nut-countdown");
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_ellipsis2 = common_vendor.resolveComponent("nut-ellipsis");
  const _easycom_nut_collapse_item2 = common_vendor.resolveComponent("nut-collapse-item");
  const _easycom_nut_collapse2 = common_vendor.resolveComponent("nut-collapse");
  const _easycom_nut_safe_area2 = common_vendor.resolveComponent("nut-safe-area");
  const _easycom_nut_checkbox2 = common_vendor.resolveComponent("nut-checkbox");
  const _easycom_nut_dialog2 = common_vendor.resolveComponent("nut-dialog");
  const _easycom_nut_input2 = common_vendor.resolveComponent("nut-input");
  const _easycom_nut_popup2 = common_vendor.resolveComponent("nut-popup");
  const _easycom_nut_uploader2 = common_vendor.resolveComponent("nut-uploader");
  const _easycom_nut_button2 = common_vendor.resolveComponent("nut-button");
  const _easycom_nut_action_sheet2 = common_vendor.resolveComponent("nut-action-sheet");
  (_easycom_nut_notify2 + _component_template + _easycom_nut_icon2 + _easycom_nut_skeleton2 + _easycom_nut_countdown2 + _easycom_nut_cell2 + _easycom_nut_ellipsis2 + _easycom_nut_collapse_item2 + _easycom_nut_collapse2 + _easycom_nut_safe_area2 + _easycom_nut_checkbox2 + _easycom_nut_dialog2 + _easycom_nut_input2 + _easycom_nut_popup2 + _easycom_nut_uploader2 + _easycom_nut_button2 + _easycom_nut_action_sheet2)();
}
const _easycom_nut_notify = () => "../../../../node-modules/nutui-uniapp/components/notify/notify.js";
const _easycom_nut_icon = () => "../../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_skeleton = () => "../../../../node-modules/nutui-uniapp/components/skeleton/skeleton.js";
const _easycom_nut_countdown = () => "../../../../node-modules/nutui-uniapp/components/countdown/countdown.js";
const _easycom_nut_cell = () => "../../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_ellipsis = () => "../../../../node-modules/nutui-uniapp/components/ellipsis/ellipsis.js";
const _easycom_nut_collapse_item = () => "../../../../node-modules/nutui-uniapp/components/collapseitem/collapseitem.js";
const _easycom_nut_collapse = () => "../../../../node-modules/nutui-uniapp/components/collapse/collapse.js";
const _easycom_nut_safe_area = () => "../../../../node-modules/nutui-uniapp/components/safearea/safearea.js";
const _easycom_nut_checkbox = () => "../../../../node-modules/nutui-uniapp/components/checkbox/checkbox.js";
const _easycom_nut_dialog = () => "../../../../node-modules/nutui-uniapp/components/dialog/dialog.js";
const _easycom_nut_input = () => "../../../../node-modules/nutui-uniapp/components/input/input.js";
const _easycom_nut_popup = () => "../../../../node-modules/nutui-uniapp/components/popup/popup.js";
const _easycom_nut_uploader = () => "../../../../node-modules/nutui-uniapp/components/uploader/uploader.js";
const _easycom_nut_button = () => "../../../../node-modules/nutui-uniapp/components/button/button.js";
const _easycom_nut_action_sheet = () => "../../../../node-modules/nutui-uniapp/components/actionsheet/actionsheet.js";
if (!Math) {
  (_easycom_nut_notify + _easycom_nut_icon + _easycom_nut_skeleton + _easycom_nut_countdown + _easycom_nut_cell + _easycom_nut_ellipsis + _easycom_nut_collapse_item + _easycom_nut_collapse + _easycom_nut_safe_area + _easycom_nut_checkbox + _easycom_nut_dialog + _easycom_nut_input + _easycom_nut_popup + _easycom_nut_uploader + _easycom_nut_button + _easycom_nut_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.order.orderMain.statusText),
    b: common_vendor.o(($event) => $data.showOrderProgressPopup = true, "ff"),
    c: common_vendor.o(_ctx.back, "63"),
    d: common_vendor.p({
      name: "right"
    }),
    e: !$data.skeletonLoading,
    f: common_vendor.p({
      title: false,
      width: "30%",
      height: "24px",
      animated: true,
      row: "1"
    }),
    g: $data.skeletonLoading,
    h: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "3"
    }),
    i: $data.skeletonLoading,
    j: $data.order.orderMain.status == 1
  }, $data.order.orderMain.status == 1 ? {
    k: common_vendor.o(($event) => _ctx.countdownHandleEnd(), "be"),
    l: common_vendor.p({
      format: "mm:ss",
      ["end-time"]: $data.countdownEnd,
      ["start-time"]: $data.countdownStart
    }),
    m: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/接单.png"
    }),
    n: common_vendor.o((...args) => $options.acceptOrderBefore && $options.acceptOrderBefore(...args), "7f")
  } : {}, {
    o: $data.order.orderMain.status == 2
  }, $data.order.orderMain.status == 2 ? common_vendor.e({
    p: $data.order.orderMain.isTimed == 1
  }, $data.order.orderMain.isTimed == 1 ? {
    q: common_vendor.t($data.order.orderMain.specifiedTime)
  } : {}, {
    r: $data.order.orderMain.isTimed == 0
  }, $data.order.orderMain.isTimed == 0 ? {} : {}, {
    s: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/配送订单.png"
    }),
    t: common_vendor.o((...args) => $options.beginDelivery && $options.beginDelivery(...args), "fa"),
    v: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/取消订单.png"
    }),
    w: common_vendor.o((...args) => $options.cancelBefore && $options.cancelBefore(...args), "48")
  }) : {}, {
    x: $data.order.orderMain.status == 3
  }, $data.order.orderMain.status == 3 ? {
    y: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/完成订单.png"
    }),
    z: common_vendor.o(($event) => $data.showCompletionPopup = true, "6e"),
    A: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/取消订单.png"
    }),
    B: common_vendor.o((...args) => $options.cancelBefore && $options.cancelBefore(...args), "e7")
  } : {}, {
    C: $data.order.orderMain.status == 4
  }, $data.order.orderMain.status == 4 ? {
    D: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/查看订单.png"
    }),
    E: common_vendor.o(($event) => $data.showCompletionImagePopup = true, "3e")
  } : {}, {
    F: $data.order.orderMain.status == 5
  }, $data.order.orderMain.status == 5 ? {
    G: common_vendor.t($data.order.progress.cancelReason)
  } : {}, {
    H: $data.order.orderMain.status == 10
  }, $data.order.orderMain.status == 10 ? {
    I: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/查看订单.png"
    }),
    J: common_vendor.o(($event) => $data.showCompletionImagePopup = true, "72")
  } : {}, {
    K: $data.order.orderMain.status == 11
  }, $data.order.orderMain.status == 11 ? {
    L: common_vendor.p({
      ["custom-color"]: "#8a8a8a",
      name: "/static/icons/查看申诉.png"
    }),
    M: common_vendor.o((...args) => $options.showActionProcess && $options.showActionProcess(...args), "fa")
  } : {}, {
    N: !$data.skeletonLoading,
    O: $data.order.avatarUser,
    P: common_vendor.t($data.order.nicknameUser),
    Q: common_vendor.o($options.toChat, "44"),
    R: common_vendor.p({
      name: "/static/icons/消息.png"
    }),
    S: common_vendor.o($options.getPhone, "b2"),
    T: common_vendor.p({
      name: "/static/icons/电话.png"
    }),
    U: $data.order.orderMain.runnerId != null && !$data.skeletonLoading,
    V: common_vendor.p({
      avatar: true,
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "1"
    }),
    W: $data.order.orderMain.runnerId != null && $data.skeletonLoading,
    X: common_vendor.p({
      title: "类型",
      desc: $data.order.orderMain.typeText
    }),
    Y: $data.order.orderMain.isTimed == 1
  }, $data.order.orderMain.isTimed == 1 ? {
    Z: common_vendor.p({
      title: "指定配送时间",
      desc: $data.order.orderMain.specifiedTime
    })
  } : {}, {
    aa: $data.order.orderMain.startAddress == null && $data.order.orderMain.serviceType == 1
  }, $data.order.orderMain.startAddress == null && $data.order.orderMain.serviceType == 1 ? {
    ab: common_assets._imports_0,
    ac: common_vendor.p({
      title: "就近购买",
      ["sub-title"]: ""
    })
  } : {}, {
    ad: $data.order.orderMain.startAddress != null
  }, $data.order.orderMain.startAddress != null ? {
    ae: common_assets._imports_0,
    af: common_vendor.o(($event) => $options.openLocation($data.order.orderMain.startAddress), "1a"),
    ag: common_vendor.p({
      title: $data.order.orderMain.startAddress.title + " " + $data.order.orderMain.startAddress.detail,
      ["sub-title"]: $data.order.orderMain.startAddress.name + " " + $data.order.orderMain.startAddress.phone
    })
  } : {}, {
    ah: $data.order.orderMain.endAddress != null
  }, $data.order.orderMain.endAddress != null ? {
    ai: common_assets._imports_1,
    aj: common_vendor.o(($event) => $options.openLocation($data.order.orderMain.endAddress), "61"),
    ak: common_vendor.p({
      title: $data.order.orderMain.endAddress.title + " " + $data.order.orderMain.endAddress.detail,
      ["sub-title"]: $data.order.orderMain.endAddress.name + " " + $data.order.orderMain.endAddress.phone
    })
  } : {}, {
    al: common_vendor.p({
      direction: "end",
      rows: "2",
      expandText: "展开",
      collapseText: "收起",
      content: "备注:" + $data.order.orderMain.detail
    }),
    am: $data.order.attachImages.length > 0
  }, $data.order.attachImages.length > 0 ? {
    an: common_vendor.o(($event) => $data.showImagePopup = true, "f1"),
    ao: common_vendor.p({
      ["is-link"]: true,
      title: "附加图片",
      desc: $data.order.attachImages.length + "张"
    })
  } : {}, {
    ap: $data.order.attachFiles.length > 0
  }, $data.order.attachFiles.length > 0 ? {
    aq: common_vendor.o(($event) => $data.showFilePopup = true, "bb"),
    ar: common_vendor.p({
      ["is-link"]: true,
      title: "附加文件",
      desc: $data.order.attachFiles.length + "个"
    })
  } : {}, {
    as: common_vendor.p({
      title: "预计赏金",
      desc: $data.order.moneyReward + "￥"
    }),
    at: $data.order.orderMain.weight != null
  }, $data.order.orderMain.weight != null ? {
    av: common_vendor.p({
      title: "物品重量",
      desc: $data.order.orderMain.weight
    })
  } : {}, {
    aw: common_vendor.p({
      name: "/static/icons/复制.png"
    }),
    ax: common_vendor.o(($event) => $options.copyOrderId($data.order.orderMain.id), "db"),
    ay: common_vendor.p({
      ["is-link"]: true,
      title: "订单号",
      desc: $data.order.orderMain.id + " "
    }),
    az: common_vendor.p({
      title: "下单时间",
      desc: $data.order.orderMain.createTime
    }),
    aA: common_vendor.p({
      title: $data.collapseText,
      name: 1,
      rotate: "-180"
    }),
    aB: common_vendor.o($options.collapseChange, "5c"),
    aC: common_vendor.o(($event) => _ctx.activeName = $event, "c5"),
    aD: common_vendor.p({
      accordion: true,
      modelValue: _ctx.activeName
    }),
    aE: !$data.skeletonLoading,
    aF: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "1"
    }),
    aG: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "5"
    }),
    aH: $data.skeletonLoading,
    aI: common_vendor.p({
      position: "bottom"
    }),
    aJ: common_vendor.o((...args) => $options.toAgreement && $options.toAgreement(...args), "65"),
    aK: common_vendor.o(($event) => $data.agreeRunnerItems = $event, "44"),
    aL: common_vendor.p({
      modelValue: $data.agreeRunnerItems
    }),
    aM: common_vendor.o(($event) => $data.rememberRunnerItems = $event, "fa"),
    aN: common_vendor.p({
      modelValue: $data.rememberRunnerItems
    }),
    aO: common_vendor.o(($event) => {
      $data.visibleAcceptDialog = false;
      $data.rememberRunnerItems = 0;
    }, "0e"),
    aP: common_vendor.o($options.acceptSubmit, "77"),
    aQ: common_vendor.o(($event) => $data.visibleAcceptDialog = $event, "1f"),
    aR: common_vendor.p({
      title: "确定接单？",
      ["ok-text"]: "接单",
      visible: $data.visibleAcceptDialog
    }),
    aS: common_vendor.t($data.cancelBeforeText),
    aT: $data.cancelBeforeText != "",
    aU: common_vendor.o(($event) => $data.cancelForm.cancelReason = $event, "de"),
    aV: common_vendor.p({
      type: "text",
      placeholder: "填写原因",
      ["max-length"]: "10",
      ["show-word-limit"]: true,
      modelValue: $data.cancelForm.cancelReason
    }),
    aW: common_vendor.o(($event) => $data.visibleCancelDialog = false, "d4"),
    aX: common_vendor.o(_ctx.cancelSubmit, "6e"),
    aY: common_vendor.o(($event) => $data.visibleCancelDialog = $event, "42"),
    aZ: common_vendor.p({
      title: "确定取消订单？",
      visible: $data.visibleCancelDialog
    }),
    ba: common_vendor.f($data.order.attachImages, (item, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.previewImage(index), index),
        b: item.fileUrl,
        c: index
      };
    }),
    bb: common_vendor.o(($event) => $data.showImagePopup = $event, "14"),
    bc: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showImagePopup
    }),
    bd: common_vendor.f($data.order.attachFiles, (item, index, i0) => {
      return {
        a: "/static/fileicon/" + item.icon,
        b: common_vendor.t(item.fileName),
        c: common_vendor.t(item.fileSize),
        d: common_vendor.o(($event) => $options.viewFile(item), index),
        e: index
      };
    }),
    be: common_vendor.o(($event) => $data.showFilePopup = $event, "29"),
    bf: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showFilePopup
    }),
    bg: common_vendor.t($data.config.completionImagesLimit),
    bh: common_vendor.o($options.imageClick, "75"),
    bi: common_vendor.o($options.uploadSuccess, "ef"),
    bj: common_vendor.o($options.uploadDelete, "90"),
    bk: common_vendor.o($options.oversize, "d8"),
    bl: common_vendor.o(($event) => $data.defaultImageList = $event, "74"),
    bm: common_vendor.p({
      ["media-type"]: ["image"],
      headers: $data.headers,
      data: $data.uploaderData,
      maximize: 5242880,
      name: "file",
      maximum: $data.config.completionImagesLimit,
      url: $data.uploadUrl,
      ["file-list"]: $data.defaultImageList
    }),
    bn: common_vendor.o($options.completeOrder, "46"),
    bo: common_vendor.p({
      loading: $data.btnCompleteLoading,
      block: true,
      type: "info"
    }),
    bp: common_vendor.o(($event) => $data.showCompletionPopup = $event, "fc"),
    bq: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showCompletionPopup
    }),
    br: common_vendor.o($options.imageClick, "81"),
    bs: common_vendor.o(($event) => $data.defaultCompletionImageList = $event, "a6"),
    bt: common_vendor.p({
      ["media-type"]: ["image"],
      ["is-deletable"]: false,
      name: "file",
      maximum: $data.defaultCompletionImageList.length,
      ["file-list"]: $data.defaultCompletionImageList
    }),
    bv: $data.order.orderMain.status == 4
  }, $data.order.orderMain.status == 4 ? {
    bw: common_vendor.o($options.imageClick, "9b"),
    bx: common_vendor.o($options.uploadSuccess, "37"),
    by: common_vendor.o($options.uploadDelete, "fe"),
    bz: common_vendor.o($options.oversize, "3e"),
    bA: common_vendor.o(($event) => $data.defaultSuppleImageList = $event, "a6"),
    bB: common_vendor.p({
      ["media-type"]: ["image"],
      headers: $data.headers,
      data: $data.uploaderData,
      maximize: 5242880,
      name: "file",
      maximum: $data.config.completionImagesLimit - $data.defaultCompletionImageList.length,
      url: $data.uploadUrl,
      ["file-list"]: $data.defaultSuppleImageList
    })
  } : {}, {
    bC: $data.order.orderMain.status == 4
  }, $data.order.orderMain.status == 4 ? common_vendor.e({
    bD: $data.config.completionImagesLimit - $data.defaultCompletionImageList.length > 0
  }, $data.config.completionImagesLimit - $data.defaultCompletionImageList.length > 0 ? {
    bE: common_vendor.t($data.defaultSuppleImageList.length),
    bF: common_vendor.t($data.config.completionImagesLimit - $data.defaultCompletionImageList.length)
  } : {}, {
    bG: $data.config.completionImagesLimit - $data.defaultCompletionImageList.length <= 0
  }, $data.config.completionImagesLimit - $data.defaultCompletionImageList.length <= 0 ? {} : {}, {
    bH: common_vendor.o($options.updateImages, "75"),
    bI: common_vendor.p({
      disabled: $data.config.completionImagesLimit - $data.defaultCompletionImageList.length > 0 ? false : true,
      loading: $data.btnUpdateImagesLoading,
      block: true,
      type: "info"
    })
  }) : {}, {
    bJ: common_vendor.o(($event) => $data.showCompletionImagePopup = $event, "56"),
    bK: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showCompletionImagePopup
    }),
    bL: common_vendor.f(_ctx.orderSteps, (step, index, i0) => {
      return common_vendor.e({
        a: index == _ctx.orderSteps.length - 1
      }, index == _ctx.orderSteps.length - 1 ? {
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
    bM: common_vendor.o(($event) => $data.showOrderProgressPopup = $event, "74"),
    bN: common_vendor.p({
      position: "bottom",
      ["safe-area-inset-bottom"]: true,
      visible: $data.showOrderProgressPopup
    }),
    bO: common_vendor.f($data.appealList, (item, index, i0) => {
      return common_vendor.e({
        a: item.orderAppeal.appealStatus == 1
      }, item.orderAppeal.appealStatus == 1 ? {
        b: "47aa9cef-52-" + i0 + "," + ("47aa9cef-51-" + i0),
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
        f: "47aa9cef-53-" + i0 + "," + ("47aa9cef-51-" + i0),
        g: common_vendor.p({
          title: "真实姓名"
        }),
        h: "47aa9cef-54-" + i0 + "," + ("47aa9cef-51-" + i0),
        i: common_vendor.p({
          title: "更新时间",
          desc: item.orderAppeal.updateTime
        }),
        j: common_vendor.t(item.orderAppeal.remarks == "" ? "暂无" : item.orderAppeal.remarks),
        k: "47aa9cef-51-" + i0 + "," + ("47aa9cef-50-" + i0),
        l: common_vendor.p({
          title: "已通过",
          name: index,
          value: item.orderAppeal.appealTime
        })
      } : {}, {
        m: item.orderAppeal.appealStatus == 0
      }, item.orderAppeal.appealStatus == 0 ? {
        n: "47aa9cef-56-" + i0 + "," + ("47aa9cef-55-" + i0),
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
        r: "47aa9cef-57-" + i0 + "," + ("47aa9cef-55-" + i0),
        s: common_vendor.p({
          title: "真实姓名"
        }),
        t: "47aa9cef-58-" + i0 + "," + ("47aa9cef-55-" + i0),
        v: common_vendor.p({
          title: "更新时间",
          desc: item.orderAppeal.updateTime
        }),
        w: common_vendor.t(item.orderAppeal.remarks == "" ? "暂无" : item.orderAppeal.remarks),
        x: "47aa9cef-55-" + i0 + "," + ("47aa9cef-50-" + i0),
        y: common_vendor.p({
          title: "已驳回",
          name: index,
          value: item.orderAppeal.appealTime
        })
      } : {}, {
        z: item.orderAppeal.appealStatus == 2
      }, item.orderAppeal.appealStatus == 2 ? {
        A: "47aa9cef-60-" + i0 + "," + ("47aa9cef-59-" + i0),
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
        E: "47aa9cef-61-" + i0 + "," + ("47aa9cef-59-" + i0),
        F: common_vendor.p({
          title: "真实姓名"
        }),
        G: "47aa9cef-62-" + i0 + "," + ("47aa9cef-59-" + i0),
        H: common_vendor.p({
          title: "更新时间",
          desc: item.orderAppeal.updateTime
        }),
        I: common_vendor.t(item.orderAppeal.remarks == "" ? "暂无" : item.orderAppeal.remarks),
        J: "47aa9cef-59-" + i0 + "," + ("47aa9cef-50-" + i0),
        K: common_vendor.p({
          title: "审核中",
          name: index,
          value: item.orderAppeal.appealTime
        })
      } : {}, {
        L: index,
        M: "47aa9cef-50-" + i0 + ",47aa9cef-49",
        N: common_vendor.p({
          accordion: true,
          ["v-model"]: index
        })
      });
    }),
    bP: common_vendor.o(($event) => $data.visible1 = $event, "50"),
    bQ: common_vendor.p({
      title: "申请记录",
      visible: $data.visible1
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/order/runner/runner.js.map

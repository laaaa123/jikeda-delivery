"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_request = require("../../../../request/request.js");
const request_apis_order = require("../../../../request/apis/order.js");
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
      defaultUploadList: [],
      visible1: false,
      appealList: [],
      skeletonLoading: false,
      title: "Hello",
      canSubmit: false,
      uploadUrl: request_request.upload_url,
      form: {
        orderId: "",
        appealReason: "",
        ossAppealList: []
      },
      headers: {
        Authorization: "Bearer " + common_vendor.index.getStorageSync("token"),
        "Content-Type": "multipart/form-data"
      },
      uploaderData: {
        type: 6,
        name: ""
      },
      btnSubmitLoading: false,
      btnListLoading: false
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/API/order/appeal/appeal.vue:139", options);
    this.form.orderId = options.orderId;
  },
  onReachBottom() {
  },
  onUnload() {
    common_vendor.index.__f__("log", "at pages/API/order/appeal/appeal.vue:147", "onUnload");
    this.defaultUploadList = [];
  },
  onHide() {
    common_vendor.index.__f__("log", "at pages/API/order/appeal/appeal.vue:151", "onHide");
  },
  methods: {
    previewAppealedImage(index, index1) {
      let images = this.appealList[index].imageUrls;
      common_vendor.index.previewImage({
        current: index1,
        urls: images
      });
    },
    showActionProcess() {
      this.btnListLoading = true;
      request_apis_order.getAppealOrder(this.form.orderId).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/appeal/appeal.vue:164", res);
        this.appealList = res.data;
        this.visible1 = true;
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        this.btnListLoading = false;
      });
    },
    submit() {
      this.btnSubmitLoading = true;
      request_apis_order.postAppealOrder(this.form).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/order/appeal/appeal.vue:177", res);
        this.showSuccess("提交成功，请耐心等待");
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      }).catch((err) => {
        this.showDanger(err);
      }).finally((res) => {
        this.btnSubmitLoading = false;
      });
    },
    toApply() {
    },
    fileClick(file) {
      file = file.fileItem;
      common_vendor.index.__f__("log", "at pages/API/order/appeal/appeal.vue:196", file);
      let imgsArray = [];
      imgsArray[0] = file.url;
      common_vendor.index.previewImage({
        current: 0,
        urls: imgsArray
      });
    },
    oversize(files) {
      common_vendor.index.__f__("log", "at pages/API/order/appeal/appeal.vue:205", files);
      this.showWarning("文件大小超出5MB");
    },
    uploadDelete(e) {
      let index = e.index;
      this.form.ossAppealList.splice(index, 1);
    },
    uploadSuccess(e) {
      common_vendor.index.__f__("log", "at pages/API/order/appeal/appeal.vue:213", e);
      let data = e.data.data;
      data = JSON.parse(data);
      let ossId = data.data.ossId;
      this.form.ossAppealList.push(ossId);
    }
  }
};
if (!Array) {
  const _easycom_nut_notify2 = common_vendor.resolveComponent("nut-notify");
  const _component_template = common_vendor.resolveComponent("template");
  const _easycom_nut_skeleton2 = common_vendor.resolveComponent("nut-skeleton");
  const _easycom_nut_input2 = common_vendor.resolveComponent("nut-input");
  const _easycom_nut_form_item2 = common_vendor.resolveComponent("nut-form-item");
  const _easycom_nut_textarea2 = common_vendor.resolveComponent("nut-textarea");
  const _easycom_nut_uploader2 = common_vendor.resolveComponent("nut-uploader");
  const _easycom_nut_form2 = common_vendor.resolveComponent("nut-form");
  const _easycom_nut_button2 = common_vendor.resolveComponent("nut-button");
  const _easycom_nut_col2 = common_vendor.resolveComponent("nut-col");
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_row2 = common_vendor.resolveComponent("nut-row");
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_collapse_item2 = common_vendor.resolveComponent("nut-collapse-item");
  const _easycom_nut_collapse2 = common_vendor.resolveComponent("nut-collapse");
  const _easycom_nut_action_sheet2 = common_vendor.resolveComponent("nut-action-sheet");
  (_easycom_nut_notify2 + _component_template + _easycom_nut_skeleton2 + _easycom_nut_input2 + _easycom_nut_form_item2 + _easycom_nut_textarea2 + _easycom_nut_uploader2 + _easycom_nut_form2 + _easycom_nut_button2 + _easycom_nut_col2 + _easycom_nut_icon2 + _easycom_nut_row2 + _easycom_nut_cell2 + _easycom_nut_collapse_item2 + _easycom_nut_collapse2 + _easycom_nut_action_sheet2)();
}
const _easycom_nut_notify = () => "../../../../node-modules/nutui-uniapp/components/notify/notify.js";
const _easycom_nut_skeleton = () => "../../../../node-modules/nutui-uniapp/components/skeleton/skeleton.js";
const _easycom_nut_input = () => "../../../../node-modules/nutui-uniapp/components/input/input.js";
const _easycom_nut_form_item = () => "../../../../node-modules/nutui-uniapp/components/formitem/formitem.js";
const _easycom_nut_textarea = () => "../../../../node-modules/nutui-uniapp/components/textarea/textarea.js";
const _easycom_nut_uploader = () => "../../../../node-modules/nutui-uniapp/components/uploader/uploader.js";
const _easycom_nut_form = () => "../../../../node-modules/nutui-uniapp/components/form/form.js";
const _easycom_nut_button = () => "../../../../node-modules/nutui-uniapp/components/button/button.js";
const _easycom_nut_col = () => "../../../../node-modules/nutui-uniapp/components/col/col.js";
const _easycom_nut_icon = () => "../../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_row = () => "../../../../node-modules/nutui-uniapp/components/row/row.js";
const _easycom_nut_cell = () => "../../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_collapse_item = () => "../../../../node-modules/nutui-uniapp/components/collapseitem/collapseitem.js";
const _easycom_nut_collapse = () => "../../../../node-modules/nutui-uniapp/components/collapse/collapse.js";
const _easycom_nut_action_sheet = () => "../../../../node-modules/nutui-uniapp/components/actionsheet/actionsheet.js";
if (!Math) {
  (_easycom_nut_notify + _easycom_nut_skeleton + _easycom_nut_input + _easycom_nut_form_item + _easycom_nut_textarea + _easycom_nut_uploader + _easycom_nut_form + _easycom_nut_button + _easycom_nut_col + _easycom_nut_icon + _easycom_nut_row + _easycom_nut_cell + _easycom_nut_collapse_item + _easycom_nut_collapse + _easycom_nut_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      width: "100%",
      height: "24px",
      animated: true,
      row: "1"
    }),
    b: common_vendor.p({
      width: "100%",
      height: "24px",
      animated: true,
      row: "3"
    }),
    c: common_vendor.p({
      width: "100%",
      height: "24px",
      animated: true,
      avatar: true,
      avatarSize: "60px",
      row: "3"
    }),
    d: $data.skeletonLoading,
    e: common_vendor.o(($event) => $data.form.orderId = $event, "0b"),
    f: common_vendor.p({
      type: "text",
      disabled: true,
      modelValue: $data.form.orderId
    }),
    g: common_vendor.p({
      label: "申诉订单号"
    }),
    h: common_vendor.o(($event) => $data.form.appealReason = $event, "08"),
    i: common_vendor.p({
      rows: "2",
      ["limit-show"]: true,
      ["max-length"]: "100",
      modelValue: $data.form.appealReason
    }),
    j: common_vendor.p({
      label: "问题描述"
    }),
    k: common_vendor.o($options.fileClick, "d2"),
    l: common_vendor.o($options.uploadSuccess, "6e"),
    m: common_vendor.o($options.uploadDelete, "1f"),
    n: common_vendor.o($options.oversize, "a9"),
    o: common_vendor.o(($event) => $data.defaultUploadList = $event, "96"),
    p: common_vendor.p({
      headers: $data.headers,
      data: $data.uploaderData,
      maximize: 5242880,
      name: "file",
      maximum: "5",
      url: $data.uploadUrl,
      ["file-list"]: $data.defaultUploadList
    }),
    q: common_vendor.p({
      label: "申诉凭证",
      ["label-position"]: "top"
    }),
    r: !$data.skeletonLoading,
    s: common_vendor.o($options.submit, "0c"),
    t: common_vendor.p({
      loading: $data.btnSubmitLoading,
      block: true,
      type: "info"
    }),
    v: common_vendor.p({
      span: 18
    }),
    w: common_vendor.p({
      name: "horizontal"
    }),
    x: common_vendor.o($options.showActionProcess, "e0"),
    y: common_vendor.p({
      loading: $data.btnListLoading,
      shape: "square",
      plain: true,
      type: "info"
    }),
    z: common_vendor.p({
      span: 4
    }),
    A: common_vendor.p({
      type: "flex",
      justify: "space-evenly"
    }),
    B: common_vendor.f($data.appealList, (item, index, i0) => {
      return common_vendor.e({
        a: item.orderAppeal.appealStatus == 1
      }, item.orderAppeal.appealStatus == 1 ? {
        b: "2d89f40f-20-" + i0 + "," + ("2d89f40f-19-" + i0),
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
        f: "2d89f40f-21-" + i0 + "," + ("2d89f40f-19-" + i0),
        g: common_vendor.p({
          title: "真实姓名"
        }),
        h: "2d89f40f-22-" + i0 + "," + ("2d89f40f-19-" + i0),
        i: common_vendor.p({
          title: "更新时间",
          desc: item.orderAppeal.updateTime
        }),
        j: common_vendor.t(item.orderAppeal.remarks == "" ? "暂无" : item.orderAppeal.remarks),
        k: "2d89f40f-19-" + i0 + "," + ("2d89f40f-18-" + i0),
        l: common_vendor.p({
          title: "已通过",
          name: index,
          value: item.orderAppeal.appealTime
        })
      } : {}, {
        m: item.orderAppeal.appealStatus == 0
      }, item.orderAppeal.appealStatus == 0 ? {
        n: "2d89f40f-24-" + i0 + "," + ("2d89f40f-23-" + i0),
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
        r: "2d89f40f-25-" + i0 + "," + ("2d89f40f-23-" + i0),
        s: common_vendor.p({
          title: "真实姓名"
        }),
        t: "2d89f40f-26-" + i0 + "," + ("2d89f40f-23-" + i0),
        v: common_vendor.p({
          title: "更新时间",
          desc: item.orderAppeal.updateTime
        }),
        w: common_vendor.t(item.orderAppeal.remarks == "" ? "暂无" : item.orderAppeal.remarks),
        x: "2d89f40f-23-" + i0 + "," + ("2d89f40f-18-" + i0),
        y: common_vendor.p({
          title: "已驳回",
          name: index,
          value: item.orderAppeal.appealTime
        })
      } : {}, {
        z: item.orderAppeal.appealStatus == 2
      }, item.orderAppeal.appealStatus == 2 ? {
        A: "2d89f40f-28-" + i0 + "," + ("2d89f40f-27-" + i0),
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
        E: "2d89f40f-29-" + i0 + "," + ("2d89f40f-27-" + i0),
        F: common_vendor.p({
          title: "真实姓名"
        }),
        G: "2d89f40f-30-" + i0 + "," + ("2d89f40f-27-" + i0),
        H: common_vendor.p({
          title: "更新时间",
          desc: item.orderAppeal.updateTime
        }),
        I: common_vendor.t(item.orderAppeal.remarks == "" ? "暂无" : item.orderAppeal.remarks),
        J: "2d89f40f-27-" + i0 + "," + ("2d89f40f-18-" + i0),
        K: common_vendor.p({
          title: "审核中",
          name: index,
          value: item.orderAppeal.appealTime
        })
      } : {}, {
        L: index,
        M: "2d89f40f-18-" + i0 + ",2d89f40f-17",
        N: common_vendor.p({
          accordion: true,
          ["v-model"]: index
        })
      });
    }),
    C: common_vendor.o(($event) => $data.visible1 = $event, "f4"),
    D: common_vendor.p({
      title: "申请记录",
      visible: $data.visible1
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/order/appeal/appeal.js.map

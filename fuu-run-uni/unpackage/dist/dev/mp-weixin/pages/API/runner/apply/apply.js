"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_apis_runner = require("../../../../request/apis/runner.js");
const request_request = require("../../../../request/request.js");
const _sfc_main = {
  setup() {
    const notify = common_vendor.useNotify();
    const showSuccess = (message) => {
      notify.success(message);
    };
    const showDanger = (message) => {
      notify.danger(message);
    };
    const showWarning = (message) => {
      notify.warning(message);
    };
    return { showSuccess, showDanger, showWarning };
  },
  data() {
    return {
      fileList: [],
      school: {},
      schoolName: "",
      back: false,
      uploadUrl: request_request.upload_url,
      form: {
        schoolId: "",
        schoolName: "",
        cityCode: "",
        cityName: "",
        realname: "",
        gender: "1",
        studentCardUrl: ""
      },
      headers: {
        Authorization: "Bearer " + common_vendor.index.getStorageSync("token")
      },
      uploaderData: {
        type: 5,
        name: ""
      },
      btnLoading: false
    };
  },
  onLoad() {
    this.initData();
  },
  onShow() {
    this.initData();
  },
  methods: {
    submit() {
      if (!this.form.schoolId) {
        this.showWarning("请先选择申请校区");
        return;
      }
      if (!this.form.realname || !this.form.realname.trim()) {
        this.showWarning("请填写真实姓名");
        return;
      }
      if (!this.form.studentCardUrl) {
        this.showWarning("请先上传学生证");
        return;
      }
      this.btnLoading = true;
      request_apis_runner.runnerSubmit(this.form).then(() => {
        this.showSuccess("提交成功");
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      }).catch((err) => {
        this.showDanger(this.getErrorMessage(err, "提交失败"));
      }).finally(() => {
        this.btnLoading = false;
      });
    },
    initData() {
      const storeSchool = this.$store.state.currSchool;
      const storageSchool = common_vendor.index.getStorageSync("currentSchool");
      const school = storeSchool && storeSchool.id ? storeSchool : storageSchool;
      if (school && school.id) {
        this.school = school;
        this.schoolName = school.name;
        this.form.schoolId = school.id;
        this.form.schoolName = school.name;
        const city = common_vendor.index.getStorageSync("currentCity") || {};
        this.form.cityCode = city.cityCode || city.adcode || "";
        this.form.cityName = city.cityName || city.name || "";
      }
    },
    toSelectSchool() {
      common_vendor.index.navigateTo({
        url: "/pages/API/school/select/select?back=1"
      });
    },
    imageClick(file) {
      const fileItem = file.fileItem || file;
      const url = fileItem.url || this.form.studentCardUrl;
      if (!url) {
        return;
      }
      common_vendor.index.previewImage({
        current: 0,
        urls: [url]
      });
    },
    oversize() {
      common_vendor.index.showToast({
        title: "文件大小超出5MB",
        icon: "none"
      });
    },
    uploadSuccess(e) {
      try {
        const response = this.parseUploadResponse(e);
        if (response.code !== 200 || !response.data || !response.data.url) {
          this.showDanger(response.msg || "上传失败");
          return;
        }
        this.form.studentCardUrl = response.data.url;
        this.showSuccess("学生证上传成功");
      } catch (err) {
        this.showDanger("上传结果解析失败");
      }
    },
    uploadFailure(e) {
      common_vendor.index.__f__("log", "at pages/API/runner/apply/apply.vue:175", e);
      this.showDanger("学生证上传失败");
    },
    parseUploadResponse(e) {
      let raw = e && e.data ? e.data : e;
      if (raw && raw.code === void 0 && raw.data) {
        raw = raw.data;
      }
      if (typeof raw === "string") {
        raw = JSON.parse(raw);
      }
      return raw || {};
    },
    getErrorMessage(err, fallback) {
      if (typeof err === "string") {
        return err;
      }
      if (err && err.msg) {
        return err.msg;
      }
      return fallback;
    }
  }
};
if (!Array) {
  const _easycom_nut_notify2 = common_vendor.resolveComponent("nut-notify");
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_form_item2 = common_vendor.resolveComponent("nut-form-item");
  const _easycom_nut_input2 = common_vendor.resolveComponent("nut-input");
  const _easycom_nut_radio2 = common_vendor.resolveComponent("nut-radio");
  const _easycom_nut_radio_group2 = common_vendor.resolveComponent("nut-radio-group");
  const _easycom_nut_uploader2 = common_vendor.resolveComponent("nut-uploader");
  const _easycom_nut_form2 = common_vendor.resolveComponent("nut-form");
  const _easycom_nut_button2 = common_vendor.resolveComponent("nut-button");
  (_easycom_nut_notify2 + _easycom_nut_icon2 + _easycom_nut_form_item2 + _easycom_nut_input2 + _easycom_nut_radio2 + _easycom_nut_radio_group2 + _easycom_nut_uploader2 + _easycom_nut_form2 + _easycom_nut_button2)();
}
const _easycom_nut_notify = () => "../../../../node-modules/nutui-uniapp/components/notify/notify.js";
const _easycom_nut_icon = () => "../../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_form_item = () => "../../../../node-modules/nutui-uniapp/components/formitem/formitem.js";
const _easycom_nut_input = () => "../../../../node-modules/nutui-uniapp/components/input/input.js";
const _easycom_nut_radio = () => "../../../../node-modules/nutui-uniapp/components/radio/radio.js";
const _easycom_nut_radio_group = () => "../../../../node-modules/nutui-uniapp/components/radiogroup/radiogroup.js";
const _easycom_nut_uploader = () => "../../../../node-modules/nutui-uniapp/components/uploader/uploader.js";
const _easycom_nut_form = () => "../../../../node-modules/nutui-uniapp/components/form/form.js";
const _easycom_nut_button = () => "../../../../node-modules/nutui-uniapp/components/button/button.js";
if (!Math) {
  (_easycom_nut_notify + _easycom_nut_icon + _easycom_nut_form_item + _easycom_nut_input + _easycom_nut_radio + _easycom_nut_radio_group + _easycom_nut_uploader + _easycom_nut_form + _easycom_nut_button)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.schoolName || "请选择申请校区"),
    b: common_vendor.n($data.schoolName ? "school-name" : "school-placeholder"),
    c: common_vendor.p({
      name: "right"
    }),
    d: common_vendor.o((...args) => $options.toSelectSchool && $options.toSelectSchool(...args), "a1"),
    e: common_vendor.p({
      label: "申请校区"
    }),
    f: common_vendor.o(($event) => $data.form.realname = $event, "a2"),
    g: common_vendor.p({
      placeholder: "请输入姓名",
      type: "text",
      modelValue: $data.form.realname
    }),
    h: common_vendor.p({
      label: "真实姓名"
    }),
    i: common_vendor.p({
      label: "1"
    }),
    j: common_vendor.p({
      label: "0"
    }),
    k: common_vendor.o(($event) => $data.form.gender = $event, "5a"),
    l: common_vendor.p({
      direction: "horizontal",
      modelValue: $data.form.gender
    }),
    m: common_vendor.p({
      label: "性别"
    }),
    n: common_vendor.o($options.uploadSuccess, "ee"),
    o: common_vendor.o($options.uploadFailure, "6c"),
    p: common_vendor.o($options.imageClick, "6e"),
    q: common_vendor.o($options.oversize, "05"),
    r: common_vendor.o(($event) => $data.fileList = $event, "9e"),
    s: common_vendor.p({
      maximum: "1",
      headers: $data.headers,
      data: $data.uploaderData,
      maximize: 5242880,
      name: "file",
      accept: "image/*",
      url: $data.uploadUrl,
      fileList: $data.fileList
    }),
    t: common_vendor.p({
      label: "学生证",
      ["label-position"]: "top"
    }),
    v: common_vendor.o($options.submit, "20"),
    w: common_vendor.p({
      loading: $data.btnLoading,
      block: true,
      type: "info"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/runner/apply/apply.js.map

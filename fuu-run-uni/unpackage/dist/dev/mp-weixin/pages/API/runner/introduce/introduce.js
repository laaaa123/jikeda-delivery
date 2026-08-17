"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_apis_runner = require("../../../../request/apis/runner.js");
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
      btnListLoading: false,
      title: "Hello",
      school: {},
      userInfo: {
        userWx: {
          isRunner: 0
        }
      },
      visible1: false,
      applyDetail: null,
      list: []
    };
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pages/API/runner/introduce/introduce.vue:134", "onLoad");
    this.initData();
  },
  methods: {
    triggerNotify() {
      this.showPrimary("哈哈哈");
    },
    viewImage(url) {
      common_vendor.index.previewImage({
        urls: [url]
      });
    },
    toApply() {
      common_vendor.index.navigateTo({
        url: "/pages/API/runner/apply/apply"
      });
    },
    initData() {
      this.userInfo = this.$store.state.userInfo;
      let school = this.$store.state.currSchool;
      let totalProfit = school.profitPlat + school.profitAgent + school.profitRunner;
      school.profitPlat = (school.profitPlat / totalProfit * 100).toFixed(2) + "%";
      school.profitAgent = (school.profitAgent / totalProfit * 100).toFixed(2) + "%";
      school.profitRunner = (school.profitRunner / totalProfit * 100).toFixed(2) + "%";
      this.school = school;
    },
    showActionProcess() {
      this.btnListLoading = true;
      request_apis_runner.getApplyProcess().then((res) => {
        this.list = res.data;
      }).catch((err) => {
        this.showDanger(err);
      }).finally(() => {
        this.visible1 = !this.visible1;
        this.btnListLoading = false;
      });
    }
  }
};
if (!Array) {
  const _easycom_nut_notify2 = common_vendor.resolveComponent("nut-notify");
  const _component_template = common_vendor.resolveComponent("template");
  const _easycom_nut_cell_group2 = common_vendor.resolveComponent("nut-cell-group");
  const _easycom_nut_button2 = common_vendor.resolveComponent("nut-button");
  const _easycom_nut_col2 = common_vendor.resolveComponent("nut-col");
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_row2 = common_vendor.resolveComponent("nut-row");
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_collapse_item2 = common_vendor.resolveComponent("nut-collapse-item");
  const _easycom_nut_collapse2 = common_vendor.resolveComponent("nut-collapse");
  const _easycom_nut_action_sheet2 = common_vendor.resolveComponent("nut-action-sheet");
  (_easycom_nut_notify2 + _component_template + _easycom_nut_cell_group2 + _easycom_nut_button2 + _easycom_nut_col2 + _easycom_nut_icon2 + _easycom_nut_row2 + _easycom_nut_cell2 + _easycom_nut_collapse_item2 + _easycom_nut_collapse2 + _easycom_nut_action_sheet2)();
}
const _easycom_nut_notify = () => "../../../../node-modules/nutui-uniapp/components/notify/notify.js";
const _easycom_nut_cell_group = () => "../../../../node-modules/nutui-uniapp/components/cellgroup/cellgroup.js";
const _easycom_nut_button = () => "../../../../node-modules/nutui-uniapp/components/button/button.js";
const _easycom_nut_col = () => "../../../../node-modules/nutui-uniapp/components/col/col.js";
const _easycom_nut_icon = () => "../../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_row = () => "../../../../node-modules/nutui-uniapp/components/row/row.js";
const _easycom_nut_cell = () => "../../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_collapse_item = () => "../../../../node-modules/nutui-uniapp/components/collapseitem/collapseitem.js";
const _easycom_nut_collapse = () => "../../../../node-modules/nutui-uniapp/components/collapse/collapse.js";
const _easycom_nut_action_sheet = () => "../../../../node-modules/nutui-uniapp/components/actionsheet/actionsheet.js";
if (!Math) {
  (_easycom_nut_notify + _easycom_nut_cell_group + _easycom_nut_button + _easycom_nut_col + _easycom_nut_icon + _easycom_nut_row + _easycom_nut_cell + _easycom_nut_collapse_item + _easycom_nut_collapse + _easycom_nut_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.school.logo,
    b: common_vendor.t($data.school.name),
    c: common_vendor.t($data.school.profitRunner),
    d: common_vendor.t($data.school.profitPlat),
    e: common_vendor.t($data.school.profitAgent),
    f: common_vendor.t($data.school.floorPrice),
    g: common_vendor.t($data.school.updateTime),
    h: common_vendor.p({
      title: "跑腿收益展示"
    }),
    i: common_vendor.t($data.userInfo.userWx.isRunner == 0 ? "申请跑腿" : "已通过"),
    j: common_vendor.o($options.toApply, "ac"),
    k: common_vendor.p({
      block: true,
      type: "info",
      disabled: $data.userInfo.userWx.isRunner
    }),
    l: common_vendor.p({
      span: 18
    }),
    m: common_vendor.p({
      name: "horizontal"
    }),
    n: common_vendor.o($options.showActionProcess, "7d"),
    o: common_vendor.p({
      loading: $data.btnListLoading,
      shape: "square",
      plain: true,
      type: "info"
    }),
    p: common_vendor.p({
      span: 4
    }),
    q: common_vendor.p({
      type: "flex",
      justify: "space-evenly"
    }),
    r: common_vendor.f($data.list, (item, index, i0) => {
      return common_vendor.e({
        a: item.status == 1
      }, item.status == 1 ? {
        b: "04235442-11-" + i0 + "," + ("04235442-10-" + i0),
        c: common_vendor.p({
          title: "申请校区",
          desc: item.schoolName
        }),
        d: "04235442-12-" + i0 + "," + ("04235442-10-" + i0),
        e: common_vendor.p({
          title: "真实姓名",
          desc: item.realname
        }),
        f: "04235442-13-" + i0 + "," + ("04235442-10-" + i0),
        g: common_vendor.p({
          title: "性别",
          desc: item.gender == 1 ? "男" : "女"
        }),
        h: "04235442-14-" + i0 + "," + ("04235442-10-" + i0),
        i: common_vendor.p({
          title: "更新时间",
          desc: item.updateTime
        }),
        j: common_vendor.o(($event) => $options.viewImage(item.studentCardUrl), index),
        k: item.studentCardUrl,
        l: common_vendor.t(item.remarks == "" ? "暂无" : item.remarks),
        m: "04235442-10-" + i0 + "," + ("04235442-9-" + i0),
        n: common_vendor.p({
          title: "已通过",
          name: index,
          value: item.createTime
        })
      } : {}, {
        o: item.status == 0
      }, item.status == 0 ? {
        p: "04235442-16-" + i0 + "," + ("04235442-15-" + i0),
        q: common_vendor.p({
          title: "申请校区",
          desc: item.schoolName
        }),
        r: "04235442-17-" + i0 + "," + ("04235442-15-" + i0),
        s: common_vendor.p({
          title: "真实姓名",
          desc: item.realname
        }),
        t: "04235442-18-" + i0 + "," + ("04235442-15-" + i0),
        v: common_vendor.p({
          title: "性别",
          desc: item.gender == 1 ? "男" : "女"
        }),
        w: "04235442-19-" + i0 + "," + ("04235442-15-" + i0),
        x: common_vendor.p({
          title: "更新时间",
          desc: item.updateTime
        }),
        y: common_vendor.o(($event) => $options.viewImage(item.studentCardUrl), index),
        z: item.studentCardUrl,
        A: common_vendor.t(item.remarks == "" ? "暂无" : item.remarks),
        B: "04235442-15-" + i0 + "," + ("04235442-9-" + i0),
        C: common_vendor.p({
          title: "已驳回",
          name: index,
          value: item.createTime
        })
      } : {}, {
        D: item.status == 2
      }, item.status == 2 ? {
        E: "04235442-21-" + i0 + "," + ("04235442-20-" + i0),
        F: common_vendor.p({
          title: "申请校区",
          desc: item.schoolName
        }),
        G: "04235442-22-" + i0 + "," + ("04235442-20-" + i0),
        H: common_vendor.p({
          title: "真实姓名",
          desc: item.realname
        }),
        I: "04235442-23-" + i0 + "," + ("04235442-20-" + i0),
        J: common_vendor.p({
          title: "性别",
          desc: item.gender == 1 ? "男" : "女"
        }),
        K: "04235442-24-" + i0 + "," + ("04235442-20-" + i0),
        L: common_vendor.p({
          title: "更新时间",
          desc: item.updateTime
        }),
        M: common_vendor.o(($event) => $options.viewImage(item.studentCardUrl), index),
        N: item.studentCardUrl,
        O: common_vendor.t(item.remarks == "" ? "暂无" : item.remarks),
        P: "04235442-20-" + i0 + "," + ("04235442-9-" + i0),
        Q: common_vendor.p({
          title: "审核中",
          name: index,
          value: item.createTime
        })
      } : {}, {
        R: index,
        S: "04235442-9-" + i0 + ",04235442-8",
        T: common_vendor.p({
          accordion: true,
          ["v-model"]: index
        })
      });
    }),
    s: common_vendor.o(($event) => $data.visible1 = $event, "f4"),
    t: common_vendor.p({
      title: "申请记录",
      visible: $data.visible1
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/runner/introduce/introduce.js.map

"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_apis_address = require("../../../../request/apis/address.js");
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
      skeletonLoading: true,
      loading: true,
      title: "Hello",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      // 总条数
      total: 0,
      rows: [],
      dataOptions: {
        fullAddress: (item) => `${item.title || ""}${"-" + item.detail || ""}`,
        addressName: "name",
        defaultAddress: (item) => item.isDefault === 1
      }
    };
  },
  onLoad() {
  },
  onShow() {
    this.resizePage();
    this.getList();
  },
  onHide() {
  },
  onReachBottom() {
  },
  methods: {
    onScroll(e) {
      common_vendor.index.__f__("log", "at pages/API/address/list/list.vue:91", e);
    },
    resizePage() {
      this.rows = [];
    },
    onItemClick(Event, item, index) {
      common_vendor.index.__f__("log", "at pages/API/address/list/list.vue:97", index);
    },
    onItemEditClick(item) {
      common_vendor.index.__f__("log", "at pages/API/address/list/list.vue:100", item);
      common_vendor.index.navigateTo({
        url: "/pages/API/address/edit/edit?addressId=" + item.id
      });
    },
    onItemDelClick(Event, item, index) {
      request_apis_address.delAddress(item.id).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/address/list/list.vue:108", res);
        this.rows.splice(index, 1);
        this.showSuccess("删除成功");
      }).catch((err) => {
        this.showDanger(err);
      });
    },
    getList() {
      this.skeletonLoading = true;
      request_apis_address.getListAddress().then((res) => {
        common_vendor.index.__f__("log", "at pages/API/address/list/list.vue:119", res);
        this.total = res.data.length;
        this.rows.push(...res.data);
        this.skeletonLoading = false;
      }).catch((err) => {
        this.showDanger(err);
      });
    },
    toAddressAdd() {
      common_vendor.index.navigateTo({
        url: "/pages/API/address/add/add"
      });
    }
  }
};
if (!Array) {
  const _easycom_nut_notify2 = common_vendor.resolveComponent("nut-notify");
  const _component_template = common_vendor.resolveComponent("template");
  const _easycom_nut_skeleton2 = common_vendor.resolveComponent("nut-skeleton");
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_address_list2 = common_vendor.resolveComponent("nut-address-list");
  const _easycom_nut_empty2 = common_vendor.resolveComponent("nut-empty");
  const _easycom_nut_button2 = common_vendor.resolveComponent("nut-button");
  const _easycom_nut_safe_area2 = common_vendor.resolveComponent("nut-safe-area");
  (_easycom_nut_notify2 + _component_template + _easycom_nut_skeleton2 + _easycom_nut_icon2 + _easycom_nut_address_list2 + _easycom_nut_empty2 + _easycom_nut_button2 + _easycom_nut_safe_area2)();
}
const _easycom_nut_notify = () => "../../../../node-modules/nutui-uniapp/components/notify/notify.js";
const _easycom_nut_skeleton = () => "../../../../node-modules/nutui-uniapp/components/skeleton/skeleton.js";
const _easycom_nut_icon = () => "../../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_address_list = () => "../../../../node-modules/nutui-uniapp/components/addresslist/addresslist.js";
const _easycom_nut_empty = () => "../../../../node-modules/nutui-uniapp/components/empty/empty.js";
const _easycom_nut_button = () => "../../../../node-modules/nutui-uniapp/components/button/button.js";
const _easycom_nut_safe_area = () => "../../../../node-modules/nutui-uniapp/components/safearea/safearea.js";
if (!Math) {
  (_easycom_nut_notify + _easycom_nut_skeleton + _easycom_nut_icon + _easycom_nut_address_list + _easycom_nut_empty + _easycom_nut_button + _easycom_nut_safe_area)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(8, (item, index, i0) => {
      return {
        a: index,
        b: "9d916556-1-" + i0
      };
    }),
    b: common_vendor.p({
      width: "100%",
      height: "24px",
      title: true,
      animated: true,
      row: "1"
    }),
    c: $data.skeletonLoading,
    d: common_vendor.w(({
      item
    }, s0, i0) => {
      return {
        a: common_vendor.o(($event) => $options.onItemEditClick(item), "16"),
        b: "9d916556-3-" + i0 + ",9d916556-2",
        c: i0,
        d: s0
      };
    }, {
      name: "itemIcon",
      path: "d",
      vueId: "9d916556-2"
    }),
    e: common_vendor.p({
      name: "edit"
    }),
    f: common_vendor.o($options.onScroll, "47"),
    g: common_vendor.o($options.onItemClick, "0f"),
    h: common_vendor.o($options.onItemDelClick, "b2"),
    i: common_vendor.p({
      data: $data.rows,
      options: $data.dataOptions,
      ["show-bottom-button"]: false,
      ["swipe-edition"]: true
    }),
    j: $data.total != 0,
    k: common_vendor.p({
      description: "暂无数据"
    }),
    l: $data.total == 0 && $data.skeletonLoading == false,
    m: !$data.skeletonLoading,
    n: common_vendor.o($options.toAddressAdd, "b1"),
    o: common_vendor.p({
      block: true,
      type: "info"
    }),
    p: common_vendor.p({
      position: "bottom"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/address/list/list.js.map

"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  NutIcon();
}
const NutIcon = () => "../../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-address-list-item`;
const { translate } = common_vendor.useTranslate(`${common_vendor.PREFIX}-address-list`);
const __default__ = common_vendor.defineComponent({
  name: componentName,
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
});
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    useContentTopSlot: Boolean,
    useContentIconSlot: Boolean,
    useContentAddrSlot: Boolean
  },
  emits: ["delIcon", "editIcon", "clickItem"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function handleDelIconClick(event) {
      event.stopPropagation();
      emit("delIcon", event, props.item);
    }
    function handleEditIconClick(event) {
      event.stopPropagation();
      emit("editIcon", event, props.item);
    }
    function handleContentsClick(event) {
      event.stopPropagation();
      emit("clickItem", event, props.item);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.useContentTopSlot
      }, props.useContentTopSlot ? {} : common_vendor.e({
        b: common_vendor.t(props.item.addressName),
        c: common_vendor.t(props.item.phone),
        d: props.item.defaultAddress
      }, props.item.defaultAddress ? {
        e: common_vendor.t(common_vendor.unref(translate)("default"))
      } : {}), {
        f: props.useContentIconSlot
      }, props.useContentIconSlot ? {} : {
        g: common_vendor.o(handleDelIconClick, "d2"),
        h: common_vendor.p({
          name: "del",
          ["custom-class"]: "nut-address-list-item__info-handle-del"
        }),
        i: common_vendor.o(handleEditIconClick, "bd"),
        j: common_vendor.p({
          name: "edit",
          ["custom-class"]: "nut-address-list-item__info-handle-edit"
        })
      }, {
        k: props.useContentAddrSlot
      }, props.useContentAddrSlot ? {} : {
        l: common_vendor.t(props.item.fullAddress)
      }, {
        m: common_vendor.o(handleContentsClick, "a0")
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/addresslist/compoents/Itemcontents.js.map

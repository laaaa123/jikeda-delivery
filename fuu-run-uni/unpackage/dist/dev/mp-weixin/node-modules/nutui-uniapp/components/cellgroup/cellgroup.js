"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-cell-group`;
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
  props: common_vendor.cellgroupProps,
  setup(__props) {
    const props = __props;
    const slots = common_vendor.useSlots();
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(slots).title
      }, common_vendor.unref(slots).title ? {} : common_vendor.e({
        b: props.title
      }, props.title ? {
        c: common_vendor.t(props.title)
      } : {}), {
        d: common_vendor.unref(slots).desc
      }, common_vendor.unref(slots).desc ? {} : common_vendor.e({
        e: props.desc
      }, props.desc ? {
        f: common_vendor.t(props.desc)
      } : {}), {
        g: common_vendor.n(classes.value),
        h: common_vendor.s(props.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/cellgroup/cellgroup.js.map

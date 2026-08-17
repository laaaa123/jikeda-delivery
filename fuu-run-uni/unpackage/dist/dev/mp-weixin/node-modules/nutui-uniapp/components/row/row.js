"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-row`;
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
  props: common_vendor.rowProps,
  setup(__props) {
    const props = __props;
    common_vendor.provide("gutter", props.gutter);
    function getClass(prefix, type) {
      return prefix ? type ? `nut-row-${prefix}-${type}` : "" : `nut-row-${type}`;
    }
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, [
        getClass("", props.type),
        getClass("justify", props.justify),
        getClass("align", props.align),
        getClass("flex", props.flexWrap)
      ]);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(classes.value),
        b: common_vendor.s(_ctx.customStyle)
      };
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/row/row.js.map

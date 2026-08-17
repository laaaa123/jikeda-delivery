"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-safe-area`;
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
  props: common_vendor.safeareaProps,
  setup(__props) {
    const props = __props;
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, [
        `${componentName}-position-${props.position}`
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
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/safearea/safearea.js.map

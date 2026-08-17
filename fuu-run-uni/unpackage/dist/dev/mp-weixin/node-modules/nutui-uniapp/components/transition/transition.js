"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-transition`;
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
  props: common_vendor.transitionProps,
  emits: common_vendor.transitionEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { display, classes, clickHandler, styles } = common_vendor.useTransition(props, emits);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !props.destroyOnClose || common_vendor.unref(display)
      }, !props.destroyOnClose || common_vendor.unref(display) ? {
        b: common_vendor.n(common_vendor.unref(classes)),
        c: common_vendor.s(common_vendor.unref(styles)),
        d: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(clickHandler) && common_vendor.unref(clickHandler)(...args),
          "0f"
        )
      } : {});
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/transition/transition.js.map

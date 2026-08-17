"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-divider`;
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
  props: common_vendor.dividerProps,
  setup(__props) {
    const props = __props;
    const slotDefault = !!common_vendor.useSlots().default;
    const classes = common_vendor.computed(() => {
      let classesObj = {};
      if (props.direction === "horizontal") {
        classesObj = {
          [`${componentName}-center`]: slotDefault,
          [`${componentName}-left`]: props.contentPosition === "left",
          [`${componentName}-right`]: props.contentPosition === "right",
          [`${componentName}-dashed`]: props.dashed,
          [`${componentName}-hairline`]: props.hairline
        };
      } else {
        classesObj = {
          [`${componentName}-vertical`]: props.direction === "vertical"
        };
      }
      return common_vendor.getMainClass(props, componentName, classesObj);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.direction === "horizontal"
      }, _ctx.direction === "horizontal" ? {
        b: common_vendor.n(classes.value),
        c: common_vendor.s(_ctx.customStyle)
      } : {
        d: common_vendor.n(classes.value),
        e: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/divider/divider.js.map

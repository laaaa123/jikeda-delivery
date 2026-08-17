"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-col`;
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
  props: common_vendor.colProps,
  setup(__props) {
    const props = __props;
    const gutter = common_vendor.inject("gutter");
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [`${componentName}-gutter`]: gutter,
        [`nut-col-${props.span}`]: true,
        [`nut-col-offset-${props.offset}`]: true
      });
    });
    const style = common_vendor.computed(() => {
      return common_vendor.getMainStyle(props, {
        paddingLeft: `${gutter / 2}px`,
        paddingRight: `${gutter / 2}px`
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(classes.value),
        b: common_vendor.s(style.value)
      };
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/col/col.js.map

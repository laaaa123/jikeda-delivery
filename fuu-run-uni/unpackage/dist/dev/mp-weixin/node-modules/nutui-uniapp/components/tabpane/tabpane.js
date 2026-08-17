"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-tab-pane`;
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
  props: common_vendor.tabpaneProps,
  emits: common_vendor.tabpaneEmits,
  setup(__props) {
    const props = __props;
    const { parent } = common_vendor.useInject(common_vendor.TAB_KEY);
    const paneStyle = common_vendor.computed(() => {
      const style = {
        display: (parent == null ? void 0 : parent.animatedTime.value) === 0 && props.paneKey !== parent.activeKey.value ? "none" : void 0
      };
      return common_vendor.getMainStyle(props, style);
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        inactive: String(props.paneKey) !== (parent == null ? void 0 : parent.activeKey.value) && (parent == null ? void 0 : parent.autoHeight.value)
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.s(paneStyle.value),
        b: common_vendor.n(classes.value)
      };
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/tabpane/tabpane.js.map

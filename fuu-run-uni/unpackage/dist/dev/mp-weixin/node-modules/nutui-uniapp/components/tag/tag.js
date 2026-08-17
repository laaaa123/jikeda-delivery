"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutIcon();
}
const NutIcon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-tag`;
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
  props: common_vendor.tagProps,
  emits: common_vendor.tagEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [`${componentName}--${props.type}`]: props.type,
        [`${componentName}--plain`]: props.plain,
        [`${componentName}--round`]: props.round,
        [`${componentName}--mark`]: props.mark,
        [`${componentName}--disabled`]: props.disabled
      });
    });
    const styles = common_vendor.computed(() => {
      const value = {};
      if (props.textColor)
        value.color = props.textColor;
      if (props.customColor) {
        value.borderColor = props.customColor;
        if (props.plain) {
          if (!props.textColor)
            value.color = props.customColor;
        } else {
          value.background = props.customColor;
        }
      }
      return common_vendor.getMainStyle(props, value);
    });
    function onClick(event) {
      if (props.disabled)
        return;
      emit(common_vendor.CLICK_EVENT, event);
    }
    function onCloseClick(event) {
      if (props.disabled)
        return;
      emit(common_vendor.CLOSE_EVENT, event);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.closeable
      }, props.closeable ? {
        b: common_vendor.o(onCloseClick, "25"),
        c: common_vendor.p({
          name: "close",
          ["custom-class"]: "nut-tag--close",
          size: props.closeIconSize
        })
      } : {}, {
        d: common_vendor.n(classes.value),
        e: common_vendor.s(styles.value),
        f: common_vendor.o(onClick, "d3")
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/tag/tag.js.map

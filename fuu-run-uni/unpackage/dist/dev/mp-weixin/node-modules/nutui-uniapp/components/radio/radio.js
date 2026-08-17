"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutIcon();
}
const NutIcon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-radio`;
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
  props: common_vendor.radioProps,
  setup(__props) {
    const props = __props;
    const { parent } = common_vendor.useInject(common_vendor.RADIO_KEY);
    const disabled = common_vendor.useFormDisabled(common_vendor.toRef(props, "disabled"));
    const reverseState = common_vendor.computed(() => parent.position.value === "left");
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [`${componentName}--reverse`]: reverseState.value,
        [`${componentName}--${props.shape}`]: true
      });
    });
    function handleClick() {
      if (isCurValue.value || disabled.value)
        return;
      parent.updateValue(props.label);
    }
    const isCurValue = common_vendor.computed(() => {
      return parent.label.value === props.label;
    });
    const color = common_vendor.computed(() => {
      return !disabled.value ? isCurValue.value ? "nut-radio__icon" : "nut-radio__icon--unchecked" : "nut-radio__icon--disable";
    });
    const getButtonClass = common_vendor.computed(() => {
      return `${componentName}__button ${componentName}__button--${props.size} ${isCurValue.value && `${componentName}__button--active`} ${disabled.value ? `${componentName}__button--disabled` : ""}`;
    });
    const getLabelClass = common_vendor.computed(() => {
      return `${componentName}__label ${disabled.value ? `${componentName}__label--disabled` : ""}`;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.shape === "button"
      }, _ctx.shape === "button" ? {
        b: common_vendor.n(getButtonClass.value)
      } : reverseState.value ? common_vendor.e({
        d: common_vendor.n(getLabelClass.value),
        e: !isCurValue.value
      }, !isCurValue.value ? {
        f: common_vendor.p({
          name: "check-normal",
          size: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          width: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          height: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          ["pop-class"]: color.value
        })
      } : {
        g: common_vendor.p({
          name: "check-checked",
          size: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          width: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          height: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          ["pop-class"]: color.value
        })
      }) : common_vendor.e({
        h: !isCurValue.value
      }, !isCurValue.value ? {
        i: common_vendor.p({
          name: "check-normal",
          size: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          width: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          height: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          ["pop-class"]: color.value
        })
      } : {
        j: common_vendor.p({
          name: "check-checked",
          size: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          width: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          height: common_vendor.unref(common_vendor.pxCheck)(_ctx.iconSize),
          ["pop-class"]: color.value
        })
      }, {
        k: common_vendor.n(getLabelClass.value)
      }), {
        c: reverseState.value,
        l: common_vendor.n(classes.value),
        m: common_vendor.s(_ctx.customStyle),
        n: common_vendor.o(handleClick, "6d")
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/radio/radio.js.map

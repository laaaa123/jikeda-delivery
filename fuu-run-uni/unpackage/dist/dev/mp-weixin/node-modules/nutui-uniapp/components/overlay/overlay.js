"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutTransition();
}
const NutTransition = () => "../transition/transition.js";
const componentName = `${common_vendor.PREFIX}-overlay`;
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
  props: common_vendor.overlayProps,
  emits: common_vendor.overlayEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [props.overlayClass]: true
      });
    });
    const innerDuration = common_vendor.computed(() => {
      if (typeof props.duration === "number")
        return props.duration;
      return Number(props.duration);
    });
    const styles = common_vendor.computed(() => {
      return common_vendor.getMainStyle(props, {
        transitionDuration: `${innerDuration.value}ms`,
        zIndex: props.zIndex,
        ...props.overlayStyle
      });
    });
    function onClick(event) {
      emit(common_vendor.CLICK_EVENT, event);
      if (props.closeOnClickOverlay)
        emit(common_vendor.UPDATE_VISIBLE_EVENT, false);
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(onClick, "7c"),
        b: common_vendor.p({
          ["custom-class"]: classes.value,
          ["custom-style"]: styles.value,
          show: props.visible,
          name: "fade",
          duration: innerDuration.value,
          ["destroy-on-close"]: props.destroyOnClose
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/overlay/overlay.js.map

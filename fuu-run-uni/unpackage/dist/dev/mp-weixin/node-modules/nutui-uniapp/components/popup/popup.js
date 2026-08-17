"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  (NutOverlay + NutIcon + NutTransition)();
}
const NutIcon = () => "../icon/icon.js";
const NutOverlay = () => "../overlay/overlay.js";
const NutTransition = () => "../transition/transition.js";
const componentName = `${common_vendor.PREFIX}-popup`;
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
  props: common_vendor.popupProps,
  emits: common_vendor.popupEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const {
      classes,
      popStyle,
      innerIndex,
      showSlot,
      transitionName,
      onClick,
      onClickCloseIcon,
      onClickOverlay,
      onOpened,
      onClosed
    } = common_vendor.usePopup(props, emit);
    const innerDuration = common_vendor.computed(() => {
      return Number(props.duration);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.overlay
      }, props.overlay ? {
        b: common_vendor.o(common_vendor.unref(onClickOverlay), "a3"),
        c: common_vendor.p({
          ["overlay-class"]: props.overlayClass,
          ["overlay-style"]: props.overlayStyle,
          visible: props.visible,
          ["z-index"]: common_vendor.unref(innerIndex),
          duration: innerDuration.value,
          ["lock-scroll"]: props.lockScroll,
          ["close-on-click-overlay"]: props.closeOnClickOverlay,
          ["destroy-on-close"]: props.destroyOnClose
        })
      } : {}, {
        d: common_vendor.unref(showSlot)
      }, common_vendor.unref(showSlot) ? {} : {}, {
        e: props.closeable
      }, props.closeable ? {
        f: common_vendor.p({
          name: "close",
          height: "12px"
        }),
        g: common_vendor.n(`nut-popup__close-icon--${props.closeIconPosition}`),
        h: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(onClickCloseIcon) && common_vendor.unref(onClickCloseIcon)(...args),
          "48"
        )
      } : {}, {
        i: common_vendor.o(common_vendor.unref(onOpened), "74"),
        j: common_vendor.o(common_vendor.unref(onClosed), "01"),
        k: common_vendor.o(common_vendor.unref(onClick), "d4"),
        l: common_vendor.p({
          ["custom-class"]: common_vendor.unref(classes),
          ["custom-style"]: common_vendor.unref(popStyle),
          name: common_vendor.unref(transitionName),
          show: props.visible,
          duration: innerDuration.value,
          ["destroy-on-close"]: props.destroyOnClose
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/popup/popup.js.map

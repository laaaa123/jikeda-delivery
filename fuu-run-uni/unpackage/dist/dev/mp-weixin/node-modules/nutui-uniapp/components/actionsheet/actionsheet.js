"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  (NutIcon + NutPopup)();
}
const NutIcon = () => "../icon/icon.js";
const NutPopup = () => "../popup/popup.js";
const componentName = `${common_vendor.PREFIX}-action-sheet`;
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
  props: common_vendor.actionsheetProps,
  emits: common_vendor.actionsheetEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slotDefault = !!common_vendor.useSlots().default;
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    function isHighlight(item) {
      return props.chooseTagValue && props.chooseTagValue === item[props.optionTag] ? props.customColor : "";
    }
    function cancelActionSheet() {
      emit(common_vendor.CANCEL_EVENT);
      emit(common_vendor.UPDATE_VISIBLE_EVENT, false);
    }
    function chooseItem(item, index) {
      if (!item.disable && !item.loading) {
        emit(common_vendor.CHOOSE_EVENT, item, index);
        emit(common_vendor.UPDATE_VISIBLE_EVENT, false);
      }
    }
    function close() {
      if (props.closeAbled) {
        emit(common_vendor.CLOSE_EVENT);
        emit(common_vendor.UPDATE_VISIBLE_EVENT, false);
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.title
      }, props.title ? {
        b: common_vendor.t(props.title)
      } : {}, {
        c: !slotDefault
      }, !slotDefault ? common_vendor.e({
        d: props.description
      }, props.description ? {
        e: common_vendor.t(props.description)
      } : {}, {
        f: props.menuItems.length
      }, props.menuItems.length ? {
        g: common_vendor.f(props.menuItems, (item, index, i0) => {
          return common_vendor.e({
            a: item.loading
          }, item.loading ? {
            b: "15ce4466-1-" + i0 + ",15ce4466-0",
            c: common_vendor.p({
              name: "loading"
            })
          } : {
            d: common_vendor.t(item[props.optionTag])
          }, {
            e: common_vendor.t(item[props.optionSubTag]),
            f: index,
            g: item.disable ? 1 : "",
            h: item.loading ? 1 : "",
            i: isHighlight(item) || item.color,
            j: common_vendor.o(($event) => chooseItem(item, index), index)
          });
        })
      } : {}, {
        h: props.cancelTxt
      }, props.cancelTxt ? {
        i: common_vendor.t(props.cancelTxt),
        j: common_vendor.o(cancelActionSheet, "4d")
      } : {}) : {}, {
        k: common_vendor.n(classes.value),
        l: common_vendor.s(props.customStyle),
        m: common_vendor.o(close, "39"),
        n: common_vendor.p({
          ["pop-class"]: props.popClass,
          ["custom-style"]: props.popStyle,
          visible: props.visible,
          position: "bottom",
          overlay: props.overlay,
          round: props.round,
          ["safe-area-inset-bottom"]: props.safeAreaInsetBottom,
          ["z-index"]: props.zIndex,
          duration: props.duration,
          ["overlay-class"]: props.overlayClass,
          ["overlay-style"]: props.overlayStyle,
          ["lock-scroll"]: props.lockScroll,
          ["close-on-click-overlay"]: props.closeAbled
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/actionsheet/actionsheet.js.map

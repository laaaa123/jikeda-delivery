"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutPopup();
}
const NutPopup = () => "../popup/popup.js";
const componentName = `${common_vendor.PREFIX}-notify`;
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
  props: common_vendor.notifyProps,
  emits: common_vendor.notifyEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = common_vendor.useSlots();
    const notifyOptionsKey = `${common_vendor.notifyDefaultOptionsKey}${props.selector || ""}`;
    const injectNotifyOptions = common_vendor.inject(notifyOptionsKey, common_vendor.ref(common_vendor.cloneDeep(common_vendor.notifyDefaultOptions)));
    const innerVisible = common_vendor.ref(false);
    const notifyOptions = common_vendor.ref(common_vendor.cloneDeep(props));
    const classes = common_vendor.computed(() => {
      const { type, className } = notifyOptions.value;
      const value = {
        [`nut-notify--${type}`]: true
      };
      if (className) {
        value[className] = true;
      }
      return common_vendor.getMainClass(props, componentName, value);
    });
    const styles = common_vendor.computed(() => {
      const value = {};
      const { customColor, background } = notifyOptions.value;
      if (customColor) {
        value.color = customColor;
      }
      if (background) {
        value.background = background;
      }
      return common_vendor.getMainStyle(props, value);
    });
    const wrapperStyles = common_vendor.computed(() => {
      const value = {};
      const { position, safeAreaInsetTop, safeAreaInsetBottom, safeHeight } = notifyOptions.value;
      if (position === "top") {
        if (safeAreaInsetTop) {
          if (safeHeight) {
            value.top = common_vendor.pxCheck(safeHeight);
          } else {
            value.top = `${common_vendor.index.getSystemInfoSync().statusBarHeight}px`;
          }
        }
      } else if (position === "bottom") {
        if (safeAreaInsetBottom) {
          if (safeHeight) {
            value.bottom = common_vendor.pxCheck(safeHeight);
          }
        }
      }
      return value;
    });
    let timer = null;
    function startTimer() {
      timer = setTimeout(() => {
        hide();
      }, notifyOptions.value.duration);
    }
    function destroyTimer() {
      if (timer == null)
        return;
      clearTimeout(timer);
      timer = null;
    }
    function show(type, msg, options) {
      destroyTimer();
      notifyOptions.value = Object.assign(common_vendor.cloneDeep(common_vendor.notifyDefaultOptions), {
        visible: true,
        type,
        msg
      }, options);
      innerVisible.value = true;
      if (notifyOptions.value.duration > 0)
        startTimer();
    }
    function legacyShow(options) {
      show(common_vendor.notifyDefaultOptions.type, options.msg || common_vendor.notifyDefaultOptions.msg, options);
    }
    function showPrimary(msg, options) {
      show("primary", msg, options);
    }
    function showSuccess(msg, options) {
      show("success", msg, options);
    }
    function showDanger(msg, options) {
      show("danger", msg, options);
    }
    function showWarning(msg, options) {
      show("warning", msg, options);
    }
    function showCustom(msg, options) {
      show("custom", msg, options);
    }
    function hide() {
      destroyTimer();
      innerVisible.value = false;
      notifyOptions.value.visible = false;
      emit(common_vendor.UPDATE_VISIBLE_EVENT, false);
      emit(common_vendor.CLOSE_EVENT);
      if (notifyOptions.value.onClose) {
        notifyOptions.value.onClose();
      }
    }
    function handleClosed() {
      emit(common_vendor.CLOSED_EVENT);
      if (notifyOptions.value.onClosed) {
        notifyOptions.value.onClosed();
      }
    }
    function handleClick() {
      emit(common_vendor.CLICK_EVENT);
      if (notifyOptions.value.onClick) {
        notifyOptions.value.onClick();
      }
    }
    common_vendor.watch(() => props, (value) => {
      notifyOptions.value = Object.assign(common_vendor.cloneDeep(common_vendor.notifyDefaultOptions), value);
      if (value.visible)
        show(notifyOptions.value.type, notifyOptions.value.msg, notifyOptions.value);
      else
        hide();
    }, { deep: true });
    common_vendor.watch(injectNotifyOptions, (value) => {
      notifyOptions.value = Object.assign(common_vendor.cloneDeep(common_vendor.notifyDefaultOptions), value);
      if (value.visible)
        show(notifyOptions.value.type, notifyOptions.value.msg, notifyOptions.value);
      else
        hide();
    });
    common_vendor.onBeforeUnmount(() => {
      destroyTimer();
    });
    __expose({
      showNotify: legacyShow,
      hideNotify: hide,
      show,
      primary: showPrimary,
      success: showSuccess,
      danger: showDanger,
      warning: showWarning,
      custom: showCustom,
      hide
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(slots).default
      }, common_vendor.unref(slots).default ? {} : {
        b: common_vendor.t(notifyOptions.value.msg)
      }, {
        c: common_vendor.n(classes.value),
        d: common_vendor.s(styles.value),
        e: common_vendor.o(handleClick, "37"),
        f: common_vendor.o(handleClosed, "f7"),
        g: common_vendor.o(($event) => innerVisible.value = $event, "a0"),
        h: common_vendor.p({
          ["custom-style"]: wrapperStyles.value,
          position: notifyOptions.value.position,
          overlay: false,
          ["z-index"]: notifyOptions.value.zIndex,
          ["safe-area-inset-top"]: false,
          ["safe-area-inset-bottom"]: false,
          visible: innerVisible.value
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/notify/notify.js.map

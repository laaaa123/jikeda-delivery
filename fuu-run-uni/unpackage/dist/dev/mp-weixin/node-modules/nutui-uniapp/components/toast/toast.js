"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  (NutIcon + NutTransition)();
}
const NutIcon = () => "../icon/icon.js";
const NutTransition = () => "../transition/transition.js";
const componentName = `${common_vendor.PREFIX}-toast`;
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
  props: common_vendor.toastProps,
  emits: common_vendor.toastEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = common_vendor.useSlots();
    const toastOptionsKey = `${common_vendor.toastDefaultOptionsKey}${props.selector || ""}`;
    const injectToastOptions = common_vendor.inject(toastOptionsKey, common_vendor.ref(common_vendor.cloneDeep(common_vendor.toastDefaultOptions)));
    const typeIcons = {
      text: "",
      success: "success",
      error: "failure",
      warning: "tips",
      loading: "loading"
    };
    const innerVisible = common_vendor.ref(false);
    const toastOptions = common_vendor.ref(common_vendor.cloneDeep(props));
    const iconName = common_vendor.computed(() => {
      const { icon, type } = toastOptions.value;
      return icon || typeIcons[type];
    });
    const hasIcon = common_vendor.computed(() => {
      return Boolean(iconName.value);
    });
    const classes = common_vendor.computed(() => {
      const { size, cover, center, type, loadingRotate } = toastOptions.value;
      return common_vendor.getMainClass(props, componentName, {
        [`nut-toast-${size}`]: true,
        "nut-toast-cover": cover,
        "nut-toast-center": center,
        "nut-toast-loading": type === "loading",
        "nut-toast-loading-rotate": loadingRotate,
        "nut-toast-has-icon": hasIcon.value
      });
    });
    const styles = common_vendor.computed(() => {
      return common_vendor.getMainStyle(props, {
        zIndex: toastOptions.value.zIndex
      });
    });
    const wrapperStyles = common_vendor.computed(() => {
      const value = {};
      const { cover, coverColor, center, bottom } = toastOptions.value;
      if (cover) {
        value.backgroundColor = coverColor;
      } else {
        if (!center)
          value.bottom = common_vendor.pxCheck(bottom);
      }
      return value;
    });
    const innerStyles = common_vendor.computed(() => {
      const { textAlignCenter, bgColor, cover, center, bottom } = toastOptions.value;
      const value = {
        textAlign: textAlignCenter ? "center" : "left",
        backgroundColor: bgColor
      };
      if (cover) {
        if (!center)
          value.bottom = common_vendor.pxCheck(bottom);
      }
      return value;
    });
    let timer = null;
    function startTimer() {
      timer = setTimeout(() => {
        hide();
      }, toastOptions.value.duration);
    }
    function destroyTimer() {
      if (timer == null)
        return;
      clearTimeout(timer);
      timer = null;
    }
    function show(type, msg, options) {
      destroyTimer();
      toastOptions.value = Object.assign(common_vendor.cloneDeep(common_vendor.toastDefaultOptions), {
        visible: true,
        type,
        msg
      }, options);
      innerVisible.value = true;
      if (toastOptions.value.duration > 0)
        startTimer();
    }
    function showText(msg, options) {
      show("text", msg, options);
    }
    function showSuccess(msg, options) {
      show("success", msg, options);
    }
    function showError(msg, options) {
      show("error", msg, options);
    }
    function showWarning(msg, options) {
      show("warning", msg, options);
    }
    function showLoading(msg, options) {
      show("loading", msg, Object.assign({
        duration: 0,
        cover: true
      }, options));
    }
    function hide() {
      destroyTimer();
      innerVisible.value = false;
      toastOptions.value.visible = false;
      emit(common_vendor.UPDATE_VISIBLE_EVENT, false);
      emit(common_vendor.CLOSE_EVENT);
      if (toastOptions.value.onClose) {
        toastOptions.value.onClose();
      }
    }
    function handleAfterLeave() {
      emit(common_vendor.CLOSED_EVENT);
      if (toastOptions.value.onClosed) {
        toastOptions.value.onClosed();
      }
    }
    function handleCoverClick() {
      if (!toastOptions.value.closeOnClickOverlay)
        return;
      hide();
    }
    common_vendor.watch(() => props, (value) => {
      toastOptions.value = Object.assign(common_vendor.cloneDeep(common_vendor.toastDefaultOptions), value);
      if (value.visible)
        show(toastOptions.value.type, toastOptions.value.msg, toastOptions.value);
      else
        hide();
    }, { deep: true });
    common_vendor.watch(injectToastOptions, (value) => {
      toastOptions.value = Object.assign(common_vendor.cloneDeep(common_vendor.toastDefaultOptions), value);
      if (value.visible)
        show(toastOptions.value.type, toastOptions.value.msg, toastOptions.value);
      else
        hide();
    });
    common_vendor.onBeforeUnmount(() => {
      destroyTimer();
    });
    __expose({
      showToast: {
        text: showText,
        success: showSuccess,
        fail: showError,
        warn: showWarning,
        loading: showLoading
      },
      hideToast: hide,
      text: showText,
      success: showSuccess,
      error: showError,
      warning: showWarning,
      loading: showLoading,
      hide
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(slots).default
      }, common_vendor.unref(slots).default ? {} : common_vendor.e({
        b: hasIcon.value
      }, hasIcon.value ? {
        c: common_vendor.p({
          name: iconName.value,
          size: toastOptions.value.iconSize,
          ["custom-color"]: "#ffffff"
        })
      } : {}, {
        d: toastOptions.value.title
      }, toastOptions.value.title ? {
        e: common_vendor.t(toastOptions.value.title)
      } : {}, {
        f: toastOptions.value.msg
      }, toastOptions.value.msg ? {
        g: toastOptions.value.msg
      } : {}, {
        h: common_vendor.s(innerStyles.value)
      }), {
        i: common_vendor.s(wrapperStyles.value),
        j: common_vendor.o(handleCoverClick, "ec"),
        k: common_vendor.o(handleAfterLeave, "36"),
        l: common_vendor.p({
          ["custom-class"]: classes.value,
          ["custom-style"]: styles.value,
          show: innerVisible.value,
          name: "fade"
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/toast/toast.js.map

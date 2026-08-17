"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutIcon();
}
const NutIcon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-searchbar`;
const { translate } = common_vendor.useTranslate(componentName);
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
  props: common_vendor.searchbarProps,
  emits: common_vendor.searchbarEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = common_vendor.useSlots();
    function hasSlot(name) {
      return Boolean(slots[name]);
    }
    const formDisabled = common_vendor.useFormDisabled(common_vendor.toRef(props, "disabled"));
    const state = common_vendor.reactive({
      active: false
    });
    function stringModelValue() {
      if (props.modelValue == null)
        return "";
      return String(props.modelValue);
    }
    const innerValue = common_vendor.computed(() => {
      return stringModelValue();
    });
    const innerMaxLength = common_vendor.computed(() => {
      if (props.maxLength == null)
        return -1;
      return Number(props.maxLength);
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        "safe-area-inset-bottom": props.safeAreaInsetBottom
      });
    });
    const styles = common_vendor.computed(() => {
      return common_vendor.getMainStyle(props, {
        background: props.background
      });
    });
    const inputWrapperStyles = common_vendor.computed(() => {
      const style = {
        background: props.inputBackground
      };
      if (state.active)
        Object.assign(style, props.focusStyle);
      return style;
    });
    const inputStyles = common_vendor.computed(() => {
      return {
        textAlign: props.inputAlign
      };
    });
    function handleValue(value) {
      if (innerMaxLength.value > 0 && value.length > innerMaxLength.value)
        value = value.slice(0, innerMaxLength.value);
      return value;
    }
    function handleInput(event) {
      const value = handleValue(event.detail.value);
      emit(common_vendor.UPDATE_MODEL_EVENT, value, event);
      emit(common_vendor.CHANGE_EVENT, value, event);
    }
    function handleFocus(event) {
      const value = handleValue(event.detail.value);
      state.active = true;
      emit(common_vendor.FOCUS_EVENT, value, event);
    }
    function handleBlur(event) {
      const value = handleValue(event.detail.value);
      setTimeout(() => {
        state.active = false;
      }, 200);
      emit(common_vendor.BLUR_EVENT, value, event);
    }
    function handleClear(event) {
      emit(common_vendor.UPDATE_MODEL_EVENT, "", event);
      emit(common_vendor.CHANGE_EVENT, "", event);
      emit(common_vendor.CLEAR_EVENT, "");
    }
    function handleSubmit() {
      emit(common_vendor.SEARCH_EVENT, innerValue.value);
    }
    function handleInputClick(event) {
      emit("clickInput", innerValue.value, event);
    }
    function handleLeftIconClick(event) {
      emit("clickLeftIcon", innerValue.value, event);
    }
    function handleRightIconClick(event) {
      emit("clickRightIcon", innerValue.value, event);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: hasSlot("leftout")
      }, hasSlot("leftout") ? {
        b: common_vendor.o(handleLeftIconClick, "aa")
      } : {}, {
        c: hasSlot("leftin")
      }, hasSlot("leftin") ? {} : {}, {
        d: props.clearable ? 1 : "",
        e: common_vendor.s(inputStyles.value),
        f: props.inputType,
        g: innerMaxLength.value,
        h: props.placeholder || common_vendor.unref(translate)("placeholder"),
        i: innerValue.value,
        j: props.autofocus,
        k: props.confirmType,
        l: common_vendor.unref(formDisabled),
        m: props.readonly,
        n: props.cursorSpacing,
        o: common_vendor.o(handleInputClick, "90"),
        p: common_vendor.o(handleInput, "20"),
        q: common_vendor.o(handleFocus, "04"),
        r: common_vendor.o(handleBlur, "76"),
        s: common_vendor.o(handleSubmit, "df"),
        t: common_vendor.o(handleSubmit, "c2"),
        v: hasSlot("rightin") ? 1 : "",
        w: props.clearable
      }, props.clearable ? common_vendor.e({
        x: hasSlot("clear-icon")
      }, hasSlot("clear-icon") ? {} : {
        y: common_vendor.p({
          name: props.clearIcon
        })
      }, {
        z: innerValue.value.length <= 0 ? 1 : "",
        A: common_vendor.o(handleClear, "26")
      }) : {}, {
        B: hasSlot("rightin")
      }, hasSlot("rightin") ? {
        C: common_vendor.o(handleRightIconClick, "30")
      } : {}, {
        D: hasSlot("rightin") ? 1 : "",
        E: common_vendor.n(props.shape),
        F: common_vendor.s(inputWrapperStyles.value),
        G: hasSlot("rightout")
      }, hasSlot("rightout") ? {} : {}, {
        H: common_vendor.n(classes.value),
        I: common_vendor.s(styles.value)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/searchbar/searchbar.js.map

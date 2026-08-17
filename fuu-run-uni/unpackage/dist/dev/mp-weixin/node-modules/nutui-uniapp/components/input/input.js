"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutIcon();
}
const NutIcon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-input`;
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
  props: common_vendor.inputProps,
  emits: common_vendor.inputEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = common_vendor.useSlots();
    function hasSlot(name) {
      return Boolean(slots[name]);
    }
    const formDisabled = common_vendor.useFormDisabled(common_vendor.toRef(props, "disabled"));
    function stringModelValue() {
      if (props.modelValue == null)
        return "";
      return String(props.modelValue);
    }
    const innerValue = common_vendor.computed(() => {
      return stringModelValue();
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [`${componentName}--disabled`]: formDisabled.value,
        [`${componentName}--required`]: props.required,
        [`${componentName}--error`]: props.error,
        [`${componentName}--border`]: props.border
      });
    });
    const inputStyles = common_vendor.computed(() => {
      return [props.inputStyle, {
        textAlign: props.inputAlign
      }];
    });
    const innerMaxLength = common_vendor.computed(() => {
      if (props.maxLength == null)
        return -1;
      return Number(props.maxLength);
    });
    function updateValue(value, trigger = "onChange") {
      if (innerMaxLength.value > 0 && value.length > innerMaxLength.value)
        value = value.slice(0, innerMaxLength.value);
      if (props.type === "number")
        value = common_vendor.formatNumber(value, false, false);
      if (props.type === "digit")
        value = common_vendor.formatNumber(value, true, true);
      if (props.formatter && trigger === props.formatTrigger)
        value = props.formatter(value);
      emit(common_vendor.UPDATE_MODEL_EVENT, value);
    }
    function _onInput(evt) {
      updateValue(evt.detail.value);
      common_vendor.nextTick$1(() => {
        emit(common_vendor.INPUT_EVENT, innerValue.value, evt);
      });
    }
    function handleInput(evt) {
      if (common_vendor.isH5) {
        const target = evt.target;
        if (!target.composing)
          _onInput(evt);
      } else {
        _onInput(evt);
      }
    }
    function handleClick(evt) {
      emit(common_vendor.CLICK_EVENT, evt);
    }
    function handleClickInput(evt) {
      if (formDisabled.value)
        return;
      emit("clickInput", evt);
    }
    const active = common_vendor.ref(false);
    const clearing = common_vendor.ref(false);
    function handleFocus(evt) {
      if (formDisabled.value || props.readonly)
        return;
      emit(common_vendor.FOCUS_EVENT, evt);
      active.value = true;
    }
    function handleBlur(evt) {
      if (formDisabled.value || props.readonly)
        return;
      emit(common_vendor.BLUR_EVENT, evt);
      setTimeout(() => {
        active.value = false;
      }, 200);
      if (clearing.value) {
        clearing.value = false;
        return;
      }
      updateValue(evt.detail.value, "onBlur");
    }
    function handleConfirm(evt) {
      emit(common_vendor.CONFIRM_EVENT, evt);
    }
    function handleClear(evt) {
      if (formDisabled.value)
        return;
      emit(common_vendor.UPDATE_MODEL_EVENT, "", evt);
      emit(common_vendor.CLEAR_EVENT);
      clearing.value = true;
    }
    function startComposing(evt) {
      if (common_vendor.isH5) {
        const target = evt.target;
        target.composing = true;
      }
    }
    function endComposing(evt) {
      if (common_vendor.isH5) {
        const target = evt.target;
        if (target.composing) {
          target.composing = false;
          target.dispatchEvent(new Event("input"));
        }
      }
    }
    common_vendor.watch(
      () => props.modelValue,
      (value) => {
        if (value === innerValue.value)
          return;
        updateValue(stringModelValue());
      }
    );
    common_vendor.onMounted(() => {
      updateValue(stringModelValue(), props.formatTrigger);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: hasSlot("left")
      }, hasSlot("left") ? {} : {}, {
        b: common_vendor.n(props.inputClass),
        c: common_vendor.s(inputStyles.value),
        d: innerValue.value,
        e: props.type,
        f: props.placeholder,
        g: props.placeholderStyle,
        h: props.placeholderClass,
        i: common_vendor.unref(formDisabled),
        j: props.readonly,
        k: props.autofocus,
        l: innerMaxLength.value,
        m: props.formatTrigger,
        n: props.autofocus ? true : void 0,
        o: props.confirmType,
        p: props.adjustPosition,
        q: props.alwaysSystem,
        r: props.inputMode,
        s: props.cursorSpacing,
        t: props.alwaysEmbed,
        v: props.confirmHold,
        w: props.cursor,
        x: props.selectionStart,
        y: props.selectionEnd,
        z: props.holdKeyboard,
        A: common_vendor.o(handleInput, "ee"),
        B: common_vendor.o(handleFocus, "6d"),
        C: common_vendor.o(handleBlur, "b3"),
        D: common_vendor.o(handleClickInput, "9c"),
        E: common_vendor.o(endComposing, "a5"),
        F: common_vendor.o(startComposing, "37"),
        G: common_vendor.o(endComposing, "14"),
        H: common_vendor.o(handleConfirm, "1a"),
        I: props.readonly
      }, props.readonly ? {
        J: common_vendor.o(handleClickInput, "c8")
      } : {}, {
        K: props.showWordLimit && innerMaxLength.value > 0
      }, props.showWordLimit && innerMaxLength.value > 0 ? {
        L: common_vendor.t(innerValue.value.length),
        M: common_vendor.t(innerMaxLength.value)
      } : {}, {
        N: props.clearable && !props.readonly
      }, props.clearable && !props.readonly ? common_vendor.e({
        O: hasSlot("clear")
      }, hasSlot("clear") ? {} : {
        P: common_vendor.p({
          name: "mask-close",
          ["custom-class"]: "nut-input__clear-icon",
          size: props.clearSize,
          width: props.clearSize,
          height: props.clearSize
        })
      }, {
        Q: !((active.value || props.showClearIcon) && innerValue.value.length > 0) ? 1 : "",
        R: common_vendor.o(handleClear, "1e")
      }) : {}, {
        S: hasSlot("right")
      }, hasSlot("right") ? {} : {}, {
        T: common_vendor.n(classes.value),
        U: common_vendor.s(props.customStyle),
        V: common_vendor.o(handleClick, "48")
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/input/input.js.map

"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutIcon();
}
const NutIcon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-checkbox`;
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
  props: common_vendor.checkboxProps,
  emits: common_vendor.checkboxEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = common_vendor.useSlots();
    const disabled = common_vendor.useFormDisabled(common_vendor.toRef(props, "disabled"));
    const { parent } = common_vendor.useInject(common_vendor.CHECKBOX_KEY);
    const state = common_vendor.reactive({
      partialSelect: props.indeterminate
    });
    function isCheckedValue(value) {
      return value === props.checkedValue;
    }
    const innerChecked = common_vendor.computed(() => {
      if (parent != null)
        return parent.value.value.includes(props.label);
      return isCheckedValue(props.modelValue);
    });
    const innerDisabled = common_vendor.computed(() => {
      if (parent != null && parent.disabled.value != null)
        return parent.disabled.value;
      return disabled.value;
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [`${componentName}--reverse`]: props.textPosition === "left"
      });
    });
    const iconClasses = common_vendor.computed(() => {
      return {
        [`${componentName}__icon`]: true,
        [`${componentName}__icon--disabled`]: innerDisabled.value,
        // TODO 2.x移除
        [`${componentName}__icon--disable`]: innerDisabled.value,
        [`${componentName}__icon--indeterminate`]: state.partialSelect,
        [`${componentName}__icon--unchecked`]: !innerChecked.value
      };
    });
    const labelClasses = common_vendor.computed(() => {
      return {
        [`${componentName}__label`]: true,
        [`${componentName}__label--disabled`]: innerDisabled.value
      };
    });
    const buttonClasses = common_vendor.computed(() => {
      return {
        [`${componentName}__button`]: true,
        [`${componentName}__button--active`]: innerChecked.value,
        [`${componentName}__button--disabled`]: innerDisabled.value
      };
    });
    let updateSource = "";
    function emitClickChange(checked, value) {
      updateSource = "click";
      emit(common_vendor.UPDATE_MODEL_EVENT, value);
      emit(common_vendor.CHANGE_EVENT, checked, value);
    }
    common_vendor.watch(() => props.modelValue, (value) => {
      if (updateSource === "click") {
        updateSource = "";
        return;
      }
      if (parent == null)
        emit(common_vendor.CHANGE_EVENT, isCheckedValue(value), value);
    });
    function handleClick() {
      if (innerDisabled.value)
        return;
      if (parent != null) {
        const values = parent.value.value;
        const max = parent.max.value;
        const index = values.indexOf(props.label);
        if (index >= 0) {
          values.splice(index, 1);
          emitClickChange(false, props.label);
        } else {
          if (max <= 0 || values.length < max) {
            values.push(props.label);
            emitClickChange(true, props.label);
          }
        }
        parent.updateValue(values);
      } else {
        if (innerChecked.value && !state.partialSelect)
          emitClickChange(false, props.uncheckedValue);
        else
          emitClickChange(true, props.checkedValue);
      }
      if (state.partialSelect)
        state.partialSelect = false;
    }
    common_vendor.watch(() => props.indeterminate, (value) => {
      state.partialSelect = value;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.shape === "button"
      }, props.shape === "button" ? {
        b: common_vendor.n(buttonClasses.value)
      } : common_vendor.e({
        c: state.partialSelect
      }, state.partialSelect ? common_vendor.e({
        d: common_vendor.unref(slots).indeterminate
      }, common_vendor.unref(slots).indeterminate ? {} : {
        e: common_vendor.p({
          ["custom-class"]: iconClasses.value,
          name: "check-disabled",
          size: common_vendor.unref(common_vendor.pxCheck)(props.iconSize),
          width: common_vendor.unref(common_vendor.pxCheck)(props.iconSize),
          height: common_vendor.unref(common_vendor.pxCheck)(props.iconSize)
        })
      }) : !innerChecked.value ? common_vendor.e({
        g: common_vendor.unref(slots).icon
      }, common_vendor.unref(slots).icon ? {} : {
        h: common_vendor.p({
          ["custom-class"]: iconClasses.value,
          name: "check-normal",
          size: common_vendor.unref(common_vendor.pxCheck)(props.iconSize),
          width: common_vendor.unref(common_vendor.pxCheck)(props.iconSize),
          height: common_vendor.unref(common_vendor.pxCheck)(props.iconSize)
        })
      }) : common_vendor.e({
        i: common_vendor.unref(slots).checkedIcon
      }, common_vendor.unref(slots).checkedIcon ? {} : {
        j: common_vendor.p({
          ["custom-class"]: iconClasses.value,
          name: "checked",
          size: common_vendor.unref(common_vendor.pxCheck)(props.iconSize),
          width: common_vendor.unref(common_vendor.pxCheck)(props.iconSize),
          height: common_vendor.unref(common_vendor.pxCheck)(props.iconSize)
        })
      }), {
        f: !innerChecked.value,
        k: common_vendor.n(labelClasses.value)
      }), {
        l: common_vendor.n(classes.value),
        m: common_vendor.s(props.customStyle),
        n: common_vendor.o(handleClick, "48")
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/checkbox/checkbox.js.map

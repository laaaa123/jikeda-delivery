"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-radio-group`;
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
  props: common_vendor.radiogroupProps,
  emits: common_vendor.radiogroupEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const updateValue = (value) => emit(common_vendor.UPDATE_MODEL_EVENT, value);
    common_vendor.useProvide(common_vendor.RADIO_KEY)({
      label: common_vendor.readonly(common_vendor.computed(() => props.modelValue)),
      position: common_vendor.readonly(common_vendor.computed(() => props.textPosition)),
      updateValue
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [`${componentName}--${props.direction}`]: true
      });
    });
    common_vendor.watch(
      () => props.modelValue,
      (value) => emit(common_vendor.CHANGE_EVENT, value)
    );
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(classes.value),
        b: common_vendor.s(_ctx.customStyle)
      };
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/radiogroup/radiogroup.js.map

"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-collapse`;
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
  props: common_vendor.collapseProps,
  emits: common_vendor.collapseEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const innerValue = common_vendor.ref(props.modelValue || (props.accordion ? "" : []));
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    common_vendor.watch(() => props.modelValue, (val) => {
      innerValue.value = val;
    });
    function changeVal(val, name, status = true) {
      innerValue.value = val;
      emit(common_vendor.UPDATE_MODEL_EVENT, val);
      emit(common_vendor.CHANGE_EVENT, val, name, status);
    }
    function updateVal(name) {
      if (props.accordion) {
        if (innerValue.value === name)
          changeVal("", name, false);
        else
          changeVal(name, name, true);
      } else {
        if (Array.isArray(innerValue.value)) {
          if (innerValue.value.includes(name)) {
            const newValue = innerValue.value.filter((v) => v !== name);
            changeVal(newValue, name, false);
          } else {
            const newValue = innerValue.value.concat([name]);
            changeVal(newValue, name, true);
          }
        } else {
          common_vendor.index.__f__("warn", "at node_modules/nutui-uniapp/components/collapse/collapse.vue:44", "[NutUI] <Collapse> 未开启手风琴模式时 v-model 应为数组");
        }
      }
    }
    function isExpanded(name) {
      if (props.accordion)
        return innerValue.value === name;
      else if (Array.isArray(innerValue.value))
        return innerValue.value.includes(name);
      return false;
    }
    common_vendor.provide("collapseParent", {
      updateVal,
      isExpanded
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(classes.value),
        b: common_vendor.s(_ctx.customStyle)
      };
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/collapse/collapse.js.map

"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutCell();
}
const NutCell = () => "../cell/cell.js";
const componentName = `${common_vendor.PREFIX}-form-item`;
const __default__ = common_vendor.defineComponent({
  name: componentName,
  inheritAttrs: false,
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
});
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.formitemProps,
  setup(__props) {
    var _a;
    const props = __props;
    const slots = common_vendor.useSlots();
    const Parent = common_vendor.useInject(common_vendor.FORM_KEY);
    const isRequired = common_vendor.computed(() => {
      var _a2, _b;
      if (props.required === false)
        return false;
      const rules = (_b = (_a2 = Parent.parent) == null ? void 0 : _a2.props) == null ? void 0 : _b.rules;
      let formRequired = false;
      for (const key in rules) {
        if (Object.prototype.hasOwnProperty.call(rules, key) && key === props.prop && Array.isArray(rules[key]))
          formRequired = rules[key].some((rule) => rule.required);
      }
      return props.required || props.rules.some((rule) => rule.required) || formRequired;
    });
    const labelPositionClass = common_vendor.computed(() => {
      var _a2;
      const labelPosition = (_a2 = Parent.parent) == null ? void 0 : _a2.props.labelPosition;
      const position = props.labelPosition ? props.labelPosition : labelPosition;
      return `nut-form-item__${position}`;
    });
    const starPositionClass = common_vendor.computed(() => {
      var _a2;
      const starPosition = (_a2 = Parent.parent) == null ? void 0 : _a2.props.starPosition;
      const position = props.starPosition ? props.starPosition : starPosition;
      return `nut-form-item__star-${position}`;
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    const labelStyle = common_vendor.computed(() => {
      return {
        width: common_vendor.pxCheck(props.labelWidth),
        textAlign: props.labelAlign
      };
    });
    const bodyStyle = common_vendor.computed(() => {
      return {
        textAlign: props.bodyAlign
      };
    });
    const formErrorTip = ((_a = Parent.parent) == null ? void 0 : _a.formErrorTip) || {};
    const errorMessageStyle = common_vendor.computed(() => {
      return {
        textAlign: props.errorMessageAlign
      };
    });
    const getSlots = (name) => slots[name];
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.label || getSlots("label")
      }, _ctx.label || getSlots("label") ? {
        b: common_vendor.t(_ctx.label),
        c: common_vendor.s(labelStyle.value),
        d: isRequired.value ? 1 : "",
        e: starPositionClass.value,
        f: starPositionClass.value ? 1 : ""
      } : {}, {
        g: common_vendor.s(bodyStyle.value),
        h: common_vendor.unref(formErrorTip)[_ctx.prop] && _ctx.showErrorMessage
      }, common_vendor.unref(formErrorTip)[_ctx.prop] && _ctx.showErrorMessage ? {
        i: common_vendor.t(common_vendor.unref(formErrorTip)[_ctx.prop]),
        j: common_vendor.s(errorMessageStyle.value)
      } : {}, {
        k: common_vendor.p({
          ["custom-class"]: [{
            error: common_vendor.unref(formErrorTip)[_ctx.prop],
            line: _ctx.showErrorLine
          }, classes.value, labelPositionClass.value],
          ["custom-style"]: _ctx.customStyle
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/formitem/formitem.js.map

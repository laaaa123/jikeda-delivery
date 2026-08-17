"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutCellGroup();
}
const NutCellGroup = () => "../cellgroup/cellgroup.js";
const componentName = `${common_vendor.PREFIX}-form`;
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
  props: common_vendor.formProps,
  emits: common_vendor.formEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    __expose({ reset, submit, validate });
    const formErrorTip = common_vendor.computed(() => common_vendor.reactive({}));
    const { internalChildren } = common_vendor.useProvide(
      common_vendor.FORM_KEY,
      "nut-form-item"
    )({ props, formErrorTip });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    function clearErrorTips() {
      Object.keys(formErrorTip.value).forEach((item) => {
        formErrorTip.value[item] = "";
      });
    }
    function reset() {
      clearErrorTips();
    }
    common_vendor.watch(
      () => props.modelValue,
      () => {
        clearErrorTips();
      },
      { immediate: true }
    );
    function findFormItem(vnodes) {
      let task = [];
      vnodes.forEach((vnode) => {
        var _a, _b, _c, _d;
        let type = vnode.type;
        type = type.name || type;
        if (type === "nut-form-item" || (type == null ? void 0 : type.toString().endsWith("form-item"))) {
          task.push({
            prop: (_a = vnode.props) == null ? void 0 : _a.prop,
            rules: ((_b = vnode.props) == null ? void 0 : _b.rules) || []
          });
        } else if (Array.isArray(vnode.children) && ((_c = vnode.children) == null ? void 0 : _c.length)) {
          task = task.concat(findFormItem(vnode.children));
        } else if (common_vendor.isObject(vnode.children) && Object.keys(vnode.children)) {
          if ((_d = vnode.children) == null ? void 0 : _d.default) {
            vnode.children = vnode.children.default();
            task = task.concat(findFormItem(vnode.children));
          }
        } else if (Array.isArray(vnode)) {
          task = task.concat(findFormItem(vnode));
        }
      });
      return task;
    }
    function tipMessage(errorMsg) {
      if (errorMsg.message)
        emit("validate", errorMsg);
      formErrorTip.value[errorMsg.prop] = errorMsg.message;
    }
    async function checkRule(item) {
      const { rules, prop } = item;
      const _Promise = (errorMsg) => {
        return new Promise((resolve, reject) => {
          try {
            tipMessage(errorMsg);
            resolve(errorMsg);
          } catch (error) {
            reject(error);
          }
        });
      };
      if (!prop)
        common_vendor.index.__f__("warn", "at node_modules/nutui-uniapp/components/form/form.vue:95", "[NutUI] <FormItem> 使用 rules 校验规则时 , 必须设置 prop 参数");
      const value = common_vendor.getPropByPath(props.modelValue, prop || "");
      tipMessage({ prop, message: "" });
      const formRules = props.rules || {};
      const _rules = [...(formRules == null ? void 0 : formRules[prop]) || [], ...rules];
      while (_rules.length) {
        const rule = _rules.shift();
        const { validator, ...ruleWithoutValidator } = rule;
        const { required, regex, message } = ruleWithoutValidator;
        const errorMsg = { prop, message };
        if (required) {
          if (Array.isArray(value)) {
            if (!value.length)
              return _Promise(errorMsg);
          } else if (!value && value !== 0) {
            return _Promise(errorMsg);
          }
        }
        if (regex && !regex.test(String(value)))
          return _Promise(errorMsg);
        if (validator) {
          const result = validator(value, ruleWithoutValidator);
          if (common_vendor.isPromise(result)) {
            try {
              const value2 = await result;
              if (value2 === false)
                return _Promise(errorMsg);
            } catch (error) {
              const validateErrorMsg = { prop, message: error };
              return _Promise(validateErrorMsg);
            }
          } else {
            if (!result)
              return _Promise(errorMsg);
          }
        }
      }
      return Promise.resolve(true);
    }
    function validate(customProp = "") {
      return new Promise((resolve, reject) => {
        try {
          const task = findFormItem(internalChildren == null ? void 0 : internalChildren.map((child) => child.vnode));
          const errors = task.map((item) => {
            if (customProp && customProp !== item.prop)
              return Promise.resolve(true);
            return checkRule(item);
          });
          Promise.all(errors).then((errorRes) => {
            errorRes = errorRes.filter((item) => item !== true);
            const res = { valid: true, errors: [] };
            if (errorRes.length) {
              res.valid = false;
              res.errors = errorRes;
            }
            resolve(res);
          });
        } catch (error) {
          reject(error);
        }
      });
    }
    function submit() {
      validate();
      return false;
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(classes.value),
        b: common_vendor.s(_ctx.customStyle),
        c: common_vendor.o(() => false, "cd")
      };
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/form/form.js.map

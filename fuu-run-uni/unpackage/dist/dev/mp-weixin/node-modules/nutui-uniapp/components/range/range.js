"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-range`;
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
  props: common_vendor.rangeProps,
  emits: common_vendor.rangeEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = common_vendor.useSlots();
    const instance = common_vendor.getCurrentInstance();
    const disabled = common_vendor.useFormDisabled(common_vendor.toRef(props, "disabled"));
    const touch = common_vendor.useTouch();
    const rangeId = common_vendor.computed(() => `root-${common_vendor.getRandomId()}`);
    const state = common_vendor.ref({
      width: 0,
      height: 0
    });
    const buttonIndex = common_vendor.ref(0);
    let startValue;
    let currentValue;
    const dragStatus = common_vendor.ref("");
    const innerMin = common_vendor.computed(() => Number(props.min));
    const innerMax = common_vendor.computed(() => Number(props.max));
    const innerStep = common_vendor.computed(() => Number(props.step));
    const innerMarks = common_vendor.computed(() => {
      return Object.keys(props.marks).map((it) => Number.parseFloat(it)).sort((a, b) => a - b).filter((point) => point >= innerMin.value && point <= innerMax.value);
    });
    const scope = common_vendor.computed(() => innerMax.value - innerMin.value);
    const classes = common_vendor.computed(() => {
      const classPrefix = componentName;
      return {
        [classPrefix]: true,
        [`${classPrefix}-disabled`]: disabled.value,
        [`${classPrefix}-vertical`]: props.vertical,
        [`${classPrefix}-show-number`]: !props.hiddenRange
      };
    });
    const containerClasses = common_vendor.computed(() => {
      const classPrefix = "nut-range-container";
      return {
        [classPrefix]: true,
        [`${classPrefix}-vertical`]: props.vertical
      };
    });
    const wrapperStyles = common_vendor.computed(() => {
      return {
        background: props.inactiveColor
      };
    });
    const buttonStyles = common_vendor.computed(() => {
      return {
        borderColor: props.buttonColor
      };
    });
    const isArrayValue = (value) => props.range && Array.isArray(value);
    function calcMainAxis() {
      const { modelValue } = props;
      if (isArrayValue(modelValue))
        return `${(modelValue[1] - modelValue[0]) * 100 / scope.value}%`;
      return `${(modelValue - innerMin.value) * 100 / scope.value}%`;
    }
    function calcOffset() {
      const { modelValue } = props;
      if (isArrayValue(modelValue))
        return `${(modelValue[0] - innerMin.value) * 100 / scope.value}%`;
      return "0%";
    }
    const barStyles = common_vendor.computed(() => {
      const style = {
        background: props.activeColor,
        transition: dragStatus.value ? "none" : void 0
      };
      if (props.vertical) {
        style.top = calcOffset();
        style.height = calcMainAxis();
      } else {
        style.left = calcOffset();
        style.width = calcMainAxis();
      }
      return style;
    });
    function getMarkClasses(mark) {
      const classPrefix = "nut-range-mark";
      const { modelValue } = props;
      let lowerBound;
      let upperBound;
      if (isArrayValue(modelValue)) {
        const [left, right] = modelValue;
        lowerBound = left;
        upperBound = right;
      } else {
        lowerBound = innerMin.value;
        upperBound = modelValue;
      }
      const isActive = mark <= upperBound && mark >= lowerBound;
      return {
        [`${classPrefix}-text`]: true,
        [`${classPrefix}-text-active`]: isActive
      };
    }
    function getMarkStyles(mark) {
      const style = {};
      if (props.vertical)
        style.top = `${(mark - innerMin.value) / scope.value * 100}%`;
      else
        style.left = `${(mark - innerMin.value) / scope.value * 100}%`;
      return style;
    }
    function getTickStyles(mark) {
      const style = {};
      const { modelValue } = props;
      let lowerBound;
      let upperBound;
      if (isArrayValue(modelValue)) {
        const [left, right] = modelValue;
        lowerBound = left;
        upperBound = right;
      } else {
        lowerBound = innerMin.value;
        upperBound = innerMax.value;
      }
      const isActive = mark <= upperBound && mark >= lowerBound;
      style.background = isActive ? props.activeColor : props.inactiveColor;
      return style;
    }
    function formatValue(value) {
      const trulyValue = Math.max(innerMin.value, Math.min(value, innerMax.value));
      return Math.round(trulyValue / innerStep.value) * innerStep.value;
    }
    function normalizeArrayValue(value) {
      if (value[0] > value[1])
        return value.slice(0).reverse();
      return value;
    }
    function formatArrayValue(value) {
      return normalizeArrayValue(value).map((it) => formatValue(it));
    }
    function updateValue(value, end) {
      if (isArrayValue(value))
        value = formatArrayValue(value);
      else
        value = formatValue(value);
      if (!common_vendor.isEqualValue(value, props.modelValue))
        emit(common_vendor.UPDATE_MODEL_EVENT, value);
      if (end && !common_vendor.isEqualValue(value, startValue))
        emit(common_vendor.CHANGE_EVENT, value);
    }
    async function onClick(event) {
      if (disabled.value)
        return;
      const { modelValue } = props;
      const rect = await common_vendor.useRect(rangeId.value, instance);
      state.value.width = rect.width;
      state.value.height = rect.height;
      const clientX = event.touches[0].clientX;
      const clientY = event.touches[0].clientY;
      let delta;
      let total;
      if (props.vertical) {
        delta = clientY - rect.top;
        total = rect.height;
      } else {
        delta = clientX - rect.left;
        total = rect.width;
      }
      const value = innerMin.value + delta / total * scope.value;
      if (isArrayValue(modelValue)) {
        const [left, right] = modelValue;
        const middle = (left + right) / 2;
        if (value <= middle)
          updateValue([value, right], true);
        else
          updateValue([left, value], true);
      } else {
        updateValue(value, true);
      }
    }
    function init() {
      common_vendor.useRect(rangeId.value, instance).then(
        (rect) => {
          state.value.width = rect.width;
          state.value.height = rect.height;
        },
        () => {
        }
      );
    }
    function onTouchStart(event) {
      if (disabled.value)
        return;
      touch.start(event);
      currentValue = props.modelValue;
      if (isArrayValue(currentValue))
        startValue = formatArrayValue(currentValue);
      else
        startValue = formatValue(currentValue);
      dragStatus.value = "start";
      common_vendor.preventDefault(event, true);
    }
    async function onTouchMove(event) {
      if (disabled.value)
        return;
      common_vendor.preventDefault(event, true);
      if (dragStatus.value === "start")
        emit("dragStart");
      touch.move(event);
      dragStatus.value = "dragging";
      let delta;
      let total;
      if (props.vertical) {
        delta = touch.deltaY.value;
        total = state.value.height;
      } else {
        delta = touch.deltaX.value;
        total = state.value.width;
      }
      const diff = delta / total * scope.value;
      if (isArrayValue(startValue))
        currentValue[buttonIndex.value] = startValue[buttonIndex.value] + diff;
      else
        currentValue = startValue + diff;
      updateValue(currentValue);
    }
    function onTouchEnd(event) {
      if (disabled.value)
        return;
      if (dragStatus.value === "dragging") {
        updateValue(currentValue, true);
        emit("dragEnd");
      }
      dragStatus.value = "";
      common_vendor.preventDefault(event, true);
    }
    function formatCurrentValue(idx) {
      if (Array.isArray(props.modelValue) && typeof idx === "number")
        return props.modelValue[idx];
      return Number(props.modelValue);
    }
    common_vendor.onMounted(() => {
      common_vendor.nextTick$1(() => {
        init();
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !props.hiddenRange
      }, !props.hiddenRange ? {
        b: common_vendor.t(innerMin.value)
      } : {}, {
        c: innerMarks.value.length > 0
      }, innerMarks.value.length > 0 ? {
        d: common_vendor.f(innerMarks.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: common_vendor.s(getTickStyles(item)),
            c: item,
            d: common_vendor.n(getMarkClasses(item)),
            e: common_vendor.s(getMarkStyles(item))
          };
        })
      } : {}, {
        e: props.range
      }, props.range ? {
        f: common_vendor.f([0, 1], (index, k0, i0) => {
          return common_vendor.e(common_vendor.unref(slots).button ? {} : common_vendor.e({
            a: !props.hiddenTag
          }, !props.hiddenTag ? {
            b: common_vendor.t(formatCurrentValue(index))
          } : {}, {
            c: common_vendor.s(buttonStyles.value)
          }), {
            d: index,
            e: common_vendor.n(index === 0 ? "nut-range-button-wrapper-left" : "nut-range-button-wrapper-right"),
            f: formatCurrentValue(index),
            g: common_vendor.o((e) => {
              buttonIndex.value = index;
              onTouchStart(e);
            }, index),
            h: common_vendor.o(onTouchMove, index),
            i: common_vendor.o(onTouchEnd, index),
            j: common_vendor.o(onTouchEnd, index),
            k: common_vendor.o((e) => e.stopPropagation(), index)
          });
        }),
        g: common_vendor.unref(slots).button,
        h: common_vendor.unref(disabled) ? -1 : 0,
        i: innerMin.value,
        j: innerMax.value
      } : common_vendor.e({
        k: common_vendor.unref(slots).button
      }, common_vendor.unref(slots).button ? {} : common_vendor.e({
        l: !props.hiddenTag
      }, !props.hiddenTag ? {
        m: common_vendor.t(formatCurrentValue())
      } : {}, {
        n: common_vendor.s(buttonStyles.value)
      }), {
        o: common_vendor.unref(disabled) ? -1 : 0,
        p: formatCurrentValue(),
        q: innerMin.value,
        r: innerMax.value,
        s: common_vendor.o(onTouchStart, "72"),
        t: common_vendor.o(onTouchMove, "bd"),
        v: common_vendor.o(onTouchEnd, "a8"),
        w: common_vendor.o(onTouchEnd, "4a"),
        x: common_vendor.o((e) => e.stopPropagation(), "41")
      }), {
        y: common_vendor.s(barStyles.value),
        z: rangeId.value,
        A: common_vendor.n(classes.value),
        B: common_vendor.s(wrapperStyles.value),
        C: common_vendor.o(onClick, "97"),
        D: !props.hiddenRange
      }, !props.hiddenRange ? {
        E: common_vendor.t(innerMax.value)
      } : {}, {
        F: common_vendor.n(containerClasses.value),
        G: common_vendor.n(props.customClass),
        H: common_vendor.s(props.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/range/range.js.map

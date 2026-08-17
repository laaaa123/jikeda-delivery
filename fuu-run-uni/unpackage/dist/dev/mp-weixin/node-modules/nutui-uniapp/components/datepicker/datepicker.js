"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutPicker();
}
const NutPicker = () => "../picker/picker.js";
const componentName = `${common_vendor.PREFIX}-date-picker`;
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
  props: common_vendor.datepickerProps,
  emits: common_vendor.datepickerEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const ZH_CN_LOCALES = {
      day: "日",
      year: "年",
      month: "月",
      hour: "时",
      minute: "分",
      seconds: "秒"
    };
    const state = common_vendor.reactive({
      currentDate: /* @__PURE__ */ new Date(),
      selectedValue: []
    });
    function normalizeDate(value) {
      if (value == null)
        return /* @__PURE__ */ new Date();
      if (common_vendor.isDate(value))
        return value;
      return new Date(value);
    }
    const innerMinDate = common_vendor.computed(() => {
      return normalizeDate(props.minDate);
    });
    const innerMaxDate = common_vendor.computed(() => {
      return normalizeDate(props.maxDate);
    });
    function formatValue(value) {
      return new Date(Math.min(Math.max(value.getTime(), innerMinDate.value.getTime()), innerMaxDate.value.getTime()));
    }
    function getMonthEndDay(year, month) {
      return 32 - new Date(year, month - 1, 32).getDate();
    }
    function getBoundary(type, value) {
      const boundary = type === "min" ? innerMinDate.value : innerMaxDate.value;
      const year = boundary.getFullYear();
      let month = 1;
      let date = 1;
      let hour = 0;
      let minute = 0;
      if (type === "max") {
        month = 12;
        date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
        hour = 23;
        minute = 59;
      }
      let seconds = minute;
      if (value.getFullYear() === year) {
        month = boundary.getMonth() + 1;
        if (value.getMonth() + 1 === month) {
          date = boundary.getDate();
          if (value.getDate() === date) {
            hour = boundary.getHours();
            if (value.getHours() === hour) {
              minute = boundary.getMinutes();
              if (value.getMinutes() === minute)
                seconds = boundary.getSeconds();
            }
          }
        }
      }
      return {
        [`${type}Year`]: year,
        [`${type}Month`]: month,
        [`${type}Date`]: date,
        [`${type}Hour`]: hour,
        [`${type}Minute`]: minute,
        [`${type}Seconds`]: seconds
      };
    }
    const ranges = common_vendor.computed(() => {
      const { minYear, minDate, minMonth, minHour, minMinute, minSeconds } = getBoundary("min", state.currentDate);
      const { maxYear, maxDate, maxMonth, maxHour, maxMinute, maxSeconds } = getBoundary("max", state.currentDate);
      return generateList([
        {
          type: "year",
          range: [minYear, maxYear]
        },
        {
          type: "month",
          range: [minMonth, maxMonth]
        },
        {
          type: "day",
          range: [minDate, maxDate]
        },
        {
          type: "hour",
          range: [minHour, maxHour]
        },
        {
          type: "minute",
          range: [minMinute, maxMinute]
        },
        {
          type: "seconds",
          range: [minSeconds, maxSeconds]
        }
      ]);
    });
    const columns = common_vendor.computed(() => {
      return ranges.value.map((item, columnIndex) => {
        return generateValue(item.range[0], item.range[1], getDateIndex(item.type), item.type, columnIndex);
      });
    });
    function handleChange({
      columnIndex,
      selectedValue,
      selectedOptions
    }) {
      const formatDate = [...selectedValue];
      if (props.type === "month-day" && formatDate.length < 3)
        formatDate.unshift(new Date(state.currentDate || innerMinDate.value || innerMaxDate.value).getFullYear());
      if (props.type === "year-month" && formatDate.length < 3)
        formatDate.push(new Date(state.currentDate || innerMinDate.value || innerMaxDate.value).getDate());
      const year = Number(formatDate[0]);
      const month = Number(formatDate[1]) - 1;
      const day = Math.min(Number(formatDate[2]), getMonthEndDay(Number(formatDate[0]), Number(formatDate[1])));
      let date = null;
      if (props.type === "date" || props.type === "month-day" || props.type === "year-month") {
        date = new Date(year, month, day);
      } else if (props.type === "datetime") {
        date = new Date(year, month, day, Number(formatDate[3]), Number(formatDate[4]));
      } else if (props.type === "datehour") {
        date = new Date(year, month, day, Number(formatDate[3]));
      } else if (props.type === "hour-minute" || props.type === "time") {
        date = new Date(state.currentDate);
        const year2 = date.getFullYear();
        const month2 = date.getMonth();
        const day2 = date.getDate();
        date = new Date(year2, month2, day2, Number(formatDate[0]), Number(formatDate[1]), Number(formatDate[2] || 0));
      }
      state.currentDate = formatValue(date);
      emit("change", { date, columnIndex, selectedValue, selectedOptions });
    }
    function formatterOption(type, value) {
      const { formatter, isShowChinese } = props;
      const text = common_vendor.padZero(value, 2);
      let option;
      if (formatter)
        option = formatter(type, { text, value: text });
      else
        option = { text: `${text}${isShowChinese ? ZH_CN_LOCALES[type] : ""}`, value: text };
      return option;
    }
    function generateValue(min, max, value, type, columnIndex) {
      var _a;
      const options = [];
      let index = 0;
      while (min <= max) {
        options.push(formatterOption(type, min));
        if (type === "minute")
          min += props.minuteStep;
        else
          min += 1;
        if (min <= Number(value))
          index += 1;
      }
      state.selectedValue[columnIndex] = (_a = options[index]) == null ? void 0 : _a.value;
      return props.filter ? props.filter(type, options) : options;
    }
    function getDateIndex(type) {
      if (type === "year")
        return state.currentDate.getFullYear();
      if (type === "month")
        return state.currentDate.getMonth() + 1;
      if (type === "day")
        return state.currentDate.getDate();
      if (type === "hour")
        return state.currentDate.getHours();
      if (type === "minute")
        return state.currentDate.getMinutes();
      if (type === "seconds")
        return state.currentDate.getSeconds();
      return 0;
    }
    function convertEvent({ selectedValue, selectedOptions }) {
      let date = null;
      switch (props.type) {
        case "date":
        case "datehour":
        case "datetime":
        case "year-month": {
          const [
            year = 0,
            month = 0,
            day = 0,
            hour = 0,
            minute = 0,
            seconds = 0
          ] = selectedValue;
          date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(seconds));
          break;
        }
        case "time":
        case "hour-minute": {
          const [
            hour = 0,
            minute = 0,
            seconds = 0
          ] = selectedValue;
          date = new Date(0, 0, 0, Number(hour), Number(minute), Number(seconds));
          break;
        }
        case "month-day": {
          const [
            month = 0,
            day = 0
          ] = selectedValue;
          date = new Date(0, Number(month) - 1, Number(day));
          break;
        }
      }
      if (date == null)
        date = /* @__PURE__ */ new Date();
      return {
        date,
        selectedValue,
        selectedOptions
      };
    }
    function handleCancel(event) {
      emit(common_vendor.CANCEL_EVENT, convertEvent(event));
    }
    function handleConfirm(event) {
      emit(common_vendor.CONFIRM_EVENT, convertEvent(event));
    }
    function generateList(list) {
      switch (props.type) {
        case "date":
          return list.slice(0, 3);
        case "datetime":
          return list.slice(0, 5);
        case "time":
          return list.slice(3, 6);
        case "year-month":
          return list.slice(0, 2);
        case "month-day":
          return list.slice(1, 3);
        case "datehour":
          return list.slice(0, 4);
        case "hour-minute":
          return list.slice(3, 5);
      }
      return list;
    }
    function getSelectedValue(time) {
      return generateList([
        time.getFullYear(),
        time.getMonth() + 1,
        time.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      ].map((it) => String(it)));
    }
    common_vendor.onBeforeMount(() => {
      state.currentDate = formatValue(normalizeDate(props.modelValue));
    });
    common_vendor.watch(
      () => props.modelValue,
      (value) => {
        const newValue = formatValue(normalizeDate(value));
        if (!common_vendor.isEqualValue(newValue, state.currentDate)) {
          state.currentDate = newValue;
          state.selectedValue = getSelectedValue(newValue);
        }
      }
    );
    common_vendor.watch(
      () => state.currentDate,
      (value) => {
        if (!common_vendor.isEqualValue(value, normalizeDate(props.modelValue))) {
          emit(common_vendor.UPDATE_MODEL_EVENT, value);
          common_vendor.nextTick$1(() => {
            state.selectedValue = getSelectedValue(value);
          });
        }
      }
    );
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleChange, "7a"),
        b: common_vendor.o(handleConfirm, "62"),
        c: common_vendor.o(handleCancel, "a3"),
        d: common_vendor.o(($event) => state.selectedValue = $event, "e8"),
        e: common_vendor.p({
          ["show-toolbar"]: props.showToolbar,
          title: props.title,
          ["ok-text"]: props.okText,
          ["cancel-text"]: props.cancelText,
          columns: columns.value,
          ["three-dimensional"]: props.threeDimensional,
          ["swipe-duration"]: props.swipeDuration,
          ["visible-option-num"]: props.visibleOptionNum,
          ["option-height"]: props.optionHeight,
          modelValue: state.selectedValue
        })
      };
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/datepicker/datepicker.js.map

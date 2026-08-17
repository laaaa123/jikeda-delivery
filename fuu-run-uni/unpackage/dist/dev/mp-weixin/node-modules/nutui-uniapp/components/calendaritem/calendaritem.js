"use strict";
const common_vendor = require("../../../../common/vendor.js");
const __default__ = common_vendor.defineComponent({
  name: `${common_vendor.PREFIX}-calendar-item`,
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
});
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.calendaritemProps,
  emits: common_vendor.calendaritemEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    common_vendor.useSlots();
    const componentName = `${common_vendor.PREFIX}-calendar-item`;
    const { translate } = common_vendor.useTranslate(componentName);
    const state = common_vendor.reactive({
      yearMonthTitle: "",
      defaultRange: [],
      containerHeight: "100%",
      currDate: "",
      propStartDate: "",
      propEndDate: "",
      unLoadPrev: false,
      touchParams: {
        startY: 0,
        endY: 0,
        startTime: 0,
        endTime: 0,
        lastY: 0,
        lastTime: 0
      },
      transformY: 0,
      translateY: 0,
      scrollDistance: 0,
      defaultData: [],
      chooseData: [],
      monthsData: [],
      dayPrefix: "nut-calendar__day",
      startData: "",
      endData: "",
      isRange: props.type === "range",
      timer: 0,
      currentIndex: 0,
      avgHeight: 0,
      scrollTop: 0,
      monthsNum: 0
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        "nut-calendar--nopop": !props.poppable,
        "nut-calendar--nofooter": props.isAutoBackFill
      });
    });
    const weekdays = translate("weekdays").map((day, index) => ({
      day,
      weekend: index === 0 || index === 6
    }));
    const weeks = common_vendor.ref([...weekdays.slice(props.firstDayOfWeek, 7), ...weekdays.slice(0, props.firstDayOfWeek)]);
    const months = common_vendor.ref(null);
    const scalePx = common_vendor.ref(2);
    const viewHeight = common_vendor.ref(0);
    const compConthsData = common_vendor.computed(() => {
      return state.monthsData.slice(state.defaultRange[0], state.defaultRange[1]);
    });
    const scrollWithAnimation = common_vendor.ref(false);
    function splitDate(date) {
      return date.split("-");
    }
    function isStart(currDate) {
      return common_vendor.isEqual(state.currDate[0], currDate);
    }
    function isEnd(currDate) {
      return common_vendor.isEqual(state.currDate[1], currDate);
    }
    function isMultiple(currDate) {
      var _a, _b;
      if (((_a = state.currDate) == null ? void 0 : _a.length) > 0) {
        return (_b = state.currDate) == null ? void 0 : _b.some((item) => {
          return common_vendor.isEqual(item, currDate);
        });
      } else {
        return false;
      }
    }
    function getCurrDate(day, month) {
      return `${month.curData[0]}-${month.curData[1]}-${common_vendor.getNumTwoBit(+day.day)}`;
    }
    function getClass(day, month, index) {
      const res = [];
      if (typeof index === "number" && ((index + 1 + props.firstDayOfWeek) % 7 === 0 || (index + props.firstDayOfWeek) % 7 === 0)) {
        res.push("weekend");
      }
      const currDate = getCurrDate(day, month);
      const { type } = props;
      if (day.type === "curr") {
        if (common_vendor.isEqual(state.currDate, currDate) || (type === "range" || type === "week") && (isStart(currDate) || isEnd(currDate)) || type === "multiple" && isMultiple(currDate)) {
          res.push(`${state.dayPrefix}--active`);
        } else if (state.propStartDate && common_vendor.compareDate(currDate, state.propStartDate) || state.propEndDate && common_vendor.compareDate(state.propEndDate, currDate) || props.disabledDate && props.disabledDate(currDate)) {
          res.push(`${state.dayPrefix}--disabled`);
        } else if ((type === "range" || type === "week") && Array.isArray(state.currDate) && Object.values(state.currDate).length === 2 && common_vendor.compareDate(state.currDate[0], currDate) && common_vendor.compareDate(currDate, state.currDate[1])) {
          res.push(`${state.dayPrefix}--choose`);
        }
      } else {
        res.push(`${state.dayPrefix}--disabled`);
      }
      return res;
    }
    function confirm() {
      const { type } = props;
      if (type === "range" && state.chooseData.length === 2 || type !== "range") {
        let selectData = state.chooseData.slice(0);
        if (type === "week") {
          selectData = {
            weekDate: [handleWeekDate(state.chooseData[0]), handleWeekDate(state.chooseData[1])]
          };
        }
        emit(common_vendor.CHOOSE_EVENT, selectData);
        if (props.poppable)
          emit("update");
      }
    }
    function chooseDay(day, month, isFirst = false) {
      var _a, _b;
      if (!getClass(day, month).includes(`${state.dayPrefix}--disabled`)) {
        const { type } = props;
        const [y, m] = month.curData;
        const days = [...month.curData];
        days[2] = common_vendor.getNumTwoBit(Number(day.day));
        days[3] = `${days[0]}-${days[1]}-${days[2]}`;
        days[4] = common_vendor.getWhatDay(+days[0], +days[1], +days[2]);
        if (type === "multiple") {
          if (((_a = state.currDate) == null ? void 0 : _a.length) > 0) {
            let hasIndex;
            (_b = state.currDate) == null ? void 0 : _b.forEach((item, index) => {
              if (item === days[3])
                hasIndex = index;
            });
            if (isFirst) {
              state.chooseData.push([...days]);
            } else {
              if (hasIndex !== void 0) {
                state.currDate.splice(hasIndex, 1);
                state.chooseData.splice(hasIndex, 1);
              } else {
                state.currDate.push(days[3]);
                state.chooseData.push([...days]);
              }
            }
          } else {
            state.currDate = [days[3]];
            state.chooseData = [[...days]];
          }
        } else if (type === "range") {
          const curDataLength = Object.values(state.currDate).length;
          if (curDataLength === 2 || curDataLength === 0) {
            state.currDate = [days[3]];
          } else {
            if (common_vendor.compareDate(state.currDate[0], days[3]))
              Array.isArray(state.currDate) && state.currDate.push(days[3]);
            else
              Array.isArray(state.currDate) && state.currDate.unshift(days[3]);
          }
          if (state.chooseData.length === 2 || !state.chooseData.length) {
            state.chooseData = [[...days]];
          } else {
            if (common_vendor.compareDate(state.chooseData[0][3], days[3]))
              state.chooseData = [...state.chooseData, [...days]];
            else
              state.chooseData = [[...days], ...state.chooseData];
          }
        } else if (type === "week") {
          const weekArr = common_vendor.getWeekDate(y, m, day.day, props.firstDayOfWeek);
          if (state.propStartDate && common_vendor.compareDate(weekArr[0], state.propStartDate))
            weekArr.splice(0, 1, state.propStartDate);
          if (state.propEndDate && common_vendor.compareDate(state.propEndDate, weekArr[1]))
            weekArr.splice(1, 1, state.propEndDate);
          state.currDate = weekArr;
          state.chooseData = [common_vendor.formatResultDate(weekArr[0]), common_vendor.formatResultDate(weekArr[1])];
        } else {
          state.currDate = days[3];
          state.chooseData = [...days];
        }
        if (!isFirst) {
          let selectData = state.chooseData;
          if (type === "week") {
            selectData = {
              weekDate: [
                handleWeekDate(state.chooseData[0]),
                handleWeekDate(state.chooseData[1])
              ]
            };
          }
          emit(common_vendor.SELECT_EVENT, selectData);
          if (props.isAutoBackFill || !props.poppable)
            confirm();
        }
      }
    }
    function handleWeekDate(weekDate) {
      const [y, m, d] = weekDate;
      return {
        date: weekDate,
        monthWeekNum: common_vendor.getMonthWeek(y, m, d, props.firstDayOfWeek),
        yearWeekNum: common_vendor.getYearWeek(y, m, d)
      };
    }
    function getCurrData(type) {
      const monthData = type === "prev" ? state.monthsData[0] : state.monthsData[state.monthsData.length - 1];
      let year = Number.parseInt(monthData.curData[0]);
      let month = Number.parseInt(monthData.curData[1].toString().replace(/^0/, ""));
      switch (type) {
        case "prev":
          month === 1 && (year -= 1);
          month = month === 1 ? 12 : --month;
          break;
        case "next":
          month === 12 && (year += 1);
          month = month === 12 ? 1 : ++month;
          break;
      }
      return [`${year}`, common_vendor.getNumTwoBit(month), `${common_vendor.getMonthDays(String(year), String(month))}`];
    }
    function getDaysStatus(days, type, dateInfo) {
      const { year, month } = dateInfo;
      if (type === "prev" && days >= 7)
        days -= 7;
      return Array.from(Array.from({ length: days }), (v, k) => {
        return {
          day: String(k + 1),
          type,
          year,
          month
        };
      });
    }
    function getPreDaysStatus(days, type, dateInfo, preCurrMonthDays) {
      days = days - props.firstDayOfWeek;
      const { year, month } = dateInfo;
      if (type === "prev" && days >= 7)
        days -= 7;
      const months2 = Array.from(Array.from({ length: preCurrMonthDays }), (v, k) => {
        return {
          day: String(k + 1),
          type,
          year,
          month
        };
      });
      return months2.slice(preCurrMonthDays - days);
    }
    function getMonth(curData, type) {
      const preMonthDays = common_vendor.getMonthPreDay(+curData[0], +curData[1]);
      let preMonth = Number(curData[1]) - 1;
      let preYear = Number(curData[0]);
      if (preMonth <= 0) {
        preMonth = 12;
        preYear += 1;
      }
      const currMonthDays = common_vendor.getMonthDays(String(curData[0]), String(curData[1]));
      const preCurrMonthDays = common_vendor.getMonthDays(`${preYear}`, `${preMonth}`);
      const title = {
        year: curData[0],
        month: curData[1]
      };
      const monthInfo = {
        curData,
        title: translate("monthTitle", title.year, title.month),
        monthData: [
          ...getPreDaysStatus(
            preMonthDays,
            "prev",
            { month: String(preMonth), year: String(preYear) },
            preCurrMonthDays
          ),
          ...getDaysStatus(currMonthDays, "curr", title)
        ],
        cssHeight: 0,
        cssScrollHeight: 0
      };
      let titleHeight, itemHeight;
      if (common_vendor.isH5) {
        titleHeight = 46 * scalePx.value + 16 * scalePx.value * 2;
        itemHeight = 128 * scalePx.value;
      } else {
        titleHeight = Math.floor(46 * scalePx.value) + Math.floor(16 * scalePx.value) * 2;
        itemHeight = Math.floor(128 * scalePx.value);
      }
      monthInfo.cssHeight = titleHeight + (monthInfo.monthData.length > 35 ? itemHeight * 6 : itemHeight * 5);
      let cssScrollHeight = 0;
      if (state.monthsData.length > 0) {
        cssScrollHeight = state.monthsData[state.monthsData.length - 1].cssScrollHeight + state.monthsData[state.monthsData.length - 1].cssHeight;
      }
      monthInfo.cssScrollHeight = cssScrollHeight;
      if (type === "next") {
        if (!state.endData || !common_vendor.compareDate(
          `${state.endData[0]}-${state.endData[1]}-${common_vendor.getMonthDays(state.endData[0], state.endData[1])}`,
          `${curData[0]}-${curData[1]}-${curData[2]}`
        )) {
          state.monthsData.push(monthInfo);
        }
      } else {
        if (!state.startData || !common_vendor.compareDate(
          `${curData[0]}-${curData[1]}-${curData[2]}`,
          `${state.startData[0]}-${state.startData[1]}-01`
        )) {
          state.monthsData.unshift(monthInfo);
        } else {
          state.unLoadPrev = true;
        }
      }
    }
    function initData() {
      const propStartDate = props.startDate ? props.startDate : common_vendor.getDay(0);
      const propEndDate = props.endDate ? props.endDate : common_vendor.getDay(365);
      state.propStartDate = propStartDate;
      state.propEndDate = propEndDate;
      state.startData = splitDate(propStartDate);
      state.endData = splitDate(propEndDate);
      if (props.defaultValue || Array.isArray(props.defaultValue) && props.defaultValue.length > 0) {
        state.currDate = props.type !== "one" ? [...props.defaultValue] : props.defaultValue;
      }
      const startDate = {
        year: Number(state.startData[0]),
        month: Number(state.startData[1])
      };
      const endDate = {
        year: Number(state.endData[0]),
        month: Number(state.endData[1])
      };
      let monthsNum = endDate.month - startDate.month;
      if (endDate.year - startDate.year > 0)
        monthsNum = monthsNum + 12 * (endDate.year - startDate.year);
      if (monthsNum <= 0)
        monthsNum = 1;
      getMonth(state.startData, "next");
      let i = 1;
      do
        getMonth(getCurrData("next"), "next");
      while (i++ < monthsNum);
      state.monthsNum = monthsNum;
      if (props.type === "range" && Array.isArray(state.currDate)) {
        if (state.currDate.length > 0) {
          if (propStartDate && common_vendor.compareDate(state.currDate[0], propStartDate))
            state.currDate.splice(0, 1, propStartDate);
          if (propEndDate && common_vendor.compareDate(propEndDate, state.currDate[1]))
            state.currDate.splice(1, 1, propEndDate);
          state.defaultData = [...splitDate(state.currDate[0]), ...splitDate(state.currDate[1])];
        }
      } else if (props.type === "multiple" && Array.isArray(state.currDate)) {
        if (state.currDate.length > 0) {
          const defaultArr = [];
          const obj = {};
          state.currDate.forEach((item) => {
            if (propStartDate && !common_vendor.compareDate(item, propStartDate) && propEndDate && !common_vendor.compareDate(propEndDate, item)) {
              if (!Object.hasOwnProperty.call(obj, item)) {
                defaultArr.push(item);
                obj[item] = item;
              }
            }
          });
          state.currDate = [...defaultArr];
          state.defaultData = [...splitDate(defaultArr[0])];
        }
      } else if (props.type === "week" && Array.isArray(state.currDate)) {
        if (state.currDate.length > 0) {
          const [y, m, d] = splitDate(state.currDate[0]);
          state.currDate = common_vendor.getWeekDate(y, m, d, props.firstDayOfWeek);
          if (propStartDate && common_vendor.compareDate(state.currDate[0], propStartDate))
            state.currDate.splice(0, 1, propStartDate);
          if (propEndDate && common_vendor.compareDate(propEndDate, state.currDate[1]))
            state.currDate.splice(1, 1, propEndDate);
          state.defaultData = [...splitDate(state.currDate[0]), ...splitDate(state.currDate[1])];
        }
      } else {
        if (state.currDate) {
          if (propStartDate && common_vendor.compareDate(state.currDate, propStartDate))
            state.currDate = propStartDate;
          else if (propEndDate && !common_vendor.compareDate(state.currDate, propEndDate))
            state.currDate = propEndDate;
          state.defaultData = [...splitDate(state.currDate)];
        }
      }
      let current = 0;
      let lastCurrent = 0;
      if (state.defaultData.length > 0) {
        state.monthsData.forEach((item, index) => {
          if (item.title === translate("monthTitle", state.defaultData[0], state.defaultData[1]))
            current = index;
          if (props.type === "range" || props.type === "week") {
            if (item.title === translate("monthTitle", state.defaultData[3], state.defaultData[4]))
              lastCurrent = index;
          }
        });
      }
      setDefaultRange(monthsNum, current);
      state.currentIndex = current;
      state.yearMonthTitle = state.monthsData[state.currentIndex].title;
      if (state.defaultData.length > 0) {
        if (state.isRange) {
          chooseDay({ day: state.defaultData[2], type: "curr" }, state.monthsData[state.currentIndex], true);
          chooseDay({ day: state.defaultData[5], type: "curr" }, state.monthsData[lastCurrent], true);
        } else if (props.type === "week") {
          chooseDay({ day: state.defaultData[2], type: "curr" }, state.monthsData[state.currentIndex], true);
        } else if (props.type === "multiple") {
          [...state.currDate].forEach((item) => {
            const dateArr = splitDate(item);
            let current2 = state.currentIndex;
            state.monthsData.forEach((item2, index) => {
              if (item2.title === translate("monthTitle", dateArr[0], dateArr[1]))
                current2 = index;
            });
            chooseDay({ day: dateArr[2], type: "curr" }, state.monthsData[current2], true);
          });
        } else {
          chooseDay({ day: state.defaultData[2], type: "curr" }, state.monthsData[state.currentIndex], true);
        }
      }
      const lastItem = state.monthsData[state.monthsData.length - 1];
      const containerHeight = lastItem.cssHeight + lastItem.cssScrollHeight;
      state.containerHeight = `${containerHeight}px`;
      state.scrollTop = Math.ceil(state.monthsData[state.currentIndex].cssScrollHeight);
      state.avgHeight = Math.floor(containerHeight / (monthsNum + 1));
      if (months == null ? void 0 : months.value)
        viewHeight.value = months.value.clientHeight;
    }
    function scrollToDate(date) {
      if (common_vendor.compareDate(date, state.propStartDate))
        date = state.propStartDate;
      else if (!common_vendor.compareDate(date, state.propEndDate))
        date = state.propEndDate;
      const dateArr = splitDate(date);
      state.monthsData.forEach((item, index) => {
        if (item.title === translate("monthTitle", dateArr[0], dateArr[1])) {
          state.scrollTop += 1;
          scrollWithAnimation.value = props.toDateAnimation;
          common_vendor.requestAniFrame(() => {
            setTimeout(() => {
              state.scrollTop = state.monthsData[index].cssScrollHeight;
              setTimeout(() => {
                scrollWithAnimation.value = false;
              }, 200);
            }, 10);
          });
        }
      });
    }
    function initPosition() {
      state.scrollTop = Math.ceil(state.monthsData[state.currentIndex].cssScrollHeight);
    }
    function setDefaultRange(monthsNum, current) {
      if (monthsNum >= 3) {
        if (current > 0 && current < monthsNum)
          state.defaultRange = [current - 1, current + 3];
        else if (current === 0)
          state.defaultRange = [current, current + 4];
        else if (current === monthsNum)
          state.defaultRange = [current - 2, current + 2];
      } else {
        state.defaultRange = [0, monthsNum + 2];
      }
      state.translateY = state.monthsData[state.defaultRange[0]].cssScrollHeight;
    }
    function isActive(day, month) {
      return (props.type === "range" || props.type === "week") && day.type === "curr" && getClass(day, month).includes("nut-calendar__day--active");
    }
    function isStartTip(day, month) {
      return isActive(day, month) && isStart(getCurrDate(day, month));
    }
    function isEndTip(day, month) {
      if (state.currDate.length >= 2 && isEnd(getCurrDate(day, month)))
        return isActive(day, month);
      return false;
    }
    function rangeTip() {
      if (state.currDate.length >= 2)
        return common_vendor.isEqual(state.currDate[0], state.currDate[1]);
    }
    function isCurrDay(dateInfo) {
      const date = `${dateInfo.year}-${dateInfo.month}-${Number(dateInfo.day) < 10 ? `0${dateInfo.day}` : dateInfo.day}`;
      return common_vendor.isEqual(date, common_vendor.date2Str(/* @__PURE__ */ new Date()));
    }
    function mothsViewScroll(e) {
      if (state.monthsData.length <= 1)
        return;
      const currentScrollTop = e.detail.scrollTop;
      let current = Math.floor(currentScrollTop / state.avgHeight);
      if (current === 0) {
        if (currentScrollTop >= state.monthsData[current + 1].cssScrollHeight)
          current += 1;
      } else if (current > 0 && current < state.monthsNum - 1) {
        if (currentScrollTop >= state.monthsData[current + 1].cssScrollHeight)
          current += 1;
        if (currentScrollTop < state.monthsData[current].cssScrollHeight)
          current -= 1;
      }
      if (state.currentIndex !== current) {
        state.currentIndex = current;
        setDefaultRange(state.monthsNum, current);
      }
      state.yearMonthTitle = state.monthsData[current].title;
    }
    function resetRender() {
      state.chooseData.splice(0);
      state.monthsData.splice(0);
      initData();
    }
    common_vendor.watch(() => props.defaultValue, (value) => {
      if (value) {
        if (props.poppable) {
          resetRender();
        }
      }
    });
    common_vendor.onMounted(() => {
      common_vendor.index.getSystemInfo({
        success(res) {
          let scale = 2;
          let toFixed = 3;
          if (common_vendor.isH5) {
            toFixed = 5;
            const fontSize = document.documentElement.style.fontSize;
            scale = Number((Number.parseInt(fontSize) / 40).toFixed(toFixed));
          } else {
            const screenWidth = res.screenWidth;
            scale = Number((screenWidth / 750).toFixed(toFixed));
          }
          scalePx.value = scale;
          initData();
        }
      });
    });
    __expose({
      scrollToDate,
      initPosition
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.showTitle
      }, props.showTitle ? {
        b: common_vendor.t(props.title || common_vendor.unref(translate)("title"))
      } : {}, {
        c: props.btnSlot
      }, props.btnSlot ? {} : {}, {
        d: props.showSubTitle
      }, props.showSubTitle ? {
        e: common_vendor.t(state.yearMonthTitle)
      } : {}, {
        f: common_vendor.f(weeks.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.day),
            b: index,
            c: item.weekend ? 1 : ""
          };
        }),
        g: common_vendor.f(compConthsData.value, (month, index, i0) => {
          return {
            a: common_vendor.t(month.title),
            b: common_vendor.f(month.monthData, (day, i, i1) => {
              return common_vendor.e({
                a: common_vendor.t(day.type === "curr" ? day.day : ""),
                b: props.showToday && isCurrDay(day)
              }, props.showToday && isCurrDay(day) ? {
                c: common_vendor.t(common_vendor.unref(translate)("today"))
              } : {}, {
                d: isStartTip(day, month)
              }, isStartTip(day, month) ? {
                e: common_vendor.t(props.startText || common_vendor.unref(translate)("start")),
                f: rangeTip() ? 1 : ""
              } : {}, {
                g: isEndTip(day, month)
              }, isEndTip(day, month) ? {
                h: common_vendor.t(props.endText || common_vendor.unref(translate)("end"))
              } : {}, {
                i: common_vendor.n(getClass(day, month, i)),
                j: common_vendor.o(($event) => chooseDay(day, month), i),
                k: i
              });
            }),
            c: index
          };
        }),
        h: props.type === "range" ? 1 : "",
        i: `translateY(${state.translateY}px)`,
        j: state.containerHeight,
        k: state.scrollTop,
        l: scrollWithAnimation.value,
        m: common_vendor.o(mothsViewScroll, "a5"),
        n: props.poppable && !props.isAutoBackFill
      }, props.poppable && !props.isAutoBackFill ? common_vendor.e({
        o: props.footerSlot
      }, props.footerSlot ? {
        p: common_vendor.r("footer", {
          date: state.chooseData
        })
      } : {
        q: common_vendor.t(props.confirmText || common_vendor.unref(translate)("confirm")),
        r: common_vendor.o(confirm, "70")
      }) : {}, {
        s: common_vendor.n(classes.value),
        t: common_vendor.s(props.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/calendaritem/calendaritem.js.map

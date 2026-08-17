"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  (NutCalendarItem + NutPopup)();
}
const NutCalendarItem = () => "../calendaritem/calendaritem.js";
const NutPopup = () => "../popup/popup.js";
const componentName = `${common_vendor.PREFIX}-calendar`;
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
  props: common_vendor.calendarProps,
  emits: common_vendor.calendarEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = common_vendor.useSlots();
    const innerVisible = common_vendor.computed({
      get() {
        return props.visible;
      },
      set(value) {
        emit("update:visible", value);
      }
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    const popClasses = common_vendor.computed(() => {
      return `${componentName}__popup ${props.popClass}`;
    });
    const popStyles = common_vendor.computed(() => {
      return [{
        height: "85vh"
      }, props.popStyle];
    });
    const overlayClasses = common_vendor.computed(() => {
      return `${componentName}__overlay ${props.overlayClass}`;
    });
    const calendarRef = common_vendor.ref(null);
    function scrollToDate(date) {
      var _a;
      (_a = calendarRef.value) == null ? void 0 : _a.scrollToDate(date);
    }
    function initPosition() {
      var _a;
      (_a = calendarRef.value) == null ? void 0 : _a.initPosition();
    }
    function close() {
      emit(common_vendor.UPDATE_VISIBLE_EVENT, false);
      emit(common_vendor.CLOSE_EVENT);
    }
    function choose(param) {
      close();
      emit(common_vendor.CHOOSE_EVENT, param);
    }
    function select(param) {
      emit(common_vendor.SELECT_EVENT, param);
    }
    function update() {
      emit(common_vendor.UPDATE_VISIBLE_EVENT, false);
    }
    function handleCloseIconClick() {
      emit("clickCloseIcon");
    }
    function handleOverlayClick() {
      emit("clickOverlay");
    }
    function handleOpen() {
      emit(common_vendor.OPEN_EVENT);
    }
    function handleOpened() {
      emit(common_vendor.OPENED_EVENT);
      if (props.defaultValue) {
        if (Array.isArray(props.defaultValue)) {
          if (props.defaultValue.length > 0) {
            scrollToDate(props.defaultValue[0]);
          }
        } else {
          scrollToDate(props.defaultValue);
        }
      }
    }
    function handleClose() {
      emit(common_vendor.CLOSE_EVENT);
    }
    function handleClosed() {
      emit(common_vendor.CLOSED_EVENT);
    }
    __expose({
      scrollToDate,
      initPosition
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.poppable
      }, props.poppable ? common_vendor.e({
        b: common_vendor.unref(slots).btn
      }, common_vendor.unref(slots).btn ? {} : {}, {
        c: common_vendor.unref(slots).day
      }, common_vendor.unref(slots).day ? {
        d: common_vendor.w(({
          date
        }, s0, i0) => {
          return {
            a: common_vendor.r("day", {
              date
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "day",
          path: "d",
          vueId: "2fd010d2-1,2fd010d2-0"
        })
      } : {}, {
        e: common_vendor.unref(slots).topInfo
      }, common_vendor.unref(slots).topInfo ? {
        f: common_vendor.w(({
          date
        }, s0, i0) => {
          return {
            a: common_vendor.r("topInfo", {
              date
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "topInfo",
          path: "f",
          vueId: "2fd010d2-1,2fd010d2-0"
        })
      } : {}, {
        g: common_vendor.unref(slots).bottomInfo
      }, common_vendor.unref(slots).bottomInfo ? {
        h: common_vendor.w(({
          date
        }, s0, i0) => {
          return {
            a: common_vendor.r("bottomInfo", {
              date
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "bottomInfo",
          path: "h",
          vueId: "2fd010d2-1,2fd010d2-0"
        })
      } : {}, {
        i: common_vendor.unref(slots).footer
      }, common_vendor.unref(slots).footer ? {
        j: common_vendor.w(({
          date
        }, s0, i0) => {
          return {
            a: common_vendor.r("footer", {
              date
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "footer",
          path: "j",
          vueId: "2fd010d2-1,2fd010d2-0"
        })
      } : {}, {
        k: common_vendor.sr(calendarRef, "2fd010d2-1,2fd010d2-0", {
          "k": "calendarRef"
        }),
        l: common_vendor.o(choose, "37"),
        m: common_vendor.o(select, "04"),
        n: common_vendor.o(update, "34"),
        o: common_vendor.o(close, "80"),
        p: common_vendor.p({
          visible: innerVisible.value,
          type: props.type,
          poppable: props.poppable,
          ["is-auto-back-fill"]: props.isAutoBackFill,
          title: props.title,
          ["default-value"]: props.defaultValue,
          ["start-date"]: props.startDate,
          ["end-date"]: props.endDate,
          ["start-text"]: props.startText,
          ["end-text"]: props.endText,
          ["confirm-text"]: props.confirmText,
          ["show-today"]: props.showToday,
          ["show-title"]: props.showTitle,
          ["show-sub-title"]: props.showSubTitle,
          ["to-date-animation"]: props.toDateAnimation,
          ["first-day-of-week"]: props.firstDayOfWeek,
          ["disabled-date"]: props.disabledDate,
          ["footer-slot"]: props.footerSlot,
          ["btn-slot"]: props.btnSlot
        }),
        q: common_vendor.o(handleCloseIconClick, "95"),
        r: common_vendor.o(handleOverlayClick, "81"),
        s: common_vendor.o(handleOpen, "0a"),
        t: common_vendor.o(handleOpened, "2f"),
        v: common_vendor.o(handleClose, "82"),
        w: common_vendor.o(handleClosed, "b5"),
        x: common_vendor.o(($event) => innerVisible.value = $event, "f3"),
        y: common_vendor.p({
          ["custom-class"]: popClasses.value,
          ["custom-style"]: popStyles.value,
          ["overlay-class"]: overlayClasses.value,
          ["overlay-style"]: props.overlayStyle,
          position: "bottom",
          round: true,
          closeable: props.closeable,
          ["close-icon"]: props.closeIcon,
          ["close-icon-position"]: props.closeIconPosition,
          ["z-index"]: props.zIndex,
          ["lock-scroll"]: props.lockScroll,
          overlay: props.overlay,
          ["close-on-click-overlay"]: props.closeOnClickOverlay,
          ["destroy-on-close"]: false,
          visible: innerVisible.value
        })
      }) : common_vendor.e({
        z: common_vendor.unref(slots).btn
      }, common_vendor.unref(slots).btn ? {} : {}, {
        A: common_vendor.unref(slots).day
      }, common_vendor.unref(slots).day ? {
        B: common_vendor.w(({
          date
        }, s0, i0) => {
          return {
            a: common_vendor.r("day", {
              date
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "day",
          path: "B",
          vueId: "2fd010d2-2"
        })
      } : {}, {
        C: common_vendor.unref(slots).topInfo
      }, common_vendor.unref(slots).topInfo ? {
        D: common_vendor.w(({
          date
        }, s0, i0) => {
          return {
            a: common_vendor.r("topInfo", {
              date
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "topInfo",
          path: "D",
          vueId: "2fd010d2-2"
        })
      } : {}, {
        E: common_vendor.unref(slots).bottomInfo
      }, common_vendor.unref(slots).bottomInfo ? {
        F: common_vendor.w(({
          date
        }, s0, i0) => {
          return {
            a: common_vendor.r("bottomInfo", {
              date
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "bottomInfo",
          path: "F",
          vueId: "2fd010d2-2"
        })
      } : {}, {
        G: common_vendor.unref(slots).footer
      }, common_vendor.unref(slots).footer ? {
        H: common_vendor.w(({
          date
        }, s0, i0) => {
          return {
            a: common_vendor.r("footer", {
              date
            }),
            b: i0,
            c: s0
          };
        }, {
          name: "footer",
          path: "H",
          vueId: "2fd010d2-2"
        })
      } : {}, {
        I: common_vendor.sr(calendarRef, "2fd010d2-2", {
          "k": "calendarRef"
        }),
        J: common_vendor.o(choose, "54"),
        K: common_vendor.o(select, "84"),
        L: common_vendor.o(close, "1e"),
        M: common_vendor.p({
          visible: innerVisible.value,
          type: props.type,
          poppable: props.poppable,
          ["is-auto-back-fill"]: props.isAutoBackFill,
          title: props.title,
          ["default-value"]: props.defaultValue,
          ["start-date"]: props.startDate,
          ["end-date"]: props.endDate,
          ["start-text"]: props.startText,
          ["end-text"]: props.endText,
          ["confirm-text"]: props.confirmText,
          ["show-today"]: props.showToday,
          ["show-title"]: props.showTitle,
          ["show-sub-title"]: props.showSubTitle,
          ["to-date-animation"]: props.toDateAnimation,
          ["first-day-of-week"]: props.firstDayOfWeek,
          ["disabled-date"]: props.disabledDate,
          ["footer-slot"]: props.footerSlot,
          ["btn-slot"]: props.btnSlot
        })
      }), {
        N: common_vendor.n(classes.value),
        O: common_vendor.s(props.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/calendar/calendar.js.map

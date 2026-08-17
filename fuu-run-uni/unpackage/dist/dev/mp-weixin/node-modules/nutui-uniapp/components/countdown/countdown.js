"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-countdown`;
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
  props: common_vendor.countdownProps,
  emits: common_vendor.countdownEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    __expose({ start, pause, reset });
    const state = common_vendor.reactive({
      restTime: 0,
      // 倒计时剩余时间时间
      timer: null,
      counting: !props.paused && props.autoStart,
      // 是否处于倒计时中
      handleEndTime: Date.now(),
      // 最终截止时间
      diffTime: 0
      // 设置了 startTime 时，与 date.now() 的差异
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    function formatRemainTime(t, type) {
      const ts = t;
      const rest = {
        d: 0,
        h: 0,
        m: 0,
        s: 0,
        ms: 0
      };
      const SECOND = 1e3;
      const MINUTE = 60 * SECOND;
      const HOUR = 60 * MINUTE;
      const DAY = 24 * HOUR;
      if (ts > 0) {
        rest.d = ts >= SECOND ? Math.floor(ts / DAY) : 0;
        rest.h = Math.floor(ts % DAY / HOUR);
        rest.m = Math.floor(ts % HOUR / MINUTE);
        rest.s = Math.floor(ts % MINUTE / SECOND);
        rest.ms = Math.floor(ts % SECOND);
      }
      return type === "custom" ? rest : parseFormat({ ...rest });
    }
    function parseFormat(time) {
      let { d, h, m, s, ms } = time;
      let format = props.format;
      if (format.includes("DD"))
        format = format.replace("DD", common_vendor.padZero(d));
      else
        h += Number(d) * 24;
      if (format.includes("HH"))
        format = format.replace("HH", common_vendor.padZero(h));
      else
        m += Number(h) * 60;
      if (format.includes("mm"))
        format = format.replace("mm", common_vendor.padZero(m));
      else
        s += Number(m) * 60;
      if (format.includes("ss"))
        format = format.replace("ss", common_vendor.padZero(s));
      else
        ms += Number(s) * 1e3;
      if (format.includes("S")) {
        const msC = common_vendor.padZero(ms, 3).toString();
        if (format.includes("SSS"))
          format = format.replace("SSS", msC);
        else if (format.includes("SS"))
          format = format.replace("SS", msC.slice(0, 2));
        else if (format.includes("S"))
          format = format.replace("S", msC.slice(0, 1));
      }
      return format;
    }
    function initTime() {
      state.handleEndTime = props.endTime;
      state.diffTime = Date.now() - common_vendor.getTimeStamp(props.startTime);
      if (!state.counting)
        state.counting = true;
      tick();
    }
    function tick() {
      function countdown() {
        const currentTime = Date.now() - state.diffTime;
        const remainTime = Math.max(state.handleEndTime - currentTime, 0);
        state.restTime = remainTime;
        if (!remainTime) {
          state.counting = false;
          pause();
          emits("onEnd");
        }
        if (remainTime > 0)
          tick();
      }
      if (common_vendor.isH5) {
        state.timer = requestAnimationFrame(() => {
          if (state.counting)
            countdown();
        });
      } else {
        state.timer = common_vendor.requestAniFrame(() => {
          if (state.counting)
            countdown();
        });
      }
    }
    function start() {
      if (!state.counting && !props.autoStart) {
        state.counting = true;
        state.handleEndTime = Date.now() + Number(state.restTime);
        tick();
        emits("onRestart", state.restTime);
      }
    }
    function pause() {
      if (common_vendor.isH5)
        cancelAnimationFrame(state.timer);
      else
        clearTimeout(state.timer);
      state.counting = false;
      emits("onPaused", state.restTime);
    }
    function reset() {
      if (!props.autoStart) {
        pause();
        state.restTime = props.time;
      }
    }
    const renderTime = common_vendor.computed(() => {
      return formatRemainTime(state.restTime);
    });
    common_vendor.onBeforeMount(() => {
      if (props.autoStart)
        initTime();
      else
        state.restTime = props.time;
    });
    common_vendor.watch(
      () => state.restTime,
      (value) => {
        const tranTime = formatRemainTime(value, "custom");
        emits(common_vendor.UPDATE_MODEL_EVENT, tranTime);
        emits(common_vendor.INPUT_EVENT, tranTime);
      }
    );
    common_vendor.watch(
      () => props.paused,
      (v, ov) => {
        if (!ov) {
          if (state.counting)
            pause();
        } else {
          if (!state.counting) {
            state.counting = true;
            state.handleEndTime = Date.now() + Number(state.restTime);
            tick();
          }
          emits("onRestart", state.restTime);
        }
      }
    );
    common_vendor.watch(
      () => props.endTime,
      () => {
        initTime();
      }
    );
    common_vendor.watch(
      () => props.startTime,
      () => {
        initTime();
      }
    );
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.$slots.default
      }, _ctx.$slots.default ? {} : {
        b: renderTime.value
      }, {
        c: common_vendor.n(classes.value),
        d: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/countdown/countdown.js.map

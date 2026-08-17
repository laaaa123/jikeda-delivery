"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-swipe`;
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
  props: common_vendor.swipeProps,
  emits: common_vendor.swipeEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const instance = common_vendor.getCurrentInstance();
    const parent = common_vendor.inject("swipeGroup", null);
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    const randomId = common_vendor.getRandomId();
    const leftElId = `${componentName}-left-${randomId}`;
    const leftElWidth = common_vendor.ref(0);
    const rightElId = `${componentName}-right-${randomId}`;
    const rightElWidth = common_vendor.ref(0);
    async function getElementWidth(elementId) {
      const rect = await common_vendor.useRect(elementId, instance);
      return rect.width || 0;
    }
    async function initWidth() {
      const [leftWidth, rightWidth] = await Promise.all([
        getElementWidth(leftElId),
        getElementWidth(rightElId)
      ]);
      leftElWidth.value = leftWidth;
      rightElWidth.value = rightWidth;
    }
    common_vendor.watch(() => parent == null ? void 0 : parent.name.value, (value) => {
      if (props.name !== value && parent && parent.lock.value)
        close();
    });
    const opened = common_vendor.ref(false);
    let direction = "";
    let oldDirection = "";
    const state = common_vendor.reactive({
      offset: 0,
      moving: false
    });
    const innerStyles = common_vendor.computed(() => {
      return {
        transform: `translate3d(${state.offset}px, 0, 0)`
      };
    });
    function open(dir = "") {
      parent && parent.update(props.name);
      if (opened.value)
        return;
      if (dir)
        state.offset = dir === "left" ? -rightElWidth.value : leftElWidth.value;
      opened.value = true;
      const finalDirection = direction || dir;
      emit("open", {
        name: props.name,
        direction: finalDirection,
        position: finalDirection
      });
    }
    function close() {
      if (!opened.value)
        return;
      state.offset = 0;
      opened.value = false;
      emit("close", {
        name: props.name,
        direction,
        position: direction
      });
    }
    function handleClick(position) {
      if (props.closeOnClick.includes(position))
        close();
      emit(common_vendor.CLICK_EVENT, position);
    }
    function updateOffset(deltaX) {
      direction = deltaX > 0 ? "right" : "left";
      let offset = deltaX;
      switch (direction) {
        case "left": {
          if (opened.value && oldDirection === direction)
            offset = -rightElWidth.value;
          else
            offset = Math.abs(deltaX) > rightElWidth.value ? -rightElWidth.value : deltaX;
          break;
        }
        case "right": {
          if (opened.value && oldDirection === direction)
            offset = leftElWidth.value;
          else
            offset = Math.abs(deltaX) > leftElWidth.value ? leftElWidth.value : deltaX;
          break;
        }
      }
      state.offset = offset;
    }
    const touch = common_vendor.useTouch();
    function onTouchStart(event) {
      if (props.disabled)
        return;
      touch.start(event);
    }
    async function onTouchMove(event) {
      if (props.disabled)
        return;
      touch.move(event);
      if (touch.isHorizontal()) {
        state.moving = true;
        updateOffset(touch.deltaX.value);
        if (props.touchMovePreventDefault)
          event.preventDefault();
        if (props.touchMoveStopPropagation)
          event.stopPropagation();
      }
    }
    function onTouchEnd() {
      if (!state.moving)
        return;
      state.moving = false;
      oldDirection = direction;
      switch (direction) {
        case "left": {
          if (Math.abs(state.offset) <= rightElWidth.value / 2) {
            close();
          } else {
            state.offset = -rightElWidth.value;
            open();
          }
          break;
        }
        case "right": {
          if (Math.abs(state.offset) <= leftElWidth.value / 2) {
            close();
          } else {
            state.offset = leftElWidth.value;
            open();
          }
          break;
        }
      }
    }
    common_vendor.onMounted(() => {
      setTimeout(() => {
        initWidth();
      }, 100);
    });
    __expose({
      open,
      close
    });
    return (_ctx, _cache) => {
      return {
        a: leftElId,
        b: common_vendor.o(($event) => handleClick("left"), "ad"),
        c: common_vendor.o(($event) => handleClick("content"), "fe"),
        d: rightElId,
        e: common_vendor.o(($event) => handleClick("right"), "3f"),
        f: common_vendor.s(innerStyles.value),
        g: common_vendor.o(onTouchStart, "03"),
        h: common_vendor.o(onTouchMove, "93"),
        i: common_vendor.o(onTouchEnd, "8e"),
        j: common_vendor.o(onTouchEnd, "9f"),
        k: common_vendor.n(classes.value),
        l: common_vendor.s(props.customStyle)
      };
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/swipe/swipe.js.map

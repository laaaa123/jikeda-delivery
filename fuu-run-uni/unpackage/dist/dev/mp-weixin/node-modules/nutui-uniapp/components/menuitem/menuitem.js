"use strict";
const common_vendor = require("../../../../common/vendor.js");
const Icon = () => "../icon/icon.js";
const PopUp = () => "../popup/popup.js";
const componentName = `${common_vendor.PREFIX}-menu-item`;
const _sfc_main = common_vendor.defineComponent({
  name: componentName,
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  },
  components: {
    PopUp,
    Icon
  },
  props: common_vendor.menuitemProps,
  emits: common_vendor.menuitemEmits,
  setup(props, { emit, expose }) {
    const state = common_vendor.reactive({
      showPopup: false,
      showWrapper: false
    });
    const { parent } = common_vendor.useInject(common_vendor.MENU_KEY);
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        "nut-hidden": !state.showWrapper
      });
    });
    const styles = common_vendor.computed(() => {
      const obj = (parent == null ? void 0 : parent.props.direction) === "down" ? { top: `${parent == null ? void 0 : parent.offset.value}px` } : { bottom: `${parent == null ? void 0 : parent.offset.value}px` };
      return common_vendor.getMainStyle(props, obj);
    });
    const placeholderElementStyle = common_vendor.computed(() => {
      const heightStyle = { height: `${parent == null ? void 0 : parent.offset.value}px` };
      if ((parent == null ? void 0 : parent.props.direction) === "down")
        return { ...heightStyle, top: 0 };
      return { ...heightStyle, top: "auto" };
    });
    const open = () => {
      state.showPopup = true;
      state.showWrapper = true;
    };
    const close = () => {
      state.showPopup = false;
    };
    const toggle = (show = !state.showPopup) => {
      if (show === state.showPopup)
        return;
      if (show)
        open();
      else
        close();
    };
    const change = (value) => {
      if (value === props.modelValue)
        return;
      emit("update:modelValue", value);
      emit("change", value);
    };
    const title = common_vendor.computed(() => {
      var _a;
      if (props.title)
        return props.title;
      const match = (_a = props.options) == null ? void 0 : _a.find((option) => option.value === props.modelValue);
      return match ? match.text : "";
    });
    const onClick = (option) => {
      state.showPopup = false;
      emit("itemClick", option);
      change(option.value);
    };
    const handleClose = () => {
      state.showWrapper = false;
    };
    const handleClickOutside = () => {
      state.showPopup = false;
    };
    const handleVisible = (visible) => {
      if (visible)
        emit(common_vendor.OPEN_EVENT);
      else
        emit(common_vendor.CLOSE_EVENT);
    };
    expose({
      change,
      open,
      close,
      toggle
    });
    return {
      classes,
      styles,
      placeholderElementStyle,
      title,
      state,
      parent,
      toggle,
      onClick,
      handleClose,
      handleVisible,
      handleClickOutside
    };
  }
});
if (!Array) {
  const _component_Icon = common_vendor.resolveComponent("Icon");
  const _component_PopUp = common_vendor.resolveComponent("PopUp");
  (_component_Icon + _component_PopUp)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f;
  return {
    a: !_ctx.state.showPopup ? 1 : "",
    b: ((_a = _ctx.parent) == null ? void 0 : _a.props.direction) === "up" ? 1 : "",
    c: common_vendor.s(_ctx.placeholderElementStyle),
    d: common_vendor.o((...args) => _ctx.handleClickOutside && _ctx.handleClickOutside(...args), "34"),
    e: common_vendor.f(_ctx.options, (option, index, i0) => {
      var _a2, _b2;
      return common_vendor.e({
        a: option.value === _ctx.modelValue
      }, option.value === _ctx.modelValue ? {
        b: "60de095c-1-" + i0 + ",60de095c-0",
        c: common_vendor.p({
          name: _ctx.optionIcon,
          ["custom-color"]: (_a2 = _ctx.parent) == null ? void 0 : _a2.props.activeColor
        }),
        d: common_vendor.n(option.value === _ctx.modelValue ? _ctx.activeTitleClass : _ctx.inactiveTitleClass)
      } : {}, {
        e: common_vendor.t(option.text),
        f: common_vendor.n(option.value === _ctx.modelValue ? _ctx.activeTitleClass : _ctx.inactiveTitleClass),
        g: option.value === _ctx.modelValue ? (_b2 = _ctx.parent) == null ? void 0 : _b2.props.activeColor : "",
        h: index,
        i: common_vendor.n({
          active: option.value === _ctx.modelValue
        }),
        j: common_vendor.o(($event) => _ctx.onClick(option), index)
      });
    }),
    f: `${100 / _ctx.cols}%`,
    g: common_vendor.o(_ctx.handleClose, "9d"),
    h: common_vendor.o(($event) => _ctx.handleVisible(true), "09"),
    i: common_vendor.o(($event) => _ctx.handleVisible(false), "b3"),
    j: common_vendor.o(($event) => _ctx.state.showPopup = $event, "c2"),
    k: common_vendor.p({
      ..._ctx.$attrs,
      ["custom-style"]: {
        position: "absolute"
      },
      ["overlay-style"]: {
        position: "absolute"
      },
      position: ((_b = _ctx.parent) == null ? void 0 : _b.props.direction) === "down" ? "top" : "bottom",
      duration: (_c = _ctx.parent) == null ? void 0 : _c.props.duration,
      ["pop-class"]: "nut-menu__pop",
      ["destroy-on-close"]: false,
      ["safe-area-inset-top"]: false,
      overlay: (_d = _ctx.parent) == null ? void 0 : _d.props.overlay,
      ["lock-scroll"]: (_e = _ctx.parent) == null ? void 0 : _e.props.lockScroll,
      ["close-on-click-overlay"]: (_f = _ctx.parent) == null ? void 0 : _f.props.closeOnClickOverlay,
      visible: _ctx.state.showPopup
    }),
    l: common_vendor.n(_ctx.classes),
    m: common_vendor.s(_ctx.styles)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/menuitem/menuitem.js.map

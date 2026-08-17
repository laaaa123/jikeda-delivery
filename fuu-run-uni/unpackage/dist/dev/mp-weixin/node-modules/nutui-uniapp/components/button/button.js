"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  Icon();
}
const Icon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-button`;
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
  props: common_vendor.buttonProps,
  emits: common_vendor.buttonEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [`${componentName}--${props.type}`]: !!props.type,
        [`${componentName}--${props.size}`]: !!props.size,
        [`${componentName}--${props.shape}`]: !!props.shape,
        [`${componentName}--plain`]: props.plain,
        [`${componentName}--block`]: props.block,
        [`${componentName}--disabled`]: props.disabled,
        [`${componentName}--loading`]: props.loading,
        [`${componentName}--hovercls`]: props.hoverClass !== "button-hover"
      });
    });
    const styles = common_vendor.computed(() => {
      const value = {};
      if (props.customColor) {
        if (props.plain) {
          value.color = props.customColor;
          value.background = "#fff";
          if (!props.customColor.includes("gradient"))
            value.borderColor = props.customColor;
        } else {
          value.color = "#fff";
          value.background = props.customColor;
        }
      }
      return common_vendor.getMainStyle(props, value);
    });
    function handleClick(event) {
      if (props.disabled || props.loading)
        return;
      emit(common_vendor.CLICK_EVENT, event);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.loading
      }, _ctx.loading ? {
        b: common_vendor.p({
          name: "loading"
        })
      } : {}, {
        c: _ctx.$slots.icon && !_ctx.loading
      }, _ctx.$slots.icon && !_ctx.loading ? {} : {}, {
        d: _ctx.$slots.default
      }, _ctx.$slots.default ? {
        e: _ctx.$slots.icon || _ctx.loading ? 1 : ""
      } : {}, {
        f: common_vendor.n(classes.value),
        g: common_vendor.s(styles.value),
        h: props.formType === "button" ? void 0 : props.formType,
        i: props.disabled || props.loading ? void 0 : props.openType,
        j: props.hoverClass,
        k: props.hoverStartTime,
        l: props.hoverStayTime,
        m: props.lang,
        n: props.sessionFrom,
        o: props.sendMessageTitle,
        p: props.sendMessagePath,
        q: props.sendMessageImg,
        r: props.showMessageCard,
        s: props.groupId,
        t: props.guildId,
        v: props.publicId,
        w: props.dataImId,
        x: props.dataImType,
        y: props.dataGoodsId,
        z: props.dataOrderId,
        A: props.dataBizLine,
        B: common_vendor.o(handleClick, "a3"),
        C: common_vendor.o(($event) => emit("getphonenumber", $event), "f6"),
        D: common_vendor.o(($event) => emit("getuserinfo", $event), "d4"),
        E: common_vendor.o(($event) => emit("error", $event), "4d"),
        F: common_vendor.o(($event) => emit("opensetting", $event), "05"),
        G: common_vendor.o(($event) => emit("addgroupapp", $event), "a5"),
        H: common_vendor.o(($event) => emit("chooseaddress", $event), "b0"),
        I: common_vendor.o(($event) => emit("chooseavatar", $event), "82"),
        J: common_vendor.o(($event) => emit("chooseinvoicetitle", $event), "4c"),
        K: common_vendor.o(($event) => emit("launchapp", $event), "5c"),
        L: common_vendor.o(($event) => emit("login", $event), "fb"),
        M: common_vendor.o(($event) => emit("subscribe", $event), "a1"),
        N: common_vendor.o(($event) => emit("contact", $event), "08"),
        O: common_vendor.o(($event) => emit("agreeprivacyauthorization", $event), "fa"),
        P: common_vendor.o(($event) => emit("im", $event), "9b")
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/button/button.js.map

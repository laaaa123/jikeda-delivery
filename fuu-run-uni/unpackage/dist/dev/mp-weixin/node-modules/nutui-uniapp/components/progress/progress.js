"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutIcon();
}
const NutIcon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-progress`;
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
  props: common_vendor.progressProps,
  setup(__props) {
    const props = __props;
    const slotDefault = !!common_vendor.useSlots().default;
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    const height = common_vendor.computed(() => {
      if (props.strokeWidth)
        return `${props.strokeWidth}px`;
      return void 0;
    });
    const percentage = common_vendor.computed(() => {
      return Number(props.percentage) >= 100 ? 100 : Number(props.percentage);
    });
    const bgStyle = common_vendor.computed(() => {
      return {
        width: `${percentage.value}%`,
        background: props.strokeColor || ""
      };
    });
    const textStyle = common_vendor.computed(() => {
      return {
        color: props.textColor || ""
      };
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(_ctx.status === "active" ? "nut-active" : ""),
        b: common_vendor.s(bgStyle.value),
        c: _ctx.showText && _ctx.textInside && !slotDefault
      }, _ctx.showText && _ctx.textInside && !slotDefault ? {
        d: common_vendor.t(percentage.value),
        e: common_vendor.t(_ctx.isShowPercentage ? "%" : ""),
        f: common_vendor.s(textStyle.value),
        g: height.value,
        h: `${percentage.value}%`,
        i: `translate(-${+percentage.value}%,-50%)`,
        j: _ctx.textBackground || _ctx.strokeColor
      } : {}, {
        k: _ctx.showText && _ctx.textInside && slotDefault
      }, _ctx.showText && _ctx.textInside && slotDefault ? {
        l: `absolute`,
        m: `50%`,
        n: `${percentage.value}%`,
        o: `translate(-${+percentage.value}%,-50%)`
      } : {}, {
        p: common_vendor.n(_ctx.showText && !_ctx.textInside ? "nut-progress-outer-part" : ""),
        q: common_vendor.n(_ctx.size ? `nut-progress-${_ctx.size}` : ""),
        r: height.value,
        s: _ctx.showText && !_ctx.textInside
      }, _ctx.showText && !_ctx.textInside ? common_vendor.e({
        t: _ctx.status === "text" || _ctx.status === "active"
      }, _ctx.status === "text" || _ctx.status === "active" ? {
        v: common_vendor.t(percentage.value),
        w: common_vendor.t(_ctx.isShowPercentage ? "%" : ""),
        x: common_vendor.s(textStyle.value)
      } : _ctx.status === "icon" ? {
        z: common_vendor.p({
          name: "checked",
          width: "15px",
          height: "15px",
          ["custom-color"]: "#439422"
        })
      } : {}, {
        y: _ctx.status === "icon",
        A: height.value
      }) : {}, {
        B: common_vendor.n(classes.value),
        C: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/progress/progress.js.map

"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  (NutIcon + NutTransition)();
}
const NutIcon = () => "../icon/icon.js";
const NutTransition = () => "../transition/transition.js";
const componentName = `${common_vendor.PREFIX}-loading-page`;
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
  props: common_vendor.loadingpageProps,
  setup(__props) {
    const props = __props;
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.image
      }, _ctx.image ? {
        b: _ctx.image,
        c: `${_ctx.iconSize}px`,
        d: `${_ctx.iconSize}px`
      } : {
        e: common_vendor.p({
          name: "loading1",
          size: _ctx.iconSize,
          ["custom-color"]: _ctx.loadingColor
        })
      }, {
        f: common_vendor.t(_ctx.loadingText),
        g: `${_ctx.fontSize}px`,
        h: _ctx.customColor,
        i: common_vendor.n(classes.value),
        j: common_vendor.s(_ctx.customStyle),
        k: common_vendor.p({
          show: _ctx.loading,
          ["custom-style"]: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: _ctx.bgColor,
            display: "flex",
            zIndex: _ctx.zIndex
          }
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/loadingpage/loadingpage.js.map

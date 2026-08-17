"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-empty`;
const { translate } = common_vendor.useTranslate(componentName);
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
  props: common_vendor.emptyProps,
  setup(__props) {
    const props = __props;
    const defaultStatus = {
      empty: "https://static-ftcms.jd.com/p/files/61a9e3183985005b3958672b.png",
      error: "https://ftcms.jd.com/p/files/61a9e33ee7dcdbcc0ce62736.png",
      network: "https://static-ftcms.jd.com/p/files/61a9e31de7dcdbcc0ce62734.png"
    };
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    const style = common_vendor.computed(() => {
      if (props.imageSize) {
        return {
          width: common_vendor.pxCheck(props.imageSize),
          height: common_vendor.pxCheck(props.imageSize)
        };
      }
      return {};
    });
    const isHttpUrl = props.image.startsWith("https://") || props.image.startsWith("http://") || props.image.startsWith("//");
    const src = isHttpUrl ? props.image : defaultStatus[props.image];
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(src)
      }, common_vendor.unref(src) ? {
        b: common_vendor.unref(src)
      } : {}, {
        c: common_vendor.s(style.value),
        d: common_vendor.t(_ctx.description || common_vendor.unref(translate)("noData")),
        e: common_vendor.n(classes.value),
        f: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/empty/empty.js.map

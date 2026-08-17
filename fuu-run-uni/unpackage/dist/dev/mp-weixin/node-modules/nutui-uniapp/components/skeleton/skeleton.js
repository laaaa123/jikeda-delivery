"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutAvatar();
}
const NutAvatar = () => "../avatar/avatar.js";
const componentName = `${common_vendor.PREFIX}-skeleton`;
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
  props: common_vendor.skeletonProps,
  setup(__props) {
    const props = __props;
    const { avatarShape, round, avatarSize } = common_vendor.toRefs(props);
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    const avatarClass = common_vendor.computed(() => {
      const prefixCls = "avatarClass";
      return {
        [prefixCls]: true,
        [`${prefixCls}--${avatarShape.value}`]: avatarShape.value
      };
    });
    function getBlockClass(prefixCls) {
      return {
        [prefixCls]: true,
        [`${prefixCls}--round`]: round.value
      };
    }
    function getStyle() {
      if (avatarSize.value) {
        return {
          width: avatarSize.value,
          height: avatarSize.value
        };
      }
      return {
        width: "50px",
        height: "50px"
      };
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !_ctx.loading
      }, !_ctx.loading ? {} : common_vendor.e({
        b: _ctx.animated
      }, _ctx.animated ? {} : {}, {
        c: _ctx.avatar
      }, _ctx.avatar ? {
        d: common_vendor.p({
          ["custom-class"]: avatarClass.value,
          shape: common_vendor.unref(avatarShape),
          ["custom-style"]: getStyle()
        })
      } : {}, {
        e: _ctx.title
      }, _ctx.title ? {
        f: common_vendor.n(getBlockClass("nut-skeleton-blockTitle")),
        g: _ctx.height
      } : {}, {
        h: common_vendor.f(Number(_ctx.row), (_, k0, i0) => {
          return {
            a: _
          };
        }),
        i: common_vendor.n(getBlockClass("nut-skeleton-blockLine")),
        j: _ctx.height,
        k: _ctx.width,
        l: common_vendor.n(classes.value),
        m: common_vendor.s(_ctx.customStyle)
      }));
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/skeleton/skeleton.js.map

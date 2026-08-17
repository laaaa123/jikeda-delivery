"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutIcon();
}
const NutIcon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-navbar`;
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
  props: common_vendor.navbarProps,
  emits: common_vendor.navbarEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { border, fixed, safeAreaInsetTop, placeholder, zIndex } = common_vendor.toRefs(props);
    const { statusBarHeight } = common_vendor.index.getSystemInfoSync();
    const navHeight = common_vendor.ref("auto");
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [`${componentName}--border`]: border.value,
        [`${componentName}--safe-area-inset-top`]: safeAreaInsetTop.value,
        [`${componentName}--fixed`]: fixed.value
      });
    });
    const styles = common_vendor.computed(() => {
      const style = {};
      if (zIndex.value)
        style.zIndex = Number(zIndex.value);
      if (placeholder.value && fixed.value) {
        style.height = navHeight.value;
        style.paddingTop = common_vendor.pxCheck(statusBarHeight);
      }
      return common_vendor.getMainStyle(props, style);
    });
    const colorStyle = common_vendor.computed(() => {
      return {
        fontSize: common_vendor.pxCheck(props.size),
        color: props.customColor
      };
    });
    function getNavHeight() {
      if (!fixed.value || !placeholder.value)
        return;
      const menuButtonBounding = common_vendor.index.getMenuButtonBoundingClientRect();
      navHeight.value = !menuButtonBounding ? "44px" : common_vendor.pxCheck(menuButtonBounding.bottom + menuButtonBounding.top - statusBarHeight);
    }
    function handleBack() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        common_vendor.index.redirectTo({
          url: "/"
        });
      }
    }
    function handleLeft() {
      emit("onClickBack");
      emit("clickBack");
    }
    function handleCenter() {
      emit("onClickTitle");
      emit("clickTitle");
    }
    function handleCenterIcon() {
      emit("onClickIcon");
      emit("clickIcon");
    }
    function handleRight() {
      emit("onClickRight");
      emit("clickRight");
    }
    common_vendor.onMounted(() => {
      if (props.fixed && props.placeholder) {
        common_vendor.nextTick$1(() => {
          getNavHeight();
        });
      }
    });
    common_vendor.watch(
      [() => props.fixed, () => props.placeholder],
      () => {
        getNavHeight();
      },
      { deep: true, immediate: false }
    );
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.leftShow
      }, _ctx.leftShow ? {
        b: common_vendor.o(handleBack, "ff"),
        c: common_vendor.p({
          ["custom-class"]: "right-icon",
          name: "left",
          height: "12px",
          size: _ctx.size,
          ["custom-color"]: _ctx.customColor
        })
      } : {}, {
        d: _ctx.leftText
      }, _ctx.leftText ? {
        e: common_vendor.t(_ctx.leftText),
        f: common_vendor.s(colorStyle.value)
      } : {}, {
        g: common_vendor.o(handleLeft, "50"),
        h: _ctx.title
      }, _ctx.title ? {
        i: common_vendor.t(_ctx.title),
        j: common_vendor.s(colorStyle.value),
        k: common_vendor.o(handleCenter, "73")
      } : {}, {
        l: _ctx.titleIcon
      }, _ctx.titleIcon ? {
        m: common_vendor.o(handleCenterIcon, "da")
      } : {}, {
        n: _ctx.desc
      }, _ctx.desc ? {
        o: common_vendor.t(_ctx.desc),
        p: common_vendor.s(_ctx.customStyle)
      } : {}, {
        q: common_vendor.o(handleRight, "d1"),
        r: common_vendor.n(classes.value),
        s: common_vendor.s(styles.value),
        t: navHeight.value
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/navbar/navbar.js.map

"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutIcon();
}
const NutIcon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-cell`;
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
  props: common_vendor.cellProps,
  emits: common_vendor.cellEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = common_vendor.useSlots();
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [`${componentName}--center`]: props.center,
        [`${componentName}--large`]: props.size === "large",
        [`${componentName}--clickable`]: props.isLink || props.to || props.clickable
      });
    });
    const styles = common_vendor.computed(() => {
      const value = {};
      if (props.roundRadius != null)
        value.borderRadius = common_vendor.pxCheck(props.roundRadius);
      return common_vendor.getMainStyle(props, value);
    });
    const titleStyles = common_vendor.computed(() => {
      const value = {};
      if (props.titleWidth != null) {
        value.flex = "0 0 auto";
        value.width = common_vendor.pxCheck(props.titleWidth);
        value.minWidth = 0;
      }
      return value;
    });
    const descClasses = common_vendor.computed(() => {
      return {
        [`${componentName}__value--alone`]: !(props.title || props.subTitle || slots.title)
      };
    });
    const descStyles = common_vendor.computed(() => {
      return {
        textAlign: props.descTextAlign
      };
    });
    function handleClick(event) {
      emit(common_vendor.CLICK_EVENT, event);
      if (props.to) {
        common_vendor.index.navigateTo({
          url: props.to
        });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(slots).default
      }, common_vendor.unref(slots).default ? {} : common_vendor.e({
        b: props.icon || common_vendor.unref(slots).icon
      }, props.icon || common_vendor.unref(slots).icon ? common_vendor.e({
        c: common_vendor.unref(slots).icon
      }, common_vendor.unref(slots).icon ? {} : {
        d: common_vendor.p({
          ["custom-class"]: "nut-cell__icon__inner",
          name: props.icon
        })
      }) : {}, {
        e: props.title || props.subTitle || common_vendor.unref(slots).title
      }, props.title || props.subTitle || common_vendor.unref(slots).title ? common_vendor.e({
        f: common_vendor.unref(slots).title
      }, common_vendor.unref(slots).title ? {} : {
        g: common_vendor.t(props.title)
      }, {
        h: props.subTitle
      }, props.subTitle ? {
        i: common_vendor.t(props.subTitle)
      } : {}, {
        j: common_vendor.s(titleStyles.value)
      }) : {}, {
        k: props.desc || common_vendor.unref(slots).desc
      }, props.desc || common_vendor.unref(slots).desc ? common_vendor.e({
        l: common_vendor.unref(slots).desc
      }, common_vendor.unref(slots).desc ? {} : {
        m: common_vendor.t(props.desc)
      }, {
        n: common_vendor.n(descClasses.value),
        o: common_vendor.s(descStyles.value)
      }) : {}, {
        p: common_vendor.unref(slots).link
      }, common_vendor.unref(slots).link ? {} : common_vendor.e({
        q: props.isLink || props.to
      }, props.isLink || props.to ? {
        r: common_vendor.p({
          ["custom-class"]: "nut-cell__link",
          name: "right"
        })
      } : {})), {
        s: common_vendor.n(classes.value),
        t: common_vendor.s(styles.value),
        v: common_vendor.o(handleClick, "b2")
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/cell/cell.js.map

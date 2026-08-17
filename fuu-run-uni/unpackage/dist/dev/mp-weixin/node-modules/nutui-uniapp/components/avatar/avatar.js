"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-avatar`;
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
  props: common_vendor.avatarProps,
  setup(__props) {
    const props = __props;
    const instance = common_vendor.getCurrentInstance();
    const { parent } = common_vendor.useInject(common_vendor.AVATAR_GROUP_KEY);
    const show = common_vendor.ref(true);
    const innerZIndex = common_vendor.ref(void 0);
    common_vendor.watch(() => ({
      maxCount: parent == null ? void 0 : parent.props.maxCount,
      children: parent == null ? void 0 : parent.internalChildren
    }), ({ maxCount, children }) => {
      if (maxCount == null || Number(maxCount) <= 0 || children == null || instance == null) {
        show.value = true;
        innerZIndex.value = void 0;
        return;
      }
      const index = children.findIndex((item) => {
        var _a;
        return item.uid === instance.uid && !((_a = item.props.customClass) == null ? void 0 : _a.includes("avatar-fold"));
      });
      if (index < 0) {
        show.value = true;
        innerZIndex.value = void 0;
        return;
      }
      show.value = index < Number(maxCount);
      if ((parent == null ? void 0 : parent.props.zIndex) === "right")
        innerZIndex.value = children.length - index;
      else
        innerZIndex.value = void 0;
    }, {
      immediate: true,
      deep: true
    });
    function getTrulySize() {
      if (props.size != null)
        return props.size;
      if (parent != null && parent.props.size != null)
        return parent.props.size;
      return "normal";
    }
    const finalSize = common_vendor.computed(() => {
      const size = getTrulySize();
      const preset = common_vendor.avatarSize.includes(size);
      return {
        preset,
        value: preset ? size : common_vendor.pxCheck(size)
      };
    });
    const finalShape = common_vendor.computed(() => {
      if (props.shape != null)
        return props.shape;
      if (parent != null && parent.props.shape != null)
        return parent.props.shape;
      return "round";
    });
    const classes = common_vendor.computed(() => {
      const value = {
        [`nut-avatar-${finalShape.value}`]: true,
        "nut-hidden": !show.value
      };
      if (finalSize.value.preset)
        value[`nut-avatar-${finalSize.value.value}`] = true;
      return common_vendor.getMainClass(props, componentName, value);
    });
    const styles = common_vendor.computed(() => {
      const value = {
        backgroundColor: props.bgColor,
        color: props.customColor
      };
      if (!finalSize.value.preset) {
        value.width = finalSize.value.value;
        value.height = finalSize.value.value;
      }
      if (parent == null ? void 0 : parent.props.span)
        value.marginLeft = common_vendor.pxCheck(parent == null ? void 0 : parent.props.span);
      if (innerZIndex.value !== void 0)
        value.zIndex = innerZIndex.value;
      return common_vendor.getMainStyle(props, value);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.s(styles.value),
        b: common_vendor.n(classes.value)
      };
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/avatar/avatar.js.map

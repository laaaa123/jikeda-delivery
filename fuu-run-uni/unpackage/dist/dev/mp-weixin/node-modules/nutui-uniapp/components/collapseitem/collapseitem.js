"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutIcon();
}
const NutIcon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-collapse-item`;
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
  props: common_vendor.collapseitemProps,
  setup(__props) {
    const props = __props;
    const instance = common_vendor.getCurrentInstance();
    const { getSelectorNodeInfo } = common_vendor.useSelectorQuery(instance);
    const refRandomId = common_vendor.getRandomId();
    common_vendor.useSlots();
    const target = `#nut-collapse__item-${refRandomId}`;
    const currentHeight = common_vendor.ref("auto");
    const inAnimation = common_vendor.ref(false);
    const timeoutId = common_vendor.ref("");
    const collapse = common_vendor.inject("collapseParent");
    const parent = common_vendor.reactive(collapse);
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [`${componentName}__border`]: props.border
      });
    });
    common_vendor.onMounted(() => {
      setTimeout(() => {
        getRect(target).then((res) => {
          if (res == null ? void 0 : res.height)
            currentHeight.value = `${res.height}px`;
        });
      }, 100);
    });
    async function getRectHeight() {
      const rect = await getRect(target);
      return rect.height;
    }
    common_vendor.watch(
      () => getRectHeight(),
      (val) => {
        setTimeout(() => {
          currentHeight.value = `${val}px`;
        }, 200);
      },
      {
        deep: true
      }
    );
    function getRect(selector) {
      return getSelectorNodeInfo(selector);
    }
    const expanded = common_vendor.computed(() => {
      if (parent)
        return parent.isExpanded(props.name);
      return false;
    });
    const wrapperHeight = common_vendor.ref(expanded.value ? "auto" : "0px");
    function handleClick() {
      if (!inAnimation.value)
        parent.updateVal(props.name);
    }
    function toggle(open) {
      if (timeoutId.value) {
        clearTimeout(timeoutId.value);
        timeoutId.value = "";
      }
      const start = open ? "0px" : currentHeight.value;
      const end = open ? currentHeight.value : "0px";
      inAnimation.value = true;
      wrapperHeight.value = start;
      setTimeout(() => {
        wrapperHeight.value = end;
        inAnimation.value = false;
        if (open) {
          timeoutId.value = setTimeout(() => {
            wrapperHeight.value = "auto";
          }, 300);
        }
      }, 100);
    }
    common_vendor.watch(expanded, toggle);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.$slots.title
      }, _ctx.$slots.title ? {} : {
        b: _ctx.title
      }, {
        c: _ctx.label
      }, _ctx.label ? {
        d: common_vendor.t(_ctx.label)
      } : {}, {
        e: _ctx.$slots.value
      }, _ctx.$slots.value ? {} : {
        f: _ctx.value
      }, {
        g: common_vendor.p({
          name: _ctx.icon
        }),
        h: common_vendor.n({
          "nut-collapse-item__title-icon--expanded": expanded.value
        }),
        i: `rotate(${expanded.value ? _ctx.rotate : 0}deg)`,
        j: common_vendor.n({
          "nut-collapse-item__title--disabled": _ctx.disabled
        }),
        k: common_vendor.o(handleClick, "29"),
        l: _ctx.$slots.extra
      }, _ctx.$slots.extra ? {} : {}, {
        m: `nut-collapse__item-${common_vendor.unref(refRandomId)}`,
        n: wrapperHeight.value,
        o: common_vendor.n(classes.value),
        p: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/collapseitem/collapseitem.js.map

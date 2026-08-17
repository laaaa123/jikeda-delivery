"use strict";
const common_vendor = require("../../../../common/vendor.js");
const Icon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-menu`;
const _sfc_main = common_vendor.defineComponent({
  name: componentName,
  components: { Icon },
  props: common_vendor.menuProps,
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  },
  setup(props) {
    const barId = `nut-menu__bar${common_vendor.getRandomId()}`;
    const offset = common_vendor.ref(0);
    const instance = common_vendor.getCurrentInstance();
    const { children } = common_vendor.useProvide(common_vendor.MENU_KEY)({ props, offset });
    const opened = common_vendor.computed(() => children.some((item) => {
      var _a;
      return (_a = item == null ? void 0 : item.state) == null ? void 0 : _a.showWrapper;
    }));
    const isScrollFixed = common_vendor.computed(() => {
      const { scrollFixed, scrollTop } = props;
      if (!scrollFixed)
        return false;
      return scrollTop > (typeof scrollFixed === "boolean" ? 30 : Number(scrollFixed));
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        "scroll-fixed": isScrollFixed.value
      });
    });
    function updateOffset(children2) {
      setTimeout(() => {
        common_vendor.useRect(barId, instance).then((rect) => {
          if (props.direction === "down")
            offset.value = rect.bottom + common_vendor.index.getSystemInfoSync().windowTop;
          else
            offset.value = common_vendor.index.getSystemInfoSync().windowHeight - rect.top;
          children2.toggle();
        });
      }, 100);
    }
    function toggleItem(active) {
      children.forEach((item, index) => {
        if (index === active)
          updateOffset(item);
        else if (item.state.showPopup)
          item.toggle(false, { immediate: true });
      });
    }
    function getClasses(showPopup) {
      let str = "";
      const { titleClass } = props;
      if (showPopup)
        str += "active";
      if (titleClass)
        str += ` ${titleClass}`;
      return str;
    }
    return {
      barId,
      toggleItem,
      children,
      opened,
      classes,
      getClasses
    };
  }
});
if (!Array) {
  const _component_Icon = common_vendor.resolveComponent("Icon");
  _component_Icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(_ctx.children, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.title)
      }, _ctx.direction === "up" ? {
        b: "64d528f2-0-" + i0,
        c: common_vendor.p({
          name: _ctx.upIcon
        })
      } : {
        d: "64d528f2-1-" + i0,
        e: common_vendor.p({
          name: _ctx.downIcon
        })
      }, {
        f: common_vendor.n(_ctx.getClasses(item.state.showPopup)),
        g: item.disabled ? 1 : "",
        h: item.state.showPopup ? 1 : "",
        i: item.state.showPopup ? _ctx.activeColor : "",
        j: common_vendor.o(($event) => !item.disabled && _ctx.toggleItem(index), index),
        k: index
      });
    }),
    b: _ctx.direction === "up",
    c: _ctx.barId,
    d: _ctx.opened ? 1 : "",
    e: common_vendor.n(_ctx.classes),
    f: common_vendor.s(_ctx.customStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/menu/menu.js.map

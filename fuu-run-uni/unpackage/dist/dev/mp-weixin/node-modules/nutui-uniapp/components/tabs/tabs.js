"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  NutIcon();
}
const NutIcon = () => "../icon/icon.js";
const componentName = `${common_vendor.PREFIX}-tabs`;
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
  props: common_vendor.tabsProps,
  emits: common_vendor.tabsEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const instance = common_vendor.getCurrentInstance();
    const { getSelectorNodeInfo, getSelectorNodeInfos } = common_vendor.useSelectorQuery(instance);
    const refRandomId = common_vendor.getRandomId();
    common_vendor.ref(null);
    const { internalChildren } = common_vendor.useProvide(common_vendor.TAB_KEY, `${common_vendor.PREFIX}-tabs`)({
      activeKey: common_vendor.computed(() => props.modelValue || 0),
      autoHeight: common_vendor.computed(() => props.autoHeight),
      animatedTime: common_vendor.computed(() => props.animatedTime)
    });
    const titles = common_vendor.ref([]);
    function renderTitles(vnodes) {
      vnodes.forEach((vnode, index) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        let type = vnode.type;
        type = type.name || type;
        if (type === "nut-tab-pane") {
          const title = new common_vendor.Title();
          if (((_a = vnode.props) == null ? void 0 : _a.title) || ((_b = vnode.props) == null ? void 0 : _b["pane-key"]) || ((_c = vnode.props) == null ? void 0 : _c.paneKey)) {
            const paneKeyType = common_vendor.TypeOfFun((_d = vnode.props) == null ? void 0 : _d["pane-key"]);
            const paneIndex = paneKeyType === "number" || paneKeyType === "string" ? String((_e = vnode.props) == null ? void 0 : _e["pane-key"]) : null;
            const camelPaneKeyType = common_vendor.TypeOfFun((_f = vnode.props) == null ? void 0 : _f.paneKey);
            const camelPaneIndex = camelPaneKeyType === "number" || camelPaneKeyType === "string" ? String((_g = vnode.props) == null ? void 0 : _g.paneKey) : null;
            title.title = (_h = vnode.props) == null ? void 0 : _h.title;
            title.paneKey = paneIndex || camelPaneIndex || String(index);
            title.disabled = (_i = vnode.props) == null ? void 0 : _i.disabled;
          }
          titles.value.push(title);
        } else {
          if (vnode.children === " ")
            return;
          renderTitles(vnode.children);
        }
      });
    }
    const currentIndex = common_vendor.ref(props.modelValue || 0);
    function findTabsIndex(value) {
      const index = titles.value.findIndex((item) => item.paneKey === String(value));
      currentIndex.value = index;
    }
    const getScrollX = common_vendor.computed(() => {
      return props.titleScroll && props.direction === "horizontal";
    });
    const getScrollY = common_vendor.computed(() => {
      return props.titleScroll && props.direction === "vertical";
    });
    const titleRef = common_vendor.ref([]);
    const scrollLeft = common_vendor.ref(0);
    const scrollTop = common_vendor.ref(0);
    const scrollWithAnimation = common_vendor.ref(false);
    const navRectRef = common_vendor.ref();
    const titleRectRef = common_vendor.ref([]);
    const canShowLabel = common_vendor.ref(false);
    function scrollIntoView() {
      if (!props.titleScroll)
        return;
      common_vendor.requestAniFrame(() => {
        Promise.all([
          getSelectorNodeInfo(`#nut-tabs__titles_${refRandomId}`),
          getSelectorNodeInfos(`#nut-tabs__titles_${refRandomId} .nut-tabs__titles-item`)
        ]).then(([navRect, titleRects]) => {
          var _a, _b, _c, _d;
          navRectRef.value = navRect;
          titleRectRef.value = titleRects;
          if (navRectRef.value) {
            if (props.direction === "vertical") {
              const titlesTotalHeight = titleRects.reduce((prev, curr) => prev + curr.height, 0);
              if (titlesTotalHeight > ((_a = navRectRef.value) == null ? void 0 : _a.height))
                canShowLabel.value = true;
              else
                canShowLabel.value = false;
            } else {
              const titlesTotalWidth = titleRects.reduce((prev, curr) => prev + curr.width, 0);
              if (titlesTotalWidth > ((_b = navRectRef.value) == null ? void 0 : _b.width))
                canShowLabel.value = true;
              else
                canShowLabel.value = false;
            }
          }
          const titleRect = titleRectRef.value[currentIndex.value];
          let to = 0;
          if (props.direction === "vertical") {
            const top = titleRects.slice(0, currentIndex.value).reduce((prev, curr) => prev + curr.height, 0);
            to = top - (((_c = navRectRef.value) == null ? void 0 : _c.height) - titleRect.height) / 2;
          } else {
            const left = titleRects.slice(0, currentIndex.value).reduce((prev, curr) => prev + curr.width, 0);
            to = left - (((_d = navRectRef.value) == null ? void 0 : _d.width) - (titleRect == null ? void 0 : titleRect.width)) / 2;
          }
          common_vendor.nextTick$1(() => {
            scrollWithAnimation.value = true;
          });
          scrollDirection(to, props.direction);
        });
      });
    }
    function scrollDirection(to, direction) {
      let count = 0;
      const from = direction === "horizontal" ? scrollLeft.value : scrollTop.value;
      const frames = 1;
      function animate() {
        if (direction === "horizontal")
          scrollLeft.value += (to - from) / frames;
        else
          scrollTop.value += (to - from) / frames;
        if (++count < frames)
          common_vendor.requestAniFrame(animate);
      }
      animate();
    }
    function init(vnodes = internalChildren.map((item) => item.vnode)) {
      titles.value = [];
      vnodes = vnodes == null ? void 0 : vnodes.filter((item) => typeof item.children !== "string");
      if (vnodes && vnodes.length)
        renderTitles(vnodes);
      findTabsIndex(props.modelValue);
      setTimeout(() => {
        scrollIntoView();
      }, 500);
    }
    common_vendor.watch(
      () => internalChildren.map((item) => item.props),
      (vnodes) => {
        init(internalChildren);
      },
      { deep: true, immediate: true }
    );
    common_vendor.watch(
      () => props.modelValue,
      (value) => {
        findTabsIndex(value);
        scrollIntoView();
      }
    );
    common_vendor.onMounted(init);
    common_vendor.onActivated(init);
    const tabMethods = {
      isBegin: () => {
        return currentIndex.value === 0;
      },
      isEnd: () => {
        return currentIndex.value === titles.value.length - 1;
      },
      next: () => {
        currentIndex.value += 1;
        const nextDisabled = titles.value[currentIndex.value].disabled;
        if (tabMethods.isEnd() && nextDisabled) {
          tabMethods.prev();
          return;
        }
        if (nextDisabled && currentIndex.value < titles.value.length - 1) {
          tabMethods.next();
          return;
        }
        tabMethods.updateValue(titles.value[currentIndex.value]);
      },
      prev: () => {
        currentIndex.value -= 1;
        const prevDisabled = titles.value[currentIndex.value].disabled;
        if (tabMethods.isBegin() && prevDisabled) {
          tabMethods.next();
          return;
        }
        if (prevDisabled && currentIndex.value > 0) {
          tabMethods.prev();
          return;
        }
        tabMethods.updateValue(titles.value[currentIndex.value]);
      },
      updateValue: (item) => {
        emit(common_vendor.UPDATE_MODEL_EVENT, item.paneKey);
        emit(common_vendor.CHANGE_EVENT, item);
      },
      tabChange: (item, index) => {
        emit(common_vendor.CLICK_EVENT, item);
        if (item.disabled || currentIndex.value === index)
          return;
        currentIndex.value = index;
        tabMethods.updateValue(item);
      },
      setTabItemRef: (el, index) => {
        titleRef.value[index] = el;
      }
    };
    const { tabChange } = tabMethods;
    const { touchState, touchMethods, tabsContentID, tabsContentRef } = common_vendor.useTabContentTouch(props, tabMethods, instance, common_vendor.useRect);
    const contentStyle = common_vendor.computed(() => {
      let offsetPercent = currentIndex.value * 100;
      if (touchState.moving)
        offsetPercent += touchState.offset;
      let style = {
        transform: props.direction === "horizontal" ? `translate3d(-${offsetPercent}%, 0, 0)` : `translate3d( 0,-${offsetPercent}%, 0)`,
        transitionDuration: touchState.moving ? void 0 : `${props.animatedTime}ms`
      };
      if (props.animatedTime === 0)
        style = {};
      return style;
    });
    const tabsNavStyle = common_vendor.computed(() => {
      return {
        background: props.background
      };
    });
    const tabsActiveStyle = common_vendor.computed(() => {
      return {
        color: props.type === "smile" ? props.customColor : "",
        background: props.type === "line" ? props.customColor : ""
      };
    });
    const titleStyle = common_vendor.computed(() => {
      if (!props.titleGutter)
        return {};
      const px = common_vendor.pxCheck(props.titleGutter);
      if (props.direction === "vertical")
        return { paddingTop: px, paddingBottom: px };
      return { paddingLeft: px, paddingRight: px };
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName, {
        [props.direction]: true
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.$slots.titles
      }, _ctx.$slots.titles ? {} : common_vendor.e({
        b: common_vendor.f(titles.value, (item, index, i0) => {
          return common_vendor.e(_ctx.type === "line" ? {
            a: common_vendor.s(tabsActiveStyle.value)
          } : {}, _ctx.type === "smile" ? {
            b: "515d175c-0-" + i0,
            c: common_vendor.p({
              name: "joy-smile",
              ["custom-color"]: _ctx.customColor
            }),
            d: common_vendor.s(tabsActiveStyle.value)
          } : {}, {
            e: common_vendor.t(item.title),
            f: item.paneKey,
            g: item.paneKey === String(_ctx.modelValue) ? 1 : "",
            h: item.disabled ? 1 : "",
            i: common_vendor.o(($event) => common_vendor.unref(tabChange)(item, index), item.paneKey)
          });
        }),
        c: _ctx.type === "line",
        d: _ctx.type === "smile",
        e: _ctx.ellipsis ? 1 : "",
        f: common_vendor.s(titleStyle.value),
        g: _ctx.align === "left" ? 1 : "",
        h: canShowLabel.value && _ctx.titleScroll
      }, canShowLabel.value && _ctx.titleScroll ? {} : {}), {
        i: _ctx.align === "left" ? 1 : "",
        j: `nut-tabs__titles_${common_vendor.unref(refRandomId)}`,
        k: getScrollX.value,
        l: getScrollY.value,
        m: scrollWithAnimation.value,
        n: scrollLeft.value,
        o: scrollTop.value,
        p: _ctx.type,
        q: _ctx.type ? 1 : "",
        r: _ctx.titleScroll ? 1 : "",
        s: _ctx.size,
        t: _ctx.size ? 1 : "",
        v: common_vendor.s(tabsNavStyle.value),
        w: common_vendor.unref(tabsContentID),
        x: common_vendor.s(contentStyle.value),
        y: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(touchMethods).onTouchStart && common_vendor.unref(touchMethods).onTouchStart(...args),
          "76"
        ),
        z: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(touchMethods).onTouchMove && common_vendor.unref(touchMethods).onTouchMove(...args),
          "22"
        ),
        A: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(touchMethods).onTouchEnd && common_vendor.unref(touchMethods).onTouchEnd(...args),
          "e0"
        ),
        B: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(touchMethods).onTouchEnd && common_vendor.unref(touchMethods).onTouchEnd(...args),
          "b6"
        ),
        C: common_vendor.s(_ctx.customStyle),
        D: common_vendor.n(classes.value)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/tabs/tabs.js.map

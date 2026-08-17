"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-elevator`;
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
  props: common_vendor.elevatorProps,
  emits: common_vendor.elevatorEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const instance = common_vendor.getCurrentInstance();
    __expose({
      scrollTo
    });
    const spaceHeight = 23;
    const state = common_vendor.reactive({
      anchorIndex: 0,
      codeIndex: 0,
      listHeight: [],
      listGroup: [],
      touchState: {
        y1: 0,
        y2: 0
      },
      scrollStart: false,
      currentIndex: 0,
      query: common_vendor.index.createSelectorQuery(),
      scrollTop: 0,
      currentData: {},
      currentKey: "",
      scrollY: 0
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    function getData(el) {
      if (!el.dataset.index)
        return "0";
      return el.dataset.index;
    }
    function setListGroup(el) {
      common_vendor.nextTick$1(() => {
        if (!state.listGroup.includes(el) && el != null)
          state.listGroup.push(el);
      });
    }
    function queryItemHeight(index) {
      return new Promise((resolve) => {
        common_vendor.index.createSelectorQuery().in(instance).selectAll(`#elevator__item__${index}`).boundingClientRect((res) => {
          resolve(res);
        }).exec();
      });
    }
    async function calculateHeight() {
      state.listHeight = [];
      let height = 0;
      state.listHeight.push(height);
      try {
        const nodeList = await Promise.all(
          state.listGroup.map(async (_, index) => {
            return await queryItemHeight(index);
          })
        );
        nodeList.forEach((_, index) => {
          height += Math.floor(nodeList[index][0].height);
          state.listHeight.push(height);
        });
      } catch (err) {
        state.listHeight = [0];
        throw err;
      }
    }
    function scrollTo(index) {
      if (!index && index !== 0)
        return;
      if (index < 0)
        index = 0;
      if (index > state.listHeight.length - 2)
        index = state.listHeight.length - 2;
      state.codeIndex = index;
      state.scrollTop = state.listHeight[index];
    }
    function touchStart(e) {
      state.scrollStart = true;
      const index = getData(e.target);
      const firstTouch = e.touches[0];
      state.touchState.y1 = firstTouch.pageY;
      state.anchorIndex = +index;
      state.codeIndex = +index;
      scrollTo(+index);
    }
    function touchMove(e) {
      const firstTouch = e.touches[0];
      state.touchState.y2 = firstTouch.pageY;
      const delta = (state.touchState.y2 - state.touchState.y1) / spaceHeight | 0;
      state.codeIndex = state.anchorIndex + delta;
      scrollTo(state.currentIndex);
    }
    function touchEnd() {
      state.scrollStart = false;
    }
    function handleClickItem(key, item) {
      emit("clickItem", key, item);
      state.currentData = item;
      state.currentKey = key;
    }
    function handleClickIndex(key) {
      emit("clickIndex", key);
    }
    function listViewScroll(e) {
      const target = e.detail;
      const scrollTop2 = target.scrollTop;
      const listHeight = state.listHeight;
      state.scrollY = Math.floor(scrollTop2);
      for (let i = 0; i < state.listHeight.length - 1; i++) {
        const height1 = listHeight[i];
        const height2 = listHeight[i + 1];
        if (state.scrollY >= height1 && state.scrollY < height2) {
          state.currentIndex = i;
          return;
        }
      }
    }
    function queryItemHeightFields(index) {
      return new Promise((resolve) => {
        const query = common_vendor.index.createSelectorQuery().in(instance).select(`#elevator__item__${index}`);
        query.fields({
          size: true,
          scrollOffset: true,
          rect: true,
          id: true
        }, (data) => {
          resolve(data);
        }).exec();
      });
    }
    common_vendor.onMounted(async () => {
      try {
        await Promise.all(
          props.indexList.map(async (_, index) => {
            const data = await queryItemHeightFields(index);
            setListGroup(data);
          })
        );
        calculateHeight();
      } catch (err) {
        calculateHeight();
        throw err;
      }
    });
    common_vendor.watch(
      () => state.currentIndex,
      (newVal) => {
        emit("change", newVal);
      }
    );
    const { scrollTop, scrollY, currentIndex, scrollStart, codeIndex, currentData, currentKey } = common_vendor.toRefs(state);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(_ctx.indexList, (item, index, i0) => {
          return {
            a: common_vendor.t(item[_ctx.acceptKey]),
            b: common_vendor.f(item.list, (subitem, k1, i1) => {
              return common_vendor.e(!_ctx.$slots.default ? {
                a: subitem.name
              } : {
                b: "d-" + i0 + "-" + i1,
                c: common_vendor.r("d", {
                  item: subitem
                }, i0 + "-" + i1)
              }, {
                d: subitem.id,
                e: common_vendor.unref(currentData).id === subitem.id && common_vendor.unref(currentKey) === item[_ctx.acceptKey] ? 1 : "",
                f: common_vendor.o(($event) => handleClickItem(item[_ctx.acceptKey], subitem), subitem.id)
              });
            }),
            c: [`elevator__item__${index}`],
            d: item[_ctx.acceptKey]
          };
        }),
        b: !_ctx.$slots.default,
        c: common_vendor.unref(scrollTop),
        d: isNaN(+_ctx.height) ? _ctx.height : `${_ctx.height}px`,
        e: common_vendor.o(listViewScroll, "71"),
        f: common_vendor.t(_ctx.indexList[common_vendor.unref(currentIndex)][_ctx.acceptKey]),
        g: !(common_vendor.unref(scrollY) > 2 && _ctx.isSticky) ? 1 : "",
        h: _ctx.indexList.length > 0
      }, _ctx.indexList.length > 0 ? {
        i: common_vendor.t(_ctx.indexList[common_vendor.unref(codeIndex)][_ctx.acceptKey]),
        j: !common_vendor.unref(scrollStart) ? 1 : ""
      } : {}, {
        k: common_vendor.f(_ctx.indexList, (item, index, i0) => {
          var _a, _b;
          return {
            a: common_vendor.t(item[_ctx.acceptKey]),
            b: item[_ctx.acceptKey],
            c: (item == null ? void 0 : item[_ctx.acceptKey]) === ((_b = (_a = _ctx.indexList) == null ? void 0 : _a[common_vendor.unref(currentIndex)]) == null ? void 0 : _b[_ctx.acceptKey]) ? 1 : "",
            d: index,
            e: common_vendor.o(($event) => handleClickIndex(item[_ctx.acceptKey]), item[_ctx.acceptKey])
          };
        }),
        l: common_vendor.o(
          //@ts-ignore
          (...args) => touchStart && touchStart(...args),
          "63"
        ),
        m: common_vendor.o(
          //@ts-ignore
          (...args) => touchMove && touchMove(...args),
          "6a"
        ),
        n: common_vendor.o(touchEnd, "22"),
        o: common_vendor.n(classes.value),
        p: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/elevator/elevator.js.map

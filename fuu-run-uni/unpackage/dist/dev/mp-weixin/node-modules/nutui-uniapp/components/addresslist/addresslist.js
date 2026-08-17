"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  (GeneralShell + NutButton)();
}
const NutButton = () => "../button/button.js";
const GeneralShell = () => "./compoents/generalshell.js";
const componentName = `${common_vendor.PREFIX}-address-list`;
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
  props: common_vendor.addresslistProps,
  emits: common_vendor.addresslistEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slots = common_vendor.useSlots();
    function hasSlot(name) {
      return Boolean(slots[name]);
    }
    const dataArray = common_vendor.ref([]);
    const dataInfo = common_vendor.reactive({
      id: 2,
      addressName: "姓名",
      phone: "123****4567",
      defaultAddress: false,
      fullAddress: "北京市通州区测试测试测试测试测试测试测试测试测试"
    });
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    function trowelData() {
      if (Object.keys(props.options).length > 0) {
        dataArray.value = props.data.map((item) => {
          return common_vendor.floatData(dataInfo, item, props.options);
        });
      }
    }
    common_vendor.watch(
      () => props.data,
      () => trowelData(),
      { deep: true }
    );
    function handleDelIconClick(event, item, index) {
      event.stopPropagation();
      emit("delIcon", event, item, index);
    }
    function handleEditIconClick(event, item, index) {
      event.stopPropagation();
      emit("editIcon", event, item, index);
    }
    function handleContentItemClick(event, item, index) {
      event.stopPropagation();
      emit("clickItem", event, item, index);
    }
    function handleLongCopyClick(event, item, index) {
      event.stopPropagation();
      emit("longCopy", event, item, index);
    }
    function handleLongSetClick(event, item, index) {
      event.stopPropagation();
      emit("longSet", event, item, index);
    }
    function handleLongDelClick(event, item, index) {
      event.stopPropagation();
      emit("longDel", event, item, index);
    }
    function handleSwipeDelClick(event, item, index) {
      event.stopPropagation();
      emit("swipeDel", event, item, index);
    }
    function handleAddressAdd(event) {
      event.stopPropagation();
      emit("add", event);
    }
    common_vendor.onMounted(() => {
      trowelData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(dataArray.value, (item, index, i0) => {
          return common_vendor.e({
            a: "itemInfos-" + i0,
            b: common_vendor.r("itemInfos", {
              item
            }, i0),
            c: "itemIcon-" + i0,
            d: common_vendor.r("itemIcon", {
              item
            }, i0),
            e: "itemAddr-" + i0,
            f: common_vendor.r("itemAddr", {
              item
            }, i0)
          }, props.longPress ? {
            g: "longpressBtns-" + i0,
            h: common_vendor.r("longpressBtns", {
              item
            }, i0)
          } : {}, props.swipeEdition ? {
            i: "swipeRight-" + i0,
            j: common_vendor.r("swipeRight", {
              item
            }, i0)
          } : {}, {
            k: index,
            l: common_vendor.o(($event) => handleDelIconClick($event, item, index), index),
            m: common_vendor.o(($event) => handleEditIconClick($event, item, index), index),
            n: common_vendor.o(($event) => handleContentItemClick($event, item, index), index),
            o: common_vendor.o(($event) => handleSwipeDelClick($event, item, index), index),
            p: common_vendor.o(($event) => handleLongCopyClick($event, item, index), index),
            q: common_vendor.o(($event) => handleLongSetClick($event, item, index), index),
            r: common_vendor.o(($event) => handleLongDelClick($event, item, index), index),
            s: "8212cd90-0-" + i0,
            t: common_vendor.p({
              address: item,
              ["long-press"]: props.longPress,
              ["swipe-edition"]: props.swipeEdition,
              ["use-content-info-slot"]: hasSlot("itemInfos"),
              ["use-content-icons-slot"]: hasSlot("itemIcon"),
              ["use-content-addrs-slot"]: hasSlot("itemAddr"),
              ["use-longpress-all-slot"]: hasSlot("longpressBtns"),
              ["use-swipe-right-btn-slot"]: hasSlot("swipeRight")
            })
          });
        }),
        b: props.longPress,
        c: props.swipeEdition,
        d: props.showBottomButton
      }, props.showBottomButton ? {
        e: common_vendor.t(common_vendor.unref(translate)("addAddress")),
        f: common_vendor.p({
          type: "danger",
          block: true
        }),
        g: common_vendor.o(handleAddressAdd, "8b")
      } : {}, {
        h: common_vendor.n(classes.value),
        i: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/addresslist/addresslist.js.map

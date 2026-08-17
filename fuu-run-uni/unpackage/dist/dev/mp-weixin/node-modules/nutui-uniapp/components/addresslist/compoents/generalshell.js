"use strict";
const common_vendor = require("../../../../../common/vendor.js");
if (!Math) {
  (ItemContents + NutButton + NutSwipe)();
}
const NutButton = () => "../../button/button.js";
const NutSwipe = () => "../../swipe/swipe.js";
const ItemContents = () => "./Itemcontents.js";
const componentName = `${common_vendor.PREFIX}-address-list-general`;
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
  props: {
    address: {
      type: Object
    },
    longPress: {
      type: Boolean,
      default: false
    },
    swipeEdition: {
      type: Boolean,
      default: false
    },
    useContentInfoSlot: Boolean,
    useContentIconsSlot: Boolean,
    useContentAddrsSlot: Boolean,
    useLongpressAllSlot: Boolean,
    useSwipeRightBtnSlot: Boolean
  },
  emits: ["delIcon", "editIcon", "clickItem", "longDown", "longCopy", "longSet", "longDel", "swipeDel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const moveRef = common_vendor.ref(false);
    const showMaskRef = common_vendor.ref(false);
    function handleDelIconClick(event) {
      event.stopPropagation();
      emit("delIcon", event, props.address);
    }
    function handleEditIconClick(event) {
      event.stopPropagation();
      emit("editIcon", event, props.address);
    }
    function handleItemClick(event) {
      event.stopPropagation();
      if (moveRef.value)
        return;
      emit("clickItem", event, props.address);
    }
    function handleLongDelClick(event) {
      event.stopPropagation();
      emit("longDel", event, props.address);
    }
    let timer = null;
    function destroyTimer() {
      if (timer == null)
        return;
      clearTimeout(timer);
      timer = null;
    }
    function startTimer(event) {
      timer = setTimeout(() => {
        showMaskRef.value = true;
        emit("longDown", event, props.address);
      }, 300);
    }
    function handleTouchStart(event) {
      startTimer(event);
    }
    function handleTouchMove() {
      destroyTimer();
    }
    function handleTouchEnd() {
      destroyTimer();
    }
    function handleHideMaskClick() {
      showMaskRef.value = false;
    }
    function handleLongCopyClick(event) {
      event.stopPropagation();
      emit("longCopy", event, props.address);
    }
    function handleLongSetClick(event) {
      event.stopPropagation();
      emit("longSet", event, props.address);
    }
    function handleMaskClick(event) {
      event.stopPropagation();
      event.preventDefault();
      if (timer != null) {
        showMaskRef.value = false;
      }
    }
    function handleSwipeDelClick(event) {
      event.stopPropagation();
      emit("swipeDel", event, props.address);
    }
    function handleSwipeStart() {
      moveRef.value = false;
    }
    function handleSwipeMove() {
      moveRef.value = true;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !props.swipeEdition
      }, !props.swipeEdition ? common_vendor.e({
        b: common_vendor.o(handleDelIconClick, "1b"),
        c: common_vendor.o(handleEditIconClick, "a4"),
        d: common_vendor.o(handleItemClick, "b3"),
        e: common_vendor.o(handleTouchStart, "3c"),
        f: common_vendor.o(handleTouchMove, "86"),
        g: common_vendor.o(handleTouchEnd, "ff"),
        h: common_vendor.p({
          item: props.address,
          ["use-content-top-slot"]: props.useContentInfoSlot,
          ["use-content-icon-slot"]: props.useContentIconsSlot,
          ["use-content-addr-slot"]: props.useContentAddrsSlot
        }),
        i: props.longPress && showMaskRef.value
      }, props.longPress && showMaskRef.value ? common_vendor.e({
        j: props.useLongpressAllSlot
      }, props.useLongpressAllSlot ? {} : {
        k: common_vendor.o(handleLongCopyClick, "fb"),
        l: common_vendor.o(handleLongSetClick, "04"),
        m: common_vendor.o(handleLongDelClick, "b1")
      }, {
        n: common_vendor.o(handleMaskClick, "e4")
      }) : {}, {
        o: showMaskRef.value
      }, showMaskRef.value ? {
        p: common_vendor.o(handleHideMaskClick, "77")
      } : {}) : common_vendor.e({
        q: common_vendor.o(handleDelIconClick, "ab"),
        r: common_vendor.o(handleEditIconClick, "46"),
        s: common_vendor.o(handleItemClick, "ea"),
        t: common_vendor.o(handleSwipeStart, "1d"),
        v: common_vendor.o(handleSwipeMove, "c0"),
        w: common_vendor.p({
          item: props.address,
          ["use-content-top-slot"]: props.useContentInfoSlot,
          ["use-content-icon-slot"]: props.useContentIconsSlot,
          ["use-content-addr-slot"]: props.useContentAddrsSlot
        }),
        x: props.useSwipeRightBtnSlot
      }, props.useSwipeRightBtnSlot ? {} : {
        y: common_vendor.o(handleSwipeDelClick, "8f"),
        z: common_vendor.p({
          shape: "square",
          ["custom-style"]: "height: 100%;",
          type: "danger"
        })
      }));
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/addresslist/compoents/generalshell.js.map

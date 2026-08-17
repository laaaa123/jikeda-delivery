"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  (NutButton + NutPopup)();
}
const NutButton = () => "../button/button.js";
const NutPopup = () => "../popup/popup.js";
const componentName = `${common_vendor.PREFIX}-dialog`;
const __default__ = common_vendor.defineComponent({
  name: componentName,
  inheritAttrs: false,
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
});
const { translate } = common_vendor.useTranslate(componentName);
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.dialogProps,
  emits: common_vendor.dialogEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const {
      contentStyle,
      showPopup,
      onClickOverlay,
      onCancel,
      onOk,
      classes,
      closed,
      dialogStatus,
      showDialog
    } = common_vendor.useDialog(props, emit);
    __expose({ showDialog, onOk, onCancel });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.$slots.header || common_vendor.unref(dialogStatus).title
      }, _ctx.$slots.header || common_vendor.unref(dialogStatus).title ? common_vendor.e({
        b: _ctx.$slots.header
      }, _ctx.$slots.header ? {} : {
        c: common_vendor.t(common_vendor.unref(dialogStatus).title || props.title)
      }) : {}, {
        d: _ctx.$slots.default
      }, _ctx.$slots.default ? {} : typeof _ctx.content === "string" ? {
        f: common_vendor.unref(dialogStatus).content || props.content
      } : {}, {
        e: typeof _ctx.content === "string",
        g: common_vendor.s(common_vendor.unref(contentStyle)),
        h: !common_vendor.unref(dialogStatus).noFooter
      }, !common_vendor.unref(dialogStatus).noFooter ? common_vendor.e({
        i: _ctx.$slots.footer
      }, _ctx.$slots.footer ? {} : common_vendor.e({
        j: !common_vendor.unref(dialogStatus).noCancelBtn
      }, !common_vendor.unref(dialogStatus).noCancelBtn ? {
        k: common_vendor.t(common_vendor.unref(dialogStatus).cancelText || props.cancelText || common_vendor.unref(translate)("cancel")),
        l: common_vendor.o(common_vendor.unref(onCancel), "f1"),
        m: common_vendor.p({
          size: "small",
          plain: true,
          type: "primary",
          ["custom-class"]: "nut-dialog__footer-cancel"
        })
      } : {}, {
        n: !common_vendor.unref(dialogStatus).noOkBtn
      }, !common_vendor.unref(dialogStatus).noOkBtn ? {
        o: common_vendor.t(common_vendor.unref(dialogStatus).okText || props.okText || common_vendor.unref(translate)("confirm")),
        p: common_vendor.o(common_vendor.unref(onOk), "4d"),
        q: common_vendor.p({
          size: "small",
          type: "primary",
          ["custom-class"]: "nut-dialog__footer-ok"
        })
      } : {}), {
        r: _ctx.footerDirection,
        s: common_vendor.unref(dialogStatus).footerDirection ? 1 : ""
      }) : {}, {
        t: common_vendor.n(common_vendor.unref(classes)),
        v: common_vendor.s(_ctx.customStyle),
        w: common_vendor.o(common_vendor.unref(onClickOverlay), "e1"),
        x: common_vendor.o(common_vendor.unref(closed), "a5"),
        y: common_vendor.o(($event) => common_vendor.isRef(showPopup) ? showPopup.value = $event : null, "5f"),
        z: common_vendor.p({
          ["close-on-click-overlay"]: false,
          ["lock-scroll"]: _ctx.lockScroll,
          ["pop-class"]: _ctx.popClass,
          ["overlay-class"]: _ctx.overlayClass,
          ["overlay-style"]: _ctx.overlayStyle,
          ["custom-style"]: _ctx.popStyle,
          ["z-index"]: _ctx.zIndex,
          round: true,
          transition: _ctx.transition,
          visible: common_vendor.unref(showPopup)
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/dialog/dialog.js.map

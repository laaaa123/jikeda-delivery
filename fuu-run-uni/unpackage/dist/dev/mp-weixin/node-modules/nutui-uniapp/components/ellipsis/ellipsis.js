"use strict";
const common_vendor = require("../../../../common/vendor.js");
const componentName = `${common_vendor.PREFIX}-ellipsis`;
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
  props: common_vendor.ellipsisProps,
  emits: common_vendor.ellipsisEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const instance = common_vendor.getCurrentInstance();
    const { query } = common_vendor.useSelectorQuery(instance);
    const refRandomId = common_vendor.getRandomId();
    const rootId = `root${refRandomId}`;
    const symbolContainId = `symbolContain${refRandomId}`;
    const rootContainId = `rootContain${refRandomId}`;
    const contantCopy = common_vendor.ref(props.content);
    let maxHeight = 0;
    let lineHeight = 0;
    let originHeight = 0;
    const ellipsis = common_vendor.reactive({});
    const widthRef = common_vendor.ref("auto");
    const state = common_vendor.reactive({
      exceeded: false,
      // 是否超出
      expanded: false
      // 是否折叠
    });
    let widthBase = [14, 10, 7, 8.4, 10];
    let symbolTextWidth = widthBase[0] * 0.7921;
    const chineseReg = /^[\u4E00-\u9FA5]+$/;
    const digitReg = /^\d+$/;
    const letterUpperReg = /^[A-Z]+$/;
    const letterLowerReg = /^[a-z]+$/;
    const classes = common_vendor.computed(() => {
      const prefixCls = componentName;
      return {
        ell: true,
        [prefixCls]: true
      };
    });
    const symbolText = common_vendor.computed(() => {
      if (props.direction === "end" || props.direction === "middle")
        return `${props.symbol}${props.expandText}`;
      return `${props.symbol}${props.expandText}${props.symbol}`;
    });
    common_vendor.onMounted(() => {
      setTimeout(() => {
        getSymbolInfo();
        getReference();
      }, 100);
    });
    async function getSymbolInfo() {
      const refe = await common_vendor.useRect(symbolContainId, instance);
      symbolTextWidth = refe.width ? Math.ceil(refe.width) : Math.ceil(widthBase[0] * 0.7921);
    }
    async function getReference() {
      query.select(rootId) && query.select(`#${rootId}`).fields(
        {
          computedStyle: ["width", "height", "lineHeight", "paddingTop", "paddingBottom", "fontSize"]
        },
        (res) => {
          lineHeight = pxToNumber(res.lineHeight === "normal" ? props.lineHeight : res.lineHeight);
          maxHeight = Math.floor(
            lineHeight * (Number(props.rows) + 0.5) + pxToNumber(res.paddingTop) + pxToNumber(res.paddingBottom)
          );
          originHeight = pxToNumber(res.height);
          widthRef.value = res.width;
          const bsize = pxToNumber(res.fontSize);
          widthBase = [bsize, bsize * 0.72, bsize * 0.53, bsize * 0.4, bsize * 0.75];
          calcEllipse();
        }
      ).exec();
    }
    async function calcEllipse() {
      const refe = await common_vendor.useRect(rootContainId, instance);
      if (refe.height <= maxHeight) {
        state.exceeded = false;
      } else {
        const rowNum = Math.floor(props.content.length / (originHeight / lineHeight - 1));
        if (props.direction === "middle") {
          const end = props.content.length;
          ellipsis.leading = tailorContent(0, rowNum * (Number(props.rows) + 0.5), "end");
          ellipsis.tailing = tailorContent(props.content.length - rowNum * (Number(props.rows) + 0.5), end, "start");
        } else if (props.direction === "end") {
          const end = rowNum * (Number(props.rows) + 0.5);
          ellipsis.leading = tailorContent(0, end);
        } else {
          const start = props.content.length - rowNum * (Number(props.rows) + 0.5) - 5;
          ellipsis.tailing = tailorContent(start, props.content.length);
        }
        assignContent();
        setTimeout(() => {
          verifyEllipsis();
        }, 100);
      }
    }
    async function verifyEllipsis() {
      var _a, _b;
      const refe = await common_vendor.useRect(rootContainId, instance);
      if (refe && refe.height && refe.height > maxHeight) {
        if (props.direction === "end")
          ellipsis.leading = (_a = ellipsis.leading) == null ? void 0 : _a.slice(0, ellipsis.leading.length - 1);
        else
          ellipsis.tailing = (_b = ellipsis.tailing) == null ? void 0 : _b.slice(1, ellipsis.tailing.length);
        assignContent();
        setTimeout(() => {
          verifyEllipsis();
        }, 100);
      }
    }
    function assignContent() {
      contantCopy.value = `${ellipsis.leading || ""}${ellipsis.leading ? props.symbol : ""}${props.expandText || ""}${ellipsis.tailing ? props.symbol : ""}${ellipsis.tailing || ""}`;
    }
    function tailorContent(left, right, type = "") {
      const threeDotWidth = symbolTextWidth;
      const direc = props.direction === "middle" && type ? type : props.direction;
      state.exceeded = true;
      let widthPart = -1;
      const start = left;
      const end = right;
      let cutoff = 0;
      let marking = 0;
      if (direc === "end") {
        marking = start;
        cutoff = end;
      } else {
        marking = end;
        cutoff = start;
      }
      const contentWidth = pxToNumber(widthRef.value) * Number(props.rows) - threeDotWidth;
      const contentPartWidth = props.direction === "middle" ? contentWidth / 2 : contentWidth;
      while (widthPart < contentPartWidth) {
        const zi = props.content[marking];
        if (chineseReg.test(zi))
          widthPart = Number(widthPart + widthBase[0]);
        else if (letterUpperReg.test(zi))
          widthPart = Number(widthPart + widthBase[1]);
        else if (letterLowerReg.test(zi))
          widthPart = Number(widthPart + widthBase[2]);
        else if (digitReg.test(zi))
          widthPart = Number(widthPart + widthBase[3]);
        else
          widthPart = Number(widthPart + widthBase[4]);
        cutoff = marking;
        direc === "end" ? marking++ : marking--;
      }
      if (direc === "end")
        return props.content.slice(0, cutoff);
      else
        return props.content.slice(cutoff, end);
    }
    function pxToNumber(value) {
      if (!value)
        return 0;
      const match = value.match(/^\d*(\.\d*)?/);
      return match ? Number(match[0]) : 0;
    }
    function clickHandle(type) {
      if (type === 1) {
        state.expanded = true;
        emit("change", "expand");
      } else {
        state.expanded = false;
        emit("change", "collapse");
      }
    }
    function handleClick() {
      emit(common_vendor.CLICK_EVENT);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !state.exceeded
      }, !state.exceeded ? {
        b: common_vendor.t(_ctx.content)
      } : {}, {
        c: state.exceeded && !state.expanded
      }, state.exceeded && !state.expanded ? common_vendor.e({
        d: common_vendor.t(ellipsis.leading),
        e: common_vendor.t(ellipsis.leading && _ctx.symbol),
        f: _ctx.expandText
      }, _ctx.expandText ? {
        g: common_vendor.t(_ctx.expandText),
        h: common_vendor.o(($event) => clickHandle(1), "ed")
      } : {}, {
        i: common_vendor.t(ellipsis.tailing && _ctx.symbol),
        j: common_vendor.t(ellipsis.tailing)
      }) : {}, {
        k: state.exceeded && state.expanded
      }, state.exceeded && state.expanded ? common_vendor.e({
        l: common_vendor.t(_ctx.content),
        m: _ctx.expandText
      }, _ctx.expandText ? {
        n: common_vendor.t(_ctx.collapseText),
        o: common_vendor.o(($event) => clickHandle(2), "62")
      } : {}) : {}, {
        p: rootId,
        q: common_vendor.n(classes.value),
        r: common_vendor.o(handleClick, "75"),
        s: common_vendor.t(contantCopy.value),
        t: rootContainId,
        v: widthRef.value,
        w: common_vendor.t(symbolText.value),
        x: symbolContainId,
        y: common_vendor.n(_ctx.customClass),
        z: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/ellipsis/ellipsis.js.map

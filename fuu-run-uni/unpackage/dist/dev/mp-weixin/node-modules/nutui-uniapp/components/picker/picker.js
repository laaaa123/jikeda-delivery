"use strict";
const common_vendor = require("../../../../common/vendor.js");
const __default__ = common_vendor.defineComponent({
  name: common_vendor.componentName,
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
});
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.pickerProps,
  emits: common_vendor.pickerEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const innerVisibleOptionNum = common_vendor.computed(() => {
      return Number(props.visibleOptionNum);
    });
    const innerOptionHeight = common_vendor.computed(() => {
      return Number(props.optionHeight);
    });
    const { translate } = common_vendor.useTranslate(common_vendor.componentName);
    const {
      changeHandler,
      confirm,
      defaultValues,
      defaultIndexes,
      delayDefaultIndexes,
      columnsList,
      columnFieldNames,
      classes,
      cancel,
      confirmHandler
    } = common_vendor.usePicker(props, emit);
    function componentWeapp() {
      const state = common_vendor.reactive({
        show: false,
        picking: false
      });
      const pickerViewStyles2 = common_vendor.computed(() => {
        const styles = {};
        styles.height = `${innerVisibleOptionNum.value * innerOptionHeight.value}px`;
        styles["--line-height"] = `${innerOptionHeight.value}px`;
        return styles;
      });
      const handleTileChange2 = (event) => {
        const indexes = event.detail.value;
        const prevIndexes = defaultIndexes.value;
        let changeIndex = 0;
        for (let i = 0; i < indexes.length; i++) {
          if (prevIndexes[i] !== indexes[i]) {
            changeIndex = i;
            break;
          }
        }
        changeHandler(changeIndex, columnsList.value[changeIndex][indexes[changeIndex]]);
      };
      const confirmHandler2 = () => {
        if (state.picking) {
          setTimeout(() => {
            confirm();
          }, 0);
        } else {
          confirm();
        }
      };
      const handlePickStart2 = () => {
        state.picking = true;
      };
      const handlePickEnd2 = () => {
        state.picking = false;
      };
      return {
        ...common_vendor.toRefs(state),
        pickerViewStyles: pickerViewStyles2,
        handleTileChange: handleTileChange2,
        confirmHandler: confirmHandler2,
        handlePickStart: handlePickStart2,
        handlePickEnd: handlePickEnd2
      };
    }
    const {
      confirmHandler: confirmHandlerMp,
      handleTileChange,
      handlePickStart,
      handlePickEnd,
      pickerViewStyles
    } = componentWeapp();
    function onConfirm() {
      confirmHandlerMp();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: props.showToolbar
      }, props.showToolbar ? {
        b: common_vendor.t(props.cancelText || common_vendor.unref(translate)("cancel")),
        c: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(cancel) && common_vendor.unref(cancel)(...args),
          "eb"
        ),
        d: common_vendor.t(props.title),
        e: common_vendor.t(props.okText || common_vendor.unref(translate)("confirm")),
        f: common_vendor.o(
          //@ts-ignore
          (...args) => onConfirm && onConfirm(...args),
          "9a"
        )
      } : {}, {
        g: common_vendor.f(common_vendor.unref(columnsList), (column, columnIndex, i0) => {
          return {
            a: common_vendor.f(column, (item, index, i1) => {
              return {
                a: common_vendor.t(item[common_vendor.unref(columnFieldNames).text]),
                b: item[common_vendor.unref(columnFieldNames).value] ? item[common_vendor.unref(columnFieldNames).value] : index
              };
            }),
            b: columnIndex
          };
        }),
        h: common_vendor.unref(common_vendor.pxCheck)(innerOptionHeight.value),
        i: common_vendor.s(common_vendor.unref(pickerViewStyles)),
        j: `height:${innerOptionHeight.value}px`,
        k: common_vendor.unref(delayDefaultIndexes),
        l: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(handleTileChange) && common_vendor.unref(handleTileChange)(...args),
          "3f"
        ),
        m: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(handlePickStart) && common_vendor.unref(handlePickStart)(...args),
          "61"
        ),
        n: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(handlePickEnd) && common_vendor.unref(handlePickEnd)(...args),
          "82"
        ),
        o: common_vendor.n(common_vendor.unref(classes)),
        p: common_vendor.s(props.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/picker/picker.js.map

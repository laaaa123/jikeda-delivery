"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  (NutIcon + NutElevator + NutPopup)();
}
const NutElevator = () => "../elevator/elevator.js";
const NutIcon = () => "../icon/icon.js";
const NutPopup = () => "../popup/popup.js";
const componentName = `${common_vendor.PREFIX}-address`;
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
  props: common_vendor.addressProps,
  emits: common_vendor.addressEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    const showPopup = common_vendor.ref(props.visible);
    const privateType = common_vendor.ref(props.type);
    const tabIndex = common_vendor.ref(0);
    const prevTabIndex = common_vendor.ref(0);
    const tabName = common_vendor.ref(["province", "city", "country", "town"]);
    const scrollDis = common_vendor.ref([0, 0, 0, 0]);
    const scrollTop = common_vendor.ref(0);
    const regionData = common_vendor.reactive([]);
    const regionList = common_vendor.computed(() => {
      switch (tabIndex.value) {
        case 0:
          return props.province;
        case 1:
          return props.city;
        case 2:
          return props.country;
        default:
          return props.town;
      }
    });
    function transformData(data) {
      if (!Array.isArray(data))
        throw new TypeError("params muse be array.");
      if (!data.length)
        return [];
      data.forEach((item) => {
        if (!item.title)
          common_vendor.index.__f__("warn", "at node_modules/nutui-uniapp/components/address/address.vue:52", "[NutUI] <Address> 请检查数组选项的 title 值是否有设置 ,title 为必填项 .");
      });
      const newData = [];
      data = data.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      data.forEach((item) => {
        const index = newData.findIndex((value) => value.title === item.title);
        if (index <= -1) {
          newData.push({
            title: item.title,
            list: [].concat(item)
          });
        } else {
          newData[index].list.push(item);
        }
      });
      return newData;
    }
    const selectedRegion = common_vendor.ref([]);
    let selectedExistAddress = common_vendor.reactive({});
    const closeWay = common_vendor.ref("self");
    function initCustomSelected() {
      regionData[0] = props.province || [];
      regionData[1] = props.city || [];
      regionData[2] = props.country || [];
      regionData[3] = props.town || [];
      const defaultValue = props.modelValue;
      const num = defaultValue.length;
      if (num > 0) {
        tabIndex.value = num - 1;
        if (regionList.value.length === 0) {
          tabIndex.value = 0;
          return;
        }
        for (let index = 0; index < num; index++) {
          const arr = regionData[index];
          selectedRegion.value[index] = arr.filter((item) => item.id === defaultValue[index])[0];
        }
        scrollTo();
      }
    }
    function getTabName(item, index) {
      if (item && item.name)
        return item.name;
      if (tabIndex.value < index && item)
        return item.name;
      else
        return props.columnsPlaceholder[index] || translate("select");
    }
    function handClose(type = "self") {
      closeWay.value = type === "cross" ? "cross" : "self";
      showPopup.value = false;
    }
    function clickOverlay() {
      closeWay.value = "mask";
    }
    function nextAreaList(item) {
      var _a;
      const tab = tabIndex.value;
      prevTabIndex.value = tabIndex.value;
      const callBackParams = {
        custom: tabName.value[tab]
      };
      selectedRegion.value[tab] = item;
      selectedRegion.value.splice(tab + 1, selectedRegion.value.length - (tab + 1));
      callBackParams.value = item;
      if (((_a = regionData[tab + 1]) == null ? void 0 : _a.length) > 0) {
        tabIndex.value = tab + 1;
        callBackParams.next = tabName.value[tabIndex.value];
        scrollToTop();
      } else {
        handClose();
        emit(common_vendor.UPDATE_MODEL_EVENT);
      }
      emit(common_vendor.CHANGE_EVENT, callBackParams);
    }
    function changeRegionTab(item, index) {
      prevTabIndex.value = tabIndex.value;
      if (getTabName(item, index)) {
        tabIndex.value = index;
        scrollTo();
      }
    }
    function scrollChange(e) {
      scrollDis.value[tabIndex.value] = e.detail.scrollTop;
    }
    function scrollToTop() {
      scrollTop.value += 1;
      common_vendor.requestAniFrame(() => {
        setTimeout(() => {
          scrollTop.value = 0.01;
        }, 100);
      });
    }
    function scrollTo() {
      scrollTop.value += 1;
      common_vendor.requestAniFrame(() => {
        setTimeout(() => {
          scrollTop.value = scrollDis.value[tabIndex.value];
        }, 10);
      });
    }
    function selectedExist(item) {
      const copyExistAdd = props.existAddress;
      let prevExistAdd = {};
      copyExistAdd.forEach((list) => {
        if (list && list.selectedAddress)
          prevExistAdd = list;
        list.selectedAddress = false;
      });
      item.selectedAddress = true;
      selectedExistAddress = item;
      emit(common_vendor.SELECTED_EVENT, prevExistAdd, item, copyExistAdd);
      handClose();
    }
    function initAddress() {
      selectedRegion.value = [];
      tabIndex.value = 0;
      scrollTo();
    }
    function close() {
      const data = {
        addressIdStr: "",
        addressStr: "",
        province: selectedRegion.value[0],
        city: selectedRegion.value[1],
        country: selectedRegion.value[2],
        town: selectedRegion.value[3]
      };
      const callBackParams = {
        data: {},
        type: privateType.value
      };
      if (["custom", "custom2"].includes(privateType.value)) {
        [0, 1, 2, 3].forEach((i) => {
          const item = selectedRegion.value[i];
          data.addressIdStr += `${i ? "_" : ""}${item && item.id || 0}`;
          data.addressStr += item && item.name || "";
        });
        callBackParams.data = data;
      } else {
        callBackParams.data = selectedExistAddress;
      }
      initAddress();
      if (closeWay.value === "self")
        emit(common_vendor.CLOSE_EVENT, callBackParams);
      else
        emit("closeMask", { closeWay: closeWay.value });
      emit(common_vendor.UPDATE_VISIBLE_EVENT, false);
    }
    function switchModule() {
      const type = privateType.value;
      privateType.value = type === "exist" ? "custom" : "exist";
      initAddress();
      emit("switchModule", { type: privateType.value });
    }
    function handleElevatorItem(key, item) {
      nextAreaList(item);
    }
    common_vendor.watch(
      () => props.visible,
      (value) => {
        showPopup.value = value;
      }
    );
    common_vendor.watch(
      () => showPopup.value,
      (value) => {
        if (value)
          initCustomSelected();
      }
    );
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.type === "exist" && privateType.value === "custom"
      }, _ctx.type === "exist" && privateType.value === "custom" ? {
        b: common_vendor.p({
          name: "left",
          size: "14px"
        })
      } : {}, {
        c: common_vendor.o(switchModule, "53"),
        d: common_vendor.t(privateType.value === "custom" ? _ctx.customAddressTitle || common_vendor.unref(translate)("selectRegion") : _ctx.existAddressTitle || common_vendor.unref(translate)("deliveryTo")),
        e: common_vendor.p({
          name: "close",
          ["custom-color"]: "#cccccc",
          size: "14px"
        }),
        f: common_vendor.o(($event) => handClose("cross"), "b3"),
        g: ["custom", "custom2"].includes(privateType.value)
      }, ["custom", "custom2"].includes(privateType.value) ? common_vendor.e({
        h: common_vendor.f(selectedRegion.value, (item, index, i0) => {
          return {
            a: common_vendor.t(getTabName(item, index)),
            b: index === tabIndex.value ? 1 : "",
            c: index,
            d: common_vendor.n(index === tabIndex.value ? "active" : ""),
            e: common_vendor.o(($event) => changeRegionTab(item, index), index)
          };
        }),
        i: tabIndex.value === selectedRegion.value.length
      }, tabIndex.value === selectedRegion.value.length ? {
        j: common_vendor.t(getTabName(null, selectedRegion.value.length))
      } : {}, {
        k: privateType.value === "custom"
      }, privateType.value === "custom" ? {
        l: common_vendor.f(regionList.value, (item, index, i0) => {
          var _a, _b, _c;
          return common_vendor.e({
            a: ((_a = selectedRegion.value[tabIndex.value]) == null ? void 0 : _a.id) === item.id
          }, ((_b = selectedRegion.value[tabIndex.value]) == null ? void 0 : _b.id) === item.id ? {
            b: "2c514708-3-" + i0 + ",2c514708-0",
            c: common_vendor.p({
              name: "Check",
              ["custom-class"]: "nut-address-select-icon",
              width: "13px"
            })
          } : {}, {
            d: common_vendor.t(item.name),
            e: index,
            f: common_vendor.n(((_c = selectedRegion.value[tabIndex.value]) == null ? void 0 : _c.id) === item.id ? "active" : ""),
            g: common_vendor.o(($event) => nextAreaList(item), index)
          });
        }),
        m: scrollTop.value,
        n: common_vendor.o(scrollChange, "0a")
      } : {
        o: common_vendor.o(handleElevatorItem, "c6"),
        p: common_vendor.p({
          height: _ctx.height,
          ["index-list"]: transformData(regionList.value)
        })
      }) : privateType.value === "exist" ? common_vendor.e({
        r: common_vendor.f(_ctx.existAddress, (item, index, i0) => {
          return common_vendor.e({
            a: !item.selectedAddress
          }, !item.selectedAddress ? {
            b: "2c514708-5-" + i0 + ",2c514708-0",
            c: common_vendor.p({
              name: "location2",
              ["custom-class"]: "nut-address-select-icon",
              width: "13px"
            })
          } : {}, {
            d: item.selectedAddress
          }, item.selectedAddress ? {
            e: "2c514708-6-" + i0 + ",2c514708-0",
            f: common_vendor.p({
              name: "Check",
              ["custom-class"]: "nut-address-select-icon",
              width: "13px"
            })
          } : {}, {
            g: item.name && item.phone
          }, item.name && item.phone ? {
            h: common_vendor.t(item.name),
            i: common_vendor.t(item.phone)
          } : {}, {
            j: common_vendor.t(item.provinceName + item.cityName + item.countyName + item.townName + item.addressDetail),
            k: index,
            l: common_vendor.n(item.selectedAddress ? "active" : ""),
            m: common_vendor.o(($event) => selectedExist(item), index)
          });
        }),
        s: _ctx.isShowCustomAddress
      }, _ctx.isShowCustomAddress ? {
        t: common_vendor.t(_ctx.customAndExistTitle || common_vendor.unref(translate)("chooseAnotherAddress")),
        v: common_vendor.o(switchModule, "ed")
      } : {}, {
        w: !_ctx.isShowCustomAddress
      }, !_ctx.isShowCustomAddress ? {} : {}) : {}, {
        q: privateType.value === "exist",
        x: common_vendor.n(classes.value),
        y: common_vendor.s(_ctx.customStyle),
        z: common_vendor.o(close, "af"),
        A: common_vendor.o(clickOverlay, "f8"),
        B: common_vendor.o(($event) => closeWay.value = "self", "22"),
        C: common_vendor.o(($event) => showPopup.value = $event, "47"),
        D: common_vendor.p({
          ["z-index"]: _ctx.zIndex,
          position: "bottom",
          ["lock-scroll"]: _ctx.lockScroll,
          round: _ctx.round,
          visible: showPopup.value
        })
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/address/address.js.map
